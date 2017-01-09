<!-- IF tid -->
	<!-- IF atTop -->
		<div class="topic-profile-pic user first-image">

			<!-- IF !isLoggedIn -->
				<img src="https://1.gravatar.com/avatar/177d180983be7a2c95a4dbe7451abeba?s=95&d=&r=PG" class="profile-image" />
			<!-- ELSE -->
				<!-- IF user.picture -->
				<img data-uid="{user.uid}" src="{user.picture}" class="profile-image" title="{user.username}" />
				<!-- ELSE -->
				<div class="profile-image" style="background-color: {user.icon:bgColor};" title="{user.username}">{user.icon:text}</div>
				<!-- ENDIF user.picture -->
			<!-- ENDIF !isLoggedIn -->
		</div>

		<form action="{relative_path}/comments/reply" class="clearfix" method="post">
			<textarea id="nodebb-content" class="form-control" name="content" placeholder="Join the conversation" rows="3"></textarea>
		<!-- IF isLoggedIn -->
			<small>Signed in as <strong>{user.username}</strong>. <strong id="nodebb-error"></strong></small>
			<button class="btn btn-primary">Post a Reply</button>
			<input type="hidden" name="_csrf" value="{token}" />
			<input type="hidden" name="tid" value="{tid}" />
			<input type="hidden" name="url" value="{redirect_url}" />
		</form>
		<!-- ELSE -->
		</form>
		<button class="btn btn-primary" id="nodebb-register">Register</button>
		<button class="btn btn-primary" id="nodebb-login">Login</button>
		<br />
		<!-- ENDIF isLoggedIn -->
	<!-- ENDIF atTop -->

	<ul id="nodebb-comments-list">
		<!-- BEGIN posts -->
		<li <!-- IF pagination --> class="nodebb-post-fadein" <!-- ENDIF pagination --> <!-- IF !posts.index --> class="nodebb-post-fadein" <!-- ENDIF !posts.index --> >
			<div class="topic-item" data-pid="{posts.pid}" data-userslug="{user.userslug}">
				<div class="topic-body">
					<div class="topic-profile-pic">
						<a href="{relative_path}/user/{user.userslug}">
							<!-- IF user.picture -->
							<img src="{user.picture}" alt="{user.username}" class="profile-image" title="{user.username}">
							<!-- ELSE -->
							<div class="profile-image" style="background-color: {user.icon:bgColor}" title="{user.username}" alt="{user.username}">{user.icon:text}</div>
							<!-- ENDIF user.picture -->
						</a>
					</div>
					<div class="topic-text">
						<div class="post-content" itemprop="text">
							<small>
								<span class="post-tools no-select">
									<a component="post/reply" style="color: inherit; text-decoration: none;">reply</a>
									<a component="post/quote" style="color: inherit; text-decoration: none;">quote</a>
									<!-- <a component="post/quote"><i class="fa fa-quote-left"></i> quote</a> -->
								</span>
								<a href="{relative_path}/user/{user.userslug}" style="color: inherit; text-decoration: none;"><strong>{user.username}</strong></a>
								<span title="{posts.timestampISO}">commented {posts.timestamp}</span>
								<!-- IF posts.isReply -->
								<!-- IF !posts.deletedReply -->
									<button component="post/parent" class="reply-label no-select" data-topid="{posts.toPid}"><i class="fa fa-reply"></i> @{posts.parentUsername}</button>
								<!-- ENDIF !posts.deletedReply -->
								<!-- ENDIF posts.isReply -->
							</small>
							<br />
							<div class="post-body">{posts.content}</div>
						</div>
					</div>
				</div>

				<form action="{relative_path}/comments/reply" method="post" class="sub-reply-input hidden">
 					<textarea id="nodebb-content" class="form-control" name="content" placeholder="Join the conversation" rows="3"></textarea>
 					<button class="btn btn-primary">Reply to {user.username}</button>
 					<input type="hidden" name="_csrf" value="{token}" />
 					<input type="hidden" name="tid" value="{tid}" />
 					<input type="hidden" name="toPid" value="{posts.pid}" />
 					<input type="hidden" name="url" value="{redirect_url}" />
 				</form>
			</div>
		</li>
		<!-- END posts -->
	</ul>
	<br />

	<!-- IF atBottom -->
		<div class="topic-profile-pic user">
			<!-- IF isLoggedIn -->
			<img src="{user.picture}" class="profile-image" />
			<!-- ELSE -->
			<img src="http://1.gravatar.com/avatar/177d180983be7a2c95a4dbe7451abeba?s=95&d=&r=PG" class="profile-image" />
			<!-- ENDIF isLoggedIn -->
		</div>
		<form action="{relative_path}/comments/reply" method="post">
			<textarea id="nodebb-content" class="form-control" name="content" placeholder="Join the conversation" rows="3"></textarea>
		<!-- IF isLoggedIn -->
			<small>Signed in as <strong>{user.username}</strong>. <strong id="nodebb-error"></strong></small>
			<button class="btn btn-primary">Post a Reply</button>
			<input type="hidden" name="_csrf" value="{token}" />
			<input type="hidden" name="tid" value="{tid}" />
			<input type="hidden" name="url" value="{redirect_url}" />
		</form>
		<!-- ELSE -->
		</form>
		<button class="btn btn-primary" id="nodebb-register">Register</button>
		<button class="btn btn-primary" id="nodebb-login">Login</button>
		<br />
		<!-- ENDIF isLoggedIn -->
	<!-- ENDIF atBottom -->

	<small class="nodebb-copyright">Powered by <a href="{relative_path}" target="_blank">{siteTitle}</a> &bull; <a href="{relative_path}/topic/{tid}">View original thread</a></small>
	<button class="btn btn-primary" <!-- IF !posts.length -->style="display: none"<!-- ENDIF !posts.length --> id="nodebb-load-more">Load more comments...</button>
<!-- ELSE -->
	{siteTitle} Commenting has been disabled.
	<!-- IF isAdmin -->
	<form action="{relative_path}/comments/publish" method="post">
		<button class="btn btn-primary">Publish this article to {siteTitle}</button>
		<input type="hidden" name="markdown" id="nodebb-content-markdown" />
		<input type="hidden" name="title" id="nodebb-content-title" />
		<input type="hidden" name="cid" id="nodebb-content-cid" />
		<input type="hidden" name="blogger" id="nodebb-content-blogger" />
		<input type="hidden" name="tags" id="nodebb-content-tags" />
		<input type="hidden" name="id" value="{article_id}" />
		<input type="hidden" name="url" value="{redirect_url}" />
		<input type="hidden" name="_csrf" value="{token}" />
	</form>
	<!-- ENDIF isAdmin -->
<!-- ENDIF tid -->
