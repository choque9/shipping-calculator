import React, { Fragment } from 'react'
import TranslateEstimate from 'vtex.shipping-estimate-translator/TranslateEstimate'
import styles from './ShippingCostTable.css'
import { useIntl } from 'react-intl'

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

  const intl = useIntl()

  if ((shipping?.length ?? 0) === 0 || shipping === null) {
    return <div> {intl.formatMessage({ id: 'editor.shipping.table.not-found' })}</div>
  }

  return (
    <Fragment>
      <div className={`${styles.shippingContainerCost}`}>
        <div className={`${styles.shippingHeader}`} >

          <table className={`${styles.table}`}>
            <thead>
              <tr>
                <th>{intl.formatMessage({ id: 'editor.shipping.table.type' })}</th>
                <th>{intl.formatMessage({ id: 'editor.shipping.table.estimated-time' })} </th>
                <th>{intl.formatMessage({ id: 'editor.shipping.table.cost' })} </th>
              </tr>
            </thead>
            <tbody>
              <div className={styles.shippingOptionTitle}>
                <h2>{shippingType === "PICKUP" ? intl.formatMessage({ id: 'editor.shipping.table.pickup' }) :  intl.formatMessage({ id: 'editor.shipping.table.shipping' }) }</h2>
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
