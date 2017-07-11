usuario.config(['$routeProvider','$locationProvider',function($routeProvider, $locationProvider) {
	$routeProvider
	.when('/registroCargoEmpresa',{
	    templateUrl: '../V.Contrato/opcionContrato.html',
	    controller: 'controllerConfiguracionContratoEmpresa'
	})
  .when('/perfilEmpresa',{
      templateUrl: '../V.Empresa/perfilEmpresa.html',
      controller: 'RegistroEmpresa'
  })
  .when('/registroTipoContratoEmpresa',{
	    templateUrl: '../V.Contrato/opcionContrato.html',
	    controller: 'controllerConfiguracionContratoEmpresa'
	})
  .when('/registroTipoSalarioEmpresa',{
	    templateUrl: '../V.Contrato/opcionContrato.html',
	    controller: 'controllerConfiguracionContratoEmpresa'
	})
  .when('/registroCicloFacturacionEmpresa',{
	    templateUrl: '../V.Contrato/opcionContrato.html',
	    controller: 'controllerConfiguracionContratoEmpresa'
	})
	.when('/contratos',{
	    templateUrl: '../V.Contrato/configContrato.html'
	})
	.otherwise('/',{
	    redirectTo :'/'
	});
}])

usuario.controller('RegistroEmpresa', ['$scope','$http', '$location', '$route' , function($scope, $http, $location,$route){
	$scope.empresa = {};
	$scope.mostrarBtnGuardar = true;
	$scope.mostrarBtnActualizar = false;

  $http.get("/empresas")
  .then(function(data,status,headers,config){
    if (data.data[0]) {
      $scope.mostrarBtnGuardar = false;
      $scope.mostrarBtnActualizar = true;

      $scope.empresa = {
        nit: data.data[0].nit,
        direccion: data.data[0].direccion,
        telefono: data.data[0].telefono,
        razonSocial: data.data[0].razonSocial,
        correoElectronico: data.data[0].correoElectronico,
        paginaweb: data.data[0].paginaweb,
        id: data.data[0]._id
      };
    }else{
      swal("Error", response.data, "error");
    }
  })

  .catch(function(response,status,headers,config){
    console.log("Error")
  })

  $scope.guardarEmpresa = function(){
    if(!document.getElementById("avatar-upload").value.length==0){
      if (/.(jpg|JPG)$/i.test(document.getElementById("avatar-upload").value)){

          var uploadUrl = '/empresas';
          var formData = new FormData()

          for (key in $scope.empresa) {
            formData.append(key, $scope.empresa[key]);
            console.log(key, $scope.empresa[key])
          }

          var file = $("#avatar-upload")[0].files[0];
          formData.append("logo",file);

          console.log(formData)

          $http.post(uploadUrl,formData,{
            transformRequest: angular.identity,
            headers:{
              'Content-Type': undefined
            }
          })

          .then(function(response,status,headers,config){
            // s.usuarios = {};
            console.log(response)
            if(response.data._id !=" "){

              swal("Felicitaciones", "Hemos guardado tus datos", "success");
              $route.reload()
            }else{
              swal("Verifica tus datos!", response.data.error, "warning");
            }
          })

          .catch(function(response,status){
            console.log()
            swal("Error", response.data, "error");
          });

          }else{
            swal("Error!", "El logo de la empresa es obligatorio, comprueba la extensión de su imágen, recuerde que el formato aceptado es .jpg ", "error");
            return false;
          }
    }else{
      swal("Error!", "El logo de la empresa es obligatorio, comprueba la extensión de su imagen recuerda que el formato aceptado es .jpg ", "error");
      return false;
    }
  }

  $scope.actualizarEmpresa = function(){
      if(!document.getElementById("avatar-upload").value.length==0){
        if (/.(jpg|JPG)$/i.test(document.getElementById("avatar-upload").value)){
            // Se envia el formulario con foto adjunta para modificar un usuario
                var uploadUrl = '/empresas';
                var formData = new FormData()

                for (key in $scope.empresa) {
                  formData.append(key,$scope.empresa[key]);
                }

                var file = $("#avatar-upload")[0].files[0];
                formData.append("logo",file);


                $http.put(uploadUrl,formData,{
                  transformRequest: angular.identity,
                    headers:{
                      'Content-Type': undefined
                    }
                })
                .then(function(response,status,headers,config){
                    if(response.data._id !=" "){
                      swal({
                        title: "Empresa Modificada",
                        text: "Hemos guardado tus datos",
                        type: "success",
                        showCancelButton: false,
                        confirmButtonColor: "#00b3e2",
                         closeOnConfirm: true,
                        },
                        function(isConfirm){
                          $route.reload();
                      });
                    }else{
                      swal("Verifica tus datos!", response.data.error, "warning");
                    }
                })

                .catch(function(response,status,headers,config){
                  swal("Error", response.error, "error");
                })
            }else{
              swal("Error al Actualizar!", " Compruebe la extensión de la imagen, recuerde que el formato aceptado es .jpg", "error");
            return false;
            }
        }else{
          // Se envia el formulario sin foto adjunta para modificar un usuario
          var uploadUrl = '/empresas';
          var formData = new FormData()

          for (key in $scope.empresa) {
            formData.append(key,$scope.empresa[key]);
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
                  title: "Empresa Modificada",
                  text: "Hemos guardado tus datos",
                  type: "success",
                  showCancelButton: false,
                  confirmButtonColor: "#00b3e2",
                   closeOnConfirm: true,
                  },
                  function(isConfirm){
                    location.reload()
                });
              }else{
                swal("Verifica tus datos!", response.data.error, "warning");
              }
          })

          .catch(function(response,status,headers,config){
            swal("Error", response.error, "error");
          })
      }
  }

	$scope.Cancelar = function(){
		$location.path("/");
	};
}]);

usuario.controller('controllerConfiguracionContratoEmpresa', ['$scope', '$location', '$http', function($scope, $location, $http){
  var url = $location.path();
	$scope.ejemploDescripcion = "Descripcion";
  if (url.indexOf("/registroCargoEmpresa")!=-1) {
    $scope.titulo = "Agregar Cargo";
		$scope.ejemploOcupacion = "Tipo Cargo";
  }else{
    if (url.indexOf("/registroTipoContratoEmpresa")!=-1) {
      $scope.titulo = "Agregar Tipo de Contrato";
			$scope.ejemploOcupacion = "Tipo Contrato";
    }else{
      if (url.indexOf("/registroTipoSalarioEmpresa")!=-1) {
        $scope.titulo = "Agregar Tipo de Salario";
				$scope.ejemploOcupacion = "Tipo Salario";
      }else{
        if (url.indexOf("/registroCicloFacturacionEmpresa")!=-1) {
          $scope.titulo = "Agregar Ciclo de Facturacion";
					$scope.ejemploOcupacion = "Tipo Ciclo Facturacion";
        }
      }
    }
  }

	// $http.get("/empresas")
	// 	.then(function(data,status,headers,config){
	// 		if (data.data[0]) {
	// 			localStorage.setItem('idEmpresa', data.data[0]['_id']);
	// 		}else{
	// 			alertify.error('No hay Empresa registrada. Registrela');
	// 			$location.path("/contratos");
	// 		}
	//   });

  $scope.Guardar = function(){
    if (url.indexOf("/registroCargoEmpresa")!=-1) {
      $http.post("/cargo", {
        nombre: $scope.usuarios.nombreCargo,
        descripcion: $scope.usuarios.descripcionCargo
      })
      .then(function(response,status,headers,config){
        if(response.data._id==" "){
					alertify.error('¡Ha ocurrido un error!');
        }else{
					alertify.success('Cargo Registrado');
		      $location.path("/contratos");
					// $http.put("/empresas-adicion-config",
					// 	{
					// 		cargo: response.data._id
					// 	},
					// 	{params: { id: localStorage.getItem('idEmpresa') }}
					// )
					// .then(function(response,status,headers,config){
					// 	localStorage.removeItem('idEmpresa')
					// 	if(response.data._id!=""){
					// 		alertify.success('Cargo Registrado');
		      //     $location.path("/contratos");
					// 	}else{
					// 		alertify.error('Error al relacionar Cargo');
					// 		$location.path("/contratos");
					// 	}
					// });
        }
      })
      .catch(function(response,status,headers,config){
				if (response.data['name'] == 'ValidationError') {
					$.map(response.data.errors, function(value, index) {
						if(index=="descripcion"){
							alertify.error('No olvides escribir una descripcion');
						}
					});
				}
				if (response.data['code'] == 11000) {
					alertify.error('Cargo se encuentra registrado');
				}
      })
    }
    if (url.indexOf("/registroTipoContratoEmpresa")!=-1) {
      $http.post("/tipoContrato", {
        nombre: $scope.usuarios.nombreCargo,
        descripcion: $scope.usuarios.descripcionCargo
      })
      .then(function(response,status,headers,config){
  			if(response.data._id==" "){
					alertify.error('¡Ha ocurrido un error!');
  			}else{
							alertify.success('Tipo de contrato Registrado');
		  				$location.path("/contratos");
					// $http.put("/empresas-adicion-config",
					// 	{
					// 		tipoContrato: response.data._id
					// 	},
					// 	{params: { id: localStorage.getItem('idEmpresa') }}
					// )
					// .then(function(response,status,headers,config){
					// 	localStorage.removeItem('idEmpresa')
					// 	if(response.data._id!=""){
					// 		alertify.success('Tipo de contrato Registrado');
		  		// 		$location.path("/contratos");
					// 	}else{
					// 		alertify.error('Error al relacionar Tipo de contrato');
					// 		$location.path("/contratos");
					// 	}
					// });
  			}
  		})

      .catch(function(response,status,headers,config){
				if (response.data['name'] == 'ValidationError') {
					$.map(response.data.errors, function(value, index) {
						if(index=="descripcion"){
							alertify.error('No olvides escribir una descripcion');
						}
					});
				}
				if (response.data['code'] == 11000) {
					alertify.error('Tipo de contrato se encuentra registrado');
				}
      })
    }
    if (url.indexOf("/registroTipoSalarioEmpresa")!=-1) {
      $http.post("/tipoSalario", {
        nombre: $scope.usuarios.nombreCargo,
        descripcion: $scope.usuarios.descripcionCargo
      })
      .then(function(response,status,headers,config){

        if(response.data._id==" "){
					alertify.error('¡Ha ocurrido un error!');
        }else{
							alertify.success('Tipo de Salario Registrado');
		          $location.path("/contratos");
					// $http.put("/empresas-adicion-config",
					// 	{
					// 		tipoSalario: response.data._id
					// 	},
					// 	{params: { id: localStorage.getItem('idEmpresa') }}
					// )
					// .then(function(response,status,headers,config){
					// 	localStorage.removeItem('idEmpresa')
					// 	if(response.data._id!=""){
					// 		alertify.success('Tipo de Salario Registrado');
		      //     $location.path("/contratos");
					// 	}else{
					// 		alertify.error('Error al relacionar Tipo de Salario');
					// 		$location.path("/contratos");
					// 	}
					// });
        }
      })

      .catch(function(response,status,headers,config){
				if (response.data['name'] == 'ValidationError') {
					$.map(response.data.errors, function(value, index) {
						if(index=="descripcion"){
							alertify.error('No olvides escribir una descripcion');
						}
					});
				}
				if (response.data['code'] == 11000) {
					alertify.error('Tipo de salario se encuentra registrado');
				}
      })
    }
    if (url.indexOf("/registroCicloFacturacionEmpresa")!=-1) {
      $http.post("/cicloFacturacion", {
        nombre: $scope.usuarios.nombreCargo,
        descripcion: $scope.usuarios.descripcionCargo
      })
      .then(function(response,status,headers,config){
        if(response.data._id==" "){
					alertify.error('¡Ha ocurrido un error!');
        }else{
							alertify.success('Ciclo de Facturación Registrado');
		          $location.path("/contratos");
					// $http.put("/empresas-adicion-config",
					// 	{
					// 		cicloFacturacion: response.data._id
					// 	},
					// 	{params: { id: localStorage.getItem('idEmpresa') }}
					// )
					// .then(function(response,status,headers,config){
					// 	localStorage.removeItem('idEmpresa')
					// 	if(response.data._id!=""){
					// 		alertify.success('Ciclo de Facturación Registrado');
		      //     $location.path("/contratos");
					// 	}else{
					// 		alertify.error('Error al relacionar Ciclo de Facturación');
					// 		$location.path("/contratos");
					// 	}
					// });
        }
      })
      .catch(function(response,status,headers,config){
				if (response.data['name'] == 'ValidationError') {
					$.map(response.data.errors, function(value, index) {
						if(index=="descripcion"){
							alertify.error('No olvides escribir una descripcion');
						}
					});
				}
				if (response.data['code'] == 11000) {
					alertify.error('Ciclo de facturacion se encuentra registrado');
				}
      })
    }
  }

	$scope.Cancelar = function(){
		$location.path("/contratos");
	};
}]);
