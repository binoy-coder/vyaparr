window.app = {
    products: [],
    customers: [],
    invoices: [],
    currentBill: {
        items: [],
        customerId: null,
        state: 'intrastate'
    },
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
            btn.addEventListener('click', (e) => {
                const tab = e.target.closest('.nav-btn').dataset.tab;
                this.switchTab(tab);
            });
        });
        document.getElementById('searchProducts')?.addEventListener('input', (e) => this.filterProducts(e.target.value));
        document.getElementById('searchCustomers')?.addEventListener('input', (e) => this.filterCustomers(e.target.value));
    },

    switchTab(tabName) {
        document.querySelectorAll('.tab-content').forEach(t => t.style.display = 'none');
        const activeTab = document.getElementById(tabName + '-tab');
        if (activeTab) activeTab.style.display = 'block';

        document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
        const activeBtn = document.querySelector(`[data-tab="${tabName}"]`);
        if (activeBtn) activeBtn.classList.add('active');

        if (tabName === 'dashboard') this.renderDashboard();
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
        for (let i = days - 1; i >= 0; i--) {
            const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
            dailyRevenue[date] = this.invoices.filter(inv => inv.date === date).reduce((sum, inv) => sum + inv.total, 0);
        }

        const maxRevenue = Math.max(...Object.values(dailyRevenue), 10000);
        const chartHtml = Object.values(dailyRevenue).map(rev => {
            const height = (rev / maxRevenue) * 100;
            return `<div class="bar" style="height: ${Math.max(height, 5)}%;"></div>`;
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
        `).join('') : '<tr><td colspan="5" class="empty-state">No invoices yet</td></tr>';
    },

    renderProducts(filtered = null) {
        const list = filtered || this.products;
        const tbody = document.getElementById('productList');
        tbody.innerHTML = list.length ? list.map(p => `
            <tr>
                <td><strong>${p.name}</strong></td>
                <td>${p.hsn}</td>
                <td>${p.sku}</td>
                <td>${this.formatCurrency(p.purchasePrice)}</td>
                <td>${this.formatCurrency(p.sellingPrice)}</td>
                <td>${p.stock}</td>
                <td>${p.stock < 5 ? '<span class="badge badge-low">Low</span>' : '<span class="badge badge-paid">OK</span>'}</td>
                <td><button class="danger" onclick="app.deleteProduct(${p.id})">Delete</button></td>
            </tr>
        `).join('') : '<tr><td colspan="8" class="empty-state">No products found</td></tr>';
    },

    filterProducts(query) {
        const q = query.toLowerCase();
        const filtered = this.products.filter(p => p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q) || p.hsn.includes(q));
        this.renderProducts(filtered);
    },

    saveProduct() {
        const name = document.getElementById('productName').value;
        const hsn = document.getElementById('productHSN').value;
        const sku = document.getElementById('productSKU').value;
        const purchasePrice = parseFloat(document.getElementById('productPurchasePrice').value) || 0;
        const sellingPrice = parseFloat(document.getElementById('productSellingPrice').value) || 0;
        const stock = parseInt(document.getElementById('productStock').value) || 0;

        if (!name || !sellingPrice) {
            alert('Please enter product name and selling price.');
            return;
        }

        this.products.push({ id: Date.now(), name, hsn, sku, purchasePrice, sellingPrice, stock });
        this.saveData();
        this.closeModal('addProductModal');
        this.renderProducts();
    },

    deleteProduct(id) {
        this.products = this.products.filter(p => p.id !== id);
        this.saveData();
        this.renderProducts();
    },

    renderCustomers(filtered = null) {
        const list = filtered || this.customers;
        const tbody = document.getElementById('customerList');
        tbody.innerHTML = list.length ? list.map(c => `
            <tr>
                <td><strong>${c.name}</strong></td>
                <td>${c.mobile}</td>
                <td>${c.city}, ${c.state}</td>
                <td>${this.formatCurrency(c.outstandingBalance)}</td>
                <td>${this.formatCurrency(c.totalPurchased)}</td>
                <td><button class="danger" onclick="app.deleteCustomer(${c.id})">Delete</button></td>
            </tr>
        `).join('') : '<tr><td colspan="6" class="empty-state">No customers found</td></tr>';
    },

    filterCustomers(query) {
        const q = query.toLowerCase();
        const filtered = this.customers.filter(c => c.name.toLowerCase().includes(q) || c.mobile.includes(q) || c.city.toLowerCase().includes(q));
        this.renderCustomers(filtered);
    },

    saveCustomer() {
        const name = document.getElementById('customerName').value;
        const mobile = document.getElementById('customerMobile').value;
        const city = document.getElementById('customerCity').value;
        const state = document.getElementById('customerState').value;

        if (!name) {
            alert('Please enter customer name.');
            return;
        }

        this.customers.push({ id: Date.now(), name, mobile, city, state, outstandingBalance: 0, totalPurchased: 0 });
        this.saveData();
        this.closeModal('addCustomerModal');
        this.renderCustomers();
    },

    deleteCustomer(id) {
        this.customers = this.customers.filter(c => c.id !== id);
        this.saveData();
        this.renderCustomers();
    },

    renderBillingForm() {
        const custSelect = document.getElementById('billCustomer');
        custSelect.innerHTML = '<option value="">Select Customer</option>' + this.customers.map(c => `<option value="${c.id}">${c.name} (${c.mobile})</option>`).join('');

        const prodSelect = document.getElementById('billProduct');
        prodSelect.innerHTML = '<option value="">Add Product to Cart...</option>' + this.products.map(p => `<option value="${p.id}">${p.name} - ${this.formatCurrency(p.sellingPrice)} (Stock: ${p.stock})</option>`).join('');

        this.updateBillRender();
    },

    addBillItem(productId) {
        if (!productId) return;
        const product = this.products.find(p => p.id === parseInt(productId));
        if (!product) return;

        const existing = this.currentBill.items.find(i => i.productId === product.id);
        if (existing) {
            existing.qty += 1;
        } else {
            this.currentBill.items.push({
                productId: product.id,
                name: product.name,
                hsn: product.hsn,
                price: product.sellingPrice,
                qty: 1
            });
        }
        this.updateBillRender();
    },

    updateBillQty(index, qty) {
        const parsed = parseInt(qty);
        if (parsed <= 0) {
            this.currentBill.items.splice(index, 1);
        } else {
            this.currentBill.items[index].qty = parsed;
        }
        this.updateBillRender();
    },

    removeBillItem(index) {
        this.currentBill.items.splice(index, 1);
        this.updateBillRender();
    },

    updateBillTax(type) {
        this.currentBill.state = type;
        this.updateBillRender();
    },

    updateBillRender() {
        const tbody = document.getElementById('billItems');
        tbody.innerHTML = this.currentBill.items.length ? this.currentBill.items.map((item, idx) => {
            const tax = item.price * item.qty * 0.18;
            const total = item.price * item.qty + tax;
            return `
                <tr>
                    <td>${item.name}</td>
                    <td>${item.hsn}</td>
                    <td>${this.formatCurrency(item.price)}</td>
                    <td><input type="number" value="${item.qty}" min="1" style="width: 60px;" onchange="app.updateBillQty(${idx}, this.value)"></td>
                    <td>${this.formatCurrency(tax)}</td>
                    <td>${this.formatCurrency(total)}</td>
                    <td><button class="danger" onclick="app.removeBillItem(${idx})">&times;</button></td>
                </tr>
            `;
        }).join('') : '<tr><td colspan="7" class="empty-state">No products added to bill</td></tr>';

        const subtotal = this.currentBill.items.reduce((sum, i) => sum + (i.price * i.qty), 0);
        const isInterstate = this.currentBill.state === 'interstate';

        const cgst = isInterstate ? 0 : subtotal * 0.09;
        const sgst = isInterstate ? 0 : subtotal * 0.09;
        const igst = isInterstate ? subtotal * 0.18 : 0;
        const total = subtotal + cgst + sgst + igst;

        document.getElementById('billSubtotal').textContent = this.formatCurrency(subtotal);
        document.getElementById('billCGST').textContent = this.formatCurrency(cgst);
        document.getElementById('billSGST').textContent = this.formatCurrency(sgst);
        document.getElementById('billIGST').textContent = this.formatCurrency(igst);
        document.getElementById('billTotal').textContent = this.formatCurrency(total);

        document.getElementById('cgstRow').style.display = isInterstate ? 'none' : 'flex';
        document.getElementById('sgstRow').style.display = isInterstate ? 'none' : 'flex';
        document.getElementById('igstRow').style.display = isInterstate ? 'flex' : 'none';
    },

    generateBill() {
        const customerId = document.getElementById('billCustomer').value;
        if (!customerId) {
            alert('Please select a customer.');
            return;
        }
        if (this.currentBill.items.length === 0) {
            alert('Please add at least one product to the bill.');
            return;
        }

        const customer = this.customers.find(c => c.id === parseInt(customerId));
        const subtotal = this.currentBill.items.reduce((sum, i) => sum + (i.price * i.qty), 0);
        const isInterstate = this.currentBill.state === 'interstate';
        const cgst = isInterstate ? 0 : subtotal * 0.09;
        const sgst = isInterstate ? 0 : subtotal * 0.09;
        const igst = isInterstate ? subtotal * 0.18 : 0;
        const total = subtotal + cgst + sgst + igst;

        const newInvoice = {
            id: `INV-2024-${String(this.invoices.length + 1).padStart(3, '0')}`,
            customerId: customer.id,
            customerName: customer.name,
            items: [...this.currentBill.items],
            subtotal,
            cgst,
            sgst,
            igst,
            total,
            status: 'Paid',
            date: new Date().toISOString().split('T')[0],
            state: this.currentBill.state
        };

        // Deduct inventory
        this.currentBill.items.forEach(item => {
            const p = this.products.find(prod => prod.id === item.productId);
            if (p) p.stock = Math.max(0, p.stock - item.qty);
        });

        // Update customer spending
        customer.totalPurchased += total;

        this.invoices.push(newInvoice);
        this.saveData();
        this.resetBill();
        this.viewInvoice(newInvoice.id);
    },

    resetBill() {
        this.currentBill = { items: [], customerId: null, state: 'intrastate' };
        document.getElementById('billCustomer').value = '';
        document.getElementById('billProduct').value = '';
        this.updateBillRender();
    },

    renderInvoices() {
        const tbody = document.getElementById('allInvoices');
        tbody.innerHTML = this.invoices.length ? this.invoices.map(inv => `
            <tr>
                <td><strong>${inv.id}</strong></td>
                <td>${inv.customerName}</td>
                <td>${this.formatCurrency(inv.total)}</td>
                <td>${this.formatCurrency((inv.cgst || 0) + (inv.sgst || 0) + (inv.igst || 0))}</td>
                <td><span class="badge badge-${inv.status.toLowerCase()}">${inv.status}</span></td>
                <td>${inv.date}</td>
                <td><button onclick="app.viewInvoice('${inv.id}')">View</button></td>
            </tr>
        `).join('') : '<tr><td colspan="7" class="empty-state">No invoices available</td></tr>';
    },

    viewInvoice(id) {
        const inv = this.invoices.find(i => i.id === id);
        if (!inv) return;

        const preview = document.getElementById('invoicePreview');
        preview.innerHTML = `
            <div class="invoice-container">
                <div class="invoice-header">
                    <div>
                        <div class="invoice-company">Vyapar Solutions Pvt Ltd</div>
                        <div>GSTIN: 27AAAAA0000A1Z5</div>
                        <div>Mumbai, Maharashtra</div>
                    </div>
                    <div class="invoice-number">
                        <h2>INVOICE</h2>
                        <div><strong>${inv.id}</strong></div>
                        <div>Date: ${inv.date}</div>
                    </div>
                </div>
                <div class="invoice-section">
                    <div class="invoice-section-title">Billed To</div>
                    <div><strong>${inv.customerName}</strong></div>
                </div>
                <table class="invoice-table">
                    <thead>
                        <tr>
                            <th>Item</th>
                            <th>HSN</th>
                            <th>Qty</th>
                            <th>Rate</th>
                            <th>Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${inv.items.map(item => `
                            <tr>
                                <td>${item.name}</td>
                                <td>${item.hsn}</td>
                                <td>${item.qty}</td>
                                <td>${this.formatCurrency(item.price)}</td>
                                <td>${this.formatCurrency(item.price * item.qty)}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
                <div class="invoice-total">
                    <div class="total-row"><span>Subtotal:</span><span>${this.formatCurrency(inv.subtotal)}</span></div>
                    ${inv.cgst ? `<div class="total-row"><span>CGST (9%):</span><span>${this.formatCurrency(inv.cgst)}</span></div>` : ''}
                    ${inv.sgst ? `<div class="total-row"><span>SGST (9%):</span><span>${this.formatCurrency(inv.sgst)}</span></div>` : ''}
                    ${inv.igst ? `<div class="total-row"><span>IGST (18%):</span><span>${this.formatCurrency(inv.igst)}</span></div>` : ''}
                    <div class="total-row"><span>Total:</span><span>${this.formatCurrency(inv.total)}</span></div>
                </div>
            </div>
        `;

        document.getElementById('invoiceViewModal').style.display = 'flex';
    },

    renderReports() {
        const totalRev = this.invoices.reduce((sum, i) => sum + i.total, 0);
        const totalGst = this.invoices.reduce((sum, i) => sum + (i.cgst || 0) + (i.sgst || 0) + (i.igst || 0), 0);
        const count = this.invoices.length;
        const avg = count ? totalRev / count : 0;

        document.getElementById('reportRevenue').textContent = this.formatCurrency(totalRev);
        document.getElementById('reportGST').textContent = this.formatCurrency(totalGst);
        document.getElementById('reportInvoices').textContent = count;
        document.getElementById('reportAvgInvoice').textContent = this.formatCurrency(avg);

        const prodSales = {};
        this.invoices.forEach(inv => {
            inv.items.forEach(item => {
                if (!prodSales[item.name]) prodSales[item.name] = { qty: 0, rev: 0 };
                prodSales[item.name].qty += item.qty;
                prodSales[item.name].rev += item.price * item.qty;
            });
        });

        const sorted = Object.entries(prodSales).sort((a, b) => b[1].rev - a[1].rev);
        document.getElementById('topProducts').innerHTML = sorted.length ? sorted.map(([name, data]) => `
            <tr>
                <td><strong>${name}</strong></td>
                <td>${data.qty}</td>
                <td>${this.formatCurrency(data.rev)}</td>
            </tr>
        `).join('') : '<tr><td colspan="3" class="empty-state">No sales data recorded</td></tr>';
    },

    showAddProductModal() {
        document.getElementById('addProductModal').style.display = 'flex';
    },

    showAddCustomerModal() {
        document.getElementById('addCustomerModal').style.display = 'flex';
    },

    closeModal(id) {
        document.getElementById(id).style.display = 'none';
    },

    formatCurrency(amount) {
        return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount || 0);
    }
};

document.addEventListener('DOMContentLoaded', () => window.app.init());
