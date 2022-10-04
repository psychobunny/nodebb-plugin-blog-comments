<div class="row">
	<div class="col-sm-2 col-12 settings-header">
		Publish Settings
	</div>
	<div class="col-sm-10 col-12">
		<form>
			<div class="mb-3">
				<label for="blog-comments:name">Name of your blog</label>
				<input type="text" data-field="blog-comments:name" id="blog-comments:name" title="Blog Name" class="form-control" placeholder="My Blog">
				<p class="form-text">Comma-separated for more than one blog</p>
			</div>
			<div class="mb-3">
				<label for="blog-comments:url">Link to your blog</label>
				<input type="text" id="blog-comments:url" data-field="blog-comments:url" title="Blog URL" class="form-control" placeholder="http://blog.mydomain.com">
				<p class="form-text">Comma-separated for more than one blog</p>
			</div>
			<div class="mb-3">
				<label for="blog-comments:cid">Category ID where this plugin will publish articles</label>
				<input id="blog-comments:cid" type="text" data-field="blog-comments:cid" title="Category ID" class="form-control" placeholder="1">
				<p class="form-text">You may optionally comma-separate these values, or just use one category ID to post all blogs in one category</p>
			</div>
			<div class="mb-3">
				<label for="blog-comments:compose-location">Comment compose form location</label>
				<select id="blog-comments:compose-location" data-field="blog-comments:compose-location" class="form-control">
					<option value="top">Compose on top</option>
					<option value="bottom">Compose on bottom</option>
				</select>
				<p class="form-text">You may place the composer on top or on the bottom of the comment thread</p>
			</div>
		</form>
	</div>
</div>


<button id="save" class="floating-button mdl-button mdl-js-button mdl-button--fab mdl-js-ripple-effect mdl-button--colored">
	<i class="material-icons">save</i>
</button>
