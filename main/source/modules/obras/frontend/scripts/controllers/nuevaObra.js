angular.module('bag2.obras').controller('NuevaObraCtrl', function($scope, Contactos, EstadoIniciativa, $modal, CriticidadIniciativa, SegmentoEtarioIniciativa, AlcanceIniciativa, RelevanciaIniciativa, ORMOrganigrama, ImpactoIniciativa, GrupoIniciativa, TipoObra, Comuna, $location, Iniciativa, OrdenObra, ORMTema, Obras2,SubtiposObra) {
    $scope.tab = 'identificacion';
    $scope.obra = new Obras2();
    
    $scope.$watch('obra.vieneDeIniciativa', function() {
        //Si la obra viene de una iniciativa
        if($scope.obra.vieneDeIniciativa == 'si'){
            $scope.$watch('obra.iniciativaRelacionada', function(id) {
                id && ($scope.iniciativa = Iniciativa.get({_id: $scope.obra.iniciativaRelacionada}, function () {
                    angular.extend($scope.obra, {
                        //Identificacion
                        nombre: $scope.iniciativa.nombre,
                        nombre_largo: $scope.iniciativa.nombre_largo,
                        etapa: $scope.iniciativa.etapa,
                        siglas: $scope.iniciativa.siglas,
                        ref_mapa: $scope.iniciativa.ref_mapa,
                        plan: $scope.iniciativa.plan,
                        jurisdiccion: $scope.iniciativa.jurisdiccion2 || "aaaa",
                        dependencia: $scope.iniciativa.dependencia2,
                        legislativo: $scope.iniciativa.legislativo,
                        expediente: $scope.iniciativa.expediente,
                        codigo_anterior: $scope.iniciativa.codigo_anterior,
                        //Ubicacion
                        calle: $scope.iniciativa.calle,
                        altura: $scope.iniciativa.altura,
                        cruce: $scope.iniciativa.cruce,
                        seccion: $scope.iniciativa.seccion,
                        manzana: $scope.iniciativa.manzana,
                        parcela: $scope.iniciativa.parcela,
                        unidad_funcional: $scope.iniciativa.unidad_funcional,
                        barrio: $scope.iniciativa.barrio,
                        comuna: $scope.iniciativa.comuna,
                        provincia: $scope.iniciativa.provincia,
                        pais: $scope.iniciativa.pais,
                        codigo_postal: $scope.iniciativa.codigo_postal,
                        coordenadas: $scope.iniciativa.coordenadas,
                        partida_matriz: $scope.iniciativa.partida_matriz,
                        utiu: $scope.iniciativa.utiu,
                        region_sanitaria: $scope.iniciativa.region_sanitaria,
                        distrito_escolar: $scope.iniciativa.distrito_escolar,
                        comisaria_pm: $scope.iniciativa.comisaria_pm,
                        //Clasificacion
                        grupo: $scope.iniciativa.grupo || "",
                        clase: $scope.iniciativa.clase || "",
                        tipo: $scope.iniciativa.tipo || "",
                        impacto: $scope.iniciativa.impacto,
                        //Alcance
                        orden1: $scope.iniciativa.orden1 || "",
                        orden2: $scope.iniciativa.orden2,
                        iniciosRel:[{"relevamiento":"No relevado"}],
                        //Estado
                        estado: $scope.iniciativa.estado || "",
                        comentariosEstado: $scope.iniciativa.comentariosEstado,
                        fotosEstado: $scope.iniciativa.fotosEstado || [],
                        documentosEstado: $scope.iniciativa.documentosEstado,
                        referente: $scope.iniciativa.referente,
                        plazo_completo: $scope.iniciativa.plazo_completo,
                        relevancia: $scope.iniciativa.relevancia, //|| "51f2b9d4f57298cde62687ed",
                        criticidad: $scope.iniciativa.criticidad,
                        alcance: $scope.iniciativa.alcance,
                        segmento_etario: $scope.iniciativa.segmento_etario,
                        ciudadanos: $scope.iniciativa.ciudadanos,
                        metros: $scope.iniciativa.metros,
                        //Comunicacion
                        inaugurable: $scope.iniciativa.inaugurable,
                        visitable: $scope.iniciativa.visitable,
                        comunicable: $scope.iniciativa.comunicable,
                        fec_inicio: $scope.iniciativa.fec_inicio,
                        fec_fin: $scope.iniciativa.fec_fin,
                        fec_inauguracion: $scope.iniciativa.fec_inauguracion,
                        direccionesMapa: $scope.iniciativa.direccionesMapa,
                        nombrar: $scope.iniciativa.nombrar,
                        presupuestoSigaf: $scope.iniciativa.presupuestoSigaf,
                        descripcionesAlcance: $scope.iniciativa.descripcionesPropuesta,
                        detallesComunicacion: $scope.iniciativa.detallesComunicacion,
                        ubicacionesComunicacion: $scope.iniciativa.ubicacionesComunicacion,
                        relevadorAsignado:""
                    });
                    $scope.guardarDeIni();
                }));
            });
        }else{
            //Si la obra no viene de una iniciativa creo una nueva
            $scope.obra = new Obras2({
                fotos: [],
                pais: "Argentina",
                provincia: "Ciudad Autónoma de Buenos Aires",
                proyectos: [],
                contratos: [],
                inicios:[],
                iniciosRel:[{"relevamiento":"No relevado"}],
                duracion:[],
                comuna:[],
                final:[],
                grupo:"",
                clase:"",
                tipo:"",
                subtipo:"",
                estado:"",
                relevancia:"",
                fisico:[],
                financiero:[],
                objetivo:[],
                nombrar:[],
                jurisdiccion:"",
                presupuestoSigaf:[],
                finalRel:[],
                orden1:"",
                fotosAlcance: [],
                fotosEstado: [],
                documentosAlcance: [],
                relevadorAsignado:""
            });
        }
    });
    
    $scope.editando = true;//Usado solo para los factories de carga de imagen y documentos
    
    //QUERYS-----------------------------------------------
    //$scope.subtipos = SubtiposObra.query();
    $scope.subtiposOtro = SubtiposObra.get({'_id': '56faf4e2c2fa86173c451ef8'});
    $scope.iniciativas = Iniciativa.query();
    $scope.comunas = Comuna.query();
    $scope.estados = EstadoIniciativa.query({obra : true});
    $scope.tipos = TipoObra.query();
    $scope.grupos = GrupoIniciativa.query();
    $scope.impactos = ImpactoIniciativa.query();
    $scope.alcances = AlcanceIniciativa.query();
    $scope.relevancias = RelevanciaIniciativa.query();
    $scope.segmentos = SegmentoEtarioIniciativa.query();
    $scope.criticidades = CriticidadIniciativa.query();
    $scope.organigrama = ORMOrganigrama.list();
    $scope.contactos = Contactos.listar();
    $scope.ordenes = OrdenObra.query();
    $scope.temas = ORMTema.query();
    
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
    
    //SELECTS-----------------------------------------------
    // $scope.tipoPorId = function (id) {
    //     for (var i = 0; i < $scope.tipos.length; i++) {
    //         if ($scope.tipos[i]._id == id){
    //             return $scope.tipos[i];
    //         }
    //     }
    // };
    
    $scope.iniciativaPorId = function (id) {
        for (var i = 0; i < $scope.iniciativas.length; i++) {
            if ($scope.iniciativas[i]._id == id){
                return $scope.iniciativas[i];
            }
        }
    };
    
    $scope.dataDire = {
        calle: '',
        calle2: '',
        altura: '',
        altura2: '',
        cruce: '',
        cruce2: ''
    };
    
    function includeByNombre(arr, obj) {
        for (var i = 0; i < arr.length; i++) {
            //alert(arr[i].nombre, " - ", obj);
            if (arr[i].nombre == obj) return true;
        }
    }
    
    $scope.$watch('obra.orden1', function (g) {
        $scope.ordenObra = OrdenObra.get({_id: g});
    });
    $scope.$watch('obra.inicios', function() {
        $scope.agregarDuracion($scope.obra.inicios[$scope.obra.inicios.length-1], $scope.obra.final[$scope.obra.final.length-1]);
    });
    $scope.$watch('obra.final', function() {
        $scope.agregarDuracion($scope.obra.inicios[$scope.obra.inicios.length-1], $scope.obra.final[$scope.obra.final.length-1]);
    });
    /*$scope.$watch('obra.tipo', function (g) {//Clase ahora es el tipo y tipo es el subtipo
        $scope.claseObra = TipoObra.get({_id: g});
    });*/
    /*$scope.$watch('obra.tipo', function(newValue) {
        if (!newValue) {
            return;
        }
        if ($scope.obra.tipo) {
            $scope.subtipos = SubtiposObra.query({'tipo': $scope.obra.tipo});
        }
    });*/
    
    $scope.$watch('obra.tipo', function(newValue) {
        if (!newValue) {
            return;
        }
        $scope.subtipos = SubtiposObra.query({
            'tipo': newValue
        });
    });
    
    /*$scope.$watch('obra.subtipo', function (g) {
        $scope.subtipoObra = SubtiposObra.get({_id: g});
    });*/
    
    $scope.reverse = function(array) {
        var copy = [].concat(array);
        return copy.reverse();
    };
    
    $scope.crearContacto = function(confirmado, contacto) {
        if (confirmado) {
            contacto.apellidos = (contacto.apellidos || '').toUpperCase();
            contacto.$save();
            $scope.contactos = Contactos.listar();
        }else {
            $modal({template: '/views/orm/modalNuevoContacto.html', persist: true, show: true, scope: $scope.$new()});
        }
    };
    
    $scope.agregarImagenes = function(datos,array,confirmado,donde){
        if(confirmado){
            datos.fotoId = $scope.uploaded.shift().id;
            array.push(datos);
        }else{
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
    
    $scope.agregarDocumentos = function(param,confirmado,data){
        if(param=='alcance'){
            if (confirmado) {
                data.archivoId = $scope.uploadedFile.shift().id;
                $scope.obra.documentosAlcance.push(data);
            }else {
                if ($scope.obra.documentosAlcance === undefined) {
                    $scope.obra.documentosAlcance = [];
                }
                var modalScope = $scope.$new();
                modalScope.datos = {
                    parametro:'alcance'
                };
                $modal({template: '/views/obras/modals/agregarDocumentos.html', persist: true, show: true, backdrop: 'static', scope: modalScope});
            }
        }
        if(param=='comunicacion'){
            if (confirmado) {
                data.archivoId = $scope.uploadedFile.shift().id;
                $scope.obra.documentos.push(data);
            }else {
                if ($scope.obra.documentos === undefined) {
                    $scope.obra.documentos = [];
                }
                modalScope = $scope.$new();
                modalScope.datos = {
                    parametro:'comunicacion'
                };
                $modal({template: '/views/obras/modals/agregarDocumentos.html', persist: true, show: true, backdrop: 'static', scope: modalScope});
            }
        }
        if(param=='estado'){
            if (confirmado) {
                data.archivoId = $scope.uploadedFile.shift().id;
                $scope.obra.documentosEstado.push(data);
            }else {
                if ($scope.obra.documentosEstado === undefined) {
                    $scope.obra.documentosEstado = [];
                }
                modalScope = $scope.$new();
                modalScope.datos = {
                    parametro:'estado'
                };
                $modal({template: '/views/obras/modals/agregarDocumentos.html', persist: true, show: true, backdrop: 'static', scope: modalScope});
            }
        }
    };
    
    $scope.agregarDetaComunicacion = function(confirmado, data) {
        if (confirmado) {
            $scope.obra.detallesComunicacion.push(data);
        }else {
            if (!$scope.obra.detallesComunicacion){
                $scope.obra.detallesComunicacion = [];
            }
            var modalScope = $scope.$new();
            modalScope.data = {
                detalle: '',
                quien: '',
                cuando:undefined
            };
            $modal({template: '/views/obras/modals/agregarDetalleComu.html', persist: true, show: true, backdrop: 'static', scope: modalScope});
        }
    };
    
    $scope.agregarUbiComunicacion = function(confirmado, data) {
        if (confirmado) {
            $scope.obra.ubicacionesComunicacion.push(data);
        }else {
            if (!$scope.obra.ubicacionesComunicacion){
                $scope.obra.ubicacionesComunicacion = [];
            }
            var modalScope = $scope.$new();
            if (!$scope.obra.altura){
                $scope.obra.altura = '';
            }
            var ubicacion = 'Dirección: \n' + $('#calle3-typeahead').val() + ' ' + $scope.obra.altura + ', cruce con ' + $('#cruce3-typeahead').val() + '. ';
            if ($scope.obra.direccionesMapa) {
                ubicacion = ubicacion + '\nMapa: \n';
                $scope.obra.direccionesMapa.forEach(function(item) {
                    ubicacion = ubicacion + 'De: ' + item.calle + ' ' + item.altura + ', cruce con ' + item.cruce + '; Hasta: ' + item.calle2 + ' ' + item.altura2 + ', cruce con ' + item.cruce2 + '. \n';
                });
            }
            modalScope.data = {
                detalle: ubicacion,
                quien: '',
                cuando:undefined
            };
            $modal({template: '/views/obras/modals/agregarUbicacionComu.html', persist: true, show: true, backdrop: 'static', scope: modalScope});
        }
    };
    
    $scope.uploaded= [];
    $scope.uploadedFile= [];
    
    $scope.agregarComuna = function(dataComuna) {
        if (!$scope.obra.comuna) {
            $scope.obra.comuna = [];
            $scope.agregarComuna();
        }else {
            $scope.obra.comuna.push(dataComuna.comuna);
        }
    };
    
    //Filtro de comunas que no muestra comunas ya agregadas.
    $scope.filtroComuna = function(c){
        return $scope.obra && $scope.obra.comuna && $scope.obra.comuna.indexOf(c._id) == -1;
    };
    
    $scope.agregarDireMapa = function(){
        if(!$scope.obra.direccionesMapa){
            $scope.obra.direccionesMapa = [];
        }
        $scope.dataDire.calle = $('#calle-typeahead').val();
        $scope.dataDire.calle2 = $('#calle2-typeahead').val();
        $scope.dataDire.cruce = $('#cruce-typeahead').val();
        $scope.dataDire.cruce2 = $('#cruce2-typeahead').val();
        $scope.obra.direccionesMapa.push($scope.dataDire);
        $scope.dataDire = {
            calle: '',
            calle2: '',
            altura: '',
            altura2: '',
            cruce: '',
            cruce2: ''
        };
    };
    
    $scope.agregarDescrAlcance = function(confirmado, data) {
        if (confirmado) {
            $scope.obra.descripcionesAlcance.push(data);
        }else {
            if (!$scope.obra.descripcionesAlcance){
                $scope.obra.descripcionesAlcance = [];
            }
            var modalScope = $scope.$new();
            modalScope.data = {
                descripcion: '',
                quien: '',
                cuando:undefined
            };
            $modal({template: '/views/obras/modals/agregarDescripcionAlc.html', persist: true, show: true, backdrop: 'static', scope: modalScope});
        }
    };
    
    $scope.agregarComEstado = function(confirmado, data) {
        if (confirmado) {
            $scope.obra.comentariosEstado.push(data);
        }else {
            if (!$scope.obra.comentariosEstado){
                $scope.obra.comentariosEstado = [];
            }
            var modalScope = $scope.$new();
            modalScope.data = {
                comentario: '',
                quien: '',
                cuando:undefined
            };
            $modal({template: '/views/obras/modals/agregarComentarioEst.html', persist: true, show: true, backdrop: 'static', scope: modalScope});
        }
    };
    
    $scope.abrirModal = function(idmodal) {
        $(idmodal).modal('show');
    };
    
    $scope.eliminarElemento = function(array,elemento) {
        var indice = array.indexOf(elemento);
        if(indice!=-1) array.splice(indice, 1);
    };
    
    $scope.guardarTime = function(data) {
        data.fechaAgregado = new Date().getTime();
        data.usuario = $scope.username;
    };
    
    //Guardar obra cuando viene de una iniciativa
    $scope.guardarDeIni = function() {
        $scope.guardarTime($scope.obra);
        $scope.obra.$save(function(data) {
            $location.path('/obras/' + $scope.obra._id);
        });
    };
    
    //Guardar nueva obra
    $scope.guardar = function() {
        $scope.guardarTime($scope.obra);
        // $scope.obra.calle = $('#calle3-typeahead').val();
        // $scope.obra.cruce = $('#cruce3-typeahead').val();
        $scope.obra.$save(function(data) {
            $location.path('/obras/' + $scope.obra._id);
        });
    };
    
    $scope.agregarDuracion = function (inicioPar, finalPar) {
        if (inicioPar) {
            if (inicioPar.fecha) {
                var inicio = new Date(moment(inicioPar.fecha, "DD/MM/YYYY").toJSON());
                inicio = inicio.getTime();
                if (finalPar) {
                    if (finalPar.fecha) {
                        var fin = new Date(moment(finalPar.fecha, "DD/MM/YYYY").toJSON());
                        fin = fin.getTime();
                        var duracion = fin - inicio;
                        $scope.dataDuracion = {
                            fecha: moment().format("DD/MM/YYYY"),
                            duracion: Math.round(((((duracion/1000)/60)/60)/24)/30) + " M"
                        };
                        $scope.obra.duracion.push($scope.dataDuracion);
                    }
                }
            }
        }
    };
    
    $scope.agregarObjetivo = function(dataObjetivo) {
        if(!$scope.dataObjetivo) {
            $scope.obra.dataObjetivo = [];
        }else{
            $scope.obra.objetivo.push($scope.dataObjetivo);
            $scope.dataObjetivo = {
                fecha: undefined,
            };
        }
    };
    
    $scope.agregarNombrar = function() {
        if(!$scope.obra.nombrar) {
            $scope.obra.nombrar = [];
        }
        $scope.obra.nombrar.push($scope.dataNombrar);
        $scope.dataNombrar = {
            fecha: undefined,
        };
    };
    
    $scope.agregarPSigaf = function(presupuestoSigaf) {
        if (!$scope.obra.presupuestoSigaf) {
            $scope.obra.presupuestoSigaf = [];
        }
        $scope.guardarTime(presupuestoSigaf);
        $scope.obra.presupuestoSigaf.push(presupuestoSigaf);
        $scope.presupuestoSigaf = {
            fecha: undefined,
        };
    };
    
    $scope.temaPorId = function (id) {
        for (var i = 0; i < $scope.temas.length; i++) {
            if ($scope.temas[i]._id == id){
                return $scope.temas[i];
            }
        }  
    };
    
    $scope.mostrarTema = function (r) {
        if (r.eliminado) {
            return false; 
        } else {
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
});