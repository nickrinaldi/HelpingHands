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

var isBusiness = false;

document.getElementById("button_business").onclick = function () {
    isBusiness = true;
    document.getElementById("button_business").style.border = "2px solid white";
    document.getElementById("button_user").style.border = "2px solid gray";
    document.getElementById("create_account_form").innerHTML = '<form><div class="form-group white"><label for="inputName" class="form-control-label">Business Information</label><input type="text" class="form-control" id="inputName" placeholder="Business Name"><input type="text" class="form-control" id="inputYelpID" placeholder="Yelp Business ID"><label for="inputAddress" class="form-control-label">Address</label><input type="text" class="form-control" id="inputAddress" placeholder="Business Address"><input type="text" class="form-control" id="inputCity" pattern="[a-z|A-Z| ]*" placeholder="City"><input type="text" class="form-control" id="inputState" pattern="[a-z|A-Z| ]*" placeholder="State"><input type="text" class="form-control" id="inputZip" pattern="[0-9]{5}" placeholder="Zip"><label for="inputEmail" class="form-control-label">Email</label><input type="email" class="form-control" id="inputEmail"  placeholder="Email"><label for="inputPassword" class="form-control-label">Password</label><input type="password" class="form-control" id="inputPassword" placeholder="Password"></div></form>';
};

document.getElementById("button_user").onclick = function () {
    isBusiness=false;
    document.getElementById("button_business").style.border = "2px solid gray";
    document.getElementById("button_user").style.border = "2px solid white";
    document.getElementById("create_account_form").innerHTML = '<form><div class="form-group white"><label for="inputFirstName" class="form-control-label">Name</label><input type="text" class="form-control" id="inputFirstName" pattern="[a-z|A-Z]*" placeholder="First Name"><input type="text" class="form-control" id="inputLastName" pattern="[a-z|A-Z]*" placeholder="Last Name"><label for="inputEmail" class="form-control-label">Email</label><input type="email" class="form-control" id="inputEmail" placeholder="Email"><label for="inputPassword" class="form-control-label">Password</label><input type="password" class="form-control" id="inputPassword" placeholder="Password"></div></form>';
};

document.getElementById("button_back").onclick = function () {
    location.href = "index.html";
};

document.getElementById("button_create_account").onclick = function () {
    if(isBusiness == false){
        var firstName = document.getElementById('inputFirstName').value;
        var lastName = document.getElementById('inputLastName').value;
        var email = document.getElementById('inputEmail').value;
        var password = document.getElementById('inputPassword').value;
        console.log(firstName, lastName, document.getElementById('inputEmail').value, password);
        attemptCreateUserAccount(firstName, lastName, email, password);
    }
    else{
        var businessName = document.getElementById('inputName').value;
        var businessYelpID = document.getElementById('inputYelpID').value;
        var businessAddress = document.getElementById('inputAddress').value;
        var businessCity = document.getElementById('inputCity').value;
        var businessState = document.getElementById('inputState').value;
        var businessZip = document.getElementById('inputZip').value;
        var email = document.getElementById('inputEmail').value;
        var password = document.getElementById('inputPassword').value;

        businessAddress = businessAddress+", "+businessCity+", "+businessState+", "+businessZip;

        attemptCreateBusinessAccount(businessName, businessYelpID, businessAddress, email, password);
    }

};


function attemptCreateUserAccount(userFirstName, userLastName, userEmail, userPassword){
    createUser = firebase.auth().createUserWithEmailAndPassword(userEmail, userPassword).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      if (errorCode == 'auth/weak-password') {
        alert('The password is too weak.');
      } else {
        alert(errorMessage);
      }
      console.log(error);
    });

    console.log("Create User: " + createUser);

    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            console.log("Successfully created user account with user: ", user);
            user.updateProfile({
                emailVerified: false,
                displayName: userFirstName + " " + userLastName,
            }).then(function() {
                // Update successful.
                console.log("Successfully Updated");
                console.log(user);
                var usersRef = firebase.database().ref("users/"+user.uid+"/");
                usersRef.set({
                  name: {
                    firstName: userFirstName,
                    lastName: userLastName
                  },
                  business: {
                    name: "",
                    yelpID: "",
                    address: ""
                  }
                });
            }, function(error) {
                // An error happened.
                console.log("Error!: " + error);
            });
        } else {
            // No user is signed in.
            console.log("No user signed in trying to sign in...");
            firebase.auth().signInWithEmailAndPassword(userEmail, userPassword).catch(function(error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorCode, errorMessage);
                alert("Invalid credentials");
            });
        }
    });

    location.href = "explore_list.html";
}

function attemptCreateBusinessAccount(businessName, businessYelpID, businessAddress, businessEmail, businessPassword){
    createUser = firebase.auth().createUserWithEmailAndPassword(businessEmail, businessPassword).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      if (errorCode == 'auth/weak-password') {
        alert('The password is too weak.');
      } else {
        alert(errorMessage);
      }
      console.log(error);
    });

    console.log("Create User: " + createUser);

    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            console.log("Successfully created user account with user: ", user);
            user.updateProfile({
                emailVerified: true,
                displayName: businessName,
            }).then(function() {
                // Update successful.
                console.log("Successfully Updated");
                console.log(user);
                var usersRef = firebase.database().ref("users/"+user.uid+"/");
                usersRef.set({
                  name: {
                    firstName: "",
                    lastName: ""
                  },
                  business: {
                    name: businessName,
                    yelpID: businessYelpID,
                    address: businessAddress
                  }
                });
            }, function(error) {
                // An error happened.
                console.log("Error!: " + error);
            });
        } else {
            // No user is signed in.
            console.log("No user signed in trying to sign in...");
            firebase.auth().signInWithEmailAndPassword(businessEmail, businessPassword).catch(function(error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorCode, errorMessage);
                alert("Invalid credentials");
            });
        }
    });


    /* CREATES TEST EVENT! */
    // var ref = new Firebase("https://connect-app.firebaseio.com/events/");
    // ref.push({
    //   businessName:"Bombay Gardens",
    //   address: "540 Newhall Dr #10, San Jose, CA 95110",
    //   businessID:"san-jose-tofu-company-san-jose",
    //   userID: userData.uid,
    //   eventName:"Buffet Food!",
    //   date:"02/02/16",
    //   startTime:"13:00",
    //   endTime:"14:00PM",
    //   description:"Eat my buffet!",
    //   hashtag:"#freefood",
    //   category:"Food"
    // });

    //location.href = "explore_list_business.html";
}

