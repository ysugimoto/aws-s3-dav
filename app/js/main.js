DAV.buckets       = {};
DAV.currentBucket = null;

DAV.init = function() {
    var selected = localStorage.getItem('selectedBucket'),
        promise;

    DAV.Layer.show(true, 'Bucket情報を取得中...');
    promise = DAV.Bucket.getBucketList();
    promise.then(function(buckets) {
        var menu = doc.querySelector('.buckets > ul');

        if ( buckets.length === 0 ) {
            return alert('Buckets not found.\nPlease create bucket on AWS management console.');
        }

        buckets.forEach(function(bucket, index) {
            var item     = doc.createElement('li'),
                a        = doc.createElement('a'),
                name     = bucket.getName(),
                isActive = false;

            if ( selected === name ) {
                item.setAttribute('class', 'active');
                DAV.SideMenu.setActiveElement(item);
                isActive           = true;
                DAV.currentBucket = name;
            }

            a.appendChild(doc.createTextNode(name));
            a.setAttribute('href', name);
            item.appendChild(a);
            item.setAttribute('data-bucketname', name);
            menu.appendChild(item, isActive);
            DAV.buckets[name] = bucket;
        });

        if ( ! DAV.currentBucket ) {
            DAV.currentBucket = buckets[0].getName();
            DAV.SideMenu.setActiveElement(menu.firstElementChild);
        }

        DAV.loadObjects(DAV.currentBucket, '/');
    },
    function(msg) {
        DAV.Modal.alert(msg)
        .done(function() {
             localStorage.removeItem('accessKeyId');
             localStorage.removeItem('secretAccessKey');
             DAV.Setting.show(DAV.init, true);
        });
    });

};

DAV.loadObjects = function(bucketName, dir) {
    var bucket = DAV.buckets[bucketName],
        cache;

    if ( ! bucket ) {
        DAV.Modal.alert('Error: bucket "' + bucketName + '" not found');
        return;
    }

    DAV.Layer.show(true, bucket.getName() + 'のファイル一覧を取得中...');

    cache = DAV.FileList.getByCache(bucketName, dir);
    if ( cache !== null ) {
        console.log('Loaded from cache' + bucketName + '/dir');
        DAV.FileList.reload(cache, dir);
        DAV.Layer.hide();
    } else {
        bucket.getItems(dir)
        .then(function(items) {
            DAV.FileList.reload(items.getItems(), dir);
            DAV.Layer.hide();
        },
        function(msg) {
            DAV.Modal.alert(msg);
        });
    }
};

var config = DAV.Setting.getConfigObject();

if ( config === null ) {
    DAV.Setting.show(DAV.init, true);
} else {
    DAV.Server.config.update(config);
    DAV.init();
}

new DAV.DragDrop(DAV.Bucket.uploadObject);
