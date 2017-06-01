'use strict'

const mongoose = require('mongoose')
const schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs')

const arregloSexo = ["M", "F"];
const arregloTipoIdentificacion = ["CC", "NIT", "TI", "Pasaporte", "CE"];
const arregloTipoUsuario = ["Super", "Empleado", "Administrador", "Basico"];
const match_correo = ["/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/", "Correo no válido."];

const UsuarioSchema =  new schema({
	primerNombre: String,
	segundoNombre: String,
  primerApellido: String,
	segundoApellido: String,
  direccion:  String,
  identificacion: String,
  fch_nacimiento: String,
  estado: String,
  usuario: String,
  telefono: {
    type: String
  },
  celular: {
    type: String
  },
  foto: {
    type: String
  },
  tipoUsuario: {
    type: schema.Types.Mixed,
    enum: {
      values: arregloTipoUsuario,
      message: "Tipo de usuario no valido."
    }
  },
  correoElectronico: {
    type: String,
    unique: true,
    validate: {
      validator: function(correo) {
        return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(correo);
      },
      message: '{VALUE} no es un correo valido.'
    }
  },
  contrasena: {type: String},
  sexo : {
  	type: String,
  	enum:["M", "F"]
  },
  tipoIdentificacion: {
    type: String,
    enum: {
      values: arregloTipoIdentificacion,
      message: "Verifica tu tipo de identificación."
    }
  },
   contratoUsuario: {
    type: schema.ObjectId,
    ref: "contrato"
  }

})

module.exports = mongoose.model('Usuario',UsuarioSchema)
