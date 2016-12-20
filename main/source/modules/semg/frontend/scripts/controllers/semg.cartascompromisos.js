angular.module('bag2.semg.cartascompromisos', [])
.controller('CartaSEMGCtrl', function($scope, $location, $http, SEMGCartaCompromiso, Contactos, ORMOrganigrama, User, $modal, $routeParams) {
    
    
    $scope.duplicar = function (anio) {
        var cartasADupli = SEMGCartaCompromiso.query({
            anio : $routeParams.anio
        }, function() {
            angular.forEach(cartasADupli, function(i) {
                var carta = new SEMGCartaCompromiso({
                    jurisdiccion: i.jurisdiccion,
                    subsecretaria : i.subsecretaria,
                    dependencia : i.dependencia,
                    servicio : i.servicio,
                    temas : i.temas,
                    responsableCarga : i.responsableCarga,
                    responsableValidacion : i.responsableValidacion,
                    compromisos : [],
                    comentarios : i.comentarios,
                    cartaAnterior : i._id,
                    anio : parseInt(anio)
                });
                angular.forEach(i.compromisos, function(c) {
                    var compro = {
                        serviciosTramites: c.serviciosTramites,
                        destinatario : c.destinatario,
                        compromisoResultado : c.compromisoResultado,
                        medidaUnidad : c.medidaUnidad,
                        justificacion : c.justificacion,
                        indicador : c.indicador,
                        metaAnterior : c.metaAnio,
                        semestre1 : c.semestre1,
                        semestre2 : c.semestre2,
                        procedimiento : c.procedimiento,
                        responsable : c.responsable,
                        fuente : c.fuente
                    };
                    carta.compromisos.push(compro);
                });
                carta.$save();
            });
        }); 
    };
    
    
    $scope.filtro = {jurisdiccion : ''};
    $scope.filtrados = [];
    $scope.filtradosAnt = 0;
    $scope.filtroAnt = '';
    $scope.anio = $routeParams.anio;
    
    $scope.user = User.findByName({
        username: $scope.username
    }, function() {
        if ($scope.hasPermission('semg.editar')) {
    	    $scope.cartas = SEMGCartaCompromiso.query({anio : $routeParams.anio});
        } else if ($scope.user.jurisdiccion) {
            $scope.cartas = SEMGCartaCompromiso.query({
                jurisdiccion : $scope.user.jurisdiccion,
                anio : $routeParams.anio
            });
            $scope.filtro = {jurisdiccion : $scope.user.jurisdiccion};
        } else {
            $scope.cartas = SEMGCartaCompromiso.query({anio : $routeParams.anio});
        }
        if ($routeParams.filtro) {
            $scope.filtro.jurisdiccion = $routeParams.filtro;
        }
    });
    $scope.orden = 'numero';
    $scope.filtroAprobado = 'Todos';
	$scope.contactos = Contactos.listar();
	$scope.organigrama = ORMOrganigrama.query();
    
    $scope.contactoPorId = function (id) {
      for (var i = 0; i < $scope.contactos.length; i++) {
          if ($scope.contactos[i]._id == id)
          {
              return $scope.contactos[i];
          }
      }  
    };
    
    $scope.organigramaPorId = function (id) {
      for (var i = 0; i < $scope.organigrama.length; i++) {
          if ($scope.organigrama[i]._id == id)
          {
              return $scope.organigrama[i];
          }
      }  
    };
    
    $scope.nivelDeCarga = function (indicador) {
        var total = 0;
        if (indicador.jurisdiccion) total = total + 1;
        if (indicador.titulo) total = total + 1;
        if (indicador.compromisos) {
            total = total + 1;
            if (indicador.compromisos.length > 0) {
                total = total + 1;
            }
            if (indicador.compromisos.length > 3) {
                total = total + 1;
            }
        }
        if (total < 2) {
            return 0;
        } else if (total > 4) {
            return 100;
        } else {
            return 50;
        }
    };
    
    $scope.$watch('filtrados.length', function(d) {
        if ($scope.filtrados) {
            if (($scope.filtrados.length != $scope.filtradosAnt) || ($scope.filtro.jurisdiccion != $scope.filtroAnt)) {
                $scope.filtradosAnt = $scope.filtrados.length;
                $scope.filtroAnt = $scope.filtro.jurisdiccion;
                $scope.total = 0;
                angular.forEach($scope.filtrados, function(b) {
                    if (b.compromisos) {
                        $scope.total = $scope.total + b.compromisos.length;
                    }
                });
            }
        } else {
            $scope.total = 0;
        }
    });
})
.controller('CartaSEMGNuevoCtrl', function($scope, $location, $http, SEMGCartaCompromiso, ORMTema, Contactos, ORMOrganigrama, User, $modal, $routeParams) {
	$scope.carta = new SEMGCartaCompromiso({anio : parseInt($routeParams.anio)});
	if (!$scope.hasPermission('semg.editar')) {
        var user = User.findByName({
            username: $scope.username
        }, function() {
            $scope.carta.jurisdiccion = user.jurisdiccion;
        });
	}
	$scope.temas = ORMTema.query();
    $scope.anio = $routeParams.anio;
	$scope.contactos = Contactos.listar();
	$scope.organigrama = ORMOrganigrama.query();
    $scope.tab = "datos";
    $scope.carta.validado = false;
    $scope.carta.aprobado = false;
    
    $scope.data = {
        serviciosTramites : '',
        compromisoResultado : '',
        medidaUnidad : '',
        responsable : '',
        fuente : '',
        destinatario : '',
        justificacion : '',
        indicador : '',
        semestre1 : '',
        semestre2 : '',
        procedimiento : ''
    };
    
    $scope.mostrarTema = function (r) {
        if (r.eliminado) {
            return false; 
        } else {
            return true;
        }
    };

    $scope.agregarComen = function(confirmado, data) {
        if (confirmado) {
            $scope.carta.comentarios.push(data);
        }
        else {
            if (!$scope.carta.comentarios){
                $scope.carta.comentarios = [];
            }
            var modalScope = $scope.$new();
            
            modalScope.data = {
                descripcion: '',
                cuando:undefined
            };
            $modal({template: '/views/semg/agregarComentario.html', persist: true, show: true, backdrop: 'static', scope: modalScope});
        }
    };
    
    $scope.eliminarListaElem = function(elemento, lista) {
        if (confirm("Esta seguro de borrar este elemento?")) {
            lista.splice(lista.indexOf(elemento), 1);
        }
    };
    
    $scope.organigramaPorId = function (id) {
      for (var i = 0; i < $scope.organigrama.length; i++) {
          if ($scope.organigrama[i]._id == id)
          {
              return $scope.organigrama[i];
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
    
    //Agregar temas
    $scope.agregarTema = function(dataTema) {
        if (!$scope.carta.temas) {
            $scope.carta.temas = [];
        }
        $scope.carta.temas.push(dataTema);
        $scope.dataTema = "";
    };
    
    $scope.eliminarListaElem = function(elemento, lista) {
        if (confirm("Esta seguro de borrar este elemento?")) {
            lista.splice(lista.indexOf(elemento), 1);
        }
    };
    
    $scope.reverse = function(array) {
        var copy = [].concat(array);
        return copy.reverse();
    };
    
    $scope.eliminarElemento = function(array,elemento) {
        var indice = array.indexOf(elemento);
        if(indice!=-1) array.splice(indice, 1);
    };
	
	$scope.guardar = function() {
        if (!$scope.hasPermission('semg.editar')) {
            if (!$scope.carta.modifica) {
                $scope.carta.modifica = [];
            }
            $scope.carta.modifica.push({usuario: $scope.username, fecha: new Date()});
            if ($scope.carta.modifica.length > 5) {
                $scope.carta.modifica.shift();
            }
        }
        $scope.carta.$save();
	};
	
	
    
    $scope.agregarCompro = function(confirmado) {
        if (confirmado) {
            if (!$scope.carta.compromisos) {
                $scope.carta.compromisos = [];
            }
            $scope.carta.compromisos.push($scope.data);
            $scope.data = {
                serviciosTramites : '',
                compromisoResultado : '',
                medidaUnidad : '',
                responsable : '',
                fuente : '',
                destinatario : '',
                justificacion : '',
                indicador : '',
                semestre1 : '',
                semestre2 : '',
                procedimiento : ''
            };
        }
        else {
            $("#nuevoCompromiso").modal('show');
        }
    };
    
    $scope.editarCompromiso = function(compromiso) {
        $scope.comproEdit = compromiso;
        $("#editarCompromiso").modal('show');
    };
})
.controller('CartaSEMGDetalleCtrl', function($scope, $location, $http, SEMGCartaCompromiso, ORMTema, Contactos, ORMOrganigrama, User, $modal, $routeParams) {

    $scope.carta = SEMGCartaCompromiso.get({_id : $routeParams._id});
    
    $scope.user = User.findByName({
        username: $scope.username
    });
    
    $scope.data = {
        serviciosTramites : '',
        compromisoResultado : '',
        medidaUnidad : '',
        responsable : '',
        fuente : '',
        destinatario : '',
        justificacion : '',
        indicador : '',
        semestre1 : '',
        semestre2 : '',
        procedimiento : ''
    };
    
	$scope.temas = ORMTema.query();
	$scope.contactos = Contactos.listar();
	$scope.organigrama = ORMOrganigrama.query();
    $scope.tab = "datos";
    $scope.anio = $routeParams.anio;
    
    $scope.temaPorId = function (id) {
      for (var i = 0; i < $scope.temas.length; i++) {
          if ($scope.temas[i]._id == id)
          {
              return $scope.temas[i];
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
    
    $scope.agregarComen = function(confirmado, data) {
        if (confirmado) {
            $scope.carta.comentarios.push(data);
        }
        else {
            if (!$scope.carta.comentarios){
                $scope.carta.comentarios = [];
            }
            var modalScope = $scope.$new();
            
            modalScope.data = {
                descripcion: '',
                quien: '',
                cuando:undefined
            };
            $modal({template: '/views/semg/cartascompromisos/agregarComentario.html', persist: true, show: true, backdrop: 'static', scope: modalScope});
        }
    };
    
    $scope.reverse = function(array) {
        var copy = [].concat(array);
        return copy.reverse();
    };
    
    $scope.editar = function() {
        $scope.editando = true;
    };
    
    $scope.eliminarElemento = function(array,elemento) {
        var indice = array.indexOf(elemento);
        if(indice!=-1) array.splice(indice, 1);
    };
    
    $scope.eliminarListaElem = function(elemento, lista) {
        if (confirm("Esta seguro de borrar este elemento?")) {
            lista.splice(lista.indexOf(elemento), 1);
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
    
    $scope.organigramaPorId = function (id) {
      for (var i = 0; i < $scope.organigrama.length; i++) {
          if ($scope.organigrama[i]._id == id)
          {
              return $scope.organigrama[i];
          }
      }  
    };
    
    //Agregar temas
    $scope.agregarTema = function(dataTema) {
        if (!$scope.carta.temas) {
            $scope.carta.temas = [];
        }
        $scope.carta.temas.push(dataTema);
        $scope.dataTema = "";
    };
    
    $scope.eliminarListaElem = function(elemento, lista) {
        if (confirm("Esta seguro de borrar este elemento?")) {
            lista.splice(lista.indexOf(elemento), 1);
        }
    };
    
    $scope.reverse = function(array) {
        var copy = [].concat(array);
        return copy.reverse();
    };
    
    $scope.dameFrecuencia = function (frecuencia) {
        if (frecuencia == "7") {
            return "Semanal";
        } else if (frecuencia == "30") {
            return "Mensual";
        } else if (frecuencia == "90") {
            return "Trimestral";
        } else if (frecuencia == "180") {
            return "Semestral";
        } else if (frecuencia == "365") {
            return "Anual";
        } else if (frecuencia == "0") {
            return "Eventual";
        }
    };
    
    /*$scope.agregarComen = function(confirmado, data) {
        if (confirmado) {
            $scope.carta.comentarios.push(data);
        }
        else {
            if (!$scope.carta.comentarios){
                $scope.carta.comentarios = [];
            }
            var modalScope = $scope.$new();
            
            modalScope.data = {
                descripcion: '',
                cuando:undefined
            };
            $modal({template: '/views/semg/agregarComentario.html', persist: true, show: true, backdrop: 'static', scope: modalScope});
        }
    };*/
    
    $scope.guardar = function(){
        if (!$scope.hasPermission('semg.editar')) {
            if (!$scope.carta.modifica) {
                $scope.carta.modifica = [];
            }
            $scope.carta.modifica.push({usuario: $scope.username, fecha: new Date()});
            if ($scope.carta.modifica.length > 5) {
                $scope.carta.modifica.shift();
            }
        }
        $scope.carta.$save();
    };
    
    $scope.eliminarElemento = function(array,elemento) {
        var indice = array.indexOf(elemento);
        if(indice!=-1) array.splice(indice, 1);
    };
    
    $scope.eliminar = function(confirmado) {
        if (confirmado) {
            $scope.carta.$delete(function() {
                $location.url('/semg/cartascompromisos');
            });
        }
        else {
            $("#confirmarEliminar").modal('show');
        }
    };
    
    $scope.agregarCompro = function(confirmado) {
        if (confirmado) {
            if (!$scope.carta.compromisos) {
                $scope.carta.compromisos = [];
            }
            $scope.carta.compromisos.push($scope.data);
            $scope.data = {
                serviciosTramites : '',
                compromisoResultado : '',
                medidaUnidad : '',
                responsable : '',
                fuente : '',
                destinatario : '',
                justificacion : '',
                indicador : '',
                semestre1 : '',
                semestre2 : '',
                procedimiento : ''
            };
        }
        else {
            $("#nuevoCompromiso").modal('show');
        }
    };
    
    $scope.editarCompromiso = function(compromiso) {
        $scope.comproEdit = compromiso;
        $("#editarCompromiso").modal('show');
    };
})
.controller('CartaSEMGMonitoreoCtrl', function($scope, $location, $http, SEMGCartaCompromiso, ORMOrganigrama, SEMGCCMonitoreo, User, $modal, $routeParams, Jurisdicciones) {
	$scope.filtro = {jurisdiccion : ''};
    $scope.anio = $routeParams.anio;
	if ($routeParams._id != 0) {
    	$scope.carta = SEMGCartaCompromiso.get({
            _id : $routeParams._id
        });
    	$scope.monitoreo = SEMGCCMonitoreo.query({carta : $routeParams._id, anio : $routeParams.anio}, function() {
            if (!$scope.monitoreo.length) {
                $scope.monitoreo = new SEMGCCMonitoreo({
                    carta : $routeParams._id,
                    compromisos : [],
                    medidaAccion : [],
                    anio : parseInt($routeParams.anio)
                });
            } else {
                $scope.monitoreo = $scope.monitoreo[0];
            }
    	});
        $scope.cartas = SEMGCartaCompromiso.query({anio : $routeParams.anio});
	} else {
	    if (!$scope.hasPermission('semg.editar')) {
            $scope.user = User.findByName({
                username: $scope.username
            }, function() {
                if ($scope.user.jurisdiccion) {
                    $scope.cartas = SEMGCartaCompromiso.query({jurisdiccion:$scope.user.jurisdiccion, anio : $routeParams.anio});
                }
            });
	    } else {
            $scope.cartas = SEMGCartaCompromiso.query({anio : $routeParams.anio});
	    }
	}
	
	$scope.nivelDeCarga = function (i) {
        var total = 0;
        angular.forEach(i.compromisos, function(c) {
            if (c.cumplimientoSemestre1) {
                total = total + 1;
            }
        });
        if (total < i.compromisos.length) {
            return 0;
        } else {
            return 100;
        }
    };
	
    $scope.eligeCarta = function(carta) {
        $scope.carta = SEMGCartaCompromiso.get({
            _id : carta
        });
    	$scope.monitoreo = SEMGCCMonitoreo.query({carta : carta, anio : $routeParams.anio}, function() {
            if (!$scope.monitoreo.length) {
                $scope.monitoreo = new SEMGCCMonitoreo({
                    carta : carta,
                    compromisos : [],
                    medidaAccion : [],
                    anio : parseInt($routeParams.anio)
                });
            } else {
                $scope.monitoreo = $scope.monitoreo[0];
            }
    	});
    };
	
	$scope.data = {
        compromiso : '',
        presupuesto : {valor:'', comentario:'', importancia:'', intensidad:0},
        infraestructura : {valor:'', comentario:'', importancia:'', intensidad:0},
        personal : {valor:'', comentario:'', importancia:'', intensidad:0},
        accesoInfo : {valor:'', comentario:'', importancia:'', intensidad:0},
        coordinacionEquipo : {valor:'', comentario:'', importancia:'', intensidad:0},
        dificultades : {valor:'', comentario:'', importancia:'', intensidad:0},
        coordinacionVertical : {valor:'', comentario:'', importancia:'', intensidad:0},
        coordinacionHorizontal : {valor:'', comentario:'', importancia:'', intensidad:0},
        coordinacionActores : {valor:'', comentario:'', importancia:'', intensidad:0},
        otros : {valor:'', comentario:'', importancia:'', intensidad:0}
    };
	
	$scope.dataAccion = {
        compromiso:'',
        texto:''
	};
	
    $scope.soloNumeros = function(cadenaAnalizar) {
        if (cadenaAnalizar) {
            var nuevoString = "";
            for (var i = 0; i< cadenaAnalizar.length; i++) {
                 var caracter = cadenaAnalizar.charAt(i);
                 if( caracter == "0" || caracter == "1" || caracter == "2" || caracter == "3" || caracter == "4" || caracter == "5" || caracter == "6" || caracter == "7" || caracter == "8" || caracter == "9") {
                    nuevoString = nuevoString + caracter;
                  }
                 if( caracter == ",") {
                    nuevoString = nuevoString + ".";
                  }
            }
            return nuevoString;
        } else {
            return "";
        }
    };
    
    $scope.porcentaje = function(meta, carga) {
        return Math.round(100/$scope.soloNumeros(meta)*$scope.soloNumeros(carga));
    };
    
    $scope.gradoAvance = function(meta, cumplimiento) {
        return Math.round(($scope.soloNumeros(cumplimiento)*100)/$scope.soloNumeros(meta));
    };
    
    $scope.monitoreos = SEMGCCMonitoreo.query({anio : $routeParams.anio});
    
    $scope.monitoreoAprobadoPorCarta = function (id) {
      for (var i = 0; i < $scope.monitoreos.length; i++) {
          if ($scope.monitoreos[i].carta == id)
          {
              if ($scope.monitoreos[i].aprobado) {
                  return true;
              } else {
                  return false;
              }
          }
      }
      return false;
    };
    
    $scope.monitoreoPorCarta = function (id) {
      for (var i = 0; i < $scope.monitoreos.length; i++) {
          if ($scope.monitoreos[i].carta == id) {
              return $scope.monitoreos[i];
          }
      }
      return false;
    };
    
    $scope.modalInforme = function(confirmado, id) {
        if (confirmado) {
            if ($scope.uploaded.length) {
                $scope.monitoreoSeleccionado.informeId = $scope.uploaded.pop().id;
                $scope.monitoreoSeleccionado.$save({}, function() {
                    $scope.uploaded = [];
                });
            }
        }
        else {
            $scope.monitoreoSeleccionado = $scope.monitoreoPorCarta(id);
            $scope.uploaded = [];
            if ($scope.monitoreoSeleccionado) {
                $modal({template: '/views/semg/cartascompromisos/modalInforme.html', persist: true, show: true, backdrop: 'static', scope: $scope});
            } else {
                alert("No se registra monitoreo cargado");
            }
        }
    };
    
	$scope.organigrama = ORMOrganigrama.query();
    
    $scope.organigramaPorId = function (id) {
      for (var i = 0; i < $scope.organigrama.length; i++) {
          if ($scope.organigrama[i]._id == id)
          {
              return $scope.organigrama[i];
          }
      }  
    };
    
    $scope.cartaPorId = function (id) {
      for (var i = 0; i < $scope.cartas.length; i++) {
          if ($scope.cartas[i]._id == id)
          {
              return $scope.cartas[i];
          }
      }  
    };
    
    $scope.verFact = function(elemento) {
        $scope.elemento = elemento;
        $("#verFactores").modal('show');
    };
    
    $scope.agregarData = function(data, array) {
        array.push(data);
        $scope.data = {
            compromiso : '',
            presupuesto : {valor:'', comentario:'', importancia:'', intensidad:0},
            infraestructura : {valor:'', comentario:'', importancia:'', intensidad:0},
            personal : {valor:'', comentario:'', importancia:'', intensidad:0},
            accesoInfo : {valor:'', comentario:'', importancia:'', intensidad:0},
            coordinacionEquipo : {valor:'', comentario:'', importancia:'', intensidad:0},
            dificultades : {valor:'', comentario:'', importancia:'', intensidad:0},
            coordinacionVertical : {valor:'', comentario:'', importancia:'', intensidad:0},
            coordinacionHorizontal : {valor:'', comentario:'', importancia:'', intensidad:0},
            coordinacionActores : {valor:'', comentario:'', importancia:'', intensidad:0},
            otros : {valor:'', comentario:'', importancia:'', intensidad:0}
        };
        $scope.elemento = array[array.length - 1];
        $("#verFactores").modal('show');
    };
    
    $scope.eliminarListaElem = function(elemento, lista) {
        if (confirm("Esta seguro de borrar este elemento?")) {
            lista.splice(lista.indexOf(elemento), 1);
        }
    };
    
    $scope.importancia = function (compromiso, valor) {
        var uno = true;
        var dos = true;
        var tres = true;
        if ((compromiso.presupuesto.importancia == '1') || (compromiso.accesoInfo.importancia == '1') || (compromiso.infraestructura.importancia == '1') || (compromiso.personal.importancia == '1') || (compromiso.coordinacionEquipo.importancia == '1') || (compromiso.dificultades.importancia == '1') || (compromiso.coordinacionVertical.importancia == '1') || (compromiso.coordinacionHorizontal.importancia == '1') || (compromiso.coordinacionActores.importancia == '1') || (compromiso.otros.importancia == '1')) {
            uno = false;
        }
        if ((compromiso.presupuesto.importancia == '2') || (compromiso.accesoInfo.importancia == '2') || (compromiso.infraestructura.importancia == '2') || (compromiso.personal.importancia == '2') || (compromiso.coordinacionEquipo.importancia == '2') || (compromiso.dificultades.importancia == '2') || (compromiso.coordinacionVertical.importancia == '2') || (compromiso.coordinacionHorizontal.importancia == '2') || (compromiso.coordinacionActores.importancia == '2') || (compromiso.otros.importancia == '2')) {
            dos = false;
        }
        if ((compromiso.presupuesto.importancia == '3') || (compromiso.accesoInfo.importancia == '3') || (compromiso.infraestructura.importancia == '3') || (compromiso.personal.importancia == '3') || (compromiso.coordinacionEquipo.importancia == '3') || (compromiso.dificultades.importancia == '3') || (compromiso.coordinacionVertical.importancia == '3') || (compromiso.coordinacionHorizontal.importancia == '3') || (compromiso.coordinacionActores.importancia == '3') || (compromiso.otros.importancia == '3')) {
            tres = false;
        }
        if (valor == '1') {
            if (dos) {
                return '2';
            } else if (tres) {
                return '3';
            } else {
                return '';
            }
        }
        if (valor == '2') {
            if (tres) {
                return '3';
            } else {
                return '';
            }
        }
        if (valor == '3') {
            return '';
        }
        if (valor === '') {
            if (uno) {
                return '1';
            } else if (dos) {
                return '2';
            } else if (tres) {
                return '3';
            } else {
                return '';
            }
        }
    };
    
    $scope.modificar = function() {
        $scope.editando = true;
    };
    
    $scope.guardar = function() {
        if (!$scope.hasPermission('semg.editar')) {
            if (!$scope.monitoreo.modifica) {
                $scope.monitoreo.modifica = [];
            }
            $scope.monitoreo.modifica.push({usuario: $scope.username, fecha: new Date()});
            if ($scope.monitoreo.modifica.length > 5) {
                $scope.monitoreo.modifica.shift();
            }
        }
        $scope.monitoreo.$save({}, function() {
            $scope.carta.$save();
        });
    };
})
.controller('CartaSEMGEvaluacionCtrl', function($scope, $location, $http, SEMGCartaCompromiso, ORMOrganigrama, SEMGCCEvaluacion, User, $modal, $routeParams, Jurisdicciones) {
	
	if ($routeParams._id != 0) {
        $scope.carta = SEMGCartaCompromiso.get({
            _id : $routeParams._id
        });
    	$scope.evaluacion = SEMGCCEvaluacion.query({carta : $routeParams._id, anio : $routeParams.anio}, function() {
            if (!$scope.evaluacion.length) {
                $scope.evaluacion = new SEMGCCEvaluacion({
                    carta : $routeParams._id,
                    compromisosDificultaron : [],
                    compromisosFacilitaron : [],
                    acciones : [],
                    medidaAccion : '',
                    anio : parseInt($routeParams.anio)
                });
            } else {
                $scope.evaluacion = $scope.evaluacion[0];
            }
    	});
	} else {
	    if (!$scope.hasPermission('semg.editar')) {
            $scope.user = User.findByName({
                username: $scope.username
            }, function() {
                if ($scope.user.jurisdiccion) {
                    $scope.cartas = SEMGCartaCompromiso.query({jurisdiccion:$scope.user.jurisdiccion, anio : $routeParams.anio});
                }
            });
	    } else {
            $scope.cartas = SEMGCartaCompromiso.query({anio : $routeParams.anio});
	    }
	}
	
    $scope.eligeCarta = function(carta) {
        $scope.carta = SEMGCartaCompromiso.get({
            _id : carta
        });
    	$scope.evaluacion = SEMGCCEvaluacion.query({carta : carta, anio : $routeParams.anio}, function() {
            if (!$scope.evaluacion.length) {
                $scope.evaluacion = new SEMGCCEvaluacion({
                    carta : carta,
                    compromisosDificultaron : [],
                    compromisosFacilitaron : [],
                    acciones : [],
                    medidaAccion : '',
                    anio : parseInt($routeParams.anio)
                });
            } else {
                $scope.evaluacion = $scope.evaluacion[0];
            }
    	});
    };
    $scope.anio = $routeParams.anio;
	
	$scope.data = {
        compromiso : '',
        presupuesto : {valor:'', comentario:'', importancia:'', intensidad:0},
        infraestructura : {valor:'', comentario:'', importancia:'', intensidad:0},
        personal : {valor:'', comentario:'', importancia:'', intensidad:0},
        accesoInfo : {valor:'', comentario:'', importancia:'', intensidad:0},
        coordinacionEquipo : {valor:'', comentario:'', importancia:'', intensidad:0},
        dificultades : {valor:'', comentario:'', importancia:'', intensidad:0},
        coordinacionVertical : {valor:'', comentario:'', importancia:'', intensidad:0},
        coordinacionHorizontal : {valor:'', comentario:'', importancia:'', intensidad:0},
        otros : {valor:'', comentario:'', importancia:'', intensidad:0}
    };
	
	$scope.datos = {
        compromiso : '',
        prioridad : '',
        factores : '',
        comentarios : '',
        dependencia : '',
        periodo : ''
    };
    
    $scope.color = function () {
        return 'btn-success';
    };
    
    $scope.importancia = function (compromiso, valor) {
        var uno = true;
        var dos = true;
        var tres = true;
        if ((compromiso.presupuesto.importancia == '1') || (compromiso.accesoInfo.importancia == '1') || (compromiso.infraestructura.importancia == '1') || (compromiso.personal.importancia == '1') || (compromiso.coordinacionEquipo.importancia == '1') || (compromiso.dificultades.importancia == '1') || (compromiso.coordinacionVertical.importancia == '1') || (compromiso.coordinacionHorizontal.importancia == '1') || (compromiso.otros.importancia == '1')) {
            uno = false;
        }
        if ((compromiso.presupuesto.importancia == '2') || (compromiso.accesoInfo.importancia == '2') || (compromiso.infraestructura.importancia == '2') || (compromiso.personal.importancia == '2') || (compromiso.coordinacionEquipo.importancia == '2') || (compromiso.dificultades.importancia == '2') || (compromiso.coordinacionVertical.importancia == '2') || (compromiso.coordinacionHorizontal.importancia == '2') || (compromiso.otros.importancia == '2')) {
            dos = false;
        }
        if ((compromiso.presupuesto.importancia == '3') || (compromiso.accesoInfo.importancia == '3') || (compromiso.infraestructura.importancia == '3') || (compromiso.personal.importancia == '3') || (compromiso.coordinacionEquipo.importancia == '3') || (compromiso.dificultades.importancia == '3') || (compromiso.coordinacionVertical.importancia == '3') || (compromiso.coordinacionHorizontal.importancia == '3') || (compromiso.otros.importancia == '3')) {
            tres = false;
        }
        if (valor == '1') {
            if (dos) {
                return '2';
            } else if (tres) {
                return '3';
            } else {
                return '';
            }
        }
        if (valor == '2') {
            if (tres) {
                return '3';
            } else {
                return '';
            }
        }
        if (valor == '3') {
            return '';
        }
        if (valor === '') {
            if (uno) {
                return '1';
            } else if (dos) {
                return '2';
            } else if (tres) {
                return '3';
            } else {
                return '';
            }
        }
    };
    
    $scope.soloNumeros = function(cadenaAnalizar) {
        if (cadenaAnalizar) {
            var nuevoString = "";
            for (var i = 0; i< cadenaAnalizar.length; i++) {
                 var caracter = cadenaAnalizar.charAt(i);
                 if( caracter == "0" || caracter == "1" || caracter == "2" || caracter == "3" || caracter == "4" || caracter == "5" || caracter == "6" || caracter == "7" || caracter == "8" || caracter == "9") {
                    nuevoString = nuevoString + caracter;
                  }
                 if( caracter == ",") {
                    nuevoString = nuevoString + ".";
                  }
            }
            return nuevoString;
        } else {
            return "";
        }
    };
    
    $scope.porcentaje = function(meta, carga) {
        if ((meta == 0) || (meta == '0') || (carga == 0) || (carga =='0')) {
            return 0;
        } else {
            return Math.round(100/$scope.soloNumeros(meta)*$scope.soloNumeros(carga));
        }
    };
    
	$scope.organigrama = ORMOrganigrama.query();
    
    $scope.organigramaPorId = function (id) {
      for (var i = 0; i < $scope.organigrama.length; i++) {
          if ($scope.organigrama[i]._id == id)
          {
              return $scope.organigrama[i];
          }
      }  
    };
    
    $scope.modalEditar = function(elemento) {
        $scope.accion = elemento;
        $("#modalAccion").modal('show');
    };
    
    $scope.verFact = function(elemento, valor) {
        $scope.dificultaron = valor;
        $scope.elemento = elemento;
        $("#verFactores").modal('show');
    };
    
    $scope.agregarData = function(data, array, valor) {
        $scope.dificultaron = valor;
        array.push(data);
        $scope.data = {
            compromiso : '',
            presupuesto : {valor:'', comentario:'', importancia:'', intensidad:0},
            infraestructura : {valor:'', comentario:'', importancia:'', intensidad:0},
            personal : {valor:'', comentario:'', importancia:'', intensidad:0},
            accesoInfo : {valor:'', comentario:'', importancia:'', intensidad:0},
            coordinacionEquipo : {valor:'', comentario:'', importancia:'', intensidad:0},
            dificultades : {valor:'', comentario:'', importancia:'', intensidad:0},
            coordinacionVertical : {valor:'', comentario:'', importancia:'', intensidad:0},
            coordinacionHorizontal : {valor:'', comentario:'', importancia:'', intensidad:0},
            otros : {valor:'', comentario:'', importancia:'', intensidad:0}
        };
        $scope.elemento = array[array.length - 1];
        $("#verFactores").modal('show');
    };
    
    $scope.cumplidas = function() {
        var cant = 0;
        angular.forEach($scope.carta.compromisos, function(b) {
            if ($scope.color(b)=='btn-success') {
                cant = cant + 1;
            }
        });
        return cant;
    };
    
    $scope.agregarAccion = function(datos) {
        $scope.evaluacion.acciones.push(datos);
        $scope.datos = {
            compromiso : '',
            prioridad : '',
            factores : '',
            comentarios : '',
            dependencia : '',
            periodo : ''
        };
    };
    
    $scope.eliminarListaElem = function(elemento, lista) {
        if (confirm("Esta seguro de borrar este elemento?")) {
            lista.splice(lista.indexOf(elemento), 1);
        }
    };
    
    $scope.modificar = function() {
        $scope.editando = true;
    };
    
    $scope.guardar = function() {
        if (!$scope.hasPermission('semg.editar')) {
            if (!$scope.evaluacion.modifica) {
                $scope.evaluacion.modifica = [];
            }
            $scope.evaluacion.modifica.push({usuario: $scope.username, fecha: new Date()});
            if ($scope.evaluacion.modifica.length > 5) {
                $scope.evaluacion.modifica.shift();
            }
        }
        $scope.evaluacion.$save({}, function() {
            $scope.carta.$save();
        });
    };
})
.controller('CartaSEMGPlanDesarrolloCtrl', function($scope, $location, $http, SEMGCartaCompromiso, ORMOrganigrama, SEMGPlanDesarrolloCC, User, $modal, $routeParams, Jurisdicciones) {
    
	$scope.servicios = [];
    $scope.anio = $routeParams.anio;
	$scope.carta = SEMGCartaCompromiso.get({
        _id : $routeParams._id
    }, function() {
        angular.forEach($scope.carta.compromisos, function(b) {
            if ($scope.servicios.indexOf(b.serviciosTramites) == -1) {
                $scope.servicios.push(b.serviciosTramites);
            }
        });
    });
	$scope.plan = SEMGPlanDesarrolloCC.query({carta : $routeParams._id, anio : $routeParams.anio}, function() {
        if (!$scope.plan.length) {
            $scope.plan = new SEMGPlanDesarrolloCC({
                carta : $routeParams._id,
                indicadores : [],
                anio : parseInt($routeParams.anio)
            });
        } else {
            $scope.plan = $scope.plan[0];
        }
	});
	
	$scope.data = {
        compromiso:'',
        indicador:'',
        necesidades:'',
        tiempoDesarrollo:''
	};
    
	$scope.organigrama = ORMOrganigrama.query();
    
    $scope.organigramaPorId = function (id) {
      for (var i = 0; i < $scope.organigrama.length; i++) {
          if ($scope.organigrama[i]._id == id)
          {
              return $scope.organigrama[i];
          }
      }  
    };
    
    $scope.eliminarListaElem = function(elemento, lista) {
        if (confirm("Esta seguro de borrar este elemento?")) {
            lista.splice(lista.indexOf(elemento), 1);
        }
    };
    
    $scope.modificar = function() {
        $scope.editando = true;
    };
    
    $scope.guardar = function() {
        if (!$scope.hasPermission('semg.editar')) {
            if (!$scope.plan.modifica) {
                $scope.plan.modifica = [];
            }
            $scope.plan.modifica.push({usuario: $scope.username, fecha: new Date()});
            if ($scope.plan.modifica.length > 5) {
                $scope.plan.modifica.shift();
            }
        }
        $scope.plan.$save();
    };
})
.controller('CartaSEMGPlanSistematizacionCtrl', function($scope, $location, $http, SEMGCartaCompromiso, ORMOrganigrama, SEMGPlanSistematizacionCC, User, $modal, $routeParams, Jurisdicciones) {
    
	$scope.compromisos = [];
    $scope.anio = $routeParams.anio;
	$scope.carta = SEMGCartaCompromiso.get({
        _id : $routeParams._id
    }, function() {
        angular.forEach($scope.carta.compromisos, function(b) {
            if ($scope.compromisos.indexOf(b.compromisoResultado) == -1) {
                $scope.compromisos.push(b.compromisoResultado);
            }
        });
    });
	$scope.plan = SEMGPlanSistematizacionCC.query({carta : $routeParams._id, anio : $routeParams.anio}, function() {
        if (!$scope.plan.length) {
            $scope.plan = new SEMGPlanSistematizacionCC({
                carta : $routeParams._id,
                compromisos : [],
                anio : parseInt($routeParams.anio)
            });
        } else {
            $scope.plan = $scope.plan[0];
        }
	});
	
	$scope.data = {
        compromiso:'',
        sistema:'',
        caracteristicas:'',
        tiempoDesarrollo:''
	};
    
	$scope.organigrama = ORMOrganigrama.query();
    
    $scope.organigramaPorId = function (id) {
      for (var i = 0; i < $scope.organigrama.length; i++) {
          if ($scope.organigrama[i]._id == id)
          {
              return $scope.organigrama[i];
          }
      }  
    };
    
    $scope.eliminarListaElem = function(elemento, lista) {
        if (confirm("Esta seguro de borrar este elemento?")) {
            lista.splice(lista.indexOf(elemento), 1);
        }
    };
    
    $scope.modificar = function() {
        $scope.editando = true;
    };
    
    $scope.guardar = function() {
        if (!$scope.hasPermission('semg.editar')) {
            if (!$scope.plan.modifica) {
                $scope.plan.modifica = [];
            }
            $scope.plan.modifica.push({usuario: $scope.username, fecha: new Date()});
            if ($scope.plan.modifica.length > 5) {
                $scope.plan.modifica.shift();
            }
        }
        $scope.plan.$save();
    };
})
.controller('CartaSEMGImprimirTablaCtrl', function($scope, $http, $routeParams, ORMOrganigrama, SEMGCartaCompromiso, ORMTema, Contactos, $window) 
{
    $scope.jurisdicciones = ORMOrganigrama.query();  
    $scope.carta = SEMGCartaCompromiso.get({_id : $routeParams._id});
    $scope.organigrama = ORMOrganigrama.query();
    $scope.temas = ORMTema.query();
    $scope.contactos = Contactos.listar();
    $scope.anio = $routeParams.anio;
    
    $scope.jurisdiccionPorId = function (id) 
	{
      for (var i = 0; i < $scope.jurisdicciones.length; i++) 
      {
          if ($scope.jurisdicciones[i]._id == id)
          {
              return $scope.jurisdicciones[i];
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
    
    $scope.organigramaPorId = function (id) 
    {
      for (var i = 0; i < $scope.organigrama.length; i++) 
      {
          if ($scope.organigrama[i]._id == id)
          {
              return $scope.organigrama[i];
          }
      }  
    };
    
    $scope.temaPorId = function (id) 
    {
      for (var i = 0; i < $scope.temas.length; i++) 
      {
          if ($scope.temas[i]._id == id)
          {
              return $scope.temas[i];
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
    
    $scope.imprimir = function() {
        $window.print();
    };
})
.controller('ActualizacionesSEMGCtrl', function($scope, $http, $routeParams, ORMOrganigrama, SEMGCartaCompromiso, ORMTema, Contactos, $window, SEMGIndicador) 
{
    $scope.cartas = [];
    $scope.indicadores = [];
    $scope.anio = $routeParams.anio;
    var cartas = SEMGCartaCompromiso.query({anio : $routeParams.anio}, function() {
        angular.forEach(cartas, function(c) {
            if (c.modifica) {
                c.fechaUltMod = c.modifica[c.modifica.length-1].fecha;
                c.usuarioUltMod = c.modifica[c.modifica.length-1].usuario;
                $scope.cartas.push(c);
            }
        });
    });
    var indicadores = SEMGIndicador.query({anio : $routeParams.anio}, function() {
        angular.forEach(indicadores, function(i) {
            if (i.modifica) {
                i.fechaUltMod = i.modifica[i.modifica.length-1].fecha;
                i.usuarioUltMod = i.modifica[i.modifica.length-1].usuario;
                i.jurisdiccion = i.dependencia;
                $scope.indicadores.push(i);
            }
        });
    });
    $scope.organigrama = ORMOrganigrama.query();
    $scope.contactos = Contactos.listar();
    
    $scope.organigramaPorId = function (id) 
    {
      for (var i = 0; i < $scope.organigrama.length; i++) 
      {
          if ($scope.organigrama[i]._id == id)
          {
              return $scope.organigrama[i];
          }
      }  
    };
    
    $scope.masCero = function (num) {
        if (num < 10) {
            return ("0" + num);
        } else {
            return num;
        }
    };
    
    $scope.fechaYhora = function (fecha) {
        var f = new Date(fecha);
        return ($scope.masCero(f.getDate()) + "/" + $scope.masCero(f.getMonth() +1) + "/" + f.getFullYear() + " - " + $scope.masCero(f.getHours()) + ":" + $scope.masCero(f.getMinutes()) + "hs");
    };
});
