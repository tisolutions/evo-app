var modeloUsuario = require("../../models/mUsuarios")

module.exports = function(req,res,next){
	console.log("pero estan en lo")
      if(!req.session.usuarioId){
      	console.log("estoy aqui 1")
          res.redirect("/login");
      }else{
      	console.log("estoy aqui 2")
         modeloUsuario.findById(req.session.usuarioId)

         .then((user)=>{
         	res.locals = {user:user};
         	next()
         })

         .catch((err)=>{
         	console.log(err)
         	res.redirect("/login")
         })
      }
};
