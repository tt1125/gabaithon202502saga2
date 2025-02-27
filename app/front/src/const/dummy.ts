export const DUMMY_DATA = {
  easy: {
    point1: {
      lat: 33.373914,
      lng: 130.206551,
      name: "地点1",
    },
    point2: {
      lat: 33.373578,
      lng: 130.208156,
      name: "地点2",
    },
    point3: {
      lat: 33.371796,
      lng: 130.20775,
      name: "地点3",
    },
  } as Route,
  normal: {
    point1: {
      lat: 33.373914,
      lng: 130.206551,
      name: "地点1",
    },
    point2: {
      lat: 33.374, // 緯度を少し変更
      lng: 130.209, // 経度を少し変更
      name: "地点2",
    },
    point3: {
      lat: 33.372,
      lng: 130.207,
      name: "地点3",
    },
  },
  hard: {
    point1: {
      lat: 33.373914,
      lng: 130.206551,
      name: "地点1",
    },
    point2: {
      lat: 33.374, // 緯度を少し変更
      lng: 130.209, // 経度を少し変更
      name: "地点2",
    },
    point3: {
      lat: 33.372, // 緯度を少し変更
      lng: 130.205, // 経度を少し変更
      name: "地点3",
    },
  } as Route,
};
