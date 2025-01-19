import { useState, useCallback } from 'react'
import { useRuntime } from 'vtex.render-runtime'

import { getPickups } from '../../client'
import { PickUpOption } from '../../typings/global'

export const useFetchPickups = (postalCode: string) => {
  const { culture } = useRuntime()
  const [loading, setLoading] = useState(false)
  const [pickups, setPickups] = useState<PickUpOption[]>([])

  const fetchPickups = useCallback(async () => {
    if (postalCode.length === 0) return
    setLoading(true)

    try {
      const responsePickups = await getPickups(
        culture.country,
        postalCode,
        'piercecommercepartnerar' // TODO: get from cookies
      )

      const pickUpOptionFormated: PickUpOption[] = responsePickups.items.map(
        (item: any) => ({
          name: item.pickupPoint.friendlyName,
          postalCode: item?.pickupPoint?.address?.postalCode,
        })
      )

      setPickups(pickUpOptionFormated)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }, [postalCode, pickups])

  return { loading, pickups, fetchPickups }
}
