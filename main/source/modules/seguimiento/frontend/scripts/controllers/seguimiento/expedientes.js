angular.module('bag2.seguimiento', []).controller('ExpedientesCtrl',function($window, $rootScope, $scope, ExpedienteSeguimiento, Contactos, ORMOrganigrama) {
    $window.document.title = 'Seguimiento';
    $rootScope.activeSection = 'otros';
    
    // $scope.arreglarFechas = function(){
    //     $scope.expedientes.forEach(function(exp){
    //         exp.comentarios.forEach(function(com){
    //             if(com.fechaUltimoComentario && com.fechaUltimoComentario.length){
    //                 if(com.horaUltimoComentario){
    //                     var hora = com.horaUltimoComentario;
    //                 }else{
    //                     var hora = '03:00'
    //                 }
    //                 var a = moment(com.fechaUltimoComentario,'DD/MM/YYYY').format('YYYY-MM-DD') + 'T' + hora + ':00.000Z';
    //                 com.fechaComentario = a;
    //             }else{
    //                 com.fechaComentario = '';
    //             }
    //         });
    //         exp.$save();
    //     });
    // };
    
    $scope.contactoPorId = function (id) {
        for (var i = 0; i < $scope.contactos.length; i++) {
            if ($scope.contactos[i]._id == id){
                return $scope.contactos[i];
            }
        }
    };
    
    $scope.jurisdiccionPorId = function (id){
        for(var i = 0; i < $scope.organigrama.length; i++){
            if ($scope.organigrama[i]._id == id){
                return $scope.organigrama[i];
            }
        }
    };
    
    $scope.expedientes = ExpedienteSeguimiento.query(function(){
        $scope.contactos = Contactos.listar(function(){
            $scope.organigrama = ORMOrganigrama.query(function(){
                // angular.forEach($scope.expedientes, function(e) {
                //     e.fechaVencimientoMilliseconds = moment(e.fechaVencimiento, "YY/MM/DD").toDate().valueOf();//Convertir la fecha de vencimiento a un numero entero
                // });
                
                for(var x = 0; x < $scope.expedientes.length; x++){
                    var xp = $scope.expedientes[x];
                    
                    if(xp.tema && xp.tema.length){
                        xp.ordenTipo = xp.tema;
                    }else{
                        xp.ordenTipo = "";
                    }
                    
                    if(xp.jurisdiccion && $scope.jurisdiccionPorId(xp.jurisdiccion)){
                        var xx = $scope.jurisdiccionPorId(xp.jurisdiccion);
                        xp.ordenJurisdiccion = xx.nombreCompleto;
                    }else{
                        xp.ordenJurisdiccion = " ";
                    }
                    
                    xp.ordenExpediente = (xp.tipo || "") + (xp.ano || "") + (xp.numero || "") + (xp.reparticion || "");
                    
                    if(xp.comentarios && xp.comentarios.slice(-1)[0] && xp.comentarios.slice(-1)[0].fechaComentario){
                        xp.ordenUltimoComentario = xp.comentarios.slice(-1)[0].fechaComentario;
                    }else{
                        xp.ordenUltimoComentario = " ";
                    }
                }
            });
        });
    });
    
    $scope.colorFlecha = function(expediente){
        var ultExp = expediente.comentarios;
        if(ultExp && ultExp.length && expediente.fechaActualizacionSade){
            if(ultExp.slice(-1)[0].fechaComentario >= expediente.fechaActualizacionSade){
                return true;
            }else{
                return false;
            }
        }else{
            return false;
        }
    };
    
    $scope.formatFecha = function(fecha){
        if(fecha){
            return moment(fecha).format('DD/MM/YYYY')
        }else{
            return "";
        }
    };
    
    $scope.$watch('expedientes', function() {
        $scope.filtroAct=true;
    });
}).controller('expedientesNavbarCtrl',function($scope,ExpedientesConfig){
    $scope.cambiarPreset = function(confirmado, data){
        if(confirmado){
            $scope.exp.$save();
        }else{
            $scope.exp = ExpedientesConfig.get({_id:'51337baa1bc0d6af1f000001'},function(){
                $("#cambiarPreset").modal('show');
                //$('input').val('');
            });
        }
    };
});