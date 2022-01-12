'use strict';

/* eslint-disable no-undef */
(function () {
	const articlePath = `${window.location.protocol}//${window.location.host}${window.location.pathname}`;

	const pluginURL = `${nodeBBURL}/plugins/nodebb-plugin-blog-comments`;
	let savedText; let contentDiv; let commentsDiv; let commentsCounter; let commentsAuthor; let
		commentsCategory;

	const stylesheet = document.createElement('link');
	stylesheet.setAttribute('rel', 'stylesheet');
	stylesheet.setAttribute('type', 'text/css');
	stylesheet.setAttribute('href', `${pluginURL}/css/comments.css`);

	document.getElementsByTagName('head')[0].appendChild(stylesheet);
	document.getElementById('nodebb-comments').insertAdjacentHTML('beforebegin', '<div id="nodebb"></div>');
	const nodebbDiv = document.getElementById('nodebb');

	function newXHR() {
		try {
			return new XMLHttpRequest();
		} catch (e) {
			try {
				return new ActiveXObject('Microsoft.XMLHTTP');
			} catch (e) {
				return new ActiveXObject('Msxml2.XMLHTTP');
			}
		}
	}

	const XHR = newXHR(); let pagination = 0;

	function normalizePost(post) {
		return post.replace(/href="\/(?=\w)/g, `href="${nodeBBURL}/`)
			.replace(/src="\/(?=\w)/g, `src="${nodeBBURL}/`);
	}

	function getArticleData() {
		if (!articleData) {
			console.error('Declare articleData variable!');
			return;
		}

		const tags = (articleData.tags || []).map(tag => tag.title);
		const { url } = articleData;
		const title = articleData.title_plain;
		const cid = articleData.cid || -1;

		const translator = document.createElement('span');
		translator.innerHTML = articleData.markDownContent;
		const markdown = [
			translator.firstChild.innerHTML,
			articleData.url && articleData.url.length ? `\n\n**Click [here](${url}) to see the full blog post**` : '',
		].join('');

		return [markdown, title, cid, tags];
	}

	XHR.onload = function () {
		if (XHR.status === 302) {
			reloadComments();
			return;
		}
		if (XHR.status >= 200 && XHR.status < 400) {
			const data = JSON.parse(XHR.responseText); let
				html;

			commentsDiv = document.getElementById('nodebb-comments-list');
			commentsCounter = document.getElementById('nodebb-comments-count');
			commentsAuthor = document.getElementById('nodebb-comments-author');
			commentsCategory = document.getElementById('nodebb-comments-category');

			data.relative_path = nodeBBURL;
			data.redirect_url = (articleData && articleData.url) ? articleData.url : articlePath;
			data.article_id = articleID;
			data.pagination = pagination;
			data.postCount = parseInt(data.postCount, 10);

			data.posts.forEach((_, i) => {
				data.posts[i].timestamp = timeAgo(parseInt(data.posts[i].timestamp, 10));
				if (data.posts[i]['blog-comments:url']) {
					delete data.posts[i];
				}
			});

			if (commentsCounter) {
				commentsCounter.innerHTML = data.postCount ? (data.postCount - 1) : 0;
			}

			if (commentsCategory) {
				commentsCategory.innerHTML = `<a href="${nodeBBURL}/category/${data.category.slug}">${data.category.name}</a>`;
			}

			if (commentsAuthor) {
				commentsAuthor.innerHTML = `<span class="nodebb-author"><img src="${data.mainPost.user.picture}" /> <a href="${nodeBBURL}/user/${data.mainPost.user.userslug}">${data.mainPost.user.username}</a></span>`;
			}

			if (pagination) {
				html = window.templates.parse(window.templates.getBlock(data.template, 'posts'), data);
				commentsDiv.innerHTML += normalizePost(html);
			} else {
				html = window.templates.parse(data.template, data);
				nodebbDiv.innerHTML = normalizePost(html);
			}

			contentDiv = document.getElementById('nodebb-content');

			setTimeout(() => {
				const lists = Array.from(nodebbDiv.getElementsByTagName('li'));
				lists.forEach((_, i) => {
					lists[i].className = '';
				});
			}, 100);

			if (savedText) {
				contentDiv.value = savedText;
			}

			if (data.mainPost) {
				const loadMore = document.getElementById('nodebb-load-more');
				if (loadMore) {
					loadMore.onclick = function () {
						pagination += 1;
						reloadComments();
					};
				}

				if (data.posts.length) {
					loadMore.style.display = 'inline-block';
				}

				if ((pagination * 10) + data.posts.length + 1 >= data.postCount) {
					loadMore.style.display = 'none';
				}

				if (typeof jQuery !== 'undefined' && jQuery() && jQuery().fitVids) {
					jQuery(nodebbDiv).fitVids();
				}

				if (data.user && data.user.uid) {
					let error = window.location.href.match(/error=[\w-]*/);
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
					const authenticate = data.authFlow !== 'redirect' ? function (url) {
						savedText = contentDiv.value;
						const modal = window.open(url, '_blank', 'toolbar=no, scrollbars=no, resizable=no, width=600, height=675');
						const timer = setInterval(() => {
							if (modal.closed) {
								clearInterval(timer);
								pagination = 0;
								reloadComments();
							}
						}, 500);
					} : function (url) {
						location.href = `${url}?callbackUrl=${data.redirect_url}`;
					};

					const registerButton = document.getElementById('nodebb-register');
					if (registerButton) {
						registerButton.onclick = function () {
							authenticate(data.registerURL && data.registerURL.length ? data.registerURL : `${nodeBBURL}/register/#blog/authenticate`);
						};
					}

					const loginButton = document.getElementById('nodebb-login');
					if (loginButton) {
						loginButton.onclick = function () {
							authenticate(data.loginURL && data.loginURL.length ? data.loginURL : `${nodeBBURL}/login/#blog/authenticate`);
						};
					}
				}
			} else if (data.autoCreate) {
				const [markdown, title, cid, tags] = getArticleData();
				if (!markdown.length || !title.length) {
					console.error('Need a title and content to auto-create a topic.');
					return;
				}

				const formValues = {
					markdown,
					title,
					cid,
					tags: JSON.stringify(tags),
					id: data.article_id,
					url: data.redirect_url,
					_csrf: data.token,
				};

				const formData = Object.keys(formValues).map(name => `${encodeURIComponent(name)}=${encodeURIComponent(formValues[name])}`).join('&');

				const postXHR = newXHR();
				postXHR.onreadystatechange = function () {
					if (postXHR.readyState === postXHR.DONE) {
						reloadComments();
					}
				};
				postXHR.open('POST', `${data.relative_path}/comments/publish`, true);
				postXHR.withCredentials = true;
				postXHR.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
				postXHR.send(formData);
			} else if (data.isAdmin) {
				const [markdown, title, cid, tags] = getArticleData();

				document.getElementById('nodebb-content-markdown').value = markdown;
				document.getElementById('nodebb-content-title').value = title;
				document.getElementById('nodebb-content-cid').value = cid;
				document.getElementById('nodebb-content-tags').value = JSON.stringify(tags);
			}
		}
	};

	function reloadComments() {
		XHR.open('GET', `${nodeBBURL}/comments/get/${articleID}/${pagination}`, true);
		XHR.withCredentials = true;
		XHR.send();
	}

	reloadComments();

	function timeAgo(time) {
		const time_formats = [
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
			[2903040000, 'years', 29030400],
		];

		const seconds = (+new Date() - time) / 1000;

		if (seconds < 10) {
			return 'just now';
		}

		const format = time_formats.find(time => seconds < time[0]);
		if (!format) {
			return time;
		}
		if (!format[2]) {
			return format[1];
		}

		return `${Math.floor(seconds / format[2])} ${format[1]} ago`;
	}
}());


// https://raw.githubusercontent.com/benchpressjs/benchpressjs/v0.3.1/lib/templates.js
/* eslint-disable */
!function(){const e={cache:{},globals:{}},t={};let n,o;const r={nestedConditionals:/(?!^)<!-- IF([\s\S]*?)ENDIF[ a-zA-Z0-9\/\._:]*-->(?!$)/g,conditionalBlock:/[\r\n?\n]*?<!-- ELSE -->[\r\n?\n]*?/,conditionalHelper:/<!-- IF function.([\s\S]*?)-->/,conditionalArgs:/[ ]*,[ ]*/,innerLoop:/\s*<!-- BEGIN([\s\S]*)END ([\s\S]*?)-->/g,removeTabspace:/^\t*?|^\r\n?\t*?|\t?$|\r\n?\t*?$/g,removeWhitespace:/(^[\r\n?|\n]*)|([\r\n\t]*$)/g,cleanupEmptyLoops:/\s*<!-- BEGIN([\s\S]*?)END ([\s\S]*?)-->/g,cleanupMissingKeys:/[\r\n]*?[\/]?\{[a-zA-Z0-9\.]+[\r\n]*?\}/g,leftoverRoot:/\.\.\/([\S]*?)[\}| ]/g,getUndefinedKeys:/<!-- IF[\s!]*([\s\S]*?) -->/g,backReferenceFix:/\$+/g,escapeBlocks:/<!--([\s\S]*?)-->/g,escapeKeys:/\{([\s\S]*?)\}/g,rootKey:/\{\.\.\/([\S]*?)\}/g,rootConditional:/IF \.\.\/([\S]*?)/g,rootConditionalFalse:/IF !\.\.\/([\S]*?)/g};"undefined"!=typeof self&&self.addEventListener&&self.addEventListener("message",t=>{if(!(t&&t.data&&t.data.template&&t.data.object))return;const{data:n}=t;self.postMessage({result:n.block?e.parse(n.template,n.block,n.object):e.parse(n.template,n.object),signature:n.signature},"*")},!1);const c={};let l=0;const s=2**53-1;function i(e,t,n,r){o?function(e,t,n,r){++l>s&&(l=0),t=function(e){for(const t in e)e.hasOwnProperty(t)&&"function"!=typeof e[t]||delete e[t];return e}(t),o.postMessage({template:e,object:t,block:n,signature:l}),c[l]=function(e){r(e),delete c[l]}}(e,t,n,r):r(a(n,e,t))}function a(t,n,o){return x(n=b(t=t?e.getBlock(n,t):n,o),n,o)}function f(e,t,n){return e.replace(t,n.toString().replace(r.backReferenceFix,"$$$"))}function u(e,t,n){let o;return n=n.toString(),o=f(e,new RegExp(`{{${t}}}`,"g"),n),f(o,new RegExp(`{${t}}`,"g"),n.replace(r.escapeKeys,"&#123;$1&#125;").replace(r.escapeBlocks,"&lt;!--$1--&gt;"))}function p(e,t){return t=`(${t})?`,new RegExp(`(\x3c!-- BEGIN ${t}${e} --\x3e[\\r\\n?|\\n]?)|(\x3c!-- END ${t}${e} --\x3e)`,"g")}function g(e){return new RegExp(`\x3c!-- IF ${e} --\x3e([\\s\\S]*?)\x3c!-- ENDIF ${e.split(",")[0]} --\x3e`,"g")}function d(e,t,n){return h(h(e,`!${t}`,!n),t,n)}function h(e,t,n){const o=e.match(g(t));if(o){const c=function(e){return new RegExp(`(\x3c!-- IF ${e} --\x3e)|(\x3c!-- ENDIF ${e.split(",")[0]} --\x3e)`,"g")}(t);for(let t=0,l=o.length;t<l;t++){const l=o[t].match(r.nestedConditionals),s=f(o[t].replace(c,""),r.nestedConditionals,"\x3c!-- NESTED --\x3e"),i=s.split(r.conditionalBlock);if(e=i[1]?f(e,o[t],f(i[n?0:1],r.removeWhitespace,"")):f(e,o[t],n?f(s,r.removeWhitespace,""):""),l)for(let t=0,n=l.length;t<n;t++)e=f(e,"\x3c!-- NESTED --\x3e",l[t])}}return e}function $(t,n){return t.apply(e,n)}function x(e,n,o){const r=e.match(/{function.*?}/g,"");if(!r)return n;for(let e=0,c=r.length;e<c;++e){const c=r[e],l=r[e].replace("{function.","").split("}").shift().split(/[ ]*,[ ]*/),s=l.shift();let i=[];if(l.length)for(let e=0,t=l.length;e<t;e++)i.push(o[l[e]]);else i=[o];t[s]&&(n=f(n,new RegExp(c,"g"),$(t[s],i)))}return n}function E(e,t,n,o){return y(e,t,n,o,!0)}function y(e,t,n,o,c){c||(e=d(e,`${o+n}.length`,t[n].length));const l=function(e,t){return t=`(${t})?`,new RegExp(`\x3c!-- BEGIN ${t}${e} --\x3e[\\s\\S]*?\x3c!-- END ${t}${e} --\x3e`)}(n,o);let s,i;if(!t[n].length&&!c)return e.replace(l,"");for(;null!==(s=e.match(l));){const a=(s=s[0].replace(p(n,o),"")).match(r.innerLoop);if(s=s.replace(r.innerLoop,"\x3c!-- INNER LOOP --\x3e").replace(r.rootKey,`{${o}${n}.$1}`).replace(r.rootConditional,`IF ${o}${n}.$1`).replace(r.rootConditionalFalse,`IF !${o}${n}.$1`),a)for(let e=0,t=a.length;e<t;e++)s=f(s,"\x3c!-- INNER LOOP --\x3e",a[e]);e=f(e,l,(i=m(s=s.replace(r.removeTabspace,""),t[n],`${o+n}.`,c)).replace(r.removeWhitespace,""))}return e}function m(e,t,n,o){let r="";for(let c in t)if(t.hasOwnProperty(c)){let l="";o||(c=parseInt(c,10)),l+=b(e,t[c],n),o?l=l.replace(/@key/g,c).replace(/@value/g,t[c]):(l=d(l,"@first",0===c),l=(l=d(l,"@last",c===t.length-1)).replace(/@index/g,c).replace(/@value/g,t[c])),r+=l=x(e,l,t[c])}return r}function S(e,t,n){return u(e=d(e,t,n),t,n)}function b(e,n,o){let c;for(c in o=o||"",n)if(n.hasOwnProperty(c)){if(void 0===n[c]||"function"==typeof n[c]||!e.match(c)||n[c]&&n[c].constructor===Array)continue;e=null===n[c]?u(e,o+c,""):n[c]instanceof Object?b(e=d(e=E(e,n,c,o),c,n[c]),n[c],`${o+c}.`):S(e,o+c,n[c])}for(c in n)n.hasOwnProperty(c)&&Array.isArray(n[c])&&e.match(c)&&(e=y(e=u(e,`${o+c}.length`,n[c].length),n,c,o));return o?o="":e=function(e,t){const n=(e=e.replace(r.cleanupEmptyLoops,"")).match(r.cleanupMissingKeys)||[];for(var o=0,c=n.length;o<c;o++)e="/"!==n[o].substr(0,1)?e.replace(n[o],""):e.replace(n[o],n[o].slice(1));const l={},s=e.match(r.getUndefinedKeys)||[];for(var o=0,c=s.length;o<c;o++){const e=r.getUndefinedKeys.exec(s[o]);e&&(l[e[1]]=!1)}const i=e.match(r.leftoverRoot)||[];for(var o=0,c=i.length;o<c;o++){let e=r.leftoverRoot.exec(i[o]);e&&(e=e[1].split(".")[0],t[e]&&(l[`../${e}`]=t[e]))}let a=!1;for(const e in l)if(l.hasOwnProperty(e)){a=!0;break}return a?b(e,l,""):e}(e=function(e,n){let o,c;for(;null!==(o=e.match(r.conditionalHelper));){const l=o[1].trim(),s=l.split(r.conditionalArgs);c=s[0],t[c]?(s.shift(),s.unshift(n),e=d(e,`function.${l}`,t[c].apply(null,s))):e=e.replace(g(`function.${l}`))}return e}(e,n),n),e}e.setupWebWorker=function(e){try{(o=new Worker(e)).addEventListener("message",e=>{c[e.data.signature]&&c[e.data.signature](e.data.result)},!1)}catch(e){}},e.parse=function(t,o,r,c){if("string"!=typeof o&&(c=r,r=o,o=!1),!t)return c?c(""):"";if(r=function(t){for(const n in e.globals)e.globals.hasOwnProperty(n)&&(t[n]=t[n]||e.globals[n]);return t}(r||{}),n&&c)e.cache[t]?i(e.cache[t],r,o,c):n(t,n=>{e.cache[t]=n,i(n,r,o,c)});else{if(!c)return a(o,t,r);i(t,r,o,c)}},e.registerHelper=function(e,n){t[e]=n},e.registerLoader=function(e){n=e},e.setGlobal=function(t,n){e.globals[t]=n},e.getBlock=function(e,t){return e.replace(new RegExp(`[\\s\\S]*(\x3c!-- BEGIN ${t} --\x3e[\\s\\S]*?\x3c!-- END ${t} --\x3e)[\\s\\S]*`,"g"),"$1")},e.flush=function(){e.cache={}},"undefined"!=typeof module&&(module.exports=e),"undefined"!=typeof window&&(window.templates=e)}();
/* eslint-enable */
