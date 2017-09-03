/**
 * @jsx h
 */
const CREATE = 'CREATE'
const UPDATE = 'UPDATE' // continue - default mode
const REPLACE = 'REPLACE'
const REMOVE = 'REMOVE'
const SET_PROP = 'SET_PROP'
const REMOVE_PROP = 'REMOVE_PROP'

function flatten(arr) {
	return [].concat.apply([], arr)
}

function h(type, props, ...children) {
	props = props || {}

	return { type, props, children: flatten(children) }
}

function view(count) {
	const arr = [...Array(count).keys()]

	return(
		<ul id="cool" className={`count-${count % 3}`}>
		{ 
			arr.map(num => 
				<li>
				  Item {(count * num).toString()}
				</li>
			) 
		}
		</ul>
	)
}

function setProp(target, name, value) {
	if (name === 'className') {
		return target.setAttribute('class', value)
	}
	target.setAttribute(name, value)
}

function setProps(target, props) {
	Object.keys(props).forEach(name => {
		setProp(target, name, props[name])
	})
}

function createElement(node) {
	if (typeof node === 'string') {
		return document.createTextNode(node) 
	}
	const el = document.createElement(node.type)

	setProps(el, node.props) 

 	node.children
		.map(createElement)
		.forEach(el.appendChild.bind(el))

	return el
}

function patch(parent, patches, index = 0) {
	// if nothing to do, just return
	if (!patches) { return }
	
	// will be doing patching on the top level node.
	// so in the first iteration parent is #root, so the parent is <ul>
	const el = parent.childNodes[index]
	
	switch (patches.type) {
		case CREATE: {
			// actually create the element.
			// first get newNode from patches
			const { newNode } = patches

			// create a new element
			const newEl = createElement(newNode)

			// append to parent and return.
			return parent.appendChild(newEl)
		}
		case REMOVE: {
			// Easiest case. just remove the child from parent.
			// So if #root is the parent, el is <ul>, so we would be calling
			// #root.removeChild(ul)
			return parent.removeChild(el)
		}
		case REPLACE:
			// almost the same as CREATE.
			// create new node using existing node from patches
			const { newNode } = patches
			const newEl = createElement(newNode)

			// replace old node with new one.
			return parent.replaceChild(newEl, el)
		case UPDATE: {
			// apply
			const {children} = patches
			for (let i = 0; i < children.length; ++i) { 
				console.log('children', children[i], el)
				patch(el, children[i], i)
			}
		}
	}

}

function diffChildren(newNode, oldNode) {
	// end result - list of changes to make (patches)
	const patches = []	 

	// with each op, look for worst case scenario,
	// so the most number of children (for new or old state)
	const patchesLength = Math.max(newNode.children.length, oldNode.children.length)

	for (let i = 0; i < patchesLength; ++i) {
		// diff each child
		// recursive
		patches[i] = diff(
			newNode.children[i],
			oldNode.children[i]
		)
	}
	return patches
}

function diff(newNode, oldNode) {
	if (!oldNode) {
		// there is no old, but a new one. So we need to CREATE
		return { type: CREATE, newNode }
	}	
	if (!newNode) {
		// there is no node, but an old one. So REMOVE
		return { type: REMOVE }
	}
	if (changed(newNode, oldNode)) {
		return { type: REPLACE, newNode }
	}
	if (newNode.type) {
		// if there is a type, aka not a string, update.	
		return { type: UPDATE, children: diffChildren(newNode, oldNode) }
	}
}

function changed(node1, node2) {
	return typeof node1 !== typeof node2  // if the type change from object to string
		|| typeof node1 === 'string' && node1 !== node2 // if the inner string changed
	  || node1.type !== node2.type // if the type changed, eg <div> to <span>

}

function tick(el, count) {
	const patches = diff(view(count + 1), view (count))

	patch(el, patches)
	console.log(el, patches)

	if (count > 20) 
		return

	setTimeout(() => tick(el, count + 1), 500)
}

function render(el) {
	el.appendChild(createElement(view(0)))

	setTimeout(() => {
		tick(el, 0)
	}, 500)
}
