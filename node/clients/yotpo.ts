import { ExternalClient, InstanceOptions, IOContext } from '@vtex/api'

export default class YotpoClient extends ExternalClient {
  constructor(context: IOContext, options?: InstanceOptions) {
    super('http://api.yotpo.com', context, {
      ...options,
      headers: {
        'X-Vtex-Use-Https': 'true',
        'Proxy-Authorization': context.authToken,
      },
    })
  }

  public async postOrderInfo(token: string, storeId: string): Promise<string> {
    return this.http.post(`/v3/stores/${storeId}/register_purchase`, {
      headers: {
        token,
      },
    })
  }
}
