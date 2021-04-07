/* eslint-disable no-console */
import { yotpoService } from '../services'

export async function yotpoIntegration(ctx: Context) {
  const { response } = ctx
  // verify request

  yotpoService.yotpo([], ctx)

  response.set('Cache-Control', 'no-cache')
  response.status = 200
  return response
}
