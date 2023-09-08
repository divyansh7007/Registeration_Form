// SignUpPage.js
import React, { useRef, useState } from "react";
import { ToastContainer, toast } from "react-toastify";

import { CgSpinnerTwoAlt } from "react-icons/cg";

import "react-toastify/dist/ReactToastify.css";

import axios from "axios";
import { useRouter } from "next/router";

const SignUpPage = () => {
  const ref = useRef();
  const router = useRouter();

  // Input Handling States
  const [name, setName] = useState("");
  const [otp, setOtp] = useState();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [imageURL, setImageURL] = useState("");

  // Authencation Sates
  const [otpAuth, setOtpAuth] = useState(false);

  // Loading States
  const [otpSentLoading, setOtpSentLoading] = useState(false);
  const [otpVerifyLoading, setOtpVerifyLoading] = useState(false);
  const [onCreateUserLoading, setOnCreateUserLoading] = useState(false);
  const [onImageLoading, setOnImageLoading] = useState(false);

  const handleImageUpload = async (image) => {
    setOnImageLoading(true);
    try {
      // Create a new FormData object
      const formData = new FormData();

      // Add the image URL to the FormData
      formData.append("file", image);

      // Add your Cloudinary upload preset (replace 'your_upload_preset' with your actual preset)
      formData.append("upload_preset", "signin");

      // Make the fetch request to Cloudinary
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (response.ok) {
        setOnImageLoading(false);
        const data = await response.json();
        setImageURL(data.secure_url);
      } else {
        setOnImageLoading(false);
        console.error("Image upload failed");
      }
    } catch (error) {
      setOnImageLoading(false);
      console.error("Error uploading image:", error);
    }
  };

  const handleSendOtp = async (email) => {
    setOtpSentLoading(true);
    if (!email) {
      setOtpSentLoading(false);
      return toast("Please Provide an Email!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
    try {
      const response = await fetch("/api/otpVerifcation/otpEmail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Specify the content type as JSON
        },
        body: JSON.stringify({ email }), // Wrap email in an object if it's not an object already
      });

      if (response.ok) {
        setOtpSentLoading(false);
        const data = await response.json();
        return toast(data.msg, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      } else {
        setOtpSentLoading(false);
        const data = await response.json();
        console.error(`Error: ${response.status}`);
        return toast(data.msg, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        // Handle non-200 status codes here
      }
    } catch (error) {
      setOtpSentLoading(false);
      console.error("An error occurred:", error);
      return toast("An Error Occur, Please Check Your Internet Connection!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      // Handle other errors, e.g., network issues
    }
  };

  const handleVerifyOtp = async (otp) => {
    setOtpVerifyLoading(true);
    try {
      const response = await fetch("/api/otpVerifcation/otpEmail", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json", // Specify the content type as JSON
        },
        body: JSON.stringify({ otpCode: otp }), // Wrap email in an object if it's not an object already
      });

      if (response.ok) {
        setOtpVerifyLoading(false);
        const data = await response.json();
        toast(data.msg, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        return setOtpAuth(true); // Access the OtpCode property from the JSON response
      } else {
        setOtpVerifyLoading(false);
        const data = await response.json();
        toast(data.msg, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        return console.error(`Error: ${response.status}`);
        // Handle non-200 status codes here
      }
    } catch (error) {
      setOtpVerifyLoading(false);
      console.error("An error occurred:", error);
      return toast("An Error Occur, Please Check Your Internet Connection!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      // Handle other errors, e.g., network issues
    }
  };

  const onSubmit = async () => {
    setOnCreateUserLoading(true);

    if (!email) {
      setOnCreateUserLoading(false);
      return toast("Please Done Email Verification Ones More!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } else if (password.length <= 8) {
      setOnCreateUserLoading(false);
      console.log(password.length);
      return toast("Please Enter Your Password Above 8 Characters!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } else if (password !== confirmPassword) {
      setOnCreateUserLoading(false);
      return toast("Please Enter Same Password In Both Fields!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } else if (!password || !confirmPassword || !name) {
      setOnCreateUserLoading(false);
      return toast("Please Fill All The Fields!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } else {
      try {
        const response = await fetch("/api/auth/register", {
          method: "POST",
          body: JSON.stringify({
            userName: name,
            email,
            password,
            img: imageURL,
          }),
        })

        if (response.status === 401) {
          toast("Email Id is already exists!", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
          return setOnCreateUserLoading(false);
        }else if (response.status === 201) {
          setOnCreateUserLoading(false)
          const data = await response.json();
          sessionStorage.setItem('token', data.token);
          toast("User Was Created!", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
          return router.push('/');
        }
      } catch (error) {
        console.error(error);
        toast(error.message, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }
    }
  };

  return (
    <div className=" min-h-screen flex flex-col">
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
      {/* Same as */}
      <ToastContainer />
      <div className="container max-w-2xl mx-auto flex-1 flex flex-col items-center justify-center px-2">
        <div className="bg-white shadow-lg px-6 py-8 rounded shadow-gray-950 text-black w-full">
          <h1 className="mb-8 text-3xl text-center">Sign up</h1>
          <div
            className={`flex items-center justify-center text-center my-5 ${
              otpAuth ? "block" : "hidden"
            } `}
          >
            {onImageLoading ? (
              <CgSpinnerTwoAlt className="animate-spin cursor-wait text-5xl text-blue-400" />
            ) : (
              <img
                onClick={() => ref.current.click()}
                className="w-16 rounded-full cursor-pointer"
                src={
                  imageURL.length === 0
                    ? "https://e7.pngegg.com/pngimages/178/595/png-clipart-user-profile-computer-icons-login-user-avatars-monochrome-black.png"
                    : imageURL
                }
                alt=""
              />
            )}
            <input
              ref={ref}
              type="file"
              className="hidden border border-grey-light w-full p-3 rounded mb-4"
              name="fullname"
              placeholder="Full Name"
              onChange={(e) => handleImageUpload(e.target.files[0])}
            />
          </div>
          <div className={`${!otpAuth ? "block" : "hidden"}`}>
            <div className="flex items-center justify-center">
              <input
                type="email"
                className="block border border-grey-light w-full p-3 rounded mb-4"
                name="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button
                className="rounded-md w-[35%] px-3.5 py-2 m-1 overflow-hidden relative group cursor-pointer border-2 font-medium border-indigo-600 text-indigo-600"
                onClick={() => handleSendOtp(email)}
              >
                <span className="absolute w-64 h-0 transition-all duration-300 origin-center rotate-45 -translate-x-20 bg-indigo-600 top-1/2 group-hover:h-64 group-hover:-translate-y-32 ease"></span>
                <span className="relative text-indigo-600 transition duration-300 group-hover:text-white ease flex items-center justify-center">
                  {otpSentLoading ? (
                    <CgSpinnerTwoAlt className="animate-spin" />
                  ) : (
                    "SEND OTP"
                  )}
                </span>
              </button>
            </div>
            <div className="flex items-center justify-center">
              <input
                type="number"
                maxLength={6}
                className="block border border-grey-light w-[60%] p-3 rounded mb-4"
                placeholder="OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
              <button
                className="rounded-md w-[35%] px-3.5 py-2 m-1 overflow-hidden relative group cursor-pointer border-2 font-medium border-indigo-600 text-indigo-600"
                onClick={() => handleVerifyOtp(otp)}
              >
                <span className="absolute w-64 h-0 transition-all duration-300 origin-center rotate-45 -translate-x-20 bg-indigo-600 top-1/2 group-hover:h-64 group-hover:-translate-y-32 ease"></span>
                <span className="relative text-indigo-600 transition duration-300 group-hover:text-white ease flex items-center justify-center">
                  {otpVerifyLoading ? (
                    <CgSpinnerTwoAlt className="animate-spin" />
                  ) : (
                    "Verify OTP"
                  )}
                </span>
              </button>
            </div>
          </div>
          <div className={`${otpAuth ? "block" : "hidden"}`}>
            <input
              type="text"
              className="block border border-grey-light w-full p-3 rounded mb-4"
              name="name"
              placeholder="User Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              type="password"
              className="block border border-grey-light w-full p-3 rounded mb-4"
              name="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <input
              type="password"
              className="block border border-grey-light w-full p-3 rounded mb-4"
              name="confirm_password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button
              onClick={onSubmit}
              className="rounded-md w-full px-3.5 py-2 m-1 overflow-hidden relative group cursor-pointer border-2 font-medium border-indigo-600 text-indigo-600"
            >
              <span className="absolute w-64 h-0 transition-all duration-300 origin-center rotate-45 -translate-x-20 bg-indigo-600 top-1/2 group-hover:h-64 group-hover:-translate-y-32 ease"></span>
              <span className="relative text-indigo-600 transition duration-300 group-hover:text-white ease flex items-center justify-center">
                {onCreateUserLoading ? (
                  <CgSpinnerTwoAlt className="animate-spin" />
                ) : (
                  "Create Your Account"
                )}
              </span>
            </button>
          </div>
        </div>
        <div className="text-grey-dark mt-6">
          Already have an account?{" "}
          <a
            className="no-underline border-b border-blue text-blue"
            href="../login/"
          >
            Log in
          </a>
          .
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
