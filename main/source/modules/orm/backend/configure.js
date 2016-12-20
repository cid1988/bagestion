exports = module.exports = function(app, conf) {
    // configurar la api para enviar mails
    require('./email.js')(app, conf);
    
    // configurar la api para descargar los contactos como vcf
    require('./vcf.js')(app, conf);
    
    // CSV de contactos
    require('express-csv');
    app.get('/api/contactos-csv/download', function(req, res) {
        require('../../../db.js').setConf(conf);
        require('../../../db.js').getDbInstance(function(err, db) {
            if (err) {
                res.status(503);
                console.log(err);
                return res.end();
            }
            
            db.collection('orm.organigrama').find({}).toArray(function(err, nombresJurisdicciones) {

                var jurisdiccionPorId = function(id) {
                    for (var i = 0; i < nombresJurisdicciones.length; i++) {
                        if (nombresJurisdicciones[i]._id == id) {
                            return nombresJurisdicciones[i];
                        }
                    }
                };
                
                var valorCorreo = function(c, tipo) {
                    if (c.correos) {
                        for (var i = 0; i < c.correos.length; i++) {
                            if (c.correos[i].nombre == tipo) {
                                return c.correos[i].valor;
                            }
                        }
                        return '';
                    }
                };
                
                var valorTelefono = function(c, tipo) {
                    if (c.telefonos) {
                        for (var i = 0; i < c.telefonos.length; i++) {
                            if (c.telefonos[i].nombre == tipo) {
                                return c.telefonos[i].valor;
                            }
                        }
                        return '';
                    }
                };
                
                var all = [
                    ["Apellido", "Nombre", "Segundo Nombre", "Dependencia", "Cargo", "Organismo", "Correo Oficial", "Correo Alternativo", "Teléfono Directo", "Teléfono Alternativo", "Conmutador", "Celular Laboral", "Celular Alternativo"]
                ];
                db.collection('orm.contactos').find({}).each(function(err, item) {
                    if (err) {
                        res.status(503);
                        console.log(err);
                        return res.end();
                    }
    
                    if (item) {
                        all.push([item.apellidos, item.nombre, item.segundoNombre, item.organigrama && jurisdiccionPorId(item.organigrama) && jurisdiccionPorId(item.organigrama).nombreCompleto, item.cargo, item.organigrama && jurisdiccionPorId(item.organigrama) && jurisdiccionPorId(item.organigrama).sigla, valorCorreo(item, 'Email oficial'), valorCorreo(item, 'Email alternativo'), valorTelefono(item, 'Telefono directo'), valorTelefono(item, 'Telefono alternativo'), valorTelefono(item, 'Conmutador'), valorTelefono(item, 'Celular laboral'), valorTelefono(item, 'Celular alternativo')]);
                    }
                    else {
                        res.setHeader("Content-Disposition", "attachment; filename=\"contactos.csv\"");
                        res.csv(all);
                    }
                });
            });
        });
    });









    app.get('/api/ormFull', function(req, res) {
        require('../../../db.js').setConf(conf);
        require('../../../db.js').getDbInstance(function(err, db) {
            if (err) {
                res.status(503);
                console.log(err);
                return res.end();
            }
            
            db.collection('orm.contactos').find({}).toArray(function(err, ormContactos) {
                
                var contactoPorId = function(contacto){
                    if(contacto.length){
                        for(var c=0;c<ormContactos.length;c++){
                            if(ormContactos[c]._id == contacto){
                                return ormContactos[c].nombre + ", " + ormContactos[c].apellidos;
                            }
                        }
                    }else{
                        return "";
                    }
                    
                };

                var contactosPorId = function(arrayContactos){
                    var bolsa = "";
                    for(var p=0;p<arrayContactos.length;p++){
                        for(var c=0;c<ormContactos.length;c++){
                            if(arrayContactos[p].contactoId == ormContactos[c]._id){
                                bolsa = bolsa + (ormContactos[c].nombre + ", " + ormContactos[c].apellidos) + ", ";
                            }
                        }
                    };
                    return bolsa;
                };
                
                /*var all = [
                    ["nombre","tipo","Frecuencia","Participantes","Asistente Tablero","Asistente Minuta","Toma Compromisos","Valida Temario"]
                ];

                db.collection('orm.reuniones').find({}).each(function(err, item) {
                    if (err) {
                        res.status(503);
                        console.log(err);
                        return res.end();
                    }

                    if (item) {
                        all.push([
                            item.nombre,
                            item.tipo,
                            item.frecuencia,
                            item.participantes && contactosPorId(item.participantes),
                            //item.cita,
                            //item.temario,
                            //item.minuta,
                            //item.propuestaTemario,
                            //item.llamados,
                            item.asistenteTablero && contactoPorId(item.asistenteTablero),
                            item.asistenteMinuta && contactoPorId(item.asistenteMinuta),
                            item.tomaCompromisos && contactoPorId(item.tomaCompromisos),
                            item.validaTemario && contactoPorId(item.validaTemario)
                        ]);
                    }
                    else {
                        res.setHeader("Content-Disposition", "attachment; filename=\"ormFull.csv\"");
                        res.csv(all);
                    }
                });*/

                var all2 = [
                    ["Reunion","Fecha","Ubicacion","Subtitulo"]
                ];

                //REUNIONES////////////////////////////////////////////////////////////////////
                db.collection('orm.reuniones.instancias').find({}).each(function(err, item) {
                    if (err) {
                        res.status(503);
                        console.log(err);
                        return res.end();
                    }

                    if (item) {
                        all2.push([
                            item.reunion,
                            item.fecha,
                            item.ubicacion && item.ubicacion.nombre,
                            item.subtitulo
                        ]);
                    }
                    else {
                        res.setHeader("Content-Disposition", "attachment; filename=\"instanciasFull.csv\"");
                        res.csv(all2);
                    }
                });

            });
        });
    });




};
