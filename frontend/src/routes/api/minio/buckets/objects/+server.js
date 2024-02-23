import { default_bucket_name } from "$lib/folders_types";
import { minioClient } from "$lib/minio_client.server";
// import { check_authorization } from "../check_authorization.server";

// GET /api/minio/buckets/objects - list all objects in a bucket
export const GET = async ({ request }) => {
    const url = new URL(request.url);
    const rawQueryParameters = new URLSearchParams(url.search);
    const queryParameters = Object.fromEntries(rawQueryParameters.entries());

    let bucketName = default_bucket_name;

    if (queryParameters.bucketName) {
        bucketName = queryParameters.bucketName;
    }

    const response = await listObjectsAsync(minioClient, bucketName);
    
    /*
    try {
        // Convert the stream to a promise
        data = await listObjectsAsync(minioClient, bucketName);
        console.log(data);
    } catch (error) {
        console.error("Error fetching data:", error);
        response_code = 500;
    }
    */

    return new Response(JSON.stringify({ response }), {status: 200});
};

// Utility function to promisify listObjects
const listObjectsAsync = (client, bucketName, prefix = '', recursive = true) => {
    return new Promise((resolve, reject) => {
        const data = [];
        const stream = client.listObjects(bucketName, prefix, recursive);
        stream.on('data', (obj) => {
            data.push(obj);
        });
        stream.on('end', () => {
            resolve(data);
        });
        stream.on('error', (err) => {
            console.log(err);
            reject(err);
        });
    });
};