import React, { Fragment } from 'react'
import TranslateEstimate from 'vtex.shipping-estimate-translator/TranslateEstimate'
import { useIntl } from 'react-intl'

import styles from './ShippingCostTable.css'
import { ShippingCostProps, ShippingOption } from '../typings/global'

const ShippingCostTable: React.FC<ShippingCostProps> = ({
  shipping,
  shippingType,
}) => {
  const intl = useIntl()

  if ((shipping?.length ?? 0) === 0 || shipping === null) {
    return (
      <div>
        {' '}
        {intl.formatMessage({ id: 'editor.shipping.table.not-found' })}
      </div>
    )
  }

  return (
    <Fragment>
      <div className={`${styles.shippingContainerCost}`}>
        <div className={`${styles.shippingHeader}`}>
          <table className={`${styles.table}`}>
            <thead>
              <tr>
                <th>
                  {intl.formatMessage({ id: 'editor.shipping.table.type' })}
                </th>
                <th>
                  {intl.formatMessage({
                    id: 'editor.shipping.table.estimated-time',
                  })}{' '}
                </th>
                <th>
                  {intl.formatMessage({ id: 'editor.shipping.table.cost' })}{' '}
                </th>
              </tr>
            </thead>
            <tbody>
              <div className={styles.shippingOptionTitle}>
                <h2>
                  {shippingType === 'PICKUP'
                    ? intl.formatMessage({ id: 'editor.shipping.table.pickup' })
                    : intl.formatMessage({
                        id: 'editor.shipping.table.shipping',
                      })}
                </h2>
              </div>
              {shipping?.map((option: ShippingOption, index: number) => (
                <Fragment key={index}>
                  <tr key={index}>
                    <td className={styles.tableFriendlyName}>{option.name}</td>
                    <td>
                      {' '}
                      {shippingType === 'PICKUP' ? (
                        `${option.estimated} km`
                      ) : (
                        <TranslateEstimate
                          shippingEstimate={option.estimated}
                        />
                      )}
                    </td>
                    <td>${option.cost}</td>
                  </tr>
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
