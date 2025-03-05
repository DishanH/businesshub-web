export default function VerifyEmail() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Check your email
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            We&apos;ve sent you an email with a link to verify your account. Please check your inbox and follow the instructions.
          </p>
          <div className="mt-6 p-4 bg-blue-50 rounded-md">
            <h3 className="text-md font-medium text-blue-800">Important Information</h3>
            <ul className="mt-2 list-disc list-inside text-sm text-blue-700 space-y-1">
              <li>Your account is currently inactive</li>
              <li>Once you verify your email, your account will be automatically activated</li>
              <li>You will then be able to sign in and access all features</li>
            </ul>
          </div>
          <p className="mt-6 text-center text-sm text-gray-500">
            Didn&apos;t receive an email?{' '}
            <a href="/auth/sign-in" className="font-medium text-indigo-600 hover:text-indigo-500">
              Try signing in again
            </a>
          </p>
        </div>
      </div>
    </div>
  )
} 