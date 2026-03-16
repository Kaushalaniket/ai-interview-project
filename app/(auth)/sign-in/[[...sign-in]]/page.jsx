import { SignIn } from '@clerk/nextjs';

export default function Page() {
  return (
    <div className="min-h-screen h-screen flex items-center justify-center bg-gray-100">
      <div className="flex flex-col lg:flex-row h-full w-full bg-white shadow-2xl">

        {/* Left side FULL SCREEN image */}
        <div
          className="hidden lg:block lg:w-1/2 h-full bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1546514714-df0ccc50d7bf?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=667&q=80')",
          }}
        ></div>

        {/* Right side FULL HEIGHT login card */}
        <div className="w-full lg:w-1/2 h-full flex flex-col justify-center items-center p-10 bg-white">
          <h2 className="text-3xl font-bold text-gray-700 text-center">PrepBrain</h2>
          <p className="text-lg text-gray-600 text-center mb-6">Welcome back!</p>

          <div className="w-full max-w-md">
            <SignIn path="/sign-in" routing="path" signUpUrl="/sign-up" />
          </div>
        </div>
      </div>
    </div>
  );
}
