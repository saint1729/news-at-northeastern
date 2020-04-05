'use strict';

function makeStruct(fields) {
    fields = fields.split(' ');
    let count = fields.length;

    function constructor() {
        for (let i = 0; i < count; i++) {
            this[fields[i]] = arguments[i];
        }
    }

    return constructor;
}

let Article = makeStruct("articleSlug articlePubYear articlePubMonth articlePubDay articleURL articleImageURL articleHeading articleDesc articleAuthor articlePubDate");
const rootURL = "http://news.northeastern.edu/archive/page/";

function getArticles(responseText) {
    let articles = [];
    let parser = new DOMParser();
    let doc = parser.parseFromString(responseText, "text/html");
    let articleTagNodes = doc.getElementsByClassName("index__posts-container")[0].getElementsByClassName("tease");
    let articleTagList = Array.prototype.slice.call(articleTagNodes);
    let x = 1;
    articleTagList.forEach(articleTag => {
        let image = articleTag.getElementsByTagName("img")[0];
        let articleImageURL = image.src;
        let articleInfo = articleTag.getElementsByClassName("hp__tease_text")[0];
        let articleURL = articleInfo.href;
        let articleHeading = articleInfo.getElementsByClassName("tease__hed__link")[0].innerText;
        let articleURLTokens = articleURL.split("/");
        let n = articleURLTokens.length;
        let articleFooter = articleTag.getElementsByClassName("hp-topic__tease__meta-item--author")[0].innerText.split("    ");
        let articleAuthor = articleFooter[0].trim();
        let articlePubDate = articleFooter[1].trim();
        let articleDesc = articleInfo.getElementsByClassName("tease__dek")[0].innerText;
        let article = new Article(articleURLTokens[n - 2], articleURLTokens[n - 5], articleURLTokens[n - 4],
            articleURLTokens[n - 3], articleURL, articleImageURL, articleHeading, articleDesc, articleAuthor, articlePubDate);
        // console.log(article);
        articles.push(article);
    });
    return articles;
}

function createNotifications(oldArticles) {

    // if (oldArticles) {
    //     console.log(oldArticles.length);
    // } else {
    //     console.log(0);
    // }

    var req = new XMLHttpRequest();
    var page1URL = rootURL + "1";

    req.open("GET", page1URL, true);

    req.onload = function () {
        if (req.readyState === 4) {
            if (req.status === 200) {
                let latestArticles = getArticles(req.responseText);

                chrome.storage.local.set({
                    articles: latestArticles
                }, function () {
                    // if (oldArticles) {
                    //     oldArticles.splice(0, 2);
                    // }
                    if ((oldArticles) && (latestArticles) && (oldArticles.length > 0) && (latestArticles.length > 0)) {
                        let i = 0, newArticleLength;
                        if (latestArticles[0].articleSlug !== oldArticles[0].articleSlug) {
                            for (newArticleLength = latestArticles.length; i < newArticleLength; i++) {
                                if (latestArticles[i].articleSlug !== oldArticles[0].articleSlug) {
                                    chrome.notifications.create({
                                        type: 'basic',
                                        iconUrl: './images/icon128.png',
                                        title: latestArticles[i].articleHeading,
                                        message: latestArticles[i].articleDesc,
                                        priority: 0
                                    });
                                } else {
                                    break;
                                }
                            }
                        }
                        // console.log("number of notifications = " + i);
                    }
                });
            }
        }
    };

    // req.setRequestHeader('Accept', 'application/json,application/xml');
    req.send();
}

chrome.storage.local.get(['articles'], function (data) {
    let articles = data.articles;
    if (articles === undefined) {
        createNotifications(articles);
    }
});

chrome.alarms.create("News @ Northeastern Alarm", {
    periodInMinutes: 1
});

chrome.alarms.onAlarm.addListener(function () {
    chrome.browserAction.setBadgeText({
        text: ''
    });
    chrome.storage.local.get(['articles'], function (data) {
        var articles = data.articles;
        createNotifications(articles);
    });

});
