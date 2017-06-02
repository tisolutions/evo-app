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
}]);

usuario.controller('controllerAusencia', ['$scope', '$http', '$location', function($scope,$http, $location){
	$scope.ausencia = [];

	$scope.registrarAusencia = function(){
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
