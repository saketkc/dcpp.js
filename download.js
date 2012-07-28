var serverURL, ws, nick;
var results, index;
var contents, progress;

function getClient() {
  ws.send_string('$RevConnectToMe '+nick+' '+results[index][0]+'|');
}

function connectClient(response) {
  
  var ip_port =  a.split(' ')[2];
  var client = new Websock();
  var uri = serverURL + '?token='+ip_port;
  
  var sentGet = false;
  var sentSend = false;
  contents = [];
  progress = 0;
  
  console.log("connecting to: " + uri);
  client.open(uri);
  client.on('open', function () {
      console.log("client Connected");
      client.send_string('$MyNick '+nick+'|$Lock EXTENDEDPROTOCOLABCABCABCABCABCABC Pk=DCPLUSPLUS0.673|');
      client.send_string('$Get ');//+results[index][1]+'|');
      sentGet = true;
  });
  client.on('message', function () {
    var len = client.rQlen();
    var data = client.rQshiftBytes();
    if(sentGet) {
      sentGet = false;
      client.send_string('$Send|');
      sentSend = true;
    }
    else if(sentSend) {
      contents = contents.concat(data);
      progress += len;
      console.log(progress);
      if(progress === results[index][2])
        initMedia();
    }
  });
}

function initMedia() {
  var typed = new Uint8Array(contents);
  /*var blob = new Blob([typed], {type: 'video/avi'});
  var video = document.getElementById('stream');
  video.src = webkitURL.createObjectURL(blob);*/
  var blob = new Blob([typed], {type: 'audio/mp3'});
  var video = document.getElementById('mp3');
  video.src = webkitURL.createObjectURL(blob);
}
  
