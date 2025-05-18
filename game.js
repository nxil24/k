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
  { name: "Fire Charm", image: "fire-charm.png", cost: 70 }
];

const locations = [
  {
    name: "Mystic Forest",
    image: "forest.png",
    requiredItem: "Mystic Map",
    reward: 40,
    quest: "Find the hidden grove and collect 5 rare herbs."
  },
  {
    name: "Ancient Castle",
    image: "castle.png",
    requiredItem: "Golden Key",
    reward: 80,
    quest: "Unlock the secret chamber and retrieve the royal crown."
  },
  {
    name: "Volcanic Crater",
    image: "volcano.png",
    requiredItem: "Fire Charm",
    reward: 100,
    quest: "Extinguish the lava flows and rescue the trapped explorer."
  }
];

let collectedTreasures = JSON.parse(localStorage.getItem("collectedTreasures")) || [];
let ownedItems = JSON.parse(localStorage.getItem("ownedItems")) || [];
let coinBalance = parseInt(localStorage.getItem("coinBalance")) || 0;

function updateUI() {
  document.getElementById("coin-balance").innerText = coinBalance;

  // Update collected treasures display
  const nftList = document.getElementById("nft-list");
  nftList.innerHTML = "";
  collectedTreasures.forEach((t) => {
    const div = document.createElement("div");
    div.className = "nft-item";
    div.innerHTML = `<img src="${t.image}" alt="${t.name}" /><p>${t.name}</p>`;
    nftList.appendChild(div);
  });

  // Update shop items
  const shopItemsContainer = document.getElementById("shop-items");
  shopItemsContainer.innerHTML = "";
  itemsForSale.forEach((item) => {
    const div = document.createElement("div");
    div.className = "shop-item";
    div.innerHTML = `
      <img src="${item.image}" alt="${item.name}" />
      <p>${item.name}</p>
      <p>Cost: ${item.cost} coins</p>
      <button onclick="selectItemToBuy('${item.name}')"
        ${ownedItems.includes(item.name) ? "disabled" : ""}>
        ${ownedItems.includes(item.name) ? "Owned" : "Buy"}
      </button>
    `;
    shopItemsContainer.appendChild(div);
  });

  // Update locations
  const locationContainer = document.getElementById("location-buttons");
  locationContainer.innerHTML = "";
  locations.forEach((loc) => {
    const div = document.createElement("div");
    div.innerHTML = `
      <img src="${loc.image}" alt="${loc.name}" />
      <button onclick="visitLocation('${loc.name}')">Visit ${loc.name}</button>
    `;
    locationContainer.appendChild(div);
  });
}

function explore() {
  const randomTreasure = treasures[Math.floor(Math.random() * treasures.length)];
  coinBalance += randomTreasure.value;
  collectedTreasures.push(randomTreasure);
  localStorage.setItem("collectedTreasures", JSON.stringify(collectedTreasures));
  localStorage.setItem("coinBalance", coinBalance);
  document.getElementById("treasure-info").innerText = `You found a ${randomTreasure.name}!`;
  showTreasureAnimation(randomTreasure);
  updateUI();
}

function showTreasureAnimation(treasure) {
  const animDiv = document.getElementById("treasure-animation");
  animDiv.innerHTML = `<img src="${treasure.image}" alt="${treasure.name}" />`;
  animDiv.style.display = "block";
  setTimeout(() => (animDiv.style.display = "none"), 1200);
}

function selectItemToBuy(itemName) {
  const item = itemsForSale.find((i) => i.name === itemName);
  if (ownedItems.includes(itemName)) {
    alert(`You already own the ${itemName}.`);
    return;
  }
  if (coinBalance >= item.cost) {
    coinBalance -= item.cost;
    ownedItems.push(itemName);
    localStorage.setItem("ownedItems", JSON.stringify(ownedItems));
    localStorage.setItem("coinBalance", coinBalance);
    alert(`You bought a ${itemName}! You can now visit the related location.`);
    updateUI();
  } else {
    alert("Not enough coins to buy this item!");
  }
}

function visitLocation(locationName) {
  const loc = locations.find((l) => l.name === locationName);
  if (!ownedItems.includes(loc.requiredItem)) {
    alert(`You need a ${loc.requiredItem} to enter ${loc.name}.`);
    return;
  }

  // Show quest prompt & reward coins on success
  const questSuccess = confirm(`Quest for ${loc.name}:\n${loc.quest}\n\nClick OK if you complete the quest!`);
  if (questSuccess) {
    coinBalance += loc.reward;
    localStorage.setItem("coinBalance", coinBalance);
    alert(`Quest complete! You earned ${loc.reward} coins!`);
    updateUI();
  } else {
    alert("Come back when you complete the quest!");
  }
}

document.getElementById("explore-btn").addEventListener("click", explore);
document.getElementById("shop-btn").addEventListener("click", () => {
  document.getElementById("shop").classList.remove("hidden");
});
document.getElementById("close-shop-btn").addEventListener("click", () => {
  document.getElementById("shop").classList.add("hidden");
});

updateUI();
