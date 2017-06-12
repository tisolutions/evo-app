'use strict'

// COnfiguración de Express
const express = require('express')
const path = require('path')
const fs = require('fs')
const bodyParser = require('body-parser')
const CookieSession = require('cookie-session')


// Ruteros para la aplicación
const router = require("./routes/cb.rutas")
const userSession = require("./Controlador/cBackend/cb.userSession")
const routerUsuario = require("./Controlador/cBackend/controllerUsuario")
const routerConfigContract = require("./Controlador/cBackend/cb.conf-Contrato")
const routerContrato = require("./Controlador/cBackend/cb.contrato")
const routerEmpresa = require("./Controlador/cBackend/cb.empresa")
const routerBonificacionDescuento = require("./Controlador/cBackend/cb.bonificacion-descuento")
const routerAusencias = require("./Controlador/cBackend/cb.ausencias")

const app = express()

app.engine('html', require('ejs').renderFile);
app.set('views', path.join(__dirname, 'Vista'));

app.use(bodyParser.urlencoded({ extended: false}))
app.use(bodyParser.json())

// Rutas Estaticas
app.use("/",express.static("./Recursos"))
app.use("/",express.static("./uploads"))
app.use("/",express.static("./Controlador"))
app.use("/",express.static("./Vista"))

app.use(function(req,res,next){
	res.header("Access-Control-Allow-Origin", "*")
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, sid")
	res.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE, PUT")
	next()
})

app.use(CookieSession({
  name: 'session',
  keys: ['cualquier_cosa'],

 // Cookie Options
  maxAge: 24 * 60 * 60 * 1000 // 24 hours 
}))

app.use("/",router)
app.use("/",routerUsuario)
app.use("/",routerConfigContract)
app.use("/",routerContrato)
app.use("/",routerEmpresa)
app.use("/",routerBonificacionDescuento)
app.use("/",routerAusencias)
app.use("/",userSession)

app.get("/",function(req,res){
	res.redirect("/evohr");
});
app.get("/evohr/login",function(req,res){
    res.render("V.Comun/login.html");
});


module.exports = app;