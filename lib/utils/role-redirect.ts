// lib/utils/role-redirect.ts
export function getRoleBasedRedirect(role: string, redirectParam?: string | null): string {
  // If there's a redirect parameter and it's allowed for this role, use it
  if (redirectParam) {
    return redirectParam
  }

  // Default redirects based on role
  switch (role) {
    case 'admin':
      return '/admin'
    case 'wholesaler':
      return '/wholesale'
    case 'normal':
    default:
      return '/account'
  }
}