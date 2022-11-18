class Card {
  /** index: 1 for AS 
   *  13 for king
   */
  constructor(color, index) {
    this.color = color;
    this.index = index;
    //TODO this.image = ;
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
  constructor(fric, cards) {
    this.fric = fric;
    this.cards = cards;
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

}

class Game {
  allCards = [];
  colors = ["coeur", "pique", "trefle", "carreau"];
  constructor(revealButton, revealText) {
    this.colors.forEach((color) => {
      for (let i = 1; i!= 14; i++) {
        this.allCards.push(new Card(color, i));
      }
    });
    console.log(this.allCards);
    this.revealButton = revealButton;
    this.revealText = revealText;
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
    console.log(testName, "into1", cards)
    if (testName === "testFull") {
      console.log("return value", Game.testFull(cards));
    }
  }

  reboot(numberOfPlayers) {
    var cardsNotSelected = [...this.allCards];
    this.board = new Board(cardsNotSelected, numberOfPlayers);
    this.revealButton.textContent = "Révéler le board";
    this.revealText.textContent = "Cliquez sur révéler";
    console.log(this.board.players.length, numberOfPlayers)
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
        console.log('into2')
        cards.push(element);
      } else {
        console.log('into3')
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
      console.log('into straight')
      var textToReturn = "Suite de " + Card.convertIndex(cards[0].index) + " à " + Card.convertIndex(cards[cards.length - 1].index);
      return [textToReturn, cards];
    } else {
      return false;
    }
  }

  static testRoyalFlush(straight) {
    console.log('test Royal begin')
    if (straight && straight[1][straight[1].length - 1].index === 10 && (straight[1][0].index === 14 || straight[1][0].index === 1)) {
      const flush = Game.testFlush(straight);
      if (flush) {
        var textToReturn = "Quinte flush Royal en " + flush[flush.length - 1].color;
        return [textToReturn, flush];
      }
      console.log('test Royal finish false')
      return false;
    } else {
      console.log('test Royal finish false')
      return false;
    }
  }

  static testStraightFlush(straight) {
    console.log('testStraightFlush begin')
    if (!straight) {
      console.log('testStraightFlush finish false')
      return false;
    }
    var flush = Game.testFlush(straight);
    console.log(flush, 'flush')
    if (flush) {
      var textToReturn = "Quinte flush en " + flush[flush.length - 1].color;
      return [textToReturn, flush];
    } 
    console.log('testStraightFlush finish false')
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
    console.log(sorted, 'sorted')
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

    const straight =  Game.testStraight(cardsToTest);

    //Royal flush
    const royalFlush = Game.testRoyalFlush(straight);
    if (royalFlush) {
      return royalFlush[0]
    }

    //straight flush
    const straightFlush = Game.testStraightFlush(straight)
    if (straightFlush) {
      return straightFlush[0];
    }
    //carre
    const carre = Game.testFourOfAKind(cardsToTest);
    if (carre) {
      return carre[0];
    }

    //full
    const full = Game.testFull(cardsToTest);
    if (full) {
      return full[0];
    }

    //flush
    const flush = Game.testFlush(cardsToTest);
    if (flush) {
      return flush[0];
    }

    //Straight
    const restraight = Game.testStraight(cardsToTest);
    if (restraight) {
      return restraight[0];
    }

    //brelan
    const brelan = Game.testThreeOfAKind(cardsToTest);
    if (brelan) {
      return brelan[0];
    }

    //pairs
    const pairs = Game.testPair(cardsToTest);
    if (pairs) {
      if (pairs.length ===1) {
        return "Paire de " + Card.convertIndex(pairs[0][0].index)
      } else {
        return "Double paire de " + Card.convertIndex(pairs[0][0].index) + " et "+ Card.convertIndex(pairs[1][0].index)
      }
    }

    return "Carte haute";
  }

  next() {
    if (this.step === 0) {
      this.beginDate = new Date().getTime();
      this.revealButton.textContent = "Révéler la banque";
      this.revealText.textContent = "Cliquez sur révéler";
      this.board.cards.forEach((value, index) => {
        document.getElementById("board-card-" + (index+1)).style.backgroundImage = "url('" + value.image + "')";
      });
    } else if (this.step > 0 && this.step - 1 < this.board.players.length) {
      this.revealButton.textContent = "Révéler la valeur et les prochaines cartes";
      var playerIndex = this.step-1;
      if (this.step > 1) {
        this.revealText.textContent = this.calculateValue(playerIndex - 1);
      }
      this.board.players[playerIndex].cards.forEach((value, index) => {
        document.getElementById("player-" + playerIndex + "-card-" + (index+1)).style.backgroundImage = "url('" + value.image + "')";
      });
    } else if (this.step - 1 === this.board.players.length) {
      this.revealButton.textContent = "Révéler la valeur et les prochaines cartes";
      this.revealText.textContent = this.calculateValue(this.step - 2);
      console.log('last');
      document.getElementById("time").textContent = ((new Date().getTime() - this.beginDate)/1000 ) + " s"
    } else {
      document.location = document.location;
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

game = new Game(revealButton, value);
//game.useAndTest(["Valet de pique", "3 de coeur", "Valet de trefle", "8 de trefle", "3 de pique", "3 de trefle", "Valet de coeur"], "testFull")

game.reboot();

revealButton.addEventListener("click", (event) => {
  game.next();
})
