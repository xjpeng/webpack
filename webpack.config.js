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
	   main:'./src/index.js',
	   /*
	     打包第三方类库
		 key自定义,比如下面使用vendor,你也可以使用其他名字
		 value自定义,可以是单个字符串,或者数组,数组就是将多个文件打包到一个文件
		 vendor:['vue','jquery'],
		 vendor:'vue',
	   */
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
			loader:'babel-loader',
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
	module.exports.output.publicPath='';
	module.exports.devtool= false;
	module.exports.plugins = module.exports.plugins.concat([
	
	   //处理运行时启动配置到单独文件
	   /*
         无设置vendor
		 new webpack.optimize.CommonsChunkPlugin({name:'runtime'}),
		 有设置vendor
		 new webpack.optimize.CommonsChunkPlugin({
			   names:['vendor','runtime']
		  }),
	   */

	   new webpack.optimize.CommonsChunkPlugin({name:'runtime'}),
	  
	   //压缩js生产sourceMap
	   new webpack.optimize.UglifyJsPlugin()
	]);
}
