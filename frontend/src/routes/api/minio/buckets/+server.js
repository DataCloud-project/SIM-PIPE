import { minioClient } from "$lib/minio_client.server";
//import { check_authorization } from "../check_authorization.server";

// GET /api/minio/buckets
export const GET = async ({ request }) => {
    //if (!check_authorization(request)) {
    //    return new Response(JSON.stringify({message: "access denied"}), { status: 401 });
    //}
    const response = await minioClient.listBuckets();
    return new Response(JSON.stringify({ response }), { status: 200 });
};
