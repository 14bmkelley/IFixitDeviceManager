function load() {

   setupSearch();
   setupMyDevices();
   setupDeviceButtons();

};

function setupSearch() {
   
   // On key up event, make a search request and display results
   $$(".search-input").addEvent("keyup", function(event) {

      var searchText = $$(".search-input").get("value");
      if (searchText === "") return;

      var searchQuery = "https://www.ifixit.com/api/2.0/suggest/"
         + encodeURIComponent(searchText) + "?doctypes=device";

      $$(".search-results").set("display", "none");

      (new Request({
         "url": searchQuery,
         "method": "get",
         "link": "cancel",
         "onSuccess": function(responseText) {
            var response = JSON.parse(responseText);
            $$(".search-results").getChildren("a").each(function(element) {
               $$(element).dispose();
            });
            for (var i = 0; i < response.results.length; i++) {
               $$(".search-results").appendHTML(
                  "<a href='#' class='list-group-item' title='" + response.results[i].title + "'>"
                  + "<img align='left' src='" + response.results[i].image.mini + "'/>"
                  + "<span class='result-title'>" + response.results[i].title + "</span><br>"
                  + "<span class='result-summary'>" + response.results[i].summary + "</span></a>"
               );
            }
            $$(".search-results").set("display", "block");
            $$(".search-results").getChildren("a").each(function(element) {
               element.addEvent("click", function(clickEvent) {
                  clickEvent.preventDefault();
                  $$(".search-results").getChildren("a").each(function(element) {
                     $$(element).dispose();
                  });
                  var title = this.get("title");
                  console.log(title);
                  (new Request({
                     "url": "https://www.ifixit.com/api/2.0/wikis/CATEGORY/"
                        + encodeURIComponent(title),
                     "method": "get",
                     "link": "cancel",
                     "onSuccess": function(responseText) {
                        var response = JSON.parse(responseText);
                        console.log(response);
                        $$(".details-title").set("text", response.title);
                        $$(".details-img").set("src", response.image.thumbnail);
                        $$(".details-description").set("text", response.description);
                        console.log(response.url);
                        $$(".details-link").set("href", "https://ifixit.com/Device/" + encodeURIComponent(response.title));
                        $$(".my-devices").setStyle("display", "none");
                        $$(".device-details").setStyle("display", "block");
                     }
                  })).send();
               });
            });
         }
      })).send();

   });

}

function setupMyDevices() {
   
   $$(".device-details").setStyle("display", "none");

   var devices = JSON.parse(localStorage.getItem("devices"));
   
   if (devices === null) return;
   $$(".device-message").setStyle("display", "none");


   for (var i = 0; i < devices.items.length; i++) {
      $$(".devices").appendHTML(
         "<div class='device'>"
            + "<img align='right' src='" + devices.items[i].image + "'/>"
            + "<h4>" + devices.items[i].title + "</h4>"
            + "<p>" + devices.items[i].summary + "</p>"
            + "<p><a target='_blank' href='" + devices.items[i].link + "'>Go to Wiki &gt;</a></p>"
         + "</div>"
      );
   }

   $$(".my-devices").setStyle("display", "block");

}

function setupDeviceButtons() {
   
   $$(".add-device").addEvent("click", function(clickEvent) {
      var currentStorage = localStorage.getItem("devices");
      if (!currentStorage) {
         currentStorage = { "items": [] };
      }
      else {
         currentStorage = JSON.parse(currentStorage);
      }
      currentStorage.items.push({
         "image": $$(".details-img").get("src"),
         "title": $$(".details-title").get("text"),
         "summary": $$(".details-description").get("text"),
         "link": $$(".details-link").get("href")
      });
      localStorage.setItem("devices", JSON.stringify(currentStorage));
      $$(".devices").getChildren().each(function(element) {
         element.dispose();
      });
      setupMyDevices();
   });

}

