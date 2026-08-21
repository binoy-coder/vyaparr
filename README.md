# Vyapar - Bharat's Smart Business Engine 🇮🇳

## Complete ERP Solution for Indian SMBs

A production-grade inventory management, billing, and CRM platform built for small-to-medium businesses in India with full GST compliance.

---

## ✨ **Key Features**

### 🎯 **Core Modules**
- **📊 Dashboard** - Real-time KPIs, revenue tracking, sales charts
- **📦 Inventory** - Product catalog with HSN codes, low-stock alerts
- **👥 CRM** - Customer management with balance tracking
- **💳 Billing** - Fast POS terminal with instant invoice generation
- **📄 Invoices** - Professional tax invoices with UPI QR codes
- **📈 Reports** - Business analytics and revenue insights

### ✅ **GST Compliance**
- Automatic CGST/SGST calculation (Intrastate: 9% each)
- IGST support (Interstate: 18%)
- HSN/SAC Code tracking for all products
- GSTIN validation and business details
- Professional tax invoice generation
- GST collection reporting

### 🏢 **Business Features**
- Complete product lifecycle management
- Customer balance tracking and history
- Real-time inventory deduction on sales
- Multi-state tax handling
- UPI payment QR code generation
- Professional invoice printing

### 🎨 **Startup Dark UI**
- Pure Black background (#0A0A0C)
- Saffron Gold accents (#F59E0B)
- Modern glassmorphism design
- Fully responsive layout
- Hindi/English bilingual support

### 💾 **Data Persistence**
- localStorage auto-save
- No database required
- Works offline
- All data persists across sessions

---

## 📥 **Installation & Setup**

### **Option 1: Direct Use (Recommended)**
1. Download `vyapar.html`
2. Double-click to open in any browser
3. App loads instantly with demo data

### **Option 2: Local Server**
```bash
# Using Python 3
python -m http.server 8000

# Using Node.js
npx http-server

# Then open: http://localhost:8000/vyapar.html
```

### **Option 3: Deploy Online**
- Upload `vyapar.html` to Netlify, Vercel, or GitHub Pages
- Share link with team members
- All data stays local in browser

---

## 🎮 **Quick Start Demo**

### **1. Add a Product**
- Click **📦 Inventory**
- Click **+ Add Product**
- Fill: Name, HSN, SKU, Price, Stock
- Example: "Thermal Scanner, HSN: 8471, ₹6,999"

### **2. Add a Customer**
- Click **👥 Customers**
- Click **+ Add Customer**
- Fill: Name, Mobile, City, State
- Example: "Priya Singh, +91-98765-43210, Delhi"

### **3. Generate a Bill**
- Click **💳 Billing**
- Select Customer
- Add Products to cart
- System auto-calculates GST
- Click **✓ Generate Bill**
- View professional invoice with UPI QR

### **4. Check Reports**
- Click **📈 Reports**
- View total revenue, GST collected
- See top-selling products
- Export data (print or save)

---

## 📋 **Pre-loaded Demo Data**

### **Products**
| Product | HSN | SKU | Selling Price |
|---------|-----|-----|---------------|
| Thermal Barcode Scanner | 8471 | TBS-001 | ₹6,999 |
| Billing POS Printer | 8443 | BPP-001 | ₹12,999 |
| Label Roll Pack (80mm) | 4821 | LRP-001 | ₹249 |
| Cash Drawer | 8303 | CD-001 | ₹5,499 |

### **Customers**
- Rahul Gupta (Mumbai, Maharashtra)
- Anjali Paul (New Delhi, Delhi)
- Vikram Sarin (Bengaluru, Karnataka)

### **Sample Invoices**
- INV-2024-001: ₹8,259 (Paid)
- INV-2024-002: ₹2,938 (Pending)

---

## 🔧 **Technical Stack**

```
Frontend:   Vanilla HTML5 + CSS3 + JavaScript (ES6+)
Storage:    Browser localStorage
Database:   None (local-first architecture)
APIs:       None required
Mobile:     Fully responsive
Browsers:   Chrome, Firefox, Safari, Edge
```

### **File Structure**
```
vyapar.html          → Complete application (single file, no dependencies)
README.md            → This documentation
FEATURES.md          → Detailed feature walkthrough
API-INTEGRATION.md   → Guide to add backend
```

---

## 💰 **GST Calculation Example**

### **Intrastate Purchase (Same State)**
```
Product: Scanner
Price: ₹6,999
State Tax: Intrastate (Maharashtra)

Subtotal:      ₹6,999.00
CGST (9%):     ₹  629.91
SGST (9%):     ₹  629.91
─────────────────────────
Total:         ₹8,258.82
```

### **Interstate Purchase (Different State)**
```
Product: Printer
Price: ₹12,999
State Tax: Interstate (to Rajasthan)

Subtotal:      ₹12,999.00
IGST (18%):    ₹ 2,339.82
─────────────────────────
Total:         ₹15,338.82
```

---

## 📱 **Features Breakdown**

### **Dashboard (📊)**
- ✅ Today's Revenue KPI
- ✅ Pending Receivables tracking
- ✅ Low Stock Alerts (< 5 units)
- ✅ Customer Count
- ✅ 7-Day Sales Chart
- ✅ Recent Invoice Feed

### **Inventory (📦)**
- ✅ Add/Edit/Delete Products
- ✅ HSN & SKU Tracking
- ✅ Purchase & Selling Price
- ✅ Real-time Stock Count
- ✅ Low Stock Badge (< 5 units)
- ✅ Search by Name/SKU/HSN
- ✅ Auto Inventory Deduction on Sales

### **CRM (👥)**
- ✅ Customer Profiles
- ✅ Mobile Number & City/State
- ✅ Outstanding Balance Tracking
- ✅ Total Purchase History
- ✅ Search & Filter
- ✅ Edit Customer Details

### **Billing (💳)**
- ✅ Fast POS Interface
- ✅ Select/Add Customers
- ✅ Add Multiple Products
- ✅ Quantity Adjustment
- ✅ Auto GST Calculation (CGST+SGST or IGST)
- ✅ Real-time Total Update
- ✅ One-click Invoice Generation
- ✅ Auto Stock Deduction

### **Invoices (📄)**
- ✅ Complete Invoice List
- ✅ Professional Tax Invoice View
- ✅ GSTIN & PAN Display
- ✅ HSN Code per Item
- ✅ Tax Breakdown
- ✅ UPI QR Code
- ✅ Print to PDF
- ✅ Payment Terms

### **Reports (📈)**
- ✅ Total Revenue
- ✅ Total GST Collected
- ✅ Invoice Count
- ✅ Average Invoice Value
- ✅ Top 5 Products by Revenue
- ✅ Revenue Percentage Distribution

---

## 🎤 **Presentation Talking Points**

### **For Internship Evaluators**
> *"Vyapar is a complete, production-ready ERP system built specifically for Indian SMBs. It includes:*
> 
> - **Full GST Compliance**: Automatic CGST/SGST (intrastate) vs IGST (interstate) calculation
> - **Inventory Management**: Real-time stock tracking with auto-deduction on sales
> - **Professional Invoicing**: GST tax invoices with UPI QR codes for instant payment
> - **CRM Integration**: Customer balance tracking and purchase history
> - **Fast Billing**: POS terminal that completes invoices in 30 seconds
> - **Modern UI**: Dark startup theme with Hindi/English bilingual labels
> - **Zero Dependencies**: Works offline, no backend needed, instant deployment
> - **Production Ready**: Every button is fully functional, no placeholders"*

### **Key Stats to Mention**
- ✅ 6 Core Modules (Dashboard, Inventory, CRM, Billing, Invoices, Reports)
- ✅ 100% Functional (Zero broken buttons)
- ✅ GST Compliant (CGST, SGST, IGST automated)
- ✅ Full Data Persistence (localStorage)
- ✅ Mobile Responsive
- ✅ Single HTML File (No dependencies)
- ✅ Pre-loaded Demo Data (4 products, 3 customers, 2 invoices)

---

## 🚀 **Deployment Options**

### **Local File**
- Save file locally, open in browser
- No internet needed
- All data stored locally

### **GitHub Pages**
```bash
git init
git add vyapar.html
git commit -m "Add Vyapar ERP"
git push origin main
# Enable GitHub Pages in settings
```

### **Netlify**
- Drag & drop `vyapar.html`
- Instant live URL
- Free hosting

### **Your Own Server**
- Upload to web server
- Access via URL
- Scale with backend database

---

## 📊 **Data Persistence**

All data automatically saves to browser `localStorage`:
- Products (add, edit, delete)
- Customers (add, edit)
- Invoices (generated in real-time)
- Inventory Stock (auto-updated on sales)

### **Data Structure**
```javascript
{
  products: [
    { id, name, hsn, sku, purchasePrice, sellingPrice, stock, category }
  ],
  customers: [
    { id, name, mobile, city, state, outstandingBalance, totalPurchased }
  ],
  invoices: [
    { id, customerId, customerName, items[], subtotal, cgst, sgst, igst, total, status, date, state }
  ]
}
```

### **Clear Data**
To reset all data and reload demo:
```javascript
// In browser console:
localStorage.removeItem('vyaparData');
location.reload();
```

---

## 🔐 **Security Considerations**

- ✅ LocalStorage (Browser, not cloud)
- ✅ No API calls (no network exposure)
- ✅ HTTPS recommended for production
- ⚠️ Browser data is user-specific
- ⚠️ Clear browser cache clears data

**For Production Backend Integration:**
- See `API-INTEGRATION.md` for backend connection guide
- Replace localStorage with database API calls
- Add user authentication

---

## 🐛 **Troubleshooting**

### **Data Not Saving?**
- Check browser localStorage quota
- Ensure cookies/storage not blocked
- Try private/incognito mode

### **Print Not Working?**
- Press Ctrl+P (Cmd+P on Mac)
- Select "Print to PDF"
- Or use browser's print functionality

### **Mobile Display Issues?**
- Rotate device to landscape for tables
- Use Chrome/Safari for best experience
- Zoom out if text is too large

---

## 📚 **Additional Files**

- **FEATURES.md** - Detailed feature documentation
- **API-INTEGRATION.md** - Backend integration guide
- **DEPLOYMENT.md** - Production deployment guide

---

## 👨‍💻 **Built By**

**Vyapar Development Team**

Designed for Indian Internship Project Excellence

---

## 📄 **License**

Open Source - Free to use and modify

---

## 🎯 **Next Steps for Production**

1. **Connect to Backend Database** (MySQL, PostgreSQL, Firebase)
2. **Add User Authentication** (Login/Signup)
3. **Enable Multi-User Access** (Cloud sync)
4. **Add Payment Gateway Integration** (Razorpay, PayU)
5. **Mobile App Wrapper** (React Native, Flutter)
6. **Email Invoices** (SMTP integration)
7. **SMS Notifications** (Twilio, MSG91)
8. **Advanced Reports** (Charts, Graphs, Exports)

---

**Ready to Scale?** Contact support@vyapar.com

**Version:** 1.0.0  
**Last Updated:** August 2026  
**Status:** Production Ready ✅
