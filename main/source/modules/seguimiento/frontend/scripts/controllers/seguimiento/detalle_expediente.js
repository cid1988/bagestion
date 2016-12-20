angular.module('bag2.seguimiento.detalle', []).controller('VerExpedienteCtrl',function($window, $http, $rootScope, $modal, $scope, $routeParams, $location, ExpedienteSeguimiento, Contactos, ORMOrganigrama, Jurisdiccion, Funcionario, ExpedientesConfig, ORMTema) {
    
    $scope.temas2 = ORMTema.query();
    
    $scope.jurisdiccionPorId = function (id) {
        if(id){
            for (var i = 0; i < $scope.organigrama.length; i++) {
                if ($scope.organigrama[i]._id == id){
                    return $scope.organigrama[i];
                }
            }
        }
    };
    
    $scope.expediente = ExpedienteSeguimiento.get({_id: $routeParams.id},function(){
        $scope.organigrama = ORMOrganigrama.query({},function(){
            var consulta = {
                tipo: $scope.expediente.tipo,
                ano: $scope.expediente.ano,
                numero: $scope.expediente.numero,
                reparticion: $scope.expediente.reparticion,
            };
            
            $http.post('/api/consultaSade', consulta).success(function(r){
                $scope.expediente.fechaActualizacionSade = new Date(r.documentosVinculados[0].fechavinculacionDefinitiva);
                $scope.expediente.$save();
                $scope.consultaSade = r;
                //console.log(JSON.stringify(r, null, 4));
            });
        });
    });
    
    $scope.calcularFecha = function(fecha){
        return moment(fecha).format('DD/MM/YYYY HH:mm')
    };
    
    $scope.colorFlecha = function(){
        var ultExp = $scope.expediente.comentarios;
        if(ultExp && ultExp.length && $scope.expediente.fechaActualizacionSade){
            if(ultExp.slice(-1)[0].fechaComentario >= $scope.expediente.fechaActualizacionSade){
                $scope.botonIcon = 'icon-arrow-up';
                return 'btn btn-success';
            }else{
                $scope.botonIcon = 'icon-arrow-down';
                return 'btn btn-danger';
            }
        }else{
            $scope.botonIcon = 'icon-arrow-down';
            return 'btn btn-danger';
        }
    };
    
    $scope.formatFechaSade = function(fecha){
        return moment(fecha).format('DD/MM/YYYY HH:mm');
    };
    
    $scope.temaPorId = function (id) {
        for (var i = 0; i < $scope.temas2.length; i++) {
            if ($scope.temas2[i]._id == id){
                return $scope.temas2[i];
            }
        }
    };
    
    $scope.filtrarInteresados = function(i) {
        return $scope.expediente && $scope.expediente.interesados && $scope.expediente.interesados.indexOf(i._id) == -1;
    };
    
    $scope.filtrarTemas = function(i) {
        return $scope.expediente && $scope.expediente.temas && $scope.expediente.temas.indexOf(i._id) == -1;
    };
    
    $scope.mostrarTema = function (r) {
        if (r.eliminado) {
            return false; 
        } else {
            return true;
        }
    };
    
    $scope.agregarInteresado = function(dataInteresado) {
        if (!$scope.expediente.interesados) {
            $scope.expediente.interesados = [];
        }
        $scope.expediente.interesados.push(dataInteresado);
        $scope.dataInteresado = "";
    };
    
    $scope.agregarTema = function(dataTema) {
        if (!$scope.expediente.temas) {
            $scope.expediente.temas = [];
        }
        $scope.expediente.temas.push(dataTema);
        $scope.dataTema = "";
    };
    
    $scope.modificar = function(){
        $scope.copia = angular.copy($scope.expediente);
        $scope.modificando = true;
    };
    
    $scope.cancelar = function(){
        $scope.expediente = angular.copy($scope.copia);
        $scope.modificando = false;
    };
    
    $scope.guardar = function(){
        var f = new Date();
        $scope.expediente.fechaUltimaModificacion = moment(f).format('DD/MM/YYYY'),
        //$scope.expediente.fechaVencimientoOrden = moment($scope.expediente.fechaVencimiento).zone("-00:00").format('YYYYMMDD');
        $scope.expediente.tipo = $scope.expediente.tipo.toUpperCase();
        $scope.expediente.$save(function(){
            $scope.modificando = false;
        });
    };
    
    $scope.eliminar = function(confirmado){
        if(confirmado){
            $scope.expediente.$delete(function() {
                $location.url('/expedientes');
            });
        }else{
            $("#confirmarEliminar").modal('show');
        }
    };
    
    $scope.fechaComentarioFix = function(fecha){
        return moment(fecha).format('l HH:mm');
    };
    
    $scope.agregarComentario = function(confirmado, data, enviar) {
        if(confirmado){
            $scope.expediente.comentarios.push(data);
            if(enviar){
                $scope.enviarMail(true);
            }
        }else{
            $scope.data = {
                comentarios: '',
                fuenteComentario: '',
                usuario: $scope.username,
                fechaComentario: new Date()
            };
            $("#agregarComentario").modal('show');
        }
    };
    
    $scope.guardarTime = function(data) {
        data.fechaAgregado = new Date().getTime();
        data.usuario = $scope.username;
    };
    
    $scope.uploadedFile=[];
    
    $scope.agregarDocumentos = function(confirmado, data) {
        if (confirmado) {
            $scope.guardarTime(data);
            data.archivoId = $scope.uploadedFile.shift().id;
            $scope.expediente.documentos.push(data);
        }else {
            if ($scope.expediente.documentos === undefined) {
                $scope.expediente.documentos = [];
            }
            var modalScope = $scope.$new();
            $modal({
                template: '/views/expedientes/agregarDocumentos.html',
                persist: true,
                show: true,
                backdrop: 'static',
                scope: modalScope
            });
        }
    };
    
    //Autocomplete para el campo reparticion
    $scope.reparticiones = Jurisdiccion.query(function() {
        $scope.reparticionesDict = {};
        $scope.reparticionesSiglas = [];
        $scope.reparticiones.forEach(function(item) {
            if(item.sigla){
                $scope.reparticionesDict[item._id] = item;
                $scope.reparticionesSiglas.push(item.sigla);
            }
        });
    });
    
    //Autocomplete para el campo tema
    $scope.temas = ExpedienteSeguimiento.query(function() {
        $scope.temasDict = {};
        $scope.temasSiglas = [];
        $scope.temas.forEach(function(item) {
            if (item.tema && !$scope.temasDict[item._id]) {
                $scope.temasDict[item._id] = item;
                $scope.temasSiglas.push(item.tema);
            }
        });
        
        $scope.temasSiglas.sort(function(a, b){
            if(a < b) return -1;
            if(a > b) return 1;
            return 0;
        });
    });
    
    $scope.contactos = Contactos.listar();
    
    $scope.eliminarListaElem = function(elemento, lista) {
        lista.splice(lista.indexOf(elemento), 1);
    };
    
    $scope.contactoPorId = function (id) {
        for (var i = 0; i < $scope.contactos.length; i++) {
            if ($scope.contactos[i]._id == id){
                return $scope.contactos[i];
            }
        }
    };
    
    $scope.enviarMail = function(seEnvia){
        if(!seEnvia){
            $scope.interesados = "";
            $scope.expediente.interesados.forEach(function(int){
                $scope.interesados = $scope.interesados + $scope.contactoPorId(int).apellidos + ' ' + $scope.contactoPorId(int).nombre + ', ';
            });
            $("#mailEnviado").modal('show');
        }else{
            var res = [];
            $scope.expediente.interesados.forEach(function(int){
                int = $scope.contactoPorId(int);
                int.correos.forEach(function(correo){
                    if(correo.nombre === "Email oficial"){
                        res.push(correo.valor);
                    }
                });
            });
            
            $scope.ultComDgcontg = $scope.expediente.comentarios.slice(-1)[0];
            var fechaComentario = moment($scope.ultComDgcontg.fechaComentario).format('DD/MM/YYYY');
            
            $scope.exp = ExpedientesConfig.get({_id:'51337baa1bc0d6af1f000001'},function(){
                $scope.enviando = true;
                var payload = {
                    asunto: $scope.exp.asunto,
                    para: res,
                    mensajeHtml:"<table align='center' style='font-size:inherit;line-height:inherit;text-align:center;border-spacing:0;border-collapse:collapse;padding:0;border:0;' cellpadding='0' cellspacing='0'>"+
                        "<tbody><tr><td style='font-family:Helvetica,Arial,sans-serif;height:16px;' height='16'></td></tr>"+
        	                "<tr>"+
        		                "<td style='font-family:Helvetica,Arial,sans-serif;width:685px;'>"+
        			                "<table align='center' style='font-size:inherit;line-height:inherit;padding:0;border:0;'>"+
        				                "<tbody>"+
    						                "<tr>"+
                        						"<td colspan='3' style='font-family:Helvetica,Arial,sans-serif;width:685px;font-size:11px;color:#888;text-align:center;background-repeat:no-repeat;padding:15px 0 10px;' align='center'>"+
                        							"<img src='http://oi59.tinypic.com/2lnjp08.jpg' style='display:inline-block;width:81px;min-height:22px;'>"+
                        						"</td>"+
    						                "</tr>"+
                    						"<tr>"+
                      							"<td colspan='3' align='center' style='font-family:Helvetica,Arial,sans-serif;color:#2b2b2b;font-size:27px;font-weight:300;word-break:break-word;padding:23px 0 0px;'>"+'Se ha actualizado el siguiente expediente: ' + $scope.expediente.titulo+"</td>"+
                            				"</tr>"+
                            				"<tr>"+
                      							"<td colspan='3' align='center' style='font-family:Helvetica,Arial,sans-serif;color:#2b2b2b;font-size:27px;font-weight:300;word-break:break-word;padding:23px 0 0px;'>" + "</td>"+
                            				"</tr>"+
                    	        			
                    	        			"<tr>"+
                                    			"<td style='font-family:Helvetica,Arial,sans-serif;font-size:14px;font-weight:300;color:#9b9b9b;vertical-align:top;line-height:21px;text-align:right;width:185px;padding:0 0 4px;' valign='top'>Fecha Comentario:</td>"+
                                   				"<td style='width: 25px;' ></td>"+
                                    			"<td style='font-family:Helvetica,Arial,sans-serif;font-size:15px;font-weight:300;color:#666;line-height:20px;width:500px;padding:0 0 4px;text-align:left;'>" + fechaComentario + "</td>"+                                                            
                    	        			"</tr>"+
                    	        			
                    	        			"<tr>"+
                                    			"<td style='font-family:Helvetica,Arial,sans-serif;font-size:14px;font-weight:300;color:#9b9b9b;vertical-align:top;line-height:21px;text-align:right;width:185px;padding:0 0 4px;' valign='top'>Fuente:</td>"+
                                   				"<td style='width: 25px;' ></td>"+
                                    			"<td style='font-family:Helvetica,Arial,sans-serif;font-size:15px;font-weight:300;color:#666;line-height:20px;width:500px;padding:0 0 4px;text-align:left;'>" + $scope.ultComDgcontg.fuenteComentario + "</td>"+                                                            
                    	        			"</tr>"+
                    	        			
                    	        			"<tr>"+
                                      			"<td style='font-family:Helvetica,Arial,sans-serif;font-size:14px;font-weight:300;color:#9b9b9b;vertical-align:top;line-height:21px;text-align:right;width:185px;padding:0 0 4px;' valign='top'>Comentario:</td>"+
                                      			"<td style='width: 25px;'></td>"+
                                      			"<td style='font-family:Helvetica,Arial,sans-serif;font-size:15px;font-weight:300;color:#666;line-height:20px;width:500px;padding:0 0 4px;text-align:left;'>"+ $scope.ultComDgcontg.comentarios +"</td>"+                                                    
                    	        			"</tr>" + 
                    	        			
                    	        			"<tr>"+
                                    			"<td style='font-family:Helvetica,Arial,sans-serif;font-size:14px;font-weight:300;color:#9b9b9b;vertical-align:top;line-height:21px;text-align:right;width:185px;padding:0 0 4px;' valign='top'>Ver expediente:</td>"+
                                   				"<td style='width: 25px;' ></td>"+
                                    			"<td style='font-family:Helvetica,Arial,sans-serif;font-size:15px;font-weight:300;color:#666;line-height:20px;width:500px;padding:0 0 4px;text-align:left;'>"+ '<a href="http://bagestion.gcba.gob.ar/expedientes/' + $scope.expediente._id + '">Click aqui</a> <br><br>' + "</td>"+                                                            
                    	        			"</tr>"+
                    	        		"</tbody>"+
    		                        "</table>"+
                                "</td>"+
                            "</tr>"+
                            "<tr>"+
         	                    "<td colspan='3' background='https://statici.icloud.com/emailimages/v4/common/footer_gradient_web.png' style='font-family:Helvetica,Arial,sans-serif;width:685px;font-size:11px;color:#888;text-align:center;background-repeat:no-repeat;padding:15px 0 10px;' align='center'>"+
           			                "<span style='font-size:16px;'>Gobierno de la ciudad de Buenos Aires</span>"+
         		                "</td>"+
       		                "</tr>"+
       		            "</tbody>"+
                    "</table>",
                    adjunto : "",
                    from : "Bagestion Expedientes<sistema.expedientes@buenosaires.gob.ar>"
                };
                
                $http.post('/api/seguimiento/enviar-mail', payload).success(function() {
                    $scope.enviando = false;
                    alert("Se ha enviado el mail con exito");
                }).error(function() {
                    $scope.enviando = false;
                    alert("Fallo el envio");
                });
            });
        }
    };
});