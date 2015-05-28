function ajaxRequest(method, url, formid){
      var session = getCookie("sessionident") + '.noise.n4sjamk.org:5300';
      var ajaxTo = 'http://'+ session + url;
      console.log(ajaxTo);
      console.log(url);
      if(url == '/login' || url == '/logout')
      {
	console.log('gets');
        ajaxTo = 'http://management.noise.n4sjamk.org' + url
	console.log(ajaxTo);
      }
      $.ajax({
      type: method,
      contentType: "application/json",
      url: ajaxTo,
      data: JSON.stringify(getFormData($("#"+formid))),
      headers: {'Authorization': getCookie("sessionpassword")},
      dataType: "json",
      beforeSend: function(){
        $("#status").removeClass();
      }
      })
        .done(function(data) {
          console.log("AJAX SUCCESS" + data);
          $("#status").addClass('alert alert-success');
          $("#status").text("Response: " + data).show();
          if(url == '/login')
          {
            $("#login_li").html('<a href="/gui/logout">Logout</a>');
            $("#configureform").hide();
            setTimeout(function(){document.location.href = '/gui/welcome';},1200);
          }
          if(url == '/logout')
          {
            $("#login_li").html('<a href="/gui/login">Login</a>');
          }
         })
        .fail(function(xhr) {
          $("#status").addClass('alert alert-danger');
          $("#status").text("Response: " + xhr.responseText).show();
        });
    }

function getFormData($form){
        var unindexed_array = $form.serializeArray();
        var indexed_array = {};
          $.map(unindexed_array, function(n, i){
           indexed_array[n['name']] = n['value'];
         });
        return indexed_array;
      }

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
    }
    return "";
}
