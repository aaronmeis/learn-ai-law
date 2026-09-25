/* ============================================================
   UI ENGINE & ROUTING
   ============================================================ */
const $=(s,root=document)=>(root||document).querySelector(s);
const $$=(s,root=document)=>Array.from((root||document).querySelectorAll(s));
const esc=t=>t?t.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"):"" ;

function defaultMode(){try{return window.matchMedia&&matchMedia("(prefers-color-scheme: light)").matches?"light":"dark";}catch(e){return "dark";}}

const LS={
  get(k,d=null){try{const v=localStorage.getItem(k);return v?JSON.parse(v):d;}catch(e){return d;}},
  set(k,v){try{localStorage.setItem(k,JSON.stringify(v));}catch(e){}},
  del(k){try{localStorage.removeItem(k);}catch(e){}}
};

function go(v){
  $$("#nav .nav-item").forEach(el=>el.classList.toggle("active",el.dataset.v===v));
  $$("section.view").forEach(el=>el.classList.toggle("active",el.id==="v-"+v));
  LS.set("view",v);
  window.scrollTo(0,0);
}

$$("#nav .nav-item").forEach(el=>el.onclick=()=>go(el.dataset.v));

function iconPath(name){
  const mode = LS.get("appMode", defaultMode());
  return mode === "light" ? `assets/${name}_light.jpg` : `assets/${name}.jpg`;
}

/* ---- Dashboard ---- */
function renderDashboard(){
  const el=$("#v-dashboard");
  const mods=allModules();
  const done=mods.filter(m=>LS.get(moduleKey(m.w,m.i),false)).length;
  const pct=Math.round((done/mods.length)*100);
  const learned=DATA.glossary.filter(g=>fcState(g.term).box>=4).length;
  const due=DATA.glossary.filter(g=>fcState(g.term).due<=Date.now()).length;
  const selfSolid=DATA.ladder.reduce((a,l)=>a+l.r.filter(r=>LS.get("self:"+l.key+":"+r.n)==="solid").length,0);
  const totalRungs=DATA.ladder.reduce((a,l)=>a+l.r.length,0);
  
  let totalLinks = 0;
  for(let c in EXTERNAL_REFS) totalLinks += EXTERNAL_REFS[c].length;
  
  let h=`<span class="badge">ENTERPRISE ARCHITECT CONSOLE</span>
  <h1 style="margin-top:.9rem">AI Law and Responsible AI Study Console</h1>
  <p class="lead">A six-week program for enterprise AI architects covering <b>Contracts (35%)</b>, <b>Intellectual Property (25%)</b>, <b>Regulatory and Litigation (25%)</b>, and <b>Responsible AI (15%)</b> (NIST RMF and ISO 42001) integration.</p>
  
  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:1rem;margin-bottom:1.5rem">
    <div style="background:var(--card-bg);border:1px solid var(--border-color);border-radius:12px;padding:.9rem 1.1rem;display:flex;align-items:center;gap:12px">
      <img src="${iconPath('hero')}" style="width:48px;height:48px;border-radius:10px;border:1px solid var(--accent-color);object-fit:cover;flex-shrink:0">
      <div><div style="font-weight:700;font-size:.88rem;color:var(--text-primary)">AI Law &amp; EA</div><div style="font-size:.74rem;color:var(--text-dim)">Legal-Tech Core</div></div>
    </div>
    <div style="background:var(--card-bg);border:1px solid var(--border-color);border-radius:12px;padding:.9rem 1.1rem;display:flex;align-items:center;gap:12px">
      <img src="${iconPath('contract')}" style="width:48px;height:48px;border-radius:10px;border:1px solid var(--r200);object-fit:cover;flex-shrink:0">
      <div><div style="font-weight:700;font-size:.88rem;color:var(--text-primary)">Contracts (35%)</div><div style="font-size:.74rem;color:var(--text-dim)">Terms &amp; DPAs</div></div>
    </div>
    <div style="background:var(--card-bg);border:1px solid var(--border-color);border-radius:12px;padding:.9rem 1.1rem;display:flex;align-items:center;gap:12px">
      <img src="${iconPath('regulatory')}" style="width:48px;height:48px;border-radius:10px;border:1px solid var(--r300);object-fit:cover;flex-shrink:0">
      <div><div style="font-weight:700;font-size:.88rem;color:var(--text-primary)">Regulatory (25%)</div><div style="font-size:.74rem;color:var(--text-dim)">EU Act &amp; FTC</div></div>
    </div>
    <div style="background:var(--card-bg);border:1px solid var(--border-color);border-radius:12px;padding:.9rem 1.1rem;display:flex;align-items:center;gap:12px">
      <img src="${iconPath('responsible')}" style="width:48px;height:48px;border-radius:10px;border:1px solid var(--r100);object-fit:cover;flex-shrink:0">
      <div><div style="font-weight:700;font-size:.88rem;color:var(--text-primary)">Responsible AI (15%)</div><div style="font-size:.74rem;color:var(--text-dim)">NIST RMF &amp; ISO</div></div>
    </div>
  </div>

  <div class="grid" style="margin-bottom:1.5rem">
    <div class="statcard"><div class="num">${pct}%</div><div class="lbl">curriculum complete (${done}/${mods.length} modules)</div>
      <div class="progbar" id="dProg"><i class="b100"></i><i class="b200"></i><i class="b300"></i></div></div>
    <div class="statcard"><div class="num">${due}</div><div class="lbl">flashcards due now (${learned}/${DATA.glossary.length} in long-term memory)</div></div>
    <div class="statcard"><div class="num">${selfSolid}/${totalRungs}</div><div class="lbl">ladder rungs self-rated "solid"</div></div>
    <div class="statcard"><div class="num">${totalLinks}</div><div class="lbl">external legal references indexed</div></div>
  </div>
  <div class="note danger"><b>Public Exemplars Only.</b> No real company agreements or confidential text are used. All redline exercises use published vendor terms, standard templates (Common Paper, Bonterms, SCL), statutes, opinions, and synthetic data.</div>
  <div class="grid">
    <div class="card"><h3>Curriculum</h3><p style="color:var(--text-secondary);font-size:.86rem">Six weeks of module readings, action steps, artifact scenarios, and collapsible scenarios.</p><div class="btnrow" style="margin:.8rem 0 0"><button class="b" onclick="go('curriculum')">Open curriculum →</button></div></div>
    <div class="card"><h3>Progress map</h3><p style="color:var(--text-secondary);font-size:.86rem">The 100 to 300 learning ladder per pillar. Self-rate your progress as not yet, shaky, or solid.</p><div class="btnrow" style="margin:.8rem 0 0"><button class="b" onclick="go('map')">Open map →</button></div></div>
    <div class="card"><h3>Flashcards and Quiz</h3><p style="color:var(--text-secondary);font-size:.86rem">Keyboard-navigable spaced-repetition cards (Space, Arrow keys, 1-3) and self-assessment quizzes.</p><div class="btnrow" style="margin:.8rem 0 0"><button class="b" onclick="go('flash')">Flashcards →</button><button class="b" onclick="go('quiz')">Quiz →</button></div></div>
    <div class="card"><h3>Shorts gallery</h3><p style="color:var(--text-secondary);font-size:.86rem">Vertical NotebookLM explainers for the curriculum, plus ten new ones on the September standards, Measure and TEVV, security RMF, and AIBOM pages.</p><div class="btnrow" style="margin:.8rem 0 0"><button class="b" onclick="go('shorts')">Open shorts →</button></div></div>
    <div class="card"><h3>Week decks</h3><p style="color:var(--text-secondary);font-size:.86rem">One presenter deck per curriculum week. Move between weeks, then through the slides. Educational only.</p><div class="btnrow" style="margin:.8rem 0 0"><button class="b" onclick="go('decks')">Open week decks →</button></div></div>
    <div class="card"><h3>Practice checklist</h3><p style="color:var(--text-secondary);font-size:.86rem">Pre-meeting checklist with expandable side-by-side comparisons of effective practices versus high-risk anti-patterns.</p><div class="btnrow" style="margin:.8rem 0 0"><button class="b" onclick="go('counsel')">Practice →</button></div></div>
    <div class="card"><h3>EU AI products</h3><p style="color:var(--text-secondary);font-size:.86rem">Putting AI in products, using AI to create products, roles, risk tiers, GPAI embeds, CE marking, product liability, plus an <b>EU vs US</b> contrast for the same product patterns.</p><div class="btnrow" style="margin:.8rem 0 0"><button class="b" onclick="go('euproducts')">EU AI products →</button></div></div>
    <div class="card"><h3>Standards map</h3><p style="color:var(--text-secondary);font-size:.86rem">Three bands: words (22989), methods (23894, 31000, 42005, NIST AI RMF), and obligations (42001, the EU AI Act, 42006). Not a family tree.</p><div class="btnrow" style="margin:.8rem 0 0"><button class="b" onclick="go('stdmap')">Standards map →</button></div></div>
    <div class="card"><h3>ISO/IEC 22989</h3><p style="color:var(--text-secondary);font-size:.86rem">Why, what, how, and when for the AI concepts and terminology standard. The dictionary behind 42001 and 23894. Not a certificate.</p><div class="btnrow" style="margin:.8rem 0 0"><button class="b" onclick="go('iso22989')">ISO 22989 →</button></div></div>
    <div class="card"><h3>ISO/IEC 23894</h3><p style="color:var(--text-secondary);font-size:.86rem">ISO/IEC 23894:2023 guidance, used with ISO 31000. Principles, framework, and risk process, plus the public annex headings. Not a certificate. Pairs with ISO/IEC 42001.</p><div class="btnrow" style="margin:.8rem 0 0"><button class="b" onclick="go('iso23894')">ISO 23894 →</button></div></div>
    <div class="card"><h3>ISO/IEC 42001</h3><p style="color:var(--text-secondary);font-size:.86rem">Certifiable AI management system: clauses 4-10, 38 Annex A controls, Statement of Applicability, and how it differs from NIST AI RMF and the EU AI Act.</p><div class="btnrow" style="margin:.8rem 0 0"><button class="b" onclick="go('iso42001')">ISO 42001 →</button></div></div>
    <div class="card"><h3>Generative AI Profile</h3><p style="color:var(--text-secondary);font-size:.86rem">NIST AI 600-1 (26 July 2024). Twelve generative-AI risks on top of Govern, Map, Measure, and Manage. Not a statute and not a second framework.</p><div class="btnrow" style="margin:.8rem 0 0"><button class="b" onclick="go('nist6001')">GenAI profile →</button></div></div>
    <div class="card"><h3>NIST Measure and TEVV</h3><p style="color:var(--text-secondary);font-size:.86rem">Why, what, how, and when for Measure in NIST AI RMF 1.0, Table 3, and test, evaluation, verification, and validation. Not a fifth function and not a certificate.</p><div class="btnrow" style="margin:.8rem 0 0"><button class="b" onclick="go('nistmeasure')">Measure and TEVV →</button></div></div>
    <div class="card"><h3>Security RMF</h3><p style="color:var(--text-secondary);font-size:.86rem">NIST SP 800-37, the control catalog in SP 800-53, and DISA STIGs. This is the authorization path. It is not the AI RMF. The STIG viewer is linked as a lab map only.</p><div class="btnrow" style="margin:.8rem 0 0"><button class="b" onclick="go('securityrmf')">Security RMF →</button></div></div>
    <div class="card"><h3>EA mapping</h3><p style="color:var(--text-secondary);font-size:.86rem">Cross-walk mapping AI legal terms, IP assets, and compliance rules to <b>TOGAF</b>, <b>Zachman</b>, <b>DoDAF</b>, and <b>NIST AI RMF</b>.</p><div class="btnrow" style="margin:.8rem 0 0"><button class="b" onclick="go('ea')">EA Mapping →</button></div></div>
    <div class="card"><h3>External references</h3><p style="color:var(--text-secondary);font-size:.86rem">Extracted index of ${totalLinks} external primary sources, court dockets, statutes, and law reviews.</p><div class="btnrow" style="margin:.8rem 0 0"><button class="b" onclick="go('refs')">External References →</button></div></div>
  </div>`;
  el.innerHTML=h;
  const by={100:0,200:0,300:0}; mods.forEach(m=>{if(LS.get(moduleKey(m.w,m.i),false))by[m.rung]++;});
  const p=$("#dProg"); if(p){p.children[0].style.width=(by[100]/mods.length*100)+"%";p.children[1].style.width=(by[200]/mods.length*100)+"%";p.children[2].style.width=(by[300]/mods.length*100)+"%";}
}

/* ---- Curriculum ---- */
function moduleKey(w,i){return "mod:"+w+":"+i;}
function allModules(){let a=[];DATA.weeks.forEach(w=>w.mods.forEach((m,i)=>a.push({w:w.n,i,rung:(m.rl.match(/\b(100|200|300)\b/)||[])[1]||"200"})));return a;}
function renderCurriculum(){
  const el=$("#v-curriculum");
  let h=`<h2 class="vh">Six-week curriculum</h2>
  <p class="lead">Work the weeks in order. Each week features an architectural overview, specific module action steps, concrete artifact previews ("What does this look like?"), and collapsible technical scenarios.</p>
  <div class="note danger">Contracts material is conceptual: contract structure, clause taxonomy, and position analysis on public exemplars.</div>`;
  
  DATA.weeks.forEach(w=>{
    const total=w.mods.length, done=w.mods.filter((_,i)=>LS.get(moduleKey(w.n,i),false)).length;
    h+=`<div class="card">
      <div class="weekhead" data-wk="${w.n}"><span class="wk">Week ${w.n}</span><h3>${esc(w.title)} <span class="pill">${w.rungs}</span></h3><span class="pct">${done}/${total}</span></div>
      <div class="weekbody" id="wb-${w.n}">
        <div class="week-opener"><b>Architect Context:</b> ${esc(w.opener)}</div>
        <div class="obj">${esc(w.obj)}</div>
        ${w.mods.map((m,i)=>{const dn=LS.get(moduleKey(w.n,i),false);
          return `<div class="modrow ${dn?"done":""}">
            <div class="modrow-top">
              <input type="checkbox" ${dn?"checked":""} data-mk="${moduleKey(w.n,i)}">
              <div class="mt">${esc(m.t)}<div class="rl">${esc(m.rl)}</div></div>
            </div>
            
            ${m.action?`<div class="action-box"><b>Action Step for Architect:</b> ${esc(m.action)}</div>`:""}
            ${m.lookLike?`<details class="look-box"><summary>What Does This Look Like in Practice?</summary><div style="margin-top:.4rem">${m.lookLike}</div></details>`:""}

            ${m.whyMatters?`<details class="why-matters"><summary>Why This Matters to an AI Architect</summary><p style="margin-top:.4rem">${esc(m.whyMatters)}</p></details>`:""}
          </div>`;}).join("")}
        <div class="deliv"><b>Deliverables:</b> ${esc(w.deliv)}</div>
        <div class="btnrow" style="margin:.6rem 0 0"><button class="b" type="button" data-deck="${w.n}">Open week ${w.n} deck</button></div>
        <div class="vidlist"><b>Primary Videos:</b>${w.vids.map(v=>`<a href="${v.u}" target="_blank" rel="noopener">• ${esc(v.t)} <span class="meta">${esc(v.m)}</span></a>`).join("")}</div>
      </div></div>`;
  });
  el.innerHTML=h;
  $$(".weekhead",el).forEach(hd=>hd.onclick=()=>$("#wb-"+hd.dataset.wk).classList.toggle("open"));
  $$("[data-deck]",el).forEach(b=>b.onclick=(ev)=>{ev.stopPropagation();LS.set("deckWeek",+b.dataset.deck);go("decks");renderDecks();});
  if(!LS.get("seenCurric",false)){$("#wb-1").classList.add("open");LS.set("seenCurric",true);}
  $$('input[data-mk]',el).forEach(cb=>cb.onchange=()=>{
    LS.set(cb.dataset.mk,cb.checked);
    const wk=cb.dataset.mk.split(":")[1];
    renderCurriculum(); $("#wb-"+wk).classList.add("open");
  });
}

/* ---- Progress map ---- */
function renderMap(){
  const el=$("#v-map");
  let h=`<h2 class="vh">Progress map (100 / 200 / 300 ladder)</h2>
  <p class="lead">Self-rate each rung to track your understanding. The Dashboard records your solid ratings.</p><div class="lanes">`;
  const laneIcons = {
    contracts: iconPath("contract"),
    ip: iconPath("hero"),
    reg: iconPath("regulatory"),
    rai: iconPath("responsible")
  };

  DATA.ladder.forEach(l=>{
    h+=`<div class="lane">
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:.8rem">
        <img src="${laneIcons[l.key]||'assets/hero.jpg'}" style="width:32px;height:32px;border-radius:6px;object-fit:cover;border:1px solid var(--border-color)">
        <h3 style="margin-bottom:0">${esc(l.name)}</h3>
      </div>`;
    l.r.forEach(r=>{
      const st=LS.get("self:"+l.key+":"+r.n,"none");
      h+=`<div class="rung l${r.n}"><b>${r.n} level</b>${esc(r.t)}
        <div class="self" data-k="${l.key}:${r.n}">
          <button data-s="none" class="${st==="none"?"on":""}">not yet</button>
          <button data-s="shaky" class="${st==="shaky"?"on":""}">shaky</button>
          <button data-s="solid" class="${st==="solid"?"on":""}">solid</button>
        </div></div>`;
    });
    h+=`</div>`;
  });
  h+=`</div><h3 style="margin:1.5rem 0 .5rem;font-size:1rem">Mini-modules</h3>`;
  DATA.miniModules.forEach(m=>h+=`<div class="card"><h3>${esc(m.name)}</h3><div class="obj" style="margin:.4rem 0 0">${esc(m.t)}</div></div>`);
  el.innerHTML=h;
  $$(".self button",el).forEach(b=>b.onclick=()=>{LS.set("self:"+b.parentElement.dataset.k,b.dataset.s);renderMap();});
}

/* ---- Flashcards ---- */
let fcQueue=[],fcIdx=0,fcShown=false;
const BOX_DELAY=[0,0,12e5,864e5,2592e5,6048e5,18144e5];
function fcState(t){return LS.get("fc:"+t,{box:1,due:0});}

function buildFcQueue(){
  const deckType=LS.get("fcDeck","essential");
  const now=Date.now();
  const sourceTerms=deckType==="essential"?DATA.glossary.filter(g=>g.essential):DATA.glossary;
  const all=sourceTerms.map(g=>({...g,st:fcState(g.term)}));
  const duec=all.filter(g=>g.st.due<=now);
  duec.sort((a,b)=>a.st.box-b.st.box||a.st.due-b.st.due);
  fcQueue=duec.length?duec:all;
  fcIdx=0;fcShown=false;
}

function renderFlash(){
  const el=$("#v-flash");
  const currentDeck=LS.get("fcDeck","essential");
  const essentialCount=DATA.glossary.filter(g=>g.essential).length;
  const totalCount=DATA.glossary.length;
  
  if(!fcQueue.length) buildFcQueue();
  
  const currentSource=currentDeck==="essential"?DATA.glossary.filter(g=>g.essential):DATA.glossary;
  const learned=currentSource.filter(g=>fcState(g.term).box>=4).length;

  let h=`<h2 class="vh">Flashcards</h2>
  <p class="lead">Select a deck below to begin reviewing terms. Use keyboard shortcuts: <span class="kbd-shortcut">Space</span> to flip card, <span class="kbd-shortcut">←</span> / <span class="kbd-shortcut">→</span> to navigate, <span class="kbd-shortcut">1</span> / <span class="kbd-shortcut">2</span> / <span class="kbd-shortcut">3</span> to grade.</p>
  
  <div class="deck-selector">
    <button class="deck-btn ${currentDeck==="essential"?"active":""}" data-fdeck="essential">Quick Essentials Set (${essentialCount} Cards)</button>
    <button class="deck-btn ${currentDeck==="full"?"active":""}" data-fdeck="full">Full Mastery Set (${totalCount} Cards)</button>
  </div>`;
  
  if(fcIdx>=fcQueue.length){
    h+=`<div class="card" style="text-align:center;padding:2.5rem"><h3 style="margin-bottom:.5rem">Round complete!</h3><p style="color:var(--text-secondary);font-size:.9rem;margin-bottom:1.2rem">Reviewed all ${fcQueue.length} cards in the ${currentDeck==="essential"?"Quick Essentials":"Full Mastery"} deck.</p>
      <div class="btnrow" style="justify-content:center"><button class="b" id="fcRestart">Review round again</button><button class="b" id="fcReset">Reset deck progress</button></div></div>`;
    el.innerHTML=h;
    
    $$(".deck-btn",el).forEach(btn=>btn.onclick=()=>{LS.set("fcDeck",btn.dataset.fdeck);buildFcQueue();renderFlash();});
    $("#fcRestart").onclick=()=>{buildFcQueue();renderFlash();};
    $("#fcReset").onclick=()=>{currentSource.forEach(g=>LS.del("fc:"+g.term));buildFcQueue();renderFlash();};
    return;
  }
  
  const c=fcQueue[fcIdx];
  h+=`<div class="fc-meta">
      <span>Card ${fcIdx+1} / ${fcQueue.length} · box ${fcState(c.term).box} · ${rungPill(c.rung)}</span>
      <span>${learned} / ${currentSource.length} in long-term memory</span>
    </div>
    <div class="fc-stage" id="fcStage" title="Click or Press Space to flip">
      <div class="fc-cat">${esc(c.category)} ${c.essential?essentialPill():''}</div>
      <div class="fc-term">${esc(c.term)}</div>
      ${fcShown?`<div class="fc-def">${esc(c.definition)}</div>${c.see_also?`<div class="fc-hint">see also: ${esc(c.see_also)}</div>`:""}`:`<div class="fc-hint">Click card or Press <span class="kbd-shortcut">Space</span> to flip card</div>`}
    </div>
    
    <div class="btnrow" style="justify-content:center;margin-top:1rem">
      <button class="b" id="fcPrev" ${fcIdx===0?"disabled style='opacity:.4'":""}>← Prev (<span class="kbd-shortcut">←</span>)</button>
      <button class="b" id="fcToggleFlip">${fcShown?"Hide definition":"Show definition"} (<span class="kbd-shortcut">Space</span>)</button>
      <button class="b" id="fcNext" ${fcIdx>=fcQueue.length-1?"disabled style='opacity:.4'":""}>Next → (<span class="kbd-shortcut">→</span>)</button>
    </div>

    ${fcShown?`<div class="fc-controls">
        <button class="again" data-g="0">Again (<span class="kbd-shortcut">1</span>)</button>
        <button class="hard" data-g="1">Hard (<span class="kbd-shortcut">2</span>)</button>
        <button class="good" data-g="2">Good (<span class="kbd-shortcut">3</span>)</button>
      </div>`:""}
      
    <div class="btnrow" style="margin-top:1.5rem"><button class="b" id="fcReset2">Reset deck progress</button></div>`;

  el.innerHTML=h;

  $$(".deck-btn",el).forEach(btn=>btn.onclick=()=>{LS.set("fcDeck",btn.dataset.fdeck);buildFcQueue();renderFlash();});

  const flip=()=>{fcShown=!fcShown;renderFlash();};
  $("#fcStage").onclick=flip;
  $("#fcToggleFlip").onclick=flip;
  
  const prevBtn=$("#fcPrev"); if(prevBtn) prevBtn.onclick=()=>{if(fcIdx>0){fcIdx--;fcShown=false;renderFlash();}};
  const nextBtn=$("#fcNext"); if(nextBtn) nextBtn.onclick=()=>{if(fcIdx<fcQueue.length-1){fcIdx++;fcShown=false;renderFlash();}};

  $$('.fc-controls button[data-g]').forEach(b=>b.onclick=()=>{
    const g=+b.dataset.g,st=fcState(c.term);
    if(g===0)st.box=1; else if(g===1)st.box=Math.max(1,st.box); else st.box=Math.min(6,st.box+1);
    st.due=Date.now()+BOX_DELAY[st.box];
    LS.set("fc:"+c.term,st); fcIdx++; fcShown=false; renderFlash();
  });
  $("#fcReset2").onclick=()=>{currentSource.forEach(g=>LS.del("fc:"+g.term));buildFcQueue();renderFlash();};
}

document.addEventListener("keydown",e=>{
  if(!$("#v-flash").classList.contains("active"))return;
  if(["INPUT","TEXTAREA"].includes(document.activeElement.tagName))return;

  if(e.code==="Space"){
    e.preventDefault();
    fcShown=!fcShown;
    renderFlash();
  } else if(e.code==="ArrowLeft"){
    e.preventDefault();
    if(fcIdx>0){fcIdx--;fcShown=false;renderFlash();}
  } else if(e.code==="ArrowRight"){
    e.preventDefault();
    if(fcIdx<fcQueue.length-1){fcIdx++;fcShown=false;renderFlash();}
  } else if(fcShown&&["1","2","3"].includes(e.key)){
    const b=$(`.fc-controls button[data-g="${+e.key-1}"]`);
    if(b)b.click();
  }
});

/* ---- External References Section ---- */
function renderReferences(){
  const el=$("#v-refs");
  const q=(LS.get("refq","")||"").toLowerCase();
  const selectedCat=LS.get("refcat","all");
  const cats=Object.keys(EXTERNAL_REFS);
  
  let totalLinks = 0;
  for(let c in EXTERNAL_REFS) totalLinks += EXTERNAL_REFS[c].length;
  
  let h=`<h2 class="vh">External reference library <span style="font-size:1rem;color:var(--text-dim)">${totalLinks} verified links</span></h2>
  <p class="lead">All external sources extracted directly from the Obsidian study notes, grouped by legal domain and primary category. All links open directly to authoritative external sources.</p>
  
  ${totalLinks===0?'<div class="note danger"><b>External References Offline:</b> No links currently loaded. Re-run <code>python generate_spa.py</code> to refresh links from the Obsidian vault.</div>':''}
  
  <input class="search" id="refSearch" placeholder="filter references by title, URL, or domain…" value="${esc(q)}">
  
  <div class="gfilters">
    <button class="b ${selectedCat==="all"?"on":""}" data-rcat="all">All categories (${totalLinks})</button>
    ${cats.map(c=>`<button class="b ${selectedCat===c?"on":""}" data-rcat="${esc(c)}">${esc(c)} (${EXTERNAL_REFS[c].length})</button>`).join("")}
  </div>`;

  cats.filter(c=>selectedCat==="all"||selectedCat===c).forEach(c=>{
    const items=EXTERNAL_REFS[c].filter(item=>(
      !q || (item.anchor + item.url + (item.sources||[]).join(" ")).toLowerCase().includes(q)
    ));
    if(!items.length) return;

    h+=`<h3 style="margin:1.4rem 0 .6rem;font-size:1rem;color:var(--accent-color)">${esc(c)} <span style="color:var(--text-dim);font-weight:400">· ${items.length}</span></h3>`;
    
    items.forEach(item=>{
      h+=`<div class="ref-card">
        <div class="ref-info">
          <a class="ref-anchor" href="${esc(item.url)}" target="_blank" rel="noopener">${esc(item.anchor)}</a>
          <div class="ref-url">${esc(item.url)}</div>
          ${item.sources&&item.sources.length?`<div class="ref-sources">Obsidian notes: ${esc(item.sources.join(", "))}</div>`:""}
        </div>
        <a class="b" href="${esc(item.url)}" target="_blank" rel="noopener" style="font-size:.76rem;flex-shrink:0">Open ↗</a>
      </div>`;
    });
  });

  el.innerHTML=h;

  const s=$("#refSearch");
  if(s){
    s.oninput=()=>{
      LS.set("refq",s.value);
      const p=s.selectionStart;
      renderReferences();
      const ns=$("#refSearch");
      if(ns){ns.focus();ns.setSelectionRange(p,p);}
    };
  }

  $$("[data-rcat]",el).forEach(b=>b.onclick=()=>{
    LS.set("refcat",b.dataset.rcat);
    renderReferences();
  });
}

/* ---- Quiz ---- */
function renderQuiz(){
  const el=$("#v-quiz");
  const weeks=[...new Set(DATA.quiz.map(q=>q.week))].sort((a,b)=>a-b);
  const sel=LS.get("quizWeek",weeks[0]);
  let h=`<h2 class="vh">Self-assessment quiz</h2>
  <p class="lead">Cover the answers first. Grade yourself honestly. Missed questions map to that week's reading.</p>
  <div class="btnrow">`+weeks.map(w=>`<button class="b ${w==sel?"on":""}" data-qw="${w}">Week ${w}</button>`).join("")+`</div>`;
  const qs=DATA.quiz.filter(q=>q.week==sel);
  qs.forEach((q,qi)=>{
    h+=`<div class="qcard" data-qi="${qi}"><div class="qq">${esc(q.question)} ${rungPill(q.rung)} <span class="pill">${esc(q.pillar)}</span></div>`;
    if(q.type==="mc"&&q.options){h+=`<div class="qopts">`+q.options.map(o=>`<label data-o="${esc(o)}"><input type="radio" name="q${qi}" style="margin-right:8px">${esc(o)}</label>`).join("")+`</div>`;}
    else{h+=`<button class="reveal">Show model answer</button>`;}
    h+=`<div class="qexp"><b>Answer:</b> ${esc(q.answer)}<br><br><b>Explanation:</b> ${esc(q.explanation)}</div></div>`;
  });
  el.innerHTML=h;
  $$("[data-qw]",el).forEach(b=>b.onclick=()=>{LS.set("quizWeek",+b.dataset.qw);renderQuiz();});
  $$(".qcard",el).forEach(card=>{
    const qi=+card.dataset.qi,q=qs[qi];
    $$(".qopts label",card).forEach(l=>l.onclick=ev=>{
      ev.preventDefault();
      const picked=l.dataset.o;
      $$(".qopts label",card).forEach(x=>{
        x.classList.remove("correct","wrong");
        const input=$("input",x);
        if(input) input.checked=x===l;
      });
      if(picked===q.answer) l.classList.add("correct");
      else{
        l.classList.add("wrong");
        const ok=$$(".qopts label",card).find(x=>x.dataset.o===q.answer);
        if(ok) ok.classList.add("correct");
      }
      $(".qexp",card).classList.add("show");
    });
    const rv=$(".reveal",card);
    if(rv) rv.onclick=()=>$(".qexp",card).classList.add("show");
  });
}

/* ---- Week decks ---- */
let deckItems=[];
let deckSlide=0;
const DECK_VIDEOS={1:"media/decks/week-1.mp4",2:"media/decks/week-2.mp4",3:"media/decks/week-3.mp4",5:"media/decks/week-5.mp4"};
async function loadDecks(){
  try{
    const res=await fetch("decks-catalog.json?ts="+Date.now());
    const data=await res.json();
    deckItems=data.items||[];
  }catch(e){ deckItems=[]; }
  renderDecks();
}
function renderDecks(){
  const el=$("#v-decks");
  if(!el) return;
  const week=Number(LS.get("deckWeek",1))||1;
  const it=deckItems.find(d=>Number(d.week)===week)||deckItems[0];
  const ready=deckItems.filter(d=>d.status==="ready").length;
  let h=`<h2 class="vh">Week decks <span style="font-size:1rem;color:var(--text-dim)">${ready}/${deckItems.length||6} ready</span></h2>
  <p class="lead">The week walkthrough plays at the same width as the slide viewer. Under it, pull up one snapshot at a time. Weeks 4 and 6 do not have a walkthrough yet. Educational only — not legal advice.</p>
  <div class="btnrow">`+(deckItems.length?deckItems:[{week:1},{week:2},{week:3},{week:4},{week:5},{week:6}]).map(d=>`<button class="b ${Number(d.week)===week?"on":""}" data-dw="${d.week}">Week ${d.week}</button>`).join("")+`</div>`;
  const slides=(it&&it.slides&&it.slides.length)?it.slides:[];
  if(deckSlide>slides.length-1) deckSlide=0;
  if(!it || it.status!=="ready" || !slides.length){
    h+=`<div class="card"><h3>Week ${week}</h3><p style="color:var(--text-secondary)">This deck is still generating. Slides show here once the PDF snapshots are on the site.</p></div>`;
  }else{
    const src=slides[deckSlide];
    const vid=DECK_VIDEOS[week];
    if(vid) h+=`<video class="deck-video" id="deckVideo" controls playsinline autoplay src="${esc(vid)}"></video>`;
    h+=`<div class="row" style="margin:.8rem 0">
      <button class="b" type="button" id="deckPrev">Previous slide</button>
      <button class="b" type="button" id="deckNext">Next slide</button>
      <span style="color:var(--text-dim);font-size:.8rem" id="deckMeta"></span>
    </div>
    <div class="deck-frame"><img class="deck-slide" alt="Week ${week} slide ${deckSlide+1}" src="${esc(src)}"></div>
    <div class="deck-thumbs" aria-label="Slide thumbnails">`+slides.map((s,idx)=>`<button type="button" class="${idx===deckSlide?"active":""}" data-ds="${idx}" title="Slide ${idx+1}"><img alt="" src="${esc(s)}"></button>`).join("")+`</div>`;
  }
  el.innerHTML=h;
  $$("[data-dw]",el).forEach(b=>b.onclick=()=>{LS.set("deckWeek",+b.dataset.dw);deckSlide=0;renderDecks();});
  const prev=$("#deckPrev"), next=$("#deckNext");
  if(it && it.slides && it.slides.length){
    const n=it.slides.length;
    const meta=$("#deckMeta");
    if(meta) meta.textContent=`Slide ${deckSlide+1} of ${n}`;
    if(prev) prev.onclick=()=>{deckSlide=(deckSlide-1+n)%n;paintDeckSlide();};
    if(next) next.onclick=()=>{deckSlide=(deckSlide+1)%n;paintDeckSlide();};
    $$("[data-ds]",el).forEach(b=>b.onclick=()=>{deckSlide=Number(b.dataset.ds)||0;paintDeckSlide();});
    const activeThumb=el.querySelector(".deck-thumbs button.active");
    if(activeThumb&&activeThumb.scrollIntoView) activeThumb.scrollIntoView({inline:"center",block:"nearest"});
  }
  const vidEl=$("#deckVideo");
  if(vidEl) vidEl.play().catch(()=>{});
}
function paintDeckSlide(){
  const el=$("#v-decks");
  const week=Number(LS.get("deckWeek",1))||1;
  const it=deckItems.find(d=>Number(d.week)===week);
  const slides=(it&&it.slides)||[];
  if(!el||!slides.length) return;
  if(deckSlide<0||deckSlide>slides.length-1) deckSlide=0;
  const img=$(".deck-slide",el);
  if(img){ img.src=slides[deckSlide]; img.alt=`Week ${week} slide ${deckSlide+1}`; }
  const meta=$("#deckMeta");
  if(meta) meta.textContent=`Slide ${deckSlide+1} of ${slides.length}`;
  $$("[data-ds]",el).forEach(b=>b.classList.toggle("active",Number(b.dataset.ds)===deckSlide));
  const activeThumb=el.querySelector(".deck-thumbs button.active");
  if(activeThumb&&activeThumb.scrollIntoView) activeThumb.scrollIntoView({inline:"center",block:"nearest"});
}
document.addEventListener("keydown",ev=>{
  const view=$("#v-decks");
  if(!view||!view.classList.contains("active")) return;
  const tag=(ev.target&&ev.target.tagName)||"";
  if(tag==="INPUT"||tag==="TEXTAREA"||tag==="SELECT"||tag==="VIDEO") return;
  const week=Number(LS.get("deckWeek",1))||1;
  const it=deckItems.find(d=>Number(d.week)===week);
  if(!it||!it.slides||!it.slides.length) return;
  const n=it.slides.length;
  if(ev.key==="ArrowRight"){deckSlide=(deckSlide+1)%n;paintDeckSlide();}
  else if(ev.key==="ArrowLeft"){deckSlide=(deckSlide-1+n)%n;paintDeckSlide();}
  else return;
  ev.preventDefault();
});

/* ---- Glossary ---- */
/* ---- Shorts gallery ---- */
let shortItems=[];
let shortI=0;
async function loadShorts(){
  try{
    const res=await fetch("shorts-catalog.json?ts="+Date.now());
    const data=await res.json();
    shortItems=data.items||[];
  }catch(e){
    shortItems=[];
  }
  renderShorts();
}
function renderShorts(){
  const el=$("#v-shorts");
  if(!el) return;
  const ready=shortItems.filter(it=>it.status==="ready").length;
  const total=shortItems.length||25;
  let h=`<h2 class="vh">Shorts gallery <span style="font-size:1rem;color:var(--text-dim)">${ready}/${total} ready</span></h2>
  <p class="lead">Vertical NotebookLM explainers tied to the curriculum. Pick an episode from the rail. Educational only — not legal advice.</p>
  <div class="shorts-gallery">
    <div class="shorts-player">
      <div class="row">
        <button class="b" type="button" id="shortPrev">Prev</button>
        <button class="b" type="button" id="shortNext">Next</button>
        <span class="muted" id="shortMeta" style="font-size:.78rem;color:var(--text-dim)"></span>
      </div>
      <div class="carousel" id="carousel">
        <div class="carousel-stage">
          <video id="shortVideo" controls playsinline webkit-playsinline></video>
        </div>
        <div class="carousel-cap" id="shortCap">Waiting for downloads…</div>
      </div>
    </div>
    <div class="thumbs" id="shortThumbs" aria-label="Shorts episode list"></div>
  </div>`;
  el.innerHTML=h;
  const thumbs=$("#shortThumbs");
  if(!shortItems.length){
    thumbs.innerHTML=`<p style="color:var(--text-dim);font-size:.86rem">No catalog yet. Shorts appear here as NotebookLM videos finish generating.</p>`;
  }else{
    thumbs.innerHTML=shortItems.map((it,idx)=>
      `<button type="button" class="${idx===shortI?"active":""} ${it.status==="ready"?"ready":"pending"}" data-i="${idx}">${esc(it.title||it.name)}<br><span class="tagpill">${esc(it.status||"pending")}</span></button>`
    ).join("");
    thumbs.querySelectorAll("button").forEach(b=>b.onclick=()=>{shortI=Number(b.dataset.i);showShort();});
  }
  const prev=$("#shortPrev"); const next=$("#shortNext");
  if(prev) prev.onclick=()=>{if(!shortItems.length)return;shortI=(shortI-1+shortItems.length)%shortItems.length;showShort();};
  if(next) next.onclick=()=>{if(!shortItems.length)return;shortI=(shortI+1)%shortItems.length;showShort();};
  showShort();
}
function showShort(){
  const it=shortItems[shortI];
  if(!it){
    const cap=$("#shortCap"); if(cap) cap.textContent="Waiting for downloads…";
    return;
  }
  const v=$("#shortVideo");
  const src=it.file||(`media/shorts/${it.name}.mp4`);
  if(v && v.getAttribute("src")!==src){ v.src=src; }
  const cap=$("#shortCap"); if(cap) cap.textContent=it.title||it.name;
  const meta=$("#shortMeta"); if(meta) meta.textContent=`${shortI+1} / ${shortItems.length} · ${it.status||"?"}`;
  const buttons=$$("#shortThumbs button");
  buttons.forEach((b,idx)=>b.classList.toggle("active",idx===shortI));
  const active=buttons[shortI];
  if(active && typeof active.scrollIntoView==="function"){
    active.scrollIntoView({behavior:"smooth",inline:"center",block:"nearest"});
  }
}

function rungTip(n){
  const map={
    100:"Rung 100, orient. Name the rule and where it sits. You are not yet reading the statute, contract, or standard line by line.",
    200:"Rung 200, read the instrument. Work from the statute, contract, standard, or case itself, not only a summary.",
    300:"Rung 300, unsettled. Argue the open points, and say where courts or counsel disagree."
  };
  return map[Number(n)]||("Rung "+n+". Depth on the 100 / 200 / 300 ladder. Not a score.");
}
const ESSENTIAL_TIP="Essential means this term is in the Quick Essentials flashcard deck. A term without this badge is only in the Full Mastery deck.";
function rungPill(n){
  return `<span class="pill has-tip r${n}" tabindex="0" data-tip="${esc(rungTip(n))}" title="${esc(rungTip(n))}">${n}</span>`;
}
function essentialPill(){
  return `<span class="pill has-tip r100" tabindex="0" data-tip="${esc(ESSENTIAL_TIP)}" title="${esc(ESSENTIAL_TIP)}">Essential</span>`;
}

function renderGlossary(){
  const el=$("#v-glossary");
  const q=(LS.get("gq","")||"").toLowerCase();
  const cat=LS.get("gcat","all");
  const cats=[...new Set(DATA.glossary.map(g=>g.category))];
  let h=`<h2 class="vh">Glossary <span style="font-size:1rem;color:var(--text-dim)">${DATA.glossary.length} terms</span></h2>
  <p class="lead">Feeds the flashcard deck. Search terms, definitions, and cross-references. The number on a card is a learning rung, not a score. Hover it. 100 is orient, 200 is read the instrument, 300 is unsettled. Essential means the term is in the Quick Essentials deck.</p>
  <input class="search" id="gSearch" placeholder="filter terms…" value="${esc(q)}">
  <div class="gfilters"><button class="b ${cat==="all"?"on":""}" data-gc="all">All (${DATA.glossary.length})</button>`+cats.map(c=>{
    const count = DATA.glossary.filter(g=>g.category===c).length;
    return `<button class="b ${cat===c?"on":""}" data-gc="${esc(c)}">${esc(c)} (${count})</button>`;
  }).join("")+`</div>`;
  
  cats.filter(c=>cat==="all"||c===cat).forEach(c=>{
    const items=DATA.glossary.filter(g=>{
      const extra=(g.examples||[]).map(e=>e.label+" "+e.note+" "+e.body).join(" ");
      return g.category===c&&(!q||(g.term+g.definition+(g.see_also||"")+extra).toLowerCase().includes(q));
    });
    if(!items.length)return;
    h+=`<h3 style="margin:1.1rem 0 .5rem;font-size:.95rem">${esc(c)} <span style="color:var(--text-dim);font-weight:400">· ${items.length}</span></h3>`;
    items.forEach(g=>{
      const ex=(g.examples||[]).map(e=>`<div class="gex"><div class="gex-label">${esc(e.label)}</div><p>${esc(e.note)}</p><pre>${esc(e.body)}</pre></div>`).join("");
      h+=`<div class="gterm"><h4>${esc(g.term)} ${rungPill(g.rung)} ${g.essential?essentialPill():''}</h4><p>${esc(g.definition)}</p>${ex}${g.see_also?`<div class="sa">see also: ${esc(g.see_also)}</div>`:""}</div>`;
    });
  });
  el.innerHTML=h;
  const s=$("#gSearch");
  s.oninput=()=>{LS.set("gq",s.value);const p=s.selectionStart;renderGlossary();const ns=$("#gSearch");ns.focus();ns.setSelectionRange(p,p);};
  $$("[data-gc]",el).forEach(b=>b.onclick=()=>{LS.set("gcat",b.dataset.gc);renderGlossary();});
}

/* ---- Prompts ---- */
function renderPrompts(){
  const el=$("#v-prompts");
  let h=`<h2 class="vh">Prompt library</h2>
  <p class="lead">Seven study prompts. The last two cover the standards map, NIST AI 600-1, and the labels that get merged. Full text is in <code>learn-ai-law/prompts/</code>.</p>
  <div class="note danger"><b>Data Hygiene Rule:</b> No confidential text goes into any model. Every exercise runs on public exemplars (published terms, standard templates, statutes, opinions, and synthetic data).</div>`;
  DATA.prompts.forEach(p=>{
    h+=`<div class="promptcat"><h3>${esc(p.cat)} <span class="pill">${esc(p.model)}</span></h3>
      <div class="obj" style="margin:.15rem 0 .4rem">${esc(p.desc)}</div>
      <div style="font-size:.8rem;color:var(--text-dim);margin-bottom:.4rem">Library items: ${p.items.map(esc).join(" · ")}</div>
      <details class="promptbox"><summary>Flagship prompt</summary><pre>${esc(p.flagship)}</pre><button class="copybtn" data-c="${encodeURIComponent(p.flagship)}">Copy</button></details></div>`;
  });
  el.innerHTML=h;
  $$(".copybtn",el).forEach(b=>b.onclick=()=>{try{navigator.clipboard.writeText(decodeURIComponent(b.dataset.c));b.textContent="Copied";b.classList.add("copied");setTimeout(()=>{b.textContent="Copy";b.classList.remove("copied");},1200);}catch(e){}});
}

/* ---- Practice Checklist ---- */
function renderCounsel(){
  const el=$("#v-counsel");
  const done=DATA.checklist.filter((_,i)=>LS.get("cl:"+i,false)).length;
  let h=`<h2 class="vh">Practice checklist</h2>
  <p class="lead">Verification steps when working as a technical liaison on AI deployments. Expand items to compare effective practices against high-risk anti-patterns.</p>
  
  <div class="card" style="margin-bottom:1.5rem">
    <div style="display:flex;justify-content:space-between;align-items:center">
      <h3>Deployment Verification Checklist</h3>
      <span class="pct" style="font-weight:700;color:var(--accent-color)">${done} / ${DATA.checklist.length} items checked</span>
    </div>
  </div>`;

  DATA.checklist.forEach((item,i)=>{
    const dn=LS.get("cl:"+i,false);
    const isOpen=LS.get("cl-open:"+i,false);
    
    h+=`<div class="cl-card">
      <div class="cl-header ${dn?"done":""}">
        <input type="checkbox" ${dn?"checked":""} data-cl="${i}">
        <div class="cl-title" data-cl-toggle="${i}">${esc(item.title)}</div>
        <button class="cl-toggle-btn" data-cl-toggle="${i}">${isOpen?"Hide details":"Show details"}</button>
      </div>
      
      <div class="cl-detail ${isOpen?"open":""}" id="cld-${i}">
        <div class="good-bad-grid">
          <div class="gb-box good-box">
            <h5>Effective practice</h5>
            ${esc(item.good)}
          </div>
          <div class="gb-box bad-box">
            <h5>High-risk anti-pattern</h5>
            ${esc(item.bad)}
          </div>
        </div>
      </div>
    </div>`;
  });

  h+=`<div class="note good" style="margin-top:1.5rem"><b>Integration Note:</b> Combine this checklist with the <b>Translation</b> prompt and the <b>Socratic examiner</b> mock counsel prompt.</div>`;
  el.innerHTML=h;

  $$('input[data-cl]',el).forEach(cb=>cb.onchange=(e)=>{
    e.stopPropagation();
    LS.set("cl:"+cb.dataset.cl,cb.checked);
    renderCounsel();
  });

  $$('[data-cl-toggle]',el).forEach(btn=>btn.onclick=()=>{
    const idx=btn.dataset.clToggle;
    const curr=LS.get("cl-open:"+idx,false);
    LS.set("cl-open:"+idx,!curr);
    renderCounsel();
  });
}

/* ---- EU AI products (placing AI in products / using AI to create products) ---- */
function renderEUProducts(){
  const el=$("#v-euproducts");
  if(!el||!DATA.euProducts) return;
  const P=DATA.euProducts;
  const tab=LS.get("euProdTab","overview");

  let h=`<h2 class="vh">EU AI products</h2>
  <p class="lead">Study map for product and platform teams shipping into the EU: putting AI inside a product, using AI to design or generate product content, and the other AI Act pieces that change launch risk. Statute: <b>${esc(P.statute)}</b>. Content refreshed ${esc(P.updated)}. <b>Not legal advice.</b></p>
  <div class="note danger"><b>Two different questions.</b> "Does this product contain an AI system?" is an AI Act classification problem. "Did we use AI while building a non-AI product?" is mostly contracts, IP, and ordinary product safety unless the shipped good itself performs AI inference.</div>
  <div class="note good" style="margin-top:.8rem"><b>Matching shorts (21–25).</b> Two product questions · AI inside the product · AI used to build the product · EU vs US product lanes · Same hiring bot, two markets. <button class="b" type="button" onclick="go('shorts')" style="margin-left:.35rem">Open shorts →</button></div>

  <div class="ea-subnav">
    <button class="ea-tab-btn ${tab==="overview"?"active":""}" data-euptab="overview">Overview</button>
    <button class="ea-tab-btn ${tab==="inproduct"?"active":""}" data-euptab="inproduct">AI in products</button>
    <button class="ea-tab-btn ${tab==="create"?"active":""}" data-euptab="create">AI to create products</button>
    <button class="ea-tab-btn ${tab==="contrast"?"active":""}" data-euptab="contrast">EU vs US</button>
    <button class="ea-tab-btn ${tab==="roles"?"active":""}" data-euptab="roles">Roles</button>
    <button class="ea-tab-btn ${tab==="risk"?"active":""}" data-euptab="risk">Risk tiers</button>
    <button class="ea-tab-btn ${tab==="gpai"?"active":""}" data-euptab="gpai">GPAI embeds</button>
    <button class="ea-tab-btn ${tab==="conformity"?"active":""}" data-euptab="conformity">Conformity &amp; CE</button>
    <button class="ea-tab-btn ${tab==="liability"?"active":""}" data-euptab="liability">Liability stack</button>
    <button class="ea-tab-btn ${tab==="timeline"?"active":""}" data-euptab="timeline">Timeline</button>
    <button class="ea-tab-btn ${tab==="checklist"?"active":""}" data-euptab="checklist">Launch checklist</button>
    <button class="ea-tab-btn ${tab==="scenarios"?"active":""}" data-euptab="scenarios">Scenarios</button>
    <button class="ea-tab-btn ${tab==="sources"?"active":""}" data-euptab="sources">Sources</button>
  </div>`;

  if(tab==="overview"){
    h+=`<div class="ea-card">
      <h3>Decision sequence before you ship</h3>
      <p style="color:var(--text-secondary);font-size:.86rem">Work these in order. Skipping role assignment is how teams discover Art. 25 the hard way.</p>
      <div class="ea-grid">`;
    P.decisionSteps.forEach(s=>{
      h+=`<div class="ea-box"><h4>Step ${s.n}. ${esc(s.t)}</h4><p style="color:var(--text-secondary);margin:0">${esc(s.d)}</p></div>`;
    });
    h+=`</div></div>
    <div class="note good"><b>Digital Omnibus reality check.</b> High-risk Annex III duties move to <b>2 Dec 2027</b> and Annex I product-safety AI duties to <b>2 Aug 2028</b>. Article 50 transparency for chatbots and synthetic media still largely lands on <b>2 Aug 2026</b>. Deferral is not a holiday from inventory work.</div>`;
  }

  if(tab==="inproduct"){
    h+=`<div class="ea-card">
      <h3>Putting AI in a product</h3>
      <p style="color:var(--text-secondary);font-size:.86rem">When the shipped product itself runs or exposes an AI system: chat features, ranking, vision, voice, on-device models, or safety components inside regulated hardware.</p>
      <div class="ea-grid">`;
    P.putAiInProduct.forEach(x=>{
      h+=`<div class="ea-box"><h4>${esc(x.h)}</h4><p style="color:var(--text-secondary);margin:0">${esc(x.b)}</p></div>`;
    });
    h+=`</div></div>`;
  }

  if(tab==="create"){
    h+=`<div class="ea-card">
      <h3>Using AI to create a product</h3>
      <p style="color:var(--text-secondary);font-size:.86rem">Design copilots, generative assets, and AI-assisted manufacturing. The finished good may stay outside the AI Act while the tool use still creates deployer, IP, and marketing-claim risk.</p>
      <div class="ea-grid">`;
    P.useAiToCreate.forEach(x=>{
      h+=`<div class="ea-box"><h4>${esc(x.h)}</h4><p style="color:var(--text-secondary);margin:0">${esc(x.b)}</p></div>`;
    });
    h+=`</div></div>`;
  }

  if(tab==="contrast"){
    const C=P.usEuContrast;
    h+=`<div class="ea-card">
      <h3>${esc(C.headline)}</h3>
      <p style="color:var(--text-secondary);font-size:.86rem">${esc(C.blurb)}</p>
      <div class="note danger" style="margin-top:1rem"><b>US posture in one line.</b> ${esc(P.usPosture)}</div>
      <table class="ea-table" style="margin-top:1rem">
        <thead><tr><th style="width:18%">Topic</th><th>EU AI Act / product lane</th><th>US law in the same area</th></tr></thead>
        <tbody>`;
    C.rows.forEach(r=>{
      h+=`<tr><td><b>${esc(r.topic)}</b></td><td>${esc(r.eu)}</td><td>${esc(r.us)}</td></tr>`;
    });
    h+=`</tbody></table>
    </div>
    <div class="ea-card">
      <h3>Contrast examples (same product pattern)</h3>
      <p style="color:var(--text-secondary);font-size:.86rem">Read each row as one feature shipped to both markets. The failure mode is assuming one column clears the other.</p>`;
    C.examples.forEach(ex=>{
      h+=`<div style="margin:1rem 0 1.25rem;padding:1rem;border:1px solid var(--border-color);border-radius:10px;background:var(--card-bg2)">
        <h4 style="margin:0 0 .7rem;color:var(--text-primary)">${esc(ex.title)}</h4>
        <div class="eu-contrast-grid">
          <div style="background:var(--card-bg);border:1px solid var(--border-color);border-radius:8px;padding:.8rem"><h5 style="color:var(--accent-color);margin:0 0 .35rem;font-size:.84rem">EU lane</h5><p style="margin:0;font-size:.84rem;color:var(--text-secondary)">${esc(ex.eu)}</p></div>
          <div style="background:var(--card-bg);border:1px solid var(--border-color);border-radius:8px;padding:.8rem"><h5 style="color:var(--r200);margin:0 0 .35rem;font-size:.84rem">US lane</h5><p style="margin:0;font-size:.84rem;color:var(--text-secondary)">${esc(ex.us)}</p></div>
        </div>
      </div>`;
    });
    h+=`</div>
    <div class="ea-card">
      <h3>Architect takeaways</h3>
      <ul style="color:var(--text-secondary);font-size:.88rem;line-height:1.55;padding-left:1.1rem">`;
    C.takeaways.forEach(t=>{ h+=`<li style="margin-bottom:.45rem">${esc(t)}</li>`; });
    h+=`</ul>
      <div class="btnrow" style="margin-top:1rem"><button class="b" onclick="LS.set('euProdTab','scenarios');renderEUProducts();">Open dual-market hiring scenario →</button></div>
    </div>`;
  }

  if(tab==="roles"){
    h+=`<div class="ea-card">
      <h3>Supply-chain roles</h3>
      <p style="color:var(--text-secondary);font-size:.86rem">One product can create multiple roles across components. Name them in the architecture review, not after a customer questionnaire arrives.</p>
      <table class="ea-table"><thead><tr><th>Role</th><th>Hook</th><th>What it means for product teams</th></tr></thead><tbody>`;
    P.roles.forEach(r=>{
      h+=`<tr><td><b>${esc(r.role)}</b></td><td>${esc(r.art)}</td><td>${esc(r.duty)}</td></tr>`;
    });
    h+=`</tbody></table></div>`;
  }

  if(tab==="risk"){
    h+=`<div class="ea-card">
      <h3>Risk tiers that matter for products</h3>
      <table class="ea-table"><thead><tr><th>Tier</th><th>When it hits a product</th><th>What to do</th></tr></thead><tbody>`;
    P.riskTiers.forEach(r=>{
      h+=`<tr><td><b>${esc(r.tier)}</b></td><td>${esc(r.when)}</td><td>${esc(r.action)}</td></tr>`;
    });
    h+=`</tbody></table></div>`;
  }

  if(tab==="gpai"){
    h+=`<div class="ea-card">
      <h3>GPAI models inside your product</h3>
      <p style="color:var(--text-secondary);font-size:.86rem">Foundation-model APIs and open-weight bases are common. Keep model-provider duties and your system-provider duties separate on the whiteboard.</p>
      <ul style="color:var(--text-secondary);font-size:.88rem;line-height:1.55;padding-left:1.1rem">`;
    P.gpaiNotes.forEach(n=>{ h+=`<li style="margin-bottom:.45rem">${esc(n)}</li>`; });
    h+=`</ul></div>`;
  }

  if(tab==="conformity"){
    h+=`<div class="ea-card">
      <h3>Conformity assessment, docs, and CE marking</h3>
      <div class="ea-grid">`;
    P.conformity.forEach(c=>{
      h+=`<div class="ea-box"><h4>${esc(c.h)}</h4><p style="color:var(--text-secondary);margin:0">${esc(c.d)}</p></div>`;
    });
    h+=`</div></div>`;
  }

  if(tab==="liability"){
    h+=`<div class="ea-card">
      <h3>Liability stack beyond the AI Act</h3>
      <div class="ea-grid">`;
    P.liability.forEach(c=>{
      h+=`<div class="ea-box"><h4>${esc(c.h)}</h4><p style="color:var(--text-secondary);margin:0">${esc(c.d)}</p></div>`;
    });
    h+=`</div></div>`;
  }

  if(tab==="timeline"){
    h+=`<div class="ea-card">
      <h3>Dates product teams should pin</h3>
      <table class="ea-table"><thead><tr><th>Date</th><th>What changes</th></tr></thead><tbody>`;
    P.timeline.forEach(t=>{
      h+=`<tr><td><b>${esc(t.date)}</b></td><td>${esc(t.item)}</td></tr>`;
    });
    h+=`</tbody></table></div>`;
  }

  if(tab==="checklist"){
    h+=`<div class="ea-card">
      <h3>Pre-launch checklist</h3>
      <p style="color:var(--text-secondary);font-size:.86rem">Use before an architecture review or EU go-live. Expand nothing fancy: each row is a yes/no with an owner.</p>
      <table class="ea-table"><thead><tr><th>#</th><th>Check</th><th>Why it matters</th></tr></thead><tbody>`;
    P.checklist.forEach((c,i)=>{
      h+=`<tr><td>${i+1}</td><td><b>${esc(c.t)}</b></td><td>${esc(c.why)}</td></tr>`;
    });
    h+=`</tbody></table></div>`;
  }

  if(tab==="scenarios"){
    h+=`<div class="ea-card">
      <h3>Worked scenarios</h3>
      <p style="color:var(--text-secondary);font-size:.86rem">Side-by-side patterns in the same style as the practice checklist.</p>`;
    P.scenarios.forEach(s=>{
      h+=`<div style="margin:1rem 0 1.25rem;padding:1rem;border:1px solid var(--border-color);border-radius:10px;background:var(--card-bg2)">
        <h4 style="margin:0 0 .7rem;color:var(--text-primary)">${esc(s.title)}</h4>
        <div class="gb-grid" style="display:grid;grid-template-columns:1fr 1fr;gap:.8rem">
          <div class="gb-box" style="background:var(--good-bg);border:1px solid var(--good);border-radius:8px;padding:.8rem"><h5 style="color:var(--good);margin:0 0 .35rem">Better pattern</h5><p style="margin:0;font-size:.84rem;color:var(--text-secondary)">${esc(s.good)}</p></div>
          <div class="gb-box bad-box" style="border-radius:8px;padding:.8rem"><h5 style="margin:0 0 .35rem">Failure pattern</h5><p style="margin:0;font-size:.84rem;color:var(--text-secondary)">${esc(s.bad)}</p></div>
        </div>
      </div>`;
    });
    h+=`</div>`;
  }

  if(tab==="sources"){
    h+=`<div class="ea-card">
      <h3>Primary and practitioner sources</h3>
      <ul style="list-style:none;padding:0">`;
    P.sources.forEach(s=>{
      h+=`<li style="margin-bottom:.55rem"><a href="${esc(s.u)}" target="_blank" rel="noopener" style="color:var(--accent-color)">${esc(s.t)}</a></li>`;
    });
    h+=`</ul>
      <p style="color:var(--text-dim);font-size:.8rem;margin-top:1rem">Primary instruments beat this synthesis. Re-read EUR-Lex after every Omnibus-style amendment.</p>
    </div>`;
  }

  el.innerHTML=h;
  Array.from(el.querySelectorAll(".ea-tab-btn")).forEach(btn=>{
    btn.onclick=()=>{
      LS.set("euProdTab",btn.dataset.euptab);
      renderEUProducts();
    };
  });
}


/* ---- ISO/IEC 42001 AIMS ---- */
function renderISO42001(){
  const el=$("#v-iso42001");
  if(!el||!DATA.iso42001) return;
  const P=DATA.iso42001;
  const tab=LS.get("isoTab","overview");
  let h=`<h2 class="vh">ISO/IEC 42001</h2>
  <p class="lead">${esc(P.oneLine)} ${esc(P.citation)} Study notes refreshed ${esc(P.updated)}. <b>Not legal advice.</b> The standard text is copyrighted; this page paraphrases structure and does not reproduce it.</p>
  <div class="note danger"><b>Certificate is not model safety and not AI Act conformity.</b> 42001 audits the management system. It does not score a model. EN adoption does not make it an EU AI Act Article 40 harmonised standard and does not create a presumption of conformity.</div>
  <div class="ea-subnav">
    <button class="ea-tab-btn ${tab==="overview"?"active":""}" data-isotab="overview">Overview</button>
    <button class="ea-tab-btn ${tab==="clauses"?"active":""}" data-isotab="clauses">Clauses 4-10</button>
    <button class="ea-tab-btn ${tab==="annex"?"active":""}" data-isotab="annex">Annex A</button>
    <button class="ea-tab-btn ${tab==="family"?"active":""}" data-isotab="family">Related standards</button>
    <button class="ea-tab-btn ${tab==="crosswalk"?"active":""}" data-isotab="crosswalk">NIST and EU</button>
    <button class="ea-tab-btn ${tab==="path"?"active":""}" data-isotab="path">Certification path</button>
    <button class="ea-tab-btn ${tab==="myths"?"active":""}" data-isotab="myths">Misreads</button>
    <button class="ea-tab-btn ${tab==="sources"?"active":""}" data-isotab="sources">Sources</button>
  </div>`;
  if(tab==="overview"){
    h+=`<div class="ea-card"><h3>What to remember before an architecture review</h3>
      <div class="ea-grid">
        <div class="ea-box"><h4>Management system, not a model score</h4><p style="color:var(--text-secondary);margin:0">Same Harmonized Structure as ISO/IEC 27001. The object of certification is the AIMS inside a defined scope and role (develop, provide, and/or use).</p></div>
        <div class="ea-box"><h4>Two assessments, not one</h4><p style="color:var(--text-secondary);margin:0">Clause 6 asks for AI risk to the organisation and a separate AI system impact assessment (people and society). ISO/IEC 23894 and 42005 are the companion methods. NIST Map is a workable risk method, not a substitute for the impact assessment.</p></div>
        <div class="ea-box"><h4>38 controls, none automatic</h4><p style="color:var(--text-secondary);margin:0">Annex A (A.2 through A.10) is a reference set of controls. The Statement of Applicability records what you included, what you excluded, and why. Annex B is the normative implementation guidance for those controls. The count of 38 is the published structure of Annex A, not a duty to adopt all 38.</p></div>
        <div class="ea-box"><h4>Europe adopted the text, not a duty to certify</h4><p style="color:var(--text-secondary);margin:0">CEN ratified EN ISO/IEC 42001:2026 on 13 March 2026. The EN was available on 18 March 2026, identical to ISO/IEC 42001:2023. CEN members must give it national-standard status, and withdraw conflicting national standards, at the latest by 30 September 2026. That duty is on the standards bodies, not on companies. Buyers may ask for a certificate. EN adoption still does not equal AI Act conformity.</p></div>
        <div class="ea-box"><h4>Stage 2 is an audit, not a clause</h4><p style="color:var(--text-secondary);margin:0">Stage 1 and Stage 2 come from ISO/IEC 17021-1, the same certification path as ISO/IEC 27001. Stage 1 asks whether the AIMS is designed well enough to audit. Stage 2 asks whether it actually runs. A policy with no operating history can pass Stage 1 and fail Stage 2.</p></div>
      </div></div>`;
  }
  if(tab==="clauses"){
    h+=`<div class="ea-card"><h3>Requirements (Clauses 4-10)</h3><p style="color:var(--text-secondary);font-size:.86rem">These clauses are not optional. An auditor certifies against them. Annex A is selected through the Statement of Applicability. Clauses 4-10 are not. Stage 1 and Stage 2 in the last column are certification-audit steps under ISO/IEC 17021-1, not clause numbers.</p><table class="ea-table"><thead><tr><th>Clause</th><th>Name</th><th>Architect reading</th><th>Stage 1 vs Stage 2</th></tr></thead><tbody>`;
    P.clauses.forEach(c=>{ h+=`<tr><td><b>${esc(c.id)}</b></td><td>${esc(c.name)}</td><td>${esc(c.d)}</td><td>${esc(c.stage||"")}</td></tr>`; });
    h+=`</tbody></table><p style="color:var(--text-secondary);font-size:.86rem;margin-top:1rem">${esc(P.annexPointer)}</p>
    <div class="note good" style="margin-top:1rem"><b>Clause 9 is where Stage 2 is won or lost.</b> Stage 1 accepts a documented monitoring, internal-audit, and management-review programme. Stage 2 samples the records those programmes produced. A policy with no audit trail fails Stage 2.</div></div>`;
  }
  if(tab==="annex"){
    h+=`<div class="ea-card"><h3>Annex A reference objectives</h3><p style="color:var(--text-secondary);font-size:.86rem">Nine objectives, 38 controls, numbered A.2 through A.10 (there is no A.1). Themes below are study labels, not the standard's control wording.</p><table class="ea-table"><thead><tr><th>Objective</th><th>Name</th><th>What it organises</th></tr></thead><tbody>`;
    P.annex.forEach(c=>{ h+=`<tr><td><b>${esc(c.id)}</b></td><td>${esc(c.name)}</td><td>${esc(c.theme)}</td></tr>`; });
    h+=`</tbody></table><p style="color:var(--text-secondary);font-size:.86rem;margin-top:1rem">${esc(P.annexPointer)}</p></div>`;
  }
  if(tab==="family"){
    h+=`<div class="ea-card"><h3>Standards that answer a 42001 clause</h3><table class="ea-table"><thead><tr><th>Document</th><th>Why it is on the shelf</th></tr></thead><tbody>`;
    P.family.forEach(c=>{ h+=`<tr><td><b>${esc(c.std)}</b></td><td>${esc(c.role)}</td></tr>`; });
    h+=`</tbody></table></div>`;
  }
  if(tab==="crosswalk"){
    h+=`<div class="ea-card"><h3>Theme crosswalk, not a clause-for-article map</h3><p style="color:var(--text-secondary);font-size:.86rem">These instruments are different types. A row is a shared theme, not equivalence.</p><table class="ea-table"><thead><tr><th>Theme</th><th>ISO/IEC 42001</th><th>NIST AI RMF 1.0</th><th>EU AI Act</th></tr></thead><tbody>`;
    P.crosswalk.forEach(r=>{ h+=`<tr><td><b>${esc(r.theme)}</b></td><td>${esc(r.iso)}</td><td>${esc(r.nist)}</td><td>${esc(r.eu)}</td></tr>`; });
    h+=`</tbody></table></div>`;
  }
  if(tab==="path"){
    h+=`<div class="ea-card"><h3>Certification path</h3><p style="color:var(--text-secondary);font-size:.86rem">${esc(P.pathNote)}</p>
    <table class="ea-table"><thead><tr><th>Step</th><th>What it is</th><th>What the auditor is testing</th></tr></thead><tbody>`;
    P.path.forEach(s=>{ h+=`<tr><td><b>${esc(s.step)}</b></td><td>${esc(s.what)}</td><td>${esc(s.test)}</td></tr>`; });
    h+=`</tbody></table><div class="note good" style="margin-top:1rem">${esc(P.pathGap)}</div></div>`;
  }
  if(tab==="myths"){
    h+=`<div class="ea-card"><h3>Claims that fail a counsel or auditor read</h3>`;
    P.myths.forEach(m=>{
      h+=`<div style="margin:0 0 1rem;padding:1rem;border:1px solid var(--border-color);border-radius:10px;background:var(--card-bg2)"><h4 style="margin:0 0 .4rem">${esc(m.claim)}</h4><p style="margin:0;color:var(--text-secondary)">${esc(m.fact)}</p></div>`;
    });
    h+=`</div>`;
  }
  if(tab==="sources"){
    h+=`<div class="ea-card"><h3>Where to read next</h3><ul style="list-style:none;padding:0">`;
    P.sources.forEach(s=>{ h+=`<li style="margin-bottom:.55rem"><a href="${esc(s.u)}" target="_blank" rel="noopener">${esc(s.t)}</a></li>`; });
    h+=`</ul><p style="color:var(--text-dim);font-size:.8rem;margin-top:1rem">Links open the ISO Online Browsing Platform, not the shop. 22989 is free to read in full. 42001 and 23894 show the public preview only; the rest of those texts is not free. Do not paste a paid standard into a model.</p></div>`;
  }
  el.innerHTML=h;
  Array.from(el.querySelectorAll(".ea-tab-btn")).forEach(btn=>{
    btn.onclick=()=>{ LS.set("isoTab", btn.dataset.isotab); renderISO42001(); };
  });
}

/* ---- ISO/IEC 23894 ---- */
function renderISO23894(){
  const el=$("#v-iso23894");
  if(!el||!DATA.iso23894) return;
  const P=DATA.iso23894;
  const tab=LS.get("iso23894Tab","overview");
  let h=`<h2 class="vh">ISO/IEC 23894</h2>
  <p class="lead">${esc(P.oneLine)} ${esc(P.citation)} Notes refreshed ${esc(P.updated)}. <b>Not legal advice.</b></p>
  <div class="note danger"><b>What was checked.</b> ${esc(P.checked)}</div>
  <div class="ea-subnav">
    <button class="ea-tab-btn ${tab==="overview"?"active":""}" data-i238="overview">Overview</button>
    <button class="ea-tab-btn ${tab==="clauses"?"active":""}" data-i238="clauses">Clauses 4-6</button>
    <button class="ea-tab-btn ${tab==="annex"?"active":""}" data-i238="annex">Annexes</button>
    <button class="ea-tab-btn ${tab==="pair"?"active":""}" data-i238="pair">With 42001 and NIST</button>
    <button class="ea-tab-btn ${tab==="sources"?"active":""}" data-i238="sources">Sources</button>
  </div>`;
  if(tab==="overview"){
    h+=`<div class="ea-card"><h3>Scope, in ISO's words as paraphrased from the catalogue abstract</h3><p style="color:var(--text-secondary)">${esc(P.scope)}</p></div><div class="ea-grid">`;
    P.how.forEach(x=>{ h+=`<div class="ea-box"><h4>${esc(x.h)}</h4><p style="color:var(--text-secondary);margin:0">${esc(x.b)}</p></div>`; });
    h+=`</div><div class="btnrow" style="margin-top:1rem"><button class="b" onclick="go('iso42001')">Open the ISO 42001 view</button></div>`;
  }
  if(tab==="clauses"){
    h+=`<div class="ea-card"><h3>Headings from the ISO contents list</h3><table class="ea-table"><thead><tr><th>Clause</th><th>Title</th><th>Study note</th></tr></thead><tbody>`;
    P.clauses.forEach(c=>{ h+=`<tr><td><b>${esc(c.id)}</b></td><td>${esc(c.name)}</td><td>${esc(c.d)}</td></tr>`; });
    h+=`</tbody></table></div>`;
  }
  if(tab==="annex"){
    h+=`<div class="ea-card"><h3>Annex A objectives confirmed on the public contents list</h3><table class="ea-table"><thead><tr><th>Heading</th><th>Title</th></tr></thead><tbody>`;
    P.annexA.forEach(c=>{ h+=`<tr><td><b>${esc(c.id)}</b></td><td>${esc(c.name)}</td></tr>`; });
    h+=`</tbody></table><p style="color:var(--text-secondary);margin-top:1rem">${esc(P.annexNote)}</p></div>`;
  }
  if(tab==="pair"){
    h+=`<div class="ea-card"><h3>How to place it next to the other two</h3><p style="color:var(--text-secondary)">${esc(P.nist)}</p></div>`;
  }
  if(tab==="sources"){
    h+=`<div class="ea-card"><h3>Sources used for this page</h3><ul style="list-style:none;padding:0">`;
    P.sources.forEach(s=>{ h+=`<li style="margin-bottom:.55rem"><a href="${esc(s.u)}" target="_blank" rel="noopener">${esc(s.t)}</a></li>`; });
    h+=`</ul></div>`;
  }
  el.innerHTML=h;
  Array.from(el.querySelectorAll(".ea-tab-btn")).forEach(btn=>{
    btn.onclick=()=>{ LS.set("iso23894Tab", btn.dataset.i238); renderISO23894(); };
  });
}

/* ---- ISO/IEC 22989 ---- */
function renderISO22989(){
  const el=$("#v-iso22989");
  if(!el||!DATA.iso22989) return;
  const P=DATA.iso22989;
  let h=`<h2 class="vh">ISO/IEC 22989</h2>
  <p class="lead">${esc(P.citation)} Notes refreshed ${esc(P.updated)}. <b>Not legal advice.</b> Definitions from the standard are not copied here.</p>
  <div class="ea-grid">
    <div class="ea-box"><h4>Why</h4><p style="color:var(--text-secondary);margin:0">${esc(P.why)}</p></div>
    <div class="ea-box"><h4>What</h4><p style="color:var(--text-secondary);margin:0">${esc(P.what)}</p></div>
    <div class="ea-box"><h4>When</h4><p style="color:var(--text-secondary);margin:0">${esc(P.when)}</p></div>
  </div>
  <div class="ea-card" style="margin-top:1rem"><h3>How to use it</h3><ul style="color:var(--text-secondary);padding-left:1.1rem">`;
  P.howItems.forEach(x=>{ h+=`<li style="margin-bottom:.45rem">${esc(x)}</li>`; });
  h+=`</ul></div>
  <div class="ea-card"><h3>Top-level contents</h3><p style="color:var(--text-secondary);font-size:.86rem">These are the edition-1 headings (clauses 3–10 and informative Annex A). Subclause titles are left out. The ISO catalogue abstract is the source for what the document is; this table is only the map of the document.</p><table class="ea-table"><thead><tr><th>Clause</th><th>Heading</th></tr></thead><tbody>`;
  P.toc.forEach(c=>{ h+=`<tr><td><b>${esc(c.id)}</b></td><td>${esc(c.name)}</td></tr>`; });
  h+=`</tbody></table></div>
  <div class="note danger">${esc(P.amend)}</div>
  <div class="ea-card"><h3>Sources</h3><ul style="list-style:none;padding:0">`;
  P.sources.forEach(s=>{ h+=`<li style="margin-bottom:.55rem"><a href="${esc(s.u)}" target="_blank" rel="noopener">${esc(s.t)}</a></li>`; });
  h+=`</ul><div class="btnrow"><button class="b" onclick="go('stdmap')">Open the standards map</button></div></div>`;
  el.innerHTML=h;
}

/* ---- NIST AI RMF Measure and TEVV ---- */
function renderNistMeasure(){
  const el=$("#v-nistmeasure");
  if(!el||!DATA.nistMeasure) return;
  const P=DATA.nistMeasure;
  const tab=LS.get("nistMeasureTab","overview");
  let h=`<h2 class="vh">NIST Measure and TEVV</h2>
  <p class="lead">${esc(P.oneLine)} ${esc(P.citation)} Notes refreshed ${esc(P.updated)}. <b>Not legal advice.</b></p>
  <div class="note danger"><b>What was checked.</b> ${esc(P.checked)}</div>
  <div class="ea-subnav">
    <button class="ea-tab-btn ${tab==="overview"?"active":""}" data-nm="overview">Overview</button>
    <button class="ea-tab-btn ${tab==="categories"?"active":""}" data-nm="categories">Measure 1-4</button>
    <button class="ea-tab-btn ${tab==="measure2"?"active":""}" data-nm="measure2">Measure 2</button>
    <button class="ea-tab-btn ${tab==="tevv"?"active":""}" data-nm="tevv">TEVV</button>
    <button class="ea-tab-btn ${tab==="place"?"active":""}" data-nm="place">Where it sits</button>
    <button class="ea-tab-btn ${tab==="myths"?"active":""}" data-nm="myths">Misreads</button>
    <button class="ea-tab-btn ${tab==="sources"?"active":""}" data-nm="sources">Sources</button>
  </div>`;
  if(tab==="overview"){
    h+=`<div class="ea-grid">
      <div class="ea-box"><h4>Why</h4><p style="color:var(--text-secondary);margin:0">${esc(P.why)}</p></div>
      <div class="ea-box"><h4>What</h4><p style="color:var(--text-secondary);margin:0">${esc(P.what)}</p></div>
      <div class="ea-box"><h4>When</h4><p style="color:var(--text-secondary);margin:0">${esc(P.when)}</p></div>
    </div>
    <div class="ea-card" style="margin-top:1rem"><h3>How to use it</h3><ul style="color:var(--text-secondary);padding-left:1.1rem">`;
    P.howItems.forEach(x=>{ h+=`<li style="margin-bottom:.45rem">${esc(x)}</li>`; });
    h+=`</ul><div class="btnrow"><button class="b" onclick="go('stdmap')">Open the standards map</button></div></div>`;
  }
  if(tab==="categories"){
    h+=`<div class="ea-card"><h3>Table 3, in four rows</h3><p style="color:var(--text-secondary);font-size:.86rem">These are the category outcomes in NIST AI 100-1. The subcategory sentences are paraphrased. Actions in the Playbook are suggestions, not extra rows.</p><table class="ea-table"><thead><tr><th>Category</th><th>Outcome</th><th>What it asks you to do</th><th>Architect reading</th></tr></thead><tbody>`;
    P.categories.forEach(c=>{ h+=`<tr><td><b>Measure ${esc(c.id)}</b></td><td>${esc(c.name)}</td><td>${esc(c.d)}</td><td>${esc(c.architect)}</td></tr>`; });
    h+=`</tbody></table></div>`;
  }
  if(tab==="measure2"){
    h+=`<div class="ea-card"><h3>Measure 2 is wider than a bias audit</h3><p style="color:var(--text-secondary);font-size:.86rem">Measure 2 evaluates the trustworthy characteristics Map already identified. Lines below follow Table 3's numbering. Wording is paraphrased.</p><table class="ea-table"><thead><tr><th>Line</th><th>Topic</th><th>Study note</th></tr></thead><tbody>`;
    P.measure2.forEach(c=>{ h+=`<tr><td><b>${esc(c.id)}</b></td><td>${esc(c.name)}</td><td>${esc(c.d)}</td></tr>`; });
    h+=`</tbody></table></div>`;
  }
  if(tab==="tevv"){
    h+=`<div class="ea-card"><h3>What NIST actually says TEVV is</h3><p style="color:var(--text-secondary)">${esc(P.tevvNote)}</p><p style="color:var(--text-secondary)">${esc(P.separation)}</p></div>
    <div class="ea-card"><h3>Appendix A task split</h3><table class="ea-table"><thead><tr><th>When</th><th>What the TEVV tasks cover</th></tr></thead><tbody>`;
    P.tevvTasks.forEach(c=>{ h+=`<tr><td><b>${esc(c.id)}</b></td><td>${esc(c.d)}</td></tr>`; });
    h+=`</tbody></table></div>`;
  }
  if(tab==="place"){
    h+=`<div class="ea-card"><h3>Same theme, different instrument</h3><p style="color:var(--text-secondary);font-size:.86rem">A row is a place to file the work. It is not equivalence.</p><table class="ea-table"><thead><tr><th>Theme</th><th>Use Measure and TEVV here</th><th>Do not treat it as</th></tr></thead><tbody>`;
    P.place.forEach(r=>{ h+=`<tr><td><b>${esc(r.theme)}</b></td><td>${esc(r.here)}</td><td>${esc(r.notThis)}</td></tr>`; });
    h+=`</tbody></table><div class="btnrow" style="margin-top:1rem"><button class="b" onclick="go('iso42001')">Open the ISO 42001 view</button><button class="b" onclick="go('ea')">Open the EA mapping</button></div></div>`;
  }
  if(tab==="myths"){
    h+=`<div class="ea-card"><h3>Claims that fail a close read of AI 100-1</h3>`;
    P.myths.forEach(m=>{
      h+=`<div style="margin:0 0 1rem;padding:1rem;border:1px solid var(--border-color);border-radius:10px;background:var(--card-bg2)"><h4 style="margin:0 0 .4rem">${esc(m.claim)}</h4><p style="margin:0;color:var(--text-secondary)">${esc(m.fact)}</p></div>`;
    });
    h+=`</div>`;
  }
  if(tab==="sources"){
    h+=`<div class="ea-card"><h3>Where to read next</h3><ul style="list-style:none;padding:0">`;
    P.sources.forEach(s=>{ h+=`<li style="margin-bottom:.55rem"><a href="${esc(s.u)}" target="_blank" rel="noopener">${esc(s.t)}</a></li>`; });
    h+=`</ul><p style="color:var(--text-dim);font-size:.8rem;margin-top:1rem">NIST AI 100-1 is a U.S. government publication. The Playbook is a separate voluntary companion and is not reproduced here.</p></div>`;
  }
  el.innerHTML=h;
  Array.from(el.querySelectorAll(".ea-tab-btn")).forEach(btn=>{
    btn.onclick=()=>{ LS.set("nistMeasureTab", btn.dataset.nm); renderNistMeasure(); };
  });
}

/* ---- NIST AI 600-1 Generative AI Profile ---- */
function renderNist6001(){
  const el=$("#v-nist6001");
  if(!el||!DATA.nist6001) return;
  const P=DATA.nist6001;
  const tab=LS.get("nist6001Tab","overview");
  let h=`<h2 class="vh">NIST AI 600-1</h2>
  <p class="lead">${esc(P.oneLine)} ${esc(P.citation)} Notes refreshed ${esc(P.updated)}. <b>Not legal advice.</b></p>
  <div class="note danger"><b>What was checked.</b> ${esc(P.checked)}</div>
  <div class="ea-subnav">
    <button class="ea-tab-btn ${tab==="overview"?"active":""}" data-n6="overview">Overview</button>
    <button class="ea-tab-btn ${tab==="risks"?"active":""}" data-n6="risks">Twelve risks</button>
    <button class="ea-tab-btn ${tab==="place"?"active":""}" data-n6="place">Where it sits</button>
    <button class="ea-tab-btn ${tab==="myths"?"active":""}" data-n6="myths">Misreads</button>
    <button class="ea-tab-btn ${tab==="sources"?"active":""}" data-n6="sources">Sources</button>
  </div>`;
  if(tab==="overview"){
    h+=`<div class="ea-grid">
      <div class="ea-box"><h4>Why</h4><p style="color:var(--text-secondary);margin:0">${esc(P.why)}</p></div>
      <div class="ea-box"><h4>What</h4><p style="color:var(--text-secondary);margin:0">${esc(P.what)}</p></div>
      <div class="ea-box"><h4>When</h4><p style="color:var(--text-secondary);margin:0">${esc(P.when)}</p></div>
    </div>
    <div class="ea-card" style="margin-top:1rem"><h3>How to use it</h3><ul style="color:var(--text-secondary);padding-left:1.1rem">`;
    P.howItems.forEach(x=>{ h+=`<li style="margin-bottom:.45rem">${esc(x)}</li>`; });
    h+=`</ul><div class="btnrow"><button class="b" onclick="go('nistmeasure')">Open Measure and TEVV</button><button class="b" onclick="go('stdmap')">Open the standards map</button></div></div>`;
  }
  if(tab==="risks"){
    h+=`<div class="ea-card"><h3>Section 2, twelve risks</h3><p style="color:var(--text-secondary);font-size:.86rem">Names match the 26 July 2024 profile. The sentences are study paraphrases, not the full subsections. NIST limited the list to risks with an evidence base when the profile was written.</p><table class="ea-table"><thead><tr><th></th><th>Risk</th><th>Study note</th></tr></thead><tbody>`;
    P.risks.forEach(c=>{ h+=`<tr><td><b>${esc(c.id)}</b></td><td>${esc(c.name)}</td><td>${esc(c.d)}</td></tr>`; });
    h+=`</tbody></table></div>`;
  }
  if(tab==="place"){
    h+=`<div class="ea-card"><h3>Same theme, different instrument</h3><p style="color:var(--text-secondary);font-size:.86rem">A row is a place to file the work. It is not equivalence.</p><table class="ea-table"><thead><tr><th>Theme</th><th>Use the profile here</th><th>Do not treat it as</th></tr></thead><tbody>`;
    P.place.forEach(r=>{ h+=`<tr><td><b>${esc(r.theme)}</b></td><td>${esc(r.here)}</td><td>${esc(r.notThis)}</td></tr>`; });
    h+=`</tbody></table><div class="btnrow" style="margin-top:1rem"><button class="b" onclick="go('nistmeasure')">Open Measure and TEVV</button><button class="b" onclick="go('securityrmf')">Open the security RMF</button><button class="b" onclick="go('iso42001')">Open ISO 42001</button></div></div>`;
  }
  if(tab==="myths"){
    h+=`<div class="ea-card"><h3>Claims that fail a close read</h3>`;
    P.myths.forEach(m=>{
      h+=`<div style="margin:0 0 1rem;padding:1rem;border:1px solid var(--border-color);border-radius:10px;background:var(--card-bg2)"><h4 style="margin:0 0 .4rem">${esc(m.claim)}</h4><p style="margin:0;color:var(--text-secondary)">${esc(m.fact)}</p></div>`;
    });
    h+=`</div>`;
  }
  if(tab==="sources"){
    h+=`<div class="ea-card"><h3>Where to read next</h3><ul style="list-style:none;padding:0">`;
    P.sources.forEach(s=>{
      if(s.u==="#") h+=`<li style="margin-bottom:.55rem"><button class="b" onclick="go('nistmeasure')">${esc(s.t)}</button></li>`;
      else h+=`<li style="margin-bottom:.55rem"><a href="${esc(s.u)}" target="_blank" rel="noopener">${esc(s.t)}</a></li>`;
    });
    h+=`</ul><p style="color:var(--text-dim);font-size:.8rem;margin-top:1rem">Read the PDF for the action tables. This page does not reproduce them. Suggested actions are not requirements.</p></div>`;
  }
  el.innerHTML=h;
  Array.from(el.querySelectorAll(".ea-tab-btn")).forEach(btn=>{
    btn.onclick=()=>{ LS.set("nist6001Tab", btn.dataset.n6); renderNist6001(); };
  });
}

/* ---- Security RMF (SP 800-37), not the AI RMF ---- */
function renderSecurityRmf(){
  const el=$("#v-securityrmf");
  if(!el||!DATA.securityRmf) return;
  const P=DATA.securityRmf;
  const tab=LS.get("securityRmfTab","overview");
  let h=`<h2 class="vh">Security RMF</h2>
  <p class="lead">${esc(P.oneLine)} ${esc(P.citation)} Notes refreshed ${esc(P.updated)}. <b>Not legal, security, or accreditation advice.</b></p>
  <div class="note danger"><b>What was checked.</b> ${esc(P.checked)}</div>
  <div class="ea-subnav">
    <button class="ea-tab-btn ${tab==="overview"?"active":""}" data-srmf="overview">Overview</button>
    <button class="ea-tab-btn ${tab==="steps"?"active":""}" data-srmf="steps">Seven steps</button>
    <button class="ea-tab-btn ${tab==="shelf"?"active":""}" data-srmf="shelf">What sits beside it</button>
    <button class="ea-tab-btn ${tab==="myths"?"active":""}" data-srmf="myths">Misreads</button>
    <button class="ea-tab-btn ${tab==="sources"?"active":""}" data-srmf="sources">Sources</button>
  </div>`;
  if(tab==="overview"){
    h+=`<div class="ea-grid">
      <div class="ea-box"><h4>Why</h4><p style="color:var(--text-secondary);margin:0">${esc(P.why)}</p></div>
      <div class="ea-box"><h4>What</h4><p style="color:var(--text-secondary);margin:0">${esc(P.what)}</p></div>
      <div class="ea-box"><h4>When</h4><p style="color:var(--text-secondary);margin:0">${esc(P.when)}</p></div>
    </div>
    <div class="ea-card" style="margin-top:1rem"><h3>How to use it</h3><ul style="color:var(--text-secondary);padding-left:1.1rem">`;
    P.howItems.forEach(x=>{ h+=`<li style="margin-bottom:.45rem">${esc(x)}</li>`; });
    h+=`</ul><div class="btnrow"><button class="b" onclick="go('nistmeasure')">Open Measure and TEVV</button><button class="b" onclick="go('stdmap')">Open the standards map</button></div></div>`;
  }
  if(tab==="steps"){
    h+=`<div class="ea-card"><h3>SP 800-37 in seven steps</h3><p style="color:var(--text-secondary);font-size:.86rem">These are process steps, not clauses of a certifiable management system. Wording is paraphrased.</p><table class="ea-table"><thead><tr><th>Step</th><th>Name</th><th>What you are doing</th></tr></thead><tbody>`;
    P.steps.forEach(c=>{ h+=`<tr><td><b>${esc(c.id)}</b></td><td>${esc(c.name)}</td><td>${esc(c.d)}</td></tr>`; });
    h+=`</tbody></table></div>`;
  }
  if(tab==="shelf"){
    h+=`<div class="ea-card"><h3>Documents that answer a different question</h3><table class="ea-table"><thead><tr><th>Document</th><th>Job</th></tr></thead><tbody>`;
    P.shelf.forEach(c=>{ h+=`<tr><td><b>${esc(c.doc)}</b></td><td>${esc(c.job)}</td></tr>`; });
    h+=`</tbody></table></div>`;
  }
  if(tab==="myths"){
    h+=`<div class="ea-card"><h3>Claims that merge two frameworks</h3>`;
    P.myths.forEach(m=>{
      h+=`<div style="margin:0 0 1rem;padding:1rem;border:1px solid var(--border-color);border-radius:10px;background:var(--card-bg2)"><h4 style="margin:0 0 .4rem">${esc(m.claim)}</h4><p style="margin:0;color:var(--text-secondary)">${esc(m.fact)}</p></div>`;
    });
    h+=`</div>`;
  }
  if(tab==="sources"){
    h+=`<div class="ea-card"><h3>Where to read next</h3><ul style="list-style:none;padding:0">`;
    P.sources.forEach(s=>{ h+=`<li style="margin-bottom:.55rem"><a href="${esc(s.u)}" target="_blank" rel="noopener">${esc(s.t)}</a></li>`; });
    h+=`</ul><p style="color:var(--text-dim);font-size:.8rem;margin-top:1rem">Cite the NIST and DISA publications. The viewer is there so you can practice the map. It is not the source you cite in an authorization package.</p></div>`;
  }
  el.innerHTML=h;
  Array.from(el.querySelectorAll(".ea-tab-btn")).forEach(btn=>{
    btn.onclick=()=>{ LS.set("securityRmfTab", btn.dataset.srmf); renderSecurityRmf(); };
  });
}

/* ---- Words / methods / obligations ---- */
function renderStdMap(){
  const el=$("#v-stdmap");
  if(!el||!DATA.stdMap) return;
  const P=DATA.stdMap;
  let h=`<h2 class="vh">Standards map</h2>
  <p class="lead">Where ISO/IEC 22989, 23894, 42001, NIST AI RMF, and the EU AI Act sit relative to each other. Refreshed ${esc(P.updated)}. <b>Not legal advice.</b></p>
  <div class="note danger">${esc(P.note)}</div>`;
  P.bands.forEach(b=>{
    h+=`<div class="ea-card"><h3>${esc(b.band)}</h3><div class="ea-grid">`;
    b.items.forEach(it=>{
      const btn=it.view?`<div class="btnrow" style="margin-top:.6rem"><button class="b" data-go="${esc(it.view)}">Open</button></div>`:"";
      h+=`<div class="ea-box"><h4>${esc(it.name)}</h4><p style="margin:.2rem 0 .4rem;color:var(--accent-color);font-size:.75rem">${esc(it.kind)}</p><p style="color:var(--text-secondary);margin:0">${esc(it.job)}</p>${btn}</div>`;
    });
    h+=`</div></div>`;
  });
  h+=`<div class="note good">${esc(P.beside)}</div>`;
  el.innerHTML=h;
  Array.from(el.querySelectorAll("[data-go]")).forEach(btn=>{ btn.onclick=()=>go(btn.dataset.go); });
}

/* ---- EA Mapping (TOGAF, Zachman, DoDAF, Responsible AI) ---- */
function renderEA(){
  const el=$("#v-ea");
  const tab=LS.get("eaTab","all");

  let h=`<h2 class="vh">Enterprise Architecture Mapping</h2>
  <p class="lead">Cross-walk mapping AI legal requirements, contract terms, IP rules, regulatory compliance, and <b>Responsible AI (NIST AI RMF / ISO 42001)</b> controls to Enterprise Architecture frameworks. The security RMF (SP 800-37) and an AIBOM are on this page so they are not filed as if they were AI RMF functions.</p>

  <!-- Framework Sub-Nav -->
  <div class="ea-subnav">
    <button class="ea-tab-btn ${tab==="all"?"active":""}" data-eatab="all">All frameworks</button>
    <button class="ea-tab-btn ${tab==="togaf"?"active":""}" data-eatab="togaf">TOGAF ADM</button>
    <button class="ea-tab-btn ${tab==="zachman"?"active":""}" data-eatab="zachman">Zachman Matrix</button>
    <button class="ea-tab-btn ${tab==="dodaf"?"active":""}" data-eatab="dodaf">DoDAF Viewpoints</button>
    <button class="ea-tab-btn ${tab==="rai"?"active":""}" data-eatab="rai">Responsible AI (NIST RMF)</button>
    <button class="ea-tab-btn ${tab==="table"?"active":""}" data-eatab="table">Master cross-walk table</button>
  </div>`;

  if(tab==="all"||tab==="togaf"){
    h+=`<div class="ea-card">
      <h3>TOGAF ADM Mapping (Architecture Development Method)</h3>
      <p style="color:var(--text-secondary);font-size:.86rem">How AI legal, regulatory, and Responsible AI controls map to TOGAF ADM lifecycle phases.</p>
      <div class="ea-grid">`;
      DATA.eaFrameworks.togaf.forEach(item=>{
        h+=`<div class="ea-box">
          <h4>${esc(item.phase)}</h4>
          <div style="font-weight:600;font-size:.8rem;color:var(--accent-color);margin-bottom:.4rem">${esc(item.t)}</div>
          <ul>${item.items.map(it=>`<li>${esc(it)}</li>`).join("")}</ul>
        </div>`;
      });
      h+=`</div>
    </div>`;
  }

  if(tab==="all"||tab==="zachman"){
    h+=`<div class="ea-card">
      <h3>Zachman Framework Matrix Mapping</h3>
      <p style="color:var(--text-secondary);font-size:.86rem">Mapping AI legal risk, IP assets, and Responsible AI controls across the 6 Zachman columns.</p>
      <div class="ea-grid">`;
      DATA.eaFrameworks.zachman.forEach(item=>{
        h+=`<div class="ea-box">
          <h4>${esc(item.col)}</h4>
          <div style="font-weight:600;font-size:.8rem;color:var(--accent-color);margin-bottom:.4rem">${esc(item.t)}</div>
          <ul>${item.items.map(it=>`<li>${esc(it)}</li>`).join("")}</ul>
        </div>`;
      });
      h+=`</div>
    </div>`;
  }

  if(tab==="all"||tab==="dodaf"){
    h+=`<div class="ea-card">
      <h3>DoDAF Viewpoints (Department of Defense Architecture Framework)</h3>
      <p style="color:var(--text-secondary);font-size:.86rem">Mapping AI legal requirements and Responsible AI controls into DoDAF Architectural Viewpoints.</p>
      <div class="ea-grid">`;
      DATA.eaFrameworks.dodaf.forEach(item=>{
        h+=`<div class="ea-box">
          <h4>${esc(item.view)}</h4>
          <div style="font-weight:600;font-size:.8rem;color:var(--accent-color);margin-bottom:.4rem">${esc(item.t)}</div>
          <ul>${item.items.map(it=>`<li>${esc(it)}</li>`).join("")}</ul>
        </div>`;
      });
      h+=`</div>
    </div>`;
  }

  if(tab==="all"||tab==="rai"){
    h+=`<div class="ea-card">
      <h3>Responsible AI (NIST AI RMF 1.0 &amp; ISO 42001) Integration</h3>
      <p style="color:var(--text-secondary);font-size:.86rem">How Responsible AI pillars (GOVERN, MAP, MEASURE, MANAGE) plug directly into Enterprise Architecture frameworks.</p>
      <div class="ea-grid">`;
      DATA.eaFrameworks.rai.forEach(item=>{
        h+=`<div class="ea-box">
          <h4>${esc(item.pillar)}</h4>
          <div style="font-weight:600;font-size:.8rem;color:var(--good);margin-bottom:.4rem">${esc(item.t)}</div>
          <ul>${item.items.map(it=>`<li>${esc(it)}</li>`).join("")}</ul>
        </div>`;
      });
      h+=`</div>
    </div>`;
  }

  if(tab==="all"||tab==="table"){
    h+=`<div class="ea-card">
      <h3>Unified EA, Legal, and Responsible AI Cross-Walk Table</h3>
      <p style="color:var(--text-secondary);font-size:.86rem">Side-by-side reference showing how key AI legal and Responsible AI domains map across Enterprise Architecture frameworks.</p>
      <table class="ea-table">
        <thead>
          <tr>
            <th>AI Legal / RAI Domain</th>
            <th>TOGAF ADM Phase</th>
            <th>Zachman Column</th>
            <th>DoDAF Viewpoint</th>
            <th>Responsible AI (NIST RMF) Plug-In</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><b>Responsible AI Governance</b></td>
            <td>Phase A &amp; G</td>
            <td>Col 6 (Why)</td>
            <td>AV-1 / StdV-1</td>
            <td><b>GOVERN:</b> Executive oversight and risk policy</td>
          </tr>
          <tr>
            <td><b>Vendor Contracting and Indemnity</b></td>
            <td>Phase B / G</td>
            <td>Col 6 (Why) &amp; Col 4 (Who)</td>
            <td>StdV-1 / OV-6a</td>
            <td><b>GOVERN / MANAGE:</b> Executed Common Paper / Bonterms AI Addendum</td>
          </tr>
          <tr>
            <td><b>Training Data and IP Rights</b></td>
            <td>Phase C (Data)</td>
            <td>Col 1 (What)</td>
            <td>DIV-1 / DIV-2</td>
            <td><b>MAP:</b> Training set provenance and IP auditing</td>
          </tr>
          <tr>
            <td><b>Trade Secret and Weight Protection</b></td>
            <td>Phase C &amp; D</td>
            <td>Col 1 (What) &amp; Col 2 (How)</td>
            <td>DIV-2 / SV-1</td>
            <td><b>MAP / MANAGE:</b> Prompt trade secret controls and weight security</td>
          </tr>
          <tr>
            <td><b>AI Output Copyrightability</b></td>
            <td>Phase B / C</td>
            <td>Col 4 (Who) &amp; Col 1 (What)</td>
            <td>AV-2 / DIV-1</td>
            <td><b>GOVERN:</b> Human Authorship Rule (Thaler v. Perlmutter) verification</td>
          </tr>
          <tr>
            <td><b>EU AI Act Compliance</b></td>
            <td>Phase A, B &amp; G</td>
            <td>Col 6 (Why) &amp; Col 5 (When)</td>
            <td>StdV-1 / OV-6a</td>
            <td><b>MAP / MEASURE:</b> High-risk Annex III assessment and Art. 11 logs</td>
          </tr>
          <tr>
            <td><b>Algorithmic Bias and Fairness</b></td>
            <td>Phase B &amp; G</td>
            <td>Col 2 (How) &amp; Col 6 (Why)</td>
            <td>OV-6a / StdV-1</td>
            <td><b>MEASURE:</b> Measure 2.11 when Map named fairness (NYC LL144, EEOC). Measure 2.1 only records the test sets and tools. TEVV is not a fifth function.</td>
          </tr>
          <tr>
            <td><b>Explainability and Safety (XAI)</b></td>
            <td>Phase C &amp; D</td>
            <td>Col 2 (How) &amp; Col 5 (When)</td>
            <td>OV-6a / SV-1</td>
            <td><b>MANAGE:</b> Adverse action notices, real-time guardrails, and ISO/IEC TS 6254 for explainability. Not an AI Act presumption.</td>
          </tr>
          <tr>
            <td><b>NDAA Covered AI Provenance (Sec. 1532)</b></td>
            <td>Phase A, C &amp; D</td>
            <td>Col 1 (What) &amp; Col 3 (Where)</td>
            <td>StdV-1 / DIV-2 / SV-1</td>
            <td><b>MAP / GOVERN:</b> Model-vendor lineage screen for DeepSeek, High Flyer, and covered-nation ties before DOD use</td>
          </tr>
          <tr>
            <td><b>DOD AI Model Assessment Team (Sec. 1533)</b></td>
            <td>Phase B &amp; G</td>
            <td>Col 2 (How) &amp; Col 6 (Why)</td>
            <td>OV-6a / StdV-1</td>
            <td><b>MEASURE / GOVERN:</b> Performance standards, testing procedures, security requirements, ethical-AI compliance</td>
          </tr>
          <tr>
            <td><b>DOD AI Sandboxes (Sec. 1534)</b></td>
            <td>Phase D &amp; G</td>
            <td>Col 3 (Where) &amp; Col 5 (When)</td>
            <td>SV-1 / OV-1</td>
            <td><b>MANAGE:</b> Isolated enclaves before production. The authorization itself is NIST SP 800-37, not the sandbox and not the AI RMF.</td>
          </tr>
          <tr>
            <td><b>AI Futures / Agentic AI Governance (Sec. 1535 + NSCAI)</b></td>
            <td>Phase A &amp; G</td>
            <td>Col 6 (Why) &amp; Col 5 (When)</td>
            <td>AV-1 / StdV-2</td>
            <td><b>GOVERN / MAP:</b> Advanced and agentic AI adoption policy, adversary-use analysis, NSCAI strategy backdrop</td>
          </tr>
          <tr>
            <td><b>Security authorization (SP 800-37)</b></td>
            <td>Phase D &amp; G</td>
            <td>Col 6 (Why) &amp; Col 3 (Where)</td>
            <td>StdV-1 / OV-1</td>
            <td><b>Not an AI RMF function.</b> Prepare through Monitor. SP 800-53 is the catalog. A STIG hardens the product. cATO still has an authorizing official.</td>
          </tr>
          <tr>
            <td><b>AIBOM and SBOM</b></td>
            <td>Phase C</td>
            <td>Col 1 (What)</td>
            <td>DIV-2</td>
            <td><b>MAP:</b> Model inventory beside the software inventory. Study examples are on the AIBOM glossary card. Not a covered-AI determination.</td>
          </tr>
          <tr>
            <td><b>DOD AI/ML Cybersecurity Framework (Sec. 1512)</b></td>
            <td>Phase C, D &amp; G</td>
            <td>Col 2 (How) &amp; Col 3 (Where)</td>
            <td>SV-1 / StdV-1</td>
            <td><b>MANAGE / MEASURE:</b> Controls for data poisoning, jailbreaks, counterfeit parts, and unauthorized access</td>
          </tr>
        </tbody>
      </table>
    </div>`;
  }

  el.innerHTML=h;

  Array.from(el.querySelectorAll(".ea-tab-btn")).forEach(btn=>{
    btn.onclick=()=>{
      LS.set("eaTab",btn.dataset.eatab);
      renderEA();
    };
  });
}

/* ---- Theme Engine ---- */
function applyTheme(palette, mode){
  const themeKey = palette + "-" + mode;
  document.documentElement.setAttribute("data-theme", themeKey);
  LS.set("appPalette", palette);
  LS.set("appMode", mode);
  const icon = $("#themeToggleIcon");
  const text = $("#themeToggleText");
  const select = $("#themeSelect");
  if(icon) icon.textContent = mode === "dark" ? "🌙" : "☀️";
  if(text) text.textContent = mode === "dark" ? "Dark" : "Light";
  if(select) select.value = palette;
  const heroImg = $("#sidebarHeroImg");
  if(heroImg) heroImg.src = mode === "light" ? "assets/hero_light.jpg" : "assets/hero.jpg";
  if(typeof renderDashboard === "function") renderDashboard();
  if(typeof renderMap === "function") renderMap();
}

function initTheme(){
  const savedPalette = LS.get("appPalette", "github");
  const savedMode = LS.get("appMode", defaultMode());
  applyTheme(savedPalette, savedMode);
  
  const btn = $("#themeToggleBtn");
  const select = $("#themeSelect");
  if(btn){
    btn.onclick = () => {
      const currentMode = LS.get("appMode", defaultMode());
      const newMode = currentMode === "dark" ? "light" : "dark";
      applyTheme(LS.get("appPalette", "github"), newMode);
    };
  }
  if(select){
    select.onchange = () => {
      applyTheme(select.value, LS.get("appMode", defaultMode()));
    };
  }
}

/* ---- Init ---- */
try{
  initTheme();renderDashboard();renderCurriculum();renderEUProducts();renderISO42001();renderISO23894();renderISO22989();renderStdMap();renderNistMeasure();renderNist6001();renderSecurityRmf();renderMap();renderFlash();renderQuiz();renderGlossary();renderPrompts();renderCounsel();renderEA();renderReferences();loadDecks();
}catch(err){
  const dash=document.getElementById("v-dashboard");
  if(dash) dash.innerHTML='<h1>The study console did not finish loading</h1><p class="lead">'+esc(err&&err.message?err.message:String(err))+'</p>';
  console.error(err);
}
/* Initial view and hash routing are handled in js/enhance.js. */
