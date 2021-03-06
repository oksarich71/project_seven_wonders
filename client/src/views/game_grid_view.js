const PubSub = require('../helpers/pub_sub.js');
const GameView = require('./game_view.js');
const Game = require('../models/game.js');
const ResultView = require('./result_view.js');

const GameGridView = function (container) {
  this.container = container;
  this.gameView = new GameView(this.container);
  this.resultView = new ResultView(this.container);
  this.game = new Game();
  this.questions = [];
}

GameGridView.prototype.bindEvents = function () {
  PubSub.subscribe('Game:question-answer-loaded', (event) => {
    this.questions = event.detail
    // this.questions = event.detail.splice(0, 2)
    this.container.innerHTML = "";
    let individualQuestion = this.questions[Math.floor(Math.random()*this.questions.length)];
    questions = this.questions.filter(question => question !== individualQuestion)
    this.questions = questions
    this.gameView.render(individualQuestion);
  });
  PubSub.subscribe("GameView:New-question", (event) => {
    this.container.innerHTML = "";
    if (this.questions.length === 0) {
      this.resultView.endOfGame();
      return
    }
    let individualQuestion = this.questions[Math.floor(Math.random()*this.questions.length)];
    questions = this.questions.filter(question => question !== individualQuestion)
    this.questions = questions
    this.gameView.render(individualQuestion);
  });

  PubSub.subscribe('ResultView:Play-again', (event) => {
    this.game.getData();
  })

};

module.exports = GameGridView;
