angular.module('bag2.seguimiento.printdetalle', []).controller('PrintDetalleExpedienteCtrl',function($scope, $http, ExpedienteSeguimiento, $routeParams, $window, ORMOrganigrama, Contactos){
    $window.document.title = 'Seguimiento';
    
    $scope.expediente = ExpedienteSeguimiento.get({_id: $routeParams.id},function(){
        var consulta = {
            tipo: $scope.expediente.tipo,
            ano: $scope.expediente.ano,
            numero: $scope.expediente.numero,
            reparticion: $scope.expediente.reparticion
        };
        
        $http.post('/api/consultaSade', consulta).success(function(r){
            $scope.consultaSade = r;
        });
    });
    
    $scope.organigrama = ORMOrganigrama.query();
    $scope.jurisdiccionPorId = function (id) {
        for (var i = 0; i < $scope.organigrama.length; i++) {
            if ($scope.organigrama[i]._id == id){
                return $scope.organigrama[i];
            }
        }
    };
    
    $scope.contactos = Contactos.listar();
    $scope.contactoPorId = function (id) {
        for (var i = 0; i < $scope.contactos.length; i++) {
            if($scope.contactos[i]._id == id){
                return $scope.contactos[i];
            }
        }
    };
    
    $scope.interesadosPorId = function(array){
        var res = "";
        for(var a = 0; a < array.length; a++) {
            for(var i = 0; i < $scope.contactos.length; i++) {
                if($scope.contactos[i]._id == array[a]){
                    var nom = $scope.contactos[i].apellidos + " " + $scope.contactos[i].nombre + ", ";
                    res = res + nom;
                }
            }
        }
        return res;
    };
    
    $scope.colorFlecha = function(){
        var ultExp = $scope.expediente.comentarios;
        if(ultExp && ultExp.length && $scope.expediente.fechaActualizacionSade){
            if(ultExp.slice(-1)[0].fechaComentario >= $scope.expediente.fechaActualizacionSade){
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
    
    $scope.imprimir = function() {
        $window.print();
    };
    
    $scope.calcularFecha = function(fecha){
        return moment(fecha).format('DD/MM/YYYY HH:mm')
    };
    
    $scope.hora = $scope.calcularFecha(new Date());
});