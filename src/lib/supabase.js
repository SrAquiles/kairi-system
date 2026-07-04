import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseKey)

export async function saveCheckin(session, data) {
  const today = new Date().toISOString().split('T')[0]
  const { error } = await supabase
    .from('checkins')
    .upsert({ date: today, session, data, updated_at: new Date().toISOString() }, { onConflict: 'date,session' })
  return !error
}

export async function getTodayCheckins() {
  const today = new Date().toISOString().split('T')[0]
  const { data, error } = await supabase.from('checkins').select('*').eq('date', today)
  return data || []
}

export async function saveAseo(tasks) {
  const today = new Date().toISOString().split('T')[0]
  const { error } = await supabase
    .from('aseo')
    .upsert({ date: today, tasks, updated_at: new Date().toISOString() }, { onConflict: 'date' })
  return !error
}

export async function getTodayAseo() {
  const today = new Date().toISOString().split('T')[0]
  const { data } = await supabase.from('aseo').select('*').eq('date', today).single()
  return data
}

export async function getAseoStreak() {
  const { data } = await supabase.from('aseo').select('date, tasks').order('date', { ascending: false }).limit(30)
  if (!data) return 0
  let streak = 0
  const today = new Date()
  for (let i = 0; i < data.length; i++) {
    const d = new Date(data[i].date + 'T12:00:00')
    const diff = Math.round((today - d) / (1000 * 60 * 60 * 24))
    if (diff > i + 1) break
    const allDone = Object.values(data[i].tasks || {}).filter(Boolean).length === 6
    if (!allDone) break
    streak++
  }
  return streak
}

export async function getWeekHistory() {
  const { data } = await supabase.from('checkins').select('*').order('date', { ascending: false }).limit(21)
  return data || []
}
