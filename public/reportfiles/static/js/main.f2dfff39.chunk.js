(this["webpackJsonpnanaimg-reportqueue"]=this["webpackJsonpnanaimg-reportqueue"]||[]).push([[0],{25:function(t,e,r){},26:function(t,e,r){},44:function(t,e,r){"use strict";r.r(e);var o=r(0),n=r(5),c=r.n(n),a=r(15),s=r.n(a),p=(r(25),r(4)),u=r(1),i=r(16),d=r(17),l=r(19),m=r(18),h=(r(26),r(2)),j=r.n(h),b=function(t){Object(l.a)(r,t);var e=Object(m.a)(r);function r(){var t;return Object(i.a)(this,r),(t=e.call(this)).goToPost=function(t){window.open("https://nanaimg.net/image/".concat(t.target.id.split("rb")[1]))},t.goToComment=function(t){window.open("https://nanaimg.net/comments/".concat(t.target.id.split("rc")[1]))},t.reportRemoveComment=function(e){j.a.delete("https://nanaimg.net/reports/comments/".concat(e.target.id.split("-")[1])).then((function(e){j.a.get("https://nanaimg.net/reports").then((function(e){t.setState(Object(u.a)(Object(u.a)({},t.state),{},{reports:Object(p.a)(e.data.reports)}))})).catch((function(t){console.log("An error occurred")}))})).catch((function(t){console.log("an error occurred")}))},t.reportRemovePost=function(e){j.a.delete("https://nanaimg.net/reports/posts/".concat(e.target.id.split("-")[1])).then((function(e){j.a.get("https://nanaimg.net/reports").then((function(e){t.setState(Object(u.a)(Object(u.a)({},t.state),{},{reports:Object(p.a)(e.data.reports)}))})).catch((function(t){console.log("An error occurred")}))})).catch((function(t){console.log("an error occurred")}))},t.commentRemove=function(e){var r=new FormData;"other"!==document.querySelector("#crr".concat(e.target.id.split("-")[1])).textContent?r.append("reason",document.querySelector("#crr".concat(e.target.id.split("-")[1])).textContent):document.querySelector("#crt".concat(e.target.id.split("-")[1])).textContent.length>0?r.append("reason",document.querySelector("#crt".concat(e.target.id.split("-")[1])).textContent):r.append("reason","other"),j.a.post("https://nanaimg.net/reports/comment/remove/".concat(e.target.id.split("-")[1]),r).then((function(e){j.a.get("https://nanaimg.net/reports").then((function(e){t.setState(Object(u.a)(Object(u.a)({},t.state),{},{reports:Object(p.a)(e.data.reports)}))})).catch((function(t){console.log("An error occurred")}))})).catch((function(t){console.log("an error occurred")}))},t.postRemove=function(e){var r=new FormData;"other"!==document.querySelector("#prr".concat(e.target.id.split("-")[1])).textContent?r.append("reason",document.querySelector("#prr".concat(e.target.id.split("-")[1])).textContent):document.querySelector("#prt".concat(e.target.id.split("-")[1])).textContent.length>0?r.append("reason",document.querySelector("#prt".concat(e.target.id.split("-")[1])).textContent):r.append("reason","other"),j.a.post("https://nanaimg.net/reports/post/remove/".concat(e.target.id.split("-")[1]),r).then((function(e){j.a.get("https://nanaimg.net/reports").then((function(e){t.setState(Object(u.a)(Object(u.a)({},t.state),{},{reports:Object(p.a)(e.data.reports)}))})).catch((function(t){console.log("An error occurred")}))})).catch((function(t){console.log("an error occurred")}))},t.manifestoRemove=function(e){var r=new FormData;"other"!==document.querySelector("#prr".concat(e.target.id.split("-")[1])).textContent?r.append("reason",document.querySelector("#prr".concat(e.target.id.split("-")[1])).textContent):document.querySelector("#prt".concat(e.target.id.split("-")[1])).textContent.length>0?r.append("reason",document.querySelector("#prt".concat(e.target.id.split("-")[1])).textContent):r.append("reason","other"),j.a.post("https://nanaimg.net/reports/manifesto/remove/".concat(e.target.id.split("-")[1]),r).then((function(e){j.a.get("https://nanaimg.net/reports").then((function(e){t.setState(Object(u.a)(Object(u.a)({},t.state),{},{reports:Object(p.a)(e.data.reports)}))})).catch((function(t){console.log("An error occurred")}))})).catch((function(t){console.log("an error occurred")}))},t.clickNext=function(){j.a.get("https://nanaimg.net/reports/".concat(t.state.offset+1)).then((function(e){t.setState(Object(u.a)(Object(u.a)({},t.state),{},{reports:Object(p.a)(e.data.reports),offset:t.state.offset+1}))})).catch((function(t){console.log("An error occurred")}))},t.clickPrev=function(){j.a.get("https://nanaimg.net/reports/".concat(t.state.offset-1)).then((function(e){t.setState(Object(u.a)(Object(u.a)({},t.state),{},{reports:Object(p.a)(e.data.reports),offset:t.state.offset-1}))})).catch((function(t){console.log("An error occurred")}))},t.state={reports:[],offset:1},t}return Object(d.a)(r,[{key:"componentDidMount",value:function(){var t=this;j.a.get("https://nanaimg.net/reports").then((function(e){t.setState(Object(u.a)(Object(u.a)({},t.state),{},{reports:Object(p.a)(e.data.reports)}))})).catch((function(t){console.log("An error occurred")}))}},{key:"render",value:function(){var t=this;return Object(o.jsxs)(o.Fragment,{children:[Object(o.jsx)("h1",{id:"h1-report-queue",children:"Report Queue"}),Object(o.jsxs)("div",{id:"report-nav-buttons",children:[this.state.offset>1?Object(o.jsx)("button",{onClick:this.clickPrev,className:"buttons-report-queue-nav",children:"Prev Page"}):Object(o.jsx)(o.Fragment,{}),this.state.reports.length>49?Object(o.jsx)("button",{onClick:this.clickNext,className:"buttons-report-queue-nav",children:"Next Page"}):Object(o.jsx)(o.Fragment,{})]}),Object(o.jsxs)("div",{id:"report-queue-heading",children:[Object(o.jsx)("h2",{className:"report-queue-types rep-type",children:"Type"}),Object(o.jsx)("h2",{className:"report-queue-types rep-num",children:"ID"}),Object(o.jsx)("h2",{className:"report-queue-types rep-reas",children:"Report Reason"}),Object(o.jsx)("h2",{className:"report-queue-types rep-auth",children:"Post Author"}),Object(o.jsx)("h2",{className:"report-queue-types rep-date",children:"Post Date"}),Object(o.jsx)("h2",{className:"report-queue-types rep-post",children:"Post Text"}),Object(o.jsx)("h2",{className:"report-queue-types rep-rep",children:"Report Text"}),Object(o.jsx)("h2",{className:"report-queue-types rep-act",children:"Actions"})]}),Object(o.jsx)("div",{id:"div-report-actions"}),this.state.reports.map((function(e){return"post"===e.post_type?Object(o.jsxs)("div",{className:"report-queue-cards",id:"post-report".concat(e.post_number),children:[Object(o.jsx)("h2",{className:"report-queue-data rep-type",children:e.post_type}),Object(o.jsx)("h2",{className:"report-queue-data rep-num",children:e.post_number}),Object(o.jsx)("h2",{id:"prr".concat(e.post_number),className:"report-queue-data rep-reas",children:e.report_reason}),Object(o.jsx)("h2",{className:"report-queue-data rep-auth",children:e.post_name}),Object(o.jsx)("h2",{className:"report-queue-data rep-date",children:e.post_date}),Object(o.jsx)("h2",{className:"report-queue-data rep-post",children:e.post_text}),Object(o.jsx)("h2",{id:"prt".concat(e.post_number),className:"report-queue-data rep-rep",children:e.report_text}),Object(o.jsxs)("div",{className:"actions rep-act",children:[Object(o.jsx)("button",{id:"remi-".concat(e.post_number),className:"button-report-queue",onClick:t.postRemove,children:"Remove Post"}),Object(o.jsx)("button",{id:"remm-".concat(e.post_number),onClick:t.manifestoRemove,className:"button-report-queue",children:"Remove Manifesto"}),Object(o.jsx)("button",{id:"remrc-".concat(e.post_number),className:"button-report-queue",onClick:t.reportRemovePost,children:"Remove Report"}),Object(o.jsx)("button",{id:"rb".concat(e.post_number),className:"button-report-queue",onClick:t.goToPost,children:"Go to Post"})]})]},e.report_id):Object(o.jsxs)("div",{className:"report-queue-cards comment-report".concat(e.post_number),children:[Object(o.jsx)("h2",{className:"report-queue-data rep-type",children:e.post_type}),Object(o.jsx)("h2",{className:"report-queue-data rep-num",children:e.post_number}),Object(o.jsx)("h2",{id:"crr".concat(e.post_number),className:"report-queue-data rep-reas",children:e.report_reason}),Object(o.jsx)("h2",{className:"report-queue-data rep-auth",children:e.post_name}),Object(o.jsx)("h2",{className:"report-queue-data rep-date",children:e.post_date}),Object(o.jsx)("h2",{className:"report-queue-data rep-post",children:e.post_text}),Object(o.jsx)("h2",{id:"crt".concat(e.post_number),className:"report-queue-data rep-rep",children:e.report_text}),Object(o.jsxs)("div",{className:"actions",children:[Object(o.jsx)("button",{id:"remc-".concat(e.post_number),className:"button-report-queue",onClick:t.commentRemove,children:"Remove Comment"}),Object(o.jsx)("button",{id:"remrc-".concat(e.post_number),className:"button-report-queue",onClick:t.reportRemoveComment,children:"Remove Report"}),Object(o.jsx)("button",{id:"rc".concat(e.post_number),className:"button-report-queue",onClick:t.goToComment,children:"Go to Comment"})]})]},e.report_id)}))]})}}]),r}(c.a.Component),g=function(t){t&&t instanceof Function&&r.e(3).then(r.bind(null,45)).then((function(e){var r=e.getCLS,o=e.getFID,n=e.getFCP,c=e.getLCP,a=e.getTTFB;r(t),o(t),n(t),c(t),a(t)}))};s.a.render(Object(o.jsx)(b,{}),document.getElementById("root")),g()}},[[44,1,2]]]);
//# sourceMappingURL=main.f2dfff39.chunk.js.map