var scrollToHeader = true;

$(document).ready(function () {
  fetch(
    "[system-asset]/faculty-staff/faculty/faculty-search/assets/faculty?raw[/system-asset]"
  )
    .then((result) => result.json())
    .then((data) => {
      for (let i = 0; i < data.length; i++) {
        addResult(data[i], data);
      }

      urlToSearch();
      search();

      $("#filter-keyword").on("keyup", function () {
        if ($("#filter-keyword").val().length !== 1) {
          search();
        }
      });

      $("#filter-department").change(function () {
        $("#filter-program").val("");
        search();
      });

      $("#filter-program").change(function () {
        $("#filter-department").val("");
        search();
      });

      function search() {
        var keyword = $("#filter-keyword").val().toLowerCase();
        var program = $("#filter-program option:selected").val();
        var department = $("#filter-department option:selected").val();

        if (keyword == "" && program == "" && department == "") {
          $(".title-header").text("All Faculty");
          addResult([], []);
        } else if (scrollToHeader) {
          $("html, body").animate({
            scrollTop:
              $(".title-header").offset().top -
              $(".title-header").height() -
              50,
          });
        }

        scrollToHeader = false;

        var res = [];
        for (let i = 0; i < data.length; i++) {
          var firstName = data[i].firstName.toLowerCase();
          var lastName = data[i].lastName.toLowerCase();

          if (
            (firstName.includes(keyword) ||
              lastName.includes(keyword) ||
              `${firstName.toLowerCase()} ${lastName.toLowerCase()}`.includes(
                keyword.toLowerCase()
              )) &&
            (data[i].programs.includes(
              $("#filter-program option:selected").text()
            ) ||
              program == "") &&
            (data[i].departments.includes(
              $("#filter-department option:selected")
                .text()
                .replaceAll("&", "&amp;")
            ) ||
              department == "") &&
            data[i].isFeatured === "Yes"
          ) {
            res.push(data[i]);
          }
        }

        $(".carditem").remove();
        for (let i = 0; i < res.length; i++) {
          addResult(res[i], res);
        }

        if (res.length > 0) {
          if (keyword != "") {
            $(".title-header").html(String(keyword).toUpperCase()).text();
          } else if (program != "") {
            $(".title-header")
              .html($("#filter-program option:selected").text())
              .text();
          } else if (department != "") {
            $(".title-header")
              .html($("#filter-department option:selected").text())
              .text();
          }
        } else if (res.length === 0) {
          $(".title-header").text("No Faculty Found");
        }
      }

      function addResult(data, res) {
        if (res.length === 0) {
          $(".carditem").remove();
        } else {
          $("#results").append(`
            <li class="carditem">
              <div class="cardinfo">
                  <a href="${data.link}">
                    <img alt="${data.firstName} ${
            data.lastName
          }" height="250" src="https://www.geneva.edu/${
            data.image
          }" width="200" />
                  </a>
                  <div class="titleinfo">
                  <h3>
                    <a href="${data.link}">
                      ${data.firstName} ${data.lastName}
                    </a>
                  </h3>
                  <p>${data.positionTitle}</p>
                  <p>
                    ${
                      data.phone &&
                      `<span>
                        <a href="tel:${data.phone}"><i class="icogold fa-solid fa-phone"></i> Call</a>
                    </span>`
                    }
                    ${
                      data.email &&
                      `<span>
                        <a href="mailto:${data.email}"><i class="icogold fa-solid fa-envelope"></i> Email</a>
                    </span>`
                    }
                  </p>
                  </div>
              </div>
            </li>
          `);
        }
      }

      function urlToSearch() {
        const URL_PARAMS = new URLSearchParams(window.location.search);

        function getParam(param) {
          if (URL_PARAMS.get(param)) {
            return String(URL_PARAMS.get(param));
          } else {
            return false;
          }
        }

        if (getParam("keyword") != false) {
          $("#filter-keyword").val(decodeURIComponent(getParam("keyword")));
        }

        if (getParam("program") != false) {
          $("#filter-program option").each(function () {
            if (this.value == getParam("program")) {
              $("#filter-program").val(getParam("program")).change();
            }
          });
        }

        if (getParam("department") != false) {
          $("#filter-department option").each(function () {
            if (this.value == getParam("deptartment")) {
              $("#filter-department").val(getParam("deptartment")).change();
            }
          });
        } else if (getParam("dept") != false) {
          $("#filter-department option").each(function () {
            if (this.value == getParam("dept")) {
              $("#filter-department").val(getParam("dept")).change();
            }
          });
        }
      }
    });
});
