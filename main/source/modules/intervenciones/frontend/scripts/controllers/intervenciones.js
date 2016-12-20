angular.module('bag2.intervenciones', [])
.controller('IntervencionesCtrl', function($scope, Intervencion, $location) {
    $scope.intervenciones = Intervencion.list();
    $scope.ver = function(f) {
        $location.url('/intervenciones/' + f._id);
    };
    $scope.puedeModificar = function() {
            return true;
    };
    
}).controller('VerIntervencionCtrl', function($scope, Intervencion, $routeParams, $location) {
    $scope.intervencion = Intervencion.get({_id: $routeParams._id});
    
    $scope.$on('modificar', function() {
        $location.url('/intervenciones/' + $scope.intervencion._id + '/modifica');
    });
    
    $scope.puedeModificar = function() {
            return true;
    };
}).controller('NuevaIntervencionCtrl', function($scope, Comuna, Intervencion, Iniciativa, $routeParams, $location) {
    $scope.comunas = Comuna.query();
    if ($routeParams._id){
        $scope.intervencion = Intervencion.get({_id: $routeParams._id});
    } else {
        $scope.intervencion = new Intervencion();
    }
    $scope.iniciativas = Iniciativa.query();
    $scope.data = {
                intervencion: [],
            };
    
    $scope.uploaded = [];
    $scope.$watch('uploaded[0].id', function(newValue) {
        if (!newValue) {
            return;
        }
        if ($scope.intervencion) {
            if ($scope.intervencion.fotos === undefined) {
                $scope.intervencion.fotos = [];
            }
            $scope.intervencion.fotos.push($scope.uploaded.shift().id);
        }
    });
    $scope.uploadedMapa = [];
    $scope.$watch('uploadedMapa[0].id', function(newValue) {
        if (!newValue) {
            return;
        }
        if ($scope.intervencion) {
            $scope.intervencion.mapa = $scope.uploadedMapa.shift().id;
        }
    });
    
    $scope.agregarIniciativa = function() {
        if (!$scope.intervencion.iniciativas){
            $scope.intervencion.iniciativas = [];
        } else {
            $scope.intervencion.iniciativas.push($scope.data);
            $scope.data = {
                intervencion: [],
            };
        }
    };
    
    $scope.guardar = function() {
        $scope.intervencion.calle = $('#calle-typeahead').val();
        $scope.intervencion.$save(function(data) {
          $location.url('/intervenciones/' + $scope.intervencion._id);
        });
	};
});