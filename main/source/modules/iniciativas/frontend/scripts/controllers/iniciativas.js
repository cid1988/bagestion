angular.module('bag2.iniciativas', []).controller('IniciativasCtrl', function($scope,Comuna,User,RelevanciaIniciativa,OrdenIniciativa,ORMOrganigrama,CriticidadIniciativa,ImpactoIniciativa,SegmentoEtarioIniciativa,AlcanceIniciativa,ClaseIniciativa,GrupoIniciativa,TipoIniciativa,Contactos,Funcionario,EstadoIniciativa,Jurisdiccion,$routeParams,Iniciativa,$location,IniciativaPlan) {
    
    $scope.comunasFiltradas = {};
    $scope.user2 = User.findByName({username: $scope.username});
    
    $scope.iniciativas = Iniciativa.query($routeParams,function(){
        $scope.listado = $scope.iniciativas;
        //FILTRO DE COMUNAS SEGUN PERMISO DE COMUNERO
        var user = User.findByName({username: $scope.username},function(){
            $scope.comunas = Comuna.query(function(){
                if(!$scope.hasPermission('iniciativas.comunero')) {
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
    
    $scope.filtroComunas = function (ini) {
        if ($scope.todasLasComunasEstanFiltradas()) {
            return true;
        }
        if(angular.isArray(ini.comuna)) {
            for (var i = 0; i < ini.comuna.length; i++){
                if ($scope.filtrandoComuna(ini.comuna[i])) {
                    return true;
                }else{
                    return false
                }
            }
        }
        return false;
    };
    
    //FILTRO PRIORIDAD
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
    
    //FILTROS
    $scope.filtroJurisdiccionComunero = function(organigrama){
        if(organigrama._id == $scope.user2.jurisdiccion || (organigrama._id == '52433a64295915d121000029')){
            return true;
        }else{
            return false;
        }
    };
    
    $scope.ordenes = OrdenIniciativa.query();
    
    $scope.puedeModificar = function() {
        return true;
    };
    
    $scope.fixEstado = function(){
        for(var i = 0; i < $scope.iniciativas.length; i++) {
            if($scope.iniciativas[i].estado){
                $scope.iniciativas[i].estado = $scope.iniciativas[i].estado._id;
                $scope.iniciativas[i].$save();
            }
        }
    };
    
    $scope.$on('print', function() {
        var result = $.param($routeParams);
        
        var outString = result;
        while (true) {
            var idx = outString.indexOf('+');
            if (idx == -1) {
              break;
            }
            outString = outString.substring(0, idx) + '%20' +
            outString.substring(idx + '+'.length);
        }
        $location.url('/iniciativas/print?' + outString);
    });
    
    $scope.jurisdicciones = Jurisdiccion.query();
    $scope.organigrama = ORMOrganigrama.query();
    $scope.funcionarios = Funcionario.query();
    $scope.clases = ClaseIniciativa.query();
    $scope.grupos = GrupoIniciativa.query();
    $scope.tipos = TipoIniciativa.query();
    $scope.impactos = ImpactoIniciativa.query();
    $scope.relevancias = RelevanciaIniciativa.query();
    $scope.criticidades = CriticidadIniciativa.query();
    $scope.alcances = AlcanceIniciativa.query();
    $scope.segmentosEtarios = SegmentoEtarioIniciativa.query();
    $scope.contactos = Contactos.listar();
    $scope.comunas = Comuna.query();    
    $scope.estados = EstadoIniciativa.query({obra : false});
    $scope.relevancias = RelevanciaIniciativa.query();
    //$scope.todos = Iniciativa.query();
    $scope.planes = IniciativaPlan.query();
    
    $scope.clasePorId = function (id) {
        for (var i = 0; i < $scope.clases.length; i++){
            if ($scope.clases[i]._id == id){
                return $scope.clases[i];
            }
        }
    };
    
    $scope.tipoPorId = function (id) {
      for (var i = 0; i < $scope.tipos.length; i++) {
          if ($scope.tipos[i]._id == id)
          {
              return $scope.tipos[i];
          }
      }  
    };
    
    $scope.relevanciaPorId = function (id) {
      for (var i = 0; i < $scope.relevancias.length; i++) {
          if ($scope.relevancias[i]._id == id)
          {
              return $scope.relevancias[i];
          }
      }  
    };
    
    $scope.alcancePorId = function (id) {
      for (var i = 0; i < $scope.alcances.length; i++) {
          if ($scope.alcances[i]._id == id)
          {
              return $scope.alcances[i];
          }
      }  
    };
    
    $scope.criticidadPorId = function (id) {
      for (var i = 0; i < $scope.criticidades.length; i++) {
          if ($scope.criticidades[i]._id == id)
          {
              return $scope.criticidades[i];
          }
      }  
    };
    
    $scope.segmentoPorId = function (id) {
      for (var i = 0; i < $scope.segmentosEtarios.length; i++) {
          if ($scope.segmentosEtarios[i]._id == id)
          {
              return $scope.segmentosEtarios[i];
          }
      }  
    };
    
    $scope.jurisdiccionPorId = function (id) {
      for (var i = 0; i < $scope.jurisdicciones.length; i++) {
          if ($scope.jurisdicciones[i]._id == id)
          {
              return $scope.jurisdicciones[i];
          }
      }  
    };
    
    $scope.reparticionPorId = function (id) {
      for (var i = 0; i < $scope.funcionarios.length; i++) {
          if ($scope.funcionarios[i]._id == id)
          {
              return $scope.funcionarios[i];
          }
      }  
    };
    
    $scope.impactoPorId = function (id) {
      for (var i = 0; i < $scope.impactos.length; i++) {
          if ($scope.impactos[i]._id == id)
          {
              return $scope.impactos[i];
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
    
    function findFirst(source, test) {
        for (var i = 0; i < source.length; i++) {
            if (test(source[i])) {
                return source[i];
            }
        }
        return null;
    }
    
    $scope.organigramaPorId = function (id) {
      for (var i = 0; i < $scope.organigrama.length; i++) {
          if ($scope.organigrama[i]._id == id)
          {
              return $scope.organigrama[i];
          }
      }  
    };
    
    $scope.planPorId = function(id){
        for (var i = 0; i < $scope.planes.length; i++) {
            if ($scope.planes[i]._id == id){
                return $scope.planes[i];
            }
        }
    };
    
    $scope.ordenar = function(e) {};
    
    $scope.color = function(comuna) {
        var color;
        $scope.comunas.forEach(function(com) {
            if (com.nombre === comuna) {
                color = com.color;
            }
        });
        return color;
    };
}).controller('NuevaIniciativaCtrl', function($scope, Contactos, EstadoIniciativa, $modal, CriticidadIniciativa, SegmentoEtarioIniciativa, FuenteFinanciacionIniciativa, AlcanceIniciativa, RelevanciaIniciativa, TipoIniciativa, ORMContacto, ImpactoIniciativa, GrupoIniciativa, Intervencion, ClaseIniciativa, $routeParams, Funcionario, Comuna, Jurisdiccion, Iniciativa, $location, ORMOrganigrama, ORMTema,IniciativaPlan) {
    $scope.iniciativa = new Iniciativa({
        fotos: [],
        descripciones: [],
        descripcionesPropuesta: [],
        geoms: [],
        comuna:[],
        pais: "Argentina",
        provincia: "Ciudad Autónoma de Buenos Aires",
        nombrar:[],
        grupo:"",
        jurisdiccion2:"",
        estado:"",
        plan:""
    });
    
    $scope.$watch('iniciativa.grupo', function (g) {
       if(g){
           $scope.grupoIniciativa = GrupoIniciativa.get({_id: g});
       }
    });
    // $scope.$watch('iniciativa.clase', function (g) {
    //   if (g) {
    //       $scope.claseIniciativa = ClaseIniciativa.get({_id: g});
    //   }
    // });
    $scope.$watch('iniciativa.clase', function(newValue) {
        if (!newValue) {
            return;
        }
        if ($scope.iniciativa.clase) {
            $scope.tipos = TipoIniciativa.query({'clase': $scope.iniciativa.clase});
        }
    });
    $scope.$watch('iniciativa.tipo', function (g) {
       if (g) {
           $scope.tipoIniciativa = TipoIniciativa.get({_id: g});
       }
    });
    $scope.$watch('iniciativa.impacto', function (g) {
       if (g) {
           $scope.impactoIniciativa = ImpactoIniciativa.get({_id: g});
       }
    });
    $scope.$watch('iniciativa.relevancia', function (g) {
       if (g) {
           $scope.relevanciaIniciativa = RelevanciaIniciativa.get({_id: g});
       }
    });
    $scope.$watch('iniciativa.criticidad', function (g) {
       if (g) {
           $scope.criticidadIniciativa = CriticidadIniciativa.get({_id: g});
       }
    });
    $scope.$watch('iniciativa.alcance', function (g) {
        if (g) {
           $scope.alcanceIniciativa = AlcanceIniciativa.get({_id: g});
       }
    });
    $scope.$watch('iniciativa.segmento_etario', function (g) {
       if (g) {
           $scope.segmentoEtarioIniciativa = SegmentoEtarioIniciativa.get({_id: g});
       }
    });
    
    $scope.comunas = Comuna.query();
    $scope.jurisdicciones = Jurisdiccion.query();
    // $scope.funcionarios = Funcionario.query();
    $scope.estados = EstadoIniciativa.query({obra : false});
    $scope.clases = ClaseIniciativa.query();
    $scope.grupos = GrupoIniciativa.query();
    $scope.impactos = ImpactoIniciativa.query();
    $scope.alcances = AlcanceIniciativa.query();
    $scope.relevancias = RelevanciaIniciativa.query();
    $scope.fuentes = FuenteFinanciacionIniciativa.query();
    $scope.segmentos = SegmentoEtarioIniciativa.query();
    $scope.criticidades = CriticidadIniciativa.query();
    $scope.organigrama = ORMOrganigrama.query();
    $scope.temas = ORMTema.query();
    $scope.contactos = Contactos.listar();
    $scope.planes = IniciativaPlan.query();
    $scope.intervenciones = Intervencion.query();
    
    $scope.contactoPorId = function (id) {
        for (var i = 0; i < $scope.contactos.length; i++) {
            if($scope.contactos[i]._id == id){
                return $scope.contactos[i];
            }
        }
    };
    
    $scope.comunaPorId = function (id) {
        for (var i = 0; i < $scope.comunas.length; i++) {
            if($scope.comunas[i]._id == id){
                return $scope.comunas[i];
            }
        }  
    };
    
    $scope.jurisdiccionPorId = function (id) {
      for (var i = 0; i < $scope.jurisdicciones.length; i++) {
          if ($scope.jurisdicciones[i]._id == id)
          {
              return $scope.jurisdicciones[i];
          }
      }  
    };
    
    $scope.reparticionPorId = function (id) {
      for (var i = 0; i < $scope.funcionarios.length; i++) {
          if ($scope.funcionarios[i]._id == id)
          {
              return $scope.funcionarios[i];
          }
      }  
    };
    
    $scope.organigramaPorId = function (id) {
      for (var i = 0; i < $scope.organigrama.length; i++) {
          if ($scope.organigrama[i]._id == id)
          {
              return $scope.organigrama[i];
          }
      }  
    };
    
    $scope.temaPorId = function (id) {
        for (var i = 0; i < $scope.temas.length; i++) {
            if ($scope.temas[i]._id == id){
                return $scope.temas[i];
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
    
    $scope.reverse = function(array) {
        var copy = [].concat(array);
        return copy.reverse();
    };
    
    $scope.crearContacto = function(confirmado, contacto) {
        if(confirmado){
            contacto.apellidos = (contacto.apellidos || '').toUpperCase();
            contacto.$save();
            $scope.contactos = Contactos.listar();
        }else{
            $modal({template: '/views/orm/modalNuevoContacto.html', persist: true, show: true, scope: $scope.$new()});
        }
    };
    
    $scope.agregarDetaComunicacion = function(confirmado, data) {
        if (confirmado) {
            $scope.iniciativa.detallesComunicacion.push(data);
        }else {
            if (!$scope.iniciativa.detallesComunicacion){
                $scope.iniciativa.detallesComunicacion = [];
            }
            var modalScope = $scope.$new();
            modalScope.data = {
                detalle: '',
                quien: '',
                cuando:undefined
            };
            $modal({template: '/views/iniciativas/modals/agregarDetalleComu.html', persist: true, show: true, backdrop: 'static', scope: modalScope});
        }
    };
    
    $scope.agregarUbiComunicacion = function(confirmado, data) {
        if (confirmado) {
            $scope.iniciativa.ubicacionesComunicacion.push(data);
        }else {
            if (!$scope.iniciativa.ubicacionesComunicacion){
                $scope.iniciativa.ubicacionesComunicacion = [];
            }
            var modalScope = $scope.$new();
            
            if (!$scope.iniciativa.altura){
                $scope.iniciativa.altura = '';
            }
            
            var ubicacion = 'Dirección: \n' + $('#calle3-typeahead').val() + ' ' + $scope.iniciativa.altura + ', cruce con ' + $('#cruce3-typeahead').val() + '. ';
            
            if ($scope.iniciativa.direccionesMapa) {
                ubicacion = ubicacion + '\nMapa: \n';
                $scope.iniciativa.direccionesMapa.forEach(function(item) {
                    ubicacion = ubicacion + 'De: ' + item.calle + ' ' + item.altura + ', cruce con ' + item.cruce + '; Hasta: ' + item.calle2 + ' ' + item.altura2 + ', cruce con ' + item.cruce2 + '. \n';
                });
            }
            
            modalScope.data = {
                detalle: ubicacion,
                quien: '',
                cuando:undefined
            };
            $modal({template: '/views/iniciativas/modals/agregarUbicacionComu.html', persist: true, show: true, backdrop: 'static', scope: modalScope});
        }
    };
    
    $scope.agregarDescrSolicitud = function(confirmado, data) {
        if (confirmado) {
            $scope.iniciativa.descripcionesSolicitud.push(data);
        }else {
            if (!$scope.iniciativa.descripcionesSolicitud){
                $scope.iniciativa.descripcionesSolicitud = [];
            }
            var modalScope = $scope.$new();
            
            modalScope.data = {
                descripcion: '',
                quien: '',
                cuando:undefined
            };
            $modal({template: '/views/iniciativas/modals/agregarDescripcionSoli.html', persist: true, show: true, backdrop: 'static', scope: modalScope});
        }
    };
    
    $scope.agregarDireMapa = function() {
        if (!$scope.iniciativa.direccionesMapa){
            $scope.iniciativa.direccionesMapa = [];
        }
        $scope.dataDire.calle = $('#calle-typeahead').val();
        $scope.dataDire.calle2 = $('#calle2-typeahead').val();
        $scope.dataDire.cruce = $('#cruce-typeahead').val();
        $scope.dataDire.cruce2 = $('#cruce2-typeahead').val();
        $scope.iniciativa.direccionesMapa.push($scope.dataDire);
        $scope.dataDire = {
            calle: '',
            calle2: '',
            altura: '',
            altura2: '',
            cruce: '',
            cruce2: ''
        };
    };
    
    $scope.agregarDescrPropuesta = function(confirmado, data) {
        if (confirmado) {
            $scope.iniciativa.descripcionesPropuesta.push(data);
        }else {
            if (!$scope.iniciativa.descripcionesPropuesta){
                $scope.iniciativa.descripcionesPropuesta = [];
            }
            var modalScope = $scope.$new();
            
            modalScope.data = {
                descripcion: '',
                quien: '',
                cuando:undefined
            };
            $modal({template: '/views/iniciativas/modals/agregarDescripcionProp.html', persist: true, show: true, backdrop: 'static', scope: modalScope});
        }
    };
    
    $scope.agregarComEstado = function(confirmado, data) {
        if (confirmado) {
            $scope.iniciativa.comentariosEstado.push(data);
        }else {
            if (!$scope.iniciativa.comentariosEstado){
                $scope.iniciativa.comentariosEstado = [];
            }
            var modalScope = $scope.$new();
            
            modalScope.data = {
                comentario: '',
                quien: '',
                cuando:undefined
            };
            $modal({template: '/views/iniciativas/modals/agregarComentarioEst.html', persist: true, show: true, backdrop: 'static', scope: modalScope});
        }
    };
    
    $scope.agregarDescrAprobacion = function(confirmado, data) {
        if(confirmado){
            $scope.iniciativa.descripcionesAprobacion.push(data);
        }else{
            var modalScope = $scope.$new();
            modalScope.data = {
                descripcion: '',
                quien: '',
                cuando:undefined
            };
            $modal({template: '/views/iniciativas/modals/agregarDescripcion.html', persist: true, show: true, backdrop: 'static', scope: modalScope});
        }
    };
    
    $scope.agregarFotografia = function(confirmado, data) {
        if (confirmado) {
            data.fotoId = $scope.uploaded.shift().id;
            $scope.iniciativa.fotos.push(data);
        }else{
            if ($scope.iniciativa.fotos === undefined) {
                $scope.iniciativa.fotos = [];
            }
            var modalScope = $scope.$new();
            modalScope.data = {
                descripcion: '',
                fecha: undefined,
                fuente: ''
            };
            $modal({template: '/views/iniciativas/modals/agregarFoto.html', persist: true, show: true, backdrop: 'static', scope: modalScope});
        }
    };
    
    $scope.agregarDocumentacion = function(confirmado, data) {
        if (confirmado) {
            data.archivoId = $scope.uploadedFile.shift().id;
            $scope.iniciativa.documentos.push(data);
        }else {
            if ($scope.iniciativa.documentos === undefined) {
                $scope.iniciativa.documentos = [];
            }
            var modalScope = $scope.$new();
            modalScope.data = {
                descripcion: '',
                fecha: undefined,
                fuente: ''
            };
            $modal({template: '/views/iniciativas/modals/agregarDocumento.html', persist: true, show: true, backdrop: 'static', scope: modalScope});
        }
    };
    
    $scope.agregarFotografiaSoli = function(confirmado, data) {
        if (confirmado) {
            data.fotoId = $scope.uploaded.shift().id;
            $scope.iniciativa.fotosSolicitud.push(data);
        }else {
            if ($scope.iniciativa.fotosSolicitud === undefined) {
                $scope.iniciativa.fotosSolicitud = [];
            }
            var modalScope = $scope.$new();
            modalScope.data = {
                descripcion: '',
                fecha: undefined,
                fuente: ''
            };
            $modal({template: '/views/iniciativas/modals/agregarFotoSolicitud.html', persist: true, show: true, backdrop: 'static', scope: modalScope});
        }
    };
    
    $scope.agregarDocumentacionSoli = function(confirmado, data) {
        if (confirmado) {
            data.archivoId = $scope.uploadedFile.shift().id;
            $scope.iniciativa.documentosSolicitud.push(data);
        }else {
            if ($scope.iniciativa.documentosSolicitud === undefined) {
                $scope.iniciativa.documentosSolicitud = [];
            }
            var modalScope = $scope.$new();
            modalScope.data = {
                descripcion: '',
                fecha: undefined,
                fuente: ''
            };
            $modal({template: '/views/iniciativas/modals/agregarDocumentoSolicitud.html', persist: true, show: true, backdrop: 'static', scope: modalScope});
        }
    };
    
    $scope.agregarFotografiaPropu = function(confirmado, data) {
        if (confirmado) {
            data.fotoId = $scope.uploaded.shift().id;
            $scope.iniciativa.fotosPropuesta.push(data);
        }else {
            if ($scope.iniciativa.fotosPropuesta === undefined) {
                $scope.iniciativa.fotosPropuesta = [];
            }
            var modalScope = $scope.$new();
            modalScope.data = {
                descripcion: '',
                fecha: undefined,
                fuente: ''
            };
            $modal({template: '/views/iniciativas/modals/agregarFotoPropuesta.html', persist: true, show: true, backdrop: 'static', scope: modalScope});
        }
    };
    
    $scope.agregarDocumentacionPropu = function(confirmado, data) {
        if (confirmado) {
            data.archivoId = $scope.uploadedFile.shift().id;
            $scope.iniciativa.documentosPropuesta.push(data);
        }else {
            if ($scope.iniciativa.documentosPropuesta === undefined) {
                $scope.iniciativa.documentosPropuesta = [];
            }
            var modalScope = $scope.$new();
            modalScope.data = {
                descripcion: '',
                fecha: undefined,
                fuente: ''
            };
            $modal({template: '/views/iniciativas/modals/agregarDocumentoPropuesta.html', persist: true, show: true, backdrop: 'static', scope: modalScope});
        }
    };
    
    $scope.agregarFotografiaEst = function(confirmado, data) {
        if (confirmado) {
            data.fotoId = $scope.uploaded.shift().id;
            $scope.iniciativa.fotosEstado.push(data);
        }else {
            if ($scope.iniciativa.fotosEstado === undefined) {
                $scope.iniciativa.fotosEstado = [];
            }
            var modalScope = $scope.$new();
            modalScope.data = {
                descripcion: '',
                fecha: undefined,
                fuente: ''
            };
            $modal({template: '/views/iniciativas/modals/agregarFotoEstado.html', persist: true, show: true, backdrop: 'static', scope: modalScope});
        }
    };
    
    $scope.agregarDocumentacionEst = function(confirmado, data) {
        if (confirmado) {
            data.archivoId = $scope.uploadedFile.shift().id;
            $scope.iniciativa.documentosEstado.push(data);
        }else {
            if ($scope.iniciativa.documentosEstado === undefined) {
                $scope.iniciativa.documentosEstado = [];
            }
            var modalScope = $scope.$new();
            modalScope.data = {
                descripcion: '',
                fecha: undefined,
                fuente: ''
            };
            $modal({template: '/views/iniciativas/modals/agregarDocumentoEstado.html', persist: true, show: true, backdrop: 'static', scope: modalScope});
        }
    };
    
    $scope.agregarTema = function(dataTema) {
        if (!$scope.iniciativa.temas) {
            $scope.iniciativa.temas = [];
        }
        $scope.iniciativa.temas.push(dataTema);
        $scope.dataTema = "";
    };
    
    $scope.abrirModal = function(idmodal) {
        $(idmodal).modal('show');
    };
    
    $scope.eliminarElemento = function(array,elemento) {
        var indice = array.indexOf(elemento);
        if(indice!=-1) array.splice(indice, 1);
    };
    
    $scope.guardar = function() {
        $scope.iniciativa.calle = $('#calle3-typeahead').val();
        $scope.iniciativa.cruce = $('#cruce3-typeahead').val();
        $scope.iniciativa.$save(function(data) {
            $location.path('/iniciativas/' + $scope.iniciativa._id);
        });
    };
    
    $scope.$on('selectionChanged', function(scope, selectedIndexes) {
        $scope.iniciativasVista.selectedIndexes = selectedIndexes;
        if ($scope.iniciativasVista && $scope.iniciativasVista.selectedIndexes && $scope.iniciativasVista.selectedIndexes.length === 1) {
            $scope.iniciativa = angular.copy($scope.iniciativasVista.features[$scope.iniciativasVista.selectedIndexes[0]]);
        }else {
            $scope.iniciativa = null;
        }
    });
    
    $scope.uploadedFile = [];
    $scope.uploaded = [];
    
    $scope.agregarNombrar = function(dataNombrar) {
        if (!$scope.iniciativa.nombrar) {
            $scope.iniciativa.nombrar = [];
        }
        $scope.iniciativa.nombrar.push($scope.dataNombrar);
        $scope.guardarTime(dataNombrar);
        $scope.dataNombrar = {
            fecha: undefined,
        };
    };
    
    $scope.agregarPSigaf = function(presupuestoSigaf) {
        if (!$scope.iniciativa.presupuestoSigaf) {
            $scope.iniciativa.presupuestoSigaf = [];
        }
        $scope.guardarTime(presupuestoSigaf);
        $scope.iniciativa.presupuestoSigaf.push(presupuestoSigaf);
        $scope.iniciativa.$save();
        $scope.presupuestoSigaf = {
            fecha: undefined,
        };
    };
    
    $scope.agregarComuna = function(dataComuna) {
        if (!$scope.iniciativa.comuna) {
            $scope.iniciativa.comuna = [];
            $scope.agregarComuna();
        }
        $scope.iniciativa.comuna.push(dataComuna.comuna);
    };
    
    $scope.eliminarListaElem = function(elemento, lista) {
        lista.splice(lista.indexOf(elemento), 1);
    };
    
    $scope.filtroComuna = function(c){
        return $scope.iniciativa && $scope.iniciativa.comuna && $scope.iniciativa.comuna.indexOf(c._id) == -1;
    };
    
    $scope.guardarTime = function(data) {
        var f = new Date();
        var minutes = f.getMinutes();
        minutes = minutes > 9 ? minutes : '0' + minutes;
        data.horaAgregado = (f.getHours() + ":" + minutes);
        data.fechaAgregado = moment(f).format('YYYYMMDD');
        data.usuario = $scope.username;
    };
}).controller('VerIniciativaCtrl', function($scope, $modal, EstadoIniciativa, Intervencion, ORMContacto, ORMOrganigrama, GrupoIniciativa, ImpactoIniciativa, CriticidadIniciativa, SegmentoEtarioIniciativa, FuenteFinanciacionIniciativa, RelevanciaIniciativa, AlcanceIniciativa, ClaseIniciativa, TipoIniciativa, $routeParams, Funcionario, Comuna, Jurisdiccion, Iniciativa, $location, Contactos, ORMTema,IniciativaPlan) {
    
    $scope.iniciativa = Iniciativa.get({_id: $routeParams._id},function(){
        $scope.planAnterior = Iniciativa.query({idHijo: $scope.iniciativa._id},function(){
            
        });
    });
    
    $scope.verPlanAnterior = function(){
        $location.url('/iniciativas/' + $scope.planAnterior[0]._id);
    };
    
    $scope.volverPlanActual = function(){
        $location.url('/iniciativas/' + $scope.iniciativa.idHijo);
    };
    
    $scope.iniciativas = Iniciativa.query();
    $scope.planes = IniciativaPlan.query();
    
    $scope.iniciativaPorId = function(id){
        for (var i = 0; i < $scope.iniciativas.length; i++) {
            if ($scope.iniciativas[i]._id == id){
                return $scope.iniciativas[i];
            }
        }
    };
    
    $scope.cancelar = function(){
        $scope.editando = false;
    };
    
    $scope.planPorId = function(id){
        for (var i = 0; i < $scope.planes.length; i++) {
            if ($scope.planes[i]._id == id){
                return $scope.planes[i];
            }
        }
    };
    
    // $scope.$watch('iniciativa.grupo', function (g) {
    //   if (g) {
    //       $scope.grupoIniciativa = GrupoIniciativa.get({_id: g});
    //   }
    // });
    //Usado para mostrar datos en el select de clase
    // $scope.$watch('iniciativa.clase', function (g) {
    //   if (g) {
    //       $scope.claseIniciativa = ClaseIniciativa.get({_id: g});
    //   }
    // });
    $scope.$watch('iniciativa.clase', function(newValue) {
        if (!newValue) {
            return;
        }
        if ($scope.iniciativa.clase) {
            $scope.tipos = TipoIniciativa.query({'clase': $scope.iniciativa.clase});
        }
    });
    // $scope.$watch('iniciativa.tipo', function (g) {
    //   if (g) {
    //       $scope.tipoIniciativa = TipoIniciativa.get({_id: g});
    //   }
    // });
    // $scope.$watch('iniciativa.impacto', function (g) {
    //   if (g) {
    //       $scope.impactoIniciativa = ImpactoIniciativa.get({_id: g});
    //   }
    // });
    // $scope.$watch('iniciativa.relevancia', function (g) {
    //   if (g) {
    //       $scope.relevanciaIniciativa = RelevanciaIniciativa.get({_id: g});
    //   }
    // });
    // $scope.$watch('iniciativa.criticidad', function (g) {
    //   if (g) {
    //       $scope.criticidadIniciativa = CriticidadIniciativa.get({_id: g});
    //   }
    // });
    // $scope.$watch('iniciativa.alcance', function (g) {
    //   if (g) {
    //       $scope.alcanceIniciativa = AlcanceIniciativa.get({_id: g});
    //   }
    // });
    // $scope.$watch('iniciativa.segmento_etario', function (g) {
    //   if (g) {
    //       $scope.segmentoEtarioIniciativa = SegmentoEtarioIniciativa.get({_id: g});
    //   }
    // });
    
    $scope.comunas = Comuna.query();
    $scope.jurisdicciones = Jurisdiccion.query();
    $scope.funcionarios = Funcionario.query();
    $scope.estados = EstadoIniciativa.query({obra : false});
    $scope.clases = ClaseIniciativa.query();
    $scope.grupos = GrupoIniciativa.query();
    $scope.impactos = ImpactoIniciativa.query();
    $scope.alcances = AlcanceIniciativa.query();
    $scope.relevancias = RelevanciaIniciativa.query();
    $scope.fuentes = FuenteFinanciacionIniciativa.query();
    $scope.segmentos = SegmentoEtarioIniciativa.query();
    $scope.criticidades = CriticidadIniciativa.query();
    $scope.organigrama = ORMOrganigrama.query();
    $scope.temas = ORMTema.query();
    $scope.contactos = Contactos.listar();
    $scope.intervenciones = Intervencion.query();
    
    $scope.jurisdiccionPorId = function (id) {
      for (var i = 0; i < $scope.jurisdicciones.length; i++) {
          if ($scope.jurisdicciones[i]._id == id)
          {
              return $scope.jurisdicciones[i];
          }
      }  
    };
    
    $scope.reparticionPorId = function (id) {
      for (var i = 0; i < $scope.funcionarios.length; i++) {
          if ($scope.funcionarios[i]._id == id)
          {
              return $scope.funcionarios[i];
          }
      }  
    };
    
    $scope.organigramaPorId = function (id) {
      for (var i = 0; i < $scope.organigrama.length; i++) {
          if ($scope.organigrama[i]._id == id)
          {
              return $scope.organigrama[i];
          }
      }  
    };
    
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
    
    $scope.modificar = function() {
        $scope.editando = true;
    };
    
    $scope.eliminarIniciativa = function(confirmado) {
        if (confirmado) {
            $scope.iniciativa.$delete(function() {
                $location.url('/iniciativas');
                $scope.alerts.push({
                    type: 'success',
                    htmlMessage: 'La iniciativa se ha eliminado'
                });
            });
        }else{
            $("#confirmarEliminar").modal('show');
        }
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
    
    $scope.reverse = function(array) {
        var copy = [].concat(array);
        return copy.reverse();
    };
    
    $scope.agregarDetaComunicacion = function(confirmado, data) {
        if (confirmado) {
            $scope.iniciativa.detallesComunicacion.push(data);
        }else {
            if (!$scope.iniciativa.detallesComunicacion){
                $scope.iniciativa.detallesComunicacion = [];
            }
            var modalScope = $scope.$new();
            modalScope.data = {
                detalle: '',
                quien: '',
                cuando:undefined
            };
            $modal({template: '/views/iniciativas/modals/agregarDetalleComu.html', persist: true, show: true, backdrop: 'static', scope: modalScope});
        }
    };
    
    $scope.agregarUbiComunicacion = function(confirmado, data) {
        if (confirmado) {
            $scope.iniciativa.ubicacionesComunicacion.push(data);
        }else {
            if (!$scope.iniciativa.ubicacionesComunicacion){
                $scope.iniciativa.ubicacionesComunicacion = [];
            }
            var modalScope = $scope.$new();
            
            if (!$scope.iniciativa.altura){
                $scope.iniciativa.altura = '';
            }
            
            var ubicacion = 'Dirección: \n' + $scope.iniciativa.calle + ' ' + $scope.iniciativa.altura + ', cruce con ' + $scope.iniciativa.cruce + '. ';
            
            if ($scope.iniciativa.direccionesMapa) {
                ubicacion = ubicacion + '\nMapa: \n';
                $scope.iniciativa.direccionesMapa.forEach(function(item) {
                    ubicacion = ubicacion + 'De: ' + item.calle + ' ' + item.altura + ', cruce con ' + item.cruce + '; Hasta: ' + item.calle2 + ' ' + item.altura2 + ', cruce con ' + item.cruce2 + '. \n';
                });
            }
            modalScope.data = {
                detalle: ubicacion,
                quien: '',
                cuando:undefined
            };
            $modal({template: '/views/iniciativas/modals/agregarUbicacionComu.html', persist: true, show: true, backdrop: 'static', scope: modalScope});
        }
    };
    
    $scope.agregarDescrSolicitud = function(confirmado, data) {
        if(confirmado) {
            $scope.iniciativa.descripcionesSolicitud.push(data);
        }else {
            if (!$scope.iniciativa.descripcionesSolicitud){
                $scope.iniciativa.descripcionesSolicitud = [];
            }
            var modalScope = $scope.$new();
            
            modalScope.data = {
                descripcion: '',
                quien: '',
                cuando:undefined
            };
            $modal({template: '/views/iniciativas/modals/agregarDescripcionSoli.html', persist: true, show: true, backdrop: 'static', scope: modalScope});
        }
    };
    
    $scope.agregarDireMapa = function() {
        if (!$scope.iniciativa.direccionesMapa){
            $scope.iniciativa.direccionesMapa = [];
        }
        $scope.dataDire.calle = $('#calle-typeahead').val();
        $scope.dataDire.calle2 = $('#calle2-typeahead').val();
        $scope.dataDire.cruce = $('#cruce-typeahead').val();
        $scope.dataDire.cruce2 = $('#cruce2-typeahead').val();
        $scope.iniciativa.direccionesMapa.push($scope.dataDire);
        $scope.dataDire = {
            calle: '',
            calle2: '',
            altura: '',
            altura2: '',
            cruce: '',
            cruce2: ''
        };
    };
    
    $scope.agregarDescrPropuesta = function(confirmado, data) {
        if(confirmado) {
            $scope.iniciativa.descripcionesPropuesta.push(data);
        }else{
            if (!$scope.iniciativa.descripcionesPropuesta){
                $scope.iniciativa.descripcionesPropuesta = [];
            }
            var modalScope = $scope.$new();
            modalScope.data = {
                descripcion: '',
                quien: '',
                cuando:undefined
            };
            $modal({template: '/views/iniciativas/modals/agregarDescripcionProp.html', persist: true, show: true, backdrop: 'static', scope: modalScope});
        }
    };
    
    $scope.agregarComEstado = function(confirmado, data) {
        if (confirmado) {
            $scope.iniciativa.comentariosEstado.push(data);
        }else {
            if (!$scope.iniciativa.comentariosEstado){
                $scope.iniciativa.comentariosEstado = [];
            }
            var modalScope = $scope.$new();
            modalScope.data = {
                comentario: '',
                quien: '',
                cuando:undefined
            };
            $modal({template: '/views/iniciativas/modals/agregarComentarioEst.html', persist: true, show: true, backdrop: 'static', scope: modalScope});
        }
    };
    
    $scope.agregarDescrAprobacion = function(confirmado, data) {
        if(confirmado) {
            $scope.iniciativa.descripcionesAprobacion.push(data);
        }else{
            var modalScope = $scope.$new();
            modalScope.data = {
                descripcion: '',
                quien: '',
                cuando:undefined
            };
            $modal({template: '/views/iniciativas/modals/agregarDescripcion.html', persist: true, show: true, backdrop: 'static', scope: modalScope});
        }
    };
    
    $scope.agregarFotografia = function(confirmado, data) {
        if (confirmado) {
            data.fotoId = $scope.uploaded.shift().id;
            $scope.iniciativa.fotos.push(data);
        }else {
            if ($scope.iniciativa.fotos === undefined) {
                $scope.iniciativa.fotos = [];
            }
            var modalScope = $scope.$new();
            modalScope.data = {
                descripcion: '',
                fecha: undefined,
                fuente: ''
            };
            $modal({template: '/views/iniciativas/modals/agregarFoto.html', persist: true, show: true, backdrop: 'static', scope: modalScope});
        }
    };
    
    $scope.agregarDocumentacion = function(confirmado, data) {
        if (confirmado) {
            data.archivoId = $scope.uploadedFile.shift().id;
            $scope.iniciativa.documentos.push(data);
        }else{
            if ($scope.iniciativa.documentos === undefined) {
                $scope.iniciativa.documentos = [];
            }
            var modalScope = $scope.$new();
            modalScope.data = {
                descripcion: '',
                fecha: undefined,
                fuente: ''
            };
            $modal({template: '/views/iniciativas/modals/agregarDocumento.html', persist: true, show: true, backdrop: 'static', scope: modalScope});
        }
    };
    
    $scope.agregarFotografiaSoli = function(confirmado, data) {
        if (confirmado) {
            data.fotoId = $scope.uploaded.shift().id;
            $scope.iniciativa.fotosSolicitud.push(data);
        }else {
            if ($scope.iniciativa.fotosSolicitud === undefined) {
                $scope.iniciativa.fotosSolicitud = [];
            }
            var modalScope = $scope.$new();
            modalScope.data = {
                descripcion: '',
                fecha: undefined,
                fuente: ''
            };
            $modal({template: '/views/iniciativas/modals/agregarFotoSolicitud.html', persist: true, show: true, backdrop: 'static', scope: modalScope});
        }
    };
    
    $scope.agregarDocumentacionSoli = function(confirmado, data) {
        if (confirmado) {
            data.archivoId = $scope.uploadedFile.shift().id;
            $scope.iniciativa.documentosSolicitud.push(data);
        }else {
            if ($scope.iniciativa.documentosSolicitud === undefined) {
                $scope.iniciativa.documentosSolicitud = [];
            }
            var modalScope = $scope.$new();
            modalScope.data = {
                descripcion: '',
                fecha: undefined,
                fuente: ''
            };
            $modal({template: '/views/iniciativas/modals/agregarDocumentoSolicitud.html', persist: true, show: true, backdrop: 'static', scope: modalScope});
        }
    };
    
    $scope.agregarFotografiaPropu = function(confirmado, data) {
        if(confirmado) {
            data.fotoId = $scope.uploaded.shift().id;
            $scope.iniciativa.fotosPropuesta.push(data);
        }else{
            if ($scope.iniciativa.fotosPropuesta === undefined) {
                $scope.iniciativa.fotosPropuesta = [];
            }
            var modalScope = $scope.$new();
            modalScope.data = {
                descripcion: '',
                fecha: undefined,
                fuente: ''
            };
            $modal({template: '/views/iniciativas/modals/agregarFotoPropuesta.html', persist: true, show: true, backdrop: 'static', scope: modalScope});
        }
    };
    
    $scope.agregarDocumentacionPropu = function(confirmado, data) {
        if(confirmado) {
            data.archivoId = $scope.uploadedFile.shift().id;
            $scope.iniciativa.documentosPropuesta.push(data);
        }else{
            if ($scope.iniciativa.documentosPropuesta === undefined) {
                $scope.iniciativa.documentosPropuesta = [];
            }
            var modalScope = $scope.$new();
            modalScope.data = {
                descripcion: '',
                fecha: undefined,
                fuente: ''
            };
            $modal({template: '/views/iniciativas/modals/agregarDocumentoPropuesta.html', persist: true, show: true, backdrop: 'static', scope: modalScope});
        }
    };
    
    $scope.agregarFotografiaEst = function(confirmado, data) {
        if(confirmado) {
            data.fotoId = $scope.uploaded.shift().id;
            $scope.iniciativa.fotosEstado.push(data);
        }else{
            if ($scope.iniciativa.fotosEstado === undefined) {
                $scope.iniciativa.fotosEstado = [];
            }
            var modalScope = $scope.$new();
            modalScope.data = {
                descripcion: '',
                fecha: undefined,
                fuente: ''
            };
            $modal({template: '/views/iniciativas/modals/agregarFotoEstado.html', persist: true, show: true, backdrop: 'static', scope: modalScope});
        }
    };
    
    $scope.agregarDocumentacionEst = function(confirmado, data) {
        if (confirmado) {
            data.archivoId = $scope.uploadedFile.shift().id;
            $scope.iniciativa.documentosEstado.push(data);
        }else {
            if ($scope.iniciativa.documentosEstado === undefined) {
                $scope.iniciativa.documentosEstado = [];
            }
            var modalScope = $scope.$new();
            modalScope.data = {
                descripcion: '',
                fecha: undefined,
                fuente: ''
            };
            $modal({template: '/views/iniciativas/modals/agregarDocumentoEstado.html', persist: true, show: true, backdrop: 'static', scope: modalScope});
        }
    };
    
    $scope.agregarTema = function(dataTema) {
        if(!$scope.iniciativa.temas) {
            $scope.iniciativa.temas = [];
        }
        $scope.iniciativa.temas.push(dataTema);
        $scope.dataTema = "";
    };
    
    $scope.abrirModal = function(idmodal) {
        $(idmodal).modal('show');
    };
    
    $scope.eliminarElemento = function(array,elemento) {
        var indice = array.indexOf(elemento);
        if(indice!=-1) array.splice(indice, 1);
    };

    $scope.guardar = function() {
        $scope.iniciativa.calle = $('#calle3-typeahead').val();
        $scope.iniciativa.cruce = $('#cruce3-typeahead').val();
        $scope.iniciativa.$save(function(data) {
            $scope.editando = false;
        });
    };
    
    $scope.$on('selectionChanged', function(scope, selectedIndexes) {
        $scope.iniciativasVista.selectedIndexes = selectedIndexes;
        if($scope.iniciativasVista && $scope.iniciativasVista.selectedIndexes && $scope.iniciativasVista.selectedIndexes.length === 1) {
            $scope.iniciativa = angular.copy($scope.iniciativasVista.features[$scope.iniciativasVista.selectedIndexes[0]]);
        }else{
            $scope.iniciativa = null;
        }
    }); 
    
    $scope.uploaded = [];
    $scope.uploadedFile = [];
    
    $scope.agregarNombrar = function(dataNombrar) {
        if(!$scope.iniciativa.nombrar){
            $scope.iniciativa.nombrar = [];
        }
        $scope.iniciativa.nombrar.push(dataNombrar);
        $scope.iniciativa.$save();
        $scope.dataNombrar = {
            fecha: undefined,
        };
    };
    
    $scope.agregarPSigaf = function(presupuestoSigaf) {
        if(!$scope.iniciativa.presupuestoSigaf){
            $scope.iniciativa.presupuestoSigaf = [];
        }
        $scope.guardarTime(presupuestoSigaf);
        $scope.iniciativa.presupuestoSigaf.push(presupuestoSigaf);
        $scope.iniciativa.$save();
        $scope.presupuestoSigaf = {
            fecha: undefined,
        };
    };
    
    $scope.agregarComuna = function(dataComuna) {
        if(!$scope.iniciativa.comuna) {
            $scope.iniciativa.comuna = [];
            $scope.agregarComuna();
        }else{
            $scope.iniciativa.comuna.push(dataComuna.comuna);
        }
    };
    
    $scope.eliminarListaElem = function(elemento, lista) {
        lista.splice(lista.indexOf(elemento), 1);
    };
    
    $scope.filtroComuna = function(c){
        return $scope.iniciativa && $scope.iniciativa.comuna && $scope.iniciativa.comuna.indexOf(c._id) == -1;
    };
    
    $scope.guardarTime = function(data) {
        var f = new Date();
        var minutes = f.getMinutes();
        minutes = minutes > 9 ? minutes : '0' + minutes;
        data.horaAgregado = (f.getHours() + ":" + minutes);
        data.fechaAgregado = moment(f).format('YYYYMMDD');
        data.usuario = $scope.username;
    };
    
    $scope.agregarPlan = function(){
        var iniOriginal = $scope.iniciativa;
        $scope.iniNueva = new Iniciativa({
            nombre: iniOriginal.nombre,
            nombre_largo: iniOriginal.nombre_largo,
            id:iniOriginal.id,
            etapa:iniOriginal.etapa,
            siglas:iniOriginal.siglas,
            ref_mapa:iniOriginal.ref_mapa,
            plan:iniOriginal.plan,
            legislativo:iniOriginal.legislativo,
            expediente:iniOriginal.expediente,
            codigo_anterior:iniOriginal.codigo_anterior,
            tema:iniOriginal.tema,
            calle:iniOriginal.calle,
            cruce:iniOriginal.cruce,
            altura:iniOriginal.altura,
            seccion:iniOriginal.seccion,
            manzana:iniOriginal.manzana,
            parcela:iniOriginal.parcela,
            unidad_funcional:iniOriginal.unidad_funcional,
            barrio:iniOriginal.barrio,
            comuna:iniOriginal.comuna,
            provincia:iniOriginal.provincia,
            pais:iniOriginal.pais,
            codigo_postal:iniOriginal.codigo_postal,
            coordenadas:iniOriginal.coordenadas,
            partida_matriz:iniOriginal.partida_matriz,
            utiu:iniOriginal.utiu,
            region_sanitaria:iniOriginal.region_sanitaria,
            distrito_escolar:iniOriginal.distrito_escolar,
            comisaria_pm:iniOriginal.comisaria_pm,
            direccionesMapa:iniOriginal.direccionesMapa,
            grupo:iniOriginal.grupo,
            clase:iniOriginal.clase,
            impacto:iniOriginal.impacto,
            tipo:iniOriginal.tipo,
            orden1:iniOriginal.orden1,
            orden2:iniOriginal.orden2,
            solicitante:iniOriginal.solicitante,
            evento:iniOriginal.evento,
            fec_solicitada:iniOriginal.fec_solicitada,
            descripcionesSolicitud:iniOriginal.descripcionesSolicitud,
            fotosSolicitud:iniOriginal.fotosSolicitud,
            documentosSolicitud:iniOriginal.documentosSolicitud,
            jurisdiccion:iniOriginal.jurisdiccion,
            sigla:iniOriginal.sigla,
            reparticion:iniOriginal.reparticion,
            dependencia:iniOriginal.dependencia,
            referente:iniOriginal.referente,
            jurisdiccion2:iniOriginal.jurisdiccion2,
            dependencia2:iniOriginal.dependencia2,
            plazo_completo:iniOriginal.plazo_completo,
            previsto_para:iniOriginal.previsto_para,
            nombrar:iniOriginal.nombrar,
            presupuestoSigaf:iniOriginal.presupuestoSigaf,
            relevancia:iniOriginal.relevancia,
            criticidad:iniOriginal.criticidad,
            alcance:iniOriginal.alcance,
            segmento_etario:iniOriginal.segmento_etario,
            ciudadanos:iniOriginal.ciudadanos,
            metros:iniOriginal.metros,
            descripcionesPropuesta:iniOriginal.descripcionesPropuesta,
            documentosPropuesta:iniOriginal.documentosPropuesta,
            inaugurable:iniOriginal.inaugurable,
            visitable:iniOriginal.visitable,
            comunicable:iniOriginal.comunicable,
            fec_inicio:iniOriginal.fec_inicio,
            fec_fin:iniOriginal.fec_fin,
            fec_inauguracion:iniOriginal.fec_inauguracion,
            detallesComunicacion:iniOriginal.detallesComunicacion,
            documentos:iniOriginal.documentos,
            estado:iniOriginal.estado,
            comentariosEstado:iniOriginal.comentariosEstado,
            fotosEstado:iniOriginal.fotosEstado,
            documentosEstado:iniOriginal.documentosEstado
        });
        
        $scope.iniNueva.$save(function(){
            if(confirm("Esta seguro de guardar el plan?")){
                alert("Ya puede editar los datos del nuevo plan");
                $scope.iniciativa.idHijo = $scope.iniNueva._id;
                $scope.iniciativa.$save();
                $location.url('/iniciativas/' + $scope.iniNueva._id);
            }
        });
    };
});