angular.module('bag2.ormOld.minutaOld', [])
.controller('ORMMinutaNavbarOldCtrl', function($scope, $rootScope) {
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
}).controller('ORMMinutaOldCtrl', function($rootScope, $scope, ORMColoresPorTipoOld, $routeParams, ORMMinutaOld, ORMOrganigramaOld, ORMInstanciaReunionOld, Contactos, ORMReunionOld, ORMTemaOld, Proyectos, $modal, IDG, $window) {
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
        return (ORMColoresPorTipoOld()[r.tipo] || 'grey');
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
            $scope.minuta.usuario = $scope.username;
            $scope.minuta.tipoMinuta = "final";
            $scope.minuta.$save({}, function() {
                $scope.mostrarAgregar = false;
            });
        }
        else {
            $scope.tipo = 'Tema';
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
    
    $scope.temas = ORMTemaOld.query();
    $scope.proyectos = Proyectos.query();
    $scope.contactos = Contactos.listar();
    $scope.jurisdicciones = ORMOrganigramaOld.query();
    
    var minutas = ORMMinutaOld.list({
        instancia: $routeParams._id
    }, function() {
        if (minutas.length > 0) {
            $scope.minuta = minutas[0];
            $scope.presentaciones = IDG.query({minutaId: $scope.minuta._id});
        } else {
            $scope.minuta = new ORMMinutaOld({
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

    $scope.instancia = ORMInstanciaReunionOld.findById({
        _id: $routeParams._id
    }, function() {
        $scope.fechaDesde = new Date($scope.instancia.desdeDate).format('dd/mm/yyyy');
        $scope.horaDesde = new Date($scope.instancia.desdeDate).format('H:MM');
        $scope.horaHasta = new Date($scope.instancia.hastaDate).format('H:MM');
        $scope.reunion = ORMReunionOld.findById({
            _id: $scope.instancia.reunion
        }, function(){
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
            $scope.maestro = ORMReunionOld.get({
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
.controller('ORMNotaMinutaOldCtrl', function($scope, $window, ORMOrganigramaOld, ORMReunionOld) {
    $scope.cancelarCambios = function() {
        $scope.html = $scope.$eval('minuta.html');
        $scope.cambios = false;
    };
    
    
    $scope.jurisdicciones = ORMOrganigramaOld.query();
    
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
    
    var reunion = ORMReunionOld.get({_id : $scope.instancia.reunion});
    
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
            $scope.minuta.usuario = $scope.username;
            $scope.minuta.html = $scope.html;
            $scope.minuta.tipoMinuta = "final";
            $scope.minuta.$save(function() {
                $scope.cambios = false;
            });
        }
    };
})
.controller('ORMListaCompromisosOldCtrl', function($scope, $window, throttle, trackState, Proyectos, ORMOrganigrama, ORMReunion, ORMTema, Contactos, ORMMinuta, ORMInstanciaReunion) {
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
    $scope.traerDatos = function () {
        $scope.instancias = ORMInstanciaReunion.query({}, function(){
            $scope.minutas = ORMMinuta.query({}, function(){
                $scope.minutas.forEach(function(m) {
                    m.compromisos.forEach(function(c) {
                        c.fechaMili = new Date(moment(c.fecha,"DD/MM/YYYY").format('MMMM DD YYYY, HH:mm:ss')).getTime();
                        c.minuta = m._id;
                        c.instancia = m.instancia;
                        if ($scope.instanciaPorId(m.instancia)) {
                            c.reunion = $scope.instanciaPorId(m.instancia).reunion;
                        }
                        $scope.compromisos.push(c);
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
});