goog.provide('app');

goog.require('ssss');
goog.require('message');
goog.require('goog.array');
goog.require('goog.crypt.base64');
goog.require('goog.debug.ErrorHandler');
goog.require('goog.dom');
goog.require('goog.events');
goog.require('goog.events.EventHandler');
goog.require('goog.events.EventTarget');
goog.require('goog.events.EventType');


Uint8Array.prototype.toString = function() {
  return goog.crypt.base64.encodeByteArray(this);
}

app.parseUint8Array = function(str) {
  return new Uint8Array(goog.crypt.base64.decodeStringToByteArray(str));
}

app.run = function() {
  var $ = goog.dom.getElement;
  goog.events.listen($('split'), goog.events.EventType.CLICK, function(e) {
    if (typeof _gaq != 'undefined') {
      _gaq.push(['_trackEvent', 'ssss', 'split']);
    }
    var k = parseInt($('split-k').value, 10);
    var n = parseInt($('split-n').value, 10);
    var input = $('split-input').value;

    var output = ssss.split(message.encode(input), k, n);
    goog.dom.removeChildren($('split-output'));
    goog.array.forEach(output, function(key) {
      var child = goog.dom.createDom('pre');
      goog.dom.setTextContent(child, key);
      goog.dom.appendChild($('split-output'), child);
    });
  });
  goog.events.listen($('combine'), goog.events.EventType.CLICK, function(e) {
    if (typeof _gaq != 'undefined') {
      _gaq.push(['_trackEvent', 'ssss', 'combine']);
    }
    var k = parseInt($('combine-k').value, 10);
    var keys = goog.array.filter(
        goog.array.map($('combine-keys').value.split("\n"),
                       app.parseUint8Array),
        function(arr) { return arr.length; });
    var msg = message.decode(
        ssss.combine(keys, k, function(arr) {
          return message.verify(arr.buffer);
        }).buffer);
    var out = goog.dom.createDom('pre');
    goog.dom.setTextContent(out, msg);
    goog.dom.removeChildren($('combine-output'));
    goog.dom.appendChild($('combine-output'), out);
  });
}

goog.exportSymbol('app.run', app.run);
