/**
 * AI Gateway — Interactive Promotional Landing Page Script
 * Featuring 6 Exact Upstream Tiers and New OpenAI & Anthropic Claude Models
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

  // 3. Pricing Filter Tabs (6 Groups: welfare, opus, plus, pro, pro-vip, claude-max)
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

  // 5. Interactive Token Cost Calculator with 6 Specific Groups
  const calcTokensInput = document.getElementById('calcTokens');
  const calcTierSelect = document.getElementById('calcTier');
  const calcPriceDisplay = document.getElementById('calcPrice');
  const calcOfficialDisplay = document.getElementById('calcOfficialPrice');
  const calcSavingsDisplay = document.getElementById('calcSavings');

  // Exact 6 Tiers with base official rates per 1M tokens ($USD) and multipliers
  const TIER_RATES = {
    'gpt-4o-mini': {
      official: 0.30,
      multiplier: 0.07,
      group: 'GPT 福利｜0.07x',
      modelName: 'GPT-4o Mini'
    },
    'claude-3-5-sonnet': {
      official: 9.00,
      multiplier: 0.13,
      group: 'Opus 5｜0.13x',
      modelName: 'Claude 3.5 Sonnet (v2)'
    },
    'claude-3-5-haiku': {
      official: 2.00,
      multiplier: 0.13,
      group: 'Opus 5｜0.13x',
      modelName: 'Claude 3.5 Haiku'
    },
    'claude-opus-5': {
      official: 45.00,
      multiplier: 0.13,
      group: 'Opus 5｜0.13x',
      modelName: 'Claude Opus 5'
    },
    'gpt-4o': {
      official: 5.00,
      multiplier: 0.16,
      group: 'GPT Plus｜0.16x',
      modelName: 'GPT-4o'
    },
    'chatgpt-4o-latest': {
      official: 7.50,
      multiplier: 0.16,
      group: 'GPT Plus｜0.16x',
      modelName: 'ChatGPT-4o Latest'
    },
    'o1-mini': {
      official: 6.00,
      multiplier: 0.20,
      group: 'GPT Pro｜0.20x',
      modelName: 'OpenAI o1-mini'
    },
    'o1-preview': {
      official: 30.00,
      multiplier: 0.20,
      group: 'GPT Pro｜0.20x',
      modelName: 'OpenAI o1-preview'
    },
    'o1-flagship': {
      official: 30.00,
      multiplier: 0.30,
      group: 'GPT Pro尊享｜0.30x',
      modelName: 'OpenAI o1 Flagship'
    },
    'o3-mini': {
      official: 4.00,
      multiplier: 0.30,
      group: 'GPT Pro尊享｜0.30x',
      modelName: 'OpenAI o3-mini'
    },
    'claude-max': {
      official: 9.00,
      multiplier: 1.60,
      group: 'Claude Max｜1.6x',
      modelName: 'Claude 3.5 Sonnet Max'
    }
  };

  function updateCalculator() {
    if (!calcTokensInput || !calcTierSelect || !calcPriceDisplay) return;

    const millionTokens = Math.max(0.1, parseFloat(calcTokensInput.value) || 1);
    const selectedKey = calcTierSelect.value;
    const tierData = TIER_RATES[selectedKey] || TIER_RATES['claude-3-5-sonnet'];

    const officialCost = millionTokens * tierData.official;
    const gatewayCost = officialCost * tierData.multiplier;
    const savingsPercent = Math.round((1 - tierData.multiplier) * 100);

    calcPriceDisplay.textContent = `$${gatewayCost.toFixed(2)}`;
    if (calcOfficialDisplay) {
      calcOfficialDisplay.textContent = `$${officialCost.toFixed(2)}`;
    }
    if (calcSavingsDisplay) {
      if (tierData.multiplier < 1) {
        calcSavingsDisplay.textContent = `Save ${savingsPercent}% vs Official Direct Price! (${tierData.group})`;
        calcSavingsDisplay.style.color = '#34d399';
      } else {
        calcSavingsDisplay.textContent = `Unthrottled Enterprise Dedicated Seats (${tierData.group})`;
        calcSavingsDisplay.style.color = '#f472b6';
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
