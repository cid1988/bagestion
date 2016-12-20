angular.module('bag2.planba2030', [])
.controller('PlanBA2030Ctrl', function($scope, $location, $http, PlanBA2030, Contactos, ORMOrganigrama, Comuna, EjePlanBA2030, EstrategiaPlanBA2030, $modal, $routeParams) {
	$scope.planes = PlanBA2030.query({}, function() {
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
	$scope.ejes = EjePlanBA2030.query();
	$scope.estrategias = EstrategiaPlanBA2030.query();
	$scope.organigrama = ORMOrganigrama.query();
	$scope.comunas = Comuna.query();
	$scope.contactos = Contactos.listar();
    
    $scope.ejePorId = function (id) {
      for (var i = 0; i < $scope.ejes.length; i++) {
          if ($scope.ejes[i]._id == id)
          {
              return $scope.ejes[i];
          }
      }  
    };
    
    $scope.actualizar = function () {
        $scope.planes = PlanBA2030.query({}, function() {
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
    
    $scope.orden = function (p) {
        if (p.prioridad == "A+") {
            return $scope.estrategiaPorId(p.estrategia).numero + ".0";
        } else if (p.prioridad == "A") {
            return $scope.estrategiaPorId(p.estrategia).numero + ".1";
        } else if (p.prioridad == "B") {
            return $scope.estrategiaPorId(p.estrategia).numero + ".2";
        } else if (p.prioridad == "C") {
            return $scope.estrategiaPorId(p.estrategia).numero + ".3";
        } else {
            return $scope.estrategiaPorId(p.estrategia).numero + ".4";
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
        $scope.planSeleccionado = PlanBA2030.get({
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
        $modal({template: '/views/planba2030/comentariosHRL.html', persist: true, show: true, backdrop: 'static', scope: $scope});
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
    
    $scope.agregarComenHRL = function(planSeleccionado, data) {
        if (!planSeleccionado.comentariosHRL) {
            planSeleccionado.comentariosHRL = [];
        }
        var d = new Date();
        planSeleccionado.comentariosHRL.push(data);
        planSeleccionado.$save({}, function() {
            $scope.data = {
                descripcion: '',
                cuando: (d.getDate() + "/" + (d.getMonth()+1) + "/" + d.getFullYear())
            };
        });
    };
    
    $scope.guardarSeleccionado = function() {
        $scope.planSeleccionado.$save();
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
                hijos.push($scope.planes[i]._id);
            }
        }  
        return hijos;
    };
    
    //Filtro de prioridades-----------------------------------------------------------------
    $scope.prioridadesFiltradas = [];
    $scope.prioridadesFiltradas['A+'] = true;
    $scope.prioridadesFiltradas['A'] = true;
    $scope.prioridadesFiltradas['B'] = true;
    $scope.prioridadesFiltradas['C'] = true;
    $scope.prioridadesFiltradas['L'] = true;
    $scope.prioridadesFiltradas[''] = true;
    
    $scope.filtrandoPrioridad = function (p) {
        return $scope.prioridadesFiltradas[p];
    };
    
    $scope.cambiarFiltroPrioridad = function (p) {
       $scope.prioridadesFiltradas[p] = !$scope.prioridadesFiltradas[p];
    };
    
    $scope.filtroPrioridades = function (plan) {
        return ($scope.prioridadesFiltradas[plan.prioridad] || (($scope.prioridadesFiltradas['L'] === true) && plan.foco));
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
    
    $scope.mostrarFicha = function (id) {
        $scope.planPresentacion = PlanBA2030.get({_id: id}, function() {
            $modal({template: '/views/planba2030/verFicha.html', persist: true, show: true, backdrop: 'static', scope: $scope.$new()});
        });
    };
    
    $scope.mostrarPresupuesto = function (id) {
        $scope.planPresentacion = PlanBA2030.get({_id: id}, function() {
            $modal({template: '/views/planba2030/verPresupuesto.html', persist: true, show: true, backdrop: 'static', scope: $scope.$new()});
        });
    };
    $scope.sumaColumna = function (anio) {
        var total = 0;
        if ($scope.planPresentacion.actividades) {
            for (var i = 0; i < $scope.planPresentacion.actividades.length; i++) {
                if (anio == "a2015") {
                    if ($scope.planPresentacion.actividades[i].a2015) total = total + parseInt($scope.planPresentacion.actividades[i].a2015);
                }
                if (anio == "a2016") {
                    if ($scope.planPresentacion.actividades[i].a2016) total = total + parseInt($scope.planPresentacion.actividades[i].a2016);
                }
                if (anio == "a2017") {
                    if ($scope.planPresentacion.actividades[i].a2017) total = total + parseInt($scope.planPresentacion.actividades[i].a2017);
                }
                if (anio == "a2018") {
                    if ($scope.planPresentacion.actividades[i].a2018) total = total + parseInt($scope.planPresentacion.actividades[i].a2018);
                }
                if (anio == "a2019") {
                    if ($scope.planPresentacion.actividades[i].a2019) total = total + parseInt($scope.planPresentacion.actividades[i].a2019);
                }
                if (anio == "total") total = total + $scope.sumaFila($scope.planPresentacion.actividades[i]);
            }
        }
        return total;
    };
    
})
.controller('PlanBA2030NuevoCtrl', function($scope, $location, $http, PlanBA2030, EjePlanBA2030, EstrategiaPlanBA2030, ORMTema, Comuna, Contactos, ORMOrganigrama, User, $modal, $routeParams) {
	$scope.plan = new PlanBA2030();
    $scope.plan.statusOperativo = [];
    $scope.plan.statusOperativo[0]='white';
    $scope.plan.statusOperativo[1]='white';
    $scope.plan.statusOperativo[2]='white';
    $scope.plan.eje='';
    $scope.plan.estrategia='';
    $scope.plan.areaSponsor='';
    $scope.plan.prioridad='';
    $scope.plan.foco = false;
	$scope.ejes = EjePlanBA2030.query();
	$scope.estrategias = EstrategiaPlanBA2030.query();
	$scope.proyectos = PlanBA2030.query();
	$scope.temas = ORMTema.query();
	$scope.contactos = Contactos.listar();
	$scope.organigrama = ORMOrganigrama.query();
	$scope.comunas = Comuna.query();
    $scope.tab = "ficha";
    $scope.uploadedFile = [];
    
    $scope.$watch('plan.estrategia', function (estrategia){
        if (estrategia) {
            var proyectos = PlanBA2030.query({
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
            $modal({template: '/views/planba2030/agregarComentario.html', persist: true, show: true, backdrop: 'static', scope: modalScope});
        }
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
            $modal({template: '/views/planba2030/agregarComentarioPresupuesto.html', persist: true, show: true, backdrop: 'static', scope: modalScope});
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
            $modal({template: '/views/planba2030/agregarActividad.html', persist: true, show: true, backdrop: 'static', scope: modalScope});
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
            $modal({template: '/views/planba2030/agregarDocumento.html', persist: true, show: true, backdrop: 'static', scope: modalScope});
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
                $scope.ejes = EjePlanBA2030.query();
            });
        }
        else {
            $scope.ejeNuevo = new EjePlanBA2030();
            var modalScope = $scope.$new();
            var ejes = EjePlanBA2030.query({}, function() {
                modalScope.data = {
                    nombre: '',
                    numero: (ejes.length + 1)
                };
            });
            $modal({template: '/views/planba2030/agregarEje.html', persist: true, show: true, backdrop: 'static', scope: modalScope});
        }
    };
    
    $scope.agregarEstrategia = function(confirmado, data) {
        if (confirmado) {
            if (data.eje) {
                var estrategias = EstrategiaPlanBA2030.query({
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
                        $scope.estrategias = EstrategiaPlanBA2030.query();
                    });
                });
            } else {
                alert("Falto cargar el eje al que pertenece.");
            }
        }
        else {
            $scope.estrategiaNueva = new EstrategiaPlanBA2030();
            var modalScope = $scope.$new();
            
            modalScope.data = {
                eje: '',
                nombre: '',
                numero: ''
            };
            $modal({template: '/views/planba2030/agregarEstrategia.html', persist: true, show: true, backdrop: 'static', scope: modalScope});
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
        var indice = array.indexOf(elemento);
        if(indice!=-1) array.splice(indice, 1);
    };
	
	$scope.guardar = function() {
	    if (!$scope.plan.nombreProyecto) {
	        alert("Falta Cargar Nombre de Proyecto");
	    } else if (!$scope.plan.eje) {
	        alert("Falta Cargar Eje");
	    } else if (!$scope.plan.estrategia) {
	        alert("Falta Cargar Estrategia");
	    } else {
            $scope.plan.$save({}, function() {
                $location.url('/planba2030');
            });
	    }
	};
})
.controller('PlanBA2030DetalleCtrl', function($scope, $location, $http, PlanBA2030, EjePlanBA2030, EstrategiaPlanBA2030, Comuna, ORMTema, Contactos, ORMOrganigrama, User, $modal, $routeParams) {
    $scope.plan = PlanBA2030.get({
        _id : $routeParams._id
    });
    
	$scope.ejes = EjePlanBA2030.query();
	$scope.estrategias = EstrategiaPlanBA2030.query();
	$scope.proyectos = PlanBA2030.query();
	$scope.temas = ORMTema.query();
	$scope.contactos = Contactos.listar();
	$scope.comunas = Comuna.query();
	$scope.organigrama = ORMOrganigrama.query();
    $scope.tab = "ficha";
    $scope.uploadedFile = [];
    
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
            $modal({template: '/views/planba2030/agregarDocumento.html', persist: true, show: true, backdrop: 'static', scope: modalScope});
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
            $modal({template: '/views/planba2030/agregarComentario.html', persist: true, show: true, backdrop: 'static', scope: modalScope});
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
            $modal({template: '/views/planba2030/agregarComentarioPresupuesto.html', persist: true, show: true, backdrop: 'static', scope: modalScope});
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
            $modal({template: '/views/planba2030/agregarActividad.html', persist: true, show: true, backdrop: 'static', scope: modalScope});
        }
    };
    
    $scope.agregarEje = function(confirmado, data) {
        if (confirmado) {
            $scope.ejeNuevo.nombre = data.nombre;
            $scope.ejeNuevo.numero = data.numero;
            $scope.ejeNuevo.$save({}, function() {
                $scope.ejes = EjePlanBA2030.query();
            });
        }
        else {
            $scope.ejeNuevo = new EjePlanBA2030();
            var modalScope = $scope.$new();
            var ejes = EjePlanBA2030.query({}, function() {
                modalScope.data = {
                    nombre: '',
                    numero: (ejes.length + 1)
                };
            });
            $modal({template: '/views/planba2030/agregarEje.html', persist: true, show: true, backdrop: 'static', scope: modalScope});
        }
    };
    
    $scope.agregarEstrategia = function(confirmado, data) {
        if (confirmado) {
            if (data.eje) {
                var estrategias = EstrategiaPlanBA2030.query({
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
                        $scope.estrategias = EstrategiaPlanBA2030.query();
                    });
                });
            } else {
                alert("Falto cargar el eje al que pertenece.");
            }
        }
        else {
            $scope.estrategiaNueva = new EstrategiaPlanBA2030();
            var modalScope = $scope.$new();
            
            modalScope.data = {
                eje: '',
                nombre: '',
                numero: ''
            };
            $modal({template: '/views/planba2030/agregarEstrategia.html', persist: true, show: true, backdrop: 'static', scope: modalScope});
        }
    };
    
    $scope.guardar = function(){
        $scope.plan.$save();
    };
    
    $scope.eliminarElemento = function(array,elemento) {
        var indice = array.indexOf(elemento);
        if(indice!=-1) array.splice(indice, 1);
    };
    
    $scope.eliminar = function() {
        if (confirm("Desea eliminar el registro?")) {
            $scope.plan.$delete({}, function() {
                $location.url('/planba2030');
            });
        }
    };
})
.controller('ReportePlanBA2030Ctrl', function($scope, $location, $http, PlanBA2030, $window, ORMOrganigrama, ORMContacto, Comuna, EjePlanBA2030, EstrategiaPlanBA2030, $modal, $routeParams) {
	$scope.planes = PlanBA2030.query();
    $scope.orden = 'numero';
	$scope.ejes = EjePlanBA2030.query();
	$scope.estrategias = EstrategiaPlanBA2030.query();
	$scope.organigrama = ORMOrganigrama.query();
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
