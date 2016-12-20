angular.module('bag2.djais', [])
.controller('DJAICtrl', function($scope, $location, $http, DJAI, User, $modal, $routeParams) {
	$scope.djais = DJAI.query();
    $scope.orden = 'numero';
})
.controller('DJAINuevoCtrl', function($scope, $location, $http, DJAI, ORMTema, User, $modal, $routeParams) {
	$scope.djai = new DJAI();
	$scope.temas = ORMTema.query();

    $scope.agregarComen = function(confirmado, data) {
        if (confirmado) {
            $scope.djai.comentarios.push(data);
        }
        else {
            if (!$scope.djai.comentarios){
                $scope.djai.comentarios = [];
            }
            var modalScope = $scope.$new();
            
            modalScope.data = {
                descripcion: '',
                cuando:undefined
            };
            $modal({template: '/views/djais/agregarComentario.html', persist: true, show: true, backdrop: 'static', scope: modalScope});
        }
    };
    
    $scope.mostrarTema = function (r) {
        if (r.eliminado) {
            return false; 
        } else {
            return true;
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
    
    //Agregar temas
    $scope.agregarTema = function(dataTema) {
        if (!$scope.djai.temas) {
            $scope.djai.temas = [];
        }
        $scope.djai.temas.push(dataTema);
        $scope.dataTema = "";
    };
    
    $scope.eliminarListaElem = function(elemento, lista) {
        lista.splice(lista.indexOf(elemento), 1);
    };
    
    $scope.reverse = function(array) {
        var copy = [].concat(array);
        return copy.reverse();
    };
    
    $scope.eliminarElemento = function(array,elemento) {
        var indice = array.indexOf(elemento);
        if(indice!=-1) array.splice(indice, 1);
    };
	
	$scope.guardar = function() {
        $scope.djai.$save();
	};
})
.controller('DJAIDetalleCtrl', function($scope, $location, $http, DJAI, ORMTema, User, $modal, $routeParams) {
    
    $scope.djai = DJAI.get({
        _id : $routeParams._id
    });
	$scope.temas = ORMTema.query();
    
    $scope.temaPorId = function (id) {
      for (var i = 0; i < $scope.temas.length; i++) {
          if ($scope.temas[i]._id == id)
          {
              return $scope.temas[i];
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
    
    $scope.reverse = function(array) {
        var copy = [].concat(array);
        return copy.reverse();
    };
    
    $scope.agregarComen = function(confirmado, data) {
        if (confirmado) {
            $scope.djai.comentarios.push(data);
        }
        else {
            if (!$scope.djai.comentarios){
                $scope.djai.comentarios = [];
            }
            var modalScope = $scope.$new();
            
            modalScope.data = {
                descripcion: '',
                cuando:undefined
            };
            $modal({template: '/views/djai/agregarComentario.html', persist: true, show: true, backdrop: 'static', scope: modalScope});
        }
    };
    
    $scope.guardar = function(){
        $scope.djai.$save();
    };
    
    //Agregar temas
    $scope.agregarTema = function(dataTema) {
        if (!$scope.djai.temas) {
            $scope.djai.temas = [];
        }
        $scope.djai.temas.push(dataTema);
        $scope.dataTema = "";
    };
    
    $scope.eliminarListaElem = function(elemento, lista) {
        lista.splice(lista.indexOf(elemento), 1);
    };
    
    $scope.eliminarElemento = function(array,elemento) {
        var indice = array.indexOf(elemento);
        if(indice!=-1) array.splice(indice, 1);
    };
    
    $scope.eliminar = function(confirmado) {
        if (confirmado) {
            $scope.djai.$delete(function() {
                $location.url('/djais');
            });
        }
        else {
            $("#confirmarEliminar").modal('show');
        }
    };
});
