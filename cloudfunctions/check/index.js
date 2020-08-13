// 云函数模板
// 部署：在 cloud-functions/login 文件夹右击选择 “上传并部署”

const cloud = require('wx-server-sdk')
const request = require('request');

// 初始化 cloud
cloud.init({
  // API 调用都保持和云函数当前所在环境一致
  env: cloud.DYNAMIC_CURRENT_ENV
})

let result = { status: 500, msg: '无效请求', data: null };

/**
 * 这个示例将经自动鉴权过的小程序用户 openid 返回给小程序端
 * 
 * event 参数包含小程序端调用传入的 data
 * 
 */
exports.main = async (event, context) => {
  console.log(event)
  const wxContext = cloud.getWXContext()

  switch (event.api) {
    case 'checkImg':
      return checkImg(event, wxContext.OPENID);
  }

}


//检查图片
async function checkImg(event, _openid) {

  let url = 'https://aip.baidubce.com/rpc/2.0/ai_custom/v1/segmentation/mangdao';
  let data = { image: event.image ,threshold:0.6};
  // let { access_token } = await getToken();
  let access_token = '24.b5b52a37d1c9530127ef41fa360812df.2592000.1599829253.282335-21958782';
  try {
    let checkRes = await req({
      url: `${url}?access_token=${access_token}`,
      method:"POST",
      headers: {//设置请求头
        "content-type": "application/json",
      },
      body:JSON.stringify( data)
    });
    result.status = 200;
    result.msg = '检测完成';
    result.data = JSON.parse(checkRes);
    return result;
  } catch (e) {
    result.msg = '检测失败';
    result.data = e;
    return result;
  }
}

//获取token
async function getToken() {

  let url = `https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=SpGNVAc5jWrxzjczHU9rT51B&client_secret=Fgd8rDxY9OBkPIfyXSAPbfpwTAGeugZP`;
  let res = await req({ url, method: "GET" });
  console.log(res);
  return JSON.parse(res);
}
async function req(options) {

  return new Promise((resolve, reject) => {
    request(options, (error, response, body) => {
      if (!error && response.statusCode == 200) {
        resolve(response.body)
      } else {
        reject(response.body);
      }
    })
  });
}






