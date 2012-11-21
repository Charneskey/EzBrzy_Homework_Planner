var db, data, outputAssign, outputCourses, outputNotes,numAssignments, numCourses, numNotes;

function dbErrorHandler(err) { alert("DB Error : " + err.message + "\n\nCode=" + err.code); }
function getById(id) { return document.querySelector(id); }
function dbSuccessCB() { alert("db.transaction success"); }
function dbQueryError(err) { alert("DB Query Error: " + err.message); }

function saveAssignment() {  // took (data,cb) out of parameter list
	db.transaction(function(tx) {
		var id = 1,
			name = "test",
			loc = "none",
			due = "some date",
			time = "some time",
			rem = "none",
			note = "none";
		tx.executeSql('INSERT INTO courses (cid, cname, cloc, cdue, ctime, crem, cnote) VALUES (?,?,?,?,?,?,?)',[id,name,loc,due,time,rem,note]);
	}, dbErrorHandler, dbSuccessCB);
//    if(data.title === "") { data.title = "[No Title]"; }
//    db.transaction(function(tx) {
//        if(data.id === "") { tx.executeSql("insert into notes(title,body,updated) values(?,?,?)",[data.title,data.body, new Date()]); }
//        else { tx.executeSql("update notes set title=?, body=?, updated=? where id=?",[data.title,data.body, new Date(), data.id]); }
//    }, dbErrorHandler,dbSuccessCB);
//    alert(data.title);
    //getEntries();
}

function setupTable(tx) {
	tx.executeSql('PRAGMA foreign_keys = ON;'); 
	tx.executeSql("CREATE TABLE IF NOT EXISTS courses(cid INTEGER PRIMARY KEY, cname TEXT NOT NULL, cloc, cdue, ctime, crem, cnote)");
	tx.executeSql("CREATE TABLE IF NOT EXISTS assignments(" +
					"aid INTEGER PRIMARY KEY, " +
					"cid INTEGER NOT NULL, " +
					"adesc TEXT NOT NULL, " +
					"adue, atime, aocc, arem, " +
					"anote TEXT, " +
					"FOREIGN KEY (cid) REFERENCES courses (cid))");
	tx.executeSql("CREATE TABLE IF NOT EXISTS notes(nid INTEGER PRIMARY KEY, ndesc TEXT NOT NULL, ndue, ntime, nrem, nooc)");
}

//TODO: calculate numbers!
function displayListing() {
	outputAssign='';
	outputCourses='';
	outputNotes='';
	numAssignments = 0;
	numCourses=0;
	numNotes=0;
	outputAssign += 'Displaying '+ numAssignments + ' Assignment(s)';
	outputCourses += 'Displaying '+ numCourses + ' Course(s)';
	outputNotes += 'Displaying '+ numNotes + ' Note(s)';
	$('#assignmentsDisplay').html(outputAssign);
	$('#coursesDisplay').html(outputCourses);
	$('#notesDisplay').html(outputNotes);
	//doReadNotes();	//TODO: should go away
}
function renderEntries(tx, results) {
	var i;
	for (i=0; i<results.rows.length; i++) {
		alert(results.rows.item(i).cid);
	}
}
function getAssignment() {
	db.transaction(function(tx) {
		tx.executeSql("SELECT cid, cname, cloc, cdue, ctime, crem, cnote FROM courses",[],renderEntries,dbQueryError);
	}, dbErrorHandler);
}
function setupDB() {
	db = window.openDatabase("ezbrzy","1.0","EzBrzy Database",1000000);
	db.transaction(setupTable, dbErrorHandler);
}
//this seems to work with the form for submission
function doSave() {
	$('#editAssignmentForm').submit();
//	$.mobile.changePage('#assignments');  //maybe consider .loadPage('index.html#assignments'); instead to reload header section?
	//getAssignment();  //<--- is working but don't want it here I think
	//saveAssignment();  //<--- is working but saveAssignment not adding correctly yet so keep commented out for now.
	
	//alert(data.title);  //seems to display data in form correctly.
	//alert($('#assignDesc').val());  //<--- this working
}
function onDeviceReady() {
	setupDB();
	displayListing();
	getById('#saveAssignment').addEventListener("click",doSave);
	
//	$("#editAssignmentForm").live("submit",function(e) {
//        data = {desc:$("#assignDesc").val(), 
//                    due:$("#assignDateDue").val(),
//                    time:$("#assignTimeDue").val()
//        };
//        //alert(data.title +" : "+data.body);  // <--- this IS working with the testSave submit function above.
//	});
	
	$('.mainPage').live('pageshow', function () {
		displayListing();
	});
	
	$('.historyBack').live('tap',function() {
		history.back();
		return false;
	}).live('click',function() {
		return false;
	});

	//date picker function
	$(function(){
	    $('.dateScroller').scroller({
	        preset: 'date',
	        invalid: '',
	        theme: 'default',
	        display: 'inline',
	        mode: 'scroller',
	        dateOrder: 'mmD ddyy'
	    });    
	});

}

function init() {
    document.addEventListener("deviceready", onDeviceReady, true);
}
