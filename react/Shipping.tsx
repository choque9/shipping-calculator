import React from 'react'

interface ShippingProps {}

const Shipping: StorefrontFunctionComponent<ShippingProps> = ({}) => {
  return <div>test</div>
}

Shipping.schema = {
  title: 'editor.shipping.title',
  description: 'editor.shipping.description',
  type: 'object',
  properties: {},
}

export default Shipping
