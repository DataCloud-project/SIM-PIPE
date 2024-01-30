export const POST = async ({ request }) => {
    const url = new URL(request.url);
    const queryParams = new URLSearchParams(url.search);
    
    // Get a specific query parameter
    //const paramValue = queryParams.get('paramName');
    
    // Get all query parameters as an object
    const paramsObject = Object.fromEntries(queryParams.entries());
    
    return new Response(JSON.stringify({ message: 'Hello world', queryParams: paramsObject }), { status: 200 });
};
