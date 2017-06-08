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

usuario.controller('controllerListAusencia', ['$scope', '$http', '$location', '$compile', '$timeout', 'uiCalendarConfig', function($scope,$http, $location, $compile, $timeout, uiCalendarConfig){
	  $scope.ausencia = [];

    $calendar = $('[ui-calendar]');

    var date = new Date(),
    d = date.getDate(),
    m = date.getMonth(),
    y = date.getFullYear();

    $scope.changeView = function(view){      
       $calendar.fullCalendar('changeView',view);
    };

    $scope.uiConfig = {
      calendar: {
        lang: 'es',
        height: '100%',
        editable: false,
        header: {
          left: 'month basicWeek basicDay',
          center: 'title',
          right: 'today prev,next'
        },
        eventClick: function(date, jsEvent, view) {
          $scope.alertMessage = (date.title + ' was clicked ');
        },
        dayClick: $scope.alertEventOnClick,
        eventDrop: $scope.alertOnDrop,
        eventResize: $scope.alertOnResize,
        eventRender: $scope.eventRender
      }
    };

    $scope.events = [{
      title: 'All Day Event',
      start: new Date(y, m, 1)
    }, {
      title: 'Long Event',
      start: new Date(y, 6, d - 5),
      end: new Date(y, m, d - 2)
    }, {
      id: 999,
      title: 'Repeating Event',
      start: new Date(y, m, d - 3, 16, 0),
      allDay: false
    }, {
      id: 999,
      title: 'Repeating Event',
      start: new Date(y, m, d + 4, 16, 0),
      allDay: false
    }, {
      title: 'Birthday Party',
      start: new Date(y, m, d + 1, 19, 0),
      end: new Date(y, m, d + 1, 22, 30),
      allDay: false
    }, {
      title: 'Click for Google',
      start: new Date(y, m, 28),
      end: new Date(y, m, 29),
      url: 'https://google.com/'
    }];

    $scope.eventSources = [$scope.events];

}]);

usuario.controller('controllerAusencia', ['$scope', '$http', '$location', function($scope,$http, $location){
	$scope.ausencia = [];

	$scope.Registrar = function(){
		// con el FormData guardamos todos los datos de la vista
		var url = '/ausencia';
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
