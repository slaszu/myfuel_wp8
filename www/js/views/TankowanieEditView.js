// Category View
// =============

// Includes file dependencies
define([ "jquery", "backbone","models/AutoModel", "models/TankowanieModel", "collections/TankowanieCollection", "common" , "session", "lang", "ui_datepicker_mobile"], function( $, Backbone, AutoModel, TankowanieModel, TankowanieCollection, Common, Session, Lang ) {

    // Extends Backbone.View
    var TankowanieEditView = Backbone.View.extend( {
		
		initialize : function () {
			//this.datepickerCreated = false;;
		},
		
		render: function() {
	
			if (typeof this.tankowanie === 'undefined') {
				this.tankowanie = new TankowanieModel();
			}
			if (typeof this.tankowanieLast === 'undefined') {
				this.tankowanieLast = new TankowanieModel();
			}
			if (typeof this.tankowanieNext === 'undefined') {
				this.tankowanieNext = new TankowanieModel();
			}
			
			this.template = _.template( $( "script#tankowanieEditContent" ).html(), {} );
			this.$el.html(this.template);
			
			this.template = _.template( $( "script#tankowanieEdit" ).html(), { "tankowanie": this.tankowanie, "tankowanieLast": this.tankowanieLast, 'Common' : Common, 'auto' : this.auto, "Session": Session } );

            this.$el.find("div[data-role=\"content\"]").html(this.template);
			
            return this;

        },
		
		events: {
            "click button.submit"	: "submit",
			"submit form"			: "submit",
			"click #dateBtn"		: "datepicker"
        },
		
		datepicker : function () {
			var elementPopup = this.$el.find("#datepickerPopup");
			
			//if (this.datepickerCreated !=true) {
				var t = this;
				var element = this.$el.find("#datepickerContent");
				element.datepicker("destroy");
				
				var config = {
					dateFormat: "yy-mm-dd",
					defaultDate: $('input[name="data"]').val(),
					//autoSize: true,
					onSelect : function (dateText, obj) {
						t.datepickerSelect(dateText);
						elementPopup.popup("close");
					}
				};
				if (!isNaN(this.tankowanieLast.id)) {
					config.minDate = this.tankowanieLast.get('data');
				}
				if (!isNaN(this.tankowanieNext.id)) {
					config.maxDate = this.tankowanieNext.get('data');
				}
				
				console.log(config);
				element.datepicker(config);
			//}
			//this.datepickerCreated = true;
			
			elementPopup.popup("open");
			return false;
		},
		datepickerSelect : function(dateText) {
			// ustawia dane w input[name="data"]
			this.$el.find('input[name="data"]').val(dateText);
			// ustawia dane na button #dateBtn
			this.$el.find('#dateBtn').html(Common.getDateAsString(dateText)).button("refresh");
		},
		
        submit: function( event ){
			$.mobile.loading( "show" );
			
            var model = Common.formToJSON(this.$el.find('form'));
			if (isNaN(parseInt(model.id)) ) {
				delete model.id;
			}
						
			if (this.validateForm(model)) {
				console.log(model);
				
				// zapis modelu do bazy
				var tankowanieModel = new TankowanieModel();
				tankowanieModel.save(model, {
					edit : true,
					success : function (data) {
						var tankowanieCollection = new TankowanieCollection();
						tankowanieCollection.updateSpalanie(tankowanieModel.get('id_auto'), function() {
							$.mobile.changePage( "#tankowanie-lista", { reverse: false, changeHash: true } );
						})
					}
				});
			}
			
			$.mobile.loading( "hide" );
			return false;
        },
		validateForm : function (json) {
			
			this.$el.find('span.error').html('').removeClass('error');
			this.$el.find('span.info').html('').removeClass('info');
			
			var result = true;
			var t = this;
			_.each(json , function (val,key){
				switch (key) {
					case "przebieg" :
						if (val == "") {
							t.$el.find('input[name="'+key+'"]').next('span').html( Lang.getText('pole_wymagane') ).addClass('error');
							result = false;
						}
						else if (!(/^([0-9])+(\.){0,1}([0-9])*$/).test(val)) {
							t.$el.find('input[name="'+key+'"]').next('span').html( Lang.getText('to_nie_jest_liczba') ).addClass('error');
							result = false;
						}
						else if(!isNaN(t.tankowanieLast.id)) {
							if (parseFloat(val) < parseFloat(t.tankowanieLast.get('przebieg'))) {
								t.$el.find('input[name="'+key+'"]').next('span').html( Lang.getText('przebieg_za_maly') ).addClass('error');
								result = false;
							}
						}
						else if(!isNaN(t.tankowanieNext.id)) {
							if (val > t.tankowanieNext.get('przebieg')) {
								t.$el.find('input[name="'+key+'"]').next('span').html( Lang.getText('przebieg_za_duzy') ).addClass('error');
								result = false;
							}
						}
						break;
					case "ilosc" :
						if (val == "") {
							t.$el.find('input[name="'+key+'"]').next('span').html( Lang.getText('pole_wymagane') ).addClass('error');
							result = false;
						}
						else if (!(/^([0-9])+(\.){0,1}([0-9])*$/).test(val)) {
							t.$el.find('input[name="'+key+'"]').next('span').html( Lang.getText('to_nie_jest_liczba') ).addClass('error');
							result = false;
						}
						break;
					case "cena" :
						if (val == "") {
						}
						else if (!(/^([0-9])+(\.){0,1}([0-9])*$/).test(val)) {
							t.$el.find('input[name="'+key+'"]').next('span').html( Lang.getText('to_nie_jest_liczba') ).addClass('error');
							result = false;
						}
						break;
					case "data" :
						if (val == "") {
							t.$el.find('input[name="'+key+'"]').next('span').html( Lang.getText('pole_wymagane') ).addClass('error');
							result = false;
						}
						else if(!isNaN(t.tankowanieLast.id)) {
							if (Common.getDateAsObject(val) < Common.getDateAsObject(t.tankowanieLast.get('data'))) {
								t.$el.find('input[name="'+key+'"]').next('span').html( Lang.getText('data_wczesniejsza') ).addClass('error');
								result = false;
							}
						}
						else if(!isNaN(t.tankowanieNext.id)) {
							if (Common.getDateAsObject(val) > Common.getDateAsObject(t.tankowanieNext.get('data'))) {
								t.$el.find('input[name="'+key+'"]').next('span').html( Lang.getText('data_pozniejsza') ).addClass('error');
								result = false;
							}
						}
						break;
				};
			});
			
			return result;
			
		}

    } );

    // Returns the View class
    return TankowanieEditView;

} );