/*global $, dotclear, jsToolBar, getData */
'use strict';

// Get context
Object.assign(dotclear, getData('legacy_editor_ctx'));

$(function() {
  if ($('#edit-entry').length == 0) {
    return;
  }

  if (dotclear.legacy_editor_context === undefined ||
    dotclear.legacy_editor_tags_context[dotclear.legacy_editor_context] === undefined) {
    return;
  }

  // To be reviewed!
  let formatField;
  let excerptTb;
  let contentTb;

  if ((dotclear.legacy_editor_tags_context[dotclear.legacy_editor_context].indexOf('#post_content') !== -1) &&
    (dotclear.legacy_editor_tags_context[dotclear.legacy_editor_context].indexOf('#post_excerpt') !== -1)) {
    // Get document format and prepare toolbars
    formatField = $('#post_format').get(0);
    let last_post_format = $(formatField).val();
    $(formatField).on('change', function() {
      if (this.value != 'dcLegacyEditor') {
        return;
      }

      const post_format = this.value;

      // Confirm post format change
      if (window.confirm(dotclear.msg.confirm_change_post_format_noconvert)) {
        excerptTb.switchMode(post_format);
        contentTb.switchMode(post_format);
        last_post_format = $(this).val();
      } else {
        // Restore last format if change cancelled
        $(this).val(last_post_format);
      }

      $('.format_control > *').addClass('hide');
      $('.format_control:not(.control_no_' + post_format + ') > *').removeClass('hide');
    });

    excerptTb = new jsToolBar(document.getElementById('post_excerpt'));
    contentTb = new jsToolBar(document.getElementById('post_content'));
    excerptTb.context = contentTb.context = 'post';

    $('.format_control > *').addClass('hide');
    $('.format_control:not(.control_no_' + last_post_format + ') > *').removeClass('hide');
  }

  if (dotclear.legacy_editor_tags_context[dotclear.legacy_editor_context].indexOf('#comment_content') !== -1) {
    if ($('#comment_content').length > 0) {
      let commentTb = new jsToolBar(document.getElementById('comment_content'));
      commentTb.draw('xhtml');
    }
  }

  $('#comments').on('onetabload', function() {
    // Remove required attribut from #comment_content as textarea might be not more focusable
    if (dotclear.legacy_editor_tags_context[dotclear.legacy_editor_context].indexOf('#comment_content') !== -1) {
      $('#comment_content').removeAttr('required');
    }
  });

  $('#edit-entry').on('onetabload', function() {

    // Remove required attribut from #post_content in XHTML mode as textarea is not more focusable
    if (formatField !== undefined && formatField.value == 'xhtml') {
      if (dotclear.legacy_editor_tags_context[dotclear.legacy_editor_context].indexOf('#post_content') !== -1) {
        $('#post_content').removeAttr('required');
      }
    }

    // Load toolbars
    if (contentTb !== undefined && excerptTb !== undefined) {
      contentTb.switchMode(formatField.value);
      excerptTb.switchMode(formatField.value);
    }

    // Check unsaved changes before XHTML conversion
    const excerpt = $('#post_excerpt').val();
    const content = $('#post_content').val();
    $('#convert-xhtml').on('click', function() {
      if (excerpt != $('#post_excerpt').val() || content != $('#post_content').val()) {
        return window.confirm(dotclear.msg.confirm_change_post_format);
      }
    });
  });
});
