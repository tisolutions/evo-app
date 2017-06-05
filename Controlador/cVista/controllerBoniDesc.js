usuario.config(['$routeProvider','$locationProvider',function($routeProvider, $locationProvider) {
	$routeProvider
	.when('/bonificacionDescuento',{
	    templateUrl: '../V.BonificacionesDescuentos/ListaBonificacionesDescuentos.html',
	    controller: 'controllerListBoniDesc'
	})
	.when('/actualizacionBoniDesc/:boniDescId',{
	    templateUrl: '../V.Contrato/opcionContrato.html',
	    controller: 'controllerConfiguracionContratoEmpresa'
	})
	.otherwise('/',{
	    redirectTo :'/'
	});
}])

usuario.controller('controllerListBoniDesc', ['$scope', '$http', '$location', function($scope,$http, $location){
	$scope.bonificacionDescuento = [];
	$http.get("/bonificaciones-descuentos")
	.then(function(data,status,headers,config){
		// $scope.bonificacionDescuento = data.data;
	})

	.catch(function(response,status,headers,config){
		console.log("Error")
	})

	$scope.verRegistro = function(boniDescId){
		$location.path("/actualizacionBoniDesc/" + boniDescId);
	};

	$scope.Eliminar = function(boniDescId){
		swal({
		  title: "¿Confirma que desea eliminar este registro?",
		  text: "No podrá recuperarlo",
		  type: "warning",
		  showCancelButton: true,
		  confirmButtonColor: "#DD6B55",
		  confirmButtonText: "Si, eliminalo!",
		  closeOnConfirm: false
		},
		function(){
			$http.delete("/bonificaciones-descuentos", {
				params: { id: boniDescId }
			})
			.then(function(data,status,headers,config){
				swal({
					title: "Registro Eliminado!",
					text: "La información ha sido eliminada.",
					type: "success",
					showCancelButton: false,
					confirmButtonColor: "#DD6B55",
					 closeOnConfirm: true,
					},
					function(isConfirm){
					  $location.path("/bonificacionDescuento/");
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
					   $location.path("/bonificacionDescuento/");
				});
			})

		});
	};

	$scope.Registrar = function(){
	 	// con el FormData guardamos todos los datos de la vista
		var url = '/bonificaciones-descuentos';
		var datos = new FormData()
		for (key in $scope.bonificacionDescuento) {
			datos.append(key,$scope.bonificacionDescuento[key]);
			console.log(key,$scope.bonificacionDescuento[key])
		}

		// $http.post(url, datos, {
		// 	transformRequest: angular.identity,
		// 	headers:{
		// 		'Content-Type': undefined
		// 	}
		// })
		// .then(function(response,status,headers,config){
		// 	if(response.data.datoAExtraer !=""){
		// 		// $http.put("/usuarios/edicion",
		// 		// 	{
		// 		// 		boniDesc: response.data._id
		// 		// 	},
		// 		// 	{params: { id: response.data.usuario_id }}
		// 		// )
		// 		// .then(function(response,status,headers,config){
		// 		// 	if(response.data._id!=""){
		// 		// 		swal("Felicitaciones", "Bonificacion/Descuento Guardado", "success");
		// 		// 		$location.path("/bonificacionDescuento/");
		// 		// 	}else{
		// 		// 		swal("Error al relacionar Bonificacion/Descuento", response.data.error, "warning");
		// 		// 	}
		// 		// })
		// 		// .catch(function(response,status,headers,config){
		// 		// 	swal("Error al guardar Bonificacion/Descuento", response.data.err, "warning");
		// 		// });
		// 		swal("Felicitaciones", "Bonificacion/Descuento Guardado", "success");
		// 		$location.path("/bonificacionDescuento/");
		// 	}else{
		// 		swal("Verifica tus datos!", response.data.error, "warning");
		// 	}
		// })
		// .catch(function(response,status){
		// 	swal("Error", response.data, "error");
		// });
	};
}]);

usuario.controller('controllerBoniDesc', ['$scope', '$http', '$location', function($scope,$http, $location){
	$scope.bonificacionDescuento = [];



	$scope.Actualizar = function(){
		// en el formData se guardan los datos de la vista
		var url = '/bonificaciones-descuentos';
		var datos = new FormData()

		for (key in $scope.bonificacionDescuento) {
			datos.append(key, $scope.bonificacionDescuento[key]);
		}
		// se envian los datos a node con el metodo put
		$http.put(url, datos, {
			transformRequest: angular.identity,
			headers:{
				'Content-Type': undefined
				}
		})
		.then(function(response,status,headers,config){
			if(response.data.dato_extraer !=""){
				swal({
					title: "Bonificacion o Descuento Modificado",
					text: "Hemos guardado tus datos",
					type: "success",
					showCancelButton: false,
					confirmButtonColor: "#00b3e2",
					closeOnConfirm: true,
				});
				$location.path("/bonificacionDescuento/");
			}else{
				swal("Verifica tus datos!", response.data.error, "warning");
			}
		})
		.catch(function(response,status){
			swal("Error", response.data, "error");
		});
	};

}]);
