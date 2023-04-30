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