/* ==========================================================================
   Ranil Systems - Admin & Business Portal Controller
   Orders Tracking Dashboard, Camera Uploader & Inventory Management
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  AdminApp.init();
});

const AdminApp = {
  currentTab: 'orders',
  activeOrderFilter: 'all',
  orderSearchQuery: '',
  tempUploadImageData: null,

  init() {
    this.initTabs();
    this.initOrdersHub();
    this.initCameraUploader();
    this.initInventoryManager();
    this.initSettings();
    this.renderAll();

    // Subscribe to cart & catalog updates
    window.cartManager.subscribe(() => {
      this.renderOrdersHub();
    });

    console.log('⚡ Ranil Systems Admin Portal active.');
  },

  // --- Tab Navigation ---
  initTabs() {
    const tabs = document.querySelectorAll('.admin-nav-tab');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const target = tab.dataset.tab;
        this.switchTab(target);
      });
    });
  },

  switchTab(tabId) {
    this.currentTab = tabId;

    // Update active tab buttons
    document.querySelectorAll('.admin-nav-tab').forEach(tab => {
      tab.classList.toggle('active', tab.dataset.tab === tabId);
    });

    // Update active views
    document.querySelectorAll('.admin-tab-view').forEach(view => {
      view.classList.toggle('active', view.id === `tab-${tabId}`);
    });

    if (tabId === 'orders') {
      this.renderOrdersHub();
    } else if (tabId === 'inventory') {
      this.renderInventoryTable();
    }
  },

  renderAll() {
    this.renderOrdersHub();
    this.renderInventoryTable();
  },

  // =========================================================================
  // 1. ORDERS TRACKING DASHBOARD
  // =========================================================================
  initOrdersHub() {
    // Filter buttons (All, Pending, Quoted, Delivered)
    const filterBtns = document.querySelectorAll('.order-filter-chip');
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.activeOrderFilter = btn.dataset.status || 'all';
        this.renderOrdersHub();
      });
    });

    // Search orders
    const searchInput = document.getElementById('admin-order-search');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.orderSearchQuery = e.target.value.toLowerCase().trim();
        this.renderOrdersHub();
      });
    }
  },

  renderOrdersHub() {
    const allOrders = window.cartManager.getAllOrders();
    const listContainer = document.getElementById('admin-orders-list');
    if (!listContainer) return;

    // Calculate KPI Stats
    const totalOrders = allOrders.length;
    const pendingOrders = allOrders.filter(o => o.status === 'Pending').length;
    const quotedOrders = allOrders.filter(o => o.status === 'Quoted').length;
    const deliveredOrders = allOrders.filter(o => o.status === 'Delivered').length;

    // Update KPI Badges
    const elTotal = document.getElementById('kpi-total-orders');
    const elPending = document.getElementById('kpi-pending-orders');
    const elQuoted = document.getElementById('kpi-quoted-orders');
    const elDelivered = document.getElementById('kpi-delivered-orders');
    const pendingNavBadge = document.getElementById('nav-pending-badge');

    if (elTotal) elTotal.textContent = totalOrders;
    if (elPending) elPending.textContent = pendingOrders;
    if (elQuoted) elQuoted.textContent = quotedOrders;
    if (elDelivered) elDelivered.textContent = deliveredOrders;
    if (pendingNavBadge) {
      pendingNavBadge.textContent = pendingOrders;
      pendingNavBadge.style.display = pendingOrders > 0 ? 'inline-flex' : 'none';
    }

    // Filter orders
    let filtered = allOrders.filter(order => {
      const matchFilter = this.activeOrderFilter === 'all' || order.status === this.activeOrderFilter;
      const matchSearch = !this.orderSearchQuery || 
        order.orderId.toLowerCase().includes(this.orderSearchQuery) ||
        (order.customer.name && order.customer.name.toLowerCase().includes(this.orderSearchQuery)) ||
        (order.customer.phone && order.customer.phone.includes(this.orderSearchQuery)) ||
        (order.customer.address && order.customer.address.toLowerCase().includes(this.orderSearchQuery));

      return matchFilter && matchSearch;
    });

    listContainer.innerHTML = '';

    if (filtered.length === 0) {
      listContainer.innerHTML = `
        <div class="empty-state-card">
          <div style="font-size: 2.5rem; margin-bottom: 8px;">📭</div>
          <h3>No Orders Found</h3>
          <p style="color: var(--text-dim); font-size: 0.85rem; margin-top: 4px;">
            ${this.activeOrderFilter === 'all' ? 'No customer orders have been received yet.' : `No orders currently matching status "${this.activeOrderFilter}".`}
          </p>
        </div>
      `;
      return;
    }

    filtered.forEach(order => {
      listContainer.appendChild(this.createOrderCard(order));
    });
  },

  createOrderCard(order) {
    const card = document.createElement('div');
    card.className = `admin-order-card status-${(order.status || 'pending').toLowerCase()}`;
    card.dataset.orderId = order.orderId;

    const timeAgo = this.formatTimeAgo(order.createdAt);
    const replyWaUrl = window.cartManager.getReplyToCustomerWhatsAppUrl(order);

    // Items list
    const itemsHtml = order.items.map(item => `
      <div class="order-item-row">
        <div class="order-item-thumb">
          <img src="${item.image || 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=600&q=80'}" alt="${this.escapeHTML(item.name)}">
        </div>
        <div class="order-item-meta">
          <div class="order-item-name">${this.escapeHTML(item.name)}</div>
          <div class="order-item-spec">Model: <strong>${this.escapeHTML(item.modelNo)}</strong> · ${this.escapeHTML(item.color || 'Standard')}</div>
        </div>
        <div class="order-item-qty">Qty: <strong>${item.quantity}</strong></div>
      </div>
    `).join('');

    card.innerHTML = `
      <div class="order-card-header">
        <div class="order-header-left">
          <span class="order-ref-badge">${this.escapeHTML(order.orderId)}</span>
          <span class="order-time-text">🕒 ${timeAgo}</span>
        </div>

        <div class="order-status-controller">
          <label style="font-size: 0.75rem; font-weight: 700; color: var(--text-dim);">Status:</label>
          <select class="order-status-select select-${(order.status || 'pending').toLowerCase()}" data-status-for="${order.orderId}">
            <option value="Pending" ${order.status === 'Pending' ? 'selected' : ''}>⏳ Pending Quote</option>
            <option value="Quoted" ${order.status === 'Quoted' ? 'selected' : ''}>💬 Quoted on WhatsApp</option>
            <option value="Dispatched" ${order.status === 'Dispatched' ? 'selected' : ''}>🚚 Dispatched / In Transit</option>
            <option value="Delivered" ${order.status === 'Delivered' ? 'selected' : ''}>✅ Delivered / Completed</option>
            <option value="Cancelled" ${order.status === 'Cancelled' ? 'selected' : ''}>✕ Cancelled</option>
          </select>
        </div>
      </div>

      <div class="order-card-body">
        <!-- Customer Info Box -->
        <div class="order-customer-box">
          <div class="customer-info-line">
            <span class="info-label">Customer:</span>
            <strong class="info-val">${this.escapeHTML(order.customer.name || 'N/A')}</strong>
          </div>
          <div class="customer-info-line">
            <span class="info-label">WhatsApp / Phone:</span>
            <span class="info-val font-mono">📱 ${this.escapeHTML(order.customer.phone || 'N/A')}</span>
          </div>
          ${order.customer.company ? `
            <div class="customer-info-line">
              <span class="info-label">Company:</span>
              <span class="info-val">${this.escapeHTML(order.customer.company)}</span>
            </div>
          ` : ''}
          <div class="customer-info-line">
            <span class="info-label">Delivery Destination:</span>
            <span class="info-val">📍 ${this.escapeHTML(order.customer.address || 'N/A')}</span>
          </div>
          <div class="customer-info-line">
            <span class="info-label">Delivery Urgency:</span>
            <span class="info-val badge-delivery-type">${this.escapeHTML(order.customer.deliveryType || 'Standard')}</span>
          </div>
          ${order.customer.notes ? `
            <div class="customer-info-line" style="margin-top: 6px; background: var(--bg-surface); padding: 6px 10px; border-radius: var(--radius-xs);">
              <span class="info-label">Customer Note:</span>
              <span class="info-val" style="color: var(--text-main); font-style: italic;">"${this.escapeHTML(order.customer.notes)}"</span>
            </div>
          ` : ''}
        </div>

        <!-- Items Requested Box -->
        <div class="order-items-container">
          <div style="font-size: 0.775rem; font-weight: 800; text-transform: uppercase; color: var(--text-dim); margin-bottom: 8px;">
            Requested Equipment (${order.totals ? order.totals.totalUnits : order.items.length} Units):
          </div>
          ${itemsHtml}
        </div>
      </div>

      <div class="order-card-actions">
        <!-- Message Customer Button -->
        <a class="btn-action-whatsapp" href="${replyWaUrl}" target="_blank" rel="noopener">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z"/>
          </svg>
          <span>Send Quotation & Delivery Date on WhatsApp</span>
        </a>

        <div style="display: flex; gap: 8px;">
          <button class="btn-action-secondary" data-mark-quoted="${order.orderId}" title="Mark as Quoted">
            ✓ Mark Quoted
          </button>
          <button class="btn-action-danger" data-del-order="${order.orderId}" title="Delete Order">
            🗑️
          </button>
        </div>
      </div>
    `;

    // Status dropdown change
    const statusSelect = card.querySelector('.order-status-select');
    statusSelect.addEventListener('change', (e) => {
      const newStatus = e.target.value;
      window.cartManager.updateOrderStatus(order.orderId, newStatus);
      this.showToast(`Order ${order.orderId} marked as ${newStatus}`, 'info');
      this.renderOrdersHub();
    });

    // Mark as quoted quick button
    const markQuotedBtn = card.querySelector(`[data-mark-quoted="${order.orderId}"]`);
    markQuotedBtn.addEventListener('click', () => {
      window.cartManager.updateOrderStatus(order.orderId, 'Quoted');
      this.showToast(`Order ${order.orderId} marked as Quoted`, 'success');
      this.renderOrdersHub();
    });

    // Delete order
    const delBtn = card.querySelector(`[data-del-order="${order.orderId}"]`);
    delBtn.addEventListener('click', () => {
      if (confirm(`Delete order ${order.orderId} from log?`)) {
        window.cartManager.deleteOrder(order.orderId);
        this.showToast(`Order ${order.orderId} removed`, 'info');
        this.renderOrdersHub();
      }
    });

    return card;
  },

  formatTimeAgo(isoString) {
    if (!isoString) return 'Just now';
    const diffMs = Date.now() - new Date(isoString).getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min${diffMins === 1 ? '' : 's'} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`;
    return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`;
  },

  // =========================================================================
  // 2. CAMERA & SYSTEM UPLOAD STUDIO
  // =========================================================================
  initCameraUploader() {
    const form = document.getElementById('camera-upload-form');
    const fileInput = document.getElementById('cam-file-input');
    const dropzone = document.getElementById('cam-dropzone');
    const previewImg = document.getElementById('cam-preview-img');

    if (fileInput && previewImg) {
      fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (event) => {
            this.tempUploadImageData = event.target.result;
            previewImg.src = event.target.result;
            previewImg.style.display = 'block';
          };
          reader.readAsDataURL(file);
        }
      });
    }

    if (dropzone && fileInput) {
      dropzone.addEventListener('click', () => fileInput.click());
      dropzone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropzone.classList.add('drag-active');
      });
      dropzone.addEventListener('dragleave', () => {
        dropzone.classList.remove('drag-active');
      });
      dropzone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropzone.classList.remove('drag-active');
        const file = e.dataTransfer.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (event) => {
            this.tempUploadImageData = event.target.result;
            if (previewImg) {
              previewImg.src = event.target.result;
              previewImg.style.display = 'block';
            }
          };
          reader.readAsDataURL(file);
        }
      });
    }

    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('cam-name').value.trim();
        const modelNo = document.getElementById('cam-model').value.trim();
        const category = document.getElementById('cam-category').value;
        const stockStatus = document.getElementById('cam-stock').value;
        const badge = document.getElementById('cam-badge').value.trim();
        const desc = document.getElementById('cam-desc').value.trim();
        const imgUrl = document.getElementById('cam-img-url').value.trim();

        const finalImage = this.tempUploadImageData || imgUrl || 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=600&q=80';

        const resolution = document.getElementById('cam-spec-res').value.trim() || '4K Ultra-HD';
        const sensor = document.getElementById('cam-spec-sensor').value.trim() || 'Progressive Scan CMOS';
        const lens = document.getElementById('cam-spec-lens').value.trim() || '2.8mm / 4.0mm Lens';
        const nightVision = document.getElementById('cam-spec-nv').value.trim() || '40m Dual-Light Smart IR';
        const power = document.getElementById('cam-spec-poe').value.trim() || 'PoE (802.3af) / 12V DC';
        const warranty = document.getElementById('cam-spec-warranty').value.trim() || '2 Years Replacement Warranty';

        const highlightsStr = document.getElementById('cam-highlights').value.trim();
        const highlights = highlightsStr 
          ? highlightsStr.split(',').map(s => s.trim()).filter(Boolean)
          : [`${resolution} High Definition`, nightVision, power, warranty];

        const categoryNames = {
          'cctv': 'CCTV Surveillance',
          'networking': 'Enterprise Networking',
          'power': 'Power & UPS Systems',
          'access': 'Access Control',
          'iot': 'IoT & Sensors'
        };

        const newProduct = {
          name,
          modelNo: modelNo || 'RS-CAM-' + Math.floor(100 + Math.random() * 900),
          category,
          categoryName: categoryNames[category] || 'CCTV Surveillance',
          badge: badge || 'New System',
          stockStatus: stockStatus || 'In Stock (Ready to Dispatch)',
          image: finalImage,
          description: desc || 'High-performance commercial surveillance hardware by Ranil Systems.',
          highlights,
          specs: {
            'Max Resolution': resolution,
            'Image Sensor': sensor,
            'Lens Specification': lens,
            'Night Vision': nightVision,
            'Power Input': power,
            'Warranty': warranty
          }
        };

        window.catalogManager.add(newProduct);

        form.reset();
        this.tempUploadImageData = null;
        if (previewImg) {
          previewImg.src = '';
          previewImg.style.display = 'none';
        }

        this.renderInventoryTable();
        this.showToast(`✓ Published "${name}" to store! 🚀`, 'success');

        // Switch to inventory view to show newly added item
        setTimeout(() => this.switchTab('inventory'), 600);
      });
    }
  },

  // =========================================================================
  // 3. INVENTORY & CATALOG MANAGER
  // =========================================================================
  initInventoryManager() {
    const resetBtn = document.getElementById('btn-reset-catalog');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        if (confirm('Reset catalog back to factory default products? Any custom uploaded cameras will be cleared.')) {
          window.catalogManager.resetDefaults();
          this.renderInventoryTable();
          this.showToast('Catalog restored to default systems', 'info');
        }
      });
    }
  },

  renderInventoryTable() {
    const tbody = document.getElementById('inventory-table-body');
    const totalCountEl = document.getElementById('inventory-total-count');
    if (!tbody) return;

    const products = window.catalogManager.getAll();
    if (totalCountEl) totalCountEl.textContent = `${products.length} Products`;

    tbody.innerHTML = '';
    products.forEach(p => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><img src="${p.image}" class="table-prod-thumb" alt="Thumb"></td>
        <td>
          <div style="font-weight: 700; color: var(--text-main);">${this.escapeHTML(p.name)}</div>
          <div style="font-size: 0.725rem; font-family: var(--font-mono); color: var(--brand-primary);">${this.escapeHTML(p.modelNo)}</div>
        </td>
        <td><span class="category-tag-pill">${this.escapeHTML(p.categoryName)}</span></td>
        <td><span style="font-size: 0.75rem; color: #059669; font-weight: 700;">${this.escapeHTML(p.stockStatus || 'In Stock')}</span></td>
        <td>
          <button class="btn-action-danger" data-del-cam="${p.id}" title="Delete Product">
            🗑️ Delete
          </button>
        </td>
      `;

      tr.querySelector(`[data-del-cam="${p.id}"]`).addEventListener('click', () => {
        if (confirm(`Are you sure you want to delete "${p.name}" from the store?`)) {
          window.catalogManager.delete(p.id);
          this.renderInventoryTable();
          this.showToast('Product deleted from catalog', 'info');
        }
      });

      tbody.appendChild(tr);
    });
  },

  // =========================================================================
  // 4. BUSINESS SETTINGS
  // =========================================================================
  initSettings() {
    const form = document.getElementById('admin-settings-form');
    const phoneInput = document.getElementById('admin-cfg-phone');

    if (phoneInput) {
      phoneInput.value = window.cartManager.getWhatsAppNumber();
    }

    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const digits = phoneInput.value.replace(/[^0-9]/g, '');
        if (!digits || digits.length < 8) {
          alert('Please enter a valid phone number with country code (e.g. 919876543210)');
          return;
        }

        window.cartManager.saveConfig({ whatsappNumber: digits });
        this.showToast(`Business WhatsApp updated to +${digits}`, 'success');
      });
    }
  },

  showToast(message, type = 'info') {
    const container = document.getElementById('admin-toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `admin-toast toast-${type}`;
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

window.AdminApp = AdminApp;
