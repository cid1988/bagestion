angular.module('bag2.orm.calendario', ['bag2.orm'])
.controller('ORMUbicacionReunionCtrl', function($scope, ORMInstanciaReunion) {
    $scope.guardarCambios = function() {
        var i = ORMInstanciaReunion.findById({
            _id: $scope.live._id
        }, function() {
            angular.extend(i, {
                ubicacion: $scope.live.ubicacion
            });
            i.$save(function() {
                angular.extend($scope.instancia, {
                    ubicacion: $scope.live.ubicacion
                });
            });
        });
    };
    $scope.ubicacion = function(confirmado) {
        if (confirmado) {
            $scope.instancia.$save();
        }
        else {
            $("#agregarUbicacion").modal('show');
        }
    };
})
.controller('ORMEstadoReunionCtrl', function($scope, ORMInstanciaReunion) {
    $scope.estadoReunion = function(confirmado) {
        if (confirmado) {
            $scope.instancia.$save();
        }
        else {
            $("#comentarioGestion").modal('show');
        }
    };
})
.controller('ORMNuevaReunionCardCtrl', function ($scope, $rootScope, ORMReunion) {
    $scope.mostrar = false;
    $scope.$on('mostrar-nueva-reunion', function () {
        $scope.mostrar = true;
        $scope.nuevaReunion = new ORMReunion();
    });
    $scope.$on('mostrar-nueva-reunion-eventual', function () {
        $scope.mostrarEventual = true;
        $scope.nuevaReunion = new ORMReunion();
    });
    
    $scope.$on('ocultar-nueva-reunion', function () {
        $scope.mostrar = false;
    });
    $scope.cancelar = function () {
        $scope.mostrar = false;
        $scope.mostrarEventual = false;
        $rootScope.$broadcast('ocultar-nueva-reunion');
    };
    //Verificar por nombre duplicado
    $scope.$watch('nuevaReunion.nombre', function (nn) {
        if ($scope.nuevaReunion) {
            var otros = ORMReunion.query({
                nombre: JSON.stringify({ "$regex" : $scope.nuevaReunion.nombre, "$options" : "-i" })
            }, function () {
                var dup = false;
                var candidatos = [];
                
                for (var i = 0; i < otros.length; i++) {
                    // Sólo si es otra reunion _id != _id
                    if (otros[i]._id != $scope.nuevaReunion._id) {
                        dup = true;
                        candidatos.push(otros[i]);
                    }
                }
                
                $scope.nombreDuplicadoCandidatos = candidatos;
                $scope.nombreDuplicado = dup;
            });
        }
    });
    
    var tiposEnvio=["para","cc","cco","exclusivos"];
    var envios=["propuestaTemario","minuta","temario","cita"];
    $scope.reunion = new ORMReunion();
    $scope.guardar = function () {
        if ($scope.nuevaReunion.nombre) {
            $scope.estado.trabajando++;
            if ($scope.nuevaReunion.frecuencia) {
                
                for(var i=0; i<envios.length; i++)
                {
                    for(var x=0; x<tiposEnvio.length; x++)
                    {
                        var envio=envios[i], 
                            tipo=tiposEnvio[x];
                            if(!$scope.nuevaReunion[envio])
                            {
                                $scope.nuevaReunion[envio] = {};
                            }
                        $scope.nuevaReunion[envio][tipo]=[];
                    }
                }
                $scope.nuevaReunion.participantes=[];
                $scope.nuevaReunion.llamados=[];
                $scope.nuevaReunion.$save(function() {
                    $scope.estado.trabajando--;
                    $scope.$emit('recargar-reuniones');
                    $scope.mostrar = false;
                    $scope.mostrarEventual = false;
                    $rootScope.$broadcast('ocultar-nueva-reunion');
                }, function (){
                        $scope.estado.trabajando--;
                });
            } else {
                alert("Falta ingresar una frecuencia");
            }
        }
    };
})
.controller('ORMNuevoGrupoReunionCardCtrl', function ($scope, $rootScope, ORMGrupoReunion) {
    $scope.mostrar = false;
    $scope.$on('mostrar-nueva-reunion', function () {
        $scope.mostrar = true;
        $scope.nuevoGrupo = new ORMGrupoReunion();
    });

    $scope.$on('ocultar-nueva-reunion', function () {
        $scope.mostrar = false;
    });
    
    $scope.cancelar = function () {
        $scope.mostrar = false;
        $rootScope.$broadcast('ocultar-nueva-reunion');
    };
    $scope.reunion = new ORMGrupoReunion();
    $scope.guardar = function () {
        if ($scope.nuevoGrupo.nombre) {
            $scope.estado.trabajando++;
            $scope.nuevoGrupo.$save(function() {
                $scope.estado.trabajando--;
                $scope.$emit('recargar-reuniones');
                $scope.mostrar = false;
                $rootScope.$broadcast('ocultar-nueva-reunion');
            }, function (){
                    $scope.estado.trabajando--;
            });
        }
    };
})
.controller('ORMCalendarioNavbarCtrl', function($scope, $location, $rootScope, $modal, ORMSoporte, ORMContacto, $location) {
    $scope.$on('trabajando', function (e, t) {
        $scope.trabajando = t;
    });
    $rootScope.$on('edit-started', function() {
        $scope.editando = true;
    });
    $rootScope.$on('edit-stoped', function() {
        $scope.editando = false;
    });
    $scope.editar = function() {
        $rootScope.$broadcast('start-edit', function() {
            $scope.editando = true;
        });
    };
    // URL para calendario iCal
    $scope.urlCaledario = $location.$$protocol + '://' + $location.$$host + ':' + $location.$$port + '/api/orm/ical/all.ics';
    
//@Alex: Edicion de soporte tecnico
    $scope.editandoSoporte=true;
    //Filtro para buscar correos
    $scope.buscarCorreo = function(nombre, contacto) {
        if (contacto) {
            if (!contacto.correos) {
                return " ";
            }
            else {
                for (var i = 0; i < contacto.correos.length; i++) {
                    var em = contacto.correos[i];
                    var expr = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
                    if (em.nombre == nombre) {
                        if ( !expr.test(em.valor) ) {
                            return " ";
                        } else {
                            return (em.valor);
                        }
                    }
                }
            } 
        }
        return (contacto.apellidos + ", " + contacto.nombre + " <No posee un Email oficial>");
    };
    //Filtro para los contactos
    $scope.contactoPorId = function (id) {
        if(!$scope.contactos)
        {
            $scope.contactos=ORMContacto.query(); 
        }
        for (var i = 0; i < $scope.contactos.length; i++) {
            if ($scope.contactos[i]._id == id)
            {
                return $scope.contactos[i];
            }
        }  
    };
    //Cambiar edicion en el modal, carga todos los conbtactos...
    $scope.cambiarEdicion=function(){
        $scope.editandoSoporte=false; 
        $scope.contactos=ORMContacto.query();
    };
    //Filtro para eliminar contactos sin apellidos y los que ya fueron agregados
    $scope.filtroContactos=function(persona){
        if(!persona.apellidos){
            return false;
        }
        else{
            return true;
        }
    };
    //Mostrar modal para editar soporte tecnico
    $scope.showEditarSoporte=function(){
        $scope.soporte=ORMSoporte.query({},function()
        {
            $("#editarSoporte").modal('show');
        });
    };
    //Agregar contactos de soporte
    $scope.agregar=function(persona){
        for(var i=0; i<$scope.soporte.length; i++){
            if($scope.soporte[i].idSoporte==persona)
            {
                alert("Ya existe ese contacto");
                return;
            }
        }
        
        var nuevoSoporte=new ORMSoporte();
        var agregarYBorrar=$scope.contactoPorId(persona);
        
        nuevoSoporte.idSoporte=persona;
        nuevoSoporte.apellidos=agregarYBorrar.apellidos;
        nuevoSoporte.nombres=agregarYBorrar.nombre;
        nuevoSoporte.email=$scope.buscarCorreo('Email oficial', $scope.contactoPorId(persona));
        
        nuevoSoporte.$save(function(){
            $scope.soporte=ORMSoporte.query();
        });
        agregarYBorrar=null, nuevoSoporte=null;
    };
    //Borra un contacto de soporte
    $scope.borrarSoporte=function(persona){
        if(confirm("¿Esta seguro/a que desea borrar a esta persona?. \n No recibira mas mails sobre las futuras reuniones."))
        {
           $scope.soporteBorrar=ORMSoporte.get({_id:persona._id},function()
            {
                $scope.soporteBorrar.$delete(function()
                {
                    $scope.soporte=ORMSoporte.query();
                });
            }); 
        }
    };
    //Ir al detalle del contacto
    $scope.irAContacto=function(id){
        $("#editarSoporte").modal('hide');
        $location.url("/contactos/detalle/"+id);
    };
//@Alex: Fin de soporte tecnico
})
.controller('ORMCalendarioCtrl',function($scope, throttle, trackState, ORMColoresPorTipo, ORMSoporte, $state, $stateProvider, ORMFechasEspeciales, Contactos, $modal, ORMContacto, ORMReunion, ORMGrupoReunion, ORMInstanciaReunion, ORMOrganigrama, $timeout, ORMRolesPorKey, ORMTiposAsistenciaPorKey, $location, $rootScope, $http, ORMPrioridades) {
    $scope.filtro = {};
    var hoy = new Date().getTime();
    var hace3Meses = hoy - 7889250000;
    var throttledFiltro = throttle(5000, function () {
        trackState($scope.filtro);
    });
    var actualizarConEvento = function(event) {
        var instancia = instanciasPorId[event._id];
        $scope.reprogramados[event._id] = instancia;
        instancia.fecha = event.start.format('dd/mm/yyyy');
        instancia.desdeHora = event.start.format('H:MM');
        instancia.hastaHora = event.end.format('H:MM');
        instancia.desdeDate = event.start.valueOf();
        instancia.hastaDate = event.end.valueOf();
    };
    // diccionarios para acceder a los datos de las reuniones y las instancias por id
    var reunionesPorId = $scope.reunionesPorId = {};
    var instanciasPorId = $scope.instanciasPorId = {};
    var formatTipoReunionCombo = function (object, container, query) {
        if (object.id != '') {
            var html = '<div style="width: 10px;height:10px;margin-right:4px;display:inline-block; background-color: '+ (ORMColoresPorTipo()[object.id] || 'grey') +'"></div>' + object.text;
            return html;
        } else {
            return object.text;
        }
    };
    var eventFromInstancia = function (i){
        return {
            title: $scope.reunionPorId(i.reunion).nombre,
            start: new Date(i.desdeDate),
            end: new Date(i.hastaDate),
            editable: $scope.editando || false,
            allDay: false,
            color: ORMColoresPorTipo() [reunionesPorId[i.reunion].tipo] || 'grey',
            html: '',
            css: {
                opacity: (i._id != $scope.instanciaSeleccionada && '0.5') || '1.0'
            },
                // si agregamos estos campos al objeto event los mantiene
                // cuando lo pasa de parámetro en algún evento de UI (click, etc)
                reunion: i.reunion,
                _id: i._id
            };
    };
    var eventFromEspeciales = function (i){
        return {
            title: i.nombre,
            start: new Date($scope.aMilisegundos(i.fecha, 10, 0)),
            end: new Date($scope.aMilisegundos(i.fecha, 12, 0)),
            editable: false,
            allDay: true,
            color: '#9A2EFE',
            html: '',
            css: {
                opacity: '1.0'
                },
            reunion: '',
            _id: i._id
        };
    };
    var refrescar = function() {
        // borramos todos los eventos que había para el calendario
        $scope.events.splice(0, $scope.events.length);

        if ($scope.instancias) {
            $scope.instancias.forEach(function(i) {
                if ((!$scope.filtro || !$scope.filtro.tipo) ||
                 $scope.reunionesPorId[i.reunion].tipo == $scope.filtro.tipo) {

                // TODO: @eazel7: estaría bueno que esto lo haga el servidor
                $scope.events.push(eventFromInstancia(i));
                }
            });
        }
        
        if ($scope.especiales) {
            $scope.especiales.forEach(function(e) {
                $scope.events.push(eventFromEspeciales(e));
            });
        }
        
        $scope.calendar.refreshEvents && $scope.calendar.refreshEvents();
    };
    var traerDatos = function() {
        $scope.todasReuniones = [];
        // TODO: sacar ORMRolesPorKey
        $scope.rolesPorKey = ORMRolesPorKey();
        // TODO: sacar ORMTiposAsistenciaPorKey
        $scope.tiposAsistenciaPorKey = ORMTiposAsistenciaPorKey();
        $scope.grupos = ORMGrupoReunion.query();
        $scope.estado.trabajando++;
        
        var reuniones = $scope.reuniones = ORMReunion.list(function() {
            $scope.estado.trabajando--;
            reuniones.forEach(function(r) {
                reunionesPorId[r._id] = r;
                var dato2 = {
                    _id : r._id,
                    nombre : r.nombre,
                    tipo : r.tipo,
                    apagado : r.apagado,
                    orden : r.orden,
                    grupo : r.grupo,
                    esGrupo : false,
                    prioridad: r.prioridad
                };
                $scope.todasReuniones.push(dato2);
            });
            $scope.grupos = ORMGrupoReunion.query(function() {
                angular.forEach($scope.grupos, function (g){
                    var dato = {
                        _id : g._id,
                        nombre : g.nombre,
                        tipo : g.tipo,
                        apagado : false,
                        orden : g.orden,
                        esGrupo : true
                    };
                    $scope.todasReuniones.push(dato);
                });
            });

            var instancias = $scope.instancias = ORMInstanciaReunion.query({
                $and:JSON.stringify([
                    {desdeDate:{$gte: hace3Meses}},
                ]),
            }, function() {
                instancias.forEach(function(i) {
                    // la guardamos en el diccionario
                    instanciasPorId[i._id] = i;
                });

                if ($scope.instanciaSeleccionada) {
                    $scope.instancia = instanciasPorId[$scope.instanciaSeleccionada];
                    $scope.reunion = reunionesPorId[$scope.instancia.reunion];
                    if ($scope.reunion.nombre.length < 38) {
                      $scope.set_size = {'font-size': '25px'};
                    }
                    else {
                      $scope.set_size = {'font-size': '20px'};
                    }
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
    var traerDatosGrupos = function() {
        $scope.grupos = ORMGrupoReunion.query();
    };
    var soporte=ORMSoporte.query({});
    
    $scope.mostrar = false;
    $scope.todasReuniones = [];
    $scope.jurisdicciones = ORMOrganigrama.query();
    $scope.especiales = ORMFechasEspeciales.query();
    $scope.grupos = ORMGrupoReunion.query();
    $scope.prioridades = ORMPrioridades.query();
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
    $scope.instanciaSeleccionada = $location.search().instancia;// usamos ?instancia=... para trackear el id seleccionado y para hacer significativa la URL
    $scope.events = [];// En este array vamos a guardar los objetos event de fullCalendar http://arshaw.com/fullcalendar/docs/event_data/Event_Object/
    $scope.tipoReunionSelect2 = {
        formatResult: formatTipoReunionCombo,
    };
    $scope.reprogramados = {};
    $scope.calendar = {
        events: $scope.events,
        viewConfig: {
            height: (document.getElementById("contieneCalendario").offsetHeight - 90),
            editable: true,
            allDaySlot: true,
            defaultView: 'agendaWeek',
            header: {
                left: 'prev next agendaDay agendaWeek month',
                center: 'today',
                right: 'title'
            },
            eventClick: function(event) {
                console.log('eventClick');
                if ($scope.permiso($scope.reunionPorId($scope.instanciaPorId(event._id).reunion).tipo)) {
                    $scope.instanciaSeleccionada = event._id;
                    $location.search('instancia', event._id);
                    $scope.$apply();
                }
            },
            dayClick: function(date, allDay, jsEvent, view) {
                $scope.$apply(function () {
                    if ($scope.programandoNuevaFecha) {
                        var startDate = date;
                        var endDate = new Date(date.valueOf() + 3600000); // más una hora
                        
                        /*if ($scope.programandoNuevaFecha.tipo == "seguimiento") {
                            $scope.soporteFlag = true;
                        } else {
                            $scope.soporteFlag = false;
                        }*/
                        //Todas las reuniones se marca soporte informatico por defecto
                        $scope.soporteFlag = true;
                        
                        var instancia = {
                            reunion: $scope.programandoNuevaFecha._id,
                            fecha: startDate.format('dd/mm/yyyy'),
                            desdeHora: startDate.format('H:MM'),
                            hastaHora: endDate.format('H:MM'),
                            desdeDate: startDate.valueOf(),
                            hastaDate: endDate.valueOf(),
                            usuarioCreacion: $scope.username,
                            fechaCreacion: new Date(),
                            soporte: $scope.soporteFlag
                        };
                        
                        $scope.estado.trabajando++;
                        $http.post('/api/orm.reuniones.instancias', instancia).success(function (nuevaInstancia) {
                            nuevaInstancia = new ORMInstanciaReunion(nuevaInstancia);
                            
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
                $scope.resaltar = event.reunion;
                $scope.reunionResaltada = $scope.reunionesPorId[$scope.resaltar];
                $scope.instanciaResaltada = $scope.instanciasPorId[event._id];
                $scope.$apply();
            },
            eventMouseout: function(event) {
                $scope.reunionResaltada = $scope.instanciaResaltada = $scope.resaltar = null;
                $scope.$apply();
            },
            eventResize: function(event) {
                if ($scope.permiso($scope.reunionPorId($scope.instanciaPorId(event._id).reunion).tipo)) {
                    actualizarConEvento(event);
                    $scope.$apply();
                }
            },
            eventDrop: function(event) {
                if ($scope.permiso($scope.reunionPorId($scope.instanciaPorId(event._id).reunion).tipo)) {
                    actualizarConEvento(event);
                    $scope.$apply();
                }
            }
        }
    };
    traerDatos();
    
    $scope.guardarReporogramacion = function() {
        var quitarReprogramado = function(_id) {
            delete $scope.reprogramados[_id];
        };

        var guardarInstancia = function(_id) {
            var instancia = ORMInstanciaReunion.findById({
                _id: _id
            }, function() {
                var reprogramada = $scope.reprogramados[_id];
                instancia.fecha = reprogramada.fecha;
                instancia.desdeHora = reprogramada.desdeHora;
                instancia.hastaHora = reprogramada.hastaHora;
                instancia.desdeDate = reprogramada.desdeDate;
                instancia.hastaDate = reprogramada.hastaDate;
                instancia.usuarioModificacion = $scope.username;
                instancia.fechaModificacion = new Date();
                instancia.$save(function() {
                    quitarReprogramado(_id);
                    $scope.mailSoporte(instancia);
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
    $scope.jurisdiccionPorId = function (id) {
      for (var i = 0; i < $scope.jurisdicciones.length; i++) {
          if ($scope.jurisdicciones[i]._id == id)
          {
              return $scope.jurisdicciones[i];
          }
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
    $scope.reunionPorId = function (id) {
      for (var i = 0; i < $scope.reuniones.length; i++) {
          if ($scope.reuniones[i]._id == id)
          {
              return $scope.reuniones[i];
          }
      }  
    };
    $scope.permiso = function (tipo) {
        if (tipo == "seguimiento") {
            return $scope.hasPermission('orm.seguimiento');
        } else if (tipo == "transversales") {
            return $scope.hasPermission('orm.transversales');
        } else if (tipo == "especificas") {
            return $scope.hasPermission('orm.especificas');
        } else if (tipo == "planeamiento") {
            return $scope.hasPermission('orm.planeamiento');
        } else if (tipo == "presupuesto") {
            return $scope.hasPermission('orm.presupuesto');
        } else if (tipo == "coordinacion") {
            return $scope.hasPermission('orm.coordinacion');
        } else if (tipo == "planLargoPlazo") {
            return $scope.hasPermission('orm.planLargoPlazo');
        } else if (tipo == "proyectosEspeciales") {
            return $scope.hasPermission('orm.proyectosEspeciales');
        } else if (tipo == "eventuales") {
            return $scope.hasPermission('orm.eventuales');
        }
    };
    $scope.orderByStar = function(c1, c2) {
        return (((c1 && c1.star) || 0) && 1) - (((c2 && c2.star) || 0) && 1);
    };
    $scope.volver = function() {
        $scope.instancia = false;
    };
    $scope.colorReunion = function (r){
        return (ORMColoresPorTipo()[r.tipo] || 'grey');
    };
    $scope.aMilisegundos = function(fecha, hora, minutos) {
        var fechaDividida = fecha.split("/");
        var date = new Date(fechaDividida[2], fechaDividida[1] - 1, fechaDividida[0], hora, minutos, 0, 0);
        return date.getTime();
    };
    $scope.programaFechaEspecial = function(confirmado) {
        if (confirmado) {
            $scope.reunionEspecial.$save();
            $scope.$emit('recargar-calendario');
        }
        else {
            $scope.reunionEspecial = new ORMFechasEspeciales();
            $modal({template: '/views/orm/calendario/cards/fechaEspecial.html', persist: true, show: true, scope: $scope.$new()});
        }
    };
    $scope.prioridadPorId = function (id) {
        for (var i = 0; i < $scope.prioridades.length; i++) {
            if($scope.prioridades[i]._id == id){
                return $scope.prioridades[i].nombre;
            }
        }
    }; 
    $scope.huboReporogramacion = function() {
        for (var p in $scope.reprogramados) {
            return true;
        }
        return false;
    }
    $scope.editar = function() {
        $scope.editando = true;
    };
    $scope.cancelarReprogramacion = function() {
        refrescar();
    };
    $scope.mailSoporte = function(instancia) {
        var paraSoporte=[];
        soporte.forEach(function(element)
        {
            paraSoporte.push(element.email || "");
        });
        
        var reunion = ORMReunion.get({_id : instancia.reunion}, function() {
            $scope.fecha = new Date(instancia.desdeDate);
            if ($scope.fecha.getMinutes() === 0) {
                $scope.hora = $scope.fecha.getHours() + ":00";
            } else {
                $scope.hora = $scope.fecha.getHours() + ":" + $scope.fecha.getMinutes();
            }
            $scope.meses = [ "de Enero", "de Febrero", "de Marzo", "de Abril", "de Mayo", "de Junio", "de Julio", "de Agosto", "de Septiembre", "de Octubre", "de Noviembre", "de Diciembre" ];
            $scope.dias = [ "Domingo", "Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado" ];
            $scope.textoCita = '<div class="mailwrapper" style="font-size: 17px; color: black; line-height: 100% !important;" >Estimad@s,<br><br><br>Les informamos que la reunión de ' + reunion.nombre + ' (' + reunion.tipo + ') se realizará el <b>' + $scope.dias[$scope.fecha.getDay()] + ' ' + $scope.fecha.getDate() + ' ' + $scope.meses[$scope.fecha.getMonth()] + ' a las ' + $scope.hora + 'hs (' + (instancia.hastaDate - instancia.desdeDate) / 60000 + ' min)</b>';
            if (instancia.ubicacion) {
                $scope.textoCita = $scope.textoCita + ' en ' + instancia.ubicacion.nombre + '.';
            }
            $scope.textoCita = $scope.textoCita + '<br><br><b>Tengan a bien llegar unos minutos más temprano, a fin de poder realizar el ingreso con tiempo.</b>';
            $scope.textoCita = $scope.textoCita + '<br><br><br>Saludos cordiales,<br><br><br>BAGestion - ORM</b></div>';
            if (instancia.soporte) {
                var payload = {
                    asunto: "Aviso de Soporte en Reunion",
                    para: paraSoporte,
                    cc: "",
                    cco: "",
                    exclusivos: "",
                    instanciaId: instancia._id,
                    mensajeHtml: $scope.textoCita,
                    principioHtml: $scope.dias[$scope.fecha.getDay()] + " " + $scope.fecha.getDate() + " " + $scope.meses[$scope.fecha.getMonth()] + " " + $scope.hora + "hs (" + ((instancia.hastaDate - instancia.desdeDate) / 60000) + "min) " + instancia.ubicacion.nombre,
                    finHtml: "",
                    version: ""
                };
    
                $http.post('/api/orm/enviar-soporte', payload).success(function() {
                    $scope.enviando = false;
                }).error(function() {
                    $scope.enviando = false;
                });
            }
        });
    };

    $scope.$on('recargar-reuniones', traerDatos);
    $scope.$on('recargar-calendario', function() {
        $scope.especiales = ORMFechasEspeciales.query();
        var instancias = $scope.instancias = ORMInstanciaReunion.query({
            $and:JSON.stringify([
                {desdeDate:{$gte: hace3Meses}},
            ]),
            }, function() {
            instancias.forEach(function(i) {
                // la guardamos en el diccionario
                instanciasPorId[i._id] = i;
            });
    
            if ($scope.instanciaSeleccionada) {
                $scope.instancia = instanciasPorId[$scope.instanciaSeleccionada];
                $scope.reunion = reunionesPorId[$scope.instancia.reunion];
                if ($scope.reunion.nombre.length < 38) {
                  $scope.set_size = {'font-size': '25px'};
                }
                else {
                  $scope.set_size = {'font-size': '20px'};
                }
            }
    
            $scope.$watch('events', function() {
                refrescar();
            }, true);
    
            $scope.$watch('filtro.tipo', function() {
                refrescar();
            }, true);
        });
    });
    $scope.$on('recargar-grupos', traerDatosGrupos);
    $scope.$on('volver', function(event, accept) {
        $scope.todasReuniones = [];
        // TODO: sacar ORMRolesPorKey
        $scope.rolesPorKey = ORMRolesPorKey();
        // TODO: sacar ORMTiposAsistenciaPorKey
        $scope.tiposAsistenciaPorKey = ORMTiposAsistenciaPorKey();
        $scope.grupos = ORMGrupoReunion.query();
        $scope.estado.trabajando++;
        
        var reuniones = $scope.reuniones = ORMReunion.list(function() {
            $scope.estado.trabajando--;
            reuniones.forEach(function(r) {
                reunionesPorId[r._id] = r;
                var dato2 = {
                    _id : r._id,
                    nombre : r.nombre,
                    tipo : r.tipo,
                    apagado : r.apagado,
                    orden : r.orden,
                    grupo : r.grupo,
                    esGrupo : false
                };
                $scope.todasReuniones.push(dato2);
            });
            $scope.grupos = ORMGrupoReunion.query(function() {
                angular.forEach($scope.grupos, function (g){
                    var dato = {
                        _id : g._id,
                        nombre : g.nombre,
                        tipo : g.tipo,
                        apagado : false,
                        orden : g.orden,
                        esGrupo : true
                    };
                    $scope.todasReuniones.push(dato);
                });
            });

            var instancias = $scope.instancias = ORMInstanciaReunion.query({
                $and:JSON.stringify([
                    {desdeDate:{$gte: hace3Meses}},
                ]),
            }, function() {
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
        $location.url('/orm/calendario');
    });
    $scope.$on('programar-nueva-fecha', function (event, r) {
        // $scope.$broadcast('programar-nueva-fecha', r);
        $scope.programandoNuevaFecha = r;
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

    //vamos a esperar a que la directiva fullcalendar agregue la función goToDate y 
    // la llamamos para asegurarnos que en el calendario
    $scope.$watch('instancia.desdeDate', function(d) {
        if ($scope.calendar && $scope.calendar.goToDate && d) {
            $scope.calendar.goToDate(new Date(d));
        }
    });
    $scope.$watch('filtro', function () {
        throttledFiltro();
    }, true);
    $scope.$watch('editando', function() {
        refrescar();
    });
    $scope.$watch('instancia.reunion', function(i) {
        if (i) {
            $scope.reunion = $scope.reunionesPorId[i];
            if ($scope.reunion.nombre.length < 38) {
              $scope.set_size = {'font-size': '25px'};
            }
            else {
              $scope.set_size = {'font-size': '20px'};
            }
        } else {
            $scope.reunion = null;
        }
    });
    $scope.$watch('instancia.desdeDate', function(d) {
        $scope.fechaDesde = new Date(d);
    });
    $scope.$watch('instanciaSeleccionada', function(i) {
        if (i) {
            $scope.instancia = $scope.instanciasPorId[i];
            if ($scope.instancia) {
                $scope.reunion = $scope.reunionesPorId[$scope.instancia.reunion];
            }
        } else {
            $scope.instancia = null;
            $scope.reunion = null;
        }
        $scope.events.forEach(function(e) {
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
    























    $scope.ormFullF = function(){
        $http.post('/api/ormFull').success(function() {
            console.log("Si")
        }).error(function() {
            console.log("No")
        });
    }
    





}).controller('ORMTiposReunionCtrl', function($rootScope, $location, $scope, $modal, ORMGrupoReunion, $http) {
    var self = this;
    $scope.altura = (document.getElementById("alturaSeries").offsetHeight - 100);
    
    self.programarNuevaFecha = function (r) {
        $scope.$emit('programar-nueva-fecha', r);
    };
    
    $scope.ordenTipo=function(serie)
    {
        switch(serie.tipo)
        {
            case "seguimiento":
                return 1;
            case "transversales":
                return 2;
            case "especificas":
                return 3;
            case "planeamiento":
                return 4;
            case "presupuesto":
                return 5;
            case "coordinacion":
                return 6;
            case "planLargoPlazo":
                return 7;
            case "proyectosEspeciales":
                return 8;
            case "eventuales":
                return 9;
        }
    };
    
    $scope.nuevaReunion = function () {
        $rootScope.$broadcast('mostrar-nueva-reunion');
        $scope.modalNuevaReunion = true;
    };
    
    $scope.$on('ocultar-nueva-reunion', function () {
        $scope.modalNuevaReunion = false;
    });
    
    $scope.nuevaReunionEventual = function () {
        $rootScope.$broadcast('mostrar-nueva-reunion-eventual');
        $scope.modalNuevaReunion = true;
    };
    
    $scope.mostrar = function (r) {
        if (!r.grupo) {
            if (!$scope.filtro.tipo) {
                return true; 
            } else {
                return $scope.filtro.tipo == r.tipo;
            }
        } else {
            return false;
        }
    };
    
    $scope.reunionPorId = function (id) {
      for (var i = 0; i < $scope.reuniones.length; i++) {
          if ($scope.reuniones[i]._id == id)
          {
              return $scope.reuniones[i];
          }
      }  
    };
    
    $scope.modificarGrupo = function(confirmado, idGrupo) {
        if (confirmado) {
            $scope.grupoModificando.$save(function() {
                $location.url('/orm/calendario');
            });
        }
        else {
            $scope.grupoModificando = ORMGrupoReunion.get({_id : idGrupo});
            $("#modificandoGrupo").modal('show');
        }
    };
    
    $scope.aMilisegundos = function(fecha, hora, minutos) {
        var fechaDividida = fecha.split("/");
        var date = new Date(fechaDividida[2], fechaDividida[1] - 1, fechaDividida[0], hora, minutos, 0, 0);
        return date.getTime();
    };
    
    $scope.programaReunionPeriodica = function(confirmado) {
        if (confirmado) {
            if ($scope.reunionPeriodica.fecha1 && $scope.reunionPeriodica.fecha2 && $scope.reunionPeriodica.hora && $scope.reunionPeriodica.minutos && $scope.reunionPeriodica.idReunion && ($scope.reunionPeriodica.lunes || $scope.reunionPeriodica.martes || $scope.reunionPeriodica.miercoles || $scope.reunionPeriodica.jueves || $scope.reunionPeriodica.viernes)) {
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
                            reunion : $scope.reunionPeriodica.idReunion,
                            desdeDate : i,
                            hastaDate : (i+3600000),
                            desdeHora : $scope.reunionPeriodica.hora + ":" + $scope.reunionPeriodica.minutos,
                            hastaHora : (parseInt($scope.reunionPeriodica.hora) +1) + ":" + $scope.reunionPeriodica.minutos,
                            fecha : fechaBien,
                        };
                        $http.post('/api/orm.reuniones.instancias', instancia).success();
                    }
                } 
                $scope.$emit('recargar-calendario');
            } else {
                alert("Faltan datos para poder programar la reunion periódica");
            }
        }
        else {
            $scope.reunionPeriodica = {
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
            $modal({template: '/views/orm/calendario/cards/reunionesPeriodicas.html', persist: true, show: true, scope: $scope.$new()});
        }
    };
    
    
    $scope.tipoPorValor = function (valor) {
      if (valor == "seguimiento") {
          return "Seguimiento";
      } else if (valor == "transversales") {
          return "Transversales";
      } else if (valor == "especificas") {
          return "Especificas";
      } else if (valor == "planeamiento") {
          return "Planeamiento";
      } else if (valor == "presupuesto") {
          return "Presupuesto";
      } else if (valor == "coordinacion") {
          return "Coordinación";
      } else if (valor == "planLargoPlazo") {
          return "Plan Largo Plazo";
      } else if (valor == "proyectosEspeciales") {
          return "Proyectos Especiales";
      } else if (valor == "eventuales") {
          return "Eventuales";
      } else {
          return "";
      }
    };
    
    $scope.estaResaltado = function (t) {
        return t && $scope.resaltar == t._id;
    };
    $scope.ver = function(t) {
        $location.url('/orm/reuniones/' + t._id);
    };
    $scope.prender = function(t) {
        t.apagado = false;
        t.$save();
    };
    $scope.apagar = function(t) {
        t.apagado = true;
        t.$save();
    };
    $scope.modificar = function() {
        $modal({template: '/views/orm/calendario/cards/apagaReunion.html', persist: true, show: true, scope: $scope.$new()});
    };
})
.controller('ORMCalendarioTabEventoCtrl', function($scope, ORMInstanciaReunion, $location, ORMReunion, $rootScope) {
    $scope.guardarCambios2 = function() {
        angular.extend(new ORMInstanciaReunion($scope.instancia), {
            suspendida: $scope.live.suspendida,
            comentarios: $scope.live.comentarios
        }).$save(function() {
            $scope.applyChanges();
        });
    };
    
    $scope.meses=["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
    $scope.retornarMes=function(mes)
    {
        return $scope.meses[parseInt(mes)-1];
    };
    $scope.retornarHoraMenosTres=function(hora)
    {
        return (parseInt(hora.substring(11,14))-3);
    };
    
    /*$scope.ultimaFechaModificacion=$scope.instancia.fechaModificacion.substring(8,10)+" de "+
        $scope.meses[parseInt($scope.instancia.fechaModificacion.substring(5,10))]+
        " a las "+$scope.instancia.fechaModificacion.substring(11,19);*/
    
    $scope.$watch('reunion.nombre', function(i) {
        if ($scope.reunion) {
            if ($scope.reunion.nombre.length < 38) {
              $scope.set_size = {'font-size': '20px'};
            }
            else {
              $scope.set_size = {'font-size': '15px'};
            }
        }
    }, true);
    
    $scope.enviarCita = function() {
        $location.url('/orm/cita/' + $scope.instanciaSeleccionada);
    };
	
    $scope.aMilisegundos = function(fecha, hora) {
        var fechaDividida = fecha.split("/");
        var horaDividida = hora.split(":");
        var date = new Date(fechaDividida[2], fechaDividida[1] - 1, fechaDividida[0], horaDividida[0], horaDividida[1], 0, 0);
        return date.getTime();
    };
    
    $scope.guardarCambios = function() {
        var i = ORMInstanciaReunion.findById({
            _id: $scope.live._id
        }, function() {
            angular.extend(i, {
                ubicacion: $scope.live.ubicacion,
                subtitulo: $scope.live.subtitulo,
                fecha: $scope.instancia.fecha,
                desdeDate: $scope.aMilisegundos($scope.instancia.fecha, i.desdeHora),
                hastaDate: $scope.aMilisegundos($scope.instancia.fecha, i.hastaHora),
                usuarioModificacion: $scope.username,
                fechaModificacion: new Date(),
                soporte: $scope.live.soporte
            });
            i.$save(function() {
                angular.extend($scope.instancia, {
                    ubicacion: $scope.live.ubicacion,
                    subtitulo: $scope.live.subtitulo,
                    fecha: $scope.instancia.fecha,
                    desdeDate: $scope.aMilisegundos($scope.instancia.fecha, i.desdeHora),
                    hastaDate: $scope.aMilisegundos($scope.instancia.fecha, i.hastaHora),
                    usuarioModificacion: $scope.username,
                    fechaModificacion: new Date(),
                    soporte: $scope.live.soporte
                });
                $scope.$emit('recargar-reuniones');
                $scope.$emit('edit-stoped');
                $scope.editando = false;
                $scope.mailSoporte($scope.instancia);
            });
        });
    };
    
    $scope.$on('start-edit', function(event, accept) {
        $scope.editando = true;
    });
    
    $scope.$on('stop-edit', function(event, accept) {
        $scope.editando = false;
    });
    
    $scope.ubicacion = function(confirmado) {
        if (confirmado) {
            $scope.instancia.$save();
        }
        else {
            $("#agregarUbicacion").modal('show');
        }
    };
    
    $scope.estadoReunion = function(confirmado) {
        if (confirmado) {
            $scope.instancia.$save();
        }
        else {
            $("#comentarioGestion").modal('show');
        }
    };
    
    $scope.cantidadExclusivos = function() {
        var exclusivos = [];
        if ($scope.reunion) {
            if ($scope.reunion.participantes) {
                angular.forEach($scope.reunion.participantes, function (p){
    
                    if (p.clasificacion == 'exclusivo') {
                        exclusivos.push(p);
                    }
                });
            }
        }
        if (exclusivos.length > 0) {
            return exclusivos.length;
        } else {
            return 0;
        }
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
})
.controller('ORMCalendarioMinutaCtrl', function ($scope, $location, $modal, ORMInstanciaReunion) {
    $scope.abrir = function () {
        $location.url('/orm/reuniones/' + $scope.instanciaSeleccionada + '/minuta');
    };
    
    $scope.imprimirAnterior = function (estaInstancia) {
        var insta = {
            desdeDate : 0,
            id : ""
        };
        var instanciasViejas = ORMInstanciaReunion.query({
            reunion : estaInstancia.reunion
        }, function() {
            instanciasViejas.forEach(function(i) {
                if ((i.desdeDate > insta.desdeDate) && (i.desdeDate < estaInstancia.desdeDate)) {
                    insta.desdeDate = i.desdeDate;
                    insta.id = i._id;
                }
            });
            if (insta.id !== "") {
                $location.url('/orm/minutas/' + insta.id + '/print');
            } else {
                alert("No hay reunion previa");
            }
        });
    };
    
    $scope.editarAnterior = function (estaInstancia) {
        var insta = {
            desdeDate : 0,
            id : ""
        };
        var instanciasViejas = ORMInstanciaReunion.query({
            reunion : estaInstancia.reunion
        }, function() {
            instanciasViejas.forEach(function(i) {
                if ((i.desdeDate > insta.desdeDate) && (i.desdeDate < estaInstancia.desdeDate)) {
                    insta.desdeDate = i.desdeDate;
                    insta.id = i._id;
                }
            });
            if (insta.id !== "") {
                $location.url('/orm/reuniones/' + insta.id + '/minuta');
            } else {
                alert("No hay reunion previa");
            }
        });
    };
    
})
.controller('ORMCalendarioTemarioCtrl', function($scope, ORMTemario, ORMTema, $location, $modal) {
    $scope.editarTemario = function() {
        $location.url('/orm/temarios/' + $scope.instanciaSeleccionada);
    };
    
    $scope.temas = ORMTema.query();
    
    $scope.$watch('instanciaSeleccionada', function(i) {
        $scope.temario = ORMTemario.get({
            instancia: i
        });
    }, true);
    
    $scope.mostrarTema = function (r) {
        if (r.eliminado) {
            return false; 
        } else {
            return true;
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
    
    $scope.verTemario = function(idInstancia) {
        $scope.temario = ORMTemario.get({
            instancia: idInstancia
        });
        $modal({template: '/views/orm/temario/temarioModal.html', persist: true, show: true, scope: $scope.$new()});
    };
});