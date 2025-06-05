// signalService.js - خدمة إشارات الفوركس والتحليل

class SignalService {
    constructor() {
        this.apiService = apiService; // استخدام خدمة API المعرفة سابقاً
        this.websocket = null;
        this.signalListeners = [];
        this.isConnected = false;
    }
    
    // بدء اتصال WebSocket للإشارات المباشرة
    connectToSignalFeed() {
        if (this.websocket) {
            this.disconnectFromSignalFeed();
        }
        
        // في الإصدار النهائي، سيتم استبدال هذا بعنوان WebSocket حقيقي
        // محاكاة اتصال WebSocket
        this.isConnected = true;
        
        // محاكاة استلام إشارات جديدة كل 30 ثانية
        this.signalInterval = setInterval(() => {
            if (this.isConnected && this.signalListeners.length > 0) {
                const mockSignal = this.generateMockSignal();
                this.notifyListeners(mockSignal);
            }
        }, 30000);
        
        return true;
    }
    
    // إنهاء اتصال WebSocket
    disconnectFromSignalFeed() {
        if (this.signalInterval) {
            clearInterval(this.signalInterval);
            this.signalInterval = null;
        }
        
        this.isConnected = false;
        return true;
    }
    
    // إضافة مستمع للإشارات
    addSignalListener(listener) {
        if (typeof listener === 'function' && !this.signalListeners.includes(listener)) {
            this.signalListeners.push(listener);
            
            // إذا كان هذا هو المستمع الأول، ابدأ الاتصال
            if (this.signalListeners.length === 1 && !this.isConnected) {
                this.connectToSignalFeed();
            }
            
            return true;
        }
        return false;
    }
    
    // إزالة مستمع للإشارات
    removeSignalListener(listener) {
        const index = this.signalListeners.indexOf(listener);
        if (index !== -1) {
            this.signalListeners.splice(index, 1);
            
            // إذا لم يعد هناك مستمعون، أنهِ الاتصال
            if (this.signalListeners.length === 0 && this.isConnected) {
                this.disconnectFromSignalFeed();
            }
            
            return true;
        }
        return false;
    }
    
    // إخطار جميع المستمعين بإشارة جديدة
    notifyListeners(signal) {
        this.signalListeners.forEach(listener => {
            try {
                listener(signal);
            } catch (error) {
                console.error('Error in signal listener:', error);
            }
        });
    }
    
    // توليد إشارة تجريبية
    generateMockSignal() {
        const pairs = ['EUR/USD', 'GBP/USD', 'USD/JPY', 'AUD/USD', 'USD/CAD', 'EUR/JPY'];
        const types = ['buy', 'sell'];
        
        const randomPair = pairs[Math.floor(Math.random() * pairs.length)];
        const randomType = types[Math.floor(Math.random() * types.length)];
        
        // توليد سعر عشوائي بناءً على الزوج
        let basePrice;
        switch (randomPair) {
            case 'EUR/USD':
                basePrice = 1.09 + (Math.random() * 0.02 - 0.01);
                break;
            case 'GBP/USD':
                basePrice = 1.27 + (Math.random() * 0.02 - 0.01);
                break;
            case 'USD/JPY':
                basePrice = 107.5 + (Math.random() * 0.5 - 0.25);
                break;
            case 'AUD/USD':
                basePrice = 0.69 + (Math.random() * 0.01 - 0.005);
                break;
            case 'USD/CAD':
                basePrice = 1.35 + (Math.random() * 0.02 - 0.01);
                break;
            case 'EUR/JPY':
                basePrice = 121.0 + (Math.random() * 0.5 - 0.25);
                break;
            default:
                basePrice = 1.0 + Math.random();
        }
        
        // تقريب السعر إلى 5 أرقام عشرية
        basePrice = parseFloat(basePrice.toFixed(5));
        
        // حساب وقف الخسارة والهدف بناءً على نوع الإشارة
        let stopLoss, target;
        if (randomType === 'buy') {
            stopLoss = parseFloat((basePrice - 0.0025).toFixed(5));
            target = parseFloat((basePrice + 0.005).toFixed(5));
        } else {
            stopLoss = parseFloat((basePrice + 0.0025).toFixed(5));
            target = parseFloat((basePrice - 0.005).toFixed(5));
        }
        
        // الحصول على الوقت الحالي
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        
        return {
            id: Date.now(),
            pair: randomPair,
            type: randomType,
            entryPrice: basePrice.toString(),
            stopLoss: stopLoss.toString(),
            target: target.toString(),
            time: `${hours}:${minutes}`,
            date: 'اليوم',
            status: 'active',
            profit: null,
            confidence: Math.random() > 0.3 ? 'high' : 'medium',
            analysis: `إشارة ${randomType === 'buy' ? 'شراء' : 'بيع'} على ${randomPair} بناءً على اختراق مستوى مهم وتأكيد مؤشرات فنية متعددة.`
        };
    }
    
    // الحصول على الإشارات النشطة
    async getActiveSignals() {
        try {
            return await this.apiService.getSignals('active');
        } catch (error) {
            console.error('Error fetching active signals:', error);
            throw error;
        }
    }
    
    // الحصول على الإشارات المغلقة
    async getClosedSignals() {
        try {
            return await this.apiService.getSignals('closed');
        } catch (error) {
            console.error('Error fetching closed signals:', error);
            throw error;
        }
    }
    
    // الحصول على إحصائيات الإشارات
    async getSignalStatistics() {
        try {
            return await this.apiService.getSignalStatistics();
        } catch (error) {
            console.error('Error fetching signal statistics:', error);
            throw error;
        }
    }
    
    // تحليل زوج عملات محدد
    async analyzeForexPair(pair, timeframe) {
        try {
            // في الإصدار النهائي، سيتم استبدال هذا بتحليل حقيقي
            return new Promise((resolve) => {
                setTimeout(() => {
                    const analysis = {
                        pair,
                        timeframe,
                        trend: Math.random() > 0.5 ? 'bullish' : 'bearish',
                        strength: Math.floor(Math.random() * 100),
                        support: parseFloat((Math.random() * 0.1 + 1.0).toFixed(5)),
                        resistance: parseFloat((Math.random() * 0.1 + 1.1).toFixed(5)),
                        indicators: {
                            rsi: Math.floor(Math.random() * 100),
                            macd: Math.random() > 0.5 ? 'positive' : 'negative',
                            ma: Math.random() > 0.5 ? 'above' : 'below'
                        },
                        recommendation: Math.random() > 0.6 ? 'buy' : Math.random() > 0.3 ? 'sell' : 'neutral',
                        patterns: [
                            Math.random() > 0.7 ? 'Double Top' : null,
                            Math.random() > 0.7 ? 'Head and Shoulders' : null,
                            Math.random() > 0.7 ? 'Bull Flag' : null
                        ].filter(Boolean)
                    };
                    
                    resolve(analysis);
                }, 1000);
            });
        } catch (error) {
            console.error(`Error analyzing ${pair} on ${timeframe}:`, error);
            throw error;
        }
    }
    
    // الحصول على أنماط السعر
    async getPricePatterns() {
        try {
            return await this.apiService.getPatterns('price');
        } catch (error) {
            console.error('Error fetching price patterns:', error);
            throw error;
        }
    }
    
    // الحصول على الأنماط المتناغمة
    async getHarmonicPatterns() {
        try {
            return await this.apiService.getPatterns('harmonic');
        } catch (error) {
            console.error('Error fetching harmonic patterns:', error);
            throw error;
        }
    }
    
    // الحصول على مناطق الانعكاس
    async getReversalZones() {
        try {
            return await this.apiService.getPatterns('reversal');
        } catch (error) {
            console.error('Error fetching reversal zones:', error);
            throw error;
        }
    }
}

// إنشاء نسخة واحدة من الخدمة للاستخدام في جميع أنحاء التطبيق
const signalService = new SignalService();

// تصدير الخدمة
// export default signalService;
