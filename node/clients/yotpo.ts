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

  public async getToken(clientId: string, body: any): Promise<string> {
    return this.http.post(`/core/v3/stores/${clientId}/access_tokens`, body)
  }

  public async postOrderInfo(
    token: string,
    clientId: string,
    body: any
  ): Promise<string> {
    return this.http.post(
      `/core/v3/stores/${clientId}/register_purchase`,
      body,
      {
        headers: { token },
      }
    )
  }
}
