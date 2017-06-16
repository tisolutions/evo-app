'use strict'

const mBonifDes = require('../../models/mBonificacion-Descuento')
const mUsuario = require('../../models/mUsuarios')
var express = require("express");
var routerBonificacionDes = express.Router();
var multer = require('multer')
var upload = multer({dest: 'uploads/SoportesBonificaciones_Descuentos'})
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

	if (req.files.length > 0) {
		var archivo = req.files[0].originalname
		archivo = archivo.substring(archivo.lastIndexOf('.'))
	}else{
		var archivo = "";
	}

	// console.log(req.body.idEmpleado)

	var data = new mBonifDes({
      valor: req.body.valor,
      fechaSuceso: new Date(req.body.fechaSuceso),
      descripcion: req.body.descripcion,
      tipo: req.body.tipo,
	  empleado: req.body.idEmpleado,
	  soporte: archivo
    });

 	data.save()
	.then((bonifDes)=>{
		if (req.files.length > 0) {
			req.files.forEach(function(file){
				var ext = file.originalname;
          		ext = ext.substring(ext.lastIndexOf('.'))

				var filename = bonifDes._id+ ext;
				var remotePath = 'evoHR/SoportesBonificaciones_Descuentos/'+filename
				console.log(remotePath)

				Ftp.put(file.path, remotePath, function(hadError) {
	              if (!hadError)
	                console.log("File transferred successfully!");
	            	res.status(200).send({
						BonificacionDescuento: bonifDes
					});
	          	});
			});
		}else{
			res.status(200).send({
				BonificacionDescuento: bonifDes
			});
		}
	})

	.catch((error)=>{
        res.status(500).send(error);
	})
})


.put(upload.any(), function(req,res){
	let BonDesId = req.body.id

	if (req.files.length > 0) {
		var archivo = req.files[0].originalname
		archivo = archivo.substring(archivo.lastIndexOf('.'))
		req.body.soporte = archivo

		var body = new mBonifDes({
			valor: req.body.valor,
		    fechaSuceso: new Date(req.body.fechaSuceso),
		    descripcion: req.body.descripcion,
		    tipo: req.body.tipo,
			empleado: req.body.idEmpleado,
			soporte: archivo,
			_id: BonDesId
		})

	}else{
		var body = new mBonifDes({
			valor: req.body.valor,
		    fechaSuceso: new Date(req.body.fechaSuceso),
		    descripcion: req.body.descripcion,
		    tipo: req.body.tipo,
			empleado: req.body.idEmpleado,
			_id: BonDesId
		})
	}

	mBonifDes.findByIdAndUpdate(BonDesId, body)
	.then((boniDes) =>{
		if (req.files.length > 0) {
			req.files.forEach(function(file){
				var ext = file.originalname;
          		ext = ext.substring(ext.lastIndexOf('.'))
				var filename = BonDesId+ ext;
				var remotePath = 'evoHR/SoportesBonificaciones_Descuentos/'+filename
				console.log(remotePath)

				Ftp.put(file.path, remotePath, function(hadError) {
				  if (!hadError)
				    console.log("File transferred successfully!");
					res.status(200).send({
						BonificacionDescuento: boniDes
					});
				});
			});
		}else{
			res.status(200).send({
				BonificacionDescuento: boniDes
			});
		}
	})

	.catch((err)=>{
		res.status(500).send(err);
	})
})


.delete(function(req,res){
	var eliminar ={
		_id: req.query.id
	};


	mBonifDes.find(eliminar)
	.then((registro)=>{
		if (registro[0].soporte  != "") {
			var archivo = "evoHR/SoportesBonificaciones_Descuentos/"+registro[0]._id + registro[0].soporte

			mBonifDes.remove(eliminar)
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
			mBonifDes.remove(eliminar)
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

	.catch((done)=>{
		res.status(500).send({
			message: "Ha ocurrido un error al eliminar"
		})
	})
})

module.exports = routerBonificacionDes;
