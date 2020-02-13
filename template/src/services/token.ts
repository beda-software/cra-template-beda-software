import { Token } from 'src/embed/aidbox-react/services/token';

export function saveToken(token: Token): void {
    localStorage.setItem('token', JSON.stringify(token));
}

export function removeToken(): void {
    localStorage.removeItem('token');
}

export function retrieveToken(): Token | undefined {
    const token = localStorage.getItem('token');
    if (token) {
        return JSON.parse(token);
    }

    return undefined;
}
