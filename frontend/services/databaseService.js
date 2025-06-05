// databaseService.js - خدمة قاعدة البيانات وإدارة البيانات

class DatabaseService {
    constructor() {
        // في الإصدار النهائي، سيتم استبدال هذا بقاعدة بيانات حقيقية
        // محاكاة لقاعدة بيانات باستخدام localStorage
        this.db = {
            users: {},
            signals: {
                active: [],
                closed: []
            },
            patterns: {
                price: [],
                harmonic: [],
                reversal: []
            },
            calendar: [],
            settings: {}
        };
        
        // تهيئة قاعدة البيانات
        this.initializeDatabase();
    }
    
    // تهيئة قاعدة البيانات بالبيانات الأولية
    initializeDatabase() {
        try {
            // محاولة استرداد البيانات من localStorage
            const savedData = localStorage.getItem('koukaba_tasi_token');
            if (savedData) {
                this.db = JSON.parse(savedData);
            } else {
                // إنشاء بيانات تجريبية إذا لم تكن موجودة
                this.createMockData();
                this.saveDatabase();
            }
        } catch (error) {
            console.error('Error initializing database:', error);
            // إنشاء بيانات تجريبية في حالة الخطأ
            this.createMockData();
            this.saveDatabase();
        }
    }
    
    // حفظ قاعدة البيانات
    saveDatabase() {
        try {
            localStorage.setItem('koukaba_tasi_token', JSON.stringify(this.db));
            return true;
        } catch (error) {
            console.error('Error saving database:', error);
            return false;
        }
    }
    
    // إنشاء بيانات تجريبية
    createMockData() {
        // بيانات تجريبية للمستخدمين
        this.db.users = {
            'user123': {
                id: 'user123',
                name: 'المستخدم',
                email: 'user@example.com',
                password: 'hashed_password', // في الإصدار النهائي، سيتم تشفير كلمات المرور
                role: 'user',
                settings: {
                    account: {
                        name: 'المستخدم',
                        email: 'user@example.com',
                        phone: '+966 5XXXXXXXX',
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
            }
        };
        
        // بيانات تجريبية للإشارات النشطة
        this.db.signals.active = [
            { id: 1, pair: 'EUR/USD', type: 'buy', entryPrice: '1.0915', stopLoss: '1.0890', target: '1.0965', time: '10:30', date: 'اليوم', status: 'active', profit: null },
            { id: 2, pair: 'GBP/USD', type: 'sell', entryPrice: '1.2760', stopLoss: '1.2785', target: '1.2710', time: '09:45', date: 'اليوم', status: 'active', profit: null },
            { id: 3, pair: 'USD/JPY', type: 'buy', entryPrice: '107.65', stopLoss: '107.40', target: '108.10', time: '08:15', date: 'اليوم', status: 'active', profit: null },
            { id: 4, pair: 'AUD/USD', type: 'sell', entryPrice: '0.6940', stopLoss: '0.6965', target: '0.6890', time: '14:20', date: 'أمس', status: 'active', profit: null }
        ];
        
        // بيانات تجريبية للإشارات المغلقة
        this.db.signals.closed = [
            { id: 5, pair: 'EUR/JPY', type: 'buy', entryPrice: '121.30', stopLoss: '121.00', target: '122.00', time: '11:45', date: 'أمس', status: 'closed', profit: '+70 نقطة' },
            { id: 6, pair: 'USD/CAD', type: 'sell', entryPrice: '1.3550', stopLoss: '1.3575', target: '1.3500', time: '13:20', date: '2 يونيو', status: 'closed', profit: '+50 نقطة' },
            { id: 7, pair: 'GBP/JPY', type: 'buy', entryPrice: '135.60', stopLoss: '135.30', target: '136.20', time: '09:30', date: '1 يونيو', status: 'closed', profit: '-30 نقطة' },
            { id: 8, pair: 'AUD/JPY', type: 'sell', entryPrice: '74.80', stopLoss: '75.05', target: '74.30', time: '15:10', date: '1 يونيو', status: 'closed', profit: '+50 نقطة' }
        ];
        
        // بيانات تجريبية لأنماط السعر
        this.db.patterns.price = [
            { id: 1, pair: 'EUR/USD', type: 'Double Top', timeframe: '4h', level: '1.0950', direction: 'bearish', confidence: 'high', date: 'اليوم' },
            { id: 2, pair: 'GBP/USD', type: 'Head and Shoulders', timeframe: '1d', level: '1.2780', direction: 'bearish', confidence: 'medium', date: 'اليوم' },
            { id: 3, pair: 'USD/JPY', type: 'Bull Flag', timeframe: '1h', level: '107.80', direction: 'bullish', confidence: 'high', date: 'أمس' },
            { id: 4, pair: 'AUD/USD', type: 'Triple Bottom', timeframe: '4h', level: '0.6920', direction: 'bullish', confidence: 'medium', date: 'أمس' }
        ];
        
        // بيانات تجريبية للأنماط المتناغمة
        this.db.patterns.harmonic = [
            { id: 5, pair: 'EUR/USD', type: 'Gartley', timeframe: '4h', level: '1.0930', direction: 'bullish', confidence: 'high', date: 'اليوم' },
            { id: 6, pair: 'GBP/USD', type: 'Butterfly', timeframe: '1d', level: '1.2750', direction: 'bearish', confidence: 'high', date: 'اليوم' },
            { id: 7, pair: 'USD/JPY', type: 'Bat', timeframe: '4h', level: '107.60', direction: 'bullish', confidence: 'medium', date: 'أمس' },
            { id: 8, pair: 'EUR/JPY', type: 'Crab', timeframe: '1d', level: '121.50', direction: 'bearish', confidence: 'high', date: '2 يونيو' }
        ];
        
        // بيانات تجريبية لمناطق الانعكاس
        this.db.patterns.reversal = [
            { id: 9, pair: 'EUR/USD', type: 'Support', timeframe: '4h', level: '1.0880-1.0900', direction: 'bullish', confidence: 'high', date: 'اليوم' },
            { id: 10, pair: 'GBP/USD', type: 'Resistance', timeframe: '1d', level: '1.2800-1.2820', direction: 'bearish', confidence: 'high', date: 'اليوم' },
            { id: 11, pair: 'USD/JPY', type: 'Support', timeframe: '1d', level: '107.20-107.40', direction: 'bullish', confidence: 'medium', date: 'أمس' },
            { id: 12, pair: 'AUD/USD', type: 'Resistance', timeframe: '4h', level: '0.6950-0.6970', direction: 'bearish', confidence: 'high', date: 'أمس' }
        ];
        
        // بيانات تجريبية للتقويم الاقتصادي
        this.db.calendar = [
            { id: 1, time: '08:30', date: 'اليوم', event: 'مؤشر أسعار المستهلك الأمريكي', country: 'الولايات المتحدة', currency: 'USD', impact: 'high', previous: '0.4%', forecast: '0.3%', actual: '?' },
            { id: 2, time: '10:00', date: 'اليوم', event: 'قرار سعر الفائدة للبنك المركزي الأوروبي', country: 'منطقة اليورو', currency: 'EUR', impact: 'high', previous: '0.0%', forecast: '0.0%', actual: '?' },
            { id: 3, time: '12:30', date: 'اليوم', event: 'مبيعات التجزئة البريطانية', country: 'المملكة المتحدة', currency: 'GBP', impact: 'medium', previous: '-0.2%', forecast: '0.5%', actual: '?' },
            { id: 4, time: '14:00', date: 'اليوم', event: 'مؤشر ثقة المستهلك الأمريكي', country: 'الولايات المتحدة', currency: 'USD', impact: 'medium', previous: '96.1', forecast: '97.0', actual: '?' },
            { id: 5, time: '23:50', date: 'اليوم', event: 'الميزان التجاري الياباني', country: 'اليابان', currency: 'JPY', impact: 'medium', previous: '-930B', forecast: '-1000B', actual: '?' },
            { id: 6, time: '08:30', date: 'غداً', event: 'معدل البطالة الأسترالي', country: 'أستراليا', currency: 'AUD', impact: 'high', previous: '5.2%', forecast: '5.3%', actual: '?' },
            { id: 7, time: '13:30', date: 'غداً', event: 'طلبات إعانة البطالة الأمريكية', country: 'الولايات المتحدة', currency: 'USD', impact: 'medium', previous: '220K', forecast: '215K', actual: '?' },
            { id: 8, time: '15:00', date: 'غداً', event: 'مؤشر مديري المشتريات الصناعي الأوروبي', country: 'منطقة اليورو', currency: 'EUR', impact: 'high', previous: '51.2', forecast: '51.5', actual: '?' },
            { id: 9, time: '09:30', date: 'بعد غد', event: 'الناتج المحلي الإجمالي البريطاني', country: 'المملكة المتحدة', currency: 'GBP', impact: 'high', previous: '0.3%', forecast: '0.4%', actual: '?' },
            { id: 10, time: '14:30', date: 'بعد غد', event: 'مؤشر أسعار المنتجين الكندي', country: 'كندا', currency: 'CAD', impact: 'low', previous: '0.1%', forecast: '0.2%', actual: '?' }
        ];
    }
    
    // إضافة مستخدم جديد
    addUser(user) {
        if (!user.id) {
            user.id = `user_${Date.now()}`;
        }
        
        this.db.users[user.id] = user;
        this.saveDatabase();
        return user;
    }
    
    // الحصول على مستخدم بواسطة البريد الإلكتروني
    getUserByEmail(email) {
        return Object.values(this.db.users).find(user => user.email === email);
    }
    
    // الحصول على مستخدم بواسطة المعرف
    getUserById(id) {
        return this.db.users[id];
    }
    
    // تحديث بيانات المستخدم
    updateUser(id, userData) {
        if (this.db.users[id]) {
            this.db.users[id] = { ...this.db.users[id], ...userData };
            this.saveDatabase();
            return this.db.users[id];
        }
        return null;
    }
    
    // تحديث إعدادات المستخدم
    updateUserSettings(id, settings) {
        if (this.db.users[id]) {
            this.db.users[id].settings = { ...this.db.users[id].settings, ...settings };
            this.saveDatabase();
            return this.db.users[id].settings;
        }
        return null;
    }
    
    // إضافة إشارة جديدة
    addSignal(signal) {
        if (!signal.id) {
            signal.id = Date.now();
        }
        
        if (signal.status === 'active') {
            this.db.signals.active.push(signal);
        } else if (signal.status === 'closed') {
            this.db.signals.closed.push(signal);
        }
        
        this.saveDatabase();
        return signal;
    }
    
    // تحديث حالة إشارة
    updateSignalStatus(id, status, profit = null) {
        // البحث عن الإشارة في الإشارات النشطة
        const signalIndex = this.db.signals.active.findIndex(signal => signal.id === id);
        
        if (signalIndex !== -1) {
            const signal = { ...this.db.signals.active[signalIndex] };
            signal.status = status;
            
            if (profit !== null) {
                signal.profit = profit;
            }
            
            // إزالة الإشارة من الإشارات النشطة
            this.db.signals.active.splice(signalIndex, 1);
            
            // إضافة الإشارة إلى الإشارات المغلقة إذا كانت مغلقة
            if (status === 'closed') {
                this.db.signals.closed.push(signal);
            } else {
                // إعادة الإشارة إلى الإشارات النشطة إذا لم تكن مغلقة
                this.db.signals.active.push(signal);
            }
            
            this.saveDatabase();
            return signal;
        }
        
        return null;
    }
    
    // الحصول على الإشارات النشطة
    getActiveSignals() {
        return this.db.signals.active;
    }
    
    // الحصول على الإشارات المغلقة
    getClosedSignals() {
        return this.db.signals.closed;
    }
    
    // إضافة نمط جديد
    addPattern(pattern, type) {
        if (!pattern.id) {
            pattern.id = Date.now();
        }
        
        if (this.db.patterns[type]) {
            this.db.patterns[type].push(pattern);
            this.saveDatabase();
            return pattern;
        }
        
        return null;
    }
    
    // الحصول على الأنماط حسب النوع
    getPatterns(type) {
        return this.db.patterns[type] || [];
    }
    
    // إضافة حدث اقتصادي جديد
    addCalendarEvent(event) {
        if (!event.id) {
            event.id = Date.now();
        }
        
        this.db.calendar.push(event);
        this.saveDatabase();
        return event;
    }
    
    // الحصول على أحداث التقويم الاقتصادي
    getCalendarEvents(filters = {}) {
        let events = [...this.db.calendar];
        
        // تطبيق التصفية
        if (filters.currency && filters.currency !== 'all') {
            events = events.filter(event => event.currency === filters.currency);
        }
        
        if (filters.impact && filters.impact !== 'all') {
            events = events.filter(event => event.impact === filters.impact);
        }
        
        return events;
    }
    
    // تحديث نتيجة حدث اقتصادي
    updateCalendarEventResult(id, actual) {
        const eventIndex = this.db.calendar.findIndex(event => event.id === id);
        
        if (eventIndex !== -1) {
            this.db.calendar[eventIndex].actual = actual;
            this.saveDatabase();
            return this.db.calendar[eventIndex];
        }
        
        return null;
    }
}

// إنشاء نسخة واحدة من الخدمة للاستخدام في جميع أنحاء التطبيق
const databaseService = new DatabaseService();

// تصدير الخدمة
module.exports = databaseService;
