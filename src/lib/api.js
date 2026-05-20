import { supabase } from './supabase'

/* ─── Helpers ───────────────────────────────────────────── */

async function getUserId() {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session?.user?.id) throw new Error('AUTH_REQUIRED')
  return session.user.id
}

async function getListingIds(userId) {
  const { data } = await supabase
    .from('listings')
    .select('id')
    .eq('user_id', userId)
  return (data || []).map(l => l.id)
}

function mapListing(row) {
  return {
    id: row.id,
    userId: row.user_id,
    address: row.address,
    type: row.type,
    plan: row.plan,
    status: row.status,
    rooms: row.rooms,
    sqm: row.sqm,
    price: row.price,
    visits: row.visits || 0,
    chatbotQuestions: row.chatbot_questions || 0,
    embedUrl: row.embed_url,
    createdAt: new Date(row.created_at).getTime(),
    expiresAt: row.expires_at ? new Date(row.expires_at).getTime() : null,
  }
}

/* ─── Listings ──────────────────────────────────────────── */

export async function getListings() {
  const userId = await getUserId()
  const { data, error } = await supabase
    .from('listings')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  if (error) throw error
  return (data || []).map(mapListing)
}

export async function getListing(id) {
  const userId = await getUserId()
  const { data, error } = await supabase
    .from('listings')
    .select('*')
    .eq('id', id)
    .eq('user_id', userId)
    .single()
  if (error) throw error
  return data ? mapListing(data) : null
}

/* ─── KPIs ──────────────────────────────────────────────── */

export async function getKpis() {
  const listings = await getListings()
  const active = listings.filter(l => l.status === 'active')
  const totalVisitors = listings.reduce((s, l) => s + l.visits, 0)
  const totalQuestions = listings.reduce((s, l) => s + l.chatbotQuestions, 0)

  return {
    activeListings: active.length,
    totalVisitors,
    totalListings: listings.length,
    chatbotQuestions: totalQuestions,
    conversionRate: listings.length > 0
      ? Number(((active.length / listings.length) * 100).toFixed(1))
      : 0,
    chatbotQuestionsToday: 0,
    avgViewTime: '—',
  }
}

/* ─── Visits ────────────────────────────────────────────── */

export async function getMonthlyVisits() {
  const userId = await getUserId()
  const listingIds = await getListingIds(userId)
  if (!listingIds.length) return emptyMonthly()

  const { data, error } = await supabase
    .from('visits')
    .select('visited_at')
    .in('listing_id', listingIds)
    .gte('visited_at', new Date(Date.now() - 365 * 86400000).toISOString())
  if (error) throw error

  const months = ['Jan', 'Feb', 'Már', 'Ápr', 'Máj', 'Jún', 'Júl', 'Aug', 'Szep', 'Okt', 'Nov', 'Dec']
  const counts = Object.fromEntries(months.map(m => [m, 0]))
  ;(data || []).forEach(v => {
    const m = months[new Date(v.visited_at).getMonth()]
    if (m) counts[m]++
  })

  return months.map(month => ({ month, value: counts[month] }))
}

function emptyMonthly() {
  return ['Jan', 'Feb', 'Már', 'Ápr', 'Máj', 'Jún', 'Júl', 'Aug', 'Szep', 'Okt', 'Nov', 'Dec']
    .map(month => ({ month, value: 0 }))
}

export async function getDailyVisits(days = 30) {
  const userId = await getUserId()
  const listingIds = await getListingIds(userId)
  if (!listingIds.length) return []

  const { data, error } = await supabase
    .from('visits')
    .select('visited_at')
    .in('listing_id', listingIds)
    .gte('visited_at', new Date(Date.now() - days * 86400000).toISOString())
    .order('visited_at', { ascending: true })
  if (error) throw error

  const map = {}
  for (let i = days; i >= 0; i--) {
    const d = new Date(Date.now() - i * 86400000).toISOString().slice(0, 10)
    map[d] = 0
  }
  ;(data || []).forEach(v => {
    const d = new Date(v.visited_at).toISOString().slice(0, 10)
    if (map[d] !== undefined) map[d]++
  })
  return Object.entries(map).map(([date, value]) => ({ date, value }))
}

/* ─── Chatbot Questions ─────────────────────────────────── */

export async function getChatbotQuestions() {
  const userId = await getUserId()
  const listingIds = await getListingIds(userId)
  if (!listingIds.length) return []

  const { data, error } = await supabase
    .from('chatbot_questions')
    .select('*, listings!inner(address)')
    .in('listing_id', listingIds)
    .order('count', { ascending: false })
  if (error) throw error

  return (data || []).map(q => ({
    id: q.id,
    property: q.listings?.address || '—',
    question: q.question,
    category: q.category || 'egyéb',
    count: q.count || 0,
    date: q.created_at,
  }))
}

export async function getCategoryCounts() {
  const questions = await getChatbotQuestions()
  const counts = {}
  questions.forEach(q => {
    const cat = q.category || 'egyéb'
    counts[cat] = (counts[cat] || 0) + q.count
  })
  return counts
}

/* ─── Heatmap Data ──────────────────────────────────────── */

export async function getHeatmapData() {
  const userId = await getUserId()
  const listingIds = await getListingIds(userId)
  if (!listingIds.length) return []

  const { data, error } = await supabase
    .from('heatmap_data')
    .select('*, listings!inner(address)')
    .in('listing_id', listingIds)
  if (error) throw error

  const grouped = {}
  ;(data || []).forEach(h => {
    const key = h.listing_id
    if (!grouped[key]) {
      grouped[key] = {
        propertyId: h.listing_id,
        property: h.listings?.address || '—',
        rooms: [],
        totalViewTime: '—',
        avgViewTime: '—',
      }
    }
    grouped[key].rooms.push({
      name: h.room_name,
      timePercent: Number(h.time_percent) || 0,
      color: '#0a0a0a',
    })
  })

  return Object.values(grouped)
}

/* ─── SEO Texts ─────────────────────────────────────────── */

export async function getSeoTexts() {
  const userId = await getUserId()
  const listingIds = await getListingIds(userId)
  if (!listingIds.length) return []

  const { data, error } = await supabase
    .from('seo_texts')
    .select('*, listings!inner(address)')
    .in('listing_id', listingIds)
    .order('created_at', { ascending: false })
  if (error) throw error

  return (data || []).map(s => ({
    id: s.id,
    property: s.listings?.address || '—',
    title: s.title,
    excerpt: s.excerpt || '',
    status: s.status || 'draft',
    createdAt: new Date(s.created_at).getTime(),
    listingId: s.listing_id,
  }))
}

export async function generateSeoText(listingId) {
  const userId = await getUserId()

  const { data: listing, error: le } = await supabase
    .from('listings')
    .select('address, rooms, sqm, type')
    .eq('id', listingId)
    .eq('user_id', userId)
    .single()
  if (le || !listing) throw new Error('Listing not found')

  const title = `AI generált leírás – ${listing.address}`
  const excerpt = `${listing.type || 'Ingatlan'}, ${listing.rooms || '?'} szoba, ${listing.sqm || '?'} m² – professzionális bemutató.`

  const { data, error } = await supabase
    .from('seo_texts')
    .insert({ listing_id: listingId, title, excerpt, status: 'draft' })
    .select('*, listings!inner(address)')
    .single()
  if (error) throw error

  return {
    id: data.id,
    property: data.listings?.address || '—',
    title: data.title,
    excerpt: data.excerpt || '',
    status: data.status,
    createdAt: new Date(data.created_at).getTime(),
    listingId: data.listing_id,
  }
}

/* ─── Team Members ──────────────────────────────────────── */

export async function getTeamMembers() {
  const userId = await getUserId()
  const { data, error } = await supabase
    .from('team_members')
    .select('*')
    .eq('owner_id', userId)
    .order('joined_at', { ascending: true })
  if (error) throw error

  return (data || []).map(m => ({
    id: m.id,
    name: m.name,
    email: m.email,
    role: m.role,
    avatar: (m.name || '??').split(' ').map(n => n[0]).join('').toUpperCase(),
    joined: new Date(m.joined_at).getTime(),
  }))
}
