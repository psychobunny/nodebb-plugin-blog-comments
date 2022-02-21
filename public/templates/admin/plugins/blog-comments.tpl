<div class="row">
	<div class="col-sm-2 col-xs-12 settings-header">
		Publish Settings
	</div>
	<div class="col-sm-10 col-xs-12">
		<form>
			<label>Name of your blog</label> <br /><small>Comma-separated for more than one blog</small>
			<input type="text" data-field="blog-comments:name" title="Blog Name" class="form-control" placeholder="My Blog"><br />
			<label>Link to your blog</label> <br /><small>Comma-separated for more than one blog</small>
			<input type="text" data-field="blog-comments:url" title="Blog URL" class="form-control" placeholder="http://blog.mydomain.com"><br />
			<label>Category ID where this plugin will publish articles</label> <br /><small>You may optionally comma-separate these values, or just use one category ID to post all blogs in one category</small>
			<input type="text" data-field="blog-comments:cid" title="Category ID" class="form-control" placeholder="1"><br />
			<label>Comment compose form location</label> <br /><small>You may place the composer on top or on the bottom of the comment thread</small>
			<select data-field="blog-comments:compose-location" class="form-control">
				<option value="top">Compose on top</option>
				<option value="bottom">Compose on bottom</option>
			</select>
		</form>
	</div>
</div>


<button id="save" class="floating-button mdl-button mdl-js-button mdl-button--fab mdl-js-ripple-effect mdl-button--colored">
	<i class="material-icons">save</i>
</button>
