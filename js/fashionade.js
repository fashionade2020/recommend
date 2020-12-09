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
                    ? 'FASHIONADE.RECOMMEND_LAYER_POSITION(' + (i + 1) + ');FASHIONADE.LOGS(\'click\', \'STYLE' + (i + 1) + '\');'
                    : 'FASHIONADE.RECOMMEND_POSITION(' + (i + 1) + ');FASHIONADE.LOGS(\'click\', \'STYLE' + (i + 1) + '\');'
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
            '" height="424" alt="" /></div> \
                </div>'
        )
    };
    var isFashionadePage = location.host.indexOf('fashionade.ai') > -1;
    var strItems = function (items) {
        for (var innerHTML = '', i = 0, l = Math.min(items.length, 3); i < l; ++i) {
            innerHTML +=
            '<li class="fashionade--item"> \
                <div class="fashionade--thumb" style="background-image:url(\'' + items[i].imageUrl + '\')"><a href="' + (isFashionadePage ? 'https://www.fashionade.ai/item/' + items[i].id : items[i].detailUrl) + '" target="FROM_FASHIONADE_SDK" onclick="FASHIONADE.LOGS(\'click\', \'THUMBNAIL' + (i + 1) + '\')">' + items[i].name + '</a></div> \
                <div class="fashionade--content"> \
                  <dl> \
                    <dt class="fashionade--brand"><a href="' + (isFashionadePage ? 'https://www.fashionade.ai/item/' + items[i].id : items[i].detailUrl) + '" target="FROM_FASHIONADE_SDK" onclick="FASHIONADE.LOGS(\'click\', \'BRAND' + (i + 1) + '\')">' + items[i].brand + '</a></dt> \
                    <dd class="fashionade--name"><a href="' + (isFashionadePage ? 'https://www.fashionade.ai/item/' + items[i].id : items[i].detailUrl) + '" target="FROM_FASHIONADE_SDK" onclick="FASHIONADE.LOGS(\'click\', \'NAME' + (i + 1) + '\')">' + items[i].name + '</a></dd> \
                  </dl> \
                </div> \
          </li>'
        }
        return '<div class="fashionade--itemList"><ul>' + innerHTML + '</ul></div>'
    };

    var RECOMMEND = {
        INDEX: 1,
        LAYER_INDEX: 1,
        direct: function (dir) {
            RECOMMEND.show((RECOMMEND.INDEX += dir))
        },
        position: function (idx) {
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
        layer_position: function (idx) {
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
    var getParam = function () {
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
        apiParams: {
            productId: getParam().productId || getParam().product_no || location.pathname.split('/')[3] || '',
            madUuid: getMadUuid()
        }
    };
    var genLogData = function(type, eventPosition) {
        return {
            type: type,
            apiKey: config.apiParams.apiKey,
            uuid: getMadUuid(),
            userAgent: navigator.userAgent,
            lang: navigator.language,
            page: location.href,
            referrer: document.referrer,
            windowName: window.name,
            ext: config.logExt,
            deviceTime: new Date(),
            eventPosition: eventPosition !== undefined ? eventPosition : ''
        };
    };
    var postLogs = function(type, eventPosition) {
      post('https://admin.fashionade.ai/logs', genLogData(type, eventPosition));
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
    var cache = {}, tmpl = function(str, data){
        var fn = !/\W/.test(str) ?
            cache[str] = cache[str] || tmpl(document.getElementById(str).innerHTML) :
            new Function("obj",
                "var p=[],print=function(){p.push.apply(p,arguments);};" +
                "with(obj){p.push('" +
                str
                    .replace(/[\r\t\n]/g, " ")
                    .split("<%").join("\t")
                    .replace(/((^|%>)[^\t]*)'/g, "$1\r")
                    .replace(/\t=(.*?)%>/g, "',$1,'")
                    .split("\t").join("');")
                    .split("%>").join("p.push('")
                    .split("\r").join("\\'")
                + "');}return p.join('');");
        return data ? fn( data ) : fn;
    };
    var render = function(renderWrapperId, templateId) {
        get(config.apiUrl + utils.jsonToParams(config.apiParams), function (d) {
            FASHIONADE.LOGS('init');
            var showContents = (d.length === 1 && d[0].items.length === 0) ? false : true;

            if (d.length > 0 && showContents) {
                if(renderWrapperId && templateId) {
                    document.getElementById(renderWrapperId).innerHTML = tmpl(templateId, {data : d});
                    FASHIONADE.LOGS('render custom template');
                } else {
                    if ($('[data-fashionade-render-recommend-type="overlay"]') && $('[data-fashionade-open-layer="recommend"]')) {
                        $('[data-fashionade-open-layer="recommend"]').onclick = function (ev) {
                            ev.stopPropagation();
                            $('[data-fashionade-render-recommend-type="overlay"]').innerHTML =
                                '<div class="fashionade--layerWrap"><div class="fashionade--layerInnerWrap">' +
                                strTitle(d, 'overlay') +
                                strContent(d, 'overlay') +
                                (d.length > 1 ? '<button class="fashionade--btn fashionade--prev" onClick="FASHIONADE.RECOMMEND_LAYER_DIRECT(-1);FASHIONADE.LOGS(\'click\', \'PREV\');">이전 추천보기</button> \
                        <button class="fashionade--btn fashionade--next" onClick="FASHIONADE.RECOMMEND_LAYER_DIRECT(1);FASHIONADE.LOGS(\'click\', \'NEXT\');">다음 추천보기</button>' : '') +
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
                            (d.length > 1 ? '<button class="fashionade--btn fashionade--prev" onClick="FASHIONADE.RECOMMEND_DIRECT(-1);FASHIONADE.LOGS(\'click\', \'PREV\');">이전 추천보기</button> \
                    <button class="fashionade--btn fashionade--next" onClick="FASHIONADE.RECOMMEND_DIRECT(1);FASHIONADE.LOGS(\'click\', \'NEXT\');">다음 추천보기</button>' : '') +
                            '</div>';

                        FASHIONADE.LOGS('render default template');
                    }

                    if ($('.fashionade--btn-overlay')) {
                        $('.fashionade--btn-overlay').style.display = 'block';
                    }
                }
            }
        });
    };
    var attachLogEventToButtons = function() {
        if($$('.btnBuyUl .btn-buy a').length > 0) {
            $$('.btnBuyUl .btn-buy a')[0].addEventListener('click', function() {
                FASHIONADE.LOGS('buy');
            });
        }
        if($$('.btnBuyUl .btn-se a').length > 0) {
            $$('.btnBuyUl .btn-se a')[0].addEventListener('click', function () {
                FASHIONADE.LOGS('cart');
            });
            $$('.btnBuyUl .btn-se a')[1].addEventListener('click', function () {
                FASHIONADE.LOGS('wish');
            });
        }

        if($$('#actionBuy').length > 0) {
            $$('#actionBuy')[0].addEventListener('click', function() {
                FASHIONADE.LOGS('buy');
            });
        }
        if($$('#actionCart').length > 0) {
            $$('#actionCart')[0].addEventListener('click', function() {
                FASHIONADE.LOGS('cart');
            });
        }
        if($$('#actionWish').length > 0) {
            $$('#actionWish')[0].addEventListener('click', function() {
                FASHIONADE.LOGS('wish');
            });
        }
    };
    document.addEventListener('DOMContentLoaded', function() {
        attachLogEventToButtons();
        //render();
    });

    var init = function(_config, _ext) {
        config.apiUrl = _config.apiUrl || 'https://www.fashionade.ai/api/v2/recommend-products';
        config.apiParams.apiKey = _config.apiKey;   //'fa_9sdf9d8f982394hds9fhs9h929a'
        config.apiParams.productId = _config.productId;
        config.logExt = _ext;
    };

    return {
        RECOMMEND_INDEX: function() {
            return RECOMMEND.INDEX
        },
        RECOMMEND_LAYER_INDEX: function() {
            RECOMMEND.LAYER_INDEX
        },
        RECOMMEND_DIRECT: RECOMMEND.direct,
        RECOMMEND_POSITION: RECOMMEND.position,
        RECOMMEND_LAYER_DIRECT: RECOMMEND.layer_direct,
        RECOMMEND_LAYER_POSITION: RECOMMEND.layer_position,
        RECOMMEND_LAYER_REMOVE: RECOMMEND.layer_remove,
        LOGS: function(type, eventPosition) {
            postLogs(type, eventPosition);
        },
        getParam: getParam,
        render: function(opts) {
            if(opts && opts.productId) {
                config.apiParams.productId = opts.productId;
                if(opts && opts.templateWrapId && opts.templateId) {
                    render(opts.templateWrapId, opts.templateId);
                } else {
                    render();
                }
            }
        },
        init : init
    }
})(window);
