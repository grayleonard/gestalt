class Gestalt {
	container: Element;
	pages: array;
	navs: array;
	constructor (container : Element) {
		this.container = container;
		this.registerNodes();
		this.initNavs();
		this.display();
	};
	registerNodes() {
		let self = this;
		self.pages = []
		self.navs = []
		let walker = document.createTreeWalker(self.container, NodeFilter.SHOW_ELEMENT, function(cn) {
			return !(!empty(cn.attributes.g) && cn.attributes.g.value == 'container')
		}, false)
		while(walker.nextNode()) {
			let cn = walker.currentNode
			if(!empty(cn.attributes.g) && cn.attributes.g.value == 'page')
				self.pages.push(cn)
			if(!empty(cn.attributes.g) && cn.attributes.g.value == 'nav')
				self.navs.push(cn)
		}
		self.pages = [].map.call(self.pages, function(c) {
			let p = c;
			if(c.parentNode) c.parentNode.removeChild(c);
			return p;
		});
	};
	initNavs() {
		let self = this;
		for(let nav of self.navs) {
			nav.onclick = (e) => {
				let target = e.target
				if(e.target.tagName.toLowerCase() !== 'a' && e.target.tagName.toLowerCase() !== 'button' )
					target = e.target.closest('a')
				self.display(target.attributes.gn.value, target)
			}
		}
	}
	display(pid?: int, nav : Element) {
		let self = this;
		for(let child of self.container.children) {
			if (!empty(child.attributes.g) && child.attributes.g.value == 'page')
				self.container.removeChild(child);
		}
		if(!pid) {
			if(document.location.hash !== '') {
				let loc = document.location.hash.split('#')[1]
				self.display(loc)
			}
		}
		let pageCurr = null
		for(let page of self.pages) {
			// 
			if(!pid && !empty(page.attributes.gs) && page.attributes.gs.value == 'default') 
				pageCurr = page
			if(pid && !empty(page.attributes.gp) && page.attributes.gp.value == pid)
				pageCurr = page
		}
		self.container.appendChild(pageCurr)
		document.location.hash = '#' + pageCurr.attributes.gp.value
		if(!empty(nav) && !empty(nav.attributes.gns)) {
			document.location.hash = '#' + nav.attributes.gns.value;
		}
	}
}

empty = (value) => value === null || typeof value === "undefined";

var containers = document.querySelectorAll('div[g="container"]')

let gestalts = []

for(let container of containers)
	gestalts.push(new Gestalt(container))
