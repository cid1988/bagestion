angular.module('bag2.salasreuniones.calendario', [])
    .controller('SalasReunionesCtrl',
    function($scope, SRColoresPorSala, $state, $stateProvider, Contactos, ORMContacto, SalasReuniones, SalasReunionesInstancia, $timeout, SRRolesPorKey, SRTiposAsistenciaPorKey, $location, $rootScope, $http) {
    $scope.filtro = {};
    var hoy = new Date().getTime();
    var haceMesYMedio = hoy - 3945250000;
    
    $scope.$on('programar-nueva-fecha', function (event, r) {
        // $scope.$broadcast('programar-nueva-fecha', r);
        $scope.programandoNuevaFecha = r;
    });
    
    $scope.orderByStar = function(c1, c2) {
        return (((c1 && c1.star) || 0) && 1) - (((c2 && c2.star) || 0) && 1);
    };
    
    $scope.volver = function() {
        $scope.instancia = false;
    };
    
    $scope.ver = function(t) {
        $scope.salaSeleccionada = t;
        $("#detalleSala").modal('show');
    };
    
    $scope.$on('volver', function(event, accept) {
        // TODO: sacar MEBRolesPorKey
        $scope.rolesPorKey = SRRolesPorKey();

        // TODO: sacar MEBTiposAsistenciaPorKey
        $scope.tiposAsistenciaPorKey = SRTiposAsistenciaPorKey();

        $scope.estado.trabajando++;
    
        var salas = $scope.salas = SalasReuniones.list(function() {
            $scope.estado.trabajando--;
            salas.forEach(function(r) {
                salasPorId[r._id] = r;
            });

            var instancias = $scope.instancias = SalasReunionesInstancia.list(function() {
                instancias.forEach(function(i) {
                    // la guardamos en el diccionario
                    instanciasPorId[i._id] = i;
                });

                $scope.$watch('events', function() {
                    refrescar();
                }, true);

                $scope.$watch('filtro.tipo', function() {
                    refrescar();
                }, true);
            });
        });
        $scope.instancia = false;
        $location.url('/salasreuniones');
    });
    
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

    // diccionarios para acceder a los datos de las salas y las instancias por id
    var salasPorId = $scope.salasPorId = {};
    var instanciasPorId = $scope.instanciasPorId = {};

    $scope.colorSala = function (r){
        return (r.color || 'grey');
    };
    
    $scope.colorTipo = function (tipo){
        var color = "grey";
        $scope.salas.forEach(function(r) {
            if (tipo == r.tipo) {
                color = r.color;
            }
        });
        return color;
    };
    
    var formatTipoSalaCombo = function (object, container, query) {
            if (object.id != '') {
                var html = '<div style="width: 10px;height:10px;margin-right:4px;display:inline-block; background-color: '+ ($scope.colorTipo(object.id) || 'grey') +'"></div>' + object.text;
                console.log(html);
                return html;
            } else {
                return object.text;
            }
        };
    $scope.tipoSalaSelect2 = {
        formatResult: formatTipoSalaCombo,
        // formatSelection: formatTipoSalaCombo
    };
    
    var eventFromInstancia = function (i){
        return {
            title: i.titulo || '',
            start: new Date(i.desdeDate),
            end: new Date(i.hastaDate),
            editable: $scope.editando || false,
            allDay: false,
            color: salasPorId[i.sala].color || 'grey',
            html: '<i ng-repeat="p in salasPorId[instancia.sala].participantes" ngclass="{\'icon-star\': p.star, \'icon-star-empty\': !p.star}"></i> <span></span>',
            css: {
                opacity: (i._id != $scope.instanciaSeleccionada && '0.5') || '1.0'
            },
                // si agregamos estos campos al objeto event los mantiene
                // cuando lo pasa de parámetro en algún evento de UI (click, etc)
                sala: i.sala,
                _id: i._id
            };
    };

    var refrescar = function() {
        // borramos todos los eventos que había para el calendario
        $scope.events.splice(0, $scope.events.length);

        if ($scope.instancias) {
            $scope.instancias.forEach(function(i) {
                if ((!$scope.filtro || !$scope.filtro.tipo) ||
                 $scope.salasPorId[i.sala].tipo == $scope.filtro.tipo) {

                // TODO: @eazel7: estaría bueno que esto lo haga el servidor
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
    
        var salas = $scope.salas = SalasReuniones.list(function() {
            $scope.estado.trabajando--;
            salas.forEach(function(r) {
                salasPorId[r._id] = r;
            });
            var instancias = $scope.instancias = SalasReunionesInstancia.query({
                $and:JSON.stringify([
                    {desdeDate:{$gte: haceMesYMedio}},
                ])}, function() {
                instancias.forEach(function(i) {
                    // la guardamos en el diccionario
                    instanciasPorId[i._id] = i;
                });

                if ($scope.instanciaSeleccionada) {
                    $scope.instancia = instanciasPorId[$scope.instanciaSeleccionada];
                    $scope.sala = salasPorId[$scope.instancia.sala];
                }

                $scope.$watch('events', function() {
                    refrescar();
                }, true);

                $scope.$watch('filtro.tipo', function() {
                    refrescar();
                }, true);
            });
        });
    };

    traerDatos();
    $scope.$on('recargar-salas', traerDatos);

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
            var instancia = SalasReunionesInstancia.findById({
                _id: _id
            }, function() {
                var f = new Date();
                var min = "00";
                if (f.getMinutes() < 10) {
                    min = "0" + f.getMinutes();
                } else {
                    min = f.getMinutes();
                }
                instancia.usuario = $scope.username;
                var reprogramada = $scope.reprogramados[_id];
                instancia.fecha = reprogramada.fecha;
                instancia.desdeHora = reprogramada.desdeHora;
                instancia.hastaHora = reprogramada.hastaHora;
                instancia.desdeDate = reprogramada.desdeDate;
                instancia.hastaDate = reprogramada.hastaDate;
                instancia.creada = (f.getDate() + "/" + (f.getMonth() +1) + "/" + f.getFullYear() + ' a las ' + f.getHours() + ':' + min);
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
        var f = new Date();
        var min = "00";
        if (f.getMinutes() < 10) {
            min = "0" + f.getMinutes();
        } else {
            min = f.getMinutes();
        }
        
        var instancia = instanciasPorId[event._id];
        $scope.reprogramados[event._id] = instancia;
        instancia.usuario = $scope.username;
        instancia.fecha = event.start.format('dd/mm/yyyy');
        instancia.desdeHora = event.start.format('H:MM');
        instancia.hastaHora = event.end.format('H:MM');
        instancia.desdeDate = event.start.valueOf();
        instancia.hastaDate = event.end.valueOf();
        instancia.creada = (f.getDate() + "/" + (f.getMonth() +1) + "/" + f.getFullYear() + ' a las ' + f.getHours() + ':' + min);
    };

    $scope.calendar = {
        events: $scope.events,
        viewConfig: {
            height: 510,
            editable: true,
            allDaySlot: false,
            defaultView: 'agendaWeek',
            header: {
                left: 'prev next agendaDay agendaWeek month',
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
                        var endDate = new Date(date.valueOf() + 1800000); // más una hora
                        var f = new Date();
                        var min = "00";
                        if (f.getMinutes() < 10) {
                            min = "0" + f.getMinutes();
                        } else {
                            min = f.getMinutes();
                        }
                        
                        var instancia = {
                            usuario: $scope.username,
                            sala: $scope.programandoNuevaFecha._id,
                            fecha: startDate.format('dd/mm/yyyy'),
                            desdeHora: startDate.format('H:MM'),
                            hastaHora: endDate.format('H:MM'),
                            desdeDate: startDate.valueOf(),
                            hastaDate: endDate.valueOf(),
                            creada : (f.getDate() + "/" + (f.getMonth() +1) + "/" + f.getFullYear() + ' a las ' + f.getHours() + ':' + min)
                        };
                        
                        $scope.estado.trabajando++;
                        $http.post('/api/salasreuniones.instancias', instancia).success(function (nuevaInstancia) {
                            nuevaInstancia = new SalasReunionesInstancia(nuevaInstancia);
                            
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
                $scope.resaltar = event.sala;
                $scope.salaResaltada = $scope.salasPorId[$scope.resaltar];
                $scope.instanciaResaltada = $scope.instanciasPorId[event._id];
                $scope.$apply();
            },
            eventMouseout: function(event) {
                $scope.salaResaltada = $scope.instanciaResaltada = $scope.resaltar = null;
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

    $scope.$watch('instancia.sala', function(i) {
        if (i) {
            $scope.sala = $scope.salasPorId[i];
        } else {
            $scope.sala = null;
        }
    });

    $scope.$watch('instancia.desdeDate', function(d) {
        $scope.fechaDesde = new Date(d);
    });

    $scope.$watch('instanciaSeleccionada', function(i) {
        if (i) {
            $scope.instancia = $scope.instanciasPorId[i];
            if ($scope.instancia) {
                $scope.sala = $scope.salasPorId[$scope.instancia.sala];
            }
        } else {
            $scope.instancia = null;
            $scope.sala = null;
        }
        $scope.events.forEach(function(e) {
            e.color = salasPorId[e.sala].color;
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
})
.controller('SalasReunionesConsultaCtrl',
    function($scope, SRColoresPorSala, $state, $stateProvider, Contactos, ORMContacto, SalasReuniones, SalasReunionesInstancia, $timeout, SRRolesPorKey, SRTiposAsistenciaPorKey, $location, $rootScope, $http) {
    $scope.filtro = {};
    var hoy = new Date().getTime();
    var haceMesYMedio = hoy - 3945250000;
    
    $scope.orderByStar = function(c1, c2) {
        return (((c1 && c1.star) || 0) && 1) - (((c2 && c2.star) || 0) && 1);
    };

    //vamos a esperar a que la directiva fullcalendar agregue la función goToDate y 
    // la llamamos para asegurarnos que en el calendario
    $scope.$watch('instancia.desdeDate', function(d) {
        if ($scope.calendar && $scope.calendar.goToDate && d) {
            $scope.calendar.goToDate(new Date(d));
        }
    });
    
    $scope.ver = function(t) {
        $scope.salaSeleccionada = t;
        $("#detalleSala").modal('show');
    };

    // En este array vamos a guardar los objetos event de fullCalendar
    // http://arshaw.com/fullcalendar/docs/event_data/Event_Object/
    $scope.events = [];

    // diccionarios para acceder a los datos de las salas y las instancias por id
    var salasPorId = $scope.salasPorId = {};
    var instanciasPorId = $scope.instanciasPorId = {};

    $scope.colorSala = function (r){
        return (r.color || 'grey');
    };
    
    $scope.colorTipo = function (tipo){
        var color = "grey";
        $scope.salas.forEach(function(r) {
            if (tipo == r.tipo) {
                color = r.color;
            }
        });
        return color;
    };
    
    var formatTipoSalaCombo = function (object, container, query) {
            if (object.id != '') {
                var html = '<div style="width: 10px;height:10px;margin-right:4px;display:inline-block; background-color: '+ ($scope.colorTipo(object.id) || 'grey') +'"></div>' + object.text;
                console.log(html);
                return html;
            } else {
                return object.text;
            }
        };
    $scope.tipoSalaSelect2 = {
        formatResult: formatTipoSalaCombo,
        // formatSelection: formatTipoSalaCombo
    };
    
    var eventFromInstancia = function (i){
        return {
            title: i.titulo || '',
            start: new Date(i.desdeDate),
            end: new Date(i.hastaDate),
            editable: $scope.editando || false,
            allDay: false,
            color: salasPorId[i.sala].color || 'grey',
            html: '<i ng-repeat="p in salasPorId[instancia.sala].participantes" ngclass="{\'icon-star\': p.star, \'icon-star-empty\': !p.star}"></i> <span></span>',
            css: {
                opacity: (i._id != $scope.instanciaSeleccionada && '0.5') || '1.0'
            },
                // si agregamos estos campos al objeto event los mantiene
                // cuando lo pasa de parámetro en algún evento de UI (click, etc)
                sala: i.sala,
                _id: i._id
            };
    };

    var refrescar = function() {
        // borramos todos los eventos que había para el calendario
        $scope.events.splice(0, $scope.events.length);

        if ($scope.instancias) {
            $scope.instancias.forEach(function(i) {
                if ((!$scope.filtro || !$scope.filtro.tipo) ||
                 $scope.salasPorId[i.sala].tipo == $scope.filtro.tipo) {

                // TODO: @eazel7: estaría bueno que esto lo haga el servidor
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
    
        var salas = $scope.salas = SalasReuniones.list(function() {
            salas.forEach(function(r) {
                salasPorId[r._id] = r;
            });

            var instancias = $scope.instancias = SalasReunionesInstancia.query({
                $and:JSON.stringify([
                    {desdeDate:{$gte: haceMesYMedio}},
                ]),
            }, function() {
                instancias.forEach(function(i) {
                    // la guardamos en el diccionario
                    instanciasPorId[i._id] = i;
                });

                if ($scope.instanciaSeleccionada) {
                    $scope.instancia = instanciasPorId[$scope.instanciaSeleccionada];
                    $scope.sala = salasPorId[$scope.instancia.sala];
                }

                $scope.$watch('events', function() {
                    refrescar();
                }, true);

                $scope.$watch('filtro.tipo', function() {
                    refrescar();
                }, true);
            });
        });
    };

    traerDatos();
    $scope.$on('recargar-salas', traerDatos);

    $scope.calendar = {
        events: $scope.events,
        viewConfig: {
            height: 510,
            editable: true,
            allDaySlot: false,
            defaultView: 'agendaWeek',
            header: {
                left: 'prev next agendaDay agendaWeek month',
                center: 'today',
                right: 'title'
            },
            eventClick: function(event) {
                console.log('eventClick');
                $scope.instanciaSeleccionada = event._id;
                $scope.$apply();
            },
            eventMouseover: function(event) {
                $scope.resaltar = event.sala;
                $scope.salaResaltada = $scope.salasPorId[$scope.resaltar];
                $scope.instanciaResaltada = $scope.instanciasPorId[event._id];
                $scope.$apply();
            },
            eventMouseout: function(event) {
                $scope.salaResaltada = $scope.instanciaResaltada = $scope.resaltar = null;
                $scope.$apply();
            },
        }
    };

    $scope.$watch('instancia.sala', function(i) {
        if (i) {
            $scope.sala = $scope.salasPorId[i];
        } else {
            $scope.sala = null;
        }
    });

    $scope.$watch('instancia.desdeDate', function(d) {
        $scope.fechaDesde = new Date(d);
    });

    $scope.$watch('instanciaSeleccionada', function(i) {
        if (i) {
            $scope.instancia = $scope.instanciasPorId[i];
            if ($scope.instancia) {
                $scope.sala = $scope.salasPorId[$scope.instancia.sala];
            }
        } else {
            $scope.instancia = null;
            $scope.sala = null;
        }
        $scope.events.forEach(function(e) {
            e.color = salasPorId[e.sala].color;
            e.css = {
                opacity: (e._id != $scope.instanciaSeleccionada && '0.5') || '1.0'
            };

        });
        $scope.calendar.refreshEvents && $scope.calendar.refreshEvents();
    });
    
    $scope.$watch('estado.trabajando', function (t) {
        $rootScope.$broadcast('trabajando', t);
    }, true);
})
.controller('SalasReunionesCateringCtrl',
    function($scope, SRColoresPorSala, $state, $stateProvider, Contactos, ORMContacto, SalasReuniones, SalasReunionesInstancia, $timeout, SRRolesPorKey, SRTiposAsistenciaPorKey, $location, $rootScope, $http) {
    $scope.filtro = {};
    
    $scope.orderByStar = function(c1, c2) {
        return (((c1 && c1.star) || 0) && 1) - (((c2 && c2.star) || 0) && 1);
    };

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

    // diccionarios para acceder a los datos de las salas y las instancias por id
    var salasPorId = $scope.salasPorId = {};
    var instanciasPorId = $scope.instanciasPorId = {};

    $scope.colorSala = function (r){
        return (r.color || 'grey');
    };
    
    $scope.colorTipo = function (tipo){
        var color = "grey";
        $scope.salas.forEach(function(r) {
            if (tipo == r.tipo) {
                color = r.color;
            }
        });
        return color;
    };
    
    var formatTipoSalaCombo = function (object, container, query) {
            if (object.id != '') {
                var html = '<div style="width: 10px;height:10px;margin-right:4px;display:inline-block; background-color: '+ ($scope.colorTipo(object.id) || 'grey') +'"></div>' + object.text;
                console.log(html);
                return html;
            } else {
                return object.text;
            }
        };
    $scope.tipoSalaSelect2 = {
        formatResult: formatTipoSalaCombo,
        // formatSelection: formatTipoSalaCombo
    };
    
    var eventFromInstancia = function (i){
        return {
            title: i.titulo || '',
            start: new Date(i.desdeDate),
            end: new Date(i.hastaDate),
            editable: $scope.editando || false,
            allDay: false,
            color: salasPorId[i.sala].color || 'grey',
            html: '<i ng-repeat="p in salasPorId[instancia.sala].participantes" ngclass="{\'icon-star\': p.star, \'icon-star-empty\': !p.star}"></i> <span></span>',
            css: {
                opacity: (i._id != $scope.instanciaSeleccionada && '0.5') || '1.0'
            },
                // si agregamos estos campos al objeto event los mantiene
                // cuando lo pasa de parámetro en algún evento de UI (click, etc)
                sala: i.sala,
                _id: i._id
            };
    };

    var refrescar = function() {
        // borramos todos los eventos que había para el calendario
        $scope.events.splice(0, $scope.events.length);

        if ($scope.instancias) {
            $scope.instancias.forEach(function(i) {
                if ((!$scope.filtro || !$scope.filtro.tipo) ||
                 $scope.salasPorId[i.sala].tipo == $scope.filtro.tipo) {

                // TODO: @eazel7: estaría bueno que esto lo haga el servidor
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
    
        var salas = $scope.salas = SalasReuniones.list(function() {
            salas.forEach(function(r) {
                salasPorId[r._id] = r;
            });

            var instancias = $scope.instancias = SalasReunionesInstancia.query({
                catering : true
            }, function() {
                instancias.forEach(function(i) {
                    // la guardamos en el diccionario
                    instanciasPorId[i._id] = i;
                });

                if ($scope.instanciaSeleccionada) {
                    $scope.instancia = instanciasPorId[$scope.instanciaSeleccionada];
                    $scope.sala = salasPorId[$scope.instancia.sala];
                }

                $scope.$watch('events', function() {
                    refrescar();
                }, true);

                $scope.$watch('filtro.tipo', function() {
                    refrescar();
                }, true);
            });
        });
    };

    traerDatos();
    $scope.$on('recargar-salas', traerDatos);

    $scope.calendar = {
        events: $scope.events,
        viewConfig: {
            height: 510,
            editable: true,
            allDaySlot: false,
            defaultView: 'agendaWeek',
            header: {
                left: 'prev next agendaDay agendaWeek month',
                center: 'today',
                right: 'title'
            },
            eventClick: function(event) {
                console.log('eventClick');
                $scope.instanciaSeleccionada = event._id;
                $location.search('instancia', event._id);
                $scope.$apply();
            },
            eventMouseover: function(event) {
                $scope.resaltar = event.sala;
                $scope.salaResaltada = $scope.salasPorId[$scope.resaltar];
                $scope.instanciaResaltada = $scope.instanciasPorId[event._id];
                $scope.$apply();
            },
            eventMouseout: function(event) {
                $scope.salaResaltada = $scope.instanciaResaltada = $scope.resaltar = null;
                $scope.$apply();
            },
        }
    };

    $scope.$watch('instancia.sala', function(i) {
        if (i) {
            $scope.sala = $scope.salasPorId[i];
        } else {
            $scope.sala = null;
        }
    });

    $scope.$watch('instancia.desdeDate', function(d) {
        $scope.fechaDesde = new Date(d);
    });

    $scope.$watch('instanciaSeleccionada', function(i) {
        if (i) {
            $scope.instancia = $scope.instanciasPorId[i];
            if ($scope.instancia) {
                $scope.sala = $scope.salasPorId[$scope.instancia.sala];
            }
        } else {
            $scope.instancia = null;
            $scope.sala = null;
        }
        $scope.events.forEach(function(e) {
            e.color = salasPorId[e.sala].color;
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
}).controller('TiposSalasCtrl', function($http, $rootScope, $location, $scope, $modal) {
    var self = this;
    
    self.programarNuevaFecha = function (r) {
        $scope.$emit('programar-nueva-fecha', r);
    };
    
    $scope.mostrar = function (r) {
        if (!$scope.filtro.tipo) {
            return true; 
        } else {
            return $scope.filtro.tipo == r.tipo;
        }
    };
    $scope.estaResaltado = function (t) {
        return t && $scope.resaltar == t._id;
    };
    
    $scope.aMilisegundos = function(fecha, hora, minutos) {
        var fechaDividida = fecha.split("/");
        var date = new Date(fechaDividida[2], fechaDividida[1] - 1, fechaDividida[0], hora, minutos, 0, 0);
        return date.getTime();
    };
    
    $scope.programaReservaPeriodica = function(confirmado) {
        if (confirmado) {
            if ($scope.reservaPeriodica.fecha1 && $scope.reservaPeriodica.fecha2 && $scope.reservaPeriodica.horaDesde && $scope.reservaPeriodica.minutosDesde && $scope.reservaPeriodica.horaHasta && $scope.reservaPeriodica.minutosHasta && $scope.reservaPeriodica.idSala && ($scope.reservaPeriodica.lunes || $scope.reservaPeriodica.martes || $scope.reservaPeriodica.miercoles || $scope.reservaPeriodica.jueves || $scope.reservaPeriodica.viernes)) {
                var duracion = ($scope.aMilisegundos($scope.reservaPeriodica.fecha1, $scope.reservaPeriodica.horaHasta, $scope.reservaPeriodica.minutosHasta) - $scope.aMilisegundos($scope.reservaPeriodica.fecha1, $scope.reservaPeriodica.horaDesde, $scope.reservaPeriodica.minutosDesde));
                $scope.reservaPeriodica.fecha1 = $scope.aMilisegundos($scope.reservaPeriodica.fecha1, $scope.reservaPeriodica.horaDesde, $scope.reservaPeriodica.minutosDesde);
                $scope.reservaPeriodica.fecha2 = $scope.aMilisegundos($scope.reservaPeriodica.fecha2, 23, 59);
                
                var diaSemana = [];
                if ($scope.reservaPeriodica.lunes) {
                    diaSemana.push(1);
                }
                if ($scope.reservaPeriodica.martes) {
                    diaSemana.push(2);
                }
                if ($scope.reservaPeriodica.miercoles) {
                    diaSemana.push(3);
                }
                if ($scope.reservaPeriodica.jueves) {
                    diaSemana.push(4);
                }
                if ($scope.reservaPeriodica.viernes) {
                    diaSemana.push(5);
                }
                for (var i = $scope.reservaPeriodica.fecha1; i < $scope.reservaPeriodica.fecha2; (i = i+86400000)) {
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
                            sala : $scope.reservaPeriodica.idSala,
                            titulo : $scope.reservaPeriodica.titulo,
                            desdeDate : i,
                            hastaDate : (i+duracion),
                            desdeHora : $scope.reservaPeriodica.horaDesde + ":" + $scope.reservaPeriodica.minutosDesde,
                            hastaHora : $scope.reservaPeriodica.horaHasta + ":" + $scope.reservaPeriodica.minutosHasta,
                            fecha : fechaBien,
                            usuario : $scope.username,
                            interno : $scope.reservaPeriodica.interno,
                            duenio : $scope.reservaPeriodica.duenio,
                        };
                        $http.post('/api/salasreuniones.instancias', instancia).success();
                    }
                } 
                $scope.$emit('recargar-salas');
            } else {
                alert("Faltan datos para poder programar la reserva periódica");
            }
        }
        else {
            $scope.reservaPeriodica = {
                idReunion : '',
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
            $modal({template: '/views/salasreuniones/calendario/cards/reunionesPeriodicas.html', persist: true, show: true, scope: $scope.$new()});
        }
    };
}).controller('SalasDisponiblesCtrl', function($rootScope, $location, $scope) {
    var self = this;
    $scope.salasLibres = $scope.salas;
    $scope.horas = ['5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20','21','22'];
    $scope.minutos = ['00','15','30','45'];
    
    $scope.aMilisegundos = function(fecha, hora, minutos) {
        var fechaDividida = fecha.split("/");
        var date = new Date(fechaDividida[2], fechaDividida[1] - 1, fechaDividida[0], hora, minutos, 0, 0);
        return date.getTime();
    };
    
    $scope.buscar = function () {
        if (!$scope.busqueda.cantidad) {
            $scope.busqueda.cantidad = "0";
        }
        if ($scope.busqueda.fecha && $scope.busqueda.horaDesde && $scope.busqueda.minutosDesde && $scope.busqueda.horaHasta && $scope.busqueda.minutosHasta) {
            var milisegundosDesde = $scope.aMilisegundos($scope.busqueda.fecha, $scope.busqueda.horaDesde, $scope.busqueda.minutosDesde);
            var milisegundosHasta = $scope.aMilisegundos($scope.busqueda.fecha, $scope.busqueda.horaHasta, $scope.busqueda.minutosHasta);
            var ocupadas = [];
            $scope.salasLibres = [];
            $scope.instancias.forEach(function(i) {
                if (((milisegundosDesde <= i.desdeDate) && (i.desdeDate < milisegundosHasta)) ||
                   ((milisegundosDesde < i.hastaDate) && (i.hastaDate <= milisegundosHasta))) {
                    if (ocupadas.indexOf(i.sala)==-1) {
                        ocupadas.push(i.sala);
                    }
                }
                if (((i.desdeDate <= milisegundosDesde) && (milisegundosHasta < i.desdeDate)) ||
                   ((i.hastaDate < milisegundosDesde) && (milisegundosHasta <= i.hastaDate))) {
                    if (ocupadas.indexOf(i.sala)==-1) {
                        ocupadas.push(i.sala);
                    }
                }
                if ((i.desdeDate < milisegundosDesde) && (milisegundosHasta < i.hastaDate)) {
                    if (ocupadas.indexOf(i.sala)==-1) {
                        ocupadas.push(i.sala);
                    }
                }
            });
            $scope.salas.forEach(function(r) {
                if (ocupadas.indexOf(r._id)==-1) {
                    if (parseInt(r.capacidad) >= parseInt($scope.busqueda.cantidad)) {
                        $scope.salasLibres.push(r);
                    }
                }
            });
        } else {
            alert("Faltan cargar datos de busqueda");
        }
    };
    $scope.estaResaltado = function (t) {
        return t && $scope.resaltar == t._id;
    };
}).controller('SRTabReservaCtrl', function($scope, SalasReunionesInstancia, Contactos, $location, $rootScope, $http) {
    
	$scope.contactos = Contactos.listar();

// EDITADO.........................................................................................................................................
    
    $scope.buscarCorreo = function(nombre, contacto) 
    {
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
    
    
    $scope.enviarMail = function()
    {
        //DECLARAR MENSAJE
        $scope.instancia.cuando=$scope.instancia.fecha+', '+$scope.instancia.desdeHora+' - '+$scope.instancia.hastaHora;
        
        $scope.tituloReunion="";
        if(!$scope.instancia.titulo)
        {
            $scope.instancia.titulo="";
        }
        else
        {
            $scope.tituloReunion=$scope.instancia.titulo;
        }
        
        
        var partici="";
        var i=0;
        $scope.apellidoDuenioReunion="";
        $scope.nombreDuenioReunion="";
        if(!$scope.instancia.duenio)
        {
               $scope.apellidoDuenioReunion="";
               $scope.nombreDuenioReunion="";
        }
        else
        {
            $scope.apellidoDuenioReunion=$scope.contactoPorId($scope.instancia.duenio).apellidos; 
            $scope.nombreDuenioReunion=$scope.contactoPorId($scope.instancia.duenio).nombre;
            $scope.duenioReserva=$scope.buscarCorreo('Email oficial',$scope.contactoPorId($scope.instancia.duenio));
            
            if(!$scope.instancia.participantes)
            {
                partici="";
            }
            else
            {
                for(i;i<$scope.instancia.participantes.length;i++)
                {
                    partici=partici+","+($scope.buscarCorreo('Email oficial',$scope.contactoPorId($scope.instancia.participantes[i].contactoId)));
                }
            }
        }
        
        $scope.internoReunion="";
        if(!$scope.instancia.interno)
        {
            $scope.internoReunion="";
        }
        else
        {
            $scope.internoReunion=$scope.instancia.interno;
        }
        
        $scope.asistentesReunion="";
        if(!$scope.instancia.asistentes)
        {
            $scope.asistentesReunion="";
        }
        else
        {
            $scope.asistentesReunion=$scope.instancia.asistentes;
        }
        
        var user=$scope.instancia.usuario;
        
//ENVIAR MAIL-.......-.-.-.--.--..-.....................................................................................
$scope.instancia.mensajeInicio="<table align='center' style='font-size:inherit;line-height:inherit;text-align:center;border-spacing:0;border-collapse:collapse;padding:0;border:0;' cellpadding='0' cellspacing='0'>"+
    "<tbody><tr><td style='font-family:Helvetica,Arial,sans-serif;height:16px;' height='16'></td></tr>"+
    	"<tr>"+
    		"<td style='font-family:Helvetica,Arial,sans-serif;width:685px;'>"+
    			"<table align='center' style='font-size:inherit;line-height:inherit;padding:0;border:0;'>"+
    				"<tbody>"+
						"<tr>"+
    						"<td colspan='3' style='font-family:Helvetica,Arial,sans-serif;width:685px;font-size:11px;color:#888;text-align:center;background-repeat:no-repeat;padding:15px 0 10px;' align='center'>"+
    							"<img src='http://oi59.tinypic.com/2lnjp08.jpg' style='display:inline-block;width:81px;min-height:22px;'>"+
    						"</td>"+
						"</tr>"+
						"<tr>"+
  							"<td colspan='3' align='center' style='font-family:Helvetica,Arial,sans-serif;color:#2b2b2b;font-size:27px;font-weight:300;word-break:break-word;padding:23px 0 0px;'>"+$scope.sala.nombre+"</td>"+
        				"</tr>"+
						"<tr>"+
							"<td colspan='3' align='center' style='font-family:Helvetica,Arial,sans-serif;color:#2b2b2b;font-size:15px;font-weight:300;word-break:break-word;padding:0 0 17px;'>Mesa de ayuda</td>"+
						"</tr>"+
						"<tr>"+
                			"<td style='font-family:Helvetica,Arial,sans-serif;font-size:14px;font-weight:300;color:#9b9b9b;vertical-align:top;line-height:21px;text-align:right;width:185px;padding:0 0 4px;' valign='top'>Cuando</td>"+
               				"<td style='width: 25px;' ></td>"+
                			"<td style='font-family:Helvetica,Arial,sans-serif;font-size:15px;font-weight:300;color:#666;line-height:20px;width:500px;padding:0 0 4px;text-align:left;'>"+ $scope.instancia.cuando +"</td>"+                                                            
	        			"</tr>"+
	        			"<tr>"+
                  			"<td style='font-family:Helvetica,Arial,sans-serif;font-size:14px;font-weight:300;color:#9b9b9b;vertical-align:top;line-height:21px;text-align:right;width:185px;padding:0 0 4px;' valign='top'>Usuario solicitante</td>"+
                  			"<td style='width: 25px;'></td>"+
                  			"<td style='font-family:Helvetica,Arial,sans-serif;font-size:15px;font-weight:300;color:#666;line-height:20px;width:500px;padding:0 0 4px;text-align:left;'>"+user+"</td>"+                                                    
	        			"</tr>";
	        			
	        			 if($scope.instancia.titulo)
	        			 { 
	        			    $scope.instancia.mensajeInicio+="<tr>"+
                  			"<td style='font-family:Helvetica,Arial,sans-serif;font-size:14px;font-weight:300;color:#9b9b9b;vertical-align:top;line-height:21px;text-align:right;width:185px;padding:0 0 4px;' valign='top'>Titulo</td>"+
                  			"<td style='width: 25px;'></td>"+
                  			"<td style='font-family:Helvetica,Arial,sans-serif;font-size:15px;font-weight:300;color:#666;line-height:20px;width:500px;padding:0 0 4px;text-align:left;'>"+ $scope.tituloReunion +"</td>"+                                                            
	        			    "</tr>";
	        		     }

	        			
                		if($scope.instancia.duenio)
                		{
                		     $scope.instancia.mensajeInicio+="<tr>"+
                			"<td style='font-family:Helvetica,Arial,sans-serif;font-size:14px;font-weight:300;color:#9b9b9b;vertical-align:top;line-height:21px;text-align:right;width:185px;padding:0 0 4px;' valign='top'>Dueño de reserva </td>"+
                  			"<td style='width: 25px;'></td>"+
                  			"<td style='font-family:Helvetica,Arial,sans-serif;font-size:15px;font-weight:300;color:#666;line-height:20px;width:500px;padding:0 0 4px;text-align:left;'>"+$scope.apellidoDuenioReunion+" "+$scope.nombreDuenioReunion+"</td>"+                                                          
	        			    "</tr>";
                		}

                         
                        if($scope.instancia.interno)
                        {
                            $scope.instancia.mensajeInicio+="<tr>"+
                  			"<td style='font-family:Helvetica,Arial,sans-serif;font-size:14px;font-weight:300;color:#9b9b9b;vertical-align:top;line-height:21px;text-align:right;width:185px;padding:0 0 4px;' valign='top'>Interno</td>"+
                  			"<td style='width: 25px;'></td>"+
                  			"<td style='font-family:Helvetica,Arial,sans-serif;font-size:15px;font-weight:300;color:#666;line-height:20px;width:500px;padding:0 0 4px;text-align:left;'>"+$scope.internoReunion+"</td>"+                                                               
	        			    "</tr>";
                        }

						
						if($scope.instancia.asistentes)
						{
						    $scope.instancia.mensajeInicio+="<tr>"+
                  			"<td style='font-family:Helvetica,Arial,sans-serif;font-size:14px;font-weight:300;color:#9b9b9b;vertical-align:top;line-height:21px;text-align:right;width:185px;padding:0 0 4px;' valign='top'>Cantidad de asistentes</td>"+
                  		    "<td style='width: 25px;'></td>"+
                  			"<td style='font-family:Helvetica,Arial,sans-serif;font-size:15px;font-weight:300;color:#666;line-height:20px;width:500px;padding:0 0 4px;text-align:left;'>"+$scope.asistentesReunion+"</td>"+                                               
	        			    "</tr>";
						}

						
              		$scope.instancia.mensajeInicio+="</tbody>"+
		"</table>"+
            "</td>"+
                "</tr>"+
                "<tr>"+
     	                  "<td colspan='3' background='https://statici.icloud.com/emailimages/v4/common/footer_gradient_web.png' style='font-family:Helvetica,Arial,sans-serif;width:685px;font-size:11px;color:#888;text-align:center;background-repeat:no-repeat;padding:15px 0 10px;' align='center'>"+
       			                        "<span style='font-size:16px;'>Gobierno de la ciudad de Buenos Aires</span>"+
     		                        "</td>"+
   		           "</tr>"+
   		    "</tbody>"+
        "</table>";
//FIN ENVIAR MAIL-------------------------------------------------------------------------------------------------------------------------------------

        var receptores=$scope.duenioReserva+partici+","+$scope.instancia.usuario;
        

        $scope.enviando = true;
        var payload = {
            asunto: "Reserva de Sala",
            para: receptores+"@buenosaires.gob.ar", 
			cc: '',
			cco: '',
			exclusivos: '',
			principioHtml: '',
			
			texto: "<div class='mailwrapper'>"+$scope.instancia.mensajeInicio+"</div>",      
			
			finHtml: '',
            instanciaId: $scope.instancia._id,
            adjunto : "",
            desdeEmail : "Sistema de Reserva de Salas <reserva.sala@buenosaires.gob.ar>"

        };
        
        $http.post('/api/orm/enviar-reserva', payload).success(function() {
            $scope.enviando = false;
            $("#mailEnviado").modal('show');
        }).error(function() {
            $scope.enviando = false;
            alert("Fallo el envio");
        });
    };
// FIN EDITADO.......................................................................................................................................
    
    
    $scope.contactoPorId = function (id) {
        if (id) {
          for (var i = 0; i < $scope.contactos.length; i++) {
              if ($scope.contactos[i]._id == id)
              {
                  return $scope.contactos[i];
              }
          }  
        }
    };
    
    $scope.filtroEstado = function (sala) {
        if (sala.apagado) {
          return false;  
        } else {
            return true;
        }
    };
	
    $scope.aMilisegundos = function(fecha, hora) {
        var fechaDividida = fecha.split("/");
        var horaDividida = hora.split(":");
        var date = new Date(fechaDividida[2], fechaDividida[1] - 1, fechaDividida[0], horaDividida[0], horaDividida[1], 0, 0);
        return date.getTime();
    };
	
    $scope.guardarCambios = function() {
        angular.extend(new SalasReunionesInstancia($scope.instancia), {
            suspendida: $scope.live.suspendida,
            comentarios: $scope.live.comentarios
        }).$save(function() {
            $scope.applyChanges();
        });
    };

    $scope.guardar = function() {
        
        var textoAlGuardar="Ingrese:";
        var vacios=false;
        var existeAlguno=0;
        
        if(!$scope.instancia.titulo) 
        {   
            if(existeAlguno===0)
            {
                textoAlGuardar+=" Título";
                existeAlguno++;
            }
            else
            {
                textoAlGuardar+=", título";
            }
            vacios=true;
        }
        
        if(!$scope.instancia.duenio)
        {
            if(existeAlguno===0)
            {
                textoAlGuardar+=" Dueño";
                existeAlguno++;
            }
            else
            {
                textoAlGuardar+=", dueño";
            }
            vacios=true;
        }
        
        if(!$scope.instancia.interno)
        {
            if(existeAlguno===0)
            {
                textoAlGuardar+=" Numero de interno";
                existeAlguno++;
            }
            else
            {
                textoAlGuardar+=", numero de interno";
            }
            vacios=true;
        }
        
        if(!$scope.instancia.asistentes)
        {
            if(existeAlguno===0)
            {
                textoAlGuardar+=" Cantidad de asistentes";
                existeAlguno++;
            }
            else
            {
                textoAlGuardar+=", cantidad de asistentes";
            }
            vacios=true;
        }
        
        if(vacios===true)
        {
            alert(textoAlGuardar);
        }
        
        if(vacios===false)
        {
            $scope.instancia.desdeDate = $scope.aMilisegundos($scope.instancia.fecha, $scope.instancia.desdeHora);
            $scope.instancia.hastaDate = $scope.aMilisegundos($scope.instancia.fecha, $scope.instancia.hastaHora);
            $scope.instancia.$save();
            $rootScope.$broadcast('stop-edit');
        }
        
    };
    
    $scope.valorConmutador = function(c) {
        if (c) {
            if (c.telefonos) {
                for (var i = 0; i < c.telefonos.length; i++) {
                    if (c.telefonos[i].nombre == 'Conmutador') {
                        return c.telefonos[i].valor + ' int. ' + c.telefonos[i].interno;
                    }
                }
                return 'No hay conmutador cargado';
            }
        }
    };
    
    $scope.valorTelefono = function(c) {
        if (c) {
            if (c.telefonos) {
                for (var i = 0; i < c.telefonos.length; i++) {
                    if (c.telefonos[i].nombre == 'Telefono directo') {
                        return c.telefonos[i].valor;
                    }
                }
                return 'No hay telefono cargado';
            }
        }
    };
    
    $scope.agregarParticipante = function(data) {
        if (!$scope.instancia.participantes) {
            $scope.instancia.participantes = [];
        }
        var parti = {
            contactoId : data,
            externo: false
        };
        $scope.instancia.participantes.push(parti);
    };
    
    $scope.abrirModalSala = function() {
        $("#modalSala").modal('show');
    };
    
    $scope.abrirModal = function() {
        $("#modalVisitas").modal('show');
    };
    
    $scope.guardarVisitas = function() {
        $scope.instancia.$save();
    };
    
    $scope.guardarSala = function() {
        $scope.instancia.$save({}, function() {
            $scope.$emit('recargar-salas');
        });
    };
    
    $scope.valorCorreo = function(c) {
        if (c) {
            if (c.correos) {
                for (var i = 0; i < c.correos.length; i++) {
                    if (c.correos[i].nombre == 'Email oficial') {
                        return c.correos[i].valor;
                    }
                }
                return 'No hay correo cargado';
            }
        }
    };
    
    $scope.abrirModalContacto = function() {
            $("#modalContacto").modal('show');
    };
    
    $scope.eliminar = function(confirmado) {
        if (confirmado) {
            $scope.instancia.$delete(function() {
                $rootScope.$broadcast('volver');
            });
        }
        else {
            $("#confirmarEliminar").modal('show');
        }
    };
}).controller("SalasReunionesPrint", function ($scope, $rootScope, $routeParams, $window, Contactos, SalasReunionesInstancia, SalasReuniones) {
    $scope.instancia = SalasReunionesInstancia.get({_id: $routeParams._id}, function(){
        $scope.sala = SalasReuniones.get({_id: $scope.instancia.sala});
    });
    
    $scope.imprimir = function () {
        $window.print(); 
    };
    
	$scope.contactos = Contactos.listar();
    
    $scope.contactoPorId = function (id) {
        if (id) {
          for (var i = 0; i < $scope.contactos.length; i++) {
              if ($scope.contactos[i]._id == id)
              {
                  return $scope.contactos[i];
              }
          }  
        }
    };
    
    $scope.valorConmutador = function(c) {
        if (c) {
            if (c.telefonos) {
                for (var i = 0; i < c.telefonos.length; i++) {
                    if (c.telefonos[i].nombre == 'Conmutador') {
                        return c.telefonos[i].valor + ' int. ' + c.telefonos[i].interno;
                    }
                }
                return 'No hay conmutador cargado';
            }
        }
    };
    
    $scope.valorTelefono = function(c) {
        if (c) {
            if (c.telefonos) {
                for (var i = 0; i < c.telefonos.length; i++) {
                    if (c.telefonos[i].nombre == 'Telefono directo') {
                        return c.telefonos[i].valor;
                    }
                }
                return 'No hay telefono cargado';
            }
        }
    };
    
    $scope.valorCorreo = function(c) {
        if (c) {
            if (c.correos) {
                for (var i = 0; i < c.correos.length; i++) {
                    if (c.correos[i].nombre == 'Email oficial') {
                        return c.correos[i].valor;
                    }
                }
                return 'No hay correo cargado';
            }
        }
    };
    
    var f = new Date();
    var minutos = "00";
    if (f.getMinutes() < 10) {
        minutos = "0" + f.getMinutes();
    } else {
        minutos = f.getMinutes();
    }
    $scope.hora = (f.getDate() + "/" + (f.getMonth() +1) + "/" + f.getFullYear() + ' a las ' + f.getHours() + ':' + minutos);
}).controller('SalasRegistroCtrl', function($scope, SalasReuniones, SalasReunionesInstancia, Contactos) {
    $scope.filtroPiso="";
    $scope.fecha = new Date();
    $scope.color = "btn-success";
    $scope.color2 = "btn-success";
    $scope.faltan = "";
    $scope.faltan2 = "";
    $scope.salas = SalasReuniones.query();
    $scope.refrescar = "";
    $scope.cambiaColor = 1;
    $scope.meses = [ "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre" ];
    $scope.contactos = Contactos.listar();
    var hoy = $scope.fecha.getTime();
    var siguiente = hoy + 30800000;
    $scope.instancias = SalasReunionesInstancia.query({
        $and:JSON.stringify([
            {hastaDate:{$gte: hoy}},
            {desdeDate:{$lte: siguiente}},
        ]),
    });
    
    $scope.sonido = document.getElementById("sonido");
    
    $scope.traerDatos = function () {
        $scope.fecha = new Date();
        var hoy = $scope.fecha.getTime();
        var siguiente = hoy + 10800000;
        $scope.instancias = SalasReunionesInstancia.query({
            $and:JSON.stringify([
                {hastaDate:{$gte: hoy}},
                {desdeDate:{$lte: siguiente}},
            ]),
        });
    };
    
    $scope.masCero = function (numero) {
        if (numero < 10) {
            return ("0" + numero);
        } else {
            return numero;
        }
    };
    
    $scope.aFecha = function (d) {
        return ($scope.masCero(d.getDate()) + "/" + $scope.meses[d.getMonth()] + "/" + d.getFullYear());
    };
    $scope.aHora = function (d) {
        if (d.getTimezoneOffset() === 0) {
            return ($scope.masCero(d.getHours()-3) + ":" + $scope.masCero(d.getMinutes()));
        } else {
            return ($scope.masCero(d.getHours()) + ":" + $scope.masCero(d.getMinutes()));
        }
    };
    
    $scope.instanciaPorId = function (id) {
      for (var i = 0; i < $scope.instancias.length; i++) {
          if ($scope.instancias[i]._id == id)
          {
              return $scope.instancias[i];
          }
      }  
    };    
    
    $scope.salaPorId = function (id) {
      for (var i = 0; i < $scope.salas.length; i++) {
          if ($scope.salas[i]._id == id)
          {
              return $scope.salas[i];
          }
      }  
    };
    
    $scope.contactoPorId = function (id) {
        if (id) {
          for (var i = 0; i < $scope.contactos.length; i++) {
              if ($scope.contactos[i]._id == id)
              {
                  return $scope.contactos[i];
              }
          }  
        }
    };
    
    setInterval($scope.traerDatos,100000);
    
    
    $scope.funcion = function(valorLoco){
       
           if(!$scope.filtroPiso){
               return true;
           }else{
                if(valorLoco.piso == $scope.filtroPiso){
                   return true;   
                }else{
                   return false;
                }       
           }
    };
    
    var salasOrden = [];
    
    $scope.ordenSalas = function(i){
        salasOrden.push($scope.salaPorId(i.sala).tipo);
        
        console.log(salasOrden);
    };
    
    
})
.controller("SalasReunionesReporteCtrl", function ($scope, $rootScope, Contactos, SalasReuniones, SalasReunionesInstancia, $routeParams) {
    $scope.estadisticas = [];
    $scope.fecha = {
        desde : "",
        hasta : ""
    };
    $scope.orden = 'tipo';
    
    
    $scope.contactos = Contactos.listar();
    $scope.contactoPorId = function (id) {
        if (id) {
          for (var i = 0; i < $scope.contactos.length; i++) {
              if ($scope.contactos[i]._id == id)
              {
                  return $scope.contactos[i].apellidos+" "+$scope.contactos[i].nombre;
              }
          }  
        }
    };
    
    $scope.puedeAgregar = function (contactoId, array) {
        if (!array) {

            return;
        }
        if (!contactoId) {
            return false;
        }

        var found = false;

        for (var i = 0; i < array.length; i++) {
            if (array[i] == contactoId) {
                found = true;
                break;
            }
        }

        return !found;
    };
    
    $scope.porcentaje = function(a, b) {
        if ((a === 0) || (b === 0)) {
            return 0;
        } else {
            var porcentaje = a / b * 100;
            return porcentaje.toFixed(2);
        }
    };
    
    $scope.promedio = function(a, b) {
        if ((a === 0) || (b === 0)) {
            return 0;
        } else {
            var promedio = a / b;
            if (a % b == 0) {
                return promedio;
            } else {
                return promedio.toFixed(2);
            }
        }
    };
    
    var hoy=new Date(); 
    var dia=hoy.getDate(), mes=(parseInt(hoy.getMonth())+1);
    if(dia<10)
    {
        dia="0"+dia;
    }
    if(mes<10)
    {
        mes="0"+mes;
    }
    hoy=(dia)+"/"+(mes)+"/"+(hoy.getFullYear());
    
    $scope.salas = SalasReuniones.query({}, function(){
        angular.forEach($scope.salas, function(r) {
            $scope.estadisticas.push({
                id : r._id,
                nombre : r.nombre,
                tipo : r.tipo,
                apagado : r.apagado,
                capacidad : r.capacidad,
                piso : r.piso,
                cantReuniones : 0,
                cantAsistentes : 0,
            });
        });
        $scope.instancias = SalasReunionesInstancia.query({}, function(){
            angular.forEach($scope.instancias, function (i){
                angular.forEach($scope.estadisticas, function (r){
                    if (i.sala == r.id) {
                        r.cantReuniones = r.cantReuniones + 1;
                        if (i.asistentes) {
                            r.cantAsistentes = r.cantAsistentes + parseInt(i.asistentes);
                        }
                    }
                });
            });
            $scope.gabinete=[],$scope.sala1=[],$scope.sala2=[],$scope.sala3=[],$scope.sala4=[],$scope.sala5=[],$scope.auditorio=[];
            
            $scope.reunionesHoy=SalasReunionesInstancia.query({'fecha':hoy},function(){
                
                angular.forEach($scope.reunionesHoy, function(i) {
                    if(i.sala=="54fdc4550317fa5f8eb67250")
                    {
                        $scope.gabinete.push(i);
                    }
                    else if(i.sala=="54ec62210317fa5f8eb6723a")
                    {
                        $scope.sala1.push(i);
                    }
                    else if(i.sala=="54ec62210317fa5f8eb6723b")
                    {
                        $scope.sala2.push(i);
                    }
                    else if(i.sala=="54ec62210317fa5f8eb6723c")
                    {
                        $scope.sala3.push(i);
                    }
                    else if(i.sala=="54ec62210317fa5f8eb6723d")
                    {
                        $scope.sala4.push(i);
                    }
                    else if(i.sala=="54ec62210317fa5f8eb6723e")
                    {
                        $scope.sala5.push(i);
                    }
                    else if(i.sala=="54da1b5041e6230bd40c245c")
                    {
                        //i.inicio=parseInt(i.desdeHora.substring(0,2));
                        $scope.auditorio.push(i);
                    }
                });
                
                $scope.hayReunionAhora=function(index,coleccion)
                {
                    index+=8;
                    if(parseInt(index)<10)
                    {
                        index="0"+index;
                    }
                    
                    angular.forEach(coleccion, function(i) {
                        if(i.desdeHora.substring(0,2)==index)
                        {
                            return i;
                        }
                    });
                };
            });
        });
    });
    

    $scope.$watch('fecha.desde', function (fecha){
        if (fecha) {
            $scope.estadisticas = [];
            var d = new Date(fecha.slice(6), fecha.slice(3,5)-1, fecha.slice(0,2), 0, 0, 0, 0);
            if ($scope.fecha.hasta) {
                var h = new Date($scope.fecha.hasta.slice(6), $scope.fecha.hasta.slice(3,5)-1, $scope.fecha.hasta.slice(0,2), 0, 0, 0, 0);
            } else {
                var h = new Date();
            }
            $scope.salas = SalasReuniones.query({}, function(){
                angular.forEach($scope.salas, function(r) {
                    $scope.estadisticas.push({
                        id : r._id,
                        nombre : r.nombre,
                        tipo : r.tipo,
                        apagado : r.apagado,
                        capacidad : r.capacidad,
                        piso : r.piso,
                        cantReuniones : 0,
                        cantAsistentes : 0,
                    });
                });
                $scope.instancias = SalasReunionesInstancia.query({
                    $and:JSON.stringify([
                        {desdeDate:{$gte: d.getTime()}},
                        {desdeDate:{$lte: h.getTime()}},
                    ]),
                }, function(){
                    angular.forEach($scope.instancias, function (i){
                        angular.forEach($scope.estadisticas, function (r){
                            if (i.sala == r.id) {
                                r.cantReuniones = r.cantReuniones + 1;
                                if (i.asistentes) {
                                    r.cantAsistentes = r.cantAsistentes + parseInt(i.asistentes);
                                }
                            }
                        });
                    });
                });
            });
        }
        
    });
    
    $scope.$watch('fecha.hasta', function (fecha2){
        if (fecha2) {
            $scope.estadisticas = [];
            var h = new Date(fecha2.slice(6), fecha2.slice(3,5)-1, fecha2.slice(0,2), 0, 0, 0, 0);
            if ($scope.fecha.desde) {
                var d = new Date($scope.fecha.desde.slice(6), $scope.fecha.desde.slice(3,5)-1, $scope.fecha.desde.slice(0,2), 0, 0, 0, 0);
            } else {
                var d = new Date(1900, 1, 1, 0, 0, 0, 0);
            }
            $scope.salas = SalasReuniones.query({}, function(){
                angular.forEach($scope.salas, function(r) {
                    $scope.estadisticas.push({
                        id : r._id,
                        nombre : r.nombre,
                        tipo : r.tipo,
                        apagado : r.apagado,
                        capacidad : r.capacidad,
                        piso : r.piso,
                        cantReuniones : 0,
                        cantAsistentes : 0,
                    });
                });
                $scope.instancias = SalasReunionesInstancia.query({
                    $and:JSON.stringify([
                        {desdeDate:{$gte: d.getTime()}},
                        {desdeDate:{$lte: h.getTime()}},
                    ]),
                }, function(){
                    angular.forEach($scope.instancias, function (i){
                        angular.forEach($scope.estadisticas, function (r){
                            if (i.sala == r.id) {
                                r.cantReuniones = r.cantReuniones + 1;
                                if (i.asistentes) {
                                    r.cantAsistentes = r.cantAsistentes + parseInt(i.asistentes);
                                }
                            }
                        });
                    });
                });
            });
        }
        
    });
    
});