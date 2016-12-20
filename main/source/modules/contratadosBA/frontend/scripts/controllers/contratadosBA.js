angular.module('bag2.contratadosBA', [])
.controller('ContratadosBACtrl', function($scope, ContratadoBA, ORMOrganigrama) {
    $scope.contratados= ContratadoBA.query();
    $scope.organigrama = ORMOrganigrama.query();
    
    $scope.organigramaPorId = function (id) {
      for (var i = 0; i < $scope.organigrama.length; i++) {
          if ($scope.organigrama[i]._id == id)
          {
              return $scope.organigrama[i];
          }
      }  
    };
    
    $scope.aMilisegundos = function(fecha) {
        var fechaDividida = fecha.split("/");
        var date = new Date(fechaDividida[2], fechaDividida[1] - 1, fechaDividida[0], 0, 0, 0, 0);
        return date.getTime();
    };
    
    $scope.calcularAntiguedad = function(fecha1, fecha2) {
        if (!fecha1 && !fecha2) return 0;
        
        var array_fecha = fecha1.split("/");
        var anio = parseInt(array_fecha[2]);
        var mes = parseInt(array_fecha[1]);
        var dia = parseInt(array_fecha[0]);
        
        if (fecha2) {
            var array_fecha2 = fecha2.split("/");
            var anio2 = parseInt(array_fecha2[2]);
            var mes2 = parseInt(array_fecha2[1]);
            var dia2 = parseInt(array_fecha2[0]);
        } else {
            var hoy = new Date();
            var anio2 = hoy.getFullYear();
            var mes2 = hoy.getMonth() + 1;
            var dia2 = hoy.getUTCDate();
        }
    
        var edad=anio2 - anio - 1;
        if (mes2 - mes < 0) return edad;
        if (mes2 - mes > 0) return edad+1;
        if (dia2 - dia >= 0) return edad+1;
    
        return edad;
    };
    
    $scope.fechaActual = new Date().getTime();
    $scope.annoEnMili=31556900000; 
    
    $scope.filtroFin = function(ba) {
        var edadMinima = $scope.edadMinima*$scope.annoEnMili;
        var compararFechaMinima= $scope.fechaActual-edadMinima;
        var edadMaxima = $scope.edadMaxima*$scope.annoEnMili;
        var compararFechaMaxima= $scope.fechaActual-edadMaxima;
        if($scope.edadMinima && $scope.edadMaxima) {
            if(ba.fechaNacimientoMiliseg<=compararFechaMinima && ba.fechaNacimientoMiliseg>=compararFechaMaxima) {
                return true;
            } else {
                return false;
            }
        }
        else if($scope.edadMinima) {
            if(ba.fechaNacimientoMiliseg<=compararFechaMinima) {
                return true;
            } else {
                return false;
            }
        }
        else if($scope.edadMaxima) {
            if(ba.fechaNacimientoMiliseg>=compararFechaMaxima) {
                return true;
            } else {
                return false;
            }
        } else {
            return true;
        }
    };
     
})
.controller('ContratadosBANuevoCtrl', function($scope, ContratadoBA, ORMOrganigrama) {

    $scope.contratado=new ContratadoBA();
    $scope.uploaded = [];
    $scope.organigrama = ORMOrganigrama.query();
    
    $scope.aMilisegundos = function(fecha) {
        var fechaDividida = fecha.split("/");
        var date = new Date(fechaDividida[2], fechaDividida[1] - 1, fechaDividida[0], 0, 0, 0, 0);
        return date.getTime();
    };
    
    $scope.guardar=function() {
        if ($scope.uploaded.length) {
            $scope.contratado.archivoId = $scope.uploaded.shift().id;
        }
        if($scope.contratado.fechaNacimiento) {
            $scope.contratado.fechaNacimientoMiliseg= $scope.aMilisegundos($scope.contratado.fechaNacimiento);
        } else {
            $scope.contratado.fechaNacimientoMiliseg=0;
        }
        $scope.contratado.$save();
    };


    $scope.agregarIdioma=function(valorIdioma) {   
        if (!$scope.contratado.idiomas) {
            $scope.contratado.idiomas = [];
        }
        if ($scope.contratado.idiomas.length<=5) {
            $scope.contratado.idiomas.push(valorIdioma);
        } else {
            alert("Ya ingreso todos los posibles");
        }
        $scope.valorIdioma = "";
    };
    
    $scope.agregarSistema=function(valorSistema) {   
        if (!$scope.contratado.sistemas) {
            $scope.contratado.sistemas = [];
        }
        $scope.contratado.sistemas.push(valorSistema);
        $scope.valorSistemas = "";
    };
    
    $scope.agregarEstudios=function(valorEst) {
        if (!$scope.contratado.estudios) {
            $scope.contratado.estudios = [];
        }
        $scope.contratado.estudios.push(valorEst);
        $scope.estudios = "";
    };
    
    $scope.agregarReferencia=function(valorReferencia) {   
        if (!$scope.contratado.referencias) {
            $scope.contratado.referencias = [];
        }
        $scope.contratado.referencias.push(valorReferencia);
        $scope.referencias = "";
    };
    
    $scope.agregarExperiencia=function(valorExp) {
        if(!$scope.contratado.experiencias) {
            $scope.contratado.experiencias=[];
        }
        $scope.contratado.experiencias.push(valorExp);
        $scope.valorExperiencia="";
    };

    $scope.eliminarIdioma = function(elemento, lista) {
        lista.splice(lista.indexOf(elemento), 1);
    };
    
    $scope.calcularAntiguedad = function(fecha1, fecha2) {
        if (!fecha1 && !fecha2) return 0;
        
        var array_fecha = fecha1.split("/");
        var anio = parseInt(array_fecha[2]);
        var mes = parseInt(array_fecha[1]);
        var dia = parseInt(array_fecha[0]);
        
        if (fecha2) {
            var array_fecha2 = fecha2.split("/");
            var anio2 = parseInt(array_fecha2[2]);
            var mes2 = parseInt(array_fecha2[1]);
            var dia2 = parseInt(array_fecha2[0]);
        } else {
            var hoy = new Date();
            var anio2 = hoy.getFullYear();
            var mes2 = hoy.getMonth() + 1;
            var dia2 = hoy.getUTCDate();
        }
    
        var edad=anio2 - anio - 1;
        if (mes2 - mes < 0) return edad;
        if (mes2 - mes > 0) return edad+1;
        if (dia2 - dia >= 0) return edad+1;
    
        return edad;
    };
    

})
.controller('ContratadosBADetalleCtrl',function($scope, ContratadoBA, $routeParams, $location, ORMOrganigrama){
    $scope.contratado = ContratadoBA.get({_id: $routeParams._id});
    $scope.uploaded = [];
    $scope.organigrama = ORMOrganigrama.query();
    
    $scope.organigramaPorId = function (id) {
      for (var i = 0; i < $scope.organigrama.length; i++) {
          if ($scope.organigrama[i]._id == id) {
              return $scope.organigrama[i];
          }
      }  
    };

    $scope.agregarIdioma=function(valorIdiomas) {   
        if (!$scope.contratado.idiomas) {
            $scope.contratado.idiomas = [];
        }
        if($scope.contratado.idiomas.length<=5) {
            $scope.contratado.idiomas.push(valorIdiomas);
        } else {
            alert("Ya ingreso todos los posibles");
        }
        $scope.valorIdioma = "";
    };

    $scope.eliminarIdioma = function(elemento, lista) {
        lista.splice(lista.indexOf(elemento), 1);
    };
    
    $scope.agregarReferencia=function(valorReferencia) {   
        if (!$scope.contratado.referencias) {
            $scope.contratado.referencias = [];
        }
        $scope.contratado.referencias.push(valorReferencia);
        $scope.referencias = "";
    };
    
    $scope.agregarExp=function(valorOtrasExp) {
        if(!$scope.contratado.otrasExperiencias) {
            $scope.contratado.otrasExperiencias=[];
        }
        $scope.contratado.otrasExperiencias.push(valorOtrasExp);
        $scope.valorOtrasExperiencias="";
    };
    
    $scope.agregarEstudios=function(valorEst) {
        if (!$scope.contratado.estudios) {
            $scope.contratado.estudios = [];
        }
        $scope.contratado.estudios.push(valorEst);
        $scope.estudios = "";
    };

    $scope.agregarSistema=function(valorSistema) {   
        if (!$scope.contratado.sistemas) {
            $scope.contratado.sistemas = [];
        }
        $scope.contratado.sistemas.push(valorSistema);
        $scope.valorSistemas = "";
    };
    
    $scope.agregarExperiencia=function(valorExp) {
        if(!$scope.contratado.experiencias) {
            $scope.contratado.experiencias=[];
        }
        $scope.contratado.experiencias.push(valorExp);
        $scope.valorExperiencia="";
    };
    
    $scope.aMilisegundos = function(fecha) {
        var fechaDividida = fecha.split("/");
        var date = new Date(fechaDividida[2], fechaDividida[1] - 1, fechaDividida[0], 0, 0, 0, 0);
        return date.getTime();
    };
    
    $scope.guardar=function() {
        if ($scope.uploaded.length) {
            $scope.contratado.archivoId = $scope.uploaded.shift().id;
        }
        if($scope.contratado.fechaNacimiento) {
            $scope.contratado.fechaNacimientoMiliseg= $scope.aMilisegundos($scope.contratado.fechaNacimiento);
        } else {
            $scope.contratado.fechaNacimientoMiliseg=0;
        }
        $scope.contratado.$save();
    };
    
    $scope.eliminar = function(confirmado) {
        if (confirmado) {
            $scope.contratado.$delete(function() {
                $location.url('/contratadosBA');
            });
        } else {
            $("#confirmarEliminar").modal('show');
        }
    };
    
    $scope.editar = function() {
      $scope.editando=true;  
    };
    
    $scope.calcularAntiguedad = function(fecha1, fecha2) {
        if (!fecha1 && !fecha2) return 0;
        
        var array_fecha = fecha1.split("/");
        var anio = parseInt(array_fecha[2]);
        var mes = parseInt(array_fecha[1]);
        var dia = parseInt(array_fecha[0]);
        
        if (fecha2) {
            var array_fecha2 = fecha2.split("/");
            var anio2 = parseInt(array_fecha2[2]);
            var mes2 = parseInt(array_fecha2[1]);
            var dia2 = parseInt(array_fecha2[0]);
        } else {
            var hoy = new Date();
            var anio2 = hoy.getFullYear();
            var mes2 = hoy.getMonth() + 1;
            var dia2 = hoy.getUTCDate();
        }
    
        var edad=anio2 - anio - 1;
        if (mes2 - mes < 0) return edad;
        if (mes2 - mes > 0) return edad+1;
        if (dia2 - dia >= 0) return edad+1;
    
        return edad;
    };
    
})
.controller('ContratadosBAImprimirCtrl', function($scope, ContratadoBA, ORMOrganigrama, $routeParams, $window) {
    $scope.contratado = ContratadoBA.get({_id : $routeParams._id});
    $scope.organigrama = ORMOrganigrama.query();
    $scope.imprimir = function() {
        $window.print();
    };
    
    $scope.calcularAntiguedad = function(fecha1, fecha2) {
        if (!fecha1 && !fecha2) return 0;
        
        var array_fecha = fecha1.split("/");
        var anio = parseInt(array_fecha[2]);
        var mes = parseInt(array_fecha[1]);
        var dia = parseInt(array_fecha[0]);
        
        if (fecha2) {
            var array_fecha2 = fecha2.split("/");
            var anio2 = parseInt(array_fecha2[2]);
            var mes2 = parseInt(array_fecha2[1]);
            var dia2 = parseInt(array_fecha2[0]);
        } else {
            var hoy = new Date();
            var anio2 = hoy.getFullYear();
            var mes2 = hoy.getMonth() + 1;
            var dia2 = hoy.getUTCDate();
        }
    
        var edad=anio2 - anio - 1;
        if (mes2 - mes < 0) return edad;
        if (mes2 - mes > 0) return edad+1;
        if (dia2 - dia >= 0) return edad+1;
    
        return edad;
    };
    
    $scope.organigramaPorId = function (id) {
      for (var i = 0; i < $scope.organigrama.length; i++) {
          if ($scope.organigrama[i]._id == id)
          {
              return $scope.organigrama[i];
          }
      }  
    };
    
});