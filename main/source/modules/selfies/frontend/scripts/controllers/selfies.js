angular.module('bag2.selfies', [])
.controller('selfiesIndexCtrl', function($scope, $routeParams, Selfies, $modal) {

    $scope.fotos = Selfies.query();

    $scope.abrirModalImagen = function(f) 
    {
        $scope.selfie = Selfies.get({_id : f._id});
        $modal({
            template: '/views/selfies/abrirModalImagen.html',
            show: true,
            backdrop: 'static',
            scope: angular.extend($scope.$new(), 
            { 
                foto: f.imagenes
            })
        });
    };
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
            $scope.data.fecha = new Date();
            $scope.data.usuario = $scope.username;
            $scope.selfie.comentarios.push($scope.data);
            $scope.selfie.$save({}, function() 
            {
                $scope.data.comentario="";
            });
        }
    };
    
    $scope.dameFecha = function(fecha) 
    {
        var f = new Date(fecha);
        var minutos;
        if (f.getMinutes() < 10) 
        {
            minutos = "0" + f.getMinutes();
        } 
        else 
        {
            minutos = f.getMinutes();
        }
        return (f.getDate() + "/" + (f.getMonth() +1) + "/" + f.getFullYear() + " - " + f.getHours() + ":" + minutos);
    };
    
    $scope.reverse = function(array) 
    {
        var copy = [].concat(array);
        return copy.reverse();
    };

    
    $scope.siguienteImagen=function(Foto)
    {   
        var siguiente={ifFoto:"",fecha:0};
        angular.forEach($scope.fotos, function (x) {
            if (x.fecha<Foto.fecha)
            {
                if(x.fecha>siguiente.fecha)
                {
                       siguiente=x; 
                }
            }
        });
        
        if(siguiente.fecha!=0)
        {
            $scope.abrirModalImagen(siguiente);
        }
    };
    
    $scope.anteriorImagen=function(Foto)
    {
        var siguiente={ifFoto:"",fecha:9999999999999};
        angular.forEach($scope.fotos, function (x) {
            if (x.fecha>Foto.fecha)
            {
                if(x.fecha<siguiente.fecha)
                {
                       siguiente=x; 
                }
            }
        });
        
        if(siguiente.fecha!=9999999999999)
        {
            $scope.abrirModalImagen(siguiente);             
        }
    };
    
    $scope.eliminarComentario = function(array,elemento) 
    {
        var indice = array.indexOf(elemento);
        if(indice!=-1) array.splice(indice, 1);
        $scope.selfie.$save();
    };
    
     $scope.eliminarImagen = function(elemento) 
    {
        elemento.$delete();
        $scope.fotos = Selfies.query();   
    };
    
    
})
.controller('selfiesNuevoCtrl', function($scope, $routeParams, Selfies)
{
    $scope.uploaded = [];
    $scope.selfies=new Selfies();

    $scope.guardar = function() 
    {
        $scope.selfies.comentarios=[];
        $scope.selfies.imagenes = $scope.uploaded.shift().id;
        $scope.selfies.fecha= new Date().getTime();
        $scope.selfies.$save();
	};
	
});

