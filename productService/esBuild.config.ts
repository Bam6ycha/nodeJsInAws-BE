// const envPlugin = {
//   name: 'env',
//   setup: function (build) {
//     // Intercept import paths called "env" so esbuild doesn't attempt
//     // to map them to a file system location. Tag them with the "env-ns"
//     // namespace to reserve them for this plugin.
//     build.onResolve({ filter: /^env$/ }, (args) => ({
//       path: args.path,
//       namespace: 'env-ns',
//     }));

//     // Load paths tagged with the "env-ns" namespace and behave as if
//     // they point to a JSON file containing the environment variables.
//     build.onLoad({ filter: /.*/, namespace: 'env-ns' }, () => ({
//       contents: JSON.stringify(process.env),
//       loader: 'json',
//     }));
//   },
// };

const esBuildConfig = {
  bundle: true,
  minify: true,
  sourcemap: true,
  exclude: ['aws-sdk'],
  target: 'node14',
  define: { 'require.resolve': undefined },
  platform: 'node',
  concurrency: 10,
  // plugins: [envPlugin],
};

export default esBuildConfig;
