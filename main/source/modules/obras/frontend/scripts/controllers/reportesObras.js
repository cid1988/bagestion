angular.module('bag2.obras').controller('ReportesObrasCtrl', function($scope,Obra,Comuna,Obras2) {
    $scope.comunasTabla = Comuna.query(function () {
        $scope.comunasPorId = {};
        angular.forEach($scope.comunasTabla, function (c) {
            $scope.comunasPorId[c._id] = c.numero;
        });
        
        $scope.filtro = function(orden1,dependencia){
            $scope.obras = Obra.query({
                $and:JSON.stringify([
                    {"estado":"52e90195491f2d16f8bc1bc8"},
                    {"orden1":orden1},
                    {"dependencia":dependencia}
                ])
            }, function(){
                var obras2 = Obras2.query({
                    $and:JSON.stringify([
                        {"estado":"52e90195491f2d16f8bc1bc8"},
                        {"orden1":orden1},
                        {"dependencia":dependencia}
                    ])
                }, function(){
                    $scope.obras = $scope.obras.concat(obras2);
                    
                    var x = $scope.matriz = {};
                    angular.forEach($scope.obras, function (o) {
                        var final = (o.final || []).slice(-1)[0];
                        if (!final) return;
                        
                        var fechaFinal = moment(final.fecha, "DD/MM/YYYY"),
                            mes = fechaFinal.month(),
                            año = fechaFinal.year();
                        
                        angular.forEach(o.comuna || [], function (oc) {
                            var anos = x[$scope.comunasPorId[oc]];
                            
                            //Sumar las fechas que entran en cada mes
                            if (!anos) {
                                anos = x[$scope.comunasPorId[oc]] = {};
                            }
                            
                            if (!anos[año]) anos[año] = {};
                            
                            if (!anos[año][mes]) anos[año][mes] = 0;
                            
                            anos[año][mes] = anos[año][mes] + 1;
                            
                            //Sumar las columnas
                            if (!x[16]) {
                                x[16] = {};
                            }
                            
                            if (!x[16][año]) x[16][año] = {};
                            
                            if (!x[16][año][mes]) x[16][año][mes] = 0;
                            
                            x[16][año][mes] = x[16][año][mes] + 1
                            //$scope.campo = x[8][2014][11]
                        });
                    });
                    
                    $scope.filasComunas = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16];
                    
                    var meses = {
                        0: 'ENE',
                        1: 'FEB',
                        2: 'MAR',
                        3: 'ABR',
                        4: 'MAY',
                        5: 'JUN',
                        6: 'JUL',
                        7: 'AGO',
                        8: 'SEP',
                        9: 'OCT',
                        10: 'NOV',
                        11: 'DIC',
                    };
                    $scope.columnasMeses = [];
                    for(var año = 2014; año < 2016; año++) {
                        for(var mes = 0; mes < 12; mes++) {
                            $scope.columnasMeses.push({
                               anio: año,
                               mes: mes,
                               nombreMes: meses[mes],
                            });
                        }
                    }
                });
            });
        };
    });
}).controller('ReporteRelevamientosCtrl', function($scope,$window,Obra,Obras2,$http,ImportExcel,RelevanciaIniciativa,$location) {
    $scope.tab="reporteRelevamientos";
    var dia = new Date();
    $scope.mes = dia.getMonth() + 1;
    $scope.ano = dia.getFullYear();
    
    $scope.mesAno = moment(new Date()).format("MMYYYY");
    //$scope.mesAno = moment("10/04/2014","DD/MM/YYYY").format("MMYYYY")
    
    $scope.fecha = moment(new Date()).format("MMMM");
    $scope.diaHoy = moment(new Date()).format("DD/MM/YYYY");
    
    $scope.calcularMesAno = function(fecha){
        var fecha = moment(fecha,"DD/MM/YYYY").format("MMYYYY")
        return fecha;
    };
    
    $scope.obras = Obra.query({}, function(){
        var obras2 = Obras2.query({},function() {
            $scope.obras = $scope.obras.concat(obras2);
            
            $scope.contadorEstimados = 0;$scope.contadorRealizados = 0;$scope.contadorConcuerda = 0;$scope.contadorNoConcuerda = 0;$scope.retargetsInicios = 0;
            $scope.contadorEstimadosFinal = 0;$scope.contadorConcuerdaFinal = 0;$scope.contadorRealizadosFinal = 0;$scope.contadorNoConcuerdaFinal = 0;$scope.retargetsFinal = 0;
            $scope.totalEstimados = 0;$scope.totalRealizados = 0;$scope.totalConcuerda = 0;$scope.totalNoConcuerda = 0;$scope.totalRetargets = 0;
            for(var i=0; i < $scope.obras.length; i++){
                //INICIO
                if($scope.obras[i].inicios.length && $scope.obras[i].inicios.slice(-1)[0] && $scope.obras[i].inicios.slice(-1)[0].fecha && $scope.calcularMesAno($scope.obras[i].inicios.slice(-1)[0].fecha) == $scope.mesAno){
                    $scope.contadorEstimados = $scope.contadorEstimados + 1;
                }
                if($scope.obras[i].iniciosRel.length && $scope.obras[i].iniciosRel.slice(-1)[0] && $scope.obras[i].iniciosRel.slice(-1)[0].fechaOkIniRel && $scope.obras[i].iniciosRel.slice(-1)[0].relevamiento && $scope.calcularMesAno($scope.obras[i].iniciosRel.slice(-1)[0].fechaOkIniRel) == $scope.mesAno){
                    if(($scope.obras[i].iniciosRel.slice(-1)[0].relevamiento == "Relevado concuerda") || ($scope.obras[i].iniciosRel.slice(-1)[0].relevamiento == "Relevado no concuerda")){
                        $scope.contadorRealizados = $scope.contadorRealizados + 1;
                        $scope.retargetsInicios = $scope.retargetsInicios + $scope.obras[i].iniciosRel.length;
                    }
                    if($scope.obras[i].iniciosRel.slice(-1)[0].relevamiento == "Relevado concuerda"){
                        $scope.contadorConcuerda = $scope.contadorConcuerda + 1;
                    }
                    if($scope.obras[i].iniciosRel.slice(-1)[0].relevamiento == "Relevado no concuerda"){
                        $scope.contadorNoConcuerda = $scope.contadorNoConcuerda + 1;
                    }
                }
                //FINAL
                if($scope.obras[i].finalRel.length && $scope.obras[i].finalRel.slice(-1)[0] && $scope.obras[i].finalRel.slice(-1)[0].fechaOkIniRel && $scope.obras[i].finalRel.slice(-1)[0].relevamiento && ($scope.calcularMesAno($scope.obras[i].finalRel.slice(-1)[0].fechaOkIniRel) == $scope.mesAno)){
                    if($scope.obras[i].final.length && $scope.obras[i].final.slice(-1)[0] && $scope.obras[i].final.slice(-1)[0].fecha && $scope.calcularMesAno($scope.obras[i].final.slice(-1)[0].fecha) == $scope.mesAno){
                        $scope.contadorEstimadosFinal = $scope.contadorEstimadosFinal + 1;
                    }
                    if(($scope.obras[i].finalRel.slice(-1)[0].relevamiento == "Relevado concuerda") || ($scope.obras[i].finalRel.slice(-1)[0].relevamiento == "Relevado no concuerda")){
                        $scope.contadorRealizadosFinal = $scope.contadorRealizadosFinal + 1;
                        $scope.retargetsFinal = $scope.retargetsFinal + $scope.obras[i].finalRel.length;
                    }
                    if($scope.obras[i].finalRel.slice(-1)[0].relevamiento == "Relevado concuerda"){
                        $scope.contadorConcuerdaFinal = $scope.contadorConcuerdaFinal + 1;
                    }
                    if($scope.obras[i].finalRel.slice(-1)[0].relevamiento == "Relevado no concuerda"){
                        $scope.contadorNoConcuerdaFinal = $scope.contadorNoConcuerdaFinal + 1;
                    }
                }
                //TOTAL
                $scope.totalEstimados = $scope.contadorEstimados + $scope.contadorEstimadosFinal;
                $scope.totalRealizados = $scope.contadorRealizados + $scope.contadorRealizadosFinal;
                $scope.totalConcuerda = $scope.contadorConcuerda + $scope.contadorConcuerdaFinal;
                $scope.totalNoConcuerda = $scope.contadorNoConcuerda + $scope.contadorNoConcuerdaFinal;
                $scope.totalRetargets = $scope.retargetsInicios + $scope.retargetsFinal;
            }
        });
    });
    
    $scope.funcion = function(relevamiento){
        if(!relevamiento.fechaOkIniRel){
            return "Sin fecha";
        }else{
            return relevamiento.fechaOkIniRel;
        }
    };
    
    $scope.normalizarFecha = function(fecha){
        if(fecha){
            var fecha = moment(fecha,"YYYYMMDD").format("DD/MM/YYYY")
            return fecha;
        }else{
            return "Sin fecha";
        }
    };
    
    $scope.imprimir = function () {
        $window.print(); 
    };
    
    //IMPORTACION DE EXCEL
    $scope.guardarEnBd = function(){
        var lDif = $scope.listadoDiferencias;
        var ok = confirm("Esta seguro de aplicar los cambios?");
        
        if(ok){
            $scope.guardando = true;
            $("#modalGuardando").modal('show');
            for(var d=0;d<lDif.length;d++){
                for(var o=0;o<$scope.obras.length;o++){
                    if(lDif[d].id == $scope.obras[o]._id){
                        if(lDif[d].nombre){
                            $scope.obras[o].nombre = lDif[d].nombre;
                        }
                        if(lDif[d].prioridad){
                            $scope.obras[o].relevancia = prioridadPorNombre(lDif[d].prioridad);
                        }
                        //INICIO
                        if(lDif[d].fechaInicio){
                            $scope.obras[o].inicios.push({
                                fecha: lDif[d].fechaInicio || "",
                                comentario: lDif[d].comentarioInicio || "",
                                usuario: $scope.username
                            });
                        }
                        if(lDif[d].fechaFinal){
                            $scope.obras[o].final.push({
                                fecha: lDif[d].fechaFinal || "",
                                comentario: lDif[d].comentarioFinal || "",
                                usuario: $scope.username
                            });
                        }
                        /*if(lDif[d].monto){
                            $scope.obras[o].nombrar.push({
                                monto: lDif[d].monto,
                                usuario: $scope.username
                            });
                        }*/
                        $scope.obras[o].$save();
                    }
                }
            }
            
            var importExcelBd = new ImportExcel({
                fecha: new Date().getTime(),
                usuario: $scope.username,
                archivo: $scope.uploadedFile[0].id
            });
            importExcelBd.$save({},function(){
                $scope.guardando = false;
                $("#modalGuardando").modal('hide');
                $scope.uploadedFile=[];
                alert("Datos actualizados con exito");
                $location.url('/obras/admin');
            });
        }else{
            return;
        }
    };
    
    $scope.nombreObra = function(id){
        for(var i=0;i<$scope.obras.length;i++){
            if($scope.obras[i]._id == id){
                return "* " + $scope.obras[i].nombre;
            }
        }
    };
    
    $scope.uploadedFile=[];
    
    var prioridades = RelevanciaIniciativa.query();
    
    $scope.importExcelBd = ImportExcel.query();
    
    $scope.formatearFecha = function(fecha){
        return moment(fecha).format("L")
    };
    
    function prioridadPorId(id){
        if(id){
            for(var i=0;i<prioridades.length;i++){
                if(id == prioridades[i]._id){
                    return prioridades[i].nombre;
                }
            }
        }else{
            return "";
        }
    }
    
    function prioridadPorNombre(valor){
        if(valor){
            for(var i=0;i<prioridades.length;i++){
                if(valor == prioridades[i].nombre){
                    return prioridades[i]._id;
                }
            }
        }else{
            return "";
        }
    }
    
    $scope.$watch('uploadedFile.length', function(file) {
        if(file > 0){
            $scope.cargando = true;
            var objeto = [$scope.uploadedFile.slice(-1)[0]]
            $http.post('/api/obras/importExcel',objeto).success(function(data){
                var datosExcel = data;
                
                var obras = $scope.obras
                $scope.listadoDiferencias = [];
                
                for(var d=0;d<datosExcel.length;d++){
                    for(var o=0;o<obras.length;o++){
                        var objeto = {};
                        var nombreCortoExcel = datosExcel[d]['Nombre Corto'];
                        var fechaInicioExcel = datosExcel[d]['Fecha Inicio'];
                        var comentarioInicioExcel = datosExcel[d]['Comentario Inicio'];
                        var fechaFinalExcel = datosExcel[d]['Fecha Final'];
                        var comentarioFinalExcel = datosExcel[d]['Comentario Final'];
                        
                        if(datosExcel[d].ID == obras[o]._id){
                            //NOMBRE
                            obras[o].nombre = obras[o].nombre.replace(/\u200B/g,'');//Fix caracter vacio
                            if(nombreCortoExcel != obras[o].nombre){
                                objeto.nombre = nombreCortoExcel;
                                objeto.nombreBd = obras[o].nombre;
                            }
                            //PRIORIDAD
                            if(datosExcel[d].Prioridad != prioridadPorId(obras[o].relevancia)){
                                objeto.prioridad = datosExcel[d].Prioridad;
                                objeto.prioridadBd = prioridadPorId(obras[o].relevancia);
                            }
                            //INICIO
                            if(obras[o].inicios.length == 0){
                                obras[o].inicios.push({fecha:undefined})
                            }
                            if(fechaInicioExcel == ""){
                                fechaInicioExcel = undefined;
                            }
                            
                            if(fechaInicioExcel != obras[o].inicios.slice(-1)[0].fecha){
                                objeto.fechaInicio = fechaInicioExcel;
                                objeto.fechaInicioBd = obras[o].inicios.slice(-1)[0].fecha;
                                
                                if(obras[o].iniciosRel.length && obras[o].iniciosRel.slice(-1)[0].relevamiento && (obras[o].iniciosRel.slice(-1)[0].relevamiento == "Relevado concuerda")){
                                    objeto.inicioConcuerda = true;
                                }
                            }
                            
                            //COMENTARIO INICIO
                            var comInicioArreglado = "";
                            var reg = new RegExp(/\n/);
                            
                            var comentarioInicioBd = obras[o].inicios.slice(-1)[0].comentario;
                            if(comentarioInicioBd == undefined){
                                comentarioInicioBd = "";
                            }
                            var res = reg.test(comentarioInicioBd);
                            
                            if(res){
                                comInicioArreglado = comentarioInicioBd.replace(/\n/g, " ");
                            }else{
                                comInicioArreglado = comentarioInicioBd;
                            }
                            
                            if(comentarioInicioExcel == undefined){
                                comentarioInicioExcel = "";
                            }
                            
                            if(comentarioInicioExcel != comInicioArreglado){
                                objeto.comentarioInicio = comentarioInicioExcel;
                                objeto.comentarioInicioBd = obras[o].inicios.slice(-1)[0].comentario;
                            }
                            
                            //FINAL
                            if(obras[o].final.length == 0){
                                obras[o].final.push({fecha:undefined});
                            }
                            if(fechaFinalExcel == ""){
                                fechaFinalExcel = undefined;
                            }
                            if(fechaFinalExcel != obras[o].final.slice(-1)[0].fecha){
                                objeto.fechaFinal = fechaFinalExcel;
                                objeto.fechaFinalBd = obras[o].final.slice(-1)[0].fecha;
                                
                                if(obras[o].finalRel.length && obras[o].finalRel.slice(-1)[0].relevamiento && (obras[o].finalRel.slice(-1)[0].relevamiento == "Relevado concuerda")){
                                    objeto.finalConcuerda = true;
                                }
                            }
                            
                            //COMENTARIO FINAL
                            var comFinalArreglado = "";
                            var comentarioFinalBd = obras[o].final.slice(-1)[0].comentario;
                            
                            if(comentarioFinalBd == undefined){
                                comentarioFinalBd = "";
                            }
                            var res = reg.test(comentarioFinalBd);
                            
                            if(res){
                                comFinalArreglado = comentarioFinalBd.replace(/\n/g, " ");
                            }else{
                                comFinalArreglado = comentarioFinalBd;
                            }
                            
                            if(comentarioFinalExcel == undefined){
                                comentarioFinalExcel = "";
                            }
                            
                            if(comentarioFinalExcel != comFinalArreglado){
                                objeto.comentarioFinal = comentarioFinalExcel;
                                objeto.comentarioFinalBd = obras[o].final.slice(-1)[0].comentario;
                            }
                            
                            //MONTO
                            /*var montoObras = "";
                            if(obras[o].nombrar && obras[o].nombrar.slice(-1)[0] && obras[o].nombrar.slice(-1)[0].monto){
                                montoObras = obras[o].nombrar.slice(-1)[0].monto;
                            }
                            if(datosExcel[d].Monto != montoObras){
                                objeto.monto = datosExcel[d].Monto;
                                objeto.montoBd = obras[o].nombrar.slice(-1)[0].monto;
                            }*/
                            
                            //ARMADO DEL LISTADO DE DIFERENCIAS
                            if(Object.keys(objeto).length>0){
                                objeto.id = obras[o]._id;
                                $scope.listadoDiferencias.push(objeto);
                            }
                        }
                    }
                }
                $scope.cargando = false;
            }).error(function(data){
                console.error("Hubo un error en la importación: " + data);
            });
        }else{
            return;
        }
    });
    
    $scope.limpiar = function(){
        $scope.listadoDiferencias = undefined;
        
    };
    //FIN IMPORTACION EXCEL
}).controller('reporteObrasCtrl', function($scope,Obra,OrdenObra,ORMOrganigrama,Comuna,Obras2) {
    $scope.array = [];
    $scope.obras = Obra.query(function(){
        var obras2 = Obras2.query({},function() {
            $scope.obras = $scope.obras.concat(obras2);
            
            angular.forEach($scope.obras, function (o){
                o.iniciosRel.forEach(function(inicio){
                    var objeto = {
                        nombre: o.nombre,
                        tipo: "Inicio",
                        estado: inicio.relevamiento,
                        fecha: inicio.fechaOkIniRel,
                        fechaAgregado: $scope.normalizarFecha(inicio.fechaAgregado),
                        usuario: inicio.usuario
                    };
                    $scope.array.push(objeto);
                });
                o.fisico.forEach(function(fisico){
                    var objeto = {
                        nombre: o.nombre,
                        tipo: "Avance",
                        estado: fisico.relevamiento,
                        fecha: fisico.fechaOkIniRel,
                        fechaAgregado: $scope.normalizarFecha(fisico.fechaAgregado),
                        usuario: fisico.usuario
                    };
                    $scope.array.push(objeto);
                });
                o.finalRel.forEach(function(final){
                    var objeto2 = {
                        nombre: o.nombre,
                        tipo: "Final",
                        estado: final.relevamiento,
                        fecha: final.fechaOkIniRel,
                        fechaAgregado: $scope.normalizarFecha(final.fechaAgregado),
                        usuario: final.usuario
                    };
                    $scope.array.push(objeto2);
                });
            });
        });
    });
    
    $scope.$watch('filtro.orden1', function (orden1) {
        if(orden1){
            $scope.orden1 = orden1;
        }else{
            $scope.orden1 = undefined;
        }
        $scope.prefiltro($scope.orden1);
    });
    
    $scope.$watch('filtro2.dependencia', function (dependencia) {
        if(dependencia){
            $scope.dependencia = dependencia;
        }
        else{
            $scope.dependencia = undefined;
        }
        $scope.prefiltro($scope.dependencia);
    });
    
    $scope.prefiltro = function(){
        if($scope.orden1 || $scope.dependencia){
            if($scope.orden1 == "" || $scope.orden1 == undefined && $scope.dependencia){
                $scope.filtro(undefined,$scope.dependencia);
            }
            if($scope.orden1 && $scope.dependencia == "" || $scope.dependencia == undefined){
                $scope.filtro($scope.orden1,undefined);
            }
            if($scope.orden1 == "" || $scope.orden1 == undefined && $scope.dependencia == "" || undefined){
                $scope.filtro(undefined,undefined);
            }
            if($scope.orden1 && $scope.dependencia){
                $scope.filtro($scope.orden1,$scope.dependencia);
            }
        }
        // else{
        //     $scope.filtro(undefined,undefined);
        // }
    };
    
    $scope.ordenes = OrdenObra.query();
    
}).controller('reporteHitosProyectosCtrl', function($scope,Obra,OrdenObra,ORMOrganigrama,Comuna,Obras2) {
    //Select de jurisdicciones
    $scope.organigrama = ORMOrganigrama.list();
    $scope.jurisdiccionPorId = function(id) {
        for (var i = 0; i < $scope.organigrama.length; i++) {
            if ($scope.organigrama[i]._id == id) {
                return $scope.organigrama[i];
            }
        }
    };
    
    $scope.comunasTabla = Comuna.query(function () {
        $scope.comunasPorId = {};
        angular.forEach($scope.comunasTabla, function (c) {
            $scope.comunasPorId[c._id] = c.numero;
        });
        
        $scope.filtro = function(orden1,dependencia){
            $scope.obras = Obra.query({
                $and:JSON.stringify([
                    {"estado":"52e90195491f2d16f8bc1bc8"},
                    {"orden1":orden1},
                    {"dependencia":dependencia}
                ])
            }, function(){
                var obras2 = Obras2.query({
                    $and:JSON.stringify([
                        {"estado":"52e90195491f2d16f8bc1bc8"},
                        {"orden1":orden1},
                        {"dependencia":dependencia}
                    ])
                }, function(){
                    $scope.obras = $scope.obras.concat(obras2);
                    
                    var x = $scope.matriz = {};
                    angular.forEach($scope.obras, function (o) {
                        var final = (o.final || []).slice(-1)[0];
                        if (!final) return;
                        
                        var fechaFinal = moment(final.fecha, "DD/MM/YYYY"),
                            mes = fechaFinal.month(),
                            año = fechaFinal.year();
                        
                        angular.forEach(o.comuna || [], function (oc) {
                            var anos = x[$scope.comunasPorId[oc]];
                            
                            //Sumar las fechas que entran en cada mes
                            if (!anos) {
                                anos = x[$scope.comunasPorId[oc]] = {};
                            }
                            
                            if (!anos[año]) anos[año] = {};
                            
                            if (!anos[año][mes]) anos[año][mes] = 0;
                            
                            anos[año][mes] = anos[año][mes] + 1;
                            
                            //Sumar las columnas
                            if (!x[16]) {
                                x[16] = {};
                            }
                            
                            if (!x[16][año]) x[16][año] = {};
                            
                            if (!x[16][año][mes]) x[16][año][mes] = 0;
                            
                            x[16][año][mes] = x[16][año][mes] + 1
                            //$scope.campo = x[8][2014][11]
                        });
                    });
                    
                    $scope.filasComunas = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16];
                    
                    var meses = {
                        0: 'ENE',
                        1: 'FEB',
                        2: 'MAR',
                        3: 'ABR',
                        4: 'MAY',
                        5: 'JUN',
                        6: 'JUL',
                        7: 'AGO',
                        8: 'SEP',
                        9: 'OCT',
                        10: 'NOV',
                        11: 'DIC',
                    };
                    $scope.columnasMeses = [];
                    for(var año = 2014; año < 2016; año++) {
                        for(var mes = 0; mes < 12; mes++) {
                            $scope.columnasMeses.push({
                               anio: año,
                               mes: mes,
                               nombreMes: meses[mes],
                            });
                        }
                    }
                });
            });
        };
    });
    
    $scope.estado = function(obra){
        if(obra.estado && obra.estado == "52e90195491f2d16f8bc1bc8"){
            return true;
        }
    };
    
    $scope.cantCuentas = function(obra){
        var cuenta = 0;
        obra.proyectos.forEach(function(proyecto){
            if(proyecto && proyecto.cuenta && proyecto.cuenta == true){
                cuenta = cuenta + 1;
            }
        });
        return cuenta;
    };
    
    $scope.ultimaFecha = function(obra){
        if(obra.proyectos && obra.proyectos.slice(-1)[0] && obra.proyectos.slice(-1)[0].fecha){
            return obra.proyectos.slice(-1)[0].fecha;
        }
    };
}).controller('ReporteObrasPoaCtrl',function($scope,Obra,Obras2){
    $scope.obras = Obras2.query({relevancia:"",cargadaEnPOA:true},function(){
        for(var i=0;i<$scope.obras.length;i++){
            if($scope.obras[i].inicios && $scope.obras[i].inicios.slice(-1)[0]){
                $scope.obras[i].fInicio = $scope.obras[i].inicios.slice(-1)[0];
            }
            if($scope.obras[i].final && $scope.obras[i].final.slice(-1)[0]){
                $scope.obras[i].fFinal = $scope.obras[i].final.slice(-1)[0];
            }
        }
    });
}).controller('graficosCtrl',function($scope,Obra,Obras2,EstadoObra,ORMOrganigrama,ImpactoIniciativa){
    var estados = EstadoObra.query();
    $scope.organigrama = ORMOrganigrama.query();
    $scope.impactos = ImpactoIniciativa.query();
    
    $scope.$watch('filtroJurisdiccion', function(filtro){
        if(filtro.length){
            $scope.cargar();
        }else{
            $scope.filtroJurisdiccion = null;
            $scope.cargar();
        }
    });
    
    $scope.$watch('filtroImpacto', function(filtro){
        if(filtro.length){
            $scope.cargar();
        }else{
            $scope.filtroImpacto = null;
            $scope.cargar();
        }
    });
    
    $scope.cargar = function(){
        Obra.query({jurisdiccion:$scope.filtroJurisdiccion,impacto:$scope.filtroImpacto},function(o1){
            Obras2.query({jurisdiccion:$scope.filtroJurisdiccion,impacto:$scope.filtroImpacto},function(o2){
                var obras = o1.concat(o2);
                var contenedorEstados = {},contenedorAnios = {};obrasFebrero=0;
                
                for(var e=0;e<estados.length;e++){
                    if(estados[e].obra == true){
                        contenedorEstados[estados[e]._id] = {};
                        contenedorEstados[estados[e]._id].contador = 0;
                        contenedorEstados[estados[e]._id].nombre = estados[e].nombre
                    }
                }
                
                for(var e=0;e<obras.length;e++){
                    if(obras[e].anio){
                        contenedorAnios[obras[e].anio] = {};
                        contenedorAnios[obras[e].anio].contador = 0;
                    }
                }
                
                for(var i=0;i<obras.length;i++){
                    if(obras[i].anio && contenedorAnios[obras[i].anio]){
                        contenedorAnios[obras[i].anio].contador ++;
                    }
                    if(obras[i].estado && contenedorEstados[obras[i].estado]){
                        contenedorEstados[obras[i].estado].contador ++;
                    }
                }
                
                $scope.obrasPorAnio = [];
                for(var anio in contenedorAnios){
                    $scope.obrasPorAnio.push({
                        "label": anio,
                        "value": contenedorAnios[anio].contador
                    });
                }
                
                $scope.obrasPorEstado = [];
                for(var estado in contenedorEstados){
                    $scope.obrasPorEstado.push({
                        "label": contenedorEstados[estado].nombre,
                        "value": contenedorEstados[estado].contador
                    });
                }
                
                var bolsaAnios = {};
                
                for(var e=0;e<obras.length;e++){
                    if(obras[e].final && obras[e].final.slice(-1)[0] && obras[e].final.slice(-1)[0].fecha && obras[e].final.slice(-1)[0].fecha){
                        var fechaAnio = moment(obras[e].final.slice(-1)[0].fecha,"DD/MM/YYYY").format("YYYY");
                        bolsaAnios[fechaAnio] = {'01':0,'02':0,'03':0,'04':0,'05':0,'06':0,'07':0,'08':0,'09':0,'10':0,'11':0,'12':0};
                    }
                }
                
                for(var e=0;e<obras.length;e++){
                    if(obras[e].final && obras[e].final.slice(-1)[0] && obras[e].final.slice(-1)[0].fecha && obras[e].final.slice(-1)[0].fecha){
                        var fechaAnio = moment(obras[e].final.slice(-1)[0].fecha,"DD/MM/YYYY").format("YYYY");
                        var fechaMes = moment(obras[e].final.slice(-1)[0].fecha,"DD/MM/YYYY").format("MM");
                        bolsaAnios[fechaAnio][fechaMes] ++;
                    }
                }
                
                $scope.obrasPorAnioBarras = [];
                for(var anio in bolsaAnios){
                    $scope.obrasPorAnioBarras.push({
                        "label": anio,
                        "value": bolsaAnios[anio][fechaMes]
                    });
                }
                
                
                
                
                
                var obrasEnero=0,obrasFebrero=0,obrasMarzo=0,obrasAbril=0,obrasMayo=0,obrasJunio=0,obrasJulio=0,obrasAgosto=0,obrasSeptiembre=0,obrasOctubre=0,obrasNoviembre=0,obrasDiciembre=0;
                for(var i=0;i<obras.length;i++){
                    if(obras[i].final && obras[i].final.slice(-1)[0] && obras[i].final.slice(-1)[0].fecha){
                        if(moment(obras[i].final.slice(-1)[0].fecha,"DD/MM/YYYY").format("YYYYMM") == "201601"){
                            obrasEnero ++;
                        }
                        if(moment(obras[i].final.slice(-1)[0].fecha,"DD/MM/YYYY").format("YYYYMM") == "201602"){
                            obrasFebrero ++;
                        }
                        if(moment(obras[i].final.slice(-1)[0].fecha,"DD/MM/YYYY").format("YYYYMM") == "201603"){
                            obrasMarzo ++;
                        }
                        if(moment(obras[i].final.slice(-1)[0].fecha,"DD/MM/YYYY").format("YYYYMM") == "201604"){
                            obrasAbril ++;
                        }
                        if(moment(obras[i].final.slice(-1)[0].fecha,"DD/MM/YYYY").format("YYYYMM") == "201605"){
                            obrasMayo ++;
                        }
                        if(moment(obras[i].final.slice(-1)[0].fecha,"DD/MM/YYYY").format("YYYYMM") == "201606"){
                            obrasJunio ++;
                        }
                        if(moment(obras[i].final.slice(-1)[0].fecha,"DD/MM/YYYY").format("YYYYMM") == "201607"){
                            obrasJulio ++;
                        }
                        if(moment(obras[i].final.slice(-1)[0].fecha,"DD/MM/YYYY").format("YYYYMM") == "201608"){
                            obrasAgosto ++;
                        }
                        if(moment(obras[i].final.slice(-1)[0].fecha,"DD/MM/YYYY").format("YYYYMM") == "201609"){
                            obrasSeptiembre ++;
                        }
                        if(moment(obras[i].final.slice(-1)[0].fecha,"DD/MM/YYYY").format("YYYYMM") == "201610"){
                            obrasOctubre ++;
                        }
                        if(moment(obras[i].final.slice(-1)[0].fecha,"DD/MM/YYYY").format("YYYYMM") == "201611"){
                            obrasNoviembre ++;
                        }
                        if(moment(obras[i].final.slice(-1)[0].fecha,"DD/MM/YYYY").format("YYYYMM") == "201612"){
                            obrasDiciembre ++;
                        }
                    }
                }
                
                $scope.datosBarra = [{
                    values: [{label : "Ene", value : obrasEnero},
                            {label : "Feb", value : obrasFebrero},
                            {label : "Mar", value : obrasMarzo},
                            {label : "Abr", value : obrasAbril},
                            {label : "May", value : obrasMayo},
                            {label : "Jun", value : obrasJunio},
                            {label : "Jul", value : obrasJulio},
                            {label : "Ago", value : obrasAgosto},
                            {label : "Sep", value : obrasSeptiembre},
                            {label : "Oct", value : obrasOctubre},
                            {label : "Nov", value : obrasNoviembre},
                            {label : "Dic", value : obrasDiciembre}],
                    key: "",
                    nombre: ""
                }];
                
                $scope.options = {
                    chart: {
                        type: 'pieChart',
                        height: 350,
                        width: 300,
                        margin : {
                            top: 10, 
                            right: 0, 
                            bottom: 15, 
                            left: 40 
                        },
                        noData: 'Sin datos',
                        x: function(d){return d.label;},
                        y: function(d){return d.value;},
                        showLabels: true,
                        labelThreshold: 0.05,
                        labelType: "percent",
                        donut: true,
                        donutRatio: 0.35,
                        valueFormat: function(d){
                            return d;
                        }
                    }
                };
                
                $scope.optionsBarras = {
                    chart: {
                        type: 'discreteBarChart',
                        height: 350,
                        width: 400,
                        margin : {
                            top: 10, 
                            right: 0, 
                            bottom: 15, 
                            left: 40 
                        },
                        noData: 'Sin datos',
                        x: function(d){return d.label;},
                        y: function(d){return d.value;},
                        showValues: true,
                        valueFormat: function(d){
                            return d;
                        },
                        transitionDuration: 500,
                        xAxis: {
                        },
                        yAxis: {
                            tickFormat: function (v) {
                                return v;
                            },
                            max: 100,
                            axisLabelDistance: 30
                        }
                    }
                };
            });
        });
    }
});