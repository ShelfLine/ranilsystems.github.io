# Ranil Systems — Enterprise Hardware Marketplace & Dedicated Admin Portal

A custom commercial web portal engineered for **Ranil Systems** where customers explore enterprise surveillance and networking hardware, view detailed technical specifications, build an order list, and transmit inquiries and orders directly to your business WhatsApp without visible online prices.

Includes a **Dedicated Standalone Admin Portal (`admin.html`)** with an Order Tracking Dashboard (KPIs for Pending & Received Orders) and a Camera Upload Studio.

---

## 🌟 Key Features

### 1. 🚫 Zero-Price Customer Experience (100% WhatsApp Quotation Model)
- **No prices are shown to customers**: Every product card, specs sheet, and order staging list shows **"💬 Price on WhatsApp Quote"**.
- Custom wholesale quotes, GST invoices, and delivery schedules are provided directly by you to the customer on WhatsApp.
- Eliminates fixed price rigidity so you can quote based on customer quantity and delivery location.

### 2. 📊 Dedicated Standalone Admin Portal (`admin.html`)
Open [admin.html](file:///d:/Cloude/web-application/admin.html) or navigate from the store:
- **Order Tracking Dashboard**:
  - **KPI Metrics Counters**:
    - 📦 **Total Orders Received**: All customer inquiries logged across the site.
    - ⏳ **Pending Quotes**: Inquiries awaiting your price and delivery timeline.
    - 💬 **Quoted on WhatsApp**: Orders where quotation was sent to customer.
    - ✅ **Delivered & Closed**: Successfully fulfilled orders.
  - **Filter Chips**: View `All`, `Pending Quotes`, `Quoted`, `Dispatched`, `Delivered`, `Cancelled`.
  - **Live Search**: Search orders by Order ID, Customer name, Phone, or City.
  - **Customer Details**: View customer name, WhatsApp number, delivery city & state, urgency tier, and special notes.
  - **1-Click WhatsApp Reply**: Tap **"Send Quotation & Delivery Date on WhatsApp"** to open a pre-formatted quotation message directly in the customer's WhatsApp chat with placeholders for price and delivery date!
  - **Status Updates**: Change order status on the fly with live updates to KPI counters.

### 3. 📷 Camera & System Upload Studio
- Located in the Admin Portal under **"Upload New Camera"**:
  - **Photo Upload**: Drag-and-drop or choose any photo from your phone/computer (with instant thumbnail preview), or paste an image URL.
  - **Camera Specifications**:
    - Camera Name & Model Number (`RS-IPC-XXXX`)
    - Category (CCTV & Surveillance, Networking, Power & UPS, Access Control, IoT & Cables)
    - Stock Availability status
    - Marketing badge tags and bullet highlights
    - Technical Specifications matrix (Resolution, Sensor, Lens, Night Vision, PoE, Warranty)
    - Overview and description
  - **Publish in 1 click**: The new camera immediately appears in the customer store and saves persistently in `localStorage`.

### 4. 📋 Active Inventory & Catalog Manager
- View all active products in the Ranil Systems store.
- Delete individual products or click **"🔄 Reset to Defaults"** anytime.

### 5. ⚙️ Business WhatsApp Phone Settings
- Configure the business WhatsApp phone number that receives all incoming orders and inquiries.
- Saves automatically in browser storage.

---

## 📁 File Structure

```text
web-application/
├── index.html        # Customer-facing store (Zero prices, WhatsApp order builder)
├── admin.html        # Standalone Admin Portal (KPIs, Order Tracking & Camera Uploader)
├── css/
│   └── style.css     # Clean marketplace light theme, KPI cards, order cards & dropzone
├── js/
│   ├── products.js   # Catalog manager with persistent CRUD & default systems
│   ├── cart.js       # Zero-price order list, WhatsApp message builders & order logger
│   ├── app.js        # Customer store controller (search, filters, cart, order submission)
│   └── admin.js      # Dedicated Admin controller (KPIs, filters, order statuses, uploader)
├── server.js         # Built-in zero-dependency Node.js HTTP server
├── package.json      # Project metadata & scripts
└── README.md         # Documentation
```

---

## 🏃 How to Run & Preview

### Local Server (Currently running on Port 3000):
- **Customer Web Application**: [http://localhost:3000](http://localhost:3000) or [index.html](file:///d:/Cloude/web-application/index.html)
- **Admin Orders & Camera Portal**: [http://localhost:3000/admin.html](http://localhost:3000/admin.html) or [admin.html](file:///d:/Cloude/web-application/admin.html)

To restart the server at any time:
```powershell
cd web-application
node server.js
```
