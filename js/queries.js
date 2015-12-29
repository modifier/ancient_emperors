var Queries = (function () {
	var EmperorPredicates = {
		sex: ['P21', true],
		deathDate: ['P570'],
		deathPlace: ['P20', true],
		birthDate: ['P569'],
		birthPlace: ['P19', true],
		country: ['P27', true],
		image: ['P18']
	};

	var getXhr = function (options) {
		var xhr = new XMLHttpRequest(),
			dfd = new Deferred();

		xhr.open("GET", options.url, true);
		xhr.onreadystatechange = function() {
		  if (xhr.readyState == 4) {
		     if(xhr.status == 200) {
		     	var response = JSON.parse(xhr.responseText);

		        dfd.resolve(response.results.bindings);
		    }
		  }
		};
		xhr.send(null);

		return dfd;
	};

	var getEmperorCount = function () {
		var query = [
		"PREFIX wd: <http://www.wikidata.org/entity/>",
		"PREFIX wdt: <http://www.wikidata.org/prop/direct/>",
		"PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema%23>",
		"SELECT (Count(?emperor) as ?count) WHERE {",
		"  ?emperor wdt:P39 ?position .", // the emperor is defined by position
		"  ?position wdt:P279* wd:Q116 .", // which is a sublass of monarch
		"  ?emperor wdt:P570 ?date .", // and which lived in antique epoque
		"   FILTER (?date < \"476-01-01T00:00:00Z\"^^xsd:dateTime)",
		" }"];

		return getXhr({
			url: "http://query.wikidata.org/sparql?format=json&query=" + query.join(" ")
		});
	};

	var getEmperors = function (page, perPage) {
		var query = [
		"PREFIX wikibase: <http://wikiba.se/ontology%23>",
		"PREFIX wd: <http://www.wikidata.org/entity/>",
		"PREFIX wdt: <http://www.wikidata.org/prop/direct/>",
		"PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema%23>",
		"SELECT ?emperor ?emperorLabel ?positionLabel ?date WHERE {",
		"  ?emperor wdt:P39 ?position .", // the emperor is defined by position
		"  ?position wdt:P279* wd:Q116 .", // which is a sublass of monarch
		"  ?emperor wdt:P570 ?date .", // and which lived in antique epoque
		"   FILTER (?date < \"476-01-01T00:00:00Z\"^^xsd:dateTime)",
		"  SERVICE wikibase:label {",
		"    bd:serviceParam wikibase:language \"en\" .",
		"    ?emperor rdfs:label ?emperorLabel .",
		"    ?position rdfs:label ?positionLabel",
		"  }",
		" }",
		" ORDER BY ASC(?date)"];

		query.push("LIMIT " + perPage + " OFFSET " + (page - 1) * perPage);

		return getXhr({
			url: "http://query.wikidata.org/sparql?format=json&query=" + query.join(" ")
		});
	};

	var getEmperorDetails = function (emperorLink) {
		var query = [
		"PREFIX emperor: <" + emperorLink + ">",
		"PREFIX wikibase: <http://wikiba.se/ontology%23>",
		"PREFIX wdt: <http://www.wikidata.org/prop/direct/>",
		"PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema%23>",
		"SELECT * WHERE {"];

		for (var predicateName in EmperorPredicates) {
			var predicate = EmperorPredicates[predicateName];
			query.push("OPTIONAL {");
			query.push("emperor: wdt:" + predicate[0] + " ?" + predicateName + " .");
			if (predicate[1]) {
				query.push("?" + predicateName + " rdfs:label ?"  + predicateName + "Label .");
				query.push("FILTER (LANGMATCHES(LANG(?" + predicateName + "Label), \"EN\")) .");
			}
			query.push("} .");
		}

		query.push(" }");

		return getXhr({
			url: "http://query.wikidata.org/sparql?format=json&query=" + query.join(" ")
		});
	};

	var getEmperorItems = function (emperorName) {
		var query = ["SELECT * WHERE {",
		"  ?emperor rdfs:label \"" + emperorName + "\" .",
		"  ?emperor rdf:type ecrm:E21_Person .",
		"  ?item ecrm:P62_depicts ?emperor .",
		"  ?item rdfs:label ?itemLabel .",
		"  OPTIONAL { ?item bmo:PX_physical_description ?description } .",
		"  OPTIONAL { ?item bmo:PX_curatorial_comment ?comment } .",
		"  OPTIONAL { ?item bmo:PX_has_main_representation ?image }",
		"}",
		" LIMIT 50"];

		return getXhr({
			url: "http://collection.britishmuseum.org/sparql.json?query=" + query.join(" ")
		});
	};

	return {
		getEmperors: getEmperors,
		getEmperorDetails: getEmperorDetails,
		getEmperorCount: getEmperorCount,
		getEmperorItems: getEmperorItems
	};
})();
