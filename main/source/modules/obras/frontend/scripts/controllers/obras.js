angular.module('bag2.obras', ["base64", "ui.bootstrap.carousel"]).controller('ObrasCtrl', function(User,$window, $base64, $scope, ORMOrganigrama, Comuna, EstadoObra, $modal, $routeParams, Obra, $http, TipoObra, OrdenObra, RelevanciaIniciativa, Contactos,Obras2) {
    
    //Permisos comunero
    $scope.user2 = User.findByName({username: $scope.username});
    
    var obras = Obra.query($routeParams,function(){
        var obras2 = Obras2.query($routeParams,function(){
            $scope.listado = obras.concat(obras2);
            
            
            function includeByNombre(arr, obj) {
                for (var i = 0; i < arr.length; i++) {
                    //alert(arr[i].nombre, " - ", obj);
                    if (arr[i].nombre == obj) return true;
                }
            }
            
            for(var i=0;i<$scope.listado.length;i++){
                var l = $scope.listado[i];
                if(!l.final || l.final.length == 0 || l.final.slice(-1)[0] || !l.final.slice(-1)[0].fecha){
                    l.planAnio = 'cero';
                }
                if(l.final && l.final.slice(-1)[0] && l.final.slice(-1)[0].fecha && ((moment(l.final.slice(-1)[0].fecha,"DD/MM/YYYY").format("YYYYMMDD")) < (moment("01/01/2016","DD/MM/YYYY").format("YYYYMMDD")))){
                    l.planAnio = '2015';
                }
                if(l.final && l.final.slice(-1)[0] && l.final.slice(-1)[0].fecha && (moment(l.final.slice(-1)[0].fecha,"DD/MM/YYYY").format("YYYYMMDD") >= moment("01/01/2016","DD/MM/YYYY").format("YYYYMMDD"))){
                    l.planAnio = '2016';
                }
            }
            
            //Pantalla de impresion de fichas
            $scope.listado.forEach(function(p){
                if(p && p.detallesComunicacion && p.detallesComunicacion.slice(-1)[0] && p.detallesComunicacion.slice(-1)[0].detalle){
                    p.detalleComunicacion = p.detallesComunicacion.slice(-1)[0].detalle;
                }
                if(p && p.ubicacionesComunicacion && p.ubicacionesComunicacion.slice(-1)[0] && p.ubicacionesComunicacion.slice(-1)[0].detalle){
                    p.ubicacionPres = p.ubicacionesComunicacion.slice(-1)[0].detalle;
                }
                if(p && p.nombrar && p.nombrar.slice(-1)[0] && p.nombrar.slice(-1)[0].monto){
                    p.montoPres = p.nombrar.slice(-1)[0].monto;
                }
                if(p && p.inicios && p.inicios.slice(-1)[0] && p.inicios.slice(-1)[0].fecha){
                    p.inicioPres = p.inicios.slice(-1)[0].fecha;
                }
                if(p && p.final && p.final.slice(-1)[0] && p.final.slice(-1)[0].fecha){
                    p.finPres = p.final.slice(-1)[0].fecha;
                }
                
                if(p.fotos.length > 0){
                    p.foto1 = undefined;
                    p.foto2 = undefined;
                    p.foto3 = undefined;
                    p.foto4 = undefined;
                    p.foto12 = undefined;
                    p.foto13 = undefined;
                    p.foto24 = undefined;
                    p.foto34 = undefined;
                    p.foto1234 = undefined;
                    
                    p.fotos.forEach(function(foto){
                        if(foto.presentacion == true){
                            if(foto.foto1 == true && foto.foto2 == true && foto.foto3 == true && foto.foto4 == true){
                                p.foto1234 = foto.fotoId;
                            }
                            if(foto.foto1 == true && foto.foto2 == true && (foto.foto3 == false || foto.foto3 == undefined) && (foto.foto4 == false || foto.foto4 == undefined)){
                                p.foto12 = foto.fotoId;
                            }
                            if(foto.foto1 == true && foto.foto3 == true && (foto.foto2 == false || foto.foto2 == undefined) && (foto.foto4 == false || foto.foto4 == undefined)){
                                p.foto13 = foto.fotoId;
                            }
                            if(foto.foto2 == true && foto.foto4 == true && (foto.foto1 == false || foto.foto1 == undefined) && (foto.foto3 == false || foto.foto3 == undefined)){
                                p.foto24 = foto.fotoId;
                            }
                            if(foto.foto3 == true && foto.foto4 == true && (foto.foto1 == false || foto.foto1 == undefined) && (foto.foto2 == false || foto.foto2 == undefined)){
                                p.foto34 = foto.fotoId;
                            }
                            
                            if(foto.foto1 == true && (foto.foto2 == false || foto.foto2 == undefined) && (foto.foto3 == false || foto.foto3 == undefined) && (foto.foto4 == false || foto.foto4 == undefined)){
                                p.foto1 = foto.fotoId;
                            }
                            if(foto.foto2 == true && (foto.foto1 == false || foto.foto1 == undefined) && (foto.foto3 == false || foto.foto3 == undefined) && (foto.foto4 == false || foto.foto4 == undefined)){
                                p.foto2 = foto.fotoId;
                            }
                            if(foto.foto3 == true && (foto.foto1 == false || foto.foto1 == undefined) && (foto.foto2 == false || foto.foto2 == undefined) && (foto.foto4 == false || foto.foto4 == undefined)){
                                p.foto3 = foto.fotoId;
                            }
                            if(foto.foto4 == true && (foto.foto1 == false || foto.foto1 == undefined) && (foto.foto2 == false || foto.foto2 == undefined) && (foto.foto3 == false || foto.foto3 == undefined)){
                                p.foto4 = foto.fotoId;
                            }
                        }
                    });
                }
            });
            
            //FILTRO DE COMUNAS SEGUN PERMISO DE COMUNERO
            var user = User.findByName({username: $scope.username},function(){
                $scope.comunas = Comuna.query(function(){
                    if(!$scope.hasPermission('obras.comuneros')) {
                        angular.forEach($scope.comunas, function(c){
                            $scope.comunasFiltradas[c._id] = false;
                        });
                    }else{
                        var comunaUser = '';
                        angular.forEach($scope.comunas, function(c){
                            if(c.jurisdiccion == user.jurisdiccion){
                                switch(c.nombre){
                                    case 'Comuna 1': comunaUser = '50dcc0cd1dd1ce357600002a';
                                        break
                                    case 'Comuna 2': comunaUser = '50dcc0cd1dd1ce357600002b';
                                        break
                                    case 'Comuna 3': comunaUser = '50dcc0cd1dd1ce357600002c';
                                        break
                                    case 'Comuna 4': comunaUser = '50dcc0cd1dd1ce357600002d';
                                        break
                                    case 'Comuna 5': comunaUser = '50dcc0cd1dd1ce357600002e';
                                        break
                                    case 'Comuna 6': comunaUser = '50dcc0cd1dd1ce357600002f';
                                        break
                                    case 'Comuna 7': comunaUser = '50dcc0cd1dd1ce3576000030';
                                        break
                                    case 'Comuna 8': comunaUser = '50dcc0cd1dd1ce3576000031';
                                        break
                                    case 'Comuna 9': comunaUser = '50dcc0cd1dd1ce3576000032';
                                        break
                                    case 'Comuna 10': comunaUser = '50dcc0cd1dd1ce3576000033';
                                        break
                                    case 'Comuna 11': comunaUser = '50dcc0cd1dd1ce3576000034';
                                        break
                                    case 'Comuna 12': comunaUser = '50dcc0cd1dd1ce3576000035';
                                        break
                                    case 'Comuna 13': comunaUser = '50dcc0cd1dd1ce3576000036';
                                        break
                                    case 'Comuna 14': comunaUser = '50dcc0cd1dd1ce3576000037';
                                        break
                                    case 'Comuna 15': comunaUser = '50dcc0cd1dd1ce3576000038';
                                        break
                                    default:
                                        comunaUser = '';
                                }
                            }
                            if(c._id == comunaUser){
                                $scope.comunasFiltradas[c._id] = true;
                            }else{
                                $scope.comunasFiltradas[c._id] = false;
                            }
                        });
                    }
                });
            });
            function includeByNombre(arr, obj) {
                for (var i = 0; i < arr.length; i++) {
                    if (arr[i].nombre == obj) return true;
                }
            }
        });
    });
    
    $scope.filtroJurisdiccionComunero = function(organigrama){
        if(organigrama._id == $scope.user2.jurisdiccion || (organigrama._id == '52433a64295915d121000029')){
            return true;
        }else{
            return false;
        }
    };
    
    $scope.$on('descargar-mapa-obras', function () {
        var ids = [];
        angular.forEach($scope.filtrados, function (o) {
            ids.push(o._id);
        });
        
        $http.post('/api/descargar-mapa-obras', ids)
        .success(function(geojson) {
            $window.open("data:text/plain;base64," + $base64.encode(JSON.stringify(geojson, undefined, 2)), "_blank");
        });
    });
    
    $scope.descargarMapa = function(){
        $scope.$root.$broadcast('descargar-mapa-obras');
    };
    
    //@Alex: Llamada al backend. 
    $scope.actualizarMapaASI=function(){
        $http.post('/api/mapaASI').success(function() {
            alert("Funciono");
        });
    };
    
    $scope.printDiv = function(divName) {
        var printContents = document.getElementById(divName).innerHTML;
        var originalContents = document.body.innerHTML;        
        document.body.innerHTML = printContents;
        window.print();
        document.body.innerHTML = originalContents;
        document.close();
    };
    
    //Filtro de relevancia o orden2
    $scope.orden2 = "relevancia";
    $scope.tabFoto = "ppt";
    $scope.filtroPlanAnio = 2016;
    
    $scope.relevancias = RelevanciaIniciativa.query();
    $scope.prioridadPorId = function (id) {
        for (var i = 0; i < $scope.relevancias.length; i++) {
            if ($scope.relevancias[i]._id == id){
                return $scope.relevancias[i];
            }
        }
    };
    
    $scope.estadoPorId = function (id) {
        for (var i = 0; i < $scope.estados.length; i++) {
            if ($scope.estados[i]._id == id){
                return $scope.estados[i];
            }
        }
    };
    
    $scope.jurisdicciones = ORMOrganigrama.list();
    
    //Filtro de comunas------------------------------------------------------------------------------
    $scope.comunasFiltradas = {};
    $scope.comunas = Comuna.query(function() {
        angular.forEach ($scope.comunas, function (c) {
            $scope.comunasFiltradas[c._id] = false;
        });
    });
    
    $scope.filtrandoComuna = function (c) {
        // c puede ser '1', '2'... '15'
        if (c && !angular.isString(c)) {
            c = c._id;
        }
        return $scope.comunasFiltradas[c];
    };
    
    $scope.todasLasComunasEstanFiltradas = function () {
        for (var k in $scope.comunasFiltradas) {
            if (!$scope.comunasFiltradas[k]) {
                return false;
            }
        }
        return true;
    };
    
    $scope.toggleComunas = function () {
        var nuevoValor = !$scope.todasLasComunasEstanFiltradas();
        for (var k in $scope.comunasFiltradas) {
            $scope.comunasFiltradas[k] = nuevoValor;
        }
    };
    
    $scope.cambiarFiltroComuna = function (c) {
       // c puede ser '1', '2'... '15'
       $scope.comunasFiltradas[c._id] = !$scope.comunasFiltradas[c._id];
    };
    
    $scope.filtroComunas = function (obra) {
        if ($scope.todasLasComunasEstanFiltradas()) {
            return true;
        }
        if (angular.isArray(obra.comuna)) {
            for (var i = 0; i < obra.comuna.length; i++)
            {
                if ($scope.filtrandoComuna(obra.comuna[i])) {
                    return true;
                }
            }
        }
        return false;
    };
    
    //Filtro de prioridades-----------------------------------------------------------------
    $scope.prioridadesFiltradas = {};
    $scope.prioridades = RelevanciaIniciativa.query(function() {
        angular.forEach ($scope.prioridades, function (p) {
            $scope.prioridadesFiltradas[p._id] = false;
        });
    });
    
    $scope.filtrandoPrioridad = function (p) {
        if (p == 'SP') {
            return $scope.prioridadesFiltradas.SP;
        }
        return $scope.prioridadesFiltradas[p._id];
    };
    
    $scope.todasLasPrioridadesEstanFiltradas = function () {
        for (var k in $scope.prioridadesFiltradas) {
            if (!$scope.prioridadesFiltradas[k]) {
                return false;
            }
        }
        return true;
    };
    
    $scope.togglePrioridades = function () {
        var nuevoValor = !$scope.todasLasPrioridadesEstanFiltradas();
        for (var k in $scope.prioridadesFiltradas) {
            $scope.prioridadesFiltradas[k] = nuevoValor;
        }
    };
    
    $scope.cambiarFiltroPrioridad = function (p) {
        if (p == 'SP') {
            $scope.prioridadesFiltradas.SP = !$scope.prioridadesFiltradas.SP;
            return;
        }
       $scope.prioridadesFiltradas[p._id] = !$scope.prioridadesFiltradas[p._id];
    };
    
    $scope.filtroPrioridades = function (obra) {
        if ((obra.relevancia || '') === '' && $scope.prioridadesFiltradas.SP) return true;
        return $scope.prioridadesFiltradas[obra.relevancia];
    };
    
    //Orderby de segmento u orden1
    $scope.ordenes = OrdenObra.query();
    $scope.seg = function (obra){
        for (var i = 0; i < $scope.ordenes.length; i++) {
            if ($scope.ordenes[i]._id == obra.orden1){
                return $scope.ordenes[i].orden;
            }
        }
    };
    
    //Filtro de estado
    $scope.estados = EstadoObra.query({obra : true}, function() {
        $scope.estados.forEach(function(item) {
            item.total = 0;
        });
    });
    
    //Calcula elmonto total de las obras filtradas
    $scope.montoTotal = function(filtrados){
        if (!filtrados) return 0;
        
        $scope.totalMonto=0;
        filtrados.forEach(function(filtrado){
            if(filtrado.nombrar[filtrado.nombrar.length-1]){
                $scope.totalMonto = $scope.totalMonto + $scope.sacarPuntos(filtrado.nombrar[filtrado.nombrar.length-1].monto);
            }
        });
        return $scope.formatoMontoTotal($scope.numberFormat($scope.totalMonto));
    };
    
    //Eliminar puntos en campos de monto
    $scope.sacarPuntos = function(monto) {
        if(monto){
            monto = monto.replace(/-/g, "");
            
            if(monto == [""]){
                return 0;
            }
            monto = monto.split(".");
            
            var armando = "";
            if(monto.length){
                monto.forEach(function(m){
                    armando = armando.concat(m);
                });
                return parseInt(armando);
            }else{
                return 0;
            }
        }else{
            return 0;
        }
        /*if (monto) {
            var numero = monto.replace(/\D/g,'');
            return parseInt(numero);
        } else {
            return 0;
        }*/
    };
    
    //Calcular monto en tooltips
    $scope.formatoMontoTooltips = function(monto) {
        monto = monto.replace(/,/g, ".");
        monto = monto.replace(/-/g, "");
        var numero = monto.split('.');
        
        if(numero.length > 3){//Es millones
            var resultado = '.' + numero.substr(numero.length - 3) + resultado;
            numero = numero.substring(0, numero.length - 3);
        }
        if (numero.length >= 3) {
            numero = numero[0] + "." + numero[1].substr(0, 1)
            numero = numero + "MM";
        }
        if(numero.length <= 2){
            if (numero[0] < 100) {
                numero = "0.0" + numero[0] + "MM";
            } else {
                numero = "0." + numero[0] + "MM";
            }
        }
        resultado = numero;
        return resultado;
    };
    
    $scope.numberFormat = function(numero){ 
        numero = numero.toString();
        var resultado = "";
        
        var nuevoNumero = numero.replace(/\./g,'');
        
        if(numero.indexOf(",")>=0)
            nuevoNumero=nuevoNumero.substring(0,nuevoNumero.indexOf(","));
        for (var j, i = nuevoNumero.length - 1, j = 0; i >= 0; i--, j++) 
            resultado = nuevoNumero.charAt(i) + ((j > 0) && (j % 3 == 0)? ".": "") + resultado; 
        if(numero.indexOf(",")>=0)
            resultado+=numero.substring(numero.indexOf(","));
        return resultado;
    };
    
    //Calcular monto total
    $scope.formatoMontoTotal = function(monto) {
        var numero = monto.split('.');
        var resultado = numero[0];
        for (var i = 1; i < numero.length-2; i++) {
            resultado = resultado + "." + numero[i];
        }
        return resultado + "MM";
    };
    
    // $scope.duracion = function (inicioPar, finalPar) {//Calcula la duracion directamente desde los campo inicio y final
    //     if (inicioPar) {
    //         if (inicioPar.fecha) {
    //             var inicio = new Date(moment(inicioPar.fecha, "DD/MM/YYYY").toJSON());
    //             inicio = inicio.getTime();
    //             if (finalPar) {
    //                 if (finalPar.fecha) {
    //                     var fin = new Date(moment(finalPar.fecha, "DD/MM/YYYY").toJSON());
    //                     fin = fin.getTime();
    //                     var duracion = fin - inicio;
    //                     return Math.round(((((duracion/1000)/60)/60)/24)/30) + " M";
    //                 }
    //             }
    //         }
    //     }
    //     return "-";
    // };
    
    $scope.duracion = function(fDuracion){//Muestra los datos del array duracion
        if(fDuracion && fDuracion.slice(-1)[0] && fDuracion.slice(-1)[0].fecha){
            return fDuracion.slice(-1)[0].duracion;
        }else{
            return "";
        }
    };
    
    $('#myCarousel').carousel({});
    
    //Invertir array de imagenes
    $scope.reverse = function(array) {
        var copy = [].concat(array);
        return copy.reverse();
    };
    
    $scope.comunasTabla = Comuna.query();
    
    $scope.botonPresentacion = function(fotos){
        if(fotos && fotos.length){
            var encontrada = false
            fotos.forEach(function(f){
                if(f.presentacion && encontrada == false){
                    encontrada = true;
                }
            });
            return encontrada;
        }else{
            return false;
        }
    };
    
    $scope.mostrarPresentacion = function(id) {
        $scope.obraPresentacion = Obra.get({_id: id}, function(data){
            var buscarPresentacion = function(){
                if($scope.obraPresentacion && $scope.obraPresentacion.detallesComunicacion && $scope.obraPresentacion.detallesComunicacion.slice(-1)[0] && $scope.obraPresentacion.detallesComunicacion.slice(-1)[0].detalle){
                    $scope.detalleComunicacion = $scope.obraPresentacion.detallesComunicacion.slice(-1)[0].detalle;
                }
                if($scope.obraPresentacion && $scope.obraPresentacion.ubicacionesComunicacion && $scope.obraPresentacion.ubicacionesComunicacion.slice(-1)[0] && $scope.obraPresentacion.ubicacionesComunicacion.slice(-1)[0].detalle){
                    $scope.ubicacion = $scope.obraPresentacion.ubicacionesComunicacion.slice(-1)[0].detalle;
                }
                if($scope.obraPresentacion && $scope.obraPresentacion.nombrar && $scope.obraPresentacion.nombrar.slice(-1)[0] && $scope.obraPresentacion.nombrar.slice(-1)[0].monto){
                    $scope.monto = $scope.obraPresentacion.nombrar.slice(-1)[0].monto;
                }else{
                    $scope.monto = "";
                }
                if($scope.obraPresentacion && $scope.obraPresentacion.inicios && $scope.obraPresentacion.inicios.slice(-1)[0] && $scope.obraPresentacion.inicios.slice(-1)[0].fecha){
                    $scope.inicio = $scope.obraPresentacion.inicios.slice(-1)[0].fecha;
                }
                if($scope.obraPresentacion && $scope.obraPresentacion.final && $scope.obraPresentacion.final.slice(-1)[0] && $scope.obraPresentacion.final.slice(-1)[0].fecha){
                    $scope.fin = $scope.obraPresentacion.final.slice(-1)[0].fecha;
                }
                
                if($scope.obraPresentacion.fotos.length > 0){
                    $scope.foto1 = undefined;
                    $scope.foto2 = undefined;
                    $scope.foto3 = undefined;
                    $scope.foto4 = undefined;
                    $scope.foto12 = undefined;
                    $scope.foto13 = undefined;
                    $scope.foto24 = undefined;
                    $scope.foto34 = undefined;
                    $scope.foto1234 = undefined;
                    
                    $scope.obraPresentacion.fotos.forEach(function(foto){
                        if(foto.presentacion == true){
                            if(foto.foto1 == true && foto.foto2 == true && foto.foto3 == true && foto.foto4 == true){
                                $scope.foto1234 = foto.fotoId;
                            }
                            if(foto.foto1 == true && foto.foto2 == true && (foto.foto3 == false || foto.foto3 == undefined) && (foto.foto4 == false || foto.foto4 == undefined)){
                                $scope.foto12 = foto.fotoId;
                            }
                            if(foto.foto1 == true && foto.foto3 == true && (foto.foto2 == false || foto.foto2 == undefined) && (foto.foto4 == false || foto.foto4 == undefined)){
                                $scope.foto13 = foto.fotoId;
                            }
                            if(foto.foto2 == true && foto.foto4 == true && (foto.foto1 == false || foto.foto1 == undefined) && (foto.foto3 == false || foto.foto3 == undefined)){
                                $scope.foto24 = foto.fotoId;
                            }
                            if(foto.foto3 == true && foto.foto4 == true && (foto.foto1 == false || foto.foto1 == undefined) && (foto.foto2 == false || foto.foto2 == undefined)){
                                $scope.foto34 = foto.fotoId;
                            }
                            
                            if(foto.foto1 == true && (foto.foto2 == false || foto.foto2 == undefined) && (foto.foto3 == false || foto.foto3 == undefined) && (foto.foto4 == false || foto.foto4 == undefined)){
                                $scope.foto1 = foto.fotoId;
                            }
                            if(foto.foto2 == true && (foto.foto1 == false || foto.foto1 == undefined) && (foto.foto3 == false || foto.foto3 == undefined) && (foto.foto4 == false || foto.foto4 == undefined)){
                                $scope.foto2 = foto.fotoId;
                            }
                            if(foto.foto3 == true && (foto.foto1 == false || foto.foto1 == undefined) && (foto.foto2 == false || foto.foto2 == undefined) && (foto.foto4 == false || foto.foto4 == undefined)){
                                $scope.foto3 = foto.fotoId;
                            }
                            if(foto.foto4 == true && (foto.foto1 == false || foto.foto1 == undefined) && (foto.foto2 == false || foto.foto2 == undefined) && (foto.foto3 == false || foto.foto3 == undefined)){
                                $scope.foto4 = foto.fotoId;
                            }
                        }
                    });
                }
                $modal({template: '/views/obras/modals/verFoto.html', persist: true, show: true, backdrop: 'static', scope: $scope.$new()});
            };
            
            if(!data.nombre){
                $scope.obraPresentacion = Obras2.get({'_id': id}, function(){
                    buscarPresentacion();
                });
            }else{
                buscarPresentacion();
            }
        });
    };
    
    //var fechaPlan = moment("01/01/2016","DD/MM/YYYY")
    $scope.togglePlan = '';
    $scope.togglePlan2 = '';
    $scope.togglePlan3 = '2016';
    
    $scope.funcToggle = function(tipo){
        switch(tipo){
            case "uno":
                if($scope.togglePlan == 'cero'){
                    $scope.togglePlan = '';
                }else{
                    $scope.togglePlan = 'cero';
                }
                break;
            case "dos":
                if($scope.togglePlan2 == '2015'){
                    $scope.togglePlan2 = '';
                }else{
                    $scope.togglePlan2 = '2015';
                }
                break;
            case "tres":
                if($scope.togglePlan3 == '2016'){
                    $scope.togglePlan3 = '';
                }else{
                    $scope.togglePlan3 = '2016';
                }
                break
        }
    };
    
    $scope.funcionPlan = function(obra){
        if(obra.planAnio == $scope.togglePlan || obra.planAnio == $scope.togglePlan2 || obra.planAnio == $scope.togglePlan3){
            return true;
        }else{
            return false;
        }
    };
    
    $scope.imprimir = function() {
        $window.print();
    };
    
    $scope.diaHoy = moment(new Date());
    
    $scope.colores = function(inicio,final,iniciosRel,finalRel,tipo){
        if(tipo == 'Inicio'){
            if(inicio && inicio.fecha){
                if(
                    inicio.cumplido || (iniciosRel && iniciosRel.relevamiento && iniciosRel.relevamiento == "Relevado concuerda")
                ){//En azul si esta marcado como cumplido
                    return "btn-info active";
                }
                if(inicio.cancelado){//En negro si esta marcado como cancelado
                    return "btn btn-inverse";
                }
                if($scope.diaHoy <= moment(inicio.fecha, "DD/MM/YYYY")){//En verde si no esta vencido.
                    return "btn-success active";
                }
                if(final && final.fecha && final.cumplido){
                    if(!inicio || !inicio.fecha || ($scope.diaHoy > moment(inicio.fecha, "DD/MM/YYYY"))){
                        return "btn-gris active";
                    }
                }else{
                    if($scope.diaHoy > moment(inicio.fecha, "DD/MM/YYYY")){//En rojo si hoy esta vencido
                        return "btn-danger active";
                    }
                }
            }else{
                if(final && final.fecha && final.cumplido){
                    if(!inicio || !inicio.fecha || ($scope.diaHoy > moment(inicio.fecha, "DD/MM/YYYY"))){
                        return "btn-gris active";
                    }
                }else{
                    if(!inicio || !inicio.fecha || !inicio.fecha.length){
                        return "btn";
                    }
                    if(inicio && ($scope.diaHoy > moment(inicio.fecha, "DD/MM/YYYY"))){//En rojo si hoy esta vencido
                        return "btn-danger active";
                    }
                }
            }
        }
        
        if(tipo == 'Final'){
            if(final && final.fecha){
                if(final.cumplido || (finalRel && finalRel.relevamiento && finalRel.relevamiento == "Relevado concuerda")){//En azul si esta marcado como cumplido
                    return "btn-info active";
                }
                if(final.cancelado){//En negro si esta marcado como cancelado
                    return "btn btn-inverse";
                }else{
                    if($scope.diaHoy <= moment(final.fecha, "DD/MM/YYYY")){//En verde si no esta vencido.
                        return "btn-success active";
                    }
                    if($scope.diaHoy > moment(final.fecha, "DD/MM/YYYY")){//En rojo si hoy esta vencido
                        return "btn-danger active";
                    }
                }
            }else{
                return "btn";
            }
        }
    };
    
    $scope.coloresProyCont = function(proyecto,contrato,inicio,final,tipo){
        if(tipo=='proyecto'){
            if(proyecto && proyecto.slice(-1)[0] && proyecto.slice(-1)[0].fecha && ($scope.diaHoy <= moment(proyecto.slice(-1)[0].fecha, "DD/MM/YYYY"))){
                return "btn-success active";
            }
            if(proyecto && proyecto.slice(-1)[0] && proyecto.slice(-1)[0].cumplido){
                return "btn-info active";
            }
            if(proyecto && proyecto.slice(-1)[0] && proyecto.slice(-1)[0].cancelado){
                return "btn btn-inverse";
            }
            if(
                (contrato.length && contrato.slice(-1)[0] && contrato.slice(-1)[0].cumplido) ||
                (inicio.length && inicio.slice(-1)[0] && inicio.slice(-1)[0].cumplido) ||
                (final.length && final.slice(-1)[0] && final.slice(-1)[0].cumplido)
            ){
                if(!proyecto.length || !proyecto.slice(-1)[0].fecha || ($scope.diaHoy > moment(proyecto.slice(-1)[0].fecha, "DD/MM/YYYY"))){
                    return "btn-gris active";
                }
            }else{
                if(proyecto && proyecto.slice(-1)[0] && proyecto.slice(-1)[0].fecha && ($scope.diaHoy > moment(proyecto.slice(-1)[0].fecha, "DD/MM/YYYY"))){
                    return "btn-danger active";
                }
            }
        }
        
        if(tipo=='contrato'){
            if(contrato && contrato.slice(-1)[0] && contrato.slice(-1)[0].fecha && ($scope.diaHoy <= moment(contrato.slice(-1)[0].fecha, "DD/MM/YYYY"))){
                return "btn-success active";
            }
            if(contrato && contrato.slice(-1)[0] && contrato.slice(-1)[0].cumplido){
                return "btn-info active";
            }
            if(contrato && contrato.slice(-1)[0] && contrato.slice(-1)[0].cancelado){
                return "btn btn-inverse";
            }
            if(
                (inicio.length && inicio.slice(-1)[0] && inicio.slice(-1)[0].cumplido) ||
                (final.length && final.slice(-1)[0] && final.slice(-1)[0].cumplido)
            ){
                if(!contrato.length || !contrato.slice(-1)[0].fecha || ($scope.diaHoy > moment(contrato.slice(-1)[0].fecha, "DD/MM/YYYY"))){
                    return "btn-gris active";
                }
            }else{
                if(contrato && contrato.slice(-1)[0] && contrato.slice(-1)[0].fecha && ($scope.diaHoy > moment(contrato.slice(-1)[0].fecha, "DD/MM/YYYY"))){
                    return "btn-danger active";
                }
            }
        }
    };
    
    $scope.enviarMail = function (i) {
        if (i.referente) {
            Contactos.buscarPorId(i.referente, function (c) {
                if (c && c.correos) {
                    for (var j = 0; j < c.correos.length; j++) {
                        if (c.correos[j].nombre == 'Email oficial') {
                            // email oficial
                            return $window.open('mailto:' +  c.correos[j].valor + '?Subject=Obras - Comunicación', '_self');
                        }
                        // email oficial no encontrado
                        return $window.open('mailto:?Subject=Obras - Comunicación', '_self');
                    }
                }
                // contacto no encontrado, o no se encontró su email oficial
                return $window.open('mailto:?Subject=Obras - Comunicación', '_self');
            });
        } else {
            // no hay responsable definido
            $window.open('mailto:?Subject=Obras - Comunicación', '_self');
        }
    };
    
    $scope.coloresObjetivo = function(objetivo,final,inicios){
        if(objetivo[0]){//Hay objetivo
            if(final && final[final.length-1] && final[final.length-1].cumplido){
                if(moment(final[final.length-1].fecha, "DD/MM/YYYY") <= moment(objetivo[objetivo.length-1].fecha, "DD/MM/YYYY")){
                    return "btn-info active";
                }
                if(moment(final[final.length-1].fecha, "DD/MM/YYYY") >= moment(objetivo[objetivo.length-1].fecha, "DD/MM/YYYY")){
                    return "btn-gris active";
                }
            }
            if(!final && !final[final.length-1] && !final[final.length-1].cumplido){
                return "btn btn-danger";
            }
            
            if(($scope.diaHoy > moment(objetivo[objetivo.length-1].fecha, "DD/MM/YYYY")) ||//Objetivo vencido
                (!final[0]) || //Sin final
                (moment(final[final.length-1].fecha, "DD/MM/YYYY") > moment(objetivo[objetivo.length-1].fecha, "DD/MM/YYYY"))){//Final > objetivo
                    return "btn btn-danger";
            }
            
            if(objetivo[objetivo.length-1].cumplido){
                return "btn-info active";
            }
            
            if(
                (!inicios[0]) &&//Sin inicios
                (moment(final[final.length-1].fecha, "DD/MM/YYYY") > $scope.diaHoy)
            ){
                return "btn btn-warning";
            }
            if($scope.diaHoy <= moment(objetivo[objetivo.length-1].fecha, "DD/MM/YYYY")){
                return "btn btn-success";
            }
        }else{//No hay objetivo
            return "btn btn-danger";
        }
    };
    
    //Cambio el lenguaje global de las fechas a español
    moment.lang('es');
    
    $scope.calcularmes = function(i){
        if(i && i.fecha){
            var mm = moment(i.fecha, "YYYY/MM/DD").format('MMM');
            if(typeof(mm) !== "undefined"){
                return moment(i.fecha, "YYYY/MM/DD").format('MMM');
            }else{
                return "-";
            }
        }else{
            return " - "
        }
    };
    
    $scope.iconos = function(p,c){
        if(p && c){
            if(p.fecha && c.fecha){
                if(moment(p.fecha, "DD/MM/YYYY").format('YYYYMMDD') > moment(c.fecha, "DD/MM/YYYY").format('YYYYMMDD')){
                    return "icon-warning-sign";
                }
            }
            
        }
    };
    
    //Muestra los iconos de los botones segun el relevamiento de la obra
    $scope.relevamientos = function(i){
        if(i){
            if(i.relevamiento === "Relevado concuerda"){
                return "icon-ok";
            }
            if(i.relevamiento === "Relevado no concuerda"){
                return "icon-remove";
            }
            if(i.relevamiento === "No relevado"){
                return "icon-minus";
            }
            if(i.relevamiento === "Nunca se va a relevar"){
                return "";
            }
        }
    };
    
    //Cuento el total de proyectos con el campo cuenta en true
    $scope.contados = function(listaProyectos){
        var cantidad=0;
        for (var j = 0; j < listaProyectos.length; j++) {
            if(listaProyectos[j] && listaProyectos[j].cuenta){
                cantidad++;
            }
        }
        if (cantidad===0){
            return "";
        }
        return cantidad;
    };
    
    $scope.avanceFisico = function(i){
        if(i && i.avance){
            return i.avance + " %"
        }else{
            return "0 %"
        }
    };
    
    $scope.avanceFinanciero = function(i){
        try{
            return i.avance + "%";
        }catch (i) {
            return "0";
        }
    };
    
    $scope.contactos = Contactos.listar();
    
    $scope.formatoFecha = function(fecha){
        if(fecha){
            fecha = moment(fecha, "DD/MM/YYYY").format("MMM YY");
        }else{
            fecha = "";
        }
        return fecha;
    };
    
    $scope.toolNombre = function(i){
        var tooltip = "";
        if(i.jurisdiccion && $scope.jurisdiccionPorId(i.jurisdiccion) && $scope.jurisdiccionPorId(i.jurisdiccion).nombreCompleto){
            tooltip = "Jurisdicción: " + $scope.jurisdiccionPorId(i.jurisdiccion).nombreCompleto;
        }
        if(i.dependencia && $scope.jurisdiccionPorId(i.dependencia) && $scope.jurisdiccionPorId(i.dependencia).nombreCompleto){
            tooltip = tooltip + " - Dependencia: " + $scope.jurisdiccionPorId(i.dependencia).nombreCompleto;
        }
        if(i.referente && $scope.contactoPorId(i.referente)){
            tooltip = tooltip + "\n" + "Referente: " + $scope.contactoPorId(i.referente).apellidos + " " + $scope.contactoPorId(i.referente).nombre;
        }
        if(i.nombrar && i.nombrar.length && i.nombrar[i.nombrar.length-1].monto){
            tooltip = tooltip + "\n" + "Monto: " + $scope.formatoMontoTooltips(i.nombrar[i.nombrar.length-1].monto);
        }
        return tooltip;
    };
    
    //Calcula el tooltip del boton final----------------------------------VERSION VIEJA
    $scope.toolFinal = function(arreglo, arregloRel){
        var tooltip = "";
        if(arreglo[0]){
            if(arreglo[arreglo.length-1].fecha){
                tooltip = tooltip + moment(arreglo[arreglo.length-1].fecha, "DD/MM/YYYY").format("DD MMM YY");
            }else{
                tooltip = tooltip + "Sin fecha";
            }
            if(arreglo.length > 1){
                tooltip = tooltip + "-" + "(" + moment(arreglo[arreglo.length-2].fecha, "DD/MM/YYYY").format("DD MMM YY") + ")";
            }
            if(arreglo[arreglo.length-1].comentario){
                tooltip = tooltip + "\n" + arreglo[arreglo.length-1].comentario;
            }
        }
        if((arregloRel[0])){
            if(arregloRel[arregloRel.length-1].relevamiento){
                tooltip = tooltip + "\n--------------------\n" + arregloRel[arregloRel.length-1].relevamiento;
            }
            if(arregloRel[arregloRel.length-1].fechaOkIniRel){
                tooltip = tooltip + "\n" + moment(arregloRel[arregloRel.length-1].fechaOkIniRel, "DD/MM/YYYY").format("DD MMM YY");
            }
            if(arregloRel[arregloRel.length-1].observacionesRelevamiento){
                tooltip = tooltip + "\n" + arregloRel[arregloRel.length-1].observacionesRelevamiento;
            }else{
                return tooltip;
            }
        }
        return tooltip;
    };
    
    //Calcula el tooltip de Proyecto y contrato
    $scope.tool = function(arreglo, arregloRel){
        var tooltip = "";
        if(arreglo[0]){
            if(arreglo[arreglo.length-1].fecha){
                tooltip = tooltip + moment(arreglo[arreglo.length-1].fecha, "DD/MM/YYYY").format("DD MMM YY");
            }else{
                tooltip = tooltip + "Sin fecha";
            }
            if(arreglo.length > 1){
                tooltip = tooltip + "-" + "(" + moment(arreglo[arreglo.length-2].fecha, "DD/MM/YYYY").format("DD MMM YY") + ")";
            }
            if(arreglo[arreglo.length-1].comentario){
                tooltip = tooltip + "\n" + arreglo[arreglo.length-1].comentario;
            }
        }
        if(arregloRel){
            if(arregloRel[0]){
                if(arregloRel[arregloRel.length-1].relevamiento){
                    tooltip = tooltip + "\n--------------------\n" + arregloRel[arregloRel.length-1].relevamiento;
                }
                if(arregloRel[arregloRel.length-1].fechaOkIniRel){
                    tooltip = tooltip + "\n" + moment(arregloRel[arregloRel.length-1].fechaOkIniRel, "DD/MM/YYYY").format("DD MMM YY");
                }
                if(arregloRel[arregloRel.length-1].observacionesRelevamiento){
                    tooltip = tooltip + "\n" + arregloRel[arregloRel.length-1].observacionesRelevamiento;
                }
            }else{
                return tooltip;
            }
        }
        return tooltip;
    };
    
    $scope.toolInicio = function(arreglo, arregloRel){
        var tooltip = "";
        if(arreglo[0]){
            if(arreglo[arreglo.length-1].fecha){
                tooltip = tooltip + moment(arreglo[arreglo.length-1].fecha, "DD/MM/YYYY").format("DD MMM YY");
            }else{
                tooltip = tooltip + "Sin fecha";
            }
            if(arreglo.length > 1){
                tooltip = tooltip + "-" + "(" + moment(arreglo[arreglo.length-2].fecha, "DD/MM/YYYY").format("DD MMM YY") + ")";
            }
            if(arreglo[arreglo.length-1].comentario){
                tooltip = tooltip + "\n" + arreglo[arreglo.length-1].comentario;
            }
        }
        if((arregloRel[0])){
            if(arregloRel[arregloRel.length-1].relevamiento){
                tooltip = tooltip + "\n--------------------\n" + arregloRel[arregloRel.length-1].relevamiento;
            }
            if(arregloRel[arregloRel.length-1].fechaOkIniRel){
                tooltip = tooltip + "\n" + moment(arregloRel[arregloRel.length-1].fechaOkIniRel, "DD/MM/YYYY").format("DD MMM YY");
            }
            if(arregloRel[arregloRel.length-1].observacionesRelevamiento){
                tooltip = tooltip + "\n" + arregloRel[arregloRel.length-1].observacionesRelevamiento;
            }else{
                return tooltip;
            }
        }
        return tooltip;
    };
    
    $scope.toolDuracion = function(arreglo){
        if(arreglo[0]){
            var tooltip = "Duración: " + arreglo[arreglo.length -1].duracion + " ("  + moment(arreglo[arreglo.length-1].fecha, "DD/MM/YYYY").format("DD MMM YY") + ")"+ "\n";
            if (arreglo.length > 1) {
                tooltip = tooltip + "Duración: " + arreglo[arreglo.length -2].duracion + " ("  + moment(arreglo[arreglo.length-2].fecha, "DD/MM/YYYY").format("DD MMM YY") + ")"+ "\n";
            }
            return tooltip;
        }
    };
    
    $scope.toolFisicoFinan = function(i){
        if(i){
            return "Fecha último relevamiento: " + moment(i.fechaOkIniRel, "DD/MM/YYYY").format("DD MMM YY") + "\n" + 
            "Relevamiento: " + i.relevamiento + "\n" + 
            "Avance: " + i.avance + "%" + "\n" + 
            i.observacionesRelevamiento;
        }
        return ""
    };
    
    $scope.tipos = TipoObra.query();
    
    $scope.ordenNombre = function(fecha){
        if($scope.reverse){
            $scope.reverse="true";
            return 'nombre';
        }else{
            $scope.reverse="false";
            return '-nombre';
        }
    };
    
    $scope.ordenRelevancia = function(fecha){
        if(!$scope.reverse){
            $scope.reverse="true"; 
            return 'relevancia';
        }else{
            $scope.reverse="false";
            return '-relevancia';
        }
    };
    
    $scope.ordenFechaProyecto = function(i) {
        if (i && i.proyectos && i.proyectos.length) {
            var d = moment(i.proyectos.slice(-1)[0].fecha, "DD/MM/YYYY").valueOf();
            if (!$scope.reverse) return d; else return -1 * d;
        }
        return 0;
    };
    
    $scope.ordenFechaContrato = function(i) {
        if (i && i.contratos && i.contratos.length) {
            var d = moment(i.contratos.slice(-1)[0].fecha, "DD/MM/YYYY").valueOf();
            if (!$scope.reverse) return d; else return -1 * d;
        }
        return 0;
    };
    
    $scope.ordenFechaInicio = function(i) {
        if (i && i.inicios && i.inicios.length) {
            var d = moment(i.inicios.slice(-1)[0].fecha, "DD/MM/YYYY").valueOf();
            if (!$scope.reverse) return d; else return -1 * d;
        }
        return 0;
    };
    
    $scope.ordenFechaDuracion = function(i) {
        if (i && i.duracion && i.duracion.length) {
            var d = i.duracion.slice(-1)[0].duracion.substring(0, 2);
            if (!$scope.reverse) return Number(d); else return -1 * Number(d);
        }
        return 0;
    };
    
    $scope.ordenFechaFinal = function(i) {
        if (i && i.final && i.final.length) {
            var d = moment(i.final.slice(-1)[0].fecha, "DD/MM/YYYY").valueOf();
            if (!$scope.reverse) return d; else return -1 * d;
        }
        return 0;
    };
    
    $scope.ordenPorcentajeFisico = function(i) {
        if (i && i.fisico && i.fisico.length) {
            var d = i.fisico.slice(-1)[0].avance;
            if (!$scope.reverse) return Number(d); else return -1 * Number(d);
        }
        return 0;
    };
    
    $scope.ordenFechaObjetivo = function(i) {
        if (i && i.objetivo && i.objetivo.length) {
            var d = moment(i.objetivo.slice(-1)[0].fecha, "DD/MM/YYYY").valueOf();
            if (!$scope.reverse) return d; else return -1 * d;
        }
        return 0;
    };
    
    $scope.calcularEstado = function(obra){
        if($scope.filtroAIniciar(obra)){
            return "A Iniciar";
        }
        if($scope.filtroNoIniciada(obra)){
            return "No Iniciada"
        }
        if($scope.filtroEnEjecucion(obra)){
            return "En Ejecución"
        }
        if($scope.filtroPosibilidadAtraso(obra)){
            return "Pos. de Atraso"
        }
        if($scope.filtroAtrasadas(obra)){
            return "Atrasada"
        }
        if($scope.filtroFinATiempo(obra)){
            return "Fin a Tiempo"
        }
        if($scope.filtroFinFueraPlazo(obra)){
            return "Fuera de Plazo"
        }
    };
    
    $scope.filtroAIniciar = function(i){
        if(
            (i.inicios && i.inicios.length && i.inicios.slice(-1)[0]) && ((!i.inicios.slice(-1)[0].cumplido) || (i.inicios.slice(-1)[0].cumplido == false)) &&
            ($scope.diaHoy <= moment(i.inicios.slice(-1)[0].fecha,"DD/MM/YYYY"))
        ){
            return true;
        }else{
            return false;
        }
    };
    
    $scope.filtroNoIniciada = function(i){
        if(
            (!i.inicios || !i.inicios.length) || (i.inicios && i.inicios.length && i.inicios.slice(-1)[0]) && ((!i.inicios.slice(-1)[0].cumplido) || (i.inicios.slice(-1)[0].cumplido == false)) &&
            ($scope.diaHoy > moment(i.inicios.slice(-1)[0].fecha,"DD/MM/YYYY"))
        ){
            return true;
        }else{
            return false;
        }
    };
    
    $scope.filtroEnEjecucion = function(i){
        if(
            (i.inicios && i.inicios.length && i.inicios.slice(-1)[0] && i.inicios.slice(-1)[0].cumplido && i.inicios.slice(-1)[0].cumplido == true) &&
            (i.final && i.final.length && i.final.slice(-1)[0] && (!i.final.slice(-1)[0].cumplido || i.final.slice(-1)[0].cumplido == false)) &&//Agregado despues
            ($scope.diaHoy <= moment(i.final.slice(-1)[0].fecha,"DD/MM/YYYY")) &&
            ((!i.fisico || !i.fisico.length) || ((i && i.fisico && i.fisico.length) && (!i.fisico.slice(-1)[0].posibleAtraso)) || ((i && i.fisico && i.fisico.length) && (i.fisico.slice(-1)[0].posibleAtraso == false)))
        ){
            return true;
        }else{
            return false;
        }
    };
    
    $scope.filtroPosibilidadAtraso = function(i){
        if(
            (i && i.inicios && i.inicios.length && i.inicios.slice(-1)[0].cumplido == true) &&
            (i && i.final && i.final.length && i.final.slice(-1)[0].fecha && ($scope.diaHoy <= moment(i.final.slice(-1)[0].fecha,"DD/MM/YYYY"))) &&
            (i && i.fisico && i.fisico.length && i.fisico.slice(-1)[0].posibleAtraso == true)
        ){
            return true;
        }else{
            return false;
        }
    };
    
    $scope.filtroAtrasadas = function(i){
        if(
            (i.inicios && i.inicios.length && i.inicios.slice(-1)[0] && i.inicios.slice(-1)[0].cumplido) && (i.inicios.slice(-1)[0].cumplido == true) &&
            (i.final && i.final.length && i.final.slice(-1)[0]) && ((!i.final.slice(-1)[0].cumplido) || (i.final.slice(-1)[0].cumplido == false)) &&
            ($scope.diaHoy > moment(i.final.slice(-1)[0].fecha,"DD/MM/YYYY"))
        ){
            return true;
        }else{
            return false;
        }
    };
    
    $scope.filtroFinATiempo = function(i){
        if(
            (i.inicios && i.inicios.length && i.inicios.slice(-1)[0] && i.inicios.slice(-1)[0].cumplido && i.inicios.slice(-1)[0].cumplido == true) &&
            (i.final && i.final.length && i.final.slice(-1)[0] && i.final.slice(-1)[0].cumplido && i.final.slice(-1)[0].cumplido == true) &&
            (i.objetivo && i.objetivo.slice(-1)[0] && i.objetivo.slice(-1)[0].fecha) &&
            (moment(i.final.slice(-1)[0].fecha,"DD/MM/YYYY") <= moment(i.objetivo.slice(-1)[0].fecha,"DD/MM/YYYY"))
        ){
            return true;
        }else{
            return false;
        }
    };
    
    $scope.filtroFinFueraPlazo = function(i){
        if(
            (i.final && i.final.length && i.final.slice(-1)[0] && i.final.slice(-1)[0].cumplido) && (i.final.slice(-1)[0].cumplido == true) &&
            (i.objetivo && i.objetivo.slice(-1)[0] && i.objetivo.slice(-1)[0].fecha) &&
            (moment(i.final.slice(-1)[0].fecha,"DD/MM/YYYY") > moment(i.objetivo.slice(-1)[0].fecha,"DD/MM/YYYY"))
        ){
            return true;
        }else{
            return false;
        }
    };
    
}).controller('pdfCtrl', function($scope, $modal, PresentacionesPdf, Contactos) {
    $scope.archivoPdf = new PresentacionesPdf();
    $scope.presentaciones = PresentacionesPdf.query();
    
    $scope.uploadedFile = [];
    
    $scope.abrirModal = function(idmodal) {
        $(idmodal).modal('show');
    };
    
    $scope.agregarPdf = function(confirmado,dataObra, PresentacionesPdf) {
        if(confirmado){
            var f = new Date();
            var minutes = f.getMinutes();
            minutes = minutes > 9 ? minutes : '0' + minutes;
            $scope.archivoPdf.horaAgregado = (f.getHours() + ":" + minutes);
            $scope.archivoPdf.fechaAgregado = moment(f).format('YYYYMMDD');
            $scope.archivoPdf.usuario = $scope.username;
            
            dataObra.archivoId = $scope.uploadedFile.shift().id;
            
            $scope.archivoPdf.$save(function(data) {
                $scope.presentaciones = PresentacionesPdf.query();
            });
        }else{
            var modalScope = $scope.$new();
            modalScope.dataObra = {
                
            };
            $modal({template: '/views/obras/modals/agregarPresentaciones.html', persist: true, show: true, backdrop: 'static', scope: modalScope});
        }
    };
    
    $scope.contactos = Contactos.listar();
    
}).controller('presentacionesCtrl', function($scope, $modal, Obra, Presentaciones, OrdenObra, RelevanciaIniciativa, Comuna, ORMOrganigrama, Obras2, EstadoObra) {
    //Controller de tablacsv----------------------------------------------------------------------------------------------------
    $scope.tab = 'Resumen General',
    
    $scope.obras = Obra.query({},function() {
        var obras2 = Obras2.query({},function() {
            $scope.listado = $scope.obras.concat(obras2);
        });
    });
    
    $scope.ordenes = OrdenObra.query();
    $scope.estados = EstadoObra.query({obra : true});
    
    $scope.$watch('obra.orden1', function (g) {
        $scope.ordenObra = OrdenObra.get({_id: g});
    });
    
    $scope.pres = new Presentaciones();
    $scope.presentaciones = Presentaciones.query();
    
    $scope.mostrar=false;
    
    $scope.diaHoy2 = moment(new Date()).format("YYYYMMDD");
    
    $scope.listPres = function(g){
        $scope.prese = Presentaciones.get({_id: g});
        if($scope.prese.fechaAgregado = $scope.diaHoy2){
            return $scope.prese.fechaAgregado;
        }
    };
    
    //Muestra la fecha con formato DMA
    $scope.formatoFecha = function(p){
        if(p){
            return moment(p, "YYYYMMDD").format('DD/MM/YYYY');
        }
    };
    
    $scope.$watch('obras.presentaciones', function (g) {
        $scope.diaHoy2 = moment(new Date()).format("DD/MM/YYYY");
        $scope.listado = Presentaciones.get({_id: g});
        
        for (var i = 0; i < $scope.presentaciones.length; i++) {
            if ($scope.presentaciones[i]._id == g){
                return $scope.presentaciones[i];
            }
        }
        
        if($scope.presentaciones[i] === $scope.diaHoy2){
            $scope.mostrar = true;
            return $scope.listado;
        }else{
            $scope.mostrar = false;
            
            $scope.obras = Obra.query({},function() {
                var obras2 = Obras2.query({},function() {
                    $scope.listado = $scope.obras.concat(obras2);
                });
            });
            return $scope.listado;
        }
    });
    
    //Guarda la bd en la tabla de presentaciones
    $scope.guardarTabla = function (datos) {
        var f = new Date();
        var minutes = f.getMinutes();
        minutes = minutes > 9 ? minutes : '0' + minutes;
        $scope.pres.horaAgregado = (f.getHours() + ":" + minutes);
        $scope.pres.fechaAgregado = moment(f).format('YYYYMMDD');
        $scope.pres.usuario = $scope.username;
        
        $scope.pres.presentacion = $scope.listado
        $scope.pres.$save();
    };
    
    $scope.formatMonto = function(monto) {
        if (monto) {
            var splitStr = monto.split('.');
            if (splitStr.length == 4) {
                var splitLeft = splitStr[0] + "." + splitStr[1];
                if (splitStr[2] > 499) {
                    splitLeft = parseInt(splitLeft) + 1;
                }
            }else{
                var splitLeft = splitStr[0];
                if (splitStr[1] > 499) {
                    splitLeft = parseInt(splitLeft) + 1;
                }
            }
            if (splitStr.length > 2) {
                var siglas = "MM";
            }else{
                var siglas = "M";
            }
            return splitLeft + siglas;
        }else{
            return "-";
        }
    };
    
    $scope.montoCsv = function(i){
        if(i){
            return i.monto;
        }
    };
    
    $scope.proyectosCsv = function(i){
        if(i){
            var mm = moment(i.fecha, "DD/MM/YYYY").format('MMM YY');
            return moment(i.fecha, "DD/MM/YYYY").format('MMM YY');
        }
    };
    
    $scope.reverse = function(array) {
        var copy = [].concat(array);
        return copy.reverse();
    };
    
    $scope.relevancias = RelevanciaIniciativa.list();
    $scope.comunasTabla = Comuna.query();
    $scope.organigrama = ORMOrganigrama.list();
    
    $scope.prioridadPorId = function (id) {
        for (var i = 0; i < $scope.relevancias.length; i++) {
            if ($scope.relevancias[i]._id == id){
                return $scope.relevancias[i];
            }
        }
    };
    
    //$scope.ordenes = OrdenObra.query();
    $scope.seg = function (obra){
        for (var i = 0; i < $scope.ordenes.length; i++) {
            if ($scope.ordenes[i]._id == obra.orden1){
                return $scope.ordenes[i].orden;
            }
        }
    };
    
    $scope.estadoPorId = function (id) {
        for (var i = 0; i < $scope.estados.length; i++) {
            if ($scope.estados[i]._id == id){
                return $scope.estados[i];
            }
        }
    };
});