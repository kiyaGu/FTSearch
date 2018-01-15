module.exports = function Ajax_request() {
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
};