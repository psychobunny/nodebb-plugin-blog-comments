var script = document.createElement('script');
    script.setAttribute('type', 'text/javascript');
    script.setAttribute('src', 'https://v2mm.tech/plugins/nodebb-plugin-blog-comments2/lib/simple-typecho.js');
    script.setAttribute('id', 'nodebb-comments-script');
    script.setAttribute('async', 'true');
    script.setAttribute('ourl', 'https://v2mm.tech');
    script.setAttribute('ocid', '42');
    script.setAttribute('blogger', 'qqqq');
var head = document.getElementsByTagName('head').item(0);
head.appendChild(script);


var script = document.createElement('script');
    script.setAttribute('type', 'text/javascript');
    script.setAttribute('src', 'http://localhost:4567/plugins/nodebb-plugin-blog-comments2/lib/simple-typecho.js');
    script.setAttribute('id', 'nodebb-comments-script');
    script.setAttribute('async', 'true');
    script.setAttribute('ourl', 'http://localhost:4567');
    script.setAttribute('ocid', '42');
    script.setAttribute('blogger', 'qqqq');
var head = document.getElementsByTagName('head').item(0);
head.appendChild(script);


/*
<script id='nodebb-comments-script' async="true", ourl="https://v2mm.tech" ocid="64" blogger='qqqq' src="https://v2mm.tech/plugins/nodebb-plugin-blog-comments2/lib/simple-typecho.js"></script>

把这行代码放在你的博客的文章页面之下， head 或者 body 下都行。设置了 async，不用担心影响页面加载 ;)

代码是开源的，在 https://github.com/revir/nodebb-plugin-blog-comments2

集成进来后你应该在每篇文章的底部看到一个叫“publish to v2mm" 的按钮，点击会发布到 v2mm, 这样 v2mm 的评论系统才会加载。否则用户会看到 "v2mm commenting is disabled."

请给你的专栏想个名字，描述，以及给我一张图片(png, 最好128*128以上吧).  就像 Kat 的那样： https://v2mm.tech/category/48/kt
让专栏更美观一些，是吧？


*/
