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

usuario.controller('controllerListBoniDesc', ['$scope', '$http', '$location', '$route', function($scope,$http, $location, $route){
	// Si existe el registro, será eliminado
	if ( localStorage.getItem('idEmpleado') ) {
		localStorage.removeItem('idEmpleado')
	}
	if ( localStorage.getItem('id') ) {
		localStorage.removeItem('id')
	}
	// $scope.bonificacionDescuento: variable que se usará para mostrar la informacion en la vista
	$scope.bonificacionDescuento = [];
	// Metodo get: para obtener el listado de bonificaciones/descuentos
	$http.get("/bonificaciones-descuentos")
	.then(function(data,status,headers,config){
		$scope.bonificacionDescuento = data.data;
		for (var i = 0; i < $scope.bonificacionDescuento.length; i++) {
			// fecha extraida con el formato YYYY-MM-DD, para ser reflejada en el listado
			var fechaExtraida = $scope.bonificacionDescuento[i].fechaSuceso;
			fechaExtraida = fechaExtraida.substr(0,10);
			$scope.bonificacionDescuento[i].fechaSuceso = fechaExtraida;
		}
	})
	.catch(function(response,status,headers,config){
		console.log("Error")
	})

	$scope.VerRegistro = function(boniDescId){
		alert(boniDescId);
		// ocultar/mostrar botones en el modal
		$scope.buttonActualizar = true;
		$scope.buttonEnviar = false;
		$http.get('/bonificacion-descuento', {
			params: { id: boniDescId }
		})
		.then(function(data,status,headers,config){
			$('#myModal').modal('show');
			$scope.bonificacionDescuento.nombreEmpleado = data.data.empleado.primerNombre+ ' '+data.data.empleado.primerApellido;
			$scope.bonificacionDescuento.tipo = data.data.tipo;
			$scope.bonificacionDescuento.fechaSuceso = new Date(data.data.fechaSuceso);
			$scope.bonificacionDescuento.valor = data.data.valor;
			$scope.bonificacionDescuento.descripcion = data.data.descripcion;
			console.log($scope.bonificacionDescuento);
			// localStorage para guardar los datos en el almacenamiento de sesion
			localStorage.setItem('idEmpleado', data.data.empleado._id);
			localStorage.setItem('id', data.data._id);
			// Se abre el modal

		});
		// $location.path("/actualizacionBoniDesc/" + boniDescId);
	};

	$scope.Actualizar = function(){
		// ocultar el modal en la vista
		$('#btn_cancelar_modal').click();
		// en el formData se guardan los datos de la vista
		var url = '/bonificaciones-descuentos';
		var datos = new FormData()

		cadena_error = "";
		for (key in $scope.bonificacionDescuento) {
			cadena_error += validacion(key, $scope.bonificacionDescuento[key]);
			datos.append(key, $scope.bonificacionDescuento[key]);
		}
		console.log(cadena_error);
		if (cadena_error=="") {
			datos.append('empleado', localStorage.getItem('idEmpleado'));
			datos.append('id', localStorage.getItem('id'));

			// se envian los datos a node con el metodo put
			$http.put(url, datos, {
				transformRequest: angular.identity,
				headers:{
					'Content-Type': undefined
					}
			})
			.then(function(response,status,headers,config){
				if(response.data.BonificacionDescuento._id !=""){
					localStorage.removeItem('idEmpleado');
					localStorage.removeItem('id');
					swal({
						title: "Solicitud Exitosa",
						text: "Hemos guardado sus datos",
						type: "success",
						showCancelButton: false,
						confirmButtonColor: "#00b3e2",
						closeOnConfirm: true,
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
		}else {
			cadena_error = "<ul>" + cadena_error + "</ul>";
			swal({
				title: "Error",
				text: cadena_error,
				type: "error",
				html: true,
				closeOnConfirm: true,
				});
			cadena_error = null;
		}


		// .catch(function(response,status){
		// 	localStorage.removeItem('idEmpleado');
		// 	localStorage.removeItem('id');
			// if ((response.data.name) && (response.data.name == "ValidationError")) {
			// 	resultado = "<ul>";
			// 	$.map(response.data.errors, function(value, index) {
			// 		if(index=="empleado"){
			// 			resultado += "<li><i class='fa fa-caret-right' aria-hidden='true'></i> No Olvides seleccionar un <span style='color:#FA5858;'>Empleado</span></li><br>";
			// 		}
			// 		if (index=="fechaSuceso") {
			// 			resultado += "<li><i class='fa fa-caret-right' aria-hidden='true'></i> No Olvides seleccionar la <span style='color:#FA5858;'>Fecha de Suceso</span></li><br>";
			// 		}
			// 		if (index=="tipo") {
			// 			resultado += "<li><i class='fa fa-caret-right' aria-hidden='true'></i> No Olvides seleccionar el <span style='color:#FA5858;'>Tipo</span></li><br>";
			// 		}
			// 		if (index=="descripcion") {
			// 			resultado += "<li><i class='fa fa-caret-right' aria-hidden='true'></i> No Olvides escribir una <span style='color:#FA5858;'>Descripcion</span></li><br>";
			// 		}
			// 		if (index=="valor") {
			// 			resultado += "<li><i class='fa fa-caret-right' aria-hidden='true'></i> No Olvides digitar un <span style='color:#FA5858;'>Valor</span></li>";
			// 		}
			// 	});
			// 	resultado += "</ul>";
			// 	swal({
			// 		title: "Error",
			// 		text: resultado,
			// 		type: "error",
			// 		html: true,
			// 		closeOnConfirm: true,
			// 		});
			// }
		// });
	};

	$scope.Eliminar = function(boniDescId){
		swal({
		  title: "¿Confirma que desea eliminar este registro?",
		  text: "No podrá recuperarlo",
		  type: "warning",
		  showCancelButton: true,
		  confirmButtonColor: "#DD6B55",
		  confirmButtonText: "Si, eliminalo!",
		  closeOnConfirm: false,
			closeOnCancel: false
		},
		function(isConfirm){
			if (isConfirm) {
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
							if (isConfirm) {
								$route.reload();
							}
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
						   $route.reload();
					});
				})
		  } else {
		    swal("Cancelado", "No hubo cambios en el registro.", "error");
		  }
		});
	};

	$scope.clickRegistrar = function(){
		// ocultar/mostrar botones en el modal
		$scope.buttonEnviar = true;
		$scope.buttonActualizar = false;
		// se eliminan los datos cargados en memoria
		$scope.bonificacionDescuento.tipo = "";
		$scope.bonificacionDescuento.fechaSuceso = "";
		$scope.bonificacionDescuento.valor = "";
		$scope.bonificacionDescuento.descripcion = "";
	}

	$scope.Registrar = function(){
		// ocultar el modal en la vista
		$('#btn_cancelar_modal').click();
		var acceso = false;
		var url = '/bonificaciones-descuentos';
		// con el FormData guardamos todos los datos de la vista
		var datos = new FormData();
		for (key in $scope.bonificacionDescuento) {
			datos.append(key,$scope.bonificacionDescuento[key]);
		}
		datos.append('idEmpleado', localStorage.getItem('idEmpleado'));

		if(!document.getElementById("avatar-upload").value.length==0){
			// Este condicional es para determinar mas adelante, restricciones al tipo de archivo
			// De esa manera de dará acceso a subir los archivos
			var file = $("#avatar-upload")[0].files[0];
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
				if (response.data.BonificacionDescuento._id != "") {
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
					swal("Error al relacionar Bonificacion/Descuento", response.data.error, "warning");
				}
			})
			.catch(function(response,status){
				localStorage.removeItem('idEmpleado');
				if ((response.data.name) && (response.data.name == "ValidationError")) {
					resultado = "<ul>";
					$.map(response.data.errors, function(value, index) {
						if(index=="empleado"){
							resultado += "<li><i class='fa fa-caret-right' aria-hidden='true'></i> No Olvides seleccionar un <span style='color:#FA5858;'>Empleado</span></li><br>";
						}
						if (index=="fechaSuceso") {
							resultado += "<li><i class='fa fa-caret-right' aria-hidden='true'></i> No Olvides seleccionar la <span style='color:#FA5858;'>Fecha de Suceso</span></li><br>";
						}
						if (index=="tipo") {
							resultado += "<li><i class='fa fa-caret-right' aria-hidden='true'></i> No Olvides seleccionar el <span style='color:#FA5858;'>Tipo</span></li><br>";
						}
						if (index=="descripcion") {
							resultado += "<li><i class='fa fa-caret-right' aria-hidden='true'></i> No Olvides escribir una <span style='color:#FA5858;'>Descripcion</span></li><br>";
						}
						if (index=="valor") {
							resultado += "<li><i class='fa fa-caret-right' aria-hidden='true'></i> No Olvides digitar un <span style='color:#FA5858;'>Valor</span></li>";
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

function validacion(propiedad, valor){
	if (valor == '' || valor == undefined || valor == "undefined") {
		if (propiedad=="empleado"){
			return "<li><i class='fa fa-caret-right' aria-hidden='true'></i> No Olvides seleccionar un <span style='color:#FA5858;'>Empleado</span></li><br>";
		}
		if (propiedad=="fechaSuceso") {
			return "<li><i class='fa fa-caret-right' aria-hidden='true'></i> No Olvides seleccionar la <span style='color:#FA5858;'>Fecha de Suceso</span></li><br>";
		}
		if (propiedad=="tipo") {
			return "<li><i class='fa fa-caret-right' aria-hidden='true'></i> No Olvides seleccionar el <span style='color:#FA5858;'>Tipo</span></li><br>";
		}
		if (propiedad == "descripcion"){
			return "<li><i class='fa fa-caret-right' aria-hidden='true'></i> No Olvides escribir una <span style='color:#FA5858;'>Descripcion</span><li>";
		}
		if (propiedad=="valor") {
			return "<li><i class='fa fa-caret-right' aria-hidden='true'></i> No Olvides digitar un <span style='color:#FA5858;'>Valor</span></li>";
		}
	}else {
		return "";
	}
}
