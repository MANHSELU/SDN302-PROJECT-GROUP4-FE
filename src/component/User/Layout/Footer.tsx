function Footer() {
    return (
        <footer className="w-full bg-slate-800 text-slate-300 mt-12 border-t border-slate-700">
            <div className="w-full px-8 py-10 flex flex-col md:flex-row justify-between gap-12">
                {/* Bên trái */}
                <div className="flex-1">
                    <h2 className="text-2xl font-bold text-yellow-400 mb-3">MyLibrary</h2>
                    <p className="text-sm text-slate-400 leading-relaxed max-w-md">
                        Explore thousands of books, connect with authors, and expand your
                        knowledge in our modern digital library.
                    </p>

                    {/* Icon mạng xã hội */}
                    <div className="flex gap-4 mt-4">
                        <a href="#" className="hover:text-yellow-400 transition-colors">🌐</a>
                        <a href="#" className="hover:text-yellow-400 transition-colors">🐦</a>
                        <a href="#" className="hover:text-yellow-400 transition-colors">📘</a>
                        <a href="#" className="hover:text-yellow-400 transition-colors">📷</a>
                    </div>
                </div>

                {/* Bên phải */}
                <div className="flex-1 grid grid-cols-2 gap-8">
                    {/* Quick Links */}
                    <div>
                        <h3 className="text-lg font-semibold text-yellow-400 mb-3">Quick Links</h3>
                        <ul className="space-y-2 text-sm">
                            {["Home", "Books", "Authors", "Events"].map((item, i) => (
                                <li key={i}>
                                    <a href="#" className="hover:text-yellow-400 transition-colors">
                                        {item}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="text-lg font-semibold text-yellow-400 mb-3">Contact</h3>
                        <p className="text-sm">📧 contact@mylibrary.com</p>
                        <p className="text-sm">📞 +84 123 456 789</p>
                        <p className="text-sm">🏢 123 Library Street, Hanoi</p>
                    </div>
                </div>
            </div>

            {/* Bản quyền */}
            <div className="w-full bg-slate-800 py-4 text-center text-xs text-slate-500 border-t border-slate-700">
                © {new Date().getFullYear()} MyLibrary. All rights reserved.
            </div>
        </footer>
    );
}

export default Footer;
