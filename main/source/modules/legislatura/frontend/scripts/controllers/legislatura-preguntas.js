angular.module('bag2.legislatura.preguntas', [])
.controller('PreguntasCtrl', function($scope, Pregunta, TematicaPregunta, TemaPregunta, Jurisdiccion, CuestionarioLegislatura, EjeTematicoPregunta, EventoPregunta, EstadoPregunta, $location, $window, cleanObject) {
    $scope.filtro = $location.search();

    $scope.tematicas = TematicaPregunta.query();
    $scope.temas = TemaPregunta.query();
    $scope.jurisdicciones = Jurisdiccion.query();
    $scope.cuestionarios = CuestionarioLegislatura.query();
    $scope.ejesTematicos = EjeTematicoPregunta.query();
    $scope.eventos = EventoPregunta.query();
    $scope.estados = EstadoPregunta.query();
    
    var buscar = function() {
        var q = {
            'tematica': $scope.filtro.tematica,
            'tema_particular': $scope.filtro.tema_particular,
            'jurisdiccion._id': $scope.filtro.jurisdiccion,
            'cuestionario': $scope.filtro.cuestionario,
            'eje_tematico._id': $scope.filtro.eje_tematico,
            'evento': $scope.filtro.evento,
            'estado._id': $scope.filtro.estado
        };
        
        for (var k in q) {
            if (q[k] === undefined) {
                delete q[k];
            }
        }
        
        $scope.preguntas = Pregunta.query(q);
    };

    $scope.filtrar = function() {
        for (var k in $scope.filtro) {
            $location.search(k, $scope.filtro[k] || null);
        }
        
        buscar();
    };
    
    buscar();
}).controller('VerPreguntaCtrl', function($scope, Pregunta, EventoPregunta, cleanObject, Trazabilidad, ORMTema, ORMOrganigrama, $modal, Contactos, TematicaPregunta, TemaPregunta, EjeTematicoPregunta, CuestionarioLegislatura, BloquePregunta, EstadoPregunta, Funcionario, Jurisdiccion, $routeParams, $location) {
    $scope.nuevaTrazabilidad = function() {
        $location.url('/preguntas/' + $routeParams.id + '/trazabilidad');
    };
    
    $scope.estados = EstadoPregunta.query();
    $scope.eventos = EventoPregunta.query();
    $scope.bloques = BloquePregunta.query();
    $scope.cuestionarios = CuestionarioLegislatura.query();
    $scope.jurisdicciones = Jurisdiccion.query();
    $scope.ejes = EjeTematicoPregunta.query();
    $scope.tematicas = TematicaPregunta.query();
    $scope.funcionarios = Funcionario.query();
	$scope.contactos = Contactos.listar();
	$scope.organigrama = ORMOrganigrama.query();
	$scope.temasORM = ORMTema.query();
    $scope.uploadedFile = [];

    $scope.pregunta = Pregunta.get({
        _id: $routeParams.id
    }, function() {
        $scope.evento = EventoPregunta.get({
            _id: $scope.pregunta.evento
        });
    });
    
    $scope.mostrarTema = function (r) {
        if (r.eliminado) {
            return false; 
        } else {
            return true;
        }
    };
    
    $scope.eventoPorId = function (id) {
      for (var i = 0; i < $scope.eventos.length; i++) {
          if ($scope.eventos[i]._id == id)
          {
              return $scope.eventos[i];
          }
      }  
    };
    
    $scope.cuestionarioPorId = function (id) {
      for (var i = 0; i < $scope.cuestionarios.length; i++) {
          if ($scope.cuestionarios[i]._id == id)
          {
              return $scope.cuestionarios[i];
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
    
    $scope.mostrarTema = function (r) {
        if (r.eliminado) {
            return false; 
        } else {
            return true;
        }
    };
    
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
    
    $scope.agregarDocumentacion = function(confirmado, data) {
        if (confirmado) {
            data.archivoId = $scope.uploadedFile.shift().id;
            $scope.pregunta.documentos.push(data);
            //showAlert('Se agrego una observación');
        }
        else {
            if ($scope.pregunta.documentos === undefined) {
                $scope.pregunta.documentos = [];
            }
            var modalScope = $scope.$new();
            
            modalScope.data = {
                descripcion: '',
                fecha: undefined,
                fuente: ''
            };
            $modal({template: '/views/legislatura/preguntas/agregarDocumento.html', persist: true, show: true, backdrop: 'static', scope: modalScope});
        }
    };
    
    $scope.abrirModal = function(idmodal) {
        $(idmodal).modal('show');
    };
    
    //Agregar temas
    $scope.agregarTema = function(dataTema) {
        if (!$scope.pregunta.temas) {
            $scope.pregunta.temas = [];
        }
        $scope.pregunta.temas.push(dataTema);
        $scope.dataTema = "";
    };
    
    $scope.reverse = function(array) {
        var copy = [].concat(array);
        return copy.reverse();
    };
    
    $scope.agregarComen = function(confirmado, data) {
        if (confirmado) {
            $scope.pregunta.comentarios.push(data);
        }
        else {
            if (!$scope.pregunta.comentarios){
                $scope.pregunta.comentarios = [];
            }
            var modalScope = $scope.$new();
            
            modalScope.data = {
                descripcion: '',
                quien: '',
                cuando:undefined
            };
            $modal({template: '/views/legislatura/preguntas/agregarComentario.html', persist: true, show: true, backdrop: 'static', scope: modalScope});
        }
    };

    $scope.guardar = function() {
        $scope.pregunta._trackingDescription = 'Actualización de la pregunta "' + $scope.pregunta.pregunta + '"';
        $scope.pregunta.$save(function(data) {
            $scope.modificando = false;
        });
    };

    $scope.eliminar = function(confirmado) {
        if (confirmado) {
            $scope.pregunta.$delete(function() {
                $location.url('/preguntas/buscar');
            });
        }
        else {
            $("#confirmarEliminar").modal('show');
        }
    };

    $scope.modificar = function() {
        $scope.modificando = true;
    };
    
    $scope.cancelar = function() {
        $scope.pregunta = Pregunta.get({_id: $routeParams.id});
        $scope.modificando = false;
    };

    $scope.selecciona = function(i) {
        $scope.pregunta.tematica = i;
        $scope.temas = TemaPregunta.query({
            'tematica._id': i._id
        });
    };

    $scope.trazabilidades = Trazabilidad.query(cleanObject({
        'pregunta': $routeParams.id
    }));
}).controller('NuevaPreguntaCtrl', function($scope, Pregunta, EventoPregunta, TemaPregunta, $modal, Contactos, ORMOrganigrama, ORMTema, TematicaPregunta, EjeTematicoPregunta, BloquePregunta, EstadoPregunta, CuestionarioLegislatura, Funcionario, Jurisdiccion, $routeParams, $location) {
    $scope.jurisdicciones = Jurisdiccion.query();
    $scope.pregunta = new Pregunta();
    $scope.uploadedFile = [];
    if ($routeParams.cuestionario) {
        $scope.pregunta.cuestionario = $routeParams.cuestionario;
    }
    if ($routeParams.evento) {
        $scope.pregunta.evento = $routeParams.evento;
    }
    $scope.guardar = function(e) {
        $scope.pregunta.$save(function() {
            $location.url('/preguntas/' + $scope.pregunta._id);
        });
    };
    
    //Agregar temas
    $scope.agregarTema = function(dataTema) {
        if (!$scope.pregunta.temas) {
            $scope.pregunta.temas = [];
        }
        $scope.pregunta.temas.push(dataTema);
        $scope.dataTema = "";
    };

    $scope.estados = EstadoPregunta.query();
    $scope.eventos = EventoPregunta.query();
    $scope.cuestionarios = CuestionarioLegislatura.query();
    $scope.bloques = BloquePregunta.query();
    $scope.ejes = EjeTematicoPregunta.query();
    $scope.tematicas = TematicaPregunta.query();
    $scope.funcionarios = Funcionario.query();
	$scope.contactos = Contactos.listar();
	$scope.organigrama = ORMOrganigrama.query();
	$scope.temasORM = ORMTema.query();

    $scope.selecciona = function(i) {
        $scope.pregunta.tematica = i;
        $scope.temas = TemaPregunta.query({
            'tematica._id': i._id
        });
    };
    
    $scope.mostrarTema = function (r) {
        if (r.eliminado) {
            return false; 
        } else {
            return true;
        }
    };
    
    $scope.eventoPorId = function (id) {
      for (var i = 0; i < $scope.eventos.length; i++) {
          if ($scope.eventos[i]._id == id)
          {
              return $scope.eventos[i];
          }
      }  
    };
    
    $scope.cuestionarioPorId = function (id) {
      for (var i = 0; i < $scope.cuestionarios.length; i++) {
          if ($scope.cuestionarios[i]._id == id)
          {
              return $scope.cuestionarios[i];
          }
      }  
    };
    
    $scope.agregarDocumentacion = function(confirmado, data) {
        if (confirmado) {
            data.archivoId = $scope.uploadedFile.shift().id;
            $scope.pregunta.documentos.push(data);
            //showAlert('Se agrego una observación');
        }
        else {
            if ($scope.pregunta.documentos === undefined) {
                $scope.pregunta.documentos = [];
            }
            var modalScope = $scope.$new();
            
            modalScope.data = {
                descripcion: '',
                fecha: undefined,
                fuente: ''
            };
            $modal({template: '/views/legislatura/preguntas/agregarDocumento.html', persist: true, show: true, backdrop: 'static', scope: modalScope});
        }
    };
    
    $scope.abrirModal = function(idmodal) {
        $(idmodal).modal('show');
    };
}).controller('NuevaTrazabilidadCtrl', function($scope, Trazabilidad, $routeParams, $location) {
    $scope.trazabilidad = new Trazabilidad();
    $scope.trazabilidad.pregunta = $routeParams.id;
    $scope.guardar = function() {
        $scope.trazabilidad.$save(function(data) {
            $location.url('/preguntas/' + $routeParams.id);
        });
    };
}).controller('PrintPreguntaCtrl', function($scope, Pregunta, $window, TemaPregunta, Contactos, EventoPregunta, ORMOrganigrama, TematicaPregunta, EjeTematicoPregunta, BloquePregunta, EstadoPregunta, CuestionarioLegislatura, Funcionario, Jurisdiccion, $routeParams, $location) {
    $scope.pregunta = Pregunta.get({
        _id: $routeParams.id
    });

    $scope.imprimir = function() {
        $window.print();
    };
    
    $scope.eventos = EventoPregunta.query();
    $scope.cuestionarios = CuestionarioLegislatura.query();
	$scope.contactos = Contactos.listar();
	$scope.organigrama = ORMOrganigrama.query();
    
    $scope.eventoPorId = function (id) {
      for (var i = 0; i < $scope.eventos.length; i++) {
          if ($scope.eventos[i]._id == id)
          {
              return $scope.eventos[i];
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
    
    $scope.cuestionarioPorId = function (id) {
      for (var i = 0; i < $scope.cuestionarios.length; i++) {
          if ($scope.cuestionarios[i]._id == id)
          {
              return $scope.cuestionarios[i];
          }
      }  
    };
    
    $scope.contactoPorId = function (id) {
      for (var i = 0; i < $scope.contactos.length; i++) {
          if ($scope.contactos[i]._id == id)
          {
              return $scope.contactos[i];
          }
      }  
    };
});