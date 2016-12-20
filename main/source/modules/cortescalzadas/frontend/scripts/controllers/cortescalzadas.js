angular.module('bag2.cortescalzadas', [])
.controller('CortesCalzadasCtrl', function($scope, $location, $http, Comuna, CorteCalzada, User, $modal, $routeParams, BarrioRegularizacionDominial) {
	$scope.cortes = CorteCalzada.query();
	$scope.comunas = Comuna.query();
	$scope.barrios = BarrioRegularizacionDominial.query();
    $scope.orden = 'tarea';
    $scope.fecha = {
        desde : "",
        hasta : ""
    };
    $scope.comunaPorId = function (id) {
      for (var i = 0; i < $scope.comunas.length; i++) {
          if ($scope.comunas[i]._id == id)
          {
              return $scope.comunas[i];
          }
      }  
    };
    
    $scope.barrioPorId = function (id) {
      for (var i = 0; i < $scope.barrios.length; i++) {
          if ($scope.barrios[i]._id == id)
          {
              return $scope.barrios[i].nombre;
          }
      }  
    };
    
    $scope.$watch('fecha.desde', function (fecha){
        if (fecha) {
            var d = new Date(fecha.slice(6), fecha.slice(3,5)-1, fecha.slice(0,2), 0, 0, 0, 0);
            if ($scope.fecha.hasta) {
                var h = new Date($scope.fecha.hasta.slice(6), $scope.fecha.hasta.slice(3,5)-1, $scope.fecha.hasta.slice(0,2), 0, 0, 0, 0);
            } else {
                var h = new Date();
            }
        }
        
    });
    
    $scope.$watch('fecha.hasta', function (fecha2){
        if (fecha2) {
            var h = new Date(fecha2.slice(6), fecha2.slice(3,5)-1, fecha2.slice(0,2), 0, 0, 0, 0);
            if ($scope.fecha.desde) {
                var d = new Date($scope.fecha.desde.slice(6), $scope.fecha.desde.slice(3,5)-1, $scope.fecha.desde.slice(0,2), 0, 0, 0, 0);
            } else {
                var d = new Date(1900, 1, 1, 0, 0, 0, 0);
            }
        }
    });
    
	$http.get('/scripts/calles.js')
	.success(function (calles) {
	  $scope.calles = calles;
	})
})
.controller('CorteCalzadaNuevoCtrl', function($scope, $location, $http, CorteCalzada, Comuna, ORMTema, User, $modal, $routeParams, BarrioRegularizacionDominial) {
	$scope.corte = new CorteCalzada();
	$scope.barrios = BarrioRegularizacionDominial.query();
	$scope.temas = ORMTema.query();
	$scope.comunas = Comuna.query();
    $scope.inconvenientes = ["TRANSITO RESTRINGIDO", "CERRADO AL TRANSITO"];
    $scope.tiposTarea = ["REHABILITACIÓN DE CALZADA"];
    $scope.turnos = ["DIURNO", "NOCTURNO", "DIURNO Y NOCTURNO"];
    $scope.pavimentos = ["ASFALTO", "HORMIGON"];
    $scope.ocupaciones = ["2 Carriles Alternativamente", "1 Carril Alternativamente", "1,5 Carriles"];
    
    $scope.agregarComen = function(confirmado, data) {
        if (confirmado) {
            $scope.corte.comentarios.push(data);
        }
        else {
            if (!$scope.corte.comentarios){
                $scope.corte.comentarios = [];
            }
            var modalScope = $scope.$new();
            
            modalScope.data = {
                descripcion: '',
                cuando:undefined
            };
            $modal({template: '/views/cortescalzadas/agregarComentario.html', persist: true, show: true, backdrop: 'static', scope: modalScope});
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
        if (!$scope.corte.temas) {
            $scope.corte.temas = [];
        }
        $scope.corte.temas.push(dataTema);
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
        $scope.corte.$save();
	};
})
.controller('CorteCalzadaDetalleCtrl', function($scope, $location, $http, CorteCalzada, Comuna, ORMTema, User, $modal, $routeParams, BarrioRegularizacionDominial) {
    
    $scope.corte = CorteCalzada.get({
        _id : $routeParams._id
    });
	$scope.barrios = BarrioRegularizacionDominial.query();
	$scope.temas = ORMTema.query();
	$scope.comunas = Comuna.query();
    $scope.inconvenientes = ["TRANSITO RESTRINGIDO", "CERRADO AL TRANSITO"];
    $scope.tiposTarea = ["REHABILITACIÓN DE CALZADA"];
    $scope.turnos = ["DIURNO", "NOCTURNO", "DIURNO Y NOCTURNO"];
    $scope.pavimentos = ["ASFALTO", "HORMIGON"];
    $scope.ocupaciones = ["2 Carriles Alternativamente", "1 Carril Alternativamente", "1,5 Carriles"];
    
    $scope.comunaPorId = function (id) {
      for (var i = 0; i < $scope.comunas.length; i++) {
          if ($scope.comunas[i]._id == id)
          {
              return $scope.comunas[i];
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
    
    $scope.temaPorId = function (id) {
      for (var i = 0; i < $scope.temas.length; i++) {
          if ($scope.temas[i]._id == id)
          {
              return $scope.temas[i];
          }
      }  
    };
    
    $scope.reverse = function(array) {
        var copy = [].concat(array);
        return copy.reverse();
    };
    
    $scope.agregarComen = function(confirmado, data) {
        if (confirmado) {
            $scope.corte.comentarios.push(data);
        }
        else {
            if (!$scope.corte.comentarios){
                $scope.corte.comentarios = [];
            }
            var modalScope = $scope.$new();
            
            modalScope.data = {
                descripcion: '',
                cuando:undefined
            };
            $modal({template: '/views/cortescalzadas/agregarComentario.html', persist: true, show: true, backdrop: 'static', scope: modalScope});
        }
    };
    
    //Agregar temas
    $scope.agregarTema = function(dataTema) {
        if (!$scope.corte.temas) {
            $scope.corte.temas = [];
        }
        $scope.corte.temas.push(dataTema);
        $scope.dataTema = "";
    };
    
    $scope.eliminarListaElem = function(elemento, lista) {
        lista.splice(lista.indexOf(elemento), 1);
    };
    
    $scope.guardar = function(){
        $scope.corte.$save();
    };
    
    $scope.eliminarElemento = function(array,elemento) {
        var indice = array.indexOf(elemento);
        if(indice!=-1) array.splice(indice, 1);
    };
    
    $scope.eliminar = function(confirmado) {
        if (confirmado) {
            $scope.corte.$delete(function() {
                $location.url('/cortescalzadas');
            });
        }
        else {
            $("#confirmarEliminar").modal('show');
        }
    };
})
.controller('CortesCalzadasCompromisosCtrl', function($scope, $location, $http, Comuna, CorteCalzadaCompromiso, User, $modal, $routeParams) {
	$scope.compromisos = CorteCalzadaCompromiso.query();
    $scope.orden = 'tarea';
})    
.controller('CCNuevoCompromisoCtrl', function($scope, $window, CorteCalzadaCompromiso) {
    $scope.cancelarCambios = function() {
        $scope.html = $scope.$eval('nuevo.html');
        $scope.cambios = false;
    };
    $scope.nuevo = new CorteCalzadaCompromiso();

    $scope.$on('html-changed', function() {
        $scope.cambios = true;
    });
    
    $scope.imprimir = function () {
        $window.print(); 
    };

    // si cambia la instancia, actualizamos el html
    $scope.$watch('nuevo', $scope.cancelarCambios);

    // al guardar la nota, sólo vamos a cambiar el html
    $scope.guardarNota = function() {
        if ($scope.nuevo) {
            var f = new Date();
            $scope.nuevo.fecha = (f.getDate() + "/" + (f.getMonth() +1) + "/" + f.getFullYear() + " - " + f.getHours() + ":" + f.getMinutes());
            $scope.nuevo.usuario = $scope.username;
            $scope.nuevo.html = $scope.html;
            $scope.nuevo.$save(function() {
                $scope.cambios = false;
            });
        }
    };
})    
.controller('CCDetalleCompromisoCtrl', function($scope, $window, CorteCalzadaCompromiso, $routeParams) {
    $scope.cancelarCambios = function() {
        $scope.html = $scope.$eval('compromiso.html');
        $scope.cambios = false;
    };
    $scope.editando = false;
    
    $scope.compromiso = CorteCalzadaCompromiso.get({
        _id : $routeParams._id
    }, function() {
        $scope.html = $scope.$eval('compromiso.html');
    });

    $scope.$on('html-changed', function() {
        $scope.cambios = true;
    });
    
    $scope.imprimir = function () {
        $window.print(); 
    };

    // si cambia la instancia, actualizamos el html
    $scope.$watch('compromiso', $scope.cancelarCambios);

    // al guardar la nota, sólo vamos a cambiar el html
    $scope.guardarNota = function() {
        if ($scope.compromiso) {
            var f = new Date();
            $scope.compromiso.fecha = (f.getDate() + "/" + (f.getMonth() +1) + "/" + f.getFullYear() + " - " + f.getHours() + ":" + f.getMinutes());
            $scope.compromiso.usuario = $scope.username;
            $scope.compromiso.html = $scope.html;
            $scope.compromiso.$save(function() {
                $scope.cambios = false;
            });
        }
    };
});
