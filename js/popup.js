function getArticles() {

    chrome.storage.local.get(['articles'], function (data) {
        let articles = data.articles;

        let articleSection = document.getElementById("articles");

        if (articleSection) {
            if (articles) {
                let i, len, articleNotifications;
                articleNotifications = "";
                for (i = 0, len = articles.length; i < len; i++) {
                    let articleURL = articles[i].articleURL;
                    // console.log(articles[i].articleAuthor);
                    articleNotifications += "<div class=\"article\">" +
                        "<div class=\"articleLeft\">" +
                        "<a href=\"" + articles[i].articleURL + "\">" +
                        "<img class=\"articleImage\" src=\"" + articles[i].articleImageURL + "\" />" +
                        "</a>" +
                        "</div>" +
                        "<div class=\"articleRight\">" +
                        "<a href=\"" + articleURL + "\">" +
                        "<h5>" +  articles[i].articleHeading + "</h5>" +
                        "</a>" +
                        "<div class=\"footer\">" +
                        "<div>" + articles[i].articleAuthor + "</div>" +
                        "<div>" + articles[i].articlePubDate + "</div>" +
                        "</div>" +
                        "</div>" +
                        "</div>";
                }

                if ((articleNotifications) && (articleNotifications !== "")) {
                    articleSection.innerHTML = articleNotifications;
                } else {
                    articleSection.innerHTML = "<div class=\"alert-warning\">Notifications still loading in the background. Please try after 1 minute. If you still face issues after that reach out to <a href=\"mailto:tsnlegend@gmail.com?Subject=StevenSEO%20Chrome%20Extension%20Issue\" target=\"_top\">tsnlegend@gmail.com</a>. It would be very helpful if you can attach any error log found in <a href=\"chrome://extensions\" target=\"_top\">extensions</a> tab.</div>";
                }
            } else {
                articleSection.innerHTML = "<div class=\"alert-warning\">Notifications still loading in the background. Please try after 1 minute. If you still face issues after that reach out to <a href=\"mailto:tsnlegend@gmail.com?Subject=StevenSEO%20Chrome%20Extension%20Issue\" target=\"_top\">tsnlegend@gmail.com</a>. It would be very helpful if you can attach any error log found in <a href=\"chrome://extensions\" target=\"_top\">extensions</a> tab.</div>";
            }
        }
    });
}

getArticles();

$(document).ready(function () {
    $('body').on('click', 'a', function () {
        chrome.tabs.create({
            url: $(this).attr('href')
        });
        return false;
    });
});


document.getElementById('getArticles').addEventListener('click', getArticles());

