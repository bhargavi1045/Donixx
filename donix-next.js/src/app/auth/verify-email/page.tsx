"use client";
import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';

const Page: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token'); 

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [message, setMessage] = useState("Verifying...");

  useEffect(() => {
    if (token) {
      axios
        .get(`${process.env.NEXT_PUBLIC_BACKEND_ENDPOINT}/api/register/verify-email?token=${token}`)
        .then((res) => {
          setMessage(res.data.message);
          setSuccess(true);
          setLoading(false);
        })
        .catch((err) => {
          const errorMessage = err.response?.data?.error || err.response?.data?.message || "Verification failed.";
          setMessage(errorMessage);
          setError(errorMessage);
          setLoading(false);
        });
    } else {
      setMessage("Invalid or missing token.");
      setError("Invalid or missing token.");
      setLoading(false);
    }
  }, [token]);

  const handleRedirect = () => {
    router.push('/Login');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        {loading ? (
          <div className="text-center">
            <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 border-solid border-gray-300 border-t-transparent rounded-full"></div>
            <p className="mt-4 text-gray-500">Verifying your account...</p>
          </div>
        ) : error ? (
          <div className="text-center text-red-500">
            <p>{error}</p>
          </div>
        ) : success ? (
          <div className="text-center text-green-500">
            <p>{message}</p>
            <button
              className="mt-4 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
              onClick={handleRedirect}
            >
              Go to Login
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Page;