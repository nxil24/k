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
  { name: "Fire Charm", image: "fire-charm.png", cost: 40 }
];

const locations = [
  { name: "Mystic Forest", image: "forest.png", requiredItem: "Mystic Map" },
  { name: "Ancient Castle", image: "castle.png", requiredItem: "Golden Key" },
  { name: "Volcanic Crater", image: "volcano.png", requiredItem: "Fire Charm" }
];

// Quests with manual interaction
const quests = {
  "Mystic Forest": {
    description: "Find the hidden rune by clicking the button below.",
    reward: 40
  },
  "Ancient Castle": {
    description: "Solve the castle riddle: What has keys but can't open locks?",
    reward: 80,
    riddleAnswer: "piano"
  },
  "Volcanic Crater": {
    description: "Brace yourself and click 'Complete Quest' when ready to survive the eruption!",
    reward: 100
  }
};

let collectedTreasures = JSON.parse(localStorage.getItem("collectedTreasures")) || [];
let ownedItems = JSON.parse(localStorage.getItem("ownedItems")) || [];
let coinBalance = parseInt(localStorage.getItem("coinBalance")) || 0;

function updateUI() {
  // Coins
  document.getElementById("coin-balance").innerText = coinBalance;

  // NFT list
  const nftList = document.getElementById("nft-list");
  nftList.innerHTML = '';
  collectedTreasures.forEach(treasure => {
    const nftItem = document.createElement("div");
    nftItem.classList.add("nft-item");
    nftItem.innerHTML = `
      <img src="${treasure.image}" alt="${treasure.name}" />
      <p>${treasure.name}</p>
    `;
    nftList.appendChild(nftItem);
  });

  // Shop shelf
  const shopShelf = document.getElementById("shop-shelf");
  shopShelf.innerHTML = '';
  itemsForSale.forEach(item => {
    const shopDiv = document.createElement("div");
    shopDiv.classList.add("shop-item");

    // Disable button if already owned
    const owned = ownedItems.includes(item.name);
    shopDiv.innerHTML = `
      <img src="${item.image}" alt="${item.name}" />
      <p>${item.name}</p>
      <p>Cost: ${item.cost} coins</p>
      <button ${owned ? "disabled" : ""} onclick="selectItemToBuy('${item.name}')">${owned ? "Owned" : "Buy"}</button>
    `;
    shopShelf.appendChild(shopDiv);
  });

  // Locations buttons
  const locationButtons = document.getElementById("location-buttons");
  locationButtons.innerHTML = '';
  locations.forEach(location => {
    const locDiv = document.createElement("div");
    locDiv.innerHTML = `
      <img src="${location.image}" alt="${location.name}" />
      <button onclick="visitLocation('${location.name}')">Visit ${location.name}</button>
    `;
    locationButtons.appendChild(locDiv);
  });
}

function explore() {
  const randomTreasure = treasures[Math.floor(Math.random() * treasures.length)];
  coinBalance += randomTreasure.value;

  document.getElementById("treasure-info").innerText = `You found a ${randomTreasure.name} (+${randomTreasure.value} coins)!`;
  showTreasureAnimation(randomTreasure);

  collectedTreasures.push(randomTreasure);
  localStorage.setItem("collectedTreasures", JSON.stringify(collectedTreasures));

  localStorage.setItem("coinBalance", coinBalance);
  updateUI();
}

function showTreasureAnimation(treasure) {
  const animDiv = document.getElementById("treasure-animation");
  animDiv.innerHTML = `<img src="${treasure.image}" alt="${treasure.name}" />`;

  setTimeout(() => {
    animDiv.innerHTML = "";
  }, 2500);
}

function toggleShop() {
  const shop = document.getElementById("shop");
  if (shop.classList.contains("hidden")) {
    shop.classList.remove("hidden");
  } else {
    shop.classList.add("hidden");
  }
}

function selectItemToBuy(itemName) {
  const item = itemsForSale.find(i => i.name === itemName);
  if (!item) return;

  if (ownedItems.includes(itemName)) {
    alert("You already own this item.");
    return;
  }
  if (coinBalance < item.cost) {
    alert("Not enough coins!");
    return;
  }

  if (confirm(`Buy ${itemName} for ${item.cost} coins?`)) {
    coinBalance -= item.cost;
    ownedItems.push(itemName);
    localStorage.setItem("coinBalance", coinBalance);
    localStorage.setItem("ownedItems", JSON.stringify(ownedItems));
    updateUI();
    alert(`You bought the ${itemName}!`);
  }
}

// Quest system
function visitLocation(locationName) {
  const location = locations.find(l => l.name === locationName);
  if (!ownedItems.includes(location.requiredItem)) {
    alert(`You need a ${location.requiredItem} to visit ${location.name}.`);
    return;
  }

  const questPanel = document.getElementById("quest-panel");
  const questTitle = document.getElementById("quest-title");
  const questDescription = document.getElementById("quest-description");
  const completeBtn = document.getElementById("complete-quest-btn");

  questTitle.innerText = `Quest: ${location.name}`;
  questDescription.innerText = quests[locationName].description;

  // Remove previous event listeners by cloning the button
  const newCompleteBtn = completeBtn.cloneNode(true);
  completeBtn.parentNode.replaceChild(newCompleteBtn, completeBtn);

  questPanel.classList.remove("hidden");

  if (locationName === "Ancient Castle") {
    newCompleteBtn.onclick = () => {
      const answer = prompt("Enter your answer to the riddle:");
      if (answer && answer.toLowerCase() === quests[locationName].riddleAnswer) {
        completeQuest(locationName);
      } else {
        alert("Wrong answer. Try again!");
      }
    };
  } else {
    newCompleteBtn.onclick = () => {
      completeQuest(locationName);
    };
  }

  document.getElementById("cancel-quest-btn").onclick = () => {
    questPanel.classList.add("hidden");
  };
}

function completeQuest(locationName) {
  const reward = quests[locationName].reward;
  coinBalance += reward;
  localStorage.setItem("coinBalance", coinBalance);
  alert(`Congrats! You completed the quest at ${locationName} and earned ${reward} coins.`);
  document.getElementById("quest-panel").classList.add("hidden");
  updateUI();
}

// Initialize UI and event listeners
window.onload = () => {
  updateUI();

  document.getElementById("explore-btn").onclick = () => {
    explore();
    document.getElementById("status").innerText = "Status: Exploring...";
  };

  document.getElementById("shop-btn").onclick = () => {
    toggleShop();
  };

  document.getElementById("close-shop-btn").onclick = () => {
    toggleShop();
  };
};
