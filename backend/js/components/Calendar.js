// Calendar.js - مكون صفحة التقويم الاقتصادي

const { useState, useEffect } = React;

const Calendar = () => {
    const [events, setEvents] = useState([]);
    const [filters, setFilters] = useState({
        currency: 'all',
        impact: 'all'
    });
    const [isLoading, setIsLoading] = useState(true);
    
    // قائمة العملات المتاحة للتصفية
    const availableCurrencies = [
        { value: 'all', label: 'الكل' },
        { value: 'USD', label: 'الدولار الأمريكي' },
        { value: 'EUR', label: 'اليورو' },
        { value: 'GBP', label: 'الجنيه الإسترليني' },
        { value: 'JPY', label: 'الين الياباني' },
        { value: 'AUD', label: 'الدولار الأسترالي' },
        { value: 'CAD', label: 'الدولار الكندي' }
    ];
    
    // مستويات التأثير المتاحة للتصفية
    const impactLevels = [
        { value: 'all', label: 'الكل' },
        { value: 'high', label: 'مرتفع' },
        { value: 'medium', label: 'متوسط' },
        { value: 'low', label: 'منخفض' }
    ];
    
    useEffect(() => {
        // محاكاة جلب البيانات من الخادم
        const fetchCalendarData = () => {
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
            
            if (filters.currency !== 'all') {
                filteredEvents = filteredEvents.filter(event => event.currency === filters.currency);
            }
            
            if (filters.impact !== 'all') {
                filteredEvents = filteredEvents.filter(event => event.impact === filters.impact);
            }
            
            setEvents(filteredEvents);
            setIsLoading(false);
        };
        
        setIsLoading(true);
        fetchCalendarData();
    }, [filters]);
    
    const handleFilterChange = (filterType, value) => {
        setFilters(prevFilters => ({
            ...prevFilters,
            [filterType]: value
        }));
    };
    
    const getImpactClass = (impact) => {
        return `impact-${impact}`;
    };
    
    const getCountryFlag = (country) => {
        // في التطبيق الحقيقي، سيتم استبدال هذا برموز أعلام حقيقية
        return '🏳️';
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
        <div className="calendar-page">
            <h1>التقويم الاقتصادي</h1>
            
            <div className="calendar-filters">
                <div className="filter-group">
                    <label>العملة:</label>
                    <select
                        value={filters.currency}
                        onChange={(e) => handleFilterChange('currency', e.target.value)}
                    >
                        {availableCurrencies.map((currency) => (
                            <option key={currency.value} value={currency.value}>
                                {currency.label}
                            </option>
                        ))}
                    </select>
                </div>
                
                <div className="filter-group">
                    <label>مستوى التأثير:</label>
                    <select
                        value={filters.impact}
                        onChange={(e) => handleFilterChange('impact', e.target.value)}
                    >
                        {impactLevels.map((level) => (
                            <option key={level.value} value={level.value}>
                                {level.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
            
            <div className="calendar-events">
                {events.length === 0 ? (
                    <div className="no-events">
                        <p>لا توجد أحداث تطابق معايير التصفية</p>
                    </div>
                ) : (
                    <div className="events-list">
                        {/* تجميع الأحداث حسب التاريخ */}
                        {Array.from(new Set(events.map(event => event.date))).map(date => (
                            <div key={date} className="event-date-group">
                                <div className="event-date-header">{date}</div>
                                
                                <div className="events-table-container">
                                    <table className="events-table">
                                        <thead>
                                            <tr>
                                                <th>الوقت</th>
                                                <th>العملة</th>
                                                <th>الحدث</th>
                                                <th>التأثير</th>
                                                <th>السابق</th>
                                                <th>التوقع</th>
                                                <th>الفعلي</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {events
                                                .filter(event => event.date === date)
                                                .map(event => (
                                                    <tr key={event.id}>
                                                        <td>{event.time}</td>
                                                        <td>
                                                            <div className="currency-cell">
                                                                <span className="country-flag">{getCountryFlag(event.country)}</span>
                                                                <span>{event.currency}</span>
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <div className="event-name">
                                                                <span>{event.event}</span>
                                                                <small>{event.country}</small>
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <div className={`impact-indicator ${getImpactClass(event.impact)}`}>
                                                                <span className="impact-dot"></span>
                                                                <span className="impact-dot"></span>
                                                                <span className="impact-dot"></span>
                                                            </div>
                                                        </td>
                                                        <td>{event.previous}</td>
                                                        <td>{event.forecast}</td>
                                                        <td className="actual-value">{event.actual}</td>
                                                    </tr>
                                                ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
