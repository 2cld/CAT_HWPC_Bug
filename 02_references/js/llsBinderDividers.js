function llsBinderDividers() {
	// Create llsBinderDividers this after loaded.
	$(function() {
	    // Find list items representing folders and
	    // style them accordingly.  Also, turn them
	    // into links that can expand/collapse the
	    // tree leaf.
	    $('li > ol').each(function(i) {
	        // Find this list's parent list item.
	        var parent_li = $(this).parent('li');

	        // Style the list item as llsBinderSection.
	        parent_li.addClass('llsBinderSection');

	        // Temporarily remove the list from the
	        // parent list item, wrap the remaining
	        // text in an anchor, then reattach it.
	        var sub_list = $(this).remove();
	        parent_li.wrapInner('<a/>').find('a').click(function() {
	            // Make the anchor toggle the leaf display.
	            sub_list.toggle();
	        });
	        parent_li.append(sub_list);
	    });

	    // Hide all lists except the outermost.
	    $('ol ol').hide();
	});
}