type Route = {
  origin: Point;
  point1: Point;
  point2: Point;
  point3: Point;
};

type Point = {
  lat: number;
  lng: number;
  name: string;
};

type SuggestedRoutes = {
  easy: {
    point1: Point;
    point2: Point;
    point3: Point;
  };
  normal: {
    point1: Point;
    point2: Point;
    point3: Point;
  };
  hard: {
    point1: Point;
    point2: Point;
    point3: Point;
  };
};
