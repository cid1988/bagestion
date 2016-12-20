angular.module('bag2.bamapa', []) // Aca todo en minuscula weon
// Define un controlador
.controller('mapaIndex', function($scope, Obra, Iniciativa, BajoAutopista, CorteCalzada, Constituyentes, RegularizacionDominial, CruceFerroviario, Comuna, RelevanciaIniciativa, ClaseObra, EstadoObra, ORMOrganigrama, EstadoObra, GrupoIniciativa, OrdenObra, IniciativaPlan,/*a*/$location, $http, $timeout) {

    var validar = usig.NormalizadorDirecciones.init();
    $('#mapaPrincipal'  ).css('width', $(window).width()).css('height', $(window).height()).css('margin', 0);
    /*
     * Aqui se guardan unicamente los datos necesarios para insertar los markes: direccion y id + (valores unicos de cada arreglo)
     */
    $scope.mObra                = []; // Verde
    $scope.mIniciativa          = []; // Azul
    $scope.mBajoAutopista       = []; // Violeta
    $scope.mCorteCalzada        = []; // Rojo
    $scope.mConstituyentes      = []; // Amarrillo 
    $scope.mRegularizacion      = []; // Rosa
    $scope.mCrucesFerroviarios  = []; // Celeste
    

    $scope.capas = [
        {
            nombre: "Obras",
            valores: $scope.mObra,
            color:"verde",
            colorHtml: "#75E54E",
            panel: false,
            idPanel: '#cajaFiltrosObras',
            visible: false
        },
        {
            nombre: "Iniciativas",
            valores: $scope.mIniciativa,
            color:"azul",
            colorHtml: "#4A7FD0",
            panel: false,
            idPanel: '#cajaFiltrosIniciativas',
            visible: false
        },
        {
            nombre: "Bajo Autopistas",
            valores: $scope.mBajoAutopista,
            color:"violeta",
            panel: false,
            idPanel: '#cajaFiltrosBAutopista',
            visible: false
        },
        {
            nombre: "Cortes de Calzada",
            valores: $scope.mCorteCalzada,
            color:"rojo",
            panel: false,
            idPanel: '#cajaFiltrosCalzada',
            visible: false
        },
        {
            nombre: "Constituyentes",
            valores: $scope.mConstituyentes,
            color:"amarrillo",
            panel: false,
            idPanel: '#cajaFiltrosConstituyentes',
            visible: false
        },
        {
            nombre: "Regularizacion Dominial",
            valores: $scope.mRegularizacion,
            color:"amarrillo",
            panel: false,
            idPanel: '#cajaFiltrosRegularizacion',
            visible: false
        },
        {
            nombre: "Cruces Ferroviarios",
            valores: $scope.mCrucesFerroviarios,
            color:"celeste",
            panel: false,
            idPanel: '#cajaFiltrosCFerroviarios',
            visible: false
        }
    ];
    
/*
 *  CARGA TODOS LOS MARKERS AL MOMENTO DE SELECCIONAR UN CHECK BOX Y AL DESECCIONAR ENTONCES ELIMINA ABSOLUTAMENTE TODOS LOS MARKERS Y EMPUIEZA DESDE CERO (Sin filtros)
 */    
    $scope.cargarMakers = function(h){
        h.visible = !h.visible;
        if(h.visible){
            if(h.nombre == 'Obras'){
                angular.forEach($scope.mObra, function(o){
                    $scope.cargarMarkerObra(o);
                });
            } else if(h.nombre == 'Iniciativas'){
                angular.forEach($scope.mIniciativa, function(o){
                    $scope.cargarMarkerIni(o);
                });
            }
        } else {
            $(h.idPanel).hide();
            h.panel = false;
            angular.forEach(h.valores, function(x) {
                $scope.miMapa.removeMarker(x.ide);
                x.visible = false;
            });
        }
    }
    
    
$scope.miMapa = new usig.MapaInteractivo('mapaPrincipal', {
//rootUrl: '//servicios.usig.buenosaires.gov.ar/usig-js/3.1/',
zoomBar: true,
onReady: function() {
/*
 * CARGA OBRAS
 */
var datoObra = Obra.query(function(){
    angular.forEach(datoObra, function(x) {
        $scope.cargarArrays('obras', $scope.mObra, x)
    });
});
/*
 * CARGA INICIATIVAS
 */
var datoIni = Iniciativa.query(function(){
    angular.forEach(datoIni, function(x) {
        $scope.cargarArrays('iniciativas', $scope.mIniciativa,x)
    });
});
/*
 * CARGA BAJO AUTOPISTA
 */
var datoBAuto = BajoAutopista.query(function(){
    angular.forEach(datoBAuto, function(x) {
        $scope.cargarArrays('bajoAutopista', $scope.mBajoAutopista,x)
    });
});
/*
 * CARGA CORTE CALZADA
 */
var datoCCalzada = CorteCalzada.query(function(){
    angular.forEach(datoCCalzada, function(x) {
        $scope.cargarArrays('corteCalzada', $scope.mCorteCalzada,x)
    });
});
/*
 * CARGA CONSTITUYENTES
 */
var datoConstituyentes = Constituyentes.query(function(){
    angular.forEach(datoConstituyentes, function(x) {
        $scope.cargarArrays('constituyentes', $scope.mConstituyentes,x)
    });
});
/*
 * CARGA REGULARIZACION
 */
var datoRegularizacion = RegularizacionDominial.query(function(){
    angular.forEach(datoRegularizacion, function(x) {
        $scope.cargarArrays('regularizacion', $scope.mRegularizacion,x)
    });
});
/*
 * CARGA CRUCES FERROVIARIOS
 */
var datoCFerroviario = CruceFerroviario.query(function(){
    angular.forEach(datoCFerroviario, function(x) {
        $scope.cargarArrays('crucesFerroviarios', $scope.mCrucesFerroviarios,x)
    });
});


/*
 * ********************* FIN DE CARGA DE ARRAYS Y MARKERS ************************
 */ 
    $scope.ocultarTodo = function(){
        $scope.miMapa.toggleMarkers();
    }
    $scope.contarMarkers = function(){
        var markers = $scope.miMapa.getMarkers();
    }
    $scope.ocultarCapa = function() {
        
        var layers = $scope.miMapa.getMarkersLayer();

        $scope.miMapa.toggleLayer(layers);
    }
  } // OnReady
});/* ------------------> Aca termina el metodo del mapa USI */
$scope.retornarColor = function(c){ if(c.visible) {return c.colorHtml} else { return 'none'}}

/*
 *  Cargar Arrays
 */     
    $scope.cargarArrays = function(nombre, tipo, x) {
        if(nombre == 'obras'){
            var direccion = $scope.buscarDireccion(x);
            var validado = $scope.validarDireccion(direccion);
            if(validado != 0) {
                tipo.push({
                    ide: null,
                    direccion: direccion,
                    comuna: x.comuna,
                    prioridad: x.relevancia,
                    jurisdiccion: x.jurisdiccion,
                    estado: x.estado,
                    grupo: x.grupo,
                    nombre: x.nombre,
                    segmento: x.orden1,
                    visible: false
                });
            }   
        } else if(nombre == 'iniciativas') {
            var direccion = $scope.buscarDireccion(x);
            var validado = $scope.validarDireccion(direccion);
            if(validado != 0) {
                tipo.push({
                    ide: null,
                    nombre: x.nombre,
                    direccion: direccion,
                    comuna: x.comuna,
                    prioridad:x.relevancia,
                    grupo: x.grupo,
                    jurisdiccion: x.jurisdiccion,
                    estado: x.estado,
                    clase: x.clase,
                    plan: x.plan,
                    visible:false
                });
            }  
        }
    }
/*
 *  Validar direccion
 */     
    $scope.validarDireccion = function(direccion) {
        
        try {
            var opts = validar.normalizar(direccion, 10);
            return 1;
        } catch (error) {
            return 0;
        }
    }
/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *
 *  SECTOR DE OBRAS
 *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

/*
 *  Mostrar panel de filtros OBRAS
 */     
$scope.panelFiltros = function(c) {
        // Ocultar si hay algun otro panel visible
        angular.forEach($scope.capas, function(v){
            if(v.nombre != c.nombre){
                if(v.panel){
                    v.panel = false;
                    $(v.idPanel).hide();
                }
            }
        });
        
        if(c.nombre == c.nombre){
            if(!c.panel){
                $(c.idPanel).show();
            } else {
                $(c.idPanel).hide();
            }
        }
        c.panel = !c.panel;
    }

/*
 *  Cargar Comunas para OBRAS o INICIATIVAS
 */  
var datoComunas = Comuna.query(function(){
$scope.obrasTodasComunas = true;
$scope.iniTodasComunas = true;
$scope.obrasComunas = [];
    angular.forEach(datoComunas, function(x) {
        $scope.obrasComunas.push({
            ide: x._id,
            numero: x.numero,
            visibleObra: true,
            visibleIni: true
        }); 
    });
});
/*
 *  Cargar SEGMENTOS para OBRAS o INICIATIVAS
 */
var datoSegmento = OrdenObra.query(function(){
$scope.obrasTodosSegmentos = true;
$scope.iniTodosSegmentos = true;
$scope.obrasSegmentos = [];
    angular.forEach(datoSegmento, function(x){
        $scope.obrasSegmentos.push({
            ide: x._id,
            nombre: x.nombre,
            orden: x.orden,
            visibleObra: true,
            visibleIni: true
        });
    });
});
/*
 *   Cargar GRUPO  para OBRAS o INICIATIVAS
 */
var datoGrupoObras = GrupoIniciativa.query(function(){
$scope.obrasTodosGrupos = true;
$scope.iniTodosGrupos = true;
$scope.obrasGrupos = [];
    angular.forEach(datoGrupoObras, function(x){
        $scope.obrasGrupos.push({
            ide: x._id,
            nombre: x.nombre,
            orden: x.orden,
            visibleObra: true,
            visibleIni: true
        });
    });
});
/*
 *  Cargar Estados de OBRAS o INICIATIVAS
 */  
var datoEstadosObras = EstadoObra.query(function(){
$scope.obrasTodosEstados = true;
$scope.iniTodosEstados = true;
$scope.obrasEstados = [];
    angular.forEach(datoEstadosObras, function(x) {
        $scope.obrasEstados.push({
            ide: x._id,
            nombre: x.nombre,
            obra: x.obra,
            visibleObra: true,
            visibleIni: true
        }); 
    });
});
/*
 *  Cargar Jurisdicciones para OBRAS o INICIATIVAS
 */  
var datoJurisdiIni = ORMOrganigrama.query(function(){
$scope.obrasTodasJurisdicciones = true;
$scope.iniTodasJurisdicciones = true;
$scope.obrasJurisdicciones = [];
    angular.forEach(datoJurisdiIni, function(x) {
        $scope.obrasJurisdicciones.push({
            ide: x._id,
            nombre: x.nombreCompleto,
            visibleObra: true,
            visibleIni: true
        }); 
    });
});
/*
 *  Carga relevancias de Obras o INICIATIVAS
 */  
var datoRelevancia = RelevanciaIniciativa.query(function(){
$scope.obrasTodasRelevancias = true;
$scope.iniTodasRelevancias = true;
$scope.obrasRelevancias = [{
            ide: '',
            nombre: 'SP',
            visibleObra: true,
            visibleIni: true
        }];
    angular.forEach(datoRelevancia, function(x) {
        $scope.obrasRelevancias.push({
            ide: x._id,
            nombre: x.nombre,
            visibleObra: true,
            visibleIni: true
        }); 
    });
});
/*
 *  Carga planes PLAN de INICIATIVAS (Creo)
 */  
var datoPlanes = IniciativaPlan.query(function(){
$scope.obrasTodosPlanes = true;
$scope.iniTodosPlanes = true;
$scope.obrasPlanes = [];
    angular.forEach(datoPlanes, function(x) {
        $scope.obrasPlanes.push({
            ide: x._id,
            nombre: x.nombre,
            visibleObra: true,
            visibleIni: true
        }); 
    });
});

$scope.convertirJson = function(h){
    var j = "todas";
    if(h!="todas"&&h!= ""&&h!=null) {
        j=JSON.parse(h);
        return j;
    } else if(h=="todas") {
        j="todas";
        return j;
    }
}
/*
 --------------------- Metodos para los filtros OBRAS o INICIATIVAS ---------------------
 */
$scope.filtroComuna = function(tipo, objeto){
    var enComuna = true;
    var visible;
    angular.forEach(objeto.comuna, function(c){
        angular.forEach($scope.obrasComunas, function(co){
            if(enComuna){
                if(c == co.ide){
                    if(tipo == 'obras'){ visible = co.visibleObra; } else { visible = co.visibleIni; }
                    
                    if(visible){
                        enComuna = false;
                    } else {
                        enComuna = true;
                    }
                }   
            }
        });
    });  
    return !enComuna;
}
$scope.filtroRelevancia = function(tipo, objeto) {
    var enRelevancia = false;
    var visible;
    angular.forEach($scope.obrasRelevancias, function(r){
        if(tipo == 'obras'){visible = r.visibleObra; } else {visible = r.visibleIni; }
        if(objeto.prioridad == r.ide && visible){
            enRelevancia = true;
        }
    });
    return enRelevancia;
}

$scope.filtroJurisdiccion = function(tipo, objeto){
    var visible;
    var todas;
    var enJurisdiccion = false;
    
    if(tipo == 'obras'){ todas = $scope.obrasTodasJurisdicciones; } else { todas = $scope.iniTodasJurisdicciones; }
    
    if(!todas) {
        angular.forEach($scope.obrasJurisdicciones, function(j){
            if(objeto.jurisdiccion == j.ide){
                if(tipo == 'obras'){visible = j.visibleObra; } else {visible = j.visibleIni; }
                if(visible){
                    enJurisdiccion = true;
                }
            }
        });
    } else {
        enJurisdiccion = true;
    }  
    return enJurisdiccion;
}
$scope.filtroEstado = function(tipo, objeto){
    var visible;
    var todas;
    var enEstado = false;
    
    if(tipo == 'obras'){ todas = $scope.obrasTodosEstados; } else { todas = $scope.iniTodosEstados; }
    
    if(!todas) {
        angular.forEach($scope.obrasJurisdicciones, function(e){
            if(objeto.jurisdiccion == e.ide){
                if(tipo == 'obras'){visible = e.visibleObra; } else {visible = e.visibleIni; }
                if(visible){
                    enEstado = true;
                }
            }
        });
    } else {
        enEstado = true;
    }  
    return enEstado;
}
$scope.filtroGrupo = function(tipo, objeto){
    var enGrupo = false;
    var visible;
    var todas;
    
    if(tipo == 'obras'){ todas = $scope.obrasTodosGrupos; } else { todas = $scope.iniTodosGrupos; }
    
    if(!todas) {
        angular.forEach($scope.obrasGrupos, function(g){
            if(objeto.grupo == g.ide){
                if(tipo == 'obras'){visible = g.visibleObra; } else {visible = g.visibleIni; }
                if(visible){
                    enGrupo = true;   
                }
            }
        });
    } else {
        enGrupo = true;
    } 
    return enGrupo;  
}
$scope.filtroSegmento = function(tipo, objeto){
    var enSegmento = false;
    var visible;
    var todas;
    
    if(tipo == 'obras'){ todas = $scope.obrasTodosSegmentos; } else { todas = $scope.iniTodosSegmentos; }
    
    if(!todas) {
        angular.forEach($scope.obrasSegmentos, function(s){
            if(objeto.segmento == s.ide){
                if(tipo == 'obras'){visible = s.visibleObra; } else {visible = s.visibleIni; }
                if(visible){
                    enSegmento = true;   
                }
            }
        });
    } else {
        enSegmento = true;
    } 
    return enSegmento;  
}
$scope.filtroPlan = function(tipo, objeto){
    
    var enPlan = false;
    var visible;
    var todas;
    
    if(tipo == 'obras'){ todas = $scope.obrasTodosPlanes; } else { todas = $scope.iniTodosPlanes; }
    
    if(!todas) {
        angular.forEach($scope.obrasPlanes, function(p){
            if(objeto.plan == g.ide){
                if(tipo == 'obras'){visible = p.visibleObra; } else {visible = p.visibleIni; }
                if(visible){
                    enPlan = true;   
                }
            }
        });
    } else {
        enPlan = true;
    } 
    return enPlan;  
}

$scope.cambiarValoresSelect = function(j, lista, listaLarga, registro, tipo){
    
    var visible;
    var valor = false;
    
    if(j == "todas"){
        listaLarga = true;
        angular.forEach(lista, function(k){
            if(tipo=='obras'){visible=k.visibleObra}else{visible=k.visibleIni}
            visible = true;
        });
        if(registro != j){
            valor = true;
        }
    } else {
        listaLarga = false;
        angular.forEach(lista, function(k){
            if(tipo=='obras'){visible=k.visibleObra}else{visible=k.visibleIni}
            if(k.ide == j.ide){
                visible = true;
            } else {
                visible = false;   
            }
        });
        if(registro == j.ide){
            valor = true;
        }
    }
    return valor;
}
/*
* --------------------- FIN Metodos para los filtros OBRAS o INICIATIVAS ---------------------
*/
 
 
/*
 *  Mostrar COMUNA UNICAMENTE Filtro de OBRAS
 */  
$scope.mostrarComunaObras = function(c){
    c.visibleObra = !c.visibleObra;
        angular.forEach($scope.mObra, function(o){
            var enComuna, enJurisdiccion, enEstado, enGrupo, enSegmento, enRelevancia = false;
            if(!c.visibleObra){
            	enComuna = !$scope.filtroComuna('obras', o);
            } else {
                angular.forEach(o.comuna, function(oc){
                    if(oc == c.ide){
                        enComuna = true;
                    }
                }); 
            }
            enRelevancia = $scope.filtroRelevancia('obras', o);
            enJurisdiccion = $scope.filtroJurisdiccion('obras', o);
            enEstado = $scope.filtroEstado('obras', o);
            enGrupo = $scope.filtroGrupo('obras', o);
            enSegmento = $scope.filtroSegmento('obras', o);
            if(enComuna && enJurisdiccion && enEstado && enGrupo && enSegmento && enRelevancia){
                if(!c.visibleObra){
                    if(o.visible){
                        $scope.miMapa.removeMarker(o.ide);
                        o.visible = false;
                    }   
                } else {
                    if(!o.visible){
                        $scope.cargarMarkerObra(o);
                        o.visible = true;
                    }
                }
            }
        });  
    
    $scope.verificarEstadosComunas();
}
/*
 *  Mostrar Relevancias solo relevancias en filtros unicament para OBRAS
 */
$scope.mostrarRelevanciaObras = function(r){
    r.visibleObra = !r.visibleObra;
    angular.forEach($scope.mObra, function(o){
        var relevancia, comuna = false;
        
        if(o.prioridad == r.ide){
            relevancia = true;
        }
        
        comuna = $scope.filtroComuna('obras', o);

        if(comuna && relevancia){
            if(!r.visibleObra){
                if(o.visible){
                    $scope.miMapa.removeMarker(o.ide);
                    o.visible = false;
                }  
            } else {
                if(!o.visible) {
                    $scope.cargarMarkerObra(o);
                    o.visible = true;
                }  
            }
            
            }
    }); 
    $scope.verificarEstadosRelevancias();
}
/*
 *  Mostrar Jurisdiccion en OBRAS
 */ 
$scope.mostrarJurisdiccionObras = function(h){
    var j = $scope.convertirJson(h);
    angular.forEach($scope.mObra, function(o){
        var enComuna, enJurisdiccion, enRelevancia, enEstado, enGrupo, enSegmento = false;
            
        if(j == "todas"){
            $scope.obrasTodasJurisdicciones = true;
            angular.forEach($scope.obrasJurisdicciones, function(k){
                k.visibleObra = true;
            });
            if(o.jurisdiccion != j){
                enJurisdiccion = true;
            }
        } else {
            $scope.obrasTodasJurisdicciones = false;
            angular.forEach($scope.obrasJurisdicciones, function(k){
                if(k.ide == j.ide){
                    k.visibleObra = true;
                } else {
                    k.visibleObra = false;   
                }
            });
            if(o.jurisdiccion == j.ide){
                enJurisdiccion = true;
            }
        }
        
        enComuna = $scope.filtroComuna('obras', o);
        enRelevancia = $scope.filtroRelevancia('obras', o);
        enEstado = $scope.filtroEstado('obras', o);
        enGrupo = $scope.filtroGrupo('obras', o);
        enSegmento = $scope.filtroSegmento('obras', o);
        
        if(enJurisdiccion && enRelevancia && enEstado && enGrupo && enSegmento && enComuna){
            if(!o.visible) {
                $scope.cargarMarkerObra(o);
                o.visible = true;
            }
        } else {
            if(o.visible) {
                $scope.miMapa.removeMarker(o.ide);
                o.visible = false;
            }
        }
    });
}
/*
 *  Mostrar Estados en OBRAS
 */ 
$scope.mostrarEstadoObras = function(h){
    var e = $scope.convertirJson(h);
    angular.forEach($scope.mObra, function(o){
        var enComuna, enJurisdiccion, enRelevancia, enEstado, enGrupo, enSegmento = false;
        if(e == "todas"){
            $scope.obrasTodosEstados = true;
            angular.forEach($scope.obrasEstados, function(k){
                k.visibleObra = true;
            });
            if(o.estado != e){
                enEstado = true;
            }
        } else {
            $scope.obrasTodosEstados = false;
            angular.forEach($scope.obrasEstados, function(k){
                if(k.ide == e.ide){
                    k.visibleObra = true;
                } else {
                    k.visibleObra = false;   
                }
            });
            if(o.estado == e.ide){
                enEstado = true;
            }
        }
        
        enComuna = $scope.filtroComuna('obras', o);
        enJurisdiccion = $scope.filtroJurisdiccion('obras', o);
        enRelevancia = $scope.filtroRelevancia('obras', o);
        enGrupo = $scope.filtroGrupo('obras', o);
        enSegmento = $scope.filtroSegmento('obras', o);
        if(enEstado && enJurisdiccion && enRelevancia && enGrupo && enSegmento && enComuna){
            if(!o.visible) {
                $scope.cargarMarkerObra(o);
                o.visible = true;
            }
        } else {
            if(o.visible) {
                $scope.miMapa.removeMarker(o.ide);
                o.visible = false;
            }
        }            
    });
}
/*
 *  Mostrar Grupos en OBRAS
 */ 
$scope.mostrarGrupoObras = function(h){
    var g = $scope.convertirJson(h);
    angular.forEach($scope.mObra, function(o){
        var enComuna, enJurisdiccion, enRelevancia, enEstado, enGrupo, enSegmento = false;
        if(g == "todas"){
            $scope.obrasTodosGrupos = true;
            angular.forEach($scope.obrasGrupos, function(k){
                k.visibleObra = true;
            });
            if(o.grupo != g){
                enGrupo = true;
            }
        } else {
            $scope.obrasTodosGrupos = false;
            angular.forEach($scope.obrasGrupos, function(k){
                if(k.ide == g.ide){
                    k.visibleObra = true;
                } else {
                    k.visibleObra = false;   
                }
            });
            if(o.grupo == g.ide){
                enGrupo = true;
            }
        }
        
        enComuna = $scope.filtroComuna('obras', o);
        enJurisdiccion = $scope.filtroJurisdiccion('obras', o);
        enRelevancia = $scope.filtroRelevancia('obras', o);
        enEstado = $scope.filtroEstado('obras', o);
        enSegmento = $scope.filtroSegmento('obras', o);
        
        if(enJurisdiccion && enRelevancia && enEstado && enGrupo && enSegmento && enComuna){
            if(!o.visible) {
                $scope.cargarMarkerObra(o);
                o.visible = true;
            }
        } else {
            if(o.visible) {
                $scope.miMapa.removeMarker(o.ide);
                o.visible = false;
            }
        }            
    });
}
/*
 *  Mostrar Segmentos en OBRAS
 */ 
$scope.mostrarSegmentoObras = function(h){
    var s = $scope.convertirJson(h);
    angular.forEach($scope.mObra, function(o){
        var enComuna, enJurisdiccion, enRelevancia, enEstado, enGrupo, enSegmento = false;
        if(s == "todas"){
            $scope.obrasTodosSegmentos = true;
            angular.forEach($scope.obrasSegmentos, function(k){
                k.visibleObra = true;
            });
            if(o.segmento != s){
                enSegmento = true;
            }
        } else {
            $scope.obrasTodosSegmentos = false;
            angular.forEach($scope.obrasSegmentos, function(k){
                if(k.ide == s.ide){
                    k.visibleObra = true;
                } else {
                    k.visibleObra = false;   
                }
            });
            if(o.segmento == s.ide){
                enSegmento = true;
            }
        }
        
        enComuna = $scope.filtroComuna('obras', o);
        enJurisdiccion = $scope.filtroJurisdiccion('obras', o);
        enRelevancia = $scope.filtroRelevancia('obras', o);
        enEstado = $scope.filtroEstado('obras', o);
        enGrupo = $scope.filtroGrupo('obras', o);
        
        if(enJurisdiccion && enRelevancia && enEstado && enGrupo && enSegmento && enComuna){
            if(!o.visible) {
                $scope.cargarMarkerObra(o);
                o.visible = true;
            }
        } else {
            if(o.visible) {
                $scope.miMapa.removeMarker(o.ide);
                o.visible = false;
            }
        }            
    });
}






/*
 *  Verifica si todos las comunas estan en true o falase para poder cambiar el boton "Todas las comunas" o "Ninguna comuna"
 */
 $scope.verificarEstadosComunas = function(){
    var n = true;
    for(var i = 0; i < $scope.obrasComunas.length; i++){
        if(!$scope.obrasComunas[i].visibleObra){
          n = false;
          break;
        }
    }
    if(!n){
        $scope.obrasTodasComunas = false;
    } else {
        $scope.obrasTodasComunas = true;
    }
 }
/*
 *  Verifica si todos los estados de las relevancias 
 */
 $scope.verificarEstadosRelevancias = function(){
    var n = true;
    for(var i = 0; i < $scope.obrasRelevancias.length; i++){
        if(!$scope.obrasRelevancias[i].visibleObra){
          n = false;
          break;
        }
    }
    if(!n){
        $scope.obrasTodasRelevancias = false;
    } else {
        $scope.obrasTodasRelevancias = true;
    }
 }
/*
 * Carga marker mediante un solo registro OBRAS
 */
 $scope.cargarMarkerObra = function(o){
    var prioridad;
    var jurisdiccion = '<font color= "red">Sin encontrar</font>';
    var estado = '<font color= "red">Sin estado</font>';
    var grupo = '<font color= "red">Sin grupo</font>';
    var segmento = '<font color= "red">Sin segmento</font>';
    
    angular.forEach($scope.obrasRelevancias, function(r){
        if(r.ide == o.prioridad){
            prioridad = r.nombre;
        }
    });
    angular.forEach($scope.obrasGrupos, function(g){
        if(g.ide == o.grupo){
            grupo = g.nombre;
        }
    });
    angular.forEach($scope.obrasJurisdicciones, function(j){
        if(j.ide == o.jurisdiccion){
            jurisdiccion = j.nombre;
        }
    });
    angular.forEach($scope.obrasEstados, function(e){
        if(e.ide == o.estado){
            estado = e.nombre;
        }
    });
    angular.forEach($scope.obrasSegmentos, function(s){
        if(s.ide == o.segmento){
            segmento = s.nombre;
        }
    });
    var comuna = '';
    var i = 0;
    if(o.comuna.length != 0) {
        angular.forEach(o.comuna, function(comu){
            angular.forEach($scope.obrasComunas, function(comuB){
                if(comu == comuB.ide){
                    if(i == 0){
                        comuna += comuB.numero;
                        i++;
                    } else {
                        comuna += ',' + comuB.numero;
                    }
                }
            });
        });   
    } else {
        comuna = '<font color= "red">Sin comuna</font>';
    }
    var html = '<div class="conM"><div class="tituloM">' + o.nombre + '</div>'+
    '<div class="lineaM"><b>Direccion:</b> ' + o.direccion + '</div>'+
    '<div class="lineaM"><b>Relevancia:</b> ' + prioridad + '</div>'+
    '<div class="lineaM"><b>Comuna/s:</b> ' + comuna + '</div>'+
    '<div class="lineaM"><b>Jurisdiccion:</b> ' + jurisdiccion + '</div>'+
    '<div class="lineaM"><b>Estado:</b> ' + estado + '</div>'+
    '<div class="lineaM"><b>Segmento:</b> ' + segmento + '</div>'+
    '<div class="lineaM"><b>Grupo:</b> ' + grupo + '</div></div>';
    o.ide = $scope.miMapa.addMarker(o.direccion, false, html, {
        iconUrl: $scope.buscarIcono($scope.capas[0].color),
        iconWidth: 38,
        iconHeight: 50
    });
    o.visible = true;
 }
 
 /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *
 *  SECTOR DE INICIATIVAS
 *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

 /*
  * Carga marker mediante un solo registro INICIATIVA
  */
 $scope.cargarMarkerIni = function(o){
    var prioridad;
    angular.forEach($scope.iniRelevancias, function(r){
        if(r.ide == o.prioridad){
            prioridad = r.nombre;
        }
    });
    
    var comuna = '';
    var i = 0;
    if(o.comuna.length != 0) {
        angular.forEach(o.comuna, function(comu){
            angular.forEach($scope.iniComunas, function(comuB){
                if(comu == comuB.ide){
                    if(i == 0){
                        comuna += comuB.numero;
                        i++;
                    } else {
                        comuna += ',' + comuB.numero;
                    }
                }
            });
        });   
    } else {
        comuna = '<font color= "red">Sin comuna</font>';
    }
    var html = '<b>' + o.nombre + '</b><br/>'+
    'Direccion: <i>' + o.direccion + '</i><br/>'+
    'Relevancia: <i>' + prioridad + '</i><br/>'+
    'Comuna/s: <i>' + comuna + '</i>';
    o.ide = $scope.miMapa.addMarker(o.direccion, false, html, {
        iconUrl: $scope.buscarIcono($scope.capas[1].color),
        iconWidth: 38,
        iconHeight: 50
    });
    o.visible = true;
 }
/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *
 *  METODOS GENERALES
 *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
/*
 *  Buscar icono
 */     
    $scope.buscarIcono = function(valor) {
        switch(valor) {
            case 'rojo':
                return 'http://10.79.5.120:8080/components/mapa/images/marker.png';
            case 'amarrillo':
                return 'http://10.79.5.120:8080/components/mapa/images/marker_amarrillo.png';
            case 'azul':
                return 'http://10.79.5.120:8080/components/mapa/images/marker_azul.png';
            case 'verde':
                return 'http://10.79.5.120:8080/components/mapa/images/marker_verde.png';
            case 'violeta':
                return 'http://10.79.5.120:8080/components/mapa/images/marker_violeta.png';
            case 'rosa':
                return 'http://10.79.5.120:8080/components/mapa/images/marker_rosa.png';
            case 'celeste':
                return 'http://10.79.5.120:8080/components/mapa/images/marker_celeste.png';
            default:
                return 'http://10.79.5.120:8080/components/mapa/images/marker.png';
        }
    }
/*
 *  Buscar direcciones
 */     
    $scope.buscarDireccion = function(obra) {
        if(obra.calle) {
            if(obra.altura) {
                return obra.calle +' '+ obra.altura;
            } else {
                if(obra.cruce) {
                    return obra.calle + ' y ' + obra.cruce;
                } else {
                    return 0;
                }
            }
        } else {
            return 0;
        }
    }
/*
 *  Autocompletar en equiqueta de nombre "b"
 */
/*	var ac = new usig.AutoCompleter('buscador', {
       		//debug: true,
       		//rootUrl: '', // Por defecto esta configurado: "//servicios.usig.buenosaires.gob.ar/usig-js/3.1/" (Si sos Ema ¡NO TOCAR!)
       		skin: 'bootstrap', //Tenemos estos: "usig", "mapabsas", "bootstrap", "usig2", "usig3", "usig4", "dark" y "pro"
    });*/
});