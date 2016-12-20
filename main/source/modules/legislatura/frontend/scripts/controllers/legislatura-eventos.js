angular.module('bag2.legislatura.eventos', [])
.controller('EventosCtrl', function($scope, EventoPregunta, $location) {
    $scope.eventos = EventoPregunta.query();
}).controller('VerEventoCtrl', function($scope, EventoPregunta, $routeParams, $location) {
    $scope.evento = EventoPregunta.get({_id: $routeParams.id});
    $scope.modificar = function () {
        $scope.modificando = true;
    };
    
    $scope.eliminar = function(confirmado) {
        if (confirmado) {
            $scope.evento.$delete(function() {
                $location.url('/preguntas/eventos');
                //showAlert('El evento se ha eliminado');
                $scope.alerts.push({type:'success', htmlMessage: 'El evento se ha eliminado'});
            });
        }else{
            $("#confirmarEliminar").modal('show');
        }
    };
    
    $scope.cancelar = function () {
        $scope.evento = EventoPregunta.get({_id: $routeParams.id});
        $scope.modificando = false;
    };
    
    $scope.guardar = function() {
      $scope.evento.$save(function() {
          //showAlert('El evento se ha actualizado con éxito');
          $scope.alerts.push({type:'success', htmlMessage: 'El evento se ha actualizado con éxito'});
          $scope.modificando = false;
      });  
    };
}).controller('NuevoEventoCtrl', function($scope, EventoPregunta, $routeParams, $location) {
    $scope.evento = new EventoPregunta();
    $scope.guardar = function() {
        $scope.evento.$save(function() {
            //showAlert('El evento se ha guardado con éxito');
            $scope.alerts.push({type:'success', htmlMessage: 'El evento se ha guardado con éxito'});
            $location.url('/preguntas/eventos/' + $scope.evento._id);
        });
    };
}).controller('PrintEventoCtrl', function($scope, EventoPregunta, Pregunta, $window, $routeParams, ORMOrganigrama, CuestionarioLegislatura, Contactos, $location) {
    $scope.evento = EventoPregunta.get({_id: $routeParams.id});
    $scope.cuestionarios = CuestionarioLegislatura.query();
	$scope.contactos = Contactos.listar();
	$scope.organigrama = ORMOrganigrama.query();
        
    $scope.preguntas = Pregunta.query({
    'evento' : $routeParams.id
    });
    
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
    
    $scope.organigramaPorId = function (id) {
      for (var i = 0; i < $scope.organigrama.length; i++) {
          if ($scope.organigrama[i]._id == id)
          {
              return $scope.organigrama[i];
          }
      }  
    };
    
    $scope.imprimir = function () {
        $window.print(); 
    };
});