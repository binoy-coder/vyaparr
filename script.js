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

  async init() {
    await this.loadData();
    this.setupEventListeners();
    this.renderDashboard();
  },

  setupEventListeners() {
    const navLinks = document.querySelectorAll('.nav-link, [data-page]');
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const page = link.getAttribute('data-page') || link.getAttribute('href')?.replace('#', '');
        if (page) this.navigateTo(page);
      });
    });
  },

  navigateTo(pageId) {
    document.querySelectorAll('.page-section, section').forEach(sec => sec.style.display = 'none');
    const target = document.getElementById(pageId) || document.querySelector(`.${pageId}-section`);
    if (target) target.style.display = 'block';

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

  renderInventory() {},
  renderCustomers() {},
  renderBilling() {},
  renderInvoices() {},

  seedDemoData() {
    this.products = [
      { id: 1, name: 'Thermal Barcode Scanner', hsn: '8471', sku: 'TBS-001', purchasePrice: 4500, sellingPrice: 6999, stock: 12, category: 'Hardware' },
      { id: 2, name: 'Billing POS Printer', hsn: '8443', sku: 'BPP-001', purchasePrice: 8000, sellingPrice: 12999, stock: 3, category: 'Hardware' }
    ];
    this.customers = [];
    this.invoices = [];
  }
};

document.addEventListener('DOMContentLoaded', () => {
  window.app.init();
});
