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
  }
  var strTitle = function (titles) {
    for (var innerHTML = '', i = 0, l = titles.length; i < l; ++i) {
      innerHTML += '<li class="' + (i === 0 ? 'on' : '') + '">' + titles[i].name + '</li>'
    }
    return '<ul class="fashionade--recommendTitleList">' + innerHTML + '</ul>'
  }
  var strContent = function (contents, type) {
    for (var innerHTML = '', i = 0, l = contents.length; i < l; ++i) {
      innerHTML += '<li>' + (type === 'overlay' ? strmainImage(contents[i].images) : '') + strItems(contents[i].items) + '</li>'
    }
    return '<ul class="fashionade--recommendContentList">' + innerHTML + '</ul>'
  }
  var strmainImage = function (images) {
    for (var innerHTML = '', i = 0, l = images.length; i < l; ++i) {
      innerHTML +=
        '<li class="' +
        (i === 0 ? 'on' : '') +
        '" style="background-image:url(\'' +
        images[i] +
        '\')" onMouseOver="FASHIONADE.RECOMMEND_MAINIMAGE(this, \'' +
        images[i] +
        '\')"></li>'
    }
    return (
      '<div class="fashionade--mainImageWrap"> \
          <ul class="fashionade--mainImageThumbList">' +
      innerHTML +
      '</ul> \
          <div class="fashionade--mainImage"><img src="' +
      images[0] +
      '" width="283" height="424" alt="" /></div> \
          </div>'
    )
  }
  var strItems = function (items) {
    for (var innerHTML = '', i = 0, l = items.length; i < l; ++i) {
      innerHTML +=
        '<li class="fashionade--item"> \
        <div class="fashionade--thumb" style="background-image:url(\'' +
        items[i].imageUrl +
        '\')"></div> \
        <div class="fashionade--content"> \
          <dl> \
            <dt class="fashionade--brand">' +
        items[i].brand +
        '</dt> \
            <dd class="fashionade--name">' +
        items[i].name +
        '</dd> \
          </dl> \
        </div> \
      </li>'
    }
    return '<div class="fashionade--itemList"><ul>' + innerHTML + '</ul></div>'
  }

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
  }
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
  }
  var config = {
    apiUrl: 'https://dev.fashionade.ai:3000/api/v1/recommend-products',
    apiParams: {
      productId: '1367',
      madUuid: getMadUuid(),
      userId: '',
      appKey: 'cahiers_test_9sdf9d8f982394hds9fhs9h923a',
    },
  }
  var utils = {
    jsonToParams: function (data) {
      var params = '?'
      for (var prop in data) {
        params += encodeURIComponent(prop) + '=' + encodeURIComponent(data[prop]) + '&'
      }
      return params.substring(0, params.length - 1)
    },
  }

  document.addEventListener('DOMContentLoaded', function () {
    get(config.apiUrl + utils.jsonToParams(config.apiParams), function (d) {
      // get('https://dev.fashionade.ai:3000/api/v1/recommend-products?productId=300908101&madUuid=sample1234&userId=sample_1234&appKey=cahiers_test_9sdf9d8f982394hds9fhs9h923a', function(d) {
      if (d.length > 0) {
        if ($('[data-fashionade-render-recommend-type="overlay"]') && $('[data-fashionade-open-layer="recommend"]')) {
          $('[data-fashionade-open-layer="recommend"]').onclick = function () {
            $('[data-fashionade-render-recommend-type="overlay"]').innerHTML =
              '<div class="fashionade--layerWrap"><div class="fashionade--layerInnerWrap">' +
              strTitle(d) +
              strContent(d, 'overlay') +
              '<button class="fashionade--btn fashionade--prev" onClick="FASHIONADE.RECOMMEND_LAYER_DIRECT(-1)">이전 추천보기</button> \
                            <button class="fashionade--btn fashionade--next" onClick="FASHIONADE.RECOMMEND_LAYER_DIRECT(1)">다음 추천보기</button> \
                            <button class="fashionade--btn fashionade--close" onClick="FASHIONADE.RECOMMEND_LAYER_REMOVE()">닫기</button> \
                            </div></div> \
                            <div class="fashionade--dimmed"></div>'
          }
        }

        if ($('[data-fashionade-render-recommend-type="render"]')) {
          $('[data-fashionade-render-recommend-type="render"]').innerHTML =
            '<div class="fashionade--renderWrap">' +
            strTitle(d) +
            strContent(d) +
            '<button class="fashionade--btn fashionade--prev" onClick="FASHIONADE.RECOMMEND_DIRECT(-1)">이전 추천보기</button> \
                        <button class="fashionade--btn fashionade--next" onClick="FASHIONADE.RECOMMEND_DIRECT(1)">다음 추천보기</button> \
                        </div>'
        }
      }
    })
  })

  return {
    $,
    $$,
    get,
    RECOMMEND_DATA: RECOMMEND.DATA,
    RECOMMEND_DIRECT: RECOMMEND.direct,
    RECOMMEND_LAYER_DIRECT: RECOMMEND.layer_direct,
    RECOMMEND_LAYER_REMOVE: RECOMMEND.layer_remove,
    RECOMMEND_LAYER_MAINIMAGE: RECOMMEND.layer_showMainImage,
  }
})(window)
