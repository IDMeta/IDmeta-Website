/* ── Shared nav + footer: single source of truth, rendered into every page's
   empty <nav></nav> / <footer></footer> shell based on <body data-page="…"> ── */
(function(){
  const nav = document.querySelector('nav');
  if(!nav) return;
  const page = document.body.dataset.page;
  const isHome = page === 'home';
  const home = isHome ? '#' : 'index.html';
  const platform = isHome ? '#platform' : 'index.html#platform';
  nav.innerHTML = `
    <div class="container">
      <div class="nav-inner">
        <a href="${home}" class="nav-logo"><img src="brand_assets/IDmeta - Primary Logo Reverse.svg" alt="IDmeta"></a>
        <div class="nav-links">
          <a href="${home}"${isHome ? ' class="active"' : ''}>Home</a>
          <a href="${platform}">Products</a>
          <a href="https://docs.idmetagroup.com" target="_blank" rel="noopener noreferrer">Developers</a>
          <a href="contact.html"${page === 'contact' ? ' class="active"' : ''}>Contact</a>
        </div>
        <div class="nav-actions">
          <a href="contact.html" class="btn-primary">Book a demo</a>
        </div>
        <input type="checkbox" id="nav-toggle" class="nav-toggle-input">
        <label for="nav-toggle" class="nav-toggle" aria-label="Toggle menu"><span></span><span></span><span></span></label>
        <div class="mobile-menu">
          <a href="index.html">Home</a>
          <a href="${platform}">Products</a>
          <a href="https://docs.idmetagroup.com/welcome" target="_blank" rel="noopener noreferrer">Developers</a>
          <a href="contact.html">Contact Us</a>
        </div>
      </div>
    </div>`;

  const toggle = nav.querySelector('.nav-toggle-input');
  nav.querySelectorAll('.mobile-menu a').forEach(a => a.addEventListener('click', () => { toggle.checked = false; }));
})();

(function(){
  const footer = document.querySelector('footer');
  if(!footer) return;
  footer.innerHTML = `
    <div class="container">
      <div class="footer-grid">
        <div>
          <p class="footer-tagline">IDmeta is APAC’s end-to-end identity trust and compliance platform: eKYC, KYB, AML screening, and transaction monitoring, unified in one dashboard and one API. We verify customers at the government source, with direct accredited access to national identity data source across Australia, the Philippines, Indonesia and Malaysia backed by AI-driven biometrics and deepfake detection. Fully customizable Trustflows let you create the exact verification journey your business and regulator require, deployed in days via API, SDK, or no-code Direct Link. Onboard genuine customers in seconds, block fraud before it costs you, and stay audit-ready automatically.</p>
          <div class="footer-social">
            <a class="social-btn" href="https://www.linkedin.com/company/idmeta-group" target="_blank" rel="noopener noreferrer">in</a>
          </div>
        </div>
        <div class="footer-col-group">
        <div class="footer-col footer-col-products">
          <h4>Products</h4>
          <div class="footer-products-grid">
            <div class="footer-subcol">
              <h5>Compliance</h5>
              <a href="https://docs.idmetagroup.com/products/kyc/docu-veri" target="_blank" rel="noopener noreferrer">Document Verification</a>
              <a href="https://docs.idmetagroup.com/products/kyc/biometrics-verification" target="_blank" rel="noopener noreferrer">Biometrics Verification</a>
              <a href="https://docs.idmetagroup.com/products/kyc/biometrics-face-match" target="_blank" rel="noopener noreferrer">Biometrics Face Compare</a>
              <a href="https://docs.idmetagroup.com/products/kyc/watchlist-and-aml-screening" target="_blank" rel="noopener noreferrer">Watchlist and AML Screening</a>
              <a href="https://docs.idmetagroup.com/products/kyc/email-verification" target="_blank" rel="noopener noreferrer">Email Verification</a>
              <a href="https://docs.idmetagroup.com/products/kyc/phone-number-verification" target="_blank" rel="noopener noreferrer">Phone Number Verification</a>
            </div>
            <div class="footer-subcol">
              <h5>Philippines Govt Checks</h5>
              <a href="https://docs.idmetagroup.com/products/government-data-ph/ph-philsys-check" target="_blank" rel="noopener noreferrer">Philsys Verification</a>
              <a href="https://docs.idmetagroup.com/products/government-data-ph/ph-lto-drivers-licence" target="_blank" rel="noopener noreferrer">Driver License Verification</a>
              <a href="https://docs.idmetagroup.com/products/government-data-ph/overview" target="_blank" rel="noopener noreferrer">View All</a>
            </div>
            <div class="footer-subcol">
              <h5>Indonesia Dukcapil</h5>
              <a href="https://docs.idmetagroup.com/products/government-data-id/dukcapil-data-full" target="_blank" rel="noopener noreferrer">KTP Verification</a>
              <a href="https://docs.idmetagroup.com/products/government-data-id/income-verification" target="_blank" rel="noopener noreferrer">Income Verification</a>
              <a href="https://docs.idmetagroup.com/products/government-data-id/overview" target="_blank" rel="noopener noreferrer">View All</a>
            </div>
            <div class="footer-subcol">
              <h5>Australia DVS</h5>
              <a href="https://docs.idmetagroup.com/products/government-data-au/au-passport" target="_blank" rel="noopener noreferrer">Passport Verification</a>
              <a href="https://docs.idmetagroup.com/products/government-data-au/au-drivers-licence" target="_blank" rel="noopener noreferrer">Drivers License Verification</a>
              <a href="https://docs.idmetagroup.com/products/government-data-au/overview" target="_blank" rel="noopener noreferrer">View All</a>
            </div>
            <div class="footer-subcol">
              <h5>KYB</h5>
              <a href="https://docs.idmetagroup.com/products/kyb/ph-kyb-comprehensive" target="_blank" rel="noopener noreferrer">Philippines KYB</a>
              <a href="https://docs.idmetagroup.com/products/kyb/aus-kyb-comprehensive" target="_blank" rel="noopener noreferrer">Australia KYB</a>
              <a href="https://docs.idmetagroup.com/products/kyb/aus-ubo" target="_blank" rel="noopener noreferrer">Australia UBO</a>
              <a href="https://docs.idmetagroup.com/products/kyb/idn-kyb-comprehensive" target="_blank" rel="noopener noreferrer">Indonesia KYB</a>
              <a href="https://docs.idmetagroup.com/products/kyb/my-kyb-comprehensive" target="_blank" rel="noopener noreferrer">Malaysia KYB</a>
              <a href="https://docs.idmetagroup.com/products/kyb/my-ubo" target="_blank" rel="noopener noreferrer">Malaysia UBO</a>
            </div>
            <div class="footer-subcol">
              <h5>Onboarding</h5>
              <a href="https://docs.idmetagroup.com/resources/custom-forms/advance-custom-forms" target="_blank" rel="noopener noreferrer">Custom Forms</a>
              <span class="footer-disabled">e-Signature</span>
            </div>
          </div>
          <a href="https://docs.idmetagroup.com/products/kyc/biometrics-detection" class="footer-viewall" target="_blank" rel="noopener noreferrer">View all products →</a>
        </div>
        <div class="footer-col">
          <h4>About</h4>
          <a href="https://www.linkedin.com/company/idmeta-group" target="_blank" rel="noopener noreferrer">About IDmeta</a>
          <a href="https://www.linkedin.com/company/idmeta-group" target="_blank" rel="noopener noreferrer">Careers</a>
          <a href="contact.html">Contact</a>
        </div>
        <div class="footer-col">
          <h4>Developers</h4>
          <a href="https://docs.idmetagroup.com/integration-overview" target="_blank" rel="noopener noreferrer">Integration</a>
          <a href="https://docs.idmetagroup.com/resources/data-handling-privacy" target="_blank" rel="noopener noreferrer">Data Handling &amp; Privacy</a>
          <a href="https://docs.idmetagroup.com/account/overview" target="_blank" rel="noopener noreferrer">Accounts</a>
        </div>
        </div>
      </div>
      <div class="footer-bottom">
        <p>© 2026 IDmeta Group Pty Ltd. All rights reserved. Melbourne, Australia · Singapore · Kuala Lumpur · Manila · Jakarta</p>
        <div class="footer-bottom-links">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
          <a href="#">Cookie Settings</a>
        </div>
      </div>
    </div>`;
})();

const markets = {
  ph:{title:'Philippines',desc:'BSP Circulars 950, 1122 &amp; 1170 set strict eKYC rules; AFASA mandates fraud controls by June 2026. IDmeta meets all of it out of the box.',
    idsys:'PhilSys / PSA, plus NBI, PRC and TIN/BIR',quirk:'AFASA fraud controls due June 2026',
    miss:'OCR-only checks — no PhilSys, NBI or PRC validation',
    win:'PhilSys at source, plus NBI, PRC and TIN — one API',regs:['Real-time PhilSys / PSA validation','NBI clearance — criminal record check','PRC professional licence verification','TIN / BIR tax identity check','AMLC screening per BSP Circular 1122','AFASA-ready fraud controls']},
  id:{title:'Indonesia',desc:'OJK POJK 12/2017 mandates eKYC. IDmeta\u2019s licensed Dukcapil integration cross-checks the national registry — 280M+ citizens — in real time.',
    idsys:'KTP — NIK validated against Dukcapil',quirk:'eKYC mandated; rural users on low-bandwidth 3G',
    miss:'No Dukcapil licence — no registry cross-check',
    win:'Licensed Dukcapil API, real-time NIK validation',regs:['Live Dukcapil cross-check via API','Real-time NIK validation','OJK POJK 12/2017 compliant','UU PDP data protection aligned','Works on low-bandwidth 3G']},
  au:{title:'Australia',desc:'IDmeta is one of only 12 authorised DVS providers via IDmatch — a regulatory moat no new entrant can fast-track.',
    idsys:'No national ID — government DVS checks via IDmatch',quirk:'Only 12 providers hold DVS authorisation',
    miss:'No DVS authorisation — no government source checks',
    win:'Licence, passport, Medicare verified at source',regs:['AU IDmatch (DVS) — one of 12 authorised providers','Licence, passport, Medicare, birth certificate','AUSTRAC AML/CTF compliant','Privacy Act 1988 / APPs aligned','OCR + biometrics + government source in one call']},
  my:{title:'Malaysia',desc:'BNM\u2019s e-KYC policy requires externally assessed biometrics: FAR under 5%, ISO 30107-3 liveness. IDmeta is built to those thresholds.',
    idsys:'MyKad — JPN national registry',quirk:'BNM requires FAR under 5% and ISO 30107-3 liveness',
    miss:'Biometrics unassessed against BNM thresholds',
    win:'PAD-compliant liveness, JPN cross-verification',regs:['JPN (MyKad) cross-verification','BNM e-KYC Policy (April 2024) aligned','FAR maintained below 5%','ISO/IEC 30107-3 PAD liveness','AMLA / CFT aligned']},
  sg:{title:'Singapore',desc:'MAS Notice 626 sets strict KYC rules. Singpass/MyInfo integration pulls consented citizen data for instant onboarding.',
    idsys:'NRIC — Singpass / MyInfo consented data',quirk:'MAS Notice 626 plus strict PDPA consent rules',
    miss:'No MyInfo — manual document upload instead',
    win:'MyInfo data pull, Notice 626 screening built in',regs:['Singpass / MyInfo consent-based data pull','MAS Notice 626 AML/CFT satisfied','PDPA aligned','MAS AMLD 01/2022 built-in','Liveness meets MAS tech-risk guidelines']}
};
/* ── Hero: split-screen verification simulation ── */
(function(){
  const hv = document.getElementById('hv');
  if(!hv) return;
  const screens = [...hv.querySelectorAll('.hv-screen')];
  const phone = hv.querySelector('.hv-phone');
  const flash = document.getElementById('hv-flash');
  const oval = document.getElementById('hv-oval');
  const hint = document.getElementById('hv-hint');
  const rows = [...hv.querySelectorAll('.hv-row')];
  const stat = r => rows[r].querySelector('.hv-row-status');
  const fields = [...hv.querySelectorAll('.hv-field b')];
  const decision = hv.querySelector('.hv-decision');
  const packet = document.getElementById('hv-packet');
  const cards = [hv.querySelector('#hv-cap-f .hv-idcard'), hv.querySelector('#hv-cap-b .hv-idcard')];

  function go(n){ screens.forEach((s,k)=>{ s.classList.toggle('active',k===n); s.classList.toggle('prev',k<n); }); }
  function doFlash(){ flash.classList.remove('go'); void flash.offsetWidth; flash.classList.add('go'); }
  function tap(n){ const b=screens[n].querySelector('.hv-btn'); if(!b) return; b.classList.remove('tapped'); void b.offsetWidth; b.classList.add('tapped'); }
  let ivs = [];
  function type(el,txt){ el.textContent=''; let i=0; const id=setInterval(()=>{ el.textContent=txt.slice(0,++i); if(i>=txt.length) clearInterval(id); },26); ivs.push(id); }
  function fly(rowIdx){
    const pr=phone.getBoundingClientRect(), rr=rows[rowIdx].getBoundingClientRect(), hr=hv.getBoundingClientRect();
    packet.style.transition='none';
    packet.style.transform=`translate(${pr.right-hr.left-8}px,${pr.top-hr.top+pr.height/2}px)`;
    packet.style.opacity='1';
    packet.getBoundingClientRect();
    packet.style.transition='transform .55s cubic-bezier(.4,.1,.3,1),opacity .2s .4s';
    packet.style.transform=`translate(${rr.left-hr.left+2}px,${rr.top-hr.top+rr.height/2}px)`;
    packet.style.opacity='0';
  }
  function reset(){
    go(0);
    cards.forEach(c=>c.classList.remove('show'));
    oval.classList.remove('draw');
    hint.textContent='Hold still…'; hint.classList.remove('ok');
    rows.forEach(r=>r.classList.remove('live'));
    rows.forEach((r,k)=>{ const s=stat(k); s.textContent='waiting'; s.classList.remove('ok'); });
    fields.forEach(f=>f.textContent='');
    decision.classList.remove('on');
    phone.classList.remove('dimmed');
  }

  if(matchMedia('(prefers-reduced-motion: reduce)').matches){
    go(3); phone.classList.add('dimmed');
    cards.forEach(c=>c.classList.add('show'));
    rows.forEach(r=>r.classList.add('live'));
    fields.forEach(f=>f.textContent=f.dataset.v);
    ['✓ 14 fields','✓ 99.2% match','✓ MATCH — PCN confirmed','✓ CLEAR'].forEach((t,k)=>{ stat(k).textContent=t; stat(k).classList.add('ok'); });
    decision.classList.add('on');
    return;
  }

  const T = [
    [800, ()=>tap(0)],
    [1300, ()=>go(1)],
    [2100, ()=>{ doFlash(); cards[0].classList.add('show'); }],
    [3000, ()=>{ doFlash(); cards[1].classList.add('show'); }],
    [3700, ()=>tap(1)],
    [4100, ()=>fly(0)],
    [4400, ()=>go(2)],
    [4650, ()=>{ rows[0].classList.add('live'); stat(0).textContent='verifying & extracting…'; fields.forEach((f,k)=>ivs.push(setTimeout(()=>type(f,f.dataset.v),k*430))); }],
    [5000, ()=>oval.classList.add('draw')],
    [5900, ()=>{ hint.textContent='Capturing Selfie…'; }],
    [6400, ()=>{ stat(0).textContent='✓ 14 fields'; stat(0).classList.add('ok'); }],
    [7000, ()=>{ hint.textContent='Liveness Complete ✓'; hint.classList.add('ok'); }],
    [7500, ()=>fly(1)],
    [7950, ()=>{ rows[1].classList.add('live'); stat(1).textContent='matching…'; }],
    [8500, ()=>go(3)],
    [9000, ()=>{ stat(1).textContent='✓ 99.2% match'; stat(1).classList.add('ok'); }],
    [9300, ()=>phone.classList.add('dimmed')],
    [9500, ()=>{ rows[2].classList.add('live'); stat(2).textContent='querying PhilSys…'; }],
    [11000, ()=>{ stat(2).textContent='✓ MATCH — PCN confirmed'; stat(2).classList.add('ok'); }],
    [11400, ()=>{ rows[3].classList.add('live'); stat(3).textContent='screening 45,000+ lists…'; }],
    [13100, ()=>{ stat(3).textContent='✓ CLEAR'; stat(3).classList.add('ok'); }],
    [13600, ()=>decision.classList.add('on')],
    [17300, ()=>reset()],
  ];
  const CYCLE = 17900;
  let pending=[], t0=0, elapsedAtPause=0, running=false, paused=false;
  function clearAll(){ pending.forEach(clearTimeout); pending=[]; ivs.forEach(id=>{clearTimeout(id);clearInterval(id);}); ivs=[]; }
  function schedule(from){
    t0 = performance.now() - from;
    T.forEach(([t,fn])=>{ if(t>=from) pending.push(setTimeout(fn,t-from)); });
    pending.push(setTimeout(()=>{ if(running&&!paused){ clearAll(); schedule(0); } }, CYCLE-from));
  }
  hv.addEventListener('mouseenter',()=>{ if(!running) return; paused=true; elapsedAtPause=performance.now()-t0; clearAll(); });
  hv.addEventListener('mouseleave',()=>{ if(!running||!paused) return; paused=false; schedule(Math.min(elapsedAtPause,CYCLE-100)); });
  new IntersectionObserver(es=>es.forEach(e=>{
    if(e.isIntersecting && !running){ running=true; paused=false; reset(); schedule(0); }
    else if(!e.isIntersecting && running){ running=false; clearAll(); reset(); }
  }),{threshold:.3}).observe(hv);
})();

/* ── Customer stories: reveal + hero count-up ── */
(function(){
  const grid = document.getElementById('cases-grid');
  if(!grid) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const cards = [...grid.querySelectorAll('.case-card')];
  const heroes = [...grid.querySelectorAll('.case-hero .val')];
  if(!reduced){
    grid.classList.add('case-reveal');
    cards.forEach((c,k)=>c.style.setProperty('--d',(k*130)+'ms'));
  }
  function countUp(el){
    const target = +el.dataset.target, pre = el.dataset.prefix||'', suf = el.dataset.suffix||'';
    if(reduced){ el.textContent = pre+target+suf; return; }
    const t0 = performance.now(), dur = 1300;
    (function step(now){
      const p = Math.min(1,(now-t0)/dur), e = 1-Math.pow(1-p,3);
      el.textContent = pre+Math.round(target*e)+suf;
      if(p<1) requestAnimationFrame(step);
    })(t0);
  }
  new IntersectionObserver((es,io)=>es.forEach(e=>{
    if(!e.isIntersecting) return;
    cards.forEach(c=>c.classList.add('in'));
    heroes.forEach(countUp);
    io.disconnect();
  }),{threshold:.25}).observe(grid);
})();

/* ── Industries: staggered bento reveal ── */
(function(){
  const bento = document.getElementById('ind-rows');
  if(!bento || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const cards = [...bento.querySelectorAll('.ind-row')];
  bento.classList.add('ind-reveal');
  cards.forEach((c,k)=>c.style.setProperty('--d',(k*70)+'ms'));
  new IntersectionObserver((es,io)=>es.forEach(e=>{
    if(e.isIntersecting){ cards.forEach(c=>c.classList.add('in')); io.disconnect(); }
  }),{threshold:.2}).observe(bento);
})();

/* ── Product spotlight: click + auto-cycle ── */
(function(){
  const spot = document.getElementById('products');
  if(!spot) return;
  const tabs = [...spot.querySelectorAll('.spot-tab')];
  const panels = [...spot.querySelectorAll('.spot-panel')];
  let i = 0;
  function go(n){
    i = (n + tabs.length) % tabs.length;
    tabs.forEach((t,k)=>{t.classList.toggle('active',k===i);t.setAttribute('aria-selected',k===i?'true':'false');});
    panels.forEach((p,k)=>p.classList.toggle('active',k===i));
    if(matchMedia('(max-width:880px)').matches){
      const rail = spot.querySelector('.spot-rail');
      rail.scrollTo({left:Math.max(0,tabs[i].offsetLeft-6),behavior:'smooth'});
    }
  }
  tabs.forEach((t,k)=>t.addEventListener('click',()=>go(k)));
  /* advance when the active tab's progress bar finishes its 5s run */
  spot.addEventListener('animationend',e=>{
    if(e.target.classList.contains('spot-tab-progress')) go(i+1);
  });
  /* only auto-cycle while the section is on screen */
  new IntersectionObserver(es=>es.forEach(e=>spot.classList.toggle('running',e.isIntersecting)),{threshold:.3}).observe(spot);
})();

/* ── Universe of checks: workflow → Decision Engine loop ── */
(function(){
  const uni = document.getElementById('universe');
  if(!uni) return;
  const steps = [...uni.querySelectorAll('.uni-tile.wf')].sort((a,b)=>+a.dataset.step-+b.dataset.step);
  const rows = [...uni.querySelectorAll('.uv-row')];
  const banner = uni.querySelector('.uv-banner');
  const core = uni.querySelector('.uni-engine-core');
  const svg = uni.querySelector('.uni-svg');
  const NS = 'http://www.w3.org/2000/svg';
  const mobile = () => window.matchMedia('(max-width:880px)').matches;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let paths = [], timer = null, idx = 0, visible = false, paused = false;

  if(reduced){ /* static end state, no loop */
    steps.forEach(t=>t.classList.add('on'));
    rows.forEach(r=>r.classList.add('on'));
    banner.classList.add('on');
    return;
  }

  function buildWires(){
    svg.innerHTML=''; paths=[];
    if(mobile()) return;
    const ur = uni.getBoundingClientRect();
    const er = core.getBoundingClientRect();
    const ex = er.left + er.width/2 - ur.left;
    const ey = er.top - ur.top - 10;
    steps.forEach(t=>{
      const r = t.getBoundingClientRect();
      const x = r.left + r.width/2 - ur.left;
      const y = r.bottom - ur.top + 2;
      const p = document.createElementNS(NS,'path');
      p.setAttribute('d',`M ${x} ${y} C ${x} ${y+80}, ${ex} ${ey-90}, ${ex} ${ey}`);
      p.setAttribute('fill','none');
      p.setAttribute('stroke',(getComputedStyle(t).getPropertyValue('--ac')||'#00B2FA').trim());
      p.setAttribute('stroke-width','1.5');
      p.setAttribute('stroke-linecap','round');
      p.setAttribute('opacity','.75');
      svg.appendChild(p);
      const len = p.getTotalLength();
      p.style.strokeDasharray = len;
      p.style.strokeDashoffset = len;
      p.style.transition = 'stroke-dashoffset .7s ease';
      paths.push(p);
    });
  }
  function resetWires(){
    paths.forEach(p=>{
      p.style.transition='none';
      p.style.strokeDashoffset = p.style.strokeDasharray;
      p.getBoundingClientRect();
      p.style.transition='stroke-dashoffset .7s ease';
    });
  }
  function reset(){
    steps.forEach(t=>t.classList.remove('on'));
    rows.forEach(r=>r.classList.remove('on'));
    banner.classList.remove('on');
    core.classList.remove('done');
    resetWires();
    idx = 0;
  }
  function pulse(){ core.classList.remove('pulse'); void core.offsetWidth; core.classList.add('pulse'); }
  function tick(){
    if(!visible || paused) return;
    if(idx < steps.length){
      const i = idx++;
      steps[i].classList.add('on');
      if(paths[i]) paths[i].style.strokeDashoffset = 0;
      setTimeout(()=>{ if(rows[i]) rows[i].classList.add('on'); pulse(); }, 650);
      timer = setTimeout(tick, 1700);
    } else if(idx === steps.length){
      idx++;
      banner.classList.add('on');
      core.classList.add('done');
      timer = setTimeout(tick, 3800);
    } else {
      reset();
      timer = setTimeout(tick, 800);
    }
  }
  uni.addEventListener('mouseenter',()=>{ paused = true; clearTimeout(timer); });
  uni.addEventListener('mouseleave',()=>{ if(paused){ paused = false; if(visible) timer = setTimeout(tick, 400); } });
  new IntersectionObserver(es=>es.forEach(e=>{
    if(e.isIntersecting && !visible){ visible = true; buildWires(); reset(); timer = setTimeout(tick, 500); }
    else if(!e.isIntersecting && visible){ visible = false; clearTimeout(timer); }
  }),{threshold:.25}).observe(uni);
  let rz;
  window.addEventListener('resize',()=>{ clearTimeout(rz); rz = setTimeout(()=>{ if(visible){ clearTimeout(timer); buildWires(); reset(); timer = setTimeout(tick, 400); } }, 180); });
})();

/* ── Threat section: dot map, hotspot pings, count-up, live feed ── */
(function(){
  const sec = document.querySelector('.threat');
  const svg = document.getElementById('tm-svg');
  if(!sec || !svg) return;
  const NS = 'http://www.w3.org/2000/svg';
  const U = 13, DOT = 2.4;
  const px = c => c*U+7, py = r => r*U+7;

  /* landmass as [row, colStart, colEnd] runs */
  const land = {
    other:[[0,4,10],[1,3,10],[2,3,9],[3,3,8],[4,4,7],[5,4,6],[6,4,5],[27,33,33],[28,33,34],[29,34,34]],
    ph:[[3,17,18],[4,16,18],[5,16,17],[6,17,18],[7,17,19],[8,18,19],[9,18,20],[10,19,20]],
    my:[[7,5,5],[8,5,6],[9,5,6],[10,6,6],[9,12,15],[10,11,13]],
    sg:[[11,6,6]],
    id:[[9,2,3],[10,3,4],[11,4,5],[12,5,6],[13,6,7],[14,8,13],[11,11,15],[12,11,15],[13,12,14],[11,17,17],[12,17,18],[13,17,17],[15,14,18],[12,24,28],[13,24,29],[14,25,27]],
    au:[[19,15,22],[20,13,24],[21,12,26],[22,11,27],[23,11,28],[24,12,28],[25,12,27],[26,13,26],[27,15,25],[28,18,22],[30,23,23]]
  };
  const tint = {other:'rgba(255,255,255,.10)',ph:'rgba(239,68,68,.55)',my:'rgba(245,158,11,.5)',sg:'rgba(0,178,250,.85)',id:'rgba(0,212,170,.45)',au:'rgba(155,168,255,.42)'};
  Object.keys(land).forEach(k=>{
    land[k].forEach(([r,c1,c2])=>{
      for(let c=c1;c<=c2;c++){
        const d=document.createElementNS(NS,'circle');
        d.setAttribute('cx',px(c)); d.setAttribute('cy',py(r)); d.setAttribute('r',DOT);
        d.setAttribute('fill',tint[k]);
        svg.appendChild(d);
      }
    });
  });

  const hots = [
    {label:'MANILA',x:16,y:4,dx:11,dy:3},
    {label:'JAKARTA',x:9,y:14,dx:-12,dy:16,anchor:'middle'},
    {label:'KUALA LUMPUR',x:5,y:9,dx:11,dy:-7},
    {label:'SINGAPORE',x:6,y:11,dx:11,dy:11},
    {label:'SYDNEY',x:26,y:25,dx:11,dy:3}
  ];
  const hotEls = hots.map(h=>{
    const g=document.createElementNS(NS,'g');
    g.setAttribute('class','tm-hot');
    const cx=px(h.x), cy=py(h.y);
    ['tm-ring','tm-ring r2'].forEach(cls=>{
      const ring=document.createElementNS(NS,'circle');
      ring.setAttribute('cx',cx); ring.setAttribute('cy',cy); ring.setAttribute('r',5.5);
      ring.setAttribute('class',cls);
      g.appendChild(ring);
    });
    const core=document.createElementNS(NS,'circle');
    core.setAttribute('cx',cx); core.setAttribute('cy',cy); core.setAttribute('r',3.4); core.setAttribute('class','tm-core');
    const inner=document.createElementNS(NS,'circle');
    inner.setAttribute('cx',cx); inner.setAttribute('cy',cy); inner.setAttribute('r',1.3); inner.setAttribute('class','tm-core-in');
    const t=document.createElementNS(NS,'text');
    t.setAttribute('x',cx+h.dx); t.setAttribute('y',cy+h.dy);
    if(h.anchor) t.setAttribute('text-anchor',h.anchor);
    t.textContent=h.label;
    g.append(core,inner,t);
    svg.appendChild(g);
    return g;
  });

  const cards = [...sec.querySelectorAll('.stat-card')];
  const feed = document.getElementById('tm-feed');
  const feedItems = cards.map(c=>({
    num: c.querySelector('.stat-val').textContent.trim(),
    desc: c.querySelector('.stat-desc').textContent.trim()
  }));

  /* count-up */
  function countUp(el){
    const val=+el.dataset.val, pre=el.dataset.prefix||'', suf=el.dataset.suffix||'';
    const t0=performance.now(), DUR=1300;
    (function frame(now){
      const p=Math.min((now-t0)/DUR,1), e=1-Math.pow(1-p,3);
      el.textContent=pre+Math.round(val*e)+suf;
      if(p<1) requestAnimationFrame(frame);
    })(performance.now());
  }

  let timer=null, idx=0, started=false;
  function cycle(){
    hotEls.forEach((g,k)=>g.classList.toggle('on',k===idx%hotEls.length));
    const f=feedItems[idx%feedItems.length];
    cards.forEach((c,k)=>c.classList.toggle('live',k===idx%feedItems.length));
    feed.classList.remove('show');
    setTimeout(()=>{
      feed.innerHTML=`<span class="up">▲ ${f.num}</span><span>${f.desc}</span>`;
      feed.classList.add('show');
    },350);
    idx++;
  }
  new IntersectionObserver(es=>es.forEach(e=>{
    if(e.isIntersecting){
      if(!started){
        started=true;
        cards.forEach((c,k)=>setTimeout(()=>{c.classList.add('in');countUp(c.querySelector('.stat-val'));},k*140));
      }
      if(!timer){ cycle(); timer=setInterval(cycle,2600); }
    } else if(timer){ clearInterval(timer); timer=null; }
  }),{threshold:.3}).observe(sec);
})();

/* ── ROI: reveal + total count-up ── */
(function(){
  const sec=document.getElementById('roi');
  if(!sec) return;
  const cards=[...sec.querySelectorAll('.roi-card')];
  const total=document.getElementById('roi-total');
  let done=false;
  new IntersectionObserver((es,obs)=>es.forEach(e=>{
    if(!e.isIntersecting||done) return;
    done=true;
    sec.classList.add('in');
    cards.forEach((c,k)=>setTimeout(()=>c.classList.add('in'),k*120));
    const val=+total.dataset.val, t0=performance.now(), DUR=1300;
    (function frame(now){
      const p=Math.min((now-t0)/DUR,1), ease=1-Math.pow(1-p,3);
      total.textContent='$'+(val*ease).toFixed(1)+'M+';
      if(p<1) requestAnimationFrame(frame);
    })(t0);
    obs.disconnect();
  }),{threshold:.3}).observe(sec);
})();

function fillMarket(key){
  const m = markets[key];
  document.getElementById('m-title').textContent = m.title;
  document.getElementById('m-desc').innerHTML = m.desc;
  document.getElementById('m-idsys').textContent = m.idsys;
  document.getElementById('m-quirk').textContent = m.quirk;
  document.getElementById('m-miss').textContent = m.miss;
  document.getElementById('m-win').textContent = m.win;
  document.getElementById('m-regs').innerHTML = m.regs.map(r=>`<div class="reg-item"><span class="reg-tick">✓</span><span>${r}</span></div>`).join('');
  document.getElementById('m-flag').src = 'https://flagcdn.com/w640/' + key + '.png';
}

function lockApacDetailHeight(){
  const detail = document.getElementById('market-detail');
  const inner = detail?.querySelector('.m-inner');
  if(!detail || !inner) return;
  const activeKey = document.querySelector('.apac-tab.active')?.dataset.m || 'ph';
  let maxH = 0;
  for(const key of Object.keys(markets)){
    fillMarket(key);
    maxH = Math.max(maxH, inner.scrollHeight);
  }
  fillMarket(activeKey);
  detail.style.minHeight = maxH + 'px';
}

function showMarket(el, key) {
  document.querySelectorAll('.apac-tab').forEach(c=>{c.classList.remove('active');c.setAttribute('aria-selected','false');});
  el.classList.add('active');
  el.setAttribute('aria-selected','true');
  if(matchMedia('(max-width:900px)').matches){
    el.parentElement.scrollTo({left:Math.max(0,el.offsetLeft-6),behavior:'smooth'});
  }
  fillMarket(key);
  const panel = document.getElementById('market-detail');
  panel.style.setProperty('--mc', getComputedStyle(el).getPropertyValue('--mc').trim() || '#00B2FA');
  panel.classList.remove('swap'); void panel.offsetWidth; panel.classList.add('swap');
}

lockApacDetailHeight();
let apacLockT;
addEventListener('resize',()=>{ clearTimeout(apacLockT); apacLockT=setTimeout(lockApacDetailHeight,150); });
addEventListener('load',lockApacDetailHeight);

/* ── APAC markets: auto-cycle with progress bar ── */
(function(){
  const grid = document.getElementById('apac-panel');
  if(!grid || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const cards = [...grid.querySelectorAll('.apac-tab')];
  let manual = false;
  cards.forEach(c=>c.addEventListener('click',()=>{ manual = true; grid.classList.remove('running'); }));
  grid.addEventListener('animationend',e=>{
    if(!e.target.classList.contains('market-progress') || manual) return;
    const i = cards.findIndex(c=>c.classList.contains('active'));
    const next = cards[(i+1)%cards.length];
    showMarket(next, next.dataset.m);
  });
  new IntersectionObserver(es=>es.forEach(e=>{
    if(!manual) grid.classList.toggle('running', e.isIntersecting);
  }),{threshold:.35}).observe(grid);
})();
/* ── Trust & security: staggered credential-wall reveal ── */
(function(){
  const wall = document.getElementById('tsec-wall');
  if(!wall || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const cells = [...wall.querySelectorAll('.tw-cell')];
  wall.classList.add('tw-reveal');
  cells.forEach((c,k)=>c.style.setProperty('--d',(k*80)+'ms'));
  /* threshold 0 + a bottom margin: the wall is taller than a phone viewport,
     so a fractional threshold would never fire on small screens */
  new IntersectionObserver((es,io)=>es.forEach(e=>{
    if(e.isIntersecting){ cells.forEach(c=>c.classList.add('in')); io.disconnect(); }
  }),{threshold:0,rootMargin:'0px 0px -12% 0px'}).observe(wall);
})();
