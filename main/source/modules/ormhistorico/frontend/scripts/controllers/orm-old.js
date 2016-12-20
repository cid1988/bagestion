var roles = [{
        key: '',
        nombre: 'Ninguno'
    }, {
        key: 'responsable',
        nombre: 'Responsable'
    }, {
        key: 'jefeDeGabinete',
        nombre: 'Jefe de Gabinete'
    }, {
        key: 'ejecutivo',
        nombre: 'Ejecutivo'
    }, {
        key: 'participante',
        nombre: 'Participante'
    }, {
        key: 'asistente',
        nombre: 'Asistente'
    }, {
        key: 'privada',
        nombre: 'Privada'
    }, {
        key: 'gestion',
        nombre: 'Gestión'
    }
];

var rolesPorKey = {};
roles.forEach(function(r) {
    rolesPorKey[r.key] = r;
});

var tiposAsistencia = [{
        key: '',
        nombre: 'Ninguno'
    }, {
        key: 'sinConfirmar',
        nombre: 'Sin confirmar'
    }, {
        key: 'comprometido',
        nombre: 'Comprometido'
    }, {
        key: 'noComprometido',
        nombre: 'No comprometido'
    }
];

var tiposAsistenciaPorKey = {};
tiposAsistencia.forEach(function(r) {
    tiposAsistenciaPorKey[r.key] = r;
});

angular.module('bag2.ormOld', [])
// .value('camposMailORM', function() {
//     return [{
//         nombre: 'Temario',
//         campo: 'temario'
//     }, {
//         nombre: 'Propuesta de temario',
//         campo: 'propuestaTemario'
//     }, {
//         nombre: 'Minuta',
//         campo: 'minuta'
//     }];
// })
// .value('ORMRoles', function() {
//     return roles;
// })
// .value('ORMListaTratamiento', function () {
//     return [{
//             nombre: 'Ninguno'
//         }, {
//             nombre: 'Sr.'
//         }, {
//             nombre: 'Sra.'
//         }, {
//             nombre: 'Srta.'
//         },
//     ];
// })
// .value('ORMListaTelefonos', function () {
//     return [{
//             nombre: 'Seleccionar'
//         }, {
//             nombre: 'Telefono directo'
//         }, {
//             nombre: 'Telefono alternativo'
//         }, {
//             nombre: 'Conmutador'
//         }, {
//             nombre: 'Celular laboral'
//         }, {
//             nombre: 'Celular alternativo'
//         },
//     ];
// })
.value('ORMColoresPorTipoOld', function() {
    return {
          'seguimiento':'red',
          'transversales': 'green',
          'especificas': 'blue',
          'planeamiento': '#FFBF00',
          'presupuesto': 'violet',
          'coordinacion': 'grey',
          'planLargoPlazo': '#B4045F',
          'proyectosEspeciales': '#088A85',
          'eventuales': '#8A4B08'
        };
})
.value('ORMRolesPorKey', function() {
    return rolesPorKey;
})
.value('ORMTiposAsistenciaPorKey', function() {
    return tiposAsistenciaPorKey;
})
// .controller('ORMOldCtrl', function($scope) {}).service('ORMHelper', function($location) {
//     var frecuencias = [{
//             key: '1dia',
//             nombre: 'Diaria'
//         }, {
//             key: '1semana',
//             nombre: 'Cada semana'
//         }, {
//             key: '2semanas',
//             nombre: 'Cada dos semanas'
//         }, {
//             key: '3semanas',
//             nombre: 'Cada tres semanas'
//         }, {
//             key: '1mes',
//             nombre: 'Todos los meses'
//         }, {
//             key: '2meses',
//             nombre: 'Cada dos meses'
//         }, {
//             key: 'aPedido',
//             nombre: 'A pedido'
//         }
//     ];
//     return {
//         verReunion: function(r) {
//             $location.url('/orm/reuniones/' + r._id);
//         },
//         frecuencias: function() {
//             return frecuencias;
//         },
//         tiposReuniones: function() {
//             return ['seguimiento', 'especifica', 'presupuesto', 'gestion'];
//         },
//         nombreTipoReunion: function(tr) {
//             switch (tr) {
//                 case 'seguimiento':
//                     return 'Seguimiento';
//                 case 'transversasles':
//                     return 'Transversales';
//                 case 'especificas':
//                     return 'Especificas';
//                 case 'planeamiento':
//                     return 'Planeamiento';
//                 case 'presupuesto':
//                     return 'Presupuesto';
//                 case 'coordinacion':
//                     return 'Coordinacion';
//                 case 'planLargoPlazo':
//                     return 'Plan Largo Plazo';
//                 case 'proyectosEspeciales':
//                     return 'Proyectos Especiales';
//                 case 'eventuales':
//                     return 'Eventuales';
//                 default:
//                     return tr;
//             }
//         },
//         ver: function(r) {
//             $location.url('/orm/reuniones/' + r._id);
//         },
//         editarReunion: function(r) {
//             $location.url('/orm/reuniones/' + r._id + '/edit');
//         }
//     };
// })
// .controller('ORMReunionInstanciaCtrl', function($scope, camposMailORM) {
//     $scope.camposMail = camposMailORM();
// })
.service("FechasOld", function () {
    return {
        hoyEnMs: function () {
            var d = new Date();
            d.setHours(0,0,0,0);

            return d.valueOf();
        }
    }
})
.service("Utilidades", function () {
    return {
        diccionario: function (lista) {
            var d = {};
            
            angular.forEach(lista, function (i) {
                if (i._id) {
                    d[i._id] = i;
                }
            });

            return d;
        }
    }
})
// .service("Reuniones", function (ORMTiposAsistenciaPorKey, ORMInstanciaReunion, FechasOld, ORMReunion) {
//     return {
//         tiposAsistenciaPorKey: function () {
//             return ORMTiposAsistenciaPorKey;
//         },
//         series: function (callback) {
//             return ORMReunion.list(callback);
//         },
//         proximasFechas: function (maximo, callback) {
//             return ORMInstanciaReunion.list({
//                 desdeDate: JSON.stringify({
//                   $gt: FechasOld.hoyEnMs()
//                 })
//             }, callback);
//         },
//         buscarPorId: function (_id) {
//             var deferred = $q.defer();
//             $http.get('/api/orm.reuniones/' + _id)
//             .success(function (data) {
//                 deferred.resolve(new ORMReunion(data));
//             }).error(function () {
//                 deferred.reject('HTTP error');
//             });

//             return deferred.promise;
//         }
//     }
// })
.service("Contactos", function (ORMContacto) {
    return {
        buscarPorId: function (id, callback) {
            return ORMContacto.findById({
                _id: id
            }, callback);
        },
        traer: function (id, callback) {
            return ORMContacto.findById({
                _id: id
            }, callback);
        },
        listar: function (callback) {
            return ORMContacto.query({
                eliminado: JSON.stringify({$exists: false})
            }, callback);
        }
    }
})
.run(function($rootScope, ORMContacto, $modal) {
    ($rootScope.uiHelper || ($rootScope.uiHelper = {})).abrirTarjetaContacto = function(_id) {
        var s = $rootScope.$new();
        s.contacto = ORMContacto.findById({
            _id: _id
        });
        $modal({
            template: '/views/orm/contactos/popup.html',
            persist: true,
            show: true,
            backdrop: 'static',
            scope: s
        });
    };
})
// .directive("listaEnvio", function () {
//     return {
//         restrict:"E",
//         repalce: true,
//         templateUrl:"/views/orm/lista-envio.html",
//         scope: {
//             contactos: "=",
//             seleccionadosPara: "=",
//             seleccionadosCc: "=",
//             seleccionadosCco: "=",
//             seleccionadosExclusivos: "=",
//             permisoAgregar: "=",
//             contactoAgregado: "="
//         },
//         link: function (scope, element, attributes) {
//             scope.buscarCorreo = function(nombre, contacto) {
//                 if (!contacto.correos) {
//                     return "";
//                 }
//                 else {
//                     for (var i = 0; i < contacto.correos.length; i++) {
//                         var em = contacto.correos[i];
        
//                         if (em.nombre == nombre) {
//                             return em.valor;
//                         }
//                     }
//                 }
        
//                 return "";
//             };
            
//             scope.quitar = function (p, array) {
//                 array && p && array.splice(array.indexOf(p), 1);
//             };
            
//             scope.contactoPorId = function (id) {
//               for (var i = 0; i < scope.contactos.length; i++) {
//                   if (scope.contactos[i]._id == id)
//                   {
//                       return scope.contactos[i];
//                   }
//               }  
//             };
//             scope.agregaPara = function (p) {
//                 if (p) {
//                     scope.seleccionadosPara.push({
//                         contactoId: p
//                     });
//                     if (scope.contactoAgregado != "00") {
//                         scope.contactoAgregado.push({
//                             contactoId: p
//                         });
//                     }
//                     scope.buscador.para = "";
//                 }
//             };
//             scope.agregaCC = function (p) {
//                 if (p) {
//                     scope.seleccionadosCc.push({
//                         contactoId: p
//                     });
//                     if (scope.contactoAgregado != "00") {
//                         scope.contactoAgregado.push({
//                             contactoId: p
//                         });
//                     }
//                     scope.buscador.cc = "";
//                 }
//             };
//             scope.agregaCCO = function (p) {
//                 if (p) {
//                     scope.seleccionadosCco.push({
//                         contactoId: p
//                     });
//                     if (scope.contactoAgregado != "00") {
//                         scope.contactoAgregado.push({
//                             contactoId: p
//                         });
//                     }
//                     scope.buscador.cco = "";
//                 }
//             };
//             scope.agregaExclusivo = function (p) {
//                 if (p) {
//                     scope.seleccionadosExclusivos.push({
//                         contactoId: p
//                     });
//                     scope.buscador.exclusivo = "";
//                 }
//             };
//         }
//     };
// });