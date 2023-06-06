/** @type {import('@babel/core').TransformOptions['plugins']} */
const plugins = [
  [
    /** Enables baseUrl: "./" option in tsconfig.json to work @see https://github.com/entwicklerstube/babel-plugin-root-import */
    "babel-plugin-root-import",
    {
      paths: [
        {
          rootPathPrefix: "app/",
          rootPathSuffix: "app",
        },
        {
          rootPathPrefix: "assets/",
          rootPathSuffix: "assets",
        },
      ],
    },
  ],
  [
    'module-resolver',
    {
      root: ['./app'],
      alias: {
        '@components': './app/components',
        '@config': './app/config',
        '@models': './app/models',
        '@navigators': './app/navigators',
        '@screens': './app/screens',
        '@services': './app/services',
        '@theme': './app/theme',
        '@utils': './app/utils',
        '@svg': './assets/svg',
        '@images': './assets/images',
        '@animations': './assets/animations',
      },
    },
  ],
  /** react-native-reanimated web support @see https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/installation/#web */
  "@babel/plugin-proposal-export-namespace-from",
  /** NOTE: This must be last in the plugins @see https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/installation/#babel-plugin */
  "react-native-reanimated/plugin",
]

/** @type {import('@babel/core').TransformOptions} */
module.exports = {
  presets: ["babel-preset-expo"],
  env: {
    production: {},
  },
  plugins,
}
