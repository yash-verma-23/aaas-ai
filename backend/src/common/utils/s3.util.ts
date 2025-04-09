/**
 * Get S3 bucket name from the URL
 */
export const getS3Bucket = (url: string | null): string | null => {
  if (!url) {
    return null;
  }
  /**
   * Regex breakdown:
   * - ^https:\/\/                → Matches 'https://' at the start
   * - ([^.]+)                    → Captures the bucket name (before '.s3')
   * - \.s3\.[^.]+\.amazonaws\.com → Matches '.s3.<region>.amazonaws.com'
   * - \/.*                        → Ensures there is at least one character after the domain
   */
  const match = url.match(/^https:\/\/([^.]+)\.s3\.[^.]+\.amazonaws\.com\/.+$/);
  return match?.[1] || null;
};

/**
 * Get S3 path name from the URL
 */
export const getS3Path = (url: string | null): string | null => {
  if (!url) {
    return null;
  }
  /**
   * Regex breakdown:
   * - ^https:\/\/                → Matches 'https://' at the start
   * - [^.]+\.s3\.[^.]+\.amazonaws\.com → Matches the bucket, region, and domain
   * - \/(.+)                      → Captures everything after the domain as the object path
   */
  const match = url.match(/^https:\/\/[^.]+\.s3\.[^.]+\.amazonaws\.com\/(.+)$/);
  return match?.[1] || null;
};
