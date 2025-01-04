import { ApiHandler } from "sst/node/api";
import { Config } from "sst/node/config"
import jwt from 'jsonwebtoken'
import axios from 'axios'

const GOOGLE_PUBLIC_KEY = `-----BEGIN CERTIFICATE-----
MIIDHDCCAgSgAwIBAgIIHBeHYuKCi9kwDQYJKoZIhvcNAQEFBQAwMTEvMC0GA1UE
Awwmc2VjdXJldG9rZW4uc3lzdGVtLmdzZXJ2aWNlYWNjb3VudC5jb20wHhcNMjQx
MjI2MDczMjUxWhcNMjUwMTExMTk0NzUxWjAxMS8wLQYDVQQDDCZzZWN1cmV0b2tl
bi5zeXN0ZW0uZ3NlcnZpY2VhY2NvdW50LmNvbTCCASIwDQYJKoZIhvcNAQEBBQAD
ggEPADCCAQoCggEBAKgi1rXBMqM9zeBKW/rKU23TN+x+ype9cdG/Hzui7xBzcG2i
1y/3Nwlw5qPJcFMn0TPAEZMJYEm8gJDfeX5J1kl0ztkmZYyXHcw10Qw2O3pzcRXO
Shfo88Nk67P5al/CFHn1hi4lvnhNofIIGJlxHNfI5CY0O4yLHse+1ljEfBiOGkzo
ejkEJqYZGlcsvIX1oeipbWnucsSuojntrYjEQmlR2oPG3cIVWAWq94JQEFlSHESq
SNwphtE3WsW6dc946ovoEB/s2T/de2QOwnfAMJpeT8ib5ollQjBOwGpU3wiF+o6q
zupEUM0nCuacsuO7g2T/Q4qzLyWZHICp5kwaW5kCAwEAAaM4MDYwDAYDVR0TAQH/
BAIwADAOBgNVHQ8BAf8EBAMCB4AwFgYDVR0lAQH/BAwwCgYIKwYBBQUHAwIwDQYJ
KoZIhvcNAQEFBQADggEBAFag+f2lttrKLhpW4efBsAS2Iiy1o/6n4VgG0IKdOoqK
6xCuPRmrGzlKYd/EuudRM8JgB8BDgsa7txGoRr7iMtGKfmEBf7BVhE3e5gSPukZk
hljVP0GcLxTI8XD+iX3rx5TsFHXWt96JC8wlqWwGsuac6eY4w/3yyjzQm6Hu7clS
4he/otvM/PwHwL21Yj1zTqtqJ7UPQs4KvF1X13buLNV+I32GJ+snqAgSCF8+E1Ep
eVr4P3s1K+9a6h/JgHJEtVNvkK6WIl4Ki0L7JMeQsDqRSeCEKgbLQOr8Du/cZNhc
78ow1UO4kysnobNT1xRygG5RUtITv/6ICx2RjH5ZFWQ=
-----END CERTIFICATE-----`

const authorizedProjects = [
    "friendly-fiesta-development",
]

export const handler = ApiHandler(async (event: any) => {
    const token = event.queryStringParameters.token
    const googleCloudProject = event.queryStringParameters.project
    console.log('Token', token)
    console.log('Google Cloud Project', googleCloudProject)
    if (!token || !googleCloudProject || !authorizedProjects.includes(googleCloudProject)) {
        return {
            statusCode: 401,
            body: JSON.stringify({ message: 'Unauthorized' })
        }
    }

    let decoded;
    try {
        decoded = jwt.verify(token, GOOGLE_PUBLIC_KEY, {
            algorithms: ['RS256'],
            audience: googleCloudProject,
            issuer: 'https://securetoken.google.com/' + googleCloudProject
        });
    } catch (error) {
        console.error('Error verifying token', error)
        return {
            statusCode: 401,
            body: JSON.stringify({ message: 'Unauthorized' })
        }
    }

    const response = await axios.get('https://api.giphy.com/v1/gifs/search', {
        params: {
            api_key: process.env.GIPHY_AUTHORIZATION_KEY,
            q: 'cat',
            limit: 25,
            offset: 0,
            rating: 'g',
            lang: 'en',
            bundle: 'low_bandwidth'
        }
    })

    return response;
});