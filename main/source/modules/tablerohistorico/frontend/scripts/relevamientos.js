angular.module('bag2.relevamientos', [])
    .controller('HistoricoRelevamientosCtrl', function ($scope, Relevamiento, $http) {
        $scope.nuevo = new Relevamiento();

        $scope.$watch('filtro.anio', function (a) {
            $http.get('/api/dependencias/' + (a || 2013))
                .success(function (dependencias) {
                    $scope.dependencias = dependencias;
                });
        });
        $scope.$watch('filtro.idDependencia', function (i) {
            if (i) {
                $http.get('/api/estrategias/' + i)
                    .success(function (estrategias) {
                        $scope.estrategias = estrategias;
                    });
            } else {
                $scope.estrategias = [];
            }

        });
        $scope.$watch('filtro.idEstrategia', function (i) {
            if (i) {
                $http.get('/api/objetivos/' + i)
                    .success(function (objetivos) {
                        $scope.objetivos = objetivos;
                    });
            } else {
                $scope.objetivos = [];
            }
        });
        $scope.$watch('filtro.idObjetivo', function (i) {
            if (i) {
                $http.get('/api/proyectos/' + i)
                    .success(function (proyectos) {
                        $scope.proyectos = proyectos;
                    });
            } else {
                $scope.proyectos = [];
            }
        });

        var recargar = function () {
            $scope.relevamientos = Relevamiento.query({});
        };

        $scope.guardarNuevo = function () {
            $scope.nuevo.$save(function () {
                $scope.nuevo = new Relevamiento();
                recargar();
            });
        };

        $scope.guardar = function (r) {
            r.$save();
            recargar();
        };

        $scope.borrar = function (r) {
            r.$remove();
            recargar();
        };

        recargar();
    })
    .controller('TableroHistoricoCtrl', function ($scope, $http, $modal) {
        $scope.modalDocumentos = function (p) {
            $modal({
                template: "/views/modalDocumentos.html",
                backdrop: 'static',
                show: true,
                scope: angular.extend($scope.$new(), { proyecto: p } )
            });
        };
        // $('#idDependenciaAnio').empty();
        $scope.$watch('filtro.anio', function (a) {
            $http.get('/api/listaDependencias/' + a)
                .success(function (dependencias) {
                    $scope.dependencias = dependencias;
                });
        });
        $scope.$watch('filtro.idDependencia', function (d) {
            if (d) {
                $http.get('/api/listaEstrategia/' + d)
                    .success(function (estrategias) {
                        $scope.estrategias = estrategias;
                    });
            } else {
                $scope.estrategias = [];
            }
        });
        $scope.$watch('filtro.idEstrategia', function (e) {
            if (e) {
                //  alert(parametro);
                $http.get('/api/listaObjetivo/' + e)
                    .success(function (objetivos) {
                        $scope.objetivos = objetivos;
                    });
            } else {
                $scope.objetivos = [];
            }
        });
        $scope.$watch('filtro.idObjetivo', function (a) {
            if (a) {
                //  alert(parametro);
                $http.get('/api/listaProyectos/' + a)
                    .success(function (proyectos) {
                        $scope.proyectos = proyectos;
                    });
            } else {
                $scope.proyectos = [];
            }
        });
    })
    .controller("HitosController", function ($scope, $routeParams, Hito, $http) {
        $http.get('/api/listaHitos/' + $routeParams.proyectoId)
            .success(function (data) {
                $scope.hitos = data;
            });
    })
    .controller("DocumentosHitoController", function ($scope, $routeParams, $http, $modal) {
        $http.get('/api/documentosHitos/' + $scope.h.ID)
            .success(function (data) {
                $scope.documentos = data;
            });

        $scope.mostrarDocumentos = function () {
            $modal({
                template: "/views/modalDocumentosHito.html",
                backdrop: 'static',
                show: true,
                scope: $scope
            });
        };
    })
    .controller("RelevamientoFotosCtrl", function ($scope, $http) {
        $scope.$watch('f.id', function (f) {
            $http.get('/api/fotosRelevamiento/' + f)
                 .success(function (data) {
                     $scope.fotos = data;
                 });
        });
    })
    .controller("DocumentosProyectoCtrl", function ($scope, $http) {
        $scope.$watch('proyecto.ID', function (f) {
            $http.get('/api/documentosProyecto/' + f)
                 .success(function (data) {
                     $scope.documentos = data;
                 });
        });
    })
    .controller("RespuestasInformeSyHCtrl", function ($scope, $http) {
    })
    .controller("InformeSeguridadHigieneCtrl", function ($scope, $http) {
        $http.get('/api/informesSyH/' + $scope.syh.idInforme)
             .success(function (informe) {
                 $scope.informe = informe;
             });
             
                 
        $http.get('/api/informesSyHcatgoria/' + $scope.syh.categoria)
             .success(function (data) {
                 $scope.estructuras = data;
             });
    })
    .controller("InfoAdicionalCtrl", function ($scope, $http) {
        $http.get('/api/informesSyHxRelevamiento/' + $scope.f.id)
             .success(function (data){
                 $scope.f.informesSyH = data;
             });
    })
    .controller("FichaVirtualController", function ($scope, $routeParams, Hito, $http, $filter, $modal) {
        $scope.mostrarFoto = function (f) {
            $modal({
                template: "/views/modalFoto.html",
                backdrop: 'static',
                show: true,
                scope: angular.extend($scope.$new(), { foto: f } )
            });
        };
        
        $http.get('/api/fichaVirtual/' + $routeParams.proyectoId)
            .success(function (f) {
                $scope.fichas = f;
            });

        $http.get('/api/proyecto/' + $routeParams.proyectoId)
            .success(function (p) {
                $scope.proyecto = p;

                $scope.hitos = Hito.query({
                    idProyecto: $routeParams.proyectoId
                }, function () {
                    var inicioDeObra = $filter('filter')($scope.hitos, function (h) {
                        return h && h.Hito && h.Hito.toLowerCase().indexOf('inicio de obra') > -1;
                    })[0];

                    if (inicioDeObra) {
                        $scope.inicioDeObra = inicioDeObra.FechaVencimiento.split('T')[0].split('-').reverse().join('-');
                    }

                    var finDeObra = $filter('filter')($scope.hitos, function (h) {
                        return h && h.Hito && h.Hito.toLowerCase().indexOf('finalización de obra') > -1;
                    })[0];

                    if (finDeObra) {
                        if (finDeObra.FechCumplimiento) {
                            $scope.finDeObra = finDeObra.FechCumplimiento;
                        } else if (finDeObra.FechaVencimiento) {
                            $scope.finDeObra = finDeObra.FechaVencimiento;
                        } else {
                            $scope.finDeObra = finDeObra.FechaEstimada;
                        }

                        $scope.finDeObra = $scope.finDeObra.split('T')[0].split('-').reverse().join('-');
                    }
                });
            });
    });
