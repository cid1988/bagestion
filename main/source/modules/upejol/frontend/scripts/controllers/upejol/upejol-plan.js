angular.module('bag2.upejol.plan', [])
.controller('UPEJOLPlanNavbarCtrl', function ($scope, $location) {
})
.controller('UPEJOLPlanAreasCtrl', function ($scope, API) {
  API.poa.listarContactosORM2()
  .then(function (contactos) {
    $scope.contactos = contactos;
  });
    
  $scope.$watch('plan._id', function (idPlan) {
    if (!idPlan) {
      $scope.areas = null;
      return;
    }
      
    API.poa.listarAreas2(idPlan)
    .then(function (areas) {
      $scope.areas = areas;
    });
  });
})
.controller('UPEJOLPlanCtrl', function ($scope, API, $routeParams, $location, $q, User) {
  $scope.tabCtrl = ctrl = this;
  
    $scope.user = User.findByName({
        username: $scope.username
    });
  
  ctrl.filtro = {};
  
  if ($routeParams.etapa == 'planificacion') {
      $scope.nombrePlan = 'Planificacion ' + $routeParams.anio;
  } else {
      $scope.nombrePlan = 'Seguimiento ' + $routeParams.anio;
  }
    
  API.poa.traerPlan2($routeParams.anio, $routeParams.etapa)
  .then(function (plan) {
    if (!plan) {
      ctrl.error = 'No existe el plan';
      
      return;
    }
    
    function recargarActividades() {
      return API.poa.listarActividades2(plan._id)
      .then(function (actividades) {
        ctrl.actividades = actividades;
        
        seleccionarActividad($location.search.actividad, actividades, ctrl.filtro);
      }, function (err) {
        $scope.tabCtrl.error = err;
      });
    }
    
    function recargarAreas() {
      return API.poa.listarAreas2(plan._id)
      .then(function(areas) {
        ctrl.areas = areas;
        
        seleccionarArea($location.search().area, areas, ctrl.filtro);
      }, function (err) {
        $scope.tabCtrl.error = err;
      });
    }
    
    function recargarObjsArea() {
      return API.poa.listarObjsArea2(plan._id)
      .then(function(objsArea) {
        ctrl.objsArea = objsArea;
        
        seleccionarObjArea($location.search().objArea, objsArea, ctrl.filtro);
      }, function (err) {
        $scope.tabCtrl.error = err;
      });
    }
    
    function recargarActividades() {
      return API.poa.listarActividades2(plan._id)
      .then(function(actividades) {
        ctrl.actividades = actividades;
        
        seleccionarActividad($location.search().actividad, actividades, ctrl.filtro);
      }, function (err) {
        $scope.tabCtrl.error = err;
      });
    }
    
    function recargarHitos() {
      return API.poa.listarHitos2(plan._id)
      .then(function(hitos) {
        ctrl.hitos = hitos;
        
        seleccionarHito($location.search().hito, hitos, ctrl.filtro);
      }, function (err) {
        $scope.tabCtrl.error = err;
      });
    }
    
    function seleccionarArea(id, areas, filtro) {
      if (!id) filtro.area = null;
    
      for (var i = 0; i < areas.length; i++) {
        if (areas[i]._id === id) {
          filtro.area = areas[i];
          break;
        }
      }
    }
    
    function seleccionarObjArea(id, objsArea, filtro) {
      if (!id) filtro.objArea = null;
      
      for (var i = 0; i < objsArea.length; i++) {
        if (objsArea[i]._id === id) {
          filtro.objArea = objsArea[i];
          break;
        }
      }
    }
    
    function seleccionarActividad(id, actividades, filtro) {
      if (!id) filtro.actividad = null;
      
      for (var i = 0; i < actividades.length; i++) {
        if (actividades[i]._id === id) {
          filtro.actividad = actividades[i];
          break;
        }
      }
    }
    
    function seleccionarHito(id, hitos, filtro) {
      if (!id) filtro.hito = null;
      
      for (var i = 0; i < hitos.length; i++) {
        if (hitos[i]._id === id) {
          filtro.hito = hitos[i];
          break;
        }
      }
    }
    
    $scope.$on('recargar-areas', recargarAreas);
    $scope.$on('recargar-objetivos-area', recargarObjsArea);
    $scope.$on('recargar-actividades', recargarActividades);
    $scope.$on('recargar-hitos', recargarHitos);
    
    ctrl.plan = plan;
    
    $q.all([
      recargarAreas(),
      recargarObjsArea(),
      recargarActividades(),
      recargarHitos()
    ])
    .then(function () {
      $scope.$watch(function () {
        return ctrl.filtro;
      }, function (filtro) {
        if (!filtro) return;
      
        // el filtro ya existe, remplazamos la url con el filtro
        var search = {};
        
        if (ctrl.filtro.area) search.area = ctrl.filtro.area._id;
        if (ctrl.filtro.objArea) search.objArea = ctrl.filtro.objArea._id;
        if (ctrl.filtro.actividad) search.actividad = ctrl.filtro.actividad._id;
        
        $location.search(search);
      }, true);
    })
  }, function (err) {
    ctrl.error = err;
  });
})
.controller('UPEJOLNuevoObjAreaCtrl', function ($scope, API) {
  $scope.permisoObArea = function () {
      if ((($scope.tabCtrl.plan.etapa == "planificacion") && $scope.hasPermission('upejol.planificacion')) || (($scope.tabCtrl.plan.etapa == "seguimiento") && $scope.hasPermission('upejol.seguimiento'))) {
          if ($scope.hasPermission('upejol.administrador')) {
              return true;
          } else {
              if ($scope.tabCtrl.filtro.area.aprobado) {
                  return false;
              } else {
                  if ($scope.hasPermission('upejol.editarArea') && ($scope.tabCtrl.filtro.area.idOrmOrganigrama == $scope.user.jurisdiccion)) {
                      return true;
                  } else {
                      if ($scope.tabCtrl.filtro.area.idsOrmOrganigrama) {
                          if ($scope.hasPermission('upejol.editarArea') && ($scope.tabCtrl.filtro.area.idsOrmOrganigrama.indexOf($scope.user.jurisdiccion) >= 0)) {
                              return true;
                          } else {
                              return false;
                          }
                      } else {
                        return false;
                      }
                  }
              }
          }
      } else {
          return false;
      }
  };
   
  $scope.crear = function () {
    var params = $scope.$eval('{ idArea: tabCtrl.filtro.area._id, nombre: nuevo.nombre }');
    
    if (!params.idArea || !params.nombre) return;
    
    API.poa.crearObjArea2(params.idArea, params.nombre)
    .then (function (objArea) {
      $scope.$emit('recargar-objetivos-area');
      $scope.nuevo = { };
    }, function (err) {
      $scope.tabCtrl.error = err;
    });
  };
})
.controller("UPEJOLNuevaActividadCtrl", function ($scope, API) {
    
  $scope.permisoActividad = function () {
      if ((($scope.tabCtrl.plan.etapa == "planificacion") && $scope.hasPermission('upejol.planificacion')) || (($scope.tabCtrl.plan.etapa == "seguimiento") && $scope.hasPermission('upejol.seguimiento'))) {
          if ($scope.hasPermission('upejol.administrador')) {
              return true;
          } else {
              if ($scope.tabCtrl.filtro.objArea.aprobado) {
                  return false;
              } else {
                  if ($scope.hasPermission('upejol.editarArea') && ($scope.tabCtrl.filtro.area.idOrmOrganigrama == $scope.user.jurisdiccion)) {
                      return true;
                  } else {
                      if ($scope.tabCtrl.filtro.area.idsOrmOrganigrama) {
                          if ($scope.hasPermission('upejol.editarArea') && ($scope.tabCtrl.filtro.area.idsOrmOrganigrama.indexOf($scope.user.jurisdiccion) >= 0)) {
                              return true;
                          } else {
                              return false;
                          }
                      } else {
                        return false;
                      }
                  }
              }
          }
      } else {
          return false;
      }
  };
    
  $scope.crear = function () {
    var params = $scope.$eval('{ objArea: tabCtrl.filtro.objArea, nombre: nuevo.nombre }');
    
    if (!params.objArea || !params.nombre) return;
    
    API.poa.crearActividad2(params.objArea._id, params.nombre)
    .then (function (actividad) {
      $scope.$emit('recargar-actividades');
      $scope.nuevo = { };
    }, function (err) {
      $scope.tabCtrl.error = err;
    });
  };
})
.controller("UPEJOLEditarAreaCtrl", function ($scope, API, ORMOrganigrama) {
    
  $scope.organigramaORM = ORMOrganigrama.query();
  
  $scope.$watch('tabCtrl.filtro.area', function (j) {
    if (j) $scope.area = angular.copy(j);
    else $scope.area = null;
  });
  
  $scope.volver = function () {
    $scope.tabCtrl.filtro = {
    }
  };
  
  $scope.activar = function () {
    $scope.activada = true;
  };
  
  $scope.verDetalle = function () {
    $scope.detalle = true;
  };
  
  $scope.cancelarDetalle = function () {
    $scope.detalle = false;
  };
    
    $scope.organigramaPorId = function (id) {
      for (var i = 0; i < $scope.organigramaORM.length; i++) {
          if ($scope.organigramaORM[i]._id == id)
          {
              return $scope.organigramaORM[i];
          }
      }  
    };
  
  $scope.cancelar = function () {
    $scope.activada = false;
    
    var j = $scope.$eval('tabCtrl.filtro.area');
    
    if (j) $scope.area = angular.copy(j);
    else $scope.area = null;
  };
  
  $scope.guardar = function () {
    API.poa.actualizarArea2($scope.area._id, {
      nombre: $scope.area.nombre,
      descripcion: $scope.area.descripcion,
      codIdentificacion: $scope.area.codIdentificacion,
      planifica: $scope.area.planifica,
      responsable: $scope.area.responsable,
      presupuestoAnual: $scope.area.presupuestoAnual,
      aprobado: $scope.area.aprobado,
      validado: $scope.area.validado
    })
    .then(function () {
      $scope.$emit('recargar-areas');
      $scope.cancelar();
    });
  };
  
  $scope.eliminar = function () {
    API.poa.listarObjsAreaPorArea2($scope.area._id)
      .then(function(objArea) {
        if (objArea.length) {
            alert("Este area no se puede borrar porque contiene objetivos de area. Borre primero todos los objetivos de area y luego vuelva a intentarlo.");
        } else {
            if (confirm("¿Esta seguro de borrar este area?")) {
                API.poa.actualizarArea2($scope.area._id, {
                  eliminado: true
                })
                .then(function () {
                  $scope.$emit('recargar-areas');
                  $scope.volver();
                });
            }
        }
      });
  };
})
.controller("UPEJOLEditarObjAreaCtrl", function ($scope, API, EjeUPEJOL, FormasDePagoUPEJOL) {
  $scope.ejes = EjeUPEJOL.query();
  $scope.$watch('tabCtrl.filtro.objArea', function (o) {
    if (o) $scope.objArea = angular.copy(o);
    else $scope.objArea = null;
  });
  
  
  
  $scope.permisoObArea = function () {
      if ((($scope.tabCtrl.plan.etapa == "planificacion") && $scope.hasPermission('upejol.planificacion')) || (($scope.tabCtrl.plan.etapa == "seguimiento") && $scope.hasPermission('upejol.seguimiento'))) {
          if ($scope.hasPermission('upejol.administrador')) {
              return true;
          } else {
              if ($scope.objArea.aprobado) {
                  return false;
              } else {
                  if ($scope.hasPermission('upejol.editarArea') && ($scope.tabCtrl.filtro.area.idOrmOrganigrama == $scope.user.jurisdiccion)) {
                      return true;
                  } else {
                      if ($scope.tabCtrl.filtro.area.idsOrmOrganigrama) {
                          if ($scope.hasPermission('upejol.editarArea') && ($scope.tabCtrl.filtro.area.idsOrmOrganigrama.indexOf($scope.user.jurisdiccion) >= 0)) {
                              return true;
                          } else {
                              return false;
                          }
                      } else {
                        return false;
                      }
                  }
              }
          }
      } else {
          return false;
      }
  };
  
  $scope.volver = function () {
    $scope.tabCtrl.filtro = {
      area: $scope.tabCtrl.filtro.area
    };
  };
  
  $scope.activar = function () {
    $scope.activada = true;
  };
  
  $scope.verDetalle = function () {
    $scope.detalle = true;
  };
  
  $scope.cancelarDetalle = function () {
    $scope.detalle = false;
  };
  
  $scope.cancelar = function () {
    $scope.activada = false;
    
    var o = $scope.$eval('tabCtrl.filtro.objArea');
    
    if (o) $scope.objArea = angular.copy(o);
    else $scope.objArea = null;
  };
  
  $scope.guardar = function () {
    API.poa.actualizarObjArea2($scope.objArea._id, {
      nombre: $scope.objArea.nombre,
      validado: $scope.objArea.validado,
      aprobado: $scope.objArea.aprobado,
      descripcion: $scope.objArea.descripcion,
      codIdentificacion: $scope.objArea.codIdentificacion,
      responsableDeCarga: $scope.objArea.responsableDeCarga,
      correspondenciaEjes: $scope.objArea.correspondenciaEjes,
    }).then(function (objArea) {
      $scope.$emit('recargar-objetivos-area');
      $scope.cancelar();
    }, function (err) {
      $scope.tabCtrl.error = err;
    });
  };
  
  $scope.eliminar = function () {
    API.poa.listarActividadesPorObArea2($scope.objArea._id)
      .then(function(actividades) {
        if (actividades.length) {
            alert("Este objetivo de area no se puede borrar porque contiene actividades. Borre primero todos las actividades y luego vuelva a intentarlo.");
        } else {
            if (confirm("¿Esta seguro de borrar este objetivo de area?")) {
                API.poa.actualizarObjArea2($scope.objArea._id, {
                  eliminado: true
                }).then(function (objArea) {
                  $scope.$emit('recargar-objetivos-area');
                  $scope.volver();
                }, function (err) {
                  $scope.tabCtrl.error = err;
                });
            }
        }
      });
  };
})
.controller("UPEJOLEditarActividadCtrl", function ($scope, API, HitosUPEJOL, ORMOrganigrama, Contactos, RequerimientoUPEJOL, FormasDePagoUPEJOL) {
  $scope.$watch('tabCtrl.filtro.actividad', function (p) {
    if (p) $scope.actividad = angular.copy(p);
    else $scope.actividad = null;
  });
  
  $scope.uploaded = [];
  
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
    
    
    $scope.formaDePagoPorId = function (id) {
      for (var i = 0; i < $scope.listaDeFormas.length; i++) {
          if ($scope.listaDeFormas[i]._id == id)
          {
              return $scope.listaDeFormas[i].nombre;
          }
      }  
    }; 
    
  $scope.permisoActividad = function () {
      if ((($scope.tabCtrl.plan.etapa == "planificacion") && $scope.hasPermission('upejol.planificacion')) || (($scope.tabCtrl.plan.etapa == "seguimiento") && $scope.hasPermission('upejol.seguimiento'))) {
          if ($scope.hasPermission('upejol.administrador')) {
              return true;
          } else {
              if ($scope.actividad.aprobado) {
                  return false;
              } else {
                  if ($scope.hasPermission('upejol.editarArea') && ($scope.tabCtrl.filtro.area.idOrmOrganigrama == $scope.user.jurisdiccion)) {
                      return true;
                  } else {
                      if ($scope.tabCtrl.filtro.area.idsOrmOrganigrama) {
                          if ($scope.hasPermission('upejol.editarArea') && ($scope.tabCtrl.filtro.area.idsOrmOrganigrama.indexOf($scope.user.jurisdiccion) >= 0)) {
                              return true;
                          } else {
                              return false;
                          }
                      } else {
                        return false;
                      }
                  }
              }
          }
      } else {
          return false;
      }
  };
  
  $scope.organigrama = ORMOrganigrama.query();
  $scope.requerimientos = RequerimientoUPEJOL.query();
    
    $scope.organigramaPorId = function (id) {
      for (var i = 0; i < $scope.organigrama.length; i++) {
          if ($scope.organigrama[i]._id == id)
          {
              return $scope.organigrama[i];
          }
      }  
    };
    
    $scope.requerimientoPorId = function (id) {
      for (var i = 0; i < $scope.requerimientos.length; i++) {
          if ($scope.requerimientos[i]._id == id)
          {
              return $scope.requerimientos[i];
          }
      }  
    };
    
    $scope.contactos = Contactos.listar();
    
    $scope.contactoPorId = function (id) {
      for (var i = 0; i < $scope.contactos.length; i++) {
          if ($scope.contactos[i]._id == id)
          {
              return $scope.contactos[i];
          }
      }  
    };
    
    $scope.agregarArchivo = function(confirmado, data) {
        if (confirmado) {
            if (!$scope.actividad.archivos) {
                $scope.actividad.archivos = [];
            }
            if ($scope.uploaded.length) {
                $scope.archivo.archivoId = $scope.uploaded.shift().id;
                $scope.actividad.archivos.push($scope.archivo);
                $scope.actividad.$save({}, function() {
                    $scope.uploaded = [];
                });
            } else {
                alert("No cargo ningun archivo");
            }
        }
        else {
            $scope.archivo = {
                nombre: '',
                descripcion: '',
                tipo: '',
                autor: '',
                tags: '',
                fecha:undefined
            };
            $("#agrArchivo").modal('show');
        }
    };
    
    $scope.eliminarListaElem = function(elemento, lista) {
        lista.splice(lista.indexOf(elemento), 1);
    };
  
  $scope.volver = function () {
    $scope.tabCtrl.filtro = {
      area: $scope.tabCtrl.filtro.area,
      objArea: $scope.tabCtrl.filtro.objArea
    };
  };
  
  $scope.activar = function () {
    $scope.activada = true;
  };
  
  $scope.verDetalle = function () {
    $scope.detalle = true;
  };
  
  $scope.cancelarDetalle = function () {
    $scope.detalle = false;
  };
    
    //Agregar partida
    $scope.agregarPartida = function(data) {
        if (!$scope.actividad.partidas) {
            $scope.actividad.partidas = [];
        }
        $scope.actividad.partidas.push(data);
        $scope.data = {
            requerimiento: undefined,
        };
    };
  
  $scope.cancelar = function () {
    $scope.activada = false;
    
    var p = $scope.$eval('tabCtrl.filtro.actividad');
    
    if (p) $scope.actividad = angular.copy(p);
    else $scope.actividad = null;
  };
  
  $scope.presupuestoTotal = function (actividad) {
      var total = 0;
      if (actividad.partidas) {
        angular.forEach(actividad.partidas, function(p) {
            total = total + parseInt(p.monto);
        });
      }
      return total;
  };
  
  $scope.presupuestoRestante = function () {
      if ($scope.tabCtrl.filtro.area.presupuestoAnual) {
        var total = $scope.tabCtrl.filtro.area.presupuestoAnual;
      } else {
          var total = 0;
      }
      angular.forEach($scope.tabCtrl.actividades, function(a) {
          if (a.idArea == $scope.actividad.idArea) {
              total = total - $scope.presupuestoTotal(a);
          }
        });
      return total;
  };
  
  $scope.guardar = function () {
    API.poa.actualizarActividad2($scope.actividad._id, {
      nombre: $scope.actividad.nombre,
      validado: $scope.actividad.validado,
      aprobado: $scope.actividad.aprobado,
      descripcion: $scope.actividad.descripcion,
      ordenPago: $scope.actividad.ordenPago,
      fechaInicio: $scope.actividad.fechaInicio,
      fechaFin: $scope.actividad.fechaFin,
      partidas: $scope.actividad.partidas,
      etapaActividad: $scope.actividad.etapaActividad,
      noAutorizado: $scope.actividad.noAutorizado,
      cancelado: $scope.actividad.cancelado,
      responsable: $scope.actividad.responsable,
      archivos: $scope.actividad.archivos,
    }).then(function (actividad) {
      $scope.$emit('recargar-actividades');
      $scope.cancelar();
    }, function (err) {
      $scope.tabCtrl.error = err;
    });
  };
  
  $scope.eliminar = function () {
    API.poa.listarHitosPorActividad2($scope.actividad._id)
      .then(function(hitos) {
        if (hitos.length) {
            alert("Esta actividad no se puede borrar porque contiene hitos. Borre primero todos los hitos y luego vuelva a intentarlo.");
        } else {
            if (confirm("¿Esta seguro de borrar esta actividad?")) {
                API.poa.actualizarActividad2($scope.actividad._id, {
                  eliminado: true,
                }).then(function (actividad) {
                  $scope.$emit('recargar-actividades');
                  $scope.volver();
                }, function (err) {
                  $scope.tabCtrl.error = err;
                });
            }
        }
    });
  };
})
/*.controller("UPEJOLNuevoHitoCtrl", function ($scope, API) {
    
  $scope.permisoHito = function () {
      if ((($scope.tabCtrl.plan.etapa == "planificacion") && $scope.hasPermission('upejol.planificacion')) || (($scope.tabCtrl.plan.etapa == "seguimiento") && $scope.hasPermission('upejol.seguimiento'))) {
          if ($scope.hasPermission('upejol.administrador')) {
              return true;
          } else {
              if ($scope.tabCtrl.filtro.actividad.aprobado) {
                  return false;
              } else {
                  if ($scope.hasPermission('upejol.editarArea') && ($scope.tabCtrl.filtro.area.idOrmOrganigrama == $scope.user.jurisdiccion)) {
                      return true;
                  } else {
                      if ($scope.tabCtrl.filtro.area.idsOrmOrganigrama) {
                          if ($scope.hasPermission('upejol.editarArea') && ($scope.tabCtrl.filtro.area.idsOrmOrganigrama.indexOf($scope.user.jurisdiccion) >= 0)) {
                              return true;
                          } else {
                              return false;
                          }
                      } else {
                        return false;
                      }
                  }
              }
          }
      } else {
          return false;
      }
  };
  
  $scope.crear = function () {
    var params = $scope.$eval('{ actividad: tabCtrl.filtro.actividad, nombre: nueva.nombre }');
    
    if (!params.actividad || !params.nombre) return;
    
    API.poa.crearHito2(params.actividad._id, params.nombre)
    .then (function (hito) {
      $scope.$emit('recargar-hitos');
      $scope.nueva = { };
    }, function (err) {
      $scope.tabCtrl.error = err;
    });
  };
})
.controller("UPEJOLEditarHitoCtrl", function ($scope, API) {
  $scope.$watch('tabCtrl.filtro.hito', function (a) {
    if (a) $scope.hito = angular.copy(a);
    else $scope.hito = null;
  });
    
  $scope.permisoHito = function () {
      if ((($scope.tabCtrl.plan.etapa == "planificacion") && $scope.hasPermission('upejol.planificacion')) || (($scope.tabCtrl.plan.etapa == "seguimiento") && $scope.hasPermission('upejol.seguimiento'))) {
          if ($scope.hasPermission('upejol.administrador')) {
              return true;
          } else {
              if ($scope.tabCtrl.filtro.actividad.aprobado) {
                  return false;
              } else {
                  if ($scope.hasPermission('upejol.editarArea') && ($scope.tabCtrl.filtro.area.idOrmOrganigrama == $scope.user.jurisdiccion)) {
                      return true;
                  } else {
                      if ($scope.tabCtrl.filtro.area.idsOrmOrganigrama) {
                          if ($scope.hasPermission('upejol.editarArea') && ($scope.tabCtrl.filtro.area.idsOrmOrganigrama.indexOf($scope.user.jurisdiccion) >= 0)) {
                              return true;
                          } else {
                              return false;
                          }
                      } else {
                        return false;
                      }
                  }
              }
          }
      } else {
          return false;
      }
  };
  
  $scope.volver = function () {
    $scope.tabCtrl.filtro.hito = null;
  };
  
    $scope.agregarSub = function(dataSHito) {
        if (!$scope.hito.subhitos) {
            $scope.hito.subhitos = [];
        }
        $scope.hito.subhitos.push(dataSHito);
        $scope.dataSHito = {texto:''};
    };
    
    $scope.eliminarListaElem = function(elemento, lista) {
        lista.splice(lista.indexOf(elemento), 1);
    };
  
  $scope.activar = function () {
    $scope.activada = true;
  };
  
  $scope.verDetalle = function () {
    $scope.detalle = true;
  };
  
  $scope.cancelarDetalle = function () {
    $scope.detalle = false;
  };
  
  $scope.cancelar = function () {
    $scope.activada = false;
    
    var a = $scope.$eval('tabCtrl.filtro.hito');
    
    if (a) $scope.hito = angular.copy(a);
    else $scope.hito = null;
  };
  
  $scope.guardar = function () {
    API.poa.actualizarHito2($scope.hito._id, {
      nombre: $scope.hito.nombre,
      orden: $scope.hito.orden,
      codIdentificacion: $scope.hito.codIdentificacion,
      fechaPlanificada: $scope.hito.fechaPlanificada,
      fechaEstimada: $scope.hito.fechaEstimada,
      fechaReal: $scope.hito.fechaReal,
      cumplida: $scope.hito.cumplida,
      cancelada: $scope.hito.cancelada,
      subhitos: $scope.hito.subhitos,
    }).then(function (actividad) {
      $scope.$emit('recargar-hitos');
      $scope.cancelar();
    }, function (err) {
      $scope.tabCtrl.error = err;
    });
  };
  
  $scope.eliminar = function () {
    if (confirm("¿Esta seguro de borrar este hito?")) {
        API.poa.actualizarHito2($scope.hito._id, {
          eliminado: true
        }).then(function (actividad) {
          $scope.$emit('recargar-hitos');
          $scope.cancelar();
        }, function (err) {
          $scope.tabCtrl.error = err;
        });
      }
    };
})*/
.controller("UPEJOLPresupuestoSigafCtrl", function ($scope, $http) {
  $scope.$watch('o', function (o) {
    var consulta = {
      actividad: o.actividad,
      ejercicio: o.anio,
      entidad: o.entidad,
      fueFinan: o.fuenteFinanciamiento,
      inciso: o.inciso,
      jurisdiccion: o.jurisdiccion,
      moneda: o.moneda,
      obra: o.obra,
      parcial: o.parcial,
      principal: o.principal,
      programa: o.programa,
      proyecto: o.proyecto,
      subjurisdiccion: '0',
      subparcial: '0',
      subprograma: '0',
      ubicacionGeografica: o.ubicacionGeografica,
      idimput: '0'
    };
    
    $http.post('/api/consulta-sigaf', consulta)
    .success(function (r) {
      $scope.sigaf = r;
    });
  }, true);
})
.controller("UPEJOLReporteCtrl", function ($scope, $http, ActividadesUPEJOL, ObjAreaUPEJOL, AreasUPEJOL) {
    $scope.actividades = ActividadesUPEJOL.query();
    $scope.objetivos = ObjAreaUPEJOL.query();
    $scope.areas = AreasUPEJOL.query();
    
    $scope.areaPorId = function (id) {
      for (var i = 0; i < $scope.areas.length; i++) {
          if ($scope.areas[i]._id == id)
          {
              return $scope.areas[i];
          }
      }  
    };
  
    $scope.presupuestoTotal = function (actividad) {
      var total = 0;
      if (actividad.partidas) {
        angular.forEach(actividad.partidas, function(p) {
            total = total + parseInt(p.monto);
        });
      }
      return total;
    };
    
})
.controller("UPEJOLSigafCtrl", function ($scope, $http, ActividadesUPEJOL, ObjAreaUPEJOL, AreasUPEJOL, RequerimientoUPEJOL, $modal) {
    $scope.actividades = ActividadesUPEJOL.query();
    $scope.requerimientos = RequerimientoUPEJOL.query();
    
    $scope.areaPorId = function (id) {
      for (var i = 0; i < $scope.areas.length; i++) {
          if ($scope.areas[i]._id == id)
          {
              return $scope.areas[i];
          }
      }  
    };
  
    $scope.presupuestoActividad = function (actividad) {
      var total = 0;
      if (actividad.partidas) {
        angular.forEach(actividad.partidas, function(p) {
            total = total + parseInt(p.monto);
        });
      }
      return total;
    };
    
    $scope.nuevoRequerimiento = function (confirmado) {
        if (confirmado) {
            $scope.requerimientoNuevo.$save({}, function() {
                $scope.requerimientos = RequerimientoUPEJOL.query();
            });
        }
        else {
            $scope.requerimientoNuevo = new RequerimientoUPEJOL ({
                requerimiento : '',
                anio : '',
                jurisdiccion : '',
                entidad : '',
                programa : '',
                proyecto : '',
                actividad : '',
                obra : '',
                fuenteFinanciamiento : '',
                moneda : '',
                inciso : '',
                principal : '',
                parcial : '',
                ubicacionGeografica : '',
            });
            $("#nuevoReq").modal('show');
        }
    };
    
});