export default function ForgotPasswordPage() {
    return (
        <main className="auth-container">
            <div className="auth-card">
                <h1>Parolni tiklash</h1>
                <p className="auth-card__subtitle">
                    Hozircha bu funksiya ishlamaydi. Iltimos admin bilan bog‘laning.
                </p>

                <div className="mt-8">
                    <a href="/signin" className="auth-submit block w-full text-center no-underline">
                        Ortga qaytish
                    </a>
                </div>
            </div>
        </main>
    );
}
