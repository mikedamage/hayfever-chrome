module("harvest");

test('Harvest()', function() {
	// Use dummy auth info since we're mocking our AJAX
	var subdomain = "foobar"
		, authString = "bWlrZUBmaWZ0aHJvb21jcmVhdGl2ZS5jb206Zm9vYmFyMTIz";

	expect(2);

	ok(new Harvest(subdomain, authString), "Instantiates with proper arguments");
	raises(function() {
		var harvest = new Harvest();
		return harvest;
	}, null, "Raises exception with invalid arguments");
	
});

// vim: set sw=2 ts=2 syntax=jquery :
