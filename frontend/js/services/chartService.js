// chartService.js - خدمة الرسوم البيانية والتحليل الفني

class ChartService {
    constructor() {
        this.chartInstances = {};
    }
    
    // إنشاء رسم بياني جديد
    createChart(container, options = {}) {
        if (!container) {
            throw new Error('يجب توفير عنصر HTML لإنشاء الرسم البياني');
        }
        
        const defaultOptions = {
            width: container.clientWidth,
            height: 500,
            layout: {
                backgroundColor: '#121212',
                textColor: '#d1d4dc',
            },
            grid: {
                vertLines: {
                    color: 'rgba(42, 46, 57, 0.5)',
                },
                horzLines: {
                    color: 'rgba(42, 46, 57, 0.5)',
                },
            },
            timeScale: {
                timeVisible: true,
                secondsVisible: false,
            },
        };
        
        const chartOptions = { ...defaultOptions, ...options };
        
        // إنشاء الرسم البياني باستخدام مكتبة TradingView Lightweight Charts
        const chart = LightweightCharts.createChart(container, chartOptions);
        
        // تخزين مرجع الرسم البياني
        const chartId = `chart_${Date.now()}`;
        this.chartInstances[chartId] = chart;
        
        // إعادة تحجيم الرسم البياني عند تغيير حجم النافذة
        const handleResize = () => {
            if (chart && container) {
                chart.applyOptions({ 
                    width: container.clientWidth 
                });
            }
        };
        
        window.addEventListener('resize', handleResize);
        
        return {
            chartId,
            chart,
            cleanup: () => {
                window.removeEventListener('resize', handleResize);
                if (this.chartInstances[chartId]) {
                    delete this.chartInstances[chartId];
                }
            }
        };
    }
    
    // إضافة سلسلة شموع يابانية إلى الرسم البياني
    addCandlestickSeries(chartId, options = {}) {
        const chart = this.chartInstances[chartId];
        if (!chart) {
            throw new Error(`الرسم البياني غير موجود: ${chartId}`);
        }
        
        const defaultOptions = {
            upColor: '#00C853',
            downColor: '#FF3D00',
            borderUpColor: '#00C853',
            borderDownColor: '#FF3D00',
            wickUpColor: '#00C853',
            wickDownColor: '#FF3D00',
        };
        
        const seriesOptions = { ...defaultOptions, ...options };
        return chart.addCandlestickSeries(seriesOptions);
    }
    
    // إضافة سلسلة خطية إلى الرسم البياني
    addLineSeries(chartId, options = {}) {
        const chart = this.chartInstances[chartId];
        if (!chart) {
            throw new Error(`الرسم البياني غير موجود: ${chartId}`);
        }
        
        const defaultOptions = {
            color: '#2196F3',
            lineWidth: 2,
        };
        
        const seriesOptions = { ...defaultOptions, ...options };
        return chart.addLineSeries(seriesOptions);
    }
    
    // إضافة مؤشر المتوسط المتحرك
    addMovingAverage(chartId, series, data, period = 14, color = '#FFA726') {
        const chart = this.chartInstances[chartId];
        if (!chart || !series || !data || !data.length) {
            throw new Error('بيانات غير كافية لإضافة المتوسط المتحرك');
        }
        
        // حساب المتوسط المتحرك
        const maData = this.calculateMA(data, period);
        
        // إنشاء سلسلة خطية للمتوسط المتحرك
        const maSeries = chart.addLineSeries({
            color: color,
            lineWidth: 2,
            priceLineVisible: false,
        });
        
        // تعيين البيانات
        maSeries.setData(maData);
        
        return maSeries;
    }
    
    // حساب المتوسط المتحرك
    calculateMA(data, period) {
        const result = [];
        
        for (let i = period - 1; i < data.length; i++) {
            let sum = 0;
            for (let j = 0; j < period; j++) {
                sum += data[i - j].close;
            }
            
            result.push({
                time: data[i].time,
                value: sum / period
            });
        }
        
        return result;
    }
    
    // إضافة مؤشر القوة النسبية (RSI)
    addRSI(chartId, data, period = 14, overbought = 70, oversold = 30) {
        const chart = this.chartInstances[chartId];
        if (!chart || !data || !data.length) {
            throw new Error('بيانات غير كافية لإضافة مؤشر القوة النسبية');
        }
        
        // حساب مؤشر القوة النسبية
        const rsiData = this.calculateRSI(data, period);
        
        // إنشاء رسم بياني منفصل للمؤشر
        const rsiSeries = chart.addLineSeries({
            color: '#9C27B0',
            lineWidth: 2,
            priceLineVisible: false,
            pane: 1,
            title: 'RSI',
        });
        
        // إضافة خطوط الإفراط في الشراء والبيع
        const overboughtSeries = chart.addLineSeries({
            color: 'rgba(255, 0, 0, 0.5)',
            lineWidth: 1,
            priceLineVisible: false,
            pane: 1,
        });
        
        const oversoldSeries = chart.addLineSeries({
            color: 'rgba(0, 255, 0, 0.5)',
            lineWidth: 1,
            priceLineVisible: false,
            pane: 1,
        });
        
        // تعيين البيانات
        rsiSeries.setData(rsiData);
        
        const overboughtData = rsiData.map(item => ({
            time: item.time,
            value: overbought
        }));
        
        const oversoldData = rsiData.map(item => ({
            time: item.time,
            value: oversold
        }));
        
        overboughtSeries.setData(overboughtData);
        oversoldSeries.setData(oversoldData);
        
        return {
            rsiSeries,
            overboughtSeries,
            oversoldSeries
        };
    }
    
    // حساب مؤشر القوة النسبية (RSI)
    calculateRSI(data, period) {
        const result = [];
        let gains = 0;
        let losses = 0;
        
        // حساب المتوسط الأولي للمكاسب والخسائر
        for (let i = 1; i <= period; i++) {
            const change = data[i].close - data[i - 1].close;
            if (change >= 0) {
                gains += change;
            } else {
                losses -= change;
            }
        }
        
        let avgGain = gains / period;
        let avgLoss = losses / period;
        
        // حساب RSI للفترة الأولى
        let rs = avgGain / avgLoss;
        let rsi = 100 - (100 / (1 + rs));
        
        result.push({
            time: data[period].time,
            value: rsi
        });
        
        // حساب RSI للفترات المتبقية
        for (let i = period + 1; i < data.length; i++) {
            const change = data[i].close - data[i - 1].close;
            let currentGain = 0;
            let currentLoss = 0;
            
            if (change >= 0) {
                currentGain = change;
            } else {
                currentLoss = -change;
            }
            
            // حساب المتوسط المتحرك للمكاسب والخسائر
            avgGain = ((avgGain * (period - 1)) + currentGain) / period;
            avgLoss = ((avgLoss * (period - 1)) + currentLoss) / period;
            
            rs = avgGain / avgLoss;
            rsi = 100 - (100 / (1 + rs));
            
            result.push({
                time: data[i].time,
                value: rsi
            });
        }
        
        return result;
    }
    
    // إضافة حدود بولينجر
    addBollingerBands(chartId, series, data, period = 20, stdDev = 2) {
        const chart = this.chartInstances[chartId];
        if (!chart || !series || !data || !data.length) {
            throw new Error('بيانات غير كافية لإضافة حدود بولينجر');
        }
        
        // حساب حدود بولينجر
        const bbands = this.calculateBollingerBands(data, period, stdDev);
        
        // إنشاء سلسلة خطية للحد العلوي
        const upperSeries = chart.addLineSeries({
            color: 'rgba(76, 175, 80, 0.5)',
            lineWidth: 1,
            priceLineVisible: false,
        });
        
        // إنشاء سلسلة خطية للحد السفلي
        const lowerSeries = chart.addLineSeries({
            color: 'rgba(76, 175, 80, 0.5)',
            lineWidth: 1,
            priceLineVisible: false,
        });
        
        // إنشاء سلسلة خطية للمتوسط المتحرك
        const middleSeries = chart.addLineSeries({
            color: 'rgba(76, 175, 80, 1)',
            lineWidth: 1,
            priceLineVisible: false,
        });
        
        // تعيين البيانات
        upperSeries.setData(bbands.upper);
        middleSeries.setData(bbands.middle);
        lowerSeries.setData(bbands.lower);
        
        return {
            upperSeries,
            middleSeries,
            lowerSeries
        };
    }
    
    // حساب حدود بولينجر
    calculateBollingerBands(data, period, stdDev) {
        const upper = [];
        const middle = [];
        const lower = [];
        
        for (let i = period - 1; i < data.length; i++) {
            let sum = 0;
            for (let j = 0; j < period; j++) {
                sum += data[i - j].close;
            }
            
            const sma = sum / period;
            
            let squaredDiffSum = 0;
            for (let j = 0; j < period; j++) {
                squaredDiffSum += Math.pow(data[i - j].close - sma, 2);
            }
            
            const stdDevValue = Math.sqrt(squaredDiffSum / period);
            
            middle.push({
                time: data[i].time,
                value: sma
            });
            
            upper.push({
                time: data[i].time,
                value: sma + (stdDevValue * stdDev)
            });
            
            lower.push({
                time: data[i].time,
                value: sma - (stdDevValue * stdDev)
            });
        }
        
        return { upper, middle, lower };
    }
    
    // إضافة مؤشر MACD
    addMACD(chartId, data, fastPeriod = 12, slowPeriod = 26, signalPeriod = 9) {
        const chart = this.chartInstances[chartId];
        if (!chart || !data || !data.length) {
            throw new Error('بيانات غير كافية لإضافة مؤشر MACD');
        }
        
        // حساب مؤشر MACD
        const macdData = this.calculateMACD(data, fastPeriod, slowPeriod, signalPeriod);
        
        // إنشاء سلسلة خطية لخط MACD
        const macdSeries = chart.addLineSeries({
            color: '#2196F3',
            lineWidth: 2,
            priceLineVisible: false,
            pane: 1,
            title: 'MACD',
        });
        
        // إنشاء سلسلة خطية لخط الإشارة
        const signalSeries = chart.addLineSeries({
            color: '#FF5722',
            lineWidth: 1,
            priceLineVisible: false,
            pane: 1,
        });
        
        // تعيين البيانات
        macdSeries.setData(macdData.macd);
        signalSeries.setData(macdData.signal);
        
        return {
            macdSeries,
            signalSeries
        };
    }
    
    // حساب مؤشر MACD
    calculateMACD(data, fastPeriod, slowPeriod, signalPeriod) {
        // حساب المتوسط المتحرك الأسي السريع
        const fastEMA = this.calculateEMA(data, fastPeriod);
        
        // حساب المتوسط المتحرك الأسي البطيء
        const slowEMA = this.calculateEMA(data, slowPeriod);
        
        // حساب خط MACD
        const macdLine = [];
        for (let i = slowPeriod - 1; i < data.length; i++) {
            const fastValue = fastEMA[i - (slowPeriod - fastPeriod)].value;
            const slowValue = slowEMA[i - (slowPeriod - slowPeriod)].value;
            
            macdLine.push({
                time: data[i].time,
                value: fastValue - slowValue
            });
        }
        
        // حساب خط الإشارة (المتوسط المتحرك الأسي لخط MACD)
        const signalLine = this.calculateEMAFromValues(macdLine, signalPeriod);
        
        return {
            macd: macdLine,
            signal: signalLine
        };
    }
    
    // حساب المتوسط المتحرك الأسي
    calculateEMA(data, period) {
        const result = [];
        
        // حساب المتوسط المتحرك البسيط للفترة الأولى
        let sum = 0;
        for (let i = 0; i < period; i++) {
            sum += data[i].close;
        }
        
        let ema = sum / period;
        
        result.push({
            time: data[period - 1].time,
            value: ema
        });
        
        // حساب المعامل
        const multiplier = 2 / (period + 1);
        
        // حساب EMA للفترات المتبقية
        for (let i = period; i < data.length; i++) {
            ema = (data[i].close - ema) * multiplier + ema;
            
            result.push({
                time: data[i].time,
                value: ema
            });
        }
        
        return result;
    }
    
    // حساب المتوسط المتحرك الأسي من قيم
    calculateEMAFromValues(data, period) {
        const result = [];
        
        // حساب المتوسط المتحرك البسيط للفترة الأولى
        let sum = 0;
        for (let i = 0; i < period; i++) {
            sum += data[i].value;
        }
        
        let ema = sum / period;
        
        result.push({
            time: data[period - 1].time,
            value: ema
        });
        
        // حساب المعامل
        const multiplier = 2 / (period + 1);
        
        // حساب EMA للفترات المتبقية
        for (let i = period; i < data.length; i++) {
            ema = (data[i].value - ema) * multiplier + ema;
            
            result.push({
                time: data[i].time,
                value: ema
            });
        }
        
        return result;
    }
    
    // إزالة الرسم البياني
    removeChart(chartId) {
        if (this.chartInstances[chartId]) {
            delete this.chartInstances[chartId];
            return true;
        }
        return false;
    }
}

// إنشاء نسخة واحدة من الخدمة للاستخدام في جميع أنحاء التطبيق
const chartService = new ChartService();

// تصدير الخدمة
// export default chartService;
