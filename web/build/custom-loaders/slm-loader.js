(function() {
  var replaces, slm, standaloneKeywords;

  slm = require('slm');

  // Things to replace
  replaces = [
    [/(?<=\s)if="/g,
    ' v-if="'],
    [/(?<=\s)else(?=\s)/g,
    'v-else'],
    [/else-if="/g,
    'v-else-if="'],
    [/model="/g,
    'v-model="'],
    // each=products translates to v-for="product in products"
    [/(?<=\s)each="(\S+)"/g,
    'v-for="$1 in $1s"'],
    // Allow alternative syntax for event handlers: %click="myMethod" translates to @click="myMethod"
    [/(?<=\s)%(?=[a-z.-]+=")/g,
    '@'],
    [
      // Allow alternative syntax for property binding: -src="mySrc" translates to :src="mySrc". / Ignore this quote: "
      /(?<=\s)-(?=[a-z.-]+=")/g,
      ':' // before: no { or }
    // brace
    // after: no { or }
    ],
    [
      // { to {{ and } to }}
      /(?<![{}])[{}](?![{}])/g,
      '$1$1' // double
    ]
  ];

  // Keywords that should allowed to be followed and preceded by whitespace without anything else. This has the potential to break plain text horribly
  standaloneKeywords = ['v-else', 'required', 'disabled', 'draggable', 'selected', 'exact'];

  module.exports = function(slmdoc) {
    var keyword, rule;
    // Allow inline comments: # followed by whitespace
    
    // Allow attributes without quotes syntax. E.g: input @click=myMethod
    slmdoc = slmdoc.replace(/# .*/g, '').replace(/(?<=\s[a-z.@%:-]+=)([^\s"]+)(?=\s|$)/g, '"$1"'); // [WS]%src= // Add quotes
    // mySrc				<- captured
    // [WS]
    
    // All replace rules
    for (rule of replaces) {
      slmdoc = slmdoc.replace(rule[0], rule[1]);
    }
// All standalone keywords
    for (keyword of standaloneKeywords) {
      slmdoc = slmdoc.replace(new RegExp('(?<=\\s)(' + keyword + ')(?=\\s|$)', 'g'), '$1=""'); // [WS] // The keyword		<- captured // [WS]
    }
    
    // Should now be pure coffee
    return slm.compile(slmdoc)();
  };

}).call(this);
