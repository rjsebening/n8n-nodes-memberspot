import { ICredentialType, INodeProperties, IAuthenticate, ICredentialTestRequest } from 'n8n-workflow';

export class MemberspotApi implements ICredentialType {
  name = 'memberspotApi';
  displayName = 'Memberspot API';
  documentationUrl = 'https://api.memberspot.de/api';

  properties: INodeProperties[] = [
    {
      displayName: 'API Key',
      name: 'apiKey',
      type: 'string',
      typeOptions: { password: true },
      required: true,
      default: '',
      description: 'API key provided by Memberspot (/settings/apikeys)',
    },
    {
      displayName: 'Base URL',
      name: 'baseUrl',
      type: 'string',
      default: 'https://api.memberspot.de',
      description: 'Base URL of the Memberspot API',
    },
  ];

  // Auto-auth injection in all requests
  authenticate: IAuthenticate = {
    type: 'generic',
    properties: {
      headers: {
        'X-API-KEY': '={{$credentials.apiKey}}',
      },
    },
  };

  // Test request for credentials
  test: ICredentialTestRequest = {
    request: {
      baseURL: '={{$credentials.baseUrl}}',
      url: '/api-auth',
      method: 'GET',
    },
  };
}
