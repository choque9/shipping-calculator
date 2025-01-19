import axios from 'axios'

export const getPickups = (
  countryCode: string,
  zipCode: string,
  account: string
) => {
  return axios
    .get('/api/checkout/pub/pickup-points', {
      params: {
        an: account,
        countryCode,
        postalCode: zipCode,
      },
    })
    .then((response: any) => {
      if (response.status !== 200) {
        throw new Error(`Error fetching pickup points: ${response.statusText}`)
      }
      return response.data
    })
    .catch((error: any) => {
      console.error(error)
      throw error
    })
}
