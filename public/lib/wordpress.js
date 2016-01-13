(function() {
	"use strict";
	
	var articlePath = window.location.protocol + '//' + window.location.host + window.location.pathname;

	var pluginURL = nodeBBURL + '/plugins/nodebb-plugin-blog-comments',
		savedText, nodebbDiv, contentDiv, commentsDiv, commentsCounter, commentsAuthor, commentsCategory;

	var stylesheet = document.createElement("link");
	stylesheet.setAttribute("rel", "stylesheet");
	stylesheet.setAttribute("type", "text/css");
	stylesheet.setAttribute("href", pluginURL + '/css/comments.css');

	document.getElementsByTagName("head")[0].appendChild(stylesheet);
	document.getElementById('nodebb/comments').insertAdjacentHTML('beforebegin', '<div id="nodebb"></div>');
	nodebbDiv = document.getElementById('nodebb');

	function newXHR() {
		try {
	        return XHR = new XMLHttpRequest();
	    } catch (e) {
	        try {
	            return XHR = new ActiveXObject("Microsoft.XMLHTTP");
	        } catch (e) {
	            return XHR = new ActiveXObject("Msxml2.XMLHTTP");
	        }
	    }
	}

	var XHR = newXHR(), pagination = 0, modal;

	function authenticate(type) {
		savedText = contentDiv.value;
		modal = window.open(nodeBBURL + "/" + type + "/#blog/authenticate","_blank","toolbar=no, scrollbars=no, resizable=no, width=600, height=675");
		var timer = setInterval(function() {
			if(modal.closed) {  
				clearInterval(timer);
				pagination = 0;
				reloadComments();
			}  
		}, 500);
	}

	function normalizePost(post) {
		return post.replace(/href="\/(?=\w)/g, 'href="' + nodeBBURL + '/')
				.replace(/src="\/(?=\w)/g, 'src="' + nodeBBURL + '/');
	}

	XHR.onload = function() {
		if (XHR.status >= 200 && XHR.status < 400) {
			var data = JSON.parse(XHR.responseText), html;

			commentsDiv = document.getElementById('nodebb-comments-list');
			commentsCounter = document.getElementById('nodebb-comments-count');
			commentsAuthor = document.getElementById('nodebb-comments-author');
			commentsCategory = document.getElementById('nodebb-comments-category');

			data.relative_path = nodeBBURL;
			data.redirect_url = articlePath;
			data.article_id = articleID;
			data.pagination = pagination;
			data.postCount = parseInt(data.postCount, 10);

			for (var p in data.posts) {
				if (data.posts.hasOwnProperty(p)) {
					var post = data.posts[p];
					post.timestamp = timeAgo(parseInt(post.timestamp), 10);
					post.isReply = post.hasOwnProperty('toPid') && parseInt(post.toPid) !== parseInt(data.tid) - 1;
					post.deletedReply = false;
					post.parentUsername = '';

					if (post.hasOwnProperty('parent')) {
						if (post.parent.hasOwnProperty('username')) {
							post.parentUsername = post.parent.username;
						} else {
							post.deletedReply = true;
						}
					}

					if (post['blog-comments:url']) {
						delete data.posts[p];
					}
				}
			}
			
			if (commentsCounter) {
				commentsCounter.innerHTML = data.postCount ? (data.postCount - 1) : 0;
			}

			if (commentsCategory) {
				commentsCategory.innerHTML = '<a href="' + nodeBBURL + '/category/' + data.category.slug + '">' + data.category.name + '</a>';
			}

			if (commentsAuthor) {
				commentsAuthor.innerHTML = '<span class="nodebb-author"><img src="' + data.mainPost.user.picture + '" /> <a href="' + nodeBBURL + '/user/' + data.mainPost.user.userslug + '">' + data.mainPost.user.username + '</a></span>';
			}

			if (pagination) {
				html = normalizePost(parse(data, templates.blocks['posts']));
				commentsDiv.innerHTML = commentsDiv.innerHTML + html;	
			} else {
				html = parse(data, data.template);
				nodebbDiv.innerHTML = normalizePost(html);
			}

			contentDiv = document.getElementById('nodebb-content');

			setTimeout(function() {
				var lists = nodebbDiv.getElementsByTagName("li");
				for (var list in lists) {
					if (lists.hasOwnProperty(list)) {
						lists[list].className = '';
					}
				}
			}, 100);
			
			if (savedText) {
				contentDiv.value = savedText;
			}

			if (data.tid) {
				var loadMore = document.getElementById('nodebb-load-more');
				loadMore.onclick = function() {
					pagination++;
					reloadComments();
				}
				if (data.posts.length) {
					loadMore.style.display = 'inline-block';	
				}

				if (pagination * 10 + data.posts.length + 1 >= data.postCount) {
					loadMore.style.display = 'none';
				}

				if (typeof jQuery !== 'undefined' && jQuery() && jQuery().fitVids) {
					jQuery(nodebbDiv).fitVids();
				}

				if (data.user && data.user.uid) {
					var error = window.location.href.match(/error=[\w-]*/);
					if (error) {
						error = error[0].split('=')[1];
						if (error === 'too-many-posts') {
							error = 'Please wait before posting so soon.';
						} else if (error === 'content-too-short') {
							error = 'Please post a longer reply.';
						}

						document.getElementById('nodebb-error').innerHTML = error;
					}					
				} else {
					document.getElementById('nodebb-register').onclick = function() {
						authenticate('register');
					};

					document.getElementById('nodebb-login').onclick = function() {
						authenticate('login');
					}
				}

				var nodebbCommentsList = nodebbDiv.querySelector('#nodebb-comments-list');
				var bindOnClick = function(nodeList, handler) {
					for (var i = nodeList.length - 1; i >= 0; i--) {
					  nodeList[i].onclick = handler;
					}
				};
				var isInViewport = function(element) {
					var rect = element.getBoundingClientRect();
					return (
					    rect.top >= 0 && rect.left >= 0 &&
					    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
					    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
					);
				};

				bindOnClick(nodebbCommentsList.querySelectorAll('[component="post/parent"]'), function(event) {
					var element = event.target;
					var goTo = nodebbCommentsList.querySelector('.topic-item[data-pid="' + element.getAttribute('data-topid') + '"]');

					if (!goTo) {
						goTo = nodebbDiv.querySelector('#nodebb-load-more');
					}

					if (!isInViewport(goTo)) {
						goTo.scrollIntoView(false);
					}

					goTo.classList.add('highlight');
					element.classList.add('highlight');

					setTimeout(function() {
						goTo.classList.remove('highlight');
						element.classList.remove('highlight');
					}, 1000);

				});

				bindOnClick(nodebbCommentsList.querySelectorAll('[component="post/reply"],[component="post/quote"]'), function(event) {
					var topicItem = event.target;
					while (topicItem && !topicItem.classList.contains('topic-item')) {
						topicItem = topicItem.parentElement;
					}

					if (topicItem) {
						var elementForm = topicItem.querySelector('form');
						var visibleForm = nodebbCommentsList.querySelector('li .topic-item form:not(.hidden)');
						var formInput = elementForm.querySelector('textarea');

						if (visibleForm && visibleForm !== elementForm) {
							visibleForm.classList.add('hidden');
						}

						if (/\/quote$/.test(event.target.getAttribute('component'))) {
							var postBody = topicItem.querySelector('.post-content .post-body');
							var quote = (postBody.innerText ? postBody.innerText : postBody.textContent).split('\n').map(function(line) { return line ? '> ' + line : line; }).join('\n');
							formInput.value = '@' + topicItem.getAttribute('data-userslug') + ' said:\n' + quote + formInput.value;
						} else {
							formInput.value = '@' + topicItem.getAttribute('data-userslug') + ': ' + formInput.value
						}

						elementForm.classList.remove('hidden');
					}
				});

			} else {
				if (data.isAdmin) {
					var adminXHR = newXHR();
					adminXHR.open('GET', '/api/get_post/?post_id=' + articleID);
					adminXHR.onload = function() {
						if (adminXHR.status >= 200 && adminXHR.status < 400) {
							var articleData = JSON.parse(adminXHR.responseText.toString()).post,
								translator = document.createElement('span'),
								wptags = articleData.tags,
								tags = [];

							translator.innerHTML = articleData.excerpt;

							var markdown = translator.firstChild.innerHTML + '\n\n**Click [here]('+articlePath+') to see the full blog post**';

							for (var tag in wptags) {
								if (wptags.hasOwnProperty(tag)) {
									tags.push(wptags[tag].title);
								}
							}

							document.getElementById('nodebb-content-markdown').value = markdown;
							document.getElementById('nodebb-content-title').value = articleData.title_plain;
							document.getElementById('nodebb-content-cid').value = categoryID || -1;
							document.getElementById('nodebb-content-tags').value = JSON.stringify(tags);
						} else {
							console.warn('Unable to access API. Please install the JSON API plugin located at: http://wordpress.org/plugins/json-api');
						}
					}

					adminXHR.send();
				}
			}
		}
	};

	function reloadComments() {
		XHR.open('GET', nodeBBURL + '/comments/get/' + articleID + '/' + pagination, true);
		XHR.withCredentials = true;
		XHR.send();
	}

	reloadComments();


	function timeAgo(time){
		var time_formats = [
			[60, 'seconds', 1],
			[120, '1 minute ago'],
			[3600, 'minutes', 60],
			[7200, '1 hour ago'],
			[86400, 'hours', 3600],
			[172800, 'yesterday'],
			[604800, 'days', 86400],
			[1209600, 'last week'],
			[2419200, 'weeks', 604800],
			[4838400, 'last month'],
			[29030400, 'months', 2419200],
			[58060800, 'last year'],
			[2903040000, 'years', 29030400]
		];

		var seconds = (+new Date() - time) / 1000;

		if (seconds < 10) {
			return 'just now';
		}
		
		var i = 0, format;
		while (format = time_formats[i++]) {
			if (seconds < format[0]) {
				if (!format[2]) {
					return format[1];
				} else {
					return Math.floor(seconds / format[2]) + ' ' + format[1] + ' ago';
				}
			}
		}
		return time;
	}

	var templates = {blocks: {}};
	function parse (data, template) {
		function replace(key, value, template) {
			var searchRegex = new RegExp('{' + key + '}', 'g');
			return template.replace(searchRegex, value);
		}

		function makeRegex(block) {
			return new RegExp("<!--[\\s]*BEGIN " + block + "[\\s]*-->[\\s\\S]*<!--[\\s]*END " + block + "[\\s]*-->", 'g');
		}

		function makeConditionalRegex(block) {
			return new RegExp("<!--[\\s]*IF " + block + "[\\s]*-->([\\s\\S]*?)<!--[\\s]*ENDIF " + block + "[\\s]*-->", 'g');
		}

		function getBlock(regex, block, template) {
			data = template.match(regex);
			if (data == null) return;

			if (block !== undefined) templates.blocks[block] = data[0];

			var begin = new RegExp("(\r\n)*<!-- BEGIN " + block + " -->(\r\n)*", "g"),
				end = new RegExp("(\r\n)*<!-- END " + block + " -->(\r\n)*", "g"),

			data = data[0]
				.replace(begin, "")
				.replace(end, "");

			return data;
		}

		function setBlock(regex, block, template) {
			return template.replace(regex, block);
		}

		var regex, block;

		return (function parse(data, namespace, template, blockInfo) {
			if (!data || data.length == 0) {
				template = '';
			}

			function checkConditional(key, value) {
				var conditional = makeConditionalRegex(key),
					matches = template.match(conditional);

				if (matches !== null) {
					for (var i = 0, ii = matches.length; i < ii; i++) {
						var conditionalBlock = matches[i].split(/<!-- ELSE -->/);

						var statement = new RegExp("(<!--[\\s]*IF " + key + "[\\s]*-->)|(<!--[\\s]*ENDIF " + key + "[\\s]*-->)", 'gi');

						if (conditionalBlock[1]) {
							// there is an else statement
							if (!value) {
								template = template.replace(matches[i], conditionalBlock[1].replace(statement, ''));
							} else {
								template = template.replace(matches[i], conditionalBlock[0].replace(statement, ''));
							}
						} else {
							// regular if statement
							if (!value) {
								template = template.replace(matches[i], '');
							} else {
								template = template.replace(matches[i], matches[i].replace(statement, ''));
							}
						}
					}
				}
			}

			for (var d in data) {
				if (data.hasOwnProperty(d)) {
					if (typeof data[d] === 'undefined') {
						continue;
					} else if (data[d] === null) {
						template = replace(namespace + d, '', template);
					} else if (data[d].constructor == Array) {
						checkConditional(namespace + d + '.length', data[d].length);
						checkConditional('!' + namespace + d + '.length', !data[d].length);

						namespace += d + '.';

						var regex = makeRegex(d),
							block = getBlock(regex, namespace.substring(0, namespace.length - 1), template);

						if (block == null) {
							namespace = namespace.replace(d + '.', '');
							continue;
						}

						var numblocks = data[d].length - 1,
							i = 0,
							result = "";

						do {
							result += parse(data[d][i], namespace, block, {iterator: i, total: numblocks});
						} while (i++ < numblocks);

						namespace = namespace.replace(d + '.', '');
						template = setBlock(regex, result, template);
					} else if (data[d] instanceof Object) {
						template = parse(data[d], d + '.', template);
					} else {
						var key = namespace + d,
							value = typeof data[d] === 'string' ? data[d].replace(/^\s+|\s+$/g, '') : data[d];

						checkConditional(key, value);
						checkConditional('!' + key, !value);

						if (blockInfo && blockInfo.iterator) {
							checkConditional('@first', blockInfo.iterator === 0);
							checkConditional('!@first', blockInfo.iterator !== 0);
							checkConditional('@last', blockInfo.iterator === blockInfo.total);
							checkConditional('!@last', blockInfo.iterator !== blockInfo.total);
						}

						template = replace(key, value, template);
					}
				}
			}

			if (namespace) {
				var regex = new RegExp("{" + namespace + "[\\s\\S]*?}", 'g');
				template = template.replace(regex, '');
				namespace = '';
			} else {
				// clean up all undefined conditionals
				template = template.replace(/<!-- ELSE -->/gi, 'ENDIF -->')
									.replace(/<!-- IF([^@]*?)ENDIF([^@]*?)-->/gi, '');
			}

			return template;

		})(data, "", template);
	}
}());