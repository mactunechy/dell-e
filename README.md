# Dell-e
 A Rest API for generating images using the openai's Dall-e model. This Rest API is build on top of AWS infrastructure with a CDK CI/CD pipeline
 
 ## AWS Services used
 
 ### Simple Storage Service (S3)
 - Saves the generated Images into a public Access S3 bucket
 
 
 ### Dynamo DB
 - Saves information of the created image. `{ prompt: string, imageUrl: string, pk: string, author: string }`
 
 ### APIGateway
 - Receives API requests and routes them to the appropriate Lambda function
 
 ### Lambda 
 - Handles the `getImages` an `generateImages`endpoints.
 - Makes API request to openai AI to generate images
 
 ### AWS CDK
 - Builds and allocate infra resources for the rest API
 - Adds a CI/CD pipeline to automate deployment
 
 
