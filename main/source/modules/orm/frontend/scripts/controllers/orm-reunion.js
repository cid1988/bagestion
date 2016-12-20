angular.module('bag2.orm-reunion', ["bag2.orm", "bag2.restApi"])
.controller("ORMReunionDetalleCtrl", function ($scope, $routeParams, ORMReunion, ORMInstanciaReunion, ORMOrganigrama, ORMGrupoReunion, ORMTema, ORMColoresPorTipo, Contactos, ORMContacto, $rootScope, $modal, $window, ORMPrioridades) {
    $scope.contactos = Contactos.listar();
    $scope.prioridades = ORMPrioridades.query();
    
    $scope.fechasReuniones = ORMInstanciaReunion.query({
        reunion : $routeParams._id
    });
    
    $scope.filtroRol=function(persona)
    {
        switch(persona.clasificacion)
        {
            case "responsable":
                return 1;
            case "jefeGabinete":
                return 2;
            case "ejecutivo":
                return 3;
            case "participante":
                return 4;
            case "legislador":
                return 5;
            case "privada":
                return 6;
            case "gestion":
                return 7;
            case "exclusivo":
                return 8;
            case "otros":
                return 9;
            default:
                return 10;
        }
    };
    
    $scope.citaParaLlamados = [];
    
    
    $scope.contactoPorId = function (id) {
      for (var i = 0; i < $scope.contactos.length; i++) {
          if ($scope.contactos[i]._id == id)
          {
              return $scope.contactos[i];
          }
      }  
    };
    
    $scope.prioridadPorId = function(id){
        for (var i = 0; i < $scope.prioridades.length; i++) {
            if($scope.prioridades[i]._id == id){
                return $scope.prioridades[i];
            }
        }
    };
    
    $scope.imprimir = function () {
        $window.print(); 
    };
    
    $scope.jurisdiccionPorId = function (id) {
      for (var i = 0; i < $scope.jurisdicciones.length; i++) {
          if ($scope.jurisdicciones[i]._id == id)
          {
              return $scope.jurisdicciones[i];
          }
      }  
    };
    
    $scope.grupoPorId = function (id) {
      for (var i = 0; i < $scope.gruposReuniones.length; i++) {
          if ($scope.gruposReuniones[i]._id == id)
          {
              return $scope.gruposReuniones[i];
          }
      }  
    };
    
    $scope.frecuenciaPorValor = function (valor) {
      if (valor == "2meses") {
          return "Cada dos meses";
      } else if (valor == "1mes") {
          return "Cada un mes";
      } else if (valor == "3semanas") {
          return "Cada tres semanas";
      } else if (valor == "2semanas") {
          return "Cada dos semanas";
      } else if (valor == "1semana") {
          return "Cada una semana";
      } else if (valor == "aPedido") {
          return "A pedido";
      } else {
          return "";
      }
    };
    
    $scope.tipoPorValor = function (valor) {
      if (valor == "seguimiento") {
          return "Seguimiento";
      } else if (valor == "transversales") {
          return "Transversales";
      } else if (valor == "especificas") {
          return "Especificas";
      } else if (valor == "planeamiento") {
          return "Planeamiento";
      } else if (valor == "presupuesto") {
          return "Presupuesto";
      } else if (valor == "coordinacion") {
          return "Coordinación";
      } else if (valor == "planLargoPlazo") {
          return "Plan Largo Plazo";
      } else if (valor == "proyectosEspeciales") {
          return "Proyectos Especiales";
      } else if (valor == "eventuales") {
          return "Eventuales";
      } else {
          return "";
      }
    };
    
    $scope.segmentoPorValor = function (valor) {
      if (valor == "infraestructura") {
          return "Infraestructura";
      } else if (valor == "social") {
          return "Social";
      } else {
          return "";
      }
    };
    
    $scope.filtroGrupo = function (grupo) {
      if (grupo.tipo == $scope.reunion.tipo) {
          return true;
      } else {
          return false;
      }
    };
    
    $scope.permiso = function (tipo) {
        switch(tipo)
        {
            case "seguimiento":
                return $scope.hasPermission('orm.seguimiento');
            case "transversales":
                return $scope.hasPermission('orm.transversales');
            case "especificas":
                return $scope.hasPermission('orm.especificas');
            case "planeamiento":
                return $scope.hasPermission('orm.planeamiento');
            case "presupuesto":
                return $scope.hasPermission('orm.presupuesto');
            case "coordinacion":
                return $scope.hasPermission('orm.coordinacion');
            case "planLargoPlazo":
                return $scope.hasPermission('orm.planLargoPlazo');
            case "proyectosEspeciales":
                return $scope.hasPermission('orm.proyectosEspeciales');
            case "eventuales":
                return $scope.hasPermission('orm.eventuales');
        }
    };
    
    $scope.buscarTelefono = function(nombre, contacto) {
        if (!contacto.telefonos) {
            return "";
        }
        else {
            for (var i = 0; i < contacto.telefonos.length; i++) {
                var em = contacto.telefonos[i];

                if ((em.nombre == nombre) && (em.interno)) {
                    return em.valor + " Int. " + em.interno;
                } else if (em.nombre == nombre) {
                    return em.valor;
                }
            }
        }

        return "";
    };
    
    $scope.reunionPorId = function (id) {
      for (var i = 0; i < $scope.reuniones.length; i++) {
          if ($scope.reuniones[i]._id == id)
          {
              return $scope.reuniones[i];
          }
      }  
    };
    
    $scope.importarDatos = function(confirmado) {
        if (confirmado) {
            if ($scope.reunionImportar) {
                $scope.reunionImportar = $scope.reunionPorId($scope.reunionImportar);
                $scope.reunion.participantes = $scope.reunionImportar.participantes;
                $scope.reunion.llamados = $scope.reunionImportar.llamados;
                $scope.reunion.cita = $scope.reunionImportar.cita;
                $scope.reunion.temario = $scope.reunionImportar.temario;
                $scope.reunion.minuta = $scope.reunionImportar.minuta;
                $scope.reunion.propuesta = $scope.reunionImportar.propuestaTemario;
            }
        }
        else {
            $scope.reunionImportar = "";
            $scope.reuniones = ORMReunion.query();
            $("#importarReunion").modal('show');
        }
    };
    
    $scope.tab = "participantes";
    
    /*$scope.eliminarParticipante = function (p) {
      $scope.reunion.participantes.splice($scope.reunion.participantes.indexOf(p), 1);
    };*/
    $scope.eliminarParticipante = function (p) {
        for(var i=0; i<$scope.listaTotal.length; i++)
        {
            if(p.contactoId == $scope.listaTotal[i].contactoId)
            {
                $scope.listaTotal.splice(i,1);
                break;
            }
        }
      //$scope.reunion.participantes.splice($scope.reunion.participantes.indexOf(p), 1);
    };
    
    $scope.eliminarLlamado = function (p) {
      $scope.reunion.llamados.splice($scope.reunion.llamados.indexOf(p), 1);
    };
    
    $scope.eliminarCalendario = function (p) {
      $scope.reunion.calendario.splice($scope.reunion.calendario.indexOf(p), 1);
    };
    
    $scope.eliminarTema = function (p) {
      $scope.reunion.temas.splice($scope.reunion.temas.indexOf(p), 1);
    };
    
    $scope.subir = function (p) {
      var posicion = $scope.reunion.participantes.indexOf(p);
      if (posicion > 0) {
          $scope.reunion.participantes.splice(posicion, 1);
          $scope.reunion.participantes.splice(posicion - 1,0,p);
      }
    };
    
    $scope.subirLlamado = function (p) {
      var posicion = $scope.reunion.llamados.indexOf(p);
      if (posicion > 0) {
          $scope.reunion.llamados.splice(posicion, 1);
          $scope.reunion.llamados.splice(posicion - 1,0,p);
      }
    };
    $scope.edit = function () {
        $scope.editando = true;
    };
    
    $scope.noEstaEnArray = function (c) {
        var vuelta = true;
        angular.forEach($scope.reunion.llamados, function (ll) {
            if (ll.contactoId == c.contactoId) {
                vuelta = false;
            }
        });
        return vuelta;
    };

/*
    $scope.save = function () {
        if (!$scope.reunion.llamados) {
            $scope.reunion.llamados = [];
        }
        angular.forEach($scope.citaParaLlamados, function (c) {
            if ($scope.noEstaEnArray(c)) {
                $scope.reunion.llamados.push(c);
            }
        });
        if ($scope.reunion.frecuencia) {
            $scope.reunion.$save(function() {
                $scope.editando = false;
                $scope.citaParaLlamados = [];
            });
        } else {
            alert("Falta ingresar una frecuencia");
        }
    };
*/
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@Alex: Esta seccion fue hecha para realizar la carga unificada
//@Alex: Se le envia el objeto, el campo a modificar y el valor que deberia tener.
//Si lo encuentra en la lista, solo le agrega el campo con el valor indicado, caso contrario lo crea.
    function agregarALaLista(persona, campo, valor)
    {
      if($scope.listaTotal.length>0)
      {
         for(var x=0; x<$scope.listaTotal.length; x++)
         {
            if($scope.listaTotal[x].contactoId == persona.contactoId)
            {
               $scope.listaTotal[x][campo]=valor;
               break;
            }
            else
            {
               if(x==$scope.listaTotal.length-1)
               {
                  pushearPersona(persona,campo,valor);
               }
            }
         }
      }
      else
      {
         pushearPersona(persona,campo,valor);
      }
   };
   
    //@Alex: Cuando no encuentra el registro, tiene que hacer un push a la lista.
    function pushearPersona(persona, campo, valor)
    {
      switch(campo)
      {
         case "participantes":
            $scope.listaTotal.push({
               contactoId:persona.contactoId,
               participantes:valor,
               c:Contactos.buscarPorId(persona.contactoId),
               star:persona.star,
               clasificacion:persona.clasificacion
            });
            break;
         case "llamados":
            $scope.listaTotal.push({
               contactoId:persona.contactoId,
               llamados:valor,
               c:Contactos.buscarPorId(persona.contactoId),
               star:persona.star,
               clasificacion:persona.clasificacion
            });
            break;
         case "cita":
            $scope.listaTotal.push({
               contactoId:persona.contactoId,
               cita:valor,
               c:Contactos.buscarPorId(persona.contactoId),
               star:persona.star,
               clasificacion:persona.clasificacion
            });
            break;
         case "temario":
            $scope.listaTotal.push({
               contactoId:persona.contactoId,
               temario:valor,
               c:Contactos.buscarPorId(persona.contactoId),
               star:persona.star,
               clasificacion:persona.clasificacion
            });
            break;
         case "minuta":
            $scope.listaTotal.push({
               contactoId:persona.contactoId,
               minuta:valor,
               c:Contactos.buscarPorId(persona.contactoId),
               star:persona.star,
               clasificacion:persona.clasificacion
            });
            break;
         case "propuestaTemario":
            $scope.listaTotal.push({
               contactoId:persona.contactoId,
               propuestaTemario:valor,
               c:Contactos.buscarPorId(persona.contactoId),
               star:persona.star,
               clasificacion:persona.clasificacion
            });
            break;
      }
   };
   
    //@Alex: Cambiar tipo de Envio de los botones: No, Para, CC, CCO.
    $scope.cambiarTipoEnvio=function(persona,tipo)
    {
        //@Alex: Basandose en el contenido del tipo, lo cambia de lista.
        switch(persona[tipo])
        {
            case "para":
                $scope.listaTotal[$scope.listaTotal.indexOf(persona)][tipo]="cc";
                break;
            case "cc":
                $scope.listaTotal[$scope.listaTotal.indexOf(persona)][tipo]="cco";
                break;
            case "cco":
                $scope.listaTotal[$scope.listaTotal.indexOf(persona)][tipo]=false;
                break;
            default:
                $scope.listaTotal[$scope.listaTotal.indexOf(persona)][tipo]="para";
                break;
        }
        
    };
    
    $scope.cambiarLlamado=function(persona)
    {
        if(persona.llamados)
        {
            $scope.listaTotal[$scope.listaTotal.indexOf(persona)].llamados=false;
        }
        else
        {
            $scope.listaTotal[$scope.listaTotal.indexOf(persona)].llamados="Si";
        }
    };
    
    $scope.recargarLista=function()
    {
        $scope.listaTotal=[];
        $scope.reunion = ORMReunion.findById({ _id : $routeParams._id},function(){{
            $scope.reunion.participantes.forEach(function (i){
                agregarALaLista(i,"participantes",true);
            });
            $scope.reunion.llamados.forEach(function(i){
                agregarALaLista(i,"llamados","Si");
            });
            $scope.reunion.cita.para.forEach(function(i){
                agregarALaLista(i,"cita","para");
            });
            $scope.reunion.cita.cc.forEach(function(i){
                agregarALaLista(i,"cita","cc");
            });
            $scope.reunion.cita.cco.forEach(function(i){
                agregarALaLista(i,"cita","cco");
            });
            $scope.reunion.temario.para.forEach(function(i){
                agregarALaLista(i,"temario","para");
            });
            $scope.reunion.temario.cc.forEach(function(i){
                agregarALaLista(i,"temario","cc");
            });
            $scope.reunion.temario.cco.forEach(function(i){
                agregarALaLista(i,"temario","cco");
            });
            $scope.reunion.minuta.para.forEach(function(i){
                agregarALaLista(i,"minuta","para");
            });
            $scope.reunion.minuta.cc.forEach(function(i){
                agregarALaLista(i,"minuta","cc");
            });
            $scope.reunion.minuta.cco.forEach(function(i){
                agregarALaLista(i,"minuta","cco");
            });
            $scope.reunion.propuestaTemario.para.forEach(function(i){
                agregarALaLista(i,"propuestaTemario","para");
            });
            $scope.reunion.propuestaTemario.cc.forEach(function(i){
                agregarALaLista(i,"propuestaTemario","cc");
            });
            $scope.reunion.propuestaTemario.cco.forEach(function(i){
                agregarALaLista(i,"propuestaTemario","cco");
            });
        }});
    }
    
    //@Alex: Vacia los arrays del objeto traido de al BD, y le inserta los que estan en memoria.
    $scope.save = function (){
       
        //@Santi - 11-3
        $scope.reunion.cita = {};
        $scope.reunion.temario = {};
        $scope.reunion.minuta = {};
        $scope.reunion.propuestaTemario = {};
    
        //@Alex: Vaciamos los arrays para poder pushear al guardar sin tener que revisar que ya existan
        $scope.reunion.participantes=[];
        $scope.reunion.llamados=[];
        $scope.reunion.cita={};
        $scope.reunion.cita.para=[];
        $scope.reunion.cita.cc=[];
        $scope.reunion.cita.cco=[];
        $scope.reunion.temario={};
        $scope.reunion.temario.para=[];
        $scope.reunion.temario.cc=[];
        $scope.reunion.temario.cco=[];
        $scope.reunion.minuta={};
        $scope.reunion.minuta.para=[];
        $scope.reunion.minuta.cc=[];
        $scope.reunion.minuta.cco=[];
        $scope.reunion.propuestaTemario={};
        $scope.reunion.propuestaTemario.para=[];
        $scope.reunion.propuestaTemario.cc=[];
        $scope.reunion.propuestaTemario.cco=[];
        
        //@Alex: Pasaje de memoria al objeto de la BD para poder guardarlo en el mismo fomato.
        var camposPosibles=["cita","temario","minuta","propuestaTemario"];
        $scope.listaTotal.forEach(function (item) {
            camposPosibles.forEach(function (campo){
                if(item[campo])
                {   
                    //@Alex: De esta forma se pushea de forma dinamina en distinos arrays evitando multiples "if"
                    $scope.reunion[campo][item[campo]].push({
                        contactoId: item.contactoId,
                        star:item.star,
                        clasificacion:item.clasificacion
                    });
                }
            });
            if(item.participantes)
            {
                $scope.reunion.participantes.push({
                    contactoId: item.contactoId,
                    star:item.star,
                    clasificacion:item.clasificacion
                });
            }
            if(item.llamados=="Si")
            {
                $scope.reunion.llamados.push({
                    contactoId: item.contactoId,
                    star:item.star,
                    clasificacion:item.clasificacion
                });
            }
        });
        
        //@Alex: Luego de guardar, vuelve a recargar el $scope.
        if ($scope.reunion.frecuencia) 
        {
            $scope.reunion.$save(function() {
                $scope.editando = false;
                $scope.recargarLista();
                $scope.citaParaLlamados = [];
            });
        } else {
            alert("Falta ingresar una frecuencia");
        }
    };
    
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@Alex: Fin carga unificada.

    $scope.gruposReuniones = ORMGrupoReunion.query();
    $scope.jurisdicciones = ORMOrganigrama.query();
    $scope.temas = ORMTema.query();
/*
    $scope.reunion = ORMReunion.findById({
        _id: $routeParams._id
    }, function () {
        
        if (!angular.isArray($scope.reunion.participantes)) {
            $scope.reunion.participantes = [];
        }

        if (!$scope.reunion.cita) {
            $scope.reunion.cita = {
                para: [],
                cc: [],
                cco: [],
                exclusivos: []
            };
        }

        if (!$scope.reunion.temario) {
            $scope.reunion.temario = {
                para: [],
                cc: [],
                cco: [],
                exclusivos: []
            };
        }
        if (!$scope.reunion.minuta) {
            $scope.reunion.minuta = {
                para: [],
                cc: [],
                cco: [],
                exclusivos: []
            };
        }
        if (!$scope.reunion.propuestaTemario) {
            $scope.reunion.propuestaTemario = {
                para: [],
                cc: [],
                cco: [],
                exclusivos: []
            };
        }
    });
   */ 
    $scope.mostrarTema = function (r) {
        if (r.eliminado) {
            return false; 
        } else {
            return true;
        }
    };
    
    $scope.switchStar = function(contacto) {
        if (contacto.star) {
            contacto.star = false;
        } else {
            contacto.star = true;
        }
    };
    
    $scope.buscarCorreo = function(nombre, contacto) {
        if (!contacto.correos) {
            return "";
        }
        else {
            for (var i = 0; i < contacto.correos.length; i++) {
                var em = contacto.correos[i];

                if (em.nombre == nombre) {
                    return em.valor;
                }
            }
        }

        return "";
    };
    
    $scope.quitar = function (p, array) {
        array && p && array.splice(array.indexOf(p), 1);
    };
    
    $scope.$watch('reunion.participantes', function (participantes){
        $scope.vistaParticipantes = {
            responsable: [],
            jefeGabinete: [],
            ejecutivo: [],
            otros: [],
            participante: [],
            privada: [],
            gestion: [],
            exclusivo: [],
            legislador: []
        };

        if (participantes) {
            angular.forEach(participantes, function (p){
                // @diego: Por default, lo mandamos a 'otros'
                var donde = $scope.vistaParticipantes.otros;

                if (p.clasificacion == 'responsable') {
                    donde = $scope.vistaParticipantes.responsable;
                } else if (p.clasificacion == 'jefeGabinete') {
                    donde = $scope.vistaParticipantes.jefeGabinete;
                } else if (p.clasificacion == 'ejecutivo') {
                    donde = $scope.vistaParticipantes.ejecutivo;
                } else if (p.clasificacion == 'participante') {
                    donde = $scope.vistaParticipantes.participante;
                } else if (p.clasificacion == 'gestion') {
                    donde = $scope.vistaParticipantes.gestion;
                } else if (p.clasificacion == 'privada') {
                    donde = $scope.vistaParticipantes.privada;
                } else if (p.clasificacion == 'legislador') {
                    donde = $scope.vistaParticipantes.legislador;
                } else if (p.clasificacion == 'exclusivo') {
                    donde = $scope.vistaParticipantes.exclusivo;
                }

                donde.push({
                    p: p,
                    c: Contactos.buscarPorId(p.contactoId)
                });
                
                if (p.star) {
                    $scope.agregarLlamado(p.contactoId);
                }
            });
        }
    }, true);
    
    $scope.$watch('reunion.llamados', function (llamados){
        $scope.vistaLlamados = [];
        if (llamados) {
            angular.forEach(llamados, function (p){
                $scope.vistaLlamados.push({
                    p: p,
                    c: Contactos.buscarPorId(p.contactoId)
                });
            });
        }
    }, true);
    
    $scope.$watch('reunion.calendario', function (calendario){
        $scope.vistaCalendario = [];
        if (calendario) {
            angular.forEach(calendario, function (p){
                $scope.vistaCalendario.push({
                    p: p,
                    c: Contactos.buscarPorId(p.contactoId)
                });
            });
        }
    }, true);
    
    $scope.temaPorId = function (id) {
      for (var i = 0; i < $scope.temas.length; i++) {
          if ($scope.temas[i]._id == id)
          {
              return $scope.temas[i];
          }
      }  
    };
    
    $scope.$watch('reunion.temas', function (temas){
        $scope.vistaTemas = [];
        if (temas) {
            angular.forEach(temas, function (p){
                $scope.vistaTemas.push({
                    p: p,
                    t: $scope.temaPorId(p.temaId)
                });
            });
        }
    }, true);
    
    $scope.puedeAgregar = function (contactoId) {
        if (!$scope.reunion.participantes) {
            return;
        }
        if (contactoId !== undefined && contactoId._id) {
            contactoId = contactoId._id;
        }
        if (!contactoId) {
            return false;
        }

        var found = false;

        for (var i = 0; i < $scope.reunion.participantes.length; i++) {
            if ($scope.reunion.participantes[i].contactoId == contactoId) {
                found = true;
                break;
            }
        }

        return !found;
    };
    
    $scope.puedeAgregarLlamado = function (contactoId) {
        if (!$scope.reunion.llamados) {
            return;
        }
        if (contactoId !== undefined && contactoId._id) {
            contactoId = contactoId._id;
        }
        if (!contactoId) {
            return false;
        }

        var found = false;

        for (var i = 0; i < $scope.reunion.llamados.length; i++) {
            if ($scope.reunion.llamados[i].contactoId == contactoId) {
                found = true;
                break;
            }
        }

        return !found;
    };

    $scope.agregarLlamado = function (c) {
        if(!$scope.reunion.llamados) {
            $scope.reunion.llamados = [];
        }
        if ($scope.puedeAgregarLlamado(c)) {
            $scope.reunion.llamados.push({
                contactoId: c
            });
            $scope.buscador2 = "";
        }
    };
    /*
    $scope.agregarParticipante = function (c) {
        if ($scope.puedeAgregar(c)) {
            $scope.reunion.participantes.push({
                contactoId: c,
                clasificacion: "otros"
            });

            // @diego: ponemos el combo en nada
            $scope.buscador = "";
        }
    };*/
    $scope.agregarParticipante = function (c) {
        if ($scope.puedeAgregar(c)) {
            pushearPersona({contactoId:c},"participantes",true);
            $scope.buscador = "";
        }
    };
    
    $scope.puedeAgregarCalendario = function (contactoId) {
        if (!$scope.reunion.calendario) {
            return;
        }
        if (contactoId !== undefined && contactoId._id) {
            contactoId = contactoId._id;
        }
        if (!contactoId) {
            return false;
        }

        var found = false;

        for (var i = 0; i < $scope.reunion.calendario.length; i++) {
            if ($scope.reunion.calendario[i].contactoId == contactoId) {
                found = true;
                break;
            }
        }

        return !found;
    };

    $scope.agregarCalendario = function (c) {
        if(!$scope.reunion.calendario) {
            $scope.reunion.calendario = [];
        }
        if ($scope.puedeAgregarCalendario(c)) {
            $scope.reunion.calendario.push({
                contactoId: c
            });
            $scope.buscador2 = "";
        }
    };

    $scope.agregarTema = function (c) {
        if(!$scope.reunion.temas) {
            $scope.reunion.temas = [];
        }
        $scope.reunion.temas.push({
            temaId: c
        });
        $scope.buscador5 = "";
    };
    
    $scope.crearContacto = function(confirmado, contacto) {
        if (confirmado) {
            contacto.apellidos = (contacto.apellidos || '').toUpperCase();
            contacto.$save();

            $scope.contactos = Contactos.listar();
        }
        else {
            $modal({template: '/views/orm/modalNuevoContacto.html', persist: true, show: true, scope: $scope.$new()});
        }
    };
    
    $scope.recargarLista();
})
.controller("ORMReunionNavbarCtrl", function ($scope, $rootScope, $routeParams) {
    $scope.$on('edit-changed', function (event, e) {
        $scope.editando = e;
    });
    
    $scope.reunionId = $routeParams._id;
    
    $scope.$on('print-changed', function (event, e) {
        $scope.imprimiendo = e;
    });

    $scope.edit = function () {
        $rootScope.$broadcast('edit');
    };
    
    $scope.print = function () {
      $rootScope.$broadcast('print');  
    };
    
    $scope.closePrint = function() {
      $rootScope.$broadcast('close-print');
    };

    $scope.save = function () {
        $rootScope.$broadcast('save');
    };
})
.controller("ORMReunionAsistenciaCtrl", function ($scope, $rootScope, $routeParams, $window, ORMInstanciaReunion, ORMReunion, Contactos, ORMOrganigrama) {
    $scope.myNumber=0;
    $scope.instancia = ORMInstanciaReunion.get({_id: $routeParams._id}, function(){
        $scope.reunion = ORMReunion.get({_id: $scope.instancia.reunion}, function(){
            if ($scope.reunion.nombre.length < 41) {
              $scope.set_size = {'font-size': '25px'};
            }
            else {
              $scope.set_size = {'font-size': '20px'};
            }
            
            var idMaestro;
            switch($scope.reunion.tipo)
            {
                case "seguimiento":
                    idMaestro = "5249c2913dacd74127000001";
                    break;
                case "transversales":
                    idMaestro = "53075d93491f2d02e0d14813";
                    break;
                case "presupuesto":
                    idMaestro = "53075dc7491f2d02e0d14815";
                    break;
                case "especificas":
                    idMaestro = "53075d79491f2d02e0d14812";
                    break;
                case "planeamiento":
                    idMaestro = "53075db4491f2d02e0d14814";
                    break;
                case "coordinacion":
                    idMaestro = "53075ddc491f2d02e0d14816";
                    break;
                case "planLargoPlazo":
                    idMaestro = "553f971d41e6232024e2933d";
                    break;
                case "proyectosEspeciales":
                    idMaestro = "55e472739e8ff113c48a8f19";
                    break;
                case "eventuales":
                    idMaestro = "5486de0c41e6231858ad5329";
                    break;
            }
            
            $scope.maestro = ORMReunion.findById({
                _id: idMaestro
            }, function () {
                self.vistaMaestro = {
                    responsable: [],
                    jefeGabinete: [],
                    ejecutivo: [],
                    otros: [],
                    participante: [],
                    privada: [],
                    gestion: [],
                    exclusivo: [],
                    legislador: []
                };
                
                angular.forEach($scope.maestro.participantes, function (p){
                    // @diego: Por default, lo mandamos a 'otros'
                    var donde = self.vistaMaestro.otros;
                    
                    switch(p.clasificacion)
                    {
                        case "responsable":
                            donde = self.vistaMaestro.responsable;
                            break;
                        case "jefeGabinete":
                            donde = self.vistaMaestro.jefeGabinete;
                            break;
                        case "ejecutivo":
                            donde = self.vistaMaestro.ejecutivo;
                            break;
                        case "participante":
                            donde = self.vistaMaestro.participante;
                            break;
                        case "gestion":
                            donde = self.vistaMaestro.gestion;
                            break;
                        case "privada":
                            donde = self.vistaMaestro.privada;
                            break;
                        case "legislador":
                            donde = self.vistaMaestro.legislador;
                            break;
                        case "exclusivo":
                            donde = self.vistaMaestro.exclusivo;
                            break;
                    }

                    donde.push({
                        p: p,
                        c: Contactos.buscarPorId(p.contactoId)
                    });
                });
                
                /*
                angular.forEach($scope.maestro.participantes, function (p){
                        self.vistaMaestro.push({
                            p: p,
                            c: Contactos.buscarPorId(p.contactoId)
                        });
                    });*/
               $scope.myNumber += self.vistaParticipantes.length;
            });
        });
    });
    
    $scope.arr = []; 
    $scope.arr.length = 27;
    
    var self = this;
    //self.vistaParticipantes = [];
    self.vistaParticipantes = {
        responsable: [],
        jefeGabinete: [],
        ejecutivo: [],
        otros: [],
        participante: [],
        privada: [],
        gestion: [],
        exclusivo: [],
        legislador: []
    };
    
    
   $scope.$watch('reunion.participantes', function (participantes){
      if (participantes) {
         $scope.myNumber += self.vistaParticipantes.length;
        /*angular.forEach(participantes, function (p){
            var donde=self.vistaParticipantes;
            donde.push({
               p: p,
               c: Contactos.buscarPorId(p.contactoId)
            });
         });*/
        angular.forEach(participantes, function (p){
        var donde = self.vistaParticipantes.otros;
        
        switch(p.clasificacion)
        {
            case "responsable":
                donde = self.vistaParticipantes.responsable;
                break;
            case "jefeGabinete":
                donde = self.vistaParticipantes.jefeGabinete;
                break;
            case "ejecutivo":
                donde = self.vistaParticipantes.ejecutivo;
                break;
            case "participante":
                donde = self.vistaParticipantes.participante;
                break;
            case "gestion":
                donde = self.vistaParticipantes.gestion;
                break;
            case "privada":
                donde = self.vistaParticipantes.privada;
                break;
            case "legislador":
                donde = self.vistaParticipantes.legislador;
                break;
            case "exclusivo":
                donde = self.vistaParticipantes.exclusivo;
                break;
        }

        donde.push({
            p: p,
            c: Contactos.buscarPorId(p.contactoId)
        });
    });
      }
   }, true);
    
    $scope.imprimir = function () {
        $window.print(); 
    };
    
    $scope.getNumber = function(num) {
        return new Array(num);   
    };
    
    
    $scope.contactos = Contactos.listar();
    $scope.jurisdicciones = ORMOrganigrama.query();
    
    $scope.contactoPorId = function (id) {
      for (var i = 0; i < $scope.contactos.length; i++) {
          if ($scope.contactos[i]._id == id)
          {
              return $scope.contactos[i];
          }
      }  
    };
    
    $scope.jurisdiccionPorId = function (id) {
      for (var i = 0; i < $scope.jurisdicciones.length; i++) {
          if ($scope.jurisdicciones[i]._id == id)
          {
              return $scope.jurisdicciones[i];
          }
      }  
    };
    
    $scope.buscarCorreo = function(nombre, contacto) {
        if (!contacto.correos) {
            return "";
        }
        else {
            for (var i = 0; i < contacto.correos.length; i++) {
                var em = contacto.correos[i];

                if (em.nombre == nombre) {
                    return em.valor;
                }
            }
        }

        return "";
    };
    
    
})
.controller("ORMReunionAsistenciaEditableCtrl", function ($scope, $rootScope, $routeParams, $window, ORMInstanciaReunion, ORMReunion, Contactos, ORMOrganigrama) {
    $scope.contactos = Contactos.listar();
    $scope.jurisdicciones = ORMOrganigrama.query();
    $scope.contactoPorId = function (id) {
      for (var i = 0; i < $scope.contactos.length; i++) {
          if ($scope.contactos[i]._id == id)
          {
              return $scope.contactos[i];
          }
      }  
    };
    $scope.switchImportante = function(contacto) {
        if (contacto.importante) {
            contacto.importante = false;
        } else {
            contacto.importante = true;
        }
    };
    $scope.jurisdiccionPorId = function (id) {
      for (var i = 0; i < $scope.jurisdicciones.length; i++) {
          if ($scope.jurisdicciones[i]._id == id)
          {
              return $scope.jurisdicciones[i];
          }
      }  
    };
    $scope.tab = "participantes";
    $scope.imprimir = function () {
        $window.print(); 
    };
    $scope.getNumber = function(num) {
        return new Array(num);   
    };
    $scope.eliminarParticipante = function (p) {
        for(var i=0; i<$scope.listaTotal.length; i++)
        {
            if(p.contactoId == $scope.listaTotal[i].contactoId)
            {
                $scope.listaTotal.splice(i,1);
                break;
            }
        }
    };
    var self = this;
//@Alex: Carga unificada de Participantes
    $scope.instancia = ORMInstanciaReunion.get({_id: $routeParams._id}, function(){
        $scope.reunion = ORMReunion.get({_id: $scope.instancia.reunion}, function(){
            //RECARGA LA LISTA (lel)
            $scope.recargarLista();
            
            if (!$scope.instancia.asistencia) {
                $scope.instancia.asistencia = $scope.reunion.participantes;
                $scope.instancia.asistenteTablero = $scope.reunion.asistenteTablero;
                $scope.instancia.asistenteMinuta = $scope.reunion.asistenteMinuta;
                var idMaestro;
                switch($scope.reunion.tipo)
                {
                    case "seguimiento":
                        idMaestro = "5249c2913dacd74127000001";
                        break;
                    case "transversales":
                        idMaestro = "53075d93491f2d02e0d14813";
                        break;
                    case "presupuesto":
                        idMaestro = "53075dc7491f2d02e0d14815";
                        break;
                    case "especificas":
                        idMaestro = "53075d79491f2d02e0d14812";
                        break;
                    case "planeamiento":
                        idMaestro = "53075db4491f2d02e0d14814";
                        break;
                    case "coordinacion":
                        idMaestro = "53075ddc491f2d02e0d14816";
                        break;
                    case "planLargoPlazo":
                        idMaestro = "553f971d41e6232024e2933d";
                        break;
                    case "proyectosEspeciales":
                        idMaestro = "55e472739e8ff113c48a8f19";
                        break;
                    case "eventuales":
                        idMaestro = "5486de0c41e6231858ad5329";
                        break;
                }
                //@Alex: NO TOCAR ES DE MAESTRO.
                $scope.maestro = ORMReunion.get({_id: idMaestro}, function(){
                    $scope.instancia.asistenciaMaestro = $scope.maestro.participantes;
                    $scope.vistaMaestro = [];
                    angular.forEach($scope.instancia.asistenciaMaestro, function (p){
                        $scope.vistaMaestro.push({
                            p: p,
                            c: Contactos.buscarPorId(p.contactoId)
                        });
                    });
                });
            }
            else if (!$scope.instancia.asistenciaMaestro) 
            {
                var idMaestro;
                switch($scope.reunion.tipo)
                {
                    case "seguimiento":
                        idMaestro = "5249c2913dacd74127000001";
                        break;
                    case "transversales":
                        idMaestro = "53075d93491f2d02e0d14813";
                        break;
                    case "presupuesto":
                        idMaestro = "53075dc7491f2d02e0d14815";
                        break;
                    case "especificas":
                        idMaestro = "53075d79491f2d02e0d14812";
                        break;
                    case "planeamiento":
                        idMaestro = "53075db4491f2d02e0d14814";
                        break;
                    case "coordinacion":
                        idMaestro = "53075ddc491f2d02e0d14816";
                        break;
                    case "planLargoPlazo":
                        idMaestro = "553f971d41e6232024e2933d";
                        break;
                    case "proyectosEspeciales":
                        idMaestro = "55e472739e8ff113c48a8f19";
                        break;
                    case "eventuales":
                        idMaestro = "5486de0c41e6231858ad5329";
                        break;
                }
                $scope.maestro = ORMReunion.get({_id: idMaestro}, function(){
                    $scope.instancia.asistenciaMaestro = $scope.maestro.participantes;
                    $scope.vistaMaestro = [];
                    angular.forEach($scope.instancia.asistenciaMaestro, function (p){
                        $scope.vistaMaestro.push({
                            p: p,
                            c: Contactos.buscarPorId(p.contactoId)
                        });
                    });
                });
            } //@Alex: NO TOCAR ES DE MAESTRO.
            else {
                $scope.vistaMaestro = [];
                angular.forEach($scope.instancia.asistenciaMaestro, function (p){
                    $scope.vistaMaestro.push({
                        p: p,
                        c: Contactos.buscarPorId(p.contactoId)
                    });
                });
            }
        });
    });
    $scope.recargarLista=function(){
        $scope.listaTotal=[];
        ($scope.instancia.asistencia || []).forEach(function (i){
            pushearPersonaAsistencia(i);
        });
    };
    //@Alex: Funcion creada a modo de parche solo para la carga unificada de las reuniones
    function pushearPersonaAsistencia(persona){
        $scope.listaTotal.push({
            contactoId:persona.contactoId,
            participantes:true,
            c:Contactos.buscarPorId(persona.contactoId),
            clasificacion:(persona.clasificacion || "otros"),
            asistio:(persona.asistio || "No" ),
            confirmo:(persona.confirmo || "No"),
            llamados:(persona.llamados || "No"),
            cita:(persona.cita || "No"),
            propuestaTemario: (persona.propuestaTemario || "No"),
            minuta:(persona.minuta || "No")
        });
    }
    //@Alex: Cambiar tipo de Envio de los botones: No, Para, CC, CCO.
    $scope.cambiarTipoEnvio=function(persona,tipo){
        //@Alex: Basandose en el contenido del tipo, lo cambia de lista.
        switch(persona[tipo])
        {
            case "para":
                $scope.listaTotal[$scope.listaTotal.indexOf(persona)][tipo]="cc";
                break;
            case "cc":
                $scope.listaTotal[$scope.listaTotal.indexOf(persona)][tipo]="cco";
                break;
            case "cco":
                $scope.listaTotal[$scope.listaTotal.indexOf(persona)][tipo]=false;
                break;
            default:
                $scope.listaTotal[$scope.listaTotal.indexOf(persona)][tipo]="para";
                break;
        }
    };
    //@Alex: Se le pasa un objeto y el campo que se desea modificar y cambia Si por false y viceversa
    $scope.cambiarSiNo=function(persona,campo){
        if(persona[campo]=="No")
        {
            $scope.listaTotal[$scope.listaTotal.indexOf(persona)][campo]="Si";
        }
        else
        {
            $scope.listaTotal[$scope.listaTotal.indexOf(persona)][campo]="No";
        }
    };
    //@Alex: Verifica si es el ultimo cuando termina el ngRepeat,
    $scope.esUltimo=function(boolean){
        if(boolean)
        {
            $scope.cargo=true;
        }
    };
    //@Alex: Vacia los arrays del objeto traido de al BD, y le inserta los que estan en memoria.
    $scope.save = function (){
        //@Alex: NO TOCAR ES DE MAESTRO.
        angular.forEach($scope.instancia.asistenciaMaestro, function (p) {
            if (!p.asistio) {
                p.asistio = "No";
            }
            if (!p.confirmo) {
                p.confirmo = "No";
            }
        });
         
        $scope.instancia.asistencia=[];
        ($scope.listaTotal || []).forEach(function (persona){
            $scope.instancia.asistencia.push(persona);
        });

        //@Alex: NO TOCAR ES DE MAESTRO.
        angular.forEach($scope.instancia.asistenciaMaestro, function (p) {
            if (!p.asistio) {
                p.asistio = "No";
            }
            if (!p.confirmo) {
                p.confirmo = "No";
            }
        });
        
        //@Alex: Luego de guardar, vuelve a recargar el $scope.
        $scope.instancia.$save(function(){
            $scope.reunion.$save(function() {
                self.editando = false;
                $scope.recargarLista();
            });
        });
    };
    /*
    $scope.save = function() {
          $scope.instancia.$save(function() {
              self.editando = false;
              $scope.reunion = ORMReunion.get({_id: $scope.instancia.reunion}, function(){
                  $scope.reunion.cita.exclusivos = [];
                  $scope.reunion.temario.exclusivos = [];
                  $scope.reunion.propuestaTemario.exclusivos = [];
                  var nueva = [];
                  angular.forEach($scope.reunion.participantes, function (p){
                      if (p.clasificacion != "exclusivo") {
                          nueva.push(p);
                      }
                  });
                  $scope.reunion.participantes = nueva;
                  $scope.reunion.$save();
              });
          });
      };
    */
    //$scope.save = function() {
        /*
        $scope.instancia.$save(function() {
            self.editando = false;
            $scope.reunion = ORMReunion.get({_id: $scope.instancia.reunion}, function(){
                $scope.reunion.cita.exclusivos = [];
                $scope.reunion.temario.exclusivos = [];
                $scope.reunion.propuestaTemario.exclusivos = [];
                var nueva = [];
                angular.forEach($scope.reunion.participantes, function (p){
                    if (p.clasificacion != "exclusivo") {
                        nueva.push(p);
                    }
                });
                $scope.reunion.participantes = nueva;
                $scope.reunion.$save();
            });
        });
        */
    //};
    $scope.agregarAsistente = function (persona) {
        if (self.puedeAgregar(persona)) {
            $scope.listaTotal.push({
                contactoId:persona,
                participantes:true,
                c:Contactos.buscarPorId(persona),
                clasificacion:"otros",
                asistio:"No",
                confirmo:"No",
                llamados:"No",
                cita:"No",
                propuestaTemario:"No",
                minuta:"No"
            });

            // @diego: ponemos el combo en nada
            self.buscador = "";
        }
    };
//@Alex: Fin carga unificada de Participante
    $scope.edit = function() {
        self.editando = true;
    };
    $scope.buscarCorreo = function(nombre, contacto) {
        if (!contacto.correos) {
            return "";
        }
        else {
            for (var i = 0; i < contacto.correos.length; i++) {
                var em = contacto.correos[i];

                if (em.nombre == nombre) {
                    return em.valor;
                }
            }
        }

        return "";
    };
    self.puedeAgregar = function (contactoId) {
        if (!$scope.instancia.asistencia) {
            angular.extend($scope.instancia, {
                asistencia: []
            })
        }
        if (contactoId !== undefined && contactoId._id) {
            contactoId = contactoId._id;
        }
        if (!contactoId) {
            return false;
        }
        var found = false;

        for (var i = 0; i < $scope.instancia.asistencia.length; i++) {
            if ($scope.instancia.asistencia[i].contactoId == contactoId) {
                found = true;
                break;
            }
        }

        return !found;
    };
    //@Alex: NO TOCAR ES DE MAESTRO.
    $scope.$watch('instancia.asistenciaMaestro', function (participantesMaestro){
        $scope.vistaMaestro = [];
        angular.forEach($scope.instancia.asistenciaMaestro, function (p){
            $scope.vistaMaestro.push({
                p: p,
                c: Contactos.buscarPorId(p.contactoId)
            });
        });
    }, true);
    //@Alex: NO TOCAR ES DE MAESTRO.
    $scope.agregarParticipanteMaestro = function (c) {
        if ($scope.instancia.asistenciaMaestro) {
            $scope.instancia.asistenciaMaestro.push({
                contactoId: c,
                clasificacion: "otros",
                asistio: "No",
                confirmo: "No"
            });

            // @diego: ponemos el combo en nada
            self.buscador2 = "";
        }
    };
})
.controller("ORMReunionLlamadosEditableCtrl", function ($scope, $rootScope, $routeParams, $window, ORMInstanciaReunion, ORMOrganigrama, ORMReunion, Contactos) {
    $scope.contactos = Contactos.listar();
    $scope.jurisdicciones = ORMOrganigrama.query();
    
    $scope.contactoPorId = function (id) {
      for (var i = 0; i < $scope.contactos.length; i++) {
          if ($scope.contactos[i]._id == id)
          {
              return $scope.contactos[i];
          }
      }  
    };
    
    $scope.jurisdiccionPorId = function (id) {
      for (var i = 0; i < $scope.jurisdicciones.length; i++) {
          if ($scope.jurisdicciones[i]._id == id)
          {
              return $scope.jurisdicciones[i];
          }
      }  
    };
    $scope.instancia = ORMInstanciaReunion.get({_id: $routeParams._id}, function(){
        $scope.reunion = ORMReunion.get({_id: $scope.instancia.reunion}, function(){
            if (!$scope.instancia.llamados) {
                $scope.instancia.llamados = $scope.reunion.llamados;
                var idMaestro;
                if ($scope.reunion.tipo == "seguimiento") {
                    idMaestro = "5249c2913dacd74127000001";
                } else if ($scope.reunion.tipo == "transversales") {
                    idMaestro = "53075d93491f2d02e0d14813";
                } else if ($scope.reunion.tipo == "presupuesto") {
                    idMaestro = "53075dc7491f2d02e0d14815";
                } else if ($scope.reunion.tipo == "especificas") {
                    idMaestro = "53075d79491f2d02e0d14812";
                } else if ($scope.reunion.tipo == "planeamiento") {
                    idMaestro = "53075db4491f2d02e0d14814";
                } else if ($scope.reunion.tipo == "coordinacion") {
                    idMaestro = "53075ddc491f2d02e0d14816";
                } else if ($scope.reunion.tipo == "planLargoPlazo") {
                    idMaestro = "553f971d41e6232024e2933d";
                } else if ($scope.reunion.tipo == "proyectosEspeciales") {
                    idMaestro = "55e472739e8ff113c48a8f19";
                } else if ($scope.reunion.tipo == "eventuales") {
                    idMaestro = "5486de0c41e6231858ad5329";
                }
                $scope.maestro = ORMReunion.get({_id: idMaestro}, function(){
                    $scope.instancia.llamadosMaestro = $scope.maestro.llamados;
                    $scope.vistaLlamados = [];
                    angular.forEach($scope.instancia.llamados, function (p){
                        $scope.vistaLlamados.push({
                            p: p,
                            c: Contactos.buscarPorId(p.contactoId)
                        });
                    });
                    $scope.vistaMaestro = [];
                    angular.forEach($scope.instancia.llamadosMaestro, function (p){
                        $scope.vistaMaestro.push({
                            p: p,
                            c: Contactos.buscarPorId(p.contactoId)
                        });
                    });
                });
            } else if (!$scope.instancia.llamadosMaestro) {
                var idMaestro;
                if ($scope.reunion.tipo == "seguimiento") {
                    idMaestro = "5249c2913dacd74127000001";
                } else if ($scope.reunion.tipo == "transversales") {
                    idMaestro = "53075d93491f2d02e0d14813";
                } else if ($scope.reunion.tipo == "presupuesto") {
                    idMaestro = "53075dc7491f2d02e0d14815";
                } else if ($scope.reunion.tipo == "especificas") {
                    idMaestro = "53075d79491f2d02e0d14812";
                } else if ($scope.reunion.tipo == "planeamiento") {
                    idMaestro = "53075db4491f2d02e0d14814";
                } else if ($scope.reunion.tipo == "coordinacion") {
                    idMaestro = "53075ddc491f2d02e0d14816";
                } else if ($scope.reunion.tipo == "planLargoPlazo") {
                    idMaestro = "553f971d41e6232024e2933d";
                } else if ($scope.reunion.tipo == "proyectosEspeciales") {
                    idMaestro = "55e472739e8ff113c48a8f19";
                } else if ($scope.reunion.tipo == "eventuales") {
                    idMaestro = "5486de0c41e6231858ad5329";
                }
                $scope.maestro = ORMReunion.get({_id: idMaestro}, function(){
                    $scope.instancia.llamadosMaestro = $scope.maestro.llamados;
                    $scope.vistaLlamados = [];
                    angular.forEach($scope.instancia.llamados, function (p){
                        $scope.vistaLlamados.push({
                            p: p,
                            c: Contactos.buscarPorId(p.contactoId)
                        });
                    });
                    $scope.vistaMaestro = [];
                    angular.forEach($scope.instancia.llamadosMaestro, function (p){
                        $scope.vistaMaestro.push({
                            p: p,
                            c: Contactos.buscarPorId(p.contactoId)
                        });
                    });
                });
            } else {
                $scope.vistaLlamados = [];
                angular.forEach($scope.instancia.llamados, function (p){
                    $scope.vistaLlamados.push({
                        p: p,
                        c: Contactos.buscarPorId(p.contactoId)
                    });
                });
                $scope.vistaMaestro = [];
                angular.forEach($scope.instancia.llamadosMaestro, function (p){
                    $scope.vistaMaestro.push({
                        p: p,
                        c: Contactos.buscarPorId(p.contactoId)
                    });
                });
            }
        });
    });
    
    $scope.getNumber = function(num) {
        return new Array(num);   
    };
    var self = this;
    
    $scope.edit = function() {
        self.editando = true;
    };
    
    $scope.save = function() {
        $scope.instancia.$save(function() {
            self.editando = false;
        });
    };
    
    $scope.buscarTelefono = function(nombre, contacto) {
        if (!contacto.telefonos) {
            return "";
        }
        else {
            for (var i = 0; i < contacto.telefonos.length; i++) {
                var em = contacto.telefonos[i];

                if ((em.nombre == nombre) && (em.interno)) {
                    return em.valor + " Int. " + em.interno;
                } else if (em.nombre == nombre) {
                    return em.valor;
                }
            }
        }

        return "";
    };
    
})
.controller("ORMReunionLlamadosCtrl", function ($scope, $rootScope, $routeParams, $window, ORMInstanciaReunion, ORMReunion, Contactos, ORMOrganigrama) {
    $scope.instancia = ORMInstanciaReunion.get({_id: $routeParams._id}, function(){
        $scope.reunion = ORMReunion.get({_id: $scope.instancia.reunion}, function(){
            if ($scope.reunion.nombre.length < 41) {
              $scope.set_size = {'font-size': '25px'};
            }
            else {
              $scope.set_size = {'font-size': '20px'};
            }
            var idMaestro;
            if ($scope.reunion.tipo == "seguimiento") {
                idMaestro = "5249c2913dacd74127000001";
            } else if ($scope.reunion.tipo == "transversales") {
                idMaestro = "53075d93491f2d02e0d14813";
            } else if ($scope.reunion.tipo == "presupuesto") {
                idMaestro = "53075dc7491f2d02e0d14815";
            } else if ($scope.reunion.tipo == "especificas") {
                idMaestro = "53075d79491f2d02e0d14812";
            } else if ($scope.reunion.tipo == "planeamiento") {
                idMaestro = "53075db4491f2d02e0d14814";
            } else if ($scope.reunion.tipo == "coordinacion") {
                idMaestro = "53075ddc491f2d02e0d14816";
            } else if ($scope.reunion.tipo == "planLargoPlazo") {
                idMaestro = "553f971d41e6232024e2933d";
            } else if ($scope.reunion.tipo == "proyectosEspeciales") {
                idMaestro = "55e472739e8ff113c48a8f19";
            } else if ($scope.reunion.tipo == "eventuales") {
                idMaestro = "5486de0c41e6231858ad5329";
            }
            $scope.maestro = ORMReunion.findById({
                _id: idMaestro
            }, function () {
                self.vistaMaestro = [];
                angular.forEach($scope.maestro.llamados, function (p){
                        self.vistaMaestro.push({
                            p: p,
                            c: Contactos.buscarPorId(p.contactoId)
                        });
                    });
            });
        });
    });
    
    $scope.imprimir = function () {
        $window.print(); 
    };
    
    $scope.contactos = Contactos.listar();
    $scope.jurisdicciones = ORMOrganigrama.query();
    
    $scope.contactoPorId = function (id) {
      for (var i = 0; i < $scope.contactos.length; i++) {
          if ($scope.contactos[i]._id == id)
          {
              return $scope.contactos[i];
          }
      }  
    };
    
    $scope.jurisdiccionPorId = function (id) {
      for (var i = 0; i < $scope.jurisdicciones.length; i++) {
          if ($scope.jurisdicciones[i]._id == id)
          {
              return $scope.jurisdicciones[i];
          }
      }  
    };
    
    var self = this;
    
    $scope.$watch('reunion.llamados', function (llamados){
        self.vistaLlamados = [];

        if (llamados) {
            angular.forEach(llamados, function (p){
                self.vistaLlamados.push({
                    p: p,
                    c: Contactos.buscarPorId(p.contactoId)
                });
            });
        }
    }, true);
    
    
    $scope.buscarCorreo = function(nombre, contacto) {
        if (!contacto.correos) {
            return "";
        }
        else {
            for (var i = 0; i < contacto.correos.length; i++) {
                var em = contacto.correos[i];

                if (em.nombre == nombre) {
                    return em.valor;
                }
            }
        }

        return "";
    };
    
    $scope.buscarTelefono = function(nombre, contacto) {
        if (!contacto.telefonos) {
            return "";
        }
        else {
            for (var i = 0; i < contacto.telefonos.length; i++) {
                var em = contacto.telefonos[i];

                if ((em.nombre == nombre) && (em.interno)) {
                    return em.valor + " Int. " + em.interno;
                } else if (em.nombre == nombre) {
                    return em.valor;
                }
            }
        }

        return "";
    };
    
})
.controller("ORMMaestroReunionCtrl", function ($scope, $routeParams, ORMReunion, ORMInstanciaReunion, ORMOrganigrama, ORMTema, ORMColoresPorTipo, Contactos, ORMContacto, $rootScope, $modal, $window) {
    
    //@Alex: Revisar / Arreglar
    $scope.subir = function (p) {
      var posicion = $scope.reunion.participantes.indexOf(p);
      if (posicion > 0) {
          $scope.reunion.participantes.splice(posicion, 1);
          $scope.reunion.participantes.splice(posicion - 1,0,p);
      }
    };
    
    $scope.filtroRol=function(persona)
    {
        switch(persona.clasificacion)
        {
            case "responsable":
                return 1;
            case "jefeGabinete":
                return 2;
            case "ejecutivo":
                return 3;
            case "participante":
                return 4;
            case "legislador":
                return 5;
            case "privada":
                return 6;
            case "gestion":
                return 7;
            case "exclusivo":
                return 8;
            case "otros":
                return 9;
            default:
                return 10;
        }
    };
    
    $scope.switchStar = function(contacto) {
        if (contacto.star) {
            contacto.star = false;
        } else {
            contacto.star = true;
        }
    };
    
    $scope.contactoPorId = function (id) {
      for (var i = 0; i < $scope.contactos.length; i++) {
          if ($scope.contactos[i]._id == id)
          {
              return $scope.contactos[i];
          }
      }  
    };
    
    $scope.permiso = function (tipo) {
        switch(tipo)
        {
            case "seguimiento":
                return $scope.hasPermission('orm.seguimiento');
            case "transversales":
                return $scope.hasPermission('orm.transversales');
            case "especificas":
                return $scope.hasPermission('orm.especificas');
            case "planeamiento":
                return $scope.hasPermission('orm.planeamiento');
            case "presupuesto":
                return $scope.hasPermission('orm.presupuesto');
            case "coordinacion":
                return $scope.hasPermission('orm.coordinacion');
            case "planLargoPlazo":
                return $scope.hasPermission('orm.planLargoPlazo');
            case "proyectosEspeciales":
                return $scope.hasPermission('orm.proyectosEspeciales');
            case "eventuales":
                return $scope.hasPermission('orm.eventuales');
        }
    };
    
    $scope.jurisdiccionPorId = function (id) {
      for (var i = 0; i < $scope.jurisdicciones.length; i++) {
          if ($scope.jurisdicciones[i]._id == id)
          {
              return $scope.jurisdicciones[i];
          }
      }  
    };
    
    $scope.buscarTelefono = function(nombre, contacto) {
        if (!contacto.telefonos) {
            return "";
        }
        else {
            for (var i = 0; i < contacto.telefonos.length; i++) {
                var em = contacto.telefonos[i];

                if ((em.nombre == nombre) && (em.interno)) {
                    return em.valor + " Int. " + em.interno;
                } else if (em.nombre == nombre) {
                    return em.valor;
                }
            }
        }

        return "";
    };
    
    //$scope.tab = "participantes";
    
    /*$scope.eliminarLlamado = function (p) {
      $scope.reunion.llamados.splice($scope.reunion.llamados.indexOf(p), 1);
    };*/
    
    /*$scope.eliminarCalendario = function (p) {
      $scope.reunion.calendario.splice($scope.reunion.calendario.indexOf(p), 1);
    };*/
    
    /*$scope.eliminarTema = function (p) {
      $scope.reunion.temas.splice($scope.reunion.temas.indexOf(p), 1);
    };*/
    
    /*$scope.subirLlamado = function (p) {
      var posicion = $scope.reunion.llamados.indexOf(p);
      if (posicion > 0) {
          $scope.reunion.llamados.splice(posicion, 1);
          $scope.reunion.llamados.splice(posicion - 1,0,p);
      }
    };*/
    
    $scope.edit = function () {
        $scope.editando = true;
    };
    
    $scope.jurisdicciones = ORMOrganigrama.query();
    $scope.contactos = Contactos.listar();
    
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@Alex: Esta seccion fue hecha para realizar la carga unificada
    //@Alex: Se le envia el objeto, el campo a modificar y el valor que deberia tener.
    //Si lo encuentra en la lista, solo le agrega el campo con el valor indicado, caso contrario lo crea.
    function agregarALaLista(persona, campo, valor)
    {
      if($scope.listaTotal.length>0)
      {
         for(var x=0; x<$scope.listaTotal.length; x++)
         {
            if($scope.listaTotal[x].contactoId == persona.contactoId)
            {
               $scope.listaTotal[x][campo]=valor;
               break;
            }
            else
            {
               if(x==$scope.listaTotal.length-1)
               {
                  pushearPersona(persona,campo,valor);
               }
            }
         }
      }
      else
      {
         pushearPersona(persona,campo,valor);
      }
   };
   
    //@Alex: Cuando no encuentra el registro, tiene que hacer un push a la lista.
    function pushearPersona(persona, campo, valor)
    {
      switch(campo)
      {
         case "participantes":
            $scope.listaTotal.push({
               contactoId:persona.contactoId,
               participantes:valor,
               c:Contactos.buscarPorId(persona.contactoId),
               star:persona.star,
               clasificacion:persona.clasificacion
            });
            break;
         case "llamados":
            $scope.listaTotal.push({
               contactoId:persona.contactoId,
               llamados:valor,
               c:Contactos.buscarPorId(persona.contactoId),
               star:persona.star,
               clasificacion:persona.clasificacion
            });
            break;
         case "cita":
            $scope.listaTotal.push({
               contactoId:persona.contactoId,
               cita:valor,
               c:Contactos.buscarPorId(persona.contactoId),
               star:persona.star,
               clasificacion:persona.clasificacion
            });
            break;
         case "temario":
            $scope.listaTotal.push({
               contactoId:persona.contactoId,
               temario:valor,
               c:Contactos.buscarPorId(persona.contactoId),
               star:persona.star,
               clasificacion:persona.clasificacion
            });
            break;
         case "minuta":
            $scope.listaTotal.push({
               contactoId:persona.contactoId,
               minuta:valor,
               c:Contactos.buscarPorId(persona.contactoId),
               star:persona.star,
               clasificacion:persona.clasificacion
            });
            break;
         case "propuestaTemario":
            $scope.listaTotal.push({
               contactoId:persona.contactoId,
               propuestaTemario:valor,
               c:Contactos.buscarPorId(persona.contactoId),
               star:persona.star,
               clasificacion:persona.clasificacion
            });
            break;
      }
   };
   
    //@Alex: Al cambiar el tipo de Maestro, volvera a recargar todo el objeto y lo pasara a memoria.
    $scope.$watch('tipoMaestro', function (t) {
        $scope.idMaestro;
        
        switch(t)
        {
            case "seguimiento":
                $scope.idMaestro = "5249c2913dacd74127000001";
            break;
            case "transversales":
                $scope.idMaestro = "53075d93491f2d02e0d14813";
            break;
            case "presupuesto":
                $scope.idMaestro = "53075dc7491f2d02e0d14815";
            break;
            case "especificas":
                $scope.idMaestro = "53075d79491f2d02e0d14812";
            break;
            case "planeamiento":
                $scope.idMaestro = "53075db4491f2d02e0d14814";
            break;
            case "coordinacion":
                $scope.idMaestro = "53075ddc491f2d02e0d14816";
            break;
            case "planLargoPlazo":
                $scope.idMaestro = "553f971d41e6232024e2933d";
            break;
            case "proyectosEspeciales":
                $scope.idMaestro = "55e472739e8ff113c48a8f19";
            break;
            case "eventuales":
                $scope.idMaestro = "5486de0c41e6231858ad5329";
            break;
            default:
                $scope.idMaestro="";
            break;
        }
        
        $scope.recargarLista();
    });
    
    //@Alex: Cambiar tipo de Envio de los botones: No, Para, CC, CCO.
    $scope.cambiarTipoEnvio=function(persona,tipo)
    {
        //@Alex: Basandose en el contenido del tipo, lo cambia de lista.
        switch(persona[tipo])
        {
            case "para":
                $scope.listaTotal[$scope.listaTotal.indexOf(persona)][tipo]="cc";
                break;
            case "cc":
                $scope.listaTotal[$scope.listaTotal.indexOf(persona)][tipo]="cco";
                break;
            case "cco":
                $scope.listaTotal[$scope.listaTotal.indexOf(persona)][tipo]=false;
                break;
            default:
                $scope.listaTotal[$scope.listaTotal.indexOf(persona)][tipo]="para";
                break;
        }
        
    };
    
    $scope.cambiarLlamado=function(persona)
    {
        if(persona.llamados)
        {
            $scope.listaTotal[$scope.listaTotal.indexOf(persona)].llamados=false;
        }
        else
        {
            $scope.listaTotal[$scope.listaTotal.indexOf(persona)].llamados="Si";
        }
    };
    
    $scope.recargarLista=function()
    {
        $scope.listaTotal=[];
        $scope.reunion = ORMReunion.findById({ _id : $scope.idMaestro},function(){{
            $scope.reunion.participantes.forEach(function (i){
                agregarALaLista(i,"participantes",true);
            });
            $scope.reunion.llamados.forEach(function(i){
                agregarALaLista(i,"llamados","Si");
            });
            $scope.reunion.cita.para.forEach(function(i){
                agregarALaLista(i,"cita","para");
            });
            $scope.reunion.cita.cc.forEach(function(i){
                agregarALaLista(i,"cita","cc");
            });
            $scope.reunion.cita.cco.forEach(function(i){
                agregarALaLista(i,"cita","cco");
            });
            $scope.reunion.temario.para.forEach(function(i){
                agregarALaLista(i,"temario","para");
            });
            $scope.reunion.temario.cc.forEach(function(i){
                agregarALaLista(i,"temario","cc");
            });
            $scope.reunion.temario.cco.forEach(function(i){
                agregarALaLista(i,"temario","cco");
            });
            $scope.reunion.minuta.para.forEach(function(i){
                agregarALaLista(i,"minuta","para");
            });
            $scope.reunion.minuta.cc.forEach(function(i){
                agregarALaLista(i,"minuta","cc");
            });
            $scope.reunion.minuta.cco.forEach(function(i){
                agregarALaLista(i,"minuta","cco");
            });
            $scope.reunion.propuestaTemario.para.forEach(function(i){
                agregarALaLista(i,"propuestaTemario","para");
            });
            $scope.reunion.propuestaTemario.cc.forEach(function(i){
                agregarALaLista(i,"propuestaTemario","cc");
            });
            $scope.reunion.propuestaTemario.cco.forEach(function(i){
                agregarALaLista(i,"propuestaTemario","cco");
            });
        }});
    }
    
    
    
    //@Alex: Vacia los arrays del objeto traido de al BD, y le inserta los que estan en memoria.
    $scope.save = function (){
        //@Alex: Vaciamos los arrays para poder pushear al guardar sin tener que revisar que ya existan
        $scope.reunion.participantes=[];
        $scope.reunion.llamados=[];
        $scope.reunion.cita.para=[];
        $scope.reunion.cita.cc=[];
        $scope.reunion.cita.cco=[];
        $scope.reunion.temario.para=[];
        $scope.reunion.temario.cc=[];
        $scope.reunion.temario.cco=[];
        $scope.reunion.minuta.para=[];
        $scope.reunion.minuta.cc=[];
        $scope.reunion.minuta.cco=[];
        $scope.reunion.propuestaTemario.para=[];
        $scope.reunion.propuestaTemario.cc=[];
        $scope.reunion.propuestaTemario.cco=[];
        
        //@Alex: Pasaje de memoria al objeto de la BD para poder guardarlo en el mismo fomato.
        var camposPosibles=["cita","temario","minuta","propuestaTemario"];
        $scope.listaTotal.forEach(function (item) {
            camposPosibles.forEach(function (campo){
                if(item[campo])
                {   
                    //@Alex: De esta forma se pushea de forma dinamina en distinos arrays evitando multiples "if"
                    $scope.reunion[campo][item[campo]].push({
                        contactoId: item.contactoId,
                        star:item.star,
                        clasificacion:item.clasificacion
                    });
                }
            });
            if(item.participantes)
            {
                $scope.reunion.participantes.push({
                    contactoId: item.contactoId,
                    star:item.star,
                    clasificacion:item.clasificacion
                });
            }
            if(item.llamados=="Si")
            {
                $scope.reunion.llamados.push({
                    contactoId: item.contactoId,
                    star:item.star,
                    clasificacion:item.clasificacion
                });
            }
        });
        
        //@Alex: Luego de guardar, vuelve a recargar el $scope.
        $scope.reunion.$save(function() {
            $scope.editando = false;
            $scope.recargarLista();
        });
    };
    
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@Alex: Fin carga unificada.

    // @diego: por algún motivo, funciona masomenos bien así
    // Pone los colores al ui-select2
    var formatTipoReunionCombo = function (object, container, query) {
        if (object.id != '') {
            var html = '<div style="width: 10px;height:10px;margin-right:4px;display:inline-block; background-color: '+ (ORMColoresPorTipo()[object.id] || 'grey') +'"></div>' + object.text;
            return html;
        } else {
            return object.text;
        }
    };
    $scope.tipoReunionSelect2 = {
        formatResult: formatTipoReunionCombo
    };
    
    $scope.buscarCorreo = function(nombre, contacto) {
        if (!contacto.correos) {
            return "";
        }
        else {
            for (var i = 0; i < contacto.correos.length; i++) {
                var em = contacto.correos[i];

                if (em.nombre == nombre) {
                    return em.valor;
                }
            }
        }

        return "";
    };
    

    $scope.crearContacto = function(confirmado, contacto) {
        if (confirmado) {
            contacto.apellidos = (contacto.apellidos || '').toUpperCase();
            contacto.$save();

            $scope.contactos = Contactos.listar();
        }
        else {
            $modal({template: '/views/orm/modalNuevoContacto.html', persist: true, show: true, scope: $scope.$new()});
        }
    };
    
    //@Alex: Si se utiliza
    $scope.agregarParticipante = function (c) {
        // @diego: Primero chequeamos si se puede
        if ($scope.puedeAgregar(c)) {
            // @diego: Al agregarlo al modelo, como tenemos un 
            // $watch('reunion.participnates', function () {}, true)
            // (el tercer parámetro en true indica que chequea por cambios
            // por igualdad, no sólo por referencia)
            pushearPersona({contactoId:c},"participantes",true);

            // @diego: ponemos el combo en nada
            $scope.buscador = "";
        }
    };
    
    $scope.eliminarParticipante = function (p) {
        for(var i=0; i<$scope.listaTotal.length; i++)
        {
            if(p.contactoId == $scope.listaTotal[i].contactoId)
            {
                $scope.listaTotal.splice(i,1);
                break;
            }
        }
      //$scope.reunion.participantes.splice($scope.reunion.participantes.indexOf(p), 1);
    };
    
    //@diego: Esto se utiliza en el select para agregar Participantes (se llama de la funcion agregarParticipante) 
    $scope.puedeAgregar = function (contactoId) {
        if (!$scope.reunion.participantes) {
            // @diego: Si todavía no está inicializada reunion.participantes
            // obviamente no podemos agregar items
            return;
        }
        // de esta forma, podemos recibir el id directamente
        // o un objeto con _id
        // como se usa en el filtro del select2 y este pasa
        // el objeto contacto, usamos así la misma función
        if (contactoId !== undefined && contactoId._id) {
            contactoId = contactoId._id;
        }
        if (!contactoId) {
            return false;
        }

        var found = false;

        for (var i = 0; i < $scope.reunion.participantes.length; i++) {
            if ($scope.reunion.participantes[i].contactoId == contactoId) {
                found = true;
                break;
            }
        }
        return !found;
    };
});