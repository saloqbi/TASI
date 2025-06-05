// Patterns.js - مكون صفحة الأنماط والتحليلات المتناغمة
// يستخدم لعرض أنماط التداول المكتشفة والتحليلات الفنية المتقدمة

class PatternsComponent {
    constructor() {
        this.patterns = [];
        this.harmonicPatterns = [];
        this.currentSymbol = 'EUR/USD';
        this.availableSymbols = ['EUR/USD', 'GBP/USD', 'USD/JPY', 'AUD/USD', 'USD/CAD', 'EUR/GBP'];
        this.patternTypes = ['جميع الأنماط', 'أنماط انعكاسية', 'أنماط استمرارية', 'أنماط متناغمة'];
        this.currentPatternType = 'جميع الأنماط';
        this.timeframes = ['1h', '4h', '1d', '1w'];
        this.currentTimeframe = '1d';
    }

    // تهيئة صفحة الأنماط
    initialize(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) {
            console.error('لم يتم العثور على حاوية صفحة الأنماط');
            return;
        }

        this.renderPatternsPage();
        this.loadPatterns();
        
        // إضافة استجابة للتغيير في حجم النافذة
        window.addEventListener('resize', this.handleResize.bind(this));
    }

    // معالجة تغيير حجم النافذة
    handleResize() {
        // تحديث حجم بطاقات الأنماط وتخطيط الصفحة
        this.updatePatternCardLayout();
    }
    
    // تحديث تخطيط بطاقات الأنماط
    updatePatternCardLayout() {
        const patternCards = document.querySelectorAll('.pattern-card');
        if (patternCards.length === 0) return;
        
        // تعديل ارتفاع البطاقات ليكون متساوياً
        let maxHeight = 0;
        patternCards.forEach(card => {
            card.style.height = 'auto';
            maxHeight = Math.max(maxHeight, card.offsetHeight);
        });
        
        patternCards.forEach(card => {
            card.style.height = `${maxHeight}px`;
        });
    }

    // إنشاء واجهة صفحة الأنماط
    renderPatternsPage() {
        this.container.innerHTML = '';
        
        // إنشاء هيكل الصفحة
        const patternsPageContainer = document.createElement('div');
        patternsPageContainer.className = 'patterns-page';
        
        // إنشاء رأس الصفحة
        const patternsHeader = document.createElement('div');
        patternsHeader.className = 'patterns-header';
        
        const headerTitle = document.createElement('h2');
        headerTitle.textContent = 'أنماط التداول';
        
        patternsHeader.appendChild(headerTitle);
        
        // إنشاء أدوات التصفية
        const patternsFilters = document.createElement('div');
        patternsFilters.className = 'patterns-filters';
        
        // قسم اختيار الزوج
        const symbolSection = document.createElement('div');
        symbolSection.className = 'filter-section';
        
        const symbolLabel = document.createElement('label');
        symbolLabel.textContent = 'الزوج';
        symbolSection.appendChild(symbolLabel);
        
        const symbolSelector = document.createElement('select');
        symbolSelector.className = 'pattern-selector';
        
        this.availableSymbols.forEach(symbol => {
            const option = document.createElement('option');
            option.value = symbol;
            option.textContent = symbol;
            option.selected = symbol === this.currentSymbol;
            symbolSelector.appendChild(option);
        });
        
        symbolSelector.addEventListener('change', (e) => {
            this.currentSymbol = e.target.value;
            this.loadPatterns();
        });
        
        symbolSection.appendChild(symbolSelector);
        
        // قسم نوع النمط
        const patternTypeSection = document.createElement('div');
        patternTypeSection.className = 'filter-section';
        
        const patternTypeLabel = document.createElement('label');
        patternTypeLabel.textContent = 'نوع النمط';
        patternTypeSection.appendChild(patternTypeLabel);
        
        const patternTypeSelector = document.createElement('select');
        patternTypeSelector.className = 'pattern-selector';
        
        this.patternTypes.forEach(type => {
            const option = document.createElement('option');
            option.value = type;
            option.textContent = type;
            option.selected = type === this.currentPatternType;
            patternTypeSelector.appendChild(option);
        });
        
        patternTypeSelector.addEventListener('change', (e) => {
            this.currentPatternType = e.target.value;
            this.filterPatterns();
        });
        
        patternTypeSection.appendChild(patternTypeSelector);
        
        // قسم الإطار الزمني
        const timeframeSection = document.createElement('div');
        timeframeSection.className = 'filter-section';
        
        const timeframeLabel = document.createElement('label');
        timeframeLabel.textContent = 'الإطار الزمني';
        timeframeSection.appendChild(timeframeLabel);
        
        const timeframeSelector = document.createElement('select');
        timeframeSelector.className = 'pattern-selector';
        
        const timeframeMapping = {
            '1h': 'ساعة',
            '4h': '4 ساعات',
            '1d': 'يوم',
            '1w': 'أسبوع'
        };
        
        this.timeframes.forEach(timeframe => {
            const option = document.createElement('option');
            option.value = timeframe;
            option.textContent = timeframeMapping[timeframe] || timeframe;
            option.selected = timeframe === this.currentTimeframe;
            timeframeSelector.appendChild(option);
        });
        
        timeframeSelector.addEventListener('change', (e) => {
            this.currentTimeframe = e.target.value;
            this.loadPatterns();
        });
        
        timeframeSection.appendChild(timeframeSelector);
        
        // إضافة أقسام التصفية
        patternsFilters.appendChild(symbolSection);
        patternsFilters.appendChild(patternTypeSection);
        patternsFilters.appendChild(timeframeSection);
        
        // زر تطبيق التصفية
        const applyButton = document.createElement('button');
        applyButton.className = 'apply-filter-button';
        applyButton.textContent = 'تطبيق';
        applyButton.addEventListener('click', () => {
            this.loadPatterns();
        });
        
        patternsFilters.appendChild(applyButton);
        
        // إنشاء حاوية الأنماط
        const patternsContainer = document.createElement('div');
        patternsContainer.className = 'patterns-container';
        patternsContainer.id = 'patterns-container';
        
        // إنشاء حاوية الأنماط المتناغمة
        const harmonicPatternsContainer = document.createElement('div');
        harmonicPatternsContainer.className = 'harmonic-patterns-container';
        harmonicPatternsContainer.id = 'harmonic-patterns-container';
        
        // إضافة العناصر إلى الصفحة
        patternsPageContainer.appendChild(patternsHeader);
        patternsPageContainer.appendChild(patternsFilters);
        patternsPageContainer.appendChild(patternsContainer);
        patternsPageContainer.appendChild(harmonicPatternsContainer);
        
        this.container.appendChild(patternsPageContainer);
    }
    
    // تحميل الأنماط
    loadPatterns() {
        // عرض مؤشر التحميل
        this.showLoadingIndicator();
        
        // محاكاة تحميل البيانات من API مع تأخير قصير
        setTimeout(() => {
            this.patterns = this.generateMockPatterns();
            this.harmonicPatterns = this.generateMockHarmonicPatterns();
            
            this.renderPatterns();
            this.renderHarmonicPatterns();
            
            // إخفاء مؤشر التحميل
            this.hideLoadingIndicator();
            
            // تحديث تخطيط البطاقات
            setTimeout(() => {
                this.updatePatternCardLayout();
            }, 100);
        }, 500);
    }
    
    // عرض مؤشر التحميل
    showLoadingIndicator() {
        const patternsContainer = document.getElementById('patterns-container');
        const harmonicPatternsContainer = document.getElementById('harmonic-patterns-container');
        
        if (patternsContainer) {
            patternsContainer.innerHTML = '<div class="loading-indicator"><div class="spinner"></div><p>جاري تحميل الأنماط...</p></div>';
        }
        
        if (harmonicPatternsContainer) {
            harmonicPatternsContainer.innerHTML = '';
        }
    }
    
    // إخفاء مؤشر التحميل
    hideLoadingIndicator() {
        const loadingIndicator = document.querySelector('.loading-indicator');
        if (loadingIndicator) {
            loadingIndicator.remove();
        }
    }
    
    // تصفية الأنماط حسب النوع
    filterPatterns() {
        this.renderPatterns();
        this.renderHarmonicPatterns();
        
        // تحديث تخطيط البطاقات
        setTimeout(() => {
            this.updatePatternCardLayout();
        }, 100);
    }
    
    // عرض الأنماط
    renderPatterns() {
        const patternsContainer = document.getElementById('patterns-container');
        if (!patternsContainer) return;
        
        patternsContainer.innerHTML = '';
        
        // عنوان قسم الأنماط
        const sectionTitle = document.createElement('h3');
        sectionTitle.className = 'patterns-section-title';
        sectionTitle.textContent = 'الأنماط المكتشفة';
        patternsContainer.appendChild(sectionTitle);
        
        // تصفية الأنماط حسب النوع المحدد
        let filteredPatterns = this.patterns;
        if (this.currentPatternType !== 'جميع الأنماط') {
            filteredPatterns = this.patterns.filter(pattern => {
                if (this.currentPatternType === 'أنماط انعكاسية') {
                    return pattern.category === 'reversal';
                } else if (this.currentPatternType === 'أنماط استمرارية') {
                    return pattern.category === 'continuation';
                } else if (this.currentPatternType === 'أنماط متناغمة') {
                    return pattern.category === 'harmonic';
                }
                return true;
            });
        }
        
        if (filteredPatterns.length === 0) {
            const noPatterns = document.createElement('p');
            noPatterns.className = 'no-patterns';
            noPatterns.textContent = 'لا توجد أنماط مكتشفة للمعايير المحددة';
            patternsContainer.appendChild(noPatterns);
            return;
        }
        
        // إنشاء بطاقات الأنماط
        const patternsGrid = document.createElement('div');
        patternsGrid.className = 'patterns-grid';
        
        filteredPatterns.forEach(pattern => {
            const patternCard = document.createElement('div');
            patternCard.className = 'pattern-card';
            
            const patternHeader = document.createElement('div');
            patternHeader.className = 'pattern-header';
            
            const patternName = document.createElement('h4');
            patternName.textContent = pattern.name;
            
            const patternSymbol = document.createElement('span');
            patternSymbol.className = 'pattern-symbol';
            patternSymbol.textContent = pattern.symbol;
            
            patternHeader.appendChild(patternName);
            patternHeader.appendChild(patternSymbol);
            
            const patternImage = document.createElement('div');
            patternImage.className = 'pattern-image';
            
            // استخدام صورة حقيقية بدلاً من البيانات المشفرة
            const patternImageElement = document.createElement('img');
            patternImageElement.src = pattern.image;
            patternImageElement.alt = pattern.name;
            patternImageElement.onload = () => {
                // تحديث تخطيط البطاقة بعد تحميل الصورة
                this.updatePatternCardLayout();
            };
            patternImageElement.onerror = () => {
                // استخدام صورة بديلة في حالة فشل التحميل
                patternImageElement.src = 'assets/images/pattern_placeholder.png';
            };
            
            patternImage.appendChild(patternImageElement);
            
            const patternDetails = document.createElement('div');
            patternDetails.className = 'pattern-details';
            
            const patternType = document.createElement('div');
            patternType.className = 'pattern-detail';
            patternType.innerHTML = `<strong>النوع:</strong> ${pattern.type}`;
            
            const patternSignal = document.createElement('div');
            patternSignal.className = 'pattern-detail';
            patternSignal.innerHTML = `<strong>الإشارة:</strong> <span class="${pattern.signal === 'شراء' ? 'signal-buy' : 'signal-sell'}">${pattern.signal}</span>`;
            
            const patternReliability = document.createElement('div');
            patternReliability.className = 'pattern-detail';
            
            const reliabilityStars = document.createElement('div');
            reliabilityStars.className = 'reliability-stars';
            
            for (let i = 0; i < 5; i++) {
                const star = document.createElement('i');
                star.className = i < pattern.reliability ? 'fas fa-star' : 'far fa-star';
                reliabilityStars.appendChild(star);
            }
            
            patternReliability.innerHTML = `<strong>الموثوقية:</strong> `;
            patternReliability.appendChild(reliabilityStars);
            
            const patternTimeframe = document.createElement('div');
            patternTimeframe.className = 'pattern-detail';
            patternTimeframe.innerHTML = `<strong>الإطار الزمني:</strong> ${pattern.timeframe}`;
            
            const patternDate = document.createElement('div');
            patternDate.className = 'pattern-detail';
            patternDate.innerHTML = `<strong>تاريخ الاكتشاف:</strong> ${pattern.date}`;
            
            patternDetails.appendChild(patternType);
            patternDetails.appendChild(patternSignal);
            patternDetails.appendChild(patternReliability);
            patternDetails.appendChild(patternTimeframe);
            patternDetails.appendChild(patternDate);
            
            const patternActions = document.createElement('div');
            patternActions.className = 'pattern-actions';
            
            const viewButton = document.createElement('button');
            viewButton.className = 'pattern-button';
            viewButton.textContent = 'عرض التفاصيل';
            viewButton.addEventListener('click', () => {
                this.showPatternDetails(pattern);
            });
            
            patternActions.appendChild(viewButton);
            
            patternCard.appendChild(patternHeader);
            patternCard.appendChild(patternImage);
            patternCard.appendChild(patternDetails);
            patternCard.appendChild(patternActions);
            
            patternsGrid.appendChild(patternCard);
        });
        
        patternsContainer.appendChild(patternsGrid);
        
        // تحميل Font Awesome للأيقونات
        this.loadFontAwesome();
    }
    
    // تحميل Font Awesome
    loadFontAwesome() {
        if (document.querySelector('link[href*="fontawesome"]')) return;
        
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css';
        document.head.appendChild(link);
    }
    
    // عرض تفاصيل النمط
    showPatternDetails(pattern) {
        // إنشاء نافذة منبثقة لعرض التفاصيل
        const modal = document.createElement('div');
        modal.className = 'pattern-modal';
        
        const modalContent = document.createElement('div');
        modalContent.className = 'pattern-modal-content';
        
        const closeButton = document.createElement('span');
        closeButton.className = 'pattern-modal-close';
        closeButton.innerHTML = '&times;';
        closeButton.addEventListener('click', () => {
            document.body.removeChild(modal);
        });
        
        const modalHeader = document.createElement('div');
        modalHeader.className = 'pattern-modal-header';
        
        const modalTitle = document.createElement('h3');
        modalTitle.textContent = pattern.name;
        
        modalHeader.appendChild(modalTitle);
        modalHeader.appendChild(closeButton);
        
        const modalBody = document.createElement('div');
        modalBody.className = 'pattern-modal-body';
        
        // صورة النمط
        const patternImage = document.createElement('div');
        patternImage.className = 'pattern-modal-image';
        
        const patternImageElement = document.createElement('img');
        patternImageElement.src = pattern.image;
        patternImageElement.alt = pattern.name;
        
        patternImage.appendChild(patternImageElement);
        
        // تفاصيل النمط
        const patternInfo = document.createElement('div');
        patternInfo.className = 'pattern-modal-info';
        
        const detailsList = [
            { label: 'الزوج', value: pattern.symbol },
            { label: 'النوع', value: pattern.type },
            { label: 'الإشارة', value: pattern.signal, class: pattern.signal === 'شراء' ? 'signal-buy' : 'signal-sell' },
            { label: 'الإطار الزمني', value: pattern.timeframe },
            { label: 'تاريخ الاكتشاف', value: pattern.date }
        ];
        
        detailsList.forEach(detail => {
            const detailItem = document.createElement('div');
            detailItem.className = 'pattern-modal-detail';
            
            const detailLabel = document.createElement('span');
            detailLabel.className = 'pattern-modal-label';
            detailLabel.textContent = detail.label + ': ';
            
            const detailValue = document.createElement('span');
            if (detail.class) {
                detailValue.className = detail.class;
            }
            detailValue.textContent = detail.value;
            
            detailItem.appendChild(detailLabel);
            detailItem.appendChild(detailValue);
            
            patternInfo.appendChild(detailItem);
        });
        
        // وصف النمط
        const patternDescription = document.createElement('div');
        patternDescription.className = 'pattern-modal-description';
        
        const descriptionTitle = document.createElement('h4');
        descriptionTitle.textContent = 'وصف النمط';
        
        const descriptionText = document.createElement('p');
        descriptionText.textContent = pattern.description || 'هذا النمط هو أحد أنماط التداول الفني الذي يساعد المتداولين على تحديد نقاط الدخول والخروج المحتملة في السوق. يتكون من مجموعة من الحركات السعرية التي تشكل نمطاً يمكن التعرف عليه ويمكن استخدامه للتنبؤ بالحركات المستقبلية للسعر.';
        
        patternDescription.appendChild(descriptionTitle);
        patternDescription.appendChild(descriptionText);
        
        // إضافة العناصر إلى النافذة المنبثقة
        modalBody.appendChild(patternImage);
        modalBody.appendChild(patternInfo);
        modalBody.appendChild(patternDescription);
        
        modalContent.appendChild(modalHeader);
        modalContent.appendChild(modalBody);
        
        modal.appendChild(modalContent);
        
        // إضافة النافذة المنبثقة إلى الصفحة
        document.body.appendChild(modal);
        
        // إضافة مستمع للنقر خارج النافذة المنبثقة
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        });
    }
    
    // عرض الأنماط المتناغمة
    renderHarmonicPatterns() {
        const harmonicPatternsContainer = document.getElementById('harmonic-patterns-container');
        if (!harmonicPatternsContainer) return;
        
        harmonicPatternsContainer.innerHTML = '';
        
        // عرض الأنماط المتناغمة فقط إذا تم اختيار "أنماط متناغمة" أو "جميع الأنماط"
        if (this.currentPatternType !== 'أنماط متناغمة' && this.currentPatternType !== 'جميع الأنماط') {
            return;
        }
        
        // عنوان قسم الأنماط المتناغمة
        const sectionTitle = document.createElement('h3');
        sectionTitle.className = 'patterns-section-title';
        sectionTitle.textContent = 'الأنماط المتناغمة';
        harmonicPatternsContainer.appendChild(sectionTitle);
        
        if (this.harmonicPatterns.length === 0) {
            const noPatterns = document.createElement('p');
            noPatterns.className = 'no-patterns';
            noPatterns.textContent = 'لا توجد أنماط متناغمة مكتشفة للمعايير المحددة';
            harmonicPatternsContainer.appendChild(noPatterns);
            return;
        }
        
        // إنشاء حاوية الجدول
        const tableContainer = document.createElement('div');
        tableContainer.className = 'harmonic-table-container';
        
        // إنشاء جدول الأنماط المتناغمة
        const harmonicTable = document.createElement('table');
        harmonicTable.className = 'harmonic-table';
        
        const tableHead = document.createElement('thead');
        const headRow = document.createElement('tr');
        
        ['النمط', 'الزوج', 'الإطار الزمني', 'النسب', 'الإشارة', 'المستوى الحالي', 'الهدف', 'وقف الخسارة'].forEach(text => {
            const th = document.createElement('th');
            th.textContent = text;
            headRow.appendChild(th);
        });
        
        tableHead.appendChild(headRow);
        
        const tableBody = document.createElement('tbody');
        
        this.harmonicPatterns.forEach(pattern => {
            const row = document.createElement('tr');
            
            const nameCell = document.createElement('td');
            nameCell.textContent = pattern.name;
            
            const symbolCell = document.createElement('td');
            symbolCell.textContent = pattern.symbol;
            
            const timeframeCell = document.createElement('td');
            timeframeCell.textContent = pattern.timeframe;
            
            const ratiosCell = document.createElement('td');
            ratiosCell.textContent = pattern.ratios;
            
            const signalCell = document.createElement('td');
            signalCell.className = pattern.signal === 'شراء' ? 'signal-buy' : 'signal-sell';
            signalCell.textContent = pattern.signal;
            
            const currentLevelCell = document.createElement('td');
            currentLevelCell.textContent = pattern.currentLevel;
            
            const targetCell = document.createElement('td');
            targetCell.textContent = pattern.target;
            
            const stopLossCell = document.createElement('td');
            stopLossCell.textContent = pattern.stopLoss;
            
            row.appendChild(nameCell);
            row.appendChild(symbolCell);
            row.appendChild(timeframeCell);
            row.appendChild(ratiosCell);
            row.appendChild(signalCell);
            row.appendChild(currentLevelCell);
            row.appendChild(targetCell);
            row.appendChild(stopLossCell);
            
            tableBody.appendChild(row);
        });
        
        harmonicTable.appendChild(tableHead);
        harmonicTable.appendChild(tableBody);
        
        tableContainer.appendChild(harmonicTable);
        harmonicPatternsContainer.appendChild(tableContainer);
    }
    
    // توليد بيانات وهمية للأنماط
    generateMockPatterns() {
        const patterns = [
            {
                name: 'نموذج الرأس والكتفين',
                symbol: this.currentSymbol,
                type: 'انعكاسي',
                category: 'reversal',
                signal: 'بيع',
                reliability: 4,
                timeframe: this.currentTimeframe,
                date: '2025-06-03',
                image: 'assets/images/patterns/head_and_shoulders.png',
                description: 'نموذج الرأس والكتفين هو نموذج انعكاسي يتكون من ثلاث قمم، حيث تكون القمة الوسطى (الرأس) أعلى من القمتين الجانبيتين (الكتفين). يشير هذا النموذج عادة إلى انعكاس محتمل للاتجاه الصاعد.'
            },
            {
                name: 'نموذج المثلث الصاعد',
                symbol: this.currentSymbol,
                type: 'استمراري',
                category: 'continuation',
                signal: 'شراء',
                reliability: 3,
                timeframe: this.currentTimeframe,
                date: '2025-06-02',
                image: 'assets/images/patterns/ascending_triangle.png',
                description: 'نموذج المثلث الصاعد هو نموذج استمراري يتكون من خط مقاومة أفقي وخط دعم صاعد. يشير هذا النموذج عادة إلى استمرار الاتجاه الصاعد بعد اختراق خط المقاومة.'
            },
            {
                name: 'نموذج القمة المزدوجة',
                symbol: this.currentSymbol,
                type: 'انعكاسي',
                category: 'reversal',
                signal: 'بيع',
                reliability: 5,
                timeframe: this.currentTimeframe,
                date: '2025-06-01',
                image: 'assets/images/patterns/double_top.png',
                description: 'نموذج القمة المزدوجة هو نموذج انعكاسي يتكون من قمتين متتاليتين عند نفس المستوى تقريباً. يشير هذا النموذج عادة إلى انعكاس محتمل للاتجاه الصاعد.'
            },
            {
                name: 'نموذج القاع المزدوج',
                symbol: this.currentSymbol,
                type: 'انعكاسي',
                category: 'reversal',
                signal: 'شراء',
                reliability: 5,
                timeframe: this.currentTimeframe,
                date: '2025-05-30',
                image: 'assets/images/patterns/double_bottom.png',
                description: 'نموذج القاع المزدوج هو نموذج انعكاسي يتكون من قاعين متتاليين عند نفس المستوى تقريباً. يشير هذا النموذج عادة إلى انعكاس محتمل للاتجاه الهابط.'
            },
            {
                name: 'نموذج العلم',
                symbol: this.currentSymbol,
                type: 'استمراري',
                category: 'continuation',
                signal: 'شراء',
                reliability: 4,
                timeframe: this.currentTimeframe,
                date: '2025-05-28',
                image: 'assets/images/patterns/flag.png',
                description: 'نموذج العلم هو نموذج استمراري قصير المدى يتكون من قناة هابطة صغيرة تتشكل بعد حركة صاعدة قوية. يشير هذا النموذج عادة إلى استمرار الاتجاه الصاعد بعد اختراق الحد العلوي للقناة.'
            },
            {
                name: 'نموذج الوتد الهابط',
                symbol: this.currentSymbol,
                type: 'انعكاسي',
                category: 'reversal',
                signal: 'شراء',
                reliability: 3,
                timeframe: this.currentTimeframe,
                date: '2025-05-25',
                image: 'assets/images/patterns/falling_wedge.png',
                description: 'نموذج الوتد الهابط هو نموذج انعكاسي يتكون من خطي اتجاه هابطين يتقاربان. يشير هذا النموذج عادة إلى انعكاس محتمل للاتجاه الهابط.'
            }
        ];
        
        // إضافة أنماط متناغمة إلى القائمة الرئيسية
        const harmonicPatterns = [
            {
                name: 'نموذج الفراشة',
                symbol: this.currentSymbol,
                type: 'متناغم',
                category: 'harmonic',
                signal: 'شراء',
                reliability: 4,
                timeframe: this.currentTimeframe,
                date: '2025-06-01',
                image: 'assets/images/patterns/butterfly.png',
                description: 'نموذج الفراشة هو نموذج متناغم يتكون من أربع نقاط سعرية تشكل نسباً فيبوناتشي محددة. يوفر هذا النموذج نقاط دخول وخروج دقيقة بناءً على هذه النسب.'
            },
            {
                name: 'نموذج الخفاش',
                symbol: this.currentSymbol,
                type: 'متناغم',
                category: 'harmonic',
                signal: 'بيع',
                reliability: 4,
                timeframe: this.currentTimeframe,
                date: '2025-05-29',
                image: 'assets/images/patterns/bat.png',
                description: 'نموذج الخفاش هو نموذج متناغم يتكون من أربع نقاط سعرية تشكل نسباً فيبوناتشي محددة. يوفر هذا النموذج نقاط دخول وخروج دقيقة بناءً على هذه النسب.'
            }
        ];
        
        // إضافة الأنماط المتناغمة إلى القائمة الرئيسية إذا تم اختيار "جميع الأنماط"
        if (this.currentPatternType === 'جميع الأنماط' || this.currentPatternType === 'أنماط متناغمة') {
            patterns.push(...harmonicPatterns);
        }
        
        return patterns;
    }
    
    // توليد بيانات وهمية للأنماط المتناغمة
    generateMockHarmonicPatterns() {
        return [
            {
                name: 'فراشة',
                symbol: this.currentSymbol,
                timeframe: this.currentTimeframe,
                ratios: 'XA=1.27, AB=0.618, BC=0.382, CD=2.24',
                signal: 'شراء',
                currentLevel: '1.1842',
                target: '1.1900',
                stopLoss: '1.1800'
            },
            {
                name: 'خفاش',
                symbol: this.currentSymbol,
                timeframe: this.currentTimeframe,
                ratios: 'XA=0.5, AB=0.382, BC=0.886, CD=2.0',
                signal: 'بيع',
                currentLevel: '1.3765',
                target: '1.3700',
                stopLoss: '1.3800'
            },
            {
                name: 'جارتلي',
                symbol: this.currentSymbol,
                timeframe: this.currentTimeframe,
                ratios: 'XA=0.618, AB=0.618, BC=0.382, CD=1.27',
                signal: 'شراء',
                currentLevel: '0.7468',
                target: '0.7500',
                stopLoss: '0.7450'
            },
            {
                name: 'كراب',
                symbol: this.currentSymbol,
                timeframe: this.currentTimeframe,
                ratios: 'XA=0.382, AB=0.886, BC=0.382, CD=3.618',
                signal: 'بيع',
                currentLevel: '110.32',
                target: '109.80',
                stopLoss: '110.60'
            }
        ];
    }
}

// تصدير المكون
window.PatternsComponent = PatternsComponent;
