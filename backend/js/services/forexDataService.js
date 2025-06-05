// forexDataService.js - خدمة بيانات الفوركس الحية

class ForexDataService {
    constructor() {
        this.apiService = apiService; // استخدام خدمة API المعرفة سابقاً
        this.websocket = null;
        this.priceListeners = {};
        this.isConnected = false;
        this.lastPrices = {};
    }
    
    // بدء اتصال WebSocket للأسعار المباشرة
    connectToPriceFeed() {
        if (this.websocket) {
            this.disconnectFromPriceFeed();
        }
        
        // في الإصدار النهائي، سيتم استبدال هذا بعنوان WebSocket حقيقي
        // محاكاة اتصال WebSocket
        this.isConnected = true;
        
        // محاكاة استلام تحديثات الأسعار كل ثانية
        this.priceInterval = setInterval(() => {
            if (this.isConnected) {
                // تحديث الأسعار لجميع الأزواج المشترك بها
                Object.keys(this.priceListeners).forEach(pair => {
                    if (this.priceListeners[pair].length > 0) {
                        const mockPrice = this.generateMockPrice(pair);
                        this.lastPrices[pair] = mockPrice;
                        this.notifyPriceListeners(pair, mockPrice);
                    }
                });
            }
        }, 1000);
        
        return true;
    }
    
    // إنهاء اتصال WebSocket
    disconnectFromPriceFeed() {
        if (this.priceInterval) {
            clearInterval(this.priceInterval);
            this.priceInterval = null;
        }
        
        this.isConnected = false;
        return true;
    }
    
    // الاشتراك في تحديثات أسعار زوج عملات محدد
    subscribeToPair(pair, listener) {
        if (typeof listener !== 'function') {
            return false;
        }
        
        // إنشاء مصفوفة للمستمعين إذا لم تكن موجودة
        if (!this.priceListeners[pair]) {
            this.priceListeners[pair] = [];
        }
        
        // إضافة المستمع إذا لم يكن موجوداً بالفعل
        if (!this.priceListeners[pair].includes(listener)) {
            this.priceListeners[pair].push(listener);
            
            // إذا كان هذا هو المستمع الأول، ابدأ الاتصال
            if (!this.isConnected) {
                this.connectToPriceFeed();
            }
            
            // إرسال السعر الحالي فوراً إذا كان متاحاً
            if (this.lastPrices[pair]) {
                listener(this.lastPrices[pair]);
            }
            
            return true;
        }
        
        return false;
    }
    
    // إلغاء الاشتراك من تحديثات أسعار زوج عملات محدد
    unsubscribeFromPair(pair, listener) {
        if (!this.priceListeners[pair]) {
            return false;
        }
        
        const index = this.priceListeners[pair].indexOf(listener);
        if (index !== -1) {
            this.priceListeners[pair].splice(index, 1);
            
            // إذا لم يعد هناك مستمعون لهذا الزوج، إزالة المصفوفة
            if (this.priceListeners[pair].length === 0) {
                delete this.priceListeners[pair];
            }
            
            // إذا لم يعد هناك أي مستمعين على الإطلاق، أنهِ الاتصال
            if (Object.keys(this.priceListeners).length === 0) {
                this.disconnectFromPriceFeed();
            }
            
            return true;
        }
        
        return false;
    }
    
    // إخطار جميع المستمعين لزوج عملات محدد
    notifyPriceListeners(pair, price) {
        if (!this.priceListeners[pair]) {
            return;
        }
        
        this.priceListeners[pair].forEach(listener => {
            try {
                listener(price);
            } catch (error) {
                console.error(`Error in price listener for ${pair}:`, error);
            }
        });
    }
    
    // توليد سعر تجريبي لزوج عملات محدد
    generateMockPrice(pair) {
        // استخدام السعر السابق كأساس إذا كان متاحاً
        let basePrice;
        if (this.lastPrices[pair]) {
            basePrice = this.lastPrices[pair].price;
        } else {
            // تعيين سعر أساسي بناءً على الزوج
            switch (pair) {
                case 'EURUSD':
                    basePrice = 1.09;
                    break;
                case 'GBPUSD':
                    basePrice = 1.27;
                    break;
                case 'USDJPY':
                    basePrice = 107.5;
                    break;
                case 'AUDUSD':
                    basePrice = 0.69;
                    break;
                case 'USDCAD':
                    basePrice = 1.35;
                    break;
                case 'EURJPY':
                    basePrice = 121.0;
                    break;
                default:
                    basePrice = 1.0;
            }
        }
        
        // إضافة تغيير عشوائي صغير للسعر
        const change = (Math.random() - 0.5) * 0.0005;
        const newPrice = parseFloat((basePrice + change).toFixed(5));
        
        // تحديد اتجاه التغيير
        const direction = newPrice > basePrice ? 'up' : newPrice < basePrice ? 'down' : 'neutral';
        
        // حساب نسبة التغيير
        const percentChange = basePrice ? ((newPrice - basePrice) / basePrice * 100).toFixed(3) : '0.000';
        
        return {
            pair,
            price: newPrice,
            bid: parseFloat((newPrice - 0.0001).toFixed(5)),
            ask: parseFloat((newPrice + 0.0001).toFixed(5)),
            high: parseFloat((newPrice + 0.001).toFixed(5)),
            low: parseFloat((newPrice - 0.001).toFixed(5)),
            change: direction === 'up' ? `+${percentChange}%` : direction === 'down' ? `${percentChange}%` : '0.000%',
            direction,
            timestamp: new Date().getTime()
        };
    }
    
    // الحصول على بيانات تاريخية لزوج عملات محدد
    async getHistoricalData(pair, timeframe, limit = 100) {
        try {
            // في الإصدار النهائي، سيتم استبدال هذا بطلب API حقيقي
            return new Promise((resolve) => {
                setTimeout(() => {
                    // توليد بيانات تاريخية تجريبية
                    const data = this.generateHistoricalData(pair, timeframe, limit);
                    resolve(data);
                }, 500);
            });
        } catch (error) {
            console.error(`Error fetching historical data for ${pair} on ${timeframe}:`, error);
            throw error;
        }
    }
    
    // توليد بيانات تاريخية تجريبية
    generateHistoricalData(pair, timeframe, limit) {
        const data = [];
        const now = new Date();
        
        // تحديد الفاصل الزمني بناءً على الإطار الزمني
        let timeIncrement;
        switch (timeframe) {
            case '1m':
                timeIncrement = 60 * 1000; // دقيقة واحدة
                break;
            case '5m':
                timeIncrement = 5 * 60 * 1000; // 5 دقائق
                break;
            case '15m':
                timeIncrement = 15 * 60 * 1000; // 15 دقيقة
                break;
            case '30m':
                timeIncrement = 30 * 60 * 1000; // 30 دقيقة
                break;
            case '1h':
                timeIncrement = 60 * 60 * 1000; // ساعة واحدة
                break;
            case '4h':
                timeIncrement = 4 * 60 * 60 * 1000; // 4 ساعات
                break;
            case '1d':
                timeIncrement = 24 * 60 * 60 * 1000; // يوم واحد
                break;
            default:
                timeIncrement = 60 * 60 * 1000; // ساعة واحدة كافتراضي
        }
        
        // تحديد السعر الأساسي بناءً على الزوج
        let basePrice;
        switch (pair) {
            case 'EURUSD':
                basePrice = 1.09;
                break;
            case 'GBPUSD':
                basePrice = 1.27;
                break;
            case 'USDJPY':
                basePrice = 107.5;
                break;
            case 'AUDUSD':
                basePrice = 0.69;
                break;
            case 'USDCAD':
                basePrice = 1.35;
                break;
            case 'EURJPY':
                basePrice = 121.0;
                break;
            default:
                basePrice = 1.0;
        }
        
        // توليد بيانات تاريخية
        for (let i = 0; i < limit; i++) {
            const time = new Date(now.getTime() - (limit - i) * timeIncrement);
            
            // إضافة تقلب عشوائي للسعر
            const volatility = 0.002;
            const open = basePrice + (Math.random() - 0.5) * volatility * 10;
            const high = open + Math.random() * volatility;
            const low = open - Math.random() * volatility;
            const close = (open + high + low) / 3 + (Math.random() - 0.5) * volatility;
            
            // إضافة اتجاه عام للسعر
            const trend = Math.sin(i / 10) * volatility * 5;
            
            data.push({
                time: time.getTime() / 1000,
                open: parseFloat((open + trend).toFixed(5)),
                high: parseFloat((high + trend).toFixed(5)),
                low: parseFloat((low + trend).toFixed(5)),
                close: parseFloat((close + trend).toFixed(5)),
                volume: Math.floor(Math.random() * 1000) + 500
            });
            
            // تحديث السعر الأساسي للشمعة التالية
            basePrice = parseFloat((close + trend).toFixed(5));
        }
        
        return data;
    }
    
    // الحصول على أزواج العملات المتاحة
    async getAvailablePairs() {
        try {
            // في الإصدار النهائي، سيتم استبدال هذا بطلب API حقيقي
            return new Promise((resolve) => {
                setTimeout(() => {
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
                    resolve(pairs);
                }, 300);
            });
        } catch (error) {
            console.error('Error fetching available pairs:', error);
            throw error;
        }
    }
}

// إنشاء نسخة واحدة من الخدمة للاستخدام في جميع أنحاء التطبيق
const forexDataService = new ForexDataService();

// تصدير الخدمة
// export default forexDataService;
