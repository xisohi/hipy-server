var rule = {
    模板: '自动',
    title: "电影狗",
    host: "https://www.dydog.vip",
    url: "/vodtype/fyclass-fypage/",
    searchUrl: "/vodsearch/**----------fypage---/",
    searchable: 2,
    quickSearch: 0,
    headers: {
        "User-Agent": "PC_UA"
    },
    timeout: 5000,
    class_parse: ".hl-nav&&li:lt(6);a&&Text;a&&href;.*/(.*?)/",
}