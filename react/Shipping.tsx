import React from 'react'
import ShippingSimulator from './components/ShippingSimulator'

interface ShippingProps { }

const Shipping: StorefrontFunctionComponent<ShippingProps> = ({ }) => {
  return <div><ShippingSimulator></ShippingSimulator></div>
}

Shipping.schema = {
  title: 'editor.shipping.title',
  description: 'editor.shipping.description',
  type: 'object',
  properties: {},
}

export default Shipping
