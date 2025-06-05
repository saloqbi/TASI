// Navigation.js - مكون شريط التنقل

const { Link, useLocation } = ReactRouterDOM;

const Navigation = ({ onLogout }) => {
    const location = useLocation();
    
    // التحقق من المسار النشط
    const isActive = (path) => {
        return location.pathname === path;
    };
    
    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <img src="assets/images/logo.png" alt="كوكبة تاسي لسحر الأرقام والتوصيات الذكية" />
                <span>كوكبة تاسي</span>
            </div>
            
            <ul className="navbar-nav">
                <li className="nav-item">
                    <Link to="/dashboard" className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}>
                        <i className="material-icons">dashboard</i>
                        <span>لوحة التحكم</span>
                    </Link>
                </li>
                <li className="nav-item">
                    <Link to="/signals" className={`nav-link ${isActive('/signals') ? 'active' : ''}`}>
                        <i className="material-icons">trending_up</i>
                        <span>الإشارات</span>
                    </Link>
                </li>
                <li className="nav-item">
                    <Link to="/patterns" className={`nav-link ${isActive('/patterns') ? 'active' : ''}`}>
                        <i className="material-icons">auto_graph</i>
                        <span>الأنماط</span>
                    </Link>
                </li>
                <li className="nav-item">
                    <Link to="/charts" className={`nav-link ${isActive('/charts') ? 'active' : ''}`}>
                        <i className="material-icons">bar_chart</i>
                        <span>الرسوم البيانية</span>
                    </Link>
                </li>
                <li className="nav-item">
                    <Link to="/calendar" className={`nav-link ${isActive('/calendar') ? 'active' : ''}`}>
                        <i className="material-icons">calendar_today</i>
                        <span>التقويم</span>
                    </Link>
                </li>
                <li className="nav-item">
                    <Link to="/settings" className={`nav-link ${isActive('/settings') ? 'active' : ''}`}>
                        <i className="material-icons">settings</i>
                        <span>الإعدادات</span>
                    </Link>
                </li>
                <li className="nav-item">
                    <a href="#" className="nav-link" onClick={onLogout}>
                        <i className="material-icons">logout</i>
                        <span>تسجيل الخروج</span>
                    </a>
                </li>
            </ul>
        </nav>
    );
};
