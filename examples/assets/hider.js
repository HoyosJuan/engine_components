import"./web-ifc-api-CfQNUy7g.js";import{S}from"./stats.min-BpIepu9J.js";import{m as k,t as r,a as l}from"./index-tywNknxv.js";import{p as x,C as v,i as C,n as F,W as j,d as A,h as L,a as $,S as M,A as _}from"./index-D2xchnNe.js";const B=document.getElementById("container"),e=new x,E=e.get(v),t=E.create();t.scene=new C(e);t.renderer=new F(e,B);t.camera=new j(e);e.init();t.camera.controls.setLookAt(12,6,8,0,0,-10);t.scene.setup();const I=e.get(A);I.create(t);t.scene.three.background=null;const b=e.get(L),N=await fetch("https://thatopen.github.io/engine_components/resources/small.frag"),O=await N.arrayBuffer(),U=new Uint8Array(O),i=b.load(U);t.scene.three.add(i);const q=await fetch("https://thatopen.github.io/engine_components/resources/small.json");i.setLocalProperties(await q.json());const d=e.get($),P=await fetch("https://thatopen.github.io/engine_components/resources/small-relations.json"),R=d.getRelationsMapFromJSON(await P.text());d.setRelationMap(i,R);const f=e.get(M),o=e.get(_);o.byEntity(i);await o.bySpatialStructure(i);const a=new S;a.showPanel(2);document.body.append(a.dom);a.dom.style.left="0px";a.dom.style.zIndex="unset";t.renderer.onBeforeUpdate.add(()=>a.begin());t.renderer.onAfterUpdate.add(()=>a.end());k.init();const g={},W=Object.keys(o.list.spatialStructures);for(const n of W)g[n]=!0;const h={},z=Object.keys(o.list.entities);for(const n of z)h[n]=!0;const s=r.create(()=>l`
    <bim-panel active label="Hider Tutorial" class="options-menu">
      <bim-panel-section collapsed label="Controls">
      
      <bim-panel-section collapsed label="Floors" name="Floors"">
      </bim-panel-section>
      
      <bim-panel-section collapsed label="Categories" name="Categories"">
      </bim-panel-section>
      
    </bim-panel>
  `);document.body.append(s);const D=s.querySelector("bim-panel-section[name='Floors']"),H=s.querySelector("bim-panel-section[name='Categories']");for(const n in g){const m=r.create(()=>l`
      <bim-checkbox checked label="${n}"
        @change="${({target:p})=>{const c=o.list.spatialStructures[n];if(c&&c.id!==null)for(const[T,u]of b.groups){const y=d.getEntityChildren(u,c.id),w=u.getFragmentMap(y);f.set(p.value,w)}}}">
      </bim-checkbox>
    `);D.append(m)}for(const n in h){const m=r.create(()=>l`
      <bim-checkbox checked label="${n}"
        @change="${({target:p})=>{const c=o.find({entities:[n]});f.set(p.value,c)}}">
      </bim-checkbox>
    `);H.append(m)}const J=r.create(()=>l`
      <bim-button class="phone-menu-toggler" icon="solar:settings-bold"
        @click="${()=>{s.classList.contains("options-menu-visible")?s.classList.remove("options-menu-visible"):s.classList.add("options-menu-visible")}}">
      </bim-button>
    `);document.body.append(J);
