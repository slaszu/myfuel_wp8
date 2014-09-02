// Includes file dependencies
define([ "jquery", "backbone", "models/UstawieniaModel", "common", "session", "lang" ], function( $, Backbone, UstawieniaModel, Common, Session, Lang ) {

    var UstawieniaEditView = Backbone.View.extend( {
			
		render: function() {
		
			this.template = _.template( $( "script#ustawieniaEdit" ).html(), { "ustawienia": this.ustawienia } );

            this.$el.html(this.template);
				
			if (!Session.hasUstawienia()) {
				this.$el.find("div[data-role=\"header\"]>a[data-icon=back]").remove();
			}
				
			var t = this;
			this.delegateEvents($.extend(this.events, {
				"change input[name=dlugosc_inna]" : function() {
					t.$el.find("input[name=dlugosc]").attr('checked', false).checkboxradio( "refresh" );
				},
				"change input[name=pojemnosc_inna]" : function() {
					t.$el.find("input[name=pojemnosc]").attr('checked', false).checkboxradio( "refresh" );
				},
				"change input[name=waluta_inna]" : function() {
					t.$el.find("input[name=waluta]").attr('checked', false).checkboxradio( "refresh" );
				}
			})
			);
				
            return this;
        },
		
		events: {
            "click button"	: "submit",
			"submit form"	: "submit"
        },
		
        submit: function( event ){
			$.mobile.loading( "show" );
			
            var model = Common.formToJSON(this.$el.find('form'));
			
			if (typeof model.pojemnosc === "undefined") {
				model.pojemnosc = model.pojemnosc_inna;
			}
			
			if (typeof model.dlugosc === "undefined") {
				model.dlugosc = model.dlugosc_inna;
			}
			
			if (typeof model.waluta === "undefined") {
				model.waluta = model.waluta_inna;
			}
			
			// na sztywno zawsze ta sama wartosc
			model.id = Session.ustawieniaId;
			
            model.login = this.ustawienia.get('login');
            model.pass = this.ustawienia.get('pass');
            
			if (this.validateForm(model)) {
				console.log(model);
				
				var ustawieniaModel = new UstawieniaModel();
				ustawieniaModel.save(model, {
					success : function (data) {
						Session.setUstawienia(data);
						$.mobile.changePage( "#tankowanie-lista", { reverse: false, changeHash: true } );
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
					case "pojemnosc" :
						if (val == "") {
							t.$el.find('input[name="pojemnosc_inna"]').next('span').html(Lang.getText('pole_wymagane')).addClass('error');
							result = false;
						}
						break;
					case "dlugosc" :
						if (val == "") {
							t.$el.find('input[name="dlugosc_inna"]').next('span').html(Lang.getText('pole_wymagane')).addClass('error');
							result = false;
						}
						break;
					case "waluta" :
						if (val == "") {
							t.$el.find('input[name="waluta_inna"]').next('span').html(Lang.getText('pole_wymagane')).addClass('error');
							result = false;
						}
						break;
				};
			});
			
			return result;
			
		}

    } );

    return UstawieniaEditView;

});