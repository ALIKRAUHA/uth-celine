class Card {
  /** index: 1 for AS 
   *  13 for king
   */
  constructor(color, index) {
    this.color = color;
    this.index = index;
    this.name = Card.convertIndex(index) + "de " + this.color;
    this.image = "assets/img/cards/" + this.color + "/" + index + ".jpg";
  }

  static convertIndex(index) {
    switch (index) {
      case 1: 
      case 14:
        return "As "; break;
      case 2: 
      case 3:
      case 4:
      case 5:
      case 6:
      case 7:
      case 8:
      case 9:
      case 10:
      return index +" "; break;
      case 11: return "Valet " ; break;
      case 12: return "Dame "; break;
      case 13: return "Roi "; break;
    }

  }
}

class Player {
  constructor(fric, cards, mise, bonus, play) {
    this.fric = fric;
    this.cards = cards;
    if (mise) {
      this.mise = mise;
    } else {
      this.mise = Game.random(1, 20) * 5;
    }
    if (bonus) {
      this.bonus = bonus;
    } else {
      this.bonus = Game.random(1, 20) * 5;
    }
    this.blind = this.mise;
    if (play) {
      this.play = play;
    } else {
      this.play = Game.random(1, 4) * this.mise;
    }   
  }

  
  sortWithAsAs14() {
    this.cards = this.cards.sort((a,b) => {
      if (a.index === 1) {
        a.index = 14;
      }
      if (b.index === 1) {
        b.index = 14;
      }
      if (a.index > b.index) {
        return -1;
      } else if (a.index < b.index) {
        return 1;
      } else {
        return 0;
      }
    })    
  }
}

class Payment {
  constructor(value, type, removeAll) {
    this.value = value;
    this.type = type;
    this.removeAll = removeAll;
  }

  stringify() {
    if (this.removeAll) {
      return "Vous avez ramassé ";
    } else {
      if (this.value === 0) {
        return "Vous n'avez rien fait";
      }
      return "Vous avez payé " + this.value;
    }
  }

  isNotGet() {
    if (this.removeAll) {
      return false;
    } else {
      return true;
    }
  }
}

class Payments {
  values = [];
  push(value) {
    const find = this.values.findIndex((valueAlreadyExisting) => {
      return valueAlreadyExisting.type === value.type;
    })
    if (find === -1) {
      this.values.push(value);
    } else {
      this.values.splice(find, 1);
      this.values.push(value);
    }
  }

  getAllNotBonus() {
    return this.values.filter((value) => {
      return value.type !== "bonus";
    });

  }

  getType(type) {
    return this.values.filter((value) => {
      return value.type === type;
    })[0];
  }

  getBonus() {
    return this.values.filter((value) => {
      return value.type === "bonus";
    });
  }
}

class Board {
  constructor(cardsNotSelected, numberOfPlayers) {
    if (!numberOfPlayers) {
      numberOfPlayers = Game.random(1,7);
    }
    this.players = [];
    for (let i = 0; i!= numberOfPlayers; i++) {
      this.players.push(new Player(10000, [Game.selectRandomCard(cardsNotSelected), Game.selectRandomCard(cardsNotSelected)]));
    }
    this.cards = [Game.selectRandomCard(cardsNotSelected), Game.selectRandomCard(cardsNotSelected), Game.selectRandomCard(cardsNotSelected), Game.selectRandomCard(cardsNotSelected), Game.selectRandomCard(cardsNotSelected)]
    this.banck = new Player(0, [Game.selectRandomCard(cardsNotSelected), Game.selectRandomCard(cardsNotSelected)]);
    this.players.unshift(this.banck);
  }

  remakeGame(index) {
    const asString = localStorage.getItem('saved');
    console.log(asString)
    const array = JSON.parse(asString);
    console.log("before", JSON.parse(JSON.stringify(this.players)))
    const playersObjects = array[index].players;
    const players = [];
    playersObjects.forEach((player) => {
      players.push(new Player(player.fric, player.cards, player.mise, player.bonus, player.play))
    })
    this.players = players;
    this.cards = array[index].cards;
    this.banck = array[index].banck;
  }
}

class PayOrGet {

  createInputNodes() {
    const br = document.createElement("br");
    this.labelInputValue = document.createElement("label");
    this.labelInputValue.for = this.id + "-payvalue";
    this.labelInputValue.id = this.id+ "-payvalue";
    this.labelInputValue.textContent = this.labelInputValueText;
    this.divContainer.appendChild(br);
    this.divContainer.appendChild(this.labelInputValue);    
    this.inputNumber = document.createElement("input");
    this.inputNumber.type = "number";
    this.inputNumber.id = this.id + "-payvalue";
    this.inputNumber.name = this.inputNumber.id;
    this.divContainer.appendChild(br.cloneNode());
    this.divContainer.appendChild(this.inputNumber);
  }

  addInputNodes() {
    this.labelInputValue.style.display = "inline-block";
    this.inputNumber.style.display = "block";
  }

  removeInputNodes() {
    this.labelInputValue.style.display = "none";
    this.inputNumber.style.display = "none";
  }

  getValue() {
    if (this.checkbox.checked) {
      return new Payment(0, this.type, true);
    } else {
      console.log(this.inputNumber.value, 'value')
      if (this.inputNumber.value != '') {
        return new Payment(this.inputNumber.value, this.type, false);
      } else {
        return new Payment(0, this.type, false);
      }
    }
  }

  constructor(id, labelCheckboxText, labelInputValueText, type) {
    this.id = id;
    this.type = type;
    this.labelInputValueText = labelInputValueText;
    this.divContainer = document.getElementById(id);
    while (this.divContainer.firstChild) {
      this.divContainer.removeChild(this.divContainer.firstChild);
    }
    this.checkbox = document.createElement("input");
    this.checkbox.type = "checkbox";
    this.checkbox.id = id + "-checkbox";
    this.checkbox.name = this.checkbox.id;
    this.divContainer.appendChild( this.checkbox);
    const labelCheckbox = document.createElement("label");
    labelCheckbox.for =  this.checkbox.id;
    labelCheckbox.textContent = labelCheckboxText;
    this.divContainer.appendChild(labelCheckbox);
    this.createInputNodes();

    
    this.checkbox.addEventListener("change", (ev) => {
      if (ev.target.checked) {
        this.removeInputNodes();
      } else {
        this.addInputNodes();
      }
    })
  }
}

class Game {
  allCards = [];
  colors = ["coeur", "pique", "trefle", "carreau"];
  constructor(revealButton, revealText, zoom) {
    this.colors.forEach((color) => {
      for (let i = 1; i!= 14; i++) {
        this.allCards.push(new Card(color, i));
      }
    });
    this.revealButton = revealButton;
    this.revealText = revealText;
    this.zoom = zoom;
    this.payModal = document.getElementById("pay-modal");
    this.blindMise = document.getElementById('blind-mise');
    this.paymentsTurn = new Payments();
    this.playerIndex = 0;
    document.getElementById("pay-button").addEventListener("click", (ev)=> {
      console.log('next from pay-button')
      this.next();
    })
    document.getElementById("validation").addEventListener("click", (ev) => {
      this.validatePay(this.playerIndex);
    })
    document.getElementById("continue").addEventListener("click", (ev) => {
      this.next();
    })
    document.getElementById("replay-last-game").addEventListener("click", (ev) => {
      window.location = window.location + '?replay=0'
    });
    document.getElementById("save-game").addEventListener("click", (ev) => {
      const arrayString = localStorage.getItem('saved');
      var array = [];
      console.log(arrayString)
      if (arrayString) {
        const arrayObject = JSON.parse(arrayString);
        array = arrayObject;
      }
      array.unshift({
        players: this.board.players,
        cards: this.board.cards,
        banck: this.banck
      })
      localStorage.setItem('saved', JSON.stringify(array));
    })
  }

  static random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  static selectRandomCard(cardsNotSelected) {
    const rand = Game.random(0, cardsNotSelected.length - 1);
    const card = cardsNotSelected.splice(rand, 1);
    return card[0];
  }

  useAndTest(cardsToUse, testName) {
    const cards = [];
    cardsToUse.forEach((cardName) => {
      const find = this.allCards.find((card) => {
        return card.name === cardName;
      })
      if (find) {
        cards.push(find);
      }
    })
    if (testName === "testFull") {
      console.log("return value", Game.testFull(cards));
    }
  }

  testWithName(testName, cards) {
    let returnValue;
    if(testName === "royalFlush") {
      returnValue =  Game.testRoyalFlush(cards);
    } else if (testName === "straightFlush") {
      returnValue = Game.testStraightFlush(cards)
    } else if (testName === "FourOfAKind") {
      returnValue = Game.testFourOfAKind(cards);
    } else if (testName === "full") {
      returnValue =  Game.testFull(cards);
    } else if (testName === "flush") {
      returnValue = Game.testFlush(cards);
    } else if (testName === "straight") {
      returnValue = Game.testStraight(cards);
    } else if (testName === "threeOfAKind") {
      returnValue = Game.testThreeOfAKind(cards);
    } else if (testName === "pair") {
      const pairs = Game.testPair(cards);
      if (pairs) {
        if (pairs.length ===1) {
          return "Paire de " + Card.convertIndex(pairs[0][0].index)
        } else {
          return "Double paire de " + Card.convertIndex(pairs[0][0].index) + " et "+ Card.convertIndex(pairs[1][0].index)
        }
      }
    }
    return returnValue ? returnValue[0]: false
  }

  reboot(numberOfPlayers, indexToPlay) {
    var cardsNotSelected = [...this.allCards];
    this.board = new Board(cardsNotSelected, numberOfPlayers);
    if (indexToPlay !== undefined) {
      this.board.remakeGame(indexToPlay);
    }
    console.log(this.board, 'board', indexToPlay)
    this.revealButton.textContent = "Révéler";
    this.revealText.textContent = "Cliquez sur révéler";
    for (var i = this.board.players.length; i!== 8; i++) {
      for(var j = 1; j!== 3; j++) {
        document.getElementById("player-" + i + "-card-" + j).style.backgroundColor = "rgb(0,133,98)";
        document.getElementById("player-" + i + "-card-" + j).style.backgroundImage = "none";
      }      
    }
    this.step = 0;
  }

  static testStraight(cardsToTest) {
    var cardsInverted = [...cardsToTest];
    let As = cardsInverted.filter((card) => {
      return card.index === 1;
    })
    As = [...As];
    As.forEach((as) => {
      as.index = 14;
    })
    cardsInverted.concat(As);
    cardsInverted.reverse();

    var indexBegin = cardsInverted[cardsInverted.length - 1].index;
    var numbers = 1;
    var cards= [];
    var finished = false;
    cards.push(cardsInverted[cardsInverted.length - 1]);

    cardsInverted.forEach((element, index) => {
      if (indexBegin - numbers === element.index) {
        numbers++;
        cards.push(element);
      } 
      else if (indexBegin - numbers + 1 === element.index) { 
        cards.push(element);
      } else {
        if (numbers >= 5 ) {
          finished = true;
        }
        if (!finished) {
          numbers = 1;
          cards = [];
          cards.push(element);
          indexBegin = element.index;
        }        
      }
      if (numbers>= 5) {
        finished = true;
      }
    });
    if (finished) {
      var textToReturn = "Suite de " + Card.convertIndex(cards[0].index) + " à " + Card.convertIndex(cards[cards.length - 1].index);
      return [textToReturn, cards];
    } else {
      return false;
    }
  }

  static testRoyalFlush(cardsToTest) {
    const straight =  Game.testStraight(cardsToTest);
    if (straight && straight[1][straight[1].length - 1].index === 10 && (straight[1][0].index === 14 || straight[1][0].index === 1)) {
      const flush = Game.testFlush(straight);
      if (flush) {
        var textToReturn = "Quinte flush Royal en " + flush[flush.length - 1].color;
        return [textToReturn, flush];
      }
      return false;
    } else {
      return false;
    }
  }

  static testStraightFlush(cardsToTest) {
    const straight =  Game.testStraight(cardsToTest);
    if (!straight) {
      return false;
    }
    var flush = Game.testFlush(straight);
    if (flush) {
      var textToReturn = "Quinte flush en " + flush[flush.length - 1].color;
      return [textToReturn, flush];
    } 
    return false;
  }

  static testFlush(cardsToTest) {
    ["coeur", "pique", "trefle", "carreau"];
    const coeur = cardsToTest.filter((card) => {
      return card.color === 'coeur';
    })
    const pique = cardsToTest.filter((card) => {
      return card.color === "pique";
    })
    const trefle = cardsToTest.filter((card) => {
      return card.color === "trefle";
    })
    const carreau = cardsToTest.filter((card) => {
      return card.color === "carreau";
    })
    if (coeur.length >=5) {
      return ["Couleur en coeur", coeur];
    } else if (pique.length >= 5) {
      return ["Couleur en pique", pique];
    } else if (trefle.length >= 5) {
      return ["Couleur en trefle", trefle];
    } else if (carreau.length >= 5) {
      return ["Couleur en carreau", carreau];
    }
    else {
      return false;
    }
  }

  static mapByIndex(cardsToTest) {
    const cards = [...cardsToTest]
    cards.reverse();
    const group = new Map();
    cards.forEach((value) => {
      var cards = group.get(value.index);
      if (!cards) {
        cards = [];
      }
      cards.push(value);
      group.set(value.index, cards);
    });
    const array = Array.from(group.values());
    const sorted = array.sort((a, b) => {
      if (a[0].index === 1) {
        return 1;
      }
      if (a.length < b.length) {
        return -1;
      } else if (a.length > b.length) {
        return 1;
      } else if (a.index < b.index) {
        return -1;
      } else if (a.index > b.index) {
        return 1;
      } else {
        return 0;
      }
    })
    return sorted;
  }

  static testFourOfAKind(cardsToTest) {
    const grouped = Game.mapByIndex(cardsToTest)
    if (grouped[0].length === 4) {
      return ["Carré de " + Card.convertIndex(grouped[0].index), grouped[0]];
    } return false;
  }

  static testThreeOfAKind(cardsToTest) {
    const grouped = Game.mapByIndex(cardsToTest)
    const filter = grouped.filter((group) => {
      return group.length === 3;
    })
    if (filter && filter.length > 0) {
      return ["Brelan de " + Card.convertIndex(filter[0][0].index), filter]
    } else {
      return false;
    }
  }

  static testPair(cardsToTest) {
    const grouped = Game.mapByIndex(cardsToTest);
    const filter = grouped.filter((group) => {
      return group.length === 2;
    })
    if (filter && filter.length > 0) {
      return filter
    } else {
      return false;
    }
  }

  static testFull(cardsToTest) {
    const brelan = Game.testThreeOfAKind(cardsToTest);
    const pairs = Game.testPair(cardsToTest);
    if (brelan && pairs || (brelan && brelan[1].length >= 2)) {
      if (brelan[1].length === 1) {
        return ["Full de " + Card.convertIndex(brelan[1][0][0].index) + " à " +  Card.convertIndex(pairs[0][0].index), [brelan[1][0], pairs[0]]]
      } else {
        var secondPart;
        if (!pairs) {
          secondPart = brelan[1][1];
        } else {
          secondPart = brelan[1][1][0].index > pairs[0][0].index ? brelan[1][1]: pairs[0];
        }
        console.log(brelan, pairs)
        return ["Full de " + Card.convertIndex(brelan[1][0][0].index) + " à " +  Card.convertIndex(secondPart[0].index), [brelan[1][0], secondPart]]
      }
    } else {
      return 0;
    }
  }

  calculateValue(playerIndex) {
    var cardsToTest = [...this.board.cards];
    cardsToTest = cardsToTest.concat(this.board.players[playerIndex].cards);
    cardsToTest.sort((a, b) => {
      if (a.index < b.index) {
        return -1;
      }else if (a.index > b.index) {
        return 1;
      }
      return 0;
    });


    //Royal flush
    const royalFlush = Game.testRoyalFlush(cardsToTest);
    if (royalFlush) {
      return [royalFlush[0], 1, royalFlush]
    }

    //straight flush
    const straightFlush = Game.testStraightFlush(cardsToTest)
    if (straightFlush) {
      return [straightFlush[0], 2, straightFlush]
    }
    //carre
    const carre = Game.testFourOfAKind(cardsToTest);
    if (carre) {
      return [carre[0], 3, carre];
    }

    //full
    const full = Game.testFull(cardsToTest);
    if (full) {
      return [full[0], 4, full];
    }

    //flush
    const flush = Game.testFlush(cardsToTest);
    if (flush) {
      return [flush[0], 5, flush];
    }

    //Straight
    const restraight = Game.testStraight(cardsToTest);
    if (restraight) {
      return [restraight[0], 6, restraight];
    }

    //brelan
    const brelan = Game.testThreeOfAKind(cardsToTest);
    if (brelan) {
      return [brelan[0], 7, brelan];
    }

    //pairs
    const pairs = Game.testPair(cardsToTest);
    if (pairs) {
      if (pairs.length ===1) {
        return ["Paire de " + Card.convertIndex(pairs[0][0].index), 9, pairs];
      } else {
        return ["Double paire de " + Card.convertIndex(pairs[0][0].index) + " et "+ Card.convertIndex(pairs[1][0].index), 8, pairs];
      }
    }

    return ["Carte haute", 10];
  }

  superiorToBank() {
    
  }

  revealBoard() {
    this.beginDate = new Date().getTime();
    this.revealButton.textContent = "Révéler";
    this.revealText.textContent = "Cliquez sur révéler";
    this.board.cards.forEach((value, index) => {
      document.getElementById("board-card-" + (index+1)).style.backgroundImage = "url('" + value.image + "')";
    });
  }

  revealValuePlayer(playerIndexToReveal) {
    const calc = this.calculateValue(playerIndexToReveal);

    if (playerIndexToReveal === 0) {
      this.bankValue = calc[1];
    }
    this.revealText.textContent = calc[0];
  }

  revealPlayer(playerIndex) {
    this.revealButton.textContent = "Révéler";
    const toZoom = [];
    const board = document.getElementById("board-container").cloneNode(true);
    const player = document.getElementById("player-" + playerIndex).cloneNode(true);
    board.id = board.id + "copy";
    player.id = player.id + "copy";
    toZoom.push(board);
    toZoom.push(player);
    const idList = new Map();
    Array.from(player.childNodes).forEach((element) => {
      element.id = element.id + "copy"
      idList.set(element.id, element);
    })
    this.board.players[playerIndex].cards.forEach((value, index) => {
      document.getElementById("player-" + playerIndex + "-card-" + (index+1)).style.backgroundImage = "url('" + value.image + "')";
      idList.get("player-" + playerIndex + "-card-" + (index+1)+"copy").style.backgroundImage = "url('" + value.image + "')";
    });
    if (playerIndex !== 0) {
      toZoom.reverse();
    } 
    zoom.zoomOn(toZoom);
    document.getElementById("reveal-button").style.display = "block";
  }

  addActionButtons(playerIndex) {
    this.paymentModalInit = new PayOrGet("blind-pay", "Ramasser la blinde", "Valeur à payer pour la blinde", "blind")
    this.paymentModalInitBonus= new PayOrGet("bonus-pay", "Ramasser le bonus", "Valeur à payer pour le bonus", "bonus")
    document.getElementById('mise-et-jouer').checked = false;
    document.getElementById("bonus").textContent = "Bonus : " + this.board.players[playerIndex].bonus;
    document.getElementById("miser").textContent = "Miser : " + this.board.players[playerIndex].mise;
    document.getElementById("jouer").textContent = "Jouer : " + this.board.players[playerIndex].play;
    this.blindMise.textContent = "Blinde : " + this.board.players[playerIndex].blind;
    this.pay(playerIndex)
  }

  finishVisualizePaymentResult() {
    const bonusResult = document.getElementById("bonus-result");
    const blindResult = document.getElementById('blind-result');
    const miserResult = document.getElementById('miser-result')
    while (bonusResult.firstChild) {
      bonusResult.removeChild(bonusResult.firstChild);
    }
    while (blindResult.firstChild) {
      blindResult.removeChild(blindResult.firstChild);
    }
    while (miserResult.firstChild) {
      miserResult.removeChild(miserResult.firstChild);
    }
    console.log("after remove bonus result")
    bonusResult.textContent = "Bonus: "
    blindResult.textContent = "Blinde: "
    miserResult.textContent = "Miser: "
    document.getElementById("vizualize-results").close();
    this.zoom.finishZoom();
    console.log('next from finishVisualizePaymentResult')
    this.next();
  }

  validatePay(playerIndex) {
    this.paymentsTurn.push(this.paymentModalInit.getValue());
    this.paymentsTurn.push(this.paymentModalInitBonus.getValue());
    if (document.getElementById("mise-et-jouer").checked) {
      this.paymentsTurn.push(new Payment(0, "mise", false))
    } else {
      if (document.getElementById("ramasser-mise-et-jouer").checked) {
        this.paymentsTurn.push(new Payment(this.board.players[this.playerIndex].mise, "mise", true))
      }
      else {
        this.paymentsTurn.push(new Payment(0, "mise", false))
      }
    }
    this.payModal.close();
    console.log(this.paymentsTurn, 'payments')
    this.verifyPayment(playerIndex);
    document.getElementById("vizualize-results").showModal();
  }

  printGoodResult(id, value) {
    const elementToModify = document.getElementById(id + "-result");
    const spanResult = document.createElement("span");
    spanResult.classList.add("correct-result");
    spanResult.textContent = value;
    elementToModify.appendChild(spanResult); 
  }

  printFalseResult(id, valuePass, trueResult, commentValue) {
    const elementToModify = document.getElementById(id + "-result");
    const spanFalse = document.createElement("span");
    spanFalse.classList.add("false-result");
    spanFalse.textContent = valuePass;
    elementToModify.appendChild(spanFalse);

    const spanResult = document.createElement("span");
    spanResult.classList.add("good-result");
    spanResult.textContent = trueResult;
    elementToModify.appendChild(spanResult); 
    if (commentValue) {
      const comment = document.createElement("span");
      comment.classList.add("comment-result");
      comment.textContent = commentValue;
      elementToModify.appendChild(comment);
    }
  }

  verifyBonusPayment(playerIndex) {
    const calc = this.calculateValue(playerIndex);
    document.getElementById("player-result").textContent = calc[0];
    document.getElementById("bank-result").textContent = this.calculateValue(0)[0];
    var bonus = this.paymentsTurn.getBonus()
    if (calc[1] > 7) {
      if (bonus && bonus.length > 0) {
        if (!bonus[0].removeAll){
          this.printFalseResult("bonus", bonus[0].stringify(), "Ramasser")
        } else {
          this.printGoodResult("bonus", bonus[0].stringify())
        }
      } else {
        console.error('verifyPayment: ' +'Cette condition ne devrait pas arriver.')
      }
    } else if (calc[1] <= 7) {
      if (calc[1] === 7) {
        //Brelan
        this.verifyBonus(bonus[0].value, 3*this.board.players[playerIndex].bonus);
      } else if (calc[1] === 6) {
        //suite
        this.verifyBonus(bonus[0].value, 4*this.board.players[playerIndex].bonus);
      } else if (calc[1] === 5) {
        //couleur 
        this.verifyBonus(bonus[0].value, 7* this.board.players[playerIndex].bonus)
      } else if (calc[1] === 4) {
        //full 
        this.verifyBonus(bonus[0].value, 8*this.board.players[playerIndex].bonus)
      } else if (calc[1] === 3) {
        //carré
        this.verifyBonus(bonus[0].value, 30*this.board.players[playerIndex].bonus)
      } else if (calc[1] === 2) {
        //quinte flush
        this.verifyBonus(bonus[0].value, 40* this.board.players[playerIndex].bonus)
      } else if (calc[1] === 1) {
        //quinte flush royale
        this.verifyBonus(bonus[0].value, 50* this.board.players[playerIndex].bonus)
      }
    }
    console.log(calc[0], playerIndex, this.board.players[playerIndex].bonus)
  }

  verifyMiseAndJouer(superiorToBank) {
    var miser = this.paymentsTurn.getType("mise");
    console.log('miser', miser, superiorToBank)
    if (superiorToBank === 0) {
      if (miser.removeAll === false && miser.value === 0) {
        this.printGoodResult("miser", "Vous avez payer 0.")
      } else {
        this.printFalseResult("miser", miser.stringify(), "Vous auriez dû payer 0")
      }
    } else if (superiorToBank === -1) {
      if (miser.isNotGet()) {
        this.printFalseResult("miser", miser.stringify(), "Vous auriez dû ramasser.")
      }  else {
        this.printGoodResult("miser", miser.stringify())
      }  
    } else if (superiorToBank === 1) {
      if (miser.isNotGet()) {
        this.printGoodResult("miser", miser.stringify())
      } else {
        this.printFalseResult("miser", miser.stringify(), "Vous auriez dû payer.")
      }
    }
  }

  verifyBlindValue(blind, playerValue) {
    let realToPay;
    if (playerValue[1] === 1) {
      realToPay = this.board.players[this.playerIndex].blind * 500;
    } else if (playerValue[1] === 2) {
      realToPay = this.board.players[this.playerIndex].blind * 50;
    } else if (playerValue[1] === 3) {
      realToPay = this.board.players[this.playerIndex].blind * 10;
    } else if (playerValue[1] === 4) {
      realToPay = this.board.players[this.playerIndex].blind * 3;
    } else if (playerValue[1] === 5) {
      realToPay = this.board.players[this.playerIndex].blind * 1.5;
    } else if (playerValue[1] === 6) {
      realToPay = this.board.players[this.playerIndex].blind * 1;
    }
    if (realToPay === blind) {
      this.printGoodResult("blind", blind.stringify())
    } else {
      this.printFalseResult("blind", blind.stringify(), "Vous auriez dû payer " + realToPay);
    }
  }

  verifyBlind(playerValue, superiorToBank) {
    var blind = this.paymentsTurn.getType('blind');
    var payable = playerValue[1] <= 6 ?  true: false;
    console.log(superiorToBank, payable, blind)
    if (superiorToBank === 0) {
      if (!blind.removeAll && (blind.value === 0 || blind.value === '')) {
        this.printGoodResult("blind", blind.stringify());
      } else if (blind.removeAll) {
        this.printFalseResult("blind", blind.stringify(), "Vous auriez dû ne rien faire.");
      } else if (blind.value !==0 || blind.value !== '') {
        this.printFalseResult("blind", blind.stringify(), "Vous auriez dû ne rien faire.");
      }
    } 
    else {
      if (superiorToBank === -1) {
        if (blind.isNotGet()) {
          this.printFalseResult("blind", blind.stringify(), "Vous auriez dû ramasser.")
        } else {
          this.printGoodResult("blind", blind.stringify())
        }
      } else if (superiorToBank === 1) {
        if (payable) {
          if (blind.isNotGet()) {
            this.verifyBlindValue(blind, playerValue);
          } else {
            this.printFalseResult("blind", blind.stringify(), "Vous auriez dû payer")
          }
        } else if (!payable) {
          if (blind.isNotGet()) {
            this.printFalseResult("blind", blind.stringify(), "Vous auriez dû ramasser.")
          } else {
            this.printGoodResult("blind", blind.stringify())
          }
        }
      }
    }
    console.log(payable, "payable", blind)
  }

  verifyPayment(playerIndex) {
    console.log('verify payment')
    //regarder si bonus est correct
    this.verifyBonusPayment(playerIndex);
    
    const bankValue = this.calculateValue(0);
    const playerValue = this.calculateValue(playerIndex);
    const superiorToBank = this.playerSuperiorToBank(playerValue, bankValue);
    //Regarder si mise et jouer est correct
    this.verifyMiseAndJouer(superiorToBank)
    //regarder si la blinde est correcte
    this.verifyBlind(playerValue, superiorToBank);
  }

  //Return +1 si playerValue > bankValue 
  // -1 si bankValue < playerValue
  // 0 si =
  verifyPairIsSuperior(playerValue, bankValue) {
    if (playerValue[2][0].index > bankValue[2][0].index) {
      return 1;
    } else if (playerValue[2][0].index < bankValue[2][0].index) {
      return -1;
    } else {
      console.log(this.board.players[this.playerIndex])
      this.board.players[this.playerIndex].sortWithAsAs14();
      this.board.players[0].sortWithAsAs14();
      if (this.board.players[this.playerIndex].cards[0].index > this.board.players[0].cards[0].index) {
        return 1;
      } else if (this.board.players[this.playerIndex].cards[0].index < this.board.players[0].cards[0].index) {
        return -1;
      } else {
        if (this.board.players[this.playerIndex].cards[1].index > this.board.players[0].cards[1].index) {
          return 1;
        } else if (this.board.players[this.playerIndex].cards[1].index < this.board.players[0].cards[1].index) {
          return -1;
        } else {
          return 0;
        }
      }
    }
  }

  testHighCard(bankCard, playerCard) {
    if (bankCard.index > playerCard.index) {
      return 1;
    } else if (bankCard.index < playerCard.index) {
      return -1;
    } else {
      return 0;
    }
  }

  // Retourne 1 si > à banque
  // -1 si < à banque 
  // 0 si = à banque
  verifyHighCard(playerValue, bankValue) {
    this.board.players[this.playerIndex].sortWithAsAs14();
    this.board.players[0].sortWithAsAs14();
    let highCard = this.testHighCard(this.board.players[0].cards[0], this.board.players[this.playerIndex].cards[0]);
    if (highCard ===0) {
      highCard = this.testHighCard(this.board.players[0].cards[1], this.board.players[this.playerIndex].cards[1]);
    }
    console.log(highCard, 'highcard returned',this.board.players[0], this.board.players[this.playerIndex], this.board.players[0].cards[1], this.board.players[this.playerIndex].cards[1])
    return highCard;
  }

  // Retourne 1 si > à banque
  // -1 si < à banque 
  // 0 si = à banque
  verifyBrelan(playerValue, bankValue) {
    if (bankValue[2][0].index > playerValue[2][0].index) {
      return 1;
    } else if (bankValue[2][0].index < playerValue[2][0].index) {
      return -1;
    } else {
      return this.verifyHighCard(playerValue, bankValue);
    }
  }

  verifyStraight(playerValue, bankValue) {
    if (bankValue[2][0] > playerValue[2][0]) {
      return 1;
    } else if (bankValue[2][0] < playerValue[2][0]) {
      return -1;
    } else {
      return this.verifyHighCard(playerValue, bankValue);
    }
  }

  verifyColor(playerValue, bankValue) {
    const color = playerValue[2].cards[0].color;
    this.board.players[this.playerIndex].sortWithAsAs14();
    this.board.players[0].sortWithAsAs14();
    const cardsOfColorForPlayer = this.board.players[this.playerIndex].cards.filter((card) => {
      return card.color === color;
    });
    const cardsOfColorForBank = this.board.players[0].cards.filter((card) => {
      return card.color === color;
    });
    if (cardsOfColorForBank.length > 0 && cardsOfColorForPlayer.length > 0) {
      return this.testHighCard(cardsOfColorForBank[0], cardsOfColorForPlayer[0])
    } else {
      if (cardsOfColorForBank.length ===0) {
        return 1;
      }
      return -1;
    }
  }

  verifySuperior(playerValue, bankValue) {
    if (playerValue[1] === 8 || playerValue[1] === 9) {
      return this.verifyPairIsSuperior(playerValue, bankValue);
    } else if (playerValue[1] === 10) {
      return this.verifyHighCard(playerValue, bankValue);
    } else if (playerValue[1] === 7) {
      return this.verifyBrelan(playerValue, bankValue);
    } else if (playerValue[1] === 6) {
      return this.verifyStraight(playerValue, bankValue);
    } else if (playerValue[1] === 5) {
      return this.verifyColor(playerValue, bankValue);
    } else if (playerValue[1] === 4) {
      return this.verifyFull(playerValue, bankValue);
    } else if (playerValue[1] === 3) {
      console.error(playerValue, bankValue, this, "Un carré ne peut pas être à la fois à la banque et au joueur.")
      return 0;
    } else if (playerValue[1] === 2) {
      return this.verifyQuinteFlush(playerValue, bankValue);
    } else if (playerValue[1] === 1) {
      console.error(playerValue, bankValue, this, "Une quinte flush royale ne peut pas être à la fois à la banque et au joueur.")      
      return 0;
    }
  }

  verifyQuinteFlush(playerValue, bankValue) {
    if (playerValue[2][0].index > bankValue[2][0].index) {
      return 1;
    } else if (playerValue[2][0].index < bankValue[2][0].index) {
      return -1;
    } else {
      console.error(playerValue, bankValue, this, "Deux quintes flush de couleurs différentes impossible.")
    }
  }

  verifyFull(playerValue, bankValue) {
    if (playerValue[2][1][0][0].index > bankValue[2][1][0][0].index) {
      return 1;
    } else if (playerValue[2][1][0][0].index < bankValue[2][1][0][0].index) {
      return -1;
    } else {
      if (playerValue[2][1][1][0].index > bankValue[2][1][1][0].index) {
        return 1;
      } else if (playerValue[2][1][1][0].index < bankValue[2][1][1][0].index) {
        return -1;
      } else {
        return this.verifyHighCard(playerValue, bankValue);
      }
    }
  }

  // Retourne 1 si > à banque
  // -1 si < à banque 
  // 0 si = à banque
  playerSuperiorToBank(playerValue, bankValue) {
    if (playerValue[1] < bankValue[1]) {
      return 1;
    } else if (playerValue[1] > bankValue[1]) {
      return -1;
    } else {
      return this.verifySuperior(playerValue, bankValue);
    }
  }

  verifyBonus(bonusPassed, correctBonus) {
    this.verifyType("bonus", bonusPassed, correctBonus);
  }

  verifyType(type, valuePassed, correctValue) {
    if (valuePassed === correctValue) {
      this.printGoodResult(type, correctValue);
    } else {
      this.printFalseResult(type, valuePassed, correctValue);
    }
  }

  finishPayment(playerIndex) {
    
  }

  pay(playerIndex) {
    this.payModal.showModal();
  }

  next() {
    console.log('step', this.step, 'playerIndex', this.playerIndex);
    if (this.step > 3) {
      console.log('into1')
      if (this.playerIndex < this.board.players.length -1) {
        this.step = 1;
        this.playerIndex++;
        this.zoom.finishZoom();
      } else {
        window.location.reload();
      }
    }
    if (this.step === 0) {
      this.revealBoard();
    } else if (this.step  === 1) {
      this.revealPlayer(this.playerIndex);
    } else if (this.step === 2) {
      document.getElementById("pay-button").style.display="none";
      if (this.playerIndex !==0) {
        document.getElementById('reveal-text').style.display = "none";
        document.getElementById("reveal-button").style.display = "none";
        this.revealValuePlayer(this.playerIndex);
        this.addActionButtons(this.playerIndex);
      } else {
        this.step = 4;
        console.log('next from else this.playerIndex !==0')
        this.next();
        return null;
      }  
    } else if (this.step === 3) {
      console.log("finish vizualise", this.step, this.playerIndex)
      this.step++;
      this.finishVisualizePaymentResult();
      return null;
    }
    this.step += 1;
  } 
}


/* window.addEventListener("resize", (event) => {
  console.log('resize', event)
  if (window.innerWidth > 1200 || window.innerHeight <= window.innerWidth) {
    document.getElementById("change-to-landscape").close();
  }
})
if (window.innerWidth < 1200 && window.innerHeight > window.innerWidth) {
  document.getElementById("change-to-landscape").showModal();
} */

var revealButton = document.getElementById("reveal-button");
var value = document.getElementById("reveal-text");


class ZoomOnElement {
  constructor() {
    this.middle = document.getElementById("middle");
    this.middle.style.top = (window.innerHeight/2 - this.middle.offsetHeight/2) + "px";
    this.middle.style.left = (window.innerWidth/2 - this.middle.offsetWidth/2) + "px";
  }

  zoomOn(childs) {
    this.middle.style.display = "block";
    childs.forEach((child) => {
      this.middle.appendChild(child);
    })
    this.middle.style.transform= "scale(1.5)"
    this.middle.style.backgroundColor = "rgb(0,133,98)";
  }

  finishZoom() {
    this.middle.innerHTML = "";
    this.middle.style.display = "none";
  }
}



const zoom = new ZoomOnElement();
game = new Game(revealButton, value, zoom);
//game.useAndTest(["Valet de pique", "3 de coeur", "Valet de trefle", "8 de trefle", "3 de pique", "3 de trefle", "Valet de coeur"], "testFull")
if (!window.location.href.includes('replay')) {
  game.reboot();
} else {
  const value = window.location.href.substring(window.location.href.indexOf('replay=') + 7)
  console.log(value)
  game.reboot(0, value);
}

revealButton.addEventListener("click", (event) => {
  console.log('next from reveal button')
  game.next();
})

