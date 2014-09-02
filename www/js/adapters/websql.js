define([ "jquery", "backbone", "db", "common" ], function( $, Backbone, Db, Common ) {

	/**
	* inicjalizacja bazy danych
	* ----------------------------------------
	*/
	db = Db.get();
	db.transaction(function(tx) {
		
		//tx.executeSql('DROP TABLE IF EXISTS "auto"');
		//tx.executeSql('DROP TABLE IF EXISTS "tankowanie"');
		//tx.executeSql('DROP TABLE IF EXISTS "ustawienia"');
	
		tx.executeSql('CREATE TABLE IF NOT EXISTS "auto" ("id" INTEGER PRIMARY KEY  AUTOINCREMENT  NOT NULL , "nazwa" VARCHAR, "opis" VARCHAR, "aktywny" BOOL DEFAULT 0)');
		tx.executeSql('CREATE TABLE IF NOT EXISTS "tankowanie" ("id" INTEGER PRIMARY KEY AUTOINCREMENT  NOT NULL ,"data" DATETIME DEFAULT (CURRENT_TIMESTAMP) ,"przebieg" INTEGER,"ilosc" DECIMAL(6,2),"cena" DECIMAL(5,2), "spalanie" DECIMAL(6,2), "r" BOOL DEFAULT 0, "f" BOOL DEFAULT 0,"id_auto" INTEGER)');
		tx.executeSql('CREATE INDEX IF NOT EXISTS tank_r ON tankowanie(r ASC)');
		tx.executeSql('CREATE INDEX IF NOT EXISTS tank_f ON tankowanie(f ASC)');
		tx.executeSql('CREATE INDEX IF NOT EXISTS tank_id_auto ON tankowanie(id_auto ASC)');
		tx.executeSql('CREATE INDEX IF NOT EXISTS auto_aktywne ON auto(aktywny ASC)');
		
		//tx.executeSql('update tankowanie set spalanie = ""');
		
		tx.executeSql('CREATE TABLE IF NOT EXISTS "ustawienia" ("id" INTEGER PRIMARY KEY NOT NULL , "dlugosc" VARCHAR, "pojemnosc" VARCHAR, "waluta" VARCHAR)');
		
		// dodanie kolumny 
		tx.executeSql('SELECT lang FROM "ustawienia" LIMIT 1', [], function () {
			console.log("pole ustawienia.lang istnieje");
		}, function () {
			console.log("pole ustawienia.lang nieistnieje");
			tx.executeSql('ALTER TABLE "ustawienia" ADD COLUMN "lang" VARCHAR')
		});
        
        // dodoanie mail , pass
        tx.executeSql('SELECT login FROM "ustawienia" LIMIT 1', [], function () {
			console.log("pole ustawienia.login istnieje");
		}, function () {
			console.log("pole ustawienia.login nieistnieje");
			tx.executeSql('ALTER TABLE "ustawienia" ADD COLUMN "login" VARCHAR');
            tx.executeSql('ALTER TABLE "ustawienia" ADD COLUMN "pass" VARCHAR');
		});
        
        // auto.synchro
        tx.executeSql('SELECT synchro FROM "auto" LIMIT 1', [], function () {
			console.log("pole auto.synchro istnieje");
		}, function () {
			console.log("pole auto.synchro nieistnieje");
			tx.executeSql('ALTER TABLE "auto" ADD COLUMN "synchro" TINYINT DEFAULT 1');
        });
        
        // ustawienia.keyboard (1- number , 2- normal)
        tx.executeSql('SELECT keyboard FROM "ustawienia" LIMIT 1', [], function () {
			console.log("pole ustawienia.keyboard istnieje");
		}, function () {
			console.log("pole ustawienia.keyboard nieistnieje");
			tx.executeSql('ALTER TABLE "ustawienia" ADD COLUMN "keyboard" TINYINT DEFAULT 1');
        });
        
		console.log("createIfNotExists finished");
	});

	
	/**
	* ogolna definicja adaptera
	* -------------------------------------
	*/
	
	var Adapter = {
		find : function () {
			alert('methoda find nie jest zaimplementowana w wykorzystanym adapterze! ');
			console.log(this);
		},
		findAll : function () {
			alert('methoda findAll nie jest zaimplementowana w wykorzystanym adapterze! ');
			console.log(this);
		},
		create : function () {
			alert('methoda create nie jest zaimplementowana w wykorzystanym adapterze! ');
			console.log(this);
		},
		update : function () {
			alert('methoda update nie jest zaimplementowana w wykorzystanym adapterze! ');
			console.log(this);
		},
		destroy : function () {
			alert('methoda destroy nie jest zaimplementowana w wykorzystanym adapterze! ');
			console.log(this);
		},
		_executeSql : function (SQL, params, successCallback, errorCallback) {
			var t = this;
			var success = function(tx,result) {
				if(t.debug) {console.log(SQL); console.log(params, " - finished: ", result);}
				if(successCallback) successCallback(tx,result);
			};
			var error = function(tx,error) {
				if(t.debug) {console.error(SQL, params, " - error: " + error)};
				if(errorCallback) errorCallback(tx,error);
			};
			this.db.transaction(function(tx) {
				tx.executeSql(SQL, params, success, error);
			});
		}
	};
	
	var AutoAdapter = {};
	_.extend(AutoAdapter, Adapter);
	_.extend(AutoAdapter, {
		
		create : function (model,success,error) {
			var json = model.toJSON();
			var aktywny = 0;
			if (typeof json.aktywny !== "undefined") {
				aktywny = json.aktywny;
			}
            
            this._executeSql("INSERT INTO auto (`nazwa`,`opis`,`aktywny`,`synchro`) VALUES(?,?,?,?);",[json.nazwa, json.opis, aktywny, json.synchro], success, error);
        },
		
		destroy : function (model, success, error) {
			var json = model.toJSON();
            
            this._executeSql("DELETE FROM auto WHERE(`id`=?);",[json.id], function(tx, res) {
                tx.executeSql('DELETE FROM tankowanie WHERE id_auto = ?', [json.id], success, error);
            }, error);
		},
		
		find : function (model, success, error) {
			var json = model.toJSON();
			this._executeSql("SELECT * FROM auto WHERE(`id`=?);",[json.id], success, error);
		},
		
		findAll : function (model, success, error, options) {
			var sql = "SELECT * FROM auto";
			if(typeof options.where === 'object') {
				sql += " WHERE "+Common.getWhereSql(options.where);
			}
			if(typeof options.sort === 'object') {
				sql += " ORDER BY "+Common.getSortSql(options.sort);
			}
			this._executeSql(sql,null, success, error);			
		},
		
		update : function (model, success, error, options) {
			var json = model.toJSON();
			
			var sql = [];
			
			if (json.aktywny == 1) {
				this._executeSql("UPDATE auto SET aktywny = 0;",[], function (tx, res) {
					tx.executeSql("UPDATE auto SET `nazwa`=?, opis=?, aktywny =?, synchro =? WHERE(`id`=?);",[json.nazwa, json.opis, json.aktywny, json.synchro, json.id], success, error);
				}, error);
			}
			else {
				this._executeSql("UPDATE auto SET `nazwa`=?, opis=?, aktywny =?, synchro =? WHERE(`id`=?);",[json.nazwa, json.opis, json.aktywny, json.synchro, json.id], success, error);
			}
		}
	});
	
	
	var TankowanieAdapter = {};
	_.extend(TankowanieAdapter, Adapter);
	_.extend(TankowanieAdapter, {
		create : function (model,success,error) {
			var json = model.toJSON();
			/*
			"data":  	null,
			"przebieg":	0,
			"ilosc": 	0,
			"cena":		0,
			"spalanie":	0,
			"r":		0,
			"f":		0,
			"id_auto":	0
			*/
			
			this._executeSql("INSERT INTO tankowanie ('data','przebieg','ilosc','cena','spalanie','r','f','id_auto') VALUES(?,?,?,?,?,?,?,?);",
							[json.data, json.przebieg, json.ilosc, json.cena, json.spalanie, json.r, json.f, json.id_auto],
							success, error);
		},
		
		destroy : function (model, success, error) {
			var json = model.toJSON();
			this._executeSql("DELETE FROM tankowanie WHERE(`id`=?);",[json.id],success, error);
		},
		
		find : function (model, success, error) {
			var json = model.toJSON();
			this._executeSql("SELECT * FROM tankowanie WHERE(`id`=?);",[json.id], success, error);
		},
		
		findAll : function (model, success, error, options) {
			if(typeof options.cols === 'object') {
				var sql = "SELECT "+Common.getColsSql(options.cols)+" FROM tankowanie";
			}
			else {
				var sql = "SELECT * FROM tankowanie";
			}
			if(typeof options.where === 'object') {
				sql += " WHERE "+Common.getWhereSql(options.where);
			}
			if(typeof options.group === 'object') {
				sql += " GROUP BY  "+Common.getGroupSql(options.group);
			}
			
			if(typeof options.sort === 'object') {
				sql += " ORDER BY "+Common.getSortSql(options.sort);
			}
			if(typeof options.limit === 'object') {
				sql += " LIMIT "+Common.getLimitSql(options.limit);
			}
			this._executeSql(sql,null, success, error);			
		},
		
		update : function (model, success, error, options) {
			var json = model.toJSON();
			
			/*
			"data":  	null,
			"przebieg":	0,
			"ilosc": 	0,
			"cena":		0,
			"spalanie":	0,
			"r":		0,
			"f":		0,
			"id_auto":	0
			*/
			
			if (options.edit == true) {
				this._executeSql("UPDATE tankowanie SET data=?, przebieg=?, ilosc =?, cena =?, spalanie =?, r =?, f =?, id_auto =? WHERE(`id`=?);",
								[json.data, json.przebieg, json.ilosc, json.cena, json.spalanie, json.r, json.f, json.id_auto, json.id],
								function(tx,res) {
									// ustawienie nowszych tankowan (jezeli istnieja) na spalane = null, co spowoduje ponowne wyliczenie 
									tx.executeSql('UPDATE tankowanie SET spalanie = "" WHERE id > ? AND id_auto = ?',[json.id, json.id_auto], success, error);
								}
								, error);
			}else {
				this._executeSql("UPDATE tankowanie SET data=?, przebieg=?, ilosc =?, cena =?, spalanie =?, r =?, f =?, id_auto =? WHERE(`id`=?);",
								[json.data, json.przebieg, json.ilosc, json.cena, json.spalanie, json.r, json.f, json.id_auto, json.id],
								success, error);
			}
		}
	});

	var UstawieniaAdapter = {};
	_.extend(UstawieniaAdapter, Adapter);
	_.extend(UstawieniaAdapter, {
		
		create : function (model,success,error) {
			var json = model.toJSON();
			this._executeSql("INSERT INTO ustawienia (`dlugosc`,`pojemnosc`,`waluta`,`lang`,`keyboard`) VALUES(?,?,?,?,?);",[json.dlugosc, json.pojemnosc, json.waluta, json.lang, json.keyboard], success, error);
		},
		
		destroy : function (model, success, error) {
			var json = model.toJSON();
			//this._executeSql("DELETE FROM ustawienia WHERE(`id`=?);",[json.id],success, error);
		},
		
		find : function (model, success, error) {
			var json = model.toJSON();
			this._executeSql("SELECT * FROM ustawienia WHERE(`id`=?);",[json.id], success, error);
		},
		
		findAll : function (model, success, error, options) {
			var sql = "SELECT * FROM ustawienia";
			if(typeof options.where === 'object') {
				sql += " WHERE "+Common.getWhereSql(options.where);
			}
			if(typeof options.sort === 'object') {
				sql += " ORDER BY "+Common.getSortSql(options.sort);
			}
			this._executeSql(sql,null, success, error);			
		},
		
		update : function (model, success, error, options) {
			var json = model.toJSON();
			this._executeSql("UPDATE ustawienia SET `dlugosc`=?, pojemnosc=?, waluta =?, lang=?, login=?, pass=?, keyboard=? WHERE(`id`=?);",[json.dlugosc, json.pojemnosc, json.waluta, json.lang, json.login, json.pass, json.keyboard, json.id],
                function(tx,res) {
                    if (res.rowsAffected <= 0) {
                        // jezeli nie udalo sie zaktualizowac to dodoac jako insert
                        tx.executeSql("INSERT INTO ustawienia (`dlugosc`,`pojemnosc`,`waluta`,`lang`,`keyboard`,`id`) VALUES(?,?,?,?,?,?);",[json.dlugosc, json.pojemnosc, json.waluta, json.lang, json.keyboard, json.id], success, error);
                    }
                    else {
                        success(tx, res);
                    }
                }
                , error);
		}
	});
	
	
	/**
	* implementacja metody do synchronizacji
	* --------------------------------------------
	*/
    Backbone.sync = function (method, model, options) {
		
		//console.log(method, model, options, "Backbone.sync");
		
		var className = '';
		if (typeof model.model !== 'undefined') {
			// collection
			var modelFromColl = new model.model;
			className = modelFromColl.className;
		}
		else{
			// model
			className = model.className;
		}
		
		var adapter;
		switch(className) {
			case 'auto' :
				adapter = AutoAdapter;
				break;
			case 'tankowanie' :
				adapter = TankowanieAdapter;
				break;
			case 'ustawienia' :
				adapter = UstawieniaAdapter;
				break;
			default : 
				alert("nie rozpoznany parametr className w modelu");
				console.log(model);
				options.error();
				return;
		}
		// ustawienie polaczenia
		adapter.db = db;
		adapter.debug = true;
		
		var error = function (tx,error) {
			console.error("sql error");
			console.error(error);
			console.error(tx);
			options.error(error);
		};
				
		switch (method) {
			case "read":
				if (model.id) {
					var success = function (tx, res) {
						var len = res.rows.length,result, i;
						if (len > 0) {
							result = res.rows.item(0);
						} 
                        
                        if (adapter.debug == 1) {
                            console.log(result);
                        }
                        
						//options.success(model,result,options);
						// powyzsze dziala w bb 0.9, a ponizsze w bb 1.0
                        options.success(result,result,options);
					};
				
					adapter.find(model, success, error);
				} else {
					
					var success = function (tx, res) {
						
						var len = res.rows.length,result, i;
						if (len > 0) {
							result = []

							for (i=0;i<len;i++) {
								//console.log(res.rows.item(i));
								result.push(res.rows.item(i));
							}
						} 
                        
                        if (adapter.debug == 1) {
                            console.log(result);
                        }
                        
						//options.success(model,result,options);
						// powyzsze dziala w bb 0.9, a ponizsze w bb 1.0
						options.success(result,result,options);
					};
					
					adapter.findAll(model, success, error, options);
				}
				break;
			case "create":
				var success = function (tx, res) {
					model.set('id',res.insertId);
					options.success(model, {}, options);
				}
				adapter.create(model, success, error);
				break;
			case "update":
				var success = function (tx, res) {
					options.success(model,{}, options);
				}
				adapter.update(model, success, error, options);
				break;
			case "delete":
				var success = function (tx, res) {
					options.success(model,{}, options);
				}
				adapter.destroy(model, success, error);
				break;
		}
		
	};

} );