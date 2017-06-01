var express = require("express");
var modeloContrato = require("../../models/mContratos")
const mUsuario = require('../../models/mUsuarios')
var routerContrato = express.Router();

routerContrato.route("/contratos")
  .post(function(req, res) {
    console.log(req.body)
    var data = new modeloContrato({
      cicloFacturacion: req.body.cicloFacturacion,
      salarioBase: req.body.salarioBase,
      fechaIngreso: req.body.fechaIngreso,
      fechaFinalizacion: req.body.fechaFinalizacion,
      tipoContrato: req.body.tipoContrato,
      tipoSalario: req.body.tipoSalario,
      cargo: req.body.cargo,
      nota: req.body.notasContrato,
      noContrato: req.body.noContrato,
      codContrato: req.body.codContrato
    })
    data.save()
    .then((contract) =>{
      res.status(200).send(contract);
    })

    .catch((error)=>{
      res.status(500).send(error);
    })
  })

  .put(function(req,res){

    let contractId = req.query.id
    let body = req.body
    modeloContrato.findByIdAndUpdate(contractId, body)
    .then((contract) =>{
      res.status(200).send(contract);
    })
    .catch((err)=>{
      res.status(500).send({
        error: err
      });
    })
  });

routerContrato.route("/usuarios/edicion")
  .put(function(req,res){
    //console.log(req.query.id)
    let usuarioId = req.query.id
    let body = {
      contratoUsuario : req.body.contrato
    };

    mUsuario.findByIdAndUpdate(usuarioId, body)
    .then((user) =>{
      res.status(200).send(user);
    })

    .catch((err)=>{
      res.status(500).send(err);
    })
  });

module.exports = routerContrato;
