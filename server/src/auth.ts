import { CorsOptions } from 'cors';
import { Response, Request } from 'express'
import { sign, verify } from "jsonwebtoken";
import { AuthResponse } from './types';
export interface MyContext {
    res: Response
    req: Request
}

const allowlist = ['http://localhost:3000', 'http://127.0.0.1:5173']
export const corsOptionsDelegate = function (req: Request, callback: (err: Error | null, options?: CorsOptions) => void) {
    let corsOptions;
    if (allowlist.indexOf(req.header('Origin')!) !== -1) corsOptions = { origin: true, credentials: true }
    else corsOptions = { origin: false } // disable CORS for this request
    callback(null, corsOptions) // callback expects two parameters: error and options
}

export const createJWToken = ({ expires = '7d', authData }: AuthResponse) => {
    const payload = { authData, expires }
    // encrypt payload
    return {
        token: sign(
            payload,
            process.env.JWT_TOKEN_SECRET!,
            { expiresIn: expires, algorithm: 'HS256' }
        ),
        expiresIn: new Date(Date.now() + parseInt(expires) * 1000)
    }
}

export const verifyJWToken = (token: string): any => {
    try {
        const decoded = verify(token, process.env.JWT_TOKEN_SECRET!)
        return decoded
    } catch (error) {
        return false
    }
}

// check the token cookies are valid
export const validCookies = (cookies: any): { valid: boolean, token: string } => {
    const tokens = [cookies['a1_h'], cookies['a1_b'], cookies['a1_p']]
    if (tokens.includes(undefined)) return { valid: false, token: "" }
    return { valid: true, token: tokens.join(".") }
}

// set the refresh token to cookies
export const setTokenCookies = (token: string, res: Response) => {
    const [a1_h, a1_b, a1_p] = token.split(".") // break the code

    res.cookie(
        'a1_h', a1_h,
        { httpOnly: true, sameSite: 'none', secure: true, path: "/" }
    )

    res.cookie(
        'a1_b', a1_b,
        { httpOnly: true, sameSite: 'none', secure: true, path: "/" }
    )

    res.cookie(
        'a1_p', a1_p,
        { httpOnly: true, sameSite: 'none', secure: true, path: "/" }
    )
}


export const hash = (password: string) => {
    return password;
}

export const validateHash = (password: string, hashedPassword: string) => {
    return password === hashedPassword;
}
