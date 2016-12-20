angular.module('bag2.listas', [])
.controller('ListasCtrl', function($scope, $location, $http, Lista, User, $modal, $routeParams) {
    $scope.formData = {};
    $scope.formDataTarea = {};
    $scope.formDataSubTarea = {};
    $scope.editar = false;
    $scope.editarTarea = false;
    
    $scope.users = User.query();

	$scope.listas = Lista.query();
	$scope.listaImpresion = Lista.get({_id : $routeParams._id}, function(){
	    if ($routeParams.tarea){
	        $scope.tareaImpresion = $scope.listaImpresion.tareas[$routeParams.tarea];
	    }
	});
	
	$scope.pendientes = function() {
	    $scope.botonPendiente = true;
        $scope.listas = Lista.query({cumplido : false});
	};
	$scope.todas = function() {
	    $scope.botonPendiente = false;
        $scope.listas = Lista.query();
	};
	

	$scope.createLista = function() {
        $scope.formData.tareas = [];
        $scope.formData.usuarios = [];
        $scope.formData.cumplido = false;
        $scope.formData.usuarios.push($scope.username);
        $scope.formData.fechaCreada = new Date();
		$http.post('/api/listas', $scope.formData)
			.success(function(data) {
				$scope.formData = {};
				$scope.listas = Lista.query();
				console.log(data);
			})
			.error(function(data) {
				console.log('Error: ' + data);
			});
	};
	
	$scope.saveLista = function(idLista, valor) {
        var lista = Lista.get({_id : idLista}, function(){
            lista.cumplido = valor;
            lista.$save();
        });
	};
	
	$scope.listasUsuario = function(lista) {
	    if (lista.usuarios) {
            for (var i = 0; i < lista.usuarios.length; i++) {
                if (lista.usuarios[i] === $scope.username) {
                    return true;
                }
            }
	    }
        return false;
	};
	
	$scope.cantListas = function(listas) {
	    var canti = 0;
	    angular.forEach(listas, function (h){
	        if (h.usuarios.length) {
                for (var i = 0; i < h.usuarios.length; i++) {
                    if (h.usuarios[i] === $scope.username) {
                        canti = canti + 1;
                    }
                }
	        }
	    });
        return canti;
	};
	
	$scope.showLista = function(idLista) {
        $scope.listaSeleccionada = Lista.get({_id : idLista});
        $scope.seleccionado = false;
        $scope.anchoTarea = { 'width' : '73%' };
        $scope.editar = false;
	};
	
	$scope.agregarUsuario = function(nuevoUsuario) {
        $scope.listaSeleccionada.usuarios.push(nuevoUsuario);
	};
	
	$scope.showUsers = function(confirmado, idLista) {
        if (confirmado) {
            $scope.listaSeleccionada.$save();
        }
        else {
            $scope.listaSeleccionada = Lista.get({_id : idLista}, function(){
                $modal({template: '/views/listas/modalUsuarios.html', persist: true, show: true, backdrop: 'static', scope: $scope});
            });
        }
    };

	// delete a lista after checking it
	$scope.deleteLista = function(id) {
		$http.delete('/api/listas/' + id)
			.success(function(data) {
				$scope.listas = Lista.query();
				console.log(data);
			})
			.error(function(data) {
				console.log('Error: ' + data);
			});
	};
	
	$scope.createTarea = function(tarea) {
        tarea.subtareas = [];
        tarea.cumplido = false;
        tarea.fechaCreada = new Date();
        $scope.listaSeleccionada.tareas.push(tarea);
        $scope.formDataTarea = {};
        $scope.listaSeleccionada.$save();
	};
	
	$scope.showTarea = function(tarea) {
        $scope.seleccionado = true;
        $scope.anchoTarea = { 'width' : '40%' };
        $scope.tareaSeleccionada = tarea;
        $scope.editar = false;
	};
	
	$scope.editarTarea2 = function() {
        $scope.editar = true;
	};
	
	$scope.editarSubTarea = function() {
        $scope.editarTarea = true;
	};
	
	$scope.saveTarea = function() {
        $scope.editar = false;
        $scope.editarTarea = false;
        $scope.listaSeleccionada.$save();
	};
	
	$scope.saveSubTarea = function(indice) {
        $scope.editar = false;
        $scope.editarTarea = false;
        $scope.listaSeleccionada.tareas[indice] = $scope.tareaSeleccionada;
        $scope.listaSeleccionada.$save({}, function(){
            $scope.tareaSeleccionada = $scope.listaSeleccionada.tareas[indice];
        });
	};

	$scope.deleteTarea = function(tarea) {
        $scope.listaSeleccionada.tareas.splice($scope.listaSeleccionada.tareas.indexOf(tarea), 1);
        $scope.listaSeleccionada.$save();
	};
	
    $scope.subirTarea = function (tarea) {
      var posicion = $scope.listaSeleccionada.tareas.indexOf(tarea);
      if (posicion > 0) {
          $scope.listaSeleccionada.tareas.splice(posicion, 1);
          $scope.listaSeleccionada.tareas.splice(posicion - 1,0,tarea);
          $scope.listaSeleccionada.$save();
      }
    };
	
	$scope.createSubTarea = function(subtarea2, indice) {
        subtarea2.cumplido = false;
        subtarea2.fechaCreada = new Date();
        $scope.tareaSeleccionada.subtareas.push(subtarea2);
        $scope.listaSeleccionada.tareas[indice] = $scope.tareaSeleccionada;
        $scope.formDataSubTarea = {};
        $scope.listaSeleccionada.$save({}, function(){
            $scope.tareaSeleccionada = $scope.listaSeleccionada.tareas[indice];
        });
	};
	
	$scope.deleteSubTarea = function(subTarea3, indice) {
        $scope.tareaSeleccionada.subtareas.splice($scope.tareaSeleccionada.subtareas.indexOf(subTarea3), 1);
        $scope.listaSeleccionada.tareas[indice] = $scope.tareaSeleccionada;
        $scope.listaSeleccionada.$save({}, function(){
            $scope.tareaSeleccionada = $scope.listaSeleccionada.tareas[indice];
        });
	};
	
    $scope.subirSubTarea = function (subTarea3, indice) {
      var posicion = $scope.tareaSeleccionada.subtareas.indexOf(subTarea3);
      if (posicion > 0) {
          $scope.tareaSeleccionada.subtareas.splice(posicion, 1);
          $scope.tareaSeleccionada.subtareas.splice(posicion - 1,0,subTarea3);
          $scope.listaSeleccionada.tareas[indice] = $scope.tareaSeleccionada;
          $scope.listaSeleccionada.$save({}, function(){
            $scope.tareaSeleccionada = $scope.listaSeleccionada.tareas[indice];
        });
      }
    };
});