var form = document.getElementById("form");
const levelsInput = document.getElementById('levels');
const levelsDisplay = document.getElementById('levels-display');

// Update the levels display when the slider value changes
levelsInput.addEventListener('input', () => {
    levelsDisplay.textContent = levelsInput.value;
});

const createBtn = document.getElementById('submit-button');
createBtn.addEventListener('click', () => {
    console.log("clicked");
});

async function createGame(user, roomId, specs) {
    // remove friend from follow list and hide thier messages from the chat
    var payload = {
        "user": userToBlock,
        "specs": roomId,
        "currentUser": currentUser
    };
    postData("http://localhost:" + portnum + "/createGame", payload).then((data) => {
        //console.log(data);
    });
}

async function postData(url = "", data = {}) {
    // Default options are marked with *
    const response = await fetch(url, {
        method: "POST", // *GET, POST, PUT, DELETE, etc.
        mode: "cors", // no-cors, *cors, same-origin
        cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        credentials: "same-origin", // include, *same-origin, omit
        headers: {
            "Content-Type": "application/json"
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: "follow", // manual, *follow, error
        referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: JSON.stringify(data) // body data type must match "Content-Type" header
    });
    console.log("Posted data: ", data);
    return response.json(); // parses JSON response into native JavaScript objects
}



// Add event listener for submit button
const submitButton = document.getElementById('submit-button');
submitButton.addEventListener('click', (e) => {
    preventDefault(e);
    var form = document.getElementById('form');

    const data = {
        // Add any data you want to send with the 'submit' event
        "gameId": form.querySelector("game-id").value,
        "username": form.querySelector("username").value,
        "language": form.querySelector("game-id").value,
        "level": form.querySelector("level").value,
        "time": form.querySelector("time").value,
    };

    // Emit the 'submit' event to the server
    socket.emit('submit', data);

    canvas.hidden = false;
    form.hidden = true;

});