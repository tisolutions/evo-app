var modeloUsuario = require("../../models/mUsuarios")

module.exports = function(req,res,next){
      if(!req.session.usuarioId){
          res.redirect("/login");
      }else{
        //  console.log("estoy en 2")
         modeloUsuario.findById(req.session.usuarioId)

         .then((user)=>{
         	res.locals = {user:user};
         	next()
         })

         .catch((err)=>{
         // 	console.log(err)
         	res.redirect("/login")
         })
      }
};
