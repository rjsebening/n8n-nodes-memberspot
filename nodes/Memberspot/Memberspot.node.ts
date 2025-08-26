import {
  IExecuteFunctions,
  ILoadOptionsFunctions,
  INodeExecutionData,
  INodePropertyOptions,
  INodeType,
  INodeTypeDescription,
  NodeConnectionType,
  NodeApiError,
  IRequestOptions,
  JsonObject,
} from 'n8n-workflow';

export class Memberspot implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Memberspot',
    name: 'memberspot',
    icon: 'fa:graduation-cap',
    group: ['transform'],
    version: 1,
    description: 'Interact with the Memberspot API (powered by agentur-systeme.de)',
    defaults: {
      name: 'Memberspot',
      // @ts-expect-error -- required by n8n linter
      description: 'Memberspot integration node',
    },
    inputs: [NodeConnectionType.Main],
    outputs: [NodeConnectionType.Main],
    credentials: [
      {
        name: 'memberspotApi',
        required: true,
      },
    ],
    properties: [
      // ------------------- Resource -------------------
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        noDataExpression: true,
        options: [
          { name: 'Chapter', value: 'chapter' },
          { name: 'Custom Property', value: 'customProperty' },
          { name: 'Exam', value: 'exam' },
          { name: 'Offer', value: 'offer' },
          { name: 'User', value: 'user' },
        ],
        default: 'user',
      },

      // ------------------- USER -------------------
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: { show: { resource: ['user'] } },
        options: [
          { name: 'Delete Users', value: 'deleteUsers', action: 'Delete users by email s' },
          { name: 'Find by Email', value: 'findByMail', action: 'Find a user by email' },
          {
            name: 'Get Course Progress',
            value: 'courseProgressGet',
            action: 'Get course progress for a specific course',
          },
          { name: 'Get Login Token', value: 'loginToken', action: 'Get login token for a user' },
          { name: 'Grant Offer by Email', value: 'grantOffer', action: 'Grant a user an offer by email' },

          { name: 'List Course Progress', value: 'courseProgressList', action: 'Get paginated course progress' },
          { name: 'List Users', value: 'list', action: 'Get paginated list of users' },
          { name: 'Set Custom Properties', value: 'setCustomProps', action: 'Set custom user properties' },
          { name: 'Set Offer State', value: 'setOfferState', action: 'Set state of an offer for a user' },
          { name: 'Set Order State', value: 'setOrderState', action: 'Set state of an order for a user' },
        ],
        default: 'list',
      },

      // User parameters
      {
        displayName: 'Email',
        name: 'email',
        type: 'string',
        placeholder: 'name@email.com',
        default: '',
        required: true,
        displayOptions: {
          show: {
            resource: ['user'],
            operation: [
              'findByMail',
              'grantOffer',
              'setOfferState',
              'setOrderState',
              'setCustomProps',
              'courseProgressList',
              'courseProgressGet',
            ],
          },
        },
      },
      {
        displayName: 'Offer Name or ID',
        name: 'offerId',
        type: 'options',
        description:
          'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
        typeOptions: {
          loadOptionsMethod: 'getOffers',
        },
        default: '',
        required: true,
        displayOptions: {
          show: {
            resource: ['user'],
            operation: ['grantOffer', 'setOfferState'],
          },
        },
      },
      {
        displayName: 'Order ID',
        name: 'orderId',
        type: 'string',
        default: '',
        displayOptions: {
          show: {
            resource: ['user'],
            operation: ['grantOffer', 'setOrderState'],
          },
        },
      },
      {
        displayName: 'UID',
        name: 'uid',
        type: 'string',
        default: '',
        displayOptions: { show: { resource: ['user'], operation: ['loginToken'] } },
      },
      {
        displayName: 'Active',
        name: 'active',
        type: 'boolean',
        default: true,
        displayOptions: {
          show: { resource: ['user'], operation: ['setOfferState', 'setOrderState'] },
        },
      },
      {
        displayName: 'Custom Properties',
        name: 'properties',
        type: 'fixedCollection',
        typeOptions: { multipleValues: true },
        placeholder: 'Add Property',
        default: {},
        options: [
          {
            name: 'property',
            displayName: 'Property',
            values: [
              { displayName: 'ID', name: 'id', type: 'string', default: '' },
              { displayName: 'Value', name: 'value', type: 'string', default: '' },
            ],
          },
        ],
        displayOptions: { show: { resource: ['user'], operation: ['setCustomProps'] } },
      },
      {
        displayName: 'Emails',
        name: 'emails',
        type: 'string',
        default: '',
        placeholder: 'comma,separated@emails.com',
        displayOptions: { show: { resource: ['user'], operation: ['deleteUsers'] } },
      },
      {
        displayName: 'Course ID',
        name: 'courseId',
        type: 'string',
        default: '',
        displayOptions: { show: { resource: ['user'], operation: ['courseProgressGet'] } },
      },

      // Grant Offer extra params
      {
        displayName: 'Firstname',
        name: 'firstname',
        type: 'string',
        default: '',
        displayOptions: { show: { resource: ['user'], operation: ['grantOffer'] } },
      },
      {
        displayName: 'Lastname',
        name: 'lastname',
        type: 'string',
        default: '',
        displayOptions: { show: { resource: ['user'], operation: ['grantOffer'] } },
      },

      // ------------------- OFFER -------------------
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: { show: { resource: ['offer'] } },
        options: [{ name: 'Get Many', value: 'getAll', action: 'List all available offers' }],
        default: 'getAll',
      },

      // ------------------- CHAPTER -------------------
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: { show: { resource: ['chapter'] } },
        options: [{ name: 'Enable Chapter Access', value: 'enableAccess', action: 'Grant chapter access to a user' }],
        default: 'enableAccess',
      },
      {
        displayName: 'Course ID',
        name: 'courseId',
        type: 'string',
        default: '',
        displayOptions: { show: { resource: ['chapter'], operation: ['enableAccess'] } },
      },
      {
        displayName: 'Chapter ID',
        name: 'chapterId',
        type: 'string',
        default: '',
        displayOptions: { show: { resource: ['chapter'], operation: ['enableAccess'] } },
      },
      {
        displayName: 'Email',
        name: 'email',
        type: 'string',
        placeholder: 'name@email.com',
        default: '',
        displayOptions: { show: { resource: ['chapter'], operation: ['enableAccess'] } },
      },

      // ------------------- CUSTOM PROPERTIES -------------------
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: { show: { resource: ['customProperty'] } },
        options: [{ name: 'List Custom Properties', value: 'list', action: 'List all custom user properties' }],
        default: 'list',
      },

      // ------------------- EXAM -------------------
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: { show: { resource: ['exam'] } },
        options: [{ name: 'List Exam Results', value: 'listResults', action: 'List results of an exam' }],
        default: 'listResults',
      },
      {
        displayName: 'Exam ID',
        name: 'examId',
        type: 'string',
        default: '',
        required: true,
        displayOptions: { show: { resource: ['exam'], operation: ['listResults'] } },
      },
    ],
  };

  methods = {
    loadOptions: {
      async getOffers(): Promise<INodePropertyOptions[]> {
        const self = this as unknown as ILoadOptionsFunctions;
        const credentials = await self.getCredentials('memberspotApi');
        const baseUrl = (credentials.baseUrl as string).replace(/\/$/, '');

        const options: IRequestOptions = {
          method: 'GET',
          url: `${baseUrl}/v1/offers`,
          json: true,
        };

        const response = await self.helpers.requestWithAuthentication.call(self, 'memberspotApi', options);

        return (response as Array<{ id: string; name: string }>).map((offer) => ({
          name: offer.name,
          value: offer.id,
        }));
      },
    },
  };

  async execute(): Promise<INodeExecutionData[][]> {
    const self = this as unknown as IExecuteFunctions;

    const items = self.getInputData();
    const returnData: INodeExecutionData[] = [];

    const credentials = await self.getCredentials('memberspotApi');
    const baseUrl = (credentials.baseUrl as string).replace(/\/$/, '');

    for (let i = 0; i < items.length; i++) {
      const resource = self.getNodeParameter('resource', i) as string;
      const operation = self.getNodeParameter('operation', i) as string;

      let responseData;
      let options: IRequestOptions = { json: true, method: 'GET', url: '' };

      try {
        // ---------------- USER ----------------
        if (resource === 'user') {
          if (operation === 'list') {
            options.url = `${baseUrl}/v1/users/list`;
            responseData = await self.helpers.requestWithAuthentication.call(self, 'memberspotApi', options);
          }

          if (operation === 'findByMail') {
            const email = self.getNodeParameter('email', i) as string;
            options.url = `${baseUrl}/v1/users/find-by-mail/${encodeURIComponent(email)}`;
            responseData = await self.helpers.requestWithAuthentication.call(self, 'memberspotApi', options);
          }

          if (operation === 'grantOffer') {
            const firstname = self.getNodeParameter('firstname', i, '') as string;
            const lastname = self.getNodeParameter('lastname', i, '') as string;
            const email = self.getNodeParameter('email', i) as string;
            const offerId = self.getNodeParameter('offerId', i) as string;
            const orderId = self.getNodeParameter('orderId', i, '') as string;

            options.method = 'POST';
            options.url = `${baseUrl}/v1/users/grant-user-offer-by-mail`;
            options.body = { firstname, name: lastname, email, grantOffer: offerId, orderId: orderId || undefined };
            responseData = await self.helpers.requestWithAuthentication.call(self, 'memberspotApi', options);
          }

          if (operation === 'setOfferState') {
            const email = self.getNodeParameter('email', i) as string;
            const offerId = self.getNodeParameter('offerId', i) as string;
            const active = self.getNodeParameter('active', i) as boolean;

            options.method = 'POST';
            options.url = `${baseUrl}/v1/users/set-offer-state`;
            options.body = { email, offerId, active };
            responseData = await self.helpers.requestWithAuthentication.call(self, 'memberspotApi', options);
          }

          if (operation === 'setOrderState') {
            const email = self.getNodeParameter('email', i) as string;
            const orderId = self.getNodeParameter('orderId', i) as string;
            const active = self.getNodeParameter('active', i) as boolean;

            options.method = 'POST';
            options.url = `${baseUrl}/v1/users/set-order-state`;
            options.body = { email, orderId, active };
            responseData = await self.helpers.requestWithAuthentication.call(self, 'memberspotApi', options);
          }

          if (operation === 'setCustomProps') {
            const email = self.getNodeParameter('email', i) as string;
            const props = self.getNodeParameter('properties', i) as any;
            const properties = props.property || [];

            options.method = 'POST';
            options.url = `${baseUrl}/v1/users/set-custom-user-properties`;
            options.body = { email, properties };
            responseData = await self.helpers.requestWithAuthentication.call(self, 'memberspotApi', options);
          }

          if (operation === 'deleteUsers') {
            const emailsRaw = self.getNodeParameter('emails', i) as string;
            const emails = emailsRaw.split(',').map((e) => e.trim());

            options.method = 'DELETE';
            options.url = `${baseUrl}/v1/users/delete-users`;
            options.body = { emails };
            responseData = await self.helpers.requestWithAuthentication.call(self, 'memberspotApi', options);
          }

          if (operation === 'courseProgressList') {
            const email = self.getNodeParameter('email', i) as string;
            options.url = `${baseUrl}/v1/users/course-progress/list/${encodeURIComponent(email)}`;
            responseData = await self.helpers.requestWithAuthentication.call(self, 'memberspotApi', options);
          }

          if (operation === 'courseProgressGet') {
            const email = self.getNodeParameter('email', i) as string;
            const courseId = self.getNodeParameter('courseId', i) as string;
            options.url = `${baseUrl}/v1/users/course-progress/${encodeURIComponent(courseId)}/${encodeURIComponent(email)}`;
            responseData = await self.helpers.requestWithAuthentication.call(self, 'memberspotApi', options);
          }

          if (operation === 'loginToken') {
            const uid = self.getNodeParameter('uid', i) as string;
            options.url = `${baseUrl}/v1/users/login-token/${encodeURIComponent(uid)}`;
            responseData = await self.helpers.requestWithAuthentication.call(self, 'memberspotApi', options);
          }
        }

        // ---------------- OFFER ----------------
        if (resource === 'offer') {
          if (operation === 'getAll') {
            options.url = `${baseUrl}/v1/offers`;
            responseData = await self.helpers.requestWithAuthentication.call(self, 'memberspotApi', options);
          }
        }

        // ---------------- CHAPTER ----------------
        if (resource === 'chapter') {
          if (operation === 'enableAccess') {
            const email = self.getNodeParameter('email', i) as string;
            const courseId = self.getNodeParameter('courseId', i) as string;
            const chapterId = self.getNodeParameter('chapterId', i) as string;

            options.method = 'POST';
            options.url = `${baseUrl}/v1/chapters/chapter-access/enable`;
            options.body = { email, courseId, chapterId };
            responseData = await self.helpers.requestWithAuthentication.call(self, 'memberspotApi', options);
          }
        }

        // ---------------- CUSTOM PROPERTIES ----------------
        if (resource === 'customProperty') {
          if (operation === 'list') {
            options.url = `${baseUrl}/v1/custom-user-properties/list`;
            responseData = await self.helpers.requestWithAuthentication.call(self, 'memberspotApi', options);
          }
        }

        // ---------------- EXAM ----------------
        if (resource === 'exam') {
          if (operation === 'listResults') {
            const examId = self.getNodeParameter('examId', i) as string;
            options.url = `${baseUrl}/v1/exams/${encodeURIComponent(examId)}/results`;
            responseData = await self.helpers.requestWithAuthentication.call(self, 'memberspotApi', options);
          }
        }

        returnData.push({ json: responseData });
      } catch (error) {
        throw new NodeApiError(self.getNode(), error as JsonObject, { itemIndex: i });
      }
    }

    return [returnData];
  }
}
