import"./web-ifc-api-BN6RNDnz.js";import{p as y,C as b,s as S,n as E,d as B,h as k}from"./index-BBrF7fmJ.js";import{U as A,E as C,b as U,g as I}from"./index-BBPzgtWS.js";import{p as M}from"./index-K5IA6oiZ.js";import{s as x}from"./index-B0jsduYh.js";import{S as D}from"./stats.min-BpIepu9J.js";M.init();x.init();const f=document.getElementById("container"),t=new y,z=t.get(b),e=z.create();e.scene=new S(t);e.renderer=new A(t,f);e.camera=new E(t);t.init();e.scene.setup();e.camera.controls.setLookAt(5,5,5,0,0,0);f.appendChild(e.renderer.three2D.domElement);const L=t.get(B);L.create(e);e.scene.three.background=null;const N=t.get(k),P=await fetch("https://thatopen.github.io/engine_components/resources/road.frag"),T=await P.arrayBuffer(),W=new Uint8Array(T),c=N.load(W);e.scene.three.add(c);const i=t.get(C);i.world=e;i.draw(c);const g=document.getElementById("scene-2d-left");g.components=t;if(!g.world)throw new Error("World not found!");const l=new U(t);l.world=g.world;l.draw(c);const s=document.getElementById("scene-2d-right");s.components=t;if(!s.world)throw new Error("World not found!");const a=t.get(I);a.world=s.world;a.draw(c);l.onMarkerChange.add(({alignment:r,percentage:d})=>{a.setMarker(r,d,"hover"),i.setMarker(r,d,"hover")});l.onHighlight.add(({mesh:r,point:d})=>{const{index:v,alignment:h}=r.curve,m=h.getPercentageAt(d,"horizontal");if(m===null)return;const{curve:n}=h.getCurveAt(m,"vertical");if(a.highlighter.select(n.mesh),a.setMarker(n.alignment,m,"select"),s.world){n.mesh.geometry.boundingSphere||n.mesh.geometry.computeBoundingSphere();const w=n.mesh.geometry.boundingSphere.clone();w.radius*=1.5,s.world.camera.controls.fitToSphere(w,!0)}i.highlighter.select(r);const p=r.curve.alignment.absolute[v];p.mesh.geometry.computeBoundingSphere();const u=p.mesh.geometry.boundingSphere;u&&e.camera.controls.fitToSphere(u,!0)});const o=new D;o.showPanel(2);document.body.append(o.dom);o.dom.style.left="0px";o.dom.style.zIndex="unset";e.renderer.onBeforeUpdate.add(()=>o.begin());e.renderer.onAfterUpdate.add(()=>o.end());
