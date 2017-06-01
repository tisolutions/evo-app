const express = require("express");
const TipContrato = require("../../models/m.conf-tipoContrato")
const Cargo = require("../../models/m.conf-cargo")
const TipSalario = require("../../models/m.conf-tipoSalario")
const CicloFactura = require("../../models/m.conf-cicloFacturacion")
const mUsuario = require("../../models/mUsuarios")
const mContrato = require("../../models/mContratos")
const routerTipoContrato = express.Router();

routerTipoContrato.route("/tipoContrato")
  .get(function(req, res) {
    var filtrosJson = [];
    if (req.fields.nombre) {
      filtrosJson.push({
        nombre: new RegExp(".[" + req.fields.nombre + "]+")
      });
    }
    modeloTipoContrato.find(filtrosJson, function(error, tipoContrato) {
      if (error) {
        res.send({
          error: error
        });
      }
      res.send({
        tiposContratos: tipoContrato
      });
    });
  })
  .post(function(req, res) {

    var data = new TipContrato({
      nombre: req.body.nombre,
      descripcion: req.body.descripcion
    });

    data.save()
      .then((config) =>{
        res.status(200).send(config);
      })

      .catch((error)=>{
          res.status(500).send(error);
      })
  });

routerTipoContrato.route("/cargo")
.post(function(req, res) {

    var data = new Cargo({
      nombre: req.body.nombre,
      descripcion: req.body.descripcion
    });

    data.save()
      .then((config) =>{
        res.status(200).send(config);
      })

      .catch((error)=>{
          res.status(500).send(error);
      })
})

routerTipoContrato.route("/tipoSalario")
.post(function(req,res){
  var data = new TipSalario({
      nombre: req.body.nombre,
      descripcion: req.body.descripcion
    });

    data.save()
      .then((config) =>{
        res.status(200).send(config);
      })

      .catch((error)=>{
          res.status(500).send(error);
      })
})

routerTipoContrato.route("/cicloFacturacion")
.post(function(req,res){
  var data = new CicloFactura({
      nombre: req.body.nombre,
      descripcion: req.body.descripcion
    });

    data.save()
      .then((config) =>{
        res.status(200).send(config);
      })

      .catch((error)=>{
          res.status(500).send(error);
      })
})

routerTipoContrato.route("/listadoOpciones")
.get(function(req, res) {
  var listadoDatos = [];
  var contrato = [];
  var ciclo = [];
  var cargoList = [];
  var salario = [];

    TipContrato.find([], function(error, tipoContrato) {
        if (error) {
          listadoDatos.push({
            tiposContratos: "tipoContrato"
          });
        }else{
          for (var i = 0; i < tipoContrato.length; i++) {
            contrato.push(tipoContrato[i]);
          }
          listadoDatos[0] = {
            tiposContratos: contrato
          };
        }
    });

    CicloFactura.find([], function(error, cicloFacturacion) {
        if (error) {

        }else{
          for (var i = 0; i < cicloFacturacion.length; i++) {
              ciclo.push(cicloFacturacion[i]);
          }
          listadoDatos[1] = {
            ciclos: ciclo
          };
        }
    });

    Cargo.find([], function(error, cargo) {
        if (error) {

        }else{
          for (var i = 0; i < cargo.length; i++) {
            cargoList.push(cargo[i]);
          }
          listadoDatos[2] = {
            cargos: cargoList
          };
        }
    });

    TipSalario.find([], function(error, tipoSalario) {
        if (error) {

        }else{
          for (var i = 0; i < tipoSalario.length; i++) {
            salario.push(tipoSalario[i]);
          }
          listadoDatos[3] = {
            tipoSalarios: salario
          };
        }
    });

    mContrato.find([], function(error, contrato){
        listadoDatos[4] = {
          ultimoContrato: contrato
        };
    }).sort({_id:-1}).limit(1);

    mUsuario.findById(req.query.id).exec(function(error, usuario) {
        mContrato.populate(usuario, {path: "contratoUsuario"},function(error, usuario){
          if (usuario !== null) {
            listadoDatos[5] = {
              usuario: usuario
            };
            return res.send({
              datos: listadoDatos
            });
          }
        });
    });
})



// routerTipoContrato.route("/tipoContrato/edicion")
//   .get(function(req, res) {
//     modeloTipoContrato.findById(req.query.id).exec(function(error, tipoContrato) {
//       if (tipoContrato !== null) {
//         res.send(tipoContrato);
//       } else {
//         res.send({
//           error: error
//         });
//       }
//     });
//   })
//   .put(function(req, res) {
//     modeloTipoContrato.findById(req.query.id).exec(function(error, tipoContrato) {
//       if (error) {
//         res.send({
//           error: error
//         });
//       } else {
//         if (req.fields.nombre) {
//           tipoContrato.nombre = req.fields.nombre;
//         }
//         if (req.fields.codigo) {
//           tipoContrato.codigo = req.fields.codigo;
//         }
//         if (req.fields.descripcion) {
//           tipoContrato.descripcion = req.fields.descripcion;
//         }

//         tipoContrato.save(function(err) {
//           if (err) {
//             res.send({
//               error: err
//             });
//           } else {
//             res.send(tipoContrato);
//           }
//         });
//       }
//     });
//   });

module.exports = routerTipoContrato;
