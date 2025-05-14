import Nav from "./Nav";
import { useRouter } from 'next/router';

const Header = () => {
	const router = useRouter();
	const isProductPage = router.pathname.includes('/product/');
	
	return (
		<div className={`header ${!isProductPage ? 'fixed w-full top-0 left-0 z-50' : ''} bg-white`}>
			<Nav/>
		</div>
	)
};

export default Header;
