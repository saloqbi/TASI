// App.js - المكون الرئيسي للتطبيق

const { useState, useEffect } = React;
const { BrowserRouter, Route, Switch, Redirect } = ReactRouterDOM;

const App = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    
    useEffect(() => {
        // التحقق من حالة تسجيل الدخول عند تحميل التطبيق
        const checkAuthStatus = () => {
            const token = localStorage.getItem('chartdepth_token');
            if (token) {
                setIsAuthenticated(true);
            }
            setIsLoading(false);
        };
        
        checkAuthStatus();
    }, []);
    
    const handleLogin = (token) => {
        localStorage.setItem('chartdepth_token', token);
        setIsAuthenticated(true);
    };
    
    const handleLogout = () => {
        localStorage.removeItem('chartdepth_token');
        setIsAuthenticated(false);
    };
    
    if (isLoading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>جاري التحميل...</p>
            </div>
        );
    }
    
    return (
        <BrowserRouter>
            {isAuthenticated && <Navigation onLogout={handleLogout} />}
            <div className="main-container">
                <Switch>
                    <Route exact path="/">
                        {isAuthenticated ? <Redirect to="/dashboard" /> : <Login onLogin={handleLogin} />}
                    </Route>
                    <Route path="/login">
                        {isAuthenticated ? <Redirect to="/dashboard" /> : <Login onLogin={handleLogin} />}
                    </Route>
                    <PrivateRoute path="/dashboard" component={Dashboard} isAuthenticated={isAuthenticated} />
                    <PrivateRoute path="/signals" component={Signals} isAuthenticated={isAuthenticated} />
                    <PrivateRoute path="/patterns" component={Patterns} isAuthenticated={isAuthenticated} />
                    <PrivateRoute path="/charts" component={Charts} isAuthenticated={isAuthenticated} />
                    <PrivateRoute path="/calendar" component={Calendar} isAuthenticated={isAuthenticated} />
                    <PrivateRoute path="/settings" component={Settings} isAuthenticated={isAuthenticated} />
                    <Route path="*">
                        <div className="not-found">
                            <h2>404 - الصفحة غير موجودة</h2>
                            <p>الصفحة التي تبحث عنها غير موجودة.</p>
                            <button className="btn btn-primary" onClick={() => window.history.back()}>العودة للخلف</button>
                        </div>
                    </Route>
                </Switch>
            </div>
        </BrowserRouter>
    );
};

// مكون للتحقق من المصادقة للمسارات الخاصة
const PrivateRoute = ({ component: Component, isAuthenticated, ...rest }) => (
    <Route
        {...rest}
        render={(props) =>
            isAuthenticated ? (
                <Component {...props} />
            ) : (
                <Redirect to="/login" />
            )
        }
    />
);

// تحميل المكون الرئيسي في DOM
ReactDOM.render(<App />, document.getElementById('app'));
