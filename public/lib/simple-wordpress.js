(function() {
    "use strict";

    function loadScript(url, callback){
        var script = document.createElement("script")
        script.type = "text/javascript";

        if (script.readyState && callback){  //IE
            script.onreadystatechange = function(){
                if (script.readyState == "loaded" ||
                        script.readyState == "complete"){
                    script.onreadystatechange = null;
                    callback();
                }
            };
        } else if (callback) {  //Others
            script.onload = function(){
                callback();
            };
        }

        script.src = url;
        document.getElementsByTagName("head")[0].appendChild(script);
    }

    function loadCSS(url) {
        var stylesheet = document.createElement("link");
        stylesheet.setAttribute("rel", "stylesheet");
        stylesheet.setAttribute("type", "text/css");
        stylesheet.setAttribute("href", url);
        document.getElementsByTagName("head")[0].appendChild(stylesheet);
    }

    var nbb = {tags: []};
    var scriptDiv = document.getElementById('nodebb-comments-script');
    nbb.url = scriptDiv.getAttribute('ourl');
    nbb.cid = scriptDiv.getAttribute('ocid');
    nbb.blogger = scriptDiv.getAttribute('blogger');

    // get tags and content;
    var metaEl = document.getElementsByTagName('meta');
    for (var i = 0; i < metaEl.length; i++) {
        if (metaEl[i].getAttribute('property') === 'article:tag') {
            nbb.tags.push(metaEl[i].getAttribute('content'));
        }
        if (metaEl[i].getAttribute('property') === 'og:description') {
            nbb.articleContent = metaEl[i].getAttribute('content');
        }
        if (metaEl[i].getAttribute('property') === 'og:title') {
            nbb.articleTitle = metaEl[i].getAttribute('content').split(' | ')[0];
        }
    }

    // get article's title in url.
    nbb.articleID = btoa(location.pathname);

    if (!nbb.url || !nbb.cid || !nbb.articleID || !nbb.blogger || !nbb.articleContent) {
        console.warn('[nodebb-plugin-blog-comments2] information is imcomplete.', nbb);
        return;
    } else {
        console.log('[nodebb-plugin-blog-comments2] information: ', nbb);
    }

    loadCSS(nbb.url + '/plugins/nodebb-plugin-blog-comments2/css/comments2.css');
    // fix youtube embed video
    loadScript(nbb.url + '/plugins/nodebb-plugin-youtube-embed/static/lib/lazyYT.js');
    loadCSS(nbb.url + '/plugins/nodebb-plugin-blog-comments2/css/youtube-embed-video.css');

    var commentPositionDiv = document.getElementById('nodebb-comments');
    if (!commentPositionDiv) {
        commentPositionDiv = document.createElement('div');
        commentPositionDiv.setAttribute('id', 'nodebb-comments');

        var commentsEl = document.getElementById('comments');
        if (!commentsEl) {
            console.error('Couldnot find the comments element');
            return;
        }
        commentsEl.insertBefore(commentPositionDiv, document.getElementById('respond'));
    }

    loadScript(nbb.url + '/plugins/nodebb-plugin-blog-comments2/lib/common.js', function () {
        blogComments2Common(commentPositionDiv, nbb);
    });


}());
