angular.module('bag2.funcionarios', [])
.controller('FuncionariosCtrl', function($scope, Funcionario, $location) {
    $scope.funcionarios = Funcionario.list();
    $scope.ver = function(f) {
        $location.url('/funcionarios/' + f._id);
    };
    $scope.puedeModificar = function() {
            return true;
    };
}).controller('VerFuncionarioCtrl', function($scope, Funcionario, Jurisdiccion, $routeParams, $location) {
    $scope.funcionario = Funcionario.get({_id: $routeParams._id});
    $scope.jurisdicciones = Jurisdiccion.query();
    $scope.modificar = function () {
        $scope.modificando = true;
    };
    $scope.guardar = function() {
      $scope.funcionario.$save(function() {
          $scope.modificando = false;
      });  
    };
    
    $scope.puedeModificar = function() {
            return true;
    };
}).controller('NuevoFuncionarioCtrl', function($scope, Funcionario, Jurisdiccion, $routeParams, $location) {
    $scope.jurisdicciones = Jurisdiccion.query();    
    $scope.funcionario = new Funcionario();
    $scope.guardar = function() {
        $scope.funcionario.$save(function(data) {
            $location.url('/funcionarios');
        });
	};
});