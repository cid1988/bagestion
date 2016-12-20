angular.module('bag2.orm.cita',[])
.controller('ORMCitaCtrl', function($rootScope, tipoEnvio, $scope, $routeParams, ORMTemario, ORMInstanciaReunion, ORMCita, ORMTema, ORMReunion, $modal, $window) {

    $scope.preAsunto = "";
    $rootScope.$on('start-edit', function() {
        $rootScope.$broadcast('edit-started');
        $scope.editando = true;
    });
    
    $scope.filtroFinPropuestaPara=function(persona)
    {
        if(persona.propuestaTemario=="para")
        {
            return true;
        }
        else
        {
            return false;
        }
    };
    $scope.filtroFinPropuestaCC=function(persona)
    {
        if(persona.propuestaTemario=="cc")
        {
            return true;
        }
        else
        {
            return false;
        }
    };
    $scope.filtroFinPropuestaCCO=function(persona)
    {
        if(persona.propuestaTemario=="cco")
        {
            return true;
        }
        else
        {
            return false;
        }
    };
    
    $scope.filtroFinCitaPara=function(persona)
    {
        if(persona.cita=="para")
        {
            return true;
        }
        else
        {
            return false;
        }
    };
    $scope.filtroFinCitaCC=function(persona)
    {
        if(persona.cita=="cc")
        {
            return true;
        }
        else
        {
            return false;
        }
    };
    $scope.filtroFinCitaCCO=function(persona)
    {
        if(persona.cita=="cco")
        {
            return true;
        }
        else
        {
            return false;
        }
    };
    
    $scope.tipoReunion=1;
    tipoEnvio.envio=1;
    
    $rootScope.$on('stop-edit', function() {
        $rootScope.$broadcast('edit-stopped');
        $scope.editando = false;
    });

    $rootScope.$on('enviar-cita', function() {
        $rootScope.$broadcast('mostrar-enviar-cita', true);
    });
    
    $rootScope.$on('cancel-cita', function() {
        $rootScope.$broadcast('cancelar-cita', true);
    });
    
    $rootScope.$on('modifica-cita', function() {
        $rootScope.$broadcast('modificar-cita', true);
    });
    
    $rootScope.$on('envia-temario', function() {
        $rootScope.$broadcast('enviar-temario', true);
    });
    
    $rootScope.$on('recuerda-fecha',function(){
       $rootScope.$broadcast('recordar-cita', true); 
    });
    
    $rootScope.$on('prepara-cita', function() {
        $rootScope.$broadcast('preparar-cita', true);
    });
    
    $rootScope.$on('reserva-fecha', function() {
        $rootScope.$broadcast('reservar-fecha', true);
    });
    
    $scope.imprimir = function () {
        $window.print(); 
    };

    $scope.instancia = ORMInstanciaReunion.findById({
        _id: $routeParams._id}, function() {
        var cita2 = ORMCita.query({
            idInstancia: $routeParams._id
        }, function () {
            if (cita2.length) {
                $scope.instancia.cita = cita2[0];
            }
            $scope.fechaDesde = new Date($scope.instancia.desdeDate).format('dd/mm/yyyy');
            $scope.horaDesde = new Date($scope.instancia.desdeDate).format('H:MM');
            $scope.horaHasta = new Date($scope.instancia.hastaDate).format('H:MM');
            $scope.reunion = ORMReunion.findById({_id: $scope.instancia.reunion}, function(){
                var idMaestro;
                if($scope.reunion && $scope.reunion.tipo){
                    switch($scope.reunion.tipo)
                    {
                        case "seguimiento":
                            idMaestro = "5249c2913dacd74127000001";
                            break;
                        case "transversales":
                            idMaestro = "53075d93491f2d02e0d14813";
                            break;
                        case "presupuesto":
                            idMaestro = "53075dc7491f2d02e0d14815";
                            break;
                        case "especificas":
                            idMaestro = "53075d79491f2d02e0d14812";
                            break;
                        case "planeamiento":
                            idMaestro = "53075db4491f2d02e0d14814";
                            break;
                        case "coordinacion":
                            idMaestro = "53075ddc491f2d02e0d14816";
                            break;
                        case "planLargoPlazo":
                            idMaestro = "553f971d41e6232024e2933d";
                            break;
                        case "proyectosEspeciales":
                            idMaestro = "55e472739e8ff113c48a8f19";
                            break;
                        case "eventuales":
                            idMaestro = "5486de0c41e6231858ad5329";
                            break;
                    }
                }
                $scope.maestro = ORMReunion.get({
                    _id: idMaestro
                });
            });
            
            var fecha = new Date($scope.instancia.desdeDate);
            if (fecha.getMinutes() === 0) {
                $scope.hora = fecha.getHours() + ":00";
            } else {
                $scope.hora = fecha.getHours() + ":" + fecha.getMinutes();
            }
            var fecha2 = new Date($scope.instancia.hastaDate);
            if (fecha2.getMinutes() === 0) {
                $scope.hora2 = fecha2.getHours() + ":00";
            } else {
                $scope.hora2 = fecha2.getHours() + ":" + fecha2.getMinutes();
            }
        });
    });
    
    $scope.modificarCita = function() {
        $scope.tipoReunion=3;
        tipoEnvio.envio=3;
        $rootScope.$broadcast('modifica-cita');
    };
    
    $scope.cancelar = function() {
        $scope.tipoReunion=3;
        tipoEnvio.envio=3;
        $rootScope.$broadcast('cancel-cita');
    };
    
    $scope.prepararCita = function() {
        $rootScope.$broadcast('prepara-cita');
    };
    
    $scope.enviarTemario = function() {
        $scope.tipoReunion=1;
        tipoEnvio.envio=1;
        $rootScope.$broadcast('envia-temario');
    };
    
    $scope.reservaFecha = function() {
        $rootScope.$broadcast('reserva-fecha');
    };
    
    $scope.recordarCita=function(){
        $scope.tipoReunion=2;
        tipoEnvio.envio=2;
        $rootScope.$broadcast('recuerda-fecha');
    };
})
.controller('ORMCitaListaEnvioCtrl', function($scope, tipoEnvio, $state, $location, $routeParams, ORMInstanciaReunion, ORMCita, ORMTemario, ORMReunion, $rootScope, ORMContacto, $http) {
    $scope.textoCita = "";
    $scope.meses = [ "de Enero", "de Febrero", "de Marzo", "de Abril", "de Mayo", "de Junio", "de Julio", "de Agosto", "de Septiembre", "de Octubre", "de Noviembre", "de Diciembre" ];
    $scope.dias = [ "Domingo", "Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado" ];
    $scope.uploadedFile = [];
    //@Alex: Traer el HTML de temario
    $scope.temario = ORMTemario.query({"instancia": $routeParams._id},function(){
        $scope.temario=$scope.temario[0];
        if(!$scope.temario)
        {
            $scope.temario={};
            $scope.temario.html=false;
        }
        if (!$scope.temario.html)
        {
            $scope.temario.html=false;
        }
    });
    
    $scope.$on('cancelar-cita', function(event, mostrar) {
        $scope.version = "cancelado";
        $scope.preAsunto = "Cancelacion - ";
        $scope.rearmarTextoCita();
        $scope.mostrarEnviarTemario = mostrar;
    });
    
    $scope.$on('modificar-cita', function(event, mostrar) {
        $scope.version = "modificacion";
        $scope.preAsunto = "Modificacion - ";
        $scope.rearmarTextoCita();
        $scope.mostrarEnviarTemario = mostrar;
    });
    
    $scope.mostrarInicioRecordar=function(mostrar){
        $scope.version = "temario";
        $scope.preAsunto = "Temario definitivo y Recordatorio - ";
        $scope.rearmarTextoCita();
        $scope.mostrarEnviarTemario = mostrar;
    };
    
    $scope.$on('enviar-temario', function(event, mostrar) {
        $scope.mostrarInicioRecordar(mostrar);
    });
    
    $scope.$on('recordar-cita', function(event, mostrar){
        $scope.version = "recordatorio";
        $scope.preAsunto = "Recordatorio - ";
        $scope.rearmarTextoCita();
        $scope.mostrarEnviarTemario = mostrar;
    });
    
    $scope.$on('reservar-fecha', function(event, mostrar) {
        $scope.version = "reserva";
        $scope.preAsunto = "Reserva fechas de Reunion - ";
        $scope.textoCita = '<div class="mailwrapper" style="font-size: 17px; color: black; line-height: 100% !important;" >Estimados,<br><br>Por el presente les adelantamos las posibles fechas de las reuniones ' + $scope.reunion.tipo + ' programadas para el próximo mes. En la semana previa a la reunión les estaremos enviando la convocatoria particular de la misma con los temas considerados, confirmando fecha, hora y  lugar donde se llevará a cabo que determinará la oficina de Jefatura de Gabinete de Ministros.<br><br>Les recordamos que la reunión de referencia se realizaría el <b>' + $scope.dias[$scope.fecha.getDay()] + ' ' + $scope.fecha.getDate() + ' ' + $scope.meses[$scope.fecha.getMonth()] + ' a las ' + $scope.hora + 'hs</b>. <br><br>Ante cualquier consulta pueden comunicarse telefónicamente o vía mail con nuestras oficinas.<br><br>Saludos cordiales.<br><br><b>Secretaría de Planeamiento y Coordinación de Gestión<br> Jefatura de Gabinete de Ministros<br> Tel: + 54 11 5091-7200 Int: 7247 ó 7210</b><br><br></b></div>';
        $scope.mostrarEnviarTemario = mostrar;
    });
    
    $scope.$on('preparar-cita', function(event, mostrar) {
        $scope.version = "final";
        $scope.preAsunto = "Temario definitivo y Recordatorio - ";
        $scope.asunto =  $scope.reunionTipo + " - " + $scope.reunion.nombre;
        $scope.textoCita = '<div class="mailwrapper" style="font-size: 17px; color: black; line-height: 100% !important;" >Estimados,<br><br>A continuación les enviamos el temario definitivo para la reunión de referencia, a realizarse el <b><u>' + $scope.dias[$scope.fecha.getDay()] + ' ' + $scope.fecha.getDate() + ' ' + $scope.meses[$scope.fecha.getMonth()] + ' a las ' + $scope.hora + 'hs (' + ($scope.instancia.hastaDate - $scope.instancia.desdeDate) / 60000 + ' min)</u></b>';
        if ($scope.instancia.ubicacion) {
            $scope.textoCita = $scope.textoCita + ' en ' + $scope.instancia.ubicacion.nombre + '.';
        }
        
        if($scope.temario.html)
        {
            $scope.textoCita=$scope.textoCita+
                "<div style='font-family: monospace; color: #081367;font-size: 1em; padding-left:20px;border-top: 1px solid #081367 !important;border-bottom: 1px solid #081367 !important;'>"+
                    "<b>"+
                        "<br/>"+
                        "<u>TEMARIO DEFINITIVO:</u>"+
                        "<br/><br/><br/>"+
                        "<div>"+
                            $scope.temario.html+
                        "</div>"+
                    "</b>"+
                "</div>";
        }
        
        $scope.textoCita=$scope.textoCita+"<br/>Quedamos a su disposición ante cualquier consulta.<br/><br/>Saludos cordiales.<br><br><b>Secretaría de Planeamiento y Coordinación de Gestión<br> Jefatura de Gabinete de Ministros<br> Tel: + 54 11 5091-7200 Int: 7247 ó 7210</b><br><br></b></div>"
        $scope.mostrarEnviarTemario = mostrar;
    });
    
    // Cambiamos el asunto del mensaje en función del nombre de la reunión
    $scope.$watch('reunion.nombre', function (n) {
        if($scope.reunion && $scope.reunion.tipo)
        {
            switch($scope.reunion.tipo)
            {
                case "seguimiento":
                    $scope.reunionTipo = "de Seguimiento";
                    break;
                case "transversales":
                    $scope.reunionTipo = "Transversal";
                    break;
                case "especificas":
                    $scope.reunionTipo = "Especifica";
                    break;
                case "planeamiento":
                    $scope.reunionTipo = "de Planeamiento";
                    break;
                case "presupuesto":
                    $scope.reunionTipo = "de Presupuesto";
                    break;
                case "coordinacion":
                    $scope.reunionTipo = "de Coordinacion";
                    break;
                case "planLargoPlazo":
                    $scope.reunionTipo = "de Plan Largo Plazo";
                    break;
                case "proyectosEspeciales":
                    $scope.reunionTipo = "de Proyectos Especiales";
                    break;
                case "eventuales":
                    $scope.reunionTipo = "Eventual";
                    break;
            }
        }

        $scope.preAsunto = "Temario definitivo y Recordatorio - ";
        $scope.asunto = "Reunion " + $scope.reunionTipo + " - " + ($scope.reunion ? $scope.reunion.nombre : "");
        $scope.asunto = $scope.omitirAcentos($scope.asunto);
    });

    // Escuchamos mostrar-enviar-temario
    $scope.$on('mostrar-enviar-cita', function(event, mostrar) {
        $scope.mostrarEnviarCita = mostrar;
    });

    $scope.cancelarEnvio = function() {
        if (!$scope.enviando) {
            $rootScope.$broadcast('mostrar-enviar-cita', false);
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
    
    $scope.esEspecifica = function (id) {
      var valor = false;
      for (var i = 0; i < $scope.reuniones.length; i++) {
          if (($scope.reuniones[i]._id == id) && ($scope.reuniones[i].tipo == "especificas")) {
              valor = true;
          }
      } 
      return valor;
    };
    
    $scope.omitirAcentos = function(text) {
        var acentos = "ÁÉÍÓÚáéíóúÑñ";
        var original = "AEIOUaeiouNn";
        for (var i=0; i<acentos.length; i++) {
            text = text.replace(acentos.charAt(i), original.charAt(i));
        }
        return text;
    };
    
    $scope.rearmarTextoCita = function() {
        if ($scope.preAsunto == "Cancelacion - ") {
            $scope.textoCita = '<div class="mailwrapper" style="font-size: 17px; color: black; line-height: 100% !important;" >Estimados,<br><br>Les informamos que la reunión de referencia que se realizaría el <b><u>' + $scope.dias[$scope.fecha.getDay()] + ' ' + $scope.fecha.getDate() + ' ' + $scope.meses[$scope.fecha.getMonth()] + ' a las ' + $scope.hora + 'hs</u></b>, fue cancelada hasta nuevo aviso. Nos pondremos en contacto cuando reagendemos la misma. <br/><br/>Ante cualquier consulta pueden comunicarse telefónicamente o vía mail con nuestras oficinas.<br><br>Saludos cordiales,<br><br><b>Secretaría de Planeamiento y Coordinación de Gestión<br> Jefatura de Gabinete de Ministros<br> Tel: + 54 11 5091-7200 Int: 7247 ó 7210</b><br><br></div>';
        }
        else if($scope.preAsunto == "Modificacion - ") {
            $scope.textoCita = '<div class="mailwrapper" style="font-size: 17px; color: black; line-height: 100% !important;" >Estimados,<br><br>Les informamos que la reunión de referencia tuvo modificaciones, ahora se realizará el <b><u>' + $scope.dias[$scope.fecha.getDay()] + ' ' + $scope.fecha.getDate() + ' ' + $scope.meses[$scope.fecha.getMonth()] + ' a las ' + $scope.hora + 'hs (' + ($scope.instancia.hastaDate - $scope.instancia.desdeDate) / 60000 + ' min) </u></b>';
            if ($scope.instancia.ubicacion) {
                $scope.textoCita = $scope.textoCita + '<b><u> en ' + $scope.instancia.ubicacion.nombre + '</u></b></b>.';
            }
            $scope.textoCita=$scope.textoCita+"<br/><br/>Saludos cordiales.<br/><br/><b>Secretaría de Planeamiento y Coordinación de Gestión<br> Jefatura de Gabinete de Ministros<br> Tel: + 54 11 5091-7200 Int: 7247 ó 7210</b>";
        }
        else if($scope.preAsunto == "Recordatorio - "){
            $scope.textoCita = '<div class="mailwrapper" style="font-size: 17px; color: black; line-height: 100% !important;" >Estimados,<br><br>Les recordamos que la reunión de referencia se realizará el <b><u>' + $scope.dias[$scope.fecha.getDay()] + ' ' + $scope.fecha.getDate() + ' ' + $scope.meses[$scope.fecha.getMonth()] + ' a las ' + $scope.hora + 'hs (' + ($scope.instancia.hastaDate - $scope.instancia.desdeDate) / 60000 + ' min) </u></b>';
            if ($scope.instancia.ubicacion) {
                $scope.textoCita = $scope.textoCita + '<b><u> en ' + $scope.instancia.ubicacion.nombre + '</u></b></b>.';
            }
            
            $scope.textoCita=$scope.textoCita+"<br/><br/>Ante cualquier consulta pueden comunicarse telefónicamente o vía mail con nuestras oficinas.<br><br>Saludos cordiales,<br><br><b>Secretaría de Planeamiento y Coordinación de Gestión<br> Jefatura de Gabinete de Ministros<br> Tel: + 54 11 5091-7200 Int: 7247 ó 7210</b><br><br>";
        }
        else if($scope.preAsunto == "Temario definitivo y Recordatorio - "){
            $scope.textoCita = '<div class="mailwrapper" style="font-size: 17px; color: black; line-height: 100% !important;" >Estimados,<br><br>A continuación les enviamos el temario definitivo para la reunión de referencia, a realizarse el <b><u>' + $scope.dias[$scope.fecha.getDay()] + ' ' + $scope.fecha.getDate() + ' ' + $scope.meses[$scope.fecha.getMonth()] + ' a las ' + $scope.hora + 'hs (' + ($scope.instancia.hastaDate - $scope.instancia.desdeDate) / 60000 + ' min) </u></b>';
            if ($scope.instancia.ubicacion) {
                $scope.textoCita = $scope.textoCita + '<b><u> en ' + $scope.instancia.ubicacion.nombre + '</u></b></b>.';
            }
            
            $scope.textoCita=$scope.textoCita+"<br/><br/>Por favor confirmar asistencia vía e-mail.<br/><br/>Les pedimos enviar previamente la presentación a proyectar para evitar posibles contratiempos.<br/><br/>Tengan a bien llegar unos minutos más temprano, a fin de poder realizar el ingreso con tiempo.<br/><br/>";
            
            if($scope.temario.html)
            {
               $scope.textoCita=$scope.textoCita+
                "<div style='font-family: monospace; color: #081367;font-size: 1em; padding-left:20px;border-top: 1px solid #081367 !important;border-bottom: 1px solid #081367 !important;'>"+
                    "<b>"+
                        "<br/>"+
                        "<u>TEMARIO DEFINITIVO:</u>"+
                        "<br/><br/><br/>"+
                        "<div>"+
                            $scope.temario.html+
                        "</div>"+
                    "</b>"+
                "</div>";
            }
            $scope.textoCita=$scope.textoCita+"<br/>Quedamos a su disposición ante cualquier consulta.<br/><br/>Saludos cordiales.<br><br><b>Secretaría de Planeamiento y Coordinación de Gestión<br> Jefatura de Gabinete de Ministros<br> Tel: + 54 11 5091-7200 Int: 7247 ó 7210</b><br><br></b></div>";
        }
    };

    // creamos un objeto vacío, que vamos a usar como diccionario
    // _id = ORMContacto
    $scope.contactos = ORMContacto.list();

    
    var contador=2;
    function traerOriginal(){
        $scope.instancia = ORMInstanciaReunion.get({
            _id: $state.params._id
        },function(){
            $scope.version = "temario";
            $scope.preAsunto = "Temario definitivo y Recordatorio - ";
            $scope.fecha = new Date($scope.instancia.desdeDate);
            $scope.rearmarTextoCita();
            $scope.mostrarEnviarTemario = true;
            contador--;
            if(contador<0)
            {
                window.clearInterval(variableUltraLoca);
            }
        });
    }
    
    var variableUltraLoca = window.setInterval(traerOriginal, 500);
    //$scope.traerOriginal();

    // hacemos una copia del objeto instancia en nuestro scope local
    $scope.instancia = angular.copy($scope.instancia);

    // si cambia el tipo de temario, cambiamos la lista que vamos a modificar
    $scope.version = "final";
    $scope.$watch('version', function(version) {
        // estas son las listas de correo que manejamos para el temario
        var listasPorVersion = {
            'final': 'cita',
            'propuesta': 'propuestaCita',
            'cancelado': 'cancelado'
        };
        var textosPorVersion = {
            'final': 'Versión final',
            'propuesta': 'Propuesta',
            'cancelado': 'cancelado'
        };

        $scope.lista = listasPorVersion[version];
        $scope.textoVersion = textosPorVersion[version] || 'Sin establecer';
    });

    //@Alex: Retorna los mails de un array que contienen el campo filtro igual a valor
    var mails = function(filtro, valor)
    {
        var retornar=[];
        if($scope.instancia.asistencia)
        {
            for(var i=0; i<$scope.instancia.asistencia.length; i++)
            {
                if($scope.instancia.asistencia[i][filtro]==valor)
                {
                    retornar.push({contactoId:$scope.instancia.asistencia[i].contactoId});
                }
            }
        }
        return retornar;
    };

    $scope.enviar = function() {

        $scope.enviando = true;
        if (!$scope.instancia.ubicacion) {
            $scope.instancia.ubicacion = {nombre : " "};
        }
        if ($scope.uploadedFile.length) {
            var adjunto = "/uploads/" + $scope.uploadedFile.shift().id;
        } else {
            var adjunto = "";
        }
        
        var elPara, elcc, elcco, elexclusivo;
        
        if(tipoEnvio.envio==1)
        {
            elPara=(($scope.reunion.cita||{}).para||[]).concat((($scope.maestro.cita||{}).para||[])).concat( mails("cita","para") );
            elcc=(($scope.reunion.cita||{}).cc||[]).concat((($scope.maestro.cita||{}).cc||[])).concat( mails("cita","cc") );
            elcco=(($scope.reunion.cita||{}).cco||[]).concat((($scope.maestro.cita||{}).cco||[])).concat(mails("cita","cco") );
            elexclusivo=(($scope.reunion.cita||{}).exclusivos||[]).concat((($scope.maestro.cita||{}).exclusivos||[]));
        }
        else if(tipoEnvio.envio==2)
        {
            elPara=(($scope.reunion.propuestaTemario||{}).para||[]).concat((($scope.maestro.propuestaTemario||{}).para||[])).concat(mails("propuestaTemario","para") );
            elcc=(($scope.reunion.propuestaTemario||{}).cc||[]).concat((($scope.maestro.propuestaTemario||{}).cc||[])).concat(mails("propuestaTemario","cc") );
            elcco=(($scope.reunion.propuestaTemario||{}).cco||[]).concat((($scope.maestro.propuestaTemario||{}).cco||[])).concat(mails("propuestaTemario","cco") );
            elexclusivo=(($scope.reunion.propuestaTemario||{}).exclusivos||[]).concat((($scope.maestro.propuestaTemario||{}).exclusivos||[]));
        }
        else if(tipoEnvio.envio==3)
        {
            elPara=(($scope.reunion.cita||{}).para||[]).concat((($scope.maestro.cita||{}).para||[]))
                .concat(($scope.reunion.propuestaTemario||{}).para||[]).concat(($scope.maestro.propuestaTemario||{}).para||[])
                    .concat(mails("cita","para")).concat(mails("propuestaTemario","para"));
                
            elcc=(($scope.reunion.cita||{}).cc||[]).concat((($scope.maestro.cita||{}).cc||[]))
            .concat(($scope.reunion.propuestaTemario||{}).cc||[]).concat(($scope.maestro.propuestaTemario||{}).cc||[])
                .concat(mails("cita","cc")).concat(mails("propuestaTemario","cc"));
                
            elcco=(($scope.reunion.cita||{}).cco||[]).concat((($scope.maestro.cita||{}).cco||[]))
            .concat(($scope.reunion.propuestaTemario||{}).cco||[]).concat(($scope.maestro.propuestaTemario||{}).cco||[])
                .concat(mails("cita","cco")).concat(mails("propuestaTemario","cco"));
                
            elexclusivo=(($scope.reunion.cita||{}).exclusivos||[]).concat((($scope.maestro.cita||{}).exclusivos||[]))
                .concat(($scope.reunion.propuestaTemario||{}).exclusivos||[]).concat(($scope.maestro.propuestaTemario||{}).exclusivos||[]);
        }
        
        var payload = {
           asunto: $scope.preAsunto + $scope.asunto,
            para: elPara, //$scope.siNoExiste($scope.reunion.cita.para).concat($scope.siNoExiste($scope.maestro.cita, "para").para),
            cc: elcc, //$scope.siNoExiste($scope.reunion.cita.cc).concat($scope.siNoExiste($scope.maestro.cita, "cc").cc),
            cco: elcco, //$scope.siNoExiste($scope.reunion.cita.cco).concat($scope.siNoExiste($scope.maestro.cita, "cco").cco),
            exclusivos: elexclusivo, //$scope.siNoExiste($scope.reunion.cita.exclusivos).concat($scope.siNoExiste($scope.maestro.cita, "exclusivos").exclusivos),
            instanciaId: $scope.instancia._id,
            mensajeHtml: "<div style='font-size: 20px; font-family: Arial; line-height: 120%;padding-top: 15px;padding-left: 5px;border-right-width: 10px;padding-right: 5px;padding-bottom: 10px;background-color: #FFD300;text-align: center;'>"+
                        "<b>" + $scope.preAsunto + $scope.asunto + "</b>"+
                    "</div><br/><hr/>"+
                    $scope.textoCita+"<br/><br/>",
            principioHtml: $scope.dias[$scope.fecha.getDay()] + " " + $scope.fecha.getDate() + " " + $scope.meses[$scope.fecha.getMonth()] + " " + $scope.hora + "hs (" + (($scope.instancia.hastaDate - $scope.instancia.desdeDate) / 60000) + "min) " + $scope.instancia.ubicacion.nombre,
            finHtml: "",
            adjunto : adjunto,
            version: $scope.version,
            usuario: $scope.username
        };

        for (var pId in $scope.instancia.participantes) {
            var p = $scope.instancia.participantes[pId];

            // equivale a
            // p.temario que podría tomar de valores: undefined, '', 'para', 'cc'
            if (p[$scope.lista] &&
                payload[p[$scope.lista]]) {
                // lo agregamos a la lista de payload.para o de payload.cc
                payload[p[$scope.lista]].push(pId);
            }
        }
        
        payload.mensajeHtml=payload.mensajeHtml.replace(/<a/g,"<u");
        payload.mensajeHtml=payload.mensajeHtml.replace(/a>/g,"u>");
        payload.mensajeHtml=payload.mensajeHtml.replace(/target/g,"");
        payload.mensajeHtml=payload.mensajeHtml.replace(/rel/g,"");
        payload.mensajeHtml=payload.mensajeHtml.replace(/title="Link: null"/g,"");
        
        $http.post('/api/orm/enviar-cita', payload).success(function() {
            $scope.enviando = false;
            //$rootScope.$broadcast('mostrar-enviar-cita', false);
            $location.url('/orm/calendario?instancia=' + $scope.instancia._id);
        }).error(function() {
            $scope.enviando = false;
            alert("Fallo el envio");
        });
    };

    $scope.hayReceptores = function() {
        var participantes = $scope.$eval('instancia.participantes');
        var receptores = false;
        for (var p in participantes) {
            if (participantes[p][$scope.lista] && participantes[p][$scope.lista] != '') {
                receptores = true;
                break;
            }
        }

        return receptores;
    };

    $scope.puedeEnviar = function() {
        if ($scope.enviando) return false;
        return $scope.hayReceptores();
    };

    $scope.agregarParticipante = function() {
        var lista = $scope.lista;

        // se seleccionó un contacto de la lista de Para, pero no está todavía
        // relacionado a la instancia reunión
        if ($scope.buscadorPara) {
            // lo agregamos
            if (!$scope.instancia.participantes[$scope.buscadorPara]) {
                $scope.instancia.participantes[$scope.buscadorPara] = {};
            }

            // lo asignamos al temario
            $scope.instancia.participantes[$scope.buscadorPara][lista] = 'para';
            $scope.buscadorPara = null;
        };

        // se seleccionó un contacto de la lista de Para, pero no está todavía
        // relacionado a la instancia de la reunión
        if ($scope.buscadorCC) {
            // lo agregamos
            if (!$scope.instancia.participantes[$scope.buscadorCC]) {
                $scope.instancia.participantes[$scope.buscadorCC] = {};
            }

            $scope.instancia.participantes[$scope.buscadorCC][lista] = 'cc';
            $scope.buscadorCC = null;
        };
    };

    $scope.noRecibeCita = function(input, param) {
        return !$scope.$eval('instancia.participantes[\'' + input._id + '\'].' + $scope.lista);
    };

    // si cambia el id de temario con el que estamos trabajando
    $scope.$watch('state.params._id', function(instanciaId) {
        if (instanciaId) {
            $scope.traerOriginal();
        } else {
            $scope.instancia = null;
        }
    });

    $scope.cambiarVersion = function(version) {
        $scope.instancia.cita.version = version;
    };
    
}).factory("tipoEnvio", function() { 
  return {
    envio:true
  };
});