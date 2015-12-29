var musuemTBody;
var getMuseumTBody = function () {
	if (!musuemTBody) {
		musuemTBody = document.querySelector("#museum_table tbody");
	}
	return musuemTBody;
};

var renderMuseumRow = function (item) {
	var row = document.createElement('tr');

	row.appendChild(getTd(getUrl('<img src="' + getValue(item, 'image') + '" height="200"/>', getValue(item, 'image'), true)));
	row.appendChild(getTd(getUrl(getValue(item, 'itemLabel'), getValue(item, 'item'))));
	row.appendChild(getTd(getValue(item, 'comment')));
	row.appendChild(getTd(getValue(item, 'description')));

	getMuseumTBody().appendChild(row);

	console.log(item);
};

var renderItems = function (items) {
	getMuseumTBody().innerHTML = '';

	if (items.length === 0 || Object.keys(items[0]).length === 0) {
		var row = document.createElement('tr');
		var td = document.createElement('td');
		td.innerHTML = 'No items for this ruler found in the collection of the British Museum. Sorry.';
		td.colSpan = 4;

		row.appendChild(td);
		getMuseumTBody().appendChild(row);

		return;
	}

	for (var i in items) {
		renderMuseumRow(items[i]);
	}
};

function backToMain () {
	document.body.className = 'main';
}

function loadItems (emperorName) {
	document.body.className = 'museum';

	Queries.getEmperorItems(emperorName).done(function (result) {
		renderItems(result);
	});
}
