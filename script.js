(function() {
    var nextUrl = "https://elegant-croissant.glitch.me/spotify";
    var query = "";
    var select = "";
    var resultloop = true;

    $(document).on("click", "#gobutton", function() {
        query = $("input").val();
        select = $("select").val();

        getResults(query, select, nextUrl);
    });

    $(document).on("click", "#load", function(e) {
        $(e.target).addClass("visibil");
        getResults(query, select, nextUrl);
        resultloop = false;
    });

    function result(data) {
        data = data.artists || data.albums;
        var resultHtml = "";
        var imgLink = "";

        if (data.items.length > 0) {
            resultHtml = '<div class="results">';

            if (resultloop) {
                resultHtml +=
                    '<div class="resultwrite"><h2>Results for "' +
                    $("input").val() +
                    '"</h2></div>';
            }
            for (var i = 0; i < data.items.length; i++) {
                if (data.items[i].images.length > 0) {
                    imgLink = data.items[i].images[0].url;
                } else {
                    imgLink = "default.jpg";
                }
                resultHtml += '<div class="result">';
                resultHtml += '<div class="pic">';
                resultHtml += '<a href="' + imgLink + '" target="_blank">';
                resultHtml += '<img src="' + imgLink + '" alt="">';
                resultHtml += "</div>";
                resultHtml +=
                    '<div class="name"><a href="' +
                    data.items[i].external_urls.spotify +
                    '" target="_blank"><p>' +
                    data.items[i].name +
                    "</p></a></div>";
                resultHtml += "</div>";
            }
            resultHtml += "</div>";

            nextUrl = data.next;

            if (nextUrl) {
                nextUrl = nextUrl.replace(
                    "https://api.spotify.com/v1/search",
                    "https://elegant-croissant.glitch.me/spotify"
                );
                query = "";
                select = "";
                resultloop = false;

                if (location.search.indexOf("scroll=infinite") == -1) {
                    resultHtml +=
                        '<div id="load" class="button"><p>Load more</p></div>';
                }
            }

            $("main").append(resultHtml);
        } else {
            resultHtml = '<div class="results">';
            resultHtml +=
                '<div class="resultwrite"><h2>Search for "' +
                $("input").val() +
                '" has no results</h2></div>';
            $("main").append(resultHtml);
        }
    }

    function getResults(query, select, nextUrl) {
        $.ajax({
            url: nextUrl,
            data: {
                q: query,
                type: select
            },
            method: "GET",
            success: function(data) {
                result(data);
                if (location.search.indexOf("scroll=infinite") > -1) {
                    checkInfinitiScroll();
                }
            }
        });
    }

    var timeoutId;
    function checkInfinitiScroll() {
        clearTimeout(timeoutId);

        if (
            $(document).scrollTop() + $(window).height() >=
            $(document).height() - $(window).height()
        ) {
            getResults(query, select, nextUrl);
        } else {
            timeoutId = setTimeout(checkInfinitiScroll, 2000);
        }
    }
})();
