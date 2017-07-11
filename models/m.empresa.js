var mongo = require("mongoose");
var schema = mongo.Schema;

// mongo.connect("mongodb://usuarioevo:123@localhost/evohr");

var match_correo = ["/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/","Correo no valido"];

var schemaEmpresa = new schema({
  nit: {
    type: String,
    required: "Escriba un nit para la empresa",
    minlength: [6, "¿Este es el nit de la empresa?, nos parece muy corto."],
    validate: {
          validator: function(v) {
            return /\d{9}-\d/.test(v);
          },
          message: "El valor '{VALUE}', no sigue el formato: '123456789-0' !"
    }
  },
  direccion: {
    type: String,
    required: "Has olvidado escribir la direccion."
  },
  telefono: {
    type: String,
    required: "Has olvidado escribir el telefono"
  },
  razonSocial: {
    type: String,
    required: "Has olvidado escribir la razon social"
  },
  correoElectronico: {
    type: String,
    required: "Has olvidado escribir el correo electronico",
    validate: {
      validator: function(correo) {
        return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(correo);
      },
      message: '{VALUE} no es un correo valido.'
    }
  },
  paginaweb: {
    type: String,
    required: "Has olvidado escribir la pagina web"
  },
  usuario: {
     type: schema.ObjectId,
     ref: "Usuario"
  },
  tipoSalario: {
     type: schema.ObjectId,
     ref: "tipoSalario"
  },
  tipoContrato: {
     type: schema.ObjectId,
     ref: "tipoContrato"
  },
  cargo: {
     type: schema.ObjectId,
     ref: "cargo"
  },
  cicloFacturacion: {
     type: schema.ObjectId,
     ref: "cicloFacturacion"
  }
});

var modeloEmpresa = mongo.model("empresa", schemaEmpresa);
//model es el constructor
//primer parametro es el nombre del modelo

module.exports = modeloEmpresa;
