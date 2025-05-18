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
        quest: "You navigate through the thick forest to find a hidden idol."
    },
    {
        name: "Ancient Castle",
        image: "castle.png",
        requiredItem: "Golden Key",
        reward: 80,
        quest: "Unlock the royal vault using the Golden Key and retrieve a magical scroll."
    },
    {
        name: "Volcanic Crater",
        image: "volcano.png",
        requiredItem: "Fire Charm",
        reward: 100,
        quest: "Withstand the intense heat and rescue a trapped spirit."
    }
];

let collectedTreasures = JSON.parse(localStorage.getItem("collectedTreasures")) || [];
let ownedItems = JSON.parse(localStorage.getItem("ownedItems")) || [];
let coinBalance = parseInt(localStorage.getItem("coinBalance")) || 0;

function updateUI() {
    document.getElementById("coin-balance").innerText = coinBalance;

    const nftList = document.getElementById("nft-list");
    nftList.innerHTML = '';
    collectedTreasures.forEach(treasure => {
        const div = document.createElement("div");
        div.classList.add("nft-item");
        div.innerHTML = `<img src="${treasure.image}" alt="${treasure.name}"><p>${treasure.name}</p>`;
        nftList.appendChild(div);
    });

    const shopItems = document.getElementById("shop-items");
    shopItems.innerHTML = '';
    itemsForSale.forEach(item => {
        const div = document.createElement("div");
        div.classList.add("shop-item");
        div.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <p>${item.name}</p>
            <p>Cost: ${item.cost}</p>
            <button onclick="buyItem('${item.name}')">Buy</button>
        `;
        shopItems.appendChild(div);
    });

    const locButtons = document.getElementById("location-buttons");
    locButtons.innerHTML = '';
    locations.forEach(loc => {
        const div = document.createElement("div");
        div.innerHTML = `
            <img src="${loc.image}" width="100" alt="${loc.name}"><br>
            <button onclick="enterLocation('${loc.name}')">Enter ${loc.name}</button>
        `;
        locButtons.appendChild(div);
    });
}

function explore() {
    const treasure = treasures[Math.floor(Math.random() * treasures.length)];
    collectedTreasures.push(treasure);
    coinBalance += treasure.value;
    localStorage.setItem("collectedTreasures", JSON.stringify(collectedTreasures));
    localStorage.setItem("coinBalance", coinBalance);
    document.getElementById("treasure-info").innerText = `You found a ${treasure.name}!`;
    showTreasureAnimation(treasure);
    updateUI();
}

function showTreasureAnimation(treasure) {
    const div = document.getElementById("treasure-animation");
    div.innerHTML = `<img src="${treasure.image}" alt="${treasure.name}" style="width:100px;">`;
    div.style.display = 'block';
    setTimeout(() => div.style.display = 'none', 1500);
}

function buyItem(itemName) {
    const item = itemsForSale.find(i => i.name === itemName);
    if (coinBalance >= item.cost) {
        ownedItems.push(item.name);
        coinBalance -= item.cost;
        localStorage.setItem("ownedItems", JSON.stringify(ownedItems));
        localStorage.setItem("coinBalance", coinBalance);
        alert(`You purchased a ${item.name}!`);
        updateUI();
    } else {
        alert("Not enough coins!");
    }
}

function enterLocation(name) {
    const location = locations.find(loc => loc.name === name);
    if (!ownedItems.includes(location.requiredItem)) {
        alert(`You need a ${location.requiredItem} to access this location.`);
        return;
    }

    document.getElementById("location-title").innerText = location.name;
    document.getElementById("location-description").innerText = location.quest;
    document.getElementById("location-quest").style.display = "block";

    document.getElementById("complete-quest-btn").onclick = function() {
        coinBalance += location.reward;
        localStorage.setItem("coinBalance", coinBalance);
        alert(`Quest complete! You earned ${location.reward} coins.`);
        document.getElementById("location-quest").style.display = "none";
        updateUI();
    };
}

document.getElementById("explore-btn").addEventListener("click", explore);
document.getElementById("shop-btn").addEventListener("click", () => document.getElementById("shop").style.display = "block");
document.getElementById("close-shop-btn").addEventListener("click", () => document.getElementById("shop").style.display = "none");
document.getElementById("exit-location-btn").addEventListener("click", () => document.getElementById("location-quest").style.display = "none");

updateUI();
