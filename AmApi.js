var AmAPI = {
	root :  "http://www.altmetric.com/api/v1/",
	type : "citations", //or "journals"
	key : "e900514dbfd492278f6cec1f8a955bd3",			
	num_results : "500",
	order_by : "score",
	timeframe : "1y",	
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
	readers : [
		'citeulike',
		'connotea',
		'mendeley'
	],


	getArticlesByIssn : function(issns, callback, page){			

		if(page == null){
			page = 1;
		}

		var url = AmAPI.root + "citations/"+ AmAPI.timeframe +"?num_results=" + AmAPI.num_results+ "&key=" + AmAPI.key + "&issns=" + issns.join() + "&order_by=" + AmAPI.order_by + "&page=" + page;		

		$.getJSON(url).done(function(data){				
			callback(data, page);
		})
		.fail(function(jqXhr){
			console.log(jqXhr.responseText)
		});

	},

	zeroTimescales : {
						week : 0,
						month : 0,
						quarter : 0,
						year : 0,
					}
}

$.ajaxSetup({
    beforeSend: function(jqXHR, settings) {
        jqXHR.url = settings.url;
    }
});
