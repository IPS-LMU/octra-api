import {ApiCommand, RequestType} from '../api.command';
import * as Keycloak from 'keycloak-connect';
import * as session from 'express-session';

import {OK} from '../../../../obj/http-codes/success.codes';

export class UserLoginKeycloakCommand extends ApiCommand {

  constructor() {
    super('loginKeycloakUser', '/users', RequestType.GET, '/loginKeycloak', false,
      []);

    this._description = 'Login a user via Keycloak';
    this._acceptedContentType = 'application/json';
    this._responseContentType = 'application/json';

    // relevant for reference creation
    this._requestStructure = {
      ...this.defaultRequestSchema,
      type: 'object',
      properties: {
        ...this.defaultRequestSchema.properties,
        type: {
          enum: ['shibboleth', 'local']
        },
        name: {
          type: 'string'
        },
        email: {
          type: 'string'
        },
        password: {
          type: 'string'
        }
      }
    };

    // relevant for reference creation
    this._responseStructure = {
      properties: {
        token: {
          type: 'string',
          description: 'JSON Web Token. If type is not "local" and openURL is set, the token can be empty. Otherwise it\'s set.'
        },
        ...this.defaultResponseSchema.properties,
        data: {
          ...this.defaultResponseSchema.properties.data,
          properties: {
            ...this.defaultResponseSchema.properties.data.properties,
            // TODO why is id needed?
            id: {
              type: 'number'
            },
            name: {
              type: 'string'
            },
            openURL: {
              type: 'string'
            }
          }
        }
      }
    };
  }

  async do(req, res) {
    const memoryStore = session.MemoryStore();
    const keycloak = new Keycloak({
      store: memoryStore
    }, this.settings.api.keycloak);

    const handler = keycloak.protect();
    handler(req, res, () => {
      console.log(`auth keycloak success`);
      res.status(OK).send("Keycloak authentication Success.");

      return;
    });
  }
}
