// server.js - ملف الخادم الرئيسي للتطبيق

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const WebSocket = require('ws');
const http = require('http');
const path = require('path');

// إنشاء تطبيق Express
const app = express();
const PORT = process.env.PORT || 3000;

// إعداد الخادم HTTP
const server = http.createServer(app);

// إعداد خادم WebSocket
const wss = new WebSocket.Server({ server });

// استيراد الخدمات
const databaseService = require(require('path').resolve(__dirname, './services/databaseService.js'));
const forexDataService = require('./services/forexDataService');
const signalService = require('./services/signalService');
const calendarService = require('./services/calendarService');

// إعداد middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// سر JWT للمصادقة
const JWT_SECRET = process.env.JWT_SECRET || 'chartdepth_secret_key';

// middleware للتحقق من المصادقة
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ error: 'غير مصرح' });
    }
    
    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'رمز غير صالح' });
        }
        
        req.user = user;
        next();
    });
};

// مسارات API للمصادقة
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // التحقق من وجود البريد الإلكتروني وكلمة المرور
        if (!email || !password) {
            return res.status(400).json({ error: 'البريد الإلكتروني وكلمة المرور مطلوبان' });
        }
        
        // البحث عن المستخدم في قاعدة البيانات
        const user = databaseService.getUserByEmail(email);
        
        // التحقق من وجود المستخدم
        if (!user) {
            return res.status(401).json({ error: 'بيانات الاعتماد غير صالحة' });
        }
        
        // التحقق من كلمة المرور
        // في الإصدار النهائي، سيتم استخدام bcrypt للتحقق من كلمة المرور
        // const isPasswordValid = await bcrypt.compare(password, user.password);
        const isPasswordValid = password === 'password123'; // للتجربة فقط
        
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'بيانات الاعتماد غير صالحة' });
        }
        
        // إنشاء رمز JWT
        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            JWT_SECRET,
            { expiresIn: '24h' }
        );
        
        // إرسال الرمز والمعلومات الأساسية للمستخدم
        res.json({
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ error: 'حدث خطأ أثناء تسجيل الدخول' });
    }
});

app.post('/api/auth/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        
        // التحقق من وجود البيانات المطلوبة
        if (!name || !email || !password) {
            return res.status(400).json({ error: 'جميع الحقول مطلوبة' });
        }
        
        // التحقق من عدم وجود المستخدم بالفعل
        const existingUser = databaseService.getUserByEmail(email);
        if (existingUser) {
            return res.status(409).json({ error: 'البريد الإلكتروني مستخدم بالفعل' });
        }
        
        // تشفير كلمة المرور
        // في الإصدار النهائي، سيتم استخدام bcrypt لتشفير كلمة المرور
        // const hashedPassword = await bcrypt.hash(password, 10);
        const hashedPassword = password; // للتجربة فقط
        
        // إنشاء المستخدم الجديد
        const newUser = {
            name,
            email,
            password: hashedPassword,
            role: 'user',
            settings: {
                account: {
                    name,
                    email,
                    phone: '',
                    language: 'ar',
                    timezone: 'Asia/Riyadh'
                },
                notifications: {
                    newSignals: true,
                    signalUpdates: true,
                    economicEvents: true,
                    patternDetection: true,
                    emailNotifications: true,
                    pushNotifications: true
                },
                display: {
                    theme: 'dark',
                    chartStyle: 'candles',
                    defaultTimeframe: '1h',
                    defaultPair: 'EURUSD'
                }
            }
        };
        
        // إضافة المستخدم إلى قاعدة البيانات
        const user = databaseService.addUser(newUser);
        
        // إنشاء رمز JWT
        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            JWT_SECRET,
            { expiresIn: '24h' }
        );
        
        // إرسال الرمز والمعلومات الأساسية للمستخدم
        res.status(201).json({
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ error: 'حدث خطأ أثناء التسجيل' });
    }
});

app.post('/api/auth/reset-password', async (req, res) => {
    try {
        const { email } = req.body;
        
        // التحقق من وجود البريد الإلكتروني
        if (!email) {
            return res.status(400).json({ error: 'البريد الإلكتروني مطلوب' });
        }
        
        // التحقق من وجود المستخدم
        const user = databaseService.getUserByEmail(email);
        if (!user) {
            // لأسباب أمنية، لا نكشف عن عدم وجود المستخدم
            return res.json({ message: 'إذا كان البريد الإلكتروني مسجلاً، فستتلقى رسالة إعادة تعيين كلمة المرور' });
        }
        
        // في الإصدار النهائي، سيتم إرسال بريد إلكتروني لإعادة تعيين كلمة المرور
        
        res.json({ message: 'إذا كان البريد الإلكتروني مسجلاً، فستتلقى رسالة إعادة تعيين كلمة المرور' });
    } catch (error) {
        console.error('Error during password reset:', error);
        res.status(500).json({ error: 'حدث خطأ أثناء إعادة تعيين كلمة المرور' });
    }
});

// مسارات API للإشارات
app.get('/api/signals', authenticateToken, (req, res) => {
    try {
        const { type } = req.query;
        
        let signals;
        if (type === 'active') {
            signals = databaseService.getActiveSignals();
        } else if (type === 'closed') {
            signals = databaseService.getClosedSignals();
        } else {
            signals = [...databaseService.getActiveSignals(), ...databaseService.getClosedSignals()];
        }
        
        res.json(signals);
    } catch (error) {
        console.error('Error fetching signals:', error);
        res.status(500).json({ error: 'حدث خطأ أثناء جلب الإشارات' });
    }
});

app.get('/api/signals/statistics', authenticateToken, (req, res) => {
    try {
        // في الإصدار النهائي، سيتم حساب الإحصائيات الحقيقية
        const activeSignals = databaseService.getActiveSignals();
        const closedSignals = databaseService.getClosedSignals();
        
        // حساب إحصائيات تجريبية
        const totalSignals = closedSignals.length;
        const successfulSignals = closedSignals.filter(signal => signal.profit && signal.profit.includes('+')).length;
        const successRate = totalSignals > 0 ? Math.round((successfulSignals / totalSignals) * 100) : 0;
        
        const statistics = {
            totalSignals: activeSignals.length + closedSignals.length,
            successRate,
            averageProfit: 45,
            averageLoss: 28,
            profitFactor: 1.8,
            monthlyPerformance: [
                { month: 'يناير', profit: 320 },
                { month: 'فبراير', profit: 280 },
                { month: 'مارس', profit: 350 },
                { month: 'أبريل', profit: 410 },
                { month: 'مايو', profit: 390 },
                { month: 'يونيو', profit: 180 }
            ],
            signalsByType: {
                buy: closedSignals.filter(signal => signal.type === 'buy').length,
                sell: closedSignals.filter(signal => signal.type === 'sell').length
            },
            signalsByPair: {
                'EUR/USD': closedSignals.filter(signal => signal.pair === 'EUR/USD').length,
                'GBP/USD': closedSignals.filter(signal => signal.pair === 'GBP/USD').length,
                'USD/JPY': closedSignals.filter(signal => signal.pair === 'USD/JPY').length,
                'AUD/USD': closedSignals.filter(signal => signal.pair === 'AUD/USD').length,
                'EUR/JPY': closedSignals.filter(signal => signal.pair === 'EUR/JPY').length,
                'أخرى': closedSignals.filter(signal => !['EUR/USD', 'GBP/USD', 'USD/JPY', 'AUD/USD', 'EUR/JPY'].includes(signal.pair)).length
            }
        };
        
        res.json(statistics);
    } catch (error) {
        console.error('Error fetching signal statistics:', error);
        res.status(500).json({ error: 'حدث خطأ أثناء جلب إحصائيات الإشارات' });
    }
});

// مسارات API للأنماط
app.get('/api/patterns', authenticateToken, (req, res) => {
    try {
        const { type } = req.query;
        
        if (!type || !['price', 'harmonic', 'reversal'].includes(type)) {
            return res.status(400).json({ error: 'نوع النمط غير صالح' });
        }
        
        const patterns = databaseService.getPatterns(type);
        res.json(patterns);
    } catch (error) {
        console.error('Error fetching patterns:', error);
        res.status(500).json({ error: 'حدث خطأ أثناء جلب الأنماط' });
    }
});

// مسارات API للتقويم الاقتصادي
app.get('/api/calendar', authenticateToken, (req, res) => {
    try {
        const { currency, impact } = req.query;
        
        const filters = {};
        if (currency) {
            filters.currency = currency;
        }
        if (impact) {
            filters.impact = impact;
        }
        
        const events = databaseService.getCalendarEvents(filters);
        res.json(events);
    } catch (error) {
        console.error('Error fetching calendar events:', error);
        res.status(500).json({ error: 'حدث خطأ أثناء جلب أحداث التقويم' });
    }
});

// مسارات API لبيانات الفوركس
app.get('/api/forex/pairs', authenticateToken, (req, res) => {
    try {
        // قائمة أزواج العملات المتاحة
        const pairs = [
            { value: 'EURUSD', label: 'EUR/USD' },
            { value: 'GBPUSD', label: 'GBP/USD' },
            { value: 'USDJPY', label: 'USD/JPY' },
            { value: 'AUDUSD', label: 'AUD/USD' },
            { value: 'USDCAD', label: 'USD/CAD' },
            { value: 'EURJPY', label: 'EUR/JPY' },
            { value: 'GBPJPY', label: 'GBP/JPY' },
            { value: 'EURGBP', label: 'EUR/GBP' },
            { value: 'USDCHF', label: 'USD/CHF' },
            { value: 'NZDUSD', label: 'NZD/USD' }
        ];
        
        res.json(pairs);
    } catch (error) {
        console.error('Error fetching forex pairs:', error);
        res.status(500).json({ error: 'حدث خطأ أثناء جلب أزواج العملات' });
    }
});

app.get('/api/forex/historical', authenticateToken, (req, res) => {
    try {
        const { pair, timeframe, limit } = req.query;
        
        // التحقق من وجود البيانات المطلوبة
        if (!pair || !timeframe) {
            return res.status(400).json({ error: 'الزوج والإطار الزمني مطلوبان' });
        }
        
        // توليد بيانات تاريخية تجريبية
        const data = forexDataService.generateHistoricalData(pair, timeframe, limit ? parseInt(limit) : 100);
        res.json(data);
    } catch (error) {
        console.error('Error fetching historical data:', error);
        res.status(500).json({ error: 'حدث خطأ أثناء جلب البيانات التاريخية' });
    }
});

// مسارات API لإعدادات المستخدم
app.get('/api/user/settings', authenticateToken, (req, res) => {
    try {
        const userId = req.user.id;
        const user = databaseService.getUserById(userId);
        
        if (!user) {
            return res.status(404).json({ error: 'المستخدم غير موجود' });
        }
        
        res.json(user.settings);
    } catch (error) {
        console.error('Error fetching user settings:', error);
        res.status(500).json({ error: 'حدث خطأ أثناء جلب إعدادات المستخدم' });
    }
});

app.put('/api/user/settings', authenticateToken, (req, res) => {
    try {
        const userId = req.user.id;
        const settings = req.body;
        
        const updatedSettings = databaseService.updateUserSettings(userId, settings);
        
        if (!updatedSettings) {
            return res.status(404).json({ error: 'المستخدم غير موجود' });
        }
        
        res.json(updatedSettings);
    } catch (error) {
        console.error('Error updating user settings:', error);
        res.status(500).json({ error: 'حدث خطأ أثناء تحديث إعدادات المستخدم' });
    }
});

// إعداد WebSocket للإشارات المباشرة وتحديثات الأسعار
wss.on('connection', (ws) => {
    console.log('Client connected to WebSocket');
    
    // إرسال رسالة ترحيبية
    ws.send(JSON.stringify({ type: 'welcome', message: 'مرحباً بك في خدمة WebSocket لـ كوكبة تاسي' }));
    
    // معالجة الرسائل الواردة
    ws.on('message', (message) => {
        try {
            const data = JSON.parse(message);
            
            // معالجة طلبات الاشتراك
            if (data.type === 'subscribe') {
                if (data.channel === 'signals') {
                    // الاشتراك في قناة الإشارات
                    ws.signalSubscription = true;
                    ws.send(JSON.stringify({ type: 'subscription', channel: 'signals', status: 'success' }));
                } else if (data.channel === 'prices' && data.pair) {
                    // الاشتراك في تحديثات أسعار زوج محدد
                    if (!ws.priceSubscriptions) {
                        ws.priceSubscriptions = [];
                    }
                    
                    if (!ws.priceSubscriptions.includes(data.pair)) {
                        ws.priceSubscriptions.push(data.pair);
                    }
                    
                    ws.send(JSON.stringify({ type: 'subscription', channel: 'prices', pair: data.pair, status: 'success' }));
                    
                    // إرسال السعر الحالي فوراً
                    const currentPrice = forexDataService.generateMockPrice(data.pair);
                    ws.send(JSON.stringify({ type: 'price', data: currentPrice }));
                }
            }
            // معالجة طلبات إلغاء الاشتراك
            else if (data.type === 'unsubscribe') {
                if (data.channel === 'signals') {
                    ws.signalSubscription = false;
                    ws.send(JSON.stringify({ type: 'unsubscription', channel: 'signals', status: 'success' }));
                } else if (data.channel === 'prices' && data.pair && ws.priceSubscriptions) {
                    const index = ws.priceSubscriptions.indexOf(data.pair);
                    if (index !== -1) {
                        ws.priceSubscriptions.splice(index, 1);
                    }
                    
                    ws.send(JSON.stringify({ type: 'unsubscription', channel: 'prices', pair: data.pair, status: 'success' }));
                }
            }
        } catch (error) {
            console.error('Error processing WebSocket message:', error);
            ws.send(JSON.stringify({ type: 'error', message: 'حدث خطأ أثناء معالجة الرسالة' }));
        }
    });
    
    // معالجة إغلاق الاتصال
    ws.on('close', () => {
        console.log('Client disconnected from WebSocket');
    });
});

// إرسال تحديثات الأسعار إلى العملاء المشتركين
setInterval(() => {
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN && client.priceSubscriptions && client.priceSubscriptions.length > 0) {
            client.priceSubscriptions.forEach((pair) => {
                const price = forexDataService.generateMockPrice(pair);
                client.send(JSON.stringify({ type: 'price', data: price }));
            });
        }
    });
}, 1000);

// إرسال إشارات جديدة إلى العملاء المشتركين
setInterval(() => {
    // توليد إشارة جديدة بشكل عشوائي (بمعدل منخفض)
    if (Math.random() < 0.05) { // 5% فرصة لتوليد إشارة جديدة
        const newSignal = signalService.generateMockSignal();
        
        // إضافة الإشارة إلى قاعدة البيانات
        databaseService.addSignal(newSignal);
        
        // إرسال الإشارة إلى العملاء المشتركين
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN && client.signalSubscription) {
                client.send(JSON.stringify({ type: 'signal', data: newSignal }));
            }
        });
    }
}, 30000);

// مسار للصفحة الرئيسية
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// بدء تشغيل الخادم
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
