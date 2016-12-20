angular.module('bag2.proyectosdeley', []).controller('PdlCtrl', function($scope,Proyectosdeley,Grupos){
    $scope.pdl = Proyectosdeley.query({},function(){
        $scope.grupos = Grupos.query({},function(){
            $scope.grupos.forEach(function(grupo){
                var prio = 4;
                $scope.pdl.forEach(function(pdl){
                    if(grupo._id == pdl.grupo){
                        grupo.vacio = true;
                        if($scope.funcOrden(pdl) <= prio){
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
    
    $scope.lengthGrupo = function(g){
        if(g.esGrupo){
            if(g.prioridad.length > 0){
                return true;
            }
            
        }
    };
    
    $scope.existeAdjunto = function(pdl){
        if(pdl.documentos && pdl.documentos.length > 0){
            return true;
        }else{
            return false;
        }
    };
}).controller('navbarPdlCtrl', function(){
    
});