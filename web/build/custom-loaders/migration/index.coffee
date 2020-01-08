coffee_loader = require './coffee-loader'
slm_loader = require './slm-loader'
vue_loader = require './vue-loader'

fs = require 'fs'

for file from process.argv[2..]
    data = fs.readFileSync file, 'utf-8'
    # data = coffee_loader data
    # data = slm_loader data
    # data = vue_loader data
    # and manually fix comments in slm templates:
    # ^(\t*)(.+) # (.+)$(\n[\w\W]+</template>)
    # $1/ $3\n$1$2$4
    # and to fix slots
    # template #(\S+)
    # template #$1=""
    fs.writeFileSync file, data