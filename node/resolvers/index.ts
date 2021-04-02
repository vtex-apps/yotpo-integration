/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Apps } from '@vtex/api'

const getAppId = (): string => {
  return process.env.VTEX_APP_ID ?? ''
}

const SCHEMA_VERSION = 'v0.3'

const schemaOrders = {
  properties: {
    orderId: {
      type: 'string',
      title: 'Order ID',
    },
    posted: {
      type: 'boolean',
      title: 'Post Status',
    },
    orderDate: {
      type: 'string',
      title: 'Order Date',
    },
    customerId: {
      type: 'string',
      title: 'Customer ID',
    },
    customerFirstName: {
      type: 'string',
      title: 'Customer First Name',
    },
    customerLastName: {
      type: 'string',
      title: 'Customer Last Name',
    },
    customerEmail: {
      type: 'string',
      title: 'Customer Email',
    },
    quantity: {
      type: 'integer',
      title: 'Number of items',
    },
    productId: {
      type: 'string',
      title: 'Product ID',
    },
    productName: {
      type: 'string',
      title: 'Product Name',
    },
    productUrl: {
      type: 'string',
      title: 'Product URL',
    },
  },
  'v-indexed': ['orderId', 'posted'],
  'v-cache': false,
}

const routes = {
  baseUrl: (account: string) =>
    `http://${account}.vtexcommercestable.com.br/api`,

  yotpoOrderEntity: (account: string) =>
    `${routes.baseUrl(account)}/dataentities/yotpoOrder`,

  saveSchemaOrder: (account: string) =>
    `${routes.yotpoOrderEntity(account)}/schemas/${SCHEMA_VERSION}`,
}

const defaultHeaders = (authToken: string) => ({
  'Content-Type': 'application/json',
  Accept: 'application/vnd.vtex.ds.v10+json',
  VtexIdclientAutCookie: authToken,
  'Proxy-Authorization': authToken,
})

export const resolvers = {
  Query: {
    config: async (_: any, __: any, ctx: any) => {
      const {
        vtex: { account, authToken },
        clients: { hub },
      } = ctx

      const apps = new Apps(ctx.vtex)
      const app: string = getAppId()
      let settings = await apps.getAppSettings(app)
      const defaultSettings = {
        schema: false,
        schemaVersion: null,
        title: 'Yotpo Integration',
        clientId: '',
        clientSecret: '',
        token: '',
      }

      if (!settings.title) {
        settings = defaultSettings
      }

      let schemaError = false

      if (!settings.schema || settings.schemaVersion !== SCHEMA_VERSION) {
        try {
          const url = routes.saveSchemaOrder(account)
          const headers = defaultHeaders(authToken)

          await hub.put(url, schemaOrders, headers)
        } catch (e) {
          if (e.response.status >= 400) {
            console.log(e.response)
            schemaError = true
          }
        }

        settings.schema = !schemaError
        settings.schemaVersion = !schemaError ? SCHEMA_VERSION : null

        await apps.saveAppSettings(app, settings)
      }

      return settings
    },
    getOrders: async (_: any, __: any, ctx: Context) => {
      const {
        clients: { masterdata },
      } = ctx

      const result = await masterdata.searchDocuments({
        dataEntity: 'yotpoOrder',
        fields: [
          'id',
          'orderId',
          'posted',
          'orderId',
          'posted',
          'orderDate',
          'customerId',
          'customerFirstName',
          'customerLastName',
          'customerEmail',
          'quantity',
          'productId',
          'productName',
          'productUrl',
        ],
        where: `posted=${false}`,
        pagination: {
          page: 1,
          pageSize: 99,
        },
        schema: SCHEMA_VERSION,
      })

      return result
    },
  },
  Mutation: {
    saveSettings: async (_: any, args: any, ctx: Context) => {
      const {
        // eslint-disable-next-line no-empty-pattern
        clients: {},
      } = ctx

      const apps = new Apps(ctx.vtex)
      const app: string = getAppId()
      const settings = {
        schema: null,
        // schemaVersion: SCHEMA_VERSION,
        title: 'Yotpo Integration',
        clientId: args.clientId,
        clientSecret: args.clientSecret,
        token: args.token,
      }

      await apps.saveAppSettings(app, settings)

      return true
    },
    addOrder: async (_: any, args: any, ctx: Context | StatusChangeContext) => {
      const {
        clients: { masterdata },
      } = ctx

      return masterdata
        .createDocument({
          dataEntity: 'yotpoOrder',
          fields: args,
          schema: SCHEMA_VERSION,
        })
        .then((res: any) => {
          return res.DocumentId
        })
        .catch((err: any) => {
          return err.response.message
        })
    },
    updateOrder: async (
      _: any,
      args: any,
      ctx: Context | StatusChangeContext
    ) => {
      const {
        clients: { masterdata, hub },
        vtex: { account, authToken },
      } = ctx

      const order: any = await masterdata.getDocument({
        dataEntity: 'yotpoOrder',
        id: args.id,
        fields: ['id', 'orderId', 'posted'],
      })

      const posted = !order.posted
      const headers = defaultHeaders(authToken)
      await hub
        .patch(
          `http://api.vtex.com/api/dataentities/yotpoOrder/documents/${args.id}?an=${account}&_schema=${SCHEMA_VERSION}`,
          {
            posted,
          },
          headers
        )
        .then(() => {
          return posted
        })

      return args.id
    },
  },
}
