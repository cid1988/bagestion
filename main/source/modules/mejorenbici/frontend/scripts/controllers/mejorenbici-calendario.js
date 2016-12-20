angular.module('bag2.mejorenbici.calendario', [])
.controller('MejorEnBiciCtrl',
    function($scope, MEVColoresPorBici, $state, $stateProvider, Contactos, ORMContacto, MejorEnBici, MejorEnBiciInstancia, $timeout, MEBRolesPorKey, MEBTiposAsistenciaPorKey, $location, $rootScope, $http) {
    $scope.filtro = {};
    
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

    // diccionarios para acceder a los datos de las bicis y las instancias por id
    var bicisPorId = $scope.bicisPorId = {};
    var instanciasPorId = $scope.instanciasPorId = {};

    $scope.colorBici = function (r){
        return (MEVColoresPorBici()[r.tipo] || 'grey');
    };
    
    var formatTipoBiciCombo = function (object, container, query) {
            if (object.id != '') {
                var html = '<div style="width: 10px;height:10px;margin-right:4px;display:inline-block; background-color: '+ (MEVColoresPorBici()[object.id] || 'grey') +'"></div>' + object.text;
                console.log(html);
                return html;
            } else {
                return object.text;
            }
        };
    $scope.tipoBiciSelect2 = {
        formatResult: formatTipoBiciCombo,
        // formatSelection: formatTipoBiciCombo
    };
    
    var eventFromInstancia = function (i){
        return {
            title: (i.suspendida && 'Suspendida') || '',
            start: new Date(i.desdeDate),
            end: new Date(i.hastaDate),
            editable: $scope.editando || false,
            allDay: false,
            color: MEVColoresPorBici() [bicisPorId[i.bici].tipo] || 'grey',
            html: '<i ng-repeat="p in bicisPorId[instancia.bici].participantes" ngclass="{\'icon-star\': p.star, \'icon-star-empty\': !p.star}"></i> <span></span>',
            css: {
                opacity: (i._id != $scope.instanciaSeleccionada && '0.5') || '1.0'
            },
                // si agregamos estos campos al objeto event los mantiene
                // cuando lo pasa de parámetro en algún evento de UI (click, etc)
                bici: i.bici,
                _id: i._id
            };
    };

    var refrescar = function() {
        // borramos todos los eventos que había para el calendario
        $scope.events.splice(0, $scope.events.length);

        if ($scope.instancias) {
            $scope.instancias.forEach(function(i) {
                if ((!$scope.filtro || !$scope.filtro.tipo) ||
                 $scope.bicisPorId[i.bici].tipo == $scope.filtro.tipo) {

                // TODO: @eazel7: estaría bueno que esto lo haga el servidor
                $scope.events.push(eventFromInstancia(i));
        }
    });
}

$scope.calendar.refreshEvents && $scope.calendar.refreshEvents();
};

var traerDatos = function() {
        // TODO: sacar MEBRolesPorKey
        $scope.rolesPorKey = MEBRolesPorKey();

        // TODO: sacar MEBTiposAsistenciaPorKey
        $scope.tiposAsistenciaPorKey = MEBTiposAsistenciaPorKey();

        $scope.estado.trabajando++;
    
        var bicis = $scope.bicis = MejorEnBici.list(function() {
            $scope.estado.trabajando--;
            bicis.forEach(function(r) {
                bicisPorId[r._id] = r;
            });

            var instancias = $scope.instancias = MejorEnBiciInstancia.list(function() {
                instancias.forEach(function(i) {
                    // la guardamos en el diccionario
                    instanciasPorId[i._id] = i;
                });

                if ($scope.instanciaSeleccionada) {
                    $scope.instancia = instanciasPorId[$scope.instanciaSeleccionada];
                    $scope.bici = bicisPorId[$scope.instancia.bici];
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
    $scope.$on('recargar-bicis', traerDatos);

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
            var instancia = MejorEnBiciInstancia.findById({
                _id: _id
            }, function() {
                instancia.usuario = $scope.username;
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
        instancia.usuario = $scope.username;
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
                right: ''
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
                            usuario: $scope.username,
                            bici: $scope.programandoNuevaFecha._id,
                            fecha: startDate.format('dd/mm/yyyy'),
                            desdeHora: startDate.format('H:MM'),
                            hastaHora: endDate.format('H:MM'),
                            desdeDate: startDate.valueOf(),
                            hastaDate: endDate.valueOf()
                        };
                        
                        $scope.estado.trabajando++;
                        $http.post('/api/mejorenbici.instancias', instancia).success(function (nuevaInstancia) {
                            nuevaInstancia = new MejorEnBiciInstancia(nuevaInstancia);
                            
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
                $scope.resaltar = event.bici;
                $scope.biciResaltada = $scope.bicisPorId[$scope.resaltar];
                $scope.instanciaResaltada = $scope.instanciasPorId[event._id];
                $scope.$apply();
            },
            eventMouseout: function(event) {
                $scope.biciResaltada = $scope.instanciaResaltada = $scope.resaltar = null;
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

    $scope.$watch('instancia.bici', function(i) {
        if (i) {
            $scope.bici = $scope.bicisPorId[i];
        } else {
            $scope.bici = null;
        }
    });

    $scope.$watch('instancia.desdeDate', function(d) {
        $scope.fechaDesde = new Date(d);
    });

    $scope.$watch('instanciaSeleccionada', function(i) {
        if (i) {
            $scope.instancia = $scope.instanciasPorId[i];
            if ($scope.instancia) {
                $scope.bici = $scope.bicisPorId[$scope.instancia.bici];
            }
        } else {
            $scope.instancia = null;
            $scope.bici = null;
        }
        $scope.events.forEach(function(e) {
            e.color = bicisPorId[e.bici].color;
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
}).controller('TiposBiciCtrl', function($rootScope, $location, $scope) {
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
    $scope.ver = function(t) {
        $location.url('/orm/reuniones/' + t._id);
    };
}).controller('MEBTabReservaCtrl', function($scope, MejorEnBiciInstancia, $location) {
    $scope.guardarCambios = function() {
        angular.extend(new MejorEnBiciInstancia($scope.instancia), {
            suspendida: $scope.live.suspendida,
            comentarios: $scope.live.comentarios
        }).$save(function() {
            $scope.applyChanges();
        });
    };
    
    $scope.eliminar = function(confirmado) {
        if (confirmado) {
            $scope.instancia.$delete(function() {
                $scope.$emit('recargar-bicis');
                $scope.alerts.push({
                    type: 'success',
                    htmlMessage: 'La instancia se ha eliminado'
                });
            });
        }
        else {
            $("#confirmarEliminar").modal('show');
        }
    };
}).controller("MejorEnBiciPrint", function ($scope, $rootScope, $routeParams, $window, MejorEnBiciInstancia, MejorEnBici) {
    $scope.instancia = MejorEnBiciInstancia.get({_id: $routeParams._id}, function(){
        $scope.bici = MejorEnBici.get({_id: $scope.instancia.bici});
    });
    
    $scope.imprimir = function () {
        $window.print(); 
    };
    
    var f = new Date();
    $scope.hora = (f.getDate() + "/" + (f.getMonth() +1) + "/" + f.getFullYear() + ' a las ' + f.getHours() + ':' + f.getMinutes());
});