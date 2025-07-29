import { LoadingSpinner } from '@/components/common/LoadingSpinner'

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="text-center">
        <LoadingSpinner size="large" />
        <h2 className="mt-4 text-xl font-semibold text-gray-700 dark:text-gray-300">
          Loading LexiCult...
        </h2>
        <p className="mt-2 text-gray-500 dark:text-gray-400">
          Preparing your language learning experience
        </p>
      </div>
    </div>
  )
}