define([ "jquery","backbone","models/TankowanieModel" ], function( $, Backbone, TankowanieModel ) {

    // Extends Backbone.Router
    var TankowanieCollection = Backbone.Collection.extend( {
		// Sets the Collection model property to be a Category Model
        model: TankowanieModel,
		
		/**
		* odswieza i wylicza spalanie do tankowan ktore nie
		maja jeszcze obliczonego spalania
		*/
		updateSpalanie : function(idAuto, callback) {
			var t = this;
			
			// pobrac wszystkie tankowania dla auta w okreslonej kolejnosci, bez podanego spalania
			t.fetch({
				sort : {"data" : "desc", "id" : "desc"},
				where : {"id_auto = ?" : idAuto},
				success: function (data) {
					
					var toUpdate = [];
					_.each(data.toJSON(), function(one, index) {
						
						//console.log(data.at(index).toJSON());
						if (isNaN(one.spalanie) || one.spalanie == "") {
							var flagF = 0;
                            if (one.f == 1) {
                                // oblicz dla tankowania do pelna
								// pobranie wczesniejszego wpisu z f = 1
								var i = index+1;
								var l = 0;
								var last = one;
								while (true) {
									last = data.at(i);
									if (typeof last === 'object') {
										last = last.toJSON();
										l += last.ilosc;
									}
									if (typeof last === 'undefined' || last.f == 1) {
										break;
									}
									i++;
								}
								if (l > 0 && typeof last === 'object') {
									l += one.ilosc;
									l -= last.ilosc;
									p = one.przebieg - last.przebieg;
									
									var s = (l * 100)/p;
									s = s.toFixed(2);
									toUpdate.push(data.at(index).set('spalanie', s).toJSON());
                                    flagF = 1;
								}
							}
                            // jezeli obliczenia dla f == 1 sie nie udaly lub nie mialy miejsca
                            // to sprawdzamy dla r == 1
							if(one.r == 1 && flagF == 0) {
								// oblicz dla tankowania przy rezerwie
								// pobranie wczesniejszego wpisu z r = 1
								var i = index+1;
								var l = 0;
								var last = one;
								while (true) {
									last = data.at(i);
									if (typeof last === 'object') {
										last = last.toJSON();
										l += last.ilosc;
									}
									if (typeof last === 'undefined' || last.r == 1) {
										break;
									}
									i++;
								}
								if (l > 0 && typeof last === 'object') {
									p = one.przebieg - last.przebieg;
									
									var s = (l * 100)/p;
									s = s.toFixed(2);
									toUpdate.push(data.at(index).set('spalanie', s).toJSON());
								}
							}
							//console.log(data.at(index).toJSON(),'after');
						}
					});
					
					if (toUpdate.length > 0) {
						console.log('update');
						
						t.off('updated');
						var count = toUpdate.length;
						var counter = 0;
						var tankowanieModel = new TankowanieModel();
						t.on('updateNext', function (event) {
							tankowanieModel.save(toUpdate[counter], {
								success : function (data) {
									counter++;
									console.log(counter);
									if (counter >= count) {
										console.log('callback');
										callback();
									}
									else {
										t.trigger('updateNext');
									}
								}
							});
						});
						
						// start
						t.trigger('updateNext');
					}
					else {
						console.log('callback');
						callback();
					}
				}
			});
		}
		
    });

	
    // Returns the Model class
    return TankowanieCollection;

} );