// Game Data & Variables

const treasures = [
  { name: "Gold Coin", image: "gold-coin.png", rarity: "common", value: 10 },
  { name: "Silver Sword", image: "silver-sword.png", rarity: "common", value: 20 },
  { name: "Diamond Ring", image: "diamond-ring.png", rarity: "rare", value: 50 },
  { name: "Magic Potion", image: "magic-potion.png", rarity: "rare", value: 30 },
  { name: "Ancient Artifact", image: "ancient-artifact.png", rarity: "epic", value: 100 }
];

const itemsForSale = [
  { name: "Mystic Map", image: "mystic-map.png", cost: 30 },
  { name: "Golden Key", image: "golden-key.png", cost: 50 },
  { name: "Fire Charm", image: "fire-charm.png", cost: 60 }
];

const locations = [
  { name: "Mystic Forest", image: "forest.png", requiredItem: "Mystic Map", reward: 40, miniGame: "maze" },
  { name: "Ancient Castle", image: "castle.png", requiredItem: "Golden Key", reward: 80, miniGame: "trivia" },
  { name: "Volcanic Crater", image: "volcano.png", requiredItem: "Fire Charm", reward: 100, miniGame: "memory" }
];

// Persistent storage
let collectedTreasures = JSON.parse(localStorage.getItem("collectedTreasures")) || [];
let ownedItems = JSON.parse(localStorage.getItem("ownedItems")) || [];
let coinBalance = parseInt(localStorage.getItem("coinBalance")) || 0;

// DOM Elements
const panels = {
  mainMenu: document.getElementById('main-menu'),
  shop: document.getElementById('shop'),
  locations: document.getElementById('locations'),
  questArea: document.getElementById('quest-area'),
  nftCollection: document.getElementById('nft-collection'),
};

const coinBalanceSpan = document.getElementById('coin-balance');
const treasureInfo = document.getElementById('treasure-info');
const treasureAnimation = document.getElementById('treasure-animation');

const shopItemsContainer = document.getElementById('shop-items');
const locationButtonsContainer = document.getElementById('location-buttons');

const questTitle = document.getElementById('quest-title');
const questContent = document.getElementById('quest-content');
const finishQuestBtn = document.getElementById('finish-quest-btn');

const nftList = document.getElementById('nft-list');

const body = document.body;

// Utility Functions

function saveGame() {
  localStorage.setItem("collectedTreasures", JSON.stringify(collectedTreasures));
  localStorage.setItem("ownedItems", JSON.stringify(ownedItems));
  localStorage.setItem("coinBalance", coinBalance.toString());
}

function updateUI() {
  coinBalanceSpan.innerText = coinBalance;

  // Update NFT list
  nftList.innerHTML = '';
  collectedTreasures.forEach(t => {
    const nftDiv = document.createElement('div');
    nftDiv.className = 'nft-item';
    nftDiv.innerHTML = `<img src="${t.image}" alt="${t.name}"><p>${t.name}</p>`;
    nftList.appendChild(nftDiv);
  });

  // Update Shop items
  shopItemsContainer.innerHTML = '';
  itemsForSale.forEach(item => {
    const owned = ownedItems.includes(item.name);
    const shopDiv = document.createElement('div');
    shopDiv.className = 'shop-item';
    shopDiv.innerHTML = `
      <img src="${item.image}" alt="${item.name}">
      <p>${item.name}</p>
      <p>Cost: ${item.cost} coins</p>
      <button ${owned ? "disabled" : ""} onclick="buyItem('${item.name}')">
        ${owned ? "Owned" : "Buy"}
      </button>
    `;
    shopItemsContainer.appendChild(shopDiv);
  });

  // Update Locations buttons
  locationButtonsContainer.innerHTML = '';
  locations.forEach(loc => {
    const hasReqItem = ownedItems.includes(loc.requiredItem);
    const locDiv = document.createElement('div');
    locDiv.className = 'location-item';
    locDiv.innerHTML = `
      <img src="${loc.image}" alt="${loc.name}">
      <button ${hasReqItem ? "" : "disabled"} onclick="startQuest('${loc.name}')">
        Visit ${loc.name}
      </button>
      <p>${hasReqItem ? "Ready to explore!" : `Need ${loc.requiredItem}`}</p>
    `;
    locationButtonsContainer.appendChild(locDiv);
  });

  saveGame();
}

// Game Logic

window.buyItem = function (itemName) {
  const item = itemsForSale.find(i => i.name === itemName);
  if (coinBalance >= item.cost) {
    coinBalance -= item.cost;
    ownedItems.push(item.name);
    updateUI();
    alert(`You bought a ${item.name}!`);
  } else {
    alert("Not enough coins!");
  }
};

function explore() {
  const randomTreasure = treasures[Math.floor(Math.random() * treasures.length)];
  coinBalance += randomTreasure.value;
  treasureInfo.innerText = `You found a ${randomTreasure.name} worth ${randomTreasure.value} coins!`;
  showTreasureAnimation(randomTreasure);
  collectedTreasures.push(randomTreasure);
  updateUI();
}

function showTreasureAnimation(treasure) {
  treasureAnimation.innerHTML = `<img src="${treasure.image}" alt="${treasure.name}">`;
  treasureAnimation.style.display = 'block';
  setTimeout(() => {
    treasureAnimation.style.display = 'none';
  }, 1500);
}

// Panel Navigation

function showPanel(panelName) {
  for (const key in panels) {
    panels[key].classList.remove('active');
  }
  panels[panelName].classList.add('active');
}

document.getElementById('explore-btn').addEventListener('click', explore);
document.getElementById('shop-btn').addEventListener('click', () => {
  showPanel('shop');
});
document.getElementById('close-shop-btn').addEventListener('click', () => {
  showPanel('mainMenu');
});
document.getElementById('locations-btn').addEventListener('click', () => {
  showPanel('locations');
});
document.getElementById('back-to-menu-btn').addEventListener('click', () => {
  showPanel('mainMenu');
});
document.getElementById('back-to-locations-btn').addEventListener('click', () => {
  showPanel('locations');
});

// Quest & Mini-games Logic

function startQuest(locationName) {
  const loc = locations.find(l => l.name === locationName);
  if (!loc) return;

  if (!ownedItems.includes(loc.requiredItem)) {
    alert(`You need the ${loc.requiredItem} to explore this location.`);
    return;
  }

  // Change background to location background
  body.style.backgroundImage = `url(${loc.image})`;

  questTitle.innerText = `Quest: Explore the ${loc.name}`;
  questContent.innerHTML = ''; // Clear previous

  // Start the mini game for this location
  switch (loc.miniGame) {
    case 'maze':
      loadMazeGame();
      break;
    case 'memory':
      loadMemoryGame();
      break;
    case 'trivia':
      loadTriviaGame();
      break;
  }

  finishQuestBtn.style.display = 'none'; // disable finish button until player wins

  showPanel('questArea');
}

// ========== Maze Mini Game (Forest) ==========

const mazeSize = 7;
const mazeGrid = [
  [1,1,1,1,1,1,1],
  [1,0,0,0,1,0,1],
  [1,0,1,0,1,0,1],
  [1,0,1,0,0,0,1],
  [1,0,1,1,1,0,1],
  [1,0,0,0,0,0,1],
  [1,1,1,1,1,1,1]
];

let playerPos = { x: 1, y: 1 };

function loadMazeGame() {
  const mazeDiv = document.createElement('div');
  mazeDiv.id = 'maze-game';

  for(let y = 0; y < mazeSize; y++) {
    for(let x = 0; x < mazeSize; x++) {
      const cell = document.createElement('div');
      cell.classList.add('cell');
      if(mazeGrid[y][x] === 1) cell.classList.add('wall');
      if(playerPos.x === x && playerPos.y === y) cell.classList.add('player');
      if(x === mazeSize-2 && y === mazeSize-2) cell.classList.add('exit');
      mazeDiv.appendChild(cell);
    }
  }

  questContent.innerHTML = '';
  questContent.appendChild(mazeDiv);

  window.addEventListener('keydown', handleMazeMovement);
}

function handleMazeMovement(e) {
  const key = e.key;
  let newX = playerPos.x;
  let newY = playerPos.y;

  switch(key) {
    case 'ArrowUp': newY--; break;
    case 'ArrowDown': newY++; break;
    case 'ArrowLeft': newX--; break;
    case 'ArrowRight': newX++; break;
    default: return;
  }

  if(mazeGrid[newY][newX] === 0) {
    playerPos = {x: newX, y: newY};
    loadMazeGame();

    if(newX === mazeSize-2 && newY === mazeSize-2) {
      window.removeEventListener('keydown', handleMazeMovement);
      alert("You escaped the Mystic Forest Maze! You earned 40 coins.");
      coinBalance += 40;
      updateUI();
      showPanel('locations');
      body.style.backgroundImage = "url('background-main.jpg')";
    }
  }
}

// ========== Memory Match Mini Game (Volcano) ==========

const memoryCards = ['🔥', '💎', '🔥', '💎', '🌋', '🌋'];

let flippedCards = [];
let matchedCount = 0;

function loadMemoryGame() {
  questContent.innerHTML = '';

  const memoryDiv = document.createElement('div');
  memoryDiv.id = 'memory-game';

  // Shuffle cards
  const shuffled = memoryCards.sort(() => 0.5 - Math.random());

  shuffled.forEach((symbol, idx) => {
    const card = document.createElement('div');
    card.className = 'memory-card';
    card.dataset.symbol = symbol;
    card.innerText = '';
    card.addEventListener('click', () => flipCard(card));
    memoryDiv.appendChild(card);
  });

  questContent.appendChild(memoryDiv);

  flippedCards = [];
  matchedCount = 0;
}

function flipCard(card) {
  if (flippedCards.length >= 2 || card.classList.contains('flipped')) return;

  card.classList.add('flipped');
  card.innerText = card.dataset.symbol;
  flippedCards.push(card);

  if (flippedCards.length === 2) {
    if (flippedCards[0].dataset.symbol === flippedCards[1].dataset.symbol) {
      matchedCount += 2;
      flippedCards = [];

      if (matchedCount === memoryCards.length) {
        alert("You matched all pairs! You earned 100 coins.");
        coinBalance += 100;
        updateUI();
        showPanel('locations');
        body.style.backgroundImage = "url('background-main.jpg')";
      }
    } else {
      setTimeout(() => {
        flippedCards.forEach(c => {
          c.classList.remove('flipped');
          c.innerText = '';
        });
        flippedCards = [];
      }, 1000);
    }
  }
}

// ========== Trivia Mini Game (Castle) ==========

const triviaQuestions = [
  {
    question: "What is the symbol of the Ancient Castle?",
    options: ["A crown", "A sword", "A shield", "A dragon"],
    answer: 2
  },
  {
    question: "Which item opens the Castle door?",
    options: ["Mystic Map", "Golden Key", "Fire Charm", "Magic Potion"],
    answer: 1
  },
  {
    question: "What creature guards the treasure?",
    options: ["A dragon", "A goblin", "A ghost", "A knight"],
    answer: 0
  }
];

let currentTriviaIndex = 0;

function loadTriviaGame() {
  questContent.innerHTML = '';
  currentTriviaIndex = 0;
  loadTriviaQuestion();
}

function loadTriviaQuestion() {
  questContent.innerHTML = '';

  const q = triviaQuestions[currentTriviaIndex];

  const questionP = document.createElement('p');
  questionP.innerText = q.question;
  questContent.appendChild(questionP);

  q.options.forEach((opt, idx) => {
    const btn = document.createElement('button');
    btn.className = 'trivia-option';
    btn.innerText = opt;
    btn.onclick = () => checkTriviaAnswer(idx);
    questContent.appendChild(btn);
  });
}

function checkTriviaAnswer(selected) {
  const correct = triviaQuestions[currentTriviaIndex].answer;
  if (selected === correct) {
    alert("Correct!");
    currentTriviaIndex++;
    if (currentTriviaIndex >= triviaQuestions.length) {
      alert("You completed the trivia! You earned 80 coins.");
      coinBalance += 80;
      updateUI();
      showPanel('locations');
      body.style.backgroundImage = "url('background-main.jpg')";
    } else {
      loadTriviaQuestion();
    }
  } else {
    alert("Wrong answer, try again.");
  }
}

// Initialize UI
updateUI();
showPanel('mainMenu');
