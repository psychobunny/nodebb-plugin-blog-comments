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

    var nbb = {};
    var scriptDiv = document.getElementById('nodebb-comments-script');
    var articleEl = document.getElementById('post');
    nbb.url = scriptDiv.getAttribute('ourl');
    nbb.cid = scriptDiv.getAttribute('ocid');
    nbb.blogger = scriptDiv.getAttribute('blogger');

    if (!articleEl) {
        console.warn("It's not the article page");
        return;
    }

    // get article's title in url.
    var articleUTitle = window.location.pathname.split('/').slice(-1)[0];
    //remove .html ext
    if (articleUTitle) {
        nbb.articleID = articleUTitle.replace('.html', '').replace('.htm', '');
    }

    // get title and content from the article
    var articleTitleEl = articleEl.getElementsByClassName('post-title')[0];
    nbb.articleTitle = articleTitleEl ? articleTitleEl.innerText : '';
    var articleContent = [];
    var pagraphs = articleEl.getElementsByTagName('p');
    for (var j = 0; j < pagraphs.length; j++) {
        // only get the first and second paragraph.
        if (j ===0 || j===1){
            articleContent.push(pagraphs[j].innerText);
        }
    }
    nbb.articleContent = articleContent.join('\n\n');

    if (!nbb.url || !nbb.cid || !nbb.articleID || !nbb.blogger || !nbb.articleContent) {
        console.warn('[nodebb-plugin-blog-comments2] information is imcomplete.', nbb);
        return;
    } else {
        console.log('[nodebb-plugin-blog-comments2] information: ', nbb);
    }

    loadCSS(nbb.url + '/plugins/nodebb-plugin-blog-comments2/css/comments2.css');

    // pelican blog don't has jQuery, can't fix youtube embed video right now.

    var commentPositionDiv = document.getElementById('nodebb-comments');
    if (!commentPositionDiv) {
        commentPositionDiv = document.createElement('div');
        commentPositionDiv.setAttribute('id', 'nodebb-comments');
        var respondEl = document.getElementById("respond");
        if (!respondEl) {
            console.log('Couldnot find the respond section!');
            return;
        }
        var otherCommentSystem = respondEl.getElementsByClassName('comments');
        respondEl.insertBefore(commentPositionDiv, otherCommentSystem ? otherCommentSystem[0] : null);
    }

    loadScript(nbb.url + '/plugins/nodebb-plugin-blog-comments2/lib/common.js', function () {
        blogComments2Common(commentPositionDiv, nbb);
    });

}());
