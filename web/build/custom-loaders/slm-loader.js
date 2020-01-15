(function() {
  module.exports = function(slmdoc) {
    var replaces, rule;
    // Allow attributes without quotes syntax. E.g: input @click=my_method
    slmdoc = slmdoc.replace(/(?<=\s[a-zA-Z.@%#:_-]+=)([^\s"]+)(?=\s|$)/g, '"$1"'); // [WS]%src= // Add quotes
    // my_src				<- captured
    // [WS]
    // Things to replace
    replaces = [ // before: whitespace
        // dollar
        // myVar_[0].$prop+12-5/7==="a"
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
      [
        // :class.myclass="condition" to :class="{'myclass':condition}"
        /(?<=\s:class)\.([\w-]+)="([^"]+)"(?=\s)/g,
        '="{\'$1\':$2}"' // before:
      // whitespace
      // :class
      // .myprop
      // ="
      // condition
      // "
      // after: whitespace
      ],
      // :style.some-prop="condition" to :style="{'some-prop':condition}" (same syntax as above but with style binding)
      [/(?<=\s:style)\.([\w-]+)="([^"]+)"(?=\s)/g,
      '="{\'$1\':$2}"'],
      [
        // slot
        /(?<=\S[\t ]+)#(.+)(?=\s)/g,
        'v-slot:$1' // this is in fact supported by vue itself natively already, but slm loader does not like it. so this one is more of a polyfill
      ]
    ];
    for (rule of replaces) {
      slmdoc = slmdoc.replace(rule[0], rule[1]);
    }
    return slmdoc;
  };

}).call(this);
