// Get the search query string
const search = window.location.search;

// Create a screen reader friendly icon
function create_icon(classes, title) {
	return $("<i/>")
		.addClass(classes)
		.attr("title", title)
		.attr("aria-hidden", "true")
		.add($("<span/>")
			.addClass("sr-only")
			.text("(" + title + ")"));
}

////
//// Configure the <nav .navbar>
////

// Filter table
$("input[type=search]").on("input", function() {
	var value = $(this).val().toLowerCase();
	$("tbody tr").filter(function() {
		$(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
	});
});

////
//// Configure the <nav .breadcrumb>
////

// Get the path segments and remove empty fields
const path_segments = window.location.pathname.split("/").filter(Boolean);

// Create a html / url object for each path segments
var path_url = "/";
var path_urls = [{
	html: create_icon("fa-fw fas fa-home", document.title),
	url: path_url + search,
}];

path_segments.forEach(function(segment) {
	path_url += segment + "/";
	path_urls.push({
		html: decodeURIComponent(segment),
		url: path_url + search
	});
});

// Create the breadcrumb elements for each previous objects
path_urls.forEach(function(url) {
	var a = $("<a/>").attr("href", url.url).html(url.html);
	var li = $("<li/>").addClass("breadcrumb-item").append(a);
	$(".breadcrumb").append(li);
});

// Set the last breadcrumb item as active
$(".breadcrumb li").last()
	.addClass("active")
	.attr("aria-current", "page")
	.children("a").contents().unwrap();

////
//// Configure the <table>
////

// Column indexes
const columns = {
	"icon": 0,
	"name": 1,
	"date": 2,
	"size": 3,
};

// Use Bootstrap table
$("table").addClass("table").wrap("<div class='table-responsive'>");

// Remove valign="top" and align="right"
$("td, th").removeAttr("align").removeAttr("valign");

// Replace the first <td> into <th>
$("td:first-child").changeElementType("<th/>");

// Move all rows in <tbody>
$("table").prependIfNotExist("tbody", "<tbody/>").append($("tr"));

// Move table header in <thead>
$("table").prependIfNotExist("thead", "<thead/>").append($("tr").first());

// Clear the icon column of the header
$("thead th").eq(columns["icon"]).html("<i class='fa-fw far fa-home'/>");

// Trim each cells inner html
$("td, th").each(function() {
	$(this).html($(this).html().trim());
});

// Parse autoindex request query arguments
// As mod_autoindex still use ";" as separators URLSearchParams cannot be used
// So let's create a two dimensional array with the arguments
const args_array = search.split(/^\?|;|&/).filter(Boolean).map(e => e.split("="));
// Then convert it into a dictionary
const args = Object.fromEntries(args_array);

// Add sorting arrows
const sort_element_by_arg = {
	"N": $("thead th").eq(columns["name"]),
	"M": $("thead th").eq(columns["date"]),
	"S": $("thead th").eq(columns["size"]),
};

const sort_class_by_arg = {
	"A": "fa-fw fas fa-sort-down",
	"D": "fa-fw fas fa-sort-up",
};

if ("C" in args && "O" in args) {
	var icon = $("<i/>").addClass(sort_class_by_arg[args["O"]]);
	sort_element_by_arg[args["C"]].append(icon);
}

// Icon classes
const icon_class_by_type = {
	"default": "fa-fw far fa-file",
	"directory": "fa-fw fas fa-folder",
	"archive": "fa-fw far fa-file-archive",
	"audio": "fa-fw far fa-file-audio",
	"code": "fa-fw far fa-file-code",
	"excel": "fa-fw far fa-file-excel",
	"image": "fa-fw far fa-file-image",
	"pdf": "fa-fw far fa-file-pdf",
	"powerpoint": "fa-fw far fa-file-powerpoint",
	"text": "fa-fw far fa-file-alt",
	"video": "fa-fw far fa-file-video",
	"word": "fa-fw far fa-file-word",
};

// Server current date
const m_server = moment(server_date, moment.ISO_8601);

// Parse each row
$("tbody > tr").each(function(index) {
	var icon = $("td, th", this).eq(columns["icon"]);
	var name = $("td, th", this).eq(columns["name"]);
	var date = $("td, th", this).eq(columns["date"]);
	var size = $("td, th", this).eq(columns["size"]);
	var link = $("a", name);

	// Read the type from the <img> alt text
	var type = $("img", icon).attr("alt").replace(/[\[\] ]+/g, "");

	// Replace the icon
	if (type in icon_class_by_type) {
		icon.html("<i class='" + icon_class_by_type[type] + "'/>");
	} else {
		icon.html("<i class='" + icon_class_by_type["default"] + "'/>");
	}

	// Beautify date
	var m = moment(date.html(), "YYYY-MM-DD HH:mm");

	if (moment().diff(m, "days", true) < 1) {
		date.html(m.from(m_server));

	} else if (moment().diff(m, "weeks", true) < 1) {
		date.html(m.format("dddd LT"));

	} else {
		date.html(m.format("LLL"));
	}

	// Remove the parent row
	if (type === "parent") {
		$(this).remove();

	// Update directory style
	} else if (type === "directory") {
		link.attr("href", link.attr("href") + search);
		size.empty();
	}
});