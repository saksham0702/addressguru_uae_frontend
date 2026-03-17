"use client";

import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "@/services/constants";

// ✅ Load TinyMCE only on client (IMPORTANT)
const Editor = dynamic(
  () => import("@tinymce/tinymce-react").then((mod) => mod.Editor),
  { ssr: false },
);

export default function TinyEditor({ value, onChange }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null; // ✅ prevents SSR error
  const API_KEY = "hmeo9m8jk6qe1koakdk1zhdhwccwe5jypb2h887ct52jmyn6";

  <Editor />;
  return (
    <Editor
      apiKey={API_KEY}
      tinymceScriptSrc={`https://cdn.tiny.cloud/1/${API_KEY}/tinymce/6/tinymce.min.js`}
      value={value}
      onEditorChange={(newContent) => onChange(newContent)}
      init={{
        height: 500,
        menubar: true,

        menubar: "file edit view insert format tools table help",

        plugins: [
          "advlist",
          "autolink",
          "lists",
          "link",
          "image",
          "media",
          "table",
          "codesample",
          "searchreplace",
          "visualblocks",
          "code",
          "fullscreen",
          "insertdatetime",
          "preview",
          "anchor",
          "help",
          "wordcount",
        ],

        toolbar:
          "undo redo | blocks | bold italic underline | " +
          "alignleft aligncenter alignright alignjustify | " +
          "bullist numlist outdent indent | link image media table | " +
          "codesample preview fullscreen",

        image_caption: true,
        paste_data_images: true,
        automatic_uploads: true,

        file_picker_types: "image media",

        // ✅ IMAGE UPLOAD HANDLER
        images_upload_handler: async (blobInfo) => {
          try {
            const formData = new FormData();
            formData.append("editorimage", blobInfo.blob());

            const res = await axios.post(
              `${API_URL}/admin/upload-editor-image`,
              formData,
              {
                headers: {
                  "Content-Type": "multipart/form-data",
                },
              },
            );

            return res.data.url; // must return URL
          } catch (err) {
            console.error(err);
            return "";
          }
        },
      }}
    />
  );
}
