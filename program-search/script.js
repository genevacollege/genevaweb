$(document).ready(function () {
  // fetch("https://www.geneva.edu/academics/programs/json/programs.json")
  fetch("[system-asset]/academics/programs/json/programs?raw[/system-asset]")
    .then((results) => results.json())
    .then((initialData) => {
      const interestLegends = {
        "Arts, Design & Communication": "communication",
        "Biblical Studies, Philosophy & Ministry": "ministry",
        "Business & Sport Management": "business",
        "Computer Science & Technology": "compsci",
        "Education & Teaching": "education",
        "Nursing, Healthcare & Life Sciences": "health",
        "Political Science, History & Languages": "polisci",
        "Psychology & Social Services": "psychology",
        "Science, Engineering & Mathematics": "stem",
      };

      urlToSearch();
      init();
      search();

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

      function init() {
        for (let i = 0; i < initialData.length; i++) {
          addResult(initialData[i], initialData);
        }

        $("#results").append(`
          <div class="nothing-found">
            <h1>No Results Found</h1>
          </div>
        `);
        $("#results .nothing-found").fadeOut(0);
      }

      function search() {
        var keyword, interest, program;

        keyword = $("#filter-keyword").val().toLowerCase();
        interest = $("#filter-interest option:selected").val();
        program = $("#filter-program option:selected").val();

        if (keyword == "" && interest == "" && program == "") {
          addResult([], []);
        }

        var results = [];
        for (let i = 0; i < initialData.length; i++) {
          var keywordIncluded = false;
          for (let j = 0; j < initialData[i].keywords.length; j++) {
            if (initialData[i].keywords[j].includes(keyword)) {
              keywordIncluded = true;
            }
          }

          var title = initialData[i].title.toLowerCase();

          if (
            (title.includes(keyword) || keywordIncluded) &&
            (initialData[i].interest_types.includes(interest) ||
              interest == "") &&
            (initialData[i].program_info.includes(program) || program == "")
          ) {
            results.push(initialData[i]);
          }
        }

        $(".card").remove();
        for (let i = 0; i < results.length; i++) {
          addResult(results[i], results);
        }

        if (results.length > 0) {
          $("#results .nothing-found").fadeOut(0);
        } else if (results.length === 0) {
          $("#results .nothing-found").fadeIn(0);
        }
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

      function urlToSearch() {
        const urlParams = new URLSearchParams(window.location.search);

        function getParam(param) {
          if (urlParams.get(param)) {
            return urlParams.get(param);
          } else {
            return false;
          }
        }

        if (getParam("keyword")) {
          $("#filter-keyword").val(decodeURIComponent(getParam("keyword")));
        }

        if (getParam("interest")) {
          $("#filter-interest")
            .val(reverseObject(interestLegends)[getParam("interest")])
            .change();
        }

        if (getParam("program")) {
          $("#filter-program").val(getParam("program")).change();
        }
      }
    });
});
