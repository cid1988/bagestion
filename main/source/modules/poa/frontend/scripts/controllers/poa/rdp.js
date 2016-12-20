angular.module('bag2.poa.controllers')
.controller('POARDPCtrl', function ($location, $scope, API, Jurisdicciones) {
  $scope.anio = new Date().getFullYear();
  $scope.jurisdicciones = Jurisdicciones.query({
      anio : $scope.anio
  });
})
.controller('POARDPJurisdiccionCtrl', function ($location, $routeParams, $scope, API, Jurisdicciones, ObjImpacto) {
  $scope.anio = new Date().getFullYear();
  $scope.jurisdiccion = Jurisdicciones.get({
      _id : $routeParams._id
  }, function() {
      $scope.impactos = [];
      var todosImpactos = ObjImpacto.query({}, function() {
          angular.forEach(todosImpactos, function (t) {
              if (t.idJurisdiccion == $routeParams._id) {
                 $scope.impactos.push(t); 
              }
          });
      });
  });
})
.controller('POARDPImpactoCtrl', function ($location, $routeParams, $scope, API, ObjImpacto, ObjMinisteriales, ObjOperativos) {
  $scope.anio = new Date().getFullYear();
  $scope.impacto = ObjImpacto.get({
      _id : $routeParams._id
  }, function() {
      $scope.ministeriales = [];
      var todosMinisteriales = ObjMinisteriales.query({}, function() {
          angular.forEach(todosMinisteriales, function (t) {
              if (t.idObjImpacto == $routeParams._id) {
                 $scope.ministeriales.push(t); 
              }
          });
      });
      $scope.operativos = ObjOperativos.query();
  });
})
.controller('POARDPOperativoCtrl', function ($location, $routeParams, $scope, API, ObjImpacto, ObjMinisteriales, ObjOperativos, Proyectos) {
  $scope.anio = new Date().getFullYear();
  var ministeriales = ObjMinisteriales.query();
  var impactos = ObjImpacto.query();
    
    $scope.impactoPorId = function (id) {
      for (var i = 0; i < impactos.length; i++) {
          if (impactos[i]._id == id)
          {
              return impactos[i];
          }
      }  
    };
    
    $scope.ministerialPorId = function (id) {
      for (var i = 0; i < ministeriales.length; i++) {
          if (ministeriales[i]._id == id)
          {
              return ministeriales[i];
          }
      }  
    };
  $scope.operativo = ObjOperativos.get({
      _id : $routeParams._id
  }, function() {
      $scope.proyectos = [];
      var todosProyectos = Proyectos.query({eliminado: JSON.stringify({$exists: false})}, function() {
          angular.forEach(todosProyectos, function (t) {
              if (t.idObjOperativo == $routeParams._id) {
                 $scope.proyectos.push(t); 
              }
          });
      });
  });
})
.controller('POARDPProyectoCtrl', function ($location, $routeParams, $scope, API, ObjImpacto, ObjMinisteriales, ObjOperativos, Jurisdicciones, Proyectos) {
  $scope.anio = new Date().getFullYear();
  var ministeriales = ObjMinisteriales.query();
  var impactos = ObjImpacto.query();
  var operativos = ObjOperativos.query();
  var jurisdicciones = Jurisdicciones.query();
    
    $scope.impactoPorId = function (id) {
      for (var i = 0; i < impactos.length; i++) {
          if (impactos[i]._id == id)
          {
              return impactos[i];
          }
      }  
    };
    
    $scope.ministerialPorId = function (id) {
      for (var i = 0; i < ministeriales.length; i++) {
          if (ministeriales[i]._id == id)
          {
              return ministeriales[i];
          }
      }  
    };
    
    $scope.operativoPorId = function (id) {
      for (var i = 0; i < operativos.length; i++) {
          if (operativos[i]._id == id)
          {
              return operativos[i];
          }
      }  
    };
    
    $scope.jurisdiccionPorId = function (id) {
      for (var i = 0; i < jurisdicciones.length; i++) {
          if (jurisdicciones[i]._id == id)
          {
              return jurisdicciones[i];
          }
      }  
    };
  $scope.proyecto = Proyectos.get({
      _id : $routeParams._id
  });
})
.controller('POARDPHitosCtrl', function ($location, $routeParams, $scope, API, ObjImpacto, ObjMinisteriales, ObjOperativos, Jurisdicciones, Proyectos, HitosActividades) {
  $scope.anio = new Date().getFullYear();
  var ministeriales = ObjMinisteriales.query();
  var impactos = ObjImpacto.query();
  var operativos = ObjOperativos.query();
  var jurisdicciones = Jurisdicciones.query();
    
    $scope.impactoPorId = function (id) {
      for (var i = 0; i < impactos.length; i++) {
          if (impactos[i]._id == id)
          {
              return impactos[i];
          }
      }  
    };
    
    $scope.ministerialPorId = function (id) {
      for (var i = 0; i < ministeriales.length; i++) {
          if (ministeriales[i]._id == id)
          {
              return ministeriales[i];
          }
      }  
    };
    
    $scope.operativoPorId = function (id) {
      for (var i = 0; i < operativos.length; i++) {
          if (operativos[i]._id == id)
          {
              return operativos[i];
          }
      }  
    };
    
    $scope.jurisdiccionPorId = function (id) {
      for (var i = 0; i < jurisdicciones.length; i++) {
          if (jurisdicciones[i]._id == id)
          {
              return jurisdicciones[i];
          }
      }  
    };
  
    $scope.dameFecha = function(hito) {
        if (hito.fechaFinalizada) {
            return (hito.fechaFinalizada + " (R)");
        } else if (hito.fechaEstimadaFin) {
            return (hito.fechaEstimadaFin + " (E)");
        } else if (hito.fechaFinPlanificada) {
            return (hito.fechaFinPlanificada + " (P)");
        } else {
            return " ";
        }
        
    };

  $scope.proyecto = Proyectos.get({
      _id : $routeParams._id
  }, function() {
      $scope.hitos = [];
      var todosHitos = HitosActividades.query({}, function() {
          angular.forEach(todosHitos, function (t) {
              if (t.idProyecto == $routeParams._id) {
                 $scope.hitos.push(t); 
              }
          });
      });
  });
});
