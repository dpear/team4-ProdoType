System.register(["./p-ea7bbed1.system.js","./p-cff0a9de.system.js"],(function(e){"use strict";var t,i,o,n,r,s,a,c,l;return{setters:[function(e){t=e.r;i=e.h;o=e.H;n=e.a},function(e){r=e.i;s=e.b;a=e.g;c=e.c;l=e.d}],execute:function(){var f=function(e){var t=document.createElement("div");t.innerHTML=e;for(var i=t.childNodes.length-1;i>=0;i--){if(t.childNodes[i].nodeName.toLowerCase()!=="svg"){t.removeChild(t.childNodes[i])}}var o=t.firstElementChild;if(o&&o.nodeName.toLowerCase()==="svg"){var n=o.getAttribute("class")||"";o.setAttribute("class",(n+" s-ion-icon").trim());if(h(o)){return t.innerHTML}}return""};var h=function(e){if(e.nodeType===1){if(e.nodeName.toLowerCase()==="script"){return false}for(var t=0;t<e.attributes.length;t++){var i=e.attributes[t].name;if(r(i)&&i.toLowerCase().indexOf("on")===0){return false}}for(var t=0;t<e.childNodes.length;t++){if(!h(e.childNodes[t])){return false}}}return true};var d=new Map;var u=new Map;var v=function(e,t){var i=u.get(e);if(!i){if(typeof fetch!=="undefined"&&typeof document!=="undefined"){i=fetch(e).then((function(i){if(i.ok){return i.text().then((function(i){if(i&&t!==false){i=f(i)}d.set(e,i||"")}))}d.set(e,"")}));u.set(e,i)}else{d.set(e,"");return Promise.resolve()}}return i};var b=":host{display:inline-block;width:1em;height:1em;contain:strict;fill:currentColor;-webkit-box-sizing:content-box !important;box-sizing:content-box !important}:host .ionicon{stroke:currentColor}.ionicon-fill-none{fill:none}.ionicon-stroke-width{stroke-width:32px;stroke-width:var(--ionicon-stroke-width, 32px)}.icon-inner,.ionicon,svg{display:block;height:100%;width:100%}:host(.flip-rtl) .icon-inner{-webkit-transform:scaleX(-1);transform:scaleX(-1)}:host(.icon-small){font-size:18px !important}:host(.icon-large){font-size:32px !important}:host(.ion-color){color:var(--ion-color-base) !important}:host(.ion-color-primary){--ion-color-base:var(--ion-color-primary, #3880ff)}:host(.ion-color-secondary){--ion-color-base:var(--ion-color-secondary, #0cd1e8)}:host(.ion-color-tertiary){--ion-color-base:var(--ion-color-tertiary, #f4a942)}:host(.ion-color-success){--ion-color-base:var(--ion-color-success, #10dc60)}:host(.ion-color-warning){--ion-color-base:var(--ion-color-warning, #ffce00)}:host(.ion-color-danger){--ion-color-base:var(--ion-color-danger, #f14141)}:host(.ion-color-light){--ion-color-base:var(--ion-color-light, #f4f5f8)}:host(.ion-color-medium){--ion-color-base:var(--ion-color-medium, #989aa2)}:host(.ion-color-dark){--ion-color-base:var(--ion-color-dark, #222428)}";var m;var p=e("ion_icon",function(){function e(e){var i=this;t(this,e);this.iconName=null;this.inheritedAttributes={};this.isVisible=false;this.mode=g();this.lazy=false;this.sanitize=true;this.hasAriaHidden=function(){var e=i.el;return e.hasAttribute("aria-hidden")&&e.getAttribute("aria-hidden")==="true"}}e.prototype.componentWillLoad=function(){this.inheritedAttributes=s(this.el,["aria-label"])};e.prototype.connectedCallback=function(){var e=this;this.waitUntilVisible(this.el,"50px",(function(){e.isVisible=true;e.loadIcon()}))};e.prototype.disconnectedCallback=function(){if(this.io){this.io.disconnect();this.io=undefined}};e.prototype.waitUntilVisible=function(e,t,i){var o=this;if(this.lazy&&typeof window!=="undefined"&&window.IntersectionObserver){var n=this.io=new window.IntersectionObserver((function(e){if(e[0].isIntersecting){n.disconnect();o.io=undefined;i()}}),{rootMargin:t});n.observe(e)}else{i()}};e.prototype.loadIcon=function(){var e=this;if(this.isVisible){if(!m){m=new DOMParser}var t=a(this);if(t){if(d.has(t)){this.svgContent=d.get(t)}else if(t.startsWith("data:")){var i=m.parseFromString(t,"text/html");var o=i.body.querySelector("svg");if(o!==null){this.svgContent=o.outerHTML}else{this.svgContent=""}}else{v(t,this.sanitize).then((function(){return e.svgContent=d.get(t)}))}}}var n=this.iconName=c(this.name,this.icon,this.mode,this.ios,this.md);if(n){this.ariaLabel=n.replace(/\-/g," ")}};e.prototype.render=function(){var e,t;var n=this,r=n.iconName,s=n.ariaLabel,a=n.el,c=n.inheritedAttributes;var f=this.mode||"md";var h=this.flipRtl||r&&(r.indexOf("arrow")>-1||r.indexOf("chevron")>-1)&&this.flipRtl!==false;return i(o,Object.assign({"aria-label":s!==undefined&&!this.hasAriaHidden()?s:null,role:"img",class:Object.assign(Object.assign((e={},e[f]=true,e),y(this.color)),(t={},t["icon-".concat(this.size)]=!!this.size,t["flip-rtl"]=!!h&&l(a),t))},c),this.svgContent?i("div",{class:"icon-inner",innerHTML:this.svgContent}):i("div",{class:"icon-inner"}))};Object.defineProperty(e,"assetsDirs",{get:function(){return["svg"]},enumerable:false,configurable:true});Object.defineProperty(e.prototype,"el",{get:function(){return n(this)},enumerable:false,configurable:true});Object.defineProperty(e,"watchers",{get:function(){return{name:["loadIcon"],src:["loadIcon"],icon:["loadIcon"]}},enumerable:false,configurable:true});return e}());var g=function(){return typeof document!=="undefined"&&document.documentElement.getAttribute("mode")||"md"};var y=function(e){var t;return e?(t={"ion-color":true},t["ion-color-".concat(e)]=true,t):null};p.style=b}}}));