const swaggerConfig = {
  title: 'Products API',
  generateSwaggerOnDeploy: true,
  typefiles: ['./src/types/interfaces.d.ts'],
  useStage: true,
  basePath: '/dev',
  apiKeyHeaders: 'Access-Control-Allow-Origin',
  host: 't9dwam4asf.execute-api.eu-west-1.amazonaws.com',
};

export default swaggerConfig;
