/* ==========================================================================
   Ranil Systems - Marketplace Portal & Admin Camera Upload Controller
   Zero-Price Customer Experience, Camera Details Uploader & Direct WhatsApp Flow
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  RanilPortal.init();
});

const RanilPortal = {
  currentCategory: 'all',
  searchQuery: '',
  sortBy: 'featured',
  selectedProduct: null,
  activeColor: null,
  activeSize: null,
  tempUploadImageData: null,

  init() {
    this.initTheme();
    this.initSearchAndSort();
    this.initCategoryTabs();
    this.initDrawers();
    this.initModals();
    this.initOrderSubmission();
    this.renderProducts();
    this.updateBadges();

    // Sync updates
    window.cartManager.subscribe(() => {
      this.updateBadges();
      this.renderCartDrawer();
      this.renderWishlistDrawer();
    });

    console.log('⚡ Ranil Systems Portal & Admin Uploader ready.');
  },

  // --- Theme Management ---
  initTheme() {
    const saved = localStorage.getItem('ranil_theme') || 'light';
    this.setTheme(saved);

    const toggleBtn = document.getElementById('theme-toggle-btn');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        const curr = document.documentElement.getAttribute('data-theme') || 'light';
        const next = curr === 'light' ? 'dark' : 'light';
        this.setTheme(next);
        this.showToast(`Switched to ${next} theme`, 'info');
      });
    }
  },

  setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('ranil_theme', theme);
    const iconEl = document.getElementById('theme-icon');
    if (iconEl) {
      if (theme === 'dark') {
        iconEl.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>`;
      } else {
        iconEl.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`;
      }
    }
  },

  // --- Category Tabs ---
  initCategoryTabs() {
    const tabs = document.querySelectorAll('.category-nav-tab');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        this.currentCategory = tab.dataset.category || 'all';
        this.renderProducts();
      });
    });
  },

  // --- Search & Sorting ---
  initSearchAndSort() {
    const searchInput = document.getElementById('marketplace-search-input');
    const sortSelect = document.getElementById('marketplace-sort-select');

    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value.toLowerCase().trim();
        this.renderProducts();
      });

      window.addEventListener('keydown', (e) => {
        if (e.key === '/' && document.activeElement !== searchInput) {
          e.preventDefault();
          searchInput.focus();
        }
      });
    }

    if (sortSelect) {
      sortSelect.addEventListener('change', (e) => {
        this.sortBy = e.target.value;
        this.renderProducts();
      });
    }
  },

  // --- Render Products (Zero-Price Mode) ---
  renderProducts() {
    const grid = document.getElementById('products-marketplace-grid');
    const countDisplay = document.getElementById('results-count-text');
    if (!grid) return;

    let items = [...window.catalogManager.getAll()];

    if (this.currentCategory !== 'all') {
      items = items.filter(p => p.category === this.currentCategory);
    }

    if (this.searchQuery) {
      items = items.filter(p => {
        return p.name.toLowerCase().includes(this.searchQuery) ||
               p.modelNo.toLowerCase().includes(this.searchQuery) ||
               p.categoryName.toLowerCase().includes(this.searchQuery) ||
               p.description.toLowerCase().includes(this.searchQuery);
      });
    }

    if (this.sortBy === 'rating') {
      items.sort((a, b) => b.rating - a.rating);
    } else if (this.sortBy === 'name') {
      items.sort((a, b) => a.name.localeCompare(b.name));
    }

    if (countDisplay) {
      countDisplay.textContent = `Showing ${items.length} verified Ranil Systems products`;
    }

    grid.innerHTML = '';

    if (items.length === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px; background: var(--bg-surface); border: 1px dashed var(--border-strong); border-radius: var(--radius-md);">
          <div style="font-size: 2.5rem; margin-bottom: 8px;">📷</div>
          <h3>No systems found in this category</h3>
          <p style="color: var(--text-dim); margin-top: 4px;">Click "Admin Portal" at the top to upload your cameras!</p>
        </div>
      `;
      return;
    }

    items.forEach(product => {
      grid.appendChild(this.createMarketplaceCard(product));
    });
  },

  createMarketplaceCard(product) {
    const card = document.createElement('div');
    card.className = 'marketplace-card';
    card.dataset.id = product.id;

    const isWishlisted = window.cartManager.isWishlisted(product.id);
    const bulletList = (product.highlights || []).slice(0, 3).map(h => `<li>${this.escapeHTML(h)}</li>`).join('');

    card.innerHTML = `
      <div class="card-image-stage">
        ${product.badge ? `<span class="deal-badge-pill">${this.escapeHTML(product.badge)}</span>` : ''}
        <button class="wishlist-heart-btn ${isWishlisted ? 'active' : ''}" title="${isWishlisted ? 'Remove from Saved' : 'Save to Wishlist'}" data-wishlist="${product.id}">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="${isWishlisted ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2.2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
        </button>

        <img src="${product.image}" alt="${this.escapeHTML(product.name)}" class="product-real-img" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=600&q=80';">

        <button class="card-quickview-trigger" data-qv="${product.id}">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
          <span>Specifications</span>
        </button>
      </div>

      <div class="card-details-box">
        <div class="card-model-row">
          <span class="card-model-tag">${this.escapeHTML(product.modelNo)}</span>
          <span class="card-category-name">${this.escapeHTML(product.categoryName)}</span>
        </div>

        <h3 class="card-product-title">${this.escapeHTML(product.name)}</h3>

        <div class="rating-pill-row">
          <span class="rating-badge-green">${product.rating} ★</span>
          <span class="rating-count-text">(${product.reviewsCount} reviews)</span>
        </div>

        <ul class="card-feature-bullets">
          ${bulletList}
        </ul>

        <!-- ZERO PRICE CARD BLOCK -->
        <div class="card-quote-status-block">
          <div class="quote-label-text">Pricing & Delivery:</div>
          <div class="quote-highlight-badge">
            <span>💬 Price on WhatsApp Quote</span>
          </div>
          <div class="quote-sub-note">Ranil Systems confirms custom price & delivery on WhatsApp</div>
        </div>

        <div class="card-cta-group">
          <!-- WhatsApp Order Button -->
          <a class="btn-whatsapp-order" href="${window.cartManager.getProductInquiryWhatsAppUrl(product)}" target="_blank" rel="noopener" title="Ask Price & Delivery on WhatsApp">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z"/>
            </svg>
            <span>WhatsApp</span>
          </a>

          <!-- Add to Order -->
          <button class="btn-add-quote-cart" data-cart="${product.id}">
            <span>+ Add to Order</span>
          </button>
        </div>
      </div>
    `;

    // Click triggers
    card.querySelector('.card-image-stage').addEventListener('click', (e) => {
      if (!e.target.closest('.wishlist-heart-btn')) this.openProductModal(product);
    });
    card.querySelector('.card-product-title').addEventListener('click', () => {
      this.openProductModal(product);
    });
    card.querySelector('.card-quickview-trigger').addEventListener('click', (e) => {
      e.stopPropagation();
      this.openProductModal(product);
    });

    // Wishlist Toggle
    const wishBtn = card.querySelector('.wishlist-heart-btn');
    wishBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const added = window.cartManager.toggleWishlist(product.id);
      wishBtn.classList.toggle('active', added);
      this.showToast(added ? `Saved "${product.name}"` : `Removed from Saved`, added ? 'success' : 'info');
    });

    // Add to Order
    card.querySelector('.btn-add-quote-cart').addEventListener('click', (e) => {
      e.stopPropagation();
      window.cartManager.addItem(product, 1);
      this.showToast(`Added "${product.name}" to Order List! 📋`, 'success');
      this.openCartDrawer();
    });

    return card;
  },

  // --- Specifications Modal ---
  openProductModal(product) {
    this.selectedProduct = product;
    this.activeColor = product.colors ? product.colors[0] : null;
    this.activeSize = product.sizes ? product.sizes[0] : null;

    const modal = document.getElementById('product-specs-modal');
    if (!modal) return;

    // Gallery image
    const mainImg = document.getElementById('modal-main-gallery-img');
    if (mainImg) mainImg.src = product.image;

    // Details
    document.getElementById('modal-category-text').textContent = `${product.categoryName} · Model: ${product.modelNo}`;
    document.getElementById('modal-title-text').textContent = product.name;
    document.getElementById('modal-rating-badge').textContent = `${product.rating} ★`;
    document.getElementById('modal-reviews-text').textContent = `(${product.reviewsCount} reviews)`;
    document.getElementById('modal-stock-text').textContent = `✓ ${product.stockStatus || 'In Stock'}`;
    document.getElementById('modal-desc-paragraph').textContent = product.description;

    // Specifications Table (Key-Value)
    const specsTable = document.getElementById('modal-specs-table-body');
    if (specsTable) {
      specsTable.innerHTML = '';
      if (product.specs) {
        Object.keys(product.specs).forEach(key => {
          const row = document.createElement('tr');
          row.innerHTML = `
            <td class="spec-key">${this.escapeHTML(key)}</td>
            <td class="spec-val">${this.escapeHTML(product.specs[key])}</td>
          `;
          specsTable.appendChild(row);
        });
      }
    }

    // Color options
    const colorBox = document.getElementById('modal-color-options');
    if (colorBox) {
      colorBox.innerHTML = '';
      if (product.colors && product.colors.length > 0) {
        product.colors.forEach((col, idx) => {
          const btn = document.createElement('button');
          btn.className = `variant-chip-btn ${idx === 0 ? 'active' : ''}`;
          btn.textContent = col;
          btn.addEventListener('click', () => {
            colorBox.querySelectorAll('.variant-chip-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            this.activeColor = col;
            this.updateModalWhatsAppLink();
          });
          colorBox.appendChild(btn);
        });
      }
    }

    // Size / Lens options
    const sizeBox = document.getElementById('modal-size-options');
    if (sizeBox) {
      sizeBox.innerHTML = '';
      if (product.sizes && product.sizes.length > 0) {
        product.sizes.forEach((sz, idx) => {
          const btn = document.createElement('button');
          btn.className = `variant-chip-btn ${idx === 0 ? 'active' : ''}`;
          btn.textContent = sz;
          btn.addEventListener('click', () => {
            sizeBox.querySelectorAll('.variant-chip-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            this.activeSize = sz;
            this.updateModalWhatsAppLink();
          });
          sizeBox.appendChild(btn);
        });
      }
    }

    this.updateModalWhatsAppLink();
    modal.classList.add('active');
  },

  updateModalWhatsAppLink() {
    if (!this.selectedProduct) return;
    const btn = document.getElementById('modal-whatsapp-direct-btn');
    if (btn) {
      btn.href = window.cartManager.getProductInquiryWhatsAppUrl(this.selectedProduct, this.activeColor, this.activeSize);
    }
  },

  closeProductModal() {
    const modal = document.getElementById('product-specs-modal');
    if (modal) modal.classList.remove('active');
  },

  // --- Drawers (Order Staging Cart & Saved) ---
  initDrawers() {
    const cartTrigger = document.getElementById('cart-drawer-trigger');
    const cartClose = document.getElementById('cart-drawer-close');
    if (cartTrigger) cartTrigger.addEventListener('click', () => this.openCartDrawer());
    if (cartClose) cartClose.addEventListener('click', () => this.closeCartDrawer());

    const wishTrigger = document.getElementById('wishlist-drawer-trigger');
    const wishClose = document.getElementById('wishlist-drawer-close');
    if (wishTrigger) wishTrigger.addEventListener('click', () => this.openWishlistDrawer());
    if (wishClose) wishClose.addEventListener('click', () => this.closeWishlistDrawer());

    document.querySelectorAll('.drawer-container-overlay').forEach(overlay => {
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) overlay.classList.remove('active');
      });
    });

    const modalAddBtn = document.getElementById('modal-add-to-cart-btn');
    if (modalAddBtn) {
      modalAddBtn.addEventListener('click', () => {
        if (!this.selectedProduct) return;
        window.cartManager.addItem(this.selectedProduct, 1, this.activeColor, this.activeSize);
        this.closeProductModal();
        this.showToast(`Added "${this.selectedProduct.name}" to Order List!`, 'success');
        this.openCartDrawer();
      });
    }
  },

  openCartDrawer() {
    this.renderCartDrawer();
    const d = document.getElementById('cart-drawer-overlay');
    if (d) d.classList.add('active');
  },

  closeCartDrawer() {
    const d = document.getElementById('cart-drawer-overlay');
    if (d) d.classList.remove('active');
  },

  openWishlistDrawer() {
    this.renderWishlistDrawer();
    const d = document.getElementById('wishlist-drawer-overlay');
    if (d) d.classList.add('active');
  },

  closeWishlistDrawer() {
    const d = document.getElementById('wishlist-drawer-overlay');
    if (d) d.classList.remove('active');
  },

  renderCartDrawer() {
    const container = document.getElementById('cart-items-container');
    if (!container) return;

    const totals = window.cartManager.getTotals();
    const items = window.cartManager.cartItems;

    container.innerHTML = '';
    if (items.length === 0) {
      container.innerHTML = `
        <div style="text-align: center; padding: 48px 16px; color: var(--text-muted);">
          <div style="font-size: 2.5rem; margin-bottom: 8px;">📋</div>
          <h4 style="color: var(--text-main);">Your Order List is empty</h4>
          <p style="font-size: 0.85rem; margin-top: 4px; margin-bottom: 16px;">Add Ranil Systems hardware to receive a combined price quote on WhatsApp.</p>
          <button class="cart-order-btn" style="margin: 0 auto;" onclick="RanilPortal.closeCartDrawer();">Browse Systems</button>
        </div>
      `;
    } else {
      items.forEach(item => {
        const row = document.createElement('div');
        row.className = 'cart-item-card';
        row.innerHTML = `
          <div class="cart-item-thumbnail">
            <img src="${item.image || 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=600&q=80'}" alt="${this.escapeHTML(item.name)}">
          </div>
          <div class="cart-item-info">
            <h4 class="cart-item-title-text">${this.escapeHTML(item.name)}</h4>
            <div class="cart-item-model-text">${this.escapeHTML(item.modelNo)} · ${this.escapeHTML(item.color)}</div>
            <div style="font-size: 0.8rem; font-weight: 700; color: #059669; margin-bottom: 6px;">💬 Price on WhatsApp Quote</div>

            <div class="cart-controls-row">
              <div class="qty-stepper-box">
                <button class="qty-step-btn" data-minus="${item.cartItemId}">−</button>
                <span class="qty-step-value">${item.quantity}</span>
                <button class="qty-step-btn" data-plus="${item.cartItemId}">+</button>
              </div>

              <button class="cart-trash-btn" data-del="${item.cartItemId}" title="Remove item">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
              </button>
            </div>
          </div>
        `;

        row.querySelector(`[data-minus="${item.cartItemId}"]`).addEventListener('click', () => {
          window.cartManager.updateQuantity(item.cartItemId, -1);
        });
        row.querySelector(`[data-plus="${item.cartItemId}"]`).addEventListener('click', () => {
          window.cartManager.updateQuantity(item.cartItemId, 1);
        });
        row.querySelector(`[data-del="${item.cartItemId}"]`).addEventListener('click', () => {
          window.cartManager.removeItem(item.cartItemId);
          this.showToast('Item removed', 'info');
        });

        container.appendChild(row);
      });
    }

    document.getElementById('cart-drawer-total-count').textContent = `${totals.totalUnits} Units (${totals.totalItems} Items)`;
    const checkoutBtn = document.getElementById('btn-drawer-proceed-whatsapp');
    if (checkoutBtn) checkoutBtn.disabled = items.length === 0;
  },

  renderWishlistDrawer() {
    const container = document.getElementById('wishlist-items-container');
    if (!container) return;

    const ids = window.cartManager.wishlist;
    const products = window.catalogManager.getAll().filter(p => ids.includes(p.id));

    container.innerHTML = '';
    if (products.length === 0) {
      container.innerHTML = `
        <div style="text-align: center; padding: 48px 16px; color: var(--text-muted);">
          <div style="font-size: 2.5rem; margin-bottom: 8px;">❤️</div>
          <h4 style="color: var(--text-main);">No saved systems</h4>
          <p style="font-size: 0.85rem; margin-top: 4px;">Click the heart icon on any product to save it here.</p>
        </div>
      `;
      return;
    }

    products.forEach(p => {
      const row = document.createElement('div');
      row.className = 'cart-item-card';
      row.innerHTML = `
        <div class="cart-item-thumbnail">
          <img src="${p.image}" alt="${this.escapeHTML(p.name)}">
        </div>
        <div class="cart-item-info">
          <h4 class="cart-item-title-text">${this.escapeHTML(p.name)}</h4>
          <div class="cart-item-model-text">${this.escapeHTML(p.modelNo)}</div>
          <div style="font-size: 0.8rem; font-weight: 700; color: #059669; margin-bottom: 6px;">💬 Price on Quote</div>
          <div style="display: flex; gap: 8px; margin-top: 8px;">
            <button class="cart-order-btn" style="padding: 4px 10px; font-size: 0.75rem;" data-move="${p.id}">+ Add to Order</button>
            <button class="cart-trash-btn" data-unwish="${p.id}">✕</button>
          </div>
        </div>
      `;

      row.querySelector(`[data-move="${p.id}"]`).addEventListener('click', () => {
        window.cartManager.addItem(p, 1);
        window.cartManager.toggleWishlist(p.id);
        this.showToast(`Moved "${p.name}" to Order List!`, 'success');
        this.renderWishlistDrawer();
      });

      row.querySelector(`[data-unwish="${p.id}"]`).addEventListener('click', () => {
        window.cartManager.toggleWishlist(p.id);
        this.renderWishlistDrawer();
        this.renderProducts();
        this.showToast('Removed from saved items', 'info');
      });

      container.appendChild(row);
    });
  },

  // --- Badge Counts ---
  updateBadges() {
    const totals = window.cartManager.getTotals();
    const countEl = document.getElementById('header-cart-count');
    const wishEl = document.getElementById('header-wishlist-count');
    const phoneEl = document.getElementById('topbar-whatsapp-number');

    if (countEl) countEl.textContent = totals.totalUnits;
    if (wishEl) wishEl.textContent = window.cartManager.wishlist.length;
    if (phoneEl) phoneEl.textContent = `+${window.cartManager.getWhatsAppNumber()}`;
  },

  // --- Modals Setup ---
  initModals() {
    const qvModal = document.getElementById('product-specs-modal');
    if (qvModal) {
      qvModal.addEventListener('click', (e) => {
        if (e.target === qvModal || e.target.classList.contains('modal-dismiss-btn')) {
          this.closeProductModal();
        }
      });
    }

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeProductModal();
        this.closeCartDrawer();
        this.closeWishlistDrawer();
        document.getElementById('order-submission-modal')?.classList.remove('active');
        document.getElementById('order-confirmed-modal')?.classList.remove('active');
        document.getElementById('admin-portal-modal')?.classList.remove('active');
        document.getElementById('settings-config-modal')?.classList.remove('active');
      }
    });
  },

  // --- Order Submission (WhatsApp Staging) ---
  initOrderSubmission() {
    const proceedBtn = document.getElementById('btn-drawer-proceed-whatsapp');
    const orderModal = document.getElementById('order-submission-modal');
    const orderForm = document.getElementById('marketplace-order-form');
    const confirmedModal = document.getElementById('order-confirmed-modal');

    if (proceedBtn && orderModal) {
      proceedBtn.addEventListener('click', () => {
        this.closeCartDrawer();
        const totals = window.cartManager.getTotals();
        document.getElementById('form-summary-units').textContent = `${totals.totalUnits} Units (${totals.totalItems} Items)`;
        orderModal.classList.add('active');
      });
    }

    document.querySelectorAll('.order-form-dismiss').forEach(btn => {
      btn.addEventListener('click', () => {
        orderModal?.classList.remove('active');
        confirmedModal?.classList.remove('active');
      });
    });

    if (orderForm) {
      orderForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const customer = {
          name: document.getElementById('cust-name').value.trim(),
          phone: document.getElementById('cust-phone').value.trim(),
          company: document.getElementById('cust-company').value.trim(),
          address: document.getElementById('cust-city').value.trim(),
          deliveryType: document.querySelector('input[name="delivery_pref"]:checked')?.value || 'Standard Courier Dispatch',
          notes: document.getElementById('cust-notes').value.trim()
        };

        const waUrl = window.cartManager.getOrderWhatsAppUrl(customer);
        const logged = window.cartManager.logOrderInquiry(customer);

        orderModal.classList.remove('active');
        window.open(waUrl, '_blank');

        document.getElementById('conf-ref-id').textContent = logged.orderId;
        document.getElementById('conf-cust-name').textContent = customer.name;
        document.getElementById('conf-cust-phone').textContent = customer.phone;
        document.getElementById('conf-cust-dest').textContent = customer.address;
        document.getElementById('conf-manual-wa-link').href = waUrl;

        confirmedModal.classList.add('active');
        this.showToast(`Order sent! WhatsApp conversation opened.`, 'success');
      });
    }
  },

  showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast-pill toast-${type}`;
    toast.innerHTML = `<span>${type === 'success' ? '✓' : 'ℹ'}</span> <span>${this.escapeHTML(message)}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(8px)';
      setTimeout(() => toast.remove(), 250);
    }, 3200);
  },

  escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str || '';
    return div.innerHTML;
  }
};

window.RanilPortal = RanilPortal;
