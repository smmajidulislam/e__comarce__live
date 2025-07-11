"use client";
import ProductCard from "./Product";
import { useGetProductsQuery } from "../../features/product/productApi";
import Skeletons from "../global/Skeletons";

const NewArrivalProducts = () => {
  const { data, isLoading, error } = useGetProductsQuery({ latest: true });

  if (isLoading) {
    return (
      <div className="flex flex-wrap justify-center gap-4 px-2 py-6 min-h-screen">
        <Skeletons quantity={8} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-red-500 font-semibold">
          {error?.data?.message || "Failed to load new arrival products."}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap justify-center gap-4 px-2 py-6 min-h-screen">
      {data?.data?.length ? (
        data.data.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))
      ) : (
        <p className="text-gray-500">No new arrival products found.</p>
      )}
    </div>
  );
};

export default NewArrivalProducts;
