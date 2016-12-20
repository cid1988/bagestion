angular.module('bag2.seguimiento.sade', [])
.controller('HistorialSadeCtrl',function($window, $rootScope, $scope, $routeParams, $location, ExpedienteSeguimiento) {
    $window.document.title = 'Seguimiento';
    $rootScope.activeSection = 'otros';
    
    $scope.orden = 'fechaVencimientoMilliseconds';
    
    $scope.expedientes = ExpedienteSeguimiento.query(function () {
        angular.forEach($scope.historialSade, function(e) {
            e.fechaVencimientoMilliseconds = moment(e.fecha, "YYYY").toDate().valueOf();//Convertir la fecha de vencimiento a un numero entero
        });
    });
    
    /*$scope.puedeModificar = function() {
        return arrayContains($scope.user.permissions, 'actualizarSeguimiento') || arrayContains($scope.user.permissions, 'master');
    };*/
    
    $scope.expediente = ExpedienteSeguimiento.get({_id: $routeParams.id});
    
    $scope.VerHistorialSade = true;
    
    /*Master es la copia de la db*/
    $scope.update = function(expediente) {
        $scope.master = angular.copy(expediente);
    };
    
    /*Reset de datos si se cancela la seleccion a consolidar*/
    $scope.reset = function() {
        $scope.expediente = angular.copy($scope.master);
    };
    
    //Agregar historial sade
    $scope.nuevoHistorialSade = function(master) {
        $scope.update(master);
        $scope.agregarHistorialSade=true;
        $scope.data = {};
        $scope.VerHistorialSade = false;
    };
    
    $scope.modificar = function(master) {
        $scope.update(master);
        $scope.modificando = true;
    };
    
    //Guardar nuevo historial SADE
    $scope.guardarNuevo = function(data) {
        $scope.historialSade || ($scope.historialSade = []);
        $scope.expediente.historialSade.push(data);
        $scope.expediente.$save(function() {
            //showAlert('El SADE se ha guardado con éxito');
            $location.url('/expedientes/historialsade/' + $scope.expediente._id);
            $scope.agregarHistorialSade = false;    
        });
    };
    
    //Guardar modificaciones
    $scope.guardarModifSade = function(data) {
        $scope.update();
        var f = new Date();
        $scope.expediente.fechaUltimaModificacion = (f.getDate() + "/" + (f.getMonth() +1) + "/" + f.getFullYear());
        $scope.expediente.$save(function() {
            //showAlert('El expediente se ha actualizado con éxito');
            $scope.modificando = false;
        });
    };
    
    //Cancelar cambios
    $scope.cancelar = function() {
        $scope.agregarHistorialSade = false;
        $scope.VerHistorialSade = true;
        $scope.modificando = false;
        $scope.reset();
    };
    
    //Agregar comentarios al documento SADE
    $scope.agregarComSade = function(confirmado, dataSade) {
        if (confirmado) {
            $scope.expediente.comentariosSade.push(dataSade);
            $scope.expediente.$save(function() {
                
            });
            //showAlert('Se agrego un comentario al documento SADE');
        }
        else {
            $scope.dataSade = {
                comentariosSade: '',
                fuenteComentarioSade: '',
                fechaComentarioSade: '',
            };
            $("#agregarComentarioSade").modal('show');
        }
    };
});