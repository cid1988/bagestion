var async = require('async'), mongo = require('mongodb'), moment = require('moment');

function buscarProyectoPorId(db, idProyecto) {
  return db
          .collection('poa.proyectos')
          .findOne({
            _id: new mongo.ObjectID(idProyecto)
          });
}

function buscarActividadPorId(db, idActividad) {
  return db
          .collection('poa.actividades')
          .findOne({
            _id: new mongo.ObjectID(idActividad)
          });
}

function buscarObjImpactoPorId(db, idObjImpacto) {
  return db
          .collection('poa.objsImpacto')
          .findOne({
            _id: new mongo.ObjectID(idObjImpacto)
          });
}

function buscarObjMinisterialPorId(db, idObjMinisterial) {
  return db
          .collection('poa.objsMinisteriales')
          .findOne({
            _id: new mongo.ObjectID(idObjMinisterial)
          });
}

function buscarObjOperativoPorId(db, idObjOperativo) {
  return db
          .collection('poa.objsOperativos')
          .findOne({
            _id: new mongo.ObjectID(idObjOperativo)
          });
}

function buscarJurisdiccionPorId(db, idJurisdiccion) {
  return db
          .collection('poa.jurisdicciones')
          .findOne({
            _id: new mongo.ObjectID(idJurisdiccion)
          });
}

function buscarPlanPorId(db, idPlan) {
  return db
          .collection('poa.planes')
          .findOne({
            _id: new mongo.ObjectID(idPlan)
          });
}

module.exports = {
  poa: {
    listarPlanes: function() {
      this
      .db
      .collection('poa.planes')
      .find({})
      .then(this.resolve, this.reject);
    },
    listarProyectos: function(idPlan) {
      this
      .db
      .collection('poa.proyectos')
      .find({
        $and:[{eliminado: {$exists:false}},
        {idPlan: new mongo.ObjectID(idPlan)}]
      })
      .then(this.resolve, this.reject);
    },
    listarProyectosPorObOperativo: function(idObOp) {
      this
      .db
      .collection('poa.proyectos')
      .find({
        $and:[{eliminado: {$exists:false}},
        {idObjOperativo: new mongo.ObjectID(idObOp)}]
      })
      .then(this.resolve, this.reject);
    },
    listarObjsMinisteriales: function (idPlan) {
      this
      .db
      .collection('poa.objsMinisteriales')
      .find({
        $and:[{eliminado: {$exists:false}},
        {idPlan: new mongo.ObjectID(idPlan)}]
      })
      .then(this.resolve, this.reject);
    },
    listarObjsMinisterialesPorObImpacto: function (idObImpacto) {
      this
      .db
      .collection('poa.objsMinisteriales')
      .find({
        $and:[{eliminado: {$exists:false}},
        {idObjImpacto: new mongo.ObjectID(idObImpacto)}]
      })
      .then(this.resolve, this.reject);
    },
    listarObjsOperativos: function (idPlan) {
      this
      .db
      .collection('poa.objsOperativos')
      .find({
        $and:[{eliminado: {$exists:false}},
        {idPlan: new mongo.ObjectID(idPlan)}]
      })
      .then(this.resolve, this.reject);
    },
    listarObjsOperativosPorObMinisterial: function (idObMinisterial) {
      this
      .db
      .collection('poa.objsOperativos')
      .find({
        $and:[{eliminado: {$exists:false}},
        {idObjMinisterial: new mongo.ObjectID(idObMinisterial)}]
      })
      .then(this.resolve, this.reject);
    },
    crearObjMinisterial: function (idObjImpacto, nombre) {
      if (!idObjImpacto) return this.reject(new Error('Falta el objetivo de impacto'));
      
      if (!nombre) return this.reject(new Error('Falta el nombre'));
      
      var usuario = this.usuario, db = this.db, reject = this.reject, resolve = this.resolve;
      
      db
      .collection('poa.objsImpacto')
      .findOne({
        _id: new mongo.ObjectID(idObjImpacto) // puede no ser un ObjectID, si ya es no pasa nada
      })
      .then(function (objImpacto) {
        if (!objImpacto) {
          return reject(new Error('Objetivo de impacto erróneo'));
        }
        
        db
        .collection('poa.objsMinisteriales')
        .insert({
          idPlan: objImpacto.idPlan,
          idJurisdiccion: objImpacto.idJurisdiccion,
          idObjImpacto: objImpacto._id,
          anio: objImpacto.anio,
          nombre: nombre,
          responsableDeCarga: usuario
        })
        .then(resolve, reject);
      }, reject);
    },
    crearProyecto: function (idObjOperativo, nombre) {
      if (!idObjOperativo) return this.reject(new Error('Falta el objetivo operativo'));
      
      if (!nombre) return this.reject(new Error('Falta el nombre'));
      
      var usuario = this.usuario, db = this.db, reject = this.reject, resolve = this.resolve;
      
      db
      .collection('poa.objsOperativos')
      .findOne({
        _id: new mongo.ObjectID(idObjOperativo) // puede no ser un ObjectID, si ya es no pasa nada
      })
      .then(function (objOperativo) {
        if (!objOperativo) {
          return reject(new Error('Objetivo operativo erróneo'));
        }
        
        db
        .collection('poa.proyectos')
        .insert({
          idPlan: objOperativo.idPlan,
          idJurisdiccion: objOperativo.idJurisdiccion,
          idObjImpacto: objOperativo.idObjImpacto,
          idObjMinisterial: objOperativo.idObjMinisterial,
          idObjOperativo: objOperativo._id,
          anio: objOperativo.anio,
          nombre: nombre,
          responsableDeCarga: usuario,
          jurisdiccionesParticipantes: [],
          prioridadJefatura: 'No prioritario'
        })
        .then(resolve, reject);
      }, reject);
    },
    crearObjOperativo: function (idObjMinisterial, nombre) {
      if (!idObjMinisterial) return this.reject(new Error('Falta el objetivo de ministerial'));
      
      if (!nombre) return this.reject(new Error('Falta el nombre'));
      
      var usuario = this.usuario, db = this.db, reject = this.reject, resolve = this.resolve;
      
      db
      .collection('poa.objsMinisteriales')
      .findOne({
        _id: new mongo.ObjectID(idObjMinisterial) // puede no ser un ObjectID, si ya es no pasa nada
      })
      .then(function (objMinisterial) {
        if (!objMinisterial) {
          return reject(new Error('Objetivo de ministerial erróneo'));
        }
        
        db
        .collection('poa.objsOperativos')
        .insert({
          idPlan: objMinisterial.idPlan,
          idJurisdiccion: objMinisterial.idJurisdiccion,
          idObjImpacto: objMinisterial.idObjImpacto,
          idObjMinisterial: objMinisterial._id,
          anio: objMinisterial.anio,
          nombre: nombre,
          responsableDeCarga: usuario
        })
        .then(resolve, reject);
      }, reject);
    },
    listarObjsImpacto: function (idPlan) {
      this
      .db
      .collection('poa.objsImpacto')
      .find({
        $and:[{eliminado: {$exists:false}},
        {idPlan: new mongo.ObjectID(idPlan)}]
      })
      .then(this.resolve, this.reject);
    },
    listarObjsImpactoPorJurisdiccion: function (idJurisdiccion) {
      this
      .db
      .collection('poa.objsImpacto')
      .find({
        $and:[{eliminado: {$exists:false}},
        {idJurisdiccion: new mongo.ObjectID(idJurisdiccion)}]
      })
      .then(this.resolve, this.reject);
    },
    crearObjImpacto: function (idJurisdiccion, nombre) {
      if (!idJurisdiccion) return this.reject(new Error('Falta la jurisdicción'));
      
      if (!nombre) return this.reject(new Error('Falta el nombre'));
      
      var usuario = this.usuario, db = this.db, reject = this.reject, resolve = this.resolve;
      
      db
      .collection('poa.jurisdicciones')
      .findOne({
        _id: new mongo.ObjectID(idJurisdiccion) // puede no ser un ObjectID, si ya es no pasa nada
      })
      .then(function (jur) {
        if (!jur) {
          return reject(new Error('Jurisdicción errónea'));
        }
        
        db
        .collection('poa.objsImpacto')
        .insert({
          idPlan: jur.idPlan,
          idJurisdiccion: jur._id,
          anio: jur.anio,
          nombre: nombre,
          responsableDeCarga: usuario
        })
        .then(resolve, reject);
      }, reject);
    },
    listarJurisdicciones: function (idPlan) {
      this
      .db
      .collection('poa.jurisdicciones')
      .find({
        $and:[{eliminado: {$exists:false}},
        {idPlan: new mongo.ObjectID(idPlan)}]
      })
      .then(this.resolve, this.reject);
    },
    listarActividades: function (idPlan) {
      this
      .db
      .collection('poa.actividades')
      .find({
        $and:[{eliminado: {$exists:false}},
        {idPlan: new mongo.ObjectID(idPlan)}]
      })
      .then(this.resolve, this.reject);
    },
    listarActividadesPorProyecto: function (idProyecto) {
      this
      .db
      .collection('poa.actividades')
      .find({
        $and:[{eliminado: {$exists:false}},
        {idProyecto: new mongo.ObjectID(idProyecto)}]
      })
      .then(this.resolve, this.reject);
    },
    traerPlan: function (anio, etapa) {
      this
      .db
      .collection('poa.planes')
      .findOne({
        anio: Number(anio),
        etapa: etapa
      })
      .then(this.resolve, this.reject);
    },
    listarContactosORM: function () {
      this
      .db
      .collection('orm.contactos')
      .find({}, {}, {apellidos: 1, nombre: 1})
      .then(this.resolve, this.reject);
    },
    listarJurisdiccionesORM: function () {
      this
      .db
      .collection('orm.organigrama')
      .find({}, {}, {nombreCompleto: 1})
      .then(this.resolve, this.reject);
    },
    crearPlan: function (anio, etapa, jurisdicciones, responsables) {
      if (!anio) return this.reject(new Error('Falta el año'));
      
      if (!parseInt(anio) === anio) {
       return this.reject(new Error('El año no es un número válido'));
      }
      
      if (!etapa) return this.reject(new Error('Falta la etapa'));
      
      if (['planificacion','seguimiento'].indexOf(etapa) === -1) return this.reject(new Error('La etapa del plan indicada no es válida'));
      
      if (!jurisdicciones || !jurisdicciones.length) return this.reject(new Error('Faltan las jurisdicciones'));
      
      var usuario = this.usuario, db = this.db, reject = this.reject, resolve = this.resolve;
      
      db
      .collection('poa.planes')
      .findOne({ anio: anio, etapa: etapa })
      .then(function (plan) {
        if (plan) return reject(new Error('El plan para ese año y etapa ya existe'));
        
        db
        .collection('poa.planes')
        .insert({
          anio: Number(anio),
          etapa: etapa,
          creadoPor: usuario,
          responsables: responsables
        })
        .then(function (plan) {
          async
          .eachSeries(jurisdicciones, function (jur, callback) {
            db
            .collection('poa.jurisdicciones')
            .insert({
              idPlan: plan._id,
              nombre: jur.nombre,
              idOrmOrganigrama: jur.idOrmOrganigrama,
              idsOrmOrganigrama: jur.idsOrmOrganigrama,
              anio: plan.anio,
              responsableDeCarga: usuario
            })
            .then(function (jur) {
              callback();
            }, callback);
          }, function (err) {
            if (err) return reject(err);
            
            resolve(plan);
          });
        }, reject);
      }, reject);
    },
    actualizarPlan: function (idPlan, etapaNueva, responsablesNuevo, jurisdiccionesNuevas) {
      if (!idPlan) this.reject(new Error('No hay id de jurisdiccion'));
      
      var db = this.db, reject = this.reject, resolve = this.resolve, usuario = this.usuario;
      
      buscarPlanPorId(db, idPlan)
      .then(function (anterior) {
        if (!anterior) {
          return reject('Id de plan erróneo');
        }
        
      var replacement = {}
      
      async.series([
        function (callback) {
          if (etapaNueva) replacement.etapa = etapaNueva;
          if (responsablesNuevo) replacement.responsables = responsablesNuevo;
          replacement.modificadoPor = usuario;
          
          callback();
        }],
        function (err) {
          if (err) return reject(err);
          
          db
          .collection('poa.planes-log')
          .insert({
            fecha: new Date().valueOf(),
            usuario: usuario,
            idPlan: new mongo.ObjectID(idPlan),
            cambios: {"etapa" : etapaNueva, "responsables" : responsablesNuevo},
            anterior: anterior
          })
          .then(function () {
            db
            .collection('poa.planes')
            .update({
              _id: new mongo.ObjectID(idPlan)
            }, {
              $set: replacement
            })
            .then(function (plan) {
              async
              .eachSeries(jurisdiccionesNuevas, function (jur, callback) {
                db
                .collection('poa.jurisdicciones')
                .insert({
                  idPlan: new mongo.ObjectID(idPlan),
                  nombre: jur.nombre,
                  idOrmOrganigrama: jur.idOrmOrganigrama,
                  idsOrmOrganigrama: jur.idsOrmOrganigrama,
                  anio: anterior.anio,
                  responsableDeCarga: usuario
                })
                .then(function (jur) {
                  callback();
                }, callback);
              }, function (err) {
                if (err) return reject(err);
                resolve(plan);
              })
              .then(resolve, reject);
            }, reject);
          }, reject);
        });
      }, reject);
    },
    actualizarProyecto: function (idProyecto, cambios) {
      if (!idProyecto) this.reject(new Error('No hay id de proyecto'));
      if (!cambios) this.reject(new Error('No hay cambios'));
      
      var reject = this.reject, resolve = this.resolve, db = this.db, usuario = this.usuario;
      var replacement = {};
      
      async.series([
        function (callback) {
          if (cambios.nombre) replacement.nombre = cambios.nombre;
          if (cambios.validado === true) replacement.validado = cambios.validado;
          if (cambios.validado === false) replacement.validado = cambios.validado;
          if (cambios.aprobado === true) replacement.aprobado = cambios.aprobado;
          if (cambios.aprobado === false) replacement.aprobado = cambios.aprobado;
          if (cambios.descripcion) replacement.descripcion = cambios.descripcion;
          if (cambios.codIdentificacion) replacement.codIdentificacion = cambios.codIdentificacion;
          if (cambios.responsable) replacement.responsable = cambios.responsable;
          if (cambios.fechaInicio) replacement.fechaInicio = cambios.fechaInicio;
          if (cambios.fechaFin) replacement.fechaFin = cambios.fechaFin;
          if (cambios.proyectoInversion === true) replacement.proyectoInversion = cambios.proyectoInversion;
          if (cambios.proyectoInversion === false) replacement.proyectoInversion = cambios.proyectoInversion;
          if (cambios.proyectoPreexistente === true) replacement.proyectoPreexistente = cambios.proyectoPreexistente;
          if (cambios.proyectoPreexistente === false) replacement.proyectoPreexistente = cambios.proyectoPreexistente;
          if (cambios.codPreexistente) replacement.codPreexistente = cambios.codPreexistente;
          if (cambios.metaProducto) replacement.metaProducto = cambios.metaProducto;
          if (cambios.metaCuantificacion) replacement.metaCuantificacion = cambios.metaCuantificacion;
          if (cambios.partidas) replacement.partidas = cambios.partidas;
          if (cambios.prioridadMinisterial) replacement.prioridadMinisterial = cambios.prioridadMinisterial;
          if (cambios.prioridadJefatura) replacement.prioridadJefatura = cambios.prioridadJefatura;
          if (cambios.presupuestoSolicitado) replacement.presupuestoSolicitado = cambios.presupuestoSolicitado;
          if (cambios.presupuestoGestion) replacement.presupuestoGestion = cambios.presupuestoGestion;
          if (cambios.etapaProyecto) replacement.etapaProyecto = cambios.etapaProyecto;
          if (cambios.temas) replacement.temas = cambios.temas;
          if (cambios.etiquetas) replacement.etiquetas = cambios.etiquetas;
          if (cambios.cancelado === true) replacement.cancelado = cambios.cancelado;
          if (cambios.cancelado === false) replacement.cancelado = cambios.cancelado;
          if (cambios.eliminado === true) replacement.eliminado = cambios.eliminado;
          if (cambios.dependencia) replacement.dependencia = cambios.dependencia;
          if (cambios.poblacionObjetivo) replacement.poblacionObjetivo = cambios.poblacionObjetivo;
          if (cambios.jurisdiccionesParticipantes) replacement.jurisdiccionesParticipantes = cambios.jurisdiccionesParticipantes;
          callback();
        }, function (callback) {
          if (cambios.fechaDeInicio) {
            var f = moment(cambios.fechaDeInicio, 'DD/MM/YYYY', true);
            
            if (!f.isValid()) return callback (new Error('Fecha de inicio inválida'));

            replacement.fechaDeInicio = cambios.fechaDeInicio;
          }
          
          callback();
        }, function (callback) {
          if (cambios.fechaDeFinalizacion) {
            var f = moment(cambios.fechaDeFinalizacion, 'DD/MM/YYYY', true);
            
            if (!f.isValid()) return callback (new Error('Fecha de finalización inválida'));

            replacement.fechaDeFinalizacion = cambios.fechaDeFinalizacion;
          }
          
          callback();
        }
      ], function (err) {
        if (err) return reject(err);
  
        buscarProyectoPorId(db, idProyecto)
        .then(function (anterior) {
          db
          .collection('poa.proyectos-log')
          .insert({
            fecha: new Date().valueOf(),
            usuario: usuario,
            idProyecto: new mongo.ObjectID(idProyecto),
            cambios: cambios,
            anterior: anterior
          })
          .then(function () {
            db
            .collection('poa.proyectos')
            .update({
              _id: new mongo.ObjectID(idProyecto)
            }, {
              $set: replacement
            })
            .then(resolve, reject);
          }, reject);
        }, reject);      
      });
    },
    actualizarActividad: function (idActividad, cambios) {
      if (!idActividad) this.reject(new Error('No hay id de actividad'));
      if (!cambios) this.reject(new Error('No hay cambios'));
      
      var reject = this.reject, resolve = this.resolve, db = this.db, usuario = this.usuario;
      var replacement = {};
      
      async.series([
        function (callback) {
          if (cambios.nombre) replacement.nombre = cambios.nombre;
          if (cambios.codIdentificacion) replacement.codIdentificacion = cambios.codIdentificacion;
          if (cambios.responsable) replacement.responsable = cambios.responsable;
          if (cambios.fechas) replacement.fechas = cambios.fechas;
          if (cambios.cumplida === true) replacement.cumplida = cambios.cumplida;
          if (cambios.cumplida === false) replacement.cumplida = cambios.cumplida;
          if (cambios.cancelada === true) replacement.cancelada = cambios.cancelada;
          if (cambios.cancelada === false) replacement.cancelada = cambios.cancelada;
          if (cambios.eliminado === true) replacement.eliminado = cambios.eliminado;
          
          callback();
        }, function (callback) {
          if (cambios.fechaDeInicio) {
            var f = moment(cambios.fechaDeInicio, 'DD/MM/YYYY', true);
            
            if (!f.isValid()) return callback (new Error('Fecha de inicio inválida'));

            replacement.fechaDeInicio = cambios.fechaDeInicio;
          }
          
          callback();
        }, function (callback) {
          if (cambios.fechaDeFinalizacion) {
            var f = moment(cambios.fechaDeFinalizacion, 'DD/MM/YYYY', true);
            
            if (!f.isValid()) return callback (new Error('Fecha de finalización inválida'));

            replacement.fechaDeFinalizacion = cambios.fechaDeFinalizacion;
          }
          
          callback();
        }
      ], function (err) {
        if (err) return reject(err);
  
        buscarActividadPorId(db, idActividad)
        .then(function (anterior) {
          db
          .collection('poa.actividades-log')
          .insert({
            fecha: new Date().valueOf(),
            usuario: usuario,
            idActividad: new mongo.ObjectID(idActividad),
            cambios: cambios,
            anterior: anterior
          })
          .then(function () {
            db
            .collection('poa.actividades')
            .update({
              _id: new mongo.ObjectID(idActividad)
            }, {
              $set: replacement
            })
            .then(resolve, reject);
          }, reject);
        }, reject);      
      });
    },
    actualizarJurisdiccion: function (idJurisdiccion, cambios) {
      if (!idJurisdiccion) this.reject(new Error('No hay id de jurisdiccion'));
      if (!cambios) this.reject(new Error('No hay cambios'));
      
      var db = this.db, reject = this.reject, resolve = this.resolve, usuario = this.usuario;
      
      buscarJurisdiccionPorId(db, idJurisdiccion)
      .then(function (anterior) {
        if (!anterior) {
          return reject('Id de jurisdicción erróneo');
        }
        
      var replacement = {}
      
      async.series([
        function (callback) {
          if (cambios.nombre) replacement.nombre = cambios.nombre;
          if (cambios.descripcion || (cambios.descripcion === '')) replacement.descripcion = cambios.descripcion;
          if (cambios.codIdentificacion || (cambios.codIdentificacion === '')) replacement.codIdentificacion = cambios.codIdentificacion;
          if (cambios.responsable) replacement.responsable = cambios.responsable;
          if (cambios.planifica) replacement.planifica = cambios.planifica;
          if (cambios.eliminado === true) replacement.eliminado = cambios.eliminado;
          if (cambios.validado === true) replacement.validado = cambios.validado;
          if (cambios.validado === false) replacement.validado = cambios.validado;
          if (cambios.aprobado === true) replacement.aprobado = cambios.aprobado;
          if (cambios.aprobado === false) replacement.aprobado = cambios.aprobado;
          
          callback();
        }],
        function (err) {
          if (err) return reject(err);
          
          db
          .collection('poa.jurisdicciones-log')
          .insert({
            fecha: new Date().valueOf(),
            usuario: usuario,
            idJurisdiccion: new mongo.ObjectID(idJurisdiccion),
            cambios: cambios,
            anterior: anterior
          })
          .then(function () {
            db
            .collection('poa.jurisdicciones')
            .update({
              _id: new mongo.ObjectID(idJurisdiccion)
            }, {
              $set: replacement
            })
            .then(resolve, reject);
          }, reject);
        });
      }, reject);
    },
    actualizarObjImpacto: function (idObjImpacto, cambios) {
      if (!idObjImpacto) this.reject(new Error('No hay id de objetivo de impacto'));
      if (!cambios) this.reject(new Error('No hay cambios'));
      
      var db = this.db, reject = this.reject, resolve = this.resolve, usuario = this.usuario;
      
      buscarObjImpactoPorId(db, idObjImpacto)
      .then(function (anterior) {
        if (!anterior) {
          return reject('Id de jurisdicción erróneo');
        }
        
        var replacement = {}
      
        async.series([
          function (callback) {
            if (cambios.nombre) replacement.nombre = cambios.nombre;
            if (cambios.validado === true) replacement.validado = cambios.validado;
            if (cambios.validado === false) replacement.validado = cambios.validado;
            if (cambios.aprobado === true) replacement.aprobado = cambios.aprobado;
            if (cambios.aprobado === false) replacement.aprobado = cambios.aprobado;
            if (cambios.dependencia) replacement.dependencia = cambios.dependencia;
            if (cambios.descripcion || (cambios.descripcion === '')) replacement.descripcion = cambios.descripcion;
            if (cambios.codIdentificacion || (cambios.codIdentificacion === '')) replacement.codIdentificacion = cambios.codIdentificacion;
            if (cambios.responsableDeCarga) replacement.responsableDeCarga = cambios.responsableDeCarga;
            if (cambios.correspondenciaEjes) replacement.correspondenciaEjes = cambios.correspondenciaEjes;
            if (cambios.eliminado === true) replacement.eliminado = cambios.eliminado;
            
            callback();
          }],
          function (err) {
            if (err) return reject(err);
            
            db
            .collection('poa.objsImpacto-log')
            .insert({
              fecha: new Date().valueOf(),
              usuario: usuario,
              idObjImpacto: new mongo.ObjectID(idObjImpacto),
              cambios: cambios,
              anterior: anterior
            })
            .then(function () {
              db
              .collection('poa.objsImpacto')
              .update({
                _id: new mongo.ObjectID(idObjImpacto)
              }, {
                $set: replacement
              })
              .then(resolve, reject);
            }, reject);
          });
      }, reject);
    },
    actualizarObjMinisterial: function (idObjMinisterial, cambios) {
      if (!idObjMinisterial) this.reject(new Error('No hay id de objetivo ministerial'));
      if (!cambios) this.reject(new Error('No hay cambios'));
      
      var db = this.db, reject = this.reject, resolve = this.resolve, usuario = this.usuario;
      
      buscarObjMinisterialPorId(db, idObjMinisterial)
      .then(function (anterior) {
        if (!anterior) {
          return reject('Id de objetivo ministerial erróneo');
        }
        
        var replacement = {}
      
        async.series([
          function (callback) {
            if (cambios.nombre) replacement.nombre = cambios.nombre;
            if (cambios.validado === true) replacement.validado = cambios.validado;
            if (cambios.validado === false) replacement.validado = cambios.validado;
            if (cambios.aprobado === true) replacement.aprobado = cambios.aprobado;
            if (cambios.aprobado === false) replacement.aprobado = cambios.aprobado;
            if (cambios.descripcion || (cambios.descripcion === '')) replacement.descripcion = cambios.descripcion;
            if (cambios.codIdentificacion || (cambios.codIdentificacion === '')) replacement.codIdentificacion = cambios.codIdentificacion;
            if (cambios.responsable) replacement.responsable = cambios.responsable;
            if (cambios.dependencia) replacement.dependencia = cambios.dependencia;
            if (cambios.eliminado === true) replacement.eliminado = cambios.eliminado;
            
            callback();
          }],
          function (err) {
            if (err) return reject(err);
            
            db
            .collection('poa.objsMinisteriales-log')
            .insert({
              fecha: new Date().valueOf(),
              usuario: usuario,
              idObjMinisterial: new mongo.ObjectID(idObjMinisterial),
              cambios: cambios,
              anterior: anterior
            })
            .then(function () {
              db
              .collection('poa.objsMinisteriales')
              .update({
                _id: new mongo.ObjectID(idObjMinisterial)
              }, {
                $set: replacement
              })
              .then(resolve, reject);
            }, reject);
          });
      }, reject);
    },
    actualizarObjOperativo: function (idObjOperativo, cambios) {
      if (!idObjOperativo) this.reject(new Error('No hay id de objetivo operativo'));
      if (!cambios) this.reject(new Error('No hay cambios'));
      
      var db = this.db, reject = this.reject, resolve = this.resolve, usuario = this.usuario;
      
      buscarObjOperativoPorId(db, idObjOperativo)
      .then(function (anterior) {
        if (!anterior) {
          return reject('Id de objetivo operativo erróneo');
        }
        
        var replacement = {}
      
        async.series([
          function (callback) {
            if (cambios.nombre) replacement.nombre = cambios.nombre;
            if (cambios.validado === true) replacement.validado = cambios.validado;
            if (cambios.validado === false) replacement.validado = cambios.validado;
            if (cambios.aprobado === true) replacement.aprobado = cambios.aprobado;
            if (cambios.aprobado === false) replacement.aprobado = cambios.aprobado;
            if (cambios.descripcion || (cambios.descripcion === '')) replacement.descripcion = cambios.descripcion;
            if (cambios.codIdentificacion || (cambios.codIdentificacion === '')) replacement.codIdentificacion = cambios.codIdentificacion;
            if (cambios.eliminado === true) replacement.eliminado = cambios.eliminado;
            
            callback();
          }],
          function (err) {
            if (err) return reject(err);
            
            db
            .collection('poa.objsOperativos-log')
            .insert({
              fecha: new Date().valueOf(),
              usuario: usuario,
              idObjOperativo: new mongo.ObjectID(idObjOperativo),
              cambios: cambios,
              anterior: anterior
            })
            .then(function () {
              db
              .collection('poa.objsOperativos')
              .update({
                _id: new mongo.ObjectID(idObjOperativo)
              }, {
                $set: replacement
              })
              .then(resolve, reject);
            }, reject);
          });
      }, reject);
    },
    crearActividad: function (idProyecto, nombre) {
      if (!idProyecto) return this.reject(new Error('Falta el proyecto'));
      
      if (!nombre) return this.reject(new Error('Falta el nombre'));
      
      var usuario = this.usuario, db = this.db, reject = this.reject, resolve = this.resolve;
      
      db
      .collection('poa.proyectos')
      .findOne({
        _id: new mongo.ObjectID(idProyecto) // puede no ser un ObjectID, si ya es no pasa nada
      })
      .then(function (proyecto) {
        if (!proyecto) {
          return reject(new Error('Proyecto erróneo'));
        }
        
        db
        .collection('poa.actividades')
        .insert({
          idPlan: proyecto.idPlan,
          idJurisdiccion: proyecto.idJurisdiccion,
          idObjImpacto: proyecto.idObjImpacto,
          idObjMinisterial: proyecto.idObjMinisterial,
          anio: proyecto.anio,
          idProyecto: proyecto._id,
          nombre: nombre,
          responsableDeCarga: usuario,
          fechas: []
        })
        .then(resolve, reject);
      }, reject);
    }
  }
};
