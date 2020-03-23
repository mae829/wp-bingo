# WP Bingo

**Authors:**      [Mike Estrada](https://miguelestrada.dev/)
**Tags:**         bingo, wordpress
**License:**      GPLv2 or later
**License URI:**  http://www.gnu.org/licenses/gpl-2.0.html

## Description

Fun plugin to have a Bingo card on a page template

## Features:

* Two page templates to display Bingo card
* Uses localStorage to save user's bingo card in case refresh occurs or closing browser accidentally
* Custom metabox for words/phrases in admin area once page template has been selected
* Repeatable fields for words in metabox
* CSS grid for laying out boxes

## Installation

1. Place the plugin directory inside of your plugins directory (typically /wp-content/plugins).
2. Activate plugin through the Plugins Admin page
3. Select one of the Bingo templates for a page
4. Define words/phrases to use (24) in custom metabox

## Changelog
All notable changes to this project will be documented here.


### 1.1.1
* Fix horizontal logic for win
* Clean up files to abide by WP code standards
* Add nonce field and nonce check to abide by WP code standards
* Add check for autosave in save method
* Update gulp file for gulp 4
* Switch gulp file name to use babel and ES6
* Add a gulp config file holding sever config
* Update workflow to use stylelint + webpack
* Organize files into src/assets
* Bump version number

### 1.0
* Initial creation
