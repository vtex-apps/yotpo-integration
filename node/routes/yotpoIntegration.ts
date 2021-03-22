/* eslint-disable no-console */
// import { yotpoService } from '../services'

export async function yotpoIntegration(ctx: Context) {
  const { response } = ctx
  // verify request

  const appId = process.env.VTEX_APP_ID
  const settings = appId
    ? ((await ctx.clients.apps.getAppSettings(appId)) as AppSettings)
    : null

  if (!settings?.carriers) {
    console.log('no settings config')
    return null
  }

  response.set('Cache-Control', 'no-cache')
  response.status = 200
  return response
}
