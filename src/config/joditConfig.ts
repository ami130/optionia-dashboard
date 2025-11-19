export const defaultJoditConfig: any = {
  height: 500, // Fixed height to enable scrolling
  minHeight: 300,
  maxHeight: 500, // Same as height to enforce fixed height
  placeholder:
    "Write your amazing blog content here... Start with a captivating introduction!",
  readonly: false,
  toolbar: true,
  toolbarButtonSize: "middle",

  // Fixed toolbar buttons with proper list functionality
  buttons: [
    "bold",
    "italic",
    "underline",
    "strikethrough",
    "|",
    "ul",
    "ol",
    "|",
    "outdent",
    "indent",
    "|",
    "font",
    "fontsize",
    "brush",
    "paragraph",
    "|",
    "left",
    "center",
    "right",
    "justify",
    "|",
    "image",
    "video",
    "file",
    "|",
    "table",
    "|",
    "link",
    "|",
    "hr",
    "blockquote",
    "|",
    "source",
    "preview",
    "|",
    "cut",
    "copy",
    "paste",
    "copyformat",
    "|",
    "superscript",
    "subscript",
    "|",
    "symbols",
    "|",
    "undo",
    "redo",
    "|",
    "fullsize",
    "about",
    "find",
    "selectall",
    "print",
    "eraser",
  ],

  toolbarAdaptive: false,
  enter: "div",
  allowTabNavigation: true,
  saveSelectionOnBlur: true,
  preserveSelection: true,

  // UI elements
  showXPathInStatusbar: false,
  showCharsCounter: true,
  showWordsCounter: true,
  showPlaceholder: true,

  // Functionality
  useSearch: true,
  spellcheck: true,
  iframe: false,
  autofocus: false,
  direction: "ltr",

  // Performance optimization
  disablePlugins: ["mobile", "speechRecognize"],

  // Styling - FIX for bullet points
  style: {
    overflow: "auto", // enable scroll
    fontSize: "16px",
    lineHeight: "1.6",
    fontFamily: "Arial, sans-serif",
  },

  // List configuration for proper bullets
  list: {
    defaultWrapList: true,
  },

  // Upload configuration for WEBP support
  uploader: {
    insertImageAsBase64URI: true,
    imagesExtensions: ["jpg", "jpeg", "png", "gif", "webp", "bmp", "svg"],
    fileSize: 10485760, // 10MB
  },

  // Image processing configuration
  image: {
    editSrc: true,
    useImageEditor: true,
    openOnDblClick: true,
  },

  // Link configuration
  link: {
    noFollowCheckbox: true,
    openInNewTabCheckbox: true,
  },

  // NEW: Enable scrollable editor
  iframeStyle: `
    * {
      box-sizing: border-box;
    }
    .jodit-wysiwyg {
      max-height: 400px !important;
      overflow-y: auto !important;
      padding: 10px;
    }
  `,
};

export const faqJoditConfig: any = {
  height: 200,
  minHeight: 150,
  maxHeight: 200,
  placeholder: "Write your answer here...",
  readonly: false,
  toolbar: true,
  toolbarButtonSize: "small",
  buttons: [
    "bold",
    "italic",
    "underline",
    "|",
    "ul",
    "ol",
    "|",
    "outdent",
    "indent",
    "|",
    "font",
    "fontsize",
    "brush",
    "paragraph",
    "|",
    "left",
    "center",
    "right",
    "justify",
    "|",
    "link",
    "|",
    "hr",
    "blockquote",
    "|",
    "cut",
    "copy",
    "paste",
  ],
  toolbarAdaptive: false,
  enter: "div",
  allowTabNavigation: true,
  saveSelectionOnBlur: true,
  preserveSelection: true,
  showXPathInStatusbar: false,
  showCharsCounter: true,
  showWordsCounter: true,
  showPlaceholder: true,
  useSearch: true,
  spellcheck: true,
  iframe: false,
  autofocus: false,
  direction: "ltr",
  disablePlugins: ["mobile", "speechRecognize"],
  style: {
    fontSize: "14px",
    lineHeight: "1.5",
    fontFamily: "Arial, sans-serif",
  },
  uploader: {
    insertImageAsBase64URI: true,
  },
  link: {
    noFollowCheckbox: true,
    openInNewTabCheckbox: true,
  },
  image: {
    editSrc: true,
    useImageEditor: true,
  },
  // NEW: Enable scrollable editor for FAQ
  iframeStyle: `
    .jodit-wysiwyg {
      max-height: 150px !important;
      overflow-y: auto !important;
      padding: 8px;
    }
  `,
};

// import { JoditConfig } from "../common/types/jodit.types";

// export const defaultJoditConfig: any = {
//   height: 600,
//   minHeight: 400,
//   maxHeight: 800,
//   placeholder:
//     "Write your amazing blog content here... Start with a captivating introduction!",
//   readonly: false,
//   toolbar: true,
//   toolbarButtonSize: "middle",

//   // Fixed toolbar buttons with proper list functionality
//   buttons: [
//     "bold",
//     "italic",
//     "underline",
//     "strikethrough",
//     "|",
//     "ul",
//     "ol",
//     "|",
//     "outdent",
//     "indent",
//     "|",
//     "font",
//     "fontsize",
//     "brush",
//     "paragraph",
//     "|",
//     "left",
//     "center",
//     "right",
//     "justify",
//     "|",
//     "image",
//     "video",
//     "file",
//     "|",
//     "table",
//     "|",
//     "link",
//     "|",
//     "hr",
//     "blockquote",
//     "|",
//     "source",
//     "preview",
//     "|",
//     "cut",
//     "copy",
//     "paste",
//     "copyformat",
//     "|",
//     "superscript",
//     "subscript",
//     "|",
//     "symbols",
//     "|",
//     "undo",
//     "redo",
//     "|",
//     "fullsize",
//     "about",
//     "find",
//     "selectall",
//     "print",
//     "eraser",
//   ],

//   toolbarAdaptive: false,
//   enter: "div",
//   allowTabNavigation: true,
//   saveSelectionOnBlur: true,
//   preserveSelection: true,

//   // UI elements
//   showXPathInStatusbar: false,
//   showCharsCounter: true,
//   showWordsCounter: true,
//   showPlaceholder: true,

//   // Functionality
//   useSearch: true,
//   spellcheck: true,
//   iframe: false,
//   autofocus: false,
//   direction: "ltr",

//   // Performance optimization
//   disablePlugins: ["mobile", "speechRecognize"],

//   // Styling - FIX for bullet points
//   style: {
//     fontSize: "16px",
//     lineHeight: "1.6",
//     fontFamily: "Arial, sans-serif",
//   },

//   // List configuration for proper bullets
//   list: {
//     defaultWrapList: true,
//   },

//   // Upload configuration for WEBP support
//   uploader: {
//     insertImageAsBase64URI: true,
//     imagesExtensions: ["jpg", "jpeg", "png", "gif", "webp", "bmp", "svg"],
//     fileSize: 10485760, // 10MB
//   },

//   // Image processing configuration
//   image: {
//     editSrc: true,
//     useImageEditor: true,
//     openOnDblClick: true,
//   },

//   // Link configuration
//   link: {
//     noFollowCheckbox: true,
//     openInNewTabCheckbox: true,
//   },
// };

// // export const defaultJoditConfig: JoditConfig = {
// //   height: 600,
// //   minHeight: 400,
// //   maxHeight: 800,
// //   placeholder:
// //     "Write your amazing blog content here... Start with a captivating introduction!",
// //   readonly: false,
// //   toolbar: true,
// //   toolbarButtonSize: "middle",
// //   buttons: [
// //     "bold",
// //     "italic",
// //     "underline",
// //     "strikethrough",
// //     "|",
// //     "ul",
// //     "ol",
// //     "|",
// //     "outdent",
// //     "indent",
// //     "|",
// //     "font",
// //     "fontsize",
// //     "brush",
// //     "paragraph",
// //     "|",
// //     "left",
// //     "center",
// //     "right",
// //     "justify",
// //     "|",
// //     "image",
// //     "video",
// //     "file",
// //     "|",
// //     "table",
// //     "|",
// //     "link",
// //     "|",
// //     "hr",
// //     "blockquote",
// //     "|",
// //     "source",
// //     "preview",
// //     "|",
// //     "cut",
// //     "copy",
// //     "paste",
// //     "copyformat",
// //     "|",
// //     "superscript",
// //     "subscript",
// //     "|",
// //     "symbols",
// //     "|",
// //     "undo",
// //     "redo",
// //     "|",
// //     "fullsize",
// //     "about",
// //     "find",
// //     "selectall",
// //     "print",
// //     "eraser",
// //   ],
// //   toolbarAdaptive: false,
// //   enter: "div",
// //   allowTabNavigation: true,
// //   saveSelectionOnBlur: true,
// //   preserveSelection: true,
// //   showXPathInStatusbar: false,
// //   showCharsCounter: true,
// //   showWordsCounter: true,
// //   showPlaceholder: true,
// //   useSearch: true,
// //   spellcheck: true,
// //   iframe: false,
// //   autofocus: false,
// //   direction: "ltr",
// //   disablePlugins: ["mobile", "speechRecognize"],
// //   style: {
// //     fontSize: "16px",
// //     lineHeight: "1.6",
// //     fontFamily: "Arial, sans-serif",
// //   },
// //   uploader: {
// //     insertImageAsBase64URI: true,
// //   },
// //   link: {
// //     noFollowCheckbox: true,
// //     openInNewTabCheckbox: true,
// //   },
// //   image: {
// //     editSrc: true,
// //     useImageEditor: true,
// //   },
// // };

// export const faqJoditConfig: JoditConfig = {
//   height: 300,
//   minHeight: 200,
//   maxHeight: 200,
//   placeholder:
//     "Write your amazing blog content here... Start with a captivating introduction!",
//   readonly: false,
//   toolbar: true,
//   toolbarButtonSize: "middle",
//   buttons: [
//     "bold",
//     "italic",
//     "underline",
//     "|",
//     "outdent",
//     "indent",
//     "|",
//     "font",
//     "fontsize",
//     "brush",
//     "paragraph",
//     "|",
//     "left",
//     "center",
//     "right",
//     "justify",
//     "|",

//     "|",
//     "link",
//     "|",
//     "hr",
//     "blockquote",

//     "|",
//     "cut",
//     "copy",
//     "paste",
//   ],
//   toolbarAdaptive: false,
//   enter: "div",
//   allowTabNavigation: true,
//   saveSelectionOnBlur: true,
//   preserveSelection: true,
//   showXPathInStatusbar: false,
//   showCharsCounter: true,
//   showWordsCounter: true,
//   showPlaceholder: true,
//   useSearch: true,
//   spellcheck: true,
//   iframe: false,
//   autofocus: false,
//   direction: "ltr",
//   disablePlugins: ["mobile", "speechRecognize"],
//   style: {
//     fontSize: "16px",
//     lineHeight: "1.6",
//     fontFamily: "Arial, sans-serif",
//   },
//   uploader: {
//     insertImageAsBase64URI: true,
//   },
//   link: {
//     noFollowCheckbox: true,
//     openInNewTabCheckbox: true,
//   },
//   image: {
//     editSrc: true,
//     useImageEditor: true,
//   },
// };
