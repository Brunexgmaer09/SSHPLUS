window.onload = function() {
    var canvas = document.getElementById('gameCanvas');
    var ctx = canvas.getContext('2d');

    // Carregue a imagem de fundo
    var background = new Image();
    background.src = 'fundo.png';

    // Carregue a sprite do foguete
    var rocket = new Image();
    rocket.src = 'foguete.png';
    // Carregue a sprite do foguete acelerando
    var rocketAccelerating = new Image();
    rocketAccelerating.src = 'foguete_acelerando.png';
    // Carregue a sprite do navio
    var ship = new Image();
    ship.src = 'navio.png';
    // Carregue a sprite da coleta
    var coleta = new Image();
    coleta.src = 'coleta.png';

    // Posição inicial da coleta
    var coletaX = Math.random() * canvas.width;
    var coletaY = Math.random() * canvas.height / 2; // A coleta aparecerá na metade superior do mapa

    // Velocidade da coleta
    var coletaSpeedX = 2;
    var coletaSpeedY = 1;

    // Posição e velocidade do foguete
    var rocketX = 190;
    var rocketY = canvas.height - 200; // Posição inicial do foguete
    var rocketSpeedX = 0;
    var rocketSpeedY = 0;
    var drag = 0.99;

    // Posição do navio
    var shipX = 90; // A mesma posição x da plataforma
    var shipY = 1030 - ship.height; // Posição y é a posição y da plataforma menos a altura do navio

    // Gravidade
    var gravity = 0.5;
    // Adicione uma nova variável para o ângulo do foguete
    var rocketAngle = 0;

    // Controles
    var upPressed = false;
    var leftPressed = false;
    var rightPressed = false;

    window.onkeydown = function(e) {
        if (e.key == ' ') upPressed = true;
        if (e.key == 'a') leftPressed = true;
        if (e.key == 'd') rightPressed = true;
    }

    window.onkeyup = function(e) {
        if (e.key == ' ') upPressed = false;
        if (e.key == 'a') leftPressed = false;
        if (e.key == 'd') rightPressed = false;
    }

    // Desenhe a imagem de fundo quando ela for carregada
    background.onload = function() {
        ctx.drawImage(background, 0, 0, background.width, background.height, 0, 0, canvas.width, canvas.height);
    }

    // Desenhe a sprite do foguete quando ela for carregada
    rocket.onload = function() {
        ctx.drawImage(rocket, 50, 50, 100, 130);
    }
    // Desenhe a sprite do navio quando ela for carregada
ship.onload = function() {
    ctx.drawImage(ship, shipX, shipY, ship.width, ship.height);
}

// Atualize o jogo aqui
function gameLoop() {
    // Limpe o canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Desenhe o fundo
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

    var platformY = 950; // Defina a posição y da plataforma (parte inferior do canvas)
    // Atualize a posição e velocidade do foguete
    if (upPressed) {
        var thrust = 1.0;
        rocketSpeedX += thrust * Math.sin(rocketAngle);
        rocketSpeedY -= thrust * Math.cos(rocketAngle);
    }
    if (leftPressed) { rocketAngle -= 0.05; }
    if (rightPressed) { rocketAngle += 0.05; }
    rocketSpeedX *= drag;
    rocketSpeedY += gravity;
    // Atualize a posição da coleta
    coletaX += coletaSpeedX;
    coletaY += coletaSpeedY;
    // Inverta a direção da coleta quando ela atingir a borda do mapa
    if (coletaX < 0 || coletaX > canvas.width - coleta.width) {
        coletaSpeedX = -coletaSpeedX;
    }
    if (coletaY < 0 || coletaY > canvas.height / 2) {
        coletaSpeedY = -coletaSpeedY;
    }
    
    // Verifique se o foguete está tentando mover-se para baixo e está na plataforma
    if (rocketSpeedY > 0 && rocketY + 108 >= platformY) {
        rocketY = platformY - 108; // Defina a posição y do foguete para a posição y da plataforma
        rocketSpeedY = 0; // Defina a velocidade y do foguete para 0
    } else {
        rocketX += rocketSpeedX;
        rocketY += rocketSpeedY;
    }

    // Mantenha o foguete dentro dos limites da tela
    if (rocketX < 0) rocketX = 0;
    if (rocketY < 0) rocketY = 0;
    if (rocketX > canvas.width - 30) rocketX = canvas.width - 30;
    if (rocketY > canvas.height - 50) rocketY = canvas.height - 50;

    // Desenhe o foguete
    ctx.save(); // Salve o estado atual do contexto
    ctx.translate(rocketX + 50, rocketY + 65);  // Mova o ponto de origem para o centro do foguete
    ctx.rotate(rocketAngle); // Rotacione o contexto

    // Se a tecla espaço estiver pressionada, desenhe a sprite do foguete acelerando
    // Caso contrário, desenhe a sprite normal do foguete
    if (upPressed) {
        ctx.drawImage(rocketAccelerating, -275, -150, 550, 300);
    } else {
        ctx.drawImage(rocket, -275, -150, 550, 300);
    }
         
    ctx.restore(); // Restaure o estado original do contexto

    // Desenhe o navio
    ctx.drawImage(ship, shipX, shipY, ship.width, ship.height);
    // Desenhe a coleta
    ctx.drawImage(coleta, coletaX, coletaY, coleta.width, coleta.height);

    // Verifique se o foguete está dentro da coleta
    if (rocketX < coletaX + coleta.width &&
        rocketX + rocket.width > coletaX &&
        rocketY < coletaY + coleta.height &&
        rocketY + rocket.height > coletaY) {
        // O foguete está dentro da coleta, então aumente o contador de tempo
        timer++;
    } else {
        // O foguete não está dentro da coleta, então resete o contador de tempo
        timer = 0;
    }

    // Verifique se o foguete ficou dentro da coleta por 10 segundos
    if (timer >= 600) { // 60 frames por segundo * 10 segundos = 600 frames
        console.log('Você ganhou!');
    }
    
    requestAnimationFrame(gameLoop);
}

gameLoop();
}