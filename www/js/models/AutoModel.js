define([ "jquery", "backbone" ], function( $, Backbone ) {

    var Auto = Backbone.Model.extend( {
		className: 'auto',
		defaults: {
			"nazwa":  	"",
			"opis":   	"",
            "synchro":  0
		}
    } );

    return Auto;

});