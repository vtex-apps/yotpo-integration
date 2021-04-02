import React, { FC, useState } from 'react'
import { FormattedMessage, injectIntl, defineMessages } from 'react-intl'
import { compose, graphql, useLazyQuery, useMutation } from 'react-apollo'
import { Layout, PageBlock, PageHeader, Input, Button } from 'vtex.styleguide'

import SAVE_SETTINGS from './queries/saveSettings.gql'
import CONFIG from './queries/config.gql'

import './styles.global.css'

const YotpoAdmin: FC<any> = ({ data: { config }, intl }) => {
  const messages = defineMessages({
    title: {
      id: 'admin/navigation.label',
      defaultMessage: 'Yotpo Integration',
    },
    settingsLabel: {
      id: 'admin/settings.label',
      defaultMessage: 'Settings',
    },
    idLabel: {
      id: 'admin/settings.id.label',
      defaultMessage: 'Client Id',
    },
    secretLabel: {
      id: 'admin/settings.secret.label',
      defaultMessage: 'Client Secret',
    },
    saveLabel: {
      id: 'admin/settings.button.label',
      defaultMessage: 'Save',
    },
  })

  const [state, setState] = useState<any>({
    clientId: '',
    clientSecret: undefined,
  })

  const { clientId, clientSecret } = state

  const [saveSettings, { loading: saveLoading }] = useMutation(SAVE_SETTINGS)

  if (config && clientSecret === undefined) {
    setState({
      ...state,
      clientId: config.clientId,
      clientSecret: config.clientSecret,
    })
  }

  return (
    <Layout
      pageHeader={<PageHeader title={intl.formatMessage(messages.title)} />}
    >
      <PageBlock
        title={intl.formatMessage(messages.settingsLabel)}
        variation="full"
      >
        <div className="mt4">
          <Input
            label={intl.formatMessage(messages.idLabel)}
            value={clientId}
            onChange={(e: any) =>
              setState({ ...state, clientId: e.target.value })
            }
          />
        </div>
        <div className="mt6">
          <Input
            label={intl.formatMessage(messages.secretLabel)}
            value={clientSecret}
            onChange={(e: any) =>
              setState({ ...state, clientSecret: e.target.value })
            }
          />
        </div>
        <div className="mt6">
          <Button
            isLoading={saveLoading}
            onClick={() => {
              saveSettings({
                variables: {
                  clientId,
                  clientSecret,
                },
              })
            }}
          >
            {intl.formatMessage(messages.saveLabel)}
          </Button>
        </div>
      </PageBlock>
    </Layout>
  )
}

export default injectIntl(
  compose(
    graphql(CONFIG, {
      options: { ssr: false },
    })
  )(YotpoAdmin)
)
