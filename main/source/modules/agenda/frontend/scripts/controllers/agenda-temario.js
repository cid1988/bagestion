angular.module('bag2.agenda.temario',[])
.controller('AgendaTemarioNavbarCtrl', function($scope, $rootScope) {
    $scope.mostrarEnviar=function()
    {
        $rootScope.$broadcast('enviar-Mail');
        $scope.mostrarme=true;
    };
    $scope.$on('cancelar-Envio', function() {
        $scope.mostrarme = false;
    });
    
    $scope.editar = function() {
        $rootScope.$broadcast('start-edit');
    };
    $scope.$on('edit-started', function() {
        $scope.editando = true;
    });
    
    $scope.cerrarEditar = function() {
        $rootScope.$broadcast('stop-edit');
    };
    
    $scope.$on('edit-stopped', function() {
        $scope.editando = false;
    });
    
    $scope.$on('mostrar-enviar-temario', function(event, mostrar) {
        $scope.mostrarEnviarTemario = mostrar;
    });

    $scope.enviar = function() {
        $rootScope.$broadcast('enviar-temario', 'final');
    };
    
    $scope.enviarPropuesta = function() {
        $rootScope.$broadcast('enviar-temario', 'propuesta');
    };
}).controller('AgendaTemarioCtrl', function($rootScope, $scope, ORMColoresPorTipo, $routeParams, AgendaTemario, AgendaInstancia, Agenda, $modal, $window) {
    $scope.cancelacion = "";
    $rootScope.$on('start-edit', function() {
        $rootScope.$broadcast('edit-started');
        $scope.editando = true;
    });
    $scope.$on('enviar-Mail', function() {
        $scope.enviando = !$scope.enviando;
    });
    $scope.enviando = false;
    $scope.instancia = AgendaInstancia.get({
        _id: $routeParams._id
    });
    
    $rootScope.$on('stop-edit', function() {
        $rootScope.$broadcast('edit-stopped');
        $scope.editando = false;
    });
    
    $rootScope.$on('cancel-temario', function() {
        $rootScope.$broadcast('cancelar-temario', true);
    });
    
    var temarios = AgendaTemario.list({
        instancia: $routeParams._id
    }, function() {
        if (temarios.length > 0) {
            $scope.temario = temarios[0];
        } else {
            $scope.temario = new AgendaTemario({
                instancia: $routeParams._id,
                tipoTemario: 'propuesta',
                html: '',
                prioridades: []
            });
        }
    });
    
    $scope.imprimir = function () {
        $window.print(); 
    };

    $scope.instancia = AgendaInstancia.findById({
        _id: $routeParams._id
    }, function() {
        $scope.fechaDesde = new Date($scope.instancia.desdeDate).format('dd/mm/yyyy');
        $scope.horaDesde = new Date($scope.instancia.desdeDate).format('H:MM');
        $scope.horaHasta = new Date($scope.instancia.hastaDate).format('H:MM');
        $scope.agenda = Agenda.findById({
            _id: $scope.instancia.agenda
        }, function(){
            if ($scope.agenda.nombre.length < 41) {
              $scope.set_size = {'font-size': '25px'};
            }
            else {
              $scope.set_size = {'font-size': '20px'};
            }
        });
        
        var fecha = new Date($scope.instancia.desdeDate);
        if (fecha.getMinutes() === 0) {
            $scope.hora = fecha.getHours() + ":00";
        } else {
            $scope.hora = fecha.getHours() + ":" + fecha.getMinutes();
        }
        var fecha2 = new Date($scope.instancia.hastaDate);
        if (fecha2.getMinutes() === 0) {
            $scope.hora2 = fecha2.getHours() + ":00";
        } else {
            $scope.hora2 = fecha2.getHours() + ":" + fecha2.getMinutes();
        }
    });
    
    $scope.cancelar = function() {
        $rootScope.$broadcast('cancel-temario');
    };
    
})
.controller('AgendaNotaTemarioCtrl', function($scope, $window, ORMOrganigrama, Agenda, $routeParams, AgendaTemario,AgendaInstancia,$http,$location, $rootScope) {
    
    $scope.cancelarCambios = function() {
        $scope.html = $scope.$eval('temario.html');
        $scope.cambios = false;
    };
    
    $scope.jurisdicciones = ORMOrganigrama.query();
    
    var restarDias = function (fecha){
        var days = $scope.fechaProx.getDay();
        var tiempo = fecha.getTime();
        if (days == 0) {
            var milisegundos = 0;
        } else {
            var milisegundos = ((days-1)*24*60*60*1000);
        }
        var total = new Date(tiempo-milisegundos);
        var day=total.getDate();
        var month=total.getMonth()+1;
        var year=total.getFullYear();
    
        return (day+"/"+month+"/"+year);
    };
    
    $scope.jurisdiccionPorId = function (id) {
      for (var i = 0; i < $scope.jurisdicciones.length; i++) {
          if ($scope.jurisdicciones[i]._id == id)
          {
              return $scope.jurisdicciones[i];
          }
      }  
    };

    $scope.$on('html-changed', function() {
        $scope.cambios = true;
    });
    
    $scope.imprimir = function () {
        $window.print(); 
    };

    // si cambia la instancia, actualizamos el html
    $scope.$watch('temario', $scope.cancelarCambios);

    // al guardar la nota, sólo vamos a cambiar el html
    $scope.guardarNota = function() {
        if ($scope.temario) {
            var f = new Date();
            if (f.getMinutes() < 10) {
                var minutos = "0" + f.getMinutes();
            } else {
                var minutos = f.getMinutes();
            }
            $scope.temario.fecha = (f.getDate() + "/" + (f.getMonth() +1) + "/" + f.getFullYear() + " - " + f.getHours() + ":" + minutos);
            $scope.temario.usuario = $scope.username;
            $scope.temario.html = $scope.html;
            $scope.temario.$save(function() {
                $scope.cambios = false;
            });
        }
    };
}).controller('AgendaEnvioTemarioCtrl', function($scope, Contactos, $window, ORMOrganigrama, Agenda, $routeParams, AgendaTemario,AgendaInstancia,$http,$location, $rootScope) {
    $scope.uploadedFile = [];
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
    
    $scope.cancelarEnvio=function()
    {
        $rootScope.$broadcast('enviar-Mail');
        $rootScope.$broadcast('cancelar-Envio');
    };
    
    $scope.contactos = Contactos.listar(function()
    {
        $scope.instancia = AgendaInstancia.get({'_id': $routeParams._id},function()
        {
            $scope.agenda=Agenda.get({'_id':$scope.instancia.agenda});
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
        });
    });
    
    
    $scope.enviarTemario=function()
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
        
        $scope.mensajeDeCorreo=$scope.temario.html+"<br>- "+$scope.temario.usuario+" ("+$scope.temario.fecha+")";
        var adjunto="";
        if ($scope.uploadedFile.length)
        {
            adjunto = "/uploads/" + $scope.uploadedFile.shift().id;
        } 

        var eleccion = confirm("¿Desea enviar el correo?");
        if (eleccion == true) 
        {
            var payload = {
                asunto: "Temario de "+$scope.agenda.nombre,
                para: $scope.para,
                mensajeHtml: "<div class='mailwrapper'>"+$scope.mensajeDeCorreo+"</div>",      
                from : emisor,
                adjunto: adjunto
            };
            $http.post('/api/agenda/temario-enviar-mail', payload).success(function() {
            }).error(function() {
                alert("Fallo el envio");
            });
            $location.url('/agenda');
        } 
    };
}).controller('AgendaListaTemariosCtrl', function($rootScope, throttle, trackState, $scope, AgendaTemario, AgendaInstancia, Agenda, $modal, $window) {
    $scope.filtro = "";
    $scope.filtro2 = "";
    
    var throttledFiltro = throttle(5000, function () {
        trackState($scope.filtro);
    });
    var agendasPorId = $scope.agendasPorId = {};
    var instanciasPorId = $scope.instanciasPorId = {};
    
    $scope.$watch('filtro', function () {
        if ($scope.filtro !== "") {
            throttledFiltro();
        }
    }, true);
    
    var throttledFiltro2 = throttle(5000, function () {
        trackState($scope.filtro2);
    });
    
    $scope.$watch('filtro2', function () {
        if ($scope.filtro2 !== "") {
            throttledFiltro2();
        }
    }, true);
    
    $scope.temarios = AgendaTemario.query();
    var  hoy = new Date();
    hoy = hoy.getTime() - 28800000;
    
    $scope.agendas = Agenda.query({usuario: $scope.username}, function() {
        $scope.agendas.forEach(function(r) {
            agendasPorId[r._id] = r;
        });

        $scope.agendaPorId = function (id) {
          for (var i = 0; i < $scope.agendas.length; i++) {
              if ($scope.agendas[i]._id == id)
              {
                  return $scope.agendas[i];
              }
          }  
        };
        
        $scope.instancias = AgendaInstancia.query({
        $and:JSON.stringify([
            {desdeDate:{$gte: hoy}},
            {usuario: $scope.username}
        ])}, function() {
            $scope.instancias.forEach(function(i) {
                // la guardamos en el diccionario
                instanciasPorId[i._id] = i;
            });
        });
    });
    
    $scope.orden = 'desdeDate';
    $scope.tieneTemario = function(idInstancia) {
        for (var i = 0; i < $scope.temarios.length; i++) {
            if ($scope.temarios[i].instancia == idInstancia)
            {
                return true;
            }
        }  
        return false;
    };
    
    $scope.permiso = function () {
        return true;
    };
    
    $scope.cortar = function(fechaNueva) {
        if ($scope.fechaVieja) {
            var v = (new Date($scope.fechaVieja)).getDay();
            var n = (new Date(fechaNueva)).getDay();
            if (n < v) {
                //alert(n + " - " + v);
                $scope.fechaVieja = fechaNueva;
                return true;
            } else {
                $scope.fechaVieja = fechaNueva;
                return false;
            }
        } else {
            $scope.fechaVieja = fechaNueva;
            return false;
        }
    };
    
    $scope.noTieneTemario = function(idInstancia) {
        for (var i = 0; i < $scope.temarios.length; i++) {
            if ($scope.temarios[i].instancia == idInstancia)
            {
                return false;
            }
        }  
        return true;
    };
    
    $scope.imprimir = function () {
        $window.print(); 
    };
    
    $scope.agendaPorId = function (id) {
        for (var i = 0; i < $scope.agendas.length; i++) {
            if ($scope.agendas[i]._id == id)
            {
                return $scope.agendas[i];
            }
        }  
    };
    
}).controller('AgendaHistoricoCtrl', function($rootScope, $scope, AgendaTemario, AgendaMinuta, AgendaInstancia, ORMOrganigrama, Agenda, $modal, $window) {
    $scope.filtro2 = "";
    $scope.temarios = AgendaTemario.query();
    $scope.minutas = AgendaMinuta.query();
    var  hoy = new Date();
    hoy = hoy.getTime() - 28800000;
    $scope.jurisdicciones = ORMOrganigrama.query();
    $scope.orden = 'desdeDate';
    $scope.tablaJurisdicciones = [];
    
    var agendasPorId = $scope.agendasPorId = {};
    var instanciasPorId = $scope.instanciasPorId = {};
    
    $scope.agendas = Agenda.query({usuario: $scope.username}, function() {
        $scope.agendas.forEach(function(r) {
            agendasPorId[r._id] = r;
        });

        $scope.agendaPorId = function (id) {
              if (agendasPorId[id])
              {
                  return agendasPorId[id];
              } else {
                  return " ";
              }
        };
        
        $scope.instancias = AgendaInstancia.query({
        $and:JSON.stringify([
            {desdeDate:{$lt: hoy}},
            {usuario: $scope.username}
        ])}, function() {
            $scope.instancias.forEach(function(i) {
                // la guardamos en el diccionario
                instanciasPorId[i._id] = i;
            });
        });
    });
    
    $scope.myValueFunction = function(juris) {
        return $scope.jurisdiccionOrdenPorId(juris);
    };
    
    $scope.tieneTemario = function(idInstancia) {
        for (var i = 0; i < $scope.temarios.length; i++) {
            if ($scope.temarios[i].instancia == idInstancia)
            {
                return true;
            }
        }  
        return false;
    };
    
    $scope.compromisosCant = function(idInstancia) {
        for (var i = 0; i < $scope.minutas.length; i++) {
            if ($scope.minutas[i].instancia == idInstancia)
            {
                if ($scope.minutas[i].compromisos) {
                    return $scope.minutas[i].compromisos.length;
                }
            }
        }  
        return 0;
    };
    
    $scope.cortar = function(fechaNueva) {
        if ($scope.fechaVieja) {
            var v = (new Date($scope.fechaVieja)).getDay();
            var n = (new Date(fechaNueva)).getDay();
            if (n < v) {
                //alert(n + " - " + v);
                $scope.fechaVieja = fechaNueva;
                return true;
            } else {
                $scope.fechaVieja = fechaNueva;
                return false;
            }
        } else {
            $scope.fechaVieja = fechaNueva;
            return false;
        }
    };
    
    $scope.noTieneTemario = function(idInstancia) {
        for (var i = 0; i < $scope.temarios.length; i++) {
            if ($scope.temarios[i].instancia == idInstancia)
            {
                return false;
            }
        }  
        return true;
    };
    
    $scope.imprimir = function () {
        $window.print(); 
    };
    
    $scope.agendaPorId = function (id) {
        for (var i = 0; i < $scope.agendas.length; i++) {
            if ($scope.agendas[i]._id == id)
            {
                return $scope.agendas[i];
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
});