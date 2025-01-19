import { useState, useCallback } from 'react'
import { useProduct } from 'vtex.product-context'
import { useApolloClient } from 'react-apollo'
import { useRuntime } from 'vtex.render-runtime'

import { getShippingEstimates } from '../../../graphql/queries/getShippingEstimates.gql'
import { ShippingOption, ShippingSLA } from '../../typings/global'
import { getDefaultSeller } from '../../utils/sellers'

export const useCalculateShipping = (postalCode: string) => {
  const client = useApolloClient()
  const productContext = useProduct()
  const { culture } = useRuntime()
  const seller = getDefaultSeller(productContext?.selectedItem?.sellers)
  const skuId = productContext?.selectedItem?.itemId
  const quantity = productContext?.selectedQuantity?.toString()
  const [loading, setLoading] = useState(false)
  const [shipping, setShipping] = useState<ShippingOption[]>([])
  const [error, setError] = useState<string | null>(null)

  const calculateShipping = useCallback(
    async (e?: React.FormEvent) => {
      e?.preventDefault()
      setLoading(true)
      setError(null)

      try {
        const result = await client.query({
          query: getShippingEstimates,
          variables: {
            country: culture.country,
            postalCode,
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
          const shippingOptions: ShippingOption[] = logisticsInfo[0].slas.map(
            (sla: ShippingSLA) => ({
              name: sla.friendlyName,
              estimated: sla.shippingEstimate,
              cost: sla.price.toString(),
            })
          )

          setShipping(shippingOptions)
        } else {
          setShipping([])
          setError('No se encontró información para el código postal')
        }
      } catch (err) {
        console.error(err)
        setError('Formato de código postal incorrecto')
      } finally {
        setLoading(false)
      }
    },
    [client, postalCode, quantity, skuId]
  )

  return { loading, shipping, error, calculateShipping }
}
