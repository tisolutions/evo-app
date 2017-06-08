'use strict'

const mBonifDes = require('../../models/mBonificacion-Descuento')
const mUsuario = require('../../models/mUsuarios')
var express = require("express");
var routerBonificacionDes = express.Router();
var multer = require('multer')
var upload = multer({dest: 'uploads/SoportesBonificaciones_Descuentos'})
var fs = require('fs')
var path = require('path')

routerBonificacionDes.route("/bonificacion-descuento")
	.get(function(req, res){
		let boniDescId = req.query.id;
		mBonifDes.findById(boniDescId)
		.then((bonDes)=>{
			mUsuario.populate(bonDes, {path: "empleado"})
			.then((registro)=>{
				res.status(200).send(registro);
			})
		})
		.catch((err) =>{
			res.status(500).send({
				message: `Error al realizar la petición: ${err}`
			})
		})
	});

routerBonificacionDes.route("/bonificaciones-descuentos")
.get(function(req,res){

	mBonifDes.find()
	.then((bonDes) =>{
		// res.send(bonDes)
		mUsuario.populate(bonDes, {path: "empleado"})
		.then((registro)=>{
			res.send(registro)
		})
	})

	.catch((err) =>{
		message: "Error al tratar de traer los registros"
	});
})
.post(upload.any(), function(req,res){
	var data = new mBonifDes({
      valor: req.body.valor,
      fechaSuceso: new Date(req.body.fechaSuceso),
      descripcion: req.body.descripcion,
      tipo: req.body.tipo,
			empleado: req.body.idEmpleado
    });

 	data.save()
	.then((bonifDes)=>{
		if (req.files) {
			req.files.forEach(function(file){
				var filename = bonifDes._id+".jpg";
				fs.rename(file.path,'uploads/SoportesBonificaciones_Descuentos/'+filename)
			});
		}

		res.status(200).send({
			BonificacionDescuento: bonifDes
		});
	})

	.catch((error)=>{
        res.status(500).send(error);
	})
})
.put(upload.any(), function(req,res){
	console.log(req.body);
	let BonDesId = req.body.id
	let body = req.body

	mBonifDes.findByIdAndUpdate(BonDesId, body)
	.then((boniDes) =>{
		if (req.files) {
			req.files.forEach(function(file){
				var filename = BonDesId+".jpg";
				fs.rename(file.path,'uploads/SoportesBonificaciones_Descuentos/'+filename)
			});
		}
		res.status(200).send({
			BonificacionDescuento: boniDes
		});
	})

	.catch((err)=>{
		res.status(500).send(err);
	})
})
.delete(function(req,res){
	var eliminar ={
		_id: req.query.id
	};

	mBonifDes.remove(eliminar)
	.then((done)=>{
		res.status(200).send({
			message: "El registro se ha eliminado correctamente"
		})
	})

	.catch((done)=>{
		res.status(500).send({
			message: "Ha ocurrido un error al eliminar"
		})
	})
})

module.exports = routerBonificacionDes;
