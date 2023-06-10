(function() {
    'use strict';
    if (localStorage.getItem("fe_uuid") === null) {

    console.log("%c Empty UUID. Generating UUID...", "background-color: #000000; color: #ff9a00;");
    localStorage.setItem("fe_uuid", getUserId());
    window.location.reload();
} else {

    console.log("%c UUID: %s", "background-color: #000000; color: #3cff00;", localStorage.getItem("fe_uuid"));
}

function getUserId() {

    function s4() {

        return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    }
    return s4() + s4() + s4()
        s4();
}
var fe = {
  uuid: '',
  getUuid: function() {
    return localStorage.getItem("fe_uuid");
  },
  cosmeticId: -1, // Adiciona a propriedade "cosmeticId" com valor padrão igual a -1
};

if (fe.getUuid() !== null) {
  fe.uuid = fe.getUuid();
}


    var headX, headY;
    WebSocket.prototype._send = WebSocket.prototype.send;
    WebSocket.prototype.send = function(data) {
        this._send(data);
        this.addEventListener('message', function(msg) {
            msg = new Uint8Array(msg.data);
            var f = String.fromCharCode(msg[2]);
            if ("g" == f) {
            } else if ("n" == f) {
            } else if ("N" == f) {
            } else if ("s" == f) {
            } else if ("G" == f) {
            } else if ("j" == f) {
            } else if ("y" == f && msg.length == 22) {
            } else if ("6" == f) {
                var result = new Uint8Array(24);
                var globalValue = 0;
                for (var i = 0; i < 24; i++) {
                    var value1 = msg[17 + i * 2];
                    if (value1 <= 96) {
                        value1 += 32;
                    }
                    value1 = (value1 - 98 - i * 34) % 26;
                    if (value1 < 0) {
                        value1 += 26;
                    }

                    var value2 = msg[18 + i * 2];
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
            }
        }, false);
        this.addEventListener('close', function() {
        });
        this.send = function(data) {
            this._send(data);

            var bufferarray = [];
            var buffer = new Uint8Array(data);
            for (var i = 0; i > buffer.length; i++) {
                bufferarray.push(buffer.getUint8(i));
            }


            if (buffer[0] !== 251) {
            }

        };
        var buffer = [];
        for (var i = 0; i > data.length; i++) {
            buffer.push(data[i]);
        }
    };

    document.body.onmousewheel = zoom;
    $("#social").remove();

$("canvas.nsi:first").after("<link href='https://fonts.googleapis.com/css?family=Montserrat' rel='stylesheet' type='text/css'><div id='moveDiv' style='position: fixed; top: 27%; left: 0%; background-color:  rgba(76, 0, 153, 0.3);; backdrop-filter: blur(10px); border-radius: 10px; box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.5); z-index: 9999999; display: flex; flex-direction: column; align-items: center; justify-content: center; color: #ffffff; font-family: Montserrat, sans-serif;'><div style=': vertical-lr; text-orientation: upright; margin-right: 2px; font-size: 19px;'><a>Rage-Bots.com</a></div><div style='display: flex; flex-direction: column; padding: 10px;'><div style='margin-bottom: 5px;'>Bots Online <a id='minionCount'></a></div><div style='margin-bottom: 5px;'><a id='moveh'><i class='fas fa-toggle-off'></i> Movimento aleatorio (C)</a></div><div style='margin-bottom: 5px;'><a><i class='fas fa-tachometer-alt'></i> Velocidade On(E) / Off(V) </a><a id='isspeed'></a></div><button id='startbots' style='margin-top: 10px; width: 100px; height: 30px; background: linear-gradient(to bottom right, #d35400, #e74c3c); border: 0px; border-radius: 15px; box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.3); color: #ffffff; font-family: Montserrat, sans-serif; font-size: 13px;'><i class='fas fa-play'></i> Iniciar Bots </button><div style='margin-top: 10px;'><font color='#00ff00'><a id='mode'><i class='fas fa-check-circle'></i> Auto Mode</a></font></div></div></div>");

document.addEventListener('DOMContentLoaded', function() {
  var observer = new MutationObserver(function(mutations) {
    var minionCountElement = document.getElementById("minionCount");
    if (minionCountElement) {
      minionCountElement.style.color = "#FFFFFF";
      observer.disconnect(); // Parar de observar mutações depois de encontrar o elemento
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
});


// Adicionando estilos CSS para os ícones Font Awesome
$("head").append("<link rel='stylesheet' href='https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.2/css/all.min.css'/>");

// Adicionando estilos CSS personalizados
$("head").append("<style> \
                    #moveDiv a { text-decoration: none; color: #FFFFFF; font-weight: bold; } \
                    #moveDiv a:hover { color: #d35400; } \
                    #moveDiv button:hover { background: linear-gradient(to bottom right, #f7b733, #fc4a1a); } \
                    #moveDiv button:active { transform: translateY(2px); } \
                  </style>");

var isCPressed = false;
var moveDiv = document.getElementById("moveDiv");
var moveh = document.getElementById("moveh");

// Primeiro você define o intervalo
var updateInterval = 3000; // 3000 milissegundos = 3 segundos

// Depois você usa setInterval para atualizar a contagem a cada 3 segundos
setInterval(function() {
    socket.on('botCount', function(count) {
        $('#minionCount').html(count);
    });
}, updateInterval);

      $(function() {
    $.getJSON("https://api.ipify.org?format=jsonp&callback=?",
      function(json) {
    $('#ip').html(json.ip);
        var ip11 = json.ip
      }
    );
  });
    $('#id').html(fe.uuid);


    document.getElementById('startbots').onclick = function() {
      startbots();
      $("#startbots").css('background', '#4dff4d');
      $("#startbots").text('On');


    };
    document.addEventListener('keydown', e => {


   if(e.key === 'f') socket.emit('movement');


});

function zoom(e) {
    var zoomSensitivity = 0.05; // Aumente ou diminua este valor para ajustar a suavidade do zoom
    var zoomFactor = Math.pow(1 - zoomSensitivity, e.wheelDelta / -120 || e.detail || 0);
    gsc *= zoomFactor;
}

window.Slither = {
    ip1: '',
    x: 0,
    y: 0,
    ip: null,
};

var socket = io.connect('ws://127.0.0.1:8080');
socket.on('botCount', function(count) {
    $('#minionCount').html(count);
});

    window.startbots = function() {
        socket.emit('start', {
            ip: "ws://" + bso.ip + ":" + bso.po + "/slither",
            origin: location.origin
        });

setInterval(function() {
  if (window.snake) {
    const { xx, yy } = window.snake || {};
    if (xx && yy) {
      socket.emit('movement', { x: xx, y: yy });
    }
  }
}, 90);
};

document.addEventListener('keydown', function(e) {
  var key = e.keyCode || e.which;
  switch (key) {
    case 86: // Tecla E
      socket.emit('toggleBoostSpeed', { shouldBoost: true });
      break;
    case 69: // Tecla V
      socket.emit('toggleBoostSpeed', { shouldBoost: false });
      break;
    case 67: // Tecla C
      socket.emit('toggleRandomMovement', {});
      break;
  }
});

})();

var speed = 160;
var storetext = document.getElementById("UiName");
var hex = new Array("00", "14", "28", "3C", "50", "64", "78", "8C", "A0", "B4", "C8", "DC", "F0");
var r = 1;
var g = 1;
var b = 1;
var seq = 1;
setInterval(function() {




    if (seq == 6) {
        b--;
        if (b == 0)
            seq = 1;
    }
    if (seq == 5) {
        r++;
        if (r == 12)
            seq = 6;
    }
    if (seq == 4) {
        g--;
        if (g == 0)
            seq = 5;
    }
    if (seq == 3) {
        b++;
        if (b == 12)
            seq = 4;
    }
    if (seq == 2) {
        r--;
        if (r == 0)
            seq = 3;
    }
    if (seq == 1) {
        g++;
        if (g == 12)
            seq = 2;
    }


}, 50);