import {
    DeleteObjectCommand,
    GetObjectCommand,
    HeadObjectCommand,
    PutObjectCommand,
    S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const endpoint = process.env.S3_ENDPOINT || undefined;
const bucket = process.env.S3_BUCKET || "files";

const s3 = new S3Client({
    region: process.env.S3_REGION || "auto",
    endpoint,
    forcePathStyle: true,
    requestChecksumCalculation: "WHEN_REQUIRED",
    credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY || "minioadmin",
        secretAccessKey: process.env.S3_SECRET_KEY || "minioadmin",
    },
});

export async function uploadObject(key: string, body: Uint8Array | Buffer, contentType: string) {
    await s3.send(
        new PutObjectCommand({
            Bucket: bucket,
            Key: key,
            Body: body,
            ContentType: contentType,
        }),
    );
}

export async function presignedUploadUrl(
    key: string,
    contentType: string,
    expiresSeconds = 600,
): Promise<string> {
    const command = new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        ContentType: contentType,
    });

    return getSignedUrl(s3, command, { expiresIn: expiresSeconds });
}

export async function objectExists(key: string): Promise<boolean> {
    try {
        await s3.send(new HeadObjectCommand({ Bucket: bucket, Key: key }));
        return true;
    } catch {
        return false;
    }
}

export async function getObject(key: string): Promise<Uint8Array> {
    const res = await s3.send(new GetObjectCommand({ Bucket: bucket, Key: key }));
    return res.Body?.transformToByteArray() ?? new Uint8Array();
}

export async function getObjectStream(
    key: string,
): Promise<{ stream: ReadableStream; contentType: string } | null> {
    try {
        const res = await s3.send(new GetObjectCommand({ Bucket: bucket, Key: key }));
        if (!res.Body) return null;

        return {
            stream: res.Body.transformToWebStream(),
            contentType: res.ContentType ?? "application/octet-stream",
        };
    } catch (error) {
        console.error(error);
        return null;
    }
}

export async function deleteObject(key: string) {
    await s3.send(new DeleteObjectCommand({ Bucket: bucket, Key: key }));
}

export async function presignedDownloadUrl(
    key: string,
    filename: string,
    expiresSeconds = 600,
): Promise<string> {
    const safeName = filename.replace(/["\\]/g, "_");

    const command = new GetObjectCommand({
        Bucket: bucket,
        Key: key,
        ResponseContentDisposition: `attachment; filename="${safeName}"`,
    });

    return getSignedUrl(s3, command, { expiresIn: expiresSeconds });
}
