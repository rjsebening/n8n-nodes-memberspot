import {
  IExecuteFunctions,
  ILoadOptionsFunctions,
  INodeExecutionData,
  INodePropertyOptions,
  INodeType,
  INodeTypeDescription,
  NodeConnectionType,
  NodeApiError,
  IHttpRequestOptions,
  JsonObject,
  NodeOperationError,
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
        displayName: 'Offer ID',
        name: 'offerId',
        type: 'string',
        default: '',
        displayOptions: { show: { resource: ['user'], operation: ['find'] } },
        description:
          'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
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
          show: { resource: ['user'], operation: ['setOfferState', 'setOrderState', 'find'] },
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
      // ------------------- List User  -------------------
      {
        displayName: 'Additional Options',
        name: 'additionalOptions',
        type: 'collection',
        placeholder: 'Add Option',
        default: {},
        displayOptions: {
          show: {
            resource: ['user'],
            operation: ['list'],
          },
        },
        options: [
          {
            displayName: 'Active Filter',
            name: 'activeFilter',
            type: 'options',
            options: [
              { name: 'All', value: '' },
              { name: 'Active Only', value: true },
              { name: 'Inactive Only', value: false },
            ],
            default: '',
            description: 'Filter by active/inactive status',
          },
          {
            displayName: 'Filter by Course ID',
            name: 'filterCourseId',
            type: 'string',
            default: '',
            description: 'Filter users by specific course ID',
          },

          {
            displayName: 'Filter by Offer Name or ID',
            name: 'filterOfferId',
            type: 'options',
            typeOptions: {
              loadOptionsMethod: 'getOffers',
            },
            default: '',
            description:
              'Filter users by specific offer. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
          },

          {
            displayName: 'Last Loaded ID',
            name: 'lastLoadedId',
            type: 'string',
            default: '',
            description: 'Page to continue loading at (located in response in next_page property)',
          },
          {
            displayName: 'Page Length',
            name: 'pageLength',
            type: 'number',
            default: 10,
            description: 'Number of items per page',
          },
        ],
      },
    ],
  };

  methods = {
    loadOptions: {
      async getOffers(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
        try {
          const credentials = await this.getCredentials('memberspotApi');
          const baseUrl = (credentials.baseUrl as string).replace(/\/$/, '');

          const options: IHttpRequestOptions = {
            method: 'GET',
            url: `${baseUrl}/v1/offers`,
            json: true,
            headers: {
              'X-API-KEY': credentials.apiKey as string, // ✅ Manuell setzen
              'Content-Type': 'application/json',
            },
          };

          const response = await this.helpers.httpRequest(options);
          return response.map((offer: any) => ({
            name: offer.name || `Offer ${offer.id}`,
            value: offer.id,
          }));
        } catch (error) {
          throw new NodeOperationError(
            this.getNode(),
            `Failed to load offers: ${error instanceof Error ? error.message : 'Unknown error'}`,
          );
        }
      },
    },
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const returnData: INodeExecutionData[] = [];
    const credentials = await this.getCredentials('memberspotApi');
    const baseUrl = (credentials.baseUrl as string).replace(/\/$/, '');

    for (let i = 0; i < items.length; i++) {
      const resource = this.getNodeParameter('resource', i) as string;
      const operation = this.getNodeParameter('operation', i) as string;

      let responseData;
      let options: IHttpRequestOptions = {
        json: true,
        method: 'GET',
        url: '',
        headers: {
          'X-API-KEY': credentials.apiKey as string,
          'Content-Type': 'application/json',
        },
      };

      try {
        // ---------------- USER ----------------
        if (resource === 'user') {
          if (operation === 'list') {
            const additionalOptions = this.getNodeParameter('additionalOptions', i, {}) as any;

            const queryParams: any = {};
            if (additionalOptions.lastLoadedId) queryParams.lastLoadedId = additionalOptions.lastLoadedId;
            if (additionalOptions.pageLength) queryParams.pageLength = additionalOptions.pageLength;
            if (additionalOptions.filterOfferId) queryParams.offerId = additionalOptions.filterOfferId;
            if (additionalOptions.filterCourseId) queryParams.courseId = additionalOptions.filterCourseId;
            if (additionalOptions.activeFilter !== undefined && additionalOptions.activeFilter !== '') {
              queryParams.active = additionalOptions.activeFilter;
            }

            const queryString =
              Object.keys(queryParams).length > 0 ? '?' + new URLSearchParams(queryParams).toString() : '';

            options.url = `${baseUrl}/v1/users/list${queryString}`;
            responseData = await this.helpers.httpRequest(options);
          }

          if (operation === 'findByMail') {
            const email = this.getNodeParameter('email', i) as string;
            options.url = `${baseUrl}/v1/users/find-by-mail/${encodeURIComponent(email)}`;
            options.method = 'GET';
            responseData = await this.helpers.httpRequest(options);
          }

          if (operation === 'grantOffer') {
            const firstname = this.getNodeParameter('firstname', i, '') as string;
            const lastname = this.getNodeParameter('lastname', i, '') as string;
            const email = this.getNodeParameter('email', i) as string;
            const offerId = this.getNodeParameter('offerId', i) as string;
            const orderId = this.getNodeParameter('orderId', i, '') as string;

            options.method = 'POST';
            options.url = `${baseUrl}/v1/users/grant-user-offer-by-mail`;
            options.body = { firstname, name: lastname, email, grantOffer: offerId, orderId: orderId || undefined };
            responseData = await this.helpers.httpRequest(options);
          }

          if (operation === 'setOfferState') {
            const email = this.getNodeParameter('email', i) as string;
            const offerId = this.getNodeParameter('offerId', i) as string;
            const active = this.getNodeParameter('active', i) as boolean;

            options.method = 'POST';
            options.url = `${baseUrl}/v1/users/set-offer-state`;
            options.body = { email, offerId, active };
            responseData = await this.helpers.httpRequest(options);
          }

          if (operation === 'setOrderState') {
            const email = this.getNodeParameter('email', i) as string;
            const orderId = this.getNodeParameter('orderId', i) as string;
            const active = this.getNodeParameter('active', i) as boolean;

            options.method = 'POST';
            options.url = `${baseUrl}/v1/users/set-order-state`;
            options.body = { email, orderId, active };
            responseData = await this.helpers.httpRequest(options);
          }

          if (operation === 'setCustomProps') {
            const email = this.getNodeParameter('email', i) as string;
            const props = this.getNodeParameter('properties', i) as any;
            const properties = props.property || [];

            options.method = 'POST';
            options.url = `${baseUrl}/v1/users/set-custom-user-properties`;
            options.body = { email, properties };
            responseData = await this.helpers.httpRequest(options);
          }

          if (operation === 'deleteUsers') {
            const emailsRaw = this.getNodeParameter('emails', i) as string;
            const emails = emailsRaw.split(',').map((e) => e.trim());

            options.method = 'DELETE';
            options.url = `${baseUrl}/v1/users/delete-users`;
            options.body = { emails };
            responseData = await this.helpers.httpRequest(options);
          }

          if (operation === 'courseProgressList') {
            const email = this.getNodeParameter('email', i) as string;
            options.url = `${baseUrl}/v1/users/course-progress/list/${encodeURIComponent(email)}`;
            responseData = await this.helpers.httpRequest(options);
          }

          if (operation === 'courseProgressGet') {
            const email = this.getNodeParameter('email', i) as string;
            const courseId = this.getNodeParameter('courseId', i) as string;
            options.url = `${baseUrl}/v1/users/course-progress/${encodeURIComponent(courseId)}/${encodeURIComponent(email)}`;
            responseData = await this.helpers.httpRequest(options);
          }

          if (operation === 'loginToken') {
            const uid = this.getNodeParameter('uid', i) as string;
            options.url = `${baseUrl}/v1/users/login-token/${encodeURIComponent(uid)}`;
            responseData = await this.helpers.httpRequest(options);
          }
        }

        // ---------------- OFFER ----------------
        if (resource === 'offer') {
          if (operation === 'getAll') {
            options.url = `${baseUrl}/v1/offers`;
            responseData = await this.helpers.httpRequest(options);
          }
        }

        // ---------------- CHAPTER ----------------
        if (resource === 'chapter') {
          if (operation === 'enableAccess') {
            const email = this.getNodeParameter('email', i) as string;
            const courseId = this.getNodeParameter('courseId', i) as string;
            const chapterId = this.getNodeParameter('chapterId', i) as string;

            options.method = 'POST';
            options.url = `${baseUrl}/v1/chapters/chapter-access/enable`;
            options.body = { email, courseId, chapterId };
            responseData = await this.helpers.httpRequest(options);
          }
        }

        // ---------------- CUSTOM PROPERTIES ----------------
        if (resource === 'customProperty') {
          if (operation === 'list') {
            options.url = `${baseUrl}/v1/custom-user-properties/list`;
            responseData = await this.helpers.httpRequest(options);
          }
        }

        // ---------------- EXAM ----------------
        if (resource === 'exam') {
          if (operation === 'listResults') {
            const examId = this.getNodeParameter('examId', i) as string;
            options.url = `${baseUrl}/v1/exams/${encodeURIComponent(examId)}/results`;
            responseData = await this.helpers.httpRequest(options);
          }
        }

        returnData.push({
          json: responseData,
          pairedItem: { item: i }, // Für bessere Item-Tracking
        });
      } catch (error) {
        // n8n Standard-Pattern
        if (this.continueOnFail()) {
          returnData.push({
            json: {
              error: error instanceof Error ? error.message : 'Unknown error',
            },
            pairedItem: { item: i },
          });
          continue;
        }

        // NodeApiError kann mit verschiedenen Error-Typen umgehen
        throw new NodeApiError(this.getNode(), error as JsonObject, { itemIndex: i });
      }
    }

    return [returnData];
  }
}
