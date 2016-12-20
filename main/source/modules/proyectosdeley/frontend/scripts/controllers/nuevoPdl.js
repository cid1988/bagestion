angular.module('bag2.proyectosdeley').controller('nuevoPdlCtrl', function($scope,$location,$modal,Proyectosdeley,Comisiones,Grupos,ExpedienteSeguimiento,ORMContacto){
    $scope.pdl = new Proyectosdeley({
        giros:[]
    });
    $scope.comisiones = Comisiones.query();
    $scope.expedientes = ExpedienteSeguimiento.query();
    $scope.grupos = Grupos.query();
    $scope.contactos = ORMContacto.query({eliminado: JSON.stringify({$exists:false})});
    
    $scope.filtroGiros = function(c){
        return $scope.pdl && $scope.pdl.giros && $scope.pdl.giros.indexOf(c._id) == -1;
    };
    
    $scope.eliminarListaElem = function(elemento,lista){
        lista.splice(lista.indexOf(elemento), 1);
    };
    
    $scope.giroPorId = function(id){
        for (var i = 0; i < $scope.comisiones.length; i++) {
            if ($scope.comisiones[i]._id == id) {
                return $scope.comisiones[i];
            }
        }
    };
    
    $scope.grupoPorId = function(id) {
        for (var i = 0; i < $scope.grupos.length; i++) {
            if ($scope.grupos[i]._id == id) {
                return $scope.grupos[i];
            }
        }
    };
    
    $scope.agregarComisiones = function(confirmado){
        if(confirmado){
            $scope.comision.$save();
            $scope.comisiones = Comisiones.query();
        }else{
            $scope.comision = new Comisiones();
            $("#agregarComisiones").modal('show');
        }
    };
    
    $scope.agregarGrupos = function(confirmado){
        if(confirmado){
            $scope.grupo.$save();
            $scope.grupos = Grupos.query();
        }else{
            $scope.grupo = new Grupos();
            $("#agregarGrupos").modal('show');
        }
    };
    
    $scope.agregarGiro = function(dataGiros){
        if(!$scope.pdl.giros){
            $scope.pdl.giros = [];
        }
        $scope.pdl.giros.push(dataGiros);
        $scope.dataGiros = "";
    };
    
    $scope.guardar = function(){
        $scope.pdl.$save(function(){
            $location.url("/proyectosdeley/" + $scope.pdl._id);
        });
    };
    
    $scope.uploadedFile = [];
    $scope.agregarDocumentos = function(confirmado,data) {
        if(confirmado){
            data.archivoId = $scope.uploadedFile.shift().id;
            $scope.pdl.documentos.push(data);
        }else{
            if($scope.pdl.documentos === undefined){
                $scope.pdl.documentos = [];
            }
            var modalScope = $scope.$new();
            $modal({
                template: '/views/proyectosdeley/adjuntarArchivos.html',
                persist: true,
                show: true,
                backdrop: 'static',
                scope: modalScope
            });
        }
    };
}).controller('printPdlCtrl', function($scope,$window,Proyectosdeley,Grupos){
    $scope.pdl = Proyectosdeley.query({},function(){
          $scope.grupos = Grupos.query({},function(){
               $scope.grupos.forEach(function(grupo){
                    grupo.esGrupo = false;
                    var prio = 4;
                    grupo.vacio = true;
                    $scope.pdl.forEach(function(pdl)
                    {
                         if(grupo._id == pdl.grupo)
                         {
                              pdl.estado == "Ejecutivo" ? grupo.ejecutivo = true : "";
                              pdl.estado == "Legislativo" ? grupo.legis = true : "";
                              pdl.estado == "Segunda Lectura" ? grupo.segundaLectura = true : "";
                              pdl.estado == "Aprobado" ? grupo.aprobados = true : "";
                              if($scope.funcOrden(pdl) <= prio)
                              {
                                   grupo.vacio = false;
                                   grupo.prioridad = pdl.prioridad;
                                   prio = $scope.funcOrden(pdl);
                              }
                         }
                    });
                    grupo.proyecto = grupo.nombre;
                    grupo.esGrupo = true;
               });
               $scope.pdl = $scope.pdl.concat($scope.grupos);
          });
     });
    
    
    $scope.funcOrden = function(p){
        if(p.prioridad == "1"){
            return 0;
        }
        if(p.prioridad == "2"){
            return 1;
        }
        if(p.prioridad == "3"){
            return 2;
        }
    };
    
    $scope.diaHoy = moment(new Date()).format("DD/MM");
    
    $scope.filtroNoGrupo = function(p){
        if(!p.esGrupo){
            return true;
        }
    };

    $scope.mostrarHeader=function(index, valor)
    {
        valor=0;
        if(valor.estado=="Ejecutivo")
        {
            if(index==valor || index==valor+4 || index==valor+11 || index==valor+15 || index==valor+19)
            {
                
                return true;
            };
        }
    };
    
    $scope.mostrarFoot=function(index, valor)
    {
        
    };
    
    $scope.imprimir = function() {
        $window.print();
    };
});