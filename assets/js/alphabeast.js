const alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
let alphaInput, alphaOutput, alphaStartButton;
let alphaCurString;

let alphaItems = 6;
let alphaElems = [];

function replaceString(string, index, replacement) {
    return string.substr(0, index) + replacement + string.substr(index + replacement.length);
}

function removeChar(string, index) {
    return string.substr(0, index) + string.substr(index + 1);
}

function updateAlphaElems() {
    let i;
    if (alphaElems.length > alphaItems) {
        for (i = alphaElems.length - 1; alphaItems <= i; --i) alphaElems.pop().remove();
    } else {
        for (i = alphaElems.length; i < alphaItems; ++i) {
            let liElem = document.createElement("li");
            liElem.onclick = function () {
                alphaInput.value = this.innerText;
                alphabeast();
            };
            liElem.className += " alpha-li";
            alphaElems.push(liElem);
            alphaOutput.appendChild(liElem);
        }
    }
}

// Perhaps someday I should make duplicate removal work with multiple different change indices
function getRandomStrings(fromString) {
    const stringLength = fromString.length;
    let stringArray = [fromString];
    let i;
    for (i = 0; i < alphaItems; ++i) {
        const changeIndex = Math.floor(Math.random() * stringLength);
        let tempAlphabet = alphabet;
        let letterIndex = Math.floor(Math.random() * tempAlphabet.length);
        let string = replaceString(fromString, changeIndex, tempAlphabet[letterIndex]);
        // Never have duplicate strings
        while (stringArray.indexOf(string) > -1 && tempAlphabet.length > 0) {
            tempAlphabet = removeChar(tempAlphabet, letterIndex);
            letterIndex = Math.floor(Math.random() * tempAlphabet.length);
            string = replaceString(fromString, changeIndex, tempAlphabet[letterIndex]);
        }
        if (tempAlphabet.length > 0) {
            stringArray.push(string);
        }
    }

    // Shift to get rid of fromString
    stringArray.shift();
    return stringArray;
}

function alphabeast() {
    alphaCurString = alphaInput.value;
    updateAlphaElems();
    let stringArray = getRandomStrings(alphaCurString);
    let i = 0;
    alphaElems.forEach(function (elem) {
        elem.innerHTML = stringArray[i];
        ++i;
    });
}

function alphaStart() {
    console.log("Alphabeast started");

    alphaInput = document.getElementById("alpha-input");
    alphaOutput = document.getElementById("alpha-output");
    alphaStartButton = document.getElementById("alpha-start-button");

    alphaStartButton.onclick = alphabeast;
}

window.addEventListener("load", alphaStart, true);