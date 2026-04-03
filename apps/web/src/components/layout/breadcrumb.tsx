import { Link, useMatches } from '@tanstack/react-router'
import { ChevronRight } from 'lucide-react'

export function Breadcrumb() {
  const matches = useMatches()

  const crumbs = matches
    .filter((match) => match.pathname !== '/')
    .map((match) => ({
      label: match.pathname.split('/').filter(Boolean).pop() ?? '',
      path: match.pathname,
    }))

  if (crumbs.length === 0) return null

  return (
    <nav className="flex items-center gap-1 text-sm text-gray-500">
      <Link to="/" className="hover:text-gray-700">
        Home
      </Link>
      {crumbs.map((crumb) => (
        <span key={crumb.path} className="flex items-center gap-1">
          <ChevronRight className="h-3 w-3" />
          <Link to={crumb.path} className="capitalize hover:text-gray-700">
            {crumb.label}
          </Link>
        </span>
      ))}
    </nav>
  )
}
