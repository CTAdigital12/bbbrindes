export function usePathname() { return window.location.pathname }
export function useRouter() { return { push: (url: string) => { window.location.href = url }, refresh: () => { window.location.reload() } } }
