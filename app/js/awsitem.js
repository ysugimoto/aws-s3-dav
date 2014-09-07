(function(DAV) {

    var Path = require('path');
    var when = require('when');
    var StringDecoder = require('string_decoder');

    DAV.Item = Item;

    /**
     * Constructor
     */
    function Item(obj) {
        this.obj      = obj;
        this.element  = null;
        this.itemType = this._detectItemType(obj.Key);
    }

    Item.prototype.getName = function() {
        return this.obj.Key;
    };

    Item.prototype.getElement = function() {
        var txt;

        if ( ! this.element ) {
            this.element = doc.createElement('div');
            this.element.classList.add('icon-' + this.itemType);
            txt = doc.createElement('p');
            if ( this.itemType == 'directory' ) {
                txt.appendChild(doc.createTextNode(this.obj.Key.replace(/\/$/, '')));
            } else {
                txt.appendChild(doc.createTextNode(this.obj.Key.split('/').pop()));
            }
            this.element.appendChild(txt);
        }

        return this.element;
    };

    Item.prototype._detectItemType = function(name) {
        var types = {
            'directory': /.+\/$/,
            'image': /.+\.(gif|jpe?g|png)$/,
            'file': /.*/
        }, type;

        Object.keys(types).forEach(function(key) {
            if ( ! type && types[key].test(name) ) {
                type = key;
            }
        });

        return type;
    };

    Item.prototype.getObject = function(bucketName) {
        var deferred = when.defer();
        var file     = this.obj;

        DAV.Server.getObject({Bucket: bucketName, Key: file.Key}, function(err, data) {
            if ( err ) {
                deferred.reject(err);
                return;
            }

            // trick: convert node's Buffer to JavaScript ArrayBuffer
            var size      = data.Body.length,
                aryBuffer = new ArrayBuffer(size),
                uint8     = new Uint8Array(aryBuffer),
                i         = 0,
                dataView, // JS DataView
                blob,     // JS Blob
                url;      // Object URL

            for ( ; i < size; ++i ) {
                uint8[i] = data.Body[i];
            }

            dataView = new DataView(aryBuffer);
            blob     = new Blob([dataView], {type: 'application/octet-stream'});
            url      = window.webkitURL.createObjectURL(blob);

            // resolve these data
            deferred.resolve({
                 size: data.ContentLength,
                 name: file.Key.split('/').pop(),
                 downloadURL: url,
                 buffer: data.Body
            });
        });

        return deferred.promise;
    };
})(DAV);
