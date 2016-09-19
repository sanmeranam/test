if (window.FC) {
    window.Device = {
        queue: {},
        callback: function (sId,data) {
            alert(sId+","+data)
            if(window.Device.queue[sId]){
                window.Device.queue[sId](data);
            }
        },
        capturePhoto: function (callback) {
            var uNum=Math.round(Math.random() * 99999);
            this.queue[uNum] = callback;
            FC.capturePhoto(uNum,'Device.callback');
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