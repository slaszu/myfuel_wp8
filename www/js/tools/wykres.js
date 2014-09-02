define(["jquery", "common", "jqplot", "jqplot_bar_r", "jqplot_cat_axis_r", "jqplot_point_label", "jqplot_can_text_r","jqplot_can_axis_r" ], function ($, Common) {

	var Wykres = {
		
		_callback : null,
		_collection : null,
		
		_info : 'No data to create graph',
		
		getWykresSpalanie : function (elementId, dataFormat) {
				
			if (typeof dataFormat === 'undefined') {
				dataFormat = "d. mmm, yyyy";
			}
	
			// mamy juz dane , teraz przerabiamy je na tablice
			var line1= [];
			var labels1 = [];
			var collLength = this._collection.length;
			$.each(this._collection.toJSON(), function(index, row){
				if (row.spalanie != '') {
					line1.push([( collLength - index)+'. '+Common.getDateAsString(row.data, dataFormat), row.spalanie]);
					labels1.push(parseFloat(row.spalanie).toFixed(2) + ' l');
				}
			});
			if (line1.length > 0) {
				line1.reverse();
				labels1.reverse();
				this._getWykres(elementId, line1, labels1);
			}
			else {
				$('#'+elementId).html(this._info);
				if (typeof this._callback === 'function') {
					this._callback();
				}
			}	
		},
		
		getWykresCena : function (elementId, dataFormat) {
				
			if (typeof dataFormat === 'undefined') {
				dataFormat = "d. mmm, yyyy";
			}
			
			// mamy juz dane , teraz przerabiamy je na tablice
			var line1= [];
			var labels1 = [];
			var collLength = this._collection.length;
			
			$.each(this._collection.toJSON() , function(index, row){
				if (row.cena != '' && !isNaN(row.cena)) {
					line1.push([(collLength - index)+'. '+Common.getDateAsString(row.data, dataFormat), row.cena]);
					labels1.push(parseFloat(row.cena).toFixed(2) + '');
				}
			});
			if (line1.length > 0) {
				line1.reverse();
				labels1.reverse();
				this._getWykres(elementId, line1, labels1);
			}
			else {
				$('#'+elementId).html(this._info);
				if (typeof this._callback === 'function') {
					this._callback();
				}
			}

		},
		
		_getWykres : function (elementId, line, labels , title) {
			
			$('#'+elementId).html('');
			if (typeof this._callback === 'function') {
				this._callback();
			}
			var plot1 = $.jqplot(elementId, [line], {
						//title: title,
						seriesDefaults: {
							renderer: $.jqplot.BarRenderer,
							shadow: false,
							rendererOptions: {
								barMargin: 3
							}
						},
						grid: {
							shadow: false,
						},
						seriesColors: [ "#FCD31B"],
						series:[
							{pointLabels:{
								show: true,
								labels:labels
							}}
						],
						axesDefaults: {
							tickRenderer: $.jqplot.CanvasAxisTickRenderer ,
							tickOptions: {
							  angle: -90,
							  fontSize: '10pt'
							}
						},
						axes: {
							xaxis:{renderer:$.jqplot.CategoryAxisRenderer},
							yaxis:{padMax:1.3, min:0}
						}
					});
		}
	
	};
	
	return Wykres;
	
});