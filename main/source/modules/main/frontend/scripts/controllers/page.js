'use strict';
angular.module('bag2.page', []).controller('PageCtrl', function($scope, $location, auth, checkUrl, $state) {
    if ($scope.statesLoaded) {
        $state.transitionTo('dashboard');
        // $location.url('/apps');
    }
    else {
        $scope.$on('states-loaded', function() {
            $state.transitionTo('dashboard');
            // $location.url('/apps');
        });
    }
    
    
    //Toma la foto, muestra el modal con la imagen y vuelve a mostrar el botón.
    $scope.tomarCaptura = function(){;
        var html2obj = html2canvas($('#body'));
        var queue  = html2obj.parse();
        $scope.canvas = html2obj.render(queue);
        $scope.capturaPantalla = $scope.canvas.toDataURL();
        $("#verFoto").modal('show'); 
        var obj= document.getElementById('boton');
        obj.style.display= "block";
    };
    
    //Oculta el botón.
    $scope.ocultar= function(){
        var obj= document.getElementById('boton');
        obj.style.display= "none";
        $scope.tomarCaptura();
    }
    
    // Descarga la imagen.
    $scope.guardarCaptura = function (fileURL, fileName) {
    // Para cualquier navegador.
    if (!window.ActiveXObject) {
        var save = document.createElement('a');
        save.href = fileURL;
        save.target = '_blank';
        save.download = fileName || 'unknown';

        var event = document.createEvent('Event');
        event.initEvent('click', true, true);
        save.dispatchEvent(event);
        (window.URL || window.webkitURL).revokeObjectURL(save.href);
    }

    // Para Internet Explorer (*_*)
    else if ( !! window.ActiveXObject && document.execCommand)     {
        var _window = window.open(fileURL, '_blank');
        _window.document.close();
        _window.document.execCommand('SaveAs', true, fileName || fileURL)
        _window.close();
        }
    }
    
    
});