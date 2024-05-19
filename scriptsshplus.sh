<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Pong Game with NEAT</title>
    <style>
        html, body {
            margin: 0;
            padding: 0;
            overflow: hidden;
            background-color: #1a1a2e;
            color: #fff;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100%;
            font-family: Arial, sans-serif;
        }
        canvas {
            border: 10px solid #0f3460;
            border-radius: 15px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
            background-color: #16213e;
        }
        .scoreboard {
            position: absolute;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            font-size: 24px;
            color: #e94560;
        }
        .controls {
            display: flex;
            flex-direction: column;
            align-items: center;
            margin-top: 20px;
        }
        .control-group {
            margin: 10px 0;
        }
        .control-group label {
            margin-right: 10px;
        }
        .control-group input {
            padding: 5px;
            border: 2px solid #0f3460;
            border-radius: 5px;
            background-color: #16213e;
            color: #fff;
        }
        .control-group button {
            padding: 8px 15px;
            margin-left: 10px;
            border: 2px solid #0f3460;
            border-radius: 5px;
            background-color: #e94560;
            color: #fff;
            cursor: pointer;
        }
        .control-group button:hover {
            background-color: #d62a4b;
        }
    </style>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/neataptic/1.4.4/neataptic.js"></script>
</head>
<body>
    <div class="scoreboard" id="scoreboard">Training Generation...</div>
    <canvas id="pongCanvas" width="800" height="600"></canvas>
    <div class="controls">
        <div class="control-group">
            <label for="populationSize">Population Size:</label>
            <input type="number" id="populationSize" value="50">
        </div>
        <div class="control-group">
            <label for="mutationRate">Mutation Rate:</label>
            <input type="number" id="mutationRate" value="0.05" step="0.01" min="0" max="1">
        </div>
        <div class="control-group">
            <label for="elitismPercent">Elitism Percent:</label>
            <input type="number" id="elitismPercent" value="0.2" step="0.01" min="0" max="1">
        </div>
        <div class="control-group">
            <button onclick="resetTraining()">Reset Training</button>
            <button onclick="startGame()">Start</button>
            <button onclick="pauseGame()">Pause</button>
            <button onclick="speedUp()">Speed Up</button>
            <button onclick="normalSpeed()">Normal Speed</button>
        </div>
    </div>
    <script>
        const canvas = document.getElementById('pongCanvas');
        const ctx = canvas.getContext('2d');
        const scoreboard = document.getElementById('scoreboard');

        const paddleWidth = 10;
        const paddleHeight = 100;
        const ballRadius = 10;

        let player1Y = (canvas.height - paddleHeight) / 2;
        let player2Y = (canvas.height - paddleHeight) / 2;
        let player1Score = 0;
        let player2Score = 0;

        let ballX = canvas.width / 2;
        let ballY = canvas.height / 2;
        let ballSpeedX = 5;
        let ballSpeedY = 3;

        const paddleSpeed = 8;

        // NEATaptic Configuration
        const neataptic = window.neataptic;
        const Neat = neataptic.Neat;
        const Methods = neataptic.methods;

        const INPUT_SIZE = 6; // Simplified number of inputs
        const OUTPUT_SIZE = 1;

        let neat;
        let currentGeneration = 0;
        let currentGenomeIndex = 0;
        let highScore = 0;

        let intervalId;
        let gameSpeed = 1000 / 60; // Default game speed
        let gamePaused = false;
        let gameRunning = false;

        let consecutiveHits = 0; // Count consecutive hits by the neural network

        function initializeNeat() {
            const POPULATION_SIZE = parseInt(document.getElementById('populationSize').value);
            const MUTATION_RATE = parseFloat(document.getElementById('mutationRate').value);
            const ELITISM_PERCENT = parseFloat(document.getElementById('elitismPercent').value);

            neat = new Neat(
                INPUT_SIZE,
                OUTPUT_SIZE,
                null,
                {
                    mutation: [
                        Methods.mutation.ADD_NODE,
                        Methods.mutation.SUB_NODE,
                        Methods.mutation.ADD_CONN,
                        Methods.mutation.SUB_CONN,
                        Methods.mutation.MOD_WEIGHT,
                        Methods.mutation.MOD_BIAS,
                        Methods.mutation.MOD_ACTIVATION,
                        Methods.mutation.ADD_SELF_CONN,
                        Methods.mutation.SUB_SELF_CONN,
                        Methods.mutation.ADD_GATE,
                        Methods.mutation.SUB_GATE,
                        Methods.mutation.ADD_BACK_CONN,
                        Methods.mutation.SUB_BACK_CONN
                    ],
                    popsize: POPULATION_SIZE,
                    mutationRate: MUTATION_RATE,
                    elitism: Math.round(ELITISM_PERCENT * POPULATION_SIZE),
                    network: new neataptic.architect.Random(
                        INPUT_SIZE,
                        20, // Hidden nodes
                        OUTPUT_SIZE
                    )
                }
            );

            currentGeneration = 0;
            currentGenomeIndex = 0;
            highScore = 0;
            neat.population.forEach(genome => genome.score = 0);
            updateScoreboard();
        }

        function updateScoreboard() {
            scoreboard.innerText = `Generation: ${currentGeneration} | High Score: ${highScore}`;
        }

        initializeNeat();

        function drawRect(x, y, width, height, color) {
            ctx.fillStyle = color;
            ctx.fillRect(x, y, width, height);
        }

        function drawCircle(x, y, radius, color) {
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2, true);
            ctx.fill();
        }

        function drawText(text, x, y, color) {
            ctx.fillStyle = color;
            ctx.font = '20px Arial';
            ctx.fillText(text, x, y);
        }

        function drawNet() {
            for (let i = 0; i < canvas.height; i += 15) {
                drawRect(canvas.width / 2 - 1, i, 2, 10, '#fff');
            }
        }

        function drawEverything() {
            drawRect(0, 0, canvas.width, canvas.height, '#16213e');
            drawNet();
            drawRect(0, player1Y, paddleWidth, paddleHeight, '#e94560');
            drawRect(canvas.width - paddleWidth, player2Y, paddleWidth, paddleHeight, '#0f3460');
            drawCircle(ballX, ballY, ballRadius, '#fff');
            drawText(`Player 1: ${player1Score}`, 50, 50, '#e94560');
            drawText(`Player 2: ${player2Score}`, canvas.width - 200, 50, '#0f3460');
        }

        function moveEverything() {
            ballX += ballSpeedX;
            ballY += ballSpeedY;

            if (ballY - ballRadius < 0 || ballY + ballRadius > canvas.height) {
                ballSpeedY = -ballSpeedY;
            }

            if (ballX - ballRadius < paddleWidth) {
                if (ballY > player1Y && ballY < player1Y + paddleHeight) {
                    ballSpeedX = -ballSpeedX;
                    const deltaY = ballY - (player1Y + paddleHeight / 2);
                    ballSpeedY = deltaY * 0.35;
                    neat.population[currentGenomeIndex].score += 10;
                    consecutiveHits++;
                    if (consecutiveHits > 1) {
                        neat.population[currentGenomeIndex].score += 500 * consecutiveHits;
                        console.log('Consecutive Hits:', consecutiveHits, 'Bonus Score:', 500 * consecutiveHits);
                    }
                } else {
                    player2Score++;
                    neat.population[currentGenomeIndex].score -= 50;
                    consecutiveHits = 0;
                    evaluateGenome();
                }
            }

            if (ballX + ballRadius > canvas.width - paddleWidth) {
                if (ballY > player2Y && ballY < player2Y + paddleHeight) {
                    ballSpeedX = -ballSpeedX;
                } else {
                    player1Score++;
                    neat.population[currentGenomeIndex].score += 20;
                    consecutiveHits = 0;
                    evaluateGenome();
                }
            }

            const inputs = [
                player1Y / canvas.height,
                ballY / canvas.height,
                ballX / canvas.width,
                ballSpeedX / 10,
                ballSpeedY / 10,
                (ballY - (player1Y + paddleHeight / 2)) / canvas.height
            ];

            const output = neat.population[currentGenomeIndex].activate(inputs)[0];

            if (output > 0.5) {
                player1Y += paddleSpeed;
            } else if (output < 0.5) {
                player1Y -= paddleSpeed;
            }

            player1Y = Math.max(Math.min(player1Y, canvas.height - paddleHeight), 0);

            // Simple AI for Player 2
            if (player2Y + paddleHeight / 2 < ballY) {
                player2Y += paddleSpeed;
            } else if (player2Y + paddleHeight / 2 > ballY) {
                player2Y -= paddleSpeed;
            }

            player2Y = Math.max(Math.min(player2Y, canvas.height - paddleHeight), 0);
        }

        function evaluateGenome() {
            if (currentGenomeIndex < neat.population.length - 1) {
                currentGenomeIndex++;
            } else {
                neat.sort();
                const newPopulation = [];

                for (let i = 0; i < neat.elitism; i++) {
                    newPopulation.push(neat.population[i]);
                }

                for (let i = 0; i < neat.popsize - neat.elitism; i++) {
                    newPopulation.push(neat.getOffspring());
                }

                neat.population = newPopulation;
                neat.mutate();
                currentGenomeIndex = 0;
                currentGeneration++;
                highScore = Math.max(highScore, neat.getFittest().score);
            }

            resetBallAndPaddles();
            updateScoreboard();
        }

        function resetBallAndPaddles() {
            ballX = canvas.width / 2;
            ballY = canvas.height / 2;
            ballSpeedX = 5;
            ballSpeedY = (Math.random() * 2 - 1) * 3;
            player1Y = (canvas.height - paddleHeight) / 2;
            player2Y = (canvas.height - paddleHeight) / 2;
        }

        function gameLoop() {
            if (!gamePaused) {
                moveEverything();
                drawEverything();
            }
        }

        function startGame() {
            if (!gameRunning) {
                intervalId = setInterval(gameLoop, gameSpeed);
                gameRunning = true;
            }
        }

        function pauseGame() {
            clearInterval(intervalId);
            gameRunning = false;
        }

        function resetTraining() {
            initializeNeat();
            resetBallAndPaddles();
            player1Score = 0;
            player2Score = 0;
            updateScoreboard();
        }

        function speedUp() {
            clearInterval(intervalId);
            gameSpeed = 1000 / 990;
            startGame();
        }

        function normalSpeed() {
            clearInterval(intervalId);
            gameSpeed = 1000 / 60;
            startGame();
        }

        document.getElementById('populationSize').addEventListener('change', resetTraining);
        document.getElementById('mutationRate').addEventListener('change', resetTraining);
        document.getElementById('elitismPercent').addEventListener('change', resetTraining);

        startGame();
    </script>
</body>
</html>
