angular.module('bag2.edg', []).controller('EdgCtrl', function($scope,Obra,$http,$location,Edg,EdgPresupuestoSigaf,Comuna,ORMOrganigrama,ImpactoObra,Obras2) {
    
    $scope.edg = Edg.get({_id: "54b54c45c2fa860b7872c62a"});
    
    $scope.$watch('filtro.valor', function(g) {
        if(g == ""){
            g = "comuna";
        }
        if(g == "comuna"){
            $scope.comunas = Comuna.query({}, function(){
                $scope.comunas.forEach(function(comuna){
                    comuna.sancion = 0;
                    comuna.vigente = 0;
                    comuna.restringido = 0;
                    comuna.preventivo = 0;
                    comuna.definitivo = 0;
                    comuna.devengado = 0;
                    comuna.disponible = 0;
                    comuna.pagado = 0;
                    comuna.gestion = 0;
                });
                $scope.totalSancion = 0;$scope.totalVigente = 0;$scope.totalRestringido = 0;$scope.totalPreventivo = 0;$scope.totalDefinitivo = 0;$scope.totalDevengado = 0;$scope.totalDisponible = 0;$scope.totalPagado = 0;$scope.totalGestion = 0;
                $scope.presupuestos = EdgPresupuestoSigaf.query({}, function() {
                    $scope.presupuestos.forEach(function(p) {
                        var c = $scope.comunaPorId(p.comuna);
                        if(p.sancion){
                            c.sancion = c.sancion + parseFloat(p.sancion);
                            $scope.totalSancion = $scope.totalSancion + parseFloat(p.sancion);
                        }
                        if(p.vigente){
                            c.vigente = c.vigente + parseFloat(p.vigente);
                            $scope.totalVigente = $scope.totalVigente + parseFloat(p.vigente);
                        }
                        if(p.restringido){
                            c.restringido = c.restringido + parseFloat(p.restringido);
                            $scope.totalRestringido = $scope.totalRestringido + parseFloat(p.restringido);
                        }
                        if(p.preventivo){
                            c.preventivo = c.preventivo + parseFloat(p.preventivo);
                            $scope.totalPreventivo = $scope.totalPreventivo + parseFloat(p.preventivo);
                        }
                        if(p.definitivo){
                            c.definitivo = c.definitivo + parseFloat(p.definitivo);
                            $scope.totalDefinitivo = $scope.totalDefinitivo + parseFloat(p.definitivo);
                        }
                        if(p.devengado){
                            c.devengado = c.devengado + parseFloat(p.devengado);
                            $scope.totalDevengado = $scope.totalDevengado + parseFloat(p.devengado);
                        }
                        if(p.disponible){
                            c.disponible = c.disponible + parseFloat(p.disponible);
                            $scope.totalDisponible = $scope.totalDisponible + parseFloat(p.disponible);
                        }
                        if(p.pagado){
                            c.pagado = c.pagado + parseFloat(p.pagado);
                            $scope.totalPagado = $scope.totalPagado + parseFloat(p.pagado);
                        }
                        if(p.pGestion){
                            var ges = p.pGestion.replace(/\./g,'');
                            c.gestion = c.gestion + parseFloat(ges);
                            $scope.totalGestion = $scope.totalGestion + parseFloat(ges);
                        }
                    });
                });
                $scope.listado = $scope.comunas;
            });
        }
        
        if(g == "jurisdiccion"){
            $scope.filtro.porcentaje == 'true';
            $scope.jurisdicciones = ORMOrganigrama.query({}, function(){
                $scope.jurisdicciones.forEach(function(c){
                    c.sancion = 0;
                    c.vigente = 0;
                    c.restringido = 0;
                    c.preventivo = 0;
                    c.definitivo = 0;
                    c.devengado = 0;
                    c.disponible = 0;
                    c.pagado = 0;
                    c.gestion = 0;
                });
                $scope.presupuestos = EdgPresupuestoSigaf.query({}, function() {
                    $scope.presupuestos.forEach(function(p) {
                        var c = $scope.jurisdiccionPorId(p.jurisdiccion);
                        if(p.sancion){
                            c.sancion = c.sancion + parseFloat(p.sancion);
                        }
                        if(p.vigente){
                            c.vigente = c.vigente + parseFloat(p.vigente);
                        }
                        if(p.restringido){
                            c.restringido = c.restringido + parseFloat(p.restringido);
                        }
                        if(p.preventivo){
                            c.preventivo = c.preventivo + parseFloat(p.preventivo);
                        }
                        if(p.definitivo){
                            c.definitivo = c.definitivo + parseFloat(p.definitivo);
                        }
                        if(p.devengado){
                            c.devengado = c.devengado + parseFloat(p.devengado);
                        }
                        if(p.disponible){
                            c.disponible = c.disponible + parseFloat(p.disponible);
                        }
                        if(p.pagado){
                            c.pagado = c.pagado + parseFloat(p.pagado);
                        }
                        if(p.pGestion){
                            var ges = p.pGestion.replace(/\./g,'');
                            c.gestion = c.gestion + parseFloat(ges);
                        }
                    });
                });
                $scope.listado = $scope.jurisdicciones;
            });
        }
    });
	
    $scope.comunaPorId = function(id) {
        for (var i = 0; i < $scope.comunas.length; i++) {
            if ($scope.comunas[i]._id == id) {
                return $scope.comunas[i];
            }
        }
    };
    
    $scope.jurisdiccionPorId = function(id) {
        for (var i = 0; i < $scope.jurisdicciones.length; i++) {
            if ($scope.jurisdicciones[i]._id == id) {
                return $scope.jurisdicciones[i];
            }
        }
    };
    
    $scope.impactosPorId = function(id) {
        for (var i = 0; i < $scope.impactos.length; i++) {
            if ($scope.impactos[i]._id == id) {
                return $scope.impactos[i];
            }
        }
    };
    
    $scope.diaHoy = moment(new Date()).format("DD/MM/YYYY");
    
    $scope.actualizarSigaf = function(){
        function actualizarSigaf(){
            var obras = Obra.query(function(){
                var obras2 = Obras2.query(function(){
                    $scope.obras = obras.concat(obras2);
                    for(var i=0; i < $scope.obras.length; i++){
                        if($scope.obras[i].presupuestoSigaf && $scope.obras[i].presupuestoSigaf.slice(-1)[0]){
                            if($scope.obras[i].comuna){
                                $scope.obras[i].comuna.forEach(function(comuna){
                                    if($scope.obras[i].presupuestoSigaf) var pre = $scope.obras[i].presupuestoSigaf.slice(-1)[0] || 0;
                                    var jur = $scope.obras[i].jurisdiccion;
                                    var imp = $scope.obras[i].impacto;
                                    if($scope.obras[i].nombrar) var pGestion = $scope.obras[i].nombrar.slice(-1)[0].monto;
                                    $scope.op = {
                                        actividad: pre.partida_act,
                                        ejercicio: pre.ejercicio,
                                        entidad: pre.partida_ent,
                                        fueFinan: pre.partida_ff,
                                        inciso: pre.partida_inc,
                                        jurisdiccion: pre.partida_jur,
                                        moneda: pre.partida_mon,
                                        obra: pre.partida_obra,
                                        parcial: pre.partida_par,
                                        principal: pre.partida_pri,
                                        programa: pre.partida_pr,
                                        proyecto: pre.partida_proy,
                                        subjurisdiccion: '0',
                                        subparcial: '0',
                                        subprograma: '0',
                                        ubicacionGeografica: pre.partida_ubg,
                                        idimput: '0'
                                    };
                                    
                                    $http.post('/api/consulta-sigaf', $scope.op).success(function (r) {
                                        var sigaf = r;
                                        var presupuestoSigaf = new EdgPresupuestoSigaf({
                                            comuna: comuna,
                                            jurisdiccion: jur,
                                            impacto: imp,
                                            pGestion: pGestion,
                                            restringido: sigaf.restringido,
                                            definitivo: sigaf.definitivo,
                                            devengado: sigaf.devengado,
                                            pagado: sigaf.pagado,
                                            disponible: sigaf.disponible,
                                            preventivo: sigaf.preventivo,
                                            vigente: sigaf.vigente
                                        });
                                        presupuestoSigaf.$save();
                                    })
                                    .error(function(){
                                        return "";
                                    });
                                });
                            }
                        }
                    }
                });
            });
            actualizarFecha();
        }
        
        function borrarPresupuestos(){
            var presupuestos = EdgPresupuestoSigaf.query({},function(){
                for(var i=0;i<presupuestos.length;i++){
                    presupuestos[i].$delete();
                }
            });
            actualizarSigaf();
        }
        
        function actualizarFecha(){
            $scope.edg = Edg.get({_id: "54b54c45c2fa860b7872c62a"},function(){
                $scope.edg.ultimaActualizacion = $scope.diaHoy;
                $scope.edg.$save();
            });
        }
        borrarPresupuestos();
    };
    
    //Codigo anterior que borraba toda la coleccion y no actualizaba los datos
    // $scope.actualizarSigaf = function(){
    //     $scope.edg = Edg.get({_id: "54b54c45c2fa860b7872c62a"},function(){
    //         $scope.presupuestos = EdgPresupuestoSigaf.query({}, function() {
    //             $scope.presupuestos.forEach(function(presupuesto){
    //                 presupuesto.$delete(function(){
    //                     var obras = Obra.query({},function(){
    //                         var obras2 = Obras2.query({},function(){
    //                             $scope.obras = obras.concat(obras2);
    //                             for(var i=0; i < $scope.obras.length; i++){
    //                                 if($scope.obras[i].presupuestoSigaf && $scope.obras[i].presupuestoSigaf.slice(-1)[0]){
    //                                     if($scope.obras[i].comuna){
    //                                         $scope.obras[i].comuna.forEach(function(comuna){
    //                                             if($scope.obras[i].presupuestoSigaf) var pre = $scope.obras[i].presupuestoSigaf.slice(-1)[0] || 0
    //                                             var jur = $scope.obras[i].jurisdiccion;
    //                                             var imp = $scope.obras[i].impacto;
    //                                             if($scope.obras[i].nombrar) var pGestion = $scope.obras[i].nombrar.slice(-1)[0].monto;
    //                                             $scope.op = {
    //                                                 actividad: pre.partida_act,
    //                                                 ejercicio: pre.ejercicio,
    //                                                 entidad: pre.partida_ent,
    //                                                 fueFinan: pre.partida_ff,
    //                                                 inciso: pre.partida_inc,
    //                                                 jurisdiccion: pre.partida_jur,
    //                                                 moneda: pre.partida_mon,
    //                                                 obra: pre.partida_obra,
    //                                                 parcial: pre.partida_par,
    //                                                 principal: pre.partida_pri,
    //                                                 programa: pre.partida_pr,
    //                                                 proyecto: pre.partida_proy,
    //                                                 subjurisdiccion: '0',
    //                                                 subparcial: '0',
    //                                                 subprograma: '0',
    //                                                 ubicacionGeografica: pre.partida_ubg,
    //                                                 idimput: '0'
    //                                             };
                                                
    //                                             $http.post('/api/consulta-sigaf', $scope.op)
    //                                             .success(function (r) {
    //                                                 var sigaf = r;
                                                    
    //                                                 var presupuestoSigaf = new EdgPresupuestoSigaf({
    //                                                     comuna: comuna,
    //                                                     jurisdiccion: jur,
    //                                                     impacto: imp,
    //                                                     pGestion: pGestion,
    //                                                     restringido: sigaf.restringido,
    //                                                     definitivo: sigaf.definitivo,
    //                                                     devengado: sigaf.devengado,
    //                                                     pagado: sigaf.pagado,
    //                                                     disponible: sigaf.disponible,
    //                                                     preventivo: sigaf.preventivo,
    //                                                     vigente: sigaf.vigente
    //                                                 });
                                                    
    //                                                 presupuestoSigaf.$save();
    //                                             })
    //                                             .error(function(){
    //                                                 return "";
    //                                             });
    //                                         });
    //                                     }
    //                                 }
    //                             }
    //                         })
    //                         $scope.edg.ultimaActualizacion = $scope.diaHoy;
    //                         $scope.edg.$save();
    //                     });
    //                 });
    //             });
    //         });
    //     });
    // };
});