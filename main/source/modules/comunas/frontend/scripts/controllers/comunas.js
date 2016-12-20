angular.module('bag2.comunas', [])
.controller('ComunasCtrl', function($scope, Comuna, $location) {
    $scope.comunas = Comuna.list();
    $scope.ver = function(c) {
        $location.url('/comunas/' + c._id);
    };
}).controller('VerComunaCtrl', function($scope, Comuna, $routeParams, $location) {
    $scope.comuna = Comuna.get({_id: $routeParams._id});
    $scope.modificando = false;
    $scope.modificar = function () {
        $scope.modificando = true;
    };
    $scope.cancelar = function () {
        $scope.comuna = Comuna.get({_id: $routeParams._id});
        $scope.modificando = false;
    };
    $scope.guardar = function() {
        $scope.comuna.calle = $('#calle-typeahead').val();
        $scope.comuna.$save(function() {
            $scope.modificando = false;
        });  
    };
    $scope.puedeModificar = function() {
            return true;
    };
});