
const fs = require('fs');

const mockData = {
  planets: [
    { planet: "Sun", house_placed: 10, sign: "Sagittarius", sign_lord: "Jupiter", degree_decimal: 270.5 },
    { planet: "Moon", house_placed: 11, sign: "Capricorn", sign_lord: "Saturn", degree_decimal: 305 },
    { planet: "Mars", house_placed: 9, sign: "Scorpio", sign_lord: "Mars", degree_decimal: 245 },
    { planet: "Mercury", house_placed: 10, sign: "Sagittarius", sign_lord: "Jupiter", degree_decimal: 265 },
    { planet: "Jupiter", house_placed: 3, sign: "Taurus", sign_lord: "Venus", degree_decimal: 45 },
    { planet: "Venus", house_placed: 11, sign: "Capricorn", sign_lord: "Saturn", degree_decimal: 315 },
    { planet: "Saturn", house_placed: 10, sign: "Sagittarius", sign_lord: "Jupiter", degree_decimal: 285 },
    { planet: "Rahu", house_placed: 11, sign: "Capricorn", sign_lord: "Saturn", degree_decimal: 320 },
    { planet: "Ketu", house_placed: 5, sign: "Cancer", sign_lord: "Moon", degree_decimal: 140 }
  ],
  houses: [
    { house_number: 1, sign_lord: "Jupiter" },
    { house_number: 2, sign_lord: "Mars" },
    { house_number: 3, sign_lord: "Venus" },
    { house_number: 4, sign_lord: "Mercury" },
    { house_number: 5, sign_lord: "Moon" },
    { house_number: 6, sign_lord: "Sun" },
    { house_number: 7, sign_lord: "Mercury" },
    { house_number: 8, sign_lord: "Venus" },
    { house_number: 9, sign_lord: "Mars" },
    { house_number: 10, sign_lord: "Jupiter" },
    { house_number: 11, sign_lord: "Saturn" },
    { house_number: 12, sign_lord: "Saturn" },
  ]
};

const normalize = (name) => name?.split(' ')[0]?.trim();

const occupiedHouses = new Set();
mockData.planets.forEach((p) => {
  const pName = normalize(p.planet);
  if (pName !== 'Rahu' && pName !== 'Ketu') {
    occupiedHouses.add(p.house_placed);
  }
});

const houseOwners = new Map();
mockData.houses.forEach((h) => {
  const owner = normalize(h.sign_lord);
  if (!houseOwners.has(owner)) houseOwners.set(owner, []);
  houseOwners.get(owner).push(h.house_number);
});

const getAgents = (nodePlanet) => {
  const node = mockData.planets.find((p) => normalize(p.planet) === nodePlanet);
  if (!node) return [];

  const agents = new Set();
  if (node.sign_lord) agents.add(normalize(node.sign_lord));

  mockData.planets.forEach((p) => {
    const pName = normalize(p.planet);
    if (pName !== nodePlanet && pName !== 'Rahu' && pName !== 'Ketu' && p.house_placed === node.house_placed) {
      agents.add(pName);
    }
  });

  mockData.planets.forEach((p) => {
    const pName = normalize(p.planet);
    if (pName === nodePlanet || pName === 'Rahu' || pName === 'Ketu') return;
    
    // In KP, aspects are strictly counted by house position (1 to 12).
    // Node is in house N, Planet is in house P.
    // Distance from P to N (inclusively counting P as 1)
    const dist = (node.house_placed - p.house_placed + 12) % 12 + 1;
    let isAspecting = (dist === 7); 
    if (pName === 'Mars' && (dist === 4 || dist === 8)) isAspecting = true;
    if (pName === 'Jupiter' && (dist === 5 || dist === 9)) isAspecting = true;
    if (pName === 'Saturn' && (dist === 3 || dist === 10)) isAspecting = true;
    
    if (isAspecting) agents.add(pName);
  });

  return Array.from(agents);
};

const calculateNodeHouses = (nodePlanet, agents) => {
  const node = mockData.planets.find((p) => normalize(p.planet) === nodePlanet);
  const resultHouses = new Map();
  
  if (node) {
    resultHouses.set(node.house_placed, { house: node.house_placed, is_placed: true });
  }

  agents.forEach(agentName => {
    const agentData = mockData.planets.find((p) => normalize(p.planet) === agentName);
    if (!agentData) return;

    if (!resultHouses.has(agentData.house_placed)) {
      resultHouses.set(agentData.house_placed, { house: agentData.house_placed, is_placed: false });
    }

    const owned = houseOwners.get(agentName) || [];
    owned.forEach(hNum => {
      // ONLY add owned house if it's Vacant (not in occupied houses)
      if (!occupiedHouses.has(hNum)) {
         resultHouses.set(hNum, { house: hNum, is_placed: false });
      }
    });
  });

  return Array.from(resultHouses.values()).map(r => r.house).sort((a, b) => a - b);
};

console.log("Rahu Agents:", getAgents("Rahu"));
console.log("Rahu Final:", calculateNodeHouses("Rahu", getAgents("Rahu")));

console.log("Ketu Agents:", getAgents("Ketu"));
console.log("Ketu Final:", calculateNodeHouses("Ketu", getAgents("Ketu")));
