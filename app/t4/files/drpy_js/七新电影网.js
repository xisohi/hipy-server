Object.assign(muban.首图2.二级, {
    tabs: '.stui-pannel_hd h3',
});
var rule = {
    title: '七新电影网',
    模板: '首图2',
    host: 'http://www.7xdy.com',
    url: '/fyclass/indexfypage.html[/fyclass/index.html]',
    tab_exclude: '本周热门|最近更新',
    lazy: $js.toString(() => {
        let init_js = `Object.defineProperties(navigator, {platform: {get: () => 'iPhone'}});`;
        input = {
            parse: 1,
            url: input,
            js: '',
            parse_extra: '&init_script=' + encodeURIComponent(base64Encode(init_js)),
        }
    }),
    // searchUrl:'/search.php?page=fypage&searchword=**&searchtype=',
    searchUrl: '/search.php#searchword=**;post',
    class_parse: '.stui-tou__menu li:gt(0):lt(7);a&&Text;a&&href;.*/(.*?)/.*html',
}