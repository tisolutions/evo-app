'use strict'

const mPrestacion = require('../../models/mPrestacion')
var express = require("express");
var multer = require('multer');
var upload = multer({dest: 'uploads/'});
var fs = require('fs');
var path = require('path');
var routerPrestacion = express.Router();

// FTP
const JSFtp = require("jsftp")
const Ftp = new JSFtp({
  host: "107.170.78.97",
  port: 21, // defaults to 21
  user: "ftpuser", // defaults to "anonymous"
  pass: "tiein2017" // defaults to "@anonymous"
})

routerPrestacion.route("/prestacion")
  .get(function(req,res){
    mPrestacion.find()
    .then((Prestaciones) =>{
        res.send({
          Prestaciones: Prestaciones
        })
    })
    .catch((err) =>{
      message: err
    });
  })
  .post(upload.any(), function(req,res){
  	var data = new mPrestacion({
  		codigo: req.body.codigo,
      nombre: req.body.nombre,
      estado: "estado_X"
    });
    data.save()
  	.then((Prestacion)=>{
  		res.status(200).send({
  			Prestacion: Prestacion
  		});
  	})
  	.catch((error)=>{
      res.status(500).send(error);
  	})
  })
  .put(upload.any(), function(req,res){
  	let PrestacionId = req.body.id;
  	var body = new mPrestacion({
      codigo: req.body.codigo,
      nombre: req.body.nombre,
      estado: "estado_X"
  	});
  	mPrestacion.findByIdAndUpdate(PrestacionId, body)
  	.then((Prestacion) =>{
  		res.status(200).send({
  			Prestacion: Prestacion
  		});
  	})
  })
  .delete(function(req,res){
  	var eliminar ={
  		_id: req.query.id
  	};
  	mPrestacion.find(eliminar)
  	.then((registro)=>{
  		mPrestacion.remove(eliminar)
  		.then((eliminar)=>{
  			res.status(200).send({
  				message: "El Registro se ha eliminado correctamente"
  			})
  		})
  	})
  });

module.exports = routerPrestacion;
