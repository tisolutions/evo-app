var mongo = require("mongoose");
var schema = mongo.Schema;

// mongo.connect("mongodb://usuarioevo:123@localhost/evohr");

var schemaEmpresa = new schema({
  nit: {
    type: String,
    required: "Escriba un nit para la empresa",
    minlength: [6, "¿Este es el nit de la empresa?, nos parece muy corto."]
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
    required: "Has olvidado escribir el correo electronico"
  },
  paginaweb: {
    type: String,
    required: "Has olvidado escribir la pagina web"
  }
});

var modeloEmpresa = mongo.model("empresa", schemaEmpresa);
//model es el constructor
//primer parametro es el nombre del modelo

module.exports = modeloEmpresa;
