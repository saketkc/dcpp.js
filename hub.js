var serverURL = "ws://localhost:8080";
		var ws = new Websock();
		var nick = $("#nick").val();	
		var hubConnected = false;
		var all_results_array = [[{nick:"",path:"",size:""}]];
		var oTable;
		var giRedraw = false;
		var isHelloCalled = false;


		//1 - Establishin connection, expecting a $ Hello
		//2  - Connection establised, send MYINFo and wait for IgnoreMessagge
		

		// Coded by Mardeg
function nibbleswap(bits) {
	return ((bits << 4) & 240) | ((bits >>> 4) & 15);
}
function chr(b) {
	return (("..0.5.36.96.124.126.").indexOf("."+b+".")>0)?"/%DCN"+(0).toPrecision(4-b.toString().length).substr(2)+b+"%/":String.fromCharCode(b);
}
function lock2key(lock) {
	var key = chr(nibbleswap(lock.charCodeAt(0) ^ lock.charCodeAt(-1) ^ lock.charCodeAt(-2) ^ 5));
	for (var i=1; i<lock.length; i++) {
		key += chr(nibbleswap(lock.charCodeAt(i) ^ lock.charCodeAt(i - 1)));
	}
	return key;
}



        function connect() {
			$("#loading").show();
			nick = $("#nick").val();
			var port = $("#port").val();
			var hub = $("#hubaddress").val();
			var uri = serverURL+"?token="+hub+":"+port;
			console.log(serverURL+"?token="+hub+port);
            ws.open(uri);
            ws.on('open', function () {
				console.log("connected");
				$("#loading").hide();
				send_string = "$ValidateNick "+nick+"|";
				console.log(send_string);
				ws.send_string(send_string);
				

            });
            ws.on('message', function () {
                //msg("Received: " + ws.rQshiftStr());
                var response = ws.rQshiftStr();
                console.log(response);
                //Check for $hello in reponse
				// if response has hello then execute the following stateme
				var responseContainsHello = response.indexOf("$Hello");
				
				
				var responseContainsConnect = response.indexOf("$ConnectToMe");
				var responseContainsSearchResults = response.indexOf("$SR");
				
				
				if (responseContainsHello>=0 && isHelloCalled==false){ 
					  console.log('Hello');
					  ishelloCalled=true;
						ws.send_string("$MyINFO $ALL "+nick+" <++ V:0.673,M:P,H:1/0/0,S:2>$ $0.1.$$10240$|");
						hubConnected = true;
						$("#connect-menu").slideUp();
					$("#search-menu").show().slideDown();
					}
				else if(hubConnected) {
					//Show search 
					hubConnected = false;
					$("#connect-menu").slideUp();
					$("#search-menu").show().slideDown();				
				}
				else if(responseContainsConnect>=0){
					response_with_response = response.slice(responseContainsConnect);
					first_occurence_of_pipe = response_with_response.search("|");
					responseData = response_with_response.slice(0,first_occurence_of_pipe);				
					
				}
				
				else if (responseContainsSearchResults>=0){
					
					split_response = response.split("$SR");
					for(i=0;i<split_response.length;i++){
						var data = split_response[i].split(" ");
						var split_length =  data.length;
						var hub = data.pop();
						var tth = data.pop();
						var nickname = data[1];
						data[1]="";
						var filepath_with_size = data.join(" ");
						var split_file_name = filepath_with_size.split(".");
						var filesize_with_ext = split_file_name.pop(); 
						var filename_without_ext = split_file_name.join("");
						var filesize = filesize_with_ext.replace( /^\D+/g, '');
						var extension = filesize_with_ext.replace( /\d+$/, '');
						var actual_file_name = filename_without_ext +"."+extension
						//while filesize
						if (nickname!="" && filesize!="" && actual_file_name!="")
						{all_results_array.push([{nick:nickname,path:actual_file_name,size:filesize}]);}	
						
						
						
					}
					//console.log(all_results_array);
					
		jQuery("#datatables").jqGrid({
	datatype: "local",
	height: 250,
	autowidth:true,
	


   	colNames:['Nick','Path', 'Size'],
   	colModel:[
   		{name:'nick',index:'nick', width:100, align:"right",sorttype:"string"},		
   		{name:'path',index:'path', width:80,align:"right",sorttype:"string"},		
   		{name:'size',index:'size', width:150,sorttype:"string"}		
   	],
   	onSelectRow: function(id){ 
      
      var content = $('getCell', id , 'nick');
      alert(id);
   },
   	
   	caption: "All Results"
});
for(var i=0;i<=all_results_array.length;i++){
	jQuery("#datatables").jqGrid('addRowData',i+1,all_results_array[i]);
}

					
					
				}
            });
            

        }

        function disconnect() {
            if (ws) { ws.close(); }
            ws = null;
        }
        function fnGetSelected( oTableLocal )
{
    return oTableLocal.$('tr.row_selected');
}
		
		$(document).ready(function($){
			$("#search-menu").hide();
			$("#loading").hide();
			
			
			
		


			
		}
		);
		
		function searchDC(){
			var searchTerm = $("#search-query").val();
			ws.send_string("$Search Hub:"+nick+" F?F?0?1?"+searchTerm+"|");
		}