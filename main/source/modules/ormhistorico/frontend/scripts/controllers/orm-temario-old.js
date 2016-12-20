angular.module('bag2.ormOld.temarioOld',[])
.controller('ORMTemarioTemasOldCtrl', function($scope, ORMTemaOld) {
    $scope.cambios = false;
    
    $scope.editado = function () {
        $scope.cambios = true;
    };

    $scope.guardar = function () {
        $scope.cambios = false;
        $scope.temario.$save();
    };

    $scope.cancelar = function () {
        $scope.temario.temas = $scope.temasEdit;
    };
})
.controller('ORMTemarioNavbarCtrl', function($scope, $rootScope) {
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
}).controller('ORMTemarioOldCtrl', function($rootScope, $scope, ORMColoresPorTipoOld, $routeParams, ORMTemarioOld, ORMInstanciaReunionOld, ORMTemaOld, ORMReunionOld, $modal, $window) {
    $scope.cancelacion = "";
    $rootScope.$on('start-edit', function() {
        $rootScope.$broadcast('edit-started');
        $scope.editando = true;
    });
    
    $scope.instancia = ORMInstanciaReunionOld.get({
        _id: $routeParams._id
    });
    
    $rootScope.$on('stop-edit', function() {
        $rootScope.$broadcast('edit-stopped');
        $scope.editando = false;
    });

    $rootScope.$on('enviar-temario', function(event, tipoTemario) {
        $rootScope.$broadcast('mostrar-enviar-temario', true, tipoTemario);
    });
    
    $rootScope.$on('cancel-temario', function() {
        $rootScope.$broadcast('cancelar-temario', true);
    });
    
    $scope.colorReunion = function (r){
        return (ORMColoresPorTipoOld()[r.tipo] || 'grey');
    }
    
    var temarios = ORMTemarioOld.list({
        instancia: $routeParams._id
    }, function() {
        if (temarios.length > 0) {
            $scope.temario = temarios[0];
        } else {
            $scope.temario = new ORMTemarioOld({
                instancia: $routeParams._id,
                tipoTemario: 'propuesta',
                html: '',
                prioridades: []
            });
        }
    });
    
    $scope.temas = ORMTemaOld.query();
    
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
            if ($scope.reunion.frecuencia == "2meses") {
                $scope.proxReuAprox = "Aproximadamente en 2 meses";
            } else if ($scope.reunion.frecuencia == "1mes") {
                $scope.proxReuAprox = "Aproximadamente en 1 mes";
            } else if ($scope.reunion.frecuencia == "3semanas") {
                $scope.proxReuAprox = "Aproximadamente en 3 semanas";
            } else if ($scope.reunion.frecuencia == "2semanas") {
                $scope.proxReuAprox = "Aproximadamente en 2 semanas";
            } else if ($scope.reunion.frecuencia == "1semana") {
                $scope.proxReuAprox = "Aproximadamente en 1 semana";
            } else if ($scope.reunion.frecuencia == "aPedido") {
                $scope.proxReuAprox = "A pedido";
            } else {
                $scope.proxReuAprox = " ";
            }
            $scope.prioridades = [];
            for (var i = 0; i < 7; i++) {
                if ($scope.dameTema(i + 1)) {
                    $scope.prioridades.push($scope.dameTema(i + 1));
                }
            }
            
            $scope.temario.prioridades = $scope.prioridades;
            
            if (!$scope.temario.temas) {
                $scope.temario.temas = $scope.reunion.temas;
            }
            
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
    
    $scope.dameTema = function (numeroOrden) {
        if ($scope.reunion.temas) {
            for (var i = 0; i < $scope.reunion.temas.length; i++) {
              if ($scope.reunion.temas[i].orden == numeroOrden)
              {
                  return $scope.reunion.temas[i].temaId;
              }
            } 
        }
    };
    
    $scope.cancelar = function() {
        $rootScope.$broadcast('cancel-temario');
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
.controller('ORMNotaTemarioOldCtrl', function($scope, $window, ORMOrganigramaOld, ORMReunionOld) {
    $scope.cancelarCambios = function() {
        $scope.html = $scope.$eval('temario.html');
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
    var reunion = ORMReunionOld.get({_id : $scope.instancia.reunion}, function(){
        if (reunion.frecuencia == "2meses") {
            $scope.fechaProx = new Date($scope.instancia.desdeDate + 5184000000);
            $scope.temario.proxima_reunion = restarDias($scope.fechaProx);
        } else if (reunion.frecuencia == "1mes") {
            $scope.fechaProx = new Date($scope.instancia.desdeDate + 2592000000);
            $scope.temario.proxima_reunion = restarDias($scope.fechaProx);
        } else if (reunion.frecuencia == "3semanas") {
            $scope.fechaProx = new Date($scope.instancia.desdeDate + 1814400000);
            $scope.temario.proxima_reunion = restarDias($scope.fechaProx);
        } else if (reunion.frecuencia == "2semanas") {
            $scope.fechaProx = new Date($scope.instancia.desdeDate + 1209600000);
            $scope.temario.proxima_reunion = restarDias($scope.fechaProx);
        } else if (reunion.frecuencia == "1semana") {
            $scope.fechaProx = new Date($scope.instancia.desdeDate + 604800000);
            $scope.temario.proxima_reunion = restarDias($scope.fechaProx);
        } else if (reunion.frecuencia == "aPedido") {
            $scope.temario.proxima_reunion = "A pedido";
        } else {
            $scope.fechaProx = new Date($scope.instancia.desdeDate);
            $scope.temario.proxima_reunion = restarDias($scope.fechaProx);
        }
    });
    
    $scope.jurisdiccionPorId = function (id) {
      for (var i = 0; i < $scope.jurisdicciones.length; i++) {
          if ($scope.jurisdicciones[i]._id == id)
          {
              return $scope.jurisdicciones[i];
          }
      }  
    };
    
    $scope.$on('mostrar-enviar-temario', function(event, mostrar) {
        $scope.mostrarEnviarTemario = mostrar;
    });

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
})
.controller('ORMHistoricoOldCtrl', function($scope, ORMTemarioOld, ORMMinutaOld, ORMInstanciaReunionOld, ORMOrganigramaOld, ORMReunionOld, $window) {
    $scope.filtro2 = "";
    $scope.temarios = ORMTemarioOld.query();
    $scope.minutas = ORMMinutaOld.query();
    var  hoy = new Date();
    hoy = hoy.getTime() - 28800000;
    $scope.jurisdicciones = ORMOrganigramaOld.query();
    $scope.instancias = ORMInstanciaReunionOld.query({
        $or:JSON.stringify([
            {desdeDate:{$lt: hoy}},
        ]),
    });
    $scope.orden = 'desdeDate';
    $scope.tablaJurisdicciones = ["SinJurisdiccion"];
    
    $scope.reuniones = ORMReunionOld.query(function(){
        for (var i = 0; i < $scope.reuniones.length; i++) {
            if ($scope.reuniones[i].jurisdiccion) {
                if ($scope.tablaJurisdicciones.indexOf($scope.reuniones[i].jurisdiccion) < 0)
                {
                    $scope.tablaJurisdicciones.push($scope.reuniones[i].jurisdiccion);
                }
            } else {
                $scope.reuniones[i].jurisdiccion = "SinJurisdiccion";
            }
        }
    });
    
    $scope.jurisdiccionOrdenPorId = function (id) {
        for (var i = 0; i < $scope.jurisdicciones.length; i++) {
            if ($scope.jurisdicciones[i]._id == id)
            {
                if ($scope.jurisdicciones[i].nombreCompleto) {
                    return $scope.jurisdicciones[i].nombreCompleto;
                } else {
                    return "9999";
                }
            }
        }  
    };
    
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
    
    $scope.temasTemario = function(idInstancia) {
        for (var i = 0; i < $scope.temarios.length; i++) {
            if ($scope.temarios[i].instancia == idInstancia)
            {
                if ($scope.temarios[i].temas) {
                    var canti = 0;
                    angular.forEach($scope.temarios[i].temas, function (t) {
                        if (t.agregado == "si") {
                            canti = canti + 1;
                        }
                    });
                    return canti;
                }
            }
        }  
        return 0;
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
    
    $scope.filterTipo = function(instanciaI) {
        if ($scope.filtro2 === "") {
            return true;
        } else {
            if ($scope.filtro2.tipo === "") {
                return true;
            } else {
                if ($scope.reunionPorId(instanciaI.reunion).tipo == $scope.filtro2.tipo) {
                    return true;
                } else {
                    return false;
                }
            }
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
    
    $scope.reunionPorId = function (id) {
        for (var i = 0; i < $scope.reuniones.length; i++) {
            if ($scope.reuniones[i]._id == id)
            {
                return $scope.reuniones[i];
            }
        }  
    };
    
    $scope.jurisdiccionPorId = function (id) {
        if (id == "SinJurisdiccion") {
            return {'nombreCompleto': "Sin Jurisdiccion"};
        } else {
            for (var i = 0; i < $scope.jurisdicciones.length; i++) {
                if ($scope.jurisdicciones[i]._id == id)
                {
                    return $scope.jurisdicciones[i];
                }
            }  
        }
    };
    
})
.controller('ORMTemarioVueltaCtrl', function($rootScope, $scope, ORMColoresPorTipoOld, $routeParams, ORMTemario, ORMInstanciaReunion, ORMTema, ORMReunion, $modal, $window) {
    $scope.cancelacion = "";
    $rootScope.$on('start-edit', function() {
        $rootScope.$broadcast('edit-started');
        $scope.editando = true;
    });
    
    $rootScope.$on('stop-edit', function() {
        $rootScope.$broadcast('edit-stopped');
        $scope.editando = false;
    });
    
    $scope.colorReunion = function (r){
        return (ORMColoresPorTipoOld()[r.tipo] || 'grey');
    };
    
    $scope.cambios = false;
    
    $scope.editado = function () {
        $scope.cambios = true;
    };

    $scope.guardar = function () {
        $scope.cambios = false;
        $scope.temario.$save();
    };

    $scope.cancelar = function () {
        $scope.temario.temas = $scope.temasEdit;
    };
    
    var temarios = ORMTemario.list({
        instancia: $routeParams._id
    }, function() {
        if (temarios.length > 0) {
            $scope.temario = temarios[0];
        } else {
            $scope.temario = new ORMTemario({
                instancia: $routeParams._id,
                tipoTemario: 'propuesta',
                html: '',
                prioridades: []
            });
        }
    });
    
    $scope.temas = ORMTema.query();
    
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
            $scope.prioridades = [];
            for (var i = 0; i < 7; i++) {
                if ($scope.dameTema(i + 1)) {
                    $scope.prioridades.push($scope.dameTema(i + 1));
                }
            }
            
            $scope.temario.prioridades = $scope.prioridades;
            
            if (!$scope.temario.temas) {
                $scope.temario.temas = $scope.reunion.temas;
            }
            
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
    
    $scope.dameTema = function (numeroOrden) {
        if ($scope.reunion.temas) {
            for (var i = 0; i < $scope.reunion.temas.length; i++) {
              if ($scope.reunion.temas[i].orden == numeroOrden)
              {
                  return $scope.reunion.temas[i].temaId;
              }
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
    
});