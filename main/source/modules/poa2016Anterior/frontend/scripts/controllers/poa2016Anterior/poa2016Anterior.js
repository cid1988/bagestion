angular.module('bag2.poa2016Anterior', [
'ng',
'service-api',
'luegg.directives',
'ui.select'])
.controller('POAPlanNavbarAnteriorCtrl', function ($scope, $location) {
})
.controller('POAPlanJurisdiccionesAnteriorCtrl', function ($scope, API) {
  API.poa.listarContactosORM()
  .then(function (contactos) {
    $scope.contactos = contactos;
  });
    
  $scope.$watch('plan._id', function (idPlan) {
    if (!idPlan) {
      $scope.jurisdicciones = null;
      return;
    }
      
    API.poa.listarJurisdicciones3(idPlan)
    .then(function (jurisdicciones) {
      $scope.jurisdicciones = jurisdicciones;
    });
  });
})
.controller('POAPlanAnteriorCtrl', function ($scope, API, $routeParams, $location, $q, User, Obra, Obras2, POANotificacion) {
  $scope.tabCtrl = ctrl = this;
  
    $scope.user = User.findByName({
        username: $scope.username
    });
  
  ctrl.filtro = {};
  
  $scope.filtro = {
      jurisdiccion : ""
  };
  
  $scope.verDetalle = function () {
    $scope.detalle = true;
  };
  
  $scope.cancelarDetalle = function () {
    $scope.detalle = false;
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
    
  API.poa.traerPlan3($routeParams.anio, $routeParams.etapa)
  .then(function (plan) {
    if (!plan) {
      ctrl.error = 'No existe el plan';
      
      return;
    }
    
    function recargarProyectos() {
      return API.poa.listarProyectos3(plan._id)
      .then(function (proyectos) {
        ctrl.proyectos = proyectos;
        
        seleccionarProyecto($location.search.proyecto, proyectos, ctrl.filtro);
      }, function (err) {
        $scope.tabCtrl.error = err;
      });
    }
    
    function recargarJurisdicciones() {
      return API.poa.listarJurisdicciones3(plan._id)
      .then(function(jurisdicciones) {
        ctrl.jurisdicciones = jurisdicciones;
        
        seleccionarJurisdiccion($location.search().jurisdiccion, jurisdicciones, ctrl.filtro);
      }, function (err) {
        $scope.tabCtrl.error = err;
      });
    }
    
    function recargarObjsImpacto() {
      return API.poa.listarObjsImpacto3(plan._id)
      .then(function(objsImpacto) {
        ctrl.objsImpacto = objsImpacto;
        
        seleccionarObjImpacto($location.search().objImpacto, objsImpacto, ctrl.filtro);
      }, function (err) {
        $scope.tabCtrl.error = err;
      });
    }
    
    function recargarObjsMinisteriales() {
      return API.poa.listarObjsMinisteriales3(plan._id)
      .then(function(objsMinisteriales) {
        ctrl.objsMinisteriales = objsMinisteriales;
        
        seleccionarObjMinisterial($location.search().objMinisterial, objsMinisteriales, ctrl.filtro);
      }, function (err) {
        $scope.tabCtrl.error = err;
      });
    }
    
    function recargarObjsOperativos() {
      return API.poa.listarObjsOperativos3(plan._id)
      .then(function(objsOperativos) {
        ctrl.objsOperativos = objsOperativos;
        
        seleccionarObjOperativo($location.search().objOperativo, objsOperativos, ctrl.filtro);
      }, function (err) {
        $scope.tabCtrl.error = err;
      });
    }
    
    function recargarProyectos() {
      return API.poa.listarProyectos3(plan._id)
      .then(function(proyectos) {
        ctrl.proyectos = proyectos;
        
        seleccionarProyecto($location.search().proyecto, proyectos, ctrl.filtro);
      }, function (err) {
        $scope.tabCtrl.error = err;
      });
    }
    
    function recargarActividades() {
      return API.poa.listarActividades3(plan._id)
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
.controller("POAObrasAnteriorCtrl", function ($scope, API, Obra, Obras2, RelevanciaIniciativa) {
  
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

.controller("POAEditarProyectoAnteriorCtrl", function ($scope, API, ORMTema, POAEtiqueta, HitosActividadesAnterior, ORMOrganigrama) {
  $scope.$watch('tabCtrl.filtro.proyecto', function (p) {
    if (p) $scope.proyecto = angular.copy(p);
    else $scope.proyecto = null;
  });
  
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
});