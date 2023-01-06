var _data;
var $grid = $("#grid");
var output = [];

// $.getJSON("./blog-data.json", function (data) {
// 	_data = data;

// 	data.forEach((post) => {
// 		output.push(`
// 			<div class="media-box ${String(post.category)
// 				.replace(/ /g, "-")
// 				.toLowerCase()}">
// 				<div class="title">${post.title}</div>
// 			</div>
// 		`);
// 	});

// 	$("#output").text(decodeURI(output.join("")));
// });

// $(document).ready(function () {
// 	$("#grid").mediaBoxes({
// 		filterContainer: ".filters",
// 		search: "#search",
// 		boxesToLoadStart: 20,
// 		columns: 3,
// 		searchTarget: ".title",
// 		popup: "magnificpopup",
// 	});
// });

// $(document).ready(function () {
// 	fetch("https://www.geneva.edu/blog/_dev/blog-json-output")
// 		.then((res) => {
// 			return res.json();
// 		})
// 		.then((data) => {
// 			_data = data;

// 			urlToSearch();
// 			init();
// 			search();

// 			$("#filter-keyword").on("keyup", function () {
// 				if (
// 					$("#filter-keyword").val().length !== 1 ||
// 					$("#filter-keyword").val().length > 2
// 				) {
// 					search();
// 				}
// 			});

// 			$("#filter-category").change(function () {
// 				$("#filter-keyword").val("");
// 				search();
// 			});

// 			function search() {
// 				var values = [];

// 				values.push($("#filter-keyword").val().toLowerCase());
// 				values.push($("#filter-category option:selected").val());

// 				// If the inputs are empty, show everything.
// 				if (values[0] == "" && values[1] == "") {
// 					addResult([], []);
// 				}

// 				var results = [];
// 				// Looping through each entry in the array grabbed from the JSON.
// 				for (let i = 0; i < data.length; i++) {
// 					// Checking if the search bar and dropdowns match any entries.
// 					var title = data[i].title.toLowerCase();

// 					if (
// 						title.includes(values[0]) &&
// 						(data[i].category.includes(values[1]) || values[1] == "")
// 					) {
// 						results.push(data[i]);
// 					}
// 				}

// 				// Fade in what needs to be faded in and fade out what needs to be faded out.
// 				$(".post").remove();
// 				for (let i = 0; i < results.length; i++) {
// 					addResult(results[i], results);
// 				}

// 				// If there's nothing to fade in or fade out, fade in "Nothing Found"
// 				if (results.length > 0) {
// 					$(".nothing-found").fadeOut(0);
// 				} else if (results.length === 0) {
// 					$(".nothing-found").fadeIn(0);
// 				}
// 			}
// 		});
// });

// function init() {
// 	for (let i = 0; i < data.length; i++) {
// 		addResult(data[i], data);
// 	}

// 	$("#nothing-found-parent").append(`
//     <div class="nothing-found">
//       <h1>No Results Found</h1>
//     </div>
//   `);

// 	$(".nothing-found").fadeOut(0);
// }

// function populate(results) {
// 	if (results.length === 0) {
// 		$(".post").remove();
// 		$(".nothing-found").fadeIn(0);
// 	}
// }

// function addResult(post, allPosts) {
// 	if (allPosts.length === 0) {
// 		$(".post").remove();
// 		$(".nothing-found").fadeIn(0);
// 	} else {
// 		let link = post.link.replace("htps", "https").slice(18);
// 		let image =
// 			"https://www.geneva.edu/_files/sitegraphics/page-hero-small-bg.jpg";

// 		if (post.image !== "https://geneva.edu/") {
// 			image = post.image.slice(18);
// 		}

// 		$("#results").append(`
//     <div class="post">
//       <a href="${link}">
//         <div class="image" style="background-image: url('${image}');"></div>
//       </a>
//       <div class="body">
//         <div class="category">${post.category}</div>
//         <div class="title">
//           <a href="${link}">${post.title}</a>
//         </div>
//         <div class="summary">${post.summary}</div>
//         <a href="${link}" class="keep_reading">Read More</a>
//         <div class="date">${post.publishDate}</d>
//       </div>
//     </div>
//   `);
// 	}
// }

// function urlToSearch() {
// 	const categories = {
// 		"adult-students": "Adult Students",
// 		"biblical-wisdom": "Biblical Wisdom",
// 		"campus-life": "Campus Life",
// 		career: "Career",
// 		"college-admissions": "College Admissions",
// 		"college-archives": "College Archives",
// 		"college-preparation": "College Preparation",
// 		"continuing-education": "Continuing Education",
// 		"everyday-living": "Everyday Living",
// 		faith: "Faith",
// 		"financial-aid": "Financial Aid",
// 		"graduate-studies": "Graduate Studies",
// 		"higher-education": "Higher Education",
// 		"humanities-liberal-arts": "Humanities and Liberal Arts",
// 		"presidents-desk": "President's Desk",
// 		"program-spotlight": "Program Spotlight",
// 		"study-abroad": "Study Abroad",
// 		"the-college": "The College",
// 		uncategorized: "Uncategorized",
// 	};

// 	let values = {};

// 	let hashes = window.location.href
// 		.slice(window.location.href.indexOf("?") + 1)
// 		.split("&");

// 	let hash;
// 	for (let i = 0; i < hashes.length; i++) {
// 		hash = hashes[i].split("=");
// 		values[hash[0]] = hash[1];
// 	}

// 	if (values["search"])
// 		$("#filter-keyword").val(decodeURIComponent(values["search"]));
// 	if (values["category"])
// 		$("#filter-category").val(categories[values["category"]]).change();
// }
