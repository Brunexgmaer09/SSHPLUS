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

let bots = [];
let server = "";
let origin = null;
let xPos, yPos, byteLength = 0;
let connectedCount = 0;
let botCount = 600;
let client = null;
let users = 0;
let sendCountUpdate = function () { };

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

var isCPressed = false;

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  rl.on('line', (input) => {
    if (input === 'c') {
      isCPressed = !isCPressed;
      if (isCPressed) {
        console.log(chalk.green('Bots Movendo aleatoriamente on'));
      } else {
        console.log(chalk.red('Bots Movendo aleatoriamente off'));
      }
    }
  });

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
    let maxX = 10;
    let maxY = 10;
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
    
    
    
    spawn: function() {
        var randomSkin = getRandomInt(9, 65);
        var spawnBuf = new Uint8Array([115, 10, , 22, 20, 66, 114, 117, 110, 101, 120, 118, 112, 115, 46, 111, 110, 108, 105, 110, 101, 45, 66, 111, 116, 115, , , , , , , , , , , , , , , , , , , , , getRandomInt(0, 45), getRandomInt(0, 2), getRandomInt(0, 45), getRandomInt(0, 2), getRandomInt(0, 45), getRandomInt(0, 2), getRandomInt(0, 45), getRandomInt(0, 0), getRandomInt(0, 45), getRandomInt(0, 1)]);
        this.send(spawnBuf);
    },
    
    getValue: function(originX, originY, targetX, targetY, shouldRandomize) {
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
        var shouldRandomize = isCPressed;
        var value = this.getValue(this.snakeX, this.snakeY, x, y, shouldRandomize);
        this.snakeAngle = value;
        if (value < 0 || value > 250) {
            console.log("Error!");
        }
    
        if (shouldRandomize) {
            [this.snakeX, this.snakeY] = getRandomCoordinates();
        } else {
            this.snakeX += Math.cos(this.snakeAngle / 125 * Math.PI) * 0;
            this.snakeY += Math.sin(this.snakeAngle / 125 * Math.PI) * 0;
        }
    
        var buf = new Buffer([Math.floor(value)]);
        this.send(buf);
    },

    onOpen: function(b) {
        if (connectedCount >= botCount) {
            this.disconnect();
            return;
        }
    
        client = this;
        this.send(new Buffer([99]));
        this.hasConnected = true;
        connectedCount++;
        sendCountUpdate();
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
        }.bind(this), 5);
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

    boostSpeed: function(a) {
        client = this;
        if (a) {
            this.isBoost = false;
            client.send(new Buffer([253]));
        } else {
            this.isBoost = false;
            client.send(new Buffer([254]));
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
                //console.log("Conectando no Socks5".green);
                function move() {
                    client.moveTo(xPos, yPos);
                    setTimeout(move, 100);
                }
                move();
                setTimeout(function() {
                    move = function() {
                        client.moveTo(xPos, yPos);
                        setTimeout(move, 200);
                    }
                }, 60 * 1000);
                setInterval(function() {
                    client.send(new Buffer([251]));
                }, 250);
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
                    var t = 0.7; // ajuste este valor para controlar a suavidade do movimento
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
            bots.push(new Bot(i));
        }, 3);
    
        for (var i in bots)
            bots[i].connect();
    }

    io.on('connection', (socket) => {
        let address = socket.request.connection.remoteAddress;
        console.log('\x1b[31m%s\x1b[0m', '\x1b[1mBots by Brunex\x1b[0m');
      
        sendCountUpdate = function() {
          socket.emit("botCount", connectedCount);
          
        };
      
        socket.on('start', (data) => {
          server = data.ip;
          origin = data.origin;
          start();
          console.log('ServerIp: ' + server);
          console.log('Origin: ' + origin);
          console.log('By Brunex');
        });
      
        socket.on('movement', (data) => {
          xPos = data.x;
          yPos = data.y;
        });
      
        socket.on('boostSpeed', () => {
          for (const bot of bots) {
            bot.boostSpeed(true);
          }
        });
      
        socket.on('normalSpeed', () => {
          for (const bot of bots) {
            bot.boostSpeed(true);
          }
        });
      
        socket.on('error', (err) => {
          console.error(`Socket error: ${err}`);
        });
      });

      asciiArt.font('Brunex', 'Doom', function(rendered1) {
        const colored1 = chalk.red(rendered1);
        asciiArt.font('Bots', 'Doom', function(rendered2) {
            const colored2 = chalk.magenta(rendered2);
            const fullText = colored1 + colored2;
            console.log(fullText + chalk.grey("  OP-Bots.com"));
        });
    });