define([ "jquery", "backbone", "models/AutoModel", "models/TankowanieModel", "common", "session", "lang" ], function( $, Backbone, AutoModel, TankowanieModel, Common, Session, Lang ) {

    var TankowanieView = Backbone.View.extend( {
		
		offset : 0,
		
		events: {
            "click a.click"			: "menuTankowaniePopup",
			"click a.delete_popup"	: "deleteTankowaniePopup",
			"click a.delete_final"	: "deleteTankowanie",
			"click a.menu"			: "optionsTankowaniePopup",
			//"click a.podsumowanie"	: "podsumowanieTankowaniePopup",
			"click a.refresh"		: "refreshLista",
			"click button.more"		: "renderMore"
        },
		
		optionsTankowaniePopup: function () {
			this.$el.find("#optionsTankowaniePopup").popup("open");
		},
		
		refreshLista: function () {
			this.$el.find("#optionsTankowaniePopup").popup("close");
			$.mobile.loading( "show" );
			var t = this;
			this.collection.updateSpalanie(this.auto.id, function() {
				t.render();
				/**
				 * UWAGA !!! - tutuaj jest niespojnosc w logice, 
				 * translate i trigger('pagecreate'), wszedzie sa robione w mobileRouter, a tu bezposrednio w widoku
				 */
				Lang.translate(t.$el);
				t.$el.page().trigger('pagecreate');
				
				$.mobile.loading( "hide" );
			});			
		},
		
		/*podsumowanieTankowaniePopup: function () {
			
			
			var dane = {
				przebieg: 0,
				paliwo: 0,
				koszty: 0,
				spalanie: 0
			};
			var coll = this.collection.toJSON();
			dane.przebieg 	= _.max(coll, function(one){ return one.przebieg; }).przebieg - _.min(coll, function(one){ return one.przebieg; }).przebieg;
			dane.paliwo		= _.reduce(coll, function(memo, one){ return memo + one.ilosc; }, 0);
			dane.koszty		= _.reduce(coll, function(memo, one){ return memo + one.ilosc*one.cena; }, 0);
			
			var spalanieCount = 0;
			spalanieSum = _.reduce(coll, function(memo, one){
				if (parseFloat(one.spalanie) > 0) {
					spalanieCount++;
					return memo + one.spalanie;
				} else {
					return memo;
				}
			}, 0);
			
			if (spalanieCount > 0) {
				dane.spalanie = spalanieSum/spalanieCount;
			} else {
				dane.spalanie = 0;
			}
			
			this.template = _.template( $( "script#tankowaniePodsumowanie" ).html(), { "dane": dane, "Session": Session } );
			
			this.template = Lang.translate(this.template);
			
			this.$el.find("#podsumowanieTankowaniePopup>div[data-role='content']").html(this.template);
			this.$el.find("#optionsTankowaniePopup").popup("close");
			this.$el.find("#podsumowanieTankowaniePopup").popup("open");
		},*/
		
		menuTankowaniePopup: function(event) {
			var idTankowanie = event.currentTarget.id;
			
			var tankowanieModel = this.collection.get(idTankowanie);
			
			this.template = _.template( $( "script#tankowanieMenu" ).html(), { "tankowanie": tankowanieModel } );
			
			this.template = Lang.translate(this.template);
						
            this.$el.find("#menuTankowaniePopup>ul").html(this.template).listview('refresh');

            this.$el.find("#menuTankowaniePopup").popup("open");
		},
		
		deleteTankowaniePopup: function(event) {
			var idTankowanie = event.currentTarget.id;
			
			var tankowanieModel = this.collection.get(idTankowanie);
			
			this.template = _.template( $( "script#tankowanieDelete" ).html(), { "tankowanie": tankowanieModel, "Common" : Common, "Session": Session } );

			this.template = Lang.translate(this.template);
			
            this.$el.find("#deleteTankowaniePopup>div[data-role='content']").html(this.template);
			
			this.$el.find("#menuTankowaniePopup").popup("close");
            this.$el.find("#deleteTankowaniePopup").popup("open");
		},
		
		deleteTankowanie: function(event) {
			var idTankowanie = event.currentTarget.id;
			var tankowanieModel = this.collection.get(idTankowanie);
			var t = this;
			tankowanieModel.destroy({
				success: function(model) {
					// najpierw "close" poniewaz inaczej sypie bledem
					t.$el.find("#deleteTankowaniePopup").popup("close");
					t.render();
					
					/**
					* UWAGA !!! - tutuaj jest niespojnosc w logice, 
					* translate i trigger('pagecreate'), wszedzie sa robione w mobileRouter, a tu bezposrednio w widoku
					*/
					Lang.translate(t.$el);
					t.$el.page().trigger('pagecreate');
				}
			});
		},
				
        render: function() {
			
			this.template = _.template( $( "script#tankowanieContent" ).html(), {} );
			this.$el.html(this.template);
			
            this.template = _.template( $( "script#tankowanieItems" ).html(), { "collection": this.collection, "Common": Common, "Session": Session, "Lang": Lang, "more" : true } );

            this.$el.find("div[data-role='content']>ul").html(this.template);
			this.$el.find("div[data-role='header']>h1").html(this.auto.get("nazwa"));
			
            return this;
		},
		
		renderMore: function() {
			$.mobile.loading( "show" );
			
			var t = this;
			t.offset += Session.limit;
			console.log(t.offset);
			t.collection.fetch({
					sort : {"data" : "desc", "id" : "desc"},
					where : {"id_auto = ?" : t.auto.get('id')},
					limit : {offset : t.offset , limit : Session.limit + 1},
					success : function(data) {
						console.log(data);
						
						t.template = _.template( $( "script#tankowanieItems" ).html(), { "collection": t.collection, "Common": Common, "Session": Session, "Lang": Lang ,"more" : false} );
						t.$el.find("div[data-role='content']>ul>li.more").before(t.template);
						
						// delete more button
						if (t.collection.length <= Session.limit) {
							t.$el.find("div[data-role='content']>ul>li.more").remove();
						}
						t.$el.find("div[data-role='content']>ul").listview('refresh');
						
						$.mobile.loading( "hide" );
					}
			});
		}	
		
    } );

    // Returns the View class
    return TankowanieView;

} );