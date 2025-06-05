// Login.js - مكون صفحة تسجيل الدخول

const { useState } = React;

const Login = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        
        try {
            // في الإصدار النهائي، سيتم استبدال هذا بطلب API حقيقي
            // محاكاة لعملية تسجيل الدخول
            setTimeout(() => {
                if (email && password) {
                    // توليد رمز مؤقت للمصادقة
                    const mockToken = `mock-token-${Date.now()}`;
                    onLogin(mockToken);
                } else {
                    setError('يرجى إدخال البريد الإلكتروني وكلمة المرور');
                }
                setIsLoading(false);
            }, 1000);
        } catch (err) {
            setError('حدث خطأ أثناء تسجيل الدخول. يرجى المحاولة مرة أخرى.');
            setIsLoading(false);
        }
    };
    
    return (
        <div className="login-container">
            <div className="login-logo">
                <img src="assets/images/logo.png" alt="كوكبة تاسي لسحر الأرقام والتوصيات الذكية" />
                <h1>كوكبة تاسي</h1>
                <p>لسحر الأرقام والتوصيات الذكية</p>
            </div>
            
            {error && <div className="alert alert-danger">{error}</div>}
            
            <form className="login-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <input
                        type="email"
                        className="form-control"
                        placeholder="البريد الإلكتروني"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                
                <div className="form-group">
                    <input
                        type="password"
                        className="form-control"
                        placeholder="كلمة المرور"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                
                <button
                    type="submit"
                    className="btn btn-primary"
                    style={{ width: '100%' }}
                    disabled={isLoading}
                >
                    {isLoading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
                </button>
            </form>
            
            <div className="login-links">
                <a href="#">نسيت كلمة المرور؟</a>
                <a href="#">إنشاء حساب جديد</a>
            </div>
        </div>
    );
};
