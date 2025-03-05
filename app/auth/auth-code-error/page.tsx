export default function AuthCodeError() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Authentication Error
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            There was an error processing your authentication code. This could be due to:
          </p>
          <ul className="mt-4 list-disc list-inside text-sm text-gray-600">
            <li>An expired or invalid authentication link</li>
            <li>A link that has already been used</li>
            <li>A technical issue with the authentication process</li>
          </ul>
          <div className="mt-6 p-4 bg-yellow-50 rounded-md">
            <h3 className="text-md font-medium text-yellow-800">What to do next</h3>
            <ul className="mt-2 list-disc list-inside text-sm text-yellow-700 space-y-1">
              <li>Try signing in with your email and password</li>
              <li>If you still cannot sign in, try requesting a password reset</li>
              <li>Contact support if you continue to experience issues</li>
            </ul>
          </div>
          <div className="mt-6 text-center">
            <a
              href="/auth/sign-in"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              Return to sign in
            </a>
          </div>
        </div>
      </div>
    </div>
  )
} 