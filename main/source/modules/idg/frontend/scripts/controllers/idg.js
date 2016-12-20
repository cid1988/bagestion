angular.module('bag2.idg', [])
.controller('IDGCtrl', function($scope, IDG, ORMOrganigrama , ORMTema, ORMMinuta, ORMReunion, ORMInstanciaReunion) {
    $scope.archivos= IDG.query();
    $scope.instancias= ORMInstanciaReunion.query();
    $scope.reuniones= ORMReunion.query();
    $scope.organigrama = ORMOrganigrama.query();
    $scope.temasFiltrados = [];
    $scope.temas = ORMTema.query({ eliminado: JSON.stringify({$exists: false}) },function(){
        for(var x = 0; x < $scope.temas.length ; x++){
            if($scope.temas[x].nivel <=3){
                 $scope.temasFiltrados.push($scope.temas[x]);
            }
        }
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
    
    $scope.traerPresentacionesORM = function() {
        var minutas= ORMMinuta.query({}, function() {
            minutas.forEach(function(m) { 
                if (m.presentaciones) {
                    for(var x = 0; x < m.presentaciones.length ; x++){
                        var archivo = new IDG({
                            "tema": m.presentaciones[x].temas[0] || "",
                            "nombre": m.presentaciones[x].nombre,
                            "tipo": m.presentaciones[x].tipo || "",
                            "fuente": m.presentaciones[x].fuente || "",
                            "fecha": m.presentaciones[x].fecha,
                            "autor": m.presentaciones[x].autor,
                            "descripcion": m.presentaciones[x].descripcion,
                            "jurisdiccion": $scope.reunionPorId($scope.instanciaPorId(m.instancia).reunion).jurisdiccion || "",
                            "fechaMiliseg": $scope.aMilisegundos(m.presentaciones[x].fecha),
                            "archivoId": m.presentaciones[x].archivoId,
                            "minutaId": m._id,
                        });
                        archivo.$save();
                    }
                    m.presentaciones = true;
                    m.$save();
                }
            });
        });
    };
    
    $scope.instanciaPorId = function (id) {
      for (var i = 0; i < $scope.instancias.length; i++) {
          if ($scope.instancias[i]._id == id)
          {
              return $scope.instancias[i];
          }
      }  
    };
    
    $scope.reunionPorId = function (id) {
      for (var i = 0; i < $scope.reuniones.length; i++) {
          if ($scope.reuniones[i]._id == id)
          {
              return $scope.reuniones[i];
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
            if(ba.fechaMiliseg<=compararFechaMinima && ba.fechaMiliseg>=compararFechaMaxima) {
                return true;
            } else {
                return false;
            }
        }
        else if($scope.edadMinima) {
            if(ba.fechaMiliseg<=compararFechaMinima) {
                return true;
            } else {
                return false;
            }
        }
        else if($scope.edadMaxima) {
            if(ba.fechaMiliseg>=compararFechaMaxima) {
                return true;
            } else {
                return false;
            }
        } else {
            return true;
        }
    };
    
    $scope.temaPorId = function(r){
        for (var i = 0; i < $scope.temas.length; i++) {
          if ($scope.temas[i]._id == r) {
              return $scope.temas[i];
          }
      } 
    };
     
})
.controller('IDGNuevoCtrl', function($scope, IDG, ORMOrganigrama , ORMTema) {

    $scope.archivo=new IDG({
        tema: '',
        jurisdiccion: '',
        fuente: '',
        tipo: ''
    });
    $scope.uploaded = [];
    $scope.organigrama = ORMOrganigrama.query();
    $scope.temasFiltrados = [];
    $scope.temas = ORMTema.query({ eliminado: JSON.stringify({$exists: false}) },function(){
        for(var x = 0; x < $scope.temas.length ; x++){
            if($scope.temas[x].nivel <=3){
                 $scope.temasFiltrados.push($scope.temas[x]);
            }
        }
    });
    
    $scope.temaPorId = function(r){
        for (var i = 0; i < $scope.temas.length; i++) {
          if ($scope.temas[i]._id == r) {
              return $scope.temas[i];
          }
      } 
    };
    
    $scope.aMilisegundos = function(fecha) {
        var fechaDividida = fecha.split("/");
        var date = new Date(fechaDividida[2], fechaDividida[1] - 1, fechaDividida[0], 0, 0, 0, 0);
        return date.getTime();
    };
    
    $scope.guardar=function() {
        if ($scope.uploaded.length) {
            $scope.archivo.archivoId = $scope.uploaded.shift().id;
        }
        if($scope.archivo.fecha) {
            $scope.archivo.fechaMiliseg= $scope.aMilisegundos($scope.archivo.fecha);
        } else {
            $scope.archivo.fechaMiliseg=0;
        }
        $scope.archivo.$save();
    };


    $scope.agregarIdioma=function(valorIdioma) {   
        if (!$scope.archivo.idiomas) {
            $scope.archivo.idiomas = [];
        }
        if ($scope.archivo.idiomas.length<=5) {
            $scope.archivo.idiomas.push(valorIdioma);
        } else {
            alert("Ya ingreso todos los posibles");
        }
        $scope.valorIdioma = "";
    };
    
    $scope.agregarSistema=function(valorSistema) {   
        if (!$scope.archivo.sistemas) {
            $scope.archivo.sistemas = [];
        }
        $scope.archivo.sistemas.push(valorSistema);
        $scope.valorSistemas = "";
    };
    
    $scope.agregarEstudios=function(valorEst) {
        if (!$scope.archivo.estudios) {
            $scope.archivo.estudios = [];
        }
        $scope.archivo.estudios.push(valorEst);
        $scope.estudios = "";
    };
    
    $scope.agregarReferencia=function(valorReferencia) {   
        if (!$scope.archivo.referencias) {
            $scope.archivo.referencias = [];
        }
        $scope.archivo.referencias.push(valorReferencia);
        $scope.referencias = "";
    };
    
    $scope.agregarExperiencia=function(valorExp) {
        if(!$scope.archivo.experiencias) {
            $scope.archivo.experiencias=[];
        }
        $scope.archivo.experiencias.push(valorExp);
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
.controller('IDGDetalleCtrl',function($scope, IDG, $routeParams, $location, ORMOrganigrama , ORMTema, Fact){
    $scope.temas = ORMTema.query();
    $scope.archivo = IDG.get({ 
            _id: $routeParams._id
    }, function(){
        $scope.lista = Fact.query({}, function(){
            angular.forEach($scope.lista, function(fact){
                if(fact.documentoIDG == $scope.archivo._id){
                        //$scope.fact = fact;
                        $scope.listaBaFacts.push(fact);
                  }
            });   
            if(!$scope.fact){
                $scope.fact = new Fact();
            }
        });
    });
    
    $scope.listaBaFacts = [];
    $scope.uploaded = [];
    $scope.organigrama = ORMOrganigrama.query();
    $scope.temasFiltrados = [];
    $scope.temas = ORMTema.query({ eliminado: JSON.stringify({$exists: false}) },function(){
        for(var x = 0; x < $scope.temas.length ; x++){
            if($scope.temas[x].nivel <=3){
                 $scope.temasFiltrados.push($scope.temas[x]);
            }
        }
    });
    
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
    
    $scope.temaPorId = function(r){
        for (var i = 0; i < $scope.temas.length; i++) {
          if ($scope.temas[i]._id == r) {
              return $scope.temas[i];
          }
      } 
    };
    
    $scope.organigramaPorId = function (id) {
      for (var i = 0; i < $scope.organigrama.length; i++) {
          if ($scope.organigrama[i]._id == id) {
              return $scope.organigrama[i];
          }
      }  
    };
    
    $scope.aMilisegundos = function(fecha) {
        var fechaDividida = fecha.split("/");
        var date = new Date(fechaDividida[2], fechaDividida[1] - 1, fechaDividida[0], 0, 0, 0, 0);
        return date.getTime();
    };
    
    $scope.guardar=function() {
        if ($scope.uploaded.length) {
            $scope.archivo.archivoId = $scope.uploaded.shift().id;
        }
        if($scope.archivo.fecha) {
            $scope.archivo.fechaMiliseg= $scope.aMilisegundos($scope.archivo.fecha);
        } else {
            $scope.archivo.fechaMiliseg=0;
        }
        $scope.archivo.$save();
    };
    
    $scope.eliminar = function(confirmado) {
        if (confirmado) {
            $scope.archivo.$delete(function() {
                $location.url('/idg');
            });
        } else {
            $("#confirmarEliminar").modal('show');
        }
    };
    
    $scope.editar = function() {
      $scope.editando=true;  
    };
    
    $scope.cambiarEstado = function(){
        if($scope.archivo.procesado){
           $scope.archivo.procesado  = false;
        }else{
           $scope.archivo.procesado  = true;
        }
    }
    
    $scope.verBaFacts = false;
    
    $scope.mostrarDatos = function(){
        if($scope.verBaFacts){
            $scope.verBaFacts = false;
        }else{
            $scope.verBaFacts = true;
        }
    };
    
    $scope.agregarBaFacts = function(){
        $('#agregarBaFacts').modal('show');
    };
    
    $scope.guardarBaFact = function(){
       $scope.fact.documentoIDG = $scope.archivo._id;
       $scope.fact.fuente = "IDG";
       $scope.fact.$save({}, function() {
           $scope.listaBaFacts.push($scope.fact);
           $scope.fact = "";
           $scope.fact = new Fact();
           $scope.archivo.procesado  = true;
       });
    };
})
.controller('IDGImprimirCtrl', function($scope, IDG, $routeParams, $window) {
    $scope.archivo = IDG.get({_id : $routeParams._id});
    
    $scope.imprimir = function() {
        $window.print();
    };
});