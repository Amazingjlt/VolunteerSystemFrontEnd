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
        chong: ["深圳市罗湖外语学校", "学校B"],
        wen: ["学校C", "学校D"],
        bao: ["学校E", "学校F"]
      }
    }
  });
};



export const getSchoolRecord = async (score, zone, user_id, details, success, fail) => {
    await uni.request({
        url: 'https://43.139.109.104:8081/record/getSchool', // 替换为实际的API地址
        method: 'POST',
        header: {
            "Content-Type": "application/json"
        },
        data: {
            score: score,
            zone: zone,
            user_id: user_id,
            details: details
        },
        success: (res) => {
            console.log('getSchoolRecord: ok');
            if (res.statusCode === 200 && res.data.code === '200') {
                success(res.data); // 返回成功的数据
            } else {
                fail(res.data); // 返回失败的数据
            }
        },
        fail: (err) => {
            console.error('getSchoolRecord: fail', err);
            fail(err); // 返回失败的错误信息
        }
    });
};
