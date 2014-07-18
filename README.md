hexo-additional-asset
=====================
* 博客中引用的图片，使用qiniu-sync插件自动同步到云端。
* 本插件在其基础上进行扩展，在新建post的时候自动在图片存放的目录下创建一个与post文件名相同的目录用于存放该post的所有图片。
* 在myqnimg
tag中只需要填写图片文件名，在生成html页面时图片的url信息会通过helper（replaceImgFileName）进行补全。
所以需要修改theme中的article.ejs将<%- item.content %>
修改为<%- replaceImgFileName(item.content,page.source) %>