import { minioClient } from "$lib/minio_client.server";

// POST /api/minio/buckets/create (create a bucket)
export const POST = async ({ request }) => {
    const body = await request.json();
    if (!body.bucketName) {
        return new Response(JSON.stringify({ message: 'provide bucketName in body {"bucketName": "your-bucket-name"}' }), { status: 500 });
        
    }

    const response = await new Promise((resolve, reject) => {
        minioClient.makeBucket(body.bucketName, function (err) {
            if (err) {
                reject({message: `Error creating bucket. ${err}`, status: 500});
            } else {
                resolve({message: `Successfully created bucket ${body.bucketName}`, status: 200});
            }
        });
    }).catch((error) => error);

    return new Response(JSON.stringify({ message: response.message }), { status: response.status });
};
