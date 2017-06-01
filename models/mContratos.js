// The purpose of "use strict" is to indicate that the code should be executed in "strict mode".
// With strict mode, you can not, for example, use undeclared variables.
// Declared at the beginning of a script, it has global scope (all code in the script will execute in strict mode)
// x = 3.14; // This will cause an error because x is not declared
'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcrypt-nodejs')

const contractSchema = new Schema({
    cicloFacturacion :{
    	type:String,
    	required: "selecciona un ciclo de facturacion"
    },
    salarioBase : {
    	type: String,
    	require: "Define el salario base"
    },
    fechaIngreso : {
    	type: Date,
    	require: "Selecciona la fecha de ingreso"
    },
    tipoContrato : {
	    type: String,
	    required: "selecciona el tipo de contrato"
	},
	tipoSalario: {
	    type: String,
	    required: "selecciona el tipo de salario"
	 },
	 fechaFinalizacion: {
	    type: Date
	 },
	  cargo: {
	    type: String,
	    required: "selecciona el cargo"
	 },
	  nota: {
	    type: String,
	    required: "Escriba una nota"
	  },
	  noContrato: {
	    type: String,
	    required: "Numero de contrato vacio"
	  },
	  codContrato:{
	  	type: String
	  }
})

module.exports = mongoose.model('Contrato',contractSchema )




// select : false --> por defecto no trae el registro