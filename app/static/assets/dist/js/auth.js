/**
 * DevSummit Auth API client
 * designed to interact with auth Rest-API of Devsummit, using AJAX
 * will be used across all the web app (admin) interfaces
 * 
 * by @erdivartanovich
 */

var script = document.createElement('script');

script.src = '//code.jquery.com/jquery-1.11.0.min.js';
document.getElementsByTagName('head')[0].appendChild(script); 

(function (global) {
    'use strict';
    
    const baseStorage = 'devsummitadmin';

    function storeCredential(data){
      Object.keys(data).map((key)=>{
        localStorage.setItem(baseStorage+'-'+key, data[key]);
      })
    }

    function clearCredential(){
        localStorage.removeItem(baseStorage+'-access_token');
        localStorage.removeItem(baseStorage+'-refresh_token');
    }

    var DevsummitAuth = {}

    DevsummitAuth.acess_token = function() {
        const token = !!localStorage[baseStorage+'-access_token'] ? localStorage[baseStorage+'-access_token'] : '';
        return token;
    }
    DevsummitAuth.refresh_token = function() {
        const refresh = !!localStorage[baseStorage+'-refresh_token'] ? localStorage[baseStorage+'-refresh_token'] : '';
        return refresh;
    }

    /* Login func */
    DevsummitAuth.login = function(payloads, onSuccess) {
        $.ajax({
            url : "/auth/login",
            type: "POST",
            data: JSON.stringify(payloads),
            contentType: "application/json; charset=utf-8",
            dataType   : "json",
            success    : function(result){
                const success=result['meta']['success']
                if (success) {
                    var data = result['data']
                    //store token and refresh token
                    storeCredential(data);
                    //store user data
                    data = result['included'];
                    storeCredential(data);
                }
                onSuccess(success, result);
            }
        });
    };

    /* logout func */
    DevsummitAuth.logout = function() {
        clearCredential();
        window.location.reload(true);
    }

    /* isLogin func */
    DevsummitAuth.isLogin = function() {
        return (!!DevsummitAuth.acess_token())
    }

    /* get user data */
    DevsummitAuth.getUser = function(source='storage') {
        var user = {};
        if (source='storage') {
            user.first_name = localStorage[baseStorage+'-first_name'];
            user.last_name = localStorage[baseStorage+'-last_name'];
            user.username = localStorage[baseStorage+'-username'];
            user.role_id = localStorage[baseStorage+'-role_id'];
            user.id = localStorage[baseStorage+'-id'];
            user.avatar = localStorage[baseStorage+'-url'];
            user.email = localStorage[baseStorage+'-email'];
            user.created_at = localStorage[baseStorage+'-created_at'];
        }
        return user;
    }

    // set module alias
    window.DevsummitAuth = window.dsa = DevsummitAuth; 

    // AMD support
    if (typeof define === 'function' && define.amd) {
        define(function () { return DevsummitAuth; });
    // CommonJS and Node.js module support.
    } else if (typeof exports !== 'undefined') {
        // Support Node.js specific `module.exports` (which can be a function)
        if (typeof module !== 'undefined' && module.exports) {
            exports = module.exports = DevsummitAuth;
        }
        // But always support CommonJS module 1.1.1 spec (`exports` cannot be a function)
        exports.DevsummitAuth = DevsummitAuth;
    } else {
        global.DevsummitAuth = DevsummitAuth;
    }
})(this);