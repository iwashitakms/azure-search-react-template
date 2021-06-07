const multipart = require('parse-multipart');

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

        console.log(file);

        const fileName = (req.query.name);

        var crypto = require('crypto');
        var hash = crypto.createHash('md5').update(fileName).digest('hex');
        console.log(hash); 

        const containerName = process.env["ContainerName"];

        const containerClient = blobServiceClient.getContainerClient(containerName);

        const blockBlobClient = containerClient.getBlockBlobClient(hash);

        const metadata = {
          title: encodeURIComponent(fileName),
          disable: "false",
        };

        const blobOptions = { blobHTTPHeaders: { blobContentType: file.type }, metadata: metadata};

        await blockBlobClient.upload(file.data, file.data.length, blobOptions);

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
