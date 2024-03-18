function removeTransition(e) {
    if (e.propertyName !== 'transform') return; // Skip if it's not transform
    this.classList.remove('playing');
}

function playAudio(e) {
    let keyCode;
    
    if (typeof e === 'string') {
        // If e is a number, assume it's a keyCode
        keyCode = e;
    } else if (typeof e === 'object' && e.type === 'keydown') {
        // If e is an object and the type is keydown, get keyCode from event object
        keyCode = e.keyCode;
    } else {
        // If e is neither a number nor a keydown event, do nothing
        return;
    }

    const audio = document.querySelector('audio[data-key="' + keyCode + '"]');
    const key = document.querySelector('.key[data-key="' + keyCode + '"]');
    if (!audio) return; // stop function if no audio
    audio.currentTime = 0;
    
    //visualize(audio)
    audio.play();


    if (!key) {
        return;
    }

    key.classList.add('playing');

    const keys = document.querySelectorAll('.key');  // Returns NodeList containing all matching elements.
    keys.forEach(key => key.addEventListener('transitionend', removeTransition));
}

// Get all div elements with the class "clickableDiv"
var divs = document.querySelectorAll(".key");

// Loop through each div and attach a click event listener
divs.forEach(function(div) {
div.addEventListener("click", function() {
    // Get the value of the data-key attribute
    var dataKey = this.dataset.key;
    //console.log("Data key of the clicked div: " + dataKey);
    playAudio(dataKey);
    });
});


window.addEventListener('keydown', function(e) {
    playAudio(e);
})