const toolbar = {
  'moreText': {
    'buttons': ['bold', 'italic', 'underline', 'strikeThrough', 'subscript', 'superscript', 'fontFamily', 'fontSize',
      // 'textColor',
      // 'backgroundColor',
      'clearFormatting']
  },
  "my": {
    'buttons': ['highlight', 'insertHR'],
    'buttons2': ['highlight', "qa_line"],
  },
  "my2": {
    'buttons': ["paragraphFormat"],
  },
  'moreParagraph': {
    'buttons': [
      'alignLeft', 'alignCenter', 'alignRight',
      // 'paragraphStyle',
      // 'outdent', 'indent',
      // 'quote'
    ],
    // 'buttonsVisible': 2
  },
  'moreRich': {
    'buttons': [
      'insertTable',
      'insertImage',
      'insertLink',
      // 'insertVideo',
      // 'embedly',
      // 'insertFile'
    ],
    // 'buttonsVisible': 2
  },
  'moreMisc': {
    'buttons': ['undo', 'redo', 'html',
      // 'fullscreen', 'print', 'getPDF', 'spellChecker', 'help'
    ],
    'align': 'right',
    'buttonsVisible': 3
  }
}
export default {
  toolbar
}
