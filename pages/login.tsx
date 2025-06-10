import React from 'react';
import { LoginForm } from '../src/components/LoginForm';
import Head from 'next/head';

export default function LoginPage() {
  return (
    <>
      <Head>
        <title>Login - Vacancy</title>
        <meta name="description" content="Sign in to your Vacancy account" />
      </Head>

      <main className="min-h-screen bg-gray-50 flex flex-col justify-center">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <img
            className="mx-auto h-12 w-auto"
            src="/logo.png"
            alt="Vacancy"
          />
          <LoginForm />
          
          <p className="mt-4 text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <a href="/register" className="font-medium text-blue-600 hover:text-blue-500">
              Sign up
            </a>
          </p>
        </div>
      </main>
    </>
  );
} 