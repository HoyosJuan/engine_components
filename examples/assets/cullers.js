import{B as c,t as i,M as l}from"./index-vsiIwi5G.js";import{S as p}from"./stats.min-GTpOrGrX.js";import{C as u}from"./index-BhNtB8fA.js";import{W as f,S as b}from"./index-W7GLNhb1.js";import{G as w}from"./index-CSEv1weS.js";import{C as y}from"./index-DKxLRMGU.js";import{S as g,a as h}from"./simple-camera-CmWpoHk7.js";import"./_commonjsHelpers-Cpj98o6Y.js";import"./async-event-D8tC9awa.js";const C=document.getElementById("container"),o=new u,S=o.get(f),e=S.create();e.scene=new g(o);e.renderer=new b(o,C);e.camera=new h(o);o.init();e.camera.controls.setLookAt(13,13,13,0,0,0);e.scene.setup();const M=o.get(w);M.create(e);const x=new y(o),n=x.create(e);n.threshold=200;n.renderDebugFrame=!0;const s=n.renderer.domElement;document.body.appendChild(s);s.style.position="fixed";s.style.left="0";s.style.bottom="0";s.style.visibility="collapse";function d(r){return Math.random()*r}const m=[],B=new c(2,2,2),U=new i({color:"#6528D7"});function v(){for(const r of m)r.removeFromParent();m.length=0}function E(){v();for(let r=0;r<300;r++){const t=new l(B,U);t.position.x=d(10),t.position.y=d(10),t.position.z=d(10),t.updateMatrix(),e.scene.three.add(t),n.add(t),m.push(t)}}E();n.needsUpdate=!0;e.camera.controls.addEventListener("controlend",()=>{n.needsUpdate=!0});const a=new p;a.showPanel(2);document.body.append(a.dom);a.dom.style.left="0px";e.renderer.onBeforeUpdate.add(()=>a.begin());e.renderer.onAfterUpdate.add(()=>a.end());
