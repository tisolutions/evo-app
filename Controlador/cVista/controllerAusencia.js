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

usuario.controller('controllerListAusencia', ['$scope', '$http', '$location', 'uiCalendarConfig', '$route', function($scope,$http, $location, uiCalendarConfig, $route){
	$scope.buttonActualizar = false;
	$scope.buttonEnviar = true;
	$scope.btn_eliminar = false;
	// Calendario

	$calendar = $('[ui-calendar]');
    $scope.events = [];
    $scope.ausencia = [];
    var initialLangCode = 'es';


    var date = new Date(),
    d = date.getDate(),
    m = date.getMonth(),
    y = date.getFullYear();

    $scope.changeView = function(view){
       $calendar.fullCalendar('changeView',view);
    };

    $scope.uiConfig = {
      calendar: {
        locale: initialLangCode,
        height: '250',
        eventLimit: 3, // allow "more" link when too many events
		navLinks: true,
        header: {
			left: 'today',
			center: 'prev, title, next ',
			right: 'month,agendaWeek,agendaDay,listMonth'
		},
        views: {
	        basic: {
            	eventLimit: 3// options apply to basicWeek and basicDay views
	        },
	        agenda: {
	            eventLimit: 3// options apply to agendaWeek and agendaDay views
	        },
	        week: {
	            eventLimit: 3// options apply to basicWeek and agendaWeek views
	        },
	        day: {
	            eventLimit: 3// options apply to basicDay and agendaDay views
	        }
	    },
        eventClick: function(date, jsEvent, view) {
        	// console.log(date.id)
        	// $('#myModal').modal('show');
          	// $scope.alertMessage = (date.title + ' was clicked ');
          	$scope.buttonActualizar = true;
			$scope.buttonEnviar = false;
			$scope.btn_eliminar = true;

          	$http.get("/ausencias/edicion",{
          		params: { id: date.id }
          	})
          	.then(function(data,status,headers,config){
          		console.log(data.data._id)
    			if(data.data._id != ""){
    				// $scope.ausencia.horaInicio = new Date(data.data.fechaSuceso.getTime());
    				$scope.ausencia.fechaSuceso = new Date(data.data.fechaSuceso);
    				$scope.ausencia.fechaFin = new Date(data.data.fechaFin);
    				$scope.ausencia.tipo = data.data.tipo;
    				$scope.ausencia.id = data.data._id;
    				$scope.ausencia.descripcion = data.data.descripcion;
    				$scope.ausencia.nombreEmpleado = data.data.empleado.primerNombre+ ' '+data.data.empleado.primerApellido;

    				localStorage.setItem('idEmpleado', data.data.empleado._id);
					localStorage.setItem('id', data.data._id);
					$('#myModal').modal('show');
    			}else{
    				swal("Error", "Ha ocurrido un error", "error");
    			}
			})
		    .catch(function(data,status,headers,config){
		    	console.log(data.error)
		    });
        },
        dayClick: $scope.alertEventOnClick,
        eventDrop: $scope.alertOnDrop,
        eventResize: $scope.alertOnResize,
        eventRender: $scope.eventRender
      }
    };

    // Eventos para el calendario

    $http.get("/ausencia")
    .then(function(data,status,headers,config){
    	if (data.data.ausencias != "") {
    		$scope.events.slice(0, $scope.events.lenght);
    		// var clase;
    		angular.forEach(data.data.ausencias, function(value){
    			var date = new Date(value.fechaSuceso);
    			var dateEnd = new Date(value.fechaFin);

    			var year = date.getFullYear();
    			var month = date.getMonth();
          		var day = date.getDate();

          		var yearEnd = dateEnd.getFullYear();
    			var monthEnd = dateEnd.getMonth();
         		var dayEnd = dateEnd.getDate();

    			// console.log(year+" "+month+" "+day)

            	switch(value.tipo){

            		case "Motivo Familiar":
            		clase = "motFamiliar";
            		break;

            		case "Cita Médica":
            		clase = "citaMedica";
            		break;

            		case "Vacaciones":
            		clase = "vacaciones";
            		break;

            		case "Otros":
            		clase = "otros";
            		break;
            	}

            	// console.log(clase)

            	$scope.events.push({
	              title: value.tipo,
	              description: value.descripcion,
	              start: new Date(year, month, day),
	              end: new Date(yearEnd, monthEnd, dayEnd),
	              allDay: false,
	              stick : true,
	              className: [clase],
	              id: value._id
	            });

    		})
		}
	})
	.catch(function(data,status,headers,config){
	   	console.log(data)
	});

    $scope.eventSources = [$scope.events];

    // Fin del Calendario

	// Si existe el registro, será eliminado
	if ( localStorage.getItem('idEmpleado') ) {
		 localStorage.removeItem('idEmpleado')
	}

	$scope.clickRegistrar = function() {
		$scope.ausencia.fechaFin = "";
		$scope.ausencia.nombreEmpleado = "";
		$scope.ausencia.fechaSuceso = "";
		$scope.ausencia.tipo = "";
		$scope.ausencia.descripcion = "";
		$("#input_empleado").removeAttr('data-field');
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
							if (index=="fechaFin") {
								resultado += "<li><i class='fa fa-caret-right' aria-hidden='true'></i> No Olvides escribir una <span style='color:#FA5858;'>Fecha de Fin</span></li><br>";
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

	$scope.verRegistro = function(ausenciaId){
		$location.path("/actualizacionAusencia/" + ausenciaId);
	};

  	$scope.Eliminar = function(userId){
  		$('#btn_cancelar_modal').click();
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
			$http.delete("/ausencia", {
				params: { id: userId }
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
					  $route.reload();
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

	$scope.Actualizar = function(userId){
			var camposVacios = false;
			if ( $('#descripcion').val()=="" ) {
				camposVacios = true;
			}else	if ( $('#input_empleado').val()=="" ) {
				camposVacios = true;
			}else if ( $('#fechaSuceso').val()=="" ) {
				camposVacios = true;
			}else if ( $('#fechaFin').val()=="" ) {
				camposVacios = true;
			}else if ( $('#tipo').val()=="" ) {
				camposVacios = true;
			}else	if (camposVacios == false) {
				// en el formData se guardan los datos de la vista
				$('#btn_cancelar_modal').click();
				var url = '/ausencia';
				var datos = new FormData()

				for (key in $scope.ausencia) {
					datos.append(key, $scope.ausencia[key]);
				}
				datos.append('idEmpleado', localStorage.getItem('idEmpleado'));
				// datos.append('_id',userId)

				if(!document.getElementById("soporte").value.length==0){
					 var file = $("#soporte")[0].files[0];
					 datos.append("foto",file);
				}

				// se envian los datos a node con el metodo put
				$http.put(url, datos, {
					transformRequest: angular.identity,
					headers:{
						'Content-Type': undefined
					}
				})
				.then(function(response,status,headers,config){
					if(response.data.Ausencia !=""){
						swal({
							title: "Ausencia Modificada",
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
				.catch(function(response,status){
					swal("Error", response.data, "error");
				});
			}
	}

}]);
