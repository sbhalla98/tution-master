import { Outlet } from 'react-router-dom';
import Sidebar from './app-sidebar';
import Header from './Header';

const Layout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <Sidebar />
        <div className="flex-1">
          <Header />
          <main className="p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default Layout;
