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
      
      // Map live inventory data array
      if (Array.isArray(liveData)) {
        this.products = liveData;
      } else if (liveData && Array.isArray(liveData.products)) {
        this.products = liveData.products;
      }

      // Load saved customers and invoices from localStorage
      const saved = localStorage.getItem('vyaparData');
      if (saved) {
        const data = JSON.parse(saved);
        this.customers = data.customers || [];
        this.invoices = data.invoices || [];
      }
    } catch (error) {
      console.error('Error fetching backend data, falling back to localStorage:', error);
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

  seedDemoData() {
    this.products = [
      { id: 1, name: 'Thermal Barcode Scanner', hsn: '8471', sku: 'TBS-001', purchasePrice: 4500, sellingPrice: 6999, stock: 12, category: 'Hardware' },
      { id: 2, name: 'Billing POS Printer', hsn: '8443', sku: 'BPP-001', purchasePrice: 8000, sellingPrice: 12999, stock: 3, category: 'Hardware' },
      { id: 3, name: 'Label Roll Pack', hsn: '4821', sku: 'LRP-001', purchasePrice: 150, sellingPrice: 249, stock: 45, category: 'Consumables' },
      { id: 4, name: 'Cash Drawer', hsn: '8303', sku: 'CD-001', purchasePrice: 3500, sellingPrice: 5499, stock: 2, category: 'Hardware' }
    ];
    this.customers = [
      { id: 1, name: 'Rahul Gupta', mobile: '+91 98765 43210', city: 'Mumbai', state: 'Maharashtra', outstandingBalance: 5000, totalPurchased: 25000 },
      { id: 2, name: 'Anjali Paul', mobile: '+91 89765 43210', city: 'New Delhi', state: 'Delhi', outstandingBalance: 0, totalPurchased: 18500 },
      { id: 3, name: 'Vikram Sarin', mobile: '+91 79765 43210', city: 'Bengaluru', state: 'Karnataka', outstandingBalance: 12000, totalPurchased: 45000 }
    ];
    this.invoices = [
      { id: 'INV-2024-001', customerId: 1, customerName: 'Rahul Gupta', items: [{ productId: 1, name: 'Thermal Barcode Scanner', qty: 1, price: 6999, hsn: '8471' }], subtotal: 6999, cgst: 630, sgst: 630, igst: 0, total: 8259, status: 'Paid', date: new Date().toISOString().split('T')[0], state: 'intrastate' }
    ];
  }
};
