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
        
        const fileName = (req.query.fileName || (req.body && req.body.fileName));
        const age = (req.query.age || (req.body && req.body.age));
        const isDisable = (req.query.disable || (req.body && req.body.disable));

        if (!fileName || fileName === "") {
            throw 'invalid parameter fileName';
        }

        const filePath = decodeURI(fileName);

        const containerName = process.env["ContainerName"];

        const containerClient = blobServiceClient.getContainerClient(containerName);

        const blockBlobClient = containerClient.getBlockBlobClient(filePath);

        const response = await blockBlobClient.download(0);

        const content = await streamToBuffer(
            response.readableStreamBody,
          );

        context.res = {
            // status: 200, /* Defaults to 200 */
            headers: {
                "Content-type": response.contentType,
                "Content-Disposition": encodeURIComponent(filePath)
            },
            body: content
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
