var mongo = require("mongoose");
var schema = mongo.Schema;

//mongo.connect("mongodb://usuarioevo:123@localhost/evohr");

var schemaCicloFacturacion = new schema({
  nombre: {
    type: String,
    required: "Has olvidado escribir el nombre."
  },
  codigo: {
    type: String
  },
  descripcion: {
    type: String,
    required: "Has olvidado escribir la descripcion."
  }
});

var modeloCicloFacturacion = mongo.model("cicloFacturacion", schemaCicloFacturacion);
//model es el constructor
//primer parametro es el nombre del modelo

module.exports = modeloCicloFacturacion;
