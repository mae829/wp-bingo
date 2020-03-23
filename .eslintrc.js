module.exports = {
	"env": {
		"browser": true,
		"es6": true,
		"jquery": true,
		"node": true
	},
	"extends": [
		"eslint:recommended",
		"wordpress"
	],
	"parserOptions": {
		"ecmaVersion": 2017,
		"sourceType": "module"
	},
	"rules": {
		"complexity": [
			"warn", {
				"max": 8
			}
		],
		"eqeqeq": [ "error", "smart"] ,
		"lines-around-comment": "off",
		"space-in-parens": [ "warn", "always" ],
		"no-empty-function": [
			"warn", {
				"allow": [
					"methods"
				]
			}
		],
		"no-multi-spaces": [
			"warn", {
				"exceptions": {
					"VariableDeclarator": true
				}
			}
		],
		"no-unused-vars": [
			"error", {
				"args": "after-used"
			}
		],
		"vars-on-top": "off",
		"wrap-iife": [
			"error",
			"inside"
		],
		"yoda": "off"
	}
};
