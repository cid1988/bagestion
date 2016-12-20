angular.module('bag2.legislatura.cuestionarios', [])
.controller('VerCuestionarioCtrl', function($scope, CuestionarioLegislatura, EventoPregunta, Contactos, ORMOrganigrama, BloquePregunta, EstadoPregunta, Pregunta, $routeParams, $window, $location) {
    $scope.eventos = EventoPregunta.query();
    $scope.bloques = BloquePregunta.query();
    $scope.cuestionario = CuestionarioLegislatura.get({_id: $routeParams.id});
	$scope.contactos = Contactos.listar();
	$scope.organigrama = ORMOrganigrama.query();
    $scope.estados = EstadoPregunta.query({}, function() {
        $scope.estadosDict = {};
        for (var i = 0; i < $scope.estados.length; i++) {
            $scope.estadosDict[$scope.estados[i]._id] = $scope.estados[i];
        }
    });
    $scope.preguntas = Pregunta.query({
        'cuestionario' : $routeParams.id
    });
        
    $scope.modificar = function () {
        $scope.modificando = true;
    };
    
    $scope.cancelar = function () {
        $scope.cuestionario = CuestionarioLegislatura.get({_id: $routeParams.id});
        $scope.modificando = false;
    };
    
    $scope.organigramaPorId = function (id) {
      for (var i = 0; i < $scope.organigrama.length; i++) {
          if ($scope.organigrama[i]._id == id)
          {
              return $scope.organigrama[i];
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
    
    $scope.imprimir = function () {
        $window.print(); 
    };
     
    $scope.eliminar = function(confirmado) {
        if (confirmado) {
            $scope.cuestionario.$delete(function() {
                $location.url('/preguntas/cuestionarios');
                //showAlert('El cuestionario se ha eliminado');
                $scope.alerts.push({type:'success', htmlMessage: 'El cuestionario se ha eliminado'});
            });
        }else{
            $("#confirmarEliminar").modal('show');
        }
    };
    
    $scope.guardar = function() {
      $scope.cuestionario.$save(function() {
          //showAlert('El cuestionario se ha actualizado con éxito');
          $scope.alerts.push({type:'success', htmlMessage: 'El cuestionario se ha actualizado con éxito'});
          $scope.modificando = false;
      });  
    };
}).controller('CuestionariosCtrl', function($scope, BloquePregunta, CuestionarioLegislatura, EventoPregunta, $window, $routeParams, $location) {
    $scope.filtro = $location.search();
    
    $scope.eventos = EventoPregunta.query();
    $scope.bloques = BloquePregunta.query();

    var buscar = function() {
        var q = {
            'evento._id': $scope.filtro.evento,
            'bloque._id': $scope.filtro.bloque
        };
        
        for (var k in q) {
            if (q[k] === undefined) {
                delete q[k];
            }
        }
        
        $scope.cuestionarios = CuestionarioLegislatura.query(q);
    };
    
    $scope.filtrar = function() {
        for (var k in $scope.filtro) {
            $location.search(k, $scope.filtro[k] || null);
        }
        
        buscar();
    };
    
    buscar();
    
    $scope.nuevoCuestionario = function() {
        $location.url('/preguntas/cuestionarios/nuevo');
    };
}).controller('NuevoCuestionarioCtrl', function($scope, EventoPregunta, BloquePregunta, CuestionarioLegislatura, $routeParams, $location) {
    $scope.eventos = EventoPregunta.query();
    $scope.bloques = BloquePregunta.query();
    $scope.cuestionario = new CuestionarioLegislatura();
    $scope.guardar = function() {
        $scope.cuestionario.$save(function() {
            //showAlert('El cuestionario se ha guardado con éxito');
            $scope.alerts.push({type:'success', htmlMessage: 'El cuestionario se ha actualizado con éxito'});
            $location.url('/preguntas/cuestionarios/' + $scope.cuestionario._id);
        });
    };
});