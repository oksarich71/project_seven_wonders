const GameGridView = require("./game_grid_view.js");
const PubSub = require("../helpers/pub_sub.js");
const ResultView = require("./result_view.js");

const GameView = function(container){
  this.container = container;
  this.resultView = new ResultView(this.container)
}


GameView.prototype.render = function (questionAndAnswer) {
  console.log(questionAndAnswer);
  const questionContainer = document.createElement('div');
  questionContainer.id = "question";
  questionContainer.textContent = questionAndAnswer.qAndA.question;

  this.container.appendChild(questionContainer);


  const answersContainer = document.createElement("div");
  answersContainer.className = "answers";

  this.container.appendChild(answersContainer)

  const pointsAndLives = document.createElement('ul');
  pointsAndLives.id = "points-and-lives"

  const numberOfLives = document.createElement('li');
  numberOfLives.textContent = `Lives: ${this.resultView.lives}`;
  numberOfLives.id = "lives"

  const points = document.createElement('li');
  points.textContent = `Points: ${this.resultView.points}`
  points.id = "points"


  pointsAndLives.appendChild(numberOfLives);
  pointsAndLives.appendChild(points);
  this.container.appendChild(pointsAndLives)

  const answer1Container = this.createElementAnswer(answersContainer, questionAndAnswer, "answer1")
  const answer2Container = this.createElementAnswer(answersContainer, questionAndAnswer, "answer2")
  const answer3Container = this.createElementAnswer(answersContainer, questionAndAnswer, "answer3")
  const answer4Container = this.createElementAnswer(answersContainer, questionAndAnswer, "answer4")

  answerArray = [answer1Container, answer2Container, answer3Container, answer4Container]

  const self = this;

  answersContainer.addEventListener('click', function _listen(event) {
    self.checkIfAnswerCorrect(event.target, answerArray, numberOfLives, points);
    answersContainer.removeEventListener('click',  _listen);
  });

};

GameView.prototype.checkIfAnswerCorrect = function (selectedAnswer, answerArray, numberOfLives, points) {
  if (selectedAnswer.value == true) {
    selectedAnswer.classList = "green";
      if (this.resultView.counter === 9){
        const tenQuestion = document.createElement('p');
        tenQuestion.textContent = "Well done 10 correct questions in a row. You get 100 points!!!"
        this.container.appendChild(tenQuestion);
      }
    this.resultView.addPoints();
    // this.resultView.addOneLife();
    numberOfLives.textContent = `Lives: ${this.resultView.lives}`;
    points.textContent = `Points: ${this.resultView.points}`
  } else {
    selectedAnswer.classList = "red"
    correctAnswer = answerArray.find(answer => answer.value == true)
    correctAnswer.classList = "green"
    this.resultView.removeOneLife();
    numberOfLives.textContent = `Lives: ${this.resultView.lives}`;
    points.textContent = `Points: ${this.resultView.points}`
  }
    this.createButtons(numberOfLives)
};

GameView.prototype.createButtons = function (numberOfLives) {
  const buttonContainer = document.createElement('div');
  buttonContainer.id = "button-container"

  const buttonNext = document.createElement('button');
  buttonNext.textContent = "Next question";

  buttonContainer.appendChild(buttonNext);

  if (this.resultView.lives === 0 ) {
    this.container.removeChild(buttonNext);
    numberOfLives.textContent = `Lives: ${this.resultView.lives}`;
  }

  buttonNext.addEventListener('click', (event) => {
    PubSub.publish("GameView:New-question", event.target)
    });

  const buttonEnd = document.createElement('button');
  buttonEnd.textContent = "End game";

  buttonContainer.appendChild(buttonEnd);

  this.container.appendChild(buttonContainer)

  buttonEnd.addEventListener('click', (event) => {
    this.container.innerHTML = "";
    this.resultView.render();

  });
};


GameView.prototype.createElementAnswer = function (answersContainer, questionAndAnswer, id) {
  const answerContainer = document.createElement("div");
  answerContainer.className = `${id}`;

  answerContainer.value = questionAndAnswer.qAndA[id].status;
  answerContainer.textContent = questionAndAnswer.qAndA[id].content;

  answersContainer.appendChild(answerContainer)

  return answerContainer;
};

module.exports = GameView;
