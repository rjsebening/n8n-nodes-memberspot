import type { INodeType, ICredentialType } from 'n8n-workflow';
import { Memberspot } from './nodes/Memberspot/Memberspot.node';
import { MemberspotApi } from './credentials/MemberspotApi.credentials';

export const nodes: INodeType[] = [new Memberspot()];

export const credentials: ICredentialType[] = [new MemberspotApi()];
