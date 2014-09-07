(function(DAV) {

    DAV.Bucket = Bucket;

    var bucketCache = [];
    var when        = require('when');
    var fs          = require('fs');
    var Path        = require('path');

    /**
     * Constructor
     * @param AWS.S3 instance
     */
    function Bucket(bucketObject) {
        this._bucket  = bucketObject;
        this._objects = null;
    }

    /**
     * Get Bucket list
     * @access static
     * @return deferred
     */
    Bucket.getBucketList = function() {
        var deferred = when.defer(),
            buckets  = [];

        if ( bucketCache.length > 0 ) {
            deferred.resolve(bucketCahce);
        } else {
            DAV.Server.listBuckets({}, function(err, data) {
                if ( err ) {
                    deferred.reject('接続エラーです。\nアクセスキーを確認してください。');
                } else {
                    data.Buckets.forEach(function(bucket) {
                        buckets.push(new DAV.Bucket(bucket));
                    });
                    bucketCache = buckets;
                    deferred.resolve(bucketCache);
                }
            });
        }

        return deferred.promise;
    };

    /**
     * Get bucket name
     * @return string
     */
    Bucket.prototype.getName = function() {
        return this._bucket.Name || "";
    };

    /**
     * Get Objects in this bucket
     * @param String dir
     * @return Array<Item>
     */
    Bucket.prototype.getItems = function(dir) {
        var deferred = when.defer(),
            that     = this,
            name     = this.getName(),
            contents = [],
            marker   = (dir || '/').replace(/^\//, '');

        if ( this._objects ) {
            deferred.resolve(this._objects);
        } else {
            DAV.Server.listObjects({"Bucket": name, "Marker": marker}, function(err, data) {
                if ( err ) {
                    deferred.reject(name + 'のファイル一覧が\n取得できませんでした。');
                } else {
                    that._objects = new DAV.ItemList(data.Contents);
                    deferred.resolve(that._objects);
                }
            });
        }

        return deferred.promise;
    };

    Bucket.uploadObject = function(files) {
        var i = 0;

        DAV.Layer.show(true, 'アップロードを開始します');
        DAV.Layer.lock();

        (function upload(file) {
            if ( file === void 0 ) {
                return;
            }

            DAV.Layer.notify(Path.basename(file.name) + 'をアップロード中…');

            fs.readFile(file.path, function(err, buffer) {
                if ( err ) {
                    return;
                }
                var params = {
                    Key:    DAV.Breadcrumb.getCurrentDirectory() + Path.basename(file.name),
                    Body:   buffer,
                    Bucket: DAV.currentBucket
                };

                DAV.Server.putObject(params, function(err) {
                    if ( err ) {
                        DAV.Modal.alert('ファイルのアップロードに失敗しました。');
                        return;
                    }
                    upload(files[i++]);
                });
            });
        })(files[i++]);
    };

})(DAV);
