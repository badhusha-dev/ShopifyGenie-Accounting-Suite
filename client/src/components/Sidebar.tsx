import { NavLink } from 'react-router-dom'
import { 
  LayoutDashboard, 
  Calculator, 
  BookOpen, 
  Store, 
  ShoppingCart, 
  RefreshCw, 
  BarChart3, 
  Settings,
  LogOut
} from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import { UserRole } from '@shopifygenie/shared'
import { Logo } from './Logo'

const navigation = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
    roles: ['SUPER_ADMIN', 'ACCOUNTING', 'SHOPIFY_MANAGER', 'AUDITOR'],
  },
  {
    name: 'Accounting',
    icon: Calculator,
    roles: ['SUPER_ADMIN', 'ACCOUNTING'],
    children: [
      {
        name: 'Chart of Accounts',
        href: '/accounting/accounts',
        roles: ['SUPER_ADMIN', 'ACCOUNTING'],
      },
      {
        name: 'Journal Entries',
        href: '/accounting/journal-entries',
        roles: ['SUPER_ADMIN', 'ACCOUNTING'],
      },
    ],
  },
  {
    name: 'Shopify',
    icon: Store,
    roles: ['SUPER_ADMIN', 'SHOPIFY_MANAGER'],
    children: [
      {
        name: 'Stores',
        href: '/shopify/stores',
        roles: ['SUPER_ADMIN', 'SHOPIFY_MANAGER'],
      },
      {
        name: 'Orders',
        href: '/shopify/orders',
        roles: ['SUPER_ADMIN', 'SHOPIFY_MANAGER'],
      },
    ],
  },
  {
    name: 'Reconciliation',
    href: '/reconciliation',
    icon: RefreshCw,
    roles: ['SUPER_ADMIN', 'ACCOUNTING'],
  },
  {
    name: 'Reports',
    href: '/reports',
    icon: BarChart3,
    roles: ['SUPER_ADMIN', 'ACCOUNTING', 'AUDITOR'],
  },
  {
    name: 'Settings',
    href: '/settings',
    icon: Settings,
    roles: ['SUPER_ADMIN', 'ACCOUNTING', 'SHOPIFY_MANAGER', 'AUDITOR'],
  },
]

export default function Sidebar() {
  const { user, logout, hasAnyRole } = useAuthStore()

  const canAccess = (roles: string[]) => {
    if (!user) return false
    return hasAnyRole(roles as UserRole[])
  }

  return (
    <div className="hidden md:flex md:w-64 md:flex-col">
      <div className="flex flex-col flex-grow pt-5 bg-white dark:bg-gray-800 overflow-y-auto border-r border-gray-200 dark:border-gray-700">
        <div className="flex items-center flex-shrink-0 px-4 mb-2">
          <Logo variant="full" className="h-10 w-auto" />
        </div>
        
        <div className="mt-8 flex-grow flex flex-col">
          <nav className="flex-1 px-2 space-y-1">
            {navigation.map((item) => {
              if (!canAccess(item.roles)) return null

              if (item.children) {
                return (
                  <div key={item.name} className="space-y-1">
                    <div className="flex items-center px-2 py-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                      <item.icon className="w-5 h-5 mr-3" />
                      {item.name}
                    </div>
                    {item.children.map((child) => {
                      if (!canAccess(child.roles)) return null
                      return (
                        <NavLink
                          key={child.name}
                          to={child.href}
                          className={({ isActive }) =>
                            `group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                              isActive
                                ? 'bg-primary-100 dark:bg-primary-900 text-primary-900 dark:text-primary-100'
                                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                            }`
                          }
                        >
                          <span className="ml-8">{child.name}</span>
                        </NavLink>
                      )
                    })}
                  </div>
                )
              }

              return (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className={({ isActive }) =>
                    `group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                      isActive
                        ? 'bg-primary-100 dark:bg-primary-900 text-primary-900 dark:text-primary-100'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                    }`
                  }
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  {item.name}
                </NavLink>
              )
            })}
          </nav>
        </div>

        <div className="flex-shrink-0 flex border-t border-gray-200 dark:border-gray-700 p-4">
          <button
            onClick={logout}
            className="flex-shrink-0 w-full group block"
          >
            <div className="flex items-center">
              <div>
                <LogOut className="inline-block h-5 w-5 text-gray-400 dark:text-gray-500 group-hover:text-gray-500 dark:group-hover:text-gray-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white">
                  Sign out
                </p>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}
