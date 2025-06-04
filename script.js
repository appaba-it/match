const questions = [
  {
    image: "img/mela.jpg",
    options: [
      { src: "img/mela.jpg", correct: true },
      { src: "img/banana.jpg", correct: false }
    ]
  },
  {
    image: "img/uva.jpg",
    options: [
      { src: "img/pesca.jpg", correct: false },
      { src: "img/uva.jpg", correct: true }
    ]
  },
  // Aggiungi altre domande se vuoi
];

let currentQuestion = 0;
let correctAnswers = 0;

function loadQuestion() {
  const q = questions[currentQuestion];
  const imageName = q.image.split('/').pop().split('.')[0]; // estrae "mela"

  document.getElementById("title").textContent = `${imageName.toUpperCase()}`;
  document.getElementById("question-image").src = q.image;
  document.getElementById("question-image").style.display = "block";

  const optionsContainer = document.getElementById("options");
  optionsContainer.innerHTML = "";

  const shuffled = q.options.sort(() => 0.5 - Math.random());

  shuffled.forEach(option => {
    const img = document.createElement("img");
    img.src = option.src;
    img.className = "option-img";
    img.setAttribute("draggable", "true");
    img.setAttribute("id", option.src.split('/').pop().split('.')[0]); // es. banana
    img.ondragstart = drag;

    // Al passaggio del mouse
    img.addEventListener("mouseenter", () => {
      autoDrop(img);
    });

    // Al tocco su mobile
    img.addEventListener("touchstart", () => {
      autoDrop(img);
    });

    optionsContainer.appendChild(img);
  });

  document.getElementById("feedback").textContent = "";
}

function autoDrop(imgElement) {
  const dropZone = document.getElementById("drop-zone");

  // Evita più selezioni
  if (dropZone.querySelector("img")) return;

  const draggedId = imgElement.id;
  const q = questions[currentQuestion];
  const draggedImg = q.options.find(opt => opt.src.includes(draggedId));

  dropZone.innerHTML = "";

  const img = document.createElement("img");
  img.src = draggedImg.src;
  img.className = "correct-answer";
  dropZone.appendChild(img);

  if (draggedImg && draggedImg.correct) {
    dropZone.classList.add("correct-drop");
    document.getElementById("feedback").innerText = "Bravo! Hai scelto l'immagine corretta.";
    correctAnswers++;
    new Audio("correct.mp3").play();
  } else {
    document.getElementById("feedback").innerText = "Ops! Riprova.";
    new Audio("wrong.mp3").play();
  }

  const optionImgs = document.querySelectorAll(".option-img");
  optionImgs.forEach(img => img.setAttribute("draggable", "false"));

  setTimeout(() => {
    dropZone.classList.remove("correct-drop");
    dropZone.innerHTML = "Trascina qui la risposta";
    currentQuestion++;
    if (currentQuestion < questions.length) {
      loadQuestion();
    } else {
      showFinalScore();
    }
  }, 1500);
}

function showFinalScore() {
  document.getElementById("options").innerHTML = "";
  document.getElementById("title").style.display = "none";
  document.getElementById("question-image").style.display = "none";
  document.getElementById("feedback").innerHTML = `
    <h2>Quiz completato! 🎉</h2>
    <p>Risposte corrette: ${correctAnswers} su ${questions.length}</p>
    <button id="restart-btn">Ricomincia 🔄</button>
  `;

  document.getElementById("restart-btn").onclick = restartQuiz;
}

function restartQuiz() {
  currentQuestion = 0;
  correctAnswers = 0;
  loadQuestion();
}

// Funzioni drag & drop standard (se vuoi ancora supportare anche trascinamento classico)

function allowDrop(ev) {
  ev.preventDefault();
}

function drag(ev) {
  ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev) {
  ev.preventDefault();
  const draggedId = ev.dataTransfer.getData("text");
  const dropZone = document.getElementById("drop-zone");

  const q = questions[currentQuestion];
  const draggedImg = q.options.find(opt => opt.src.includes(draggedId));

  dropZone.innerHTML = "";

  const img = document.createElement("img");
  img.src = draggedImg.src;
  img.className = "correct-answer";
  dropZone.appendChild(img);

  if (draggedImg && draggedImg.correct) {
    dropZone.classList.add("correct-drop");
    document.getElementById("feedback").innerText = "Bravo! Hai scelto l'immagine corretta.";
    correctAnswers++;
    new Audio("correct.mp3").play();
  } else {
    document.getElementById("feedback").innerText = "Ops! Riprova.";
    new Audio("wrong.mp3").play();
  }

  const optionImgs = document.querySelectorAll(".option-img");
  optionImgs.forEach(img => img.setAttribute("draggable", "false"));

  setTimeout(() => {
    dropZone.classList.remove("correct-drop");
    dropZone.innerHTML = "Trascina qui la risposta";
    currentQuestion++;
    if (currentQuestion < questions.length) {
      loadQuestion();
    } else {
      showFinalScore();
    }
  }, 1500);
}

// Avvio iniziale
loadQuestion();
