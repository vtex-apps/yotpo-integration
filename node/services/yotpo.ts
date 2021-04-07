/* eslint-disable vtex/prefer-early-return */
/* eslint-disable no-console */
/* eslint-disable no-await-in-loop */

import { resolvers } from '../resolvers'

export const yotpo = async (items: any, ctx: Context | StatusChangeContext) => {
  const {
    clients: { yotpo: YotpoClient },
    vtex: { logger },
  } = ctx

  const settings = await resolvers.Query.config(null, null, ctx)
  console.log('settings', settings)

  const { clientId, clientSecret } = settings

  if (!settings.token) {
    const tokenBody = {
      secret: clientSecret,
    }

    const token: any = await YotpoClient.getToken(clientId, tokenBody)
    settings.token = token.access_token
    console.log(token)
    await resolvers.Mutation.saveSettings(null, settings, ctx)
  }

  items.forEach(async (order: any) => {
    const itemBody = {
      purchase: {
        external_order_id: order.orderId,
        order_date: order.orderDate,
        customer: {
          external_id: order.customerId,
          first_name: order.customerFirstName,
          last_name: order.customerLastName,
          email: order.customerEmail,
        },
        line_items: [
          {
            quantity: order.quantity,
            product: {
              external_id: order.productId,
              name: order.productName,
              url: order.productUrl,
            },
          },
        ],
      },
    }

    try {
      await YotpoClient.postOrderInfo(
        settings.token,
        settings.clientId,
        itemBody
      )
      await resolvers.Mutation.updateOrder(null, { id: order.id }, ctx)
    } catch (error) {
      logger.error({
        error,
        message: 'YotpoIntegration-YotpoPostOrderError',
      })
    }
  })
}
