(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[974],{3070:(e,r,t)=>{Promise.resolve().then(t.bind(t,9809))},6046:(e,r,t)=>{"use strict";var o=t(6658);t.o(o,"usePathname")&&t.d(r,{usePathname:function(){return o.usePathname}}),t.o(o,"useRouter")&&t.d(r,{useRouter:function(){return o.useRouter}})},9809:(e,r,t)=>{"use strict";t.r(r),t.d(r,{default:()=>i});var o=t(5155),n=t(8946);function i(){let{setActive:e}=(0,n.a)();return(0,o.jsx)(o.Fragment,{})}},8946:(e,r,t)=>{"use strict";t.d(r,{GoogleMapProvider:()=>u,a:()=>a});var o=t(5155),n=t(2115),i=t(6046),l=t(9047);let s=(0,n.createContext)({active:!1,setActive:()=>{}});function a(){return(0,n.useContext)(s)}let c={width:"100%",height:"100%"};function u(e){let{children:r}=e,t=(0,i.usePathname)(),[a,u]=(0,n.useState)(null),[g,p]=(0,n.useState)(!1),d={lat:33.303841951880464,lng:130.50917614974222},m={lat:33.30616086795037,lng:130.5102654362774},h={lat:33.30581594904022,lng:130.5145199784839},{isLoaded:f}=(0,l.KD)({googleMapsApiKey:"AIzaSyCsWEFEzwVzLk6PTAWxhc-6WZzMzFKmamI",language:"ja"});(0,n.useEffect)(()=>{"/"==t?p(!0):p(!1)},[t]);let v=(0,n.useRef)(null),w=(0,n.useRef)(null),C=(0,n.useRef)(null),k=(0,n.useRef)(null),M=(0,n.useRef)(null),W=(0,n.useRef)(null),x=(0,n.useRef)(null),b=(0,n.useRef)(null);function y(e){C.current&&k.current&&new google.maps.DirectionsService().route({origin:e,destination:d,travelMode:google.maps.TravelMode.WALKING},(e,r)=>{if("OK"===r){var t;null===(t=k.current)||void 0===t||t.setDirections(e)}})}return(0,n.useEffect)(()=>{if(!navigator.geolocation){console.error("Geolocation not supported");return}let e=navigator.geolocation.watchPosition(e=>{let r={lat:e.coords.latitude,lng:e.coords.longitude};v.current=r,w.current||(w.current=r),u(r),y(r),b.current?b.current.setPosition(r):C.current&&(b.current=new google.maps.Marker({position:r,map:C.current,icon:"http://maps.google.com/mapfiles/ms/icons/blue-dot.png"})),x.current&&w.current&&new google.maps.DirectionsService().route({origin:h,destination:w.current,travelMode:google.maps.TravelMode.WALKING},(e,r)=>{if("OK"===r){var t;null===(t=x.current)||void 0===t||t.setDirections(e)}})},e=>{console.error("Geolocation watchPosition error:",e)},{enableHighAccuracy:!0,maximumAge:2e3,timeout:5e3});return()=>{navigator.geolocation.clearWatch(e)}},[]),(0,o.jsxs)(s.Provider,{value:{active:g,setActive:p},children:[f&&a?(0,o.jsx)("div",{style:{width:"100%",height:"100vh",position:"absolute",zIndex:-1},children:(0,o.jsx)(l.u6,{onLoad:function(e){C.current=e,!w.current&&v.current&&(w.current=v.current),v.current&&y(v.current),new google.maps.Marker({position:d,map:e,label:{text:"A",color:"white",fontWeight:"bold"},icon:{path:google.maps.SymbolPath.CIRCLE,fillColor:"#4285F4",fillOpacity:1,strokeWeight:0,scale:15}}),new google.maps.Marker({position:m,map:e,label:{text:"B",color:"white",fontWeight:"bold"},icon:{path:google.maps.SymbolPath.CIRCLE,fillColor:"#34A853",fillOpacity:1,strokeWeight:0,scale:15}}),new google.maps.Marker({position:h,map:e,label:{text:"C",color:"white",fontWeight:"bold"},icon:{path:google.maps.SymbolPath.CIRCLE,fillColor:"#FBBC05",fillOpacity:1,strokeWeight:0,scale:15}}),w.current&&new google.maps.Marker({position:w.current,map:e,label:{text:"D",color:"white",fontWeight:"bold"},icon:{path:google.maps.SymbolPath.CIRCLE,fillColor:"#DB4437",fillOpacity:1,strokeWeight:0,scale:15}}),e.addListener("click",e=>{if(e.latLng){let r={lat:e.latLng.lat(),lng:e.latLng.lng()};v.current=r,u(r),console.log("Clicked position:",r),y(r),b.current?b.current.setPosition(r):C.current&&(b.current=new google.maps.Marker({position:r,map:C.current,icon:"http://maps.google.com/mapfiles/ms/icons/blue-dot.png"})),x.current&&w.current&&new google.maps.DirectionsService().route({origin:h,destination:w.current,travelMode:google.maps.TravelMode.WALKING},(e,r)=>{if("OK"===r){var t;null===(t=x.current)||void 0===t||t.setDirections(e)}})}}),x.current=new google.maps.DirectionsRenderer({polylineOptions:{strokeColor:"#DB4437",zIndex:1,strokeWeight:5},suppressMarkers:!0,preserveViewport:!0}),x.current.setMap(e),W.current=new google.maps.DirectionsRenderer({polylineOptions:{strokeColor:"#FBBC05",zIndex:2,strokeWeight:5},suppressMarkers:!0,preserveViewport:!0}),W.current.setMap(e),M.current=new google.maps.DirectionsRenderer({polylineOptions:{strokeColor:"#34A853",zIndex:3,strokeWeight:5},suppressMarkers:!0,preserveViewport:!0}),M.current.setMap(e),k.current=new google.maps.DirectionsRenderer({polylineOptions:{strokeColor:"#4285F4",zIndex:4,strokeWeight:5},suppressMarkers:!0,preserveViewport:!0}),k.current.setMap(e),function(){if(!C.current)return;let e=new google.maps.DirectionsService;v.current&&e.route({origin:h,destination:v.current,travelMode:google.maps.TravelMode.WALKING},(e,r)=>{"OK"===r&&x.current&&x.current.setDirections(e)}),e.route({origin:m,destination:h,travelMode:google.maps.TravelMode.WALKING},(e,r)=>{"OK"===r&&W.current&&W.current.setDirections(e)}),e.route({origin:d,destination:m,travelMode:google.maps.TravelMode.WALKING},(e,r)=>{"OK"===r&&M.current&&M.current.setDirections(e)})}()},mapContainerStyle:c,center:a,zoom:18,options:{mapTypeControl:!1,zoomControl:!0,streetViewControl:!1,fullscreenControl:!1}})}):(0,o.jsx)("div",{children:"Loading..."}),(0,o.jsx)("div",{style:{zIndex:g?-2:"auto"},children:r})]})}}},e=>{var r=r=>e(e.s=r);e.O(0,[84,441,517,358],()=>r(3070)),_N_E=e.O()}]);