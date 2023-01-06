// This function only allows the code inside to be triggered when the page is fully loaded.
$(document).ready(function () {
  // Fetch the JSON output.
  /*fetch("https://www.geneva.edu/academics/programs/json/programs")*/
  //fetch("[system-asset:configuration=JSON Output]/academics/programs/json/programs?raw[/system-asset]")
  fetch("https://www.geneva.edu/academics/programs/json/programs.json")
    .then((results) => results.json())
    .then((initialData) => {
      // Putting all objects at the beginning so that they can be used wherever they are needed.
      const interestLegends = {
        "Arts, Design & Communication": "arts",
        "Biblical Studies, Philosophy & Ministry": "ministry",
        "Business & Sport Management": "business",
        "Computer Science & Technology": "compsci",
        "Education & Teaching": "education",
        "Nursing, Healthcare & Life Sciences": "health",
        "Political Science, History & Languages": "polisci",
        "Psychology & Social Services": "psych",
        "Science, Engineering & Mathematics": "stem",
      };

      // Call each function when the page loads to initialize everything.
      urlToSearch();
      init();
      search();

      // Trigger the search function every time an input is changed.
      $("#filter-keyword").on("keyup", function () {
        if ($("#filter-keyword").val().length !== 1) {
          search();
        }
      });

      $("#filter-interest").change(function () {
        search();
      });

      $("#filter-program").change(function () {
        search();
      });

      // Functions
      /*
        This sets the plate to either show all results (if there are
        no hashes in the URL) or shows the results for the hashes in the URL.
      */
      function init() {
        /*
          Loops through each entry in the JSON fetched and creates a card
          for each one, adding in all the necessary data.
        */
        for (let i = 0; i < initialData.length; i++)
          addResult(initialData[i], initialData);

        // Creates a region that says "No Results Found" and then fades it out of view.
        $("#results").append(`
          <div class="nothing-found">
            <h1>No Results Found</h1>
          </div>
        `);
        $("#results .nothing-found").fadeOut(0);
      }

      function search() {
        // Initialize empty arrays for data later.
        var values = [];

        values.push($("#filter-keyword").val().toLowerCase());
        values.push($("#filter-interest option:selected").val());
        values.push($("#filter-program option:selected").val());

        // If the inputs are empty, show everything.
        if (values[0] == "" && values[1] == "" && values[2] == "")
          addResult([], []);

        var results = [];
        // Looping through each entry in the array grabbed from the JSON.
        for (let i = 0; i < initialData.length; i++) {
          // Checking is keywords match up.
          var keywordIncluded = false;
          for (let j = 0; j < initialData[i].keywords.length; j++)
            if (initialData[i].keywords[j].includes(values[0]))
              keywordIncluded = true;

          // Checking if the search bar and dropdowns match any entries.
          var title = initialData[i].title.toLowerCase();

          if (
            (title.includes(values[0]) || keywordIncluded) &&
            (initialData[i].interest_types.includes(values[1]) ||
              values[1] == "") &&
            (initialData[i].program_info.includes(values[2]) || values[2] == "")
          )
            results.push(initialData[i]);
        }

        // Fade in what needs to be faded in and fade out what needs to be faded out.
        $(".card").remove();
        for (let i = 0; i < results.length; i++) addResult(results[i], results);

        // If there's nothing to fade in or fade out, fade in "Nothing Found"
        if (results.length > 0) $("#results .nothing-found").fadeOut(0);
        else if (results.length === 0) $("#results .nothing-found").fadeIn(0);
      }

      function addResult(degree, results) {
        if (results.length === 0) {
          $(".card").remove();
          $(".nothing-found").fadeIn(0);
        } else {
          $("#results").append(`
            <div class="card flex-item" id="${degree.title
              .toLowerCase()
              .replaceAll(" ", "_")}">
              <div class="card-info">
              <div class="img-holder-landscape">
              
              
                <a href="${degree.link}">
                  <img
                    alt="${degree.title}"
                    class="u-full-width"
                    src="${degree.image}"
                    loading="lazy"
                    aria-hidden="true"
                  />
              
              </div>
                  <h2>${degree.title}</h2>
                <p class="descriptors">${degreeCode()}<span class="card-tag">${degree.program_info.join(
            " &#x2022; "
          )}</span></p>
                </a>
              </div>
            </div>
          `);

          addBlanks(results);
        }

        function degreeCode() {
          let endList = [];

          for (let i = 0; i < degree.degree_type.length; i++) {
            endList.push(
              `<span title="${degree.degree_type[i]}" class="ico-circ">${degree.degree_code[i]}</span>`
            );
          }

          console.log(endList);

          return endList.join("");
        }
      }

      function addBlanks(results) {
        $(".card-blank").remove();

        if (results.length < 3) {
          let blanks = 3 - results.length;

          for (let k = 0; k < blanks; k++) {
            $("#results").append(`<div class="card-blank flex-item"></div>`);
          }
        }

        if (results.length % 3 != 0) {
          let blanks = Math.floor(results.length / 3);

          for (let k = 0; k < blanks; k++) {
            $("#results").append(`<div class="card-blank flex-item"></div>`);
          }
        }
      }

      // The function that parses the URL into the search bar.
      function urlToSearch() {
        /*
          This function is only used inside of the 'urlToSearch' function, and
          flips the provided JSON object's keys and values so that it can be
          used properly.

          If it's needed outside of the 'urlToSearch' function, we can move it.
        */
        function reverseObject(initialObject) {
          // 'reversedObject' will be the reversed JSON object we return at the end of the function.
          var reversedObject = {};

          /*
            Filters through each key, double checks to make sure the JSON object
            has a corresponding value, and puts both the key and value into the
            new object.
          */
          for (var prop in initialObject) {
            if (initialObject.hasOwnProperty(prop)) {
              reversedObject[initialObject[prop]] = prop;
            }
          }

          return reversedObject;
        }

        // This will have a list of each hash in the URL.
        let values = [];

        // This parses out the hashes from the URL so that we can use them.
        let hashes = window.location.href
          .slice(window.location.href.indexOf("?") + 1)
          .split("&");

        // This loops through the hashes we now have and puts them into the 'values' array.
        let hash;
        for (let i = 0; i < hashes.length; i++) {
          hash = hashes[i].split("=");
          values.push(hash[0]);
          values[hash[0]] = hash[1];
        }

        // And last but not least, we apply each hash into the search bar and dropdowns.
        if (values["keyword"])
          $("#filter-keyword").val(decodeURIComponent(values["keyword"]));
        if (values["interest"])
          $("#filter-interest")
            .val(reverseObject(interestLegends)[values["interest"]])
            .change();
        // if (values['degree']) $('#filter-degree').val(values['degree']).change()
        if (values["program"])
          $("#filter-program").val(values["program"]).change();
      }
    });
});
