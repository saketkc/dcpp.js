var serverURL, ws, nick;
var all_results_array, index;
var url;

function getClient() {
  console.log
  ws.send_string('$RevConnectToMe '+nick+' '+all_results_array[index][1]+'|');
  console.log('Client Request sent');
}

function hex2a(hex) {
    var str = '';
    for (var i = 0; i < hex.length; i += 2)
        str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    return str;
}

function connectClient(response) {
  
  var ip_port =  response.split(' ')[2].split('|')[0];
  client = new Websock();
  var uri = serverURL + '?token='+ip_port;
  
  var sentNick = false;
  var sentGet = false;
  var sentSend = false;
  var sentKey = false;
  var contents = [];
  var progress = 0;
  
  console.log("connecting to: " + uri);
  client.open(uri);
  client.on('open', function () {
    console.log("client Connected");
    client.send_string('$MyNick '+nick+'|'+'|$Lock EXTENDEDPROTOCOLABCABCABCABCABCABC Pk=DCPLUSPLUS0.673|');
    sentNick = true;
  });
  client.on('message', function () {
    var len = client.rQlen();
    var data = client.rQshiftBytes();
    
    if(sentNick) {
      sentNick = false;
      var key = '14D1C011B0A010104120D1B1B1C0C030D03010203010203010203010203010203010';
      key = hex2a(key);
      client.send_string('$Supports |$Direction Download 30000|$Key '+key+'|');
      client.send_string('$Get '+all_results_array[index][2]+'$1|');
      console.log('Sent Key & Get');
      sentGet = true;
    }
    else if(sentGet) {
      sentGet = false;
      client.send_string('$Send|');
      console.log('Sent Send');
      sentSend = true;
    }
    else if(sentSend) {
      contents.push.apply(contents, data);
      progress += len;
      drawProgress(progress, all_results_array[index][3]);
      if(progress === all_results_array[index][3]) {
		console.log("Complete");
        $("#progress-bar").hide();
        $("#download").show();
        var blob = createBlob(contents);
        url = webkitURL.createObjectURL(blob);
        //initMedia(url);
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
  
function saveToFile() {
  var path = all_results_array[index][2];
  path = path.split('\\');
  filename = path[path.length-1];
  $('#download').attr('download', filename);
  $('#download').attr('href', url);
}

function drawProgress(status, total) {
	
  //$("#progress-bar").show();
  var value = status/total*100;
  $("#progress-bar").progressbar({value: value});
  
}
