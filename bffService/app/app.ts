import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import axios, { AxiosResponse, AxiosError } from 'axios';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3001;

app.use(express.json());

app.all('/*', (req: Request, res: Response) => {
  console.log('Original URL', req.originalUrl);
  console.log('Method', req.method);
  console.log('body', req.body);

  const { '0': recipient } = req.params;

  console.log('recipient', recipient);
  const recipientUrl = process.env[recipient];
  console.log('recipientUrl', recipientUrl);

  const { authorization } = req.headers;

  if (recipientUrl) {
    const axiosConfig = {
      method: req.method,
      url: `${recipientUrl}${req.originalUrl}`,
      headers: {
        authorization,
      },
      ...(Object.keys(req.body || {}).length > 0 && { data: req.body }),
    };

    axios(axiosConfig)
      .then((response: AxiosResponse) => {
        console.log('Response from recipient', response.data);
        res.json(response.data);
      })
      .catch((error: AxiosError) => {
        console.log('response error', JSON.stringify(error));

        if (error.response) {
          const { status, data } = error.response;

          res.status(status).json(data);
        } else {
          res.status(500).json({
            error: error.message,
          });
        }
      });
  } else {
    res.status(502).json({
      error: 'Cannot process request',
    });
  }
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});
