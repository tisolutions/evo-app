'use strict'
const mUsuario = require('../../models/mUsuarios')
const mContrato = require('../../models/mContratos')

var express = require("express")
var routerUsuario = express.Router()
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


routerUsuario.route("/autocomplete/empleado")
.post(function(req, res){

		var regexValue='\.*'+req.body.nombre+'\.*';
		mUsuario.findOne({"primerNombre":new RegExp(regexValue, 'i')})
		// mUsuario.find({primerNombre: /req.body.nombre/})
		// mUsuario.findOne({
	    // primerNombre: req.body.nombre
	  // })
		.then((doc)=> {
		     var returnUsuario =[
						 {
							 id: doc._id,
							 correoElectronico: doc.correoElectronico,
							 usuario: doc.usuario,
							 primerNombre: doc.primerNombre+ " " +doc.primerApellido,
							 primerApellido: doc.primerApellido,
							 sexo: doc.sexo,
							 error: ""
						 }
					 ];
		     res.status(200).send(returnUsuario)
		});
});

routerUsuario.route("/evohr/")
.post(function(req,res){
	mUsuario.findOne({
        correoElectronico: req.body.correoElectronico,
        contrasena: req.body.contrasena
    })

	.then((doc)=> {
			// console.log(doc);
	     req.session.usuarioId = doc._id;
	     req.session.correoElectronico = doc.correoElectronico;
	     req.session.usuario = doc.primerNombre+" "+doc.primerApellido;

	     var returnUsuario = {
	              usuarioId: doc._id,
	              correoElectronico: doc.correoElectronico,
	              usuario: doc.usuario,
	              primerNombre: doc.primerNombre,
	              primerApellido: doc.primerApellido,
	              sexo: doc.sexo,
	              error: ""
	      };
	     res.status(200).send(returnUsuario)
	})

	.catch((err)=>{
		//console.log(err)
		res.send({
             error: "La contraseña y/o el usuario no coinciden"
        });
	})
});

routerUsuario.route("/logout")
.post(function(req,res,next){
	if (req.session.usuarioId == req.body.id) {
		req.session.usuarioId = null
		req.session.correoElectronico = null
		req.session.usuario = null
		//console.log(req.session.usuarioId)

	    res.status(200).send(req.session)
	}else{
		res.status(500).send({
			error : "Error de sesiones"
		})
	}
});

routerUsuario.route("/usuarios/edicion")
.get(function(req,res){
	//console.log(req.query.id)
	let usuarioId = req.query.id
	//console.log(usuarioId);

	mUsuario.findById(usuarioId)
	.then((usuario)=>{
		mContrato.populate(usuario, {path: "contratoUsuario"})
		.then((contrato)=>{
			res.status(200).send(usuario);
		})
	})

	.catch((err) =>{
		res.status(500).send({
			message: `Error al realizar la petición: ${err}`
		})
	})
});

routerUsuario.route("/usuarios")
.get(function(req,res){
	var filtro = {
      estado: "activo"
    };

	mUsuario.find(filtro)
	.then((userAll) =>{
		mContrato.populate(userAll, {path: "contratoUsuario"})
		.then((contract)=>{
			res.send(contract)
		})
	})

	.catch((err) =>{
		message: "Error al tratar de traer los registros"
	});
})

.delete(function(req,res){
	console.log(req.query.id);
	var id = {_id: req.query.id};
	var update = {
		estado: "inactivo"
	};

	mUsuario.update(id, update)

	.then((done)=>{
		res.status(200).send({
			message: "El Usuario se ha eliminado correctamente"
		})
	})

	.catch((done)=>{
		res.status(500).send({
			message: "Ha ocurrido un error al eliminar"
		})
	})
})

.post(upload.any(), function(req,res){
	console.log(req.body)

	var data = new mUsuario({
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
      // usuario: req.body.usuario,
      contrasena: req.body.contrasena,
      estado: "activo"
    });

    data.save()
	.then((user)=>{
		if (req.files) {
			req.files.forEach(function(file){
				var filename = user._id+".jpg";
				var remotePath = 'evoHR/userFace/'+filename;

				Ftp.put(file.path, remotePath, function(hadError) {
				  if (!hadError)
				    console.log("File transferred successfully!");
					// Ftp.chmod(remotePath, 511);
					res.status(200).send({
						usuario: user
					});
				});
			});
		}

		// res.status(200).send({
		// 	usuario: user
		// });
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

	mUsuario.findByIdAndUpdate(usuarioId, body)
	.then((user) =>{
		if (req.files.length > 0) {
			req.files.forEach(function(file){
				var filename = usuarioId+".jpg";
				var remotePath = 'evoHR/userFace/'+filename;

				Ftp.put(file.path, remotePath, function(hadError) {
				  if (!hadError)
				    console.log("File transferred successfully!");
					// fs.chmod(file.path, 511);
					res.status(200).send({
						usuario: user
					});
				});
			});
		}else{
			res.status(200).send({
				usuario: user
			});
		}
	})

	.catch((err)=>{
		res.status(500).send(error);
	})
})

routerUsuario.route("/usuarios/busqueda")
.get(function(req,res){
		var filtro = {};

	    switch (req.query.tipoBusqueda) {
	    	case "name":
		    	var keyword = req.query.keyword
		        var nombres = keyword.split("-")
		        var vectorConsulta = new Array()

		        for (var k = nombres.length - 1; k >= 0; k--) {
	                vectorConsulta.push({primerNombre: {$regex: nombres[k] ,  $options:"i"}});
	                vectorConsulta.push({segundoNombre: {$regex: nombres[k] ,  $options:"i"}});
	                vectorConsulta.push({primerApellido: {$regex: nombres[k] ,  $options:"i"}});
	                vectorConsulta.push({segundoApellido: {$regex: nombres[k] ,  $options:"i"}});
        		}

        		filtro ={$or: vectorConsulta}

        		mUsuario.find(filtro)
				.then((userAll) =>{
					mContrato.populate(userAll, {path: "contratoUsuario"})
					.then((contract)=>{
						res.send(contract)
					})
				})

				.catch((err) =>{
					message: "Error al tratar de traer los registros"
				});
	    	break;

	    	case "contract":
	    		var keyword = req.query.keyword;
        		var nombres = keyword.split("-")
        		var vectorCodContrato = new Array();
        		var vectorIdentificadores = new Array();
        		var codContrato;

        		for (var k = nombres.length - 1; k >= 0; k--) {
	                vectorCodContrato.push({codContrato : {$regex:nombres[k],$options:"i"}});
        		}

        		codContrato = {$or: vectorCodContrato}
				mContrato.find(codContrato,"_id")
				.then((contratos)=>{
					for (var i = contratos.length - 1; i >= 0; i--) {
      			        vectorIdentificadores.push(contratos[i]._id);
              		}
              		filtro = {contratoUsuario: {$in: vectorIdentificadores}}
              		mUsuario.find(filtro)
              		.then((usuario)=>{
              			mContrato.populate(usuario, {path: "contratoUsuario"})
						.then((contrato)=>{
							res.status(200).send(usuario);
						})
              		})
				})
				.catch((err) =>{
					message: "Error al tratar de traer los registros"
				});
	    	break;

	    	case "occupation":
	    		var keyword = req.query.keyword;
        		var nombres = keyword.split("-")
        		var vectorCargo = new Array();
        		var vectorIdentificadores = new Array();
        		var cargo;

        		for (var k = nombres.length - 1; k >= 0; k--) {
	                vectorCargo.push({cargo : {$regex:nombres[k],$options:"i"}});
        		}

        		cargo = {$or: vectorCargo}
				mContrato.find(cargo,"_id")
				.then((contratos)=>{
					for (var i = contratos.length - 1; i >= 0; i--) {
      			        vectorIdentificadores.push(contratos[i]._id);
              		}
              		filtro = {contratoUsuario: {$in: vectorIdentificadores}}
              		mUsuario.find(filtro)
              		.then((usuario)=>{
              			mContrato.populate(usuario, {path: "contratoUsuario"})
						.then((contrato)=>{
							res.status(200).send(usuario);
						})
              		})
				})
				.catch((err) =>{
					message: "Error al tratar de traer los registros"
				});
	    	break;
	    }
})



module.exports = routerUsuario;
