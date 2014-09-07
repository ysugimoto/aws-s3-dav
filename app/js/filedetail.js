(function(DAV) {

    var fs   = require('fs');

    DAV.FileDetail = ({
        node: doc.getElementById('fileDetail'),
        dialog: doc.getElementById('downloadFile'),
        fileData: null,

        init: function() {
            this.node.addEventListener('click', this, false);
            this.dialog.addEventListener('change', this, false);
            doc.addEventListener('click', this, false);

            return this;
        },

        handleEvent: function(evt) {
            evt.stopPropagation();

            if ( evt.target.webkitMatchesSelector('#fileDetail button.btn-success') ) {
                this.openDialog();
            } else if ( evt.type === 'change' && evt.target === this.dialog ) {
                this.downloadFile(evt.target.value);
            } else {
                this.hide();
            }
        },

        show: function(fileData) {
            this.fileData = new FileData(fileData);

            // Remove child nodes
            while ( this.node.firstChild ) {
                this.node.removeChild(this.node.firstChild);
            }

            this.node.appendChild(this.fileData.getElement());
            this.node.classList.add('active');
        },

        hide: function() {
            this.node.classList.remove('active');
            this.dialog.value = '';
        },

        openDialog: function() {
            var evt = doc.createEvent('MouseEvent');

            evt.initEvent('click', true, false);
            this.dialog.setAttribute('nwsaveas', this.fileData.getFileName());
            this.dialog.dispatchEvent(evt);
        },

        downloadFile: function(savePath) {
            if ( ! this.fileData ) {
                return;
            }
            var that = this;

            DAV.Layer.show(true, this.fileData.getFileName() + 'をダウンロード中…');
            DAV.Layer.lock();

            fs.writeFile(savePath, this.fileData.getFileBuffer(), function(err) {
                if ( err ) {
                    alert('File save failed.');
                }
                DAV.Layer.hide();
            });

        }
    }).init();


    function FileData(fd) {
        this.fd = fd;
    }

    FileData.prototype.getElement = function() {
        var fragment = doc.createDocumentFragment(),
            fileName = doc.createElement('p'),
            fileSize = doc.createElement('p'),
            download = doc.createElement('button');

        fileName.appendChild(doc.createTextNode('FileName: ' + this.getFileName()));
        fileSize.appendChild(doc.createTextNode('FileSize: ' + this.getFileSize()));
        download.setAttribute('class', 'btn btn-success');
        download.appendChild(doc.createTextNode('Download'));

        fragment.appendChild(fileName);
        fragment.appendChild(fileSize);
        fragment.appendChild(download);

        return fragment;
    };
    FileData.prototype.getFileName = function() {
        return this.fd.name;
    };
    FileData.prototype.getFileSize = function() {
        return this.fd.size;
    };
    FileData.prototype.getFileBuffer = function() {
        return this.fd.buffer;
    };

})(DAV);
