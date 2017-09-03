/**
 * @jsx h
 */
function flatten(arr) {
	return [].concat.apply([], arr);
}

function h(type, props, ...children) {
	props = props || {};
	return { type, props, children //: flatten(children) }
	};
}

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
			"Line 2"
		)
	);
}

function setProp(target, name, value) {
	if (name === 'className') {
		return target.setAttribute('class', value);
	}
	target.setAttribute(name, value);
}

function setProps(target, props) {
	Object.keys(props).forEach(name => {
		setProp(target, name, props[name]);
	});
}

function createElement(node) {
	if (typeof node === 'string') {
		return document.createTextNode(node);
	}
	const el = document.createElement(node.type);

	setProps(el, node.props);

	node.children.map(createElement).forEach(el.appendChild.bind(el));

	return el;
}

function render(el) {
	el.appendChild(createElement(view(0)));
}
