/* ==========================================================================
   Ranil Systems - Products Catalog & Storage Manager
   Persistent LocalStorage CRUD, Image Uploads & Clean Specification Data
   ========================================================================== */

const RANIL_CONFIG = {
  companyName: 'Ranil Systems',
  tagline: 'Enterprise Surveillance, Networking & Industrial Power Solutions',
  defaultWhatsApp: '919876543210', 
  supportEmail: 'sales@ranilsystems.com',
  helpline: '+91 98765 43210',
  workingHours: 'Mon - Sat: 9:00 AM - 7:30 PM'
};

const DEFAULT_PRODUCTS = [
  // --- CCTV & Surveillance Cameras ---
  {
    id: 'rs-cctv-01',
    name: 'Ranil Pro 4K Ultra-HD Smart AI IP Dome Camera',
    category: 'cctv',
    categoryName: 'CCTV Surveillance',
    rating: 4.8,
    reviewsCount: 342,
    badge: 'Bestseller',
    modelNo: 'RS-IPC-4K-DOME',
    stockStatus: 'In Stock (Ready for Dispatch)',
    image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=600&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=600&q=80'
    ],
    description: 'Commercial 4K (8MP) AI network dome camera engineered for 24/7 crystal-clear perimeter security. Features advanced human/vehicle classification, smart dual-light color night vision up to 40 meters, built-in noise-cancelling microphone, and vandal-proof IP67 aluminum housing.',
    colors: ['Vandal Matte White', 'Charcoal Gunmetal'],
    sizes: ['2.8mm Ultra-Wide (108° FOV)', '4.0mm Standard (88° FOV)', '6.0mm Telephoto (54° FOV)'],
    highlights: [
      'True 4K (3840×2160) 8MP Ultra-HD @ 30fps Real-Time',
      'Smart Deep-Learning Human & Vehicle Detection (Zero False Alarms)',
      '40-Meter Smart Dual-Illuminator Color Night Vision',
      'Integrated Power over Ethernet (PoE 802.3af)',
      'Built-in Microphone & MicroSD slot (supports up to 512GB)'
    ],
    specs: {
      'Sensor Type': '1/2.8" Progressive Scan CMOS 8.0 Megapixel',
      'Max Resolution': '3840 x 2160 pixels @ 30fps',
      'Video Compression': 'H.265+ / H.265 / H.264+ / MJPEG',
      'Night Vision': 'Dual Light: Smart IR + Warm LED (40m / 130ft)',
      'Power Supply': 'PoE (802.3af) or 12V DC ± 25%',
      'Weather Resistance': 'IP67 Weatherproof & IK10 Vandal-Proof Metal',
      'Warranty': '2 Years Comprehensive Manufacturer Replacement'
    }
  },
  {
    id: 'rs-cctv-02',
    name: 'Ranil Sentinel 16-Channel 4K AI NVR with 16 PoE Ports',
    category: 'cctv',
    categoryName: 'CCTV Surveillance',
    rating: 4.9,
    reviewsCount: 198,
    badge: 'Enterprise Hub',
    modelNo: 'RS-NVR-16P-4K',
    stockStatus: 'In Stock (Direct Warehouse)',
    image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=600&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=600&q=80'
    ],
    description: 'Enterprise 16-channel 4K network video recorder with 16 independent plug-and-play PoE ports. Features dual 4K HDMI display outputs, supports up to 4 SATA hard drives (up to 40TB capacity), and instant remote mobile viewing via Ranil Cloud.',
    colors: ['Industrial Matte Black'],
    sizes: ['16-Channel PoE (200W Budget)', '32-Channel PoE (370W Budget)'],
    highlights: [
      '16 Independent Plug & Play PoE Network Ports',
      'H.265+ Ultra Video Compression (saves 75% HDD storage)',
      'Dual 4K HDMI & VGA Independent Video Outputs',
      'Supports 4 SATA Hard Disks up to 10TB each (40TB Max)',
      'Free Mobile App & Desktop PC CMS Software with P2P Cloud'
    ],
    specs: {
      'Channel Capacity': '16 IP Channels up to 12MP Resolution',
      'PoE Interfaces': '16x RJ45 10/100 Mbps with 802.3at/af',
      'Total PoE Budget': '200 Watts (Max 30W per port)',
      'Storage Interface': '4x SATA Ports (supports up to 40TB)',
      'Display Output': '1x HDMI (4K 3840x2160) + 1x VGA (1080p)',
      'Network Interface': '1x Gigabit LAN RJ45 1000Mbps',
      'Warranty': '3 Years Direct Warranty & Lifetime Software Support'
    }
  },
  {
    id: 'rs-cctv-03',
    name: 'Ranil Panther 5MP 30x Optical Zoom PTZ Speed Dome Camera',
    category: 'cctv',
    categoryName: 'CCTV Surveillance',
    rating: 4.8,
    reviewsCount: 114,
    badge: 'High Precision',
    modelNo: 'RS-PTZ-30X-5MP',
    stockStatus: 'In Stock (Factory Calibrated)',
    image: 'https://images.unsplash.com/photo-1582139329536-e7284fece509?auto=format&fit=crop&w=600&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1582139329536-e7284fece509?auto=format&fit=crop&w=600&q=80'
    ],
    description: 'High-speed 360° continuous pan PTZ speed dome camera equipped with a 30x optical zoom lens, intelligent auto-tracking of moving targets, and powerful laser IR illuminators reaching up to 150 meters in total darkness.',
    colors: ['Die-Cast Aluminum White'],
    sizes: ['Wall Mount Arm Bracket', 'Pole/Corner Mount Kit'],
    highlights: [
      '30x Optical Zoom Lens (4.5mm to 135mm Focal Length)',
      'Long-Range Laser IR Night Vision up to 150m (492ft)',
      '360° Endless High-Speed Pan & 90° Auto-Flip Tilt',
      'AI Smart Auto-Tracking with Human/Vehicle Target Filter',
      'IP66 Weatherproof with 6000V Lightning Surge Protection'
    ],
    specs: {
      'Sensor & Resolution': '1/2.8" Sony STARVIS CMOS 5.0 Megapixel (2592x1944)',
      'Optical Zoom': '30x Optical Zoom + 16x Digital Zoom',
      'Pan Speed': '0.1° to 300°/s Continuous 360° Pan',
      'Night Vision Range': 'High-power Laser IR up to 150m (492ft)',
      'Power Supply': 'Hi-PoE (60W) or 24V AC / 12V DC',
      'Housing': 'Heavy-duty Aluminum Alloy with Internal Fan/Heater',
      'Warranty': '2 Years Full Replacement Warranty'
    }
  },

  // --- Networking & Server Hardware ---
  {
    id: 'rs-net-01',
    name: 'Ranil Core 24-Port Gigabit Managed PoE+ Switch with 4x 10G SFP+',
    category: 'networking',
    categoryName: 'Enterprise Networking',
    rating: 4.9,
    reviewsCount: 265,
    badge: 'OEM Certified',
    modelNo: 'RS-SW-24P-POE-370W',
    stockStatus: 'In Stock (Enterprise Ready)',
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80'
    ],
    description: 'High-density Layer 2+ enterprise managed Gigabit switch featuring 24x PoE+ ports with 370W total power budget, plus 4 dedicated 10G SFP+ uplink ports for ultra-fast fiber connectivity. Complete with VLAN, QoS, IGMP snooping, and cloud web management.',
    colors: ['19-inch 1U Rackmount Black'],
    sizes: ['370W Total PoE Budget', '500W High-Density PoE Budget'],
    highlights: [
      '24 Gigabit 802.3at/af PoE+ Ports with 370W Power Budget',
      '4 Dedicated 10G SFP+ Fiber Uplinks (backward compatible with 1G SFP)',
      'Layer 2+ Enterprise Management (802.1Q VLAN, QoS, LACP, SNMP)',
      'Smart PoE Watchdog (Auto-detects and reboots frozen cameras/APs)',
      'Built-in 6kV Lightning Surge Protection on all Ethernet ports'
    ],
    specs: {
      'Port Configuration': '24x 10/100/1000M PoE+ RJ45 + 4x 10G SFP+ Slots',
      'Switching Capacity': '128 Gbps Non-Blocking Wire Speed',
      'Forwarding Rate': '95.23 Mpps',
      'PoE Standard': 'IEEE 802.3af/at (Max 30W per port, 370W Total)',
      'Management': 'Web GUI, CLI (Console/Telnet), SNMP v1/v2c/v3, RMON',
      'Form Factor': 'Standard 19-inch 1U Rackmount (Brackets Included)',
      'Warranty': '5 Years Enterprise Replacement Warranty'
    }
  },
  {
    id: 'rs-net-02',
    name: 'Ranil WavePro Wi-Fi 6 AX3000 Dual-Band Enterprise Access Point',
    category: 'networking',
    categoryName: 'Enterprise Networking',
    rating: 4.8,
    reviewsCount: 420,
    badge: 'Popular',
    modelNo: 'RS-AP-AX3000-PRO',
    stockStatus: 'In Stock (High Demand)',
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80'
    ],
    description: 'High-performance Wi-Fi 6 ceiling-mount enterprise access point delivering combined speeds up to 2976Mbps. Engineered for offices, schools, and retail spaces with high-density client capacity, seamless 802.11k/v/r roaming, and central cloud control.',
    colors: ['Clean Architectural White'],
    sizes: ['Single Unit Pack', '3-Pack Multi-Floor Bundle'],
    highlights: [
      'Wi-Fi 6 Dual-Band: 2402Mbps (5GHz) + 574Mbps (2.4GHz)',
      'Supports 250+ Concurrent Connected Mobile & Laptop Clients',
      'Seamless Mesh Roaming with 802.11k/v/r Fast Handover',
      'Gigabit PoE In Port (802.3at / 48V Passive PoE)',
      'Captive Guest Portal with SMS & Voucher Authentication'
    ],
    specs: {
      'Wireless Standard': 'Wi-Fi 6 (IEEE 802.11ax/ac/n/g/b/a)',
      'Max Speed': '2976 Mbps (Combined Dual-Band)',
      'Antenna': '4x High-Gain Internal Omnidirectional Antennas (5dBi)',
      'Ethernet Port': '1x Gigabit RJ45 10/100/1000Mbps with PoE',
      'Coverage Area': 'Up to 3,500 sq. ft. per Access Point',
      'Power Input': '802.3at PoE or 12V DC Adapter',
      'Warranty': '3 Years Comprehensive Warranty'
    }
  },

  // --- Power & Energy Solutions ---
  {
    id: 'rs-pwr-01',
    name: 'Ranil PowerGuard 3000VA Online Double-Conversion Pure Sine Wave UPS',
    category: 'power',
    categoryName: 'Power & UPS Systems',
    rating: 4.9,
    reviewsCount: 310,
    badge: 'Critical Power',
    modelNo: 'RS-UPS-3KVA-ONL',
    stockStatus: 'In Stock (Includes Batteries)',
    image: 'https://images.unsplash.com/photo-1629654297299-c8506221ca97?auto=format&fit=crop&w=600&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1629654297299-c8506221ca97?auto=format&fit=crop&w=600&q=80'
    ],
    description: 'True online double-conversion pure sine wave UPS system providing absolute zero transfer time (0ms). Protects critical server racks, hospital medical equipment, and security CCTV hubs from blackouts, brownouts, voltage spikes, and frequency variations.',
    colors: ['Tower Chassis', '2U Rack/Tower Convertible'],
    sizes: ['Standard Internal Battery Bank (15-20 min backup)', 'Extended Battery Bank (60-90 min backup)'],
    highlights: [
      'True Online Double Conversion Topology (Zero Transfer Time 0ms)',
      'Clean Pure Sine Wave Output with DSP Microprocessor Control',
      'Wide Input Voltage Range (110V - 300V AC) without battery drain',
      'Multifunctional LCD Front Screen Displaying Load & Battery Status',
      'SNMP / USB / RS232 Remote Network Monitoring Port'
    ],
    specs: {
      'Rated Capacity': '3000VA / 2700 Watts (0.9 Power Factor)',
      'Input Voltage Range': '110V - 300V AC @ 50/60Hz Auto-Sensing',
      'Output Voltage': '220V / 230V / 240V AC ± 1% Pure Sine Wave',
      'Transfer Time': '0 ms (Zero Interruption from AC to Battery)',
      'Battery Bank': '6x 12V 9Ah Valve-Regulated Lead-Acid (Included)',
      'Efficiency': 'Up to 94% in Normal Mode, 98% in ECO Mode',
      'Warranty': '2 Years Comprehensive On-Site Support'
    }
  },

  // --- Access Control & Biometrics ---
  {
    id: 'rs-acc-01',
    name: 'Ranil BioFace AI Touchless Face Recognition & RFID Access Terminal',
    category: 'access',
    categoryName: 'Access Control',
    rating: 4.9,
    reviewsCount: 412,
    badge: 'Top Rated',
    modelNo: 'RS-BIO-FACE-AI',
    stockStatus: 'In Stock (Includes Free Cloud Software)',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80'
    ],
    description: 'Next-gen biometric time attendance and secure door access control terminal with anti-spoofing dual-lens IR camera. Recognizes registered faces within 0.2 seconds even in total darkness or with masks. Includes RFID card reader and multi-branch cloud software.',
    colors: ['Brushed Metal Silver', 'Obsidian Black'],
    sizes: ['Wall Mount Bracket Kit', 'Turnstile Gate Pedestal Mount'],
    highlights: [
      '0.2s Lightning-Fast Touchless Face Recognition',
      'Massive Capacity: 10,000 Faces, 10,000 RFID Cards, 200,000 Logs',
      'Direct Relay Control for Magnetic Locks, Drop Bolts & Turnstiles',
      'Wi-Fi, TCP/IP Gigabit Ethernet, Wiegand & USB Connectivity',
      'Free Multi-Branch Cloud Attendance & Payroll Export Software'
    ],
    specs: {
      'Display': '5.0-inch IPS HD Touchscreen Display',
      'Camera': 'Dual 2.0MP Starlight Camera with Anti-Spoofing AI',
      'Verification Distance': '0.3m to 2.5m (Auto-Face Detection)',
      'Communication': 'Wi-Fi 802.11b/g/n, TCP/IP, Wiegand 26/34 In/Out, USB',
      'Lock Interface': 'NO/NC Relay, Exit Button, Door Sensor Input',
      'Operating Temp': '-10°C to +50°C (Indoor & Semi-Outdoor)',
      'Warranty': '2 Years Comprehensive Warranty'
    }
  },

  // --- Cables & Infrastructure ---
  {
    id: 'rs-ind-01',
    name: 'Ranil Cat6 100% Solid Pure Copper 305M UTP Cable Box',
    category: 'networking',
    categoryName: 'Enterprise Networking',
    rating: 4.9,
    reviewsCount: 710,
    badge: '100% Pure Copper',
    modelNo: 'RS-CAB-CAT6-305',
    stockStatus: 'In Stock (Fluke Tested)',
    image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=600&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=600&q=80'
    ],
    description: 'Premium 23 AWG 100% solid bare electrolytic copper Cat6 4-pair unshielded twisted pair cable roll (305 meters / 1000 ft). Features internal cross separator for zero crosstalk and verified for high-power PoE++ and Gigabit speeds.',
    colors: ['Industrial Signal Blue', 'Office Slate Gray'],
    sizes: ['305 Meter (1000 ft) Easy-Pull Box'],
    highlights: [
      '100% Solid Bare Electrolytic Copper (Zero CCA / Aluminum)',
      'Supports Gigabit 1000Base-T & High-Wattage PoE++ (up to 90W)',
      'Flame-Retardant Low Smoke Zero Halogen (LSZH) Jacket',
      'Fluke Channel & Permanent Link Certified up to 550 MHz',
      'Smooth, Tangle-Free Heavy-Duty Reel-in-Box Dispenser'
    ],
    specs: {
      'Conductor Gauge': '23 AWG Solid Bare Copper (0.57mm Diameter)',
      'Frequency Bandwidth': 'Tested up to 550 MHz (Standards Cat6 250MHz)',
      'Jacket Material': 'FR-PVC / LSZH Flame Retardant (RoHS Compliant)',
      'Length': '305 Meters (1000 Feet) with Sequential Meter Markings',
      'PoE Support': 'PoE (15W), PoE+ (30W), PoE++ (60W & 90W 802.3bt)',
      'Certification': 'UL, ETL, CE, RoHS, ISO 11801, TIA/EIA 568-C.2',
      'Warranty': '25 Years Performance Warranty'
    }
  }
];

const CATALOG_STORAGE_KEY = 'ranil_catalog_products';

class CatalogManager {
  constructor() {
    this.products = [];
    this.loadCatalog();
  }

  loadCatalog() {
    try {
      const stored = localStorage.getItem(CATALOG_STORAGE_KEY);
      if (stored) {
        this.products = JSON.parse(stored);
      } else {
        this.products = [...DEFAULT_PRODUCTS];
        this.saveCatalog();
      }
    } catch (e) {
      console.error('Failed to load stored catalog, using defaults', e);
      this.products = [...DEFAULT_PRODUCTS];
    }
  }

  saveCatalog() {
    try {
      localStorage.setItem(CATALOG_STORAGE_KEY, JSON.stringify(this.products));
      window.PRODUCTS_DATA = this.products;
    } catch (e) {
      console.error('Failed to save catalog', e);
    }
  }

  getAll() {
    return this.products;
  }

  getById(id) {
    return this.products.find(p => p.id === id);
  }

  add(productData) {
    const newProduct = {
      id: 'rs-' + Date.now().toString(36),
      name: productData.name,
      modelNo: productData.modelNo || 'RS-CAM-' + Math.floor(100 + Math.random() * 900),
      category: productData.category || 'cctv',
      categoryName: productData.categoryName || 'CCTV Surveillance',
      badge: productData.badge || 'New System',
      stockStatus: productData.stockStatus || 'In Stock',
      rating: 5.0,
      reviewsCount: 1,
      image: productData.image || 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=600&q=80',
      gallery: [productData.image || 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=600&q=80'],
      description: productData.description || 'High-performance surveillance system from Ranil Systems.',
      colors: productData.colors || ['Standard White', 'Black'],
      sizes: productData.sizes || ['Standard Spec'],
      highlights: productData.highlights || ['High Resolution Ultra-HD', 'Official Warranty', 'Ready for Dispatch'],
      specs: productData.specs || {
        'Resolution': 'Ultra-HD High Definition',
        'Lens': 'Fixed / Variable',
        'Warranty': '2 Years Ranil Systems Warranty'
      }
    };

    this.products.unshift(newProduct);
    this.saveCatalog();
    return newProduct;
  }

  delete(id) {
    this.products = this.products.filter(p => p.id !== id);
    this.saveCatalog();
  }

  resetDefaults() {
    this.products = [...DEFAULT_PRODUCTS];
    this.saveCatalog();
  }
}

window.catalogManager = new CatalogManager();
window.PRODUCTS_DATA = window.catalogManager.getAll();
window.RANIL_CONFIG = RANIL_CONFIG;
