angular.module('bag2.crm', []).controller('CRMCtrl', function($scope, $modal, CRMContacto, ORMOrganigrama, $rootScope) { //Lista de contactos

    //Query del campo organigrama
    $scope.organigrama = ORMOrganigrama.query();
    $scope.jurisdiccionPorId = function (id) {
        for (var i = 0; i < $scope.organigrama.length; i++) {
            if ($scope.organigrama[i]._id == id){
                return $scope.organigrama[i];
            }
        }
    };
    
    //Ordenar por correo oficial
    $scope.valorCorreo = function(c) {
        if (c.correos) {
            for (var i = 0; i < c.correos.length; i++) {
                if (c.correos[i].nombre == 'Email personal') {
                    return c.correos[i].valor;
                }
            }
            return '';
        }
    };
    
    //Listado de contactos cargados
    $scope.contactos = CRMContacto.query({}, function() {
        angular.forEach($scope.contactos, function (c){
            if (c.organigrama) {
                c.dependencia = $scope.jurisdiccionPorId(c.organigrama);
            }
        });
    });
    
    $scope.letraSeleccionada = "Todos";
    $scope.abecedario = ("ABCDEFGHIJKLMNÑOPQRSTUVWXYZ").split("");
    $scope.letra = function (c) {
        if ($scope.letraSeleccionada != "Todos") {
            if (c && c.apellidos && c.apellidos.length > 0 && c.apellidos[0].toLowerCase() == $scope.letraSeleccionada.toLowerCase()) 
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
    
    //Modo edicion de contacto
    $scope.editar = function() {
        $scope.editando = true;
        $scope.contacto = angular.copy($scope.contacto);
    };
    
    //Ordenar por telefono conmutador
    $scope.valorCelular = function(c) {
        if (c.telefonos) {
            for (var i = 0; i < c.telefonos.length; i++) {
                if (c.telefonos[i].nombre == 'Celular personal') {
                    return c.telefonos[i].valor;
                }
            }
            return '';
        }
    };
    
    //Ordenar por correo
    $scope.valorCorreo = function(c) {
        if (c.correos) {
            for (var i = 0; i < c.correos.length; i++) {
                if (c.correos[i].nombre == 'Email personal') {
                    return c.correos[i].valor;
                }
            }
            return '';
        }
    };

//Detalle de contactos---------------------------------------------------------------------------------
}).controller('CRMDetalleCtrl', function($scope, $modal, $routeParams, $location, CRMContacto, ORMOrganigrama, CRMListaTelefonos, CRMListaCorreos, CRMListaRoles, CRMReporte, CRMListaTitulo, CRMServicios, Comuna, BloquePregunta, BarrioRegularizacionDominial) {
    $scope.actividad = [];
    
    //Query del contacto con el id
    $scope.contacto = CRMContacto.get({
        _id: $routeParams._id
    }, function() {
        $scope.reportes = CRMReporte.query({}, function() {
            $scope.reportes.forEach(function(item) {
                item.contactos.forEach(function(cont) {
                    if (cont.contactoId == $scope.contacto._id) {
                        $scope.actividad.push({reporteId: item._id,
                                                reporteNombre: item.nombre,
                                                contactado: cont.contactado,
                                                asistio: cont.asistio});
                    }
                });
            });
        });
    });

    $scope.findById = function (lista, id) {
        if (lista && lista.length && id) {
            for (var i = 0; i < lista.length; i++) {
                if (lista[i]._id == id) {
                    return lista[i];
                }
            }
        }
    };

    //Lista de contactos
    $scope.contactos = CRMContacto.query();

    //Setear el tab a abrir
    $scope.tab = 'identificacion',

    $scope.dependenciaSuperior = function(idOrgani) {
        if (idOrgani) {
            for (var i = 0; i < $scope.organigramaSuperior.length; i++) {
                if ($scope.organigramaSuperior[i]._id == idOrgani){
                    return $scope.organigramaSuperior[i].nombreCompleto;
                }
            }
        }
    };
        
    $scope.barrios = BarrioRegularizacionDominial.query(function() {
        $scope.barriosNombres = [];
        $scope.barrios.forEach(function(item) {
            $scope.barriosNombres.push(item.nombre);
        });
    });
        
    $scope.partidos = BloquePregunta.query(function() {
        $scope.partidosNombres = [];
        $scope.partidos.forEach(function(item) {
            $scope.partidosNombres.push(item.nombre);
        });
    });
        
    $scope.comunas = Comuna.query(function() {
        $scope.comunasNombres = [];
        $scope.comunas.forEach(function(item) {
            $scope.comunasNombres.push(item.nombre);
        });
    });
    
    $scope.jurisdiccionPorId = function (id) {
        for (var i = 0; i < $scope.organigramaSuperior.length; i++) {
            if ($scope.organigramaSuperior[i]._id == id){
                return $scope.organigramaSuperior[i];
            }
        }
    };
    
    $scope.contactoPorId = function (id) {
        for (var i = 0; i < $scope.contactos.length; i++) {
            if ($scope.contactos[i]._id == id){
                return $scope.contactos[i];
            }
        }
    };

    //Listado para el campo telefonos
    $scope.listaTelefonos = CRMListaTelefonos();

    //Listado para el campo correos
    $scope.listaCorreos = CRMListaCorreos();

    //Listado para el campo rol
    $scope.listaRoles = CRMListaRoles();

    //Listado para el campo titulo
    $scope.listaTitulo = CRMListaTitulo();

    //Lista de servicios
    $scope.listaServicios = CRMServicios();
    
    //Habilitar edicion
    $scope.editar = function() {
        $scope.editando = true;
        $scope.contacto = angular.copy($scope.contacto);
    };

    //Lista de organigrama
    //$scope.organigrama = ORMOrganigrama.list();
    
    //Query de organigrama y el id del campo superiorInmediato
    $scope.contacto = CRMContacto.get({_id: $routeParams._id}, function(){
        $scope.organigrama = ORMOrganigrama.get({_id: $scope.contacto.organigrama});
    });
    
    //Subir foto
    $scope.uploaded = [];
    $scope.$watch('uploaded', function () {
        if ($scope.uploaded.length > 0 && $scope.uploaded[0].ok) {
            $scope.contacto.foto = $scope.uploaded[0].id;
        }
    }, true);
    
    $scope.crearContacto = function(confirmado, contacto) {
        if (confirmado) {
            contacto.apellidos = (contacto.apellidos || '').toUpperCase();
            contacto.$save(function() {
                $scope.contactos = CRMContacto.query();
            });
        }
        else {
            $modal({template: '/views/crm/modalNuevoContacto.html', persist: true, show: true, scope: $scope.$new()});
        }
    };
    
    $scope.organigramaSuperior = ORMOrganigrama.query();
    
    //Guardar detalles
    $scope.guardar = function() {
        $scope.contacto.organigrama = $scope.contacto.organigrama,
        $scope.contacto.apellidos = ($scope.contacto.apellidos || '').toUpperCase();
        $scope.contacto.$save(function() {
            $scope.editando = false;
            angular.extend($scope.$parent.contacto, $scope.contacto);
            delete $scope.contacto;
        });
    };
    
    //Cancelar la edicion del contacto
    $scope.cancelar = function() {
        $scope.contacto = CRMContacto.get({_id: $routeParams._id});
    };
    
    //Eliminar un contacto
    $scope.eliminar = function(confirmado) {
        if (confirmado){
            $scope.contacto.eliminado = true;
            $scope.contacto.$save(function(){
                $location.path('/crm');
            });
        }
        else {
            $("#modalEliminar").modal('show');
        }
    };
    
    
    //Vincular un contacto
    $scope.vincular = function(confirmado, rol) {
        if (confirmado){
            $scope.contactoVinculo.roles.push($scope.dataRol);
            $scope.contactoVinculo.$save();
        }
        else {
            $scope.dataRol = {
                nombre: '',
                valor: $scope.contacto._id,
            };
            $("#modalVincular").modal('show');
        }
    };
    
    //Eliminar un contacto
    $scope.abrirContacto = function(idContacto) {
        $scope.contactoModal = $scope.findById($scope.contactos, idContacto);
        $scope.organigramaModal = ORMOrganigrama.get({_id: $scope.contactoModal.organigrama});
        $("#modalContacto").modal('show');
    };

    //Agregar telefonos
    $scope.agregarTelefonos = function(dataTelefonos) {
        if (!$scope.contacto.telefonos) {

        }
        else {
            $scope.contacto.telefonos.push($scope.dataTelefonos);
            $scope.dataTelefonos = {
                nombre: '',
                valor: '',
                interno: '',
                checked: '',
            };
        }
    };

    //Agregar correos
    $scope.agregarCorreos = function(dataCorreos) {
        if (!$scope.contacto.correos) {

        }
        else {
            $scope.contacto.correos.push($scope.dataCorreos);
            $scope.dataCorreos = {
                nombre: '',
                valor: '',
            };
        }
    };

    //Agregar direcciones
    $scope.agregarDireccion = function(dataDireccion) {
        if (!$scope.contacto.direcciones) {

        }
        else {
            $scope.dataDireccion.valorCalle = $('#calle-typeahead').val();
            $scope.contacto.direcciones.push($scope.dataDireccion);
            $scope.dataDireccion = {
                nombre: '',
                valorCalle: '',
                valorAltura: '',
                valorBarrio: '',
            };
        }
    };

    //Agregar servicios a la lista del contacto
    $scope.agregarServicios = function(dataServicio) {
        if (!$scope.contacto.servicios) {

        }
        else {
            $scope.contacto.servicios.push($scope.dataServicio);
            $scope.dataServicio = {
                nombre: '',
                pin: '',
            };
        }
    };

    //Agregar nuevo rol
    $scope.agregarRol = function(dataRol) {
        if (!$scope.contacto.roles) {

        }
        else {
            $scope.contacto.roles.push($scope.dataRol);
            $scope.dataRol = {
                nombre: '',
                valor: '',
            };
        }
    };

    //Eliminar elementos de las listas
    $scope.eliminarListaElem = function(elemento, lista) {
        lista.splice(lista.indexOf(elemento), 1);
    };
    
    //Verificar por nombre / apellido duplicado
    $scope.$watch('contacto.nombre + \' \' + contacto.apellidos', function (nn) {
        if ($scope.contacto._id) {
            var otros = CRMContacto.query({
                $or:JSON.stringify([{eliminado: {$exists:false}}]),
                nombre: JSON.stringify({ "$regex" : $scope.contacto.nombre, "$options" : "-i" }),
                apellidos: JSON.stringify({ "$regex" : $scope.contacto.apellidos, "$options" : "-i" })
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
                
                $scope.nombreDuplicadoCandidatos = candidatos;
                $scope.nombreDuplicado = dup;
            });
        }
    });
    
    // Buscar email duplicado
    $scope.$watch('contacto.correos', function () {
       if ($scope.contacto && $scope.contacto.correos && $scope.contacto.correos.length > 0) {
           var candidatos = [];
           
           for (var i = 0; i < $scope.contacto.correos.length; i++) {
               var emailObj = $scope.contacto.correos[i];
               
               if (emailObj.nombre == 'Email oficial') {
                   var otros = CRMContacto.query({
                       $or:JSON.stringify([{eliminado: {$exists:false}}]),
                       "correos": JSON.stringify({ $elemMatch: { valor: emailObj.valor } })
                   }, function () {
                       for (var j = 0; j < otros.length;j ++) {
                           if (otros[j]._id != $scope.contacto._id) {
                               candidatos.push(otros[j]);
                           }
                       }
                       
                       $scope.emailDuplicado = candidatos.length > 0;
                       $scope.emailDuplicadoCandidatos = candidatos;
                   });
                   
                   break;
               }
               
               $scope.emailDuplicado = false;
               $scope.emailDuplicadoCandidatos = [];
           }
       } else {
           $scope.emailDuplicado = false;
       }
    }, true);
    
    
    $scope.comprobarOrgani = function(enorganigrama){
        if($scope.contacto.enorganigrama == {$exists:false}){
            return alert("no");
        }
    };
    
//Nuevo contacto---------------------------------------------------------------------------------------------
}).controller('CRMNuevoCtrl', function($scope, $modal, $location, CRMContacto, ORMOrganigrama, CRMListaTelefonos, CRMListaCorreos, CRMListaRoles, CRMListaTitulo, CRMServicios, BarrioRegularizacionDominial, Comuna, BloquePregunta) {
    //Lista de contactos
    $scope.contactos = CRMContacto.query();
    
    //Nuevo contacto
    $scope.nuevo = new CRMContacto({
        servicios: [],
        telefonos: [],
        correos: [],
        direcciones: [],
        roles: [],
    });

    //Setear el tab a abrir
    $scope.tab = 'identificacion',

    //Lista de organigrama
    $scope.organigrama = ORMOrganigrama.list();
    
    $scope.crearContacto = function(confirmado, contacto) {
        if (confirmado) {
            contacto.apellidos = (contacto.apellidos || '').toUpperCase();
            contacto.$save();

            $scope.contactos = CRMContacto.query();
        }
        else {
            $modal({template: '/views/modalNuevoContacto.html', persist: true, show: true, scope: $scope.$new()});
        }
    };
        
    $scope.barrios = BarrioRegularizacionDominial.query(function() {
        $scope.barriosNombres = [];
        $scope.barrios.forEach(function(item) {
            $scope.barriosNombres.push(item.nombre);
        });
    });
        
    $scope.partidos = BloquePregunta.query(function() {
        $scope.partidosNombres = [];
        $scope.partidos.forEach(function(item) {
            $scope.partidosNombres.push(item.nombre);
        });
    });
        
    $scope.comunas = Comuna.query(function() {
        $scope.comunasNombres = [];
        $scope.comunas.forEach(function(item) {
            $scope.comunasNombres.push(item.nombre);
        });
    });

    //Listado para el campo telefonos
    $scope.listaTelefonos = CRMListaTelefonos();

    //Listado para el campo correos
    $scope.listaCorreos = CRMListaCorreos();

    //Listado para el campo rol
    $scope.listaRoles = CRMListaRoles();

    //Listado para el campo titulo
    $scope.listaTitulo = CRMListaTitulo();

    //Lista de servicios
    $scope.listaServicios = CRMServicios();
    
    $scope.dependenciaSuperior = function(idOrgani) {
        if (idOrgani) {
            for (var i = 0; i < $scope.organigrama.length; i++) {
                if ($scope.organigrama[i]._id == idOrgani){
                    return $scope.organigrama[i].nombreCompleto;
                }
            }
        }
    };
    
    $scope.jurisdiccionPorId = function (id) {
        for (var i = 0; i < $scope.organigrama.length; i++) {
            if ($scope.organigrama[i]._id == id){
                return $scope.organigrama[i];
            }
        }
    };

    $scope.findById = function (lista, id) {
        if (lista && lista.length && id) {
            for (var i = 0; i < lista.length; i++) {
                if (lista[i]._id == id) {
                    return lista[i];
                }
            }
        }
    };

    //Subir nueva foto
    $scope.uploaded = [];
    $scope.$watch('uploaded', function() {
        if ($scope.uploaded.length > 0 && $scope.uploaded[0].ok) {
            $scope.nuevo.foto = $scope.uploaded[0].id;
        }
    }, true);

    //Agregar nuevos telefonos
    $scope.agregarTelefonos = function(dataTelefonos) {
        $scope.nuevo.telefonos.push($scope.dataTelefonos);
        $scope.dataTelefonos = {
            nombre: '',
            valor: '',
            interno: '',
        };
    };

    //Agregar nuevos correos
    $scope.agregarCorreos = function(dataCorreos) {
        $scope.nuevo.correos.push($scope.dataCorreos);
        $scope.dataCorreos = {
            nombre: '',
            valor: '',
        };
    };

    //Agregar nueva direccion
    $scope.agregarDireccion = function(dataDireccion) {
        $scope.dataDireccion.valorCalle = $('#calle-typeahead').val();
        $scope.nuevo.direcciones.push($scope.dataDireccion);
        $scope.dataDireccion = {
            valorCalle: '',
            valorAltura: '',
            valorBarrio: '',
            valorProvincia: '',
        };
    };

    //Agregar nuevos servicios
    $scope.agregarServicios = function(dataServicio) {
        if (!$scope.nuevo.servicios) {
            $scope.nuevo.servicios = [];
        }
        else {
            $scope.nuevo.servicios.push($scope.dataServicio);
            $scope.dataServicio = {
                nombre: '',
                pin: '',
            };
        }
    };

    //Agregar nuevo rol
    $scope.agregarRol = function(dataRol) {
        $scope.nuevo.roles.push($scope.dataRol);
        $scope.dataRol = {
            nombre: '',
            valor: '',
        };
    };
    
    
    //Guardar contacto solo el id
    $scope.guardar = function() {
        $scope.organigrama = $scope.nuevo.organigrama,
        $scope.nuevo.apellidos = ($scope.nuevo.apellidos || '').toUpperCase();
        $scope.nuevo.$save(function() {
            $location.path('/crm/detalle/' + $scope.nuevo._id);
        });
    };
    
    
    
    //Eliminar elementos de las listas
    $scope.eliminarListaElem = function(elemento, lista) {
        lista.splice(lista.indexOf(elemento), 1);
    };
    
    //Verificar por nombre / apellido duplicado
    $scope.$watch('nuevo.nombre + \' \' + nuevo.apellidos', function (nn) {
        var otros = CRMContacto.query({
            $or:JSON.stringify([{eliminado: {$exists:false}}]),
            nombre: JSON.stringify({ "$regex" : $scope.nuevo.nombre, "$options" : "-i" }),
            apellidos: JSON.stringify({ "$regex" : $scope.nuevo.apellidos, "$options" : "-i" })
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
            
            $scope.nombreDuplicadoCandidatos = candidatos;
            $scope.nombreDuplicado = dup;
        });
    });
    
    //Buscar email duplicado
    $scope.$watch('nuevo.correos', function () {
       if ($scope.nuevo && $scope.nuevo.correos && $scope.nuevo.correos.length > 0) {
           var candidatos = [];
           
           for (var i = 0; i < $scope.nuevo.correos.length; i++) {
               var emailObj = $scope.nuevo.correos[i];
               
               if (emailObj.nombre == 'Email oficial') {
                   var otros = CRMContacto.query({
                       $or:JSON.stringify([{eliminado: {$exists:false}}]),
                       "correos": JSON.stringify({ $elemMatch: { valor: emailObj.valor } })
                   }, function () {
                       for (var j = 0; j < otros.length;j ++) {
                           if (otros[j]._id != $scope.nuevo._id) {
                               candidatos.push(otros[j]);
                           }
                       }
                       
                       $scope.emailDuplicado = candidatos.length > 0;
                       $scope.emailDuplicadoCandidatos = candidatos;
                   });
                   
                   break;
               }
               
               $scope.emailDuplicado = false;
               $scope.emailDuplicadoCandidatos = [];
           }
       } else {
           $scope.emailDuplicado = false;
       }
    }, true);
    
    //--------------------------------------------------------------------------------------------------
}).controller('CRMNavBarCtrl', function($scope, CRMContacto, CRMReporte, $modal) {
    $scope.abrirModal = function () {
        $modal({template: '/views/crm/modalReporte.html', persist: true, show: true, scope: $scope.$new()});
    };
}).controller('CRMReportesCtrl', function($scope, CRMContacto, CRMReporte, $modal) {
    $scope.reportes = CRMReporte.query();
    $scope.contactoPorId = function (id) {
        for (var i = 0; i < $scope.contactos.length; i++) {
            if ($scope.contactos[i]._id == id){
                return $scope.contactos[i];
            }
        }  
    };
    
    $scope.abrirModal = function () {
        $modal({template: '/views/crm/modalReporte.html', persist: true, show: true, scope: $scope.$new()});
    };
}).controller('CRMNuevoReporteCtrl', function($scope, CRMContacto, CRMReporte) {
    $scope.contactos = CRMContacto.query();
    $scope.reporte = new CRMReporte();
    $scope.$watch('[reporte.sexo,reporte.enGobierno,reporte.afiliado]', function () {
        $scope.contactos = CRMContacto.query({
            sexo : $scope.reporte.sexo,
            enGobierno : $scope.reporte.enGobierno,
            afiliado : $scope.reporte.afiliado
        });
    }, true);
    
    $scope.crearReporte = function () {
        $scope.reporte.fecha = (new Date()).getTime();
        $scope.reporte.contactos = [];
        angular.forEach($scope.contactos, function (c){
            $scope.reporte.contactos.push({contactoId : c._id, contactado : 'No'});
        });
        $scope.reporte.$save();
    };
    
}).controller('CRMDetalleReporteCtrl', function($scope, $routeParams, CRMContacto, CRMReporte, $http, $location) {
    $scope.reporte = CRMReporte.get({
        _id: $routeParams._id
    });
    $scope.contactos = CRMContacto.query();
    $scope.contactoPorId = function (id) {
        for (var i = 0; i < $scope.contactos.length; i++) {
            if ($scope.contactos[i]._id == id){
                return $scope.contactos[i];
            }
        }  
    };
    
    //Habilitar edicion
    $scope.editar = function() {
        $scope.editando = true;
    };
    
    $scope.guardar = function() {
        $scope.reporte.$save();
        $scope.editando = false;
    };
    
    //Ordenar por telefono conmutador
    $scope.valorCelular = function(c) {
        if (c.telefonos) {
            for (var i = 0; i < c.telefonos.length; i++) {
                if (c.telefonos[i].nombre == 'Celular personal') {
                    return c.telefonos[i].valor;
                }
            }
            return '';
        }
    };
    
    //Ordenar por correo
    $scope.valorCorreo = function(c) {
        if (c.correos) {
            for (var i = 0; i < c.correos.length; i++) {
                if (c.correos[i].nombre == 'Email personal') {
                    return c.correos[i].valor;
                }
            }
            return '';
        }
    };
    
    $scope.modalMail = function(c) {
        $scope.asunto = "";
        $scope.texto = "";
        
        $("#modalMail").modal('show');
    };
    
    $scope.uploadedFile = [];
    
    $scope.enviar = function() {
        $scope.enviando = true;
        if ($scope.uploadedFile.length) {
            var adjunto = "/uploads/" + $scope.uploadedFile.shift().id;
        } else {
            var adjunto = "";
        }
        var payload = {
            asunto: $scope.asunto,
            para: $scope.reporte.contactos,
            reporteId: $scope.reporte._id,
            mensajeHtml: $scope.texto,
            adjunto : adjunto,
            from : $scope.nombreFrom + " <" + $scope.mailFrom + ">"
        };
        
        $http.post('/api/crm/enviar-mail', payload).success(function() {
            $scope.enviando = false;
            $location.url('/crm/reportes/' + $scope.reporte._id);
        }).error(function() {
            $scope.enviando = false;
            alert("Fallo el envio");
        });
    };
    
}).value('CRMListaTelefonos', function() { //Listado de telefonos
    return [{
        nombre: 'Telefono personal'
    }, {
        nombre: 'Telefono laboral'
    }, {
        nombre: 'Celular personal'
    }, {
        nombre: 'Celular laboral'
    }, ];
}).value('CRMListaCorreos', function() { //Listado de correos
    return [{
        nombre: 'Email personal'
    }, {
        nombre: 'Email laboral'
    }, ];
}).value('CRMListaRoles', function() { //Listado de roles
    return [{
        nombre: 'Presentado por...'
    }, {
        nombre: 'Secretaria'
    }, {
        nombre: 'Asistente'
    }, {
        nombre: 'Jefe de gabinete'
    }, {
        nombre: 'Asesor'
    }, {
        nombre: 'Funcionario'
    }, ];
}).value('CRMListaTitulo', function() { //Listado de roles
    return [{
        nombre: 'Dr.'
    }, {
        nombre: 'Dra.'
    }, {
        nombre: 'Dir.'
    }, {
        nombre: 'Lic.'
    }, {
        nombre: 'Ing.'
    }, {
        nombre: 'Arq.'
    }, {
        nombre: 'Pres.'
    }, ];
}).value('CRMServicios', function() { //Listado de roles
    return [{
        nombre: 'BBM'
    }, {
        nombre: 'Skype'
    }, {
        nombre: 'Nextel'
    }, ];
});