/**
 * AI Gateway — Interactive Promotional Landing Page Script
 * Featuring Exact Promotional Pools (0.21x, 0.32x, 0.50x, 0.75x, Claude Pools)
 * Real Frontier Models: OpenAI o1, o3-mini, GPT-4o, Claude 3.5 Sonnet v2, Opus 5
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

  // 5. Interactive Token Cost Calculator with Updated Promotional Pools
  const calcTokensInput = document.getElementById('calcTokens');
  const calcTierSelect = document.getElementById('calcTier');
  const calcPriceDisplay = document.getElementById('calcPrice');
  const calcOfficialDisplay = document.getElementById('calcOfficialPrice');
  const calcSavingsDisplay = document.getElementById('calcSavings');

  // Exact Promotional Pools & Multipliers requested by user
  const TIER_RATES = {
    'gpt-4o-mini': {
      official: 0.30,
      multiplier: 0.21,
      group: 'GPT 尝鲜特惠｜0.21x',
      modelName: 'GPT-4o Mini (0.21x Promo)'
    },
    'gpt-4o': {
      official: 5.00,
      multiplier: 0.32,
      group: 'GPT Plus 进阶｜0.32x',
      modelName: 'GPT-4o (0.32x Plus)'
    },
    'chatgpt-4o-latest': {
      official: 7.50,
      multiplier: 0.32,
      group: 'GPT Plus 进阶｜0.32x',
      modelName: 'ChatGPT-4o Latest'
    },
    'o1-mini': {
      official: 6.00,
      multiplier: 0.50,
      group: 'GPT Pro 专业｜0.50x',
      modelName: 'OpenAI o1-mini (0.50x Pro)'
    },
    'o1-preview': {
      official: 30.00,
      multiplier: 0.50,
      group: 'GPT Pro 专业｜0.50x',
      modelName: 'OpenAI o1-preview'
    },
    'o1-flagship': {
      official: 30.00,
      multiplier: 0.75,
      group: 'GPT Pro 尊享旗舰｜0.75x',
      modelName: 'OpenAI o1 Flagship (0.75x)'
    },
    'o3-mini': {
      official: 4.00,
      multiplier: 0.75,
      group: 'GPT Pro 尊享旗舰｜0.75x',
      modelName: 'OpenAI o3-mini (0.75x)'
    },
    'claude-3-5-sonnet': {
      official: 9.00,
      multiplier: 0.35,
      group: 'Claude & Opus 5',
      modelName: 'Claude 3.5 Sonnet v2'
    },
    'claude-opus-5': {
      official: 15.00,
      multiplier: 0.35,
      group: 'Claude & Opus 5',
      modelName: 'Claude Opus 5'
    },
    'claude-max': {
      official: 15.00,
      multiplier: 1.60,
      group: 'Claude Max 尊享专线｜1.6x',
      modelName: 'Claude 3.5 Sonnet Max (Dedicated)'
    }
  };

  function updateCalculator() {
    if (!calcTokensInput || !calcTierSelect || !calcPriceDisplay) return;

    const millionTokens = Math.max(0.1, parseFloat(calcTokensInput.value) || 1);
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
        calcSavingsDisplay.textContent = `Save ${savingsPercent}% vs Official Direct Price! (Limited-Time Quota: ${tierData.group})`;
        calcSavingsDisplay.style.color = '#34d399';
      } else {
        calcSavingsDisplay.textContent = `Unthrottled Dedicated Enterprise Seats (${tierData.group})`;
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
