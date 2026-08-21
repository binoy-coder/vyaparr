window.app = {
  products: [],
  customers: [],
  invoices: [],
  currentBill: { items: [], customerId: null, state: 'intrastate' },

  async loadData() {
    try {
      const response = await fetch('https://vyaparr.onrender.com/api/inventory');
      if (!response.ok) throw new Error('API server request failed');
      const liveData = await response.json();
      
      if (Array.isArray(liveData)) {
        this.products = liveData;
      } else if (liveData && Array.isArray(liveData.products)) {
        this.products = liveData.products;
      }

      const saved = localStorage.getItem('vyaparData');
      if (saved) {
        const data = JSON.parse(saved);
        this.customers = data.customers || [];
        this.invoices = data.invoices || [];
      }
    } catch (error) {
      console.error('Error fetching backend data:', error);
      const saved = localStorage.getItem('vyaparData');
      if (saved) {
        const data = JSON.parse(saved);
        this.products = data.products || [];
        this.customers = data.customers || [];
        this.invoices = data.invoices || [];
      } else {
        this.seedDemoData();
      }
    }
  },

  init() {
    this.setupEventListeners();
    this.loadData().then(() => {
      this.renderDashboard();
    });
  },

 setupEventListeners() {
    document.body.addEventListener('click', (e) => {
      const link = e.target.closest('.nav-link, [data-page], nav a, button[data-page]');
      if (!link) return;
      
      const page = link.getAttribute('data-page') || link.getAttribute('href')?.replace('#', '');
      if (page) {
        e.preventDefault();
        this.navigateTo(page);
      }
    });
  },

  navigateTo(pageId) {
    // Hide all main pages/sections cleanly
    const allPages = document.querySelectorAll('.page, .page-section, section[id], main > div');
    allPages.forEach(p => p.style.display = 'none');

    // Find and display active section
    const target = document.getElementById(pageId) || 
                   document.querySelector(`.${pageId}-page`) || 
                   document.querySelector(`.${pageId}-section`) ||
                   document.querySelector(`[data-page="${pageId}"]`);

    if (target) {
      target.style.display = 'block';
    } else {
      console.warn(`Could not find section element for page: ${pageId}`);
    }

    // Trigger tab-specific render methods
    if (pageId === 'dashboard') this.renderDashboard();
    if (pageId === 'inventory') this.renderInventory();
    if (pageId === 'customers') this.renderCustomers();
    if (pageId === 'billing') this.renderBilling();
    if (pageId === 'invoices') this.renderInvoices();
  },
  renderDashboard() {
    const totalRev = this.invoices.reduce((sum, inv) => sum + (inv.total || 0), 0);
    const lowStock = this.products.filter(p => (p.stock || 0) < 5).length;
    
    const revEl = document.getElementById('todayRevenue');
    if (revEl) revEl.innerText = `₹${totalRev.toFixed(2)}`;
    
    const stockEl = document.getElementById('lowStockCount');
    if (stockEl) stockEl.innerText = lowStock;

    const custEl = document.getElementById('totalCustomers');
    if (custEl) custEl.innerText = this.customers.length;
  },

  renderInventory() {
    const tableBody = document.querySelector('#inventoryTable tbody');
    if (!tableBody) return;
    tableBody.innerHTML = this.products.map(p => `
      <tr>
        <td>${p.name || 'N/A'}</td>
        <td>${p.sku || p.id || '-'}</td>
        <td>₹${p.sellingPrice || p.price || 0}</td>
        <td>${p.stock || 0}</td>
      </tr>
    `).join('');
  },

  renderCustomers() {},
  renderBilling() {},
  renderInvoices() {},

  seedDemoData() {
    this.products = [
      { id: 1, name: 'Thermal Barcode Scanner', hsn: '8471', sku: 'TBS-001', purchasePrice: 4500, sellingPrice: 6999, stock: 12, category: 'Hardware' }
    ];
    this.customers = [];
    this.invoices = [];
  }
};

// Immediate or DOMContentLoaded initialization
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => window.app.init());
} else {
  window.app.init();
}
