// global socketio
$(document).ready(function(){
});
  
$(document).ready(function(){
  $('.loading').hide();
})
.ajaxStart(function(){
  $('.loading').show();
})
.ajaxStop(function(){
  $('.loading').hide();
});

var protocol = window.location.protocol;
var frameSocket = io.connect(protocol + "//" + document.domain + ":" + location.port + "/framework");

frameSocket.on('notify', function(data){
  $.notify({
    message : data['msg'],
    url: data['url'],
    target: '_self'
  },{
    type: data['type'],
  });
});

frameSocket.on('modal', function(data){
  m_modal(data.data, data.title, false);
});

frameSocket.on('command_modal_add_text', function(data){
  document.getElementById("command_modal_textarea").innerHTML += data ;
  document.getElementById("command_modal_textarea").scrollTop = document.getElementById("command_modal_textarea").scrollHeight;
});

frameSocket.on('command_modal_show', function(data){
  command_modal_show(data)
});

frameSocket.on('command_modal_clear', function(data){
  document.getElementById("command_modal_textarea").innerHTML = ""
});

frameSocket.on('loading_hide', function(data){
  $('#loading').hide();
});

frameSocket.on('refresh', function(data){
  console.log('data')
  window.location.reload();
});






///////////////////////////////////////
// Global - 버튼
///////////////////////////////////////

$("body").on('click', '#globalOpenBtn', function(e) {
  e.preventDefault();
  url = $(this).data('url')
  window.open(url, "_blank");
});

$("body").on('click', '#globalLinkBtn', function(e) {
  e.preventDefault();
  url = $(this).data('url')
  window.location.href = url;
});

// global_link_btn 모두 찾아 변경

$("body").on('click', '#globalSettingSaveBtn', function(e){
  e.preventDefault();
  globalSettingSave();
});

function globalSettingSave() {
  var formData = get_formdata('#setting');
  $.ajax({
    url: '/' + PACKAGE_NAME + '/ajax/setting_save',
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

$("body").on('click', '#globalEditBtn', function(e) {
  e.preventDefault();
  file = $(this).data('file');
  console.log(file);
  $.ajax({
    url: '/global/ajax/is_available_edit',
    type: "POST", 
    cache: false,
    data: {},
    dataType: "json",
    success: function (ret) {
      if (ret) {
        window.location.href = '/flaskcode?open=' + file;
      } else {
        notify('편집기 플러그인을 설치해야 합니다.', 'warning');
      }
    }
  });
});



///////////////////////////////////////
// Global - 함수
///////////////////////////////////////

function globalSendCommand(command, arg1, arg2, arg3, modal_title, callback) {
  console.log("globalSendCommand [" + command + '] [' + arg1 + '] [' + arg2 + '] [' + arg3 + '] [' + modal_title + '] [' + callback);
  console.log('/' + PACKAGE_NAME + '/ajax/' + MODULE_NAME + '/command');

  $.ajax({
    url: '/' + PACKAGE_NAME + '/ajax/' + MODULE_NAME + '/command',
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


///////////////////////////////////////
// 파일 선택 모달
///////////////////////////////////////

var select_local_file_modal_callback = null;

function selectLocalFile(title, init_path, func) {
  _selectLocalFileModal(title, init_path, false, func);
}

function selectLocalFolder(title, init_path, func) {
  _selectLocalFileModal(title, init_path, true, func);
}

function _selectLocalFileModal(title, init_path, only_dir, func) {
  if (init_path == '' || init_path == null)
    init_path = '/';
  document.getElementById("select_local_file_modal_title").innerHTML = title;
  document.getElementById("select_local_file_modal_path").value = init_path;
  document.getElementById("select_local_file_modal_only_dir").value = only_dir;
  select_local_file_modal_callback = func;
  $("#select_local_file_modal").modal();
  listdir(init_path, only_dir);
}

$("body").on('click', '#global_select_local_file_load_btn', function(e) {
  e.preventDefault();
  let current_path = $('#select_local_file_modal_path').val().trim();
  only_dir = $('#select_local_file_modal_only_dir').val().trim();
  listdir(current_path, only_dir);
});

$("body").on('click', '#select_local_file_modal_confirm_btn', function(e) {
  e.preventDefault();
  if (select_local_file_modal_callback != null)
    select_local_file_modal_callback($('#select_local_file_modal_path').val().trim());
  $("#select_local_file_modal").modal('toggle');
});


let listdir = (path = '/', only_dir = true) => {
  $.ajax({
      url: `/global/ajax/listdir`,
      type: 'POST',
      cache: false,
      data: {
          path: path,
          only_dir : only_dir
      },
      dataType: 'json'
  }).done((datas) => {
    console.log(datas)
      if (datas.length == 0) {
        return false;
      }
      let new_obj = ``;
      const path_spliter = (path.indexOf('/')>=0)?'/':'\\';
      $('#select_local_file_modal_list_group').empty();
      for (let dt of datas) {
          tmp = dt.split('|');
          new_obj += `<a href='#' class="list-group-item list-group-item-action item_path" data-value="${tmp[1]}">${tmp[0]}</a>`;
      }
      $('#select_local_file_modal_list_group').append(new_obj);
      $('.item_path').off('click').click((evt) => {
          
          let new_path = '';
          /*
          if ($(evt.currentTarget).text() === '..'){
              let split_path = '';
              split_path = path.split(path_spliter);
              split_path.pop();
              new_path = split_path.join(path_spliter);
              if (new_path.length === 0){
                  new_path = path_spliter
              }
          } else {
              //new_path = (path !== path_spliter) ? path + path_spliter + $(evt.currentTarget).text() : path + $(evt.currentTarget).text();
              new_path = $(evt.currentTarget).data('value');
              console.log(new_path)
              console.log(evt)

          }
          */
          new_path = $(evt.currentTarget).data('value');
          $('#select_local_file_modal_path').val(new_path);
          listdir(new_path, only_dir);
          
      });
  }).fail((datas) => {
      $.notify('<strong>경로 읽기 실패</strong><br/>${add_path}', {type: 'danger'});
  });
  return false;
}
// 파일 선택 모달 End
///////////////////////////////////////
