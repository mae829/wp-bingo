/* eslint-disable complexity */
import { checkWin } from './functions/check-win.js';
( function() {
	'use strict';

	// Need these items for all functionality below
	var bingoItems = document.getElementsByClassName( 'wp-bingo__item' );
	var itemName = 'wp-bingo';

	// if browser supports localStorage use it (IE8<)
	if ( typeof Storage !== 'undefined' ) {
		var storeCard = false;

		/**
		 * Check if our item exists in storage
		 * - if it does, then replace the values in the squares that were loaded server side
		 *   AND add the active status if it already had it
		 * - else, if the item does not exist in storage, save it
		 */
		if ( localStorage.getItem( itemName ) ) {
			var storedData = JSON.parse( localStorage.getItem( itemName ) );
			var cardData = JSON.parse( storedData.cardData );
			var now = new Date().getTime().toString();
			var expirationTimestamp = storedData.expirationTimestamp;

			// if it's been more than the expiration date, store the new card
			if ( now > expirationTimestamp ) {
				storeCard = true;
			} else {
				for ( var i = 0; i < bingoItems.length; i++ ) {
					if ( i in cardData ) {
						bingoItems[i].innerHTML = cardData[i].html;

						if ( cardData[i].status !== '' ) {
							bingoItems[i].classList.add( 'active' );
						}
					}
				}
			}
		} else {
			storeCard = true;
		}

		if ( storeCard ) {
			// Expiration time variables
			var d = new Date();
			var days = 1;
			var expirationTime = d.getTime() + days * 24 * 60 * 60 * 1000;

			// Create array of bingoItems text to store into storage
			var bingoItemsArray = [];

			for ( var i = 0; i < bingoItems.length; i++ ) {
				var singleItemData = {};

				singleItemData.html = bingoItems[i].innerHTML;

				if ( bingoItems[i].classList.contains( 'active' ) ) {
					singleItemData.status = 'active';
				} else {
					singleItemData.status = '';
				}

				bingoItemsArray.push( singleItemData );
			}

			// iOS 8.3+ Safari Private Browsing mode throws a quota exceeded JS error with localStorage.setItem.
			try {
				var bingoObject = {
					cardData: JSON.stringify( bingoItemsArray ),
					expirationTimestamp: expirationTime
				};

				localStorage.setItem( itemName, JSON.stringify( bingoObject ) );
			} catch ( error ) {
				// Do nothing with localStore if iOS 8.3+ Safari Private Browsing mode, because whatever.
			}
		}
	}

	/**
	 * Toggle class of element when clicked
	 * and save new
	 */
	for ( var i = 0; i < bingoItems.length; i++ ) {
		bingoItems[i].onclick = function() {
			this.classList.toggle( 'active' );

			/**
			 * Attempt to save the active status to storage item/data
			 * toggle status of 'active'
			 * if browser supports localStorage use it (IE8<)
			 * and if the item exists
			 */
			if (
				typeof Storage !== 'undefined' &&
				localStorage.getItem( itemName )
			) {
				var indexNumber = [].indexOf.call(
					this.parentNode.children,
					this
				);

				var storedData = JSON.parse( localStorage.getItem( itemName ) );
				var cardData = JSON.parse( storedData.cardData );

				// Manipulate the existing data and save it again
				cardData[indexNumber].status = this.classList.contains( 'active' ) ?
					'active' :
					'';

				// iOS 8.3+ Safari Private Browsing mode throws a quota exceeded JS error with localStorage.setItem
				try {
					var bingoObject = {
						cardData: JSON.stringify( cardData ),
						expirationTimestamp: storedData.expirationTimestamp
					};

					localStorage.setItem( itemName, JSON.stringify( bingoObject ) );
				} catch ( error ) {
					// Do nothing with localStore if iOS 8.3+ Safari Private Browsing mode, because whatever.
				}
			}

			checkWin( bingoItems );
		};
	}
} )();

