import React, { Fragment } from 'react'
import TranslateEstimate from 'vtex.shipping-estimate-translator/TranslateEstimate'
import styles from './ShippingCost.css'

interface ShippingOption {
  itemIndex: string;
  slas: SLA[]
}

interface SLA {
  id: string;
  friendlyName: string;
  price: string;
  shippingEstimateDate: string
  shippingEstimate: string
}

interface ShippingCostProps {
  shipping: ShippingOption[] | null;
}

const ShippingCost: React.FC<ShippingCostProps> = ({ shipping }) => {
  if ((shipping?.length ?? 0) === 0 || shipping === null) {
    return <div> No hay información de envío </div>
  }

  return (
    <Fragment>
      <div className={`${styles.shippingContainerCost}`}>
        <div className={`${styles.shippingHeader}`} >
          {!((shipping?.length ?? 0) === 0 || shipping === null) ?
            <table className={`${styles.table}`}>
              <thead>
                <tr>
                  <th>Tipo de envío</th>
                  <th>Tiempo estimado</th>
                  <th>Costo</th>
                </tr>
              </thead>
              <tbody>
                <div className={styles.shippingOptionTitle}>
                  <h2>Punto de retiro</h2>
                </div>
                {shipping?.map((option, index) => (
                  <Fragment key={index}>
                    {option.slas.map((sla, slaIndex) => (
                      <tr key={slaIndex}>
                        <td >{sla.friendlyName}</td>
                        <td > {<TranslateEstimate shippingEstimate={sla.shippingEstimate} />}</td>
                        <td >{sla.price}</td>
                      </tr>
                    ))}
                  </Fragment>
                ))}
              </tbody>
            </table>
            : null}
          <hr className={styles.divider} />
          {!((shipping?.length ?? 0) === 0 || shipping === null) ?
            <table className={`${styles.table}`}>
              <tbody>
                <div className={styles.shippingOptionTitle}>
                  <h2>Envío a domicilio</h2>
                </div>
                {shipping?.map((option, index) => (
                  <Fragment key={index}>
                    {option.slas.map((sla, slaIndex) => (
                      <tr key={slaIndex}>
                        <td >{sla.friendlyName}</td>
                        <td > {<TranslateEstimate shippingEstimate={sla.shippingEstimate} />}</td>
                        <td >{sla.price}</td>
                      </tr>
                    ))}
                  </Fragment>
                ))}
              </tbody>
            </table>
            : null}
        </div>
      </div>
    </Fragment>
  )
}

export default ShippingCost
