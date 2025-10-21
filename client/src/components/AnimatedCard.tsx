import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface AnimatedCardProps {
  children: ReactNode
  delay?: number
  className?: string
}

export function AnimatedCard({ children, delay = 0, className = '' }: AnimatedCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

interface StatCardProps {
  name: string
  value: string | number
  icon: React.ComponentType<{ className?: string }>
  change: string
  changeType: 'positive' | 'negative'
  delay?: number
}

export function AnimatedStatCard({ 
  name, 
  value, 
  icon: Icon, 
  change, 
  changeType,
  delay = 0 
}: StatCardProps) {
  return (
    <AnimatedCard delay={delay} className="bg-white dark:bg-gray-800 overflow-hidden shadow-lg rounded-xl border border-gray-200 dark:border-gray-700">
      <div className="p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.5, delay: delay + 0.2 }}
              className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg"
            >
              <Icon className="h-6 w-6 text-white" />
            </motion.div>
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                {name}
              </dt>
              <dd className="flex items-baseline">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: delay + 0.3 }}
                  className="text-3xl font-bold text-gray-900 dark:text-white"
                >
                  {typeof value === 'number' ? value.toLocaleString() : value}
                </motion.div>
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: delay + 0.5 }}
                  className={`ml-2 flex items-baseline text-sm font-semibold ${
                    changeType === 'positive' 
                      ? 'text-green-600 dark:text-green-400' 
                      : 'text-red-600 dark:text-red-400'
                  }`}
                >
                  <span>{change}</span>
                </motion.div>
              </dd>
            </dl>
          </div>
        </div>
      </div>
      <motion.div 
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.6, delay: delay + 0.4 }}
        className={`h-2 ${
          changeType === 'positive' 
            ? 'bg-gradient-to-r from-green-400 to-green-600' 
            : 'bg-gradient-to-r from-red-400 to-red-600'
        }`}
        style={{ transformOrigin: 'left' }}
      />
    </AnimatedCard>
  )
}

