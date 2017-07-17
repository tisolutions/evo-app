var express = require("express");
var ruteroPrincipal = express.Router();
var fs = require("fs");

ruteroPrincipal.get("/usuario/registro",function(req,res,next){
	res.render("V.Usuarios/registrarUsuarios.html");
});

ruteroPrincipal.get("/evohr",function(req,res,next){
	res.render("V.Comun/evoHR.html");
});

ruteroPrincipal.get("/login",function(req,res,next){
	res.render("V.Comun/login.html");
});

ruteroPrincipal.get("/micuenta",function(req,res,next){
	res.render("V.Usuarios/miCuenta.html");
});

ruteroPrincipal.get("/institucion",function(req,res,next){
	res.render("V.Institucion/index.html");
});

ruteroPrincipal.get("/prestacion",function(req,res,next){
	res.render("V.Prestacion/index.html");
});

ruteroPrincipal.get("/detallePrestacion",function(req,res,next){
	res.render("V.Prestacion/detalleIndex.html");
});


module.exports = ruteroPrincipal;
