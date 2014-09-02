define(["jquery", "collections/AutoCollection", "models/UstawieniaModel"], function($, AutoCollection, UstawieniaModel) {
	var Session = {
		/**
		* identyfikator rekordu w tabeli ustawienia gdzie sa trzymane dane dla aplikacji
		*/
		ustawieniaId : 1,
		
		
		autoModel : null,
		autoModelCount : 0,
		dlugosc : null,
		pojemnosc : null,
		waluta : null,
		lang : null,
        keyboard : null,
		limit : 10,	// limit wynikow na liscie tankowan
		
		setUstawienia : function(ustawieniaModel) {
			this.dlugosc 	= ustawieniaModel.get('dlugosc');
			this.pojemnosc 	= ustawieniaModel.get('pojemnosc');
			this.waluta 	= ustawieniaModel.get('waluta');
			this.lang 		= ustawieniaModel.get('lang');
            this.keyboard 	= ustawieniaModel.get('keyboard');
		},
		
		setDefault : function(callback) {
			var t = this;
			//this.waluta 	= "EUR";
			navigator.globalization.getLocaleName(
				function (locale) {
					var lang = locale.value;
					lang = lang.slice(0,2);
					switch(lang) {
						case 'en' :
						case 'de' :
						case 'pl' :
							t.lang = lang;
							break;
						default:
							t.lang = 'en';
						
					}
					console.log('success, '+ t.lang+','+ locale.value);
					callback();
				},
				function () {
					t.lang 		= "en";
					console.log('error '+ t.lang);
					callback();
				}
			);
		},
		
		hasAuto : function() {
			return (this.autoModel != null);
		},
		
		hasAutoAny: function() {
			return (this.autoModelCount > 0 || this.hasAuto());
		},
		
		hasUstawienia : function() {
			console.log(this);
			return (this.dlugosc != null && this.pojemnosc != null && this.waluta != null && this.lang != null );
		},
		
		/*
			AutoCollection
			SettingModel
			$
			
			1. czy jest Session.autoModel
				tak >> 2
				nie - sprawdz czy jest aktywne jakies auto
					nie - sprawdz czy sa jakiekolwiek auta
						nie - kieruj na #auto-edit
						tak - kieruj na #auto-lista
					tak - ustaw >> 2.
			2. czy jest Session.setting1, setting2,...
				nie - sprawdz czy sa ustawienia
					tak - ustaw >> 3
					nie - kieruj na #setting
				tak >> 3
			3. return TRUE
		*/
		run : function(callback) {
			var t = this;
			this._checkSetting(function() {
				t._checkAuto(function() {
					callback();
				});
			})
		},
		
		_checkAuto : function(callback) {
			var t = this;
			if (!t.hasAuto()) {
				var autoCol = new AutoCollection();
				autoCol.getAktywne(function(autoModel) {
					if (typeof autoModel === "undefined") {
						autoCol.fetch({
							success : function (data) {
								if (autoCol.length <= 0) {
									$.mobile.changePage( "#auto-edit" , { reverse: false, changeHash: true } );
								}
								else {
									$.mobile.changePage( "#auto-lista" , { reverse: false, changeHash: true } );
								}
							}
						})
					} else {
						t.autoModel = autoModel;
						callback();
					}
				});
			} else {
				callback();
			}
		},
		
		_checkSetting : function(callback) {
			
			if (this.dlugosc == null || this.pojemnosc == null || this.waluta == null || this.lang == null ) {
				
				/**
				* nie ma ustawien wiec pobieramy je z bazy,
				* jak nie bedzie ich w bazie to kierujemy na #ustawienia-edit
				*/
				var t = this;
				
				var ustawieniaModel = new UstawieniaModel({id : this.ustawieniaId});
				ustawieniaModel.fetch({
					success: function (ustawienia) {
						console.log(ustawienia.toJSON());					
						if (!ustawienia.isValid()) {
							// domyslne dane sa ustawiane w mobileRouter.js dla #ustawienia-edit
							$.mobile.changePage( "#ustawienia-edit" , { reverse: false, changeHash: true } );
						} else {
							t.setUstawienia(ustawienia);
							callback();
						}
					}
				});
			} else {
				console.log('Session Fast Response');			
				callback();
			}
		}
		
		
	}
	
	
	
	
	
	
	return Session;
});