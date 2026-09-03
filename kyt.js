(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var revealItems = document.querySelectorAll('[data-reveal]');
  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealItems.forEach(function (item) { item.classList.add('visible'); });
  } else {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.14 });
    revealItems.forEach(function (item) { observer.observe(item); });
  }

  var impactModes = {
    volume: {
      title: 'Alert volume before and after calibration', before: '491,144 alerts', after: '45,580 alerts',
      beforeWidth: '100%', afterWidth: '9.3%', note: 'Bars share one scale. The after volume is 9.3% of the original—not visually re-scaled.'
    },
    quality: {
      title: 'Share of alerts worth investigating', before: '17% true positive', after: '35% true positive',
      beforeWidth: '17%', afterWidth: '35%', note: 'The productive share of the queue increased from 17% to 35% in the reference deployment.'
    }
  };
  document.querySelectorAll('[data-impact-mode]').forEach(function (button) {
    button.addEventListener('click', function () {
      var state = impactModes[button.dataset.impactMode];
      document.querySelectorAll('[data-impact-mode]').forEach(function (item) {
        var active = item === button;
        item.classList.toggle('active', active);
        item.setAttribute('aria-pressed', String(active));
      });
      document.getElementById('impact-chart-title').textContent = state.title;
      document.querySelector('[data-before-value]').textContent = state.before;
      document.querySelector('[data-after-value]').textContent = state.after;
      document.querySelector('[data-before-bar]').style.width = state.beforeWidth;
      document.querySelector('[data-after-bar]').style.width = state.afterWidth;
      document.querySelector('[data-impact-note]').textContent = state.note;
    });
  });

  var thresholdRange = document.getElementById('threshold-range');
  var thresholdOutput = document.getElementById('threshold-output');
  var thresholdMode = 'uniform';
  var traderValues = [21000, 24600, 22800, 27300, 17400, 25200, 22200];
  var employeeValues = [3300, 2400, 4200, 3000, 7800, 2700, 3600];

  function countAbove(values, threshold) {
    return values.filter(function (value) { return value >= threshold; }).length;
  }

  function updateThresholds() {
    var uniform = thresholdMode === 'uniform';
    var threshold = Number(thresholdRange.value);
    var traderThreshold = uniform ? threshold : 28000;
    var employeeThreshold = uniform ? threshold : 5000;
    document.querySelector('[data-customer="trader"] .threshold-marker').style.bottom = Math.min(traderThreshold / 30000 * 100, 96) + '%';
    document.querySelector('[data-customer="employee"] .threshold-marker').style.bottom = Math.min(employeeThreshold / 30000 * 100, 96) + '%';
    thresholdRange.disabled = !uniform;
    thresholdRange.parentElement.classList.toggle('behavioural-active', !uniform);
    document.getElementById('threshold-label-text').textContent = uniform ? 'Institution-wide threshold' : 'Cluster thresholds';
    thresholdOutput.textContent = uniform ? '$' + threshold.toLocaleString('en-US') : '$28k / $5k';

    var traderAlerts = countAbove(traderValues, traderThreshold);
    var employeeAlerts = countAbove(employeeValues, employeeThreshold);
    document.querySelector('[data-trader-result]').textContent = traderAlerts + (traderAlerts === 1 ? ' alert' : ' alerts');
    document.querySelector('[data-employee-result]').textContent = employeeAlerts + (employeeAlerts === 1 ? ' alert' : ' alerts');
    document.querySelector('[data-trader-copy]').textContent = uniform ? 'Legitimate activity repeatedly enters the queue.' : 'Ordinary activity fits its behavioural group.';
    document.querySelector('[data-employee-copy]').textContent = uniform ? 'A material change remains below the global line.' : 'The change is visible against a quieter baseline.';
    document.querySelector('[data-risk-state]').textContent = uniform
      ? 'One threshold creates noise and a blind spot at the same time.'
      : 'Cluster-sensitive thresholds reduce noise while revealing meaningful change.';
  }
  if (thresholdRange) {
    thresholdRange.addEventListener('input', updateThresholds);
    document.querySelectorAll('[data-threshold-mode]').forEach(function (button) {
      button.addEventListener('click', function () {
        thresholdMode = button.dataset.thresholdMode;
        document.querySelectorAll('[data-threshold-mode]').forEach(function (item) {
          var active = item === button;
          item.classList.toggle('active', active);
          item.setAttribute('aria-pressed', String(active));
        });
        updateThresholds();
      });
    });
    updateThresholds();
  }

  var ruleBundles = {
    structuring: [
      { name: 'Structured cash deposits', summary: 'Repeated deposits beneath a review threshold.', description: 'Detect repeated cash deposits beneath a reporting or review threshold within a defined period.', window: '7 days', measure: 'Cumulative cash value', applied: 'Behavioural Cluster B', output: 'Create case' },
      { name: 'Cash-in, rapid cash-out', summary: 'Cash is followed by fast outgoing movement.', description: 'Identify accounts where a high proportion of deposited cash leaves within a short period.', window: '48 hours', measure: 'Cash-to-outflow ratio', applied: 'Cash-intensive clusters', output: 'Create case + link analysis' },
      { name: 'Related-account deposits', summary: 'Cash activity distributed across connected accounts.', description: 'Aggregate deposits across accounts connected by ownership, device or known relationship.', window: '14 days', measure: 'Network cash value', applied: 'Linked account group', output: 'Create network case' }
    ],
    velocity: [
      { name: 'Rapid movement after credit', summary: 'Incoming funds leave unusually quickly.', description: 'Detect when a material share of incoming value exits the account inside the configured window.', window: '24 hours', measure: 'Percentage of funds transferred', applied: 'Behavioural Cluster B', output: 'Create case + link analysis' },
      { name: 'Beneficiary velocity', summary: 'Unusual growth in distinct beneficiaries.', description: 'Compare beneficiary count and transaction frequency with the customer’s behavioural baseline.', window: '30 days', measure: 'Distinct beneficiaries', applied: 'All customer clusters', output: 'Create alert' },
      { name: 'Transaction burst', summary: 'Concentrated activity in a short period.', description: 'Identify a burst of transactions that is inconsistent with the customer’s normal timing and frequency.', window: '2 hours', measure: 'Count and aggregate value', applied: 'Selected products', output: 'Create alert' }
    ],
    counterparty: [
      { name: 'New high-value beneficiary', summary: 'Material payment to a new relationship.', description: 'Detect high-value activity involving a beneficiary not previously observed for the customer.', window: '90-day lookback', measure: 'Value to new beneficiary', applied: 'Risk-rated clusters', output: 'Create case' },
      { name: 'Geographic risk concentration', summary: 'Activity concentrates in configured markets.', description: 'Measure the frequency and value of activity involving institution-defined elevated-risk jurisdictions.', window: '30 days', measure: 'Country exposure', applied: 'Cross-border products', output: 'Create alert' },
      { name: 'Counterparty concentration', summary: 'Unexpected dependence on one recipient.', description: 'Identify material concentration of outgoing value to a counterparty outside the customer’s normal profile.', window: '30 days', measure: 'Share of outgoing value', applied: 'Business clusters', output: 'Create case' }
    ],
    behaviour: [
      { name: 'Dormant account reactivation', summary: 'Inactive account returns with material activity.', description: 'Detect renewed activity after a configured period of dormancy, weighted by value and channel.', window: '180-day lookback', measure: 'Dormancy + new activity', applied: 'Dormant accounts', output: 'Create case' },
      { name: 'Material baseline deviation', summary: 'Value or frequency changes unexpectedly.', description: 'Compare recent activity with the behavioural range expected for the customer’s assigned cluster.', window: '30 days', measure: 'Deviation from peer baseline', applied: 'All customer clusters', output: 'Create alert' },
      { name: 'Unexpected channel change', summary: 'Activity shifts to an unfamiliar channel.', description: 'Detect a material change in the channels, transaction types or timing used by the customer.', window: '14 days', measure: 'Channel-mix change', applied: 'Selected portfolios', output: 'Create alert' }
    ],
    network: [
      { name: 'Shared device network', summary: 'Multiple accounts use common device signals.', description: 'Connect accounts using the same device or network identifiers and evaluate their combined activity.', window: '30 days', measure: 'Shared identifiers', applied: 'Linked account group', output: 'Create network case' },
      { name: 'Fan-in and fan-out', summary: 'Many senders converge before funds disperse.', description: 'Identify collection accounts receiving from many sources and rapidly distributing funds onward.', window: '72 hours', measure: 'Network direction and velocity', applied: 'All accounts', output: 'Create network case' },
      { name: 'Circular movement', summary: 'Funds return through connected accounts.', description: 'Surface repeated circular flows that are only observable across the relationship network.', window: '14 days', measure: 'Closed transaction paths', applied: 'Linked account group', output: 'Escalate network' }
    ],
    custom: [
      { name: 'Institution-authored scenario', summary: 'Translate internal policy into a governed rule.', description: 'Configure a named scenario using the institution’s data, risk assessment and approval process.', window: 'Institution defined', measure: 'Configurable parameters', applied: 'Selected portfolio', output: 'Configurable workflow' },
      { name: 'Market-specific reporting rule', summary: 'Reflect local reporting and risk requirements.', description: 'Tailor thresholds, reference periods and outputs for the institution’s market and licence.', window: 'Market defined', measure: 'Local scenario criteria', applied: 'Market portfolio', output: 'Regulatory workflow' },
      { name: 'Portfolio-specific calibration', summary: 'Tune one scenario for different populations.', description: 'Apply different approved parameters to products or behavioural clusters without losing rule lineage.', window: 'Scenario defined', measure: 'Cluster-sensitive threshold', applied: 'Selected cluster', output: 'Create alert or case' }
    ]
  };
  var ruleList = document.getElementById('rule-list');

  function showRule(rule, selectedButton) {
    ruleList.querySelectorAll('.rule-option').forEach(function (item) { item.classList.toggle('active', item === selectedButton); });
    document.getElementById('rule-name').textContent = rule.name;
    document.getElementById('rule-description').textContent = rule.description;
    document.getElementById('rule-window').textContent = rule.window;
    document.getElementById('rule-measure').textContent = rule.measure;
    document.getElementById('rule-applied').textContent = rule.applied;
    document.getElementById('rule-output').textContent = rule.output;
  }

  function renderBundle(key) {
    ruleList.innerHTML = '';
    ruleBundles[key].forEach(function (rule, index) {
      var button = document.createElement('button');
      button.type = 'button';
      button.className = 'rule-option' + (index === 0 ? ' active' : '');
      var name = document.createElement('b');
      var summary = document.createElement('span');
      name.textContent = rule.name;
      summary.textContent = rule.summary;
      button.append(name, summary);
      button.addEventListener('click', function () { showRule(rule, button); });
      ruleList.appendChild(button);
    });
    showRule(ruleBundles[key][0], ruleList.firstElementChild);
  }
  if (ruleList) {
    document.querySelectorAll('[data-rule-tab]').forEach(function (tab, index, tabs) {
      tab.addEventListener('click', function () {
        tabs.forEach(function (item) { item.setAttribute('aria-selected', String(item === tab)); });
        renderBundle(tab.dataset.ruleTab);
      });
      tab.addEventListener('keydown', function (event) {
        if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;
        event.preventDefault();
        var next = (index + (event.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
        tabs[next].focus();
        tabs[next].click();
      });
    });
    renderBundle('structuring');
  }

  var sandboxTabs = Array.from(document.querySelectorAll('[data-sandbox-tab]'));
  var sandboxViews = Array.from(document.querySelectorAll('[data-sandbox-view]'));
  function selectSandboxView(tab) {
    var target = tab.dataset.sandboxTab;
    sandboxTabs.forEach(function (item) {
      var active = item === tab;
      item.setAttribute('aria-selected', String(active));
      item.tabIndex = active ? 0 : -1;
    });
    sandboxViews.forEach(function (view) {
      var active = view.dataset.sandboxView === target;
      view.hidden = !active;
      view.classList.toggle('active', active);
    });
  }
  sandboxTabs.forEach(function (tab, index) {
    tab.addEventListener('click', function () { selectSandboxView(tab); });
    tab.addEventListener('keydown', function (event) {
      if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp' && event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;
      event.preventDefault();
      var forward = event.key === 'ArrowDown' || event.key === 'ArrowRight';
      var next = (index + (forward ? 1 : -1) + sandboxTabs.length) % sandboxTabs.length;
      sandboxTabs[next].focus();
      selectSandboxView(sandboxTabs[next]);
    });
  });
  if (sandboxTabs.length) selectSandboxView(sandboxTabs[0]);

  var networkPanel = document.querySelector('.network-panel');
  if (networkPanel) {
    var networkSummary = document.querySelector('.network-summary');
    var networkStatus = networkPanel.querySelector('.network-scan-status span');
    function finishNetworkScan() {
      networkPanel.classList.remove('scanning');
      networkPanel.classList.add('revealed');
      networkStatus.textContent = 'Network detected · case created';
      networkSummary.querySelector('strong').textContent = '3 linked accounts · 1 network case';
      networkSummary.querySelector('span').textContent = 'Shared device, common payee and circular movement found';
    }
    if (reduceMotion || !('IntersectionObserver' in window)) {
      finishNetworkScan();
    } else {
      var networkObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          networkObserver.disconnect();
          networkPanel.classList.add('scanning');
          networkStatus.textContent = 'Scanning relationship signals…';
          window.setTimeout(finishNetworkScan, 2100);
        });
      }, { threshold: 0.38 });
      networkObserver.observe(networkPanel);
    }
  }
})();
