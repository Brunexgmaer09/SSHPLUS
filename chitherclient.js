/*
 * This part is full client
 */
DataView.prototype.getUint24 = function(pos) {
	return (this.getUint16(pos) << 8) + this.getUint8(pos+2);
}

var resumeSocket = true;

function silentLog() { }

var sliterbot_ownpacketreceived = false;
var sliterbot_ownsnakeid = [];

var slbws = null;
var slb_ws_isopen = false;
var snakeIsAlive = false;

//UI V2
var htmlToInject = '';

htmlToInject += '<div id="chithercomUI2">';
    htmlToInject += '<a href="http://chither.com" target="_blank" class="chv2_logo"></a>';
    htmlToInject += '<div id="chv2_main-container"><p class="chv2_signletext">Connection to chither.com server ...</p></div>';
    htmlToInject += '<div id="chv2_message_container"></div>';
htmlToInject += '</div>';
    

    
var cLCOMdiv = document.createElement("div");
cLCOMdiv.innerHTML = htmlToInject;
document.getElementsByTagName('body')[0].appendChild(cLCOMdiv);



jQuery(document).ready(function() {
    $(document).mousedown(function(event) {
        switch (event.which) {
            case 3:
                event.preventDefault();
                try {
                    slbws.send(JSON.stringify({r:3}));
                } catch (e) {
                    
                }
                break;
        }
    });
    //Binding for run mod
    var noRepeatSpaceKey = false;
    $(document).keydown(function(e){ //PRess key
        if(e.keyCode == 88 && noRepeatSpaceKey == false && snakeIsAlive){
            noRepeatSpaceKey = true;
            try {
                slbws.send(JSON.stringify({r:4, speed: true}));
            } catch(osef) {
                
            }
        }
    });
    $(document).keyup(function(e){ //Release key
        if(e.keyCode == 88 && snakeIsAlive){
            try {
                noRepeatSpaceKey = false;
                slbws.send(JSON.stringify({r:4, speed: false}));
            } catch(osef) {
                
            }
        } else if(e.keyCode == 67 && snakeIsAlive) { //RAND
            slbws.send(JSON.stringify({r:5}));
        }
    });
    
});

var percentColors = [
    { pct: 0.0, color: { r: 0xff, g: 0x00, b: 0 } },
    { pct: 0.5, color: { r: 0xff, g: 0xff, b: 0 } },
    { pct: 1.0, color: { r: 0x00, g: 0xff, b: 0 } } ];

var getColorForPercentage = function(pct) {
    for (var i = 1; i < percentColors.length - 1; i++) {
        if (pct < percentColors[i].pct) {
            break;
        }
    }
    var lower = percentColors[i - 1];
    var upper = percentColors[i];
    var range = upper.pct - lower.pct;
    var rangePct = (pct - lower.pct) / range;
    var pctLower = 1 - rangePct;
    var pctUpper = rangePct;
    var color = {
        r: Math.floor(lower.color.r * pctLower + upper.color.r * pctUpper),
        g: Math.floor(lower.color.g * pctLower + upper.color.g * pctUpper),
        b: Math.floor(lower.color.b * pctLower + upper.color.b * pctUpper)
    };
    return 'rgb(' + [color.r, color.g, color.b].join(',') + ')';
    // or output as hex if preferred
}  
var numbersSpawnedBots = 0;
setInterval(function() {
    var currIpPort = getCurentServerIpPort();
    if(currIpPort != false && slb_ws_isopen && numbersSpawnedBots == 0) { //CO on server
        slbws.send(JSON.stringify({'r':1, 'i':currIpPort.ip, 'p':currIpPort.port, 'sk': lastSnakeSkin, 'in': lastInitKey}));
    }
}, 10000);
            

function connectToChithercom() {
    //Connexion au serveur SLB
/*SLBSOCKET*/    slbws = new WebSocket('ws://cluster.chither.com:80');
    slbws.binaryType = "arraybuffer";
    

    slbws.onopen = function(c) {
        slb_ws_isopen = true;
        document.getElementById('chv2_main-container').innerHTML = '<p class="chv2_signletext">Authentication ...</p>';
        var currIpPort = getCurentServerIpPort();
        if(currIpPort != false) {
            slbws.send(JSON.stringify({'r':1, 'i':currIpPort.ip, 'p':currIpPort.port, 'sk': lastSnakeSkin, 'in': lastInitKey}));
        }
     
        
        
    };
    slbws.onclose = function(c) {
        
        slb_ws_isopen = false;
        setTimeout(function() {
			if(resumeSocket) {
                            document.getElementById('chv2_main-container').innerHTML = '<p class="chv2_signletext">Reconnecting ...</p>';
                            connectToChithercom();
			}
            
        }, 2000);
    };
    slbws.onmessage = function (msg) {
        var decodePkt = JSON.parse(msg.data);
        switch(decodePkt.req) {
            case 1:
                if(typeof(decodePkt.data.isFreebot) != 'undefined' && decodePkt.data.isFreebot) {
                    jQuery(".chv2_logo").addClass('chv2_logo_free');
                    jQuery('#chv2_message_container').show();
                    jQuery('#chv2_message_container').html('<p><b><a target="_blank" href="http://chither.com">Have premium ? => Change ip !</a></b> - Want more bots ? go to <a target="_blank" href="http://chither.com">chither.com</a> and buy our awesome plan.</p>');
                } else {
                    jQuery('#chv2_message_container').hide();
                }
                
                var expireDate = new Date(decodePkt.data.expire);
                var htmlAppend = '';
                var botLoadPct = Math.floor((decodePkt.data.alive / decodePkt.data.theoric) * 100);
                
                numbersSpawnedBots = decodePkt.data.alive;
                
                htmlAppend += '<div class="chv2_active_botsnb chv2_active"><p>Bots: '+decodePkt.data.alive+' / ' + decodePkt.data.theoric + '<br><span class="chv2_small">bots alive</span>';
                htmlAppend += '<span style="background-color: '+getColorForPercentage(botLoadPct/100)+';width: ' + botLoadPct + '%;" id="chv2_bot_load"></span></p></div>';
                
                if(decodePkt.data.actions.random) {
                    htmlAppend += '<div class="chv2_active_followcmd chv2_active"><p style="background-color: rgba(255,165,0,0.3);">Follow<br><span class="chv2_small">disable rand</span></p></div>';
                } else if(decodePkt.data.follow) {
                    htmlAppend += '<div class="chv2_active_followcmd chv2_active"><p style="background-color: rgba(0,255,0,0.3);">Follow<br><span class="chv2_small">Right clic</span></p></div>';
                } else {
                    htmlAppend += '<div class="chv2_active_followcmd chv2_active"><p style="background-color: rgba(255,0,0,0.3);">Follow<br><span class="chv2_small">Right clic</span></p></div>';
                }

                if(decodePkt.data.actions.speed) {
                    htmlAppend += '<div class="chv2_active_speedcmd chv2_active"><p style="background-color: rgba(0,255,0,0.3);">Speed<br><span class="chv2_small">Key: X</span></p></div>';
                } else {
                    htmlAppend += '<div class="chv2_active_speedcmd chv2_active"><p style="">Speed<br><span class="chv2_small">Key: X</span></p></div>';
                }

                if(decodePkt.data.actions.random) {
                    htmlAppend += '<div class="chv2_active_randomcmd chv2_active"><p style="background-color: rgba(0,255,0,0.3);">Rand<br><span class="chv2_small">key: C</span></p></div>';
                } else {
                    htmlAppend += '<div class="chv2_active_randomcmd chv2_active"><p style="">Rand<br><span class="chv2_small">key: C</span></p></div>';
                }
                
               
                
                
                htmlAppend += '<div class="chv2_active_expire chv2_active"><p>';
               
                //Gestion des dates
                var timeNow = Date.now();
                var remainSeconds = (decodePkt.data.expire - timeNow) / 1000;
                
                //Jours restants
                var remainDays = Math.floor(remainSeconds / 86400);
                remainSeconds = remainSeconds - (86400 * remainDays);
                
                //heures restantes
                var remainHours = Math.floor(remainSeconds / 3600);
                remainSeconds = remainSeconds - (3600 * remainHours);
                
                //Minutes restantes
                var remainMinuts = Math.floor(remainSeconds / 60);
                
                //Secondes restantes
                remainSeconds = Math.floor(remainSeconds - (60 * remainMinuts));
                
                if(remainDays > 0) {
                    if(remainDays == 1) {
                        htmlAppend += remainDays + ' day';
                    } else {
                        htmlAppend += remainDays + ' days';
                    }
                    
                } else if(remainHours > 0) {
                    if(remainHours == 1) {
                        htmlAppend += remainHours + ' hour';
                    } else {
                        htmlAppend += remainHours + ' hours';
                    }
                } else if(remainMinuts > 0) {
                    if(remainMinuts == 1) {
                        htmlAppend += remainMinuts + ' minute';
                    } else {
                        htmlAppend += remainMinuts + ' minutes';
                    }
                } else {
                    htmlAppend += remainSeconds + ' seconds';
                }
                
               
                htmlAppend += '<br><span class="chv2_small">Remain time</span> </p></div>';
                
                
                document.getElementById('chv2_main-container').innerHTML = htmlAppend;
                
    
            break;
            case 2: //Expire
                var htmlAppend = '<div class="chv2_expire_pkgexp chv2_expire"><p>Freebot is full</p></div>';
                htmlAppend += '<div class="chv2_expire_chgip chv2_expire"><p><a href="http://chither.com" target="_blank"><b>Active plan ?</b><br>change your ip !</a></p></div>';
                htmlAppend += '<div class="chv2_expire_buyone chv2_expire"><p><a href="http://chither.com" target="_blank"><b>No active plan ?</b><br>Buy one !</p></a></div>';
                document.getElementById('chv2_main-container').innerHTML = htmlAppend;
                resumeSocket = false;
                slbws.close();
                jQuery('#chv2_message_container').show();
                jQuery('#chv2_message_container').html('<p>We run out of freebot ! Try again later or <a href="http://chither.com" target="_blank">buy premium offer</a> (dedicated slot).</p>');
            break;
        }
    }
}

connectToChithercom();

var snakeCoordX = 0;
var snakeCoordY = 0;
var lastTransmitTime = 0;
function schiter_injector(shiterpacket) {
    if (typeof(shiterpacket) != "undefined" && (b = new Uint8Array(shiterpacket.data), b.length, 2 <= b.length)) {
        var c = String.fromCharCode(b[2]);
        if(c == "s") {
            //On capte l'id sur celui-ci !
            if(sliterbot_ownpacketreceived == false) {
                sliterbot_ownsnakeid.push(b[3]);
                sliterbot_ownsnakeid.push(b[4]);                       
                sliterbot_ownpacketreceived = true;
            }
        } else if(c == "g" || c == "n") { //Absolute pos packet ??? 
            var uint16_id = [b[3], b[4]];

            if(uint16_id[0] == sliterbot_ownsnakeid[0] 
                && uint16_id[1] == sliterbot_ownsnakeid[1]) {
                if(slb_ws_isopen) {
                    var snParser = new DataView(b.buffer, 3, 6);
                    snakeCoordX = snParser.getUint16(2);
                    snakeCoordY = snParser.getUint16(4);
                }
            }
        } else if(c == "G" || c == "N") {
            var uint16_id = [b[3], b[4]];
            if(uint16_id[0] == sliterbot_ownsnakeid[0] 
                && uint16_id[1] == sliterbot_ownsnakeid[1]) {
                if(slb_ws_isopen) {
                    var snParser = new DataView(b.buffer, 3, 4);
                    snakeCoordX = (snParser.getUint8(2) - 128) + snakeCoordX;
                    snakeCoordY = (snParser.getUint8(3) - 128) + snakeCoordY;
                    
                    if(new Date().getTime() > (lastTransmitTime + 100)) {
                        lastTransmitTime = new Date().getTime();
                        slbws.send(JSON.stringify({'r':2, 'i':snParser.getUint16(0).toString(), 'x':snakeCoordX, 'y':snakeCoordY}));
                    }
                    
                }
            }
        }
        
        
    }
}

function schiter_reset() {
    sliterbot_ownpacketreceived = false;
    sliterbot_ownsnakeid = [];
}





/**
 * Decoding data output (ip server, init packet, ...)
 */
var previousSocketServer = null;

function getCurentServerIpPort() {
    if(previousSocketServer == null || !snakeIsAlive) {
        return false;
    }
     var urlParser = document.createElement('a');
    urlParser.href = previousSocketServer.url;
    var ipport = {ip: null, port: null};
    ipport.ip = urlParser.hostname;
    ipport.port = urlParser.port;
    return ipport;
}

var lastInitKey = null;
var lastSnakeSkin = null;

var initPktCounter = 0;

function wsSendHook(data, object) {
    if(object.url.substr(object.url.length - 8, 8) == '/slither' && previousSocketServer != object) {
        initPktCounter = 0;
        previousSocketServer = object;
    }
    if(initPktCounter == 2) {
        initPktCounter = 3;
        //silentLog(data);
        
        snakeIsAlive = true;
        
        var urlParser = document.createElement('a');
        urlParser.href = object.url;
     
        
        //Parsing init packet
        var initKey = {b0: data[0], b1: data[1]};
        lastInitKey = initKey;
        
        var snakeSkin = data[2];
        lastSnakeSkin = snakeSkin;

        var socketIp = urlParser.hostname;
        var socketPort = urlParser.port;

        schiter_reset();
        
        if(slb_ws_isopen) {
            slbws.send(JSON.stringify({'r':1, 'i':socketIp, 'p':socketPort, 'sk': snakeSkin, 'in': initKey}));
        }
        //Inject input hook
        object.onmessageold = object.onmessage;
        object.onmessage = function(message) {
            //Incom packet here
            schiter_injector(message);
            object.onmessageold(message);
        }
        
        object.oncloseold = object.onclose;
        object.onclose = function(message) {
            snakeIsAlive = false;
            object.oncloseold(message);
        }
        
    } 
    initPktCounter = initPktCounter + 1;
}



WebSocket.prototype.sendorig = WebSocket.prototype.send;
WebSocket.prototype.send = function(data) {
    wsSendHook(data, this);
    this.sendorig(data);
}
