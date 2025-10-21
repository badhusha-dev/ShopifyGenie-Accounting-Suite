import { Plus, ExternalLink } from 'lucide-react'

export default function Stores() {
  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-bold text-gray-900">Shopify Stores</h1>
          <p className="mt-2 text-sm text-gray-700">
            Connect and manage your Shopify stores for automated accounting.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 sm:w-auto"
          >
            <Plus className="w-4 h-4 mr-2" />
            Connect Store
          </button>
        </div>
      </div>

      {/* Stores Grid */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <div className="px-4 py-5 sm:p-6">
          <div className="text-center py-12">
            <div className="text-gray-500">
              <p className="text-lg font-medium">No stores connected</p>
              <p className="mt-1">Connect your first Shopify store to start syncing data.</p>
              <div className="mt-6">
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-primary-700 bg-primary-100 hover:bg-primary-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Connect Shopify Store
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
