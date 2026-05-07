import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Word = {
  id: string
  tangkhul_word: string
  english_word: string
  phonetic?: string
  part_of_speech?: string
  category?: string
  example_tangkhul?: string
  example_english?: string
  grammar_notes?: string
  contributor_name: string
  verified: boolean
  view_count: number
  created_at: string
}

export type Category = {
  id: number
  group_name: string
  name: string
  emoji?: string
}

export type Contributor = {
  id: string
  name: string
  contact?: string
  region?: string
  message?: string
  email_consent: boolean
  created_at: string
}

export type ChatCorrection = {
  id: string
  original_ai_response: string
  corrected_text: string
  context_message?: string
  contributor_name?: string
  created_at: string
}

export type ModelVersion = {
  id: string
  version_number: number
  words_count: number
  corrections_count: number
  trained_at: string
  nvidia_job_id?: string
  status: string
}