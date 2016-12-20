angular.module('bag2.facts', [])
.controller('FactCtrl', function($scope, $location, $http, Fact, User, $modal, $routeParams) {
	$scope.facts = Fact.query();
    $scope.orden = 'numero';
    var hoy = new Date();
    $scope.fechaHoy = hoy.getTime();
    
    $scope.aMilisegundos = function(fecha) {
        var fechaDividida = fecha.split("/");
        var date = new Date(fechaDividida[2], fechaDividida[1] - 1, fechaDividida[0], 12, 0, 0, 0);
        return date.getTime();
    };
    
    $scope.estadoBAD = function (fecha, frecuencia) {
        if (fecha && frecuencia) {
            if (frecuencia != "0") {
                var diferencia = Math.round(($scope.fechaHoy - $scope.aMilisegundos(fecha)) / 86400000);
                if (diferencia > frecuencia) {
                    return (frecuencia - diferencia);
                } else {
                    return (-(diferencia - frecuencia));
                }
            } else {
                return 0;
            }
        }
    };
    
    $scope.vencido = function (fact) {
        if (fact.fuente == "BA Data") {
            if (fact.ultimaActualizacion && fact.frecuencia) {
                if ($scope.estadoBAD(fact.ultimaActualizacion, fact.frecuencia) < 0) {
                    return true;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        } else {
            if (fact.vencimiento) {
                if ($scope.aMilisegundos(fact.vencimiento) < $scope.fechaHoy) {
                    return true;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        }
    };
})
.controller('FactNuevoCtrl', function($scope, $location, $http, Fact, ORMTema, Contactos, ORMOrganigrama, User, $modal, $routeParams, IDG) {
	$scope.fact = new Fact();
	$scope.temas = ORMTema.query();
	$scope.idg = IDG.query();
	$scope.contactos = Contactos.listar();
	$scope.organigrama = ORMOrganigrama.query();
	var hoy = new Date();
    $scope.fechaHoy = hoy.getTime();
    $scope.tab = "identificacion";

    $scope.agregarComen = function(confirmado, data) {
        if (confirmado) {
            $scope.fact.comentarios.push(data);
        }
        else {
            if (!$scope.fact.comentarios){
                $scope.fact.comentarios = [];
            }
            var modalScope = $scope.$new();
            
            modalScope.data = {
                descripcion: '',
                cuando:undefined
            };
            $modal({template: '/views/fact/agregarComentario.html', persist: true, show: true, backdrop: 'static', scope: modalScope});
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
    
    $scope.aMilisegundos = function(fecha) {
        var fechaDividida = fecha.split("/");
        var date = new Date(fechaDividida[2], fechaDividida[1] - 1, fechaDividida[0], 12, 0, 0, 0);
        return date.getTime();
    };
    
    $scope.estadoBAD = function (fecha, frecuencia) {
        if (fecha && frecuencia) {
            if (frecuencia != "0") {
                var diferencia = Math.round(($scope.fechaHoy - $scope.aMilisegundos(fecha)) / 86400000);
                if (diferencia > frecuencia) {
                    return (frecuencia - diferencia);
                } else {
                    return (-(diferencia - frecuencia));
                }
            } else {
                return 0;
            }
        }
    };
    
    //Agregar temas
    $scope.agregarTema = function(dataTema) {
        if (!$scope.fact.temas) {
            $scope.fact.temas = [];
        }
        $scope.fact.temas.push(dataTema);
        $scope.dataTema = "";
    };
    
    $scope.eliminarListaElem = function(elemento, lista) {
        lista.splice(lista.indexOf(elemento), 1);
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
        $scope.fact.$save();
	};
})
.controller('FactDetalleCtrl', function($scope, $location, $http, Fact, ORMTema, Contactos, ORMOrganigrama, User, $modal, IDG, $routeParams) {
    $scope.histo = {
        fecha : '',
        valor : ''
    };
    $scope.fact = Fact.get({
        _id : $routeParams._id
    }, function(){
        if ($scope.fact.fuente) {
            if ($scope.fact.fuente == "BA Data") {
                $scope.histo.fecha = $scope.fact.ultimaActualizacion;
            } else {
                $scope.histo.fecha = $scope.fact.fecha;
            }
        }
        $scope.histo.valor = $scope.fact.valor;
    });
    
	$scope.temas = ORMTema.query();
	$scope.contactos = Contactos.listar();
	$scope.idg = IDG.query();
	$scope.organigrama = ORMOrganigrama.query();
	var hoy = new Date();
    $scope.fechaHoy = hoy.getTime();
    $scope.tab = "identificacion";
    
    $scope.temaPorId = function (id) {
      for (var i = 0; i < $scope.temas.length; i++) {
          if ($scope.temas[i]._id == id)
          {
              return $scope.temas[i];
          }
      }  
    };
    
    $scope.idgPorId = function (id) {
      for (var i = 0; i < $scope.idg.length; i++) {
          if ($scope.idg[i]._id == id)
          {
              return $scope.idg[i];
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
    
    $scope.soloNumeros = function(cadenaAnalizar) {
        var nuevoString = "";
        for (var i = 0; i< cadenaAnalizar.length; i++) {
             var caracter = cadenaAnalizar.charAt(i);
             if( caracter == "0" || caracter == "1" || caracter == "2" || caracter == "3" || caracter == "4" || caracter == "5" || caracter == "6" || caracter == "7" || caracter == "8" || caracter == "9") {
                nuevoString = nuevoString + caracter;
              }
        }
        return nuevoString;
    };
    
    $scope.altura = function (valorItem) {
        $scope.valorMax = $scope.soloNumeros($scope.fact.valor);
        valorItem = $scope.soloNumeros(valorItem);
        var n;
        for (var i = 0; i < $scope.fact.historico.length; i++) {
            n = $scope.soloNumeros($scope.fact.historico[i].valor);
            if (parseInt(n) > parseInt($scope.valorMax)) {
                $scope.valorMax = n;
            }
        }
        return ((valorItem / $scope.valorMax) * 400);
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
        if (!$scope.fact.temas) {
            $scope.fact.temas = [];
        }
        $scope.fact.temas.push(dataTema);
        $scope.dataTema = "";
    };
    
    $scope.eliminarListaElem = function(elemento, lista) {
        lista.splice(lista.indexOf(elemento), 1);
    };
    
    $scope.reverse = function(array) {
        var copy = [].concat(array);
        return copy.reverse();
    };
    
    $scope.aMilisegundos = function(fecha) {
        var fechaDividida = fecha.split("/");
        var date = new Date(fechaDividida[2], fechaDividida[1] - 1, fechaDividida[0], 12, 0, 0, 0);
        return date.getTime();
    };
    
    $scope.estadoBAD = function (fecha, frecuencia) {
        if (fecha && frecuencia) {
            if (frecuencia != "0") {
                var diferencia = Math.round(($scope.fechaHoy - $scope.aMilisegundos(fecha)) / 86400000);
                if (diferencia > frecuencia) {
                    return (frecuencia - diferencia);
                } else {
                    return (-(diferencia - frecuencia));
                }
            } else {
                return 0;
            }
        }
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
    
    $scope.agregarComen = function(confirmado, data) {
        if (confirmado) {
            $scope.fact.comentarios.push(data);
        }
        else {
            if (!$scope.fact.comentarios){
                $scope.fact.comentarios = [];
            }
            var modalScope = $scope.$new();
            
            modalScope.data = {
                descripcion: '',
                cuando:undefined
            };
            $modal({template: '/views/fact/agregarComentario.html', persist: true, show: true, backdrop: 'static', scope: modalScope});
        }
    };
    
    $scope.guardar = function(){
        if ($scope.fact.valor != $scope.histo.valor) {
            if (!$scope.fact.historico) {
                $scope.fact.historico = [];
            }
            $scope.fact.historico.push($scope.histo);
        }
        $scope.fact.$save();
    };
    
    $scope.eliminarElemento = function(array,elemento) {
        var indice = array.indexOf(elemento);
        if(indice!=-1) array.splice(indice, 1);
    };
    
    $scope.eliminar = function(confirmado) {
        if (confirmado) {
            $scope.fact.$delete(function() {
                $location.url('/fact');
            });
        }
        else {
            $("#confirmarEliminar").modal('show');
        }
    };
});
