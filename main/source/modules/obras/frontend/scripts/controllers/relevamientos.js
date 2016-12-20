angular.module('bag2.obras').controller('RelevamientosCtrl', function($scope,$modal,Obra,Obras2,Comuna,Relevamientos,RelevanciaIniciativa,ORMOrganigrama,EstadoObra,ORMContacto) {
    $scope.relevamientos = Relevamientos.query();
    $scope.relevancias = RelevanciaIniciativa.query();
    $scope.estados = EstadoObra.query({obra : true});
    
    var nombresCompletos = {}, numerosComunas = {};
    
    var obras = Obra.query({estado:'52e90195491f2d16f8bc1bc8'},function(){
        var obras2 = Obras2.query({estado:'52e90195491f2d16f8bc1bc8'},function() {
            $scope.obras = obras.concat(obras2);
            
            $scope.contactos = ORMContacto.query({relevador:true},function () {
                angular.forEach($scope.contactos, function (c) {
                    nombresCompletos[c._id] = c.apellido + ', ' + c.nombre;
                });
                
                $scope.comunas = Comuna.query(function () {
                    angular.forEach($scope.comunas, function (c) {
                        numerosComunas[c._id] = c.numero;
                    });
                    $scope.obras = $scope.obras;
                });
            });
        });
    });
    
    $scope.diaHoy = moment(new Date());
    
    $scope.comprobarAprobado = function(obra){
        var aprobado = false;
        $scope.relevamientos.forEach(function(rel){
            if(rel.obra == obra._id){
                if(rel.estado == "Esperando Aprobacion"){
                    aprobado = true;
                }
            }
        });
        return aprobado;
    };
    
    /*$scope.estadoRelevamiento = function(obra){
        var resultado = "No relevado";
        $scope.relevamientos.forEach(function(relevamiento){
            if(obra._id == relevamiento.obra){
                if(relevamiento.estado){
                    if(relevamiento.estado == "Esperando Aprobacion"){
                        resultado = "Esperando Aprobacion";
                    }
                    if(relevamiento.estado != "Esperando Aprobacion"){
                        resultado = relevamiento.estado;
                    }
                    if(relevamiento.tipoRelevamiento){
                        resultado = relevamiento.tipoRelevamiento + " " + relevamiento.estado;
                    }
                }
            }
        });
        return resultado;
    };*/
    
    $scope.aprobar = function(idObra,estaAprobado,concuerda){
        if(estaAprobado){
            if(confirm("Seguro desea guardar el relevamiento?")){
                $("#modalGuardando").modal('show');
                
                Obra.get({"_id":$scope.relevamientoSel.obra},function(o1){
                    Obras2.get({"_id":$scope.relevamientoSel.obra},function(o2){
                        var sePuedeGuardar = false;
                        function guardar(obraSeleccionada){
                            var ultimoRelevamiento = angular.copy(idObra);
                            
                            var datosObra = {
                                fechaOkIniRel: ultimoRelevamiento.fechaVisita,
                                observacionesRelevamiento: ultimoRelevamiento.comentarios,
                                idRelevamiento: ultimoRelevamiento._id
                            };
                            
                            //$scope.iconGuardando = true;
                            
                            if(concuerda){
                                datosObra.relevamiento = "Relevado concuerda";
                                ultimoRelevamiento.estado = "Concuerda";
                            }else{
                                datosObra.relevamiento = "Relevado no concuerda";
                                ultimoRelevamiento.estado = "No concuerda";
                            }
                            
                            if(ultimoRelevamiento && ultimoRelevamiento.tipoRel && ultimoRelevamiento.tipoRel.inicio){
                                if(obraSeleccionada.imagenesIniRel === undefined){
                                    obraSeleccionada.imagenesIniRel = [];
                                }
                                if(ultimoRelevamiento.fotos.length){
                                    ultimoRelevamiento.fotos.forEach(function(foto){
                                        obraSeleccionada.imagenesIniRel.push(foto);
                                    });
                                }
                                if((obraSeleccionada.inicios.length) && (datosObra.relevamiento == "Relevado concuerda")){
                                    obraSeleccionada.inicios.slice(-1)[0].cumplido = true;
                                }
                                if((obraSeleccionada.inicios.length) && (datosObra.relevamiento == "Relevado no concuerda")){
                                    obraSeleccionada.inicios.slice(-1)[0].cumplido = false;
                                }
                                $scope.guardarTime(datosObra);
                                obraSeleccionada.iniciosRel.push(datosObra);
                                sePuedeGuardar = true;
                            }
                            
                            if(ultimoRelevamiento && ultimoRelevamiento.tipoRel && ultimoRelevamiento.tipoRel.avance){
                                if(concuerda){
                                    ultimoRelevamiento.posibleAtraso && ultimoRelevamiento.posibleAtraso == true ? datosObra.posibleAtraso = true : '';
                                }else{
                                    ultimoRelevamiento.posibleAtraso && ultimoRelevamiento.posibleAtraso == true ? datosObra.posibleAtraso = true : '';
                                }
                                if(obraSeleccionada.imagenesFisico === undefined){
                                    obraSeleccionada.imagenesFisico = [];
                                }
                                if(ultimoRelevamiento.fotos.length){
                                    ultimoRelevamiento.fotos.forEach(function(foto){
                                        obraSeleccionada.imagenesFisico.push(foto);
                                    });
                                }
                                $scope.guardarTime(datosObra);
                                obraSeleccionada.fisico.push(datosObra);
                                sePuedeGuardar = true;
                            }
                            
                            if(ultimoRelevamiento && ultimoRelevamiento.tipoRel && ultimoRelevamiento.tipoRel.final){
                                if(obraSeleccionada.imagenesFinRel === undefined){
                                    obraSeleccionada.imagenesFinRel = [];
                                }
                                if(ultimoRelevamiento.fotos.length){
                                    ultimoRelevamiento.fotos.forEach(function(foto){
                                        obraSeleccionada.imagenesFinRel.push(foto);
                                    });
                                }
                                if((obraSeleccionada.final.length) && (datosObra.relevamiento == "Relevado concuerda")){
                                    obraSeleccionada.final.slice(-1)[0].cumplido = true;
                                }
                                if((obraSeleccionada.final.length) && (datosObra.relevamiento == "Relevado no concuerda")){
                                    obraSeleccionada.final.slice(-1)[0].cumplido = false;
                                }
                                $scope.guardarTime(datosObra);
                                obraSeleccionada.finalRel.push(datosObra);
                                sePuedeGuardar = true;
                            }
                            
                            if(sePuedeGuardar){
                                obraSeleccionada.confirmadoRelevamiento = false;
                                ultimoRelevamiento.$save({},function(){
                                    obraSeleccionada.$save({},function(){
                                        Obra.query({estado:'52e90195491f2d16f8bc1bc8'},function(obras) {
                                            Obras2.query({estado:'52e90195491f2d16f8bc1bc8'},function(obras2) {
                                                $scope.obras = obras.concat(obras2);
                                                $scope.editando = false;
                                                $scope.relevamientos = Relevamientos.query(function(){
                                                    //$scope.iconGuardando = false;
                                                    $("#modalGuardando").modal('hide');
                                                });
                                            });
                                        });
                                    });
                                });
                            }else{
                                alert("Seleccione un tipo de relevamiento");
                                var modalScope = $scope.$new();
                                modalScope.datos = {
                                    tab: 'info',
                                };
                                modalScope.data = {
                                    descripcion: '',
                                    fecha: undefined,
                                    fuente: ''
                                };
                                $modal({template: '/views/obras/modals/aprobarRelevamiento.html', persist: true, show: true, backdrop: 'static', scope: modalScope});
                            }
                        }
                        
                        if(o1.nombre){
                            guardar(o1);
                        }else if(o2.nombre){
                            guardar(o2);
                        }
                    });
                });
            }
        }else{
            if(!$scope.hasPermission('obras.relevador')){
                Relevamientos.query({'obra':idObra,'estado':"Esperando Aprobacion"},function(datos){
                    $scope.relevamientoSel = datos[0];
                    var modalScope = $scope.$new();
                    modalScope.datos = {tab: 'info'};
                    modalScope.data = {descripcion: '',fecha: undefined,fuente: ''};
                    $modal({template: '/views/obras/modals/aprobarRelevamiento.html', persist: true, show: true, backdrop: 'static', scope: modalScope});
                });
            }else{
                alert("No posee permisos para realizar esta acción")
            };
        }
    };
    
    $scope.guardarTime = function(data) {
        data.fechaAgregado = new Date().getTime();
        data.usuario = $scope.username;
    };
    
    $scope.abrirRelevamientos = function(obra){
        var arrayModal=[];
        $scope.relevamientos.forEach(function(relevamiento){
            if(obra == relevamiento.obra){
                arrayModal.push(relevamiento);
            }
            $scope.relevamientosModal = arrayModal;
        });
        var modalScope = $scope.$new();
        $modal({template: '/views/obras/modals/listaRelevamientos.html', persist: true, show: true, backdrop: 'static', scope: modalScope});
    };
    
    //ORDEN DEL LISTADO POR DEFECTO
    $scope.orden = ['relevancia', $scope.ordenComuna,$scope.iniciosTrue, $scope.finalTrue];
    
    $scope.iniciosTrue = function(obra){
        var inicio;
        if(obra.inicios && (inicio = obra.inicios.slice(-1)[0]) && inicio.cumplido === true) return -1;
        return 0;
    };
    
    $scope.finalTrue = function(obra){
        var final;
        if(obra.final && (final = obra.final.slice(-1)[0]) && final.cumplido === true) return 1;
        return 0;
    };
    
    $scope.ordenRelevador = function(obra){
        return nombresCompletos[obra.relevadorAsignado];
    };
    
    //CORREGIR
    $scope.ordenHito = function(obra){
        var valor = "";
        if(obra.finalRel && obra.finalRel.slice(-1)[0] && obra.finalRel.slice(-1)[0].relevamiento && obra.finalRel.slice(-1)[0].relevamiento == "No relevado"){
            if(obra.final && obra.final.slice(-1)[0] && obra.final.slice(-1)[0].fecha){
                valor = moment(obra.final.slice(-1)[0].fecha,"DD/MM/YYYY").add(1, 'months').format('YYYYMMDD').valueOf()
            }
        }
        if(obra.iniciosRel && obra.iniciosRel.slice(-1)[0] && obra.iniciosRel.slice(-1)[0].relevamiento && obra.iniciosRel.slice(-1)[0].relevamiento !== "Relevado concuerda"){
            if(obra.inicios && obra.inicios.slice(-1)[0] && obra.inicios.slice(-1)[0].fecha){
                valor = moment(obra.inicios.slice(-1)[0].fecha,"DD/MM/YYYY").add(1, 'months').format('YYYYMMDD').valueOf()
            }
        }
        return valor;
    };
    
    $scope.ordenComuna = function (obra) {
        return numerosComunas[obra.comuna[0]] * 100 + (obra.comuna[1] ? numerosComunas[obra.comuna[1]] : 0);
    };
    
    $scope.filtroObras = function(obra){
        var inicioRel = obra.iniciosRel && obra.iniciosRel.slice(-1)[0] && obra.iniciosRel.slice(-1)[0].relevamiento;
        /*var finalRel = obra.finalRel && obra.finalRel.slice(-1)[0] && obra.finalRel.slice(-1)[0].relevamiento;
        var avance = obra.fisico && obra.fisico.slice(-1)[0] && obra.fisico.slice(-1)[0].relevamiento;*/
        
        if(obra.finalRel && obra.finalRel.slice(-1)[0] && obra.finalRel.slice(-1)[0].relevamiento && obra.finalRel.slice(-1)[0].relevamiento == "No relevado"){
            return true;
        }
        //Obras de inicio
        if(
            (inicioRel == "No relevado" || inicioRel == "Relevado no concuerda")
        ){
            return true;
        }
        
        if((inicioRel == "Relevado concuerda") || (inicioRel == "Nunca se va a relevar")){
            //Obras de avance
            if(
                obra.final && obra.final.slice(-1)[0] && obra.final.slice(-1)[0].fecha && moment(obra.final.slice(-1)[0].fecha,"DD/MM/YYYY") >= $scope.diaHoy
            ){
                return true;
            }
            //Obras de final
            if(
                (obra.finalRel && obra.finalRel.slice(-1)[0] && obra.finalRel.slice(-1)[0].relevamiento && ((obra.finalRel.slice(-1)[0].relevamiento == "") || (obra.finalRel.slice(-1)[0].relevamiento == "Relevado no concuerda") || (obra.finalRel.slice(-1)[0].relevamiento == "No relevado"))) &&
                (obra.final && obra.final.slice(-1)[0] && obra.final.slice(-1)[0].fecha && moment(obra.final.slice(-1)[0].fecha,"DD/MM/YYYY") < $scope.diaHoy)
            ){
                return true;
            }
        }
    };
    
    $scope.fechaUltimoHito = function(obra){
        var inicioRel = obra.iniciosRel && obra.iniciosRel.slice(-1)[0] && obra.iniciosRel.slice(-1)[0].relevamiento;
        var fecha = "";
        
        if(!inicioRel || inicioRel == "Relevado no concuerda"){
            if(obra.inicios && obra.inicios.slice(-1)[0] && obra.inicios.slice(-1)[0].fecha){
                fecha = fecha + " - " + moment(obra.inicios.slice(-1)[0].fecha,"DD/MM/YYYY").add(1, 'months').format('DD/MM/YYYY');
            }
            return "inicio" + fecha;
        }
        if(inicioRel == "No relevado"){
            if(obra.inicios && obra.inicios.slice(-1)[0] && obra.inicios.slice(-1)[0].fecha){
                fecha = fecha + " - " + moment(obra.inicios.slice(-1)[0].fecha,"DD/MM/YYYY").add(1, 'months').format('DD/MM/YYYY');
            }
            return "inicio" + fecha;
        }
        if(
            obra.final && obra.final.slice(-1)[0] && obra.final.slice(-1)[0].fecha && (moment(obra.final.slice(-1)[0].fecha,"DD/MM/YYYY") < $scope.diaHoy) ||
            obra.final && obra.final.slice(-1)[0] && !obra.final.slice(-1)[0].fecha ||
            !obra.final || !obra.final.slice(-1)[0]
        ){
            if(obra.final && obra.final.slice(-1)[0] && obra.final.slice(-1)[0].fecha){
                fecha = fecha + " - " + moment(obra.final.slice(-1)[0].fecha,"DD/MM/YYYY").add(1, 'months').format('DD/MM/YYYY');
            }
            return "Final" + fecha;
        }
        if(obra.final && obra.final.slice(-1)[0] && obra.final.slice(-1)[0].fecha && (moment(obra.final.slice(-1)[0].fecha,"DD/MM/YYYY") > $scope.diaHoy)){
            if(obra.fisico && obra.fisico.slice(-1)[0] && obra.fisico.slice(-1)[0].fechaOkIniRel){
                fecha = fecha + " - " + moment(obra.fisico.slice(-1)[0].fechaOkIniRel,"DD/MM/YYYY").add(1, 'months').format('DD/MM/YYYY');
            }
            return "Avance" + fecha;
        }
    };
    
    $scope.confirmarRelevador  = function(obra){
        if(obra.confirmadoRelevamiento == true){
            obra.confirmadoRelevamiento = false;
        }else{
            obra.confirmadoRelevamiento = true;
        }
    };
    
    $scope.iconoRel = function(obra){
        if(obra.confirmadoRelevamiento == true){
            return "icon-ok";
        }else{
            return "icon-remove";
        }
    };
    
    $scope.existeRelevamiento = function(obra){
        var encontrada;
        $scope.relevamientos.forEach(function(relevamiento){
            if(obra._id == relevamiento.obra){
                encontrada=true;
            }
        });
        return encontrada;
    };
    
    $scope.mostrarPresentacion = function (id) {
        $scope.tabFoto = "ppt";
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
                }
                if($scope.obraPresentacion && $scope.obraPresentacion.inicios && $scope.obraPresentacion.inicios.slice(-1)[0] && $scope.obraPresentacion.inicios.slice(-1)[0].fecha){
                    $scope.inicio = $scope.obraPresentacion.inicios.slice(-1)[0].fecha;
                }
                if($scope.obraPresentacion && $scope.obraPresentacion.final && $scope.obraPresentacion.final.slice(-1)[0] && $scope.obraPresentacion.final.slice(-1)[0].fecha){
                    $scope.fin = $scope.obraPresentacion.final.slice(-1)[0].fecha;
                }
                
                if($scope.obraPresentacion.fotos.length > 0){
                    
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
                $scope.obraPresentacion = Obras2.get({_id: id}, function(data){
                    buscarPresentacion();
                });
            }else{
                buscarPresentacion();
            }
        });
    };
    
    $scope.reverse = function(array) {
        var copy = [].concat(array);
        return copy.reverse();
    };
    
    $scope.comunasTabla = Comuna.query();
    $scope.comunaPorId = function (id) {
        for (var i = 0; i < $scope.comunasTabla.length; i++) {
            if ($scope.comunasTabla[i]._id == id){
                return $scope.comunasTabla[i];
            }
        }
    };
    
    $scope.organigrama = ORMOrganigrama.list();
    
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
    
    $scope.filtroPrioridades = function (obra) {
        return $scope.prioridadesFiltradas[obra.relevancia];
    };
    
    $scope.cambiarFiltroPrioridad = function (p) {
       $scope.prioridadesFiltradas[p._id] = !$scope.prioridadesFiltradas[p._id];
    };
    
    //FILTRO DE COMUNAS------------------------------------------------------------------------------
    $scope.comunasFiltradas = {};
    $scope.comunas = Comuna.query(function() {
        angular.forEach ($scope.comunas, function (c) {
            $scope.comunasFiltradas[c._id] = true;
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
    
    //FILTRO DE PRIORIDADES-----------------------------------------------------------------
    $scope.prioridadesFiltradas = {};
    $scope.prioridades = RelevanciaIniciativa.query(function() {
        angular.forEach ($scope.prioridades, function (p) {
            $scope.prioridadesFiltradas[p._id] = true;
        });
    });
    
    $scope.filtrandoPrioridad = function (p) {
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
    
    $scope.contactoPorId = function(id) {
        for (var i = 0; i < $scope.contactos.length; i++) {
            if ($scope.contactos[i]._id == id) {
                return $scope.contactos[i];
            }
        }
    };
    
    $scope.editar = function(){
        $scope.editando=true;
    };
    
    $scope.cancelar = function(){
        arrayPreparados = [];
        $scope.editando=false;
    };
    
    var arrayPreparados = [];
    $scope.listadoActualizar = function(obra){
        var encontrado = false;
        arrayPreparados.forEach(function(array){
            if(array._id == obra._id){
                encontrado = true;
                array.relevadorAsignado = obra.relevadorAsignado;
                array.confirmadoRelevamiento = obra.confirmadoRelevamiento;
            }
        });
        if(!encontrado){
            arrayPreparados.push({
                _id: obra._id,
                relevadorAsignado: obra.relevadorAsignado,
                confirmadoRelevamiento: obra.confirmadoRelevamiento
            });
        }
    };
    
    $scope.guardar = function(){
        if(arrayPreparados.length > 0){
            for(var i=0;i<arrayPreparados.length;i++){
                for(var o=0;o<$scope.filters.length;o++){
                    if(arrayPreparados[i]._id == $scope.filters[o]._id){
                        $scope.filters[o].relevadorAsignado = arrayPreparados[i].relevadorAsignado;
                        $scope.filters[o].confirmadoRelevamiento = arrayPreparados[i].confirmadoRelevamiento;
                        $scope.filters[o].$save();
                    }
                }
            }
            arrayPreparados = [];
            $scope.editando = false;
        }else{
            $scope.editando = false;
        }
    };
    
    $scope.borrarRelevamiento = function(relevamiento){
        relevamiento.$delete(function(){
            if(confirm("Esta seguro que desea eliminar el registro?")){
                alert("Se elimino el relevamiento");
                $scope.relevamientos = Relevamientos.query();
                $scope.editando = false;
            }
        });
    };
    
}).controller('FichaRelevadorCtrl', function($scope,$modal,Obra,ORMContacto,Relevamientos,$location,Comuna,ORMOrganigrama,$window,Obras2) {
    $scope.relevamientos = Relevamientos.query();
    $scope.contactos = ORMContacto.query({relevador:true});
    
    $scope.diaHoy = moment(new Date());
    
    $scope.obras = Obra.query({estado:'52e90195491f2d16f8bc1bc8'},function() {
        var obras2 = Obras2.query({estado:'52e90195491f2d16f8bc1bc8'},function() {
            $scope.obras = $scope.obras.concat(obras2);
        });
    });
    
    $scope.obraPorId = function (id) {
        for (var i = 0; i < $scope.obras.length; i++) {
            if ($scope.obras[i]._id == id){
                return $scope.obras[i];
            }
        }
    };
    
    $scope.estadoRelevamiento = function(obra){
        var resultado = "No relevado";
        $scope.relevamientos.forEach(function(relevamiento){
            if(obra._id == relevamiento.obra){
                resultado = relevamiento.estado;
            }
        });
        return resultado;
    };
    
    $scope.filtroRelevamientosAsignados = function(relevamientos){
        if($scope.idObraSelecionada == relevamientos.obra){
            return true;
        }
    };
    
    $scope.fechaUltimoHito = function(obra){
        var inicioRel = obra.iniciosRel && obra.iniciosRel.slice(-1)[0] && obra.iniciosRel.slice(-1)[0].relevamiento;
        var fecha = "";
        
        if(!inicioRel || inicioRel == "Relevado no concuerda"){
            if(obra.inicios && obra.inicios.slice(-1)[0] && obra.inicios.slice(-1)[0].fecha){
                fecha = fecha + " - " + moment(obra.inicios.slice(-1)[0].fecha,"DD/MM/YYYY").add(1, 'months').format('DD/MM/YYYY');
            }
            return "inicio" + fecha;
        }
        if(inicioRel == "No relevado"){
            if(obra.inicios && obra.inicios.slice(-1)[0] && obra.inicios.slice(-1)[0].fecha){
                fecha = fecha + " - " + moment(obra.inicios.slice(-1)[0].fecha,"DD/MM/YYYY").add(1, 'months').format('DD/MM/YYYY');
            }
            return "inicio" + fecha;
        }
        if(
            obra.final && obra.final.slice(-1)[0] && obra.final.slice(-1)[0].fecha && (moment(obra.final.slice(-1)[0].fecha,"DD/MM/YYYY") < $scope.diaHoy) ||
            obra.final && obra.final.slice(-1)[0] && !obra.final.slice(-1)[0].fecha ||
            !obra.final || !obra.final.slice(-1)[0]
        ){
            if(obra.final && obra.final.slice(-1)[0] && obra.final.slice(-1)[0].fecha){
                fecha = fecha + " - " + moment(obra.final.slice(-1)[0].fecha,"DD/MM/YYYY").add(1, 'months').format('DD/MM/YYYY');
            }
            return "Final" + fecha;
        }
        if(obra.final && obra.final.slice(-1)[0] && obra.final.slice(-1)[0].fecha && (moment(obra.final.slice(-1)[0].fecha,"DD/MM/YYYY") > $scope.diaHoy)){
            if(obra.fisico && obra.fisico.slice(-1)[0] && obra.fisico.slice(-1)[0].fechaOkIniRel){
                fecha = fecha + " - " + moment(obra.fisico.slice(-1)[0].fechaOkIniRel,"DD/MM/YYYY").add(1, 'months').format('DD/MM/YYYY');
            }
            return "Avance" + fecha;
        }
    };
    
    $scope.filtroObraAsignada = function(Obra){
        var encontrada=false;
        for(var i=0; i < $scope.contactos.length; i++){
            if ($scope.contactos[i]._id == Obra.relevadorAsignado && Obra.confirmadoRelevamiento){
                $scope.contactos[i].correos.forEach(function(correo){
                    if(correo.valor == $scope.$root.username + "@buenosaires.gob.ar"){
                        encontrada=true;
                    }
                });
            }
        }
        return encontrada;
    };
    
    /*$scope.filtroObraAsignada = function(Obra){
        var encontrada=false;
        for(var i=0; i < $scope.contactos.length; i++){
            if ($scope.contactos[i]._id == Obra.relevadorAsignado && Obra.confirmadoRelevamiento && ((!Obra.finalRel.length) || (Obra.finalRel && Obra.finalRel.slice(-1)[0] && Obra.finalRel.slice(-1)[0].relevamiento !== "Relevado concuerda"))){
                $scope.contactos[i].correos.forEach(function(correo){
                    if(correo.valor == $scope.$root.username + "@buenosaires.gob.ar"){
                        encontrada=true;
                    }
                });
            }
        }
        return encontrada;
    };*/
    
    $scope.mostrarPresentacion = function (id) {
        $scope.tabFoto = "ppt";
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
            }
            
            if(!data.nombre){
                $scope.obraPresentacion = Obras2.get({_id: id}, function(data){
                    buscarPresentacion()
                })
            }else{
                buscarPresentacion()
            }
        });
    };
    
    $scope.reverse = function(array) {
        var copy = [].concat(array);
        return copy.reverse();
    };
    
    $scope.comunasTabla = Comuna.query();
    $scope.comunaPorId = function (id) {
        for (var i = 0; i < $scope.comunasTabla.length; i++) {
            if ($scope.comunasTabla[i]._id == id){
                return $scope.comunasTabla[i];
            }
        }
    };
    
    $scope.formatoMontoTooltips = function(monto) {
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
    
    $scope.organigrama = ORMOrganigrama.list();
    $scope.jurisdiccionPorId = function(id) {
        for (var i = 0; i < $scope.organigrama.length; i++) {
            if ($scope.organigrama[i]._id == id) {
                return $scope.organigrama[i];
            }
        }
    };
    
    $scope.prioridadPorId = function (id) {
        for (var i = 0; i < $scope.relevancias.length; i++) {
            if ($scope.relevancias[i]._id == id){
                return $scope.relevancias[i];
            }
        }
    };
    
    $scope.formatoFecha = function(fecha){
        if(fecha){
            fecha = moment(fecha, "DD/MM/YYYY").format("MMM YY");
        }else{
            fecha = "";
        }
        return fecha;
    };
    
    $scope.existeRelevamiento = function(obra){
        var encontrada;
        $scope.relevamientos.forEach(function(relevamiento){
            if(obra._id == relevamiento.obra){
                encontrada=true;
            }
        });
        return encontrada;
    };
    
    $scope.abrirRelevamiento = function(obra){
        var arrayModal=[]
        $scope.relevamientos.forEach(function(relevamiento){
            if(obra == relevamiento.obra){
                arrayModal.push(relevamiento)
            }
            $scope.relevamientosModal = arrayModal;
        });
        var modalScope = $scope.$new();
        $modal({template: '/views/obras/modals/listaRelevamientos.html', persist: true, show: true, backdrop: 'static', scope: modalScope});
    };
    
    $scope.calcularUbicacion = function(obra){
        if(obra.ubicacionesComunicacion && obra.ubicacionesComunicacion.slice(-1)[0] && obra.ubicacionesComunicacion.slice(-1)[0].detalle){
            return obra.ubicacionesComunicacion.slice(-1)[0].detalle;
        }
    };
    
    $scope.imprimir = function () {
        $window.print(); 
    };
    
}).controller('fixtureCtrl', function($scope,$modal,Obra,Comuna,OrdenObra,ORMOrganigrama,Obras2) {
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
        }else{
            $scope.filtro(undefined,undefined);
        }
    };
    
    $scope.ordenes = OrdenObra.query();
    
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
        
        
        $scope.obras = Obra.query({},function() {
            var obras2 = Obras2.query({},function() {
                $scope.listado = $scope.obras.concat(obras2);
                
            });
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
                },function() {
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
}).controller('NuevoRelevamientoCtrl', function($scope,$routeParams,$location,$modal,Obra,Relevamientos,Contactos,Obras2) {
    $scope.relevamientos = Relevamientos.query();
    
    var obras = Obra.query(function(){
        var obras2 = Obras2.query({},function() {
            $scope.obras = obras.concat(obras2);
        });
    });
    
    $scope.contactos = Contactos.listar();
    
    $scope.relevamiento = new Relevamientos({fotos:[]});
    
    var getObra = Obra.get({_id: $routeParams._id},function(data) {
        var buscarObra = function(){
            if(getObra && getObra.ubicacionesComunicacion && getObra.ubicacionesComunicacion.slice(-1)[0] && getObra.ubicacionesComunicacion.slice(-1)[0].detalle){
                $scope.relevamiento.ubicacion = getObra.ubicacionesComunicacion.slice(-1)[0].detalle;
            }
            if(getObra && getObra.inicios.length > 0 && getObra.inicios.slice(-1)[0] && getObra.inicios.slice(-1)[0].fecha){
                $scope.relevamiento.fechaInicio = getObra.inicios.slice(-1)[0].fecha;
            }
            if(getObra && getObra.final.length > 0 && getObra.final.slice(-1)[0] && getObra.final.slice(-1)[0].fecha){
                $scope.relevamiento.fechaFin = getObra.final.slice(-1)[0].fecha;
            }
            if(getObra && getObra.detallesComunicacion.length > 0 && getObra.detallesComunicacion.slice(-1)[0] && getObra.detallesComunicacion.slice(-1)[0].detalle){
                $scope.relevamiento.detalle = getObra.detallesComunicacion.slice(-1)[0].detalle;
            }
        }
        
        if(!data.nombre){
            getObra = Obras2.get({_id: $routeParams._id}, function(data){
                buscarObra()
            })
        }else{
            buscarObra()
        }
    });
    
    $scope.guardar = function(confirmado){
        if (confirmado) {
            // $scope.relevamiento.fotos = $scope.fotos;
            $scope.relevamiento.obra = $routeParams._id;
            $scope.relevamiento.estado = "Esperando Aprobacion";
            $scope.relevamiento.tipoRelevamiento = "";
            $scope.guardarTime($scope.relevamiento);
            $scope.relevamiento.$save({},function(){
                $location.path('/obras/fichaRelevador');
            });
        }else{
            if(!$scope.relevamiento.fechaVisita || $scope.relevamiento.fechaVisita.length < 1) {
                alert("Existen campos incompletos")
            }else{
                $("#confirmarGuardar").modal('show');
            }
        }
    };
    
    $scope.uploaded=[];
    
    $scope.agregarImagenes = function(datos,array,confirmado){
        if(confirmado){
            datos.fotoId = $scope.uploaded.shift().id;
            $scope.relevamiento.fotos.push(datos);
        }else{
            var modalScope = $scope.$new();
            modalScope.datos = {
                parametro: array,
            };
            $modal({
                template: '/views/obras/modals/agregarImagenes.html',
                persist: true,
                show: true,
                backdrop: 'static',
                scope: modalScope
            });
        }
    };
    
    $scope.guardarTime = function(data) {
        data.fechaAgregado = new Date().getTime();
        data.usuario = $scope.username;
    };
    
    $scope.listaVisitaN = Relevamientos.query({obra: $routeParams._id},function(){
        var resultados = [];
        if($scope.listaVisitaN.length){
            $scope.listaVisitaN.forEach(function(visita){
                resultados.push(visita.visitaN);
            });
            resultados.sort(function(a, b){return a-b});
            $scope.relevamiento.visitaN = resultados.slice(-1)[0] + 1;
        }else{
            $scope.relevamiento.visitaN = 1;
        };
    })
    
}).controller('adminObrasCtrl', function($scope,ORMContacto,TipoObra,SubtiposObra,ImpactoIniciativa,OrdenObra,RelevanciaIniciativa,CriticidadIniciativa,AlcanceIniciativa,SegmentoEtarioIniciativa,EstadoIniciativa,ProveedoresObras){
    $scope.colecciones = ["Tipo","Subtipo","Impactos","Segmento","Prioridad","Criticidad","Alcance","Segmento Etario","Estado","Proveedor","Relevador"]
    
    $scope.tipos = TipoObra.query();
    $scope.elem = false;
    $scope.editando = false;
    $scope.user = {};
    
    $scope.tipoPorId = function(id){
        for (var i = 0; i < $scope.tipos.length; i++) {
            if ($scope.tipos[i]._id == id) {
                return $scope.tipos[i];
            }
        }
    };
    
    $scope.guardar = function(){
        $scope.listado.forEach(function(list){
            list.$save(function(){
                $scope.elem = false;
                $scope.editando = false;
            })
        })
    }
    
    $scope.cancelar = function(){
        $scope.editando = false;
        $scope.seleccion($scope.seleccion.choice) 
    }
    
    $scope.seleccion = function(sel){
        $scope.titulo = sel;
        switch(sel) {
            case "Tipo":
                $scope.listado = TipoObra.query();
                break;
            case "Subtipo":
                $scope.listado = SubtiposObra.query();
                break;
            case "Impactos":
                $scope.listado = ImpactoIniciativa.query();
                $scope.descripcion = "Los cambios en esta coleccion afectan al modulo de iniciativas"
                break;
            case "Segmento":
                $scope.listado = OrdenObra.query();
                break;
            case "Prioridad":
                $scope.listado = RelevanciaIniciativa.query();
                $scope.descripcion = "Los cambios en esta coleccion afectan al modulo de iniciativas"
                break;
            case "Criticidad":
                $scope.listado = CriticidadIniciativa.query();
                $scope.descripcion = "Los cambios en esta coleccion afectan al modulo de iniciativas"
                break;
            case "Alcance":
                $scope.listado = AlcanceIniciativa.query();
                $scope.descripcion = "Los cambios en esta coleccion afectan al modulo de iniciativas"
                break;
            case "Segmento Etario":
                $scope.listado = SegmentoEtarioIniciativa.query();
                $scope.descripcion = "Los cambios en esta coleccion solo afectan al modulo de iniciativas"
                break;
            case "Estado":
                $scope.listado = EstadoIniciativa.query();
                break;
            case "Proveedor":
                $scope.listado = ProveedoresObras.query();
                break;
            case "Relevador":
                $scope.listado = {};
                $scope.users = ORMContacto.query();
                break;
            default:
                $scope.listado = {};
        }
    };
    
    $scope.$watch('user.relevador', function(user) {
        for(var i=0;i<$scope.users.length;i++){
            if(user == $scope.users[i]._id){
                $scope.user = $scope.users[i];
            }
        }
    });
    
    $scope.seleccionar = function(id,coleccion){
        coleccion = coleccion.replace("",'')
        for(var i=0;i<coleccion.length;i++){
            if(id == coleccion[i]._id){
                $scope.seleccionado = coleccion[i];
            }
        }
    }
    
    var coleccionSeleccionada = function(item){
        var valorQuery = "",valorSeleccion = $scope.seleccion.choice;
        valorSeleccion == "Tipo" ? valorQuery = new TipoObra({nombre:item.nombre}) : '';
        valorSeleccion == "Subtipo" ? valorQuery = new SubtiposObra({nombre:item.nombre,tipo:item.tipo}) : '';
        valorSeleccion == "Impactos" ? valorQuery = new ImpactoIniciativa({nombre:item.nombre}) : '';
        valorSeleccion == "Segmento" ? valorQuery = new OrdenObra({nombre:item.nombre,orden:item.orden}) : '';
        valorSeleccion == "Prioridad" ? valorQuery = new RelevanciaIniciativa({nombre:item.nombre}) : '';
        valorSeleccion == "Criticidad" ? valorQuery = new CriticidadIniciativa({nombre:item.nombre}) : '';
        valorSeleccion == "Alcance" ? valorQuery = new AlcanceIniciativa({nombre:item.nombre}) : '';
        valorSeleccion == "Segmento Etario" ? valorQuery = new SegmentoEtarioIniciativa({nombre:item.nombre}) : '';
        valorSeleccion == "Estado" ? valorQuery = new EstadoIniciativa({nombre:item.nombre,obra:item.obra,orden:item.orden}) : ''
        valorSeleccion == "Proveedor" ? valorQuery = new ProveedoresObras({nombre:item.nombre}) : ''
        return valorQuery;
    };
    
    $scope.nuevoRegistro = function(item,guardando){
        if(!guardando){
            var valorQuery = "";
            valorQuery = coleccionSeleccionada(item)
            $("#modalNuevoItem").modal('show');
        }else{
            valorQuery = coleccionSeleccionada(item)
            valorQuery.$save(function(){
                $scope.nuevoCampo.nombre = "";
                $scope.nuevoCampo.tipo = "";
                $scope.seleccion($scope.seleccion.choice);
            });
        }
    };
    
    $scope.eliminar = function(item) {
        var res = confirm("Esta seguro que desea eliminar el registro?")
        if(res){
            item.$delete(function(){
                alert("Eliminado");
                $scope.seleccion($scope.seleccion.choice);
            });
        }
    };
    
    $scope.guardarRelevador = function(){
        $scope.user.$save();
        $scope.seleccion('Relevador')
    };
});