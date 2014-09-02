// Category View
// =============

// Includes file dependencies
define([ "jquery", "backbone", "models/AutoModel", "models/TankowanieModel", "collections/TankowanieCollection", "common" ,"wykres", "lang" ], function( $, Backbone, AutoModel, TankowanieModel, TankowanieCollection, Common, Wykres, Lang ) {

    // Extends Backbone.View
    var WykresView = Backbone.View.extend( {
		
		initialize : function () {
			this.tankowanieColl = new TankowanieCollection();
		},
		
		events: {
			"click a.menu"			: "optionsWykresPopup"
        },
		
		optionsWykresPopup: function () {
			this.$el.find("#optionsWykresPopup").popup("open");
		},
		
		render: function() {
			this.template = _.template( $( "script#wykresContent" ).html(), { "typ" : this.typ, "typ2" : this.typ2 } );
			this.$el.html(this.template);
			this.template = _.template( $( "script#wykresOptions" ).html(), { "typ" : this.typ, "typ2" : this.typ2 } );
			this.$el.find("#optionsWykresPopup>ul").html(this.template);
		},
		
		renderWykres: function(callback) {
			
			var t = this;
			switch(this.typ) {
				case 'spalanie' :
					t.renderSpalanie(callback);
					break;
				case 'cena' : 
					t.renderCena(callback);				
					break;	
				case 'koszty' : 
					t.renderKoszty(callback);				
					break;
			}
			//this.$el.find("div[data-role='header']>h1").html(this.auto.get("nazwa"));
			
            return this;
		},
		
		renderSpalanie: function(callback) {
			
			this.$el.find("div[data-role=header]>h1").html(Lang.getText('spalanie'));
			
			if (this.typ2 == 'all') {
				//"SELECT * FROM tankowanie WHERE id_auto = "+this._idAuto+" AND spalanie != '' ORDER BY data DESC, id DESC LIMIT 10"
		
				this.tankowanieColl.fetch({
					sort : {"data" : "desc", "id" : "desc"},
					where : {"id_auto = ?" : this.auto.id, "spalanie != '?' ": ''},
					limit : {"limit" : 10},
					success : function(data) {
						Wykres._callback = callback;
						Wykres._collection = data;
						Wykres.getWykresSpalanie('chart');
					}
				});
			}
			else {
				// 'SELECT avg(spalanie) as spalanie, data FROM "tankowanie" WHERE id_auto = "'+this._idAuto+'" AND spalanie IS NOT NULL group by strftime("%Y-%m", data) ORDER BY data DESC, id DESC LIMIT 10'
				
				this.tankowanieColl.fetch({
					cols : {0:'avg(spalanie) AS spalanie', 1:'data'},
					group : {0:'strftime("%Y-%m", data)'},
					sort : {"data" : "desc", "id" : "desc"},
					where : {"id_auto = ?" : this.auto.id, "spalanie != '?' ": ''},
					limit : {"limit" : 10},
					success : function(data) {
						Wykres._callback = callback;
						Wykres._collection = data;
						Wykres.getWykresSpalanie('chart',"mmm, yyyy");
					}
				});
			}
		},
		
		
		renderCena: function(callback) {
			
			this.$el.find("div[data-role=header]>h1").html(Lang.getText('cena'));
			
			if (this.typ2 == 'all') {
				//'SELECT * FROM "tankowanie" WHERE id_auto = "'+this._idAuto+'" AND cena IS NOT NULL AND cena != "" ORDER BY data DESC, id DESC LIMIT 10'
			
				this.tankowanieColl.fetch({
					sort : {"data" : "desc", "id" : "desc"},
					where : {"id_auto = ?" : this.auto.id, "cena != '?'" : ''},
					limit : {"limit" : 10},
					success : function(data) {
						Wykres._callback = callback;
						Wykres._collection = data;
						Wykres.getWykresCena('chart');
					}
				});
			}
			else {			
				// 'SELECT avg(cena) as cena, data FROM "tankowanie" WHERE id_auto = "'+this._idAuto+'" AND cena IS NOT NULL AND cena != "" group by strftime("%Y-%m", data) ORDER BY data DESC, id DESC LIMIT 10'
				
				this.tankowanieColl.fetch({
					cols : {0:'avg(cena) AS cena', 1:'data'},
					group : {0:'strftime("%Y-%m", data)'},
					sort : {"data" : "desc", "id" : "desc"},
					where : {"id_auto = ?" : this.auto.id, "cena != '?'" : ''},
					limit : {"limit" : 10},
					success : function(data) {
						Wykres._callback = callback;
						Wykres._collection = data;
						Wykres.getWykresCena('chart', "mmm, yyyy");
					}
				});
			}
		},
		
		
		renderKoszty: function(callback) {
			
			this.$el.find("div[data-role=header]>h1").html(Lang.getText('koszt'));
			
			if (this.typ2 == 'all') {
				//'SELECT sum(cena * ilosc) as cena, data FROM "tankowanie" WHERE id_auto = "'+this._idAuto+'" AND cena IS NOT NULL AND cena != "" group by strftime("%Y-%m-%d", data) ORDER BY data DESC, id DESC LIMIT 10'
			
				this.tankowanieColl.fetch({
					cols : {0:'sum(cena * ilosc) AS cena', 1:'data'},
					group : {0:'id'},
					sort : {"data" : "desc", "id" : "desc"},
					where : {"id_auto = ?" : this.auto.id, "cena != '?'" : ''},
					limit : {"limit" : 10},
					success : function(data) {
						Wykres._callback = callback;
						Wykres._collection = data;
						Wykres.getWykresCena('chart');
					}
				});
			}
			else {
				// 'SELECT sum(cena*ilosc) as cena, data FROM "tankowanie" WHERE id_auto = "'+this._idAuto+'" AND cena IS NOT NULL AND cena != "" group by strftime("%Y-%m", data) ORDER BY data DESC, id DESC LIMIT 10'
				
				this.tankowanieColl.fetch({
					cols : {0:'sum(cena * ilosc) AS cena', 1:'data'},
					group : {0:'strftime("%Y-%m", data)'},
					sort : {"data" : "desc", "id" : "desc"},
					where : {"id_auto = ?" : this.auto.id, "cena != '?'" : ''},
					limit : {"limit" : 10},
					success : function(data) {
						Wykres._callback = callback;
						Wykres._collection = data;
						Wykres.getWykresCena('chart', "mmm, yyyy");
					}
				});
				
			}
			
		}

    } );

    // Returns the View class
    return WykresView;

} );