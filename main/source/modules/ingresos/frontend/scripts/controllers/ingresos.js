angular.module('bag2.ingresos', [])
.controller("IngresosCtrl", function($scope, $http, Ingresos, Proyectos, Jurisdicciones) //INDEX
{
    $scope.ingresos=Ingresos.query();
    $scope.proyectos=Proyectos.query();
    $scope.jurisdicciones=Jurisdicciones.query();
    
    $scope.organigramaPorId = function (id) {
      for (var i = 0; i < $scope.jurisdicciones.length; i++) {
          if ($scope.jurisdicciones[i]._id == id)
          {
              return $scope.jurisdicciones[i].nombre;
          }
      }  
    };
    
    $scope.sacarPunto=function()
    {
        $scope.filtro.documento=$scope.filtro.documento.replace(".","");  
    };
    
    $scope.NOEXISTA=function(ba)
    {
        if(ba.eliminado)
        {
            return false;
        }
        else
        {
            return true;
        }
    };
    
    $scope.cantidadProyectos=function(id)
    {
        var contador=0;
        for(var i=0; i<$scope.proyectos.length; i++)
        {
            if(!($scope.proyectos[i].eliminado) && ($scope.proyectos[i].idJurisdiccion==id))
            {
                contador++;
            }
        }
        return contador;
    };
    
    $scope.proyectosCompletos=function(id)
    {
        var completos=0;
        for(var i=0; i<$scope.proyectos.length; i++)
        {
            if(!($scope.proyectos[i].eliminado) && ($scope.proyectos[i].idJurisdiccion==id))
            {
                if(($scope.proyectos[i].metaProducto) && ($scope.proyectos[i].metaProducto!="N/A") && ($scope.proyectos[i].metaCuantificacion) && ($scope.proyectos[i].fechaInicio) && ($scope.proyectos[i].fechaFin) && ($scope.proyectos[i].presupuestoSolicitado))
                {
                    completos++;
                }
            }
        }
        return completos;
    };
    
    $scope.sumadorTotalCompletos=function()
    {
        var contador=0;
        for(var i=0; i<$scope.proyectos.length; i++)
        {
            if(!$scope.proyectos[i].eliminado)
            {
                if(($scope.proyectos[i].metaProducto) && ($scope.proyectos[i].metaProducto!="N/A") && ($scope.proyectos[i].metaCuantificacion) && ($scope.proyectos[i].fechaInicio) && ($scope.proyectos[i].fechaFin) && ($scope.proyectos[i].presupuestoSolicitado))
                {
                    contador++;
                }
            }
        }
        return contador;
    };
    
    $scope.sumadorTotal=function()
    {
        var contador=0;
        for(var i=0; i<$scope.proyectos.length;i++)
        {
            if(!$scope.proyectos[i].eliminado)
            {
                contador++;
            }
        }
        return contador;
    };
    
    $scope.sumarAcceso=function(i,variable)
    {
        if(variable)
        {
            ((i.accesos)?(i.accesos+=1):(i.accesos=1));
            i.$save();
            $scope.enviarMail(i.nombre,i.motivo);
        }
        else
        {
            $scope.accesoActual=i;
            $("#modalAcceso").modal('show');
            
            //Cuando el modal este cargado
            $('#modalAcceso').on('shown', function () {
                $('#motivo1').focus();
            });
        }
    };
    
    $scope.enviarMail=function(nombre, motivo)
    {
        var f=new Date();
        var cad=f.getHours()+":"+f.getMinutes()+":"+f.getSeconds(); 
        $scope.enviando = true;
        var payload = {
            asunto: "Nuevo ingreso",
            para: "alexanderarmua@hotmail.com",
            emisor: "Ingresos",
            mensajeHtml: "Nuevo ingreso de "+ nombre +" a las"+cad+" por el siguiente motivo: "+motivo,
            adjunto : "",
            from : "Ingresos <ingresos@buenosaires.gob.ar>"
        };
        $http.post('/api/ingreso/enviar-mail', payload).success(function() {
                $scope.enviando = false;
            }).error(function() {
                $scope.enviando = false;
                alert("Fallo el envio");
            });
        };
    })
.controller("IngresosNuevoCtrl", function($scope, Ingresos, $location) //Nuevo
{
    $scope.ingreso=new Ingresos();
    $scope.ingresos=Ingresos.query();
    
    $scope.nuevoIngreso=function()
    {
        $scope.ingreso.documento=$scope.ingreso.documento;
        var controlador=true;
        for(var i=0; i<$scope.ingresos.length; i++)
        {
            if($scope.ingreso.documento==$scope.ingresos[i].documento)
            {
                controlador=false;
                break;
            }
        }
        
        if(controlador)
        {
            $scope.ingreso.$save();
            $location.url("/ingresos");
        }
        else
        {
            alert("Ya existe un registro con el documento ingresado.");
        }
    };
})
.controller("IngresosDetalleCtrl", function($scope, $routeParams, Ingresos, $location) //Detalle
{
    $scope.ingreso=Ingresos.get({_id:$routeParams._id});
    $scope.ingresoAlt=Ingresos.get({_id:$routeParams._id});
    $scope.ingresos=Ingresos.query();
    
    $scope.guardarIngreso=function()
    {
        var controlador=true;
        var primerDocumento=$scope.ingresoAlt.documento;
        
        for(var i=0; i<$scope.ingresos.length; i++)
        {
            if(($scope.ingreso.documento==$scope.ingresos[i].documento) && ($scope.ingreso.documento!=primerDocumento))
            {
                controlador=false;
                break;
            }
        }
        
        if(controlador)
        {
            $scope.ingreso.$save();
            $location.url("/ingresos");
        }
        else
        {
             alert("Cambio el nº de documento por otro que ya existe en el registro.");
        }
        
    };
    
    $scope.borrarAcceso=function(variable)
    {
        if(variable)
        {
            //Cerrar modal manualmente
            $('#confirmarEliminar').modal('toggle');
            
            $scope.ingreso.$delete(function()
            {
                $location.url("/ingresos");
            });
        }
        else
        {
            $("#confirmarEliminar").modal('show');
        }
    };
})
.controller("IngresosVisitantesIndexCtrl",function($scope,Visitantes)
{
    var f=new Date();
    var diaActual="El "+( (f.getDate()<10) ? ("0"+f.getDate()) : (f.getDate()) )+"/"+( ((f.getMonth()-1)<10) ? ("0"+(f.getMonth()-1)) : (f.getMonth()-1) )+"/"+f.getFullYear()+" a las "+f.getHours()+":"+( (f.getMinutes()<10) ? ("0"+f.getMinutes()) : (f.getMinutes()) );
    
    $scope.$watch('documento', function (documento){
        if (documento) 
        {
            if(documento.toString().length>7)
            {
                $scope.ingreso = Visitantes.query({'documento' : documento},function(){
                    
                    if($scope.ingreso.length==0)
                    {
                        $scope.ultimavisita="";
                        $scope.ingreso=new Visitantes();
                    }
                    else
                    {
                        $scope.ingreso=$scope.ingreso[0];
                        $scope.ultimavisita=$scope.ingreso.ingresos[$scope.ingreso.ingresos.length-1];
                    }
                    
                    $scope.mostrar=true;
                });
            }
            else
            {
                $scope.ultimavisita="";
                $scope.ingreso=new Visitantes();
                $scope.mostrar=false;
            }
        }
    });
    

    $scope.guardarVisita=function()
    {
        $scope.ingreso.documento=$scope.documento;
        if(!$scope.ingreso.ingresos)
        {
            $scope.ingreso.ingresos=[];   
        }
        $scope.ingreso.ingresos.push(diaActual);
        $scope.ingreso.$save();
        $scope.documento="";
        $scope.ultimavisita="";
        $scope.ingreso=new Visitantes();
        $scope.mostrar=false;
    };

});
