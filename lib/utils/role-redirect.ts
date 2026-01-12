// lib/utils/role-redirect.ts
export function getRoleBasedRedirect(
  role: string, 
  redirectParam?: string | null
): string {
  // If there's a redirect parameter, use it
  if (redirectParam) {
    return redirectParam
  }

  // Normalize the role (trim whitespace and convert to lowercase)
  const normalizedRole = role?.trim().toLowerCase()

  // Default redirects based on role
  switch (normalizedRole) {
    case 'admin':
      return '/admin'
    case 'wholesaler':
      return '/wholesale'
    case 'normal':
      return '/account'
    default:
      console.warn('⚠️ Unknown role:', role, '- defaulting to /account')
      return '/account'
  }
}
