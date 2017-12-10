document.onload = function () {
// To decode any of the DNA challenges
// Can now encode those challenges and produce the opposite string

// This is what stops the string from being too large, change it at your peril.
    var maxInputLength = 1000;

// This part was quite annoying
    var decoder = [
        [
            ["m", "y", "w", "t"],
            ["z", "u", "l", "v"],
            [".", " ", "a", "w"],
            ["o", "x", "n", "m"]
        ], [
            ["u", "c", "t", "b"],
            ["k", "k", "m", "n"],
            ["j", "e", "i", "x"],
            ["i", "j", "s", "r"]
        ], [
            ["i", "d", "s", "g"],
            ["d", "d", "b", "h"],
            ["f", "l", "h", "c"],
            ["p", " ", ".", "q"]
        ], [
            ["c", "p", "f", "b"],
            ["o", "f", "e", "n"],
            ["a", "g", "d", "e"],
            ["z", "r", "a", "y"]
        ]
    ];

    function setInput(valueToSet) {
        $("#input").val(valueToSet);
    }

    function emptyOutput() {
        $("#output").empty();
    }

    function addOutput(outputToAdd) {
        $("#output").append(outputToAdd);
    }

    var letAndNum = " abcdefghijklmnopqrstuvwxyz.";
// I had to start over because the first time the code was just a mess

// Variables
    var inputVal = 0;
    var stringLength;
    var decodedString;

// This turns the letters into number so they're easier to work with
    var letToNum = function (startLetter) {
        var letter = startLetter.toLowerCase();
        if (letter === "a") {
            return 0;
        } else if (letter === "c") {
            return 1;
        } else if (letter === "g") {
            return 2;
        } else if (letter === "t") {
            return 3;
        } else {
            emptyOutput();
            addOutput('Error: "' + startLetter + '" is not a valid decode letter; ');
            return null;
        }
    };

// Get's the string, removes spaces, gets amount of *decoded* letters
    var setDecodeString = function () {
        inputVal = document.getElementById("input").value; // Gets the value in the box
        inputVal = inputVal.replace(/\s/g, ''); // Removes all spaces. May have gotten this one from the internet
        inputVal = inputVal.replace(/;/g, ''); // Removes all ';'s, just in case
        stringLength = inputVal.length / 3;
        if (stringLength % 1 !== 0) { // Checks if it's a whole number, errors if it's not
            // Another error message
            emptyOutput();
            addOutput("Error: String not a multiple of 3; ");
            stringLength = 0; // Makes sure nothing happens after this error
        }
    };

// This will clean the string to add capitals where needed
    var cleanString = function () {
        var cleanedString = decodedString.charAt(0).toUpperCase() + decodedString.substr(1, decodedString.length);
        for (var k = 0; k < cleanedString.length; k++) {
            if (cleanedString.charAt(k) === ".") {
                if (cleanedString.charAt(k + 1) === " ") {
                    cleanedString = cleanedString.substr(0, k + 2) + cleanedString.charAt(k + 2).toUpperCase() + cleanedString.substr(k + 3, cleanedString.length);
                }
            }
        }
        return cleanedString;
    };

    var decodeInput = function () {
        setDecodeString();
        var decode = []; // New variable for storing the decode
        for (var i = 0; i < stringLength; i++) {
            for (var n = 0; n < 3; n++) {
                var cur = (i * 3) + n;
                decode[n] = letToNum(inputVal.charAt(cur));
            }
            if (i === 0) { // Makes sure the string is clean
                decodedString = decoder[decode[0]][decode[1]][decode[2]]; // Changes the string to the decoded letter
            } else {
                decodedString += decoder[decode[0]][decode[1]][decode[2]]; // Adds the decoded letter to the string
            }
        }
        if (stringLength !== 0) { // Makes sure that error messages don't get replaced by this
            decodedString = cleanString();
            emptyOutput();
            setInput(decodedString); // Shows the decoded string
        }
    };


// New section for encoding

    var encodedOutput;
    var previousLetter;

    var numToLet = function (num) {
        if (num === 0) {
            return "A";
        } else if (num === 1) {
            return "C";
        } else if (num === 2) {
            return "G";
        } else if (num === 3) {
            return "T";
        } else {
            emptyOutput();
            addOutput('Error: "' + num + '" is not a valid number; ');
            return null;
        }
    };

    var findInString = function (toFind) {
        var i;
        for (i = 0; i < letAndNum.length; i++) {
            if (letAndNum.charAt(i) === toFind) {
                return i;
            }
        }
        return null;
    };

    var findAllInArray = function (toFind) {
        var returnArray = [];
        for (var i0 = 0; i0 < 4; i0++) {
            for (var i1 = 0; i1 < 4; i1++) {
                for (var i2 = 0; i2 < 4; i2++) {
                    if (decoder[i0][i1][i2] === toFind) {
                        returnArray.push("" + i0 + i1 + i2);
                    }
                }
            }
        }
        emptyOutput();
        addOutput("Found " + returnArray.length + " match(es) for " + toFind + "; ");
        return returnArray;
    };

    var setEncodeString = function () {
        inputVal = $("#input").val(); // Gets the value in the box
        inputVal = inputVal.toLowerCase(); // Makes it all lower case
    };

    var gNum = function (arrayOfNums) {
        // This now returns something useful
        var value;
        if (previousLetter === 0) {
            return 0;
        } else {
            value = findInString(previousLetter);
            value = value / letAndNum.length;
            return Math.floor(value * arrayOfNums.length);
        }
    };

    var returnLet;

    var stringNumToLet = function (stringToLet) {
        returnLet = "";
        for (var t = 0; t < stringToLet.length; t++) {
            returnLet += numToLet(stringToLet.charAt(t));
        }
        return returnLet;
    };

    var stringToOpposite = function () {
        setEncodeString();
        if (inputVal.length > maxInputLength) {
            addOutput("Error: The recode string is too large at " + inputVal.length + " characters, calculating it would cause a huge amount of both CPU and RAM usage; You can change this limit in the JavaScript code, if you wish; ");
            return;
        }
        var oppositeString = "";
        for (var i = 0; i < inputVal.length; i++) {
            switch (inputVal[i]) {
                case "a":
                    oppositeString += "t";
                    break;
                case "c":
                    oppositeString += "g";
                    break;
                case "g":
                    oppositeString += "c";
                    break;
                case "t":
                    oppositeString += "a";
                    break;
                default:
                    oppositeString += ".";
            }
        }
        setInput(oppositeString);
    };

    var encodeInput = function () {
        encodedOutput = null;
        setEncodeString();
        if (inputVal.length > maxInputLength) {
            addOutput("Error: The decode string is too large at " + inputVal.length + " characters, calculating it would cause a huge amount of both CPU and RAM usage; You can change this limit in the JavaScript code, if you wish; ");
            return;
        }
        emptyOutput();
        addOutput("Encode failed; ");
        previousLetter = 0;
        for (var currentLetter = 0; currentLetter < inputVal.length; currentLetter++) {
            var letterArray = findAllInArray(inputVal.charAt(currentLetter));
            addOutput(letterArray[0] + "; ");
            if (currentLetter > 0) {
                encodedOutput += stringNumToLet(letterArray[gNum(letterArray)]);
            } else {
                encodedOutput = stringNumToLet(letterArray[gNum(letterArray)]);
            }
            previousLetter = inputVal.charAt(currentLetter);
        }
        emptyOutput();
        if (encodedOutput !== null) {
            setInput(encodedOutput);
        } else {
            addOutput("Error: No input; ");
        }
    };


// Run section
    $("#decode").click(function () { // Makes the button do stuff when it's clicked
        emptyOutput();
        addOutput("Error: No input; "); // This error placement is ugly but effective
        decodeInput(); // Decodes the input
    });

    $("#encode").click(function () { // This time for encoding
        emptyOutput();

        encodeInput(); // Encodes the input
    });

    $("#recode").click(function () { // This time for recoding
        emptyOutput();

        stringToOpposite(inputVal); // Recodes the input
    });

    addOutput("Use a button. ");
};