(function() {
  module.exports = function(slmdoc) {
    var keyword, replaces, rule, standalone_keywords;
    // Allow inline comments: # followed by whitespace
    slmdoc = slmdoc.replace(/# .*/g, '');
    // Allow ` instead of "
    
    // Allow attributes without quotes syntax. E.g: input @click=my_method
    slmdoc = slmdoc.replace(/`/g, '"').replace(/(?<=\s[a-zA-Z.@%:_-]+=)([^\s"]+)(?=\s|$)/g, '"$1"'); // [WS]%src= // Add quotes
    // my_src				<- captured
    // [WS]
    // Things to replace
    replaces = [
      [/(?<=\s)if="/g,
      ' v-if="'],
      [/(?<=\s)html="/g,
      ' v-html="'],
      [/(?<=\s)else(?=\s)/g,
      'v-else'],
      [/else-if="/g,
      'v-else-if="'],
      [/model="/g,
      'v-model="'],
      [/drag="/g,
      'v-drag="'],
      [/drop="/g,
      'v-drop="'],
      [
        // each=products translates to v-for="product in products"
        /(?<=\s)each="(\S+)"/g,
        'v-for="$1 in $1s"' // before: whitespace
      // dollar
      // myVar_[0].$prop+12-5/7==="a"
      ],
      [
        // $blub to {{blub}}
        /(?<=\s)\$([\w.\[\]()$\/="'+-]+)/g,
        '{{$1}}' // before:
      // whitespace
      // :class
      // .myclass
      // ="
      // condition
      // "
      // after: whitespace
      ],
      // :class.myclass="condition" to :class="{'myclass':condition}"
      [/(?<=\s:class)\.([\w-]+)="([^"]+)"(?=\s)/g,
      '="{\'$1\':$2}"']
    ];
    for (rule of replaces) {
      slmdoc = slmdoc.replace(rule[0], rule[1]);
    }
    // Keywords that should allowed to be followed and preceded by whitespace without anything else. This has the potential to break plain text horribly
    standalone_keywords = ['v-else', 'required', 'disabled', 'draggable', 'selected', 'exact', 'drag', 'drop', 'button_float_right'];
    for (keyword of standalone_keywords) {
      slmdoc = slmdoc.replace(new RegExp('(?<=\\s)(' + keyword + ')(?=\\s|$)', 'g'), '$1=""'); // [WS] // The keyword		<- captured # todo coffee supports vars in regexes // [WS]
    }
    //console.log slmdoc
    return slmdoc;
  };

}).call(this);
