angular.module('bag2.es2015', [])
.controller('ES2015Ctrl', function($scope, $location, $http, Lista, ES2015Distrito, ES2015Estructura, ES2015Hito, $modal, $routeParams) {
    $scope.diaHoy = moment(new Date());
    $scope.estructuras = ES2015Estructura.query();
    $scope.hitos = ES2015Hito.query();
    $scope.distritos = [];
    $scope.distritosTodos = ES2015Distrito.query({}, function() {
        $scope.distritosTodos.forEach(function(d) {
            if(d.usuarioResponsable.indexOf($scope.username) >= 0) {
                $scope.distritos.push(d);
            }
        });
        if($scope.distritos.length === 0) {
            $scope.distritos = $scope.distritosTodos;
        }
    });
    $scope.orden = "_id";
    
    $scope.colorItem = function(idDistrito, item) {
        var colorcito2  = 5;
        $scope.hayGris = false;
        if ($scope.estructuras) {
            $scope.estructuras.forEach(function(e) {
                if ((e.distrito == idDistrito) && (e.nombre.indexOf(item)!=-1)) {
                    if (($scope.colorEstruc(e._id) < colorcito2) && (colorcito2 != 1)) {
                        colorcito2 = $scope.colorEstruc(e._id);
                    }
                }
            });
        }
        if (colorcito2 == 1) {
            return 'RED';
        } else if (colorcito2 == 2) {
            return 'YELLOW';
        } else if (colorcito2 == 3) {
            return 'GREEN';
        } else if ((colorcito2 == 4) && ($scope.hayGris)) {
            return 'GREEN';
        } else if ((colorcito2 == 4) && (!$scope.hayGris)) {
            return 'BLUE';
        } else {
            return 'GRAY';
        }
    };
    
    $scope.colorEstruc = function(idEstruc) {
        $scope.numColor2 = 5;
        if ($scope.hitos) {
            $scope.hitos.forEach(function(h) {
                if (h.estructura == idEstruc) {
                    if ($scope.color(h) == 5) {
                        $scope.hayGris = true;
                    }
                    if (($scope.color(h) < $scope.numColor2) && ($scope.numColor2 != 1)) {
                        $scope.numColor2 = $scope.color(h);
                    }
                }
            });
        }
        return $scope.numColor2;
    };
    
    $scope.color = function(hit) {
        if ((!hit.fechaInicio) && (!hit.fechaFin) && (!hit.iniciado) && (!hit.cumplido)) {
            return 5;
        } else if (hit.cumplido) {
            return 4;
        } else if ((!hit.iniciado) && (moment(hit.fechaInicio, "DD/MM/YYYY") < $scope.diaHoy)) {
            return 1;
        } else if ((hit.iniciado) && (moment(hit.fechaFin, "DD/MM/YYYY") >= $scope.diaHoy)) {
            return 3;
        } else if ((hit.iniciado) && (moment(hit.fechaFin, "DD/MM/YYYY") < $scope.diaHoy)) {
            return 2;
        } else {
            return 5;
        }
    };

})
.controller('ES2015EstructuraCtrl', function ($scope, $location, $http, Lista, ES2015Distrito, ES2015Estructura, ES2015Hito, $modal, $routeParams) {
    $scope.diaHoy = moment(new Date());
    $scope.orden = "orden";
    $scope.hitos = ES2015Hito.query();
    if ($routeParams.importantes == "true") {
        $scope.estructuras = ES2015Estructura.query({
            distrito : $routeParams._id,
            star : true
        });
    } else {
        $scope.estructuras = ES2015Estructura.query({
            distrito : $routeParams._id
        });
    }
    $scope.distrito = ES2015Distrito.get({
        _id : $routeParams._id
    });
    
    $scope.detalleEstruc = function(confirmado, estruc) {
        if (confirmado) {
            $scope.estructuraSeleccionada.$save({}, function() {
                $scope.estructuras = ES2015Estructura.query({
                    distrito : $routeParams._id
                });
            });
        }
        else {
            $scope.estructuraSeleccionada = estruc;
            $modal({template: '/views/es2015/detalleEst.html', persist: true, show: true, backdrop: 'static', scope: $scope});
        }
    };
    
    $scope.nuevaEstruc = function(confirmado, data) {
        if (confirmado) {
            var estruc7 = new ES2015Estructura({
                distrito : $scope.distrito._id,
                nombre : data.nombre
            });
            estruc7.$save({}, function() {
                $scope.estructuras = ES2015Estructura.query({
                    distrito : $routeParams._id
                });
            });
        }
        else {
            var modalScope = $scope.$new();
            
            modalScope.data = {
                nombre: ''
            };
            $modal({template: '/views/es2015/nuevaEst.html', persist: true, show: true, backdrop: 'static', scope: modalScope});
        }
    };
    
    $scope.colorEstruc = function(idEstruc) {
        $scope.numColor = 5;
        $scope.hayGris = false;
        if ($scope.hitos) {
            $scope.hitos.forEach(function(h) {
                if (h.estructura == idEstruc) {
                    if ($scope.color(h) == 5) {
                        $scope.hayGris = true;
                    }
                    if (($scope.color(h) < $scope.numColor) && ($scope.numColor != 1)) {
                        $scope.numColor = $scope.color(h);
                    }
                }
            });
        }
        if ($scope.numColor == 1) {
            return 'btn btn-danger';
        } else if ($scope.numColor == 2) {
            return 'btn btn-warning';
        } else if ($scope.numColor == 3) {
            return 'btn btn-success';
        } else if (($scope.numColor == 4) && ($scope.hayGris)) {
            return 'btn btn-success';
        } else if (($scope.numColor == 4) && (!$scope.hayGris)) {
            return 'btn btn-info';
        } else {
            return 'btn';
        }
    };
    
    $scope.color = function(hit) {
        if ((!hit.fechaInicio) && (!hit.fechaFin) && (!hit.iniciado) && (!hit.cumplido)) {
            return 5;
        } else if (hit.cumplido) {
            return 4;
        } else if ((!hit.iniciado) && (moment(hit.fechaInicio, "DD/MM/YYYY") < $scope.diaHoy)) {
            return 1;
        } else if ((hit.iniciado) && (moment(hit.fechaFin, "DD/MM/YYYY") >= $scope.diaHoy)) {
            return 3;
        } else if ((hit.iniciado) && (moment(hit.fechaFin, "DD/MM/YYYY") < $scope.diaHoy)) {
            return 2;
        } else {
            return 5;
        }
    };
    
    $scope.quePermiso = function(estruc) {
        if (estruc.nombre.indexOf("Agenda")!=-1) {
            return "es2015.agenda";
        } else if (estruc.nombre.indexOf("Alianza")!=-1) {
            return "es2015.alianzas";
        } else if (estruc.nombre.indexOf("Candidato")!=-1) {
            return "es2015.candidatos";
        } else if (estruc.nombre.indexOf("Armado Territorial")!=-1) {
            return "es2015.armadoTerritorial";
        } else if (estruc.nombre.indexOf("Comunicación")!=-1) {
            return "es2015.comunicacion";
        }
    };
    
    $scope.switchStar = function(estruc) {
        if (estruc.star) {
            estruc.star = false;
        } else {
            estruc.star = true;
        }
        estruc.$save();
    };
    
    $scope.eliminar = function(confirmado, estruc) {
        if (confirmado) {
            $scope.estructuraSeleccionada.$delete({}, function() {
                $scope.estructuras = ES2015Estructura.query({
                    distrito : $routeParams._id
                });
            });
        }
        else {
            $scope.estructuraSeleccionada = estruc;
            $("#confirmarEliminar").modal('show');
        }
    };
    
}).controller('ES2015HitosCtrl', function ($scope, $location, $http, Lista, ES2015Distrito, ES2015Estructura, ES2015Hito, $modal, $routeParams) {
    $scope.diaHoy = moment(new Date());
    $scope.hitos = ES2015Hito.query({
        distrito : $routeParams._id,
        estructura : $routeParams.estructura
    });
    $scope.distrito = ES2015Distrito.get({
        _id : $routeParams._id
    });
    $scope.estructura = ES2015Estructura.get({
        _id : $routeParams.estructura
    });
    $scope.color = function(hit) {
        if ((!hit.fechaInicio) && (!hit.fechaFin) && (!hit.iniciado) && (!hit.cumplido)) {
            return 'btn';
        } else if (hit.cumplido) {
            return 'btn btn-info';
        } else if ((!hit.iniciado) && (moment(hit.fechaInicio, "DD/MM/YYYY") < $scope.diaHoy)) {
            return 'btn btn-danger';
        } else if ((hit.iniciado) && (moment(hit.fechaFin, "DD/MM/YYYY") >= $scope.diaHoy)) {
            return 'btn btn-success';
        } else if ((hit.iniciado) && (moment(hit.fechaFin, "DD/MM/YYYY") < $scope.diaHoy)) {
            return 'btn btn-warning';
        } else {
            return 'btn';
        }
    };
}).controller('ES2015DetalleHitoCtrl', function ($scope, $location, $http, Lista, ES2015Distrito, ES2015Estructura, ES2015Hito, $modal, $routeParams) {
    $scope.uploadedFile = [];
    $scope.fechaFinNueva = "";
    $scope.hito = ES2015Hito.get({
        _id : $routeParams._id
    }, function() {
        $scope.distrito = ES2015Distrito.get({
            _id : $scope.hito.distrito
        });
        $scope.estructura = ES2015Estructura.get({
            _id : $scope.hito.estructura
        }, function (){
            if ($scope.estructura.nombre == "Agenda") {
                $scope.titulos = ["Visita de Mauricio Macri", "Visita de María Eugenia Vidal", "Visita de Gabriela Michetti", "Visita de Sergio Bergman", "Visita de Carlos Melconian", "Visita de Federico Pinedo", "Visita de Alfredo de Angelis", "Visita de Esteban Bullrich", "Visita de Federico Struzenneger"];
            } else {
                $scope.titulos = [];
            }
        });
    });
    $scope.guardarRepro = function(){
        $scope.fechaFinNueva = $scope.hito.fechaFinAnterior;
        $scope.hito.fechaFinAnterior = $scope.hito.fechaFin;
        $scope.hito.fechaFin = $scope.fechaFinNueva;
        if (!$scope.hito.reprogramaciones) {
            $scope.hito.reprogramaciones = 1;
        } else {
            $scope.hito.reprogramaciones = $scope.hito.reprogramaciones + 1;
        }
        $scope.reprogramacion = false;
        $scope.hito.$save();
    };
    $scope.guardar = function(){
        $scope.hito.$save();
    };
    $scope.eliminar = function(confirmado) {
        if (confirmado) {
            $scope.hito.$delete(function() {
                $location.url('/es2015/' + $scope.distrito._id);
            });
        }
        else {
            $("#confirmarEliminar").modal('show');
        }
    };
    
    $scope.agregarDocumentacion = function(confirmado, data) {
        if (confirmado) {
            data.archivoId = $scope.uploadedFile.shift().id;
            $scope.hito.documentos.push(data);
            //showAlert('Se agrego una observación');
        }
        else {
            if ($scope.hito.documentos === undefined) {
                $scope.hito.documentos = [];
            }
            var modalScope = $scope.$new();
            
            modalScope.data = {
                nombre: '',
                fecha: undefined
            };
            $modal({template: '/views/es2015/agregarDocumento.html', persist: true, show: true, backdrop: 'static', scope: modalScope});
        }
    };
}).controller('ES2015NuevoHitoCtrl', function ($scope, $location, $http, Lista, ES2015Distrito, ES2015Estructura, ES2015Hito, $modal, $routeParams) {
    $scope.uploadedFile = [];
    $scope.distrito = ES2015Distrito.get({
        _id : $routeParams._id
    }, function(){
        $scope.estructura = ES2015Estructura.get({
            _id : $routeParams.estructura
        }, function(){
            $scope.hito = new ES2015Hito({
                distrito : $scope.distrito._id,
                estructura : $scope.estructura._id
            });
            if ($scope.estructura.nombre == "Agenda") {
                $scope.titulos = ["Visita de Mauricio Macri", "Visita de María Eugenia Vidal", "Visita de Gabriela Michetti", "Visita de Sergio Bergman", "Visita de Carlos Melconian", "Visita de Federico Pinedo", "Visita de Alfredo de Angelis", "Visita de Esteban Bullrich", "Visita de Federico Struzenneger"];
            } else {
                $scope.titulos = [];
            }
        });
    });
    
    $scope.guardar = function(){
        $scope.hito.$save();
    };
    
    $scope.agregarDocumentacion = function(confirmado, data) {
        if (confirmado) {
            data.archivoId = $scope.uploadedFile.shift().id;
            $scope.hito.documentos.push(data);
            //showAlert('Se agrego una observación');
        }
        else {
            if ($scope.hito.documentos === undefined) {
                $scope.hito.documentos = [];
            }
            var modalScope = $scope.$new();
            
            modalScope.data = {
                nombre: '',
                fecha: undefined
            };
            $modal({template: '/views/es2015/agregarDocumento.html', persist: true, show: true, backdrop: 'static', scope: modalScope});
        }
    };
    
})
.controller('ES2015EstrategicosCtrl', function ($scope, $location, $http, Lista, ES2015Distrito, ES2015Estructura, ES2015Hito, $modal, $routeParams) {
    $scope.diaHoy = moment(new Date());
    $scope.orden = "orden";
    $scope.hitos = ES2015Hito.query();
    $scope.estructuras = ES2015Estructura.query({
        star : true
    });
    $scope.distritos = ES2015Distrito.query();
    
    $scope.detalleEstruc = function(confirmado, estruc) {
        if (confirmado) {
            $scope.estructuraSeleccionada.$save({}, function() {
                $scope.estructuras = ES2015Estructura.query({
                    distrito : $routeParams._id
                });
            });
        }
        else {
            $scope.estructuraSeleccionada = estruc;
            $modal({template: '/views/es2015/detalleEst.html', persist: true, show: true, backdrop: 'static', scope: $scope});
        }
    };
    
    $scope.distritoPorId = function (id) {
      for (var i = 0; i < $scope.distritos.length; i++) {
          if ($scope.distritos[i]._id == id)
          {
              return $scope.distritos[i];
          }
      }  
    };
    
    $scope.colorEstruc = function(idEstruc) {
        $scope.numColor = 5;
        $scope.hayGris = false;
        if ($scope.hitos) {
            $scope.hitos.forEach(function(h) {
                if (h.estructura == idEstruc) {
                    if ($scope.color(h) == 5) {
                        $scope.hayGris = true;
                    }
                    if (($scope.color(h) < $scope.numColor) && ($scope.numColor != 1)) {
                        $scope.numColor = $scope.color(h);
                    }
                }
            });
        }
        if ($scope.numColor == 1) {
            return 'btn btn-danger';
        } else if ($scope.numColor == 2) {
            return 'btn btn-warning';
        } else if ($scope.numColor == 3) {
            return 'btn btn-success';
        } else if (($scope.numColor == 4) && ($scope.hayGris)) {
            return 'btn btn-success';
        } else if (($scope.numColor == 4) && (!$scope.hayGris)) {
            return 'btn btn-info';
        } else {
            return 'btn';
        }
    };
    
    $scope.color = function(hit) {
        if ((!hit.fechaInicio) && (!hit.fechaFin) && (!hit.iniciado) && (!hit.cumplido)) {
            return 5;
        } else if (hit.cumplido) {
            return 4;
        } else if ((!hit.iniciado) && (moment(hit.fechaInicio, "DD/MM/YYYY") < $scope.diaHoy)) {
            return 1;
        } else if ((hit.iniciado) && (moment(hit.fechaFin, "DD/MM/YYYY") >= $scope.diaHoy)) {
            return 3;
        } else if ((hit.iniciado) && (moment(hit.fechaFin, "DD/MM/YYYY") < $scope.diaHoy)) {
            return 2;
        } else {
            return 5;
        }
    };
    
    $scope.quePermiso = function(estruc) {
        if (estruc.nombre.indexOf("Agenda")!=-1) {
            return "es2015.agenda";
        } else if (estruc.nombre.indexOf("Alianza")!=-1) {
            return "es2015.alianzas";
        } else if (estruc.nombre.indexOf("Candidato")!=-1) {
            return "es2015.candidatos";
        } else if (estruc.nombre.indexOf("Armado Territorial")!=-1) {
            return "es2015.armadoTerritorial";
        } else if (estruc.nombre.indexOf("Comunicación")!=-1) {
            return "es2015.comunicacion";
        }
    };
    
    $scope.switchStar = function(estruc) {
        if (estruc.star) {
            estruc.star = false;
        } else {
            estruc.star = true;
        }
        estruc.$save();
    };
    
    $scope.eliminar = function(confirmado, estruc) {
        if (confirmado) {
            $scope.estructuraSeleccionada.$delete({}, function() {
                $scope.estructuras = ES2015Estructura.query({
                    distrito : $routeParams._id
                });
            });
        }
        else {
            $scope.estructuraSeleccionada = estruc;
            $("#confirmarEliminar").modal('show');
        }
    };
    
})
.controller('ES2015CalendarioCtrl', function($scope, $state, $stateProvider, ES2015Estructura, ES2015Distrito, ES2015Hito, $timeout, $location, $rootScope, $http) {
    $scope.filtro = "";
    $scope.estructuras = ES2015Estructura.query();
    $scope.distritos = ES2015Distrito.query();
    $scope.diaHoy = moment(new Date());
    // usamos ?instancia=... para trackear el id seleccionado y para hacer significativa la URL
    $scope.instanciaSeleccionada = $location.search().instancia;
    var instanciasPorId = $scope.instanciasPorId = {};

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
    
    var eventFromInstancia = function (i){
        return {
            title: i.titulo,
            start: new Date(moment(i.fechaInicio,"DD/MM/YYYY").format('MMMM DD YYYY, HH:mm:ss')),
            end: new Date(moment(i.fechaInicio,"DD/MM/YYYY").format('MMMM DD YYYY, HH:mm:ss')),
            editable: false,
            allDay: true,
            color: $scope.color(i),
            html: '',
            css: {
                opacity: (i._id != $scope.instanciaSeleccionada && '0.5') || '1.0'
            },
                // si agregamos estos campos al objeto event los mantiene
                // cuando lo pasa de parámetro en algún evento de UI (click, etc)
                _id: i._id
            };
    };
    
    $scope.color = function(hit) {
        if ((!hit.fechaInicio) && (!hit.fechaFin) && (!hit.iniciado) && (!hit.cumplido)) {
            return 'grey';
        } else if (hit.cumplido) {
            return 'blue';
        } else if ((!hit.iniciado) && (moment(hit.fechaInicio, "DD/MM/YYYY") < $scope.diaHoy)) {
            return 'red';
        } else if ((hit.iniciado) && (moment(hit.fechaFin, "DD/MM/YYYY") >= $scope.diaHoy)) {
            return 'green';
        } else if ((hit.iniciado) && (moment(hit.fechaFin, "DD/MM/YYYY") < $scope.diaHoy)) {
            return 'orange';
        } else {
            return 'grey';
        }
    };
    
    $scope.estructuraPorId = function (id) {
      for (var i = 0; i < $scope.estructuras.length; i++) {
          if ($scope.estructuras[i]._id == id)
          {
              return $scope.estructuras[i];
          }
      }  
    };
    
    $scope.distritoPorId = function (id) {
      for (var i = 0; i < $scope.distritos.length; i++) {
          if ($scope.distritos[i]._id == id)
          {
              return $scope.distritos[i];
          }
      }  
    };

    var refrescar = function(filtro) {
        // borramos todos los eventos que había para el calendario
        $scope.events.splice(0, $scope.events.length);

        if ($scope.instancias) {
            $scope.instancias.forEach(function(i) {
                if (filtro == "") {
                    if (i.titulo) {
                        if (i.titulo.indexOf("Total")==-1) {
                            if ($scope.estructuraPorId(i.estructura)) {
                                if ((i.fechaInicio) && ($scope.estructuraPorId(i.estructura).nombre == "Agenda")) {
                                    $scope.events.push(eventFromInstancia(i));
                                }
                            }
                        }
                    }
                } else {
                    if (i.titulo) {
                        if (i.titulo.indexOf("Total")==-1) {
                            if (i.titulo.indexOf(filtro)!=-1) {
                                if ($scope.estructuraPorId(i.estructura)) {
                                    if ((i.fechaInicio) && ($scope.estructuraPorId(i.estructura).nombre == "Agenda")) {
                                        $scope.events.push(eventFromInstancia(i));
                                    }
                                }
                            }
                        }
                    }
                }
            });
        }
        $scope.calendar.refreshEvents && $scope.calendar.refreshEvents();
    };
    
    var traerDatos = function() {

        var instancias = $scope.instancias = ES2015Hito.query(function() {
            instancias.forEach(function(i) {
                // la guardamos en el diccionario
                instanciasPorId[i._id] = i;
            });

            if ($scope.instanciaSeleccionada) {
                $scope.instancia = instanciasPorId[$scope.instanciaSeleccionada];
            }

            $scope.$watch('events', function() {
                refrescar($scope.filtro);
            }, true);

            $scope.$watch('filtro', function() {
                refrescar($scope.filtro);
            }, true);
        });
    };

    traerDatos();
    $scope.$on('recargar-hitos', traerDatos);

    $scope.reprogramados = {};

    $scope.calendar = {
        events: $scope.events,
        viewConfig: {
            height: 420,
            editable: false,
            defaultView: 'month',
            header: {
                left: 'prev next',
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
                $scope.instanciaResaltada = $scope.instanciasPorId[event._id];
                $scope.$apply();
            },
            eventMouseout: function(event) {
                $scope.instanciaResaltada = $scope.resaltar = null;
                $scope.$apply();
            }
        }
    };

    $scope.$watch('instanciaSeleccionada', function(i) {
        if (i) {
            $scope.instancia = $scope.instanciasPorId[i];
        } else {
            $scope.instancia = null;
        }
        $scope.events.forEach(function(e) {
            e.color = 'grey';
            e.css = {
                opacity: (e._id != $scope.instanciaSeleccionada && '0.5') || '1.0'
            };

        });
        $scope.calendar.refreshEvents && $scope.calendar.refreshEvents();
        if (i) {
            $location.search('instancia', i);
        }
    });
});