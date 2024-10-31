/*
 * pwa.util.js - Utility functions used by PWA
 * Author      : Pro Writing Aid
 * License     : LGPL
 * Project     : http://www.prowritingaid.com/
 * Contact     : hello@prowritingaid.com
 */

/* EXPORTED_SYMBOLS is set so this file can be a JavaScript Module */
var EXPORTED_SYMBOLS = ['PWAUtil'];

function PWAUtil() {
};

PWAUtil.prototype.hasSuggestions = function (node) {
    var suggestions = $(node).attr('data-suggestions');
    return suggestions != undefined && suggestions != null && suggestions.length > 0;
};

PWAUtil.prototype.findSuggestions = function (node) {
    return $(node).attr('data-suggestions');
};

PWAUtil.prototype.removeTags = function(node, w) {   
	var count = 0;
	var parent = this;

	this.map(this.findSpans(node).reverse(), function(n) {
		if (n && (parent.isMarkedNode(n))) {
			if (!w || n.innerHTML == w) {
				parent.removeParent(n);
				count++;
			}
		}
	});

	return count;
};

PWAUtil.prototype.deleteTags = function (node, className) {
    var count = 0;
    var parent = this;

    this.map(this.findSpans(node).reverse(), function (n) {
        if (n && (parent.isMarkedNode(n)) && parent.hasClass(n,className)) {
            parent.remove(n);
            count++;
        }
    });

    return count;
};

PWAUtil.prototype.removeTagsByClass = function (node, className) {
    var count = 0;
    var parent = this;

    this.map(this.findSpans().reverse(), function (n) {
        if (n && (parent.isMarkedNode(n)) && parent.hasClass(n, className)) {
            parent.removeParent(n);
            count++;
        }
    });

    return count;
};

PWAUtil.prototype.isMarkedNode = function(node) {
	return (this.hasClass(node, 'pwa'));
};

PWAUtil.prototype.applySuggestion = function (element, suggestion) {
    if (suggestion == '(omit)') {
        element.parent.remove(element);
    }
    else {
        // find the id in case we're split
        var index = jQuery(element).attr("data-index");
        jQuery(element).html(suggestion);
        this.removeParent(element);
        // now remove all others with this index
        // jQuery(".grammar1").remove();
        this.deleteTags(undefined, "grammar" + index);
    }
};