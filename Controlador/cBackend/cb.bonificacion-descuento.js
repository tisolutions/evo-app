'use strict'

const mBonifDes = require('../../models/mBonificacion-Descuento')
const mUsuario = require('../../models/mUsuarios')
var express = require("express");
var routerUsuario = express.Router();
var multer = require('multer')
var upload = multer({dest: 'uploads/SoportesBonificaciones_Descuentos'})
var fs = require('fs')
var path = require('path')


routerUsuario.route("/bonificaciones-descuentos")
.get(function(req,res){

	mBonifDes.find()
	.then((bonDes) =>{
		mUsuario.populate(bonDes, {path: "contratoUsuario"})
		.then((doc)=>{
			res.send(doc)
		})
	})

	.catch((err) =>{
		message: "Error al tratar de traer los registros"
	});
})

// .delete(function(req,res){
// 	var update = {
// 		estado: "inactivo"
// 	};

// 	mBonifDes.update(update)

// 	.then((done)=>{
// 		res.status(200).send({
// 			message: "El Usuario se ha eliminado correctamente"
// 		})
// 	})

// 	.catch((done)=>{
// 		res.status(500).send({
// 			message: "Ha ocurrido un error al eliminar"
// 		})
// 	})
// })

.post(upload.any(), function(req,res){

	var data = new mBonifDes({
      primerNombre: req.body.primerNombre,
      segundoNombre: req.body.segundoNombre,
      primerApellido: req.body.primerApellido,
      segundoApellido: req.body.segundoApellido,
      tipoIdentificacion: req.body.tipoIdentificacion,
      identificacion: req.body.identificacion,
      sexo: req.body.sexo,
      fch_nacimiento: req.body.fch_nacimiento,
      direccion: req.body.direccion,
      telefono: req.body.telefono,
      celular: req.body.celular,
      correoElectronico: req.body.correoElectronico,
      usuario: req.body.usuario,
      contrasena: req.body.contrasena,
      estado: "activo"
    });

    data.save()
	.then((user)=>{
		if (req.files) {
			req.files.forEach(function(file){
				var filename = user._id+".jpg";
				fs.rename(file.path,'uploads/userFace/'+filename)
			});
		}

		res.status(200).send({
			usuario: user
		});
	})

	.catch((error)=>{
        res.status(500).send({
        	error : error
        });
	})
})

.put(upload.any(), function(req,res){

	let usuarioId = req.body.id
	let body = req.body

	mBonifDes.findByIdAndUpdate(usuarioId, body)
	.then((user) =>{
		if (req.files) {
			req.files.forEach(function(file){
				var filename = usuarioId+".jpg";
				fs.rename(file.path,'uploads/userFace/'+filename)
			});
		}
		res.status(200).send({
			usuario: user
		});
	})

	.catch((err)=>{
		res.status(500).send(error);
	})
})

module.exports = routerUsuario;
