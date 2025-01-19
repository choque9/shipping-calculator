import React, { Fragment, useCallback, useState } from 'react'
import { useIntl } from 'react-intl'
import { Button } from 'vtex.styleguide'
import { useApolloClient } from 'react-apollo'
import { useProduct } from 'vtex.product-context'
import { useRuntime } from 'vtex.render-runtime'

import getShippingEstimates from '../../graphql/queries/getShippingEstimates.gql'
import styles from './shippingSimulator.css'
import { getDefaultSeller } from '../utils/sellers'
import ShippingCostTable from './ShippingCostTable'
import { getPickups } from '../client'
import { ShippingOption, ShippingSLA } from '../typings/global'

const ShippingSimulator = () => {
  const { culture } = useRuntime()
  const intl = useIntl()
  const [postalCode, setPostalCode] = useState('')
  const productContext = useProduct()
  const [shipping, setShipping] = useState<ShippingOption[]>([])
  const [pickups, setPickups] = useState<ShippingOption[]>([])
  const [loading, setLoading] = useState(false)
  const client = useApolloClient()

  const { country } = culture
  const seller = getDefaultSeller(productContext?.selectedItem?.sellers)
  const skuId = productContext?.selectedItem?.itemId
  const quantity = productContext?.selectedQuantity?.toString()
  const [error, setError] = useState('')

  const handleInputChange = (event: any) => {
    if (/^\d*$/.test(event.target.value)) {
      setPostalCode(event.target.value)
    }
  }

  const fetchPickups = useCallback(async () => {
    const responsePickups = await getPickups(
      country,
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

    setLoading(false)
  }, [postalCode])

  const onCalculateShipping = useCallback(
    e => {
      e?.preventDefault()
      setLoading(true)

      client
        .query({
          query: getShippingEstimates,
          variables: {
            country,
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
        .then(result => {
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
        })

        .catch(_e => {
          console.error(error)
          setError('Formato de código postal incorrecto')
        })
        .finally(() => {
          setLoading(false)
        })

      fetchPickups()
    },
    [client, country, quantity, skuId, seller.sellerId, postalCode]
  )

  const handleKeyPress = (event: any) => {
    if (event.key === 'Enter') {
      if (postalCode.length > 0) {
        onCalculateShipping(event)
      }
    }
  }

  return (
    <Fragment>
      <div className={`${styles.shippingContainer} t-small c-on-base`}>
        {shipping.length ? (
          <div className={`${styles.shippingSubContainer}`}>
            <ShippingCostTable shipping={shipping} shippingType="SHIPMENT" />
            <hr className={styles.divider} />
            <ShippingCostTable shipping={pickups} shippingType="PICKUP" />
          </div>
        ) : (
          <div>
            <label className={styles.label}>
              {intl.formatMessage({ id: 'editor.shipping.input-postal-code' })}
            </label>
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
              >
                {' '}
                {intl.formatMessage({ id: 'store/shipping.label' })}
              </Button>
            </div>
            {error && <span className={styles.error}>{error}</span>}
            <div className={styles.linkContainer}>
              <a className={styles.link} href="#">
                {intl.formatMessage({
                  id: 'editor.shipping.postal-code-unknown',
                })}{' '}
              </a>
            </div>
          </div>
        )}
      </div>
    </Fragment>
  )
}

ShippingSimulator.propTypes = {}

ShippingSimulator.defaultProps = {
  pricingMode: 'individualItems',
}

export default ShippingSimulator
