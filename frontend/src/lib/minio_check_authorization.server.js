import { SECRET_API_KEY } from "$env/static/private"

export function check_authorization(request) {
    const authHeaders = request.headers.get('Authorization')
    return authHeaders && authHeaders === 'Bearer ' + SECRET_API_KEY
}