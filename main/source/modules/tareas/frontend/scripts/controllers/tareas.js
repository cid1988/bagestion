angular.module('bag2.tareas', [])
.controller('TareasCtrl', function($scope,Tarea, TareaGrupo, $http, User) {
    
    $scope.tab = 'pendientes';
    $scope.user = User.findByName({
        username: $scope.username
    }, function() {
        $scope.grupos= TareaGrupo.query({usuarios:$scope.username});
        $scope.tareas= Tarea.query();
    });
    
    $scope.aMilisegundos = function(fecha) 
    {
        var fechaDividida = fecha.split("/");
        var date = new Date(fechaDividida[2], fechaDividida[1] - 1, fechaDividida[0], 0, 0, 0, 0);
        return date.getTime();
    };
    
    $scope.diaHoy = function () {
      function pad(s) { return (s < 10) ? '0' + s : s; }
      var d = new Date();
      return [pad(d.getDate()), pad(d.getMonth()+1), d.getFullYear()].join('/');
    };
    
});