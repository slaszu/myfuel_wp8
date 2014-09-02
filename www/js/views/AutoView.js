define([ "jquery", "backbone","models/AutoModel", "session", "lang" ], function( $, Backbone, AutoModel, Session, Lang ) {

    // Extends Backbone.View
    var AutoView = Backbone.View.extend( {

		events: {
            "click a.click"			: "menuAutoPopup",
			"click a.delete_popup"	: "deleteAutoPopup",
			"click a.delete_final"	: "deleteAuto",
			"click a.choose"		: "chooseAuto"
        },
		
		menuAutoPopup: function(event) {
			var idAuto = event.currentTarget.id;
			
			var autoModel = this.collection.get(idAuto);
			
			this.template = _.template( $( "script#autoMenu" ).html(), { "auto": autoModel } );
			this.template = Lang.translate(this.template);
			
            this.$el.find("#menuAutoPopup>ul").html(this.template).listview('refresh');

            this.$el.find("#menuAutoPopup").popup("open");
		},
		
		deleteAutoPopup: function(event) {
			var idAuto = event.currentTarget.id;
			
			var autoModel = this.collection.get(idAuto);
			
			this.template = _.template( $( "script#autoDelete" ).html(), { "auto": autoModel } );
			this.template = Lang.translate(this.template);
			
            this.$el.find("#deleteAutoPopup>div[data-role='content']").html(this.template);
			
			this.$el.find("#menuAutoPopup").popup("close");
            this.$el.find("#deleteAutoPopup").popup("open");
		},
		
		deleteAuto: function(event) {
			var idAuto = event.currentTarget.id;
			var autoModel = this.collection.get(idAuto);
			var t = this;
			autoModel.destroy({
				success: function(model) {
					// najpierw "close" poniewaz inaczej sypie bledem
					t.$el.find("#deleteAutoPopup").popup("close");
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
		
		chooseAuto: function(event) {
			var idAuto = event.currentTarget.id;
			var autoModel = this.collection.get(idAuto);
			autoModel.save({'aktywny': 1}, {
				success: function(model) {
					Session.autoModel = autoModel;
					$.mobile.changePage( "#tankowanie-lista", { reverse: false, changeHash: true } );
					console.log('done');
				}
			});
		},
		
        // Renders all of the Category models on the UI
        render: function() {
			
			Session.autoModelCount = this.collection.length;
			
			this.template = _.template( $( "script#autoContent" ).html(), {} );
			this.$el.html(this.template);
			
			this.template = _.template( $( "script#autoItems" ).html(), { "collection": this.collection } );
			this.$el.find("div[data-role='content']>ul").html(this.template);

			if (!Session.hasAuto()) {
				this.$el.find("div[data-role=\"header\"]>a[data-icon=back]").remove();
			}
			
            return this;

        }

    } );

    // Returns the View class
    return AutoView;

} );