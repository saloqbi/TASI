// Dashboard.js - مكون لوحة التحكم الرئيسية

const { useState, useEffect } = React;

const Dashboard = () => {
    const [marketOverview, setMarketOverview] = useState([]);
    const [latestSignals, setLatestSignals] = useState([]);
    const [upcomingEvents, setUpcomingEvents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    
    useEffect(() => {
        // محاكاة جلب البيانات من الخادم
        const fetchDashboardData = () => {
            // بيانات تجريبية لنظرة عامة على السوق
            const mockMarketData = [
                { pair: 'EUR/USD', price: '1.0921', change: '+0.05%', direction: 'up' },
                { pair: 'GBP/USD', price: '1.2745', change: '-0.12%', direction: 'down' },
                { pair: 'USD/JPY', price: '107.82', change: '+0.23%', direction: 'up' },
                { pair: 'AUD/USD', price: '0.6932', change: '-0.08%', direction: 'down' },
                { pair: 'USD/CAD', price: '1.3524', change: '+0.15%', direction: 'up' },
                { pair: 'EUR/GBP', price: '0.8567', change: '+0.10%', direction: 'up' }
            ];
            
            // بيانات تجريبية لأحدث الإشارات
            const mockSignalsData = [
                { id: 1, pair: 'EUR/USD', type: 'buy', entryPrice: '1.0915', stopLoss: '1.0890', target: '1.0965', time: '10:30', status: 'active' },
                { id: 2, pair: 'GBP/USD', type: 'sell', entryPrice: '1.2760', stopLoss: '1.2785', target: '1.2710', time: '09:45', status: 'active' },
                { id: 3, pair: 'USD/JPY', type: 'buy', entryPrice: '107.65', stopLoss: '107.40', target: '108.10', time: '08:15', status: 'active' }
            ];
            
            // بيانات تجريبية للأحداث الاقتصادية القادمة
            const mockEventsData = [
                { id: 1, time: '14:30', event: 'مؤشر أسعار المستهلك الأمريكي', impact: 'high', country: 'الولايات المتحدة' },
                { id: 2, time: '16:00', event: 'قرار سعر الفائدة للبنك المركزي الأوروبي', impact: 'high', country: 'منطقة اليورو' },
                { id: 3, time: '10:00', event: 'الناتج المحلي الإجمالي البريطاني', impact: 'medium', country: 'المملكة المتحدة' }
            ];
            
            setMarketOverview(mockMarketData);
            setLatestSignals(mockSignalsData);
            setUpcomingEvents(mockEventsData);
            setIsLoading(false);
        };
        
        fetchDashboardData();
    }, []);
    
    if (isLoading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>جاري تحميل البيانات...</p>
            </div>
        );
    }
    
    return (
        <div className="dashboard">
            <h1>لوحة التحكم</h1>
            
            <div className="dashboard-grid">
                {/* نظرة عامة على السوق */}
                <div className="dashboard-card">
                    <div className="dashboard-card-header">
                        <h2 className="dashboard-card-title">نظرة عامة على السوق</h2>
                    </div>
                    <div className="market-overview">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>الزوج</th>
                                    <th>السعر</th>
                                    <th>التغيير</th>
                                </tr>
                            </thead>
                            <tbody>
                                {marketOverview.map((item, index) => (
                                    <tr key={index}>
                                        <td>{item.pair}</td>
                                        <td>{item.price}</td>
                                        <td className={item.direction === 'up' ? 'text-success' : 'text-danger'}>
                                            {item.change}
                                            <i className="material-icons small">
                                                {item.direction === 'up' ? 'arrow_upward' : 'arrow_downward'}
                                            </i>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                
                {/* أحدث الإشارات */}
                <div className="dashboard-card">
                    <div className="dashboard-card-header">
                        <h2 className="dashboard-card-title">أحدث الإشارات</h2>
                        <a href="#/signals" className="dashboard-card-action">عرض الكل</a>
                    </div>
                    <div className="latest-signals">
                        {latestSignals.map((signal) => (
                            <div key={signal.id} className={`signal signal-${signal.type}`}>
                                <div className="signal-icon">
                                    <i className="material-icons">
                                        {signal.type === 'buy' ? 'trending_up' : 'trending_down'}
                                    </i>
                                </div>
                                <div className="signal-details">
                                    <div className="signal-pair">{signal.pair}</div>
                                    <div className="signal-price">
                                        دخول: {signal.entryPrice} | وقف: {signal.stopLoss} | هدف: {signal.target}
                                    </div>
                                </div>
                                <div className="signal-time">{signal.time}</div>
                            </div>
                        ))}
                    </div>
                </div>
                
                {/* الأحداث الاقتصادية القادمة */}
                <div className="dashboard-card">
                    <div className="dashboard-card-header">
                        <h2 className="dashboard-card-title">الأحداث الاقتصادية القادمة</h2>
                        <a href="#/calendar" className="dashboard-card-action">عرض التقويم</a>
                    </div>
                    <div className="upcoming-events">
                        {upcomingEvents.map((event) => (
                            <div key={event.id} className="event">
                                <div className="event-time">{event.time}</div>
                                <div className="event-details">
                                    <div className="event-title">{event.event}</div>
                                    <div className="event-country">{event.country}</div>
                                </div>
                                <div className={`event-impact event-impact-${event.impact}`}>
                                    <span className="impact-dot"></span>
                                    <span className="impact-dot"></span>
                                    <span className="impact-dot"></span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
