(function(e){function t(t){for(var n,i,s=t[0],c=t[1],u=t[2],p=0,f=[];p<s.length;p++)i=s[p],Object.prototype.hasOwnProperty.call(o,i)&&o[i]&&f.push(o[i][0]),o[i]=0;for(n in c)Object.prototype.hasOwnProperty.call(c,n)&&(e[n]=c[n]);l&&l(t);while(f.length)f.shift()();return a.push.apply(a,u||[]),r()}function r(){for(var e,t=0;t<a.length;t++){for(var r=a[t],n=!0,s=1;s<r.length;s++){var c=r[s];0!==o[c]&&(n=!1)}n&&(a.splice(t--,1),e=i(i.s=r[0]))}return e}var n={},o={app:0},a=[];function i(t){if(n[t])return n[t].exports;var r=n[t]={i:t,l:!1,exports:{}};return e[t].call(r.exports,r,r.exports,i),r.l=!0,r.exports}i.m=e,i.c=n,i.d=function(e,t,r){i.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},i.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},i.t=function(e,t){if(1&t&&(e=i(e)),8&t)return e;if(4&t&&"object"===typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(i.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var n in e)i.d(r,n,function(t){return e[t]}.bind(null,n));return r},i.n=function(e){var t=e&&e.__esModule?function(){return e["default"]}:function(){return e};return i.d(t,"a",t),t},i.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},i.p="/";var s=window["webpackJsonp"]=window["webpackJsonp"]||[],c=s.push.bind(s);s.push=t,s=s.slice();for(var u=0;u<s.length;u++)t(s[u]);var l=c;a.push([0,"chunk-vendors"]),r()})({0:function(e,t,r){e.exports=r("56d7")},"034f":function(e,t,r){"use strict";var n=r("19b3"),o=r.n(n);o.a},"17a9":function(e,t,r){},"19b3":function(e,t,r){},"388b":function(e,t,r){},"4c7b":function(e,t,r){},"56d7":function(e,t,r){"use strict";r.r(t);r("e260"),r("e6cf"),r("cca6"),r("a79d");var n=r("2b0e"),o=function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("v-app",{class:{blur:e.blur},attrs:{id:"app"}},[r("Map"),r("router-view"),r("v-alert",{staticClass:"noblur",attrs:{value:e.alertVisible,dense:"",dismissible:"",type:"error"},on:{input:e.close}},[e._v(" "+e._s(e.errorMsg)+" ")])],1)},a=[],i=(r("a4d3"),r("4de4"),r("4160"),r("e439"),r("dbb4"),r("b64b"),r("159b"),r("2fa7")),s=r("2f62"),c=function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("div",{ref:"map"})},u=[],l=(r("d81d"),r("fb6a"),r("595b")),p={name:"Map",beforeCreate:function(){this.$store.dispatch("fetchPoints")},mounted:function(){var e=this.map=new mapboxgl.Map({container:this.$refs.map,style:"mapbox://styles/mapbox/light-v10"});window._map=e,e.on("load",(function(){e.addSource("line",{type:"geojson",lineMetrics:!0,data:{type:"Feature",properties:{},geometry:{type:"LineString",coordinates:[]}}}),e.addLayer({type:"line",source:"line",id:"line",paint:{"line-color":"red","line-width":5,"line-gradient":["interpolate",["linear"],["line-progress"],0,"blue",.1,"royalblue",.3,"cyan",.5,"lime",.7,"yellow",1,"red"]},layout:{"line-cap":"round","line-join":"round"}})}))},computed:{line:function(){var e=this.$store.state.results;return e.length?l["lineString"](e.map((function(e){var t=e.latlng;return[t.longitude,t.latitude]}))):null},bounds:function(){if(this.line){var e=l["bbox"](this.line);return[e.slice(0,2),e.slice(2)]}}},watch:{bounds:function(e){e&&e.length&&this.updateMap(e,this.line)}},methods:{updateMap:function(e,t){var r=this.map;r.fitBounds(e,{padding:20,maxZoom:15,animate:!1});var n=r.getSource("line");n?n.setData(t):r.on("load",(function(){r.getSource("line").setData(t)}))}}},f=p,b=(r("acde"),r("2877")),d=Object(b["a"])(f,c,u,!1,null,"30e6b93a",null),m=d.exports;function g(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function v(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?g(r,!0).forEach((function(t){Object(i["a"])(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):g(r).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}var h={components:{Map:m},data:function(){return{alertVisible:!1}},watch:{errorMsg:function(){this.alertVisible=!0}},computed:v({},Object(s["d"])(["blur","errorMsg"])),methods:{close:function(){this.alertVisible=!1}}},y=h,O=(r("034f"),r("6544")),w=r.n(O),j=r("0798"),P=r("7496"),k=Object(b["a"])(y,o,a,!1,null,null,null),S=k.exports;w()(k,{VAlert:j["a"],VApp:P["a"]});var _=r("8c4f"),x=(r("accc"),r("b0c0"),r("284c")),D=r("5a0c"),E=r.n(D),V=(r("0d03"),r("d3b7"),r("96cf"),r("89ba"));function T(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function $(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?T(r,!0).forEach((function(t){Object(i["a"])(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):T(r).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}var C=function(){var e=Object(V["a"])(regeneratorRuntime.mark((function e(t){var r,n,o,a=arguments;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return r=a.length>1&&void 0!==a[1]?a[1]:{},r.headers=$({"Content-Type":"application/json","X-LC-Id":Object({NODE_ENV:"production",BASE_URL:"/"}).VUE_APP_LC_ID,"X-LC-Key":Object({NODE_ENV:"production",BASE_URL:"/"}).VUE_APP_LC_KEY,"X-LC-Session":q.state.user.sessionToken},r.headers),r.data&&(r.body=JSON.stringify(r.data),delete r.data),e.prev=3,e.next=6,fetch(Object({NODE_ENV:"production",BASE_URL:"/"}).VUE_APP_API_BASE_URL+t,r);case 6:return n=e.sent,e.next=9,n.json();case 9:if(o=e.sent,!n.ok){e.next=14;break}return e.abrupt("return",o);case 14:throw o;case 15:e.next=20;break;case 17:e.prev=17,e.t0=e["catch"](3),q.commit("setErrorMsg",e.t0&&e.t0.error||e.t0);case 20:case"end":return e.stop()}}),e,null,[[3,17]])})));return function(t){return e.apply(this,arguments)}}(),M=(r("99af"),r("a15b"),r("4fad"),r("bf2d")),R=r("e587");function L(e){return Object.entries(e).map((function(e){var t=Object(R["a"])(e,2),r=t[0],n=t[1];return"".concat(r,"=").concat("object"===Object(M["a"])(n)?JSON.stringify(n):n)})).join("&")}function A(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:new Date;e=e||t-864e5;var r={where:{time:{$gte:{__type:"Date",iso:new Date(e).toISOString()},$lte:{__type:"Date",iso:new Date(t).toISOString()}}},keys:"latlng,time,s",order:"time",limit:1e3};return C("/classes/Point?".concat(L(r)))}function F(e){return C("/login",{method:"POST",data:e})}function N(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function B(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?N(r,!0).forEach((function(t){Object(i["a"])(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):N(r).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}n["a"].use(s["a"]);var I=E()().add(1,"h").startOf("h"),U=[I.subtract(1,"d"),I],J=function(e){e.subscribe((function(e){var t=e.type,r=e.payload;"setUser"===t&&window.localStorage.setItem("user",JSON.stringify(r))}))},Y=window.localStorage.getItem("user"),X=Y?JSON.parse(Y):{},q=new s["a"].Store({plugins:[J],state:{user:B({name:null,sessionToken:null},X),blur:!1,errorMsg:"",dateRange:U.map((function(e){return e.format("YYYY-MM-DD")})),timeFrom:"00:00",timeTo:I.format("HH:mm"),results:[],picking:!1},getters:{range:function(e){var t=e.dateRange,r=e.timeFrom,n=e.timeTo;return[E()(t[0]+" "+r).toISOString(),E()(t[1]+" "+n).toISOString()]}},mutations:{setUser:function(e,t){return e.user=t},setBlur:function(e,t){return e.blur=t},setErrorMsg:function(e,t){return e.errorMsg=t},changeDateRange:function(e,t){return e.dateRange=t},changeTimeFrom:function(e,t){return e.timeFrom=t},changeTimeTo:function(e,t){return e.timeTo=t},setResults:function(e,t){return e.results=t},togglePicker:function(e){return e.picking=!e.picking}},actions:{fetchPoints:function(e){var t=e.commit,r=e.getters;return A.apply(void 0,Object(x["a"])(r.range)).then((function(e){var r=e.results;r&&(r.length>1e3?(t("setErrorMsg","too many points"),console.error("too many points:",r)):t("setResults",r))}))},login:function(e,t){var r=e.commit,n=t.name,o=t.password;return F({username:n,password:o}).then((function(e){var t=e.username,n=e.sessionToken;r("setUser",{name:t,sessionToken:n})}))}},modules:{}}),H=function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("Picker")},K=[],Q=function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("v-container",{staticClass:"container",attrs:{fluid:""}},[r("v-card",{directives:[{name:"show",rawName:"v-show",value:e.picking,expression:"picking"}],attrs:{color:"#fff"}},[r("v-date-picker",{attrs:{"no-title":"","full-width":"","show-current":"",range:""},model:{value:e.dateRange,callback:function(t){e.dateRange=t},expression:"dateRange"}}),r("v-slider",{attrs:{"tick-labels":e.ticksLabels,max:24,color:"grey","track-color":"primary",step:"1",ticks:"always","thumb-label":""},model:{value:e.timeFrom,callback:function(t){e.timeFrom=t},expression:"timeFrom"}}),r("v-slider",{attrs:{"tick-labels":e.ticksLabels,max:24,"track-color":"grey",step:"1",ticks:"always","thumb-label":""},model:{value:e.timeTo,callback:function(t){e.timeTo=t},expression:"timeTo"}}),r("v-card-actions",{staticClass:"actions"},[r("v-btn",{attrs:{depressed:"",color:"primary"},on:{click:e.query}},[e._v("Query")])],1)],1),r("v-btn",{directives:[{name:"show",rawName:"v-show",value:!e.picking,expression:"!picking"}],staticClass:"fab",attrs:{absolute:"",fab:"",right:"",color:"primary"},on:{click:e.showPicker}},[r("v-icon",[e._v("mdi-calendar-range")])],1)],1)},Z=[],z=(r("4e82"),r("ac1f"),r("1276"),{name:"Picker",data:function(){return{ticksLabels:Object(x["a"])(Array(25)).map((function(e,t){return t%6===0?""+t:""}))}},computed:{picking:function(){return this.$store.state.picking},timeFrom:{get:function(){return this.$store.state.timeFrom.split(":")[0]},set:function(e){this.$store.commit("changeTimeFrom",e+":00")}},timeTo:{get:function(){return this.$store.state.timeTo.split(":")[0]},set:function(e){this.$store.commit("changeTimeTo",e+":00")}},dateRange:{get:function(){return this.$store.state.dateRange},set:function(e){this.$store.commit("changeDateRange",e.sort())}}},methods:{query:function(){this.$store.dispatch("fetchPoints"),this.$store.commit("togglePicker")},showPicker:function(){this.$store.commit("togglePicker")}}}),G=z,W=(r("9b5d"),r("8336")),ee=r("b0af"),te=r("99d9"),re=r("a523"),ne=r("2e4b"),oe=r("132d"),ae=r("ba0d"),ie=Object(b["a"])(G,Q,Z,!1,null,"63030ff9",null),se=ie.exports;w()(ie,{VBtn:W["a"],VCard:ee["a"],VCardActions:te["a"],VContainer:re["a"],VDatePicker:ne["a"],VIcon:oe["a"],VSlider:ae["a"]});var ce={components:{Picker:se}},ue=ce,le=Object(b["a"])(ue,H,K,!1,null,null,null),pe=le.exports,fe=function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("v-container",{staticClass:"noblur"},[r("v-row",{attrs:{align:"center",justify:"center"}},[r("v-col",{attrs:{cols:"12",sm:"8",md:"4"}},[r("v-card",{staticClass:"elevation-12"},[r("v-toolbar",{attrs:{color:"primary",dark:"",flat:""}},[r("v-toolbar-title",[e._v("Login")]),r("v-spacer")],1),r("v-card-text",[r("v-form",{attrs:{id:"login"},on:{submit:e.onSubmit}},[r("v-text-field",{attrs:{label:"Name",name:"name","prepend-icon":"person",type:"text"}}),r("v-text-field",{attrs:{label:"Password",name:"password","prepend-icon":"lock",type:"password"}})],1)],1),r("v-card-actions",[r("v-spacer"),r("v-btn",{attrs:{type:"submit",form:"login",color:"primary"}},[e._v("Login")])],1)],1)],1)],1)],1)},be=[];function de(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function me(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?de(r,!0).forEach((function(t){Object(i["a"])(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):de(r).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}var ge={created:function(){this.setBlur(!0)},beforeDestroy:function(){this.setBlur(!1)},methods:me({onSubmit:function(e){var t=this;e.preventDefault();var r=e.target.name.value,n=e.target.password.value;this.login({name:r,password:n}).then((function(){t.$router.push({path:"/"})}))}},Object(s["c"])(["setBlur"]),{},Object(s["b"])(["login"]))},ve=ge,he=(r("fb9a"),r("62ad")),ye=r("4bd4"),Oe=r("0fd9"),we=r("2fa4"),je=r("8654"),Pe=r("71d9"),ke=r("2a7f"),Se=Object(b["a"])(ve,fe,be,!1,null,"cc3643f4",null),_e=Se.exports;w()(Se,{VBtn:W["a"],VCard:ee["a"],VCardActions:te["a"],VCardText:te["b"],VCol:he["a"],VContainer:re["a"],VForm:ye["a"],VRow:Oe["a"],VSpacer:we["a"],VTextField:je["a"],VToolbar:Pe["a"],VToolbarTitle:ke["a"]}),n["a"].use(_["a"]);var xe=[{path:"/login",component:_e,beforeEnter:function(e,t,r){q.state.user.sessionToken?r({path:"/",replace:!0}):r()}},{path:"/",component:pe,beforeEnter:function(e,t,r){q.state.user.sessionToken?r():r({path:"/login",replace:!0})}}],De=new _["a"]({mode:"history",base:"/",routes:xe}),Ee=De,Ve=r("f309");n["a"].use(Ve["a"]);var Te=new Ve["a"]({icons:{iconfont:"mdi"}});n["a"].config.productionTip=!1,new n["a"]({router:Ee,store:q,vuetify:Te,render:function(e){return e(S)}}).$mount("#app")},"9b5d":function(e,t,r){"use strict";var n=r("388b"),o=r.n(n);o.a},acde:function(e,t,r){"use strict";var n=r("4c7b"),o=r.n(n);o.a},fb9a:function(e,t,r){"use strict";var n=r("17a9"),o=r.n(n);o.a}});
//# sourceMappingURL=app.c363bb12.js.map