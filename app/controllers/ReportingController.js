function merge_options(obj1,obj2){ // @TODO: reusable logic belongs elsewhere
	// But without build script, we don't need another http request to slow us down even more!
    var obj3 = {};
    for (var attrname in obj1) { obj3[attrname] = obj1[attrname]; }
    for (var attrname in obj2) { obj3[attrname] = obj2[attrname]; }
    return obj3;
}

var Paginator =  function(data, config) {
	this.data = data;
	config = merge_options({ // set some defaults
		perPage : 10
	}, config || {});
	this.perPage = config.perPage;
	this.currentPage = 0;
};

Paginator.prototype.setData = function(data) {
	this.data = data;
	return this.get(this.currentPage);
}

Paginator.prototype.get = function(page) {
	var start = page * this.perPage,
		end   = (page + 1) * this.perPage;
	this.currentPage = page;
	return this.data.slice(start,end); // return data from main array based on perPage and current page
};

Paginator.prototype.getPagesArray = function() {
	// return pages as array of strings containing page number
	// returning number as array allows us to loop over this array in the view to create pagination buttons
	var noOfPages = Math.ceil(this.data.length / this.perPage),
		pagesArray = [];
	for (var i = 0; i < noOfPages; i++) {
		pagesArray.push(i);
	}
	return pagesArray;
}

Paginator.prototype.setPerPage = function(perPage) {
	this.perPage = perPage;
}


app.controller('ReportingController', function ($scope, reportingModel)
{
	$scope.pages = []; // initialize vars
	$scope.countryViews = reportingModel.countries; // Set the data from the model

	var paginator = new Paginator(reportingModel.countries); // create a new paginator from Paginator class
	
	$scope.paginateTo = function(page) { // called when pagination button is pressed, updates the data available in the scope
		$scope.countryViews = paginator.get(page);
	};

	$scope.setPerPage = function(number) {
		// called when number of rows button pressed, uses paginator class to reset values after changing defaults
		paginator.setPerPage(number)
		$scope.paginateTo(0); // I find it tidier to go back to the beginning when changing no of results
		$scope.pages = paginator.getPagesArray();
	};

	$scope.pages = paginator.getPagesArray(); // initialize the view
	$scope.paginateTo($scope.currentPage = 0);

	// Simulate getting data from the server
	$scope.countryViews = paginator.setData(reportingModel.setDataViewCount());
	setInterval(function(){
		paginator.setData(reportingModel.setDataViewCount());
		$scope.$apply();
	}, 1000);
	
});







