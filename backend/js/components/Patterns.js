// Patterns.js - مكون صفحة الأنماط

const { useState, useEffect } = React;

const Patterns = () => {
    const [activeTab, setActiveTab] = useState('price');
    const [patterns, setPatterns] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    
    useEffect(() => {
        // محاكاة جلب البيانات من الخادم
        const fetchPatternsData = () => {
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
            
            if (activeTab === 'price') {
                setPatterns(mockPricePatterns);
            } else if (activeTab === 'harmonic') {
                setPatterns(mockHarmonicPatterns);
            } else if (activeTab === 'reversal') {
                setPatterns(mockReversalZones);
            }
            
            setIsLoading(false);
        };
        
        setIsLoading(true);
        fetchPatternsData();
    }, [activeTab]);
    
    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };
    
    const getDirectionIcon = (direction) => {
        return direction === 'bullish' ? 'trending_up' : 'trending_down';
    };
    
    const getDirectionClass = (direction) => {
        return direction === 'bullish' ? 'direction-bullish' : 'direction-bearish';
    };
    
    const getConfidenceClass = (confidence) => {
        return `confidence-${confidence}`;
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
        <div className="patterns-page">
            <h1>الأنماط</h1>
            
            <div className="tabs">
                <div
                    className={`tab ${activeTab === 'price' ? 'active' : ''}`}
                    onClick={() => handleTabChange('price')}
                >
                    أنماط السعر
                </div>
                <div
                    className={`tab ${activeTab === 'harmonic' ? 'active' : ''}`}
                    onClick={() => handleTabChange('harmonic')}
                >
                    الأنماط المتناغمة
                </div>
                <div
                    className={`tab ${activeTab === 'reversal' ? 'active' : ''}`}
                    onClick={() => handleTabChange('reversal')}
                >
                    مناطق الانعكاس
                </div>
            </div>
            
            <div className="patterns-list">
                {patterns.map((pattern) => (
                    <div key={pattern.id} className="pattern-card">
                        <div className="pattern-header">
                            <div className="pattern-pair">{pattern.pair}</div>
                            <div className={`pattern-direction ${getDirectionClass(pattern.direction)}`}>
                                <i className="material-icons">{getDirectionIcon(pattern.direction)}</i>
                                <span>{pattern.direction === 'bullish' ? 'صاعد' : 'هابط'}</span>
                            </div>
                        </div>
                        
                        <div className="pattern-body">
                            <div className="pattern-info">
                                <div className="pattern-type">
                                    <span className="info-label">النمط:</span>
                                    <span className="info-value">{pattern.type}</span>
                                </div>
                                <div className="pattern-timeframe">
                                    <span className="info-label">الإطار الزمني:</span>
                                    <span className="info-value">{pattern.timeframe}</span>
                                </div>
                                <div className="pattern-level">
                                    <span className="info-label">المستوى:</span>
                                    <span className="info-value">{pattern.level}</span>
                                </div>
                            </div>
                            
                            <div className="pattern-meta">
                                <div className={`pattern-confidence ${getConfidenceClass(pattern.confidence)}`}>
                                    <span className="confidence-dot"></span>
                                    <span>{pattern.confidence === 'high' ? 'ثقة عالية' : 'ثقة متوسطة'}</span>
                                </div>
                                <div className="pattern-date">{pattern.date}</div>
                            </div>
                        </div>
                        
                        <div className="pattern-actions">
                            <button className="btn-icon">
                                <i className="material-icons">bar_chart</i>
                            </button>
                            <button className="btn-icon">
                                <i className="material-icons">notifications</i>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
