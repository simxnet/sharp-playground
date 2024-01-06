import { NextResponse } from 'next/server';
import sharp from 'sharp';
import { runInNewContext } from 'vm';

export async function POST(request: Request) {
    const code = request.headers.get("code")

    if (!code) return Response.json({
        ok: false,
        message: "no 'code' provided"
    }, {
        status: 500
    })

    let result;
    const config = {
        timeout: 60000
    }

    const script = `(async () => {
        ${code.replace(/\n/g, "")}
    })()`;

    try {
        result = await runInNewContext(script, {
            sharp,
            fetch
        }, { timeout: config.timeout, });
    } catch (e) {
        console.log(e)
        return Response.json({
            ok: false,
            message: "an error occurred"
        }, {
            status: 500
        })
    }

    if (result === undefined) return Response.json({
        ok: false,
        message: "response returned undefined (did you forget to add 'return'?)"
    }, {
        status: 500
    })
    if (result instanceof Promise) await result;
    if (result satisfies sharp.Sharp && !(result instanceof Buffer)) result = await (result as sharp.Sharp).toBuffer()
    if (!(result instanceof Buffer)) return Response.json({
        ok: false,
        message: "invalid response (please remind to type '.toBuffer()' at the end of the code"
    }, {
        status: 500
    })


    return new NextResponse(result, {
        headers: {
            "Content-Type": `image/${(await sharp(result).metadata()).format}`
        }
    })
}