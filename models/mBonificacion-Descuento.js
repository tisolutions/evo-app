'use strict'

const mongoose = require('mongoose');
const schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');

const bonificacionDescuentoSchema = new Schema({
    valor:{
      type: String,
      required: "Ingrese un valor"
    },
    fechaSuceso: {
      type: Date,
      required: "Ingrese la fecha del suceso"
    },
    descripcion: {
      type: String,
      required: "Ingrese la descripcion"
    },
    soporte: {
      type: String
    },
    tipo: {
      type: String,
      required: "Seleccione un tipo"
    },
    usuario: {
      type: schema.ObjectId,
      ref: "Usuario"
    }
});

module.exports = mongoose.model('bonificacionDescuento', bonificacionDescuentoSchema);
