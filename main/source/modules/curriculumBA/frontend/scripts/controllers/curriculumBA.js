angular.module('bag2.curriculumBA', [])
.controller('CurriculumBACtrl', function($scope,RHResumeTool) {
    $scope.cvs= RHResumeTool.query();
    
    $scope.aMilisegundos = function(fecha) 
    {
        var fechaDividida = fecha.split("/");
        var date = new Date(fechaDividida[2], fechaDividida[1] - 1, fechaDividida[0], 0, 0, 0, 0);
        return date.getTime();
    };
    
    $scope.fechaActual = new Date().getTime();
    $scope.annoEnMili=31556900000; 
    
    $scope.filtroFin = function(ba) 
    {
        var edadMinima = $scope.edadMinima*$scope.annoEnMili;
        var compararFechaMinima= $scope.fechaActual-edadMinima;
        var edadMaxima = $scope.edadMaxima*$scope.annoEnMili;
        var compararFechaMaxima= $scope.fechaActual-edadMaxima;
        if($scope.edadMinima && $scope.edadMaxima)
        {
            if(ba.fechaNacimientoMiliseg<=compararFechaMinima && ba.fechaNacimientoMiliseg>=compararFechaMaxima)
            {
                return true;
            }
            else
            {
                return false;
            }
        }
        else if($scope.edadMinima)
        {
            if(ba.fechaNacimientoMiliseg<=compararFechaMinima)
            {
                return true;
            }
            else
            {
                return false;
            }
        }
        else if($scope.edadMaxima)
        {
            if(ba.fechaNacimientoMiliseg>=compararFechaMaxima)
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
     
})
.controller('CurriculumBANuevoCtrl', function($scope, RHResumeTool) {

    $scope.cv=new RHResumeTool();
    $scope.uploaded = [];
    
    $scope.aMilisegundos = function(fecha) 
    {
        var fechaDividida = fecha.split("/");
        var date = new Date(fechaDividida[2], fechaDividida[1] - 1, fechaDividida[0], 0, 0, 0, 0);
        return date.getTime();
    };
    
    $scope.guardar=function()
    {
        if ($scope.uploaded.length) {
            $scope.cv.archivoId = $scope.uploaded.shift().id;
        }
        if($scope.cv.fechaNacimiento)
        {
            $scope.cv.fechaNacimientoMiliseg= $scope.aMilisegundos($scope.cv.fechaNacimiento);
        }
        else
        {
            $scope.cv.fechaNacimientoMiliseg=0;
        }
        
        $scope.cv.$save();
    };


    $scope.agregarIdioma=function(valorIdioma)
    {   
        if (!$scope.cv.idiomas) 
        {
            $scope.cv.idiomas = [];
        }
        
        if($scope.cv.idiomas.length<=5)
        {
            $scope.cv.idiomas.push(valorIdioma);
        }
        else
        {
            alert("Ya ingreso todos los posibles");
        }
        
        $scope.valorIdioma = "";
    };
    
    $scope.agregarSistema=function(valorSistema)
    {   
        if (!$scope.cv.sistemas) 
        {
            $scope.cv.sistemas = [];
        }
        
        $scope.cv.sistemas.push(valorSistema);
        
        $scope.valorSistemas = "";
    };
    
    $scope.agregarEstudios=function(valorEst)
    {
        if (!$scope.cv.estudios) 
        {
            $scope.cv.estudios = [];
        }
        $scope.cv.estudios.push(valorEst);
        $scope.estudios = "";
    };
    
    $scope.agregarReferencia=function(valorReferencia)
    {   
        if (!$scope.cv.referencias) 
        {
            $scope.cv.referencias = [];
        }
        
        $scope.cv.referencias.push(valorReferencia);
        
        $scope.referencias = "";
    };
    
    $scope.agregarExperiencia=function(valorExp)
    {
        if(!$scope.cv.experiencias) 
        {
            $scope.cv.experiencias=[];
        }
        $scope.cv.experiencias.push(valorExp);
        $scope.valorExperiencia="";
    };
    

 
    $scope.eliminarIdioma = function(elemento, lista) 
    {
        lista.splice(lista.indexOf(elemento), 1);
    };
    

})
.controller('CurriculumBADetalleCtrl',function($scope,RHResumeTool,$routeParams,$location){
    $scope.cv = RHResumeTool.get({_id: $routeParams._id});
    $scope.uploaded = [];

    $scope.agregarIdioma=function(valorIdiomas)
    {   
        if (!$scope.cv.idiomas) 
        {
            $scope.cv.idiomas = [];
        }
        
        if($scope.cv.idiomas.length<=5)
        {
            $scope.cv.idiomas.push(valorIdiomas);
        }
        else
        {
            alert("Ya ingreso todos los posibles");
        }
        
        $scope.valorIdioma = "";
    };

    $scope.eliminarIdioma = function(elemento, lista) 
    {
        lista.splice(lista.indexOf(elemento), 1);
    };
    
    $scope.agregarReferencia=function(valorReferencia)
    {   
        if (!$scope.cv.referencias) 
        {
            $scope.cv.referencias = [];
        }
        
        $scope.cv.referencias.push(valorReferencia);
        
        $scope.referencias = "";
    };
    
    $scope.agregarExp=function(valorOtrasExp)
    {
        if(!$scope.cv.otrasExperiencias)  
        {
            $scope.cv.otrasExperiencias=[];
        }
        $scope.cv.otrasExperiencias.push(valorOtrasExp);
        $scope.valorOtrasExperiencias="";
    };
    
    $scope.agregarEstudios=function(valorEst)
    {
        if (!$scope.cv.estudios) 
        {
            $scope.cv.estudios = [];
        }
        $scope.cv.estudios.push(valorEst);
        $scope.estudios = "";
        
    };

    $scope.agregarSistema=function(valorSistema)
    {   
        if (!$scope.cv.sistemas) 
        {
            $scope.cv.sistemas = [];
        }
        
        $scope.cv.sistemas.push(valorSistema);
        
        $scope.valorSistemas = "";
    };
    
    $scope.agregarExperiencia=function(valorExp)
    {
        if(!$scope.cv.experiencias) 
        {
            $scope.cv.experiencias=[];
        }
        $scope.cv.experiencias.push(valorExp);
        $scope.valorExperiencia="";
    };
    
    $scope.aMilisegundos = function(fecha) 
    {
        var fechaDividida = fecha.split("/");
        var date = new Date(fechaDividida[2], fechaDividida[1] - 1, fechaDividida[0], 0, 0, 0, 0);
        return date.getTime();
    };
    
    $scope.guardar=function()
    {
        if ($scope.uploaded.length) {
            $scope.cv.archivoId = $scope.uploaded.shift().id;
        }
        if($scope.cv.fechaNacimiento)
        {
            $scope.cv.fechaNacimientoMiliseg= $scope.aMilisegundos($scope.cv.fechaNacimiento);
        }
        else
        {
            $scope.cv.fechaNacimientoMiliseg=0;
        }
        $scope.cv.$save();
    };
    
    $scope.eliminar = function(confirmado) 
    {
        if (confirmado) 
        {
            $scope.cv.$delete(function() 
            {
                $location.url('/curriculumBA');
            });
        }
        else 
        {
            $("#confirmarEliminar").modal('show');
        }
    };
    
    $scope.editar = function()
    {
      $scope.editando=true;  
    };
})
.controller('CurriculumBAImprimirCtrl', function($scope,RHResumeTool,$routeParams, $window) {
    $scope.cv = RHResumeTool.get({_id : $routeParams._id});
    
    $scope.imprimir = function() {
        $window.print();
    };
});



















