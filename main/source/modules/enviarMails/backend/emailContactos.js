// API para traer Contactos
exports = module.exports = function(app, conf) {
    'use strict';
    var mongo = require('mongodb'), db = require('../../../db'), fechaActual = new Date();
    db.setConf(conf);

    var usuarioQueEnvia = "";

    /* Traigo los contactos filtrados */
    app.post('/api/enviarMail/traerContactos', function(req, res) {
        console.log("\n\n\tIngresando a Traer Contactos\n\n");

        db.getDbInstance(function(err, db) {
            if(err){
                res.json({
                    error: true,
                    tipo: err,
                    explicacion: "Error al conectar con la BD"
                });
            }
            db.collection('orm.contactos').find({'correos.0': { $exists: true }, $or: [ { eliminado: { $exists: false } }, { eliminado: false }] }, { nombre: 1, apellidos: 1, correos: 1}).sort({apellidos:1}).toArray(function(err, contactos){

                if(err){
                    res.json({
                        error: true,
                        tipo: err,
                        explicacion: "Error al buscar en la BD los contactos"
                    });
                }

                res.json({
                    error: false,
                    contactos: contactos
                });
            });
        });
    });

    /* Creo un nuevo contacto en orm.contactos */
    app.post('/api/enviarMail/crearContacto', function(req, res){
        console.log("\n\n\tINGRESO CREAR CONTACOS\n\n");

        db.getDbInstance(function(err, db){
            console.log("\n\n\tConecto a la BD\n\n");
            if(err){
                res.json({
                    error: true,
                    tipo: err,
                    explicacion: "Error al conectar con la BD"
                });
            }

            var nombre = req.body.nombre, apellidos = req.body.apellidos.toUpperCase(), correo = req.body.correo;
            nombre = nombre.charAt(0).toUpperCase() + nombre.slice(1);
            // Primero lo busco, si no existe lo creo.
            db.collection('orm.contactos').findOne({ $and: [ { nombre: nombre }, { apellidos: apellidos } ] }, function(err, contacto){
                if(err){
                    res.json({
                        error: true,
                        tipo: err,
                        explicacion: "Error al buscar la existencia de contactos repetidos"
                    });
                }

                if(contacto){
                    res.json({
                        error: false,
                        yaExiste: true,
                        idContacto: contacto._id
                    });
                } else {
                    var contactoNuevo = {
                        nombre: nombre,
                        apellidos: apellidos,
                        correos: [{
                            nombre: "Email oficial",
                            valor: correo
                        }]
                    };
                    db.collection('orm.contactos').insert(contactoNuevo, { w: 1 }, function(err, contactoCreado){
                        console.log("Entro entro");
                        if(err){
                            res.json({
                                error: true,
                                tipo: err,
                                explicacion: "Error al crear el contacto"
                            });
                        }

                        res.json({
                            error: false,
                            yaExiste: false,
                            _id: contactoCreado[0]._id,
                            nombre: contactoCreado[0].nombre,
                            apellidos: contactoCreado[0].apellidos,
                            correos: contactoCreado[0].correos
                        });
                    });
                }
            });
        });
    });

    /* Traigo los usuarios del BAGestion */
    app.post('/api/enviarMail/traerUsers', function(req, res){
        console.log("\n\n\tINGRESO TRAER USERS\n\n");

        db.getDbInstance(function(err, db){
            console.log("\n\n\tConecto a la BD\n\n");
            if(err){
                res.json({
                    error: true,
                    tipo: err,
                    explicacion: "Error al conectar con la BD"
                });
            }

            // Busco todos los usuarios
             db.collection('users').find({}, { nombre: 1, apellido: 1, username: 1}).sort({username:1}).toArray(function(err, usuarios){
                if(err){
                    res.json({
                        error: true,
                        tipo: err,
                        explicacion: "Error al traer los usuarios"
                    });
                }
                console.log("\n\n\t Existen " + usuarios.length + " usuarios.\n\n");
                res.json({
                    error: false,
                    usuarios: usuarios
                });
            });
        });
    });

    /* Guardo las listas de contactos */
    app.post('/api/enviarMail/guardarLista', function(req, res){
        console.log("\n\n\t Entro a Guardar lista\n\n");
        var listaNueva = req.body;

        listaNueva.fechaUltimaModificacion = fechaActual;

        // Trae el controlador de db.js
        db.getDbInstance(function(err, db){
            // Si hay error termina todo
            if(err){
                res.json({
                    error: true,
                    explicacion: "Error al intentar conectarse con el controlador de la bd",
                    tipo: err
                });
            }
            // A la coleccion de listasCredas le inserta un objeto nuevo
            db.collection('envioMails.listasCreadas').save( listaNueva, { w: 1 }, function(err, listaCreada){
                // Si hay error termina todo
                if(err){
                    res.json({
                        error: true,
                        explicacion: "Error al crear la lista en envioMails.listasCreadas",
                        tipo: err
                    });
                }

                console.log("\n\n LISTA CREADA: " + JSON.stringify(listaCreada, null, 4) + "\n\n");

                // Declaro variables que utilizare para hacer mas corto la consulta y que no ocupen muchos caracteres
                var lengthUsuarios = listaCreada.usuariosPermitidos.length;
                var listaUsuarios = listaCreada.usuariosPermitidos;
                var nuevoArray = [];

                // A todos los usuarios que esten en usuariosPermitidos, los pongo en un array vacio
                for( var i = 0; i < lengthUsuarios; i++ ){
                    nuevoArray.push(listaUsuarios[i].username);
                }
                // A todos los usuarios que tengan su username dentro del array, les pusheo en un array la lista que se creo, ( si no existe la creo), de forma multiple para editar todos
                db.collection('users').update(
                    { username: { $in: nuevoArray } }, { $push: { listasCompartidas: { idLista: listaCreada._id, duenno: listaCreada.duenno } }  }, { multi: true }, function(err, usuarios){
                        // Si hay error cierro todo

                        if(err){
                            res.json({
                                error: true,
                                explicacion: "Error al traer los usuarios: " + nuevoArray + " de la collection users",
                                tipo: err
                            });
                        }
                    });
                // Al usuario que duenno, le pusheo el id de la lista, (si no existe la creo el campo)
                db.collection('users').update(
                        { username: listaCreada.duenno },
                        {
                            $push: { listasCreadas: { idLista: listaCreada._id } }
                        }, function( err, usuario ){
                            // Si hay error cierro todo
                            if(err){
                                res.json({
                                    error: true,
                                    explicacion: "Error al actualizar el duenno " + listaCreada[0].duenno,
                                    tipo: err
                                });
                            }
                            // Le aviso al cliente que no hubo ningun error y que se creo todo perfectamente.
                            res.json({
                                error: false
                            });
                        });
            });
        });
    });

    /* Traigo las listas creadas por mi */
    app.post('/api/enviarMail/traerListas', function(req, res){
        console.log("\n\n\tEntro a traer listas \n\n");
        var usuario = req.body.username;

        db.getDbInstance(function(err, db){
            var ObjectID = mongo.ObjectID;
            // Si hay error termina todo
            if(err){
                res.json({
                    error: true,
                    explicacion: "Error al intentar conectarse con el controlador de la bd",
                    tipo: err
                });
            }
            console.log("\n\n\tNombre usuario: " + usuario + "\n\n");
            db.collection('users').findOne({ username: usuario }, { listasCreadas: 1, listasCompartidas: 1 }, function(err, usuarioActual){
                console.log("\n\nDatos de usuario: " + JSON.stringify(usuarioActual, null, 4) + "\n\n");
                if(err){
                    res.json({
                        error: true,
                        explicacion: "Error al traerse los datos del usuario",
                        tipo: err
                    });
                }
                // Creo un array de _id para traer todas las listas
                var listasPorId = [];
                if(usuarioActual.hasOwnProperty("listasCreadas")){
                    for( var i = 0; i < usuarioActual.listasCreadas.length; i++ ){
                        listasPorId.push( usuarioActual.listasCreadas[i].idLista );
                    }
                }
                if(usuarioActual.hasOwnProperty("listasCompartidas")){
                    for( var x = 0; x < usuarioActual.listasCompartidas.length; x++ ){
                        listasPorId.push( usuarioActual.listasCompartidas[x].idLista );
                    }
                }


                db.collection('envioMails.listasCreadas').find(  { $and: [{ _id: { $in: listasPorId } }, { eliminada: false }] },
                { usuariosPermitidos: 0, vecesUsada: 0, listaDeUsos: 0, fechaUltimaModificacion: 0 }).sort({ nombreLista: 1 }).toArray(function(err, listas){
                    if(err){
                        res.json({
                            error: true,
                            explicacion: "Error al intentar traer todas las listas",
                            tipo: err
                        });
                    }
                    // Recorro la lista y la separo en dos partes (Listas que me compartieron y Listas Creadas por mi)

                    var listasPropias = [], listasCompartidas = [];

                    for( var i = 0; i < listas.length; i++ ){
                        if( listas[i].duenno == usuario ){
                            listasPropias.push( listas[i] );
                        } else {
                            listasCompartidas.push( listas[i] );
                        }
                    }

                    res.json({
                        error: false,
                        listasPropias: listasPropias,
                        listasCompartidas: listasCompartidas
                    });
                });
            });
        });
    });

    /* Apagar las listas */
    app.post('/api/enviarMail/apagarLista', function(req, res){
        console.log("\n\n\t  Entro a traer listas \n\n");
        var idLista = req.body._id;

        db.getDbInstance(function(err, db){
            var ObjectID = mongo.ObjectID;
            // Si hay error termina todo
            if(err){
                res.json({
                    error: true,
                    explicacion: "Error al intentar conectarse con el controlador de la bd",
                    tipo: err
                });
            }
            db.collection('envioMails.listasCreadas').update({ _id: new ObjectID(idLista) }, { $set: {eliminada: true, fechaUltimaModificacion: fechaActual}}, function(err, listaActualizada){
                if(err){
                    res.json({
                        error: true,
                        explicacion: "Error al intentar apagar el registro",
                        tipo: err
                    });
                }

                res.json({
                    error: false
                });
            });
        });
    });

    /* Traigo las listas creadas por mi */
    app.post('/api/enviarMail/traerUsersPermitidos', function(req, res){
        console.log("\n\n\t  Entro a traer usuarios Permitidos \n\n");
        var usuario = req.body.username;

        db.getDbInstance(function(err, db){
            var ObjectID = mongo.ObjectID;
            // Si hay error termina todo
            if(err){
                res.json({
                    error: true,
                    explicacion: "Error al intentar conectarse con el controlador de la bd",
                    tipo: err
                });
            }
            db.collection('users').findOne({ username: usuario }, { username: 1, usuariosPermitidos: 1 }, function(err, usuarioActual){
                if(err){
                    res.json({
                        error: true,
                        explicacion: "Error al traerse los datos del usuario",
                        tipo: err
                    });
                }

                res.json({
                    error: false,
                    username: usuarioActual.username,
                    _id: usuarioActual._id,
                    usuariosPermitidos: usuarioActual.usuariosPermitidos || []
                });
            });
        });
    });

    /* Guardo las lista de usuarios permitidos */
    app.post('/api/enviarMail/guardarUsersPermitidos', function(req, res){
        console.log("\n\n\t  Entro a traer usuarios Permitidos \n\n");
        var usuario = req.body.username, usuariosPermitidos = req.body.usuariosPermitidos, passwordMail = req.body.passwordMail;

        db.getDbInstance(function(err, db){
            var ObjectID = mongo.ObjectID;
            // Si hay error termina todo
            if(err){
                res.json({
                    error: true,
                    explicacion: "Error al intentar conectarse con el controlador de la bd",
                    tipo: err
                });
            }
            db.collection('users').update({ username: usuario }, { $set: { usuariosPermitidos: usuariosPermitidos, passwordMail: passwordMail } }, function(err, usuariosActualizados){
                if(err){
                    res.json({
                        error: true,
                        explicacion: "Error al traerse los datos del usuario",
                        tipo: err
                    });
                }

                res.json({
                    error: false,
                    usuarioActualizado: usuariosActualizados
                });
            });
        });
    });

    // Busca en un array en campo el dato
    var existeDato = function(array1,campo,dato){
        var lengthArray = array1.length;
        for( var i = 0; i < lengthArray; i++ ){
            if( array1[i][campo] == dato ){
                return true;
            }
        }
        return false;
    };

    var enviarMail = function(correo, callback){
        // Para enviar el mail
        var emails = require('../../emails/backend/locals');
        var texto = "";

        if( correo.tipoDeMensaje == "Texto" ){
            texto = correo.mensaje;
        } else {
            texto = require('html-to-text').fromString(correo.mensaje, { wordwrap: 130 });
        }

        correo.emisor = correo.emisor.replace("@buenosaires.gob.ar","");

        var emailMessage2 = emails.createMessage2( correo.emisor+"@buenosaires.gob.ar", correo.asunto, texto, correo.mensaje, correo.destinatarios.para, correo.destinatarios.cc, correo.destinatarios.cco, correo.adjuntos);

        emails.enviarMail2( correo.emisor+"@buenosaires.gob.ar", correo.pasword, emailMessage2, usuarioQueEnvia, callback);
    };

    var desencriptarContrasenna = function(passEncriptada){
        var CryptoJS = require("crypto-js"), passDesencriptada;
        passDesencriptada = CryptoJS.AES.decrypt(passEncriptada, "BAGestion%1234");
        passDesencriptada = passDesencriptada.toString(CryptoJS.enc.Utf8);
        return passDesencriptada;
    };
    /* Intento enviar el mail */
    app.post('/api/enviarMail/enviarMail', function(req, res){
        console.log("\n\n\tEntro a enviar mail\n\n");
        var correo = req.body;
        usuarioQueEnvia = correo.usuarioEnvio;
        // Busco si tiene los permisos para enviar el mail
        db.getDbInstance(function(err, db){
            var ObjectID = mongo.ObjectID;
            // Si hay error termina todo
            if(err){
                res.json({
                    error: true,
                    explicacion: "Error al intentar conectarse con el controlador de la bd",
                    tipo: err
                });
            }
            // Si el mail de salida es igual al usuario significa que esta enviado mails a su nombre entonces sale sin comprobar
            if( correo.usuarioEnvio == correo.emisor ){
                // Si nos esta pasando el password
                if( correo.hasOwnProperty("pasword") ){
                    // Desencripto la contrasenna
                    correo.pasword = desencriptarContrasenna(correo.pasword);
                    // Enviamos mail
                    enviarMail(correo, function(err, respuesta){
                        // Si hay error
                        if(err){
                            // Si la autentificacion fallo
                            if( err.code == 3 ){
                                return res.json({
                                    error: false,
                                    pudoEnviar: false,
                                    pedirPasword: true,
                                    errorPasword: true
                                });
                            } else {
                                // Fallo por algo desconocido
                                return res.json({
                                    error: true,
                                    explicacion: "Ocurrio un error al enviar al servidor",
                                    tipo: err
                                });
                            }
                        } else {
                            // Funciono
                            return res.json({
                                error: false,
                                pudoEnviar: true,
                                pedirPasword: false
                            });
                        }
                    });
                } else {
                    // Pedimos el password
                    return res.json({
                        error: false,
                        pudoEnviar: false,
                        pedirPasword: true
                    });
                }
            } else {
                if( correo.pasword ){

                    correo.pasword = desencriptarContrasenna(correo.pasword);
                    enviarMail(correo, function(err, respuesta){
                        // Si hay error
                        if(err){
                            // Si la autentificacion fallo
                            if( err.code == 3 ){
                                return res.json({
                                    error: false,
                                    pudoEnviar: false,
                                    pedirPasword: false,
                                    malPassword: true,
                                    mensaje: "Ingreso mal la contraseña"
                                });
                            } else {
                                // Fallo por algo desconocido
                                return res.json({
                                    error: true,
                                    explicacion: "Ocurrio un error al enviar al servidor",
                                    tipo: err
                                });
                            }
                        } else {
                            // Funciono
                            return res.json({
                                error: false,
                                pudoEnviar: true,
                                pedirPasword: false
                            });
                        }
                    });

                } else {
                    // Busco si tiene permisos para utilizar el mail de otro usuario
                    db.collection('users').findOne({ username: correo.emisor }, { username: 1, usuariosPermitidos: 1, passwordMail: 1}, function(err, usuarioEmisor){
                        // Si hay error termina todo
                        if(err){
                            return res.json({
                                error: true,
                                explicacion: "Error al buscar el usuario",
                                tipo: err
                            });
                        }
                        // Me aseguro de que encuentre al usuario
                        if( usuarioEmisor ){
                            // Si el usuario tiene una lista de usuarios a los que le permite acceso. Si existe, pregunto si el usuario que envia, esta en dicha lista
                            if( usuarioEmisor.hasOwnProperty("usuariosPermitidos") && existeDato( usuarioEmisor.usuariosPermitidos, "username", correo.usuarioEnvio ) ){
                                console.log("\tPUEDE ENVIAR EL CORREO\n\n");

                                if( usuarioEmisor.hasOwnProperty("passwordMail") ){
                                    // Desencripto la contrasenna
                                    correo.pasword = desencriptarContrasenna(usuarioEmisor.passwordMail);
                                    enviarMail(correo, function(err, respuesta){
                                        // Si hay error
                                        if(err){
                                            // Si la autentificacion fallo
                                            if( err.code == 3 ){
                                                return res.json({
                                                    error: false,
                                                    pudoEnviar: false,
                                                    pedirPasword: false,
                                                    malPassword: true,
                                                    mensaje: "El usuario " + usuarioEmisor.usuarioEnvio + " ingreso mal su contraseña"
                                                });
                                            } else {
                                                // Fallo por algo desconocido
                                                return res.json({
                                                    error: true,
                                                    explicacion: "Ocurrio un error al enviar al servidor",
                                                    tipo: err
                                                });
                                            }
                                        } else {
                                            // Funciono
                                            return res.json({
                                                error: false,
                                                pudoEnviar: true,
                                                pedirPasword: false
                                            });
                                        }
                                    });
                                } else {
                                    return res.json({
                                        error: false,
                                        pudoEnviar: false,
                                        pedirPasword: false,
                                        malPassword: true
                                    });
                                }
                            } else {
                                // Si la lista no existe, o no se encuentra. Solicita la contraseña para enviar
                                console.log("\tNO PUEDE ENVIAR EL CORREO SOLICITAR CONTRASEÑA\n\n");
                                return res.json({
                                    error: false,
                                    pudoEnviar: false,
                                    pedirPasword: true
                                });
                            }
                        } else {
                            // Si el usuario para usar como mail de salida no existe se cancela todo
                            console.log("\tNO EXISTE EL USUARIO\n\n");
                            return res.json({
                                error: false,
                                pudoEnviar: false,
                                pedirPasword: false,
                                noExisteUsuario: true
                            });
                        }
                    });
                }
            }
        });
    });
};
