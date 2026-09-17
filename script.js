/**
 * AI Gateway — Interactive Promotional Landing Page Script
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Copy to Clipboard Functionality
  document.querySelectorAll('.copy-btn, .code-copy-btn').forEach(button => {
    button.addEventListener('click', async () => {
      const textToCopy = button.getAttribute('data-copy') || 
                         button.parentElement.querySelector('code')?.innerText ||
                         button.parentElement.querySelector('.base-url-text')?.innerText;
      
      if (!textToCopy) return;

      try {
        await navigator.clipboard.writeText(textToCopy.trim());
        const originalHtml = button.innerHTML;
        button.innerHTML = `
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          <span style="color: #10b981;">Copied!</span>
        `;
        setTimeout(() => {
          button.innerHTML = originalHtml;
        }, 2000);
      } catch (err) {
        console.error('Failed to copy text: ', err);
      }
    });
  });

  // 2. Setup Guides Tab Switching
  const guideTabs = document.querySelectorAll('.guide-nav-item');
  const guidePanes = document.querySelectorAll('.guide-pane');

  guideTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.getAttribute('data-guide');

      guideTabs.forEach(t => t.classList.remove('active'));
      guidePanes.forEach(p => p.style.display = 'none');

      tab.classList.add('active');
      const activePane = document.getElementById(`guide-${target}`);
      if (activePane) {
        activePane.style.display = 'block';
      }
    });
  });

  // 3. Pricing Filter Tabs
  const pricingTabs = document.querySelectorAll('.pricing-tab-btn');
  const pricingRows = document.querySelectorAll('.pricing-row');

  pricingTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const tier = tab.getAttribute('data-tier');

      pricingTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      pricingRows.forEach(row => {
        if (tier === 'all' || row.getAttribute('data-tier') === tier) {
          row.style.display = '';
        } else {
          row.style.display = 'none';
        }
      });
    });
  });

  // 4. Model Search Input
  const modelSearch = document.getElementById('modelSearchInput');
  if (modelSearch) {
    modelSearch.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase().trim();
      pricingRows.forEach(row => {
        const modelName = row.querySelector('.model-name-cell')?.textContent.toLowerCase() || '';
        const groupName = row.querySelector('.group-name-cell')?.textContent.toLowerCase() || '';
        
        if (modelName.includes(query) || groupName.includes(query)) {
          row.style.display = '';
        } else {
          row.style.display = 'none';
        }
      });
    });
  }

  // 5. Interactive Token Cost Calculator
  const calcTokensInput = document.getElementById('calcTokens');
  const calcTierSelect = document.getElementById('calcTier');
  const calcPriceDisplay = document.getElementById('calcPrice');
  const calcOfficialDisplay = document.getElementById('calcOfficialPrice');
  const calcSavingsDisplay = document.getElementById('calcSavings');

  // Base list price estimates per 1M tokens ($USD)
  const TIER_RATES = {
    'gpt-4o-mini': { official: 0.30, multiplier: 0.07, label: 'GPT 福利 (0.07x)' },
    'gpt-4o': { official: 5.00, multiplier: 0.16, label: 'GPT Plus (0.16x)' },
    'o1': { official: 30.00, multiplier: 0.20, label: 'GPT Pro (0.20x)' },
    'claude-3-5-sonnet': { official: 9.00, multiplier: 0.13, label: 'Opus 5 (0.13x)' },
    'claude-max': { official: 9.00, multiplier: 1.60, label: 'Claude Max (1.6x)' }
  };

  function updateCalculator() {
    if (!calcTokensInput || !calcTierSelect || !calcPriceDisplay) return;

    const millionTokens = parseFloat(calcTokensInput.value) || 1;
    const selectedKey = calcTierSelect.value;
    const tierData = TIER_RATES[selectedKey] || TIER_RATES['gpt-4o'];

    const officialCost = millionTokens * tierData.official;
    const gatewayCost = officialCost * tierData.multiplier;
    const savingsPercent = Math.round((1 - tierData.multiplier) * 100);

    calcPriceDisplay.textContent = `$${gatewayCost.toFixed(2)}`;
    if (calcOfficialDisplay) {
      calcOfficialDisplay.textContent = `$${officialCost.toFixed(2)}`;
    }
    if (calcSavingsDisplay) {
      if (tierData.multiplier < 1) {
        calcSavingsDisplay.textContent = `Save ${savingsPercent}% vs Official Direct Price!`;
        calcSavingsDisplay.style.color = '#34d399';
      } else {
        calcSavingsDisplay.textContent = `High-concurrency dedicated unthrottled pool`;
        calcSavingsDisplay.style.color = '#38bdf8';
      }
    }
  }

  if (calcTokensInput && calcTierSelect) {
    calcTokensInput.addEventListener('input', updateCalculator);
    calcTierSelect.addEventListener('change', updateCalculator);
    updateCalculator();
  }

  // 6. FAQ Accordions
  document.querySelectorAll('.faq-question').forEach(header => {
    header.addEventListener('click', () => {
      const item = header.parentElement;
      const isOpen = item.classList.contains('open');

      // Close all other FAQs
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));

      if (!isOpen) {
        item.classList.add('open');
      }
    });
  });
});
