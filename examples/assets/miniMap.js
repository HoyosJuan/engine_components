import"./web-ifc-api-CfQNUy7g.js";import{S as d}from"./stats.min-BpIepu9J.js";import{m as p,t as m,a as c}from"./index-tywNknxv.js";import{p as b,C as u,i as f,n as g,W as h,d as v,h as x,c as y}from"./index-CrrO1BJs.js";const z=document.getElementById("container"),a=new b,w=a.get(u),t=w.create();t.scene=new f(a);t.renderer=new g(a,z);t.camera=new h(a);t.scene.setup();a.init();const k=a.get(v);k.create(t);t.camera.controls.setLookAt(1,2,-2,-2,0,-5);t.scene.three.background=null;const $=new x(a),S=await fetch("https://thatopen.github.io/engine_components/resources/small.frag"),B=await S.arrayBuffer(),L=new Uint8Array(B),A=$.load(L);t.scene.three.add(A);const C=new y(a),e=C.create(t),E=document.getElementById("minimap"),l=e.renderer.domElement;l.style.borderRadius="12px";E.append(l);e.resize();const o=new d;o.showPanel(2);document.body.append(o.dom);o.dom.style.left="0px";o.dom.style.zIndex="unset";t.renderer.onBeforeUpdate.add(()=>o.begin());t.renderer.onAfterUpdate.add(()=>o.end());p.init();const r=e.getSize(),i=m.create(()=>c`
    <bim-panel label="Minimap Tutorial" class="options-menu">
      <bim-panel-section collapsed label="Controls">
      
        <bim-checkbox checked="true" label="Enabled" 
          @change="${({target:n})=>{e.enabled=n.value}}">  
        </bim-checkbox>
        
        <bim-checkbox checked label="Lock rotation" 
          @change="${({target:n})=>{e.lockRotation=n.value}}">  
        </bim-checkbox>
        
        <bim-number-input 
          slider label="Zoom" value="${e.zoom}" min="0.01" max="0.5" step="0.01" 
          @change="${({target:n})=>{e.zoom=n.value}}">
        </bim-number-input>
        
        <bim-number-input 
          slider label="Front offset" value="${e.frontOffset}" min="0" max="5" step="1" 
          @change="${({target:n})=>{e.frontOffset=n.value}}">
        </bim-number-input>
                
        <div style="display: flex; gap: 12px">
        
          <bim-number-input slider value="${r.x}" pref="Size X" min="100" max="500" step="10"              
            @change="${({target:n})=>{const s=e.getSize();s.x=n.value,e.resize(s)}}">
          </bim-number-input>        
        
          <bim-number-input slider value="${r.y}" pref="Size Y" min="100" max="500" step="10"            
            @change="${({target:n})=>{const s=e.getSize();s.y=n.value,e.resize(s)}}">
          </bim-number-input>
        </div>
  
        
      </bim-panel-section>
    </bim-panel>
    `);document.body.append(i);const I=m.create(()=>c`
      <bim-button class="phone-menu-toggler" icon="solar:settings-bold"
        @click="${()=>{i.classList.contains("options-menu-visible")?i.classList.remove("options-menu-visible"):i.classList.add("options-menu-visible")}}">
      </bim-button>
    `);document.body.append(I);
