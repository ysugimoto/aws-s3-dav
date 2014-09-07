(function(DAV) {

    DAV.Breadcrumb = ({
        node:   doc.querySelector('.breadcrumb'),
        items:  null,
        active: null,

        init: function() {
            this.items = this.node.getElementsByTagName('a');

            return this;
        },

        getCurrentDirectory: function() {
            var paths = [];

            [].forEach.call(this.items, function(item) {
                var dir = item.parentNode.getAttribute('data-directoryname');

                if ( dir !== '/' ) {
                    paths.push(dir);
                }
            });

            return ( paths.length > 0 ) ? paths.join('/') + '/' : '';
        },

        append: function(pathName) {
            var li = doc.createElement('li'),
                a  = doc.createElement('a');

            if ( this.active ) {
                this.active.classList.remove('active');
            }

            li.classList.add('active');
            li.setAttribute('data-directoryname', pathName);
            a.setAttribute('href', 'javascript:void(0)');
            a.appendChild(doc.createTextNode(pathName));

            li.appendChild(a);
            this.node.appendChild(li);
        },

        reset: function() {
            while ( this.node.firstChild ) {
                this.node.removeChild(this.node.firstChild);
            }
        },

        remove: function(pathName) {
            var finded = false,
                node   = this.node;

            [].forEach.call(this.items, function(item) {
                if ( finded === true || item.getAttribute('href').slice(1) === pathName ) {
                    finded = true;
                    node.removeChild(item.parentNode);
                }
            });

            if ( this.items.length > 0 ) {
                this.items[this.items.length - 1].parentNode.classList.add('active');
            }
        }
    }).init();

})(DAV);
