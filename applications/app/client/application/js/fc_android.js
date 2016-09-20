var fnGetNum = function () {
    return Math.round(Math.random() * 999);
};
if (window.FC) {
    window.Device = {
        queue: {},
        callback: function (sId, data) {
            if (window.Device.queue[sId]) {
                window.Device.queue[sId](data);
            }
        },
        capturePhoto: function (callback) {
            var uNum = fnGetNum();
            this.queue[uNum] = callback;
            FC.capturePhoto(uNum, 'window.Device.callback');
        },
        captureVideo: function (durations, callback) {
            var uNum = fnGetNum();
            this.queue[uNum] = callback;
            FC.captureVideo(uNum, durations, 'window.Device.callback');
        },
        captureAudio: function (durations, callback) {
            var uNum = fnGetNum();
            this.queue[uNum] = callback;
            FC.captureAudio(uNum, durations, 'window.Device.callback');
        },
        captureFile: function (callback) {
            var uNum = fnGetNum();
            this.queue[uNum] = callback;
            FC.scanFile(uNum, 'window.Device.callback');
        },
        captureSign: function (callback) {
            var uNum = fnGetNum();
            this.queue[uNum] = callback;
            FC.captureSign(uNum, 'window.Device.callback');
        },
        scanBarcode: function (callback) {
            var uNum = fnGetNum();
            this.queue[uNum] = callback;
            FC.scanBarcode(uNum, 'window.Device.callback');
        },
        getGeoLocation: function (callback) {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function(position){
                    callback(position.coords.latitude,position.coords.longitude);
                });
            }
        },
        openMap: function (lat, lng) {
            FC.openMap(lat, lng)
        },
        openFile: function (file, type) {
            switch (type) {
                case "A":
                    FC.playAudio(file);
                    break;
                case "I":
                    FC.showImage(file);
                    break;
                case "V":
                    FC.playVideo(file);
                    break;
                case "P":
                    FC.openPdf(file);
                    break;
            }
        }
    };
}
//FC.showToast(String toast)
//FC.getLocation(int reqId,String callback)
//FC.getCompass(int reqId,String callback)
//FC.capturePhoto(int reqId,String callback)
//FC.captureVideo(int reqId,int duration,String callback)
//FC.captureSign(int reqId,String callback)
//FC.scanFile(int reqId,String callback)
//FC.scanBarcode(int reqId,String callback)
//FC.captureAudio(int reqId,int duration,String callback)
//FC.submitData(String data,String callback) 
//FC.readyDataToSend(boolean isEnable)
//FC.playAudio(String path,String callback)
//FC.playVideo(String path)
//FC.showImage(String path)
//FC.openMap(String lat,String lng)