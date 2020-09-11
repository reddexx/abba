// Use Bootstrap table
$("table").addClass("table table-hover").wrap("<div class='table-responsive'>");

// Remove valign="top" and align="right"
$("td, th").removeAttr("align").removeAttr("valign");

// Replace the first <td> into <th>
$("td:first-child").changeElementType("<th/>");

// Move all rows in <tbody>
$("table").prependIfNotExist("tbody", "<tbody/>").append($("tr"));

// Move table header in <thead>
$("table").prependIfNotExist("thead", "<thead/>").append($("tr").first());

// Clear the icon column of the header
$("th").first().empty();

// Trim each cells inner html
$("td, th").each(function() {
	$(this).html($(this).html().trim());
});

const icon_classe_by_type = {
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

// Parse each row
$("tbody > tr").each(function(index) {
	var icon = $("th", this).first();
	var size = $("td", this).last();

	// Read the type from the <img> alt text
	var type = $("img", icon).attr("alt").replace(/[\[\] ]+/g, "");

	// Replace the icon
	if (type in icon_classe_by_type) {
		icon.html("<i class='" + icon_classe_by_type[type] + "'/>");
	} else {
		icon.html("<i class='" + icon_classe_by_type["default"] + "'/>");
	}

	// Remove the parent row
	if (type === "parent") {
		$(this).remove();

	// Update directory style
	} else if (type === "directory") {
		size.empty();
	}
});

// Show main
$("main").show();