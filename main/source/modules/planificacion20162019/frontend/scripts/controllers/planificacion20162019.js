angular.module('bag2.planificacion20162019', [])
.controller('Planificacion20162019Ctrl', function($scope, $location, $http, Planificacion20162019, Contactos, ORMOrganigrama, AreaPlanificacion20162019, $window, $modal, $routeParams) {
	$scope.areas = [];
	$scope.uploaded = [];
	$scope.planes = Planificacion20162019.query({}, function() {
        angular.forEach($scope.planes, function (p) {
            if (p.prioridad == "A+") {
                p.ordenPrioridad = 0;
            } else if (p.prioridad == "A") {
                p.ordenPrioridad = 1;
            } else if (p.prioridad == "B") {
                p.ordenPrioridad = 2;
            } else if (p.prioridad == "C") {
                p.ordenPrioridad = 3;
            } else {
                p.ordenPrioridad = 4;
            }
            if (p.areaResponsable && !p.proyectoPadre) {
                if ($scope.areas.indexOf(p.areaResponsable[0]) == -1) {
                    
                    $scope.areas.push(p.areaResponsable[0]);
                }
            }
        });
	});
	$scope.areasJuris = AreaPlanificacion20162019.query();
	$scope.organigrama = ORMOrganigrama.query({}, function() {
        $scope.organigrama.push({
            _id : "zzz01",
            nombreCompleto : "Proyectos Público Privados"
        });
        $scope.organigrama.push({
            _id : "zzz02",
            nombreCompleto : "Otros Proyectos"
        });
        $scope.organigrama.push({
            _id : "zzz03",
            nombreCompleto : "Villa 31"
        });
        $scope.organigrama.push({
            _id : "zzz04",
            nombreCompleto : "Policía Metropolitana"
        });
        $scope.organigrama.push({
            _id : "zzz05",
            nombreCompleto : "BA Caminable"
        });
        $scope.organigrama.push({
            _id : "zzz06",
            nombreCompleto : "Proyectos en evaluación"
        });
        $scope.organigrama.push({
            _id : "zzz07",
            nombreCompleto : "Urbanización Villa 31"
        });
        $scope.organigrama.push({
            _id : "zzz08",
            nombreCompleto : "Temas aún no encarados"
        });
	});
	$scope.contactos = Contactos.listar();
    
    $scope.ordenAreaPorId = function (id) {
      for (var i = 0; i < $scope.areasJuris.length; i++) {
          if ($scope.areasJuris[i].jurisdiccion == id)
          {
              return $scope.areasJuris[i].orden;
          }
      }
      return 9999;
    };
    
    $scope.colorCompro = function (id) {
      for (var i = 0; i < $scope.areasJuris.length; i++) {
          if ($scope.areasJuris[i].jurisdiccion == id)
          {
              if ($scope.areasJuris[i].compromisosLeidos === false) {
                  return "#3441D3";
              } else {
                  return "#404040";
              }
          }
      }
      return "#404040";
    };
    
    $scope.ordenAreaPorNombre = function (id) {
      for (var i = 0; i < $scope.organigrama.length; i++) {
          if ($scope.organigrama[i]._id == id)
          {
              return $scope.organigrama[i].nombreCompleto;
          }
      }  
    };
    
    $scope.actualizar = function () {
        $scope.planes = Planificacion20162019.query({}, function() {
            angular.forEach($scope.planes, function (p) {
                if (p.prioridad == "A+") {
                    p.ordenPrioridad = 0;
                } else if (p.prioridad == "A") {
                    p.ordenPrioridad = 1;
                } else if (p.prioridad == "B") {
                    p.ordenPrioridad = 2;
                } else if (p.prioridad == "C") {
                    p.ordenPrioridad = 3;
                } else {
                    p.ordenPrioridad = 4;
                }
            });
    	}); 
    };
    
    $scope.contactoPorId = function (id) {
      for (var i = 0; i < $scope.contactos.length; i++) {
          if ($scope.contactos[i]._id == id)
          {
              return $scope.contactos[i];
          }
      }  
    };
    
    $scope.areaPorJurisdiccion = function (id) {
      for (var i = 0; i < $scope.areasJuris.length; i++) {
          if ($scope.areasJuris[i].jurisdiccion == id) {
              return $scope.areasJuris[i];
          }
      }  
    };
    
    $scope.orden = ['ordenPrioridad', 'numeroProyecto'];
    
    $scope.organigramaPorId = function (id) {
      for (var i = 0; i < $scope.organigrama.length; i++) {
          if ($scope.organigrama[i]._id == id)
          {
              return $scope.organigrama[i];
          }
      }  
    };
    
    $scope.iniciativaPorId = function (id) {
      for (var i = 0; i < $scope.planes.length; i++) {
          if ($scope.planes[i]._id == id)
          {
              return $scope.planes[i];
          }
      }  
    };
    
    $scope.eliminar = function(i) {
        if (confirm("Desea eliminar el registro?")) {
            i.$delete({}, function() {
                $scope.actualizar();
            });
        }
    };
    
    $scope.reverse = function(array) {
        var copy = [].concat(array);
        return copy.reverse();
    };
    
    $scope.eliminarElemento = function(array,elemento) {
        var indice = array.indexOf(elemento);
        if(indice!=-1) array.splice(indice, 1);
        $scope.planSeleccionado.$save();
    };

    $scope.comentariosHRL = function(idPlan) {
        $scope.planSeleccionado = Planificacion20162019.get({
            _id : idPlan
        });
        if (!$scope.planSeleccionado.comentariosHRL) {
            $scope.planSeleccionado.comentariosHRL = [];
        }
        var d = new Date();
        
        $scope.data = {
            descripcion: '',
            cuando: (d.getDate() + "/" + (d.getMonth()+1) + "/" + d.getFullYear())
        };
        $modal({template: '/views/planificacion20162019/comentariosHRL.html', persist: true, show: true, backdrop: 'static', scope: $scope});
    };
    
    $scope.seleccionarArea = function(idJuris) {
        var areaSeleccionada = AreaPlanificacion20162019.query({
            jurisdiccion : idJuris
        }, function() {
            if (areaSeleccionada.length) {
                $scope.areaSeleccionada = areaSeleccionada[0];
            } else {
                $scope.areaSeleccionada = new AreaPlanificacion20162019({
                    jurisdiccion : idJuris
                });
            }
        });
    };
    
    $scope.modalArea = function(idJuris) {
        $scope.seleccionarArea(idJuris);
        $modal({template: '/views/planificacion20162019/modals/modalArea.html', persist: true, show: true, backdrop: 'static', scope: $scope});
    };
    
    $scope.modalCompromisos = function(idJuris) {
        var areaSeleccionada = AreaPlanificacion20162019.query({
            jurisdiccion : idJuris
        }, function() {
            if (areaSeleccionada.length) {
                $scope.areaSeleccionada = areaSeleccionada[0];
                angular.forEach($scope.areaSeleccionada.compromisos, function (c) {
                    c.compromisos = "<li>" + c.compromisos;
                    do {
                        c.compromisos = c.compromisos.replace(". ", ".</li><li>");
                    } while(c.compromisos.indexOf('. ') >= 0);
                });
            } else {
                $scope.areaSeleccionada = new AreaPlanificacion20162019({
                    jurisdiccion : idJuris
                });
            }
        });
        $modal({template: '/views/planificacion20162019/modals/modalCompromisos.html', persist: true, show: true, backdrop: 'static', scope: $scope});
    };
    
    $scope.modalCompromisosIni = function(iniciativa) {
        $scope.iniciativaSeleccionada = iniciativa;
        $modal({template: '/views/planificacion20162019/modals/modalCompromisosIni.html', persist: true, show: true, backdrop: 'static', scope: $scope});
    };
    
    $scope.modalPresentacionesIni = function(iniciativa) {
        $scope.iniciativaSeleccionada = iniciativa;
        $modal({template: '/views/planificacion20162019/modals/modalPresentacionesIni.html', persist: true, show: true, backdrop: 'static', scope: $scope});
    };
    
    $scope.modalMinutasIni = function(iniciativa) {
        $scope.iniciativaSeleccionada = iniciativa;
        $modal({template: '/views/planificacion20162019/modals/modalMinutasIni.html', persist: true, show: true, backdrop: 'static', scope: $scope});
    };
    
    $scope.modalPresentaciones = function(idJuris) {
        $scope.seleccionarArea(idJuris);
        $modal({template: '/views/planificacion20162019/modals/modalPresentaciones.html', persist: true, show: true, backdrop: 'static', scope: $scope});
    };
    
    $scope.modalMinutas = function(idJuris) {
        $scope.seleccionarArea(idJuris);
        $modal({template: '/views/planificacion20162019/modals/modalMinutas.html', persist: true, show: true, backdrop: 'static', scope: $scope});
    };
    
    $scope.modalCargaCompromisos = function(idJuris) {
        $scope.seleccionarArea(idJuris);
        $modal({template: '/views/planificacion20162019/modals/modalCargaCompromisos.html', persist: true, show: true, backdrop: 'static', scope: $scope});
    };
    
    $scope.modalCargaPresentaciones = function(confirmado, idJuris) {
        if (confirmado) {
            $scope.data.archivoId = $scope.uploaded.shift().id;
            $scope.areaSeleccionada.presentaciones.push($scope.data);
            $scope.areaSeleccionada.$save();
        }
        else {
            var areaSeleccionada = AreaPlanificacion20162019.query({
                jurisdiccion : idJuris
            }, function() {
                if (areaSeleccionada.length) {
                    $scope.areaSeleccionada = areaSeleccionada[0];
                    if ($scope.areaSeleccionada.presentaciones === undefined) {
                        $scope.areaSeleccionada.presentaciones = [];
                    }
                } else {
                    $scope.areaSeleccionada = new AreaPlanificacion20162019({
                        jurisdiccion : idJuris,
                        presentaciones : []
                    });
                }
            });
            
            $scope.data = {
                descripcion: '',
                fecha: undefined,
                fuente: ''
            };
            $modal({template: '/views/planificacion20162019/modals/modalCargaPresentaciones.html', persist: true, show: true, backdrop: 'static', scope: $scope});
        }
    };
    
    $scope.modalCargaMinutas = function(confirmado, idJuris) {
        if (confirmado) {
            $scope.data.archivoId = $scope.uploaded.shift().id;
            $scope.areaSeleccionada.minutas.push($scope.data);
            $scope.areaSeleccionada.$save();
        }
        else {
            var areaSeleccionada = AreaPlanificacion20162019.query({
                jurisdiccion : idJuris
            }, function() {
                if (areaSeleccionada.length) {
                    $scope.areaSeleccionada = areaSeleccionada[0];
                    if ($scope.areaSeleccionada.minutas === undefined) {
                        $scope.areaSeleccionada.minutas = [];
                    }
                } else {
                    $scope.areaSeleccionada = new AreaPlanificacion20162019({
                        jurisdiccion : idJuris,
                        minutas : []
                    });
                }
            });
            
            $scope.data = {
                descripcion: '',
                fecha: undefined,
                fuente: ''
            };
            $modal({template: '/views/planificacion20162019/modals/modalCargaMinutas.html', persist: true, show: true, backdrop: 'static', scope: $scope});
        }
    };

    $scope.comentariosDGPLE = function(idPlan) {
        $scope.planSeleccionado = Planificacion20162019.get({
            _id : idPlan
        });
        if (!$scope.planSeleccionado.comentariosDGPLE) {
            $scope.planSeleccionado.comentariosDGPLE = [];
        }
        var d = new Date();
        
        $scope.data = {
            descripcion: '',
            cuando: (d.getDate() + "/" + (d.getMonth()+1) + "/" + d.getFullYear())
        };
        $modal({template: '/views/planificacion20162019/comentariosDGPLE.html', persist: true, show: true, backdrop: 'static', scope: $scope});
    };

    $scope.comentarioNuevo = function(proyecto) {
        if (!proyecto.comentariosHRL) {
            return false;
        } else {
            for (var i = 0; i < proyecto.comentariosHRL.length; i++) {
                if (!proyecto.comentariosHRL[i].leido)
                {
                    return true;
                }
            }
            return false;
        }
    };

    $scope.comentarioNuevo2 = function(proyecto) {
        if (!proyecto.comentariosDGPLE) {
            return false;
        } else {
            for (var i = 0; i < proyecto.comentariosDGPLE.length; i++) {
                if (!proyecto.comentariosDGPLE[i].leido)
                {
                    return true;
                }
            }
            return false;
        }
    };
    
    $scope.agregarCompromiso = function(data) {
        if (!$scope.areaSeleccionada.compromisos) {
            $scope.areaSeleccionada.compromisos = [];
        }
        var d = new Date();
        data.cuando = (d.getDate() + "/" + (d.getMonth()+1) + "/" + d.getFullYear());
        $scope.areaSeleccionada.compromisos.push(data);
        $scope.areaSeleccionada.compromisosLeidos = false;
        $scope.areaSeleccionada.$save({}, function() {
            $scope.areasJuris = AreaPlanificacion20162019.query();
            $scope.data = {
                iniciativa: '',
                responsable: '',
                avances: '',
                compromisos: '',
                cuando: (d.getDate() + "/" + (d.getMonth()+1) + "/" + d.getFullYear())
            };
        });
    };
    
    $scope.agregarComenHRL = function(planSeleccionado, data) {
        if (!planSeleccionado.comentariosHRL) {
            planSeleccionado.comentariosHRL = [];
        }
        var d = new Date();
        data.cuando = (d.getDate() + "/" + (d.getMonth()+1) + "/" + d.getFullYear());
        planSeleccionado.comentariosHRL.push(data);
        planSeleccionado.$save({}, function() {
            $scope.data = {
                descripcion: '',
                cuando: (d.getDate() + "/" + (d.getMonth()+1) + "/" + d.getFullYear())
            };
        });
    };
    
    $scope.agregarComenDGPLE = function(planSeleccionado, data) {
        if (!planSeleccionado.comentariosDGPLE) {
            planSeleccionado.comentariosDGPLE = [];
        }
        var d = new Date();
        data.cuando = (d.getDate() + "/" + (d.getMonth()+1) + "/" + d.getFullYear());
        planSeleccionado.comentariosDGPLE.push(data);
        planSeleccionado.$save({}, function() {
            $scope.data = {
                descripcion: '',
                cuando: (d.getDate() + "/" + (d.getMonth()+1) + "/" + d.getFullYear())
            };
        });
    };
    
    $scope.eliminarElementoArea = function(array,elemento) {
        if (confirm("Desea eliminar el registro?")) {
            var indice = array.indexOf(elemento);
            if(indice!=-1) array.splice(indice, 1);
            $scope.areaSeleccionada.$save();
        }
    };
    
    $scope.guardarSeleccionado = function() {
        $scope.planSeleccionado.$save();
    };
    
    $scope.guardarSeleccionado2 = function() {
        $scope.areaSeleccionada.$save({}, function() {
            $scope.areasJuris = AreaPlanificacion20162019.query();
        });
    };
    
    $scope.guardarSeleccionado3 = function() {
        $scope.iniciativaSeleccionada.$save({}, function() {
            $scope.actualizar();
        });
    };
    
    $scope.tienePrioritarios = function(iniciativa) {
        var result = false;
        angular.forEach(iniciativa.compromisos, function (p) {
            if (p.star) {
                result = true;
            }
        });
        return result;
    };
    
    $scope.tieneCompromisos = function(area) {
        var result = false;
        angular.forEach($scope.planes, function (p) {
            if ((p.areaResponsable[0] == area) && p.compromisos) {
                result = true;
            }
        });
        return result;
    };
    
    $scope.proyectoPorId = function (id) {
      for (var i = 0; i < $scope.planes.length; i++) {
          if ($scope.planes[i]._id == id)
          {
              return $scope.planes[i];
          }
      }  
    };
    
    $scope.proyectosHijos = function (id) {
        var hijos = [];
        for (var i = 0; i < $scope.planes.length; i++) {
            if ($scope.planes[i].proyectoPadre == id)
            {
                hijos.push($scope.planes[i]);
            }
        }  
        return hijos;
    };
    
    //Filtro de prioridades-----------------------------------------------------------------
    $scope.prioridadesFiltradas = [];
    $scope.prioridadesFiltradas['A+'] = false;
    $scope.prioridadesFiltradas['A'] = false;
    $scope.prioridadesFiltradas['B'] = false;
    $scope.prioridadesFiltradas['C'] = false;
    $scope.prioridadesFiltradas[''] = false;
    $scope.prioridadesFiltradas['Todos'] = true;
    
    $scope.filtrandoPrioridad = function (p) {
        return $scope.prioridadesFiltradas[p];
    };
    
    $scope.cambiarFiltroPrioridad = function (p) {
        if (p != 'Todos') {
            $scope.prioridadesFiltradas['Todos'] = false;
        } else {
            $scope.prioridadesFiltradas['A+'] = false;
            $scope.prioridadesFiltradas['A'] = false;
            $scope.prioridadesFiltradas['B'] = false;
            $scope.prioridadesFiltradas['C'] = false;
            $scope.prioridadesFiltradas[''] = false;
        }
       $scope.prioridadesFiltradas[p] = !$scope.prioridadesFiltradas[p];
    };
    
    $scope.filtroPrioridades = function (plan) {
        if ($scope.prioridadesFiltradas['Todos']) {
            return true;
        } else {
            return ($scope.prioridadesFiltradas[plan.prioridad]);
        }
    };
    
    $scope.filtroSoloPadres = function (plan) {
        if (plan.proyectoPadre) {
            if (plan.proyectoPadre === "") {
                return true;
            } else {
                return false;
            }
        } else {
            return true;
        }
    };
    
})
.controller('ConsolidadosPlanificacion20162019Ctrl', function($scope, $location, $http, Planificacion20162019, Contactos, ORMOrganigrama, Comuna, AreaPlanificacion20162019, $window, EjePlanificacion20162019, EstrategiaPlanificacion20162019, $modal, $routeParams) {
	$scope.areas = [];
	$scope.planes = Planificacion20162019.query({}, function() {
        angular.forEach($scope.planes, function (p) {
            if (p.prioridad == "A+") {
                p.ordenPrioridad = 0;
            } else if (p.prioridad == "A") {
                p.ordenPrioridad = 1;
            } else if (p.prioridad == "B") {
                p.ordenPrioridad = 2;
            } else if (p.prioridad == "C") {
                p.ordenPrioridad = 3;
            } else {
                p.ordenPrioridad = 4;
            }
            if (p.areaResponsable && !p.proyectoPadre) {
                if ($scope.areas.indexOf(p.areaResponsable[0]) == -1) {
                    
                    $scope.areas.push(p.areaResponsable[0]);
                }
            }
        });
	});
	$scope.areasJuris = AreaPlanificacion20162019.query({}, function () {
	    angular.forEach($scope.areasJuris, function (a) {
            angular.forEach(a.compromisos, function (c) {
                c.compromisos = "<li>" + c.compromisos;
                do {
                    c.compromisos = c.compromisos.replace(". ", ".</li><li>");
                } while(c.compromisos.indexOf('. ') >= 0);
            });
        });        
	});
	$scope.organigrama = ORMOrganigrama.query({}, function() {
        $scope.organigrama.push({
            _id : "zzz01",
            nombreCompleto : "Proyectos Público Privados"
        });
        $scope.organigrama.push({
            _id : "zzz02",
            nombreCompleto : "Otros Proyectos"
        });
        $scope.organigrama.push({
            _id : "zzz03",
            nombreCompleto : "Villa 31"
        });
        $scope.organigrama.push({
            _id : "zzz04",
            nombreCompleto : "Policía Metropolitana"
        });
        $scope.organigrama.push({
            _id : "zzz05",
            nombreCompleto : "BA Caminable"
        });
        $scope.organigrama.push({
            _id : "zzz06",
            nombreCompleto : "Proyectos en evaluación"
        });
        $scope.organigrama.push({
            _id : "zzz07",
            nombreCompleto : "Urbanización Villa 31"
        });
        $scope.organigrama.push({
            _id : "zzz08",
            nombreCompleto : "Temas aún no encarados"
        });
	});
    
    $scope.ordenAreaPorId = function (id) {
      for (var i = 0; i < $scope.areasJuris.length; i++) {
          if ($scope.areasJuris[i].jurisdiccion == id)
          {
              return $scope.areasJuris[i].orden;
          }
      }
      return 9999;
    };
    
    $scope.areaPorJurisdiccion = function (id) {
      for (var i = 0; i < $scope.areasJuris.length; i++) {
          if ($scope.areasJuris[i].jurisdiccion == id) {
              return $scope.areasJuris[i];
          }
      }  
    };
    
    $scope.imprimir = function () {
        $window.print(); 
    };
    
    $scope.organigramaPorId = function (id) {
      for (var i = 0; i < $scope.organigrama.length; i++) {
          if ($scope.organigrama[i]._id == id)
          {
              return $scope.organigrama[i];
          }
      }  
    };
    
    $scope.iniciativaPorId = function (id) {
      for (var i = 0; i < $scope.planes.length; i++) {
          if ($scope.planes[i]._id == id)
          {
              return $scope.planes[i];
          }
      }  
    };
    
    $scope.tieneCompromisosGeneral = function(area) {
        var result = false;
        angular.forEach($scope.planes, function (p) {
            if ((p.areaResponsable[0] == area) && p.compromisos) {
                result = true;
            }
        });
        angular.forEach($scope.areasJuris, function (a) {
            if ((a.jurisdiccion == area) && a.compromisos) {
                result = true;
            }
        });
        return result;
    };
    
    $scope.tieneCompromisos = function(area) {
        var result = false;
        angular.forEach($scope.planes, function (p) {
            if ((p.areaResponsable[0] == area) && p.compromisos) {
                result = true;
            }
        });
        return result;
    };
    
    $scope.tieneComentariosHRL = function(area) {
        var result = false;
        angular.forEach($scope.planes, function (p) {
            if ((p.areaResponsable[0] == area) && p.comentariosHRL) {
                result = true;
            }
        });
        return result;
    };
    
    $scope.tieneComentariosDGPLE = function(area) {
        var result = false;
        angular.forEach($scope.planes, function (p) {
            if ((p.areaResponsable[0] == area) && p.comentariosDGPLE) {
                result = true;
            }
        });
        return result;
    };
    
})
.controller('Planificacion20162019NuevoCtrl', function($scope, $location, $http, Planificacion20162019, EjePlanificacion20162019, EstrategiaPlanificacion20162019, ORMTema, Comuna, Contactos, ORMOrganigrama, User, $modal, $routeParams) {
	$scope.plan = new Planificacion20162019();
    $scope.plan.statusOperativo = [];
    $scope.plan.areaResponsable = [];
    $scope.plan.funcionarioResponsable = [];
    $scope.plan.statusOperativo[0]='white';
    $scope.plan.statusOperativo[1]='white';
    $scope.plan.statusOperativo[2]='white';
    $scope.plan.eje='';
    $scope.plan.estrategia='';
    $scope.plan.areaSponsor='';
    $scope.plan.prioridad='';
    $scope.plan.foco = false;
	$scope.ejes = EjePlanificacion20162019.query();
	$scope.estrategias = EstrategiaPlanificacion20162019.query();
	$scope.proyectos = Planificacion20162019.query();
	$scope.temas = ORMTema.query();
	$scope.contactos = Contactos.listar();
	$scope.organigrama = ORMOrganigrama.query({}, function() {
        $scope.organigrama.push({
            _id : "zzz01",
            nombreCompleto : "Proyectos Público Privados"
        });
        $scope.organigrama.push({
            _id : "zzz02",
            nombreCompleto : "Otros Proyectos"
        });
        $scope.organigrama.push({
            _id : "zzz03",
            nombreCompleto : "Villa 31"
        });
        $scope.organigrama.push({
            _id : "zzz04",
            nombreCompleto : "Policía Metropolitana"
        });
        $scope.organigrama.push({
            _id : "zzz05",
            nombreCompleto : "BA Caminable"
        });
        $scope.organigrama.push({
            _id : "zzz06",
            nombreCompleto : "Proyectos en evaluación"
        });
        $scope.organigrama.push({
            _id : "zzz07",
            nombreCompleto : "Urbanización Villa 31"
        });
        $scope.organigrama.push({
            _id : "zzz08",
            nombreCompleto : "Temas aún no encarados"
        });
	});
	$scope.comunas = Comuna.query();
    $scope.tab = "ficha";
    $scope.uploadedFile = [];
    
    $scope.$watch('plan.estrategia', function (estrategia){
        if (estrategia) {
            var proyectos = Planificacion20162019.query({
                estrategia : estrategia
            }, function() {
                if ($scope.estrategiaPorId(estrategia)) {
                    if (proyectos.length) {
                        $scope.plan.numeroProyecto = $scope.estrategiaPorId(estrategia).numero + "." + (proyectos.length + 1);
                    } else {
                        $scope.plan.numeroProyecto = $scope.estrategiaPorId(estrategia).numero + ".1";
                    }
                }
            });
        }
    }, true);

    $scope.agregarComen = function(confirmado, data) {
        if (confirmado) {
            $scope.plan.comentarios.push(data);
        }
        else {
            if (!$scope.plan.comentarios){
                $scope.plan.comentarios = [];
            }
            var modalScope = $scope.$new();
            
            modalScope.data = {
                descripcion: '',
                cuando:undefined
            };
            $modal({template: '/views/planificacion20162019/agregarComentario.html', persist: true, show: true, backdrop: 'static', scope: modalScope});
        }
    };
    
    $scope.data = {
        numero: '',
        fecha: '',
        avances: '',
        compromisos: '',
        status: ''
    };
    
    $scope.agregarCompromiso = function(data) {
        if (!$scope.plan.compromisos) {
            $scope.plan.compromisos = [];
        }
        $scope.plan.compromisos.push(data);
        $scope.plan.compromisosLeidos = false;
        $scope.plan.$save({}, function() {
            $scope.data = {
                numero: '',
                fecha: '',
                avances: '',
                compromisos: '',
                status: ''
            };
        });
    };
    
    $scope.mostrarTema = function (r) {
        if (r.eliminado) {
            return false; 
        } else {
            return true;
        }
    };

    $scope.agregarComenPresu = function(confirmado, data) {
        if (confirmado) {
            $scope.plan.comentariosPresupuesto.push(data);
        }
        else {
            if (!$scope.plan.comentariosPresupuesto){
                $scope.plan.comentariosPresupuesto = [];
            }
            var modalScope = $scope.$new();
            
            modalScope.data = {
                descripcion: '',
                cuando:undefined
            };
            $modal({template: '/views/planificacion20162019/agregarComentarioPresupuesto.html', persist: true, show: true, backdrop: 'static', scope: modalScope});
        }
    };

    $scope.agregarActividad = function(confirmado, bloque, data) {
        if (confirmado) {
            $scope.bloqueSeleccionado.actividades.push(data);
        }
        else {
            $scope.bloqueSeleccionado = bloque;
            if (!$scope.bloqueSeleccionado.actividades){
                $scope.bloqueSeleccionado.actividades = [];
            }
            var modalScope = $scope.$new();
            
            modalScope.data = {
                macroActividad: '',
                fechaInicio:undefined,
                fechaFin:undefined
            };
            $modal({template: '/views/planificacion20162019/agregarActividad.html', persist: true, show: true, backdrop: 'static', scope: modalScope});
        }
    };
    
    $scope.agregarDocumentacion = function(confirmado, data) {
        if (confirmado) {
            data.archivoId = $scope.uploadedFile.shift().id;
            $scope.plan.documentos.push(data);
            //showAlert('Se agrego una observación');
        }
        else {
            if ($scope.plan.documentos === undefined) {
                $scope.plan.documentos = [];
            }
            var modalScope = $scope.$new();
            
            modalScope.data = {
                descripcion: '',
                fecha: undefined,
                fuente: ''
            };
            $modal({template: '/views/planificacion20162019/agregarDocumento.html', persist: true, show: true, backdrop: 'static', scope: modalScope});
        }
    };
    
    $scope.abrirModal = function(idmodal) {
        $(idmodal).modal('show');
    };
    
    $scope.agregarEje = function(confirmado, data) {
        if (confirmado) {
            $scope.ejeNuevo.nombre = data.nombre;
            $scope.ejeNuevo.numero = data.numero;
            $scope.ejeNuevo.$save({}, function() {
                $scope.ejes = EjePlanificacion20162019.query();
            });
        }
        else {
            $scope.ejeNuevo = new EjePlanificacion20162019();
            var modalScope = $scope.$new();
            var ejes = EjePlanificacion20162019.query({}, function() {
                modalScope.data = {
                    nombre: '',
                    numero: (ejes.length + 1)
                };
            });
            $modal({template: '/views/planificacion20162019/agregarEje.html', persist: true, show: true, backdrop: 'static', scope: modalScope});
        }
    };
    
    $scope.uploaded = [];
    
    $scope.data = {
        descripcion: '',
        fecha: undefined,
        fuente: ''
    };
    
    $scope.modalCargaPresentaciones = function(confirmado) {
        if (confirmado) {
            $scope.data.archivoId = $scope.uploaded.shift().id;
            $scope.plan.presentaciones.push($scope.data);
        }
        else {
            if ($scope.plan.presentaciones === undefined) {
                $scope.plan.presentaciones = [];
            }
            
            $scope.data = {
                descripcion: '',
                fecha: undefined,
                fuente: ''
            };
            $modal({template: '/views/planificacion20162019/modals/modalCargaPresentaciones.html', persist: true, show: true, backdrop: 'static', scope: $scope});
        }
    };
    
    $scope.modalCargaMinutas = function(confirmado) {
        if (confirmado) {
            $scope.data.archivoId = $scope.uploaded.shift().id;
            $scope.plan.minutas.push($scope.data);
        }
        else {
            if ($scope.plan.minutas === undefined) {
                $scope.plan.minutas = [];
            }
            
            $scope.data = {
                descripcion: '',
                fecha: undefined,
                fuente: ''
            };
            $modal({template: '/views/planificacion20162019/modals/modalCargaMinutas.html', persist: true, show: true, backdrop: 'static', scope: $scope});
        }
    };
    
    $scope.agregarEstrategia = function(confirmado, data) {
        if (confirmado) {
            if (data.eje) {
                var estrategias = EstrategiaPlanificacion20162019.query({
                    eje : data.eje
                }, function() {
                    if (estrategias.length) {
                        $scope.estrategiaNueva.numero = $scope.ejePorId(data.eje).numero + "." + (estrategias.length + 1);
                    } else {
                        $scope.estrategiaNueva.numero = $scope.ejePorId(data.eje).numero + ".1";
                    }
                    $scope.estrategiaNueva.eje = data.eje;
                    $scope.estrategiaNueva.nombre = data.nombre;
                    $scope.estrategiaNueva.$save({}, function() {
                        $scope.estrategias = EstrategiaPlanificacion20162019.query();
                    });
                });
            } else {
                alert("Falto cargar el eje al que pertenece.");
            }
        }
        else {
            $scope.estrategiaNueva = new EstrategiaPlanificacion20162019();
            var modalScope = $scope.$new();
            
            modalScope.data = {
                eje: '',
                nombre: '',
                numero: ''
            };
            $modal({template: '/views/planificacion20162019/agregarEstrategia.html', persist: true, show: true, backdrop: 'static', scope: modalScope});
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
    
    $scope.ejePorId = function (id) {
      for (var i = 0; i < $scope.ejes.length; i++) {
          if ($scope.ejes[i]._id == id)
          {
              return $scope.ejes[i];
          }
      }  
    };
    
    $scope.estrategiaPorId = function (id) {
      for (var i = 0; i < $scope.estrategias.length; i++) {
          if ($scope.estrategias[i]._id == id)
          {
              return $scope.estrategias[i];
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
    
    $scope.contactoPorId = function (id) {
      for (var i = 0; i < $scope.contactos.length; i++) {
          if ($scope.contactos[i]._id == id)
          {
              return $scope.contactos[i];
          }
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
    
    $scope.sumaFila = function (i) {
        var total = 0;
        if (i.a2015) total = total + parseInt(i.a2015);
        if (i.a2016) total = total + parseInt(i.a2016);
        if (i.a2017) total = total + parseInt(i.a2017);
        if (i.a2018) total = total + parseInt(i.a2018);
        if (i.a2019) total = total + parseInt(i.a2019);
        return total;
    };
    
    $scope.sumaColumna = function (anio) {
        var total = 0;
        if ($scope.plan.actividades) {
            for (var i = 0; i < $scope.plan.actividades.length; i++) {
                if (anio == "a2015") {
                    if ($scope.plan.actividades[i].a2015) total = total + parseInt($scope.plan.actividades[i].a2015);
                }
                if (anio == "a2016") {
                    if ($scope.plan.actividades[i].a2016) total = total + parseInt($scope.plan.actividades[i].a2016);
                }
                if (anio == "a2017") {
                    if ($scope.plan.actividades[i].a2017) total = total + parseInt($scope.plan.actividades[i].a2017);
                }
                if (anio == "a2018") {
                    if ($scope.plan.actividades[i].a2018) total = total + parseInt($scope.plan.actividades[i].a2018);
                }
                if (anio == "a2019") {
                    if ($scope.plan.actividades[i].a2019) total = total + parseInt($scope.plan.actividades[i].a2019);
                }
                if (anio == "total") total = total + $scope.sumaFila($scope.plan.actividades[i]);
            }
        }
        return total;
    };
    
    //Agregar temas
    $scope.agregarTema = function(dataTema) {
        if (!$scope.plan.temas) {
            $scope.plan.temas = [];
        }
        $scope.plan.temas.push(dataTema);
        $scope.dataTema = "";
    };
    
    //Agregar bloques
    $scope.agregarBloque = function(dataBloque) {
        if (!$scope.plan.bloques) {
            $scope.plan.bloques = [];
        }
        $scope.plan.bloques.push(dataBloque);
        $scope.dataBloque = "";
    };
    
    //Agregar actividades
    $scope.agregarAct = function(dataActividad) {
        if (!$scope.plan.actividades) {
            $scope.plan.actividades = [];
        }
        $scope.plan.actividades.push(dataActividad);
        $scope.dataActividad = "";
    };
    
    //Agregar comunas
    $scope.agregarComuna = function(dataComuna) {
        if (!$scope.plan.comunasImpactadas) {
            $scope.plan.comunasImpactadas = [];
        }
        if (dataComuna == "Todas") {
            $scope.plan.comunasImpactadas = ["50dcc0cd1dd1ce357600002a", "50dcc0cd1dd1ce357600002b", "50dcc0cd1dd1ce357600002c", "50dcc0cd1dd1ce357600002d", "50dcc0cd1dd1ce357600002e", "50dcc0cd1dd1ce357600002f", "50dcc0cd1dd1ce3576000030", "50dcc0cd1dd1ce3576000031", "50dcc0cd1dd1ce3576000032", "50dcc0cd1dd1ce3576000033", "50dcc0cd1dd1ce3576000034", "50dcc0cd1dd1ce3576000035", "50dcc0cd1dd1ce3576000036", "50dcc0cd1dd1ce3576000037", "50dcc0cd1dd1ce3576000038"];
        } else {
            $scope.plan.comunasImpactadas.push(dataComuna);
        }
        $scope.dataComuna = "";
    };
    
    //Agregar status
    $scope.agregarStatus = function(dataStatus) {
        if (!$scope.plan.statusOperativo) {
            $scope.plan.statusOperativo = [];
        }
        $scope.plan.statusOperativo.push(dataStatus);
        $scope.dataStatus = "";
    };
    
    $scope.eliminarListaElemConfirm = function(elemento, lista) {
        if (confirm("Desea eliminar el registro?")) {
            lista.splice(lista.indexOf(elemento), 1);
        }
    };
    
    $scope.eliminarListaElem = function(elemento, lista) {
        lista.splice(lista.indexOf(elemento), 1);
    };
    
    $scope.reverse = function(array) {
        var copy = [].concat(array);
        return copy.reverse();
    };
    
    $scope.eliminarElemento = function(array,elemento) {
        if (confirm("Desea eliminar el registro?")) {
            var indice = array.indexOf(elemento);
            if(indice!=-1) array.splice(indice, 1);
        }
    };
	
	$scope.guardar = function() {
	    if (!$scope.plan.nombreProyecto) {
	        alert("Falta Cargar Iniciativa");
	    } else {
            $scope.plan.$save({}, function() {
                $location.url('/planificacion20162019');
            });
	    }
	};
})
.controller('Planificacion20162019DetalleCtrl', function($scope, $location, $http, Planificacion20162019, EjePlanificacion20162019, EstrategiaPlanificacion20162019, Comuna, ORMTema, Contactos, ORMOrganigrama, User, $modal, $routeParams) {
    $scope.plan = Planificacion20162019.get({
        _id : $routeParams._id
    });
    
	$scope.ejes = EjePlanificacion20162019.query();
	$scope.estrategias = EstrategiaPlanificacion20162019.query();
	$scope.proyectos = Planificacion20162019.query();
	$scope.temas = ORMTema.query();
	$scope.contactos = Contactos.listar();
	$scope.comunas = Comuna.query();
	$scope.organigrama = ORMOrganigrama.query({}, function() {
        $scope.organigrama.push({
            _id : "zzz01",
            nombreCompleto : "Proyectos Público Privados"
        });
        $scope.organigrama.push({
            _id : "zzz02",
            nombreCompleto : "Otros Proyectos"
        });
        $scope.organigrama.push({
            _id : "zzz03",
            nombreCompleto : "Villa 31"
        });
        $scope.organigrama.push({
            _id : "zzz04",
            nombreCompleto : "Policía Metropolitana"
        });
        $scope.organigrama.push({
            _id : "zzz05",
            nombreCompleto : "BA Caminable"
        });
        $scope.organigrama.push({
            _id : "zzz06",
            nombreCompleto : "Proyectos en evaluación"
        });
        $scope.organigrama.push({
            _id : "zzz07",
            nombreCompleto : "Urbanización Villa 31"
        });
        $scope.organigrama.push({
            _id : "zzz08",
            nombreCompleto : "Temas aún no encarados"
        });
	});
    $scope.tab = "ficha";
    $scope.uploadedFile = [];
    
    $scope.uploaded = [];
    
    $scope.data = {
        descripcion: '',
        fecha: undefined,
        fuente: ''
    };
    
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
    
    $scope.contactoPorId = function (id) {
      for (var i = 0; i < $scope.contactos.length; i++) {
          if ($scope.contactos[i]._id == id)
          {
              return $scope.contactos[i];
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
    
    $scope.data = {
        numero: '',
        fecha: '',
        avances: '',
        compromisos: '',
        status: ''
    };
    
    $scope.agregarCompromiso = function(data) {
        if (!$scope.plan.compromisos) {
            $scope.plan.compromisos = [];
        }
        $scope.plan.compromisos.push(data);
        $scope.plan.compromisosLeidos = false;
        $scope.plan.$save({}, function() {
            $scope.data = {
                numero: '',
                fecha: '',
                avances: '',
                compromisos: '',
                status: ''
            };
        });
    };
    
    $scope.proyectoPorId = function (id) {
      for (var i = 0; i < $scope.proyectos.length; i++) {
          if ($scope.proyectos[i]._id == id)
          {
              return $scope.proyectos[i];
          }
      }  
    };
    
    $scope.ejePorId = function (id) {
      for (var i = 0; i < $scope.ejes.length; i++) {
          if ($scope.ejes[i]._id == id)
          {
              return $scope.ejes[i];
          }
      }  
    };
    
    $scope.estrategiaPorId = function (id) {
      for (var i = 0; i < $scope.estrategias.length; i++) {
          if ($scope.estrategias[i]._id == id)
          {
              return $scope.estrategias[i];
          }
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
    
    $scope.proyectosHijos = function (id) {
        var hijos = [];
        for (var i = 0; i < $scope.proyectos.length; i++) {
            if ($scope.proyectos[i].proyectoPadre == id)
            {
                hijos.push($scope.proyectos[i]._id);
            }
        }  
        return hijos;
    };
    
    $scope.sumaFila = function (i) {
        var total = 0;
        if (i.a2015) total = total + parseInt(i.a2015);
        if (i.a2016) total = total + parseInt(i.a2016);
        if (i.a2017) total = total + parseInt(i.a2017);
        if (i.a2018) total = total + parseInt(i.a2018);
        if (i.a2019) total = total + parseInt(i.a2019);
        return total;
    };
    
    $scope.sumaColumna = function (anio) {
        var total = 0;
        if ($scope.plan.actividades) {
            for (var i = 0; i < $scope.plan.actividades.length; i++) {
                if (anio == "a2015") {
                    if ($scope.plan.actividades[i].a2015) total = total + parseInt($scope.plan.actividades[i].a2015);
                }
                if (anio == "a2016") {
                    if ($scope.plan.actividades[i].a2016) total = total + parseInt($scope.plan.actividades[i].a2016);
                }
                if (anio == "a2017") {
                    if ($scope.plan.actividades[i].a2017) total = total + parseInt($scope.plan.actividades[i].a2017);
                }
                if (anio == "a2018") {
                    if ($scope.plan.actividades[i].a2018) total = total + parseInt($scope.plan.actividades[i].a2018);
                }
                if (anio == "a2019") {
                    if ($scope.plan.actividades[i].a2019) total = total + parseInt($scope.plan.actividades[i].a2019);
                }
                if (anio == "total") total = total + $scope.sumaFila($scope.plan.actividades[i]);
            }
        }
        return total;
    };
    
    $scope.modalCargaPresentaciones = function(confirmado, idJuris) {
        if (confirmado) {
            $scope.data.archivoId = $scope.uploaded.shift().id;
            $scope.plan.presentaciones.push($scope.data);
        }
        else {
            if ($scope.plan.presentaciones === undefined) {
                $scope.plan.presentaciones = [];
            }
            
            $scope.data = {
                descripcion: '',
                fecha: undefined,
                fuente: ''
            };
            $modal({template: '/views/planificacion20162019/modals/modalCargaPresentaciones.html', persist: true, show: true, backdrop: 'static', scope: $scope});
        }
    };
    
    $scope.modalCargaMinutas = function(confirmado, idJuris) {
        if (confirmado) {
            $scope.data.archivoId = $scope.uploaded.shift().id;
            $scope.plan.minutas.push($scope.data);
        }
        else {
            if ($scope.plan.minutas === undefined) {
                $scope.plan.minutas = [];
            }
            
            $scope.data = {
                descripcion: '',
                fecha: undefined,
                fuente: ''
            };
            $modal({template: '/views/planificacion20162019/modals/modalCargaMinutas.html', persist: true, show: true, backdrop: 'static', scope: $scope});
        }
    };
    
    //Agregar temas
    $scope.agregarTema = function(dataTema) {
        if (!$scope.plan.temas) {
            $scope.plan.temas = [];
        }
        $scope.plan.temas.push(dataTema);
        $scope.dataTema = "";
    };
    
    //Agregar comunas
    $scope.agregarComuna = function(dataComuna) {
        if (!$scope.plan.comunasImpactadas) {
            $scope.plan.comunasImpactadas = [];
        }
        if (dataComuna == "Todas") {
            $scope.plan.comunasImpactadas = ["50dcc0cd1dd1ce357600002a", "50dcc0cd1dd1ce357600002b", "50dcc0cd1dd1ce357600002c", "50dcc0cd1dd1ce357600002d", "50dcc0cd1dd1ce357600002e", "50dcc0cd1dd1ce357600002f", "50dcc0cd1dd1ce3576000030", "50dcc0cd1dd1ce3576000031", "50dcc0cd1dd1ce3576000032", "50dcc0cd1dd1ce3576000033", "50dcc0cd1dd1ce3576000034", "50dcc0cd1dd1ce3576000035", "50dcc0cd1dd1ce3576000036", "50dcc0cd1dd1ce3576000037", "50dcc0cd1dd1ce3576000038"];
        } else {
            $scope.plan.comunasImpactadas.push(dataComuna);
        }
        $scope.dataComuna = "";
    };
    
    //Agregar bloques
    $scope.agregarBloque = function(dataBloque) {
        if (!$scope.plan.bloques) {
            $scope.plan.bloques = [];
        }
        $scope.plan.bloques.push(dataBloque);
        $scope.dataBloque = "";
    };
    
    $scope.agregarDocumentacion = function(confirmado, data) {
        if (confirmado) {
            data.archivoId = $scope.uploadedFile.shift().id;
            $scope.plan.documentos.push(data);
            //showAlert('Se agrego una observación');
        }
        else {
            if ($scope.plan.documentos === undefined) {
                $scope.plan.documentos = [];
            }
            var modalScope = $scope.$new();
            
            modalScope.data = {
                descripcion: '',
                fecha: undefined,
                fuente: ''
            };
            $modal({template: '/views/planificacion20162019/agregarDocumento.html', persist: true, show: true, backdrop: 'static', scope: modalScope});
        }
    };
    
    $scope.abrirModal = function(idmodal) {
        $(idmodal).modal('show');
    };
    
    //Agregar actividades
    $scope.agregarAct = function(dataActividad) {
        if (!$scope.plan.actividades) {
            $scope.plan.actividades = [];
        }
        $scope.plan.actividades.push(dataActividad);
        $scope.dataActividad = "";
    };
    
    //Agregar status
    $scope.agregarStatus = function(dataStatus) {
        if (!$scope.plan.statusOperativo) {
            $scope.plan.statusOperativo = [];
        }
        $scope.plan.statusOperativo.push(dataStatus);
        $scope.dataStatus = "";
    };
    
    $scope.eliminarListaElemConfirm = function(elemento, lista) {
        if (confirm("Desea eliminar el registro?")) {
            lista.splice(lista.indexOf(elemento), 1);
        }
    };
    
    $scope.eliminarListaElem = function(elemento, lista) {
        lista.splice(lista.indexOf(elemento), 1);
    };
    
    $scope.reverse = function(array) {
        var copy = [].concat(array);
        return copy.reverse();
    };
    
    $scope.dameFrecuencia = function (frecuencia) {
        if (frecuencia == "7") {
            return "Semanal";
        } else if (frecuencia == "30") {
            return "Mensual";
        } else if (frecuencia == "90") {
            return "Trimestral";
        } else if (frecuencia == "180") {
            return "Semestral";
        } else if (frecuencia == "365") {
            return "Anual";
        } else if (frecuencia == "0") {
            return "Eventual";
        }
    };
    
    $scope.agregarComen = function(confirmado, data) {
        if (confirmado) {
            $scope.plan.comentarios.push(data);
        }
        else {
            if (!$scope.plan.comentarios){
                $scope.plan.comentarios = [];
            }
            var modalScope = $scope.$new();
            
            modalScope.data = {
                descripcion: '',
                cuando:undefined
            };
            $modal({template: '/views/planificacion20162019/agregarComentario.html', persist: true, show: true, backdrop: 'static', scope: modalScope});
        }
    };
    
    $scope.agregarComenPresu = function(confirmado, data) {
        if (confirmado) {
            $scope.plan.comentariosPresupuesto.push(data);
        }
        else {
            if (!$scope.plan.comentariosPresupuesto){
                $scope.plan.comentariosPresupuesto = [];
            }
            var modalScope = $scope.$new();
            
            modalScope.data = {
                descripcion: '',
                cuando:undefined
            };
            $modal({template: '/views/planificacion20162019/agregarComentarioPresupuesto.html', persist: true, show: true, backdrop: 'static', scope: modalScope});
        }
    };

    $scope.agregarActividad = function(confirmado, bloque, data) {
        if (confirmado) {
            $scope.bloqueSeleccionado.actividades.push(data);
        }
        else {
            $scope.bloqueSeleccionado = bloque;
            if (!$scope.bloqueSeleccionado.actividades){
                $scope.bloqueSeleccionado.actividades = [];
            }
            var modalScope = $scope.$new();
            
            modalScope.data = {
                macroActividad: '',
                fechaInicio:undefined,
                fechaFin:undefined
            };
            $modal({template: '/views/planificacion20162019/agregarActividad.html', persist: true, show: true, backdrop: 'static', scope: modalScope});
        }
    };
    
    $scope.agregarEje = function(confirmado, data) {
        if (confirmado) {
            $scope.ejeNuevo.nombre = data.nombre;
            $scope.ejeNuevo.numero = data.numero;
            $scope.ejeNuevo.$save({}, function() {
                $scope.ejes = EjePlanificacion20162019.query();
            });
        }
        else {
            $scope.ejeNuevo = new EjePlanificacion20162019();
            var modalScope = $scope.$new();
            var ejes = EjePlanificacion20162019.query({}, function() {
                modalScope.data = {
                    nombre: '',
                    numero: (ejes.length + 1)
                };
            });
            $modal({template: '/views/planificacion20162019/agregarEje.html', persist: true, show: true, backdrop: 'static', scope: modalScope});
        }
    };
    
    $scope.agregarEstrategia = function(confirmado, data) {
        if (confirmado) {
            if (data.eje) {
                var estrategias = EstrategiaPlanificacion20162019.query({
                    eje : data.eje
                }, function() {
                    if (estrategias.length) {
                        $scope.estrategiaNueva.numero = $scope.ejePorId(data.eje).numero + "." + (estrategias.length + 1);
                    } else {
                        $scope.estrategiaNueva.numero = $scope.ejePorId(data.eje).numero + ".1";
                    }
                    $scope.estrategiaNueva.eje = data.eje;
                    $scope.estrategiaNueva.nombre = data.nombre;
                    $scope.estrategiaNueva.$save({}, function() {
                        $scope.estrategias = EstrategiaPlanificacion20162019.query();
                    });
                });
            } else {
                alert("Falto cargar el eje al que pertenece.");
            }
        }
        else {
            $scope.estrategiaNueva = new EstrategiaPlanificacion20162019();
            var modalScope = $scope.$new();
            
            modalScope.data = {
                eje: '',
                nombre: '',
                numero: ''
            };
            $modal({template: '/views/planificacion20162019/agregarEstrategia.html', persist: true, show: true, backdrop: 'static', scope: modalScope});
        }
    };
    
    $scope.guardar = function(){
        $scope.plan.$save();
    };
    
    $scope.eliminarElemento = function(array,elemento) {
        if (confirm("Desea eliminar el registro?")) {
            var indice = array.indexOf(elemento);
            if(indice!=-1) array.splice(indice, 1);
        }
    };
    
    $scope.eliminar = function() {
        if (confirm("Desea eliminar el registro?")) {
            $scope.plan.$delete({}, function() {
                $location.url('/planificacion20162019');
            });
        }
    };
})
.controller('ReportePlanificacion20162019Ctrl', function($scope, $location, $http, Planificacion20162019, $window, ORMOrganigrama, ORMContacto, Comuna, EjePlanificacion20162019, EstrategiaPlanificacion20162019, $modal, $routeParams) {
	$scope.planes = Planificacion20162019.query();
    $scope.orden = 'numero';
	$scope.ejes = EjePlanificacion20162019.query();
	$scope.estrategias = EstrategiaPlanificacion20162019.query();
	$scope.organigrama = ORMOrganigrama.query({}, function() {
        $scope.organigrama.push({
            _id : "zzz01",
            nombreCompleto : "Proyectos Público Privados"
        });
        $scope.organigrama.push({
            _id : "zzz02",
            nombreCompleto : "Otros Proyectos"
        });
        $scope.organigrama.push({
            _id : "zzz03",
            nombreCompleto : "Villa 31"
        });
        $scope.organigrama.push({
            _id : "zzz04",
            nombreCompleto : "Policía Metropolitana"
        });
        $scope.organigrama.push({
            _id : "zzz05",
            nombreCompleto : "BA Caminable"
        });
        $scope.organigrama.push({
            _id : "zzz06",
            nombreCompleto : "Proyectos en evaluación"
        });
        $scope.organigrama.push({
            _id : "zzz07",
            nombreCompleto : "Urbanización Villa 31"
        });
        $scope.organigrama.push({
            _id : "zzz08",
            nombreCompleto : "Temas aún no encarados"
        });
	});
	$scope.comunas = Comuna.query();
	$scope.contactos = ORMContacto.query();
	$scope.todos = false;
    
    $scope.estrategiaTieneProyectos = function (id) {
      for (var i = 0; i < $scope.planes.length; i++) {
          if ($scope.planes[i].estrategia == id)
          {
              return true;
          }
      }  
    };
    
    $scope.ejeTieneProyectos = function (id) {
      for (var i = 0; i < $scope.planes.length; i++) {
          if ($scope.planes[i].eje == id)
          {
              return true;
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
    
    $scope.filtroSoloPadres = function (plan) {
        if ($scope.todos) {
            return true;
        } else if (plan.proyectoPadre) {
            if (plan.proyectoPadre === "") {
                return true;
            } else {
                return false;
            }
        } else {
            return true;
        }
    };
    
    $scope.ejePorId = function (id) {
      for (var i = 0; i < $scope.ejes.length; i++) {
          if ($scope.ejes[i]._id == id)
          {
              return $scope.ejes[i];
          }
      }  
    };
    
    $scope.imprimir = function () {
        $window.print(); 
    };
    
    $scope.compararArrays = function (array1, array2) {
        var resultado = true;
        if (array1.length == array2.length) {
            for (var i = 0; i < array1.length; i++) {
                if (array1[i] != array2[i])
                {
                    resultado = false;
                }
            } 
        } else {
            resultado = false;
        }
        return resultado;
    };
    
    $scope.estrategiaPorId = function (id) {
      for (var i = 0; i < $scope.estrategias.length; i++) {
          if ($scope.estrategias[i]._id == id)
          {
              return $scope.estrategias[i];
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
    
    $scope.organigramaPorId = function (id) {
      for (var i = 0; i < $scope.organigrama.length; i++) {
          if ($scope.organigrama[i]._id == id)
          {
              return $scope.organigrama[i];
          }
      }  
    };
    
});
