import Layout from '../../src/components/Layout';
import { useRouter } from 'next/router';
import client from '../../src/components/ApolloClient';
import AddToCartButton from '../../src/components/cart/AddToCartButton';
import {PRODUCT_BY_SLUG_QUERY, PRODUCT_SLUGS} from '../../src/queries/product-by-slug';
import { isEmpty } from 'lodash';
import GalleryCarousel from "../../src/components/single-product/gallery-carousel";
import Price from "../../src/components/single-product/price";
import VariationSwatches from '../../src/components/single-product/VariationSwatches'; // Import VariationSwatches
import { useState } from 'react'; // Import useState

export default function Product(props) {
	const { product } = props;

    const router = useRouter();

    // State to hold the selected variation ID
    const [selectedVariationId, setSelectedVariationId] = useState(null);
    // State to hold the matched variation object
    const [matchedVariation, setMatchedVariation] = useState(null);

    // Callback function to receive the matched variation object from VariationSwatches
    const handleVariationSelect = (variation) => {
        setMatchedVariation(variation);
        setSelectedVariationId(variation?.databaseId || null);
    };

    // If the page is not yet generated, this will be displayed
    // initially until getStaticProps() finishes running
    if (router.isFallback) {
        return <div>Loading...</div>
    }

    // Determine which ID to pass to AddToCartButton: product ID for simple products, selected variation ID for variable products
    const productOrVariationId = product?.type === 'VARIABLE' && selectedVariationId ? selectedVariationId : product?.productId;

    // Determine price and stock to display based on selected variation for variable products
    const displayPrice = product?.type === 'VARIABLE' && matchedVariation ? matchedVariation.price : product?.price;
    const displayRegularPrice = product?.type === 'VARIABLE' && matchedVariation ? matchedVariation.regularPrice : product?.regularPrice;
    const displayStockStatus = product?.type === 'VARIABLE' && matchedVariation ? matchedVariation.stockStatus : product?.stockStatus; // Assuming simple products also have stockStatus


	return (
		<Layout>
			{ product ? (
				<div className="single-product container mx-auto my-32 px-4 xl:px-0">
					<div className="grid md:grid-cols-2 gap-4">
						<div className="product-images">

							{ !isEmpty( product?.galleryImages?.nodes ) ? (
                                <GalleryCarousel gallery={product?.galleryImages?.nodes}/>
							) : !isEmpty( product.image ) ? (
                                <img
                                    src={ product?.image?.sourceUrl }
                                    alt="Product Image"
                                    width="100%"
                                    height="auto"
                                    srcSet={ product?.image?.srcSet }
                                />
							) : null }
						</div>
						<div className="product-info">
							<h4 className="products-main-title text-2xl uppercase">{ product.name }</h4>
							<div

								dangerouslySetInnerHTML={ {
									__html: product.description,
								} }
								className="product-description mb-5"
							/>
                            {/* Display price based on selected variation for variable products */}
                            <Price salesPrice={displayPrice} regularPrice={displayRegularPrice}/>

                            {/* Render VariationSwatches for variable products */}
                            { product?.type === 'VARIABLE' && !isEmpty(product?.variations?.nodes) && ( // Also check if variations exist
                                <VariationSwatches product={product} onVariationSelect={handleVariationSelect} />
                            )}

                            {/* Display stock status for the selected variation or simple product */}
                             {/* You might want to style this based on stockStatus value */}
                            {displayStockStatus && (
                                <div className="stock-status mb-4">Stock: {displayStockStatus}</div>
                            )}

                            {/* Pass the correct product or variation ID to AddToCartButton */}
                            {/* AddToCartButton should be enabled only if a variation is selected for variable products */}

							<AddToCartButton product={ product } selectedVariationId={productOrVariationId} isVariableProduct={product?.type === 'VARIABLE'} selectedVariation={matchedVariation} />
						</div>
					</div>

				</div>
			) : (
				''
			) }
		</Layout>
	);
};


export async function getStaticProps(context) {

    const {params: { slug }} = context

    const {data} = await client.query({
        query: PRODUCT_BY_SLUG_QUERY,
        variables: { slug }
    })

    return {
        props: {
            product: data?.product || {},
        },
        revalidate: 1
    };
}

export async function getStaticPaths () {
    const { data } = await client.query({
        query: PRODUCT_SLUGS
    })

    const pathsData = []

    data?.products?.nodes && data?.products?.nodes.map((product) => {
        if (!isEmpty(product?.slug)) {
            pathsData.push({ params: { slug: product?.slug } })
        }
    })

    return {
        paths: pathsData,
        fallback: true
    }
}
