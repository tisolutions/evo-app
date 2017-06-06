'use strict'

const mAusencias = require('../../models/mAusencias')
const mUsuario = require('../../models/mUsuarios')
var express = require("express");
var routerAusencias = express.Router();
var multer = require('multer')
var upload = multer({dest: 'uploads/SoportesAusencias'})
var fs = require('fs')
var path = require('path')


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
	
	var data = new mAusencias({
      fechaSuceso: req.body.fechaSuceso,
      descripcion: req.body.descripcion,
      tipo: req.body.tipo,
      remunerado: req.body.remunerado,
      hora: req.body.hora
    });

    data.save()
	.then((Ause)=>{
		if (req.files) {
			req.files.forEach(function(file){
				var filename = Ause._id+".jpg"
				fs.rename(file.path,'uploads/SoportesAusencias/'+filename)
			});
		}

		res.status(200).send({
			Ausencia: Ause
		});
	})

	.catch((error)=>{
        res.status(500).send({
        	error : error
        });
	})
})
.put(upload.any(), function(req,res){

	let AuseSelec = req.body.id
	let body = req.body

	mAusencias.findByIdAndUpdate(AuseSelec, body)
	.then((Aus) =>{
		if (req.files) {
			req.files.forEach(function(file){
				var filename = AuseSelec+".jpg";
				fs.rename(file.path,'uploads/SoportesBonificaciones_Descuentos/'+filename)
			});
		}
		res.status(200).send({
			Ausencia: Aus
		});
	})

	.catch((err)=>{
		res.status(500).send({
			error: err
		});
	})
})
.delete(function(req,res){
	var eliminar ={
		_id: req.body.id
	};

	mAusencias.remove(eliminar)
	.then((done)=>{
		res.status(200).send({
			message: "El Registro se ha eliminado correctamente"
		})
	})

	.catch((done)=>{
		res.status(500).send({
			message: "Ha ocurrido un error al eliminar"
		})
	})
})

module.exports = routerAusencias;
