jsPDF

var config = {
    apiKey: 'AIzaSyBqLOGcZSYsvHJUAdBAFmFg2vBNgFFXVVo',
    authDomain: 'comflowbrf.firebaseapp.com',
    databaseURL: 'https://comflowbrf.firebaseio.com',
    projectId: 'comflowbrf',
    storageBucket: '',
    messagingSenderId: '1044507538767'
  };

firebase.initializeApp(config);
var database = firebase.database();
var name 	 = 'informations';
var email;
var loginTime;
var userId;

var flow = 0;
var pH 	 = 0;
var o2 	 = 0;
var turb = 0;
var i = 0

// 
function writeUserData(userId, flow, pH, o2, turb, now) {
  firebase.database().ref(name + '/' + userId).push().update({ 
    flow: flow,
    pH: pH,
    o2: o2,
    turb: turb,
	date : now.toString()
    });
}

function readUserData(userId, logout) {

	firebase.database().ref(name + '/' + userId).once('value').then(function(snap){

		values = snap.val();

		var email 	  = values['email'];
		var loginTime = values['loginTime'];

		for (var key in values) {

			if (key != 'email' && key != 'loginTime') {
				leaf = values[key];

				if (Number(loginTime < Number(leaf['date']) && Number(leaf['date']) < logout)) {

					flow = flow + Number(leaf['flow']);
					pH 	 = pH + Number(leaf['pH']);
					o2 	 = o2 + Number(leaf['o2']);
					turb = turb + Number(leaf['turb']);

					i ++;
				};
			};
		};

	meanFlow = (flow/i).toFixed(2);
	meanpH   = (pH/i).toFixed(2);
	meanO2   = (o2/i).toFixed(2);
	meanTurb = (turb/i).toFixed(2);

	totalH2OL   = flow * 1000
	qtdPersons  = (totalH2OL / 200)

	$('#meanFlow').val(meanFlow);
	$('#meanpH').val(meanpH);
	$('#meanO2').val(meanO2);
	$('#meanTurb').val(meanTurb);

	$('#login').val(loginTime);
	$('#logout').val(logout);

	$('#qtdPersons').val(qtdPersons);

	console.log(meanFlow, meanpH, meanO2, meanTurb, loginTime, logout, email);
	console.log(flow, pH,o2, turb);

	if (true) {
		var doc = new jsPDF('p','pt','a4');
		doc.addHTML(document.body,function(){
		    doc.save('Page.pdf');
		});
	};

	});
};


$('#btnCreateUser').click(function(){
	var email = $('#inputEmail').val();
	var password = $('#inputPassword').val();

	$('#inputEmail').val('');
	$('#inputPassword').val('')

	//criando conta com firebase email e senha do formulario
	firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
	    // Handle Errors here.
	    var errorCode = error.code;
	    var errorMessage = error.message;
	    alert(errorMessage);
	    console.log(errorMessage);
	    // ...
	});
});

$('#btnLogin').click(function(){
	var email = $('#inputEmailLogin').val();
	var password = $('#inputPassLogin').val();

	$('#inputEmailLogin').val('');
	$('#inputPassLogin').val('');

	 // fazendo login  com firebase
	firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
		    // Handle Errors here.
		    var errorCode = error.code;
		    var errorMessage = error.message;
		    alert(errorMessage);
		    // ...
	});
});

//verificando se o usuario ta logado
firebase.auth().onAuthStateChanged(function(user) {
	if (user) {
	  // User is signed in.
	  console.log('User is signed');
	  email  = user.email;
	  userId = user.uid;
	  loginTime = new Date().getTime()
	  $('#loggedUser').val(email)
	} else {
	  // No user is signed in.
	  console.log('No user is signed');
	};
});

$('#btnDataBase').click(function() {

	var flow   = $('#inputFlow').val();
	var pH     = $('#inputpH').val();
	var o2     = $('#inputO2').val();
	var turb   = $('#inputTurb').val();
	const now  = new Date().getTime();

	$('#inputFlow').val('');
	$('#inputpH').val('');
	$('#inputO2').val('');
	$('#inputTurb').val('');

	firebase.database().ref('informations/' + userId).update({
		email: email,
		loginTime: loginTime
	});

	writeUserData(userId, flow, pH, o2, turb, now);
});


$('#btnReport').click(function() {
	//alert("Report will be generated");
	$('#inputReport').val('');
	logout = new Date().getTime();
	readUserData(userId, logout);
});

