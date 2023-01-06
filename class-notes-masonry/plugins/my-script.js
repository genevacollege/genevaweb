$(document).ready(function () {
  var $results = $("#results-container");

  $results.imagesLoaded(function () {
    var msnry = new Masonry("#results-container", {
      itemSelector: ".classnote",
      percentPosition: true,
      visibleStyle: { transform: "translateY(0)", opacity: 1 },
      hiddenStyle: { transform: "translateY(100px)", opacity: 0 },
    });

    var unsplashID =
      "9ad80b14098bcead9c7de952435e937cc3723ae61084ba8e729adb642daf0251";

    var infntScrll = new InfiniteScroll("#results-container", {
      // path: function () {
      //   return `https://www.geneva.edu/alumni/online-services/class-notes/assets/class-notes-api-dev?page=${this.pageIndex}`;
      // },
      path: function () {
        return (
          "https://api.unsplash.com/photos?client_id=" +
          unsplashID +
          "&page=" +
          this.pageIndex
        );
      },
      responseType: "text",
      outlayer: msnry,
      history: false,
    });

    infntScrll.on("load", function (res) {
      var data = JSON.parse(res);

      data.forEach((item) => {
        console.log("item:", item);
      });
    });
  });

  infntScrll.loadNextPage();
});
