'use strict';
const WebSocket = require('ws');
const Socks = require('socks');
const SocksProxyAgent = require('socks-proxy-agent');
const HttpsProxyAgent = require('https-proxy-agent');
const colors = require('colors');
const readline = require('readline');
const port = 8080;
const chalk = require('chalk');
const asciiArt = require('ascii-art');
const io = require('socket.io')(port);
const fs = require('fs');
var boostState = {};
var isEPressed = false;
let bots = [];
let server = "";
let origin = null;
let xPos, yPos, byteLength = 90;
let connectedCount = 0;
let botCount = 612;
let client = null;
let users = 0;
let isZigZag = false; // Adicione uma nova variável para rastrear o estado do zigue-zague
let isCPressed = false;
let isBPressed = false;
let targetXPos, targetYPos;
let fixedDirection = null;
let globalFixedDirection = null;
let proxies = fs.readFileSync("proxies.txt", "utf8").split("\n").filter(a => !!a);
let Proxies = fs.readFileSync("httpProxy.txt", "utf8").split("\n").filter(a => !!a);

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getHost(a) {
    a = a.replace(/[/slither]/g, '');
    a = a.replace(/[ws]/g, '');
    a = a.replace(/[/]/g, '');
    a = a.substr(1);
    return a;
}

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  

function lerp(a, b, t) {
    return a + (b - a) * t;
}

function createAgent(b) {
    let proxy = b.split(':');
    return new Socks.Agent({
        proxy: {
            ipaddress: proxy[0],
            port: parseInt(proxy[1]),
            type: parseInt(proxy[2]) || 5
        }
    });
}

function getRandomCoordinates() {
    let maxX = 125;
    let maxY = 125;
    let snakeX = Math.floor(Math.random() * maxX);
    let snakeY = Math.floor(Math.random() * maxY);
    return [snakeX, snakeY];
}

function createHttpAgent(b) {
    var proxy = b.split(':');
    return new HttpsProxyAgent("http://" + proxy[0] + ":" + proxy[1]);
}

function Bot(id) {
    this.id = id;
    this.connect();
    this.fixedDirection = globalFixedDirection;
    this.isBoosting = false; // Adicione esta linha aqui
    this.shouldRandomize = false; // Adicione esta linha aqui
}

Bot.prototype = {
    needPing: false,
    snakeID: null,
    snakeX: 0,
    snakeY: 0,
    headX: 0,
    headY: 0,
    snakeAngle: 0,
    haveSnakeID: false,
    isBoost: false,
    hasConnected: false,
    send: function (buf) {
        if (!this.ws || this.ws.readyState !== WebSocket.OPEN)
            return;
        this.ws.send(buf);
    },
    connect: function() {
        if (Math.random() >= 0.5) {
            this.ws = new WebSocket(server, {
                headers: {
                    'Origin': origin,
                    'Accept-Encoding': 'gzip, deflate',
                    'Accept-Language': 'en-US,en;q=0.8',
                    'Cache-Control': 'no-cache',
                    'Connection': 'Upgrade',
                    'Host': getHost(server),
                    'Pragma': 'no-cache',
                    'Upgrade': 'websocket',
                    'Sec-WebSocket-Version': '13',
                    'Sec-WebSocket-Extensions': 'permessage-deflate; client_max_window_bits',
                    'User-Agent': 'Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/localhost Safari/537.36'
                },
                agent: createAgent(proxies[~~(Math.random() * proxies.length)])
            });
        } else {
            this.ws = new WebSocket(server, {
                headers: {
                    'Origin': origin,
                    'Accept-Encoding': 'gzip, deflate',
                    'Accept-Language': 'en-US,en;q=0.8',
                    'Cache-Control': 'no-cache',
                    'Connection': 'Upgrade',
                    'Host': getHost(server),
                    'Pragma': 'no-cache',
                    'Upgrade': 'websocket',
                    'Sec-WebSocket-Version': '13',
                    'Sec-WebSocket-Extensions': 'permessage-deflate; client_max_window_bits',
                    'User-Agent': 'Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/localhost Safari/537.36'
                },
                agent: createHttpAgent(Proxies[~~(Math.random() * Proxies.length)])
            });
        }
    
        this.binaryType = "nodebuffer";
        this.ws.onmessage = this.onMessage.bind(this);
        this.ws.onopen = this.onOpen.bind(this);
        this.ws.onclose = this.onClose.bind(this);
        this.ws.onerror = this.onError.bind(this);
    },
    
    
    setRandomMovement: function(shouldRandomize) {
        this.shouldRandomize = shouldRandomize;
    },

    spawn: function() {
      
        const nomes = fs.readFileSync('Nomes.txt', 'utf8').split('\n');
        const maxNameLength = 40;      
        const randomNameIndex = getRandomInt(0, nomes.length - 1);
        let randomName = nomes[randomNameIndex].substr(0, maxNameLength).trim();   
        randomName = randomName.padEnd(maxNameLength, ' ');     
        randomName = randomName.replace(/^\s+|\*\s*$/g, '');    
        // Define a cor específica para todos os bots
        const colors = [[255,255,255,0,0,0,255,255,1,9,19,8,1,9,1,8,1,9,1,8,1,9,16,8,1,9,1,8,1,9,1,8,1,9,146,8],
        [255,255,255,0,0,0,255,255,18,11,1,26,1,35,1,25,19,26,1,11,1,31,1,11,1,31,18,11,1,16,1,11,1,16,15,11,1,13,1,15,1,11,1,13],
        [255,255,255,0,0,0,255,255,1,29,1,34,4,29,5,34,5,39,3,17,23,8,70,11], 
[255,255,255,0,0,0,255,255,6,1,2,11,10,2,2,11,9,6,2,11,11,31,2,11,9,29,2,11,11,26,3,11],
[255,255,255,0,0,0,255,255,5,7,1,28,1,27,1,28,2,29,9,28],
[255,255,255,0,0,0,255,255,1,11,1,26,1,11,36,26,1,11,1,26,1,11,2,26,2,11,1,26,1,11,3,26,1,11,1,26,1,11,1,26,1,11,4,26,69,11],
[255,255,255,0,0,0,255,255,3,8,3,0,3,1,15,11],
[255,255,255,0,0,0,255,255,8,27,6,28,5,31,15,11]];     
        const colorIndices = {}; // Objeto para armazenar o índice da cor usada para cada nome
        const nameBytes = randomName.split('').map((char) => char.charCodeAt(0));       
        let colorIndex;
        let colorBytes;      
        if (randomName in colorIndices) { // Se o nome já foi usado antes, use o índice de cor armazenado em colorIndices
          colorIndex = colorIndices[randomName];
          colorBytes = colors[colorIndex];
        } else { // Caso contrário, selecione um índice de cor aleatório para o nome
          colorIndex = getRandomInt(0, colors.length - 1);
          colorIndices[randomName] = colorIndex;
          colorBytes = colors[colorIndex];
        }
      
        const spawnBuf = new Uint8Array([115, 10, 20, 40, ...nameBytes, ...colorBytes]);
        this.send(spawnBuf);
        // Check if the target position is defined
          if (targetXPos !== undefined && targetYPos !== undefined) {
            // If so, move the new bot to this position
            this.moveTo(targetXPos, targetYPos);
          }
        },

    setZigZagMovement: function(shouldZigZag) {
      isZigZag = shouldZigZag;
      if (isZigZag) {
        this.fixedDirection = null;  // reset the fixed direction
        globalFixedDirection = null; // also reset the global fixed direction
      } else {     
        this.fixedDirection = this.snakeAngle;
        globalFixedDirection = this.snakeAngle; // also store the global fixed direction
      }
    },


    getValue: function(originX, originY, targetX, targetY, shouldRandomize) {
        if (this.fixedDirection !== null) {
        // If fixedDirection is set, use it
        return this.fixedDirection;
    }
            if (shouldRandomize) {
              var directions = [0, 45, 90, 135, 180, 225];
              var randomIndex = Math.floor(Math.random() * directions.length);
              return directions[randomIndex];
            }
          
            var dx = targetX - originX;
            var dy = targetY - originY;
          
            var theta = Math.atan2(dy, dx);
            theta *= 125 / Math.PI;
            if (theta < 0) theta += 250;
          
            return theta;
          },
          
    moveTo: function(x, y) {
        var shouldRandomize = this.shouldRandomize;
        var predictionFactor = 0.0; 
        var distance = 50; 
        var value = this.getValue(this.snakeX, this.snakeY, x, y, shouldRandomize, predictionFactor, distance);
    this.snakeAngle = value;

        if (value < 0 || value > 250) {
            console.log("Error!");
        }

        var forwardX = this.snakeX + distance * Math.cos(value / 125 * Math.PI);
        var forwardY = this.snakeY + distance * Math.sin(value / 125 * Math.PI);

        if (shouldRandomize) {
            [this.snakeX, this.snakeY] = getRandomCoordinates();
        } else {
            var lerpFactor = 0.1;

            this.snakeX = lerp(this.snakeX, forwardX, lerpFactor);
            this.snakeY = lerp(this.snakeY, forwardY, lerpFactor);
        }

        var buf = Buffer.from([Math.floor(value)]);
        if (this.isBoost) buf = Buffer.concat([buf, Buffer.from([254])]);

        this.send(buf);
    },


    onOpen: function(b) {
        if (connectedCount >= botCount) {
            this.disconnect();
            return;
        }

      client = this;  
        this.send(Buffer.from([99]));  
        this.hasConnected = true;  
        connectedCount++;  
        sendCountUpdate();  

      this.isBoosting = true; // Sempre defina isBoosting para verdadeiro quando um bot se conecta

        // Use setInterval para enviar o código de boost a cada 800 milissegundos
        setInterval(() => {
          client.send(Buffer.from([254])); // Sempre tente ativar o boost para um bot quando ele se conecta
        }, 800);
      },


    onClose: function() {
        client = this;
        this.needPing = false;
        this.haveSnakeID = false;
        if (this.hasConnected) {
            connectedCount--;
            sendCountUpdate();
        }
        setTimeout(function() {}, 200);
    },

    onError: function(e) {
        this.needPing = false;
        setTimeout(function() {
            this.connect.bind();
        }.bind(this), 3);
    },

    decodeSecrect: function(secret) {
        var result = new Uint8Array(24);
        var globalValue = 0;
        for (var i = 0; i < 24; i++) {
            var value1 = secret[17 + i * 2];
            if (value1 <= 96) {
                value1 += 32;
            }
            value1 = (value1 - 98 - i * 34) % 26;
            if (value1 < 0) {
                value1 += 26;
            }
    
            var value2 = secret[18 + i * 2];
            if (value2 <= 96) {
                value2 += 32;
            }
            value2 = (value2 - 115 - i * 34) % 26;
            if (value2 < 0) {
                value2 += 26;
            }
    
            var interimResult = (value1 << 4) | value2;
            var offset = interimResult >= 97 ? 97 : 65;
            interimResult -= offset;
            if (i == 0) {
                globalValue = 2 + interimResult;
            }
            result[i] = ((interimResult + globalValue) % 26 + offset);
            globalValue += 3 + interimResult;
        }
    
        return result;
    
    },

boostSpeed: function(shouldBoost) {
  client = this;
  this.isBoosting = shouldBoost;
  boostState[this.id] = this.isBoosting;

  // Limpe o intervalo existente, se houver um
  if (this.boostIntervalId) {
    clearInterval(this.boostIntervalId);
    this.boostIntervalId = null;
  }

  if (this.isBoosting) {
    this.boostIntervalId = setInterval(() => {
      client.send(Buffer.from([254]));
    }, 800);
  } else {
    client.send(Buffer.from([253]));
  }
},


    disconnect: function() {
        if (this.ws) this.ws.close();
        this.haveSnakeID = false;
    },

    onMessage: function(b) {
        client = this;
        var lol = new Uint8Array(b.data);
        var f = String.fromCharCode(lol[2]);
        var snakeSpeed, lastPacket, etm;
        if (2 <= lol.length) {
            if ("6" == f) {
                var client = this;
                var e = 165;
                var c = 3;
                var h = "";
                for (h = ""; c < e;) {
                    h += String.fromCharCode(lol[c]),
                        c++;
                }
                this.send(this.decodeSecrect(lol));
                this.spawn();
            } else if ("p" == f) {
                var client = this;
                this.needPing = true;
            } else if ("a" == f) {
                //console.log("Conectando no http".green);
                function move() {
                    if (client) { 
                        client.moveTo(xPos, yPos);
                    }
                    setTimeout(move, 180);
                }
                move();
                setTimeout(function() {
                    move = function() {
                        if (client) { 
                            client.moveTo(xPos, yPos);
                        }
                        setTimeout(move, 190);
                    }
                }, 60 * 1000);
                setInterval(function() {
                    client.send(Buffer.from([251]));
                }, 150);
            } else if ("v" == f) {
                //console.log("OP-Bots.com");
                this.haveSnakeID = false;
                this.disconnect();
            } else if ("g" == f) {
                //this.updatePos(lol, "g");
                if ((lol[3] << 8 | lol[4]) == this.snakeID) {
                    this.snakeX = lol[5] << 8 | lol[6];
                    this.snakeY = lol[7] << 8 | lol[8];
                }
            } else if ("n" == f) {
                //this.updatePos(lol, "n");
    
                if ((lol[3] << 8 | lol[4]) == this.snakeID) {
                    this.snakeX = lol[5] << 8 | lol[6];
                    this.snakeY = lol[7] << 8 | lol[8];
                }
            } else if ("G" == f) {
                //this.updatePos(lol, "G");
    
                if ((lol[3] << 8 | lol[4]) == this.snakeID) {
                    this.snakeX = this.snakeX + lol[5] - 128;
                    this.snakeY = this.snakeY + lol[6] - 128;
                }
            } else if ("N" == f) {
                //this.updatePos(lol, "N");
                if ((lol[3] << 8 | lol[4]) == this.snakeID) {
                    this.snakeX = this.snakeX + lol[5] - 128;
                    this.snakeY = this.snakeY + lol[6] - 128;
                }
    
            } else if ("s" == f) {
                if (!this.haveSnakeID) {
                    this.snakeID = lol[3] << 8 | lol[4];
                    this.haveSnakeID = true;
                }
                if ((lol[3] << 8 | lol[4]) == this.snakeID) {
                    if (lol.length >= 31) {
                        snakeSpeed = (lol[12] << 8 | lol[13]) / 1e3;
    
                    }
                    if (lol.length >= 31 && (((((lol[18] << 16) | (lol[19] << 8) | lol[20]) / 5.0) > 99) || ((((lol[21] << 16) | (lol[22] << 8) | lol[23]) / 5.0) > 99))) {
                        this.snakeX = ((lol[18] << 16) | (lol[19] << 8) | lol[20]) / 5.0;
                        this.snakeY = ((lol[21] << 16) | (lol[22] << 8) | lol[23]) / 5.0;
                    }
                }
    
            } else if (("g" || "n" || "G" || "N") && (lol[3] << 8 | lol[4]) === this.snakeID) {
                if (lastPacket != null) {
                    var deltaTime = Date.now() - lastPacket;
                    var distance = snakeSpeed * deltaTime / 5.0;
                    var newSnakeX = this.snakeX + Math.cos(this.snakeAngle) * distance;
                    var newSnakeY = this.snakeY + Math.sin(this.snakeAngle) * distance;
            
                    // Calcular a distância entre o bot e a sua cobra
                    var distance = Math.hypot(botX - newSnakeX, botY - newSnakeY);
            
                    // Interpolar a posição do bot
                    var t = 0.0; 
                    botX = botX + (newSnakeX - botX) * t;
                    botY = botY + (newSnakeY - botY) * t;
                }
                lastPacket = Date.now();
            }
        }
    
    
    }
    
    };

    function start() {
      for (var i in bots)
        bots[i].disconnect();

      var i = 0;
      setInterval(function() {
        i++;
        var newBot = new Bot(i);
        if (targetXPos !== undefined && targetYPos !== undefined) {
         // If the target coordinates are defined, move the new bot to this location.
          newBot.moveTo(targetXPos, targetYPos);
        }
        bots.push(newBot);
      }, 3);

        for (var i in bots)
            bots[i].connect();
    }

    
    setInterval(function() {
      if (xPos !== undefined && yPos !== undefined) {
        targetXPos = xPos;
        targetYPos = yPos;
      }
    }, 100);


    let sendCountUpdate = function() {
        io.emit("botCount", connectedCount); // Emita para todos os clientes conectados
    };

    setInterval(sendCountUpdate, 3000); // Inicie o intervalo aqui

    io.on('connection', (socket) => {
        let address = socket.request.connection.remoteAddress;
        console.log('\x1b[31m%s\x1b[0m', '\x1b[1mConectado na porta 8080\x1b[0m');
  
        sendCountUpdate = function() {
          socket.emit("botCount", connectedCount);
        }; 

    socket.on('start', (data) => {
      server = data.ip;
      origin = data.origin;
      start();
      console.log('ServerIp: ' + server);
      console.log('Origin: ' + origin);
      console.log('Bots Iniciando');
    });
  
    socket.on('movement', (data) => {
      xPos = data.x;
      yPos = data.y;
    });
  

    socket.on('toggleBoostSpeed', (data) => {
        for (const bot of bots) {
            bot.boostSpeed(data.shouldBoost);
        }
    });

    socket.on('toggleZigZagMovement', () => {
      isBPressed = !isBPressed;
      if (isBPressed) {
        // Save the current coordinates as the target position for all bots
        targetXPos = xPos;
        targetYPos = yPos;
      }
      bots.forEach((bot) => {
        bot.setZigZagMovement(isBPressed);
      });
    });

    socket.on('toggleRandomMovement', () => {
      isCPressed = !isCPressed;
      bots.forEach((bot) => {
        bot.setRandomMovement(isCPressed);
      });
    });

    socket.on('error', (err) => {
      console.error(`Socket error: ${err}`);
    });
  });

  asciiArt.font('Brunex', 'Doom', function(rendered1){
    const colored1 = chalk.red(rendered1);
    asciiArt.font('Conectado', 'Doom', function(rendered2){
        const colored2 = chalk.magenta(rendered2);
        const fullText = colored1 + colored2;
        console.log(fullText + chalk.grey("  Brunexvps.online"));
    });
});;