/**
 * @description: 获取城市、区域、项目列表
 * @param {object} data 地图项目返回的接口数据
 * @return: { cityList, districtList, projectList }
 */
export const getAllList = (data) => {
  const cityList = data.items || []; // 所有城市数据数组
  let districtList = []; // 所有区域数据数组
  let projectList = []; // 所有项目数组

  // 获取所有的区域
  cityList.length > 0 &&
    cityList.forEach((city) => {
      city.name = city.city_name
      if (
        Object.hasOwnProperty.call(city, "children") &&
        city.children.length > 0
      ) {
        districtList = districtList.concat(city.children);
      }
    });

  // 获取所有的项目
  districtList.length > 0 &&
    districtList.forEach((district) => {
        district.name = district.district_name
      if (
        Object.hasOwnProperty.call(district, "children") &&
        district.children.length > 0
      ) {
        projectList = projectList.concat(district.children);
      }
    });

  return {
    cityList,
    districtList,
    projectList,
  };
};
