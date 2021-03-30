/* eslint-disable vtex/prefer-early-return */
/* eslint-disable no-console */
/* eslint-disable no-await-in-loop */

import { resolvers } from '../resolvers'

export const yotpo = async (ctx: Context) => {
  const {
    // eslint-disable-next-line no-empty-pattern
    clients: { yotpo: YotpoClient, oms },
  } = ctx

  const settings = await resolvers.Query.config(null, null, ctx)
  console.log('settings', settings)

  // const { clientId, clientSecret } = settings

  // if (!settings.token) {
  //   const tokenBody = JSON.stringify({
  //     secret: clientSecret,
  //   })

  // const token = await YotpoClient.getToken(clientId, tokenBody)
  //   settings.token = token
  //   await resolvers.Mutation.saveSettings(null, settings, ctx)
  // }

  const orders: any = await resolvers.Query.getOrders(null, null, ctx)
  console.log('orders', orders)

  orders.forEach(async (order: any) => {
    const orderInfo = await oms.getOrder(order.orderId)
    console.log('order info', orderInfo)

    const orderBody = JSON.stringify({
      purchase: {
        external_order_id: 'string',
        order_date: '2021-03-25T13:57:05Z',
        checkout_token: 'string',
        payment_method: 'string',
        currency: 'string',
        total_price: 20,
        subtotal_price: 10,
        landing_site_url: 'string',
        payment_status: 'string',
        cancellation: {
          cancellation_date: '2021-03-28T13:35:57Z',
        },
        customer: {
          external_id: '2sadfasdf',
          first_name: 'string',
          last_name: 'string',
          email: 'string',
          phone_number: 'string',
          custom_properties: {
            key1: 'value1',
            key2: 'value2',
          },
          accepts_sms_marketing: true,
          accepts_email_marketing: true,
        },
        billing_address: {
          address1: 'string',
          address2: 'string',
          city: 'string',
          company: 'string',
          state: 'string',
          zip: 'string',
          province_code: 'string',
          country_code: 'string',
          phone_number: 'string',
        },
        shipping_address: {
          address1: 'string',
          address2: 'string',
          city: 'string',
          company: 'string',
          state: 'string',
          zip: 'string',
          province_code: 'string',
          country_code: 'string',
          phone_number: 'string',
        },
        line_items: [
          {
            quantity: 0,
            total_price: 0,
            subtotal_price: 0,
            coupon_code: 'string',
            custom_properties: {
              key1: 'value1',
              key2: 'value2',
            },
            product: {
              external_id: 'string',
              name: 'string',
              description: 'string',
              url: 'string',
              price: 0,
              currency: 'string',
              inventory_quantity: 0,
              is_discontinued: true,
              group_name: 'string',
              image_url: 'string',
              mpn: 'string',
              brand: 'string',
              sku: 'string',
              gtins: [
                {
                  declared_type: 'string',
                  value: 'string',
                },
              ],
            },
          },
        ],
        fulfillments: [
          {
            external_id: 'string',
            fulfillment_date: '2021-03-31T11:58:51Z',
            status: 'pending',
            shipment_info: {
              shipment_status: 'label_printed',
              tracking_company: 'string',
              tracking_url: 'string',
              tracking_number: 'string',
            },
            fulfilled_items: [
              {
                external_product_id: 'string',
                quantity: 0,
              },
            ],
          },
        ],
      },
    })

    try {
      await YotpoClient.postOrderInfo(
        settings.token,
        settings.clientId,
        orderBody
      )

      // UPDATE ORDER
    } catch (error) {
      console.log(error)
    }
  })

  // check if settings has a token
  // if not, generate token
  // Query orders
  // iterate through orders, get data from oms, and send data
}
