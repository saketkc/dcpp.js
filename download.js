var serverURL, ws, nick;

Downloader = function(result) {
  
  this.url = null;
  this.path = result[2];
  this.size = result[3];
  this.nick = result[1];
  
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
        obj.createDownload(data);
        break;
    }
  }, false);
  
  var data = {  path:this.path, 
                size:this.size,
                nick:nick,
                response: resp, 
                url: serverURL
             };
  
  downloader.postMessage(data);
}

Downloader.prototype.saveToFile = function() {
  var path = this.path.split('\\');
  filename = path[path.length-1];
  $('#download').attr('download', filename);
  $('#download').attr('href', this.url);
}

Downloader.prototype.createDownload = function(contents) {
  $("#progress-bar").hide();
  $("#download").show();
  var typed = new Uint8Array(contents);
  var blob = new Blob([typed], {type: 'audio/mp3'});
  this.url = webkitURL.createObjectURL(blob);
}

Downloader.prototype.initMedia = function() {
  $('#mp3').attr('src', url);
}
  
Downloader.prototype.drawProgress = function(status) {
  $("#progress-bar").progressbar({value: status});
}
