/* Homepage interactions: user-controlled demos, accessible tabs and local estimates. */
(() => {
  'use strict';
  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => [...document.querySelectorAll(selector)];
  const animate = (element) => {
    element.classList.remove('content-change');
    void element.offsetWidth;
    element.classList.add('content-change');
  };

  const menu = $('.menu-toggle');
  const navigation = $('#navigation');
  function closeMenu(returnFocus = false) {
    menu.setAttribute('aria-expanded', 'false');
    menu.setAttribute('aria-label', 'Open navigation');
    navigation.classList.remove('is-open');
    if (returnFocus) menu.focus();
  }
  menu.addEventListener('click', () => {
    const expanded = menu.getAttribute('aria-expanded') !== 'true';
    menu.setAttribute('aria-expanded', String(expanded));
    menu.setAttribute('aria-label', expanded ? 'Close navigation' : 'Open navigation');
    navigation.classList.toggle('is-open', expanded);
  });
  navigation.addEventListener('click', (event) => {
    if (event.target.closest('a')) closeMenu();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') closeMenu(true);
  });
  document.addEventListener('click', (event) => {
    if (!event.target.closest('.site-header')) closeMenu();
  });
  matchMedia('(min-width:701px)').addEventListener('change', (event) => {
    if (event.matches) closeMenu();
  });

  // One focusable tab per set; arrow keys, Home and End select without moving the page.
  function tabGroup(selector, update) {
    const list = $(selector);
    const tabs = [...list.querySelectorAll('[role="tab"]')];
    function select(tab, focus = false) {
      tabs.forEach((item) => {
        const selected = item === tab;
        item.setAttribute('aria-selected', String(selected));
        item.tabIndex = selected ? 0 : -1;
      });
      const panel = document.getElementById(tab.getAttribute('aria-controls'));
      panel.setAttribute('aria-labelledby', tab.id);
      update(tab);
      if (focus) {
        tab.focus({ preventScroll: true });
        if (list.scrollWidth > list.clientWidth) {
          list.scrollTo({ left: Math.max(0, tab.offsetLeft - list.offsetLeft - 12), behavior: 'instant' });
        }
      }
    }
    tabs.forEach((tab, index) => {
      tab.addEventListener('click', () => select(tab));
      tab.addEventListener('keydown', (event) => {
        let next;
        const vertical = list.getAttribute('aria-orientation') === 'vertical';
        if (event.key === 'Home') next = 0;
        if (event.key === 'End') next = tabs.length - 1;
        if (event.key === 'ArrowRight' || (vertical && event.key === 'ArrowDown')) next = (index + 1) % tabs.length;
        if (event.key === 'ArrowLeft' || (vertical && event.key === 'ArrowUp')) next = (index - 1 + tabs.length) % tabs.length;
        if (next !== undefined) {
          event.preventDefault();
          select(tabs[next], true);
        }
      });
    });
    return (index) => select(tabs[index]);
  }

  const verification = [
    ['Document verified', 'Identity details extracted and checked', 'Document authenticity confirmed'],
    ['Live person confirmed', 'Selfie matched. Liveness checks passed.', 'Biometrics and face match passed'],
    ['Matched at the source', 'Identity cross-checked against PhilSys / PSA', 'Government identity record matched'],
    ['Screening complete', 'Sanctions and PEP checks returned no matches', 'No watchlist matches in this example']
  ];
  tabGroup('.verification-steps', (tab) => {
    const index = Number(tab.dataset.verify);
    const [title, description, result] = verification[index];
    $('#demo-title').textContent = title;
    $('#demo-description').textContent = description;
    $('#demo-result-text').textContent = result;
    $('.capture-label span').textContent = `0${index + 1} / 04`;
    animate($('.capture-status'));
  });

  const docs = 'https://docs.idmetagroup.com';
  const documentGraphic = $('#visual-center').innerHTML;
  const signalCard = (label, value, rows) => `<div class="signal-card"><div class="signal-top"><span>${label}</span><b>${value}</b></div>${rows.map(([name, status]) => `<div class="signal-row"><span>${name}</span><strong>${status}</strong></div>`).join('')}</div>`;
  const products = [
    {category:'Establish identity', title:'A document is just the beginning.', description:'Extract identity details and check for forgery, tampering and expiry. Give genuine customers a simpler start.', label:'Document analysis', checks:['OCR extraction', 'Tamper detection', 'MRZ validation'], graphic:documentGraphic, link:'/products/kyc/docu-veri', linkText:'Explore document verification'},
    {category:'Verify the person', title:'A real person. The right person.', description:'Connect a selfie to an identity document with passive liveness and face matching. Detect deepfakes, presentation attacks and injection attempts.', label:'Biometric analysis', checks:['Passive liveness', 'Face matching', 'Deepfake detection'], graphic:'<div class="signal-card biometric-preview"><img src="brand_assets/men-performing-selfie-large.jpeg" width="100" height="120" alt="Example selfie used for face matching"><div><strong>99.2%</strong><p>Example liveness confidence</p><span class="small-verified">✓ Selfie matches ID</span><span class="small-verified">✓ No injection signals</span></div></div>', link:'/products/kyc/biometrics-verification', linkText:'Explore biometrics'},
    {category:'Verify at the source', title:'Go beyond the document.', description:'Cross-check identity details against national government records. Direct, licensed access brings a stronger foundation to your verification decisions.', label:'Government source validation', checks:['Licensed access', 'Real-time lookup', 'One API'], graphic:signalCard('GOVERNMENT RECORD', 'Matched', [['PhilSys / PSA','Identity confirmed'],['Record comparison','Details matched'],['Source response','Verified']]), link:'/products/government-data-ph/overview', linkText:'Explore government validation'},
    {category:'Understand the risk', title:'Screen once. Stay informed.', description:'Screen against 45,000+ global watchlists, sanctions, PEP databases and adverse media sources. Keep risk in view with ongoing monitoring.', label:'Compliance screening', checks:['Sanctions & PEP', 'Adverse media', 'Ongoing monitoring'], graphic:signalCard('AML SCREENING', 'Complete', [['Sanctions','No matches'],['Politically exposed persons','No matches'],['Adverse media','Monitoring on']]), link:'/products/kyc/watchlist-and-aml-screening', linkText:'Explore AML screening'},
    {category:'Connect the signals', title:'Contact details with context.', description:'Verify phone and email details, assess carrier risk and link contact information to an identity. Catch inconsistencies before they become account risk.', label:'Contact risk analysis', checks:['OTP verification', 'Carrier risk', 'Identity linking'], graphic:signalCard('CONTACT VERIFICATION', 'Confirmed', [['Phone ending 4417','OTP verified'],['Carrier risk','Low'],['Identity link','Matched']]), link:'/products/alternative-verifications', linkText:'Explore phone & email risk'},
    {category:'See a fuller picture', title:'More signals. Fewer blind spots.', description:'Connect mobile and email details to online identity signals. Build a clearer picture of thin-file and unbanked applicants beyond traditional checks.', label:'Identity footprint', checks:['Mobile signals', 'Email history', 'Identity footprint'], graphic:signalCard('ALTERNATIVE IDENTITY', 'Signals found', [['Online identity signals','6 linked'],['Email history','Active since 2019'],['Identity footprint','Confirmed']]), link:'/products/alternative-verifications', linkText:'Explore social identity insights'},
    {category:'Support better decisions', title:'Income insights, from the source.', description:'Verify employment and income through payroll apps, gig platforms and government portals. Give lending teams better evidence to work with.', label:'Employment & income', checks:['Income verification', 'Employment data', 'Source validation'], graphic:signalCard('EMPLOYMENT INSIGHTS', 'Verified', [['Employment record','Confirmed'],['Income source','Payroll'],['Source validation','Complete']]), link:'/products/government-data-id/income-verification', linkText:'Explore employment insights'},
    {category:'Know the business', title:'Know who’s behind the company.', description:'Verify businesses, directors and ultimate beneficial owners. Map ownership and identify shell-company signals before you onboard.', label:'Business verification', checks:['Company verification', 'UBO mapping', 'Business risk'], graphic:signalCard('ACME HOLDINGS · SAMPLE', 'Reviewed', [['Company registry','Matched'],['Director identity','Verified'],['Beneficial owner','38% ownership']]), link:'/products/category-kyb', linkText:'Explore business verification'}
  ];
  const selectProduct = tabGroup('.product-tabs', (tab) => {
    const product = products[Number(tab.dataset.product)];
    $('#product-category').textContent = product.category;
    $('#product-title').textContent = product.title;
    $('#product-description').textContent = product.description;
    $('#visual-label').textContent = product.label.toUpperCase();
    $('#product-visual').setAttribute('aria-label', `Example ${product.label.toLowerCase()} results`);
    $('#visual-center').innerHTML = product.graphic;
    $('#visual-checks').innerHTML = product.checks.map((check) => `<span>✓ ${check}</span>`).join('');
    $('#product-link').href = docs + product.link;
    $('#product-link').innerHTML = `${product.linkText} <span aria-hidden="true">↗</span>`;
    animate($('#product-panel'));
  });
  $$('[data-select-product]').forEach((link) => link.addEventListener('click', () => selectProduct(Number(link.dataset.selectProduct))));

  const markets = {
    ph:{name:'Philippines', subtitle:'Government-source verification', title:'Closer to the source.<br>Further from fraud.', description:'Validate Philippine identities directly against PhilSys and extend your checks to professional licences, criminal records and tax identity.', checks:['PhilSys / PSA identity validation','NBI, PRC and TIN / BIR checks','AML screening aligned with BSP & AMLC'], sources:[['PhilSys / PSA','National identity'],['NBI / PRC','Records & licences'],['TIN / BIR','Tax identity']], link:'/products/government-data-ph/overview'},
    id:{name:'Indonesia', subtitle:'Licensed Dukcapil integration', title:'National records.<br>Local confidence.', description:'Validate NIK identity details against Dukcapil through licensed access. Connect national registry checks with biometrics and screening in one journey.', checks:['Real-time NIK and KTP validation','Licensed Dukcapil source checks','Workflows aligned with OJK & BI requirements'], sources:[['Dukcapil','National registry'],['NIK / KTP','Identity validation'],['Biometrics','Person verification']], link:'/products/government-data-id/overview'},
    au:{name:'Australia', subtitle:'Authorised IDmatch access', title:'Trusted documents.<br>Verified at the source.', description:'Check Australian identity documents through authorised IDmatch access to the Document Verification Service, alongside biometrics and AML screening.', checks:['Passport, driver licence and Medicare checks','Government-source document verification','Screening aligned with AUSTRAC obligations'], sources:[['IDmatch / DVS','Document checks'],['Biometrics','Face & liveness'],['AML screening','Compliance checks']], link:'/products/government-data-au/overview'},
    my:{name:'Malaysia', subtitle:'Local identity. Connected checks.', title:'Built around MyKad.<br>Ready for your workflow.', description:'Connect MyKad and JPN cross-verification with biometric checks and AML screening for Malaysian customer onboarding.', checks:['MyKad / JPN identity cross-verification','Passive liveness and face matching','Workflows aligned with BNM e-KYC requirements'], sources:[['MyKad / JPN','Identity checks'],['Biometrics','Face & liveness'],['AML screening','Compliance checks']], link:null},
    sg:{name:'Singapore', subtitle:'Consent-based identity data', title:'Customer consent.<br>Confident onboarding.', description:'Bring consented Singpass / MyInfo identity data into your onboarding journey, alongside liveness and AML screening.', checks:['Singpass / MyInfo consented data','Biometrics and compliance screening','Workflows aligned with MAS requirements'], sources:[['Singpass','Customer consent'],['MyInfo','Identity data'],['AML screening','Compliance checks']], link:null}
  };
  tabGroup('.market-tabs', (tab) => {
    const market = markets[tab.dataset.market];
    $('#market-subtitle').textContent = market.subtitle;
    $('#market-title').innerHTML = market.title;
    $('#market-description').textContent = market.description;
    $('#market-checks').innerHTML = market.checks.map((check) => `<li>${check}</li>`).join('');
    $('#source-nodes').innerHTML = market.sources.map(([name, description]) => `<div><span class="node-dot"></span><strong>${name}</strong><span>${description}</span></div>`).join('');
    const link = $('#market-link');
    link.href = market.link ? docs + market.link : '/contact';
    if (market.link) { link.target = '_blank'; link.rel = 'noopener noreferrer'; }
    else { link.removeAttribute('target'); link.removeAttribute('rel'); }
    link.innerHTML = `${market.link ? 'Explore' : 'Discuss'} ${market.name} coverage <span aria-hidden="true">↗</span>`;
    animate($('#market-panel'));
  });

  const apiContent = $('#integration-content').innerHTML;
  const steps = (items) => items.map(([title, description], i) => `<div class="setup-step"><span class="mono">0${i+1}</span><div><strong>${title}</strong><p>${description}</p></div></div>`).join('');
  const integrations = {
    api:{label:'WORKFLOW / API', note:'Illustrative response', content:apiContent, features:'REST API · Webhooks · Custom workflows'},
    sdk:{label:'WORKFLOW / PRE-BUILT SDK', note:'Embedded verification', content:steps([['Configure your verification checks','Choose the identity and compliance checks you need.'],['Embed the verification experience','Add a pre-built flow to your mobile or web app.'],['Receive the verification result','Connect the outcome to your onboarding decisions.']]), features:'Mobile & web · Flutter · Pre-built UI'},
    link:{label:'WORKFLOW / DIRECT LINK', note:'No development required', content:steps([['Create a verification journey','Set up the required checks in your dashboard.'],['Share your hosted verification link','Send it by email, SMS or QR code.'],['Review the results in IDmeta','Customers complete verification in their browser.']]), features:'Hosted journey · SMS · Email · QR code'}
  };
  tabGroup('.integration-tabs', (tab) => {
    const integration = integrations[tab.dataset.integration];
    $('#integration-label').textContent = integration.label;
    $('#integration-note').textContent = integration.note;
    $('#integration-content').innerHTML = integration.content;
    $('#integration-features').textContent = integration.features;
    animate($('#integration-content'));
  });

  const industries = $$('.industry-accordions details');
  industries.forEach((detail) => detail.addEventListener('toggle', () => {
    if (detail.open) industries.forEach((other) => { if (other !== detail) other.open = false; });
  }));

  const volume = $('#volume');
  const cost = $('#review-cost');
  const number = new Intl.NumberFormat('en-US');
  function updateSavings() {
    const applications = Number(volume.value);
    const reviewCost = cost.valueAsNumber;
    const valid = Number.isFinite(reviewCost) && cost.validity.valid;
    cost.setAttribute('aria-invalid', String(!valid));
    $('#volume-output').textContent = number.format(applications);
    $('#savings-output').textContent = valid ? `US$${number.format(Math.round(applications * reviewCost * 0.8))}` : '—';
    volume.style.setProperty('--fill', `${(applications - Number(volume.min)) / (Number(volume.max) - Number(volume.min)) * 100}%`);
  }
  volume.addEventListener('input', updateSavings);
  cost.addEventListener('input', updateSavings);
  updateSavings();
})();
