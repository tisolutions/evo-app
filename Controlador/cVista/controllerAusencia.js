usuario.config(['$routeProvider','$locationProvider',function($routeProvider, $locationProvider) {
	$routeProvider
	.when('/ausencia',{
	    templateUrl: '../V.Contrato/opcionContrato.html',
	    controller: 'controllerListAusencia'
	})
	.when('/actualizacionAusencia/:ausenciaId',{
	    templateUrl: '../V.Contrato/opcionContrato.html',
	    controller: 'controllerConfiguracionContratoEmpresa'
	})
	.otherwise('/',{
	    redirectTo :'/'
	});
}])

usuario.controller('controllerListAusencia', ['$scope', '$http', '$location', function($scope,$http, $location){
	$scope.ausencia = [];
	$http.get("/xxxxx/ausencia")
	.then(function(data,status,headers,config){
		// $scope.bonificacionDescuento = data.data;
	})

	.catch(function(response,status,headers,config){
		console.log("Error")
	})

	$scope.verRegistro = function(ausenciaId){
		$location.path("/actualizacionAusencia/" + ausenciaId);
	};

  $scope.Eliminar = function(ausenciaIdcId){
		swal({
		  title: "¿Confirma que desea eliminar esta Ausencia?",
		  text: "No podrá recuperarla",
		  type: "warning",
		  showCancelButton: true,
		  confirmButtonColor: "#DD6B55",
		  confirmButtonText: "Si, eliminala!",
		  closeOnConfirm: false
		},
		function(){
			$http.delete("/urlEliminar/", {
				params: { id: ausenciaIdcId }
			})
			.then(function(data,status,headers,config){
				swal({
					title: "Ausencia Eliminada!",
					text: "La información ha sido eliminada.",
					type: "success",
					showCancelButton: false,
					confirmButtonColor: "#DD6B55",
					 closeOnConfirm: true,
					},
					function(isConfirm){
					  $location.path("/ausencia/");
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
					   $location.path("/ausencia/");
				});
			})

		});
	};
}]);

usuario.controller('controllerAusencia', ['$scope', '$http', '$location', function($scope,$http, $location){
	$scope.ausencia = [];

	$scope.Registrar = function(){
		// con el FormData guardamos todos los datos de la vista
		var url = '/rutaPost';
		var datos = new FormData()
		for (key in $scope.ausencia) {
			datos.append(key,$scope.ausencia[key]);
		}

		$http.post(url, datos, {
			transformRequest: angular.identity,
			headers:{
				'Content-Type': undefined
			}
		})
		.then(function(response,status,headers,config){
			if(response.data.datoAExtraer !=""){
				// $http.put("/usuarios/edicion",
				// 	{
				// 		boniDesc: response.data._id
				// 	},
				// 	{params: { id: response.data.usuario_id }}
				// )
				// .then(function(response,status,headers,config){
				// 	if(response.data._id!=""){
				// 		swal("Felicitaciones", "Ausencia Guardada", "success");
				// 		$location.path("/ausencia/");
				// 	}else{
				// 		swal("Error al relacionar Ausencia", response.data.error, "warning");
				// 	}
				// })
				// .catch(function(response,status,headers,config){
				// 	swal("Error al guardar Ausencia", response.data.err, "warning");
				// });
				swal("Felicitaciones", "Ausencia Guardada", "success");
				$location.path("/ausencia/");
			}else{
				swal("Verifica tus datos!", response.data.error, "warning");
			}
		})
		.catch(function(response,status){
			swal("Error", response.data, "error");
		});
	};


}]);
