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
		$scope.ausencia = [];
    var date = new Date();
    var d = date.getDate();
    var m = date.getMonth();
    var y = date.getFullYear();
    $scope.events = [];

    $http.get("/ausencia")
    .then(function(data,status,headers,config){
  		console.log(data.data)
  		if (data.data.ausencias != "") {
  			$scope.events.slice(0, $scope.events.lenght);
  				angular.forEach(data.data.ausencias, function(value){
  				$scope.events.push({
  					title: value.tipo,
  					description: value.descripcion,
  					start: new Date(parseInt(value.fechaSuceso.substr(6))),
  					allDay: false
  				});
  			});
  		}
  	})

  	.catch(function(response,status,headers,config){
  		console.log(response.message)
  	})

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
    /* event source that pulls from google.com */
    // $scope.eventSource = {
    //         url: "http://www.google.com/calendar/feeds/usa__en%40holiday.calendar.google.com/public/basic",
    //         className: 'gcal-event',           // an option!
    //         currentTimezone: 'America/Bogota' // an option!
    // };



    /* event source that contains custom events on the scope */
     $scope.events = [
       {title: 'All Day Event',start: new Date(y, m, 1)},
       {title: 'Long Event',start: new Date(y, m, d - 5),end: new Date(y, m, d - 2)},
       {id: 999,title: 'Repeating Event',start: new Date(y, m, d - 3, 16, 0),allDay: false},
       {id: 999,title: 'Repeating Event',start: new Date(y, m, d + 4, 16, 0),allDay: false},
       {title: 'Birthday Party',start: new Date(y, m, d + 1, 19, 0),end: new Date(y, m, d + 1, 22, 30),allDay: false},
       {title: 'Click for Google',start: new Date(y, m, 28),end: new Date(y, m, 29),url: 'http://google.com/'}
     ];

    /* event source that calls a function on every view switch */
    $scope.eventsF = function (start, end, timezone, callback) {
      var s = new Date(start).getTime() / 1000;
      var e = new Date(end).getTime() / 1000;
      var m = new Date(start).getMonth();
      var events = [{title: 'Feed Me ' + m,start: s + (50000),end: s + (100000),allDay: false, className: ['customFeed']}];
      callback(events);
    };

    $scope.calEventsExt = {
       color: '#f00',
       textColor: 'yellow',
       events: [
          {type:'party',title: 'Lunch',start: new Date(y, m, d, 12, 0),end: new Date(y, m, d, 14, 0),allDay: false},
          {type:'party',title: 'Lunch 2',start: new Date(y, m, d, 12, 0),end: new Date(y, m, d, 14, 0),allDay: false},
          {type:'party',title: 'Click for Google',start: new Date(y, m, 28),end: new Date(y, m, 29),url: 'http://google.com/'}
        ]
    };
    /* alert on eventClick */
    $scope.alertOnEventClick = function( date, jsEvent, view){
        $scope.alertMessage = (date.title + ' was clicked ');
        alert(date.title + ' was clicked ');
    };
    /* alert on Drop */
     $scope.alertOnDrop = function(event, delta, revertFunc, jsEvent, ui, view){
       $scope.alertMessage = ('Event Dropped to make dayDelta ' + delta);
    };
    /* alert on Resize */
    $scope.alertOnResize = function(event, delta, revertFunc, jsEvent, ui, view ){
       $scope.alertMessage = ('Event Resized to make dayDelta ' + delta);
    };
    /* add and removes an event source of choice */
    $scope.addRemoveEventSource = function(sources,source) {
      var canAdd = 0;
      angular.forEach(sources,function(value, key){
        if(sources[key] === source){
          sources.splice(key,1);
          canAdd = 1;
        }
      });
      if(canAdd === 0){
        sources.push(source);
      }
    };
    /* add custom event*/
    $scope.addEvent = function() {
      $scope.events.push({
        title: 'Open Sesame',
        start: new Date(y, m, 28),
        end: new Date(y, m, 29),
        className: ['openSesame']
      });
    };
    /* remove event */
    $scope.remove = function(index) {
      $scope.events.splice(index,1);
    };
    /* Change View */
    $scope.changeView = function(view,calendar) {
      uiCalendarConfig.calendars[calendar].fullCalendar('changeView',view);
    };
    /* Change View */
    $scope.renderCalendar = function(calendar) {
      $timeout(function() {
        if(uiCalendarConfig.calendars[calendar]){
          uiCalendarConfig.calendars[calendar].fullCalendar('render');
        }
      });
    };
     /* Render Tooltip */
    $scope.eventRender = function( event, element, view ) {
        element.attr({'tooltip': event.title,
                      'tooltip-append-to-body': true});
        $compile(element)($scope);
    };
    /* config object */
    $scope.uiConfig = {
      calendar:{
        height: 450,
        editable: true,
        header:{
          left: 'title',
          center: '',
          right: 'today prev,next'
        },
        eventClick: $scope.alertOnEventClick,
        eventDrop: $scope.alertOnDrop,
        eventResize: $scope.alertOnResize,
        eventRender: $scope.eventRender
      }
    };
     $scope.uiConfig.calendar.dayNames = ["Domingo", "Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabádo"];
     $scope.uiConfig.calendar.dayNamesShort = ["Dom", "Lun", "Mar", "Mie", "Ju", "Vie", "Sab"];

    /* event sources array*/
    $scope.eventSources = [$scope.events,  $scope.eventsF];
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
