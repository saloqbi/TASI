// App.js - المكون الرئيسي للتطبيق

// تعريف App كدالة عادية بدلاً من دالة سهمية لضمان توفرها في النطاق العام
function App() {
    this.render = function() {
        console.log("تهيئة تطبيق كوكبة تاسي لسحر الأرقام والتوصيات الذكية");
        
        // عرض شاشة تسجيل الدخول
        const loginContainer = document.createElement('div');
        loginContainer.className = 'login-container';
        
        const loginLogo = document.createElement('div');
        loginLogo.className = 'login-logo';
        
        const logoImg = document.createElement('img');
        logoImg.src = 'assets/images/logo.png';
        logoImg.alt = 'كوكبة تاسي لسحر الأرقام والتوصيات الذكية';
        
        const title = document.createElement('h1');
        title.textContent = 'كوكبة تاسي';
        
        const subtitle = document.createElement('p');
        subtitle.textContent = 'لسحر الأرقام والتوصيات الذكية';
        
        loginLogo.appendChild(logoImg);
        loginLogo.appendChild(title);
        loginLogo.appendChild(subtitle);
        
        const loginForm = document.createElement('form');
        loginForm.className = 'login-form';
        
        const emailGroup = document.createElement('div');
        emailGroup.className = 'form-group';
        
        const emailInput = document.createElement('input');
        emailInput.type = 'email';
        emailInput.className = 'form-control';
        emailInput.placeholder = 'البريد الإلكتروني';
        emailInput.required = true;
        
        emailGroup.appendChild(emailInput);
        
        const passwordGroup = document.createElement('div');
        passwordGroup.className = 'form-group';
        
        const passwordInput = document.createElement('input');
        passwordInput.type = 'password';
        passwordInput.className = 'form-control';
        passwordInput.placeholder = 'كلمة المرور';
        passwordInput.required = true;
        
        passwordGroup.appendChild(passwordInput);
        
        const loginButton = document.createElement('button');
        loginButton.type = 'submit';
        loginButton.className = 'btn btn-primary';
        loginButton.style.width = '100%';
        loginButton.textContent = 'تسجيل الدخول';
        
        loginForm.appendChild(emailGroup);
        loginForm.appendChild(passwordGroup);
        loginForm.appendChild(loginButton);
        
        const loginLinks = document.createElement('div');
        loginLinks.className = 'login-links';
        
        const forgotLink = document.createElement('a');
        forgotLink.href = '#';
        forgotLink.textContent = 'نسيت كلمة المرور؟';
        
        const registerLink = document.createElement('a');
        registerLink.href = '#';
        registerLink.textContent = 'إنشاء حساب جديد';
        
        loginLinks.appendChild(forgotLink);
        loginLinks.appendChild(registerLink);
        
        loginContainer.appendChild(loginLogo);
        loginContainer.appendChild(loginForm);
        loginContainer.appendChild(loginLinks);
        
        // إضافة نموذج تسجيل الدخول إلى DOM
        const appContainer = document.getElementById('app');
        appContainer.innerHTML = '';
        appContainer.appendChild(loginContainer);
        
        // إضافة مستمع الحدث لنموذج تسجيل الدخول
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = emailInput.value;
            const password = passwordInput.value;
            
            if (email && password) {
                loginButton.textContent = 'جاري تسجيل الدخول...';
                loginButton.disabled = true;
                
                // محاكاة عملية تسجيل الدخول
                setTimeout(function() {
                    // توليد رمز مؤقت للمصادقة
                    const mockToken = `mock-token-${Date.now()}`;
                    localStorage.setItem('koukaba_tasi_token', mockToken);
                    
                    // عرض لوحة التحكم
                    const dashboard = new Dashboard();
                    dashboard.render();
                }, 1000);
            }
        });
    };
}

// تعريف Login كدالة عادية
function Login() {
    this.render = function() {
        console.log("عرض صفحة تسجيل الدخول");
        
        // عرض شاشة تسجيل الدخول
        const loginContainer = document.createElement('div');
        loginContainer.className = 'login-container';
        
        const loginLogo = document.createElement('div');
        loginLogo.className = 'login-logo';
        
        const logoImg = document.createElement('img');
        logoImg.src = 'assets/images/logo.png';
        logoImg.alt = 'كوكبة تاسي لسحر الأرقام والتوصيات الذكية';
        
        const title = document.createElement('h1');
        title.textContent = 'كوكبة تاسي';
        
        const subtitle = document.createElement('p');
        subtitle.textContent = 'لسحر الأرقام والتوصيات الذكية';
        
        loginLogo.appendChild(logoImg);
        loginLogo.appendChild(title);
        loginLogo.appendChild(subtitle);
        
        const loginForm = document.createElement('form');
        loginForm.className = 'login-form';
        
        const emailGroup = document.createElement('div');
        emailGroup.className = 'form-group';
        
        const emailInput = document.createElement('input');
        emailInput.type = 'email';
        emailInput.className = 'form-control';
        emailInput.placeholder = 'البريد الإلكتروني';
        emailInput.required = true;
        
        emailGroup.appendChild(emailInput);
        
        const passwordGroup = document.createElement('div');
        passwordGroup.className = 'form-group';
        
        const passwordInput = document.createElement('input');
        passwordInput.type = 'password';
        passwordInput.className = 'form-control';
        passwordInput.placeholder = 'كلمة المرور';
        passwordInput.required = true;
        
        passwordGroup.appendChild(passwordInput);
        
        const loginButton = document.createElement('button');
        loginButton.type = 'submit';
        loginButton.className = 'btn btn-primary';
        loginButton.style.width = '100%';
        loginButton.textContent = 'تسجيل الدخول';
        
        loginForm.appendChild(emailGroup);
        loginForm.appendChild(passwordGroup);
        loginForm.appendChild(loginButton);
        
        const loginLinks = document.createElement('div');
        loginLinks.className = 'login-links';
        
        const forgotLink = document.createElement('a');
        forgotLink.href = '#';
        forgotLink.textContent = 'نسيت كلمة المرور؟';
        
        const registerLink = document.createElement('a');
        registerLink.href = '#';
        registerLink.textContent = 'إنشاء حساب جديد';
        
        loginLinks.appendChild(forgotLink);
        loginLinks.appendChild(registerLink);
        
        loginContainer.appendChild(loginLogo);
        loginContainer.appendChild(loginForm);
        loginContainer.appendChild(loginLinks);
        
        // إضافة نموذج تسجيل الدخول إلى DOM
        const appContainer = document.getElementById('app');
        appContainer.innerHTML = '';
        appContainer.appendChild(loginContainer);
        
        // إضافة مستمع الحدث لنموذج تسجيل الدخول
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = emailInput.value;
            const password = passwordInput.value;
            
            if (email && password) {
                loginButton.textContent = 'جاري تسجيل الدخول...';
                loginButton.disabled = true;
                
                // محاكاة عملية تسجيل الدخول
                setTimeout(function() {
                    // توليد رمز مؤقت للمصادقة
                    const mockToken = `mock-token-${Date.now()}`;
                    localStorage.setItem('koukaba_tasi_token', mockToken);
                    
                    // عرض لوحة التحكم
                    const dashboard = new Dashboard();
                    dashboard.render();
                }, 1000);
            }
        });
    };
}

// تعريف Dashboard كدالة عادية
function Dashboard() {
    this.render = function() {
        console.log("عرض لوحة التحكم");
        
        // إنشاء هيكل لوحة التحكم
        const dashboardContainer = document.createElement('div');
        dashboardContainer.className = 'dashboard-container';
        
        // إنشاء شريط التنقل
        const navigation = document.createElement('div');
        navigation.className = 'navigation';
        
        const navLogo = document.createElement('div');
        navLogo.className = 'nav-logo';
        
        const logoImg = document.createElement('img');
        logoImg.src = 'assets/images/logo.png';
        logoImg.alt = 'كوكبة تاسي لسحر الأرقام والتوصيات الذكية';
        
        const logoText = document.createElement('span');
        logoText.textContent = 'كوكبة تاسي';
        
        navLogo.appendChild(logoImg);
        navLogo.appendChild(logoText);
        
        const navLinks = document.createElement('div');
        navLinks.className = 'nav-links';
        
        const navItems = [
            { icon: 'bi-speedometer2', text: 'لوحة التحكم', active: true },
            { icon: 'bi-graph-up', text: 'الإشارات' },
            { icon: 'bi-bar-chart', text: 'الرسوم البيانية' },
            { icon: 'bi-grid', text: 'الأنماط' },
            { icon: 'bi-calendar', text: 'التقويم الاقتصادي' },
            { icon: 'bi-gear', text: 'الإعدادات' }
        ];
        
        navItems.forEach(item => {
            const navItem = document.createElement('a');
            navItem.href = '#';
            navItem.className = item.active ? 'active' : '';
            
            const icon = document.createElement('i');
            icon.className = `bi ${item.icon}`;
            
            const text = document.createElement('span');
            text.textContent = item.text;
            
            navItem.appendChild(icon);
            navItem.appendChild(text);
            
            navLinks.appendChild(navItem);
        });
        
        const navUser = document.createElement('div');
        navUser.className = 'nav-user';
        
        const userIcon = document.createElement('i');
        userIcon.className = 'bi bi-person-circle';
        
        const userName = document.createElement('span');
        userName.textContent = 'المستخدم';
        
        const logoutIcon = document.createElement('i');
        logoutIcon.className = 'bi bi-box-arrow-right';
        
        navUser.appendChild(userIcon);
        navUser.appendChild(userName);
        navUser.appendChild(logoutIcon);
        
        navigation.appendChild(navLogo);
        navigation.appendChild(navLinks);
        navigation.appendChild(navUser);
        
        // إنشاء محتوى لوحة التحكم
        const dashboardContent = document.createElement('div');
        dashboardContent.className = 'dashboard-content';
        
        const dashboardHeader = document.createElement('div');
        dashboardHeader.className = 'dashboard-header';
        
        const headerTitle = document.createElement('h2');
        headerTitle.textContent = 'لوحة التحكم';
        
        const headerDate = document.createElement('p');
        headerDate.textContent = new Date().toLocaleDateString('ar-SA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
        
        dashboardHeader.appendChild(headerTitle);
        dashboardHeader.appendChild(headerDate);
        
        // إنشاء بطاقات لوحة التحكم
        const dashboardCards = document.createElement('div');
        dashboardCards.className = 'dashboard-cards';
        
        // بطاقة نظرة عامة على السوق
        const marketCard = document.createElement('div');
        marketCard.className = 'dashboard-card';
        
        const marketCardHeader = document.createElement('div');
        marketCardHeader.className = 'card-header';
        
        const marketCardTitle = document.createElement('h3');
        marketCardTitle.textContent = 'نظرة عامة على السوق';
        
        marketCardHeader.appendChild(marketCardTitle);
        
        const marketCardContent = document.createElement('div');
        marketCardContent.className = 'card-content';
        
        const marketTable = document.createElement('table');
        marketTable.className = 'market-table';
        
        const marketTableHead = document.createElement('thead');
        const marketTableHeadRow = document.createElement('tr');
        
        ['الزوج', 'السعر', 'التغيير', 'الاتجاه'].forEach(text => {
            const th = document.createElement('th');
            th.textContent = text;
            marketTableHeadRow.appendChild(th);
        });
        
        marketTableHead.appendChild(marketTableHeadRow);
        
        const marketTableBody = document.createElement('tbody');
        
        const marketData = [
            { pair: 'EUR/USD', price: '1.0915', change: '+0.05%', trend: 'up' },
            { pair: 'GBP/USD', price: '1.2760', change: '-0.12%', trend: 'down' },
            { pair: 'USD/JPY', price: '107.65', change: '+0.23%', trend: 'up' },
            { pair: 'AUD/USD', price: '0.6940', change: '-0.08%', trend: 'down' }
        ];
        
        marketData.forEach(item => {
            const tr = document.createElement('tr');
            
            const pairTd = document.createElement('td');
            pairTd.textContent = item.pair;
            
            const priceTd = document.createElement('td');
            priceTd.textContent = item.price;
            
            const changeTd = document.createElement('td');
            changeTd.textContent = item.change;
            changeTd.className = item.trend === 'up' ? 'text-success' : 'text-danger';
            
            const trendTd = document.createElement('td');
            const trendIcon = document.createElement('i');
            trendIcon.className = item.trend === 'up' ? 'bi bi-arrow-up-right text-success' : 'bi bi-arrow-down-right text-danger';
            trendTd.appendChild(trendIcon);
            
            tr.appendChild(pairTd);
            tr.appendChild(priceTd);
            tr.appendChild(changeTd);
            tr.appendChild(trendTd);
            
            marketTableBody.appendChild(tr);
        });
        
        marketTable.appendChild(marketTableHead);
        marketTable.appendChild(marketTableBody);
        
        marketCardContent.appendChild(marketTable);
        
        marketCard.appendChild(marketCardHeader);
        marketCard.appendChild(marketCardContent);
        
        // بطاقة أحدث الإشارات
        const signalsCard = document.createElement('div');
        signalsCard.className = 'dashboard-card';
        
        const signalsCardHeader = document.createElement('div');
        signalsCardHeader.className = 'card-header';
        
        const signalsCardTitle = document.createElement('h3');
        signalsCardTitle.textContent = 'أحدث الإشارات';
        
        const signalsCardLink = document.createElement('a');
        signalsCardLink.href = '#';
        signalsCardLink.textContent = 'عرض الكل';
        
        signalsCardHeader.appendChild(signalsCardTitle);
        signalsCardHeader.appendChild(signalsCardLink);
        
        const signalsCardContent = document.createElement('div');
        signalsCardContent.className = 'card-content';
        
        const signalsList = document.createElement('div');
        signalsList.className = 'signals-list';
        
        const signalsData = [
            { pair: 'EUR/USD', type: 'شراء', price: '1.0915', time: '10:30', status: 'active' },
            { pair: 'GBP/USD', type: 'بيع', price: '1.2760', time: '09:45', status: 'active' },
            { pair: 'USD/JPY', type: 'شراء', price: '107.65', time: '08:15', status: 'closed', result: '+70 نقطة' }
        ];
        
        signalsData.forEach(item => {
            const signalItem = document.createElement('div');
            signalItem.className = 'signal-item';
            
            const signalInfo = document.createElement('div');
            signalInfo.className = 'signal-info';
            
            const signalPair = document.createElement('span');
            signalPair.className = 'signal-pair';
            signalPair.textContent = item.pair;
            
            const signalType = document.createElement('span');
            signalType.className = `signal-type ${item.type === 'شراء' ? 'buy' : 'sell'}`;
            signalType.textContent = item.type;
            
            signalInfo.appendChild(signalPair);
            signalInfo.appendChild(signalType);
            
            const signalDetails = document.createElement('div');
            signalDetails.className = 'signal-details';
            
            const signalPrice = document.createElement('span');
            signalPrice.className = 'signal-price';
            signalPrice.textContent = item.price;
            
            const signalTime = document.createElement('span');
            signalTime.className = 'signal-time';
            signalTime.textContent = item.time;
            
            signalDetails.appendChild(signalPrice);
            signalDetails.appendChild(signalTime);
            
            const signalStatus = document.createElement('div');
            signalStatus.className = 'signal-status';
            
            if (item.status === 'active') {
                const statusBadge = document.createElement('span');
                statusBadge.className = 'status-badge active';
                statusBadge.textContent = 'نشطة';
                signalStatus.appendChild(statusBadge);
            } else {
                const resultBadge = document.createElement('span');
                resultBadge.className = 'result-badge';
                resultBadge.textContent = item.result;
                signalStatus.appendChild(resultBadge);
            }
            
            signalItem.appendChild(signalInfo);
            signalItem.appendChild(signalDetails);
            signalItem.appendChild(signalStatus);
            
            signalsList.appendChild(signalItem);
        });
        
        signalsCardContent.appendChild(signalsList);
        
        signalsCard.appendChild(signalsCardHeader);
        signalsCard.appendChild(signalsCardContent);
        
        // إضافة البطاقات إلى لوحة التحكم
        dashboardCards.appendChild(marketCard);
        dashboardCards.appendChild(signalsCard);
        
        // إضافة المحتوى إلى لوحة التحكم
        dashboardContent.appendChild(dashboardHeader);
        dashboardContent.appendChild(dashboardCards);
        
        // إضافة العناصر إلى حاوية لوحة التحكم
        dashboardContainer.appendChild(navigation);
        dashboardContainer.appendChild(dashboardContent);
        
        // إضافة لوحة التحكم إلى DOM
        const appContainer = document.getElementById('app');
        appContainer.innerHTML = '';
        appContainer.appendChild(dashboardContainer);
        
        // إضافة مستمع الحدث لزر تسجيل الخروج
        logoutIcon.addEventListener('click', function() {
            localStorage.removeItem('koukaba_tasi_token');
            const login = new Login();
            login.render();
        });
    };
}

// تعريف الدوال الأخرى بنفس الطريقة...

// إضافة مستمع الحدث لتسجيل الخروج
document.addEventListener('logout', function() {
    localStorage.removeItem('koukaba_tasi_token');
    const login = new Login();
    login.render();
});
