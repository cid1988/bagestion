angular.module('bag2.proyectosdeley').controller('detallePdlCtrl', function($scope,$routeParams,$location,$modal,Proyectosdeley,Comisiones,Grupos,ExpedienteSeguimiento,ORMContacto){
    $scope.pdl = Proyectosdeley.get({_id: $routeParams._id});
    $scope.expedientes = ExpedienteSeguimiento.query();
    $scope.grupos = Grupos.query();
    $scope.comisiones = Comisiones.query();
    $scope.contactos = ORMContacto.query({eliminado: JSON.stringify({$exists:false})});
    
    $scope.editar = function(){
        $scope.copiaPDL = angular.copy($scope.pdl);
        $scope.editando = true;
    };
    
    $scope.cancelar = function(){
        $scope.pdl = angular.copy($scope.copiaPDL);
        $scope.editando = false;
    };
    
    $scope.guardar = function(){
        $scope.pdl.$save();
        $scope.editando = false;
    };
    
    $scope.eliminar = function(confirmado){
        if(confirmado){
            $scope.pdl.$delete(function(){
                $location.url('/proyectosdeley');
            });
        }else{
            $("#confirmarEliminar").modal('show');
        }
    };
    
    $scope.giroPorId = function(id) {
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
    
    $scope.expedientePorId = function(id) {
        for (var i = 0; i < $scope.expedientes.length; i++) {
            if ($scope.expedientes[i]._id == id) {
                return $scope.expedientes[i];
            }
        }
    };
    
    $scope.agregarGiro = function(dataGiros){
        if(!$scope.pdl.giros){
            $scope.pdl.giros = [];
        }
        $scope.pdl.giros.push(dataGiros);
        $scope.dataGiros = "";
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
    
    $scope.filtroGiros = function(c){
        return $scope.pdl && $scope.pdl.giros && $scope.pdl.giros.indexOf(c._id) == -1;
    };
    
    $scope.eliminarListaElem = function(elemento,lista){
        lista.splice(lista.indexOf(elemento), 1);
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
});
