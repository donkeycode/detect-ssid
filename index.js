var os = require('os');
var exec = require('child_process').exec;

var getOsxSSID = function getOsxSSID(done) {
    var cmd = "/System/Library/PrivateFrameworks/Apple80211.framework/Versions/Current/Resources/airport -I | awk '/ SSID/ {print substr($0, index($0, $2))}'";

    exec(cmd, done);
};

var getWinSSID = function getWinSSID(done) {
    var cmd = "netsh wlan show interfaces | findstr /R /C:\" SSID\"";

    exec(cmd, function (error, stdout, stderr) {
        var parts = stdout.trim().split(':');

        if (parts.length < 2) {
            done("No ssid found", "", stderr);
            return;
        }

        done(error, parts[1].trim(), stderr);
    });
};

var getLinuxSSID = function getLinuxSSID(done) {
    var cmd = "nm-tool | grep \* | grep : | cut -d \":\" -f1 | cut -d \"*\" -f2 ";

    exec(cmd, done);
};

module.exports = function detect(cbk) {
    var done = function(error, stdout, stderr) {
        cbk(error, stdout.trim(), stderr.trim());
    }

    switch (os.platform()) {
        case "darwin":
            return getOsxSSID(done);
        case "win32":
            return getWinSSID(done);
        case "linux":
            return getLinuxSSID(done);
        default:
            done('platform not supported : ' + os.platform());
    }
};
