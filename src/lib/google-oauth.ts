import { google } from 'googleapis'

export const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  `${process.env.NODE_ENV === 'production' ? 'https://yourdomain.com' : 'http://localhost:3000'}/api/auth/google/callback`
)

export const SCOPES = [
  'https://www.googleapis.com/auth/gmail.readonly',
  'https://www.googleapis.com/auth/gmail.send',
  'https://www.googleapis.com/auth/gmail.modify',
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/userinfo.profile'
]

export function getAuthUrl() {
  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
    prompt: 'consent'
  })
}

export async function getTokensFromCode(code: string) {
  const { tokens } = await oauth2Client.getToken(code)
  return tokens
}

export async function refreshAccessToken(refreshToken: string) {
  oauth2Client.setCredentials({
    refresh_token: refreshToken
  })
  
  const { credentials } = await oauth2Client.refreshAccessToken()
  return credentials
}
