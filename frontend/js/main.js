// كوكبة تاسي - Main JavaScript File

// تهيئة المتغيرات
let currentUser = null;
let currentPage = 'dashboard';

// عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    // تهيئة نموذج تسجيل الدخول
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // تهيئة أزرار القائمة الجانبية
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const page = item.getAttribute('data-page');
            navigateToPage(page);
        });
    });
    
    // تهيئة زر تسجيل الخروج
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
    
    // تهيئة زر إظهار/إخفاء كلمة المرور
    const togglePassword = document.querySelector('.toggle-password');
    if (togglePassword) {
        togglePassword.addEventListener('click', function() {
            const passwordInput = document.getElementById('password');
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                this.classList.replace('fa-eye-slash', 'fa-eye');
            } else {
                passwordInput.type = 'password';
                this.classList.replace('fa-eye', 'fa-eye-slash');
            }
        });
    }
    
    // تهيئة الرسوم البيانية في لوحة التحكم إذا كانت موجودة
    initDashboardCharts();
    
    // تهيئة أزرار الإطار الزمني في صفحة الرسوم البيانية
    const timeframeButtons = document.querySelectorAll('.btn-timeframe');
    timeframeButtons.forEach(button => {
        button.addEventListener('click', () => {
            timeframeButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            updateChart(button.getAttribute('data-timeframe'));
        });
    });
    
    // تهيئة أزرار نوع الرسم البياني
    const chartTypeButtons = document.querySelectorAll('.btn-charttype');
    chartTypeButtons.forEach(button => {
        button.addEventListener('click', () => {
            chartTypeButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            updateChartType(button.getAttribute('data-charttype'));
        });
    });
    
    // تهيئة أزرار التصفية في صفحة الإشارات
    const applyFilterBtn = document.querySelector('.btn-apply-filter');
    if (applyFilterBtn) {
        applyFilterBtn.addEventListener('click', applyFilters);
    }
    
    // تهيئة أزرار التفاصيل والإغلاق في جدول الإشارات
    const detailsButtons = document.querySelectorAll('.btn-details');
    detailsButtons.forEach(button => {
        button.addEventListener('click', showSignalDetails);
    });
    
    const closeButtons = document.querySelectorAll('.btn-close');
    closeButtons.forEach(button => {
        button.addEventListener('click', closeSignal);
    });
    
    // تهيئة أزرار عرض الرسم البياني وإنشاء إشارة في صفحة الأنماط
    const viewChartButtons = document.querySelectorAll('.btn-view-chart');
    viewChartButtons.forEach(button => {
        button.addEventListener('click', viewPatternChart);
    });
    
    const createSignalButtons = document.querySelectorAll('.btn-create-signal');
    createSignalButtons.forEach(button => {
        button.addEventListener('click', createSignalFromPattern);
    });
    
    // تهيئة أزرار التنقل في صفحة الإعدادات
    const settingsNavItems = document.querySelectorAll('.settings-nav-item');
    settingsNavItems.forEach(item => {
        item.addEventListener('click', () => {
            const settingsPage = item.getAttribute('data-settings');
            navigateToSettingsPage(settingsPage);
        });
    });
    
    // تهيئة أزرار حفظ التغييرات في صفحة الإعدادات
    const saveButtons = document.querySelectorAll('.btn-save');
    saveButtons.forEach(button => {
        button.addEventListener('click', saveSettings);
    });
    
    // تهيئة خيارات المظهر
    const themeOptions = document.querySelectorAll('.theme-option');
    themeOptions.forEach(option => {
        option.addEventListener('click', () => {
            themeOptions.forEach(opt => opt.classList.remove('active'));
            option.classList.add('active');
            changeTheme(option.getAttribute('data-theme'));
        });
    });
    
    // تهيئة خيارات الألوان
    const colorOptions = document.querySelectorAll('.color-option');
    colorOptions.forEach(option => {
        option.addEventListener('click', () => {
            colorOptions.forEach(opt => opt.classList.remove('active'));
            option.classList.add('active');
            changeColor(option.getAttribute('data-color'));
        });
    });
    
    // تهيئة رسم TradingView إذا كانت صفحة الرسوم البيانية مفتوحة
    if (document.getElementById('tradingview-chart')) {
        initTradingViewChart();
    }
    
    // تحديث العد التنازلي للأحداث الاقتصادية
    updateCountdowns();
    setInterval(updateCountdowns, 1000);
    
    // التحقق من وجود جلسة مسجلة
    checkSession();
});

// دالة معالجة تسجيل الدخول
function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const remember = document.getElementById('remember').checked;
    
    // للأغراض التجريبية، نقبل أي بريد إلكتروني وكلمة مرور
    // في التطبيق الحقيقي، يجب التحقق من صحة بيانات الاعتماد مع الخادم
    
    // تخزين معلومات المستخدم في الجلسة
    currentUser = {
        email: email,
        name: 'المستخدم',
        avatar: null
    };
    
    // تخزين الجلسة في التخزين المحلي إذا تم تحديد "تذكرني"
    if (remember) {
        localStorage.setItem('kawkabat_tasi_user', JSON.stringify(currentUser));
    } else {
        sessionStorage.setItem('kawkabat_tasi_user', JSON.stringify(currentUser));
    }
    
    // إظهار التطبيق الرئيسي وإخفاء صفحة تسجيل الدخول
    document.getElementById('login-page').style.display = 'none';
    document.getElementById('main-app').style.display = 'flex';
    
    // تحديث اسم المستخدم في واجهة المستخدم
    updateUserInfo();
    
    // التنقل إلى لوحة التحكم
    navigateToPage('dashboard');
}

// دالة معالجة تسجيل الخروج
function handleLogout() {
    // مسح بيانات الجلسة
    localStorage.removeItem('kawkabat_tasi_user');
    sessionStorage.removeItem('kawkabat_tasi_user');
    currentUser = null;
    
    // إظهار صفحة تسجيل الدخول وإخفاء التطبيق الرئيسي
    document.getElementById('login-page').style.display = 'flex';
    document.getElementById('main-app').style.display = 'none';
}

// دالة التحقق من وجود جلسة مسجلة
function checkSession() {
    // التحقق من وجود بيانات المستخدم في التخزين المحلي أو جلسة التخزين
    const storedUser = localStorage.getItem('kawkabat_tasi_user') || sessionStorage.getItem('kawkabat_tasi_user');
    
    if (storedUser) {
        currentUser = JSON.parse(storedUser);
        
        // إظهار التطبيق الرئيسي وإخفاء صفحة تسجيل الدخول
        document.getElementById('login-page').style.display = 'none';
        document.getElementById('main-app').style.display = 'flex';
        
        // تحديث اسم المستخدم في واجهة المستخدم
        updateUserInfo();
        
        // التنقل إلى لوحة التحكم
        navigateToPage('dashboard');
    }
}

// دالة تحديث معلومات المستخدم في واجهة المستخدم
function updateUserInfo() {
    const userNameElements = document.querySelectorAll('.user-name');
    userNameElements.forEach(element => {
        element.textContent = `مرحباً، ${currentUser.name}`;
    });
}

// دالة التنقل بين الصفحات
function navigateToPage(page) {
    // إخفاء جميع الصفحات
    const pages = document.querySelectorAll('.page-content');
    pages.forEach(p => {
        p.style.display = 'none';
    });
    
    // إظهار الصفحة المطلوبة
    document.getElementById(`${page}-page`).style.display = 'block';
    
    // تحديث العنصر النشط في القائمة الجانبية
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('data-page') === page) {
            item.classList.add('active');
        }
    });
    
    // تحديث الصفحة الحالية
    currentPage = page;
    
    // تهيئة عناصر خاصة بالصفحة المحددة
    if (page === 'charts' && document.getElementById('tradingview-chart')) {
        initTradingViewChart();
    }
}

// دالة التنقل بين صفحات الإعدادات
function navigateToSettingsPage(settingsPage) {
    // إخفاء جميع صفحات الإعدادات
    const settingsSections = document.querySelectorAll('.settings-section');
    settingsSections.forEach(section => {
        section.style.display = 'none';
    });
    
    // إظهار صفحة الإعدادات المطلوبة
    document.getElementById(`${settingsPage}-settings`).style.display = 'block';
    
    // تحديث العنصر النشط في قائمة الإعدادات
    const settingsNavItems = document.querySelectorAll('.settings-nav-item');
    settingsNavItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('data-settings') === settingsPage) {
            item.classList.add('active');
        }
    });
}

// دالة تهيئة الرسوم البيانية في لوحة التحكم
function initDashboardCharts() {
    // رسم بياني لأداء الإشارات
    const signalsPerformanceChart = document.getElementById('signals-performance-chart');
    if (signalsPerformanceChart) {
        new Chart(signalsPerformanceChart, {
            type: 'line',
            data: {
                labels: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو'],
                datasets: [{
                    label: 'نسبة النجاح',
                    data: [75, 78, 82, 79, 85, 84],
                    borderColor: '#f0c14b',
                    backgroundColor: 'rgba(240, 193, 75, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        position: 'top',
                        labels: {
                            color: '#cccccc'
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            color: '#cccccc'
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        }
                    },
                    x: {
                        ticks: {
                            color: '#cccccc'
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        }
                    }
                }
            }
        });
    }
    
    // رسم بياني لتوزيع أنواع الإشارات
    const signalsTypeChart = document.getElementById('signals-type-chart');
    if (signalsTypeChart) {
        new Chart(signalsTypeChart, {
            type: 'doughnut',
            data: {
                labels: ['شراء', 'بيع'],
                datasets: [{
                    data: [65, 35],
                    backgroundColor: ['#4caf50', '#f44336'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: '#cccccc'
                        }
                    }
                }
            }
        });
    }
    
    // رسم بياني لتوزيع أزواج العملات
    const signalsPairChart = document.getElementById('signals-pair-chart');
    if (signalsPairChart) {
        new Chart(signalsPairChart, {
            type: 'pie',
            data: {
                labels: ['EUR/USD', 'GBP/USD', 'USD/JPY', 'AUD/USD', 'USD/CAD'],
                datasets: [{
                    data: [30, 25, 20, 15, 10],
                    backgroundColor: ['#f0c14b', '#2196f3', '#4caf50', '#9c27b0', '#f44336'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: '#cccccc'
                        }
                    }
                }
            }
        });
    }
}

// دالة تهيئة رسم TradingView
function initTradingViewChart() {
    const container = document.getElementById('tradingview-chart');
    if (container) {
        new TradingView.widget({
            "autosize": true,
            "symbol": "EURUSD",
            "interval": "60",
            "timezone": "Asia/Riyadh",
            "theme": "dark",
            "style": "1",
            "locale": "ar",
            "toolbar_bg": "#131921",
            "enable_publishing": false,
            "hide_side_toolbar": false,
            "allow_symbol_change": true,
            "container_id": "tradingview-chart",
            "studies": [
                "MASimple@tv-basicstudies",
                "RSI@tv-basicstudies"
            ]
        });
    }
}

// دالة تحديث الرسم البياني عند تغيير الإطار الزمني
function updateChart(timeframe) {
    // في التطبيق الحقيقي، يجب تحديث الرسم البياني بناءً على الإطار الزمني المحدد
    console.log(`تم تحديث الرسم البياني إلى الإطار الزمني: ${timeframe}`);
}

// دالة تحديث نوع الرسم البياني
function updateChartType(chartType) {
    // في التطبيق الحقيقي، يجب تحديث نوع الرسم البياني
    console.log(`تم تحديث نوع الرسم البياني إلى: ${chartType}`);
}

// دالة تطبيق التصفية على الإشارات
function applyFilters() {
    const pairFilter = document.getElementById('pair-filter').value;
    const typeFilter = document.getElementById('type-filter').value;
    const statusFilter = document.getElementById('status-filter').value;
    
    // في التطبيق الحقيقي، يجب تصفية الإشارات بناءً على المعايير المحددة
    console.log(`تم تطبيق التصفية: الزوج=${pairFilter}, النوع=${typeFilter}, الحالة=${statusFilter}`);
}

// دالة عرض تفاصيل الإشارة
function showSignalDetails() {
    // في التطبيق الحقيقي، يجب عرض تفاصيل الإشارة المحددة
    alert('تم النقر على زر التفاصيل');
}

// دالة إغلاق الإشارة
function closeSignal() {
    // في التطبيق الحقيقي، يجب إغلاق الإشارة المحددة
    alert('تم النقر على زر الإغلاق');
}

// دالة عرض الرسم البياني للنمط
function viewPatternChart() {
    // في التطبيق الحقيقي، يجب الانتقال إلى صفحة الرسوم البيانية وعرض النمط المحدد
    navigateToPage('charts');
}

// دالة إنشاء إشارة من النمط
function createSignalFromPattern() {
    // في التطبيق الحقيقي، يجب إنشاء إشارة جديدة بناءً على النمط المحدد
    alert('تم إنشاء إشارة جديدة من النمط');
}

// دالة حفظ إعدادات المستخدم
function saveSettings() {
    // في التطبيق الحقيقي، يجب حفظ إعدادات المستخدم
    alert('تم حفظ الإعدادات بنجاح');
}

// دالة تغيير المظهر
function changeTheme(theme) {
    // في التطبيق الحقيقي، يجب تغيير مظهر التطبيق
    console.log(`تم تغيير المظهر إلى: ${theme}`);
}

// دالة تغيير اللون الرئيسي
function changeColor(color) {
    // في التطبيق الحقيقي، يجب تغيير اللون الرئيسي للتطبيق
    console.log(`تم تغيير اللون الرئيسي إلى: ${color}`);
}

// دالة تحديث العد التنازلي للأحداث الاقتصادية
function updateCountdowns() {
    const countdowns = document.querySelectorAll('.countdown');
    countdowns.forEach(countdown => {
        // في التطبيق الحقيقي، يجب حساب الوقت المتبقي بناءً على وقت الحدث
        // هنا نستخدم قيمة ثابتة للعرض فقط
        countdown.textContent = countdown.textContent;
    });
}
