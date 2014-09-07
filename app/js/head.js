var AWS = require('aws-sdk');
var DAV = {};
var doc = document;

// Hack for node-webkit runtime on node
AWS.util.isBrowser = function() {
    return false;
};
DAV.Server = new AWS.S3();
