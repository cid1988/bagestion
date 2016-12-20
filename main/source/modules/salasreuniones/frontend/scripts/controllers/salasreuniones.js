
angular.module('bag2.salasreuniones', [])
.value('SRColoresPorSala', function() {
    return {
          'sala1':'red',
          'sala2': 'green',
          'sala3': 'blue',
          'ccpp1': '#FF8000',
          'ccpp2': '#9A2EFE',
          'ccpp3': '#8A4B08'
        };
}).value('SRRolesPorKey', function() {
    return rolesPorKey;
}).value('SRTiposAsistenciaPorKey', function() {
    return tiposAsistenciaPorKey;
});