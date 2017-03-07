/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};

document.getElementById("button_back").onclick = function () {
    location.href = "index.html";
};

document.getElementById("button_login").onclick = function () {
    var email = document.getElementById('inputEmail').value;
    var password = document.getElementById('inputPassword').value;
    console.log("Attempt Login Button clicked.");
    attemptLogin(email, password);
};


function attemptLogin(userEmail, userPassword){
    if (firebase.auth().currentUser) {
        console.log("You were already signed in so logging out now");
        console.log(firebase.auth().currentUser.uid);
        firebase.auth().signOut();
    }
    window.localStorage.clear();

    firebase.auth().signInWithEmailAndPassword(userEmail, userPassword).catch(function(error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorCode, errorMessage);
        alert("Invalid credentials");
    });

    firebase.auth().onAuthStateChanged(user => {
        if(user) {
            var ref = firebase.database().ref("/users/"+user.uid+"/");
            ref.on("value", function(snapshot) {
              console.log(snapshot.val());
              console.log(snapshot.val().business.name);

              if(snapshot.val().business.name === ""){
                console.log("Not a Business");
                location.href = "explore_list.html";
              }
              else{
                console.log("A Business");
                location.href = "explore_list_business.html";
              }
            }, function (errorObject) {
              console.log("The read failed: " + errorObject.code);
            });
        }
    });
}
