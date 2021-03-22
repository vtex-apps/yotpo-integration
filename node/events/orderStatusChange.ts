/* eslint-disable no-console */
// import { resolvers } from '../resolvers'

export async function orderStatusChange(ctx: StatusChangeContext) {
  const {
    body,
    clients: { oms },
    // eslint-disable-next-line no-empty-pattern
    vtex: {},
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

  const { packages } = order.packageAttachment || []

  console.log('packages', packages)

  const shipments: never[] = []
  for (const shipment of packages) {
    // eslint-disable-next-line no-await-in-loop

    const data = {
      trackingNumber: shipment.trackingNumber,
      delivered: false,
      orderId: order.orderId,
      invoiceId: shipment.invoiceNumber,
    }

    console.log('addShipment data', data)

    // shipments.push(resolvers.Mutation.addShipment(null, data, ctx))
  }

  console.log(shipments)

  try {
    const result = await Promise.all(shipments)
    console.log('promise result', result)
  } catch (err) {
    console.log('error =>', err)
  }
}
