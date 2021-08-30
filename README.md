# Installation
1. Ensure `npm`, `node@10` are installed
2. `npm install`
3. `npm start`

# Running the tests
1. Set environmental variables inside cypress.env.json in root folder
```
cypress.env.json
{
    "baseUrl": "https://ipa.ucdavis.edu",
    "username": "",
    "password": ""
}
```
2. `npm run cypress` to open the Cypress Test Runner

# Docker Notes
1. Customize ipa-ucdavis-edu.env
2. docker build -t ipa-client .
3. docker run -p 9000:80 ipa-client

For production mode, you'll want to expose port 80 as port 80, 443 as 443. Use:

$ docker-compose run -p 80:80 -p 443:443 web

# Deployment
### Test
1. Create a `clientConfig.js` file in the root folder, if copying from the example make sure to se the dw token
2. Go to AWS ECR > `ipa-client-test`
3. Follow the steps under `View push commands`
4. Go to AWS ECS > Clusters > Default > `ipa-client-test`
5. Update service to `Force New Deployment`

### Test
1. Create a `clientConfig.js` file in the root folder
2. Go to AWS ECR > `ipa-client-prod`
3. Follow the steps under `View push commands`
4. Go to AWS ECS > Clusters > Default > `ipa-client-prod`
5. Update service to `Force New Deployment`
