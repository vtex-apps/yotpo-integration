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

  const order = await oms.getOrder(body.orderId)
  console.log('event order =>', order)

  if (!order) {
    return
  }

  const data = {
    orderId: body.orderId,
    posted: false,
  }

  try {
    await resolvers.Mutation.addOrder(null, data, ctx)
  } catch (error) {
    console.log(error)
  }
}
