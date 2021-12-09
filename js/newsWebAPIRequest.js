/*
    Méthodes d'accès aux services Web API News
 */

const apiBaseURL= "http://localhost:5000";
//onst apiBaseURL= "https://ripe-phrygian-stoat.glitch.me/api/bookmarks";

function webAPI_getNews( successCallBack, errorCallBack) {
    $.ajax({
        url: apiBaseURL + "/api/news",
        type: 'GET',
        contentType:'text/plain',
        data:{},
        success: news => { successCallBack(news);
            console.log("webAPI_getNews - success");},
        error: function(jqXHR, textStatus, errorThrown) {
            errorCallBack(errorThrown);
            console.log("webAPI_getNews - error");
        }
    });
}

function webAPI_getSingleNews(id, successCallBack, errorCallBack) {
    $.ajax({
        url: apiBaseURL + "/api/news/" + id,
        type: 'GET',
        contentType:'text/plain',
        data:{},
        success: news => { successCallBack(news); 
            console.log("webAPI_getSingleNews - success");},
        error: function(jqXHR, textStatus, errorThrown) {
            errorCallBack(errorThrown);
            console.log("webAPI_getSingleNews - error");
        }
    });
}

function webAPI_getNewsParams(params, successCallBack, errorCallBack) {
    $.ajax({
        url: apiBaseURL + "/api/news?" + params,
        type: 'GET',
        contentType:'text/plain',
        data:{},
        success: news => { successCallBack(news);
            console.log("webAPI_getNewsParams - success");},
        error: function(jqXHR, textStatus, errorThrown) {
            errorCallBack(jqXHR.status);
            console.log("webAPI_getNewsParams - error");
        }
    });
}

function webAPI_addNews(news, successCallBack, errorCallBack) {
    $.ajax({
        url: apiBaseURL + "/api/news/",
        type: 'POST',
        headers: getBearerAuthorizationToken(),
        contentType:'application/json',
        data: JSON.stringify(news),
        success: () => {successCallBack();  
            console.log("webAPI_addNews - success");},
        error: function(jqXHR, textStatus, errorThrown) {
            errorCallBack(jqXHR.status);
            console.log("webAPI_addNews - error");
        }
    });
}

function webAPI_modifyNews(news, successCallBack, errorCallBack) {
    $.ajax({
        url: apiBaseURL + "/api/news/" + news.Id,
        type: 'PUT',
        headers: getBearerAuthorizationToken(),
        contentType:'application/json',
        data: JSON.stringify(news),
        success:() => {successCallBack();  
            console.log("webAPI_modifyNews - success");},
        error: function(jqXHR, textStatus, errorThrown) {
            errorCallBack(jqXHR.status);
            console.log("webAPI_modifyNews - error");
        }
    });
}

function webAPI_deleteNews(id, successCallBack, errorCallBack) {
    $.ajax({
        url: apiBaseURL + "/api/news/" + id,
        contentType:'text/plain',
        type: 'DELETE',
        headers: getBearerAuthorizationToken(),
        success:() => {successCallBack();  
            console.log("webAPI_deleteNews - success");},
        error: function(jqXHR, textStatus, errorThrown) {
            errorCallBack(errorThrown);
            console.log("webAPI_deleteNews - error");
        }
    });
}

function webAPI_GET_ETAG(successCallBack, errorCallBack) {
    $.ajax({
        url: apiBaseURL + "/api/news",
        type: 'HEAD',
        contentType:'text/plain',
        complete: function(request) { 
            successCallBack(request.getResponseHeader('ETag'));
        },
        error: function(jqXHR, textStatus, errorThrown) {
            errorCallBack(jqXHR.status);
            console.log("webAPI_GET_ETAG - error");
        }
    });
}

// LOGIN SYSTEM

function tokenRequestURL() {
    return apiBaseURL + '/token';
}

function storeAccessToken(token) {
    localStorage.setItem('access_Token', token);
}

function eraseAccessToken() {
    localStorage.removeItem('access_Token');
}

function retrieveAccessToken() {
    return  localStorage.getItem('access_Token');
}

function getBearerAuthorizationToken() {
    return { 'Authorization': 'Bearer ' + retrieveAccessToken() };
}

function registerRequestURL() {
    return apiBaseURL + '/accounts/register';
}

function storeLoggedUser(user) {
    localStorage.setItem('user', JSON.stringify(user));
}

function retrieveLoggedUser() {
    return JSON.parse(localStorage.getItem('user'));
}

function deConnect() {
    localStorage.removeItem('user');
    eraseAccessToken();
}

function webAPI_Register(profil, successCallBack, errorCallBack){
    $.ajax({
        url: apiBaseURL + "/accounts/register",
        type: 'POST',
        contentType:'application/json',
        data: JSON.stringify(profil),
        success: function () {
            successCallBack();
        },
        error: function(jqXHR) {
            errorCallBack(jqXHR.status);
            console.log("webAPI_register - error");
        }
    })
}

function webAPI_ChangeProfil( profil , successCallBack, errorCallBack) {
    $.ajax({
        url: apiBaseURL + "/accounts/change",
        type: 'PUT',
        headers: getBearerAuthorizationToken(),
        contentType:'application/json',
        data: JSON.stringify(profil),
        success: () => {
            webAPI_getUserInfo(profil.Id, successCallBack, errorCallBack);
        },
        error: function(jqXHR, textStatus, errorThrown) {
            errorCallBack(jqXHR.status);
            console.log("webAPI_POST - error");
        }
    });
}

function webAPI_login( Email, Password, successCallBack, errorCallBack) {
    $.ajax({
        url: tokenRequestURL(),
        contentType:'application/json',
        type: 'POST',
        data: JSON.stringify({Email, Password}),
        success: function (profil) {
            storeAccessToken(profil.Access_token);
            webAPI_getUserInfo(profil.UserId, successCallBack, errorCallBack);
        },
        error: function(jqXHR, textStatus, errorThrown) {  
            errorCallBack(jqXHR.status);
            console.log("webAPI_login - error");
        }
    })
}

function webAPI_getUserInfo(userId, successCallBack, errorCallBack) {
    $.ajax({
        url: apiBaseURL + "/accounts/index/" + userId,
        type: 'GET',
        contentType:'text/plain',
        data:{},
        success: function (profil) {
            storeLoggedUser(profil);
            successCallBack();
        },
        error: function(jqXHR) {  
            errorCallBack(jqXHR.status);
            console.log("webAPI_login - error");
        }
    })
}

function webAPI_getAllUsers(successCallBack, errorCallBack) {
    $.ajax({
        url: apiBaseURL + "/accounts/index",
        type: 'GET',
        contentType:'text/plain',
        data:{},
        success: function (profil) {
            successCallBack(profil);
        },
        error: function(jqXHR) {  
            errorCallBack(jqXHR.status);
            console.log("webAPI_getAllUsers - error");
        }
    })
}

function webAPI_logout(userId, successCallBack, errorCallBack) {
    $.ajax({
        url: apiBaseURL + "/accounts/logout/" + userId,
        contentType:'application/json',
        type: 'POST',
        data: JSON.stringify({Id: userId}),
        headers: getBearerAuthorizationToken(),
        success:() => {
            deConnect();
            successCallBack(); 
        },
        error: function(jqXHR) {
            deConnect();
            errorCallBack(jqXHR.status);
            console.log("webAPI_logout - error");
        }
    });
}

function webAPI_DELETE_Account( id, successCallBack, errorCallBack) {
    $.ajax({
        url: apiBaseURL + "/accounts/remove/" + id,
        contentType:'text/plain',
        type: 'DELETE',
        headers: getBearerAuthorizationToken(),
        success:() => {localStorage.clear(); successCallBack(); },
        error: function(jqXHR) {
            errorCallBack(jqXHR.status);
            console.log("webAPI_DELETE_Account - error");
        }
    });
}