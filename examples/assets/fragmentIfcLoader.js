import{aP as f,aQ as g,aR as l}from"./index-vsiIwi5G.js";import{S as u}from"./stats.min-GTpOrGrX.js";import{g as F}from"./lil-gui.module.min-Bc0DeA9g.js";import{C as w}from"./index-BhNtB8fA.js";import{W as I,S as C}from"./index-W7GLNhb1.js";import{G as R}from"./index-CSEv1weS.js";import{F as E}from"./index-kR8cL58u.js";import{F as O}from"./index-DIMmpvZj.js";import{S as N,a as y}from"./simple-camera-CmWpoHk7.js";import"./_commonjsHelpers-Cpj98o6Y.js";import"./ifc-metadata-reader-ChV0ZuWd.js";import"./ifc-fragment-settings-DfFyvBfD.js";import"./ifc-geometry-types-C3SKrzrZ.js";const S=document.getElementById("container"),n=new w,x=n.get(I),o=x.create();o.scene=new N(n);o.renderer=new C(n,S);o.camera=new y(n);n.init();o.camera.controls.setLookAt(12,6,8,0,0,-10);o.scene.setup();const L=n.get(R);L.create(o);const r=n.get(E),a=n.get(O);await a.setup();const b=[f,g,l];for(const e of b)a.settings.excludedCategories.add(e);a.settings.webIfc.COORDINATE_TO_ORIGIN=!0;a.settings.webIfc.OPTIMIZE_PROFILES=!0;async function A(){const t=await(await fetch("../../../../../resources/02.ifc")).arrayBuffer(),m=new Uint8Array(t),i=await a.load(m);i.name="example",o.scene.three.add(i)}function p(e){const t=document.createElement("a");t.href=URL.createObjectURL(e),t.download=e.name,document.body.appendChild(t),t.click(),t.remove()}async function h(){if(!r.groups.size)return;const e=Array.from(r.groups.values())[0],t=r.export(e);p(new File([new Blob([t])],"small.frag"));const m=e.getLocalProperties();m&&p(new File([JSON.stringify(m)],"small.json"))}function B(){r.dispose()}const s=new u;s.showPanel(2);document.body.append(s.dom);s.dom.style.left="0px";o.renderer.onBeforeUpdate.add(()=>s.begin());o.renderer.onAfterUpdate.add(()=>s.end());const d={loadFragments:()=>A(),exportFragments:()=>h(),disposeFragments:()=>B()},c=new F;c.add(d,"loadFragments").name("Import fragments");c.add(d,"exportFragments").name("Export fragments");c.add(d,"disposeFragments").name("Dispose fragments");r.onFragmentsLoaded.add(e=>{console.log(e)});
