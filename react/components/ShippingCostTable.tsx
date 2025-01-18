import React, { Fragment } from 'react'
import TranslateEstimate from 'vtex.shipping-estimate-translator/TranslateEstimate'
import styles from './ShippingCostTable.css'

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
  shippingType: "PICKUP" | "SHIPMENT"
}

const ShippingCostTable: React.FC<ShippingCostProps> = ({ shipping, shippingType }) => {
  if ((shipping?.length ?? 0) === 0 || shipping === null) {
    return <div> No hay información de envío </div>
  }

  return (
    <Fragment>
      <div className={`${styles.shippingContainerCost}`}>
        <div className={`${styles.shippingHeader}`} >

          <table className={`${styles.table}`}>
            <thead>
              <tr>
                <th>TIPO DE ENVÍO</th>
                <th>TIEMPO ESTIMADO</th>
                <th>COSTO</th>
              </tr>
            </thead>
            <tbody>
              <div className={styles.shippingOptionTitle}>
                <h2>{ shippingType ===  "PICKUP" ? "Punto de retiro" : "Envío a domicilio "}</h2>
              </div>
              {shipping?.map((option, index) => (
                <Fragment key={index}>
                  {option.slas.map((sla, slaIndex) => (
                    <tr key={slaIndex}>
                      <td className={styles.tableFriendlyName}>{sla.friendlyName}</td>
                      <td > {<TranslateEstimate shippingEstimate={sla.shippingEstimate} />}</td>
                      <td >${sla.price}</td>
                    </tr>
                  ))}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Fragment>
  )
}

export default ShippingCostTable
