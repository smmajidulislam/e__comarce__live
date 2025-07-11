"use client";
import Link from "next/link";
import Image from "next/image";
import { useGetSettingQuery } from "@/app/features/setting/settingApi";
import { useAuth } from "@/app/hooks/UseAuth";

const Footer = () => {
  const { data } = useGetSettingQuery();
  const { token } = useAuth();
  if (token?.role === true) {
    return <></>;
  }
  return (
    <footer className="bg-gray-900 text-white px-6 py-10">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:flex-wrap lg:flex-nowrap gap-8">
        {/* Left - Logo & Description */}
        <div className="flex-1 min-w-[200px]">
          <Link href="/" className="inline-block mb-2">
            <div className="flex items-center gap-2">
              <Image
                src={
                  data?.logo && data.logo.trim() !== ""
                    ? data.logo
                    : "/assets/logo.png"
                }
                alt="MyShop Logo"
                width={100}
                height={50}
              />
            </div>
          </Link>
          <p className="text-sm text-gray-400 mt-2">
            Discover quality products at unbeatable prices. Shop smart, live
            better.
          </p>

          {/* Social Icons */}
          <div className="flex items-center gap-4 mt-4">
            {data?.facebook && (
              <a
                href={data.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-sm btn-circle bg-blue-600 text-white hover:bg-blue-700"
              >
                <i className="fab fa-facebook-f"></i>
              </a>
            )}
            {data?.twitter && (
              <a
                href={data.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-sm btn-circle bg-sky-500 text-white hover:bg-sky-600"
              >
                <i className="fab fa-twitter"></i>
              </a>
            )}
            {data?.whatsapp && (
              <a
                href={`https://wa.me/${data.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-sm btn-circle bg-green-500 text-white hover:bg-green-600"
              >
                <i className="fab fa-whatsapp"></i>
              </a>
            )}
            {data?.gmail && (
              <a
                href={`mailto:${data.gmail}`}
                className="btn btn-sm btn-circle bg-red-500 text-white hover:bg-red-600"
              >
                <i className="fas fa-envelope"></i>
              </a>
            )}
          </div>
        </div>

        {/* Middle - Navigation Links */}
        <div className="flex-1 min-w-[200px] hidden md:block">
          <h3 className="text-lg font-semibold mb-2">Quick Links</h3>
          <ul className="space-y-1 text-gray-300">
            <li>
              <Link href="/" className="hover:text-white">
                Home
              </Link>
            </li>
            <li>
              <Link href="/shop" className="hover:text-white">
                Shop
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-white">
                About
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-white">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        {/* Right - Newsletter Form */}
        <div className="flex-1 min-w-[200px] hidden lg:block">
          <h3 className="text-lg font-semibold mb-2">Subscribe</h3>
          <p className="text-sm text-gray-400 mb-3">
            Get the latest updates and offers.
          </p>
          <form className="flex flex-col sm:flex-row items-start gap-2">
            <input
              type="email"
              placeholder="Your Email"
              className="px-3 py-2 w-full sm:w-auto flex-1 rounded bg-white text-black text-sm"
            />
            <button
              type="submit"
              className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded text-sm"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Copyright */}
      <div className="mt-8 text-center text-xs text-gray-500">
        &copy; {new Date().getFullYear()} MyShop. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
