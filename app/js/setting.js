(function(DAV) {

    DAV.Setting = ({
        trigger:       doc.querySelector('.config'),
        form:          doc.getElementById('setting'),
        saveButton:    doc.querySelector('#setting button'),
        opened:        false,
        savedCallback: null,

        init: function() {
            this.trigger.addEventListener('click', this, false);
            this.saveButton.addEventListener('click', this);

            return this;
        },
        
        handleEvent: function(evt) {
            var target = evt.target;

            if ( target === this.trigger ) {
                if ( this.opened === false ) {
                    this.show();
                } else {
                    this.hide();
                }
                this.opened = !this.opened;
            } else if ( target.webkitMatchesSelector('#setting button') ) {
                evt.preventDefault();
                this.save();
            }
        },

        show: function(savedCallback, lock) {
            DAV.Layer.show(false);
            DAV.Layer.addRelationElement(this.form);
            if ( lock ) {
                DAV.Layer.lock();
            }
            this.form.style.display = 'block';
            this.setErrorMessage('');
            this.setButtonState();

            if ( lock ) {
                DAV.Layer.lock();
            }

            this.savedCallback = savedCallback || null;
        },

        hide: function() {
            DAV.Layer.hide();
            this.form.style.display = 'none';
        },

        getConfigObject: function() {
            var keyId  = localStorage.getItem('accessKeyId'),
                secret = localStorage.getItem('secretAccessKey');

            if ( keyId && secret ) {
                this.form.querySelector('#inputAccessKey').value       = keyId;
                this.form.querySelector('#inputSecretAccessKey').value = secret;
                return {
                    accessKeyId:     keyId,
                    secretAccessKey: secret
                };
            } else {
                return null;
            }
        },

        setErrorMessage: function(msg) {
            this.form.querySelector('#settingError').textContent = msg;
        },

        setButtonState: function(status) {
            var button = this.saveButton;

            button.classList.remove('btn-danger');
            button.classList.remove('btn-success');
            button.classList.remove('btn-primary');
            
            switch ( status ) {
                case 'saved':
                    button.classList.add('btn-success');
                    button.textContent = 'saved!';
                    break;

                case 'error':
                    button.classList.add('btn-danger');
                    break;

                default:
                    button.classList.add('btn-primary');
                    button.textContent = 'save';
                    break;
            }
        },

        save: function() {
            var keyId  = this.form.querySelector('#inputAccessKey').value,
                secret = this.form.querySelector('#inputSecretAccessKey').value,
                that   = this;

            if ( keyId === '' || secret === '' ) {
                this.setErrorMessage('Both value must not be empty.');
                this.setButtonState('error');
                return;
            }

            localStorage.setItem('accessKeyId', keyId);
            localStorage.setItem('secretAccessKey', secret);
            DAV.Server.config.update({
                accessKeyId:     keyId,
                secretAccessKey: secret
            });

            this.setErrorMessage('');
            this.setButtonState('saved');

            // A few times delay
            setTimeout(function() {
                DAV.Layer.unlock();
                DAV.Layer.hide();
                that.hide();
                if ( typeof that.savedCallback === 'function' ) {
                    that.savedCallback();
                    that.savedCallback = null;
                }
            }, 1000);
        }
    }).init();

})(DAV);
