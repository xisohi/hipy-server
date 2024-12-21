var rule = {
  title: '金金虫',
  模板: '自动',
  host: 'https://y.mjing.vip',//https://www.jinjinchong.com
  url:'/vod/list/fypage/fyclass/0/0.html',//网站的分类页面链接
  searchUrl:'/vodsearch/**----------fypage---.html',
  cate_exclude:'福利',
  class_parse: '.top_nav li;a&&Text;a&&href;/vod/\\d+/(\\d+)*',
  推荐: '.cbox_list:gt(-1):lt(4);*;*;*;*;*',
  一级: 'ul.vodlist li;a&&title;.vodlist_thumb&&data-original;.pic_text&&Text;a&&href',
  二级: {
  title: '.vodlist_thumb&&title;.data a:eq(2)&&Text',
  img: '.vodlist_thumb&&style',
  desc: '.data:eq(1) .data_style&&Text;.data:eq(0) a:eq(0)&&Text;.data:eq(0) a:eq(1)&&Text;.data:eq(2)&&Text;.data:eq(3)&&Text',
  content: '.content_desc&&span&&Text',
  tabs: '.play_source_tab&&a',
  lists: '.content_playlist:eq(#id) li',
    },
}