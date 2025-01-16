import React, { Fragment, useCallback, useState } from 'react'
import { useIntl } from 'react-intl'
import { Button } from 'vtex.styleguide'
import styles from './shippingSimulator.css' // Importa el archivo CSS
import ShippingCost from './ShippingCost'
import { useApolloClient } from 'react-apollo'
import getShippingEstimates from '../../graphql/queries/getShippingEstimates.gql'
import { useProduct } from 'vtex.product-context'
import { useRuntime } from 'vtex.render-runtime'
import { getDefaultSeller } from '../utils/sellers'

const ShippingSimulator = ({
}) => {
  const { culture } = useRuntime()
  const intl = useIntl()
  const [postalCode] = useState<string>('');
  const productContext = useProduct()
  const [shipping, setShipping] = useState(null)
  const [loading, setLoading] = useState(false)
  const client = useApolloClient()

  const country = culture.country
  const seller = getDefaultSeller(productContext.selectedItem?.sellers)
  const skuId = productContext.selectedItem?.itemId
  const quantity = productContext?.selectedQuantity?.toString()


  // TODO: Implementar la función handleInputChange
  // TODO obtener la query correcta de getShippingEstimates. Dividir shipping cost and pick up points list

  const onCalculateShipping = useCallback(
    e => {
      e && e.preventDefault()
      setLoading(true)
      client
        .query({
          query: getShippingEstimates,
          variables: {
            country: country,
            postalCode: "6600",
            items: [
              {
                quantity: quantity,
                id: skuId,
                seller: seller.sellerId,
              },
            ],
          },
        })
        .then(result => {
          const logisticsInfo = result.data.shipping.logisticsInfo
          if (logisticsInfo) {
            setShipping(logisticsInfo)
          } else {
            setShipping(null)
          }
        })
        .catch(error => {
          console.error(error)
        })
        .finally(() => {
          setLoading(false)
        })
    },
    [client, country, quantity, skuId, seller.sellerId]
  )

  return (
    <Fragment>
      <div className={`${styles.shippingContainer} t-small c-on-base`}>
        {shipping ?
          <ShippingCost shipping={shipping} /> :
          <div >
            <label className={styles.label}>Ingresa el código postal</label>
            <input
              type="text"
              id="postalCode"
              value={postalCode}
              // onChange={handleInputChange}
              placeholder="Código Postal"
              className={styles.input}
            />
            <Button
              onClick={onCalculateShipping}
              className={styles.shippingCTA}
              disabled={!true}
              size="small"
              type="submit"
              block
              isLoading={loading}
            > {intl.formatMessage({ id: 'store/shipping.label' })}</Button>

            <div>
              <a href="#" className={styles.link}>No sé mi código postal</a>
            </div>

          </div>
        }
      </div>
    </Fragment>
  )
}

ShippingSimulator.propTypes = {
}

ShippingSimulator.defaultProps = {
  pricingMode: 'individualItems',
}

export default ShippingSimulator
