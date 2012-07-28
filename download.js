var serverURL, ws, nick;
var all_results_array, index;

function getClient() {
  console.log
  ws.send_string('$RevConnectToMe '+nick+' '+all_results_array[index][0]['nick']+'|');
  console.log('Client Request sent');
}

function connectClient(response) {
  
  var ip_port =  response.split(' ')[2].split('|')[0];
  var client = new Websock();
  var uri = serverURL + '?token='+ip_port;
  
  var sentGet = false;
  var sentSend = false;
  var contents = [];
  var progress = 0;
  
  console.log("connecting to: " + uri);
  client.open(uri);
  client.on('open', function () {
    console.log("client Connected");
    client.send_string('$MyNick '+nick+'|$Lock EXTENDEDPROTOCOLABCABCABCABCABCABC Pk=DCPLUSPLUS0.673|');
    client.send_string('$Get '+all_results_array[index][0]['path']+'|');
    sentGet = true;
  });
  client.on('message', function () {
    var len = client.rQlen();
    var data = client.rQshiftBytes();
    console.log(data);
    if(sentGet) {
      sentGet = false;
      client.send_string('$Send|');
      sentSend = true;
    }
    else if(sentSend) {
      contents = contents.concat(data);
      progress += len;
      console.log(progress);
      if(progress === all_results_array[index][0]['size']) {
        
        var blob = createBlob(contents);
        var url = webkitURL.createObjectURL(blob);
        initMedia(url);
        client.close();
      }
    }
  });
}

function createBlob(contents) {
  var typed = new Uint8Array(contents);
  var blob = new Blob([typed], {type: 'audio/mp3'});
  return blob;
}

function initMedia(url) {
  $('#mp3').attr('src', url);
}
  
function saveToFile(url) {
  var path = all_results_array[index][0]['path'];
  path = path.split('\\');
  filename = path[path.length-1];
  $('#download').attr('download', filename);
  $('#download').attr('href', url);
}
