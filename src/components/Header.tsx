import React from 'react';
import UserMenu from './UserMenu';

const Header = () => {
  return (
    <header className="h-16 border-b bg-white px-4 flex items-center justify-between">
      <div className="flex items-center">
        <h1 className="text-xl font-semibold">Student Management System</h1>
      </div>
      <div className="flex items-center">
        <UserMenu />
      </div>
    </header>
  );
};

export default Header;
