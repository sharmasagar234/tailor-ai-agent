const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());

// Configuration
const CONFIG = {
    PORT: process.env.PORT || 3000,
    WHATSAPP_API_URL: 'https://api.interakt.ai/v1/public/message/',
    WHATSAPP_API_KEY: process.env.WHATSAPP_API_KEY,
    SHOP_NAME: 'Sharma Tailors',
    SHOP_PHONE: '+91 98765-43210',
    SHOP_ADDRESS: 'Shop No. 5, Malviya Nagar, Jaipur - 302017'
};

// Database (In-memory for demo)
const database = {
    customers: {},
    orders: {},
    appointments: {},
    measurements: {}
};

// Helper Functions
function saveCustomer(phone, data) {
    database.customers[phone] = {
        phone: phone,
        createdAt: new Date(),
        ...data
    };
    return database.customers[phone];
}

function getCustomer(phone) {
    return database.customers[phone] || null;
}

function createOrder(customerPhone, orderData) {
    const orderId = 'ORD' + Date.now();
    database.orders[orderId] = {
        orderId: orderId,
        customerPhone: customerPhone,
        status: 'Pending',
        createdAt: new Date(),
        ...orderData
    };
    return database.orders[orderId];
}

function getOrder(orderId) {
    return database.orders[orderId] || null;
}

// AI Agent Response Function
function getAgentResponse(message, customerPhone) {
    const msg = message.toLowerCase();
    const customer = getCustomer(customerPhone);
    const customerName = customer?.name || '';

    // Price inquiry
    if (msg.includes('price') || msg.includes('kitne') || msg === '1') {
        return {
            text: `📋 हमारे Rates:\n\n👔 Shirt: ₹800\n👖 Pant: ₹600\n🤵 Full Suit: ₹2,500\n👕 Kurta: ₹700\n\n⏰ Delivery: 7 days\n⚡ Urgent (3 days): +₹200\n\nOrder देना चाहते हैं? 😊`,
            type: 'text'
        };
    }

    // Order status
    if (msg.includes('order') || msg.includes('status') || msg === '2') {
        return {
            text: '📦 Order Status Check:\n\nकृपया बताइए:\n1️⃣ Order Number (जैसे: ORD123)\n2️⃣ या Mobile Number\n\nमैं तुरंत status check कर दूंगा!',
            type: 'text'
        };
    }

    // Order number check
    if (msg.includes('ord') || /\d{3,4}/.test(msg)) {
        const orderId = msg.match(/ord\d+/i) ? msg.match(/ord\d+/i)[0].toUpperCase() : 'ORD123';
        const order = getOrder(orderId);
        
        if (order) {
            return {
                text: `✅ Order Found!\n\n📦 Order #${order.orderId}\n💰 Amount: ₹${order.amount || 1400}\n🎯 Status: ${order.status}`,
                type: 'text'
            };
        }
        return {
            text: '❌ Order नहीं मिला!\n\nCall करें: ' + CONFIG.SHOP_PHONE,
            type: 'text'
        };
    }

    // Appointment
    if (msg.includes('appointment') || msg === '3') {
        return {
            text: '📅 Appointment Booking:\n\n✅ Available Slots Tomorrow:\n\n🌅 Morning: 10:00 AM, 11:00 AM\n🌞 Afternoon: 2:00 PM, 3:00 PM\n🌆 Evening: 5:00 PM, 6:30 PM\n\nकौन सा slot चुनेंगे?',
            type: 'text'
        };
    }

    // Measurements
    if (msg.includes('measurement') || msg === '4') {
        return {
            text: '📏 Measurements:\n\n👔 Shirt:\n• Chest, Shoulder, Length, Sleeve\n\n👖 Pant:\n• Waist, Length, Hip\n\nएक-एक करके बताइए!',
            type: 'text'
        };
    }

    // Address
    if (msg.includes('address') || msg === '5') {
        return {
            text: `📍 Shop Address:\n\n🏪 ${CONFIG.SHOP_NAME}\n${CONFIG.SHOP_ADDRESS}\n\n📞 ${CONFIG.SHOP_PHONE}\n\n⏰ Mon-Sat: 10 AM - 8 PM`,
            type: 'text'
        };
    }

    // Name collection
    if (!customerName && msg.length > 2 && msg.length < 30) {
        saveCustomer(customerPhone, { name: message });
        return {
            text: `बहुत खूब ${message} जी! 🙏\n\nकैसे help कर सकता हूँ?\n\n💰 Prices\n📦 Order\n📅 Appointment\n📏 Measurements\n📍 Location`,
            type: 'text'
        };
    }

    // Default
    return {
        text: 'मुझे समझ नहीं आया 🤔\n\nमैं इनमें help कर सकता हूँ:\n\n💰 Prices\n📦 Order Status\n📅 Appointment\n📏 Measurements\n📍 Location',
        type: 'text'
    };
}

// API Endpoints
app.post('/api/chat', (req, res) => {
    try {
        const { phone, message } = req.body;
        
        if (!phone || !message) {
            return res.status(400).json({ 
                success: false, 
                error: 'Phone and message required' 
            });
        }
        
        const response = getAgentResponse(message, phone);
        res.json({ success: true, response });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.get('/api/customer/:phone', (req, res) => {
    const customer = getCustomer(req.params.phone);
    if (customer) {
        res.json({ success: true, customer });
    } else {
        res.status(404).json({ success: false, error: 'Customer not found' });
    }
});

app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Start Server
app.listen(CONFIG.PORT, () => {
    console.log(`Server running on port ${CONFIG.PORT}`);
    console.log(`Shop: ${CONFIG.SHOP_NAME}`);
});

module.exports = app;
```

- Click "Commit new file"

---

**File 3: Create `.env.example`**
```
PORT=3000
WHATSAPP_API_KEY=your_api_key_here
GOOGLE_CLIENT_EMAIL=your_email@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY=your_key_here
SPREADSHEET_ID=your_sheet_id_here
```

- Click "Commit new file"

---

**File 4: Create `.gitignore`**
```
node_modules/
.env
*.log
.DS_Store
.idea/
*.swp
