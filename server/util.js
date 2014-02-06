function extensions () {

	Object.filter = function (obj, fn) {
		var arr = [];
		
		for (var i in obj) {
			if (obj.hasOwnProperty(i) && fn(obj[i])) {
				arr.push(obj[i]);
			}
		}
		
		return arr;
	}
	
	Object.map = function (obj, fn) {
		var arr = [];
		
		for (var i in obj) {
			if (obj.hasOwnProperty(i)) {
				arr.push(fn(obj[i]));
			}
		}
		
		return arr;
	}
	
	if (!Array.prototype.any) {
	
		// Extension method, checks if the filter hits one or more elements in the array
		Array.prototype.any = function (predicator) {
			if (!predicator)
				return this.length > 0;

			var arr = this.filter(predicator);
			return arr.length > 0;
		};
	}

}

module.exports = extensions;