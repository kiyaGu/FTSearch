!function(e){function t(r){if(n[r])return n[r].exports;var o=n[r]={i:r,l:!1,exports:{}};return e[r].call(o.exports,o,o.exports,t),o.l=!0,o.exports}var n={};t.m=e,t.c=n,t.d=function(e,n,r){t.o(e,n)||Object.defineProperty(e,n,{configurable:!1,enumerable:!0,get:r})},t.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(n,"a",n),n},t.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},t.p="",t(t.s="L7Xl")}({"03Zz":function(e,t,n){var r=function(e){return document.createElement(e)},o=function(e){return document.createTextNode(e)},i=function(e,t,n){e.setAttribute(t,n)};e.exports=function(e,t){var n=r("li"),a=r("article");i(a,"class","o-teaser o-teaser--has-image"),i(a,"data-o-component","o-teaser");var c=r("div");i(c,"class","o-teaser__image-container");var u=r("div");i(u,"class","o-teaser__image-placeholder image-placeholder");var s=r("img");s.src="/images/FTlogo194x194.png",i(s,"class","o-teaser__image"),i(s,"alt","article image");var d=r("div");i(d,"class","o-teaser__content");var l=r("div");i(l,"class","o-teaser__meta");var p=r("h3");i(p,"class","article__tag");var f=r("a");i(f,"href",""+e.tagLink),f.appendChild(o(e.tag));var h=r("h3");i(h,"class","o-teaser__heading ");var m=r("a");i(m,"href",""+e.link),m.appendChild(o(e.title));var g=r("p");i(g,"class","o-teaser__standfirst"),g.appendChild(o(e.excerpt));var v=r("p");e.author?v.appendChild(o(e.author)):v.appendChild(o(""));var y=r("time");y.appendChild(o(e.publicationDate)),t.appendChild(n),n.appendChild(a),a.appendChild(c),c.appendChild(u),u.appendChild(s),a.appendChild(d),d.appendChild(l),l.appendChild(p),p.appendChild(f),d.appendChild(h),h.appendChild(m),d.appendChild(g),d.appendChild(v),d.appendChild(y)}},"0dtO":function(e,t,n){var r=function(e,t,n){e.setAttribute(t,n)},o=function(e,t){e.removeAttribute(t)},i=function(e){var t=e.nextPageNumber,n=(e.previousPageNumber,e.currentPageNumber),i=document.getElementById("previousPageLink"),a=document.getElementById("nextPageLink"),c=document.getElementById("previousPageButton"),u=document.getElementById("nextPageButton");1===n?(r(i,"class","inactiveLink"),r(c,"disabled","disabled")):(r(i,"class",""),o(c,"disabled")),t===e.totalNumberOfPages?(r(a,"class","inactiveLink"),r(u,"disabled","disabled")):(r(a,"class",""),o(u,"disabled"))};e.exports=function(e,t){i(e),document.getElementById("currentPage-Number").innerHTML=e.currentPageNumber,document.getElementById("previousPageLink").href="?q="+t+"&page="+e.previousPageNumber,document.getElementById("nextPageLink").href="?q="+t+"&page="+e.nextPageNumber,history.replaceState("","","?q="+t+"&page="+e.currentPageNumber)}},HerG:function(e,t,n){var r=n("03Zz"),o=n("0dtO");e.exports=function(e){if(e){for(var t=document.getElementById("list-of--results");t.firstChild;)t.removeChild(t.firstChild);e.articles.forEach(function(e){r(e,t)}),o(e.pageInformation,e.articles[0].keyword)}}},L7Xl:function(e,t,n){var r=n("a3nv"),o=(n("03Zz"),n("0dtO"),n("HerG"));if("interactive"===document.readyState||"complete"===document.readyState){var i=function(){return new Promise(function(e,t){var n=s.open("FT-Search",1,function(e){if(console.log("making a new object store"),!e.objectStoreNames.contains("articles")){var t=e.createObjectStore("articles");t.createIndex("keyword","keyword",{unique:!1}),t.createIndex("url","url",{unique:!0})}});n?e(n):t(Error("Error: the database cannot be created"))})},a=function(e,t,n){var r=e.transaction("articles","readwrite");if(r.objectStore("articles").put(t,n),r.complete)return console.log("added item to the store articles os!"),r.complete},c=function(e,t){return e.transaction("articles","readonly").objectStore("articles").get(t)},u=function(e,t){t||(t=window.location.href),e=e.replace(/[\[\]]/g,"\\$&");var n=new RegExp("[?&]"+e+"(=([^&#]*)|&|#|$)"),r=n.exec(t);return r?r[2]?decodeURIComponent(r[2].replace(/\+/g," ")):"":null};document.dispatchEvent(new CustomEvent("o.DOMContentLoaded")),document.dispatchEvent(new CustomEvent("o.DOMContentLoaded")),"serviceWorker"in navigator&&navigator.serviceWorker.register("/serviceWorker.js").then(function(e){console.log("Service Worker Registration succeeded")}).catch(function(e){console.log("Service Worker Registration failed with "+e)});var s=n("gLhF");!function(){if(!("indexedDB"in window))console.log("This browser doesn't support IndexedDB")}();var d=function(e){var t="/search"+e,n=u("q",t),s="/search?q="+n+"&page=1";if(self.fetch)fetch(t,{method:"GET",headers:{"Content-Type":"application/json"}}).then(function(e){-1!==e.headers.get("content-type").indexOf("application/json")&&e.json().then(function(e){i().then(function(n){a(n,e,t)}).then(function(){o(e)})})}).catch(function(e){i().then(function(e){c(e,s).then(function(e){e&&o(e)}).catch(function(e){console.log("Error:"+e)})})});else{var d=r();!function(){d.onreadystatechange=function(){if(4===d.readyState)if(200===d.status){var e=JSON.parse(d.response);i().then(function(n){a(n,e,t),o(e)})}else i().then(function(e){c(e,s).then(function(e){e&&o(e)}).catch(function(e){console.log("Error:"+e)})})},d.open("GET",t),d.setRequestHeader("Content-Type","application/json"),d.setRequestHeader("Accepts","application/json"),d.send()}()}};document.getElementById("headline-search--submit").addEventListener("click",function(e){var t=new FormData(document.getElementById("headline-search--form")),n=t.get("q"),r="/search?q="+n+"&page=1";fetch(r,{method:"GET",headers:{"Content-Type":"application/json"}}).then(function(e){return e.json()}).then(function(e){i().then(function(t){return a(t,e,r)})})});var l=document.getElementById("nextPageLink");null!==l&&l.addEventListener("click",function(e){e.preventDefault();var t=l.getAttribute("href"),n="/search"+t;i().then(function(e){c(e,n).then(function(e){e?o(e):d(t)}).catch(function(e){console.log("Error:"+e)})})});var p=document.getElementById("previousPageLink");null!==p&&p.addEventListener("click",function(e){e.preventDefault();var t=p.getAttribute("href"),n="/search"+t;i().then(function(e){c(e,n).then(function(e){e?o(e):d(t)}).catch(function(e){console.log("Error:"+e)})})})}document.addEventListener("DOMContentLoaded",function(){})},a3nv:function(e,t,n){e.exports=function(){if(window.XMLHttpRequest)xmlhttp=new XMLHttpRequest;else if(window.ActiveXObject)try{xmlhttp=new ActiveXObject("Msxml2.XMLHTTP")}catch(e){try{xmlhttp=new ActiveXObject("Microsoft.XMLHTTP")}catch(e){}}return xmlhttp||alert("Giving up : Cannot create an XMLHTTP instance"),xmlhttp}},gLhF:function(e,t,n){!function(){function t(e){return Array.prototype.slice.call(e)}function n(e){return new Promise(function(t,n){e.onsuccess=function(){t(e.result)},e.onerror=function(){n(e.error)}})}function r(e,t,r){var o,i=new Promise(function(i,a){o=e[t].apply(e,r),n(o).then(i,a)});return i.request=o,i}function o(e,t,n){var o=r(e,t,n);return o.then(function(e){if(e)return new d(e,o.request)})}function i(e,t,n){n.forEach(function(n){Object.defineProperty(e.prototype,n,{get:function(){return this[t][n]},set:function(e){this[t][n]=e}})})}function a(e,t,n,o){o.forEach(function(o){o in n.prototype&&(e.prototype[o]=function(){return r(this[t],o,arguments)})})}function c(e,t,n,r){r.forEach(function(r){r in n.prototype&&(e.prototype[r]=function(){return this[t][r].apply(this[t],arguments)})})}function u(e,t,n,r){r.forEach(function(r){r in n.prototype&&(e.prototype[r]=function(){return o(this[t],r,arguments)})})}function s(e){this._index=e}function d(e,t){this._cursor=e,this._request=t}function l(e){this._store=e}function p(e){this._tx=e,this.complete=new Promise(function(t,n){e.oncomplete=function(){t()},e.onerror=function(){n(e.error)},e.onabort=function(){n(e.error)}})}function f(e,t,n){this._db=e,this.oldVersion=t,this.transaction=new p(n)}function h(e){this._db=e}i(s,"_index",["name","keyPath","multiEntry","unique"]),a(s,"_index",IDBIndex,["get","getKey","getAll","getAllKeys","count"]),u(s,"_index",IDBIndex,["openCursor","openKeyCursor"]),i(d,"_cursor",["direction","key","primaryKey","value"]),a(d,"_cursor",IDBCursor,["update","delete"]),["advance","continue","continuePrimaryKey"].forEach(function(e){e in IDBCursor.prototype&&(d.prototype[e]=function(){var t=this,r=arguments;return Promise.resolve().then(function(){return t._cursor[e].apply(t._cursor,r),n(t._request).then(function(e){if(e)return new d(e,t._request)})})})}),l.prototype.createIndex=function(){return new s(this._store.createIndex.apply(this._store,arguments))},l.prototype.index=function(){return new s(this._store.index.apply(this._store,arguments))},i(l,"_store",["name","keyPath","indexNames","autoIncrement"]),a(l,"_store",IDBObjectStore,["put","add","delete","clear","get","getAll","getKey","getAllKeys","count"]),u(l,"_store",IDBObjectStore,["openCursor","openKeyCursor"]),c(l,"_store",IDBObjectStore,["deleteIndex"]),p.prototype.objectStore=function(){return new l(this._tx.objectStore.apply(this._tx,arguments))},i(p,"_tx",["objectStoreNames","mode"]),c(p,"_tx",IDBTransaction,["abort"]),f.prototype.createObjectStore=function(){return new l(this._db.createObjectStore.apply(this._db,arguments))},i(f,"_db",["name","version","objectStoreNames"]),c(f,"_db",IDBDatabase,["deleteObjectStore","close"]),h.prototype.transaction=function(){return new p(this._db.transaction.apply(this._db,arguments))},i(h,"_db",["name","version","objectStoreNames"]),c(h,"_db",IDBDatabase,["close"]),["openCursor","openKeyCursor"].forEach(function(e){[l,s].forEach(function(n){n.prototype[e.replace("open","iterate")]=function(){var n=t(arguments),r=n[n.length-1],o=this._store||this._index,i=o[e].apply(o,n.slice(0,-1));i.onsuccess=function(){r(i.result)}}})}),[s,l].forEach(function(e){e.prototype.getAll||(e.prototype.getAll=function(e,t){var n=this,r=[];return new Promise(function(o){n.iterateCursor(e,function(e){return e?(r.push(e.value),void 0!==t&&r.length==t?void o(r):void e.continue()):void o(r)})})})});var m={open:function(e,t,n){var o=r(indexedDB,"open",[e,t]),i=o.request;return i.onupgradeneeded=function(e){n&&n(new f(i.result,e.oldVersion,i.transaction))},o.then(function(e){return new h(e)})},delete:function(e){return r(indexedDB,"deleteDatabase",[e])}};e.exports=m,e.exports.default=e.exports}()}});