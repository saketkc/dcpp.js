importScripts('include/websock.js', 'include/base64.js', 'include/util.js');

function hex2a(hex) {
    var str = '';
    for (var i = 0; i < hex.length; i += 2)
        str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    return str;
}

function connectClient() {
  
  var ip_port =  self.response.split(' ')[2].split('|')[0];
  var client = new Websock();
  var uri = self.url + '?token=' + ip_port;
  
  var sent;
  var contents = [];
  var progress = 0;
  
  self.postMessage("connecting to: " + uri);
  
  client.on('open', function () {
    self.postMessage("client Connected");
    client.send_string('$MyNick '+self.nick+'|'+'|$Lock EXTENDEDPROTOCOLABCABCABCABCABCABC Pk=DCPLUSPLUS0.673|');
    sent = 'nick';
  });
  
  client.on('message', function () {
    var len = client.rQlen();
    var data = client.rQshiftBytes();
    
    switch(sent) {
      case 'nick':
        var key = hex2a('14D1C011B0A010104120D1B1B1C0C030D03010203010203010203010203010203010');
        client.send_string('$Supports |$Direction Download 30000|$Key '+key+'|');
        client.send_string('$Get ' + self.path + '$1|');
        self.postMessage('Sent Key & Get');
        sent = 'get';
        break;
      case 'get':
        client.send_string('$Send|');
        self.postMessage('Sent Send');
        sent = 'send';
        break;
      case 'send':
        //contents.push.apply(contents, data);
        contents = contents.concat(data);
        progress += len;
        self.postMessage(progress / self.size);
        if(progress === self.size) {
          client.close();
          self.postMessage(contents);
        }
        break;
    }
  });
  
  client.open(uri);
  
}

self.addEventListener('message', function(e) {
  var data = e.data;
  self.nick = data['nick'];
  self.size = data['size'];
  self.path = data['path'];
  self.url = data['url'];
  self.response = data['response'];
  
  connectClient();
}, false);

