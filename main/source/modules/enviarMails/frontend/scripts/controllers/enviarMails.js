var moduloEnvios = angular.module('bag2.enviarMails', ['ui.bootstrap']);
moduloEnvios.controller("enviarMailsCtrl", function($scope, $http){
	// Los cargando...
		$scope.cargandoSelecetsContactos = {
			cargandoContactos: "Cargando Contactos...",
			cargo: false
		};
		$scope.cargandoListas = {
			cargandoListasTexto: "Cargando Listas...",
			cargo: false
		};
		$scope.envarMailCargando = {
			enviando: "noEnviando"
		};
	// Declaro variables.
		$scope.contactos={};
		$scope.parametrosModal = {};
		$scope.correo = {
			usuarioEnvio: $scope.username,
			emisor: $scope.username,
			fechaEnvio: "",
			destinatarios: {
				para: [],
				cc: [],
				cco: []
			},
			tipoDeMensaje: "Texto",
			mensaje: "",
			asunto: "",
			adjuntos: [],
			listaContactos: []
		};

	// Funciones que se ejecutan al cargar.
		// Traigo todos los contactos (TODO: mejorar)
		(function(){
			$http.post('/api/enviarMail/traerContactos', {}).success(function(resultado) {
				if(resultado.error){
					console.error("\n\n\t" + resultado.explicacion + "\n\tError: " + resultado.tipo);
				} else {
					$scope.contactos = resultado.contactos;

					// Cuando traiga todo del servidor
					$scope.cargandoSelecetsContactos.cargandoContactos = null;
					$scope.cargandoSelecetsContactos.cargo = true
				}
			}).error(function(){
				console.error("\nError al buscar contactos\n");
			});
		})();
		// Traigo todas las listas
		(function(){
			function traerListasServer(){
				$http.post('/api/enviarMail/traerListas', { username: $scope.username }).success(function(resultado) {
					if(resultado.error){
						console.error("\n\n\t" + resultado.explicacion + "\n\tError: " + resultado.tipo);
					} else {
						$scope.listas = {
							listasPropias: {
								total: resultado.listasPropias.length,
								lista: resultado.listasPropias
							},
							listasCompartidas: {
								total: resultado.listasCompartidas.length,
								lista: resultado.listasCompartidas
							}
						};
						$scope.cargandoListas.cargandoListasTexto = null;
						$scope.cargandoListas.cargo = true;
					}
				}).error(function(){
					console.error("\nError al buscar las listas\n");
				});
			}
			traerListasServer();
			window.traerListas = traerListasServer;
		})();

	// Funciones de uso "global".
		// @Alex: Se le pasa el id de modal y un parametro (o no). Asi se llama a cualquier modal.
		$scope.abrirModal = function(idModal, parametro){
			$('#'+idModal).modal();
			/* @Alex: $scope.parametrosModal contiene los parametros de llamada que se pasan desde el HTML.
				De este modo se evita crear muchas funciones que llamen a modals.
				Creo 1 que llama y creo una variable global con parametros que despues toman los modals. */
			$scope.parametrosModal.param = parametro || "";

			$scope.parametrosModal.idModal = idModal;
		};
		// Vacia los ui-select2 pasandoles el id.
		var vaciarSelect2 = function(id){
			document.querySelector("#s2id_" + id + "> a > span").textContent = "";
		};
		// Se le pasa el nombre de un archivo y devuelve los caracteres que se encuentran despues del "."
		var obtenerExtencion = function(nombre){
			var ubicacionPunto = nombre.indexOf(".");
			if(ubicacionPunto >= 0){
				var extencion = nombre.substring(ubicacionPunto, nombre.length);

				return extencion;
			} else {
				return "";
			}
		};

	// Eventos "globales".
		// Cuando cualquier modal termina de mostrarse al primer input le hago focus.
		$(".modal").on('shown.bs.modal', function () {
		    $(this).find("input:visible:first").focus();
		});

		// Cuando se cierra cualquier modal el mensaje del modal no se muestra y vacio todos los campos.
		$(".modal").on('hidden', function () {
		    $scope.mensajeError = "";
		    $scope.campoModal = {};
		});

	// Pantalla 1.

		// Carga de Contactos

			// Selects
				// Busca el mail oficial de un contacto en un array de emails, en caso de no encontrarlo retorna el primero del array
				var buscarOficial = function(correos, tipoEmail){
					var lengthCorreos = correos.length;
					for( var i = 0; i < lengthCorreos; i++ ){
						if( correos[i].nombre == tipoEmail ){
							return correos[i];
						}
					}
					return correos[0];
				};

				/*
					@Alex: Se encarga de recibir el contacto entero y de almacenarlo en el tipo correspondiente:
						Ejemplo: Tipo = "para" , contacto = "Objeto"
							$scope.correos.destinatarios.para  = "Objeto"
				*/
				$scope.agregarContacto = function(tipo, contacto, idSelect){
					// Evito que lo ejecute cuando carga
					if( contacto !== "" ){
						// Vacio el campo luego de recibir.
						if( idSelect ){ vaciarSelect2( idSelect ); }
						// Lo recibe como texto, asi que lo paso a JSON.
						contacto = JSON.parse( contacto );
						// Compruebo que no exista en la lista.
						var tamanno = $scope.correo.destinatarios[tipo].length;
						for( var i = 0; i < tamanno; i++ ){
							if( $scope.correo.destinatarios[tipo][i].idContacto == contacto._id){
								console.log("\n\t" + "No se puede crear al contacto " + contacto.apellidos + contacto.nombre + " porque ya existe en el " + tipo + "\n");
								return;
							}
						}
						$scope.correo.destinatarios[tipo].push({
							idContacto: contacto._id,
							nombre: contacto.nombre || "",
							apellidos: contacto.apellidos || "",
							correo: contacto.correos || [],
							correoOficial: buscarOficial(contacto.correos, "Email oficial").valor
						});
					}
				};

				/*
					@Alex: Se le pasa un idContacto y donde se encuentra, y lo elimina.
						Decidi pasarle el id y no el $index porque capas que a futuro desean ordenarlo alfabeticamente y eso,
						ocacionaria que tenga que rearmar la funcion.
				*/
				$scope.eliminarContacto = function(idContacto, tipo){
					var lengthContacto = $scope.correo.destinatarios[tipo].length;

					for( var i = 0; i < lengthContacto; i++ ){
						if( $scope.correo.destinatarios[tipo][i].idContacto == idContacto){
							$scope.correo.destinatarios[tipo].splice(i,1);
							return;
						}
					}
				};

				/*
					@Alex: Por cada contacto, recorro la lista de envio y si esta repetido no lo muestra.
						Si la lista de contactos es igual a 0 retorna true directamente.
				*/
				$scope.noRepetir = function(tipo){
					var lengthContacto = $scope.correo.destinatarios[tipo].length;

					if (lengthContacto){
						return function(contacto){
							for( var i = 0; i < lengthContacto; i++ ){
								if( $scope.correo.destinatarios[tipo][i].idContacto == contacto._id ){
									return false;
								}
							}
							return true;
						};
					} else {
						return true;
					}
				};

			// Boton Crear Contacto
				$scope.crearContacto = function(tipo, contactoNuevo){
					// Envio los parametros del nuevo contacto
					$http.post( '/api/enviarMail/crearContacto', contactoNuevo ).success(function(resultado) {
						if(resultado.error){
							console.error("\n\n\t" + resultado.explicacion + "\n\tError: " + resultado.tipo);
							$scope.mensajeError = "<span style='color:red'>Ocurrio un error al crear el contacto</span>";
						} else {
							if(!resultado.error){
								if(resultado.yaExiste){
									console.log(" El contacto ya existe, y no se cargara ");
									$scope.mensajeError = "El contacto ya existe puede verlo haciendo click <a href='/contactos/detalle/"+ resultado.idContacto + "'" +" target='_blank'>aquí</a>";
								} else {
									$scope.agregarContacto(tipo, JSON.stringify(resultado));
									$("#"+$scope.parametrosModal.idModal).modal("toggle");
								}
							} else {
								console.error("\n\n\t" + resultado.explicacion + "\n\tError: " + resultado.tipo);
								$scope.mensajeError = "<span style='color:red'>Ocurrio un error al crear el contacto</span>";
							}
						}
					}).error(function(){
						console.error("\nError al crear el contacto\n");
					});
				};

			// Boton Vaciar lista
				$scope.vaciarListaContactos = function(){
					$scope.correo.destinatarios.para.length = 0;
					$scope.correo.destinatarios.cc.length = 0;
					$scope.correo.destinatarios.cco.length = 0;
				};
			// Boton Vaciar correo
				$scope.vaciarCorreo = function(){
					$scope.correo.tipoDeMensaje = "Texto";
					$scope.correo.mensaje = "";
					$scope.correo.asunto = "";
					$scope.correo.adjuntos.length = 0;
					$scope.correo.listaContactos.length = 0;
				};
		// Listas

			// Mis Listas

				// Boton Crear Lista
					$scope.usuarios = [];
					$scope.listaEdicion = {
						destinatarios: {
							para: $scope.correo.destinatarios.para,
							cc: $scope.correo.destinatarios.cc,
							cco: $scope.correo.destinatarios.cco
						},
						nombreLista: "",
						usuariosPermitidos: [],
						duenno: $scope.username,
						vecesUsada: 0,
						listaDeUsos: [],
						eliminada: false
					};

					// Al abrir el modal trae todos los usuarios.
					$("#modalCrearLista").on("shown", function(){
						if($scope.usuarios.length === 0){
							$http.post('/api/enviarMail/traerUsers', {}).success(function(resultado) {
								if(resultado.error){
									console.error("\n\n\t" + resultado.explicacion + "\n\tError: " + resultado.tipo);
								} else {
									$scope.usuarios = resultado.usuarios;
									$scope.$parent.usuarios = resultado.usuarios;
								}
							}).error(function(){
								console.error("\nError al buscar usuarios\n");
							});
						}
					});

					// Agrega los usuarios con permisos de usar al objeto listaEdicion.
					$scope.agregarUsuario = function(usuario, idSelect){
						if(usuario !== ""){
							// Lo recibe como texto, asi que lo paso a JSON.
							usuario = JSON.parse(usuario);
							// Compruebo que no exista.
							var tamanno = $scope.listaEdicion.usuariosPermitidos.length;
							for( var i = 0; i < tamanno; i++){
								if( $scope.listaEdicion.usuariosPermitidos[i]._id == usuario._id){
									console.log("\n\t" + "No se puede agregar al usuario " + usuario.apellido + usuario.nombre + " porque ya existe en la lista.\n");
									return;
								}
							}
							$scope.listaEdicion.usuariosPermitidos.push(usuario);
						}
						// Vacio el campo luego de recibir.
						vaciarSelect2(idSelect);
					};

					// Eliminar los usuarios con permisos de la lista.
					$scope.eliminarUsuario = function(_id){
						var tamanno = $scope.listaEdicion.usuariosPermitidos.length;
						for( var i = 0; i < tamanno; i++ ){
							if( $scope.listaEdicion.usuariosPermitidos[i]._id == _id ){
								$scope.listaEdicion.usuariosPermitidos.splice(i,1);
								return;
							}
						}
					};

					// Despues de editar o guardar una lista, ejecutar lo siguiente.
					var dpsEditarGuardarLista = function(){
						// Cierro Modal y vacio los campos
						$("#modalCrearLista").modal("hide");
						// Esta forma es mas rapida que asignar el array a []
						$scope.correo.destinatarios.para.length = 0;
						$scope.correo.destinatarios.cc.length = 0;
						$scope.correo.destinatarios.cco.length = 0;
						$scope.listaEdicion = {
							destinatarios: {
								para: $scope.correo.destinatarios.para,
								cc: $scope.correo.destinatarios.cc,
								cco: $scope.correo.destinatarios.cco
							},
							nombreLista: "",
							usuariosPermitidos: [],
							duenno: $scope.username,
							vecesUsada: 0,
							listaDeUsos: [],
							eliminada: false
						};
						// Recargo las listas.
						traerListas();
					};

					// Guardo la lista en la coleccion y le asigno a cada usuario sus listas permitidas.
					$scope.guardarLista = function(){
						if( $scope.correo.destinatarios.para.length || $scope.correo.destinatarios.cc.length || $scope.correo.destinatarios.cco.length){

							$scope.listaEdicion.destinatarios = $scope.correo.destinatarios;

							// Guardo la lista en la BD (desde el backend enlazo la vista con sus usuarios)
							var listaEdicion = $scope.listaEdicion;

							$http.post('/api/enviarMail/guardarLista', listaEdicion).success(function(resultado) {
								if(resultado.error){
									console.error("\n\n\t" + resultado.explicacion + "\n\tError: " + resultado.tipo);
								} else {
									dpsEditarGuardarLista();
								}
							}).error(function(){
								console.error("\n\n\t" + resultado.explicacion + "\n\tError: " + resultado.tipo);
								// Abrir modal de Error
								$('#modalCrearLista').modal('hide');
								var parametroModal = {
									titulo: "Error al crear la lista",
									explicacion: "Ocurrio un error al crear la lista."
								};
								$scope.abrirModal("modalInformacion", parametroModal);
							});

						} else {
							$('#modalCrearLista').modal('hide');
							var parametroModal = {
								titulo: "Error al crear la lista",
								explicacion: "No se puede crear una lista si no existe al menos un contacto cargado en el Para, CC o CCO."
							};
							$scope.abrirModal("modalInformacion", parametroModal);
						}
						console.log("\n\n\t " + JSON.stringify($scope.listaEdicion, null, 4));
					};

					// Retorna el array1 concatenado con el array 2, (sirve para utilizar con arrays de objetos) preguntando por el "campoAPreguntar"
					var concatenarArrays = function(array1, array2, campoAPreguntar){
						var listaTemporal = array1.concat(array2);
						array1.length = 0;
						var lengthListaTemporal = listaTemporal.length;
						for( var i = 0; i < lengthListaTemporal; i++ ){
							var encontrada = false, lengthArray1 = array1.length;
							for( var j = 0; j < lengthArray1; j++ ){
								if( listaTemporal[i][campoAPreguntar] == array1[j][campoAPreguntar]){
									encontrada = true;
									break;
								}
							}
							if(!encontrada){
								array1[array1.length] = listaTemporal[i];
							}
						}

						return array1;
					};

					// Concateno la lista actual de contactos con lo que se me envie
					$scope.agregarALaLista = function(destinatarios){
						$scope.correo.destinatarios.para = concatenarArrays($scope.correo.destinatarios.para, destinatarios.para, "idContacto");
						$scope.correo.destinatarios.cc = concatenarArrays($scope.correo.destinatarios.cc, destinatarios.cc, "idContacto");
						$scope.correo.destinatarios.cco = concatenarArrays($scope.correo.destinatarios.cco, destinatarios.cco, "idContacto");
					};

					// Apagar las listas
					$scope.apagarLista = function(lista, abrirModal){
						if( abrirModal ){
							$scope.listaAApagar = lista;
							var parametroModal = {
									titulo: ("Eliminar lista " + lista.nombreLista),
									explicacion: "¿Está seguro que desea eliminar la lista " + lista.nombreLista + "?"
								};
							$scope.abrirModal("modalApagarLista", parametroModal);
						} else {
							$http.post('/api/enviarMail/apagarLista', lista).success(function(resultado) {
								if(resultado.error){
									console.error("\n\n\t" + resultado.explicacion + "\n\tError: " + resultado.tipo);
								} else {
									$("#modalApagarLista").modal('hide');
									traerListas();
									var parametroModal = {
										titulo: "Exito",
										explicacion: ("La lista " + lista.nombreLista + " se eliminó con exito.")
									};
									$scope.abrirModal("modalInformacion", parametroModal);
								}
							}).error(function(){
								console.error("\n\n\t" + resultado.explicacion + "\n\tError: " + resultado.tipo);
								// Abrir modal de Error
								$('#modalCrearLista').modal('hide');
								var parametroModal = {
									titulo: "Error al elimionar la lista",
									explicacion: "Ocurrio un error al eliminar la lista."
								};
								$scope.abrirModal("modalInformacion", parametroModal);
							});
						}
					};

	// Pantalla 2

		// Añadir archivo adjunto

			// Al guardar
			$scope.adjuntosTemporal = [];

			// Al precionar "Añadir Adjunto" copia el array temporal de adjuntos en el array de correos.
			$scope.guardarAdjuntos = function(arrayAdjuntos, idModal){
				var lengthAdjuntos = arrayAdjuntos.length;
				for( var i = 0; i < lengthAdjuntos; i++ ){
					$scope.correo.adjuntos[i] = {
						extencion: obtenerExtencion(arrayAdjuntos[i].id),
						id: arrayAdjuntos[i].id,
						ok: arrayAdjuntos[i].ok,
						succes: arrayAdjuntos[i].success
					};
				}
				$("#"+idModal).modal('hide');
			};

			// Al precionar "Cancelar" vacia el array temporal de adjuntos
			$scope.cancelarAdjuntos = function(){
				$scope.adjuntosTemporal = [];
			};

			// Elimina los adjuntos del correo
			$scope.eliminarAdjunto = function(id){
				var lengthAdjuntos = $scope.correo.adjuntos.length;
				for( var i = 0; i < lengthAdjuntos; i++ ){
					if( id == $scope.correo.adjuntos[i].id ){
						$scope.correo.adjuntos.splice(i,1);
						return;
					}
				}
			};

			// Visualizar Archivo adjunto
			$scope.visualizarAdjunto = function( file, index ){
				var compilar = "";
				if( file.extencion == ".jpg" || file.extencion == ".jpeg" || file.extencion == ".png"){
					compilar = "<img src='/file/"+file.id+"' style='width:100%'/>";
				} else if ( file.extencion == ".mp4") {
					compilar = "<video width='100%' controls><source src='/file/"+file.id+"' type='video/mp4'> </video>";
				} else if ( file.extencion == ".pdf"){
					compilar = "<div id='verPDF'></div><embed src='/file/" + file.id+"'" + "width='100%', height='500px'>";
				}
				$scope.abrirModal("modalVerAdjunto", { titulo: ( "Adjunto nº " + index ),  compilar: compilar});
			}

		// Enviar mail
			// Funcion para enviar mails
			$scope.enviarMail = function(pasword, modalCerrar){
				$scope.envarMailCargando.enviando = "Enviando";
				if( $scope.correo.destinatarios.para.length+$scope.correo.destinatarios.cc.length+$scope.correo.destinatarios.cco.length>0 ){
					// Enviar Mail
					if( pasword ){ $scope.correo.pasword = CryptoJS.AES.encrypt(pasword, "BAGestion%1234"); }

					if( modalCerrar ){ $("#"+modalCerrar).modal("hide"); }

					$http.post('/api/enviarMail/enviarMail', $scope.correo).success(function(resultado) {
						if( resultado.error ){
							$scope.abrirModal("modalInformacion", { titulo: "Error", explicacion: "Ocurrio un error al enviar el mail"});
							console.error("\n\n\t" + resultado.explicacion + "\n\tError: " + JSON.stringify(resultado.tipo,null,4));
							$scope.envarMailCargando.enviando = "noEnviando";
						} else {
							if( resultado.pudoEnviar ){
								// Si tenia permisos y se envio el mail mostrar modal de exito
								$scope.abrirModal("modalInformacion", { titulo: "Exito!", explicacion: "Su correo se envio de forma exitosa"});
								$scope.envarMailCargando.enviando = "noEnviando";
							} else {
								// Si no tiene permisos pedir la contraseña
								if( resultado.pedirPasword ){
									// Password erroneo
									if( resultado.errorPasword ){
										$scope.envarMailCargando.enviando = "noEnviando";
										$scope.abrirModal("modalIngreseContrasenna", { titulo: ("Contraseña erronea para "+$scope.correo.emisor) });
									} else {
										// Pedir por primera vez Password
										$scope.envarMailCargando.enviando = "noEnviando";
										$scope.abrirModal("modalIngreseContrasenna", { titulo: ("Usuario: "+$scope.correo.emisor)});
									}
								} else if ( resultado.noExisteUsuario ){
									// No existe el usuario
									$scope.abrirModal("modalInformacion", { titulo: "Error", explicacion: "No existe el usuario"});
									$scope.envarMailCargando.enviando = "noEnviando";
								} else if ( resultado.malPassword ){
									$scope.abrirModal("modalInformacion", { titulo: "Error", explicacion: resultado.mensaje});
									$scope.envarMailCargando.enviando = "noEnviando";
								} else {
									// Error desconocido
									$scope.abrirModal("modalInformacion", { titulo: "Error", explicacion: "Ocurrio un error al enviar el mail"});
									$scope.envarMailCargando.enviando = "noEnviando";
								}
							}
						}
						// Luego de enviar un mail se vacian todos los campos de contraseña
						$scope.correo.pasword = undefined;
						$scope.contrasennaCorreo = undefined;
					}).error(function(){
						// Error desconocido
						console.error("\nError al enviar el mail\n");
						$scope.abrirModal("modalInformacion", { titulo: "Error", explicacion: "Ocurrio un error al enviar el mail"});
						$scope.envarMailCargando.enviando = "noEnviando";
					});
				} else {
					// En el caso de que no existan contactos cargados
					var parametroModal = {
						titulo: "Error al enviar",
						explicacion: "Solo se puede enviar si selecciona al menos un contacto en el Para, CC o CCO"
					};
					$scope.abrirModal("modalInformacion", parametroModal);
					$scope.envarMailCargando.enviando = "noEnviando";
				}
			};
	// NavbarRight
		// Al abrir el modal trae todos los usuarios.
		$("#modalAsignarPermisos").on("shown", function(){
			// Trae la lista de usuarios total
			if( !( $scope.$parent.hasOwnProperty("usuarios") ) ){
				$http.post('/api/enviarMail/traerUsers', {}).success(function(resultado) {
					if(resultado.error){
						console.error("\n\n\t" + resultado.explicacion + "\n\tError: " + resultado.tipo);
					} else {
						$scope.usuarios = resultado.usuarios;
						$scope.$parent.usuarios = resultado.usuarios;
					}
				}).error(function(){
					console.error("\nError al buscar usuarios\n");
				});
			}
			// Trae la lista de usuarios que tienen permitido enviar mails a mi nombre
			if( !( $scope.$parent.hasOwnProperty("usuariosPermitidos") ) ){
				$http.post('/api/enviarMail/traerUsersPermitidos', { username: $scope.username }).success(function(resultado) {
					if(resultado.error){
						console.error("\n\n\t" + resultado.explicacion + "\n\tError: " + resultado.tipo);
					} else {
						$scope.$parent.usuariosPermitidos = resultado.usuariosPermitidos;
					}
				}).error(function(){
					console.error("\nError al buscar usuarios\n");
				});
			}
		});

		// Agrega los usuarios a la lista de usuarios que tienen acceso a mi mail
		$scope.agregarUserPermitido = function(usuario, idSelect){
			if( usuario !== "" ){
				usuario = JSON.parse(usuario);
				vaciarSelect2(idSelect);
				for( var i = 0; i < $scope.$parent.usuariosPermitidos.length; i++){
					if( $scope.$parent.usuariosPermitidos[i]._id == usuario._id){
						return;
					}
				}
				$scope.$parent.usuariosPermitidos.push(usuario);
			}
		};

		// Elimina los usuarios de la lista de usuarios que tienen acceso a mi mail
		$scope.eliminarUserPermitido = function(idUsuario){
			for( var i = 0; i < $scope.$parent.usuariosPermitidos.length; i++ ){
				if( $scope.$parent.usuariosPermitidos[i]._id == idUsuario ){
					$scope.$parent.usuariosPermitidos.splice(i, 1);
					return;
				}
			}
		};

		// Envia al servidor para guardar en el user el nuevo dato de los usuarios permitidos
		$scope.guardarCambiosUsersPermitidos = function(){
			if( $scope.$parent.passwordMail && $scope.$parent.passwordMail !== "" ){
				$scope.$parent.passwordMail = CryptoJS.AES.encrypt($scope.$parent.passwordMail, "BAGestion%1234");
				$http.post('/api/enviarMail/guardarUsersPermitidos', { username: $scope.username, usuariosPermitidos: $scope.$parent.usuariosPermitidos, passwordMail: $scope.$parent.passwordMail}).success(function(resultado) {
					if(resultado.error){
						console.error("\n\n\t" + resultado.explicacion + "\n\tError: " + resultado.tipo);
					} else {
						$scope.$parent.parametroModalRight = {};
						$scope.$parent.parametroModalRight.titulo = "Exito!";
						$scope.$parent.parametroModalRight.explicacion = "La lista de usuarios que pueden utilizar su correo se actualizo exitosamente.";
						$('#modalNavbarRight').modal();
						$('#modalAsignarPermisos').modal("hide");
						$scope.$parent.passwordMail = "";
						document.querySelector("#mensajeAviso").innerHTML  = "";
					}
				}).error(function(){
					console.error("\nError al buscar usuarios\n");
				});
			} else {
				document.querySelector("#mensajeAviso").innerHTML  = "<span class='label label-important'>Ingrese la cotnraseña</span>";
			}
		};
});