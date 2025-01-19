export interface TimeSplit {
  hours: string
  minutes: string
  seconds: string
}

declare interface Pickup {
  distance: number
  pickupPoint: {
    id: string
    friendlyName: string
    address: {
      neighborhood: string
      street: string
      postalCode: string
      city: string
      number: string
      state: string
    }
  }
}

interface ShippingCostProps {
  shipping: ShippingOption[]
  shippingType: 'PICKUP' | 'SHIPMENT'
}

interface ShippingOption {
  name: string
  estimated: string
  cost: string
}

interface ShippingSLA {
  friendlyName: string
  id: string
  price: number
  shippingEstimate: string
  shippingEstimateDate: string | null
}

interface PickUpOption {
  name: string
  postalCode: string
}

type GenericObject = Record<string, any>
