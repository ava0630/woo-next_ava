import Link from 'next/link';
import Image from "../../../image";
import {DEFAULT_CATEGORY_IMG_URL} from "../../../constants/urls";

const ParentCategoryBlock = ( props ) => {

	const { category } = props;

	return (
		<div className="product mb-5">
			<Link href={`/category/${category?.slug}`}>
					<Image
						className="object-cover h-40 md:h-64"
						fill={true}
						width="384"
						height="224"
						containerClassNames="w-96 h-56"
						sourceUrl={ category?.image?.sourceUrl ?? '' }
						defaultImgUrl={DEFAULT_CATEGORY_IMG_URL}
						altText={category?.image?.altText ?? category.slug}
						sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw" // Added sizes prop
					/>
					<div className="product-title-container p-3">
						<h3 className="product-title text-lg font-medium">{category?.name}</h3>
						<span className="shop-now text-sm">+ Explore</span>
					</div>
			</Link>
		</div>
	);
}

export default ParentCategoryBlock;
