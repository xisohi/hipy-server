var rule = {
    类型: '影视',//影视|听书|漫画|小说
    title: 'PTT[优]',
    host: 'https://ptt.red',
    homeUrl: '/zh-cn',
    url: '/zh-cn/p/fyclassfyfilter',
    searchUrl: '/zh-cn/q/**?page=fypage',
    searchable: 2,
    quickSearch: 0,
    filterable: 1,
    filter: 'H4sIAAAAAAAAAO2W30sbQRDH/5d96FPA3M9chPwlReRo76HUWoi2IBJIiNGQWI0ppkgP+2BrRBu8qISYmP412d3cf9Fbm2RmNx4Ixafk6dj5zDKzM9/Z222ikeXX2+S9t0WWCfUDut8jCbLufvDw+rO79sl7dFwX5tJFWLwQ5mhBcomx9WczPOmOra/crOeuvnub0ac8PD9h3WuVW7D/MOCFM5WbsP/HV+pXVa6lpg7s2y/m/55xcMChVeN/DlQHG/ht8FSEJKT4JaC98xkHyJGWOsN+Q3UwSG5FePwrMm/36WkVijxdP6vI+Ste2x1bl94sGQag6vFw4ANClW34tLIHBJ145zsrloBAMXnziN73gaAqFmos3wCShj2Vaz64BIIqx8oBL7cQ0nDe7OEKIZBMlLWUngan5Xf5cH8HFQLF2uvyxhFCJo7Fj1Esw3q6dREy4cSj5tnoEp3L0KWG0vu7YX+Apmayfk5D9aRuTvSy5bnZzKMBUUOlBqa6SnVMNZVqmCZVmkRUSytUS2PqqNTBNKXSFKa2Sm1MLZVamKq1ErOHWsEO6rR3CK2YruVW8N02q7fUVjA/zxrBJMDGx+xmZs3d2BQBVhJEf5F7Uog65goUQwc1l25PgdBA4ntPDCT0UbozBQIBSJehSMOJHQXRoIXe50zvxovpPV7UqCMzo6DF6t0xYvXu6LF6R8qR/vtiSvTYUdCNxSjM3SiY0e7oY+GR+K9X3Khzy2tF9FSDtvN2UUZQg7BQYeUbhKAtrH4q7bLRQ6lzI6OY16rQ/ULc8ydu2xbqzv0FneouCwkOAAA=4',
    filter_url: '{% if fyclass !=1 %}{{fl.地区}}?page=fypage{% else %}{{fl.类型}}?page=fypage{{fl.地区}}{% endif %}{{fl.年份}}{{fl.排序}}',
    filter_def: {},
    headers: {
        'User-Agent': 'MOBILE_UA',
    },
    timeout: 5000,
    class_parse: '.nav-tabs&&a;a&&Text;a&&href;(\\d+)',
    cate_exclude: '',
    play_parse: true,
    lazy: $js.toString(() => {
        let html = request(input);
        let sdata = pdfh(html, '.container-fluid&&script&&Html');
        // log(sdata);
        let json = JSON.parse(sdata);
        if (json.contentUrl) {
            input = {parse: 0, url: json.contentUrl, js: ''};
        }
    }),
    double: false,
    推荐: '*',
    一级: '#videos&&.card;a:eq(-1)&&Text;img&&src;.badge-success&&Text;a:eq(-1)&&href',
    二级: $js.toString(() => {
        let html = request(input);
        let data = html.split('node:')[1].split('},')[0] + '}';
        data = data.trim();
        //   log(data);
        let json = JSON.parse(data);
        //   log(json);
        VOD = {};

        VOD.vod_name = json.title;
        VOD.type_name = json.type;
        VOD.vod_id = input;
        VOD.vod_pic = urljoin(input, json.thumbnail);
        VOD.vod_year = json.year;
        VOD.vod_area = json._area;
        VOD.vod_remarks = json.note;
        VOD.vod_content = json.description;
        VOD.vod_director = json.director;
        VOD.vod_actor = json.actors;
        let v_tabs = pdfa(html, '.nav-tabs&&li');
        let v_tab_urls = v_tabs.map(it => pd(it, 'a&&href', input));
        v_tabs = v_tabs.map(it => pdfh(it, 'a&&title'));
        // log(v_tab_urls);
        VOD.vod_play_from = v_tabs.join('$$$');
        let lists = [];
        let list1 = pdfa(html, '.mb-2.fullwidth&&a').map(it => pdfh(it, 'a&&Text') + '$' + pd(it, 'a&&href', input));
        // log(list1);
        lists.push(list1);
        let reqUrls = v_tab_urls.slice(1).map(it => {
            return {
                url: it,
                options: {
                    timeout: 5000,
                    headers: rule.headers
                }
            }
        });
        let htmls = batchFetch(reqUrls);
        htmls.forEach((ht) => {
            if (ht) {
                let list0 = pdfa(ht, '.mb-2.fullwidth&&a').map(it => pdfh(it, 'a&&Text') + '$' + pd(it, 'a&&href', input));
                lists.push(list0);
            } else {
                lists.push([]);
            }
        });
        let playUrls = lists.map(it => it.join('#'));
        VOD.vod_play_url = playUrls.join('$$$');
    }),
    搜索: '*',
}