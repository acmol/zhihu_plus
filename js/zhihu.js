/*
* @Author: acmol
* @Date:   2016-05-19 05:50:02
* @Last Modified by:   acmol
* @Last Modified time: 2016-05-19 08:27:53
*/

'use strict';


$(document).ready(function() {
    $(".zm-item-answer").each(function(){
        var aid = $(this).data('aid');
        var vote_url = 'https://www.zhihu.com/answer/' +  aid + '/voters_profile'
        var voter_info = $(this).find('.zm-item-vote-info');
        var zero_user_cnt = 0;
        var fail_chance = 5;
        var index = 0;

        var per_page = 10;
        var percent = 100;
        voter_info.append('<span class="voters text progress">. 获取无效用户占中...</span>');
        var progress = $(voter_info).find('.progress');
        function check_zero_user_by_url(url) {
            function check_zero_user(data) {
                ++index;
                for (var id in data.payload) {
                    var voter = data.payload[id];
                    var a = $(voter).find("ul.status li span");
                    var zero_user = a.eq(0).text()[0] == '0' && a.eq(1).text()[0] == '0';
                    if (zero_user) {
                        zero_user_cnt++;
                    }
                }
            }

            $.getJSON(url, function(data) {
                check_zero_user(data);
                var progress_percent = Math.floor(index / Math.ceil(data.paging.total/per_page) * percent);
                progress.text('. 获取无效用户占中...进度' + progress_percent + '%');
                if (data.paging.next != "") {
                    check_zero_user_by_url(data.paging.next);
                } else {
                    console.log(voter_info);
                    progress.text('. 其中无效用户' + zero_user_cnt + '个，无效占比' + Math.floor(zero_user_cnt * 100 / data.paging.total) + '%');
                }
            }).fail(function() {
                if (--fail_chance > 0) {
                    console.log('retrying');
                    check_zero_user_by_url(url);
                } else {
                    progress.text('. 获取无效用户占比失败，新刷新重试');
                }
            });
        }
        check_zero_user_by_url(vote_url);

    });
});
