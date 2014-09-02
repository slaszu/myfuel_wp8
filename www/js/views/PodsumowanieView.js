define([ "jquery", "backbone", "models/AutoModel", "models/TankowanieModel", "common", "session", "lang" ], function( $, Backbone, AutoModel, TankowanieModel, Common, Session, Lang ) {

    var PodsumowanieView = Backbone.View.extend( {
		
		render: function() {
			
			var dane = {};
			dane.spalanie 	= {'max': 0, 'min': 0, 'avg': 0};
			dane.przebieg 	= {'max': 0, 'min': 0, 'all': 0, 'between': 0, 'between_max':0 , 'between_min':0};
			dane.paliwo 	= {'sum': 0, 'avg': 0, 'max': 0, 'min': 0};
			dane.koszty		= {'sum': 0, 'avg': 0, 'max': 0, 'min': 0};
			
			var coll = this.collection.toJSON();
			
			//console.log(coll);
			
			if (coll.length > 0) {
				
				var max = _.max(coll, function(one){ if (one.spalanie != "") return one.spalanie; });
				if (typeof max.spalanie !== 'undefined') { 
					dane.spalanie.max 	= parseFloat(max.spalanie).toFixed(2);
				}
				var min = _.min(coll, function(one){ if (one.spalanie != "") return one.spalanie; });
				if (typeof min.spalanie !== 'undefined') {
					dane.spalanie.min 	= parseFloat(min.spalanie).toFixed(2);
				}
				
				dane.przebieg.min 	= _.min(coll, function(one){ return one.przebieg; }).przebieg;
				dane.przebieg.max 	= _.max(coll, function(one){ return one.przebieg; }).przebieg;
				dane.przebieg.all 	= dane.przebieg.max - dane.przebieg.min;
				dane.przebieg.between 		= Math.round((dane.przebieg.all / (coll.length - 1)));
				var between = [];
				
				_.reduce(coll.reverse(), function (memo, one) { if (memo > 0) { var x = parseFloat(one.przebieg) - memo; between.push(x);}  memo = parseFloat(one.przebieg); return memo;}, 0);
				
				coll = coll.reverse();
				
				if (between.length > 0) {
					dane.przebieg.between_max 	= _.max(between);
					dane.przebieg.between_min 	= _.min(between);
				}
				dane.paliwo.sum		= parseFloat(_.reduce(coll, function (memo, one) { return memo + parseFloat(one.ilosc)}, 0)).toFixed(2);
				
				if (coll.length > 1) {
					//console.log(coll);
					// srednie spalanie to ( ilosc calego paliwa - ostatnie tankowanie * 100) / max przebieg - min przebieg
					dane.spalanie.avg	= ((dane.paliwo.sum - coll[0].ilosc) * 100)/ (dane.przebieg.all);
					//console.log( ' ( '+dane.paliwo.sum + ' - ' + coll[0].ilosc + ' * 100 )/ '+ dane.przebieg.all);
					dane.spalanie.avg 	= parseFloat(dane.spalanie.avg).toFixed(2);
				}
				
				dane.paliwo.avg		= (dane.paliwo.sum / coll.length).toFixed(2);
				dane.paliwo.min 	= _.min(coll, function(one){ return one.ilosc; }).ilosc;
				dane.paliwo.max 	= _.max(coll, function(one){ return one.ilosc; }).ilosc;
				
				var kosztySumCounter = 0;
				dane.koszty.sum		= parseFloat(_.reduce(coll, function (memo, one) { if (one.cena != "") {memo = memo + parseFloat(one.cena) * parseFloat(one.ilosc); kosztySumCounter++} return memo;}, 0)).toFixed(2);
				if (kosztySumCounter > 0) {
					dane.koszty.avg		= parseFloat(dane.koszty.sum / kosztySumCounter).toFixed(2);
				}
				
				var min = _.min(coll, function(one){ if (one.cena != "") return one.cena * one.ilosc; });
				if (typeof min.cena !== 'undefined') {
					dane.koszty.min		= parseFloat(min.cena * min.ilosc).toFixed(2);
				}
				var max	= _.max(coll, function(one){ if (one.cena != "") return one.cena * one.ilosc; });
				if (typeof max.cena !== 'undefined') {
					dane.koszty.max		= parseFloat(max.cena * max.ilosc).toFixed(2);
				}
			}
			
			//console.log(dane);
			
			
			
			this.template = _.template( $( "script#podsumowanieContent" ).html(), {'dane' : dane, 'session' : Session} );
			this.$el.html(this.template);
			this.$el.find("div[data-role='header']>h1").html(this.auto.get("nazwa"));
			
            return this;
		}
		
    } );

    // Returns the View class
    return PodsumowanieView;

} );