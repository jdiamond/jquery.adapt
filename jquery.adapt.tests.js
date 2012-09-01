test('$.adapt() adapts plain JS objects', function() {

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

    var $peeps = window.$peeps = $.adapt(peeps);

    var $twitterUsers = $peeps.filter(':has(contacts [type=twitter])');
    equal($twitterUsers.val().name, 'Alice', '.filter() with :has()');

    var $nonTwitterUsers = $peeps.filter(':not(:has(contacts [type=twitter]))');
    equal($nonTwitterUsers.val().name, 'Bob', '.filter() with :not(:has())');

    var $usersWithMultipleEmailAddresses = $peeps.filter(function() {
        return $(this).find('contacts [type=email]').length > 1;
    });
    equal($usersWithMultipleEmailAddresses.val().name, 'Bob', '.filter() with function');

    var firstUserWithMultipleEmailAddresses = $usersWithMultipleEmailAddresses.first().val();
    equal($usersWithMultipleEmailAddresses.val().name, 'Bob', ':.first() and .val()');

    var allEmailAddresses = $peeps.find('contacts [type=email] value').vals();
    deepEqual(allEmailAddresses, [ 'alice@example.com', 'bob@example.org', 'bob@example.net' ], '.find() and .vals()');

    var tweeters = [];
    $twitterUsers.on('sendTweet', function() {
        tweeters.push(this.value.name);
    });
    $peeps.trigger('sendTweet');
    deepEqual(tweeters, [ 'Alice' ], '.on() and .trigger()');
});

test('.find()', function() {
    var $objects = $.adapt([ { id: 'A', child: { id: 'C' } }, { id: 'B', child: { id: 'D' } } ]);

    deepEqual($objects.find('id').vals(), [ 'A', 'C', 'B', 'D' ], 'descendant selector');
    deepEqual($objects.find('> id').vals(), [ 'A', 'B' ], 'child selector');
    deepEqual($objects.find('id:last').vals(), [ 'C', 'D' ], 'unexpected :last result'); // This looks wrong, but it's how jQuery works with DOM elements, too.
    deepEqual($.adapt({ nodes: $objects.vals() }).find('id:last').vals(), [ 'D' ], 'expected :last result');
});

test('.filter()', function() {
    var $objects = $.adapt([ { id: 'A' }, { id: 'B' } ]);

    deepEqual($objects.filter('[id]').vals(), $objects.vals(), 'has attribute selector');
    deepEqual($objects.filter('[id=A]').val().id, 'A', 'attribute equals selector');
    deepEqual($objects.filter(':first').val().id, 'A', ':first selector');
    deepEqual($objects.filter(':last').val().id, 'B', ':last selector');
});

test('.has()', function() {
    var $objects = $.adapt([ { id: 'A', children: [ { id: 'C' } ] }, { id: 'B' } ]);

    deepEqual($objects.has('[id=C]').vals(), [ $objects.val() ], '.has() with attribute equals selector');
    deepEqual($objects.has('[id=A]').vals(), [], '.has() with attribute equals selector only works on descendants');
});

test('.is()', function() {
    var $objects = $.adapt([ { id: 'A', children: [ { id: 'C' } ] }, { id: 'B' } ]);

    ok($objects.is('[id=A]'), '.is() with attribute equals selector');
    ok(!$objects.is('[id=C]'), '.is() with attribute equals selector does not work on descendants');
});