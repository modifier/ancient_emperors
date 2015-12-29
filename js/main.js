var EMPERORS_PER_PAGE = 25;

var getYear = function (date) {
	if (!date) {
		return 'Unknown';
	}

	var matches = date.match(/^(-)?(\d+).*/),
		year = parseInt(matches[2], 10);

	if (matches[1]) {
		return (year - 1) + ' BCE';
	} else {
		return year + ' CE';
	}
};

var getUrl = function (label, url, targetBlank) {
	return '<a href="' + url + '"' + (targetBlank ? ' target="_blank"' : '') + '>' + label + '</a>';
};

var getTd = function (content, attributes) {
	var td = document.createElement('td');

	if (typeof content === 'string') {
		td.innerHTML = content;
	} else {
		td.appendChild(content);
	}

	return td;
};

var mainTBody;
var getMainTBody = function () {
	if (!mainTBody) {
		mainTBody = document.querySelector("#main_table tbody");
	}
	return mainTBody;
};

var getValue = function (row, item) {
	if (row[item]) {
		return row[item].value;
	} else {
		return '';
	}
};

var renderRow = function (emperor, emperorDetails) {
	var tr = document.createElement('tr'),
		details = emperorDetails[0];

	var detailsButton = document.createElement('button');
	detailsButton.className = "btn btn-primary";
	detailsButton.innerHTML = "View museum items";
	detailsButton.addEventListener('click', function () {
		loadItems(emperor.emperorLabel.value);
	});

	tr.appendChild(getTd(getUrl('<img src="' + getValue(details, 'image') + '" height="100" />', getValue(details, 'image'), true)));
	tr.appendChild(getTd(getUrl(emperor.emperorLabel.value, emperor.emperor.value) + ' ' + (details.sexLabel === 'male' ? '&#x2640;' : '&#x2642;')));
	tr.appendChild(getTd(getValue(emperor, 'positionLabel')));
	tr.appendChild(getTd(getUrl(getValue(details, 'countryLabel'), getValue(details, 'country'))));
	tr.appendChild(getTd(getUrl(getValue(details, 'birthPlaceLabel'), getValue(details, 'birthPlace')) + ' ' + getYear(getValue(details, 'birthDate'))));
	tr.appendChild(getTd(getUrl(getValue(details, 'deathPlaceLabel'), getValue(details, 'deathPlace')) + ' ' + getYear(getValue(details, 'deathDate'))));
	tr.appendChild(getTd(detailsButton));

	getMainTBody().appendChild(tr);
};

var mainPagination;
var getMainPagination = function () {
	if (!mainPagination) {
		mainPagination = document.querySelector("#main_table .pagination");
	}
	return mainPagination;
};

var renderPagination = function (page, count) {
	var totalPages = Math.ceil(count / EMPERORS_PER_PAGE);

	getMainPagination().innerHTML = "";

	for (var i = 1; i < totalPages; i++) {
		var pageItem = document.createElement("li");
		pageItem.innerHTML = getUrl(i, "#");

		if (i === page) {
			pageItem.className = "active";
		} else {
			(function (pageNo) {
				pageItem.addEventListener("click", function (evt) {
					loadMain(pageNo);

					evt.preventDefault();
				});
			})(i);
		}

		getMainPagination().appendChild(pageItem);
	}
};

function loadMain(page) {
	if (!page) {
		page = 1;
	}

	Queries.getEmperors(page, EMPERORS_PER_PAGE).done(function (emperors) {
		getMainTBody().innerHTML = "";

		for (var i in emperors) {
			(function (emperor) {
				Queries.getEmperorDetails(emperor.emperor.value).done(function (emperorDetails) {
					renderRow(emperor, emperorDetails);
				});
			})(emperors[i]);
		}
	});

	Queries.getEmperorCount().done(function (result) {
		renderPagination(page, result[0].count.value);
	});
};

loadMain();