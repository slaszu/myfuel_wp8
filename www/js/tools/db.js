define([], function() {
	var Db = {
		get : function() {
			return openDatabase("auto", "1.0", "Glowna baza danych", 2 * 1024 * 1024);
		}
	}
	
	return Db;
});