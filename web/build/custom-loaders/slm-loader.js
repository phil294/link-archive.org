(function() {
  var slm;

  slm = require('slm');

  module.exports = function(slmdoc) {
    // Allow inline comments: # followed by whitespace
    // Allow attributes without quotes syntax. E.g: input @click=myMethod
    // Allow alternative syntax for event handlers: %click="myMethod" translates to @click="myMethod"
    // Allow alternative syntax for property binding: -src="mySrc" translates to :src="mySrc"
    // Allow alternative syntax for v-model: model="myVar" translates to v-model="myVar"
    // Allow alternative syntax for v-if: if="myVar" translates to v-if="myVar"
    // Allow standalone keywords to work without value assignment. To be extended. E.g.: div v-else hello
    return slm.compile(slmdoc.replace(/# .*/g, '').replace(/(?<=\s[a-z.@%:-]+=)([^\s"]+)(?=\s|$)/g, '"$1"').replace(/(?<=\s)%(?=[a-z.-]+="[^"]+"\s|$)/g, '@').replace(/(?<=\s)-(?=[a-z.-]+="[^"]+"\s|$)/g, ':').replace(/(?<=\s)model(?=="[^"]+"\s|$)/g, 'v-model').replace(/(?<=\s)if(?=="[^"]+"\s|$)/g, 'v-if').replace(/(?<=\s)(v-else|required|disabled)(?=\s|$)/g, '$1=""'))(); // [WS]%src= // Add quotes // [WS] // Replace with @ // [WS] // Replace with v-model // [WS] // Add =""
// The keywords...	<- captured
// ...
// [WS]
// model			<- captured
// ="myVar"
// [WS]
// %					<- captured
// src=
// "mySrc"
// [WS]
// mySrc				<- captured
// [WS]
  };

}).call(this);
