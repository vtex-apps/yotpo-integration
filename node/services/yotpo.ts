/* eslint-disable vtex/prefer-early-return */
/* eslint-disable no-console */
/* eslint-disable no-await-in-loop */

import { resolvers } from '../resolvers'

interface YotpoSettings {
  schema: boolean
  title: string
  clientId: string
  clientSecret: string
  token: string
  schemaVersion: string
}

export const yotpoGetToken = async (
  ctx: Context | StatusChangeContext
): Promise<YotpoSettings> => {
  const {
    clients: { yotpo: YotpoClient },
  } = ctx

  const settings = await resolvers.Query.config(null, null, ctx)

  const { clientId, clientSecret } = settings
  const tokenBody = {
    secret: clientSecret,
  }

  if (!settings.token) {
    const token: any = await YotpoClient.getToken(clientId, tokenBody)
    settings.token = token.access_token
    await resolvers.Mutation.saveSettings(null, settings, ctx)
  }

  return settings
}

export const yotpo = async (items: any, ctx: Context | StatusChangeContext) => {
  const {
    clients: { yotpo: YotpoClient },
    vtex: { logger },
  } = ctx

  const settings = await yotpoGetToken(ctx)

  const { clientId, clientSecret } = settings

  const tokenBody = {
    secret: clientSecret,
  }

  items.forEach(async (order: any) => {
    const date = new Date(order.orderDate)
    const dateString = date.toISOString()

    const itemBody = {
      purchase: {
        external_order_id: order.orderId,
        order_date: dateString,
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
    } catch {
      try {
        const token: any = await YotpoClient.getToken(clientId, tokenBody)
        settings.token = token.access_token
        await resolvers.Mutation.saveSettings(null, settings, ctx)

        await YotpoClient.postOrderInfo(
          settings.token,
          settings.clientId,
          itemBody
        )
      } catch (error) {
        logger.error({
          error,
          message: 'YotpoIntegration-YotpoPostOrderError',
        })
      }
    }
  })
}
