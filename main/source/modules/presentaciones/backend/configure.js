exports = module.exports = function (app, conf) {
	app.get(conf.api.prefix + '/presentaciones.presentacion/:id', function (req, res) {
		res.json ({
			titulo: 'Titulo',
			slides: [
			{
				template: 'slide1.html',
				data: {
					jurisdiccion: 'Subsecretaría de Transporte',
					objetivoDeImpacto: '345. Empeorar el transporte de autos'
				}
			},
			{
				template: 'slide2.html',
				data: {
					titulo: '345. Empeorar el transporte de autos',
					subtitulo1: '666 Reducir la cantidad de automóviles',
					subtitulo2: '666 Reducir la cantidad de automóviles',
					subtitulo3: '666 Reducir la cantidad de automóviles',
					descripcion1: '345. Empeorar el transporte de autos',
					descripcion2: '345. Empeorar el transporte de autos',
					descripcion3: '345. Empeorar el transporte de autos'
				}
			},
			{
				template: 'slide3.html',
				data: {
					titulo: '789. Imponer trabas a la circulación',
					proyecto1: 'A 345. Empeorar el transporte de autos',
					proyecto2: 'B 345. Empeorar el transporte de autos',
					proyecto3: 'C 345. Empeorar el transporte de autos',
					proyecto4: 'D 345. Empeorar el transporte de autos',
					proyecto5: 'E 345. Empeorar el transporte de autos',
					proyecto6: 'F 345. Empeorar el transporte de autos',
					proyecto7: 'G 345. Empeorar el transporte de autos',
					proyecto8: 'H 345. Empeorar el transporte de autos'
				}
			},
			{
				template: 'slide4.html',
				data: {
					titulo: '789. Imponer trabas a la circulación',
					dependencia: 'Dirección General de Tránsito',
					funcionario: 'Carmelo Sigilito',
					breveDescripcion: 'Descripcion del proyecto Peaje en calles',
					producto: 'Cabinas voladoras',
					prioridad: 'B',
					presupuestoSolicitado: '8.888.888,00',
					fuenteDeFinanciamiento: 9,
					cuantificacion: '999999999999',
					proyectoPreExistente: 'Si',
					fechaInicio: '01-02-2068',
					fechaFin: '10-02-2073',
					jurisdiccion: 550,
					ogese: 2,
					unidadEjecutora: 3,
					programa: 4,
					subprograma: 5,				
					proyecto: 6,				
					actividad: 7,				
					obra: 8				
				}
			},
			{
				template: 'slide5.html',
				data: {
					titulo: '789. Imponer trabas a la circulación',
					dependencia: 'Dirección General de Tránsito',
					funcionario: 'Carmelo Sigilito',
					breveDescripcion: 'Drescripción obras',
					comuna: 7,
					contratacion: 'Licitación pública',
					direccion: 'Carabobo 123',
					presupuestoTotal: '$ 123.456.789,00',
					presupuestoSolicitado2014: '$ 987.654.321,00',
					cuantificacion: '999999999999',
					// proyectoPreExistente: 'Si',
					fechaInicio: '01-06-2045',
					fechaFin: '02-08-2052',
					jurisdiccion: 17,
					ogese: 14,
					unidadEjecutora: 13,
					programa: 12,
					subprograma: 11,				
					proyecto: 10,				
					actividad: 9,				
					obra: 8,
					fuenteDeFinanciamiento: 7
				}
			}]
		});
	});

	// url para templates /api/presentaciones/templates/slide1.html por ejemplo
	app.get(conf.api.prefix + '/presentaciones.static/:id', function (req, res) {
		// esto correspondería a /modules/presentaciones/backend/templates
		res.sendfile(require('path').join(__dirname, 'templates', req.params.id), function (err) {
			if (err) {
				// mostrar el error en la consola
				console.log(err);

				// enviar HTTP 503
				res.status(503);
				res.end();
			}
		});
	});
};
