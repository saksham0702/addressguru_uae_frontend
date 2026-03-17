"use client";

import React, { useMemo, useRef } from "react";
import dynamic from "next/dynamic";

// IMPORTANT: dynamic import to avoid SSR crash
const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

export default function TiptapEditor({ value, onChange }) {
  const editorRef = useRef(null);

  const config = useMemo(
    () => ({
      readonly: false,
      height: 350,

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
        "paragraph", // ✅ H1, H2, H3, P
        "lineHeight", // ✅ Line height control
        "|",
        "font",
        "fontsize",
        "brush",
        "|",
        "align",
        "|",
        "image",
        "table",
        "link",
        "|",
        "undo",
        "redo",
        "|",
        "hr",
        "eraser",
        "copyformat",
        "|",
        "preview",
      ],

      controls: {
        paragraph: {
          list: {
            p: "Paragraph",
            h1: "Heading 1",
            h2: "Heading 2",
            h3: "Heading 3",
            h4: "Heading 4",
            blockquote: "Blockquote",
            pre: "Code Block",
          },
        },
        lineHeight: {
          list: {
            1: "1",
            1.2: "1.2",
            1.4: "1.4",
            1.6: "1.6",
            1.8: "1.8",
            2: "2",
          },
        },
      },

      placeholder: "Start typing content here...",

      cleanHTML: {
        fillEmptyParagraph: false,
        removeEmptyElements: true,
      },

      askBeforePasteHTML: false,
      askBeforePasteFromWord: false,
      defaultActionOnPaste: "insert_clear_html",

      showXPathInStatusbar: false,
      showCharsCounter: false,
      showWordsCounter: false,
      showStatusbar: false,
    }),
    [],
  );

  return (
    <div className="w-full">
      <JoditEditor
        ref={editorRef}
        value={value || ""}
        config={config}
        onBlur={(newContent) => onChange(newContent)} // ✅ Better performance than onChange
      />
    </div>
  );
}
