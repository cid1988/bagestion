angular.module('bag2.fiscales', []).controller('FiscalesEventoCtrl', function($scope, $modal, EventoFiscal, $rootScope) { //Lista de contactos
    
    //Listado de contactos cargados
    $scope.eventos = EventoFiscal.query();
    
    $scope.nuevoEvento = function(confirmado) {
        if (confirmado) {
            $scope.nuevo.$save(function() {
                $scope.eventos = EventoFiscal.query();
            });
        }
        else {
            $scope.nuevo = new EventoFiscal({
                evento: '',
                territorio: ''
                
            });
            $("#modalEvento").modal('show');
        }
    };
    

//Detalle de contactos---------------------------------------------------------------------------------
}).controller('FiscalesCtrl', function($scope, $routeParams, $modal, Fiscal, EventoFiscal, $rootScope) { //Lista de contactos
    
    //Listado de contactos cargados
    $scope.contactos = Fiscal.query({evento : $routeParams._id});
    
    $scope.evento = EventoFiscal.get({
        _id: $routeParams._id
    });
    
    $scope.letraSeleccionada = "Todos";
    $scope.abecedario = ("ABCDEFGHIJKLMNÑOPQRSTUVWXYZ").split("");
    $scope.letra = function (c) {
        if ($scope.letraSeleccionada != "Todos") {
            if (c && c.apellido && c.apellido.length > 0 && c.apellido[0].toLowerCase() == $scope.letraSeleccionada.toLowerCase()) 
            {
                return true;
            } else {
                return false;
            }
        } else {
            return true;
        }
    };
    
    $scope.seleccionarLetra = function (l) {
        $scope.letraSeleccionada = l;
    };

//Detalle de contactos---------------------------------------------------------------------------------
}).controller('FiscalesDetalleCtrl', function($scope, $modal, $routeParams, $location, Fiscal, Comuna, $http) {
    $scope.apadrinados = [];
    
    //Query del contacto con el id
    $scope.contacto = Fiscal.get({
        _id: $routeParams._id
    }, function() {
        $scope.contactos = Fiscal.query({evento : $scope.contacto.evento}, function() {
            $scope.contactos.forEach(function(item) {
                if (item.padrino == $scope.contacto._id) {
                    $scope.apadrinados.push(item);
                }
            });
        });
    });
        
    $scope.comunas = Comuna.query();
    
    //Habilitar edicion
    $scope.editar = function() {
        $scope.editando = true;
        $scope.contacto = angular.copy($scope.contacto);
    };
    
    $scope.agregarContacto = function(confirmado, idPadrino) {
        if (confirmado) {
            if ($scope.nuevo.apellido && $scope.nuevo.nombre && $scope.nuevo.mail && $scope.nuevo.sexo && $scope.nuevo.dni) {
                $scope.nuevo.apellido = ($scope.nuevo.apellido || '').toUpperCase();
                $scope.nuevo.$save(function() {
                    $scope.apadrinados.push($scope.nuevo);
                    $scope.enviar($scope.nuevo);
                    $("#modalContacto").modal('hide');
                });
            } else {
                alert("Faltan cargar datos.");
            }
        }
        else {
            $scope.nuevo = new Fiscal({
                nombre: '',
                apellido: '',
                sexo: '',
                mail: '',
                celular: '',
                domicilio: '',
                comuna: '',
                padrino: idPadrino,
                evento: $scope.contacto.evento
                
            });
            $("#modalContacto").modal('show');
        }
    };
    
    $scope.modificarContacto = function(confirmado, fiscal) {
        if (confirmado) {
            $scope.fiscalM.apellido = ($scope.fiscalM.apellido || '').toUpperCase();
            $scope.fiscalM.$save({}, function() {
                $scope.enviar($scope.fiscalM);
            });
        }
        else {
            $scope.fiscalM = fiscal;
            $("#modificaContacto").modal('show');
        }
    };
    
    $scope.enviar = function(fiscal) {
        $scope.enviando = true;
        var payload = {
            asunto: "Invitacion Sistema de Fiscales de Mesa",
            para: fiscal.mail,
            fiscalId: fiscal._id,
            patrocinador: fiscal.padrino,
            mensajeHtml: '<div class="mailwrapper" style="font-size: 17px; color: black; line-height: 100% !important;" ><b>' + $scope.contacto.nombre + ' ' + $scope.contacto.apellido + '</b> te invita a confirmar tus datos para participar en las próximas elecciones del 26 de Abril como fiscal de mesa, ingresando al siguiente link:<br><br><center><b> <a href="http://bagestion.gcba.gob.ar/fiscales/detalle/' + fiscal._id + '">Click acá</a></b></center><br><br> En caso de que tus datos no sean correctos, vas a poder modificarlos en el mismo sitio y luego enviarnos tu confirmación. <br><br>Vos también podes invitar a otros a participar, ingresando sus datos en la misma página. A ellos les llegara una invitación de tu parte, al correo electrónico personal que nos indiques. <br><br> En los próximos correos, te haremos llegar información acerca de la capacitación y posteriormente la comuna y la escuela donde llevaremos adelante la tarea. <br><br><br>Muchas gracias por participar..! <br><br>Por cualquier duda con el uso de la aplicación escribínos a sistema.fiscalizacion@gmail.com.</div>',
            adjunto : "",
            from : "Sistema Fiscalizacion <sistema.fiscalizacion@gmail.com>"
        };
        
        $http.post('/api/fiscales/enviar-mail', payload).success(function() {
            $scope.enviando = false;
            $("#mailEnviado").modal('show');
        }).error(function() {
            $scope.enviando = false;
            alert("Fallo el envio");
        });
    };
    
    //Guardar detalles
    $scope.guardar = function() {
        $scope.contacto.apellido = ($scope.contacto.apellido || '').toUpperCase();
        $scope.contacto.$save(function() {
            $scope.editando = false;
            angular.extend($scope.$parent.contacto, $scope.contacto);
            delete $scope.contacto;
        });
    };
    
    //Cancelar la edicion del contacto
    $scope.cancelar = function() {
        $scope.contacto = Fiscal.get({_id: $routeParams._id});
    };
    
    //Eliminar un contacto
    $scope.eliminar = function(confirmado) {
        if (confirmado){
            $scope.contacto.eliminado = true;
            $scope.contacto.$save(function(){
                $location.path('/fiscales');
            });
        }
        else {
            $("#modalEliminar").modal('show');
        }
    };
    
    //Verificar por dni / sexo duplicado
    $scope.$watch('contacto.dni + \' \' + contacto.sexo', function (nn) {
        if ($scope.contacto._id) {
            var otros = Fiscal.query({
                evento: $scope.contacto.evento,
                $or:JSON.stringify([{eliminado: {$exists:false}}]),
                dni: JSON.stringify({ "$regex" : $scope.contacto.dni, "$options" : "-i" }),
                sexo: JSON.stringify({ "$regex" : $scope.contacto.sexo, "$options" : "-i" })
            }, function () {
                var dup = false;
                var candidatos = [];
                
                for (var i = 0; i < otros.length; i++) {
                    // Sólo si es otro contacto _id != _id
                    if (otros[i]._id != $scope.contacto._id) {
                        dup = true;
                        candidatos.push(otros[i]);
                    }
                }
                
                $scope.dniDuplicadoCandidatos = candidatos;
                $scope.dniDuplicado = dup;
            });
        }
    });
    
    //Verificar por dni / sexo duplicado
    $scope.$watch('nuevo.dni + \' \' + nuevo.sexo', function (nn) {
        var otros = Fiscal.query({
            evento: $scope.contacto.evento,
            $or:JSON.stringify([{eliminado: {$exists:false}}]),
            dni: JSON.stringify({ "$regex" : $scope.nuevo.dni, "$options" : "-i" }),
            sexo: JSON.stringify({ "$regex" : $scope.nuevo.sexo, "$options" : "-i" })
        }, function () {
            var dup = false;
            var candidatos = [];
            
            for (var i = 0; i < otros.length; i++) {
                // Sólo si es otro contacto _id != _id
                if (otros[i]._id != $scope.nuevo._id) {
                    dup = true;
                    candidatos.push(otros[i]);
                }
            }
            
            $scope.dniDuplicadoCandidatosNuevo = candidatos;
            $scope.dniDuplicadoNuevo = dup;
        });
    });
    
//Nuevo contacto---------------------------------------------------------------------------------------------
}).controller('FiscalesNuevoCtrl', function($scope, $routeParams, $modal, $http, $location, Fiscal, Comuna) {
    //Lista de contactos
    $scope.contactos = Fiscal.query();
    
    //Nuevo contacto
    $scope.nuevo = new Fiscal({
        padrino: '',
        evento: $routeParams._id,
        sexo: '',
        nombre: '',
        apellido: '',
        comuna: '',
        domicilio: '',
        celular: '',
        mail: ''
    });
        
    $scope.comunas = Comuna.query();
    
    
    //Guardar contacto solo el id
    $scope.guardar = function() {
        if ($scope.nuevo.apellido && $scope.nuevo.nombre && $scope.nuevo.mail && $scope.nuevo.sexo && $scope.nuevo.dni) {
            $scope.nuevo.apellido = ($scope.nuevo.apellido || '').toUpperCase();
            $scope.nuevo.$save(function() {
                $scope.enviar($scope.nuevo);
                $location.path('/fiscales/detalle/' + $scope.nuevo._id);
            });
        } else {
            alert("Faltan cargar datos");
        }
    };
    
    $scope.enviar = function(fiscal) {
        $scope.enviando = true;
        var payload = {
            asunto: "Invitacion Sistema de Fiscales de Mesa",
            para: fiscal.mail,
            fiscalId: fiscal._id,
            patrocinador: fiscal.padrino,
            mensajeHtml: '<div class="mailwrapper" style="font-size: 17px; color: black; line-height: 100% !important;" >Te invitamos a confirmar tus datos para participar en las próximas elecciones del 26 de Abril como fiscal de mesa, ingresando al siguiente link:<br><br><center><b> <a href="http://bagestion.gcba.gob.ar/fiscales/detalle/' + fiscal._id + '">Click acá</a></b></center><br><br> En caso de que tus datos no sean correctos, vas a poder modificarlos en el mismo sitio y luego enviarnos tu confirmación. <br><br>Vos también podes invitar a otros a participar, ingresando sus datos en la misma página. A ellos les llegara una invitación de tu parte, al correo electrónico personal que nos indiques. <br><br> En los próximos correos, te haremos llegar información acerca de la capacitación y posteriormente la comuna y la escuela donde llevaremos adelante la tarea. <br><br><br>Muchas gracias por participar..! <br><br>Por cualquier duda con el uso de la aplicación escribínos a sistema.fiscalizacion@gmail.com.</div>',
            adjunto : "",
            from : "Sistema Fiscalizacion <sistema.fiscalizacion@gmail.com>"
        };
        
        $http.post('/api/fiscales/enviar-mail', payload).success(function() {
            $scope.enviando = false;
            $("#mailEnviado").modal('show');
        }).error(function() {
            $scope.enviando = false;
            alert("Fallo el envio");
        });
    };
    
    //Verificar por dni / sexo duplicado
    $scope.$watch('nuevo.dni + \' \' + nuevo.sexo', function (nn) {
        var otros = Fiscal.query({
            evento: $routeParams._id,
            $or:JSON.stringify([{eliminado: {$exists:false}}]),
            dni: JSON.stringify({ "$regex" : $scope.nuevo.dni, "$options" : "-i" }),
            sexo: JSON.stringify({ "$regex" : $scope.nuevo.sexo, "$options" : "-i" })
        }, function () {
            var dup = false;
            var candidatos = [];
            
            for (var i = 0; i < otros.length; i++) {
                // Sólo si es otro contacto _id != _id
                if (otros[i]._id != $scope.nuevo._id) {
                    dup = true;
                    candidatos.push(otros[i]);
                }
            }
            
            $scope.dniDuplicadoCandidatos2 = candidatos;
            $scope.dniDuplicado2 = dup;
        });
    });
    
    //--------------------------------------------------------------------------------------------------
}).controller('FiscalesNavBarCtrl', function($scope, $modal) {
    $scope.abrirModal = function () {
        $modal({template: '/views/fiscales/modalReporte.html', persist: true, show: true, scope: $scope.$new()});
    };
});