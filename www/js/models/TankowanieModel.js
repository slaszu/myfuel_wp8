// Category Model
// ==============

// Includes file dependencies
define([ "jquery", "backbone", "common" ], function( $, Backbone, Common ) {

    // The Model constructor
    var Tankowanie = Backbone.Model.extend( {
		className: 'tankowanie',
		defaults: {
			"data":  	'',
			"przebieg":	'',
			"ilosc": 	'',
			"cena":		'',
			"spalanie":	'',
			"r":		0,
			"f":		0,
			"id_auto":	0
		},
		initialize: function(){
            if (this.attributes.data == '') {
				this.attributes.data = Common.getDateObjAsString(new Date());				
			}
        }
    } );

    // Returns the Model class
    return Tankowanie;

} );