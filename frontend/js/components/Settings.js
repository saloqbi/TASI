// Settings.js - مكون React لصفحة الإعدادات

const Settings = () => {
    const [settings, setSettings] = React.useState({
        account: {
            email: 'user@example.com',
            name: 'المستخدم',
            phone: '+966 5XXXXXXXX',
            profilePicture: null
        },
        notifications: {
            email: true,
            push: true,
            signals: true,
            news: false,
            economicEvents: true
        },
        display: {
            theme: 'dark', // dark, light
            chartStyle: 'candles', // candles, line, bars
            language: 'ar', // ar, en
            timeZone: 'Asia/Riyadh',
            decimalPlaces: 5
        },
        trading: {
            defaultLeverage: '1:100',
            defaultLotSize: 0.01,
            defaultStopLoss: 50,
            defaultTakeProfit: 100,
            riskPercentage: 2
        },
        security: {
            twoFactorAuth: false,
            sessionTimeout: 30, // minutes
            lastLogin: '2025-06-04T12:00:00Z',
            devices: [
                { name: 'iPhone 15', lastAccess: '2025-06-04T12:00:00Z', current: true },
                { name: 'MacBook Pro', lastAccess: '2025-06-03T18:30:00Z', current: false }
            ]
        }
    });
    
    const [activeTab, setActiveTab] = React.useState('account');
    const [successMessage, setSuccessMessage] = React.useState('');
    
    // تحميل الإعدادات المحفوظة عند تحميل المكون
    React.useEffect(() => {
        // تحميل اللغة من التخزين المحلي
        loadLanguageFromStorage();
        
        // يمكن إضافة المزيد من عمليات تحميل الإعدادات هنا
        console.log("Settings component mounted, checking for saved language");
    }, []);
    
    // وظيفة لتحميل اللغة من التخزين المحلي
    const loadLanguageFromStorage = () => {
        try {
            const savedLanguage = localStorage.getItem('koukaba_tasi_language');
            console.log("Loading language from storage:", savedLanguage);
            
            if (savedLanguage) {
                // تحديث حالة الإعدادات مع اللغة المحفوظة
                setSettings(prevSettings => ({
                    ...prevSettings,
                    display: {
                        ...prevSettings.display,
                        language: savedLanguage
                    }
                }));
                
                // تطبيق اللغة على واجهة المستخدم
                applyLanguage(savedLanguage);
            }
        } catch (error) {
            console.error("Error loading language from storage:", error);
        }
    };
    
    // وظيفة لحفظ اللغة في التخزين المحلي
    const saveLanguageToStorage = (language) => {
        try {
            console.log("Saving language to storage:", language);
            localStorage.setItem('koukaba_tasi_language', language);
            // التحقق من أن اللغة تم حفظها بنجاح
            const savedLanguage = localStorage.getItem('koukaba_tasi_language');
            console.log("Verified saved language:", savedLanguage);
        } catch (error) {
            console.error("Error saving language to storage:", error);
        }
    };
    
    // وظيفة لتطبيق اللغة على واجهة المستخدم
    const applyLanguage = (language) => {
        try {
            console.log("Applying language:", language);
            
            // تعيين لغة المستند
            document.documentElement.setAttribute('lang', language);
            console.log("Set document language to:", document.documentElement.getAttribute('lang'));
            
            // تغيير اتجاه الصفحة بناءً على اللغة
            if (language === 'ar') {
                document.documentElement.setAttribute('dir', 'rtl');
                document.body.setAttribute('dir', 'rtl');
                console.log("Set document direction to RTL");
            } else {
                document.documentElement.setAttribute('dir', 'ltr');
                document.body.setAttribute('dir', 'ltr');
                console.log("Set document direction to LTR");
            }
            
            // إعادة تحميل النصوص حسب اللغة المختارة
            loadTranslations(language);
        } catch (error) {
            console.error("Error applying language:", error);
        }
    };
    
    // وظيفة لتحميل الترجمات حسب اللغة
    const loadTranslations = (language) => {
        // يمكن تنفيذ هذه الوظيفة لتحميل ملفات الترجمة المناسبة
        // أو استدعاء API للحصول على الترجمات
        console.log(`تحميل ترجمات اللغة: ${language}`);
    };
    
    // وظيفة لحفظ الإعدادات على الخادم
    const saveSettingsToServer = () => {
        // إنشاء كائن يحتوي على الإعدادات المراد حفظها
        const settingsToSave = {
            display: settings.display,
            // يمكن إضافة المزيد من الإعدادات حسب الحاجة
        };
        
        // استدعاء API لحفظ الإعدادات
        fetch('/api/user/settings', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(settingsToSave)
        })
        .then(response => response.json())
        .then(data => {
            console.log('تم حفظ الإعدادات بنجاح:', data);
        })
        .catch(error => {
            console.error('خطأ في حفظ الإعدادات:', error);
            // حتى لو فشل الاتصال بالخادم، فإن الإعدادات ستظل محفوظة محلياً
        });
    };
    
    // وظيفة لتغيير التبويب النشط
    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };
    
    // وظيفة لمعالجة تغيير قيم الإعدادات
    const handleSettingChange = (section, key, value) => {
        setSettings(prevSettings => ({
            ...prevSettings,
            [section]: {
                ...prevSettings[section],
                [key]: value
            }
        }));
        
        // إذا كان التغيير هو تغيير اللغة، نطبق التغيير فوراً
        if (section === 'display' && key === 'language') {
            console.log("Language changed to:", value);
        }
    };
    
    // وظيفة لمعالجة حفظ الإعدادات
    const handleSaveSettings = (e) => {
        e.preventDefault();
        
        // حفظ اللغة في التخزين المحلي
        saveLanguageToStorage(settings.display.language);
        
        // تطبيق اللغة على واجهة المستخدم
        applyLanguage(settings.display.language);
        
        // حفظ الإعدادات على الخادم
        saveSettingsToServer();
        
        // عرض رسالة نجاح
        setSuccessMessage('تم حفظ الإعدادات بنجاح');
        setTimeout(() => {
            setSuccessMessage('');
            
            // إعادة تحميل الصفحة بعد فترة قصيرة لتطبيق التغييرات
            setTimeout(() => {
                console.log("Reloading page to apply language changes");
                window.location.reload();
            }, 500);
        }, 1500);
    };
    
    return (
        <div className="settings-page">
            <div className="settings-header">
                <h2>الإعدادات</h2>
            </div>
            
            <div className="settings-container">
                <div className="settings-sidebar">
                    <ul className="settings-tabs">
                        <li className={activeTab === 'account' ? 'active' : ''} onClick={() => handleTabChange('account')}>
                            <i className="bi bi-person"></i>
                            <span>الحساب</span>
                        </li>
                        <li className={activeTab === 'notifications' ? 'active' : ''} onClick={() => handleTabChange('notifications')}>
                            <i className="bi bi-bell"></i>
                            <span>الإشعارات</span>
                        </li>
                        <li className={activeTab === 'display' ? 'active' : ''} onClick={() => handleTabChange('display')}>
                            <i className="bi bi-display"></i>
                            <span>العرض</span>
                        </li>
                        <li className={activeTab === 'trading' ? 'active' : ''} onClick={() => handleTabChange('trading')}>
                            <i className="bi bi-graph-up"></i>
                            <span>التداول</span>
                        </li>
                        <li className={activeTab === 'security' ? 'active' : ''} onClick={() => handleTabChange('security')}>
                            <i className="bi bi-shield-lock"></i>
                            <span>الأمان</span>
                        </li>
                    </ul>
                </div>
                
                <div className="settings-content">
                    {successMessage && (
                        <div className="alert alert-success">{successMessage}</div>
                    )}
                    
                    {/* قسم الحساب */}
                    {activeTab === 'account' && (
                        <div className="settings-section">
                            <h3>معلومات الحساب</h3>
                            <form onSubmit={handleSaveSettings}>
                                <div className="form-group">
                                    <label htmlFor="name">الاسم</label>
                                    <input
                                        type="text"
                                        id="name"
                                        className="form-control"
                                        value={settings.account.name}
                                        onChange={(e) => handleSettingChange('account', 'name', e.target.value)}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="email">البريد الإلكتروني</label>
                                    <input
                                        type="email"
                                        id="email"
                                        className="form-control"
                                        value={settings.account.email}
                                        onChange={(e) => handleSettingChange('account', 'email', e.target.value)}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="phone">رقم الهاتف</label>
                                    <input
                                        type="tel"
                                        id="phone"
                                        className="form-control"
                                        value={settings.account.phone}
                                        onChange={(e) => handleSettingChange('account', 'phone', e.target.value)}
                                    />
                                </div>
                                <button type="submit" className="btn btn-primary">حفظ التغييرات</button>
                            </form>
                        </div>
                    )}
                    
                    {/* قسم الإشعارات */}
                    {activeTab === 'notifications' && (
                        <div className="settings-section">
                            <h3>إعدادات الإشعارات</h3>
                            <form onSubmit={handleSaveSettings}>
                                <div className="form-check">
                                    <input
                                        type="checkbox"
                                        className="form-check-input"
                                        id="email-notifications"
                                        checked={settings.notifications.email}
                                        onChange={(e) => handleSettingChange('notifications', 'email', e.target.checked)}
                                    />
                                    <label className="form-check-label" htmlFor="email-notifications">إشعارات البريد الإلكتروني</label>
                                </div>
                                <div className="form-check">
                                    <input
                                        type="checkbox"
                                        className="form-check-input"
                                        id="push-notifications"
                                        checked={settings.notifications.push}
                                        onChange={(e) => handleSettingChange('notifications', 'push', e.target.checked)}
                                    />
                                    <label className="form-check-label" htmlFor="push-notifications">إشعارات الدفع</label>
                                </div>
                                <div className="form-check">
                                    <input
                                        type="checkbox"
                                        className="form-check-input"
                                        id="signal-notifications"
                                        checked={settings.notifications.signals}
                                        onChange={(e) => handleSettingChange('notifications', 'signals', e.target.checked)}
                                    />
                                    <label className="form-check-label" htmlFor="signal-notifications">إشعارات الإشارات الجديدة</label>
                                </div>
                                <div className="form-check">
                                    <input
                                        type="checkbox"
                                        className="form-check-input"
                                        id="news-notifications"
                                        checked={settings.notifications.news}
                                        onChange={(e) => handleSettingChange('notifications', 'news', e.target.checked)}
                                    />
                                    <label className="form-check-label" htmlFor="news-notifications">إشعارات الأخبار</label>
                                </div>
                                <div className="form-check">
                                    <input
                                        type="checkbox"
                                        className="form-check-input"
                                        id="economic-notifications"
                                        checked={settings.notifications.economicEvents}
                                        onChange={(e) => handleSettingChange('notifications', 'economicEvents', e.target.checked)}
                                    />
                                    <label className="form-check-label" htmlFor="economic-notifications">إشعارات الأحداث الاقتصادية</label>
                                </div>
                                <button type="submit" className="btn btn-primary">حفظ التغييرات</button>
                            </form>
                        </div>
                    )}
                    
                    {/* قسم العرض */}
                    {activeTab === 'display' && (
                        <div className="settings-section">
                            <h3>إعدادات العرض</h3>
                            <form onSubmit={handleSaveSettings}>
                                <div className="form-group">
                                    <label htmlFor="theme">السمة</label>
                                    <select
                                        id="theme"
                                        className="form-control"
                                        value={settings.display.theme}
                                        onChange={(e) => handleSettingChange('display', 'theme', e.target.value)}
                                    >
                                        <option value="dark">داكنة</option>
                                        <option value="light">فاتحة</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="chartStyle">نمط الرسم البياني</label>
                                    <select
                                        id="chartStyle"
                                        className="form-control"
                                        value={settings.display.chartStyle}
                                        onChange={(e) => handleSettingChange('display', 'chartStyle', e.target.value)}
                                    >
                                        <option value="candles">شموع</option>
                                        <option value="line">خط</option>
                                        <option value="bars">أعمدة</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="language">اللغة</label>
                                    <select
                                        id="language"
                                        className="form-control"
                                        value={settings.display.language}
                                        onChange={(e) => handleSettingChange('display', 'language', e.target.value)}
                                    >
                                        <option value="ar">العربية</option>
                                        <option value="en">الإنجليزية</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="timeZone">المنطقة الزمنية</label>
                                    <select
                                        id="timeZone"
                                        className="form-control"
                                        value={settings.display.timeZone}
                                        onChange={(e) => handleSettingChange('display', 'timeZone', e.target.value)}
                                    >
                                        <option value="Asia/Riyadh">الرياض (GMT+3)</option>
                                        <option value="Europe/London">لندن (GMT+0)</option>
                                        <option value="America/New_York">نيويورك (GMT-5)</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="decimalPlaces">عدد الخانات العشرية</label>
                                    <select
                                        id="decimalPlaces"
                                        className="form-control"
                                        value={settings.display.decimalPlaces}
                                        onChange={(e) => handleSettingChange('display', 'decimalPlaces', parseInt(e.target.value))}
                                    >
                                        <option value="2">2</option>
                                        <option value="3">3</option>
                                        <option value="4">4</option>
                                        <option value="5">5</option>
                                    </select>
                                </div>
                                <button type="submit" className="btn btn-primary">حفظ التغييرات</button>
                            </form>
                        </div>
                    )}
                    
                    {/* قسم التداول */}
                    {activeTab === 'trading' && (
                        <div className="settings-section">
                            <h3>إعدادات التداول</h3>
                            <form onSubmit={handleSaveSettings}>
                                <div className="form-group">
                                    <label htmlFor="defaultLeverage">الرافعة المالية الافتراضية</label>
                                    <select
                                        id="defaultLeverage"
                                        className="form-control"
                                        value={settings.trading.defaultLeverage}
                                        onChange={(e) => handleSettingChange('trading', 'defaultLeverage', e.target.value)}
                                    >
                                        <option value="1:50">1:50</option>
                                        <option value="1:100">1:100</option>
                                        <option value="1:200">1:200</option>
                                        <option value="1:500">1:500</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="defaultLotSize">حجم العقد الافتراضي</label>
                                    <select
                                        id="defaultLotSize"
                                        className="form-control"
                                        value={settings.trading.defaultLotSize}
                                        onChange={(e) => handleSettingChange('trading', 'defaultLotSize', parseFloat(e.target.value))}
                                    >
                                        <option value="0.01">0.01</option>
                                        <option value="0.05">0.05</option>
                                        <option value="0.1">0.1</option>
                                        <option value="0.5">0.5</option>
                                        <option value="1">1</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="defaultStopLoss">وقف الخسارة الافتراضي (نقاط)</label>
                                    <input
                                        type="number"
                                        id="defaultStopLoss"
                                        className="form-control"
                                        value={settings.trading.defaultStopLoss}
                                        onChange={(e) => handleSettingChange('trading', 'defaultStopLoss', parseInt(e.target.value))}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="defaultTakeProfit">جني الأرباح الافتراضي (نقاط)</label>
                                    <input
                                        type="number"
                                        id="defaultTakeProfit"
                                        className="form-control"
                                        value={settings.trading.defaultTakeProfit}
                                        onChange={(e) => handleSettingChange('trading', 'defaultTakeProfit', parseInt(e.target.value))}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="riskPercentage">نسبة المخاطرة (%)</label>
                                    <input
                                        type="number"
                                        id="riskPercentage"
                                        className="form-control"
                                        value={settings.trading.riskPercentage}
                                        onChange={(e) => handleSettingChange('trading', 'riskPercentage', parseInt(e.target.value))}
                                    />
                                </div>
                                <button type="submit" className="btn btn-primary">حفظ التغييرات</button>
                            </form>
                        </div>
                    )}
                    
                    {/* قسم الأمان */}
                    {activeTab === 'security' && (
                        <div className="settings-section">
                            <h3>إعدادات الأمان</h3>
                            <form onSubmit={handleSaveSettings}>
                                <div className="form-check">
                                    <input
                                        type="checkbox"
                                        className="form-check-input"
                                        id="twoFactorAuth"
                                        checked={settings.security.twoFactorAuth}
                                        onChange={(e) => handleSettingChange('security', 'twoFactorAuth', e.target.checked)}
                                    />
                                    <label className="form-check-label" htmlFor="twoFactorAuth">تفعيل المصادقة الثنائية</label>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="sessionTimeout">مهلة الجلسة (دقائق)</label>
                                    <select
                                        id="sessionTimeout"
                                        className="form-control"
                                        value={settings.security.sessionTimeout}
                                        onChange={(e) => handleSettingChange('security', 'sessionTimeout', parseInt(e.target.value))}
                                    >
                                        <option value="15">15</option>
                                        <option value="30">30</option>
                                        <option value="60">60</option>
                                        <option value="120">120</option>
                                    </select>
                                </div>
                                <div className="devices-list">
                                    <h4>الأجهزة المتصلة</h4>
                                    <ul>
                                        {settings.security.devices.map((device, index) => (
                                            <li key={index} className={device.current ? 'current-device' : ''}>
                                                <div className="device-info">
                                                    <span className="device-name">{device.name}</span>
                                                    <span className="device-access">آخر وصول: {new Date(device.lastAccess).toLocaleString()}</span>
                                                </div>
                                                {!device.current && (
                                                    <button
                                                        type="button"
                                                        className="btn btn-danger btn-sm"
                                                        onClick={() => {
                                                            const updatedDevices = [...settings.security.devices];
                                                            updatedDevices.splice(index, 1);
                                                            handleSettingChange('security', 'devices', updatedDevices);
                                                        }}
                                                    >
                                                        إزالة
                                                    </button>
                                                )}
                                                {device.current && <span className="current-label">(الجهاز الحالي)</span>}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <button type="submit" className="btn btn-primary">حفظ التغييرات</button>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
