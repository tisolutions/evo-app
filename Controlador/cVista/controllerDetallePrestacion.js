usuario.controller('controllerIndexDetallePrestacion', ['$scope', '$http', function($scope, $http){
  $scope.btn_guardar = true;

  $http.get('/evo-detalle-prestacion')
  .then(function(response,status,headers,config){
    $scope.detallePrestacion = response.data.DetallesPrestaciones;
    // Llenamos el select en la vista para las instituciones
    $http.get('/evo-institucion-list-select')
    .then(function(responseInstituciones){
      $scope.instituciones = responseInstituciones.data.Instituciones;
    });
    // Llenamos el select en la vista para las prestaciones
    $http.get('/evo-prestacion-list-select')
    .then(function(responsePrestaciones){
      $scope.prestaciones = responsePrestaciones.data.Prestaciones;
    });
  });
  $scope.institucionSeleccionada;
  $scope.prestacionSeleccionada;

  $scope.Guardar = function(){
    $('#btn_cancelar').click();
    $http.post("/evo-detalle-prestacion", {
      fechaVinculacion: $scope.detallePrestacion.fechaVinculacion,
      idInstitucion: $scope.institucionSeleccionada['_id'],
      idPrestacion: $scope.prestacionSeleccionada['_id'],
      idEmpleado: localStorage.getItem('idEmpleado')
    })
    .then(function(response,status,headers,config){
      if (response.data.DetallePrestacion['_id']!="") {
        location.reload();
      }
    });
  }
}]);
