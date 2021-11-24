import React, { FC, useState } from 'react'
import { FormattedMessage, injectIntl, defineMessages } from 'react-intl'
import { compose, graphql, useLazyQuery, useMutation } from 'react-apollo'
import {
  Layout,
  PageBlock,
  PageHeader,
  Input,
  Button,
  Alert,
} from 'vtex.styleguide'

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
    saveSuccess: {
      id: 'admin/settings.save.success',
      defaultMessage: 'Settings saved',
    },
    saveError: {
      id: 'admin/settings.save.error',
      defaultMessage: 'Error saving',
    },
  })

  const [state, setState] = useState<any>({
    clientId: '',
    clientSecret: undefined,
    saveSuccess: false,
    saveError: false,
  })

  const { clientId, clientSecret, saveSuccess, saveError } = state

  const [saveSettings, { loading: saveLoading }] = useMutation(SAVE_SETTINGS)

  if (config && clientSecret === undefined) {
    setState({
      ...state,
      clientId: config.clientId,
      clientSecret: config.clientSecret,
    })
  }

  const handleSave = () => {
    try {
      saveSettings({
        variables: {
          clientId,
          clientSecret,
        },
      })
    } catch {
      setState({
        ...state,
        saveError: true,
      })
    } finally {
      setState({
        ...state,
        saveSuccess: true,
      })
    }
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
              handleSave()
            }}
          >
            {intl.formatMessage(messages.saveLabel)}
          </Button>

          {saveSuccess && (
            <div className="mt5">
              <Alert
                autoClose={5000}
                type="success"
                onClose={() => setState({ ...state, saveSuccess: false })}
              >
                {intl.formatMessage(messages.saveSuccess)}
              </Alert>
            </div>
          )}

          {saveError && (
            <div className="mt5">
              <Alert
                autoClose={5000}
                type="error"
                onClose={() => setState({ ...state, saveError: false })}
              >
                {intl.formatMessage(messages.saveError)}
              </Alert>
            </div>
          )}
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
