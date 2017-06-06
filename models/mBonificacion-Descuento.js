'use strict'

const mongoose = require('mongoose')
const schema = mongoose.Schema

const bonificacionDescuentoSchema = new schema({
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
    empleado: {
     type: schema.ObjectId,
     ref: "Usuario"
   }
});

module.exports = mongoose.model('bonificacionDescuento', bonificacionDescuentoSchema);
