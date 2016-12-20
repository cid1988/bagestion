angular.module('bag2.dashboard', [])
.controller('DashboardCtrl', function($scope, $location, ORMTema, Fact, ORMMinuta, GrupoObra, OrdenObra) {
    $scope.temasTodos = ORMTema.query();
    $scope.grupos = GrupoObra.query();
    $scope.segmentos = OrdenObra.query();
    $scope.temas = ORMTema.query({nivel : 1}, function(){
        $scope.temas.forEach(function(t) {
            t.verde = 0;
            t.amarillo = 0;
            t.rojo = 0;
        });
    });  
    $scope.fueraTema = {
        verde : 0,
        amarillo : 0,
        rojo : 0
    };
    $scope.facts = "";
    var facts = Fact.query({}, function() {
        facts.forEach(function(f) { 
            $scope.facts += f.concepto + ": " + f.valor + " " + f.magnitud + " - ";
        });
    });  
    
    $scope.compromisos = [];
    $scope.temasPrincipales = [];
    $scope.hoy = new Date().getTime() - 80000000;
    
    $scope.minutas = ORMMinuta.query({}, function(){
        $scope.minutas.forEach(function(m) {
            m.compromisos.forEach(function(c) {
                if ((!c.estado || (c.estado != "Cumplido")) && (c.importante)) {
                    if (c.fecha) {
                        c.fechaMili = new Date(moment(c.fecha,"DD/MM/YYYY").format('MM DD YYYY, HH:mm:ss')).getTime();
                    }
                    if (c.tema) {
                        c.temaPrincipal = $scope.temaPrincipal(c.tema);
                    } else {
                        c.temaPrincipal = "zzz0";
                    }
                    $scope.compromisos.push(c);
                    $scope.temas.forEach(function(t) {
                        if (t._id == c.temaPrincipal) {
                            if (!c.fecha) {
                                t.amarillo += 1;
                            } else if (c.fechaMili<$scope.hoy) {
                                t.rojo += 1;
                            } else {
                                t.verde += 1;
                            }
                        }
                    });
                    if (c.temaPrincipal == "zzz0") {
                        if (!c.fechaMili) {
                            $scope.fueraTema.amarillo += 1;
                        } else if (c.fechaMili<$scope.hoy) {
                            $scope.fueraTema.rojo += 1;
                        } else {
                            $scope.fueraTema.verde += 1;
                        }
                    }
                }
            });
        });
    });
    
    $scope.temaPrincipal = function (id) {
        var tema = $scope.temaPorId(id);
        if (tema) {
            if (tema.temaSuperior) {
                return $scope.temaPrincipal(tema.temaSuperior);
            } else {
                return tema._id;
            }
        }
    };
    
    $scope.temaPorId = function (id) {
      for (var i = 0; i < $scope.temasTodos.length; i++) {
          if ($scope.temasTodos[i]._id == id)
          {
              return $scope.temasTodos[i];
          }
      }  
    }; 
    
    $scope.numeroRandom = function() {
        return parseInt(30*Math.random());
    };
    
})
.controller('DashboardObrasCtrl', function($scope, $location, Obra, Obras2) {
    var fecha = new Date(1407456000000);
    $scope.meses = [];
    $scope.total = 0;
    $scope.totalAntes = 0;
    $scope.nombresMeses = ["ENE", "FEB", "MAR", "ABR", "MAY", "JUN", "JUL", "AGO", "SEP", "OCT", "NOV", "DIC"];
    $scope.diaHoy = moment(new Date());
    
    var armarMes = function(lugar) {
        if (lugar < 2) {
            if (fecha.getMonth()>(1-lugar)) {
                return {fecha: ((fecha.getMonth()-(1-lugar)) + "/" + fecha.getFullYear()),
                        mes: (fecha.getMonth()-(1-lugar)),
                        anio: fecha.getFullYear(),
                        cantidad: 0};
            } else {
                return {fecha: (12+(fecha.getMonth()-(1-lugar)) + "/" + (fecha.getFullYear()-1)),
                        mes: 12+(fecha.getMonth()-(1-lugar)),
                        anio: (fecha.getFullYear()-1),
                        cantidad: 0};
            }
        } else {
            if ((fecha.getMonth()+lugar-2) < 12) {
                return {fecha: ((fecha.getMonth()+(lugar-1)) + "/" + fecha.getFullYear()),
                        mes: (fecha.getMonth()+(lugar-1)),
                        anio: fecha.getFullYear(),
                        cantidad: 0};
            } else {
                return {fecha: ((fecha.getMonth()+lugar-2)-11 + "/" + (fecha.getFullYear()+1)),
                        mes: (fecha.getMonth()+lugar-2)-11,
                        anio: (fecha.getFullYear()+1),
                        cantidad: 0};
            }
        }
    };
    
    $scope.meses[2] = {fecha: (fecha.getMonth()+1) + "/" + fecha.getFullYear(),
                        mes: (fecha.getMonth()+1),
                        anio: fecha.getFullYear(),
                        cantidad: 0};
    $scope.meses[12] = armarMes(12);
    $scope.meses[11] = armarMes(11);
    $scope.meses[10] = armarMes(10);
    $scope.meses[9] = armarMes(9);
    $scope.meses[8] = armarMes(8);
    $scope.meses[7] = armarMes(7);
    $scope.meses[6] = armarMes(6);
    $scope.meses[5] = armarMes(5);
    $scope.meses[4] = armarMes(4);
    $scope.meses[3] = armarMes(3);
    $scope.meses[1] = armarMes(1);
    $scope.meses[0] = armarMes(0);
    
    var obras = Obra.query({orden1: "52e80970968a4c06e4877bc9"},function() {
        var obras2 = Obras2.query({orden1: "52e80970968a4c06e4877bc9"},function() {
            $scope.listado = obras.concat(obras2);
            $scope.listado.forEach(function(o) { 
                $scope.total += $scope.soloNumeros(o.nombrar[o.nombrar.length-1].monto);
                var fechaFin = o.final[o.final.length-1].fecha;
                for (var i = 0; i < 13; i++) {
                    if (($scope.dameMes(fechaFin) == $scope.meses[i].mes) && ($scope.dameAnio(fechaFin) == $scope.meses[i].anio)) {
                        $scope.meses[i].cantidad += 1;
                    }
                }
                if (($scope.dameAnio(fechaFin) < $scope.meses[1].anio) || ($scope.dameMes(fechaFin) < $scope.meses[1].mes) && ($scope.dameAnio(fechaFin) == $scope.meses[1].anio)) {
                    $scope.totalAntes += 1;
                }
            });
        });
    });
    
    $scope.dameMes = function(fecha) {
        var fechaDividida = fecha.split("/");
        return parseInt(fechaDividida[1]);
    };
    
    $scope.dameAnio = function(fecha) {
        var fechaDividida = fecha.split("/");
        return parseInt(fechaDividida[2]);
    };
    
    $scope.soloMillones = function(monto) {
        var num = ($scope.soloNumeros(monto) / 1000000);
        return Math.round(num * 100) / 100;
    };
    
    $scope.soloMillonesTotal = function(monto) {
        var num = (monto / 1000000);
        return Math.round(num * 100) / 100;
    };
    
    $scope.soloNumeros = function(cadenaAnalizar) {
        if (cadenaAnalizar) {
            var nuevoString = "";
            for (var i = 0; i< cadenaAnalizar.length; i++) {
                 var caracter = cadenaAnalizar.charAt(i);
                 if( caracter == "0" || caracter == "1" || caracter == "2" || caracter == "3" || caracter == "4" || caracter == "5" || caracter == "6" || caracter == "7" || caracter == "8" || caracter == "9") {
                    nuevoString = nuevoString + caracter;
                  }
            }
            return parseInt(nuevoString);
        } else {
            return 0;
        }
    };
    
    $scope.puntitos = function(number) {
        if (number) {
            number = number.toString();
            var result = '';
            while( number.length > 3 )
            {
             result = '.' + number.substr(number.length - 3) + result;
             number = number.substring(0, number.length - 3);
            }
            result = number + result;
            return result;
        } else {
            return "";
        }
    };
    
    $scope.esquinaFin = function(lugar, obra) {
        var primerFin = obra.final[0].fecha;
        if (($scope.dameMes(primerFin) == $scope.meses[lugar].mes) && ($scope.dameAnio(primerFin) == $scope.meses[lugar].anio)) {
            return true;
        } else {
            return false;
        }
    };
    
    $scope.esquinaInicio = function(lugar, obra) {
        var primerInicio = obra.inicios[0].fecha;
        if (($scope.dameMes(primerInicio) == $scope.meses[lugar].mes) && ($scope.dameAnio(primerInicio) == $scope.meses[lugar].anio)) {
            return true;
        } else {
            return false;
        }
    };
    
    $scope.esquinaFinAntes = function(obra) {
        var primerFin = obra.final[0].fecha;
        if (($scope.dameAnio(primerFin) < $scope.meses[1].anio) || ($scope.dameMes(primerFin) < $scope.meses[1].mes) && ($scope.dameAnio(primerFin) == $scope.meses[1].anio)) {
            return true;
        } else {
            return false;
        }
    };
    
    $scope.imagenFinAntes = function(obra) {
        var fechaFin = obra.final[obra.final.length-1].fecha;
        if (($scope.dameAnio(fechaFin) < $scope.meses[1].anio) || ($scope.dameMes(fechaFin) < $scope.meses[1].mes) && ($scope.dameAnio(fechaFin) == $scope.meses[1].anio)) {
            switch($scope.coloresObjetivo(obra.objetivo, obra.final, obra.inicios)) {
                case 'azul':
                    return '/views/dashboard/images/finSinLineaAzul.png';
                case 'amarillo':
                    return '/views/dashboard/images/finSinLineaAmarillo.png';
                case 'verde':
                    return '/views/dashboard/images/finSinLineaVerde.png';
                case 'rojo':
                    return '/views/dashboard/images/finSinLineaRojo.png';
                case 'gris':
                    return '/views/dashboard/images/finSinLineaGris.png';
            }
        } else {
            return false;
        }
    };
    
    $scope.esquinaInicioAntes = function(obra) {
        var primerInicio = obra.inicios[0].fecha;
        if (($scope.dameAnio(primerInicio) < $scope.meses[1].anio) || ($scope.dameMes(primerInicio) < $scope.meses[1].mes) && ($scope.dameAnio(primerInicio) == $scope.meses[1].anio)) {
            return true;
        } else {
            return false;
        }
    };
    
    $scope.esquinaFinDespues = function(obra, anio) {
        var primerFin = obra.final[0].fecha;
        if (($scope.meses[12].anio != anio) || ($scope.dameMes(primerFin) > $scope.meses[12].mes) && ($scope.dameAnio(primerFin) == $scope.meses[12].anio)) {
            if ($scope.dameAnio(primerFin) == anio) {
                return true;
            } else {
                return false;
            }
        }
    };
    
    $scope.imagenFinDespues = function(obra, anio) {
        var fechaFin = obra.final[obra.final.length-1].fecha;
        if (($scope.meses[12].anio != anio) || ($scope.dameMes(fechaFin) > $scope.meses[12].mes) && ($scope.dameAnio(fechaFin) == $scope.meses[12].anio)) {
            if ($scope.dameAnio(fechaFin) == anio) {
                switch($scope.coloresObjetivo(obra.objetivo, obra.final, obra.inicios)) {
                    case 'azul':
                        return '/views/dashboard/images/finSinLineaAzul.png';
                    case 'amarillo':
                        return '/views/dashboard/images/finSinLineaAmarillo.png';
                    case 'verde':
                        return '/views/dashboard/images/finSinLineaVerde.png';
                    case 'rojo':
                        return '/views/dashboard/images/finSinLineaRojo.png';
                    case 'gris':
                        return '/views/dashboard/images/finSinLineaGris.png';
                }
            } else {
                return false;
            }
        }
    };
    
    $scope.imagenFin = function(obra, lugar) {
        var fechaFin = obra.final[obra.final.length-1].fecha;
        if (($scope.dameMes(fechaFin) == $scope.meses[lugar].mes) && ($scope.dameAnio(fechaFin) == $scope.meses[lugar].anio)) {
            switch($scope.coloresObjetivo(obra.objetivo, obra.final, obra.inicios)) {
                case 'azul':
                    return '/views/dashboard/images/finSinLineaAzul.png';
                case 'amarillo':
                    return '/views/dashboard/images/finSinLineaAmarillo.png';
                case 'verde':
                    return '/views/dashboard/images/finSinLineaVerde.png';
                case 'rojo':
                    return '/views/dashboard/images/finSinLineaRojo.png';
                case 'gris':
                    return '/views/dashboard/images/finSinLineaGris.png';
            }
        }
    };
    
    $scope.esquinaInicioDespues = function(obra, anio) {
        var primerInicio = obra.inicios[0].fecha;
        if ($scope.dameAnio(primerInicio) == anio) {
            if (($scope.meses[12].anio != anio) || (($scope.meses[12].anio == anio) && ((($scope.dameMes(primerInicio) > $scope.meses[12].mes) && ($scope.dameAnio(primerInicio) == $scope.meses[12].anio))))) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    };
    
    $scope.pintado = function(lugar, obra) {
        var fechaInicio = obra.inicios[obra.inicios.length-1].fecha;
        var fechaFin = obra.final[obra.final.length-1].fecha;
        var primerInicio = obra.inicios[0].fecha;
        var primerFin = obra.final[0].fecha;
        /*if (($scope.dameMes(fechaFin) == $scope.meses[lugar].mes) && ($scope.dameAnio(fechaFin) == $scope.meses[lugar].anio)) {
            if (($scope.dameAnio(primerInicio) < $scope.meses[lugar].anio) || ($scope.dameMes(primerInicio) <= $scope.meses[lugar].mes) && ($scope.dameAnio(primerInicio) == $scope.meses[lugar].anio)) {
                if (($scope.dameAnio(primerFin) > $scope.meses[lugar].anio) || ($scope.dameMes(primerFin) >= $scope.meses[lugar].mes) && ($scope.dameAnio(primerFin) == $scope.meses[lugar].anio)) {
                    //return {'background-image': "url('/views/dashboard/images/finConLinea.png')"};
                    switch($scope.coloresObjetivo(obra.objetivo, obra.final, obra.inicios)) {
                        case 'azul':
                            return {'background-image': "url('/views/dashboard/images/finConLineaAzul.png')"};
                        case 'amarillo':
                            return {'background-image': "url('/views/dashboard/images/finConLineaAmarillo.png')"};
                        case 'verde':
                            return {'background-image': "url('/views/dashboard/images/finConLineaVerde.png')"};
                        case 'rojo':
                            return {'background-image': "url('/views/dashboard/images/finConLineaRojo.png')"};
                        case 'gris':
                            return {'background-image': "url('/views/dashboard/images/finConLineaGris.png')"};
                    }
                } else {
                    //return {'background-image': "url('/views/dashboard/images/finSinLinea.png')"};
                    switch($scope.coloresObjetivo(obra.objetivo, obra.final, obra.inicios)) {
                        case 'azul':
                            return {'background-image': "url('/views/dashboard/images/finSinLineaAzul.png')"};
                        case 'amarillo':
                            return {'background-image': "url('/views/dashboard/images/finSinLineaAmarillo.png')"};
                        case 'verde':
                            return {'background-image': "url('/views/dashboard/images/finSinLineaVerde.png')"};
                        case 'rojo':
                            return {'background-image': "url('/views/dashboard/images/finSinLineaRojo.png')"};
                        case 'gris':
                            return {'background-image': "url('/views/dashboard/images/finSinLineaGris.png')"};
                    }
                }
            } else {
                //return {'background-image': "url('/views/dashboard/images/finSinLinea.png')"};
                switch($scope.coloresObjetivo(obra.objetivo, obra.final, obra.inicios)) {
                    case 'azul':
                        return {'background-image': "url('/views/dashboard/images/finSinLineaAzul.png')"};
                    case 'amarillo':
                        return {'background-image': "url('/views/dashboard/images/finSinLineaAmarillo.png')"};
                    case 'verde':
                        return {'background-image': "url('/views/dashboard/images/finSinLineaVerde.png')"};
                    case 'rojo':
                        return {'background-image': "url('/views/dashboard/images/finSinLineaRojo.png')"};
                    case 'gris':
                        return {'background-image': "url('/views/dashboard/images/finSinLineaGris.png')"};
                }
            }
        }*/
        if (($scope.dameAnio(fechaInicio) < $scope.meses[lugar].anio) || ($scope.dameMes(fechaInicio) <= $scope.meses[lugar].mes) && ($scope.dameAnio(fechaInicio) == $scope.meses[lugar].anio)) {
            if (($scope.dameAnio(fechaFin) > $scope.meses[lugar].anio) || ($scope.dameMes(fechaFin) >= $scope.meses[lugar].mes) && ($scope.dameAnio(fechaFin) == $scope.meses[lugar].anio)) {
                if (($scope.dameAnio(primerInicio) < $scope.meses[lugar].anio) || ($scope.dameMes(primerInicio) <= $scope.meses[lugar].mes) && ($scope.dameAnio(primerInicio) == $scope.meses[lugar].anio)) {
                    if (($scope.dameAnio(primerFin) > $scope.meses[lugar].anio) || ($scope.dameMes(primerFin) >= $scope.meses[lugar].mes) && ($scope.dameAnio(primerFin) == $scope.meses[lugar].anio)) {
                        //return {'background-image': "url('/views/dashboard/images/obraConLinea.png')"};
                        switch($scope.coloresObjetivo(obra.objetivo, obra.final, obra.inicios)) {
                            case 'azul':
                                return {'background-image': "url('/views/dashboard/images/obraConLineaAzul.png')"};
                            case 'amarillo':
                                return {'background-image': "url('/views/dashboard/images/obraConLineaAmarillo.png')"};
                            case 'verde':
                                return {'background-image': "url('/views/dashboard/images/obraConLineaVerde.png')"};
                            case 'rojo':
                                return {'background-image': "url('/views/dashboard/images/obraConLineaRojo.png')"};
                            case 'gris':
                                return {'background-image': "url('/views/dashboard/images/obraConLineaGris.png')"};
                        }
                    } else {
                        //return {'background-image': "url('/views/dashboard/images/obraSinLinea.png')"};
                        switch($scope.coloresObjetivo(obra.objetivo, obra.final, obra.inicios)) {
                            case 'azul':
                                return {'background-image': "url('/views/dashboard/images/obraSinLineaAzul.png')"};
                            case 'amarillo':
                                return {'background-image': "url('/views/dashboard/images/obraSinLineaAmarillo.png')"};
                            case 'verde':
                                return {'background-image': "url('/views/dashboard/images/obraSinLineaVerde.png')"};
                            case 'rojo':
                                return {'background-image': "url('/views/dashboard/images/obraSinLineaRojo.png')"};
                            case 'gris':
                                return {'background-image': "url('/views/dashboard/images/obraSinLineaGris.png')"};
                        }
                    }
                } else {
                    //return {'background-image': "url('/views/dashboard/images/obraSinLinea.png')"};
                    switch($scope.coloresObjetivo(obra.objetivo, obra.final, obra.inicios)) {
                        case 'azul':
                            return {'background-image': "url('/views/dashboard/images/obraSinLineaAzul.png')"};
                        case 'amarillo':
                            return {'background-image': "url('/views/dashboard/images/obraSinLineaAmarillo.png')"};
                        case 'verde':
                            return {'background-image': "url('/views/dashboard/images/obraSinLineaVerde.png')"};
                        case 'rojo':
                            return {'background-image': "url('/views/dashboard/images/obraSinLineaRojo.png')"};
                        case 'gris':
                            return {'background-image': "url('/views/dashboard/images/obraSinLineaGris.png')"};
                    }
                }
            } else {
                if (($scope.dameAnio(primerInicio) < $scope.meses[lugar].anio) || ($scope.dameMes(primerInicio) <= $scope.meses[lugar].mes) && ($scope.dameAnio(primerInicio) == $scope.meses[lugar].anio)) {
                    if (($scope.dameAnio(primerFin) > $scope.meses[lugar].anio) || ($scope.dameMes(primerFin) >= $scope.meses[lugar].mes) && ($scope.dameAnio(primerFin) == $scope.meses[lugar].anio)) {
                        return {'background-image': "url('/views/dashboard/images/soloLinea.png')"};
                    } else {
                        return "";
                    }
                } else {
                    return "";
                }
            }
        } else {
            if (($scope.dameAnio(primerInicio) < $scope.meses[lugar].anio) || ($scope.dameMes(primerInicio) <= $scope.meses[lugar].mes) && ($scope.dameAnio(primerInicio) == $scope.meses[lugar].anio)) {
                if (($scope.dameAnio(primerFin) > $scope.meses[lugar].anio) || ($scope.dameMes(primerFin) >= $scope.meses[lugar].mes) && ($scope.dameAnio(primerFin) == $scope.meses[lugar].anio)) {
                    return {'background-image': "url('/views/dashboard/images/soloLinea.png')"};
                } else {
                    return "";
                }
            } else {
                return "";
            }
        }
    };
    
    $scope.pintadoAntes = function(obra) {
        var fechaInicio = obra.inicios[obra.inicios.length-1].fecha;
        var primerInicio = obra.inicios[0].fecha;
        if (($scope.dameAnio(fechaInicio) < $scope.meses[1].anio) || ($scope.dameMes(fechaInicio) < $scope.meses[1].mes) && ($scope.dameAnio(fechaInicio) == $scope.meses[1].anio)) {
            if (($scope.dameAnio(primerInicio) < $scope.meses[1].anio) || ($scope.dameMes(primerInicio) < $scope.meses[1].mes) && ($scope.dameAnio(primerInicio) == $scope.meses[1].anio)) {
                //return {'background-image': "url('/views/dashboard/images/obraConLinea.png')"};
                switch($scope.coloresObjetivo(obra.objetivo, obra.final, obra.inicios)) {
                    case 'azul':
                        return {'background-image': "url('/views/dashboard/images/obraConLineaAzul.png')"};
                    case 'amarillo':
                        return {'background-image': "url('/views/dashboard/images/obraConLineaAmarillo.png')"};
                    case 'verde':
                        return {'background-image': "url('/views/dashboard/images/obraConLineaVerde.png')"};
                    case 'rojo':
                        return {'background-image': "url('/views/dashboard/images/obraConLineaRojo.png')"};
                    case 'gris':
                        return {'background-image': "url('/views/dashboard/images/obraConLineaGris.png')"};
                }
            } else {
                //return {'background-image': "url('/views/dashboard/images/obraSinLinea.png')"};
                switch($scope.coloresObjetivo(obra.objetivo, obra.final, obra.inicios)) {
                    case 'azul':
                        return {'background-image': "url('/views/dashboard/images/obraSinLineaAzul.png')"};
                    case 'amarillo':
                        return {'background-image': "url('/views/dashboard/images/obraSinLineaAmarillo.png')"};
                    case 'verde':
                        return {'background-image': "url('/views/dashboard/images/obraSinLineaVerde.png')"};
                    case 'rojo':
                        return {'background-image': "url('/views/dashboard/images/obraSinLineaRojo.png')"};
                    case 'gris':
                        return {'background-image': "url('/views/dashboard/images/obraSinLineaGris.png')"};
                }
            }
        } else {
            if (($scope.dameAnio(primerInicio) < $scope.meses[1].anio) || ($scope.dameMes(primerInicio) < $scope.meses[1].mes) && ($scope.dameAnio(primerInicio) == $scope.meses[1].anio)) {
                return {'background-image': "url('/views/dashboard/images/soloLinea.png')"};
            } else {
                return "";
            }
        }
    };
    
    $scope.pintadoDespues = function(obra, anio) {
        var fechaInicio = obra.inicios[obra.inicios.length-1].fecha;
        var fechaFin = obra.final[obra.final.length-1].fecha;
        var primerInicio = obra.inicios[0].fecha;
        var primerFin = obra.final[0].fecha;
        if (($scope.dameAnio(fechaFin) == anio) || (($scope.dameAnio(fechaFin) > anio) && ($scope.dameAnio(fechaInicio) < anio)) || ($scope.dameAnio(fechaInicio) == anio)) {
            if (($scope.meses[12].anio != anio) || (($scope.meses[12].anio == anio) && ((($scope.dameMes(fechaFin) > $scope.meses[12].mes) && ($scope.dameAnio(fechaFin) == $scope.meses[12].anio)) || ($scope.dameAnio(fechaFin) > $scope.meses[12].anio)))) {
                if ((($scope.dameAnio(primerFin) == anio) && ((($scope.meses[12].anio != anio) || (($scope.meses[12].anio == anio) && ((($scope.dameMes(primerFin) > $scope.meses[12].mes) && ($scope.dameAnio(primerFin) == $scope.meses[12].anio)) || ($scope.dameAnio(primerFin) > $scope.meses[12].anio)))))) || ($scope.dameAnio(primerFin) > anio)) {
                    //return {'background-image': "url('/views/dashboard/images/obraConLinea.png')"};
                    switch($scope.coloresObjetivo(obra.objetivo, obra.final, obra.inicios)) {
                        case 'azul':
                            return {'background-image': "url('/views/dashboard/images/obraConLineaAzul.png')"};
                        case 'amarillo':
                            return {'background-image': "url('/views/dashboard/images/obraConLineaAmarillo.png')"};
                        case 'verde':
                            return {'background-image': "url('/views/dashboard/images/obraConLineaVerde.png')"};
                        case 'rojo':
                            return {'background-image': "url('/views/dashboard/images/obraConLineaRojo.png')"};
                        case 'gris':
                            return {'background-image': "url('/views/dashboard/images/obraConLineaGris.png')"};
                    }
                } else {
                    //return {'background-image': "url('/views/dashboard/images/obraSinLinea.png')"};
                    switch($scope.coloresObjetivo(obra.objetivo, obra.final, obra.inicios)) {
                        case 'azul':
                            return {'background-image': "url('/views/dashboard/images/obraSinLineaAzul.png')"};
                        case 'amarillo':
                            return {'background-image': "url('/views/dashboard/images/obraSinLineaAmarillo.png')"};
                        case 'verde':
                            return {'background-image': "url('/views/dashboard/images/obraSinLineaVerde.png')"};
                        case 'rojo':
                            return {'background-image': "url('/views/dashboard/images/obraSinLineaRojo.png')"};
                        case 'gris':
                            return {'background-image': "url('/views/dashboard/images/obraSinLineaGris.png')"};
                    }
                }
            }
        } else {
            if (($scope.dameAnio(primerFin) == anio) || (($scope.dameAnio(primerFin) > anio) && ($scope.dameAnio(primerInicio) < anio)) || ($scope.dameAnio(primerInicio) == anio)) {
                if (($scope.meses[12].anio != anio) || (($scope.meses[12].anio == anio) && ((($scope.dameMes(primerFin) > $scope.meses[12].mes) && ($scope.dameAnio(primerFin) == $scope.meses[12].anio)) || ($scope.dameAnio(primerFin) > $scope.meses[12].anio)))) {
                    return {'background-image': "url('/views/dashboard/images/soloLinea.png')"};
                } else {
                    return "";
                }
            }
        }
    };
    
    $scope.coloresObjetivo = function(objetivo,final,inicios){
        if(objetivo[0]){//Hay objetivo
            if(final && final[final.length-1] && final[final.length-1].cumplido){
                if(moment(final[final.length-1].fecha, "DD/MM/YYYY") <= moment(objetivo[objetivo.length-1].fecha, "DD/MM/YYYY")){
                    return "azul";
                }
                if(moment(final[final.length-1].fecha, "DD/MM/YYYY") >= moment(objetivo[objetivo.length-1].fecha, "DD/MM/YYYY")){
                    return "gris";
                }
            }
            if(!final && !final[final.length-1] && !final[final.length-1].cumplido){
                return "rojo";
            }
            
            if(($scope.diaHoy > moment(objetivo[objetivo.length-1].fecha, "DD/MM/YYYY")) ||//Objetivo vencido
                (!final[0]) || //Sin final
                (moment(final[final.length-1].fecha, "DD/MM/YYYY") > moment(objetivo[objetivo.length-1].fecha, "DD/MM/YYYY"))){//Final > objetivo
                    return "rojo";
            }
            
            if(objetivo[objetivo.length-1].cumplido){
                return "azul";
            }
            
            if(
                (!inicios[0]) &&//Sin inicios
                (moment(final[final.length-1].fecha, "DD/MM/YYYY") > $scope.diaHoy)
            ){
                return "amarillo";
            }
            if($scope.diaHoy <= moment(objetivo[objetivo.length-1].fecha, "DD/MM/YYYY")){
                return "verde";
            }
        }else{//No hay objetivo
            return "rojo";
        }
    };
    
})
.controller('DashboardCompromisosORMCtrl', function($scope, $location, ORMInstanciaReunion, ORMMinuta, ORMTema, ORMReunion, Contactos) {
    $scope.compromisos = [];
    $scope.temasPrincipales = [];
    $scope.hoy = new Date().getTime() - 80000000;
    $scope.temas = ORMTema.query();
    $scope.reuniones = ORMReunion.query(); 
    $scope.contactos = Contactos.listar(); 
    $scope.orden = 'fechaMili';
    $scope.instancias = ORMInstanciaReunion.query({}, function(){
        $scope.minutas = ORMMinuta.query({}, function(){
            $scope.minutas.forEach(function(m) {
                m.compromisos.forEach(function(c) {
                    if ((!c.estado || (c.estado != "Cumplido")) && (c.importante)) {
                        if (c.fecha) {
                            c.fechaMili = new Date(moment(c.fecha,"DD/MM/YYYY").format('MM DD YYYY, HH:mm:ss')).getTime();
                        }
                        c.minuta = m._id;
                        if (m.instancia) {
                            c.instancia = $scope.instanciaPorId(m.instancia);
                        }
                        if (c.tema) {
                            c.temaPrincipal = $scope.temaPrincipal(c.tema);
                        } else {
                            c.temaPrincipal = "zzz0";
                        }
                        $scope.compromisos.push(c);
                    }
                });
            });
            $scope.compromisos.forEach(function(c2) {
                if (c2.temaPrincipal) {
                    if ($scope.temasPrincipales.indexOf(c2.temaPrincipal) == -1) {
                        $scope.temasPrincipales.push(c2.temaPrincipal);
                    }
                }
            });
        });
    });
    
    $scope.ordenTema = function (id) {
      if (id != "zzz0") {
          return $scope.temaPorId(id).orden;
      } else {
          return "9999";
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
    
    $scope.temaPrincipal = function (id) {
        var tema = $scope.temaPorId(id);
        if (tema) {
            if (tema.temaSuperior) {
                return $scope.temaPrincipal(tema.temaSuperior);
            } else {
                return tema._id;
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
    
    $scope.contactoPorId = function (id) {
      for (var i = 0; i < $scope.contactos.length; i++) {
          if ($scope.contactos[i]._id == id)
          {
              return $scope.contactos[i];
          }
      }  
    };
    
});