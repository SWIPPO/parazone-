"use client";
import { Product, useProductStore } from "@/hooks/useProduct";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Price, usePricesStore } from "@/hooks/usePrice";
import { useCategoryStore } from "@/hooks/useCategory";

export default function ProductPage({
  params,
}: {
  params: {
    productSlug: string;
  };
}) {
  const productSlug = params.productSlug;

  const [product, setProduct] = useState<Product | null>();
  const [filteredPrices, setFilteredPrices] = useState<Price[]>([]);

  const [showMore, setShowMore] = useState<boolean>(false);

  const { products, fetchProducts } = useProductStore();
  const { Prices, fetchPrices } = usePricesStore();
  const { categories, fetchCategories } = useCategoryStore();

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  {
    /*fetching the product by the Slug in the params*/
  }
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        if (product === null && products.length === 0) {
          // Fetch products only if not already available
          await fetchProducts();
        }
        const fetchedProduct =
          products.find(
            (p) =>
              p.slug.toLowerCase() ===
              decodeURIComponent(productSlug).toLowerCase()
          ) || null;
        setProduct(fetchedProduct);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProduct();
  }, [productSlug, fetchProducts, products, products.length]);

  {
    /*fetching all the prices*/
  }
  useEffect(() => {
    fetchPrices();
  }, [fetchPrices]);

  {
    /*fetching the prices by the product id*/
  }
  useEffect(() => {
    const filtered = Prices.filter((price) => price.product_id === product?.id);
    setFilteredPrices(filtered);
  }, [Prices, productSlug]);

  if (!product) {
    return <div>Loading...</div>;
  }

  const handleToggleShowMore = () => {
    setShowMore((prevShowMore) => !prevShowMore);
  };

  const MAX_DESCRIPTION_LENGTH = 887; // Adjust as needed
  const LoadNum = 4;
  return (
    <div>
      {/* Main Product */}
      <div className="max-w-auto py-8 sm:px-6 lg:px-20 flex flex-col lg:flex-row lg:items-start lg:gap-x-8 mx-auto px-4 md:px-10 items-center justify-between">
        <div className="w-full lg:h-96 lg:w-96">
          <div className="flex justify-center lg:block border-2 rounded-lg border-gray-200 p-1">
            <Image
              src={`https://admin.parazone.tn/assets/${product.product_img}`}
              alt={product.title}
              className="rounded-lg h-32 w-32"
              layout="responsive"
              objectFit="cover"
              width={400}
              height={400}
            />
          </div>
        </div>

        {/* Product Info */}
        <div className="lg:w-2/3 mt-4 lg:mt-0">
          <h3 className="text-xl lg:text-2xl font-semibold tracking-tight text-gray-900">
            {product.title}
          </h3>

          <div className="mt-2">
            <p className="text-sm text-gray-700">Brand: {product.brand}</p>
          </div>
          <div className="py-2">
            <p className="text-sm text-gray-700">
              Category: {product.category_id.name}
            </p>
          </div>

          <div className="mt-6">
            <div className="text-gray-700 text-xs lg:text-base">
              {product.short_description.length > MAX_DESCRIPTION_LENGTH ? (
                <div>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: showMore
                        ? product.short_description
                        : `${product.short_description.substring(
                            0,
                            MAX_DESCRIPTION_LENGTH
                          )}...`,
                    }}
                  ></div>
                  <button
                    onClick={handleToggleShowMore}
                    className="mt-4 blue font-semibold hover:underline"
                  >
                    {showMore ? "Show Less" : "Show More..."}
                  </button>
                </div>
              ) : (
                <div
                  dangerouslySetInnerHTML={{
                    __html: product.short_description,
                  }}
                ></div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col  lg:flex-row p-2">
        {/* Secondary Products */}
        <div className="p-2  w-full lg:w-1/4 order-2 lg:order-1">
          <div className="bg-gray-100 rounded-lg shadow-md p-4">
            <h2 className="text-base lg:text-xl font-bold text-gray-900 mb-4">
              Related Products
            </h2>
            {products
              .filter((p) => p.slug !== productSlug)
              .slice(0, 4)
              .map((relatedProduct, index) => {
                const relatedParentCategory = categories.find(
                  (cat) => cat.id === relatedProduct.category_id.parent_id
                );
                return (
                  <Link
                    href={`/category/${relatedParentCategory?.slug}/${relatedProduct.category_id.slug}/${relatedProduct.slug}`}
                    key={index}
                    className="block border-b border-gray-300 pb-3 mb-3 last:border-0 last:pb-0 hover:bg-gray-200 transition-colors rounded-lg p-2"
                  >
                    <div className="flex items-center">
                      <div className="w-20 h-20 flex-shrink-0">
                        <Image
                          src={`https://admin.parazone.tn/assets/${relatedProduct.product_img}`}
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
                          Brand: {relatedProduct.brand}
                        </p>
                        <p className="text-xs text-gray-700">
                          Category: {relatedProduct.category_id.name}
                        </p>
                      </div>
                    </div>
                  </Link>
                );
              })}
          </div>
        </div>

        {/* items */}
        <div className=" w-full m-2  mx-auto rounded-xl bg-gray-100 order-1 lg:order-2">
          <h1 className=" text-start mt-4 ml-4  text-base lg:text-xl font-bold ">
            Prices Comparison
          </h1>

          <div className="w-full p-4 ">
            {filteredPrices.length > 0 ? (
              <ul className="flex flex-col gap-4 w-full p-2">
                {filteredPrices
                  .sort((a, b) => a.value - b.value)
                  .map((price) => (
                    <li
                      key={price.id}
                      className="flex flex-col lg:flex-row justify-between items-center border border-gray-200 rounded-xl p-4 hover:bg-gray-200  transition cursor-pointer"
                    >
                      <div className="w-full lg:w-1/3">
                        <p className="mb-2 text-xs font-semibold lg:text-sm w-full">
                          Product Name: {price.title}
                        </p>
                      </div>
                      <div className="w-full flex items-center justify-around">
                        {price.store_logo && (
                          <Link
                            href={price.store_url}
                            passHref
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Image
                              src={`https://admin.parazone.tn/assets/${price.store_logo}`}
                              alt="Store Logo"
                              width={100}
                              height={100}
                              className=" w-16 lg:w-24 rounded-full"
                            />
                          </Link>
                        )}
                        <p className="mt-4 font-bold text-xs lg:text-base mb-2">
                          {price.value} dt
                        </p>
                        <a
                          href={price.product_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-white blue-background py-1 lg:py-2 px-1 lg:px-4 rounded inline-block text-sm lg:text-base"
                        >
                          Acheter
                        </a>
                        g
                      </div>
                    </li>
                  ))}
              </ul>
            ) : (
              <div className="flex flex-col gap-6 justify-center items-center w-full">
                {[...Array(LoadNum)].map((_, index) => (
                  <div className="flex flex-row gap-2 w-full" key={index}>
                    <div className="animate-pulse bg-gray-300 w-full h-12 rounded-xl"></div>
                    <div className="flex flex-col gap-2">
                      <div className="animate-pulse bg-gray-300 w-28 h-5 rounded-full"></div>
                      <div className="animate-pulse bg-gray-300 w-36 h-5 rounded-full"></div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}