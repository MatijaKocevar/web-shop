import {
    DeleteObjectCommand,
    GetObjectCommand,
    PutObjectCommand,
    S3Client,
} from "@aws-sdk/client-s3";

const endpoint = process.env.S3_ENDPOINT;
const bucket = process.env.S3_BUCKET ?? "files";

const s3 = new S3Client({
    region: process.env.S3_REGION ?? "us-east-1",
    endpoint,
    forcePathStyle: true,
    credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY ?? "minioadmin",
        secretAccessKey: process.env.S3_SECRET_KEY ?? "minioadmin",
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

export async function getObject(key: string): Promise<Uint8Array> {
    const res = await s3.send(new GetObjectCommand({ Bucket: bucket, Key: key }));
    return res.Body?.transformToByteArray() ?? new Uint8Array();
}

export async function deleteObject(key: string) {
    await s3.send(new DeleteObjectCommand({ Bucket: bucket, Key: key }));
}

export function publicUrl(key: string): string {
    return `${process.env.NEXT_PUBLIC_S3_PUBLIC_URL}/${key}`;
}
