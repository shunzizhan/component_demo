module.exports = function(req, res, next) {

  var _name = ["张三","李四","王五"];
  var _age =[12,15,25];
  var _index = parseInt(3*Math.random());

  var _data = {
    "error": 0,
    "message": "ok",
    "data": {
      "uname": _name[_index],
      "uage": _age[_index],
      "ucity":req
    }
  }
  res.write(JSON.stringify(_data));

  // set custom header.
  // res.setHeader('xxxx', 'xxx');

  res.end("");
  // return res;
  // res.write('{"error": 0,"message": "ok","data": {"uname": "_name[_index]", "uage": "_age[_index]"}}');
  // res.end()
};