/* eslint-disable complexity */
import { launchConfetti } from './launch-confetti.js';

export const checkWin = function( bingoItems ) {
	/**
	 * If Bingo has been achieved, display confetti on screen to celebrate!
	 */
	var row1 = 0,
		row2 = 0,
		row3 = 0,
		row4 = 0,
		row5 = 0;
	var col1 = 0,
		col2 = 0,
		col3 = 0,
		col4 = 0,
		col5 = 0;
	var diag1 = 0,
		diag2 = 0;

	/**
	 * Increment the values of the rows, columns, or diagonals
	 * We will test if any add up to 5 to declare winner
	 */
	for ( var i = 0; i < bingoItems.length; i++ ) {
		if ( bingoItems[i].classList.contains( 'active' ) ) {
			if ( i < 5 ) {
				++row1;
			} else if ( i >= 5 && i < 10 ) {
				++row2;
			} else if ( i >= 10 && i < 15 ) {
				++row3;
			} else if ( i >= 15 && i < 20 ) {
				++row4;
			} else if ( i >= 20 && i < 25 ) {
				++row5;
			}

			if ( i % 5 == 0 ) {
				++col1;
			} else if ( ( i - 1 ) % 5 == 0 ) {
				++col2;
			} else if ( ( i - 2 ) % 5 == 0 ) {
				++col3;
			} else if ( ( i - 3 ) % 5 == 0 ) {
				++col4;
			} else if ( ( i - 4 ) % 5 == 0 ) {
				++col5;
			}

			if ( i % 6 == 0 ) {
				++diag1;
			}
			if ( i != 0 && i != 24 && i % 4 == 0 ) {
				++diag2;
			}
		}
	}

	if (
		row1 == 5 ||
		row2 == 5 ||
		row3 == 5 ||
		row4 == 5 ||
		row5 == 5 ||
		col1 == 5 ||
		col2 == 5 ||
		col3 == 5 ||
		col4 == 5 ||
		col5 == 5 ||
		diag1 == 5 ||
		diag2 == 5
	) {
		launchConfetti();
	}
};
