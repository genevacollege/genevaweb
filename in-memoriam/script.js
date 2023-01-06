// Variables fror data that may need to be checked in the console.
var _data = [];
var _offset = 0;
var _endOfResults = false;
var _viewing = "alumni";
var _input = "";
var _delayScroll = false;

// Variables for triggering searches when user is finished typing.
var _typingTimer;
var _typingInterval = 100;

// A variable for the 'filter-keyword' text input for later use.
var $searchInput = $("#filter-keyword");

$(document).ready(function () {
  search();

  // These two events handle the typing timer, resetting it when the user starts
  // typing and clearing/restarting it when the user types again. When the user
  // stops typing, after the set amoutn (in milliseconds) specified in
  // '_typingInterval' then the searching begins.
  $searchInput.on("keyup", function () {
    if ($(this).val().length === 0) {
      _offset = 0;
    }

    clearTimeout(_typingTimer);
    _typingTimer = setTimeout(doneTyping, _typingInterval);
  });
  $searchInput.on("keydown", function () {
    clearTimeout(_typingTimer);
  });

  function doneTyping() {
    // Where I'm going with this is to check if the user actually changed the
    // text in the input. If there was just a backspace that doesn't effect
    // the SQL query, then ignore it.
    if (_input.trim() !== $searchInput.val().trim()) {
      // Reset the '_endOfResults' variable so that infinite scrolling resumes working.
      _endOfResults = false;
      // The '_input' variable holds the last value of the text input that was
      // a valid change. This is how we check to make sure that a change was
      // made in this above condition.
      _input = $searchInput.val();
      // The offset also needs to be reset so that we get the first set of results.
      _offset = 0;

      // If there is a change, then we remove all of the nameplates that were displayed
      // for the previous search. This will happen by passing 'true' into the search function.
      search(true);
    }
  }

  $("#filter-classyear").change(function () {
    _offset = 0;
    search(true);
  });

  $("#view-alumni").click(function () {
    if (_viewing !== "alumni") {
      $("#filter-classyear").fadeIn(0);
      $searchInput.parent().attr("class", "six columns");

      $("#view-alumni input").prop("checked", true);
      $("#view-friends input").prop("checked", false);

      _offset = 0;
      _viewing = "alumni";
      _endOfResults = false;
      search(true);
    }
  });

  $("#view-friends").click(function () {
    if (_viewing !== "friend") {
      $("#filter-classyear").fadeOut(0);
      $searchInput.parent().attr("class", "twelve columns");

      $("#view-alumni input").prop("checked", false);
      $("#view-friends input").prop("checked", true);

      _offset = 0;
      _viewing = "friend";
      _endOfResults = false;
      search(true);
    }
  });
});

$(window).scroll(function () {
  // The infinite scroll event and function: it runs when the users scrolls
  // on the page, and the 'elementScrolled' function checks if the element
  // with an ID of 'results-end' is in view (explanation of how this works
  // with the function itself at the bottom of the file) and if the end of
  // the results have been reached (the '_endOfResults variable). If the
  // element is in view and there is more data to be displayed, then continue.

  let endInView = false;

  // Declaring variables for the elements and locations we need in order to
  // determine whether the target element that was passed through is in view.
  let browserTop = $(window).scrollTop();
  let browserBottom = browserTop + $(window).height();
  let top = $("#results-end").offset().top;

  // This condition is the math equation that checks, resulting in either
  // 'true' or 'false'.
  if (top <= browserBottom && top >= browserTop) {
    endInView = true;
  }

  if (endInView && !_endOfResults && !_delayScroll) {
    // Adding 66 to the offset so that there aren't repeat results.
    _offset += 66;

    // Set the delay to true so that it doesn't load more than one set of
    // results at a time when scrolling.
    _delayScroll = true;

    search();
  }
});

// resetDisplay is set to a default of false, that way we don't need to
// pass 'false' every time we run the function when we're appending results.
function search(resetDisplay = false) {
  // The 'parameters' array will hold the parameters that will be passed into the
  // fetch to the API. This will hold the text input (search), desired decade (decade),
  // the offset for the infinite scroll (offset) and whether we're searching for
  // friends or alumni (friendOrAlumni).
  let parameters = [];

  if ($searchInput.val().length > 0) {
    parameters.push(`search=${$searchInput.val()}`);
  }

  let decade = "all";
  // This condition will also update the 'All Class Years' header if there are results.
  if (
    $("#filter-classyear").find(":selected").val() !== "all" &&
    _viewing === "alumni"
  ) {
    decade = $("#filter-classyear").find(":selected").val();

    parameters.push(`decade=${decade}`);
  }

  parameters.push(`offset=${_offset}`);
  parameters.push(`friendOrAlumni=${_viewing}`);

  // Fetching the JSON data from the API.
  fetch(
    `https://www.geneva.edu/alumni/online-services/class-notes/assets/in-memoriam-api?${parameters.join(
      "&"
    )}`
  )
    .then((res) => res.json())
    .then((data) => {
      _data = data;

      // If the nameplates need to be removed, this is where it will happen.
      if (resetDisplay) {
        $(".memoriam").remove();
      }

      if (data.length > 0) {
        $("#results-disclaimer").show();

        if (_viewing === "alumni") {
          if (decade === "all") {
            $("#results-title").text("All Class Years");
          } else {
            $("#results-title").text(
              `Class of ${decade}-${String(Number(decade) + 9).slice(2)}`
            );
          }
        } else {
          $("#results-title").text("Friends of Geneva");
        }

        // Creating an empty variable once to be used for each nameplate. This
        // helps cut down on processing because we aren't assigning the variable
        // to a new index in memory more than once.
        let text;

        // This loops through the JSON received from the API, checking if some
        // names are available, combining them all if so, and appending them to
        // the results container element ('#results-container').
        data.forEach((el) => {
          text = `<b>${el["nameplate"]}</b> - ${el["death_date"]}`;

          if (el["first_name"] && el["last_name"] && !el["nameplate"]) {
            text = `<b>${el["first_name"]}`;

            if (el["middle_name"]) {
              text += ` ${el["middle_name"]}`;
            }

            text += ` ${el["last_name"]}${gradYear(e)}</b> - ${
              el["death_date"]
            }`;
          }

          $("#results-container").append(`<div class="memoriam">${text}</div>`);
        });
      } else {
        // If the JSON received from the API is blank/empty, then that means we've
        // either reached the end of the results because of infinite scrolling, or...
        _endOfResults = true;

        // ...there was no results to begin with. If that's the case, the user will
        // know because the header will say 'No Results'.
        if ($(".memoriam").length === 0) {
          $("#results-title").text("No Results");
          $("#results-disclaimer").hide();
        }
      }

      _delayScroll = false;
    });
}

// A simple function to set a string to fully lowercase letters. It
// also checkes to make sure that the value being passed through has
// an actual value/isn't null or undefined.
function lower(t) {
  if (t) {
    return t.toLowerCase();
  } else {
    return t;
  }
}

// A short-hand function to spit out the graduation year of an
// alumni memoriam for the nameplate in an appropriate format.
function gradYear(object) {
  if (object["graduation_year"]) {
    let grad_year = ` '${object["graduation_year"].slice(2)}`;

    if (grad_year != " '") {
      return grad_year;
    } else {
      return "";
    }
  }
}
