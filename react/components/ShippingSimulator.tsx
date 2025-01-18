import React, { Fragment, useCallback, useState } from 'react'
import { useIntl } from 'react-intl'
import { Button } from 'vtex.styleguide'
import styles from './shippingSimulator.css'
import { useApolloClient } from 'react-apollo'
import getShippingEstimates from '../../graphql/queries/getShippingEstimates.gql'
import { useProduct } from 'vtex.product-context'
import { useRuntime } from 'vtex.render-runtime'
import { getDefaultSeller } from '../utils/sellers'
import ShippingCostTable from './ShippingCostTable'

const ShippingSimulator = ({
}) => {
  const { culture } = useRuntime()
  const intl = useIntl()
  const [postalCode, setPostalCode] = useState('');
  const productContext = useProduct()
  const [shipping, setShipping] = useState(null)
  const [loading, setLoading] = useState(false)
  const client = useApolloClient()

  const country = culture.country
  const seller = getDefaultSeller(productContext.selectedItem?.sellers)
  const skuId = productContext.selectedItem?.itemId
  const quantity = productContext?.selectedQuantity?.toString()

  const handleInputChange = (event: any) => {
    if (/^\d*$/.test(event.target.value)) {
      setPostalCode(event.target.value);
    }
  };

  const handleKeyPress = (event: any) => {
    if (event.key === 'Enter') {
      onCalculateShipping(event)
    }
  };

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
            postalCode: postalCode,
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
    [client, country, quantity, skuId, seller.sellerId, postalCode]
  )

  return (
    <Fragment>
      <div className={`${styles.shippingContainer} t-small c-on-base`}>
        {shipping ?
          <div className={`${styles.shippingSubContainer}`}>
            <ShippingCostTable shipping={shipping} shippingType='SHIPMENT' />
            <hr className={styles.divider} />
            <ShippingCostTable shipping={shipping} shippingType='PICKUP' />
          </div> :
          <div >
            <label className={styles.label}>Ingresa el código postal</label>
            <div className={`${styles.shippingInput}`}>
              <input
                type="text"
                id="postalCode"
                value={postalCode}
                onChange={handleInputChange}
                placeholder="Código Postal"
                className={styles.input}
                onKeyPress={handleKeyPress}
              />
              <Button
                onClick={onCalculateShipping}
                disabled={!true}
                size="small"
                type="submit"
                block
                isLoading={loading}
              > {intl.formatMessage({ id: 'store/shipping.label' })}</Button>
            </div>
            <div className={styles.linkContainer}>
              <a className={styles.link} href="#" >No sé mi código postal</a>
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
