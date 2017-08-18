//api params
var senEndpoint = "members";
var senURL = "https://api.propublica.org/congress/v1/";
var senList = {
  "async": true,
  "crossDomain": true,
  "url": " ",
  "method": "GET",
  "headers": {
    "x-api-key": "mayRUHtP2kt3W1WNxLvumC4K1LJyC89q9PDbKwQl"
  }
}
//object to hold senator data
senObject = {};

var searchMethod = {

  //all the variables are kept on top
  senURL: "https://api.propublica.org/congress/v1/",
  senList: {
    "async": true,
    "crossDomain": true,
    "url": "",
    "method": "GET",
    "headers": {
      "x-api-key": "mayRUHtP2kt3W1WNxLvumC4K1LJyC89q9PDbKwQl"
    }
  },

  //this is what we'll need to use for our populate function outside of the search function, these are eventually what get passed into the members API; Josh, hopefully this is what you're looking for
  senIdArr: [],

  firstName: "",

  lastName: "",

  state: "",

  party: "",

  //there are functions added for every button for every search type we are doing
  activateNameButton: function(button) {
    $("#first-name-bar").val("");
    $("#last-name-bar").val("");
    $("button").removeClass("active");
    $(button).addClass("active");
    $("#states").hide();
    $("#party").hide();
    $("#first-name").show();
    $("#last-name").show();
    $("#search-button").show();
  },

  activateStatesButton: function(button) {
    $("#state-bar").text("States");
    $("#state-bar").val("");
    $("button").removeClass("active");
    $(button).addClass("active");
    $("#first-name").hide();
    $("#last-name").hide();
    $("#party").hide();
    $("#search-button").hide();
    $("#states").show();
  },

  activatePartyButton: function(button) {
    $("#party-bar").text("Party");
    $("#party-bar").val("");
    $("button").removeClass("active");
    $(button).addClass("active");
    $("#first-name").hide();
    $("#last-name").hide();
    $("#states").hide();
    $("#search-button").hide();
    $("#party").show();
  },

  //function for input validation, kept separate so that it can be called when needed, I'm using console logs in place of actual alerts for now just to test functionality, someone PLEASE replace them with modals like they're supposed to be (see below)
  inputValidation: function(input) {  
    if (input !== "") {
      if (/^[a-zA-Z]+/.test(input)) {
        return input;
      } else {
        console.log("invalid");
      }
    }
  },

  //these are the functions for our search types, the search by name function ended up being huge;

  searchByName: function() {
    $("#input-errors").text("");
    this.firstName = this.inputValidation($("#first-name-bar").val().trim());
    this.lastName = this.inputValidation($("#last-name-bar").val().trim());
    this.senList.url = this.senURL + "115/Senate/members.json";
    $.ajax(this.senList).done(function(response) {
      var senMem = response.results[0].members;
      if (searchMethod.firstName !== undefined && searchMethod.lastName == undefined) {
        $.each(senMem, function(i) {
          if (senMem[i].first_name.toLowerCase() == searchMethod.firstName.toLowerCase()) {
            searchMethod.senIdArr.push(senMem[i].id);
            state = senMem[i].state;
            party = senMem[i].party;
            searchMethod.renderSearch(senMem[i].first_name, senMem[i].last_name, senMem[i].party, senMem[i].state, senMem[i].id);
          }
        });
        if (searchMethod.senIdArr.length == 0){
          $("#input-errors").text("Your search did not yield any results.");
        }
      } else if (searchMethod.lastName !== undefined && searchMethod.firstName == undefined) {
        $.each(senMem, function(i) {
          if (senMem[i].last_name.toLowerCase() == searchMethod.lastName.toLowerCase()) {
            searchMethod.senIdArr.push(senMem[i].id);
            state = senMem[i].state;
            party = senMem[i].party;
            searchMethod.renderSearch(senMem[i].first_name, senMem[i].last_name, senMem[i].party, senMem[i].state, senMem[i].id);
          }
        });
        if (searchMethod.senIdArr.length == 0){
          $("#input-errors").text("Your search did not yield any results.");
        }
      } else if (searchMethod.firstName !== undefined && searchMethod.lastName !== undefined) {
        $.each(senMem, function(i) {
          if (senMem[i].first_name.toLowerCase() == searchMethod.firstName.toLowerCase() && senMem[i].last_name.toLowerCase() == searchMethod.lastName.toLowerCase()) {
            searchMethod.senIdArr.push(senMem[i].id);
            state = senMem[i].state;
            party = senMem[i].party;
            searchMethod.renderSearch(senMem[i].first_name, senMem[i].last_name, senMem[i].party, senMem[i].state, senMem[i].id);
          }
        });
        if (searchMethod.senIdArr.length == 0){
          $("#input-errors").text("Your search did not yield any results.");
        }
      } else if (searchMethod.firstName == undefined && searchMethod.lastName == undefined) {
        $("#input-errors").text("Your field is either empty or invalid, please try again.");
      }
    });
  },
  searchByState: function() {
    this.state = $("#state-bar").val();
    console.log(this.state);
    this.senList.url = this.senURL + "members/senate/" + this.state + "/current.json";
    if(this.state !== "States"){
      $.ajax(this.senList).done(function(response) {
        var senMem = response.results;
        $.each(senMem, function(i) {
          searchMethod.senIdArr.push(senMem[i].id);
          searchMethod.renderSearch(senMem[i].first_name, senMem[i].last_name, senMem[i].party, searchMethod.state, senMem[i].id);
        });
      });
    } else{
      console.log("specify a state first")
    }
  },
  searchByParty: function(){
    this.party = $("#party-bar").val();
    console.log(this.party);

    this.senList.url = this.senURL + "115/Senate/members.json";
    $.ajax(this.senList).done(function(response) {
      var senMem = response.results[0].members;
      $.each(senMem, function(i) {
        if (senMem[i].party == searchMethod.party) {
          searchMethod.senIdArr.push(senMem[i].id);
          searchMethod.renderSearch(senMem[i].first_name, senMem[i].last_name, senMem[i].party, senMem[i].state, senMem[i].id);
        }
      });
    });
  },
  displayFavorites: function(senArr){
    $("#search-results").empty();
    this.senList.url = this.senURL + "115/Senate/members.json";
    $.ajax(this.senList).done(function(response) {
      var senMem = response.results[0].members;
      $.each(senMem, function(i) {
        if ($.inArray(senMem[i].id, senArr) != -1) {
          searchMethod.senIdArr.push(senMem[i].id);
          searchMethod.renderSearch(senMem[i].first_name, senMem[i].last_name, senMem[i].party, senMem[i].state, senMem[i].id);
        }
      });
    });    

  },
  //this will determine what kind of endpoint we're using and based on that will populate senIdArr with all the IDs of all the senators it finds that match the search criteria
  setSenId: function() {
    this.senIdArr = [];
    $("#search-results").empty();
    if ($("#name-button").hasClass("active")) {
      this.searchByName();
    } else if ($("#states-button").hasClass("active")) {
      this.searchByState();
    } else if ($("#party-button").hasClass("active")) {
      this.searchByParty();
    }
  },
  renderSearch: function(firstname, lastname, party, state, id) {
    if (party == "D"){
      $("#search-results").append('<div class="card view overlay col-sm-3 hm-blue-slight hm-zoom" id="' + id +
        '"><img class="img-fluid img-responsive" src="assets/images/senpics/' +
        id + '.jpg" alt="Card image cap"><div class="card-body"><h4 class="card-title">' +
        firstname + ' ' + lastname + '</br>(' + party + '-' + state + ')</h4></div><a href="#"><div class="mask"></div></a></div>');
    }
    if (party == "R"){
      $("#search-results").append('<div class="card view overlay col-sm-3 hm-red-slight hm-zoom" id="' + id +
        '"><img class="img-fluid img-responsive" src="assets/images/senpics/' +
        id + '.jpg" alt="Card image cap"><div class="card-body"><h4 class="card-title">' +
        firstname + ' ' + lastname + '</br>(' + party + '-' + state + ')</h4></div><a href="#"><div class="mask"></div></a></div>');
    }
    if (party == "I"){
      $("#search-results").append('<div class="card view overlay col-sm-3 hm-yellow-slight hm-zoom" id="' + id +
        '"><img class="img-fluid img-responsive" src="assets/images/senpics/' +
        id + '.jpg" alt="Card image cap"><div class="card-body"><h4 class="card-title">' +
        firstname + ' ' + lastname + '</br>(' + party + '-' + state + ')</h4></div><a href="#"><div class="mask"></div></a></div>');
    }          

  }
}
function produceSen(senId) {
  senList.url = senURL + senEndpoint + "/" + senId + ".json";
  $('#senmodal').modal('show');
  $("#cardlocation, #newsdisplay, #twitterArea, .twitter-timeline").empty();
  $("#recent_bills").html("<u><b>Recent Bills Sponsored:</b></u>");
  $("#resolutions").html("<u><b>Further Resolutions:</b></u>");
  $("#follow").val(senId);

  $.ajax(senList).done(function(response) {
    senObject = response;
    $("#notcurrentlyused").html("<u><b>Basic Information:</b></u>");
    $("#sub_commitees").html("<u><b>Current Committee Memberships:</b></u><ul></ul>");
    $("#notcurrentlyused").append("<h6>Full title and rank: " + senObject.results[0].roles[0].title + " (" + senObject.results[0].roles[0].state_rank + ")</h6>");
    $("#notcurrentlyused").append("<h6>Date of birth: " + senObject.results[0].date_of_birth + "</h6>");
    $("#notcurrentlyused").append("<h6>Current term end date: " + senObject.results[0].roles[0].end_date + "</h6>");
    $("#notcurrentlyused").append("<h6>Phone number: " + senObject.results[0].roles[0].phone + "</h6>");
    $("#notcurrentlyused").append("<h6>Fax number: " + senObject.results[0].roles[0].fax + "</h6>");
    $("#notcurrentlyused").append("<h6>Website: <a href='" + senObject.results[0].url + "'>" + senObject.results[0].url + "</a></h6>");
    $("#notcurrentlyused").append("<h6>Bills sponsored: " + senObject.results[0].roles[0].bills_sponsored + "</h6>");
    $("#notcurrentlyused").append("<h6>Bills co-sponsored: " + senObject.results[0].roles[0].bills_cosponsored + "</h6>");
    $("#notcurrentlyused").append("<h6>Most recent vote: " + senObject.results[0].most_recent_vote + "</h6>");
    $("#notcurrentlyused").append("<h6>Missed vote percentage: " + senObject.results[0].roles[0].missed_votes_pct + "%</h6>");
    $("#notcurrentlyused").append("<h6>Votes with party percentage: " + senObject.results[0].roles[0].votes_with_party_pct + "%</h6>");


    for(var i = 0; i < senObject.results[0].roles[0].committees.length; i++){
      $("#sub_commitees").append("<h6> - " + senObject.results[0].roles[0].committees[i].name +  " (" + senObject.results[0].roles[0].committees[i].code + ")</h6>");
    }


    $("#cardlocation").append('<div class="card"><img class="img-fluid img-responsive" src="assets/images/senpics/' +
      senObject.results[0].member_id + '.jpg" alt="Card image cap"><div class="card-body"><h4 class="card-title">' +
      senObject.results[0].first_name + ' ' + senObject.results[0].last_name + '</br>(' + senObject.results[0].party + '-' + senObject.results[0].state + ')</h4></div></div>');
    timesHandler.apiCall(senObject.results[0].first_name, senObject.results[0].last_name);

    if (senId == "P000603") {
      getTweets("RandPaul");
      analyzeTweets("RandPaul");
    } else if (senId == "C001075") {
      getTweets("BillCassidy");
      analyzeTweets("BillCassidy");
    } else {
      getTweets(senObject.results[0].twitter_account);
      analyzeTweets(senObject.results[0].twitter_account);
    }

  });

  senList.url = "https://api.propublica.org/congress/v1/members/" + senId + "/bills/introduced.json";
  $.ajax(senList).done(function (response) {
    for(var i = 0; i < response.results[0].bills.length; i++){
      var link = response.results[0].bills[i].govtrack_url;
      var ID = "href" + i;
      if(response.results[0].bills[i].bill_type == "s"){
        $("#recent_bills").append("<h6> - <a id=" + ID + ">" + response.results[0].bills[i].title +  "</a> (" + response.results[0].bills[i].number + ")</h6>");
        $("#" + ID).attr('href', link);
        $("#" + ID).attr('target', '_blank');
      }
      else{
        $("#resolutions").append("<h6><a id=" + ID + ">" + response.results[0].bills[i].title +  "</a> (" + response.results[0].bills[i].number + ")</h6>");
        $("#" + ID).attr('href', link);
        $("#" + ID).attr('target', '_blank');
      }
    }
  });

  senList.url = "https://api.propublica.org/congress/v1/members/" + senId + "/bills/cosponsored.json";
  $.ajax(senList).done(function(response) {
    //console.log(response);
    var senators = ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""];
    var counter = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    var topSenator = "";
    var maxCount = 0;
    var location = 0;


    for (var i = 0; i < response.results[0].bills.length; i++) {
      for (var j = 0; j < senators.length; j++) {
        if (senators[j] == "") {
          senators[j] = response.results[0].bills[i].sponsor_name + " (" + response.results[0].bills[i].sponsor_party + "-" + response.results[0].bills[i].sponsor_state + ")";
          counter[j] = 1;
          break;
        } else if (senators[j] == response.results[0].bills[i].sponsor_name + " (" + response.results[0].bills[i].sponsor_party + "-" + response.results[0].bills[i].sponsor_state + ")") {
          counter[j]++;
          break;
        }
      }
    }

    for (var k = 0; k < senators.length; k++) {
      if (counter[k] > maxCount) {
        maxCount = counter[k];
        location = k;
      }
    }
    if (maxCount > 1) {
      $("#notcurrentlyused").append("<h6>Senator most cosponsored: " + senators[location] + " (" + maxCount + ")</h6>");
    } else {
      $("#notcurrentlyused").append("<h6>Senator most cosponsored: N/A</h6>");
    }
  });

}

//handles all firebasee account and database functions
var accHandler = {
  //user and database object variables
  userDatabase: firebase.database(),
  userArr: [],
  uid: "",
  //event listener for follow button leads here
  senFollow: function() {
    var senId = $("#follow").val();
    console.log(senId);
    if ($.inArray(senId, accHandler.userArr) === -1) {
      accHandler.userDatabase.ref(accHandler.uid).push(senId);
    } else {
      alert('Senator Already Followed');
    }
  },
  //Will be used to render the senator bios for the user page
  buildSenList: function() {
    accHandler.userDatabase.ref(accHandler.uid).on("value", function(snapShot) {
      accHandler.userArr = Object.values(snapShot.val());
      searchMethod.displayFavorites(accHandler.userArr);
    })
  },
  //creates user when sign up button is pressed
  createUser: function() {
    var email = $("#email-signup").val().trim();
    var password = $("#password-signup").val().trim();
    //handles error returning
    if (email.length < 4) {
      $("#success-span").text('Please enter an email address.');
      $("#close-modals").hide();
      $("#success-modal").modal('show');
      setTimeout(function(){
        $("#success-modal").modal('hide');
        $("#loginmodal").modal('show');
      }, 1500);
      return;
    }
    if (password.length < 4) {
      $("#success-span").text('Please enter a password.');
      $("#close-modals").hide();
      $("#success-modal").modal('show');
      setTimeout(function(){
        $("#success-modal").modal('hide');
        $("#loginmodal").modal('show');
      }, 1500);
      return;
    }
    // Sign in with email and pass.
    // [START createwithemail]
    firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // [START_EXCLUDE]
      if (errorCode == 'auth/weak-password') {
        $("#success-span").text('The password is too weak.');
        $("#close-modals").hide();
        $("#success-modal").modal('show');
        setTimeout(function(){
          $("#success-modal").modal('hide');
        }, 1500);
      } else {
        $("#success-span").text(errorMessage);
        $("#close-modals").hide();
        $("#success-modal").modal('show');
        setTimeout(function(){
          $("#success-modal").modal('hide');
        }, 1500);
      }
      console.log(error);
      // [END_EXCLUDE]
    }).done;

    // firebase.auth().currentUser.updateProfile({
    //   displayName: userName
    // });
    console.log("test1");
    console.log(firebase.auth().currentUser);
    //create modal alert
    $("#success-span").text("Account creation successful. Welcome.");
    $("#close-modals").show();
    $("#success-modal").modal('show');
  },
  //handles user sign in functionality
  signIn: function() {
    var email = $("#email-signin").val();
    var password = $("#password-signin").val();
    firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // [START_EXCLUDE]
      if (errorCode === 'auth/wrong-password') {
        $("#success-span").text('Wrong password.');
        $("#close-modals").hide();
        $("#success-modal").modal('show');
        setTimeout(function(){
          $("#success-modal").modal('hide');
        }, 1500);
      } else {
        $("#success-span").text(errorMessage);
        $("#close-modals").hide();
        $("#success-modal").modal('show');
        setTimeout(function(){
          $("#success-modal").modal('hide');
        }, 1500);
      }
      console.log(error);
      // [END_EXCLUDE]
    })
    console.log(firebase.auth().currentUser);
    //create modal alert
    $("#success-span").text("You have successfully signed in.");
    $("#close-modals").show();
    $("#success-modal").modal('show');

  },
  //handles user sign out functionality
  signOut: function() {
    firebase.auth().signOut();
    accHandler.uid = "";
    accHandler.userArr = [];
    $("#search-results").empty();
    //create modal alert
    $("#success-span").text("You have successfully signed out.");
    $("#close-modals").show();
    $("#success-modal").modal('show');
  },
  //handles user sign out functionality
  initApp: function() {
    firebase.auth().onAuthStateChanged(function(user) {
      if (user != null){
        accHandler.uid = user.uid;
        if(user.displayName == null){
          var userName = $("#username-signup").val().trim();   
          firebase.auth().currentUser.updateProfile({
            displayName: userName
          });
        }
        $("#showfaves").show();
        $("#openmodal").hide();
        $("#welcome").show();
        $("#welcome").html("Welcome " + firebase.auth().currentUser.displayName + "!");
        $("#sign-out").show();
      }
      if (user == null){
        $("#openmodal").show();
        $("#welcome").hide();
        $("#welcome").html(" ");
        $("#sign-out").hide();
        $("#showfaves").hide();
      }      
      accHandler.buildSenList();
    });
  }
};
//handles API calls for the NYTimes
var timesHandler = {
 apiCall : function(firstName, lastName){
  var url = "https://api.nytimes.com/svc/search/v2/articlesearch.json"
  url += '?' + $.param({
    'api-key': "4ef882df201e419684d1da14f37e8634",
    'q': firstName + " " + lastName,
    'fl': "web_url, snippet, headline"
  });
  //console.log(url);
  $.ajax({
    url: url,
    method: 'GET',
  }).done(function(result) {
    timesHandler.renderArticles(result.response.docs);
  }).fail(function(err) {
    throw err;
  });
 },
 //renders the articles to the senator modal
 renderArticles: function(list){
    $("#newsdisplay").empty();
    for (var i = 0; i < 5; i++) {
      //console.log(list[i])
      $("#newsdisplay").append("<a href='" + list[i].web_url + "' target='_blank'><h4 class='headline'>" 
      + list[i].headline.main + "</h4></a><p class='snippet'><q>" + list[i].snippet + "</q></p>")
    }
  }
}



//all the event listeners/callbacks are down here, again, once we start integrating this whole method into the rest of the project, we will need to replace all the id and class tags either here or in the html file
$("#name-button").on("click", function() {
  searchMethod.activateNameButton(this);
});

$("#states-button").on("click", function() {
  searchMethod.activateStatesButton(this);
});

$("#states-menu li a").on("click", function() {
  $("#state-bar").text($(this).text());
  $("#state-bar").val($(this).attr("value"));
  searchMethod.setSenId();
});

$("#search-button").on("click", function() {
  searchMethod.setSenId();
});
$("#party-button").on("click", function() {
  searchMethod.activatePartyButton(this);
});
$("#party-menu li a").on("click", function() {
  $("#party-bar").text($(this).text());
  $("#party-bar").val($(this).attr("value"));
  searchMethod.setSenId();
});
$("#openmodal").on("click", function() {
  $('#loginmodal').modal('show');
});
$("#close-modals").on("click", function() {
  $("#success-modal").modal('hide');
  $('#loginmodal').modal('hide');
});
$("#showfaves").on("click", function() {
  accHandler.buildSenList();
});
$("#search-results").on("click", ".card", function() {
  produceSen(this.id);
});

document.getElementById('sign-up').addEventListener('click', accHandler.createUser, false);
document.getElementById('sign-in').addEventListener('click', accHandler.signIn, false);
document.getElementById('sign-out').addEventListener('click', accHandler.signOut, false);
document.getElementById('follow').addEventListener('click', accHandler.senFollow, false);
$('#Signup').tab('show')
$('#Signin').tab('show')
window.onload = function() {
  accHandler.initApp();
};


function analyzeTweets(handle){
  $("#tweetArea").html("");
  var hashtags = ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""];;
  var mentions = ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""];;
  var hashCounter = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  var mentCounter = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  var hashCount = 0;
  var mentCount = 0;
  var hentries = 0;
  var mentries = 0;
  var hashes = 0;
  var signs = 0;
  
  var locHash = 0;
  var locMent = 0;
  var queryURL = "https://shrouded-dawn-80649.herokuapp.com/" + "?q=" + handle;

  $.ajax({
    url: queryURL,
    method: "GET"

  }).done(function(response){
    //console.log(response);

  for(var i = 0; i < response.tweets.length; i++){ // go through the tweets
    if(response.tweets[i].entities.hashtags.length != 0){ // if hashtag(s) found in tweet
      for(var j = 0; j < response.tweets[i].entities.hashtags.length; j++){ // list them off
        for(var k = 0; k < hashtags.length; k++){
          if(hashtags[k] == ""){
            hashtags[k] = response.tweets[i].entities.hashtags[j].text;
            hashCounter[k] = 1;
            hashes++;
            hentries++;
            break;
          }

          else if(hashtags[k] == response.tweets[i].entities.hashtags[j].text){
            hashCounter[k]++;
            hentries++;
            break;
          }
        }
      }
    }

    if(response.tweets[i].entities.user_mentions.length != 0){
      for(var j = 0; j < response.tweets[i].entities.user_mentions.length; j++){
        for(var k = 0; k < mentions.length; k++){
          if(mentions[k] == ""){
            mentions[k] = response.tweets[i].entities.user_mentions[j].screen_name;
            mentCounter[k] = 1;
            signs++;
            mentries++;
            break;
          }


          else if(mentions[k] == response.tweets[i].entities.user_mentions[j].screen_name){
            mentCounter[k]++;
            mentries++;
            break;
          }
        }
      }
    }
  }

  for(var k = 0; k < hashtags.length; k++){
    if(hashCounter[k] > hashCount){
      hashCount = hashCounter[k];
      locHash = k;
    }
    //console.log(hashtags[k] + "; " + hashCounter[k]);
  }

  for(var k = 0; k < mentions.length; k++){
    if(mentCounter[k] > mentCount){
      mentCount = mentCounter[k];
      locMent = k;
    }
    //console.log(mentions[k] + "; " + mentCounter[k]);
  }

  if(hashCount > 1){
    $("#tweetArea").append("<h6>Number of unique hashtags found (in last 20 tweets): " + hashes + " (out of " + hentries + ") | Most popular: #" + hashtags[locHash] + " (" + hashCounter[locHash] + " times)</h6>");
  }
  else{
    $("#tweetArea").append("<h6>Number of unique hashtags found (in last 20 tweets): " + hashes + " (out of " + hentries + ") | Most popular: (no repeats)</h6>");
  }


  if(mentCount > 1){
    $("#tweetArea").append("<h6>Number of unique mentions found (in last 20 tweets): " + signs + " (out of " + mentries + ") | Most popular: @" + mentions[locMent] + " (" + mentCounter[locMent] + " times)</h6>");
  }
  else{
    $("#tweetArea").append("<h6>Number of unique mentions found (in last 20 tweets): " + signs + " (out of " + mentries + ") | Most popular: (no repeats)</h6>");
  }
  });
}

$(document).ready(function() {
  $("ul.tabs").tabs();


  $('#basic').click(function(){
    $("#recent_bills").css("display", "none");
    $("#resolutions").css("display", "none");
    $("#newsdisplay").css("display", "none");
    $("#twitterArea").css("display", "none");
    $("#tweetArea").css("display", "none");
    $(".twitter-timeline").css("display", "none");
    $("#newstitle").css("display", "none");

    $("#cardlocation").css("display", "inline");
    $("#basic_info").css("display", "inline");

  });

  $('#recent').click(function(){
    $("#cardlocation").css("display", "none");
    $("#basic_info").css("display", "none");
    $("#newsdisplay").css("display", "none");
    $("#twitterArea").css("display", "none");
    $(".twitter-timeline").css("display", "none");
    $("#tweetArea").css("display", "none");
    $("#newstitle").css("display", "none");

    $("#recent_bills").css("display", "inline");
    $("#resolutions").css("display", "inline");

  });

  $('#tweets').click(function(){
    $("#cardlocation").css("display", "none");
    $("#basic_info").css("display", "none");
    $("#recent_bills").css("display", "none");
    $("#resolutions").css("display", "none");
    $("#newsdisplay").css("display", "none");
    $("#newstitle").css("display", "none");

    $("#twitterArea").css("display", "inline");
    $(".twitter-timeline").css("display", "inline");
    $("#tweetArea").css("display", "inline");
  });

  $('#other').click(function(){
    $("#cardlocation").css("display", "none");
    $("#basic_info").css("display", "none");
    $("#recent_bills").css("display", "none");
    $("#resolutions").css("display", "none");
    $("#twitterArea").css("display", "none");
    $("#tweetArea").css("display", "none");
    $(".twitter-timeline").css("display", "none");

    $("#newsdisplay").css("display", "inline");
    $("#newstitle").css("display", "inline");
  });

});

function getTweets(handle){
  twttr.widgets.createTimeline({sourceType: "profile", screenName: handle}, document.getElementById('twitterArea'),{tweetLimit: 5, width: 800});
};

window.twttr = (function(d, s, id) {
  var js, fjs = d.getElementsByTagName(s)[0],
    t = window.twttr || {};
  if (d.getElementById(id)) return t;
  js = d.createElement(s);
  js.id = id;
  js.src = "https://platform.twitter.com/widgets.js";
  fjs.parentNode.insertBefore(js, fjs);

  t._e = [];
  t.ready = function(f) {
    t._e.push(f);
  };

  return t;

}(document, "script", "twitter-wjs"));


