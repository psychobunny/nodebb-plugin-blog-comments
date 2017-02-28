/***********************************************
  needShareButton
  - Version 1.0.0
  - Copyright 2015 Dzmitry Vasileuski
	- Licensed under MIT (http://opensource.org/licenses/MIT)
***********************************************/

(function() {

	// share dropdown class
	window.needShareDropdown = function(elem, options) {
		// create element reference
		var root = this;
		root.elem = elem;
		root.elem.className += root.elem.className.length ? ' need-share-button' : 'need-share-button';

		/* Helpers
		***********************************************/

    // get title from html
    root.getTitle = function() {
	    var content;
	    // check querySelector existance for old browsers
	    if (document.querySelector) {
		    if (content = document.querySelector('meta[property="og:title"]') || document.querySelector('meta[name="twitter:title"]')) {
		      return content.getAttribute('content');
		    } else if (content = document.querySelector('title')) {
		      return content.innerText;
		    } else
		    	return '';
		  } else {
		  	if (content = document.title)
		      return content.innerText;
		    else
		    	return '';
		  }
	  };

	  // get image from html
	  root.getImage = function() {
	    var content;
	    // check querySelector existance for old browsers
	    if (document.querySelector) {
		    if (content = document.querySelector('meta[property="og:image"]') || document.querySelector('meta[name="twitter:image"]')) {
		      return content.getAttribute('content');
		    } else
		    	return '';
		  } else
		  	return '';
	  };

	  // get description from html
	  root.getDescription = function() {
	    var content;
	    // check querySelector existance for old browsers
	    if (document.querySelector) {
		    if (content = document.querySelector('meta[property="og:description"]') || document.querySelector('meta[name="twitter:description"]') || document.querySelector('meta[name="description"]')) {
		      return content.getAttribute('content');
		    } else
		      return '';
		  } else {
		  	if (content = document.getElementsByTagName('meta').namedItem('description'))
		  		return content.getAttribute('content');
		  	else
		  		return '';
		  }
	  };

	  // share urls for all networks
	  root.share = {
	  	'weibo': function () {
	  		var url = 'http://v.t.sina.com.cn/share/share.php?title='
	  		+ encodeURIComponent(root.options.title)
	  		+ "&url="+encodeURIComponent(root.options.url)
	  		+ "&pic="+encodeURIComponent(root.options.image);
	  		root.popup(url);
	  	},
	  	'wechat': function () {
	  		var imgSrc = 'https://api.qinco.me/api/qr?size=400&content='+encodeURIComponent(root.options.url);
	  		var img = root.dropdown.getElementsByClassName('need-share-wechat-code-image')[0];
	  		if (img) {
	  			img.remove();
	  		} else {
		  		img = document.createElement('img');
		  		img.src = imgSrc;
		  		img.alt = 'loading wechat image...';
		  		img.setAttribute("class",'need-share-wechat-code-image');
		  		root.dropdown.appendChild(img);
	  		}
	  	},
	  	'mailto' : function() {
	  		var url = 'mailto:?subject=' + encodeURIComponent(root.options.title) + '&body=Thought you might enjoy reading this: ' + encodeURIComponent(root.options.url) + ' - ' + encodeURIComponent(root.options.description);

	  		window.location.href = url;
	  	},
	  	'twitter' : function() {
	  		var url = root.options.protocol + 'twitter.com/home?status=';
	  		url += encodeURIComponent(root.options.title) + encodeURIComponent(root.options.url);

        root.popup(url);
	  	},
	  	'pinterest' : function() {
	  		var url = root.options.protocol + 'pinterest.com/pin/create/bookmarklet/?is_video=false';
	  		url += '&media=' + encodeURIComponent(root.options.image);
	  		url += '&url=' + encodeURIComponent(root.options.url);
	  		url += '&description=' + encodeURIComponent(root.options.title);

        root.popup(url);
	  	},
	  	'facebook' : function() {
	  		var url = root.options.protocol + 'www.facebook.com/share.php?';
	  		url += 'u=' + encodeURIComponent(root.options.url);
	  		url += '&title=' + encodeURIComponent(root.options.title);

        root.popup(url);
	  	},
	  	'googleplus' : function() {
	  		var url = root.options.protocol + 'plus.google.com/share?';
	  		url += 'url=' + encodeURIComponent(root.options.url);

        root.popup(url);
	  	},
	  	'reddit' : function() {
	  		var url = root.options.protocol + 'www.reddit.com/submit?';
	  		url += 'url=' + encodeURIComponent(root.options.url);
	  		url += '&title=' + encodeURIComponent(root.options.title);

        root.popup(url);
	  	},
	  	'delicious' : function() {
	  		var url = root.options.protocol + 'del.icio.us/post?';
	  		url += 'url=' + encodeURIComponent(root.options.url);
	  		url += '&title=' + encodeURIComponent(root.options.title);
	  		url += '&notes=' + encodeURIComponent(root.options.description);

        root.popup(url);
	  	},
	  	'tapiture' : function() {
	  		var url = root.options.protocol + 'tapiture.com/bookmarklet/image?';
	  		url += 'img_src=' + encodeURIComponent(root.options.image);
	  		url += '&page_url=' + encodeURIComponent(root.options.url);
	  		url += '&page_title=' + encodeURIComponent(root.options.title);

        root.popup(url);
	  	},
	  	'stumbleupon' : function() {
	  		var url = root.options.protocol + 'www.stumbleupon.com/submit?';
	  		url += 'url=' + encodeURIComponent(root.options.url);
	  		url += '&title=' + encodeURIComponent(root.options.title);

        root.popup(url);
	  	},
	  	'linkedin' : function() {
	  		var url = root.options.protocol + 'www.linkedin.com/shareArticle?mini=true';
	  		url += '&url=' + encodeURIComponent(root.options.url);
	  		url += '&title=' + encodeURIComponent(root.options.title);
	  		url += '&source=' + encodeURIComponent(root.options.source);

        root.popup(url);
	  	},
	  	'slashdot' : function() {
	  		var url = root.options.protocol + 'slashdot.org/bookmark.pl?';
	  		url += 'url=' + encodeURIComponent(root.options.url);
	  		url += '&title=' + encodeURIComponent(root.options.title);

        root.popup(url);
	  	},
	  	'technorati' : function() {
	  		var url = root.options.protocol + 'technorati.com/faves?';
	  		url += 'add=' + encodeURIComponent(root.options.url);
	  		url += '&title=' + encodeURIComponent(root.options.title);

        root.popup(url);
	  	},
	  	'posterous' : function() {
	  		var url = root.options.protocol + 'posterous.com/share?';
	  		url += 'linkto=' + encodeURIComponent(root.options.url);

        root.popup(url);
	  	},
	  	'tumblr' : function() {
	  		var url = root.options.protocol + 'www.tumblr.com/share?v=3';
	  		url += '&u=' + encodeURIComponent(root.options.url);
	  		url += '&t=' + encodeURIComponent(root.options.title);

        root.popup(url);
	  	},
	  	'googlebookmarks' : function() {
	  		var url = root.options.protocol + 'www.google.com/bookmarks/mark?op=edit';
	  		url += '&bkmk=' + encodeURIComponent(root.options.url);
	  		url += '&title=' + encodeURIComponent(root.options.title);
	  		url += '&annotation=' + encodeURIComponent(root.options.description);

        root.popup(url);
	  	},
	  	'newsvine' : function() {
	  		var url = root.options.protocol + 'www.newsvine.com/_tools/seed&save?';
	  		url += 'u=' + encodeURIComponent(root.options.url);
	  		url += '&h=' + encodeURIComponent(root.options.title);

        root.popup(url);
	  	},
	  	'pingfm' : function() {
	  		var url = root.options.protocol + 'ping.fm/ref/?';
	  		url += 'link=' + encodeURIComponent(root.options.url);
	  		url += '&title=' + encodeURIComponent(root.options.title);
	  		url += '&body=' + encodeURIComponent(root.options.description);

        root.popup(url);
	  	},
	  	'evernote' : function() {
	  		var url = root.options.protocol + 'www.evernote.com/clip.action?';
	  		url += 'url=' + encodeURIComponent(root.options.url);
	  		url += '&title=' + encodeURIComponent(root.options.title);

        root.popup(url);
	  	},
	  	'friendfeed' : function() {
	  		var url = root.options.protocol + 'www.friendfeed.com/share?';
	  		url += 'url=' + encodeURIComponent(root.options.url);
	  		url += '&title=' + encodeURIComponent(root.options.title);

        root.popup(url);
	  	},
	  	'vkontakte' : function() {
	  		var url = root.options.protocol + 'vkontakte.ru/share.php?';
	  		url += 'url=' + encodeURIComponent(root.options.url);
        url += '&title=' + encodeURIComponent(root.options.title);
        url += '&description=' + encodeURIComponent(root.options.description);
        url += '&image=' + encodeURIComponent(root.options.image);
        url += '&noparse=true';

        root.popup(url);
	  	},
	  	'odnoklassniki' : function() {
	  		var url = root.options.protocol + 'www.odnoklassniki.ru/dk?st.cmd=addShare&st.s=1';
        url += '&st.comments=' + encodeURIComponent(root.options.description);
        url += '&st._surl=' + encodeURIComponent(root.options.url);

        root.popup(url);
	  	},
	  	'mailru' : function() {
	  		var url = root.options.protocol + 'connect.mail.ru/share?';
        url += 'url=' + encodeURIComponent(root.options.url);
        url += '&title=' + encodeURIComponent(root.options.title);
        url += '&description=' + encodeURIComponent(root.options.description);
        url += '&imageurl=' + encodeURIComponent(root.options.image);

        root.popup(url);
	  	}

	  }

	  // open share link in a popup
	  root.popup = function(url) {
	  	// set left and top position
	  	var popupWidth = 600,
	  			popupHeight = 500,
	  			// fix dual screen mode
	  			dualScreenLeft = window.screenLeft != undefined ? window.screenLeft : screen.left,
	  		  dualScreenTop = window.screenTop != undefined ? window.screenTop : screen.top,
	  		  width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width,
	  		  height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height,
	  		  // calculate top and left position
	  		  left = ((width / 2) - (popupWidth / 2)) + dualScreenLeft,
	  		  top = ((height / 2) - (popupHeight / 2)) + dualScreenTop,

			// show popup
			shareWindow = window.open(url,'targetWindow','toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=' + popupWidth + ', height=' + popupHeight + ', top=' + top + ', left=' + left);

	  	// Puts focus on the newWindow
	    if (window.focus) {
	        shareWindow.focus();
	    }
	  }

	  // find closest
	  function closest(elem, parent) {
	  	if (typeof(parent) == 'string') {
				var matchesSelector = elem.matches || elem.webkitMatchesSelector || elem.mozMatchesSelector || elem.msMatchesSelector;

				if (!!matchesSelector) {
					while (elem) {
				    if (matchesSelector.bind(elem)(parent)) {
				      return elem;
				    } else {
				      elem = elem.parentElement;
				    }
					}
				}
				return false;
			} else {
				while (elem) {
			    if (elem == parent) {
			        return elem;
			    } else {
			      elem = elem.parentElement;
			    }
				}
				return false;
			}
		}

		/* Set options
		***********************************************/

		// create default options
		root.options = {
			iconStyle: 'default', // default or box
			boxForm: 'horizontal', // horizontal or vertical
			position: 'bottomCenter', // top / middle / bottom + Left / Center / Right
			protocol: ['http', 'https'].indexOf(window.location.href.split(':')[0]) === -1 ? 'https://' : '//',
			url: window.location.href,
			title: root.getTitle(),
			image: root.getImage(),
			description: root.getDescription(),
			networks: 'Weibo,Wechat,Twitter,Pinterest,Facebook,GooglePlus,Reddit,Linkedin,Tumblr,Evernote'
		}

    // integrate custom options
    for (var i in options) {
      root.options[i] = options[i];
    }

    // integrate data attribute options
    for (var option in root.elem.dataset) {
    	// replace only 'share-' prefixed data-attributes
      if (option.match(/share/)) {
        var new_option = option.replace(/share/, '');
        if (!new_option.length) {
            continue;
        }
        new_option = new_option.charAt(0).toLowerCase() + new_option.slice(1);
        root.options[new_option] = root.elem.dataset[option];
      }
    }

    // convert networks string into array
    root.options.networks = root.options.networks.toLowerCase().split(',');

	// show and hide dropdown
    root.elem.addEventListener('click', function(event) {
    	event.preventDefault();
    	if (!root.elem.classList.contains('need-share-button-opened')) {
    		root.elem.classList.add('need-share-button-opened');
    	} else {
    		// hide wechat code image when close the dropdown.
    		var wechatImg = root.dropdown.getElementsByClassName('need-share-wechat-code-image')[0];
    		if (wechatImg) wechatImg.remove();
    		root.elem.classList.remove('need-share-button-opened');
    	}
    });

		// create dropdown
		root.dropdown = document.createElement('span');
		root.dropdown.className = 'need-share-button_dropdown';
		root.elem.appendChild(root.dropdown);

		// set dropdown row length
		if (root.options.iconStyle == 'box' && root.options.boxForm == 'horizontal')
			root.dropdown.className += ' need-share-button_dropdown-box-horizontal';
		else if (root.options.iconStyle == 'box' && root.options.boxForm == 'vertical')
			root.dropdown.className += ' need-share-button_dropdown-box-vertical';

		// set dropdown position
		setTimeout(function() {
			switch (root.options.position) {
	   		case 'topLeft':
		      root.dropdown.className += ' need-share-button_dropdown-top-left';
		      break
	   		case 'topRight':
		      root.dropdown.className += ' need-share-button_dropdown-top-right';
		      break
	   		case 'topCenter':
		      root.dropdown.className += ' need-share-button_dropdown-top-center';
		      root.dropdown.style.marginLeft = - root.dropdown.offsetWidth / 2 + 'px';
		      break
	   		case 'middleLeft':
		      root.dropdown.className += ' need-share-button_dropdown-middle-left';
		      root.dropdown.style.marginTop = - root.dropdown.offsetHeight / 2 + 'px';
		      break
	   		case 'middleRight':
		      root.dropdown.className += ' need-share-button_dropdown-middle-right';
		      root.dropdown.style.marginTop = - root.dropdown.offsetHeight / 2 + 'px';
		      break
	   		case 'bottomLeft':
		      root.dropdown.className += ' need-share-button_dropdown-bottom-left';
		      break
	   		case 'bottomRight':
		      root.dropdown.className += ' need-share-button_dropdown-bottom-right';
		      break
	   		case 'bottomCenter':
		      root.dropdown.className += ' need-share-button_dropdown-bottom-center';
		      root.dropdown.style.marginLeft = - root.dropdown.offsetWidth / 2 + 'px';
		      break
	   		default:
		      root.dropdown.className += ' need-share-button_dropdown-bottom-center';
		      root.dropdown.style.marginLeft = - root.dropdown.offsetWidth / 2 + 'px';
		      break
			}
		},1);


		// fill fropdown with buttons
		var iconClass = root.options.iconStyle == 'default' ? 'need-share-button_link need-share-button_' : 'need-share-button_link-' + root.options.iconStyle + ' need-share-button_link need-share-button_';
		for (var network in root.options.networks) {
			var link = document.createElement('span');
			    network = root.options.networks[network];
			link.className = iconClass + network;
			link.className += ' icon-' + network;
			link.dataset.network = network;
			link.title = network;
			root.dropdown.appendChild(link);

			// add share function to event listener
      link.addEventListener('click', function() {
      	event.preventDefault();
      	event.stopPropagation();
      	root.share[this.dataset.network]();
      	return false;
      });
    }

    // close on click outside
    document.addEventListener('click', function(event) {
      if (!closest(event.target, root.elem)) {
		    // hide wechat code image when close the dropdown.
		    var wechatImg = root.dropdown.getElementsByClassName('need-share-wechat-code-image')[0];
		    if (wechatImg) wechatImg.remove();
		    root.elem.classList.remove('need-share-button-opened');
	  }
    });

  }

})();
