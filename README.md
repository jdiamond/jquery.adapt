jQuery.adapt
============

jQuery.adapt is a jQuery plugin that adapts JavaScript objects so that they
can be traversed and manipulated using the standard jQuery API.

    var peeps = [
        {
            name: 'Alice',
            contacts: [
                { type: 'phone', value: '123-555-6789' },
                { type: 'email', value: 'alice@example.com' },
                { type: 'twitter', value: '@alice' }
            ]
        },
        {
            name: 'Bob',
            contacts: [
                { type: 'phone', value: '987-555-4321' },
                { type: 'email', value: 'bob@example.org' },
                { type: 'email', value: 'bob@example.net' }
            ]
        }
    ];

    var $peeps = $.adapt(peeps);

    var $twitterUsers = $peeps.filter(':has(contacts [type=twitter])');

    var $nonTwitterUsers = $peeps.filter(':not(:has(contacts [type=twitter]))');

    var $usersWithMultipleEmailAddresses = $peeps.filter(function() {
        return $(this).find('contacts [type=email]').length > 1;
    });

    var firstUserWithMultipleEmailAddresses = $usersWithMultipleEmailAddresses.first().val();

    var allEmailAddresses = $peeps.find('contacts [type=email] value').vals();

    var tweeters = [];

    $twitterUsers.on('sendTweet', function() {
        tweeters.push(this.value.name);
    });

    $peeps.trigger('sendTweet');

Description
===========

jQuery operates on DOM nodes. It expects the objects you pass in to the jQuery
function to implement specific methods as defined by the DOM specifications.
Your objects probably don't implement those methods so jQuery can't use them.

This jQuery plugin can wrap an object or array of objects with "adapter"
objects. Those adapters do implement the DOM methods jQuery needs in order to
work. Surprisingly, I didn't have to implement too many before I could start
selecting subsets of plain JavaScript objects.

The adapters reference the original objects with their `value` property. You
can use jQuery's built-in `.val()` method to retrieve the original objects.
Since that only returns the first value for the first element in a jQuery
object, this plugin also extends the jQuery prototype with a `.vals()` method
that returns an array containing all of the elements' values.

API
===

$.adapt()
---------

Returns a jQuery object containing the adapted object(s).

Note: The elements of the jQuery object will be adapter objects. To get the
original, unadapted object, use the `value` property, jQuery's `.val()'
method, or this plugin's `.vals()` method.

$.fn.vals()
-----------

Returns an array of all the unadapted values in the jQuery object.

Limitations
===========

Use jQuery 1.8+.

Adapted objects get modified with an `_adapter` property.

Having multiple references to the same child object from different parent
objects will probably be broken.

License
=======

MIT.