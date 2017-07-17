'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcrypt-nodejs')

const institucionSchema = new Schema({
    codigo: {
    	type: String
    },
    nombre: {
    	type: String,
    	require: "Escriba el nombre de la Institucion"
    }
});

module.exports = mongoose.model('Institucion', institucionSchema)
