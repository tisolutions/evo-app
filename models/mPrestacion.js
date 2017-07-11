'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcrypt-nodejs')

const prestacionSchema = new Schema({
    codigo: {
    	type: Number
    },
    nombre: {
    	type: String,
    	require: "Escriba el nombre de la Institucion"
    },
    estado: {
    	type: String
    }
});

module.exports = mongoose.model('Prestacion', prestacionSchema )
