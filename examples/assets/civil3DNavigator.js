import{C as l,o as m}from"./index-vsiIwi5G.js";import{S as p}from"./stats.min-GTpOrGrX.js";import"./import-wrapper-prod-Cw6eyEbm.js";import{P as w}from"./index-CYJyRTZd.js";import"./_commonjsHelpers-Cpj98o6Y.js";import"./index-DDglaOt-.js";const h=document.getElementById("container"),e=new(void 0),f=new(void 0)(e);f.setup();e.scene=f;const t=new w(e,h);e.renderer=t;const i=new(void 0)(e);e.camera=i;e.raycaster=new(void 0)(e);e.init();t.postproduction.enabled=!0;t.postproduction.customEffects.outlineEnabled=!0;i.controls.setLookAt(12,6,8,0,0,-10);const g=new(void 0)(e,new l(6710886)),b=t.postproduction.customEffects;b.excludedMeshes.push(g.get());const I=new(void 0)(e),a=new(void 0)(e);a.settings.wasm={path:"https://unpkg.com/web-ifc@0.0.50/",absolute:!0};a.settings.webIfc.COORDINATE_TO_ORIGIN=!0;a.settings.webIfc.OPTIMIZE_PROFILES=!0;const y=await fetch("../../../resources/asdf.frag"),E=await y.arrayBuffer(),C=new Uint8Array(E),c=await I.load(C),P=await fetch("../../../resources/asdf.json");c.setLocalProperties(await P.json());const u=new(void 0)(e,{name:"Main Toolbar",position:"bottom"});e.ui.addToolbar(u);u.addChild(a.uiElement.get("main"));console.log(c);const o=new(void 0)(e);o.draw(c);o.setup();o.highlighter.hoverCurve.material.color.set(1,1,1);const{material:s}=o.highlighter.hoverPoints;if(Array.isArray(s)){const r=s[0];"color"in r&&r.color.set(1,1,1)}else"color"in s&&s.color.set(1,1,1);const d=new m(void 0,20);o.onHighlight.add(({point:r})=>{d.center.copy(r),i.controls.fitToSphere(d,!0)});const n=new p;n.showPanel(2);document.body.append(n.dom);n.dom.style.left="0px";t.onBeforeUpdate.add(()=>n.begin());t.onAfterUpdate.add(()=>n.end());
