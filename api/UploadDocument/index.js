const multipart = require('parse-multipart');
const { v4: uuidv4 } = require('uuid');

const {
    BlobServiceClient,
    StorageSharedKeyCredential,
    newPipeline
} = require('@azure/storage-blob');

const sharedKeyCredential = new StorageSharedKeyCredential(
  process.env.AZURE_STORAGE_ACCOUNT_NAME,
  process.env.AZURE_STORAGE_ACCOUNT_ACCESS_KEY);

const pipeline = newPipeline(sharedKeyCredential);
  
const blobServiceClient = new BlobServiceClient(
  `https://${process.env.AZURE_STORAGE_ACCOUNT_NAME}.blob.core.windows.net`,
  pipeline
);

const { SearchIndexerClient, AzureKeyCredential } = require("@azure/search-documents");

const apiKey = process.env["SearchApiKey"];
const searchServiceName = process.env["SearchServiceName"];
const indexerName = process.env["SearchIndexerName"];

const searchClient = new SearchIndexerClient(
  `https://` + searchServiceName + `.search.windows.net/`,
  new AzureKeyCredential(apiKey)
);

const streamToBuffer = async (readableStream) => {
    return new Promise((resolve, reject) => {
      const chunks = [];
      readableStream.on('data', (data) => {
        chunks.push(data instanceof Buffer ? data : Buffer.from(data));
      });
      readableStream.on('end', () => {
        resolve(Buffer.concat(chunks));
      });
      readableStream.on('error', reject);
    });
  };

module.exports = async function (context, req) {

    try {
        console.log("upload");
        console.log(req.body);

        const boundary = multipart.getBoundary(req.headers["content-type"]);

        const files = multipart.Parse(Buffer.from(req.body), boundary);

        const file = files[0];

        const containerName = process.env["ContainerName"];

        const containerClient = blobServiceClient.getContainerClient(containerName);

        const blockBlobClient = containerClient.getBlockBlobClient(uuidv4());

        const metadata = {
          title: encodeURIComponent(file.filename),
          disable: "false",
        };

        const blobOptions = { blobHTTPHeaders: { blobContentType: file.type }, metadata: metadata};

        console.log("upload start");

        await blockBlobClient.upload(file.data, file.data.length, blobOptions);

        console.log("upload end");

        await searchClient.runIndexer(indexerName);

        context.res = {
            // status: 200, /* Defaults to 200 */
            headers: {
            },
            body: true
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
