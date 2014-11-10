<h1>Blog Comments</h1>
<hr />

<form>
	<p>
		Publish Settings
	</p><br />
	<div class="alert alert-info">
		<p>
			<label>Name of your blog <br /><small>Comma-separated for more than one blog</small></label>
			<input type="text" data-field="blog-comments:name" title="Blog Name" class="form-control" placeholder="My Blog">
			<label>Link to your blog <br /><small>Comma-separated for more than one blog</small></label>
			<input type="text" data-field="blog-comments:url" title="Blog URL" class="form-control" placeholder="http://blog.mydomain.com">
			<label>Category ID where this plugin will publish articles <br /><small>You may optionally comma-separate these values, or just use one category ID to post all blogs in one category</small></label>
			<input type="text" data-field="blog-comments:cid" title="Category ID" class="form-control" placeholder="1">
			<label>Comment compose form location <br /><small>You may have comment the compose window on top or on the bottom of the comment thread</small></label>
			<select data-field="blog-comments:compose-location" class="form-control">
				<option value="top">Compose on top</option>
				<option value="bottom">Compose on bottom</option>
			</select>
			<br />
		</p>
	</div>
</form>

<button class="btn btn-primary" id="save">Save</button>

<script>
	require(['admin/settings'], function(Settings) {
		Settings.prepare();
	});
</script>
