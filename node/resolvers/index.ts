/* eslint-disable @typescript-eslint/no-explicit-any */
import { Apps } from '@vtex/api'

const getAppId = (): string => {
  return process.env.VTEX_APP_ID ?? ''
}

export const resolvers = {
  Query: {
    config: async (_: any, __: any, ctx: any) => {
      // const {
      //   vtex: { account, authToken },
      //   clients: { hub },
      // } = ctx

      const apps = new Apps(ctx.vtex)
      const app: string = getAppId()
      let settings = await apps.getAppSettings(app)
      const defaultSettings = {
        schema: false,
        schemaVersion: null,
        title: 'Yotpo Integration',
        clientId: '',
        clientSecret: '',
        storeId: '',
      }

      if (!settings.title) {
        settings = defaultSettings
      }

      // let schemaError = false

      // if (!settings.schema || settings.schemaVersion !== SCHEMA_VERSION) {
      //   try {
      //     const url = routes.saveSchemaShipment(account)
      //     const headers = defaultHeaders(authToken)

      //     await hub.put(url, schemaShipments, headers)
      //   } catch (e) {
      //     if (e.response.status >= 400) {
      //       console.log(e.response)
      //       schemaError = true
      //     }
      //   }

      //   if (!schemaError) {
      //     try {
      //       const url = routes.saveSchemaInteraction(account)
      //       const headers = defaultHeaders(authToken)

      //       await hub.put(url, schemaInteractions, headers)
      //     } catch (e) {
      //       if (e.response.status >= 400) {
      //         schemaError = true
      //       }
      //     }
      //   }

      //   settings.schema = !schemaError
      //   settings.schemaVersion = !schemaError ? SCHEMA_VERSION : null

      //   await apps.saveAppSettings(app, settings)
      // }

      return settings
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
        storeId: args.storeId,
      }

      await apps.saveAppSettings(app, settings)

      return true
    },
  },
}
