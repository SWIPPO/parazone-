import { useProductStore } from "@/hooks/useProduct";
import { useRelationStore } from "@/hooks/useRelation";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useMemo } from "react";

interface ProductRelatedProductsProps {
  categoryId?: number;
  parentCategorySlug?: string;
  subCategorySlug?: string;
  productId?: string;
  categoryName?: string;
}
const ProductRelatedProducts: React.FC<ProductRelatedProductsProps> = ({
  categoryId,
  parentCategorySlug,
  subCategorySlug,
  productId,
  categoryName,
}) => {
  const { relations, fetchRelations } = useRelationStore();
  const { products, fetchProducts } = useProductStore();

  useEffect(() => {
    fetchRelations();
  }, [fetchRelations]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const productIds = useMemo(
    () =>
      relations
        .filter(
          (relation) => String(relation.category_id) === String(categoryId)
        )
        .map((relation) => relation.product_id),
    [relations, categoryId]
  );

  // Filter products based on the related product IDs
  const relatedProduct = useMemo(
    () => products.filter((product) => productIds.includes(product.id)),
    [products, productIds]
  );

  return (
    <div className="p-2  w-full lg:w-1/4 order-2 lg:order-1">
      <div className="bg-gray-100 rounded-lg shadow-md p-4">
        <h2 className="text-base lg:text-xl font-bold text-gray-900 mb-4">
          Produits Connexes
        </h2>
        {relatedProduct
          .filter((p) => String(p.id) !== String(productId))
          .slice(0, 4)
          .map((relatedProduct, index) => (
            <Link
              href={`/category/${parentCategorySlug}/${subCategorySlug}/${relatedProduct.slug}`}
              key={index}
              className="block border-b border-gray-300 pb-3 mb-3 last:border-0 last:pb-0 hover:bg-gray-200 transition-colors rounded-lg p-2"
            >
              <div className="flex items-center">
                <div className="w-20 h-20 flex-shrink-0">
                  <Image
                    src={`${relatedProduct.product_img}`}
                    alt={relatedProduct.title}
                    className="rounded-lg"
                    height={100}
                    width={100}
                    layout="responsive"
                    objectFit="cover"
                  />
                </div>
                <div className="ml-4 flex-1">
                  <h3 className="text-xs font-semibold text-gray-900">
                    {relatedProduct.title}
                  </h3>
                  <p className="text-xs text-gray-700">
                    Brand: {relatedProduct.brand_id?.title}
                  </p>
                  <p className="text-xs text-gray-700">
                    Category: {categoryName}
                  </p>
                </div>
              </div>
            </Link>
          ))}
      </div>
    </div>
  );
};

export default ProductRelatedProducts;
