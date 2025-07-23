from authlib.integrations.starlette_client import OAuth

# Register GitHub OAuth
# Replace with your GitHub OAuth app credentials
GITHUB_CLIENT_ID = "YOUR_GITHUB_CLIENT_ID"
GITHUB_CLIENT_SECRET = "YOUR_GITHUB_CLIENT_SECRET"

oauth = OAuth()
oauth.register(
    name='github',
    client_id=GITHUB_CLIENT_ID,
    client_secret=GITHUB_CLIENT_SECRET,
    access_token_url='https://github.com/login/oauth/access_token',
    authorize_url='https://github.com/login/oauth/authorize',
    api_base_url='https://api.github.com/',
    client_kwargs={'scope': 'user:email'}
)
