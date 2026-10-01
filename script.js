/**
 * AI Gateway — Interactive Platform Landing Page Script
 * 100% English | Zero Chinese Characters
 * 4 OpenAI Routing Pools: 0.21x, 0.32x, 0.50x, 0.75x
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Mobile Menu Toggle
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const navLinks = document.getElementById('navLinks');
  if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', () => {
      navLinks.classList.toggle('mobile-open');
    });
    // Close mobile menu when clicking a link
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('mobile-open');
      });
    });
  }

  // 2. Copy to Clipboard Functionality
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

  // 3. Setup Guides Tab Switching
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

  // 4. Pricing Filter Tabs
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

  // 5. Model Search Input
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

  // 6. Interactive Quota Calculator — 6 Transparent Routing Pools
  const calcTokensInput = document.getElementById('calcTokens');
  const calcTierSelect = document.getElementById('calcTier');
  const calcDeductedDisplay = document.getElementById('calcDeductedTokens');
  const calcMultiplierDisplay = document.getElementById('calcMultiplierDisplay');
  const calcSummaryDisplay = document.getElementById('calcSummaryText');

  // Exact 6 Pools: OpenAI (0.16x, 0.325x, 0.45x, 0.45x) & Claude (0.24x, 3.00x)
  const POOL_RATES = {
    '0.1625': {
      multiplier: 0.1625,
      displayMultiplier: '0.16x',
      name: 'Starter Pool (0.16x)',
      description: 'gpt-4o-mini & lightweight automation'
    },
    '0.325': {
      multiplier: 0.325,
      displayMultiplier: '0.325x',
      name: 'Plus Pool (0.325x)',
      description: 'gpt-4o & daily coding assistant workflows'
    },
    '0.45-pro': {
      multiplier: 0.45,
      displayMultiplier: '0.45x',
      name: 'Pro Reasoning Pool (0.45x)',
      description: 'Sol & Terra deep reasoning suite'
    },
    '0.45-flagship': {
      multiplier: 0.45,
      displayMultiplier: '0.45x',
      name: 'Flagship Pro Pool (0.45x)',
      description: 'Astra & OpenAI o1 / o3-mini'
    },
    '0.24': {
      multiplier: 0.24,
      displayMultiplier: '0.24x',
      name: 'Claude Standard Pool (0.24x)',
      description: 'Claude Opus 5, Sonnet 5, and Fable 5'
    },
    '3.00': {
      multiplier: 3.00,
      displayMultiplier: '3.00x',
      name: 'Claude Max Pool (3.00x)',
      description: 'Claude 3.7 Sonnet (Hybrid Thinking) & Claude Code'
    }
  };

  function updateCalculator() {
    if (!calcTokensInput || !calcTierSelect) return;

    const millionTokens = Math.max(0.1, parseFloat(calcTokensInput.value) || 1);
    const selectedKey = calcTierSelect.value;
    const pool = POOL_RATES[selectedKey] || POOL_RATES['0.325'];

    const rawTokens = millionTokens * 1000000;
    const effectiveTokensDeducted = Math.round(rawTokens * pool.multiplier);

    if (calcDeductedDisplay) {
      calcDeductedDisplay.textContent = `${(effectiveTokensDeducted / 1000000).toFixed(2)}M Tokens`;
    }

    if (calcMultiplierDisplay) {
      calcMultiplierDisplay.textContent = `${pool.displayMultiplier} Multiplier`;
    }

    if (calcSummaryDisplay) {
      calcSummaryDisplay.textContent = `Consuming ${millionTokens}M raw tokens in the ${pool.name} deducts ${(effectiveTokensDeducted / 1000000).toFixed(2)}M from your account balance.`;
    }
  }

  if (calcTokensInput && calcTierSelect) {
    calcTokensInput.addEventListener('input', updateCalculator);
    calcTierSelect.addEventListener('change', updateCalculator);
    updateCalculator();
  }

  // 7. FAQ Accordions
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
