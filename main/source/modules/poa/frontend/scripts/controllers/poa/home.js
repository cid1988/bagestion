angular.module('bag2.poa.controllers', [
'ng',
'service-api',
'luegg.directives',
'ui.select'])
.controller('POAHomeCtrl', function ($scope, API, Contactos) {
  API.poa.listarPlanes()
  .then(function (planes) {
    $scope.planes = planes;
  }, function (err) {
    $scope.error = err;
  });
  
	$scope.contactos = Contactos.listar();
    
    $scope.contactoPorId = function (id) {
      for (var i = 0; i < $scope.contactos.length; i++) {
          if ($scope.contactos[i]._id == id)
          {
              return $scope.contactos[i];
          }
      }  
    };
});
