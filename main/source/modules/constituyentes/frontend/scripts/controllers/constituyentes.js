angular.module('bag2.constituyentes', [])
.controller('ConstituyentesCtrl', function($scope, EstadoConstituyentes, $routeParams, TipoConstituyentes, EstadisticasConstituyentes, $rootScope, Constituyentes, $location, $timeout, $window, cleanObject, $http, SituacionConstituyentes) {
    $scope.puedeModificar = function() {
        return true;//arrayContains($scope.user.permissions, 'actualizarConstituyentes') || arrayContains($scope.user.permissions, 'master');
    };
    $scope.puedeModificarProcuracion = function() {
        return true;//arrayContains($scope.user.permissions, 'actualizarProcuracion') || arrayContains($scope.user.permissions, 'master');
    };
        
    /*
     *  Empieza la carga de marker en el mapa by Roberto
     */
    var limpio = document.getElementById("mapaPrincipal1").innerHTML=null;
    $scope.mConstituyentes = []; // Crea array vacio de en donde se guardaran los markers
    var validar = usig.NormalizadorDirecciones.init(); // Normalizador de direccion para la funcion que valida las direcciones en la DB
   
    var datoConstituyentes = Constituyentes.query(function(){
        angular.forEach(datoConstituyentes, function(x) {
            $scope.cargarArrays(x)
        });
    });
  
    $scope.cargarMapa = function(tipo){
        $scope.miMapa = new usig.MapaInteractivo('mapaPrincipal1', {
            //rootUrl: '//servicios.usig.buenosaires.gov.ar/usig-js/3.1/',
            zoomBar: true,
            onReady: function() {
                $scope.cargarMarkers(tipo);
            }
        }); 
    }
    /*
     *  Validar direccion
     */     
    $scope.validarDireccion = function(direccion) {
        
        try {
            var opts = validar.normalizar(direccion, 10);
            return 1;
        } catch (error) {
            return 0;
        }
    }
    /*
     *  Cargar Markers
     */     
    $scope.cargarMarkers = function(tipo) {
        angular.forEach($scope.mConstituyentes, function(x) {
            if(tipo){
                if(x.situacion == tipo){
                    x.ide = $scope.miMapa.addMarker(x.direccion, true, {
                        iconUrl: x.marker,
                        iconWidth: 38,
                        iconHeight: 50
                    });                
                }           
            } else {
                x.ide = $scope.miMapa.addMarker(x.direccion, true, {
                    iconUrl: x.marker,
                    iconWidth: 38,
                    iconHeight: 50
                });         
            }
        });
    }
    /*
     *  Cargar Arrays
     */     
    $scope.cargarArrays = function(x) {
        var markerColor = $scope.buscarMarker(x);
        var direccion = $scope.buscarDireccion(x);
        var validado = $scope.validarDireccion(direccion);
        if(validado != 0) {
            $scope.mConstituyentes.push({
                ideM: x._id,
                situacion: x.situacion,
                direccion: direccion,
                marker: markerColor,
                ide: null
            });   
        }
    }
    /*
     *  Buscar direcciones
     */     
    $scope.buscarMarker = function(x) {
        if(x.situacion == 'En obra'){
            return 'http://10.79.5.120:8080/components/mapa/images/marker_azul.png';
        } else if(x.situacion == 'Transferidos AUSA'){
            return 'http://10.79.5.120:8080/components/mapa/images/marker_verde.png';
        } else if(x.situacion == 'Inmuebles a recuperar') {
            return 'http://10.79.5.120:8080/components/mapa/images/marker.png';
        } else if(x.situacion == 'A expropiar') {
            return 'http://10.79.5.120:8080/components/mapa/images/marker_gris.png';
        }
    }
    /*
     *  Buscar color del Marker
     */     
    $scope.buscarDireccion = function(obra) {
        if(obra.calle) {
            if(obra.altura) {
                return obra.calle +' '+ obra.altura;
            } else {
                if(obra.cruce) {
                    return obra.calle + ' y ' + obra.cruce;
                } else {
                    return 0;
                }
            }
        } else {
            return 0;
        }
    }
    /*
     *  Oculta todos los markers menos el seleccionado osea en de DETALLE
     */
     $scope.mostrarMarkerDetalle = function(id){
        angular.forEach($scope.mConstituyentes, function(x) {
            if(x.ide){
                if(x.ideM != id){
                    $scope.miMapa.toggleMarker(x.ide, false);
                }
            }
//            console.log(x.ide);
        });
     }
    var porPonderacion = true;
    
    $('#myCarousel').carousel();
        
    $scope.$on('print', function() {
        var result = $.param($routeParams);
        
      var outString = result;
          while (true) {
            var idx = outString.indexOf('+');
            if (idx == -1) {
              break;
            }
            outString = outString.substring(0, idx) + '%20' +
              outString.substring(idx + '+'.length);
          }

        $location.url('/constituyentes/print?' + outString);
    });

    $scope.modificar = function() {
        if ($scope.espacioSeleccionado) {
            $scope.editando = true;
            $scope.editandoProcuracion = false;
            $scope.uploaded = [];
        }
    };
    
    $scope.modificarProcuracion = function() {
        if ($scope.espacioSeleccionado) {
            $scope.editando = false;
            $scope.editandoProcuracion = true;
            $scope.uploaded = [];
        }
    };
        
    $scope.uploaded = [];
    $scope.$watch('uploaded[0].id', function(newValue) {
        if (!newValue) {
            return;
        }
        if ($scope.espacioSeleccionado) {
            if ($scope.espacioSeleccionado.fotos === undefined) {
                $scope.espacioSeleccionado.fotos = [];
            }
            $scope.espacioSeleccionado.fotos.push($scope.uploaded.shift().id);
        }
    });

    $scope.cancelar = function() {
        $scope.editando = false;
        $scope.editandoProcuracion = false;
        $scope.seleccionado = false;
        $scope.existeFoto = false;
        $scope.espacioSeleccionado = null;
    };
    
    $scope.reordenar = function() {
        if (porPonderacion) {
            $scope.situaciones.sort(function(a, b) {
                return b.progressFactor - a.progressFactor;
            });
            porPonderacion = false;
            $scope.factorOrden = "Por ponderación";
        } else {
            $scope.situaciones.sort(function(a, b) {
                return b.total - a.total;
            });
            porPonderacion = true;
            $scope.factorOrden = "Por progreso";
        }
    };
        
    $scope.$on('volver', function() {
        $scope.seleccionado = false;
        $scope.existeFoto = false;
        angular.forEach($scope.mConstituyentes, function(x) {
            if(x.ide){
                if(x.ideM != $scope.espacioSeleccionado._id){
                    $scope.miMapa.toggleMarker(x.ide, true);
                }
            }
        });
        $scope.espacioSeleccionado = null;
        $scope.listado = $scope.espacios;
    });

    $scope.seleccionar = function(e) {
        $scope.espacioSeleccionado = e;
        $scope.mostrarMarkerDetalle(e._id);
    };
    
    function findFirst(source, test) {
        for (var i = 0; i < source.length; i++) {
            if (test(source[i])) {
                return source[i];
            }
        }
    
        return null;
    }
        
    $scope.agregarObser = function(confirmado, data) {
        if (confirmado) {
            $scope.espacioSeleccionado.observaciones.push(data);
            //showAlert('Se agrego una observación');
        }
        else {
            $scope.data = {
                observaciones: '',
                tipoObservacion: 'relevamiento'
            };
            $("#agregarObservacion").modal('show');
        }
    };
        
    $scope.$on('selectionChanged', function(scope, selectedIndexes) {
        $scope.espaciosVista.selectedIndexes = selectedIndexes;

        if ($scope.espaciosVista && $scope.espaciosVista.selectedIndexes && $scope.espaciosVista.selectedIndexes.length === 1) {
            $scope.espacioSeleccionado = angular.copy($scope.espaciosVista.features[$scope.espaciosVista.selectedIndexes[0]]);
        }
        else {
            $scope.espacioSeleccionado = null;
        }

        var listado = [];

        if (selectedIndexes.length > 0) {
            selectedIndexes.forEach(function(index) {
                listado.push($scope.espacios[index]);
            });
        }
        else {
            listado = $scope.espacios;
        }

        $scope.listado = listado;
    });

        

    $scope.ordenar = function(e) {};

    $scope.porcentaje = function(a, b) {
        var porcentaje = a / b * 100;
        return porcentaje.toFixed(2);
    };
    
    
    $scope.eliminarElemento = function(array,elemento) {
        var indice = array.indexOf(elemento);
        if(indice!=-1) array.splice(indice, 1);
    };
            
        

    $scope.situaciones = SituacionConstituyentes.query(function() {
        $scope.situaciones.sort(function(a, b) {
            a.total = 0;
            b.total = 0;
            return b.weight - a.weight;
        });
        $scope.situacionesDict = {};
        $scope.situacionesNombres = [];
        $scope.situaciones.forEach(function(item) {
            $scope.situacionesDict[item._id] = item;
            $scope.situacionesNombres.push(item.nombre);
        });
        $scope.reordenar();
        
        $scope.todosEspacios = Constituyentes.query(function() {
            var progreso = 0;
            
            $scope.todosEspacios.forEach(function(item) {
                if (!item.wkt) item.wkt = item.geom;
                var sit = findFirst($scope.situaciones, function(situacion) {
                    return item.situacion == situacion.nombre;
                });

                if (sit) {
                    if (sit.total) {
                        sit.total += 1;
                    }
                    else {
                        sit.total = 1;
                    }
                    
                    progreso += sit.progressFactor;
                }
                
                if ($routeParams.id === item._id){
                    $scope.espacioSeleccionado = item;
                }
            });
                            
            $scope.progreso = progreso / $scope.todosEspacios.length * 100;
        });
        
    
        //Para mantener actualizada las estadísticas
        var fe = new Date();
        var estadisticasMuestro = [];
        var valores = [];
        var mesActual = (fe.getMonth() +1) + "/" + fe.getFullYear();
        var existeEstadistica = false;
        var estadisticas = EstadisticasConstituyentes.query(function() {
            estadisticas.forEach(function(item) {
                if (item.fecha === mesActual) {
                    existeEstadistica = true;
                }
                if (valores.indexOf(item.porcentaje) == -1) {
                    valores.push(item.porcentaje);
                    estadisticasMuestro.push(item);
                }
            });
            if (!existeEstadistica) {
                var estadisticaNueva = new EstadisticasConstituyentes();
                estadisticaNueva.fecha = mesActual;
                estadisticaNueva.porcentaje = $scope.progreso.toFixed(0);
                estadisticaNueva.$save();
            }
            
            $scope.data = [{
                values: estadisticasMuestro,
                key: "Indicadores",
                nombre: ""
            }];
            
            $scope.options = {
                chart: {
                    type: 'discreteBarChart',
                    height: 180,
                    width: 350,
                    margin : {
                        top: 10,
                        right: 20,
                        bottom: 20,
                        left: 30
                    },
                    noData: 'Sin datos',
                    x: function(d){return d.fecha;},
                    y: function(d){return parseInt(d.porcentaje);},
                    showValues: false,
                    showXAxis: false,
                    valueFormat: function(d){
                        return d;
                    },
                    transitionDuration: 500,
                    xAxis: {
                    },
                    yAxis: {
                        tickFormat: function (v) {
                            return v + '%';
                        },
                        max: 100,
                        axisLabelDistance: 30
                    }
                }
            };
        });
            
            
        $scope.estados = EstadoConstituyentes.query(function() {
            $scope.estadosNombres = [];
            $scope.estados.forEach(function(item) {
                $scope.estadosNombres.push(item.nombre);
            });
            $scope.tipos = TipoConstituyentes.query(function() {
                $scope.tiposNombres = [];
                $scope.tipos.forEach(function(item) {
                    $scope.tiposNombres.push(item.nombre);
                });
                
                $scope.espacios = Constituyentes.query($routeParams,
                    function() {
                    if($routeParams.situacion){
                        if($routeParams.situacion){
                            $scope.cargarMapa($routeParams.situacion);
                        }  
                    } else {
                        $scope.cargarMapa(null);
                    }
                    $scope.espacios.sort(function(a, b) {
                        return a.altura - b.altura;
                    });

                    $scope.listado = $scope.espacios;

                    $scope.espacios.forEach(function(item) {
                        if ((!item.wkt) && item.geom) {
                            item.wkt = item.geom;
                            delete item.geom;
                        }

                        var sit = findFirst($scope.situaciones, function(situacion) {
                            return item.situacion == situacion.nombre;
                        });

                        if (sit) {
                            item.attributes = {
                                colorSituacion: sit.color
                            };
                        }
                    });

                    function includeByNombre(arr, obj) {
                        for (var i = 0; i < arr.length; i++) {
                            if (arr[i].nombre == obj) return true;
                        }
                    }
                    
                    $scope.guardar = function() {
                        $scope.espacioSeleccionado.situacion = $('#situacion-typeahead').val();
                        $scope.espacioSeleccionado.tipo = $('#tipo-typeahead').val();
                        $scope.espacioSeleccionado.estado = $('#estado-typeahead').val();
                        if (includeByNombre($scope.situaciones, $scope.espacioSeleccionado.situacion)) {
                            if (includeByNombre($scope.tipos, $scope.espacioSeleccionado.tipo)) {
                                if (includeByNombre($scope.estados, $scope.espacioSeleccionado.estado)) {
                                    var f = new Date();
                                    $scope.espacioSeleccionado.fechaUltimaModificacion = (f.getDate() + "/" + (f.getMonth() +1) + "/" + f.getFullYear());
                                    $scope.espacioSeleccionado.$save(function() {
                                        $scope.editando = false;
                                        $scope.editandoProcuracion = false;
                                        for (var x = 0; $scope.espacios.length; x++) {
                                            if ($scope.espacios[x]._id === $scope.espacioSeleccionado._id) {
                                                $scope.espacios[x] = $scope.espacioSeleccionado;
                                                break;
                                            }
                                        }
                                    });
                                    $scope.editando = false;
                                    $scope.editandoProcuracion = false;
                                }
                                else {
                                    alert('No es un estado válido');
                                }
                            }
                            else {
                                alert('No es un tipo válido');
                            }
                        }
                        else {
                            alert('No es una situacion válida');
                        }
                    };
                });
            });
        });

    });
        
        
    $scope.color = function(situacion) {
        var color;
            $scope.situaciones.forEach(function(sit) {
                    if (sit.nombre === situacion) {
                        color = sit.color;
                    }
            });
        return color;
    };
/*
        $http.get('/api/tracking-changes/constituyentes/all').success(function(data) {
            $scope.trackingAllChanges = data.isTracking;
        });

        $scope.$watch('espacioSeleccionado', function() {
            if ($scope.espacioSeleccionado) {
                $http.get('/api/tracking-changes/constituyentes/' + $scope.espacioSeleccionado._id).success(function(data) {
                    $scope.trackingChanges = data.isTracking;
                });
            }
        });

        $scope.trackChanges = function() {
            if ($scope.espacioSeleccionado) {
                $http.post('/api/tracking-changes/constituyentes/' + $scope.espacioSeleccionado._id).success(function(data) {
                    $scope.trackingChanges = data.isTracking;
                });
            }
        };

        $scope.trackAllChanges = function() {
            $http.post('/api/tracking-changes/constituyentes/all').success(function(data) {
                $scope.trackingAllChanges = data.isTracking;
            });
        };*/
}).controller('ConstituyentesPrintCtrl', function($scope, EstadoConstituyentes, $routeParams, TipoConstituyentes, $rootScope, Constituyentes, $location, $timeout, $window, cleanObject, $http, SituacionConstituyentes) {
    var checkCanvas = function() {
            if ($scope.tilesLoaded && $scope.featuresLoaded) {
                $timeout(function() {
                    $scope.printReady = true;
                }, 2000);
            }
        };

        $scope.$on("tilesloaded", function() {
            $scope.tilesLoaded = true;
            checkCanvas();
        });

        $window.document.title = 'Constituyentes';


        $scope.porcentaje = function(a, b) {
            var porcentaje = a / b * 100;
            return porcentaje.toFixed(2);
        };
        
        function findFirst(source, test) {
            for (var i = 0; i < source.length; i++) {
                if (test(source[i])) {
                    return source[i];
                }
            }
        
            return null;
        }

        $scope.situaciones = SituacionConstituyentes.query(function() {
            $scope.situaciones.sort(function(a, b) {
                a.total = 0;
                b.total = 0;
                return b.weight - a.weight;
            });
            $scope.situacionesDict = {};
            $scope.situacionesNombres = [];
            $scope.situaciones.forEach(function(item) {
                $scope.situacionesDict[item._id] = item;
                $scope.situacionesNombres.push(item.nombre);
            });


            $scope.todosEspacios = Constituyentes.query(function() {
                $scope.enProgreso = 0;

                $scope.todosEspacios.forEach(function(item) {
                    var sit = findFirst($scope.situaciones, function(situacion) {
                        return item.situacion == situacion.nombre;
                    });

                    if (sit) {
                        if (sit.total) {
                            sit.total += 1;
                        }
                        else {
                            sit.total = 1;
                        }

                        if (sit.progress) {
                            $scope.enProgreso += 1;
                        }
                    }
                });
            });

            $scope.estados = EstadoConstituyentes.query(function() {
                $scope.estadosNombres = [];
                $scope.estados.forEach(function(item) {
                    $scope.estadosNombres.push(item.nombre);
                });
                $scope.tipos = TipoConstituyentes.query(function() {
                    $scope.tiposNombres = [];
                    $scope.tipos.forEach(function(item) {
                        $scope.tiposNombres.push(item.nombre);
                    });
                    $scope.espacios = Constituyentes.query($routeParams,

                    function() {
                        $scope.espacios.sort(function(a, b) {
                            return a.altura - b.altura;
                        });

                        $scope.listado = $scope.espacios;

                        $scope.espacios.forEach(function(item) {
                            if ((!item.wkt) && item.geom) {
                                item.wkt = item.geom;
                                delete item.geom;
                            }

                            var sit = findFirst($scope.situaciones, function(situacion) {
                                return item.situacion == situacion.nombre;
                            });

                            if (sit) {
                                item.attributes = {
                                    colorSituacion: sit.color
                                };
                            }
                        });

                        function includeByNombre(arr, obj) {
                            for (var i = 0; i < arr.length; i++) {
                                if (arr[i].nombre == obj) return true;
                            }
                        }
                    });
                });
            });
        });
});