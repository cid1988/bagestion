
angular.module('bag2.agenda', [])
.value('SRColoresPorAgenda', function() {
    return {
          'sala1':'red',
          'sala2': 'green',
          'sala3': 'blue'
        };
}).value('SRRolesPorKey', function() {
    return rolesPorKey;
}).value('SRTiposAsistenciaPorKey', function() {
    return tiposAsistenciaPorKey;
});