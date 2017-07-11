'use strict'

const mDetallePrestacion = require('../../models/mDetallePrestacion')
var express = require("express");
var multer = require('multer');
var upload = multer({dest: 'uploads/'});
var fs = require('fs');
var path = require('path');
var routerDetallePrestacion = express.Router();

// FTP
const JSFtp = require("jsftp")
const Ftp = new JSFtp({
  host: "107.170.78.97",
  port: 21, // defaults to 21
  user: "ftpuser", // defaults to "anonymous"
  pass: "tiein2017" // defaults to "@anonymous"
})

routerDetallePrestacion.route("/detalle-prestacion")
  .get(function(req,res){
    mDetallePrestacion.find()
    .then((DetallesPrestaciones) =>{
        res.send({
          DetallesPrestaciones: DetallesPrestaciones
        })
    })
    .catch((err) =>{
      message: err
    });
  })
  .post(upload.any(), function(req,res){
  	var data = new mDetallePrestacion({
  		fechaVinculacion: req.body.fechaVinculacion,
      institucion: req.body.idInstitucion,
      prestacion: req.body.idPrestacion,
      empleado: req.body.idEmpleado
    });
    data.save()
  	.then((DetallePrestacion)=>{
  		res.status(200).send({
  			DetallePrestacion: DetallePrestacion
  		});
  	})
  	.catch((error)=>{
      res.status(500).send(error);
  	})
  })
  .put(upload.any(), function(req,res){
  	let DetallePrestacionId = req.body.id;
  	var body = new mDetallePrestacion({
      fechaVinculacion: req.body.fechaVinculacion,
      institucion: req.body.idInstitucion,
      prestacion: req.body.idPrestacion,
      empleado: req.body.idEmpleado
  	});
  	mDetallePrestacion.findByIdAndUpdate(DetallePrestacionId, body)
  	.then((DetallePrestacion) =>{
  		res.status(200).send({
  			DetallePrestacion: DetallePrestacion
  		});
  	})
  })
  .delete(function(req,res){
  	var eliminar ={
  		_id: req.query.id
  	};
  	mDetallePrestacion.find(eliminar)
  	.then((registro)=>{
  		mDetallePrestacion.remove(eliminar)
  		.then((eliminar)=>{
  			res.status(200).send({
  				message: "El Registro se ha eliminado correctamente"
  			})
  		})
  	})
  });

module.exports = routerDetallePrestacion;
