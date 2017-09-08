(function( $ ){
    'use strict';

    $(function() {

        var $bingoMetaTable   = $('#wp-bingo-meta');

        // Disable "Remove" button for field if it's single one
        var $repeatables = $bingoMetaTable.find('.wb-repeatable-field:not(.empty-field)');

        var repeatablesCount    = $repeatables.length;

        if ( repeatablesCount == 1 ) {
            $repeatables.first().find('.remove-field').addClass('disabled');
        }

        // Disable "Add" button if max is already reached
        var repeatLimit = $bingoMetaTable.find('.wb-repeatable-fields').attr('data-repeat-limit');

        repeatLimit = parseInt( repeatLimit );

        if ( repeatLimit == repeatablesCount ) {
            $bingoMetaTable.find('.add-field').addClass('disabled');
        }

        /**
         * Click method for add-field button
         */
        $bingoMetaTable.on( 'click', '.add-field', function( e ) {

            e.preventDefault();

            var $this       = $(this),
                $parent     = $this.parent(),
                $original   = $parent.find('.empty-field'),
                iterator    = $original.attr('data-iterator');

            // Parse the iterator and add one ( the data iterator doesn't account for the field we are about to add )
            var count   = parseInt( iterator );

            // Add a new box if it's less than the limit
            if ( count <= repeatLimit ) {

                var $clone  = $original.clone(true);

                $original.removeClass('empty-field hidden');

                $clone
                  .attr( 'data-iterator', count + 1 )
                  .data( 'iterator', count + 1 );

                $clone.insertAfter($original);

            }

            // Disable button if we've reached our limit
            if ( count == repeatLimit ) {
                $this.addClass('disabled');
            }

            // Disable "Remove" button for field if it's single one
            var $firstRemove = $bingoMetaTable.find('.wb-repeatable-field').first().find('.remove-field');

            if ( $firstRemove.hasClass('disabled') ) {
                $firstRemove.removeClass('disabled');
            }

            return false;

        });

        /**
         * Click method for remove-field button
         */
        $bingoMetaTable.on( 'click', '.remove-field', function( e ) {

            e.preventDefault();

            var $this       = $(this);

            if ( !$this.hasClass('disabled') ) {

                var $field      = $this.parent('.wb-repeatable-field'),
                    $parent     = $this.parents('.wb-repeatable-fields'),
                    $addField   = $parent.find('.add-field');

                $field.remove();

                // Manipulate add-field button
                if ( $addField.hasClass('disabled') ) {
                    $addField.removeClass('disabled');
                }

                // Disable "Remove" button for field if it's single one
                var $repeatables = $bingoMetaTable.find('.wb-repeatable-field:not(.empty-field)');

                var repeatablesCount    = $repeatables.length;

                if ( repeatablesCount == 1 ) {
                    $repeatables.first().find('.remove-field').addClass('disabled');
                }

                console.log('about to decrease iterator');
                // Decrease data-iterator of empty field by one
                var $emptyField             = $bingoMetaTable.find('.wb-repeatable-field.empty-field'),
                    emptyFieldNewIterator   = $emptyField.data('iterator') - 1;

                console.log(emptyFieldNewIterator);

                $emptyField
                    .attr( 'data-iterator', emptyFieldNewIterator )
                    .data( 'iterator', emptyFieldNewIterator );

            }

            return false;

        });

    });

})( jQuery );
