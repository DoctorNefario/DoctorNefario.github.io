var alphabet = "abcdefghijklmnopqrstuvwxyz";
var timesToIterate = 6;

var alphaGet;
var alphaStart;
var alphaDownload;
var alphaAppend;

var alphabeastCurrentData = [];

function transformRandom(strToTransform) {
    var chosenLetter = alphabet.charAt(Math.floor(Math.random() * alphabet.length));
    var chosenPosition = Math.floor(Math.random() * strToTransform.length);
    var sliceOne = strToTransform.slice(0, chosenPosition);
    var sliceTwo = strToTransform.slice(chosenPosition + 1, strToTransform.length);

    return {
        returnString: sliceOne + chosenLetter + sliceTwo,
        changedPosition: chosenPosition,
        chosenLetter: chosenLetter
    };
}

function underlineLetter(strToUnderline, underlinePoint) {
    var sliceOne = strToUnderline.slice(0, underlinePoint);
    var sliceTwo = strToUnderline.slice(underlinePoint, underlinePoint + 1);
    var sliceThree = strToUnderline.slice(underlinePoint + 1, strToUnderline.length);
    return sliceOne + "<a class='alpha-changed'>" + sliceTwo + "</a>" + sliceThree;
}

function generateStringsFor(value) {
    var genReturnArray = [];
    for (var i = 0; i < timesToIterate; i++) {
        var randomTransform = transformRandom(value);
        genReturnArray.push(randomTransform);
    }
    return genReturnArray;
}

function startFunction() {
    var currentInputVal = alphaGet.val();
    if (currentInputVal.length > 0) {
        alphaStart.hide();
        alphaStart.empty().append("Regenerate");
        alphaDownload.show();

        var generatedStrings = generateStringsFor(currentInputVal);
        for (var e = 0; e < generatedStrings.length; e++) {
            var alphaE = $("#alpha" + e);
            alphaE.empty();
            alphaE.append(underlineLetter(generatedStrings[e].returnString, generatedStrings[e].changedPosition));
        }
        alphabeastCurrentData.push({
            startWord: currentInputVal,
            generatedStrings: generatedStrings
        });
    }
}

// Stole this from the internet
function download(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}

function generateDownloadData(arrayToDownload) {
    var generatedText = "Alphabeast program";
    for (var i = 0; i < arrayToDownload.length; i++) {
        var curArrPos = arrayToDownload[i];
        generatedText += "\n\n[Iteration " + (i + 1) + "]";
        generatedText += "\nStarting word: " + curArrPos.startWord;
        generatedText += "\nGenerated words:";
        for (var e = 0; e < curArrPos.generatedStrings.length; e++) {
            var genStringsPos = curArrPos.generatedStrings[e];
            generatedText += "\n----";
            generatedText += "\n> Resulting word " + (e + 1) + ": " + genStringsPos.returnString;
            generatedText += "\n  > Changed position: " + (genStringsPos.changedPosition + 1);
            generatedText += "\n  > Letter changed to: " + genStringsPos.chosenLetter;
        }
        if (curArrPos.chosen !== undefined) {
            generatedText += "\nChosen word: " + curArrPos.chosen;
        }
    }
    download("alphabeast.txt", generatedText);
}

window.onload = function () {
    alphaGet = $("#alpha-get");
    alphaStart = $("#alpha-start");
    alphaDownload = $("#alpha-download");

    alphaDownload.hide();
    alphaDownload.removeClass("hide-at-start");

    for (var i = 0; i < timesToIterate; i++) {
        $("#alphabeast").append("<p class='alpha-append-container'><a class='alpha-append' id='alpha" + i + "' href='#'></a></p>");
    }

    alphaAppend = $(".alpha-append");

    alphaStart.click(function () {
        alphabeastCurrentData = [];
        startFunction();
    });

    alphaAppend.click(function () {
        var thisJQuery = $(this);
        var thisVal = thisJQuery.text();

        var currentPos = alphabeastCurrentData.length - 1;

        alphabeastCurrentData[currentPos].chosen = thisVal;

        alphaGet.val(thisVal);
        startFunction();
    });

    alphaDownload.click(function () {
        generateDownloadData(alphabeastCurrentData);
    });

    alphaGet.on("input", function () {
        if (alphabeastCurrentData.length > 0) {
            alphaStart.show();
        }
    });
};