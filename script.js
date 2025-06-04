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
  // ... (tutte le altre domande come prima)
];

let currentQuestion = 0;
let correctAnswers = 0;

function loadQuestion() {
  const q = questions[currentQuestion];
  const imageName = q.image.split('/').pop().split('.')[0]; // estrae il nome

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
    img.onclick = () => handleAnswer(option.correct);
    img.ondragstart = drag;
    optionsContainer.appendChild(img);
  });

  document.getElementById("feedback").textContent = "";
}

function handleAnswer(isCorrect) {
  const feedback = document.getElementById("feedback");
  feedback.textContent = isCorrect ? "Brava! 👏" : "Ops! ❌";

  if (isCorrect) {
    correctAnswers++;
    const correctSound = new Audio("correct.mp3");
    correctSound.play();
  } else {
    const wrongSound = new Audio("wrong.mp3");
    wrongSound.play();
  }

  setTimeout(() => {
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

// Funzioni drag & drop

function allowDrop(ev) {
  ev.preventDefault();
}

function drag(ev) {
  ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev) {
  ev.preventDefault();
  const draggedId = ev.dataTransfer.getData("text"); // es. "banana"
  const dropZone = document.getElementById("drop-zone");

  const q = questions[currentQuestion];
  const draggedImg = q.options.find(opt => opt.src.includes(draggedId));

  dropZone.innerHTML = ""; // Pulisce la drop-zone

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

  // Blocca ulteriori azioni fino alla prossima domanda
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

// Avvio quiz
loadQuestion();