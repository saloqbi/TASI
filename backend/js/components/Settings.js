// Settings.js - مكون صفحة الإعدادات

const { useState, useEffect } = React;

const Settings = () => {
    const [activeTab, setActiveTab] = useState('account');
    const [userSettings, setUserSettings] = useState({
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
    });
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [saveMessage, setSaveMessage] = useState('');
    
    useEffect(() => {
        // محاكاة جلب إعدادات المستخدم
        const fetchUserSettings = () => {
            setTimeout(() => {
                setIsLoading(false);
            }, 500);
        };
        
        fetchUserSettings();
    }, []);
    
    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };
    
    const handleSettingChange = (section, setting, value) => {
        setUserSettings(prevSettings => ({
            ...prevSettings,
            [section]: {
                ...prevSettings[section],
                [setting]: value
            }
        }));
    };
    
    const handleSaveSettings = () => {
        setIsSaving(true);
        setSaveMessage('');
        
        // محاكاة حفظ الإعدادات
        setTimeout(() => {
            setIsSaving(false);
            setSaveMessage('تم حفظ الإعدادات بنجاح');
            
            // إخفاء رسالة النجاح بعد 3 ثوانٍ
            setTimeout(() => {
                setSaveMessage('');
            }, 3000);
        }, 1000);
    };
    
    if (isLoading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>جاري تحميل الإعدادات...</p>
            </div>
        );
    }
    
    return (
        <div className="settings-page">
            <h1>الإعدادات</h1>
            
            <div className="settings-container">
                <div className="settings-sidebar">
                    <div
                        className={`settings-tab ${activeTab === 'account' ? 'active' : ''}`}
                        onClick={() => handleTabChange('account')}
                    >
                        <i className="material-icons">person</i>
                        <span>الحساب</span>
                    </div>
                    <div
                        className={`settings-tab ${activeTab === 'notifications' ? 'active' : ''}`}
                        onClick={() => handleTabChange('notifications')}
                    >
                        <i className="material-icons">notifications</i>
                        <span>الإشعارات</span>
                    </div>
                    <div
                        className={`settings-tab ${activeTab === 'display' ? 'active' : ''}`}
                        onClick={() => handleTabChange('display')}
                    >
                        <i className="material-icons">palette</i>
                        <span>العرض</span>
                    </div>
                </div>
                
                <div className="settings-content">
                    {activeTab === 'account' && (
                        <div className="settings-section">
                            <h2>إعدادات الحساب</h2>
                            
                            <div className="form-group">
                                <label>الاسم</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={userSettings.account.name}
                                    onChange={(e) => handleSettingChange('account', 'name', e.target.value)}
                                />
                            </div>
                            
                            <div className="form-group">
                                <label>البريد الإلكتروني</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    value={userSettings.account.email}
                                    onChange={(e) => handleSettingChange('account', 'email', e.target.value)}
                                />
                            </div>
                            
                            <div className="form-group">
                                <label>رقم الهاتف</label>
                                <input
                                    type="tel"
                                    className="form-control"
                                    value={userSettings.account.phone}
                                    onChange={(e) => handleSettingChange('account', 'phone', e.target.value)}
                                />
                            </div>
                            
                            <div className="form-group">
                                <label>اللغة</label>
                                <select
                                    className="form-control"
                                    value={userSettings.account.language}
                                    onChange={(e) => handleSettingChange('account', 'language', e.target.value)}
                                >
                                    <option value="ar">العربية</option>
                                    <option value="en">English</option>
                                </select>
                            </div>
                            
                            <div className="form-group">
                                <label>المنطقة الزمنية</label>
                                <select
                                    className="form-control"
                                    value={userSettings.account.timezone}
                                    onChange={(e) => handleSettingChange('account', 'timezone', e.target.value)}
                                >
                                    <option value="Asia/Riyadh">الرياض (GMT+3)</option>
                                    <option value="Europe/London">لندن (GMT+0/+1)</option>
                                    <option value="America/New_York">نيويورك (GMT-5/-4)</option>
                                    <option value="Asia/Tokyo">طوكيو (GMT+9)</option>
                                </select>
                            </div>
                            
                            <div className="form-group">
                                <button className="btn btn-secondary">تغيير كلمة المرور</button>
                            </div>
                        </div>
                    )}
                    
                    {activeTab === 'notifications' && (
                        <div className="settings-section">
                            <h2>إعدادات الإشعارات</h2>
                            
                            <div className="setting-toggle">
                                <div className="toggle-label">إشعارات الإشارات الجديدة</div>
                                <label className="switch">
                                    <input
                                        type="checkbox"
                                        checked={userSettings.notifications.newSignals}
                                        onChange={(e) => handleSettingChange('notifications', 'newSignals', e.target.checked)}
                                    />
                                    <span className="slider round"></span>
                                </label>
                            </div>
                            
                            <div className="setting-toggle">
                                <div className="toggle-label">تحديثات الإشارات</div>
                                <label className="switch">
                                    <input
                                        type="checkbox"
                                        checked={userSettings.notifications.signalUpdates}
                                        onChange={(e) => handleSettingChange('notifications', 'signalUpdates', e.target.checked)}
                                    />
                                    <span className="slider round"></span>
                                </label>
                            </div>
                            
                            <div className="setting-toggle">
                                <div className="toggle-label">الأحداث الاقتصادية</div>
                                <label className="switch">
                                    <input
                                        type="checkbox"
                                        checked={userSettings.notifications.economicEvents}
                                        onChange={(e) => handleSettingChange('notifications', 'economicEvents', e.target.checked)}
                                    />
                                    <span className="slider round"></span>
                                </label>
                            </div>
                            
                            <div className="setting-toggle">
                                <div className="toggle-label">اكتشاف الأنماط</div>
                                <label className="switch">
                                    <input
                                        type="checkbox"
                                        checked={userSettings.notifications.patternDetection}
                                        onChange={(e) => handleSettingChange('notifications', 'patternDetection', e.target.checked)}
                                    />
                                    <span className="slider round"></span>
                                </label>
                            </div>
                            
                            <h3>طرق الإشعار</h3>
                            
                            <div className="setting-toggle">
                                <div className="toggle-label">إشعارات البريد الإلكتروني</div>
                                <label className="switch">
                                    <input
                                        type="checkbox"
                                        checked={userSettings.notifications.emailNotifications}
                                        onChange={(e) => handleSettingChange('notifications', 'emailNotifications', e.target.checked)}
                                    />
                                    <span className="slider round"></span>
                                </label>
                            </div>
                            
                            <div className="setting-toggle">
                                <div className="toggle-label">إشعارات الويب</div>
                                <label className="switch">
                                    <input
                                        type="checkbox"
                                        checked={userSettings.notifications.pushNotifications}
                                        onChange={(e) => handleSettingChange('notifications', 'pushNotifications', e.target.checked)}
                                    />
                                    <span className="slider round"></span>
                                </label>
                            </div>
                        </div>
                    )}
                    
                    {activeTab === 'display' && (
                        <div className="settings-section">
                            <h2>إعدادات العرض</h2>
                            
                            <div className="form-group">
                                <label>السمة</label>
                                <select
                                    className="form-control"
                                    value={userSettings.display.theme}
                                    onChange={(e) => handleSettingChange('display', 'theme', e.target.value)}
                                >
                                    <option value="dark">داكنة</option>
                                    <option value="light">فاتحة</option>
                                </select>
                            </div>
                            
                            <div className="form-group">
                                <label>نمط الرسم البياني</label>
                                <select
                                    className="form-control"
                                    value={userSettings.display.chartStyle}
                                    onChange={(e) => handleSettingChange('display', 'chartStyle', e.target.value)}
                                >
                                    <option value="candles">شموع</option>
                                    <option value="line">خط</option>
                                    <option value="bars">أعمدة</option>
                                </select>
                            </div>
                            
                            <div className="form-group">
                                <label>الإطار الزمني الافتراضي</label>
                                <select
                                    className="form-control"
                                    value={userSettings.display.defaultTimeframe}
                                    onChange={(e) => handleSettingChange('display', 'defaultTimeframe', e.target.value)}
                                >
                                    <option value="5m">5 دقائق</option>
                                    <option value="15m">15 دقيقة</option>
                                    <option value="30m">30 دقيقة</option>
                                    <option value="1h">1 ساعة</option>
                                    <option value="4h">4 ساعات</option>
                                    <option value="1d">يومي</option>
                                </select>
                            </div>
                            
                            <div className="form-group">
                                <label>زوج العملات الافتراضي</label>
                                <select
                                    className="form-control"
                                    value={userSettings.display.defaultPair}
                                    onChange={(e) => handleSettingChange('display', 'defaultPair', e.target.value)}
                                >
                                    <option value="EURUSD">EUR/USD</option>
                                    <option value="GBPUSD">GBP/USD</option>
                                    <option value="USDJPY">USD/JPY</option>
                                    <option value="AUDUSD">AUD/USD</option>
                                    <option value="USDCAD">USD/CAD</option>
                                </select>
                            </div>
                        </div>
                    )}
                    
                    <div className="settings-actions">
                        {saveMessage && <div className="save-message success">{saveMessage}</div>}
                        <button
                            className="btn btn-primary"
                            onClick={handleSaveSettings}
                            disabled={isSaving}
                        >
                            {isSaving ? 'جاري الحفظ...' : 'حفظ الإعدادات'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
