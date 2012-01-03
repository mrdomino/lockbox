goog.provide('message');

goog.require('goog.asserts');


message.encode = function(str) {
  goog.asserts.assert(str != null);
  return str;
}

message.decode = message.encode;
