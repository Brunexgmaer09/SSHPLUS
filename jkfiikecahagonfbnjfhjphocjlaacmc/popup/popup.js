var t=window,{requestAnimationFrame:e,cancelAnimationFrame:n,setTimeout:r,clearTimeout:o,setInterval:i,clearInterval:s,requestIdleCallback:c,cancelIdleCallback:l,queueMicrotask:u,atob:a,btoa:f}=t;function d(){}var p,h=t=>t;function $(t,e){for(const n in e)t[n]=e[n];return t}function g(t){return t()}function m(){return Object.create(null)}function b(t){t.forEach(g)}function C(t){return"function"==typeof t}function w(t,e){return t!=t?e==e:t!==e||t&&"object"==typeof t||"function"==typeof t}function v(t){return 0===Object.keys(t).length}function y(t,...e){if(null==t)return d;const n=t.subscribe(...e);return n.unsubscribe?()=>n.unsubscribe():n}function L(t,e,n){t.$$.on_destroy.push(y(e,n))}function x(t,e,n,r){if(t){const o=z(t,e,n,r);return t[0](o)}}function z(t,e,n,r){return t[1]&&r?$(n.ctx.slice(),t[1](r(e))):n.ctx}function k(t,e,n,r){if(t[2]&&r){const o=t[2](r(n));if(void 0===e.dirty)return o;if("object"==typeof o){const t=[],n=Math.max(e.dirty.length,o.length);for(let r=0;r<n;r+=1)t[r]=e.dirty[r]|o[r];return t}return e.dirty|o}return e.dirty}function I(t,e,n,r,o,i){if(o){const s=z(e,n,r,i);t.p(s,o)}}function _(t){if(t.ctx.length>32){const e=[],n=t.ctx.length/32;for(let t=0;t<n;t++)e[t]=-1;return e}return-1}function E(t){const e={};for(const n in t)e[n]=!0;return e}var M="undefined"!=typeof window,A=M?()=>window.performance.now():()=>Date.now(),B=M?t=>requestAnimationFrame(t):d,j=new Set;function S(t){j.forEach((e=>{e.c(t)||(j.delete(e),e.f())})),0!==j.size&&B(S)}function P(t){let e;return 0===j.size&&B(S),{promise:new Promise((n=>{j.add(e={c:t,f:n})})),abort(){j.delete(e)}}}var T;function O(t,e){t.appendChild(e)}function D(t,e,n){t.insertBefore(e,n||null)}function Z(t){t.parentNode&&t.parentNode.removeChild(t)}function H(t,e){for(let n=0;n<t.length;n+=1)t[n]&&t[n].d(e)}function q(t){return document.createElement(t)}function F(t){return document.createElementNS("http://www.w3.org/2000/svg",t)}function W(t){return document.createTextNode(t)}function N(t,e,n,r){return t.addEventListener(e,n,r),()=>t.removeEventListener(e,n,r)}function Y(t,e,n){null==n?t.removeAttribute(e):t.getAttribute(e)!==n&&t.setAttribute(e,n)}function V(t,e,n,r){null===n?t.style.removeProperty(e):t.style.setProperty(e,n,r?"important":"")}function G(t,e,n){t.classList[n?"add":"remove"](e)}function Q(t,e,{bubbles:n=!1,cancelable:r=!1}={}){const o=document.createEvent("CustomEvent");return o.initCustomEvent(t,n,r,e),o}function R(t){T=t}function U(){if(!T)throw new Error("Function called outside component initialization");return T}function X(t){U().$$.on_mount.push(t)}function J(){const t=U();return(e,n,{cancelable:r=!1}={})=>{const o=t.$$.callbacks[e];if(o){const i=Q(e,n,{cancelable:r});return o.slice().forEach((e=>{e.call(t,i)})),!i.defaultPrevented}return!0}}var K=[],tt=[],et=[],nt=[],rt=Promise.resolve(),ot=!1;function it(t){et.push(t)}var st=new Set,ct=0;function lt(){if(0!==ct)return;const t=T;do{try{for(;ct<K.length;){const t=K[ct];ct++,R(t),ut(t.$$)}}catch(t){throw K.length=0,ct=0,t}for(R(null),K.length=0,ct=0;tt.length;)tt.pop()();for(let t=0;t<et.length;t+=1){const e=et[t];st.has(e)||(st.add(e),e())}et.length=0}while(K.length);for(;nt.length;)nt.pop()();ot=!1,st.clear(),R(t)}function ut(t){if(null!==t.fragment){t.update(),b(t.before_update);const e=t.dirty;t.dirty=[-1],t.fragment&&t.fragment.p(t.ctx,e),t.after_update.forEach(it)}}var at,ft=new Set;function dt(){at={r:0,c:[],p:at}}function pt(){at.r||b(at.c),at=at.p}function ht(t,e){t&&t.i&&(ft.delete(t),t.i(e))}function $t(t,e,n,r){if(t&&t.o){if(ft.has(t))return;ft.add(t),at.c.push((()=>{ft.delete(t),r&&(n&&t.d(1),r())})),t.o(e)}else r&&r()}"undefined"!=typeof window?window:"undefined"!=typeof globalThis?globalThis:global;function gt(t){t&&t.c()}function mt(t,e,n,r){const{fragment:o,after_update:i}=t.$$;o&&o.m(e,n),r||it((()=>{const e=t.$$.on_mount.map(g).filter(C);t.$$.on_destroy?t.$$.on_destroy.push(...e):b(e),t.$$.on_mount=[]})),i.forEach(it)}function bt(t,e){const n=t.$$;null!==n.fragment&&(b(n.on_destroy),n.fragment&&n.fragment.d(e),n.on_destroy=n.fragment=null,n.ctx=[])}function Ct(t,e){-1===t.$$.dirty[0]&&(K.push(t),ot||(ot=!0,rt.then(lt)),t.$$.dirty.fill(0)),t.$$.dirty[e/31|0]|=1<<e%31}function wt(t,e,n,r,o,i,s,c=[-1]){const l=T;R(t);const u=t.$$={fragment:null,ctx:[],props:i,update:d,not_equal:o,bound:m(),on_mount:[],on_destroy:[],on_disconnect:[],before_update:[],after_update:[],context:new Map(e.context||(l?l.$$.context:[])),callbacks:m(),dirty:c,skip_bound:!1,root:e.target||l.$$.root};s&&s(u.root);let a=!1;if(u.ctx=n?n(t,e.props||{},((e,n,...r)=>{const i=r.length?r[0]:n;return u.ctx&&o(u.ctx[e],u.ctx[e]=i)&&(!u.skip_bound&&u.bound[e]&&u.bound[e](i),a&&Ct(t,e)),n})):[],u.update(),a=!0,b(u.before_update),u.fragment=!!r&&r(u.ctx),e.target){if(e.hydrate){!0;const t=(f=e.target,Array.from(f.childNodes));u.fragment&&u.fragment.l(t),t.forEach(Z)}else u.fragment&&u.fragment.c();e.intro&&ht(t.$$.fragment),mt(t,e.target,e.anchor,e.customElement),!1,lt()}var f;R(l)}"function"==typeof HTMLElement&&HTMLElement;var vt=class{$destroy(){bt(this,1),this.$destroy=d}$on(t,e){if(!C(e))return d;const n=this.$$.callbacks[t]||(this.$$.callbacks[t]=[]);return n.push(e),()=>{const t=n.indexOf(e);-1!==t&&n.splice(t,1)}}$set(t){this.$$set&&!v(t)&&(this.$$.skip_bound=!0,this.$$set(t),this.$$.skip_bound=!1)}},yt=class extends vt{constructor(t){super(),wt(this,t,null,null,w,{})}},Lt=t=>({}),xt=t=>({}),zt=t=>({}),kt=t=>({}),It=t=>({}),_t=t=>({});function Et(t){let e;const n=t[5].iconbefore,r=x(n,t,t[4],_t);return{c(){r&&r.c()},m(t,n){r&&r.m(t,n),e=!0},p(t,o){r&&r.p&&(!e||16&o)&&I(r,n,t,t[4],e?k(n,t[4],o,It):_(t[4]),_t)},i(t){e||(ht(r,t),e=!0)},o(t){$t(r,t),e=!1},d(t){r&&r.d(t)}}}function Mt(t){let e,n,r,o,i,s,c,l,u,a,f=`MOD Version: ${t[0]}`,d=t[3].iconbefore&&Et(t);const h=t[5].title,$=x(h,t,t[4],kt),g=t[5].main,m=x(g,t,t[4],xt);return{c(){var a,h;e=q("div"),n=q("header"),d&&d.c(),r=q("img"),i=q("div"),$&&$.c(),s=q("main"),m&&m.c(),c=q("footer"),l=q("span"),u=W(f),Y(r,"class","icon-1QuH4o"),a=r.src,h=o="../assets/icon_128.png",p||(p=document.createElement("a")),p.href=h,a!==p.href&&Y(r,"src","../assets/icon_128.png"),Y(r,"alt","frontier slither icon"),Y(i,"class","title-18WONv"),Y(l,"class","modversion-BTQlqT"),Y(e,"class","container-3toUMy"),V(e,"width",t[1]),V(e,"height",t[2])},m(t,o){D(t,e,o),O(e,n),d&&d.m(n,null),O(n,r),O(n,i),$&&$.m(i,null),O(e,s),m&&m.m(s,null),O(e,c),O(c,l),O(l,u),a=!0},p(t,[o]){var i,s;t[3].iconbefore?d?(d.p(t,o),8&o&&ht(d,1)):(d=Et(t),d.c(),ht(d,1),d.m(n,r)):d&&(dt(),$t(d,1,1,(()=>{d=null})),pt()),$&&$.p&&(!a||16&o)&&I($,h,t,t[4],a?k(h,t[4],o,zt):_(t[4]),kt),m&&m.p&&(!a||16&o)&&I(m,g,t,t[4],a?k(g,t[4],o,Lt):_(t[4]),xt),(!a||1&o)&&f!==(f=`MOD Version: ${t[0]}`)&&(s=""+(s=f),(i=u).wholeText!==s&&(i.data=s)),2&o&&V(e,"width",t[1]),4&o&&V(e,"height",t[2])},i(t){a||(ht(d),ht($,t),ht(m,t),a=!0)},o(t){$t(d),$t($,t),$t(m,t),a=!1},d(t){t&&Z(e),d&&d.d(),$&&$.d(t),m&&m.d(t)}}}function At(t,e,n){let{$$slots:r={},$$scope:o}=e;const i=E(r);let{modversion:s}=e,{width:c}=e,{height:l}=e;return t.$$set=t=>{"modversion"in t&&n(0,s=t.modversion),"width"in t&&n(1,c=t.width),"height"in t&&n(2,l=t.height),"$$scope"in t&&n(4,o=t.$$scope)},[s,c,l,i,o,r]}var Bt=class extends vt{constructor(t){super(),wt(this,t,At,Mt,w,{modversion:0,width:1,height:2})}},jt=(Math.PI,Math.abs),St=Math.sqrt,Pt=[];function Tt(t,e=d){let n;const r=new Set;function o(e){if(w(t,e)&&(t=e,n)){const e=!Pt.length;for(const e of r)e[1](),Pt.push(e,t);if(e){for(let t=0;t<Pt.length;t+=2)Pt[t][0](Pt[t+1]);Pt.length=0}}}return{set:o,update:function(e){o(e(t))},subscribe:function(i,s=d){const c=[i,s];return r.add(c),1===r.size&&(n=e(o)||d),i(t),()=>{r.delete(c),0===r.size&&(n(),n=null)}}}}function Ot(t){const e=1.70158;return--t*t*((e+1)*t+e)+1}function Dt(t){return"[object Date]"===Object.prototype.toString.call(t)}function Zt(t,e){if(t===e||t!=t)return()=>t;const n=typeof t;if(n!==typeof e||Array.isArray(t)!==Array.isArray(e))throw new Error("Cannot interpolate values of different type");if(Array.isArray(t)){const n=e.map(((e,n)=>Zt(t[n],e)));return t=>n.map((e=>e(t)))}if("object"===n){if(!t||!e)throw new Error("Object cannot be null");if(Dt(t)&&Dt(e)){t=t.getTime();const n=(e=e.getTime())-t;return e=>new Date(t+e*n)}const n=Object.keys(e),r={};return n.forEach((n=>{r[n]=Zt(t[n],e[n])})),t=>{const e={};return n.forEach((n=>{e[n]=r[n](t)})),e}}if("number"===n){const n=e-t;return e=>t+e*n}throw new Error(`Cannot interpolate ${n} values`)}function Ht(t,e={}){const n=Tt(t);let r,o=t;function i(i,s){if(null==t)return n.set(t=i),Promise.resolve();o=i;let c=r,l=!1,{delay:u=0,duration:a=400,easing:f=h,interpolate:d=Zt}=$($({},e),s);if(0===a)return c&&(c.abort(),c=null),n.set(t=o),Promise.resolve();const p=A()+u;let g;return r=P((e=>{if(e<p)return!0;l||(g=d(t,i),"function"==typeof a&&(a=a(t,i)),l=!0),c&&(c.abort(),c=null);const r=e-p;return r>a?(n.set(t=i),!1):(n.set(t=g(f(r/a))),!0)})),r.promise}return{set:i,update:(e,n)=>i(e(o,t),n),subscribe:n.subscribe}}var qt={x:50,y:50};function Ft(t){let e,n,r,o;return{c(){e=F("defs"),n=F("filter"),r=F("feGaussianBlur"),o=F("circle"),Y(r,"in","SourceGraphic"),Y(r,"stdDeviation",t[2]),Y(n,"id","f1"),Y(n,"x","0"),Y(n,"y","0"),Y(o,"class","circle-A8PrDW"),Y(o,"cx",t[0]),Y(o,"cy",t[1]),Y(o,"r",t[3]),Y(o,"opacity",t[4]),Y(o,"filter","url(#f1)")},m(t,i){D(t,e,i),O(e,n),O(n,r),D(t,o,i)},p(t,[e]){4&e&&Y(r,"stdDeviation",t[2]),1&e&&Y(o,"cx",t[0]),2&e&&Y(o,"cy",t[1]),8&e&&Y(o,"r",t[3]),16&e&&Y(o,"opacity",t[4])},i:d,o:d,d(t){t&&Z(e),t&&Z(o)}}}function Wt(t,e,n){let r,o,{x:i}=e,{y:s}=e,{size:c}=e,{sizeIn:l}=e,{speed:u}=e,{rippleBlur:a}=e,{opacityIn:f}=e;const d=Ht(l,{duration:u});L(t,d,(t=>n(3,r=t)));const p=Ht(f,{duration:u+2.5*u,easing:Ot});return L(t,p,(t=>n(4,o=t))),X((()=>{p.set(0),d.set(c)})),t.$$set=t=>{"x"in t&&n(0,i=t.x),"y"in t&&n(1,s=t.y),"size"in t&&n(7,c=t.size),"sizeIn"in t&&n(8,l=t.sizeIn),"speed"in t&&n(9,u=t.speed),"rippleBlur"in t&&n(2,a=t.rippleBlur),"opacityIn"in t&&n(10,f=t.opacityIn)},[i,s,a,r,o,d,p,c,l,u,f]}var Nt=class extends vt{constructor(t){super(),wt(this,t,Wt,Ft,w,{x:0,y:1,size:7,sizeIn:8,speed:9,rippleBlur:2,opacityIn:10})}};function Yt(t,e,n){const r=t.slice();return r[34]=e[n],r}function Vt(t){let e,n;return e=new Nt({props:{x:t[34].x,y:t[34].y,size:t[34].size,speed:t[2],sizeIn:t[13],opacityIn:t[14],rippleBlur:t[1]}}),{c(){gt(e.$$.fragment)},m(t,r){mt(e,t,r),n=!0},p(t,n){const r={};262144&n[0]&&(r.x=t[34].x),262144&n[0]&&(r.y=t[34].y),262144&n[0]&&(r.size=t[34].size),4&n[0]&&(r.speed=t[2]),8192&n[0]&&(r.sizeIn=t[13]),16384&n[0]&&(r.opacityIn=t[14]),2&n[0]&&(r.rippleBlur=t[1]),e.$set(r)},i(t){n||(ht(e.$$.fragment,t),n=!0)},o(t){$t(e.$$.fragment,t),n=!1},d(t){bt(e,t)}}}function Gt(t){let e,n,r,o,i,s;const c=t[27].default,l=x(c,t,t[26],null);let u=t[18],a=[];for(let e=0;e<u.length;e+=1)a[e]=Vt(Yt(t,u,e));const f=t=>$t(a[t],1,1,(()=>{a[t]=null}));return{c(){e=q("button"),n=q("div"),l&&l.c(),r=F("svg");for(let t=0;t<a.length;t+=1)a[t].c();Y(n,"class","text-2CqjjY"),Y(r,"class","effect-2Po-Oh"),Y(e,"class",t[0]),V(e,"--color",t[3]),V(e,"--font-size",t[4]),V(e,"--bg-color",t[5]),V(e,"--bg-hover",t[6]),V(e,"--bg-active",t[7]),V(e,"--transition",t[8]),V(e,"--radius",t[10]),V(e,"--ripple",t[9]),V(e,"--height",t[11]),V(e,"--width",t[12]),G(e,"ripple-btn-soWDFB",!0),G(e,"disabled-2YyuWx",t[15])},m(c,u){D(c,e,u),O(e,n),l&&l.m(n,null),O(e,r);for(let t=0;t<a.length;t+=1)a[t].m(r,null);t[28](e),o=!0,i||(s=N(e,"click",t[19]),i=!0)},p(t,n){if(l&&l.p&&(!o||67108864&n[0])&&I(l,c,t,t[26],o?k(c,t[26],n,null):_(t[26]),null),286726&n[0]){let e;for(u=t[18],e=0;e<u.length;e+=1){const o=Yt(t,u,e);a[e]?(a[e].p(o,n),ht(a[e],1)):(a[e]=Vt(o),a[e].c(),ht(a[e],1),a[e].m(r,null))}for(dt(),e=u.length;e<a.length;e+=1)f(e);pt()}(!o||1&n[0])&&Y(e,"class",t[0]),(!o||8&n[0])&&V(e,"--color",t[3]),(!o||16&n[0])&&V(e,"--font-size",t[4]),(!o||32&n[0])&&V(e,"--bg-color",t[5]),(!o||64&n[0])&&V(e,"--bg-hover",t[6]),(!o||128&n[0])&&V(e,"--bg-active",t[7]),(!o||256&n[0])&&V(e,"--transition",t[8]),(!o||1024&n[0])&&V(e,"--radius",t[10]),(!o||512&n[0])&&V(e,"--ripple",t[9]),(!o||2048&n[0])&&V(e,"--height",t[11]),(!o||4096&n[0])&&V(e,"--width",t[12]),(!o||1&n[0])&&G(e,"ripple-btn-soWDFB",!0),(!o||32769&n[0])&&G(e,"disabled-2YyuWx",t[15])},i(t){if(!o){ht(l,t);for(let t=0;t<u.length;t+=1)ht(a[t]);o=!0}},o(t){$t(l,t),a=a.filter(Boolean);for(let t=0;t<a.length;t+=1)$t(a[t]);o=!1},d(n){n&&Z(e),l&&l.d(n),H(a,n),t[28](null),i=!1,s()}}}function Qt(t,e,n){let r,o=d;t.$$.on_destroy.push((()=>o()));let{$$slots:i={},$$scope:s}=e,{class:c=""}=e,{rippleBlur:l=2}=e,{speed:u=500}=e,{color:a="#ffffff"}=e,{fontSize:f="1em"}=e,{bgColor:p="rgba(0, 0, 0, 0)"}=e,{bgHover:h=""}=e,{bgActive:$=""}=e,{transition:g="200ms"}=e,{rippleColor:m="#ffffff"}=e,{round:b="0"}=e,{height:C="auto"}=e,{width:w="auto"}=e,{sizeIn:v=20}=e,{opacityIn:L=.2}=e,{disabled:x=!1}=e;const z=J();const k=function(){const t=Tt([]);return{subscribe:t.subscribe,add:e=>{t.update((t=>[...t,e]))},clear:()=>{t.update((t=>[]))}}}();let I,_,E,M,A,B,j,S,P;o(),o=y(k,(t=>n(18,r=t)));return X((()=>{n(20,_=I.offsetWidth),n(21,E=I.offsetHeight)})),t.$$set=t=>{"class"in t&&n(0,c=t.class),"rippleBlur"in t&&n(1,l=t.rippleBlur),"speed"in t&&n(2,u=t.speed),"color"in t&&n(3,a=t.color),"fontSize"in t&&n(4,f=t.fontSize),"bgColor"in t&&n(5,p=t.bgColor),"bgHover"in t&&n(6,h=t.bgHover),"bgActive"in t&&n(7,$=t.bgActive),"transition"in t&&n(8,g=t.transition),"rippleColor"in t&&n(9,m=t.rippleColor),"round"in t&&n(10,b=t.round),"height"in t&&n(11,C=t.height),"width"in t&&n(12,w=t.width),"sizeIn"in t&&n(13,v=t.sizeIn),"opacityIn"in t&&n(14,L=t.opacityIn),"disabled"in t&&n(15,x=t.disabled),"$$scope"in t&&n(26,s=t.$$scope)},t.$$.update=()=>{66060288&t.$$.dirty[0]&&(n(22,M=jt(_/2-qt.x)),n(23,A=jt(E/2-qt.y)),n(24,B=_/2+M),n(25,j=E/2+A),S=St(B**2.2+j**2.2))},[c,l,u,a,f,p,h,$,g,m,b,C,w,v,L,x,k,I,r,t=>{const e=I.getBoundingClientRect();k.add({x:t.clientX-e.x,y:t.clientY-e.y,size:S}),clearTimeout(P),P=setTimeout((()=>k.clear()),u+2*u),z("click",t)},_,E,M,A,B,j,s,i,function(t){tt[t?"unshift":"push"]((()=>{I=t,n(17,I)}))}]}var Rt=class extends vt{constructor(t){super(),wt(this,t,Qt,Gt,w,{class:0,rippleBlur:1,speed:2,color:3,fontSize:4,bgColor:5,bgHover:6,bgActive:7,transition:8,rippleColor:9,round:10,height:11,width:12,sizeIn:13,opacityIn:14,disabled:15,ripples:16},null,[-1,-1])}get ripples(){return this.$$.ctx[16]}},Ut=t=>({}),Xt=t=>({}),Jt=t=>({}),Kt=t=>({});function te(t){let e,n,r,o;const i=t[4].zw,s=x(i,t,t[6],Kt),c=t[4].t,l=x(c,t,t[6],Xt);return{c(){e=q("div"),n=q("span"),s&&s.c(),r=q("span"),l&&l.c(),Y(n,"class","zw-3lrIhb"),Y(r,"class","t-1ictZc"),Y(e,"class","l-mPsb6a"),V(e,"--hoverColor",t[2])},m(t,i){D(t,e,i),O(e,n),s&&s.m(n,null),O(e,r),l&&l.m(r,null),o=!0},p(t,n){s&&s.p&&(!o||64&n)&&I(s,i,t,t[6],o?k(i,t[6],n,Jt):_(t[6]),Kt),l&&l.p&&(!o||64&n)&&I(l,c,t,t[6],o?k(c,t[6],n,Ut):_(t[6]),Xt),4&n&&V(e,"--hoverColor",t[2])},i(t){o||(ht(s,t),ht(l,t),o=!0)},o(t){$t(s,t),$t(l,t),o=!1},d(t){t&&Z(e),s&&s.d(t),l&&l.d(t)}}}function ee(t){let e,n;return e=new Rt({props:{width:t[0],height:t[1],bgColor:"transparent",bgHover:"rgba(var(--main-white-rgb), 0.06)",bgActive:"rgba(0, 0, 0, 0.06)",transition:".1s",$$slots:{default:[te]},$$scope:{ctx:t}}}),e.$on("click",t[5]),{c(){gt(e.$$.fragment)},m(t,r){mt(e,t,r),n=!0},p(t,[n]){const r={};1&n&&(r.width=t[0]),2&n&&(r.height=t[1]),68&n&&(r.$$scope={dirty:n,ctx:t}),e.$set(r)},i(t){n||(ht(e.$$.fragment,t),n=!0)},o(t){$t(e.$$.fragment,t),n=!1},d(t){bt(e,t)}}}function ne(t,e,n){let{$$slots:r={},$$scope:o}=e;const i=J();let{width:s}=e,{height:c}=e,{hoverColor:l=null}=e;return t.$$set=t=>{"width"in t&&n(0,s=t.width),"height"in t&&n(1,c=t.height),"hoverColor"in t&&n(2,l=t.hoverColor),"$$scope"in t&&n(6,o=t.$$scope)},[s,c,l,i,r,()=>i("click"),o]}var re=class extends vt{constructor(t){super(),wt(this,t,ne,ee,w,{width:0,height:1,hoverColor:2})}};function oe(t){let e,n;return{c(){e=F("svg"),n=F("path"),Y(n,"fill","currentColor"),Y(n,"d","M17.1870269,5.90925826 L18.670875,5.60561111 C19.3034125,5.47617184 19.9478108,5.76601219 20.2706336,6.32515769 L21.0498744,7.67484231 C21.3726972,8.23398781 21.3015072,8.9369733 20.8731407,9.42004724 L19.869232,10.552167 C19.955984,11.026532 20,11.5105366 20,12 C20,12.4894634 19.955984,12.973468 19.869232,13.447833 L20.8731407,14.5799528 C21.3015072,15.0630267 21.3726972,15.7660122 21.0498744,16.3251577 L20.2706336,17.6748423 C19.9478108,18.2339878 19.3034125,18.5238282 18.670875,18.3943889 L17.1870269,18.0907417 C16.4472202,18.7213719 15.5983246,19.2134101 14.6804637,19.5397477 L14.2022657,20.9743416 C13.9980947,21.5868549 13.4248864,22 12.7792408,22 L11.2207592,22 C10.5751136,22 10.0019053,21.5868549 9.79773427,20.9743416 L9.31953628,19.5397477 C8.40167539,19.2134101 7.55277982,18.7213719 6.81297313,18.0907417 L5.32912501,18.3943889 C4.69658748,18.5238282 4.05218916,18.2339878 3.72936635,17.6748423 L2.95012557,16.3251577 C2.62730277,15.7660122 2.69849282,15.0630267 3.12685929,14.5799528 L4.13076802,13.447833 C4.04401605,12.973468 4,12.4894634 4,12 C4,11.5105366 4.04401605,11.026532 4.13076802,10.552167 L3.12685929,9.42004724 C2.69849282,8.9369733 2.62730277,8.23398781 2.95012557,7.67484231 L3.72936635,6.32515769 C4.05218916,5.76601219 4.69658748,5.47617184 5.32912501,5.60561111 L6.81297313,5.90925826 C7.55277982,5.27862815 8.40167539,4.78658986 9.31953628,4.46025233 L9.79773427,3.02565835 C10.0019053,2.41314514 10.5751136,2 11.2207592,2 L12.7792408,2 C13.4248864,2 13.9980947,2.41314514 14.2022657,3.02565835 L14.6804637,4.46025233 C15.5983246,4.78658986 16.4472202,5.27862815 17.1870269,5.90925826 Z M14.1326282,5.33065677 C13.9806142,5.28209151 13.8609139,5.16388061 13.8104493,5.0124866 L13.2535824,3.34188612 C13.1855254,3.13771505 12.994456,3 12.7792408,3 L11.2207592,3 C11.005544,3 10.8144746,3.13771505 10.7464176,3.34188612 L10.1895507,5.0124866 C10.1390861,5.16388061 10.0193858,5.28209151 9.86737183,5.33065677 C8.91148077,5.63604385 8.03422671,6.14493515 7.29282481,6.8189531 C7.17476231,6.92628523 7.01256297,6.97082432 6.8562438,6.93883595 L5.12864464,6.58530883 C4.9177988,6.54216241 4.70299936,6.63877585 4.59539176,6.82515769 L3.81615098,8.17484231 C3.70854337,8.36122415 3.73227339,8.59555264 3.87506221,8.75657729 L5.04377846,10.0745524 C5.1495098,10.1937869 5.1920708,10.3562805 5.15836615,10.5120367 C5.05341889,10.9970196 5,11.4948846 5,12 C5,12.5051154 5.05341889,13.0029804 5.15836615,13.4879633 C5.1920708,13.6437195 5.1495098,13.8062131 5.04377846,13.9254476 L3.87506221,15.2434227 C3.73227339,15.4044474 3.70854337,15.6387759 3.81615098,15.8251577 L4.59539176,17.1748423 C4.70299936,17.3612241 4.9177988,17.4578376 5.12864464,17.4146912 L6.8562438,17.061164 C7.01256297,17.0291757 7.17476231,17.0737148 7.29282481,17.1810469 C8.03422671,17.8550648 8.91148077,18.3639561 9.86737183,18.6693432 C10.0193858,18.7179085 10.1390861,18.8361194 10.1895507,18.9875134 L10.7464176,20.6581139 C10.8144746,20.862285 11.005544,21 11.2207592,21 L12.7792408,21 C12.994456,21 13.1855254,20.862285 13.2535824,20.6581139 L13.8104493,18.9875134 C13.8609139,18.8361194 13.9806142,18.7179085 14.1326282,18.6693432 C15.0885192,18.3639561 15.9657733,17.8550648 16.7071752,17.1810469 C16.8252377,17.0737148 16.987437,17.0291757 17.1437562,17.061164 L18.8713554,17.4146912 C19.0822012,17.4578376 19.2970006,17.3612241 19.4046082,17.1748423 L20.183849,15.8251577 C20.2914566,15.6387759 20.2677266,15.4044474 20.1249378,15.2434227 L18.9562215,13.9254476 C18.8504902,13.8062131 18.8079292,13.6437195 18.8416339,13.4879633 C18.9465811,13.0029804 19,12.5051154 19,12 C19,11.4948846 18.9465811,10.9970196 18.8416339,10.5120367 C18.8079292,10.3562805 18.8504902,10.1937869 18.9562215,10.0745524 L20.1249378,8.75657729 C20.2677266,8.59555264 20.2914566,8.36122415 20.183849,8.17484231 L19.4046082,6.82515769 C19.2970006,6.63877585 19.0822012,6.54216241 18.8713554,6.58530883 L17.1437562,6.93883595 C16.987437,6.97082432 16.8252377,6.92628523 16.7071752,6.8189531 C15.9657733,6.14493515 15.0885192,5.63604385 14.1326282,5.33065677 Z M12,16 C9.790861,16 8,14.209139 8,12 C8,9.790861 9.790861,8 12,8 C14.209139,8 16,9.790861 16,12 C16,14.209139 14.209139,16 12,16 Z M12,15 C13.6568542,15 15,13.6568542 15,12 C15,10.3431458 13.6568542,9 12,9 C10.3431458,9 9,10.3431458 9,12 C9,13.6568542 10.3431458,15 12,15 Z"),Y(e,"data-zwicon","cog"),Y(e,"xmlns","http://www.w3.org/2000/svg"),Y(e,"width",t[0]),Y(e,"height",t[0]),Y(e,"viewBox","0 0 24 24")},m(t,r){D(t,e,r),O(e,n)},p(t,[n]){1&n&&Y(e,"width",t[0]),1&n&&Y(e,"height",t[0])},i:d,o:d,d(t){t&&Z(e)}}}function ie(t,e,n){let{sz:r=24}=e;return t.$$set=t=>{"sz"in t&&n(0,r=t.sz)},[r]}var se=class extends vt{constructor(t){super(),wt(this,t,ie,oe,w,{sz:0})}};function ce(t){let e,n;return{c(){e=F("svg"),n=F("path"),Y(n,"fill","currentColor"),Y(n,"d","M20,10.7359622 L20,18.5 C20,19.8807119 18.8807119,21 17.5,21 L14.5,21 C14.2238576,21 14,20.7761424 14,20.5 L14,14.5 C14,14.2238576 13.7761424,14 13.5,14 L10.5,14 C10.2238576,14 10,14.2238576 10,14.5 L10,20.5 C10,20.7761424 9.77614237,21 9.5,21 L6.5,21 C5.11928813,21 4,19.8807119 4,18.5 L4,10.7359622 L3.81785363,10.8859651 C3.60469098,11.0615108 3.28958059,11.0310163 3.11403488,10.8178536 C2.93848917,10.604691 2.96898373,10.2895806 3.18214637,10.1140349 L11.6821464,3.11403488 C11.8667743,2.96198837 12.1332257,2.96198837 12.3178536,3.11403488 L20.8178536,10.1140349 C21.0310163,10.2895806 21.0615108,10.604691 20.8859651,10.8178536 C20.7104194,11.0310163 20.395309,11.0615108 20.1821464,10.8859651 L20,10.7359622 Z M19.0066996,9.91795013 L12,4.14772693 L4.9933004,9.91795013 C4.99770753,9.94464611 5,9.97205534 5,10 L5,18.5 C5,19.3284271 5.67157288,20 6.5,20 L9,20 L9,14.5 C9,13.6715729 9.67157288,13 10.5,13 L13.5,13 C14.3284271,13 15,13.6715729 15,14.5 L15,20 L17.5,20 C18.3284271,20 19,19.3284271 19,18.5 L19,10 C19,9.97205534 19.0022925,9.94464611 19.0066996,9.91795013 L19.0066996,9.91795013 Z"),Y(e,"data-zwicon","home"),Y(e,"xmlns","http://www.w3.org/2000/svg"),Y(e,"width",t[0]),Y(e,"height",t[0]),Y(e,"viewBox","0 0 24 24")},m(t,r){D(t,e,r),O(e,n)},p(t,[n]){1&n&&Y(e,"width",t[0]),1&n&&Y(e,"height",t[0])},i:d,o:d,d(t){t&&Z(e)}}}function le(t,e,n){let{sz:r=24}=e;return t.$$set=t=>{"sz"in t&&n(0,r=t.sz)},[r]}var ue=class extends vt{constructor(t){super(),wt(this,t,le,ce,w,{sz:0})}};function ae(t){let e,n;return{c(){e=F("svg"),n=F("path"),Y(n,"fill","currentColor"),Y(n,"d","M15.5,6.20710678 L4,17.7071068 L4,20 L6.29289322,20 L17.7928932,8.5 L15.5,6.20710678 Z M16.2071068,5.5 L18.5,7.79289322 L19.7928932,6.5 L17.5,4.20710678 L16.2071068,5.5 L16.2071068,5.5 Z M3,20.5 L3,17.5 C3,17.3673918 3.05267842,17.2402148 3.14644661,17.1464466 L17.1464466,3.14644661 C17.3417088,2.95118446 17.6582912,2.95118446 17.8535534,3.14644661 L20.8535534,6.14644661 C21.0488155,6.34170876 21.0488155,6.65829124 20.8535534,6.85355339 L6.85355339,20.8535534 C6.7597852,20.9473216 6.63260824,21 6.5,21 L3.5,21 C3.22385763,21 3,20.7761424 3,20.5 Z"),Y(e,"data-zwicon","pencil"),Y(e,"xmlns","http://www.w3.org/2000/svg"),Y(e,"width",t[0]),Y(e,"height",t[0]),Y(e,"viewBox","0 0 24 24")},m(t,r){D(t,e,r),O(e,n)},p(t,[n]){1&n&&Y(e,"width",t[0]),1&n&&Y(e,"height",t[0])},i:d,o:d,d(t){t&&Z(e)}}}function fe(t,e,n){let{sz:r=24}=e;return t.$$set=t=>{"sz"in t&&n(0,r=t.sz)},[r]}var de=class extends vt{constructor(t){super(),wt(this,t,fe,ae,w,{sz:0})}};function pe(t){let e;return{c(){e=W("Frontier Slither")},m(t,n){D(t,e,n)},d(t){t&&Z(e)}}}function he(t){let e,n;return e=new ue({props:{slot:"zw"}}),{c(){gt(e.$$.fragment)},m(t,r){mt(e,t,r),n=!0},p:d,i(t){n||(ht(e.$$.fragment,t),n=!0)},o(t){$t(e.$$.fragment,t),n=!1},d(t){bt(e,t)}}}function $e(t){let e;return{c(){e=W("Visit slither-io.jp")},m(t,n){D(t,e,n)},p:d,d(t){t&&Z(e)}}}function ge(t){let e,n;return e=new de({props:{slot:"zw"}}),{c(){gt(e.$$.fragment)},m(t,r){mt(e,t,r),n=!0},p:d,i(t){n||(ht(e.$$.fragment,t),n=!0)},o(t){$t(e.$$.fragment,t),n=!1},d(t){bt(e,t)}}}function me(t){let e;return{c(){e=W("Rating & Support for Frontier")},m(t,n){D(t,e,n)},p:d,d(t){t&&Z(e)}}}function be(t){let e,n;return e=new se({props:{slot:"zw"}}),{c(){gt(e.$$.fragment)},m(t,r){mt(e,t,r),n=!0},p:d,i(t){n||(ht(e.$$.fragment,t),n=!0)},o(t){$t(e.$$.fragment,t),n=!1},d(t){bt(e,t)}}}function Ce(t){let e;return{c(){e=W("Options")},m(t,n){D(t,e,n)},p:d,d(t){t&&Z(e)}}}function we(t){let e,n,r,o,i,s,c,l,u;return o=new re({props:{width:"100%",height:"40px",hoverColor:"rgb(var(--link-rgb))",$$slots:{t:[$e],zw:[he]},$$scope:{ctx:t}}}),o.$on("click",xe),i=new re({props:{width:"100%",height:"40px",hoverColor:"rgb(var(--link-rgb))",$$slots:{t:[me],zw:[ge]},$$scope:{ctx:t}}}),i.$on("click",ze),s=new re({props:{width:"100%",height:"40px",hoverColor:"rgb(var(--link-rgb))",$$slots:{t:[Ce],zw:[be]},$$scope:{ctx:t}}}),s.$on("click",ke),{c(){e=q("div"),n=q("div"),r=q("button"),gt(o.$$.fragment),gt(i.$$.fragment),gt(s.$$.fragment),Y(r,"id","play"),Y(r,"data-text","Play slither.io"),Y(n,"class","box-UStM65"),Y(e,"class","primary-WdivBA")},m(t,a){D(t,e,a),O(e,n),O(n,r),mt(o,e,null),mt(i,e,null),mt(s,e,null),c=!0,l||(u=N(r,"click",Le),l=!0)},p(t,e){const n={};1&e&&(n.$$scope={dirty:e,ctx:t}),o.$set(n);const r={};1&e&&(r.$$scope={dirty:e,ctx:t}),i.$set(r);const c={};1&e&&(c.$$scope={dirty:e,ctx:t}),s.$set(c)},i(t){c||(ht(o.$$.fragment,t),ht(i.$$.fragment,t),ht(s.$$.fragment,t),c=!0)},o(t){$t(o.$$.fragment,t),$t(i.$$.fragment,t),$t(s.$$.fragment,t),c=!1},d(t){t&&Z(e),bt(o),bt(i),bt(s),l=!1,u()}}}function ve(t){let e,n,r;return e=new yt({}),n=new Bt({props:{modversion:ye,width:"340px",height:"auto",$$slots:{main:[we],title:[pe]},$$scope:{ctx:t}}}),{c(){gt(e.$$.fragment),gt(n.$$.fragment)},m(t,o){mt(e,t,o),mt(n,t,o),r=!0},p(t,[e]){const r={};1&e&&(r.$$scope={dirty:e,ctx:t}),n.$set(r)},i(t){r||(ht(e.$$.fragment,t),ht(n.$$.fragment,t),r=!0)},o(t){$t(e.$$.fragment,t),$t(n.$$.fragment,t),r=!1},d(t){bt(e,t),bt(n,t)}}}var[ye,Le,xe,ze,ke]=(t=>{if(null==t||null==t.runtime||null==t.tabs){const t=()=>{};return["N/A",t,t,t,t]}return[t.runtime.getManifest().version,()=>t.tabs.create({url:"http://slither.io/"}),()=>t.tabs.create({url:"https://slither-io.jp/"}),()=>t.tabs.create({url:"https://chrome.google.com/webstore/detail/frontier-slither/jkfiikecahagonfbnjfhjphocjlaacmc/reviews"}),()=>t.runtime.openOptionsPage()]})(chrome),Ie=class extends vt{constructor(t){super(),wt(this,t,null,ve,w,{})}};(async()=>{await new Promise((t=>{const e=()=>t();"loading"!==document.readyState?u(e):document.addEventListener("DOMContentLoaded",e)})),new Ie({target:document.body})})();