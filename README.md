# NodeBB Blog Comments

Lets NodeBB act as a comments engine/widget for your blog. Currently supports both [Ghost](https://ghost.org/) and [WordPress](http://wordpress.org/). If you'd like to see support for other CMS/blog systems, please submit an issue on our tracker.

The comments are exposed to any plugin you have built into the core, so it is completely possible to have emoticons, embedded video, and/or whatever else you want in the comments section of your blog.

Articles are published to a forum category of your choice, and will gain a tag that links it back to the original article.

## Screenshots

![blog comments](http://i.imgur.com/pPO42Hy.png)

## Installation

First install the plugin:

    npm install nodebb-plugin-blog-comments

Activate the plugin in the ACP and reboot NodeBB. Head over to the Blog Comments section in the ACP and select the Category ID you'd like to publish your blog content to (default is Category 1). Make sure you put the correct URL to your blog.

### Ghost Installation

Place this anywhere in `yourtheme/post.hbs`, ideally at the bottom - somewhere after `{{/post}}` and before `article`. All you have to edit is the first line - put the URL to your NodeBB forum's home page here.

```html
<a id="nodebb/comments"></a>
<script type="text/javascript">
var nodeBBURL = '//your.nodebb.com',
	articleID = '{{post.id}}';

(function() {
var nbb = document.createElement('script'); nbb.type = 'text/javascript'; nbb.async = true;
nbb.src = nodeBBURL + '/plugins/nodebb-plugin-blog-comments/lib/embed.min.js';
(document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(nbb);
})();
</script>
<noscript>Please enable JavaScript to view comments</noscript>
```

### Wordpress Installation

First, install the [Wordpress JSON API](http://wordpress.org/plugins/json-api/) plugin. 

Replace the contents of `/wp-content/themes/YOUR_THEME/comments.php` with the following (back-up the old comments.php, just in case):

```html
<?php
if ( post_password_required() )
	return;
?>

<a id="nodebb/comments"></a>
<script type="text/javascript">
var nodeBBURL = 'http://your.nodebb.com',
	articleID = '<?php echo the_ID(); ?>';

(function() {
var nbb = document.createElement('script'); nbb.type = 'text/javascript'; nbb.async = true;
nbb.src = nodeBBURL + '/plugins/nodebb-plugin-blog-comments/lib/wordpress.js';
(document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(nbb);
})();
</script>
<noscript>Please enable JavaScript to view comments</noscript>
```

### Comments Counter


You may optionally put a "# of comments" counter anywhere on the page with the following code:

```html
<span id="nodebb-comments-count"></span> Comments
```

A mechanism to query the number of comments on another separate page will be available in a future release.

### Author and Category information

![](http://i.imgur.com/NyLs4LQ.png)

To use NodeBB's category and author information (instead of using Ghost's user/tag system), there are two elements that this plugin searches for:

```html
Published by <span id="nodebb-comments-author"></span> in <span id="nodebb-comments-category"></span>
```

### Publishing

Head over to the article that you'd like to publish. The code will detect if you're both an administrator of your blog and NodeBB (so ensure that you're logged into both) and will display a publish button if so.

You may also create a `publishers` group in NodeBB to allow a group of regular users to have publish rights.


### Multiple blogs

You may use a comma-separated entry of blogs in the ACP to support publishing from a network of separate blogs to your forum. You can also choose to put each blog in its own dedicated category, or place them all into one category.

## Sites using this plugin

* [NodeBB's Blog](http://blog.nodebb.org) (Ghost).
* [Burn after compiling](http://burnaftercompiling.com) (Wordpress).

Please submit a PR to add your site here :)

## TODO

* Republishing (for now you can just edit both the article and the published blog).
* Pull CSS files from appropriate plugins? Ability to load custom CSS to style widget.
