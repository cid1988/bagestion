angular.module('bag2.upejol.home', [
'ng',
'service-api',
'luegg.directives',
'ui.select'])
.controller('UPEJOLHomeCtrl', function ($scope, API, Contactos, FormasDePagoUPEJOL) {
  API.poa.listarPlanes2()
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
    
    
    $scope.listaDeFormas = FormasDePagoUPEJOL.query();
    $scope.formasPago = new FormasDePagoUPEJOL();
    
    $scope.agregarFormaDePago =  function(nuevo){
       $scope.formasPago.nombre = nuevo.nombre;
       $scope.formasPago.$save({},function(){
            $scope.listaDeFormas = FormasDePagoUPEJOL.query();  
       });
       $scope.formasPago = new FormasDePagoUPEJOL();
    };
    
    $scope.eliminarFormaDePago = function(e){
        FormasDePagoUPEJOL.remove(e, function(){
            $scope.listaDeFormas = FormasDePagoUPEJOL.query();  
        });
        
        alert("Se borro");
    };
    
});
