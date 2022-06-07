/* eslint-disable @typescript-eslint/no-explicit-any */

const getAppId = (): string => {
  return process.env.VTEX_APP_ID ?? ''
}

export const resolvers = {
  Query: {
    config: async (_: any, __: any, ctx: any) => {
      const {
        clients: { apps },
      } = ctx

      const app: string = getAppId()

      const defaultSettings = {
        schema: false,
        schemaVersion: null,
        title: 'Yotpo Integration',
        clientId: '',
        clientSecret: '',
        token: '',
      }

      let settings = await apps.getAppSettings(app)

      if (!settings.title) {
        settings = defaultSettings
      }

      return settings
    },
    authentication: async (
      _: any,
      args: { clientId: string; clientSecret: string },
      ctx: any
    ) => {
      const {
        clients: { yotpo: YotpoClient },
      } = ctx

      const tokenBody = {
        secret: args.clientSecret,
      }
      try {
        const token: any = await YotpoClient.getToken(args.clientId, tokenBody)

        if (token.access_token === undefined) {
          return false
        }
      } catch {
        return false
      }

      return true
    },
  },
  Mutation: {
    saveSettings: async (
      _: any,
      args: any,
      ctx: Context | StatusChangeContext
    ) => {
      const {
        clients: { apps },
      } = ctx

      const app: string = getAppId()
      const settings = {
        schema: null,
        title: 'Yotpo Integration',
        clientId: args.clientId,
        clientSecret: args.clientSecret,
        token: args.token,
      }

      await apps.saveAppSettings(app, settings)

      return true
    },
  },
}
