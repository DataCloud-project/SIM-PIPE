import { minioClient } from "$lib/minio_client.server";

// POST /api/minio/buckets/objects/create - create a new object in a bucket
export const POST = async ({ request }) => {
    const formData = await request.formData();
    let body = {
        bucketName: '',
        objectPath: '',
        objectDataText: '',
        objectDataSize: '',
    };
    for (const [key, value] of formData.entries()) {
        body[key] = value;
    }

    var metadata = {
        'Content-Type': body.objectPath.split('.').pop(),
        'File-size-bytes': body.objectDataSize,
        'File-name': body.objectPath.split('/').pop(),
    };

    minioClient.putObject(body.bucketName, body.objectPath, body.objectDataText, function (err, etag) {
        if (err) {
            return console.log(err)
        }
        return console.log('File uploaded successfully.')
    })
    return new Response(JSON.stringify({ data: body, metadata: metadata }), { status: 200 });
};

