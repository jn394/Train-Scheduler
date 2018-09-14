$(document).ready(function () {

    var config = {
        apiKey: "AIzaSyDucZMnRKrIpyVln8UT6wI5bihA6Xp86Pc",
        authDomain: "train-scheduler-4f4de.firebaseapp.com",
        databaseURL: "https://train-scheduler-4f4de.firebaseio.com",
        projectId: "train-scheduler-4f4de",
        storageBucket: "train-scheduler-4f4de.appspot.com",
        messagingSenderId: "1083649383111"
    };
    firebase.initializeApp(config);

    var database = firebase.database();

    var trainName = "";
    var trainDes = "";
    var trainTime = "";
    var trainFreq = "";

    $("#submitButton").on("click", function () {
        console.log("I just been clicked");
        event.preventDefault();

        trainName = $("#train-Name").val().trim();
        trainDes = $("#train-Des").val().trim();
        trainFreq = $("#train-Freq").val().trim();

        var firstTime = $("#train-Time").val().trim();

        var firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "years");
        console.log(firstTimeConverted);

        var currentTime = moment();
        console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

        // Difference between the times
        var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
        console.log("DIFFERENCE IN TIME: " + diffTime);

        // Time apart (remainder)
        var tRemainder = diffTime % trainFreq;
        console.log(tRemainder);

        // Minute Until Train
        var tMinutesTillTrain = trainFreq - tRemainder;
        console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

        // Next Train
        var nextTrain = moment().add(tMinutesTillTrain, "minutes");
        var newNextTrain =  moment(nextTrain).format("hh:mm");
        console.log("Next train is: " + newNextTrain);

        database.ref().push({
            trainName: trainName,
            trainDes: trainDes,
            trainFreq: trainFreq,
            newNextTrain: newNextTrain,
            tMinutesTillTrain: tMinutesTillTrain,
            dateAdded: firebase.database.ServerValue.TIMESTAMP
        })

        $("#train-Name").val("");
        $("#train-Des").val("");
        $("#train-Time").val("");
        $("#train-Freq").val("");
    });

    database.ref().orderByChild("dateAdded").on("child_added", function (snapshot) {

        // Log everything that's coming out of snapshot
        console.log(snapshot.val());
        console.log(snapshot.val().trainName);
        console.log(snapshot.val().trainDes);
        console.log(snapshot.val().trainFreq);
        console.log(snapshot.val().newNextTrain);
        console.log(snapshot.val().tMinutesTillTrain);
            
        $("#table-body").append(

            "<tr>" +
            "<td>" + snapshot.val().trainName + "</td>" +
            "<td>" + snapshot.val().trainDes + "</td>" +
            "<td>" + snapshot.val().trainFreq + "</td>" +
            "<td>" + snapshot.val().newNextTrain + "</td>" +
            "<td>" + snapshot.val().tMinutesTillTrain + "</td>" +
            "</tr>");

        // Handle the errors
    }, function (errorObject) {
        console.log("Errors handled: " + errorObject.code);
    });

});