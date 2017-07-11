usuario.config(['$routeProvider','$locationProvider', '$qProvider', function($routeProvider, $locationProvider, $qProvider) {
	// $qProvider.errorOnUnhandledRejections(false);
	$routeProvider
	.when('/contratoUsuario/:usuarioId',{
    templateUrl: '../V.Contrato/creacionActualizacionContrato.html',
    controller: 'controllerContratoUsuario'
	})
	.when('/actualizarContratoUsuario/:usuarioId/:contratoId',{
    templateUrl: '../V.Contrato/creacionActualizacionContrato.html',
    controller: 'controllerContratoUsuario'
	})
	.otherwise('/',{
	    redirectTo :'/'
	});
}])

usuario.controller('controllerContratoUsuario', ['$scope', '$http', '$routeParams', '$location', function(scope, $http, $routeParams, $location){
	scope.btnRegistroContrato = true;
	scope.btnActualizarContrato = false;

	$http.get("/usuarios/edicion",{
	  params: {id: $routeParams.usuarioId}
	})
	.then(function(respuesta){
		scope.idUsuario = respuesta.data['_id'];
		// Se obtienen el listado de tipo de contratos y se llena en su respectivo select (vista)
		$http.get("/tipoContrato-list")
			.then(function(resTipoContrato){
				scope.tipoContratoEmpresa = resTipoContrato.data.tiposContratos;
				if ($location.path().indexOf("/actualizarContratoUsuario")!=-1) {
					scope.tipoContratoSeleccionado = scope.BuscarElementoSelect(resTipoContrato.data.tiposContratos, respuesta.data.contratoUsuario.tipoContrato);
				}
			});
		// Se obtienen el listado de cargos y se llena en su respectivo select (vista)
		$http.get("/cargo-list")
			.then(function(resCargo){
				scope.cargosEmpresa = resCargo.data.cargos;
				if ($location.path().indexOf("/actualizarContratoUsuario")!=-1) {
					scope.cargoSeleccionado = scope.BuscarElementoSelect(resCargo.data.cargos, respuesta.data.contratoUsuario.cargo);
				}
			});
		// Se obtienen el listado de tipo de salarios y se llena en su respectivo select (vista)
		$http.get("/tipoSalario-list")
			.then(function(resTipoSalario){
				scope.tipoSalarioEmpresa = resTipoSalario.data.tipoSalarios;
				if ($location.path().indexOf("/actualizarContratoUsuario")!=-1) {
					scope.tipoSalarioSeleccionado = scope.BuscarElementoSelect(resTipoSalario.data.tipoSalarios, respuesta.data.contratoUsuario.tipoSalario);
				}
			});
		// Se obtienen el listado de ciclos de facturacion y se llena en su respectivo select (vista)
		$http.get("/cicloFactura-list")
			.then(function(resCicloFactura){
				scope.cicloFacturacionEmpresa = resCicloFactura.data.ciclosFacturas;
				if ($location.path().indexOf("/actualizarContratoUsuario")!=-1) {
					scope.cicloFacturacionSeleccionado = scope.BuscarElementoSelect(resCicloFactura.data.ciclosFacturas, respuesta.data.contratoUsuario.cicloFacturacion);
				}
			});
		// Se obtienen el ultimo contrato registrado, y se muestra el consecutivo en la vista
		$http.get("/ultimo-contrato")
			.then(function(resUltimoContrato){
				if (scope.noContrato==undefined || scope.noContrato==null) {
					if (resUltimoContrato.data.ultimoContrato.length > 0) {
						scope.noContrato = parseInt(resUltimoContrato.data.ultimoContrato[0]['noContrato']) + 1;
						scope.codContrato = "CONT"+scope.noContrato;
					}else{
						scope.noContrato = 1;
						scope.codContrato = "CONT"+scope.noContrato;
					}
				}
			});
		// Se valida la url actual para identificar si es una actualizacion
		if ($location.path().indexOf("/actualizarContratoUsuario")!=-1) {
			// Se ocultan los botones respectivos
			scope.btnRegistroContrato = false;
			scope.btnActualizarContrato = true;
			// Se rellenan los campos en la vista
			scope.usuarios = {
					empleado: respuesta.data['primerNombre'] + " " + respuesta.data['primerApellido'],
					docEmpleado: respuesta.data['identificacion'],
					id: respuesta.data['_id'],
					fechaInicio: new Date(respuesta.data.contratoUsuario.fechaIngreso),
					fechaFinalizacion: new Date(respuesta.data.contratoUsuario.fechaFinalizacion),
					salariobase: respuesta.data.contratoUsuario.salarioBase,
					notasContrato: respuesta.data.contratoUsuario.nota
			}
			if (respuesta.data.contratoUsuario['noContrato'] != "" && respuesta.data.contratoUsuario['codContrato'] != "") {
					scope.noContrato =  respuesta.data.contratoUsuario['noContrato'];
					scope.codContrato = respuesta.data.contratoUsuario['codContrato'];
			}
		}else{
			scope.usuarios = {
					empleado: respuesta.data['primerNombre'] + " " + respuesta.data['primerApellido'],
					docEmpleado: respuesta.data['identificacion'],
					id: respuesta.data['_id']
			}
		}

	});
	scope.cicloFacturacionSeleccionado;
	scope.tipoContratoSeleccionado;
	scope.tipoSalarioSeleccionado;
	scope.cargoSeleccionado;

	scope.RegistrarContrato = function(){
    $http.post("/contratos", {
      cicloFacturacion: scope.cicloFacturacionSeleccionado.nombre,
      salarioBase: scope.usuarios.salariobase,
      fechaIngreso: scope.usuarios.fechaInicio,
      fechaFinalizacion: scope.usuarios.fechaFinalizacion,
      tipoContrato: scope.tipoContratoSeleccionado.nombre,
      tipoSalario: scope.tipoSalarioSeleccionado.nombre,
      cargo: scope.cargoSeleccionado.nombre,
	  	notasContrato: scope.usuarios.notasContrato,
	  	noContrato: scope.noContrato,
	  	codContrato: scope.codContrato
    })
    .then(function(response,status,headers,config){
			if(response.data._id !=""){
				$http.put("/usuarios/edicion",
					{
						contrato: response.data._id
					},
					{params: { id: $routeParams.usuarioId }}
				)
				.then(function(response,status,headers,config){
					if(response.data._id!=""){
						alertify.success('Contrato registrado correctamente');
						$location.path("/actualizacionEmpleados/"+$routeParams.usuarioId);
					}else{
						swal("Error al relacionar contrato", response.data.error, "warning");
					}
				})
				.catch(function(response,status,headers,config){
					swal("Error al guardar contrato", response.data.err, "warning");
				})
			}else{
				swal("Error al guardar contrato", response.data.error, "warning");
			}
	})
	.catch(function(response,status){
		swal("Error", response.data, "error");
	});
	};

	scope.ActualizarContrato = function(){
		$http.put("/contratos",
			{
			  	cicloFacturacion: scope.cicloFacturacionSeleccionado.nombre,
		      salarioBase: scope.usuarios.salariobase,
		      fechaIngreso: scope.usuarios.fechaInicio,
		      tipoContrato: scope.tipoContratoSeleccionado.nombre,
		      tipoSalario: scope.tipoSalarioSeleccionado.nombre,
		      fechaFinalizacion: scope.usuarios.fechaFinalizacion,
		      cargo: scope.cargoSeleccionado.nombre,
		      noContrato: scope.noContrato,
		      nota: scope.usuarios.notasContrato,
	  		  codContrato: scope.codContrato
			},
			{params: { id: $routeParams.contratoId }}
		)
		.then(function(response,status,headers,config){
			if(response.data._id !=""){
				alertify.success('Contrato actualizado');
				$location.path("/actualizacionEmpleados/"+$routeParams.usuarioId);
			}else{
				alertify.error('Error en la petición');
			}
		})
		.catch(function(response,status,headers,config){
			alertify.error(response.data.error);
		});
	};

	scope.Cancelar = function(idUsuario){
		$location.path("/actualizacionEmpleados/"+idUsuario);
	};
  scope.BuscarElementoSelect = function(object, valor){
		for (var i = 0; i < object.length; i++) {
			if (object[i].nombre == valor) {
				return object[i];
			}
		}
	};
}])
