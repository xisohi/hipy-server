var rule = {
    类型: '影视',
    title: '星芽短剧app',
    host: 'https://app.whjzjx.cn',
    url: '/cloud/v2/theaterfyfilter',
    filter_url:'/home_page?theater_class_id=fyclass&type=1&{{fl.type or "class2_ids=0"}}&page_num=fypage&page_size=24',
    searchUrl: '/v3/search',
    searchable: 2,
    quickSearch: 1,
    filterable: 1,       
    filter:'H4sIAAAAAAAAA6vmUgACJUMlK4VoMBMEquEssGR2aiVQWqmksiBVSQdVKi8xNxUk93zj7qfzutFlyxJzSlNRTMZuA8I4kFlPW1e8bF6BZhbCTJCS5JzE4mKj+MyUYlsDJQx1tZha8dn3snnv0x1NxNpnQrF9T/uXvFjcSqx9phTb97xvw5Pdi1+saHjWTLSthpRb+6xjxvOl84i10IjycH3Z0PZi0VpiLTSnPFxX7n+xrYvoEKXcwqd9bU/7NxGdUCnPGS+2zni6cj/RUWhGeZAunfe0ZzfRFlKeSF+29z6fMp9YC6ngwSlznq5bQKx9xsbUKGxIzvzGVMgbfS1PdxIdkcaUR+SLCT1P180l1kJLyu1rmfhsC9Glm7ERxRY+2bWJhCg0MaTchzMnPGtEr9JxWmiBxT4UkVguVPFYrloA8HqNcnwIAAA=',        
    headers: {
        "X-App-Id": "7",
        "Authorization": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MjYxMTU0MjYsIlVzZXJJZCI6NDY4OTQxMDIsInJlZ2lzdGVyX3RpbWUiOiIyMDI0LTA1LTI2IDE5OjI5OjM1IiwiaXNfbW9iaWxlX2JpbmQiOmZhbHNlfQ.gKsXwSguQ3btmTNRB-cVw5UlLkKnA-cZ_nddnE9ks30",
        "platform": "1",
        "manufacturer": "Xiaomi",
        "version_name": "3.2.0.1",
        "user_agent": "Mozilla/5.0 (Linux; Android 11; M2012K10C Build/RP1A.200720.011; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/87.0.4280.141 Mobile Safari/537.36",
        "dev_token": "BY1wFZd4K0vDqzVMbtHXNmlQ29ovO5peS5MsZ7VX1rQUXDwAqskxkJtiPMZCEj6MaW-40xNnbvn12F68nLEAMkRoD7tpoieO4nkUE-GLOYxqCs0xmxWgXAh0-7NmmGCHi95SlyZlpHeit94JfJPkpo-hl4JFru2wUI-4P0AwDc5Y*",
        "app_version": "3.2.0.1",
        "device_platform": "android",
        "personalized_recommend_status": "1",
        "device_type": "M2012K10C",
        "device_brand": "Redmi",
        "os_version": "11",
        "channel": "default",
        "raw_channel": "default",
        "oaid": "9494817a02a93435",
        "msa_oaid": "9494817a02a93435",
        "uuid": "randomUUID_f87c01c7-3d61-4feb-ade0-3d6d45d24dfd",
        "device_id": "23b07cf840c8b3eeca8c01fc56f0f0a09",
        "support_h265": "1",
        "Host": "app.whjzjx.cn",
        "Connection": "Keep-Alive",
        "Accept-Encoding": "gzip",
        "User-Agent": "okhttp/4.10.0"
    },
    timeout: 5000,
    class_name: '剧场&热播剧&会员专享&星选好剧&新剧&阳光剧场',
    class_url: '1&2&8&7&3&5',
    play_parse: true,
    lazy: $js.toString(() => {
        input = {
            url: input,
            parse: 0
        }
    }),
    double: true,
    一级: $js.toString(() => {
        let d = [];                
        if (!input.includes('theater_class_id=1')) {    
            input = input.replace('class2_ids=0&', '');
        };       
        let html = request(input);
        let data = JSON.parse(html).data.list;
        data.forEach(it => {
            let id = 'https://app.whjzjx.cn/v2/theater_parent/detail?theater_parent_id=' + it.theater.id;
            d.push({
                url: id,
                title: it.theater.title,
                img: it.theater.cover_url,                                
                desc: it.theater.theme,
                year:it.theater.total+'集',
            })
        })
        setResult(d)
    }),
    二级: $js.toString(() => {
        let urls = [];
        let html = request(input);
        let data = JSON.parse(html).data;
        data.theaters.forEach(it => {
            urls.push('第'+it.num+'集' + '$' + it.son_video_url)
        })
        VOD = {
            vod_name: data.title,
            vod_pic: data.cover_url,
            vod_play_from: 'XT短剧',
            vod_play_url: urls.join('#')
        }
    }),
    搜索: $js.toString(() => {
        let html = post(input, {
            body: {
                "text": KEY
            }
        })
        let list = JSON.parse(html).data.theater.search_data;
        list.forEach(it => {
            let id = 'https://app.whjzjx.cn/v2/theater_parent/detail?theater_parent_id=' + it.id;
            d.push({
                url: id,
                title: it.title,
                img: it.cover_url,
                content: it.introduction,
            })
        })
        setResult(d)
    }),
}