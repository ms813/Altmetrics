var AmAPI = {
	root :  "http://www.altmetric.com/api/v1/",			//root url for the API
	type : "citations", 								//required by API
	key : "e900514dbfd492278f6cec1f8a955bd3",			//API key	
	num_results : "100",								//max number of results per request (100 if there is an API key, 500 if not)
	order_by : "score",
	timeframe : "1y",									//look for articles in the last year	
	cited_by_alias : {
		//'accounts' : 'Accounts',
		'gplus' : 'Google+',							//google plus
		//'posts' : 'Any type of post',					//any type of post
		'tweeters' : 'Twitter',							//messages on twitter
		'rdts' : 'Reddit',								//Reddit submissions (not comments)
		'feeds' : 'Blog posts',							//blog posts
		'msm' : 'Science news outlets',					//articles in science news outlets
		'fbwalls' : 'Facebook wall posts',				//public facebook wall posts
		'delicious' : 'Delicious',						//bookmarked articles on delicious
		'qs' : 'Stack Exchange',						//questions, answers or comments on Stack Exchange sites (inc. Biostar)
		'forum' : 'Forum posts',						//posts in internet forums e.g. Seqanswers
		'peer_review_sites' : 'Peer review sites',		
	},	

	/*
		This function is called iteratively by its callback, with an incremented page number each time

		params: 
			issns 		- comma separated list of issns for the journals we are looking for in this request
			callback 	- a function that iteratively calls the API, incrementing the page number and appending the returned data to a master list
			page 		- an integer page number (pages >100 aren't handled well by the API)
	*/
	getArticlesByIssn : function(issns, callback, page){			

		//set page to 1 the first time this is called
		if(page == null){
			page = 1;
		}

		//If no API key is provided then ask for data in smaller chunks
		//Struggles if there are more than 100 pages of results
		AmAPI.num_results = (AmAPI.key == "") ? "100" : "500"		

		//build the url as required by the API
		var url = AmAPI.root + "citations/"+ AmAPI.timeframe +"?num_results=" + AmAPI.num_results+ "&key=" + AmAPI.key + "&issns=" + issns.join() + "&order_by=" + AmAPI.order_by + "&page=" + page;
		
		//build and send our AJAX request using JSONP to avoid CORS issues
		var ajaxRequest = $.ajax({
			global : true,
			url : url,
			type : 'GET',		
			contentType: "application/json; charset=utf-8",	
			dataType : 'jsonp',									
		});

		//on success call the iterative callback with the retrieved data and current page number
		ajaxRequest.done(function(data){						
			callback(data, page);
		});

		//on failure log the error to the console
		ajaxRequest.fail(function(jqXhr){
			console.log("Ajax Error")			
			console.log(jqXhr);
		});		
	},

	//used to initialise lists during data analysis
	zeroTimescales : {
		week : 0,
		month : 0,
		quarter : 0,
		year : 0,
	}
}

//Add this prefilter so that global ajax events are fired on jsonp requests
$.ajaxPrefilter(function( options ) {
    options.global = true;
});