usuario.controller('controllerIndexPrestacion', ['$scope', '$http', function($scope, $http){
  $scope.btn_guardar = true;

  $http.get('/evo-prestacion')
  .then(function(response,status,headers,config){
    $scope.prestacion = response.data.Prestaciones;
  });

  $scope.Guardar = function(){
    $('#btn_cancelar').click();
    var url = '/evo-prestacion';
    var datos = new FormData();
		for (key in $scope.prestacion) {
			datos.append(key, $scope.prestacion[key]);
		}
    $http.post(url, datos, {
      transformRequest: angular.identity,
      headers:{
        'Content-Type': undefined
      }
    })
    .then(function(response,status,headers,config){
      if (response.data.Prestacion['_id']!="") {
        location.reload();
      }
    });
  }
}]);
