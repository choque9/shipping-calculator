import React, { Fragment, useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import { Button } from 'vtex.styleguide'

import styles from './shippingSimulator.css'
import ShippingCostTable from './ShippingCostTable'
import { useFetchPickups } from './hooks/useFechPickUpPoints'
import { useCalculateShipping } from './hooks/useCalculateShipping'
import { useFetchShippingFromPickups } from './hooks/useFetchShippingFromPickups'

const ShippingSimulator = () => {
  const intl = useIntl()
  const [postalCode, setPostalCode] = useState('')
  const { loading, shipping, error, calculateShipping } = useCalculateShipping(
    postalCode
  )
  const { pickups, fetchPickups } = useFetchPickups(postalCode)
  const {
    shippingFromPickups,
    shippingFromPickupCall,
  } = useFetchShippingFromPickups()

  const handleInputChange = (event: any) => {
    if (/^\d*$/.test(event.target.value)) {
      setPostalCode(event.target.value)
    }
  }

  const handleKeyPress = (event: any) => {
    if (event.key === 'Enter') {
      if (postalCode.length > 0) {
        calculateShipping()
      }
    }
  }

  const handleCLick = (_event: any) => {
    if (postalCode.length > 0) {
      calculateShipping()
    }
  }

  useEffect(() => {
    fetchPickups()
  }, [shipping])

  useEffect(() => {
    shippingFromPickupCall(pickups)
  }, [pickups])

  return (
    <Fragment>
      <div className={`${styles.shippingContainer} t-small c-on-base`}>
        {shipping.length ? (
          <div className={`${styles.shippingSubContainer}`}>
            <ShippingCostTable shipping={shipping} shippingType="SHIPMENT" />
            <hr className={styles.divider} />
            <ShippingCostTable
              shipping={shippingFromPickups}
              shippingType="PICKUP"
            />
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
                onClick={handleCLick}
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
