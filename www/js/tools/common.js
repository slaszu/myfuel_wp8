define(["jquery", "session"], function ($, Session) {
	var Common = {
		formToJSON : function (form) {
			var array = form.serializeArray();
			result = {};
			for(i in array) {
				name = array[i].name ;
				value = array[i].value;
				
				result[name] = value;
			}
			
			return result;
		},
		
		getColsSql: function(colsObj) {
			var cols = [];
			for(i in colsObj) {
				cols.push(colsObj[i]);
			}
			return cols.join(', ');
		},
		
		getGroupSql: function(groupObj) {
			var group = [];
			for(i in groupObj) {
				group.push(groupObj[i]);
			}
			return group.join(', ');
		},
		
		getSortSql: function(sortObj) {
			var sort = [];
			for(i in sortObj) {
				sort.push(i + ' ' + sortObj[i]);
			}
			return sort.join(', ');
		},
		
		getWhereSql: function(whereObj) {
			var where = [];
			for(i in whereObj) {
				where.push(i.replace("?",whereObj[i]));
			}
			return where.join(' AND ');
		},
		
		getLimitSql: function(limitObj) {
			var limit = [];
			if (typeof limitObj.offset !== 'undefined') {
				limit.push(limitObj.offset);
			}
			if (typeof limitObj.limit !== 'undefined') {
				limit.push(limitObj.limit);
			}
			return limit.join(', ');
		},
		
		getDateAsObject: function(dateString) {
			if (typeof dateString === 'object') {
				return dateString;
			}
		
			var tablica = dateString.split('-');
			
			var date = new Date(tablica[0],tablica[1]-1,tablica[2]);
			return date;
		},
		
		getDateAsString: function(dateString, format) {
			if (typeof format == 'undefined') {
				format = "dddd, d. mmm, yyyy";
			}
			
			return dateFormat(this.getDateAsObject(dateString), format, false, Session.lang);
		},
		
		getDateObjAsString: function(dateObj) {
			
			var dd = dateObj.getDate();
			var mm = dateObj.getMonth()+1; //January is 0!

			var yyyy = dateObj.getFullYear();
			if(dd<10){dd='0'+dd};
			if(mm<10){mm='0'+mm};
			return yyyy+'-'+mm+'-'+dd;
		}
	};
	

	return Common;

});