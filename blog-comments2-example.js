var script = document.createElement('script');
    script.setAttribute('type', 'text/javascript');
    script.setAttribute('src', 'https://v2mm.tech/plugins/nodebb-plugin-blog-comments2/lib/simple-hexo.js');
    script.setAttribute('id', 'nodebb-comments-script');
    script.setAttribute('async', 'true');
    script.setAttribute('ourl', 'https://v2mm.tech');
    script.setAttribute('ocid', '42');
    script.setAttribute('blogger', 'cyang');
var head = document.getElementsByTagName('head').item(0);
head.appendChild(script);


var script = document.createElement('script');
    script.setAttribute('type', 'text/javascript');
    script.setAttribute('src', 'http://localhost:4567/plugins/nodebb-plugin-blog-comments2/lib/simple-typecho.js');
    script.setAttribute('id', 'nodebb-comments-script');
    script.setAttribute('async', 'true');
    script.setAttribute('ourl', 'http://localhost:4567');
    script.setAttribute('ocid', '42');
    script.setAttribute('blogger', 'cyang');
var head = document.getElementsByTagName('head').item(0);
head.appendChild(script);
