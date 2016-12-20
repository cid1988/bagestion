angular.module('bag2.documentos', [])
.controller('DocumentosCtrl', function($scope, $location, $http, BajoAutopista, ORMOrganigrama, Constituyentes, Contactos, Iniciativa, Obra, PlanBA2030, Pregunta, CruceFerroviario, ORMMinuta, RegularizacionDominial, User, Comuna, $modal, $routeParams) {
    
    $scope.documentos = [];
    $scope.fotos = [];
    $scope.aplicaciones = ["Bajo Autopista", "Constituyentes", "Cruces Ferroviarios", "Iniciativas", "Obras", "Regularizacion Dominial", "Plan BA 2030", "Legislatura", "ORM"];
    
    $scope.agregarDoc = function (arreglo, aplicacion, link) {
        angular.forEach(arreglo, function (d) {
            var item = {
                docId : d.archivoId,
                aplicacion : aplicacion,
                nombre : d.nombre,
                fecha : d.fecha,
                tipo : d.tipo,
                autor : d.autor,
                fuente : d.fuente,
                extension : (d.archivoId.substr(d.archivoId.length - 4, d.archivoId.length - 1)).toUpperCase(),
                link : link
            };
            $scope.documentos.push(item);
        }); 
    };
    
    $scope.agregarFoto = function (arreglo, aplicacion, link) {
        angular.forEach(arreglo, function (f) {
            var item = {
                fotoId : f.fotoId,
                nombre : f.nombre,
                fecha : f.fecha,
                fuente : f.fuente,
                tipoFoto : f.tipoFoto,
                aplicacion : aplicacion,
                link : link
            };
            $scope.fotos.push(item);
        });
    };
    
	var bajoautopistas = BajoAutopista.query({}, function() {
        angular.forEach(bajoautopistas, function (p) {
            if (p.fotos) {
                angular.forEach(p.fotos, function (f) {
                    var item = {
                        fotoId : f,
                        nombre : '',
                        fecha : '',
                        fuente : '',
                        tipoFoto : '',
                        aplicacion : 'Bajo Autopista',
                        link : '/bajoautopista/' + p._id
                    };
                    $scope.fotos.push(item);
                });
            }
        });
	});
	
	var constituyentes = Constituyentes.query({}, function() {
        angular.forEach(constituyentes, function (p) {
            if (p.fotos) {
                angular.forEach(p.fotos, function (f) {
                    var item = {
                        fotoId : f,
                        nombre : '',
                        fecha : '',
                        fuente : '',
                        tipoFoto : '',
                        aplicacion : 'Constituyentes',
                        link : '/constituyentes/' + p._id
                    };
                    $scope.fotos.push(item);
                });
            }
        });
	});
	
	var cruces = CruceFerroviario.query({}, function() {
        angular.forEach(cruces, function (p) {
            if (p.fotos) {
                angular.forEach(p.fotos, function (f) {
                    var item = {
                        fotoId : f,
                        nombre : '',
                        fecha : '',
                        fuente : '',
                        tipoFoto : '',
                        aplicacion : 'Cruces Ferroviarios',
                        link : '/crucesFerroviarios/' + p._id
                    };
                    $scope.fotos.push(item);
                });
            }
        });
	});
	
	var iniciativas = Iniciativa.query({}, function() {
        angular.forEach(iniciativas, function (p) {
            if (p.fotos) {
                $scope.agregarFoto(p.fotos, 'Iniciativas', '/iniciativas/' + p._id);
            }
            if (p.fotosSolicitud) {
                $scope.agregarFoto(p.fotosSolicitud, 'Iniciativas', '/iniciativas/' + p._id);
            }
            if (p.fotosPropuesta) {
                $scope.agregarFoto(p.fotosPropuesta, 'Iniciativas', '/iniciativas/' + p._id);
            }
            if (p.fotosEstado) {
                $scope.agregarFoto(p.fotosEstado, 'Iniciativas', '/iniciativas/' + p._id);
            }
            if (p.documentos) {
                $scope.agregarDoc(p.documentos, 'Iniciativas', '/iniciativas/' + p._id);
            }
            if (p.documentosPropuesta) {
                $scope.agregarDoc(p.documentosPropuesta, 'Iniciativas', '/iniciativas/' + p._id);
            }
            if (p.documentosEstado) {
                $scope.agregarDoc(p.documentosEstado, 'Iniciativas', '/iniciativas/' + p._id);
            }
            if (p.documentosSolicitud) {
                $scope.agregarDoc(p.documentosSolicitud, 'Iniciativas', '/iniciativas/' + p._id);
            }
        });
	});
	
	var obras = Obra.query({}, function() {
        angular.forEach(obras, function (p) {
            if (p.fotos) {
                $scope.agregarFoto(p.fotos, 'Obras', '/obras/' + p._id);
            }
            if (p.fotosSolicitud) {
                $scope.agregarFoto(p.fotosSolicitud, 'Obras', '/obras/' + p._id);
            }
            if (p.fotosPropuesta) {
                $scope.agregarFoto(p.fotosPropuesta, 'Obras', '/obras/' + p._id);
            }
            if (p.fotosEstado) {
                $scope.agregarFoto(p.fotosEstado, 'Obras', '/obras/' + p._id);
            }
            if (p.documentos) {
                $scope.agregarDoc(p.documentos, 'Obras', '/obras/' + p._id);
            }
            if (p.documentosPropuesta) {
                $scope.agregarDoc(p.documentosPropuesta, 'Obras', '/obras/' + p._id);
            }
            if (p.documentosEstado) {
                $scope.agregarDoc(p.documentosEstado, 'Obras', '/obras/' + p._id);
            }
            if (p.documentosSolicitud) {
                $scope.agregarDoc(p.documentosSolicitud, 'Obras', '/obras/' + p._id);
            }
        });
	});
	
	var dominios = RegularizacionDominial.query({}, function() {
        angular.forEach(dominios, function (p) {
            if (p.fotos) {
                angular.forEach(p.fotos, function (f) {
                    var item = {
                        fotoId : f,
                        nombre : '',
                        fecha : '',
                        fuente : '',
                        tipoFoto : '',
                        aplicacion : 'Regularizacion Dominial',
                        link : '/regularizacionDominial/' + p._id
                    };
                    $scope.fotos.push(item);
                });
            }
            if (p.documentosJudicial) {
                $scope.agregarDoc(p.documentosJudicial, 'Regularizacion Dominial', '/regularizacionDominial/' + p._id);
            }
            if (p.documentosNormativa) {
                $scope.agregarDoc(p.documentosNormativa, 'Regularizacion Dominial', '/regularizacionDominial/' + p._id);
            }
        });
	});
	
	var minutas = ORMMinuta.query({}, function() {
        angular.forEach(minutas, function (p) {
            if (p.presentaciones) {
                $scope.agregarDoc(p.presentaciones, 'ORM', '/orm/reuniones/' + p.instancia + '/minuta');
            }
        });
	});
	
	var planes = PlanBA2030.query({}, function() {
        angular.forEach(planes, function (p) {
            if (p.documentos) {
                $scope.agregarDoc(p.documentos, 'Plan BA 2030', '/planba2030/' + p._id);
            }
        });
	});
	
	var preguntas = Pregunta.query({}, function() {
        angular.forEach(preguntas, function (p) {
            if (p.documentos) {
                $scope.agregarDoc(p.documentos, 'Legislatura', '/preguntas/' + p._id);
            }
        });
	});
	
	$scope.contactos = Contactos.listar();
	$scope.comunas = Comuna.query();
	$scope.organigrama = ORMOrganigrama.query();
    $scope.orden = 'numero';
    $scope.fecha = {
        desde : "",
        hasta : ""
    };
    
    $scope.contactoPorId = function (id) {
      for (var i = 0; i < $scope.contactos.length; i++) {
          if ($scope.contactos[i]._id == id)
          {
              return $scope.contactos[i];
          }
      }  
    };
    
    $scope.abrirModalImagen = function(foto, link) {
        $modal({
            template: '/views/documentos/abrirModalImagen.html',
            show: true,
            backdrop: 'static',
            scope: angular.extend($scope.$new(), {
                foto: foto,
                link: link
            })
        });
    };
    
    $scope.comunaPorId = function (id) {
      for (var i = 0; i < $scope.comunas.length; i++) {
          if ($scope.comunas[i]._id == id)
          {
              return $scope.comunas[i];
          }
      }  
    };
    
    $scope.organigramaPorId = function (id) {
      for (var i = 0; i < $scope.organigrama.length; i++) {
          if ($scope.organigrama[i]._id == id)
          {
              return $scope.organigrama[i];
          }
      }  
    };
    
});
