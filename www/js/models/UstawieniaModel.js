define([ "jquery", "backbone" ], function( $, Backbone ) {

    var Ustawienia = Backbone.Model.extend( {
		className: 'ustawienia',
		defaults: {
			"dlugosc":  	"",
			"pojemnosc": 	"",
			"waluta": 		"",
			"lang":			"",
            "login":        "",
            "pass":         "",
            "keyboard":     ""
		},
		
		isValid: function () {
		
			if (this.get('dlugosc') != "" && this.get('dlugosc') != null &&
				this.get('pojemnosc') != "" && this.get('pojemnosc') != null &&
				this.get('waluta') != "" && this.get('waluta') != null &&
				this.get('lang') != "" && this.get('lang') != null &&
                this.get('keyboard') != "" && this.get('keyboard') != null)
			{
				return true;
			}
			return false;
		}
    });

    return Ustawienia;

});