usuario.controller('controllerIndexInstitucion', ['$scope', '$http', function($scope, $http){
  $scope.btn_guardar = true;

  $http.get('/evo-institucion')
  .then(function(response,status,headers,config){
    $scope.institucion = response.data.Instituciones;
  });

  $scope.Guardar = function(){
    $('#btn_cancelar').click();
    var url = '/evo-institucion';
    var datos = new FormData();
		for (key in $scope.institucion) {
			datos.append(key, $scope.institucion[key]);
		}
    $http.post(url, datos, {
      transformRequest: angular.identity,
      headers:{
        'Content-Type': undefined
      }
    })
    .then(function(response,status,headers,config){
      if (response.data.Institucion['_id']!="") {
        location.reload();
      }
    });
  }
}]);
