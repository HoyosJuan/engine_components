import{t as i,B as r,M as a,C as s,D as c,A as l}from"./index-vsiIwi5G.js";import{k as m,C as p,b}from"./index-CA2cPfXk.js";import{C as d}from"./index-BhNtB8fA.js";import{W as u,S as h}from"./index-W7GLNhb1.js";import{S as f,a as g}from"./simple-camera-CmWpoHk7.js";const w=document.getElementById("container"),o=new d,y=o.get(u),e=y.create();e.scene=new f(o);e.renderer=new h(o,w);e.camera=new g(o);o.init();const C=new i({color:"#6528D7"}),x=new r,S=new a(x,C);e.scene.three.add(S);e.scene.setup();e.camera.controls.setLookAt(3,3,3,0,0,0);m.registerComponents();const k=p.create(()=>b`
    <bim-panel label="Worlds Tutorial" style="position: fixed; top: 5px; right: 5px" active>
      <bim-panel-section style="padding-top: 10px">
      
        <bim-color-input 
          label="Background Color" color="#202932" 
          @input="${({target:n})=>{e.scene.three.background=new s(n.color)}}">
        </bim-color-input>
        
        <bim-number-input 
          slider step="0.1" label="Directional lights intensity" value="1.5" min="0.1" max="10"
          @change="${({target:n})=>{for(const t of e.scene.three.children)t instanceof c&&(t.intensity=n.value)}}">
        </bim-number-input>
        
        <bim-number-input 
          slider step="0.1" label="Ambient light intensity" value="1" min="0.1" max="5"
          @change="${({target:n})=>{for(const t of e.scene.three.children)t instanceof l&&(t.intensity=n.value)}}">
        </bim-number-input>
        
      </bim-panel-section>
    </bim-panel>
    `);document.body.append(k);
