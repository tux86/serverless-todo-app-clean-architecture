import { CognitoIdentityProvider } from '@aws-sdk/client-cognito-identity-provider'

import { UserService } from '@/domain/interfaces/services/UserService'
import { User } from '@/domain/models/User'

export class UserServiceImpl implements UserService {
  private cognitoClient: CognitoIdentityProvider
  constructor (readonly userPoolId: string, readonly clientId: string) {
    this.cognitoClient = new CognitoIdentityProvider({})
  }

  async createUser (user: User): Promise<User> {
    const { email, password } = user

    const params = {
      UserPoolId: this.UserPoolId,
      Username: email,
      MessageAction: 'SUPPRESS', // Prevents sending a welcome email
      TemporaryPassword: password,
      UserAttributes: [
        {
          Name: 'email',
          Value: email
        },
        {
          Name: 'email_verified',
          Value: 'true'
        }
      ]
    }

    await this.cognitoClient.adminCreateUser(params)
    return user
  }

  async findUserByEmail (email: string): Promise<User | null> {
    const params = {
      UserPoolId: this.UserPoolId,
      Filter: `email = "${email}"`
    }

    const response = await this.cognitoClient.listUsers(params)
    const user = response.Users?.[0]

    if (!user) return null

    return new User(user.Username, user.Attributes?.find((attr) => attr.Name === 'email')?.Value || '')
  }

  async authenticateUser (email: string, password: string): Promise<string> {
    const params = {
      AuthFlow: 'USER_PASSWORD_AUTH',
      ClientId: this.clientId,
      AuthParameters: {
        USERNAME: email,
        PASSWORD: password
      }
    }

    const response = await this.cognitoClient.initiateAuth(params)
    return response.AuthenticationResult?.AccessToken || ''
  }
}
