const {
    BlobServiceClient,
    StorageSharedKeyCredential,
    newPipeline
} = require('@azure/storage-blob');

const { SearchIndexerClient, AzureKeyCredential } = require("@azure/search-documents");

const apiKey = process.env["SearchApiKey"];
const searchServiceName = process.env["SearchServiceName"];
const indexName = process.env["SearchIndexName"];

// Create a SearchClient to send queries
const searchClient = new SearchIndexerClient(
    `https://` + searchServiceName + `.search.windows.net/`,
    new AzureKeyCredential(apiKey)
);

require("dotenv").config();

const sharedKeyCredential = new StorageSharedKeyCredential(
  process.env.AZURE_STORAGE_ACCOUNT_NAME,
  process.env.AZURE_STORAGE_ACCOUNT_ACCESS_KEY);

const pipeline = newPipeline(sharedKeyCredential);
  
const blobServiceClient = new BlobServiceClient(
  `https://${process.env.AZURE_STORAGE_ACCOUNT_NAME}.blob.core.windows.net`,
  pipeline
);

module.exports = async function (context, req) {

    try {

        console.log(req.body);

        const fileName = (req.query.fileName || (req.body && req.body.fileName));

        if (!fileName || fileName === "") {
            throw 'invalid parameter fileName';
        }

        const filePath = decodeURI(fileName);
        
        let age = (req.query.age || (req.body && req.body.age));
        let disable = (req.query.disable || (req.body && req.body.disable));

        const containerName = process.env["ContainerName"];

        const containerClient = blobServiceClient.getContainerClient(containerName);

        const blockBlobClient = containerClient.getBlockBlobClient(filePath);

        const metadata = {
          age: age,
          disable: disable.toString(),
        };

        console.log(metadata);

        const response = await blockBlobClient.setMetadata(metadata);

        console.log(apiKey);
        console.log(searchServiceName);

        await searchClient.runIndexer(indexName);

        context.res = {
            // status: 200, /* Defaults to 200 */
            headers: {
            },
            body: "success"
        };

    } catch (error) {
        context.log.error(error);

        // Creating the HTTP Response
        context.res = {
            status: 400,
            body: {
                innerStatusCode: error.statusCode || error.code,
                error: error.details || error.message
            }
        };
    }
};
