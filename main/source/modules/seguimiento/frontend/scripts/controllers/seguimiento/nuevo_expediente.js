angular.module('bag2.seguimiento.nuevo', []).controller('NuevoExpedienteCtrl',function($window, $rootScope, $scope, $location, ExpedienteSeguimiento, ORMOrganigrama, Contactos, ORMTema) {
    
    $scope.expediente = new ExpedienteSeguimiento({
        comentarios: [],
        interesados:[],
        temas:[],
        //comentariosSade: [],
        //historialSade: [],
        activado:'true'
    });
    
    $scope.contactos = Contactos.listar();
    $scope.organigrama = ORMOrganigrama.list();
    $scope.temas2 = ORMTema.query();
    
    $scope.contactoPorId = function (id) {
        for (var i = 0; i < $scope.contactos.length; i++) {
            if ($scope.contactos[i]._id == id){
                return $scope.contactos[i];
            }
        }
    };
    
    $scope.jurisdiccionPorId = function (id) {
        if(id){
            for (var i = 0; i < $scope.organigrama.length; i++) {
                if ($scope.organigrama[i]._id == id){
                    return $scope.organigrama[i];
                }
            }
        }
    };
    
    $scope.temaPorId = function (id) {
        for (var i = 0; i < $scope.temas2.length; i++) {
            if ($scope.temas2[i]._id == id){
                return $scope.temas2[i];
            }
        }
    };
    
    $scope.guardar = function() {
        if ($scope.form.$valid) {
            var f = new Date();
            $scope.expediente.fechaUltimaModificacion = moment(f).format('DD/MM/YYYY'),
            $scope.expediente.tipo = $scope.expediente.tipo.toUpperCase();
            //$scope.expediente.fechaVencimientoOrden = moment($scope.expediente.fechaVencimiento,"DD/MM/YYYY").format('YYYYMMDD');
            //$scope.expediente.fechaVencimiento = moment($scope.expediente.fechaVencimiento,"DD/MM/YYYY").format('DD/MM/YYYY');
            
            $scope.expediente.$save(function(){
                $location.url('/expedientes/' + $scope.expediente._id);
            });
        }
    };
    
    //Autocomplete para el campo reparticion
    $scope.reparticiones = ORMOrganigrama.query(function() {
        $scope.reparticionesDict = {};
        $scope.reparticionesSiglas = [];
        $scope.reparticiones.forEach(function(item) {
            if (item.sigla) {
                $scope.reparticionesDict[item._id] = item;
                $scope.reparticionesSiglas.push(item.sigla);
            }
        });
    });
    
    //Autocomplete para el campo tema
    $scope.temas = ExpedienteSeguimiento.query(function() {
        $scope.temasDict = {};
        $scope.temasSiglas = [];
        $scope.temas.forEach(function(item) {
            if (item.tema) {
                $scope.temasDict[item._id] = item;
                $scope.temasSiglas.push(item.tema);
            }
        });
    });
    
    $scope.agregarInteresado = function(dataInteresado) {
        if (!$scope.expediente.interesados) {
            $scope.expediente.interesados = [];
        }
        $scope.expediente.interesados.push(dataInteresado);
        $scope.dataInteresado = "";
    };
    
    $scope.agregarTema = function(dataTema) {
        if (!$scope.expediente.temas) {
            $scope.expediente.temas = [];
        }
        $scope.expediente.temas.push(dataTema);
        $scope.dataTema = "";
    };
    
    $scope.filtrarInteresados = function(i) {
        return $scope.expediente && $scope.expediente.interesados && $scope.expediente.interesados.indexOf(i._id) == -1;
    };
    
    $scope.filtrarTemas = function(i) {
        return $scope.expediente && $scope.expediente.temas && $scope.expediente.temas.indexOf(i._id) == -1;
    };
    
    $scope.eliminarListaElem = function(elemento, lista) {
        lista.splice(lista.indexOf(elemento), 1);
    };
    
    $scope.findById = function (lista, id) {
        if (lista && lista.length && id) {
            for (var i = 0; i < lista.length; i++) {
                if (lista[i]._id == id) {
                    return lista[i];
                }
            }
        }
    };
});