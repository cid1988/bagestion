var async = require('async'), mongo = require('mongodb'), moment = require('moment');

function buscarActividadPorId2(db, idActividad) {
  return db
          .collection('upejol.actividades')
          .findOne({
            _id: new mongo.ObjectID(idActividad)
          });
}

function buscarHitoPorId2(db, idHito) {
  return db
          .collection('upejol.hitos')
          .findOne({
            _id: new mongo.ObjectID(idHito)
          });
}

function buscarObjAreaPorId2(db, idObjArea) {
  return db
          .collection('upejol.objsArea')
          .findOne({
            _id: new mongo.ObjectID(idObjArea)
          });
}

function buscarAreaPorId2(db, idArea) {
  return db
          .collection('upejol.areas')
          .findOne({
            _id: new mongo.ObjectID(idArea)
          });
}

function buscarPlanPorId2(db, idPlan) {
  return db
          .collection('upejol.planes')
          .findOne({
            _id: new mongo.ObjectID(idPlan)
          });
}

module.exports = {
  poa: {
    listarPlanes2: function() {
      this
      .db
      .collection('upejol.planes')
      .find({})
      .then(this.resolve, this.reject);
    },
    listarActividades2: function(idPlan) {
      this
      .db
      .collection('upejol.actividades')
      .find({
        $and:[{eliminado: {$exists:false}},
        {idPlan: new mongo.ObjectID(idPlan)}]
      })
      .then(this.resolve, this.reject);
    },
    listarActividadesPorObArea2: function(idObAr) {
      this
      .db
      .collection('upejol.actividades')
      .find({
        $and:[{eliminado: {$exists:false}},
        {idObjArea: new mongo.ObjectID(idObAr)}]
      })
      .then(this.resolve, this.reject);
    },
    crearActividad2: function (idObjArea, nombre) {
      if (!idObjArea) return this.reject(new Error('Falta el objetivo de area'));
      
      if (!nombre) return this.reject(new Error('Falta el nombre'));
      
      var usuario = this.usuario, db = this.db, reject = this.reject, resolve = this.resolve;
      
      db
      .collection('upejol.objsArea')
      .findOne({
        _id: new mongo.ObjectID(idObjArea) // puede no ser un ObjectID, si ya es no pasa nada
      })
      .then(function (objArea) {
        if (!objArea) {
          return reject(new Error('Objetivo de area erróneo'));
        }
        
        db
        .collection('upejol.actividades')
        .insert({
          idPlan: objArea.idPlan,
          idArea: objArea.idArea,
          idObjArea: objArea._id,
          anio: objArea.anio,
          nombre: nombre,
          responsableDeCarga: usuario,
          prioridadJefatura: 'No prioritario'
        })
        .then(resolve, reject);
      }, reject);
    },
    listarObjsArea2: function (idPlan) {
      this
      .db
      .collection('upejol.objsArea')
      .find({
        $and:[{eliminado: {$exists:false}},
        {idPlan: new mongo.ObjectID(idPlan)}]
      })
      .then(this.resolve, this.reject);
    },
    listarObjsAreaPorArea2: function (idArea) {
      this
      .db
      .collection('upejol.objsArea')
      .find({
        $and:[{eliminado: {$exists:false}},
        {idArea: new mongo.ObjectID(idArea)}]
      })
      .then(this.resolve, this.reject);
    },
    crearObjArea2: function (idArea, nombre) {
      if (!idArea) return this.reject(new Error('Falta el area'));
      
      if (!nombre) return this.reject(new Error('Falta el nombre'));
      
      var usuario = this.usuario, db = this.db, reject = this.reject, resolve = this.resolve;
      
      db
      .collection('upejol.areas')
      .findOne({
        _id: new mongo.ObjectID(idArea) // puede no ser un ObjectID, si ya es no pasa nada
      })
      .then(function (jur) {
        if (!jur) {
          return reject(new Error('Area errónea'));
        }
        
        db
        .collection('upejol.objsArea')
        .insert({
          idPlan: jur.idPlan,
          idArea: jur._id,
          anio: jur.anio,
          nombre: nombre,
          responsableDeCarga: usuario
        })
        .then(resolve, reject);
      }, reject);
    },
    listarAreas2: function (idPlan) {
      this
      .db
      .collection('upejol.areas')
      .find({
        $and:[{eliminado: {$exists:false}},
        {idPlan: new mongo.ObjectID(idPlan)}]
      })
      .then(this.resolve, this.reject);
    },
    /*listarHitos2: function (idPlan) {
      this
      .db
      .collection('upejol.hitos')
      .find({
        $and:[{eliminado: {$exists:false}},
        {idPlan: new mongo.ObjectID(idPlan)}]
      })
      .then(this.resolve, this.reject);
    },
    listarHitosPorActividad2: function (idActividad) {
      this
      .db
      .collection('upejol.hitos')
      .find({
        $and:[{eliminado: {$exists:false}},
        {idActividad: new mongo.ObjectID(idActividad)}]
      })
      .then(this.resolve, this.reject);
    },*/
    traerPlan2: function (anio, etapa) {
      this
      .db
      .collection('upejol.planes')
      .findOne({
        anio: Number(anio),
        etapa: etapa
      })
      .then(this.resolve, this.reject);
    },
    listarContactosORM2: function () {
      this
      .db
      .collection('orm.contactos')
      .find({}, {}, {apellidos: 1, nombre: 1})
      .then(this.resolve, this.reject);
    },
    listarJurisdiccionesORM2: function () {
      this
      .db
      .collection('orm.organigrama')
      .find({}, {}, {nombreCompleto: 1})
      .then(this.resolve, this.reject);
    },
    crearPlan2: function (anio, etapa, areas, responsables) {
      if (!anio) return this.reject(new Error('Falta el año'));
      
      if (!parseInt(anio) === anio) {
       return this.reject(new Error('El año no es un número válido'));
      }
      
      if (!etapa) return this.reject(new Error('Falta la etapa'));
      
      if (['planificacion','seguimiento'].indexOf(etapa) === -1) return this.reject(new Error('La etapa del plan indicada no es válida'));
      
      if (!areas || !areas.length) return this.reject(new Error('Faltan las areas'));
      
      var usuario = this.usuario, db = this.db, reject = this.reject, resolve = this.resolve;
      
      db
      .collection('upejol.planes')
      .findOne({ anio: anio, etapa: etapa })
      .then(function (plan) {
        if (plan) return reject(new Error('El plan para ese año y etapa ya existe'));
        
        db
        .collection('upejol.planes')
        .insert({
          anio: Number(anio),
          etapa: etapa,
          creadoPor: usuario,
          responsables: responsables
        })
        .then(function (plan) {
          async
          .eachSeries(areas, function (jur, callback) {
            db
            .collection('upejol.areas')
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
    actualizarPlan2: function (idPlan, etapaNueva, responsablesNuevo, areasNuevas) {
      if (!idPlan) this.reject(new Error('No hay id de area'));
      
      var db = this.db, reject = this.reject, resolve = this.resolve, usuario = this.usuario;
      
      buscarPlanPorId2(db, idPlan)
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
          .collection('upejol.planes-log')
          .insert({
            fecha: new Date().valueOf(),
            usuario: usuario,
            idPlan: new mongo.ObjectID(idPlan),
            cambios: {"etapa" : etapaNueva, "responsables" : responsablesNuevo},
            anterior: anterior
          })
          .then(function () {
            db
            .collection('upejol.planes')
            .update({
              _id: new mongo.ObjectID(idPlan)
            }, {
              $set: replacement
            })
            .then(function (plan) {
              async
              .eachSeries(areasNuevas, function (jur, callback) {
                db
                .collection('upejol.areas')
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
    actualizarActividad2: function (idActividad, cambios) {
      if (!idActividad) this.reject(new Error('No hay id de actividad'));
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
          if (cambios.ordenPago) replacement.ordenPago = cambios.ordenPago;
          if (cambios.responsable) replacement.responsable = cambios.responsable;
          if (cambios.fechaInicio) replacement.fechaInicio = cambios.fechaInicio;
          if (cambios.fechaFin) replacement.fechaFin = cambios.fechaFin;
          if (cambios.partidas) replacement.partidas = cambios.partidas;
          if (cambios.responsable) replacement.responsable = cambios.responsable;
          if (cambios.etapaActividad) replacement.etapaActividad = cambios.etapaActividad;
          if (cambios.noAutorizado) replacement.noAutorizado = cambios.noAutorizado;
          if (cambios.cancelado === true) replacement.cancelado = cambios.cancelado;
          if (cambios.cancelado === false) replacement.cancelado = cambios.cancelado;
          if (cambios.eliminado === true) replacement.eliminado = cambios.eliminado;
          if (cambios.archivos) replacement.archivos = cambios.archivos;
          
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
  
        buscarActividadPorId2(db, idActividad)
        .then(function (anterior) {
          db
          .collection('upejol.actividades-log')
          .insert({
            fecha: new Date().valueOf(),
            usuario: usuario,
            idActividad: new mongo.ObjectID(idActividad),
            cambios: cambios,
            anterior: anterior
          })
          .then(function () {
            db
            .collection('upejol.actividades')
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
    /*actualizarHito2: function (idHito, cambios) {
      if (!idHito) this.reject(new Error('No hay id de hito'));
      if (!cambios) this.reject(new Error('No hay cambios'));
      
      var reject = this.reject, resolve = this.resolve, db = this.db, usuario = this.usuario;
      var replacement = {};
      
      async.series([
        function (callback) {
          if (cambios.nombre) replacement.nombre = cambios.nombre;
          if (cambios.orden) replacement.orden = cambios.orden;
          if (cambios.codIdentificacion) replacement.codIdentificacion = cambios.codIdentificacion;
          if (cambios.responsable) replacement.responsable = cambios.responsable;
          if (cambios.fechaPlanificada) replacement.fechaPlanificada = cambios.fechaPlanificada;
          if (cambios.fechaEstimada) replacement.fechaEstimada = cambios.fechaEstimada;
          if (cambios.fechaReal) replacement.fechaReal = cambios.fechaReal;
          if (cambios.cumplida === true) replacement.cumplida = cambios.cumplida;
          if (cambios.cumplida === false) replacement.cumplida = cambios.cumplida;
          if (cambios.cancelada === true) replacement.cancelada = cambios.cancelada;
          if (cambios.cancelada === false) replacement.cancelada = cambios.cancelada;
          if (cambios.eliminado === true) replacement.eliminado = cambios.eliminado;
          if (cambios.subhitos) replacement.subhitos = cambios.subhitos;
          
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
  
        buscarHitoPorId2(db, idHito)
        .then(function (anterior) {
          db
          .collection('upejol.hitos-log')
          .insert({
            fecha: new Date().valueOf(),
            usuario: usuario,
            idHito: new mongo.ObjectID(idHito),
            cambios: cambios,
            anterior: anterior
          })
          .then(function () {
            db
            .collection('upejol.hitos')
            .update({
              _id: new mongo.ObjectID(idHito)
            }, {
              $set: replacement
            })
            .then(resolve, reject);
          }, reject);
        }, reject);      
      });
    },*/
    actualizarArea2: function (idArea, cambios) {
      if (!idArea) this.reject(new Error('No hay id de area'));
      if (!cambios) this.reject(new Error('No hay cambios'));
      
      var db = this.db, reject = this.reject, resolve = this.resolve, usuario = this.usuario;
      
      buscarAreaPorId2(db, idArea)
      .then(function (anterior) {
        if (!anterior) {
          return reject('Id de area erróneo');
        }
        
      var replacement = {}
      
      async.series([
        function (callback) {
          if (cambios.nombre) replacement.nombre = cambios.nombre;
          if (cambios.descripcion) replacement.descripcion = cambios.descripcion;
          if (cambios.codIdentificacion) replacement.codIdentificacion = cambios.codIdentificacion;
          if (cambios.responsable) replacement.responsable = cambios.responsable;
          if (cambios.planifica) replacement.planifica = cambios.planifica;
          if (cambios.presupuestoAnual) replacement.presupuestoAnual = cambios.presupuestoAnual;
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
          .collection('upejol.areas-log')
          .insert({
            fecha: new Date().valueOf(),
            usuario: usuario,
            idArea: new mongo.ObjectID(idArea),
            cambios: cambios,
            anterior: anterior
          })
          .then(function () {
            db
            .collection('upejol.areas')
            .update({
              _id: new mongo.ObjectID(idArea)
            }, {
              $set: replacement
            })
            .then(resolve, reject);
          }, reject);
        });
      }, reject);
    },
    actualizarObjArea2: function (idObjArea, cambios) {
      if (!idObjArea) this.reject(new Error('No hay id de objetivo de area'));
      if (!cambios) this.reject(new Error('No hay cambios'));
      
      var db = this.db, reject = this.reject, resolve = this.resolve, usuario = this.usuario;
      
      buscarObjAreaPorId2(db, idObjArea)
      .then(function (anterior) {
        if (!anterior) {
          return reject('Id de area erróneo');
        }
        
        var replacement = {}
      
        async.series([
          function (callback) {
            if (cambios.nombre) replacement.nombre = cambios.nombre;
            if (cambios.validado === true) replacement.validado = cambios.validado;
            if (cambios.validado === false) replacement.validado = cambios.validado;
            if (cambios.aprobado === true) replacement.aprobado = cambios.aprobado;
            if (cambios.aprobado === false) replacement.aprobado = cambios.aprobado;
            if (cambios.descripcion) replacement.descripcion = cambios.descripcion;
            if (cambios.dependencia) replacement.dependencia = cambios.dependencia;
            if (cambios.codIdentificacion) replacement.codIdentificacion = cambios.codIdentificacion;
            if (cambios.responsableDeCarga) replacement.responsableDeCarga = cambios.responsableDeCarga;
            if (cambios.correspondenciaEjes) replacement.correspondenciaEjes = cambios.correspondenciaEjes;
            if (cambios.eliminado === true) replacement.eliminado = cambios.eliminado;
            
            callback();
          }],
          function (err) {
            if (err) return reject(err);
            
            db
            .collection('upejol.objsArea-log')
            .insert({
              fecha: new Date().valueOf(),
              usuario: usuario,
              idObjArea: new mongo.ObjectID(idObjArea),
              cambios: cambios,
              anterior: anterior
            })
            .then(function () {
              db
              .collection('upejol.objsArea')
              .update({
                _id: new mongo.ObjectID(idObjArea)
              }, {
                $set: replacement
              })
              .then(resolve, reject);
            }, reject);
          });
      }, reject);
    },
    /*crearHito2: function (idActividad, nombre) {
      if (!idActividad) return this.reject(new Error('Falta la actividad'));
      
      if (!nombre) return this.reject(new Error('Falta el nombre'));
      
      var usuario = this.usuario, db = this.db, reject = this.reject, resolve = this.resolve;
      
      db
      .collection('upejol.actividades')
      .findOne({
        _id: new mongo.ObjectID(idActividad) // puede no ser un ObjectID, si ya es no pasa nada
      })
      .then(function (actividad) {
        if (!actividad) {
          return reject(new Error('Actividad errónea'));
        }
        
        db
        .collection('upejol.hitos')
        .insert({
          idPlan: actividad.idPlan,
          idArea: actividad.idArea,
          idObjArea: actividad.idObjArea,
          anio: actividad.anio,
          idActividad: actividad._id,
          nombre: nombre,
          responsableDeCarga: usuario
        })
        .then(resolve, reject);
      }, reject);
    }*/
  }
};
