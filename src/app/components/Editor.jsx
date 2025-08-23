/**
@copyright    : Mak Tech Solution < https://www.maktechsolution.com >
@author       : Nayem Islam < https://github.com/Nayem707 >
@Updated_Date : 7/8/2025
**/

import { useEffect, useRef, useState } from 'react';

export default function MyEditor({ value, onChange }) {
  const editorRef = useRef();
  const [editorLoaded, setEditorLoaded] = useState(false);
  const { CKEditor, ClassicEditor } = editorRef.current || {};

  useEffect(() => {
    editorRef.current = {
      // CKEditor: require('@ckeditor/ckeditor5-react'), // depricated in v3
      CKEditor: require('@ckeditor/ckeditor5-react').CKEditor, // v3+
      ClassicEditor: require('@ckeditor/ckeditor5-build-classic'),
    };
    setEditorLoaded(true);
  }, []);

  return editorLoaded ? (
    <CKEditor
      editor={ClassicEditor}
      config={{
        toolbar: [
          'heading',
          '|',
          'bold',
          'italic',
          'blockQuote',
          'numberedList',
          'bulletedList',
          '|',
          'undo',
          'redo',
        ],
      }}
      data={value ?? ''}
      onInit={(editor) => {
        // You can store the "editor" and use when it is needed.
        console.log('Editor is ready to use!', editor);
      }}
      onChange={(event, editor) => {
        const data = editor.getData();
        onChange(data);
      }}
    />
  ) : (
    <div>Editor loading</div>
  );
}
