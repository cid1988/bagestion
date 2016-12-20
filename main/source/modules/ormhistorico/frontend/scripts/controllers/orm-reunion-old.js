angular.module('bag2.ormOld-reunionOld', ["bag2.ormOld", "bag2.restApi"]).controller("ORMReunionAsistenciaEditableOldCtrl", function ($scope, $rootScope, $routeParams, $window, ORMInstanciaReunionOld, ORMReunionOld, Contactos, ORMOrganigramaOld) {
    $scope.contactos = Contactos.listar();
    $scope.jurisdicciones = ORMOrganigramaOld.query();
    
    $scope.contactoPorId = function (id) {
      for (var i = 0; i < $scope.contactos.length; i++) {
          if ($scope.contactos[i]._id == id)
          {
              return $scope.contactos[i];
          }
      }  
    };
    
    $scope.switchImportante = function(contacto) {
        if (contacto.importante) {
            contacto.importante = false;
        } else {
            contacto.importante = true;
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
    $scope.instancia = ORMInstanciaReunionOld.get({_id: $routeParams._id}, function(){
        $scope.reunion = ORMReunionOld.get({_id: $scope.instancia.reunion}, function(){
            if (!$scope.instancia.asistencia) {
                $scope.instancia.asistencia = $scope.reunion.participantes;
                $scope.instancia.asistenteTablero = $scope.reunion.asistenteTablero;
                $scope.instancia.asistenteMinuta = $scope.reunion.asistenteMinuta;
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
                $scope.maestro = ORMReunionOld.get({_id: idMaestro}, function(){
                    $scope.instancia.asistenciaMaestro = $scope.maestro.participantes;
                    $scope.vistaMaestro = [];
                    angular.forEach($scope.instancia.asistenciaMaestro, function (p){
                        $scope.vistaMaestro.push({
                            p: p,
                            c: Contactos.buscarPorId(p.contactoId)
                        });
                    });
                });
            } else if (!$scope.instancia.asistenciaMaestro) {
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
                $scope.maestro = ORMReunionOld.get({_id: idMaestro}, function(){
                    $scope.instancia.asistenciaMaestro = $scope.maestro.participantes;
                    $scope.vistaMaestro = [];
                    angular.forEach($scope.instancia.asistenciaMaestro, function (p){
                        $scope.vistaMaestro.push({
                            p: p,
                            c: Contactos.buscarPorId(p.contactoId)
                        });
                    });
                });
            } else {
                $scope.vistaMaestro = [];
                angular.forEach($scope.instancia.asistenciaMaestro, function (p){
                    $scope.vistaMaestro.push({
                        p: p,
                        c: Contactos.buscarPorId(p.contactoId)
                    });
                });
            }
        });
    });
    
    $scope.tab = "participantes";
    $scope.imprimir = function () {
        $window.print(); 
    };
    
    $scope.getNumber = function(num) {
        return new Array(num);   
    };
    
    $scope.eliminarParticipante = function (p) {
      $scope.instancia.asistencia.splice($scope.instancia.asistencia.indexOf(p), 1);
    };
    
    var self = this;
    
    
    $scope.$watch('instancia.asistencia', function (participantes){
        self.vistaAsistencia = {
            responsable: [],
            jefeGabinete: [],
            ejecutivo: [],
            otros: [],
            participante: [],
            privada: [],
            gestion: [],
            exclusivo: [],
            legislador: []
        };

        if (participantes) {
            $scope.myNumber = participantes.length;
            angular.forEach(participantes, function (p){
                // @diego: Por default, lo mandamos a 'otros'
                var donde = self.vistaAsistencia.otros;

                if (p.clasificacion == 'responsable') {
                    donde = self.vistaAsistencia.responsable;
                } else if (p.clasificacion == 'jefeGabinete') {
                    donde = self.vistaAsistencia.jefeGabinete;
                } else if (p.clasificacion == 'ejecutivo') {
                    donde = self.vistaAsistencia.ejecutivo;
                } else if (p.clasificacion == 'participante') {
                    donde = self.vistaAsistencia.participante;
                } else if (p.clasificacion == 'gestion') {
                    donde = self.vistaAsistencia.gestion;
                } else if (p.clasificacion == 'privada') {
                    donde = self.vistaAsistencia.privada;
                } else if (p.clasificacion == 'legislador') {
                    donde = self.vistaAsistencia.legislador;
                } else if (p.clasificacion == 'exclusivo') {
                    donde = self.vistaAsistencia.exclusivo;
                }

                donde.push({
                    p: p,
                    c: Contactos.buscarPorId(p.contactoId)
                });
            });
        }
    }, true);
    
    $scope.$watch('instancia.asistenciaMaestro', function (participantesMaestro){
        $scope.vistaMaestro = [];
        angular.forEach($scope.instancia.asistenciaMaestro, function (p){
            $scope.vistaMaestro.push({
                p: p,
                c: Contactos.buscarPorId(p.contactoId)
            });
        });
    }, true);
    
    $scope.edit = function() {
        self.editando = true;
    };
    
    $scope.save = function() {
        angular.forEach($scope.instancia.asistencia, function (p) {
            if (!p.asistio) {
                p.asistio = "No";
            }
        });
        angular.forEach($scope.instancia.asistenciaMaestro, function (p) {
            if (!p.asistio) {
                p.asistio = "No";
            }
        });
        $scope.instancia.$save(function() {
            self.editando = false;
            $scope.reunion = ORMReunionOld.get({_id: $scope.instancia.reunion}, function(){
                $scope.reunion.cita.exclusivos = [];
                $scope.reunion.temario.exclusivos = [];
                $scope.reunion.propuestaTemario.exclusivos = [];
                var nueva = [];
                angular.forEach($scope.reunion.participantes, function (p){
                    if (p.clasificacion != "exclusivo") {
                        nueva.push(p);
                    }
                });
                $scope.reunion.participantes = nueva;
                $scope.reunion.$save();
            });
        });
    };
        
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
    
    self.puedeAgregar = function (contactoId) {
        if (!$scope.instancia.asistencia) {
            angular.extend($scope.instancia, {
                asistencia: []
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

        for (var i = 0; i < $scope.instancia.asistencia.length; i++) {
            if ($scope.instancia.asistencia[i].contactoId == contactoId) {
                found = true;
                break;
            }
        }

        return !found;
    };

    $scope.agregarParticipante = function (c) {
        if (self.puedeAgregar(c)) {
            $scope.instancia.asistencia.push({
                contactoId: c,
                clasificacion: "otros",
                asistio: "Si"
            });

            // @diego: ponemos el combo en nada
            self.buscador = "";
        }
    };

    $scope.agregarParticipanteMaestro = function (c) {
        if ($scope.instancia.asistenciaMaestro) {
            $scope.instancia.asistenciaMaestro.push({
                contactoId: c,
                clasificacion: "otros",
                asistio: "Si"
            });

            // @diego: ponemos el combo en nada
            self.buscador2 = "";
        }
    };
    
    
})
.controller("ORMReunionLlamadosEditableOldCtrl", function ($scope, $rootScope, $routeParams, $window, ORMInstanciaReunionOld, ORMOrganigramaOld, ORMReunionOld, Contactos) {
    $scope.contactos = Contactos.listar();
    $scope.jurisdicciones = ORMOrganigramaOld.query();
    
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
    $scope.instancia = ORMInstanciaReunionOld.get({_id: $routeParams._id}, function(){
        $scope.reunion = ORMReunionOld.get({_id: $scope.instancia.reunion}, function(){
            if (!$scope.instancia.llamados) {
                $scope.instancia.llamados = $scope.reunion.llamados;
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
                $scope.maestro = ORMReunionOld.get({_id: idMaestro}, function(){
                    $scope.instancia.llamadosMaestro = $scope.maestro.llamados;
                    $scope.vistaLlamados = [];
                    angular.forEach($scope.instancia.llamados, function (p){
                        $scope.vistaLlamados.push({
                            p: p,
                            c: Contactos.buscarPorId(p.contactoId)
                        });
                    });
                    $scope.vistaMaestro = [];
                    angular.forEach($scope.instancia.llamadosMaestro, function (p){
                        $scope.vistaMaestro.push({
                            p: p,
                            c: Contactos.buscarPorId(p.contactoId)
                        });
                    });
                });
            } else if (!$scope.instancia.llamadosMaestro) {
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
                $scope.maestro = ORMReunionOld.get({_id: idMaestro}, function(){
                    $scope.instancia.llamadosMaestro = $scope.maestro.llamados;
                    $scope.vistaLlamados = [];
                    angular.forEach($scope.instancia.llamados, function (p){
                        $scope.vistaLlamados.push({
                            p: p,
                            c: Contactos.buscarPorId(p.contactoId)
                        });
                    });
                    $scope.vistaMaestro = [];
                    angular.forEach($scope.instancia.llamadosMaestro, function (p){
                        $scope.vistaMaestro.push({
                            p: p,
                            c: Contactos.buscarPorId(p.contactoId)
                        });
                    });
                });
            } else {
                $scope.vistaLlamados = [];
                angular.forEach($scope.instancia.llamados, function (p){
                    $scope.vistaLlamados.push({
                        p: p,
                        c: Contactos.buscarPorId(p.contactoId)
                    });
                });
                $scope.vistaMaestro = [];
                angular.forEach($scope.instancia.llamadosMaestro, function (p){
                    $scope.vistaMaestro.push({
                        p: p,
                        c: Contactos.buscarPorId(p.contactoId)
                    });
                });
            }
        });
    });
    
    $scope.getNumber = function(num) {
        return new Array(num);   
    };
    var self = this;
    
    $scope.edit = function() {
        self.editando = true;
    };
    
    $scope.save = function() {
        $scope.instancia.$save(function() {
            self.editando = false;
        });
    };
    
    $scope.buscarTelefono = function(nombre, contacto) {
        if (!contacto.telefonos) {
            return "";
        }
        else {
            for (var i = 0; i < contacto.telefonos.length; i++) {
                var em = contacto.telefonos[i];

                if ((em.nombre == nombre) && (em.interno)) {
                    return em.valor + " Int. " + em.interno;
                } else if (em.nombre == nombre) {
                    return em.valor;
                }
            }
        }

        return "";
    };
});