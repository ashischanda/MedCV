// ************** declaring file names in globaly
var cosine_file = "code_vector_with_info.csv";
var vectorSize = 100;    // column size of each row
var pmiVectorSize = 100; // 50 codes, 50 values, format is: code, codevalue, 
var DATA_cosine = "";
var first_query_code = "";

var cosine_code = "";
var cosine_codevector = "";
var cosine_codeDescription = "";
var code_freq = "";
var pmi_code_vector ="";  // format is: code, codevalue, code, codevalue, ...

var cosine_row_num = 0;

var legend_circle_code_text = [];

var legend_code_text = [];
var myColor =["#66c2a5","#fc8d62","#8da0cb","#a6d854","#e5c494","#e78ac3","#b3b3b3"];

function vecDotProduct(vecA, vecB) {
	var product = 0;
	for (var i = 0; i < vecA.length; i++) {
		product += vecA[i] * vecB[i];
	}
	return product;
}

function vecMagnitude(vec) {
	var sum = 0;
	for (var i = 0; i < vec.length; i++) {
		sum += vec[i] * vec[i];
	}
	return Math.sqrt(sum);
}

function cosineSimilarity(vecA, vecB) {
	return vecDotProduct(vecA, vecB) / (vecMagnitude(vecA) * vecMagnitude(vecB));
}

function make_vector_norm(cosine_codevector) {
	for( var j=0; j< cosine_codevector.length; j++){
	    var vecA = cosine_codevector[j];
		
		var getVecNormValue = vecMagnitude(vecA) ;
		for (var i = 0; i < vecA.length; i++) {
			vecA[i] = vecA[i]/ getVecNormValue;
		}
		cosine_codevector[j] = vecA;
	}		
	return cosine_codevector;
}
		
$(document).ready(function() {
   "use strict";
    $.ajax({
        type: "GET",
        url: cosine_file,
        dataType: "text",
        success: function(data) {
			processData(  $.csv.toArrays(data) );

		}
    }
	
	);
});

function preprocessDescription(string) {
	txt = string.replace("b'", "");
	txt = txt.replace("'", "");
	return txt;
}

function processData(file_data) {
    
	DATA_cosine= file_data;
	
	cosine_row_num  = DATA_cosine.length;
	
	cosine_code = new Array(cosine_row_num);
	cosine_codevector = new Array(cosine_row_num);
	cosine_codeDescription = new Array (cosine_row_num);
	cosine_icd_code = new Array (cosine_row_num);
	code_freq = new Array (cosine_row_num);
	code_freq_sec = new Array (cosine_row_num);
	pmi_code_vector = new Array(cosine_row_num);

	for (var i = 0; i < cosine_row_num ; i++) {
	  cosine_codevector[i] = new Array(vectorSize);
	  pmi_code_vector[ i ] = new Array(pmiVectorSize);	
	}
		
	// *************************** inserting data into variables
	for (var j = 0; j < cosine_row_num ; j++) {
		var lineValue = DATA_cosine[j];
		var last_index_of_row = lineValue.length - 1;
		
		
		cosine_code[j] = lineValue[0];
		cosine_icd_code[j] = lineValue[1];
		code_freq[j] = lineValue[ vectorSize+3 ];
		code_freq_sec[j] = lineValue[ vectorSize+ 4 ];
		
		
		
		cosine_codeDescription[j] = lineValue [ vectorSize+ 2 ].replace("//", "");
		cosine_codeDescription[j] = preprocessDescription( cosine_codeDescription[j] );
		
		for (var i = 0 ; i < vectorSize ; i++) {
		  cosine_codevector[j][i] = lineValue[ i+ 2 ] ;    // << First two columns is used for code and icdcode
		}
		
		var ind = 0;
		for (var i =  vectorSize+5  ; i<last_index_of_row; i++){
		  pmi_code_vector[ j ][ ind ] = lineValue[ i ];
		  ind=ind+1;
		}			
	}
	
	cosine_codevector = make_vector_norm(cosine_codevector);
	
	document.getElementById('data_loading_message').innerHTML = "";
	// ****************************************************	
}
function isLetter(str) {
  return str.toLowerCase() != str.toUpperCase();
}

var db_value = "a";

function getClaimIDsForAcode_from_DB(str) {
	var request = new XMLHttpRequest();
	request.open('GET',  "php/get_claim_for_a_code.php?q="+str, false);  // `false` makes the request synchronous
	request.send(null);

		if (request.status === 200) {
			db_value = request.responseText;
			//console.log(request.responseText);
		}

}


function getPatientIDsForAcode_from_DB(str) {
	var request = new XMLHttpRequest();
	request.open('GET',  "php/get_patient_for_a_code.php?q="+str, false);  // `false` makes the request synchronous
	request.send(null);

		if (request.status === 200) {
			db_value = request.responseText;
			//console.log(request.responseText);
		}

}
// ************************************************************************************
// ************************************************************************************
function loadCosineSimilarityData(){
	
	var givenCode = document.getElementById("codevalue").value;
	var n = givenCode.indexOf("-");          // Deleting code description from Textfield
	if (n>0)
		givenCode = givenCode.slice(0, n);
	
		
	
	var index = -1;
			
	// *************************** inserting data into variables
	for (var j = 0; j < cosine_row_num ; j++) {
			if ( cosine_code[j] == givenCode){
				index = j;		
				break;
			}		
	}
	// ****************************************************
	if( index ==-1){
		alert("Sorry, the given code is not in our dataset. Please, try again");
		return;
	}
		
		
	var getPMIcodes = pmi_code_vector[ index ] ;
	var pmicodeDict = new Object();                // taking a dictionary
	for (var ii = 0; ii< getPMIcodes.length; ii+= 2 ){
		pmicodeDict[ getPMIcodes[ii] ] = getPMIcodes[ii+1 ] ;
	}
	//console.log( "checking pmi");
	//console.log( pmicodeDict);
	
	var cosineSimilarityList = [];	
	// **************************  Calculating cosineSimilarity
	for (var j= 0; j<cosine_row_num; j++){	
		 cosineSimilarityList.push({
			Column1: cosine_code[j],
			Column2: vecDotProduct(cosine_codevector[j], cosine_codevector[index]),
			Column3: cosine_codeDescription[j], 
			Column4: cosine_icd_code[j].substring(2),  //			// two character in suffix, i.e. "p_"
			Column5: j,
			Column6: code_freq[j],
			Column7: code_freq_sec[j]
		});	
	}
	// ***************************  Sorting values
	var sort_by = function(field, reverse, primer){
	   var key = primer ? 
		   function(x) {return primer(x[field])} : 
		   function(x) {return x[field]};

	   reverse = !reverse ? 1 : -1;

	   return function (a, b) {
		   return a = key(a), b = key(b), reverse * ((a > b) - (b > a));
		 } 
	}
	// Sort by high to low
	cosineSimilarityList.sort(sort_by('Column2', true, parseFloat));
		
	var opt = {}
	opt.epsilon = 10; 		// epsilon is learning rate (10 = default)
	opt.perplexity = 5;	    // roughly how many neighbors each point influences (30 = default)
	opt.dim = 2;			// dimensionality of the embedding (2 = default)

	var tsne = new tsnejs.tSNE(opt); // create a tSNE instance

	var vectors  = [ ];
	var codeName = [];
	var fullcodeName = [];
	var cosine_value = [];
	var description = [];
	var code_freq_top_neighbor = [];
	var sec_code_freq_neih = [];
	
	
	// *************************************
	// getting selected radio button value
	var codetype = "";
	var ele = document.getElementsByName('codetype'); 
			
	for(i = 0; i < ele.length; i++) { 
		if(ele[i].checked) 
		 codetype = ele[i].value; 
	}						
	console.log("code type: "+ codetype);
	// *************************************
	
	for (var j=0 ; j< cosine_row_num ; j++){ // Ignoring first. Because, given code vs given code Cosine Similarity is high
		var simimilarCode = cosineSimilarityList[j].Column1;
        var codeToShow = document.getElementById("listItems").value;
		if (codeToShow <1){
			alert("The number of nearest neighbor code is empty");
			
		}
		if (vectors.length == codeToShow)
			break;
		
		// checking 2nd type of cpt code that letter in description
		if (isLetter( simimilarCode.substring(2) )){
			//console.log("cpt code level II: "+ simimilarCode );
			continue;
		}
		
		if(simimilarCode.startsWith( codetype ) ){
			vectors.push( cosine_codevector[ cosineSimilarityList[j].Column5 ] );
			codeName.push( simimilarCode.substring(2) );	// cutting first two digits, i.e. "d_"
			fullcodeName.push( simimilarCode );
			cosine_value.push( cosineSimilarityList[j].Column2 );	
			description.push( cosineSimilarityList[j].Column3 );	
			code_freq_top_neighbor.push( cosineSimilarityList[j].Column6 );
			sec_code_freq_neih.push( cosineSimilarityList[j].Column7)
		}
	}
    
	tsne.initDataDist(vectors);
	for(var k = 0; k < 2000; k++) {
	  tsne.step(); // every time you call this, solution gets better
	}
	var Y = tsne.getSolution(); // Y is an array of 2-D points that you can plot
	var myDataNEW = [];
	
		

	
	
		
		
		
		
	var selected_code_claimID = [];
	var code_claimID = [];
	var common_claimID = [];
	
	for (var j=0 ; j< codeToShow ; j++){ 
		
		
		var kk = "other";
		if ( codetype =="h"){
			
			if ( codeName[j].substring(0, 3) =="191" ){
				kk = "breast surgery";
			}
			else if ( codeName[j].substring(0, 3) =="192" ){
				kk = "excision surgery";
			}
			else if ( codeName[j].substring(0, 3) =="193" ){
				kk = "mastectomy";
			}
			else if ( codeName[j].substring(0, 3) =="365" ){
				kk = "collection of blood";
			}
			else if ( codeName[j].substring(0, 3) =="770" ){
				kk = "needle placement";
			}
			
			
			else if ( codeName[j].substring(0, 3) =="850" ){
				kk = "blood count";
			}
			else if ( codeName[j].substring(0, 3) =="907" ){
				kk = "infusion therapy";
			}
			else if ( codeName[j].substring(0, 3) =="963" ){
				kk = "therapeutic";
			}
			else if ( codeName[j].substring(0, 3) =="964" ){
				kk = "chemotherapy administration";
			}
			else if ( codeName[j].substring(0, 3) =="965" ){
				kk = "chemotherapy or refill";
			}
			else if ( codeName[j].substring(0, 3) =="992" ){
				kk = "office visit";
			}
		}
		else if ( codetype =="d"){
			if ( codeName[j].substring(0, 1) !="0" && codeName[j].substring(0, 1) !="1" && codeName[j].substring(0, 1) !="2" && codeName[j].substring(0, 1) !="3"&& codeName[j].substring(0, 1) !="4"&& codeName[j].substring(0, 1) !="5"&& codeName[j].substring(0, 1) !="6"&& codeName[j].substring(0, 1) !="7"&& codeName[j].substring(0, 1) !="8"&& codeName[j].substring(0, 1) !="9")
			{
				kk= "other";
			}
			else{
				
				vv = parseInt( codeName[j] ) ;
				//console.log("after "+ vv);

				if( vv>10000)
					vv = vv/100;	// Making 5 digit codes to 3 digit
				else 
					vv = vv/10;// Making 4 digit codes to 3 digit
				
				//console.log("before "+ vv);
				if (vv<1){
					kk = 'Other';
				}
				else if( vv>=1 && vv <=139 )
				{
					kk= 'Infectious and parasitic diseases';
				}
				else if( vv>139 && vv <=239 )
				{	
					kk= 'Neoplasms';
				}
				else if( vv>239 && vv <=279 )
				{	
					kk= 'Immunity disorders';
				}
				else if( vv>279 && vv <=289 )
				{	kk= 'Blood diseases';
				}
				else if( vv>289 && vv <=319 )
				{	kk= 'Mental disorders';
				}
				else if( vv>319 && vv <=359 )
				{	kk= 'Nervous system';
				}
				else if( vv>359 && vv <=389 )
				{	kk= 'Sense organs';
				}
				else if( vv>389 && vv <=459 )
				{	kk= 'Circulatory system';
				}
				else if( vv>459 && vv <=519 )
				{	kk= 'Respiratory system';
				}
				else if( vv>519 && vv <=579 )
				{	kk= 'Digestive system';
				}
				else if( vv>579 && vv <=629 )
				{	kk= 'Genitourinary system';
				}
				else if( vv>629 && vv <=679 )
				{	kk= 'Pregnancy, childbirth';
				}
				else if( vv>679 && vv <=709 )
				{	kk= 'Skin diseases';
				}
				else if( vv>709 && vv <=739 )
				{	kk= 'Connective tissue';
				}
				else if( vv>739 && vv <=759 )
				{	kk= 'Congenital anomalies';
				}
				else if( vv>759 && vv <=779 )
				{	kk= 'Perinatal period cond.';
				}
				else if( vv>779 && vv <=799 )
				{	kk= 'Symptoms & signs';
				}
				else if( vv>799 && vv <=999 )
				{	kk= 'Injury and poisoning';
				}
				else
				{	kk= "other";
				}
				
			}
			
			
			
			
		}
		else{
			if ( codeName[j].substring(0, 2) =="19" ){
				kk = "Reconstructive operations on ear";
			}
			else if ( codeName[j].substring(0, 2) =="38" ){
				kk = "Incision, excision of vessels";
			}
			else if ( codeName[j].substring(0, 2) =="39" ){
				kk = "Other operations on vessels";
			}
			else if ( codeName[j].substring(0, 2) =="40" ){
				kk = "Operations on lymphatic system";
			}
			else if ( codeName[j].substring(0, 2) =="83" ){
				kk = "Operations on muscle tendon fascia";
			}
			else if ( codeName[j].substring(0, 2) =="85" ){
				kk = "Operations on the breast";
			}
			else if ( codeName[j].substring(0, 2) =="86" ){
				kk = "Operations on skin tissue";
			}
			else if ( codeName[j].substring(0, 2) =="87" ){
				kk = "Diagnostic Radiology";
			}
			else if ( codeName[j].substring(0, 2) =="88" ){
				kk = "Other diagnostic radiology tech";
			}
			else if ( codeName[j].substring(0, 2) =="90" ){
				kk = "Microscopic examination-I";
			}
			else if ( codeName[j].substring(0, 2) =="91" ){
				kk = "Microscopic examination-II";
			}
			else if ( codeName[j].substring(0, 1) =="91" ){
				kk = "Nuclear medicine";
			}
		}		
		
		
		
		//console.log(fullcodeName[j] +" before call: "+ db_value );
		getPatientIDsForAcode_from_DB( fullcodeName[j] );  // The result is in db_value
		db_value = db_value.split("=");
		
		var get_frequency_pid = db_value[0];
		var get_patientID_str = db_value[1];		
		var get_patientID = get_patientID_str.split(";");

			
		//console.log(fullcodeName[j] +" before call: "+ db_value );
		getClaimIDsForAcode_from_DB( fullcodeName[j] );  // The result is in db_value
		db_value = db_value.split("=");
		
		var get_frequency_cid = db_value[0];
		var get_claimID_str = db_value[1];		
		var get_claimID = get_claimID_str.split(";");		
		//console.log("after call: "+ get_claimID );	
		var common_claim_num = 0;
		
		
		// getting sec_code_freq_From_neighbor_List
		if (j ==0 ) { // the first one is selected code
			
			selected_code_claimID=get_claimID;
			common_claim_num = get_frequency_cid;
			code_claimID = selected_code_claimID;
			common_claimID =selected_code_claimID;
		}else{
			var tem_code_claimID = get_claimID;
			
			// using set operations from 
			var so = setOps;
			common_claimID = so.intersection( selected_code_claimID, tem_code_claimID); // => [3]
			common_claim_num = common_claimID.length;
			code_claimID = tem_code_claimID;  // taking 

			// Calculating ratio
			common_claim_num = Math.ceil( (common_claim_num * get_frequency_cid) / code_claimID.length );  // converting float number to integer
		}
		
		console.log( " common_claim_num " + common_claim_num);
		//console.log( " get_patientID.length " + get_patientID.length);

		myDataNEW.push({
			id: j,
			status_flag: "Select",
			Xvalue: Y[j][0],
			Yvalue: Y[j][1],
			code_name: codeName[j], 
			first: codeName[j].substring(0, 2),  //			// two character in suffix, i.e. "p_"
			last:  codeName[j].substring(2) ,
			pmi: pmicodeDict[ fullcodeName[j] ],
			scr: "0",
			type:  kk ,
			descript: description[j],
			cosine: cosine_value[j].toFixed(3),  // taking first three digits,
			freq1: get_frequency_pid,
			patientID: get_patientID,
			freq3: common_claim_num,
			lc: "bac",
			claimID: get_claimID,
			code_claimID: code_claimID,
			common_claimID: common_claimID,
			freq2: get_frequency_cid  // get_frequency         // code_freq_top_neighbor[j]	
			
		});
	}
	return myDataNEW;
}
// ************************************************************************************
// ************************************************************************************
		
		
// ************************************************************************************
// ************************************************************************************
document.getElementById("view").onclick = function() {
	var codeToShow = document.getElementById("listItems").value;
    if (codeToShow <1){
        alert("The number of nearest neighbor code is empty");
		
	}
	else{
		document.getElementById("scatter").innerHTML = "";
		
		// *************************************
		// getting selected radio button value from the 'codetype' name element
		var codetype = "";
		var ele = document.getElementsByName('codetype'); // taking an array of radio button 
				
		for(i = 0; i < ele.length; i++) { 
			if(ele[i].checked) 
			 codetype = ele[i].value; 
		}						
		
		// *************************************
		if (codetype=="p"){
			// Text to show in legend bar
			legend_circle_code_text = ["19", "38", "39", "40", "83", "85","86","87","88","90","91","92", "00"];
			legend_code_text = ["Reconstructive operations on ear", "Incision, excision of vessels", "Other operations on vessels","Operations on lymphatic system","Operations on muscle tendon fascia","Operations on the breast","Operations on skin tissue","Diagnostic Radiology","Other diagnostic radiology tech","Microscopic examination-I","Microscopic examination-II","Nuclear medicine","other"];
		}
		if (codetype =="d"){
			legend_circle_code_text = ["139", "239", "279", "289", "319", "359","389","459","519","579","629","679", "709","739","759", "779","799","999","000"];
			legend_code_text = ['Infectious and parasitic diseases', 'Neoplasms', 'Immunity disorders', 'Blood diseases', 'Mental disorders', 'Nervous system' , 'Sense organs', 'Circulatory system', 'Respiratory system', 'Digestive system', 'Genitourinary system', 'Pregnancy, childbirth', 'Skin diseases', 'Connective tissue', 'Congenital anomalies', 'Perinatal period cond.','Symptoms & signs', 'Injury and poisoning', 'Other'];
			
		}
		if (codetype=="h"){
			// Text to show in legend bar
			legend_circle_code_text = ["191","192","193","365", "770", "850", "907","963", "964", "965","992", "000"]; 
			legend_code_text =["breast surgery", "excision surgery","mastectomy", "collection of blood", "needle placement", "blood count", "infusion therapy","therapeutic", "chemotherapy administration", "chemotherapy or refill","office visit", "other"];
		}
			
		
		if (first_query_code=="")
			first_query_code= document.getElementById("codevalue").value;
		
		// *************************************************
		myData =loadCosineSimilarityData();
		// *************************************************
		
		var tem_legend_circle_code_text = []; 
		var tem_legend_code_text =[];
		
		
		
		for ( var kk =0 ; kk< legend_code_text.length; kk++){
			for ( var jj =0 ; jj< myData.length; jj++){
			
				if (legend_code_text[kk]== myData[jj].type){
					tem_legend_code_text.push( legend_code_text[kk]);
					tem_legend_circle_code_text.push( legend_circle_code_text[kk]);
					break;
				}	
			}			
		}
		
		legend_circle_code_text = tem_legend_circle_code_text; 
		legend_code_text = tem_legend_code_text;
		
		// *************************************************
		
		
		
		//load sample data into the table
		$("#table_panel").tabulator("setData", myData);      
		initialize(myData);
		//document.getElementById("view").disabled = true;
	}
	
};
	


document.getElementById("back").onclick = function() {
	// Setting the first code as query code
	document.getElementById("codevalue").value = first_query_code;
	// Clear projection view
	document.getElementById("scatter").innerHTML = "";
	// Clear table view
	$("#table_panel").tabulator("clearData" );
	// load data again for the first_query_code   
	myData =loadCosineSimilarityData();
	
	//load again myData into the table
	$("#table_panel").tabulator("setData", myData);      
	//load again scatter view
	initialize(myData);
};
	
	

//when user clicks reset button, flash everything (query code, table, projection panel, output_panel
document.getElementById("reset").onclick = function() {
        var strconfirm = confirm("Are you sure you saved result and want to delete everything?");
        if (strconfirm == true) {
            first_query_code="";
            document.getElementById("codevalue").value = first_query_code;
            // Clear projection view
            document.getElementById("scatter").innerHTML = "";
            // Clear table view
            $("#table_panel").tabulator("clearData" );
            $("#output_panel").tabulator("clearData" );  
        }
};
