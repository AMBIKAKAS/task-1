import { useEffect, useState } from 'react'

export default function DarkModeToggle() {
  const [dark, setDark] = useState(false)

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [dark])

  return (
    <button
      onClick={() => setDark(!dark)}
      className="px-6 py-3 rounded-xl font-semibold text-base transition-all duration-300 ease-in-out 
                 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-white 
                 dark:from-gray-800 dark:via-gray-700 dark:to-gray-600 
                 hover:scale-105 shadow-lg dark:shadow-none"
    >
      {dark ? 'Light Mode ☀️' : 'Dark Mode 🌙'}
    </button>
  )
}
