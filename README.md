# NodeBB Blog Comments

Lets NodeBB act as a comments engine/widget for your blog. Currently supports [Ghost](https://ghost.org/), with plans to support WordPress and others in the near future. Check out a live example of this plugin on [NodeBB's Blog](http://blog.nodebb.org), which is powered by Ghost.

The comments are exposed to any plugin you have built into the core, so it is completely possible to have emoticons, embedded video, and/or whatever else you want in the comments section of your blog.

Articles are published to a forum category of your choice, and will gain a tag that links it back to the original article.

## Installation

First install the plugin:

    npm install nodebb-plugin-blog-comments

Activate the plugin in the ACP and reboot NodeBB. Head over to the Blog Comments section in the ACP and select the Category ID you'd like to publish your blog content to (default is Category 1). Make sure you put the correct URL to your blog.

## Screenshots

Who needs screenshots when you got a [live demo](http://blog.nodebb.org)? :D

### Ghost Snippet

Place this anywhere in `yourtheme/post.hbs`, ideally at the bottom - somewhere after `{{/post}}` and before `article`. All you have to edit is the first line - put the URL to your NodeBB forum's home page here.

```javascript
<a id="nodebb/comments"></a>
<script type="text/javascript">
var nodeBBURL = 'http://your.nodebb.com',
	articleID = '{{post.id}}';

(function() {
var nbb = document.createElement('script'); nbb.type = 'text/javascript'; nbb.async = true;
nbb.src = nodeBBURL + '/plugins/nodebb-plugin-blog-comments/lib/embed.min.js';
(document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(nbb);
})();
</script>
<noscript>Please enable JavaScript to view comments</noscript>
```

You may optionally put a "# of comments" counter anywhere on your page with the following code:

    <span id="nodebb-comments-count"></span> Comments

### Publishing

Head over to the article that you'd like to publish. The code will detect if you're both an administrator of Ghost and NodeBB (so ensure that you're logged into both) and will display a publish button if so.

## TODO

* Republishing (for now you can just edit both the article and the published blog).
* WP compatibility coming soon