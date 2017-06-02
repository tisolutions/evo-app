'use strict'

const mongoose = require('mongoose');
const schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');

const ausenciaSchema = new schema({
    hora: {
      type: String,
      required: "Ingrese el tiempo de la ausencia"
    },
    fechaSuceso: {
      type: Date,
      required: "Ingrese la fecha del suceso"
    },
    tipo: {
      type: String,
      required: "Seleccione un tipo"
    },
    descripcion: {
      type: String,
      required: "Ingrese una descripcion"
    },
    soporte: {
      type: String
    },
    remunerado: {
      type: Boolean,
      required: "No olvides especificar si es o no es remuderado"
    }
});

module.exports = mongoose.model('ausencia', ausenciaSchema);
