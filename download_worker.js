importScripts('include/websock.js', 'include/base64.js', 'include/util.js');

function hex2a(hex) {
    var str = '';
    for (var i = 0; i < hex.length; i += 2)
        str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    return str;
}

function connectClient(data) {
  var ip_port =  data['response'].split(' ')[2].split('|')[0];
  var client = new Websock();
  var uri = data['url'] + '?token=' + ip_port;
  
  var sent;
  var progress = 0;
  
  self.postMessage("connecting to: " + uri);
  
  client.on('open', function () {
    self.postMessage("client Connected");
    client.send_string('$MyNick '+data['nick']+'|$Lock EXTENDEDPROTOCOLABCABCABCABCABCABC Pk=DCPLUSPLUS0.673|');
    self.postMessage('Sent Nick');
    sent = 'nick';
  });
  
  client.on('message', function () {
    var len = client.rQlen();
    var bytes = client.rQshiftBytes();
    
    switch(sent) {
      case 'nick':
        var key = self.hex2a('14D1C011B0A010104120D1B1B1C0C030D03010203010203010203010203010203010');
        client.send_string('$Supports |$Direction Download 30000|$Key '+key+'|');
        client.send_string('$Get ' + data['path'] + '$1|');
        self.postMessage('Sent Key & Get');
        sent = 'get';
        break;
      case 'get':
        client.send_string('$Send|');
        self.postMessage('Sent Send');
        sent = 'send';
        break;
      case 'send':
        self.writeToFile(bytes);
        progress += len;
        self.postMessage(progress / data['size']);
        if(progress === data['size']) {
          client.close();
          self.postMessage({url: self.fileEntry.toURL()});
        }
        break;
    }
  });
  
  client.open(uri);
  
}

function writeToFile(data) {
  var typed = new Uint8Array(data);
  var blob = new Blob([typed]);
  self.fileWriter.write(blob);
}

self.addEventListener('message', function(e) {
  var data = e.data;
  
  var fs = webkitRequestFileSystemSync(TEMPORARY, data['size'] + 1);
  self.fileEntry = fs.root.getFile(data['filepath'] , {create: true});
  self.fileWriter = fileEntry.createWriter();
  
  self.connectClient(data);
}, false);

