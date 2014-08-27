(function() {
	CKEDITOR.plugins.add('dclink', {
		icons: 'dclink',
		init: function(editor) {
			editor.addCommand('dcLinkCommand', {
				exec: function(editor) {
					if (editor.getSelection().getNative().toString().replace(/\s*/,'')!='') {
						$.toolbarPopup('popup_link.php?editor='+editor.name);
					}
				}
			});

			editor.ui.addButton('dcLink', {
				label: 'Link',
				command: 'dcLinkCommand',
				toolbar: 'insert'
			});
			
			editor.on('doubleclick',function(e) {
				var element = CKEDITOR.plugins.link.getSelectedLink(editor) || e.data.element;
				if (!element.isReadOnly()) {
					if (element.is('a') 
					    && !element.hasClass('media-link') // link to original media @see js/popup_media.js
					    && !element.hasClass('post')) {    // link to an entry @see js/popup_posts.js

						editor.getSelection().selectElement(element);

						var popup_url = 'popup_link.php?editor='+editor.name;
						if (element.getAttribute('href')) {
							popup_url += '&href='+element.getAttribute('href');
						}
						if (element.getAttribute('hreflang')) {
							popup_url += '&hreflang='+element.getAttribute('hreflang');
						}
						if (element.getAttribute('title')) {
							popup_url += '&title='+element.getAttribute('title');
						}

						$.toolbarPopup(popup_url);
						return false;
					} 
				}
			});
		}
	});
})();