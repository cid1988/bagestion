
angular.module('bag2.mejorenbici', [])
.value('MEVColoresPorBici', function() {
    return {
          'bici1':'red',
          'bici2': 'green',
          'bici3': 'blue'
        };
}).value('MEBRolesPorKey', function() {
    return rolesPorKey;
}).value('MEBTiposAsistenciaPorKey', function() {
    return tiposAsistenciaPorKey;
});