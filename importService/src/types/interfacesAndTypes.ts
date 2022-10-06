export type getParamsType = (
  bucketName: string,
  key: string,
  expires?: Date | number,
  contentType?: string,
) => {
  Bucket: string;
  Key: string;
  Expires?: typeof expires;
  ContentType?: string;
};
