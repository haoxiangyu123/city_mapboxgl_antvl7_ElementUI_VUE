const mockjs = require("mockjs");
const wuhan_building=require('./GIS_DATA/Wuhan_Buildings.json')
const wuhan_roads=require('./GIS_DATA/Wuhan_roads.json')
const wuhan_events=require('./GIS_DATA/Wuhan_events.json')
const testData=require('./GIS_DATA/test.json')

module.exports = () => {
  return mockjs.mock({
    wuhan_building,
    wuhan_roads,
    wuhan_events,
    testData
  });
};
