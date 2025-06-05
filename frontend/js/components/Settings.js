// Settings.js - مكون صفحة الإعدادات
// يستخدم لعرض وتعديل إعدادات المستخدم وتفضيلاته

class SettingsComponent {
    constructor() {
        this.settings = {
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
        };
    }

    // تهيئة صفحة الإعدادات
    initialize(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) {
            console.error('لم يتم العثور على حاوية صفحة الإعدادات');
            return;
        }

        this.renderSettingsPage();
    }

    // إنشاء واجهة صفحة الإعدادات
    renderSettingsPage() {
        this.container.innerHTML = '';
        
        // إنشاء هيكل الصفحة
        const settingsPageContainer = document.createElement('div');
        settingsPageContainer.className = 'settings-page';
        
        // إنشاء رأس الصفحة
        const settingsHeader = document.createElement('div');
        settingsHeader.className = 'settings-header';
        
        const headerTitle = document.createElement('h2');
        headerTitle.textContent = 'الإعدادات';
        
        settingsHeader.appendChild(headerTitle);
        
        // إنشاء قائمة التبويبات
        const settingsTabs = document.createElement('div');
        settingsTabs.className = 'settings-tabs';
        
        const tabs = [
            { id: 'account', icon: 'bi-person', text: 'الحساب' },
            { id: 'notifications', icon: 'bi-bell', text: 'الإشعارات' },
            { id: 'display', icon: 'bi-display', text: 'العرض' },
            { id: 'trading', icon: 'bi-graph-up', text: 'التداول' },
            { id: 'security', icon: 'bi-shield-lock', text: 'الأمان' }
        ];
        
        tabs.forEach((tab, index) => {
            const tabButton = document.createElement('button');
            tabButton.className = 'settings-tab-button' + (index === 0 ? ' active' : '');
            tabButton.dataset.tab = tab.id;
            
            const tabIcon = document.createElement('i');
            tabIcon.className = `bi ${tab.icon}`;
            
            const tabText = document.createElement('span');
            tabText.textContent = tab.text;
            
            tabButton.appendChild(tabIcon);
            tabButton.appendChild(tabText);
            
            tabButton.addEventListener('click', () => {
                // إزالة الفئة النشطة من جميع الأزرار
                document.querySelectorAll('.settings-tab-button').forEach(btn => {
                    btn.classList.remove('active');
                });
                
                // إضافة الفئة النشطة للزر المحدد
                tabButton.classList.add('active');
                
                // إخفاء جميع أقسام المحتوى
                document.querySelectorAll('.settings-content-section').forEach(section => {
                    section.style.display = 'none';
                });
                
                // إظهار قسم المحتوى المحدد
                const selectedSection = document.getElementById(`settings-${tab.id}`);
                if (selectedSection) {
                    selectedSection.style.display = 'block';
                }
            });
            
            settingsTabs.appendChild(tabButton);
        });
        
        // إنشاء حاوية المحتوى
        const settingsContent = document.createElement('div');
        settingsContent.className = 'settings-content';
        
        // إنشاء أقسام المحتوى
        this.createAccountSection(settingsContent);
        this.createNotificationsSection(settingsContent);
        this.createDisplaySection(settingsContent);
        this.createTradingSection(settingsContent);
        this.createSecuritySection(settingsContent);
        
        // إضافة العناصر إلى الصفحة
        settingsPageContainer.appendChild(settingsHeader);
        settingsPageContainer.appendChild(settingsTabs);
        settingsPageContainer.appendChild(settingsContent);
        
        this.container.appendChild(settingsPageContainer);
        
        // عرض قسم الحساب افتراضيًا
        document.getElementById('settings-account').style.display = 'block';
    }
    
    // إنشاء قسم الحساب
    createAccountSection(container) {
        const accountSection = document.createElement('div');
        accountSection.className = 'settings-content-section';
        accountSection.id = 'settings-account';
        accountSection.style.display = 'none';
        
        const accountTitle = document.createElement('h3');
        accountTitle.textContent = 'معلومات الحساب';
        
        const accountForm = document.createElement('form');
        accountForm.className = 'settings-form';
        
        // صورة الملف الشخصي
        const profilePictureContainer = document.createElement('div');
        profilePictureContainer.className = 'profile-picture-container';
        
        const profilePicture = document.createElement('div');
        profilePicture.className = 'profile-picture';
        
        const profileIcon = document.createElement('i');
        profileIcon.className = 'bi bi-person-circle';
        
        const uploadButton = document.createElement('button');
        uploadButton.type = 'button';
        uploadButton.className = 'upload-picture-button';
        uploadButton.textContent = 'تغيير الصورة';
        
        profilePicture.appendChild(profileIcon);
        profilePictureContainer.appendChild(profilePicture);
        profilePictureContainer.appendChild(uploadButton);
        
        // حقول النموذج
        const formFields = [
            { id: 'name', label: 'الاسم', type: 'text', value: this.settings.account.name },
            { id: 'email', label: 'البريد الإلكتروني', type: 'email', value: this.settings.account.email },
            { id: 'phone', label: 'رقم الهاتف', type: 'tel', value: this.settings.account.phone }
        ];
        
        formFields.forEach(field => {
            const formGroup = document.createElement('div');
            formGroup.className = 'form-group';
            
            const label = document.createElement('label');
            label.htmlFor = field.id;
            label.textContent = field.label;
            
            const input = document.createElement('input');
            input.type = field.type;
            input.id = field.id;
            input.className = 'form-control';
            input.value = field.value;
            
            formGroup.appendChild(label);
            formGroup.appendChild(input);
            
            accountForm.appendChild(formGroup);
        });
        
        // زر الحفظ
        const saveButton = document.createElement('button');
        saveButton.type = 'submit';
        saveButton.className = 'btn btn-primary';
        saveButton.textContent = 'حفظ التغييرات';
        
        accountForm.appendChild(saveButton);
        
        // إضافة مستمع الحدث للنموذج
        accountForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // محاكاة حفظ البيانات
            this.settings.account.name = accountForm.querySelector('#name').value;
            this.settings.account.email = accountForm.querySelector('#email').value;
            this.settings.account.phone = accountForm.querySelector('#phone').value;
            
            // عرض رسالة نجاح
            this.showSuccessMessage('تم حفظ معلومات الحساب بنجاح');
        });
        
        accountSection.appendChild(accountTitle);
        accountSection.appendChild(profilePictureContainer);
        accountSection.appendChild(accountForm);
        
        container.appendChild(accountSection);
    }
    
    // إنشاء قسم الإشعارات
    createNotificationsSection(container) {
        const notificationsSection = document.createElement('div');
        notificationsSection.className = 'settings-content-section';
        notificationsSection.id = 'settings-notifications';
        notificationsSection.style.display = 'none';
        
        const notificationsTitle = document.createElement('h3');
        notificationsTitle.textContent = 'إعدادات الإشعارات';
        
        const notificationsForm = document.createElement('form');
        notificationsForm.className = 'settings-form';
        
        // خيارات الإشعارات
        const notificationOptions = [
            { id: 'email-notifications', label: 'إشعارات البريد الإلكتروني', checked: this.settings.notifications.email },
            { id: 'push-notifications', label: 'إشعارات الدفع', checked: this.settings.notifications.push },
            { id: 'signal-notifications', label: 'إشعارات الإشارات الجديدة', checked: this.settings.notifications.signals },
            { id: 'news-notifications', label: 'إشعارات الأخبار', checked: this.settings.notifications.news },
            { id: 'economic-notifications', label: 'إشعارات الأحداث الاقتصادية', checked: this.settings.notifications.economicEvents }
        ];
        
        notificationOptions.forEach(option => {
            const formCheck = document.createElement('div');
            formCheck.className = 'form-check';
            
            const checkInput = document.createElement('input');
            checkInput.type = 'checkbox';
            checkInput.className = 'form-check-input';
            checkInput.id = option.id;
            checkInput.checked = option.checked;
            
            const checkLabel = document.createElement('label');
            checkLabel.className = 'form-check-label';
            checkLabel.htmlFor = option.id;
            checkLabel.textContent = option.label;
            
            formCheck.appendChild(checkInput);
            formCheck.appendChild(checkLabel);
            
            notificationsForm.appendChild(formCheck);
        });
        
        // زر الحفظ
        const saveButton = document.createElement('button');
        saveButton.type = 'submit';
        saveButton.className = 'btn btn-primary';
        saveButton.textContent = 'حفظ التغييرات';
        
        notificationsForm.appendChild(saveButton);
        
        // إضافة مستمع الحدث للنموذج
        notificationsForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // محاكاة حفظ البيانات
            this.settings.notifications.email = notificationsForm.querySelector('#email-notifications').checked;
            this.settings.notifications.push = notificationsForm.querySelector('#push-notifications').checked;
            this.settings.notifications.signals = notificationsForm.querySelector('#signal-notifications').checked;
            this.settings.notifications.news = notificationsForm.querySelector('#news-notifications').checked;
            this.settings.notifications.economicEvents = notificationsForm.querySelector('#economic-notifications').checked;
            
            // عرض رسالة نجاح
            this.showSuccessMessage('تم حفظ إعدادات الإشعارات بنجاح');
        });
        
        notificationsSection.appendChild(notificationsTitle);
        notificationsSection.appendChild(notificationsForm);
        
        container.appendChild(notificationsSection);
    }
    
    // إنشاء قسم العرض
    createDisplaySection(container) {
        const displaySection = document.createElement('div');
        displaySection.className = 'settings-content-section';
        displaySection.id = 'settings-display';
        displaySection.style.display = 'none';
        
        const displayTitle = document.createElement('h3');
        displayTitle.textContent = 'إعدادات العرض';
        
        const displayForm = document.createElement('form');
        displayForm.className = 'settings-form';
        
        // إعدادات السمة
        const themeGroup = document.createElement('div');
        themeGroup.className = 'form-group';
        
        const themeLabel = document.createElement('label');
        themeLabel.textContent = 'السمة';
        
        const themeSelect = document.createElement('select');
        themeSelect.className = 'form-control';
        themeSelect.id = 'theme-select';
        
        const themeOptions = [
            { value: 'dark', text: 'داكنة' },
            { value: 'light', text: 'فاتحة' }
        ];
        
        themeOptions.forEach(option => {
            const optionElement = document.createElement('option');
            optionElement.value = option.value;
            optionElement.textContent = option.text;
            optionElement.selected = this.settings.display.theme === option.value;
            
            themeSelect.appendChild(optionElement);
        });
        
        themeGroup.appendChild(themeLabel);
        themeGroup.appendChild(themeSelect);
        
        // إعدادات نمط الرسم البياني
        const chartStyleGroup = document.createElement('div');
        chartStyleGroup.className = 'form-group';
        
        const chartStyleLabel = document.createElement('label');
        chartStyleLabel.textContent = 'نمط الرسم البياني';
        
        const chartStyleSelect = document.createElement('select');
        chartStyleSelect.className = 'form-control';
        chartStyleSelect.id = 'chart-style-select';
        
        const chartStyleOptions = [
            { value: 'candles', text: 'شموع' },
            { value: 'line', text: 'خط' },
            { value: 'bars', text: 'أعمدة' }
        ];
        
        chartStyleOptions.forEach(option => {
            const optionElement = document.createElement('option');
            optionElement.value = option.value;
            optionElement.textContent = option.text;
            optionElement.selected = this.settings.display.chartStyle === option.value;
            
            chartStyleSelect.appendChild(optionElement);
        });
        
        chartStyleGroup.appendChild(chartStyleLabel);
        chartStyleGroup.appendChild(chartStyleSelect);
        
        // إعدادات اللغة
        const languageGroup = document.createElement('div');
        languageGroup.className = 'form-group';
        
        const languageLabel = document.createElement('label');
        languageLabel.textContent = 'اللغة';
        
        const languageSelect = document.createElement('select');
        languageSelect.className = 'form-control';
        languageSelect.id = 'language-select';
        
        const languageOptions = [
            { value: 'ar', text: 'العربية' },
            { value: 'en', text: 'الإنجليزية' }
        ];
        
        languageOptions.forEach(option => {
            const optionElement = document.createElement('option');
            optionElement.value = option.value;
            optionElement.textContent = option.text;
            optionElement.selected = this.settings.display.language === option.value;
            
            languageSelect.appendChild(optionElement);
        });
        
        languageGroup.appendChild(languageLabel);
        languageGroup.appendChild(languageSelect);
        
        // إعدادات المنطقة الزمنية
        const timeZoneGroup = document.createElement('div');
        timeZoneGroup.className = 'form-group';
        
        const timeZoneLabel = document.createElement('label');
        timeZoneLabel.textContent = 'المنطقة الزمنية';
        
        const timeZoneSelect = document.createElement('select');
        timeZoneSelect.className = 'form-control';
        timeZoneSelect.id = 'timezone-select';
        
        const timeZoneOptions = [
            { value: 'Asia/Riyadh', text: 'الرياض (GMT+3)' },
            { value: 'Europe/London', text: 'لندن (GMT+0/+1)' },
            { value: 'America/New_York', text: 'نيويورك (GMT-5/-4)' },
            { value: 'Asia/Tokyo', text: 'طوكيو (GMT+9)' }
        ];
        
        timeZoneOptions.forEach(option => {
            const optionElement = document.createElement('option');
            optionElement.value = option.value;
            optionElement.textContent = option.text;
            optionElement.selected = this.settings.display.timeZone === option.value;
            
            timeZoneSelect.appendChild(optionElement);
        });
        
        timeZoneGroup.appendChild(timeZoneLabel);
        timeZoneGroup.appendChild(timeZoneSelect);
        
        // إعدادات عدد الخانات العشرية
        const decimalPlacesGroup = document.createElement('div');
        decimalPlacesGroup.className = 'form-group';
        
        const decimalPlacesLabel = document.createElement('label');
        decimalPlacesLabel.textContent = 'عدد الخانات العشرية';
        
        const decimalPlacesSelect = document.createElement('select');
        decimalPlacesSelect.className = 'form-control';
        decimalPlacesSelect.id = 'decimal-places-select';
        
        for (let i = 1; i <= 5; i++) {
            const optionElement = document.createElement('option');
            optionElement.value = i;
            optionElement.textContent = i;
            optionElement.selected = this.settings.display.decimalPlaces === i;
            
            decimalPlacesSelect.appendChild(optionElement);
        }
        
        decimalPlacesGroup.appendChild(decimalPlacesLabel);
        decimalPlacesGroup.appendChild(decimalPlacesSelect);
        
        // زر الحفظ
        const saveButton = document.createElement('button');
        saveButton.type = 'submit';
        saveButton.className = 'btn btn-primary';
        saveButton.textContent = 'حفظ التغييرات';
        
        // إضافة العناصر إلى النموذج
        displayForm.appendChild(themeGroup);
        displayForm.appendChild(chartStyleGroup);
        displayForm.appendChild(languageGroup);
        displayForm.appendChild(timeZoneGroup);
        displayForm.appendChild(decimalPlacesGroup);
        displayForm.appendChild(saveButton);
        
        // إضافة مستمع الحدث للنموذج
        displayForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // محاكاة حفظ البيانات
            this.settings.display.theme = displayForm.querySelector('#theme-select').value;
            this.settings.display.chartStyle = displayForm.querySelector('#chart-style-select').value;
            this.settings.display.language = displayForm.querySelector('#language-select').value;
            this.settings.display.timeZone = displayForm.querySelector('#timezone-select').value;
            this.settings.display.decimalPlaces = parseInt(displayForm.querySelector('#decimal-places-select').value);
            
            // عرض رسالة نجاح
            this.showSuccessMessage('تم حفظ إعدادات العرض بنجاح');
        });
        
        displaySection.appendChild(displayTitle);
        displaySection.appendChild(displayForm);
        
        container.appendChild(displaySection);
    }
    
    // إنشاء قسم التداول
    createTradingSection(container) {
        const tradingSection = document.createElement('div');
        tradingSection.className = 'settings-content-section';
        tradingSection.id = 'settings-trading';
        tradingSection.style.display = 'none';
        
        const tradingTitle = document.createElement('h3');
        tradingTitle.textContent = 'إعدادات التداول';
        
        const tradingForm = document.createElement('form');
        tradingForm.className = 'settings-form';
        
        // إعدادات الرافعة المالية
        const leverageGroup = document.createElement('div');
        leverageGroup.className = 'form-group';
        
        const leverageLabel = document.createElement('label');
        leverageLabel.textContent = 'الرافعة المالية الافتراضية';
        
        const leverageSelect = document.createElement('select');
        leverageSelect.className = 'form-control';
        leverageSelect.id = 'leverage-select';
        
        const leverageOptions = ['1:1', '1:10', '1:50', '1:100', '1:200', '1:500'];
        
        leverageOptions.forEach(option => {
            const optionElement = document.createElement('option');
            optionElement.value = option;
            optionElement.textContent = option;
            optionElement.selected = this.settings.trading.defaultLeverage === option;
            
            leverageSelect.appendChild(optionElement);
        });
        
        leverageGroup.appendChild(leverageLabel);
        leverageGroup.appendChild(leverageSelect);
        
        // إعدادات حجم العقد
        const lotSizeGroup = document.createElement('div');
        lotSizeGroup.className = 'form-group';
        
        const lotSizeLabel = document.createElement('label');
        lotSizeLabel.textContent = 'حجم العقد الافتراضي';
        
        const lotSizeSelect = document.createElement('select');
        lotSizeSelect.className = 'form-control';
        lotSizeSelect.id = 'lot-size-select';
        
        const lotSizeOptions = [0.01, 0.05, 0.1, 0.5, 1, 5, 10];
        
        lotSizeOptions.forEach(option => {
            const optionElement = document.createElement('option');
            optionElement.value = option;
            optionElement.textContent = option;
            optionElement.selected = this.settings.trading.defaultLotSize === option;
            
            lotSizeSelect.appendChild(optionElement);
        });
        
        lotSizeGroup.appendChild(lotSizeLabel);
        lotSizeGroup.appendChild(lotSizeSelect);
        
        // إعدادات وقف الخسارة
        const stopLossGroup = document.createElement('div');
        stopLossGroup.className = 'form-group';
        
        const stopLossLabel = document.createElement('label');
        stopLossLabel.textContent = 'وقف الخسارة الافتراضي (نقاط)';
        
        const stopLossInput = document.createElement('input');
        stopLossInput.type = 'number';
        stopLossInput.className = 'form-control';
        stopLossInput.id = 'stop-loss-input';
        stopLossInput.value = this.settings.trading.defaultStopLoss;
        stopLossInput.min = 1;
        
        stopLossGroup.appendChild(stopLossLabel);
        stopLossGroup.appendChild(stopLossInput);
        
        // إعدادات جني الأرباح
        const takeProfitGroup = document.createElement('div');
        takeProfitGroup.className = 'form-group';
        
        const takeProfitLabel = document.createElement('label');
        takeProfitLabel.textContent = 'جني الأرباح الافتراضي (نقاط)';
        
        const takeProfitInput = document.createElement('input');
        takeProfitInput.type = 'number';
        takeProfitInput.className = 'form-control';
        takeProfitInput.id = 'take-profit-input';
        takeProfitInput.value = this.settings.trading.defaultTakeProfit;
        takeProfitInput.min = 1;
        
        takeProfitGroup.appendChild(takeProfitLabel);
        takeProfitGroup.appendChild(takeProfitInput);
        
        // إعدادات نسبة المخاطرة
        const riskGroup = document.createElement('div');
        riskGroup.className = 'form-group';
        
        const riskLabel = document.createElement('label');
        riskLabel.textContent = 'نسبة المخاطرة (%)';
        
        const riskInput = document.createElement('input');
        riskInput.type = 'number';
        riskInput.className = 'form-control';
        riskInput.id = 'risk-input';
        riskInput.value = this.settings.trading.riskPercentage;
        riskInput.min = 0.1;
        riskInput.max = 10;
        riskInput.step = 0.1;
        
        riskGroup.appendChild(riskLabel);
        riskGroup.appendChild(riskInput);
        
        // زر الحفظ
        const saveButton = document.createElement('button');
        saveButton.type = 'submit';
        saveButton.className = 'btn btn-primary';
        saveButton.textContent = 'حفظ التغييرات';
        
        // إضافة العناصر إلى النموذج
        tradingForm.appendChild(leverageGroup);
        tradingForm.appendChild(lotSizeGroup);
        tradingForm.appendChild(stopLossGroup);
        tradingForm.appendChild(takeProfitGroup);
        tradingForm.appendChild(riskGroup);
        tradingForm.appendChild(saveButton);
        
        // إضافة مستمع الحدث للنموذج
        tradingForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // محاكاة حفظ البيانات
            this.settings.trading.defaultLeverage = tradingForm.querySelector('#leverage-select').value;
            this.settings.trading.defaultLotSize = parseFloat(tradingForm.querySelector('#lot-size-select').value);
            this.settings.trading.defaultStopLoss = parseInt(tradingForm.querySelector('#stop-loss-input').value);
            this.settings.trading.defaultTakeProfit = parseInt(tradingForm.querySelector('#take-profit-input').value);
            this.settings.trading.riskPercentage = parseFloat(tradingForm.querySelector('#risk-input').value);
            
            // عرض رسالة نجاح
            this.showSuccessMessage('تم حفظ إعدادات التداول بنجاح');
        });
        
        tradingSection.appendChild(tradingTitle);
        tradingSection.appendChild(tradingForm);
        
        container.appendChild(tradingSection);
    }
    
    // إنشاء قسم الأمان
    createSecuritySection(container) {
        const securitySection = document.createElement('div');
        securitySection.className = 'settings-content-section';
        securitySection.id = 'settings-security';
        securitySection.style.display = 'none';
        
        const securityTitle = document.createElement('h3');
        securityTitle.textContent = 'إعدادات الأمان';
        
        const securityForm = document.createElement('form');
        securityForm.className = 'settings-form';
        
        // تغيير كلمة المرور
        const passwordTitle = document.createElement('h4');
        passwordTitle.textContent = 'تغيير كلمة المرور';
        
        const currentPasswordGroup = document.createElement('div');
        currentPasswordGroup.className = 'form-group';
        
        const currentPasswordLabel = document.createElement('label');
        currentPasswordLabel.textContent = 'كلمة المرور الحالية';
        
        const currentPasswordInput = document.createElement('input');
        currentPasswordInput.type = 'password';
        currentPasswordInput.className = 'form-control';
        currentPasswordInput.id = 'current-password';
        
        currentPasswordGroup.appendChild(currentPasswordLabel);
        currentPasswordGroup.appendChild(currentPasswordInput);
        
        const newPasswordGroup = document.createElement('div');
        newPasswordGroup.className = 'form-group';
        
        const newPasswordLabel = document.createElement('label');
        newPasswordLabel.textContent = 'كلمة المرور الجديدة';
        
        const newPasswordInput = document.createElement('input');
        newPasswordInput.type = 'password';
        newPasswordInput.className = 'form-control';
        newPasswordInput.id = 'new-password';
        
        newPasswordGroup.appendChild(newPasswordLabel);
        newPasswordGroup.appendChild(newPasswordInput);
        
        const confirmPasswordGroup = document.createElement('div');
        confirmPasswordGroup.className = 'form-group';
        
        const confirmPasswordLabel = document.createElement('label');
        confirmPasswordLabel.textContent = 'تأكيد كلمة المرور الجديدة';
        
        const confirmPasswordInput = document.createElement('input');
        confirmPasswordInput.type = 'password';
        confirmPasswordInput.className = 'form-control';
        confirmPasswordInput.id = 'confirm-password';
        
        confirmPasswordGroup.appendChild(confirmPasswordLabel);
        confirmPasswordGroup.appendChild(confirmPasswordInput);
        
        const changePasswordButton = document.createElement('button');
        changePasswordButton.type = 'button';
        changePasswordButton.className = 'btn btn-primary';
        changePasswordButton.textContent = 'تغيير كلمة المرور';
        
        changePasswordButton.addEventListener('click', () => {
            const currentPassword = currentPasswordInput.value;
            const newPassword = newPasswordInput.value;
            const confirmPassword = confirmPasswordInput.value;
            
            if (!currentPassword || !newPassword || !confirmPassword) {
                this.showErrorMessage('يرجى ملء جميع الحقول');
                return;
            }
            
            if (newPassword !== confirmPassword) {
                this.showErrorMessage('كلمة المرور الجديدة وتأكيدها غير متطابقين');
                return;
            }
            
            // محاكاة تغيير كلمة المرور
            this.showSuccessMessage('تم تغيير كلمة المرور بنجاح');
            
            // مسح الحقول
            currentPasswordInput.value = '';
            newPasswordInput.value = '';
            confirmPasswordInput.value = '';
        });
        
        // المصادقة الثنائية
        const twoFactorTitle = document.createElement('h4');
        twoFactorTitle.textContent = 'المصادقة الثنائية';
        twoFactorTitle.className = 'mt-4';
        
        const twoFactorGroup = document.createElement('div');
        twoFactorGroup.className = 'form-check';
        
        const twoFactorInput = document.createElement('input');
        twoFactorInput.type = 'checkbox';
        twoFactorInput.className = 'form-check-input';
        twoFactorInput.id = 'two-factor-auth';
        twoFactorInput.checked = this.settings.security.twoFactorAuth;
        
        const twoFactorLabel = document.createElement('label');
        twoFactorLabel.className = 'form-check-label';
        twoFactorLabel.htmlFor = 'two-factor-auth';
        twoFactorLabel.textContent = 'تفعيل المصادقة الثنائية';
        
        twoFactorGroup.appendChild(twoFactorInput);
        twoFactorGroup.appendChild(twoFactorLabel);
        
        // مهلة الجلسة
        const sessionTimeoutTitle = document.createElement('h4');
        sessionTimeoutTitle.textContent = 'مهلة الجلسة';
        sessionTimeoutTitle.className = 'mt-4';
        
        const sessionTimeoutGroup = document.createElement('div');
        sessionTimeoutGroup.className = 'form-group';
        
        const sessionTimeoutLabel = document.createElement('label');
        sessionTimeoutLabel.textContent = 'مهلة الجلسة (دقائق)';
        
        const sessionTimeoutSelect = document.createElement('select');
        sessionTimeoutSelect.className = 'form-control';
        sessionTimeoutSelect.id = 'session-timeout';
        
        const timeoutOptions = [5, 15, 30, 60, 120];
        
        timeoutOptions.forEach(option => {
            const optionElement = document.createElement('option');
            optionElement.value = option;
            optionElement.textContent = option;
            optionElement.selected = this.settings.security.sessionTimeout === option;
            
            sessionTimeoutSelect.appendChild(optionElement);
        });
        
        sessionTimeoutGroup.appendChild(sessionTimeoutLabel);
        sessionTimeoutGroup.appendChild(sessionTimeoutSelect);
        
        // الأجهزة المتصلة
        const devicesTitle = document.createElement('h4');
        devicesTitle.textContent = 'الأجهزة المتصلة';
        devicesTitle.className = 'mt-4';
        
        const devicesTable = document.createElement('table');
        devicesTable.className = 'table table-dark table-striped';
        
        const tableHead = document.createElement('thead');
        const headRow = document.createElement('tr');
        
        ['الجهاز', 'آخر دخول', 'الإجراء'].forEach(text => {
            const th = document.createElement('th');
            th.textContent = text;
            headRow.appendChild(th);
        });
        
        tableHead.appendChild(headRow);
        
        const tableBody = document.createElement('tbody');
        
        this.settings.security.devices.forEach(device => {
            const row = document.createElement('tr');
            
            const deviceCell = document.createElement('td');
            deviceCell.textContent = device.name;
            if (device.current) {
                const currentBadge = document.createElement('span');
                currentBadge.className = 'badge bg-primary ms-2';
                currentBadge.textContent = 'الحالي';
                deviceCell.appendChild(currentBadge);
            }
            
            const lastAccessCell = document.createElement('td');
            const date = new Date(device.lastAccess);
            lastAccessCell.textContent = date.toLocaleString('ar-SA');
            
            const actionCell = document.createElement('td');
            
            if (!device.current) {
                const logoutButton = document.createElement('button');
                logoutButton.type = 'button';
                logoutButton.className = 'btn btn-sm btn-danger';
                logoutButton.textContent = 'تسجيل الخروج';
                
                logoutButton.addEventListener('click', () => {
                    // محاكاة تسجيل الخروج من الجهاز
                    this.showSuccessMessage(`تم تسجيل الخروج من جهاز ${device.name}`);
                });
                
                actionCell.appendChild(logoutButton);
            }
            
            row.appendChild(deviceCell);
            row.appendChild(lastAccessCell);
            row.appendChild(actionCell);
            
            tableBody.appendChild(row);
        });
        
        devicesTable.appendChild(tableHead);
        devicesTable.appendChild(tableBody);
        
        // زر حفظ إعدادات الأمان
        const saveSecurityButton = document.createElement('button');
        saveSecurityButton.type = 'submit';
        saveSecurityButton.className = 'btn btn-primary mt-4';
        saveSecurityButton.textContent = 'حفظ إعدادات الأمان';
        
        // إضافة العناصر إلى النموذج
        securityForm.appendChild(passwordTitle);
        securityForm.appendChild(currentPasswordGroup);
        securityForm.appendChild(newPasswordGroup);
        securityForm.appendChild(confirmPasswordGroup);
        securityForm.appendChild(changePasswordButton);
        
        securityForm.appendChild(twoFactorTitle);
        securityForm.appendChild(twoFactorGroup);
        
        securityForm.appendChild(sessionTimeoutTitle);
        securityForm.appendChild(sessionTimeoutGroup);
        
        securityForm.appendChild(devicesTitle);
        securityForm.appendChild(devicesTable);
        
        securityForm.appendChild(saveSecurityButton);
        
        // إضافة مستمع الحدث للنموذج
        securityForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // محاكاة حفظ البيانات
            this.settings.security.twoFactorAuth = securityForm.querySelector('#two-factor-auth').checked;
            this.settings.security.sessionTimeout = parseInt(securityForm.querySelector('#session-timeout').value);
            
            // عرض رسالة نجاح
            this.showSuccessMessage('تم حفظ إعدادات الأمان بنجاح');
        });
        
        securitySection.appendChild(securityTitle);
        securitySection.appendChild(securityForm);
        
        container.appendChild(securitySection);
    }
    
    // عرض رسالة نجاح
    showSuccessMessage(message) {
        const alertContainer = document.createElement('div');
        alertContainer.className = 'alert alert-success alert-dismissible fade show settings-alert';
        alertContainer.role = 'alert';
        
        const alertMessage = document.createElement('span');
        alertMessage.textContent = message;
        
        const closeButton = document.createElement('button');
        closeButton.type = 'button';
        closeButton.className = 'btn-close';
        closeButton.setAttribute('data-bs-dismiss', 'alert');
        closeButton.setAttribute('aria-label', 'إغلاق');
        
        alertContainer.appendChild(alertMessage);
        alertContainer.appendChild(closeButton);
        
        // إضافة التنبيه إلى الصفحة
        this.container.prepend(alertContainer);
        
        // إزالة التنبيه بعد 3 ثوانٍ
        setTimeout(() => {
            alertContainer.classList.remove('show');
            setTimeout(() => {
                alertContainer.remove();
            }, 300);
        }, 3000);
    }
    
    // عرض رسالة خطأ
    showErrorMessage(message) {
        const alertContainer = document.createElement('div');
        alertContainer.className = 'alert alert-danger alert-dismissible fade show settings-alert';
        alertContainer.role = 'alert';
        
        const alertMessage = document.createElement('span');
        alertMessage.textContent = message;
        
        const closeButton = document.createElement('button');
        closeButton.type = 'button';
        closeButton.className = 'btn-close';
        closeButton.setAttribute('data-bs-dismiss', 'alert');
        closeButton.setAttribute('aria-label', 'إغلاق');
        
        alertContainer.appendChild(alertMessage);
        alertContainer.appendChild(closeButton);
        
        // إضافة التنبيه إلى الصفحة
        this.container.prepend(alertContainer);
        
        // إزالة التنبيه بعد 3 ثوانٍ
        setTimeout(() => {
            alertContainer.classList.remove('show');
            setTimeout(() => {
                alertContainer.remove();
            }, 300);
        }, 3000);
    }
}

// تصدير المكون
window.SettingsComponent = SettingsComponent;
