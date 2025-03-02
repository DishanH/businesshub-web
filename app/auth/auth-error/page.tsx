export default function AuthError() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Authentication Error
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            There was an error during the authentication process. This could be due to:
          </p>
          <ul className="mt-4 list-disc list-inside text-sm text-gray-600">
            <li>An expired or invalid authentication link</li>
            <li>A cancelled authentication process</li>
            <li>A technical issue with the authentication provider</li>
          </ul>
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