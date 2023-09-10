/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { CgSpinnerTwoAlt } from "react-icons/cg";

import "react-toastify/dist/ReactToastify.css";

import { useRouter } from "next/router";

const login = () => {
  const router = useRouter();

  // Input states
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");

  // auth
  const [otpAuth, setOtpAuth] = useState(false);

  // Loading States
  const [otpLoading, setOtpLoading] = useState(false);
  const [verifyOtpLoading, setVerifyOtpLoading] = useState(false);
  const [regestierLoading, setRegestierLoading] = useState(false);

  const handleToast = (msg) => {
    return toast(msg, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };

  const handleSendOtp = async () => {
    if (email.length === 0) {
      return handleToast("Please Enter Your Email!");
    }

    setOtpLoading(true);
    const res = await fetch("/api/otpVerifcation/otpEmail", {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // Specify the content type as JSON
      },
      body: JSON.stringify({ email }),
    });

    if (res.ok) {
      setOtpLoading(false);
      const data = await res.json();
      return handleToast(data.msg);
    } else {
      setOtpLoading(false);
      const data = await res.json();
      console.error(`Error: ${res.status}`);
      handleToast(data.msg);
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.length === 0) {
      return handleToast("Please Enter Your Otp That Sent To Your Email!");
    }

    // TODO
    try {
      const response = await fetch("/api/otpVerifcation/otpEmail", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json", // Specify the content type as JSON
        },
        body: JSON.stringify({ otpCode: otp }), // Wrap email in an object if it's not an object already
      });

      if (response.ok) {
        const data = await response.json();
        handleToast(data.msg);
        return setOtpAuth(true); // Access the OtpCode property from the JSON response
      } else {
        const data = await response.json();
        handleToast(data.msg);
        handleSendOtp(data.error);
        return console.error(`Error: ${response.status}`);
        // Handle non-200 status codes here
      }
    } catch (error) {
      console.error("An error occurred:", error);
      return handleToast(
        "An Error Occur, Please Check Your Internet Connection!"
      );
      // Handle other errors, e.g., network issues
    }
  };

  const handleOnSumbit = async () => {
    setRegestierLoading(true);
    if (!otpAuth) {
      setRegestierLoading(false);
      return handleToast("Please Do First Email Authentication!");
    } else if (password.length < 8) {
      setRegestierLoading(false);
      return handleToast("Please Enter A Valid Password!");
    }

    const data = {
      email,
      password,
    };

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      const data = await res.json();
      sessionStorage.setItem("token", data.token);
      setRegestierLoading(false);
      return router.push("/");
    } else {
      const data = await res.json();
      setRegestierLoading(false);
      return handleToast(data.msg);
    }
  };

  return (
    <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img
          className="mx-auto h-10 w-auto"
          src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
          alt="Your Company"
        />
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Sign in to your account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <div className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Email address
            </label>
            <div className="mt-2">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className={`${otpAuth ? "hidden" : ""} mt-5`}>
              <button
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                onClick={handleSendOtp}
              >
                {otpLoading ? (
                  <CgSpinnerTwoAlt className="text-white text-lg animate-spin" />
                ) : (
                  "Send OTP"
                )}
              </button>
            </div>
          </div>

          <div className={`${otpAuth ? "hidden" : ""}`}>
            <div className="flex items-center justify-between">
              <label
                htmlFor="otp"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                OTP
              </label>
              <div className="text-sm"></div>
            </div>
            <div className="mt-2">
              <input
                id="otp"
                name="otp"
                type="number"
                required
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
            </div>
            <div className="mt-5">
              <button
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                onClick={handleVerifyOtp}
              >
                Verify OTP
              </button>
            </div>
          </div>

          <div className={`${!otpAuth ? "hidden" : ""}`}>
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Password
              </label>
              <div className="text-sm">
                <a className="font-semibold text-indigo-600 hover:text-indigo-500">
                  Forgot password?
                </a>
              </div>
            </div>
            <div className="mt-2">
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="mt-10">
              <button
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                onClick={handleOnSumbit}
              >
                {regestierLoading ? (
                  <CgSpinnerTwoAlt className="text-white text-lg animate-spin" />
                ) : (
                  "Sign in"
                )}
              </button>
            </div>
          </div>
        </div>

        <p className="mt-10 text-center text-sm text-gray-500">
          Not a member?
          <a
            href="#"
            className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
          >
            Start a 14 day free trial
          </a>
        </p>
      </div>
    </div>
  );
};

export default login;
