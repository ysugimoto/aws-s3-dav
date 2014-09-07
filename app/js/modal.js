(function(DAV) {

    var when = require('when');

    function Modal() {
        this.element    = this.initModal();
        this.message    = this.element.querySelector('h3');
        this.ok         = this.element.getElementsByTagName('button')[0];
        this.cancel     = this.element.getElementsByTagName('button')[1];
        this.defer      = null;
        this.blinkTimer = null;

        this.ok.addEventListener('click',     this, false);
        this.cancel.addEventListener('click', this, false);
    }

    Modal.prototype.initModal = function() {
        var doc     = document,
            element = doc.getElementById('modal'),
            html;

        if ( ! element ) {
            element = doc.createElement('div');
            element.setAttribute('id', 'modal');
            html  = '<h3 class="message"></h3>';
            html += '<div class="buttons">';
            html +=   '<button class="ok btn btn-success"><span class="icon icon-ok"></span>OK</button>',
            html +=   '<button class="cancel btn-primary"><span class="icon icon-cancel"></span>Cancel</button>';
            html += '</div>';
            element.innerHTML = html;
            doc.body.appendChild(element);
        }

        element.style.display = 'none';

        return element;
    };

    Modal.prototype.alert = function(message) {
        this.message.innerHTML    = message.replace('¥n', '<br>');
        this.cancel.style.display = 'none';

        this.element.style.display = 'block';
        DAV.Layer.show(false);
        DAV.Layer.lock();
        DAV.Layer.addRelationElement(this.element);

        this.defer = when.defer();

        return this.defer.promise;

    };

    Modal.prototype.confirm = function(message) {
        this.message.innerHTML    = message.replace('¥n', '<br>');
        this.cancel.style.display = 'inline-block';

        this.element.style.display = 'block';
        DAV.Layer.show(false);
        DAV.Layer.lock();
        DAV.Layer.addRelationElement(this.element);

        this.defer = when.defer();

        return this.defer.promise;
    };

    Modal.prototype.handleEvent = function(evt) {
        if ( ! this.defer ) {
            return;
        }
    
        if ( evt.currentTarget.classList.contains('ok') ) {
            this.defer.resolve();
            this.element.style.display = 'none';
            DAV.Layer.hide();
            this.defer = null;
        } else if ( evt.currentTarget.classList.contains('cancel') ) {
            this.element.style.display = 'none';
            DAV.Layer.hide();
            this.defer.reject();
            this.defer = null;
        } else if ( evt.target === DAV.Layer.get() && ! this.blinkTimer ) {
            this.element.classList.add('notify');
            this.blinkTimer = setTimeout(function() {
                this.element.classList.remove('notify');
                this.blinkTimer = null;
            }.bind(this), 400);
        }
    };

    DAV.Modal = new Modal();

})(DAV);
