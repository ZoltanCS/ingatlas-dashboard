import { supabase } from './supabase'
import {
  PROPERTIES,
  MONTHLY_VISITS,
  DAILY_VISITS,
  CHATBOT_QUESTIONS,
  CATEGORY_COUNTS,
  HEATMAP_DATA,
  SEO_TEXTS,
  TEAM_MEMBERS,
  KPIS,
} from './mockData'

const USE_REAL = false

function delay(ms = 300) {
  return new Promise(r => setTimeout(r, ms))
}

export async function getAuthHeaders() {
  const { data } = await supabase.auth.getSession()
  const token = data?.session?.access_token
  if (!token) return {}
  return { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
}

export async function isLoggedIn() {
  const headers = await getAuthHeaders()
  return !!headers.Authorization
}

export async function getKpis() {
  await delay(200)
  return KPIS
}

export async function getProperties() {
  await delay(300)
  return PROPERTIES
}

export async function getProperty(id) {
  await delay(200)
  return PROPERTIES.find(p => p.id === id) || null
}

export async function getMonthlyVisits() {
  await delay(200)
  return MONTHLY_VISITS
}

export async function getDailyVisits() {
  await delay(200)
  return DAILY_VISITS
}

export async function getChatbotQuestions() {
  await delay(300)
  return CHATBOT_QUESTIONS
}

export async function getCategoryCounts() {
  await delay(200)
  return CATEGORY_COUNTS
}

export async function getHeatmapData() {
  await delay(300)
  return HEATMAP_DATA
}

export async function getSeoTexts() {
  await delay(300)
  return SEO_TEXTS
}

export async function getTeamMembers() {
  await delay(300)
  return TEAM_MEMBERS
}

export async function updateProperty(id, updates) {
  await delay(200)
  const idx = PROPERTIES.findIndex(p => p.id === id)
  if (idx >= 0) Object.assign(PROPERTIES[idx], updates)
  return PROPERTIES[idx]
}

export async function generateSeoText(propertyId) {
  await delay(800)
  const prop = PROPERTIES.find(p => p.id === propertyId)
  if (!prop) throw new Error('Property not found')
  return {
    id: 'seo-new-' + Date.now(),
    property: prop.address,
    status: 'draft',
    title: `AI generált leírás – ${prop.address}`,
    excerpt: `Ez egy AI által generált SEO-optimalizált ingatlanleírás a(z) ${prop.address} című ingatlanhoz. ${prop.rooms} szoba, ${prop.sqm} m².`,
    createdAt: Date.now(),
  }
}
