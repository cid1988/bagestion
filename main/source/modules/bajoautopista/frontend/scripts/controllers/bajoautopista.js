angular.module('bag2.bajoautopista', [])
.controller('BajoAutopistaCtrl', function($scope, $location, $http, BajoAutopista, $window, ORMOrganigrama, User, Comuna, $modal, $routeParams) {
    
    $scope.aMilisegundos = function(fecha) {
        var fechaDividida = fecha.split("/");
        var date = new Date(fechaDividida[2], fechaDividida[1] - 1, fechaDividida[0], 12, 0, 0, 0);
        return date.getTime();
    };

    $scope.soloNumeros = function(cadenaAnalizar) {
        var nuevoString = "";
        for (var i = 0; i< cadenaAnalizar.length; i++) {
             var caracter = cadenaAnalizar.charAt(i);
             if( caracter == "0" || caracter == "1" || caracter == "2" || caracter == "3" || caracter == "4" || caracter == "5" || caracter == "6" || caracter == "7" || caracter == "8" || caracter == "9") {
                nuevoString = nuevoString + caracter;
              }
        }
        return nuevoString;
    };
    
    $scope.puntitos = function(number) {
        if (number) {
            var result = '';
            while( number.length > 3 )
            {
             result = '.' + number.substr(number.length - 3) + result;
             number = number.substring(0, number.length - 3);
            }
            result = number + result;
            return result;
        } else {
            return "";
        }
    };
    
	$scope.bajoautopistas = BajoAutopista.query({}, function() {
        angular.forEach($scope.bajoautopistas, function (b){
            if (b.fechaFin) {
                b.finMilisegundos = $scope.aMilisegundos(b.fechaFin);
            } else {
                b.finMilisegundos = 0;
            }
            if (b.superficieTotal) {
                b.supNumero = parseInt($scope.soloNumeros(b.superficieTotal));
            } else {
                b.supNumero = 0;
            }
        });
	});
	$scope.comunas = Comuna.query();
	$scope.organigrama = ORMOrganigrama.query();
    $scope.orden = 'numero';
	$scope.autopistas = ['AU1 25 de Mayo', 'AU6 Perito Moreno', 'AU Dellepiane', 'AU Ilia', 'AU Frondizi (9 de Julio Sur)', 'AU7 Campora', 'AU Buenos Aires - La Plata'];
	
    $scope.fecha = {
        desde : "",
        hasta : ""
    };
    
    var h = new Date();
    var d = new Date(1900, 1, 1, 0, 0, 0, 0);
    
    $scope.$watch('fecha.desde', function (fecha){
        if (fecha) {
            d = new Date(fecha.slice(6), fecha.slice(3,5)-1, fecha.slice(0,2), 0, 0, 0, 0);
        }
        
    });
    
    $scope.$watch('fecha.hasta', function (fecha2){
        if (fecha2) {
            h = new Date(fecha2.slice(6), fecha2.slice(3,5)-1, fecha2.slice(0,2), 0, 0, 0, 0);
        }
    });
    
    $scope.filtroSup = function(ba) {
        if ($scope.superficieTotal1 && $scope.superficieTotal2) {
            if ((ba.supNumero >= $scope.superficieTotal1) && (ba.supNumero <= $scope.superficieTotal2)) {
                return true;
            } else {
                return false;
            }
        } else if ($scope.superficieTotal1) {
            if (ba.supNumero >= $scope.superficieTotal1) {
                return true;
            } else {
                return false;
            }
        } else if ($scope.superficieTotal2) {
            if (ba.supNumero <= $scope.superficieTotal2) {
                return true;
            } else {
                return false;
            }
        } else {
            return true;
        }
    };
    
    $scope.imprimir = function() {
        $window.print();
    };
    
    $scope.filtroFin = function(ba) {
        if ($scope.fechaFDesde && $scope.fechaFHasta) {
            if ((ba.finMilisegundos >= $scope.aMilisegundos($scope.fechaFDesde)) && (ba.finMilisegundos <= $scope.aMilisegundos($scope.fechaFHasta))) {
                return true;
            } else {
                return false;
            }
        } else if ($scope.fechaFDesde) {
            if (ba.finMilisegundos >= $scope.aMilisegundos($scope.fechaFDesde)) {
                return true;
            } else {
                return false;
            }
        } else if ($scope.fechaFHasta) {
            if (ba.finMilisegundos <= $scope.aMilisegundos($scope.fechaFHasta)) {
                return true;
            } else {
                return false;
            }
        } else {
            return true;
        }
    };
    
    $scope.seleccionado = false;
    
    $scope.comunaPorId = function (id) {
      for (var i = 0; i < $scope.comunas.length; i++) {
          if ($scope.comunas[i]._id == id)
          {
              return $scope.comunas[i];
          }
      }  
    };
    
    $scope.$on('volver', function(event, accept) {
        $scope.seleccionado = false;
    });
    
    if($routeParams.idObjeto)
    {
        $scope.bajoautopista=BajoAutopista.get({_id:$routeParams.idObjeto});
        $scope.seleccionado = true;
    }
    
    $scope.seleccionar = function (i) {
        $scope.bajoautopista = i;
        $scope.seleccionado = true;
    };
    
    $scope.organigramaPorId = function (id) {
      for (var i = 0; i < $scope.organigrama.length; i++) {
          if ($scope.organigrama[i]._id == id)
          {
              return $scope.organigrama[i];
          }
      }  
    };
    
    /*
    $scope.arreglarParcelas = function () {
        angular.forEach($scope.bajoautopistas, function (b){
            if (b.smp) {
                angular.forEach(b.smp, function (s){
                    if (s.seccion && s.manzana && s.parcela) {
                        if (s.seccion.length == 1) {
                            s.seccion = "0" + s.seccion;
                        }
                        if ((s.manzana.replace(/[^\d]/g,'')).length == 2) {
                            s.manzana = "0" + s.manzana;
                        } else if ((s.manzana.replace(/[^\d]/g,'')).length == 1) {
                            s.manzana = "00" + s.manzana;
                        }
                        if ((s.parcela.replace(/[^\d]/g,'')).length == 2) {
                            s.parcela = "0" + s.parcela;
                        } else if ((s.parcela.replace(/[^\d]/g,'')).toString().length == 1) {
                            s.parcela = "00" + s.parcela;
                        }
                        s.manzana = (s.manzana.toUpperCase()).replace(/\s/g,'');
                        s.parcela = (s.parcela.toUpperCase()).replace(/\s/g,'');
                    }
                });
                b.$save();
            }
        }); 
    }; */
    
	$http.get('/scripts/calles.js')
	.success(function (calles) {
	  $scope.calles = calles;
	});
})
.controller('BajoAutopistaNuevoCtrl', function($scope, $location, $http, BajoAutopista, ORMOrganigrama, Comuna, ORMTema, User, $modal, $routeParams) {
	$scope.bajoautopista = new BajoAutopista();
	$scope.temas = ORMTema.query();
	$scope.comunas = Comuna.query();
	$scope.organigrama = ORMOrganigrama.query();
	$scope.autopistas = ['AU1 25 de Mayo', 'AU6 Perito Moreno', 'AU Dellepiane', 'AU Ilia', 'AU Frondizi (9 de Julio Sur)', 'AU7 Campora', 'AU Buenos Aires - La Plata'];
	$scope.uploadedDocu = [];
	$scope.uploaded = [];

    $scope.comunaPorId = function (id) {
      for (var i = 0; i < $scope.comunas.length; i++) {
          if ($scope.comunas[i]._id == id)
          {
              return $scope.comunas[i];
          }
      }  
    };
    
    $scope.mostrarTema = function (r) {
        if (r.eliminado) {
            return false; 
        } else {
            return true;
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
    
    $scope.agregarComen = function(confirmado, data) {
        if (confirmado) {
            $scope.bajoautopista.comentarios.push(data);
        }
        else {
            if (!$scope.bajoautopista.comentarios){
                $scope.bajoautopista.comentarios = [];
            }
            var modalScope = $scope.$new();
            
            modalScope.data = {
                descripcion: '',
                cuando:undefined
            };
            $modal({template: '/views/bajoautopista/agregarComentario.html', persist: true, show: true, backdrop: 'static', scope: modalScope});
        }
    };
    
    $scope.$watch("bajoautopista.smp.length", function () {
        $scope.calcularSupTotal();
    });
    
    $scope.calcularSupTotal = function () {
        if (!$scope.bajoautopista.smp) return;
	    $scope.superficieTotalUsig = 0;
        angular.forEach($scope.bajoautopista.smp, function (b){
            var parcela = b.seccion + "-" + b.manzana + "-" + b.parcela;
            $http.post("/api/usig/consultar-smp", {smp: parcela})
            .success(function (dataUsig) {
                if (dataUsig.info.info_alfanumerica.superficie_total) {
                    $scope.superficieTotalUsig = $scope.superficieTotalUsig + parseInt(dataUsig.info.info_alfanumerica.superficie_total);
                }
            });
            
        });
    };
    
    $scope.agregarDocumentacion = function(confirmado, data) {
        if (confirmado) {
            data.archivoId = $scope.uploadedDocu.shift().id;
            $scope.bajoautopista.documentos.push(data);
            //showAlert('Se agrego una observación');
        }
        else {
            if ($scope.bajoautopista.documentos === undefined) {
                $scope.bajoautopista.documentos = [];
            }
            var modalScope = $scope.$new();
            
            modalScope.data = {
                descripcion: '',
                fecha: undefined,
                fuente: ''
            };
            $modal({template: '/views/bajoautopista/agregarDocumento.html', persist: true, show: true, backdrop: 'static', scope: modalScope});
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
    
    //Agregar temas
    $scope.agregarTema = function(dataTema) {
        if (!$scope.bajoautopista.temas) {
            $scope.bajoautopista.temas = [];
        }
        $scope.bajoautopista.temas.push(dataTema);
        $scope.dataTema = "";
    };
    
    //Agregar Seccion manzana parcela
    $scope.agregarSMP = function(dataParce) {
        if (!$scope.bajoautopista.smp) {
            $scope.bajoautopista.smp = [];
        }
        $scope.bajoautopista.smp.push(dataParce);
        $scope.dataParce = {
            seccion : '',
            manzana : '',
            parcela : '',
            parcial : false,
        };
    };
    
    $scope.uploaded = [];
    $scope.$watch('uploaded[0].id', function(newValue) {
        if (!newValue) {
            return;
        }
        if ($scope.bajoautopista) {
            if ($scope.bajoautopista.fotos === undefined) {
                $scope.bajoautopista.fotos = [];
            }
            $scope.bajoautopista.fotos.push($scope.uploaded.shift().id);
        }
    });
    
    $scope.abrirModalImagen = function(foto) {
        $modal({
            template: '/views/bajoautopista/abrirModalImagen.html',
            show: true,
            backdrop: 'static',
            scope: angular.extend($scope.$new(), {
                foto: foto
            })
        });
    };
    
    $scope.abrirModalImagenUsig = function(s, m, p) {
        $modal({
            template: '/views/bajoautopista/abrirModalImagenUsig.html',
            show: true,
            backdrop: 'static',
            scope: angular.extend($scope.$new(), {
                s : s,
                m : m,
                p : p
            })
        });
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
	
	$scope.guardar = function() {
        $scope.bajoautopista.$save();
	};
})
.controller('BajoAutopistaDetalleCtrl', function($scope, $location, $http, BajoAutopista, Comuna, ORMOrganigrama, ORMTema, User, $modal, $routeParams, $rootScope) {
    
    /*$scope.bajoautopista = BajoAutopista.get({
        _id : $routeParams._id
    }); */
	$scope.temas = ORMTema.query();
	$scope.comunas = Comuna.query();
	$scope.organigrama = ORMOrganigrama.query();
	$scope.autopistas = ['AU1 25 de Mayo', 'AU6 Perito Moreno', 'AU Dellepiane', 'AU Ilia', 'AU Frondizi (9 de Julio Sur)', 'AU7 Campora', 'AU Buenos Aires - La Plata'];
	$scope.uploadedDocu = [];
	$scope.uploaded = [];
    
    $scope.comunaPorId = function (id) {
      for (var i = 0; i < $scope.comunas.length; i++) {
          if ($scope.comunas[i]._id == id)
          {
              return $scope.comunas[i];
          }
      }  
    };
    
    $scope.mostrarTema = function (r) {
        if (r.eliminado) {
            return false; 
        } else {
            return true;
        }
    };
    
    $scope.$watch("bajoautopista.smp.length", function () {
        $scope.calcularSupTotal();
    });
    
    $scope.calcularSupTotal = function () {
        if (!$scope.bajoautopista.smp) return;
	    $scope.superficieTotalUsig = 0;
        angular.forEach($scope.bajoautopista.smp, function (b){
            var parcela = b.seccion + "-" + b.manzana + "-" + b.parcela;
            $http.post("/api/usig/consultar-smp", {smp: parcela})
            .success(function (dataUsig) {
                if (dataUsig.info.info_alfanumerica.superficie_total) {
                    $scope.superficieTotalUsig = $scope.superficieTotalUsig + parseInt(dataUsig.info.info_alfanumerica.superficie_total);
                }
            });
            
        });
    };
    
    
    $scope.organigramaPorId = function (id) {
      for (var i = 0; i < $scope.organigrama.length; i++) {
          if ($scope.organigrama[i]._id == id)
          {
              return $scope.organigrama[i];
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
    
    //Agregar temas
    $scope.agregarTema = function(dataTema) {
        if (!$scope.bajoautopista.temas) {
            $scope.bajoautopista.temas = [];
        }
        $scope.bajoautopista.temas.push(dataTema);
        $scope.dataTema = "";
    };
    
    //Agregar Seccion manzana parcela
    $scope.agregarSMP = function(dataParce) {
        if (!$scope.bajoautopista.smp) {
            $scope.bajoautopista.smp = [];
        }
        $scope.bajoautopista.smp.push(dataParce);
        $scope.dataParce = {
            seccion : '',
            manzana : '',
            parcela : '',
            parcial : false,
        };
    };
    
    $scope.agregarDocumentacion = function(confirmado, data) {
        if (confirmado) {
            data.archivoId = $scope.uploadedDocu.shift().id;
            $scope.bajoautopista.documentos.push(data);
            //showAlert('Se agrego una observación');
        }
        else {
            if ($scope.bajoautopista.documentos === undefined) {
                $scope.bajoautopista.documentos = [];
            }
            var modalScope = $scope.$new();
            
            modalScope.data = {
                descripcion: '',
                fecha: undefined,
                fuente: ''
            };
            $modal({template: '/views/bajoautopista/agregarDocumento.html', persist: true, show: true, backdrop: 'static', scope: modalScope});
        }
    };
    
    $scope.eliminarListaElem = function(elemento, lista) {
        lista.splice(lista.indexOf(elemento), 1);
    };
    
    $scope.reverse = function(array) {
        var copy = [].concat(array);
        return copy.reverse();
    };
    
    $scope.abrirModalImagen = function(foto) {
        $modal({
            template: '/views/bajoautopista/abrirModalImagen.html',
            show: true,
            backdrop: 'static',
            scope: angular.extend($scope.$new(), {
                foto: foto
            })
        });
    };
    
    $scope.abrirModalImagenUsig = function(s, m, p) {
        $modal({
            template: '/views/bajoautopista/abrirModalImagenUsig.html',
            show: true,
            backdrop: 'static',
            scope: angular.extend($scope.$new(), {
                s : s,
                m : m,
                p : p
            })
        });
    };
    
    $scope.agregarComen = function(confirmado, data) {
        if (confirmado) {
            $scope.bajoautopista.comentarios.push(data);
        }
        else {
            if (!$scope.bajoautopista.comentarios){
                $scope.bajoautopista.comentarios = [];
            }
            var modalScope = $scope.$new();
            
            modalScope.data = {
                descripcion: '',
                cuando:undefined
            };
            $modal({template: '/views/bajoautopista/agregarComentario.html', persist: true, show: true, backdrop: 'static', scope: modalScope});
        }
    };
    
    $scope.uploaded = [];
    $scope.$watch('uploaded[0].id', function(newValue) {
        if (!newValue) {
            return;
        }
        if ($scope.bajoautopista) {
            if ($scope.bajoautopista.fotos === undefined) {
                $scope.bajoautopista.fotos = [];
            }
            $scope.bajoautopista.fotos.push($scope.uploaded.shift().id);
        }
    });
    
    $scope.guardar = function(){
        $scope.bajoautopista.$save({}, function() {
            $scope.editando = false;
        });
    };
    
    $scope.eliminarElemento = function(array,elemento) {
        var indice = array.indexOf(elemento);
        if(indice!=-1) array.splice(indice, 1);
    };
    
    $scope.eliminar = function(confirmado) {
        if (confirmado) {
            $scope.bajoautopista.$delete(function() {
                $location.url('/bajoautopista');
            });
        }
        else {
            $("#confirmarEliminar").modal('show');
        }
    };
})
.controller("ConsultarSMPCtrl", function ($http, $scope) {
    $scope.$watch("s.seccion + '-' + s.manzana + '-' + s.parcela", function (smp) {
        if (smp === '--') return;
        
        $http.post("/api/usig/consultar-smp", {smp: smp})
        .success(function (dataUsig) {
            $scope.dataUsig = dataUsig;
        });
    });
})
.controller("ImprimirTablaCtrl", function ($http, $routeParams, $scope, BajoAutopista, $window, Comuna, ORMOrganigrama, ORMTema) {
   $scope.bajoautopista = BajoAutopista.get({_id : $routeParams._id});
   $scope.comunas = Comuna.query();
   $scope.organigrama = ORMOrganigrama.query();
   $scope.temas = ORMTema.query();
   
   $scope.imprimir = function() {
        $window.print();
    };
    
    $scope.comunaPorId = function (id) {
      for (var i = 0; i < $scope.comunas.length; i++) {
          if ($scope.comunas[i]._id == id)
          {
              return $scope.comunas[i];
          }
      }  
    };
    
    $scope.mostrarTema = function (r) {
        if (r.eliminado) {
            return false; 
        } else {
            return true;
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
    
    $scope.temaPorId = function (id) {
      for (var i = 0; i < $scope.temas.length; i++) {
          if ($scope.temas[i]._id == id)
          {
              return $scope.temas[i];
          }
      }  
    };
}).directive('directivaLoca', function ()
{
    return{
        restrict:'E',
        templateUrl:'',
        link:function(scope,$http)
        {
            $http.get('js/data.json').success(function (data)
            {
            //pasamos los datos a la vista con scope
            scope.users = data;
            });
        }
    };
});
