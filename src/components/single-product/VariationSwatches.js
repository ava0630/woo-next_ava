import React, { useState, useEffect } from 'react';
import { isEmpty } from 'lodash';

const VariationSwatches = ({ product, onVariationSelect }) => {
  // State to hold selected attributes
  const [selectedAttributes, setSelectedAttributes] = useState({});
  // State to hold the currently matched variation
  const [matchedVariation, setMatchedVariation] = useState(null);
  // State to hold parsed product attributes for rendering swatches
  const [productAttributes, setProductAttributes] = useState({});

  // Parse product variations and build productAttributes state
  useEffect(() => {
    if (isEmpty(product?.variations?.nodes)) {
      setProductAttributes({});
      return;
    }

    const attributes = {};
    product.variations.nodes.forEach(variation => {
      variation.attributes.forEach(attr => {
        const attributeName = attr.attributeId; // Assuming attributeId is the usable name/identifier like 'pa_color'
        const attributeValue = attr.value; // This is the term slug

        if (!attributes[attributeName]) {
          attributes[attributeName] = new Set();
        }
        attributes[attributeName].add(attributeValue);
      });
    });

    // Convert Sets to Arrays and update state
    const finalAttributes = {};
    for (const name in attributes) {
      finalAttributes[name] = Array.from(attributes[name]);
    }
    setProductAttributes(finalAttributes);

    // TODO: Logic to find initial default variation and pre-select attributes if needed

  }, [product]); // Depend on product changes

  // Function to handle attribute selection
  const handleAttributeSelect = (attributeName, attributeValue) => {
    setSelectedAttributes(prevAttributes => ({
      ...prevAttributes,
      [attributeName]: attributeValue,
    }));
  };

  // Effect to find the matching variation whenever selectedAttributes change
  useEffect(() => {
    if (isEmpty(selectedAttributes) || isEmpty(product?.variations?.nodes)) {
      setMatchedVariation(null);
      onVariationSelect(null); // Notify parent about no matched variation
      return;
    }

    const findMatchingVariation = () => {
      const selectedAttributesArray = Object.entries(selectedAttributes);

      return product.variations.nodes.find(variation => {
        // Check if all selected attributes match this variation's attributes
        return selectedAttributesArray.every(([attrId, attrValue]) => {
          // Find the corresponding attribute in the variation by attributeId
          const variationAttribute = variation.attributes.nodes.find(varAttr => varAttr.attributeId === attrId);
          // Check if the attribute exists and its value matches the selected value (slug)
          return variationAttribute && variationAttribute.value === attrValue;
        });
      });
    };

    const foundVariation = findMatchingVariation();
    setMatchedVariation(foundVariation);
    onVariationSelect(foundVariation); // Notify parent component

  }, [selectedAttributes, product, onVariationSelect]); // Depend on selectedAttributes, product, and onVariationSelect


  if (isEmpty(product?.variations?.nodes) || isEmpty(productAttributes)) {
    return null; // Don't render if no variations or attributes exist
  }

  return (
    <div className="variation-swatches cfvsw-swatches-container cfvsw-product-container mb-4">
      {/* Render swatches for each attribute */}
      {Object.entries(productAttributes).map(([attributeName, attributeValues]) => (
        <div key={attributeName} className="attribute-swatches mb-3" swatches-attr={attributeName}> {/* Add swatches-attr */} 
          <label className="block text-sm font-medium text-gray-700 mb-1">{attributeName.replace('pa_', '')}:</label> {/* Display user-friendly attribute name */}
          <div className="flex space-x-2">
            {attributeValues.map(attributeValue => {
                const isSelected = selectedAttributes[attributeName] === attributeValue;

                // Render a generic swatch element that the plugin's script might target
                return (
                    <div
                        key={attributeValue}
                        className={`cfvsw-swatches-option px-3 py-1 border rounded cursor-pointer text-sm ${isSelected ? 'border-blue-500 ring ring-blue-200' : 'border-gray-300'}`} // Added plugin's class
                        data-slug={attributeValue} // Add data-slug
                        data-attribute={attributeName} // Add data-attribute
                        onClick={() => handleAttributeSelect(attributeName, attributeValue)}
                        title={attributeValue} // Add title for accessibility/hover
                    >
                        {/* Render the attribute value text inside, the plugin might replace this with color/image */}
                        {attributeValue}
                    </div>
                );
            })}
          </div>
        </div>
      ))}

      {/* Optional: Display info about the matched variation (can be removed later) */}
      {/*
      {matchedVariation ? (
        <div className="mt-4 text-sm text-green-600">
          Matched Variation Found (ID: {matchedVariation.databaseId})
        </div>
      ) : !isEmpty(selectedAttributes) ? (
         <div className="mt-4 text-sm text-red-600">
           No matching variation for selected attributes.
         </div>
      ) : null}
      */}

    </div>
  );
};

export default VariationSwatches;
