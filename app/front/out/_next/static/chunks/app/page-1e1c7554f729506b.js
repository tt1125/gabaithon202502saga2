(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[974],{3070:(e,t,l)=>{Promise.resolve().then(l.bind(l,1172))},1172:(e,t,l)=>{"use strict";l.r(t),l.d(t,{default:()=>V});var a=l(5155),r=l(757),s=l(2115),o=l(9047),n=l(3478),i=l(5592),c=l(7439),d=l(5683),u=l(7650);function m(e){let{onComplete:t}=e,[l,r]=(0,s.useState)(!1);return((0,s.useEffect)(()=>{r(!0);let e=setTimeout(()=>{null==t||t()},2e3);return()=>clearTimeout(e)},[t]),l)?(0,u.createPortal)((0,a.jsx)(d.N,{children:(0,a.jsxs)("div",{className:"fixed inset-0 pointer-events-none z-50",children:[(0,a.jsx)(n.P.div,{initial:{opacity:0},animate:{opacity:[0,1,0]},transition:{duration:.5,times:[0,.1,1]},className:"absolute inset-0 bg-white"}),(0,a.jsx)("div",{className:"absolute inset-0 flex items-center justify-center",children:[void 0,void 0,void 0].map((e,t)=>(0,a.jsx)(n.P.div,{initial:{scale:0,opacity:1},animate:{scale:2.5,opacity:0},transition:{duration:1,delay:.2*t,ease:"easeOut"},className:"absolute w-96 h-96 rounded-full border-2 border-purple-500",style:{background:"radial-gradient(circle, rgba(147,51,234,0.2) 0%, rgba(147,51,234,0) 70%)"}},t))}),(0,a.jsx)("div",{className:"absolute inset-0 flex items-center justify-center",children:[...Array(30)].map((e,t)=>(0,a.jsx)(n.P.div,{initial:{x:"-50%",y:"-50%",scale:0,opacity:1},animate:{x:"calc(-50% + ".concat((Math.random()-.5)*500,"px)"),y:"calc(-50% + ".concat((Math.random()-.5)*500,"px)"),scale:[0,1.5,0],opacity:[1,1,0]},transition:{duration:1,delay:.2,ease:"easeOut"},className:"absolute left-1/2 top-1/2 w-2 h-2 rounded-full bg-gradient-to-r from-purple-500 to-fuchsia-500"},t))}),(0,a.jsx)("div",{className:"absolute inset-0 flex items-center justify-center",children:(0,a.jsx)(n.P.div,{initial:{scale:2,opacity:0},animate:{scale:0,opacity:1},transition:{duration:.5},className:"w-32 h-32 rounded-full bg-gradient-to-r from-purple-600 to-fuchsia-600",style:{filter:"blur(20px)"}})})]})}),document.body):null}function p(e){let{suggestedRoutes:t,storedProgress:l}=e,{isLoaded:r}=(0,c.a)(),[d,u]=(0,s.useState)("easy"),[p,h]=(0,s.useState)(null),x=(0,s.useRef)(null),g=(0,s.useRef)(null),f=(0,s.useRef)(null),v=(0,s.useRef)(null),b=(0,s.useRef)(null),j=(0,s.useRef)([]),y=(0,s.useRef)(null),[w,N]=(0,s.useState)(null);function C(e,l){var a,r,s,o,n,i,c,d;if(!x.current)return;let u=new google.maps.DirectionsService,{point1:m,point2:p,point3:h}=t[e];null===(a=g.current)||void 0===a||a.setMap(null),null===(r=f.current)||void 0===r||r.setMap(null),null===(s=v.current)||void 0===s||s.setMap(null),null===(o=b.current)||void 0===o||o.setMap(null),null===(n=g.current)||void 0===n||n.setMap(x.current),null===(i=f.current)||void 0===i||i.setMap(x.current),null===(c=v.current)||void 0===c||c.setMap(x.current),null===(d=b.current)||void 0===d||d.setMap(x.current),u.route({origin:l,destination:{lat:m.lat,lng:m.lng},travelMode:google.maps.TravelMode.WALKING},(e,t)=>{if("OK"===t&&e){var l;null===(l=g.current)||void 0===l||l.setDirections(e)}else console.error("Blue route error:",t)}),u.route({origin:{lat:m.lat,lng:m.lng},destination:{lat:p.lat,lng:p.lng},travelMode:google.maps.TravelMode.WALKING},(e,t)=>{if("OK"===t&&e){var l;null===(l=f.current)||void 0===l||l.setDirections(e)}else console.error("Green route error:",t)}),u.route({origin:{lat:p.lat,lng:p.lng},destination:{lat:h.lat,lng:h.lng},travelMode:google.maps.TravelMode.WALKING},(e,t)=>{if("OK"===t&&e){var l;null===(l=v.current)||void 0===l||l.setDirections(e)}else console.error("Yellow route error:",t)}),u.route({origin:{lat:h.lat,lng:h.lng},destination:l,travelMode:google.maps.TravelMode.WALKING},(e,t)=>{if("OK"===t&&e){var l;null===(l=b.current)||void 0===l||l.setDirections(e)}else console.error("Red route error:",t)}),function(e){if(!x.current)return;j.current.forEach(e=>e.setMap(null)),j.current=[];let t=new google.maps.Marker({position:{lat:e.A.lat,lng:e.A.lng},map:x.current,label:{text:"A",color:"white",fontWeight:"bold"},icon:{path:google.maps.SymbolPath.CIRCLE,fillColor:"#4285F4",fillOpacity:1,strokeWeight:0,scale:15}});j.current.push(t);let l=new google.maps.Marker({position:{lat:e.B.lat,lng:e.B.lng},map:x.current,label:{text:"B",color:"white",fontWeight:"bold"},icon:{path:google.maps.SymbolPath.CIRCLE,fillColor:"#34A853",fillOpacity:1,strokeWeight:0,scale:15}});j.current.push(l);let a=new google.maps.Marker({position:{lat:e.C.lat,lng:e.C.lng},map:x.current,label:{text:"C",color:"white",fontWeight:"bold"},icon:{path:google.maps.SymbolPath.CIRCLE,fillColor:"#FBBC05",fillOpacity:1,strokeWeight:0,scale:15}});j.current.push(a);let r=new google.maps.Marker({position:{lat:e.D.lat,lng:e.D.lng},map:x.current,label:{text:"D",color:"white",fontWeight:"bold"},icon:{path:google.maps.SymbolPath.CIRCLE,fillColor:"#DB4437",fillOpacity:1,strokeWeight:0,scale:15}});j.current.push(r)}({A:m,B:p,C:h,D:{lat:l.lat,lng:l.lng,name:"D"}}),function(e,t,l,a){if(!x.current)return;let r=new google.maps.LatLngBounds;r.extend(new google.maps.LatLng(e.lat,e.lng)),r.extend(new google.maps.LatLng(t.lat,t.lng)),r.extend(new google.maps.LatLng(l.lat,l.lng)),r.extend(new google.maps.LatLng(a.lat,a.lng)),x.current.fitBounds(r);let s=x.current.addListener("idle",()=>{x.current&&(14>(x.current.getZoom()||0)&&x.current.setZoom(14),google.maps.event.removeListener(s))})}(l,m,p,h),y.current&&y.current.setMap(null),y.current=new google.maps.Marker({position:l,map:x.current,icon:"http://maps.google.com/mapfiles/ms/icons/blue-dot.png"})}(0,s.useEffect)(()=>{let e=localStorage.getItem("userPosition");if(e){let t=JSON.parse(e);h(t),N(t)}},[]),(0,s.useEffect)(()=>{r&&(p||navigator.geolocation.getCurrentPosition(e=>{let t={lat:e.coords.latitude,lng:e.coords.longitude};h(t),N(t),localStorage.setItem("userPosition",JSON.stringify(t))},e=>{console.error("Geolocation error:",e)},{enableHighAccuracy:!0}))},[r,p]);let[A,k]=(0,s.useState)(!1),S=async()=>{M(),await new Promise(e=>setTimeout(e,3e3)).then(()=>{});let{point1:e,point2:a,point3:r}=t[d],s={origin:{lat:(null==p?void 0:p.lat)||0,lng:(null==p?void 0:p.lng)||0,name:"出発地点"},point1:{lat:e.lat,lng:e.lng,name:e.name},point2:{lat:a.lat,lng:a.lng,name:a.name},point3:{lat:r.lat,lng:r.lng,name:r.name}};localStorage.setItem("selectedRoute",""),localStorage.setItem("selectedRoute",JSON.stringify(s)),localStorage.setItem("progress",JSON.stringify(1)),l(3)},{isPlaying:I,play:M,handleComplete:P}=function(){let[e,t]=(0,s.useState)(!1);return{isPlaying:e,play:(0,s.useCallback)(()=>{t(!0)},[]),handleComplete:(0,s.useCallback)(()=>{t(!1)},[])}}();return(0,a.jsxs)("div",{style:{width:"100%",height:"100vh",position:"relative"},children:[I&&(0,a.jsx)(m,{onComplete:P}),r?(0,a.jsx)(o.u6,{onLoad:function(e){x.current=e,g.current=new google.maps.DirectionsRenderer({preserveViewport:!0,suppressMarkers:!0,polylineOptions:{strokeColor:"#4285F4",strokeWeight:5}}),f.current=new google.maps.DirectionsRenderer({preserveViewport:!0,suppressMarkers:!0,polylineOptions:{strokeColor:"#34A853",strokeWeight:5}}),v.current=new google.maps.DirectionsRenderer({preserveViewport:!0,suppressMarkers:!0,polylineOptions:{strokeColor:"#FBBC05",strokeWeight:5}}),b.current=new google.maps.DirectionsRenderer({preserveViewport:!0,suppressMarkers:!0,polylineOptions:{strokeColor:"#DB4437",strokeWeight:5}}),g.current.setMap(e),f.current.setMap(e),v.current.setMap(e),b.current.setMap(e),p&&C(d,p)},mapContainerStyle:{width:"100%",height:"100%"},center:w||{lat:35.6803997,lng:139.7690174},zoom:15,options:{mapTypeControl:!1,zoomControl:!0,streetViewControl:!1,fullscreenControl:!1}}):(0,a.jsx)("div",{children:"Loading Map..."}),(0,a.jsxs)(n.P.div,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},className:"fixed bottom-20 -translate-x-1/2  bg-white/10 backdrop-blur-md p-6 rounded-2xl  shadow-[0_8px_32px_rgba(0,0,0,0.2)] border border-white/20 flex flex-col items-center gap-6",style:{marginLeft:"calc(50% - 200px)"},children:[(0,a.jsx)("div",{className:"flex gap-3 justify-center",children:[{id:"easy",label:"EASY",color:"#4285F4",hoverColor:"#2b75e6"},{id:"normal",label:"NORMAL",color:"#34A853",hoverColor:"#2d9447"},{id:"hard",label:"HARD",color:"#DB4437",hoverColor:"#c93d31"}].map(e=>{let{id:t,label:l,color:r,hoverColor:s}=e;return(0,a.jsxs)(n.P.button,{onClick:()=>{u(t),p&&C(t,p)},className:"relative px-6 py-3 rounded-lg font-bold text-white min-w-[100px] shadow-lg transition-shadow hover:shadow-xl",style:{backgroundColor:d===t?r:"#374151"},whileHover:{scale:1.05,backgroundColor:d===t?s:"#4B5563"},whileTap:{scale:.95},children:[d===t&&(0,a.jsx)(n.P.div,{layoutId:"glow",className:"absolute inset-0 rounded-lg",style:{boxShadow:"0 0 20px ".concat(r,"50")},transition:{type:"spring",bounce:.2,duration:.6}}),(0,a.jsx)("span",{className:"relative z-10",children:l})]},t)})}),(0,a.jsxs)(n.P.button,{onClick:S,onHoverStart:()=>k(!0),onHoverEnd:()=>k(!1),className:"relative w-full px-8 py-4 rounded-lg font-bold text-white text-lg shadow-lg overflow-hidden",style:{background:"linear-gradient(135deg, #7c3aed, #c026d3)"},whileHover:{scale:1.02},whileTap:{scale:.98},children:[A&&(0,a.jsx)(n.P.div,{className:"absolute inset-0 flex items-center justify-center",initial:"initial",animate:"animate",children:[...Array(12)].map((e,t)=>(0,a.jsx)(n.P.div,{className:"absolute w-1 h-1 bg-white rounded-full",initial:{opacity:0,x:0,y:0},animate:{opacity:[0,1,0],x:[0,(Math.random()-.5)*100],y:[0,(Math.random()-.5)*100],scale:[0,1.5,0]},transition:{duration:1,repeat:Number.POSITIVE_INFINITY,delay:.1*t,ease:"easeOut"}},t))}),(0,a.jsx)(n.P.div,{className:"absolute inset-0 bg-gradient-to-r from-purple-600/0 via-purple-600/30 to-purple-600/0",animate:{x:A?["-100%","100%"]:"-100%"},transition:{duration:1,repeat:A?Number.POSITIVE_INFINITY:0,ease:"linear"}}),(0,a.jsxs)("div",{className:"relative flex items-center justify-center gap-2",children:[(0,a.jsx)("span",{children:"START"}),(0,a.jsx)(n.P.div,{animate:A?{rotate:[0,360],scale:[1,1.2,1]}:{},transition:{duration:1,repeat:Number.POSITIVE_INFINITY,ease:"linear"},children:(0,a.jsx)(i.A,{className:"w-5 h-5"})})]})]})]})]})}var h=l(3312),x=l(5355),g=l(4333),f=l(8998),v=l(2560),b=l(1441),j=l(810),y=l(6822);function w(){let[e,t]=(0,s.useState)("");return(0,a.jsxs)(f.A,{sx:{display:"flex",flexDirection:"column",gap:2,width:"100%"},children:[(0,a.jsx)(v.A,{fullWidth:!0,id:"prompt",placeholder:"プロンプトを入力　-- 例: 今日は遠くの場所まで歩きたい --",value:e,onChange:e=>{t(e.target.value)},variant:"outlined",InputProps:{startAdornment:(0,a.jsx)(b.A,{position:"start",children:(0,a.jsx)(y.A,{size:20,color:"#9e9e9e"})}),sx:{borderRadius:3,py:1,backgroundColor:"rgba(0, 0, 0, 0.02)","&:hover":{borderColor:"primary.main"},"&.Mui-focused":{borderColor:"primary.main",boxShadow:"0 0 0 2px rgba(103, 58, 183, 0.1)"}}}}),(0,a.jsx)(j.A,{variant:"caption",align:"center",sx:{color:"text.secondary"},children:"プロンプトを入力すると、あなたのウォーキング体験がより豊かになります"})]})}var N=l(6046),C=l(3376),A=l(8416),k=l(6417),S=l(7753),I=l(562),M=l(7841),P=l(5480),O=l(6793),_=l(415);function T(e){let{open:t,onClose:l}=e,r=(0,s.useContext)(C.c).user,o=null==r?void 0:r.displayName,n=null==r?void 0:r.photoURL,[i,c]=(0,s.useState)(""),[d,u]=(0,s.useState)(""),m=async(e,t)=>{try{let l={id:null==r?void 0:r.uid,img_url:null==r?void 0:r.photoURL,name:null==r?void 0:r.displayName,gender:t,age:e},a=await fetch("".concat(_.h,"/user"),{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(l)});await a.json()}catch(e){console.log(e)}};return(0,a.jsxs)(A.A,{open:!t,onClose:l,maxWidth:"sm",fullWidth:!0,children:[(0,a.jsx)(k.A,{sx:{textAlign:"center",background:"linear-gradient(to right, #9333ea, #4f46e5)",color:"white",fontWeight:"bold"},children:"ようこそ!"}),(0,a.jsx)(S.A,{children:(0,a.jsxs)(f.A,{sx:{display:"flex",flexDirection:"column",alignItems:"center",mt:2},children:[(0,a.jsx)(I.A,{src:null!=n?n:"",sx:{width:80,height:80,mb:2}}),(0,a.jsx)(j.A,{variant:"h6",sx:{mb:3},children:o}),(0,a.jsx)(v.A,{label:"年齢",type:"number",value:i,onChange:e=>c(e.target.value),fullWidth:!0,sx:{mb:2},inputProps:{min:0,max:130}}),(0,a.jsxs)(M.A,{value:d,onChange:e=>u(e.target.value),displayEmpty:!0,fullWidth:!0,sx:{mb:3},children:[(0,a.jsx)(P.A,{value:"",disabled:!0,children:"性別を選択してください"}),(0,a.jsx)(P.A,{value:"male",children:"男性"}),(0,a.jsx)(P.A,{value:"female",children:"女性"}),(0,a.jsx)(P.A,{value:"other",children:"その他"})]}),(0,a.jsx)(O.A,{disabled:!i||""===d,className:"w-full",variant:"contained",onClick:()=>{m(i,d),l()},sx:{background:"linear-gradient(to right, #9333ea, #4f46e5)",color:"white","&:hover":{background:"linear-gradient(to right, #7e22ce, #4338ca)"},"&.Mui-disabled":{background:"gray",color:"white"}},children:"送信"})]})})]})}function R(e){let{progress:t,setProgress:l,isNewUser:r,handleClosePopup:s,getSuggestedRoute:o}=e;return(0,N.useRouter)(),(0,a.jsx)("main",{className:"h-screen bg-white",children:(0,a.jsxs)("div",{className:"w-full h-full flex flex-col  overflow-hidden shadow-2xl bg-white",children:[(0,a.jsxs)("div",{className:"h-32 bg-gradient-to-r from-purple-500 to-indigo-600 flex items-center justify-center relative overflow-hidden",children:[(0,a.jsxs)("div",{className:"absolute inset-0 opacity-20",children:[(0,a.jsx)("div",{className:"absolute top-4 left-4",children:(0,a.jsx)(x.A,{className:"h-8 w-8 text-white"})}),(0,a.jsx)("div",{className:"absolute bottom-4 right-4",children:(0,a.jsx)(x.A,{className:"h-8 w-8 text-white"})}),(0,a.jsx)("div",{className:"absolute top-1/2 left-1/3",children:(0,a.jsx)(g.A,{className:"h-6 w-6 text-white"})}),(0,a.jsx)("div",{className:"absolute bottom-1/3 right-1/4",children:(0,a.jsx)(x.A,{className:"h-6 w-6 text-white"})})]}),(0,a.jsx)("h1",{className:"text-4xl font-bold text-white z-10",children:"WalkBuddy"})]}),(0,a.jsxs)("div",{className:"p-8 space-y-8",children:[(0,a.jsx)("div",{className:"flex justify-center",children:(0,a.jsx)("div",{className:"w-24 h-24 rounded-full bg-gradient-to-br from-purple-600 to-indigo-700 flex items-center justify-center shadow-lg",children:(0,a.jsx)(x.A,{className:"h-12 w-12 text-white"})})}),(0,a.jsxs)("div",{className:"text-center space-y-2",children:[(0,a.jsx)("h2",{className:"text-2xl font-bold text-gray-800",children:"あなたの歩みを記録"}),(0,a.jsxs)("p",{className:"text-gray-600",children:["毎日のウォーキングを楽しく続けるための",(0,a.jsx)("br",{}),"パートナーアプリです"]})]}),(0,a.jsx)(w,{}),(0,a.jsx)("div",{children:(0,a.jsx)(T,{open:r,onClose:s})}),(0,a.jsx)("div",{className:"pt-4",children:(0,a.jsx)("div",{children:(0,a.jsx)(h.$,{onClick:()=>{l(1),o()},className:"w-full h-14 text-lg font-medium bg-gradient-to-r from-purple-600 to-indigo-700 hover:from-purple-700 hover:to-indigo-800 rounded-full shadow-lg",children:"スタート"})})}),(0,a.jsx)("div",{className:"text-center text-xs text-gray-500 pt-4",children:(0,a.jsx)("p",{children:"毎日の一歩が、健康な未来への一歩"})})]})]})})}var W=l(3713),E=l(8562),L=l(7893),B=l(6039);function D(e){let{onComplete:t}=e,[l,r]=(0,s.useState)(!1);return((0,s.useEffect)(()=>{r(!0);let e=setTimeout(()=>{null==t||t()},5e3);return()=>clearTimeout(e)},[t]),l)?(0,u.createPortal)((0,a.jsx)(d.N,{children:(0,a.jsxs)("div",{className:"fixed inset-0 pointer-events-none z-50 flex items-center justify-center",children:[(0,a.jsx)(n.P.div,{initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},className:"absolute inset-0 bg-gradient-to-br from-purple-500/80 to-pink-500/80 backdrop-blur-sm"}),(0,a.jsxs)("div",{className:"relative",children:[(0,a.jsx)(n.P.div,{initial:{scale:0,rotate:0},animate:{scale:[0,1.2,1],rotate:360},transition:{duration:1.5,ease:"easeOut"},className:"absolute inset-0 rounded-full border-4 border-white/30"}),[...Array(12)].map((e,t)=>(0,a.jsx)(n.P.div,{initial:{opacity:0,scale:0,x:0,y:0},animate:{opacity:[0,1,0],scale:[.5,1.5,0],x:[0,(Math.random()-.5)*300],y:[0,(Math.random()-.5)*300],rotate:[0,360*Math.random()]},transition:{duration:2,delay:.1*t,ease:"easeOut"},className:"absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2",children:(0,a.jsx)(L.A,{className:"w-4 h-4 text-pink-300",fill:"currentColor"})},t)),(0,a.jsxs)(n.P.div,{initial:{scale:.5,opacity:0},animate:{scale:1,opacity:1},transition:{type:"spring",duration:.6,bounce:.4},className:"bg-white rounded-3xl p-8 shadow-xl flex flex-col items-center gap-4 relative w-80",children:[(0,a.jsxs)(n.P.div,{initial:{y:20,opacity:0},animate:{y:0,opacity:1},transition:{delay:.3},className:"relative",children:[(0,a.jsx)("div",{className:"absolute inset-0 flex items-center justify-center",children:(0,a.jsx)(n.P.div,{animate:{scale:[1,1.2,1]},transition:{duration:2,repeat:Number.POSITIVE_INFINITY,ease:"easeInOut"},children:(0,a.jsx)("div",{className:"w-20 h-20 rounded-full bg-gradient-to-br from-purple-400/20 to-pink-400/20"})})}),(0,a.jsx)(x.A,{className:"w-12 h-12 text-purple-500 relative z-10"})]}),(0,a.jsxs)(n.P.div,{initial:{opacity:0},animate:{opacity:1},transition:{delay:.5},className:"text-center space-y-2",children:[(0,a.jsx)("h2",{className:"text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent",children:"投稿完了！"}),(0,a.jsx)("p",{className:"text-gray-600 text-sm",children:"今日も素晴らしい記録ですね！"})]}),(0,a.jsxs)(n.P.div,{initial:{scale:0},animate:{scale:1},transition:{delay:.7},className:"bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl p-4 w-full text-center",children:[(0,a.jsx)("div",{className:"text-sm text-gray-600 mb-1",children:"お疲れ様でした！"}),(0,a.jsx)("div",{className:"text-2xl font-bold text-purple-600",children:"明日も頑張ろう!"})]}),(0,a.jsx)("div",{className:"absolute -bottom-4 -right-4",children:(0,a.jsx)(n.P.div,{animate:{rotate:[0,360]},transition:{duration:20,repeat:Number.POSITIVE_INFINITY,ease:"linear"},children:(0,a.jsx)(B.A,{className:"w-8 h-8 text-purple-400",fill:"currentColor"})})})]}),[...Array(20)].map((e,t)=>(0,a.jsx)(n.P.div,{className:"absolute",initial:{opacity:0,scale:0,x:0,y:0},animate:{opacity:[0,1,0],scale:[0,1,0],x:[0,(Math.random()-.5)*400],y:[0,(Math.random()-.5)*400]},transition:{duration:2,delay:.1*t,ease:"easeOut"},children:(0,a.jsx)("div",{className:"w-1 h-1 rounded-full",style:{backgroundColor:["#C084FC","#F0ABFC","#E879F9"][Math.floor(3*Math.random())],boxShadow:"0 0 4px currentColor"}})},"sparkle-".concat(t)))]})]})}),document.body):null}function F(e){let{setProgress:t}=e;(0,N.useRouter)();let[l,r]=(0,s.useState)(""),[o,n]=(0,s.useState)(""),{user:i}=(0,C.Z)(),c=async()=>{y(),await new Promise(e=>setTimeout(e,2e3));let e=await fetch("".concat(_.h,"/api/posts"),{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({title:l,comment:o,created_by:null==i?void 0:i.uid,origin_lat:u,origin_lng:m,point1_lat:p.lat,point1_lng:p.lng,point1_name:p.name,point2_lat:h.lat,point2_lng:h.lng,point2_name:h.name,point3_lat:f.lat,point3_lng:f.lng,point3_name:f.name})});await e.json(),localStorage.setItem("selectedRoute",""),localStorage.setItem("progress",""),t(0)},d=JSON.parse(localStorage.getItem("selectedRoute")||"{}"),u=d.origin.lat,m=d.origin.lng,p=d.point1,h=d.point2,f=d.point3,b=[p.name,h.name,f.name],{isPlaying:j,play:y,handleComplete:w}=function(){let[e,t]=(0,s.useState)(!1);return{isPlaying:e,play:(0,s.useCallback)(e=>{t(!0)},[]),handleComplete:(0,s.useCallback)(()=>{t(!1)},[])}}();return(0,a.jsxs)("main",{className:"h-screen w-full overflow-hidden",children:[j&&(0,a.jsx)(D,{onComplete:w}),(0,a.jsxs)("div",{className:"w-full h-full flex flex-col shadow-2xl bg-white",children:[(0,a.jsxs)("div",{className:"h-32 bg-gradient-to-r from-purple-500 to-indigo-600 flex items-center justify-center relative overflow-hidden",children:[(0,a.jsxs)("div",{className:"absolute inset-0 opacity-20",children:[(0,a.jsx)("div",{className:"absolute top-4 left-4",children:(0,a.jsx)(x.A,{className:"h-8 w-8 text-white"})}),(0,a.jsx)("div",{className:"absolute bottom-4 right-4",children:(0,a.jsx)(x.A,{className:"h-8 w-8 text-white"})}),(0,a.jsx)("div",{className:"absolute top-1/2 left-1/3",children:(0,a.jsx)(g.A,{className:"h-6 w-6 text-white"})}),(0,a.jsx)("div",{className:"absolute bottom-1/3 right-1/4",children:(0,a.jsx)(x.A,{className:"h-6 w-6 text-white"})})]}),(0,a.jsx)("h1",{className:"text-3xl font-bold text-white z-10",children:"WalkBuddy"})]}),(0,a.jsxs)("div",{className:"p-6 flex flex-col items-center flex-grow w-full max-w-4xl mx-auto",style:{overflowY:"auto",scrollbarWidth:"none"},children:[(0,a.jsx)("style",{children:"\n          /* Chrome, Safari用 */\n          div::-webkit-scrollbar {\n            display: none;\n          }\n        "}),(0,a.jsxs)("div",{className:"flex flex-col items-center mb-8",children:[(0,a.jsx)(W.A,{className:"w-16 h-16 text-purple-600 mb-4"}),(0,a.jsx)("h2",{className:"text-2xl font-bold text-indigo-600 text-center",children:"おめでとう！"}),(0,a.jsx)("p",{className:"text-gray-600 text-center mt-2",children:"ウォーキングを完了しました！"})]}),(0,a.jsxs)(E.A,{elevation:2,className:"p-6 w-full rounded-2xl mb-6",children:[(0,a.jsx)(v.A,{label:"タイトル",variant:"outlined",fullWidth:!0,value:l,onChange:e=>r(e.target.value),className:"mb-4",sx:{mb:3,"& .MuiOutlinedInput-root":{"&:hover fieldset":{borderColor:"#9333ea"},"&.Mui-focused fieldset":{borderColor:"#4f46e5"}}}}),(0,a.jsx)(v.A,{label:"コメント",variant:"outlined",fullWidth:!0,multiline:!0,rows:4,value:o,onChange:e=>n(e.target.value),sx:{"& .MuiOutlinedInput-root":{"&:hover fieldset":{borderColor:"#9333ea"},"&.Mui-focused fieldset":{borderColor:"#4f46e5"}}}})]}),(0,a.jsxs)(E.A,{elevation:2,className:"p-6 w-full rounded-2xl mb-8",children:[(0,a.jsx)("h3",{className:"text-lg font-bold mb-4 text-indigo-600",children:"ルート"}),(0,a.jsx)("ul",{className:"space-y-4",children:["Aルート","Bルート","Cルート"].map((e,t)=>(0,a.jsxs)("li",{className:"flex items-center",children:[(0,a.jsx)("div",{className:"bg-purple-100 p-2 rounded-full mr-4",children:(0,a.jsx)(x.A,{className:"h-6 w-6 text-purple-600"})}),(0,a.jsx)("div",{children:(0,a.jsx)("p",{className:"font-medium",children:b[t]})})]},t))})]}),(0,a.jsxs)("div",{className:"flex flex-col sm:flex-row gap-4 w-full",children:[(0,a.jsx)(O.A,{variant:"contained",fullWidth:!0,onClick:c,sx:{background:"linear-gradient(to right, #9333ea, #4f46e5)",color:"white",py:1.5,borderRadius:"8px","&:hover":{background:"linear-gradient(to right, #7e22ce, #4338ca)"}},children:"投稿する"}),(0,a.jsx)(O.A,{variant:"outlined",fullWidth:!0,onClick:()=>{localStorage.setItem("selectedRoute",""),localStorage.setItem("progress",""),t(0)},sx:{borderColor:"#9333ea",color:"#4f46e5",py:1.5,borderRadius:"8px","&:hover":{borderColor:"#7e22ce",backgroundColor:"rgba(79, 70, 229, 0.04)"}},children:"タイトルへ戻る"})]})]}),(0,a.jsx)("div",{className:"p-4 text-center",children:(0,a.jsx)("p",{className:"text-xs text-gray-500",children:"毎日の一歩が、健康な未来への一歩"})})]})]})}function V(){let[e,t]=(0,s.useState)(0),[l,o]=(0,s.useState)(),{active:n,setActive:i,currentLat:d,currentLng:u}=(0,c.a)(),[m,h]=(0,s.useState)(!0),x=(0,s.useContext)(C.c),g=null==x?void 0:x.user,f=async()=>{try{let e=await fetch("".concat(_.h,"/api/suggestion_routes"),{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({current_location_lat:d,current_location_lng:u})}),l=await e.json(),a=l.find(e=>"easy mode"===e.mode),r=l.find(e=>"normal mode"===e.mode),s=l.find(e=>"hard mode"===e.mode);o({normal:r,easy:a,hard:s}),t(2)}catch(e){console.error("Error obtaining location",e),t(1)}},v=async e=>{try{let t=await fetch("".concat(_.h,"/check_newcomer"),{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({id:e})}),l=await t.json();h(l.is_new_user)}catch(e){console.log(e)}};switch((0,s.useEffect)(()=>{g&&v(g.uid)},[]),(0,s.useEffect)(()=>{3===e&&i(!0)},[e]),(0,s.useEffect)(()=>{"5"===localStorage.getItem("progress")&&t(4)},[n]),e){case 0:return!n&&(0,a.jsx)(R,{handleClosePopup:()=>{h(!0)},isNewUser:m,progress:e,setProgress:t,getSuggestedRoute:f});case 1:return!n&&(0,a.jsx)(r.A,{message:"現在地からルートを生成しています"});case 2:return!n&&(0,a.jsx)(p,{suggestedRoutes:l,storedProgress:t});case 3:return(0,a.jsx)(a.Fragment,{});case 4:return(0,a.jsx)(F,{setProgress:t})}}},415:(e,t,l)=>{"use strict";l.d(t,{h:()=>a});let a="dev"==l(2818).env.NEXT_PUBLIC_ENV?"http://localhost:5000":""}},e=>{var t=t=>e(e.s=t);e.O(0,[87,753,895,84,622,535,242,564,441,517,358],()=>t(3070)),_N_E=e.O()}]);