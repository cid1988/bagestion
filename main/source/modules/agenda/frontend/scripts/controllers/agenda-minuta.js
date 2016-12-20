angular.module('bag2.agenda.minuta', [])
.controller('AgendaMinutaNavbarCtrl', function($scope, $rootScope) {
    $scope.editar = function() {
        $rootScope.$broadcast('start-edit');
    };
    
    $scope.comenzarEnvio=function()
    {
        $rootScope.$broadcast('start-enviar');
        $scope.mostrarme=true;
    };
    $scope.$on('cancelar-Envio', function() {
        $scope.mostrarme = false;
    });
    $scope.$on('edit-started', function() {
        $scope.editando = true;
    });
    
    $scope.cerrarEditar = function() {
        $rootScope.$broadcast('stop-edit');
    };
    
    $scope.$on('edit-stopped', function() {
        $scope.editando = false;
    });
}).controller('AgendaMinutaCtrl', function($rootScope, $scope, ORMColoresPorTipo, $routeParams, AgendaMinuta, ORMOrganigrama, AgendaInstancia, Contactos, Agenda, ORMTema, $modal, $window) {
    $scope.cancelacion = "";
    
    $rootScope.$on('start-edit', function() {
        $rootScope.$broadcast('edit-started');
        $scope.editando = true;
    });
    
    $rootScope.$on('stop-edit', function() {
        $rootScope.$broadcast('edit-stopped');
        $scope.editando = false;
    });
    
    $rootScope.$on('cancel-minuta', function() {
        $rootScope.$broadcast('cancelar-minuta', true);
    });
    
    $scope.contactoPorId = function (id) {
      for (var i = 0; i < $scope.contactos.length; i++) {
          if ($scope.contactos[i]._id == id)
          {
              return $scope.contactos[i];
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
    
    $scope.temaSuperiorPorId = function (id) {
        if ($scope.temaPorId(id).temaSuperior) {
          return $scope.temaPorId($scope.temaPorId(id).temaSuperior).nombre + " - ";
        } else {
            return "";
        }
    };
    
    $scope.siglaPorId = function (id) {
      for (var i = 0; i < $scope.jurisdicciones.length; i++) {
          if ($scope.jurisdicciones[i]._id == $scope.contactoPorId(id).organigrama)
          {
              return $scope.jurisdicciones[i];
          }
      }  
    };
    
    $scope.agregarCompromiso = function(confirmado, data) {
        if (confirmado) {
            var f = new Date();
            if (f.getMinutes() < 10) {
                var minutos = "0" + f.getMinutes();
            } else {
                var minutos = f.getMinutes();
            }
            $scope.minuta.compromisos.push(data);
            $scope.minuta.fecha = (f.getDate() + "/" + (f.getMonth() +1) + "/" + f.getFullYear() + " - " + f.getHours() + ":" + minutos);
            $scope.minuta.usuario = $scope.username;
            $scope.minuta.tipoMinuta = "final";
            $scope.minuta.$save();
            $scope.agregarComentario=false;
        }
        else {
            if (!$scope.minuta.compromisos){
                $scope.minuta.compromisos = [];
            }

            $scope.data = {
                tarea: '',
                estado: '',
                responsables: [],
                fecha:undefined
            };
            
            $scope.responsable = "";
            
            $scope.agregarComentario=true;
        }
    };
    
    $scope.subir = function (c) {
      var posicion = $scope.minuta.compromisos.indexOf(c);
      if (posicion > 0) {
          $scope.minuta.compromisos.splice(posicion, 1);
          $scope.minuta.compromisos.splice(posicion - 1,0,c);
          $scope.minuta.$save();
      }
    };
    
    $scope.bajar = function (c) {
      var posicion = $scope.minuta.compromisos.indexOf(c);
      if (posicion < ($scope.minuta.compromisos.length - 2)) {
          $scope.minuta.compromisos.splice(posicion, 1);
          $scope.minuta.compromisos.splice(posicion + 1,0,c);
          $scope.minuta.$save();
      }
    };
    
    $scope.editarCompro = function (confirmado, c, c2) {
        if (confirmado) {
            $scope.minuta.$save();
        }
        else {
            if (!c.estado) {
                c.estado = "";
            }
            var modalScope = $scope.$new();
            
            modalScope.data = c;
            
            $modal({template: '/views/agenda/minuta/cards/editarCompro.html', persist: true, show: true, backdrop: 'static', scope: modalScope});
        }
    };
    
    $scope.agregarResponsable = function(array, responsable) {
        if (array) {
            array.push(responsable);
            responsable = "";
        }
    };
    
    $scope.eliminarElemento = function(array,elemento) {
        var indice = array.indexOf(elemento);
        if(indice!=-1) array.splice(indice, 1);
        $scope.minuta.$save();
    };
    
    $scope.temas = ORMTema.query();
    $scope.contactos = Contactos.listar();
    $scope.jurisdicciones = ORMOrganigrama.query();
    
    var minutas = AgendaMinuta.list({
        instancia: $routeParams._id
    }, function() {
        if (minutas.length > 0) {
            $scope.minuta = minutas[0];
        } else {
            $scope.minuta = new AgendaMinuta({
                instancia: $routeParams._id,
                html: '',
                compromisos: []
            });
        }
    });
    
    $scope.mostrarTema = function (r) {
        if (r.eliminado) {
            return false; 
        } else {
            return true;
        }
    };
    
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
        $rootScope.$broadcast('cancel-minuta');
    };
    
    
    $scope.temaPorId = function (id) {
      for (var i = 0; i < $scope.temas.length; i++) {
          if ($scope.temas[i]._id == id)
          {
              return $scope.temas[i];
          }
      }  
    };
    
})
.controller('AgendaNotaMinutaCtrl', function($scope, $window, ORMOrganigrama, Agenda, $rootScope,$http,ORMReunion,$location,Contactos) {
    $scope.cancelarCambios = function() {
        $scope.html = $scope.$eval('minuta.html');
        $scope.cambios = false;
    };
    $scope.$on('start-enviar', function() {
        $scope.enviado = !$scope.enviado;
    });
    
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
    
    $scope.siglaPorId = function (id) {
      for (var i = 0; i < $scope.jurisdicciones.length; i++) {
          if ($scope.jurisdicciones[i]._id == $scope.contactoPorId(id).organigrama)
          {
              return $scope.jurisdicciones[i];
          }
      }  
    };
    
    $scope.cancelarEnvio=function()
    {
        $rootScope.$broadcast('cancelar-Envio');
        $scope.enviado = !$scope.enviado;
    };
    $scope.encabezado = "<h4>Estimados. A continuación les pasamos las tareas comprometidas en la reunión de hoy. Algunos de estos temas pueden entrar en los próximos temarios. Próxima reunión prevista dentro de 4 semanas.</h4>";
    
    $scope.contactos = Contactos.listar(function()
    {
        $scope.enviado=false;
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
    
    $scope.jurisdicciones = ORMOrganigrama.query();

    $scope.algo="<table border='1' style='margin-left: 0px;margin-right: 10px;margin-top: 10px;font-size: 14px !important;'><tr bgcolor= '#FFFFFF'><th>Tareas Comprometidas</th><th>Nombre y Apellido</th><th>Área / Cargo</th><th>Fecha</th></tr>";

    $scope.uploadedFile = [];
    $scope.enviar=function()
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
        
        $scope.armarEmailCompromiso();
        var adjunto="";
        var eleccion = confirm("¿Desea enviar el correo?");
        if (eleccion == true) 
        {
            var payload = {
                asunto: "Compromisos de Reunion de Seguimiento - "+$scope.agenda.nombre,
                para: $scope.para,          
                mensajeHtml: "<div class='mailwrapper'>"+$scope.encabezado+$scope.algo+"</div>",      
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
    $scope.reunion = ORMReunion.findById({_id: $scope.instancia.reunion});
    $scope.armarEmailCompromiso = function() {
        for (var i = 0; i < $scope.minuta.compromisos.length; i++) {
            $scope.algo += "<tr bgcolor= '#FFFFFF'><td><div>";
            if ($scope.minuta.compromisos[i].tema) {
                $scope.algo +="<b>" + $scope.temaNombrePorId($scope.minuta.compromisos[i]) + "</b> <br>" + $scope.minuta.compromisos[i].tarea + "</div></td><td>";
            } else if ($scope.minuta.compromisos[i].titulo) {
                $scope.algo += "<b>" + $scope.minuta.compromisos[i].titulo + "</b> <br>" + $scope.minuta.compromisos[i].tarea + "</div></td><td>";
            } else {
                $scope.algo += $scope.minuta.compromisos[i].tarea + "</div></td><td>";
            }
            if ($scope.minuta.compromisos[i].responsables) {
                for (var j = 0; j < $scope.minuta.compromisos[i].responsables.length; j++) {
                    if ($scope.minuta.compromisos[i].responsables[j]) {
                        $scope.algo += "<div style='margin-top: 0px; margin-bottom: 0px'>" + $scope.contactoPorId($scope.minuta.compromisos[i].responsables[j]).apellidos + " " + $scope.contactoPorId($scope.minuta.compromisos[i].responsables[j]).nombre + "<br></div>";
                    }
                }
            }
            $scope.algo += "</td><td>";
            if ($scope.minuta.compromisos[i].responsables) {
                for (var h = 0; h < $scope.minuta.compromisos[i].responsables.length; h++) {
                    if ($scope.minuta.compromisos[i].responsables[h]) {
                        if ($scope.siglaPorId($scope.minuta.compromisos[i].responsables[h])) {
                            if ($scope.siglaPorId($scope.minuta.compromisos[i].responsables[h]).sigla) {
                                $scope.algo += "<div style='margin-top: 0px; margin-bottom: 0px'>" + $scope.siglaPorId($scope.minuta.compromisos[i].responsables[h]).sigla + "<br></div>";
                            }
                        }
                    }
                }
            }
            $scope.algo += "</td><td><div>";
            if ($scope.minuta.compromisos[i].fecha) {
                $scope.algo += $scope.minuta.compromisos[i].fecha + "</div></td></tr>";
            } else {
                $scope.algo += " </div></td></tr>";
            }
        }
        $scope.algo +="</table><br><br><div style='text-align:right;'>- " + $scope.minuta.usuario + " (" + $scope.minuta.fecha + ")</div><br><br>";
        if ($scope.reunion.asistenteMinuta) {
            $scope.algo += $scope.contactoPorId($scope.reunion.asistenteMinuta).apellidos + " " + $scope.contactoPorId($scope.reunion.asistenteMinuta).nombre + "<br>DG de Control de Gestión<br>Subsecretaría de Planeamiento y Control de Gestión<br>Jefatura de Gabinete de Ministros - GCABA";
        }
    };
    
    $scope.temaNombrePorId = function (compromiso) {
        if (compromiso.tema) {
          for (var i = 0; i < $scope.temas.length; i++) {
              if ($scope.temas[i]._id == compromiso.tema)
              {
                  return $scope.temas[i].nombre;
              }
          }  
        } else {
            return compromiso.titulo;
        }
    };
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
    
    var agenda = Agenda.get({_id : $scope.instancia.agenda});
    
    $scope.jurisdiccionPorId = function (id) {
      for (var i = 0; i < $scope.jurisdicciones.length; i++) {
          if ($scope.jurisdicciones[i]._id == id)
          {
              return $scope.jurisdicciones[i];
          }
      }  
    };
    $scope.contactoNombrePorId = function (responsables) {
      for (var i = 0; i < $scope.contactos.length; i++) {
          if ($scope.contactos[i]._id == responsables[0])
          {
              return ($scope.contactos[i].apellidos + " " + $scope.contactos[i].nombre);
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
    
    $scope.$on('mostrar-enviar-minuta', function(event, mostrar) {
        $scope.mostrarEnviarMinuta = mostrar;
    });

    $scope.$on('html-changed', function() {
        $scope.cambios = true;
    });
    
    $scope.imprimir = function () {
        $window.print(); 
    };

    // si cambia la instancia, actualizamos el html
    $scope.$watch('minuta', $scope.cancelarCambios);

    // al guardar la nota, sólo vamos a cambiar el html
    $scope.guardarNota = function() {
        if ($scope.minuta) {
            var f = new Date();
            if (f.getMinutes() < 10) {
                var minutos = "0" + f.getMinutes();
            } else {
                var minutos = f.getMinutes();
            }
            $scope.minuta.fecha = (f.getDate() + "/" + (f.getMonth() +1) + "/" + f.getFullYear() + " - " + f.getHours() + ":" + minutos);
            $scope.minuta.usuario = $scope.username;
            $scope.minuta.html = $scope.html;
            $scope.minuta.tipoMinuta = "final";
            $scope.minuta.$save(function() {
                $scope.cambios = false;
            });
        }
    };
})
.controller('AgendaListaCompromisosCtrl', function($scope, $window, throttle, trackState, ORMOrganigrama, Agenda, ORMTema, Contactos, AgendaMinuta, AgendaInstancia) {
    $scope.hoy = new Date().getTime() - 80000000;
    $scope.filtro = "";
    $scope.todosEstados = false;
    $scope.estadoCumplido = false;
    $scope.estadoVencido = false;
    $scope.estadoVigente = true;
    $scope.estadoATema = false;
    $scope.contactos = Contactos.listar(); 
    $scope.orden = 'fechaMili';
    $scope.temas = ORMTema.query();
    $scope.compromisos = [];
    $scope.filtroRespon = "";
    
    var agendasPorId = $scope.agendasPorId = {};
    var instanciasPorId = $scope.instanciasPorId = {};
    
    var throttledFiltro = throttle(5000, function () {
        trackState($scope.filtro);
    });
    
    $scope.$watch('filtro', function () {
        if ($scope.filtro !== "") {
            throttledFiltro();
        }
    }, true);
    $scope.contactoPorId = function (id) {
      for (var i = 0; i < $scope.contactos.length; i++) {
          if ($scope.contactos[i]._id == id)
          {
              return $scope.contactos[i];
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
    $scope.temaPorId = function (id) {
      for (var i = 0; i < $scope.temas.length; i++) {
          if ($scope.temas[i]._id == id)
          {
              return $scope.temas[i];
          }
      }  
    };  
    $scope.instanciaPorId = function (id) {
      for (var h = 0; h < $scope.instancias.length; h++) {
          if ($scope.instancias[h]._id == id)
          {
              return $scope.instancias[h];
          }
      }  
    };
    $scope.traerDatos = function () {
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
            
            $scope.instancias = AgendaInstancia.query({usuario: $scope.username}, function() {
                $scope.instancias.forEach(function(i) {
                    instanciasPorId[i._id] = i;
                });
                $scope.minutas = AgendaMinuta.query({}, function(){
                    $scope.minutas.forEach(function(m) {
                        m.compromisos.forEach(function(c) {
                            c.fechaMili = new Date(moment(c.fecha,"DD/MM/YYYY").format('MMMM DD YYYY, HH:mm:ss')).getTime();
                            c.minuta = m._id;
                            c.instancia = m.instancia;
                            if ($scope.instanciaPorId(m.instancia)) {
                                c.agenda = $scope.instanciaPorId(m.instancia).agenda;
                            }
                            $scope.compromisos.push(c);
                        });
                    });
                });
            });
        });
    };
    $scope.traerDatos();
    
    $scope.filtroEstados = function (compro) {
        if ($scope.todosEstados === true) {
            return true;
        }
        if (($scope.estadoCumplido === true) && (compro.estado == 'Cumplido')) {
            if ($scope.estadoVigente === false) {
                return true;
            } else if (compro.fechaMili > $scope.hoy) {
                return true;
            }
        }
        if (($scope.estadoATema === true) && (compro.estado == 'A Tema')) {
            return true;
        }
        if (($scope.estadoVencido === true) && (compro.estado === '') && (compro.fechaMili < $scope.hoy)){
            return true;
        }
        if (($scope.estadoVigente === true) && (compro.estado === '') && (compro.fechaMili > $scope.hoy)){
            return true;
        }
        return false;
    };
    
    $scope.filtroResponsables = function (compro) {
        if ($scope.filtroRespon == "") {
            return true;
        } else {
            if (compro.responsables.indexOf($scope.filtroRespon) > -1) {
                return true;
            } else {
                return false;
            }
        }
    };
    
    $scope.cambioEstado = function (compro, estado) {
        var minuta = AgendaMinuta.get({_id : compro.minuta}, function(){
            minuta.compromisos.forEach(function(c) {
                if (c.tarea == compro.tarea) {
                    c.estado = estado;
                    minuta.$save();
                    $scope.compromisos = [];
                    $scope.traerDatos();
                }
            });
        });
    };
    
});

