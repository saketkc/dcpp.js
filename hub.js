var serverURL = "ws://localhost:8080";
		var ws = new Websock();
		var nick = $("#nick").val();	
		var hubConnected = false;
		var all_results_array = [];
		var oTable;
		var giRedraw = false;
		var isHelloCalled = false;

        function connect() {
			$("#loading").show();
			nick = $("#nick").val();
			var port = $("#port").val();
			var hub = $("#hubaddress").val();
			var uri = serverURL+"?token="+hub+":"+port;
			console.log(uri);
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
                //Check for $hello in reponse
				// if response has hello then execute the following stateme
				var responseContainsHello = response.indexOf("$Hello");
				
				
				var responseContainsConnect = response.indexOf("$ConnectToMe");
				var responseContainsSearchResults = response.indexOf("$SR");
				
				
				if (responseContainsHello >= 0 && !isHelloCalled){ 
					  console.log('Hello');
					  isHelloCalled = true;
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
          console.log('ConnectToMe');
          
					response_with_response = response.slice(responseContainsConnect);
          console.log(response_with_response);
					first_occurence_of_pipe = response_with_response.search('\\|');
					responseData = response_with_response.slice(0,first_occurence_of_pipe);				
          console.log(responseData);
					connectClient(responseData);
				}
				
				else if (responseContainsSearchResults>=0){
					split_response = response.split('$SR');
					for(i in split_response){
            if(split_response.hasOwnProperty(i)) {
              var len = split_response[i].length;
              if(len === 0)
                continue;
              console.log(split_response[i]);
              var data = split_response[i].split(' ');
              var hub = data.pop();
              var tth = data.pop();
              var nickname = data[1];
              var filepath_with_size = data.slice(2).join(" ");
              var split_file_name = filepath_with_size.split("\x05");
              var actual_file_name = split_file_name[0];
              var filesize = split_file_name[1];
              if (nickname!="" && filesize!="" && actual_file_name!="")
                all_results_array.push(
                  {
                    id:String(i),
                    nick:nickname,
                    path:actual_file_name,
                    size:filesize
                  });
            }
          }
		jQuery("#datatables").jqGrid({
      datatype: "local",
      height: 250,
      autowidth:true,
      records: "records",

      colNames:['Nick','Path', 'Size'],
      colModel:[
        {name:'nick',index:'nick', width:10, align:"center",sorttype:"string"},		
        {name:'path',index:'path', width:190,align:"center",sorttype:"string"},		
        {name:'size',index:'size', width:10,sorttype:"int"}		
      ],
   
      sortname: 'size',
      viewrecords: true,
      sortorder: "desc",
      onSelectRow: function(id){ 
      
      //var content = $('getCell', id , 'nick');
        alert(id);
        index = parseInt(id)-1;
        getClient();
     },
   	
   	caption: "All Results"
  });
  jQuery("#datatables").jqGrid('navGrid','#ptoolbar',{del:false,add:false,edit:false,search:false});
  jQuery("#datatables").jqGrid('filterToolbar',{stringResult: true,searchOnEnter : false});

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
