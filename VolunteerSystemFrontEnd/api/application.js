import { http } from './api'

//陈欣悦
export const getRecommendedSchools = async (success, fail) => {
  // 模拟请求，实际可以用 uni.request 调用后端 API
  // 这里模拟返回推荐学校数据
  success({
    data: {
      code: 200,
      msg: '',
      data: {
        chong: ["学校A", "学校B"],
        wen: ["学校C", "学校D"],
        bao: ["学校E", "学校F"]
      }
    }
  });

  // 如果需要真实请求后端，可以使用以下方式：
  /*
  await uni.request({
    url: 'http://localhost:3000/api/recommendedSchools', // 后端接口地址
    method: 'GET',
    success: (res) => {
      const statusCode = res.statusCode;
      if (statusCode === 200) {
        // 成功响应
        success(res.data);
      } else if (statusCode === 400) {
        // 客户端错误
        console.error('Bad Request: ', res.data);
        fail({ message: 'Bad Request', details: res.data });
      } else if (statusCode === 500) {
        // 服务器错误
        console.error('Internal Server Error: ', res.data);
        fail({ message: 'Internal Server Error', details: res.data });
      } else {
        // 处理其他非200的状态码
        console.error('Unexpected status code: ', statusCode, res.data);
        fail({ message: 'Unexpected status code', code: statusCode, details: res.data });
      }
    },
    fail: (err) => {
      // 网络或其他错误
      console.error('Request failed: ', err);
      fail({ message: 'Request failed', error: err });
    }
  });
  */
};
