angular.module('bag2.poa.controllers')
.controller('POARDGDetalleCtrl', function ($scope, $routeParams, $location, HitosActividades, Proyectos, Jurisdicciones, ORMOrganigrama) {
  $scope.anio = new Date().getFullYear();
  var hoy = new Date().getTime();
  
  $scope.hitos =[];
  var todosHitos = HitosActividades.query({
      eliminado: JSON.stringify({$exists: false})}, function() {
      angular.forEach(todosHitos, function (t) {
          if (t.idProyecto == $routeParams._id) {
             $scope.hitos.push(t); 
          }
      });
  });
  $scope.proyecto = Proyectos.get({
      _id : $routeParams._id
  }, function() {
      $scope.jurisdiccion = Jurisdicciones.get({
          _id : $scope.proyecto.idJurisdiccion
      }, function() {
          $scope.organigrama = ORMOrganigrama.get({
              _id : $scope.jurisdiccion.idOrmOrgangrama
          });
      });
  });
    
    $scope.aMilisegundos = function(fecha) {
        if (fecha) {
            var fechaDividida = fecha.split("/");
            var date = new Date(fechaDividida[2], fechaDividida[1] - 1, fechaDividida[0], 0, 0, 0, 0);
            return date.getTime();
        } else {
            return 0;
        }
    };
  
    $scope.dameFecha = function(hito) {
        if (hito.fechas) {
            if (hito.fechas.length) {
                return (hito.fechas[hito.fechas.length-1].fechaFin);
            } else {
                return " ";
            }
        } else {
            return " ";
        }
        
    };
  
    $scope.dameFechaInicio = function(hito) {
        if (hito.fechas) {
            if (hito.fechas.length) {
                return (hito.fechas[hito.fechas.length-1].fechaInicio);
            } else {
                return " ";
            }
        } else {
            return " ";
        }
        
    };
  
    $scope.dameFechaFin = function(hito) {
        if (hito.fechas) {
            if (hito.fechas.length) {
                return $scope.aMilisegundos(hito.fechas[hito.fechas.length-1].fechaFin);
            } else {
                return "0";
            }
        } else {
            return "0";
        }
        
    };
    
    $scope.colorEstado = function(hito) {
        if (hito.cumplida) {
            return "green";
        } else if (hito.cancelada) {
            return "black";
        } else if ($scope.dameFechaFin(hito) == "0") {
            return "#cccccc";
        } else if ($scope.dameFechaFin(hito)<hoy) {
            var masCinco = $scope.dameFechaFin(hito) + 432000000;
            if (masCinco<hoy) {
                return "red";
            } else {
                return "yellow";
            }
            return "red";
        } else if (($scope.dameFechaFin(hito)>hoy)) {
            return "green";
        }
        
    };
    
})
.controller('POARDGCtrl', function ($location, $scope, API, POAEtiqueta, Jurisdicciones, Proyectos, HitosActividades) {
  $scope.anio = new Date().getFullYear();
  var hoy = new Date().getTime();
  $scope.etiquetas = POAEtiqueta.query();
  $scope.jurisdicciones = Jurisdicciones.query({
      anio : $scope.anio
  });
  $scope.proyectos = Proyectos.query({
      eliminado: JSON.stringify({$exists: false}),
      anio : $scope.anio
  });
  $scope.hitos = HitosActividades.query({
      anio : $scope.anio,
      eliminado: JSON.stringify({$exists: false})
  });

    $scope.ordenPro = "";
    
    $scope.irDetalle = function(id) {
        $location.url('/poa/rdg/' + id);
    };
    
    $scope.tieneHitos = function(idPro) {
        var result = false;
        for (var i = 0; i < $scope.hitos.length; i++) {
            if ($scope.hitos[i].idProyecto == idPro) {
                result = true;
                break;
            }
        }
        return result;
    };
    
    $scope.orden = function() {
        if ($scope.ordenPro === "") {
            $scope.ordenPro = "orden";
        } else {
            $scope.ordenPro = "";
        }
    };
    
    $scope.colorEstadoHito = function(hito) {
        if (hito.cumplida) {
            return 3; 
        } else if (hito.cancelada) {
            return 5;
        } else if ($scope.dameFechaFin(hito) == "0") {
            return 5;
        } else if ($scope.dameFechaFin(hito)<hoy) {
            var masCinco = $scope.dameFechaFin(hito) + 432000000;
            if (masCinco<hoy) {
                return 1;
            } else {
                return 2;
            }
            return 1;
        } else if ($scope.dameFechaFin(hito)>hoy) {
            return 3;
        }
        
    };
    
    $scope.recorrerColoresHitos = function(idPro) {
        var colorcito  = 5;
        $scope.hitos.forEach(function(h) {
            if (h.idProyecto == idPro) {
                if (($scope.colorEstadoHito(h) < colorcito) && (colorcito != 1)) {
                    colorcito = $scope.colorEstadoHito(h);
                }
            }
        });
        if (colorcito == 1) {
            return 'red';
        } else if (colorcito == 2) {
            return 'yellow';
        } else if (colorcito == 3) {
            return 'green';
        } else if (colorcito == 4) {
            return 'white';
        } else {
            return '#cccccc';
        }
    };
    
    $scope.colorEstado = function(proyecto) {
        if (proyecto.cancelado) {
            return "black";
        } else if (!$scope.tieneHitos(proyecto._id)) {
            return "#cccccc";
        } else if ($scope.cumplido(proyecto._id)) {
            return "blue";
        } else {
            return $scope.recorrerColoresHitos(proyecto._id);
        }
        
    };
    
    $scope.aMilisegundos = function(fecha) {
        var fechaDividida = fecha.split("/");
        var date = new Date(fechaDividida[2], fechaDividida[1] - 1, fechaDividida[0], 0, 0, 0, 0);
        return date.getTime();
    };
  
    $scope.dameFechaFin = function(hito) {
        if (hito.fechas) {
            if (hito.fechas.length) {
                return $scope.aMilisegundos(hito.fechas[hito.fechas.length-1].fechaFin);
            } else {
                return "0";
            }
        } else {
            return "0";
        }
        
    };
    
    $scope.dameFecha = function(hito) {
        if (hito.fechas) {
            if (hito.fechas.length) {
                return hito.fechas[hito.fechas.length-1].fechaFin;
            }
        }
    };
    
    $scope.finXhitos = function(idPro) {
        var resultDia = "";
        var resultMili = 0;
        for (var i = 0; i < $scope.hitos.length; i++) {
            if ($scope.hitos[i].idProyecto == idPro) {
                if ($scope.dameFecha($scope.hitos[i])) {
                    if (resultMili < $scope.aMilisegundos($scope.dameFecha($scope.hitos[i]))) {
                        resultDia = $scope.dameFecha($scope.hitos[i]);
                        resultMili = $scope.aMilisegundos($scope.dameFecha($scope.hitos[i]));
                    }
                }
            }
        }
        return resultDia;
    };
    
    $scope.cumplido = function(idPro) {
        if ($scope.tieneHitos(idPro)) {
            var result = true;
            for (var i = 0; i < $scope.hitos.length; i++) {
                if ($scope.hitos[i].idProyecto == idPro) {
                    if (!$scope.hitos[i].cumplida) {
                        result = false;
                        break;
                    }
                }
            }
            return result;
        } else {
            false;
        }
    };
    
    $scope.$watch('filtroEtiqueta', function(newValue, oldValue) {
        if (newValue != oldValue) {
            var nuevosProyectos = [];
            $scope.proyectos = Proyectos.query({
                eliminado: JSON.stringify({$exists: false}),
                anio : 2016
            }, function() {
                if ($scope.filtroEtiqueta != "") {
                    for (var i = 0; i < $scope.proyectos.length; i++) {
                        if ($scope.proyectos[i].etiquetas) {
                            if ($scope.proyectos[i].etiquetas.indexOf($scope.filtroEtiqueta) != -1) {
                                nuevosProyectos.push($scope.proyectos[i]);
                            }
                        }
                    }
                    $scope.proyectos = nuevosProyectos;
                }
            });
        }
        
    });
    
});
