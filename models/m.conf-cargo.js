var mongo = require("mongoose");
var schema = mongo.Schema;

//mongo.connect("mongodb://usuarioevo:123@localhost/evohr");

var schemaCargo = new schema({
  nombre: {
    type: String,
    required: "Has olvidado escribir el nombre."
  },
  codigo: {
    type: String
    // required: "Has olvidado escribir el codigo."
  },
  descripcion: {
    type: String,
    required: "Has olvidado escribir la descripcion."
  },
  empresa: {
    type: schema.ObjectId,
    ref: "empresa"
  }
});

var modeloCargo = mongo.model("cargo", schemaCargo);
//model es el constructor
//primer parametro es el nombre del modelo

module.exports = modeloCargo;
