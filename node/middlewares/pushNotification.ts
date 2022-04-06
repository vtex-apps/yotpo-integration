import { json } from 'co-body'
import { resolvers } from '../resolvers'
import { yotpoGetToken } from '../services/yotpo'

interface BroadcasterEvent {
  HasStockKeepingUnitModified: boolean
  IdSku: string
  ProductId: string
}

export async function pushNotification(ctx: Context, next: () => Promise<any>) {
  const {
    vtex: { logger },
    clients: { yotpo },
  } = ctx

  const settings = await yotpoGetToken(ctx)

  const tokenBody = {
    secret: settings.clientSecret,
  }

  const { IdSku, ProductId } = (await json(ctx.req)) as BroadcasterEvent

  const sku = await ctx.clients.catalogGraphQL.sku(IdSku)

  if (!sku?.sku) {
    logger.error(`sku not found - ${IdSku}`)
    return await next()
  }

  logger.info(`skuChanged - ${JSON.stringify({ sku })}`)

  const product = await ctx.clients.catalogGraphQL.product(ProductId)

  if (!product?.product) {
    logger.error(`product not found - ${ProductId}`)
    return await next()
  }

  logger.info(`productChanged - ${JSON.stringify({ product })}`)

  const externalId = [IdSku]

  const productFounded = await yotpo.retrieveProductInfo(settings.token, settings.clientId, { external_ids: externalId })

  if (productFounded.products.length) {
    logger.info(`skuId ${IdSku} already exists`)
    return await next()
  }

  const productPayload = {
    product: {
      external_id: IdSku,
      name: sku.sku.name,
      url: product.product.linkId,
    }
  }

  try {

    const productCreated = await yotpo.postProductInfo(
      settings.token,
      settings.clientId,
      productPayload
    )

    logger.info(`productCreated - ${JSON.stringify({ productCreated })}`)

    ctx.status = 200
  } catch (error) {
    try {
      const token: any = await yotpo.getToken(settings.clientId, tokenBody)
      settings.token = token.access_token
      await resolvers.Mutation.saveSettings(null, settings, ctx)

      const productCreated = await yotpo.postProductInfo(
        settings.token,
        settings.clientId,
        productPayload
      )

      logger.info(`productCreated - ${JSON.stringify({ productCreated })}`)

      ctx.status = 200
    } catch (error) {
      logger.error({
        error,
        message: 'YotpoIntegration-YotpoPostCatalogError',
      })
    }
  } finally {
    await next()
  }
}
