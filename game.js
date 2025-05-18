const treasures = [
  { name: "Gold Coin", image: "gold-coin.png", rarity: "common", value: 10, xp: 5 },
  { name: "Silver Sword", image: "silver-sword.png", rarity: "common", value: 15, xp: 8 },
  { name: "Diamond Ring", image: "diamond-ring.png", rarity: "rare", value: 40, xp: 20 },
  { name: "Magic Potion", image: "magic-potion.png", rarity: "rare", value: 30, xp: 15 },
  { name: "Ancient Artifact", image: "ancient-artifact.png", rarity: "epic", value: 100, xp: 40 }
];

const itemsForSale = [
  { name: "Mystic Map", image: "mystic-map.png", cost: 30 },
  { name: "Golden Key", image: "golden-key.png", cost: 50 },
  { name: "Fire Charm", image: "fire-charm.png", cost: 70 }
];

const locations = [
  {
    name: "Mystic Forest",
    image: "forest.png",
    requiredItem: "Mystic Map",
    reward: 40,
    xp: 30,
    event: "You solved a riddle and found hidden treasure!"
  },
  {
    name: "Ancient Castle",
    image: "castle.png",
    requiredItem: "Golden Key",
    reward: 80,
    xp: 50,
    event: "You unlocked the royal vault and escaped the guards!"
  },
  {
    name: "Volcanic Crater",
    image: "volcano.png",
    requiredItem: "Fire Charm",
    reward: 120,
    xp: 70,
    event: "You danced across lava stones to reach the obsidian relic!"
  }
];

let collectedTreasures = JSON.parse(localStorage.getItem("collectedTreasures")) || [];
let ownedItems = JSON.parse(localStorage.getItem("ownedItems")) || [];
let coinBalance = parseInt(localStorage.getItem("coinBalance")) || 0;
let playerLevel = parseInt(localStorage.getItem("playerLevel")) || 1;
let playerXP = parseInt(localStorage.getItem("playerXP")) || 0;
let xpToLevel = playerLevel * 100;

const quests = [
  { text: "Find 3 common treasures", condition: () => collectedTreasures.filter(t => t.rarity === "common").length >= 3, reward: 20 },
  { text: "Earn 50 XP", condition: () => playerXP >= 50, reward: 30 }
];

function saveState() {
  localStorage.setItem("collectedTreasures", JSON.stringify(collectedTreasures));
  localStorage.setItem("ownedItems", JSON.stringify(ownedItems));
  localStorage.setItem("coinBalance", coinBalance);
  localStorage.setItem("playerLevel", playerLevel);
  localStorage.setItem("playerXP", playerXP);
}

function updateUI() {
  document.getElementById("coin-balance").innerText = coinBalance;
  document.getElementById("player-level").innerText = playerLevel;
  document.getElementById("player-xp").innerText = playerXP;
  document.getElementById("xp-to-level").innerText = xpToLevel;

  const nftList = document.getElementById("nft-list");
  nftList.innerHTML = '';
  collectedTreasures.forEach((treasure) => {
    const nftItem = document.createElement('div');
    nftItem.className = `nft-item ${treasure.rarity}`;
    nftItem.innerHTML = `<img src="${treasure.image}" alt="${treasure.name}"><p>${treasure.name}</p>`;
    nftList.appendChild(nftItem);
  });

  const shopItemsContainer = document.getElementById("shop-items");
  shopItemsContainer.innerHTML = '';
  itemsForSale.forEach(item => {
    const owned = ownedItems.includes(item.name);
    const shopItem = document.createElement('div');
    shopItem.className = "shop-item";
    shopItem.innerHTML = `
      <img src="${item.image}" alt="${item.name}">
      <p>${item.name}</p>
      <p>Cost: ${item.cost}</p>
      <button ${owned ? "disabled" : ""} onclick="selectItemToBuy('${item.name}')">
        ${owned ? "Owned" : "Buy"}
      </button>`;
    shopItemsContainer.appendChild(shopItem);
  });

  const locContainer = document.getElementById("location-buttons");
  locContainer.innerHTML = '';
  locations.forEach(loc => {
    const div = document.createElement('div');
    div.innerHTML = `
      <img src="${loc.image}" width="100" alt="${loc.name}"><br>
      <button onclick="visitLocation('${loc.name}')">Visit ${loc.name}</button>`;
    locContainer.appendChild(div);
  });

  const questList = document.getElementById("quest-list");
  questList.innerHTML = '';
  quests.forEach((q, i) => {
    const li = document.createElement("li");
    if (q.completed) {
      li.innerHTML = `✅ ${q.text}`;
    } else {
      li.innerHTML = `${q.text} <button onclick="claimQuest(${i})">Claim</button>`;
    }
    questList.appendChild(li);
  });
}

function gainXP(amount) {
  playerXP += amount;
  if (playerXP >= xpToLevel) {
    playerLevel++;
    playerXP = playerXP - xpToLevel;
    xpToLevel = playerLevel * 100;
    alert(`🎉 You leveled up to Level ${playerLevel}!`);
  }
}

function explore() {
  const roll = Math.random();
  let treasure;
  if (roll < 0.6) treasure = treasures[0];
  else if (roll < 0.8) treasure = treasures[1];
  else if (roll < 0.93) treasure = treasures[2];
  else if (roll < 0.98) treasure = treasures[3];
  else treasure = treasures[4];

  coinBalance += treasure.value;
  gainXP(treasure.xp);
  collectedTreasures.push(treasure);

  document.getElementById("status").innerText = `You found a ${treasure.name}!`;
  document.getElementById("treasure-animation").innerHTML = `<img src="${treasure.image}" alt="${treasure.name}">`;

  saveState();
  updateUI();
}

function selectItemToBuy(name) {
  const item = itemsForSale.find(i => i.name === name);
  if (coinBalance >= item.cost) {
    coinBalance -= item.cost;
    ownedItems.push(item.name);
    alert(`You bought a ${item.name}!`);
    saveState();
    updateUI();
  } else {
    alert("Not enough coins!");
  }
}

function visitLocation(name) {
  const loc = locations.find(l => l.name === name);
  if (!ownedItems.includes(loc.requiredItem)) {
    alert(`You need a ${loc.requiredItem} to visit this location.`);
    return;
  }
  coinBalance += loc.reward;
  gainXP(loc.xp);
  alert(`${loc.event} You earned ${loc.reward} coins and ${loc.xp} XP!`);
  saveState();
  updateUI();
}

function claimQuest(index) {
  const quest = quests[index];
  if (!quest.condition()) {
    alert("Quest conditions not met yet!");
    return;
  }
  coinBalance += quest.reward;
  quest.completed = true;
  alert(`Quest completed! You earned ${quest.reward} coins.`);
  saveState();
  updateUI();
}

document.getElementById("explore-btn").addEventListener("click", explore);
document.getElementById("shop-btn").addEventListener("click", () => document.getElementById("shop").style.display = "block");
document.getElementById("close-shop-btn").addEventListener("click", () => document.getElementById("shop").style.display = "none");

updateUI();
