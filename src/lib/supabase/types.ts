import type { Database } from '@/types/database.types'

// Re-export the Database type for convenience
export type { Database }

// Table row types will be added in TS-005 when the schema is defined.
// Example pattern:
// export type Merchant = Database['public']['Tables']['merchants']['Row']
// export type MerchantInsert = Database['public']['Tables']['merchants']['Insert']
