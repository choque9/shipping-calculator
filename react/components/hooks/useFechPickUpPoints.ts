import { useState, useCallback } from 'react'
import { useRuntime } from 'vtex.render-runtime'

import { getPickups } from '../../client'

interface ShippingOption {
  name: string
  estimated: string
  cost: string
}

export const useFetchPickups = (postalCode: string) => {
  const { culture } = useRuntime()
  const [loading, setLoading] = useState(false)
  const [pickups, setPickups] = useState<ShippingOption[]>([])

  const fetchPickups = useCallback(async () => {
    setLoading(true)

    try {
      const responsePickups = await getPickups(
        culture.country,
        postalCode,
        'piercecommercepartnerar' // TODO: get from cookies
      )

      const shippingOptions: ShippingOption[] = responsePickups.items.map(
        (item: any) => ({
          name: item.pickupPoint.friendlyName,
          estimated: item.distance.toFixed(2).toString(),
          cost: '0',
        })
      )

      setPickups(shippingOptions)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }, [postalCode])

  return { loading, pickups, fetchPickups }
}
