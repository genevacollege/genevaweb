// Global variables

var _data;
var _offset = 0;

// jQuery selections

var $results = $("#posts-feed");

$(document).ready(function () {
	fetch(
		"https://www.geneva.edu/library/college-archives/_assets/archives-blog-json-output.json"
	)
		.then((res) => res.json())
		.then((data) => {
			_data = data;

			let image;
			let link;

			$.each(data, function (i, post) {
				image = "";
				link = "";

				if (post.image) {
					image = post.image;
				}

				if (post.link) {
					link = post.link;
				}

				$results.append(`
          <div class="post">
						<a href="${link}">
							<div class="image" style="background-image: url('${image}');"></div>
						</a>
            <div class="body">
							<div class="category">${post.category}</div>
							<div class="title">
								<a href="${link}">${post.title}</a>
							</div>
							<div class="summary">${post.summary}</div>
							<a href="${link}" class="keep_reading">Read More</a>
							<div class="date">${post.publishDate}</d>
						</div>
          </div>
        `);
			});
		});
});

function shortenSummary(summary) {
	let split = summary.trim().split(" ");
	let letterCount = 0;
	let output = [];

	let i = 0;
	while (letterCount < 150 && split[i]) {
		output.push(split[i]);
		letterCount += split[i].length;

		i++;
	}

	return `${output.join(" ")}${letterCount >= 150 ? "..." : ""}`;
}
