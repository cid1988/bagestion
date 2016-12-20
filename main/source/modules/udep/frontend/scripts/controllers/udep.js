angular.module('bag2.udep', []) //flowChart para usar el flowChart en diseño
.controller('UDEPCtrl', function($scope,UDEP, Proyectos, Jurisdicciones, $http, User, UDEPReportes) {
    $scope.udep= UDEP.query();
    $scope.user = User.findByName({
        username: $scope.username
    }, function() {
        if ($scope.hasPermission('udep.administrador') || $scope.hasPermission('udep.verTodos')) {
    	    $scope.udep = UDEP.query();
        } else if ($scope.user.jurisdiccion && $scope.hasPermission('udep.verJurisdiccion')) {
            $scope.udep = UDEP.query({
                jurisdiccion : $scope.user.jurisdiccion
            });
        } else {
            $scope.udep = [];
        }
    });
    $scope.jurisdicciones= Jurisdicciones.query({
            $and:JSON.stringify([{eliminado: {$exists:false}},
            {anio: 2016}])});
    $scope.proyectos = Proyectos.query({
            $and:JSON.stringify([{eliminado: {$exists:false}},
            {anio: 2016}])});
    
    $scope.nuevoReporte=new UDEPReportes();
    
    $scope.aMilisegundos = function(fecha) 
    {
        var fechaDividida = fecha.split("/");
        var date = new Date(fechaDividida[2], fechaDividida[1] - 1, fechaDividida[0], 0, 0, 0, 0);
        return date.getTime();
    };

    $scope.filtroPresupuesto=function(ba)
    {
        if($scope.presupuestoFiltroSolicitado)
        {
            if(ba.presupuestoSolicitado)
            {
                if($scope.presupuestoFiltroSolicitado<=ba.presupuestoSolicitado)
                {
                    return true;
                }
                else
                {
                    return false;
                }
            }
            else
            {
                return false;
            }
        }
        else
        {
            return true;
        }
    };
    
    $scope.filtroFechaFin=function(ba)
    {
        var fechaMaxima=0;
        var fechaFinRegistro=0;
        
        if($scope.fechaFiltroFin)
        {
            if(ba.fechaFin)
            {
                fechaFinRegistro=$scope.aMilisegundos(ba.fechaFin);
                fechaMaxima=$scope.aMilisegundos($scope.fechaFiltroFin);
                if(fechaMaxima>=fechaFinRegistro)
                {
                    return true;
                }
                else
                {
                    return false;
                }
            }
            else
            {
                return false;
            }
        }
        else
        {
            return true;
        }
    };
    
    $scope.filtroFechas=function(ba)
    {
        var fechaMinima=0;
        var fechaMaxima=0;
        var fechaInicioRegistro=0;
        var fechaFinRegistro=0;
        
        // Si estan ingresando datos en los dos campos con fechas para comparar
        if($scope.fechaInicio && $scope.fechaFin)
        {
            if((ba.fechaInicio)&&(ba.fechaFin))
            {
                fechaInicioRegistro=$scope.aMilisegundos(ba.fechaInicio); 
                fechaFinRegistro=$scope.aMilisegundos(ba.fechaFin);
                
                fechaMinima=$scope.aMilisegundos($scope.fechaInicio);
                fechaMaxima=$scope.aMilisegundos($scope.fechaFin);
                if((fechaMinima<=fechaInicioRegistro)&&(fechaMaxima>=fechaFinRegistro))
                {
                    return true;
                }
                else
                {
                    return false;
                }
            }
            else
            {
                return false;
            }
        }
        else if($scope.fechaInicio)
        {
            if(ba.fechaInicio)
            {
                fechaInicioRegistro=$scope.aMilisegundos(ba.fechaInicio); 
                fechaMinima=$scope.aMilisegundos($scope.fechaInicio);
                if(fechaMinima<=fechaInicioRegistro)
                {
                    return true;
                }
                else
                {
                    return false;
                }
            }
            else
            {
                return false;
            }
        }
        else if($scope.fechaFin)
        {
            if(ba.fechaFin)
            {
                fechaFinRegistro=$scope.aMilisegundos(ba.fechaFin);
                fechaMaxima=$scope.aMilisegundos($scope.fechaFin);
                if(fechaMaxima>=fechaFinRegistro)
                {
                    return true;
                }
                else
                {
                    return false;
                }
            }
            else
            {
                return false;
            }
        }
        else
        {
            return true;
        }
    };
    
    $scope.jurisdiccionesPOA = Jurisdicciones.query();
    
    $scope.jurisdiccionReal = function(id) {
      for (var i = 0; i < $scope.jurisdiccionesPOA.length; i++) {
          if ($scope.jurisdiccionesPOA[i]._id == id) {
              if ($scope.jurisdiccionesPOA[i].idOrmOrganigrama) { 
                return $scope.jurisdiccionesPOA[i].idOrmOrganigrama;
              } else if ($scope.jurisdiccionesPOA[i].idsOrmOrganigrama) {
                return $scope.jurisdiccionesPOA[i].idsOrmOrganigrama[0];
              }
          }
      }  
    };
    
    $scope.diaHoy = function () {
      function pad(s) { return (s < 10) ? '0' + s : s; }
      var d = new Date();
      return [pad(d.getDate()), pad(d.getMonth()+1), d.getFullYear()].join('/');
    };
    
    $scope.enviarMail=function(dato,variable)
    {
        $scope.enviando = true;
        if(variable==true)
        {
            $scope.data = {
                _id:dato._id,
                responsableDeCarga:dato.responsableDeCarga+"@buenosaires.gob.ar",
                nombre:dato.nombre,
                descripcion:dato.descripcion,
                fechaInicio:dato.fechaInicio,
                fechaFin:dato.fechaFin,
                monto:dato.monto,
                mensaje:"<font size='3'>Hola [nombre de la persona]:<br><br>"+
                    "Te escribimos porque tu programa cumple con los criterios establecidos por la Unidad de "+
                    "Evaluación de Programas (UdEP), en consecuencia te pedimos que completes el siguiente "+
                    "formulario. La información que nos proveas nos posibilitará conocer mejor tu programa para diseñar "+
                    "juntos una estrategia de monitoreo y evaluación que te permita mejorar su impacto y mostrar sus resultados. <br>"+
                    "A través del siguiente link vas a acceder al formulario: http://bagestion.gcba.gob.ar/udep/"+dato._id+"<br>"+
                    "La incorporación de métodos de evaluación resulta imprescindible para conocer el desempeño de "+
                    "los programas desarrollados, lo cual también fomenta un uso transparente y eficaz de los recursos y "+
                    "favorece intervenciones públicas de mayor calidad. <br>"+
                    "Junto con el formulario vas a encontrar instructivos que podés consultar a la hora de completar la "+
                    "Cadena de Resultados y la Matriz. Si tenés alguna duda, comunícate con nosotros: </font><br><br><br>"+
                    "<font size='2'>udep@buenosaires.gob.ar <br>"+
                    "Saludos, <br>"+
                    "Equipo de Evaluación de Programas</font>",
                asuntoCorreo:"Formulario de Evaluación de Programas"
            };
            $("#enviarMail").modal('show');
        }
        else
        {
            var payload = {
                asunto: dato.asuntoCorreo,
                para: dato.responsableDeCarga, 
                mensajeHtml: "<div class='mailwrapper'>"+dato.mensaje+"</div>",      
                from : "<udep@buenosaires.gob.ar>"
            };
            
            $http.post('/api/udepMail/enviar-mail', payload).success(function() {
                $scope.enviando = false;
            }).error(function() {
                $scope.enviando = false;
                alert("Fallo el envio");
            });
        }
    };
            
    $scope.guardar=function(dato,variable)
    {
        var cantidadCampos=0;
            if(variable==true)
            {
                $scope.proyecto = Proyectos.get({'_id': dato._id},function(){
                    $scope.proyecto.formulario='Si';
                    if($scope.proyecto.nombre){cantidadCampos++;}
                    if($scope.proyecto.descripcion){cantidadCampos++;}
                    if($scope.proyecto.fechaInicio){cantidadCampos++;}
                    if($scope.proyecto.fechaFin){cantidadCampos++;}
                    if($scope.proyecto.responsableDeCarga){cantidadCampos++;}
                    if($scope.proyecto.monto){cantidadCampos++;}
                    cantidadCampos=cantidadCampos*(100/33);
                    $scope.proyecto.$save(function(){
                        $scope.newFud=new UDEP({
                            idProyecto : $scope.proyecto._id,
                            jurisdiccion : $scope.jurisdiccionReal($scope.proyecto.idJurisdiccion),
                            nombreDelPrograma : $scope.proyecto.nombre,
                            resumenDelPrograma : $scope.proyecto.descripcion,
                            fechaInicio : $scope.proyecto.fechaInicio,
                            fechaFin : $scope.proyecto.fechaFin,
                            personaResponsable : $scope.proyecto.responsableDeCarga,
                            presupuestoSolicitado : $scope.proyecto.monto,
                            anio : $scope.proyecto.anio,
                            pregunta1 : 'No',
                            pregunta2 : 'No',
                            pregunta3 : 'No',
                            pregunta4 : 'No',
                            pregunta5 : 'No',
                            pregunta6 : 'No',
                            pregunta7 : 'No',
                            pregunta8 : 'No',
                            pregunta9 : 'No',
                            pregunta10 : 'No',
                            pregunta11 : 'No',
                            pregunta12 : 'No',
                            porcentajeCompletado: Math.floor(cantidadCampos),
                            indicadoresImpacto:[],
                            mediosImpacto:[],
                            supuestosImpacto:[],
                            indicadoresResultado:[],
                            mediosResultado:[],
                            supuestosResultado:[],
                            productoSolo:[],
                            indicadoresProducto:[],
                            mediosProducto:[],
                            supuestosProducto:[],
                            impactoSolo:[],
                            resultadoSolo:[],
                            actividades:[],
                            indicadoresActividades:[],
                            mediosActividades:[],
                            supuestosActividades:[],
                            gantt: {
                                data: [],
                                links: []
                            }
                        });
                        $scope.newFud.$save(function(variable){
                            $scope.udep= UDEP.query();
                            $scope.nuevoReporte=new UDEPReportes();
                            $scope.nuevoReporte.idPrograma=variable._id;
                            $scope.nuevoReporte.fecha=$scope.diaHoy();
                            $scope.nuevoReporte.usuario=$scope.username;
                            $scope.nuevoReporte.porcentajeCarga="0";
                            $scope.nuevoReporte.descripcion="Creación y Envio de Mail";
                            $scope.nuevoReporte.cantidadActividades=0;
                            $scope.nuevoReporte.cantidadProductos=0;
                            $scope.nuevoReporte.cantidadResultados=0;
                            $scope.nuevoReporte.cantidadImpactos=0;
                            $scope.nuevoReporte.$save();
                        });
                        $scope.proyectos = Proyectos.query({
                            $and:JSON.stringify([{eliminado: {$exists:false}},
                            {anio: 2016}])});
                    });
                });
            }
            else
            {
                $scope.proyecto = Proyectos.get({'_id': dato._id},function(){
                    $scope.proyecto.formulario='No';
                    $scope.proyecto.$save();
                    $scope.proyectos = Proyectos.query({
                            $and:JSON.stringify([{eliminado: {$exists:false}},
                            {anio: 2016}])});
                });
                $scope.formulario = UDEP.query({'idProyecto': dato._id}, function(){
                    //alert($scope.formulario[0].nombreDelPrograma);
                    $scope.formulario[0].$delete();
                });
            }
    };

    $scope.confirmar=function(dato,variable) {
        if (variable === false) {
            if (confirm("¿Desea eliminar '" + dato.nombre + "' de Formulario UDEP?")) {
                $scope.guardar(dato,variable);
            }
        } else {
            $scope.guardar(dato,variable);
        }
    };
    
    $scope.abrirFiltros = function() {
        $("#filtros").modal('show');
    };
    
})
.controller('UDEPEnviarMailCtrl',function($scope,UDEP,$routeParams,$http,$location,UDEPReportes)
{
    $scope.nuevoReporte=new UDEPReportes();
    
    $scope.data=UDEP.get({_id:$routeParams._id},function()
    {
        $scope.data.mensaje="<font size='3'>Hola [nombre de la persona]:<br><br>"+
                    "Te escribimos porque tu programa cumple con los criterios establecidos por la Unidad de "+
                    "Evaluación de Programas (UdEP), en consecuencia te pedimos que completes el siguiente "+
                    "formulario. La información que nos proveas nos posibilitará conocer mejor tu programa para diseñar "+
                    "juntos una estrategia de monitoreo y evaluación que te permita mejorar su impacto y mostrar sus resultados. <br>"+
                    "A través del siguiente link vas a acceder al formulario: http://bagestion.gcba.gob.ar/udep/"+$scope.data._id+"<br>"+
                    "La incorporación de métodos de evaluación resulta imprescindible para conocer el desempeño de "+
                    "los programas desarrollados, lo cual también fomenta un uso transparente y eficaz de los recursos y "+
                    "favorece intervenciones públicas de mayor calidad. <br>"+
                    "Junto con el formulario vas a encontrar instructivos que podés consultar a la hora de completar la "+
                    "Cadena de Resultados y la Matriz. Si tenés alguna duda, comunícate con nosotros: </font><br><br><br>"+
                    "<font size='2'>udep@buenosaires.gob.ar <br>"+
                    "Saludos, <br>"+
                    "Equipo de Evaluación de Programas</font>";
        $scope.data.asuntoCorreo="Formulario de Evaluación de Programas";
    });
    
    $scope.diaHoy = function () {
      function pad(s) { return (s < 10) ? '0' + s : s; }
      var d = new Date();
      return [pad(d.getDate()), pad(d.getMonth()+1), d.getFullYear()].join('/');
    };
    
    $scope.cancelarEnvio=function(data)
    {
        $location.url('/udep');
    };
    
    $scope.enviarMail=function()
    {
        var payload = {
            asunto: $scope.data.asuntoCorreo,
            para: $scope.data.responsableDeCarga, 
            mensajeHtml: "<div class='mailwrapper'>"+$scope.data.mensaje+"</div>",      
            from : "<udep@buenosaires.gob.ar>"
        };
        
        $http.post('/api/udepMail/enviar-mail', payload).success(function() {
                $scope.udep= UDEP.query();
                $scope.nuevoReporte=new UDEPReportes();
                $scope.nuevoReporte.idPrograma=$scope.data._id;
                $scope.nuevoReporte.fecha=$scope.diaHoy();
                $scope.nuevoReporte.usuario=$scope.username;
                $scope.nuevoReporte.porcentajeCarga=$scope.data.porcentajeCompletado;
                $scope.nuevoReporte.descripcion="Envio Mail";
                $scope.nuevoReporte.cantidadActividades=$scope.data.actividades.length;
                $scope.nuevoReporte.cantidadProductos=$scope.data.productoSolo.length;
                $scope.nuevoReporte.cantidadResultados=$scope.data.resultadoSolo.length;
                $scope.nuevoReporte.cantidadImpactos=$scope.data.impactoSolo.length;
                $scope.nuevoReporte.$save();
        }).error(function() {
            alert("Fallo el envio");
        });
        
        $location.url('/udep');
    };
})
.controller('UDEPNuevoCtrl', function($scope, UDEP, Contactos, $http, $location, ORMOrganigrama,UDEPReportes) {

    $scope.fud=new UDEP({
        indicadoresImpacto:[],
        mediosImpacto:[],
        supuestosImpacto:[],
        indicadoresResultado:[],
        mediosResultado:[],
        supuestosResultado:[],
        componentesSolo:[],
        indicadoresProducto:[],
        mediosProducto:[],
        supuestosProducto:[],
        actividades:[],
        indicadoresActividades:[],
        mediosActividades:[],
        impactoSolo:[],
        resultadoSolo:[],
        productoSolo:[],
        supuestosActividades:[],
        supuestosComponentes:[],
        gantt: {
            data: [],
            links: []
        }
    });
    $scope.nuevoReporte=new UDEPReportes();
    
    $scope.contactos = Contactos.listar();
	$scope.organigrama = ORMOrganigrama.query();
    $scope.gantt = {
        data: [],
        links: []
    };
    
    $scope.data = {
        "id" : 1,
        "text" : '',
        "start_date" : '',
        "end_date" : '',
        "parent" : 0,
    };
    $scope.campo=[false,false,false,false];//Campos de los inputs para mostrar
	$scope.reiniciarArray=function(noTocar)
	{
        for(var i=0; i<$scope.campo.length; i++)
        {
            $scope.campo[i]=false;
        }
        $scope.campo[noTocar]=true;
	};
    
    $scope.contador=0;
	$scope.unir=[];
	$scope.contadorDos=0;
	$scope.unirDos=[];
	$scope.agregarFlow=function(valor,lista)
	{
        if(!lista) {
            lista=[];
        }
        if(valor!=="") {
            valor.id=(new Date()).getTime();
            lista.push(valor);
        } else {
            alert("Ingrese un valor en el campo");
        }
        
	};

	$scope.agregarFlowActividad = function(valor,lista) {
        if(!lista) {
            lista=[];
        }
        if(valor!=="") {
            valor.id=(new Date()).getTime();
            lista.push(valor);
            $scope.data.text = valor.valor;
            $scope.data.start_date = $scope.diaHoy();
            $scope.data.end_date = $scope.diaHoy();
            $scope.agregarGantt();
        } else {
            alert("Ingrese un valor en el campo");
        }
    };

    
    //TEST
    $scope.funcionMasLoca=function(pos,id,index)
    {

            var elemento=document.getElementById(id);
            if($scope.contadorDos==0)
            {
                $scope.unirDos[0]=id;
                $scope.contadorDos=1;
                $scope.elementoAnteriorDos=pos;
                $scope.indexAnteriorDos=index;
                document.getElementById(id).style.borderRadius="50px";
                document.getElementById(id).style.backgroundColor="rgba(38, 138, 148, 0.72)";
            }
            else if($scope.unirDos[0]==id)
            {
                elemento.style.borderRadius="20px";
                switch(pos)
                {
                    case 0:
                        elemento.style.backgroundColor="#BD7751";
                        break;
                    case 1:
                        elemento.style.backgroundColor="#BF9A4F";
                        break;
                    case 2:
                        elemento.style.backgroundColor="#BCBB56";
                        break;
                    case 3:
                        elemento.style.backgroundColor="#9BBA59";
                        break;
                }
                $scope.contadorDos=0;
            }
            else if($scope.contadorDos==1)
            {
                if( (parseInt($scope.elementoAnteriorDos)+1)==(parseInt(pos)) )
                {
                    var elDiv=document.getElementById($scope.unirDos[0]);
                    $scope.unirDos[1]=id;
                    $scope.contadorDos=0;
                    //alert($scope.unir[0]+ " Se conecta con "+$scope.unir[1]);
                    elDiv.style.borderRadius="20px";
                    switch($scope.elementoAnteriorDos)
                    {
                        case 0:
                            elDiv.style.backgroundColor="#BD7751";
                            if(id == $scope.fud.actividades[$scope.indexAnteriorDos].conecta)
                            {
                                $scope.fud.actividades[$scope.indexAnteriorDos].conecta=null;
                            }
                            else if(id == $scope.fud.actividades[$scope.indexAnteriorDos].conectaDos)
                            {
                                $scope.fud.actividades[$scope.indexAnteriorDos].conectaDos=null;
                            }
                            else
                            {
                                $scope.fud.actividades[$scope.indexAnteriorDos].conectaDos=id;
                            }
                            break;
                        case 1:
                            elDiv.style.backgroundColor="#BF9A4F";
                            if(id == $scope.fud.productoSolo[$scope.indexAnteriorDos].conecta)
                            {
                                $scope.fud.productoSolo[$scope.indexAnteriorDos].conecta=null;
                            }
                            else if(id == $scope.fud.productoSolo[$scope.indexAnteriorDos].conectaDos)
                            {
                                $scope.fud.productoSolo[$scope.indexAnteriorDos].conectaDos=null;
                            }
                            else
                            {
                                $scope.fud.productoSolo[$scope.indexAnteriorDos].conectaDos=id;
                            }
                            
                            break;
                        case 2:
                            elDiv.style.backgroundColor="#BCBB56";
                            if(id == $scope.fud.resultadoSolo[$scope.indexAnteriorDos].conecta)
                            {
                                $scope.fud.resultadoSolo[$scope.indexAnteriorDos].conecta=null;
                            }
                            else if(id == $scope.fud.resultadoSolo[$scope.indexAnteriorDos].conectaDos)
                            {
                                $scope.fud.resultadoSolo[$scope.indexAnteriorDos].conectaDos=null;
                            }
                            else
                            {
                                $scope.fud.resultadoSolo[$scope.indexAnteriorDos].conectaDos=id;
                            }
                            
                            break;
                        case 3:
                            elDiv.style.backgroundColor="#9BBA59";
                            if(id == $scope.fud.impactoSolo[$scope.indexAnteriorDos].conecta)
                            {
                                $scope.fud.impactoSolo[$scope.indexAnteriorDos].conecta=null;
                            }
                            else if(id == $scope.fud.impactoSolo[$scope.indexAnteriorDos].conectaDos)
                            {
                                $scope.fud.impactoSolo[$scope.indexAnteriorDos].conectaDos=null;
                            }
                            else
                            {
                                $scope.fud.impactoSolo[$scope.indexAnteriorDos].conectaDos=id;
                            }
                            
                            break;
                    }
                }
                else
                {
                    alert("El elemento seleccionado solo se puede unir con otro de la columna de la derecha");
                }
            } 
    };
    
    //FIN TEST
    $scope.funcionLoca=function(pos,id,index)
    {
            var elemento=document.getElementById(id);
            if($scope.contador==0)
            {
                $scope.unir[0]=id;
                $scope.contador=1;
                $scope.elementoAnterior=pos;
                $scope.indexAnterior=index;
                document.getElementById(id).style.borderRadius="50px";
                document.getElementById(id).style.backgroundColor="rgba(38, 138, 148, 0.72)";
            }
            else if($scope.unir[0]==id)
            {
                elemento.style.borderRadius="20px";
                switch(pos)
                {
                    case 0:
                        elemento.style.backgroundColor="#BD7751";
                        break;
                    case 1:
                        elemento.style.backgroundColor="#BF9A4F";
                        break;
                    case 2:
                        elemento.style.backgroundColor="#BCBB56";
                        break;
                    case 3:
                        elemento.style.backgroundColor="#9BBA59";
                        break;
                }
                $scope.contador=0;
            }
            else if($scope.contador==1)
            {
                if( (parseInt($scope.elementoAnterior)+1)==(parseInt(pos)) )
                {
                    var elDiv=document.getElementById($scope.unir[0]);
                    $scope.unir[1]=id;
                    $scope.contador=0;
                    elDiv.style.borderRadius="20px";
                    switch($scope.elementoAnterior)
                    {
                        case 0:
                            elDiv.style.backgroundColor="#BD7751";

                            if(id == $scope.fud.actividades[$scope.indexAnterior].conecta)
                            {
                                $scope.fud.actividades[$scope.indexAnterior].conecta=null;
                            }
                            else if(id == $scope.fud.actividades[$scope.indexAnterior].conectaDos)
                            {
                                $scope.fud.actividades[$scope.indexAnterior].conectaDos=null;
                            }
                            else
                            {
                                $scope.fud.actividades[$scope.indexAnterior].conecta=id;
                            }
                            break;
                        case 1:
                            elDiv.style.backgroundColor="#BF9A4F";
                            
                            if(id == $scope.fud.productoSolo[$scope.indexAnterior].conecta)
                            {
                                $scope.fud.productoSolo[$scope.indexAnterior].conecta=null;
                            }
                            else if(id == $scope.fud.productoSolo[$scope.indexAnterior].conectaDos)
                            {
                                $scope.fud.productoSolo[$scope.indexAnterior].conectaDos=null;
                            }
                            else
                            {
                                $scope.fud.productoSolo[$scope.indexAnterior].conecta=id;
                            }
                            break;
                        case 2:
                            elDiv.style.backgroundColor="#BCBB56";
                            
                            if(id == $scope.fud.resultadoSolo[$scope.indexAnterior].conecta)
                            {
                                $scope.fud.resultadoSolo[$scope.indexAnterior].conecta=null;
                            }
                            else if(id == $scope.fud.resultadoSolo[$scope.indexAnterior].conectaDos)
                            {
                                $scope.fud.resultadoSolo[$scope.indexAnterior].conectaDos=null;
                            }
                            else
                            {
                                $scope.fud.resultadoSolo[$scope.indexAnterior].conecta=id;
                            }
                            break;
                        case 3:
                            elDiv.style.backgroundColor="#9BBA59";
                            
                            if(id == $scope.fud.impactoSolo[$scope.indexAnterior].conecta)
                            {
                                $scope.fud.impactoSolo[$scope.indexAnterior].conecta=null;
                            }
                            else if(id == $scope.fud.impactoSolo[$scope.indexAnterior].conectaDos)
                            {
                                $scope.fud.impactoSolo[$scope.indexAnterior].conectaDos=null;
                            }
                            else
                            {
                                $scope.fud.impactoSolo[$scope.indexAnterior].conecta=id;
                            }
                            break;
                    }
                }
                else
                {
                    alert("El elemento seleccionado solo se puede unir con otro de la columna de la derecha");
                }
            } 
    };
    //Define el punto para intersectar a la primera lista
    $scope.sety1=function(index,lista)
    {
        try
        {
            var y1=0;
            for(var i=0;i<index;i++)
            {
                y1+=document.getElementById(lista[i].id).offsetHeight;
                y1+=10;
            }
            y1+=((document.getElementById(lista[index].id).offsetHeight)/2);
            return y1;
        }
        catch(e)
        {
            return 0;
        }
        
    };
    //Define el punto para intersectar a la segunda lista
    $scope.sety2=function(index,lista1,lista2,numero)
    {
        try
        {
            var conecta;
            var y2=0; 
            if( (parseInt(numero)) == 1)
            {
                conecta=lista1[index].conecta;
            }
            else
            {
                conecta=lista1[index].conectaDos;
            }
            
            y2=((document.getElementById(conecta).offsetHeight)/2);
            
            for(var i=0; i<lista2.length;i++)
            {
                if(lista2[i].id!=conecta)
                {
                    y2+=document.getElementById(lista2[i].id).offsetHeight;
                    y2+=10;
                }
                else
                {
                    break;
                }
            }
            
            return y2; 
        }
        catch(e)
        {
            return 0;
        }
        
    };
    
    
    $scope.tamannoProgress=function(cantCampos)//Ingresandole todos los campos en cantCampos para saber cuantos tiene que contar
    {
        var porcentajePorCampo=100/cantCampos; // 100/cantCampos= porcentaje que vale cada campo
        var x = document.getElementsByClassName("escrito").length; // Cantidad de elementos que tienen por clase "escrito" 
        
        $scope.valorPorcentaje=Math.floor(x*porcentajePorCampo); // Pasar a entero el porcentaje para reperesentarlo en la barra
        $scope.fud.porcentajeCompletado=Math.floor(x*porcentajePorCampo);
        return x*porcentajePorCampo; //Retorna multiplicacion entre cantidad de elementos con clase: "escrito" x Porcentaje por campos
    };
    
    $scope.tieneTexto=function(texto) 
    {
        if (texto) {
            if(texto.length>=1) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    };
    
    $scope.contactoPorId = function (id) {
      for (var i = 0; i < $scope.contactos.length; i++) {
          if ($scope.contactos[i]._id == id)
          {
              return $scope.contactos[i];
          }
      }  
    };
    
    $scope.aMilisegundos = function(fecha) 
    {
        var fechaDividida = fecha.split("/");
        var date = new Date(fechaDividida[2], fechaDividida[1] - 1, fechaDividida[0], 0, 0, 0, 0);
        return date.getTime();
    };
    
    $scope.agregarGantt = function() {
        $scope.gantt.data.push($scope.data);
        $scope.data = {
            "id" : $scope.gantt.data.length+2,
            "text" : '',
            "start_date" : '',
            "end_date" : '',
            "parent" : 0,
        };
        $('#i1').val('');
        $('#i2').val('');
    }; 
    
    $scope.dameFecha = function(fecha) {
        var f = new Date(fecha);
        if (f.getDate() < 10) {
            var dia = "0" + f.getDate();
        } else {
            var dia = f.getDate();
        }
        if ((f.getMonth() +1) < 10) {
            var mes = "0" + (f.getMonth() +1);
        } else {
            var mes = (f.getMonth() +1);
        }
        return (dia + "/" + mes + "/" + f.getFullYear());
    };
    
    $scope.guardar=function()
    {
        $scope.fud.gantt.data = [];
        $scope.fud.gantt.links = [];
        if ($scope.gantt) {
            if ($scope.gantt.data) {
                angular.forEach($scope.gantt.data, function (d) {
                    $scope.fud.gantt.data.push({
                        "id" : d.id,
                        "text" : d.text,
                        "start_date" : $scope.dameFecha(d.start_date),
                        "end_date" : $scope.dameFecha(d.end_date),
                        "parent" : d.parent,
                    });
                });
            }
            if ($scope.gantt.links) {
                angular.forEach($scope.gantt.links, function (l) {
                    $scope.fud.gantt.links.push({
                        "id" : l.id,
                        "source" : l.source,
                        "target" : l.target,
                        "type" : l.type,
                    });
                });
            }
        }
        
        
        $scope.fud.$save(function(variable){
            $scope.nuevoReporte.idPrograma=variable._id;
            $scope.nuevoReporte.fecha=$scope.diaHoy();
            $scope.nuevoReporte.usuario=$scope.username;
            $scope.nuevoReporte.porcentajeCarga=$scope.fud.porcentajeCompletado;
            $scope.nuevoReporte.descripcion="Creación";
            $scope.nuevoReporte.cantidadActividades=0;
            $scope.nuevoReporte.cantidadProductos=0;
            $scope.nuevoReporte.cantidadResultados=0;
            $scope.nuevoReporte.cantidadImpactos=0;
            $scope.nuevoReporte.$save();
            
            $location.url('/udep/nuevo/enviar/'+$scope.fud._id);
        });
    };
    
    $scope.agregarExplicacionNecesidad=function(valor)
    {   
        if (!$scope.fud.necesidadExplicacion) 
        {
            $scope.fud.necesidadExplicacion = [];
        }
        $scope.fud.necesidadExplicacion.push(valor);
        $scope.necesidades = "";
    }; 
    
    $scope.agregarDescripcionNecesidad=function(valor)
    {   
        if (!$scope.fud.necesidadesDescripcion) 
        {
            $scope.fud.necesidadesDescripcion = [];
        }
        $scope.fud.necesidadesDescripcion.push(valor);
        $scope.necesidades = "";
    }; 
    
    $scope.agregarFin=function(valor,array)
    {
        if (!$scope.fud.finObjetivo)
        {
            $scope.fud.finObjetivo=[];
        }
        $scope.fud.finObjetivo.push(valor);
        $scope.finObjetivo="";
    };
    
    $scope.diaHoy = function () {
      function pad(s) { return (s < 10) ? '0' + s : s; }
      var d = new Date();
      return [pad(d.getDate()), pad(d.getMonth()+1), d.getFullYear()].join('/');
    };
    
    $scope.agregarRegistroAct = function(valor,lista) {//Recordar inicializar el array previamente en el new, y eliminar el campo desde el html
        if(!lista) {
            lista=[];
        }
        if(valor!=="") {
            lista.push(valor);
            $scope.data.text = valor.valor;
            $scope.data.start_date = $scope.diaHoy();
            $scope.data.end_date = $scope.diaHoy();
            $scope.agregarGantt();
        } else {
            alert("Ingrese un valor en el campo");
        }
    };
    
    $scope.agregarRegistro = function(valor,lista)
    {//Recordar inicializar el array previamente en el new, y eliminar el campo desde el html
        if(!lista)
        {
            lista=[];
        }
        
        if(valor!=="")
        {
            lista.push(valor);
        }
        else
        {
            alert("Ingrese un valor en el campo");
        }
    };
    
    $scope.eliminarRegistro = function(elemento, lista) 
    {
        lista.splice(lista.indexOf(elemento), 1);
    };
})
.controller('UDEPDetalleCtrl',function($scope,UDEP,$routeParams,$location, Contactos, $window, ORMOrganigrama,UDEPReportes){
    $scope.fud = UDEP.get({_id: $routeParams._id}, function() {
        $scope.gantt = JSON.parse(JSON.stringify($scope.fud.gantt));
        $scope.data = {
            "id" : $scope.fud.gantt.data.length+1,
            "text" : '',
            "start_date" : '',
            "end_date" : '',
            "parent" : 0,
        };
    });
    $scope.nuevoReporte=new UDEPReportes();
    $scope.contactos = Contactos.listar();
	$scope.organigrama = ORMOrganigrama.query();
	
	$scope.campo=[false,false,false,false];//Campos de los inputs para mostrar
	$scope.reiniciarArray=function(noTocar)
	{
        for(var i=0; i<$scope.campo.length; i++)
        {
            $scope.campo[i]=false;
        }
        $scope.campo[noTocar]=true;
	};
	
	$scope.contador=0;
	$scope.unir=[];
	$scope.contadorDos=0;
	$scope.unirDos=[];
	$scope.agregarFlow=function(valor,lista)
	{
        if(!lista) {
            lista=[];
        }
        if(valor!=="") {
            valor.id=(new Date()).getTime();
            lista.push(valor);
        } else {
            alert("Ingrese un valor en el campo");
        }
        
	};

	$scope.agregarFlowActividad = function(valor,lista) {
        if(!lista) {
            lista=[];
        }
        if(valor.valor.length>0) {
            valor.id=(new Date()).getTime();
            lista.push(valor);
            $scope.data.text = valor.valor;
            $scope.data.start_date = $scope.diaHoy();
            $scope.data.end_date = $scope.diaHoy();
            $scope.agregarGantt();
        } else {
            alert("Ingrese un valor en el campo");
        }
    };
    
    //TEST
    $scope.funcionMasLoca=function(pos,id,index)
    {
        if($scope.editando)
        {
            var elemento=document.getElementById(id);
            if($scope.contadorDos==0)
            {
                $scope.unirDos[0]=id;
                $scope.contadorDos=1;
                $scope.elementoAnteriorDos=pos;
                $scope.indexAnteriorDos=index;
                document.getElementById(id).style.borderRadius="50px";
                document.getElementById(id).style.backgroundColor="rgba(38, 138, 148, 0.72)";
            }
            else if($scope.unirDos[0]==id)
            {
                elemento.style.borderRadius="20px";
                switch(pos)
                {
                    case 0:
                        elemento.style.backgroundColor="#BD7751";
                        break;
                    case 1:
                        elemento.style.backgroundColor="#BF9A4F";
                        break;
                    case 2:
                        elemento.style.backgroundColor="#BCBB56";
                        break;
                    case 3:
                        elemento.style.backgroundColor="#9BBA59";
                        break;
                }
                $scope.contadorDos=0;
            }
            else if($scope.contadorDos==1)
            {
                if( (parseInt($scope.elementoAnteriorDos)+1)==(parseInt(pos)) )
                {
                    var elDiv=document.getElementById($scope.unirDos[0]);
                    $scope.unirDos[1]=id;
                    $scope.contadorDos=0;
                    //alert($scope.unir[0]+ " Se conecta con "+$scope.unir[1]);
                    elDiv.style.borderRadius="20px";
                    switch($scope.elementoAnteriorDos)
                    {
                        case 0:
                            elDiv.style.backgroundColor="#BD7751";
                            if(id == $scope.fud.actividades[$scope.indexAnteriorDos].conecta)
                            {
                                $scope.fud.actividades[$scope.indexAnteriorDos].conecta=null;
                            }
                            else if(id == $scope.fud.actividades[$scope.indexAnteriorDos].conectaDos)
                            {
                                $scope.fud.actividades[$scope.indexAnteriorDos].conectaDos=null;
                            }
                            else
                            {
                                $scope.fud.actividades[$scope.indexAnteriorDos].conectaDos=id;
                            }
                            break;
                        case 1:
                            elDiv.style.backgroundColor="#BF9A4F";
                            if(id == $scope.fud.productoSolo[$scope.indexAnteriorDos].conecta)
                            {
                                $scope.fud.productoSolo[$scope.indexAnteriorDos].conecta=null;
                            }
                            else if(id == $scope.fud.productoSolo[$scope.indexAnteriorDos].conectaDos)
                            {
                                $scope.fud.productoSolo[$scope.indexAnteriorDos].conectaDos=null;
                            }
                            else
                            {
                                $scope.fud.productoSolo[$scope.indexAnteriorDos].conectaDos=id;
                            }
                            
                            break;
                        case 2:
                            elDiv.style.backgroundColor="#BCBB56";
                            if(id == $scope.fud.resultadoSolo[$scope.indexAnteriorDos].conecta)
                            {
                                $scope.fud.resultadoSolo[$scope.indexAnteriorDos].conecta=null;
                            }
                            else if(id == $scope.fud.resultadoSolo[$scope.indexAnteriorDos].conectaDos)
                            {
                                $scope.fud.resultadoSolo[$scope.indexAnteriorDos].conectaDos=null;
                            }
                            else
                            {
                                $scope.fud.resultadoSolo[$scope.indexAnteriorDos].conectaDos=id;
                            }
                            
                            break;
                        case 3:
                            elDiv.style.backgroundColor="#9BBA59";
                            if(id == $scope.fud.impactoSolo[$scope.indexAnteriorDos].conecta)
                            {
                                $scope.fud.impactoSolo[$scope.indexAnteriorDos].conecta=null;
                            }
                            else if(id == $scope.fud.impactoSolo[$scope.indexAnteriorDos].conectaDos)
                            {
                                $scope.fud.impactoSolo[$scope.indexAnteriorDos].conectaDos=null;
                            }
                            else
                            {
                                $scope.fud.impactoSolo[$scope.indexAnteriorDos].conectaDos=id;
                            }
                            
                            break;
                    }
                }
                else
                {
                    alert("El elemento seleccionado solo se puede unir con otro de la columna de la derecha");
                }
            } 
        }
        
    };
    
    //FIN TEST
    $scope.funcionLoca=function(pos,id,index)
    {
        if($scope.editando)
        {
            var elemento=document.getElementById(id);
            if($scope.contador==0)
            {
                $scope.unir[0]=id;
                $scope.contador=1;
                $scope.elementoAnterior=pos;
                $scope.indexAnterior=index;
                document.getElementById(id).style.borderRadius="50px";
                document.getElementById(id).style.backgroundColor="rgba(38, 138, 148, 0.72)";
            }
            else if($scope.unir[0]==id)
            {
                elemento.style.borderRadius="20px";
                switch(pos)
                {
                    case 0:
                        elemento.style.backgroundColor="#BD7751";
                        break;
                    case 1:
                        elemento.style.backgroundColor="#BF9A4F";
                        break;
                    case 2:
                        elemento.style.backgroundColor="#BCBB56";
                        break;
                    case 3:
                        elemento.style.backgroundColor="#9BBA59";
                        break;
                }
                $scope.contador=0;
            }
            else if($scope.contador==1)
            {
                if( (parseInt($scope.elementoAnterior)+1)==(parseInt(pos)) )
                {
                    var elDiv=document.getElementById($scope.unir[0]);
                    $scope.unir[1]=id;
                    $scope.contador=0;
                    elDiv.style.borderRadius="20px";
                    switch($scope.elementoAnterior)
                    {
                        case 0:
                            elDiv.style.backgroundColor="#BD7751";

                            if(id == $scope.fud.actividades[$scope.indexAnterior].conecta)
                            {
                                $scope.fud.actividades[$scope.indexAnterior].conecta=null;
                            }
                            else if(id == $scope.fud.actividades[$scope.indexAnterior].conectaDos)
                            {
                                $scope.fud.actividades[$scope.indexAnterior].conectaDos=null;
                            }
                            else
                            {
                                $scope.fud.actividades[$scope.indexAnterior].conecta=id;
                            }
                            break;
                        case 1:
                            elDiv.style.backgroundColor="#BF9A4F";
                            
                            if(id == $scope.fud.productoSolo[$scope.indexAnterior].conecta)
                            {
                                $scope.fud.productoSolo[$scope.indexAnterior].conecta=null;
                            }
                            else if(id == $scope.fud.productoSolo[$scope.indexAnterior].conectaDos)
                            {
                                $scope.fud.productoSolo[$scope.indexAnterior].conectaDos=null;
                            }
                            else
                            {
                                $scope.fud.productoSolo[$scope.indexAnterior].conecta=id;
                            }
                            break;
                        case 2:
                            elDiv.style.backgroundColor="#BCBB56";
                            
                            if(id == $scope.fud.resultadoSolo[$scope.indexAnterior].conecta)
                            {
                                $scope.fud.resultadoSolo[$scope.indexAnterior].conecta=null;
                            }
                            else if(id == $scope.fud.resultadoSolo[$scope.indexAnterior].conectaDos)
                            {
                                $scope.fud.resultadoSolo[$scope.indexAnterior].conectaDos=null;
                            }
                            else
                            {
                                $scope.fud.resultadoSolo[$scope.indexAnterior].conecta=id;
                            }
                            break;
                        case 3:
                            elDiv.style.backgroundColor="#9BBA59";
                            
                            if(id == $scope.fud.impactoSolo[$scope.indexAnterior].conecta)
                            {
                                $scope.fud.impactoSolo[$scope.indexAnterior].conecta=null;
                            }
                            else if(id == $scope.fud.impactoSolo[$scope.indexAnterior].conectaDos)
                            {
                                $scope.fud.impactoSolo[$scope.indexAnterior].conectaDos=null;
                            }
                            else
                            {
                                $scope.fud.impactoSolo[$scope.indexAnterior].conecta=id;
                            }
                            break;
                    }
                }
                else
                {
                    alert("El elemento seleccionado solo se puede unir con otro de la columna de la derecha");
                }
            } 
        }
        
    };
    //Define el punto para intersectar a la primera lista
    $scope.sety1=function(index,lista)
    {
        try
        {
            var y1=0;
            for(var i=0;i<index;i++)
            {
                y1+=document.getElementById(lista[i].id).offsetHeight;
                y1+=10;
            }
            y1+=((document.getElementById(lista[index].id).offsetHeight)/2);
            return y1;
        }
        catch(e)
        {
            return 0;
        }
        
    };
    //Define el punto para intersectar a la segunda lista
    $scope.sety2=function(index,lista1,lista2,numero)
    {
        try
        {
            var conecta;
            var y2=0; 
            if( (parseInt(numero)) == 1)
            {
                conecta=lista1[index].conecta;
            }
            else
            {
                conecta=lista1[index].conectaDos;
            }
            
            y2=((document.getElementById(conecta).offsetHeight)/2);
            
            for(var i=0; i<lista2.length;i++)
            {
                if(lista2[i].id!=conecta)
                {
                    y2+=document.getElementById(lista2[i].id).offsetHeight;
                    y2+=10;
                }
                else
                {
                    break;
                }
            }
            
            return y2; 
        }
        catch(e)
        {
            return 0;
        }
        
    };

    $scope.contactoPorId = function (id) {
      for (var i = 0; i < $scope.contactos.length; i++) {
          if ($scope.contactos[i]._id == id)
          {
              return $scope.contactos[i];
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
    
    $scope.tamannoProgress=function(cantCampos)//Ingresandole todos los campos en cantCampos para saber cuantos tiene que contar
    {
        var porcentajePorCampo=100/cantCampos; // 100/cantCampos= porcentaje que vale cada campo
        var x = document.getElementsByClassName("escrito").length; // Cantidad de elementos que tienen por clase "escrito" 
        
        $scope.valorPorcentaje=Math.floor(x*porcentajePorCampo); // Pasar a entero el porcentaje para reperesentarlo en la barra
        $scope.fud.porcentajeCompletado=Math.floor(x*porcentajePorCampo);
        return x*porcentajePorCampo; //Retorna multiplicacion entre cantidad de elementos con clase: "escrito" x Porcentaje por campos
    };
    
    $scope.tieneTexto=function(texto) {
        if (texto) {
            if (texto.length>=1) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    };

    $scope.aMilisegundos = function(fecha) 
    {
        var fechaDividida = fecha.split("/");
        var date = new Date(fechaDividida[2], fechaDividida[1] - 1, fechaDividida[0], 0, 0, 0, 0);
        return date.getTime();
    };
    
    $scope.agregarGantt = function() {
        $scope.gantt.data.push($scope.data);
        $scope.data = {
            "id" : $scope.gantt.data.length+2,
            "text" : '',
            "start_date" : '',
            "end_date" : '',
            "parent" : 0,
        };
        $('#i1').val('');
        $('#i2').val('');
    }; 
    
    $scope.dameFecha = function(fecha) {
        var f = new Date(fecha);
        if (f.getDate() < 10) {
            var dia = "0" + f.getDate();
        } else {
            var dia = f.getDate();
        }
        if ((f.getMonth() +1) < 10) {
            var mes = "0" + (f.getMonth() +1);
        } else {
            var mes = (f.getMonth() +1);
        }
        return (dia + "/" + mes + "/" + f.getFullYear());
    };
    
    $scope.guardar=function()
    {
        $scope.fud.gantt.data = [];
        $scope.fud.gantt.links = [];
        if ($scope.gantt) {
            if ($scope.gantt.data) {
                angular.forEach($scope.gantt.data, function (d) {
                    $scope.fud.gantt.data.push({
                        "id" : d.id,
                        "text" : d.text,
                        "start_date" : $scope.dameFecha(d.start_date),
                        "end_date" : $scope.dameFecha(d.end_date),
                        "parent" : d.parent,
                    });
                });
            }
            if ($scope.gantt.links) {
                angular.forEach($scope.gantt.links, function (l) {
                    $scope.fud.gantt.links.push({
                        "id" : l.id,
                        "source" : l.source,
                        "target" : l.target,
                        "type" : l.type,
                    });
                });
            }
        }
        $scope.fud.$save();
        $scope.fud.$save(function(variable){
            $scope.nuevoReporte.idPrograma=variable._id;
            $scope.nuevoReporte.fecha=$scope.diaHoy();
            $scope.nuevoReporte.usuario=$scope.username;
            $scope.nuevoReporte.porcentajeCarga=$scope.fud.porcentajeCompletado;
            $scope.nuevoReporte.descripcion="Modificación";
            $scope.nuevoReporte.cantidadActividades=$scope.fud.actividades.length;
            $scope.nuevoReporte.cantidadProductos=$scope.fud.productoSolo.length;
            $scope.nuevoReporte.cantidadResultados=$scope.fud.resultadoSolo.length;
            $scope.nuevoReporte.cantidadImpactos=$scope.fud.impactoSolo.length;
            $scope.nuevoReporte.$save();
        });
    };

    $scope.agregarExplicacionNecesidad=function(valor)
    {   
        if (!$scope.fud.necesidadExplicacion) 
        {
            $scope.fud.necesidadExplicacion = [];
        }
        $scope.fud.necesidadExplicacion.push(valor);
        $scope.necesidades = "";
    }; 
    
    $scope.agregarDescripcionNecesidad=function(valor)
    {   
        if (!$scope.fud.necesidadesDescripcion) 
        {
            $scope.fud.necesidadesDescripcion = [];
        }
        $scope.fud.necesidadesDescripcion.push(valor);
        $scope.necesidades = "";
    }; 
    
    $scope.diaHoy = function () {
      function pad(s) { return (s < 10) ? '0' + s : s; }
      var d = new Date();
      return [pad(d.getDate()), pad(d.getMonth()+1), d.getFullYear()].join('/');
    };
    
    $scope.agregarRegistroAct = function(valor,lista) {//Recordar inicializar el array previamente en el new, y eliminar el campo desde el html
        if(!lista) {
            lista=[];
        }
        if(valor!=="") {
            lista.push(valor);
            $scope.data.text = valor.valor;
            $scope.data.start_date = $scope.diaHoy();
            $scope.data.end_date = $scope.diaHoy();
            $scope.agregarGantt();
        } else {
            alert("Ingrese un valor en el campo");
        }
    };
    
    $scope.agregarRegistro = function(valor,lista)
    {//Recordar inicializar el array previamente en el new, y eliminar el campo desde el html
        if(!lista)
        {
            lista=[];
        }
        if(valor!=="")
        {
            lista.push(valor);
        }
        else
        {
            alert("Ingrese un valor en el campo");
        }
    };
 
    $scope.eliminarRegistro = function(elemento, lista) 
    {
        lista.splice(lista.indexOf(elemento), 1);
    };
    
    $scope.abrirGuia=function()
    {
        $("#abrirGuia").modal('show');
    };
    
    $scope.eliminar = function(confirmado) 
    {
        if (confirmado) 
        {
            $scope.fud.$delete(function() 
            {
                $location.url('/udep');
            });
        }
        else 
        {
            $("#confirmarEliminar").modal('show');
        }
    };
    
    $scope.editar = function()
    {
      $scope.editando=true;  
    };
    
    $scope.imprimir=function()
    {
        $window.print();
    };
})
.controller('UDEPRegistroCtrl', function($scope, UDEP, UDEPReportes, $routeParams) {
    $scope.fud = UDEP.get({_id: $routeParams._id});
    $scope.registros=UDEPReportes.query({"idPrograma":$routeParams._id});
    
    $scope.claseMisteriosa=function(porcentajeCarga)
    {
        if(porcentajeCarga==0)
            return "nada";
        else if(porcentajeCarga<=25)
            return "danger";
        else if(porcentajeCarga<=50)
            return "warning";
        else if(porcentajeCarga<=99)
            return "info";
        else 
            return "success";
    };
    
    $scope.colorFondo=function(porcentajeCarga)
    {
        if(porcentajeCarga==0)
            return "#999999";
        else if(porcentajeCarga<=25)
            return "#d9534f";
        else if(porcentajeCarga<=50)
            return "#f0ad4e";
        else if(porcentajeCarga<=99)
            return "#5bc0de";
        else 
            return "#3f903f";
    };
    
    $scope.devolverIcono=function(descripcion)
    {
        if(descripcion=="Creación")
        {
            return "icon-plus";
        }
        else if(descripcion=="Envio Mail")
        {
            return "icon-envelope";
        }
        else if(descripcion=="Modificación")
        {
            return "icon-check";
        }
        else if(descripcion=="Creación y Envio de Mail")
        {
            return "icon-thumbs-up";
        }
        
    };
});















