var L=Object.defineProperty;var _=(l,n,t)=>n in l?L(l,n,{enumerable:!0,configurable:!0,writable:!0,value:t}):l[n]=t;var i=(l,n,t)=>(_(l,typeof n!="symbol"?n+"":n,t),t);import{V as m,c as C,e as S,M as E}from"./index-vsiIwi5G.js";import{J as F,u as x,I as M,e as A,X as P,S as N}from"./import-wrapper-prod-Cw6eyEbm.js";import{R as z}from"./index-DDglaOt-.js";import{M as b}from"./mark-CV4k-gtV.js";import"./_commonjsHelpers-Cpj98o6Y.js";const g=class g extends F{constructor(t){super(t);i(this,"enabled",!0);i(this,"threshold",50);i(this,"autoCluster",!0);i(this,"list",new Map);i(this,"clusterLabels",new Set);i(this,"currentKeys",new Set);i(this,"_color","white");i(this,"_markerKey",0);i(this,"_clusterKey",0);i(this,"isNavigating",!1);i(this,"_setupWorlds",new Set);t.add(g.uuid,this)}get color(){return this._color}set color(t){this._color=t;for(const[e,s]of this.list)s.label.three.element.style.color=t}create(t,e,s,r=!1){this.setupEvents(t,!0);const o=document.createElement("span");o.innerHTML=e,o.style.color=this._color;const a=new b(t,o);a.three.position.copy(s);const c=this._markerKey.toString();return this.list.set(c,{key:c,label:a,merged:!1,static:r}),this._markerKey++,c}delete(t){const e=this.list.get(t);e&&e.label.dispose(),this.list.delete(t)}clear(t){const e=[...this.list.keys()];for(const s of e){const r=this.list.get(s);t&&r.type!==t||(r.label.dispose(),this.list.delete(s))}this.list.clear(),this._markerKey=0}dispose(){for(const[t,e]of this.list)e.label.dispose();this.list.clear(),this._markerKey=0;for(const t of this.clusterLabels)t.label.dispose();this.clusterLabels.clear(),this._clusterKey=0,this.currentKeys.clear()}setupEvents(t,e){e&&this._setupWorlds.has(t.uuid)||t.camera.hasCameraControls()&&(e?(t.camera.controls.addEventListener("sleep",()=>{this.manageCluster()}),t.camera.controls.addEventListener("rest",()=>{this.isNavigating&&(this.manageCluster(),this.isNavigating=!1)})):(t.camera.controls.removeEventListener("sleep",()=>{this.manageCluster()}),t.camera.controls.removeEventListener("rest",()=>{this.isNavigating&&(this.manageCluster(),this.isNavigating=!1)})))}resetMarkers(){for(const[t,e]of this.list)e.merged=!1;for(const t of this.clusterLabels)t.label.dispose();this.clusterLabels.clear(),this._clusterKey=0}removeMergeMarkers(){for(const[t,e]of this.list)e.merged?e.label.dispose():e.label.world.scene.three.add(e.label.three);for(const t of this.clusterLabels)if(t.markerKeys.length===1){const e=this.list.get(t.markerKeys[0]);e&&(e.label.world.scene.three.add(e.label.three),e.merged=!1),t.label.dispose(),this.clusterLabels.delete(t)}}manageCluster(){if(this.autoCluster){this.resetMarkers();for(const[t,e]of this.list)if(!e.merged&&!e.static){this.currentKeys.clear();for(const[s,r]of this.list)r.static||e.key!==r.key&&!r.merged&&this.distance(e.label,r.label)<this.threshold&&(this.currentKeys.add(r.key),r.merged=!0);if(this.currentKeys.size>0){this.currentKeys.add(e.key),e.merged=!0;const s=Array.from(this.currentKeys),r=this.getAveragePositionFromLabels(s),o=new b(e.label.world,this.createClusterElement(this._clusterKey.toString())),{element:a}=o.three;a.textContent=s.length.toString(),o.three.position.copy(r),this.clusterLabels.add({key:this._clusterKey.toString(),markerKeys:s,label:o}),this._clusterKey++}}this.removeMergeMarkers()}}getAveragePositionFromLabels(t){const e=t.map(s=>{const r=this.list.get(s);return r?r.label.three.position:new m});return e.reduce((s,r)=>s.add(r),new m).divideScalar(e.length)}createClusterElement(t){const e=document.createElement("div");return e.textContent=t,e.style.color="#000000",e.style.background="#FFFFFF",e.style.fontSize="1.2rem",e.style.fontWeight="500",e.style.pointerEvents="auto",e.style.borderRadius="50%",e.style.padding="5px 11px",e.style.textAlign="center",e.style.cursor="pointer",e.addEventListener("pointerdown",()=>{this.navigateToCluster(t)}),e.addEventListener("pointerover",()=>{e.style.background="#BCF124"}),e.addEventListener("pointerout",()=>{e.style.background="#FFFFFF"}),e}getScreenPosition(t){const e=new m;if(!t.world.renderer)throw new Error("Renderer not found!");const s=t.three.position.clone();s.project(t.world.camera.three);const r=t.world.renderer.getSize();return e.x=s.x*r.x/2+r.x/2,e.y=-(s.y*r.y/2)+r.y/2,e}distance(t,e){const s=this.getScreenPosition(t),r=this.getScreenPosition(e),o=s.x-r.x,a=s.y-r.y,c=Math.sqrt(o*o+a*a)*.5;return c===0?this.threshold+1:c}navigateToCluster(t){const e=[],s=Array.from(this.clusterLabels).find(f=>f.key===t);if(!s)return;const r=s.label.world.camera;if(!r.hasCameraControls()){console.warn("Zoom to clusters only supported with Camera Controls!");return}for(const f of s.markerKeys){const p=this.list.get(f);if(p){const{x:v,y:w,z:K}=p.label.three.position;e.push(v,w,K)}}s.label.dispose(),this.clusterLabels.delete(s);const o=new C,a=new Float32Array(e),c=new S(a,3);o.setAttribute("position",c);const u=new E(o);u.geometry.computeBoundingSphere(),u.geometry.boundingSphere&&r.controls.fitToSphere(u,!0),this.isNavigating=!0,o.dispose(),u.clear(),e.length=0}};i(g,"uuid","4079eb91-79b0-4ede-bcf2-15b837129236");let y=g;const B=document.getElementById("container"),h=new x,R=h.get(M),d=R.create();d.scene=new A(h);d.renderer=new z(h,B);d.camera=new P(h);h.init();d.camera.controls.setLookAt(5,5,5,0,0,0);const T=h.get(N);T.create(d);const k=h.get(y);k.threshold=10;for(let l=0;l<20;l++){const n=Math.random()*5,t=Math.random()*5,e=Math.random()*5;k.create(d,"🚀",new m(n,t,e))}
