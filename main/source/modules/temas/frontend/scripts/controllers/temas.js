angular.module('bag2.temas', [])
.controller('Temas', function($scope, ORMTema, $location, $filter, ORMOrganigrama, ORMMinuta, ORMTemario) {
    $scope.compromisos = [];
    $scope.compromisosTema = [];
    $scope.temariosTema = [];
    $scope.jurisdicciones = ORMOrganigrama.query();
    var orderBy = $filter('orderBy');
    $scope.arrayTemas = [];
    
    
    $scope.temas = ORMTema.query({eliminado: JSON.stringify({$exists: false})}, function() { //Query trae todo temas excluyendo los eliminados
        angular.forEach($scope.temas, function (t) {
            $scope.arreglo[t._id]=t;
            t.orden = parseInt(t.orden);
            $scope.compromisosTema[t._id] = 0;
            $scope.temariosTema[t._id] = 0;
            $scope.arrayTemas[t._id] = t;
        });
        angular.forEach($scope.temas,function(x){ //Al terminar recorro el arreglo y si EXISTE algun valor en x.temaSuperior es que es el padre.
            if(x.temaSuperior)
            {
                $scope.arreglo[x.temaSuperior].tieneHijos=1;
            }
        });
        $scope.temas = orderBy($scope.temas, 'orden');
        $scope.traerDatos();
	});
	
	$scope.arreglo=[];
    
    $scope.jurisdiccionPorId = function (id) {
      for (var i = 0; i < $scope.jurisdicciones.length; i++) {
          if ($scope.jurisdicciones[i]._id == id)
          {
              return $scope.jurisdicciones[i];
          }
      }  
    };
    
    $scope.tieneSubtemas = function (id) {
      for (var i = 0; i < $scope.temas.length; i++) {
          if (($scope.temas[i].temaSuperior == id) && (!$scope.temas[i].eliminado))
          {
              return true;
          }
      }  
    };
    
    $scope.existeId = function (id) {
      for (var i = 0; i < $scope.temasTodos.length; i++) {
          if ($scope.temasTodos[i]._id == id)
          {
              if ($scope.temasTodos[i].eliminado) {
                  return false;
              } else {
                return true;
              }
          }
      }
      return false;
    };
    
    $scope.sacarEliminados = function () {
      $scope.temasTodos = ORMTema.query({}, function() {
          for (var i = 0; i < $scope.temasTodos.length; i++) {
              if ($scope.temasTodos[i].temaSuperior) {
                  if (!$scope.existeId($scope.temasTodos[i].temaSuperior)) {
                      $scope.temasTodos[i].eliminado = true;
                      $scope.temasTodos[i].$save();
                  }
              }
          }
      });
    };
	
    $scope.ver = function(t) {
        $location.url('/temas/' + t._id);
    };
    $scope.puedeModificar = function() {
            return true;
    };
    $scope.filtroPrimeros = function(tema) {
        if (tema.temaSuperior) {
            return false;
        } else {
            return true;
        }
    };
    $scope.filtroDe = function(idTema, tema) {
        if (tema.temaSuperior === idTema) {
            return true;
        } else {
            return false;
        }
    };
    
    $scope.temaPorId = function (id) {
      for (var i = 0; i < $scope.temas.length; i++) {
          if ($scope.temas[i]._id == id)
          {
              return $scope.temas[i];
          }
      }  
    }; 
    
    
    $scope.ponerNivel = function () {
        var num;
        angular.forEach($scope.temas, function (t) {
            if (!t.nivel) {
                num = $scope.arrayTemas[t.temaSuperior];
                if (!t.temaSuperior) {
                    t.nivel = 1;
                    t.$save();
                } else if (num) {
                    if (num.nivel) {
                        t.nivel = num.nivel + 1;
                        t.$save();
                    }
                }
            }
        });
	};
    
    $scope.traerDatos = function () {
        $scope.minutas = ORMMinuta.query({}, function() {
            $scope.minutas.forEach(function(m) {
                m.compromisos.forEach(function(c, key) {
                    if ((c.estado == "A Tema") && !(c.enEDTe === true)){
                        c.index = key;
                        c.minuta = m._id;
                        c.instancia = m.instancia;
                        $scope.compromisos.push(c);
                    }
                    if(c.tema) {
                        $scope.compromisosTema[c.tema] = $scope.compromisosTema[c.tema] + 1;
                    }
                });
            });
        });
        
        $scope.temarios = ORMTemario.query({}, function() {
            $scope.temarios.forEach(function(m) {
                if (m.temas) {
                    m.temas.forEach(function(c) {
                        if(c.agregado == 'si') {
                            $scope.temariosTema[c.temaId] = $scope.temariosTema[c.temaId] + 1;
                        }
                    });
                }
            });
        });
    };
    
}).controller('DetalleTema', function($scope, ORMTema, RelevanciaIniciativa, SEMGCartaCompromiso, SEMGIndicador, Comuna, ClaseIniciativa, EstadoIniciativa, Planificacion20162019, EjePlanBA2030, EstrategiaPlanBA2030, Fact, RegularizacionDominial,  Obra, Obras2, Iniciativa, ORMOrganigrama, PlanBA2030, ExpedienteSeguimiento, DJAI, BajoAutopista, ORMMinuta, $routeParams, $location, FuenteTema, ORMTemario, $modal, Contactos, ORMInstanciaReunion, ORMReunion) {
    
    $scope.fuentes = FuenteTema.query();
    $scope.jurisdicciones = ORMOrganigrama.query();  
    $scope.temas = ORMTema.query({eliminado: JSON.stringify({$exists: false})});  
    $scope.reuniones = ORMReunion.query();
    $scope.instancias = ORMInstanciaReunion.query();
    $scope.contactos = Contactos.listar();
    
    
    $scope.irABajoAutoposta=function(aplicacion,id)//Funcion para rederigir desde un <tr>
    {
        document.location="/"+aplicacion+id;
    };
    $scope.irA=function(aplicacion,id)//Funcion para rederigir desde un <tr>
    {
        document.location="/"+aplicacion+"/"+id;
    };
    $scope.comunas = Comuna.query();
    $scope.comunaPorId = function (id) {
        for (var i = 0; i < $scope.comunas.length; i++) {
            if ($scope.comunas[i]._id == id)
            {
                return $scope.comunas[i];
            }
        }  
    };  
    $scope.organigramaPorId = function (id) {
        for (var i = 0; i < $scope.jurisdicciones.length; i++) {
            if ($scope.jurisdicciones[i]._id == id)
            {
                return $scope.jurisdicciones[i];
            }
        }  
    };
        
    $scope.cargarQuery=function(coleccion)
    {
        switch(coleccion)
        {
            case "bajoAutopista":
                
                $scope.bajoautopistas = BajoAutopista.query({temas:$routeParams._id});
                break;
            case "djais":
                $scope.djais = DJAI.query({temas:$routeParams._id});
                break;
            case "expedientes":
                $scope.formatFecha = function(fecha){
                    if(fecha){
                        return moment(fecha).format('DD/MM/YYYY')
                    }else{
                        return "";
                    }
                };
                $scope.expedientes = ExpedienteSeguimiento.query({temas:$routeParams._id},function() 
                {
                    $scope.expedientesDict = {};
                    $scope.expedientesSiglas = [];
                    $scope.expedientes.forEach(function(item) 
                    {
                        if (item.tema && !$scope.temasDict[item._id]) 
                        {
                            $scope.expedientesDict[item._id] = item;
                            $scope.expedientesSiglas.push(item.tema);
                        }
                    });
                });
                break;
            case "planBA2030":
                $scope.planes = PlanBA2030.query({temas:$routeParams._id});
                $scope.estrategias = EstrategiaPlanBA2030.query();
                $scope.ejes = EjePlanBA2030.query();
                $scope.ejePorId = function (id) {
                    for (var i = 0; i < $scope.ejes.length; i++) {
                        if ($scope.ejes[i]._id == id)
                        {
                            return $scope.ejes[i];
                        }
                    }  
                };
                $scope.estrategiaPorId = function (id) {
                    for (var i = 0; i < $scope.estrategias.length; i++) {
                        if ($scope.estrategias[i]._id == id)
                        {
                            return $scope.estrategias[i];
                        }
                    }  
                };
                break;
            case "baFacts":
                $scope.facts = Fact.query({temas:$routeParams._id});
                break;
            case "iniciativas":
                $scope.iniciativa=Iniciativa.query({temas:$routeParams._id});
                $scope.clases = ClaseIniciativa.query();
                $scope.estados = EstadoIniciativa.query({obra : false});
                $scope.clasePorId = function (id) {
                    for (var i = 0; i < $scope.clases.length; i++) {
                        if ($scope.clases[i]._id == id)
                        {
                            return $scope.clases[i];
                        }
                    }  
                };
                $scope.estadoPorId = function (id) {
                    for (var i = 0; i < $scope.estados.length; i++) {
                        if ($scope.estados[i]._id == id){
                            return $scope.estados[i];
                        }
                    }
                };
                break;
            case "obras":
                $scope.obras = Obra.query({temas:$routeParams._id},function() {
                    var obras2 = Obras2.query({temas:$routeParams._id},function() {
                        $scope.listado = $scope.obras.concat(obras2);
                    });
                });
                $scope.relevancias = RelevanciaIniciativa.query();
                $scope.prioridadPorId = function (id) {
                    for (var i = 0; i < $scope.relevancias.length; i++) {
                        if ($scope.relevancias[i]._id == id){
                            return $scope.relevancias[i];
                        }
                    }
                };
                break;
            case "planificacion":
                $scope.planificacion=Planificacion20162019.query({temas:$routeParams._id});
                break;
            case "regularizacion":
                $scope.regularizacion=RegularizacionDominial.query({temas:$routeParams._id});
                break;
            case "semg":
                $scope.semgindicador=SEMGIndicador.query({temas:$routeParams._id});
                $scope.cartas = SEMGCartaCompromiso.query({temas:$routeParams._id});
                break;
        }
    };
    
    if ($routeParams.tab) {
        $scope.tab = $routeParams.tab;
    } else {
        $scope.tab = "identificacion";
    }
    $scope.tema = ORMTema.get({_id: $routeParams._id}, function(){
        $scope.minutas = ORMMinuta.query({}, function(){
            $scope.compromisosTema = [];
            $scope.minutas.forEach(function(m) {
                m.compromisos.forEach(function(c) {
                    if (c.tema == $scope.tema._id) {
                        $scope.compromisosTema.push(c);
                    }
                });
            });
        });  
        
        $scope.temarios = ORMTemario.query({}, function(){
            $scope.temariosTema = [];
            $scope.temarios.forEach(function(m) {
                if (m.temas) {
                    m.temas.forEach(function(c) {
                        if ((c.agregado == 'si') && (c.temaId == $scope.tema._id)) {
                            $scope.temariosTema.push(m);
                        }
                    });
                }
            });
        });
    });
    $scope.tienePermiso = function () {
        if ($scope.tema.nivel > 3) {
            return true;
        } else {
            if ($scope.hasPermission('temas.editarPrimeros')) {
                return true;
            } else {
                return false;
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
    $scope.contactoPorId = function (id) {
      for (var i = 0; i < $scope.contactos.length; i++) {
          if ($scope.contactos[i]._id == id)
          {
              return $scope.contactos[i];
          }
      }  
    };
    $scope.temaPorId = function (id) {
      for (var i = 0; i < $scope.temas.length; i++) {
          if ($scope.temas[i]._id == id)
          {
              return $scope.temas[i];
          }
      }  
    };
    $scope.fuentePorId = function (id) {
      for (var i = 0; i < $scope.fuentes.length; i++) {
          if ($scope.fuentes[i]._id == id)
          {
              return $scope.fuentes[i];
          }
      }  
    }; 
    
    $scope.instanciaPorId = function (id) {
      for (var i = 0; i < $scope.instancias.length; i++) {
          if ($scope.instancias[i]._id == id)
          {
              return $scope.instancias[i];
          }
      }  
    };    
    
    $scope.reunionPorId = function (id) {
      for (var i = 0; i < $scope.reuniones.length; i++) {
          if ($scope.reuniones[i]._id == id)
          {
              return $scope.reuniones[i];
          }
      }  
    };
    
    $scope.agregarColumna = function(confirmado, nombre) {
        if (confirmado) {
            $scope.tema.columnas.push(nombre);
        }
        else {
            if (!$scope.tema.columnas) {
                $scope.tema.columnas = [];
            }
            var modalScope = $scope.$new();
            modalScope.nombre = "";
            $modal({
                template: '/views/temas/modals/agregarColu.html',
                persist: true,
                show: true,
                backdrop: 'static',
                scope: modalScope
            });
        }
	};
	
    $scope.agregarFila = function(confirmado, nombre, datos) {
        if (confirmado) {
            $scope.tema.filas.push(nombre);  
            $scope.tema.matrizDatos.push(datos);
        }
        else {
            if (!$scope.tema.filas) {
                $scope.tema.filas = [];
                $scope.tema.matrizDatos = [];
            }
            var modalScope = $scope.$new();
            modalScope.nombre = "";
            modalScope.datos = [];
            $modal({
                template: '/views/temas/modals/agregarfil.html',
                persist: true,
                show: true,
                backdrop: 'static',
                scope: modalScope
            });
        }
	};
	
	
    $scope.editarFila = function(confirmado, nombre, index, datos) {
        if (confirmado) {
            $scope.tema.$save();
        }
        else {
            var modalScope = $scope.$new();
            modalScope.nombre = nombre;
            modalScope.datos = datos;
            modalScope.index = index;
            $modal({
                template: '/views/temas/modals/editarfil.html',
                persist: true,
                show: true,
                backdrop: 'static',
                scope: modalScope
            });
        }
	};
    
    $scope.modificar = function () {
        $scope.modificando = true;
    };
    
    $scope.tieneSubtemas = function (id) {
      for (var i = 0; i < $scope.temas.length; i++) {
          if (($scope.temas[i].temaSuperior == id) && (!$scope.temas[i].eliminado))
          {
              return true;
          }
      }  
    };
    
    $scope.eliminar = function(confirmado) {
        if (confirmado) {
            if ($scope.tieneSubtemas($scope.tema._id)) {
                alert("No se puede eliminar porque este tema tiene subtemas, borre primero los subtemas y luego intente de nuevo");
            } else {
                $scope.tema.eliminado = true;
                $scope.tema.$save(function() {
                    $location.url('/temas/');
                });
            }
        }
        else {
            $("#confirmarEliminar").modal('show');
        }
    };
    $scope.guardar = function() {
        if ($scope.temaPorId($scope.tema.temaSuperior)) {
            if ($scope.temaPorId($scope.tema.temaSuperior).nivel) {
                $scope.tema.nivel = $scope.temaPorId($scope.tema.temaSuperior).nivel + 1;
            }
        } else {
            $scope.tema.nivel = 1;
        }
        if (($scope.tema.nivel < 4) && (!$scope.hasPermission('temas.editarPrimeros'))) {
            alert("No posee permisos para guardar temas en este nivel");
        } else {
            $scope.tema.$save(function() {
                $scope.modificando = false;
            });
        }  
    };
    
}).controller('NuevoTema', function($scope, ORMTema, ORMOrganigrama, $routeParams, $location, FuenteTema, $modal, ORMMinuta) {
    $scope.jurisdicciones = ORMOrganigrama.query();  
    $scope.fuentes = FuenteTema.query();  
    
    $scope.temas = ORMTema.query({eliminado: JSON.stringify({$exists: false})}, function() {
        if ($routeParams.minuta) {
            $scope.minuta = ORMMinuta.get({
                _id : $routeParams.minuta
            }, function(){
                $scope.tema.temaSuperior = $scope.minuta.compromisos[$routeParams.index].tema;
                $scope.tema.nombre = $scope.minuta.compromisos[$routeParams.index].tarea;
                $scope.tema.jurisdiccion = $scope.temaPorId($scope.minuta.compromisos[$routeParams.index].tema).jurisdiccion;
            });
        }
    });
    
    $scope.tab = "identificacion";
    
    $scope.jurisdiccionPorId = function (id) {
      for (var i = 0; i < $scope.jurisdicciones.length; i++) {
          if ($scope.jurisdicciones[i]._id == id)
          {
              return $scope.jurisdicciones[i];
          }
      }  
    };
    $scope.temaPorId = function (id) {
      for (var i = 0; i < $scope.temas.length; i++) {
          if ($scope.temas[i]._id == id)
          {
              return $scope.temas[i];
          }
      }  
    };
    $scope.fuentePorId = function (id) {
      for (var i = 0; i < $scope.fuentes.length; i++) {
          if ($scope.fuentes[i]._id == id)
          {
              return $scope.fuentes[i];
          }
      }  
    };
    
    $scope.tema = new ORMTema();
    $scope.tema.columnas = [];
    $scope.tema.filas = [];
    $scope.tema.matrizDatos = []; 
    
    $scope.agregarColumna = function(confirmado, nombre) {
        if (confirmado) {
            $scope.tema.columnas.push(nombre);
        }
        else {
            var modalScope = $scope.$new();
            modalScope.nombre = "";
            $modal({
                template: '/views/temas/modals/agregarColu.html',
                persist: true,
                show: true,
                backdrop: 'static',
                scope: modalScope
            });
        }
	};
	
    $scope.agregarFila = function(confirmado, nombre, datos) {
        if (confirmado) {
            $scope.tema.filas.push(nombre);  
            $scope.tema.matrizDatos.push(datos);
        }
        else {
            var modalScope = $scope.$new();
            modalScope.nombre = "";
            modalScope.datos = [];
            $modal({
                template: '/views/temas/modals/agregarfil.html',
                persist: true,
                show: true,
                backdrop: 'static',
                scope: modalScope
            });
        }
	};
    
    $scope.$watch('tema.jurisdiccion', function(g) {
        $scope.jurisTema = ORMOrganigrama.get({
            _id: g
        });
    });
    $scope.$watch('tema.temaSuperior', function(g) {
        $scope.superiorTema = ORMTema.get({
            _id: g
        });
    });
	
    $scope.guardar = function() {
        if ($routeParams.minuta) {
            $scope.minuta.compromisos[$routeParams.index].enEDTe = true;
            $scope.minuta.$save();
        }
        if ($scope.superiorTema.nivel) {
            $scope.tema.nivel = $scope.superiorTema.nivel + 1;
        } else {
            $scope.tema.nivel = 1;
        }
        if (($scope.tema.nivel < 4) && (!$scope.hasPermission('temas.editarPrimeros'))) {
            alert("No posee permisos para guardar temas en este nivel");
        } else {
            $scope.tema.$save(function(data) {
                $location.url('/temas');
            });
        }
	};
})
.controller('TemasPrint', function($scope, ORMTema, $location, $routeParams) {
    $scope.arreglo=[];
    
    $scope.temas = ORMTema.query({eliminado: JSON.stringify({$exists: false})},function() //Query trae todo temas excluyendo los eliminados
    {
        angular.forEach($scope.temas, function (t){  //Luego del Query lo recorro y asigno a la posicion t.id el objeto entero
            $scope.arreglo[t._id]=t;
        });
        angular.forEach($scope.temas,function(x){ //Al terminar recorro el arreglo y si EXISTE algun valor en x.temaSuperior es que es el padre.
            if(x.temaSuperior)
            {
                $scope.arreglo[x.temaSuperior].tieneHijos=1;
            }
        });
    });
    
    $scope.temaPrint = $routeParams._id;
    
    $scope.filtroPrimeros = function(ba) 
    {
        if($routeParams._id=="todos")
        {
            if (ba.temaSuperior) 
            {
                return false;
            } 
            else 
            {
                return true;
            }
        }
        else
        {
            if(ba.temaSuperior==$scope.temaPrint)
            {
                return true;
            }
            else
            {
                return false;
            }
        }
    };
/*
    $scope.puedeModificar = function() {
            return true;
    };
    
    $scope.filtroDe = function(idTema, tema) {
        if (tema.temaSuperior === idTema) {
            return true;
        } else {
            return false;
        }
    };*/
});