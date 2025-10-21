import { useTheme } from '../contexts/ThemeContext'
import logoFull from '../assets/logo-full.svg'
import logoDark from '../assets/logo-dark.svg'
import logoIcon from '../assets/logo-icon.svg'

interface LogoProps {
  variant?: 'full' | 'icon'
  className?: string
}

export function Logo({ variant = 'full', className = '' }: LogoProps) {
  const { theme } = useTheme()
  
  if (variant === 'icon') {
    return (
      <img 
        src={logoIcon} 
        alt="ShopifyGenie" 
        className={className || 'h-10 w-10'}
      />
    )
  }
  
  return (
    <img 
      src={theme === 'dark' ? logoDark : logoFull}
      alt="ShopifyGenie Accounting Suite Pro" 
      className={className || 'h-12 w-auto'}
    />
  )
}

