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
  const [error, setError] = useState('');

  const handleInputChange = (event: any) => {
    if (/^\d*$/.test(event.target.value)) {
      setPostalCode(event.target.value);
    }
  };

  const handleKeyPress = (event: any) => {
    if (event.key === 'Enter') {
      if (postalCode.length > 0) {
        onCalculateShipping(event)
      }
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
          console.log("hola logisticsInfo called ", logisticsInfo)
          if (logisticsInfo && logisticsInfo.length > 0 && logisticsInfo[0].slas.length > 0) {
            setShipping(logisticsInfo)
          } else {
            setShipping(null)
            setError("No se encontró información para el código postal")
          }
        })
        .catch(error => {
          console.error(error)
          setError("Formato de código postal incorrecto")
        })
        .finally(() => {
          setLoading(false)
        })
    },
    [client, country, quantity, skuId, seller.sellerId, postalCode]
  )

  console.log("Hola shipping", shipping)
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
            <label className={styles.label}>{intl.formatMessage({ id: 'editor.shipping.input-postal-code' })}</label>
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
            {error && <span className={styles.error}>{error}</span>}
            <div className={styles.linkContainer}>
              <a className={styles.link} href="#" >{intl.formatMessage({ id: 'editor.shipping.postal-code-unknown' })} </a>
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
