var usuario = angular.module('Usuario',["ngRoute","ngCookies"]);

// Aqui cofiguro el enrutamiento
//factoria que controla la autentificación, devuelve un objeto
//$cookies para crear cookies
//$cookieStore para actualizar o eliminar
//$location para cargar otras rutas


// Código para normalizar cadenas enviadas por url

var normalize = (function() {
  var from = "ÃÀÁÄÂÈÉËÊÌÍÏÎÒÓÖÔÙÚÜÛãàáäâèéëêìíïîòóöôùúüûÑñÇç",
      to   = "AAAAAEEEEIIIIOOOOUUUUaaaaaeeeeiiiioooouuuunncc",
      mapping = {};
  for(var i = 0, j = from.length; i < j; i++ )
      mapping[ from.charAt( i ) ] = to.charAt( i );
  return function( str ) {
      var ret = [];
      for( var i = 0, j = str.length; i < j; i++ ) {
          var c = str.charAt( i );
          if( mapping.hasOwnProperty( str.charAt( i ) ) )
              ret.push( mapping[ c ] );
          else
              ret.push( c );
      }
     return ret.join( '' ).replace( /[^-A-Za-z0-9]+/g, '-' ).toLowerCase();
  }
})();

// El factory sesionesControl, contiene las funciones para crear la sesion
usuario.factory("sesionesControl", function(){
    return{
        get: function(key){
            return localStorage.getItem(key);
        },
        set: function(key,val){
            return localStorage.setItem(key,val);
        },
        getList: function(key){
            return JSON.parse(localStorage.getItem(key));
        },
        setList: function(key,list){
            return localStorage.setItem(key, JSON.stringify(list));
        },
        unset: function(key){
            return localStorage.removeItem(key);
        },
        clear: function(){
            return localStorage.clear();
        }
    }
});

usuario.factory("auth", function($cookies,$cookieStore,$location, sesionesControl){
	// Se hace el llamado del factory sesionesControl, el cual nos facilita la creacion de la sesion
	// funcion cacheSession nos crea la instancia de la sesion
	var cacheSession = function(datos){
    sesionesControl.set("usuarioLogin", true);
		// Guardamos los datos del usuario en un objeto JavaScript
		var usuario = {
	        usuario: datos.usuario,
	        _id: datos.usuarioId,
			correoElectronico: datos.correoElectronico,
					primerNombre: datos.primerNombre,
					primerApellido: datos.primerApellido,
					sexo: datos.sexo
					// segundoNombre: datos.segundoNombre,
					// segundoApellido: datos.segundoApellido,
					// direccion: datos.direccion,
					// fch_nacimiento: datos.fch_nacimiento,
					// usuario: datos.usuario,
					// telefono: datos.telefono,
					// celular: datos.celular,
					// tipoUsuario: datos.tipoUsuario
	  	};

	    sesionesControl.setList("usuario", usuario);
	  }
	  var unCacheSession = function(){
	    sesionesControl.unset("usuarioLogin");
	    sesionesControl.unset("usuario");
	  }

	// funciones de login y logout
	return{
		 login : function(data)
        {
					//Llamamos a la funcion cacheSession para instanciar la sesion
					cacheSession(data);
					sesionesControl.unset("mensaje");
					return true;
        },
        logout : function()
        {
						sesionesControl.clear();
            			sesionesControl.setList("mensaje", {texto:"¡Hasta pronto!", tipo:"success"});
						return true;
        },
        checkStatus : function()
        {
            //creamos un array con las rutas que queremos controlar
            var rutasPrivadas = ["/evohr","/login"];
            if(this.in_array($location.path(),rutasPrivadas) && typeof($cookies.username) == "undefined")
            {
                $location.path("/login");
            }
            //en el caso de que intente acceder al login y ya haya iniciado sesión lo mandamos a la home
            if(this.in_array("/login",rutasPrivadas) && typeof($cookies.username) != "undefined")
            {
                $location.path("/home");
            }
        },
        in_array : function(needle, haystack)
        {
            var key = '';
            for(key in haystack)
            {
                if(haystack[key] == needle)
                {
                    return true;
                }
            }
            return false;
        }
	}
});

usuario.config(['$routeProvider','$locationProvider', '$qProvider', function($routeProvider, $locationProvider, $qProvider) {
  // $qProvider.errorOnUnhandledRejections(false);
	$routeProvider
	.when('/micuenta',{
	    templateUrl: '../V.Usuarios/miCuenta.html',
	    controller: 'controllerActualizarUsuarios'
	})
	.when('/empleados',{
	    templateUrl: '../V.Usuarios/listadoEmpleados.html',
	    controller: 'controllerListUsuarios'
	})
	.when('/contratos',{
	    templateUrl: '../V.Contrato/configContrato.html'
	})
	.when('/RegistroEmpleados',{
	    templateUrl: '../V.Usuarios/registrarUsuarios.html',
	    controller: 'controllerRegistro'
	})
	.when('/actualizacionEmpleados/:usuarioId',{
	    templateUrl: '../V.Usuarios/registrarUsuarios.html',
	    controller: 'controllerRegistro'
	})
	.when('/resultadoBusqueda/:tipoBusqueda/:keyword',{
	    templateUrl: '../V.Usuarios/resultadoBusqueda.html',
	    controller: 'controllerBusqueda'
	})
	.otherwise('/',{
	    redirectTo :'/'
	})
	.when('/',{
	    templateUrl: '../V.Comun/Home.html',
	    controller: 'controllerHome'
	});
}])



usuario.controller('controllerLogin', ['$scope','$http', '$location', "auth", "sesionesControl", function($scope, $http, $location, auth, sesionesControl){
	$scope.usuarios = [];
	if (sesionesControl.get("usuarioLogin")) {
		// Capturamos los datos del usuario alojados en la cookie
		var usuarioExtraido = sesionesControl.get("usuario");
		// Convertimos al usario en un objeto JavaScript
		usuarioExtraido = JSON.parse(usuarioExtraido);
		$scope.usuario = usuarioExtraido.usuario;
		$scope._id = usuarioExtraido._id;
	}

	$scope.loginUsuarios = function(){
	    $http.post("/evohr/",{
	  			correoElectronico: $scope.usuarios.correoElectronico,
	  			contrasena: $scope.usuarios.contrasena
	  	})
	  	.then(function(response,status,headers,config){
	  			// //console.log(response);
	  			if(response.data.error==""){
	  				var promise = auth.login(response.data);
	  				//Redireccionamos al home
	  				location.href = "/evohr#!/";
	  			}else{
	  				swal("Verifica tus datos!", response.data.error, "error");
	  			}
	  	})

	  	.catch(function(response,status){
	  		alert('error');
	  	})
	}

	$scope.logoutUsuarios = function(){

		// Capturamos los datos del usuario alojados en la cookie
		var usuarioExtraido = sesionesControl.get("usuario");
		usuarioExtraido = JSON.parse(usuarioExtraido);
		//console.log(usuarioExtraido._id)
		$http.post("/logout",{
			id: usuarioExtraido._id
		})
		.then(function(response,status,headers,config){
			//console.log(response)
				var respuesta = auth.logout();
				location.href = "/login";
		})

		.catch(function(response,status){
			swal("Error", response.data, "error");
		});
	}

	$scope.verUsuario = function(usuarioId){
		$location.path("/actualizacionEmpleados/" + usuarioId);
	}
}])

usuario.controller('controllerEmpresa', ['$scope', function($scope){
	$scope.empresa =[];
}])

usuario.controller('controllerHome', ['$scope', "auth", "sesionesControl", function($scope, auth, sesionesControl){
	// $scope.usuario = [];
	var fecha = new Date();
	var options = { year: 'numeric', month: 'long', day: 'numeric' };
	$scope.hoy = fecha.toLocaleDateString("es-ES", options);

	if (sesionesControl.get("usuarioLogin")) {
		// Capturamos los datos del usuario alojados en la cookie
		var usuarioExtraido = sesionesControl.get("usuario");
		// Convertimos al usario en un objeto JSON para manejarlo

		var json = JSON.parse(usuarioExtraido);

		$scope.name = json.primerNombre+" "+json.primerApellido;
		$scope._id = json.usuario._id;

		if (json.sexo=="M") {
			$scope.oa = "o";
		}else{
			$scope.oa = "a";
		}
	}
}])

usuario.controller('controllerRegistro', ['$scope','$http','$location', '$routeParams', function(s,$http, $location, $routeParams){
	// Angular envia los datos del formulario a Node mediante este metodo para registrar un usuario
  s.usuarios = {};
  s.btnCrearContrato = true;
  s.btnActualizarContrato = false;
	s.RegistrarUsuario = function(){
		if(!document.getElementById("avatar-upload").value.length==0){
			if (/.(jpg|JPG)$/i.test(document.getElementById("avatar-upload").value)){
					var uploadUrl = '/usuarios';

					var formData = new FormData()

					for (key in s.usuarios) {
						formData.append(key,s.usuarios[key]);
					}

					var file = $("#avatar-upload")[0].files[0];
					formData.append("foto",file);

					$http.post(uploadUrl,formData,{
						transformRequest: angular.identity,
						headers:{
							'Content-Type': undefined
						}
					})

					.then(function(response,status,headers,config){
						// s.usuarios = {};
						console.log(response)
						if(response.data.usuario._id !=""){
							swal("Felicitaciones", "Hemos guardado tus datos", "success");
							$location.path("/empleados");
						}else{
							swal("Verifica tus datos!", response.data.error, "warning");
						}
					})

					.catch(function(response,status){
						console.log()
						swal("Error", response.data, "error");
					});

			    }else{
			    	swal("Error!", "La imagen de perfil de usuario es obligatoria, comprueba la extensión de su imágen, recuerda que el formato aceptados es .jpg ", "error");
					return false;
			    }
		}else{
			swal("Error!", "La imagen de perfil de usuario es obligatoria, comprueba la extensión de su imagen recuerda que el formato aceptados es .jpg ", "error");
			return false;
		}
	}

	// Angular envia los datos del formulario a Node mediante este metodo para actualizar un usuario

	s.ActualizarUsuario = function(){

		if(!document.getElementById("avatar-upload").value.length==0){
			if (/.(jpg|JPG)$/i.test(document.getElementById("avatar-upload").value)){
					// Se envia el formulario con foto adjunta para modificar un usuario
					var uploadUrl = '/usuarios';
					var formData = new FormData()

					for (key in s.usuarios) {
						formData.append(key,s.usuarios[key]);
					}

					var file = $("#avatar-upload")[0].files[0];
							formData.append("foto",file);

					$http.put(uploadUrl,formData,{
						transformRequest: angular.identity,
							headers:{
								'Content-Type': undefined
							}
					})

					.then(function(response,status,headers,config){
						if(response.data.usuario._id !=""){
								swal({
									title: "Usuario Modificado",
									text: "Hemos guardado tus datos",
									type: "success",
									showCancelButton: false,
									confirmButtonColor: "#00b3e2",
									 closeOnConfirm: true,
									},
									function(isConfirm){
									  location.href = "/";
								});
						}else{
							swal("Verifica tus datos!", response.data.error, "warning");
						}
					})

					.catch(function(response,status){
						swal("Error", response.data, "error");
					});

			    }else{
			    	swal("Error!", "Si desea modificar la foto de este usuario recuerde que el formato aceptados es .jpg ", "error");
					return false;
			    }
		}else{
			// Se envia el formulario sin foto adjunta para modificar un usuario
			var uploadUrl = '/usuarios';
			var formData = new FormData()

			for (key in s.usuarios) {
				formData.append(key,s.usuarios[key]);
			}

			$http.put(uploadUrl,formData,{
				transformRequest: angular.identity,
					headers:{
						'Content-Type': undefined
					}
			})

			.then(function(response,status,headers,config){
					if(response.data._id !=" "){
						swal({
							title: "Usuario Modificado",
							text: "Hemos guardado tus datos",
							type: "success",
							showCancelButton: false,
							confirmButtonColor: "#00b3e2",
							 closeOnConfirm: true,
							},
							function(isConfirm){
							  location.href = "/";
						});
					}else{
						swal("Verifica tus datos!", response.data.error, "warning");
					}
			})

			.catch(function(response,status){
				swal("Error", response.data, "error");
			});
		}
	}

	s.Cancelar = function(){
	    $location.path("/empleados");
	};

	// Obtenemos la url de la peticion, para habilitar la edicion del usuario
	var url = $location.path();
	if(url.indexOf('/actualizacionEmpleados')!=-1){
		s.mostrar_registrar = false;
		s.mostrar_actualizar = true;
		$http.get("/usuarios/edicion", {
			params: { id: $routeParams.usuarioId }
		})
		.then(function(data,status,headers,config){
	      if(data.data.contratoUsuario){
	        s.btnCrearContrato = false;
	        s.btnActualizarContrato = true;
	        s.idContrato = data.data.contratoUsuario._id;
	      }
			s.usuarios = {
				primerNombre: data.data.primerNombre,
				primerApellido: data.data.primerApellido,
				tipoIdentificacion: data.data.tipoIdentificacion,
				fch_nacimiento:new Date(data.data.fch_nacimiento),
				direccion: data.data.direccion,
				celular: data.data.celular,
				usuario: data.data.usuario,
				segundoNombre: data.data.segundoNombre,
				segundoApellido: data.data.segundoApellido,
				sexo: data.data.sexo,
				identificacion: data.data.identificacion,
				telefono: data.data.telefono,
				correoElectronico: data.data.correoElectronico,
				contrasena: data.data.contrasena,
				id: data.data._id
			};
		});
	}else{
		s.mostrar_registrar = true;
		s.mostrar_actualizar = false;
	}
}])

usuario.controller('controllerListUsuarios', ['$scope', '$http', '$location', function($scope,$http, $location){
	$scope.usuarios = [];
	$http.get("/usuarios")
	.then(function(data,status,headers,config){
		$scope.usuarios = data.data;
	})

	.catch(function(response,status,headers,config){
		console.log("Error")
	})

	$scope.verUsuario = function(usuarioId){
		$location.path("/actualizacionEmpleados/" + usuarioId);
	};

	$scope.buscarRegistro = function(){
		var key = normalize($scope.usuarios.keyword)
		var tipoBusqueda = $scope.usuarios.tipoBusqueda

		$http.get("/usuarios/busqueda", {
			params: {
				tipoBusqueda: tipoBusqueda,
				keyword: key
			}
		})
		.then(function(response,status,headers,config){
			if ((response.data).length > 0) {
				$scope.usuarios = response.data;
			}
  		})

  		.catch(function(response,status,headers,config){
			swal("Intente nuevamente!", response.data.error, "info");
  		});
	}

	$scope.eliminarUsuario = function(usuarioId){

		swal({
		  title: "¿Confirma que desea eliminar este usuario?",
		  text: "No podrá recuperar este usuario",
		  type: "warning",
		  showCancelButton: true,
		  confirmButtonColor: "#DD6B55",
		  confirmButtonText: "Si, eliminalo!",
		  closeOnConfirm: false
		},

		function(){
			//console.log(usuarioId);
			$http.delete("/usuarios/", {
				params: { id: usuarioId }
			})

			.then(function(data,status,headers,config){
				swal({
					title: "Usuario Eliminado!",
					text: "La información del usuario ha sido eliminada.",
					type: "success",
					showCancelButton: false,
					confirmButtonColor: "#DD6B55",
					 closeOnConfirm: true,
					},
					function(isConfirm){
					  location.href = "/";
				});
			})

			.catch(function(data,status,headers,config){
				swal({
					title: "Ups Ocurrio un Error!",
					text: data.message,
					type: "error",
					showCancelButton: false,
					confirmButtonColor: "#DD6B55",
					 closeOnConfirm: true,
					},
					function(isConfirm){
					   location.href = "/";
				});
			})

		});
	}
}]);
