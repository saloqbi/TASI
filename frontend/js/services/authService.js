// authService.js - خدمة المصادقة وإدارة المستخدمين

class AuthService {
    constructor() {
        this.apiService = apiService; // استخدام خدمة API المعرفة سابقاً
        this.currentUser = null;
        this.authStateListeners = [];
        
        // التحقق من حالة تسجيل الدخول عند التهيئة
        this.checkAuthState();
    }
    
    // التحقق من حالة تسجيل الدخول
    async checkAuthState() {
        const token = localStorage.getItem('chartdepth_token');
        if (token) {
            try {
                // في الإصدار النهائي، سيتم التحقق من صحة الرمز مع الخادم
                // محاكاة للتحقق من صحة الرمز
                this.currentUser = {
                    id: 'user123',
                    name: 'المستخدم',
                    email: 'user@example.com',
                    role: 'user'
                };
                
                this.notifyAuthStateListeners();
                return true;
            } catch (error) {
                console.error('Error validating token:', error);
                this.logout();
                return false;
            }
        }
        
        return false;
    }
    
    // تسجيل الدخول
    async login(email, password) {
        try {
            const response = await this.apiService.login(email, password);
            
            if (response && response.token) {
                this.currentUser = {
                    id: 'user123',
                    name: 'المستخدم',
                    email: email,
                    role: 'user'
                };
                
                this.notifyAuthStateListeners();
                return true;
            }
            
            return false;
        } catch (error) {
            console.error('Error during login:', error);
            throw error;
        }
    }
    
    // تسجيل الخروج
    async logout() {
        try {
            await this.apiService.logout();
            this.currentUser = null;
            this.notifyAuthStateListeners();
            return true;
        } catch (error) {
            console.error('Error during logout:', error);
            throw error;
        }
    }
    
    // التسجيل
    async register(name, email, password) {
        try {
            // في الإصدار النهائي، سيتم استبدال هذا بطلب API حقيقي
            return new Promise((resolve) => {
                setTimeout(() => {
                    const mockToken = `mock-token-${Date.now()}`;
                    this.apiService.setToken(mockToken);
                    
                    this.currentUser = {
                        id: 'user123',
                        name: name,
                        email: email,
                        role: 'user'
                    };
                    
                    this.notifyAuthStateListeners();
                    resolve({ success: true });
                }, 1000);
            });
        } catch (error) {
            console.error('Error during registration:', error);
            throw error;
        }
    }
    
    // إعادة تعيين كلمة المرور
    async resetPassword(email) {
        try {
            // في الإصدار النهائي، سيتم استبدال هذا بطلب API حقيقي
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve({ success: true });
                }, 1000);
            });
        } catch (error) {
            console.error('Error during password reset:', error);
            throw error;
        }
    }
    
    // تغيير كلمة المرور
    async changePassword(currentPassword, newPassword) {
        try {
            // في الإصدار النهائي، سيتم استبدال هذا بطلب API حقيقي
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve({ success: true });
                }, 1000);
            });
        } catch (error) {
            console.error('Error changing password:', error);
            throw error;
        }
    }
    
    // الحصول على المستخدم الحالي
    getCurrentUser() {
        return this.currentUser;
    }
    
    // التحقق من حالة تسجيل الدخول
    isAuthenticated() {
        return !!this.currentUser;
    }
    
    // إضافة مستمع لحالة المصادقة
    addAuthStateListener(listener) {
        if (typeof listener === 'function' && !this.authStateListeners.includes(listener)) {
            this.authStateListeners.push(listener);
            
            // استدعاء المستمع فوراً مع الحالة الحالية
            listener(this.isAuthenticated(), this.currentUser);
            
            return true;
        }
        return false;
    }
    
    // إزالة مستمع لحالة المصادقة
    removeAuthStateListener(listener) {
        const index = this.authStateListeners.indexOf(listener);
        if (index !== -1) {
            this.authStateListeners.splice(index, 1);
            return true;
        }
        return false;
    }
    
    // إخطار جميع المستمعين بتغيير حالة المصادقة
    notifyAuthStateListeners() {
        const isAuthenticated = this.isAuthenticated();
        const user = this.getCurrentUser();
        
        this.authStateListeners.forEach(listener => {
            try {
                listener(isAuthenticated, user);
            } catch (error) {
                console.error('Error in auth state listener:', error);
            }
        });
    }
}

// إنشاء نسخة واحدة من الخدمة للاستخدام في جميع أنحاء التطبيق
const authService = new AuthService();

// تصدير الخدمة
// export default authService;
