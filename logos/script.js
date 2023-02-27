var logoIndex = 0;

$(document).ready(function () {
  fetch(
    "https://www.geneva.edu/academics/programs/engineering/_assets/_build/biomed-eng-logos.json?raw"
  )
    .then((res) => res.json())
    .then((data) => {
      function addLogos() {
        for (let i = 0; i < 6; i++) {
          if (logoIndex < data.length) {
            $(".grid_container").append(`
              <div class="grid_item">
                <img src="${data[logoIndex].logo}" alt="${data[logoIndex].title}" />
              </div>
            `);

            logoIndex++;
          } else {
            $("#show_more_button").hide(0);
            break;
          }
        }
      }

      addLogos();

      $("#show_more_button").click(function (e) {
        e.preventDefault();
        addLogos();
      });
    });
});
