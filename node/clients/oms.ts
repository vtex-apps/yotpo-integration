import { ExternalClient, InstanceOptions, IOContext } from '@vtex/api'

const FOUR_SECONDS = 4 * 1000

export default class OMSClient extends ExternalClient {
  constructor(context: IOContext, options?: InstanceOptions) {
    super(`http://${context.account}.vtexcommercestable.com.br`, context, {
      ...options,
      headers: {
        ...options?.headers,
        VtexIdclientAutCookie: context.authToken,
      },
      timeout: FOUR_SECONDS,
    })
  }

  public async getOrder(orderId: string): Promise<OMSOrder> {
    return this.http.get(`/api/oms/pvt/orders/${orderId}`, {
      metric: 'order-get',
    })
  }
}
