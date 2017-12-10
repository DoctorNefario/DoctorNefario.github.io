const alphabet = "abcdefghijklmnopqrstuvwxyz";
let timesToIterate = 6;

let alphaGet, alphaStart, alphaDownload, alphaAppend;

let alphabeastCurrentData = [];

function transformRandom(strToTransform) {
    const chosenLetter = alphabet.charAt(Math.floor(Math.random() * alphabet.length));
    const chosenPosition = Math.floor(Math.random() * strToTransform.length);
    const sliceOne = strToTransform.slice(0, chosenPosition);
    const sliceTwo = strToTransform.slice(chosenPosition + 1, strToTransform.length);

    return {
        returnString: sliceOne + chosenLetter + sliceTwo,
        changedPosition: chosenPosition,
        chosenLetter: chosenLetter
    };
}

function underlineLetter(strToUnderline, underlinePoint) {
    const sliceOne = strToUnderline.slice(0, underlinePoint);
    const sliceTwo = strToUnderline.slice(underlinePoint, underlinePoint + 1);
    const sliceThree = strToUnderline.slice(underlinePoint + 1, strToUnderline.length);
    return sliceOne + "<a class='alpha-changed'>" + sliceTwo + "</a>" + sliceThree;
}

function generateStringsFor(value) {
    let genReturnArray = [];
    for (let i = 0; i < timesToIterate; i++) {
        const randomTransform = transformRandom(value);
        genReturnArray.push(randomTransform);
    }
    return genReturnArray;
}

function startFunction() {
    const currentInputVal = alphaGet.val();
    if (currentInputVal.length > 0) {
        alphaStart.hide();
        alphaStart.empty().append("Regenerate");
        alphaDownload.show();

        const generatedStrings = generateStringsFor(currentInputVal);
        for (let e = 0; e < generatedStrings.length; e++) {
            const alphaE = $("#alpha" + e);
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
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}

function generateDownloadData(arrayToDownload) {
    let generatedText = "Alphabeast program";
    for (let i = 0; i < arrayToDownload.length; i++) {
        const curArrPos = arrayToDownload[i];
        generatedText += "\n\n[Iteration " + (i + 1) + "]";
        generatedText += "\nStarting word: " + curArrPos.startWord;
        generatedText += "\nGenerated words:";
        for (let e = 0; e < curArrPos.generatedStrings.length; e++) {
            const genStringsPos = curArrPos.generatedStrings[e];
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

    for (let i = 0; i < timesToIterate; i++) {
        $("#alphabeast").append("<p class='alpha-append-container'><a class='alpha-append' id='alpha" + i + "' href='#'></a></p>");
    }

    alphaAppend = $(".alpha-append");

    alphaStart.click(function () {
        alphabeastCurrentData = [];
        startFunction();
    });

    alphaAppend.click(function () {
        const thisJQuery = $(this);
        const thisVal = thisJQuery.text();

        const currentPos = alphabeastCurrentData.length - 1;

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