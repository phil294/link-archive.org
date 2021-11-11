module.exports = {
	"env": {
		"es6": true,
		"node": true
	},
	"extends": [
		"prettier",
		"eslint:recommended"
	],
	"parser": "@typescript-eslint/parser",
	"plugins": [
		"eslint-plugin-jsdoc",
		"eslint-plugin-prefer-arrow",
		"@typescript-eslint",
		"@typescript-eslint/tslint"
	],
	"rules": {
		"@typescript-eslint/ban-types": [
			"error",
			{
				"types": {
					"Object": {
						"message": "Avoid using the `Object` type. Did you mean `object`?"
					},
					"Function": {
						"message": "Avoid using the `Function` type. Prefer a specific function type, like `() => void`."
					},
					"Boolean": {
						"message": "Avoid using the `Boolean` type. Did you mean `boolean`?"
					},
					"Number": {
						"message": "Avoid using the `Number` type. Did you mean `number`?"
					},
					"String": {
						"message": "Avoid using the `String` type. Did you mean `string`?"
					},
					"Symbol": {
						"message": "Avoid using the `Symbol` type. Did you mean `symbol`?"
					}
				}
			}
		],
		"@typescript-eslint/consistent-type-assertions": "error",
		"indent": ["error", "tab"],
		"@typescript-eslint/indent": [
			"error",
			"tab"
		],
		"camelcase": "off",
		"@typescript-eslint/naming-convention": [
			// This cannot be "error" yet because https://github.com/typescript-eslint/typescript-eslint/issues/2244
			// - vars passed as params, arguments *should* only be checked if their definition
			// is not from 3rd party libraries :/ staying at "warn" for the meantime
			"warn",
			{
				"selector": "default",
				"format": ["snake_case"]
			},

			{
				"selector": "variable",
				"format": ["snake_case", "UPPER_CASE"]
			},
			{
				"selector": "parameter",
				"format": ["snake_case"],
				"leadingUnderscore": "allow"
			},

			{
				"selector": "memberLike",
				"modifiers": ["private"],
				"format": ["snake_case"],
				"leadingUnderscore": "require"
			},

			{
				"selector": "typeLike",
				"format": ["PascalCase"]
			}
		],
		"@typescript-eslint/no-array-constructor": "off",
		"@typescript-eslint/no-empty-function": "error",
		"@typescript-eslint/no-empty-interface": "error",
		"@typescript-eslint/no-explicit-any": "off",
		"@typescript-eslint/no-misused-new": "error",
		"@typescript-eslint/no-namespace": "off",
		"@typescript-eslint/no-parameter-properties": "off",
		"@typescript-eslint/no-shadow": [
			"error",
			{
				"hoist": "all"
			}
		],
		"@typescript-eslint/no-unused-expressions": "off",
		"@typescript-eslint/no-use-before-define": "off",
		"@typescript-eslint/no-var-requires": "error",
		"@typescript-eslint/prefer-for-of": "error",
		"@typescript-eslint/prefer-function-type": "error",
		"@typescript-eslint/prefer-namespace-keyword": "error",
		"@typescript-eslint/triple-slash-reference": [
			"error",
			{
				"path": "always",
				"types": "prefer-import",
				"lib": "always"
			}
		],
		"@typescript-eslint/unified-signatures": "error",
		"arrow-parens": [
			"off",
			"always"
		],
		"complexity": "off",
		"constructor-super": "error",
		"curly": "off",
		"dot-notation": "error",
		"eqeqeq": [
			"error",
			"smart"
		],
		"guard-for-in": "error",
		"id-denylist": "off",
		"id-match": "off",
		"jsdoc/check-indentation": "error",
		"jsdoc/newline-after-description": "error",
		"max-classes-per-file": "off",
		"max-len": "off",
		"new-parens": "error",
		"no-array-constructor": "off",
		"no-bitwise": "error",
		"no-caller": "error",
		"no-cond-assign": "error",
		"no-console": "off",
		"no-debugger": "error",
		"no-empty": "error",
		"no-empty-function": "error",
		"no-eval": "error",
		"no-fallthrough": "off",
		"no-invalid-this": "off",
		"no-new-wrappers": "error",
		"no-shadow": "error",
		"no-throw-literal": "off",
		"no-trailing-spaces": "error",
		"no-undef-init": "error",
		"no-underscore-dangle": "off",
		"no-unsafe-finally": "error",
		"no-unused-expressions": "off",
		"no-unused-vars": "warn",
		"no-unused-labels": "error",
		"no-use-before-define": "off",
		"no-var": "error",
		"object-shorthand": "error",
		"one-var": [
			"error",
			"never"
		],
		"prefer-arrow/prefer-arrow-functions": "off",
		"prefer-const": "error",
		"prefer-template": "off",
		"quotes": "off",
		"radix": "error",
		"spaced-comment": [
			"error",
			"always",
			{
				"markers": [
					"/"
				]
			}
		],
		"use-isnan": "error",
		"valid-typeof": "off",
		"semi": ["error", "never"]
	}
}
