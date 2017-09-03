/**
 * @jsx h
 */
function view(count) {
	return h(
		"ul",
		{ id: "cool", className: "cool" },
		h(
			"li",
			{ className: "tester" },
			"Line 1"
		),
		h(
			"li",
			{ className: "tester" },
			"Line 1"
		)
	);
}
