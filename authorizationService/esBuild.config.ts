const esBuildConfig = {
  bundle: true,
  minify: false,
  sourcemap: true,
  exclude: ['aws-sdk'],
  target: 'node14',
  define: { 'require.resolve': undefined },
  platform: 'node',
  concurrency: 10,
};

export default esBuildConfig;
