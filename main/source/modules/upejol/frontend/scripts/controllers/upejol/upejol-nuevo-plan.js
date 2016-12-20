angular.module('bag2.upejol.nuevo', [])
.controller('UPEJOLNuevoPlanCtrl', function ($scope, API, PlanesUPEJOL, Contactos) {
	$scope.contactos = Contactos.listar();
  $scope.crear = function () {
      var planes = PlanesUPEJOL.query({
          anio : $scope.plan.anio,
          etapa : $scope.plan.etapa
      }, function(){
          if (planes.length) {
              alert("El plan para ese año y etapa ya existe");
          } else {
            API.poa.crearPlan2($scope.plan.anio, $scope.plan.etapa, $scope.plan.areas, $scope.plan.responsables)
            .then(function (res) {
              $scope.exito = res;
              $scope.error = null;
            }, function (err) {
              $scope.error = err;
            });
          }
      })
    
  };
  angular.extend($scope, {
    plan: {
      anio: new Date().getFullYear(),
      etapa: 'planificacion',
      areas: []
    }
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
.controller('UPEJOLModificaPlanCtrl', function ($scope, API, PlanesUPEJOL, Contactos, $routeParams, AreasUPEJOL, $location) {
	$scope.contactos = Contactos.listar();
	
	$scope.plan = PlanesUPEJOL.get({_id: $routeParams._id}, function() {
        $scope.plan.areas = [];
	});
	
	API.poa.listarAreas2($routeParams._id)
    .then(function (areas) {
      $scope.areasCargadas = areas;
    });
	
    $scope.guardar = function () {
        API.poa.actualizarPlan2($scope.plan._id, $scope.plan.etapa, $scope.plan.responsables, $scope.plan.areas)
        .then(function (res) {
          $scope.exito = res;
          $scope.error = null;
        }, function (err) {
          $scope.error = err;
        });
        $location.url('/upejol');
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
.controller("UPEJOLEditarAreasPlanCtrl", function ($scope, API) {
  API.poa.listarJurisdiccionesORM2()
  .then(function (jurisdiccionesORM) {
    $scope.jurisdicciones = jurisdiccionesORM;
  });
  
  $scope.nuevaArea = function (nombre) {
    return {
      nombreCompleto: nombre
    };
  };

  var ctrl = this;

  API.poa.listarContactosORM2()
  .then(function (contactos) {
    $scope.contactos = contactos;
  });
  
  $scope.$watch(function () {
    return ctrl.nuevaArea;
  }, function (j) {
    if (!j) return;
    
    ctrl.nuevaArea = undefined;
    
    if (!j.nombreCompleto) return; 
    
    for (var i = 0; i < $scope.plan.areas.length; i++) {
      if (
        $scope.plan.areas[i].idOrmOrganigrama && 
        $scope.plan.areas[i].idOrmOrganigrama === j._id) return;
    }
    
    $scope.plan.areas.push({
      idOrmOrganigrama: j._id,
      nombre: j.nombreCompleto
    });
  }, true);
  
  $scope.areaEscrita = function () {
      if ($scope.textoArea !== "") {
        $scope.plan.areas.push({
          idOrmOrganigrama: "0",
          idsOrmOrganigrama: [],
          nombre: $scope.textoArea
        });
        $scope.textoArea = "";
      }
  };
    
    $scope.asignarAreas = function(i) {
        $scope.seleccionado = i;
        $("#asignarArea").modal('show');
    };
    
    $scope.organigramaPorId = function (id) {
      for (var i = 0; i < $scope.jurisdicciones.length; i++) {
          if ($scope.jurisdicciones[i]._id == id)
          {
              return $scope.jurisdicciones[i];
          }
      }  
    };
  
});
