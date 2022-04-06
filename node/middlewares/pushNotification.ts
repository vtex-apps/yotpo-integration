import { json } from 'co-body'

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

  try {
    const clientSecret = 'Si4D6GMsnKxwEIGg1wFTz0SOcevGOah447wDma4i'

    const clientId = 'BrX1unQh1gDws6jweVbgG3dnAaMFiBVhghwjlPxo'

    const tokenBody = {
      secret: clientSecret,
    }

    const token: any = await yotpo.getToken(clientId, tokenBody)

    console.log({ token })

    const { IdSku, ProductId } = (await json(ctx.req)) as BroadcasterEvent

    const sku = await ctx.clients.catalogGraphQL.sku(IdSku)

    if (!sku?.sku) {
      console.error(`sku not found - ${IdSku}`)
      logger.error(`sku not found - ${IdSku}`)
      return await next()
    }

    console.log({ sku })
    logger.info(`skuChanged - ${JSON.stringify({ sku })}`)

    const product = await ctx.clients.catalogGraphQL.product(ProductId)

    if (!product?.product) {
      console.error(`product not found - ${ProductId}`)
      logger.error(`product not found - ${ProductId}`)
      return await next()
    }

    console.log({ product })
    logger.info(`productChanged - ${JSON.stringify({ product })}`)

    const productPayload = {
      external_id: IdSku,
      name: sku.sku.name,
      url: product.product.linkId,
    }

    console.log({ productPayload })

    const productCreated = await yotpo.postProductInfo(
      token.access_token,
      clientId,
      productPayload
    )

    console.log({ productCreated })
    logger.info(`productCreated - ${JSON.stringify({ productCreated })}`)

    ctx.status = 200
  } catch (error) {
    console.log({
      error,
      errorMessage: error.message,
      errorResponse: error.response?.data,
    })
    logger.error({
      errorMessage: error.message,
      errorResponse: error.response?.data,
    })
    throw new Error(error.message)
  } finally {
    next()
  }
}
