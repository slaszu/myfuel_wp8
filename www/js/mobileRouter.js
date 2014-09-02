// Mobile Router
// =============

// Includes file dependencies
define([
"jquery",
"backbone",
"common",
"session",
"lang",
"models/AutoModel",
"collections/AutoCollection",
"views/AutoView",
"views/AutoEditView",
"models/TankowanieModel",
"collections/TankowanieCollection",
"views/TankowanieView",
"views/TankowanieEditView",
"views/WykresView",
"views/UstawieniaEditView",
"views/PodsumowanieView",
    "models/UstawieniaModel",
    "views/SynchroView"
],
        function($,
                Backbone,
                Common,
                Session,
                Lang,
                AutoModel,
                AutoCollection,
                AutoView,
                AutoViewEdit,
                TankowanieModel,
                TankowanieCollection,
                TankowanieView,
                TankowanieViewEdit,
                WykresView,
                UstawieniaViewEdit,
                PodsumowanieView,
                UstawieniaModel,
                SynchroView
                )
        {

            var Router = Backbone.Router.extend({
		initialize: function() {
			
			// inicjalizacja widokow
                    this.autoView = new AutoView({el: "#auto-lista", collection: new AutoCollection()});
                    this.autoEditView = new AutoViewEdit({el: "#auto-edit"});
                    this.tankowanieView = new TankowanieView({el: "#tankowanie-lista", collection: new TankowanieCollection()});
                    this.tankowanieEditView = new TankowanieViewEdit({el: "#tankowanie-edit"});
                    this.wykresView = new WykresView({el: "#wykres", collection: new TankowanieCollection()});
                    this.ustawieniaEditView = new UstawieniaViewEdit({el: "#ustawienia-edit"});
                    this.podsumowanieView = new PodsumowanieView({el: "#podsumowanie", collection: new TankowanieCollection()});
                    this.synchroView = new SynchroView({el: '#synchro', collection: new AutoCollection()});

			
			// to na koncu construktora
			Backbone.history.start();
        },
        // Backbone.js Routes
        routes: {
			"": 					"loading",
                    "synchro": "synchro",
			"auto-lista": 			"autoList",
                    "auto-edit": "autoNew",
                    "auto-edit?:id": "autoEdit",
			"tankowanie-lista": 	"tankowanieLista",
                    "tankowanie-edit": "tankowanieNew",
                    "tankowanie-edit?:id": "tankowanieEdit",
                    "wykres?:typ,:typ2": "wykres",
                    "wykres?:typ": "wykres",
                    "wykres": "wykres",
                    "ustawienia-edit": "ustawieniaEdit",
                    "podsumowanie": "podsumowanie"
        },
		synchro: function() {
                    console.log('router:synchro', Session);

                    $.mobile.loading("show");

                    var view = this.synchroView;
                    
                    var ustawieniaModel = new UstawieniaModel({id: Session.ustawieniaId});
                    ustawieniaModel.fetch({
                        success: function(ustawieniaModel) {
                            view.ustawienia = ustawieniaModel;
                            view.ustawieniaJson = ustawieniaModel.toJSON();
                            
                            view.collection.fetch({
                                sort: {"synchro": "desc", "nazwa": "asc"},
                                success: function(data) {
                                    view.render();
                                    
                                    $.mobile.changePage("#synchro", {reverse: false, changeHash: false});
                                    $.mobile.loading("hide");
                                },
                                reset: true
                            });

                        }
                    });

                },
                podsumowanie: function() {
                    console.log('router:podsumowanie', Session);

                    $.mobile.loading("show");

                    var view = this.podsumowanieView;
                    var autoCol = new AutoCollection();

                    Session.run(function() {
                        view.auto = Session.autoModel;
                        //view.offset = 0;
                        view.collection.fetch({
                            sort: {"data": "desc", "id": "desc"},
                            where: {"id_auto = ?": view.auto.get('id')},
                            success: function(data) {
                                view.render();
                                Lang.translate($('#podsumowanie'));

                                $('#podsumowanie').page().trigger('pagecreate');

                                $.mobile.changePage("#podsumowanie", {reverse: false, changeHash: false});
                                $.mobile.loading("hide");
                            },
                            reset: true
                        })
                    });
                },
		loading: function() {
			console.log('router:loading');
			
			$.mobile.loading( "show" );
							
			setTimeout(function() {
				navigator.splashscreen.hide();
				Session.run(function() {
					$.mobile.changePage( "#tankowanie-lista" , { reverse: false, changeHash: true } );
				})
			}, 1000);
			
		},
		
		ustawieniaEdit: function() {
			console.log('router:ustawieniaEdit');
			
                    $.mobile.loading("show");
			
			var t = this;
                    var ustawieniaModel = new UstawieniaModel({id: Session.ustawieniaId});
			ustawieniaModel.fetch({
                        success: function(ustawieniaModel) {
				
					if (!ustawieniaModel.isValid()) {
						Session.setDefault(function () {
							ustawieniaModel.set(Session);
							t.ustawieniaEditRender(ustawieniaModel);
						});
					} else {
						Session.setUstawienia(ustawieniaModel);
						t.ustawieniaEditRender(ustawieniaModel);
					}
				}
			});
			
		},
		ustawieniaEditRender : function (ustawieniaModel) {
			var view = this.ustawieniaEditView;
			view.ustawienia = ustawieniaModel;
			view.render();
			Lang.translate($('#ustawienia-edit'));
			
			$('#ustawienia-edit').page().trigger('pagecreate');
			
			$.mobile.changePage( "#ustawienia-edit", { reverse: false, changeHash: false } );
			$.mobile.loading( "hide" );
		},
		
		wykres: function(typ, typ2) {
			console.log('router:wykres', typ, typ2);
			
			$.mobile.loading( "show" );
			
			if (typeof typ == 'undefined') {
				typ = 'spalanie';
			}
			if (typeof typ2 == 'undefined') {
				typ2 = 'month';
			}
			var view = this.wykresView;
			view.typ = typ;
			view.typ2 = typ2;
			
			var autoCol = new AutoCollection();
			
			Session.run(function() {
				view.auto = Session.autoModel;
				view.render();
				Lang.translate($('#wykres'));
				$('#wykres').page().trigger('pagecreate');
				view.renderWykres(function() {
					$.mobile.changePage( "#wykres" , { reverse: false, changeHash: false } );
					$.mobile.loading( "hide" );
				})
			})
			
		},
		
		tankowanieLista: function() {
			console.log('router:tankowanieLista', Session);
			
			$.mobile.loading( "show" );
			
			var view = this.tankowanieView;
			var autoCol = new AutoCollection();
			
			Session.run(function() {			
				view.auto = Session.autoModel;
				view.offset = 0;
				view.collection.fetch({
					sort : {"data" : "desc", "id" : "desc"},
					where : {"id_auto = ?" : view.auto.get('id')},
					limit : {offset : view.offset , limit : Session.limit + 1},
					success : function(data) {
						view.render();
						Lang.translate($('#tankowanie-lista'));
						
						$('#tankowanie-lista').page().trigger('pagecreate');
						
                                $.mobile.changePage("#tankowanie-lista", {reverse: false, changeHash: false});
                                $.mobile.loading("hide");
                            },
                            reset: true
				})
			})
		
		},
		
		tankowanieNew: function() {
			console.log('router:tankowanieNew');
			
			$.mobile.loading( "show" );
			
			var autoCol = new AutoCollection();
			var view = this.tankowanieEditView;
			
			Session.run(function() {
				view.auto = Session.autoModel;
				delete(view.tankowanie);
				delete(view.tankowanieNext);
				
				var tankowanieColl = new TankowanieCollection();
				tankowanieColl.fetch({
					sort : {"data" : "desc", "id" : "desc"},
					where : {"id_auto = ?" : view.auto.get("id")},
					limit : {"limit" : 1},
					success : function(data) {
						view.tankowanieLast = data.at(0);
						view.render();
						Lang.translate($('#tankowanie-edit'));
						
						$('#tankowanie-edit').page().trigger('pagecreate');
						
                                $.mobile.changePage("#tankowanie-edit", {reverse: false, changeHash: false});
                                $.mobile.loading("hide");
                            },
                            reset: true
				})
			})
			
		},
		
		tankowanieEdit: function(id) {
			console.log('router:tankowanieEdit '+id);
			
			$.mobile.loading( "show" );
			
			var autoCol = new AutoCollection();
			var view = this.tankowanieEditView;
			
			Session.run(function() {
				if(id > 0) {
				
					var tankowanieModel = new TankowanieModel({'id':id});
					tankowanieModel.fetch({
						success: function (model) {
							view.auto = Session.autoModel;
							view.tankowanie = model;
							var tankowanieColl = new TankowanieCollection();
							tankowanieColl.fetch({
								sort : {"data" : "desc", "id" : "desc"},
								where : {"id_auto = ?" : view.auto.get("id") , "id < ? ": model.get('id')},
								limit : {"limit" : 1},
								success : function(data) {
									view.tankowanieLast = data.at(0);
									tankowanieColl.fetch({
										sort : {"data" : "desc", "id" : "desc"},
										where : {"id_auto = ?" : view.auto.get("id") , "id > ? ": model.get('id')},
										limit : {"limit" : 1},
										success : function(data) {
											view.tankowanieNext = data.at(0);
											view.render();
											Lang.translate($('#tankowanie-edit'));
											
											$('#tankowanie-edit').page().trigger('pagecreate');
											
											$('#tankowanie-edit>input[type="checkbox"]').checkboxradio("refresh");
											$.mobile.changePage( "#tankowanie-edit", { reverse: false, changeHash: false } );
											$.mobile.loading( "hide" );
										}
									});
                                        },
                                        reset: true
							});
						}
					});
				} else {
					$.mobile.changePage( "#tankowanie-lista" , { reverse: false, changeHash: true } );
				}
			})
		},
		
autoList: function() {
                    console.log('router:autoLista');

                    $.mobile.loading("show");

                    var view = this.autoView;
                    view.collection.fetch({
                        sort: {"synchro": "desc", "nazwa": "asc"},
                        success: function(data) {
                            view.render();
                            Lang.translate($('#auto-lista'));

                            $('#auto-lista').page().trigger('pagecreate');
                            $.mobile.changePage("#auto-lista", {reverse: false, changeHash: false});
                            $.mobile.loading("hide");
                        },
                        reset: true
                    });
                },
		autoNew: function() {
			console.log('router:autoNew');
		
			$.mobile.loading( "show" );
			
			var view = this.autoEditView;
			delete(view.auto);
			view.render();
			Lang.translate($('#auto-edit'));
			
			$('#auto-edit').page().trigger('pagecreate');
			$.mobile.changePage( "#auto-edit", { reverse: false, changeHash: false } );
			$.mobile.loading( "hide" );
		},
		
        autoEdit: function(id) {
			console.log('router:autoEdit ', id);
			
			$.mobile.loading( "show" );
			if(id > 0) {
				var autoModel = new AutoModel({'id':id});
				var view = this.autoEditView;
				autoModel.fetch({
					success: function (model) {
						view.auto = autoModel;
						view.render();
						Lang.translate($('#auto-edit'));
						
						$('#auto-edit').page().trigger('pagecreate');
						$.mobile.changePage( "#auto-edit", { reverse: false, changeHash: false } );
						$.mobile.loading( "hide" );
					}
				});
			} 
		}

    } );

    // Returns the Router class
    return Router;

} );