const playButton = document.getElementById("play-button");
if (playButton) {
  playButton.addEventListener("click", function () {
    const templates = ["flappy.html", "pong.html", "snake-controls.html"];
    const randomTemplate = templates[Math.floor(Math.random() * templates.length)];
    window.location.href = randomTemplate;
  });
}