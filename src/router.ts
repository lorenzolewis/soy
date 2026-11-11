import { useSyncExternalStore } from 'react'

/*
 * The site's two routes, on top of the browser's History API:
 *   /                  the board
 *   /projects/<slug>   the board with that project's detail open
 */
export type Route = { name: 'board' } | { name: 'project'; slug: string }

export function parseRoute(pathname: string): Route {
  const match = /^\/projects\/([^/]+)\/?$/.exec(pathname)
  if (match) return { name: 'project', slug: decodeURIComponent(match[1]) }
  return { name: 'board' }
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

export function useRoute(): Route {
  return parseRoute(useSyncExternalStore(subscribe, getPathname))
}
