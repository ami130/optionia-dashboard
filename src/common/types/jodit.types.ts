export interface JoditConfig {
  // Basic settings
  height: number;
  minHeight: number;
  maxHeight: number;
  placeholder: string;
  readonly: boolean;
  toolbar: boolean;
  toolbarButtonSize: "small" | "middle" | "large";

  // Toolbar configuration
  buttons: string[];
  toolbarAdaptive: boolean;

  // Behavior settings
  enter: "div" | "br" | "p";
  allowTabNavigation: boolean;
  saveSelectionOnBlur: boolean;
  preserveSelection: boolean;

  // UI settings
  showXPathInStatusbar: boolean;
  showCharsCounter: boolean;
  showWordsCounter: boolean;
  showPlaceholder: boolean;

  // Functionality
  useSearch: boolean;
  spellcheck: boolean;
  iframe: boolean;
  autofocus: boolean;
  direction: "ltr" | "rtl";

  // Performance
  disablePlugins: string[];

  // Styling
  style?: {
    [key: string]: string | number;
  };

  // Advanced features
  uploader?: {
    insertImageAsBase64URI: boolean;
  };
  link?: {
    noFollowCheckbox?: boolean;
    openInNewTabCheckbox?: boolean;
  };
  image?: {
    editSrc?: boolean;
    useImageEditor?: boolean;
  };
}
