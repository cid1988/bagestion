angular.module('bag2.regularizaciondominial', [])
.controller('RegularizacionDominialCtrl', function($scope, TipoRegularizacionDominial, BarrioRegularizacionDominial, Comuna, ORMOrganigrama, $routeParams, $rootScope, RegularizacionDominial, $location, $timeout, $window, cleanObject, $http) {
    $scope.puedeModificar = function() {
        return true; //arrayContains($scope.user.permissions, 'actualizarRegularizacionDominial') || arrayContains($scope.user.permissions, 'master');
    };
    var lipio = document.getElementById("mapaPrincipal").innerHTML='';
    $scope.miMapa = new usig.MapaInteractivo('mapaPrincipal', {
        //rootUrl: '//servicios.usig.buenosaires.gov.ar/usig-js/3.1/',
        zoomBar: true,
        onReady: function() {
        }
    }); 
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

        $location.url('/regularizacionDominial/print?' + outString);
    });

    $scope.modificar = function() {
        if ($scope.dominioSeleccionado) {
            $scope.editando = true;
            $scope.uploaded = [];
        }
    };
    
    $scope.organigramaPorId = function (id) {
      for (var i = 0; i < $scope.dependencias.length; i++) {
          if ($scope.dependencias[i]._id == id)
          {
              return $scope.dependencias[i];
          }
      }  
    };

    $scope.cancelar = function() {
        $scope.editando = false;
        $scope.seleccionado = false;
        $scope.existeFoto = false;
        $scope.dominioSeleccionado = null;
    };

    $scope.$on('volver', function() {
        $scope.seleccionado = false;
        $scope.existeFoto = false;
        $scope.dominioSeleccionado = null;
        $scope.listado = $scope.dominios;
        $scope.dominiosVista = {
            features: $scope.dominios,
            currentTool: 'boxselect',
            selectedIndexes: [],
            extent: extent,
            style: styles
        };
    });

    $scope.seleccionar = function(e) {
        $scope.dominioSeleccionado = e;
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
            $scope.dominioSeleccionado.observaciones.push(data);
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
        $scope.dominiosVista.selectedIndexes = selectedIndexes;

        if ($scope.dominiosVista && $scope.dominiosVista.selectedIndexes && $scope.dominiosVista.selectedIndexes.length === 1) {
            $scope.dominioSeleccionado = angular.copy($scope.dominiosVista.features[$scope.dominiosVista.selectedIndexes[0]]);
        }
        else {
            $scope.dominioSeleccionado = null;
        }

        var listado = [];

        if (selectedIndexes.length > 0) {
            selectedIndexes.forEach(function(index) {
                listado.push($scope.dominios[index]);
            });
        }
        else {
            listado = $scope.dominios;
        }

        $scope.listado = listado;
    });

    var styles = {
        pointRadius: 5,
        fillColor: "${colorTipo}",
        zIndex: 1
    };
    // Cometado de mapa anterior
    /*$scope.dominiosVista = {
        features: [],
        currentTool: 'boxselect',
        selectedIndexes: [],
        extent: extent,
        style: styles
    };*/

   /* $scope.$watch('[dominios, dominioSeleccionado] | json', function() {
       if ($scope.dominioSeleccionado) {
            $scope.dominiosVista = {
                features: [$scope.dominioSeleccionado],
                currentTool: 'none',
                selectedIndexes: [],
                extent: extent,
                style: styles
            };
        }
        else {
            $scope.dominiosVista = {
                features: $scope.dominios,
                currentTool: 'boxselect',
                selectedIndexes: $scope.dominiosVista.selectedIndexes,
                extent: extent,
                style: styles
            };
        }
    });*/

    $scope.ordenar = function(e) {};

    $scope.porcentaje = function(a, b) {
        var porcentaje = a / b * 100;
        return porcentaje.toFixed(2);
    };
    
    $scope.eliminarElemento = function(array,elemento) {
        var indice = array.indexOf(elemento);
        if(indice!=-1) array.splice(indice, 1);
    };
    
    
    $scope.comunas = Comuna.query(function() {
        $scope.comunas.sort(function(a, b) {
            a.total = 0;
            b.total = 0;
            return b.weight - a.weight;
        });
        $scope.comunasDict = {};
        $scope.comunasNombres = [];
        $scope.comunas.forEach(function(item) {
            $scope.comunasDict[item._id] = item;
            $scope.comunasNombres.push(item.nombre);
        });
    });
    
    
    $scope.dependencias = ORMOrganigrama.query(function() {
        $scope.dependencias.sort(function(a, b) {
            a.total = 0;
            b.total = 0;
            return b.weight - a.weight;
        });
        $scope.dependenciasDict = {};
        $scope.dependenciasNombres = [];
        $scope.dependencias.forEach(function(item) {
            $scope.dependenciasDict[item._id] = item;
            $scope.dependenciasNombres.push(item.nombreCorto);
        });
    });
        
    $scope.barrios = BarrioRegularizacionDominial.query(function() {
        $scope.barrios.sort(function(a, b) {
            a.total = 0;
            b.total = 0;
            return b.weight - a.weight;
        });
        $scope.barriosDict = {};
        $scope.barriosNombres = [];
        $scope.barrios.forEach(function(item) {
            $scope.barriosDict[item._id] = item;
            $scope.barriosNombres.push(item.nombre);
        });
    });
    
    $scope.tipos = TipoRegularizacionDominial.query(function() {
        $scope.tipos.sort(function(a, b) {
            a.total = 0;
            b.total = 0;
            return b.weight - a.weight;
        });
        $scope.tiposDict = {};
        $scope.tiposNombres = [];
        $scope.tipos.forEach(function(item) {
            $scope.tiposDict[item._id] = item;
            $scope.tiposNombres.push(item.nombre);
        });
        
        
        $scope.todosDominios = RegularizacionDominial.query(function() {
            $scope.enProgreso = 0;
            $scope.orden = ['ordenPrioridad','utiu','denominacion'];
            $scope.todosDominios.forEach(function(item) {
                
                var tip = findFirst($scope.tipos, function(tipo) {
                    return item.tipo == tipo.nombre;
                });

                if (tip) {
                    if (tip.total) {
                        tip.total += 1;
                    }
                    else {
                        tip.total = 1;
                    }
                    
                    if (tip.progress) {
                        $scope.enProgreso += 1;
                    }
                }
                
                var barr = findFirst($scope.barrios, function(barrio) {
                    return item.barrio == barrio.nombre;
                });

                if (barr) {
                    if (barr.total) {
                        barr.total += 1;
                    }
                    else {
                        barr.total = 1;
                    }
                }
                
                if ($routeParams.id === item._id){
                    $scope.dominioSeleccionado = item;
                }
                
                var com = findFirst($scope.comunas, function(comuna) {
                    return item.comuna == comuna.nombre;
                });

                if (com) {
                    if (com.total) {
                        com.total += 1;
                    }
                    else {
                        com.total = 1;
                    }
                }
                
                if ($routeParams.id === item._id){
                    $scope.dominioSeleccionado = item;
                }
            });
        });

        $scope.dominios = RegularizacionDominial.query($routeParams,
            function() {
            $scope.dominios.sort(function(a, b) {
                return a.altura - b.altura;
            });

            $scope.listado = $scope.dominios;

            $scope.dominios.forEach(function(item) {
                if (item.prioridad == "A+") {
                    item.ordenPrioridad = 0;
                } else if (item.prioridad == "A") {
                    item.ordenPrioridad = 1;
                } else if (item.prioridad == "B") {
                    item.ordenPrioridad = 2;
                } else if (item.prioridad == "C") {
                    item.ordenPrioridad = 3;
                } else {
                    item.ordenPrioridad = 4;
                }
                
                if ((!item.wkt) && item.geom) {
                    item.wkt = item.geom;
                    delete item.geom;
                }

                var tip = findFirst($scope.tipos, function(tipo) {
                    return item.tipo == tipo.nombre;
                });

                if (tip) {
                    item.attributes = {
                        colorTipo: tip.color
                    };
                }
            });

            function includeByNombre(arr, obj) {
                for (var i = 0; i < arr.length; i++) {
                    //alert(arr[i].nombre, " - ", obj);
                    if (arr[i].nombre == obj) return true;
                }
            }

            $scope.guardar = function() {
                $scope.dominioSeleccionado.barrio = $('#barrio-typeahead').val();
                $scope.dominioSeleccionado.tipo = $('#tipo-typeahead').val();
                $scope.dominioSeleccionado.comuna = $('#comuna-typeahead').val();
                $scope.dominioSeleccionado.calle = $('#calle-typeahead').val();
                $scope.dominioSeleccionado.dependencia = $('#dependencia-typeahead').val();
                if (includeByNombre($scope.tipos, $scope.dominioSeleccionado.tipo)) {
                            $scope.dominioSeleccionado.$save(function() {
                                $scope.editando = false;
                                
                                for (var x = 0; $scope.dominios.length; x++) {
                                    if ($scope.dominios[x]._id === $scope.dominioSeleccionado._id) {
                                        $scope.dominios[x] = $scope.dominioSeleccionado;
                                        break;
                                    }
                                }
                            });
                }
                else {
                    alert('No es una tipo válida');
                }
            };
        });
    });


    $scope.color = function(tipo) {
        var color;
            $scope.tipos.forEach(function(tip) {
                    if (tip.nombre === tipo) {
                        color = tip.color;
                    }
            });
        return color;
    };
})
.controller('ReporteRegularizacionDominialCtrl', function($scope, $location, $http, PageTracking, $modal, $routeParams) {
	$scope.accesos = PageTracking.query({
        $or:JSON.stringify([
            {data:{$regex: '/regularizacionDominial.*'}},
        ])
	});
    $scope.orden = '-date';
    
    $scope.masCero = function (numero) {
        if (numero < 10) {
            return ("0" + numero);
        } else {
            return numero;
        }
    };
    
    $scope.milisegundosAFecha = function (milliseconds) {
        var d = new Date(milliseconds);
        return ($scope.masCero(d.getDate()) + "/" + $scope.masCero(d.getMonth() + 1) + "/" + d.getFullYear() + " - " + $scope.masCero(d.getHours()) + ":" + $scope.masCero(d.getMinutes()));
    };
})
.controller('RegularizacionDominialPrintCtrl', function($scope, TipoRegularizacionDominial, $routeParams, RegularizacionDominial, $rootScope, $location, $timeout, $window, cleanObject, $http) {
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

    $window.document.title = 'Regularizacion Dominial';
    // Cometado de mapa anterior
    /*var extent = new OpenLayers.Bounds(-6534946.2544514, -4127372.9915975, -6481058.14952, -4096798.1802889);
    var styles = {
        'default': {
            pointRadius: 5,
            fillColor: "${colorTipo}",
            zIndex: 1
        }
    };

    $scope.dominiosVista = {
        features: [],
        currentTool: 'none',
        selectedIndexes: [],
        extent: extent,
        styles: styles,
        noControls: true
    };

    $scope.$watch('dominios', function() {
        $scope.dominiosVista = {
            features: $scope.dominios,
            currentTool: 'none',
            selectedIndexes: $scope.dominiosVista.selectedIndexes,
            extent: extent,
            styles: styles
        };

        $scope.featuresLoaded = true;
    });*/

    $scope.porcentaje = function(a, b) {
        var porcentaje = a / b * 100;
        return porcentaje.toFixed(2);
    };

    $scope.tipos = TipoRegularizacionDominial.query(function() {
        $scope.tipos.sort(function(a, b) {
            a.total = 0;
            b.total = 0;
            return b.weight - a.weight;
        });
        $scope.tiposDict = {};
        $scope.tiposNombres = [];
        $scope.tipos.forEach(function(item) {
            $scope.tiposDict[item._id] = item;
            $scope.tiposNombres.push(item.nombre);
        });


        $scope.todosDominios = RegularizacionDominial.query(function() {
            $scope.enProgreso = 0;

            $scope.todosDominios.forEach(function(item) {
                var tip = findFirst($scope.tipos, function(tipo) {
                    return item.tipo == tipo.nombre;
                });

                if (tip) {
                    if (tip.total) {
                        tip.total += 1;
                    }
                    else {
                        tip.total = 1;
                    }

                    if (tip.progress) {
                        $scope.enProgreso += 1;
                    }
                }
            });
        });

        $scope.dominios = RegularizacionDominial.query($routeParams,
            function() {
                $scope.dominios.sort(function(a, b) {
                    return a.altura - b.altura;
                });

                $scope.listado = $scope.dominios;

                $scope.dominios.forEach(function(item) {
                    if ((!item.wkt) && item.geom) {
                        item.wkt = item.geom;
                        delete item.geom;
                    }

                    var tip = findFirst($scope.tipos, function(tipo) {
                        return item.tipo == tipo.nombre;
                    });

                    if (tip) {
                        item.attributes = {
                            colorTipo: tip.color
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
}).controller('NuevaRegularizacionDominialCtrl', function($scope, TipoRegularizacionDominial, $routeParams, Comuna, Contactos, $modal, ORMTema, ORMOrganigrama, BarrioRegularizacionDominial, RegularizacionDominial, $rootScope, $location, $timeout, $window, cleanObject, $http) {
    $scope.dominio = new RegularizacionDominial({
        planDeObraCumplido: 'no',
        fotos: [],
        observaciones: [],
        geoms: []
    });
    
    $scope.dataH = {
        proyecto : '',
        descripcionMeta : '',
        cantidad : '',
        unidad : ''
    };
    
    $scope.dataSMP = {
        seccion : '',
        manzana : '',
        parcela : ''
    };
    
    $scope.uploaded = [];
    $scope.uploadedJudicial = [];
    $scope.uploadedNormativa = [];
    
    $scope.tab = "identificacion";
    $scope.prioridades = ["A+", "A", "B", "C"];
	$scope.contactos = Contactos.listar();
	$scope.temas = ORMTema.query();
    
    $scope.comunas = Comuna.query(function() {
        $scope.comunas.sort(function(a, b) {
            a.total = 0;
            b.total = 0;
            return b.weight - a.weight;
        });
        $scope.comunasDict = {};
        $scope.comunasNombres = [];
        $scope.comunas.forEach(function(item) {
            $scope.comunasDict[item._id] = item;
            $scope.comunasNombres.push(item.nombre);
        });
    });
    $scope.dependencias = ORMOrganigrama.query(function() {
        $scope.dependencias.sort(function(a, b) {
            a.total = 0;
            b.total = 0;
            return b.weight - a.weight;
        });
        $scope.dependenciasDict = {};
        $scope.dependenciasNombres = [];
        $scope.dependencias.forEach(function(item) {
            $scope.dependenciasDict[item._id] = item;
            $scope.dependenciasNombres.push(item.nombreCorto);
        });
    });
    
    $scope.mostrarTema = function (r) {
        if (r.eliminado) {
            return false; 
        } else {
            return true;
        }
    };
    
    $scope.tipos = TipoRegularizacionDominial.query(function() {
        $scope.tipos.sort(function(a, b) {
            a.total = 0;
            b.total = 0;
            return b.weight - a.weight;
        });
        $scope.tiposDict = {};
        $scope.tiposNombres = [];
        $scope.tipos.forEach(function(item) {
            $scope.tiposDict[item._id] = item;
            $scope.tiposNombres.push(item.nombre);
        });
    });
    
    $scope.barrios = BarrioRegularizacionDominial.query(function() {
        $scope.barrios.sort(function(a, b) {
            a.total = 0;
            b.total = 0;
            return b.weight - a.weight;
        });
        $scope.barriosDict = {};
        $scope.barriosNombres = [];
        $scope.barrios.forEach(function(item) {
            $scope.barriosDict[item._id] = item;
            $scope.barriosNombres.push(item.nombre);
        });
    });
    
    $scope.eliminarListaElem = function(elemento, lista) {
        lista.splice(lista.indexOf(elemento), 1);
    };
    
    $scope.abrirModalImagenUsig = function(s, m, p) {
        $modal({
            template: '/views/regularizacionDominial/abrirModalImagenUsig.html',
            show: true,
            backdrop: 'static',
            scope: angular.extend($scope.$new(), {
                s : s,
                m : m,
                p : p
            })
        });
    };
    
    //Agregar calles
    $scope.agregarCalle = function(dataCalle) {
        if (!$scope.dominio.poligonoCalles) {
            $scope.dominio.poligonoCalles = [];
            $scope.agregarCalle(dataCalle);
        }
        else {
            $scope.dominio.poligonoCalles.push(dataCalle.calle);
        }
    };
    
    function includeByNombre(arr, obj) {
        for (var i = 0; i < arr.length; i++) {
            //alert(arr[i].nombre, " - ", obj);
            if (arr[i].nombre == obj) return true;
        }
    }
    
    $scope.$watch("dominio.smp.length", function () {
        $scope.calcularSupTotal();
    });
    
    $scope.calcularSupTotal = function () {
        if (!$scope.dominio.smp) return;
	    $scope.superficieTotalUsig = 0;
        angular.forEach($scope.dominio.smp, function (b){
            var parcela = b.seccion + "-" + b.manzana + "-" + b.parcela;
            $http.post("/api/usig/consultar-smp", {smp: parcela})
            .success(function (dataUsig) {
                if (dataUsig.info.info_alfanumerica.superficie_total) {
                    $scope.superficieTotalUsig = $scope.superficieTotalUsig + parseInt(dataUsig.info.info_alfanumerica.superficie_total);
                }
            });
            
        });
    };
                    
    $scope.guardar = function() {
        $scope.dominio.barrio = $('#barrio-typeahead').val();
        $scope.dominio.tipo = $('#tipo-typeahead').val();
        $scope.dominio.comuna = $('#comuna-typeahead').val();
        $scope.dominio.calle = $('#calle-typeahead').val();
        $scope.dominio.dependencia = $('#dependencia-typeahead').val();
        if (includeByNombre($scope.tipos, $scope.dominio.tipo)) {
            $scope.dominio.$save(function(data) {
                //showAlert('Se ha guardado con éxito');
                $location.path('/regularizacionDominial');
            });
        }
        else {
            alert('No es una tipo válida');
        }
    };
    
    $scope.$on('selectionChanged', function(scope, selectedIndexes) {
            $scope.dominiosVista.selectedIndexes = selectedIndexes;

            if ($scope.dominiosVista && $scope.dominiosVista.selectedIndexes && $scope.dominiosVista.selectedIndexes.length === 1) {
                $scope.dominio = angular.copy($scope.dominiosVista.features[$scope.dominiosVista.selectedIndexes[0]]);
            }
            else {
                $scope.dominio = null;
            }
        });
    // Cometado de mapa anterior       
    /*$scope.dominiosVista = {
        features: [],
        extent: new OpenLayers.Bounds(-6534946.2544514, -4127372.9915975, -6481058.14952, -4096798.1802889),
        currentTool: 'pan',
        markers: [],
        style: {}
    };*/

    $scope.$on('newextent', function(event, extent) {
        $scope.dominiosVista.extent = extent;
    });
    
    $scope.agregarPorWkt = function(wkt, nombre, ubicacion) {
        var marker = {
            wkt: wkt,
            src: '/views/regularizacionDominial/default.png',
            size: {
                x: 15,
                w: 20
            },
            offset: {
                x: -8,
                y: -20
            }
        };
        
        $scope.dominio.wkt = wkt;
        
        $scope.dominiosVista.markers.push(marker);

        $timeout(function() {
            $scope.$apply();
        });
    };

    $scope.$on('newFeature', function(data, feature, wkt) {
        $scope.agregarPorWkt(wkt);
    });

    $scope.punto = function() {
        $scope.dominiosVista.currentTool = 'point';
    };
    $scope.mover = function() {
        $scope.dominiosVista.currentTool = 'pan';
    };
    $scope.seleccionar = function() {
        $scope.dominiosVista.currentTool = 'boxselect';
    };

    $scope.comentario = function(data) {
        $scope.data = data;
        $("#comentarioGestion").modal('show');
    };
    
    $scope.contactoPorId = function (id) {
      for (var i = 0; i < $scope.contactos.length; i++) {
          if ($scope.contactos[i]._id == id)
          {
              return $scope.contactos[i];
          }
      }  
    };
    
    $scope.organigramaPorId = function (id) {
      for (var i = 0; i < $scope.dependencias.length; i++) {
          if ($scope.dependencias[i]._id == id)
          {
              return $scope.dependencias[i];
          }
      }  
    };
    
    $scope.temaPorId = function (id) {
      for (var i = 0; i < $scope.temas.length; i++) {
          if ($scope.temas[i]._id == id)
          {
              return $scope.temas[i];
          }
      }  
    };
    
    $scope.contarParcelas = function(tipo) {
        var cantidad = 0;
        if ($scope.dominio.smp) {
            $scope.dominio.smp.forEach(function(smp) {
                if (smp.instancia == tipo) {
                    cantidad = cantidad + 1;
                }
            });
        }
        return cantidad;
    };
    
    $scope.contarHogares = function(tipo) {
        var cantidad = 0;
        if ($scope.dominio.smp) {
            $scope.dominio.smp.forEach(function(smp) {
                if (smp.hogares) {
                    if (tipo == "todos") {
                        cantidad = cantidad + parseInt(smp.hogares);
                    } else if (smp.instancia == tipo) {
                        cantidad = cantidad + parseInt(smp.hogares);
                    }
                }
            });
        }
        return cantidad;
    };
    
    $scope.contarManzanas = function(tipo) {
        var manzanas = [];
        if ($scope.dominio.smp) {
            $scope.dominio.smp.forEach(function(smp) {
                if (smp.manzana) {
                    if (tipo == "todos") {
                        if (manzanas.indexOf((smp.seccion + smp.manzana))==-1) {
                            manzanas.push((smp.seccion + smp.manzana));
                        }
                    } else if (smp.instancia == tipo) {
                        if (manzanas.indexOf((smp.seccion + smp.manzana))==-1) {
                            manzanas.push((smp.seccion + smp.manzana));
                        }
                    }
                }
            });
        }
        return manzanas.length;
    };
    
    //Agregar temas
    $scope.agregarTema = function(dataTema) {
        if (!$scope.dominio.temas) {
            $scope.dominio.temas = [];
        }
        $scope.dominio.temas.push(dataTema);
        $scope.dataTema = "";
    };
    
    //Agregar responsables
    $scope.agregarResponsable = function(dataRespon) {
        if (!$scope.dominio.responsableDominio) {
            $scope.dominio.responsableDominio = [];
        }
        $scope.dominio.responsableDominio.push(dataRespon);
        $scope.dataRespon = "";
    };
    
    $scope.agregarResponsableCarac = function(dataResponCarac) {
        if (!$scope.dominio.responsableCaracteristicas) {
            $scope.dominio.responsableCaracteristicas = [];
        }
        $scope.dominio.responsableCaracteristicas.push(dataResponCarac);
        $scope.dataResponCarac = "";
    };
    
    $scope.agregarResponsableHici = function(dataResponHici) {
        if (!$scope.dominio.responsableHicimos) {
            $scope.dominio.responsableHicimos = [];
        }
        $scope.dominio.responsableHicimos.push(dataResponHici);
        $scope.dataResponHici = "";
    };
    
    $scope.agregarResponsableConso = function(dataResponConso) {
        if (!$scope.dominio.responsableConsolidacion) {
            $scope.dominio.responsableConsolidacion = [];
        }
        $scope.dominio.responsableConsolidacion.push(dataResponConso);
        $scope.dataResponConso = "";
    };
    
    $scope.agregarResponsableRegu = function(dataResponRegu) {
        if (!$scope.dominio.responsableRegularizacion) {
            $scope.dominio.responsableRegularizacion = [];
        }
        $scope.dominio.responsableRegularizacion.push(dataResponRegu);
        $scope.dataResponRegu = "";
    };
    
    $scope.agregarResponsableRespon = function(dataResponRespon) {
        if (!$scope.dominio.responsableResponsables) {
            $scope.dominio.responsableResponsables = [];
        }
        $scope.dominio.responsableResponsables.push(dataResponRespon);
        $scope.dataResponRespon = "";
    };
    
    $scope.agregarResponsableArchi = function(dataResponArchi) {
        if (!$scope.dominio.responsableArchivos) {
            $scope.dominio.responsableArchivos = [];
        }
        $scope.dominio.responsableArchivos.push(dataResponArchi);
        $scope.dataResponArchi = "";
    };
    
    $scope.agregarHicimos = function() {
        if (!$scope.dominio.hicimos) {
            $scope.dominio.hicimos = [];
        }
        $scope.dominio.hicimos.push($scope.dataH);
        $scope.dataH = {
            proyecto : '',
            descripcionMeta : '',
            cantidad : '',
            unidad : '',
            jurisdiccion : '',
            fechaInicio : '',
            fechaFin : ''
        };
    };
    
    $scope.agregarSMP = function() {
        if (!$scope.dominio.smp) {
            $scope.dominio.smp = [];
        }
        $scope.dominio.smp.push($scope.dataSMP);
        $scope.dataSMP = {
            seccion : '',
            manzana : '',
            parcela : '',
            hogares : ''
        };
    };
    
    $scope.agregarSMPModal = function() {
        $("#agregarSMP").modal('show');
    };
    
    $scope.marcarSMPModal = function(tipo) {
        if (tipo == 'NC') {
            $scope.nc = true;
            $scope.c = false;
            $scope.vs = false;
            $scope.pr = false;
            $scope.r = false;
        } else if (tipo == 'C') {
            $scope.nc = false;
            $scope.c = true;
            $scope.vs = false;
            $scope.pr = false;
            $scope.r = false;
        } else if (tipo == 'VS') {
            $scope.nc = false;
            $scope.c = false;
            $scope.vs = true;
            $scope.pr = false;
            $scope.r = false;
        } else if (tipo == 'PR') {
            $scope.nc = false;
            $scope.c = false;
            $scope.vs = false;
            $scope.pr = true;
            $scope.r = false;
        } else if (tipo == 'R') {
            $scope.nc = false;
            $scope.c = false;
            $scope.vs = false;
            $scope.pr = false;
            $scope.r = true;
        }
        $("#marcarSMP").modal('show');
    };
    
    
    $scope.agregarFotografia = function(confirmado, data) {
        if (confirmado) {
            data.fotoId = $scope.uploaded.shift().id;
            $scope.dominio.fotos.push(data);
            //showAlert('Se agrego una observación');
        }
        else {
            if ($scope.dominio.fotos === undefined) {
                $scope.dominio.fotos = [];
            }
            var modalScope = $scope.$new();
            
            modalScope.data = {
                descripcion: '',
                fecha: undefined,
                fuente: ''
            };
            $modal({template: '/views/regularizacionDominial/agregarFoto.html', persist: true, show: true, backdrop: 'static', scope: modalScope});
        }
    };
    
    $scope.agregarDocumentacionJudi = function(confirmado, data) {
        if (confirmado) {
            data.archivoId = $scope.uploadedJudicial.shift().id;
            $scope.dominio.documentosJudicial.push(data);
            //showAlert('Se agrego una observación');
        }
        else {
            if ($scope.dominio.documentosJudicial === undefined) {
                $scope.dominio.documentosJudicial = [];
            }
            var modalScope = $scope.$new();
            
            modalScope.data = {
                descripcion: '',
                fecha: undefined,
                fuente: ''
            };
            $modal({template: '/views/regularizacionDominial/agregarDocumentoJudicial.html', persist: true, show: true, backdrop: 'static', scope: modalScope});
        }
    };
    
    $scope.agregarDocumentacionNorm = function(confirmado, data) {
        if (confirmado) {
            data.archivoId = $scope.uploadedNormativa.shift().id;
            $scope.dominio.documentosNormativa.push(data);
            //showAlert('Se agrego una observación');
        }
        else {
            if ($scope.dominio.documentosNormativa === undefined) {
                $scope.dominio.documentosNormativa = [];
            }
            var modalScope = $scope.$new();
            
            modalScope.data = {
                descripcion: '',
                fecha: undefined,
                fuente: ''
            };
            $modal({template: '/views/regularizacionDominial/agregarDocumentoNormativa.html', persist: true, show: true, backdrop: 'static', scope: modalScope});
        }
    };
}).controller('DetalleRegularizacionDominialCtrl', function($scope, TipoRegularizacionDominial, $routeParams, User, Contactos, Comuna, $modal, ORMTema, ORMOrganigrama, BarrioRegularizacionDominial, RegularizacionDominial, $rootScope, $location, $timeout, $window, cleanObject, $http) {
    $scope.dominio = RegularizacionDominial.get({_id: $routeParams.id}, function() {
    	$scope.usuarios = User.query({}, function() {
             $scope.usuarios.forEach(function(item) {
                if (item.username == $scope.username)
                {
                    $scope.usuario = item.idContacto;
                }
            });
    	    $scope.tienePermiso($scope.dominio.responsableDominio, $scope.hasPermission('regularizacionDominial.edicionIdentificacion'));
    	}); 
    });
    
    $scope.tab = "identificacion";
    $scope.editando = false;
    $scope.prioridades = ["A+", "A", "B", "C"];
	$scope.contactos = Contactos.listar();
	$scope.temas = ORMTema.query();
    
    $scope.dataH = {
        proyecto : '',
        descripcionMeta : '',
        cantidad : '',
        unidad : ''
    };
    
    $scope.dataSMP = {
        seccion : '',
        manzana : '',
        parcela : ''
    };
    
    $scope.uploaded = [];
    $scope.uploadedJudicial = [];
    $scope.uploadedNormativa = [];

    $scope.comentario = function(data) {
        $scope.data = data;
        $("#comentarioGestion").modal('show');
    };
    
    $scope.mostrarTema = function (r) {
        if (r.eliminado) {
            return false; 
        } else {
            return true;
        }
    };
        
    $scope.comunas = Comuna.query(function() {
        $scope.comunas.sort(function(a, b) {
            a.total = 0;
            b.total = 0;
            return b.weight - a.weight;
        });
        $scope.comunasDict = {};
        $scope.comunasNombres = [];
        $scope.comunas.forEach(function(item) {
            $scope.comunasDict[item._id] = item;
            $scope.comunasNombres.push(item.nombre);
        });
    });
    $scope.dependencias = ORMOrganigrama.query(function() {
        $scope.dependencias.sort(function(a, b) {
            a.total = 0;
            b.total = 0;
            return b.weight - a.weight;
        });
        $scope.dependenciasDict = {};
        $scope.dependenciasNombres = [];
        $scope.dependencias.forEach(function(item) {
            $scope.dependenciasDict[item._id] = item;
            $scope.dependenciasNombres.push(item.nombreCorto);
        });
    });
    
    $scope.tipos = TipoRegularizacionDominial.query(function() {
        $scope.tipos.sort(function(a, b) {
            a.total = 0;
            b.total = 0;
            return b.weight - a.weight;
        });
        $scope.tiposDict = {};
        $scope.tiposNombres = [];
        $scope.tipos.forEach(function(item) {
            $scope.tiposDict[item._id] = item;
            $scope.tiposNombres.push(item.nombre);
        });
    });
    
    $scope.barrios = BarrioRegularizacionDominial.query(function() {
        $scope.barrios.sort(function(a, b) {
            a.total = 0;
            b.total = 0;
            return b.weight - a.weight;
        });
        $scope.barriosDict = {};
        $scope.barriosNombres = [];
        $scope.barrios.forEach(function(item) {
            $scope.barriosDict[item._id] = item;
            $scope.barriosNombres.push(item.nombre);
        });
    });
    
    $scope.tienePermiso = function (responsables, permisoIndividual) {
        if (permisoIndividual) {
            $scope.permisoPestana = true;
        } else if (responsables) {
            if (responsables.indexOf($scope.usuario)>-1) {
                $scope.permisoPestana = true;
            } else if ($scope.dominio.responsableDominio) {
                if ($scope.dominio.responsableDominio.indexOf($scope.usuario)>-1) {
                    $scope.permisoPestana = true;
                } else {
                    $scope.permisoPestana = false;
                    if (!$scope.hasPermission('regularizacionDominial.edicion')) {
                        $scope.editando = false;
                    }
                }
            } else {
                $scope.permisoPestana = false;
                if (!$scope.hasPermission('regularizacionDominial.edicion')) {
                    $scope.editando = false;
                }
            }
        } else {
            if ($scope.dominio.responsableDominio) {
                if ($scope.dominio.responsableDominio.indexOf($scope.usuario)>-1) {
                    $scope.permisoPestana = true;
                } else {
                    $scope.permisoPestana = false;
                    if (!$scope.hasPermission('regularizacionDominial.edicion')) {
                        $scope.editando = false;
                    }
                }
            } else {
                $scope.permisoPestana = false;
                if (!$scope.hasPermission('regularizacionDominial.edicion')) {
                    $scope.editando = false;
                }
            }
        }
    };
    
    $scope.permisoResponsable = function () {
        if ($scope.hasPermission('regularizacionDominial.edicion')) {
            return true;
        } else if ($scope.dominio.responsableDominio) {
            if ($scope.dominio.responsableDominio.indexOf($scope.usuario)>-1) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    };

    
    $scope.abrirModalImagenUsig = function(s, m, p) {
        $modal({
            template: '/views/regularizacionDominial/abrirModalImagenUsig.html',
            show: true,
            backdrop: 'static',
            scope: angular.extend($scope.$new(), {
                s : s,
                m : m,
                p : p
            })
        });
    };
    
    //$scope.tienePermiso($scope.dominio.responsableDominio);
    
    $scope.contactoPorId = function (id) {
      for (var i = 0; i < $scope.contactos.length; i++) {
          if ($scope.contactos[i]._id == id)
          {
              return $scope.contactos[i];
          }
      }  
    };
    
    $scope.temaPorId = function (id) {
      for (var i = 0; i < $scope.temas.length; i++) {
          if ($scope.temas[i]._id == id)
          {
              return $scope.temas[i];
          }
      }  
    };
    
    //Agregar temas
    $scope.agregarTema = function(dataTema) {
        if (!$scope.dominio.temas) {
            $scope.dominio.temas = [];
        }
        $scope.dominio.temas.push(dataTema);
        $scope.dataTema = "";
    };
    
    //Agregar responsables
    $scope.agregarResponsable = function(dataRespon) {
        if (!$scope.dominio.responsableDominio) {
            $scope.dominio.responsableDominio = [];
        }
        $scope.dominio.responsableDominio.push(dataRespon);
        $scope.dataRespon = "";
    };
    
    $scope.agregarResponsableCarac = function(dataResponCarac) {
        if (!$scope.dominio.responsableCaracteristicas) {
            $scope.dominio.responsableCaracteristicas = [];
        }
        $scope.dominio.responsableCaracteristicas.push(dataResponCarac);
        $scope.dataResponCarac = "";
    };
    
    $scope.agregarResponsableHici = function(dataResponHici) {
        if (!$scope.dominio.responsableHicimos) {
            $scope.dominio.responsableHicimos = [];
        }
        $scope.dominio.responsableHicimos.push(dataResponHici);
        $scope.dataResponHici = "";
    };
    
    $scope.agregarResponsableConso = function(dataResponConso) {
        if (!$scope.dominio.responsableConsolidacion) {
            $scope.dominio.responsableConsolidacion = [];
        }
        $scope.dominio.responsableConsolidacion.push(dataResponConso);
        $scope.dataResponConso = "";
    };
    
    $scope.agregarResponsableRegu = function(dataResponRegu) {
        if (!$scope.dominio.responsableRegularizacion) {
            $scope.dominio.responsableRegularizacion = [];
        }
        $scope.dominio.responsableRegularizacion.push(dataResponRegu);
        $scope.dataResponRegu = "";
    };
    
    $scope.agregarResponsableRespon = function(dataResponRespon) {
        if (!$scope.dominio.responsableResponsables) {
            $scope.dominio.responsableResponsables = [];
        }
        $scope.dominio.responsableResponsables.push(dataResponRespon);
        $scope.dataResponRespon = "";
    };
    
    $scope.agregarResponsableArchi = function(dataResponArchi) {
        if (!$scope.dominio.responsableArchivos) {
            $scope.dominio.responsableArchivos = [];
        }
        $scope.dominio.responsableArchivos.push(dataResponArchi);
        $scope.dataResponArchi = "";
    };
    
    $scope.agregarHicimos = function() {
        if (!$scope.dominio.hicimos) {
            $scope.dominio.hicimos = [];
        }
        $scope.dominio.hicimos.push($scope.dataH);
        $scope.dataH = {
            proyecto : '',
            descripcionMeta : '',
            cantidad : '',
            unidad : '',
            jurisdiccion : '',
            fechaInicio : '',
            fechaFin : ''
        };
    };
    
    $scope.agregarSMP = function() {
        if (!$scope.dominio.smp) {
            $scope.dominio.smp = [];
        }
        $scope.dominio.smp.push($scope.dataSMP);
        $scope.dataSMP = {
            seccion : '',
            manzana : '',
            parcela : '',
            hogares : ''
        };
    };
    
    $scope.organigramaPorId = function (id) {
      for (var i = 0; i < $scope.dependencias.length; i++) {
          if ($scope.dependencias[i]._id == id)
          {
              return $scope.dependencias[i];
          }
      }  
    };
    
    $scope.$watch("dominio.smp.length", function () {
        $scope.calcularSupTotal();
    });
    
    $scope.calcularSupTotal = function () {
        if (!$scope.dominio.smp) return;
	    $scope.superficieTotalUsig = 0;
        angular.forEach($scope.dominio.smp, function (b){
            var parcela = b.seccion + "-" + b.manzana + "-" + b.parcela;
            $http.post("/api/usig/consultar-smp", {smp: parcela})
            .success(function (dataUsig) {
                if (dataUsig.info.info_alfanumerica.superficie_total) {
                    $scope.superficieTotalUsig = $scope.superficieTotalUsig + parseInt(dataUsig.info.info_alfanumerica.superficie_total);
                }
            });
            
        });
    };
    
    $scope.eliminarListaElem = function(elemento, lista) {
        lista.splice(lista.indexOf(elemento), 1);
    };
    
    $scope.eliminarRegularizacion = function(confirmado) {
        if (confirmado) {
            $scope.dominio.$delete(function() {
                $location.url('/regularizacionDominial');
            });
        }
        else {
            $("#confirmarEliminar").modal('show');
        }
    };
    
    
    $scope.agregarSMPModal = function() {
        $("#agregarSMP").modal('show');
    };
    
    $scope.marcarSMPModal = function(tipo) {
        if (tipo == 'NC') {
            $scope.nc = true;
            $scope.c = false;
            $scope.vs = false;
            $scope.pr = false;
            $scope.r = false;
        } else if (tipo == 'C') {
            $scope.nc = false;
            $scope.c = true;
            $scope.vs = false;
            $scope.pr = false;
            $scope.r = false;
        } else if (tipo == 'VS') {
            $scope.nc = false;
            $scope.c = false;
            $scope.vs = true;
            $scope.pr = false;
            $scope.r = false;
        } else if (tipo == 'PR') {
            $scope.nc = false;
            $scope.c = false;
            $scope.vs = false;
            $scope.pr = true;
            $scope.r = false;
        } else if (tipo == 'R') {
            $scope.nc = false;
            $scope.c = false;
            $scope.vs = false;
            $scope.pr = false;
            $scope.r = true;
        }
        $("#marcarSMP").modal('show');
    };
    
    $scope.verPoblacion = function() {
        $("#datosPoblacion").modal('show');
    };
    $scope.verPoblacionNC = function() {
        $("#datosPoblacionNC").modal('show');
    };
    $scope.verPoblacionC = function() {
        $("#datosPoblacionC").modal('show');
    };
    $scope.verPoblacionVS = function() {
        $("#datosPoblacionVS").modal('show');
    };
    $scope.verPoblacionPR = function() {
        $("#datosPoblacionPR").modal('show');
    };
    $scope.verPoblacionR = function() {
        $("#datosPoblacionR").modal('show');
    };
    
    $scope.modificar = function() {
        $scope.editando = true;
    };
    
    $scope.contarParcelas = function(tipo) {
        var cantidad = 0;
        if ($scope.dominio.smp) {
            $scope.dominio.smp.forEach(function(smp) {
                if (smp.instancia == tipo) {
                    cantidad = cantidad + 1;
                }
            });
        }
        return cantidad;
    };
    
    $scope.contarHogares = function(tipo) {
        var cantidad = 0;
        if ($scope.dominio.smp) {
            $scope.dominio.smp.forEach(function(smp) {
                if (smp.hogares) {
                    if (tipo == "todos") {
                        cantidad = cantidad + parseInt(smp.hogares);
                    } else if (smp.instancia == tipo) {
                        cantidad = cantidad + parseInt(smp.hogares);
                    }
                }
            });
        }
        return cantidad;
    };
    
    $scope.contarManzanas = function(tipo) {
        var manzanas = [];
        if ($scope.dominio.smp) {
            $scope.dominio.smp.forEach(function(smp) {
                if (smp.manzana) {
                    if (tipo == "todos") {
                        if (manzanas.indexOf((smp.seccion + smp.manzana))==-1) {
                            manzanas.push((smp.seccion + smp.manzana));
                        }
                    } else if (smp.instancia == tipo) {
                        if (manzanas.indexOf((smp.seccion + smp.manzana))==-1) {
                            manzanas.push((smp.seccion + smp.manzana));
                        }
                    }
                }
            });
        }
        return manzanas.length;
    };
    
    //Agregar calles
    $scope.agregarCalle = function(dataCalle) {
        if (!$scope.dominio.poligonoCalles) {
            $scope.dominio.poligonoCalles = [];
            $scope.agregarCalle(dataCalle);
        }
        else {
            $scope.dominio.poligonoCalles.push(dataCalle.calle);
        }
    };
    
    function includeByNombre(arr, obj) {
        for (var i = 0; i < arr.length; i++) {
            //alert(arr[i].nombre, " - ", obj);
            if (arr[i].nombre == obj) return true;
        }
    }
                    
    $scope.guardar = function() {
        if (includeByNombre($scope.tipos, $scope.dominio.tipo)) {
            $scope.dominio.$save(function(data) {
                //showAlert('Se ha guardado con éxito');
                $location.path('/regularizacionDominial');
            });
        }
        else {
            alert('No es una tipo válida');
        }
    };
    // Cometado de mapa anterior
    /*
    $scope.$on('selectionChanged', function(scope, selectedIndexes) {
            $scope.dominiosVista.selectedIndexes = selectedIndexes;

            if ($scope.dominiosVista && $scope.dominiosVista.selectedIndexes && $scope.dominiosVista.selectedIndexes.length === 1) {
                $scope.dominio = angular.copy($scope.dominiosVista.features[$scope.dominiosVista.selectedIndexes[0]]);
            }
            else {
                $scope.dominio = null;
            }
        });
            
    $scope.dominiosVista = {
        features: [],
        extent: new OpenLayers.Bounds(-6534946.2544514, -4127372.9915975, -6481058.14952, -4096798.1802889),
        currentTool: 'pan',
        markers: [],
        style: {}
    };

    $scope.$on('newextent', function(event, extent) {
        $scope.dominiosVista.extent = extent;
    });
    
    $scope.agregarPorWkt = function(wkt, nombre, ubicacion) {
        var marker = {
            wkt: wkt,
            src: '/views/regularizacionDominial/default.png',
            size: {
                x: 15,
                w: 20
            },
            offset: {
                x: -8,
                y: -20
            }
        };
        
        $scope.dominio.wkt = wkt;
        
        $scope.dominiosVista.markers.push(marker);

        $timeout(function() {
            $scope.$apply();
        });
    };

    $scope.$on('newFeature', function(data, feature, wkt) {
        $scope.agregarPorWkt(wkt);
    });

    $scope.punto = function() {
        $scope.dominiosVista.currentTool = 'point';
    };
    $scope.mover = function() {
        $scope.dominiosVista.currentTool = 'pan';
    };
    $scope.seleccionar = function() {
        $scope.dominiosVista.currentTool = 'boxselect';
    }; */
    
    
    $scope.agregarFotografia = function(confirmado, data) {
        if (confirmado) {
            data.fotoId = $scope.uploaded.shift().id;
            $scope.dominio.fotos.push(data);
            //showAlert('Se agrego una observación');
        }
        else {
            if ($scope.dominio.fotos === undefined) {
                $scope.dominio.fotos = [];
            }
            var modalScope = $scope.$new();
            
            modalScope.data = {
                descripcion: '',
                fecha: undefined,
                fuente: ''
            };
            $modal({template: '/views/regularizacionDominial/agregarFoto.html', persist: true, show: true, backdrop: 'static', scope: modalScope});
        }
    };
    
    $scope.agregarDocumentacionJudi = function(confirmado, data) {
        if (confirmado) {
            data.archivoId = $scope.uploadedJudicial.shift().id;
            $scope.dominio.documentosJudicial.push(data);
            //showAlert('Se agrego una observación');
        }
        else {
            if ($scope.dominio.documentosJudicial === undefined) {
                $scope.dominio.documentosJudicial = [];
            }
            var modalScope = $scope.$new();
            
            modalScope.data = {
                descripcion: '',
                fecha: undefined,
                fuente: ''
            };
            $modal({template: '/views/regularizacionDominial/agregarDocumentoJudicial.html', persist: true, show: true, backdrop: 'static', scope: modalScope});
        }
    };
    
    $scope.agregarDocumentacionNorm = function(confirmado, data) {
        if (confirmado) {
            data.archivoId = $scope.uploadedNormativa.shift().id;
            $scope.dominio.documentosNormativa.push(data);
            //showAlert('Se agrego una observación');
        }
        else {
            if ($scope.dominio.documentosNormativa === undefined) {
                $scope.dominio.documentosNormativa = [];
            }
            var modalScope = $scope.$new();
            
            modalScope.data = {
                descripcion: '',
                fecha: undefined,
                fuente: ''
            };
            $modal({template: '/views/regularizacionDominial/agregarDocumentoNormativa.html', persist: true, show: true, backdrop: 'static', scope: modalScope});
        }
    };
})
.controller("ConsultarSMPCtrl", function ($http, $scope) {
    $scope.$watch("s.seccion + '-' + s.manzana + '-' + s.parcela", function (smp) {
        if (smp === '--') return;
        
        $http.post("/api/usig/consultar-smp", {smp: smp})
        .success(function (dataUsig) {
            $scope.dataUsig = dataUsig;
        });
    });
});