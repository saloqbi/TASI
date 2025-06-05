// calendarService.js - خدمة التقويم الاقتصادي

class CalendarService {
    constructor() {
        this.apiService = apiService; // استخدام خدمة API المعرفة سابقاً
        this.notificationService = notificationService; // استخدام خدمة الإشعارات
        this.eventListeners = [];
        this.upcomingEventAlerts = {};
        this.checkInterval = null;
    }
    
    // الحصول على أحداث التقويم الاقتصادي
    async getEconomicCalendar(filters = {}) {
        try {
            return await this.apiService.getEconomicCalendar(filters);
        } catch (error) {
            console.error('Error fetching economic calendar:', error);
            throw error;
        }
    }
    
    // بدء مراقبة الأحداث القادمة
    startEventMonitoring() {
        if (this.checkInterval) {
            this.stopEventMonitoring();
        }
        
        // التحقق من الأحداث القادمة كل دقيقة
        this.checkInterval = setInterval(() => {
            this.checkUpcomingEvents();
        }, 60000);
        
        // التحقق فوراً عند بدء المراقبة
        this.checkUpcomingEvents();
        
        return true;
    }
    
    // إيقاف مراقبة الأحداث القادمة
    stopEventMonitoring() {
        if (this.checkInterval) {
            clearInterval(this.checkInterval);
            this.checkInterval = null;
        }
        
        return true;
    }
    
    // التحقق من الأحداث القادمة
    async checkUpcomingEvents() {
        try {
            const events = await this.getEconomicCalendar();
            const now = new Date();
            
            // تصفية الأحداث التي ستحدث في الساعة القادمة
            const upcomingEvents = events.filter(event => {
                // تحليل وقت الحدث
                const [hours, minutes] = event.time.split(':').map(Number);
                const eventDate = new Date();
                eventDate.setHours(hours, minutes, 0, 0);
                
                // إذا كان الحدث اليوم وفي الساعة القادمة
                const isToday = event.date === 'اليوم';
                const timeDiff = (eventDate - now) / (1000 * 60); // الفرق بالدقائق
                
                return isToday && timeDiff > 0 && timeDiff <= 60;
            });
            
            // إرسال إشعارات للأحداث القادمة التي لم يتم إرسال إشعار لها بعد
            upcomingEvents.forEach(event => {
                const eventKey = `${event.id}-${event.date}-${event.time}`;
                
                if (!this.upcomingEventAlerts[eventKey]) {
                    // إرسال إشعار
                    this.notificationService.sendEconomicEventNotification(event);
                    
                    // تسجيل الإشعار لتجنب التكرار
                    this.upcomingEventAlerts[eventKey] = true;
                    
                    // إخطار المستمعين
                    this.notifyEventListeners(event);
                }
            });
            
            return upcomingEvents;
        } catch (error) {
            console.error('Error checking upcoming events:', error);
            return [];
        }
    }
    
    // إضافة مستمع للأحداث
    addEventListener(listener) {
        if (typeof listener === 'function' && !this.eventListeners.includes(listener)) {
            this.eventListeners.push(listener);
            
            // إذا كان هذا هو المستمع الأول، ابدأ المراقبة
            if (this.eventListeners.length === 1) {
                this.startEventMonitoring();
            }
            
            return true;
        }
        return false;
    }
    
    // إزالة مستمع للأحداث
    removeEventListener(listener) {
        const index = this.eventListeners.indexOf(listener);
        if (index !== -1) {
            this.eventListeners.splice(index, 1);
            
            // إذا لم يعد هناك مستمعون، أوقف المراقبة
            if (this.eventListeners.length === 0) {
                this.stopEventMonitoring();
            }
            
            return true;
        }
        return false;
    }
    
    // إخطار جميع المستمعين بحدث جديد
    notifyEventListeners(event) {
        this.eventListeners.forEach(listener => {
            try {
                listener(event);
            } catch (error) {
                console.error('Error in event listener:', error);
            }
        });
    }
    
    // الحصول على تأثير الحدث بناءً على مستوى التأثير
    getEventImpact(impact) {
        switch (impact) {
            case 'high':
                return 'تأثير مرتفع';
            case 'medium':
                return 'تأثير متوسط';
            case 'low':
                return 'تأثير منخفض';
            default:
                return 'تأثير غير معروف';
        }
    }
    
    // الحصول على رمز العلم بناءً على العملة
    getCurrencyFlag(currency) {
        switch (currency) {
            case 'USD':
                return '🇺🇸';
            case 'EUR':
                return '🇪🇺';
            case 'GBP':
                return '🇬🇧';
            case 'JPY':
                return '🇯🇵';
            case 'AUD':
                return '🇦🇺';
            case 'CAD':
                return '🇨🇦';
            case 'CHF':
                return '🇨🇭';
            case 'NZD':
                return '🇳🇿';
            default:
                return '🏳️';
        }
    }
}

// إنشاء نسخة واحدة من الخدمة للاستخدام في جميع أنحاء التطبيق
const calendarService = new CalendarService();

// تصدير الخدمة
// export default calendarService;
