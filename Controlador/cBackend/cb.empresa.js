var express = require("express")
var modeloEmpresa = require("../../models/m.empresa")
var multer = require('multer')
var upload = multer({dest: 'uploads/'})
var fs = require('fs')
var path = require('path')
var routerEmpresa = express.Router()

// FTP
const JSFtp = require("jsftp")
const Ftp = new JSFtp({
  host: "107.170.78.97",
  port: 21, // defaults to 21 
  user: "ftpuser", // defaults to "anonymous" 
  pass: "tiein2017" // defaults to "@anonymous" 
})


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

.post(upload.any(),function(req,res){

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
          var ext = file.originalname;
          ext = ext.substring(ext.lastIndexOf('.'));
          var filename = empresa._id+ext;
          var remotePath = 'evoHR/empresa/'+filename;

          Ftp.put(file.path, remotePath, function(hadError) {
              if (!hadError)
                console.log("File transferred successfully!");
                res.status(200).send(empresa);
          });
        })
      }
  })

  .catch((error)=>{
    res.status(500).send(error);
  })
})

.put(upload.any(),function(req,res){
  let EmpresaId = req.body.id
  let body = req.body

  modeloEmpresa.findByIdAndUpdate(EmpresaId, body)
  .then((empresa) =>{
    if (req.files) {
          req.files.forEach(function(file){
          var ext = file.originalname;
          ext = ext.substring(ext.lastIndexOf('.'));
          var filename = EmpresaId+ext;
          var remotePath = 'evoHR/empresa/'+filename;

          Ftp.put(file.path, remotePath, function(hadError) {
              if (!hadError)
                console.log("File transferred successfully!");
              // Ftp.chmod(remotePath, 511);
              res.status(200).send(empresa);
          });
        })
      }
  })

  .catch((err)=>{
    res.status(500).send({
      error: err
    });
  })
})


module.exports = routerEmpresa;
