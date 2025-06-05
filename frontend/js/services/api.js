// api.js - خدمة الاتصال بالخادم

const API_BASE_URL = 'https://api.chartdepth.com'; // سيتم استبداله بعنوان API الحقيقي عند النشر

class ApiService {
    constructor() {
        this.token = localStorage.getItem('chartdepth_token');
    }
    
    // تعيين رمز المصادقة
    setToken(token) {
        this.token = token;
        localStorage.setItem('chartdepth_token', token);
    }
    
    // إزالة رمز المصادقة
    clearToken() {
        this.token = null;
        localStorage.removeItem('chartdepth_token');
    }
    
    // الحصول على رؤوس الطلب مع رمز المصادقة
    getHeaders() {
        const headers = {
            'Content-Type': 'application/json'
        };
        
        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }
        
        return headers;
    }
    
    // طلب GET عام
    async get(endpoint) {
        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                method: 'GET',
                headers: this.getHeaders()
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error(`Error fetching data from ${endpoint}:`, error);
            throw error;
        }
    }
    
    // طلب POST عام
    async post(endpoint, data) {
        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                method: 'POST',
                headers: this.getHeaders(),
                body: JSON.stringify(data)
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error(`Error posting data to ${endpoint}:`, error);
            throw error;
        }
    }
    
    // طلب PUT عام
    async put(endpoint, data) {
        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                method: 'PUT',
                headers: this.getHeaders(),
                body: JSON.stringify(data)
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error(`Error updating data at ${endpoint}:`, error);
            throw error;
        }
    }
    
    // طلب DELETE عام
    async delete(endpoint) {
        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                method: 'DELETE',
                headers: this.getHeaders()
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error(`Error deleting data at ${endpoint}:`, error);
            throw error;
        }
    }
    
    // دوال خاصة بالمصادقة
    async login(email, password) {
        try {
            // في الإصدار النهائي، سيتم استبدال هذا بطلب API حقيقي
            // محاكاة لعملية تسجيل الدخول
            return new Promise((resolve) => {
                setTimeout(() => {
                    const mockToken = `mock-token-${Date.now()}`;
                    this.setToken(mockToken);
                    resolve({ token: mockToken, user: { email } });
                }, 1000);
            });
        } catch (error) {
            console.error('Error during login:', error);
            throw error;
        }
    }
    
    async logout() {
        this.clearToken();
        return { success: true };
    }
    
    // دوال خاصة بالإشارات
    async getSignals(type = 'active') {
        try {
            // في الإصدار النهائي، سيتم استبدال هذا بطلب API حقيقي
            return new Promise((resolve) => {
                setTimeout(() => {
                    // بيانات تجريبية للإشارات النشطة
                    const mockActiveSignals = [
                        { id: 1, pair: 'EUR/USD', type: 'buy', entryPrice: '1.0915', stopLoss: '1.0890', target: '1.0965', time: '10:30', date: 'اليوم', status: 'active', profit: null },
                        { id: 2, pair: 'GBP/USD', type: 'sell', entryPrice: '1.2760', stopLoss: '1.2785', target: '1.2710', time: '09:45', date: 'اليوم', status: 'active', profit: null },
                        { id: 3, pair: 'USD/JPY', type: 'buy', entryPrice: '107.65', stopLoss: '107.40', target: '108.10', time: '08:15', date: 'اليوم', status: 'active', profit: null },
                        { id: 4, pair: 'AUD/USD', type: 'sell', entryPrice: '0.6940', stopLoss: '0.6965', target: '0.6890', time: '14:20', date: 'أمس', status: 'active', profit: null }
                    ];
                    
                    // بيانات تجريبية للإشارات المغلقة
                    const mockClosedSignals = [
                        { id: 5, pair: 'EUR/JPY', type: 'buy', entryPrice: '121.30', stopLoss: '121.00', target: '122.00', time: '11:45', date: 'أمس', status: 'closed', profit: '+70 نقطة' },
                        { id: 6, pair: 'USD/CAD', type: 'sell', entryPrice: '1.3550', stopLoss: '1.3575', target: '1.3500', time: '13:20', date: '2 يونيو', status: 'closed', profit: '+50 نقطة' },
                        { id: 7, pair: 'GBP/JPY', type: 'buy', entryPrice: '135.60', stopLoss: '135.30', target: '136.20', time: '09:30', date: '1 يونيو', status: 'closed', profit: '-30 نقطة' },
                        { id: 8, pair: 'AUD/JPY', type: 'sell', entryPrice: '74.80', stopLoss: '75.05', target: '74.30', time: '15:10', date: '1 يونيو', status: 'closed', profit: '+50 نقطة' }
                    ];
                    
                    if (type === 'active') {
                        resolve(mockActiveSignals);
                    } else if (type === 'closed') {
                        resolve(mockClosedSignals);
                    } else {
                        resolve([]);
                    }
                }, 500);
            });
        } catch (error) {
            console.error('Error fetching signals:', error);
            throw error;
        }
    }
    
    async getSignalStatistics() {
        try {
            // في الإصدار النهائي، سيتم استبدال هذا بطلب API حقيقي
            return new Promise((resolve) => {
                setTimeout(() => {
                    // بيانات تجريبية للإحصائيات
                    const mockStatistics = {
                        totalSignals: 120,
                        successRate: 76,
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
                            buy: 65,
                            sell: 55
                        },
                        signalsByPair: {
                            'EUR/USD': 28,
                            'GBP/USD': 22,
                            'USD/JPY': 18,
                            'AUD/USD': 15,
                            'EUR/JPY': 12,
                            'أخرى': 25
                        }
                    };
                    
                    resolve(mockStatistics);
                }, 500);
            });
        } catch (error) {
            console.error('Error fetching signal statistics:', error);
            throw error;
        }
    }
    
    // دوال خاصة بالأنماط
    async getPatterns(type = 'price') {
        try {
            // في الإصدار النهائي، سيتم استبدال هذا بطلب API حقيقي
            return new Promise((resolve) => {
                setTimeout(() => {
                    // بيانات تجريبية لأنماط السعر
                    const mockPricePatterns = [
                        { id: 1, pair: 'EUR/USD', type: 'Double Top', timeframe: '4h', level: '1.0950', direction: 'bearish', confidence: 'high', date: 'اليوم' },
                        { id: 2, pair: 'GBP/USD', type: 'Head and Shoulders', timeframe: '1d', level: '1.2780', direction: 'bearish', confidence: 'medium', date: 'اليوم' },
                        { id: 3, pair: 'USD/JPY', type: 'Bull Flag', timeframe: '1h', level: '107.80', direction: 'bullish', confidence: 'high', date: 'أمس' },
                        { id: 4, pair: 'AUD/USD', type: 'Triple Bottom', timeframe: '4h', level: '0.6920', direction: 'bullish', confidence: 'medium', date: 'أمس' }
                    ];
                    
                    // بيانات تجريبية للأنماط المتناغمة
                    const mockHarmonicPatterns = [
                        { id: 5, pair: 'EUR/USD', type: 'Gartley', timeframe: '4h', level: '1.0930', direction: 'bullish', confidence: 'high', date: 'اليوم' },
                        { id: 6, pair: 'GBP/USD', type: 'Butterfly', timeframe: '1d', level: '1.2750', direction: 'bearish', confidence: 'high', date: 'اليوم' },
                        { id: 7, pair: 'USD/JPY', type: 'Bat', timeframe: '4h', level: '107.60', direction: 'bullish', confidence: 'medium', date: 'أمس' },
                        { id: 8, pair: 'EUR/JPY', type: 'Crab', timeframe: '1d', level: '121.50', direction: 'bearish', confidence: 'high', date: '2 يونيو' }
                    ];
                    
                    // بيانات تجريبية لمناطق الانعكاس
                    const mockReversalZones = [
                        { id: 9, pair: 'EUR/USD', type: 'Support', timeframe: '4h', level: '1.0880-1.0900', direction: 'bullish', confidence: 'high', date: 'اليوم' },
                        { id: 10, pair: 'GBP/USD', type: 'Resistance', timeframe: '1d', level: '1.2800-1.2820', direction: 'bearish', confidence: 'high', date: 'اليوم' },
                        { id: 11, pair: 'USD/JPY', type: 'Support', timeframe: '1d', level: '107.20-107.40', direction: 'bullish', confidence: 'medium', date: 'أمس' },
                        { id: 12, pair: 'AUD/USD', type: 'Resistance', timeframe: '4h', level: '0.6950-0.6970', direction: 'bearish', confidence: 'high', date: 'أمس' }
                    ];
                    
                    if (type === 'price') {
                        resolve(mockPricePatterns);
                    } else if (type === 'harmonic') {
                        resolve(mockHarmonicPatterns);
                    } else if (type === 'reversal') {
                        resolve(mockReversalZones);
                    } else {
                        resolve([]);
                    }
                }, 500);
            });
        } catch (error) {
            console.error('Error fetching patterns:', error);
            throw error;
        }
    }
    
    // دوال خاصة بالتقويم الاقتصادي
    async getEconomicCalendar(filters = {}) {
        try {
            // في الإصدار النهائي، سيتم استبدال هذا بطلب API حقيقي
            return new Promise((resolve) => {
                setTimeout(() => {
                    // بيانات تجريبية للأحداث الاقتصادية
                    const mockEvents = [
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
                    
                    // تطبيق التصفية
                    let filteredEvents = [...mockEvents];
                    
                    if (filters.currency && filters.currency !== 'all') {
                        filteredEvents = filteredEvents.filter(event => event.currency === filters.currency);
                    }
                    
                    if (filters.impact && filters.impact !== 'all') {
                        filteredEvents = filteredEvents.filter(event => event.impact === filters.impact);
                    }
                    
                    resolve(filteredEvents);
                }, 500);
            });
        } catch (error) {
            console.error('Error fetching economic calendar:', error);
            throw error;
        }
    }
    
    // دوال خاصة بالرسوم البيانية
    async getChartData(pair, timeframe) {
        try {
            // في الإصدار النهائي، سيتم استبدال هذا بطلب API حقيقي
            return new Promise((resolve) => {
                setTimeout(() => {
                    // إنشاء بيانات تجريبية للرسم البياني
                    const generateCandlestickData = () => {
                        const data = [];
                        const basePrice = pair === 'EURUSD' ? 1.09 : 
                                        pair === 'GBPUSD' ? 1.27 : 
                                        pair === 'USDJPY' ? 107.5 : 
                                        pair === 'AUDUSD' ? 0.69 : 
                                        pair === 'USDCAD' ? 1.35 : 1.21;
                        
                        const now = new Date();
                        const timeIncrement = timeframe === '5m' ? 5 * 60 * 1000 : 
                                            timeframe === '15m' ? 15 * 60 * 1000 : 
                                            timeframe === '30m' ? 30 * 60 * 1000 : 
                                            timeframe === '1h' ? 60 * 60 * 1000 : 
                                            timeframe === '4h' ? 4 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000;
                        
                        for (let i = 0; i < 100; i++) {
                            const time = new Date(now.getTime() - (100 - i) * timeIncrement);
                            
                            const volatility = 0.002;
                            const open = basePrice + (Math.random() - 0.5) * volatility * 10;
                            const high = open + Math.random() * volatility;
                            const low = open - Math.random() * volatility;
                            const close = (open + high + low) / 3 + (Math.random() - 0.5) * volatility;
                            
                            data.push({
                                time: time.getTime() / 1000,
                                open: open,
                                high: high,
                                low: low,
                                close: close
                            });
                        }
                        
                        return data;
                    };
                    
                    resolve(generateCandlestickData());
                }, 500);
            });
        } catch (error) {
            console.error('Error fetching chart data:', error);
            throw error;
        }
    }
    
    // دوال خاصة بإعدادات المستخدم
    async getUserSettings() {
        try {
            // في الإصدار النهائي، سيتم استبدال هذا بطلب API حقيقي
            return new Promise((resolve) => {
                setTimeout(() => {
                    const mockUserSettings = {
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
                    };
                    
                    resolve(mockUserSettings);
                }, 500);
            });
        } catch (error) {
            console.error('Error fetching user settings:', error);
            throw error;
        }
    }
    
    async updateUserSettings(settings) {
        try {
            // في الإصدار النهائي، سيتم استبدال هذا بطلب API حقيقي
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve({ success: true, settings });
                }, 1000);
            });
        } catch (error) {
            console.error('Error updating user settings:', error);
            throw error;
        }
    }
}

// إنشاء نسخة واحدة من الخدمة للاستخدام في جميع أنحاء التطبيق
const apiService = new ApiService();

// تصدير الخدمة
// export default apiService;
