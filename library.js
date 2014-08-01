(function(module) {
	"use strict";

	var Comments = {};

	var db = module.parent.require('../src/database.js'),
		meta = module.parent.require('../src/meta.js'),
		posts = module.parent.require('../src/posts.js'),
		topics = module.parent.require('../src/topics.js'),
		user = module.parent.require('../src/user.js'),
		fs = require('fs'),
		path = require('path'),
		async = require('async');

	module.exports = Comments;

	Comments.getTopicIDByCommentID = function(commentID, callback) {
		db.getObjectField('blog-comments', commentID, function(err, tid) {
			callback(err, tid);
		});
	};

	Comments.getCommentData = function(req, res, callback) {
		var commentID = req.params.id,
			pagination = req.params.pagination ? req.params.pagination : 0,
			uid = req.user ? req.user.uid : 0;

		Comments.getTopicIDByCommentID(commentID, function(err, tid) {
			var disabled = false;

			async.parallel({
				posts: function(next) {
					if (disabled) {
						next(err, []);
					} else {
						topics.getTopicPosts(tid, 'tid:' + tid + ':posts', 0 + req.params.pagination * 10, 9 + req.params.pagination * 9, uid, true, next);
					}
				},
				postCount: function(next) {
					topics.getTopicField(tid, 'postcount', next);
				},
				user: function(next) {
					user.getUserData(uid, next);
				},
				isAdmin: function(next) {
					user.isAdministrator(uid, next);
				}
			}, function(err, data) {
				var hostUrls = (meta.config['blog-comments:url'] || '').split(','),
					url;

				hostUrls.forEach(function(hostUrl) {
					if (hostUrl.trim() === req.get('host')) {
						url = req.get('host');
					}
				});

				res.header("Access-Control-Allow-Origin", url);
				res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
				res.header("Access-Control-Allow-Credentials", "true");

				var posts = data.posts.filter(function(post) {
					return post.deleted === false;
				});

				res.json({
					posts: posts,
					postCount: data.postCount,
					user: data.user,
					template: Comments.template,
					token: res.locals.csrf_token,
					isAdmin: data.isAdmin,
					isLoggedIn: !!uid,
					tid: tid
				});
			});
		});
	};

	Comments.replyToComment = function(req, res, callback) {
		var content = req.body.content,
			tid = req.body.tid,
			url = req.body.url,
			uid = req.user ? req.user.uid : 0;

		topics.reply({
			tid: tid,
			uid: uid,
			content: content
		}, function(err, postData) {
			if(err) {
				return res.redirect(url + '?error=' + err.message + '#nodebb/comments');
			}

			res.redirect(url + '#nodebb/comments');
		});
	};

	Comments.publishArticle = function(req, res, callback) {
		var markdown = req.body.markdown,
			title = req.body.title,
			url = req.body.url,
			commentID = req.body.id,
			tags = req.body.tags,
			uid = req.user ? req.user.uid : 0;

		var hostUrls = (meta.config['blog-comments:url'] || '').split(','),
			position;

		hostUrls.forEach(function(hostUrl, i) {
			if (hostUrl.trim() === req.get('host')) {
				position = i;
			}
		});

		var cid = meta.config['blog-comments:cid'] || '';
		cid = parseInt(cid.split(',')[position], 10) || parseInt(cid.split(',')[0], 10) || 1;
		
		user.isAdministrator(uid, function (err, isAdmin) {
			if (!isAdmin) {
				res.json({error: "Only Administrators can publish articles"});
			}

			topics.post({
				uid: uid,
				title: title,
				content: markdown,
				tags: tags ? JSON.parse(tags) : [],
				req: req,
				cid: cid
			}, function(err, result) {
				if(err) {
					res.json({error: err.message});
				}

				if (result && result.postData && result.postData.tid) {
					posts.setPostField(result.postData.pid, 'blog-comments:url', url);
					db.setObjectField('blog-comments', commentID, result.postData.tid);

					res.redirect((req.header('Referer') || '/') + '#nodebb/comments');	
				} else {
					res.json({error: "Unable to post topic", result: result});
				}
			});
		});
		
	};

	Comments.addLinkbackToArticle = function(post, callback) {
		var hostUrls = (meta.config['blog-comments:url'] || '').split(','),
			position;

		posts.getPostField(post.pid, 'blog-comments:url', function(err, url) {
			if (url) {
				hostUrls.forEach(function(hostUrl, i) {
					if (hostUrl.trim().indexOf(url) !== -1) {
						position = i;
					}
				});

				var blogName = (meta.config['blog-comments:name'] || '');
				blogName = parseInt(blogName.split(',')[position], 10) || parseInt(blogName.split(',')[0], 10) || 1;

				post.profile.push({
					content: "Posted from <strong><a href="+ url +" target='blank'>" + blogName + "</a></strong>"
				});
			}

			callback(err, post);
		});		
	};

	Comments.addAdminLink = function(custom_header, callback) {
		custom_header.plugins.push({
			"route": "/blog-comments",
			"icon": "fa-book",
			"name": "Blog Comments"
		});

		callback(null, custom_header);
	};

	function renderAdmin(req, res, callback) {
		res.render('comments/admin', {});
	}

	Comments.init = function(app, middleware, controllers) {
		fs.readFile(path.resolve(__dirname, './public/templates/comments/comments.tpl'), function (err, data) {
			Comments.template = data.toString();
		});
		
		app.get('/comments/get/:id/:pagination?', Comments.getCommentData);
		app.post('/comments/reply', Comments.replyToComment);
		app.post('/comments/publish', Comments.publishArticle);

		app.get('/admin/blog-comments', middleware.admin.buildHeader, renderAdmin);
		app.get('/api/admin/blog-comments', renderAdmin);
	};

}(module));