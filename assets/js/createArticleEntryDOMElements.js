/*==========================
  functions for creating DOM elements
   ===================================*/
//to create DOM elements
const createElementFunc = function(elementType) {
    return document.createElement(elementType);
};
//to create text node
const createTextContentFunc = function(text) {
    return document.createTextNode(text);
};
//to assign attribute to node elements
const setElementAttribute = function(element, attribute, value) {
    element.setAttribute(attribute, value);
};

module.exports = (article, ul) => {
    //will create the HTML element that matches the one at views/partials/article.handlebars

    let li = createElementFunc("li");
    let articleTag = createElementFunc("article");

    setElementAttribute(articleTag, "class", "o-teaser o-teaser--has-image");
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
    //as a placeholder needs to be replaced by the actual image, which is not provided for this version of api,Headline Licence,
    img.src = "/images/FTlogo194x194.png";

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
        //instead of undefined will be "" as some result may not have it
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
};