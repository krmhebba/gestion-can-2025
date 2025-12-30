const translations = {
    fr: {
        appTitle: 'Afri<span>CAN</span> Manager', appSubtitle: 'Maroc 2025',
        labelEmail: 'Email', labelPass: 'Mot de passe', btnConnect: 'Se connecter',
        welcome: 'Marhaba !', loginSuccess: 'Connexion réussie', loginErrorTitle: 'Erreur', loginErrorText: 'Email ou mot de passe incorrect'
    },
    en: {
        appTitle: 'Afri<span>CAN</span> Manager', appSubtitle: 'Morocco 2025',
        labelEmail: 'Email', labelPass: 'Password', btnConnect: 'Login',
        welcome: 'Welcome!', loginSuccess: 'Login successful', loginErrorTitle: 'Error', loginErrorText: 'Invalid email or password'
    },
    ar: {
        appTitle: 'نظام إدارة <span>الكان</span>', appSubtitle: 'المغرب 2025',
        labelEmail: 'البريد الإلكتروني', labelPass: 'كلمة المرور', btnConnect: 'تسجيل الدخول',
        welcome: '! مرحبا', loginSuccess: 'تم تسجيل الدخول بنجاح', loginErrorTitle: 'خطأ', loginErrorText: 'البريد الإلكتروني أو كلمة المرور غير صحيحة'
    }
};
document.addEventListener('DOMContentLoaded', () => {
    const savedLang = localStorage.getItem('appLang') || 'fr';
    changeLanguage(savedLang);
    const sessionUser = JSON.parse(localStorage.getItem('userSession'));
    if (sessionUser) { window.location.href = 'dashboard.html'; return; }
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            if (email === 'admin@app.com' && password === 'admin123') createSession('Admin', email, 'admin');
            else if (email === 'user@app.com' && password === 'user123') createSession('User', email, 'user');
            else showError();
        });
    }
});
function changeLanguage(lang) {
    localStorage.setItem('appLang', lang);
    document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
    const texts = translations[lang];
    if (texts) document.querySelectorAll('[data-i18n]').forEach(el => { const key = el.getAttribute('data-i18n'); if (texts[key]) el.innerHTML = texts[key]; });
    document.querySelectorAll('.lang-switch span').forEach(s => s.classList.remove('active'));
    if (document.getElementById('btn-' + lang)) document.getElementById('btn-' + lang).classList.add('active');
}
function createSession(name, email, role) {
    const currentLang = localStorage.getItem('appLang') || 'fr';
    localStorage.setItem('userSession', JSON.stringify({ name, email, role, token: Date.now() }));
    Swal.fire({ title: translations[currentLang].welcome, icon: 'success', confirmButtonColor: '#006233', timer: 1500, showConfirmButton: false }).then(() => window.location.href = 'dashboard.html');
}
function showError() { Swal.fire({ icon: 'error', title: 'Erreur', text: 'Email ou mot de passe incorrect', confirmButtonColor: '#C1272D' }); }