angular.module('bag2.poa.controllers')
.controller('POAPlanNavbarCtrl', function ($scope, $location) {
})
.controller('POAPlanJurisdiccionesCtrl', function ($scope, API) {
  API.poa.listarContactosORM()
  .then(function (contactos) {
    $scope.contactos = contactos;
  });
    
  $scope.$watch('plan._id', function (idPlan) {
    if (!idPlan) {
      $scope.jurisdicciones = null;
      return;
    }
      
    API.poa.listarJurisdicciones(idPlan)
    .then(function (jurisdicciones) {
      $scope.jurisdicciones = jurisdicciones;
    });
  });
})
.controller('POAPlanObrasCtrl', function ($scope, API, Obra, Obras2, $routeParams, ORMOrganigrama, Jurisdicciones) {
    $scope.etapa = $routeParams.etapa;
    $scope.anio = $routeParams.anio;
    $scope.obras = [];
    
    
    $scope.jurisdiccionPOA = Jurisdicciones.get({_id: $routeParams._id}, function() {
        if ($scope.jurisdiccionPOA.idOrmOrganigrama != "0") {
            $scope.jurisdiccion = ORMOrganigrama.get({_id: $scope.jurisdiccionPOA.idOrmOrganigrama});
        
            var obras1 = Obra.query({jurisdiccion: $scope.jurisdiccionPOA.idOrmOrganigrama, anio: $scope.anio-1}, function() {
                var obras2 = Obras2.query({jurisdiccion: $scope.jurisdiccionPOA.idOrmOrganigrama, anio: $scope.anio-1}, function() {
                    (obras1.concat(obras2)).forEach(function(obra){
                        if (obra.final.length) {
                            if (obra.final[obra.final.length-1].fecha) {
                                if (obra.final[obra.final.length-1].fecha.slice(obra.final[obra.final.length-1].fecha.length-4, obra.final[obra.final.length-1].fecha.length) >= $scope.anio) {
                                    $scope.obras.push(obra);
                                }
                            }
                        }
                    });
                });
            });
        } else if ($scope.jurisdiccionPOA.idsOrmOrganigrama.length) {
            $scope.jurisdiccionPOA.idsOrmOrganigrama.forEach(function(juris){
                var obras1 = Obra.query({jurisdiccion: juris, anio: $scope.anio-1}, function() {
                    var obras2 = Obras2.query({jurisdiccion: juris, anio: $scope.anio-1}, function() {
                        (obras1.concat(obras2)).forEach(function(obra){
                            if (obra.final.length) {
                                if (obra.final[obra.final.length-1].fecha) {
                                    if (obra.final[obra.final.length-1].fecha.slice(obra.final[obra.final.length-1].fecha.length-4, obra.final[obra.final.length-1].fecha.length) >= $scope.anio) {
                                        $scope.obras.push(obra);
                                    }
                                }
                            }
                        });
                    });
                });
            });
        }
    });
    
    
    if ($routeParams.etapa == 'planificacion') {
      $scope.nombrePlan = 'Planificacion ' + $routeParams.anio;
    } else {
        $scope.nombrePlan = 'Seguimiento ' + $routeParams.anio;
    }
    
    $scope.guardar = function (obra) {
        obra.$save();
    };
    
})
.controller('POAPlanCtrl', function ($scope, API, $routeParams, $location, $q, User, Obra, Obras2, POANotificacion) {
  $scope.tabCtrl = ctrl = this;
  
    $scope.user = User.findByName({
        username: $scope.username
    });
  
  ctrl.filtro = {};
  
  $scope.filtro = {
      jurisdiccion : ""
  };
        
  $scope.notificaciones = POANotificacion.query({eliminado: JSON.stringify({$exists: false})});
  
  if ($routeParams.etapa == 'planificacion') {
      $scope.nombrePlan = 'Planificacion ' + $routeParams.anio;
  } else {
      $scope.nombrePlan = 'Seguimiento ' + $routeParams.anio;
  }
  
    $scope.ordenNumerico = function(i) {
        if (i && i.codIdentificacion) {
            return Number(i.codIdentificacion);
        }
        return 999999;
    };
  
    $scope.ordenFecha = function(i) {
        if (i.fechas) {
            if (i.fechas[i.fechas.length-1]) {
                if (i.fechas[i.fechas.length-1].fechaInicio) {
                    return $scope.aMilisegundos(i.fechas[i.fechas.length-1].fechaInicio);
                }
            }
        }
        return 99999999999999;
    };
    
    var recorrer = function(array, resultados) {
        angular.forEach(array, function (p) {
            if ($scope.filtro.jurisdiccion) {
                if ($scope.filtro.jurisdiccion._id == p.idJurisdiccion) {
                    resultados[0] += 1;
                    if (p.validado) {
                        resultados[1] += 1;
                    }
                    if (p.aprobado) {
                        resultados[2] += 1;
                    }
                }
            } else {
                resultados[0] += 1;
                if (p.validado) {
                    resultados[1] += 1;
                }
                if (p.aprobado) {
                    resultados[2] += 1;
                }
            }
        });
    };
    
    $scope.modalPrincipal = function() {
        $scope.resultados = {
            impactos : [0,0,0],
            ministeriales : [0,0,0],
            operativos : [0,0,0],
            proyectos : [0,0,0],
            obras : [0,0,0]
        };
        recorrer($scope.tabCtrl.proyectos, $scope.resultados.proyectos);
        recorrer($scope.tabCtrl.objsOperativos, $scope.resultados.operativos);
        recorrer($scope.tabCtrl.objsMinisteriales, $scope.resultados.ministeriales);
        recorrer($scope.tabCtrl.objsImpacto, $scope.resultados.impactos);
        var obras1 = Obra.query({cargadaEnPOA: true}, function() {
            var obras2 = Obras2.query({cargadaEnPOA: true}, function() {
                angular.forEach(obras1.concat(obras2), function (o) {
                    if ($scope.filtro.jurisdiccion) {
                        if ($scope.filtro.jurisdiccion.idOrmOrganigrama == o.jurisdiccion) {
                            $scope.resultados.obras[0] += 1;
                            if (o.validado) {
                                $scope.resultados.obras[1] += 1;
                            }
                            if (o.aprobado) {
                                $scope.resultados.obras[2] += 1;
                            }
                        }
                    } else {
                        $scope.resultados.obras[0] += 1;
                        if (o.validado) {
                            $scope.resultados.obras[1] += 1;
                        }
                        if (o.aprobado) {
                            $scope.resultados.obras[2] += 1;
                        }
                    }
                });
            });
        });
    };
    
  $scope.$watch('filtro.jurisdiccion', function (j) {
    $scope.modalPrincipal();
  });
    
  API.poa.traerPlan($routeParams.anio, $routeParams.etapa)
  .then(function (plan) {
    if (!plan) {
      ctrl.error = 'No existe el plan';
      
      return;
    }
    
    function recargarProyectos() {
      return API.poa.listarProyectos(plan._id)
      .then(function (proyectos) {
        ctrl.proyectos = proyectos;
        
        seleccionarProyecto($location.search.proyecto, proyectos, ctrl.filtro);
      }, function (err) {
        $scope.tabCtrl.error = err;
      });
    }
    
    function recargarJurisdicciones() {
      return API.poa.listarJurisdicciones(plan._id)
      .then(function(jurisdicciones) {
        ctrl.jurisdicciones = jurisdicciones;
        
        seleccionarJurisdiccion($location.search().jurisdiccion, jurisdicciones, ctrl.filtro);
      }, function (err) {
        $scope.tabCtrl.error = err;
      });
    }
    
    function recargarObjsImpacto() {
      return API.poa.listarObjsImpacto(plan._id)
      .then(function(objsImpacto) {
        ctrl.objsImpacto = objsImpacto;
        
        seleccionarObjImpacto($location.search().objImpacto, objsImpacto, ctrl.filtro);
      }, function (err) {
        $scope.tabCtrl.error = err;
      });
    }
    
    function recargarObjsMinisteriales() {
      return API.poa.listarObjsMinisteriales(plan._id)
      .then(function(objsMinisteriales) {
        ctrl.objsMinisteriales = objsMinisteriales;
        
        seleccionarObjMinisterial($location.search().objMinisterial, objsMinisteriales, ctrl.filtro);
      }, function (err) {
        $scope.tabCtrl.error = err;
      });
    }
    
    function recargarObjsOperativos() {
      return API.poa.listarObjsOperativos(plan._id)
      .then(function(objsOperativos) {
        ctrl.objsOperativos = objsOperativos;
        
        seleccionarObjOperativo($location.search().objOperativo, objsOperativos, ctrl.filtro);
      }, function (err) {
        $scope.tabCtrl.error = err;
      });
    }
    
    function recargarProyectos() {
      return API.poa.listarProyectos(plan._id)
      .then(function(proyectos) {
        ctrl.proyectos = proyectos;
        
        seleccionarProyecto($location.search().proyecto, proyectos, ctrl.filtro);
      }, function (err) {
        $scope.tabCtrl.error = err;
      });
    }
    
    function recargarActividades() {
      return API.poa.listarActividades(plan._id)
      .then(function(actividades) {
        ctrl.actividades = actividades;
        
        seleccionarActividad($location.search().actividad, actividades, ctrl.filtro);
      }, function (err) {
        $scope.tabCtrl.error = err;
      });
    }
    
    function seleccionarJurisdiccion(id, jurisdicciones, filtro) {
      if (!id) filtro.jurisdiccion = null;
    
      for (var i = 0; i < jurisdicciones.length; i++) {
        if (jurisdicciones[i]._id === id) {
          filtro.jurisdiccion = jurisdicciones[i];
          break;
        }
      }
    }
    
    function seleccionarObjImpacto(id, objsImpacto, filtro) {
      if (!id) filtro.objImpacto = null;
      
      for (var i = 0; i < objsImpacto.length; i++) {
        if (objsImpacto[i]._id === id) {
          filtro.objImpacto = objsImpacto[i];
          break;
        }
      }
    }
    
    function seleccionarObjMinisterial(id, objsMinisteriales, filtro) {
      if (!id) filtro.objMinisterial = null;
      
      for (var i = 0; i < objsMinisteriales.length; i++) {
        if (objsMinisteriales[i]._id === id) {
          filtro.objMinisterial = objsMinisteriales[i];
          break;
        }
      }
    }
    
    function seleccionarObjOperativo(id, objsOperativos, filtro) {
      if (!id) filtro.objOperativo = null;
      
      for (var i = 0; i < objsOperativos.length; i++) {
        if (objsOperativos[i]._id === id) {
          filtro.objOperativo = objsOperativos[i];
          break;
        }
      }
    }
    
    function seleccionarProyecto(id, proyectos, filtro) {
      if (!id) filtro.proyecto = null;
      
      for (var i = 0; i < proyectos.length; i++) {
        if (proyectos[i]._id === id) {
          filtro.proyecto = proyectos[i];
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
    
    
    var hoy = new Date().getTime();
    
    $scope.aMilisegundos = function(fecha) {
        if (fecha) {
            var fechaDividida = fecha.split("/");
            var date = new Date(fechaDividida[2], fechaDividida[1] - 1, fechaDividida[0], 0, 0, 0, 0);
            return date.getTime();
        } else {
            return 0;
        }
    };
  
    $scope.dameFechaFin = function(hito) {
        if (hito.fechas) {
            if (hito.fechas.length) {
                return $scope.aMilisegundos(hito.fechas[hito.fechas.length-1].fechaFin);
            } else {
                return "0";
            }
        } else {
            return "0";
        }
        
    };
    
    $scope.colorEstado = function(hito) {
        if (hito.cumplida) {
            return "green";
        } else if (hito.cancelada) {
            return "black";
        } else if ($scope.dameFechaFin(hito) == "0") {
            return "#cccccc";
        } else if ($scope.dameFechaFin(hito)<hoy) {
            var masCinco = $scope.dameFechaFin(hito) + 432000000;
            if (masCinco<hoy) {
                return "red";
            } else {
                return "yellow";
            }
            return "red";
        } else if (($scope.dameFechaFin(hito)>hoy)) {
            return "green";
        }
        
    };
    
    $scope.$on('recargar-jurisdicciones', recargarJurisdicciones);
    $scope.$on('recargar-objetivos-impacto', recargarObjsImpacto);
    $scope.$on('recargar-objetivos-ministeriales', recargarObjsMinisteriales);
    $scope.$on('recargar-objetivos-operativos', recargarObjsOperativos);
    $scope.$on('recargar-proyectos', recargarProyectos);
    $scope.$on('recargar-actividades', recargarActividades);
    
    ctrl.plan = plan;
    
    $q.all([
      recargarJurisdicciones(),
      recargarObjsImpacto(),
      recargarObjsMinisteriales(),
      recargarObjsOperativos(),
      recargarProyectos(),
      recargarActividades()
    ])
    .then(function () {
      $scope.modalPrincipal();
      $("#informacionPrincipal").modal('show');
      $scope.$watch(function () {
        return ctrl.filtro;
      }, function (filtro) {
        if (!filtro) return;
      
        // el filtro ya existe, remplazamos la url con el filtro
        var search = {};
        
        if (ctrl.filtro.jurisdiccion) search.jurisdiccion = ctrl.filtro.jurisdiccion._id;
        if (ctrl.filtro.objImpacto) search.objImpacto = ctrl.filtro.objImpacto._id;
        if (ctrl.filtro.objMinisterial) search.objMinisterial = ctrl.filtro.objMinisterial._id;
        if (ctrl.filtro.objOperativo) search.objOperativo = ctrl.filtro.objOperativo._id;
        if (ctrl.filtro.proyecto) search.proyecto = ctrl.filtro.proyecto._id;
        
        $location.search(search);
      }, true);
    })
  }, function (err) {
    ctrl.error = err;
  });
})
.controller('POANuevoObjImpactoCtrl', function ($scope, API) {
  $scope.permisoImpacto = function () {
      if ((($scope.tabCtrl.plan.etapa == "planificacion") && $scope.hasPermission('poa.planificacion')) || (($scope.tabCtrl.plan.etapa == "seguimiento") && $scope.hasPermission('poa.seguimiento'))) {
          if ($scope.hasPermission('poa.administrador')) {
              return true;
          } else {
              if ($scope.tabCtrl.filtro.jurisdiccion.aprobado) {
                  return false;
              } else {
                  if ($scope.hasPermission('poa.editarJurisdiccion') && ($scope.tabCtrl.filtro.jurisdiccion.idOrmOrganigrama == $scope.user.jurisdiccion)) {
                      return true;
                  } else {
                      if ($scope.tabCtrl.filtro.jurisdiccion.idsOrmOrganigrama) {
                          if ($scope.hasPermission('poa.editarJurisdiccion') && ($scope.tabCtrl.filtro.jurisdiccion.idsOrmOrganigrama.indexOf($scope.user.jurisdiccion) >= 0)) {
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
    var params = $scope.$eval('{ idJurisdiccion: tabCtrl.filtro.jurisdiccion._id, nombre: nuevo.nombre }');
    
    if (!params.idJurisdiccion || !params.nombre) return;
    
    API.poa.crearObjImpacto(params.idJurisdiccion, params.nombre)
    .then (function (objImpacto) {
      $scope.$emit('recargar-objetivos-impacto');
      $scope.nuevo = { };
    }, function (err) {
      $scope.tabCtrl.error = err;
    });
  };
})
.controller("POANuevoObjMinisterialCtrl", function ($scope, API) {
  $scope.permisoMinisterial = function () {
      if ((($scope.tabCtrl.plan.etapa == "planificacion") && $scope.hasPermission('poa.planificacion')) || (($scope.tabCtrl.plan.etapa == "seguimiento") && $scope.hasPermission('poa.seguimiento'))) {
          if ($scope.hasPermission('poa.administrador')) {
              return true;
          } else {
              if ($scope.tabCtrl.filtro.objImpacto.aprobado) {
                  return false;
              } else {
                  if ($scope.hasPermission('poa.editarJurisdiccion') && ($scope.tabCtrl.filtro.jurisdiccion.idOrmOrganigrama == $scope.user.jurisdiccion)) {
                      return true;
                  } else {
                      if ($scope.tabCtrl.filtro.jurisdiccion.idsOrmOrganigrama) {
                          if ($scope.hasPermission('poa.editarJurisdiccion') && ($scope.tabCtrl.filtro.jurisdiccion.idsOrmOrganigrama.indexOf($scope.user.jurisdiccion) >= 0)) {
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
    var params = $scope.$eval('{ objImpacto: tabCtrl.filtro.objImpacto, nombre: nuevo.nombre }');
    
    if (!params.objImpacto || !params.nombre) return;
    
    API.poa.crearObjMinisterial(params.objImpacto._id, params.nombre)
    .then (function (objMinisterial) {
      $scope.$emit('recargar-objetivos-ministeriales');
      $scope.nuevo = { };
    }, function (err) {
      $scope.tabCtrl.error = err;
    });
  };
})
.controller("POANuevoObjOperativoCtrl", function ($scope, API) {
  $scope.permisoOperativo = function () {
      if ((($scope.tabCtrl.plan.etapa == "planificacion") && $scope.hasPermission('poa.planificacion')) || (($scope.tabCtrl.plan.etapa == "seguimiento") && $scope.hasPermission('poa.seguimiento'))) {
          if ($scope.hasPermission('poa.administrador')) {
              return true;
          } else {
              if ($scope.tabCtrl.filtro.objMinisterial.aprobado) {
                  return false;
              } else {
                  if ($scope.hasPermission('poa.editarJurisdiccion') && ($scope.tabCtrl.filtro.jurisdiccion.idOrmOrganigrama == $scope.user.jurisdiccion)) {
                      return true;
                  } else {
                      if ($scope.tabCtrl.filtro.jurisdiccion.idsOrmOrganigrama) {
                          if ($scope.hasPermission('poa.editarJurisdiccion') && ($scope.tabCtrl.filtro.jurisdiccion.idsOrmOrganigrama.indexOf($scope.user.jurisdiccion) >= 0)) {
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
    var params = $scope.$eval('{ objMinisterial: tabCtrl.filtro.objMinisterial, nombre: nuevo.nombre }');
    
    if (!params.objMinisterial || !params.nombre) return;
    
    API.poa.crearObjOperativo(params.objMinisterial._id, params.nombre)
    .then (function (objOperativo) {
      $scope.$emit('recargar-objetivos-operativos');
      $scope.nuevo = { };
    }, function (err) {
      $scope.tabCtrl.error = err;
    });
  };
})
.controller("POANuevoProyectoCtrl", function ($scope, API) {
    
  $scope.permisoProyecto = function () {
      if ((($scope.tabCtrl.plan.etapa == "planificacion") && $scope.hasPermission('poa.planificacion')) || (($scope.tabCtrl.plan.etapa == "seguimiento") && $scope.hasPermission('poa.seguimiento'))) {
          if ($scope.hasPermission('poa.administrador')) {
              return true;
          } else {
              if ($scope.tabCtrl.filtro.objOperativo.aprobado) {
                  return false;
              } else {
                  if ($scope.hasPermission('poa.editarJurisdiccion') && ($scope.tabCtrl.filtro.jurisdiccion.idOrmOrganigrama == $scope.user.jurisdiccion)) {
                      return true;
                  } else {
                      if ($scope.tabCtrl.filtro.jurisdiccion.idsOrmOrganigrama) {
                          if ($scope.hasPermission('poa.editarJurisdiccion') && ($scope.tabCtrl.filtro.jurisdiccion.idsOrmOrganigrama.indexOf($scope.user.jurisdiccion) >= 0)) {
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
    var params = $scope.$eval('{ objOperativo: tabCtrl.filtro.objOperativo, nombre: nuevo.nombre }');
    
    if (!params.objOperativo || !params.nombre) return;
    
    API.poa.crearProyecto(params.objOperativo._id, params.nombre)
    .then (function (proyecto) {
      $scope.$emit('recargar-proyectos');
      $scope.nuevo = { };
    }, function (err) {
      $scope.tabCtrl.error = err;
    });
  };
})
.controller("POAEditarJurisdiccionCtrl", function ($scope, API, ORMOrganigrama) {
    
  $scope.organigramaORM = ORMOrganigrama.query();
  
  $scope.$watch('tabCtrl.filtro.jurisdiccion', function (j) {
    if (j) $scope.jurisdiccion = angular.copy(j);
    else $scope.jurisdiccion = null;
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
    
    var j = $scope.$eval('tabCtrl.filtro.jurisdiccion');
    
    if (j) $scope.jurisdiccion = angular.copy(j);
    else $scope.jurisdiccion = null;
  };
  
  $scope.guardar = function () {
    API.poa.actualizarJurisdiccion($scope.jurisdiccion._id, {
      nombre: $scope.jurisdiccion.nombre,
      descripcion: $scope.jurisdiccion.descripcion,
      codIdentificacion: $scope.jurisdiccion.codIdentificacion,
      planifica: $scope.jurisdiccion.planifica,
      responsable: $scope.jurisdiccion.responsable,
      aprobado: $scope.jurisdiccion.aprobado,
      validado: $scope.jurisdiccion.validado
    })
    .then(function () {
      $scope.$emit('recargar-jurisdicciones');
      $scope.cancelar();
    });
  };
  
  $scope.eliminar = function () {
    API.poa.listarObjsImpactoPorJurisdiccion($scope.jurisdiccion._id)
      .then(function(objImpactos) {
        if (objImpactos.length) {
            alert("Esta jurisdicción no se puede borrar porque contiene objetivos de impacto. Borre primero todos los objetivos de impacto y luego vuelva a intentarlo.");
        } else {
            if (confirm("¿Esta seguro de borrar esta jurisdicción?")) {
                API.poa.actualizarJurisdiccion($scope.jurisdiccion._id, {
                  eliminado: true
                })
                .then(function () {
                  $scope.$emit('recargar-jurisdicciones');
                  $scope.volver();
                });
            }
        }
      });
  };
})
.controller("POAEditarObjImpactoCtrl", function ($scope, API, EjePOA) {
  $scope.ejes = EjePOA.query();
  $scope.$watch('tabCtrl.filtro.objImpacto', function (o) {
    if (o) $scope.objImpacto = angular.copy(o);
    else $scope.objImpacto = null;
  });
  
  $scope.permisoImpacto = function () {
      if ((($scope.tabCtrl.plan.etapa == "planificacion") && $scope.hasPermission('poa.planificacion')) || (($scope.tabCtrl.plan.etapa == "seguimiento") && $scope.hasPermission('poa.seguimiento'))) {
          if ($scope.hasPermission('poa.administrador')) {
              return true;
          } else {
              if ($scope.objImpacto.aprobado) {
                  return false;
              } else {
                  if ($scope.hasPermission('poa.editarJurisdiccion') && ($scope.tabCtrl.filtro.jurisdiccion.idOrmOrganigrama == $scope.user.jurisdiccion)) {
                      return true;
                  } else {
                      if ($scope.tabCtrl.filtro.jurisdiccion.idsOrmOrganigrama) {
                          if ($scope.hasPermission('poa.editarJurisdiccion') && ($scope.tabCtrl.filtro.jurisdiccion.idsOrmOrganigrama.indexOf($scope.user.jurisdiccion) >= 0)) {
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
      jurisdiccion: $scope.tabCtrl.filtro.jurisdiccion
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
    
    var o = $scope.$eval('tabCtrl.filtro.objImpacto');
    
    if (o) $scope.objImpacto = angular.copy(o);
    else $scope.objImpacto = null;
  };
  
  $scope.guardar = function () {
    API.poa.actualizarObjImpacto($scope.objImpacto._id, {
      nombre: $scope.objImpacto.nombre,
      validado: $scope.objImpacto.validado,
      aprobado: $scope.objImpacto.aprobado,
      descripcion: $scope.objImpacto.descripcion,
      codIdentificacion: $scope.objImpacto.codIdentificacion,
      responsableDeCarga: $scope.objImpacto.responsableDeCarga,
      correspondenciaEjes: $scope.objImpacto.correspondenciaEjes,
    }).then(function (objImpacto) {
      $scope.$emit('recargar-objetivos-impacto');
      $scope.cancelar();
    }, function (err) {
      $scope.tabCtrl.error = err;
    });
  };
  
  $scope.eliminar = function () {
    API.poa.listarObjsMinisterialesPorObImpacto($scope.objImpacto._id)
      .then(function(objMinisteriales) {
        if (objMinisteriales.length) {
            alert("Este objetivo de impacto no se puede borrar porque contiene objetivos ministeriales. Borre primero todos los objetivos ministeriales y luego vuelva a intentarlo.");
        } else {
            if (confirm("¿Esta seguro de borrar este objetivo de impacto?")) {
                API.poa.actualizarObjImpacto($scope.objImpacto._id, {
                  eliminado: true
                }).then(function (objImpacto) {
                  $scope.$emit('recargar-objetivos-impacto');
                  $scope.volver();
                }, function (err) {
                  $scope.tabCtrl.error = err;
                });
            }
        }
      });
  };
})
.controller("POAEditarObjOperativoCtrl", function ($scope, API) {
  $scope.$watch('tabCtrl.filtro.objOperativo', function (o) {
    if (o) $scope.objOperativo = angular.copy(o);
    else $scope.objOperativo = null;
  });
  
  $scope.volver = function () {
    $scope.tabCtrl.filtro = {
      jurisdiccion: $scope.tabCtrl.filtro.jurisdiccion,
      objImpacto: $scope.tabCtrl.filtro.objImpacto,
      objMinisterial: $scope.tabCtrl.filtro.objMinisterial
    }
  };
  
  $scope.permisoOperativo = function () {
      if ((($scope.tabCtrl.plan.etapa == "planificacion") && $scope.hasPermission('poa.planificacion')) || (($scope.tabCtrl.plan.etapa == "seguimiento") && $scope.hasPermission('poa.seguimiento'))) {
          if ($scope.hasPermission('poa.administrador')) {
              return true;
          } else {
              if ($scope.objOperativo.aprobado) {
                  return false;
              } else {
                  if ($scope.hasPermission('poa.editarJurisdiccion') && ($scope.tabCtrl.filtro.jurisdiccion.idOrmOrganigrama == $scope.user.jurisdiccion)) {
                      return true;
                  } else {
                      if ($scope.tabCtrl.filtro.jurisdiccion.idsOrmOrganigrama) {
                          if ($scope.hasPermission('poa.editarJurisdiccion') && ($scope.tabCtrl.filtro.jurisdiccion.idsOrmOrganigrama.indexOf($scope.user.jurisdiccion) >= 0)) {
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
    
    var o = $scope.$eval('tabCtrl.filtro.objOperativo');
    
    if (o) $scope.objOperativo = angular.copy(o);
    else $scope.objOperativo = null;
  };
  
  $scope.guardar = function () {
    API.poa.actualizarObjOperativo($scope.objOperativo._id, {
      nombre: $scope.objOperativo.nombre,
      validado: $scope.objOperativo.validado,
      aprobado: $scope.objOperativo.aprobado,
      descripcion: $scope.objOperativo.descripcion,
      codIdentificacion: $scope.objOperativo.codIdentificacion
    })
    .then(function () {
      $scope.$emit('recargar-objetivos-operativos');
      $scope.cancelar();
    }, function(err) {
      $scope.tabCtrl.error = err;
    });
  };
  
  $scope.eliminar = function () {
    API.poa.listarProyectosPorObOperativo($scope.objOperativo._id)
      .then(function(proyectos) {
        if (proyectos.length) {
            alert("Este objetivo operativo no se puede borrar porque contiene proyectos. Borre primero todos los proyectos y luego vuelva a intentarlo.");
        } else {
            if (confirm("¿Esta seguro de borrar este objetivo operativo?")) {
                API.poa.actualizarObjOperativo($scope.objOperativo._id, {
                  eliminado: true,
                })
                .then(function () {
                  $scope.$emit('recargar-objetivos-operativos');
                  $scope.volver();
                }, function(err) {
                  $scope.tabCtrl.error = err;
                });
            }
        }
    });
  };
})
.controller("POAEditarObjMinisterialCtrl", function ($scope, API) {
  $scope.$watch('tabCtrl.filtro.objMinisterial', function (o) {
    if (o) $scope.objMinisterial = angular.copy(o);
    else $scope.objMinisterial = null;
  });
  
  $scope.volver = function () {
    $scope.tabCtrl.filtro = {
      jurisdiccion: $scope.tabCtrl.filtro.jurisdiccion,
      objImpacto: $scope.tabCtrl.filtro.objImpacto
    };
  };
  
  $scope.permisoMinisterial = function () {
      if ((($scope.tabCtrl.plan.etapa == "planificacion") && $scope.hasPermission('poa.planificacion')) || (($scope.tabCtrl.plan.etapa == "seguimiento") && $scope.hasPermission('poa.seguimiento'))) {
          if ($scope.hasPermission('poa.administrador')) {
              return true;
          } else {
              if ($scope.objMinisterial.aprobado) {
                  return false;
              } else {
                  if ($scope.hasPermission('poa.editarJurisdiccion') && ($scope.tabCtrl.filtro.jurisdiccion.idOrmOrganigrama == $scope.user.jurisdiccion)) {
                      return true;
                  } else {
                      if ($scope.tabCtrl.filtro.jurisdiccion.idsOrmOrganigrama) {
                          if ($scope.hasPermission('poa.editarJurisdiccion') && ($scope.tabCtrl.filtro.jurisdiccion.idsOrmOrganigrama.indexOf($scope.user.jurisdiccion) >= 0)) {
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
    
    var o = $scope.$eval('tabCtrl.filtro.objMinisterial');
    
    if (o) $scope.objMinisterial = angular.copy(o);
    else $scope.objMinisterial = null;
  };
  
  $scope.guardar = function () {
    API.poa.actualizarObjMinisterial($scope.objMinisterial._id, {
      nombre: $scope.objMinisterial.nombre,
      validado: $scope.objMinisterial.validado,
      aprobado: $scope.objMinisterial.aprobado,
      descripcion: $scope.objMinisterial.descripcion,
      codIdentificacion: $scope.objMinisterial.codIdentificacion,
    }).then(function (objMinisterial) {
      $scope.$emit('recargar-objetivos-ministeriales');
      $scope.cancelar();
    }, function (err) {
      $scope.tabCtrl.error = err;
    });
  };
  
  $scope.eliminar = function () {
    API.poa.listarObjsOperativosPorObMinisterial($scope.objMinisterial._id)
      .then(function(objOperativos) {
        if (objOperativos.length) {
            alert("Este objetivo ministerial no se puede borrar porque contiene objetivos operativos. Borre primero todos los objetivos operativos y luego vuelva a intentarlo.");
        } else {
            if (confirm("¿Esta seguro de borrar este objetivo ministerial?")) {
                API.poa.actualizarObjMinisterial($scope.objMinisterial._id, {
                  eliminado: true,
                }).then(function (objMinisterial) {
                  $scope.$emit('recargar-objetivos-ministeriales');
                  $scope.volver();
                }, function (err) {
                  $scope.tabCtrl.error = err;
                });
            }
        }
      });
  };
})
.controller("POAEditarProyectoCtrl", function ($scope, API, ORMTema, POAEtiqueta, HitosActividades, $location, ORMOrganigrama) {
  $scope.$watch('tabCtrl.filtro.proyecto', function (p) {
    if (p) $scope.proyecto = angular.copy(p);
    else $scope.proyecto = null;
  });
    
  $scope.permisoProyecto = function () {
      if ((($scope.tabCtrl.plan.etapa == "planificacion") && $scope.hasPermission('poa.planificacion')) || (($scope.tabCtrl.plan.etapa == "seguimiento") && $scope.hasPermission('poa.seguimiento'))) {
          if ($scope.hasPermission('poa.administrador')) {
              return true;
          } else {
              if ($scope.proyecto.aprobado) {
                  return false;
              } else {
                  if ($scope.hasPermission('poa.editarJurisdiccion') && ($scope.tabCtrl.filtro.jurisdiccion.idOrmOrganigrama == $scope.user.jurisdiccion)) {
                      return true;
                  } else {
                      if ($scope.tabCtrl.filtro.jurisdiccion.idsOrmOrganigrama) {
                          if ($scope.hasPermission('poa.editarJurisdiccion') && ($scope.tabCtrl.filtro.jurisdiccion.idsOrmOrganigrama.indexOf($scope.user.jurisdiccion) >= 0)) {
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
  
  $scope.temas = ORMTema.query();
  $scope.etiquetas = POAEtiqueta.query({eliminado: JSON.stringify({$exists: false})});
  
  $scope.organigrama = ORMOrganigrama.query();
    
    $scope.organigramaPorId = function (id) {
      for (var i = 0; i < $scope.organigrama.length; i++) {
          if ($scope.organigrama[i]._id == id)
          {
              return $scope.organigrama[i];
          }
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
    
    $scope.mostrarJuri = function(c) {
        if (c.ministerio) { 
            if($scope.proyecto) {
                if ($scope.proyecto.jurisdiccionesParticipantes) {
                    return ($scope.proyecto.jurisdiccionesParticipantes.indexOf(c._id) == -1);
                } else {
                    return true;
                }
            } else {
                return true;
            }
        } else {
            return false;
        }
    };
    
    $scope.mostrarTema = function(c) {
        if (c.eliminado) {
            return false; 
        } else if($scope.proyecto) {
            if ($scope.proyecto.temas) {
                return ($scope.proyecto.temas.indexOf(c._id) == -1);
            } else {
                return true;
            }
        } else {
            return true;
        }
    };
    
    $scope.filtroEtiqueta = function(c) {
        if($scope.proyecto) {
            if ($scope.proyecto.etiquetas) {
                return ($scope.proyecto.etiquetas.indexOf(c._id) == -1);
            } else {
                return true;
            }
        } else {
            return true;
        }
    };
    
    $scope.etiquetaPorId = function (id) {
      for (var i = 0; i < $scope.etiquetas.length; i++) {
          if ($scope.etiquetas[i]._id == id)
          {
              return $scope.etiquetas[i];
          }
      }  
    };
    
    //Agregar temas
    $scope.agregarTema = function(dataTema) {
        if (!$scope.proyecto.temas) {
            $scope.proyecto.temas = [];
        }
        $scope.proyecto.temas.push(dataTema);
        $scope.dataTema = "";
    };
    
    //Agregar jurisdicciones
    $scope.agregarJuri = function(dataJuri) {
        if (!$scope.proyecto.jurisdiccionesParticipantes) {
            $scope.proyecto.jurisdiccionesParticipantes = [];
        }
        $scope.proyecto.jurisdiccionesParticipantes.push(dataJuri);
        $scope.dataJuri = "";
    };
    
    //Agregar etiquetas
    $scope.agregarEtiqueta = function(dataEtiqueta) {
        if (!$scope.proyecto.etiquetas) {
            $scope.proyecto.etiquetas = [];
        }
        $scope.proyecto.etiquetas.push(dataEtiqueta);
        $scope.dataEtiqueta = "";
    };
    
    $scope.eliminarListaElem = function(elemento, lista) {
        lista.splice(lista.indexOf(elemento), 1);
    };
  
  $scope.volver = function () {
    $scope.tabCtrl.filtro = {
      jurisdiccion: $scope.tabCtrl.filtro.jurisdiccion,
      objImpacto: $scope.tabCtrl.filtro.objImpacto,
      objMinisterial: $scope.tabCtrl.filtro.objMinisterial,
      objOperativo: $scope.tabCtrl.filtro.objOperativo
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
        if (!$scope.proyecto.partidas) {
            $scope.proyecto.partidas = [];
        }
        $scope.proyecto.partidas.push(data);
        $scope.data = {
            fecha: undefined,
        };
    };
  
  $scope.cancelar = function () {
    $scope.activada = false;
    
    var p = $scope.$eval('tabCtrl.filtro.proyecto');
    
    if (p) $scope.proyecto = angular.copy(p);
    else $scope.proyecto = null;
  };
  
  $scope.guardar = function () {
      var inputs = document.querySelectorAll(".siEstaMal");
      if($scope.aMilisegundos($scope.proyecto.fechaFin)<$scope.aMilisegundos($scope.proyecto.fechaInicio))
      {
          $location.url($location.url()+"#irAca");
          
          for(var i=0; i<inputs.length; i++)
          {
              inputs[i].classList.toggle("error");
          }
          
          alert("La fecha de fin no puede ser menor que la fecha de inicio");
      }
      else
      {
          for(var i=0; i<inputs.length; i++)
          {
              inputs[i].classList.remove("error");
          }
          
          var listaAlert = "Faltan los siguiente campos: \n";
          !$scope.proyecto.nombre ? listaAlert = listaAlert + "Nombre \n" : '';
          !$scope.proyecto.descripcion ? listaAlert = listaAlert + "Descripcion \n" : '';
          !$scope.proyecto.codIdentificacion ? listaAlert = listaAlert + "Codigo de identificacion \n" : '';
          !$scope.proyecto.dependencia ? listaAlert = listaAlert + "Dependencia \n" : '';
          !$scope.proyecto.metaProducto ? listaAlert = listaAlert + "Unidad de Meta \n" : '';
          !$scope.proyecto.metaCuantificacion || $scope.proyecto.metaCuantificacion <= 0 ? listaAlert = listaAlert + "Meta \n" : '';
          !$scope.proyecto.etapaProyecto ? listaAlert = listaAlert + "Etapa Proyecto \n" : '';
          !$scope.proyecto.prioridadMinisterial ? listaAlert = listaAlert + "Prioridad Ministerial \n" : '';
          !$scope.proyecto.presupuestoSolicitado ? listaAlert = listaAlert + "Presupuesto Solicitado \n" : '';
          !$scope.proyecto.fechaInicio ? listaAlert = listaAlert + "Fecha Inicio \n" : '';
          !$scope.proyecto.fechaFin ? listaAlert = listaAlert + "Fecha Fin \n" : '';
          
          if ($scope.proyecto.nombre && $scope.proyecto.descripcion && $scope.proyecto.codIdentificacion && $scope.proyecto.dependencia && 
          $scope.proyecto.metaProducto && ($scope.proyecto.metaCuantificacion || $scope.proyecto.metaCuantificacion == 0) && $scope.proyecto.etapaProyecto && 
          $scope.proyecto.prioridadMinisterial && $scope.proyecto.presupuestoSolicitado && $scope.proyecto.fechaInicio && $scope.proyecto.fechaFin) 
          {
            API.poa.actualizarProyecto($scope.proyecto._id, {
              nombre: $scope.proyecto.nombre,
              validado: $scope.proyecto.validado,
              aprobado: $scope.proyecto.aprobado,
              descripcion: $scope.proyecto.descripcion,
              codIdentificacion: $scope.proyecto.codIdentificacion,
              fechaInicio: $scope.proyecto.fechaInicio,
              fechaFin: $scope.proyecto.fechaFin,
              proyectoInversion: $scope.proyecto.proyectoInversion,
              proyectoPreexistente: $scope.proyecto.proyectoPreexistente,
              codPreexistente: $scope.proyecto.codPreexistente,
              metaProducto: $scope.proyecto.metaProducto,
              metaCuantificacion: $scope.proyecto.metaCuantificacion,
              partidas: $scope.proyecto.partidas,
              prioridadMinisterial: $scope.proyecto.prioridadMinisterial,
              prioridadJefatura: $scope.proyecto.prioridadJefatura,
              presupuestoSolicitado: $scope.proyecto.presupuestoSolicitado,
              presupuestoGestion: $scope.proyecto.presupuestoGestion,
              etapaProyecto: $scope.proyecto.etapaProyecto,
              temas: $scope.proyecto.temas,
              etiquetas: $scope.proyecto.etiquetas,
              cancelado: $scope.proyecto.cancelado,
              dependencia: $scope.proyecto.dependencia,
              poblacionObjetivo: $scope.proyecto.poblacionObjetivo,
              jurisdiccionesParticipantes: $scope.proyecto.jurisdiccionesParticipantes,
            }).then(function (proyecto) {
              $scope.$emit('recargar-proyectos');
              $scope.cancelar();
            }, function (err) {
              $scope.tabCtrl.error = err;
            });
          }else{
              alert(listaAlert)
          }
          /*else {
              alert("Faltan cargar algunos de estos campos obligatorios: \n - Nombre \n - Descripción \n - Dependencia \n - Cod. Identificación \n - Unidad de Meta \n - Meta \n - Etapa \n - Prioridad Ministerial \n - Presupuesto Solicitado \n - Fecha de inicio \n - Fecha de fin");
          }*/
      }
  };
  
  $scope.eliminar = function () {
    API.poa.listarActividadesPorProyecto($scope.proyecto._id)
      .then(function(actividades) {
        if (confirm("¿Esta seguro de borrar este proyecto? Se eliminarán también los hitos que le pertenecen.")) {
            API.poa.actualizarProyecto($scope.proyecto._id, {
              eliminado: true,
            }).then(function (proyecto) {
                angular.forEach(actividades, function (a) {
                    API.poa.actualizarActividad(a._id, {
                      eliminado: true
                    });
                });
                $scope.$emit('recargar-proyectos');
                $scope.volver();
            }, function (err) {
                $scope.tabCtrl.error = err;
            });
        }
    });
  };
})
.controller("POANuevaActividadCtrl", function ($scope, API, $modal) {
    
  $scope.permisoActividad = function () {
      if ((($scope.tabCtrl.plan.etapa == "planificacion") && $scope.hasPermission('poa.planificacion')) || (($scope.tabCtrl.plan.etapa == "seguimiento") && $scope.hasPermission('poa.seguimiento'))) {
          if ($scope.hasPermission('poa.administrador')) {
              return true;
          } else {
              if ($scope.tabCtrl.filtro.proyecto.aprobado) {
                  return false;
              } else {
                  if ($scope.hasPermission('poa.editarJurisdiccion') && ($scope.tabCtrl.filtro.jurisdiccion.idOrmOrganigrama == $scope.user.jurisdiccion)) {
                      return true;
                  } else {
                      if ($scope.tabCtrl.filtro.jurisdiccion.idsOrmOrganigrama) {
                          if ($scope.hasPermission('poa.editarJurisdiccion') && ($scope.tabCtrl.filtro.jurisdiccion.idsOrmOrganigrama.indexOf($scope.user.jurisdiccion) >= 0)) {
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
  
    $scope.verGantt = function() {
        $scope.gantt = {
            data : [],
            links : []
        };
        $scope.tabCtrl.actividades.forEach(function(item) {
            if ((item.idProyecto == $scope.tabCtrl.filtro.proyecto._id) && item.fechas && item.fechas.length && item.fechas[item.fechas.length-1].fechaInicio && item.fechas[item.fechas.length-1].fechaFin) {
                var data = {
                    "id" : $scope.gantt.data.length+1,
                    "text" : item.nombre,
                    "start_date" : item.fechas[item.fechas.length-1].fechaInicio,
                    "end_date" : item.fechas[item.fechas.length-1].fechaFin,
                    "parent" : 0,
                };
                $scope.gantt.data.push(data);
            }
        });
        $modal({template: '/views/poa/verGantt.html', persist: true, show: true, size: 'modal-lg', scope: $scope.$new()});
    };
  
  $scope.crear = function () {
    var params = $scope.$eval('{ proyecto: tabCtrl.filtro.proyecto, nombre: nueva.nombre }');
    
    if (!params.proyecto || !params.nombre) return;
    
    API.poa.crearActividad(params.proyecto._id, params.nombre)
    .then (function (actividad) {
      $scope.$emit('recargar-actividades');
      $scope.nueva = { };
    }, function (err) {
      $scope.tabCtrl.error = err;
    });
  };
})
.controller("POAEditarActividadCtrl", function ($scope, API, Proyectos) {
  $scope.$watch('tabCtrl.filtro.actividad', function (a) {
    if (a) {
        $scope.actividad = angular.copy(a);
  
        if (!$scope.hasPermission('poa.administrador') && !$scope.actividad.fechas.length) {
            $scope.actividad.fechas = [{fechaInicio:undefined,
                fechaFin:undefined,
                avance:'',
                comentario:''}];
        }
    } else { $scope.actividad = null; }
  });
    
  $scope.permisoActividad = function () {
      if ((($scope.tabCtrl.plan.etapa == "planificacion") && $scope.hasPermission('poa.planificacion')) || (($scope.tabCtrl.plan.etapa == "seguimiento") && $scope.hasPermission('poa.seguimiento'))) {
          if ($scope.hasPermission('poa.administrador')) {
              return true;
          } else {
              if ($scope.tabCtrl.filtro.proyecto.aprobado) {
                  return false;
              } else {
                  if ($scope.hasPermission('poa.editarJurisdiccion') && ($scope.tabCtrl.filtro.jurisdiccion.idOrmOrganigrama == $scope.user.jurisdiccion)) {
                      return true;
                  } else {
                      if ($scope.tabCtrl.filtro.jurisdiccion.idsOrmOrganigrama) {
                          if ($scope.hasPermission('poa.editarJurisdiccion') && ($scope.tabCtrl.filtro.jurisdiccion.idsOrmOrganigrama.indexOf($scope.user.jurisdiccion) >= 0)) {
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
  
  //Agregar fecha
    $scope.agregarFecha = function(data) {
        //var proyecto=Proyectos.get({_id: $scope.actividad.idProyecto});
        
        var inputs = document.querySelectorAll(".siEstaMal");
        if($scope.aMilisegundos($scope.data.fechaFin)<$scope.aMilisegundos($scope.data.fechaInicio))
        {
            for(var i=0; i<inputs.length; i++)
            {
                inputs[i].classList.toggle("error");
            }
          
            alert("La fecha de fin no puede ser menor que la fecha de inicio");
        }/*
        else if($scope.data.fechaInicio<proyecto.fechaInicio)
        {
            for(var i=0; i<inputs.length; i++)
            {
                inputs[i].classList.toggle("error");
            }
          
            alert("La fecha de Inicio del Hito NO puede ser menor que la fecha de Inicio del proyecto.");
        }
        else if(proyecto.fechaFin<$scope.data.fechaFin)
        {
            for(var i=0; i<inputs.length; i++)
            {
                inputs[i].classList.toggle("error");
            }
          
            alert("La fecha de Fin del Hito NO puede ser mayor que la fecha de Fin del proyecto.");
        }*/
        else
        {
            for(var i=0; i<inputs.length; i++)
            {
                inputs[i].classList.remove("error");
            }
        
            if (!$scope.actividad.fechas) {
                $scope.actividad.fechas = [];
            }
            $scope.actividad.fechas.push(data);
            $scope.data = {
                fechaInicio: undefined,
                fechaFin: undefined,
                avance: '',
                comentario: '',
            };
        }
    };
    
    $scope.reverse = function(array) {
        var copy = [].concat(array);
        return copy.reverse();
    };
  
  $scope.volver = function () {
    $scope.tabCtrl.filtro.actividad = null;
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
    
    var a = $scope.$eval('tabCtrl.filtro.actividad');
    
    if (a) $scope.actividad = angular.copy(a);
    else $scope.actividad = null;
  };
  
  $scope.hitoPorId = function (id) {
      for (var i = 0; i < $scope.tabCtrl.actividades.length; i++) {
          if ($scope.tabCtrl.actividades[i]._id == id)
          {
              return $scope.tabCtrl.actividades[i];
          }
      }  
    };
  
    $scope.guardar = function () {
        API.poa.actualizarActividad($scope.actividad._id, {
            nombre: $scope.actividad.nombre,
            codIdentificacion: $scope.actividad.codIdentificacion,
            fechas: $scope.actividad.fechas,
            cumplida: $scope.actividad.cumplida,
            cancelada: $scope.actividad.cancelada,
        }).then(function (proyecto) {
            $scope.$emit('recargar-actividades');
            $scope.cancelar();
        }, function (err) {
            $scope.tabCtrl.error = err;
        });
    };
  
  $scope.eliminar = function () {
    if (confirm("¿Esta seguro de borrar este hito?")) {
        API.poa.actualizarActividad($scope.actividad._id, {
          eliminado: true
        }).then(function (proyecto) {
          $scope.$emit('recargar-actividades');
          $scope.cancelar();
        }, function (err) {
          $scope.tabCtrl.error = err;
        });
      }
    };
})
.controller("POAObrasCtrl", function ($scope, API, Obra, Obras2, RelevanciaIniciativa) {
  
    if ($scope.tabCtrl.filtro.jurisdiccion.idOrmOrganigrama == "0") {
        var obras1 = Obra.query({idsProyectos: $scope.tabCtrl.filtro.proyecto._id}, function() {
            var obras2 = Obras2.query({idsProyectos: $scope.tabCtrl.filtro.proyecto._id}, function() {
                $scope.tabCtrl.obras = obras1.concat(obras2);
            });
        });
        $scope.tabCtrl.filtro.jurisdiccion.idsOrmOrganigrama.forEach(function(juris){
            var obras1 = Obra.query({jurisdiccion: juris}, function() {
                var obras2 = Obras2.query({jurisdiccion: juris}, function() {
                    $scope.tabCtrl.obras = $scope.tabCtrl.obras.concat(obras1, obras2);
                });
            });
        });
    } else {
        var obras1 = Obra.query({$or:JSON.stringify([{jurisdiccion: $scope.tabCtrl.filtro.jurisdiccion.idOrmOrganigrama},
                                 {idsProyectos: $scope.tabCtrl.filtro.proyecto._id}])}, function() {
            var obras2 = Obras2.query({$or:JSON.stringify([{jurisdiccion: $scope.tabCtrl.filtro.jurisdiccion.idOrmOrganigrama},
                                       {idsProyectos: $scope.tabCtrl.filtro.proyecto._id}])}, function() {
                $scope.tabCtrl.obras = obras1.concat(obras2);
            });
        });
    }
    
    
      $scope.permisoObra = function () {
          if ((($scope.tabCtrl.plan.etapa == "planificacion") && $scope.hasPermission('poa.planificacion')) || (($scope.tabCtrl.plan.etapa == "seguimiento") && $scope.hasPermission('poa.seguimiento'))) {
              if ($scope.hasPermission('poa.administrador')) {
                  return true;
              } else {
                  if ($scope.tabCtrl.filtro.proyecto.aprobado) {
                      return false;
                  } else {
                      if ($scope.hasPermission('poa.editarJurisdiccion') && ($scope.tabCtrl.filtro.jurisdiccion.idOrmOrganigrama == $scope.user.jurisdiccion)) {
                          return true;
                      } else {
                          if ($scope.tabCtrl.filtro.jurisdiccion.idsOrmOrganigrama) {
                              if ($scope.hasPermission('poa.editarJurisdiccion') && ($scope.tabCtrl.filtro.jurisdiccion.idsOrmOrganigrama.indexOf($scope.user.jurisdiccion) >= 0)) {
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
    
    $scope.relevancias = RelevanciaIniciativa.query();
    
    $scope.prioridadPorId = function (id) {
      for (var i = 0; i < $scope.relevancias.length; i++) {
          if ($scope.relevancias[i]._id == id)
          {
              return $scope.relevancias[i];
          }
      }  
    };
    
    $scope.filtroObras = function(obra) {
        if (obra.idsProyectos) {
            if (obra.idsProyectos.indexOf($scope.tabCtrl.filtro.proyecto._id) > -1) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    };
})
.controller("POAAgregaObraCtrl", function ($scope, API, Obra, Obras2, Contactos, Comuna, RelevanciaIniciativa, ORMOrganigrama) {
    
    $scope.comunas = Comuna.query();
    
    $scope.volver = function () {
        $scope.tabCtrl.filtro.obra = null;
    };
  
    if ($scope.tabCtrl.filtro.jurisdiccion.idOrmOrganigrama == "0") {
        var obras1 = Obra.query({idsProyectos: $scope.tabCtrl.filtro.proyecto._id}, function() {
            var obras2 = Obras2.query({idsProyectos: $scope.tabCtrl.filtro.proyecto._id}, function() {
                $scope.tabCtrl.obras = obras1.concat(obras2);
            });
        });
        $scope.tabCtrl.filtro.jurisdiccion.idsOrmOrganigrama.forEach(function(juris){
            var obras1 = Obra.query({jurisdiccion: juris}, function() {
                var obras2 = Obras2.query({jurisdiccion: juris}, function() {
                    $scope.tabCtrl.obras = $scope.tabCtrl.obras.concat(obras1, obras2);
                });
            });
        });
    } else {
        var obras1 = Obra.query({$or:JSON.stringify([{jurisdiccion: $scope.tabCtrl.filtro.jurisdiccion.idOrmOrganigrama},
                                 {idsProyectos: $scope.tabCtrl.filtro.proyecto._id}])}, function() {
            var obras2 = Obras2.query({$or:JSON.stringify([{jurisdiccion: $scope.tabCtrl.filtro.jurisdiccion.idOrmOrganigrama},
                                       {idsProyectos: $scope.tabCtrl.filtro.proyecto._id}])}, function() {
                $scope.tabCtrl.obras = obras1.concat(obras2);
            });
        });
    }
    
    $scope.data = {
        nombre: '',
        nombre_largo: '',
        fechaProy: '',
        fuenteProy: '',
        fechaCont: '',
        fuenteCont: '',
        fechaIni: '',
        fuenteIni: '',
        fechaFin: '',
        fuenteFin: '',
        avanceFis: '',
        quienAlcance: '',
        descripcionAlcance: '',
        cuandoAlcance: '',
        calle: '',
        altura: '',
        cruce: '',
        barrio: '',
        comuna: [],
        relevancia: '',
        presupuestoMonto: '',
        presupuestoFecha: '30/12/2015',
        presupuestoAnio: '',
        dependencia: '',
        jurisdiccion: '',
    };
    
    if ($scope.tabCtrl.filtro.jurisdiccion.idOrmOrganigrama != "0") {
        $scope.data.jurisdiccion = $scope.tabCtrl.filtro.jurisdiccion.idOrmOrganigrama;
    }
    if ($scope.tabCtrl.filtro.proyecto.dependencia) {
        $scope.data.dependencia = $scope.tabCtrl.filtro.proyecto.dependencia;
    }
    
    $scope.contactos = Contactos.listar();
    $scope.organigrama = ORMOrganigrama.query();
    $scope.tab = 'nueva';
    $scope.nueva = true;
    $scope.relevancias = RelevanciaIniciativa.query();
    
    $scope.filtroObras2 = function(obra) {
        if (obra.idsProyectos) {
            if (obra.idsProyectos.indexOf($scope.tabCtrl.filtro.proyecto._id) < 0) {
                return true;
            } else {
                return false;
            }
        } else {
            return true;
        }
    };
    
    $scope.organigramaPorId = function (id) {
      for (var i = 0; i < $scope.organigrama.length; i++) {
          if ($scope.organigrama[i]._id == id)
          {
              return $scope.organigrama[i];
          }
      }  
    };
    
    $scope.agregarObra = function(nueva, obra) {
        if (!nueva) {
            if (!obra.idsProyectos) {
                obra.idsProyectos = [];
            }
            obra.idsProyectos.push($scope.tabCtrl.filtro.proyecto._id);
            obra.$save({}, function() {
                $scope.tabCtrl.filtro.obra = null;
            });
        } else {
            if ($scope.data.nombre && $scope.data.fechaIni && $scope.data.fechaFin && $scope.data.descripcionAlcance && $scope.data.cuandoAlcance && $scope.data.calle && ($scope.data.altura || $scope.data.cruce) && $scope.data.barrio && $scope.data.comuna.length && $scope.data.presupuestoMonto && $scope.data.dependencia && $scope.data.jurisdiccion) {
                var f = new Date();
                var minutes = f.getMinutes();
                minutes = minutes > 9 ? minutes : '0' + minutes;
                var obraNueva = new Obras2({
                    nombre: $scope.data.nombre,
                    nombre_largo: $scope.data.nombre_largo,
                    fotos: [],
                    relevadorAsignado: "",
                    pais: "Argentina",
                    provincia: "Ciudad Autónoma de Buenos Aires",
                    proyectos: [],
                    contratos: [],
                    inicios:[{
                        "fecha": $scope.data.fechaIni,
                        "fuente": $scope.data.fuenteIni,
                        "horaAgregado": (f.getHours() + ":" + minutes),
                        "fechaAgregado": moment(f).format('YYYYMMDD'),
                        "usuario": $scope.username,
                        "cuenta": true
                      }],
                    iniciosRel:[],
                    duracion:[],
                    final:[{
                        "fecha": $scope.data.fechaFin,
                        "fuente": $scope.data.fuenteFin,
                        "horaAgregado": (f.getHours() + ":" + minutes),
                        "fechaAgregado": moment(f).format('YYYYMMDD'),
                        "usuario": $scope.username,
                        "cuenta": true
                      }],
                    grupo:"",
                    clase:"",
                    tipo:"",
                    estado:"",
                    fisico:[],
                    financiero:[],
                    objetivo:[],
                    nombrar:[],
                    presupuestoSigaf:[],
                    finalRel:[],
                    orden1:"",
                    fotosAlcance: [],
                    detallesComunicacion: [],
                    documentosAlcance: [],
                    descripcionesAlcance: [{
                        "descripcion": $scope.data.descripcionAlcance,
                        "quien": $scope.data.quienAlcance,
                        "cuando": $scope.data.cuandoAlcance
                      }],
                    nombrar: [{
                        "monto": $scope.data.presupuestoMonto,
                        "fecha_valor": $scope.data.presupuestoFecha,
                        "partida_anio": $scope.data.presupuestoAnio
                      }],
                    calle: $scope.data.calle,
                    altura: $scope.data.altura,
                    cruce: $scope.data.cruce,
                    barrio: $scope.data.barrio,
                    comuna: $scope.data.comuna,
                    relevancia: $scope.data.relevancia,
                    anio: $scope.tabCtrl.plan.anio,
                    plan: $scope.tabCtrl.plan.anio.toString(),
                    horaAgregado: (f.getHours() + ":" + minutes),
                    fechaAgregado: moment(f).format('YYYYMMDD'),
                    usuario: $scope.username,
                    idsProyectos: [$scope.tabCtrl.filtro.proyecto._id],
                    jurisdiccion: $scope.data.jurisdiccion,
                    dependencia: $scope.data.dependencia,
                    cargadaEnPOA: true,
                });
                obraNueva.$save({}, function() {
                    if ($scope.tabCtrl.filtro.jurisdiccion.idOrmOrganigrama == "0") {
                        var obras1 = Obra.query({idsProyectos: $scope.tabCtrl.filtro.proyecto._id}, function() {
                            var obras2 = Obras2.query({idsProyectos: $scope.tabCtrl.filtro.proyecto._id}, function() {
                                $scope.tabCtrl.obras = obras1.concat(obras2);
                            });
                        });
                        $scope.tabCtrl.filtro.jurisdiccion.idsOrmOrganigrama.forEach(function(juris){
                            var obras1 = Obra.query({jurisdiccion: juris}, function() {
                                var obras2 = Obras2.query({jurisdiccion: juris}, function() {
                                    $scope.tabCtrl.obras = $scope.tabCtrl.obras.concat(obras1, obras2);
                                });
                            });
                        });
                    } else {
                        var obras1 = Obra.query({$or:JSON.stringify([{jurisdiccion: $scope.tabCtrl.filtro.jurisdiccion.idOrmOrganigrama},
                                                 {idsProyectos: $scope.tabCtrl.filtro.proyecto._id}])}, function() {
                            var obras2 = Obras2.query({$or:JSON.stringify([{jurisdiccion: $scope.tabCtrl.filtro.jurisdiccion.idOrmOrganigrama},
                                                       {idsProyectos: $scope.tabCtrl.filtro.proyecto._id}])}, function() {
                                $scope.tabCtrl.obras = obras1.concat(obras2);
                            });
                        });
                    }
                    $scope.tabCtrl.filtro.obra = null;
                });
            } else {
                alert("Faltan cargar campos obligatorios");
            }
        }
    };
})
.controller("POAEditarObraCtrl", function ($scope, API, Comuna, Contactos, ORMOrganigrama, RelevanciaIniciativa) {
  $scope.$watch('tabCtrl.filtro.obra', function (a) {
    if (a) $scope.obra = angular.copy(a);
    else $scope.obra = null;
  });
    
      $scope.permisoObra = function () {
          if ((($scope.tabCtrl.plan.etapa == "planificacion") && $scope.hasPermission('poa.planificacion')) || (($scope.tabCtrl.plan.etapa == "seguimiento") && $scope.hasPermission('poa.seguimiento'))) {
              if ($scope.hasPermission('poa.administrador')) {
                  return true;
              } else {
                  if ($scope.tabCtrl.filtro.proyecto.aprobado) {
                      return false;
                  } else {
                      if ($scope.hasPermission('poa.editarJurisdiccion') && ($scope.tabCtrl.filtro.jurisdiccion.idOrmOrganigrama == $scope.user.jurisdiccion)) {
                          return true;
                      } else {
                          if ($scope.tabCtrl.filtro.jurisdiccion.idsOrmOrganigrama) {
                              if ($scope.hasPermission('poa.editarJurisdiccion') && ($scope.tabCtrl.filtro.jurisdiccion.idsOrmOrganigrama.indexOf($scope.user.jurisdiccion) >= 0)) {
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
  
    $scope.comunas = Comuna.query();
    $scope.contactos = Contactos.listar();
    $scope.organigrama = ORMOrganigrama.query();
    $scope.relevancias = RelevanciaIniciativa.query();
    
    $scope.organigramaPorId = function (id) {
      for (var i = 0; i < $scope.organigrama.length; i++) {
          if ($scope.organigrama[i]._id == id)
          {
              return $scope.organigrama[i];
          }
      }  
    };
    $scope.contactoPorId = function (id) {
      for (var i = 0; i < $scope.contactos.length; i++) {
          if ($scope.contactos[i]._id == id)
          {
              return $scope.contactos[i];
          }
      }  
    };
    $scope.relevanciaPorId = function (id) {
      for (var i = 0; i < $scope.relevancias.length; i++) {
          if ($scope.relevancias[i]._id == id)
          {
              return $scope.relevancias[i];
          }
      }  
    };
    $scope.comunaPorId = function (id) {
      for (var i = 0; i < $scope.comunas.length; i++) {
          if ($scope.comunas[i]._id == id)
          {
              return $scope.comunas[i];
          }
      }  
    };
    
    $scope.agregarComuna = function(dataComuna) {
        if (!$scope.obra.comuna) {
            $scope.obra.comuna = [];
        }
        $scope.obra.comuna.push(dataComuna);
        $scope.dataComuna = "";
    };
    
    $scope.filtroComuna = function(c) {
        if($scope.obra) {
            if ($scope.obra.comuna) {
                return ($scope.obra.comuna.indexOf(c._id) == -1);
            } else {
                return true;
            }
        } else {
            return true;
        }
    };
    
    $scope.eliminarListaElem = function(elemento, lista) {
        lista.splice(lista.indexOf(elemento), 1);
    };
  
  $scope.volver = function () {
    $scope.tabCtrl.filtro.obra = null;
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
    
    var a = $scope.$eval('tabCtrl.filtro.obra');
    
    if (a) $scope.obra = angular.copy(a);
    else $scope.obra = null;
  };
  
  $scope.guardar = function () {
      $scope.obra.$save({}, function() {
          $scope.volver();
      });
  };
  
  $scope.desvincularObra = function () {
      $scope.eliminarListaElem($scope.tabCtrl.filtro.proyecto._id, $scope.obra.idsProyectos);
      $scope.obra.$save({}, function() {
          $scope.volver();
      });
  };
  
  $scope.eliminar = function () {
    if (confirm("¿Esta seguro de borrar esta obra?")) {
        $scope.obra.$delete({}, function() {
            $scope.volver();
        });
    }
  };
})
.controller("POAConfiguracionCtrl", function ($scope, $http, POAEtiqueta, POANotificacion) {
  $scope.etiquetas = POAEtiqueta.query({eliminado: JSON.stringify({$exists: false})});
  $scope.nuevo = {
      nombre:''
  };
  
  $scope.crear = function () {
    var etique = new POAEtiqueta ({
        nombre : $scope.nuevo.nombre
    });
    etique.$save({}, function() {
        $scope.etiquetas = POAEtiqueta.query({eliminado: JSON.stringify({$exists: false})});
        $scope.nuevo = {
            nombre:''
        };
    });
  };
  
  $scope.eliminar = function (etiqueta) {
    if (confirm("¿Esta seguro de borrar esta etiqueta?")) {
        etiqueta.eliminado = true;
        etiqueta.$save({}, function() {
            $scope.etiquetas = POAEtiqueta.query({eliminado: JSON.stringify({$exists: false})});
        });
    }
  };
  
  $scope.notificaciones = POANotificacion.query({eliminado: JSON.stringify({$exists: false})});
  $scope.noti = {
      texto:''
  };
  
  $scope.agregaNoti = function () {
    var hoy = new Date();
    var notifica = new POANotificacion ({
        texto : $scope.noti.texto,
        fechaLarga : hoy,
        fecha : (hoy.getDate() + "/" + (parseInt(hoy.getMonth())+1) + "/" + hoy.getFullYear())
    });
    notifica.$save({}, function() {
        $scope.notificaciones = POANotificacion.query({eliminado: JSON.stringify({$exists: false})});
        $scope.noti = {
            texto:''
        };
    });
  };
  
  $scope.eliminarNoti = function (notifi) {
    if (confirm("¿Esta seguro de borrar esta notificacion?")) {
        notifi.eliminado = true;
        notifi.$save({}, function() {
            $scope.notificaciones = POANotificacion.query({eliminado: JSON.stringify({$exists: false})});
        });
    }
  };
})
.controller("PresupuestoSigafPOACtrl", function ($scope, $http) {
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
.controller("NavbarPoaController",function($scope,$routeParams)
{
    $scope.plan=$routeParams.anio;
    $scope.etapa=$routeParams.etapa;
});