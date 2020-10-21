var FASHIONADE = (function ($w) {
    var $ = function (query) {
        return document.querySelector(query)
    }
    var $$ = function (query) {
        return document.querySelectorAll(query)
    }
    var get = function (url, cb) {
        var xmlhttp
        xmlhttp = new XMLHttpRequest()
        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                cb(eval(xmlhttp.responseText))
            }
        }
        xmlhttp.open('GET', url, true)
        xmlhttp.send()
    };
    var post = function (url, obj) {
        var xmlhttp;
        xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                console.log('succeed', request.responseText);
            }
        }
        xmlhttp.open('POST', url, true);
        xmlhttp.setRequestHeader('Content-Type', 'application/json');
        xmlhttp.send(JSON.stringify(obj));
    };
    var strTitle = function (titles, type) {
        for (var innerHTML = '', i = 0, l = titles.length; i < l; ++i) {
            innerHTML += '<li class="' + (i === 0 ? 'on' : '') + '" onClick="' + (function(i, type) {
                return (type === 'overlay')
                    ? 'FASHIONADE.RECOMMEND_LAYER_CURRENT(' + (i + 1) + ')'
                    : 'FASHIONADE.RECOMMEND_CURRENT(' + (i + 1) + ')'
            })(i, type) + '">' + titles[i].name + '</li>'
        }
        return '<ul class="fashionade--recommendTitleList">' + innerHTML + '</ul>'
    };
    var strContent = function (contents, type) {
        for (var innerHTML = '', i = 0, l = contents.length; i < l; ++i) {
            innerHTML += '<li>' + (type === 'overlay' ? strmainImage(contents[i].images) : '') + strItems(contents[i].items) + '</li>'
        }
        return '<ul class="fashionade--recommendContentList">' + innerHTML + '</ul>'
    }
    var strmainImage = function (images) {
        return (
            '<div class="fashionade--mainImageWrap"> \
                <div class="fashionade--mainImage"><img src="' +
            images[0] +
            '" width="280" height="424" alt="" /></div> \
                </div>'
        )
    };
    var strItems = function (items) {
        for (var innerHTML = '', i = 0, l = 3; i < l; ++i) {
            innerHTML +=
                '<li class="fashionade--item"> \
                <div class="fashionade--thumb" style="background-image:url(\'' +
                items[i].imageUrl +
                '\')"><a href="' + items[i].detailUrl + '" target="_blank" onclick="FASHIONADE.LOGS(\'click\')">' + items[i].name + '</a></div> \
        <div class="fashionade--content"> \
          <dl> \
        <dt class="fashionade--brand"><a href="' + items[i].detailUrl + '" target="_blank" onclick="FASHIONADE.LOGS(\'click\')">' + items[i].brand + '</a></dt> \
        <dd class="fashionade--name"><a href="' + items[i].detailUrl + '" target="_blank" onclick="FASHIONADE.LOGS(\'click\')">' + items[i].name + '</a></dd> \
          </dl> \
        </div> \
      </li>'
        }
        return '<div class="fashionade--itemList"><ul>' + innerHTML + '</ul></div>'
    };

    var RECOMMEND = {
        INDEX: 1,
        LAYER_INDEX: 1,
        DATA: null,
        direct: function (dir) {
            RECOMMEND.show((RECOMMEND.INDEX += dir))
        },
        current: function (idx) {
            RECOMMEND.show((RECOMMEND.INDEX = idx))
        },
        show: function (idx) {
            var titles = $$('.fashionade--renderWrap .fashionade--recommendTitleList > li'),
                contents = $$('.fashionade--renderWrap .fashionade--recommendContentList > li')
            if (idx > contents.length) {
                RECOMMEND.INDEX = 1
            }
            if (idx < 1) {
                RECOMMEND.INDEX = contents.length
            }
            for (var i = 0, l = contents.length; i < l; ++i) {
                contents[i].style.display = 'none'
                titles[i].className = ''
            }
            contents[RECOMMEND.INDEX - 1].style.display = 'block'
            titles[RECOMMEND.INDEX - 1].className = 'on'
        },
        layer_direct: function (dir) {
            RECOMMEND.layer_show((RECOMMEND.LAYER_INDEX += dir))
        },
        layer_current: function (idx) {
            RECOMMEND.layer_show((RECOMMEND.LAYER_INDEX = idx))
        },
        layer_show: function (idx) {
            var titles = $$('.fashionade--layerWrap .fashionade--recommendTitleList > li'),
                contents = $$('.fashionade--layerWrap .fashionade--recommendContentList > li')
            if (idx > contents.length) {
                RECOMMEND.LAYER_INDEX = 1
            }
            if (idx < 1) {
                RECOMMEND.LAYER_INDEX = contents.length
            }
            for (var i = 0, l = contents.length; i < l; ++i) {
                contents[i].style.display = 'none'
                titles[i].className = ''
            }
            contents[RECOMMEND.LAYER_INDEX - 1].style.display = 'block'
            titles[RECOMMEND.LAYER_INDEX - 1].className = 'on'
        },
        layer_remove: function () {
            $('[data-fashionade-render-recommend-type="overlay"]').innerHTML = ''
        },
        showMainImage: function (el, imageUrl) {
            var lis = el.parentNode.getElementsByTagName('li')
            var img = new Image()
            for (var i = 0, l = lis.length; i < l; ++i) {
                lis[i].className = ''
            }
            el.className = 'on'
            img.onload = function () {
                el.parentNode.parentNode.childNodes[3].childNodes[0].src = imageUrl
            }
            img.src = imageUrl
        },
    };
    var getUrlParams = function () {
        var params = {}
        window.location.search.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (str, key, value) {
            params[key] = value
        })
        return params
    };
    var getMadUuid = function () {
        if (localStorage.getItem('madUuid')) {
            return localStorage.getItem('madUuid')
        } else {
            var _ = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                var r = (Math.random() * 16) | 0,
                    v = c == 'x' ? r : (r & 3) | 8
                return v.toString(16)
            })
            localStorage.setItem('madUuid', _)
            return _
        }
    };
    var config = {
        apiUrl: 'https://www.fashionade.ai/api/v1/recommend-products',
        apiParams: {
            productId: getUrlParams().productId || location.pathname.split('/')[3] || '',
            madUuid: getMadUuid(),
            userId: '',
            appKey: 'cahiers_test_9sdf9d8f982394hds9fhs9h923a',
        },
    };
    var genLogData = function(type) {
        return {
            type: type,
            appKey: 'cahiers_test_9sdf9d8f982394hds9fhs9h923a',
            uuid: getMadUuid(),
            userId: '',
            userAgent: navigator.userAgent,
            lang: navigator.language,
            page: location.href,
            referrer: document.referrer,
            ext: {},
            deviceTime: new Date()
        };
    };
    var postLogs = function(type) {
      post('https://admin.fashionade.ai/logs', genLogData(type));
    };
    var utils = {
        jsonToParams: function (data) {
            var params = '?'
            for (var prop in data) {
                params += encodeURIComponent(prop) + '=' + encodeURIComponent(data[prop]) + '&'
            }
            return params.substring(0, params.length - 1)
        },
    };
    var render = function() {
        get(config.apiUrl + utils.jsonToParams(config.apiParams), function (d) {
            FASHIONADE.LOGS('init');

            if (d.length > 0) {
                if ($('[data-fashionade-render-recommend-type="overlay"]') && $('[data-fashionade-open-layer="recommend"]')) {
                    $('[data-fashionade-open-layer="recommend"]').onclick = function () {
                        $('[data-fashionade-render-recommend-type="overlay"]').innerHTML =
                            '<div class="fashionade--layerWrap"><div class="fashionade--layerInnerWrap">' +
                            strTitle(d, 'overlay') +
                            strContent(d, 'overlay') +
                            (d.length > 1 ? '<button class="fashionade--btn fashionade--prev" onClick="FASHIONADE.RECOMMEND_LAYER_DIRECT(-1)">이전 추천보기</button> \
                        <button class="fashionade--btn fashionade--next" onClick="FASHIONADE.RECOMMEND_LAYER_DIRECT(1)">다음 추천보기</button>' : '') +
                            '<button class="fashionade--btn fashionade--close" onClick="FASHIONADE.RECOMMEND_LAYER_REMOVE()">닫기</button></div></div> \
                            <div class="fashionade--dimmed" onClick="FASHIONADE.RECOMMEND_LAYER_REMOVE()"></div>';

                        FASHIONADE.LOGS('open');
                    }
                }

                if ($('[data-fashionade-render-recommend-type="render"]')) {
                    $('[data-fashionade-render-recommend-type="render"]').innerHTML =
                        '<div class="fashionade--renderWrap">' +
                        strTitle(d) +
                        strContent(d) +
                        (d.length > 1 ? '<button class="fashionade--btn fashionade--prev" onClick="FASHIONADE.RECOMMEND_DIRECT(-1)">이전 추천보기</button> \
                    <button class="fashionade--btn fashionade--next" onClick="FASHIONADE.RECOMMEND_DIRECT(1)">다음 추천보기</button>' : '') +
                        '</div>';

                    FASHIONADE.LOGS('render');
                }

                if ($('.fashionade--btn-overlay')) {
                    $('.fashionade--btn-overlay').style.display='block';
                }
            }
        });
    };
    document.addEventListener('DOMContentLoaded', render);

    return {
        RECOMMEND_DATA: RECOMMEND.DATA,
        RECOMMEND_DIRECT: RECOMMEND.direct,
        RECOMMEND_CURRENT: RECOMMEND.current,
        RECOMMEND_LAYER_DIRECT: RECOMMEND.layer_direct,
        RECOMMEND_LAYER_CURRENT: RECOMMEND.layer_current,
        RECOMMEND_LAYER_REMOVE: RECOMMEND.layer_remove,
        RECOMMEND_LAYER_MAINIMAGE: RECOMMEND.layer_showMainImage,
        LOGS : function(type) {
            postLogs(type);
        },
        RENDER: render
    }
})(window)
