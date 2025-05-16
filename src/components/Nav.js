import Link from 'next/link';
import CartIcon from "./cart/CartIcon";
import { useState, useEffect } from 'react';
import ProfileDropdown from "./ProfileDropdown";

const Nav = () => {
	const [isMenuVisible, setMenuVisibility] = useState(false);
	
	// 切换移动端菜单的显示状态
	const toggleMobileMenu = () => {
		setMenuVisibility(!isMenuVisible);
	};

	// 监听窗口大小变化，在切换到桌面版时关闭移动端菜单
	useEffect(() => {
		const handleResize = () => {
			if (window.innerWidth >= 1024) { // lg breakpoint
				setMenuVisibility(false);
			}
		};

		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, []);

	// 调试信息
	console.log("Nav组件渲染，ProfileDropdown组件已引入");

	return (
		<nav className="bg-white p-4 shadow-md">
			<div className="flex items-center justify-between flex-wrap container mx-auto">
				<div className="flex items-center flex-shrink-0 text-black mr-20">
					<svg className="fill-current h-8 w-8 mr-2" width="54" height="54" viewBox="0 0 54 54" xmlns="http://www.w3.org/2000/svg"><path d="M13.5 22.1c1.8-7.2 6.3-10.8 13.5-10.8 10.8 0 12.15 8.1 17.55 9.45 3.6.9 6.75-.45 9.45-4.05-1.8 7.2-6.3 10.8-13.5 10.8-10.8 0-12.15-8.1-17.55-9.45-3.6-.9-6.75.45-9.45 4.05zM0 38.3c1.8-7.2 6.3-10.8 13.5-10.8 10.8 0 12.15 8.1 17.55 9.45 3.6.9 6.75-.45 9.45-4.05-1.8 7.2-6.3 10.8-13.5 10.8-10.8 0-12.15-8.1-17.55-9.45-3.6-.9-6.75.45-9.45 4.05z"/></svg>
					<span className="font-semibold text-xl tracking-tight">
						<Link href="/">
							<span className="hover:text-gray-700 transition duration-150">
								Glodery
							</span>
						</Link>
					</span>
				</div>

				{/* Mobile menu button */}
				<div className="block lg:hidden">
					<button 
						onClick={toggleMobileMenu}
						className="flex items-center px-3 py-2 border rounded text-black border-black hover:text-gray-500 hover:border-gray-500 transition duration-150"
					>
						<svg className="fill-current h-3 w-3" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><title>Menu</title><path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"/></svg>
					</button>
				</div>

				{/* Menu (mobile and desktop) */}
				<div className={`${isMenuVisible ? 'block' : 'hidden'} w-full lg:block lg:flex-grow lg:flex lg:items-center lg:w-auto`}>
					<div className="text-sm font-medium uppercase lg:flex-grow">
						<Link href="/categories">
							<span className="block mt-4 lg:inline-block lg:mt-0 text-black hover:text-gray-600 mr-10 transition duration-150">
								Categories
							</span>
						</Link>

						<Link href="/Women">
							<span className="block mt-4 lg:inline-block lg:mt-0 text-black hover:text-gray-600 mr-10 transition duration-150">
								Women
							</span>
						</Link>

						<Link href="/Kids">
							<span className="block mt-4 lg:inline-block lg:mt-0 text-black hover:text-gray-600 mr-10 transition duration-150">
								Kids
							</span>
						</Link>

						<Link href="/Home & Living">
							<span className="block mt-4 lg:inline-block lg:mt-0 text-black hover:text-gray-600 mr-10 transition duration-150">
								Home & Living
							</span>
						</Link>

						<Link href="/Offers">
							<span className="block mt-4 lg:inline-block lg:mt-0 text-black hover:text-gray-600 mr-10 transition duration-150">
								Offers
							</span>
						</Link>
					</div>

					<div className="text-sm font-medium flex items-center flex-col lg:flex-row">
						{/* ProfileDropdown组件 */}
						<div className="relative w-full lg:w-auto">
							<ProfileDropdown isMobileMenuOpen={isMenuVisible} />
						</div>

						<Link href="#responsive-header">
							<div className="block mt-4 lg:mt-0 text-black hover:text-gray-600 mr-10 transition duration-150 w-full lg:w-auto text-sm font-medium uppercase">
								<div className="flex flex-col items-center lg:flex-col">
									<svg xmlns="http://www.w3.org/2000/svg" className="mb-1" fill="none" viewBox="0 0 24 24" width="18" height="18" stroke="currentColor">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
									</svg>
									<span className="text-xs">Wishlist</span>
								</div>
							</div>
						</Link>
						<div className="w-full lg:w-auto mt-4 lg:mt-0">
							<CartIcon/>
						</div>
					</div>
				</div>
			</div>
		</nav>
	)
};

export default Nav;
