module.exports = {
  test: /\.(png|jpe?g|gif|svg)$/,
  type: 'asset/resource',
  generator: {
    filename: 'img/[contenthash][ext]'
  }
}
