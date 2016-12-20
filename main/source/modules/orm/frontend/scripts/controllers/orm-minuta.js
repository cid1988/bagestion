angular.module('bag2.orm.minuta', [])
.controller('ORMMinutaNavbarCtrl', function($scope, $rootScope) {
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
    
    $scope.$on('mostrar-enviar-minuta', function(event, mostrar) {
        $scope.mostrarEnviarMinuta = mostrar;
    });
    $scope.enviar = function() {
        $rootScope.$broadcast('enviar-minuta');
    };
}).controller('ORMMinutaCtrl', function($rootScope, $scope, ORMColoresPorTipo, $routeParams, ORMMinuta, ORMOrganigrama, ORMInstanciaReunion, Contactos, ORMReunion, ORMTema, Proyectos, $modal, IDG, $window) {
    $scope.cancelacion = "";
    $scope.uploaded = [];
    $rootScope.$on('start-edit', function() {
        $rootScope.$broadcast('edit-started');
        $scope.editando = true;
    });
    $scope.mostrarAgregar = false;
    $rootScope.$on('stop-edit', function() {
        $rootScope.$broadcast('edit-stopped');
        $scope.editando = false;
    });

    $rootScope.$on('enviar-minuta', function(event) {
        $rootScope.$broadcast('mostrar-enviar-minuta', true);
    });
    
    $scope.retornarfrecunecia=function(frecuencia)
    {
        if(frecuencia=="aPedido")
        {
            return "";
        }
        else
        {
            return "Próxima reunión prevista dentro de "+frecuencia.substring(0,1)+" "+frecuencia.substring(1,frecuencia.length)+".<br/>";
        }
    };
    
    $scope.switchStar = function(compro) {
        if (compro.importante) {
            compro.importante = false;
        } else {
            compro.importante = true;
        }
    };
    
    $rootScope.$on('cancel-minuta', function() {
        $rootScope.$broadcast('cancelar-minuta', true);
    });
    
    $scope.colorReunion = function (r){
        return (ORMColoresPorTipo()[r.tipo] || 'grey');
    };
    
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
            
            $scope.minuta.tipoMinuta = "final";
            $scope.minuta.$save({}, function() {
                $scope.mostrarAgregar = false;
            });
        }
        else {
            $scope.tipo = 'POA';
            $scope.data = {
                tema: '',
                titulo: '',
                tarea: '',
                responsables: [],
                fecha:undefined
            };
            
            $scope.mostrarAgregar = true;
        }
    };
    
    $scope.noMostrarAgregar = function() {
        $scope.mostrarAgregar = false;
    };
    
    $scope.eliminarListaElem = function(elemento, lista) {
        if (confirm("Esta seguro de borrar este elemento?")) {
            elemento.$delete({}, function() {
                $scope.presentaciones = IDG.query({minutaId: $scope.minuta._id});
            });
        }
    };
            
    $scope.agregarPresentacion = function(confirmado, data) {
        if (confirmado) {
            if ($scope.uploaded.length) {
                $scope.presentacion.archivoId = $scope.uploaded.shift().id;
                $scope.presentacion.$save({}, function() {
                    $scope.uploaded = [];
                    $scope.presentaciones = IDG.query({minutaId: $scope.minuta._id});
                    $scope.minuta.presentaciones = true;
                    $scope.minuta.$save();
                });
            } else {
                alert("No cargo ningun archivo");
            }
        }
        else {
            $scope.minuta.$save({}, function() {
                $scope.presentacion = new IDG({
                    nombre: '',
                    descripcion: '',
                    tipo: '',
                    autor: '',
                    tags: '',
                    referente: '',
                    tema: '',
                    jurisdiccion: $scope.reunion.jurisdiccion || "",
                    minutaId: $scope.minuta._id,
                    fecha:undefined,
                    vencimiento:undefined
                });
                $scope.uploaded = [];
                $modal({template: '/views/orm/minuta/cards/agregarPresen.html', persist: true, show: true, backdrop: 'static', scope: $scope});
            });
            
        }
    };
            
    $scope.editarPresentacion = function(confirmado, data) {
        if (confirmado) {
            $scope.presentacion.$save();
        }
        else {
            $scope.presentacion = data;
            $modal({template: '/views/orm/minuta/cards/editarPresen.html', persist: true, show: true, backdrop: 'static', scope: $scope});
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
            
            $modal({template: '/views/orm/minuta/cards/editarCompro.html', persist: true, show: true, backdrop: 'static', scope: modalScope});
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
    $scope.proyectos = Proyectos.query();
    $scope.contactos = Contactos.listar();
    $scope.jurisdicciones = ORMOrganigrama.query();
    
    var minutas = ORMMinuta.list({
        instancia: $routeParams._id
    }, function() {
        if (minutas.length > 0) {
            $scope.minuta = minutas[0];
            $scope.presentaciones = IDG.query({minutaId: $scope.minuta._id});
        } else {
            $scope.minuta = new ORMMinuta({
                instancia: $routeParams._id,
                html: '',
                compromisos: []
            });
        }
    });
    
    $scope.imprimir = function () {
        $window.print(); 
    };
    
    $scope.mostrarTema = function (r) {
        if (r.eliminado) {
            return false; 
        } else {
            return true;
        }
    };

    $scope.instancia = ORMInstanciaReunion.findById({
        _id: $routeParams._id
    }, function() {
        $scope.fechaDesde = new Date($scope.instancia.desdeDate).format('dd/mm/yyyy');
        $scope.horaDesde = new Date($scope.instancia.desdeDate).format('H:MM');
        $scope.horaHasta = new Date($scope.instancia.hastaDate).format('H:MM');
        $scope.reunion = ORMReunion.findById({
            _id: $scope.instancia.reunion
        }, function(){
            $scope.encabezado = "<div class='mailwrapper' style='font-size:17px; color:black; line-height:100% !important;'>Estimados,<br/><br/>"+
                "A continuación les pasamos las tareas comprometidas en la reunión de hoy.<br/><br/>"+
                "Algunos de estos temas pueden entrar en los próximos temarios.<br/><br/>"+
                $scope.retornarfrecunecia($scope.reunion.frecuencia);
            if ($scope.reunion.nombre.length < 41) {
              $scope.set_size = {'font-size': '25px'};
            }
            else {
              $scope.set_size = {'font-size': '20px'};
            }
            var idMaestro;
            if ($scope.reunion.tipo == "seguimiento") {
                idMaestro = "5249c2913dacd74127000001";
            } else if ($scope.reunion.tipo == "transversales") {
                idMaestro = "53075d93491f2d02e0d14813";
            } else if ($scope.reunion.tipo == "presupuesto") {
                idMaestro = "53075dc7491f2d02e0d14815";
            } else if ($scope.reunion.tipo == "especificas") {
                idMaestro = "53075d79491f2d02e0d14812";
            } else if ($scope.reunion.tipo == "planeamiento") {
                idMaestro = "53075db4491f2d02e0d14814";
            } else if ($scope.reunion.tipo == "coordinacion") {
                idMaestro = "53075ddc491f2d02e0d14816";
            } else if ($scope.reunion.tipo == "planLargoPlazo") {
                idMaestro = "553f971d41e6232024e2933d";
            } else if ($scope.reunion.tipo == "proyectosEspeciales") {
                idMaestro = "55e472739e8ff113c48a8f19";
            } else if ($scope.reunion.tipo == "eventuales") {
                idMaestro = "5486de0c41e6231858ad5329";
            }
            $scope.maestro = ORMReunion.get({
                _id: idMaestro
            });
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
    
    $scope.proyectoPorId = function (id) {
      for (var i = 0; i < $scope.proyectos.length; i++) {
          if ($scope.proyectos[i]._id == id)
          {
              return $scope.proyectos[i];
          }
      }  
    };
})
.controller('ORMMinutaListaEnvioCtrl', function($scope, $state, ORMInstanciaReunion, ORMMinuta, ORMReunion, ORMOrganigrama, Contactos, $rootScope, ORMContacto, $http) {
    $scope.contactos = Contactos.listar();
    $scope.jurisdicciones = ORMOrganigrama.query();
    $scope.meses = [ "Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic" ];
    $scope.dias = [ "Dom", "Lun", "Mar", "Mie", "Jue", "Vie", "Sab" ];
    $scope.uploadedFile = [];
    
    $scope.filtroFinPara=function(persona){
        if(persona.minuta=="para")
        {
            return true;
        }
        else
        {
            return false;
        }
    };
    $scope.filtroFinCC=function(persona){
        if(persona.minuta=="cc")
        {
            return true;
        }
        else
        {
            return false;
        }
    };
    $scope.filtroFinCCO=function(persona){
        if(persona.minuta=="cco")
        {
            return true;
        }
        else
        {
            return false;
        }
    };
    
    $scope.$on('cancelar-minuta', function(event, mostrar) {
        $scope.version = "cancelado";
        $scope.cancelacion = "Cancelacion - ";
        $scope.mostrarEnviarMinuta = mostrar;
    });
    
    // Cambiamos el asunto del mensaje en función del nombre de la reunión
    $scope.$watch('reunion.nombre', function (n) {
        if ($scope.reunion.tipo == 'seguimiento') {
            $scope.reunionTipo = "de Seguimiento";
        } else if ($scope.reunion.tipo == 'transversales') {
            $scope.reunionTipo = "Transversal";
        } else if ($scope.reunion.tipo == 'especificas') {
            $scope.reunionTipo = "Especifica";
        } else if ($scope.reunion.tipo == 'planeamiento') {
            $scope.reunionTipo = "de Planeamiento";
        } else if ($scope.reunion.tipo == 'presupuesto') {
            $scope.reunionTipo = "de Presupuesto";
        } else if ($scope.reunion.tipo == 'coordinacion') {
            $scope.reunionTipo = "de Coordinacion";
        } else if ($scope.reunion.tipo == 'planLargoPlazo') {
            $scope.reunionTipo = "de Plan Largo Plazo";
        } else if ($scope.reunion.tipo == 'proyectosEspeciales') {
            $scope.reunionTipo = "de Proyectos Especiales";
        }  else if ($scope.reunion.tipo == 'eventuales') {
            $scope.reunionTipo = "Eventual";
        }
        
        $scope.asunto = "Compromisos de Reunion " + $scope.reunionTipo + " - " + $scope.reunion.nombre;
        $scope.asunto = $scope.omitirAcentos($scope.asunto);
    });

    // Escuchamos mostrar-enviar-minuta
    $scope.$on('mostrar-enviar-minuta', function(event, mostrar) {
        $scope.mostrarEnviarMinuta = mostrar;
    });

    $scope.cancelarEnvio = function() {
        if (!$scope.enviando) {
            $rootScope.$broadcast('mostrar-enviar-minuta', false);
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
    
    $scope.siglaPorId = function (id) {
      if ($scope.contactoPorId(id)) {
          var idOrganigrama = $scope.contactoPorId(id).organigrama;
          for (var i = 0; i < $scope.jurisdicciones.length; i++) {
              if ($scope.jurisdicciones[i]._id == idOrganigrama)
              {
                  return $scope.jurisdicciones[i];
              }
          } 
      }
    };
    
    $scope.omitirAcentos = function(text) {
        var acentos = "ÁÉÍÓÚáéíóúÑñ";
        var original = "AEIOUaeiouNn";
        for (var i=0; i<acentos.length; i++) {
            text = text.replace(acentos.charAt(i), original.charAt(i));
        }
        return text;
    };

    // tanto para el 'reset' como para cuando cambia el id de minuta con el que estamos trabajando
    // ($scope.state.current.params._id)
    $scope.traerOriginal = function() {
        $scope.instancia = ORMInstanciaReunion.findById({
            _id: $state.params._id
        }, function () {
            $scope.reunion = ORMReunion.findById({
                _id: $scope.instancia.reunion
            }, function () {
                
                $scope.minuta = ORMMinuta.findById({
                    instancia: $scope.instancia._id
                });
                var idMaestro;
                if ($scope.reunion.tipo == "seguimiento") {
                    idMaestro = "5249c2913dacd74127000001";
                } else if ($scope.reunion.tipo == "transversales") {
                    idMaestro = "53075d93491f2d02e0d14813";
                } else if ($scope.reunion.tipo == "presupuesto") {
                    idMaestro = "53075dc7491f2d02e0d14815";
                } else if ($scope.reunion.tipo == "especificas") {
                    idMaestro = "53075d79491f2d02e0d14812";
                } else if ($scope.reunion.tipo == "planeamiento") {
                    idMaestro = "53075db4491f2d02e0d14814";
                } else if ($scope.reunion.tipo == "coordinacion") {
                    idMaestro = "53075ddc491f2d02e0d14816";
                } else if ($scope.reunion.tipo == "planLargoPlazo") {
                    idMaestro = "553f971d41e6232024e2933d";
                } else if ($scope.reunion.tipo == "proyectosEspeciales") {
                    idMaestro = "55e472739e8ff113c48a8f19";
                } else if ($scope.reunion.tipo == "eventuales") {
                    idMaestro = "5486de0c41e6231858ad5329";
                }
                $scope.maestro = ORMReunion.get({
                    _id: idMaestro
                });
            });
            
        });
    };
    $scope.traerOriginal();

    // hacemos una copia del objeto instancia en nuestro scope local
    $scope.instancia = angular.copy($scope.instancia);

    // si cambia el tipo de minuta, cambiamos la lista que vamos a modificar
    $scope.$watch('minuta.tipoMinuta', function(tipo) {
        $scope.version = tipo;
    });
    
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
    
    $scope.proyectoNombrePorId = function (compromiso) {
        if (compromiso.proyecto) {
          for (var i = 0; i < $scope.proyectos.length; i++) {
              if ($scope.proyectos[i]._id == compromiso.proyecto)
              {
                  return $scope.proyectos[i].nombre;
              }
          }  
        } else {
            return compromiso.titulo;
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
    
    $scope.armarEmailCompromiso = function(nombre, contacto) {
        
        $scope.mailCompromisos = $scope.encabezado + 
        "<table border='1' style='margin-left: 0px;margin-right: 10px;margin-top: 10px;font-size: 14px !important;'>"+
            "<tr bgcolor= '#FFFFFF'>"+
                "<th>Tareas Comprometidas</th>"+
                "<th>Nombre y Apellido</th>"+
                "<th>Área / Cargo</th>"+
                "<th>Fecha</th>"+
            "</tr>";
        if($scope.minuta && $scope.minuta.compromisos)
        {
            for (var i = 0; i < $scope.minuta.compromisos.length; i++) {
                $scope.mailCompromisos = $scope.mailCompromisos + 
                    "<tr bgcolor= '#FFFFFF'>"+
                        "<td>"+
                            "<div>";
                if ($scope.minuta.compromisos[i].tema) {
                        $scope.mailCompromisos = $scope.mailCompromisos + 
                            "<b>" +$scope.temaNombrePorId($scope.minuta.compromisos[i]) + "</b> <br>" +  $scope.minuta.compromisos[i].tarea + 
                        "</div>"+
                    "</td>"+
                    "<td>";
                } else if ($scope.minuta.compromisos[i].titulo) {
                    $scope.mailCompromisos = $scope.mailCompromisos + "<b>" + $scope.minuta.compromisos[i].titulo + "</b> <br>" + $scope.minuta.compromisos[i].tarea + "</div></td><td>";
                } else if ($scope.minuta.compromisos[i].proyecto) {
                    $scope.mailCompromisos = $scope.mailCompromisos + "<b>" + $scope.proyectoNombrePorId($scope.minuta.compromisos[i]) + "</b> <br>" + $scope.minuta.compromisos[i].tarea + "</div></td><td>";
                } else {
                    $scope.mailCompromisos = $scope.mailCompromisos + $scope.minuta.compromisos[i].tarea + "</div></td><td>";
                }
                if ($scope.minuta.compromisos[i].responsables) {
                    for (var j = 0; j < $scope.minuta.compromisos[i].responsables.length; j++) {
                        if ($scope.minuta.compromisos[i].responsables[j]) {
                            $scope.mailCompromisos = $scope.mailCompromisos + "<div style='margin-top: 0px; margin-bottom: 0px'>" + $scope.contactoPorId($scope.minuta.compromisos[i].responsables[j]).apellidos + " " + $scope.contactoPorId($scope.minuta.compromisos[i].responsables[j]).nombre + "<br></div>";
                        }
                    }
                }
                $scope.mailCompromisos = $scope.mailCompromisos + "</td><td>";
                if ($scope.minuta.compromisos[i].responsables) {
                    for (var h = 0; h < $scope.minuta.compromisos[i].responsables.length; h++) {
                        if ($scope.minuta.compromisos[i].responsables[h]) {
                            if ($scope.siglaPorId($scope.minuta.compromisos[i].responsables[h])) {
                                if ($scope.siglaPorId($scope.minuta.compromisos[i].responsables[h]).sigla) {
                                    $scope.mailCompromisos = $scope.mailCompromisos + "<div style='margin-top: 0px; margin-bottom: 0px'>" + $scope.siglaPorId($scope.minuta.compromisos[i].responsables[h]).sigla + "<br></div>";
                                }
                            }
                        }
                    }
                }
                $scope.mailCompromisos = $scope.mailCompromisos + "</td><td><div>";
                if ($scope.minuta.compromisos[i].fecha) {
                    $scope.mailCompromisos = $scope.mailCompromisos + $scope.minuta.compromisos[i].fecha + "</div></td></tr>";
                } else {
                    $scope.mailCompromisos = $scope.mailCompromisos + " </div></td></tr>";
                }
            }
        }
        
        $scope.mailCompromisos=$scope.mailCompromisos+"</table>";
        if ($scope.reunion.asistenteMinuta) {
            $scope.mailCompromisos = $scope.mailCompromisos;
        }
        
    };
    
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
                            return (contacto.apellidos + " " + contacto.nombre + " <" + em.valor + ">");
                        }
                    }
                }
            } 
        }
        return " ";
    };

    $scope.$watch('version', function(version) {
        // estas son las listas de correo que manejamos para el minuta
        var listasPorVersion = {
            'final': 'minuta',
            'cancelado': 'cancelado'
        };
        var textosPorVersion = {
            'final': 'Versión final',
            'cancelado': 'cancelado'
        };

        $scope.lista = listasPorVersion[version];
        $scope.textoVersion = textosPorVersion[version] || 'Sin establecer';
    });
    
    //@Alex: Retorna los mails de un array que contienen el campo filtro igual a valor
    var mails = function(filtro, valor){
        var retornar=[];
        if($scope.instancia.asistencia)
        {
            for(var i=0; i<$scope.instancia.asistencia.length; i++)
            {
                if($scope.instancia.asistencia[i][filtro]==valor)
                {
                    retornar.push({contactoId:$scope.instancia.asistencia[i].contactoId});
                }
            }
        }
        return retornar;
    };

    $scope.enviar = function() {
        $scope.armarEmailCompromiso();
        $scope.enviando = true;
        if (!$scope.instancia.ubicacion) {
            $scope.instancia.ubicacion = {nombre : " "};
        }
        if ($scope.uploadedFile.length) {
            var adjunto = "/uploads/" + $scope.uploadedFile.shift().id;
        } else {
            var adjunto = "";
        }
        if ($scope.instancia.reunion == '531e45b0ee7b07a673df4e68') {
            var payload = {
                asunto: $scope.cancelacion + $scope.asunto,
                para: $scope.reunion.minuta.para,
                cc: $scope.reunion.minuta.cc,
                cco: $scope.reunion.minuta.cco,
                exclusivos: $scope.reunion.minuta.exclusivos,
                minutaId: $scope.minuta._id,
                mensajeHtml: "<div style='font-size: 20px; font-family: Arial; line-height: 120%;padding-top: 15px;padding-left: 5px;border-right-width: 10px;padding-right: 5px;padding-bottom: 10px;background-color: #FFD300;text-align: center;'>"+
                            "<b>" + $scope.cancelacion + $scope.asunto+ "</b>"+
                        "</div><br/><hr/>"+
                        $scope.mailCompromisos+
                        "<br/><br/><b>"+$scope.contactoPorId($scope.reunion.asistenteMinuta).apellidos+" "+$scope.contactoPorId($scope.reunion.asistenteMinuta).nombre+"</b><br/>"+
                        "<b>DG Coordinación de Gestión</b><br/>"+
                        "<b>Secretaría de Planeamiento y Coordinación de Gestión</b><br/>"+
                        "<b>Jefatura de Gabinete de Ministros</b><br/>"+
                        "<b>Tel: + 54 11 5091-7200 Int: 7215</b>"+
                        "</div>",
                principioHtml:  " ",
                finHtml: "",
                adjunto : adjunto,
                version: $scope.version,
                desdeEmail : $scope.buscarCorreo('Email oficial', $scope.contactoPorId($scope.reunion.asistenteMinuta))
            };
        } else {
            var payload = {
                asunto: $scope.cancelacion + $scope.asunto,
                para: (($scope.reunion.minuta || {}).para || []).concat((($scope.maestro.minuta || {}).para || [] ))
                    .concat(mails("minuta","para")),
                cc: (($scope.reunion.minuta || {}).cc || []).concat((($scope.maestro.minuta || {}).cc || [] ))
                    .concat(mails("minuta","cc")),
                cco: (($scope.reunion.minuta || {}).cco || []).concat((($scope.maestro.minuta || {}).cco || [] ))
                    .concat(mails("minuta","cco")),
                exclusivos: (($scope.reunion.minuta || {}).exclusivos || []).concat(($scope.maestro.minuta || {}).exclusivos || []),
                minutaId: $scope.minuta._id,
                mensajeHtml: "<div style='font-size: 20px; font-family: Arial; line-height: 120%;padding-top: 15px;padding-left: 5px;border-right-width: 10px;padding-right: 5px;padding-bottom: 10px;background-color: #FFD300;text-align: center;'>"+
                            "<b>" + $scope.cancelacion + $scope.asunto+ "</b>"+
                        "</div><br/><hr/>"+
                        $scope.mailCompromisos+
                        "<br/><br/><b>"+ ( ($scope.reunion.asistenteMinuta) ? ($scope.contactoPorId($scope.reunion.asistenteMinuta).apellidos+" "+$scope.contactoPorId($scope.reunion.asistenteMinuta).nombre) : ("temarios@buenosaires.gob.ar") )+"</b><br/>"+
                        "<b>DG Coordinación de Gestión</b><br/>"+
                        "<b>Secretaría de Planeamiento y Coordinación de Gestión</b><br/>"+
                        "<b>Jefatura de Gabinete de Ministros</b><br/>"+
                        "<b>Tel: + 54 11 5091-7200 Int: 7215</b></div>"+
                        "</div>",
                principioHtml:  " ",
                finHtml:"",
                adjunto : adjunto,
                version: $scope.version,
                desdeEmail : $scope.buscarCorreo('Email oficial', $scope.contactoPorId($scope.reunion.asistenteMinuta))
            };
        }
        

        for (var pId in $scope.instancia.participantes) {
            var p = $scope.instancia.participantes[pId];

            // equivale a
            // p.minuta que podría tomar de valores: undefined, '', 'para', 'cc'
            if (p[$scope.lista] &&
                payload[p[$scope.lista]]) {
                // lo agregamos a la lista de payload.para o de payload.cc
                payload[p[$scope.lista]].push(pId);
            }
        }
        $http.post('/api/orm/enviar-minuta', payload).success(function() {
            $scope.enviando = false;
            $rootScope.$broadcast('mostrar-enviar-minuta', false);
            if(!$scope.minuta.enviado)
            {
                $scope.minuta.enviado={};
            }
            
            $scope.minuta.enviado.version=payload.version;
            $scope.minuta.$save();
            /*
            if(!$scope.reunion.minuta)
            {
                $scope.reunion.minuta={};
                $scope.reunion.minuta.exclusivos = [];
            }
            else
            {
                $scope.reunion.minuta.exclusivos = [];
            }
            
            $scope.reunion.$save();*/
        }).error(function() {
            $scope.enviando = false;
            alert("Fallo el envio");
        });
    };

    $scope.hayReceptores = function() {
        var participantes = $scope.$eval('instancia.participantes');
        var receptores = false;
        for (var p in participantes) {
            if (participantes[p][$scope.lista] && participantes[p][$scope.lista] != '') {
                receptores = true;
                break;
            }
        }

        return receptores;
    }

    $scope.puedeEnviar = function() {
        if ($scope.enviando) return false;
        return $scope.hayReceptores();
    };

    $scope.agregarParticipante = function() {
        var lista = $scope.lista;

        // se seleccionó un contacto de la lista de Para, pero no está todavía
        // relacionado a la instancia reunión
        if ($scope.buscadorPara) {
            // lo agregamos
            if (!$scope.instancia.participantes[$scope.buscadorPara]) {
                $scope.instancia.participantes[$scope.buscadorPara] = {};
            }

            // lo asignamos al minuta
            $scope.instancia.participantes[$scope.buscadorPara][lista] = 'para';
            $scope.buscadorPara = null;
        };

        // se seleccionó un contacto de la lista de Para, pero no está todavía
        // relacionado a la instancia de la reunión
        if ($scope.buscadorCC) {
            // lo agregamos
            if (!$scope.instancia.participantes[$scope.buscadorCC]) {
                $scope.instancia.participantes[$scope.buscadorCC] = {};
            }

            $scope.instancia.participantes[$scope.buscadorCC][lista] = 'cc';
            $scope.buscadorCC = null;
        };
    };

    $scope.noRecibeMinuta = function(input, param) {
        return !$scope.$eval('instancia.participantes[\'' + input._id + '\'].' + $scope.lista);
    };

    // si cambia el id de minuta con el que estamos trabajando
    $scope.$watch('state.params._id', function(instanciaId) {
        if (instanciaId) {
            $scope.traerOriginal();
        } else {
            $scope.instancia = null;
        }
    });

    $scope.cambiarVersion = function(version) {
        $scope.instancia.tipoMinuta = version;
    };
    
})
.controller('ORMNotaMinutaCtrl', function($scope, $window, ORMOrganigrama, ORMReunion) {
    $scope.cancelarCambios = function() {
        $scope.html = $scope.$eval('minuta.html');
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
    
    var reunion = ORMReunion.get({_id : $scope.instancia.reunion});
    
    $scope.jurisdiccionPorId = function (id) {
      for (var i = 0; i < $scope.jurisdicciones.length; i++) {
          if ($scope.jurisdicciones[i]._id == id)
          {
              return $scope.jurisdicciones[i];
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
            
            $scope.minuta.html = $scope.html;
            $scope.minuta.tipoMinuta = "final";
            $scope.minuta.$save(function() {
                $scope.cambios = false;
            });
        }
    };
})
.controller('ORMListaCompromisosCtrl', function($scope, $http, cantidadDeCompromisosFiltrados, $window, throttle, trackState, Proyectos, ORMOrganigrama, ORMReunion, ORMTema, Contactos, ORMMinuta, ORMInstanciaReunion) {
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
    $scope.proyectos = Proyectos.query();  
    $scope.reuniones = ORMReunion.query(); 
    $scope.compromisos = [];
    $scope.jurisdicciones = ORMOrganigrama.query();
    
    $scope.reunionFilto=cantidadDeCompromisosFiltrados.reunionFilto;
    $scope.juris=cantidadDeCompromisosFiltrados.juris;
    $scope.generalValorFiltro=cantidadDeCompromisosFiltrados.generalValorFiltro;
    
    var throttledFiltro = throttle(5000, function () {
        trackState($scope.filtro);
    });
    
    $scope.contactosFunc=function(responsables){
        var contactos="";
        for (var i=0; i<responsables.length; i++)
        {
            var temp=$scope.contactoPorId(responsables[i]);
            contactos+=temp.apellidos+" "+temp.nombre+", ";
        }
        
        return contactos;
    };
    function distintoUndefined(valor,alternativa){
        if(valor!=undefined && valor!="")
        {
            return valor;
        }
        else
        {
            return alternativa;
        }
    }
    $scope.getCompromisos=function(){
        var CSV = ['"Tipo";"Jurisdicción";"Fecha";"Tema / Título";"Tarea";"Responsables";"Estado"'];
        
        for(var i=0; i<$scope.compromisos.length; i++)
        {
            if($scope.reunionFiltoFunc($scope.compromisos[i]) && $scope.jurisdic($scope.compromisos[i]) && $scope.valorFiltro($scope.compromisos[i]))
            {
                CSV.push(
                    (distintoUndefined($scope.compromisos[i].reunion.tipo, "Sin Tipo")+";")+
                    (distintoUndefined($scope.compromisos[i].jurisdiccion, "Sin Jurisdicción")+";")+
                    (distintoUndefined($scope.compromisos[i].fecha, "Sin Fecha")+";")+
                    (distintoUndefined($scope.compromisos[i].titulo, "Sin Titulo")+";")+
                    (distintoUndefined($scope.compromisos[i].tarea, "Sin Tarea")+";")+
                    ($scope.contactosFunc($scope.compromisos[i].responsables)+";")+
                    (distintoUndefined($scope.compromisos[i].estado , "Sin Tema")));
            }
            
        }
        CSV=CSV.join('\n');
        
        window.URL = window.webkitURL || window.URL;
        
        const contentType = 'text/csv';
        
        var csvFile = new Blob([CSV], {type: contentType});
        
        var a = document.createElement('a');
        a.download = 'Compromisos.csv';
        a.href = window.URL.createObjectURL(csvFile);
        a.target= '_blank';
        a.click();
    };
    /*
    $scope.cambiarCantidad=function(nuevoObjeto, first){
        if(first)
        {
            cantidadDeCompromisosFiltrados.objetosTotales=[];
            cantidadDeCompromisosFiltrados.objetosTotales.push(nuevoObjeto);
        }
        else
        {
            cantidadDeCompromisosFiltrados.objetosTotales.push(nuevoObjeto);
        }
    };
    */
    $scope.$watch('reunionFilto', function (valor) {
        cantidadDeCompromisosFiltrados.reunionFilto = valor;
    }, true);
    $scope.$watch('juris', function (valor) {
        cantidadDeCompromisosFiltrados.juris = valor;
    }, true);
    $scope.$watch('filtroGeneral', function (valor) {
        cantidadDeCompromisosFiltrados.generalValorFiltro = valor;
    }, true);
    
    $scope.$watch('filtro', function () {
        if ($scope.filtro !== "") {
            throttledFiltro();
        }
    }, true);
    $scope.jurisdiccionPorId = function (id) {
      for (var i = 0; i < $scope.jurisdicciones.length; i++) {
          if ($scope.jurisdicciones[i]._id == id)
          {
              return $scope.jurisdicciones[i];
          }
      }  
    };
    $scope.traerReunion=function(id){
        for(var i=0; i<$scope.reuniones.length; i++)
        {
            if($scope.reuniones[i]._id==id)
            {
                return $scope.reuniones[i];
            }
        }
        
        return "Sin asignar";
    };
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
    $scope.proyectoPorId = function (id) {
      for (var i = 0; i < $scope.proyectos.length; i++) {
          if ($scope.proyectos[i]._id == id)
          {
              return $scope.proyectos[i];
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
    $scope.cambioEstado = function (compro, estado) {
        var minuta = ORMMinuta.get({_id : compro.minuta}, function(){
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
    $scope.traerDatos = function () {
        $scope.instancias = ORMInstanciaReunion.query({}, function(){
            $scope.minutas = ORMMinuta.query({}, function(){
                $scope.minutas.forEach(function(m) {
                    m.compromisos.forEach(function(c) {
                        c.reunion={
                            _id:"",
                            jurisdiccion:""
                        };
                        
                        c.fechaMili = new Date(moment(c.fecha,"DD/MM/YYYY").format('MMMM DD YYYY, HH:mm:ss')).getTime();
                        c.minuta = m._id;
                        c.instancia = m.instancia;
                        if ($scope.instanciaPorId(m.instancia)) {
                            c.reunion = $scope.instanciaPorId(m.instancia).reunion;
                        }
                        c.reunion=$scope.traerReunion(c.reunion);
                        
                        if(c.reunion.jurisdiccion)
                        {
                            c.jurisdiccion=$scope.jurisdiccionPorId(c.reunion.jurisdiccion).nombreCompleto || "Sin Jurisdicción";
                        }
                        else
                        {
                            c.jurisdiccion="Sin Jurisdicción";
                        }
                        c.juris=c.reunion.jurisdiccion;
                        $scope.compromisos.push(c);
                    });
                });
            });
        });
    };
    
    $scope.valorFiltro=function(objeto){
        if(cantidadDeCompromisosFiltrados.generalValorFiltro && cantidadDeCompromisosFiltrados.generalValorFiltro.length)
        {
            //Comparar con una variable sin aplicar funcion
            if( ( (objeto.fecha) && (objeto.fecha.search(cantidadDeCompromisosFiltrados.generalValorFiltro)>=0) ) || ( (objeto.tarea) && (objeto.tarea.toUpperCase().search(cantidadDeCompromisosFiltrados.generalValorFiltro.toUpperCase())>=0) ) || ( (objeto.titulo) && (objeto.titulo.toUpperCase().search(cantidadDeCompromisosFiltrados.generalValorFiltro.toUpperCase())>=0) ) || ( (objeto.estado) && (objeto.estado.toUpperCase().search(cantidadDeCompromisosFiltrados.generalValorFiltro.toUpperCase())>=0) ) ||  (objeto.reunion && objeto.reunion.tipo) && (objeto.reunion.tipo.toUpperCase().search(cantidadDeCompromisosFiltrados.generalValorFiltro.toUpperCase())>=0) )
            {
                return true;
            }
            //Aplicando funcion
            else if( ( (objeto.tema && objeto.tema!=="") && ($scope.temaPorId(objeto.tema).nombre.toUpperCase().search(cantidadDeCompromisosFiltrados.generalValorFiltro.toUpperCase())>=0) ) || (objeto.jurisdiccion.toUpperCase().search(cantidadDeCompromisosFiltrados.generalValorFiltro.toUpperCase())>=0) ) 
            
            {
                return true;
            }
            //Comparar con un array
            else
            {
                if(objeto.responsables)
                {
                    for(var i=0; i<objeto.responsables.length; i++)
                    {
                        if( ($scope.contactoPorId(objeto.responsables[i]).apellidos.toUpperCase().search(cantidadDeCompromisosFiltrados.generalValorFiltro.toUpperCase())>=0) || ($scope.contactoPorId(objeto.responsables[i]).nombre.toUpperCase().search(cantidadDeCompromisosFiltrados.generalValorFiltro.toUpperCase())>=0)  || 
                            (($scope.contactoPorId(objeto.responsables[i]).apellidos.toUpperCase()+" "+$scope.contactoPorId(objeto.responsables[i]).nombre.toUpperCase()).search(cantidadDeCompromisosFiltrados.generalValorFiltro.toUpperCase())>=0) )
                        {
                            return true;
                        }
                    }
                }
                return false;
            }
        }
        else
        {
            return true;
        }
    };
    $scope.jurisdic=function(compromiso){
        if(cantidadDeCompromisosFiltrados.juris!="")
        {
            if(compromiso.juris==cantidadDeCompromisosFiltrados.juris)
            {
                return true;
            }
            else
            {
                return false;
            }
        }
        else
        {
            return true;
        }
    }
    $scope.reunionFiltoFunc=function(compromiso){
        if(cantidadDeCompromisosFiltrados.reunionFilto!="")
        {
            if(compromiso.reunion._id==cantidadDeCompromisosFiltrados.reunionFilto)
            {
                return true;
            }
            else
            {
                return false;
            }
        }
        else
        {
            return true;
        }
    };
    $scope.traerDatos();
})
.service('cantidadDeCompromisosFiltrados', function() {
  return {
        objetosTotales: [],
        reunionFilto:"",
        juris:"",
        generalValorFiltro:""
    };
});
