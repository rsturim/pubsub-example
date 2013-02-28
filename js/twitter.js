(function($) {
		
	var Twitter = {
		init: function() {
			this.template = '<li>{{tweet}}</li>';
			this.query = '@tutspremium';
			this.tweets = [];
			this.timer;

			this.cache();
			this.bindEvents();
			this.subscriptions();


			$.publish( 'twitter/query' );
			this.searchInput.val( this.query );


			return this;
		},

		cache: function() {	
			this.container = $('ul.tweets');
			this.searchInput = $('#q');
		},

		bindEvents: function() {
			this.searchInput.on( 'keyup', this.search );
		},

		subscriptions: function() {
			$.subscribe( 'twitter/query', this.fetchJSON );
			$.subscribe( 'twitter/results', this.renderResults );
		},

		search: function() {
			var self = Twitter,
				input = this;

			clearTimeout( self.timer );

			self.timer = ( input.value.length >= 3 ) && setTimeout(function() {
				self.query = input.value;
				$.publish( 'twitter/query' );
			}, 400);
		},

		fetchJSON: function() {
			var url = 'http://search.twitter.com/search.json?callback=?&q=';

			return $.getJSON( url + Twitter.query, function( data ) {
				Twitter.tweets = data.results;
				$.publish( 'twitter/results' );
			});
		},

		renderResults: function() {
			var self = Twitter,
				frag = [],
				tweet;

			self.container.html(
				$.map( self.tweets, function( obj, index ) {
					var t = 
						obj.text.replace(/(http:[^\s]+)/, '<a href="$1">$1</a>')
								.replace(/@([^\s:]+)/, '<a href="http://twitter.com/$1">@$1</a>');

					return self.template.replace(/{{tweet}}/, t);
				}).join('')
			);
		}
	};

	window.Twitter = Twitter.init();

})(jQuery);
