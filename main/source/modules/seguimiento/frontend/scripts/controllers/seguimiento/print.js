angular.module('bag2.seguimiento.print', []).controller('PrintExpedientesCtrl',function($window, $scope, $http, ExpedienteSeguimiento, ORMOrganigrama, Contactos) {
    $window.document.title = 'Seguimiento';
    
    $scope.contactos = Contactos.listar();
    $scope.organigrama = ORMOrganigrama.query();
    
    $scope.expediente = ExpedienteSeguimiento.query();
    
    $scope.traerDatos = function(expediente){
        var consulta = {
            tipo: expediente.tipo,
            ano: expediente.ano,
            numero: expediente.numero,
            reparticion: expediente.reparticion
        };
        
        $http.post('/api/consultaSade', consulta).success(function(r){
            $scope.consultaSade = r.historialDeOperacion[0];
        });
    };
    
    $scope.filtroAct=true;
    
    $scope.calcularFecha = function(fecha){
        return moment(fecha).format('DD/MM/YYYY HH:mm')
    };
    
    $scope.colorFlecha = function(expediente){
        var ultExp = expediente.comentarios;
        if(ultExp && ultExp.length && expediente.fechaActualizacionSade){
            if(ultExp.slice(-1)[0].fechaComentario >= expediente.fechaActualizacionSade){
                $scope.botonIcon = 'icon-arrow-up';
                return 'btn btn-success';
            }else{
                $scope.botonIcon = 'icon-arrow-down';
                return 'btn btn-danger';
            }
        }else{
            $scope.botonIcon = 'icon-arrow-down';
            return 'btn btn-danger';
        }
    };
    
    $scope.jurisdiccionPorId = function (id) {
        for (var i = 0; i < $scope.organigrama.length; i++) {
            if ($scope.organigrama[i]._id == id){
                return $scope.organigrama[i];
            }
        }
    };
    
    $scope.interesadosPorId = function(array){
        var res = ""
        for(var a = 0; a < array.length; a++) {
            for(var i = 0; i < $scope.contactos.length; i++) {
                if($scope.contactos[i]._id == array[a]){
                    var nom = $scope.contactos[i].apellidos + " " + $scope.contactos[i].nombre + ", ";
                    res = res + nom
                }
            }
        }
        return res;
    };
    
    $scope.imprimir = function() {
        $window.print();
    };
    
    var f = new Date();
    $scope.hora = (f.getDate() + "/" + (f.getMonth() +1) + "/" + f.getFullYear() + ' - ' + f.getHours() + ':' + f.getMinutes() + ':'+ f.getSeconds());
});