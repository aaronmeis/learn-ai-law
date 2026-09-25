/* ============================================================
   Engagement layer: hash routing, Today screen, Shorts feed,
   mobile tab bar and sheets, search palette, streaks, export.
   Loads after js/data.js and js/app.js and reuses their globals
   (DATA, LS, $, $$, esc, fcState, allModules, moduleKey, go, ...).
   ============================================================ */
(function(){
"use strict";

/* ---------- Views and groups ---------- */
const VIEWS = {
  today:"Today", curriculum:"Curriculum", shorts:"Shorts", decks:"Week decks",
  euproducts:"EU AI products", iso42001:"ISO 42001", iso23894:"ISO 23894", iso22989:"ISO 22989",
  nistmeasure:"Measure & TEVV", nist6001:"GenAI profile", securityrmf:"Security RMF", dashboard:"All topics",
  flash:"Flashcards", quiz:"Quiz", counsel:"Practice checklist", prompts:"Prompts",
  stdmap:"Standards map", map:"Progress map", glossary:"Glossary", ea:"EA mapping", refs:"External references"
};
const GROUPS = {
  learn:["curriculum","shorts","decks","euproducts","iso42001","iso23894","iso22989","nistmeasure","nist6001","securityrmf","dashboard"],
  practice:["flash","quiz","counsel","prompts"],
  reference:["stdmap","map","glossary","ea","refs"]
};
const GROUP_OF = {};
Object.keys(GROUPS).forEach(g=>GROUPS[g].forEach(v=>GROUP_OF[v]=g));
const PILLARS = ["Foundations","Contracts","IP","Regulatory","Responsible AI"];
const GOAL = {shorts:1, reviews:5};
const mq = window.matchMedia("(max-width: 899px)");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const isMobile = ()=>mq.matches;

/* ---------- Progress store (all keys stay in localStorage) ---------- */
function dayKey(d){d=d||new Date();return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0");}
const Store = {
  activity(){return LS.get("activity",{});},
  watched(){return LS.get("shortsWatched",{});},
  shortQuiz(){return LS.get("shortQuiz",{});},
  bump(kind,n){
    const a=this.activity(),k=dayKey();
    a[k]=a[k]||{shorts:0,cards:0,quiz:0};
    a[k][kind]=(a[k][kind]||0)+(n||1);
    LS.set("activity",a);
    if(currentView==="today") renderToday();
  },
  markWatched(id){
    const w=this.watched();
    if(w[id]) return false;
    w[id]=Date.now(); LS.set("shortsWatched",w); this.bump("shorts");
    return true;
  }
};
function dayMet(d){return d&&((d.shorts||0)>=GOAL.shorts||((d.cards||0)+(d.quiz||0))>=GOAL.reviews);}
function streak(){
  const a=Store.activity(); let n=0; const d=new Date();
  if(!dayMet(a[dayKey(d)])) d.setDate(d.getDate()-1);   // today not done yet: count from yesterday
  while(dayMet(a[dayKey(d)])){n++;d.setDate(d.getDate()-1);}
  return n;
}

/* ---------- Routing ---------- */
let currentView = null;
function parseHash(){
  const m=(location.hash||"").match(/^#\/([\w-]+)(?:\/(.+))?$/);
  return m?{v:m[1],sub:m[2]?decodeURIComponent(m[2]):null}:null;
}
function show(v,sub){
  if(!VIEWS[v]||!document.getElementById("v-"+v)) v="today";
  const changed = v!==currentView;
  currentView=v;
  $$("#nav .nav-item").forEach(el=>{
    const on=el.dataset.v===v; el.classList.toggle("active",on);
    if(on) el.setAttribute("aria-current","page"); else el.removeAttribute("aria-current");
  });
  $$("section.view").forEach(el=>el.classList.toggle("active",el.id==="v-"+v));
  const tab = v==="today"||v==="shorts" ? v : (GROUP_OF[v]==="reference"?"more":GROUP_OF[v]);
  $$("#mTabbar [data-tab]").forEach(el=>el.classList.toggle("active",el.dataset.tab===tab));
  document.body.dataset.view=v;
  LS.set("view",v);
  document.title = VIEWS[v]+" · AI Law Study Console";
  closeSheet();
  pauseHiddenMedia();
  if(v==="today") renderToday();
  if(v==="shorts"){ if(sub) selectShortById(sub,false); renderShorts(); }
  if(changed){
    const main=$("#main"); if(main) main.scrollTop=0;
    window.scrollTo(0,0);
  }
}
window.go = function(v){
  const target="#/"+v;
  if(location.hash===target) show(v); else location.hash=target;
};
window.addEventListener("hashchange",()=>{const r=parseHash(); if(r) show(r.v,r.sub);});
// Anchors in the nav navigate by href; drop the click handlers app.js attached.
$$("#nav .nav-item").forEach(el=>el.onclick=null);

function pauseHiddenMedia(){
  $$("section.view:not(.active) video").forEach(vd=>{try{vd.pause();}catch(e){}});
  if(currentView!=="shorts") destroyAllPlayers();
}

/* ---------- Helpers ---------- */
function fmtDur(s){if(!s&&s!==0)return "";s=Math.round(s);return Math.floor(s/60)+":"+String(s%60).padStart(2,"0");}
function h(strings,...vals){return strings.reduce((a,s,i)=>a+s+(i<vals.length?vals[i]:""),"");}
function seenCards(){return DATA.glossary.filter(g=>{try{return localStorage.getItem("fc:"+g.term)!==null;}catch(e){return false;}});}
function dueReviews(){const now=Date.now();return seenCards().filter(g=>fcState(g.term).due<=now);}
function norm(s){return (s||"").toLowerCase();}

/* ---------- Shorts data ---------- */
let shortsMeta = {};
let shortFilter = LS.get("shortFilter","all");
let shortsReady = false;
window.loadShorts = async function(){
  try{
    const [cat,meta]=await Promise.all([
      fetch("shorts-catalog.json").then(r=>r.json()),
      fetch("shorts-meta.json").then(r=>r.ok?r.json():{items:{}}).catch(()=>({items:{}}))
    ]);
    shortsMeta=meta.items||{};
    shortItems=(cat.items||[]).filter(it=>it.status==="ready").map(it=>Object.assign({},it,shortsMeta[it.id]||{}));
  }catch(e){ shortItems=[]; }
  shortsReady=true;
  const r=parseHash(); if(r&&r.v==="shorts"&&r.sub) selectShortById(r.sub,false);
  else { const last=LS.get("lastShort",null); const i=shortItems.findIndex(s=>s.id===last); if(i>=0) shortI=i; }
  renderShorts();
  if(currentView==="today") renderToday();
  buildPaletteIndex();
};
function selectShortById(id,updateHash){
  const i=shortItems.findIndex(s=>s.id===id);
  if(i>=0){shortI=i; LS.set("lastShort",id);}
  if(updateHash!==false) history.replaceState(null,"","#/shorts/"+encodeURIComponent(id));
}
function nextUnwatched(from){
  const w=Store.watched(); const n=shortItems.length; if(!n) return null;
  for(let k=0;k<n;k++){const it=shortItems[(from+k)%n]; if(!w[it.id]) return it;}
  return null;
}
function continueShort(){
  const last=LS.get("lastShort",null); const w=Store.watched();
  const i=shortItems.findIndex(s=>s.id===last);
  if(i>=0&&!w[last]) return shortItems[i];
  return nextUnwatched(i>=0?i+1:0)||shortItems[0];
}
function filteredShorts(){
  const w=Store.watched();
  if(shortFilter==="all") return shortItems;
  if(shortFilter==="unwatched") return shortItems.filter(s=>!w[s.id]);
  return shortItems.filter(s=>s.pillar===shortFilter);
}

/* Related practice for a Short: quiz questions and glossary terms matched on its keywords. */
function relatedFor(it){
  const kws=(it.keywords||[]).map(norm);
  const score=t=>{t=norm(t);let s=0;kws.forEach(k=>{if(k&&t.includes(k))s+=k.length>6?2:1;});return s;};
  const quiz=DATA.quiz.map((q,idx)=>({q,idx,s:score(q.question+" "+q.answer)})).filter(x=>x.s>=3).sort((a,b)=>b.s-a.s).slice(0,2);
  const terms=DATA.glossary.map(g=>({g,s:score(g.term+" "+g.term)})).filter(x=>x.s>=2).sort((a,b)=>b.s-a.s).slice(0,5).map(x=>x.g);
  return {quiz,terms};
}

/* ---------- Players (MP4 or unlisted YouTube) ---------- */
const players = new Set();
let ytReady=null;
function loadYT(){
  if(ytReady) return ytReady;
  ytReady=new Promise(res=>{
    if(window.YT&&window.YT.Player) return res();
    const prev=window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady=()=>{if(prev)prev();res();};
    const s=document.createElement("script"); s.src="https://www.youtube.com/iframe_api"; document.head.appendChild(s);
  });
  return ytReady;
}
function mountPlayer(host,it,opts){
  opts=opts||{};
  const done=()=>{ if(Store.markWatched(it.id)){ refreshWatchedUI(); } if(opts.onEnded) opts.onEnded(); };
  let api={destroy(){},pause(){},play(){},el:null};
  if(it.youtube){
    const div=document.createElement("div"); host.appendChild(div);
    let yp=null, dead=false;
    loadYT().then(()=>{ if(dead) return;
      yp=new YT.Player(div,{host:"https://www.youtube-nocookie.com",videoId:it.youtube,width:"100%",height:"100%",
        playerVars:{playsinline:1,rel:0,modestbranding:1,autoplay:opts.autoplay?1:0,mute:opts.muted?1:0},
        events:{onStateChange:e=>{ if(e.data===0) done(); }}});
    });
    api={destroy(){dead=true;try{yp&&yp.destroy();}catch(e){} host.innerHTML="";},pause(){try{yp&&yp.pauseVideo();}catch(e){}},play(){try{yp&&yp.playVideo();}catch(e){}},el:div};
  }else{
    const v=document.createElement("video");
    v.src=it.file; v.poster=it.poster||""; v.playsInline=true; v.setAttribute("playsinline",""); v.setAttribute("webkit-playsinline","");
    v.controls=!!opts.controls; v.preload="metadata"; v.muted=!!opts.muted;
    v.setAttribute("aria-label",it.title);
    const pos=LS.get("shortPos",{}); if(pos[it.id]&&pos[it.id]<(it.duration||1e9)-3) v.currentTime=pos[it.id];
    let lastSave=0, fired=false;
    v.addEventListener("timeupdate",()=>{
      if(v.duration&&!fired&&v.currentTime/v.duration>=0.9){fired=true;done();}
      if(Math.abs(v.currentTime-lastSave)>=5){lastSave=v.currentTime;const p=LS.get("shortPos",{});p[it.id]=Math.floor(v.currentTime);LS.set("shortPos",p);}
      if(opts.onTime) opts.onTime(v.currentTime,v.duration);
    });
    v.addEventListener("ended",()=>{const p=LS.get("shortPos",{});delete p[it.id];LS.set("shortPos",p); if(!fired){fired=true;done();} else if(opts.onEnded) opts.onEnded();});
    host.appendChild(v);
    if(opts.autoplay){ const pr=v.play(); if(pr&&pr.catch) pr.catch(()=>{}); }
    api={destroy(){try{v.pause();v.removeAttribute("src");v.load();}catch(e){} v.remove();},pause(){try{v.pause();}catch(e){}},play(){const p=v.play();if(p&&p.catch)p.catch(()=>{});},el:v};
  }
  players.add(api);
  const d=api.destroy; api.destroy=()=>{players.delete(api);d();};
  return api;
}
function destroyAllPlayers(){Array.from(players).forEach(p=>p.destroy());}

/* ---------- Shorts view ---------- */
function tileHTML(it,idx,active){
  const w=Store.watched()[it.id];
  return h`<button type="button" class="sx-tile ${active?"active":""} ${w?"watched":""}" data-id="${esc(it.id)}" aria-label="${esc(it.title)}${w?" (watched)":""}">
    <span class="sx-thumb"><img src="${esc(it.poster||"")}" alt="" loading="lazy" decoding="async">${it.duration?`<span class="sx-dur">${fmtDur(it.duration)}</span>`:""}${w?`<span class="sx-check" aria-hidden="true">✓</span>`:""}</span>
    <span class="sx-tt">${esc(it.title)}</span>
    <span class="sx-pl">${esc(it.pillar||"")}</span>
  </button>`;
}
function filtersHTML(){
  const w=Store.watched(); const un=shortItems.filter(s=>!w[s.id]).length;
  const opts=[["all","All "+shortItems.length],["unwatched","Unwatched "+un]].concat(PILLARS.map(p=>[p,p]));
  return `<div class="sx-filters" role="toolbar" aria-label="Filter Shorts">`+opts.map(([k,l])=>`<button type="button" class="chip ${shortFilter===k?"on":""}" data-f="${esc(k)}" aria-pressed="${shortFilter===k}">${esc(l)}</button>`).join("")+`</div>`;
}
function checkHTML(it){
  const {quiz,terms}=relatedFor(it); const res=Store.shortQuiz()[it.id];
  let out=`<div class="sx-checkpanel" data-id="${esc(it.id)}"><h3>Check yourself</h3>`;
  if(!quiz.length&&!terms.length){return out+`<p class="muted">No linked questions yet. Try the <a href="#/quiz">quiz</a>.</p></div>`;}
  quiz.forEach(({q,idx})=>{
    out+=`<div class="qcard sx-q" data-qidx="${idx}"><div class="qq">${esc(q.question)}</div>`;
    if(q.type==="mc"&&q.options) out+=`<div class="qopts">`+q.options.map(o=>`<button type="button" class="sx-opt" data-o="${esc(o)}">${esc(o)}</button>`).join("")+`</div>`;
    else out+=`<button type="button" class="b sx-reveal">Show model answer</button>`;
    out+=`<div class="qexp"><b>Answer:</b> ${esc(q.answer)}<br><br><b>Why:</b> ${esc(q.explanation)}</div></div>`;
  });
  if(terms.length){
    out+=`<div class="sx-terms"><div class="sx-terms-h">Key terms</div>`+terms.map(g=>`<details class="sx-term"><summary>${esc(g.term)}</summary><p>${esc(g.definition)}</p></details>`).join("")+
      `<button type="button" class="b sx-drill" data-terms="${esc(JSON.stringify(terms.map(g=>g.term)))}">Drill these ${terms.length} as flashcards →</button></div>`;
  }
  if(res) out+=`<p class="muted sx-score">Last check: ${res.right}/${res.total} correct.</p>`;
  return out+`</div>`;
}
function bindCheck(root){
  $$(".sx-q",root).forEach(card=>{
    const q=DATA.quiz[+card.dataset.qidx]; const id=card.closest(".sx-checkpanel").dataset.id;
    $$(".sx-opt",card).forEach(b=>b.onclick=()=>{
      if(card.dataset.done) return; card.dataset.done="1";
      const ok=b.dataset.o===q.answer;
      b.classList.add(ok?"correct":"wrong");
      if(!ok){const c=$$(".sx-opt",card).find(x=>x.dataset.o===q.answer); if(c)c.classList.add("correct");}
      $(".qexp",card).classList.add("show");
      const r=Store.shortQuiz(); const cur=r[id]&&r[id].stamp===sessionStamp?r[id]:{right:0,total:0,stamp:sessionStamp};
      cur.total++; if(ok)cur.right++; r[id]=cur; LS.set("shortQuiz",r); Store.bump("quiz");
    });
    const rv=$(".sx-reveal",card); if(rv) rv.onclick=()=>{$(".qexp",card).classList.add("show"); if(!card.dataset.done){card.dataset.done="1";Store.bump("quiz");}};
  });
  $$(".sx-drill",root).forEach(b=>b.onclick=()=>drillTerms(JSON.parse(b.dataset.terms)));
}
const sessionStamp=Date.now();
function drillTerms(terms){
  const set=new Set(terms);
  const cards=DATA.glossary.filter(g=>set.has(g.term));
  if(cards.some(g=>!g.essential)) LS.set("fcDeck","full");
  fcQueue=cards.map(g=>Object.assign({},g,{st:fcState(g.term)})); fcIdx=0; fcShown=false;
  go("flash"); renderFlash();
}

let deskPlayer=null;
window.renderShorts = function(){
  const el=$("#v-shorts"); if(!el) return;
  if(!shortsReady){el.innerHTML=`<h2 class="vh">Shorts</h2><p class="lead">Loading…</p>`;return;}
  if(!shortItems.length){el.innerHTML=`<h2 class="vh">Shorts</h2><p class="lead">No Shorts yet.</p>`;return;}
  destroyAllPlayers(); deskPlayer=null;
  if(isMobile()) return renderFeed(el);
  const it=shortItems[shortI]||shortItems[0];
  const w=Store.watched(); const nW=shortItems.filter(s=>w[s.id]).length;
  const list=filteredShorts();
  el.innerHTML=h`<h2 class="vh">Shorts <span class="vh-sub">${nW} of ${shortItems.length} watched</span></h2>
  <div class="sx-layout">
    <div class="sx-main">
      <div class="sx-player" id="sxPlayer"></div>
      <div class="sx-info">
        <div class="sx-meta"><span class="pill">${esc(it.pillar||"")}</span> <span>${fmtDur(it.duration)}</span> <span>· ${shortI+1} / ${shortItems.length}</span></div>
        <h3 class="sx-title">${esc(it.title)}</h3>
        <div class="btnrow">
          <button type="button" class="b" id="sxPrev" aria-keyshortcuts="K">← Prev</button>
          <button type="button" class="b" id="sxNext" aria-keyshortcuts="J">Next →</button>
        </div>
        <p class="sx-keys"><kbd>J</kbd>/<kbd>K</kbd> next/prev · <kbd>Space</kbd> play · <kbd>Q</kbd> questions</p>
      </div>
    </div>
    <div class="sx-side">${checkHTML(it)}</div>
  </div>
  <h3 class="sx-h">All Shorts</h3>
  ${filtersHTML()}
  <div class="sx-grid" id="sxGrid">${list.map(s=>tileHTML(s,0,s.id===it.id)).join("")||`<p class="muted">Nothing here. You have watched them all.</p>`}</div>`;
  deskPlayer=mountPlayer($("#sxPlayer"),it,{controls:true});
  bindCheck(el);
  $("#sxPrev").onclick=()=>stepShort(-1);
  $("#sxNext").onclick=()=>stepShort(1);
  bindTilesAndFilters(el);
};
function stepShort(d){const n=shortItems.length;shortI=(shortI+d+n)%n;selectShortById(shortItems[shortI].id);renderShorts();}
function bindTilesAndFilters(el){
  $$(".sx-tile",el).forEach(b=>b.onclick=()=>{selectShortById(b.dataset.id);renderShorts(); if(!isMobile()) $("#sxPlayer").scrollIntoView({block:"nearest",behavior:reduceMotion.matches?"auto":"smooth"});});
  $$(".sx-filters .chip",el).forEach(b=>b.onclick=()=>{shortFilter=b.dataset.f;LS.set("shortFilter",shortFilter);renderShorts();});
}
function refreshWatchedUI(){
  if(isMobile()){ $$(".sx-slide").forEach(s=>s.classList.toggle("watched",!!Store.watched()[s.dataset.id])); return; }
  const w=Store.watched();
  $$(".sx-tile").forEach(t=>{const on=!!w[t.dataset.id]; if(on&&!t.classList.contains("watched")){t.classList.add("watched");$(".sx-thumb",t).insertAdjacentHTML("beforeend",`<span class="sx-check" aria-hidden="true">✓</span>`);}});
  const sub=$("#v-shorts .vh-sub"); if(sub) sub.textContent=shortItems.filter(s=>w[s.id]).length+" of "+shortItems.length+" watched";
}
document.addEventListener("keydown",e=>{
  if(currentView!=="shorts"||isMobile()) return;
  if(e.target.closest&&e.target.closest("input,textarea,select,[contenteditable]")) return;
  if(e.ctrlKey||e.metaKey||e.altKey) return;
  const k=e.key.toLowerCase();
  if(k==="j"){e.preventDefault();stepShort(1);}
  else if(k==="k"){e.preventDefault();stepShort(-1);}
  else if(k==="q"){e.preventDefault();const p=$(".sx-checkpanel");if(p){p.scrollIntoView({block:"start"});const b=$("button",p);if(b)b.focus();}}
  else if(e.code==="Space"&&deskPlayer&&deskPlayer.el&&deskPlayer.el.tagName==="VIDEO"&&e.target.tagName!=="VIDEO"&&e.target.tagName!=="BUTTON"){e.preventDefault();const v=deskPlayer.el;v.paused?deskPlayer.play():deskPlayer.pause();}
});

/* ---- Mobile vertical feed ---- */
let feedObs=null, feedActive=null, soundOn=false;
function renderFeed(el){
  const list=filteredShorts().length?filteredShorts():shortItems;
  const startId=(shortItems[shortI]||list[0]).id;
  el.innerHTML=`<div class="sx-feed" id="sxFeed" aria-label="Shorts feed">`+list.map(it=>{
    const w=Store.watched()[it.id];
    return h`<article class="sx-slide ${w?"watched":""}" data-id="${esc(it.id)}" aria-label="${esc(it.title)}">
      <img class="sx-bg" src="${esc(it.poster||"")}" alt="" loading="lazy" decoding="async">
      <div class="sx-host"></div>
      <button type="button" class="sx-sound" aria-label="Turn sound on">🔇 Tap for sound</button>
      <div class="sx-overlay">
        <div class="sx-cap"><span class="pill">${esc(it.pillar||"")}</span> <span>${fmtDur(it.duration)}</span>${w?` <span class="sx-wbadge">✓ watched</span>`:""}<h3>${esc(it.title)}</h3></div>
        <div class="sx-actions">
          <button type="button" data-act="check" aria-label="Check yourself"><span aria-hidden="true">?</span><small>Quiz me</small></button>
          <button type="button" data-act="grid" aria-label="Browse all Shorts"><span aria-hidden="true">▦</span><small>All</small></button>
        </div>
      </div>
      <div class="sx-end" hidden><p>Nice. Lock it in?</p><button type="button" class="b" data-act="check">Check yourself</button><button type="button" class="b" data-act="next">Next Short ↓</button></div>
      <div class="sx-prog"><i></i></div>
    </article>`;}).join("")+`</div>`;
  const feed=$("#sxFeed");
  const start=$(`.sx-slide[data-id="${CSS.escape(startId)}"]`,feed); if(start) feed.scrollTop=start.offsetTop;
  if(feedObs) feedObs.disconnect();
  feedObs=new IntersectionObserver(entries=>{
    const best=entries.filter(en=>en.isIntersecting&&en.intersectionRatio>=0.6&&en.boundingClientRect.height>0)
      .sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];
    if(best) activateSlide(best.target);
  },{root:feed,threshold:[0.6]});
  requestAnimationFrame(()=>{ if(start){feed.scrollTop=start.offsetTop; activateSlide(start);} $$(".sx-slide",feed).forEach(s=>feedObs.observe(s)); });
  feed.addEventListener("click",e=>{
    const b=e.target.closest("[data-act]"); const slide=e.target.closest(".sx-slide"); if(!slide) return;
    const it=shortItems.find(s=>s.id===slide.dataset.id);
    if(b){ const a=b.dataset.act;
      if(a==="check") openSheet("Check yourself", checkHTML(it), bindCheck);
      else if(a==="grid") openGridSheet();
      else if(a==="next"){ const nx=slide.nextElementSibling; if(nx) nx.scrollIntoView({behavior:reduceMotion.matches?"auto":"smooth"}); }
      return; }
    if(e.target.closest(".sx-sound")){ soundOn=true; $$(".sx-sound").forEach(x=>x.hidden=true); if(feedActive&&feedActive.api&&feedActive.api.el){ if(feedActive.api.el.tagName==="VIDEO"){feedActive.api.el.muted=false;feedActive.api.play();} } return; }
    // Tap on the video toggles play/pause
    if(feedActive&&feedActive.slide===slide&&feedActive.api.el&&feedActive.api.el.tagName==="VIDEO"){ const v=feedActive.api.el; v.paused?feedActive.api.play():feedActive.api.pause(); }
  });
}
function activateSlide(slide){
  if(feedActive&&feedActive.slide===slide) return;
  if(feedActive){feedActive.api.destroy(); feedActive.slide.classList.remove("playing");}
  const it=shortItems.find(s=>s.id===slide.dataset.id); if(!it) return;
  shortI=shortItems.indexOf(it); selectShortById(it.id);
  $(".sx-end",slide).hidden=true;
  const bar=$(".sx-prog i",slide);
  const api=mountPlayer($(".sx-host",slide),it,{autoplay:!reduceMotion.matches,muted:!soundOn,
    onTime:(t,d)=>{if(d&&bar)bar.style.width=(t/d*100)+"%";},
    onEnded:()=>{$(".sx-end",slide).hidden=false;}});
  $(".sx-sound",slide).hidden=soundOn||!!it.youtube;
  slide.classList.add("playing");
  feedActive={slide,api};
}
function openGridSheet(){
  openSheet("All Shorts", filtersHTML()+`<div class="sx-grid">`+filteredShorts().map(s=>tileHTML(s,0,shortItems[shortI]&&s.id===shortItems[shortI].id)).join("")+`</div>`, root=>{
    $$(".sx-tile",root).forEach(b=>b.onclick=()=>{selectShortById(b.dataset.id);closeSheet();renderShorts();});
    $$(".sx-filters .chip",root).forEach(b=>b.onclick=()=>{shortFilter=b.dataset.f;LS.set("shortFilter",shortFilter);openGridSheet();renderShorts();});
  });
}
let wasMobile=isMobile();
mq.addEventListener?mq.addEventListener("change",()=>{ if(wasMobile!==isMobile()){wasMobile=isMobile(); if(currentView==="shorts") renderShorts(); closeSheet();} }):0;

/* ---------- Today ---------- */
function ring(val,max,label,sub){
  const p=Math.min(1,max?val/max:0), r=26, c=2*Math.PI*r;
  return h`<div class="ring ${p>=1?"met":""}"><svg viewBox="0 0 64 64" aria-hidden="true"><circle cx="32" cy="32" r="${r}" class="ring-bg"/><circle cx="32" cy="32" r="${r}" class="ring-fg" stroke-dasharray="${c}" stroke-dashoffset="${c*(1-p)}"/></svg>
    <div class="ring-txt"><b>${Math.min(val,max)}/${max}</b><span>${label}</span></div><div class="ring-sub">${sub}</div></div>`;
}
function renderToday(){
  const el=$("#v-today"); if(!el) return;
  const a=Store.activity(), t=a[dayKey()]||{shorts:0,cards:0,quiz:0};
  const st=streak(), met=dayMet(t);
  const w=Store.watched(); const nW=shortItems.filter(s=>w[s.id]).length;
  const due=dueReviews().length, seen=seenCards().length, fresh=DATA.glossary.length-seen;
  const mods=allModules(); const doneMods=mods.filter(m=>LS.get(moduleKey(m.w,m.i),false)).length;
  const nextMod=mods.find(m=>!LS.get(moduleKey(m.w,m.i),false));
  const nextModTitle=nextMod?(DATA.weeks.find(x=>x.n===nextMod.w)||{mods:[]}).mods[nextMod.i]:null;
  const cs=shortItems.length?continueShort():null;
  const hr=new Date().getHours(); const greet=hr<12?"Good morning":hr<18?"Good afternoon":"Good evening";
  const dateStr=new Date().toLocaleDateString(undefined,{weekday:"long",month:"long",day:"numeric"});
  const reviews=(t.cards||0)+(t.quiz||0);

  // last 7 days
  const days=[]; for(let i=6;i>=0;i--){const d=new Date();d.setDate(d.getDate()-i);const x=a[dayKey(d)]||{};days.push({d,n:(x.shorts||0)*5+(x.cards||0)+(x.quiz||0),met:dayMet(x)});}
  const maxN=Math.max(5,...days.map(d=>d.n));

  // pillar progress
  const pillarRows=PILLARS.map(p=>{
    const inP=shortItems.filter(s=>s.pillar===p); if(!inP.length) return "";
    const wn=inP.filter(s=>w[s.id]).length; const q=Store.shortQuiz(); let r=0,tt=0; inP.forEach(s=>{if(q[s.id]){r+=q[s.id].right;tt+=q[s.id].total;}});
    return h`<div class="pbar"><div class="pbar-h"><span>${p}</span><span>${wn}/${inP.length} Shorts${tt?` · ${Math.round(r/tt*100)}% on checks`:""}</span></div><div class="pbar-t"><i style="width:${inP.length?wn/inP.length*100:0}%"></i></div></div>`;
  }).join("");

  const upNext=[]; if(cs){let i=shortItems.indexOf(cs); for(let k=1;k<shortItems.length&&upNext.length<3;k++){const s=shortItems[(i+k)%shortItems.length]; if(!w[s.id]) upNext.push(s);}}

  el.innerHTML=h`
  <div class="today-head">
    <div><p class="today-date">${esc(dateStr)}</p><h1>${greet}.</h1>
      <p class="lead">${met?"Today's goal is done. Anything more is a bonus.":"One Short and five reviews makes today count."}</p></div>
    <div class="streak ${st?"on":""}" title="Days in a row with the daily goal met"><b>${st}</b><span>day streak</span></div>
  </div>
  <div class="today-grid">
    ${cs?h`<a class="hero-card" href="#/shorts/${encodeURIComponent(cs.id)}">
      <span class="hero-thumb"><img src="${esc(cs.poster||"")}" alt=""><span class="sx-dur">${fmtDur(cs.duration)}</span><span class="hero-play" aria-hidden="true">▶</span></span>
      <span class="hero-body"><span class="hero-kicker">${w[cs.id]?"Rewatch":"Up next"} · ${esc(cs.pillar||"")}</span><span class="hero-title">${esc(cs.title)}</span>
      <span class="hero-cta">Watch, then check yourself →</span></span></a>`:`<div class="hero-card"><span class="hero-body">Loading Shorts…</span></div>`}
    <div class="goal-card"><h3>Today's goal</h3><div class="rings">${ring(t.shorts||0,GOAL.shorts,"Short","watched")}${ring(reviews,GOAL.reviews,"reviews","cards + questions")}</div></div>
  </div>
  <div class="today-actions">
    <a class="action" href="#/flash"><b>${due?due+" due":fresh+" new"}</b><span>${due?"Flashcards to review":"Flashcards to learn"}</span></a>
    <a class="action" href="#/quiz"><b>${DATA.quiz.length}</b><span>Quiz questions</span></a>
    <a class="action" href="#/curriculum"><b>${Math.round(doneMods/mods.length*100)}%</b><span>${nextModTitle?"Next: "+esc(nextModTitle.t.split(":")[0]):"Curriculum complete"}</span></a>
    <a class="action" href="#/shorts"><b>${nW}/${shortItems.length||51}</b><span>Shorts watched</span></a>
  </div>
  <div class="today-cols">
    <div class="card"><h3>By pillar</h3>${pillarRows||`<p class="muted">Watch a Short to start filling this in.</p>`}</div>
    <div class="card"><h3>Last 7 days</h3><div class="week-bars" role="img" aria-label="Activity over the last 7 days">${days.map(d=>h`<div class="wb ${d.met?"met":""}"><i style="height:${Math.max(4,d.n/maxN*100)}%"></i><span>${d.d.toLocaleDateString(undefined,{weekday:"narrow"})}</span></div>`).join("")}</div>
      <p class="muted" style="font-size:.78rem;margin-top:.6rem">Green days met the goal. ${seen} of ${DATA.glossary.length} terms studied.</p></div>
  </div>
  ${upNext.length?h`<h3 class="sx-h">More Shorts</h3><div class="sx-grid upnext">${upNext.map(s=>tileHTML(s)).join("")}</div>`:""}`;
  $$(".sx-tile",el).forEach(b=>b.onclick=()=>{location.hash="#/shorts/"+encodeURIComponent(b.dataset.id);});
}

/* ---------- Activity hooks on existing views ---------- */
document.addEventListener("click",e=>{
  if(e.target.closest("#v-flash .fc-controls button[data-g]")) Store.bump("cards");
  const lab=e.target.closest("#v-quiz .qopts label, #v-quiz .reveal");
  if(lab){const card=lab.closest(".qcard"); if(card&&!card.dataset.counted){card.dataset.counted="1";Store.bump("quiz");}}
});

/* ---------- Flashcard swipes (touch) ----------
   Card hidden: swipe left/right = next/previous.  Card shown: right = Good, left = Again, up = Hard. */
(function(){
  let x0=null,y0=null;
  const el=$("#v-flash");
  el.addEventListener("touchstart",e=>{ if(!e.target.closest("#fcStage")) return; x0=e.touches[0].clientX; y0=e.touches[0].clientY; },{passive:true});
  el.addEventListener("touchend",e=>{
    if(x0===null) return;
    const dx=e.changedTouches[0].clientX-x0, dy=e.changedTouches[0].clientY-y0; x0=null;
    const ax=Math.abs(dx), ay=Math.abs(dy); if(Math.max(ax,ay)<50) return;
    let btn=null;
    if(fcShown){ btn= ay>ax&&dy<0 ? $('.fc-controls button[data-g="1"]') : ax>ay ? $(`.fc-controls button[data-g="${dx>0?2:0}"]`) : null; }
    else if(ax>ay){ btn= dx<0 ? $("#fcNext") : $("#fcPrev"); }
    if(btn&&!btn.disabled){ e.preventDefault(); btn.click(); }
  });
})();

/* ---------- Sheets (mobile) ---------- */
let lastFocus=null;
function openSheet(title,html,bind){
  lastFocus=document.activeElement;
  $("#sheetTitle").textContent=title; const body=$("#sheetBody"); body.innerHTML=html;
  $("#sheet").hidden=false; $("#sheetBackdrop").hidden=false;
  requestAnimationFrame(()=>{$("#sheet").classList.add("open");$("#sheetBackdrop").classList.add("open");});
  if(bind) bind(body);
  const f=$("a,button,input,summary",body); if(f) f.focus({preventScroll:true});
  document.body.classList.add("sheet-open");
}
function closeSheet(){
  const s=$("#sheet"); if(!s||s.hidden) return;
  s.classList.remove("open"); $("#sheetBackdrop").classList.remove("open");
  document.body.classList.remove("sheet-open");
  setTimeout(()=>{s.hidden=true;$("#sheetBackdrop").hidden=true;},reduceMotion.matches?0:200);
  if(lastFocus&&lastFocus.focus) lastFocus.focus({preventScroll:true});
}
function navSheet(group){
  const title={learn:"Learn",practice:"Practice",reference:"More"}[group];
  let html=`<ul class="sheet-list">`+GROUPS[group].map(v=>`<li><a href="#/${v}" class="${currentView===v?"active":""}">${esc(VIEWS[v])}<span aria-hidden="true">›</span></a></li>`).join("")+`</ul>`;
  if(group==="reference"){
    const mode=LS.get("appMode",defaultMode()), pal=LS.get("appPalette","github");
    html+=h`<div class="sheet-section"><h3>Appearance</h3><div class="seg" role="group" aria-label="Mode">
      <button type="button" data-mode="light" aria-pressed="${mode==="light"}" class="${mode==="light"?"on":""}">Light</button><button type="button" data-mode="dark" aria-pressed="${mode==="dark"}" class="${mode==="dark"?"on":""}">Dark</button></div>
      <div class="seg" role="group" aria-label="Palette">${[["github","GitHub"],["geist","Geist"],["catppuccin","Catppuccin"]].map(([k,l])=>`<button type="button" data-pal="${k}" aria-pressed="${pal===k}" class="${pal===k?"on":""}">${l}</button>`).join("")}</div></div>
      <div class="sheet-section"><h3>Your progress</h3><p class="muted">Saved in this browser only. Export it to move between laptop and phone.</p>
      <div class="btnrow"><button type="button" class="b" data-action="export">Export progress</button><button type="button" class="b" data-action="import">Import</button></div></div>
      <p class="muted sheet-disc">Learning materials only. Not legal advice.</p>`;
  }
  openSheet(title,html,body=>{
    $$("[data-mode]",body).forEach(b=>b.onclick=()=>{applyTheme(LS.get("appPalette","github"),b.dataset.mode);navSheet(group);});
    $$("[data-pal]",body).forEach(b=>b.onclick=()=>{applyTheme(b.dataset.pal,LS.get("appMode",defaultMode()));navSheet(group);});
  });
}
$$("#mTabbar [data-sheet]").forEach(b=>b.onclick=()=>navSheet(b.dataset.sheet));
$("#sheetBackdrop").onclick=closeSheet;
$("#sheetBody").addEventListener("click",e=>{ if(e.target.closest(".sheet-list a")) closeSheet(); });
// swipe down to close
(function(){let y0=null;const s=$("#sheet");
  s.addEventListener("touchstart",e=>{if(s.scrollTop<=0&&e.target.closest(".sheet-grip,.sheet-title"))y0=e.touches[0].clientY;},{passive:true});
  s.addEventListener("touchend",e=>{if(y0!==null&&e.changedTouches[0].clientY-y0>60)closeSheet();y0=null;},{passive:true});})();

/* ---------- Search palette (Ctrl/Cmd K) ---------- */
let palIndex=[], palSel=0, palItems=[];
function buildPaletteIndex(){
  palIndex=Object.keys(VIEWS).map(v=>({kind:"View",label:VIEWS[v],sub:(GROUP_OF[v]||"").replace(/^./,c=>c.toUpperCase()),go:()=>go(v)}))
    .concat(shortItems.map(s=>({kind:"Short",label:s.title,sub:s.pillar+" · "+fmtDur(s.duration),go:()=>{location.hash="#/shorts/"+encodeURIComponent(s.id);}})))
    .concat(DATA.glossary.map(g=>({kind:"Term",label:g.term,sub:g.category,go:()=>{LS.set("gq",g.term);LS.set("gcat","all");renderGlossary();go("glossary");}})));
}
function openPalette(){
  closeSheet(); if(!palIndex.length) buildPaletteIndex();
  lastFocus=document.activeElement;
  $("#palette").hidden=false; const i=$("#paletteInput"); i.value=""; filterPalette(); i.focus();
}
function closePalette(){ $("#palette").hidden=true; if(lastFocus&&lastFocus.focus) lastFocus.focus({preventScroll:true}); }
function filterPalette(){
  const q=norm($("#paletteInput").value.trim());
  palItems=(q?palIndex.filter(x=>norm(x.label).includes(q)||norm(x.sub).includes(q)).sort((a,b)=>norm(a.label).indexOf(q)-norm(b.label).indexOf(q)):palIndex.filter(x=>x.kind==="View")).slice(0,30);
  palSel=0; drawPalette();
}
function drawPalette(){
  $("#paletteList").innerHTML=palItems.map((x,i)=>`<li role="option" id="pal${i}" aria-selected="${i===palSel}" data-i="${i}"><span class="pk">${x.kind}</span><span class="pl">${esc(x.label)}</span><span class="ps">${esc(x.sub||"")}</span></li>`).join("")||`<li class="none">No matches</li>`;
  $("#paletteInput").setAttribute("aria-activedescendant","pal"+palSel);
  const s=$("#pal"+palSel); if(s) s.scrollIntoView({block:"nearest"});
}
$("#paletteInput").addEventListener("input",filterPalette);
$("#paletteInput").addEventListener("keydown",e=>{
  if(e.key==="ArrowDown"){e.preventDefault();palSel=Math.min(palItems.length-1,palSel+1);drawPalette();}
  else if(e.key==="ArrowUp"){e.preventDefault();palSel=Math.max(0,palSel-1);drawPalette();}
  else if(e.key==="Enter"){e.preventDefault();const x=palItems[palSel];if(x){closePalette();x.go();}}
  else if(e.key==="Escape"){e.preventDefault();closePalette();}
});
$("#paletteList").addEventListener("click",e=>{const li=e.target.closest("li[data-i]");if(li){const x=palItems[+li.dataset.i];closePalette();x.go();}});
$("#palette").addEventListener("click",e=>{if(e.target.id==="palette")closePalette();});
document.addEventListener("keydown",e=>{
  if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==="k"){e.preventDefault();$("#palette").hidden?openPalette():closePalette();}
  else if(e.key==="Escape"&&!$("#sheet").hidden) closeSheet();
});
$("#navSearch").onclick=openPalette; $("#mSearch").onclick=openPalette;
if(/Mac|iPhone|iPad/.test(navigator.platform||"")) $$("kbd").forEach(k=>{if(k.textContent==="Ctrl K")k.textContent="⌘K";});

/* ---------- Export / import ---------- */
const KEY_PREFIXES=["fc:","mod:","self:","cl:","cl-open:"];
const KEYS=["activity","shortsWatched","shortQuiz","shortPos","lastShort","shortFilter","view","fcDeck","quizWeek","deckWeek","seenCurric","appMode","appPalette","gq","gcat","refq","refcat","euProdTab","isoTab","iso23894Tab","nistMeasureTab","nist6001Tab","securityRmfTab","eaTab"];
function ours(k){return KEYS.includes(k)||KEY_PREFIXES.some(p=>k.startsWith(p));}
function exportProgress(){
  const data={}; try{for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i); if(ours(k)) data[k]=localStorage.getItem(k);}}catch(e){}
  const blob=new Blob([JSON.stringify({app:"learn-ai-law",version:1,exported:new Date().toISOString(),data},null,1)],{type:"application/json"});
  const a=document.createElement("a"); a.href=URL.createObjectURL(blob); a.download="ai-law-progress-"+dayKey()+".json"; document.body.appendChild(a); a.click();
  setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove();},500);
}
function importProgress(file){
  const r=new FileReader();
  r.onload=()=>{try{
    const j=JSON.parse(r.result); if(j.app!=="learn-ai-law"||!j.data) throw new Error("Not a progress file from this site.");
    let n=0; Object.entries(j.data).forEach(([k,v])=>{if(ours(k)&&typeof v==="string"){localStorage.setItem(k,v);n++;}});
    toast("Imported "+n+" saved items. Reloading…"); setTimeout(()=>location.reload(),900);
  }catch(err){toast("Import failed: "+err.message);}};
  r.readAsText(file);
}
document.addEventListener("click",e=>{const b=e.target.closest("[data-action]"); if(!b) return;
  if(b.dataset.action==="export") exportProgress();
  if(b.dataset.action==="import") $("#importFile").click();});
$("#importFile").addEventListener("change",e=>{const f=e.target.files[0]; if(f) importProgress(f); e.target.value="";});
function toast(msg){let t=$("#toast"); if(!t){t=document.createElement("div");t.id="toast";t.setAttribute("role","status");document.body.appendChild(t);} t.textContent=msg; t.classList.add("show"); clearTimeout(t._h); t._h=setTimeout(()=>t.classList.remove("show"),3000);}

/* ---------- Theme extras ---------- */
const _applyTheme=window.applyTheme;
window.applyTheme=function(p,m){ _applyTheme(p,m); try{const bg=getComputedStyle(document.documentElement).getPropertyValue("--bg-color").trim(); const meta=document.querySelector('meta[name="theme-color"]'); if(meta&&bg) meta.setAttribute("content",bg);}catch(e){} const img=$("#mTopbar img"); if(img) img.src=m==="light"?"assets/hero_light.jpg":"assets/hero.jpg"; if(currentView==="today") renderToday(); };
applyTheme(LS.get("appPalette","github"),LS.get("appMode",defaultMode()));

/* ---------- Mobile top bar hides on scroll down ---------- */
(function(){let y=0;window.addEventListener("scroll",()=>{if(!isMobile())return;const ny=window.scrollY;document.body.classList.toggle("bar-hidden",ny>y&&ny>80);y=ny;},{passive:true});})();

/* ---------- Service worker ---------- */
if("serviceWorker" in navigator&&(location.protocol==="https:"||location.hostname==="localhost")){
  window.addEventListener("load",()=>navigator.serviceWorker.register("sw.js").catch(()=>{}));
}

/* ---------- Start ---------- */
const r=parseHash();
if(r) show(r.v,r.sub);
else { history.replaceState(null,"","#/today"); show("today"); }
loadShorts();
})();
