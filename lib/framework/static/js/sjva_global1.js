

///////////////////////////////////////////////////////////////////////////////
// 공용 버튼
///////////////////////////////////////////////////////////////////////////////


//  global_cache_confirm_btn => global_offcloud_cache_confirm_btn
$("body").on('click', '#global_offcloud_cache_confirm_btn', function(e){
  e.preventDefault();
  hash = $(this).data('hash');
  $.ajax({
    url: '/offcloud2/ajax/hash',
    type: "POST", 
    cache: false,
    data:{hash:hash},
    dataType: "json",
    success: function (data) {
      if (data == 'true') {
        $.notify('<strong>캐쉬 되어 있습니다.</strong>', {
          type: 'success'
        });
      } else if (data == 'false') {
        $.notify('<strong>캐쉬 되어 있지 않습니다.</strong>', {
          type: 'warning'
        });
      } else if (data == 'fail') {
        $.notify('<strong>캐쉬 확인 실패</strong>', {
          type: 'warning'
        });
      }
    }
  });
  //$(location).attr('href', '/offcloud/cache?magnet=' + hash)
});

//global_add_remote_btn -> global_offcloud_add_btn
$("body").on('click', '#global_offcloud_add_btn', function(e) {
  e.preventDefault();
  hash = $(this).data('hash');
  $.ajax({
    url: '/offcloud2/ajax/add_remote',
    type: "POST", 
    cache: false,
    data: {hash:hash},
    dataType: "json",
    success: function (data) {
      m_modal(data)
    }
  });
});


$("body").on('click', '#global_downloader_add_btn', function(e){
  e.preventDefault();
  download_url = $(this).data('hash');
  $.ajax({
    url: '/downloader/ajax/add_download',
    type: "POST", 
    cache: false,
    data: {download_url:download_url},
    dataType: "json",
    success: function (data) {
      show_result_add_download(data);
    }
  });
});

function command_modal_show(title) {
  ClientHeight = window.innerHeight
  document.getElementById("command_modal_title").innerHTML = title
  $("#command_modal").height(ClientHeight-100);
  $("#command_modal_textarea").height(ClientHeight-380);
  $("#command_modal").modal();
}


// 토렌트 프로그램에 다운로드 추가할 결과를 보여주는
function show_result_add_download(data) {
  try {
    sub = ''
    program = '토렌트'
    if (data.default_torrent_program == '0') {
      program = '트랜스미션에 토렌트'
      sub = 'transmission'
    } else if (data.default_torrent_program == '1') {
      program = '다운로드스테이션에 토렌트'
      sub = 'downloadstation'
    } else if (data.default_torrent_program == '2') {
      program = '큐빗토렌트다에 토렌트'
      sub = 'qbittorrent'
    } else if (data.default_torrent_program == '3') {
      program = 'aria2에 토렌트'
      sub = 'aria2'
    } else if (data.default_torrent_program == '4') {
      program = 'PikPak에 토렌트'
      sub = 'pikpak'
    }
  }
  catch {
  }
  if (data.ret == 'success') {
    $.notify({message:'<strong>'+ program +'를 추가하였습니다.</strong><br>클릭시 다운로드 상태창으로 이동', url:'/downloader/'+sub+'/status',
      target: '_self'}, {
      type: 'success',
    });
  } else if (data.ret == 'success2') {
    $.notify('<strong>일반 파일 다운로드를 시작하였습니다.</strong>', {
      type: 'success'
    });
  } else if (data.ret == 'fail') {
    $.notify('<strong>'+ program +' 추가에 실패하였습니다.</strong>', {
      type: 'warning'
    });
  } else {
    $.notify('<strong>'+ program +' 추가 에러<br>'+data.error+'</strong>', {
      type: 'warning'
    });
  }
}




$("body").on('click', '#global_torrent_info_btn', function(e) {
  e.preventDefault();
  hash = $(this).data('hash');
  $.ajax({
    url: '/torrent_info/ajax/torrent_info',
    type: "POST", 
    cache: false,
    data: {hash:hash},
    dataType: "json",
    success: function (data) {
      m_modal(data, "토렌트 정보")
    }
  });
});

function get_torrent_program_name(p) {
  if (p == '0') return  '트랜스미션'
  else if (p == '1') return '다운로드스테이션'
  else if (p == '2') return '큐빗토렌트'
  else if (p == '3') return 'aria2'
  else if (p == '4') return 'PikPak'
}


function global_relay_test(remote) {
  $.ajax({
    url: '/' + 'gd_share_client' + '/ajax/'+'base'+'/relay_test',
    type: "POST", 
    cache: false,
    data: {remote:remote},
    dataType: "json",
    success: function (data) {
      if (data.ret == 'success') {
        $.notify('<strong>릴레이 공유가 가능합니다.<strong>', {type: 'success'});
      }else {
        $.notify('<strong>설정이 잘못 되어 있습니다.</strong>', {type: 'warning'});
      }
    }
  });
}       




function shutdown_confirm() {
  document.getElementById("confirm_title").innerHTML = "종료 확인";
  document.getElementById("confirm_body").innerHTML = "종료 하시겠습니까?";
  $('#confirm_button').attr('onclick', 'window.location.href = "/system/shutdown";');
  $("#confirm_modal").modal();
}

$("#video_modal").on('hidden.bs.modal', function () {
  document.getElementById("video_modal_video").pause();
  //streaming_kill();
});

$("#video_modal").on('click', '#trailer_close_btn', function(e){
  e.preventDefault();
  document.getElementById("video_modal_video").pause();
  //streaming_kill();
});

function streaming_kill(command, data={}) {
  $.ajax({
    url: '/' + 'ffmpeg' + '/ajax/streaming_kill',
    type: "POST", 
    cache: false,
    data:{},
    dataType: "json",
    success: function (data) {
    }
  });
}





///////////////////////////////////////////////////////////////////////////////
// Global.. JS 파일로 뺄것
///////////////////////////////////////////////////////////////////////////////

// 사용 on / off
$('#global_scheduler').change(function() {
  var ret = $(this).prop('checked');
  $.ajax({
    url: '/'+package_name+'/ajax/scheduler',
    type: "POST", 
    cache: false,
    data: {scheduler : ret},
    dataType: "json",
    success: function (list) {
    }
  });
});

$('#global_scheduler_sub').change(function() {
  var ret = $(this).prop('checked');
  $.ajax({
    url: '/'+package_name+'/ajax/scheduler',
    type: "POST", 
    cache: false,
    data: {scheduler : ret, sub:sub},
    dataType: "json",
    success: function (list) {
    }
  });
});


function global_setting_save_function() {
  var formData = get_formdata('#setting');
  $.ajax({
    url: '/'+package_name+'/ajax/setting_save',
    type: "POST", 
    cache: false,
    data: formData,
    dataType: "json",
    success: function (ret) {
      if (ret) {
        $.notify('<strong>설정을 저장하였습니다.</strong>', {
          type: 'success'
        });
      } else {
        $.notify('<strong>설정 저장에 실패하였습니다.</strong>', {
          type: 'warning'
        });
      }
    }
  });
}

$("#global_one_execute_btn").click(function(e) {
//$("body").on('click', '#one_execute_btn', function(e){
  e.preventDefault();
  $.ajax({
    url: '/' + package_name + '/ajax/one_execute',
    type: "POST", 
    cache: false,
    data: {},
    dataType: "json",
    success: function (ret) {
      if (ret=='scheduler' || ret=='thread') {
        $.notify('<strong>작업을 시작하였습니다. ('+ret+')</strong>', {
          type: 'success'
        });
      } else if (ret == 'is_running') {
        $.notify('<strong>작업중입니다.</strong>', {
          type: 'warning'
        });
      } else {
        $.notify('<strong>작업 시작에 실패하였습니다.</strong>', {
          type: 'warning'
        });
      }
    }
  });
});
  
$("#global_one_execute_sub_btn").click(function(e) {
//$("body").on('click', '#one_execute_btn', function(e){
  e.preventDefault();
  $.ajax({
    url: '/' + package_name + '/ajax/one_execute',
    type: "POST", 
    cache: false,
    data: {sub:sub},
    dataType: "json",
    success: function (ret) {
      if (ret=='scheduler' || ret=='thread') {
        $.notify('<strong>작업을 시작하였습니다. ('+ret+')</strong>', {
          type: 'success'
        });
      } else if (ret == 'is_running') {
        $.notify('<strong>작업중입니다.</strong>', {
          type: 'warning'
        });
      } else {
        $.notify('<strong>작업 시작에 실패하였습니다.</strong>', {
          type: 'warning'
        });
      }
    }
  });
});

$("body").on('click', '#global_immediately_execute_sub_btn', function(e){
  e.preventDefault();
  $.ajax({
    url: '/' + package_name + '/ajax/immediately_execute',
    type: "POST", 
    cache: false,
    data: {sub:sub},
    dataType: "json",
    success: function (ret) {
      if (ret.msg != null) notify(ret.msg, ret.ret);
    }
  });
});

$("body").on('click', '#global_reset_db_btn', function(e){
  e.preventDefault();
  document.getElementById("confirm_title").innerHTML = "DB 삭제";
  document.getElementById("confirm_body").innerHTML = "전체 목록을 삭제 하시겠습니까?";
  $('#confirm_button').attr('onclick', "global_db_delete();");
  $("#confirm_modal").modal();
  return;
});
  
function global_db_delete() {
  $.ajax({
    url: '/' + package_name + '/ajax/reset_db',
    type: "POST", 
    cache: false,
    data: {},
    dataType: "json",
    success: function (data) {
      if (data) {
        $.notify('<strong>삭제하였습니다.</strong>', {
          type: 'success'
        });
      } else {
        $.notify('<strong>삭제에 실패하였습니다.</strong>',{
          type: 'warning'
        });
      }
    }
  });
}

$("body").on('click', '#global_reset_db_sub_btn', function(e){
  e.preventDefault();
  document.getElementById("confirm_title").innerHTML = "DB 삭제";
  document.getElementById("confirm_body").innerHTML = "전체 목록을 삭제 하시겠습니까?";
  $('#confirm_button').attr('onclick', "global_db_delete_sub();");
  $("#confirm_modal").modal();
  return;
});
  
function global_db_delete_sub() {
  $.ajax({
    url: '/' + package_name + '/ajax/reset_db',
    type: "POST", 
    cache: false,
    data: {sub:sub},
    dataType: "json",
    success: function (data) {
      if (data) {
        $.notify('<strong>삭제하였습니다.</strong>', {
          type: 'success'
        });
      } else {
        $.notify('<strong>삭제에 실패하였습니다.</strong>',{
          type: 'warning'
        });
      }
    }
  });
}

function global_sub_request_search(page, move_top=true) {
  var formData = get_formdata('#form_search')
  formData += '&page=' + page;
  $.ajax({
    url: '/' + package_name + '/ajax/' + sub + '/web_list',
    type: "POST", 
    cache: false,
    data: formData,
    dataType: "json",
    success: function (data) {
      current_data = data;
      if (move_top)
        window.scrollTo(0,0);
      make_list(data.list)
      make_page_html(data.paging)
    }
  });
}


$("body").on('click', '#global_json_btn', function(e){
  e.preventDefault();
  var id = $(this).data('id');
  for (i in current_data.list) {
    if (current_data.list[i].id == id) {
      m_modal(current_data.list[i])
    }
  }
});

$("body").on('click', '#global_reset_btn', function(e){
  e.preventDefault();
  document.getElementById("order").value = 'desc';
  document.getElementById("option").value = 'all';
  document.getElementById("search_word").value = '';
  global_sub_request_search('1')
});

$("body").on('click', '#global_remove_btn', function(e) {
  e.preventDefault();
  id = $(this).data('id');
  $.ajax({
    url: '/'+package_name+'/ajax/'+sub+ '/db_remove',
    type: "POST", 
    cache: false,
    data: {id:id},
    dataType: "json",
    success: function (data) {
      if (data) {
        $.notify('<strong>삭제되었습니다.</strong>', {
          type: 'success'
        });
        global_sub_request_search(current_data.paging.current_page, false)
      } else {
        $.notify('<strong>삭제 실패</strong>', {
          type: 'warning'
        });
      }
    }
  });
});






//#######################################################
//플러그인 - 모듈 - 서브  구조하에서 서브 관련 함수

function global_send_command_sub(command, arg1, arg2, arg3, modal_title, callback) {
  $.ajax({
    url: '/' + package_name + '/ajax/' + sub + '/' + sub2 + '/command',
    type: "POST", 
    cache: false,
    data:{command:command, arg1:arg1, arg2:arg2, arg3},
    dataType: "json",
    success: function (ret) {
      console.log(ret);
      if (ret.msg != null) notify(ret.msg, ret.ret);
      if (ret.modal != null) m_modal(ret.modal, modal_title, false);
      if (ret.json != null) m_modal(ret.json, modal_title, true);
      if (callback != null) callback(ret);
    }
  });
}


$("body").on('click', '#global_one_execute_sublogic_btn', function(e){
  e.preventDefault();
  $.ajax({
    url: '/' + package_name + '/ajax/' + sub + '/' + sub2 + '/one_execute',
    type: "POST", 
    cache: false,
    data: {},
    dataType: "json",
    success: function (ret) {
      if (ret=='scheduler' || ret=='thread') {
        $.notify('<strong>작업을 시작하였습니다. ('+ret+')</strong>', {
          type: 'success'
        });
      } else if (ret == 'is_running') {
        $.notify('<strong>작업중입니다.</strong>', {
          type: 'warning'
        });
      } else {
        $.notify('<strong>작업 시작에 실패하였습니다.</strong>', {
          type: 'warning'
        });
      }
    }
  });
});

$("body").on('click', '#global_immediately_execute_sublogic_btn', function(e){
  e.preventDefault();
  $.ajax({
    url: '/' + package_name + '/ajax/' + sub + '/' + sub2 + '/immediately_execute',
    type: "POST", 
    cache: false,
    data: {},
    dataType: "json",
    success: function (ret) {
      if (ret.msg != null) notify(ret.msg, ret.ret);
    }
  });
});

$('#global_scheduler_sublogic').change(function() {
  var ret = $(this).prop('checked');
  $.ajax({
    url: '/'+package_name+'/ajax/' + sub + '/' + sub2 + '/scheduler',
    type: "POST", 
    cache: false,
    data: {scheduler : ret},
    dataType: "json",
    success: function (list) {
    }
  });
});





















































































































// 이동한 함수




function global_send_command(command, data={}) {
  data['command'] = command;
  $.ajax({
    url: '/' + package_name + '/ajax/' + sub + '/command',
    type: "POST", 
    cache: false,
    data:data,
    dataType: "json",
    success: function (data) {
      notify(data['msg'], data['ret']);
    }
  });
}

function global_send_command2(command, arg1, arg2, arg3, modal_title, callback) {
  $.ajax({
    url: '/' + package_name + '/ajax/' + sub + '/command',
    type: "POST", 
    cache: false,
    data:{command:command, arg1:arg1, arg2:arg2, arg3},
    dataType: "json",
    success: function (ret) {
      if (ret.msg != null) notify(ret.msg, ret.ret);
      if (ret.modal != null) m_modal(ret.modal, modal_title, false);
      if (ret.json != null) m_modal(ret.json, modal_title, true);
      if (callback != null) callback(ret);
    }
  });
}