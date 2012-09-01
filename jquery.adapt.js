;(function($) {

    var expando = '_adapter';

    $.adapt = function(value, key, parent) {
        if ($.isArray(value)) {
            return $($.map(value, function(value) {
                return new Adapter(value, key, parent);
            }));
        }
        return $(new Adapter(value, key, parent));
    };

    $.fn.vals = function() {
        return this.map(function() { return this.value; }).get();
    };

    function Adapter(value, name, parent) {
        if (value[expando]) {
            return value[expando];
        }
        value[expando] = this;
        this.value = value;
        if (name) {
            this.nodeName = name;
        }
        if (parent) {
            this.parentNode = parent;
        }
    }

    Adapter.prototype = {

        nodeType: 1,
        nodeName: '#fakeElement',

        // This makes jQuery/Sizzle think it's working with XML nodes.
        // Otherwise, it assumes all nodes have a querySelectorAll method
        // (which would be a lot of work to implement).
        documentElement: {
            nodeName: '#fakeDocument' // This can be anything that's not "HTML".
        },

        getElementsByTagName: function (tagName) {
            var elements = [];
            if ($.isPlainObject(this.value) || $.isArray(this.value)) {
                var self = this;
                $.each(this.value, function(key, value) {
                    if (value && key !== expando) {
                        var element = new Adapter(value, key, self);
                        if (tagName === '*' || key === tagName) {
                            elements.push(element);
                        }
                        if ($.isPlainObject(value) || $.isArray(value)) {
                            Array.prototype.push.apply(elements, element.getElementsByTagName(tagName));
                        }
                    }
                });
            }
            return elements;
        },

        // This allows "[attr=val]" queries to work.
        getAttribute: function(name) {
            return this.value[name];
        },

        // Sizzle uses this if document.contains is defined...
        contains: function(otherNode) {
            return !!(this.compareDocumentPosition(otherNode) & 16);
        },

        // ...or this if document.compareDocumentPosition is defined.
        compareDocumentPosition: function(otherNode) {
            var node = otherNode;
            while ((node = node.parentNode)) {
                //  Should this be node.value === this.value?
                if (node === this) {
                    return 16; // DOCUMENT_POSITION_CONTAINED_BY
                }
            }
            return 0;
        }

    };

})(jQuery);