var JournalListHandler = {
  getAllBySubjectCategory : function(){
    var categories = {};
    $.each(JournalList, function(i, journal){
        if(categories[journal['Subject Category']] == null){
          categories[journal['Subject Category']] = {};      
        }
        categories[journal['Subject Category']][journal['Journal']] = journal;
      });
      
      console.log("Key journals by category:");
      console.log(categories);  
      return categories;
  },

  publishers : (function(){
    var publishers = [];
    $.each(JournalList, function(i, journal){
      if(publishers.indexOf(journal['Publisher']) == -1){
        publishers.push(journal['Publisher']);
      }
    });
    return publishers;
  })(),

  subjectCategories : (function(){
    var categories = [];
    $.each(JournalList, function(i, journal){
      if(categories.indexOf(journal['Subject Category']) == -1){
        categories.push(journal['Subject Category']);
      }
    });
    return categories;    
  })(),

  getPublisherIssns : function(publisher){
    var issns = [];

    $.each(JournalList, function(i, journal){
      
      if(journal['Publisher'] == publisher){        
        issns.push(journal['issn_print']);
        if(journal['issn_web'] != 0)
          issns.push(journal['issn_web']);
      }
    });

    return issns;
  },

  getCategoryIssns : function(category){
    var issns = [];

    $.each(JournalList, function(i, journal){
      
      if(journal['Subject Category'] == category){        
        issns.push(journal['issn_print']);
        if(journal['issn_web'] != 0)
          issns.push(journal['issn_web']);
      }
    });

    return issns;
  },

  getPublisher : function(issn){ 
    var publisher = "Publisher Unknown";

    $.each(JournalList, function(i, journal){ 
      if(issn != null){
        if(journal['issn_print'] == issn || journal['issn_web'] == issn){         
          publisher = journal['Publisher'];
        }
      }
    });

    if(publisher == "Publisher Unknown") console.log(issn + " no publisher found")

    return publisher;
  },

  getJournalByIssn : function(issns){
    var jnl = {};

    $.each(JournalList, function(i, journal){
      if(issns != null){
        $.each(issns, function(ii, issn){
          if(journal['issn_print'] == issn || journal['issn_web'] == issn){
            jnl = journal;
          }
        })        
      }
    });

    return jnl;
  },

  getJournalByNlmid : function(nlmid){
    var jnl = {};

    $.each(JournalList, function(i, journal){
      if(nlmid != null){        
          if(journal['nlm_id'] == nlmid){
            jnl = journal;
          }
      }     
    });    

    return jnl;
  },

  unknown : {
    "Journal full name":"unknown",
    "Subject Category":"unknown",
    "Journal":"unknown",
    "Publisher":"unknown",
    "nlm_id":"unknown",
    "issn_print":"unknown",
    "issn_web":"unknown"
  }
}

var PublisherConstants = {

    getColor : function(publisher){
        var c = "";
        $.each(PublisherConstants.constants, function(i, publ){
            if(publ.publisher == publisher){
                c = publ.color
            }
        });

        return c;
    },

    constants : [
        {
            publisher : "RSC",
            doiPrefix : "10.1039",
            color : "#4F758B",
        },

        {
            publisher : "ACS",
            doiPrefix : "10.1021",
            color : "red",
        },

        {
            publisher : "WILEY",
            doiPrefix : "10.1002",
            color : "green",
        },

        {
            publisher : "ELSEVIER",
            doiPrefix : "10.1016",
            color : "skyblue",
        },

        {
            publisher : "OTHER",
            doiPrefix : "",
            color : "brown",
        }
    ],
}