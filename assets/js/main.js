// Wait until the page has loaded
if (
    document.readyState === "interactive" ||
    document.readyState === "complete"
) {
    document.dispatchEvent(new CustomEvent("o.DOMContentLoaded"));

    /*==========================
                                              ajax request
                                                    ===================================*/
    function Ajax_request() {
        if (window.XMLHttpRequest) {
            // Mozilla, Safari, ...
            xmlhttp = new XMLHttpRequest();
        } else if (window.ActiveXObject) {
            // IE
            try {
                xmlhttp = new ActiveXObject("Msxml2.XMLHTTP");
            } catch (e) {
                try {
                    xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
                } catch (e) {}
            } //catch
        } //else if
        if (!xmlhttp) {
            alert("Giving up : Cannot create an XMLHTTP instance");
        }
        return xmlhttp;
    }
    /*==========================
                  functions for creating DOM elements
                  ===================================*/
    //to create DOM elements
    let createElementFunc = function(elementType) {
        return document.createElement(elementType);
    };
    //to create text node
    let createTextContentFunc = function(text) {
        return document.createTextNode(text);
    };
    //to assign attribute to node elements
    let setElementAttribute = function(element, attribute, value) {
        element.setAttribute(attribute, value);
    };
    let nextPageButton = document.getElementById("nextPage");

    if (nextPageButton !== null) {
        document.getElementById("nextPage").addEventListener("click", e => {
            var query = document.getElementById("nextPage").getAttribute("href");
            var url = `/ajaxSearch${query}`;
            e.preventDefault();
            if (self.fetch) {
                fetch(url, {
                        method: "GET"
                    })
                    .then(res => res.json())
                    .catch(error => console.error("Error:", error))
                    .then(response => {
                        let ul = document.getElementById("list-of--results");
                        while (ul.firstChild) {
                            ul.removeChild(ul.firstChild);
                        }
                        console.log("fetched");
                        response.articles.forEach(article => {
                            let li = createElementFunc("li");
                            let articleTag = createElementFunc("article");

                            setElementAttribute(
                                articleTag,
                                "class",
                                "o-teaser o-teaser--has-image"
                            );
                            setElementAttribute(articleTag, "data-o-component", "o-teaser");

                            let div1 = createElementFunc("div");
                            setElementAttribute(div1, "class", "o-teaser__image-container");

                            let div2 = createElementFunc("div");
                            setElementAttribute(
                                div2,
                                "class",
                                "o-teaser__image-placeholder image-placeholder"
                            );

                            let img = createElementFunc("img");
                            img.src =
                                "https://www.ft.com/__origami/service/image/v2/images/raw/http%3A%2F%2Fim.ft-static.com%2Fcontent%2Fimages%2Fa60ae24b-b87f-439c-bf1b-6e54946b4cf2.img?url=http%253A%252F%252Fim.ft-static.com%252Fcontent%252Fimages%252Fa60ae24b-b87f-439c-bf1b-6e54946b4cf2.img&source=o-teaser-demo&width=400&height=400&fit=cover&format=auto&quality=medium ";

                            setElementAttribute(img, "class", "o-teaser__image");
                            setElementAttribute(img, "alt", "article image");
                            let div3 = createElementFunc("div");
                            setElementAttribute(div3, "class", "o-teaser__content");
                            let div4 = createElementFunc("div");
                            setElementAttribute(div4, "class", "o-teaser__meta");
                            let h31 = createElementFunc("h3");
                            setElementAttribute(h31, "class", "article__tag");
                            let a1 = createElementFunc("a");
                            setElementAttribute(a1, "href", `${article.tagLink}`);
                            a1.appendChild(createTextContentFunc(article.tag));
                            let h32 = createElementFunc("h3");
                            setElementAttribute(h32, "class", "o-teaser__heading ");
                            let a2 = createElementFunc("a");
                            setElementAttribute(a2, "href", `${article.link}`);
                            a2.appendChild(createTextContentFunc(article.title));
                            let p1 = createElementFunc("p");
                            setElementAttribute(p1, "class", "o-teaser__standfirst");
                            p1.appendChild(createTextContentFunc(article.excerpt));
                            let p2 = createElementFunc("p");
                            if (article.author) {
                                p2.appendChild(createTextContentFunc(article.author));
                            } else {
                                //instead of undefined will be ""
                                p2.appendChild(createTextContentFunc(""));
                            }

                            let time = createElementFunc("time");
                            time.appendChild(createTextContentFunc(article.publicationDate));

                            ul.appendChild(li);
                            li.appendChild(articleTag);
                            articleTag.appendChild(div1);
                            div1.appendChild(div2);
                            div2.appendChild(img);

                            articleTag.appendChild(div3);
                            div3.appendChild(div4);
                            div4.appendChild(h31);
                            h31.appendChild(a1);
                            div3.appendChild(h32);
                            h32.appendChild(a2);
                            div3.appendChild(p1);

                            div3.appendChild(p2);

                            div3.appendChild(time);
                        });

                        let nexPageNumber = response.articles[0].nextPage;
                        let previousPage = response.articles[0].previousPage;
                        let currentPage = response.articles[0].currentPage;
                        let keyword = response.articles[0].keyword;

                        document.getElementById("currentPage-Number").innerHTML =
                            response.articles[0].currentPage;
                        document.getElementById(
                            "previousPage"
                        ).href = `?q=${keyword}&page=${previousPage}`;
                        document.getElementById(
                            "nextPage"
                        ).href = `?q=${keyword}&page=${nexPageNumber}`;
                        history.replaceState("", "", `?q=${keyword}&page=${currentPage}`);
                    });
            } else {
                let request = Ajax_request();
                /*==========================
    to dynamically fetching the news from the API
          ===================================*/
                (function() {
                    console.log("ajax");
                    request.onreadystatechange = function() {
                        if (request.readyState === 4) {
                            // check if a response was sent back
                            if (request.status === 200) {
                                // check if request was successful
                                let response = JSON.parse(request.responseText);
                                let ul = document.getElementById("list-of--results");
                                while (ul.firstChild) {
                                    ul.removeChild(ul.firstChild);
                                }

                                response.articles.forEach(article => {
                                    let li = createElementFunc("li");
                                    let articleTag = createElementFunc("article");

                                    setElementAttribute(
                                        articleTag,
                                        "class",
                                        "o-teaser o-teaser--has-image"
                                    );
                                    setElementAttribute(
                                        articleTag,
                                        "data-o-component",
                                        "o-teaser"
                                    );

                                    let div1 = createElementFunc("div");
                                    setElementAttribute(
                                        div1,
                                        "class",
                                        "o-teaser__image-container"
                                    );

                                    let div2 = createElementFunc("div");
                                    setElementAttribute(
                                        div2,
                                        "class",
                                        "o-teaser__image-placeholder image-placeholder"
                                    );

                                    let img = createElementFunc("img");
                                    img.src =
                                        "https://www.ft.com/__origami/service/image/v2/images/raw/http%3A%2F%2Fim.ft-static.com%2Fcontent%2Fimages%2Fa60ae24b-b87f-439c-bf1b-6e54946b4cf2.img?url=http%253A%252F%252Fim.ft-static.com%252Fcontent%252Fimages%252Fa60ae24b-b87f-439c-bf1b-6e54946b4cf2.img&source=o-teaser-demo&width=400&height=400&fit=cover&format=auto&quality=medium ";

                                    setElementAttribute(img, "class", "o-teaser__image");
                                    setElementAttribute(img, "alt", "article image");
                                    let div3 = createElementFunc("div");
                                    setElementAttribute(div3, "class", "o-teaser__content");
                                    let div4 = createElementFunc("div");
                                    setElementAttribute(div4, "class", "o-teaser__meta");
                                    let h31 = createElementFunc("h3");
                                    setElementAttribute(h31, "class", "article__tag");
                                    let a1 = createElementFunc("a");
                                    setElementAttribute(a1, "href", `${article.tagLink}`);
                                    a1.appendChild(createTextContentFunc(article.tag));
                                    let h32 = createElementFunc("h3");
                                    setElementAttribute(h32, "class", "o-teaser__heading ");
                                    let a2 = createElementFunc("a");
                                    setElementAttribute(a2, "href", `${article.link}`);
                                    a2.appendChild(createTextContentFunc(article.title));
                                    let p1 = createElementFunc("p");
                                    setElementAttribute(p1, "class", "o-teaser__standfirst");
                                    p1.appendChild(createTextContentFunc(article.excerpt));
                                    let p2 = createElementFunc("p");
                                    if (article.author) {
                                        p2.appendChild(createTextContentFunc(article.author));
                                    } else {
                                        //instead of undefined will be ""
                                        p2.appendChild(createTextContentFunc(""));
                                    }

                                    let time = createElementFunc("time");
                                    time.appendChild(
                                        createTextContentFunc(article.publicationDate)
                                    );

                                    ul.appendChild(li);
                                    li.appendChild(articleTag);
                                    articleTag.appendChild(div1);
                                    div1.appendChild(div2);
                                    div2.appendChild(img);

                                    articleTag.appendChild(div3);
                                    div3.appendChild(div4);
                                    div4.appendChild(h31);
                                    h31.appendChild(a1);
                                    div3.appendChild(h32);
                                    h32.appendChild(a2);
                                    div3.appendChild(p1);

                                    div3.appendChild(p2);

                                    div3.appendChild(time);
                                });

                                let nexPageNumber = response.articles[0].nextPage;
                                let previousPage = response.articles[0].previousPage;
                                let currentPage = response.articles[0].currentPage;
                                let keyword = response.articles[0].keyword;

                                document.getElementById("currentPage-Number").innerHTML =
                                    response.articles[0].currentPage;
                                document.getElementById(
                                    "previousPage"
                                ).href = `?q=${keyword}&page=${previousPage}`;
                                document.getElementById(
                                    "nextPage"
                                ).href = `?q=${keyword}&page=${nexPageNumber}`;
                                history.replaceState(
                                    "",
                                    "",
                                    `?q=${keyword}&page=${currentPage}`
                                );
                            } else {
                                alert(
                                    "An error occurred during your request: " +
                                    request.status +
                                    " " +
                                    request.statusText
                                );
                            }
                        }
                    };

                    request.open("GET", url);
                    request.setRequestHeader("Accepts", "application/json");
                    request.send();
                })();
            }
        });
    }
}
document.addEventListener("DOMContentLoaded", function() {
    // Dispatch a custom event that will tell all required modules to initialise
    document.dispatchEvent(new CustomEvent("o.DOMContentLoaded"));
});