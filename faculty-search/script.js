$(document).ready(function () {
	fetch(
		"https://www.geneva.edu/faculty-staff/faculty/faculty-search/assets/faculty.json"
	)
		.then((res) => res.json())
		.then((data) => {
			const degreeLegends = {
				"adult-degree": "Adult Degree Programs",
				"christian-ministry": "Bible, Christian Ministries & Philosophy",
				biology: "Biology",
				"business-management-accounting": "Business",
				chemistry: "Chemistry, Mathematics & Physics",
				communication: "Communication",
				"compsci-cybersecurity": "Computer Science & Cybersecurity",
				education: "Education",
				engineering: "Engineering",
				english: "English",
				polisci: "History, Political Science & Sociology",
				library: "Library",
				mba: "MBA",
				"master-counseling": "M.A. Counseling",
				"master-higher-ed": "M.A. Higher Ed.",
				"master-leadership": "M.S. Leadership Studies",
				music: "Music",
				nursing: "Nursing",
				psychology: "Psychology & Social Services",
			};

			const programLegends = {
				accounting: "Accounting",
				"accounting-scholars": "Accounting Scholars 3+1",
				"actuarial-math": "Actuarial Mathematics",
				"allied-health": "Allied Health",
				"applied-math": "Applied Mathematics",
				"aviation-business": "Aviation/Business",
				"aviation-missions": "Aviation/Missions",
				"bible-ministry": "Biblical Studies, Ministry & Philosophy",
				biochemistry: "Biochemistry",
				biology: "Biology",
				business: "Business",
				"business-scholars": "Business Scholars 3+1",
				chemistry: "Chemistry",
				communications: "Communications",
				"comm-design": "Communication Design",
				"comm-disorders": "Communication Disorders",
				"community-development": "Community Development",
				compsci: "Computer Science",
				"compsci-cybersecurity": "Computer Science/Cybersecurity 3+1",
				"computer-information-systems": "Computer Information Systems",
				counseling: "Counseling",
				"criminal-justice": "Criminal Justice",
				cybersecurity: "Cybersecurity",
				education: "Education",
				engineering: "Engineering",
				"english-writing": "English/Writing",
				finance: "Finance",
				history: "History",
				marketing: "Marketing",
				management: "Management",
				"middle-education": "Middle Level Education (4-8)",
				missions: "Missions",
				music: "Music",
				"music-business": "Music Business",
				nursing: "Nursing",
				polisci: "Political Science",
				sociology: "Sociology",
				"social-services": "Social Services",
				"sport-management": "Sport Management/Business",
				undeclared: "Undeclared Majors",
				"graduate-mba": "Graduate MBA",
				"graduate-cybersecurity": "Graduate Cybersecurity",
				"graduate-higher-ed": "Graduate Higher Education",
				"graduate-msls": "Graduate MSLS",
			};

			urlToSearch();
			init();
			search();

			$("#filter-keyword").on("keyup", function () {
				if ($("#filter-keyword").val().length !== 1) {
					search();
				}
			});

			$("#filter-program").change(function () {
				$("#filter-degree").val("");
				search();
			});

			$("#filter-degree").change(function () {
				$("#filter-program").val("");
				search();
			});

			/*
          This sets the plate to either show all results (if there are
          no hashes in the URL) or shows the results for the hashes in the URL.
        */

			function init() {
				/*
            Loops through each entry in the JSON fetched and creates a card
            for each one, adding in all the necessary data.
          */
				for (let i = 0; i < data.length; i++) {
					addResult(data[i], data);
				}
			}

			function search() {
				var values = [];

				values.push($("#filter-keyword").val().toLowerCase());
				values.push($("#filter-program option:selected").val());
				values.push($("#filter-degree option:selected").val());

				if (values[0] == "" && values[1] == "" && values[2] == "") {
					$(".title-header").text(`All Faculty`);
					addResult([], []);
				}

				var res = [];
				for (let i = 0; i < data.length; i++) {
					var firstName = data[i].firstName.toLowerCase();
					var lastName = data[i].lastName.toLowerCase();

					if (
						(firstName.includes(values[0]) ||
							lastName.includes(values[0]) ||
							`${firstName.toLowerCase()} ${lastName.toLowerCase()}`.includes(
								values[0].toLowerCase()
							)) &&
						(data[i].programs.includes(programLegends[values[1]]) ||
							values[1] == "") &&
						(data[i].departments.includes(degreeLegends[values[2]]) ||
							values[2] == "") &&
						data[i].isFeatured === "Yes"
					) {
						console.log(data[i].departments);
						res.push(data[i]);
					}
				}

				$(".carditem").remove();
				for (let i = 0; i < res.length; i++) {
					addResult(res[i], res);
				}

				if (res.length > 0) {
					if (values[0] != "") {
						$(".title-header").html(String(values[0]).toUpperCase()).text();
					} else if (values[1] != "") {
						$(".title-header").html(programLegends[values[1]]).text();
					} else if (values[2] != "") {
						$(".title-header").html(degreeLegends[values[2]]).text();
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
				/*
          This function is only used inside of the 'urlToSearch' function, and
          flips the provided JSON object's keys and values so that it can be
          used properly.

          If it's needed outside of the 'urlToSearch' function, we can move it.
        */
				function reverseObject(data) {
					var newObj = {};

					/*
            Filters through each key, double checks to make sure the JSON object
            has a corresponding value, and puts both the key and value into the
            new object.
          */
					for (var prop in data) {
						if (data.hasOwnProperty(prop)) {
							newObj[data[prop]] = prop;
						}
					}

					return newObj;
				}

				let vars = [];

				let hashes = window.location.href
					.slice(window.location.href.indexOf("?") + 1)
					.split("&");

				let hash;
				for (let i = 0; i < hashes.length; i++) {
					hash = hashes[i].split("=");
					vars.push(hash[0]);
					vars[hash[0]] = hash[1];
				}

				if (vars["keyword"]) {
					$("#filter-keyword").val(decodeURIComponent(vars["keyword"]));
				}
				if (vars["program"]) {
					$("#filter-program")
						.val(reverseObject(programLegends)[vars["program"]])
						.change();
				}
				if (vars["degree"]) {
					$("#filter-degree")
						.val(reverseObject(degreeLegends)[vars["degree"]])
						.change();
				}
			}
		});
});
