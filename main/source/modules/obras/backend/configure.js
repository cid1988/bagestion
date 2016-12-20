exports = module.exports = function(app, conf) {
    var doAll = function(db, res, nombresJurisdicciones, nombresComunas, nombresReferentes, nombresTipos, nombresSubTipos, relevancias, nombresImpactos, alcances, criticidades, segmentosEtarios, segmentos, nombresEstados) {
        
        var tipoPorId = function(id) {
            for (var i = 0; i < nombresTipos.length; i++) {
                if (nombresTipos[i]._id == id) {
                    return nombresTipos[i];
                }
            }
        };
        
        var subtipoPorId = function(id) {
            for (var i = 0; i < nombresSubTipos.length; i++) {
                if (nombresSubTipos[i]._id == id) {
                    return nombresSubTipos[i];
                }
            }
        };
        
        var impactoPorId = function(id) {
            for (var i = 0; i < nombresImpactos.length; i++) {
                if (nombresImpactos[i]._id == id) {
                    return nombresImpactos[i];
                }
            }
        };
        
        var relevanciaPorId = function(id) {
            for (var i = 0; i < relevancias.length; i++) {
                if (relevancias[i]._id == id) {
                    return relevancias[i];
                }
            }
        };
        
        var alcancePorId = function(id) {
            for (var i = 0; i < alcances.length; i++) {
                if (alcances[i]._id == id) {
                    return alcances[i];
                }
            }
        };
        
        var criticidadPorId = function(id) {
            for (var i = 0; i < criticidades.length; i++) {
                if (criticidades[i]._id == id) {
                    return criticidades[i];
                }
            }
        };
        
        var segmentoEtarioPorId = function(id) {
            for (var i = 0; i < segmentosEtarios.length; i++) {
                if (segmentosEtarios[i]._id == id) {
                    return segmentosEtarios[i];
                }
            }
        };
        
        var segmentoPorId = function(id) {
            for (var i = 0; i < segmentos.length; i++) {
                if (segmentos[i]._id == id) {
                    return segmentos[i];
                }
            }
        };
        
        var jurisdiccionPorId = function(id) {
            for (var i = 0; i < nombresJurisdicciones.length; i++) {
                if (nombresJurisdicciones[i]._id == id) {
                    return nombresJurisdicciones[i];
                }
            }
        };
        
        var estadoPorId = function(id) {
            for (var i = 0; i < nombresEstados.length; i++) {
                if (nombresEstados[i]._id == id) {
                    return nombresEstados[i];
                }
            }
        };
        
        var comunaPorId = function(id) {
            for (var i = 0; i < nombresComunas.length; i++) {
                if (nombresComunas[i]._id == id) {
                    return nombresComunas[i];
                }
            }
        };
        
        var contactoPorId = function(id) {
            for (var i = 0; i < nombresReferentes.length; i++) {
                if (nombresReferentes[i]) {
                    if (nombresReferentes[i]._id) {
                        if (nombresReferentes[i]._id == id) {
                            return nombresReferentes[i].apellidos + ", " + nombresReferentes[i].nombre;
                        }
                    }
                }
            }
        };
        
        var arrayPorId = function(array) {
            var comunas = "";
            if (array) {
                for (var i = 0; i < array.length; i++) {
                    if (comunaPorId(array[i])) {
                        comunas = comunas + comunaPorId(array[i]).nombre;
                        if (i + 1 < array.length) {
                            comunas = comunas + ", ";
                        }
                    }
                }
            }
            return comunas;
        };
        
        var moment = require("moment");
        var diaHoy = moment(new Date());
        
        var calcularEstado = function(obra){
            if(filtroAIniciar(obra)){
                return "A Iniciar";
            }
            if(filtroNoIniciada(obra)){
                return "No Iniciada";
            }
            if(filtroEnEjecucion(obra)){
                return "En Ejecución";
            }
            if(filtroPosibilidadAtraso(obra)){
                return "Pos. de Atraso";
            }
            if(filtroAtrasadas(obra)){
                return "Atrasada";
            }
            if(filtroFinATiempo(obra)){
                return "Fin a Tiempo";
            }
            if(filtroFinFueraPlazo(obra)){
                return "Fuera de Plazo";
            }
        };
        
        var filtroAIniciar = function(i){
            if(
                (i.inicios && i.inicios.length && i.inicios.slice(-1)[0]) && ((!i.inicios.slice(-1)[0].cumplido) || (i.inicios.slice(-1)[0].cumplido == false)) &&
                (diaHoy <= moment(i.inicios.slice(-1)[0].fecha,"DD/MM/YYYY"))
            ){
                return true;
            }else{
                return false;
            }
        };
        
        var filtroNoIniciada = function(i){
            if(
                (!i.inicios || !i.inicios.length) || (i.inicios && i.inicios.length && i.inicios.slice(-1)[0]) && ((!i.inicios.slice(-1)[0].cumplido) || (i.inicios.slice(-1)[0].cumplido == false)) &&
                (diaHoy > moment(i.inicios.slice(-1)[0].fecha,"DD/MM/YYYY"))
            ){
                return true;
            }else{
                return false;
            }
        };
        
        var filtroEnEjecucion = function(i){
            if(
                (i.inicios && i.inicios.length && i.inicios.slice(-1)[0] && i.inicios.slice(-1)[0].cumplido && i.inicios.slice(-1)[0].cumplido == true) &&
                (i.final && i.final.length && i.final.slice(-1)[0] && (!i.final.slice(-1)[0].cumplido || i.final.slice(-1)[0].cumplido == false)) &&//Agregado despues
                (diaHoy <= moment(i.final.slice(-1)[0].fecha,"DD/MM/YYYY")) &&
                ((!i.fisico || !i.fisico.length) || ((i && i.fisico && i.fisico.length) && (!i.fisico.slice(-1)[0].posibleAtraso)) || ((i && i.fisico && i.fisico.length) && (i.fisico.slice(-1)[0].posibleAtraso == false)))
            ){
                return true;
            }else{
                return false;
            }
        };
        
        var filtroPosibilidadAtraso = function(i){
            if(
                (i && i.inicios && i.inicios.length && i.inicios.slice(-1)[0].cumplido == true) &&
                (i && i.final && i.final.length && i.final.slice(-1)[0].fecha && (diaHoy <= moment(i.final.slice(-1)[0].fecha,"DD/MM/YYYY"))) &&
                (i && i.fisico && i.fisico.length && i.fisico.slice(-1)[0].posibleAtraso == true)
            ){
                return true;
            }else{
                return false;
            }
        };
        
        var filtroAtrasadas = function(i){
            if(
                (i.inicios && i.inicios.length && i.inicios.slice(-1)[0] && i.inicios.slice(-1)[0].cumplido) && (i.inicios.slice(-1)[0].cumplido == true) &&
                (i.final && i.final.length && i.final.slice(-1)[0]) && ((!i.final.slice(-1)[0].cumplido) || (i.final.slice(-1)[0].cumplido == false)) &&
                (diaHoy > moment(i.final.slice(-1)[0].fecha,"DD/MM/YYYY"))
            ){
                return true;
            }else{
                return false;
            }
        };
        
        var filtroFinATiempo = function(i){
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
        
        var filtroFinFueraPlazo = function(i){
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
        
        var calcularFecha = function(fecha){
            if(fecha){
                if(fecha.length == 8 && moment(fecha,"YYYYMMDD")){
                    return moment(fecha,"YYYYMMDD").format("DD/MM/YYYY")
                }else{
                    return moment(new Date(fecha)).format("DD/MM/YYYY")
                }
            }else{
                return ""
            }
        };
        
        var all = [
            [
            /*Identificacion*/"Nombre Corto", "Nombre Largo", "ID", "Etapa", "Siglas", "Referencia de Mapa", "Plan", "Legislativo", "Expedientes", "Codigo Anterior",
            /*Ubicacion*/"Calle", "Altura", "Cruce", "Seccion", "Manzana", "Parcela", "U.F.", "Barrio", "Comuna", "Provincia", "Pais", "C.P.", "Grilla Coordenadas", "Partida Matriz", "UTIU", "Region Sanitaria", "Distrito Escolar", "Comisaria Policia Metropolitana",
            /*Clasificacion*/"Tipo", "Subtipo","Impacto", "Segmento", "Presentación",
            /*Alcance*/"Jurisdicción", "Sigla de Jurisdicción", "Nombre Corto de Jurisdicción", "Dependencia", "Referente Ejecución", "Plazo Completo", "Fecha Objetivo", "Comentario Objetivo", "Monto", "Fecha valor", "Año", "Ejercicio", "Jurisdiccion", "Entidad", "Programa", "Proyecto", "Actividad", "Obra", "Fuente Fin", "Moneda", "Inciso", "Principal", "Parcial", "Ubic Geo", "Prioridad", "Criticidad", "Alcance", "Segmento Etario", "Ciudadanos Afectados", "Metros Cuadrados", "Descripción Alcance",
            /*Proyecto*/"Fecha Proyecto", "Fuente Proyecto", "Comentario Proyecto",
            /*Contrato*/"Fecha Contrato", "Fuente Contrato", "Comentario Contrato",
            /*Inicio*/"Fecha Inicio", "Fuente Inicio", "Comentario Inicio",
            /*Avance*/"Fecha Relevamiento Avance", "Relevamiento Avance", "Porcentaje Avance", "Comentarios Avance",
            /*Duracion*/"Duración",
            /*Final*/"Fecha Final", "Fuente Final", "Comentario Final", "Status",
            /*Comunicacion*/"Inaugurable", "Visitable", "Comunicable", "Participable", "Inicio Estimado", "Fin Estimado", "Inauguración Estimada", "Detalle Comunicación", "Ubicacion Comunicación",
            /*Estado*/"Estado",
            /*Relevamiento Inicio*/"Fecha Relev. Inicio", "Relevamiento", "Comentarios",
            /*Relevamiento final*/"Fecha Relev. Final", "Relevamiento", "Comentarios", "Fecha de Creación", "Fecha Última Modificación"]
        ];
        
        db.collection('obras').find({}).each(function(err, item) {
            if (err) {
                res.status(503);
                console.log(err);
                return res.end();
            }
            
            if (item) {
                try {
                    item.contratos && item.contratos[item.contratos.length - 1] && item.contratos[item.contratos.length - 1].fuente && contactoPorId(item.contratos[item.contratos.length - 1].fuente),
                    item.inicios && item.inicios[item.inicios.length - 1] && item.inicios[item.inicios.length - 1].fuente && contactoPorId(item.inicios[item.inicios.length - 1].fuente)
                }
                catch (e) {
                    return "";
                }
                
                all.push([
                    //Identificacion
                    item.nombre,
                    item.nombre_largo,
                    item._id,
                    item.etapa,
                    item.siglas,
                    item.ref_mapa,
                    item.plan,
                    item.legislativo,
                    item.expediente,
                    item.codigo_anterior,
                    //Ubicacion
                    item.calle,
                    item.altura,
                    item.cruce,
                    item.seccion,
                    item.manzana,
                    item.parcela,
                    item.unidad_funcional,
                    item.barrio,
                    item.comuna && arrayPorId(item.comuna),
                    item.provincia,
                    item.pais,
                    item.codigo_postal,
                    item.coordenadas,
                    item.partida_matriz,
                    item.utiu,
                    item.region_sanitaria,
                    item.distrito_escolar,
                    item.comisaria_pm,
                    //Clasificacion
                    item.tipo && tipoPorId(item.tipo) && tipoPorId(item.tipo).nombre,
                    item.subtipo && subtipoPorId(item.subtipo) && subtipoPorId(item.subtipo).nombre,
                    item.impacto && impactoPorId(item.impacto) && impactoPorId(item.impacto).nombre,
                    item.orden1 && segmentoPorId(item.orden1) && segmentoPorId(item.orden1).nombre,
                    item.orden2,
                    //Alcance
                    item.jurisdiccion && jurisdiccionPorId(item.jurisdiccion) && jurisdiccionPorId(item.jurisdiccion).nombreCompleto,
                    item.jurisdiccion && jurisdiccionPorId(item.jurisdiccion) && jurisdiccionPorId(item.jurisdiccion).sigla,
                    item.jurisdiccion && jurisdiccionPorId(item.jurisdiccion) && jurisdiccionPorId(item.jurisdiccion).nombreCortoOrganigrama,
                    item.dependencia && jurisdiccionPorId(item.dependencia) && jurisdiccionPorId(item.dependencia).nombreCompleto,
                    item.referente && contactoPorId(item.referente),
                    item.plazo_completo,
                    item.objetivo && item.objetivo[item.objetivo.length - 1] && item.objetivo[item.objetivo.length - 1].fecha,
                    item.objetivo && item.objetivo[item.objetivo.length - 1] && item.objetivo[item.objetivo.length - 1].comentario,
                    item.nombrar && item.nombrar[item.nombrar.length - 1] && item.nombrar[item.nombrar.length - 1].monto,
                    item.nombrar && item.nombrar[item.nombrar.length - 1] && item.nombrar[item.nombrar.length - 1].fecha_valor,
                    item.nombrar && item.nombrar[item.nombrar.length - 1] && item.nombrar[item.nombrar.length - 1].partida_anio,
                    item.presupuestoSigaf && item.presupuestoSigaf[item.presupuestoSigaf.length - 1] && item.presupuestoSigaf[item.presupuestoSigaf.length - 1].ejercicio,
                    item.presupuestoSigaf && item.presupuestoSigaf[item.presupuestoSigaf.length - 1] && item.presupuestoSigaf[item.presupuestoSigaf.length - 1].partida_jur,
                    item.presupuestoSigaf && item.presupuestoSigaf[item.presupuestoSigaf.length - 1] && item.presupuestoSigaf[item.presupuestoSigaf.length - 1].partida_ent,
                    item.presupuestoSigaf && item.presupuestoSigaf[item.presupuestoSigaf.length - 1] && item.presupuestoSigaf[item.presupuestoSigaf.length - 1].partida_pr,
                    item.presupuestoSigaf && item.presupuestoSigaf[item.presupuestoSigaf.length - 1] && item.presupuestoSigaf[item.presupuestoSigaf.length - 1].partida_proy,
                    item.presupuestoSigaf && item.presupuestoSigaf[item.presupuestoSigaf.length - 1] && item.presupuestoSigaf[item.presupuestoSigaf.length - 1].partida_act,
                    item.presupuestoSigaf && item.presupuestoSigaf[item.presupuestoSigaf.length - 1] && item.presupuestoSigaf[item.presupuestoSigaf.length - 1].partida_obra,
                    item.presupuestoSigaf && item.presupuestoSigaf[item.presupuestoSigaf.length - 1] && item.presupuestoSigaf[item.presupuestoSigaf.length - 1].partida_ff,
                    item.presupuestoSigaf && item.presupuestoSigaf[item.presupuestoSigaf.length - 1] && item.presupuestoSigaf[item.presupuestoSigaf.length - 1].partida_mon,
                    item.presupuestoSigaf && item.presupuestoSigaf[item.presupuestoSigaf.length - 1] && item.presupuestoSigaf[item.presupuestoSigaf.length - 1].partida_inc,
                    item.presupuestoSigaf && item.presupuestoSigaf[item.presupuestoSigaf.length - 1] && item.presupuestoSigaf[item.presupuestoSigaf.length - 1].partida_pri,
                    item.presupuestoSigaf && item.presupuestoSigaf[item.presupuestoSigaf.length - 1] && item.presupuestoSigaf[item.presupuestoSigaf.length - 1].partida_par,
                    item.presupuestoSigaf && item.presupuestoSigaf[item.presupuestoSigaf.length - 1] && item.presupuestoSigaf[item.presupuestoSigaf.length - 1].partida_ubg,
                    item.relevancia && relevanciaPorId(item.relevancia) && relevanciaPorId(item.relevancia).nombre,
                    item.criticidad && criticidadPorId(item.criticidad) && criticidadPorId(item.criticidad).nombre,
                    item.alcance && alcancePorId(item.alcance) && alcancePorId(item.alcance).nombre,
                    item.segmento_etario && segmentoEtarioPorId(item.segmento_etario) && segmentoEtarioPorId(item.segmento_etario).nombre,
                    item.ciudadanos,
                    item.metros,
                    item.descripcionesAlcance && item.descripcionesAlcance[item.descripcionesAlcance.length - 1] && item.descripcionesAlcance[item.descripcionesAlcance.length - 1].descripcion && item.descripcionesAlcance[item.descripcionesAlcance.length - 1].descripcion.replace(/\r\n|\n|\r/g, " "),
                    //Proyecto
                    item.proyectos && item.proyectos[item.proyectos.length - 1] && item.proyectos[item.proyectos.length - 1].fecha,
                    item.proyectos && item.proyectos[item.proyectos.length - 1] && item.proyectos[item.proyectos.length - 1].fuente && contactoPorId(item.proyectos[item.proyectos.length - 1].fuente),
                    item.proyectos && item.proyectos[item.proyectos.length - 1] && item.proyectos[item.proyectos.length - 1].comentario && item.proyectos[item.proyectos.length - 1].comentario.replace(/\r\n|\n|\r/g, " "),
                    //Contrato
                    item.contratos && item.contratos[item.contratos.length - 1] && item.contratos[item.contratos.length - 1].fecha,
                    item.contratos && item.contratos[item.contratos.length - 1] && item.contratos[item.contratos.length - 1].fuente && contactoPorId(item.contratos[item.contratos.length - 1].fuente),
                    item.contratos && item.contratos[item.contratos.length - 1] && item.contratos[item.contratos.length - 1].comentario && item.contratos[item.contratos.length - 1].comentario.replace(/\r\n|\n|\r/g, " "),
                    //Inicio
                    item.inicios && item.inicios[item.inicios.length - 1] && item.inicios[item.inicios.length - 1].fecha,
                    item.inicios && item.inicios[item.inicios.length - 1] && item.inicios[item.inicios.length - 1].fuente && contactoPorId(item.inicios[item.inicios.length - 1].fuente),
                    item.inicios && item.inicios[item.inicios.length - 1] && item.inicios[item.inicios.length - 1].comentario && item.inicios[item.inicios.length - 1].comentario.replace(/\r\n|\n|\r/g, " "),
                    //Avance
                    item.fisico && item.fisico[item.fisico.length - 1] && item.fisico[item.fisico.length - 1].fechaOkIniRel,
                    item.fisico && item.fisico[item.fisico.length - 1] && item.fisico[item.fisico.length - 1].relevamiento,
                    item.fisico && item.fisico[item.fisico.length - 1] && item.fisico[item.fisico.length - 1].avance,
                    item.fisico && item.fisico[item.fisico.length - 1] && item.fisico[item.fisico.length - 1].observacionesRelevamiento && item.fisico[item.fisico.length - 1].observacionesRelevamiento.replace(/\r\n|\n|\r/g, " "),
                    //Duracion
                    item.duracion && item.duracion[item.duracion.length - 1] && item.duracion[item.duracion.length - 1].duracion && item.duracion[item.duracion.length - 1].duracion,
                    //Final
                    item.final && item.final[item.final.length - 1] && item.final[item.final.length - 1].fecha,
                    item.final && item.final[item.final.length - 1] && item.final[item.final.length - 1].fuente && contactoPorId(item.final[item.final.length - 1].fuente),
                    item.final && item.final[item.final.length - 1] && item.final[item.final.length - 1].comentario && item.final[item.final.length - 1].comentario.replace(/\r\n|\n|\r/g, " "),
                    calcularEstado(item),
                    //Comunicacion
                    item.inaugurable,
                    item.visitable,
                    item.comunicable,
                    item.participable,
                    item.fec_inicio,
                    item.fec_fin,
                    item.fec_inauguracion,
                    item.detallesComunicacion && item.detallesComunicacion[item.detallesComunicacion.length - 1] && item.detallesComunicacion[item.detallesComunicacion.length - 1].detalle.replace(/\r\n|\n|\r/g, " "),
                    item.ubicacionesComunicacion && item.ubicacionesComunicacion[item.ubicacionesComunicacion.length - 1] && item.ubicacionesComunicacion[item.ubicacionesComunicacion.length - 1].detalle.replace(/\r\n|\n|\r/g, " "),
                    //Estado
                    item.estado && estadoPorId(item.estado) && estadoPorId(item.estado).nombre,
                    //item.direccionesMapa && item.direccionesMapa[0] && "Si",
                    //Relevamiento inicio
                    item.iniciosRel && item.iniciosRel[item.iniciosRel.length - 1] && item.iniciosRel[item.iniciosRel.length - 1].fechaOkIniRel && item.iniciosRel[item.iniciosRel.length - 1].fechaOkIniRel.replace(/\r\n|\n|\r/g, " "),
                    item.iniciosRel && item.iniciosRel[item.iniciosRel.length - 1] && item.iniciosRel[item.iniciosRel.length - 1].relevamiento && item.iniciosRel[item.iniciosRel.length - 1].relevamiento.replace(/\r\n|\n|\r/g, " "),
                    item.iniciosRel && item.iniciosRel[item.iniciosRel.length - 1] && item.iniciosRel[item.iniciosRel.length - 1].observacionesRelevamiento && item.iniciosRel[item.iniciosRel.length - 1].observacionesRelevamiento.replace(/\r\n|\n|\r/g, " "),
                    //Relevamiento final
                    item.finalRel && item.finalRel[item.finalRel.length - 1] && item.finalRel[item.finalRel.length - 1].fechaOkIniRel && item.finalRel[item.finalRel.length - 1].fechaOkIniRel.replace(/\r\n|\n|\r/g, " "),
                    item.finalRel && item.finalRel[item.finalRel.length - 1] && item.finalRel[item.finalRel.length - 1].relevamiento && item.finalRel[item.finalRel.length - 1].relevamiento.replace(/\r\n|\n|\r/g, " "),
                    item.finalRel && item.finalRel[item.finalRel.length - 1] && item.finalRel[item.finalRel.length - 1].observacionesRelevamiento && item.finalRel[item.finalRel.length - 1].observacionesRelevamiento.replace(/\r\n|\n|\r/g, " "),
                    calcularFecha(item.fechaAgregado),
                    calcularFecha(item.ultimaModificacion)
                ]);
            }
            else {
                //res.setHeader("Content-Disposition", "attachment; filename=\"obras.csv\"");
                //res.csv(all);
                db.collection('obras2').find({}).each(function(err, item) {
                    if (err) {
                        res.status(503);
                        console.log(err);
                        return res.end();
                    }
                    
                    if (item) {
                        try {
                            item.contratos && item.contratos[item.contratos.length - 1] && item.contratos[item.contratos.length - 1].fuente && contactoPorId(item.contratos[item.contratos.length - 1].fuente),
                            item.inicios && item.inicios[item.inicios.length - 1] && item.inicios[item.inicios.length - 1].fuente && contactoPorId(item.inicios[item.inicios.length - 1].fuente)
                        }
                        catch (e) {
                            return "";
                        }
                        
                        all.push([
                            //Identificacion
                            item.nombre,
                            item.nombre_largo,
                            item._id,
                            item.etapa,
                            item.siglas,
                            item.ref_mapa,
                            item.plan,
                            item.legislativo,
                            item.expediente,
                            item.codigo_anterior,
                            //Ubicacion
                            item.calle,
                            item.altura,
                            item.cruce,
                            item.seccion,
                            item.manzana,
                            item.parcela,
                            item.unidad_funcional,
                            item.barrio,
                            item.comuna && arrayPorId(item.comuna),
                            item.provincia,
                            item.pais,
                            item.codigo_postal,
                            item.coordenadas,
                            item.partida_matriz,
                            item.utiu,
                            item.region_sanitaria,
                            item.distrito_escolar,
                            item.comisaria_pm,
                            //Clasificacion
                            item.tipo && tipoPorId(item.tipo) && tipoPorId(item.tipo).nombre,
                            item.subtipo && subtipoPorId(item.subtipo) && subtipoPorId(item.subtipo).nombre,
                            item.impacto && impactoPorId(item.impacto) && impactoPorId(item.impacto).nombre,
                            item.orden1 && segmentoPorId(item.orden1) && segmentoPorId(item.orden1).nombre,
                            item.orden2,
                            //Alcance
                            item.jurisdiccion && jurisdiccionPorId(item.jurisdiccion) && jurisdiccionPorId(item.jurisdiccion).nombreCompleto,
                            item.jurisdiccion && jurisdiccionPorId(item.jurisdiccion) && jurisdiccionPorId(item.jurisdiccion).sigla,
                            item.jurisdiccion && jurisdiccionPorId(item.jurisdiccion) && jurisdiccionPorId(item.jurisdiccion).nombreCortoOrganigrama,
                            item.dependencia && jurisdiccionPorId(item.dependencia) && jurisdiccionPorId(item.dependencia).nombreCompleto,
                            item.referente && contactoPorId(item.referente),
                            item.plazo_completo,
                            item.objetivo && item.objetivo[item.objetivo.length - 1] && item.objetivo[item.objetivo.length - 1].fecha,
                            item.objetivo && item.objetivo[item.objetivo.length - 1] && item.objetivo[item.objetivo.length - 1].comentario,
                            item.nombrar && item.nombrar[item.nombrar.length - 1] && item.nombrar[item.nombrar.length - 1].monto,
                            item.nombrar && item.nombrar[item.nombrar.length - 1] && item.nombrar[item.nombrar.length - 1].fecha_valor,
                            item.nombrar && item.nombrar[item.nombrar.length - 1] && item.nombrar[item.nombrar.length - 1].partida_anio,
                            item.presupuestoSigaf && item.presupuestoSigaf[item.presupuestoSigaf.length - 1] && item.presupuestoSigaf[item.presupuestoSigaf.length - 1].ejercicio,
                            item.presupuestoSigaf && item.presupuestoSigaf[item.presupuestoSigaf.length - 1] && item.presupuestoSigaf[item.presupuestoSigaf.length - 1].partida_jur,
                            item.presupuestoSigaf && item.presupuestoSigaf[item.presupuestoSigaf.length - 1] && item.presupuestoSigaf[item.presupuestoSigaf.length - 1].partida_ent,
                            item.presupuestoSigaf && item.presupuestoSigaf[item.presupuestoSigaf.length - 1] && item.presupuestoSigaf[item.presupuestoSigaf.length - 1].partida_pr,
                            item.presupuestoSigaf && item.presupuestoSigaf[item.presupuestoSigaf.length - 1] && item.presupuestoSigaf[item.presupuestoSigaf.length - 1].partida_proy,
                            item.presupuestoSigaf && item.presupuestoSigaf[item.presupuestoSigaf.length - 1] && item.presupuestoSigaf[item.presupuestoSigaf.length - 1].partida_act,
                            item.presupuestoSigaf && item.presupuestoSigaf[item.presupuestoSigaf.length - 1] && item.presupuestoSigaf[item.presupuestoSigaf.length - 1].partida_obra,
                            item.presupuestoSigaf && item.presupuestoSigaf[item.presupuestoSigaf.length - 1] && item.presupuestoSigaf[item.presupuestoSigaf.length - 1].partida_ff,
                            item.presupuestoSigaf && item.presupuestoSigaf[item.presupuestoSigaf.length - 1] && item.presupuestoSigaf[item.presupuestoSigaf.length - 1].partida_mon,
                            item.presupuestoSigaf && item.presupuestoSigaf[item.presupuestoSigaf.length - 1] && item.presupuestoSigaf[item.presupuestoSigaf.length - 1].partida_inc,
                            item.presupuestoSigaf && item.presupuestoSigaf[item.presupuestoSigaf.length - 1] && item.presupuestoSigaf[item.presupuestoSigaf.length - 1].partida_pri,
                            item.presupuestoSigaf && item.presupuestoSigaf[item.presupuestoSigaf.length - 1] && item.presupuestoSigaf[item.presupuestoSigaf.length - 1].partida_par,
                            item.presupuestoSigaf && item.presupuestoSigaf[item.presupuestoSigaf.length - 1] && item.presupuestoSigaf[item.presupuestoSigaf.length - 1].partida_ubg,
                            item.relevancia && relevanciaPorId(item.relevancia) && relevanciaPorId(item.relevancia).nombre,
                            item.criticidad && criticidadPorId(item.criticidad) && criticidadPorId(item.criticidad).nombre,
                            item.alcance && alcancePorId(item.alcance) && alcancePorId(item.alcance).nombre,
                            item.segmento_etario && segmentoEtarioPorId(item.segmento_etario) && segmentoEtarioPorId(item.segmento_etario).nombre,
                            item.ciudadanos,
                            item.metros,
                            item.descripcionesAlcance && item.descripcionesAlcance[item.descripcionesAlcance.length - 1] && item.descripcionesAlcance[item.descripcionesAlcance.length - 1].descripcion && item.descripcionesAlcance[item.descripcionesAlcance.length - 1].descripcion.replace(/\r\n|\n|\r/g, " "),
                            //Proyecto
                            item.proyectos && item.proyectos[item.proyectos.length - 1] && item.proyectos[item.proyectos.length - 1].fecha,
                            item.proyectos && item.proyectos[item.proyectos.length - 1] && item.proyectos[item.proyectos.length - 1].fuente && contactoPorId(item.proyectos[item.proyectos.length - 1].fuente),
                            item.proyectos && item.proyectos[item.proyectos.length - 1] && item.proyectos[item.proyectos.length - 1].comentario && item.proyectos[item.proyectos.length - 1].comentario.replace(/\r\n|\n|\r/g, " "),
                            //Contrato
                            item.contratos && item.contratos[item.contratos.length - 1] && item.contratos[item.contratos.length - 1].fecha,
                            item.contratos && item.contratos[item.contratos.length - 1] && item.contratos[item.contratos.length - 1].fuente && contactoPorId(item.contratos[item.contratos.length - 1].fuente),
                            item.contratos && item.contratos[item.contratos.length - 1] && item.contratos[item.contratos.length - 1].comentario && item.contratos[item.contratos.length - 1].comentario.replace(/\r\n|\n|\r/g, " "),
                            //Inicio
                            item.inicios && item.inicios[item.inicios.length - 1] && item.inicios[item.inicios.length - 1].fecha,
                            item.inicios && item.inicios[item.inicios.length - 1] && item.inicios[item.inicios.length - 1].fuente && contactoPorId(item.inicios[item.inicios.length - 1].fuente),
                            item.inicios && item.inicios[item.inicios.length - 1] && item.inicios[item.inicios.length - 1].comentario && item.inicios[item.inicios.length - 1].comentario.replace(/\r\n|\n|\r/g, " "),
                            //Avance
                            item.fisico && item.fisico[item.fisico.length - 1] && item.fisico[item.fisico.length - 1].fechaOkIniRel,
                            item.fisico && item.fisico[item.fisico.length - 1] && item.fisico[item.fisico.length - 1].relevamiento,
                            item.fisico && item.fisico[item.fisico.length - 1] && item.fisico[item.fisico.length - 1].avance,
                            item.fisico && item.fisico[item.fisico.length - 1] && item.fisico[item.fisico.length - 1].observacionesRelevamiento && item.fisico[item.fisico.length - 1].observacionesRelevamiento.replace(/\r\n|\n|\r/g, " "),
                            //Duracion
                            item.duracion && item.duracion[item.duracion.length - 1] && item.duracion[item.duracion.length - 1].duracion && item.duracion[item.duracion.length - 1].duracion,
                            //Final
                            item.final && item.final[item.final.length - 1] && item.final[item.final.length - 1].fecha,
                            item.final && item.final[item.final.length - 1] && item.final[item.final.length - 1].fuente && contactoPorId(item.final[item.final.length - 1].fuente),
                            item.final && item.final[item.final.length - 1] && item.final[item.final.length - 1].comentario && item.final[item.final.length - 1].comentario.replace(/\r\n|\n|\r/g, " "),
                            calcularEstado(item),
                            //Comunicacion
                            item.inaugurable,
                            item.visitable,
                            item.comunicable,
                            item.participable,
                            item.fec_inicio,
                            item.fec_fin,
                            item.fec_inauguracion,
                            item.detallesComunicacion && item.detallesComunicacion[item.detallesComunicacion.length - 1] && item.detallesComunicacion[item.detallesComunicacion.length - 1].detalle.replace(/\r\n|\n|\r/g, " "),
                            item.ubicacionesComunicacion && item.ubicacionesComunicacion[item.ubicacionesComunicacion.length - 1] && item.ubicacionesComunicacion[item.ubicacionesComunicacion.length - 1].detalle.replace(/\r\n|\n|\r/g, " "),
                            //Estado
                            item.estado && estadoPorId(item.estado) && estadoPorId(item.estado).nombre,
                            //item.direccionesMapa && item.direccionesMapa[0] && "Si",
                            //Relevamiento inicio
                            item.iniciosRel && item.iniciosRel[item.iniciosRel.length - 1] && item.iniciosRel[item.iniciosRel.length - 1].fechaOkIniRel && item.iniciosRel[item.iniciosRel.length - 1].fechaOkIniRel.replace(/\r\n|\n|\r/g, " "),
                            item.iniciosRel && item.iniciosRel[item.iniciosRel.length - 1] && item.iniciosRel[item.iniciosRel.length - 1].relevamiento && item.iniciosRel[item.iniciosRel.length - 1].relevamiento.replace(/\r\n|\n|\r/g, " "),
                            item.iniciosRel && item.iniciosRel[item.iniciosRel.length - 1] && item.iniciosRel[item.iniciosRel.length - 1].observacionesRelevamiento && item.iniciosRel[item.iniciosRel.length - 1].observacionesRelevamiento.replace(/\r\n|\n|\r/g, " "),
                            //Relevamiento final
                            item.finalRel && item.finalRel[item.finalRel.length - 1] && item.finalRel[item.finalRel.length - 1].fechaOkIniRel && item.finalRel[item.finalRel.length - 1].fechaOkIniRel.replace(/\r\n|\n|\r/g, " "),
                            item.finalRel && item.finalRel[item.finalRel.length - 1] && item.finalRel[item.finalRel.length - 1].relevamiento && item.finalRel[item.finalRel.length - 1].relevamiento.replace(/\r\n|\n|\r/g, " "),
                            item.finalRel && item.finalRel[item.finalRel.length - 1] && item.finalRel[item.finalRel.length - 1].observacionesRelevamiento && item.finalRel[item.finalRel.length - 1].observacionesRelevamiento.replace(/\r\n|\n|\r/g, " "),
                            calcularFecha(item.fechaAgregado),
                            calcularFecha(item.ultimaModificacion)
                        ]);
                    }else{
                        res.setHeader("Content-Disposition", "attachment; filename=\"obras.csv\"");
                        res.csv(all);
                    }
                });
            }
        });
    };
    
    require('express-csv');
    app.get('/api/obras-csv/download', function(req, res) {
        require('../../../db.js').setConf(conf);
        require('../../../db.js').getDbInstance(function(err, db) {
            if (err) {
                res.status(503);
                console.log(err);
                return res.end();
            }
            
            db.collection('orm.organigrama').find({}).toArray(function(err, nombresJurisdicciones) {
                db.collection('comunas').find({}).toArray(function(err, nombresComunas) {
                    db.collection('orm.contactos').find({}).toArray(function(err, nombresReferentes) {
                        db.collection('obras.tipos').find({}).toArray(function(err, nombresTipos) {
                            db.collection('obras.subtipos').find({}).toArray(function(err, nombresSubtipos) {
                                db.collection('iniciativas.relevancias').find({}).toArray(function(err, relevancias) {
                                    db.collection('iniciativas.impactos').find({}).toArray(function(err, nombresImpactos) {
                                        db.collection('iniciativas.alcances').find({}).toArray(function(err, alcances) {
                                            db.collection('iniciativas.criticidades').find({}).toArray(function(err, criticidades) {
                                                db.collection('iniciativas.segmentos').find({}).toArray(function(err, segmentosEtarios) {
                                                    db.collection('iniciativas.orden1').find({}).toArray(function(err, segmentos) {
                                                        db.collection('iniciativas.estados').find({}).toArray(function(err, nombresEstados) {
                                                            doAll(db, res, nombresJurisdicciones, nombresComunas, nombresReferentes, nombresTipos, nombresSubtipos, relevancias, nombresImpactos, alcances, criticidades, segmentosEtarios, segmentos, nombresEstados);
                                                        });
                                                    });
                                                });
                                            });
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    });
    
    //Descarga csv con imagenes separadas en celdas de la columna
    app.get('/api/obras-csvXImagen/download', function(req, res) {
        require('../../../db.js').setConf(conf);
        require('../../../db.js').getDbInstance(function(err, db) {
            if (err) {
                res.status(503);
                console.log(err);
                return res.end();
            }
            
            var all = [["ID","Fecha Objetivo","Monto","Imagenes"]];
        
            db.collection('obras').find({}).each(function(err, item) {
                if (err) {
                    res.status(503);
                    console.log(err);
                    return res.end();
                }
                
                if(item) {
                    for(var i=0;i<item.fotos.length;i++){
                        all.push([
                            item._id,
                            item.objetivo && item.objetivo[item.objetivo.length - 1] && item.objetivo[item.objetivo.length - 1].fecha,
                            item.nombrar && item.nombrar[item.nombrar.length - 1] && item.nombrar[item.nombrar.length - 1].monto,
                            item.fotos[i].fotoId,
                        ]);
                    }
                }else{
                    db.collection('obras2').find({}).each(function(err, item) {
                        if (err) {
                            res.status(503);
                            console.log(err);
                            return res.end();
                        }
                        
                        if (item) {
                            for(var i=0;i<item.fotos.length;i++){
                                all.push([
                                    item._id,
                                    item.objetivo && item.objetivo[item.objetivo.length - 1] && item.objetivo[item.objetivo.length - 1].fecha,
                                    item.nombrar && item.nombrar[item.nombrar.length - 1] && item.nombrar[item.nombrar.length - 1].monto,
                                    item.fotos[i].fotoId,
                                ]);
                            }
                        }else{
                            res.setHeader("Content-Disposition", "attachment; filename=\"obras.csv\"");
                            res.csv(all);
                        }
                    });
                }
            });
        });
    });
    
    app.post('/api/obras/consultar-smp', function(req, res) {
        var smp = req.body.smp,
            url = 'http://inventario.usig.buenosaires.gob.ar/publico/getParcelaFichaTecnica/?callback=&smp=' + smp,
            request = require('request');
        
        request({
            url: url,
        }, function(err, res, body) {
            if (err) {
                console.error(err);
                res.status(418);
                return res.end();
            }
            
            try {
                var json = body.slice(1, body.length - 1),
                    data = JSON.parse(json);

                res.json(data);
            }
            catch (e) {
                console.error(e);
                res.status(418);
                res.end();
            }
        });
    });

    app.post('/api/descargar-mapa-obras', function(req, res) {
        function error(err) {
            res.status(503);
            console.log(err);
            return res.end();
        }

        require('../../../db.js').setConf(conf);
        require('../../../db.js').getDbInstance(function(err, db) {
            var ObjectID = require('mongodb').ObjectID;
            if (err) return error(err);

            var predicate = {
                _id: {
                    $in: []
                }
            };

            for (var i = 0; i < req.body.length; i++) {
                predicate._id.$in.push(new ObjectID(req.body[i]));
            }
            db.collection("obras").find(predicate).toArray(function(err, docs) {
                if (err) return error(err);

                require('./geocodificar')(docs, function(err, geojson) {
                    if (err) return error(err);

                    res.json(geojson);
                });
            });
        });
    });
    
    app.get('/api/consulta-obras-con-presupuesto-sigaf', function (req, res) {
        require('../../../db.js').setConf(conf);
        require('../../../db.js').getDbInstance(function(err, db) {
            db
            .collection('obras')
            .find({
                $where: 'this.presupuestoSigaf && this.presupuestoSigaf.length > 0'
            })
            .toArray(function (err, docs) {
                if (err) {
                    console.error(err);
                    res.status(503);
                    return res.end();
                }
                
                res.json (docs);
            });
        });
    });
    
    //--------------------------------------------------------------------------------------------------------------
    //CONSULTA SIGAF
    app.post('/api/consulta-sigaf', function (req, res) {
        var request = require('request'),
            xpath = require('xpath'),
            dom = require('xmldom').DOMParser;
        
        var r = req.body;
        
        var body = '<soapenv:Envelope xmlns:soapenv=\"http:\/\/schemas.xmlsoap.org\/soap\/envelope\/\" xmlns:tem=\"http:\/\/tempuri.org\/\" xmlns:wcf=\"http:\/\/schemas.datacontract.org\/2004\/07\/WCF_ENTIDADES\"><soapenv:Header\/><soapenv:Body><tem:ConsultarPartidaPresupuestaria><tem:cp><wcf:Actividad>' + r.actividad + '<\/wcf:Actividad><wcf:Ejercicio>' + r.ejercicio + '<\/wcf:Ejercicio><wcf:Entidad>' + r.entidad + '<\/wcf:Entidad><wcf:FueFin>' + r.fueFinan + '<\/wcf:FueFin><wcf:Inciso>' + r.inciso + '<\/wcf:Inciso><wcf:Jurisdiccion>' + r.jurisdiccion + '<\/wcf:Jurisdiccion><wcf:Moneda>' + r.moneda + '<\/wcf:Moneda><wcf:Obra>' + r.obra + '<\/wcf:Obra><wcf:Parcial>' + r.parcial + '<\/wcf:Parcial><wcf:Principal>' + r.principal + '<\/wcf:Principal><wcf:Programa>' + r.programa + '<\/wcf:Programa><wcf:Proyecto>' + r.proyecto + '<\/wcf:Proyecto><wcf:SubJurisdiccion>' + r.subjurisdiccion + '<\/wcf:SubJurisdiccion><wcf:SubParcial>' + r.subparcial + '<\/wcf:SubParcial><wcf:SubPrograma>' + r.subprograma + '<\/wcf:SubPrograma><wcf:UbicaGeo>' + r.ubicacionGeografica + '<\/wcf:UbicaGeo><wcf:idimput>' + r.idimput + '<\/wcf:idimput><\/tem:cp><\/tem:ConsultarPartidaPresupuestaria><\/soapenv:Body><\/soapenv:Envelope>';
        
        var options = {
          url: 'http://ws-bac.hacienda-gcba.gov.ar:83/wcfroot/Servicio.svc',
          headers: {
            'Content-Type': 'text/xml;charset=UTF-8',
            'SOAPAction': '"http://tempuri.org/IServicio/ConsultarPartidaPresupuestaria"',
            'User-Agent': 'request'
          },
          method: 'POST',
          body: body
        };
        
        request(options, function (err, message, body) {
        if (err) {
          console.error(err);
          res.status(418);
          return res.end();
        }
        
        try{
            var doc = new dom().parseFromString(body);
            
            var resultado = {
                definitivo: xpath.select("//*[local-name(.)='Indicativa']/*[local-name(.)='Definitivo']", doc)[0].firstChild.nodeValue,
                devengado: xpath.select("//*[local-name(.)='Indicativa']/*[local-name(.)='Devengado']", doc)[0].firstChild.nodeValue,
                pagado: xpath.select("//*[local-name(.)='Indicativa']/*[local-name(.)='Pagado']", doc)[0].firstChild.nodeValue,
                preventivo: xpath.select("//*[local-name(.)='Indicativa']/*[local-name(.)='Preventivo']", doc)[0].firstChild.nodeValue,
                restringido: xpath.select("//*[local-name(.)='Indicativa']/*[local-name(.)='Restringido']", doc)[0].firstChild.nodeValue,
                vigente: xpath.select("//*[local-name(.)='Indicativa']/*[local-name(.)='Vigente']", doc)[0].firstChild.nodeValue
            };
          
            res.json(resultado);
            }catch (e) {
              console.error(err);
              res.status(418);
              return res.end();
            }
         });
     });
    
    //IMPORTAR EXCEL
    var xlsxj = require("xlsx-to-json");
    
    app.post(conf.api.prefix + '/obras/importExcel', function(req,res) {
        xlsxj({
            input: ("/home/dev/workspace/main/source/uploads/" + req.body[0].id),
            output: null
        }, function(err, result) {
            if(err) {
              console.error(err);
            }else {
                console.log(result);
                res.send(result);
            }
        });
    });
    //FIN IMPORTACION EXCEL
    
    app.post('/api/mapaASI', function (req, res) {
        require('../../../db.js').getDbInstance(function(err, db){
            db.collection('comunas').find({}).toArray(function(err, comunas) {
                db.collection('obras.tipos').find({}).toArray(function(err, tipos) {
                    db.collection('obras.subtipos').find({}).toArray(function(err, subtipos) {
                        db.collection('orm.organigrama').find({}).toArray(function(err, jurisdicciones) {
                            db.collection('orm.contactos').find({}).toArray(function(err, contactos) {
                                db.collection('iniciativas.relevancias').find({}).toArray(function(err, prioridades) {
                                    db.collection('obras.proveedores').find({}).toArray(function(err, proveedores) {
                                        db.collection('obras.relevamientos').find({}).toArray(function(err, relevamientos) {
                                            db.collection('obras.mapaAsi').drop(function(datos){
                                                db.collection('obras.mapaAsi.fotos').drop(function(fotos){
                                                    var obrasUno=db.collection("obras"), obrasDos=db.collection("obras2");
                                                    var todasObras;
                                                    var obrasMapaAsi=db.collection('obras.mapaAsi');
                                                    var mapaAsiFotos=db.collection('obras.mapaAsi.fotos');
                                                    
                                                    function contactoPorId(id) {
                                                        for (var i = 0; i < contactos.length; i++) {
                                                            if (contactos[i]._id == id){
                                                                if(contactos[i].apellidos || contactos[i].nombre){
                                                                    return contactos[i].apellidos + ", " + contactos[i].nombre;
                                                                }else{
                                                                    return "";
                                                                }
                                                            }
                                                        }
                                                    }
                                                    
                                                    function tipoPorId (id) {
                                                        for (var i = 0; i < tipos.length; i++) {
                                                            if (tipos[i]._id == id){
                                                                return tipos[i].nombre;
                                                            }
                                                        }
                                                    }
                                                    
                                                    function subtipoPorId (id) {
                                                        for (var i = 0; i < subtipos.length; i++) {
                                                            if (subtipos[i]._id == id){
                                                                return subtipos[i].nombre;
                                                            }
                                                        }
                                                    }
                                                    
                                                    function descripcionComunicacion(descComunicacion) {
                                                        if(descComunicacion && descComunicacion.length){
                                                            return descComunicacion.slice(-1)[0].detalle;
                                                        }else{
                                                            return "";
                                                        }
                                                    }
                                                    
                                                    function comunaPorId (id) {
                                                        for (var i = 0; i < comunas.length; i++) {
                                                            if (comunas[i]._id == id){
                                                                return comunas[i];
                                                            }
                                                        }
                                                    }
                                                    
                                                    function prioridadPorId (id) {
                                                        for (var i = 0; i < prioridades.length; i++) {
                                                            if (prioridades[i]._id == id){
                                                                return prioridades[i].nombre;
                                                            }
                                                        }
                                                    }
                                                    
                                                    function jurisdiccionPorId (id) {
                                                        for (var i = 0; i < jurisdicciones.length; i++) {
                                                            if (jurisdicciones[i]._id == id){
                                                                return jurisdicciones[i].nombreCompleto;
                                                            }
                                                        }
                                                    }
                                                    
                                                    function proveedorPorId (id) {
                                                        for (var i = 0; i < proveedores.length; i++) {
                                                            if (proveedores[i]._id == id){
                                                                return proveedores[i].nombre;
                                                            }
                                                        }
                                                    }
                                                    
                                                    function listaComunasPorId (array){
                                                        var comunas = "";
                                                        if(array) {
                                                            for (var i = 0; i < array.length; i++) {
                                                                if (comunaPorId(array[i])) {
                                                                    comunas = comunas + comunaPorId(array[i]).nombre;
                                                                    if (i + 1 < array.length) {
                                                                        comunas = comunas + ", ";
                                                                    }
                                                                }
                                                            }
                                                        }
                                                        return comunas;
                                                    }
                                                    
                                                    function ultimo (lista){
                                                        if(lista && lista.slice(-1)[0] && lista.slice(-1)[0].fecha){
                                                            return lista.slice(-1)[0].fecha;
                                                        }else{
                                                            return "";
                                                        }
                                                    }
                                                    
                                                    function ultimoMonto (lista){
                                                        if(lista && lista.slice(-1)[0] && lista.slice(-1)[0].monto){
                                                            return lista.slice(-1)[0].monto;
                                                        }else{
                                                            return "";
                                                        }
                                                    }
                                                    
                                                    function ultimaDuracion (lista){
                                                        if(lista && lista.slice(-1)[0] && lista.slice(-1)[0].duracion){
                                                            return lista.slice(-1)[0].duracion;
                                                        }else{
                                                            return "";
                                                        }
                                                    }
                                                    
                                                    function buscarImagenes (lista){
                                                        if(lista){
                                                            var obj = [];
                                                            for (var i = 0; i < lista.length; i++) {
                                                                obj.push(lista[i].fotoId);
                                                            }
                                                            return obj;
                                                        }
                                                    }
                                                    
                                                    function buscarProveedor (proyectos){
                                                        if(proyectos && proyectos.length > 0){
                                                            var ultimoProyecto = proyectos.slice(-1)[0];
                                                            if(ultimoProyecto.proveedor){
                                                                if(ultimoProyecto.intExt == "int" || ultimoProyecto.intExtCum == "int"){
                                                                    for(var i=0;i<contactos.length;i++){
                                                                        if(ultimoProyecto.proveedor == contactos[i]._id){
                                                                            return contactos[i].apellidos + ", " + contactos[i].nombre;
                                                                        }
                                                                    }
                                                                }
                                                                if(ultimoProyecto.intExt == "ext" || ultimoProyecto.intExtCum == "ext"){
                                                                    for(var i=0;i<proveedores.length;i++){
                                                                        if(ultimoProyecto.proveedor == proveedores[i]._id){
                                                                            return proveedores[i].apellidos + ", " + proveedores[i].nombre;
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                    
                                                    var moment = require("moment");
                                                    
                                                    function corregirFecha(fecha){
                                                        if(fecha){
                                                            if(typeof(fecha) == "string"){
                                                                var fe = moment(fecha,"YYYYMMDD").format("DD/MM/YYYY");
                                                                return fe;
                                                            }else if(typeof(fecha) == "number"){
                                                                var f = moment(fecha).format("DD/MM/YYYY");
                                                                return f;
                                                            }
                                                        }else{
                                                            return ""
                                                        }
                                                    }
                                                    
                                                    //Filtros de estado
                                                    var diaHoy = moment(new Date());
                                                    
                                                    function calcularEstado(obra){
                                                        if(filtroAIniciar(obra)){
                                                            return "A Iniciar";
                                                        }
                                                        if(filtroNoIniciada(obra)){
                                                            return "No Iniciada"
                                                        }
                                                        if(filtroEnEjecucion(obra)){
                                                            return "En Ejecución"
                                                        }
                                                        if(filtroPosibilidadAtraso(obra)){
                                                            return "Pos. de Atraso"
                                                        }
                                                        if(filtroAtrasadas(obra)){
                                                            return "Atrasada"
                                                        }
                                                        if(filtroFinATiempo(obra)){
                                                            return "Fin a Tiempo"
                                                        }
                                                        if(filtroFinFueraPlazo(obra)){
                                                            return "Fuera de Plazo"
                                                        }
                                                    };
                                                    
                                                    function filtroAIniciar(i){
                                                        if(
                                                            (i.inicios && i.inicios.length && i.inicios.slice(-1)[0]) && ((!i.inicios.slice(-1)[0].cumplido) || (i.inicios.slice(-1)[0].cumplido == false)) &&
                                                            (diaHoy <= moment(i.inicios.slice(-1)[0].fecha,"DD/MM/YYYY"))
                                                        ){
                                                            return true;
                                                        }else{
                                                            return false;
                                                        }
                                                    };
                                                    
                                                    function filtroNoIniciada(i){
                                                        if(
                                                            (!i.inicios || !i.inicios.length) || (i.inicios && i.inicios.length && i.inicios.slice(-1)[0]) && ((!i.inicios.slice(-1)[0].cumplido) || (i.inicios.slice(-1)[0].cumplido == false)) &&
                                                            (diaHoy > moment(i.inicios.slice(-1)[0].fecha,"DD/MM/YYYY"))
                                                        ){
                                                            return true;
                                                        }else{
                                                            return false;
                                                        }
                                                    };
                                                    
                                                    function filtroEnEjecucion(i){
                                                        if(
                                                            (i.inicios && i.inicios.length && i.inicios.slice(-1)[0] && i.inicios.slice(-1)[0].cumplido && i.inicios.slice(-1)[0].cumplido == true) &&
                                                            (i.final && i.final.length && i.final.slice(-1)[0] && (!i.final.slice(-1)[0].cumplido || i.final.slice(-1)[0].cumplido == false)) &&//Agregado despues
                                                            (diaHoy <= moment(i.final.slice(-1)[0].fecha,"DD/MM/YYYY")) &&
                                                            ((!i.fisico || !i.fisico.length) || ((i && i.fisico && i.fisico.length) && (!i.fisico.slice(-1)[0].posibleAtraso)) || ((i && i.fisico && i.fisico.length) && (i.fisico.slice(-1)[0].posibleAtraso == false)))
                                                        ){
                                                            return true;
                                                        }else{
                                                            return false;
                                                        }
                                                    };
                                                    
                                                    function filtroPosibilidadAtraso(i){
                                                        if(
                                                            (i && i.inicios && i.inicios.length && i.inicios.slice(-1)[0].cumplido == true) &&
                                                            (i && i.final && i.final.length && i.final.slice(-1)[0].fecha && (diaHoy <= moment(i.final.slice(-1)[0].fecha,"DD/MM/YYYY"))) &&
                                                            (i && i.fisico && i.fisico.length && i.fisico.slice(-1)[0].posibleAtraso == true)
                                                        ){
                                                            return true;
                                                        }else{
                                                            return false;
                                                        }
                                                    };
                                                    
                                                    function filtroAtrasadas(i){
                                                        if(
                                                            (i.inicios && i.inicios.length && i.inicios.slice(-1)[0] && i.inicios.slice(-1)[0].cumplido) && (i.inicios.slice(-1)[0].cumplido == true) &&
                                                            (i.final && i.final.length && i.final.slice(-1)[0]) && ((!i.final.slice(-1)[0].cumplido) || (i.final.slice(-1)[0].cumplido == false)) &&
                                                            (diaHoy > moment(i.final.slice(-1)[0].fecha,"DD/MM/YYYY"))
                                                        ){
                                                            return true;
                                                        }else{
                                                            return false;
                                                        }
                                                    };
                                                    
                                                    function filtroFinATiempo(i){
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
                                                    
                                                    function filtroFinFueraPlazo(i){
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
                                                    //Fin filtros de estado
                                                    var ObjectID = require('mongodb').ObjectID;
                                                    
                                                    obrasUno.find({estado:'52e90195491f2d16f8bc1bc8'}).toArray(function(err, obras1){//Solo traemos las obras aprobadas
                                                        obrasDos.find({estado:'52e90195491f2d16f8bc1bc8'}).toArray(function(err, obras2){
                                                            todasObras = obras1.concat(obras2);
                                                            
                                                            for(var o=0;o<todasObras.length;o++){
                                                                var arrayRelevamientos = [],visita = 0;
                                                                for(var i=0;i<relevamientos.length;i++){
                                                                    if(todasObras[o]._id == relevamientos[i].obra){
                                                                        if(relevamientos[i].visitaN > visita){
                                                                            if(relevamientos[i].fotos.length > 0){
                                                                                visita = relevamientos[i].visitaN;
                                                                                arrayRelevamientos = relevamientos[i].fotos;
                                                                            }
                                                                        }
                                                                    }
                                                                }
                                                                if(arrayRelevamientos){
                                                                    for(var a=0;a<arrayRelevamientos.length;a++){
                                                                        mapaAsiFotos.insert({
                                                                            idObra: new ObjectID(todasObras[o]._id),
                                                                            foto: arrayRelevamientos[a].fotoId
                                                                        },function(){
                                                                            
                                                                        });
                                                                    }
                                                                }
                                                                
                                                                obrasMapaAsi.insert({
                                                                    _id: new ObjectID(todasObras[o]._id),
                                                                    nombre_corto: todasObras[o].nombre || "",
                                                                    nombre_largo: todasObras[o].nombre_largo || "",
                                                                    plan: todasObras[o].plan || "",
                                                                    calle: todasObras[o].calle || "",
                                                                    altura: todasObras[o].altura || "",
                                                                    cruce: todasObras[o].cruce || "",
                                                                    barrio: todasObras[o].barrio || "",
                                                                    comuna: listaComunasPorId(todasObras[o].comuna),
                                                                    tipo: tipoPorId(todasObras[o].tipo) || "",
                                                                    subtipo: subtipoPorId(todasObras[o].subtipo) || "",
                                                                    jurisdiccion: jurisdiccionPorId(todasObras[o].jurisdiccion) || "",
                                                                    referente_ejecucion: contactoPorId(todasObras[o].referente) || "",
                                                                    fecha_objetivo: ultimo(todasObras[o].objetivo) || "",
                                                                    monto: ultimoMonto(todasObras[o].nombrar) || "",
                                                                    prioridad: prioridadPorId(todasObras[o].relevancia) || "",
                                                                    descripcion_alcance: descripcionComunicacion(todasObras[o].detallesComunicacion) || "",
                                                                    fecha_inicio: ultimo(todasObras[o].inicios) || "",
                                                                    duracion: ultimaDuracion(todasObras[o].duracion) || "",
                                                                    fecha_final: ultimo(todasObras[o].final) || "",
                                                                    estado: calcularEstado(todasObras[o]) || "",
                                                                    expediente: todasObras[o].expediente || "",
                                                                    contratista: buscarProveedor(todasObras[o].proyectos) || "",
                                                                    inaugurable: todasObras[o].inaugurable || "",
                                                                    visitable: todasObras[o].visitable || "",
                                                                    comunicable: todasObras[o].comunicable || "",
                                                                    participable: todasObras[o].participable || "",
                                                                    fecha_alta: corregirFecha(todasObras[o].fechaAgregado) || "",
                                                                    coordenadas: todasObras[o].coordenadas || "",
                                                                    fechaUltimaModificacion: corregirFecha(todasObras[o].ultimaModificacion) || ""
                                                                },function(){
                                                                    
                                                                });
                                                            }
                                                        });
                                                    });
                                                });
                                            });
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
     });
};