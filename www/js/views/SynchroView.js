define([
    "jquery",
    "backbone",
    "common",
    "lang",
    "synchro",
    "collections/TankowanieCollection",
    "collections/AutoCollection",
    "models/AutoModel",
    "models/TankowanieModel"
], function(
        $,
        Backbone,
        Common,
        Lang,
        Synchro,
        TankowanieCollection,
        AutoCollection,
        AutoModel,
        TankowanieModel
) {

    var SynchroView = Backbone.View.extend({
        
        ustawienia : null,
        ustawieniaJson : null,
        
        events: {
            "click #btnAccountCreate"   : "accountCreate",
            "submit #formAccountCreate" : "accountCreate",
            "click #btnAccountLogin"    : "accountLogin",
            "submit #formAccountLogin"  : "accountLogin",
            "click #btnAccountLoginTo"  : function () { this.renderAccountLogin(); },
            "click #btnAccountCreateTo" : function () { this.renderAccountCreate(); },
            "click #btnSynchroSaveOnServer" : "synchroSaveOnServer",
            "click #btnGoToImport"      : function () { this.renderImport(); },
            "click #btnGoToExport"      : function () { this.renderExport(); },
            "click #btnSynchroGetFromServer" : "synchroGetFromServer",
        },
                
        synchroSaveOnServer: function(event) {
    
            $.mobile.loading( 'show', {
                text: Lang.getText('prosze_czekac')+'...',
                textVisible: true,
                theme: 'a',
                html: ""
            });
            var formData = Common.formToJSON(this.$el.find('form'));
            console.log(formData);
            
            // 1. zliczyc wszystkie auta do wyslania
            var autoIdArray = [];
            for(key in formData) {
                if ( (/^auto_/).test(key) ) {
                    var autoId = formData[key];
                    autoIdArray.push(autoId)
                }
            }
            console.log(autoIdArray);
            
            // zmienne uzywane w evencie
            var tankowanieColl = new TankowanieCollection();
            var t = this;
            
            // 2. definicja eventu okreslajacego koniec wysylania, event rowniez odswieza info dla klienta
            var count = autoIdArray.length;
            var counter = 0;
            
            t.off('sent');
            t.on('sent', function(event) {
                if (counter >= count) {
                    // 4. koniec wysylania
                    Synchro.clearAfterSetAutoData(
                        function(data) {
                            console.log(data);
                            if (data.ok == 1) {
                                
                                // 5. wyslanie jeszcze ustawien z urzadzenia
                                var json = t.ustawieniaJson;
                                delete(json.login);
                                delete(json.pass);
                                
                                Synchro.setUstawieniaData( json,
                                    function (data) {
                                        console.log(data);
                                        if (data.ok == 1) {

                                            $.mobile.loading("hide");

                                            var popup = t.$el.find("#accountInfoPopup3");
                                            popup.find("div[data-role='header'] h1").html( Lang.getText('informacja') );
                                            popup.find("div[data-role='content']").html( Lang.getText('dane_zapisane_na_serwerze') );
                                            popup.popup("open"); 
                                        } else {
                                            return t.connectError('accountInfoPopup3' , data.msg);
                                        }
                                    },
                                    function (data) {
                                        return t.connectError('accountInfoPopup3');
                                    }
                                );
                                
                            } else {
                                return t.connectError('accountInfoPopup3' , data.msg);
                            }
                        } , 
                        function (data) {
                            return t.connectError('accountInfoPopup3');
                        }
                    );
                } else {
                    
                    // 3. zebranie tankowan dla kazdego auta i wyslanie w petli
                    var autoId = autoIdArray[counter];
                
                    var jsonForAuto = {};

                    // 3.1 pobrac auto
                    var auto = t.collection.get(autoId);
                    jsonForAuto.auto = auto.toJSON();

                    // 3.2 pobrac dla auta tankowania
                    tankowanieColl.fetch({
                        sort: {"data": "desc", "id": "desc"},
                        where: {"id_auto = ?": autoId},
                        success: function(data) {
                            jsonForAuto.tankowanie = data.toJSON();
                            console.log(jsonForAuto);
                            // 3.3 wyslanie jsona na serwer, jako callback odpalenie eventa
                            Synchro.setAutoData(jsonForAuto,
                                function(data) {
                                    console.log(data);
                                    if (data.ok == 1) {
                                        t.trigger('sent');
                                    } else {
                                        return t.connectError('accountInfoPopup3' , data.msg);
                                    }
                                } , 
                                function (data) {
                                    return t.connectError('accountInfoPopup3');
                                }
                            );
                        },
                        reset: true
                    });
                };
                // zwiekszenie licznika
                counter++;
            });
               
            t.trigger('sent');
        },
        
        synchroGetFromServer: function(event) {
            $.mobile.loading( 'show', {
                text: Lang.getText('prosze_czekac')+'...',
                textVisible: true,
                theme: 'a',
                html: ""
            });
            var formData = Common.formToJSON(this.$el.find('form'));
            console.log(formData);
            
            // 1. zliczyc wszystkie auta do odebrania
            var autoIdArray = [];
            for(key in formData) {
                if ( (/^auto_/).test(key) ) {
                    var autoId = formData[key];
                    autoIdArray.push(autoId)
                }
            }
            console.log(autoIdArray);
            
            
            // 1. pobrac z serwera dane tankowan dla tych aut
            
            // 2. definicja eventu okreslajacego koniec wysylania, event rowniez odswieza info dla klienta
            var tankowanieModel = new TankowanieModel();
            
            
            var count = autoIdArray.length;
            var counter = 0;
            
            var t = this;
            
            t.off('getOne');
            t.on('getOne', function(event) {
                if (counter >= count) {
                    // 4. koniec odbierania
                    $.mobile.loading("hide");
                    var popup = t.$el.find("#accountInfoPopup4");
                    popup.find("div[data-role='header'] h1").html( Lang.getText('informacja') );
                    popup.find("div[data-role='content']").html( Lang.getText('dane_pobrane_z_serwera') );
                    popup.popup("open"); 
                } else {
                    
                    // 3. zebranie tankowan dla kazdego auta i wyslanie w petli
                    var autoId = autoIdArray[counter];
                
                    Synchro.getAutoData(autoId,
                        function(data) {
                            console.log(data);
                            if (data.ok == 1) {
                                
                                var tankowanieCounter = data.tankowania.length;
                                var tankowanieCount = 0;
                                t.off('tankowanieOne');
                                t.on('tankowanieOne', function (event) {
                                    tankowanieCount++;
                                    if (tankowanieCount >= tankowanieCounter) {
                                        // 3. trigger getOne
                                        t.trigger('getOne');
                                    };
                                });
                                
                                
                                // 1. usuniecie auto o tym id i ewentualne jego tankowania
                                var nowDate = new Date();
                                data.auto.opis += ' [SYNCHRO. ' + Common.getDateObjAsString(nowDate) + ' ' + nowDate.toLocaleTimeString()+']';
                                data.auto.synchro = 0;
                                delete(data.auto.id);
                                
                                var autoModel = new AutoModel();
                                autoModel.save(data.auto, {
                                    success : function (newAutoData) {
                                        console.log('auto nowe ');
                                        console.log(newAutoData);
                                        
                                        if (data.tankowania.length > 0) {
                                            $.each(data.tankowania, function (i, one) {
                                                delete(one.id);
                                                one.id_auto = newAutoData.id;
                                                
                                                console.log('tankowanie nowe');
                                                console.log(one);
                                                
                                                tankowanieModel.save(one, {
                                                    success : function (result) {
                                                        console.log('auto '+autoId+', tankowanie '+ one.id +' dodane do systemu');
                                                        t.trigger('tankowanieOne');
                                                    }
                                                });
                                            });
                                        }
                                        else {
                                            t.trigger('tankowanieOne'); 
                                        }
                                    }
                                });
                                 
                            } else {
                               return t.connectError('accountInfoPopup4' , data.msg);
                            }
                        } , 
                        function (data) {
                            return t.connectError('accountInfoPopup4');
                        }
                    )
                };
                // zwiekszenie licznika
                counter++;
            });
               
            t.trigger('getOne');
        },
        
        accountLogin: function(event) {
            $.mobile.loading("show");
            var formData = Common.formToJSON(this.$el.find('form'));
            console.log(formData);
            
             if (this.validateForm(formData)) {
                // tworzymy konto
                var t = this;
                Synchro.login(formData.login, formData.pass, 
                    function (data) {
                        console.log(data);
                        if (data.ok == 1) {
                            
                            var json = t.ustawieniaJson;
                            json.login = formData.login;
                            json.pass  = formData.pass;
                            
                            // 1. zapisujemu login i pass do lokalnej bazy ustawien
                            t.ustawienia.save(json, {
                                success : function (res) {
                                    // 2. przekierowanie do formularza synchronizacji pojazdow
                                    t.renderExport();
                                    $.mobile.loading("hide");
                                }
                            });
                            
                        } else {
                            return t.connectError('accountInfoPopup2' , data.msg);
                        }
                        
                    },
                    function(data) {
                        return t.connectError('accountInfoPopup2');
                    }
                );
             } else {
                 $.mobile.loading("hide");
             };
             
             return false;
        },
        accountCreate: function(event) {
            $.mobile.loading("show");
            var formData = Common.formToJSON(this.$el.find('form'));
            console.log(formData);
            
            if (this.validateForm(formData)) {
                // tworzymy konto
                var t = this;
                Synchro.createAccount(formData.login, formData.pass, 
                    function (data) {
                        console.log(data);
                        if (data.ok == 1) {
                            
                            var json = t.ustawieniaJson;
                            json.login = formData.login;
                            json.pass  = formData.pass;
                            
                            // 1. zapisujemu login i pass do lokalnej bazy ustawien
                            t.ustawienia.save(json, {
                                success : function (res) {
                                    // 2. przekierowanie do formularza synchronizacji pojazdow
                                    t.renderExport();
                                    $.mobile.loading("hide");
                                }
                            });
                            
                        } else {
                            return t.connectError('accountInfoPopup' , data.msg);
                        }
                        
                    },
                    function(data) {
                        return t.connectError('accountInfoPopup');
                    }
                );
            } else {
                $.mobile.loading("hide");
            };
            
            return false;
        },
        
        validateForm : function (json) {
			
			this.$el.find('span.error').html('').removeClass('error');
			this.$el.find('span.info').html('').removeClass('info');
			
			var result = true;
			var t = this;
			_.each(json , function (val,key){
				switch (key) {
					case "login" :
						if (val == "") {
							t.$el.find('input[name="'+key+'"]').next('span').html( Lang.getText('pole_wymagane') ).addClass('error');
							result = false;
						}
						else if (!(/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/).test(val)) {
							t.$el.find('input[name="'+key+'"]').next('span').html( Lang.getText('to_nie_jest_email') ).addClass('error');
							result = false;
						}
						break;
					case "pass" :
						if (val == "") {
							t.$el.find('input[name="'+key+'"]').next('span').html( Lang.getText('pole_wymagane') ).addClass('error');
							result = false;
						} else if (!(/([a-zA-Z0-9]){3}/).test(val)) {
							t.$el.find('input[name="'+key+'"]').next('span').html( Lang.getText('haslo_za_krotkie') ).addClass('error');
							result = false;
						}
						break;
                    case "pass2" :
						if (val == "") {
							t.$el.find('input[name="'+key+'"]').next('span').html( Lang.getText('pole_wymagane') ).addClass('error');
							result = false;
						}
						else if (typeof json.pass === "undefined" || json.pass != val) {
							t.$el.find('input[name="'+key+'"]').next('span').html( Lang.getText('zle_potwierdzenie_hasla') ).addClass('error');
							result = false;
						}
						break;
				};
			});
			
			return result;
			
		},
        
        /**
         * sprawdzamy czy sa ustawione dane do konta
         * jak TAK to probojemy zalogwac
         * jak logowanie OK to idziemy do renderExport
         * jak NIE to pytanie o dane lub create account
         */
        render: function() {

            var json    = this.ustawienia.toJSON();
            var login   = json.login;
            var pass    = json.pass;

            console.log(json);

            if (typeof login === "undefined" || typeof pass === "undefined") {
                this.renderAccountCreate();
            }
            else {
                this.renderAccountLogin();
            }
        },
        
        renderAccountCreate: function() {
            this.template = _.template($("script#synchroEditAccountCreate").html(), {});
            this.$el.html(this.template);
            
            Lang.translate(this.$el);
            
            this.$el.page().trigger('pagecreate');
            
            return this;
        },
        renderAccountLogin: function() {
            this.template = _.template($("script#synchroEditAccountLogin").html(), {"ustawienia": this.ustawienia});
            this.$el.html(this.template);
            
            Lang.translate(this.$el);
            
            this.$el.page().trigger('pagecreate');
            
            return this;
        },
        renderExport: function(userId) {
            // pobranie wszystkich samochodow
            this.template = _.template($("script#synchroExport").html(), {"collection": this.collection, "userId": userId});
            this.$el.html(this.template);
            
            Lang.translate(this.$el);
            
            this.$el.page().trigger('pagecreate');
            return this;
        },
        renderImport: function() {
            $.mobile.loading("show");
            
            var t = this;
            Synchro.getAuta(function (data) {
                console.log(data);
                
                if (data.ok == 1) {
                    t.template = _.template($("script#synchroImport").html(), {"collection": data.auta});
                    t.$el.html(t.template);
                    
                    Lang.translate(t.$el);
                    
                    t.$el.page().trigger('pagecreate');
                    $.mobile.loading("hide");
                } else {
                    t.renderExport();
                    
                    var popup = t.$el.find("#accountInfoPopup3");
                    popup.find("div[data-role='content']").html(data.msg);
                    popup.popup("open");
                    $.mobile.loading("hide");
                }
            }, function (data) {
                t.renderExport();
                
                var popup = t.$el.find("#accountInfoPopup3");
                popup.find("div[data-role='content']").html('Connection problem, please try again later');
                popup.popup("open");

                console.log(data);
                $.mobile.loading("hide");
            });
        },
        
        connectError : function (divNameId, msg) {
            // to nie powinno sie wydarzyc
            // chyba ze nie ma netu lub serwer nie dziala
            
            if (typeof msg === "undefined") {
                msg = Lang.getText('problem_z_polaczeniem' );
            }
            
            var popup = this.$el.find("#"+divNameId);
            popup.find("div[data-role='content']").html( msg );
            
            $.mobile.loading("hide");
            
            popup.popup("open");
            return false;
        }
    });

    return SynchroView;

});