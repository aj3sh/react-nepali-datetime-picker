import { ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...args: ClassValue[]) {
  return twMerge(clsx(args))
}

export { clsx, cn }
