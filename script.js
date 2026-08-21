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
      } else {
        this.seedDemoData();
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
      const btn = e.target.closest('[data-page], .nav-btn, nav button');
      if (!btn) return;

      const page = btn.getAttribute('data-page');
      if (page) {
        e.preventDefault();
        
        // Update active tab button highlight
        document.querySelectorAll('nav .nav-btn').forEach(b => {
          b.classList.remove('bg-slate-700', 'text-white');
          b.classList.add('text-slate-300');
        });
        btn.classList.add('bg-slate-700', 'text-white');
        btn.classList.remove('text-slate-300');

        this.navigateTo(page);
      }
    });
  },

  navigateTo(pageId) {
    // Hide all view sections
    const views = document.querySelectorAll('main .page-section');
    views.forEach(v => {
      v.style.display = 'none';
    });

    // Show selected view section
    const target = document.getElementById(pageId);
    if (target) {
      target.style.display = 'block';
    } else {
      console.warn(`Target view container not found for page ID: ${pageId}`);
    }

    // Trigger tab specific renders
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

  renderCustomers() {
    const tableBody = document.querySelector('#customersTable tbody');
    if (!tableBody) return;
    tableBody.innerHTML = this.customers.map(c => `
      <tr>
        <td>${c.name || 'N/A'}</td>
        <td>${c.mobile || '-'}</td>
        <td>₹${c.outstandingBalance || 0}</td>
      </tr>
    `).join('');
  },

  renderBilling() {},

  renderInvoices() {
    const tableBody = document.querySelector('#invoicesTable tbody');
    if (!tableBody) return;
    tableBody.innerHTML = this.invoices.map(inv => `
      <tr>
        <td>${inv.id}</td>
        <td>${inv.customerName || 'Walk-in'}</td>
        <td>₹${inv.total}</td>
        <td>${inv.status}</td>
        <td>${inv.date}</td>
      </tr>
    `).join('');
  },

  seedDemoData() {
    this.customers = [
      { id: 1, name: 'Rahul Gupta', mobile: '+91 98765 43210', outstandingBalance: 5000 },
      { id: 2, name: 'Anjali Paul', mobile: '+91 89765 43210', outstandingBalance: 0 }
    ];
    this.invoices = [
      { id: 'INV-2024-001', customerName: 'Rahul Gupta', total: 8259, status: 'Paid', date: new Date().toISOString().split('T')[0] }
    ];
  }
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => window.app.init());
} else {
  window.app.init();
}
