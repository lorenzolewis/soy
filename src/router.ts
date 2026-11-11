import { useLayoutEffect, useSyncExternalStore } from 'react'
import { findProject } from './content/content'

/*
 * The site's two routes, on top of the browser's History API:
 *   /                  the board
 *   /projects/<slug>   the board with that project's detail open
 */
export type Route = { name: 'board' } | { name: 'project'; slug: string }

/** The route for a path, or `null` if the site has no such page (including an unknown project). */
export function parseRoute(pathname: string): Route | null {
  if (pathname === '/') return { name: 'board' }
  const match = /^\/projects\/([^/]+)\/?$/.exec(pathname)
  if (match) {
    const slug = safeDecode(match[1])
    if (slug !== null && findProject(slug)) return { name: 'project', slug }
  }
  return null
}

function safeDecode(segment: string): string | null {
  try {
    return decodeURIComponent(segment)
  } catch {
    return null
  }
}

export function routePath(route: Route): string {
  return route.name === 'project' ? `/projects/${encodeURIComponent(route.slug)}` : '/'
}

const listeners = new Set<() => void>()

function subscribe(listener: () => void) {
  listeners.add(listener)
  window.addEventListener('popstate', listener)
  return () => {
    listeners.delete(listener)
    window.removeEventListener('popstate', listener)
  }
}

/** Go to a route, adding a history entry so Back returns to where the visitor was. */
export function navigate(route: Route) {
  const path = routePath(route)
  if (path === window.location.pathname) return
  window.history.pushState(null, '', path)
  for (const listener of listeners) listener()
}

/** The current pathname. Kept as a string so React can compare snapshots cheaply. */
function getPathname() {
  return window.location.pathname
}

/**
 * The current route. An unknown path is sent to the homepage: the host serves
 * index.html for every path, so the redirect happens here, replacing the
 * history entry so Back doesn't return to the dead link.
 */
export function useRoute(): Route {
  const route = parseRoute(useSyncExternalStore(subscribe, getPathname))
  useLayoutEffect(() => {
    if (!route) {
      window.history.replaceState(null, '', '/' + window.location.search + window.location.hash)
      for (const listener of listeners) listener()
    }
  }, [route])
  return route ?? { name: 'board' }
}
