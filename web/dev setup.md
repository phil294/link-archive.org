# Dev Setup

## CoffeeSense and Vue

[CoffeeSense](https://github.com/phil294/coffeesense) is an IntelliSense extension for CoffeeScript in VSCode and other editors. Its usage is assumed below.

### Vue Options API

Vue docs apply, i.e. [use `defineComponent`](https://v3.vuejs.org/guide/typescript-support.html#using-with-options-api).

Other issues:

1. Any IntelliSense that is not pug, html, js, ts, lass, scss or stylus currently does not work inside Vue SFC files, both with Vetur and Volar. This should improve in the future, as Volar plans on implementing a plugin system. Until then, where autocompletion etc. is desired, CoffeeScript (CS) contents need to be externalized into their own files using something like `<script src="./ComponentName.coffee" type="coffee">`.
1. Because of this, Vetur/Volar is basically useless regarding CS code. Most importantly, imports would not resolve properly and result in type errors, if it were not for `vue-shims.d.ts`. But this breaks go to component actions, but [it's expected to be like that](https://github.com/vuejs/vue/issues/5298)?
1. Where a CS part has been externalized, any references to the component *must* include the `.vue` suffix, as otherwise the CS file would wrongly be imported in runtime.
1. For Vue import errors to not occur in CS, component *should* include the `.vue` suffix, but it's only for typing. In general, just always add the suffix and you're good
1. `components` option must not point to invalid components / paths
1. There are other issues not related to Vue, but TS<->CS, most prevalently `var`/`let` and splitting of declarations and assignments. These issues are not covered in this doc, but they are handled by CoffeeSense.

### Vue Composition API

Everything should work as expected, except that `<script setup>` syntax is more or less impossible, as this is incompatible with externalized script src. The same constraint applies to [Ref sugar](https://github.com/vuejs/rfcs/discussions/369) (TS macros, still experimental). Ref sugar also does not even work with CS, *at all*, even when in same SFC: IntelliSense is fine (after installing global type hints, as required), but runtime bails. Might be because of coffee-loader, Idk.