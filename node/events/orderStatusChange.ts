/* eslint-disable no-console */
import { resolvers } from '../resolvers'
import { yotpo } from '../services/yotpo'

export async function orderStatusChange(ctx: StatusChangeContext) {
  const {
    body,
    clients: { oms },
    vtex: { logger },
  } = ctx

  if (body.domain === 'Marketplace') {
    return
  }

  let order: any
  try {
    order = await oms.getOrder(body.orderId)
  } catch (error) {
    logger.error({
      error,
      message: 'YotpoIntegration-GetOrderError',
    })
  }

  if (!order) {
    return
  }

  const items: any = []

  order.items.forEach(async (item: any) => {
    const data = {
      orderId: order.orderId,
      posted: false,
      orderDate: order.creationDate,
      customerId: order.clientProfileData.userProfileId,
      customerFirstName: order.clientProfileData.firstName,
      customerLastName: order.clientProfileData.lastName,
      customerEmail: order.clientProfileData.email,
      quantity: item.quantity,
      productId: item.productId,
      productName: item.name,
      productUrl: item.detailUrl,
    }

    items.push(data)
    try {
      await resolvers.Mutation.addOrder(null, data, ctx)
    } catch (error) {
      logger.error({
        error,
        message: 'YotpoIntegration-OrderStatusChangeError',
      })
    }
  })

  await yotpo(items, ctx)
}
