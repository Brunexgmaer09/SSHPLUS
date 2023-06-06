/**
 * This part inject main chrome app in dom
 */
function addScript(scriptURL, onload) {
   var script = document.createElement('script');
   script.setAttribute("type", "application/javascript");
   script.setAttribute("src", scriptURL);
   if (onload) script.onload = onload;
   document.documentElement.appendChild(script);
}

addScript(chrome.extension.getURL("js/jquery.js"), function() {
    addScript(chrome.extension.getURL("js/chitherclient.js"), function() {
        jQuery('#cskh').append('<div id="cellsh-ads" onclick="window.open(\'http://cell.sh/?ref=3\');return false;" style="background-image:url('+chrome.extension.getURL('cellsh_banner_slither.png')+');"></div>');
    });
});