// Signals.js - مكون صفحة الإشارات

const { useState, useEffect } = React;

const Signals = () => {
    const [activeTab, setActiveTab] = useState('active');
    const [signals, setSignals] = useState([]);
    const [statistics, setStatistics] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    
    useEffect(() => {
        // محاكاة جلب البيانات من الخادم
        const fetchSignalsData = () => {
            // بيانات تجريبية للإشارات النشطة والمغلقة
            const mockActiveSignals = [
                { id: 1, pair: 'EUR/USD', type: 'buy', entryPrice: '1.0915', stopLoss: '1.0890', target: '1.0965', time: '10:30', date: 'اليوم', status: 'active', profit: null },
                { id: 2, pair: 'GBP/USD', type: 'sell', entryPrice: '1.2760', stopLoss: '1.2785', target: '1.2710', time: '09:45', date: 'اليوم', status: 'active', profit: null },
                { id: 3, pair: 'USD/JPY', type: 'buy', entryPrice: '107.65', stopLoss: '107.40', target: '108.10', time: '08:15', date: 'اليوم', status: 'active', profit: null },
                { id: 4, pair: 'AUD/USD', type: 'sell', entryPrice: '0.6940', stopLoss: '0.6965', target: '0.6890', time: '14:20', date: 'أمس', status: 'active', profit: null }
            ];
            
            const mockClosedSignals = [
                { id: 5, pair: 'EUR/JPY', type: 'buy', entryPrice: '121.30', stopLoss: '121.00', target: '122.00', time: '11:45', date: 'أمس', status: 'closed', profit: '+70 نقطة' },
                { id: 6, pair: 'USD/CAD', type: 'sell', entryPrice: '1.3550', stopLoss: '1.3575', target: '1.3500', time: '13:20', date: '2 يونيو', status: 'closed', profit: '+50 نقطة' },
                { id: 7, pair: 'GBP/JPY', type: 'buy', entryPrice: '135.60', stopLoss: '135.30', target: '136.20', time: '09:30', date: '1 يونيو', status: 'closed', profit: '-30 نقطة' },
                { id: 8, pair: 'AUD/JPY', type: 'sell', entryPrice: '74.80', stopLoss: '75.05', target: '74.30', time: '15:10', date: '1 يونيو', status: 'closed', profit: '+50 نقطة' }
            ];
            
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
            
            if (activeTab === 'active') {
                setSignals(mockActiveSignals);
            } else if (activeTab === 'closed') {
                setSignals(mockClosedSignals);
            }
            
            setStatistics(mockStatistics);
            setIsLoading(false);
        };
        
        setIsLoading(true);
        fetchSignalsData();
    }, [activeTab]);
    
    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };
    
    if (isLoading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>جاري تحميل البيانات...</p>
            </div>
        );
    }
    
    return (
        <div className="signals-page">
            <h1>إشارات التداول</h1>
            
            <div className="tabs">
                <div
                    className={`tab ${activeTab === 'active' ? 'active' : ''}`}
                    onClick={() => handleTabChange('active')}
                >
                    نشطة
                </div>
                <div
                    className={`tab ${activeTab === 'closed' ? 'active' : ''}`}
                    onClick={() => handleTabChange('closed')}
                >
                    مغلقة
                </div>
                <div
                    className={`tab ${activeTab === 'statistics' ? 'active' : ''}`}
                    onClick={() => handleTabChange('statistics')}
                >
                    إحصائيات
                </div>
            </div>
            
            {activeTab !== 'statistics' ? (
                <div className="signals-list">
                    {signals.map((signal) => (
                        <div key={signal.id} className={`signal signal-${signal.type}`}>
                            <div className="signal-icon">
                                <i className="material-icons">
                                    {signal.type === 'buy' ? 'trending_up' : 'trending_down'}
                                </i>
                            </div>
                            <div className="signal-details">
                                <div className="signal-header">
                                    <span className="signal-pair">{signal.pair}</span>
                                    <span className="signal-time">{signal.time} - {signal.date}</span>
                                </div>
                                <div className="signal-price">
                                    دخول: {signal.entryPrice} | وقف: {signal.stopLoss} | هدف: {signal.target}
                                </div>
                                {signal.status === 'closed' && (
                                    <div className={`signal-profit ${signal.profit.includes('+') ? 'profit-positive' : 'profit-negative'}`}>
                                        {signal.profit}
                                    </div>
                                )}
                            </div>
                            <div className="signal-actions">
                                <button className="btn-icon">
                                    <i className="material-icons">info</i>
                                </button>
                                <button className="btn-icon">
                                    <i className="material-icons">bar_chart</i>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="statistics-container">
                    <div className="statistics-summary">
                        <div className="stat-card">
                            <div className="stat-title">إجمالي الإشارات</div>
                            <div className="stat-value">{statistics.totalSignals}</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-title">نسبة النجاح</div>
                            <div className="stat-value">{statistics.successRate}%</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-title">متوسط الربح</div>
                            <div className="stat-value">+{statistics.averageProfit} نقطة</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-title">متوسط الخسارة</div>
                            <div className="stat-value">-{statistics.averageLoss} نقطة</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-title">معامل الربح</div>
                            <div className="stat-value">{statistics.profitFactor}</div>
                        </div>
                    </div>
                    
                    <div className="statistics-charts">
                        <div className="chart-container">
                            <h3>الأداء الشهري</h3>
                            <div className="chart-placeholder">
                                {/* هنا سيتم إضافة الرسم البياني للأداء الشهري */}
                                <div className="mock-chart">رسم بياني للأداء الشهري</div>
                            </div>
                        </div>
                        
                        <div className="chart-container">
                            <h3>توزيع الإشارات</h3>
                            <div className="charts-row">
                                <div className="chart-placeholder">
                                    {/* هنا سيتم إضافة الرسم البياني لتوزيع الإشارات حسب النوع */}
                                    <div className="mock-chart">توزيع حسب النوع</div>
                                </div>
                                <div className="chart-placeholder">
                                    {/* هنا سيتم إضافة الرسم البياني لتوزيع الإشارات حسب الزوج */}
                                    <div className="mock-chart">توزيع حسب الزوج</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
