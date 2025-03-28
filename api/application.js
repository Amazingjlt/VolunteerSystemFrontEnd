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
        url: 'http://43.139.109.104:8081/record/getSchool', // 替换为实际的API地址
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

/**
 * 获取所有记录
 * @param {number} user_id - 用户ID
 * @returns {Promise} - 返回接口请求的 Promise 对象
 */
export const getHistoryRecord = (user_id) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: 'http://43.139.109.104:8081/record/getAllRecord', // 接口地址
      method: 'POST', // 请求方法
      header: {
        'Content-Type': 'application/json' // 请求头
      },
      data: {
        user_id // 请求参数
      },
      success: (res) => {
        if (res.statusCode === 200 && res.data.code === '200') {
          resolve(res.data.data); // 返回数据
        } else {
          reject(res.data.msg || '获取记录失败'); // 返回错误信息
        }
      },
      fail: (err) => {
        reject('请求失败，请检查网络'); // 请求失败
      }
    });
  });
};

/**
点击历史查询获取推荐学校
 */
export const getHistorySchool = async (score, zone, success, fail) => {
    await uni.request({
        url: 'http://43.139.109.104:8081/record/getRecord', 
        method: 'POST',
        header: {
            "Content-Type": "application/json"
        },
        data: {
            score: score,
            zone: zone
        },
        success: (res) => {
            console.log('getHistorySchool: ok');
            if (res.statusCode === 200 && res.data.code === '200') {
                success(res.data); // 返回成功的数据
            } else {
                fail(res.data); // 返回失败的数据
            }
        },
        fail: (err) => {
            console.error('getHistorySchool: fail', err);
            fail(err); // 返回失败的错误信息
        }
    });
};
// 实际是UserID
export const getOpenID = async (code) => {
    return new Promise((resolve, reject) => {
        uni.request({
            url: 'http://43.139.109.104:8081/user/wx_login', // 替换为实际的请求地址
            method: 'POST',
            header: {
                "Content-Type": "application/json"
            },
            data: {
                code: code
            },
            success: (res) => {
                if (res.statusCode === 200 && res.data.code === '200') {
                    resolve(res.data.data); // 成功时调用 resolve
                } else {
                    reject(res.data); // 失败时调用 reject
                }
            },
            fail: (err) => {
                console.error('获取userID失败:', err);
                reject(err); // 请求失败时调用 reject
            }
        });
    });
};

// 后端并不会返回手机号回来
export const setPhone = (code,userid,callback) => {
    uni.request({
        url: 'http://43.139.109.104:8081/user/phone', // 替换为实际的请求地址
        method: 'POST',
        header: {
            "Content-Type": "application/json"
        },
        data: {
            code: code,
			userid : userid
        },
        success: (res) => {
            if (res.statusCode === 200 && res.data.msg=="success") {
				console.log('后端设置手机号成功');
				callback();
				uni.setStorageSync("phoneState","success");
            } else {
				console.log('后端获取手机号失败',res.data.msg);
            }
        },
        fail: (err) => {
            console.error('setPhone: fail', err);
        }
    });
};