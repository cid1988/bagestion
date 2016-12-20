// API para enviar mails (temario, minuta)
exports = module.exports = function(app, conf) {
	var mongo = require('mongodb');
	var db = require('../../../db');
	var emails = require('../../emails/backend/locals');
	db.setConf(conf);
	
	var textoADevolver="<div> ------------------------------------------------------------------------------------";
                            
	var enviarMensaje = function(contactos, asunto, listaPara, listaCC, listaCCO, listaExclusivos, principioHtml, temarioHtml, finHtml, adjunto, mailFrom, callback) {
		var contactosPorId = {};
        var Iconv  = require('iconv').Iconv;
        var iconv = new Iconv('UTF-8', 'US-ASCII//TRANSLIT');
        asunto = iconv.convert(asunto);
        
        if (mailFrom ==" ") {
            mailFrom = conf.temarios.email.from;
        }
        
        //var Buffer = require('buffer').Buffer;
        //var Iconv  = require('iconv').Iconv;
        //var assert = require('assert');
        
        //var iconv = new Iconv('UTF-8', 'ISO-8859-1');
        //var buffer = iconv.convert(asunto);
        //asunto = iconv.convert(new Buffer(asunto));
        //assert.equals(buffer.inspect(), asunto.inspect());
        
		contactos.forEach(function(c) {
			contactosPorId[c._id.toString()] = c;
		});
		
		var buscarCorreo = function(nombre, contacto) {
		    var emails = "";
            if (!contacto.correos) {
                return "";
            }
            else {
                for (var i = 0; i < contacto.correos.length; i++) {
                    var em = contacto.correos[i];
                    var expr = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
                    if (em.nombre == nombre) {
                        if ( !expr.test(em.valor) ) {
                            
                        } else {
                            if (emails === "") {
                                emails = em.valor;
                            } else {
                                emails = emails + ", " + em.valor;
                            }
                        }
                    }
                    if (em.checkedCCO) {
                        if ( !expr.test(em.valor) ) {
                            
                        } else {
                            if (emails === "") {
                                emails = em.valor;
                            } else {
                                emails = emails + ", " + em.valor;
                            }
                        }
                    }
                }
            }
            return emails;
        };

		// En el formato 'Diego Pérez <eazel7@gmail.com>,Daniela Costa <dcosta@yahoo.com>
		var para = '';
		var cc = '';
		var cco = '';
		var exclusivos = '';
		//Aca le puse que todos los mails los ponga en cco porque no quieren que se vean.

		listaPara.forEach(function(p) {
			var contacto = contactosPorId[p.contactoId];

			if (buscarCorreo('Email oficial', contacto)) {
    			if (para > '') {
    				para += ',';
    			}
    			para +=  buscarCorreo('Email oficial', contacto);
            }
		});

		listaCC.forEach(function(p) {
			var contacto = contactosPorId[p.contactoId];

			if (buscarCorreo('Email oficial', contacto)) {
    			if (cc > '') {
    				cc += ',';
    			}
    			cc +=  buscarCorreo('Email oficial', contacto);
            }
		});

		listaCCO.forEach(function(p) {
			var contacto = contactosPorId[p.contactoId];
			
            if (buscarCorreo('Email oficial', contacto)) {
    			if (cco > '') {
    				cco += ',';
    			}
    			cco +=  buscarCorreo('Email oficial', contacto);
            }
		});

		listaExclusivos.forEach(function(p) {
			var contacto = contactosPorId[p.contactoId];

			if (buscarCorreo('Email oficial', contacto)) {
    			if (cc > '') {
    				cc += ',';
    			}
    			cc += buscarCorreo('Email oficial', contacto);
            }
		});

		// ambos son html
		var html = principioHtml +
			temarioHtml +
			'<hr />' +
			'<br />' +
			finHtml;
		html = '<div style="font-size: 24px; font-family: Arial; line-height: 150%">' + html + '</div>';

		var texto = require('html-to-text').fromString(html, {
			wordwrap: 130
		});

		var emailMessage = emails.createMessage(
			mailFrom,
			asunto,
			texto, html, para, cc, cco, adjunto,
		// TODO: CC no implementado
		'');

		emails.sendMail(emailMessage, callback);
	};
	app.post(conf.api.prefix + '/orm/enviar-temario', function(req, res) {
	    textoADevolver+="<div>"+
	                        "<ol>"+
	                            "<li> Entro </li>";
	    console.log("---------------------------------------------------ENTRO 1--------------------------------------------------------");
		var payload = req.body;

		db.getDbInstance(function(err, db) {
		    textoADevolver+="<li> Entro </li>";
		    console.log("---------------------------------------------------ENTRO 2--------------------------------------------------------");
			// Ahora db es una instancia de la base de datos, no un módulo
			if (err) {
				console.log(err);
				res.status(503);
				res.end();
			} else {
			    textoADevolver+="<li> Entro </li>";
			    console.log("---------------------------------------------------ENTRO 3--------------------------------------------------------");
				db.collection('orm.temarios').findOne({
					_id: new mongo.ObjectID(payload.temarioId)
				}, function(err, temario) {
					if (err) {
						console.log(err);
						res.status(503);
						res.end();
					} else {
					    textoADevolver+="<li> Entro </li>";
					    console.log("---------------------------------------------------ENTRO 4--------------------------------------------------------");
						var html = temario.html;
						var mailFrom = " ";
						
						if (payload.desdeEmail) {
						    var mailFrom = payload.desdeEmail;
						}

						db.collection('orm.reuniones.instancias').findOne({
							_id: new mongo.ObjectID(temario.instancia)
						}, function(err, instancia) {
							if (err) {
								console.log(err);
								res.status(503);
								res.end();
							} else {
							    textoADevolver+="<li> Entro </li>";
							    console.log("---------------------------------------------------ENTRO 5--------------------------------------------------------");
								var queryContactos = {
									_id: {
										$in: []
									}
								};

								payload.para && payload.para.forEach(function(c) {
									queryContactos._id.$in.push(new mongo.ObjectID(c.contactoId));
								});

								payload.cc && payload.cc.forEach(function(c) {
									queryContactos._id.$in.push(new mongo.ObjectID(c.contactoId));
								});

								payload.cco && payload.cco.forEach(function(c) {
									queryContactos._id.$in.push(new mongo.ObjectID(c.contactoId));
								});

								payload.exclusivos && payload.exclusivos.forEach(function(c) {
									queryContactos._id.$in.push(new mongo.ObjectID(c.contactoId));
								});
								

								db.collection('orm.contactos').find(queryContactos, function(err, docs) {
									if (err) {
										console.log(err);
										res.status(503);
										res.end();
									} else {
									    textoADevolver+="<li> Entro </li>";
									    console.log("---------------------------------------------------ENTRO 6--------------------------------------------------------");
										docs.toArray(function(err, contactos) {
											enviarMensaje(contactos,
												payload.asunto,
												payload.para,
												payload.cc,
												payload.cco,
												payload.exclusivos,
												payload.principioHtml,
												temario.html,
												payload.finHtml,
												payload.adjunto,
												mailFrom, function(err) {
												if (err) {
													console.log(err);
													res.status(503);
													res.end();
												} else {
												    textoADevolver+="<li> Entro </li>"+
												                        "</ol>"+
												                "</div>"+
												            "</html>";
												    console.log("---------------------------------------------------ENTRO 7--------------------------------------------------------");
													temario.enviado = {
														fecha:  new Date(),
														version: payload.version,
														para: payload.para,
														cc: payload.cc,
														cco: payload.cco,
														exclusivos: payload.exclusivos,
														asunto: payload.asunto,
														mensajeHtml: payload.mensajeHtml
													};

													console.log(temario);
													// el temario fue enviado correctamente
													db.collection('orm.temarios').save(temario,{
														safe: true
													}, function (err) {
														if (err) {
															console.log(err);
															res.status(503);
															res.set({"Content-Disposition":"attachment; filename=\"error.txt\""});
															res.send(textoADevolver);
															res.end();
														} else {
														    res.set({"Content-Disposition":"attachment; filename=\"exito.txt\""});
														    res.send(textoADevolver);
															res.json({});
														}
													});
												}
											});
										});
									}
								});
							}
						});
					}
				});
			}
		});
	});
	
	var enviarSoporte = function(asunto, listaPara, listaCC, listaCCO, listaExclusivos, textoHtml, principioHtml, finHtml, adjunto, callback) {
        var Iconv  = require('iconv').Iconv;
        var iconv = new Iconv('UTF-8', 'US-ASCII//TRANSLIT');

		// En el formato 'Diego Pérez <eazel7@gmail.com>,Daniela Costa <dcosta@yahoo.com>
		var para = listaPara;
		var cc = '';
		var cco = '';
		var exclusivos = '';
		
		// ambos son html
		var html = textoHtml;

		var texto = require('html-to-text').fromString(html, {
			wordwrap: 130
		});

		var emailMessage = emails.createMessage(
			"BAGestion - ORM <orm@buenosaires.gob.ar>",
			asunto,
			texto, html, para, cc, cco, adjunto,
		// TODO: CC no implementado
		'');

		emails.sendMail(emailMessage, callback);
	};
	app.post(conf.api.prefix + '/orm/enviar-soporte', function(req, res) {
		var payload = req.body;

		db.getDbInstance(function(err, db) {
			// Ahora db es una instancia de la base de datos, no un módulo
			if (err) {
				console.log(err);
				res.status(503);
				res.end();
			} else {
				db.collection('orm.reuniones.instancias').findOne({
					_id: new mongo.ObjectID(payload.instanciaId)
				}, function(err, instancia) {
					if (err) {
						console.log(err);
						res.status(503);
						res.end();
					} else {
						enviarSoporte(payload.asunto,
							payload.para,
							payload.cc,
							payload.cco,
							payload.exclusivos,
							payload.mensajeHtml,
							payload.principioHtml,
							payload.finHtml,
							"", function(err) {
							if (err) {
								console.log(err);
								res.status(503);
								res.end();
							} else {
                                res.json({});
                            }
                        });
                    }
                });
			}
		});
	});
	
	var enviarCita = function(contactos, asunto, listaPara, listaCC, listaCCO, listaExclusivos, textoHtml, principioHtml, finHtml, adjunto, callback) {
		var contactosPorId = {};
        var Iconv  = require('iconv').Iconv;
        var iconv = new Iconv('UTF-8', 'US-ASCII//TRANSLIT');
        asunto = iconv.convert(asunto);
        
		contactos.forEach(function(c) {
			contactosPorId[c._id.toString()] = c;
		});
		textoADevolver+="<div> Comienzo de funcion enviarCita </div>";
		
		
		var buscarCorreo = function(nombre, contacto) {
            var emails = "";
            console.log("--------------------------------------------------------------------------------- Entro A");
            if(!contacto || !contacto.correos){
                return "";
            }
            else {
                for (var i = 0; i < contacto.correos.length; i++) {
                    var em = contacto.correos[i];
                    var expr = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
                    if (em.nombre == nombre) {
                        if ( !expr.test(em.valor) ) {
                            
                        } else {
                            if (emails === "") {
                                emails = em.valor;
                            } else {
                                emails = emails + ", " + em.valor;
                            }
                        }
                    }
                    if (em.checkedCCO) {
                        if ( !expr.test(em.valor) ) {
                            
                        } else {
                            if (emails === "") {
                                emails = em.valor;
                            } else {
                                emails = emails + ", " + em.valor;
                            }
                        }
                    }
                }
            }
            return emails;
        };
        
        textoADevolver+="<div>";
        textoADevolver+="<ol type='a'>"+
                            "<li> Entro </li>";
        console.log("--------------------------------------------------------------------------------- Entro B");
        
		// En el formato 'Diego Pérez <eazel7@gmail.com>,Daniela Costa <dcosta@yahoo.com>
		var para = '', cc = '', cco = '', exclusivos = '';
		
		listaPara.forEach(function(p) {
			var contacto = contactosPorId[p.contactoId]; //Obtengo el contacto de forma dinamica.

			if (buscarCorreo('Email oficial', contacto)) {
                if (para > '') {
                    para += ',';
                }
                para +=  buscarCorreo('Email oficial', contacto);
            }
		});
		listaCC.forEach(function(p) {
			var contacto = contactosPorId[p.contactoId];

			if (buscarCorreo('Email oficial', contacto)) {
                if (cc > '') {
                    cc += ',';
                }
                cc +=  buscarCorreo('Email oficial', contacto);
            }
		});
		listaCCO.forEach(function(p) {
			var contacto = contactosPorId[p.contactoId];
			
            if (buscarCorreo('Email oficial', contacto)) {
                if (cco > '') {
                    cco += ',';
                }
                cco +=  buscarCorreo('Email oficial', contacto);
            }
		});
		listaExclusivos.forEach(function(p) {
			var contacto = contactosPorId[p.contactoId];

            if (buscarCorreo('Email oficial', contacto)) {
                if (cc > '') {
                    cc += ',';
                }
                cc +=  buscarCorreo('Email oficial', contacto);
            }
		});
        
        textoADevolver+="<li>"+
                            "<ul>"+
                                "<li> Destinatarios </li>"+
                                "<li> Para: "+para+"</li>"+
                                "<li> CC: "+cc+"</li>"+
                                "<li> CCO: "+cco+"</li>"+
                            "</ul>"+
                        "</li>";
        
        textoADevolver+="<li> Termino de armar las listas</li>";
        console.log("--------------------------------------------------------------------------------- Entro C");
		// ambos son html
		var html = textoHtml; 
		
		var texto = require('html-to-text').fromString(html, {
			wordwrap: 130
		});
		
		textoADevolver+="<li> Entro </li>";
        console.log("--------------------------------------------------------------------------------- Entro D");
		var emailMessage = emails.createMessage(
			conf.citas.email.from,
			asunto,
			texto, html, para, cc, cco, adjunto,
		// TODO: CC no implementado
		'');
        textoADevolver+="<li>"+
                            "<ul>"+
                                "<li> From y Asunto</li>"+
                                "<li> From: "+conf.citas.email.from+"</li>"+
                                "<li> Asunto: "+asunto+"</li>"+
                            "</ul>"+
                        "</li>";
        
        textoADevolver+="<li>Termino de armar el Mail (ahora enviara)</li>"+
                    "</ol>"+
                "</div>";
        console.log("--------------------------------------------------------------------------------- Entro E");
		emails.sendMail(emailMessage, callback);
	};
	app.post(conf.api.prefix + '/orm/enviar-cita', function(req, res) {
	    var fs = require('fs');
        
        var payload = req.body;
        textoADevolver+="<h2>Enviar Cita</h2>"+
                        "<h4> Fecha: "+new Date()+"</h4>"+
                        "<h4> Usuario: "+payload.usuario+"</h4>"+
                        "<div>"+
                            "<ol>"+
                                "<li> Comenzo a Verificar </li>";
        console.log("-------------------------------------------------------------------- Entro 1");
		db.getDbInstance(function(err, db) {
			// Ahora db es una instancia de la base de datos, no un módulo
			textoADevolver+="<li> Convirtio modulo db en instancia </li>";
			console.log("-------------------------------------------------------------------- Entro 2");
			if (err) {
				console.log(err);
				res.status(503);
				res.end();
			} else {
			    textoADevolver+="<li> Sin errores para convertir Comenzo a traer los mails </li>";
			    console.log("-------------------------------------------------------------------- Entro 3");
				var queryContactos = {
					_id: {
						$in: []
					}
				};

				payload.para && payload.para.forEach(function(c) {
					queryContactos._id.$in.push(new mongo.ObjectID(c.contactoId));
				});

				payload.cc && payload.cc.forEach(function(c) {
					queryContactos._id.$in.push(new mongo.ObjectID(c.contactoId));
				});

				payload.cco && payload.cco.forEach(function(c) {
					queryContactos._id.$in.push(new mongo.ObjectID(c.contactoId));
				});
                            
				payload.exclusivos && payload.exclusivos.forEach(function(c) {
					queryContactos._id.$in.push(new mongo.ObjectID(c.contactoId));
				});

				db.collection('orm.contactos').find(queryContactos, function(err, docs) {
				    textoADevolver+="<li> Entro A buscar contactos</li>";
				    console.log("-------------------------------------------------------------------- Entro 4");
					if (err) {
						console.log(err);
						res.status(503);
						res.end();
					} else {
					    textoADevolver+="<li> Entro (sin errores)</li>"+
						                        "</ol>"+
					                "</div>";
					    console.log("-------------------------------------------------------------------- Entro 5");
						docs.toArray(function(err, contactos) {
                            console.log("-------------------------------------------------------------------------- Contactos: "+contactos);
							enviarCita(contactos,
								payload.asunto,
								payload.para,
								payload.cc,
								payload.cco,
								payload.exclusivos,
								payload.mensajeHtml,
								payload.principioHtml,
								payload.finHtml,
								payload.adjunto, function(err) {
								if (err) {
									console.log(err);
									res.status(503);
									//res.set({"Content-Disposition":"attachment; filename=\"fallo.txt\""});
                                    fs.readFile('./main/source/modules/orm/log.html', function read(err, data) {
                                        if(err) {
                                            return console.log(err);
                                        }
                                        var texto=data+textoADevolver;
                                        fs.writeFile("./main/source/modules/orm/log.html", texto+"<div style='background-color:red'>FALLO</div></div>", function(err) {
                                            if(err) {
                                                return console.log(err);
                                            }
                                            textoADevolver="<div> ------------------------------------------------------------------------------------";
                                        }); 
                                    });
									
                                    res.end();
								} else {
								    //res.set({"Content-Disposition":"attachment; filename=\"exito.txt\""});
								    fs.readFile('./main/source/modules/orm/log.html', function read(err, data) {
                                        if(err) {
                                            return console.log(err);
                                        }
                                        var texto=data+textoADevolver;
                                        fs.writeFile("./main/source/modules/orm/log.html", texto+"<div style='background-color:green'>EXITO</div></div>", function(err) {
                                            if(err) {
                                                return console.log(err);
                                            }
                                            textoADevolver="<div> ------------------------------------------------------------------------------------";
                                        }); 
                                    });
                                    res.json({});
								}
							});
						});
					}
				});
			}
		});
	});
	
	var enviarMinuta = function(contactos, asunto, listaPara, listaCC, listaCCO, listaExclusivos, textoHtml, principioHtml, finHtml, adjunto, mailFrom, callback) {
		console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
		var contactosPorId = {};
        var Iconv  = require('iconv').Iconv;
        var iconv = new Iconv('UTF-8', 'US-ASCII//TRANSLIT');
        asunto = iconv.convert(asunto);
        
        if (mailFrom ==" ") {
            mailFrom = conf.temarios.email.from;
        }
        
		contactos.forEach(function(c) {
			contactosPorId[c._id.toString()] = c;
		});
		
		var buscarCorreo = function(nombre, contacto) {
		    var emails = "";
            if (!contacto.correos) {
                return "";
            }
            else {
                for (var i = 0; i < contacto.correos.length; i++) {
                    var em = contacto.correos[i];
                    var expr = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
                    if (em.nombre == nombre) {
                        if ( !expr.test(em.valor) ) {
                            
                        } else {
                            if (emails === "") {
                                emails = em.valor;
                            } else {
                                emails = emails + ", " + em.valor;
                            }
                        }
                    }
                    if (em.checkedCCO) {
                        if ( !expr.test(em.valor) ) {
                            
                        } else {
                            if (emails === "") {
                                emails = em.valor;
                            } else {
                                emails = emails + ", " + em.valor;
                            }
                        }
                    }
                }
            }
            return emails;
        };

		// En el formato 'Diego Pérez <eazel7@gmail.com>,Daniela Costa <dcosta@yahoo.com>
		var para = '';
		var cc = '';
		var cco = '';
		var exclusivos = '';
		//Aca le puse que todos los mails los ponga en cco porque no quieren que se vean.

		listaPara.forEach(function(p) {
			var contacto = contactosPorId[p.contactoId];

			if (buscarCorreo('Email oficial', contacto)) {
    			if (para > '') {
    				para += ',';
    			}
    			para +=  buscarCorreo('Email oficial', contacto);
            }
		});

		listaCC.forEach(function(p) {
			var contacto = contactosPorId[p.contactoId];

			if (buscarCorreo('Email oficial', contacto)) {
    			if (cc > '') {
    				cc += ',';
    			}
    			cc +=  buscarCorreo('Email oficial', contacto);
            }
		});

		listaCCO.forEach(function(p) {
			var contacto = contactosPorId[p.contactoId];
			
            if (buscarCorreo('Email oficial', contacto)) {
    			if (cco > '') {
    				cco += ',';
    			}
    			cco +=  buscarCorreo('Email oficial', contacto);
            }
		});

		listaExclusivos.forEach(function(p) {
			var contacto = contactosPorId[p.contactoId];

			if (buscarCorreo('Email oficial', contacto)) {
    			if (cc > '') {
    				cc += ',';
    			}
    			cc +=  buscarCorreo('Email oficial', contacto);
            }
		});

		// ambos son html
		var html = textoHtml; 
		console.log("............................ EL FINHTML ES IGUAL A = "+finHtml);
		/*principioHtml +
			'<hr />' +
			'<br />' + "Hola Hola" +
			finHtml;
		html = '<div style="font-size: 24px; font-family: Arial; line-height: 150%">' + html + '</div>';*/
        console.log("............................ EL HTML ES IGUAL A = "+html);
		var texto = require('html-to-text').fromString(html, {
			wordwrap: 130
		});
		var emailMessage = emails.createMessage(
			mailFrom,
			asunto,
			texto, html, para, cc, cco, adjunto,
		// TODO: CC no implementado
		'');
		emails.sendMail(emailMessage, callback);
	};
	app.post(conf.api.prefix + '/orm/enviar-minuta', function(req, res) {
	    console.log("----------------------------------------------------- Entro 1");
		var payload = req.body;

		db.getDbInstance(function(err, db) {
		    console.log("----------------------------------------------------- Entro 2");
			// Ahora db es una instancia de la base de datos, no un módulo
			if (err) {
				console.log(err);
				res.status(503);
				res.end();
			} else {
			    console.log("----------------------------------------------------- Entro 3");
				var mailFrom = " ";
				
				if (payload.desdeEmail) {
				    console.log("----------------------------------------------------- Entro 4");
				    mailFrom = payload.desdeEmail;
				}
				
				if (err) {
					console.log(err);
					res.status(503);
					res.end();
				} else {
				    console.log("----------------------------------------------------- Entro 5");
					var queryContactos = {
						_id: {
							$in: []
						}
					};

					payload.para && payload.para.forEach(function(c) {
						queryContactos._id.$in.push(new mongo.ObjectID(c.contactoId));
					});

					payload.cc && payload.cc.forEach(function(c) {
						queryContactos._id.$in.push(new mongo.ObjectID(c.contactoId));
					});

					payload.cco && payload.cco.forEach(function(c) {
						queryContactos._id.$in.push(new mongo.ObjectID(c.contactoId));
					});

					payload.exclusivos && payload.exclusivos.forEach(function(c) {
						queryContactos._id.$in.push(new mongo.ObjectID(c.contactoId));
					});
                    console.log("----------------------------------------------------- Entro 6");
					db.collection('orm.contactos').find(queryContactos, function(err, docs) {
						if (err) {
							console.log(err);
							res.status(503);
							res.end();
						} else {
						    console.log("----------------------------------------------------- Entro 7");
							docs.toArray(function(err, contactos) {
								enviarMinuta(contactos,
									payload.asunto,
									payload.para,
									payload.cc,
									payload.cco,
									payload.exclusivos,
									payload.mensajeHtml,
									payload.principioHtml,
									payload.finHtml,
									payload.adjunto,
									mailFrom, function() {
								    console.log("funkoooooo");
								});
							});
						}
					});
				}
				
			}
		});
	});
};
