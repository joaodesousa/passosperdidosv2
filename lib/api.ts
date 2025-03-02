import { format } from "date-fns"
import type { DateRange } from "react-day-picker"
import { ApiResponse, Author } from "./types"

/**
 * Get auth token from the API
 */
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000'

export async function getAuthToken() {
  try {
    const response = await fetch(`${BASE_URL}/api/token`, { 
      method: 'POST',
      cache: 'no-store' // Ensure fresh token each time
    })
    if (!response.ok) {
      throw new Error(`Failed to get token: ${response.statusText}`)
    }
    const data = await response.json()
    return data.access
  } catch (error) {
    console.error("Error getting auth token:", error)
    throw error
  }
}

/**
 * Fetch items with optional filtering
 */
export async function fetchItems(params: {
  page: number
  search: string
  types: string[]
  phases: string[]
  authors: string[]
  dateRange: DateRange | undefined
}): Promise<ApiResponse> {
  try {
    const token = await getAuthToken()
    
    const queryParams = new URLSearchParams({
      page: params.page.toString(),
      search: params.search,
    })

    if (params.types.length > 0) {
      queryParams.append('type', params.types.join(','))
    }

    const filteredPhases = params.phases.filter(phase => phase !== "Todas")
    if (filteredPhases.length > 0) {
      queryParams.append('phase', filteredPhases.join(','))
    }

    if (params.authors.length > 0) {
      queryParams.append('authors', params.authors.join(','))
    }

    if (params.dateRange?.from) {
      queryParams.append('start_date', format(params.dateRange.from, "yyyy-MM-dd"))
    }
    if (params.dateRange?.to) {
      queryParams.append('end_date', format(params.dateRange.to, "yyyy-MM-dd"))
    }

    const response: Response = await fetch(`https://legis.passosperdidos.pt/projetoslei/?${queryParams}`, {
      headers: { 'Authorization': `Bearer ${token}` },
    })
    
    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`)
    }
    
    return response.json()
  } catch (error) {
    console.error("Error fetching items:", error)
    throw error
  }
}

/**
 * Fetch available types
 */
export async function fetchTypes(): Promise<string[]> {
  try {
    const response: Response = await fetch(`https://legis.passosperdidos.pt/types/`)
    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`)
    }
    return response.json()
  } catch (error) {
    console.error("Error fetching types:", error)
    throw error
  }
}

/**
 * Fetch available phases
 */
export async function fetchPhases(): Promise<string[]> {
  try {
    const response: Response = await fetch(`https://legis.passosperdidos.pt/phases/`)
    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`)
    }
    return response.json()
  } catch (error) {
    console.error("Error fetching phases:", error)
    throw error
  }
}

/**
 * Fetch available authors
 */
export async function fetchAuthors(): Promise<Author[]> {
  try {
    let allAuthors: Author[] = []
    let nextPage: string | null = 'https://legis.passosperdidos.pt/authors/'
    
    // Fetch all pages of authors
    while (nextPage) {
      // Ensure HTTPS is always used by replacing http with https
      const secureUrl = nextPage.replace('http://', 'https://');
      
      const response: Response = await fetch(secureUrl)
      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`)
      }
      
      const data = await response.json()
      allAuthors = [...allAuthors, ...data.results]
      
      // Ensure next page URL also uses HTTPS
      nextPage = data.next ? data.next.replace('http://', 'https://') : null
    }
    
    return allAuthors
  } catch (error) {
    console.error("Error fetching authors:", error)
    throw error
  }
}