var ShipStates = {
  BASE: 0,
  LEFT_ROCKET: 1,
  RIGHT_ROCKET: 2,
  BOTTOM_RIGHT_ROCKET: 3,
  BOTTOM_LEFT_ROCKET: 4,
  EXPLOSION: 5,
  BOTTOM_ROCKET: 6,
  LANDED: 7
};

var GameStates = {
  PLAYING: 0,
  WIN: 1,
  LOSE: 2
};

var LanderGame = function() {
  this.neat = new neataptic.Neat(
      6, // 6 Inputs: Normalized x, y, vx, vy, deltaX to coleta, deltaY to coleta
      3, // 3 Outputs: Thrust left, right, bottom
      null,
      {
          mutation: neataptic.methods.mutation.ALL,
          popsize: 5000,
          mutationRate: 0.3,
          elitism: Math.round(0.1 * 50),
          network: new neataptic.architect.Perceptron(6, 8, 3)
      }
  );
  this.rockets = [];
  this.coleta = { x: 0, y: 0, width: 64, height: 64 };
  this.initRockets();
  this.MAX_LANDING_SPEED = 3;
  this.frameCount = 0; // Frame counter for the 500 frames limit
};

LanderGame.prototype.initRockets = function() {
  this.rockets = this.neat.population.map(() => ({
      posX: this.CANVAS_WIDTH / 2,
      posY: 100,
      vx: 0,
      vy: 0,
      alive: true,
      score: 0,
      shipSpriteState: ShipStates.BASE
  }));
  this.resetColetaPosition();
};

LanderGame.prototype.load = function() {
  this.imgShipSprite = new Image();
  this.imgColeta = new Image();
  var self = this;
  this.imgShipSprite.addEventListener('load', function() {
      self.imgColeta.addEventListener('load', function() {
          self.init();
      });
      self.imgColeta.src = 'img/coleta.png';
  });
  this.imgShipSprite.src = 'img/ship_sprite.png';
};

LanderGame.prototype.init = function() {
  this.CANVAS_WIDTH = 1920;
  this.CANVAS_HEIGHT = 900;
  this.CUR_GRAVITY = -20;
  this.FPS = 60;
  this.PIXEL_RATIO = 5 / 1;
  this.terrainPositions = [];
  this.generateTerrain();
  this.canvas = document.getElementById('GameCanvas').getContext('2d');
  this.gameState = GameStates.PLAYING;
  this.startGeneration();
};

LanderGame.prototype.startGeneration = function() {
  this.initRockets();
  this.frameCount = 0; // Reset the frame counter
  var self = this;
  if (this.gameTimer) clearInterval(this.gameTimer);
  this.gameTimer = setInterval(function() {
      self.update();
      self.draw();
      if (++self.frameCount >= 500) { // Check if the frame limit is reached
          clearInterval(self.gameTimer);
          self.endGeneration(); // End the generation
      }
  }, 1000 / this.FPS);
};

LanderGame.prototype.generateTerrain = function() {
  for (var i = 0; i < 5; i++) {
      this.terrainPositions.push({ x: this.randomRange(i * 200, (i + 1) * 200), y: this.CANVAS_HEIGHT - 80, r: this.randomRange(70, 110) });
  }
};

LanderGame.prototype.draw = function() {
  this.canvas.clearRect(0, 0, this.CANVAS_WIDTH, this.CANVAS_HEIGHT);
  this.canvas.fillStyle = 'gray';
  this.canvas.fillRect(0, this.CANVAS_HEIGHT - 100, this.CANVAS_WIDTH, 100);
  for (var i = 0; i < 5; i++) {
      this.drawCircle(this.terrainPositions[i]);
  }
  this.rockets.forEach((rocket, i) => {
      if (rocket.alive || rocket.shipSpriteState === ShipStates.LANDED) {
          this.drawRocket(rocket, i);
      }
  });
  this.canvas.drawImage(this.imgColeta, this.coleta.x, this.coleta.y, this.coleta.width, this.coleta.height);
  this.drawInfo();
};

LanderGame.prototype.drawRocket = function(rocket, index) {
  if (rocket.shipSpriteState === ShipStates.LANDED) {
      this.canvas.drawImage(this.imgShipSprite, 700, 0, 100, 92, rocket.posX - 50, rocket.posY - 46, 100, 92);
  } else {
      this.canvas.drawImage(this.imgShipSprite, rocket.shipSpriteState * 100, 0, 100, 92, rocket.posX - 50, rocket.posY - 46, 100, 92);
  }
};

LanderGame.prototype.update = function() {
  var allDead = true;
  this.rockets.forEach((rocket, i) => {
      if (!rocket.alive && rocket.shipSpriteState !== ShipStates.LANDED) return;
      allDead = false;
      if (rocket.alive) {
          this.updateRocket(rocket, this.neat.population[i]);
      }
  });
  if (allDead) {
      clearInterval(this.gameTimer);
      this.endGeneration();
  }
};

LanderGame.prototype.updateRocket = function(rocket, genome) {
  var inputs = [
      rocket.posX / this.CANVAS_WIDTH,
      rocket.posY / this.CANVAS_HEIGHT,
      rocket.vx / 10,
      rocket.vy / 10,
      (rocket.posX - (this.coleta.x + this.coleta.width / 2)) / this.CANVAS_WIDTH,
      (rocket.posY - (this.coleta.y + this.coleta.height / 2)) / this.CANVAS_HEIGHT
  ];

  var output = genome.activate(inputs);
  if (output[0] > 0.5) {
      rocket.vx -= 1.5;
      rocket.shipSpriteState = ShipStates.RIGHT_ROCKET;
  }
  if (output[1] > 0.5) {
      rocket.vx += 1.5;
      rocket.shipSpriteState = ShipStates.LEFT_ROCKET;
  }
  if (output[2] > 0.5) {
      rocket.vy -= 2;
      rocket.shipSpriteState = ShipStates.BOTTOM_ROCKET;
  }

  rocket.vy -= this.CUR_GRAVITY / this.FPS;
  rocket.posY += rocket.vy / this.PIXEL_RATIO;
  rocket.posX += rocket.vx / this.PIXEL_RATIO;

  if (rocket.posX < 0 || rocket.posX > this.CANVAS_WIDTH || rocket.posY < 0 || rocket.posY >= this.CANVAS_HEIGHT - 100) {
      rocket.alive = false;
      rocket.shipSpriteState = ShipStates.EXPLOSION;
  }

  this.collisionDetection(rocket);
};

LanderGame.prototype.collisionDetection = function(rocket) {
  for (var i = 0; i < this.terrainPositions.length; i++) {
      var d1 = Math.pow(this.terrainPositions[i].y - (rocket.posY - 3), 2) + Math.pow(this.terrainPositions[i].x - (rocket.posX - 20), 2);
      var d2 = Math.pow(this.terrainPositions[i].y - (rocket.posY - 3), 2) + Math.pow(this.terrainPositions[i].x - (rocket.posX + 20), 2);
      var r2 = Math.pow(this.terrainPositions[i].r, 2);
      if (d1 <= r2 || d2 <= r2) {
          rocket.shipSpriteState = ShipStates.EXPLOSION;
          rocket.alive = false;
      }
  }
};

LanderGame.prototype.drawCircle = function(data) {
  this.canvas.beginPath();
  this.canvas.arc(data.x, data.y, data.r, 0, 2 * Math.PI);
  this.canvas.fillStyle = 'gray';
  this.canvas.fill();
  this.canvas.strokeStyle = 'gray';
  this.canvas.stroke();
};

LanderGame.prototype.drawInfo = function() {
  this.canvas.fillStyle = 'white';
  this.canvas.font = '18px Arial';
  this.canvas.textAlign = 'left';
  this.canvas.fillText('Generation: ' + this.neat.generation, 20, 30);
  var maxFitness = Math.max(...this.neat.population.map(genome => genome.score));
  var avgFitness = this.neat.population.reduce((acc, genome) => acc + genome.score, 0) / this.neat.population.length;
  this.canvas.fillText('Max Fitness: ' + maxFitness.toFixed(2), 20, 60);
  this.canvas.fillText('Average Fitness: ' + avgFitness.toFixed(2), 20, 90);
  this.canvas.fillText('Alive: ' + this.rockets.filter(rocket => rocket.alive).length + '/' + this.neat.popsize, 20, 120);
};

LanderGame.prototype.endGeneration = function() {
  this.evaluateGeneration();
  this.neat.sort();
  var newPopulation = [];
  for (var i = 0; i < this.neat.elitism; i++) {
      newPopulation.push(this.neat.population[i]);
  }
  for (var i = 0; i < this.neat.popsize - this.neat.elitism; i++) {
      newPopulation.push(this.neat.getOffspring());
  }
  this.neat.population = newPopulation;
  this.neat.mutate();
  this.neat.generation++;
  console.log('Generation:', this.neat.generation, '- Best score:', this.neat.population[0].score.toFixed(2));

  this.visualizeNetwork(this.neat.population[0]); // Visualize the best network

  this.startGeneration();
};

LanderGame.prototype.evaluateGeneration = function() {
  this.rockets.forEach((rocket, i) => {
      var score = this.calculateFitness(rocket);
      this.neat.population[i].score = score;
  });
};

LanderGame.prototype.calculateFitness = function(rocket) {
  var distToColeta = Math.sqrt(Math.pow((this.coleta.x + this.coleta.width / 2) - rocket.posX, 2) + Math.pow((this.coleta.y + this.coleta.height / 2) - rocket.posY, 2));
  var fitness = Math.max(0, 1000 - distToColeta); // Higher fitness for being closer to the coleta
  return fitness;
};

LanderGame.prototype.randomRange = function(min, max) {
  return Math.round(Math.random() * (max - min) + min);
};

LanderGame.prototype.resetColetaPosition = function() {
  const margin = 50; 
  const bottomMargin = 150; 
  this.coleta.x = this.randomRange(margin, this.CANVAS_WIDTH - margin - this.coleta.width);
  this.coleta.y = this.randomRange(margin, this.CANVAS_HEIGHT - bottomMargin - this.coleta.height);
};

LanderGame.prototype.saveBestNetwork = function() {
  if (this.neat.population[0]) {
      const bestNetwork = this.neat.population[0];
      localStorage.setItem('bestNetwork', JSON.stringify(bestNetwork.toJSON()));
      console.log('Best network saved');
  }
};

LanderGame.prototype.loadBestNetwork = function() {
  const networkJSON = localStorage.getItem('bestNetwork');
  if (networkJSON) {
      const bestNetwork = neataptic.Network.fromJSON(JSON.parse(networkJSON));
      this.neat.population = [bestNetwork]; // Use a population with a single network
      console.log('Best network loaded');
      this.startGeneration(); // Start the game with the loaded network
  } else {
      console.log('No saved network to load');
  }
};

LanderGame.prototype.visualizeNetwork = function(genome) {
  const network = genome.network || genome;

  const nodes = network.nodes.map((node, index) => ({
      id: index,
      group: node.layer,
      label: node.type || "hidden"
  }));

  // Criando uma mapeamento de índices para os novos índices de nodes
  const indexMapping = new Map(nodes.map((node, index) => [node.id, index]));

  const links = [];
  network.nodes.forEach((node, index) => {
      node.connections.gated.forEach((conn) => {
          if (indexMapping.has(conn.from.index) && indexMapping.has(conn.to.index)) {
              links.push({
                  source: indexMapping.get(conn.from.index),
                  target: indexMapping.get(conn.to.index),
                  value: conn.gain
              });
          }
      });
      node.connections.in.forEach((conn) => {
          if (indexMapping.has(conn.from.index) && indexMapping.has(conn.to.index)) {
              links.push({
                  source: indexMapping.get(conn.from.index),
                  target: indexMapping.get(conn.to.index),
                  value: conn.weight
              });
          }
      });
  });

  const width = 960, height = 500;
  d3.select("#network-visualization").selectAll("*").remove();
  const svg = d3.select("#network-visualization").append("svg")
      .attr("width", width)
      .attr("height", height);
  
  const simulation = d3.forceSimulation(nodes)
      .force("link", d3.forceLink(links).id(d => d.id).distance(50))
      .force("charge", d3.forceManyBody().strength(-500))
      .force("center", d3.forceCenter(width / 2, height / 2));

  const link = svg.append("g")
      .attr("class", "links")
      .selectAll("line")
      .data(links)
      .enter().append("line")
      .attr("stroke-width", d => Math.sqrt(Math.abs(d.value)) * 1.5)
      .attr("stroke", d => d.value > 0 ? "#ffaaaa" : "#aaaaff");

  const node = svg.append("g")
      .attr("class", "nodes")
      .selectAll("g")
      .data(nodes)
      .enter().append("g");
  
  const circles = node.append("circle")
      .attr("r", 5)
      .attr("fill", d => ["#ffaaaa", "#aaaaff", "#aaffaa"][d.group % 3]);

  const labels = node.append("text")
      .text(d => d.label)
      .attr("x", 6)
      .attr("y", 3);
  
  node.append("title")
      .text(d => d.id);

  simulation.on("tick", () => {
      link.attr("x1", d => d.source.x)
          .attr("y1", d => d.source.y)
          .attr("x2", d => d.target.x)
          .attr("y2", d => d.target.y);

      node.attr("transform", d => `translate(${d.x},${d.y})`);
  });
};

window.onload = function() {
  var game = new LanderGame();
  game.load();

  // Add event listeners to the buttons
  document.getElementById('saveButton').addEventListener('click', function() {
      game.saveBestNetwork();
  });

  document.getElementById('loadButton').addEventListener('click', function() {
      game.loadBestNetwork();
  });
};