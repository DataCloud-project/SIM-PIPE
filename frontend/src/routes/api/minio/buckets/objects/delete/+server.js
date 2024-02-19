import { minioClient } from "$lib/minio_client.server";
import { default_bucket_name } from "$lib/folders_types";

// POST /api/minio/buckets/objects/delete - delete objects in a bucket
export const POST = async ({ request }) => {
    const formData = await request.formData();
    let body = {
        bucketName: formData.get('bucketName') || default_bucket_name,
        objectsList: JSON.parse(formData.get('objectsList')),
    };

    let message = '';
    let status_code = 200;

    console.log(body);

    minioClient.removeObjects(body.bucketName, body.objectsList, function (err, etag) {
        if (err) {
            message = err;
            status_code = 500;
            return console.log(err)
        }
        message = 'Objects removed successfully';
        return console.log(message)
    })
    return new Response(JSON.stringify({ data: body, message: message }), { status: status_code });
};

