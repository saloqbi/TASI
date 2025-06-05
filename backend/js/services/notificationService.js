// notificationService.js - خدمة الإشعارات والتنبيهات

class NotificationService {
    constructor() {
        this.listeners = [];
        this.permission = this.checkPermission();
    }
    
    // التحقق من إذن الإشعارات
    checkPermission() {
        if (!('Notification' in window)) {
            return 'unsupported';
        }
        
        return Notification.permission;
    }
    
    // طلب إذن الإشعارات
    async requestPermission() {
        if (!('Notification' in window)) {
            return 'unsupported';
        }
        
        try {
            const permission = await Notification.requestPermission();
            this.permission = permission;
            return permission;
        } catch (error) {
            console.error('Error requesting notification permission:', error);
            return 'denied';
        }
    }
    
    // إرسال إشعار
    sendNotification(title, options = {}) {
        if (this.permission !== 'granted') {
            console.warn('Notification permission not granted');
            return false;
        }
        
        try {
            const defaultOptions = {
                icon: '/assets/images/chartdepth_logo.webp',
                badge: '/assets/images/chartdepth_logo.webp',
                dir: 'rtl',
                lang: 'ar'
            };
            
            const notification = new Notification(title, { ...defaultOptions, ...options });
            
            if (options.onClick) {
                notification.onclick = options.onClick;
            }
            
            return true;
        } catch (error) {
            console.error('Error sending notification:', error);
            return false;
        }
    }
    
    // إرسال إشعار إشارة جديدة
    sendSignalNotification(signal) {
        const title = `إشارة ${signal.type === 'buy' ? 'شراء' : 'بيع'} جديدة: ${signal.pair}`;
        const body = `سعر الدخول: ${signal.entryPrice} | وقف الخسارة: ${signal.stopLoss} | الهدف: ${signal.target}`;
        
        return this.sendNotification(title, {
            body,
            data: { signalId: signal.id },
            onClick: function() {
                window.focus();
                window.location.href = '/signals';
            }
        });
    }
    
    // إرسال إشعار حدث اقتصادي
    sendEconomicEventNotification(event) {
        const title = `حدث اقتصادي قادم: ${event.currency}`;
        const body = `${event.event} | الوقت: ${event.time} | التأثير: ${event.impact === 'high' ? 'مرتفع' : event.impact === 'medium' ? 'متوسط' : 'منخفض'}`;
        
        return this.sendNotification(title, {
            body,
            data: { eventId: event.id },
            onClick: function() {
                window.focus();
                window.location.href = '/calendar';
            }
        });
    }
    
    // إرسال إشعار نمط جديد
    sendPatternNotification(pattern) {
        const title = `نمط ${pattern.type} مكتشف: ${pattern.pair}`;
        const body = `الاتجاه: ${pattern.direction === 'bullish' ? 'صاعد' : 'هابط'} | المستوى: ${pattern.level} | الإطار الزمني: ${pattern.timeframe}`;
        
        return this.sendNotification(title, {
            body,
            data: { patternId: pattern.id },
            onClick: function() {
                window.focus();
                window.location.href = '/patterns';
            }
        });
    }
    
    // إضافة مستمع للإشعارات
    addListener(listener) {
        if (typeof listener === 'function' && !this.listeners.includes(listener)) {
            this.listeners.push(listener);
            return true;
        }
        return false;
    }
    
    // إزالة مستمع للإشعارات
    removeListener(listener) {
        const index = this.listeners.indexOf(listener);
        if (index !== -1) {
            this.listeners.splice(index, 1);
            return true;
        }
        return false;
    }
    
    // إخطار جميع المستمعين
    notifyListeners(notification) {
        this.listeners.forEach(listener => {
            try {
                listener(notification);
            } catch (error) {
                console.error('Error in notification listener:', error);
            }
        });
    }
    
    // عرض إشعار داخل التطبيق
    showInAppNotification(title, message, type = 'info', duration = 5000) {
        const notification = {
            id: Date.now(),
            title,
            message,
            type,
            timestamp: new Date()
        };
        
        // إخطار المستمعين بالإشعار الجديد
        this.notifyListeners(notification);
        
        return notification.id;
    }
}

// إنشاء نسخة واحدة من الخدمة للاستخدام في جميع أنحاء التطبيق
const notificationService = new NotificationService();

// تصدير الخدمة
// export default notificationService;
