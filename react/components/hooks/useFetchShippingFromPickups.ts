import { useState, useCallback } from 'react'
import { useRuntime } from 'vtex.render-runtime'
import { useProduct } from 'vtex.product-context'
import { useApolloClient } from 'react-apollo'

import { PickUpOption, ShippingOption, ShippingSLA } from '../../typings/global'
import { getDefaultSeller } from '../../utils/sellers'
import { getShippingEstimates } from '../../../graphql/queries/getShippingEstimates.gql'

export const useFetchShippingFromPickups = () => {
  const client = useApolloClient()
  const productContext = useProduct()
  const { culture } = useRuntime()
  const seller = getDefaultSeller(productContext?.selectedItem?.sellers)
  const skuId = productContext?.selectedItem?.itemId
  const quantity = productContext?.selectedQuantity?.toString()
  const [shippingFromPickups, setShippingFromPickups] = useState<
    ShippingOption[]
  >([])

  // Obtains the shipping cost to the store's postal code.
  const shippingFromPickupCall = useCallback(
    async (pickups: PickUpOption[]) => {
      const shippingPromises = pickups.map(async pickup => {
        try {
          const result = await client.query({
            query: getShippingEstimates,
            variables: {
              country: culture.country,
              postalCode: pickup.postalCode,
              items: [
                {
                  quantity,
                  id: skuId,
                  seller: seller.sellerId,
                },
              ],
            },
          })

          const { logisticsInfo } = result.data.shipping
          if (
            logisticsInfo &&
            logisticsInfo.length > 0 &&
            logisticsInfo[0].slas.length > 0
          ) {
            return logisticsInfo[0].slas.map((sla: ShippingSLA) => ({
              name: sla.friendlyName,
              estimated: sla.shippingEstimate,
              cost: sla.price.toString(),
            }))
          }
        } catch (err) {
          console.error(err)
        }

        return []
      })

      const allShippingOptions = await Promise.all(shippingPromises)
      const combinedList: ShippingOption[] = []
      const uniqueSet = new Set<string>()

      allShippingOptions.forEach(list => {
        list.forEach((item: ShippingOption) => {
          const uniqueKey = `${item.name}-${item.estimated}-${item.cost}`
          if (!uniqueSet.has(uniqueKey)) {
            uniqueSet.add(uniqueKey)
            combinedList.push(item)
          }
        })
      })
      setShippingFromPickups(combinedList)
    },
    [client, culture.country, quantity, skuId, seller.sellerId]
  )

  return { shippingFromPickups, shippingFromPickupCall }
}
