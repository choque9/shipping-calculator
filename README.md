# Custom Shipping Calculator

## Description

This project implements a custom shipping calculator that is triggered from the "Calculate shipping cost" link on the product page. When the link is clicked, the user will be prompted to enter their postal code, and the available shipping options will be displayed, first for home delivery and then for in-store pickup, including their time and cost.

## Features

- Prompts the user for their postal code.
- Displays home delivery shipping options with estimated time and cost.
- Displays in-store pickup options with estimated time and cost.
- User-friendly error messages for incorrect postal codes.

## Usage

1. vtex link on a development workspace 

5. Inlude interfaces on VTEX IO store

 ```bash
    {
    "shipping-header": {
        "component": "ShippingHeader"
    },
    "shipping": {
        "component": "Shipping"
    }
```

