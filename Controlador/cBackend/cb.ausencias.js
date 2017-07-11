'use strict'

const mAusencias = require('../../models/mAusencias')
const mUsuario = require('../../models/mUsuarios')
var express = require("express");
var routerAusencias = express.Router();
var multer = require('multer')
var upload = multer({dest: 'uploads/'})
var fs = require('fs')
var path = require('path')

// FTP
const JSFtp = require("jsftp")
const Ftp = new JSFtp({
  host: "107.170.78.97",
  port: 21, // defaults to 21
  user: "ftpuser", // defaults to "anonymous"
  pass: "tiein2017" // defaults to "@anonymous"
})

routerAusencias.route("/ausencias/edicion")
.get(function(req,res){

	mAusencias.findById(req.query.id)
	.then((ausencias)=>{
		mUsuario.populate(ausencias, {path: "empleado"})
		.then((registro)=>{
			res.status(200).send(registro);
		})
	})
	.catch((err) =>{
		res.status(500).send({
			message: `Error al realizar la petición: ${err}`
		})
	})
})

routerAusencias.route("/ausencia")
.get(function(req,res){

	mAusencias.find()
	.then((Aus) =>{
		mUsuario.populate(Aus, {path: "ausenciaUsuario"})
		.then((doc)=>{
			res.send({
				ausencias: doc
			})
		})
	})

	.catch((err) =>{
		message: err
	});
})
.post(upload.any(), function(req,res){
	if (req.files.length > 0) {
		var archivo = req.files[0].originalname
		archivo = archivo.substring(archivo.lastIndexOf('.'))
	}else{
		var archivo = "";
	}

	var data = new mAusencias({
			fechaFin: req.body.fechaFin,
      		fechaSuceso: req.body.fechaSuceso,
			tipo: req.body.tipo,
      		descripcion: req.body.descripcion,
      		tipo: req.body.tipo,
      		soporte: archivo,
			empleado: req.body.idEmpleado
    });

    data.save()
	.then((Ause)=>{
		if (req.files.length > 0) {
			req.files.forEach(function(file){
				var ext = file.originalname;
          		ext = ext.substring(ext.lastIndexOf('.'))
				var filename = Ause._id + ext
				var remotePath = 'evoHR/SoportesAusencias/'+filename

				Ftp.put(file.path, remotePath, function(hadError) {
	              if (!hadError)
	                console.log("File transferred successfully!");
	            	res.status(200).send({
						Ausencia: Ause
					});
	          	});
			});
		}else{
			res.status(200).send({
				Ausencia: Ause
			});
		}
	})

	.catch((error)=>{
        res.status(500).send(error);
	})
})
.put(upload.any(), function(req,res){

	let AuseSelec = req.body.id

	if (req.files.length > 0) {
		var archivo = req.files[0].originalname
		archivo = archivo.substring(archivo.lastIndexOf('.'))
		req.body.soporte = archivo

		var body = new mAusencias({
				fechaFin: req.body.fechaFin,
	      		fechaSuceso: req.body.fechaSuceso,
				tipo: req.body.tipo,
	      		descripcion: req.body.descripcion,
	      		tipo: req.body.tipo,
	      		soporte: archivo,
	      		_id:AuseSelec,
				empleado: req.body.idEmpleado
		})
	}else{
		var body = new mAusencias({
				fechaFin: req.body.fechaFin,
	      		fechaSuceso: req.body.fechaSuceso,
				tipo: req.body.tipo,
	      		descripcion: req.body.descripcion,
	      		tipo: req.body.tipo,
				empleado: req.body.idEmpleado,
				_id:AuseSelec
		})
	}

	mAusencias.findByIdAndUpdate(AuseSelec, body)
	.then((Aus) =>{
		if (req.files.length > 0) {
			req.files.forEach(function(file){
				var ext = file.originalname;
          		ext = ext.substring(ext.lastIndexOf('.'))
				var filename = AuseSelec+ ext;
				var remotePath = 'evoHR/SoportesAusencias/'+filename;

				Ftp.put(file.path, remotePath, function(hadError) {
				  if (!hadError)
				    console.log("File transferred successfully!");
					res.status(200).send({
						Ausencia: Aus
					});
				});
			});
		}else{
			res.status(200).send({
				Ausencia: Aus
			});
		}
	})

	.catch((err)=>{
		res.status(500).send({
			error: err
		});
	})
})
.delete(function(req,res){
	var eliminar ={
		_id: req.query.id
	};
	mAusencias.find(eliminar)
	.then((registro)=>{
		if (registro[0].soporte  != "") {
			var archivo = "evoHR/SoportesAusencias/"+registro[0]._id + registro[0].soporte

			mAusencias.remove(eliminar)
			    .then((eliminar)=>{
			    	res.status(200).send({
						message: "El Registro se ha eliminado correctamente"
					})
			    	Ftp.raw("DELE",archivo, function(err, data) {
					    if (err) return console.error(err);
					    console.log(data.text);
					});
			    })
			    .catch((err)=>{
					res.status(500).send({
						error: err
					});
			    })
		}else{
			mAusencias.remove(eliminar)
			.then((eliminar)=>{
				res.status(200).send({
					message: "El Registro se ha eliminado correctamente"
				})
			})

			.catch((err)=>{
				res.status(500).send({
						error: err
				});
			})
		}
	})
	.catch((err)=>{
		res.status(500).send({
			error: err
		});
	})
})

module.exports = routerAusencias;
