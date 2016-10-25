function load() {

   setupSearch();

};

function setupSearch() {
   
   // On key up event, make a search request and display results
   $$(".search-input").addEvent("keyup", function(event) {

      var searchText = $$(".search-input").get("value");
      if (searchText === "") return;

      var searchQuery = "https://www.ifixit.com/api/2.0/suggest/"
         + encodeURIComponent(searchText);

      $$(".search-results").set("display", "none");

      var searchRequest = new Request({
         "url": searchQuery,
         "method": "get",
         "link": "cancel",
         "onSuccess": function(responseText) {
            console.log(responseText);
         }
      });

      searchRequest.send();
   
   });

}
