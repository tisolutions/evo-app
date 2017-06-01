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
ruteroPrincipal.get("/resultadoBusqueda",function(req,res,next){
	res.render("V.Usuarios/resultadoBusqueda.html");
});

module.exports = ruteroPrincipal;
