angular.module('bag2.legislatura', [])
.controller('HomePreguntaCtrl', function($scope, Pregunta, EventoPregunta, CuestionarioLegislatura, EstadoPregunta, $location) {
    $scope.preguntas = Pregunta.query();
    $scope.eventos = EventoPregunta.query();
    $scope.cuestionarios = CuestionarioLegislatura.query();

    EstadoPregunta.query({
        aprobada: true
    }, function(data) {
        $scope.estadoAprobada = data[0];
    });
     EstadoPregunta.query({
        incompleta: true
    }, function(data) {
        $scope.estadoIncompleta = data[0];
    });
     EstadoPregunta.query({
        noAprobada: true
    }, function(data) {
        $scope.estadoNoAprobada = data[0];
    });
    
    var ejesEstado = {
        'Ciudad Verde': {
            nombre: 'Ciudad Verde',
            _id: '50c1f546b654f1281b0000da',
            aprobada: 0,
            incompleta: 0,
            noAprobada: 0
        },
        'Vida Sana / Salud': {
            nombre: 'Vida Sana / Salud',
            _id: '50c1f546b654f1281b0000df',
            aprobada: 0,
            incompleta: 0,
            noAprobada: 0
        },
        'Ciudad Moderna / Participación Ciudadana / Futuro': {
            nombre: 'Ciudad Moderna / Participación Ciudadana / Futuro',
            _id: '50c1f546b654f1281b0000dc',
            aprobada: 0,
            incompleta: 0,
            noAprobada: 0
        },
        'Realización Personal / Vulnerables': {
            nombre: 'Realización Personal / Vulnerables',
            _id: '50c1f546b654f1281b0000de',
            aprobada: 0,
            incompleta: 0,
            noAprobada: 0
        },
        'Buenos Aires Ciudad de Todos los Argentinos': {
            nombre: 'Buenos Aires Ciudad de Todos los Argentinos',
            _id: '50c1f546b654f1281b0000db',
            aprobada: 0,
            incompleta: 0,
            noAprobada: 0
        },
        'Jóvenes / Educación': {
            nombre: 'Jóvenes / Educación',
            _id: '50c1f546b654f1281b0000dd',
            aprobada: 0,
            incompleta: 0,
            noAprobada: 0
        }
    };
    $scope.totalAprobada = 0;
    $scope.totalIncompleta = 0;
    $scope.totalNoAprobada = 0;
    
    var preguntas = Pregunta.query(function() {
        preguntas.forEach(function(p) {
            if (p.estado.aprobada) {
                ejesEstado[p.eje_tematico.nombre].aprobada += 1;
                $scope.totalAprobada += 1;
            }
            if (p.estado.incompleta) {
                ejesEstado[p.eje_tematico.nombre].incompleta += 1;
                $scope.totalIncompleta += 1;
            }
            if (p.estado.noAprobada) {
                ejesEstado[p.eje_tematico.nombre].noAprobada += 1;
                $scope.totalNoAprobada += 1;
            }
        });
    });
    
    $scope.ejes = ejesEstado;
}).controller('TemaPreguntaCtrl', function($scope, TemaPregunta, TematicaPregunta, $routeParams, $location) {
    $scope.tematicas = TematicaPregunta.query();
    $scope.tematica = new TematicaPregunta();
    $scope.tema = new TemaPregunta();
    $scope.guardar = function() {
        $scope.tematica.$save(function() {
            //showAlert('El tematica se ha guardado con éxito');
            $scope.alerts.push({type:'success', htmlMessage: 'El tematica se ha guardado con éxito'});
            $location.url('/preguntas/temas/');
        });
    };
    $scope.guardar2 = function() {
        $scope.tema.$save(function() {
            //showAlert('El tema se ha guardado con éxito');
            $scope.alerts.push({type:'success', htmlMessage: 'El tema se ha guardado con éxito'});
            $location.url('/preguntas/temas/');
        });
    };
});