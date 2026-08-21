const app = {
    products: [],
    customers: [],
    invoices: [],
    currentBill: {
        items: [],
        customerId: null,
        state: 'intrastate'
    },

    init() {
        this.loadData();
        this.setupEventListeners();
        this.renderDashboard();
    },

    loadData() {
        const saved = localStorage.getItem('vyaparData');
        if (saved) {
            const data = JSON.parse(saved);
            this.products = data.products || [];
            this.customers = data.customers || [];
            this.invoices = data.invoices || [];
        } else {
            this.seedDemoData();
        }
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
            { id: 'INV-2024-001', customerId: 1, customerName: 'Rahul Gupta', items: [{ productId: 1, name: 'Thermal Barcode Scanner', qty: 1, price: 6999, hsn: '8471' }], subtotal: 6999, cgst: 630, sgst: 630, igst: 0, total: 8259, status: 'Paid', date: new Date(Date.now() - 5*24*60*60*1000).toISOString().split('T')[0], state: 'intrastate' }
        ];
        this.saveData();
    },

    saveData() {
        localStorage.setItem('vyaparData', JSON.stringify({
            products: this.products,
            customers: this.customers,
            invoices: this.invoices
        }));
    },

    setupEventListeners() {
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.switchTab(e.target.dataset.tab));
        });
        document.getElementById('searchProducts')?.addEventListener('input', (e) => this.filterProducts(e.target.value));
        document.getElementById('searchCustomers')?.addEventListener('input', (e) => this.filterCustomers(e.target.value));
    },

    switchTab(tabName) {
        document.querySelectorAll('.tab-content').forEach(t => t.style.display = 'none');
        document.getElementById(tabName + '-tab').style.display = 'block';
        document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
        if (tabName === 'inventory') this.renderProducts();
        if (tabName === 'crm') this.renderCustomers();
        if (tabName === 'billing') this.renderBillingForm();
        if (tabName === 'invoices') this.renderInvoices();
        if (tabName === 'reports') this.renderReports();
    },

    renderDashboard() {
        const today = new Date().toISOString().split('T')[0];
        const todayInvoices = this.invoices.filter(inv => inv.date === today);
        const todayRevenue = todayInvoices.reduce((sum, inv) => sum + inv.total, 0);
        const pendingTotal = this.invoices.filter(inv => inv.status === 'Pending').reduce((sum, inv) => sum + inv.total, 0);
        const lowStock = this.products.filter(p => p.stock < 5).length;

        document.getElementById('todayRevenue').textContent = this.formatCurrency(todayRevenue);
        document.getElementById('todayBills').textContent = todayInvoices.length;
        document.getElementById('pendingReceivables').textContent = this.formatCurrency(pendingTotal);
        document.getElementById('lowStockCount').textContent = lowStock;
        document.getElementById('totalCustomers').textContent = this.customers.length;

        const days = 7;
        const dailyRevenue = {};
        for (let i = days-1; i >= 0; i--) {
            const date = new Date(Date.now() - i*24*60*60*1000).toISOString().split('T')[0];
            dailyRevenue[date] = this.invoices.filter(inv => inv.date === date).reduce((sum, inv) => sum + inv.total, 0);
        }

        const maxRevenue = Math.max(...Object.values(dailyRevenue), 10000);
        const chartHtml = Object.values(dailyRevenue).map(rev => {
            const height = (rev / maxRevenue) * 100;
            return `<div class="bar" style="height: ${height}%;"></div>`;
        }).join('');
        document.getElementById('dailyChart').innerHTML = chartHtml;

        const recent = this.invoices.slice(-5).reverse();
        document.getElementById('recentInvoices').innerHTML = recent.length ? recent.map(inv => `
            <tr>
                <td><strong>${inv.id}</strong></td>
                <td>${inv.customerName}</td>
                <td>${this.formatCurrency(inv.total)}</td>
                <td><span class="badge badge-${inv.status.toLowerCase()}">${inv.status}</span></td>
                <td>${inv.date}</td>
            </tr>
        `).join('') : '<tr><td colspan="5" class="empty-state">No invoices</td></tr>';
    },

    renderProducts() {
        const tbody = document.getElementById('productList');
        tbody.innerHTML = this.products.length ? this.products.map(p => `
            <tr>
                <td>${p.name}</td>
                <td>${p.hsn}</td>
                <td>${p.sku}</td>
                <td>${this.formatCurrency(p.purchasePrice)}</td>
                <td>${this.formatCurrency(p.sellingPrice)}</td>
                <td>${p.stock}</td>
                <td>${p.stock < 5 ? '<span class="badge badge-low">Low</span>' : '<span class="badge badge-paid">OK</span>'}</td>
                <td><button class="danger" onclick="app.deleteProduct(${p.id})">Delete</button></td>
            </tr>
        `).join('') : '<tr><td colspan="8" class="empty-state">No products</td></tr>';
    },

    renderCustomers() {
        const tbody = document.getElementById('customerList');
        tbody.innerHTML = this.customers.length ? this.customers.map(c => `
            <tr>
                <td><strong>${c.name}</strong></td>
                <td>${c.mobile}</td>
                <td>${c.city}, ${c.state}</td>
                <td>${this.formatCurrency(c.outstandingBalance)}</td>
                <td>${this.formatCurrency(c.totalPurchased)}</td>
                <td><button class="secondary">Edit</button></td>
            </tr>
        `).join('') : '<tr><td colspan="6" class="empty-state">No customers</td></tr>';
    },

    renderBillingForm() {
        document.getElementById('billCustomer').innerHTML = '<option value="">Select Customer</option>' + this.customers.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
        document.getElementById('billProduct').innerHTML = '<option value="">Add Product</option>' + this.products.map(p => `<option value="${p.id}">${p.name} (${this.formatCurrency(p.sellingPrice)})</option>`).join('');
    },

    formatCurrency(amount) {
        return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);
    },

    showAddProductModal() {
        document.getElementById('addProductModal').style.display = 'flex';
    },

    showAddCustomerModal() {
        document.getElementById('addCustomerModal').style.display = 'flex';
    },

    closeModal(id) {
        document.getElementById(id).style.display = 'none';
    }
};

document.addEventListener('DOMContentLoaded', () => app.init());