'use strict';

const fs = require('fs');
const path = require('path');

const winston = module.parent.require('winston');
const nconf = module.parent.require('nconf');
const relativePath = nconf.get('relative_path');

const db = require.main.require('./src/database');
const meta = require.main.require('./src/meta');
const posts = require.main.require('./src/posts');
const topics = require.main.require('./src/topics');
const user = require.main.require('./src/user');
const groups = require.main.require('./src/groups');

const Comments = module.exports;

Comments.init = async function (params) {
	const { router, middleware } = params;
	const routeHelpers = require.main.require('./src/routes/helpers');

	Comments.template = await fs.promises.readFile(path.resolve(__dirname, './public/templates/comments/comments.tpl'), { encoding: 'utf-8' });

	router.get('/comments/get/:id/:pagination?', middleware.applyCSRF, routeHelpers.tryRoute(Comments.getCommentData));
	router.post('/comments/reply', middleware.applyCSRF, routeHelpers.tryRoute(Comments.replyToComment));
	router.post('/comments/publish', middleware.applyCSRF, routeHelpers.tryRoute(Comments.publishArticle));

	routeHelpers.setupAdminPageRoute(router, '/admin/plugins/blog-comments', middleware, [], (req, res) => {
		res.render('admin/plugins/blog-comments', {});
	});
};

Comments.getTopicIDByCommentID = async function (commentID) {
	return await db.getObjectField('blog-comments', commentID);
};

Comments.getCommentData = async function (req, res, next) {
	const commentID = req.params.id;
	const pagination = req.params.pagination ? req.params.pagination : 0;

	const tid = await Comments.getTopicIDByCommentID(commentID);
	const topicData = await topics.getTopicData(tid);
	if (!topicData) {
		return next();
	}
	const start = pagination * 10;
	const stop = start + 9;
	const [postData, userData, isAdmin, isPublisher, categoryData, mainPost] = await Promise.all([
		topics.getTopicPosts(topicData, `tid:${tid}:posts`, start, stop, req.uid, true),
		user.getUserData(req.uid),
		user.isAdministrator(req.uid),
		groups.isMember(req.uid, 'publishers'),
		topics.getCategoryData(tid),
		topics.getMainPost(tid, req.uid),
	]);

	const hostUrls = (meta.config['blog-comments:url'] || '').split(',');
	let url;

	hostUrls.forEach((hostUrl) => {
		hostUrl = hostUrl.trim();
		if (hostUrl[hostUrl.length - 1] === '/') {
			hostUrl = hostUrl.substring(0, hostUrl.length - 1);
		}

		if (hostUrl === req.get('origin')) {
			url = req.get('origin');
		}
	});

	if (url) {
		res.header('Access-Control-Allow-Origin', url);
	} else {
		winston.warn(`[nodebb-plugin-blog-comments] Origin (${req.get('origin')}) does not match hostUrls: ${hostUrls.join(', ')}`);
	}

	res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
	res.header('Access-Control-Allow-Credentials', 'true');

	const posts = postData.filter((post) => {
		if (post.user && post.user.picture && !post.user.picture.startsWith('http')) {
			post.user.picture = post.user.picture.replace(relativePath, '');
		}
		return !post.deleted;
	});

	if (userData.picture && !userData.picture.startsWith('http')) {
		userData.picture = userData.picture.replace(relativePath, '');
	}
	const compose_location = meta.config['blog-comments:compose-location'] || 'top';
	const top = compose_location === 'top';
	const bottom = compose_location === 'bottom';

	res.json({
		posts: posts,
		postCount: topicData.postcount,
		user: userData,
		template: Comments.template,
		token: req.csrfToken && req.csrfToken(),
		isAdmin: !isAdmin ? isPublisher : isAdmin,
		isLoggedIn: req.loggedIn,
		tid: tid,
		category: categoryData,
		mainPost: mainPost,
		atTop: top,
		atBottom: bottom,
	});
};

Comments.replyToComment = async function (req, res) {
	const { content, tid, url } = req.body;
	try {
		await topics.reply({
			tid: tid,
			uid: req.uid,
			content: content,
			req: req,
		});
		res.redirect(`${url}#nodebb-comments`);
	} catch (err) {
		return res.redirect(`${url}?error=${err.message}#nodebb-comments`);
	}
};

Comments.publishArticle = async function (req, res) {
	const { markdown, title, url, tags } = req.body;
	const commentID = req.body.id;
	let cid = JSON.parse(req.body.cid);

	if (cid === -1) {
		const hostUrls = (meta.config['blog-comments:url'] || '').split(',');
		let position = 0;

		hostUrls.forEach((hostUrl, i) => {
			hostUrl = hostUrl.trim();
			if (hostUrl[hostUrl.length - 1] === '/') {
				hostUrl = hostUrl.substring(0, hostUrl.length - 1);
			}

			if (hostUrl === req.get('origin')) {
				position = i;
			}
		});

		cid = meta.config['blog-comments:cid'].toString() || '';
		cid = parseInt(cid.split(',')[position], 10) || parseInt(cid.split(',')[0], 10) || 1;
	}

	const [isAdmin, isPublisher] = await Promise.all([
		user.isAdministrator(req.uid),
		groups.isMember(req.uid, 'publishers'),
	]);

	if (!isAdmin && !isPublisher) {
		return res.json({ error: 'Only Administrators or members of the publishers group can publish articles' });
	}
	try {
		const result = await topics.post({
			uid: req.uid,
			title: title,
			content: markdown,
			tags: tags ? JSON.parse(tags) : [],
			req: req,
			cid: cid,
		});
		if (result && result.postData && result.postData.tid) {
			await posts.setPostField(result.postData.pid, 'blog-comments:url', url);
			await db.setObjectField('blog-comments', commentID, result.postData.tid);
			res.redirect(`${(req.header('Referer') || '/')}#nodebb-comments`);
		}
	} catch (err) {
		res.json({ error: `Unable to post topic ${err.message}` });
	}
};

Comments.addAdminLink = function (custom_header) {
	custom_header.plugins.push({
		route: '/plugins/blog-comments',
		icon: 'fa-book',
		name: 'Blog Comments',
	});
	return custom_header;
};
