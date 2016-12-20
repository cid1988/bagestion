angular.module('bag2.agenda.calendario', [])
    .controller('AgendaCtrl',
    function($scope, SRColoresPorAgenda, $state, $stateProvider, Contactos, ORMContacto, Agenda, AgendaInstancia, $timeout, SRRolesPorKey, SRTiposAsistenciaPorKey, $location, $rootScope, $http) {
    $scope.filtro = {};
    
    $scope.$on('programar-nueva-fecha', function (event, r) {
        // $scope.$broadcast('programar-nueva-fecha', r);
        $scope.programandoNuevaFecha = r;
    });
    
    $scope.orderByStar = function(c1, c2) {
        return (((c1 && c1.star) || 0) && 1) - (((c2 && c2.star) || 0) && 1);
    };
    
    $scope.volver = function() {
        $location.url('/agenda/');
    };
    
    $scope.estado = {
        trabajando: 0
    };
    $scope.estado.trabajando++;
    $scope.contactos = Contactos.listar(function() {
        $scope.estado.trabajando--;
        $scope.contactosPorId = {};
        $scope.contactos.forEach(function(c) {
            $scope.contactosPorId[c._id] = c;
        });
    });
    $scope.$on('start-edit', function(event, accept) {
        $scope.editando = true;
        $rootScope.$emit('edit-started');
    });
    $scope.$on('stop-edit', function(event, accept) {
        $scope.editando = false;
        $rootScope.$emit('edit-stoped');
    });
    $scope.$on('add-date', function() {
        $scope.agregarFecha();
    });

    // usamos ?instancia=... para trackear el id seleccionado y para hacer significativa la URL
    $scope.instanciaSeleccionada = $location.search().instancia;

    //vamos a esperar a que la directiva fullcalendar agregue la función goToDate y 
    // la llamamos para asegurarnos que en el calendario
    $scope.$watch('instancia.desdeDate', function(d) {
        if ($scope.calendar && $scope.calendar.goToDate && d) {
            $scope.calendar.goToDate(new Date(d));
        }
    });

    // En este array vamos a guardar los objetos event de fullCalendar
    // http://arshaw.com/fullcalendar/docs/event_data/Event_Object/
    $scope.events = [];

    // diccionarios para acceder a los datos de las agendas y las instancias por id
    var agendasPorId = $scope.agendasPorId = {};
    var instanciasPorId = $scope.instanciasPorId = {};

    $scope.colorAgenda = function (r){
        return r.color;
    };
    
    var formatTipoAgendaCombo = function (object, container, query) {
            if (object.id != '') {
                var html = '<div style="width: 10px;height:10px;margin-right:4px;display:inline-block; background-color: '+ (object.color || 'grey') +'"></div>' + object.text;
                console.log(html);
                return html;
            } else {
                return object.text;
            }
        };
    $scope.tipoAgendaSelect2 = {
        formatResult: formatTipoAgendaCombo,
        // formatSelection: formatTipoAgendaCombo
    };
    
    var eventFromInstancia = function (i){
        return {
            title: i.titulo || '',
            start: new Date(i.desdeDate),
            end: new Date(i.hastaDate),
            editable: $scope.editando || false,
            allDay: false,
            color: $scope.agendaPorId(i.agenda).color || 'grey',
            html: '<i ng-repeat="p in agendasPorId[instancia.agenda].participantes" ngclass="{\'icon-star\': p.star, \'icon-star-empty\': !p.star}"></i> <span></span>',
            css: {
                opacity: (i._id != $scope.instanciaSeleccionada && '0.5') || '1.0'
            },
                // si agregamos estos campos al objeto event los mantiene
                // cuando lo pasa de parámetro en algún evento de UI (click, etc)
                agenda: i.agenda,
                _id: i._id
            };
    };

    var refrescar = function() {
        // borramos todos los eventos que había para el calendario
        $scope.events.splice(0, $scope.events.length);

        if ($scope.instancias) {
            $scope.instancias.forEach(function(i) {
                if (!$scope.filtro.agenda) {
                    $scope.events.push(eventFromInstancia(i));
                } else if ($scope.filtro.agenda && ($scope.agendaPorId(i.agenda)._id == $scope.filtro.agenda)) {
                    $scope.events.push(eventFromInstancia(i));
                }
            });
        }
        $scope.calendar.refreshEvents && $scope.calendar.refreshEvents();
    };
    
        var traerDatos = function() {
        // TODO: sacar MEBRolesPorKey
        $scope.rolesPorKey = SRRolesPorKey();

        // TODO: sacar MEBTiposAsistenciaPorKey
        $scope.tiposAsistenciaPorKey = SRTiposAsistenciaPorKey();

        $scope.estado.trabajando++;
        $scope.agendas = Agenda.query({usuario: $scope.username}, function() {
            $scope.estado.trabajando--;
            $scope.agendas.forEach(function(r) {
                $scope.agendasPorId[r._id] = r;
            });
    
            $scope.agendaPorId = function (id) {
                  if ($scope.agendasPorId[id])
                  {
                      return $scope.agendasPorId[id];
                  } else {
                      return " ";
                  }
            };
            
            $scope.instancias = AgendaInstancia.query({usuario: $scope.username}, function() {
                $scope.instancias.forEach(function(i) {
                    // la guardamos en el diccionario
                    instanciasPorId[i._id] = i;
                });

                if ($scope.instanciaSeleccionada) {
                    $scope.instancia = instanciasPorId[$scope.instanciaSeleccionada];
                    $scope.agenda = $scope.agendasPorId[$scope.instancia.agenda];
                }

                $scope.$watch('events', function() {
                    refrescar();
                }, true);

                $scope.$watch('filtro.agenda', function() {
                    refrescar();
                }, true);

                $scope.$watch('filtro.tipo', function() {
                    refrescar();
                }, true);
            });
        });
    };

    traerDatos();
    $scope.$on('recargar-agendas', traerDatos);

    $scope.reprogramados = {};

    $scope.huboReporogramacion = function() {
        for (var p in $scope.reprogramados) {
            return true;
        }
        return false;
    };

    $scope.editar = function() {
        $scope.editando = true;
    };
    $scope.cancelarReprogramacion = function() {
        refrescar();
    };
    $scope.guardarReporogramacion = function() {
        var quitarReprogramado = function(_id) {
            delete $scope.reprogramados[_id];
        };

        var guardarInstancia = function(_id) {
            var instancia = AgendaInstancia.findById({
                _id: _id
            }, function() {
                instancia.usuarioCreo = $scope.username;
                var reprogramada = $scope.reprogramados[_id];
                instancia.fecha = reprogramada.fecha;
                instancia.desdeHora = reprogramada.desdeHora;
                instancia.hastaHora = reprogramada.hastaHora;
                instancia.desdeDate = reprogramada.desdeDate;
                instancia.hastaDate = reprogramada.hastaDate;
                instancia.$save(function() {
                    quitarReprogramado(_id);
                });
                $scope.estado.trabajando--;
            }, function () {
                $scope.estado.trabajando--;
            });
        };
        
        
        for (var _id in $scope.reprogramados) {
            $scope.estado.trabajando++;
            guardarInstancia(_id);
        }
    };
    $scope.$watch('editando', function() {
        refrescar();
    });

    var actualizarConEvento = function(event) {
        var instancia = instanciasPorId[event._id];
        $scope.reprogramados[event._id] = instancia;
        instancia.usuarioCreo = $scope.username;
        instancia.fecha = event.start.format('dd/mm/yyyy');
        instancia.desdeHora = event.start.format('H:MM');
        instancia.hastaHora = event.end.format('H:MM');
        instancia.desdeDate = event.start.valueOf();
        instancia.hastaDate = event.end.valueOf();
    };

    $scope.calendar = {
        events: $scope.events,
        viewConfig: {
            height: 510,
            editable: true,
            defaultView: 'agendaWeek',
            header: {
                left: 'prev next agendaWeek month',
                center: 'today',
                right: 'title'
            },
            eventClick: function(event) {
                console.log('eventClick');
                $scope.instanciaSeleccionada = event._id;
                $location.search('instancia', event._id);
                $scope.$apply();
            },
            dayClick: function(date, allDay, jsEvent, view) {
                $scope.$apply(function () {
                    if ($scope.programandoNuevaFecha) {
                        var startDate = date;
                        var endDate = new Date(date.valueOf() + 3600000); // más una hora
                        
                        var instancia = {
                            usuarioCreo: $scope.username,
                            usuario : $scope.programandoNuevaFecha.usuario,
                            agenda: $scope.programandoNuevaFecha._id,
                            fecha: startDate.format('dd/mm/yyyy'),
                            desdeHora: startDate.format('H:MM'),
                            hastaHora: endDate.format('H:MM'),
                            desdeDate: startDate.valueOf(),
                            hastaDate: endDate.valueOf()
                        };
                        
                        $scope.estado.trabajando++;
                        $http.post('/api/agendas.instancias', instancia).success(function (nuevaInstancia) {
                            nuevaInstancia = new AgendaInstancia(nuevaInstancia);
                            
                            $scope.reprogramados[nuevaInstancia._id] = nuevaInstancia;
                            $scope.instancias.push(nuevaInstancia);
                            $scope.instanciasPorId[nuevaInstancia._id] = nuevaInstancia;
                            
                            $scope.events.push(eventFromInstancia(instancia));
                            
                            $scope.calendar.refreshEvents();
                            $scope.estado.trabajando--;
                            
                            delete $scope.programandoNuevaFecha;
                        }).error(function(){
                            $scope.estado.trabajando--;
                        });
                    }
                });
                
                console.log('dayClick', date, allDay, jsEvent, view);
            },
            eventMouseover: function(event) {
                $scope.resaltar = event.agenda;
                $scope.agendaResaltada = $scope.agendasPorId[$scope.resaltar];
                $scope.instanciaResaltada = $scope.instanciasPorId[event._id];
                $scope.$apply();
            },
            eventMouseout: function(event) {
                $scope.agendaResaltada = $scope.instanciaResaltada = $scope.resaltar = null;
                $scope.$apply();
            },
            eventResize: function(event) {
                actualizarConEvento(event);
                $scope.$apply();
            },
            eventDrop: function(event) {
                actualizarConEvento(event);
                $scope.$apply();
            }
        }
    };

    $scope.$watch('instancia.agenda', function(i) {
        if (i) {
            $scope.agenda = $scope.agendasPorId[i];
        } else {
            $scope.agenda = null;
        }
    });

    $scope.$watch('instancia.desdeDate', function(d) {
        $scope.fechaDesde = new Date(d);
    });

    $scope.$watch('instanciaSeleccionada', function(i) {
        if (i) {
            $scope.instancia = $scope.instanciasPorId[i];
            if ($scope.instancia) {
                $scope.agenda = $scope.agendasPorId[$scope.instancia.agenda];
            }
        } else {
            $scope.instancia = null;
            $scope.agenda = null;
        }
        $scope.events.forEach(function(e) {
            e.color = $scope.agendaPorId(e.agenda).color;
            e.css = {
                opacity: (e._id != $scope.instanciaSeleccionada && '0.5') || '1.0'
            };

        });
        $scope.calendar.refreshEvents && $scope.calendar.refreshEvents();
        if (i) {
            $location.search('instancia', i);
        }
    });
    
    $scope.$watch('estado.trabajando', function (t) {
        $rootScope.$broadcast('trabajando', t);
    }, true);
}).controller('AgendasCtrl', function($rootScope, $location, $scope, $modal, $http, Agenda, User) {
    var self = this;
    
    self.programarNuevaFecha = function (r) {
        $scope.$emit('programar-nueva-fecha', r);
    };
    
    $scope.mostrar = function (r) {
        if (!$scope.filtro.agenda && !$scope.filtro.tipo) {
            return true; 
        } else if ($scope.filtro.agenda && !$scope.filtro.tipo) {
            return $scope.filtro.agenda == r._id;
        } else if (!$scope.filtro.agenda && $scope.filtro.tipo) {
            return $scope.filtro.tipo == r.tipo;
        } else if ($scope.filtro.agenda && $scope.filtro.tipo) {
            return (($scope.filtro.tipo == r.tipo) && ($scope.filtro.agenda == r._id));
        }
    };
    
    $scope.aMilisegundos = function(fecha, hora, minutos) {
        var fechaDividida = fecha.split("/");
        var date = new Date(fechaDividida[2], fechaDividida[1] - 1, fechaDividida[0], hora, minutos, 0, 0);
        return date.getTime();
    };
    
    $scope.programaReunionPeriodica = function(confirmado) {
        if (confirmado) {
            if ($scope.reunionPeriodica.fecha1 && $scope.reunionPeriodica.fecha2 && $scope.reunionPeriodica.hora && $scope.reunionPeriodica.minutos && $scope.reunionPeriodica.idAgenda && ($scope.reunionPeriodica.lunes || $scope.reunionPeriodica.martes || $scope.reunionPeriodica.miercoles || $scope.reunionPeriodica.jueves || $scope.reunionPeriodica.viernes)) {
                $scope.reunionPeriodica.fecha1 = $scope.aMilisegundos($scope.reunionPeriodica.fecha1, $scope.reunionPeriodica.hora, $scope.reunionPeriodica.minutos);
                $scope.reunionPeriodica.fecha2 = $scope.aMilisegundos($scope.reunionPeriodica.fecha2, 23, 59);
                var diaSemana = [];
                if ($scope.reunionPeriodica.lunes) {
                    diaSemana.push(1);
                }
                if ($scope.reunionPeriodica.martes) {
                    diaSemana.push(2);
                }
                if ($scope.reunionPeriodica.miercoles) {
                    diaSemana.push(3);
                }
                if ($scope.reunionPeriodica.jueves) {
                    diaSemana.push(4);
                }
                if ($scope.reunionPeriodica.viernes) {
                    diaSemana.push(5);
                }
                for (var i = $scope.reunionPeriodica.fecha1; i < $scope.reunionPeriodica.fecha2; (i = i+86400000)) {
                    var fecha = new Date(i);
                    if (diaSemana.indexOf(fecha.getDay()) != -1)
                    {
                        var fechaBien;
                        if (fecha.getDate() < 10) {
                            fechaBien = "0" + fecha.getDate();
                        } else {
                            fechaBien = fecha.getDate();
                        }
                        if ((fecha.getMonth()+1) < 10) {
                            fechaBien = fechaBien + "/0" + (fecha.getMonth()+1) + "/" + fecha.getFullYear();
                        } else {
                            fechaBien = fechaBien + "/" + (fecha.getMonth()+1) + "/" + fecha.getFullYear();
                        }
                        var instancia = {
                            agenda : $scope.reunionPeriodica.idAgenda,
                            titulo : $scope.reunionPeriodica.titulo,
                            desdeDate : i,
                            hastaDate : (i+3600000),
                            desdeHora : $scope.reunionPeriodica.hora + ":" + $scope.reunionPeriodica.minutos,
                            hastaHora : (parseInt($scope.reunionPeriodica.hora) +1) + ":" + $scope.reunionPeriodica.minutos,
                            fecha : fechaBien,
                        };
                        $http.post('/api/agendas.instancias', instancia).success();
                    }
                } 
                $scope.$emit('recargar-agendas');
            } else {
                alert("Faltan datos para poder programar la reunion periódica");
            }
        }
        else {
            $scope.reunionPeriodica = {
                idAgenda : '',
                titulo : '',
                lunes : false,
                martes : false,
                miercoles : false,
                jueves : false,
                viernes : false,
                fecha1 : '',
                fecha2 : '',
                hora : '',
                minutos : '',
            };
            $modal({template: '/views/agenda/calendario/cards/reunionesPeriodicas.html', persist: true, show: true, scope: $scope.$new()});
        }
    };
    
    $scope.users = User.query();
    
    $scope.eliminarListaElem = function(elemento, lista) {
        lista.splice(lista.indexOf(elemento), 1);
    };
	
	$scope.agregarUsuario = function(nuevoUsuario, array) {
        array.push(nuevoUsuario);
	};
	
	$scope.showUsers = function(confirmado, idAgenda) {
        if (confirmado) {
            $scope.agendaDetalle.$save({}, function() {
                $scope.$emit('recargar-agendas');
            });
        }
        else {
            $scope.agendaDetalle = Agenda.get({_id : idAgenda}, function() {
                if (!Array.isArray($scope.agendaDetalle.usuario)) {
                    var usu = $scope.agendaDetalle.usuario;
                    $scope.agendaDetalle.usuario = [];
                    $scope.agendaDetalle.usuario.push(usu);
                }
                $modal({template: '/views/agenda/calendario/cards/modalUsuarios.html', persist: true, show: true, backdrop: 'static', scope: $scope});
            });
        }
    };
	
	$scope.nuevaAgenda = function(confirmado) {
        if (confirmado) {
            $scope.agendaNueva.$save({}, function() {
                $scope.$emit('recargar-agendas');
            });
        }
        else {
            $scope.agendaNueva = new Agenda ({
                nombre : '',
                usuario : [$scope.username],
                color: "#000000"
            });
            $modal({template: '/views/agenda/calendario/cards/modalNueva.html', persist: true, show: true, backdrop: 'static', scope: $scope});
        }
    };
    
    
    $scope.estaResaltado = function (t) {
        return t && $scope.resaltar == t._id;
    };
    $scope.ver = function(t) {
        $location.url('/orm/reuniones/' + t._id);
    };
}).controller('InstanciaAgendaCtrl', function($scope, AgendaInstancia, $location, User, $modal) {
    $scope.guardarCambios = function() {
        angular.extend(new AgendaInstancia($scope.instancia), {
            suspendida: $scope.live.suspendida,
            comentarios: $scope.live.comentarios
        }).$save(function() {
            $scope.applyChanges();
        });
    };
    
    $scope.guardar = function() {
        $scope.instancia.$save();
        $scope.editando = false;
    };
    
    $scope.eliminar = function(confirmado) {
        if (confirmado) {
            $scope.instancia.$delete(function() {
                $location.url('/agenda/');
            });
        }
        else {
            $("#confirmarEliminar").modal('show');
        }
    };
    
    $scope.users = User.query();
    
    $scope.eliminarListaElem = function(elemento, lista) {
        lista.splice(lista.indexOf(elemento), 1);
    };
	
	$scope.agregarUsuario = function(nuevoUsuario) {
        $scope.instancia.usuario.push(nuevoUsuario);
	};
	
	$scope.showUsers = function(confirmado, idAgenda) {
        if (confirmado) {
            $scope.instancia.$save();
        }
        else {
            if (!Array.isArray($scope.instancia.usuario)) {
                var usu = $scope.instancia.usuario;
                $scope.instancia.usuario = [];
                $scope.instancia.usuario.push(usu);
            }
            $modal({template: '/views/agenda/calendario/cards/modalUsuariosInstancia.html', persist: true, show: true, backdrop: 'static', scope: $scope});
        }
    };
    
}).controller("AgendasPrint", function ($scope, $rootScope, $routeParams, $window, AgendaInstancia, Agenda) {
    $scope.instancia = AgendaInstancia.get({_id: $routeParams._id}, function(){
        $scope.agenda = Agenda.get({_id: $scope.instancia.agenda});
    });
    
    $scope.imprimir = function () {
        $window.print(); 
    };
    
    var f = new Date();
    $scope.hora = (f.getDate() + "/" + (f.getMonth() +1) + "/" + f.getFullYear() + ' a las ' + f.getHours() + ':' + f.getMinutes());
}).controller("AgendaAsistenciaEditableCtrl", function ($scope, $rootScope, $routeParams, $window, AgendaInstancia, Agenda, Contactos, ORMOrganigrama) {
    $scope.contactos = Contactos.listar();
    $scope.jurisdicciones = ORMOrganigrama.query();
    $scope.hoy = new Date().getTime();
    
    $scope.contactoPorId = function (id) {
      for (var i = 0; i < $scope.contactos.length; i++) {
          if ($scope.contactos[i]._id == id)
          {
              return $scope.contactos[i];
          }
      }  
    };
    
    $scope.jurisdiccionPorId = function (id) {
      for (var i = 0; i < $scope.jurisdicciones.length; i++) {
          if ($scope.jurisdicciones[i]._id == id)
          {
              return $scope.jurisdicciones[i];
          }
      }  
    };
    $scope.instancia = AgendaInstancia.get({_id: $routeParams._id}, function(){
        $scope.agenda = Agenda.get({_id: $scope.instancia.agenda}, function(){
            if (!$scope.instancia.participantes) {
                $scope.instancia.participantes = [];
            }
        });
    });
    
    $scope.imprimir = function () {
        $window.print(); 
    };
    
    $scope.eliminarParticipante = function (p) {
      $scope.instancia.participantes.splice($scope.instancia.participantes.indexOf(p), 1);
    };
    
    
    $scope.$watch('instancia.participantes', function (participantes) {
        $scope.vistaAsistencia = [];
        if (participantes) {
            angular.forEach(participantes, function (p){
                $scope.vistaAsistencia.push({
                    p: p,
                    c: Contactos.buscarPorId(p.contactoId)
                });
            });
        }
    }, true);
    
    $scope.edit = function() {
        $scope.editando = true;
    };
    
    $scope.save = function() {
        angular.forEach($scope.instancia.participantes, function (p) {
            if (!p.asistio) {
                p.asistio = "No";
            }
        });
        $scope.instancia.$save(function() {
            $scope.editando = false;
        });
    };
        
    $scope.buscarCorreo = function(nombre, contacto) {
        if (contacto) {
            if (!contacto.correos) {
                return "";
            }
            else {
                for (var i = 0; i < contacto.correos.length; i++) {
                    var em = contacto.correos[i];
    
                    if (em.nombre == nombre) {
                        return em.valor;
                    }
                }
            }
        }
        return "";
    };
    
    $scope.puedeAgregar = function (contactoId) {
        if (!$scope.instancia.participantes) {
            angular.extend($scope.instancia, {
                participantes: []
            })
        }
        // de esta forma, podemos recibir el id directamente
        // o un objeto con _id
        // como se usa en el filtro del select2 y este pasa
        // el objeto contacto, usamos así la misma función
        if (contactoId !== undefined && contactoId._id) {
            contactoId = contactoId._id;
        }
        if (!contactoId) {
            return false;
        }

        var found = false;

        for (var i = 0; i < $scope.instancia.participantes.length; i++) {
            if ($scope.instancia.participantes[i].contactoId == contactoId) {
                found = true;
                break;
            }
        }

        return !found;
    };

    $scope.agregarParticipante = function (c) {
        if ($scope.puedeAgregar(c)) {
            $scope.instancia.participantes.push({
                contactoId: c
            });

            // @diego: ponemos el combo en nada
            $scope.buscador = "";
        }
    };
}).controller("AgendaAsistenciaCtrl", function ($scope, $rootScope, $routeParams, $window, AgendaInstancia, Agenda, Contactos, ORMOrganigrama) {
    $scope.instancia = AgendaInstancia.get({_id: $routeParams._id}, function(){
        $scope.agenda = Agenda.get({_id: $scope.instancia.agenda}, function(){
            if ($scope.agenda.nombre.length < 41) {
              $scope.set_size = {'font-size': '25px'};
            }
            else {
              $scope.set_size = {'font-size': '20px'};
            }
        });
    });
    
    $scope.imprimir = function () {
        $window.print(); 
    };
    
    $scope.getNumber = function(num) {
        return new Array(num);   
    };
    
    
    $scope.contactos = Contactos.listar();
    $scope.jurisdicciones = ORMOrganigrama.query();
    
    $scope.contactoPorId = function (id) {
      for (var i = 0; i < $scope.contactos.length; i++) {
          if ($scope.contactos[i]._id == id)
          {
              return $scope.contactos[i];
          }
      }  
    };
    
    $scope.jurisdiccionPorId = function (id) {
      for (var i = 0; i < $scope.jurisdicciones.length; i++) {
          if ($scope.jurisdicciones[i]._id == id)
          {
              return $scope.jurisdicciones[i];
          }
      }  
    };
    
    var self = this;
    
    $scope.$watch('instancia.participantes', function (participantes){
        self.vistaParticipantes = [];
        if (participantes) {
            $scope.myNumber = participantes.length;
            angular.forEach(participantes, function (p){
                self.vistaParticipantes.push({
                    p: p,
                    c: Contactos.buscarPorId(p.contactoId)
                });
            });
        }
    }, true);
    
    
    $scope.buscarCorreo = function(nombre, contacto) {
        if (!contacto.correos) {
            return "";
        }
        else {
            for (var i = 0; i < contacto.correos.length; i++) {
                var em = contacto.correos[i];

                if (em.nombre == nombre) {
                    return em.valor;
                }
            }
        }

        return "";
    };
}).controller("envioParticipantes", function ($scope, $routeParams, AgendaInstancia, Agenda, AgendaMinuta,AgendaTemario,$http,$location,Contactos) {
    
    $scope.contactoPorId = function (id) {
      for (var i = 0; i < $scope.contactos.length; i++) {
          if ($scope.contactos[i]._id == id)
          {
              return $scope.contactos[i];
          }
      }  
    };
    $scope.buscarCorreo = function(nombre, contacto) {
        if (contacto) {
            if (!contacto.correos) {
                return "";
            }
            else {
                for (var i = 0; i < contacto.correos.length; i++) {
                    var em = contacto.correos[i];
    
                    if (em.nombre == nombre) {
                        return em.valor;
                    }
                }
            }
        }
        return "";
    };
    $scope.contactos = Contactos.listar(function()
    {
        $scope.instancia=AgendaInstancia.get({'_id':$routeParams._id},function()
        {
            $scope.agenda = Agenda.get({'_id': $scope.instancia.agenda});
            if (!Array.isArray($scope.instancia.usuario)) {
                $scope.para=$scope.instancia.usuario+"@buenosaires.gob.ar";
            } else {
                for(var i=0;i<$scope.instancia.usuario.length;i++)
                {
                    if(i==0)
                    {
                        $scope.para=$scope.instancia.usuario[i]+"@buenosaires.gob.ar";
                    }
                    else
                    {
                        $scope.para=$scope.para+", "+$scope.instancia.usuario[i]+"@buenosaires.gob.ar";
                    }
                }
            }
            
            if($scope.instancia.participantes)
            {
                for(var x=0; x<$scope.instancia.participantes.length;x++)
                {
                    $scope.para+=", "+$scope.buscarCorreo('Email oficial', $scope.contactoPorId($scope.instancia.participantes[x].contactoId));
                }
            }
            
            $scope.temario="<font size='3'>Estimad@s,<br><br>"+
            "Les informamos que la reunión de referencia se realizará el <b>"+$scope.instancia.fecha+" a las: "+$scope.instancia.desdeHora+"hs </b><br>"+
            "Quedamos a su disposición ante cualquier consulta.<br><br>"+
            "Saludos cordiales, <br>"+
            "</font>";
        });    
    });

    $scope.minuta = AgendaMinuta.query({'instancia': $routeParams._id},function()
    {
        $scope.minuta=$scope.minuta[0];
    });
    $scope.temarios=AgendaTemario.query({'instancia':$routeParams._id},function()
    {
        $scope.temarios=$scope.temarios[0];
    });
    
    $scope.enviarMail=function()
    {
        var emisor;
        if($scope.agenda.desde)
        {
            emisor=$scope.agenda.desde;
        }
        else
        {
            emisor="<agenda.minuta@buenosaires.gob.ar>";
        }
        
        var adjunto="";
        var eleccion = confirm("¿Desea enviar el correo?");
        if (eleccion == true) 
        {
            var payload = {
                asunto: "Cita para Reunion de Seguimiento - "+$scope.agenda.nombre,
                para: $scope.para,          
                mensajeHtml: "<div class='mailwrapper'>"+$scope.temario+"<br><br>- "+$scope.username+"</div>",      
                from : emisor,
                adjunto: adjunto
            };
            $http.post('/api/agenda/temario-enviar-mail', payload).success(function() {
                //$scope.temarios.tipoUltimoEnvio=$scope.temarios.tipoEnvio;
                //$scope.temarios.$save({});
                $scope.instancia.tipoEnvio=$scope.tipoEnvio;
                $scope.instancia.$save({});
            }).error(function() {
                alert("Fallo el envio");
            });
            $location.url('/agenda');
        } 
    };
    

    //CARD IZQUIERDA
    $scope.tipoEnvio;
    $scope.asunto="";

    $scope.cambiarAModificacion=function()
    {
        $scope.asunto="Modificación";  
        $scope.temario="<font size='3'>Estimad@s,<br><br>"+
            "Les informamos que la reunión de referencia tuvo modificaciones, ahora se realizará el <b>"+$scope.instancia.fecha+" a las: "+$scope.instancia.desdeHora+"hs </b><br>"+
            "Quedamos a su disposición ante cualquier consulta.<br><br>"+
            "Saludos cordiales, <br>"+
            "</font>";
        $scope.tipoEnvio=1;
    };
    $scope.cambiarARecordatorio=function()
    {
      $scope.asunto="Recordatorio";  
      $scope.temario="<font size='3'>Estimad@s,<br><br>"+
            "Les recordamos que la reunión de referencia se realizará el <b>"+$scope.instancia.fecha+" a las: "+$scope.instancia.desdeHora+"hs </b><br>"+
            "Quedamos a su disposición ante cualquier consulta.<br><br>"+
            "Saludos cordiales, <br>"+
            "</font>";
        $scope.tipoEnvio=2;
    };
    $scope.cambiarACancelar=function()
    {
        $scope.asunto="Cancelación";
        $scope.temario="<font size='3'>Estimad@s,<br><br>"+
            "Les recordamos que la reunión de referencia que se realizaría el <b>"+$scope.instancia.fecha+" a las: "+$scope.instancia.desdeHora+"hs, fue <u>cancelada</u> hasta nuevo aviso</b>. Nos pondremos en contacto cuando reagendemos la misma.<br>"+
            "Ante cualquier consulta pueden comunicarse telefónicamente o vía mail con nuestras oficinas.<br><br>"+
            "Saludos cordiales, <br>"+
            "</font>";
        $scope.tipoEnvio=4;
    };
    $scope.cambiarACita=function()
    {
        $scope.asunto="";
        $scope.temario="<font size='3'>Estimad@s,<br><br>"+
            "Les informamos que la reunión de referencia se realizará el <b>"+$scope.instancia.fecha+" a las: "+$scope.instancia.desdeHora+"hs </b><br>"+
            "Quedamos a su disposición ante cualquier consulta.<br><br>"+
            "Saludos cordiales, <br>"+
            "</font>";
        $scope.tipoEnvio=3;
    };
});