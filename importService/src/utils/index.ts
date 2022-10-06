import { getParamsType } from 'src/types/interfacesAndTypes';
import { PathToUpload } from 'src/types/uploadedPathsEnum';

const normalizeKeyParameter = (key: string) => key.replace(/\+/g, ' ');

export const getParams: getParamsType = (
  bucketName,
  key,
  expires,
  contentType,
) => ({
  Bucket: bucketName,
  Key: normalizeKeyParameter(key),
  ...(expires && { Expires: expires }),
  ...(contentType && { ContentType: contentType }),
});

export const createKeyForParsedFile = (key) =>
  `${PathToUpload.parsedFolder}${key.slice(
    key.lastIndexOf('/'),
    key.lastIndexOf('.'),
  )}.json`;
