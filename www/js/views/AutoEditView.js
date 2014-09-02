define([ "jquery", "backbone","models/AutoModel", "common", "session", "lang" ], function( $, Backbone, AutoModel, Common, Session, Lang ) {

    var AutoEditView = Backbone.View.extend( {
		
		initialize : function () {
			this.auto = this.options.auto;
		},
		
	    render: function() {

			if (typeof this.auto === 'undefined') {
				this.auto = new AutoModel();
			}
			
			this.template = _.template( $( "script#autoEditContent" ).html(), {} );
			this.$el.html(this.template);
			
            this.template = _.template( $( "script#autoEdit" ).html(), { "auto": this.auto } );
			this.$el.find("div[data-role=\"content\"]").html(this.template);
			
			if (this.auto.id > 0) {
				this.$el.find("div[data-role=\"header\"]>h1").html(this.auto.get("nazwa"));
			}
			
			if (!Session.hasAutoAny()) {
				this.$el.find("div[data-role=\"header\"]>a[data-icon=back]").remove();
			}
			
            return this;

        },
		
		events: {
            "click button"	: "submit",
			"submit form"	: "submit"
        },
        submit: function( event ){
			$.mobile.loading( "show" );
			
            var model = Common.formToJSON(this.$el.find('form'));
			if (isNaN(parseInt(model.id)) ) {
				delete model.id;
			}
			if (this.validateForm(model)) {
				console.log(model);
				
				// pierwszy wpis ustawiamy jako aktywny
				if (!Session.hasAutoAny()) {
					model.aktywny = 1;
				}
				
				// zapis modelu do bazy
				var autoModel = new AutoModel();
				autoModel.save(model, {
					success : function (data) {
						if (autoModel.get('aktywny') == 1) {
							Session.autoModel = autoModel;
							$.mobile.changePage( "#tankowanie-lista", { reverse: false, changeHash: true } );
						} else {
							$.mobile.changePage( "#auto-lista", { reverse: false, changeHash: true } );
						}
					}
				});
			}
			
			$.mobile.loading( "hide" );
			return false;
        },
		validateForm : function (json) {
			
			this.$el.find('span.error').html('').removeClass('error');
			
			var result = true;
			var t = this;
			_.each(json , function (val,key){
				switch (key) {
					case "nazwa" :
						if (val == "") {
							t.$el.find('input[name="nazwa"]').next('span').html(Lang.getText('pole_wymagane')).addClass('error');
							result = false;
						}
						break;
				};
			});
			
			return result;
			
		}

    } );

    return AutoEditView;

} );