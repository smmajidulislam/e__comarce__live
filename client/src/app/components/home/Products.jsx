"use client";
import ProductCard from "./Product";
import Skeletons from "../global/Skeletons";
import { useGetProductsQuery } from "../../features/product/productApi";

const Products = () => {
  const { data, isLoading, error } = useGetProductsQuery({ sold: true });

  if (isLoading) {
    return (
      <div className="flex flex-wrap justify-center gap-4 px-4 py-8 min-h-screen">
        <Skeletons quantity={8} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-red-500 font-semibold">
          {error?.data?.message || "Something went wrong. Please try again."}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap justify-center gap-4 px-4 py-8 min-h-screen">
      {data?.data?.length ? (
        data.data.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))
      ) : (
        <p className="text-gray-500">No products found.</p>
      )}
    </div>
  );
};

export default Products;
