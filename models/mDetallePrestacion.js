'use strict'

const mongoose = require('mongoose')
const schema = mongoose.Schema
const bcrypt = require('bcrypt-nodejs')

const detallePrestacionSchema = new schema({
  fechaVinculacion: {
     type: Date,
     required: "No olvide registrar la fecha de Vinculacion"
  },
  institucion: {
     type: schema.ObjectId,
     ref: "Institucion"
  },
  prestacion: {
     type: schema.ObjectId,
     ref: "Prestacion"
  },
  empleado: {
     type: schema.ObjectId,
     ref: "Usuario"
  }
});

module.exports = mongoose.model('DetallePrestacion', detallePrestacionSchema)
