import { createClient } from '@supabase/supabase-js'
import { NextRequest } from 'next/server'
import { Database } from './database.types'
import { GraphQLClient, request } from 'graphql-request'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase URL or key')
}

const supabaseAdmin = createClient<Database>(supabaseUrl, supabaseServiceKey, {
  global: { fetch },
  auth: {
    persistSession: typeof window !== 'undefined',
  },
})

export default supabaseAdmin

export async function getUserFromRequest(request: NextRequest) {
  const token = request.headers.get('Authorization')?.replace('Bearer ', '')
  if (!token) return null

  const {
    data: { user },
    error,
  } = await supabaseAdmin.auth.getUser(token)

  if (error || !user) return null

  return user
}

export const adminGraphQLClient = new GraphQLClient(
  `${process.env.NEXT_PUBLIC_SUPABASE_URL}/graphql/v1`,
  {
    headers: {
      apikey: `${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
      Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
    },
  }
)
