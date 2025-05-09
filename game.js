const treasures = [
    { name: "Gold Coin", image: "gold-coin.png", rarity: "common", value: 10 },
    { name: "Silver Sword", image: "silver-sword.png", rarity: "common", value: 20 },
    { name: "Diamond Ring", image: "diamond-ring.png", rarity: "rare", value: 50 },
    { name: "Magic Potion", image: "magic-potion.png", rarity: "rare", value: 30 },
    { name: "Ancient Artifact", image: "ancient-artifact.png", rarity: "epic", value: 100 }
];

const itemsForSale = [
    { name: "Mystic Map", image: "mystic-map.png", cost: 30 },
    { name: "Golden Key", image: "golden-key.png", cost: 50 }
];

const locations = [
    { name: "Mystic Forest", image: "forest.png", requiredItem: "Mystic Map", reward: 40 },
    { name: "Ancient Castle", image: "castle.png", requiredItem: "Golden Key", reward: 80 },
    { name: "Volcanic Crater", image: "volcano.png", requiredItem: "Magic Potion", reward: 100 }
];

let collectedTreasures = JSON.parse(localStorage.getItem("collectedTreasures")) || [];
let ownedItems = JSON.parse(localStorage.getItem("ownedItems")) || [];
let coinBalance = parseInt(localStorage.getItem("coinBalance")) || 0;

function updateUI() {
    document.getElementById("coin-balance").innerText = coinBalance;

    const nftList = document.getElementById("nft-list");
    nftList.innerHTML = '';
    collectedTreasures.forEach((treasure) => {
        const nftItem = document.createElement('div');
        nftItem.classList.add('nft-item');
        nftItem.innerHTML = `
            <img src="${treasure.image}" alt="${treasure.name}">
            <p>${treasure.name}</p>
        `;
        nftList.appendChild(nftItem);
    });

    const shopItemsContainer = document.getElementById("shop-items");
    shopItemsContainer.innerHTML = '';
    itemsForSale.forEach(item => {
        const shopItemDiv = document.createElement('div');
        shopItemDiv.classList.add('shop-item');
        shopItemDiv.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <p>${item.name}</p>
            <p>Cost: ${item.cost} coins</p>
            <button onclick="selectItemToBuy('${item.name}')">Buy</button>
        `;
        shopItemsContainer.appendChild(shopItemDiv);
    });

    const locationContainer = document.getElementById("location-buttons");
    locationContainer.innerHTML = '';
    locations.forEach(location => {
        const locDiv = document.createElement('div');
        locDiv.innerHTML = `
            <img src="${location.image}" alt="${location.name}" width="100"><br>
            <button onclick="visitLocation('${location.name}')">Visit ${location.name}</button>
        `;
        locationContainer.appendChild(locDiv);
    });
}

function explore() {
    const randomTreasure = treasures[Math.floor(Math.random() * treasures.length)];
    coinBalance += randomTreasure.value;
    document.getElementById("treasure-info").innerText = `You found a ${randomTreasure.name}!`;
    showTreasureAnimation(randomTreasure);
    collectedTreasures.push(randomTreasure);
    localStorage.setItem("collectedTreasures", JSON.stringify(collectedTreasures));
    localStorage.setItem("coinBalance", coinBalance);
    updateUI();
}

function showTreasureAnimation(treasure) {
    const animationDiv = document.getElementById("treasure-animation");
    animationDiv.innerHTML = `<img src="${treasure.image}" alt="${treasure.name}">`;
    animationDiv.style.display = "block";
    setTimeout(() => {
        animationDiv.style.display = "none";
    }, 1000);
}

function selectItemToBuy(itemName) {
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
    const location = locations.find(l => l.name === locationName);
    if (ownedItems.includes(location.requiredItem)) {
        coinBalance += location.reward;
        localStorage.setItem("coinBalance", coinBalance);
        alert(`You survived ${location.name} and earned ${location.reward} coins!`);
        updateUI();
    } else {
        alert(`You need a ${location.requiredItem} to visit ${location.name}.`);
    }
}

document.getElementById("explore-btn").addEventListener("click", explore);
document.getElementById("shop-btn").addEventListener("click", () => document.getElementById("shop").style.display = "block");
document.getElementById("close-shop-btn").addEventListener("click", () => document.getElementById("shop").style.display = "none");

updateUI();
