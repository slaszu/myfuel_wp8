// Category Collection
// ===================

// Includes file dependencies
define([ "jquery","backbone","models/AutoModel" ], function( $, Backbone, AutoModel ) {

    // Extends Backbone.Router
    var Collection = Backbone.Collection.extend( {
		// Sets the Collection model property to be a Category Model
        model: AutoModel,

		getAktywne : function(callback) {
			this.fetch({
				where : {"aktywny = ?" : 1},
				success: function (data) {
					callback(data.at(0));
				}
			});
		}
		
    } );

    // Returns the Model class
    return Collection;

} );