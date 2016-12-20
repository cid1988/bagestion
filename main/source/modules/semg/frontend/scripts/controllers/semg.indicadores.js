angular.module('bag2.semg.indicadores', []).controller('IndicadorSEMGCtrl', function($scope,SEMGTablaGeneralJurisIndicadores,SEMGIndicador,Jurisdicciones, ORMOrganigrama,SEMGMetrica,User,$routeParams,ObjImpacto,ObjMinisteriales){
    //Nuevo.
    var tablaJurisIndicadores=SEMGTablaGeneralJurisIndicadores.query(function()
    {
        var jurisPoa = Jurisdicciones.query(function(){
        //Este es el array del cual el html matrizindicadores.html tomara los datos al armar la tabla
        $scope.organigrama = [];
        
        //Almaceno todas las jurisdicciones en un array para mostrar en una tabla
        for (var x=0; x<jurisPoa.length; x++)
        {
            if (jurisPoa[x].idOrmOrganigrama !== 0)
            {
                $scope.organigrama.push(jurisPoa[x]);
            } 
        }
        
        for(var i=0; i<$scope.organigrama.length; i++)
        {
            for(var j=0; j<tablaJurisIndicadores.length; j++)
            {
                if(tablaJurisIndicadores[j].jurisdiccion==$scope.organigrama[i].idOrmOrganigrama)
                {
                    $scope.organigrama[i].infoIndicadores=tablaJurisIndicadores[j];
                    
                    if($scope.organigrama[i].infoIndicadores.cantidadIndicadores>0)
                    {
                        $scope.organigrama[i].infoIndicadores.porcentajeCantidadValidados=($scope.organigrama[i].infoIndicadores.cantidadValidados*100)/$scope.organigrama[i].infoIndicadores.cantidadIndicadores;
                    }
                    else
                    {
                        $scope.organigrama[i].infoIndicadores.porcentajeCantidadValidados=0;
                    }

                    tablaJurisIndicadores.splice(i,1);
                }
            }
        }
        
        for(var z=0; z<$scope.organigrama.length; z++)
        {
            if(!$scope.organigrama[z].infoIndicadores)
            {
                $scope.organigrama[z].infoIndicadores={
                    sumatoriaPorcentajeCompletado:0,
                    cantidadValidados:0,
                    cantidadIndicadores:0,
                    cantidadAprobados:-1,
                    porcentajeCantidadValidados:0
                };
            }
        }
        /*
            //Realizo un query de todos los indicadores para ir comparando con cada jurisdiccion
            $scope.indicadores = SEMGIndicador.query(function(datos){
                //Por cada jurisdiccion recorro todos los indicadores
                for(var i=0;i < $scope.organigrama.length;i++)
                {
                    //Variables "flag" que utilizo para hacer diferentes calculos al mostrar
                    var completitudIndicadores=0, cantIndicadores=0, completitudValidado=0, cantAprobados=0;
                    
                    //"datos" es lo que retorna el query de $scope.indicadores
                    for(var x=0; x<datos.length; x++)
                    {
                        //Cuando encuentra una coincidencia entre el id de la jurisdiccion y el id que tiene el indicador como dependencia
                        if($scope.organigrama[i].idOrmOrganigrama == datos[x].dependencia)
                        {
                            //1 indicador mas al total de indicadores que dependen de la jurisdiccion
                            cantIndicadores++;
                            
                            //Se suma los valores el (% de completitud) de todos los indicadores
                            if(datos[x].nivelCompletitud)
                            {
                                completitudIndicadores = completitudIndicadores + datos[x].nivelCompletitud;
                            }
                            
                            //Se suma todos los indicadores que esten validados por SPLyCG
                            if(datos[x].validado)
                            {
                                completitudValidado++;
                            }
                            
                            //Se suma todos los indicadores que esten aprobados
                            if(datos[x].aprobado && datos[x].aprobado == true)
                            {
                                cantAprobados++;
                            }
                        }
                    }
    
                    //A la sumatoria de (% de completitud) de todos los indicadores en una jurisdiccion, los divido por la cantidad de jurisdicciones en dicha jurisdiccion
                    if(completitudIndicadores == 0){
                        $scope.organigrama[i].completitudIndicadores = 0;
                    }else{
                        $scope.organigrama[i].completitudIndicadores = completitudIndicadores / cantIndicadores;
                    }
                    
                    //Regla de 3 simple entre todos los indicadores que pertenecen a una jurisdiccion validados, para mostrar en la tabla.
                    if(completitudValidado == 0){
                        $scope.organigrama[i].completitudValidado = 0;
                    }else{
                        $scope.organigrama[i].completitudValidado = (completitudValidado*100) / cantIndicadores;
                    }
    
                    //Sumatoria entre todos los indicadores que pertenecen a la jurisdiccion.
                    $scope.organigrama[i].cantIndicadores=cantIndicadores;
                    
                    //Si la jurisdiccion no tiene indicadores se mostrara un "No", si los tiene y estan todos validados, se mostrara un "Si" y en caso de que la cantidad de indicadores sea diferente a la cantidad de valdiados, se mostrara un "No".
                    if(cantIndicadores==0){
                        $scope.organigrama[i].aprobado="No";
                    }else if(cantAprobados == cantIndicadores){
                        $scope.organigrama[i].aprobado = "Si";
                    }else{
                        $scope.organigrama[i].aprobado = "No";
                    }
                }
            
            });
        */
      });
    });
    $scope.unirBases=function()
    {
        var jurisdicciones2=Jurisdicciones.query(function(){
            var jurisdicciones=[];
        
            for(var q=0; q<jurisdicciones2.length; q++)
            {
                jurisdicciones.push({
                    jurisdiccion:jurisdicciones2[q].idOrmOrganigrama,
                    cantidadIndicadores:0,
                    sumatoriaPorcentajeCompletado:0,
                    cantidadValidados:0,
                    cantidadAprobados:0,
                    indicadores:[]
                });
            }
            
            var indicadores=SEMGIndicador.query(function(){
                for(var i=0; i<indicadores.length; i++)
                {
                    for(var x=0; x<jurisdicciones.length; x++)
                    {
                        if(jurisdicciones[x].jurisdiccion==indicadores[i].dependencia)
                        {
                            jurisdicciones[x].cantidadIndicadores++;
                            jurisdicciones[x].sumatoriaPorcentajeCompletado+=indicadores[i].nivelCompletitud;
                            if(indicadores[i].validado){
                                jurisdicciones[x].cantidadValidados++;
                            }
                            if(indicadores[i].aprobado){
                                jurisdicciones[x].cantidadAprobados++;
                            }
                            jurisdicciones[x].indicadores.push({
                               _id:indicadores[i]._id,
                               porcentajeCarga:indicadores[i].nivelCompletitud,
                               validado:indicadores[i].validado,
                               aprobado:indicadores[i].aprobado
                            });
                        }
                    }
                }
                
                var nuevo = {};
                for(var z=0; z<jurisdicciones.length; z++)
                {
                    nuevo = new SEMGTablaGeneralJurisIndicadores();
                    nuevo.jurisdiccion=jurisdicciones[z].jurisdiccion;
                    nuevo.cantidadIndicadores=jurisdicciones[z].cantidadIndicadores;
                    nuevo.sumatoriaPorcentajeCompletado=jurisdicciones[z].sumatoriaPorcentajeCompletado;
                    nuevo.cantidadValidados=jurisdicciones[z].cantidadValidados;
                    nuevo.cantidadAprobados=jurisdicciones[z].cantidadAprobados;
                    nuevo.indicadores=jurisdicciones[z].indicadores;
                    nuevo.$save();
                }
                
                jurisdicciones=null, nuevo=null;
            });
        });
    };
    
    //Funcion para cambiar los filtros
    $scope.cambiarFiltro=function(variable){
        if(variable=="")
        {
            return true;
        }
        else
        {
            return "";
        }
    };

    $scope.jurisdic = $routeParams.filtro;
    
    var impactos = ObjImpacto.query({},function(){
        var objMinisteriales = ObjMinisteriales.query({},function(){
            $scope.impactoPorId = function(id){
                for (var i = 0; i < impactos.length; i++) {
                    if (impactos[i]._id == id){
                        return impactos[i];
                    }
                }
            };
            $scope.ministerialPorId = function(id){
                for (var i = 0; i < objMinisteriales.length; i++) {
                    if (objMinisteriales[i]._id == id){
                        return objMinisteriales[i];
                    }
                }
            };
        });
    });
    
    $scope.variableMinisterial="";
    $scope.estiloMinisterial = "";
    $scope.compararMinisterial=function(objMinisterial, indice){
        if (indice === 0) {
            $scope.variableMinisterial = objMinisterial;
            $scope.estiloImpacto = "1px solid #aaaaaa";
            return true;
        } else {
            if($scope.orden.length==3){
                if(objMinisterial == $scope.variableMinisterial){
                    $scope.estiloMinisterial = "";
                    return false;
                }else {
                    $scope.variableMinisterial = objMinisterial;
                    $scope.estiloMinisterial = "1px solid #aaaaaa";
                    return true;
                }
            }else {
                $scope.estiloMinisterial = "";
                return true;
            }
        }
    };
    
    $scope.variableImpacto = "";
    $scope.estiloImpacto = "";
    $scope.compararImpacto=function(objImpacto, indice){
        if (indice === 0) {
            $scope.variableImpacto = objImpacto;
            $scope.estiloImpacto = "1px solid #aaaaaa";
            return true;
        }else{
            if($scope.orden.length==3){
                if(objImpacto == $scope.variableImpacto){
                    $scope.estiloImpacto = "";
                    return false;
                }else {
                    $scope.variableImpacto = objImpacto;
                    $scope.estiloImpacto = "1px solid #aaaaaa";
                    return true;
                }
            }else {
                $scope.estiloImpacto = "";
                return true;
            }
        }
    };
    
    /*$scope.duplicar = function (anio) {
        var indicadoresADupli = SEMGIndicador.query({
            anio : $routeParams.anio
        }, function() {
            angular.forEach(indicadoresADupli, function(i) {
                var indicador = new SEMGIndicador({
                    dependencia: i.dependencia,
                    objetivoImpacto : i.objetivoImpacto,
                    objetivoMinisterial : i.objetivoMinisterial,
                    indicadorImpacto : i.indicadorImpacto,
                    descripcionImpacto : i.descripcionImpacto,
                    metodoCalculo : i.metodoCalculo,
                    metrica : i.metrica,
                    sentido : i.sentido,
                    frecuencia : i.frecuencia,
                    peso : i.peso,
                    temas : i.temas,
                    unidad4 : i.unidad3,
                    unidad3 : i.unidad2,
                    unidad2 : i.unidad1,
                    metaAnterior : i.metaAnio,
                    lineaBase : i.lineaBase,
                    semaforoVerde : i.semaforoVerde,
                    semaforoAmarillo : i.semaforoAmarillo,
                    semaforoRojo: i.semaforoRojo,
                    fuente : i.fuente,
                    dependenciaFuente : i.dependenciaFuente,
                    contactoFuente : i.contactoFuente,
                    fuenteExterna : i.fuenteExterna,
                    fuenteInterna : i.fuenteInterna,
                    comentarios : i.comentarios,
                    indicadorAnterior : i._id,
                    anio : parseInt(anio)
                });
                indicador.$save();
            });
        }); 
    };*/
	
    $scope.filtro = {dependencia : ''};
    $scope.user = User.findByName({
        username: $scope.username
    }, function() {
        if ($scope.hasPermission('semg.verSecretaria')) {
    	    $scope.indicadores = SEMGIndicador.query({
    	        dependencia : $routeParams.filtro,
                anio : $routeParams.anio
            });
        }
        else if ($scope.user.jurisdiccion) {
            $scope.indicadores = SEMGIndicador.query({
                dependencia : $scope.user.jurisdiccion,
                anio : $routeParams.anio
            });
            $scope.filtro = {dependencia : $scope.user.jurisdiccion};
        }
        else {
            $scope.indicadores = SEMGIndicador.query({
                anio : $routeParams.anio
            });
        }
        if ($routeParams.filtro) {
            $scope.filtro.dependencia = $routeParams.filtro;
        }
    });
	$scope.metricas = SEMGMetrica.query();
	
    $scope.todasColumnas = false;
    $scope.anio = $routeParams.anio;
    $scope.orden = ['objetivoImpacto','objetivoMinisterial','indicadorImpacto'];
    $scope.filtroAprobado = 'Todos';
    var d = new Date();
    $scope.mes = d.getMonth();
    
    $scope.color = function (indicador) {
        if (indicador.sentido && indicador.semaforoRojo && indicador.semaforoAmarillo && indicador.semaforoVerde) {
            if (indicador.cumplimiento12meses) {
                if (indicador.sentido == "Ascendente") {
                    if (parseInt(indicador.cumplimiento12meses) >= parseInt(indicador.semaforoVerde)) {
                        return '#58b058';
                    } else if (parseInt(indicador.cumplimiento12meses) >= parseInt(indicador.semaforoAmarillo)) {
                        return '#fbae42';
                    } else {
                        return '#c73e38';
                    }
                    
                } else {
                    if (parseInt(indicador.cumplimiento12meses) >= parseInt(indicador.semaforoRojo)) {
                        return '#c73e38';
                    } else if (parseInt(indicador.cumplimiento12meses) >= parseInt(indicador.semaforoAmarillo)) {
                        return '#fbae42';
                    } else {
                        return '#58b058';
                    }
                }
            } else if (indicador.avance6meses) {
                if (indicador.sentido == "Ascendente") {
                    if (parseInt(indicador.avance6meses) >= parseInt(indicador.semaforoVerde)) {
                        return '#58b058';
                    } else if (parseInt(indicador.avance6meses) >= parseInt(indicador.semaforoAmarillo)) {
                        return '#fbae42';
                    } else {
                        return '#c73e38';
                    }
                    
                } else {
                    if (parseInt(indicador.avance6meses) >= parseInt(indicador.semaforoRojo)) {
                        return '#c73e38';
                    } else if (parseInt(indicador.avance6meses) >= parseInt(indicador.semaforoAmarillo)) {
                        return '#fbae42';
                    } else {
                        return '#58b058';
                    }
                }
            }
        } else {
            return '#c73e38';
        }
    };
    
    $scope.eliminar = function(confirmado, indicador) {
        if (confirmado) {
            $scope.indicadorAborrar.$delete(function() {
                if ($scope.hasPermission('semg.editar')) {
                    $scope.indicadores = SEMGIndicador.query({anio : $routeParams.anio});
                } else if ($scope.user.jurisdiccion) {
                    $scope.indicadores = SEMGIndicador.query({
                        dependencia : $scope.user.jurisdiccion,
                        anio : $routeParams.anio
                    });
                    $scope.filtro = {dependencia : $scope.user.jurisdiccion};
                } else {
                    $scope.indicadores = SEMGIndicador.query({anio : $routeParams.anio});
                }
            });
        }
        else {
            $scope.indicadorAborrar = indicador;
            $("#confirmarEliminar").modal('show');
        }
    };
    
    $scope.metricaPorId = function (id) {
      for (var i = 0; i < $scope.metricas.length; i++) {
          if ($scope.metricas[i]._id == id)
          {
              return $scope.metricas[i];
          }
      }  
    };
    
    /*$scope.impactoPorId = function (id) {
      for (var i = 0; i < $scope.impactos.length; i++) {
          if ($scope.impactos[i]._id == id){
              return $scope.impactos[i];
          }
      }  
    };*/
    
    /*$scope.ministerialPorId = function (id) {
      for (var i = 0; i < $scope.ministeriales.length; i++) {
          if ($scope.ministeriales[i]._id == id){
              return $scope.ministeriales[i];
          }
      }  
    };*/
    
    $scope.organigramaPorId = function (id) {
        if($scope.organigrama)
        {
            for (var i = 0; i < $scope.organigrama.length; i++) {
                  if ($scope.organigrama[i].idOrmOrganigrama == id)
                  {
                      return $scope.organigrama[i];
                  }
              }  
        }
      
    };
    
    $scope.diferenciaUnidades = function (unidad1, unidad2) {
        if (unidad1 && unidad2) {
            if (((unidad1*2) < unidad2) || ((unidad1/2) > unidad2)) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    };
    
    $scope.reverse = function(array) {
        var copy = [].concat(array);
        return copy.reverse();
    };
    
    $scope.campoVacio = function (campo) {
        if (!campo) {
            return true;
        } else {
            return false;
        }
    };
    
    $scope.nivelDeCarga = function (indicador) {
        var total = 0;
        if (indicador.objetivoImpacto) total = total + 1;
        if (indicador.objetivoMinisterial) total = total + 1;
        if (indicador.dependencia) total = total + 1;
        if (indicador.metodoCalculo) total = total + 1;
        if (indicador.sentido) total = total + 1;
        if (indicador.unidad4) total = total + 1;
        if (indicador.unidad3) total = total + 1;
        if (indicador.unidad2) total = total + 1;
        if (indicador.unidad1) total = total + 1;
        if (indicador.responsableCarga) total = total + 1;
        if (indicador.responsableValidacion) total = total + 1;
        if (indicador.indicadorImpacto) total = total + 1;
        if (indicador.metrica) total = total + 1;
        if (indicador.frecuencia) total = total + 1;
        if (indicador.peso) total = total + 1;
        if (indicador.fuente) total = total + 1;
        if (total > 10) {
            return true;
        } else {
            return false;
        }
    };
    
    /* $scope.nivelDeCargaE6 = function (indicador) {
        var total = 0;
        if (indicador.puntaje6meses) total = total + 1;
        if (indicador.evaluacionCategoria6meses) total = total + 1;
        if (indicador.evaluacionReporte6meses) total = total + 1;
        if (total > 2) {
            return true;
        } else {
            return false;
        }
    };
    
    $scope.nivelDeCargaE12 = function (indicador) {
        var total = 0;
        if (indicador.puntaje12meses) total = total + 1;
        if (indicador.evaluacionCategoria12meses) total = total + 1;
        if (indicador.evaluacionReporte12meses) total = total + 1;
        if (total > 2) {
            return true;
        } else {
            return false;
        }
    }; */ 
    
    $scope.data = [{
        values: [{label : "Unidad "+($scope.anio-4), series : 0, value : 0},
                {label : "Unidad "+($scope.anio-3), series : 0, value : 0},
                {label : "Unidad "+($scope.anio-2), series : 0, value : 0},
                {label : "Unidad "+($scope.anio-1), series : 0, value : 0},
                {label : "Meta "+$scope.anio, series : 0, value : 0}],
        key: "Indicadores",
        nombre: ""
    }];
    
    $scope.options = {
        chart: {
            type: 'discreteBarChart',
            height: 200,
            width: 560,
            margin : {
                top: 20,
                right: 20,
                bottom: 40,
                left: 55
            },
            noData: 'Sin datos',
            x: function(d){return d.label;},
            y: function(d){return d.value;},
            showValues: true,
            valueFormat: function(d){
                return d;
            },
            transitionDuration: 500,
            xAxis: {
            },
            yAxis: {
                tickFormat: function (v) {
                    return v;
                },
                max: 100,
                axisLabelDistance: 30
            }
        }
    };
    
    $scope.soloNumeros = function(cadenaAnalizar) {
        if (cadenaAnalizar) {
            var nuevoString = "";
            for (var i = 0; i< cadenaAnalizar.length; i++) {
                 var caracter = cadenaAnalizar.charAt(i);
                 if( caracter == "0" || caracter == "1" || caracter == "2" || caracter == "3" || caracter == "4" || caracter == "5" || caracter == "6" || caracter == "7" || caracter == "8" || caracter == "9") {
                    nuevoString = nuevoString + caracter;
                  }
                 if( caracter == ",") {
                    nuevoString = nuevoString + ".";
                  }
            }
            return nuevoString;
        } else {
            return "";
        }
    };
    
    $scope.verGrafico = function(indicador) {
        $scope.data[0].values[0].value = parseFloat($scope.soloNumeros(indicador.unidad4));
        $scope.data[0].values[1].value = parseFloat($scope.soloNumeros(indicador.unidad3));
        $scope.data[0].values[2].value = parseFloat($scope.soloNumeros(indicador.unidad2));
        $scope.data[0].values[3].value = parseFloat($scope.soloNumeros(indicador.unidad1));
        $scope.data[0].values[4].value = parseFloat($scope.soloNumeros(indicador.metaAnio));
        $scope.data.nombre = indicador.indicadorImpacto;
        
        $("#verGrafico").modal('show');
    };
    
    $scope.verComentarios = function(indicador) {
        $scope.dataC = indicador;
        $("#verComentarios").modal('show');
    };
    
    // $scope.compararMinisterial=function(objMinisterial)
    // {
    //     if($scope.orden.length==3)
    //     {
    //         if(objMinisterial==$scope.variableMinisterial)
    //         {
    //             $scope.estiloMinisterial = "";
    //             return false;
    //         }
    //         else
    //         {
    //             $scope.variableMinisterial=objMinisterial;
    //             $scope.estiloMinisterial = "1px solid #aaaaaa";
    //             return true;
    //         }
    //     }
    //     else 
    //     {
    //         $scope.estiloMinisterial = "";
    //         return true;
    //     }
    // };
})
.controller('IndicadorSEMGNuevoCtrl', function($scope, SEMGTablaGeneralJurisIndicadores, $location,SEMGIndicador,API,SEMGMetrica,Contactos,ORMOrganigrama,User,$modal,$routeParams,Jurisdicciones,SEMGCompromisos,SEMGTemas) {
	//Nuevo codigo
	$scope.jurisdiccionesPOA = Jurisdicciones.query({}, function(){
	    $scope.$watch('indicador.dependencia', function(d) {
    	    API.poa.listarObjsImpactoPorJurisdiccion($scope.jurisdiccionPOAPorId($scope.indicador.dependencia))
                .then(function(objImpactos) {
                   $scope.impactosPOA =  objImpactos;
            });
    	}); 
	});
	
	$scope.$watch('indicador.objetivoImpacto', function(d) {
	    API.poa.listarObjsMinisterialesPorObImpacto($scope.indicador.objetivoImpacto)
            .then(function(objMinis) {
               $scope.ministerialesPOA =  objMinis;
               
               $scope.ministerialPOAPorId = function (id) {
                  for (var i = 0; i < $scope.ministerialesPOA.length; i++) {
                      if ($scope.ministerialesPOA[i]._id == id)
                      {
                          return $scope.ministerialesPOA[i];
                      }
                  }  
                };
        });
	});
	
	$scope.$watch('indicador.objetivoMinisterial', function(d) {
	    API.poa.listarObjsOperativosPorObMinisterial($scope.indicador.objetivoMinisterial)
            .then(function(objOper) {
                $scope.operativosPOA =  objOper;
                
                $scope.operativoPOAPorId = function (id) {
                    for(var i = 0; i < $scope.operativosPOA.length; i++){
                        if ($scope.operativosPOA[i]._id == id){
                            return $scope.operativosPOA[i];
                        }
                    }
                };
                $scope.todosLosProyectos = [];
                for(var i=0;i < $scope.operativosPOA.length;i++){
                    API.poa.listarProyectosPorObOperativo($scope.operativosPOA[i]._id)
                        .then(function(proy) {
                            proy.forEach(function(p){
                                $scope.todosLosProyectos.push(p);
                            })
                
                            $scope.proyectoPOAPorId = function (id) {
                                for(var i = 0; i < $scope.todosLosProyectos.length; i++){
                                    if ($scope.todosLosProyectos[i]._id == id){
                                        return $scope.todosLosProyectos[i];
                                    }
                                }
                            };
                    });
                }
        });
        var indicadores = SEMGIndicador.query({dependencia: $routeParams._id,objetivoMinisterial: $scope.indicador.objetivoMinisterial},function(){
            var pesoTotal = 0;
            for(var i = 0;i < indicadores.length;i++){
                if(indicadores[i]._id !== $scope.indicador._id){
                    if(indicadores[i].peso){
                        pesoTotal = pesoTotal + indicadores[i].peso
                    }
                }
            }
            $scope.pesoTotal = 100 - (pesoTotal);
        });
	});
	
	$scope.agregarProyecto = function(idProyecto){
        if (!$scope.indicador.proyectos || !$scope.indicador.proyectos != []) {
            $scope.indicador.proyectos = [];
        }
        $scope.indicador.proyectos.push(idProyecto);
        $scope.proyectos = "";
    };
    
    if ($routeParams._id) {
	    $scope.indicador = new SEMGIndicador({
	        peso : 0,
            dependencia: $routeParams._id,
            anio : parseInt($routeParams.anio),
            proyectos: []
        });
	}
	
	$scope.agregarJustificacion = function(data) {
        if (!$scope.indicador.justificacionMeta) {
            $scope.indicador.justificacionMeta = [];
        }
        $scope.indicador.justificacionMeta.push(data);
        $scope.justificacion = "";
    };
	
	var comprobarCompletitud = function(){
        var nivelCarga = 0;
        var ind = $scope.indicador;
        
        ind.objetivoImpacto && ind.objetivoImpacto.length ? nivelCarga = nivelCarga + 1 : '';
        ind.objetivoMinisterial && ind.objetivoMinisterial.length ? nivelCarga = nivelCarga + 1 : '';
        ind.indicadorImpacto && ind.indicadorImpacto.length ? nivelCarga = nivelCarga + 1 : '';
        ind.descripcionImpacto && ind.descripcionImpacto.length ? nivelCarga = nivelCarga + 1 : '';
        ind.metrica && ind.metrica.length ? nivelCarga = nivelCarga + 1 : '';
        ind.metodoCalculo && ind.metodoCalculo.length ? nivelCarga = nivelCarga + 1 : '';
        ind.sentido && ind.sentido.length ? nivelCarga = nivelCarga + 1 : '';
        ind.frecuencia && ind.frecuencia.length ? nivelCarga = nivelCarga + 1 : '';
        ind.peso && ind.peso > 0 ? nivelCarga = nivelCarga + 1 : '';
        ind.metaAnio && ind.metaAnio > 0 ? nivelCarga = nivelCarga + 1 : '';
        ind.semaforizacion && ind.semaforizacion.rango1 && ind.semaforizacion.rango1 > 0 ? nivelCarga = nivelCarga + 1 : '';
        ind.semaforizacion && ind.semaforizacion.rango2 && ind.semaforizacion.rango2 > 0 ? nivelCarga = nivelCarga + 1 : '';
        ind.justificacionMeta && ind.justificacionMeta.length ? nivelCarga = nivelCarga + 1 : '';
        ind.fuente && ind.fuente.length ? nivelCarga = nivelCarga + 1 : '';
        ind.referenteFuente && ind.referenteFuente.length ? nivelCarga = nivelCarga + 1 : '';
        ind.recoleccionDatos && ind.recoleccionDatos.length ? nivelCarga = nivelCarga + 1 : '';
        ind.ejes && ind.ejes.length ? nivelCarga = nivelCarga + 1 : '';
        ind.compromiso && ind.compromiso.length ? nivelCarga = nivelCarga + 1 : '';
        ind.temas && ind.temas.length ? nivelCarga = nivelCarga + 1 : '';
        
        nivelCarga < 19 ? $scope.requeridos = false : $scope.requeridos = true;
        return nivelCarga / 19 * 100;
    };
    
    $scope.filtroProyectos = function(proyecto){
        return $scope.indicador && $scope.indicador.proyectos && $scope.indicador.proyectos.indexOf(proyecto._id) == -1;
    };
    
    $scope.filtroTemas = function(tema){
        //Filtrar temas ya agregados
    };
    
    $scope.user = User.findByName({
        username: $scope.username
    });
    
    $scope.compromisos = SEMGCompromisos.query();
    $scope.temas = SEMGTemas.query();
    $scope.contactos = Contactos.listar();
	$scope.organigrama = ORMOrganigrama.query();
	
	//---------------------------------------------------------------------------
	
    $scope.anio = $routeParams.anio;
	
    $scope.jurisdiccionPOAPorId = function (id) {
        for (var i = 0; i < $scope.jurisdiccionesPOA.length; i++) {
            if ($scope.jurisdiccionesPOA[i].idOrmOrganigrama == id){
                return $scope.jurisdiccionesPOA[i]._id;
            }
        }  
    };
	
	$scope.metricas = [];
	var metricasTodas = SEMGMetrica.query({}, function() {
        angular.forEach(metricasTodas, function(b) {
            $scope.metricas.push(b.nombre);
        });
	});
	$scope.impactos = [];
	var impactosTodas = SEMGIndicador.query({anio : $routeParams.anio}, function() {
        angular.forEach(impactosTodas, function(b) {
            if ($scope.impactos.indexOf(b.objetivoImpacto) == -1) {
                $scope.impactos.push(b.objetivoImpacto);
            }
        });
	});
	$scope.ministeriales = [];
	var ministerialesTodas = SEMGIndicador.query({anio : $routeParams.anio}, function() {
        angular.forEach(ministerialesTodas, function(b) {
            if ($scope.ministeriales.indexOf(b.objetivoMinisterial) == -1) {
                $scope.ministeriales.push(b.objetivoMinisterial);
            }
        });
	});
    
    $scope.mostrarTema = function (r) {
        if (r.eliminado) {
            return false; 
        } else {
            return true;
        }
    };
    $scope.tab = "datos";
    $scope.indicador.vieneDePOA = false;
    $scope.indicador.validado = false;
    $scope.indicador.aprobado = false;
    $scope.indicador.validadoResul6meses = false;
    $scope.indicador.aprobadoResul6meses = false;
    $scope.indicador.validadoResul12meses = false;
    $scope.indicador.aprobadoResul12meses = false;
    $scope.indicador.anio = parseInt($routeParams.anio);
    
    $scope.agregarMetrica = function(confirmado, data) {
        if (confirmado) {
            $scope.metricaNueva.nombre = data.nombre;
            $scope.metricaNueva.$save();
	        $scope.metricas = SEMGMetrica.query();
        }
        else {
            $scope.metricaNueva = new SEMGMetrica();
            var modalScope = $scope.$new();
            
            modalScope.data = {
                nombre: ''
            };
            $modal({template: '/views/semg/indicadores/agregarMetrica.html', persist: true, show: true, backdrop: 'static', scope: modalScope});
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
    
    $scope.metricaPorId = function (id) {
      for (var i = 0; i < $scope.metricas.length; i++) {
          if ($scope.metricas[i]._id == id)
          {
              return $scope.metricas[i];
          }
      }  
    };
    
    $scope.agregarComen = function(confirmado, data) {
        if(confirmado){
            data.usuario = $scope.user.username;
            $scope.indicador.comentarios.push(data);
        }
        else{
            if (!$scope.indicador.comentarios){
                $scope.indicador.comentarios = [];
            }
            var modalScope = $scope.$new();
            
            modalScope.data = {
                descripcion: '',
                campo: '',
                cuando:undefined
            };
            $modal({template: '/views/semg/indicadores/agregarComentario.html', persist: true, show: true, backdrop: 'static', scope: modalScope});
        }
    };
    
    $scope.diferenciaUnidades = function (unidad1, unidad2) {
        if (unidad1 && unidad2) {
            if (((unidad1*2) < unidad2) || ((unidad1/2) > unidad2)) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    };
    
    $scope.campoVacio = function (campo) {
        if (!campo) {
            return true;
        } else {
            return false;
        }
    };
    
    $scope.organigramaPorId = function (id) {
      for (var i = 0; i < $scope.organigrama.length; i++) {
          if ($scope.organigrama[i]._id == id)
          {
              return $scope.organigrama[i];
          }
      }  
    };
    
    //Agregar temas
    $scope.agregarTema = function(dataTema) {
        if (!$scope.indicador.temas) {
            $scope.indicador.temas = [];
        }
        $scope.indicador.temas.push(dataTema);
        $scope.dataTema = "";
    };
    
    $scope.eliminarListaElem = function(elemento, lista) {
        lista.splice(lista.indexOf(elemento), 1);
    };
    
    $scope.reverse = function(array) {
        var copy = [].concat(array);
        return copy.reverse();
    };
    
    $scope.eliminarElemento = function(array,elemento) {
        var indice = array.indexOf(elemento);
        if(indice!=-1) array.splice(indice, 1);
    };
    
    
    
	$scope.guardar = function(){
        $scope.indicador.nivelCompletitud = comprobarCompletitud();
        
        if (!$scope.hasPermission('semg.editar')) {
            if (!$scope.indicador.modifica) {
                $scope.indicador.modifica = [];
            }
            $scope.indicador.modifica.push({usuario: $scope.username, fecha: new Date()});
            if ($scope.indicador.modifica.length > 5) {
                $scope.indicador.modifica.shift();
            }
        }
        $scope.indicador.$save({}, function() {
            guardarTablaJurisIndicadores($scope.indicador,true,function()
            {
                $location.url('/semg/indicadores/' + $scope.anio + '/' + $scope.indicador._id);
            });
        });
        
	};
	
	function guardarTablaJurisIndicadores(indicador, esNuevo, funcionCallback)
    {
        var nuevoIndicador=SEMGTablaGeneralJurisIndicadores.query({"jurisdiccion":indicador.dependencia},function(){
            if(nuevoIndicador.length>0)
            {
                nuevoIndicador=nuevoIndicador[0];
                if(esNuevo)
                {
                    nuevoIndicador.sumatoriaPorcentajeCompletado+=indicador.nivelCompletitud;
                    nuevoIndicador.cantidadIndicadores++;
                    if(indicador.validado){
                        nuevoIndicador.cantidadValidados++;
                    }
                    if(indicador.aprobado){
                        nuevoIndicador.cantidadAprobados++;
                    }
                    nuevoIndicador.indicadores.push({
                        _id:indicador._id,
                        porcentajeCarga:indicador.nivelCompletitud,
                        validado:indicador.validado,
                        aprobado:indicador.aprobado
                    });
                }
                else
                {
                    var antiguoPorcentajeCompletado=0;
                    for (var i=0; i<nuevoIndicador.indicadores.length; i++)
                    {
                        if(nuevoIndicador.indicadores[i]._id==indicador._id)
                        {
                            antiguoPorcentajeCompletado=nuevoIndicador.indicadores[i].porcentajeCarga;
                            
                            nuevoIndicador.indicadores[i].porcentajeCarga=indicador.nivelCompletitud;
                            break;
                        }
                    }
                    //La cantidad de indicadores se mantiene igual, ya que al no ser nuevo ya estaba contado
                    
                    //Resto el antiguo porcentaje que tenia y le sumo el actual. Al mostrar hago un promedio.
                    nuevoIndicador.sumatoriaPorcentajeCompletado-=antiguoPorcentajeCompletado;
                    nuevoIndicador.sumatoriaPorcentajeCompletado+=indicador.nivelCompletitud;
                    
                    //Reviso si esta o no validado y lo "anoto"
                    
                    if(nuevoIndicador.indicadores[i].validado){
                        nuevoIndicador.cantidadValidados--;
                    }
                    if(indicador.validado){
                        nuevoIndicador.cantidadValidados++;
                    }
                    
                    //Reviso si esta o no aprobado y lo "anoto"
                    if(nuevoIndicador.indicadores[i].aprobado){
                        nuevoIndicador.cantidadAprobados--;
                    }
                    if(indicador.aprobado){
                        nuevoIndicador.cantidadAprobados++;
                    }
                    
                    antiguoPorcentajeCompletado=null;
                }
            }
            else
            {
                nuevoIndicador=new SEMGTablaGeneralJurisIndicadores({
                    
                    jurisdiccion:indicador.dependencia,
                    sumatoriaPorcentajeCompletado:indicador.nivelCompletitud,
                    cantidadIndicadores:1,
                    indicadores:[{
                        _id:indicador._id,
                        porcentajeCarga:indicador.nivelCompletitud,
                        validado:indicador.validado,
                        aprobado:indicador.aprobado
                    }],
                    cantidadValidados:(indicador.validado?1:0),
                    cantidadAprobados:(indicador.aprobado?1:0)
                });
            }
            
            nuevoIndicador.$save();
            
            nuevoIndicador=null;
            
            funcionCallback();
        });
    }
})
.controller('IndicadorSEMGDetalleCtrl', function($scope,SEMGMatrizMonitoreo,SEMGTablaGeneralJurisIndicadores,$location,Jurisdicciones,API,SEMGIndicador,SEMGMetrica,Contactos,ORMOrganigrama,User,$modal,$routeParams,SEMGCompromisos,SEMGTemas) {
    //NUEVO
    //SEMGTablaGeneralJurisIndicadores Es una coleccion en la que va a guardar todos los cambios de indicadores acomodado por jurisdicciones
    
//Editado para guardar en la tabla nueva para poder descargar como CSV
//Hecho por Alexander Armua el 18/05/2016
    $scope.guardar = function(){
        $scope.indicador.nivelCompletitud = comprobarCompletitud();
        
        if (!$scope.hasPermission('semg.editar')) {
            if (!$scope.indicador.modifica) {
                $scope.indicador.modifica = [];
            }
            $scope.indicador.modifica.push({usuario: $scope.username, fecha: new Date()});
            if ($scope.indicador.modifica.length > 5) {
                $scope.indicador.modifica.shift();
            }
        }
        
        $scope.indicador.$save({}, function() {
            //Actualizo el Matriz Monitoreo
            var matrizMonitoreo=SEMGMatrizMonitoreo.get({_id:$scope.indicador.matrizDependencia},function(){
                matrizMonitoreo.semaforizacion.rango1=$scope.indicador.semaforizacion.rango1;
                matrizMonitoreo.semaforizacion.rango2=$scope.indicador.semaforizacion.rango2;
                matrizMonitoreo.semaforizacion.rango3=$scope.indicador.semaforizacion.rango3;
                matrizMonitoreo.sentido=$scope.indicador.sentido;
                matrizMonitoreo.$save();
            });
            console.log($scope.indicador); 
            /*Aca hay que tomar $scope.indicador.dependencia y enlazarlo con la coleccion nueva, para asignarle el id de este indicador
            y asi poder armar la coleccion.*/
            guardarTablaJurisIndicadores($scope.indicador,false);
            alert("Indicador guardado con exito.");
        });
        $scope.variable=true;
    };
    
    $scope.eliminar = function(confirmado) {
        if (confirmado) {
            $scope.indicador.$delete(function() {
                eliminarTablaJurisIndicadores($scope.indicador,function(){
                    eliminarMatrizIndicador($scope.indicador.matrizDependencia);
                    //$location.url('/semg/indicadores/' + $scope.anio);
                });
            });
        }
        else {
            $("#confirmarEliminar").modal('show');
        }
    };
    
    function eliminarMatrizIndicador(idMatriz){
        if(idMatriz){
            var matrizAEliminar=SEMGMatrizMonitoreo.get({_id:idMatriz},function(){
                if(matrizAEliminar){
                    matrizAEliminar.eliminado=true;
                    matrizAEliminar.$save(function(){
                        window.history.back(); // Retrocede a la pagina anterior
                    });
                }
            });
        }else{
            window.history.back(); // Retrocede a la pagina anterior
        }
        
    }
    
    function guardarTablaJurisIndicadores(indicador, esNuevo){
        var nuevoIndicador=SEMGTablaGeneralJurisIndicadores.query({"jurisdiccion":indicador.dependencia},function(){
            if(nuevoIndicador.length>0)
            {
                nuevoIndicador=nuevoIndicador[0];
                if(esNuevo)
                {
                    nuevoIndicador.sumatoriaPorcentajeCompletado+=indicador.nivelCompletitud;
                    nuevoIndicador.cantidadIndicadores++;
                    if(indicador.validado){
                        nuevoIndicador.cantidadValidados++;
                    }
                    if(indicador.aprobado){
                        nuevoIndicador.cantidadAprobados++;
                    }
                    nuevoIndicador.indicadores.push({
                        _id:indicador._id,
                        porcentajeCarga:indicador.nivelCompletitud,
                        validado:indicador.validado,
                        aprobado:indicador.aprobado
                    });
                }
                else
                {
                    var antiguoPorcentajeCompletado=0;
                    for (var i=0; i<nuevoIndicador.indicadores.length; i++)
                    {
                        if(nuevoIndicador.indicadores[i]._id==indicador._id)
                        {
                            antiguoPorcentajeCompletado=nuevoIndicador.indicadores[i].porcentajeCarga;
                            
                            nuevoIndicador.indicadores[i].porcentajeCarga=indicador.nivelCompletitud;
                            break;
                        }
                    }
                    //La cantidad de indicadores se mantiene igual, ya que al no ser nuevo ya estaba contado
                    
                    //Resto el antiguo porcentaje que tenia y le sumo el actual. Al mostrar hago un promedio.
                    nuevoIndicador.sumatoriaPorcentajeCompletado-=antiguoPorcentajeCompletado;
                    nuevoIndicador.sumatoriaPorcentajeCompletado+=indicador.nivelCompletitud;
                    
                    //Reviso si esta o no validado y lo "anoto"
                    
                    if(nuevoIndicador.indicadores[i].validado){
                        nuevoIndicador.cantidadValidados--;
                        nuevoIndicador.indicadores[i].validado=false;
                    }
                    if(indicador.validado){
                        nuevoIndicador.cantidadValidados++;
                        nuevoIndicador.indicadores[i].validado=true;
                    }
                    
                    //Reviso si esta o no aprobado y lo "anoto"
                    if(nuevoIndicador.indicadores[i].aprobado){
                        nuevoIndicador.cantidadAprobados--;
                        nuevoIndicador.indicadores[i].aprobado=false;
                    }
                    if(indicador.aprobado){
                        nuevoIndicador.cantidadAprobados++;
                        nuevoIndicador.indicadores[i].aprobado=true;
                    }
                    
                    antiguoPorcentajeCompletado=null;
                }
            }
            else
            {
                nuevoIndicador=new SEMGTablaGeneralJurisIndicadores({
                    
                    jurisdiccion:indicador.dependencia,
                    sumatoriaPorcentajeCompletado:indicador.nivelCompletitud,
                    cantidadIndicadores:1,
                    indicadores:[{
                        _id:indicador._id,
                        porcentajeCarga:indicador.nivelCompletitud,
                        validado:indicador.validado,
                        aprobado:indicador.aprobado
                    }],
                    cantidadValidados:(indicador.validado?1:0),
                    cantidadAprobados:(indicador.aprobado?1:0)
                });
            }
            nuevoIndicador.$save();
            nuevoIndicador=null;
        });
    }
    
    function eliminarTablaJurisIndicadores(indicador,callback){
        var indicadorABorrar=SEMGTablaGeneralJurisIndicadores.query({"jurisdiccion":indicador.dependencia},function(){
            indicadorABorrar=indicadorABorrar[0];
            for(var i=0; i<indicadorABorrar.indicadores.length; i++)
            {
                if(indicadorABorrar.indicadores[i]._id==indicador._id)
                {
                    indicadorABorrar.cantidadIndicadores--;
                    if(indicadorABorrar.indicadores[i].validado)
                    {
                        indicadorABorrar.cantidadValidados--;
                    }
                    if(indicadorABorrar.indicadores[i].aprobado)
                    {
                        indicadorABorrar.cantidadAprobados--;
                    }
                    indicadorABorrar.sumatoriaPorcentajeCompletado-=indicadorABorrar.indicadores[i].porcentajeCarga;
                    indicadorABorrar.indicadores.splice(i,1);
                    break;
                }
            }
            
            indicadorABorrar.$save(function(){
                callback();
            });
        });
    }
//FIN de edicion para guardar la tabla y poder descargar como CSV

    //Comprueba el nivel de carga y chequea los campos requeridos
    var comprobarCompletitud = function(){
        var nivelCarga = 0;
        var ind = $scope.indicador;
        
        ind.objetivoImpacto && ind.objetivoImpacto.length ? nivelCarga = nivelCarga + 1 : '';
        ind.objetivoMinisterial && ind.objetivoMinisterial.length ? nivelCarga = nivelCarga + 1 : '';
        ind.indicadorImpacto && ind.indicadorImpacto.length ? nivelCarga = nivelCarga + 1 : '';
        ind.descripcionImpacto && ind.descripcionImpacto.length ? nivelCarga = nivelCarga + 1 : '';
        ind.metrica && ind.metrica.length ? nivelCarga = nivelCarga + 1 : '';
        ind.metodoCalculo && ind.metodoCalculo.length ? nivelCarga = nivelCarga + 1 : '';
        ind.sentido && ind.sentido.length ? nivelCarga = nivelCarga + 1 : '';
        ind.frecuencia && ind.frecuencia.length ? nivelCarga = nivelCarga + 1 : '';
        ind.peso && ind.peso > 0 ? nivelCarga = nivelCarga + 1 : '';
        ind.metaAnio && ind.metaAnio > 0 ? nivelCarga = nivelCarga + 1 : '';
        ind.semaforizacion && ind.semaforizacion.rango1 && ind.semaforizacion.rango1 > 0 ? nivelCarga = nivelCarga + 1 : '';
        ind.semaforizacion && ind.semaforizacion.rango2 && ind.semaforizacion.rango2 > 0 ? nivelCarga = nivelCarga + 1 : '';
        ind.justificacionMeta && ind.justificacionMeta.length ? nivelCarga = nivelCarga + 1 : '';
        ind.fuente && ind.fuente.length ? nivelCarga = nivelCarga + 1 : '';
        ind.referenteFuente && ind.referenteFuente.length ? nivelCarga = nivelCarga + 1 : '';
        ind.recoleccionDatos && ind.recoleccionDatos.length ? nivelCarga = nivelCarga + 1 : '';
        ind.ejes && ind.ejes.length ? nivelCarga = nivelCarga + 1 : '';
        ind.compromiso && ind.compromiso.length ? nivelCarga = nivelCarga + 1 : '';
        ind.temas && ind.temas.length ? nivelCarga = nivelCarga + 1 : '';
        
        nivelCarga < 19 ? $scope.requeridos = false : $scope.requeridos = true;
        return nivelCarga / 19 * 100;
    };
    
    $scope.agregarProyecto = function(idProyecto){
        if (!$scope.indicador.proyectos || !$scope.indicador.proyectos != []) {
            $scope.indicador.proyectos = [];
        }
        $scope.indicador.proyectos.push(idProyecto);
        $scope.proyectos = "";
    };
    
    $scope.filtroProyectos = function(proyecto){
        return $scope.indicador && $scope.indicador.proyectos && $scope.indicador.proyectos.indexOf(proyecto._id) == -1;
    };
    
    //Traigo todos los obj operativos segun el ministerial seleccionado
	$scope.$watch('indicador.objetivoMinisterial', function(d) {
	    API.poa.listarObjsOperativosPorObMinisterial($scope.indicador.objetivoMinisterial)
            .then(function(objOper) {
                $scope.operativosPOA =  objOper;
                
                $scope.operativoPOAPorId = function (id) {
                    for(var i = 0; i < $scope.operativosPOA.length; i++){
                        if ($scope.operativosPOA[i]._id == id){
                            return $scope.operativosPOA[i];
                        }
                    }
                };
                $scope.todosLosProyectos = [];
                for(var i=0;i < $scope.operativosPOA.length;i++){
                    API.poa.listarProyectosPorObOperativo($scope.operativosPOA[i]._id)
                        .then(function(proy) {
                            proy.forEach(function(p){
                                $scope.todosLosProyectos.push(p);
                            })
                
                            $scope.proyectoPOAPorId = function (id) {
                                for(var i = 0; i < $scope.todosLosProyectos.length; i++){
                                    if ($scope.todosLosProyectos[i]._id == id){
                                        return $scope.todosLosProyectos[i];
                                    }
                                }
                            };
                    });
                }
        });
	});
	
	$scope.compromisos = SEMGCompromisos.query();
	$scope.temas = SEMGTemas.query();
	
	$scope.compromisoPorId = function(idCompromiso) {
        for (var i = 0; i < $scope.compromisos.length; i++) {
            if ($scope.compromisos[i]._id == idCompromiso){
                return $scope.compromisos[i]._id;
            }
        }
    };
    
    //
    $scope.soloNumeros = function(cadenaAnalizar) {
        var nuevoString = "";
        for (var i = 0; i< cadenaAnalizar.length; i++) {
             var caracter = cadenaAnalizar.charAt(i);
             if( caracter == "0" || caracter == "1" || caracter == "2" || caracter == "3" || caracter == "4" || caracter == "5" || caracter == "6" || caracter == "7" || caracter == "8" || caracter == "9") {
                nuevoString = nuevoString + caracter;
              }
             if( caracter == ",") {
                nuevoString = nuevoString + ".";
              }
        }
        return nuevoString;
    };
    
    $scope.cierraNav= function() {
        alert("Ud esta abandonando este sitio, su sesion se finalizara");
    };
    
    $scope.user = User.findByName({
        username: $scope.username
    });
    
    if ($scope.hasPermission('semg.editar')) {
        $scope.permisoPestana = true;
    } else {
        $scope.permisoPestana = false;
    }
    
    $scope.modificar = function() {
        $scope.editando = true;
    };
    
    $scope.tienePermiso = function(pestana) {
        if ($scope.hasPermission('semg.editar')) {
            $scope.permisoPestana = true;
        } else if ($scope.hasPermission('semg.editarJurisdiccion')) {
            if (pestana == 'resultados') {
                $scope.permisoPestana = true;
            } else {
                $scope.permisoPestana = false;
                $scope.editando = false;
            }
        } else {
            $scope.permisoPestana = false;
        }
    };
    
    $scope.indicador = SEMGIndicador.get({
        _id : $routeParams._id
    }, function() {
        //El formulario se muestra de entrada como editando segun los permisos del usuario
        // if ($scope.indicador.validado && !$scope.hasPermission('semg.editar')) {
        //     $scope.editando = false;
        // } else {
        //     $scope.editando = true;
        // }
        /*$scope.data = [{
            values: [{label : "Unidad "+($scope.anio-4), series : 0, value : parseFloat($scope.soloNumeros($scope.indicador.unidad4))},
                    {label : "Unidad "+($scope.anio-3), series : 0, value : parseFloat($scope.soloNumeros($scope.indicador.unidad3))},
                    {label : "Unidad "+($scope.anio-2), series : 0, value : parseFloat($scope.soloNumeros($scope.indicador.unidad2))},
                    {label : "Unidad "+($scope.anio-1), series : 0, value : parseFloat($scope.soloNumeros($scope.indicador.unidad1))},
                    {label : "Meta "+($scope.anio), series : 0, value : parseFloat($scope.soloNumeros($scope.indicador.metaAnio))}],
            key: "Indicadores",
            nombre: ""
        }];*/
        
        var indicadores = SEMGIndicador.query({dependencia: $scope.indicador.dependencia,objetivoMinisterial: $scope.indicador.objetivoMinisterial},function(){
            var pesoTotal = 0;
            for(var i = 0;i < indicadores.length;i++){
                if(indicadores[i]._id !== $scope.indicador._id){
                    if(indicadores[i].peso){
                        pesoTotal = pesoTotal + indicadores[i].peso
                    }
                }
            }
            $scope.pesoTotal = 100 - (pesoTotal);
        });
    });
    
    
	$scope.jurisdiccionesPOA = Jurisdicciones.query({}, function() {
	    $scope.$watch('indicador.dependencia', function(d) {
    	    API.poa.listarObjsImpactoPorJurisdiccion($scope.jurisdiccionPOAPorId($scope.indicador.dependencia))
                .then(function(objImpactos) {
                   $scope.impactosPOA =  objImpactos;
        
                    $scope.impactoPOAPorId = function (id) {
                      for (var i = 0; i < $scope.impactosPOA.length; i++) {
                          if ($scope.impactosPOA[i]._id == id)
                          {
                              return $scope.impactosPOA[i];
                          }
                      }  
                    };
            });
    	}); 
	});
	   
	$scope.$watch('indicador.objetivoImpacto', function(d) {
	    API.poa.listarObjsMinisterialesPorObImpacto($scope.indicador.objetivoImpacto)
            .then(function(objMinis) {
               $scope.ministerialesPOA =  objMinis;
    
                $scope.ministerialPOAPorId = function (id) {
                  for (var i = 0; i < $scope.ministerialesPOA.length; i++) {
                      if ($scope.ministerialesPOA[i]._id == id)
                      {
                          return $scope.ministerialesPOA[i];
                      }
                  }  
                };
        });
	});
	
	
	
	//Traigo todos proyectos segun el obj operativo seleccionado
	/*$scope.$watch('indicador.objetivoOperativo', function(d) {
	    API.poa.listarProyectosPorObOperativo($scope.indicador.objetivoOperativo)
            .then(function(proy) {
               $scope.proyectosPOA =  proy;
    
                $scope.proyectoPOAPorId = function (id) {
                    for(var i = 0; i < $scope.proyectosPOA.length; i++){
                        if ($scope.proyectosPOA[i]._id == id){
                            return $scope.proyectosPOA[i];
                        }
                    }
                };
        });
	});*/
	
    $scope.jurisdiccionPOAPorId = function (id) {
      for (var i = 0; i < $scope.jurisdiccionesPOA.length; i++) {
          if ($scope.jurisdiccionesPOA[i].idOrmOrganigrama == id)
          {
              return $scope.jurisdiccionesPOA[i]._id;
          }
      }  
    };
    
    $scope.anio = $routeParams.anio;
	$scope.contactos = Contactos.listar();
	$scope.organigrama = ORMOrganigrama.query();
	$scope.metricas = [];
	var metricasTodas = SEMGMetrica.query({anio : $routeParams.anio}, function() {
        angular.forEach(metricasTodas, function(b) {
            $scope.metricas.push(b.nombre);
        });
	});
	$scope.impactos = [];
	var impactosTodas = SEMGIndicador.query({anio : $routeParams.anio}, function() {
        angular.forEach(impactosTodas, function(b) {
            if ($scope.impactos.indexOf(b.objetivoImpacto) == -1) {
                $scope.impactos.push(b.objetivoImpacto);
            }
        });
	});
    
    $scope.mostrarTema = function (r) {
        if (r.eliminado) {
            return false; 
        } else {
            return true;
        }
    };
	$scope.ministeriales = [];
	var ministerialesTodas = SEMGIndicador.query({anio : $routeParams.anio}, function() {
        angular.forEach(ministerialesTodas, function(b) {
            if ($scope.ministeriales.indexOf(b.objetivoMinisterial) == -1) {
                $scope.ministeriales.push(b.objetivoMinisterial);
            }
        });
	});
    $scope.tab = "datos";
    
    $scope.impactoPorId = function (id) {
      for (var i = 0; i < $scope.impactos.length; i++) {
          if ($scope.impactos[i]._id == id)
          {
              return $scope.impactos[i];
          }
      }  
    };
    
    $scope.ministerialPorId = function (id) {
      for (var i = 0; i < $scope.ministeriales.length; i++) {
          if ($scope.ministeriales[i]._id == id)
          {
              return $scope.ministeriales[i];
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
    
    $scope.contactoPorId = function (id) {
      for (var i = 0; i < $scope.contactos.length; i++) {
          if ($scope.contactos[i]._id == id)
          {
              return $scope.contactos[i];
          }
      }  
    };
    
    $scope.metricaPorId = function (id) {
      for (var i = 0; i < $scope.metricas.length; i++) {
          if ($scope.metricas[i]._id == id)
          {
              return $scope.metricas[i];
          }
      }  
    };
    
    $scope.organigramaPorId = function (id) {
      for (var i = 0; i < $scope.organigrama.length; i++) {
          if ($scope.organigrama[i]._id == id)
          {
              return $scope.organigrama[i];
          }
      }  
    };
    
    $scope.diferenciaUnidades = function (unidad1, unidad2) {
        if (unidad1 && unidad2) {
            if (((unidad1*2) < unidad2) || ((unidad1/2) > unidad2)) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    };
    
    $scope.campoVacio = function (campo) {
        if (!campo) {
            return true;
        } else {
            return false;
        }
    };
    
    //Agregar temas
    $scope.agregarTema = function(dataTema) {
        if (!$scope.indicador.temas) {
            $scope.indicador.temas = [];
        }
        $scope.indicador.temas.push(dataTema);
        $scope.dataTema = "";
    };
    
    $scope.eliminarListaElem = function(elemento, lista) {
        lista.splice(lista.indexOf(elemento), 1);
    };
    
    $scope.reverse = function(array) {
        var copy = [].concat(array);
        return copy.reverse();
    };
    
    $scope.dameFrecuencia = function (frecuencia) {
        if (frecuencia == "7") {
            return "Semanal";
        } else if (frecuencia == "30") {
            return "Mensual";
        } else if (frecuencia == "90") {
            return "Trimestral";
        } else if (frecuencia == "180") {
            return "Semestral";
        } else if (frecuencia == "365") {
            return "Anual";
        } else if (frecuencia == "0") {
            return "Eventual";
        }
    };
    
    $scope.agregarComen = function(confirmado, data) {
        if(confirmado){
            data.usuario = $scope.user;
            $scope.indicador.comentarios.push(data);
        }else{
            if(!$scope.indicador.comentarios){
                $scope.indicador.comentarios = [];
            }
            var modalScope = $scope.$new();
            modalScope.data = {
                descripcion: '',
                campo: '',
                cuando:undefined
            };
            $modal({template: '/views/semg/indicadores/agregarComentario.html', persist: true, show: true, backdrop: 'static', scope: modalScope});
        }
    };
    
    $scope.agregarJustificacion = function(data) {
        if (!$scope.indicador.justificacionMeta) {
            $scope.indicador.justificacionMeta = [];
        }
        $scope.indicador.justificacionMeta.push(data);
    };
    
    $scope.agregarMetrica = function(confirmado, data) {
        if (confirmado) {
            $scope.metricaNueva.nombre = data.nombre;
            $scope.metricaNueva.$save();
	        $scope.metricas = SEMGMetrica.query();
        }
        else {
            $scope.metricaNueva = new SEMGMetrica();
            var modalScope = $scope.$new();
            
            modalScope.data = {
                nombre: ''
            };
            $modal({template: '/views/semg/indicadores/agregarMetrica.html', persist: true, show: true, backdrop: 'static', scope: modalScope});
        }
    };
    
    $scope.eliminarElemento = function(array,elemento) {
        var indice = array.indexOf(elemento);
        if(indice!=-1) array.splice(indice, 1);
    };
    
    $scope.options = {
        chart: {
            type: 'discreteBarChart',
            height: 200,
            width: 1000,
            margin : {
                top: 20,
                right: 20,
                bottom: 40,
                left: 110
            },
            noData: 'Sin datos',
            x: function(d){return d.label;},
            y: function(d){return d.value;},
            showValues: true,
            valueFormat: function(d){
                return d;
            },
            transitionDuration: 500,
            xAxis: {
            },
            yAxis: {
                tickFormat: function (v) {
                    return v;
                },
                max: 100,
                axisLabelDistance: 30
            }
        }
    };
})
.controller('IndicadorSEMGMonitoreoCtrl', function($scope, $location, $http, SEMGIndicador, ORMOrganigrama, SEMGMonitoreo, User, $modal, $routeParams, Jurisdicciones) {
    $scope.indicadores = SEMGIndicador.query({anio : $routeParams.anio});
	$scope.ministeriales = [];
    $scope.anio = $routeParams.anio;
	if ($routeParams._id != 0) {
    	$scope.indicadores = SEMGIndicador.query({
            dependencia : $routeParams._id,
            anio : $routeParams.anio
        }, function() {
            angular.forEach($scope.indicadores, function(b) {
                if ($scope.ministeriales.indexOf(b.objetivoMinisterial) == -1) {
                    $scope.ministeriales.push(b.objetivoMinisterial);
                }
            });
        });
    	$scope.monitoreo = SEMGMonitoreo.query({dependencia : $routeParams._id, anio : $routeParams.anio}, function() {
            if (!$scope.monitoreo.length) {
                $scope.monitoreo = new SEMGMonitoreo({
                    dependencia : $routeParams._id,
                    objetivos : [],
                    medidaAccion : [],
                    anio : parseInt($routeParams.anio)
                });
            } else {
                $scope.monitoreo = $scope.monitoreo[0];
            }
    	});
	} else {
	    if (!$scope.hasPermission('semg.editar')) {
            $scope.user = User.findByName({
                username: $scope.username
            }, function() {
                if ($scope.user.jurisdiccion) {
                	$scope.indicadores = SEMGIndicador.query({
                        dependencia : $scope.user.jurisdiccion,
                        anio : $routeParams.anio
                    }, function() {
                        angular.forEach($scope.indicadores, function(b) {
                            if ($scope.ministeriales.indexOf(b.objetivoMinisterial) == -1) {
                                $scope.ministeriales.push(b.objetivoMinisterial);
                            }
                        });
                    });
                	$scope.monitoreo = SEMGMonitoreo.query({dependencia : $scope.user.jurisdiccion, anio : $routeParams.anio}, function() {
                        if (!$scope.monitoreo.length) {
                            $scope.monitoreo = new SEMGMonitoreo({
                                dependencia : $scope.user.jurisdiccion,
                                objetivos : [],
                                medidaAccion : [],
                                anio : parseInt($routeParams.anio)
                            });
                        } else {
                            $scope.monitoreo = $scope.monitoreo[0];
                        }
                	});
                }
            });
	    }
	}
	
    $scope.eligeJuris = function(jurisdiccion) {
    	$scope.indicadores = SEMGIndicador.query({
            dependencia : jurisdiccion,
            anio : $routeParams.anio
        }, function() {
            angular.forEach($scope.indicadores, function(b) {
                if ($scope.ministeriales.indexOf(b.objetivoMinisterial) == -1) {
                    $scope.ministeriales.push(b.objetivoMinisterial);
                }
            });
        });
    	$scope.monitoreo = SEMGMonitoreo.query({dependencia : jurisdiccion, anio : $routeParams.anio}, function() {
            if (!$scope.monitoreo.length) {
                $scope.monitoreo = new SEMGMonitoreo({
                    dependencia : jurisdiccion,
                    objetivos : [],
                    medidaAccion : [],
                    anio : parseInt($routeParams.anio)
                });
            } else {
                $scope.monitoreo = $scope.monitoreo[0];
            }
    	});
    };
    
	$scope.nivelDeCarga = function (id) {
        var total = 0;
        var totalLength = 0;
        angular.forEach($scope.indicadores, function(c) {
            if (c.dependencia == id) {
                totalLength = totalLength + 1;
                if (c.avance6meses) {
                    total = total + 1;
                }
            }
        });
        if ((total < totalLength) || (totalLength == 0)) {
            return 0;
        } else {
            return 100;
        }
    };
    
    $scope.monitoreos = SEMGMonitoreo.query({anio : $routeParams.anio});
    
    $scope.monitoreoAprobacionPorJuris = function (id) {
      for (var i = 0; i < $scope.monitoreos.length; i++) {
          if ($scope.monitoreos[i].dependencia == id)
          {
              if ($scope.monitoreos[i].aprobado) {
                  return true;
              } else {
                  return false;
              }
          }
      }
      return false;
    };
    
    $scope.monitoreoPorJuris = function (id) {
      for (var i = 0; i < $scope.monitoreos.length; i++) {
          if ($scope.monitoreos[i].dependencia == id)
          {
              return $scope.monitoreos[i];
          }
      }
      return false;
    };
    
    $scope.modalInforme = function(confirmado, id) {
        if (confirmado) {
            if ($scope.uploaded.length) {
                $scope.monitoreoSeleccionado.informeId = $scope.uploaded.pop().id;
                $scope.monitoreoSeleccionado.$save({}, function() {
                    $scope.uploaded = [];
                });
            }
        }
        else {
            $scope.monitoreoSeleccionado = $scope.monitoreoPorJuris(id);
            $scope.uploaded = [];
            if ($scope.monitoreoSeleccionado) {
                $modal({template: '/views/semg/cartascompromisos/modalInforme.html', persist: true, show: true, backdrop: 'static', scope: $scope});
            } else {
                alert("No se registra monitoreo cargado");
            }
        }
    };
	
	$scope.data = {
        objetivo : '',
        presupuesto : {valor:'', comentario:'', importancia:'', intensidad:0},
        infraestructura : {valor:'', comentario:'', importancia:'', intensidad:0},
        personal : {valor:'', comentario:'', importancia:'', intensidad:0},
        accesoInfo : {valor:'', comentario:'', importancia:'', intensidad:0},
        coordinacionEquipo : {valor:'', comentario:'', importancia:'', intensidad:0},
        dificultades : {valor:'', comentario:'', importancia:'', intensidad:0},
        coordinacionVertical : {valor:'', comentario:'', importancia:'', intensidad:0},
        coordinacionHorizontal : {valor:'', comentario:'', importancia:'', intensidad:0},
        coordinacionActores : {valor:'', comentario:'', importancia:'', intensidad:0},
        otros : {valor:'', comentario:'', importancia:'', intensidad:0}
    };
	
	$scope.dataAccion = {
        objetivo:'',
        texto:''
	};
	
    $scope.orden = ['objetivoImpacto','objetivoMinisterial','indicadorImpacto'];
    
    $scope.soloNumeros = function(cadenaAnalizar) {
        if (cadenaAnalizar) {
            var nuevoString = "";
            for (var i = 0; i< cadenaAnalizar.length; i++) {
                 var caracter = cadenaAnalizar.charAt(i);
                 if( caracter == "0" || caracter == "1" || caracter == "2" || caracter == "3" || caracter == "4" || caracter == "5" || caracter == "6" || caracter == "7" || caracter == "8" || caracter == "9") {
                    nuevoString = nuevoString + caracter;
                  }
                 if( caracter == ",") {
                    nuevoString = nuevoString + ".";
                  }
            }
            return nuevoString;
        } else {
            return "";
        }
    };
    
    $scope.porcentaje = function(meta, carga) {
        return Math.round((100/$scope.soloNumeros(meta))*$scope.soloNumeros(carga));
    };
    
    $scope.porcentaje2 = function(meta, carga) {
        if ($scope.soloNumeros(carga)<$scope.soloNumeros(meta)) {
            return (200-Math.round(100/$scope.soloNumeros(meta)*$scope.soloNumeros(carga)));
        } else {
            return (100-Math.round(100/$scope.soloNumeros(meta)*($scope.soloNumeros(carga)-$scope.soloNumeros(meta))));
        }
    };
    
	$scope.organigrama = ORMOrganigrama.query();
    
    $scope.organigramaPorId = function (id) {
      for (var i = 0; i < $scope.organigrama.length; i++) {
          if ($scope.organigrama[i]._id == id)
          {
              return $scope.organigrama[i];
          }
      }  
    };
    
    $scope.verFact = function(elemento) {
        $scope.elemento = elemento;
        $("#verFactores").modal('show');
    };
    
    $scope.agregarData = function(data, array) {
        array.push(data);
        $scope.data = {
            objetivo : '',
            presupuesto : {valor:'', comentario:'', importancia:'', intensidad:0},
            infraestructura : {valor:'', comentario:'', importancia:'', intensidad:0},
            personal : {valor:'', comentario:'', importancia:'', intensidad:0},
            accesoInfo : {valor:'', comentario:'', importancia:'', intensidad:0},
            coordinacionEquipo : {valor:'', comentario:'', importancia:'', intensidad:0},
            dificultades : {valor:'', comentario:'', importancia:'', intensidad:0},
            coordinacionVertical : {valor:'', comentario:'', importancia:'', intensidad:0},
            coordinacionHorizontal : {valor:'', comentario:'', importancia:'', intensidad:0},
            coordinacionActores : {valor:'', comentario:'', importancia:'', intensidad:0},
            otros : {valor:'', comentario:'', importancia:'', intensidad:0}
        };
        $scope.elemento = array[array.length - 1];
        $("#verFactores").modal('show');
    };
    
    $scope.eliminarListaElem = function(elemento, lista) {
        if (confirm("Esta seguro de borrar este elemento?")) {
            lista.splice(lista.indexOf(elemento), 1);
        }
    };
    
    $scope.importancia = function (objetivo, valor) {
        var uno = true;
        var dos = true;
        var tres = true;
        if ((objetivo.presupuesto.importancia == '1') || (objetivo.accesoInfo.importancia == '1') || (objetivo.infraestructura.importancia == '1') || (objetivo.personal.importancia == '1') || (objetivo.coordinacionEquipo.importancia == '1') || (objetivo.dificultades.importancia == '1') || (objetivo.coordinacionVertical.importancia == '1') || (objetivo.coordinacionHorizontal.importancia == '1') || (objetivo.coordinacionActores.importancia == '1') || (objetivo.otros.importancia == '1')) {
            uno = false;
        }
        if ((objetivo.presupuesto.importancia == '2') || (objetivo.accesoInfo.importancia == '2') || (objetivo.infraestructura.importancia == '2') || (objetivo.personal.importancia == '2') || (objetivo.coordinacionEquipo.importancia == '2') || (objetivo.dificultades.importancia == '2') || (objetivo.coordinacionVertical.importancia == '2') || (objetivo.coordinacionHorizontal.importancia == '2') || (objetivo.coordinacionActores.importancia == '2') || (objetivo.otros.importancia == '2')) {
            dos = false;
        }
        if ((objetivo.presupuesto.importancia == '3') || (objetivo.accesoInfo.importancia == '3') || (objetivo.infraestructura.importancia == '3') || (objetivo.personal.importancia == '3') || (objetivo.coordinacionEquipo.importancia == '3') || (objetivo.dificultades.importancia == '3') || (objetivo.coordinacionVertical.importancia == '3') || (objetivo.coordinacionHorizontal.importancia == '3') || (objetivo.coordinacionActores.importancia == '3') || (objetivo.otros.importancia == '3')) {
            tres = false;
        }
        if (valor == '1') {
            if (dos) {
                return '2';
            } else if (tres) {
                return '3';
            } else {
                return '';
            }
        }
        if (valor == '2') {
            if (tres) {
                return '3';
            } else {
                return '';
            }
        }
        if (valor == '3') {
            return '';
        }
        if (valor === '') {
            if (uno) {
                return '1';
            } else if (dos) {
                return '2';
            } else if (tres) {
                return '3';
            } else {
                return '';
            }
        }
    };
    
    $scope.variableMinisterial="";
    $scope.estiloMinisterial = "";
    $scope.compararMinisterial=function(objMinisterial)
    {
        if($scope.orden.length==3)
        {
            if(objMinisterial==$scope.variableMinisterial)
            {
                $scope.estiloMinisterial = "";
                return false;
            }
            else
            {
                $scope.variableMinisterial=objMinisterial;
                $scope.estiloMinisterial = "1px solid #aaaaaa";
                return true;
            }
        }
        else 
        {
            $scope.estiloMinisterial = "";
            return true;
        }
    };
    
    $scope.devolverRowspan=function()
    {
        return $scope.rowspan;
    };
    
    $scope.variableImpacto = "";
    $scope.estiloImpacto = "";
    $scope.compararImpacto=function(objImpacto, indice)
    {
        if (indice === 0) {
            $scope.variableImpacto = objImpacto;
            $scope.estiloImpacto = "1px solid #aaaaaa";
            return true;
        } else {
            if($scope.orden.length==3)
            {
                if(objImpacto == $scope.variableImpacto)
                {
                    $scope.estiloImpacto = "";
                    return false;
                }
                else 
                {
                    $scope.variableImpacto = objImpacto;
                    $scope.estiloImpacto = "1px solid #aaaaaa";
                    return true;
                }
            }
            else 
            {
                $scope.estiloImpacto = "";
                return true;
            }
        }
    };
    
    $scope.modificar = function() {
        $scope.editando = true;
    };
    
    $scope.guardar = function() {
        if (!$scope.hasPermission('semg.editar')) {
            if (!$scope.monitoreo.modifica) {
                $scope.monitoreo.modifica = [];
            }
            $scope.monitoreo.modifica.push({usuario: $scope.username, fecha: new Date()});
            if ($scope.monitoreo.modifica.length > 5) {
                $scope.monitoreo.modifica.shift();
            }
        }
        $scope.monitoreo.$save({}, function() {
            angular.forEach($scope.indicadores, function(b) {
                b.$save();
            });
        });
    };
})
.controller('IndicadorSEMGEvaluacionCtrl', function($scope, $location, $http, SEMGIndicador, ORMOrganigrama, SEMGEvaluacion, User, $modal, $routeParams, Jurisdicciones) {
    
	$scope.ministeriales = [];
	$scope.indicadoresNombres = [];
    $scope.anio = $routeParams.anio;
	if ($routeParams._id != 0) {
    	$scope.indicadores = SEMGIndicador.query({
            dependencia : $routeParams._id,
            anio : $routeParams.anio
        }, function() {
            angular.forEach($scope.indicadores, function(b) {
                if ($scope.ministeriales.indexOf(b.objetivoMinisterial) == -1) {
                    $scope.ministeriales.push(b.objetivoMinisterial);
                }
                $scope.indicadoresNombres.push(b.indicadorImpacto);
            });
        });
    	$scope.evaluacion = SEMGEvaluacion.query({dependencia : $routeParams._id, anio : $routeParams.anio}, function() {
            if (!$scope.evaluacion.length) {
                $scope.evaluacion = new SEMGEvaluacion({
                    dependencia : $routeParams._id,
                    objetivosDificultaron : [],
                    objetivosFacilitaron : [],
                    acciones : [],
                    medidaAccion : '',
                    anio : parseInt($routeParams.anio)
                });
            } else {
                $scope.evaluacion = $scope.evaluacion[0];
            }
    	});
	} else {
	    if (!$scope.hasPermission('semg.editar')) {
            $scope.user = User.findByName({
                username: $scope.username
            }, function() {
                if ($scope.user.jurisdiccion) {
                	$scope.indicadores = SEMGIndicador.query({
                        dependencia : $scope.user.jurisdiccion,
                        anio : $routeParams.anio
                    }, function() {
                        angular.forEach($scope.indicadores, function(b) {
                            if ($scope.ministeriales.indexOf(b.objetivoMinisterial) == -1) {
                                $scope.ministeriales.push(b.objetivoMinisterial);
                            }
                            $scope.indicadoresNombres.push(b.indicadorImpacto);
                        });
                    });
                	$scope.evaluacion = SEMGEvaluacion.query({dependencia : $scope.user.jurisdiccion, anio : $routeParams.anio}, function() {
                        if (!$scope.evaluacion.length) {
                            $scope.evaluacion = new SEMGEvaluacion({
                                dependencia : $scope.user.jurisdiccion,
                                objetivosDificultaron : [],
                                objetivosFacilitaron : [],
                                acciones : [],
                                medidaAccion : '',
                                anio : parseInt($routeParams.anio)
                            });
                        } else {
                            $scope.evaluacion = $scope.evaluacion[0];
                        }
                	});
                }
            });
	    }
	}
	
    $scope.eligeJuris = function(jurisdiccion) {
    	$scope.indicadores = SEMGIndicador.query({
            dependencia : jurisdiccion,
            anio : $routeParams.anio
        }, function() {
            angular.forEach($scope.indicadores, function(b) {
                if ($scope.ministeriales.indexOf(b.objetivoMinisterial) == -1) {
                    $scope.ministeriales.push(b.objetivoMinisterial);
                }
                $scope.indicadoresNombres.push(b.indicadorImpacto);
            });
        });
    	$scope.evaluacion = SEMGEvaluacion.query({dependencia : jurisdiccion, anio : $routeParams.anio}, function() {
            if (!$scope.evaluacion.length) {
                $scope.evaluacion = new SEMGEvaluacion({
                    dependencia : jurisdiccion,
                    objetivosDificultaron : [],
                    objetivosFacilitaron : [],
                    acciones : [],
                    medidaAccion : '',
                    anio : parseInt($routeParams.anio)
                });
            } else {
                $scope.evaluacion = $scope.evaluacion[0];
            }
    	});
    };
    
	
	$scope.data = {
        objetivo : '',
        presupuesto : {valor:'', comentario:'', importancia:'', intensidad:0},
        infraestructura : {valor:'', comentario:'', importancia:'', intensidad:0},
        personal : {valor:'', comentario:'', importancia:'', intensidad:0},
        accesoInfo : {valor:'', comentario:'', importancia:'', intensidad:0},
        coordinacionEquipo : {valor:'', comentario:'', importancia:'', intensidad:0},
        dificultades : {valor:'', comentario:'', importancia:'', intensidad:0},
        coordinacionVertical : {valor:'', comentario:'', importancia:'', intensidad:0},
        coordinacionHorizontal : {valor:'', comentario:'', importancia:'', intensidad:0},
        otros : {valor:'', comentario:'', importancia:'', intensidad:0}
    };
	
	$scope.datos = {
        objetivo : '',
        prioridad : '',
        factores : '',
        comentarios : '',
        dependencia : '',
        periodo : ''
    };
	
    $scope.orden = ['objetivoImpacto','objetivoMinisterial','indicadorImpacto'];
    
    $scope.color = function (indicador) {
        if (indicador.sentido && indicador.semaforoRojo && indicador.semaforoAmarillo && indicador.semaforoVerde && indicador.cumplimiento12meses) 
        {
            if (indicador.sentido == "Ascendente") {
                if (parseInt(indicador.cumplimiento12meses) >= parseInt(indicador.semaforoVerde)) {
                    return 'btn-success';
                } else if (parseInt(indicador.cumplimiento12meses) >= parseInt(indicador.semaforoAmarillo)) {
                    return 'btn-warning';
                } else {
                    return 'btn-danger';
                }
                
            } else {
                if (parseInt(indicador.cumplimiento12meses) >= parseInt(indicador.semaforoRojo)) {
                    return 'btn-danger';
                } else if (parseInt(indicador.cumplimiento12meses) >= parseInt(indicador.semaforoAmarillo)) {
                    return 'btn-warning';
                } else {
                    return 'btn-success';
                }
            }
        } else {
            return 'btn-danger';
        }
    };
    
    $scope.importancia = function (objetivo, valor) {
        var uno = true;
        var dos = true;
        var tres = true;
        if ((objetivo.presupuesto.importancia == '1') || (objetivo.accesoInfo.importancia == '1') || (objetivo.infraestructura.importancia == '1') || (objetivo.personal.importancia == '1') || (objetivo.coordinacionEquipo.importancia == '1') || (objetivo.dificultades.importancia == '1') || (objetivo.coordinacionVertical.importancia == '1') || (objetivo.coordinacionHorizontal.importancia == '1') || (objetivo.otros.importancia == '1')) {
            uno = false;
        }
        if ((objetivo.presupuesto.importancia == '2') || (objetivo.accesoInfo.importancia == '2') || (objetivo.infraestructura.importancia == '2') || (objetivo.personal.importancia == '2') || (objetivo.coordinacionEquipo.importancia == '2') || (objetivo.dificultades.importancia == '2') || (objetivo.coordinacionVertical.importancia == '2') || (objetivo.coordinacionHorizontal.importancia == '2') || (objetivo.otros.importancia == '2')) {
            dos = false;
        }
        if ((objetivo.presupuesto.importancia == '3') || (objetivo.accesoInfo.importancia == '3') || (objetivo.infraestructura.importancia == '3') || (objetivo.personal.importancia == '3') || (objetivo.coordinacionEquipo.importancia == '3') || (objetivo.dificultades.importancia == '3') || (objetivo.coordinacionVertical.importancia == '3') || (objetivo.coordinacionHorizontal.importancia == '3') || (objetivo.otros.importancia == '3')) {
            tres = false;
        }
        if (valor == '1') {
            if (dos) {
                return '2';
            } else if (tres) {
                return '3';
            } else {
                return '';
            }
        }
        if (valor == '2') {
            if (tres) {
                return '3';
            } else {
                return '';
            }
        }
        if (valor == '3') {
            return '';
        }
        if (valor === '') {
            if (uno) {
                return '1';
            } else if (dos) {
                return '2';
            } else if (tres) {
                return '3';
            } else {
                return '';
            }
        }
    };
    
    $scope.soloNumeros = function(cadenaAnalizar) {
        if (cadenaAnalizar) {
            var nuevoString = "";
            for (var i = 0; i< cadenaAnalizar.length; i++) {
                 var caracter = cadenaAnalizar.charAt(i);
                 if( caracter == "0" || caracter == "1" || caracter == "2" || caracter == "3" || caracter == "4" || caracter == "5" || caracter == "6" || caracter == "7" || caracter == "8" || caracter == "9") {
                    nuevoString = nuevoString + caracter;
                  }
                 if( caracter == ",") {
                    nuevoString = nuevoString + ".";
                  }
            }
            return nuevoString;
        } else {
            return "";
        }
    };
    
    $scope.porcentaje = function(meta, carga) {
        if ((meta == 0) || (meta == '0') || (carga == 0) || (carga =='0')) {
            return 0;
        } else {
            return Math.round(100/$scope.soloNumeros(meta)*$scope.soloNumeros(carga));
        }
    };
    
	$scope.organigrama = ORMOrganigrama.query();
    
    $scope.organigramaPorId = function (id) {
      for (var i = 0; i < $scope.organigrama.length; i++) {
          if ($scope.organigrama[i]._id == id)
          {
              return $scope.organigrama[i];
          }
      }  
    };
    
    $scope.modalEditar = function(elemento) {
        $scope.accion = elemento;
        $("#modalAccion").modal('show');
    };
    
    $scope.verFact = function(elemento, valor) {
        $scope.dificultaron = valor;
        $scope.elemento = elemento;
        $("#verFactores").modal('show');
    };
    
    $scope.agregarData = function(data, array, valor) {
        $scope.dificultaron = valor;
        array.push(data);
        $scope.data = {
            objetivo : '',
            presupuesto : {valor:'', comentario:'', importancia:'', intensidad:0},
            infraestructura : {valor:'', comentario:'', importancia:'', intensidad:0},
            personal : {valor:'', comentario:'', importancia:'', intensidad:0},
            accesoInfo : {valor:'', comentario:'', importancia:'', intensidad:0},
            coordinacionEquipo : {valor:'', comentario:'', importancia:'', intensidad:0},
            dificultades : {valor:'', comentario:'', importancia:'', intensidad:0},
            coordinacionVertical : {valor:'', comentario:'', importancia:'', intensidad:0},
            coordinacionHorizontal : {valor:'', comentario:'', importancia:'', intensidad:0},
            otros : {valor:'', comentario:'', importancia:'', intensidad:0}
        };
        $scope.elemento = array[array.length - 1];
        $("#verFactores").modal('show');
    };
    
    $scope.cumplidas = function() {
        var cant = 0;
        angular.forEach($scope.indicadores, function(b) {
            if ($scope.color(b)=='btn-success') {
                cant = cant + 1;
            }
        });
        return cant;
    };
    
    $scope.agregarAccion = function(datos) {
        $scope.evaluacion.acciones.push(datos);
        $scope.datos = {
            objetivo : '',
            prioridad : '',
            factores : '',
            comentarios : '',
            dependencia : '',
            periodo : ''
        };
    };
    
    $scope.eliminarListaElem = function(elemento, lista) {
        if (confirm("Esta seguro de borrar este elemento?")) {
            lista.splice(lista.indexOf(elemento), 1);
        }
    };
    
    $scope.variableMinisterial="";
    $scope.estiloMinisterial = "";
    $scope.compararMinisterial=function(objMinisterial)
    {
        if($scope.orden.length==3)
        {
            if(objMinisterial==$scope.variableMinisterial)
            {
                $scope.estiloMinisterial = "";
                return false;
            }
            else
            {
                $scope.variableMinisterial=objMinisterial;
                $scope.estiloMinisterial = "1px solid #aaaaaa";
                return true;
            }
        }
        else 
        {
            $scope.estiloMinisterial = "";
            return true;
        }
    };
    
    $scope.devolverRowspan=function()
    {
        return $scope.rowspan;
    };
    
    $scope.variableImpacto = "";
    $scope.estiloImpacto = "";
    $scope.compararImpacto=function(objImpacto, indice)
    {
        if (indice === 0) {
            $scope.variableImpacto = objImpacto;
            $scope.estiloImpacto = "1px solid #aaaaaa";
            return true;
        } else {
            if($scope.orden.length==3)
            {
                if(objImpacto == $scope.variableImpacto)
                {
                    $scope.estiloImpacto = "";
                    return false;
                }
                else 
                {
                    $scope.variableImpacto = objImpacto;
                    $scope.estiloImpacto = "1px solid #aaaaaa";
                    return true;
                }
            }
            else 
            {
                $scope.estiloImpacto = "";
                return true;
            }
        }
    };
    
    $scope.modificar = function() {
        $scope.editando = true;
    };
    
    $scope.guardar = function() {
        if (!$scope.hasPermission('semg.editar')) {
            if (!$scope.evaluacion.modifica) {
                $scope.evaluacion.modifica = [];
            }
            $scope.evaluacion.modifica.push({usuario: $scope.username, fecha: new Date()});
            if ($scope.evaluacion.modifica.length > 5) {
                $scope.evaluacion.modifica.shift();
            }
        }
        $scope.evaluacion.$save({}, function() {
            angular.forEach($scope.indicadores, function(b) {
                b.$save();
            });
        });
    };
})
.controller('IndicadorSEMGPlanDesarrolloCtrl', function($scope, $location, $http, ObjImpacto, SEMGIndicador, ORMOrganigrama, SEMGPlanDesarrollo, User, $modal, $routeParams, Jurisdicciones) {
    
    //nuevo
    
    /*
    $scope.ministeriales = [];
    $scope.anio = $routeParams.anio;
    $scope.impactos = ObjImpacto.query(function(){
       $scope.indicadores = SEMGIndicador.query({
       dependencia : $routeParams._id,
       anio : $routeParams.anio
    }, function(){
         angular.forEach($scope.indicadores, function(b){
            if (b.objetivoImpacto == $scope.impactos.id){
               //console.log($scope.impactos.nombre);
               $scope.impactos.push(b.objetivoImpacto);
            } 
         })
      });
    });
    */
    
    
	$scope.ministeriales = [];
    $scope.anio = $routeParams.anio;
	$scope.indicadores = SEMGIndicador.query({
        dependencia : $routeParams._id,
        anio : $routeParams.anio
    }, function() {
        angular.forEach($scope.indicadores, function(b) {
            if ($scope.ministeriales.indexOf(b.objetivoMinisterial) == -1) {
                $scope.ministeriales.push(b.objetivoMinisterial);
            }
        });
    });
	$scope.plan = SEMGPlanDesarrollo.query({dependencia : $routeParams._id, anio : $routeParams.anio}, function() {
        if (!$scope.plan.length) {
            $scope.plan = new SEMGPlanDesarrollo({
                dependencia : $routeParams._id,
                indicadores : [],
                anio : parseInt($routeParams.anio)
            });
        } else {
            $scope.plan = $scope.plan[0];
        }
	});
	
	$scope.data = {
        objetivo:'',
        minis:'',
        indicador:'',
        necesidades:'',
        tiempoDesarrollo:''
	};
    
	$scope.organigrama = ORMOrganigrama.query();
    
    $scope.organigramaPorId = function (id) {
      for (var i = 0; i < $scope.organigrama.length; i++) {
          if ($scope.organigrama[i]._id == id)
          {
              return $scope.organigrama[i];
          }
      }  
    };
    
    $scope.eliminarListaElem = function(elemento, lista) {
        if (confirm("Esta seguro de borrar este elemento?")) {
            lista.splice(lista.indexOf(elemento), 1);
        }
    };
    
    $scope.modificar = function() {
        $scope.editando = true;
    };
    
    $scope.guardar = function() {
        if (!$scope.hasPermission('semg.editar')) {
            if (!$scope.plan.modifica) {
                $scope.plan.modifica = [];
            }
            $scope.plan.modifica.push({usuario: $scope.username, fecha: new Date()});
            if ($scope.plan.modifica.length > 5) {
                $scope.plan.modifica.shift();
            }
        }
        $scope.plan.$save();
    };
})
.controller('IndicadorSEMGPlanSistematizacionCtrl', function($scope, $location, $http, SEMGIndicador, ORMOrganigrama, SEMGPlanSistematizacion, User, $modal, $routeParams, Jurisdicciones) {
    
	$scope.indicadoresNombres = [];
    $scope.anio = $routeParams.anio;
	$scope.indicadores = SEMGIndicador.query({
        dependencia : $routeParams._id,
        anio : $routeParams.anio
    }, function() {
        angular.forEach($scope.indicadores, function(b) {
            $scope.indicadoresNombres.push(b.indicadorImpacto);
        });
    });
	$scope.plan = SEMGPlanSistematizacion.query({dependencia : $routeParams._id, anio : $routeParams.anio}, function() {
        if (!$scope.plan.length) {
            $scope.plan = new SEMGPlanSistematizacion({
                dependencia : $routeParams._id,
                indicadores : [],
                anio : parseInt($routeParams.anio)
            });
        } else {
            $scope.plan = $scope.plan[0];
        }
	});
	
	$scope.data = {
        sistema:'',
        indicador:'',
        caracteristicas:'',
        tiempoDesarrollo:''
	};
    
	$scope.organigrama = ORMOrganigrama.query();
    
    $scope.organigramaPorId = function (id) {
      for (var i = 0; i < $scope.organigrama.length; i++) {
          if ($scope.organigrama[i]._id == id)
          {
              return $scope.organigrama[i];
          }
      }  
    };
    
    $scope.eliminarListaElem = function(elemento, lista) {
        if (confirm("Esta seguro de borrar este elemento?")) {
            lista.splice(lista.indexOf(elemento), 1);
        }
    };
    
    $scope.modificar = function() {
        $scope.editando = true;
    };
    
    $scope.guardar = function() {
        if (!$scope.hasPermission('semg.editar')) {
            if (!$scope.plan.modifica) {
                $scope.plan.modifica = [];
            }
            $scope.plan.modifica.push({usuario: $scope.username, fecha: new Date()});
            if ($scope.plan.modifica.length > 5) {
                $scope.plan.modifica.shift();
            }
        }
        $scope.plan.$save();
    };
})
.controller('PresentacionSEMGCtrl', function($scope, $location, $http, SEMGIndicador, ORMOrganigrama, SEMGMetrica, User, $modal, $routeParams, Jurisdicciones) {
    
	$scope.indicadores = SEMGIndicador.query({anio : $routeParams.anio});
	$scope.metricas = SEMGMetrica.query();
    $scope.anio = $routeParams.anio;
	$scope.organigrama = ORMOrganigrama.query();
    $scope.orden = 'numero';
    $scope.filtroAprobado = 'Todos';
    var d = new Date();
    $scope.mes = d.getMonth();
    
    $scope.cargarJurisdicciones = function () {
      for (var i = 0; i < $scope.organigrama.length; i++) {
          if ($scope.organigrama[i].ministerio === true)
          {
              var jurisdiccion = new Jurisdicciones();
              jurisdiccion.titulo = $scope.organigrama[i]._id;
              jurisdiccion.$save();
              
          }
      }  
    };
    
    $scope.dameColor = function (index) {
      var valor = index % 4;
      if (valor === 0) {
          return "#96C0BA";
      } else if (valor === 1) {
          return "#B5C9CA";
      } else if (valor === 2) {
          return "#9BD3A6";
      } else if (valor === 3) {
          return "#C9BEB5";
      }
    };
    
    $scope.cantIndicadores = function (id) {
      var cantidad = 0;
      for (var i = 0; i < $scope.indicadores.length; i++) {
          if ($scope.indicadores[i].objetivoMinisterial == id)
          {
              cantidad = cantidad + 1;
          }
      }
      return cantidad;
    };
    
    $scope.metricaPorId = function (id) {
      for (var i = 0; i < $scope.metricas.length; i++) {
          if ($scope.metricas[i]._id == id)
          {
              return $scope.metricas[i];
          }
      }  
    };
    
    $scope.organigramaPorId = function (id) {
      for (var i = 0; i < $scope.organigrama.length; i++) {
          if ($scope.organigrama[i]._id == id)
          {
              return $scope.organigrama[i];
          }
      }  
    };
})
.controller('NavBarSEMGCtrl', function($scope,$routeParams,User){
    $scope.anio = $routeParams.anio;
    
    $scope.user = User.findByName({
        username: $scope.username
    });
})
.controller('DetallePresentacionSEMGCtrl', function($scope, $location, $http, SEMGIndicador, ORMOrganigrama, SEMGMetrica, User, $modal, $routeParams, BajoAutopista, Jurisdicciones) {
    $scope.data = [{
        values: [],
        key: "Bajo Autopista"
    }];
    $scope.anio = $routeParams.anio;
    
    var series = {};
    
    $scope.options = {
        chart: {
            type: 'discreteBarChart',
            height: 200,
            margin : {
                top: 20,
                right: 20,
                bottom: 40,
                left: 55
            },
            noData: 'Sin datos',
            x: function(d){return d.label;},
            y: function(d){return d.value;},
            showValues: true,
            valueFormat: function(d){
                return d;
            },
            transitionDuration: 500,
            xAxis: {
            },
            yAxis: {
                tickFormat: function (v) {
                    return v;
                },
                max: 100,
                axisLabelDistance: 30
            }
        }
    };
    
	$scope.indicadores = SEMGIndicador.query({
        objetivoMinisterial : $routeParams._id,
        anio : $routeParams.anio
	});
	$scope.metricas = SEMGMetrica.query();
	$scope.organigrama = ORMOrganigrama.query();
    $scope.orden = 'numero';
    $scope.filtroAprobado = 'Todos';
    var d = new Date();
    $scope.mes = d.getMonth();
    
    $scope.idObjetivoMinisterial = $routeParams._id;
    
    $scope.ministerialPorId = function (id) {
      for (var i = 0; i < $scope.ministeriales.length; i++) {
          if ($scope.ministeriales[i]._id == id)
          {
              return $scope.ministeriales[i];
          }
      }  
    };
    
    $scope.organigramaPorId = function (id) {
      for (var i = 0; i < $scope.organigrama.length; i++) {
          if ($scope.organigrama[i]._id == id)
          {
              return $scope.organigrama[i];
          }
      }  
    };
})
.controller('IndicadorSEMGImprimirMatrizCtrl', function($scope, $location, $http, $routeParams,ORMOrganigrama,SEMGIndicador, $window){
    $scope.orden = ['objetivoImpacto','objetivoMinisterial','indicadorImpacto'];
    $scope.detalleOrganigrama = ORMOrganigrama.get({_id : $routeParams._id});
    
    if($routeParams._id==="1")
    {
        $scope.indicadores = SEMGIndicador.query({anio : $routeParams.anio});
    }
    else
    {
        $scope.indicadores = SEMGIndicador.query({dependencia : $routeParams._id, anio : $routeParams.anio});
    }
//*************************************************************************************************************************************************************************************************
  /* 
    var numero=1;
    $scope.devolverRowspan=function(texto)
    {
        if(numero==1)
        {
          $scope.obras = SEMGIndicador.query({
                $and:JSON.stringify([
                    {"objetivoImpacto":texto}
                ])
            });
        numero++;
        }
    }
    
    $scope.devolviendo=function()
    {
        return $scope.obras.length;
    }
    */
  // ROWSPANS  
//*************************************************************************************************************************************************************************************************
    
    $scope.imprimir = function() {
        $window.print();
    };
    
   $scope.color = function (indicador) {
        if (indicador.sentido && indicador.semaforoRojo && indicador.semaforoAmarillo && indicador.semaforoVerde && indicador.metaAnio) 
        {
            if (indicador.sentido == "Ascendente") {
                if (parseInt(indicador.metaAnio) >= parseInt(indicador.semaforoVerde)) {
                    return '#58b058';
                } else if (parseInt(indicador.metaAnio) >= parseInt(indicador.semaforoAmarillo)) {
                    return '#fbae42';
                } else {
                    return '#c73e38';
                }
                
            } else {
                if (parseInt(indicador.metaAnio) >= parseInt(indicador.semaforoRojo)) {
                    return '#c73e38';
                } else if (parseInt(indicador.metaAnio) >= parseInt(indicador.semaforoAmarillo)) {
                    return '#fbae42';
                } else {
                    return '#58b058';
                }
            }
        } else {
            return '#c73e38';
        }
    };
    
    
    $scope.variableMinisterial="";
    $scope.estiloMinisterial = "";
    $scope.anio = $routeParams.anio;
    $scope.compararMinisterial=function(objMinisterial)
    {
            if(objMinisterial==$scope.variableMinisterial)
            {
                $scope.estiloMinisterial = "";
                return false;
            }
            else
            {
                $scope.variableMinisterial=objMinisterial;
                $scope.estiloMinisterial = "1px solid #aaaaaa";
                return true;
            }
    };
    
    $scope.variableImpacto = "";
    $scope.estiloImpacto = "";
    $scope.compararImpacto=function(objImpacto, indice)
    {
        if (indice === 0) 
        {
            $scope.variableImpacto = objImpacto;
            return true;
        }
        else
        {
            if(objImpacto == $scope.variableImpacto)
            {
                $scope.estiloImpacto = "";
                return false;
            }
            else 
            {
                $scope.variableImpacto = objImpacto;
                $scope.estiloImpacto = "1px solid #aaaaaa";
                return true;
            }
        }
    };
})
.controller('MatrizSEMGCtrl', function($scope, $routeParams, Jurisdicciones, SEMGIndicador, ObjMinisteriales, ObjImpacto, SEMGMatrizMonitoreo){
    
    var jurisPoa = Jurisdicciones.query(function(){
        //Este es el array del cual el html matrizindicadores.html tomara los datos al armar la tabla
        $scope.organigrama = [];
        
        //Almaceno todas las jurisdicciones en un array para mostrar en una tabla
        for (var x=0; x<jurisPoa.length; x++)
        {
            if (jurisPoa[x].idOrmOrganigrama !== 0)
            {
                $scope.organigrama.push(jurisPoa[x]);
            } 
        }
    });
    
    $scope.jurisdic = $routeParams.filtro || "todas"; //Los que entran a esta ventana generalmente son de una jurisdiccion.
        var matrizIndicadores=SEMGMatrizMonitoreo.query(function(){
        //Retorna la clase del ultimo mes en el que encuentre edicion.
        $scope.ultimoMesEditado=function(anio,matrizDependencia){
            for(var i=0; i<matrizIndicadores.length; i++){
                if(matrizIndicadores[i]._id==matrizDependencia){
                    if(matrizIndicadores[i] && matrizIndicadores[i].formulario && matrizIndicadores[i].formulario[anio] && matrizIndicadores[i].formulario[anio][matrizIndicadores[i].ultimoMes] && matrizIndicadores[i].formulario[anio][matrizIndicadores[i].ultimoMes].avanceEstudio){
                        return matrizIndicadores[i].formulario[anio][matrizIndicadores[i].ultimoMes].avanceEstudio;
                    }else{
                        return "gris";
                    }
                }
            }
            return "gris";
        };
    }),
        impactos = ObjImpacto.query({},function(){
        var objMinisteriales = ObjMinisteriales.query({},function(){
            $scope.impactoPorId = function(id){
                for (var i = 0; i < impactos.length; i++) {
                    if (impactos[i]._id == id){
                        return impactos[i];
                    }
                }
            };
            $scope.ministerialPorId = function(id){
                for (var i = 0; i < objMinisteriales.length; i++) {
                    if (objMinisteriales[i]._id == id){
                        return objMinisteriales[i];
                    }
                }
            };
        });
    }),
        indicadorAbierto={};
    
    $scope.anio = $routeParams.anio;
    $scope.data = [{
        values: [{label : "Ene", series : 0, value : 0},
                {label : "Feb ", series : 0, value : 0},
                {label : "Mar", series : 0, value : 0},
                {label : "Abr ", series : 0, value : 0},
                {label : "May", series : 0, value : 0},
                {label : "Jun", series : 0, value : 0},
                {label : "Jul", series : 0, value : 0},
                {label : "Ago", series : 0, value : 0},
                {label : "Sep", series : 0, value : 0},
                {label : "Oct", series : 0, value : 0},
                {label : "Nov", series : 0, value : 0},
                {label : "Dic", series : 0, value : 0}],
        key: "Matriz de Monitoreo",
        nombre: ""
    }];
    $scope.options = {
        chart: {
            type: 'discreteBarChart',
            height: 350,
            width: 700,
            margin : {
                top: 10, 
                right: 0, 
                bottom: 15, 
                left: 40 
            },
            noData: 'Sin datos',
            x: function(d){return d.label;},
            y: function(d){return d.value;},
            showValues: true,
            valueFormat: function(d){
                return d;
            },
            transitionDuration: 500,
            xAxis: {
            },
            yAxis: {
                tickFormat: function (v) {
                    return v;
                },
                max: 100,
                axisLabelDistance: 30
            },
            color: function(){return "#64B5F6";}
        }
    };
    
    if($scope.jurisdic == "todas"){
        $scope.indicadores=SEMGIndicador.query();
    }else{
        $scope.indicadores=SEMGIndicador.query({"dependencia":$scope.jurisdic});
    }
    
    //Busca en el array de anios el campo con mayor valor
    function buscarMayorEnArray(array,campo){
        var mayor=0;
        for(var i=0; i<array.length; i++){
            if(array[i][campo]>mayor){
                mayor=array[i][campo];
            }
        }
        return mayor;
    }
    
    //Pone y saca la linea constante del grafico
    $scope.toggleMeta=function(poner){
        if(poner){
            //Creo los elementos que formaran parte de la constante en el grafico
            var div = document.createElement("div"),
                span = document.createElement("span");
                
            div.id="meta"; //Este ID es para poder eliminarlo "facilmente" sin tener que enramar para tomarlo
            
            span.style.cssText="font-weight: bold; color: #1A1E21;"; //Inserto un estilo a la letra
            span.textContent = "Meta: "+indicadorAbierto.metaAnio; //Texto dentro del span
            div.appendChild(span); //Div declara la paternidad del span... lol 
            /*
                alturaPx = Altura del grafico es una altura fija y esta seteada en $scope.options
                maxIndicador =  Numero de la mayor variable, ya que siempre toman la altura maxima del grafico
                metaIndicador =  Meta del indicador
                
                (metaIndicador*alturaPx)/maxIndicador = Regla de 3 simple para calcular la altura de la "barra" de meta en el grafico
                Tan solo a la altura Total (+10px por el texto) le resto el resultado anterior y me dice a cuanto posicionarlo 
                partiendo desde el top
            */
            //Utilizo esta funcion para preguntar si la meta es mayor al indicador de maximo valor retornar un nº que este siempre sobre todas las barras
            function metaMayor(){
                if(maxIndicador<metaIndicador){
                    return 345;
                }else{
                    return (Math.floor((metaIndicador*alturaPx)/maxIndicador)+15);
                }
            }
            
            var alturaPx=312, //Px de alto que tiene el cuadro desde 0 hasta la barra maxima.
                maxIndicador=buscarMayorEnArray($scope.data[0].values, "value"), //Valor 
                metaIndicador=indicadorAbierto.metaAnio;
            
            //Todo el estilo al div  
            div.style.cssText = "width:661px; max-height:2px; bottom:"+metaMayor()+"px;"+"background-color: #2196F3;position: absolute;float: right;right: 20px;z-index: 1;";
            
            //Inserto el div al grafico
            document.querySelector("#grafico").appendChild(div);
            div=null, span=null, alturaPx=null, maxIndicador=null, metaIndicador=null;
        }else{
            document.getElementById("meta").remove();
        }
    };

    $scope.verGrafico = function(indicador) {
        var matrizMonitoreo=SEMGMatrizMonitoreo.get({_id:indicador.matrizDependencia},function(){
            for(var i=0; i<$scope.data[0].values.length; i++){
                $scope.data[0].values[i].value=matrizMonitoreo.formulario[$scope.anio][i].datoIndicador;
            }
            $scope.data.nombre = indicador.indicadorImpacto;
        
            indicadorAbierto=indicador;
            $("#verGrafico").modal('show');
            matrizMonitoreo=null;
        });
    };
    
    $("#verGrafico").on('shown',function(){
       $scope.toggleMeta(true); 
    });
    
    $("#verGrafico").on('hidden',function(){
       $scope.toggleMeta(false); 
    });
})
.controller('MatrizSEMGDetalleCtrl', function($scope, $routeParams, SEMGIndicador, SEMGMatrizMonitoreo, $location, User){
    $scope.anio = $routeParams.anio;
    $scope.matrizMonitoreo;
    
    $scope.indiceMesModal=-1;
    $scope.uploadedFile = [];
    
    
    //Abre los modals pasandole por parametro el id del modal para abrir y su mes.
    $scope.abrirModal=function(indiceMes, idModal, nombreCampo){
        $scope.indiceMesModal=indiceMes;
        if(!$scope.matrizMonitoreo.formulario[$scope.anio][indiceMes][nombreCampo]){
            $scope.matrizMonitoreo.formulario[$scope.anio][indiceMes][nombreCampo]=[];
        }

        $("#"+idModal).modal('show');
    };
    
    /*
        Texto = Obviamente texto que esta en el textarea. 
        Anio = En que objeto quiero guardarlo.
        NumeroMes = Indice del Array. 
        VariableContendora = Nombre de la variable que hay que vaciar.
        idContenedor = Para posicionar el focus denuevo en ese textarea.
    */
    $scope.publicarComentario=function(texto,anio,numeroMes,variableContenedora, idContenedor){
        if(texto!=""){
            $scope.matrizMonitoreo.formulario[anio][numeroMes].comentarios.push({
                comentario:texto,
                fechaComentario: Date.now(),
                usuario:$scope.username
            });
            //Hago el save en la BD e igualo a vacio el campo de texto
            $scope.matrizMonitoreo.$save(function(){
                $scope[variableContenedora]="";
            });
        }
        //Vuelvo a hacer focus en el contenedor
        document.querySelector("#"+idContenedor).focus();
    };
    
    //Retorna el formato de un texto
    function formatoArchivo(nombre){
        var posicionPunto=(nombre.indexOf(".")+1);
        
        if(posicionPunto!=-1){
            return nombre.substr(posicionPunto, nombre.length);
        }else{
            return "off";
        }
    }
    
    /*
        Nombre = Nombre para mostar.
        VariableContenedora = Para vaciarla despues de hacer todo.
        Anio = Para saber a que Año dentro dle objeto ir.
        NumeroMes = Para saber en que posicion del Array.
        IdContenedor = pARAPara hacer focus al terminar
    */
    $scope.subirArchivo = function(nombre, variableContenedora, anio, numeroMes, idContenedor){
        //Si escribieron algo y cargaron algun archivo
        if(nombre!="" && $scope.uploadedFile.length){
            var archivoId=$scope.uploadedFile.shift().id;
            $scope.matrizMonitoreo.formulario[anio][numeroMes].archivos.push({
                formato:formatoArchivo(archivoId),
                idArchivo: archivoId,
                nombreArchivo: nombre,
                fechaSubida: Date.now(),
                usuario:$scope.username
            });
            
            //Hago el save en la BD e igualo a vacio el campo de texto
            $scope.matrizMonitoreo.$save(function(){
                $scope[variableContenedora]="";
            });
        }
        
        //Vuelvo a hacer focus en el contenedor
        document.querySelector("#"+idContenedor).focus();
    };
    
    $scope.eliminarArchivo=function(indiceMesTotal, indice, anio){
        $scope.matrizMonitoreo.formulario[anio][indiceMesTotal].archivos.splice( ($scope.matrizMonitoreo.formulario[anio][indiceMesTotal].archivos.length-1-indice) ,1);
        $scope.matrizMonitoreo.$save();
    };
    
    //Una vez que se muestre el modal, hacerle focus al campo de texto
    $('#modalComentariosMatriz').on('shown', function () {
        document.querySelector("#textAreaModalComentario").focus();
    });
    $('#modalArchivosMatriz').on('shown', function () {
        document.querySelector("#nombreArchivoId").focus();
    });
    
    //Uso moment.js
    $scope.retornarHoraYMinuto=function(milisegundos){
        var varMoment=moment.duration(milisegundos);
        
        return ( ( (varMoment.hours()<10) ? ("0"+varMoment.hours()) : (varMoment.hours() ) )+":"+
            ( (varMoment.minutes()<10) ? ("0"+varMoment.minutes()) : (varMoment.minutes() ) ));
    };
    
    //Uso moment.js
    $scope.retornarAnnoMesDia=function(milisegundos){
        var varMoment=moment.duration(milisegundos);
        
        return ( ( (varMoment.days()<10) ? ("0"+varMoment.days()) : (varMoment.days() ) ) +"/"+ ( (varMoment.months()<10) ? ("0"+varMoment.months()) : (varMoment.months() ) )+"/"+varMoment.years());
    };
    
    /*
        IndiceMesTotal = Para saber en que mes estoy.
        Indice = Para saber que comentario es. 
        Anio = Para saber en que año de la matriz tengo que ver.
    */
    $scope.eliminarComentario=function(indiceMesTotal, indice, anio){
        $scope.matrizMonitoreo.formulario[anio][indiceMesTotal].comentarios.splice( ($scope.matrizMonitoreo.formulario[anio][indiceMesTotal].comentarios.length-1-indice) ,1);
        $scope.matrizMonitoreo.$save();
    };
    
    //Tomo el indicador
    $scope.indicador=SEMGIndicador.get({_id:$routeParams._id},function(){
        //Si el indicador ya tiene asignado una matrizIndicador
        if($scope.indicador.matrizDependencia)
        {
            $scope.matrizMonitoreo=SEMGMatrizMonitoreo.get({_id:$scope.indicador.matrizDependencia},function(){
                //Pregunto si tiene informacion del anio actual, en caso contrario lo creo
                if($scope.matrizMonitoreo && !$scope.matrizMonitoreo.formulario[$scope.anio])
                {
                    $scope.matrizMonitoreo.formulario[$scope.anio]=dameMeses();
                }
            });
        }
        else //Creo una nueva Matriz y la enlazo con el indicador
        { 
            //Creo una nueva MatrizIndicador
            $scope.matrizMonitoreo = new SEMGMatrizMonitoreo({
                indicadorDependencia: $scope.indicador._id,
                formato: $scope.indicador.formatoNumero,
                codigoFormato: dameCodigoFormato($scope.indicador.formatoNumero),
                indicadorImpacto: $scope.indicador.indicadorImpacto,
                formulario:{},
                semaforizacion: $scope.indicador.semaforizacion,
                sentido: $scope.indicador.sentido,
                ultimoMesEditado: 0,
                eliminado: false,
                jurisdiccion: $scope.indicador.dependencia
            });
            
            //Le asigno que el formulario que se creara sera el de este año.
            $scope.matrizMonitoreo.formulario[$scope.anio] = dameMeses();
            
            //Guardo el id del MatrizIndicador en el Registro del Indicador para poder enlazarlos
            $scope.matrizMonitoreo.$save(function(ultimoRegistro){
                $scope.indicador.matrizDependencia=ultimoRegistro._id;
                $scope.indicador.$save();
            });
        }
    });
    
    var user = User.findByName({username: $scope.username}), hoy = Date.now(), unMesEnMilisegundos=2629743000;
    
    //Retorna una clase con un color de fondo dependiendo el dato ingresado por la persona de la jurisdiccion y la semaforizacion
    $scope.calcularConSemaforo=function(dato, semaforizacion){
        if(semaforizacion && dato){
            if($scope.matrizMonitoreo.sentido=="Ascendente"){
                if(dato<=semaforizacion.rango3){
                    return "rojo";
                }else if(dato<semaforizacion.rango1 && dato>semaforizacion.rango3){
                    return "amarillo";
                }else if(dato>=semaforizacion.rango1){
                    return "verde";
                }
            }else{
                if(dato<=semaforizacion.rango1){
                    return "verde";
                }else if(dato>semaforizacion.rango1 && dato<semaforizacion.rango3){
                    return "amarillo";
                }else if(dato>=semaforizacion.rango3){
                    return "rojo";
                }
            }
        }
        return "gris";
    };
    
    //Si todos los meses anteriores meses al que le estoy pasando estan validados retorna TRUE
    function anterioresValidado(array, valor, posicion){
        for(var i=0; i<array.length; i++){
            if(i==posicion){
                return true;
            }else{
                if(!array[i][valor]){
                    return false;
                }
            }
        }
    }
    
    //Solo pueden cambiar la validez a falso los que tengan permisos para editar las jurisdicciones
    /*
    $scope.cambiarValides=function(validez, posicion){
        if( anterioresValidado($scope.matrizMonitoreo.formulario[$scope.anio], "validado", posicion) ){
            if(validez==false){
                return true;
            }
            else if(validez==true && $scope.hasPermission('semg.validarSecretaria')){
                return false;
            }  
        }else{
            return validez;
        }
    };
    */
    $scope.cambiarValides=function(valor,posicion){
        if(valor){
            if($scope.hasPermission('semg.validarSecretaria')){
                return false;
            }
        }else{
            if(anterioresValidado($scope.matrizMonitoreo.formulario[$scope.anio], "validado", posicion)){
                return true;
            }
        }
    };
    
    //Activar o no el boton para validar
    $scope.habilitarValidacion=function(tipoEdicion, valor, posicion){
        if(tipoEdicion){
            if($scope.elMesEsEditable(posicion)){
                if(valor){
                    if($scope.hasPermission('semg.validarSecretaria')){
                        return false;
                    }
                }else{
                    return false;
                }
            }
        }
        return true;
    };

    //Title de los circulos de colores en cada mes.
    $scope.armarTitle=function(matrizM){
        if(matrizM && matrizM.semaforizacion && matrizM.semaforizacion.rango1 && matrizM.semaforizacion.rango3){
            if(matrizM.sentido=="Ascendente"){
                return "Mayor que " + matrizM.semaforizacion.rango3 + " y Menor que " + matrizM.semaforizacion.rango1;
            }else{
                return "Menor que " + matrizM.semaforizacion.rango1 + " y Mayor que " + matrizM.semaforizacion.rango3;
            }
        }
    };
    
    //Basandose en el formato del numero, asigna un codigo para poder representar haciendo menos calculos en el HTML
    function dameCodigoFormato(formato){
        switch(formato)
        {
            case "Porcentaje":
                return 1;
            case "Tasa":
                return 2;
            case "Fraccion":
                return 3;
            case "Numero Absoluto": // Se veran 2 inputs
                return 4;
            case "Indice": // Se veran 2 inputs
                return 5;
            case "Promedio":
                return -1;
            default:
                return 0;
        }
    }
    
    //Retorna todos los meses con sus datos para insertar en la BD
    function dameMeses(){
        return [
                    {
                        nombre: "Enero",
                        datoIndicador: null,
                        numeroAbsUno: "",
                        numeroAbsDos: "",
                        avanceEstudio: "",
                        validado: false
                    },
                    {
                        nombre: "Febrero",
                        datoIndicador: null,
                        numeroAbsUno: "",
                        numeroAbsDos: "",
                        avanceEstudio: "",
                        validado: false
                    },
                    {
                        nombre: "Marzo",
                        datoIndicador: null,
                        numeroAbsUno: "",
                        numeroAbsDos: "",
                        avanceEstudio: "",
                        validado: false
                    },
                    {
                        nombre: "Abril",
                        datoIndicador: null,
                        numeroAbsUno: "",
                        numeroAbsDos: "",
                        avanceEstudio: "",
                        validado: false
                    },
                    {
                        nombre: "Mayo",
                        datoIndicador: null,
                        numeroAbsUno: "",
                        numeroAbsDos: "",
                        avanceEstudio: "",
                        validado: false
                    },
                    {
                        nombre: "Junio",
                        datoIndicador: null,
                        numeroAbsUno: "",
                        numeroAbsDos: "",
                        avanceEstudio: "",
                        validado: false
                    },
                    {
                        nombre: "Julio",
                        datoIndicador: null,
                        numeroAbsUno: "",
                        numeroAbsDos: "",
                        avanceEstudio: "",
                        validado: false
                    },
                    {
                        nombre: "Agosto",
                        datoIndicador: null,
                        numeroAbsUno: "",
                        numeroAbsDos: "",
                        avanceEstudio: "",
                        validado: false
                    },
                    {
                        nombre: "Septiembre",
                        datoIndicador: null,
                        numeroAbsUno: "",
                        numeroAbsDos: "",
                        avanceEstudio: "",
                        validado: false
                    },
                    {
                        nombre: "Octubre",
                        datoIndicador: null,
                        numeroAbsUno: "",
                        numeroAbsDos: "",
                        avanceEstudio: "",
                        validado: false
                    },
                    {
                        nombre: "Noviembre",
                        datoIndicador: null,
                        numeroAbsUno: "",
                        numeroAbsDos: "",
                        avanceEstudio: "",
                        validado: false
                    },
                    {
                        nombre: "Diciembre",
                        datoIndicador: null,
                        numeroAbsUno: "",
                        numeroAbsDos: "",
                        avanceEstudio: "",
                        validado: false
                    }
                ];
    } 
    
    //Compara la fecha actual con la posicion del mes en un array y dice si se puede editar hasta la fecha o no
    $scope.elMesEsEditable=function(numeroMes){
        var mesAEditar = new Date($scope.anio, numeroMes, 1, 0, 0, 0, 0).getTime(); // Mes que quiero editar en Milisegundos
        
        if((hoy-mesAEditar)>unMesEnMilisegundos){
            return true;
        }else{
            return false;
        }
    };
    
    //Busca el ultimo mes que se edito y cuando lo encuentra  un mes sin edicion, retorna el mes anterior
    function ultimoMesEditado(registro, campoIterar, datoPreguntar, orden){
        if(orden==1){
            for(var i=0; i<registro[campoIterar].length; i++){
                if( (registro[campoIterar][i][datoPreguntar]==null || registro[campoIterar][i][datoPreguntar]=="") && registro[campoIterar][i].validado){
                    return i-1;
                }
            }
            return registro[campoIterar].length;
        }else if(orden==-1){
            for(var i=registro[campoIterar].length-1; i>0; i--){
                if(registro[campoIterar][i][datoPreguntar]!=null && registro[campoIterar][i][datoPreguntar]!="" && registro[campoIterar][i].validado){
                    return i;
                }
            }
            return 0;
        }
    }
    
    //Guardar lol.
    $scope.guardar=function(){
        $scope.matrizMonitoreo.ultimoMes=ultimoMesEditado($scope.matrizMonitoreo.formulario, $scope.anio, "datoIndicador", -1);
        $scope.matrizMonitoreo.$save(function(){
            //Si tiene permisos de jurisdiccion o si tiene permisos para validar TODOOO e.e
            if($scope.hasPermission('semg.verJurisdiccion')){
                $location.url('/semg/matrizMonitoreo/'+$scope.anio+"?filtro="+user.jurisdiccion);
            }else{
                $location.url('/semg/matrizMonitoreo/'+$scope.anio);
            }
        });
    };
});