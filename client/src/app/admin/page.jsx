"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { useLoginMutation } from "../features/auth/authApi";
import { useAuth } from "../hooks/UseAuth";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { savetoken, token, logout } = useAuth();
  const [login, { isLoading }] = useLoginMutation();
  const router = useRouter();

  const onSubmit = async (data) => {
    try {
      if (token !== null) {
        await logout();
      }
      const res = await login(data).unwrap();
      if (res?.ok) {
        toast.success("Login successful!");
        if (data?.remember) {
          savetoken(res.data, true);
        } else {
          savetoken(res.data, false);
        }
        router.push("/admin/admin");
      } else {
        toast.error("Login failed. Please try again.");
      }
    } catch (err) {
      toast.error(err?.message || "Login failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-bg-gray-900 dark:bg-gray-900">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-sm p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md space-y-5"
      >
        <h2 className="text-xl font-bold text-black dark:text-white text-center">
          Admin Login
        </h2>

        <div>
          <label className="block mb-1 text-sm font-medium text-black dark:text-white">
            Email
          </label>
          <input
            type="email"
            {...register("email", { required: "Email is required" })}
            className="w-full px-4 py-2 border rounded-md text-black dark:text-white bg-gray-100 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium text-black dark:text-white">
            Password
          </label>
          <input
            type="password"
            {...register("password", { required: "Password is required" })}
            className="w-full px-4 py-2 border rounded-md text-black bg-gray-100 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:text-white"
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <input type="checkbox" {...register("remember")} />
          <label className="text-black text-sm dark:text-white">
            Remember Me
          </label>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-black dark:text-white py-2 px-4 rounded-md"
        >
          {isLoading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
