// lib/utils/role-redirect.ts
export function getRoleBasedRedirect(role: string, redirectParam?: string | null): string {
  console.log("═══════════════════════════════════════")
  console.log("🎯 getRoleBasedRedirect called")
  console.log("📥 Input role:", role)
  console.log("📥 Type of role:", typeof role)
  console.log("📥 Role value (JSON):", JSON.stringify(role))
  console.log("📥 Redirect param:", redirectParam)
  
  // If there's a redirect parameter, use it
  if (redirectParam) {
    console.log("✅ Using redirect parameter:", redirectParam)
    console.log("═══════════════════════════════════════")
    return redirectParam
  }

  // Normalize the role (trim whitespace and convert to lowercase)
  const normalizedRole = role?.trim().toLowerCase()
  console.log("🔄 Normalized role:", normalizedRole)

  let result: string

  // Default redirects based on role
  switch (normalizedRole) {
    case 'admin':
      result = '/admin'
      console.log("✅ ADMIN detected - returning /admin")
      break
    case 'wholesaler':
      result = '/wholesale'
      console.log("✅ WHOLESALER detected - returning /wholesale")
      break
    case 'normal':
      result = '/account'
      console.log("✅ NORMAL detected - returning /account")
      break
    default:
      result = '/account'
      console.warn('⚠️ Unknown role:', role, '- defaulting to /account')
      break
  }
  
  console.log("🚀 Final return value:", result)
  console.log("═══════════════════════════════════════")
  return result
}