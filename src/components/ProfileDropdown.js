import React, { useState, useRef, useEffect } from 'react';

const ProfileDropdown = ({ isMobileMenuOpen }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const buttonRef = useRef(null);
  const menuRef = useRef(null);
  const dropdownRef = useRef(null);
  
  // 检测是否为移动端
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  // 当移动端菜单关闭时，同时关闭下拉菜单
  useEffect(() => {
    if (!isMobileMenuOpen) {
      setIsMenuOpen(false);
    }
  }, [isMobileMenuOpen]);

  const toggleMenu = (e) => {
    e.preventDefault();
    setIsMenuOpen(!isMenuOpen);
  };

  // 添加点击外部区域关闭菜单的功能
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target) &&
        !isMobile // 仅在桌面版启用点击外部关闭
      ) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen, isMobile]);

  const menuItemClass = isMobile
    ? "block mt-4 lg:inline-block lg:mt-0 text-black hover:text-gray-600 mr-10 transition duration-150 text-sm font-medium uppercase"
    : "block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900";

  return (
    <div ref={dropdownRef} className="relative inline-block text-left">
      {/* Profile按钮 */}
      <button 
        ref={buttonRef}
        onClick={toggleMenu}
        className="flex flex-col items-center mt-4 lg:mt-0 text-black hover:text-gray-600 mr-10 transition duration-150 relative focus:outline-none"
        aria-expanded={isMenuOpen}
        aria-haspopup="true"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="mb-1"
          fill="none"
          viewBox="0 0 24 24"
          width="18"
          height="18"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
        <span className="text-xs flex items-center">
          Profile
          {isMenuOpen && (
            <span 
              className="inline-block w-1.5 h-1.5 rounded-full bg-indigo-600 ml-1"
              aria-hidden="true"
            />
          )}
        </span>
      </button>

      {/* 下拉菜单内容 */}
      {isMenuOpen && (
        <div 
          ref={menuRef}
          className={`
            ${isMobile 
              ? 'w-full bg-white' 
              : 'absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5'
            }
          `}
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="profile-menu"
          style={{
            zIndex: 50
          }}
        >
          <div className={isMobile ? '' : 'py-1'} role="none">
            <a 
              href="#" 
              className={menuItemClass}
              role="menuitem"
              onClick={(e) => {
                e.preventDefault();
                if (isMobile) return;
                setIsMenuOpen(false);
              }}
            >
              Sign In
            </a>
            <a 
              href="#" 
              className={menuItemClass}
              role="menuitem"
              onClick={(e) => {
                e.preventDefault();
                if (isMobile) return;
                setIsMenuOpen(false);
              }}
            >
              Sign Up
            </a>
            <a 
              href="#" 
              className={menuItemClass}
              role="menuitem"
              onClick={(e) => {
                e.preventDefault();
                if (isMobile) return;
                setIsMenuOpen(false);
              }}
            >
              Profile
            </a>
            <a 
              href="#" 
              className={menuItemClass}
              role="menuitem"
              onClick={(e) => {
                e.preventDefault();
                if (isMobile) return;
                setIsMenuOpen(false);
              }}
            >
              Account & Settings
            </a>
            <a 
              href="#" 
              className={menuItemClass}
              role="menuitem"
              onClick={(e) => {
                e.preventDefault();
                if (isMobile) return;
                setIsMenuOpen(false);
              }}
            >
              Sign Out
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown; 