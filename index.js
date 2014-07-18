var log = hexo.log;
var fs = require('graceful-fs');
var htmlTag = hexo.util.html_tag;
var config = require('./config')(hexo);

// 图片文件夹路径
var imgPrefix = [config.urlPrefix, '/', config.image.folder].join('');


/** 
 * 如标签: {% myqnImgTag test/demo.png title:图片标题 alt:图片说明 'class:class1 class2' %}<br/>
 * 解析结果为:<br/>
 * <img title="图片标题" alt="图片说明" class="class1 class2" src="http://gyk001.u.qiniudn.com/images/test/demo.png/thumbnail.jpg">
 * 注意：参数值有空格的需要用引号将整个配置项括起来
 */
var myqnImgTag = function(args,content){
  var imageName =args[0];
  var imgAttr = parseAttrs(args);
  var process = (imgAttr.normal || config.offline) ? '' : config.image.thumbnail;
  delete imgAttr.normal;
  imgAttr.src  = [imgPrefix,'/', ':FILENAME:','/',imageName , process].join('');
 
  return htmlTag('img', imgAttr);
};

/** 
 * 将markdown里的tag 数组解析成配置对象<br/>
 * 如标签: {% myqnImgTag test/demo.png title:图片标题 alt:图片说明 'class:class1 class2' %}<br/>
 * 则传入参数为: ['test/demo.png', 'title:图片标题', 'alt:图片说明', 'class:class1 class2'] <br/>
 * 解析结果为:{ title: '图片标题',  alt: '图片说明', class: 'class1 class2'}<br/>
 * 注意：参数值有空格的需要用引号将整个配置项括起来
 */
var parseAttrs = function(argArray){
  var attrs = {};
  for(var i=1;i< argArray.length ;i++){
    var txt = argArray[i];
    if(txt.length>2){
      if(txt[0]==='\'' || txt[0]==='"'){
        txt=txt.substring(1,txt.length-1);
      }
    }
    var parseAttr = txt.split(':');
    attrs[parseAttr[0]] = parseAttr[1];
  }
  return attrs;
}

hexo.extend.tag.register('myqnimg',myqnImgTag);

hexo.on('new', function(path,content){
	var splitedPath=path.split("/");
    var filename=splitedPath[splitedPath.length-1];
	var splitedFileName=filename.split(".");
	var target ='source/'+ config.local_dir+"/"+config.image.folder+"/"+splitedFileName[0];
    fs.mkdir(target);
    console.info('目录创建完成：'+target);
});

hexo.extend.helper.register('replaceImgFileName', function(str,filename){
	var newFilename=filename.substring(7,filename.indexOf('.md'));	
  return str.replace(/\/:FILENAME:\//g,"/"+newFilename+"/");
});