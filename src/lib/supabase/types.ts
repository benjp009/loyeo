import type { Database } from '@/types/database.types'

// Re-export the Database type for convenience
export type { Database }

// Re-export table row types from database.types.ts
export type {
  Merchant,
  MerchantInsert,
  MerchantUpdate,
  Consumer,
  ConsumerInsert,
  ConsumerUpdate,
  Program,
  ProgramInsert,
  ProgramUpdate,
  Enrollment,
  EnrollmentInsert,
  EnrollmentUpdate,
  Visit,
  VisitInsert,
  VisitUpdate,
  Redemption,
  RedemptionInsert,
  RedemptionUpdate,
  MessagingEvent,
  MessagingEventInsert,
  MessagingEventUpdate,
} from '@/types/database.types'
