const path = require('path');
const webpack = require('webpack');
//html创建文件
const HtmlWebpackPlugin = require('html-webpack-plugin');
//清空目录
const CleanWebpackPlugin = require('clean-webpack-plugin');

//抽取css到单独文件
const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin');

//分析包
//const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
 
module.exports={
   entry:{
	   main:'./src/index.js'
   },
   output:{
      path:path.resolve(__dirname,'dist/'),
	  filename:'js/[name].[hash].js',
	  chunkFilename:'js/[name].[hash].js',
   },
   module:{
	   rules:[
	      {
			 test:/\.vue$/,
			 loader: 'vue-loader'
		  },
	      {
		     test:/\.svg|png|jpg|gif$/,
			 loader:'url-loader',
			 options:{
				limit:8192,
				name:'images/[name].[hash:8].[ext]'
			 }
		  },
		  {
			 test:/\.css$/,
			 //提前css到单独文件
			 use:ExtractTextWebpackPlugin.extract({
				fallback:'style-loader',
				use:[
						{
							loader:'css-loader',
							options:{
								minimize:true
							}
						}
				]
			 })
		  },
		  {
			test:/\.js$/,
			exclude:/node_modules/,
			use:{
				loader:'babel-loader',
				options:{
					presets:['env'],
					
					//更多高级特性配置plugins
					plugins:['syntax-dynamic-import','transform-es2015-template-literals']
				}
			}
		  }
	   ]
	   
   },
   plugins:[
      //清空文件夹
      new CleanWebpackPlugin('dist'),
	  //热模块切换
      new webpack.HashedModuleIdsPlugin(),
	  //分析插件
	  //new BundleAnalyzerPlugin(),
	  //提取css文件名称
	  new ExtractTextWebpackPlugin('css/[name].[contenthash].css'),
	  //生成html文件
      new HtmlWebpackPlugin({
		  title:'webpack',
		  template:'./src/template.html'
	  })
   ],
   //配置模块路径
   resolve: {
      alias: {
      'vue$': 'vue/dist/vue.esm.js'
      }
    },
	//开发调试服务器
   devServer:{
	   historyApiFallback:true,
	   contentBase:'./dist'
   },
   devtool:'eval-source-map'
};
if(process.env.NODE_ENV==='production'){
	//开发调试模式配置chunkhash会报错
	module.exports.output.filename='js/[name].[chunkhash].js';
	module.exports.output.chunkFilename='js/[name].[chunkhash].js';
	module.exports.devtool='source-map';
	module.exports.plugins = (module.exports.plugins||[]).concat([
	
	  //定义环境
	  new webpack.DefinePlugin({
       'process.env': {
        NODE_ENV: '"production"'
        }
       }),
	   //处理相同的异步加载模块到单独文件
	   new webpack.optimize.CommonsChunkPlugin({async:'common'}),
	   //处理运行时启动配置到单独文件
	   new webpack.optimize.CommonsChunkPlugin({name:'runtime'}),
	   //压缩js生产sourceMap
	   new webpack.optimize.UglifyJsPlugin({
		   sourceMap:true,
		   compress:{
			   warnings:false
		   }
	   })
	]);
}
