// Calendar.js - مكون صفحة التقويم الاقتصادي
// يستخدم لعرض الأحداث الاقتصادية القادمة وتأثيرها المتوقع

class CalendarComponent {
    constructor() {
        this.events = [];
        this.countries = ['الكل', 'الولايات المتحدة', 'منطقة اليورو', 'المملكة المتحدة', 'اليابان', 'أستراليا', 'كندا', 'سويسرا', 'الصين'];
        this.impacts = ['الكل', 'مرتفع', 'متوسط', 'منخفض'];
        this.currentCountry = 'الكل';
        this.currentImpact = 'الكل';
        this.currentDate = new Date();
        this.weekDays = 7; // عدد الأيام المعروضة في التقويم
    }

    // تهيئة صفحة التقويم
    initialize(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) {
            console.error('لم يتم العثور على حاوية صفحة التقويم');
            return;
        }

        this.renderCalendarPage();
        this.loadEvents();
    }

    // إنشاء واجهة صفحة التقويم
    renderCalendarPage() {
        this.container.innerHTML = '';
        
        // إنشاء هيكل الصفحة
        const calendarPageContainer = document.createElement('div');
        calendarPageContainer.className = 'calendar-page';
        
        // إنشاء رأس الصفحة
        const calendarHeader = document.createElement('div');
        calendarHeader.className = 'calendar-header';
        
        const headerTitle = document.createElement('h2');
        headerTitle.textContent = 'التقويم الاقتصادي';
        
        calendarHeader.appendChild(headerTitle);
        
        // إنشاء أدوات التصفية
        const calendarFilters = document.createElement('div');
        calendarFilters.className = 'calendar-filters';
        
        // قائمة الدول
        const countrySelector = document.createElement('select');
        countrySelector.className = 'calendar-selector';
        
        this.countries.forEach(country => {
            const option = document.createElement('option');
            option.value = country;
            option.textContent = country;
            option.selected = country === this.currentCountry;
            countrySelector.appendChild(option);
        });
        
        countrySelector.addEventListener('change', (e) => {
            this.currentCountry = e.target.value;
            this.filterEvents();
        });
        
        // قائمة التأثير
        const impactSelector = document.createElement('select');
        impactSelector.className = 'calendar-selector';
        
        this.impacts.forEach(impact => {
            const option = document.createElement('option');
            option.value = impact;
            option.textContent = impact;
            option.selected = impact === this.currentImpact;
            impactSelector.appendChild(option);
        });
        
        impactSelector.addEventListener('change', (e) => {
            this.currentImpact = e.target.value;
            this.filterEvents();
        });
        
        // أزرار التنقل بين الأيام
        const navigationButtons = document.createElement('div');
        navigationButtons.className = 'calendar-navigation';
        
        const prevButton = document.createElement('button');
        prevButton.className = 'calendar-nav-button';
        prevButton.innerHTML = '<i class="bi bi-chevron-right"></i>';
        prevButton.addEventListener('click', () => {
            this.navigateDays(-this.weekDays);
        });
        
        const todayButton = document.createElement('button');
        todayButton.className = 'calendar-nav-button calendar-today-button';
        todayButton.textContent = 'اليوم';
        todayButton.addEventListener('click', () => {
            this.currentDate = new Date();
            this.loadEvents();
        });
        
        const nextButton = document.createElement('button');
        nextButton.className = 'calendar-nav-button';
        nextButton.innerHTML = '<i class="bi bi-chevron-left"></i>';
        nextButton.addEventListener('click', () => {
            this.navigateDays(this.weekDays);
        });
        
        navigationButtons.appendChild(prevButton);
        navigationButtons.appendChild(todayButton);
        navigationButtons.appendChild(nextButton);
        
        calendarFilters.appendChild(countrySelector);
        calendarFilters.appendChild(impactSelector);
        calendarFilters.appendChild(navigationButtons);
        
        // إنشاء حاوية التقويم
        const calendarContainer = document.createElement('div');
        calendarContainer.className = 'calendar-container';
        calendarContainer.id = 'calendar-container';
        
        // إضافة العناصر إلى الصفحة
        calendarPageContainer.appendChild(calendarHeader);
        calendarPageContainer.appendChild(calendarFilters);
        calendarPageContainer.appendChild(calendarContainer);
        
        this.container.appendChild(calendarPageContainer);
    }
    
    // تحميل الأحداث الاقتصادية
    loadEvents() {
        // محاكاة تحميل البيانات من API
        this.events = this.generateMockEvents();
        this.renderCalendar();
    }
    
    // تصفية الأحداث حسب المعايير المحددة
    filterEvents() {
        this.renderCalendar();
    }
    
    // التنقل بين الأيام
    navigateDays(days) {
        const newDate = new Date(this.currentDate);
        newDate.setDate(newDate.getDate() + days);
        this.currentDate = newDate;
        this.loadEvents();
    }
    
    // عرض التقويم
    renderCalendar() {
        const calendarContainer = document.getElementById('calendar-container');
        if (!calendarContainer) return;
        
        calendarContainer.innerHTML = '';
        
        // إنشاء عنوان الفترة الزمنية
        const dateRangeTitle = document.createElement('h3');
        dateRangeTitle.className = 'calendar-date-range';
        
        const startDate = new Date(this.currentDate);
        const endDate = new Date(this.currentDate);
        endDate.setDate(endDate.getDate() + this.weekDays - 1);
        
        const formatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
        dateRangeTitle.textContent = `${startDate.toLocaleDateString('ar-SA', formatOptions)} - ${endDate.toLocaleDateString('ar-SA', formatOptions)}`;
        
        calendarContainer.appendChild(dateRangeTitle);
        
        // تصفية الأحداث حسب المعايير المحددة
        let filteredEvents = this.events.filter(event => {
            const eventDate = new Date(event.date);
            const isInDateRange = eventDate >= startDate && eventDate <= endDate;
            
            const isMatchingCountry = this.currentCountry === 'الكل' || event.country === this.currentCountry;
            const isMatchingImpact = this.currentImpact === 'الكل' || event.impact === this.currentImpact;
            
            return isInDateRange && isMatchingCountry && isMatchingImpact;
        });
        
        // تجميع الأحداث حسب التاريخ
        const eventsByDate = {};
        
        for (let i = 0; i < this.weekDays; i++) {
            const date = new Date(startDate);
            date.setDate(date.getDate() + i);
            const dateString = date.toISOString().split('T')[0];
            eventsByDate[dateString] = [];
        }
        
        filteredEvents.forEach(event => {
            const dateString = new Date(event.date).toISOString().split('T')[0];
            if (eventsByDate[dateString]) {
                eventsByDate[dateString].push(event);
            }
        });
        
        // إنشاء أقسام الأيام
        Object.keys(eventsByDate).forEach(dateString => {
            const date = new Date(dateString);
            const dayEvents = eventsByDate[dateString];
            
            const daySection = document.createElement('div');
            daySection.className = 'calendar-day-section';
            
            const dayHeader = document.createElement('div');
            dayHeader.className = 'calendar-day-header';
            
            const dayName = document.createElement('h4');
            dayName.className = 'calendar-day-name';
            dayName.textContent = date.toLocaleDateString('ar-SA', { weekday: 'long' });
            
            const dayDate = document.createElement('span');
            dayDate.className = 'calendar-day-date';
            dayDate.textContent = date.toLocaleDateString('ar-SA', { year: 'numeric', month: 'long', day: 'numeric' });
            
            dayHeader.appendChild(dayName);
            dayHeader.appendChild(dayDate);
            
            const dayContent = document.createElement('div');
            dayContent.className = 'calendar-day-content';
            
            if (dayEvents.length === 0) {
                const noEvents = document.createElement('p');
                noEvents.className = 'calendar-no-events';
                noEvents.textContent = 'لا توجد أحداث اقتصادية لهذا اليوم';
                dayContent.appendChild(noEvents);
            } else {
                const eventsTable = document.createElement('table');
                eventsTable.className = 'calendar-events-table';
                
                const tableHead = document.createElement('thead');
                const headRow = document.createElement('tr');
                
                ['الوقت', 'الدولة', 'الحدث', 'التأثير', 'الفعلي', 'المتوقع', 'السابق'].forEach(text => {
                    const th = document.createElement('th');
                    th.textContent = text;
                    headRow.appendChild(th);
                });
                
                tableHead.appendChild(headRow);
                
                const tableBody = document.createElement('tbody');
                
                dayEvents.forEach(event => {
                    const row = document.createElement('tr');
                    
                    const timeCell = document.createElement('td');
                    timeCell.textContent = event.time;
                    
                    const countryCell = document.createElement('td');
                    countryCell.className = 'calendar-country-cell';
                    
                    const countryFlag = document.createElement('span');
                    countryFlag.className = `flag-icon flag-icon-${event.countryCode}`;
                    
                    const countryName = document.createElement('span');
                    countryName.textContent = event.country;
                    
                    countryCell.appendChild(countryFlag);
                    countryCell.appendChild(countryName);
                    
                    const eventCell = document.createElement('td');
                    eventCell.textContent = event.name;
                    
                    const impactCell = document.createElement('td');
                    impactCell.className = 'calendar-impact-cell';
                    
                    for (let i = 0; i < 3; i++) {
                        const impactDot = document.createElement('span');
                        impactDot.className = 'impact-dot';
                        
                        if (event.impact === 'مرتفع' && i < 3) {
                            impactDot.classList.add('high-impact');
                        } else if (event.impact === 'متوسط' && i < 2) {
                            impactDot.classList.add('medium-impact');
                        } else if (event.impact === 'منخفض' && i < 1) {
                            impactDot.classList.add('low-impact');
                        }
                        
                        impactCell.appendChild(impactDot);
                    }
                    
                    const actualCell = document.createElement('td');
                    actualCell.textContent = event.actual || '-';
                    if (event.actual) {
                        if (parseFloat(event.actual) > parseFloat(event.forecast)) {
                            actualCell.classList.add('better-than-expected');
                        } else if (parseFloat(event.actual) < parseFloat(event.forecast)) {
                            actualCell.classList.add('worse-than-expected');
                        }
                    }
                    
                    const forecastCell = document.createElement('td');
                    forecastCell.textContent = event.forecast || '-';
                    
                    const previousCell = document.createElement('td');
                    previousCell.textContent = event.previous || '-';
                    
                    row.appendChild(timeCell);
                    row.appendChild(countryCell);
                    row.appendChild(eventCell);
                    row.appendChild(impactCell);
                    row.appendChild(actualCell);
                    row.appendChild(forecastCell);
                    row.appendChild(previousCell);
                    
                    tableBody.appendChild(row);
                });
                
                eventsTable.appendChild(tableHead);
                eventsTable.appendChild(tableBody);
                
                dayContent.appendChild(eventsTable);
            }
            
            daySection.appendChild(dayHeader);
            daySection.appendChild(dayContent);
            
            calendarContainer.appendChild(daySection);
        });
    }
    
    // توليد بيانات وهمية للأحداث الاقتصادية
    generateMockEvents() {
        const events = [];
        
        // تاريخ البداية (اليوم الحالي)
        const startDate = new Date(this.currentDate);
        
        // إنشاء أحداث لمدة أسبوع
        for (let i = 0; i < this.weekDays; i++) {
            const currentDate = new Date(startDate);
            currentDate.setDate(currentDate.getDate() + i);
            
            // عدد عشوائي من الأحداث لكل يوم (0-5)
            const numEvents = Math.floor(Math.random() * 6);
            
            for (let j = 0; j < numEvents; j++) {
                const hour = Math.floor(Math.random() * 24);
                const minute = Math.floor(Math.random() * 60);
                
                const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
                
                const countryIndex = Math.floor(Math.random() * (this.countries.length - 1)) + 1; // تجاهل "الكل"
                const country = this.countries[countryIndex];
                
                let countryCode;
                switch (country) {
                    case 'الولايات المتحدة':
                        countryCode = 'us';
                        break;
                    case 'منطقة اليورو':
                        countryCode = 'eu';
                        break;
                    case 'المملكة المتحدة':
                        countryCode = 'gb';
                        break;
                    case 'اليابان':
                        countryCode = 'jp';
                        break;
                    case 'أستراليا':
                        countryCode = 'au';
                        break;
                    case 'كندا':
                        countryCode = 'ca';
                        break;
                    case 'سويسرا':
                        countryCode = 'ch';
                        break;
                    case 'الصين':
                        countryCode = 'cn';
                        break;
                    default:
                        countryCode = 'un';
                }
                
                const impactIndex = Math.floor(Math.random() * (this.impacts.length - 1)) + 1; // تجاهل "الكل"
                const impact = this.impacts[impactIndex];
                
                const eventTypes = [
                    'معدل البطالة',
                    'مؤشر أسعار المستهلك',
                    'الناتج المحلي الإجمالي',
                    'مبيعات التجزئة',
                    'قرار سعر الفائدة',
                    'مؤشر مديري المشتريات',
                    'ميزان التجارة',
                    'مؤشر ثقة المستهلك',
                    'طلبات إعانة البطالة',
                    'بدء بناء المساكن'
                ];
                
                const eventTypeIndex = Math.floor(Math.random() * eventTypes.length);
                const eventName = eventTypes[eventTypeIndex];
                
                // إنشاء قيم عشوائية للبيانات
                let forecast, previous, actual;
                
                switch (eventName) {
                    case 'معدل البطالة':
                        forecast = (3 + Math.random() * 5).toFixed(1) + '%';
                        previous = (3 + Math.random() * 5).toFixed(1) + '%';
                        break;
                    case 'مؤشر أسعار المستهلك':
                        forecast = (Math.random() * 5).toFixed(1) + '%';
                        previous = (Math.random() * 5).toFixed(1) + '%';
                        break;
                    case 'الناتج المحلي الإجمالي':
                        forecast = (Math.random() * 4 - 1).toFixed(1) + '%';
                        previous = (Math.random() * 4 - 1).toFixed(1) + '%';
                        break;
                    case 'مبيعات التجزئة':
                        forecast = (Math.random() * 3 - 1).toFixed(1) + '%';
                        previous = (Math.random() * 3 - 1).toFixed(1) + '%';
                        break;
                    case 'قرار سعر الفائدة':
                        forecast = (Math.random() * 5).toFixed(2) + '%';
                        previous = (Math.random() * 5).toFixed(2) + '%';
                        break;
                    case 'مؤشر مديري المشتريات':
                        forecast = Math.floor(40 + Math.random() * 20).toString();
                        previous = Math.floor(40 + Math.random() * 20).toString();
                        break;
                    case 'ميزان التجارة':
                        forecast = (Math.random() * 20 - 10).toFixed(1) + 'B';
                        previous = (Math.random() * 20 - 10).toFixed(1) + 'B';
                        break;
                    case 'مؤشر ثقة المستهلك':
                        forecast = Math.floor(70 + Math.random() * 60).toString();
                        previous = Math.floor(70 + Math.random() * 60).toString();
                        break;
                    case 'طلبات إعانة البطالة':
                        forecast = Math.floor(200 + Math.random() * 300) + 'K';
                        previous = Math.floor(200 + Math.random() * 300) + 'K';
                        break;
                    case 'بدء بناء المساكن':
                        forecast = Math.floor(1000 + Math.random() * 500) + 'K';
                        previous = Math.floor(1000 + Math.random() * 500) + 'K';
                        break;
                    default:
                        forecast = Math.floor(Math.random() * 100).toString();
                        previous = Math.floor(Math.random() * 100).toString();
                }
                
                // إضافة قيمة فعلية فقط للأحداث السابقة
                if (currentDate < new Date()) {
                    // توليد قيمة فعلية قريبة من المتوقع
                    const forecastValue = parseFloat(forecast);
                    const variation = (Math.random() * 0.4 - 0.2) * forecastValue; // تغيير بنسبة ±20%
                    
                    if (forecast.includes('%')) {
                        actual = (forecastValue + variation).toFixed(1) + '%';
                    } else if (forecast.includes('K')) {
                        actual = Math.floor(forecastValue + variation) + 'K';
                    } else if (forecast.includes('B')) {
                        actual = (forecastValue + variation).toFixed(1) + 'B';
                    } else {
                        actual = Math.floor(forecastValue + variation).toString();
                    }
                }
                
                events.push({
                    date: currentDate,
                    time: time,
                    country: country,
                    countryCode: countryCode,
                    name: eventName,
                    impact: impact,
                    forecast: forecast,
                    previous: previous,
                    actual: actual
                });
            }
        }
        
        // ترتيب الأحداث حسب التاريخ والوقت
        events.sort((a, b) => {
            if (a.date.getTime() !== b.date.getTime()) {
                return a.date.getTime() - b.date.getTime();
            }
            return a.time.localeCompare(b.time);
        });
        
        return events;
    }
}

// تصدير المكون
window.CalendarComponent = CalendarComponent;
