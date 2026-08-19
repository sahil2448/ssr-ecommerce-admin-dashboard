import { S3Client } from "@aws-sdk/client-s3";

export const AWS_REGION = process.env.AWS_REGION!;
export const AWS_S3_BUCKET = process.env.AWS_S3_BUCKET!;

let s3client: S3Client | undefined;

// Create the S3 client lazily: the checks run only when S3 is actually used
// at runtime, never when Next.js is merely collecting route data at build time.
export function getS3(): S3Client {
  if (!AWS_REGION) throw new Error("Missing AWS_REGION");
  if (!AWS_S3_BUCKET) throw new Error("Missing AWS_S3_BUCKET");
  if (!process.env.AWS_ACCESS_KEY_ID) throw new Error("Missing AWS_ACCESS_KEY_ID");
  if (!process.env.AWS_SECRET_ACCESS_KEY) throw new Error("Missing AWS_SECRET_ACCESS_KEY");

  if (!s3client) {
    s3client = new S3Client({
      region: AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },

      requestChecksumCalculation: "WHEN_REQUIRED",
      responseChecksumValidation: "WHEN_REQUIRED",
    });
  }
  return s3client;
}
