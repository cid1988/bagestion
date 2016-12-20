angular.module('bag2.obras').controller('VerObraCtrl', function($scope,$modal,EstadoIniciativa,ORMOrganigrama,ImpactoIniciativa,CriticidadIniciativa,SegmentoEtarioIniciativa,FuenteFinanciacionIniciativa,RelevanciaIniciativa,AlcanceIniciativa,TipoObra,$routeParams,Comuna,Obra,$location,Contactos,OrdenObra,ORMTema,Obras2,Relevamientos,IniciativaPlan,SubtiposObra,ProveedoresObras) {
    $scope.tab = 'identificacion',
    
    //AUTOCOMPLETER Y COORDENADAS DE UBICACION
    new usig.AutoCompleter('callejero1', {
        afterSelection: function(option) {
            $scope.obra.calle = option.nombre;
            buscarCoordenada(option.nombre,$scope.obra.altura,$scope.obra.cruce);
        },
    });
    
    new usig.AutoCompleter('callejero2', {
        afterSelection: function(option) {
            $scope.obra.cruce = option.nombre;
            buscarCoordenada($scope.obra.calle,$scope.obra.altura,option.nombre);
        }
    });
    
    $scope.$watch('obra.altura', function(altura){
        if($scope.editando){
            buscarCoordenada($scope.obra.calle,altura,$scope.obra.cruce);
        }
    });
    
    $scope.$watch('obra.cruce', function(cruce){
        if($scope.editando && cruce.length < 1){
            buscarCoordenada($scope.obra.calle,$scope.obra.altura,cruce);
        }
    });
    
    function buscarCoordenada(calle,altura,cruce){
        var geoCoder = new usig.GeoCoder();
        
        if(calle && altura && !cruce){
            geoCoder.geoCodificarCalleAltura(calle,parseInt(altura),function(data){
                if((data == "ErrorCalleInexistente") || (data == "ErrorNoSeCruzanOCodigoErroneo")){
                    $scope.obra.coordenadas = "";
                    $scope.$apply();
                }else{
                    $scope.obra.coordenadas = data.lat + "," + data.lon;
                    $scope.$apply();
                }
            },function(){
                $scope.obra.coordenadas = "No se encontro la coordenada";
                $scope.$apply();
            });
        }else if(calle && !altura && cruce){
            geoCoder.geoCodificarCalleYCalle(calle,cruce,function(data){
                if((data == "ErrorCalleInexistente") || (data == "ErrorNoSeCruzanOCodigoErroneo")){
                    $scope.obra.coordenadas = "";
                    $scope.$apply();
                }else{
                    $scope.obra.coordenadas = data.lat + "," + data.lon;
                    $scope.$apply();
                }
            },function(){
                $scope.obra.coordenadas = "";
                $scope.$apply();
            });
        }else{
            $scope.obra.coordenadas = "";
            $scope.$apply();
        }
    }
    
    $scope.barraProgreso = function(){
        var numero = 0,a = $scope.obra;
        
        var calcularPorcentaje = function(){
            for(var i=1;i<arguments.length;i++){
                if(arguments[0][arguments[i]] && arguments[i].length){
                    numero ++;
                }
            }
            return numero;
        };
        
        calcularPorcentaje(a,'nombre','nombre_largo','patente','etapa','siglas','ref_mapa','plan','legislativo','expediente','codigo_anterior','temas','calle','altura','cruce',
        'seccion','manzana','parcela','unidad_funcional','barrio','comuna','provincia','pais','codigo_postal','coordenadas','utiu','region_sanitaria','distrito_escolar','comisaria_pm',
        'tipo','subtipo','impacto','orden1','orden2','jurisdiccion','dependencia','referente','plazo_completo','objetivo','nombrar','presupuestoSigaf','relevancia','criticidad','alcance','segmento_etario',
        'ciudadanos','metros','descripcionesAlcance','proyectos','contratos','inicios','fisico','final','inaugurable','visitable','comunicable','participable','fec_inicio','fec_fin','fec_inauguracion','detallesComunicacion',
        'ubicacionesComunicacion','estado','comentariosEstado');
        
        var porcentajePorCampo=100/63;
        $scope.valorPorcentaje=Math.floor(numero*porcentajePorCampo);
        return $scope.valorPorcentaje;
    };
    
    //Fix dos colecciones
    $scope.obra = Obra.get({_id: $routeParams._id},function(){
        if($scope.obra.nombre){
            $scope.cantInicio = $scope.obra.inicios.length;
            $scope.cantFin = $scope.obra.final.length;
            $scope.obra.fotosAlcance ? $scope.obra.fotosAlcance : $scope.obra.fotosAlcance = [];
            $scope.obra.imagenesProy ? $scope.obra.imagenesProy : $scope.obra.imagenesProy = [];
            $scope.obra.imagenesCont ? $scope.obra.imagenesCont : $scope.obra.imagenesCont = [];
            $scope.obra.imagenesIniRel ? $scope.obra.imagenesIniRel : $scope.obra.imagenesIniRel = [];
            $scope.obra.imagenesFisico ? $scope.obra.imagenesFisico : $scope.obra.imagenesFisico = [];
            $scope.obra.imagenesFinRel ? $scope.obra.imagenesFinRel : $scope.obra.imagenesFinRel = [];
            $scope.obra.fotos ? $scope.obra.fotos : $scope.obra.fotos = [];
            $scope.obra.fotosEstado ? $scope.obra.fotosEstado : $scope.obra.fotosEstado = [];
            return;
        }else{
            $scope.obra = Obras2.get({_id: $routeParams._id},function(){
                $scope.cantInicio = $scope.obra.inicios.length;
                $scope.cantFin = $scope.obra.final.length;
                $scope.obra.fotosAlcance ? $scope.obra.fotosAlcance : $scope.obra.fotosAlcance = [];
                $scope.obra.imagenesProy ? $scope.obra.imagenesProy : $scope.obra.imagenesProy = [];
                $scope.obra.imagenesCont ? $scope.obra.imagenesCont : $scope.obra.imagenesCont = [];
                $scope.obra.imagenesIniRel ? $scope.obra.imagenesIniRel : $scope.obra.imagenesIniRel = [];
                $scope.obra.imagenesFisico ? $scope.obra.imagenesFisico : $scope.obra.imagenesFisico = [];
                $scope.obra.imagenesFinRel ? $scope.obra.imagenesFinRel : $scope.obra.imagenesFinRel = [];
                $scope.obra.fotos ? $scope.obra.fotos : $scope.obra.fotos = [];
                $scope.obra.fotosEstado ? $scope.obra.fotosEstado : $scope.obra.fotosEstado = [];
            });
        }
    });
    
    $scope.eliminarListaElem = function(elemento, lista) {
        lista.splice(lista.indexOf(elemento), 1);
    };

    //Leer bd de segmento o orden1
    $scope.ordenes = OrdenObra.query();
    $scope.$watch('obra.orden1', function(g) {
        $scope.ordenObra = OrdenObra.get({
            _id: g
        });
    });

    $scope.editando = false;
    
    $scope.filtroComuna = function(c) {
        return $scope.obra && $scope.obra.comuna && $scope.obra.comuna.indexOf(c._id) == -1;
    };
    
    $scope.cancelar = function() {
        $scope.editando = false;
        $scope.obra = Obra.get({_id: $routeParams._id},function(){
            if($scope.obra.nombre){
                return;
            }
            $scope.obra = Obras2.get({_id: $routeParams._id},function(){});
        });
    };
    
    //QUERYS-------------------------------------------------------------------------------
    $scope.comunas = Comuna.query();
    $scope.contactos = Contactos.listar();
    $scope.organigrama = ORMOrganigrama.list();
    $scope.estados = EstadoIniciativa.query({obra: true});
    $scope.subtiposOtro = SubtiposObra.get({'_id':'56faf4e2c2fa86173c451ef8'});
    $scope.tipos = TipoObra.query();
    $scope.impactos = ImpactoIniciativa.query();
    $scope.alcances = AlcanceIniciativa.query();
    $scope.relevancias = RelevanciaIniciativa.query();
    $scope.fuentes = FuenteFinanciacionIniciativa.query();
    $scope.segmentos = SegmentoEtarioIniciativa.query();
    $scope.criticidades = CriticidadIniciativa.query();
    var relevamientos = Relevamientos.query();
    $scope.planes = IniciativaPlan.query();
    $scope.proveedores = ProveedoresObras.query();
    
    //Setea el array de direcciones del mapa
    $scope.dataDire = {calle:'',calle2:'',altura:'',altura2:'',cruce:'',cruce2:''};

    function includeByNombre(arr, obj) {
        for (var i = 0; i < arr.length; i++) {
            //alert(arr[i].nombre, " - ", obj);
            if (arr[i].nombre == obj) return true;
        }
    }

    $scope.modificar = function() {
        $scope.editando = true;
    };

    //Segun que clase se seleccione se muestran algunos tipos
    $scope.$watch('obra.tipo', function(newValue) {
        if (!newValue) {
            return;
        }
        $scope.subtipos = SubtiposObra.query({
            'tipo': newValue
        });
    });

    $scope.eliminarObra = function(confirmado) {
        if (confirmado) {
            $scope.obra.$delete(function() {
                $location.url('/obras');
                $scope.alerts.push({
                    type: 'success',
                    htmlMessage: 'La obra se ha eliminado'
                });
            });
        }
        else {
            $("#confirmarEliminar").modal('show');
        }
    };

    $scope.crearContacto = function(confirmado, contacto) {
        if (confirmado){
            contacto.apellidos = (contacto.apellidos || '').toUpperCase();
            contacto.$save();
            $scope.contactos = Contactos.listar();
        }else{
            $modal({
                template: '/views/orm/modalNuevoContacto.html',
                persist: true,
                show: true,
                scope: $scope.$new()
            });
        }
    };
    
    $scope.reverse = function(array) {
        var copy = [].concat(array);
        return copy.reverse();
    };
    
    $scope.agregarDetaComunicacion = function(confirmado, data) {
        if (confirmado) {
            $scope.guardarTime(data);
            $scope.obra.detallesComunicacion.push(data);
        }
        else {
            if (!$scope.obra.detallesComunicacion) {
                $scope.obra.detallesComunicacion = [];
            }
            var modalScope = $scope.$new();
            modalScope.data = {
                detalle: '',
                quien: '',
                cuando: undefined
            };
            $modal({
                template: '/views/obras/modals/agregarDetalleComu.html',
                persist: true,
                show: true,
                backdrop: 'static',
                scope: modalScope
            });
        }
    };

    $scope.agregarUbiComunicacion = function(confirmado, data) {
        if (confirmado) {
            $scope.guardarTime(data);
            $scope.obra.ubicacionesComunicacion.push(data);
        }
        else {
            if (!$scope.obra.ubicacionesComunicacion) {
                $scope.obra.ubicacionesComunicacion = [];
            }
            var modalScope = $scope.$new();
            if (!$scope.obra.altura) {
                $scope.obra.altura = '';
            }
            var ubicacion = 'Dirección: \n' + $scope.obra.calle + ' ' + $scope.obra.altura + ', cruce con ' + $scope.obra.cruce + '. ';
            if ($scope.obra.direccionesMapa) {
                ubicacion = ubicacion + '\n Mapa: \n';
                $scope.obra.direccionesMapa.forEach(function(item) {
                    ubicacion = ubicacion + 'De: ' + item.calle + ' ' + item.altura + ', cruce con ' + item.cruce + '; Hasta: ' + item.calle2 + ' ' + item.altura2 + ', cruce con ' + item.cruce2 + '. \n';
                });
            }
            modalScope.data = {
                detalle: ubicacion,
                quien: '',
                cuando: undefined
            };
            $modal({
                template: '/views/obras/modals/agregarUbicacionComu.html',
                persist: true,
                show: true,
                backdrop: 'static',
                scope: modalScope
            });
        }
    };

    $scope.agregarDireMapa = function() {
        if (!$scope.obra.direccionesMapa) {
            $scope.obra.direccionesMapa = [];
        }
        var f = new Date();
        var minutes = f.getMinutes();
        minutes = minutes > 9 ? minutes : '0' + minutes;
        $scope.dataDire.horaAgregado = (f.getHours() + ":" + minutes);
        $scope.dataDire.fechaAgregado = moment(f).format('YYYYMMDD');
        $scope.dataDire.usuario = $scope.username;
        $scope.dataDire.calle = $('#calle-typeahead').val();
        $scope.dataDire.calle2 = $('#calle2-typeahead').val();
        $scope.dataDire.cruce = $('#cruce-typeahead').val();
        $scope.dataDire.cruce2 = $('#cruce2-typeahead').val();
        $scope.obra.direccionesMapa.push($scope.dataDire);
        $scope.dataDire = {calle:'',calle2:'',altura:'',altura2:'',cruce:'',cruce2:''};
    };

    $scope.agregarDescrAlcance = function(confirmado, data) {
        if (confirmado) {
            $scope.guardarTime(data);
            $scope.obra.descripcionesAlcance.push(data);
        }
        else {
            if (!$scope.obra.descripcionesAlcance) {
                $scope.obra.descripcionesAlcance = [];
            }
            var modalScope = $scope.$new();
            modalScope.data = {
                descripcion: '',
                quien: '',
                cuando: undefined
            };
            $modal({
                template: '/views/obras/modals/agregarDescripcionAlc.html',
                persist: true,
                show: true,
                backdrop: 'static',
                scope: modalScope
            });
        }
    };

    $scope.agregarComEstado = function(confirmado, data) {
        if (confirmado) {
            $scope.guardarTime(data);
            $scope.obra.comentariosEstado.push(data);
        }
        else {
            if (!$scope.obra.comentariosEstado) {
                $scope.obra.comentariosEstado = [];
            }
            var modalScope = $scope.$new();
            modalScope.data = {
                comentario: '',
                quien: '',
                cuando: undefined
            };
            $modal({
                template: '/views/obras/modals/agregarComentarioEst.html',
                persist: true,
                show: true,
                backdrop: 'static',
                scope: modalScope
            });
        }
    };
    
    $scope.guardarTime = function(data){
        var f = new Date();
        var minutes = f.getMinutes();
        minutes = minutes > 9 ? minutes : '0' + minutes;
        data.horaAgregado = (f.getHours() + ":" + minutes);
        data.fechaAgregado = moment(f).format('YYYYMMDD');
        data.usuario = $scope.username;
    };
    
    // $scope.guardarTime = function(data) {
    //     data.fechaAgregado = new Date().getTime();
    //     data.usuario = $scope.username;
    // };
    
    $scope.uploaded = [];
    $scope.uploadedFile = [];
    
    $scope.agregarImagenes = function(datos,array,confirmado,donde){
        if(confirmado){
            datos.fotoId = $scope.uploaded.shift().id;
            array.push(datos);
        }else{
            $scope.obra.fotosAlcance === undefined ? $scope.obra.fotosAlcance = [] : '';
            $scope.obra.imagenesProy === undefined ? $scope.obra.imagenesProy = [] : '';
            $scope.obra.imagenesCont === undefined ? $scope.obra.imagenesCont = [] : '';
            $scope.obra.imagenesIniRel === undefined ? $scope.obra.imagenesIniRel = [] : '';
            $scope.obra.imagenesFisico === undefined ? $scope.obra.imagenesFisico = [] : '';
            $scope.obra.imagenesFinRel === undefined ? $scope.obra.imagenesFinRel = [] : '';
            $scope.obra.fotos === undefined ? $scope.obra.fotos = [] : '';
            $scope.obra.fotosEstado === undefined ? $scope.obra.fotosEstado = [] : '';
            var modalScope = $scope.$new();
            modalScope.datos = {
                parametro: array,
                donde: donde
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
    
    $scope.agregarDocumentos = function(param, confirmado, data) {
        if(confirmado){
            $scope.guardarTime(data);
            data.archivoId = $scope.uploadedFile.shift().id;
            param == 'alcance' ? $scope.obra.documentosAlcance.push(data) : '';
            param == 'proyecto' ? $scope.obra.documentosProy.push(data) : '';
            param == 'contrato' ? $scope.obra.documentosCont.push(data) : '';
            param == 'inicio' ? $scope.obra.documentosIniRel.push(data) : '';
            param == 'avanceFisico' ? $scope.obra.documentosFisico.push(data) : '';
            param == 'final' ? $scope.obra.documentosFinRel.push(data) : '';
            param == 'comunicacion' ? $scope.obra.documentos.push(data) : '';
            param == 'estado' ? $scope.obra.documentosEstado.push(data) : '';
        }else{
            $scope.obra.documentosAlcance === undefined ? $scope.obra.documentosAlcance = [] : '';
            $scope.obra.documentosProy === undefined ? $scope.obra.documentosProy = [] : '';
            $scope.obra.documentosCont === undefined ? $scope.obra.documentosCont = [] : '';
            $scope.obra.documentosIniRel === undefined ? $scope.obra.documentosIniRel = [] : '';
            $scope.obra.documentosFisico === undefined ? $scope.obra.documentosFisico = [] : '';
            $scope.obra.documentosFinRel === undefined ? $scope.obra.documentosFinRel = [] : '';
            $scope.obra.documentos === undefined ? $scope.obra.documentos = [] : '';
            $scope.obra.documentosEstado === undefined ? $scope.obra.documentosEstado = [] : '';
            var modalScope = $scope.$new();
            modalScope.datos = {
                parametro: param,
            };
            $modal({
                template: '/views/obras/modals/agregarDocumentos.html',
                persist: true,
                show: true,
                backdrop: 'static',
                scope: modalScope
            });
        }
    };

    $scope.agregarComuna = function(dataComuna) {
        if (!$scope.obra.comuna) {
            $scope.obra.comuna = [];
        }else {
            $scope.obra.comuna.push(dataComuna.comuna);
        }
    };
    
    //Nueva vista detalle modal de imagenes
    $scope.abrirModalImagen = function(foto,param) {
        if (param == 'comunicacion') {
            var modalScope = $scope.$new();
            modalScope.datos = {
                parametro: 'comunicacion'
            }
            $modal({
                template: '/views/obras/modals/abrirModalImagen.html',
                show: true,
                backdrop: 'static',
                scope: angular.extend($scope.$new(), {
                    foto: foto,
                    parametro:'comunicacion'
                })
            });
        }else{
            $modal({
                template: '/views/obras/modals/abrirModalImagen.html',
                show: true,
                backdrop: 'static',
                scope: angular.extend($scope.$new(), {
                    foto: foto
                })
            });
        }
    };

    $scope.eliminarElemento = function(array, elemento) {
        var indice = array.indexOf(elemento);
        if (indice != -1) array.splice(indice, 1);
    };

    //Agregar duracion, guarda los campos inicio y final para calcular la duracion de la obra, se llama desde guardar()
    $scope.agregarDuracion = function(inicioPar, finalPar) {
        if(inicioPar && inicioPar.fecha) {
            var inicio = new Date(moment(inicioPar.fecha, "DD/MM/YYYY").toJSON());
            inicio = inicio.getTime();
            if(finalPar && finalPar.fecha) {
                var fin = new Date(moment(finalPar.fecha, "DD/MM/YYYY").toJSON());
                fin = fin.getTime();
                var duracion = fin - inicio;
                var dataDuracion = {
                    fecha: moment().format("DD/MM/YYYY"),
                    duracion: Math.round(((((duracion / 1000) / 60) / 60) / 24) / 30) + " M"
                };
                $scope.obra.duracion.push(dataDuracion);
                //$scope.obra.ordenDuracion = $scope.dataDuracion.duracion.substring(2, $scope.dataDuracion.duracion[$scope.dataDuracion.duracion.length-1]);
            }
        }
    };
    
    $scope.guardar = function(){
        //AL GUARDAR EN OTRO TAB SE BORRABAN LOS CAMPOS DE CALLE Y ALTURA
        // $scope.obra.calle = $('#calle3-typeahead').val();
        // $scope.obra.cruce = $('#cruce3-typeahead').val();
        
        if(($scope.cantInicio == $scope.obra.inicios.length) && ($scope.cantFin == $scope.obra.final.length)) {
            $scope.obra.ultimaModificacion = new Date().getTime();
            $scope.obra.$save(function(data) {
                $scope.editando = false;
            });
        }else{
            $scope.agregarDuracion($scope.obra.inicios[$scope.obra.inicios.length - 1], $scope.obra.final[$scope.obra.final.length - 1]);
            $scope.obra.ultimaModificacion = new Date().getTime();
            $scope.obra.$save(function(data) {
                $scope.editando = false;
            });
        }
    };
    
    $scope.agregarHito = function(datos,array){
        !$scope.obra.proyectos ? $scope.obra.proyectos = [] : '';
        !$scope.obra.contratos ? $scope.obra.contratos = [] : '';
        !$scope.obra.inicios ? $scope.obra.inicios = [] : '';
        !$scope.obra.iniciosRel ? $scope.obra.iniciosRel = [] : '';
        !$scope.obra.fisico ? $scope.obra.fisico = [] : '';
        !$scope.obra.final ? $scope.obra.final = [] : '';
        !$scope.obra.finalRel ? $scope.obra.finalRel = [] : '';
        !$scope.obra.objetivo ? $scope.obra.objetivo = [] : '';
        !$scope.obra.nombrar ? $scope.obra.nombrar = [] : '';
        !$scope.obra.presupuestoSigaf ? $scope.obra.presupuestoSigaf = [] : '';
        $scope.guardarTime(datos);
        array.push(datos);
        $scope.obra.$save();
    };
    
    $scope.temas = ORMTema.query();
    
    $scope.temaPorId = function (id) {
        for (var i = 0; i < $scope.temas.length; i++) {
            if ($scope.temas[i]._id == id){
                return $scope.temas[i];
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
    
    $scope.proveedorPorId = function(id){
        for (var i = 0; i < $scope.proveedores.length; i++) {
            if ($scope.proveedores[i]._id == id){
                return $scope.proveedores[i];
            }
        }
    };
    
    $scope.mostrarTema = function (r) {
        if(r.eliminado){
            return false; 
        }else{
            return true;
        }
    };
    
    $scope.agregarTema = function(dataTema) {
        if (!$scope.obra.temas) {
            $scope.obra.temas = [];
        }
        $scope.obra.temas.push(dataTema);
        $scope.dataTema = "";
    };
    
    $scope.planPorId = function(id){
        for (var i = 0; i < $scope.planes.length; i++) {
            if ($scope.planes[i]._id == id){
                return $scope.planes[i];
            }
        }
    };
    
    $scope.checkRelevamiento = function(tipo){
        for(var i=0;i < relevamientos.length;i++){
            var rel = relevamientos[i];
            if($scope.obra._id == rel.obra){
                if(rel.tipoRel){
                    if(rel.tipoRel.inicio && tipo == "iniciosRel"){
                        return true;
                    }
                    if(rel.tipoRel.avance && tipo == "avance"){
                        return true;
                    }
                    if(rel.tipoRel.final && tipo == "finalRel"){
                        return true;
                    }
                }else{
                    continue;
                }
            }
        }
    };
    
    $scope.buscarRelevamientos = function(tipo){
        var listadoRel = [];
        for(var i=0;i < relevamientos.length;i++){
            var rel = relevamientos[i];
            if($scope.obra._id == rel.obra){
                if(rel.tipoRel){
                    if(tipo == "iniciosRel" && rel.tipoRel.inicio == true){
                        listadoRel.push(rel);
                    }
                    if(tipo == "avance" && rel.tipoRel.avance == true){
                        listadoRel.push(rel);
                    }
                    if(tipo == "finalRel" && rel.tipoRel.final == true){
                        listadoRel.push(rel);
                    }
                }
            }
        }
        if(listadoRel.length){
            $scope.relevamientosModal = listadoRel;
            var modalScope = $scope.$new();
            $modal({template: '/views/obras/modals/listaRelevamientos.html', persist: true, show: true, backdrop: 'static', scope: modalScope});
        }
    };
})
.controller("PresupuestoSigafCtrl", function ($scope, $http) {
  $scope.$watch('o', function (o) {
    var consulta = {
      actividad: o.partida_act,
      ejercicio: o.ejercicio,
      entidad: o.partida_ent,
      fueFinan: o.partida_ff,
      inciso: o.partida_inc,
      jurisdiccion: o.partida_jur,
      moneda: o.partida_mon,
      obra: o.partida_obra,
      parcial: o.partida_par,
      principal: o.partida_pri,
      programa: o.partida_pr,
      proyecto: o.partida_proy,
      subjurisdiccion: '0',
      subparcial: '0',
      subprograma: '0',
      ubicacionGeografica: o.partida_ubg,
      idimput: '0'
    };
    
    $http.post('/api/consulta-sigaf', consulta)
    .success(function (r) {
      $scope.sigaf = r;
    });
  }, true);
}).directive('funcionHitos', funcionHitos);
function funcionHitos(){
    return {
        restrict: 'E',
        // locals: {
        //     'title': '@title',
        //     'tristate': '@tristate',
        //     'read-only': '@read-only'
        // },
        compile: function(element, attrs) {
            //var readonly = attrs.readOnly;
            if(attrs.tipo == 'listado'){
                var htmlText='<form class="form-inline">'
                    +'<legend>Hitos'
                    +    '<a class="btn btn-link pull-right" ng-show="obra.' + attrs.donde + '.length > 3" ng-click="mostrar = (mostrar == -3 ? 100 : -3)"><i class="icon-align-justify"></i></a>'
                    +'</legend>'
                    +'<div ng-repeat="o in obra.' + attrs.donde + ' | limitTo: mostrar">'
                    +    '<a href="#" class="pull-right" style="margin-right: 10px;" ng-show="hasPermission(\'obras.administrador\') && editando" ng-click="eliminarListaElem(o, obra.' + attrs.donde + ')"><i class="icon-trash"></i></a>'
                    +    '<label style="margin-right:5px">Fecha planificación:<br>'
                    +        '<input disabled class="span2" type="text" date ng-model="o.fecha" placeholder="Fecha planificación"/>'
                    +    '</label>'
                    +    '<label style="margin-right:5px">Fuente informante:<br>'
                    +        '<input class="span2" type="text" value="{{contactoPorId(o.fuente).apellidos}} {{contactoPorId(o.fuente).nombre}}" ng-disabled="true"/>'
                    +    '</label>'
                    +    '<label style="margin-right:5px">Fecha del actuado:<br>'
                    +        '<input disabled class="span2" type="text" date ng-model="o.fechaActuado" placeholder="Fecha del actuado"/>'
                    +    '</label>'
                    +    '<label style="margin-right:5px">Actuado:<br>'
                    +        '<input disabled class="span2" type="text" ng-model="o.actuado" placeholder="Actuado"/>'
                    +    '</label>'
                    +    '<label style="margin-right:5px">Codigo:<br>'
                    +        '<input disabled class="span2" type="text" ng-model="o.codigo" placeholder="Codigo"/>'
                    +    '</label>'
                    +    '<button ng-disabled="!editando" ng-class="{\'btn-info active\': o.cuenta}" ng-click="o.cuenta = !o.cuenta" type="button" class="btn">Cuenta</button>'
                    +    '<div>Comentarios:<br />'
                    +        '<textarea disabled rows="3" style="width:95%" type="text" ng-model="o.comentario"/>'
                    +    '</div>'
                    +    '<button style="margin-top: 10px;margin-right:5px" ng-disabled="!editando" ng-if="obra.' + attrs.donde + '[obra.' + attrs.donde + '.length-1].fecha === o.fecha && !obra.' + attrs.donde + '[obra.' + attrs.donde + '.length-1].cumplido && !obra.' + attrs.donde + '[obra.' + attrs.donde + '.length-1].cancelado" ng-class="{\'btn-info active\': o.nuevaFecha}" ng-click="o.nuevaFecha = !o.nuevaFecha" type="button" class="btn">Nueva fecha</button>'
                    +    '<button style="margin-top: 10px;margin-right:5px" ng-disabled="!editando" ng-if="obra.' + attrs.donde + '[obra.' + attrs.donde + '.length-1].fecha === o.fecha && !o.nuevaFecha" ng-hide="obra.' + attrs.donde + '[obra.' + attrs.donde + '.length-1].cancelado" ng-class="{\'btn-info active\': o.cumplido}" ng-click="o.cumplido = !o.cumplido" type="button" class="btn">Cumplido</button>'
                    +    '<button style="margin-top: 10px" ng-disabled="!editando" ng-show="!obra.' + attrs.donde + '[obra.' + attrs.donde + '.length-1].cumplido" ng-if="obra.' + attrs.donde + '[obra.' + attrs.donde + '.length-1].fecha === o.fecha && !o.nuevaFecha" ng-class="{\'btn-info active\': o.cancelado}" ng-click="o.cancelado = !o.cancelado" type="button" class="btn">Cancelado</button>'
                    +    '<hr ng-hide="$last">'
                    +'</div>'
                +'</form>';
            }
            if(attrs.tipo == 'cumplido'){
                var htmlText='<form class="form-inline">'
                +    '<legend>Cumplido</legend>'
                +    '<div ng-repeat="o in obra.' + attrs.donde + ' | limitTo:-1">'
                +        '<label>Fecha de confirmación:<br>'
                +            '<input ng-disabled="!editando" date class="span2" type="text" placeholder="Fecha de confirmación" ng-model="o.fechaOk"/>'
                +        '</label>'
                +        '<label style="margin-left:5px" ng-show="editando">Fuente informante:<br>'
                +            '<select ui-select2 type="text" ng-model="o.fuenteCumplido" ng-options="i._id as i.apellidos + \' \' + i.nombre for i in contactos | orderBy:\'apellidos\' ">'
                +                '<option value="">{{contactoPorId(dataProyectos.fuente).apellidos}} {{contactoPorId(dataProyectos.fuente).nombre}}</option>'
                +            '</select>'
                +       '</label>'
                +        '<label style="margin-left:5px" ng-show="!editando">Fuente informante:<br>'
                +            '<input ng-disabled="!editando" class="span2" type="text" value="{{contactoPorId(o.fuenteCumplido).apellidos}} {{contactoPorId(o.fuenteCumplido).nombre}}"/>'
                +        '</label>'
                +        '<label style="margin-left:5px">Fecha del actuado:<br>'
                +            '<input ng-disabled="!editando" date type="text" placeholder="Fecha del actuado" ng-model="o.fechaActuadoCumplido"/>'
                +        '</label>'
                +        '<label style="margin-left:5px">Actuado:<br>'
                +            '<input ng-disabled="!editando" type="text" placeholder="Actuado" ng-model="o.actuadoCumplido"/>'
                +        '</label>'
                +        '<label style="margin-left:5px">Codigo:<br>'
                +            '<input ng-disabled="!editando" type="text" placeholder="Codigo" ng-model="o.codigoCumplido"/>'
                +        '</label>'
                +        '<div style="margin-bottom:5px">Comentarios:<br/>'
                +            '<textarea ng-disabled="!editando" rows="3" style="width:95%" type="text" ng-model="o.comentarioCumplido"/>'
                +        '</div>'
                +        '<label>Proveedor<br>'
                +            '<a ng-disabled="!editando" class="btn" ng-class="(o.intExtCum == \'int\') && \'active btn-info\'" ng-click="o.intExtCum=\'int\'">Int</a>'
                +            '<a ng-disabled="!editando" class="btn" ng-class="(o.intExtCum == \'ext\') && \'active btn-info\'" ng-click="o.intExtCum=\'ext\'">Ext</a>'
                +            '<span ng-show="editando && o.intExtCum == \'int\'" class="input-append control-group" style="margin-bottom: 0px; margin-left: 5px">'
                +                '<select ui-select2 type="text" ng-model="o.proveedor" ng-options="i._id as i.apellidos + \' \' + i.nombre for i in contactos | orderBy:\'apellidos\'">'
                +                    '<option value="">{{contactoPorId(dataProyectos.proveedor).apellidos}} {{contactoPorId(dataProyectos.proveedor).nombre}}</option>'
                +                '</select>'
                +            '</span>'
                +            '<span ng-show="editando && o.intExtCum == \'ext\'" class="input-append control-group" style="margin-bottom: 0px; margin-left: 5px">aa'
                +                '<select ui-select2 type="text" ng-model="o.proveedor" ng-options="i._id as i.nombre for i in proveedores">'
                +                    '<option value="">{{contactoPorId(dataProyectos.proveedor).apellidos}} {{contactoPorId(dataProyectos.proveedor).nombre}}</option>'
                +                '</select>'
                +            '</span>'
                +        '</label>'
                +        '<label style="margin-left:5px" ng-show="!editando && o.intExtCum== \'int\'" ng-repeat="o in obra.' + attrs.donde + ' | limitTo:-1">'
                +            '<input disabled ng-show="!editando" class="span3" type="text" value="{{contactoPorId(o.proveedor).apellidos}} {{contactoPorId(o.proveedor).nombre}}" placeholder="Proveedor"/>'
                +        '</label>'
                +        '<label style="margin-left:5px" ng-show="!editando && o.intExtCum== \'ext\'" ng-repeat="o in obra.' + attrs.donde + ' | limitTo:-1">'
                +            '<input disabled ng-show="!editando" class="span3" type="text" value="{{proveedorPorId(o.proveedor).nombre}}" placeholder="Proveedor"/>'
                +        '</label>'
                /*+        '<label style="margin-left:5px" ng-show="editando">'
                +            '<select ui-select2 type="text" ng-model="o.proveedor" ng-options="i._id as i.apellidos + \' \' + i.nombre for i in contactos | orderBy:\'apellidos\'">'
                +                '<option value="">{{contactoPorId(dataProyectos.fuente).apellidos}} {{contactoPorId(dataProyectos.fuente).nombre}}</option>'
                +            '</select>'
                +        '</label>'*/
                +    '</div>';
            }
            if(attrs.tipo == 'imgDoc'){
                var htmlText='<form>'
                +    '<div class="span5" style="margin-left: 70px">'
                +        '<h4>Imágenes'
                +            '<div class="card-actions pull-right" style="margin:0; padding:0">'
                +                   '<a class="btn btn-link" ng-click="' + attrs.botonimg + '" ng-if="editando"><i class="icon-plus"></i></a>'
                // +                '<a class="btn btn-link" ng-click="agregarImagenes(\'\',' + attrs.donde + ',false,' + attrs.imgdonde + ')" ng-if="editando"><i class="icon-plus"></i></a>'
                +            '</div>'
                +        '</h4>'
                +        '<div ng-if="!' + attrs.donde + '.length">No se ha cargado ninguna imagen aún</div>'
                +        '<a ng-repeat="f in ' + attrs.donde + '" data-toggle="modal" ng-click="abrirModalImagen(f)" href="" class="thumbnail" style="display:inline-block">'
                +            '<img align="center" src="/file/{{f.fotoId}}" width="128" height="96"><i href="#" ng-show="editando" class="icon-trash" ng-click="eliminarListaElem(f,' + attrs.donde + ')"></i>'
                +        '</a>'
                +    '</div>'
                    
                +    '<div class="span5" style="margin-left: 70px;">'
                +        '<h4>Documentos'
                +            '<div class="card-actions pull-right">'
                +                '<a class="btn btn-link" ng-click="' + attrs.botondoc + '" ng-if="editando"><i class="icon-plus"></i></a>'
                +            '</div>'
                +        '</h4>'
                +        '<div ng-if="!' + attrs.docdonde + '.length">No se ha cargado ningun documento aún</div>'
                +        '<div ng-repeat="d in ' + attrs.docdonde + '">'
                +            '<a data-toggle="modal" ng-click="abrirModal(\'#documentosP_{{$index}}\')" href="">{{d.nombre}}</a> (<a href="/file/{{d.archivoId}}" target="_blank">Descargar</a>)<br>'
                +        '</div>'
                +        '<div ng-repeat="d in ' + attrs.docdonde + '" id="documentosP_{{$index}}" class="modal hide fade" tabindex="-1" role="dialog" aria-hidden="true">'
                +            '<div class=\'modal-header\'>'
                +                '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>'
                +            '</div>'
                +            '<div class=\'modal-content\'>'
                +                '<span> Nombre:<br /> '
                +                    '<input class="span4" type="text" placeholder="Nombre del documento" ng-disabled="true" ng-model="d.nombre" />'
                +                '</span>'
                +                '<span> Fecha:<br /> '
                +                    '<input class="span2" type="text" date placeholder="Fecha" ng-disabled="true" ng-model="d.fecha" />'
                +               '</span>'
                +                '<span> Version:<br /> '
                +                    '<input class="span2" type="text" placeholder="Version del documento" ng-disabled="true" ng-model="d.version" />'
                +                '</span>'
                +                '<span> Fuente:<br />' 
                +                    '<div class="input-append">'
                +                        '<input class="span3" type="text" placeholder="Fuente del documento" ng-disabled="true" value="{{contactoPorId(d.fuente).apellidos}} {{contactoPorId(d.fuente).nombre}}" />'
                +                    '</div>'
                +                '</span>'
                +                '<span> Tipo:<br /> '
                +                    '<input class="span2" type="text" placeholder="DOC, XLS, PPT, etc" ng-disabled="true" ng-model="d.tipo" />'
                +                '</span>'
                +                '<span> Autor:<br /> '
                +                    '<input class="span4" type="text" placeholder="Autor del documento" ng-disabled="true" ng-model="d.autor" />'
                +                '</span>'
                +                '<span> Tags:<br /> '
                +                    '<input class="span5" type="text" placeholder="Separados por coma" ng-disabled="true" ng-model="d.tags" />'
                +                '</span>'
                +                '<span> Descripción:<br /> '
                +                    '<textarea style="height:80px; width:530px" placeholder="Descripción del documento" type="text" ng-disabled="true" ng-model="d.descripcion" />'
                +                '</span>'
                +            '</div>'
                +        '</div>'
                +    '</div>'
                +'</form>';
            }
            if(attrs.tipo == 'cancelado'){
                var htmlText='<form class="form-inline">'
                +    '<legend>Cancelado</legend>'
                +    '<div ng-repeat="o in obra.' + attrs.donde + ' | limitTo:-1">'
                +        '<label>Fecha de cancelación:<br>'
                +            '<input ng-disabled="!editando" date class="span2" type="text" placeholder="Fecha de cancelación" ng-model="o.fechaCancelacion"/>'
                +        '</label>'
                +        '<span style="margin-left:5px" ng-show="editando">'
                +            '<label>Fuente informante<br>'
                +                '<select ui-select2 type="text" ng-model="o.fuenteCancelado" ng-options="i._id as i.apellidos + \' \' + i.nombre for i in contactos | orderBy:\'apellidos\'">'
                +                    '<option value="">{{contactoPorId(dataProyectos.fuente).apellidos}} {{contactoPorId(dataProyectos.fuente).nombre}}</option>'
                +                '</select>'
                +            '</label>'
                +        '</span>'
                +        '<label style="margin-left:5px">Fecha del actuado:<br>'
                +            '<input ng-disabled="!editando" date class="span2" type="text" placeholder="Fecha del actuado" ng-model="o.fechaCanceladoActuado"/>'
                +        '</label>'
                +        '<label style="margin-left:5px">Actuado:<br>'
                +            '<input ng-disabled="!editando" type="text" placeholder="Actuado" ng-model="o.canceladoActuado"/>'
                +        '</label>'
                +        '<label style="margin-left:5px">Codigo:<br>'
                +            '<input ng-disabled="!editando" type="text" placeholder="Codigo" ng-model="o.canceladoCodigo"/>'
                +        '</label>'
                +        '<div>Comentarios:<br />'
                +            '<textarea ng-disabled="!editando" rows="3" style="width:95%" type="text" ng-model="o.comentarioCancelado"/>'
                +        '</div>'
                
                +       '<label>Proveedor<br>'
                +            '<a ng-disabled="!editando" class="btn" ng-class="(o.intExt == \'int\') && \'active btn-info\'" ng-click="o.intExt=\'int\'">Int</a>'
                +            '<a ng-disabled="!editando" class="btn" ng-class="(o.intExt == \'ext\') && \'active btn-info\'" ng-click="o.intExt=\'ext\'">Ext</a>'
                +            '<span ng-show="editando && o.intExt == \'int\'" class="input-append control-group" style="margin-bottom: 0px; margin-left: 5px">'
                +                '<select ui-select2 type="text" ng-model="o.proveedor" ng-options="i._id as i.apellidos + \' \' + i.nombre for i in contactos | orderBy:\'apellidos\'">'
                +                    '<option value="">{{contactoPorId(dataProyectos.proveedor).apellidos}} {{contactoPorId(dataProyectos.proveedor).nombre}}</option>'
                +                '</select>'
                +            '</span>'
                +            '<span ng-show="editando && o.intExt == \'ext\'" class="input-append control-group" style="margin-bottom: 0px; margin-left: 5px">aa'
                +                '<select ui-select2 type="text" ng-model="o.proveedor" ng-options="i._id as i.nombre for i in proveedores">'
                +                    '<option value="">{{contactoPorId(dataProyectos.proveedor).apellidos}} {{contactoPorId(dataProyectos.proveedor).nombre}}</option>'
                +                '</select>'
                +            '</span>'
                +        '</label>'
                +        '<label style="margin-left:5px" ng-show="!editando && o.intExt== \'int\'" ng-repeat="o in obra.' + attrs.donde + ' | limitTo:-1">'
                +            '<input disabled ng-show="!editando" class="span3" type="text" value="{{contactoPorId(o.proveedor).apellidos}} {{contactoPorId(o.proveedor).nombre}}" placeholder="Proveedor"/>'
                +        '</label>'
                +        '<label style="margin-left:5px" ng-show="!editando && o.intExt== \'ext\'" ng-repeat="o in obra.' + attrs.donde + ' | limitTo:-1">'
                +            '<input disabled ng-show="!editando" class="span3" type="text" value="{{proveedorPorId(o.proveedor).nombre}}" placeholder="Proveedor"/>'
                +        '</label>'
                /*+        '<label>Proveedor<br>'
                +            '<a ng-disabled="!editando" class="btn" ng-class="(o.intExt == \'int\') && \'active btn-info\'" ng-click="o.intExt=\'int\'">Int</a>'
                +            '<a ng-disabled="!editando" class="btn" ng-class="(o.intExt == \'ext\') && \'active btn-info\'" ng-click="o.intExt=\'ext\'">Ext</a>'
                +            '<label ng-show="editando && dataProyectos.intExt == \'int\'" class="input-append control-group" style="margin-bottom: 0px; margin-left: 5px">'
                +                '<select ui-select2 type="text" ng-model="o.proveedor" ng-options="i._id as i.apellidos + \' \' + i.nombre for i in contactos | orderBy:\'apellidos\'">'
                +                    '<option value="">{{contactoPorId(dataProyectos.proveedor).apellidos}} {{contactoPorId(dataProyectos.proveedor).nombre}}</option>'
                +                '</select>'
                +            '</label>'
                +        '</label>'
                +        '<label ng-show="!editando" style="margin-left:5px" ng-repeat="o in obra.' + attrs.donde + ' | limitTo:-1">'
                +            '<input disabled ng-show="!editando" class="span3" type="text" value="{{contactoPorId(o.proveedor).apellidos}} {{contactoPorId(o.proveedor).nombre}}" placeholder="Proveedor"/>'
                +        '</label>'
                +        '<label ng-show="editando" style="margin-left:5px">'
                +            '<select ui-select2 type="text" ng-model="o.proveedor" ng-options="i._id as i.apellidos + \' \' + i.nombre for i in contactos | orderBy:\'apellidos\'">'
                +                '<option value="">{{contactoPorId(dataProyectos.fuente).apellidos}} {{contactoPorId(dataProyectos.fuente).nombre}}</option>'
                +            '</select>'
                +        '</label>'
                +    '</div>'*/
                +'</form>';
            }
            if(attrs.tipo == 'nuevaFecha'){
                var htmlText = 
                '<form class="form-inline">'
                +    '<div ng-show="editando">'
                +        '<label>Fecha planificación:<br>'
                +            '<input class="span2" type="text" date ng-model="' + attrs.donde + '.fecha" placeholder="Fecha planificación"/>'
                +        '</label>'
                +        '<label style="margin-left:5px">Fuente informante:<br>'
                +            '<select style="width:180px" ui-select2 type="text" ng-model="' + attrs.donde + '.fuente" ng-options="i._id as i.apellidos + \' \' + i.nombre for i in contactos | orderBy:\'apellidos\'">'
                +                '<option value="">{{contactoPorId(' + attrs.donde + '.fuente).apellidos}} {{contactoPorId(' + attrs.donde + '.fuente).nombre}}</option>'
                +            '</select>'
                +        '</label>'
                +        '<label style="margin-left:5px">Fecha del actuado:<br>'
                +            '<input date type="text" placeholder="Fecha del actuado" ng-model="' + attrs.donde + '.fechaActuado"/>'
                +        '</label>'
                +        '<label style="margin-left:5px">Actuado:<br>'
                +            '<input type="text" placeholder="Actuado" ng-model="' + attrs.donde + '.actuado"/>'
                +        '</label>'
                +        '<label style="margin-left:5px">Codigo:<br>'
                +            '<input class="span2" type="text" placeholder="Codigo" ng-model="' + attrs.donde + '.codigo"/>'
                +        '</label>'
                +        '<label style="margin-left:5px"><br>'
                +            '<a ng-class="{\'btn-info active\': ' + attrs.donde + '.cuenta}" ng-click="' + attrs.donde + '.cuenta = !' + attrs.donde + '.cuenta" type="button" class="btn">Cuenta</a>'
                +        '</label>'
                +        '<label style="margin-left:5px"><br>'
                +            '<a class="btn btn-link" data-placement="bottom" ng-click="' + attrs.valor + '"><i class="icon-plus"></i></a>'
                +        '</label>'
                +        '<div>Comentarios:<br />'
                +            '<textarea rows="3" style="width:95%" type="text" ng-model="' + attrs.donde + '.comentario"/>'
                +        '</div>'
                +    '</div>'
                +'</form>';
            }
            if(attrs.tipo == 'nuevoRelevamiento'){
                var htmlText = 
                '<div>'
                +    '<div class="card-actions pull-right" style="margin: 0; padding: 0">'
                +        '<button ng-show="editando" class="btn btn-link" data-placement="bottom" style="margin-bottom: 10px;" ng-click="' + attrs.valor + ';mostrarNuevoRel=false"><i class="icon-ok"></i></button>'
                +    '</div>'
                +    '<div class="input-prepend control-group">'
                +        '<label style="span2; margin-bottom: 0px">Fecha de relevamiento:</label>'
                +        '<input ng-disabled="!editando" date class="span2" type="text" placeholder="Fecha de confirmación" ng-model="' + attrs.datarel + '.fechaOkIniRel"/>'
                +    '</div>'
                +    '<span style="margin-left:5px" class="input-append control-group">'
                +        '<label style="margin-bottom: 1px;">Relevamiento:</label>'
                +        '<select ng-disabled="!editando" ui-select2 type="text" ng-model="' + attrs.datarel + '.relevamiento">'
                +            '<option value=""></option>'
                +            '<option value="Nunca se va a relevar">Nunca se va a relevar</option>'
                +            '<option value="Relevado concuerda">Relevado concuerda</option>'
                +            '<option value="Relevado no concuerda">Relevado no concuerda</option>'
                +            '<option value="No relevado">No relevado</option>'
                +        '</select>'
                +    '</span>'
                +    '<br>'
                +    '<div>Comentarios:<br />'
                +        '<textarea ng-disabled="!editando" rows="3" style="width:95%" type="text" ng-model="' + attrs.datarel + '.observacionesRelevamiento"/>'
                +    '</div>'
                +'</div>';
            }
            if(attrs.tipo == 'listadoRelevamientos'){
                var htmlText =
                '<legend ng-show="obra.' + attrs.donde + '.length > 0">Relevamientos'
                +   '<button ng-show="editando && !mostrarNuevoRel" class="btn btn-link pull-right" ng-click="mostrarNuevoRel = true"><i class="icon-plus"></i></button>'
                +   '<a class="btn btn-link pull-right" ng-show="obra.' + attrs.donde + '.length > 3" ng-click="mostrarRel = (mostrarRel == -3 ? 100 : -3)"><i class="icon-align-justify"></i></a>'
                +   '<a class="btn btn-link pull-right" ng-show="checkRelevamiento(' + '\'' + attrs.donde + '\'' + ')" ng-click="buscarRelevamientos(' + '\'' + attrs.donde + '\'' + ')"><i class="icon-eye-open"></i></a>'
                +'</legend>'
                +'<div ng-if="!obra.' + attrs.donde + '.length">No se ha cargado ningun relevamiento aún</div>'
                +'<form class="form-inline">'
                +    '<div ng-repeat="o in obra.' + attrs.donde + ' | limitTo: mostrarRel">'
                //+       '<a href="#" class="pull-right" style="margin-right: 10px;" ng-show="hasPermission(\'obras.administrador\') && editando" ng-click="eliminarListaElem(o, obra.' + attrs.donde + ')"><i class="icon-trash"></i></a>'
                +        '<label>Fecha de confirmación:<br>'
                +            '<input disabled date class="span2" type="text" placeholder="Fecha de confirmación" ng-model="o.fechaOkIniRel"/>'
                +        '</label>'
                +        '<label style="margin-left: 5px;">Relevamiento::</br>'
                +            '<select disabled ui-select2 type="text" ng-model="o.relevamiento">'
                +                '<option value=""></option>'
                +                '<option value="Nunca se va a relevar">Nunca se va a relevar</option>'
                +                '<option value="Relevado concuerda">Relevado concuerda</option>'
                +                '<option value="Relevado no concuerda">Relevado no concuerda</option>'
                +                '<option value="No relevado">No relevado</option>'
                +            '</select>'
                +        '</label>'
                +        '<div>Comentarios:<br />'
                +            '<textarea disabled rows="3" style="width:95%" type="text" ng-model="o.observacionesRelevamiento"/>'
                +        '</div>'
                +        '<hr>'
                +    '</div>'
                +'</form>';
            }
            element.replaceWith(htmlText);
        }
    };
}