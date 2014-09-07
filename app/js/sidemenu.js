(function(DAV) {

    DAV.SideMenu = ({
        menu: doc.querySelector('.buckets > .nav'),

        init: function() {
            this.menu.addEventListener('click', this, false);
            return this;
        },

        handleEvent: function(evt) {
            var item       = evt.target.parentNode,
                bucketName = item.getAttribute('data-bucketname');

            evt.preventDefault();

            this.setActiveElement(item);
            DAV.currentBucket = bucketName;
            DAV.Breadcrumb.reset();
            DAV.loadObjects(bucketName, '/');
        },

        append: function(item, active) {
            this.menu.appendChild(item);

            if ( active ) {
                this.setActiveElement(item);
            }
        },

        setActiveElement: function(item) {
            if ( this.activeMenu ) {
                this.activeMenu.classList.remove('active');
            }
            item.classList.add('active');
            this.activeMenu = item;
            localStorage.setItem('selectedBucket', item.getAttribute('data-bucketname'));
        }
    }).init();

})(DAV);
