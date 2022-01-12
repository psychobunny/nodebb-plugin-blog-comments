<!-- IF mainPost -->
	<!-- IF atTop -->
		<div class="topic-profile-pic user">
			<!-- IF isLoggedIn -->
			<img src="{user.picture}" class="profile-image" />
			<!-- ELSE -->
			<img src="https://1.gravatar.com/avatar/177d180983be7a2c95a4dbe7451abeba?s=95&d=&r=PG" class="profile-image" />
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
	<!-- ENDIF atTop -->

	<ul id="nodebb-comments-list">
		<!-- BEGIN posts -->
		<li <!-- IF pagination --> class="nodebb-post-fadein" <!-- ENDIF pagination --> <!-- IF !posts.index --> class="nodebb-post-fadein" <!-- ENDIF !posts.index --> >
			<div class="topic-item">
				<div class="topic-body">
					<div class="topic-profile-pic">
						<!-- IF profileLink -->
							<a href="{relative_path}/user/{posts.user.userslug}">
						<!-- ENDIF profileLink -->
						<!-- IF posts.user.picture -->
							<img src="{posts.user.picture}" alt="{posts.user.username}" class="profile-image" title="{posts.user.username}" />
						<!-- ELSE -->
							<div class="profile-image" style="background-color: {posts.user.icon:bgColor}" title="{posts.user.username}" alt="{posts.user.username}">{posts.user.icon:text}</div>
						<!-- ENDIF posts.user.picture -->
						<!-- IF profileLink -->
							</a>
						<!-- ENDIF profileLink -->
					</div>
					<div class="topic-text">
						<div class="post-content" itemprop="text"><small><strong>{posts.user.username}</strong> commented {posts.timestamp}</small><br />{posts.content}</div>
					</div>
				</div>
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

	<!-- IF show_branding -->
		<small class="nodebb-copyright">Powered by <a href="http://nodebb.org" target="_blank">NodeBB</a> &bull; <a href="{relative_path}/topic/{tid}">View original thread</a></small>
	<!-- ENDIF show_branding -->

	<button class="btn btn-primary" <!-- IF !posts.length -->style="display: none"<!-- ENDIF !posts.length --> id="nodebb-load-more">Load more comments...</button>
<!-- ELSE -->
	Commenting has been disabled.
	<!-- IF isAdmin -->
	<form action="{relative_path}/comments/publish" method="post">
		<button class="btn btn-primary">Publish this article to NodeBB</button>
		<input type="hidden" name="markdown" id="nodebb-content-markdown" />
		<input type="hidden" name="title" id="nodebb-content-title" />
		<input type="hidden" name="cid" id="nodebb-content-cid" />
		<input type="hidden" name="tags" id="nodebb-content-tags" />
		<input type="hidden" name="id" value="{article_id}" />
		<input type="hidden" name="url" value="{redirect_url}" />
		<input type="hidden" name="_csrf" value="{token}" />
	</form>
	<!-- ENDIF isAdmin -->
<!-- ENDIF mainPost -->
