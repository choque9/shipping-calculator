import React, { Fragment } from 'react'
import styles from './components/shippingSimulator.css'


const ShippingHeader = ({
}) => {

  return (
    <Fragment>
      <div className={styles.shippingHeaderContainer}>
        <h2>Calcular el costo de envío</h2>
      </div>
    </Fragment>
  )
}

ShippingHeader.propTypes = {
}

export default ShippingHeader
