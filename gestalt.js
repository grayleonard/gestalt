var Gestalt = /** @class */ (function () {
    function Gestalt(container) {
        this.container = container;
        this.registerNodes();
        this.initNavs();
        this.display();
    }
    ;
    Gestalt.prototype.registerNodes = function () {
        var self = this;
        self.pages = [];
        self.navs = [];
        var walker = document.createTreeWalker(self.container, NodeFilter.SHOW_ELEMENT, function (cn) {
            return !(!empty(cn.attributes.g) && cn.attributes.g.value == 'container');
        }, false);
        while (walker.nextNode()) {
            var cn = walker.currentNode;
            if (!empty(cn.attributes.g) && cn.attributes.g.value == 'page')
                self.pages.push(cn);
            if (!empty(cn.attributes.g) && cn.attributes.g.value == 'nav')
                self.navs.push(cn);
        }
        self.pages = [].map.call(self.pages, function (c) {
            var p = c;
            if (c.parentNode)
                c.parentNode.removeChild(c);
            return p;
        });
    };
    ;
    Gestalt.prototype.initNavs = function () {
        var self = this;
        for (var _i = 0, _a = self.navs; _i < _a.length; _i++) {
            var nav = _a[_i];
            nav.onclick = function (e) {
                var target = e.target;
                if (e.target.tagName.toLowerCase() !== 'a' && e.target.tagName.toLowerCase() !== 'button')
                    target = e.target.closest('a');
                self.display(target.attributes.gn.value, target);
            };
        }
    };
    Gestalt.prototype.display = function (pid, nav) {
        var self = this;
        for (var _i = 0, _a = self.container.children; _i < _a.length; _i++) {
            var child = _a[_i];
            if (!empty(child.attributes.g) && child.attributes.g.value == 'page')
                self.container.removeChild(child);
        }
        if (!pid) {
            if (document.location.hash !== '') {
                var loc = document.location.hash.split('#')[1];
                self.display(loc);
            }
        }
        var pageCurr = null;
        for (var _b = 0, _c = self.pages; _b < _c.length; _b++) {
            var page = _c[_b];
            // 
            if (!pid && !empty(page.attributes.gs) && page.attributes.gs.value == 'default')
                pageCurr = page;
            if (pid && !empty(page.attributes.gp) && page.attributes.gp.value == pid)
                pageCurr = page;
        }
        self.container.appendChild(pageCurr);
        document.location.hash = '#' + pageCurr.attributes.gp.value;
        if (!empty(nav) && !empty(nav.attributes.gns)) {
            document.location.hash = '#' + nav.attributes.gns.value;
        }
    };
    return Gestalt;
}());
empty = function (value) { return value === null || typeof value === "undefined"; };
var containers = document.querySelectorAll('div[g="container"]');
var gestalts = [];
for (var _i = 0, containers_1 = containers; _i < containers_1.length; _i++) {
    var container = containers_1[_i];
    gestalts.push(new Gestalt(container));
}
