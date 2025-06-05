// Charts.js - مكون صفحة الرسوم البيانية
// يستخدم مكتبة TradingView Lightweight Charts لعرض الرسوم البيانية التفاعلية

class ChartsComponent {
    constructor() {
        this.charts = {};
        this.indicators = {};
        this.timeframes = ['1m', '5m', '15m', '1h', '4h', '1d', '1w'];
        this.currentTimeframe = '1h';
        this.currentSymbol = 'EUR/USD';
        this.availableSymbols = ['EUR/USD', 'GBP/USD', 'USD/JPY', 'AUD/USD', 'USD/CAD', 'EUR/GBP'];
        this.availableIndicators = ['MA', 'EMA', 'RSI', 'MACD', 'Bollinger Bands'];
        this.activeIndicators = ['MA'];
        this.chartType = 'candles'; // candles, line, bars
        this.drawingTools = {
            active: null,
            tools: ['freeform', 'line', 'trend', 'fibonacci', 'rectangle', 'circle', 'text', 'clear']
        };
    }

    // تهيئة الرسم البياني
    async initialize(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) {
            console.error('لم يتم العثور على حاوية الرسم البياني');
            return;
        }

        await this.loadTradingViewLibrary();
        this.renderChartPage();
        this.createChart();
        this.loadChartData();
        
        // إضافة استجابة للتغيير في حجم النافذة
        window.addEventListener('resize', this.handleResize.bind(this));
    }

    // تحميل مكتبة TradingView
    async loadTradingViewLibrary() {
        return new Promise((resolve) => {
            if (window.LightweightCharts) {
                resolve();
                return;
            }

            const script = document.createElement('script');
            script.src = 'https://unpkg.com/lightweight-charts@3.8.0/dist/lightweight-charts.standalone.production.js';
            script.onload = () => {
                console.log('تم تحميل مكتبة TradingView بنجاح');
                resolve();
            };
            script.onerror = () => {
                console.error('فشل في تحميل مكتبة TradingView');
                // محاولة تحميل من مصدر بديل
                const fallbackScript = document.createElement('script');
                fallbackScript.src = 'https://cdn.jsdelivr.net/npm/lightweight-charts@3.8.0/dist/lightweight-charts.standalone.production.min.js';
                fallbackScript.onload = () => {
                    console.log('تم تحميل مكتبة TradingView من المصدر البديل');
                    resolve();
                };
                fallbackScript.onerror = () => {
                    console.error('فشل في تحميل مكتبة TradingView من المصدر البديل');
                    resolve(); // نستمر على أي حال
                };
                document.head.appendChild(fallbackScript);
            };
            document.head.appendChild(script);
        });
    }

    // إنشاء واجهة صفحة الرسوم البيانية
    renderChartPage() {
        this.container.innerHTML = '';
        
        // إنشاء هيكل الصفحة
        const chartPageContainer = document.createElement('div');
        chartPageContainer.className = 'charts-page';
        
        // إنشاء شريط الأدوات العلوي
        const toolbarContainer = document.createElement('div');
        toolbarContainer.className = 'charts-toolbar';
        
        // قسم اختيار الزوج
        const symbolSection = document.createElement('div');
        symbolSection.className = 'toolbar-section';
        
        const symbolLabel = document.createElement('label');
        symbolLabel.textContent = 'الزوج';
        
        const symbolSelector = document.createElement('select');
        symbolSelector.className = 'chart-selector';
        this.availableSymbols.forEach(symbol => {
            const option = document.createElement('option');
            option.value = symbol;
            option.textContent = symbol;
            option.selected = symbol === this.currentSymbol;
            symbolSelector.appendChild(option);
        });
        symbolSelector.addEventListener('change', (e) => {
            this.currentSymbol = e.target.value;
            this.loadChartData();
        });
        
        symbolSection.appendChild(symbolLabel);
        symbolSection.appendChild(symbolSelector);
        
        // قسم الإطار الزمني
        const timeframeSection = document.createElement('div');
        timeframeSection.className = 'toolbar-section';
        
        const timeframeLabel = document.createElement('label');
        timeframeLabel.textContent = 'الإطار الزمني';
        timeframeSection.appendChild(timeframeLabel);
        
        const timeframeContainer = document.createElement('div');
        timeframeContainer.className = 'timeframe-selector';
        
        const timeframeMapping = {
            '1m': '1د',
            '5m': '5د',
            '15m': '15د',
            '1h': '1س',
            '4h': '4س',
            '1d': 'يوم',
            '1w': 'أسبوع'
        };
        
        this.timeframes.forEach(timeframe => {
            const button = document.createElement('button');
            button.textContent = timeframeMapping[timeframe] || timeframe;
            button.className = `timeframe-button ${timeframe === this.currentTimeframe ? 'active' : ''}`;
            button.dataset.timeframe = timeframe;
            button.addEventListener('click', (e) => {
                document.querySelectorAll('.timeframe-button').forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                this.currentTimeframe = e.target.dataset.timeframe;
                this.loadChartData();
            });
            timeframeContainer.appendChild(button);
        });
        
        timeframeSection.appendChild(timeframeContainer);
        
        // قسم نوع الرسم
        const chartTypeSection = document.createElement('div');
        chartTypeSection.className = 'toolbar-section';
        
        const chartTypeLabel = document.createElement('label');
        chartTypeLabel.textContent = 'نوع الرسم';
        chartTypeSection.appendChild(chartTypeLabel);
        
        const chartTypeContainer = document.createElement('div');
        chartTypeContainer.className = 'chart-type-selector';
        
        const chartTypes = [
            { id: 'candles', name: 'شموع' },
            { id: 'line', name: 'خط' },
            { id: 'bars', name: 'أعمدة' }
        ];
        
        chartTypes.forEach(type => {
            const button = document.createElement('button');
            button.textContent = type.name;
            button.className = `chart-type-button ${type.id === this.chartType ? 'active' : ''}`;
            button.dataset.type = type.id;
            button.addEventListener('click', (e) => {
                document.querySelectorAll('.chart-type-button').forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                this.chartType = e.target.dataset.type;
                this.updateChartType();
            });
            chartTypeContainer.appendChild(button);
        });
        
        chartTypeSection.appendChild(chartTypeContainer);
        
        // قسم المؤشرات
        const indicatorSection = document.createElement('div');
        indicatorSection.className = 'toolbar-section';
        
        const indicatorButton = document.createElement('button');
        indicatorButton.className = 'indicator-button';
        indicatorButton.textContent = 'إضافة مؤشر';
        
        const indicatorDropdown = document.createElement('div');
        indicatorDropdown.className = 'indicator-dropdown';
        indicatorDropdown.style.display = 'none';
        
        this.availableIndicators.forEach(indicator => {
            const indicatorItem = document.createElement('div');
            indicatorItem.className = 'indicator-item';
            indicatorItem.textContent = indicator;
            indicatorItem.addEventListener('click', () => {
                if (!this.activeIndicators.includes(indicator)) {
                    this.activeIndicators.push(indicator);
                    this.updateIndicators();
                    this.renderActiveIndicators();
                }
                indicatorDropdown.style.display = 'none';
            });
            indicatorDropdown.appendChild(indicatorItem);
        });
        
        indicatorButton.addEventListener('click', () => {
            indicatorDropdown.style.display = indicatorDropdown.style.display === 'none' ? 'block' : 'none';
        });
        
        indicatorSection.appendChild(indicatorButton);
        indicatorSection.appendChild(indicatorDropdown);
        
        // قسم أدوات الرسم
        const drawingToolsSection = document.createElement('div');
        drawingToolsSection.className = 'toolbar-section drawing-tools-section';
        
        const drawingToolsContainer = document.createElement('div');
        drawingToolsContainer.className = 'drawing-tools-container';
        
        const tools = [
            { id: 'freeform', name: 'رسم حر', icon: '✏️' },
            { id: 'line', name: 'خط أفقي', icon: '―' },
            { id: 'trend', name: 'خط اتجاه', icon: '/' },
            { id: 'fibonacci', name: 'فيبوناتشي', icon: '⋮' },
            { id: 'rectangle', name: 'مستطيل', icon: '□' },
            { id: 'circle', name: 'دائرة', icon: '○' },
            { id: 'text', name: 'نص', icon: 'T' },
            { id: 'clear', name: 'مسح', icon: '🗑️' }
        ];
        
        tools.forEach(tool => {
            const toolButton = document.createElement('button');
            toolButton.className = 'drawing-tool-button';
            toolButton.title = tool.name;
            toolButton.textContent = tool.icon;
            toolButton.dataset.tool = tool.id;
            
            toolButton.addEventListener('click', (e) => {
                const toolId = e.target.dataset.tool;
                if (toolId === 'clear') {
                    this.clearDrawings();
                } else {
                    this.activateDrawingTool(toolId);
                    document.querySelectorAll('.drawing-tool-button').forEach(btn => {
                        btn.classList.remove('active');
                    });
                    toolButton.classList.add('active');
                }
            });
            
            drawingToolsContainer.appendChild(toolButton);
        });
        
        drawingToolsSection.appendChild(drawingToolsContainer);
        
        // إنشاء حاوية للتحكم بالرسم البياني (الإطار الزمني، نوع الرسم، المؤشرات)
        const chartControlsContainer = document.createElement('div');
        chartControlsContainer.className = 'chart-controls-container';
        
        // إضافة الأقسام إلى حاوية التحكم بالرسم البياني
        chartControlsContainer.appendChild(timeframeSection);
        chartControlsContainer.appendChild(chartTypeSection);
        chartControlsContainer.appendChild(indicatorSection);
        
        // إضافة جميع الأقسام إلى شريط الأدوات
        toolbarContainer.appendChild(symbolSection);
        toolbarContainer.appendChild(chartControlsContainer);
        toolbarContainer.appendChild(drawingToolsSection);
        
        // حاوية المؤشرات النشطة
        const activeIndicatorsContainer = document.createElement('div');
        activeIndicatorsContainer.className = 'active-indicators';
        activeIndicatorsContainer.id = 'active-indicators';
        
        // حاوية الرسم البياني
        const chartContainer = document.createElement('div');
        chartContainer.className = 'chart-container';
        chartContainer.id = 'chart-container';
        
        // إضافة العناصر إلى الصفحة
        chartPageContainer.appendChild(toolbarContainer);
        chartPageContainer.appendChild(activeIndicatorsContainer);
        chartPageContainer.appendChild(chartContainer);
        
        this.container.appendChild(chartPageContainer);
        
        // عرض المؤشرات النشطة
        this.renderActiveIndicators();
    }
    
    // عرض المؤشرات النشطة
    renderActiveIndicators() {
        const container = document.getElementById('active-indicators');
        if (!container) return;
        
        container.innerHTML = '';
        
        this.activeIndicators.forEach(indicator => {
            const indicatorTag = document.createElement('div');
            indicatorTag.className = 'indicator-tag';
            
            const indicatorName = document.createElement('span');
            indicatorName.textContent = indicator;
            
            const removeButton = document.createElement('button');
            removeButton.className = 'remove-indicator';
            removeButton.innerHTML = '&times;';
            removeButton.addEventListener('click', () => {
                this.activeIndicators = this.activeIndicators.filter(i => i !== indicator);
                this.updateIndicators();
                this.renderActiveIndicators();
            });
            
            indicatorTag.appendChild(indicatorName);
            indicatorTag.appendChild(removeButton);
            container.appendChild(indicatorTag);
        });
    }
    
    // إنشاء الرسم البياني
    createChart() {
        const chartContainer = document.getElementById('chart-container');
        if (!chartContainer || !window.LightweightCharts) {
            console.error('لم يتم العثور على حاوية الرسم البياني أو مكتبة TradingView');
            return;
        }
        
        // تنظيف أي رسوم بيانية سابقة
        if (this.charts.main) {
            chartContainer.innerHTML = '';
        }
        
        // إنشاء رسم بياني جديد
        const chart = window.LightweightCharts.createChart(chartContainer, {
            width: chartContainer.clientWidth,
            height: 700, // زيادة الارتفاع من 650 إلى 700
            layout: {
                backgroundColor: '#131722',
                textColor: '#d9d9d9',
                fontSize: 12,
                fontFamily: 'Arial, sans-serif',
            },
            grid: {
                vertLines: {
                    color: '#1f2937',
                    style: 1,
                    visible: true,
                },
                horzLines: {
                    color: '#1f2937',
                    style: 1,
                    visible: true,
                },
            },
            crosshair: {
                mode: window.LightweightCharts.CrosshairMode.Normal,
                vertLine: {
                    color: '#758696',
                    width: 1,
                    style: 1,
                    labelBackgroundColor: '#758696',
                },
                horzLine: {
                    color: '#758696',
                    width: 1,
                    style: 1,
                    labelBackgroundColor: '#758696',
                },
            },
            rightPriceScale: {
                borderColor: '#1f2937',
                scaleMargins: {
                    top: 0.1,
                    bottom: 0.1,
                },
                visible: true,
            },
            timeScale: {
                borderColor: '#1f2937',
                timeVisible: true,
                secondsVisible: false,
            },
            watermark: {
                visible: true,
                fontSize: 36,
                horzAlign: 'center',
                vertAlign: 'center',
                color: 'rgba(171, 71, 188, 0.1)',
                text: 'كوكبة تاسي',
            },
        });
        
        // إنشاء سلسلة الشموع اليابانية
        const candleSeries = chart.addCandlestickSeries({
            upColor: '#26a69a',
            downColor: '#ef5350',
            borderVisible: false,
            wickUpColor: '#26a69a',
            wickDownColor: '#ef5350',
        });
        
        // تخزين مراجع الرسم البياني
        this.charts = {
            main: chart,
            candleSeries: candleSeries,
            lineSeries: null,
            barSeries: null,
        };
        
        // إنشاء سلسلة الخط والأعمدة (مخفية في البداية)
        this.charts.lineSeries = chart.addLineSeries({
            color: '#2962FF',
            lineWidth: 2,
            visible: false,
        });
        
        this.charts.barSeries = chart.addBarSeries({
            upColor: '#26a69a',
            downColor: '#ef5350',
            visible: false,
        });
        
        // إضافة استجابة للتغيير في حجم النافذة
        this.handleResize();
    }
    
    // معالجة تغيير حجم النافذة
    handleResize() {
        if (!this.charts.main) return;
        
        const chartContainer = document.getElementById('chart-container');
        if (!chartContainer) return;
        
        const width = chartContainer.clientWidth;
        const height = Math.max(700, window.innerHeight * 0.7); // زيادة الارتفاع الأدنى من 650 إلى 700
        
        this.charts.main.resize(width, height);
    }
    
    // تحديث نوع الرسم البياني
    updateChartType() {
        if (!this.charts.main) return;
        
        // تحديث رؤية السلاسل بناءً على نوع الرسم المحدد
        this.charts.candleSeries.applyOptions({ visible: this.chartType === 'candles' });
        this.charts.lineSeries.applyOptions({ visible: this.chartType === 'line' });
        this.charts.barSeries.applyOptions({ visible: this.chartType === 'bars' });
        
        // إعادة تحميل البيانات للنوع المحدد
        this.loadChartData();
    }
    
    // تنشيط أداة الرسم
    activateDrawingTool(toolId) {
        this.drawingTools.active = toolId;
        console.log(`تم تنشيط أداة الرسم: ${toolId}`);
        
        // هنا يمكن إضافة منطق إضافي للتعامل مع أدوات الرسم
        // مثل إضافة مستمعي الأحداث للرسم على الرسم البياني
    }
    
    // مسح الرسومات
    clearDrawings() {
        console.log('تم مسح جميع الرسومات');
        
        // هنا يمكن إضافة منطق لمسح الرسومات من الرسم البياني
    }
    
    // تحميل بيانات الرسم البياني
    loadChartData() {
        if (!this.charts.candleSeries || !this.charts.lineSeries || !this.charts.barSeries) {
            console.error('لم يتم إنشاء سلاسل الرسم البياني بعد');
            return;
        }
        
        // محاكاة تحميل البيانات من API
        const currentDate = new Date();
        const data = this.generateMockChartData(currentDate, 200, this.currentSymbol);
        
        // تحديث البيانات لجميع أنواع الرسوم البيانية
        this.charts.candleSeries.setData(data);
        
        // تحويل بيانات الشموع إلى بيانات خط وأعمدة
        const lineData = data.map(item => ({
            time: item.time,
            value: item.close
        }));
        
        this.charts.lineSeries.setData(lineData);
        this.charts.barSeries.setData(data);
        
        // تحديث المؤشرات
        this.updateIndicators();
    }
    
    // تحديث المؤشرات
    updateIndicators() {
        // إزالة المؤشرات السابقة
        Object.values(this.indicators).forEach(indicator => {
            if (indicator && this.charts.main) {
                this.charts.main.removeSeries(indicator);
            }
        });
        
        this.indicators = {};
        
        // إضافة المؤشرات النشطة
        if (!this.charts.main || !this.charts.candleSeries) return;
        
        this.activeIndicators.forEach(indicatorType => {
            switch (indicatorType) {
                case 'MA':
                    this.addMovingAverage(20, '#2962FF');
                    break;
                case 'EMA':
                    this.addMovingAverage(14, '#FF6D00', true);
                    break;
                case 'RSI':
                    this.addRSI();
                    break;
                case 'MACD':
                    this.addMACD();
                    break;
                case 'Bollinger Bands':
                    this.addBollingerBands();
                    break;
            }
        });
    }
    
    // إضافة المتوسط المتحرك
    addMovingAverage(period, color, isExponential = false) {
        if (!this.charts.main || !this.charts.candleSeries) return;
        
        const type = isExponential ? 'EMA' : 'MA';
        const id = `${type}-${period}`;
        
        const lineSeries = this.charts.main.addLineSeries({
            color: color,
            lineWidth: 2,
            title: `${type} (${period})`,
            priceLineVisible: false,
        });
        
        const candleData = this.charts.candleSeries.data();
        if (!candleData || candleData.length === 0) return;
        
        const maData = this.calculateMA(candleData, period, isExponential);
        lineSeries.setData(maData);
        
        this.indicators[id] = lineSeries;
    }
    
    // إضافة مؤشر RSI
    addRSI() {
        if (!this.charts.main || !this.charts.candleSeries) return;
        
        const id = 'RSI-14';
        const period = 14;
        
        // إنشاء مخطط منفصل للـ RSI
        const rsiSeries = this.charts.main.addLineSeries({
            color: '#9C27B0',
            lineWidth: 2,
            title: `RSI (${period})`,
            priceScaleId: 'rsi',
            pane: 1,
        });
        
        // تكوين مقياس السعر للـ RSI
        rsiSeries.applyOptions({
            priceScale: {
                scaleMargins: {
                    top: 0.1,
                    bottom: 0.1,
                },
                mode: 2, // نطاق ثابت
                autoScale: false,
            },
        });
        
        const candleData = this.charts.candleSeries.data();
        if (!candleData || candleData.length === 0) return;
        
        const rsiData = this.calculateRSI(candleData, period);
        rsiSeries.setData(rsiData);
        
        this.indicators[id] = rsiSeries;
    }
    
    // إضافة مؤشر MACD
    addMACD() {
        if (!this.charts.main || !this.charts.candleSeries) return;
        
        const id = 'MACD';
        const fastPeriod = 12;
        const slowPeriod = 26;
        const signalPeriod = 9;
        
        // إنشاء مخطط منفصل للـ MACD
        const macdLineSeries = this.charts.main.addLineSeries({
            color: '#2962FF',
            lineWidth: 2,
            title: `MACD (${fastPeriod},${slowPeriod},${signalPeriod})`,
            priceScaleId: 'macd',
            pane: 1,
        });
        
        const signalLineSeries = this.charts.main.addLineSeries({
            color: '#FF6D00',
            lineWidth: 1,
            title: 'Signal',
            priceScaleId: 'macd',
            pane: 1,
        });
        
        // تكوين مقياس السعر للـ MACD
        macdLineSeries.applyOptions({
            priceScale: {
                scaleMargins: {
                    top: 0.1,
                    bottom: 0.1,
                },
                mode: 0, // تلقائي
            },
        });
        
        const candleData = this.charts.candleSeries.data();
        if (!candleData || candleData.length === 0) return;
        
        // حساب MACD
        const macdData = this.calculateMACD(candleData, fastPeriod, slowPeriod, signalPeriod);
        
        macdLineSeries.setData(macdData.macdLine);
        signalLineSeries.setData(macdData.signalLine);
        
        this.indicators[`${id}-line`] = macdLineSeries;
        this.indicators[`${id}-signal`] = signalLineSeries;
    }
    
    // إضافة مؤشر بولينجر باندز
    addBollingerBands() {
        if (!this.charts.main || !this.charts.candleSeries) return;
        
        const period = 20;
        const stdDev = 2;
        const id = `BB-${period}`;
        
        const candleData = this.charts.candleSeries.data();
        if (!candleData || candleData.length === 0) return;
        
        // حساب المتوسط المتحرك
        const maData = this.calculateMA(candleData, period, false);
        
        // حساب الانحراف المعياري
        const stdDevData = this.calculateStdDev(candleData, maData, period);
        
        // إنشاء الحدود العليا والسفلى
        const upperBandData = [];
        const lowerBandData = [];
        
        for (let i = 0; i < maData.length; i++) {
            if (stdDevData[i]) {
                upperBandData.push({
                    time: maData[i].time,
                    value: maData[i].value + (stdDev * stdDevData[i])
                });
                
                lowerBandData.push({
                    time: maData[i].time,
                    value: maData[i].value - (stdDev * stdDevData[i])
                });
            }
        }
        
        // إضافة السلاسل إلى الرسم البياني
        const upperBand = this.charts.main.addLineSeries({
            color: 'rgba(41, 98, 255, 0.3)',
            lineWidth: 1,
            title: `BB Upper (${period}, ${stdDev})`,
            priceLineVisible: false,
        });
        
        const middleBand = this.charts.main.addLineSeries({
            color: 'rgba(41, 98, 255, 0.8)',
            lineWidth: 1,
            title: `BB Middle (${period})`,
            priceLineVisible: false,
        });
        
        const lowerBand = this.charts.main.addLineSeries({
            color: 'rgba(41, 98, 255, 0.3)',
            lineWidth: 1,
            title: `BB Lower (${period}, ${stdDev})`,
            priceLineVisible: false,
        });
        
        upperBand.setData(upperBandData);
        middleBand.setData(maData);
        lowerBand.setData(lowerBandData);
        
        this.indicators[`${id}-upper`] = upperBand;
        this.indicators[`${id}-middle`] = middleBand;
        this.indicators[`${id}-lower`] = lowerBand;
    }
    
    // حساب المتوسط المتحرك
    calculateMA(data, period, isExponential) {
        const result = [];
        
        if (isExponential) {
            // حساب المتوسط المتحرك الأسي
            const k = 2 / (period + 1);
            let ema = data[0].close;
            
            for (let i = 0; i < data.length; i++) {
                if (i >= period - 1) {
                    if (i === period - 1) {
                        // حساب SMA الأولي
                        let sum = 0;
                        for (let j = 0; j < period; j++) {
                            sum += data[i - j].close;
                        }
                        ema = sum / period;
                    } else {
                        // حساب EMA
                        ema = (data[i].close - ema) * k + ema;
                    }
                    
                    result.push({
                        time: data[i].time,
                        value: ema
                    });
                }
            }
        } else {
            // حساب المتوسط المتحرك البسيط
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
        }
        
        return result;
    }
    
    // حساب الانحراف المعياري
    calculateStdDev(data, maData, period) {
        const result = [];
        
        for (let i = period - 1; i < data.length; i++) {
            const maIndex = i - (period - 1);
            if (maData[maIndex]) {
                let sum = 0;
                for (let j = 0; j < period; j++) {
                    const diff = data[i - j].close - maData[maIndex].value;
                    sum += diff * diff;
                }
                
                result.push(Math.sqrt(sum / period));
            } else {
                result.push(null);
            }
        }
        
        return result;
    }
    
    // حساب مؤشر RSI
    calculateRSI(data, period) {
        const result = [];
        const gains = [];
        const losses = [];
        
        // حساب التغييرات
        for (let i = 1; i < data.length; i++) {
            const change = data[i].close - data[i - 1].close;
            gains.push(change > 0 ? change : 0);
            losses.push(change < 0 ? Math.abs(change) : 0);
        }
        
        // حساب متوسط الربح والخسارة الأولي
        let avgGain = 0;
        let avgLoss = 0;
        
        for (let i = 0; i < period; i++) {
            avgGain += gains[i];
            avgLoss += losses[i];
        }
        
        avgGain /= period;
        avgLoss /= period;
        
        // حساب RSI
        for (let i = period; i < data.length; i++) {
            // تحديث متوسط الربح والخسارة
            if (i > period) {
                avgGain = ((avgGain * (period - 1)) + gains[i - 1]) / period;
                avgLoss = ((avgLoss * (period - 1)) + losses[i - 1]) / period;
            }
            
            // حساب RS و RSI
            const rs = avgGain / (avgLoss === 0 ? 0.001 : avgLoss); // تجنب القسمة على صفر
            const rsi = 100 - (100 / (1 + rs));
            
            result.push({
                time: data[i].time,
                value: rsi
            });
        }
        
        return result;
    }
    
    // حساب مؤشر MACD
    calculateMACD(data, fastPeriod, slowPeriod, signalPeriod) {
        // حساب EMA السريع والبطيء
        const fastEMA = this.calculateMA(data, fastPeriod, true);
        const slowEMA = this.calculateMA(data, slowPeriod, true);
        
        // حساب خط MACD (الفرق بين EMA السريع والبطيء)
        const macdLine = [];
        const macdData = [];
        
        // تحديد نقطة البداية (بعد فترة EMA البطيء)
        const startIndex = slowPeriod - fastPeriod;
        
        for (let i = 0; i < slowEMA.length; i++) {
            const fastIndex = i + startIndex;
            if (fastIndex < fastEMA.length) {
                const macdValue = fastEMA[fastIndex].value - slowEMA[i].value;
                macdLine.push({
                    time: slowEMA[i].time,
                    value: macdValue
                });
                macdData.push({
                    time: slowEMA[i].time,
                    close: macdValue // استخدام close لحساب EMA
                });
            }
        }
        
        // حساب خط الإشارة (EMA لخط MACD)
        const signalLine = this.calculateMA(macdData, signalPeriod, true);
        
        return {
            macdLine,
            signalLine
        };
    }
    
    // توليد بيانات وهمية للرسم البياني
    generateMockChartData(endDate, count, symbol) {
        const data = [];
        let basePrice = this.getBasePrice(symbol);
        let volatility = this.getVolatility(symbol);
        
        let date = new Date(endDate);
        date.setHours(0, 0, 0, 0);
        
        for (let i = 0; i < count; i++) {
            const time = Math.floor(date.getTime() / 1000);
            
            // توليد سعر عشوائي
            const change = (Math.random() * 2 - 1) * volatility;
            basePrice = Math.max(0.001, basePrice * (1 + change));
            
            const open = basePrice;
            const high = open * (1 + Math.random() * volatility);
            const low = open * (1 - Math.random() * volatility);
            const close = open * (1 + (Math.random() * 2 - 1) * volatility);
            
            data.unshift({
                time: time,
                open: open,
                high: high,
                low: low,
                close: close
            });
            
            // تحريك التاريخ للخلف
            date.setDate(date.getDate() - 1);
        }
        
        return data;
    }
    
    // الحصول على السعر الأساسي للزوج
    getBasePrice(symbol) {
        const basePrices = {
            'EUR/USD': 1.1842,
            'GBP/USD': 1.3765,
            'USD/JPY': 110.32,
            'AUD/USD': 0.7468,
            'USD/CAD': 1.2531,
            'EUR/GBP': 0.8602
        };
        
        return basePrices[symbol] || 1.0;
    }
    
    // الحصول على تقلب الزوج
    getVolatility(symbol) {
        const volatilities = {
            'EUR/USD': 0.0015,
            'GBP/USD': 0.0025,
            'USD/JPY': 0.0020,
            'AUD/USD': 0.0030,
            'USD/CAD': 0.0020,
            'EUR/GBP': 0.0018
        };
        
        return volatilities[symbol] || 0.002;
    }
}

// تصدير المكون
window.ChartsComponent = ChartsComponent;
