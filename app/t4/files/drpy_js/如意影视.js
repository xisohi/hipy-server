var rule = {
    模板: '自动',
    host: 'http://r5y.net',
    url: '/vodshow/fyclass--------fypage---/',
    searchUrl: '/vodsearch/**----------fypage---/',
    class_parse: '.grid-items&&li;a&&Text;a&&href;/.*/(\\d+)',
    cate_exclude:'全部影片',
    搜索: '.module-items .module-search-item;h3 a&&title;img&&data-src;.video-serial&&Text;a&&href',
}