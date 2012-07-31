var serverURL, ws, nick;

Downloader = function(result) {
  
  this.path = result[2];
  this.size = result[3];
  this.nick = result[1];
  var tmp = this.path.split('\\');
  this.filepath = tmp[tmp.length-1];
  
  ws.send_string('$RevConnectToMe ' + nick + ' ' + this.nick + '|');
  console.log('Client Request sent');
}
  
Downloader.prototype.createDownloader = function(resp) {
  var downloader = new Worker('download_worker.js');
  var obj = this;
  downloader.addEventListener('message', function(e) {
    var data = e.data;
    switch(typeof(data)) {
      case 'string':
        console.log(data);
        break;
      case 'number':
        obj.drawProgress(data);
        break;
      default:
        obj.createDownload(data['url']);
        break;
    }
  }, false);
  
  var data = {  path:this.path, 
                size:this.size,
                nick:nick,
                response: resp, 
                url: serverURL,
                filepath:this.filepath
             };
  
  downloader.postMessage(data);
}

Downloader.prototype.createDownload = function(url) {
  $("#progress-bar").hide();
  $("#download").show();
  $('#download').attr('href', url);
}

Downloader.prototype.initMedia = function() {
  $('#mp3').attr('src', url);
}
  
Downloader.prototype.drawProgress = function(status) {
  $("#progress-bar").progressbar('value', status*100);
}
