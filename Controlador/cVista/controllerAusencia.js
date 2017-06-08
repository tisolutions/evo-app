usuario.config(['$routeProvider','$locationProvider',function($routeProvider, $locationProvider) {
	$routeProvider
	.when('/ausencia',{
	    templateUrl: '../V.Ausencias/Ausencias.html',
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

usuario.controller('controllerListAusencia', ['$scope', '$http', '$location', '$compile', '$timeout', 'uiCalendarConfig', '$route', function($scope,$http, $location, $compile, $timeout, uiCalendarConfig, $route){
		// Si existe el registro, será eliminado
	if ( localStorage.getItem('idEmpleado') ) {
		localStorage.removeItem('idEmpleado')
	}

	$scope.clickRegistrar = function() {
		$scope.ausencia.horaInicio = "";
		$scope.ausencia.horaFin = "";
		$scope.ausencia.fechaSuceso = "";
		$scope.ausencia.tipo = "";
		$scope.ausencia.descripcion = "";
	}

	$scope.Registrar = function(){
			var acceso = false;
			var url = '/ausencia';
			// con el FormData guardamos todos los datos de la vista
			var datos = new FormData()
			for (key in $scope.ausencia) {
				datos.append(key,$scope.ausencia[key]);
			}
			datos.append('idEmpleado', localStorage.getItem('idEmpleado'));

			if(!document.getElementById("soporte").value.length==0){
				// Este condicional es para determinar mas adelante, restricciones al tipo de archivo
				// De esa manera de dará acceso a subir los archivos
				var file = $("#soporte")[0].files[0];
				datos.append("foto",file);
				acceso = true;
			}else{
				acceso = true;
			}

			if (acceso == true) {
				$http.post(url, datos, {
					transformRequest: angular.identity,
					headers:{
						'Content-Type': undefined
					}
				})
				.then(function(response,status,headers,config){
					if(response.data.Ausencia._id !=""){
						localStorage.removeItem('idEmpleado')
						swal({
							title: "Felicitaciones",
						  text: "Hemos guardado sus datos",
							type: "success",
							closeOnConfirm: true
							},
							function(isConfirm){
								if (isConfirm) {
									$route.reload();
								}
							});
					}else{
						swal("Verifica tus datos!", response.data.error, "warning");
					}
				})
				.catch(function(response,status){
					// swal("Error", response.data, "error");
					localStorage.removeItem('idEmpleado');
					if ((response.data.name) && (response.data.name == "ValidationError")) {
						resultado = "<ul>";
						$.map(response.data.errors, function(value, index) {
							if(index=="descripcion"){
								resultado += "<li><i class='fa fa-caret-right' aria-hidden='true'></i> No Olvides escribir una <span style='color:#FA5858;'>Descripcion</span></li><br>";
							}
							if (index=="empleado") {
								resultado += "<li><i class='fa fa-caret-right' aria-hidden='true'></i> No Olvides seleccionar un <span style='color:#FA5858;'>Empleado</span></li><br>";
							}
							if (index=="fechaSuceso") {
								resultado += "<li><i class='fa fa-caret-right' aria-hidden='true'></i> No Olvides seleccionar una <span style='color:#FA5858;'>Fecha de Suceso</span></li><br>";
							}
							if (index=="horaInicio") {
								resultado += "<li><i class='fa fa-caret-right' aria-hidden='true'></i> No Olvides escribir una <span style='color:#FA5858;'>Hora de Inicio</span></li><br>";
							}
							if (index=="horaFin") {
								resultado += "<li><i class='fa fa-caret-right' aria-hidden='true'></i> No Olvides escribir una <span style='color:#FA5858;'>Hora de Fin</span></li><br>";
							}
							if (index=="tipo") {
								resultado += "<li><i class='fa fa-caret-right' aria-hidden='true'></i> No Olvides seleccionar un <span style='color:#FA5858;'>Tipo</span></li><br>";
							}

						});
						resultado += "</ul>";
						swal({
							title: "Error",
						  text: resultado,
							type: "error",
							html: true,
							closeOnConfirm: true,
							});
					}
				});
			}
	};

}]);

usuario.controller('controllerAusencia', ['$scope', '$http', '$location', function($scope,$http, $location){
	$scope.ausencia = [];



  $scope.Actualizar = function(){
    // en el formData se guardan los datos de la vista
		var url = '/ausencia';
		var datos = new FormData()

		for (key in $scope.ausencia) {
			datos.append(key, $scope.ausencia[key]);
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
					title: "Ausencia Modificada",
					text: "Hemos guardado tus datos",
					type: "success",
					showCancelButton: false,
					confirmButtonColor: "#00b3e2",
					closeOnConfirm: true,
				});
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
