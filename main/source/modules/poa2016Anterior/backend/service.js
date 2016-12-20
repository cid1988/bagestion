var async = require('async'), mongo = require('mongodb'), moment = require('moment');

function buscarProyectoPorId3(db, idProyecto) {
  return db
          .collection('poa.proyectos_anterior')
          .findOne({
            _id: new mongo.ObjectID(idProyecto)
          });
}

function buscarActividadPorId3(db, idActividad) {
  return db
          .collection('poa.actividades_anterior')
          .findOne({
            _id: new mongo.ObjectID(idActividad)
          });
}

function buscarObjImpactoPorId3(db, idObjImpacto) {
  return db
          .collection('poa.objsImpacto_anterior')
          .findOne({
            _id: new mongo.ObjectID(idObjImpacto)
          });
}

function buscarObjMinisterialPorId3(db, idObjMinisterial) {
  return db
          .collection('poa.objsMinisteriales_anterior')
          .findOne({
            _id: new mongo.ObjectID(idObjMinisterial)
          });
}

function buscarObjOperativoPorId3(db, idObjOperativo) {
  return db
          .collection('poa.objsOperativos_anterior')
          .findOne({
            _id: new mongo.ObjectID(idObjOperativo)
          });
}

function buscarJurisdiccionPorId3(db, idJurisdiccion) {
  return db
          .collection('poa.jurisdicciones_anterior')
          .findOne({
            _id: new mongo.ObjectID(idJurisdiccion)
          });
}

function buscarPlanPorId3(db, idPlan) {
  return db
          .collection('poa.planes_anterior')
          .findOne({
            _id: new mongo.ObjectID(idPlan)
          });
}

module.exports = {
  poa: {
    listarPlanes3: function() {
      this
      .db
      .collection('poa.planes_anterior')
      .find({})
      .then(this.resolve, this.reject);
    },
    listarProyectos3: function(idPlan) {
      this
      .db
      .collection('poa.proyectos_anterior')
      .find({
        $and:[{eliminado: {$exists:false}},
        {idPlan: new mongo.ObjectID(idPlan)}]
      })
      .then(this.resolve, this.reject);
    },
    listarProyectosPorObOperativo3: function(idObOp) {
      this
      .db
      .collection('poa.proyectos_anterior')
      .find({
        $and:[{eliminado: {$exists:false}},
        {idObjOperativo: new mongo.ObjectID(idObOp)}]
      })
      .then(this.resolve, this.reject);
    },
    listarObjsMinisteriales3: function (idPlan) {
      this
      .db
      .collection('poa.objsMinisteriales_anterior')
      .find({
        $and:[{eliminado: {$exists:false}},
        {idPlan: new mongo.ObjectID(idPlan)}]
      })
      .then(this.resolve, this.reject);
    },
    listarObjsMinisterialesPorObImpacto3: function (idObImpacto) {
      this
      .db
      .collection('poa.objsMinisteriales_anterior')
      .find({
        $and:[{eliminado: {$exists:false}},
        {idObjImpacto: new mongo.ObjectID(idObImpacto)}]
      })
      .then(this.resolve, this.reject);
    },
    listarObjsOperativos3: function (idPlan) {
      this
      .db
      .collection('poa.objsOperativos_anterior')
      .find({
        $and:[{eliminado: {$exists:false}},
        {idPlan: new mongo.ObjectID(idPlan)}]
      })
      .then(this.resolve, this.reject);
    },
    listarObjsOperativosPorObMinisterial3: function (idObMinisterial) {
      this
      .db
      .collection('poa.objsOperativos_anterior')
      .find({
        $and:[{eliminado: {$exists:false}},
        {idObjMinisterial: new mongo.ObjectID(idObMinisterial)}]
      })
      .then(this.resolve, this.reject);
    },
    listarObjsImpacto3: function (idPlan) {
      this
      .db
      .collection('poa.objsImpacto_anterior')
      .find({
        $and:[{eliminado: {$exists:false}},
        {idPlan: new mongo.ObjectID(idPlan)}]
      })
      .then(this.resolve, this.reject);
    },
    listarObjsImpactoPorJurisdiccion3: function (idJurisdiccion) {
      this
      .db
      .collection('poa.objsImpacto_anterior')
      .find({
        $and:[{eliminado: {$exists:false}},
        {idJurisdiccion: new mongo.ObjectID(idJurisdiccion)}]
      })
      .then(this.resolve, this.reject);
    },
    listarJurisdicciones3: function (idPlan) {
      this
      .db
      .collection('poa.jurisdicciones_anterior')
      .find({
        $and:[{eliminado: {$exists:false}},
        {idPlan: new mongo.ObjectID(idPlan)}]
      })
      .then(this.resolve, this.reject);
    },
    listarActividades3: function (idPlan) {
      this
      .db
      .collection('poa.actividades_anterior')
      .find({
        $and:[{eliminado: {$exists:false}},
        {idPlan: new mongo.ObjectID(idPlan)}]
      })
      .then(this.resolve, this.reject);
    },
    listarActividadesPorProyecto3: function (idProyecto) {
      this
      .db
      .collection('poa.actividades_anterior')
      .find({
        $and:[{eliminado: {$exists:false}},
        {idProyecto: new mongo.ObjectID(idProyecto)}]
      })
      .then(this.resolve, this.reject);
    },
    traerPlan3: function (anio, etapa) {
      this
      .db
      .collection('poa.planes_anterior')
      .findOne({
        anio: Number(anio),
        etapa: etapa
      })
      .then(this.resolve, this.reject);
    }
  }
};
