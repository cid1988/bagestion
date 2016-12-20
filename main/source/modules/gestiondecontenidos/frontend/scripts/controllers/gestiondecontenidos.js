angular.module('bag2.gestiondecontenidos', [])
.controller("GestionDeContenidosNuevoCtrl", function($scope, GestionDeContenidos, ORMOrganigrama, $routeParams)
{
    $scope.uploaded = [];
    $scope.gestionDeLaInformacion=new GestionDeContenidos();
    $scope.piezas= GestionDeContenidos.query();
    $scope.jurisdicciones = ORMOrganigrama.query();  
    $scope.pieza = GestionDeContenidos.get({_id : $routeParams._id});
    
    $scope.aMilisegundos = function(fecha) 
    {
        var fechaDividida = fecha.split("/");
        var date = new Date(fechaDividida[2], fechaDividida[1] - 1, fechaDividida[0], 0, 0, 0, 0);
        return date.getTime();
    };
    
    $scope.guardar = function() 
    {
        $scope.gestionDeLaInformacion.comentarios=[];
        $scope.gestionDeLaInformacion.imagen = $scope.uploaded.shift().id;
        if ($scope.gestionDeLaInformacion.fecha) {
            $scope.gestionDeLaInformacion.milisegundos = $scope.aMilisegundos($scope.gestionDeLaInformacion.fecha);
        }
        $scope.gestionDeLaInformacion.$save();
	};
	
	$scope.jurisdiccionPorId = function (id) 
	{
      for (var i = 0; i < $scope.jurisdicciones.length; i++) 
      {
          if ($scope.jurisdicciones[i]._id == id)
          {
              return $scope.jurisdicciones[i];
          }
      }  
    };
    
    $scope.archivoPorId = function (id) 
    {
      for (var i = 0; i < $scope.piezas.length; i++) {
          if ($scope.piezas[i]._id == id)
          {
              return $scope.piezas[i];
          }
      }  
    };
    
    $scope.agregarRelacion = function(relacion) 
    {
        if (!$scope.gestionDeLaInformacion.archivosRelacionados) 
        {
            $scope.gestionDeLaInformacion.archivosRelacionados = [];
        }
        $scope.gestionDeLaInformacion.archivosRelacionados.push(relacion);
        $scope.relacion = "";
    };
    
    $scope.eliminarListaElem = function(elemento, lista) 
    {
        lista.splice(lista.indexOf(elemento), 1);
    };
    
})
.controller("GestionDeContenidosCtrl", function($scope, GestionDeContenidos, ORMOrganigrama)
{
    $scope.piezas=GestionDeContenidos.query();
    $scope.jurisdicciones = ORMOrganigrama.query();
    $scope.ordeniG = "-milisegundos";
    $scope.ordenG = "-milisegundos";
    $scope.ordenGe = "-milisegundos";
    var hoy = new Date().getTime();
    console.log(hoy);
    $scope.returnTipo=function(obj)
    {
      if(obj.milisegundos>1451642400000)
      {
          return "iBreak";
      }
      else
      {
          return "iGestión";
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
    
    
    
    $scope.menosCincoDias=function(diaComparar)
    {
        if((hoy-diaComparar)<=432000000)
        {
            return true;
        }
        else
        {
            return false;
        }
    };
    
    $scope.aMilisegundos = function(fecha) 
    {
        if (fecha) 
        {
            var fechaDividida = fecha.split("/");
            var date = new Date(fechaDividida[2], fechaDividida[1] - 1, fechaDividida[0], 0, 0, 0, 0);
            return date.getTime();
        } 
        else 
        {
            return 0;
        }
    };

    $scope.compararMilisegundos=function(vencimiento)
    {
        if (vencimiento) {
            var tiempoRestante=hoy-$scope.aMilisegundos(vencimiento);
            var color="";
            var diaEnMilisegundos=-86400000;
            
            if (tiempoRestante<0)
            {
                if(tiempoRestante<diaEnMilisegundos)
                {
                    color="#58b058";
                }
                else
                {
                    color="#fbae42";
                }
            }
            else
            {
                color="#c73e38";
            }
            
            return color;
        }
    };

})
.controller("GestionDeContenidosDetalleCtrl", function($scope, Correos, $location, GestionDeContenidos, $routeParams, $modal, ORMOrganigrama, $http)
{           
    
    
    	
    $scope.correos=Correos.query(function(){
        var a=$scope.correos[0].correo;
        
        for(var i=1; i<$scope.correos.length; i++)
        {
            a+=","+$scope.correos[i].correo;
        }
        $scope.receptores=a;
    });
     $scope.pieza = GestionDeContenidos.get({_id : $routeParams._id}, function() {
         
        $scope.pdf  = new PDFObject({ url: "/file/" + $scope.pieza.imagen }).embed("verPDF");
        if ($scope.pieza.tipoPieza == "tipo3") {
            $scope.archivoId = '<object width="100%" height="1000"><param name="movie" value="/file/' + $scope.pieza.imagen + '"><embed src="/file/' + $scope.pieza.imagen + '"></embed></object>';
        }
        $scope.mensaje="Click <a href='"+window.location+"'>Aquí</a>";
            $scope.gestionTipo3=GestionDeContenidos.query({'tipoPieza':'tipo3'},function(){
            
                for(var i=0; i<=$scope.gestionTipo3.length; i++)
                {
                    //Buscar siguiente
                    if(($scope.gestionTipo3[i].milisegundos)>($scope.pieza.milisegundos))
                    {
                        if(!$scope.siguiente)
                        {
                            $scope.siguiente=$scope.gestionTipo3[i];
                        }
                        else if(($scope.gestionTipo3[i].milisegundos)<($scope.siguiente.milisegundos))
                        {
                            $scope.siguiente=$scope.gestionTipo3[i];
                        }
                    }
                    
                    //Buscar anterior
                    if(($scope.gestionTipo3[i].milisegundos)<($scope.pieza.milisegundos))
                    {
                        if(!$scope.anterior)
                        {
                            $scope.anterior=$scope.gestionTipo3[i];
                        }
                        else if(($scope.gestionTipo3[i].milisegundos)>($scope.anterior.milisegundos))
                        {
                            $scope.anterior=$scope.gestionTipo3[i];
                        }
                    }
                }
        });
     });
     $scope.gestiones = GestionDeContenidos.query();
     $scope.jurisdicciones = ORMOrganigrama.query();
     
    
    $scope.data = 
        {
            usuario : '',
            fecha : '',
            comentario : ''
        };

    $scope.agregarComentario = function() 
    {
        if($scope.data.comentario!=="")
        {
            if (!$scope.pieza.comentarios) 
            {
                $scope.pieza.comentarios = [];
            }
            $scope.data.fecha = new Date();
            $scope.data.usuario = $scope.username;
            $scope.pieza.comentarios.push($scope.data);
            $scope.pieza.$save({}, function() 
            {
                $scope.enviarMail("comunicación.gestion@buenosaires.gob.ar", "El usuario "+$scope.data.usuario+" a comentado en "+$scope.pieza.titulo+": '"+$scope.data.comentario+"' en Click <a href='"+window.location+"'>Aquí</a> para acceder.",$scope.pieza._id,"Nuevo comentario en "+$scope.pieza.titulo,true);
            $scope.data.comentario="";
            });
        }
    };
    
    $scope.enviarMail=function(contactos,texto,id, asunto, esComentario)
    {
        $scope.enviando = true;
        var payload = {
            asunto: asunto,
            para: contactos,
            iGestionid: id,
            emisor: "iGestión",
            mensajeHtml: "<div class='mailwrapper' style='font-size: 20px; color: black; line-height: 100% !important;'>"+
                            "<table style='width:800px'>"+
                                "<tr>"+
                                   "<td>"+ /*src='http://k46.kn3.net/6/C/B/4/A/5/0F2.jpg' ´http://k30.kn3.net/5/B/2/3/3/2/AB9.jpg´*/ 
                                        "<img src='https://k60.kn3.net/C/7/A/A/B/7/744.jpg' width='800px'/>"+
                                    "</td>"+
                                "</tr>"+
                                "<tr>"+
                                    "<td>"+ 
                                        texto+
                                    "</td>"+
                                "</tr>"+
                                "<tr>"+
                                    "<td>"+
                                        "<img src='https://k60.kn3.net/C/B/2/F/F/8/8CF.jpg'/>"+
                                    "</td>"+
                                "</tr>"+
                            "</table>"+
                        "</div>",
            adjunto : "",
            from : "iBreak <ibreak@buenosaires.gob.ar>"
        };
        $http.post('/api/gestiondecontenidos/enviar-mail', payload).success(function() {
            $scope.enviando = false;
        }).error(function() {
            $scope.enviando = false;
            if(!esComentario)
            {
                alert("Fallo el envio");
            }
        });
    };
    
    $scope.dameFecha = function(fecha) 
    {
        var f = new Date(fecha);
        if (f.getMinutes() < 10) 
        {
            var minutos = "0" + f.getMinutes();
        } 
        else 
        {
            var minutos = f.getMinutes();
        }
        return (f.getDate() + "/" + (f.getMonth() +1) + "/" + f.getFullYear() + " - " + f.getHours() + ":" + minutos);
    };
    
    $scope.eliminarListaElem = function(elemento, lista) 
    {
        lista.splice(lista.indexOf(elemento), 1);
    };
    
    $scope.reverse = function(array) 
    {
        var copy = [].concat(array);
        return copy.reverse();
    };
    
    $scope.archivoPorId = function (id)
    {
      for (var i = 0; i < $scope.gestiones.length; i++) 
      {
          if ($scope.gestiones[i]._id == id)
          {
              return $scope.gestiones[i];
          }
      }  
    };
    
    $scope.eliminar = function(confirmado) 
    {
        if (confirmado) 
        {
            $scope.pieza.$delete(function() 
            {
                $location.url('/gestiondecontenidos');
            });
        }
        else 
        {
            $("#confirmarEliminar").modal('show');
        }
    };
    
    $scope.eliminarComentario = function(array,elemento) 
    {
        var indice = array.indexOf(elemento);
        if(indice!=-1) array.splice(indice, 1);
        $scope.pieza.$save();
    };
    
    $scope.editar = function(confirmado) 
    {
        if (confirmado) 
        {
            $scope.pieza.milisegundos = $scope.aMilisegundos($scope.pieza.fecha);
            $scope.pieza.$save();
        }
        else 
        {
            $("#ventanaEditar").modal('show');
        }
    };
    
    $scope.jurisdiccionPorId = function (id) 
	{
      for (var i = 0; i < $scope.jurisdicciones.length; i++) 
      {
          if ($scope.jurisdicciones[i]._id == id)
          {
              return $scope.jurisdicciones[i];
          }
      }  
    };
    
    $scope.agregarRelacion = function(relacion) 
    {
        if (!$scope.pieza.archivosRelacionados) 
        {
            $scope.pieza.archivosRelacionados = [];
        }
        $scope.pieza.archivosRelacionados.push(relacion);
        $scope.relacion = "";
    };
    
    $scope.eliminarListaElem = function(elemento, lista) 
    {
        lista.splice(lista.indexOf(elemento), 1);
    };
    
    $scope.devolverTema=function(tipo)
    {
        var tema="";
        switch(tipo) 
        {
            case "tipo1":
                tema="Gestión";
        break;
            case "tipo2":
                tema="E";
        break;
            
            case "tipo3":
                tema="iGestiòn";
        break;
        
        default:
                tema="";
        }

        return tema;
    };
    
    var hoy = new Date().getTime();

    $scope.aMilisegundos = function(fecha) 
    {
        if (fecha) 
        {
            var fechaDividida = fecha.split("/");
            var date = new Date(fechaDividida[2], fechaDividida[1] - 1, fechaDividida[0], 0, 0, 0, 0);
            return date.getTime();
        } 
        else 
        {
            return 0;
        }
    };

    $scope.compararMilisegundos=function(vencimiento)
    {
        var tiempoRestante=hoy-$scope.aMilisegundos(vencimiento);
        var color="";
        var diaEnMilisegundos=-86400000;
        
        if (tiempoRestante<0)
        {
            if(tiempoRestante<diaEnMilisegundos)
            {
                color="#58b058";
            }
            else
            {
                color="#fbae42";
            }
        }
        else
        {
            color="#c73e38";
        }
        
        return color;
    };
    
    $scope.enviarM = function() 
    {
        $("#enviar").modal('show');
    };
})
.controller("GestionDeContenidosAdminNuevoCtrl", function($scope, GestionDeContenidosAdministracion, ORMOrganigrama, $routeParams)
{
    $scope.uploaded = [];
    $scope.gestionDeLaInformacion=new GestionDeContenidosAdministracion();
    $scope.piezas= GestionDeContenidosAdministracion.query();
    $scope.jurisdicciones = ORMOrganigrama.query();  
    $scope.pieza = GestionDeContenidosAdministracion.get({_id : $routeParams._id});
    
    $scope.aMilisegundos = function(fecha) 
    {
        var fechaDividida = fecha.split("/");
        var date = new Date(fechaDividida[2], fechaDividida[1] - 1, fechaDividida[0], 0, 0, 0, 0);
        return date.getTime();
    };
    
    $scope.guardar = function() 
    {
        $scope.gestionDeLaInformacion.comentarios=[];
        $scope.gestionDeLaInformacion.imagen = $scope.uploaded.shift().id;
        $scope.gestionDeLaInformacion.milisegundos = $scope.aMilisegundos($scope.gestionDeLaInformacion.fecha);
        $scope.gestionDeLaInformacion.$save();
	};
	
	$scope.jurisdiccionPorId = function (id) 
	{
      for (var i = 0; i < $scope.jurisdicciones.length; i++) 
      {
          if ($scope.jurisdicciones[i]._id == id)
          {
              return $scope.jurisdicciones[i];
          }
      }  
    };
    
    $scope.archivoPorId = function (id) 
    {
      for (var i = 0; i < $scope.piezas.length; i++) {
          if ($scope.piezas[i]._id == id)
          {
              return $scope.piezas[i];
          }
      }  
    };
    
    $scope.agregarRelacion = function(relacion) 
    {
        if (!$scope.gestionDeLaInformacion.archivosRelacionados) 
        {
            $scope.gestionDeLaInformacion.archivosRelacionados = [];
        }
        $scope.gestionDeLaInformacion.archivosRelacionados.push(relacion);
        $scope.relacion = "";
    };
    
    $scope.eliminarListaElem = function(elemento, lista) 
    {
        lista.splice(lista.indexOf(elemento), 1);
    };
    
})
.controller("GestionDeContenidosAdminCtrl", function($scope, GestionDeContenidosAdministracion, ORMOrganigrama)
{
    $scope.piezasGestion=GestionDeContenidosAdministracion.query();
    $scope.piezasE=GestionDeContenidosAdministracion.query();
    $scope.iGestion=GestionDeContenidosAdministracion.query();
    $scope.jurisdicciones = ORMOrganigrama.query();
    $scope.ordeniG = "-milisegundos";
    $scope.ordenG = "-milisegundos";
    $scope.ordenGe = "-milisegundos";
    
    $scope.jurisdiccionPorId = function (id) 
	{
      for (var i = 0; i < $scope.jurisdicciones.length; i++) 
      {
          if ($scope.jurisdicciones[i]._id == id)
          {
              return $scope.jurisdicciones[i];
          }
      }  
    };
    
    var hoy = new Date().getTime();

    $scope.aMilisegundos = function(fecha) 
    {
        if (fecha) 
        {
            var fechaDividida = fecha.split("/");
            var date = new Date(fechaDividida[2], fechaDividida[1] - 1, fechaDividida[0], 0, 0, 0, 0);
            return date.getTime();
        } 
        else 
        {
            return 0;
        }
    };

    $scope.compararMilisegundos=function(vencimiento)
    {
        var tiempoRestante=hoy-$scope.aMilisegundos(vencimiento);
        var color="";
        var diaEnMilisegundos=-86400000;
        
        if (tiempoRestante<0)
        {
            if(tiempoRestante<diaEnMilisegundos)
            {
                color="#58b058";
            }
            else
            {
                color="#fbae42";
            }
        }
        else
        {
            color="#c73e38";
        }
        
        return color;
    }

})
.controller("GestionDeContenidosAdminDetalleCtrl", function($scope, $location, GestionDeContenidosAdministracion, $routeParams, $modal, ORMOrganigrama)
{           
     $scope.pieza = GestionDeContenidosAdministracion.get({_id : $routeParams._id}, function() {
         //Con esto se visualiza el PDF, en el elemento 'verPDF'
         $scope.pdf  = new PDFObject({ url: "/file/" + $scope.pieza.imagen }).embed("verPDF");
         
         if ($scope.pieza.tipoPieza == "tipo3") {
             $scope.archivoId = '<object width="100%" height="1000"><param name="movie" value="/file/' + $scope.pieza.imagen + '"><embed src="/file/' + $scope.pieza.imagen + '"></embed></object>';
         }
     });
     $scope.gestiones = GestionDeContenidosAdministracion.query();
     $scope.jurisdicciones = ORMOrganigrama.query();
     
     $scope.data = 
        {
            usuario : '',
            fecha : '',
            comentario : ''
        };

    $scope.agregarComentario = function() 
    {
        if($scope.data.comentario!=="")
        {
            if (!$scope.pieza.comentarios) 
            {
                $scope.pieza.comentarios = [];
            }
            $scope.data.fecha = new Date();
            $scope.data.usuario = $scope.username;
            $scope.pieza.comentarios.push($scope.data);
            $scope.pieza.$save({}, function() 
            {
            $scope.data.comentario="";
            });
        }
    };
    
    $scope.dameFecha = function(fecha) 
    {
        var f = new Date(fecha);
        if (f.getMinutes() < 10) 
        {
            var minutos = "0" + f.getMinutes();
        } 
        else 
        {
            var minutos = f.getMinutes();
        }
        return (f.getDate() + "/" + (f.getMonth() +1) + "/" + f.getFullYear() + " - " + f.getHours() + ":" + minutos);
    };
    
    $scope.eliminarListaElem = function(elemento, lista) 
    {
        lista.splice(lista.indexOf(elemento), 1);
    };
    
    $scope.reverse = function(array) 
    {
        var copy = [].concat(array);
        return copy.reverse();
    };
    
    $scope.archivoPorId = function (id)
    {
      for (var i = 0; i < $scope.gestiones.length; i++) 
      {
          if ($scope.gestiones[i]._id == id)
          {
              return $scope.gestiones[i];
          }
      }  
    };
    
    $scope.eliminar = function(confirmado) 
    {
        if (confirmado) 
        {
            $scope.pieza.$delete(function() 
            {
                $location.url('/gestiondecontenidos');
            });
        }
        else 
        {
            $("#confirmarEliminar").modal('show');
        }
    };
    
    $scope.eliminarComentario = function(array,elemento) 
    {
        var indice = array.indexOf(elemento);
        if(indice!=-1) array.splice(indice, 1);
        $scope.pieza.$save();
    };
    
    $scope.editar = function(confirmado) 
    {
        if (confirmado) 
        {
            $scope.pieza.milisegundos = $scope.aMilisegundos($scope.pieza.fecha);
            $scope.pieza.$save();
        }
        else 
        {
            $("#ventanaEditar").modal('show');
        }
    };
    
    $scope.jurisdiccionPorId = function (id) 
	{
      for (var i = 0; i < $scope.jurisdicciones.length; i++) 
      {
          if ($scope.jurisdicciones[i]._id == id)
          {
              return $scope.jurisdicciones[i];
          }
      }  
    };
    
    $scope.agregarRelacion = function(relacion) 
    {
        if (!$scope.pieza.archivosRelacionados) 
        {
            $scope.pieza.archivosRelacionados = [];
        }
        $scope.pieza.archivosRelacionados.push(relacion);
        $scope.relacion = "";
    };
    
    $scope.eliminarListaElem = function(elemento, lista) 
    {
        lista.splice(lista.indexOf(elemento), 1);
    };
    
    $scope.devolverTema=function(tipo)
    {
        var tema="";
        switch(tipo) 
        {
            case "tipo1":
                tema="Gestión";
        break;
            case "tipo2":
                tema="E";
        break;
            
            case "tipo3":
                tema="iGestiòn";
        break;
        
        default:
                tema="";
        }

        return tema;
    };
    
    var hoy = new Date().getTime();

    $scope.aMilisegundos = function(fecha) 
    {
        if (fecha) 
        {
            var fechaDividida = fecha.split("/");
            var date = new Date(fechaDividida[2], fechaDividida[1] - 1, fechaDividida[0], 0, 0, 0, 0);
            return date.getTime();
        } 
        else 
        {
            return 0;
        }
    };

    $scope.compararMilisegundos=function(vencimiento)
    {
        var tiempoRestante=hoy-$scope.aMilisegundos(vencimiento);
        var color="";
        var diaEnMilisegundos=-86400000;
        
        if (tiempoRestante<0)
        {
            if(tiempoRestante<diaEnMilisegundos)
            {
                color="#58b058";
            }
            else
            {
                color="#fbae42";
            }
        }
        else
        {
            color="#c73e38";
        }
        
        return color;
    }
})
.controller("GestionDeContenidosInsertarMailCtrl", function($scope, Correos) 
{ 
    $scope.correos=Correos.query(); 
    $scope.correo=new Correos(); 
    $scope.nuevoCorreo = function() 
    { 
        var expr = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/; 
        if (expr.test($scope.correo.correo)) 
        { 
            $scope.correo.$save(); 
            $scope.correos=Correos.query(); 
            $scope.correo=new Correos(); 
        }
        else 
        { 
            alert("Ingrese correctamente el mail"); 
        }
    }; 
    $scope.borrarCorreo=function(id) 
    { 
        $scope.unCorreo=Correos.get({_id:id},function(){
            if(confirm("¿Desea eliminar el correo "+$scope.unCorreo.correo+"?")) 
            { 
                $scope.unCorreo.$delete(); 
                $scope.correos=Correos.query(); 
            } 
        }); 
        
    }; 
});
