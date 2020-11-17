class Debug {
  
    constructor(instance, config) {
      // debug日志调试凭证
      this._token = '';
      // debug数据是否上传到平台
      this._upload = '0';
      if (!instance && !config) return null;
      this.Sdk = instance;
      this.Sdk['debug'] = this;
      this._token = config.token;
      this._upload = config.upload;
    }
    
    // 上报实时日志到平台
    log(data) {
      const url = this.Sdk.getConfig('debugHost') + '/debug/track?token=' + this._token + '&userId=' + (this.Sdk.getUserId() || this.Sdk.getDeviceUdid());
      this.Sdk.SDKAPI.request({
        url: url,
        data: data || {},
        method: "POST"
      });
    }
  
    // 是否处于调试模式
    has_in_debug() {
      return !!this._token;
    }
  
    // 是否需要将调试数据上报到平台
    has_upload() {
      return this.has_in_debug() && this._upload == '1';
    }
}






// 渠道推广类
// 以下 A/C/B 接口，指的是微信小程序的，其它小程序暂时也按照该方式；
/**
 * 推广参数 A/C 接口获取的参数  https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/qr-code.html
 * utm_source : u_s
 * utm_medium : u_m
 * utm_campaign : u_cp
 * utm_content : u_ct
 * utm_term : u_t
 * promotional_id : p_id
 */
// 推广参数 B 接口获取的参数格式：aaa*bbb*ccc*ddd
class Campaign {
    constructor(instance, query, _) {
      this._campaign = {
        utm_source: '',
        utm_medium: '',
        utm_campaign: '',
        utm_content: '',
        utm_term: '',
        promotional_id: ''
      };
      // 是否渠道推广
      this._isCampaign = false;
      // 是否广告点击事件
      this._isAdClick = false;
      // 本地保存数据key ：Sdk_wechat_u
      this._key = 'Sdk_wechat_u';
      // 本地缓存超时时间（单位，天）
      this._day = 30;
      if (!instance) {
        return;
      }
      this.Sdk = instance;
      this.Sdk['campaign'] = this;
      this._ = _;
      // 设置推广参数，同时检测是否为渠道推广
      this._setParams(query);
    }
    init() {
      if (this._isCampaign) {
        this._setLocal();
        // 发送广告点击事件
        this.Sdk.daAdClick();
      } else
      // 若本地缓存过期，清除本地数据 
      if (this._checkUpdateTime()){
        this._campaign = {
          utm_source: '',
          utm_medium: '',
          utm_campaign: '',
          utm_content: '',
          utm_term: '',
          promotional_id: ''
        };
        this._setLocal();
      }
    }
    // 设置推广参数
    _setParams(query) {
      // 根据当前传入的参数判断此时进入是否为新的渠道推广
      this._checkCampaign(query);
      let params = {};
      if (this._isCampaign) {
          params = query;
      } else {
          // 从本地数据库拿取数据
          params = this._getLocal() || {};
      }
      this._campaign = Object.assign({},this._campaign, params);
    }
    // 检测并设置渠道推广
    _checkCampaign(query) {
      const _ = this._;
      if (!_.isObject(query)) { 
        return;
      }
      if( !_.isUndefined(query.utm_source) && query.utm_source !== '' &&
          !_.isUndefined(query.utm_medium) && query.utm_medium !== '' &&
          !_.isUndefined(query.utm_campaign) && query.utm_campaign !== ''
      ) {
        this._isCampaign = true;
      } else {
        this._isCampaign = false;
      }
    }
    // 检测本地存储数据是否过期（即是否需要更新）
    _checkUpdateTime() {
      let bool = true;
      try {
        const localData = this._getLocal();
        const nowDateTime = 1 * (new Date().getTime()) / 1000;
        const localDateTime = 1 * localData.updatedTime / 1000;
        if ( nowDateTime <= localDateTime + 60 * 12 * this._day ) {
          bool = false;
        }
      } catch (error) {}
      return bool;
    }
    // 数据保存到本地缓存
    _setLocal() {
      this._campaign.updatedTime = new Date().getTime();
      const str = JSON.stringify(this._campaign);
      this.Sdk.SDKAPI.setStorageSync(this._key, str);
    }
    // 获取本地缓存数据
    _getLocal() {
      const str = this.Sdk.SDKAPI.getStorageSync(this._key);
      try {
        return JSON.parse(str);
      } catch (error) {
        return '';
      } 
    }
    // 获取渠道推广公共字段
    get_campaign_params() {
      const _ = this._;
      const _campaign = this._campaign;  
      const params = {
        utmSource: _campaign.utm_source,
        utmMedium: _campaign.utm_medium,
        promotionalID: _campaign.promotional_id,
        utmCampaign: _campaign.utm_campaign,
        utmContent: _campaign.utm_content,
        utmTerm: _campaign.utm_term
      };
      if(_.isUndefined(params.utmSource) || params.utmSource ==='') {
        delete params.utmSource;
      }
      if(_.isUndefined(params.utmMedium) || params.utmMedium ==='') {
        delete params.utmMedium;
      }
      if(_.isUndefined(params.promotionalID) || params.promotionalID ==='') {
        delete params.promotionalID;
      }
      if(_.isUndefined(params.utmCampaign) || params.utmCampaign ==='') {
        delete params.utmCampaign;
      }
      if(_.isUndefined(params.utmContent) || params.utmContent ==='') {
        delete params.utmContent;
      }
      if(_.isUndefined(params.utmTerm) || params.utmTerm ==='') {
        delete params.utmTerm;
      }
      return params;
    }
  }

function on(obj, event, callFn, root) {
    if (obj[event]) {
      var fn = obj[event];
      obj[event] = function (obj) {
        callFn.call(root, obj, event, this);
        if (event === 'onLaunch') {
          this['Sdk'] = root['Sdk'];  
        }
        if (event === 'onShareAppMessage') {
          return fn.call(this, obj);
        } else {
          fn.call(this, obj);
        }
      };
  } else {
     obj[event] = function (obj) {
      callFn.call(root, obj, event, this);
     };
  }
}


// 小程序原生方法代理类
class SdkAgent {
    
    constructor(instance, _) {
      this.Sdk = instance;
      this._ = _;
      // onlaunch触发标志，sdk内部使用
      if (this.Sdk.getConfig('miniType') == 'swan') {
        swan.SdkAppLaunchOk = false;
      }
      
      // 微信\字节跳动\百度小程序都支持重写 App和Page类 （百度小程序有些特别）
      if (!App.reset) {
        let app = App;
        App = (obj) => {
            app(this.App(obj));
        };
        App.reset = true;
      }

      if (!Page.reset) {
        let page = Page;
        Page = (obj) => {
          page(this.Page(obj));
        };
        Page.reset = true;
      }
      // $global 是支付宝小程序的对象 -- my
      if (typeof $global !== "undefined") {
        if ( _.isObject($global)) { 
          $global.Sdk = instance;
        }
      }
      
    }
    // 解析 scene 参数上的实时调试配置： E2A707&0
    getSceneDebug(str) {
      const _ = this._;
      if (_.isUndefined(str)) {
        str = '';
      }
      let token;
      let upload;
      let isDebug = false;
      let arr = str.split('&');
      // 百度小程序，用'&'符合会认为后面的是一个参数字段，故百度小程序的间隔符号改成了*
      if (this.Sdk.getConfig('miniType') == 'swan') {
        arr = str.split('*');
      }
   
      // 是调试模式（含有两个参数）
      if (!_.isUndefined(arr[0]) && !_.isUndefined(arr[1])) {
        // 第一个值（token）长度为6位，第二个值(upload) 必须为数字
        if (arr[0].length === 6 && !isNaN(arr[1])) {
          isDebug = true;
          token = arr[0];
          upload = arr[1];
        }
      }

      return {
       token: token,
       upload: upload,
       isDebug: isDebug
      };
    }
    // 渠道推广参数解析：参数格式 :
    /**
      * utm_source : u_s
      * utm_medium : u_m
      * utm_campaign : u_cp
      * utm_content : u_ct
      * utm_term : u_t
      * promotional_id : p_id
     */
    getACApiCreateCampaign(query) {
      const _ = this._;  
      const campaign = {
        utm_source: query.u_s && decodeURIComponent(query.u_s) || "",
        utm_medium: query.u_m && decodeURIComponent(query.u_m) || "",
        utm_campaign: query.u_cp && decodeURIComponent(query.u_cp) || "",
        utm_content: query.u_ct && decodeURIComponent(query.u_ct) || "",
        utm_term: query.u_t && decodeURIComponent(query.u_t) || "",
        promotional_id: query.p_id && decodeURIComponent(query.p_id) || ""
      };
      let isCampaign = false;
      if( !_.isUndefined(campaign.utm_source) && campaign.utm_source !== '' &&
          !_.isUndefined(campaign.utm_medium) && campaign.utm_medium !== '' &&
          !_.isUndefined(campaign.utm_campaign) && campaign.utm_campaign !== ''
      ) {
        isCampaign = true;
      }
      return {
        isCampaign: isCampaign,
        campaign: campaign
      };
    }
    
    // 渠道推广参数解析：参数格式 : aaa*bbb*ccc**dd
    getSceneCampaign(sceneStr) {
      const _ = this._;  
      if (_.isUndefined(sceneStr)) {
        sceneStr = '';
      }
      const defalut = void(0);
      const campaign = {
        utm_source: defalut,
        utm_medium: defalut,
        utm_campaign: defalut,
        utm_content: defalut,
        utm_term: defalut,
        promotional_id: defalut
      };
      let isCampaign = false;
      let arr = sceneStr.split('*');
      let i = 0;
      for (let key in campaign) { 
        campaign[key] = arr[i];
        i++;
      }
      if( !_.isUndefined(campaign.utm_source) && campaign.utm_source !== '' &&
          !_.isUndefined(campaign.utm_medium) && campaign.utm_medium !== '' &&
          !_.isUndefined(campaign.utm_campaign) && campaign.utm_campaign !== ''
      ) {
        isCampaign = true;
      }
      return {
        isCampaign: isCampaign,
        campaign: campaign
      };
    }

    // 渠道推广参数解析：参数格式: 按照标准utm格式
    getUtmCampaign(query) {
      const _ = this._;  
      const campaign = {
        utm_source: query.utm_source && decodeURIComponent(query.utm_source) || "",
        utm_medium: query.utm_medium && decodeURIComponent(query.utm_medium) || "",
        utm_campaign: query.utm_campaign && decodeURIComponent(query.utm_campaign) || "",
        utm_content: query.utm_content && decodeURIComponent(query.utm_content) || "",
        utm_term: query.utm_term && decodeURIComponent(query.utm_term) || "",
        promotional_id: query.promotional_id && decodeURIComponent(query.promotional_id) || ""
      };
      let isCampaign = false;
      if( !_.isUndefined(campaign.utm_source) && campaign.utm_source !== '' &&
          !_.isUndefined(campaign.utm_medium) && campaign.utm_medium !== '' &&
          !_.isUndefined(campaign.utm_campaign) && campaign.utm_campaign !== ''
      ) {
        isCampaign = true;
      }
      return {
        isCampaign: isCampaign,
        campaign: campaign
      }; 
    }

    // 解析参数，获取渠道推广信息
    getCampaign(sceneStr, query) {
      let isCampaign = false;
      let campaign = {};
      
      // A/C接口生成的推广配置：优先级最高 query
      const ACApiCreateCampaign = this.getACApiCreateCampaign(query);
      // 渠道推广格式：scene--- aaa*bbb*ccc**dd ; 优先级次之
      const sceneCampaign = this.getSceneCampaign(sceneStr);
      // 用户按照utm标准格式传递过来的配置：优先级最低 query
      const utmCampaign = this.getUtmCampaign(query);
      
      if (ACApiCreateCampaign.isCampaign) {
        campaign = ACApiCreateCampaign.campaign;
        isCampaign = true;
      } else 
      if (sceneCampaign.isCampaign) {
        campaign = sceneCampaign.campaign;
        isCampaign = true;
      } else 
      if (utmCampaign.isCampaign) {
        campaign = utmCampaign.campaign;
        isCampaign = true;
      }
  
      return {
        isCampaign: isCampaign,
        campaign: campaign
      };
    }

    appLaunch(e) {
      e.query =  e.query || {};
      const Sdk = this.Sdk;  
      
      const fn1 = () => {
        const sceneStr = e.query.scene && decodeURIComponent(e.query.scene) || '';
        //实时调试参数格式:  E2A707&0
        const sceneDebugConf = this.getSceneDebug(sceneStr);
        // 渠道推广参数
        const campaign = this.getCampaign(sceneStr, e.query);
          
        Sdk.setScene(e.scene);
        Sdk.setReferrer('');
        Sdk.setOldReferrer('');
        // debug参数（实时调试） scene
        new Debug(Sdk, sceneDebugConf);
        // 渠道推广
        new Campaign(Sdk, campaign.campaign, this._);
        Sdk.daActivate();
  
        Sdk['campaign'].init();
  
        let pros = {};
        // 设置分享相关的字段值
        Sdk.setShareInfo(e, pros);
        // 触发da_onLaunch 事件，应用唤醒的时候触发
        Sdk.trackOnLaunch(pros);
      };
      
      // 百度小程序：appShow 比 appLaunch 触发的早 ，故百度小程序做了特殊处理。
      // 第一次打开app后，appShow的方法在 appLaunch初始化，即fn2。
      const fn2 = () => {
        // 后台切换到前台，page隐藏重新设置的referrer是本页 currentUrl，这时候 referrer是不对的，需要判断重新设置
        Sdk.setScene(e.scene);
        Sdk.repeatSetReferrer();
        Sdk.sessionStart();
        let pros = {};
        Sdk.setShareInfo(e, pros);
        // 触发da_onShow 事件，应用唤醒的时候触发
        Sdk.trackOnShow(pros);
        Sdk.set();
      };

      fn1();

      // 百度小程序：appShow 比 appLaunch 触发的早 
      if (Sdk.getConfig('miniType') == 'swan') {
        swan.SdkAppLaunchOk = true;
        fn2();
      }
    }
    appShow(e) {
      const Sdk = this.Sdk; 
      const fn1 = () => {
        // 后台切换到前台，page隐藏重新设置的referrer是本页 currentUrl，这时候 referrer是不对的，需要判断重新设置
        Sdk.setScene(e.scene);
        Sdk.repeatSetReferrer();
        Sdk.sessionStart();
        let pros = {};
        Sdk.setShareInfo(e, pros);
        // 触发da_onShow 事件，应用唤醒的时候触发
        Sdk.trackOnShow(pros);
        Sdk.set();
      };
      

      // 百度小程序：appShow 比 appLaunch 触发的早
      if (Sdk.getConfig('miniType') == 'swan') {
        if (swan.SdkAppLaunchOk) {
          fn1();
        }
      } else {
        fn1();
      }
    }
    appHide() {

    }
    pageUnload() {
      this.Sdk.setReferrer();
      this.Sdk.set();
    }
    pageShow(e, eventName, targetPage) {
      const Sdk = this.Sdk;
      const onPageShowFn = Sdk.getConfig('onPageShow');
      let route = '';
      // 获取当前页面path
      if (typeof targetPage.route === 'string') {
        route = targetPage.route;
      } else
      if (typeof targetPage.__route__ === 'string') {
        route = targetPage.__route__;
      }
      Sdk.setRoute(route);
      Sdk.setUrl();
      Sdk.curPageObj = targetPage;
      if(typeof onPageShowFn === 'function') {
        onPageShowFn(Sdk, route, targetPage);
      } else {
        Sdk.track_pageview();
      }
    }
    pageHide() {
      this.Sdk.setReferrer();
      this.Sdk.set();
    }
    pageShareAppMessage(e) {
      this.Sdk.track_share({}, e && e.channel);
    }

    // sdk的 Page
    Page(obj) {
      on(obj, "onLoad", function (query, eventName, targetPage) {
        // 获取页面参数通过getCurrentPages方法获取
        if (!targetPage.options) {
          targetPage.options = query;
        }
      }, this);
      on(obj, "onUnload", this.pageUnload, this);
      on(obj, "onShow", this.pageShow, this);
      on(obj, "onHide", this.pageHide, this);

      const Sdk = this.Sdk;
      // 当只开启了所有页面都可分享配置，注意：这个if模块只测试了微信
      if(
        Sdk.getConfig('shareAll') && 
        !Sdk.getConfig('allowAmendSharePath') &&
          !Sdk.getConfig('share')
      ) {
        on(obj, 'onShareAppMessage', this.pageShareAppMessage, this);
      }

      // 监听在 Page 中定义的 onShareAppMessage 函数，分享追踪功能相关
      if (typeof obj.onShareAppMessage === 'function') {
        let old = obj.onShareAppMessage;
        obj.onShareAppMessage = (e) => {
          // 判断是否首次触发分享（触发 da_share时调用）
          // 判断条件：分享参数其中一个值为'notFromShare'，或当前要分享的路径跟shareUrlPath不相同
          const firstShareFn = (sharePath) => {
            let first = true;
            if (
              Sdk.firstShareUid !== 'notFromShare' &&
              Sdk.lastShareUid !== 'notFromShare' &&
              Sdk.shareUrlPath !== 'notFromShare' &&
              Sdk.shareDepth !== 'notFromShare'
            ) {
              first = false;
            }
            if (sharePath) {
              if (sharePath != Sdk.shareUrlPath) {
                first = true;
              }
            }
            return first;
          };

          // 执行onShareAppMessage方法， 获取用户配置的自定义分享信息，若没配置，则是系统默认
          let shareInfo = old.apply(Sdk.curPageObj, arguments);
          // 用户配置了允许sdk更改分享path
          if (Sdk.getConfig('allowAmendSharePath')) {
            // localshareInfo 为本次需分享的参数信息
            let localshareInfo = Sdk.getShareInfo();
            // 检测用户填写的是否合法的path，是的重新设置本次分享的path（参数sdkshare= xxx 后面的值中path）
            if (
              typeof shareInfo.path === 'string' &&
              shareInfo.path.indexOf('/') !== -1
            ) {
              try {
                // 获取path（去掉参数）
                const path = shareInfo.path.split('?')[0];
                localshareInfo.$shareUrlPath = path;
              } catch (error) {}
            }

            // 当前要分享的路径跟shareUrlPath若不相同，分享参数初始化（认为是首次分享）
            const firstShare = firstShareFn(localshareInfo.$shareUrlPath);
            if (firstShare) {
              localshareInfo.$firstShareUid = Sdk.getUserId() || Sdk.getDeviceUdid();
              localshareInfo.$lastShareUid = Sdk.getUserId() || Sdk.getDeviceUdid();
              localshareInfo.$shareDepth = 0;
            }

            // 设置da_share事件的系统自定义属性
            const daShareInfo = {
              $shareUrlPath: localshareInfo.$shareUrlPath,
              $firstShareUid: localshareInfo.$firstShareUid,
              $lastShareUid: firstShare ? 'notFromShare' : Sdk.getLastShareUid(),
              $shareDepth: localshareInfo.$shareDepth
            };
            // sdk自动上报da_share事件
            Sdk.track_share(daShareInfo, e && e.channel);

            // 合法的path，设置本次分享的path
            if (
              typeof shareInfo.path === 'string' &&
              shareInfo.path.indexOf("/") !== -1
            ) {
              if (shareInfo.path.indexOf("?") === -1) {
                shareInfo.path = shareInfo.path + "?";
              } else 
              if (shareInfo.path.slice(-1) !== '&'){
                shareInfo.path = shareInfo.path + "&";
              }
              shareInfo.path = shareInfo.path + "sdkshare=" + encodeURIComponent(JSON.stringify(localshareInfo));
            }
          } else {
            // 配置了自定义分享，但不进行分享后续追踪
            if (Sdk.getConfig('share')) {
              // sdk自动上报da_share事件
              Sdk.track_share({}, e && e.channel);
            }
          }
          
          // 返回给小程序这次要分享的信息
          return shareInfo;
        };
      }

      return obj;
    }

    App(obj) {
      on(obj, "onLaunch", this.appLaunch, this);
      on(obj, "onShow", this.appShow, this);
      on(obj, "onHide", this.appHide, this);

      return obj;
    }
}

/**
 * 帮助类
 */

const _ = {
  // 验证yyyy-MM-dd日期格式  
  checkTime(timeString) {
    var date = timeString + '';
    var reg = /^(\d{4})-(\d{2})-(\d{2})$/; 
    if(date) {
      if (!reg.test(date)){
         return false;
      } else {
          return true;
      }
    } else {
        return false;
    }
  },  
  isArray(obj) {
    return Array.isArray(obj);
  }, 
  isObject(obj) {
    return (obj === Object(obj) && !_.isArray(obj));
  },  
  isUndefined(obj) {
    return obj === void 0;
  },  
  truncate(obj, length) {
    var ret;

    if (typeof(obj) === 'string') {
        ret = obj.slice(0, length);
    } else if (_.isArray(obj)) {
        ret = [];
        obj.map( val => {
            ret.push(_.truncate(val, length));
        } );
    } else if (_.isObject(obj)) {
        ret = {};
        for (let key in obj) {
            ret[key] = _.truncate(obj[key], length);
        }
    } else {
        ret = obj;
    }

    return ret;
  },  
  base64Encode(data) {
    var b64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
    var o1, o2, o3, h1, h2, h3, h4, bits, i = 0,
        ac = 0,
        enc = '',
        tmp_arr = [];

    if (!data) {
        return data;
    }

    data = _.utf8Encode(data);

    do { // pack three octets into four hexets
        o1 = data.charCodeAt(i++);
        o2 = data.charCodeAt(i++);
        o3 = data.charCodeAt(i++);

        bits = o1 << 16 | o2 << 8 | o3;

        h1 = bits >> 18 & 0x3f;
        h2 = bits >> 12 & 0x3f;
        h3 = bits >> 6 & 0x3f;
        h4 = bits & 0x3f;

        // use hexets to index into b64, and append result to encoded string
        tmp_arr[ac++] = b64.charAt(h1) + b64.charAt(h2) + b64.charAt(h3) + b64.charAt(h4);
    } while (i < data.length);

    enc = tmp_arr.join('');

    switch (data.length % 3) {
        case 1:
            enc = enc.slice(0, -2) + '==';
            break;
        case 2:
            enc = enc.slice(0, -1) + '=';
            break;
    }

    return enc;
  },  
  utf8Encode(string) {
    string = (string + '').replace(/\r\n/g, '\n').replace(/\r/g, '\n');

    var utftext = '',
        start,
        end;
    var stringl = 0,
        n;

    start = end = 0;
    stringl = string.length;

    for (n = 0; n < stringl; n++) {
        var c1 = string.charCodeAt(n);
        var enc = null;

        if (c1 < 128) {
            end++;
        } else if ((c1 > 127) && (c1 < 2048)) {
            enc = String.fromCharCode((c1 >> 6) | 192, (c1 & 63) | 128);
        } else {
            enc = String.fromCharCode((c1 >> 12) | 224, ((c1 >> 6) & 63) | 128, (c1 & 63) | 128);
        }
        if (enc !== null) {
            if (end > start) {
                utftext += string.substring(start, end);
            }
            utftext += enc;
            start = end = n + 1;
        }
    }

    if (end > start) {
        utftext += string.substring(start, string.length);
    }

    return utftext;
  },  
  sha1(str) {
    var chrsz = 8; /* bits per input character. 8 - ASCII; 16 - Unicode    */
    /*
     * These are the functions you'll usually want to call
     * They take string arguments and return either hex or base-64 encoded strings
     */
    function hex_sha1(s) {
     return binb2hex(core_sha1(str2binb(s), s.length * chrsz));
    }
    /*
     * Calculate the SHA-1 of an array of big-endian words, and a bit length
     */
    function core_sha1(x, len) {
     /* append padding */
     x[len >> 5] |= 0x80 << (24 - len % 32);
     x[((len + 64 >> 9) << 4) + 15] = len;
     var w = Array(80);
     var a = 1732584193;
     var b = -271733879;
     var c = -1732584194;
     var d = 271733878;
     var e = -1009589776;
     for (var i = 0; i < x.length; i += 16) {
      var olda = a;
      var oldb = b;
      var oldc = c;
      var oldd = d;
      var olde = e;
      for (var j = 0; j < 80; j++) {
       if (j < 16) w[j] = x[i + j];
       else w[j] = rol(w[j - 3] ^ w[j - 8] ^ w[j - 14] ^ w[j - 16], 1);
       var t = safe_add(safe_add(rol(a, 5), sha1_ft(j, b, c, d)), safe_add(safe_add(e, w[j]), sha1_kt(j)));
       e = d;
       d = c;
       c = rol(b, 30);
       b = a;
       a = t;
      }
      a = safe_add(a, olda);
      b = safe_add(b, oldb);
      c = safe_add(c, oldc);
      d = safe_add(d, oldd);
      e = safe_add(e, olde);
     }
     return Array(a, b, c, d, e);
    }
    /*
     * Perform the appropriate triplet combination function for the current
     * iteration
     */
    function sha1_ft(t, b, c, d) {
     if (t < 20) return (b & c) | ((~b) & d);
     if (t < 40) return b ^ c ^ d;
     if (t < 60) return (b & c) | (b & d) | (c & d);
     return b ^ c ^ d;
    }
    /*
     * Determine the appropriate additive constant for the current iteration
     */
    function sha1_kt(t) {
     return (t < 20) ? 1518500249 : (t < 40) ? 1859775393 : (t < 60) ? -1894007588 : -899497514;
    }
    /*
     * Add integers, wrapping at 2^32. This uses 16-bit operations internally
     * to work around bugs in some JS interpreters.
     */
    function safe_add(x, y) {
     var lsw = (x & 0xFFFF) + (y & 0xFFFF);
     var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
     return (msw << 16) | (lsw & 0xFFFF);
    }
    /*
     * Bitwise rotate a 32-bit number to the left.
     */
    function rol(num, cnt) {
     return (num << cnt) | (num >>> (32 - cnt));
    }
    /*
     * Convert an 8-bit or 16-bit string to an array of big-endian words
     * In 8-bit function, characters >255 have their hi-byte silently ignored.
     */
    function str2binb(str) {
     var bin = Array();
     var mask = (1 << chrsz) - 1;
     for (var i = 0; i < str.length * chrsz; i += chrsz)
     bin[i >> 5] |= (str.charCodeAt(i / chrsz) & mask) << (24 - i % 32);
     return bin;
    }
    /*
     * Convert an array of big-endian words to a hex string.
     */
    function binb2hex(binarray) {
     var hex_tab =  "0123456789abcdef";
     var str = "";
     for (var i = 0; i < binarray.length * 4; i++) {
      str += hex_tab.charAt((binarray[i >> 2] >> ((3 - i % 4) * 8 + 4)) & 0xF) + hex_tab.charAt((binarray[i >> 2] >> ((3 - i % 4) * 8)) & 0xF);
     }
     return str;
    }

    return hex_sha1(str); 
  },  
  UUID1() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      let r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
      return v.toString(16);
    });
  },  
  // 添加时间戳，降低重复率。
  UUID() {
    return Date.now() + "-" + Math.floor(1e7 * Math.random()) + "-" + Math.random().toString(16).replace(".", "") + "-" + String(31242 * Math.random()).replace(".", "").slice(0, 8);
  },
  // formdata == Obj ;  arg_separator == 分隔符（默认 '&'）
  HTTPBuildQuery(formdata, arg_separator) {
    let use_val, use_key, tmp_arr = [];
    if (_.isUndefined(arg_separator)) {
        arg_separator = '&';
    }

    for (let key in formdata) {
      let val = formdata[key]; 
      if (formdata.hasOwnProperty(key)) {
        use_val = encodeURIComponent(val.toString());
        use_key = encodeURIComponent(key);
        tmp_arr[tmp_arr.length] = use_key + '=' + use_val;
      }
    }
    return tmp_arr.join(arg_separator);
  },  
  isJSONString(str) {
    try {
      JSON.parse(str);
    } catch (e) {
      return false;
    }
    return true;
  },
    
  console() {
    if ("object" == typeof console && console.log) 
    try {
	  return console.log.apply(console, arguments)
	} catch (t) {
	  console.log(arguments[0]);
	}    
  },  
  // sdk本地缓存
  localStorage: {
    SDKAPI: {
      nameSpace: {},
      getStorageSync(){},
      setStorageSync() {}
    },
    _state: {},
    init(SDKAPI) {
      if (!SDKAPI) {
        return;
      }
      this.SDKAPI = SDKAPI;
      // 读取本地缓存
      const str = this.getStorage();
      this.toState(str);
    },
    setStorage(str) {
      this.SDKAPI.setStorageSync('Sdk_wechat', str);  
    },
    getStorage() {
      return this.SDKAPI.getStorageSync('Sdk_wechat') || "";
    },
    // 从本地缓存读取设备唯一id，若没有重新生成一个
    toState(str) {
      let state = null;
      if (_.isJSONString(str)) {
        state = JSON.parse(str);
        if (state.deviceUdid) {
          this._state = state;  
        } else {
          this.set('deviceUdid', _.UUID());
        }
      } else {
        this.set('deviceUdid', _.UUID());
      }
    },
    set(strName, data) {
      this._state = this._state || {};
      this._state[strName] = data;
      return this.save();  
    },
    get(strName) {
      return this._state[strName] || '';
    },
    save() {
      let saveComplete = {
        isOk: true,
        errorMsg: ''
      };
      try {
        // 同步存储
        const str = JSON.stringify(this._state);
        this.setStorage('Sdk_wechat', str);
        if (this.getStorage() !== str) {
          saveComplete.isOk = false;
          saveComplete.errorMsg = '保存后，重新获取不一致';
        }
       } catch (error) {
         saveComplete.isOk = false;
         saveComplete.errorMsg = error;
       }
       return saveComplete;
    }
  },
  // info 获取设备信息
  info: {
    SDKAPI: {
      nameSpace: {},
      getSystemInfo: function() {},
      getNetworkType: function() {}
    },
    properties: {},
    init(SDKAPI) {
      this.SDKAPI = SDKAPI;
    },
    // callback ，获取设备信息是异步过程，调用成功后的回调方法，外部设置该方法
    callback: function(properties) {},
    getSystem() {
      const getNetWork = () => {
        this.SDKAPI.getNetworkType({
          success: (res) => {
            this.properties.networkType = res.networkType;
          },
          // 调用结束的回调函数（调用成功、失败都会执行），获取设备网络信息后，再去获取其它设备信息（同步方式获取）
          complete: () => {
            this.SDKAPI.getSystemInfo({
              success: (res) => {
                // 手机型号
                this.properties.deviceModel = res.model;
                // 窗口宽度
                this.properties.screenWidth = Number(res.windowWidth);
                // 窗口高度
                this.properties.screenHeight = Number(res.windowHeight);
                // 系统版本
                this.properties.deviceOs = res.system ? res.system.split(" ")[0] : '';
                this.properties.deviceOsVersion = res.system ? res.system.split(" ")[1] : '';
                // 系统名：Android，iOS
                this.properties.devicePlatform = res.platform;
                // sdk版本号（当前暂用 weixinVersion 字段表示）
                this.properties.weixinVersion = res.version;
                // 本地语言
                this.properties.localeLanguage = res.language;
              },
              complete: () => {
                this.setStatusComplete();
              }
            });
          }
        });
      };
      

      getNetWork();
    },
    // 获取设备信息结束后的执行函数
    setStatusComplete() {
      _.localStorage.set('deviceProperties', this.properties);
      if (typeof this.callback === 'function') {
        this.callback(this.properties);
      }
    }
  }
};

var version = "1.xx";

/**
 * 开发约定： 对外 api 格式 :  mm_dd_ww()
 * 内部api 格式 : mmDdWw()
 * 
 */





//默认事件类型
const DATATYPE = 'e';
/**
 * 内置事件
 */
const DEFAULTEVENTID = {
  //表示会话开始事件
  'da_session_start': {
    'dataType': 'ie'
  },
  //表示会话结束事件
  'da_session_close': {
    'dataType': 'ie'
  },
  //通过用户登陆传入的 userId 信息来映射设备 ID, 用户登出事件
  'da_u_login': {
    'dataType': 'ie'
  },
  //用户登录事件
  'da_u_logout': {
    'dataType': 'ie'
  },
  //用户 ID 关联 绑定输入的 newUserId 和已有 userID，用户注册等同一用户 userId 变动场景。
  'da_u_signup': {
    'dataType': 'ie'
  },
  //用户属性设置内部事件
  'da_user_profile': {
    'dataType': 'ie'
  },
  //页面浏览事件，浏览是一大类用户交互集合，设计特定 dataType = “pv”
  'da_screen': {
    'dataType': 'pv'
  },
  //应用激活事件，应用第一次打开时发送
  'da_activate': {
    'dataType': 'ie'
  },
  // 发送数据异常错误
  'da_send_error': {
    'dataType': 'ie'
  },
  // 小程序分享转发
  'da_share': {
    'dataType': 'ie'
  },
  // 渠道推广：广告点击事件
  'da_ad_click': {
      'dataType': 'ie'
  },
  // abtest
  'da_abtest': {
    'dataType': 'ie'
  },
  // 小程序初始化完成时触发
  'da_onLaunch': {
    'dataType': 'ie'
  },
  // 小程序启动，或者从后台进入前台显示时触发
  'da_onShow': {
    'dataType': 'ie'
  }
};

const lLIBVERSION = version;

const SDKTYPE = {
  'wx': 'MiniProgram',
  'tt': 'toutiaoMiniProgram',
  'my': 'alipayMiniProgram',
  'swan': 'baiduMiniProgram'
};




// 定义sdk

class People {
  constructor(instance) {
    this.Sdk = instance;
  }
  /**
   * 设置自定义用户属性
   */
  set(properties, to, callback) {
    this.Sdk.peopleSet(properties, to, callback);
  }
  /**
   * 设置: 姓名
   */
  set_realname(realname) {
    this.Sdk.peopleSet({"$realName" : realname});
  }
  /**
   * 设置: 国家
   */
  set_country(country) {
    this.Sdk.peopleSet({"$country" : country});
  }
  /**
   * 设置：省份
   */
  set_province(province) {
    this.Sdk.peopleSet({"$region" : province});
  }
  /**
   * 设置：城市
   */
  set_city(city) {
    this.Sdk.peopleSet({"$city" : city});
  }
  /**
   * 设置：性别  0-女，1-男，2-未知
   */
  set_gender(gender) {
    if ([0,1,2].indexOf(gender) > -1) {
      this.Sdk.peopleSet({"$gender" : gender});
    }
  }
  /**
   * 设置：生日
   */
  set_birthday(birthday) {
    if(!_.checkTime(birthday)) {
      return
    }    this.Sdk.peopleSet({"$birthday" : birthday});
  }
  /**
   * 大集合：账户 + 姓名 + 生日 + 性别
   */
  set_populationWithAccount(account, realname, birthday, gender) {
    if(!account || !realname || !birthday || [0,1,2].indexOf(gender) === -1) {
      return;
    }
    if(!_.checkTime(birthday)) {
      return;
    } 
    //生日合法检测，yy-MM-dd
    this.Sdk.peopleSet({'$account': account, "$realName" : realname, "$birthday": birthday, "$gender": gender});
  }
  /**
   * 国家 + 省份 + 城市
   */
  set_location(country, region, city) {
    if(!country || !region || !city) {
      return;
    }
    this.Sdk.peopleSet({"$country" : country, "$region": region, "$city": city});
  }
}

class Sdk {
  
  // 根据配置的小程序类型，实际定义小程序api
  setSDKAPI(config) {
    let miniType = config.miniType || 'wx';
    // 微信
    if (miniType === 'wx') {
      this.SDKAPI.nameSpace = wx;
      this.SDKAPI.request = wx.request;
      this.SDKAPI.setStorageSync = wx.setStorageSync;
      this.SDKAPI.getStorageSync = wx.getStorageSync;
      this.SDKAPI.getSystemInfo = wx.getSystemInfo;
      this.SDKAPI.getNetworkType = wx.getNetworkType;
      this.SDKAPI.showToast = wx.showToast;
      this.SDKAPI.connectSocket = wx.connectSocket;
    } else 
    // 字节跳动
    if (miniType === 'tt') {
      this.SDKAPI.nameSpace = tt;
      this.SDKAPI.request = tt.request;
      this.SDKAPI.setStorageSync = tt.setStorageSync;
      this.SDKAPI.getStorageSync = tt.getStorageSync;
      this.SDKAPI.getSystemInfo = tt.getSystemInfo;
      this.SDKAPI.getNetworkType = tt.getNetworkType;
      this.SDKAPI.showToast = tt.showToast;
      this.SDKAPI.connectSocket = tt.connectSocket;
    }  else
    // 支付宝
    if (miniType === 'my') {
      this.SDKAPI.nameSpace = my;
      this.SDKAPI.request = my.canIUse('request') ? my.request : my.httpRequest;
      this.SDKAPI.setStorageSync = my.setStorageSync;
      this.SDKAPI.getStorageSync = my.getStorageSync;
      this.SDKAPI.getSystemInfo = my.getSystemInfo;
      this.SDKAPI.getNetworkType = my.getNetworkType;
      // TODO ，以下两个api使用方式需要修改
      //https://docs.alipay.com/mini/api/ui-feedback
      this.SDKAPI.showToast = my.showToast;
      this.SDKAPI.connectSocket = my.connectSocket;
    } else 
    // 百度
    if (miniType === 'swan') {
      this.SDKAPI.nameSpace = swan;
      this.SDKAPI.request = swan.request;
      this.SDKAPI.setStorageSync = swan.setStorageSync;
      this.SDKAPI.getStorageSync = swan.getStorageSync;
      this.SDKAPI.getSystemInfo = swan.getSystemInfo;
      this.SDKAPI.getNetworkType = swan.getNetworkType;
      this.SDKAPI.showToast = swan.showToast;
      this.SDKAPI.connectSocket = swan.connectSocket;
    }
  }

  constructor(SdkAgent) {
    this.SdkAgent = SdkAgent;
    this.config = {
      // 小程序类型：wx （微信）、tt（字节跳动）、my（支付宝）、swan（百度） 
      miniType: 'wx',
      apiHost: 'https://xxxx.com',
      debugHost: 'https://xxxx.com',
      appKey: '',
      userId: '',
      sessionStartTime: '',
      persistedTime: '',
      //最后一次触发事件，事件名称和触发时间
      lastEvent: {
          eventId: '',
          time: ''
      },
      //系统信息
      systemInfo: {},
      deviceUdid: '',
      debug: false,
      //传入的字符串最大长度限制
      maxStringLength: 255,
      trackLinksTimeout: 300,
      costTime: {},
      appVersion: '',
      //重新定义埋点的数据发送函数
      //fn ：重写发送的数据函数
      //start : 设置为true后，fn即启动，默认为false
      sendConfig: {
          start: false,
          //params: url, method, success, fail, data
          fn: function() {}
      },
      // 自动上报分享事件，所有页面都可以触发分享
      shareAll: false,
      share: true,
      // 自动修改 Page.onShareAppMessage 中的 path 属性
      allowAmendSharePath: false,
      // 用户行为事件的自定义通用属性
      superProperties: {}
    };
    // 使用的小程序api预定义，sdk初始化时根据小程序类型重新定义
    this.SDKAPI = {
      nameSpace: {},
      request: function() {},
      setStorageSync: function() {},
      getStorageSync: function() {},
      getSystemInfo: function() {},
      getNetworkType: function() {},
      showToast: function() {},
      connectSocket: function() {}
    };
    // 当前显示的页面实例 ，A/B实验需要
    this.curPageObj = null;
    // 获取系统信息完成标志（异步）,默认 false，未完成
    this.getSystemInfoComplete = false;
    //发送事件队列集合
    this.queue = [];
    // shareDepth、firstShareUid、lastShareUid、shareUrlPath 这四个字段表示分享信息
    this.shareDepth = 'notFromShare';
    this.firstShareUid = 'notFromShare';
    this.lastShareUid = 'notFromShare';
    this.shareUrlPath = 'notFromShare';
  }
  
  init(appKey, config) {
    this.setSDKAPI(config);
    _.localStorage.init(this.SDKAPI);
    _.info.init(this.SDKAPI);
    let localConfig = _.localStorage.get('config');
    // 本地缓存数据
    if(_.isJSONString(localConfig)) {
      localConfig = JSON.parse(localConfig);
      this['config'] = Object.assign({},this['config'], localConfig || {});
    }
    this['config'] = Object.assign({}, this['config'], config || {});
    this.getSystem();
    this.setConfig('appKey', appKey);
    const SdkAgent = this.SdkAgent;
    this.Agent = new SdkAgent(this, _);
    this.people = new People(this);    
  }

  /**
    * 信息保存到本地
    * 若失败，尝试保存，最多尝试2次
  */
  set() {
    let count = 0;
    const saveLocal = () => {
      const saveComplete = _.localStorage.set('config', JSON.stringify(this['config']));
      let errorMsg = saveComplete.errorMsg;
      // 当保存数据到本地失败后，重试后还失败上报异常数据
      if (!saveComplete.isOk) {
        if(2 > count) {
          count++;
          saveLocal();
        } else {
          // 尝试2次还是失败时，上报异常数据
          if (!_.isObject(errorMsg)) {
            errorMsg = {
              errorMsg: errorMsg
            };
          }
          this.daSendError(errorMsg);
        }
      }
    };
    saveLocal();
  }
  /**
   * 设置配置信息
   */
  setConfig(propName, propVal) {
    this['config'][propName] = propVal;
  }
  // 只设置一次的属性，再次设置旧值不会被覆盖
  setConfigOnce(propName, propVal) {
    if(!this.getConfig(propName)) {
      this.setConfig(propName, propVal);
      this.set();
    }
  }
  /**
    * 获取配置信息
   */
  getConfig(propName) {
    return this['config'][propName];
  }
  // 获取用户userId
  getUserId() {
    return this.getConfig('userId');
  }
  // 获取本地设备标识（唯一标识，若本地没有，sdk会自动生成）
  getDeviceUdid() {
    let localDeviceUdid = this.getConfig('deviceUdid');
    if(!localDeviceUdid) {
      localDeviceUdid = _.localStorage.get('deviceUdid');
      this.setConfig('deviceUdid', localDeviceUdid );
      this.set();
    }
    return localDeviceUdid;
  }
  // 获取系统信息并保存下来
  getSystem() {
    var self = this;
    _.info.callback = function(systemInfo) {
      self.getSystemInfoComplete = true;
      self.setConfig('systemInfo', systemInfo);
      self.set();
      if(self.queue.length > 0) {
        self.queue.map( item => {
          self.send.apply(self, Array.prototype.slice.call(item));
        } );
        self.queue = [];
      }
    };
    _.info.getSystem();
  }
  // 获取当前小程序的分享层级, （调用 getShareInfo 使用该方法）
  getShareDepth() {
    if (typeof this.shareDepth === 'number') {
      return this.shareDepth + 1;
    }
    return this.shareDepth;
  }
  //  获取首次发起分享的用户id
  getFirstShareUid() {
    // 规则：首先取传递过来的参数，若没有，说明当前用户是本次分享的发起者（假设当前用户有分享行为）
    return this.firstShareUid || this.getUserId() || this.getDeviceUdid();
  }
  // 获取上一次发起分享的用户， 这个方法只在当前用户触发分享事件的时候，开启后续追踪的时候调用，
  // 用来设置 $lastShareUid 字段的值
  getLastShareUid() {
    return this.lastShareUid || '';
  }

  // 设置传过来的分享的内容，当触发 appLaunch、appShow时调用
  setShareInfo(params, properties) {
    let sdkshare;
    const shareObj = {
      $shareUrlPath: 'notFromShare',
      $shareDepth: 'notFromShare',
      $firstShareUid: 'notFromShare',
      $lastShareUid: 'notFromShare'
    };
    if (!(params && _.isObject(params.query) && params.query.sdkshare)) {
      properties = Object.assign(properties, shareObj);
      return;
    }
    sdkshare = decodeURIComponent(params.query.sdkshare);
    if (!_.isJSONString(sdkshare)) {
      properties = Object.assign(properties, shareObj);
      return;
    }    sdkshare = JSON.parse(sdkshare);
    const $shareDepth = sdkshare.$shareDepth;
    const $shareUrlPath = sdkshare.$shareUrlPath;
    const $firstShareUid = sdkshare.$firstShareUid;
    const $lastShareUid = sdkshare.$lastShareUid;
    if (typeof $shareDepth === 'number') {
      this.shareDepth = $shareDepth;
      obj.$shareDepth = $shareDepth;
    }
    if (typeof $shareUrlPath === 'string') {
      this.shareUrlPath = $shareUrlPath;
      obj.$shareUrlPath = $shareUrlPath;
    }
    if (typeof $firstShareUid === 'string') {
      this.firstShareUid = $firstShareUid;
      obj.$firstShareUid = $firstShareUid;
    }
    if (typeof $lastShareUid === 'string') {
      this.lastShareUid = $lastShareUid;
      obj.$lastShareUid = $lastShareUid;
    }
  }
  // 获取分享的内容（触发 da_share事件时调用，将内容当做参数传递出去，注意：获取的值只是作为分享后续追踪的初始值）
  getShareInfo() {
    const shareInfo = {
      $firstShareUid: this.getFirstShareUid(),
      $lastShareUid: this.getUserId() || this.getDeviceUdid(),
      $shareUrlPath: this.getRoute(),
      $shareDepth: this.getShareDepth()
    };
    return shareInfo;
  }
  getScene() {
    return this.getConfig('scene');
  }
  
  // 设置当前页路径，不带参数
  setRoute(route) {
    //临时设置 route 地址，不保存到本地
    this.setConfig('route', route);
  }
  // 获取当前页路径
  getRoute() {
    return this.getConfig('route');
  }
  // 设置当前页url，带参数
  setUrl(route) {
    route = route ? route : this.getRoute();
    const pageParameStr = this.getPageParameter();
    if (pageParameStr) {
      this.setConfig('url', route + pageParameStr);
    } else {
      this.setConfig('url', route);
    }
  }
  // 获取当前页url, 带参数
  getUrl() {
    return this.getConfig('url');
  }
  // 返回当前页面参数str（暂时这么实现）
  getPageParameter() {
    const currentPagesArr = getCurrentPages() || [];
    const nowRoute = this.getRoute();
    let str = '';
    let page = currentPagesArr.find(itemPage => {
      return itemPage.route === nowRoute;
    });
    if (page) {
      let params = page.options || {};
      for(let key in params) {
        // sdkshare 为sdk的自动追踪后续分享的参数，并非用户页面的业务参数，这里要过滤掉。
        if (key !== 'sdkshare') {
          if (str === '') {
            str = '?' + key + '=' + params[key];
          } else {
            str += '&' + key + '=' + params[key];
          }
        }
      }    }
    return str;
  }
  // 设置当前页的 referrer （延续web端的概念）
  setReferrer(referrer) {
    if (_.isUndefined(referrer)){  
      referrer = this.getUrl();
    }
    this.setOldReferrer(this.getConfig('referrer'));
    this.setConfig('referrer', referrer);
  }
  // 获取当前页的 referrer （延续web端的概念）
  getReferrer() {
    return this.getConfig('referrer');
  }
  // 设置旧的 referrer （小程序后台切换到前台，page隐藏重新设置的referrer是本页 currentUrl，这时候 referrer是不对的，需要判断重新设置，此时需通过该旧的referrer设置值）
  setOldReferrer(referrer) {
    if (
      !_.isUndefined(referrer) &&
      this.getConfig('oldReferrer') !== referrer
      ) {
      this.setConfig('oldReferrer', referrer);
    }
  }
  repeatSetReferrer() {
    this.setConfig('referrer', this.getConfig('oldReferrer'));
  }
  // 设置场景值，需转化为string类型（数据库模型类型时string）
  setScene(scene) {
    if (
      typeof scene === 'number' ||
      (typeof scene === 'string' && scene !== '')
    ) {
      this.setConfig('scene', scene);
    }
  }
  // da_onLaunch 事件，应用唤醒的时候触发
  trackOnLaunch(properties) {
    // 若未开启分享后续追踪，发送分享后续追踪默认值
    if (!this.getConfig('allowAmendSharePath')) {
      properties = Object.assign({}, properties, {
        $firstShareUid: 'notFromShare',
        $lastShareUid: 'notFromShare',
        $shareDepth: 'notFromShare',
        $shareUrlPath: 'notFromShare'
      });
    } 
    this.track('da_onLaunch', properties);
  }
  // da_onShow 事件，应用唤醒的时候触发
  trackOnShow(properties) {
    // 若未开启分享后续追踪，发送分享后续追踪默认值
    if (!this.getConfig('allowAmendSharePath')) {
      properties = Object.assign({}, properties, {
        $firstShareUid: 'notFromShare',
        $lastShareUid: 'notFromShare',
        $shareDepth: 'notFromShare',
        $shareUrlPath: 'notFromShare'
      });
    } 
    this.track('da_onShow', properties);
  }
  // 设备激活事件
  daActivate() {
    let localDeviceUdid = this.getConfig('deviceUdid');
    if (!localDeviceUdid) {
      // 从本地获取
      localDeviceUdid = _.localStorage.get('deviceUdid');
      this.setConfig('deviceUdid', localDeviceUdid );
      this.track('da_activate');
      this.set();
    }
  }
  // 上报异常日志数据
  daSendError(error) {
    if (!error) {
      this.track('da_send_error', error);
    }
  }
  // 上报广告点击事件
  daAdClick() {
    this.track('da_ad_click');
  }
  // 会话开始 （延续web端的sdk概念）
  sessionStart() {
    //如果上次的session close未发送，再次发送
    if(this.getConfig('sessionUuid')) {
      this.sessionClose();
    }
    this.setConfig('sessionUuid', _.UUID());
    this.setConfig('sessionStartTime', new Date().getTime());
    this.track('da_session_start');
  }

  // 会话结束（延续web端的sdk概念）
  sessionClose() {
    const sessionStartTime = this.getConfig('sessionStartTime');
    const lastEvent = this.getConfig('lastEvent') || {
      time: new Date().getTime(),
      eventId: ''
    };
    const sessionCloseTime = lastEvent.time;
    const sessionTotalLength = sessionCloseTime - sessionStartTime;
    this.track('da_session_close', {
      sessionCloseTime: sessionCloseTime,
      sessionTotalLength: sessionTotalLength
    });
    this.setConfig('sessionUuid', '');
  }
  // 将需要监听的事件（事件耗时）保存到队列里
  setEventTimer(eventName, timestamp) {
    const timers = this.getConfig('costTime') || {};
    timers[eventName] = timestamp;
    this.setConfig('costTime', timers);
  }
  // 移除监听某个事件的耗时（结束时候调用）
  removeEventTimer(eventName) {
    let timers = this.getConfig('costTime') || {};
    const timestamp = timers[eventName];
    if(!_.isUndefined(timestamp)) {
      delete timers[eventName];
      this.setConfig('costTime', timers);
    }
    return timestamp;
  }
  // 统计事件耗时(ms)，参数为事件名称。触发一次后移除该事件的耗时监听
  time_event(eventName) {
    if(_.isUndefined(eventName)) {
      _.console('必须传入事件名称');
      return;
    }
    this.setEventTimer(eventName, new Date().getTime());
  }
  // 用户行为事件的通用属性设置，保存到本地缓存
  register_attributes(properties) {
    if (_.isObject(properties)) {
      let superProperties = this.getConfig('superProperties') || {};
      superProperties = Object.assign({}, superProperties, properties);
      this.setConfig('superProperties', superProperties);
      this.set();
    }
  }
  // 用户行为事件的通用属性设置（不覆盖之前的）
  register_attributes_once(properties) {
    if(_.isObject(properties)) {
      let superProperties = this.getConfig('superProperties') || {};
      superProperties = _.extend({}, properties, superProperties);
      this.setConfig('superProperties', superProperties);
      this.set();
    }
  }
  // 查看当前已设置的用户行为事件的通用属性
  current_attributes(callback) {
    if(typeof callback === 'function') {
      callback(this.getConfig('superProperties') || {});
    }
  }
  // 删除一个用户行为事件的通用属性
  unregister_attributes(propertyName) {
    if(typeof propertyName === 'string') {
      let superProperties = this.getConfig('superProperties') || {};
      delete superProperties[propertyName];
      this.setConfig({'superProperties': superProperties});
      this.set();
    }
  }
  // 删除所有已设置的用户行为事件的通用属性
  clear_attributes() {
    this.setConfig('superProperties', {});
    this.set();
  }
  // 获取本地设备标识
  get_distinct_id() {
    return this.getDeviceUdid();
  }
  // 获取当前已设置的用户id
  get_user_id() {
    return this.getUserId();
  }
  // 用户注册
  signup(userId) {
    let oldUserId = this.getConfig('userId');
    if (_.isUndefined(oldUserId)) {
      oldUserId = '';
    }
    // 这里不判断数据类型
    if(oldUserId == userId){
      return;
    }
    this.setConfig('userId', userId);
    // 保存到本地缓存
    this.set();
    this.track('da_u_signup',{
      "oldUserId": oldUserId,
      "newUserId": userId
    });
  }
  // 用户登录记住用户名
  login(userId, callback) {
    // 用户调用登陆接口时，内部自动调用用户注册，无需用户手动判断调用（降低用户学习概念成本）
    this.signup(userId);
    this.track('da_u_login',{}, callback);
  }
  // 用户退出，清除用户真实id ,这里的
  logout(callback) {
    this.setConfig('userId', '');
    this.set();
    let hasCalled = false;
    function trackCallback() {
      if(!hasCalled) {
        hasCalled = true;
        if(typeof callback === 'function') {
          callback();
        }
      }
    }
    //如果没有回调成功，设置超时回调
    setTimeout(trackCallback, this.getConfig('trackLinksTimeout'));
    this.track('da_u_logout', {}, trackCallback);
  }
  // da_share 事件 , channel 表示当前分享是那种（抖音小程序的字段：视频分享（拍抖音）、正常分享，具体查看官方文档）
  track_share(properties, channel, callback) {
    // 若未开启分享后续追踪，发送分享后续追踪默认值
    if (!this.getConfig('allowAmendSharePath')) {
      properties = Object.assign({}, properties, {
        $firstShareUid: 'notFromShare',
        $lastShareUid: 'notFromShare',
        $shareDepth: 'notFromShare',
        $shareUrlPath: 'notFromShare'
      });
    } 
    if (channel) {
      properties.$channel = channel;
    } else {
      delete properties.$channel;
    } 
    this.track('da_share', properties, callback);
  }
  // 触发da_screen事件（PV事件）
  track_pageview(properties, callback) {
    this.track('da_screen', properties || {}, callback);
  }  
  // 发送事件（自定义事件和内置事件，都是通过该方法处理）
  track(eventName, properties, callback) {
    properties = properties || {};
    let dataType = DATATYPE;
    let otherProperties = {};
    let userSetProperties =  JSON.parse( JSON.stringify(properties) );
    //事件耗时(ms)
    let startTimestamp = this.removeEventTimer(eventName);
    if(!_.isUndefined(startTimestamp)) {
      otherProperties['costTime'] = new Date().getTime() - startTimestamp;
    }
    //如果是内置事件,事件类型重新设置
    if(DEFAULTEVENTID[eventName]) {
      dataType = DEFAULTEVENTID[eventName].dataType;
    }
    //时间
    let time = new Date().getTime();
    //事件为 da_session_close
    //自定义属性中删除不需要的属性
    if(eventName == 'da_session_close') {
      time = properties.sessionCloseTime;
      delete userSetProperties['sessionCloseTime'];
      delete userSetProperties['sessionTotalLength'];
    }
    //事件为 da_session_start
    if(eventName == 'da_session_start') {
      time = this.getConfig('sessionStartTime');
    }

    this.setConfigOnce('persistedTime', time);

    // 自定义属性：合并用户自定义通用属性，优先级：单次自定义属性优先级高于通用自定义属性
    userSetProperties = Object.assign({}, this.getConfig('superProperties'), userSetProperties);

    let data = {
      'dataType': dataType,
      'eventId': eventName,
      'appKey': this.getConfig('appKey'),
      'sessionUuid': this.getConfig('sessionUuid'),
      'userId': this.getConfig('userId'),
      'currentUrl': this.getUrl(),
      'sdkVersion': lLIBVERSION,
      'sdkType': SDKTYPE[this.getConfig('miniType')],
      'sessionTotalLength': properties.sessionTotalLength || '',
      'time': time,
      'persistedTime': this.getConfig('persistedTime'),
      'deviceUdid': this.getDeviceUdid(),
      'urlPath': this.getRoute(),
      'referrer': this.getReferrer(),
      'attributes': userSetProperties
    };
    if(!_.isUndefined(otherProperties['costTime'])) {
      data['costTime'] = otherProperties['costTime'];
    }
    this.send({'data': data}, callback);

    //最后一次触发的事件，解决
    //session_close 事件的时间计算
    if(['da_session_close','da_session_start'].indexOf(eventName) === -1) {
      this.setConfig('lastEvent', {
        eventId: eventName,
        time: time
      });
    }
  }


  // http日志上报到平台
  send(data, callback) {
    // 等待获取设备信息回调成功，这期间触发的事件日志保存到本地队列
    if (!this.getSystemInfoComplete) {
      this.queue.push(arguments);
      return false;
    }
    // 是否处于实时调试中（日志调试）
    let isDebug = false;
    let isUpload = false;
    if (this['debug']) {
      isDebug = this['debug'].has_in_debug();
      isUpload = this['debug'].has_upload();
    }

    let count = 0;
    let url = this.getConfig('apiHost') + '/track/w/';
    const systemInfo = this.getConfig('systemInfo');
        
    let basicInfo = {
      'deviceOs': systemInfo.deviceOs,
      'deviceOsVersion': systemInfo.deviceOsVersion,
      'devicePlatform': systemInfo.devicePlatform,
      'weixinVersion': systemInfo.weixinVersion,
      'screenWidth':  systemInfo.screenWidth,
      'screenHeight': systemInfo.screenHeight,
      'deviceModel':  systemInfo.deviceModel,
      'networkType': systemInfo.networkType,
      'localeLanguage': systemInfo.localeLanguage,
      'appVersion': this.getConfig('appVersion'),
      'scene': this.getScene()
    };
        
    // 若数据需要上传到日志系统，那么公共字段添加 isDebug = '1'
    if (isUpload) {
      basicInfo.isDebug = '1';
    }
    try{
      basicInfo = Object.assign(basicInfo, this['campaign'] && this['campaign'].get_campaign_params() || {});
    }
    catch(e) {
      console.error(e);
    }

    Object.assign(data.data, basicInfo);
    const truncatedData = _.truncate(data['data'], this.getConfig('maxStringLength'));
        
    // 数据只上报到平台
    if (isDebug) {
      this['debug'].log(truncatedData); 
    }
    // 处于实时调试中且不上报到日志系统
    if (isDebug && !isUpload) {
      return;
    }

    const jsonData  = JSON.stringify(truncatedData);
    const encodedData  = _.base64Encode(jsonData);
    const appkeyData = _.sha1(this.getConfig('appKey'));
    if(this.getConfig('debug')) {
      _.console(truncatedData);
    }
    data['data'] = encodedData;  
    data['_'] = new Date().getTime().toString();
    data['appKey'] = appkeyData;
    url += '?' + _.HTTPBuildQuery(data);
    const self = this; 
    const sendData = function() {
      self.SDKAPI.request({
        url: url,
        method: "GET",
        success: function(res) {
          if(typeof callback === 'function') {
            callback(res, truncatedData);
          }
        },
        fail: function(e) {
          _.console("发送错误，重新发送"); 
          if(2 > count) {
            count++;
            sendData();
          } else {
            if(typeof callback === 'function') {
              callback(e, truncatedData);
            }
          }
        }
      });
    };
    // 外部配置了接管日志发送
    if( this.getConfig('sendConfig').start ) {
      if(typeof this.getConfig('sendConfig').fn === 'function') {
        const successFn = function(res) {
          if(typeof callback === 'function') {
            callback(res, truncatedData);
          }
        };
        const failFn = function(e) {
          _.console("发送错误，重新发送");
          if(typeof callback === 'function') {
            callback(e, truncatedData);
          }
        };
        this.getConfig('sendConfig').fn({url: url, method: 'GET', success: successFn, fail: failFn, data: _.HTTPBuildQuery(data)});
      }
    } else {
      sendData();
    }
  }


  /**
   * 发送用户属性
   * 
   * peopleSet.set('gender', '男');
   * or
   * peopleSet.set({'gender':'男'});
   */
  peopleSet(properties, to, callback) {
    var data = {
        'dataType': 'ie',
        'appKey': this.getConfig('appKey'),
        'deviceUdid': this.getDeviceUdid(),
        'userId': this.getConfig('userId'),
        'time': new Date().getTime(),
        'sdkType': SDKTYPE,
        'eventId': 'da_user_profile',
        'persistedTime': this.getConfig('persistedTime')
    };
    var $set = {
        '$userProfile': {
            '$type': 'profile_set'
        }
    };
    if(_.isObject(properties)) {
        _.each(properties, function(v, k) {
            $set['$userProfile'][k] = v;
        }, this);
        callback = to;
    } else {
        $set['$userProfile'][prop] = to;
    }
    data['attributes'] = $set;
    this.send({'data': data}, callback);
  }

}

/**
 * 微信小程序、百度小程序、字节跳动小程序、支付宝小程序 打包 入口
 */

var load = new Sdk(SdkAgent);

export default load;
/* 关注sdk平台:https://xxxxx.com; 有问题请联系我：wangyang  */