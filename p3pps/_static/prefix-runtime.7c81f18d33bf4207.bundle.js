(()=>{"use strict";var e,r,t,a,n,o={},d={};function c(e){var r=d[e];if(void 0!==r)return r.exports;var t=d[e]={id:e,loaded:!1,exports:{}};return o[e].call(t.exports,t,t.exports,c),t.loaded=!0,t.exports}c.m=o,e=[],c.O=(r,t,a,n)=>{if(!t){var o=1/0;for(l=0;l<e.length;l++){for(var[t,a,n]=e[l],d=!0,i=0;i<t.length;i++)(!1&n||o>=n)&&Object.keys(c.O).every((e=>c.O[e](t[i])))?t.splice(i--,1):(d=!1,n<o&&(o=n));if(d){e.splice(l--,1);var f=a();void 0!==f&&(r=f)}}return r}n=n||0;for(var l=e.length;l>0&&e[l-1][2]>n;l--)e[l]=e[l-1];e[l]=[t,a,n]},c.n=e=>{var r=e&&e.__esModule?()=>e.default:()=>e;return c.d(r,{a:r}),r},c.d=(e,r)=>{for(var t in r)c.o(r,t)&&!c.o(e,t)&&Object.defineProperty(e,t,{enumerable:!0,get:r[t]})},c.f={},c.e=e=>Promise.all(Object.keys(c.f).reduce(((r,t)=>(c.f[t](e,r),r)),[])),c.u=e=>"prefix-"+e+"."+{13:"88fbb65140eb775b",106:"ffd10363579ef501",142:"7b1a3df4bc23edfd",146:"ee08e58ee420fa54",152:"2ec47015ef9797bc",207:"e47c89be497a200d",224:"67368e24f0cc5438",254:"b8f5363bea57fff4",266:"fbded2752fbd4afd",280:"0e06671fc92faac6",298:"2998fb401b1bb09c",338:"457dc0d17fa61851",344:"419e1983b50cca24",350:"467ce0ead2589ce9",366:"3ffce59267e13756",382:"189d1ac9092a39b0",405:"390f60b86bc9bc11",435:"3bc1999e6890cac7",444:"fe1772869d62c232",526:"c335f42f113c99f0",536:"ca03d78b1ce434a8",556:"ffcf16d87d19df2e",611:"1cc50624b57ecc80",632:"43cec723c434d107",653:"d951f963bc3b8234",657:"ec0d0f6038e41cbc",778:"8d14f8f9ed180e17",780:"304c571883d59a82",789:"274f41311641cfd1",818:"7af3d2199882313f",866:"865908bf557d17b0",882:"ee2ae1b66b5556fa",887:"737d174229e86a14",893:"b5447f4eeff69798",921:"9e730ffdea104990",931:"ad6fabba7b6a4957",940:"5bccf3eaed6af485",951:"97d8bed49cf17228",957:"50327584afabf57d",990:"fd4d15ac70d80dde"}[e]+".bundle.js",c.miniCssF=e=>"prefix-"+e+".css",c.g=function(){if("object"==typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(e){if("object"==typeof window)return window}}(),c.o=(e,r)=>Object.prototype.hasOwnProperty.call(e,r),r={},t="WebComponents:",c.l=(e,a,n,o)=>{if(r[e])r[e].push(a);else{var d,i;if(void 0!==n)for(var f=document.getElementsByTagName("script"),l=0;l<f.length;l++){var s=f[l];if(s.getAttribute("src")==e||s.getAttribute("data-webpack")==t+n){d=s;break}}d||(i=!0,(d=document.createElement("script")).charset="utf-8",d.timeout=120,c.nc&&d.setAttribute("nonce",c.nc),d.setAttribute("data-webpack",t+n),d.src=e),r[e]=[a];var u=(t,a)=>{d.onerror=d.onload=null,clearTimeout(b);var n=r[e];if(delete r[e],d.parentNode&&d.parentNode.removeChild(d),n&&n.forEach((e=>e(a))),t)return t(a)},b=setTimeout(u.bind(null,void 0,{type:"timeout",target:d}),12e4);d.onerror=u.bind(null,d.onerror),d.onload=u.bind(null,d.onload),i&&document.head.appendChild(d)}},c.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},c.nmd=e=>(e.paths=[],e.children||(e.children=[]),e),(()=>{var e;c.g.importScripts&&(e=c.g.location+"");var r=c.g.document;if(!e&&r&&(r.currentScript&&(e=r.currentScript.src),!e)){var t=r.getElementsByTagName("script");t.length&&(e=t[t.length-1].src)}if(!e)throw new Error("Automatic publicPath is not supported in this browser");e=e.replace(/#.*$/,"").replace(/\?.*$/,"").replace(/\/[^\/]+$/,"/"),c.p=e})(),a=e=>new Promise(((r,t)=>{var a=c.miniCssF(e),n=c.p+a;if(((e,r)=>{for(var t=document.getElementsByTagName("link"),a=0;a<t.length;a++){var n=(d=t[a]).getAttribute("data-href")||d.getAttribute("href");if("stylesheet"===d.rel&&(n===e||n===r))return d}var o=document.getElementsByTagName("style");for(a=0;a<o.length;a++){var d;if((n=(d=o[a]).getAttribute("data-href"))===e||n===r)return d}})(a,n))return r();((e,r,t,a)=>{var n=document.createElement("link");n.rel="stylesheet",n.type="text/css",n.onerror=n.onload=o=>{if(n.onerror=n.onload=null,"load"===o.type)t();else{var d=o&&("load"===o.type?"missing":o.type),c=o&&o.target&&o.target.href||r,i=new Error("Loading CSS chunk "+e+" failed.\n("+c+")");i.code="CSS_CHUNK_LOAD_FAILED",i.type=d,i.request=c,n.parentNode.removeChild(n),a(i)}},n.href=r,document.head.appendChild(n)})(e,n,r,t)})),n={666:0},c.f.miniCss=(e,r)=>{n[e]?r.push(n[e]):0!==n[e]&&{13:1,106:1,146:1,152:1,224:1,254:1,266:1,280:1,350:1,366:1,382:1,444:1,526:1,536:1,611:1,632:1,657:1,789:1,882:1,887:1,957:1,990:1}[e]&&r.push(n[e]=a(e).then((()=>{n[e]=0}),(r=>{throw delete n[e],r})))},(()=>{var e={666:0};c.f.j=(r,t)=>{var a=c.o(e,r)?e[r]:void 0;if(0!==a)if(a)t.push(a[2]);else if(/^((14|53|66)6|152|254|444|990)$/.test(r))e[r]=0;else{var n=new Promise(((t,n)=>a=e[r]=[t,n]));t.push(a[2]=n);var o=c.p+c.u(r),d=new Error;c.l(o,(t=>{if(c.o(e,r)&&(0!==(a=e[r])&&(e[r]=void 0),a)){var n=t&&("load"===t.type?"missing":t.type),o=t&&t.target&&t.target.src;d.message="Loading chunk "+r+" failed.\n("+n+": "+o+")",d.name="ChunkLoadError",d.type=n,d.request=o,a[1](d)}}),"chunk-"+r,r)}},c.O.j=r=>0===e[r];var r=(r,t)=>{var a,n,[o,d,i]=t,f=0;if(o.some((r=>0!==e[r]))){for(a in d)c.o(d,a)&&(c.m[a]=d[a]);if(i)var l=i(c)}for(r&&r(t);f<o.length;f++)n=o[f],c.o(e,n)&&e[n]&&e[n][0](),e[n]=0;return c.O(l)},t=self.webpackChunkWebComponents=self.webpackChunkWebComponents||[];t.forEach(r.bind(null,0)),t.push=r.bind(null,t.push.bind(t))})()})();
//# sourceMappingURL=prefix-runtime.7c81f18d33bf4207.bundle.js.map