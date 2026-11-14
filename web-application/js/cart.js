/* ==========================================================================
   Ranil Systems - Cart, Quote & Order Storage Engine
   Zero-Price Mode, Order Inquiries Persistence & Order Management Methods
   ========================================================================== */

const CART_STORAGE_KEY = 'ranil_quote_cart';
const WISHLIST_STORAGE_KEY = 'ranil_wishlist';
const INQUIRIES_STORAGE_KEY = 'ranil_inquiries_log';
const CONFIG_STORAGE_KEY = 'ranil_user_config';

const DEFAULT_ORDERS_LOG = [
  {
    orderId: 'RS-748291',
    createdAt: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
    status: 'Pending',
    customer: {
      name: 'Ramesh Kumar',
      phone: '919820112345',
      company: 'Apex Security Solutions',
      address: 'Andheri East, Mumbai, Maharashtra',
      deliveryType: 'Standard Courier Dispatch',
      notes: 'Need official GST tax invoice and delivery by Tuesday.'
    },
    items: [
      {
        name: 'Ranil Pro 4K Ultra-HD Smart AI IP Dome Camera',
        modelNo: 'RS-IPC-4K-DOME',
        color: 'Vandal Matte White',
        size: '4.0mm Standard (88° FOV)',
        image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=600&q=80',
        quantity: 2
      },
      {
        name: 'Ranil Sentinel 16-Channel 4K AI NVR with 16 PoE Ports',
        modelNo: 'RS-NVR-16P-4K',
        color: 'Industrial Matte Black',
        size: '16-Channel PoE (200W Budget)',
        image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=600&q=80',
        quantity: 1
      }
    ],
    totals: { totalItems: 2, totalUnits: 3 }
  },
  {
    orderId: 'RS-619283',
    createdAt: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
    status: 'Quoted',
    customer: {
      name: 'Anand Patel',
      phone: '919879567890',
      company: 'Patel IT Networks',
      address: 'SG Highway, Ahmedabad, Gujarat',
      deliveryType: 'Urgent / Priority Express',
      notes: 'Please quote best volume pricing for urgent office deployment.'
    },
    items: [
      {
        name: 'Ranil Core 24-Port Gigabit Managed PoE+ Switch with 4x 10G SFP+',
        modelNo: 'RS-SW-24P-POE-370W',
        color: '19-inch 1U Rackmount Black',
        size: '370W Total PoE Budget',
        image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80',
        quantity: 1
      },
      {
        name: 'Ranil WavePro Wi-Fi 6 AX3000 Dual-Band Enterprise Access Point',
        modelNo: 'RS-AP-AX3000-PRO',
        color: 'Clean Architectural White',
        size: 'Single Unit Pack',
        image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
        quantity: 4
      }
    ],
    totals: { totalItems: 2, totalUnits: 5 }
  },
  {
    orderId: 'RS-582104',
    createdAt: new Date(Date.now() - 26 * 3600 * 1000).toISOString(),
    status: 'Delivered',
    customer: {
      name: 'Suresh Reddy',
      phone: '919848054321',
      company: 'Reddy Engineering Labs',
      address: 'Hitech City, Hyderabad, Telangana',
      deliveryType: 'Delivery + On-Site Installation',
      notes: 'Server room power backup replacement.'
    },
    items: [
      {
        name: 'Ranil PowerGuard 3000VA Online Double-Conversion Pure Sine Wave UPS',
        modelNo: 'RS-UPS-3KVA-ONL',
        color: 'Tower Chassis',
        size: 'Standard Internal Battery Bank',
        image: 'https://images.unsplash.com/photo-1629654297299-c8506221ca97?auto=format&fit=crop&w=600&q=80',
        quantity: 1
      }
    ],
    totals: { totalItems: 1, totalUnits: 1 }
  }
];

class CartManager {
  constructor() {
    this.cartItems = [];
    this.wishlist = [];
    this.userConfig = {
      whatsappNumber: window.RANIL_CONFIG?.defaultWhatsApp || '919876543210'
    };
    this.listeners = [];
    this.loadState();
  }

  loadState() {
    try {
      const storedConfig = localStorage.getItem(CONFIG_STORAGE_KEY);
      if (storedConfig) {
        this.userConfig = { ...this.userConfig, ...JSON.parse(storedConfig) };
      }

      const storedCart = localStorage.getItem(CART_STORAGE_KEY);
      if (storedCart) {
        try {
          const parsed = JSON.parse(storedCart);
          // Purge any legacy demo item (cartItemId: item-demo-1)
          this.cartItems = Array.isArray(parsed) ? parsed.filter(i => i && i.cartItemId !== 'item-demo-1') : [];
        } catch (e) {
          this.cartItems = [];
        }
      } else {
        this.cartItems = [];
      }

      const storedWishlist = localStorage.getItem(WISHLIST_STORAGE_KEY);
      if (storedWishlist) {
        try {
          const parsed = JSON.parse(storedWishlist);
          // Purge legacy demo seed ['rs-net-01'] if user hasn't explicitly customized wishlist
          if (Array.isArray(parsed) && parsed.length === 1 && parsed[0] === 'rs-net-01' && !localStorage.getItem('ranil_wishlist_customized')) {
            this.wishlist = [];
          } else {
            this.wishlist = Array.isArray(parsed) ? parsed : [];
          }
        } catch (e) {
          this.wishlist = [];
        }
      } else {
        this.wishlist = [];
      }

      // Sync cleaned empty state back to localStorage
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(this.cartItems));
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(this.wishlist));

      // Initialize orders log if empty
      if (!localStorage.getItem(INQUIRIES_STORAGE_KEY)) {
        localStorage.setItem(INQUIRIES_STORAGE_KEY, JSON.stringify(DEFAULT_ORDERS_LOG));
      }
    } catch (e) {
      console.error('Failed to load cart/wishlist state', e);
      this.cartItems = [];
      this.wishlist = [];
    }
  }

  saveCart() {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(this.cartItems));
      this.notify();
    } catch (e) {
      console.error('Failed to save cart', e);
    }
  }

  saveWishlist() {
    try {
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(this.wishlist));
      this.notify();
    } catch (e) {
      console.error('Failed to save wishlist', e);
    }
  }

  saveConfig(newConfig) {
    this.userConfig = { ...this.userConfig, ...newConfig };
    localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(this.userConfig));
    this.notify();
  }

  getWhatsAppNumber() {
    return this.userConfig.whatsappNumber || window.RANIL_CONFIG.defaultWhatsApp;
  }

  subscribe(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback);
    };
  }

  notify() {
    this.listeners.forEach(cb => {
      try { cb(); } catch (err) { console.error(err); }
    });
  }

  addItem(product, quantity = 1, color = null, size = null) {
    const chosenColor = color || (product.colors ? product.colors[0] : 'Standard');
    const chosenSize = size || (product.sizes ? product.sizes[0] : 'Standard');

    const existingIndex = this.cartItems.findIndex(
      item => item.productId === product.id && item.color === chosenColor && item.size === chosenSize
    );

    if (existingIndex > -1) {
      this.cartItems[existingIndex].quantity += quantity;
    } else {
      this.cartItems.push({
        cartItemId: 'ci-' + Date.now().toString(36) + Math.random().toString(36).substr(2, 4),
        productId: product.id,
        name: product.name,
        modelNo: product.modelNo || 'N/A',
        color: chosenColor,
        size: chosenSize,
        image: product.image || '',
        quantity: quantity
      });
    }

    this.saveCart();
  }

  updateQuantity(cartItemId, delta) {
    const item = this.cartItems.find(i => i.cartItemId === cartItemId);
    if (!item) return;

    item.quantity += delta;
    if (item.quantity <= 0) {
      this.removeItem(cartItemId);
    } else {
      this.saveCart();
    }
  }

  removeItem(cartItemId) {
    this.cartItems = this.cartItems.filter(i => i.cartItemId !== cartItemId);
    this.saveCart();
  }

  clearCart() {
    this.cartItems = [];
    this.saveCart();
  }

  getTotals() {
    const totalUnits = this.cartItems.reduce((acc, item) => acc + item.quantity, 0);
    return {
      totalItems: this.cartItems.length,
      totalUnits
    };
  }

  toggleWishlist(productId) {
    try {
      localStorage.setItem('ranil_wishlist_customized', 'true');
    } catch (e) {}
    const idx = this.wishlist.indexOf(productId);
    let added = false;
    if (idx > -1) {
      this.wishlist.splice(idx, 1);
      added = false;
    } else {
      this.wishlist.push(productId);
      added = true;
    }
    this.saveWishlist();
    return added;
  }

  isWishlisted(productId) {
    return this.wishlist.includes(productId);
  }

  // --- WhatsApp URL Builders ---

  getProductInquiryWhatsAppUrl(product, variantColor = '', variantSize = '') {
    const phone = this.getWhatsAppNumber();
    
    let text = `👋 *Hello Ranil Systems!*\n`;
    text += `I am inquiring about this product from your web portal:\n\n`;
    text += `📌 *Product:* ${product.name}\n`;
    text += `🔖 *Model No:* ${product.modelNo || 'N/A'}\n`;
    if (variantColor || variantSize) {
      text += `⚙️ *Configuration:* ${[variantColor, variantSize].filter(Boolean).join(' | ')}\n`;
    }
    text += `\n💬 *My Request:* Please share current stock availability, price quotation, and delivery schedule to my address.\n`;
    text += `\n_Sent via RanilSystems Web Portal_`;

    return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
  }

  getOrderWhatsAppUrl(customer) {
    const phone = this.getWhatsAppNumber();
    const totals = this.getTotals();

    let text = `🚨 *NEW ORDER & QUOTE REQUEST — RANIL SYSTEMS*\n`;
    text += `━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
    text += `👤 *Customer Details:*\n`;
    text += `• *Name:* ${customer.name || 'Not provided'}\n`;
    text += `• *Phone / WhatsApp:* ${customer.phone || 'Not provided'}\n`;
    if (customer.company) {
      text += `• *Company / Firm:* ${customer.company}\n`;
    }
    text += `• *Delivery City & State:* ${customer.address || 'Not provided'}\n`;
    text += `• *Delivery Requirement:* ${customer.deliveryType || 'Standard Courier Dispatch'}\n`;
    if (customer.notes) {
      text += `• *Customer Notes:* ${customer.notes}\n`;
    }

    text += `\n📦 *Requested Products (${this.cartItems.length} items, ${totals.totalUnits} units):*\n`;
    this.cartItems.forEach((item, index) => {
      text += `${index + 1}. *${item.name}* (Qty: ${item.quantity})\n`;
      text += `   - Model: ${item.modelNo}\n`;
      text += `   - Variant: ${item.color}${item.size ? ' / ' + item.size : ''}\n`;
    });

    text += `━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
    text += `💬 *Customer Request:* "Please review this order list and reply with your official quotation, best bulk discounts, and confirmed dispatch/delivery timeline."\n`;
    text += `━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
    text += `_Sent via RanilSystems Web Portal (Order ID: RS-${Date.now().toString(36).toUpperCase()})_`;

    return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
  }

  // --- Orders Logging & Admin Management ---

  logOrderInquiry(customer) {
    const totals = this.getTotals();
    const cleanPhone = (customer.phone || '').replace(/[^0-9]/g, '');

    const inquiry = {
      orderId: 'RS-' + Math.floor(100000 + Math.random() * 900000),
      createdAt: new Date().toISOString(),
      customer: {
        ...customer,
        phoneClean: cleanPhone
      },
      items: [...this.cartItems],
      totals,
      status: 'Pending'
    };

    try {
      const stored = localStorage.getItem(INQUIRIES_STORAGE_KEY);
      const list = stored ? JSON.parse(stored) : [];
      list.unshift(inquiry);
      localStorage.setItem(INQUIRIES_STORAGE_KEY, JSON.stringify(list));
    } catch (e) {
      console.error(e);
    }

    return inquiry;
  }

  getAllOrders() {
    try {
      const stored = localStorage.getItem(INQUIRIES_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [...DEFAULT_ORDERS_LOG];
    } catch (e) {
      return [...DEFAULT_ORDERS_LOG];
    }
  }

  updateOrderStatus(orderId, newStatus) {
    try {
      const orders = this.getAllOrders();
      const idx = orders.findIndex(o => o.orderId === orderId);
      if (idx !== -1) {
        orders[idx].status = newStatus;
        localStorage.setItem(INQUIRIES_STORAGE_KEY, JSON.stringify(orders));
        this.notify();
        return orders[idx];
      }
    } catch (e) {
      console.error(e);
    }
    return null;
  }

  deleteOrder(orderId) {
    try {
      const orders = this.getAllOrders();
      const filtered = orders.filter(o => o.orderId !== orderId);
      localStorage.setItem(INQUIRIES_STORAGE_KEY, JSON.stringify(filtered));
      this.notify();
    } catch (e) {
      console.error(e);
    }
  }

  // Generate WhatsApp message from Owner to Customer with Quotation
  getReplyToCustomerWhatsAppUrl(order) {
    const customerPhone = order.customer.phoneClean || order.customer.phone.replace(/[^0-9]/g, '');
    
    let text = `👋 *Hello ${order.customer.name}!* (Ref: *${order.orderId}*)\n`;
    text += `Thank you for choosing *Ranil Systems*.\n\n`;
    text += `We have reviewed your requested equipment list:\n`;
    order.items.forEach((item, idx) => {
      text += `• ${item.name} (${item.modelNo}) x${item.quantity}\n`;
    });
    text += `\n📍 *Delivery Location:* ${order.customer.address}\n\n`;
    text += `💰 *Official Quotation & Delivery Schedule:*\n`;
    text += `• Total Quoted Price (including GST): [ENTER PRICE]\n`;
    text += `• Estimated Delivery Date: [ENTER DELIVERY DATE]\n`;
    text += `• Warranty: Official 100% Ranil Systems OEM Warranty\n\n`;
    text += `Please reply to confirm this order so we can dispatch your parcel.\n`;
    text += `_Ranil Systems Enterprise Team_`;

    return `https://wa.me/${customerPhone}?text=${encodeURIComponent(text)}`;
  }
}

window.cartManager = new CartManager();
