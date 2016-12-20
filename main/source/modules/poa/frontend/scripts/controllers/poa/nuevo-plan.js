angular.module('bag2.poa.controllers')
.controller('POANuevoPlanCtrl', function ($scope, API, Planes, Contactos, Proyectos) {
	$scope.contactos = Contactos.listar();
    $scope.crear = function () {
      var planes = Planes.query({
          anio : $scope.plan.anio,
          etapa : $scope.plan.etapa
      }, function(){
          if (planes.length) {
              alert("El plan para ese año y etapa ya existe");
          } else {
            API.poa.crearPlan($scope.plan.anio, $scope.plan.etapa, $scope.plan.jurisdicciones, $scope.plan.responsables)
            .then(function (res) {
              $scope.exito = res;
              $scope.error = null;
            }, function (err) {
              $scope.error = err;
            });
          }
      });
    };
    
    angular.extend($scope, {
        plan: {
          anio: new Date().getFullYear()+1,
          etapa: 'planificacion',
          jurisdicciones: []
        }
    });
  
    $scope.$watch('plan.anio', function (anio) {
	    $scope.proyectos = [];
        var proyectos = Proyectos.query({eliminado: JSON.stringify({$exists: false})}, function() {
            proyectos.forEach(function(proye){
                if (proye.fechaFin) {
                    if (proye.fechaFin.slice(proye.fechaFin.length-4, proye.fechaFin.length) >= anio) {
                        $scope.proyectos.push(proye);
                    }
                }
            });
        });
    });
  
    //Agregar responsables
    $scope.agregarResponsable = function(dataRespon) {
        if (!$scope.plan.responsables) {
            $scope.plan.responsables = [];
        }
        $scope.plan.responsables.push(dataRespon);
        $scope.dataRespon = "";
    };
    
    $scope.contactoPorId = function (id) {
      for (var i = 0; i < $scope.contactos.length; i++) {
          if ($scope.contactos[i]._id == id)
          {
              return $scope.contactos[i];
          }
      }  
    };
    
    $scope.eliminarListaElem = function(elemento, lista) {
        lista.splice(lista.indexOf(elemento), 1);
    };
})
.controller('POAModificaPlanCtrl', function ($scope, API, Planes, Contactos, $routeParams, Jurisdicciones, $location) {
	$scope.contactos = Contactos.listar();
	
	$scope.plan = Planes.get({_id: $routeParams._id}, function() {
        $scope.plan.jurisdicciones = [];
	});
	
	API.poa.listarJurisdicciones($routeParams._id)
    .then(function (jurisdicciones) {
      $scope.jurisdiccionesCargadas = jurisdicciones;
    });
	
    $scope.guardar = function () {
        API.poa.actualizarPlan($scope.plan._id, $scope.plan.etapa, $scope.plan.responsables, $scope.plan.jurisdicciones)
        .then(function (res) {
          $scope.exito = res;
          $scope.error = null;
        }, function (err) {
          $scope.error = err;
        });
        $location.url('/poa');
    };
  
    //Agregar responsables
    $scope.agregarResponsable = function(dataRespon) {
        if (!$scope.plan.responsables) {
            $scope.plan.responsables = [];
        }
        $scope.plan.responsables.push(dataRespon);
        $scope.dataRespon = "";
    };
    
    $scope.contactoPorId = function (id) {
      for (var i = 0; i < $scope.contactos.length; i++) {
          if ($scope.contactos[i]._id == id)
          {
              return $scope.contactos[i];
          }
      }  
    };
    
    $scope.eliminarListaElem = function(elemento, lista) {
        lista.splice(lista.indexOf(elemento), 1);
    };
})
.controller("POAEditarJurisdiccionesPlanCtrl", function ($scope, API) {
  API.poa.listarJurisdiccionesORM()
  .then(function (jurisdiccionesORM) {
    $scope.jurisdicciones = jurisdiccionesORM;
  });
  
  $scope.nuevaJurisdiccion = function (nombre) {
    return {
      nombreCompleto: nombre
    };
  };

  var ctrl = this;

  API.poa.listarContactosORM()
  .then(function (contactos) {
    $scope.contactos = contactos;
  });
  
  $scope.$watch(function () {
    return ctrl.nuevaJurisdiccion;
  }, function (j) {
    if (!j) return;
    
    ctrl.nuevaJurisdiccion = undefined;
    
    if (!j.nombreCompleto) return; 
    
    for (var i = 0; i < $scope.plan.jurisdicciones.length; i++) {
      if (
        $scope.plan.jurisdicciones[i].idOrmOrganigrama && 
        $scope.plan.jurisdicciones[i].idOrmOrganigrama === j._id) return;
    }
    
    $scope.plan.jurisdicciones.push({
      idOrmOrganigrama: j._id,
      nombre: j.nombreCompleto
    });
  }, true);
  
  $scope.jurisdiccionEscrita = function () {
      if ($scope.textoJurisdiccion !== "") {
        $scope.plan.jurisdicciones.push({
          idOrmOrganigrama: "0",
          idsOrmOrganigrama: [],
          nombre: $scope.textoJurisdiccion
        });
        $scope.textoJurisdiccion = "";
      }
  };
    
    $scope.asignarJurisdicciones = function(i) {
        $scope.seleccionado = i;
        $("#asignarJurisdiccion").modal('show');
    };
    
    $scope.organigramaPorId = function (id) {
      for (var i = 0; i < $scope.jurisdicciones.length; i++) {
          if ($scope.jurisdicciones[i]._id == id)
          {
              return $scope.jurisdicciones[i];
          }
      }  
    };
  
})
.controller("ResponsableDeCargaCtrl", function($scope) {
//  var self = this;

//  $scope.$watch(function () {
//    return self.nuevoResponsable;
//  }, function (nr) {
//    if (!nr) return;
//    
//    $scope.j.responsable = {
//      nombre: nr.nombre,
//      apellidos: nr.apellidos,
//      idOrmContactos: nr._id
//    };
//    
//    $scope.nuevoResponsable = undefined;
//  }, true);
});
