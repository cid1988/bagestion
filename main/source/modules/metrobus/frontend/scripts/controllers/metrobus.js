angular.module('bag2.metrobus', [])
.controller('SegMetroCtrl', function($scope, $location, SeguimientoMetrobus) {
    
    $scope.jurisdiccionPorId = function (id) {
      for (var i = 0; i < $scope.jurisdicciones.length; i++) {
          if ($scope.jurisdicciones[i]._id == id)
          {
              return $scope.jurisdicciones[i];
          }
      }  
    };
    
    $scope.lista = SeguimientoMetrobus.query();
    $scope.ver = function(t) {
        $location.url('/metrobus/' + t._id);
    };
}).controller('DetalleSegMetroCtrl', function($scope, SeguimientoMetrobus, ORMOrganigrama, $routeParams, $location, FuenteTema) {
    $scope.item = SeguimientoMetrobus.get({_id: $routeParams._id});
    $scope.tab = "identificacion";
    $scope.fuentes = FuenteTema.query();
    $scope.jurisdicciones = ORMOrganigrama.query();  
    $scope.items = SeguimientoMetrobus.query();  
    
    $scope.jurisdiccionPorId = function (id) {
      for (var i = 0; i < $scope.jurisdicciones.length; i++) {
          if ($scope.jurisdicciones[i]._id == id)
          {
              return $scope.jurisdicciones[i];
          }
      }  
    };
    $scope.itemPorId = function (id) {
      for (var i = 0; i < $scope.items.length; i++) {
          if ($scope.items[i]._id == id)
          {
              return $scope.items[i];
          }
      }  
    };
    $scope.fuentePorId = function (id) {
      for (var i = 0; i < $scope.fuentes.length; i++) {
          if ($scope.fuentes[i]._id == id)
          {
              return $scope.fuentes[i];
          }
      }  
    };
    
    $scope.modificar = function () {
        $scope.modificando = true;
    };
    $scope.guardar = function() {
      $scope.item.$save(function() {
          $scope.modificando = false;
      });  
    };
}).controller('NuevoSegMetroCtrl', function($scope, SeguimientoMetrobus, $routeParams, $location) {
    $scope.item = new SeguimientoMetrobus();
    $scope.guardar = function() {
        $scope.item.$save(function(data) {
            $location.url('/metrobus');
        });
	};
});