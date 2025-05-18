const treasures = [
  { name: "Gold Coin", image: "gold-coin.png", value: 10 },
  { name: "Silver Sword", image: "silver-sword.png", value: 20 },
  { name: "Diamond Ring", image: "diamond-ring.png", value: 50 },
  { name: "Magic Potion", image: "magic-potion.png", value: 30 },
  { name: "Ancient Artifact", image: "ancient-artifact.png", value: 100 }
];

const itemsForSale = [
  { name: "Mystic Map", image: "mystic-map.png", cost: 30 },
  { name: "Golden Key", image: "golden-key.png", cost: 50 },
  { name: "Fire Charm", image: "fire-charm.png", cost: 60 }
];

const locations = [
  { name: "Mystic Forest", image: "forest.png", requiredItem: "Mystic Map", reward: 40 },
  { name: "Ancient Castle", image: "castle.png", requiredItem: "Golden Key", reward: 80 },
  { name: "Volcanic Crater", image: "volcano.png", requiredItem: "Fire Charm", reward: 100 }
];

let collectedTreasures = JSON.parse(localStorage.getItem("collectedTreasures")) || [];
let ownedItems = JSON.parse(localStorage.getItem("ownedItems")) || [];
let coinBalance = parseInt(localStorage.getItem("coinBalance")) || 0;

function updateUI() {
  document.getElementById("coin-balance").innerText = coinBalance;

  const nftList = document.getElementById("nft-list");
  nftList.innerHTML = '';
  collectedTreasures.forEach(t => {
    const item = document.createElement('div');
    item.classList.add('nft-item');
    item.innerHTML = `<img src="${t.image}" alt="${t.name}"><p>${t.name}</p>`;
    nftList.appendChild(item);
  });

  const shop = document.getElementById("shop-items");
  shop.innerHTML = '';
  itemsForSale.forEach(i => {
    const div = document.createElement('div');
    div.classList.add('shop-item');
    div.innerHTML = `
      <img src="${i.image}" alt="${i.name}">
      <p>${i.name}</p>
      <p>Cost: ${i.cost} coins</p>
      <button onclick="buyItem('${i.name}')">Buy</button>
    `;
    shop.appendChild(div);
  });

  const locationDiv = document.getElementById("location-buttons");
  locationDiv.innerHTML = '';
  locations.forEach(loc => {
    const div = document.createElement('div');
    div.innerHTML = `
      <img src="${loc.image}" alt="${loc.name}" width="100"><br>
      <button onclick="visitLocation('${loc.name}')">Visit ${loc.name}</button>
    `;
    locationDiv.appendChild(div);
  });
}

function explore() {
  const treasure = treasures[Math.floor(Math.random() * treasures.length)];
  collectedTreasures.push(treasure);
  coinBalance += treasure.value;

  document.getElementById("treasure-info").innerText = `You found a ${treasure.name} (+${treasure.value} coins)!`;
  showTreasureAnimation(treasure);

  localStorage.setItem("collectedTreasures", JSON.stringify(collectedTreasures));
  localStorage.setItem("coinBalance", coinBalance);
  updateUI();
}

function showTreasureAnimation(treasure) {
  const div = document.getElementById("treasure-animation");
  div.innerHTML = `<img src="${treasure.image}" alt="${treasure.name}">`;
  div.style.display = "block";
  setTimeout(() => div.style.display = "none", 1500);
}

function buyItem(itemName) {
  const item = itemsForSale.find(i => i.name === itemName);
  if (coinBalance >= item.cost) {
    coinBalance -= item.cost;
    ownedItems.push(item.name);
    localStorage.setItem("ownedItems", JSON.stringify(ownedItems));
    localStorage.setItem("coinBalance", coinBalance);
    alert(`You bought a ${item.name}!`);
    updateUI();
  } else {
    alert("Not enough coins!");
  }
}

function visitLocation(locationName) {
  const loc = locations.find(l => l.name === locationName);
  if (ownedItems.includes(loc.requiredItem)) {
    coinBalance += loc.reward;
    localStorage.setItem("coinBalance", coinBalance);
    alert(`You visited ${loc.name} and earned ${loc.reward} coins!`);
    updateUI();
  } else {
    alert(`You need a ${loc.requiredItem} to enter ${loc.name}.`);
  }
}

document.getElementById("explore-btn").addEventListener("click", explore);
document.getElementById("shop-btn").addEventListener("click", () => document.getElementById("shop").style.display = "block");
document.getElementById("close-shop-btn").addEventListener("click", () => document.getElementById("shop").style.display = "none");

updateUI();

