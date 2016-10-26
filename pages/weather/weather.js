$('.btn').click(function(event) {
  /* Act on the event */
  // alert("天气");
  $.ajax({
    url: '/api/user',
    type: 'get',
    dataType: 'json',
    data: {method:"abcd",a: '1',b:"2",c:"afjfjsfjsk"},
  })
  .done(function(res) {
    alert(res.data.uname);
    var str = __uri("img/c13.gif");
    $('.main').css({backgroundImage:'url('+str+')'});
    console.log("success");
  })
  .fail(function() {
    console.log("error");
  })
  .always(function() {
    console.log("complete"); 
  });
  
});
$("#mock").click(function(event) {
  /* Act on the event */
  $.ajax({
    url: '/api/user',
    type: 'get',
    dataType: 'json',
    data: {method:"bdca",a: '2',b:"3",c:"464646"},
  })
  .done(function(res) {
    alert(res.data.uname);
    console.log("success");
  })
  .fail(function() {
    console.log("error");
  })
  .always(function() {
    console.log("complete");
  });
  
});

$('#mock_data').click(function(event) {
  /* Act on the event */
  $.ajax({
    url: '/api/dynamic/time',
    type: 'GET',
    dataType: 'json'
    // data: {param1: 'value1'},
  })
  .done(function(res) {
    alert(res.data.uname+res.data.uage);
    // console.log(res.data.uname+">>"+res.data.uid);
  })
  .fail(function(res) {
    console.log('fail');
  })
  .always(function(res) {
    console.log('always');
  });
});