angular.module('bag2.bawiki', [])
.controller ('BAWikiCtrl', function($scope, BAWiki, BarrioRegularizacionDominial, $modal) 
{
    $scope.wikis = BAWiki.query();
    var hoy=new Date().getTime();
    var milisegundosEnDia=86400000;
    
    $scope.barrios=BarrioRegularizacionDominial.query({});
    
    $scope.filtroFin=function(barrio)
    {
       if($scope.filtroComunas!=null && $scope.filtroComunas.length>0)
       {
          if( $scope.filtroComunas.indexOf(barrio.comuna) >= 0 )
         {
            return true;
         }
         else
         {
            return false;
         }
       }
       else
       {
          return true;
       }
    };
    
    $scope.filtroBarrioYComuna=function(registro)
    {
       var tamannoFiltroComunas=0,
            tamannoFiltroBarrios=0;
            
      try{
         tamannoFiltroComunas=$scope.filtroComunas.length;
         tamannoFiltroBarrios=$scope.filtroBarrios.length;
      }
      catch(e)
      {
         
      }
       try
       {
          if( (tamannoFiltroComunas>0) && (tamannoFiltroBarrios>0) )
          {
             for(var i=0; i<tamannoFiltroComunas; i++)
             {
                for(var j=0; j<registro.comunas.length; j++)
                {
                   if(registro.comunas[j]==$scope.filtroComunas[i])
                   {
                      for(var x=0; x<tamannoFiltroBarrios; x++)
                      {
                         for(var y=0; y<registro.barrios.length; y++)
                         {
                            if(registro.barrios[y]==$scope.filtroBarrios[x])
                            {
                               return true;
                            }
                         }
                      }
                   }
                }
             }
             return false;
          }
          else if (tamannoFiltroBarrios>0)
          {
             for(var x=0; x<tamannoFiltroBarrios; x++)
             {
                for(var y=0; y<registro.barrios.length; y++)
                {
                   if(registro.barrios[y]==$scope.filtroBarrios[x])
                   {
                      return true;
                   }
                }
             }
             return false;
          }
          else if(tamannoFiltroComunas>0)
          {
            for(var i=0; i<tamannoFiltroComunas; i++)
             {

                for(var j=0; j<registro.comunas.length; j++)
                {
                   if(registro.comunas[j]==$scope.filtroComunas[i])
                   {
                      return true;
                   }
                }
             }
             return false;
          }
          else
          {
             return true;
          }
       }
       catch(e)
       {
          return true;
       }
       
    };
    
    $scope.dameFecha = function(fecha) 
    {
        var f = new Date(fecha);
        var day=f.getDate();
        var month=f.getMonth()+1;
        
        return ( (day<10?"0"+day:day) + "/" + (month<10?"0"+month:month) + "/" + f.getFullYear());
    };
    
    $scope.dameClase=function(fechaVencimiento)
    {
       fechaVencimiento=$scope.aMilisegundos(fechaVencimiento);
       
       var tiempoRestante=fechaVencimiento-hoy;
       
       if( (tiempoRestante)>=(milisegundosEnDia*3) )
       {
          return "btn-success";
       }
       else if( (tiempoRestante)<0  )
       {
          return "btn-danger";
       }
       else
       {
          return "btn-warning";
       }
    };
    
    $scope.aMilisegundos = function(fecha) 
    {
       if(fecha)
       {
            var fechaDividida = fecha.split("/");
           var date = new Date(fechaDividida[2], fechaDividida[1] - 1, fechaDividida[0], 0, 0, 0, 0);
           return date.getTime();
       }
       else
       {
          return (31104000000*60); //1año*60=Fecha en el 2030
       }
        
    };

    $scope.abrirModalPrevia = function(wikiT) 
    {
       $scope.modalPrevio = angular.copy(wikiT);
       
         $("#modalVistaPrevia").modal('show');
         //Cuando el modal este cargado
         $('#modalVistaPrevia').on('shown', function () {
             $scope.pdf  = new PDFObject({ url: "/file/" + wikiT.vistaPrevia.pdf}).embed("verPDF");
         });   
    };
    
})
.controller ('BAWikiNuevoCtrl', function($scope, BAWiki, $location, BarrioRegularizacionDominial) 
{
    $scope.barrios=BarrioRegularizacionDominial.query({});
    
    $scope.wiki=new BAWiki({
       documentos:[],
       fuentes:[],
       barrios:[],
       comunas:[],
       tags:""
       });
    var hoy=new Date();
    hoy= hoy.getTime();
    $scope.uploadedFile = [];
    $scope.uploadedFilePrevio=[];
    
    $scope.vaciarId=function($event)
    {
       if($event.keyCode === 13 || $event.which===13)
       {
          $scope.nuevaFuenteInformacion=""; 
       }
    };
    
    $scope.filtroFin=function(barrio)
    {
       if($scope.wiki.comunas.length>0)
       {
          if( $scope.wiki.comunas.indexOf(barrio.comuna) >= 0 )
         {
            return true;
         }
         else
         {
            return false;
         }
       }
      else
      {
         return true;
      }
      
    };
    
    $scope.eliminarRegistro = function(elemento, lista) 
    {
        lista.splice(lista.indexOf(elemento), 1);
    };
    
      $scope.agregarRegistro = function(valor,lista, $event)
       {//Recordar inicializar el array previamente en el new, y eliminar el campo desde el html
            var keyCode=0;
            try{
               keyCode = $event.which || $event.keyCode;
            }
            catch(e)
            {}
            if(keyCode===13 || !keyCode){
               if(!lista){
                  lista=[];
              }
              if(valor!==""){
                  lista.push(valor);
              }
              else{
                  alert("Ingrese un valor en el campo");
              }
            }
       };
    
    $scope.retornarLink=function(fuente, valor)
    {
      var expresion= /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \?=.-]*)*\/?$/;
      
      if(valor==1)
      {
         if(expresion.test(fuente))
         {
            var ubicacion=fuente.indexOf("www");
            if( !ubicacion )
            {
               fuente="http://"+fuente;
            }
            else if(ubicacion<0)
            {
               fuente="http://www."+fuente;
            }
            
            return fuente;
         }
         else
         {
            return "#";
         }
      }
      else
      {
         if(expresion.test(fuente))
         {
            return "_blank";
         }
         else
         {
            return "";
         }
      }
      
    };
    
    $scope.agregarDocumentacion = function(){
        if ($scope.documento.nombre.length > 0){
            $scope.documento.documentoId=$scope.uploadedFile.shift().id;
            $scope.wiki.documentos.push($scope.documento);
            $scope.wiki.$save(function(){
                $scope.documento.nombre = "";
            });
        }
    };
    
    $scope.agregarDocPrevio=function(formato)
    {
       if(formato==2)
       {
          $scope.wiki.vistaPrevia.pdf=$scope.uploadedFilePrevio.shift().id;
       }
       else if(formato==3)
       {
          $scope.wiki.vistaPrevia.imagen=$scope.uploadedFilePrevio.shift().id;
       }
       
    };
    
    $scope.eliminarEnArray = function(array, elemento, campo){
        
        if(confirm("Estás seguro/a que deseas eliminar el "+campo+"?")){
            var indice = array.indexOf(elemento);
            if(indice!=-1) array.splice(indice, 1);
            $scope.wiki.$save();    
        }
        
    };
    
    $scope.guardar = function(){
        if ($scope.wiki.nombre || $scope.wiki.html){
            $scope.wiki.comentarios = [];
            $scope.wiki.fecha=hoy;
            $scope.wiki.$save();
            $location.url("bawiki");
        }
    };
    
    $scope.eliminar=function()
    {
        if(confirm("Estás seguro/a que deseas eliminar la wiki?"))
        {
            $scope.wiki.$delete(function(){
                $location.url("/bawiki");
            });
        }
    };
})
.controller ('BAWikiDetalleCtrl', function($scope, BAWiki, $location, $routeParams, BarrioRegularizacionDominial) 
{
   $scope.barrios=BarrioRegularizacionDominial.query({});
    var wikiReserva;
    $scope.wiki = BAWiki.get({_id:$routeParams._id},function(){
        wikiReserva = angular.copy($scope.wiki);
    });
    $scope.uploadedFile = [];
    $scope.uploadedFilePrevio=[];
    
    $scope.guardar = function(){
        $scope.wiki.$save();
        $scope.editando=false;
    };
    
    $scope.eliminarRegistro = function(elemento, lista) 
    {
        lista.splice(lista.indexOf(elemento), 1);
    };
    
    $scope.vaciarId=function($event)
    {
       if($event.keyCode === 13 || $event.which===13)
       {
          $scope.nuevaFuenteInformacion=""; 
       }
    };
    
    $scope.agregarRegistro = function(valor,lista, $event)
       {//Recordar inicializar el array previamente en el new, y eliminar el campo desde el html
            var keyCode=0;
            try{
               keyCode = $event.which || $event.keyCode;
            }
            catch(e)
            {}
            if(keyCode===13 || !keyCode){
               if(!lista){
                  lista=[];
              }
              if(valor!==""){
                  lista.push(valor);
              }
              else{
                  alert("Ingrese un valor en el campo");
              }
            }
    };
    
    $scope.dameFecha = function(fecha, hora) 
    {
        var f = new Date(fecha);
        
        var minutes=f.getMinutes(),
         hours=f.getHours(),
         day=f.getDate(),
         month=f.getMonth()+1;
        
        if (hora){
            return ( (day<10?"0"+day:day) + "/" + (month<10?"0"+month:month) + "/" + f.getFullYear());
        } else {
            return ( (day<10?"0"+day:day) + "/" + (month<10?"0"+month:month) + "/" + f.getFullYear() + " - " + (hours<10?"0"+hours:hours) + ":" + (minutes<10?"0"+minutes:minutes));
        }
    };
    
    $scope.retornarLink=function(fuente, valor)
    {
      var expresion= /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \?=.-]*)*\/?$/;
      
      if(valor==1)
      {
         if(expresion.test(fuente))
         {
            var ubicacion=fuente.indexOf("www");
            if( !ubicacion )
            {
               fuente="http://"+fuente;
            }
            else if(ubicacion<0)
            {
               fuente="http://www."+fuente;
            }
            
            return fuente;
         }
         else
         {
            return "#";
         }
      }
      else
      {
         if(expresion.test(fuente))
         {
            return "_blank";
         }
         else
         {
            return "";
         }
      }
    };
    
    $scope.filtroFin=function(barrio)
    {
       if($scope.wiki.comunas.length>0)
       {
          if( $scope.wiki.comunas.indexOf(barrio.comuna) >= 0 )
         {
            return true;
         }
         else
         {
            return false;
         }
       }
      else
      {
         return true;
      }
      
    };
    
    $scope.enviarComentario = function(){
        if ($scope.data.comentario.length > 0){
            $scope.data.usuario = $scope.username;
            $scope.data.fecha = new Date().getTime();
            $scope.wiki.comentarios.push($scope.data);
            $scope.wiki.$save(function(){
                
                $scope.data.comentario = "";
            });
        }
    };
    
    $scope.eliminarEnArray = function(array, elemento, campo){
        
        if(confirm("Estás seguro/a que deseas eliminar el "+campo+"?")){
            var indice = array.indexOf(elemento);
            if(indice!=-1) array.splice(indice, 1);
            $scope.wiki.$save();    
        }
        
    };

    $scope.agregarDocumentacion = function(){
        if ($scope.documento.nombre.length > 0){
            
            $scope.documento.documentoId=$scope.uploadedFile.shift().id;
            $scope.wiki.documentos.push($scope.documento);
            $scope.wiki.$save(function(){
                
                $scope.documento.nombre = "";
            });

        }
    };
    
    $scope.agregarDocPrevio=function(formato)
    {
       if(formato==2)
       {
          $scope.wiki.vistaPrevia.pdf=$scope.uploadedFilePrevio.shift().id;
       }
       else if(formato==3)
       {
          $scope.wiki.vistaPrevia.imagen=$scope.uploadedFilePrevio.shift().id;
       }
       
    };

    $scope.cancelar = function(){
        if (confirm("Estás seguro/a que deseas cancelar los cambios?"))
        {
            $scope.wiki=wikiReserva;
            $scope.guardar();
            $location.url("/bawiki");
        } 
    };
    
    $scope.eliminar=function(){
        if(confirm("Estás seguro/a que deseas eliminar la wiki?"))
        {
            $scope.wiki.$delete(function(){
            $location.url("/bawiki");
            });  
        }
    };
});

