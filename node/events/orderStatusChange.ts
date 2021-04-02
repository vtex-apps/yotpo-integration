/* eslint-disable no-console */
import { resolvers } from '../resolvers'

export async function orderStatusChange(ctx: StatusChangeContext) {
  const {
    body,
    clients: { oms },
  } = ctx

  console.log('event', body)

  if (body.domain === 'Marketplace') {
    return
  }

  let order: any
  try {
    order = await oms.getOrder(body.orderId)
  } catch (error) {
    console.log(error)
  }

  if (!order) {
    return
  }

  console.log('event order =>', order)

  order.items.forEach(async (item: any) => {
    console.log('item =>', item)
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

    try {
      await resolvers.Mutation.addOrder(null, data, ctx)
    } catch (error) {
      console.log(error)
    }
  })
}
