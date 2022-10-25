import * as jsbarcode from "https://cdn.skypack.dev/jsbarcode@3.11.5";
(function() {
  JsBarcode("#barcode", document.getElementById("sokValue").value);
  document.getElementById("sokValue").onkeyup = function() {
    JsBarcode("#barcode", document.getElementById("sokValue").value);
  };
  document.getElementById("sokPrint").onclick = function() {
    window.print();
  };
  document.getElementById("sokClear").onclick = function() {
    document.getElementById("sokValue").value = "0"
    JsBarcode("#barcode", document.getElementById("sokValue").value);
  }
 
})();