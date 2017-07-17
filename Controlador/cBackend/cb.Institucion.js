'use strict'

const mInstitucion = require('../../models/mInstitucion')
var express = require("express");
var multer = require('multer');
var upload = multer({dest: 'uploads/'});
var fs = require('fs');
var path = require('path');
var routerInstitucion = express.Router();

// FTP
const JSFtp = require("jsftp")
const Ftp = new JSFtp({
  host: "107.170.78.97",
  port: 21, // defaults to 21
  user: "ftpuser", // defaults to "anonymous"
  pass: "tiein2017" // defaults to "@anonymous"
})

routerInstitucion.route("/evo-institucion-list-select")
  .get(function(req, res) {
    var filtrosJson = [];
    mInstitucion.find(filtrosJson, function(error, Instituciones) {
      res.send({
        Instituciones: Instituciones
      });
    });
  });

routerInstitucion.route("/evo-institucion")
  .get(function(req,res){
    var filtro = {};
    mInstitucion.find(filtro)
    .then((Instituciones) =>{
        res.status(200).send({
          Instituciones: Instituciones
        })
    })
    .catch((err) =>{
      message: err
    });
  })
  .post(upload.any(), function(req,res){
  	var data = new mInstitucion({
  		codigo: req.body.codigo,
      nombre: req.body.nombre
    });
    data.save()
  	.then((Institucion)=>{
  		res.status(200).send({
  			Institucion: Institucion
  		});
  	})
  	.catch((error)=>{
      res.status(500).send(error);
  	})
  })
  .put(upload.any(), function(req,res){
  	let InstitucionId = req.body.id;
  	var body = new mInstitucion({
      codigo: req.body.codigo,
      nombre: req.body.nombre
  	});
  	mInstitucion.findByIdAndUpdate(InstitucionId, body)
  	.then((Institucion) =>{
  		res.status(200).send({
  			Institucion: Institucion
  		});
  	})
  })
  .delete(function(req,res){
  	var eliminar ={
  		_id: req.query.id
  	};
  	mInstitucion.find(eliminar)
  	.then((registro)=>{
  		mInstitucion.remove(eliminar)
  		.then((eliminar)=>{
  			res.status(200).send({
  				message: "El Registro se ha eliminado correctamente"
  			})
  		})
  	})
  });
module.exports = routerInstitucion;
