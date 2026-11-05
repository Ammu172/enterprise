
const API_BASE_URL = '/api'

export async function getCustomers() {
  const response = await fetch(`${API_BASE_URL}/customers`)

  if (!response.ok) {
    throw new Error(`Failed to fetch customers: ${response.status}`)
  }

  return response.json()
}

export async function getCustomerById(id: number) {
  const response = await fetch(`${API_BASE_URL}/customers/${id}`)

  if (!response.ok) {
    throw new Error(`Failed to fetch customer: ${response.status}`)
  }

  return response.json()
}

export async function getAccountsByCustomerId(customerId: number) {
  const response = await fetch(
    `${API_BASE_URL}/accounts/customer/${customerId}`
  )

  if (!response.ok) {
    throw new Error(`Failed to fetch accounts: ${response.status}`)
  }

  return response.json()
}
