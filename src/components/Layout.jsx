import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import SharedModals from './SharedModals';
import ErrorBoundary from './ErrorBoundary';

const isStaffShell = (pathname) =>
    pathname.startsWith('/admin/') || pathname.startsWith('/salesman/') || pathname.startsWith('/employee/');

const Layout = () => {
    const { pathname } = useLocation();

    return (
        <ErrorBoundary>
        <div className="bg-dark text-white font-sans overflow-hidden min-h-screen flex flex-col">
            {!isStaffShell(pathname) && <Navbar />}

            <main className="flex-grow" key={pathname}>
                <Outlet />
            </main>

            {!isStaffShell(pathname) && <Footer />}
            <SharedModals />
        </div>
        </ErrorBoundary>
    );
};

export default Layout;
