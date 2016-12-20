angular.module('bag2.crucesferroviarios', [])
.controller('CrucesFerroviariosCtrl', function($scope, EstadoCrucesFerroviarios, Comuna, Jurisdiccion, $routeParams, FFCCCrucesFerroviarios, AnioCrucesFerroviarios, $rootScope, CruceFerroviario, $location, $timeout, $window, cleanObject, $http) {
    $scope.puedeModificar = function() {
        return true; //arrayContains($scope.user.permissions, 'actualizarCrucesFerroviarios') || arrayContains($scope.user.permissions, 'master');
    };
    var lipio = document.getElementById("mapaPrincipal").innerHTML='';
    $scope.miMapa = new usig.MapaInteractivo('mapaPrincipal', {
        //rootUrl: '//servicios.usig.buenosaires.gov.ar/usig-js/3.1/',
        zoomBar: true,
        onReady: function() {
        }
    }); 
    $scope.filtrarAnio = function(anio) {
      $location.url("/crucesFerroviarios?fecha_finaliza={\"$regex\":\"" + anio.nombre + "$\"}");
    };
    
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

        $location.url('/crucesFerroviarios/print?' + outString);
    });

    $scope.modificar = function() {
        if ($scope.cruceSeleccionado) {
            $scope.editando = true;
            $scope.uploaded = [];
        }
    };

    $scope.uploaded = [];
    $scope.$watch('uploaded[0].id', function(newValue) {
        if (!newValue) {
            return;
        }
        if ($scope.cruceSeleccionado) {
            if ($scope.cruceSeleccionado.fotos === undefined) {
                $scope.cruceSeleccionado.fotos = [];
            }
            $scope.cruceSeleccionado.fotos.push($scope.uploaded.shift().id);
        }
    });

    $scope.cancelar = function() {
        $scope.editando = false;
        $scope.seleccionado = false;
        $scope.existeFoto = false;
        $scope.cruceSeleccionado = null;
    };

    $scope.$on('volver', function() {
        $scope.seleccionado = false;
        $scope.existeFoto = false;
        $scope.cruceSeleccionado = null;
        $scope.listado = $scope.cruces;
        $scope.crucesVista = {
            features: $scope.cruces,
            currentTool: 'boxselect',
            selectedIndexes: [],
            extent: extent,
            style: styles
        };
    });

    $scope.seleccionar = function(e) {
        $scope.cruceSeleccionado = e;
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
            $scope.cruceSeleccionado.observaciones.push(data);
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
        $scope.crucesVista.selectedIndexes = selectedIndexes;

        if ($scope.crucesVista && $scope.crucesVista.selectedIndexes && $scope.crucesVista.selectedIndexes.length === 1) {
            $scope.cruceSeleccionado = angular.copy($scope.crucesVista.features[$scope.crucesVista.selectedIndexes[0]]);
        }
        else {
            $scope.cruceSeleccionado = null;
        }

        var listado = [];

        if (selectedIndexes.length > 0) {
            selectedIndexes.forEach(function(index) {
                listado.push($scope.cruces[index]);
            });
        }
        else {
            listado = $scope.cruces;
        }

        $scope.listado = listado;
    });

    /*var extent = new OpenLayers.Bounds(-6534946.2544514, -4127372.9915975, -6481058.14952, -4096798.1802889);
    var styles = {
        pointRadius: 5,
        fillColor: "${colorEstado}",
        zIndex: 1
    };

    $scope.crucesVista = {
        features: [],
        currentTool: 'boxselect',
        selectedIndexes: [],
        extent: extent,
        style: styles
    };

    $scope.$watch('[cruces, cruceSeleccionado] | json', function() {
        if ($scope.cruceSeleccionado) {
            $scope.crucesVista = {
                features: [$scope.cruceSeleccionado],
                currentTool: 'none',
                selectedIndexes: [],
                extent: extent,
                style: styles
            };
        }
        else {
            $scope.crucesVista = {
                features: $scope.cruces,
                currentTool: 'boxselect',
                selectedIndexes: $scope.crucesVista.selectedIndexes,
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
    
    $scope.ffccs = FFCCCrucesFerroviarios.query(function() {
        $scope.ffccs.sort(function(a, b) {
            a.total = 0;
            b.total = 0;
            return b.weight - a.weight;
        });
        $scope.ffccsDict = {};
        $scope.ffccsNombres = [];
        $scope.ffccs.forEach(function(item) {
            $scope.ffccsDict[item._id] = item;
            $scope.ffccsNombres.push(item.nombre);
        });
    });
    
    $scope.anios = AnioCrucesFerroviarios.query(function() {
        $scope.anios.sort(function(a, b) {
            a.total = 0;
            b.total = 0;
            return b.weight - a.weight;
        });
        $scope.aniosDict = {};
        $scope.aniosNombres = [];
        $scope.anios.forEach(function(item) {
            $scope.aniosDict[item._id] = item;
            $scope.aniosNombres.push(item.nombre);
        });
    });
    
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
    
    
    $scope.dependencias = Jurisdiccion.query(function() {
            $scope.dependencias.sort(function(a, b) {
                a.total = 0;
                b.total = 0;
                return b.weight - a.weight;
            });
            $scope.dependenciasDict = {};
            $scope.dependenciasNombres = [];
            $scope.dependencias.forEach(function(item) {
                $scope.dependenciasDict[item._id] = item;
                $scope.dependenciasNombres.push(item.nombre);
            });
        });
    
    $scope.estados = EstadoCrucesFerroviarios.query(function() {
        $scope.estados.sort(function(a, b) {
            a.total = 0;
            b.total = 0;
            return b.weight - a.weight;
        });
        $scope.estadosDict = {};
        $scope.estadosNombres = [];
        $scope.estados.forEach(function(item) {
            $scope.estadosDict[item._id] = item;
            $scope.estadosNombres.push(item.nombre);
        });
        
        
        $scope.todosCruces = CruceFerroviario.query(function() {
            $scope.enProgreso = 0;
            
            $scope.todosCruces.forEach(function(item) {
                var est = findFirst($scope.estados, function(estado) {
                    return item.estado == estado.nombre;
                });

                if (est) {
                    if (est.total) {
                        est.total += 1;
                    }
                    else {
                        est.total = 1;
                    }
                    
                    if (est.progress) {
                        $scope.enProgreso += 1;
                    }
                }
                
                var an = findFirst($scope.anios, function(anio) {
                    return item.fecha_finaliza.substring(6,10) == anio.nombre;
                });

                if (an) {
                    if (an.total) {
                        an.total += 1;
                    }
                    else {
                        an.total = 1;
                    }
                    
                    if (an.progress) {
                        $scope.enProgreso += 1;
                    }
                }
                
                var fc = findFirst($scope.ffccs, function(ffcc) {
                    return item.ffcc == ffcc.nombre;
                });

                if (fc) {
                    if (fc.total) {
                        fc.total += 1;
                    }
                    else {
                        fc.total = 1;
                    }
                    
                    if (fc.progress) {
                        $scope.enProgreso += 1;
                    }
                }
                
                if ($routeParams.id === item._id){
                    $scope.cruceSeleccionado = item;
                }
            });
        });

        $scope.cruces = CruceFerroviario.query($routeParams,
            function() {
            $scope.cruces.sort(function(a, b) {
                return a.altura - b.altura;
            });

            $scope.listado = $scope.cruces;

            $scope.cruces.forEach(function(item) {
                if ((!item.wkt) && item.geom) {
                    item.wkt = item.geom;
                    delete item.geom;
                }

                var est = findFirst($scope.estados, function(estado) {
                    return item.estado == estado.nombre;
                });

                if (est) {
                    item.attributes = {
                        colorEstado: est.color
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
                $scope.cruceSeleccionado.estado = $('#estado-typeahead').val();
                $scope.cruceSeleccionado.comuna = $('#comuna-typeahead').val();
                $scope.cruceSeleccionado.calle = $('#calle-typeahead').val();
                $scope.cruceSeleccionado.ffcc = $('#ffcc-typeahead').val();
                $scope.cruceSeleccionado.dependencia = $('#dependencia-typeahead').val();
                if (includeByNombre($scope.estados, $scope.cruceSeleccionado.estado)) {
                            $scope.cruceSeleccionado.$save(function() {
                                $scope.editando = false;
                                
                                for (var x = 0; $scope.cruces.length; x++) {
                                    if ($scope.cruces[x]._id === $scope.cruceSeleccionado._id) {
                                        $scope.cruces[x] = $scope.cruceSeleccionado;
                                        break;
                                    }
                                }
                            });
                }
                else {
                    alert('No es una estado válida');
                }
            };
        });
    });


    $scope.color = function(estado) {
        var color;
            $scope.estados.forEach(function(est) {
                    if (est.nombre === estado) {
                        color = est.color;
                    }
            });
        return color;
    };

    /*
    $http.get('/api/tracking-changes/crucesFerroviarios/all').success(function(data) {
        $scope.trackingAllChanges = data.isTracking;
    });

    $scope.$watch('cruceSeleccionado', function() {
        if ($scope.cruceSeleccionado) {
            $http.get('/api/tracking-changes/crucesFerroviarios/' + $scope.cruceSeleccionado._id).success(function(data) {
                $scope.trackingChanges = data.isTracking;
            });
        }
    });

    $scope.trackChanges = function() {
        if ($scope.cruceSeleccionado) {
            $http.post('/api/tracking-changes/crucesFerroviarios/' + $scope.cruceSeleccionado._id).success(function(data) {
                $scope.trackingChanges = data.isTracking;
            });
        }
    };

    $scope.trackAllChanges = function() {
        $http.post('/api/tracking-changes/crucesFerroviarios/all').success(function(data) {
            $scope.trackingAllChanges = data.isTracking;
        });
    };*/
}).controller('CrucesFerroviariosPrintCtrl', function($scope, EstadoCrucesFerroviarios, $routeParams, CruceFerroviario, $rootScope, $location, $timeout, $window, cleanObject, $http) {
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

    $window.document.title = 'Cruces Ferroviarios';

    /*var extent = new OpenLayers.Bounds(-6534946.2544514, -4127372.9915975, -6481058.14952, -4096798.1802889);
    var styles = {
        'default': {
            pointRadius: 5,
            fillColor: "${colorEstado}",
            zIndex: 1
        }
    };

    $scope.crucesVista = {
        features: [],
        currentTool: 'none',
        selectedIndexes: [],
        extent: extent,
        styles: styles,
        noControls: true
    };

    $scope.$watch('cruces', function() {
        $scope.crucesVista = {
            features: $scope.cruces,
            currentTool: 'none',
            selectedIndexes: $scope.crucesVista.selectedIndexes,
            extent: extent,
            styles: styles
        };

        $scope.featuresLoaded = true;
    });*/

    $scope.porcentaje = function(a, b) {
        var porcentaje = a / b * 100;
        return porcentaje.toFixed(2);
    };

    $scope.estados = EstadoCrucesFerroviarios.query(function() {
        $scope.estados.sort(function(a, b) {
            a.total = 0;
            b.total = 0;
            return b.weight - a.weight;
        });
        $scope.estadosDict = {};
        $scope.estadosNombres = [];
        $scope.estados.forEach(function(item) {
            $scope.estadosDict[item._id] = item;
            $scope.estadosNombres.push(item.nombre);
        });


        $scope.todosCruces = CruceFerroviario.query(function() {
            $scope.enProgreso = 0;

            $scope.todosCruces.forEach(function(item) {
                var est = findFirst($scope.estados, function(estado) {
                    return item.estado == estado.nombre;
                });

                if (est) {
                    if (est.total) {
                        est.total += 1;
                    }
                    else {
                        est.total = 1;
                    }

                    if (est.progress) {
                        $scope.enProgreso += 1;
                    }
                }
            });
        });

        $scope.cruces = CruceFerroviario.query($routeParams,
            function() {
                $scope.cruces.sort(function(a, b) {
                    return a.altura - b.altura;
                });

                $scope.listado = $scope.cruces;

                $scope.cruces.forEach(function(item) {
                    if ((!item.wkt) && item.geom) {
                        item.wkt = item.geom;
                        delete item.geom;
                    }

                    var est = findFirst($scope.estados, function(estado) {
                        return item.estado == estado.nombre;
                    });

                    if (est) {
                        item.attributes = {
                            colorEstado: est.color
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
}).controller('NuevoCruceFerroviarioCtrl', function($scope, EstadoCrucesFerroviarios, $routeParams, FFCCCrucesFerroviarios, Comuna, Jurisdiccion, CruceFerroviario, $rootScope, $location, $timeout, $window, cleanObject, $http) {
    $scope.cruce = new CruceFerroviario({
        planDeObraCumplido: 'no',
        fotos: [],
        observaciones: [],
        geoms: []
    });
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
    $scope.dependencias = Jurisdiccion.query(function() {
        $scope.dependencias.sort(function(a, b) {
            a.total = 0;
            b.total = 0;
            return b.weight - a.weight;
        });
        $scope.dependenciasDict = {};
        $scope.dependenciasNombres = [];
        $scope.dependencias.forEach(function(item) {
            $scope.dependenciasDict[item._id] = item;
            $scope.dependenciasNombres.push(item.nombre);
        });
    });
    
    $scope.ffccs = FFCCCrucesFerroviarios.query(function() {
        $scope.ffccs.sort(function(a, b) {
            a.total = 0;
            b.total = 0;
            return b.weight - a.weight;
        });
        $scope.ffccsDict = {};
        $scope.ffccsNombres = [];
        $scope.ffccs.forEach(function(item) {
            $scope.ffccsDict[item._id] = item;
            $scope.ffccsNombres.push(item.nombre);
        });
    });
    
    $scope.estados = EstadoCrucesFerroviarios.query(function() {
        $scope.estados.sort(function(a, b) {
            a.total = 0;
            b.total = 0;
            return b.weight - a.weight;
        });
        $scope.estadosDict = {};
        $scope.estadosNombres = [];
        $scope.estados.forEach(function(item) {
            $scope.estadosDict[item._id] = item;
            $scope.estadosNombres.push(item.nombre);
        });
    });
    
    function includeByNombre(arr, obj) {
        for (var i = 0; i < arr.length; i++) {
            //alert(arr[i].nombre, " - ", obj);
            if (arr[i].nombre == obj) return true;
        }
    }
                    
    $scope.guardar = function() {
        $scope.cruce.estado = $('#estado-typeahead').val();
        $scope.cruce.comuna = $('#comuna-typeahead').val();
        $scope.cruce.ffcc = $('#ffcc-typeahead').val();
        $scope.cruce.calle = $('#calle-typeahead').val();
        $scope.cruce.dependencia = $('#dependencia-typeahead').val();
        if (includeByNombre($scope.estados, $scope.cruce.estado)) {
            $scope.cruce.$save(function(data) {
                //showAlert('Se ha guardado con éxito');
                $location.path('/crucesFerroviarios');
            });
        }
        else {
            alert('No es una estado válida');
        }
    };
    
    $scope.$on('selectionChanged', function(scope, selectedIndexes) {
            $scope.crucesVista.selectedIndexes = selectedIndexes;

            if ($scope.crucesVista && $scope.crucesVista.selectedIndexes && $scope.crucesVista.selectedIndexes.length === 1) {
                $scope.cruce = angular.copy($scope.crucesVista.features[$scope.crucesVista.selectedIndexes[0]]);
            }
            else {
                $scope.cruce = null;
            }
        });
            
    /*$scope.crucesVista = {
        features: [],
        extent: new OpenLayers.Bounds(-6534946.2544514, -4127372.9915975, -6481058.14952, -4096798.1802889),
        currentTool: 'pan',
        markers: [],
        style: {}
    };

    $scope.$on('newextent', function(event, extent) {
        $scope.crucesVista.extent = extent;
    });*/
    
    $scope.agregarPorWkt = function(wkt, nombre, ubicacion) {
        var marker = {
            wkt: wkt,
            src: '/views/crucesFerroviarios/default.png',
            size: {
                x: 15,
                w: 20
            },
            offset: {
                x: -8,
                y: -20
            }
        };
        
        $scope.cruce.wkt = wkt;
        
        $scope.crucesVista.markers.push(marker);

        $timeout(function() {
            $scope.$apply();
        });
    };

    $scope.$on('newFeature', function(data, feature, wkt) {
        $scope.agregarPorWkt(wkt);
    });

    $scope.punto = function() {
        $scope.crucesVista.currentTool = 'point';
    };
    $scope.mover = function() {
        $scope.crucesVista.currentTool = 'pan';
    };
    $scope.seleccionar = function() {
        $scope.crucesVista.currentTool = 'boxselect';
    };
    
    $scope.uploaded = [];
    $scope.$watch('uploaded[0].id', function(newValue) {
        if (!newValue) {
            return;
        }
        if ($scope.cruce) {
            if ($scope.cruce.fotos === undefined) {
                $scope.cruce.fotos = [];
            }
            $scope.cruce.fotos.push($scope.uploaded.shift().id);
        }
    });
});