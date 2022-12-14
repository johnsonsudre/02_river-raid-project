const obstaclesConfig = {
  initialPos: -10,
  numObstacles: 5,
  numRows: 6,
  widthSize: 16,
  get offset() {
    const result = this.widthSize / (this.numObstacles - 1);
    return result;
  },
};

export { obstaclesConfig };
