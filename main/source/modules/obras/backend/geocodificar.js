var request = require("request"),
    async = require("async");

    function geocodificarCruce(obra, callback) {
        request({
            url: "http://ws.usig.buenosaires.gob.ar/geocoder/2.2/geocoding",
            qs: {
                "cod_calle1": obra.calle,
                "cod_calle2": obra.cruce
            }
        }, function(err, res) {
            if (err) {
                console.error(err);
                return callback(err);
            }

            try {
                var unwrapped = res.body.slice(1, res.body.length - 1);
                var respuesta = JSON.parse(unwrapped);

                obra.geoUsig = respuesta;
                
                console.log(obra.nombre, respuesta);
                return callback(null, obra);
            }
            catch (e) {
                console.log(e);
                return callback(err, obra);
            }
        });
    }

    function geocodificarAltura(obra, callback) {
        request({
            url: "http://ws.usig.buenosaires.gob.ar/geocoder/2.2/geocoding",
            qs: {
                "cod_calle": obra.calle,
                "altura": obra.altura
            }
        }, function(err, res, body) {
            if (err) {
                console.error(err);
                return callback(err);
            }

            try {
                var unwrapped = res.body.slice(1, res.body.length - 1);
                var respuesta = JSON.parse(unwrapped);

                obra.geoUsig = respuesta;
                
                console.log(obra.nombre, respuesta);
                return callback(null, obra);
            }
            catch (e) {
                console.log(err);
                callback(err, obra);
            }
        });
    }

module.exports = function(obras, callback) {
    var procesadas = [];

    async.each(obras, function(obra, callback) {
        var o = {
            _id: obra._id.toString(),
            nombre: obra.nombre,
            calle: obra.calle,
            cruce: obra.cruce ? obra.cruce : undefined,
            altura: obra.altura ? obra.altura : undefined,
            orden1: obra.orden1 ? obra.orden1 : undefined,
            estado: obra.estado ? obra.estado.nombre : undefined
        };

        function geoCallback(err, obra) {
            procesadas.push(obra);

            callback(err);
        }

        if (o.cruce) return geocodificarCruce(o, geoCallback);
        if (o.altura) return geocodificarAltura(o, geoCallback);
    }, function(err) {
        console.log(procesadas);
        var geojson = {
            "type": "FeatureCollection",
            "features": []
        };
        
        for (var i = 0; i < procesadas.length; i++) {
            var procesada = procesadas[i];
            
            if (procesada.geoUsig && procesada.geoUsig.x && procesada.geoUsig.y) {
                geojson.features.push({
                    "type": "Feature",
                    "properties": procesada,
                    "geometry": {
                        "type": "Point",
                        "coordinates": [
                        Number(procesada.geoUsig.x),
                        Number(procesada.geoUsig.y)]
                    }
                });
            }
        }
        
        callback(err, geojson);
    });
};
