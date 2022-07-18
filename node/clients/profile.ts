import type { InstanceOptions, IOContext } from '@vtex/api'
import { JanusClient } from '@vtex/api'

const FOUR_SECONDS = 4 * 1000

export default class ProfileClient extends JanusClient {
  constructor(context: IOContext, options?: InstanceOptions) {
    super(context, {
      ...options,
      headers: {
        ...options?.headers,
        VtexIdclientAutCookie: context.authToken,
      },
      timeout: FOUR_SECONDS,
    })
  }

  public async getProfileInfo(userProfileId: string) {
    return this.http.get(
      `/api/profile-system/pvt/profiles/${userProfileId}/personalData`,
      {
        metric: 'profile-system-getProfileInfo',
      }
    )
  }
}
