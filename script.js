function load() {

   setupSearch();

};

function setupSearch() {
   
   // On key up event, make a search request and display results
   $$(".search-input").addEvent("keyup", function(event) {

      var searchText = $$(".search-input").get("value");
      if (searchText === "") return;

      var searchQuery = "https://www.ifixit.com/api/2.0/suggest/"
         + encodeURIComponent(searchText) + "?doctypes=device";

      $$(".search-results").set("display", "none");

      var searchRequest = new Request({
         "url": searchQuery,
         "method": "get",
         "link": "cancel",
         "onSuccess": function(responseText) {
            var response = JSON.parse(responseText);
            $$(".search-results").getChildren("li").each(function(element) {
               $$(element).dispose();
            });
            for (var i = 0; i < response.results.length; i++) {
               var listItem = new Element("li");
               listItem.addClass("list-group-item");
               listItem.appendHTML(response.results[i].title);
               $$(".search-results").adopt(listItem);
            }
            $$(".search-results").set("display", "block");
         }
      });

      searchRequest.send();
   
   });

}

