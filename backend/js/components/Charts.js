// Charts.js - مكون صفحة الرسوم البيانية

const { useState, useEffect, useRef } = React;

const Charts = () => {
    const [selectedPair, setSelectedPair] = useState('EURUSD');
    const [timeframe, setTimeframe] = useState('1h');
    const [isLoading, setIsLoading] = useState(true);
    const chartContainerRef = useRef(null);
    const chartRef = useRef(null);
    
    // قائمة أزواج العملات المتاحة
    const availablePairs = [
        { value: 'EURUSD', label: 'EUR/USD' },
        { value: 'GBPUSD', label: 'GBP/USD' },
        { value: 'USDJPY', label: 'USD/JPY' },
        { value: 'AUDUSD', label: 'AUD/USD' },
        { value: 'USDCAD', label: 'USD/CAD' },
        { value: 'EURJPY', label: 'EUR/JPY' }
    ];
    
    // قائمة الإطارات الزمنية المتاحة
    const availableTimeframes = [
        { value: '5m', label: '5 دقائق' },
        { value: '15m', label: '15 دقيقة' },
        { value: '30m', label: '30 دقيقة' },
        { value: '1h', label: '1 ساعة' },
        { value: '4h', label: '4 ساعات' },
        { value: '1d', label: 'يومي' }
    ];
    
    // قائمة المؤشرات الفنية المتاحة
    const availableIndicators = [
        { value: 'ma', label: 'المتوسط المتحرك' },
        { value: 'ema', label: 'المتوسط المتحرك الأسي' },
        { value: 'rsi', label: 'مؤشر القوة النسبية' },
        { value: 'macd', label: 'تقارب وتباعد المتوسطات المتحركة' },
        { value: 'bb', label: 'حدود بولينجر' }
    ];
    
    useEffect(() => {
        // محاكاة جلب بيانات الرسم البياني
        const fetchChartData = () => {
            setIsLoading(true);
            
            // محاكاة تأخير الشبكة
            setTimeout(() => {
                initializeChart();
                setIsLoading(false);
            }, 1000);
        };
        
        fetchChartData();
        
        // تنظيف عند إزالة المكون
        return () => {
            if (chartRef.current) {
                chartRef.current.remove();
                chartRef.current = null;
            }
        };
    }, [selectedPair, timeframe]);
    
    // تهيئة الرسم البياني باستخدام مكتبة TradingView Lightweight Charts
    const initializeChart = () => {
        if (!chartContainerRef.current) return;
        
        if (chartRef.current) {
            chartRef.current.remove();
        }
        
        // إنشاء بيانات تجريبية للرسم البياني
        const generateCandlestickData = () => {
            const data = [];
            const basePrice = selectedPair === 'EURUSD' ? 1.09 : 
                             selectedPair === 'GBPUSD' ? 1.27 : 
                             selectedPair === 'USDJPY' ? 107.5 : 
                             selectedPair === 'AUDUSD' ? 0.69 : 
                             selectedPair === 'USDCAD' ? 1.35 : 1.21;
            
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
        
        // إنشاء الرسم البياني
        const chart = LightweightCharts.createChart(chartContainerRef.current, {
            width: chartContainerRef.current.clientWidth,
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
        });
        
        // إضافة سلسلة الشموع اليابانية
        const candlestickSeries = chart.addCandlestickSeries({
            upColor: '#00C853',
            downColor: '#FF3D00',
            borderDownColor: '#FF3D00',
            borderUpColor: '#00C853',
            wickDownColor: '#FF3D00',
            wickUpColor: '#00C853',
        });
        
        // تعيين البيانات
        candlestickSeries.setData(generateCandlestickData());
        
        // تخزين مرجع الرسم البياني للتنظيف لاحقاً
        chartRef.current = chart;
        
        // إعادة تحجيم الرسم البياني عند تغيير حجم النافذة
        const handleResize = () => {
            if (chartRef.current && chartContainerRef.current) {
                chartRef.current.applyOptions({ 
                    width: chartContainerRef.current.clientWidth 
                });
            }
        };
        
        window.addEventListener('resize', handleResize);
        
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    };
    
    const handlePairChange = (e) => {
        setSelectedPair(e.target.value);
    };
    
    const handleTimeframeChange = (e) => {
        setTimeframe(e.target.value);
    };
    
    return (
        <div className="charts-page">
            <h1>الرسوم البيانية</h1>
            
            <div className="chart-controls">
                <div className="control-group">
                    <label>زوج العملة:</label>
                    <select value={selectedPair} onChange={handlePairChange}>
                        {availablePairs.map((pair) => (
                            <option key={pair.value} value={pair.value}>{pair.label}</option>
                        ))}
                    </select>
                </div>
                
                <div className="control-group">
                    <label>الإطار الزمني:</label>
                    <div className="timeframe-buttons">
                        {availableTimeframes.map((tf) => (
                            <button
                                key={tf.value}
                                className={`btn ${timeframe === tf.value ? 'btn-primary' : 'btn-secondary'}`}
                                onClick={() => setTimeframe(tf.value)}
                            >
                                {tf.label}
                            </button>
                        ))}
                    </div>
                </div>
                
                <div className="control-group">
                    <label>المؤشرات:</label>
                    <select>
                        <option value="">إضافة مؤشر...</option>
                        {availableIndicators.map((indicator) => (
                            <option key={indicator.value} value={indicator.value}>{indicator.label}</option>
                        ))}
                    </select>
                </div>
            </div>
            
            {isLoading ? (
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>جاري تحميل الرسم البياني...</p>
                </div>
            ) : (
                <div className="chart-container" ref={chartContainerRef}></div>
            )}
            
            <div className="chart-tools">
                <div className="tool-group">
                    <button className="btn btn-secondary">
                        <i className="material-icons">timeline</i>
                        خط الاتجاه
                    </button>
                    <button className="btn btn-secondary">
                        <i className="material-icons">show_chart</i>
                        فيبوناتشي
                    </button>
                    <button className="btn btn-secondary">
                        <i className="material-icons">format_shapes</i>
                        أشكال
                    </button>
                </div>
            </div>
        </div>
    );
};
