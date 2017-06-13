var express = require("express")
var modeloEmpresa = require("../../models/m.empresa")
var multer = require('multer')
var upload = multer({dest: 'uploads/'})
var fs = require('fs')
var path = require('path')
var routerEmpresa = express.Router()

routerEmpresa.route("/empresas")
.get(function(req, res) {
  modeloEmpresa.find().limit(1)
   .then((empresa) =>{
       res.send(empresa)
   })
   .catch((err) =>{
     message: "Error al tratar de traer los registros"
   });
})

.post(upload.any(), function(req,res){
console.log(req.body)
  var data = new modeloEmpresa({
      nit : req.body.nit,
      direccion : req.body.direccion,
      telefono : req.body.telefono,
      razonSocial : req.body.razonSocial,
      correoElectronico : req.body.correoElectronico,
      paginaweb : req.body.paginaweb
  });

  data.save()
  .then((empresa) =>{

      if (req.files) {
          req.files.forEach(function(file){
          console.log(req.files)
          var ext = file.originalname;
          ext = ext.substring(ext.lastIndexOf('.'));
          var filename = empresa._id+ext;
          fs.rename(file.path,'uploads/empresa/'+filename);
          console.log(file.path,'uploads/empresa/'+filename)
        })
      }
       res.status(200).send(empresa);
  })

  .catch((error)=>{
        res.status(500).send(error);
  })
})

.put(upload.any(), function(req,res){
console.log(req.body)
  let EmpresaId = req.body.id
  let body = req.body

  modeloEmpresa.findByIdAndUpdate(EmpresaId, body)
  .then((empresa) =>{
    if (req.files) {
          req.files.forEach(function(file){
          console.log(req.files)
          var ext = file.originalname;
          ext = ext.substring(ext.lastIndexOf('.'));
          var filename = EmpresaId+ext;
          fs.rename(file.path,'uploads/empresa/'+filename);
          console.log(file.path,'uploads/empresa/'+filename)
        })
      }
    res.status(200).send(empresa);
  })

  .catch((err)=>{
    res.status(500).send({
      error: err
    });
  })
})


module.exports = routerEmpresa;
