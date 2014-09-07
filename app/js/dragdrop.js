(function(DAV) {

    DAV.DragDrop = DragDrop;

    function DragDrop(callback) {
        this.callback = callback;

        this.setUp();
    }

    DragDrop.prototype.setUp = function() {
        var layer = DAV.Layer.get();

        doc.addEventListener('dragenter', this, false);
        doc.addEventListener('dragover',  this, false);
        doc.addEventListener('dragleave', this, false);

        // Drop element event handle
        layer.addEventListener('dragenter', this.cancelEvent, false);
        layer.addEventListener('dragover',  this.cancelEvent, false);
        layer.addEventListener('dragleave', this,        false);
        layer.addEventListener('drop',      this,        false);
    };

    DragDrop.prototype.cancelEvent = function(evt) {
        evt.preventDefault();
        evt.stopPropagation();
    };

    DragDrop.prototype.handleEvent = function(evt) {
        switch ( evt.type ) {
            case 'dragenter':
            case 'dragover':
                  this.dragInit(evt);
                break;
            case 'dragleave':
                this.dragEnd(evt);
                break;
            case 'drop':
                this.dropFile(evt);
                break;
            default :
                break;
        }
    };

    DragDrop.prototype.dragInit = function(evt) {
        DAV.Layer.show(false, 'Dropでアップロードできます');
    };

    DragDrop.prototype.dragEnd = function(evt) {
        evt.preventDefault();
        if ( evt.pageX < 1 || evt.pageY < 1 ) {
            DAV.Layer.hide();
        }
    };

    DragDrop.prototype.dropFile = function(evt) {
        this.cancelEvent(evt);
        DAV.Layer.hide();

        console.log(this.callback);
        this.callback(evt.dataTransfer.files);
    };
})(DAV);
