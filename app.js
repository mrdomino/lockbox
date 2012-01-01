goog.provide('app');

goog.require('ssss');
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
    var k = parseInt($('k').value, 10);
    var n = parseInt($('n').value, 10);
    var input = $('input').value;

    var output = ssss.split(input, k, n);
    goog.dom.removeChildren($('split-output'));
    goog.array.forEach(output, function(key) {
      var child = goog.dom.createDom('pre');
      goog.dom.setTextContent(child, key);
      goog.dom.appendChild($('split-output'), child);
    });
  });
  goog.events.listen($('combine'), goog.events.EventType.CLICK, function(e) {
    var keys = goog.array.map($('keys').value.split("\n"), app.parseUint8Array);
    var out = goog.dom.createDom('pre');
    goog.dom.setTextContent(out, goog.crypt.base64.decodeString(ssss.combine(keys).toString()));
    goog.dom.removeChildren($('combine-output'));
    goog.dom.appendChild($('combine-output'), out);
  });
}

goog.exportSymbol('app.run', app.run);
