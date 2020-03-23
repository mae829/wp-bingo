module.exports = {
	"extends": "stylelint-config-recommended-scss",
	"defaultSeverity": "warning",
	"ignoreFiles": [ "**/*.js" ],
	"plugins": [
		"stylelint-declaration-use-variable",
		"stylelint-order",
		"stylelint-scss"
	],
	"rules": {
		"order/order": [
			"custom-properties",
			{
				"type": "at-rule",
				"name": "extend"
			},
			{
				"type": "at-rule",
				"name": "include"
			},
			"declarations",
			{
				"type": "rule",
				"selector": /^&::\w+/
			},
			{
				"type": "at-rule",
				"name": "media"
			},
			"rules",
			{
				"type": "rule",
				"selector": /^&--\w+/
			},
			{
				"type": "rule",
				"selector": /^&__\w+/
			},
			{
				"type": "rule",
				"selector": /^&:\w+/
			}
		],
		"order/properties-alphabetical-order": true,
		"scss/at-else-empty-line-before": "never",
		"scss/at-else-if-parentheses-space-before": "always",
		"scss/at-extend-no-missing-placeholder": true,
		"scss/at-import-no-partial-leading-underscore": true,
		"scss/at-import-partial-extension": "never",
		"scss/at-function-pattern": "^[a-z]+([a-z0-9-]+[a-z0-9]+)?$",
		"scss/at-mixin-pattern": "^[a-z]+([a-z0-9-]+[a-z0-9]+)?$",
		"scss/comment-no-loud": true,
		"scss/dollar-variable-pattern": "^[a-z]+([a-z0-9-]+[a-z0-9]+)?$",
		"scss/selector-no-redundant-nesting-selector": true,
		"sh-waqar/declaration-use-variable": [ [
			"color", "font-family", {
				"ignoreValues": [
					"transparent",
					"inherit"
				]
			}
		] ],
		"at-rule-blacklist": [ "debug" ],
		"at-rule-empty-line-before": [ "always", {
			"except": [ "after-same-name" ],
			"ignore": [ "after-comment", "inside-block" ],
			"ignoreAtRules": [ "font-face", "mixin" ]
		} ],
		"at-rule-no-vendor-prefix": true,
		"at-rule-semicolon-newline-after": "always",
		"color-hex-case": "lower",
		"color-hex-length": "short",
		"color-named": "never",
		"block-closing-brace-newline-before": "always",
		"block-closing-brace-empty-line-before": "never",
		"block-closing-brace-newline-after": "always",
		"block-opening-brace-newline-after": "always",
		"block-opening-brace-space-before": "always",
		"declaration-bang-space-after": "never",
		"declaration-bang-space-before": "always",
		"declaration-block-no-redundant-longhand-properties": true,
		"declaration-block-semicolon-newline-after": "always-multi-line",
		"declaration-block-trailing-semicolon": "always",
		"declaration-colon-space-after": "always",
		"declaration-colon-space-before": "never",
		"declaration-empty-line-before": [ "never", {
			"ignore": [ "after-comment" ]
		} ],
		"declaration-no-important": true,
		"declaration-property-value-blacklist": {
			"/^border$/": [ "0" ]
		},
		"font-family-name-quotes": "always-where-recommended",
		"font-weight-notation": [ "numeric", {
			"ignore": [ "relative" ]
		} ],
		"function-comma-space-after": "always",
		"function-comma-space-before": "never",
		"function-parentheses-space-inside": "never",
		"function-url-quotes": "always",
		"function-url-scheme-blacklist": [
			"/^ftp/",
			"/^http/"
		],
		"function-url-no-scheme-relative": true,
		"indentation": 2,
		"length-zero-no-unit": true,
		"linebreaks": "unix",
		"max-empty-lines": 1,
		"max-nesting-depth": [ 4, {
			"ignore": [
				"blockless-at-rules",
				"pseudo-classes"
			]
		} ],
		"media-feature-name-no-vendor-prefix": true,
		"media-feature-name-whitelist": "min-width",
		"no-eol-whitespace": true,
		"no-empty-first-line": true,
		"no-empty-source": null,
		"no-missing-end-of-source-newline": true,
		"number-leading-zero": "never",
		"number-no-trailing-zeros": true,
		"property-no-vendor-prefix": true,
		"rule-empty-line-before": [ "always", {
			"except": "first-nested",
			"ignore": "after-comment"
		} ],
		"selector-attribute-operator-space-after": "never",
		"selector-attribute-operator-space-before": "never",
		"selector-class-pattern": [ "^[a-z0-9]+(-[a-z0-9]+)*(__[a-z]+)?(--[a-z]+)?$", {
			"message": "Class names should match the BEM CSS naming convention."
		} ],
		"selector-list-comma-newline-after": "always",
		"selector-list-comma-newline-before": "never-multi-line",
		"selector-max-compound-selectors": 3,
		"selector-max-id": 0,
		"selector-no-qualifying-type": [ true, {
			"ignore": [ "class", "id" ]
		} ],
		"selector-no-vendor-prefix": true,
		"selector-pseudo-element-colon-notation": "double",
		"shorthand-property-no-redundant-values": true,
		"string-quotes": "single",
		"unit-case": "lower",
		"unit-no-unknown": true,
		"unit-whitelist": [
			"ch", "em", "ex", "rem",
			"cm", "in", "mm", "pc", "pt", "px", "q",
			"vh", "vw", "vmin", "vmax",
			"deg", "grad", "rad", "turn",
			"ms", "s",
			"Hz", "kHz",
			"dpi", "dpcm", "dppx",
			"%"
		],
		"value-list-comma-space-after": "always",
		"value-list-comma-space-before": "never",
		"value-list-max-empty-lines": 0,
		"value-no-vendor-prefix": true
	}
}
