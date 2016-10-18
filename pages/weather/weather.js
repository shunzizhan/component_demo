$('.btn').click(function(event) {
  /* Act on the event */
  // alert("天气");
  $.ajax({
    url: '/api/user',
    type: 'get',
    dataType: 'json',
    // data: {param1: 'value1'},
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
$("#mock").click(function(event) {
  /* Act on the event */
  $.ajax({
    url: '/api/mock',
    type: 'get',
    dataType: 'json',
    // data: {param1: 'value1'},
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